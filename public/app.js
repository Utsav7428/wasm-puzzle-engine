// --- Global Initialization ---
Module.onRuntimeInitialized = function() {
    console.log("C++ WebAssembly Engine Loaded.");
    initLightsOut(); // Build the grid on load
};

function switchPuzzle() {
    // Hide everything
    document.querySelectorAll('.control-panel').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.display-area').forEach(el => el.classList.remove('active'));
    
    // Show selected
    const selected = document.getElementById('puzzle-select').value;
    if (selected !== 'none') {
        document.getElementById(`controls-${selected}`).classList.add('active');
        document.getElementById(`display-${selected}`).classList.add('active');
    }
}

// ==========================================
// PUZZLE 1: POLYGON TRIANGULATION
// ==========================================
const canvas = document.getElementById('polyCanvas');
const ctx = canvas.getContext('2d');
const statusTri = document.getElementById('status-tri');
let points = []; 

canvas.addEventListener('mousedown', function(event) {
    const rect = canvas.getBoundingClientRect();
    points.push({ 
        x: event.clientX - rect.left, 
        y: event.clientY - rect.top 
    });
    drawPolygonState(); 
});

function drawPolygonState(triangles = []) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer boundary
    if (points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.lineTo(points[0].x, points[0].y);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#000";
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Draw calculated triangles
    if (triangles.length > 0) {
        ctx.strokeStyle = "#555"; 
        ctx.lineWidth = 1;
        for (let i = 0; i < triangles.length; i += 6) {
            ctx.beginPath();
            ctx.moveTo(triangles[i], triangles[i+1]);
            ctx.lineTo(triangles[i+2], triangles[i+3]);
            ctx.lineTo(triangles[i+4], triangles[i+5]);
            ctx.closePath();
            ctx.stroke();
        }
    }
}

function clearCanvas() {
    points = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    statusTri.innerText = "Canvas cleared.";
}

function runTriangulation() {
    if (points.length < 3) {
        statusTri.innerText = "Need at least 3 points.";
        return;
    }

    let pointsVec = new Module.VectorDouble();
    points.forEach(p => { pointsVec.push_back(p.x); pointsVec.push_back(p.y); });

    let resultVec = Module.triangulatePolygon(pointsVec);
    let triangles = [];
    for (let i = 0; i < resultVec.size(); i++) triangles.push(resultVec.get(i));

    if (triangles.length === 0) {
        statusTri.innerText = "Error: Invalid or self-intersecting polygon.";
    } else {
        statusTri.innerText = `Success! Generated ${triangles.length / 6} triangles.`;
        drawPolygonState(triangles);
    }
    pointsVec.delete(); resultVec.delete();
}

// ==========================================
// PUZZLE 2: LIGHTS OUT (5x5 Matrix over GF2)
// ==========================================
const gridSize = 5;
let loState = new Array(gridSize * gridSize).fill(0); // 0 = off, 1 = on
const statusLo = document.getElementById('status-lo');

function initLightsOut() {
    const gridContainer = document.getElementById('lo-grid');
    gridContainer.innerHTML = '';
    
    for (let i = 0; i < 25; i++) {
        let cell = document.createElement('div');
        cell.className = 'lo-cell';
        cell.id = `cell-${i}`;
        cell.onclick = () => handleCellClick(i);
        gridContainer.appendChild(cell);
    }
    renderLightsOut();
}

function handleCellClick(index) {
    toggleLogic(index);
    renderLightsOut();
    
    // Check win condition
    if (loState.every(val => val === 0)) {
        statusLo.innerText = "Puzzle Solved!";
    } else {
        statusLo.innerText = "Playing...";
    }
}

// Toggles the target cell and its valid orthogonal neighbors
function toggleLogic(index) {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    
    const toggle = (r, c) => {
        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
            let idx = r * gridSize + c;
            loState[idx] = loState[idx] === 0 ? 1 : 0;
        }
    };

    toggle(row, col);       // Center
    toggle(row - 1, col);   // Top
    toggle(row + 1, col);   // Bottom
    toggle(row, col - 1);   // Left
    toggle(row, col + 1);   // Right
}

// Draws the state to the DOM
function renderLightsOut(solution = null) {
    for (let i = 0; i < 25; i++) {
        let cell = document.getElementById(`cell-${i}`);
        
        // Update color state
        if (loState[i] === 1) {
            cell.classList.add('on');
        } else {
            cell.classList.remove('on');
        }

        // If the C++ solver provided a solution, mark the required clicks with an X
        if (solution && solution[i] === 1) {
            cell.innerText = "X";
        } else {
            cell.innerText = "";
        }
    }
}

// Ensures a solvable random board by simulating random valid clicks starting from zero
function randomizeLightsOut() {
    loState.fill(0);
    for(let i = 0; i < 25; i++) {
        if(Math.random() > 0.5) toggleLogic(i);
    }
    renderLightsOut();
    statusLo.innerText = "Board scrambled.";
}

// Sends the board to C++ for Gaussian Elimination
function runLightsOutSolver() {
    let stateVec = new Module.VectorInt();
    loState.forEach(v => stateVec.push_back(v));

    let solutionVec = Module.solveLightsOut(gridSize, gridSize, stateVec);

    if (solutionVec.size() === 0) {
        statusLo.innerText = "Current state is mathematically unsolvable.";
    } else {
        statusLo.innerText = "Engine calculated solution.\nClick the squares marked with 'X'.";
        
        let solutionArr = [];
        for(let i=0; i<25; i++) solutionArr.push(solutionVec.get(i));
        
        renderLightsOut(solutionArr);
    }
    stateVec.delete(); solutionVec.delete();
}