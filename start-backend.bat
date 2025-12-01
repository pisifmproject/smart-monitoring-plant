@echo off
REM Start PISIFM Backend
REM Script batch untuk menjalankan backend PISIFM

echo Starting PISIFM Backend...
cd /d C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe

echo Running backend on port 2000...
node dist\server.js

pause
