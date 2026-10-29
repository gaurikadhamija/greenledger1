@echo off
title GreenLedger - Evidence-Backed Sustainability Intelligence
echo ========================================================
echo Launching GreenLedger Offline Complete Website...
echo ========================================================
if exist "%~dp0launch-app.html" (
  start "" "%~dp0launch-app.html"
) else if exist "%~dp0dist\index.html" (
  start "" "%~dp0dist\index.html"
) else (
  start "" "%~dp0index.html"
)
exit
