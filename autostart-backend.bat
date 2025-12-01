@echo off
REM PISIFM Backend Auto-Start Script
REM Script ini akan dijalankan otomatis saat Windows boot via Task Scheduler

cd /d C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe

REM Log start time
echo [%date% %time%] Starting PISIFM Backend... >> C:\Users\netcom\Documents\ifm_septian\project\PISIFM\backend-autostart.log

REM Start backend
node dist\server.js >> C:\Users\netcom\Documents\ifm_septian\project\PISIFM\backend-autostart.log 2>&1
