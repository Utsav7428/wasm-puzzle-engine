#include "PuzzleSolver.h"
#include <algorithm>

using namespace std;

namespace PuzzleSolver {
    namespace LinearAlgebra {
        vector<int> solveLightsOut(int rows, int cols, const vector<int>& initial_state) {
            int n = rows * cols;
            vector<vector<int>> mat(n, vector<int>(n + 1, 0));
            
            for (int r = 0; r < rows; ++r) {
                for (int c = 0; c < cols; ++c) {
                    int id = r * cols + c;
                    mat[id][id] = 1;
                    if (r > 0) mat[id][(r - 1) * cols + c] = 1;
                    if (r < rows - 1) mat[id][(r + 1) * cols + c] = 1;
                    if (c > 0) mat[id][r * cols + (c - 1)] = 1;
                    if (c < cols - 1) mat[id][r * cols + (c + 1)] = 1;
                    mat[id][n] = initial_state[id];
                }
            }
            
            for (int col = 0, row = 0; col < n && row < n; ++col) {
                int pivot = row;
                for (int i = row; i < n; ++i) {
                    if (mat[i][col] == 1) { pivot = i; break; }
                }
                if (mat[pivot][col] == 0) continue;
                swap(mat[row], mat[pivot]);
                for (int i = 0; i < n; ++i) {
                    if (i != row && mat[i][col] == 1) {
                        for (int j = col; j <= n; ++j) mat[i][j] ^= mat[row][j];
                    }
                }
                ++row;
            }
            
            vector<int> solution(n, 0);
            for (int i = 0; i < n; ++i) {
                bool all_zero = true;
                for (int j = 0; j < n; ++j) { if (mat[i][j] == 1) all_zero = false; }
                if (all_zero && mat[i][n] == 1) return vector<int>(); 
                for (int j = 0; j < n; ++j) {
                    if (mat[i][j] == 1) { solution[j] = mat[i][n]; break; }
                }
            }
            return solution;
        }
    }
}