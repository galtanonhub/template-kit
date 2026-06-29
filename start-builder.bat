@echo off
REM ============================================================
REM  Template Kit — start the builder (with the New-skin API)
REM  Double-click this file, then open:  http://localhost:8093/demo/
REM ============================================================
cd /d "%~dp0"
echo Starting Template Kit builder on http://localhost:8093/demo/
echo (Leave this window open. Close it to stop the server.)
start "" http://localhost:8093/demo/
node scaffold/dev-server.js
pause
