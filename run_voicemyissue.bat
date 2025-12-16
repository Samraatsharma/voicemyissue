
@echo off
setlocal
title VoiceMyIssue - Setup & Run

echo ===============================================================================
echo   VoiceMyIssue - AI Grievance Assistant
echo ===============================================================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed.
    echo Please install Node.js from https://nodejs.org/
    echo After installing, run this script again.
    pause
    exit /b
)

echo [OK] Node.js is detected.

REM Check if node_modules exists
if not exist "node_modules" (
    echo.
    echo [INFO] Installing dependencies... This may take a few minutes.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b
    )
) else (
    echo [INFO] Dependencies already installed.
)

echo.
echo [INFO] Starting VoiceMyIssue Development Server...
echo [INFO] The browser will open shortly at http://localhost:3000
echo.

REM Start the browser in a separate process after a 5s delay
start "" /b cmd /c "timeout /t 5 >nul & start http://localhost:3000"

REM Start the server
call npm run dev
