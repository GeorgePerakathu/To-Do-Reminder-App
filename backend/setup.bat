REM filepath: /D:/Github projects/To-Do-Reminder-App/setup.bat
@echo off
echo Setting up To-Do-Reminder-App...

cd backend

REM Create Python virtual environment
echo Creating Python virtual environment...
python -m venv .venv

REM Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate

REM Install dependencies
echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir

REM Return to root directory
cd ..

echo Backend setup complete!
echo.
echo To activate the virtual environment:
echo cd backend
echo .venv\Scripts\activate
pause