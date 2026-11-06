# Creates a local client shortcut; does not execute the game.
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)]
    [string]$ClientPath,
    [ValidateRange(1,65535)]
    [int]$Port = 44405
)
$ErrorActionPreference = 'Stop'
$client = (Resolve-Path -LiteralPath $ClientPath).Path
$main = Join-Path $client 'Main.exe'
if (-not (Test-Path -LiteralPath $main -PathType Leaf)) {
    throw 'Main.exe was not found in the supplied client folder.'
}
$linkPath = Join-Path $client 'MU-Banned-Local.lnk'
if (Test-Path -LiteralPath $linkPath) {
    throw 'MU-Banned-Local.lnk already exists; preserve or rename it before retrying.'
}
$shell = New-Object -ComObject WScript.Shell
$link = $shell.CreateShortcut($linkPath)
$link.TargetPath = $main
$link.Arguments = '/u127.0.0.1 /p' + $Port
$link.WorkingDirectory = $client
$link.Description = 'MU Banned local client - server on this PC'
$link.Save()
Write-Host ('Shortcut created: ' + $linkPath)
Write-Host 'The game was not started. Port must match the actual ConnectServer.'
