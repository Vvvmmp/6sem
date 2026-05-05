@echo off
chcp 65001 >nul

echo 1. GET /A
curl -X GET http://localhost:3000/A
echo.

echo 2. GET /A/B
curl -X GET http://localhost:3000/A/B
echo.

echo 3. POST /A
curl -X POST http://localhost:3000/A
echo.

echo 4. POST /A/B
curl -X POST http://localhost:3000/A/B
echo.

echo 5. PUT /A
curl -X PUT http://localhost:3000/A
echo.

echo 6. PUT /A/B
curl -X PUT http://localhost:3000/A/B
echo.

echo 7. GET не перечисленный (/xyz)
curl -X GET http://localhost:3000/xyz
echo.

echo 8. POST не перечисленный (/api/test)
curl -X POST http://localhost:3000/api/test
echo.

echo 9. PUT не перечисленный (/hello)
curl -X PUT http://localhost:3000/hello
echo.

pause