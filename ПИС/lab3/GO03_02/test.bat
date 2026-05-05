@echo off
chcp 65001 >nul

echo 1. General stats
curl -X GET http://localhost:3000/G
echo.
echo.

echo 2. Three GET 
curl -X GET http://localhost:3000/S >nul
curl -X GET http://localhost:3000/S >nul
curl -X GET http://localhost:3000/S >nul

echo 3. Two Post
curl -X POST http://localhost:3000/S >nul
curl -X POST http://localhost:3000/S >nul
echo.

echo 4. Update stats
curl -X GET http://localhost:3000/G
echo.
echo.

pause