@echo off
REM ===========================================
REM PISIFM Backend Startup Script (Background)
REM ===========================================

echo Starting PISIFM Backend in background...

cd C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Build TypeScript files
echo Building TypeScript...
call npm run build

REM Start server in new window (minimized)
echo Starting server on port 2000...
start /min "PISIFM Backend" cmd /c "node dist/server.js"

echo Backend started in background window.
echo Check "PISIFM Backend" window if needed.
timeout /t 3
