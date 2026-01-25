@echo off

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Docker is not running. Starting application with npm...
    npm run start
    exit /b %ERRORLEVEL%
)

echo Building Docker image...
docker build -t copilot-collaginator .

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    exit /b %ERRORLEVEL%
)

echo Starting container...
docker run -p 3000:3000 -v "%cd%/data:/app/data" copilot-collaginator
