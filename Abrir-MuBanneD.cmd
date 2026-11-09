@echo off
powershell.exe -NoProfile -File "%~dp0Integracao\Abrir-Jogo.ps1" %*
if errorlevel 1 (
  pause
  exit /b 1
)
