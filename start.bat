@echo off
echo Building Docker image...
docker build -t copilot-collaginator .

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    exit /b %ERRORLEVEL%
)

echo Starting container...
docker run -p 3000:3000 copilot-collaginator
