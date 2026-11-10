param([switch]$SomenteServidor)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$server = Join-Path $root '1 - MuServer 97d+5.2 Aprendizmuonline'
$client = Join-Path $root '2 - Cliente'
$game = Join-Path $client 'mu.exe'
$parts = @(
    @{ File = 'ConnectServer\ConnectServer.exe'; Port = 44405 },
    @{ File = 'DataServer\DataServer.exe'; Port = 55962 },
    @{ File = 'JoinServer\JoinServer.exe'; Port = 55972 },
    @{ File = 'Salas\SalaTrade\GameServer\GameServer-Upar.exe'; Port = 55940 }
)

function Get-ListenerOwner([int]$port) {
    Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique
}

$mutex = [Threading.Mutex]::new($false, 'Local\MuBanneD52-Launcher')
$ownsMutex = $false
try {
    try { $ownsMutex = $mutex.WaitOne(0) }
    catch [Threading.AbandonedMutexException] { $ownsMutex = $true }
    if (-not $ownsMutex) { throw 'O MuBanneD ja esta sendo iniciado.' }

    foreach ($path in @($game) + @($parts | ForEach-Object { Join-Path $server $_.File })) {
        if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { throw "Arquivo ausente: $path" }
    }
    if (-not (Get-OdbcDsn -Name 'MuBanneD52Integrado' -Platform '32-bit' -ErrorAction SilentlyContinue)) {
        throw 'Configure o DSN MuBanneD52Integrado conforme o LEIA-PRIMEIRO.md.'
    }
    $sql = Get-Service -Name 'MSSQL$MUBANNEDTEST'
    if ($sql.Status -ne 'Running') {
        $script = '$ErrorActionPreference = "Stop"; Start-Service -Name ''MSSQL$MUBANNEDTEST'''
        $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($script))
        $process = Start-Process -FilePath (Join-Path $PSHOME 'powershell.exe') -ArgumentList '-NoProfile','-EncodedCommand',$encoded -Verb RunAs -WindowStyle Hidden -Wait -PassThru
        if ($process.ExitCode -ne 0) { throw 'Falha ao iniciar o SQL Server.' }
        $sql.WaitForStatus('Running', [TimeSpan]::FromSeconds(20))
    }

    $ip = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up' } | Select-Object -First 1).IPv4Address.IPAddress
    if ($ip) {
        $mudou = & python -I (Join-Path $PSScriptRoot 'ajustar_ip.py') $ip
        if ($mudou -eq 'mudou') { Get-Process ConnectServer -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep 1 }
    }

    foreach ($part in $parts) {
        $path = Join-Path $server $part.File
        $owners = @(Get-ListenerOwner $part.Port)
        if ($owners.Count -gt 0) {
            $processes = @($owners | ForEach-Object { Get-Process -Id $_ -ErrorAction Stop })
            if (@($processes | Where-Object Path -ne $path).Count -gt 0) {
                throw "A porta $($part.Port) esta ocupada por outro programa."
            }
            continue
        }

        $process = Start-Process -FilePath $path -WorkingDirectory (Split-Path -Parent $path) -WindowStyle Hidden -PassThru
        $limit = [DateTime]::UtcNow.AddSeconds(30)
        do {
            Start-Sleep -Milliseconds 500
            if ($process.HasExited) { throw "O processo $($part.File) encerrou ao iniciar." }
            $owners = @(Get-ListenerOwner $part.Port)
        } while ($owners.Count -eq 0 -and [DateTime]::UtcNow -lt $limit)
        if ($owners -notcontains $process.Id) { throw "O processo $($part.File) nao abriu a porta $($part.Port)." }
    }
    if (-not $SomenteServidor) { Start-Process -FilePath $game -WorkingDirectory $client }
} finally {
    if ($ownsMutex) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}
