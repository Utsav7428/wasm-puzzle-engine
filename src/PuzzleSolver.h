#pragma once
#include <vector>

namespace PuzzleSolver {
    namespace LinearAlgebra {
        std::vector<int> solveLightsOut(int rows, int cols, const std::vector<int>& initial_state);
    }

    namespace Geometry {
        // Takes a flat array [x1, y1, x2, y2...] and returns flat triangles [tx1, ty1, tx2, ty2, tx3, ty3...]
        std::vector<double> triangulatePolygon(const std::vector<double>& flat_points);
    }
}