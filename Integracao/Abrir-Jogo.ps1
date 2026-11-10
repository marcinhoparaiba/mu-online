param([switch]$SomenteServidor, [ValidateSet('','Janela','SemBorda','Cheia')][string]$Modo = '')

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$server = Join-Path $root '1 - MuServer 97d+5.2 Aprendizmuonline'
$client = Join-Path $root '2 - Cliente'
$game = Join-Path $client 'mu.exe'
$parts = @(
    @{ File = 'ConnectServer\ConnectServer.exe'; Port = 44405 },
    @{ File = 'DataServer\DataServer.exe'; Port = 55962 },
    @{ File = 'JoinServer\JoinServer.exe'; Port = 55972 },
    @{ File = 'Salas\SalaTrade\GameServer\GameServer-Upar.exe'; Port = 55940 },
    @{ File = 'Salas\SalaUpar\GameServer\GameServer-Trade.exe'; Port = 55920 }
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
    if (-not $SomenteServidor) {
        # Janela sem borda do tamanho do monitor (1px deslocada, mesmo tamanho: assim o Windows consegue capturar a imagem OpenGL) (sem tela cheia exclusiva: sem tela preta, print funciona)
        $cfg = 'HKCU:\Software\Webzen\Mu\Config'
        $res = @{ '800x600'=1; '1024x768'=2; '1280x960'=3; '1360x768'=4; '1366x768'=4; '1440x900'=5; '1600x900'=6; '1680x1050'=7; '1920x1080'=8 }
        Add-Type -AssemblyName System.Windows.Forms
        $tela = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
        $idx = 6  # janela 1600x900 (janela maior que a tela fecha o jogo); o atalho estica sem borda
        # Escolha do modo de tela (lembra a ultima escolha)
        $pref = 'HKCU:\Software\MuBanneD'
        if (-not $Modo) {
            $ultimo = (Get-ItemProperty $pref -Name Modo -ErrorAction SilentlyContinue).Modo; if (-not $ultimo) { $ultimo = 'SemBorda' }
            $f = New-Object System.Windows.Forms.Form; $f.Text = 'MuBanneD - Modo de tela'; $f.Size = '360,190'; $f.StartPosition = 'CenterScreen'; $f.TopMost = $true; $f.FormBorderStyle = 'FixedDialog'; $f.MaximizeBox = $false
            $y = 15
            foreach ($op in @(@('SemBorda','Tela inteira sem borda (recomendado, print funciona)'), @('Cheia','Tela cheia exclusiva (print sai preto)'), @('Janela','Modo janela 1600x900'))) {
                $b = New-Object System.Windows.Forms.Button; $b.Text = $op[1]; $b.Tag = $op[0]; $b.Size = '320,35'; $b.Location = "10,$y"; $y += 42
                if ($op[0] -eq $ultimo) { $b.Font = New-Object System.Drawing.Font($b.Font, [System.Drawing.FontStyle]::Bold) }
                $b.Add_Click({ $script:Modo = $this.Tag; $f.Close() }); $f.Controls.Add($b)
            }
            $f.ShowDialog() | Out-Null
            if (-not $Modo) { return }
        }
        if (-not (Test-Path $pref)) { New-Item $pref -Force | Out-Null }; Set-ItemProperty $pref Modo $Modo
        if ($Modo -eq 'Cheia') { Set-ItemProperty $cfg WindowMode 0; Set-ItemProperty $cfg Resolution $res["$($tela.Width)x$($tela.Height)"] }
        else { Set-ItemProperty $cfg WindowMode 1; Set-ItemProperty $cfg Resolution $idx }
        $mu = Start-Process -FilePath $game -WorkingDirectory $client -PassThru
        Start-Process powershell -WindowStyle Hidden -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File',('"' + (Join-Path $PSScriptRoot 'print-helper.ps1') + '"'),$mu.Id,('"' + (Join-Path $client 'ScreenShots') + '"')
        Add-Type 'using System;using System.Runtime.InteropServices;public class MuJan{[DllImport("user32.dll")]public static extern int GetWindowLong(IntPtr h,int i);[DllImport("user32.dll")]public static extern int SetWindowLong(IntPtr h,int i,int v);[DllImport("user32.dll")]public static extern bool SetWindowPos(IntPtr h,IntPtr a,int x,int y,int w,int c,uint f);[DllImport("user32.dll")]public static extern bool SetForegroundWindow(IntPtr h);}'
        for ($k = 0; $k -lt 60 -and -not $mu.HasExited; $k++) {
            Start-Sleep -Milliseconds 500; $mu.Refresh(); $h = $mu.MainWindowHandle
            if ($mu.HasExited -or $h -eq [IntPtr]::Zero) { continue }
            $s = [MuJan]::GetWindowLong($h, -16)
            if ($Modo -ne 'SemBorda') { break }
            if ($s -band 0x00C00000) {
                [MuJan]::SetWindowLong($h, -16, ($s -band (-bnot 0x00CF0000))) | Out-Null
                [MuJan]::SetWindowPos($h, [IntPtr](-1), $tela.X, ($tela.Y + 1), $tela.Width, $tela.Height, 0x0060) | Out-Null
                [MuJan]::SetForegroundWindow($h) | Out-Null
            }
        }
    }
} finally {
    if ($ownsMutex) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}
