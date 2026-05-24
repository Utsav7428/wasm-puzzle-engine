#!/bin/bash

# Build script for compiling C++ to WebAssembly
# Ensure Emscripten SDK is activated before running this script

echo "Compiling C++ to WebAssembly..."
emcc wasm_bindings.cpp PuzzleSolver.cpp -o puzzle_engine.js -O3 -lembind

if [ $? -eq 0 ]; then
    echo "Build successful! Generated puzzle_engine.js and puzzle_engine.wasm"
    echo ""
    echo "To run the application:"
    echo "  python3 -m http.server 8000"
    echo ""
    echo "Then open http://localhost:8000 in your browser."
else
    echo "Build failed. Make sure Emscripten SDK is installed and activated."
    exit 1
fi
