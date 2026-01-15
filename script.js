/**
 * Sliding Puzzle Logic
 */

let gridSize = 3;
let tiles = []; 
let moveCount = 0;
let timerSeconds = 0;
let timerInterval = null;
let isMuted = false;
let showNumbers = true;
let currentImage = 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80';

// Audio Assets
const slideSound = new Audio('slider.mp3');
const winSound = new Audio('win.mp3');

// Elements
const board = document.getElementById('puzzle-board');
const wrapper = document.getElementById('puzzle-wrapper');
const moveDisplay = document.getElementById('move-count');
const timerDisplay = document.getElementById('timer');

// Initialize
window.onload = () => initGame(currentImage);

async function initGame(imgSrc) {
    currentImage = imgSrc;
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
        calculateGrid(img.width, img.height);
        resetStats();
        createTiles();
        renderBoard();
    };
}

function calculateGrid(w, h) {
    const ratio = w / h;
    wrapper.style.aspectRatio = `${w} / ${h}`;
    // Change grid density based on image proportions
    gridSize = (ratio > 1.3 || ratio < 0.7) ? 4 : 3;
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
}

function createTiles() {
    tiles = Array.from({length: gridSize * gridSize}, (_, i) => i);
}

function renderBoard() {
    board.innerHTML = '';
    tiles.forEach((tileValue, index) => {
        const tileDiv = document.createElement('div');
        tileDiv.classList.add('tile');
        
        if (tileValue === tiles.length - 1) {
            tileDiv.classList.add('empty');
        } else {
            const row = Math.floor(tileValue / gridSize);
            const col = tileValue % gridSize;
            
            tileDiv.style.backgroundImage = `url(${currentImage})`;
            tileDiv.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
            tileDiv.style.backgroundPosition = `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`;
            
            // Add Number Badge
            const num = document.createElement('span');
            num.className = 'tile-number';
            num.style.display = showNumbers ? 'block' : 'none';
            num.innerText = tileValue + 1;
            tileDiv.appendChild(num);
            
            tileDiv.onclick = () => handleMove(index);
        }
        board.appendChild(tileDiv);
    });
}

function handleMove(index) {
    const emptyIndex = tiles.indexOf(tiles.length - 1);
    const r1 = Math.floor(index / gridSize), c1 = index % gridSize;
    const r2 = Math.floor(emptyIndex / gridSize), c2 = emptyIndex % gridSize;

    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1) {
        if (moveCount === 0) startTimer();
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        moveCount++;
        moveDisplay.innerText = moveCount;
        if (!isMuted) slideSound.play();
        renderBoard();
        checkWin();
    }
}

function checkWin() {
    if (tiles.every((val, i) => val === i) && moveCount > 0) {
        clearInterval(timerInterval);
        if (!isMuted) winSound.play();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds++;
        const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        const s = (timerSeconds % 60).toString().padStart(2, '0');
        timerDisplay.innerText = `${m}:${s}`;
    }, 1000);
}

function resetStats() {
    clearInterval(timerInterval);
    timerSeconds = 0;
    moveCount = 0;
    timerDisplay.innerText = "00:00";
    moveDisplay.innerText = "0";
}

// Event Listeners
document.getElementById('shuffle-btn').onclick = () => {
    resetStats();
    for (let i = 0; i < 200; i++) {
        const emptyIdx = tiles.indexOf(tiles.length - 1);
        const neighbors = [];
        const r = Math.floor(emptyIdx/gridSize), c = emptyIdx%gridSize;
        if (r > 0) neighbors.push(emptyIdx - gridSize);
        if (r < gridSize-1) neighbors.push(emptyIdx + gridSize);
        if (c > 0) neighbors.push(emptyIdx - 1);
        if (c < gridSize-1) neighbors.push(emptyIdx + 1);
        const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
        [tiles[emptyIdx], tiles[rand]] = [tiles[rand], tiles[emptyIdx]];
    }
    renderBoard();
};

document.getElementById('restart-btn').onclick = () => {
    createTiles();
    resetStats();
    renderBoard();
};

document.getElementById('toggle-numbers').onclick = (e) => {
    showNumbers = !showNumbers;
    e.target.innerText = showNumbers ? "🔢 Hide Numbers" : "🔢 Show Numbers";
    renderBoard();
};

document.getElementById('mute-btn').onclick = (e) => {
    isMuted = !isMuted;
    e.target.innerText = isMuted ? "🔇 Muted" : "🔊 Mute";
};

document.getElementById('image-upload').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => initGame(ev.target.result);
    reader.readAsDataURL(e.target.files[0]);
};

document.getElementById('def-1').onclick = () => initGame('https://images.unsplash.com/photo-1806744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80');
document.getElementById('def-2').onclick = () => initGame('https://images.unsplash.com/photo-1464822759050-fed622ff2c3b?auto=format&fit=crop&w=800&q=80');