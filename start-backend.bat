@echo off
REM ===========================================
REM PISIFM Backend Startup Script
REM ===========================================

echo Starting PISIFM Backend...

cd C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Build TypeScript files
echo Building TypeScript...
call npm run build

REM Start server
echo Starting server on port 2000...
node dist/server.js

pause
