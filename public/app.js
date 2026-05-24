Module.onRuntimeInitialized = function() {
    document.getElementById("output").innerText = "WebAssembly Engine Active.";
};

function switchPuzzle() {
    document.querySelectorAll('.puzzle-section').forEach(el => el.classList.remove('active'));
    const selected = document.getElementById('puzzle-select').value;
    if (selected !== 'none') document.getElementById(selected).classList.add('active');
}

function runLightsOut() {
    let arr = document.getElementById("lo-input").value.split(',').map(Number);
    let stateVec = new Module.VectorInt();
    arr.forEach(num => stateVec.push_back(num));

    let solutionVec = Module.solveLightsOut(3, 3, stateVec);
    
    if (solutionVec.size() === 0) {
        document.getElementById("output").innerText = "Unsolvable.";
    } else {
        let outStr = "Solution Matrix:\n";
        for (let i = 0; i < solutionVec.size(); i++) {
            outStr += solutionVec.get(i) + " ";
            if ((i + 1) % 3 === 0) outStr += "\n";
        }
        document.getElementById("output").innerText = outStr;
    }
    stateVec.delete(); solutionVec.delete();
}

function runTriangulation() {
    let arr = document.getElementById("tri-input").value.split(',').map(Number);
    let pointsVec = new Module.VectorDouble();
    arr.forEach(num => pointsVec.push_back(num));

    // Call C++ Math Engine
    let resultVec = Module.triangulatePolygon(pointsVec);

    // Extract Data
    let triangles = [];
    for (let i = 0; i < resultVec.size(); i++) {
        triangles.push(resultVec.get(i));
    }
    
    document.getElementById("output").innerText = `Found ${triangles.length / 6} triangles. Drawing...`;

    // Visualizer Logic
    const canvas = document.getElementById('polyCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each triangle returned by C++
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    for (let i = 0; i < triangles.length; i += 6) {
        ctx.beginPath();
        ctx.moveTo(triangles[i], triangles[i+1]);
        ctx.lineTo(triangles[i+2], triangles[i+3]);
        ctx.lineTo(triangles[i+4], triangles[i+5]);
        ctx.closePath();
        ctx.stroke();
        
        // Fill slightly to make them visible
        ctx.fillStyle = `rgba(0, 150, 255, 0.2)`;
        ctx.fill();
    }

    pointsVec.delete(); resultVec.delete();
}