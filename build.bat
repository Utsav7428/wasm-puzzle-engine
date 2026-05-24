@echo off
REM Build script for compiling C++ to WebAssembly on Windows
REM Ensure Emscripten SDK is activated before running this script

setlocal
cd /d "%~dp0"

echo Cleaning old build artifacts...
if exist puzzle_engine.js del /f /q puzzle_engine.js
if exist puzzle_engine.wasm del /f /q puzzle_engine.wasm

echo Compiling C++ to WebAssembly...
emcc wasm_bindings.cpp PuzzleSolver.cpp -o puzzle_engine.js -O3 -lembind

if %ERRORLEVEL% equ 0 (
    echo.
    echo Build successful! Generated puzzle_engine.js and puzzle_engine.wasm
    echo.
    echo To run the application:
    echo   python -m http.server 8000
    echo.
    echo Then open http://localhost:8000 in your browser.
) else (
    echo.
    echo Build failed. Make sure Emscripten SDK is installed and activated.
    exit /b 1
)
endlocal
