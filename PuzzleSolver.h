#pragma once
#include <vector>

namespace PuzzleSolver {
    namespace LinearAlgebra {
        // Lights Out solver
        std::vector<int> solveLightsOut(int rows, int cols, const std::vector<int>& initial_state);
    }

    namespace Geometry {
        // Flattens points as [x1, y1, x2, y2...] for easier JS interop
        std::vector<double> triangulatePolygon(const std::vector<double>& flat_points);
    }
}
