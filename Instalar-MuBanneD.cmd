@echo off
powershell.exe -NoProfile -NonInteractive -File "%~dp0Integracao\Instalar-Atalho.ps1"
exit /b %errorlevel%
