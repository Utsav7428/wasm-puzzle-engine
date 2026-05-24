# WebAssembly C++ Puzzle Solving Engine

## Overview

This repository is an educational project designed to explore two distinct but complementary domains: high-performance web computing using **WebAssembly (Wasm)** and algorithmic problem-solving using **Applied Mathematics**.

By bypassing traditional JavaScript-only implementations, this project demonstrates how to leverage C++ to handle heavy computational loads and execute mathematical models directly within the browser at near-native speeds.

## Learning Objectives

This project was built to understand and demonstrate:

1. **WebAssembly Integration:** Compiling C++ code for the web using Emscripten, managing memory across language boundaries, and exposing C++ APIs to a JavaScript frontend.
2. **Mathematical Modeling:** Translating spatial and logical puzzles into abstract mathematical systems that can be definitively solved using established theorems.

---

## The Puzzles and Their Mathematics

The engine currently features two distinct modules, each rooted in a different branch of mathematics.

### 1. Lights Out Solver (Linear Algebra)

The "Lights Out" puzzle is modeled as a system of linear equations over the finite field GF(2).

* **The Math:** Every button press toggles the state of specific grid coordinates. By constructing an adjacency matrix representing these toggles and augmenting it with the initial state of the board, we can find the exact sequence of buttons required to solve the puzzle.
* **The Algorithm:** The engine utilizes **Gaussian Elimination** modified for modulo-2 arithmetic (where addition and subtraction are equivalent to the XOR operation) to solve the matrix and output the winning moves.

### 2. Polygon Triangulation (Computational Geometry)

This module breaks down complex, simple polygons into a set of non-overlapping triangles.

* **The Math:** The algorithm is based on the **Two-Ear Theorem**, which states that any simple polygon with four or more vertices has at least two "ears" (triangles formed by three consecutive vertices containing no other points of the polygon).
* **The Algorithm:** The engine implements the **Ear Clipping** method. It mathematically verifies ears using vector cross-products (to determine interior angles) and point-in-triangle tests before clipping them and reducing the polygon's vertex count recursively.

---

## Technical Architecture

The application is built on a client-side architecture with no traditional backend server required:

* **Core Engine (`PuzzleSolver.cpp`):** Contains the pure C++ mathematical logic, isolated into domains like `PuzzleSolver::LinearAlgebra` and `PuzzleSolver::Geometry`.
* **Wasm Bridge (`wasm_bindings.cpp`):** Utilizes `emscripten/bind.h` to register C++ functions and data structures (like standard vectors), making them callable from JavaScript.
* **Frontend UI (`index.html`):** A lightweight HTML/JS interface that captures user input, passes it to the WebAssembly module, and visually formats the mathematical output.

---

## Getting Started

### Prerequisites

To compile and run this project, you will need:

1. The [Emscripten SDK (emsdk)](https://emscripten.org/docs/getting_started/downloads.html) installed and activated in your terminal.
2. Python 3 (to run a local development server).

### Build Instructions

1. Clone this repository and navigate to the root directory.
2. Ensure your Emscripten environment variables are loaded.
3. Run the following compilation command to generate the WebAssembly binary and JavaScript glue code:

```bash
emcc wasm_bindings.cpp PuzzleSolver.cpp -o puzzle_engine.js -O3 -lembind
```

### Running the Application

Web browsers enforce strict Cross-Origin Resource Sharing (CORS) policies that prevent WebAssembly from loading via the `file://` protocol. You must serve the directory using a local web server.

1. Start a local server using Python:

```bash
python3 -m http.server 8000
```

2. Open your web browser and navigate to: `http://localhost:8000`

---

## Extensibility

This project is structured to act as a foundation for further algorithmic exploration. New puzzles can be integrated by:

1. Adding a new mathematical namespace and solver function in the C++ core.
2. Registering the new function in the WebAssembly bindings.
3. Adding a new input form in the HTML interface.

Future implementations may include Graph Theory (maze pathfinding using A*) or Combinatorics (Sudoku solving using backtracking).
