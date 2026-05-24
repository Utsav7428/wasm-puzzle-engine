@echo off
REM Remove generated WebAssembly outputs
setlocal
cd /d "%~dp0"
echo Cleaning old build artifacts...
if exist puzzle_engine.js del /f /q puzzle_engine.js
if exist puzzle_engine.wasm del /f /q puzzle_engine.wasm
echo Clean complete.
endlocal
