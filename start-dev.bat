@echo off
title Porto Website 2 - Dev Server
echo ===================================================
echo Starting Porto Website 2 Dev Server...
echo ===================================================

set "PATH=%~dp0node_env\node-v20.18.0-win-x64;%PATH%"

cd /d "%~dp0"
npm run dev

pause
