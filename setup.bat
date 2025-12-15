@echo off
echo ================================
echo Career Compass Setup Script
echo ================================
echo.

REM Check Python installation
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

REM Check Node.js installation
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from nodejs.org
    pause
    exit /b 1
)

echo [1/4] Setting up Backend...
cd backend

REM Create virtual environment
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit backend\.env and add your OpenAI API key!
    echo.
)

cd ..

echo.
echo [2/4] Setting up Frontend...
cd frontend

REM Install npm dependencies
echo Installing Node.js dependencies...
call npm install

cd ..

echo.
echo ================================
echo Setup Complete! 
echo ================================
echo.
echo NEXT STEPS:
echo.
echo 1. Add your OpenAI API key to backend\.env
echo    OPENAI_API_KEY=sk-your-key-here
echo.
echo 2. Start the backend:
echo    cd backend
echo    python main.py
echo.
echo 3. In a new terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo ================================
pause
