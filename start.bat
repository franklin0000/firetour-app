@echo off
title Fire Tour DR - Servidor Local Full-Stack
color 0a
echo ==============================================================
echo    🔥 FIRE TOUR DR - INICIADOR FULL-STACK CONCURRENTE 🔥
echo ==============================================================
echo.

:: 1. Verify if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
  color 0c
  echo  [ERROR] Node.js no esta instalado o no se encuentra en el PATH.
  echo  Por favor descarga e instala Node.js desde: https://nodejs.org/
  echo.
  pause
  exit /b
)

:: 2. Check if dependencies need installation
if not exist "node_modules" (
  color 0b
  echo  [INFO] Detectando primer inicio. Instalando dependencias de la App...
  echo  Instalando root, backend y frontend (Vite + React + Stripe)...
  echo  Por favor espera un momento, esto tardara solo unos segundos...
  echo.
  call npm run install:all
  if %errorlevel% neq 0 (
    color 0c
    echo.
    echo  [ERROR] Fallo al instalar las dependencias. Verifica tu conexion a Internet.
    echo.
    pause
    exit /b
  )
  echo.
  echo  [SUCCESS] Dependencias instaladas con exito!
  echo.
)

:: 3. Launch default browser at the React App (Vite port 5173) after a short delay
echo  Iniciando aplicacion web en http://localhost:5173/ ...
start http://localhost:5173/

:: 4. Run frontend and backend concurrently
color 0f
echo  Lanzando Servidor Express (Puerto 5000) y Servidor React (Puerto 5173)...
echo.
call npm run dev

if %errorlevel% neq 0 (
  color 0c
  echo.
  echo  [ERROR] La aplicacion ha fallado al iniciar de forma concurrente.
  echo.
  pause
)
