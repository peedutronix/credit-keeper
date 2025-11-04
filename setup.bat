@echo off
echo Installing dependencies...
call npm install
echo.
echo Installing client dependencies...
cd client
call npm install
cd ..
echo.
echo Setup complete!
echo.
echo To start the application:
echo   1. Start backend: npm start (or npm run dev for auto-reload)
echo   2. Start frontend: npm run client (in a new terminal)
echo.
pause

