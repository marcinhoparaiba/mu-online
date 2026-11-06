# Configure only the client for a GameServer on the same Windows PC.
# Does not start executables, change services, firewall or SQL.
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)]
    [string]$ClientPath
)
$ErrorActionPreference = 'Stop'
$client = (Resolve-Path -LiteralPath $ClientPath).Path
$iniPath = Join-Path $client 'MainLab.ini'
$labPath = Join-Path $client 'main.lab'
if (-not (Test-Path -LiteralPath $iniPath -PathType Leaf)) {
    throw 'MainLab.ini was not found in the client folder.'
}
$ini = [System.IO.File]::ReadAllText($iniPath)
$serialMatch = [regex]::Match($ini, '(?m)^ClientSerial[ \t]*=[ \t]*([^\r\n \t]+)')
$hostMatches = [regex]::Matches($ini, '(?m)^IPaddress[ \t]*=[ \t]*[^\r\n \t]+')
if (-not $serialMatch.Success -or $hostMatches.Count -ne 1) {
    throw 'Expected ClientSerial and exactly one IPaddress setting.'
}
$serial = $serialMatch.Groups[1].Value
if ($serial.Length -ne 16 -or $serial -cmatch '[^\x21-\x7E]') {
    throw 'ClientSerial must contain exactly 16 printable ASCII characters.'
}
$newIni = [regex]::Replace($ini, '(?m)^(IPaddress[ \t]*=[ \t]*)[^\r\n \t]+', '${1}127.0.0.1')
[byte[]]$plain = New-Object byte[] 49
[System.Text.Encoding]::ASCII.GetBytes('127.0.0.1').CopyTo($plain, 0)
[System.Text.Encoding]::ASCII.GetBytes($serial).CopyTo($plain, 32)
[byte[]]$encoded = New-Object byte[] 49
for ($i = 0; $i -lt 49; $i++) {
    $encoded[$i] = (($plain[$i] -bxor (0xfd -bxor $i)) - 0xb7) -band 0xff
    $decoded = (($encoded[$i] + 0xb7) -band 0xff) -bxor (0xfd -bxor $i)
    if ($decoded -ne $plain[$i]) { throw 'Configuration verification failed.' }
}
$backup = Join-Path $client ('config-backup-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $backup | Out-Null
Copy-Item -LiteralPath $iniPath -Destination $backup
$hadLab = Test-Path -LiteralPath $labPath -PathType Leaf
if ($hadLab) { Copy-Item -LiteralPath $labPath -Destination $backup }
try {
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($iniPath, $newIni, $utf8)
    [System.IO.File]::WriteAllBytes($labPath, $encoded)
    $readback = [System.IO.File]::ReadAllBytes($labPath)
    if ([Convert]::ToBase64String($readback) -cne [Convert]::ToBase64String($encoded)) {
        throw 'Written LAB differs from prepared configuration.'
    }
} catch {
    Copy-Item -LiteralPath (Join-Path $backup 'MainLab.ini') -Destination $iniPath -Force
    if ($hadLab) {
        Copy-Item -LiteralPath (Join-Path $backup 'main.lab') -Destination $labPath -Force
    } elseif (Test-Path -LiteralPath $labPath) {
        Remove-Item -LiteralPath $labPath
    }
    throw
}
Write-Host 'Client configured for 127.0.0.1. INI and LAB now match.'
Write-Host ('Original configuration backed up in: ' + $backup)
if ($serial -eq ('.' * 16)) {
    Write-Warning 'The received serial is still a placeholder. Server compatibility is NOT configured.'
}
Write-Host 'No game executable, server, SQL or firewall was started or changed.'
