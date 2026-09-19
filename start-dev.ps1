# Porto Website 2 - PowerShell Dev Server Launcher
$nodePath = Join-Path $PSScriptRoot "node_env\node-v20.18.0-win-x64"
$env:PATH = "$nodePath;$env:PATH"
Set-Location $PSScriptRoot
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting Vite Dev Server at http://localhost:5173..." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
npm run dev
