#include "PuzzleSolver.h"
#include <algorithm>
#include <cmath>

using namespace std;

namespace PuzzleSolver {
    namespace Geometry {
        struct Point { double x, y; };

        // Math: Cross product of vectors (ab) and (ac)
        double crossProduct(Point a, Point b, Point c) {
            return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        }

        bool isPointInTriangle(Point p, Point a, Point b, Point c) {
            double cp1 = crossProduct(a, b, p);
            double cp2 = crossProduct(b, c, p);
            double cp3 = crossProduct(c, a, p);
            bool has_neg = (cp1 < 0) || (cp2 < 0) || (cp3 < 0);
            bool has_pos = (cp1 > 0) || (cp2 > 0) || (cp3 > 0);
            return !(has_neg && has_pos);
        }

        bool isEar(int i, const vector<Point>& poly) {
            int n = poly.size();
            int prev = (i - 1 + n) % n;
            int next = (i + 1) % n;
            
            Point a = poly[prev];
            Point b = poly[i];
            Point c = poly[next];
            
            // Must be a convex interior angle
            if (crossProduct(a, b, c) <= 0) return false;
            
            // Check if any other vertex is inside the triangle
            for (int j = 0; j < n; ++j) {
                if (j == prev || j == i || j == next) continue;
                if (isPointInTriangle(poly[j], a, b, c)) return false;
            }
            return true;
        }

        vector<double> triangulatePolygon(const vector<double>& flat_points) {
            vector<Point> poly;
            for (size_t i = 0; i < flat_points.size(); i += 2) {
                poly.push_back({flat_points[i], flat_points[i + 1]});
            }

            // Ensure Counter-Clockwise order (calculate signed area)
            double area = 0;
            for (size_t i = 0; i < poly.size(); ++i) {
                int next = (i + 1) % poly.size();
                area += (poly[i].x * poly[next].y - poly[next].x * poly[i].y);
            }
            if (area < 0) { reverse(poly.begin(), poly.end()); }

            vector<double> triangles;
            while (poly.size() >= 3) {
                bool earFound = false;
                for (int i = 0; i < poly.size(); ++i) {
                    if (isEar(i, poly)) {
                        int prev = (i - 1 + poly.size()) % poly.size();
                        int next = (i + 1) % poly.size();
                        
                        // Push triangle coordinates
                        triangles.push_back(poly[prev].x); triangles.push_back(poly[prev].y);
                        triangles.push_back(poly[i].x);    triangles.push_back(poly[i].y);
                        triangles.push_back(poly[next].x); triangles.push_back(poly[next].y);
                        
                        poly.erase(poly.begin() + i);
                        earFound = true;
                        break;
                    }
                }
                if (!earFound) break; // Safety break for complex/intersecting polygons
            }
            return triangles;
        }
    }
}