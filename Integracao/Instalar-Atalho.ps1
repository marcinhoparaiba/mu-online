$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root 'Abrir-MuBanneD.cmd'
$icon = Join-Path $root '2 - Cliente\mu.exe'
if (-not (Test-Path -LiteralPath $target -PathType Leaf) -or
    -not (Test-Path -LiteralPath $icon -PathType Leaf)) {
    throw 'Execute o instalador na pasta do MuBanneD.'
}

$desktop = [Environment]::GetFolderPath('DesktopDirectory')
if (-not $desktop -or -not (Test-Path -LiteralPath $desktop -PathType Container)) {
    throw 'Area de Trabalho nao encontrada.'
}

$path = Join-Path $desktop 'MuBanneD 5.2.lnk'
$shell = New-Object -ComObject WScript.Shell
$link = $shell.CreateShortcut($path)
if ((Test-Path -LiteralPath $path) -and $link.TargetPath -ne $target) {
    throw 'Ja existe um atalho MuBanneD 5.2 apontando para outra pasta.'
}
$link.TargetPath = $target
$link.WorkingDirectory = $root
$link.IconLocation = "$icon,0"
$link.Description = 'MuBanneD 5.2 - cliente local'
$link.Save()
Write-Output 'Atalho MuBanneD 5.2 criado na Area de Trabalho.'
