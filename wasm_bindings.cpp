#include <emscripten/bind.h>
#include "PuzzleSolver.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(puzzle_engine_module) {
    // 1. Register data structures so JS can pass arrays to C++\
    register_vector<int>("VectorInt");
    register_vector<double>("VectorDouble");

    // 2. Bind the specific puzzle functions
    function("solveLightsOut", &PuzzleSolver::LinearAlgebra::solveLightsOut);
    function("triangulatePolygon", &PuzzleSolver::Geometry::triangulatePolygon);
}
