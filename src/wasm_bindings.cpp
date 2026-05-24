#include <emscripten/bind.h>
#include "PuzzleSolver.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(puzzle_engine_module) {
    register_vector<int>("VectorInt");
    register_vector<double>("VectorDouble");

    function("solveLightsOut", &PuzzleSolver::LinearAlgebra::solveLightsOut);
    function("triangulatePolygon", &PuzzleSolver::Geometry::triangulatePolygon);
}