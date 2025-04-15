let grid = [];

let selectedCells = [];

let score = 0;

let lives = 3;

let gridSize = 0;

let timerInterval;

let timeLeft = 10;

let initialDuration = 10;

let isGameOver = false;

let lastGameSize = 0;

const gridElement = document.getElementById('grid');



function updateDuration() {

    const durationSelect = document.getElementById('duration');

    initialDuration = parseInt(durationSelect.value);

    timeLeft = initialDuration;

    updateTimerDisplay();

}



function startGame(size) {

    // réinitialiser les variables
    lives = 3;
    score = 0;
    selectedCells = [];
    isGameOver = false;
    document.getElementById('lives').textContent = '❤️'.repeat(lives);
    document.getElementById('score').textContent = `Score: ${score}`;

    
    updateDuration();

    gridSize = size;

    if(size == -1){

        gridSize = lastGameSize; 

    }else{

        lastGameSize = size;

    }



    document.getElementById('menu-container').style.display = 'none';

    document.getElementById('game-container').style.display = 'block';

    document.getElementById('gameOverPopup').style.display = 'none';

    resetGame();

    

}



function returnToMenu() {

    clearInterval(timerInterval);

    document.getElementById('menu-container').style.display = 'block';

    document.getElementById('game-container').style.display = 'none';

    document.getElementById('gameOverPopup').style.display = 'none';

    updateHighScoresDisplay();

}



function generateValidGrid() {

    let validGridFound = false;

    while (!validGridFound) {

        grid = Array(gridSize).fill().map(() => 

            Array(gridSize).fill().map(() => Math.floor(Math.random() * 9) + 1)

        );

        if (findPossibleCombination()) {

            validGridFound = true;

        }

    }

    renderGrid();

}



function resetGame() {

    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));

    selectedCells = [];

    score = 0;

    lives = 3;

    timeLeft = initialDuration;

    isGameOver = false;

    // réinitialiser le bouton indice
    const hintButton = document.getElementById('hintButton');
    hintButton.disabled = false;
    hintButton.style.cursor = 'pointer';
    hintButton.style.backgroundColor = '#007bff';

    

    document.getElementById('lives').textContent = '❤️'.repeat(lives);

    document.getElementById('score').textContent = `Score: ${score}`;

    updateTimerDisplay();

    

    generateValidGrid();

    startTimer();

}



function startTimer() {

    clearInterval(timerInterval);

    timeLeft = initialDuration; // utilisez la durée sélectionnée

    updateTimerDisplay();

    

    timerInterval = setInterval(() => {

        timeLeft--;

        updateTimerDisplay();

        

        if (timeLeft <= 0) {

            gameOver('Temps écoulé!');

        }

    }, 1000);

}



function updateTimerDisplay() {

    document.getElementById('timer').textContent = `${timeLeft}s`;

}



function countDiagonals() {

    let diagonalCount = 0;

    for (let i = 1; i < selectedCells.length; i++) {

        const [r1, c1] = selectedCells[i-1];

        const [r2, c2] = selectedCells[i];

        if (isDiagonal(r1, c1, r2, c2)) {

            diagonalCount++;

        }

    }

    return diagonalCount;

}



function isDiagonal(r1, c1, r2, c2) {

    return Math.abs(r1 - r2) === 1 && Math.abs(c1 - c2) === 1;

}



function isAdjacent(r1, c1, r2, c2) {

    return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;

}



function canSelectCell(r, c) {

    if (selectedCells.length === 0) return true;

    const [lastR, lastC] = selectedCells[selectedCells.length - 1];

    return isAdjacent(r, c, lastR, lastC);

}



function calculatePoints(cellCount) {

    let basePoints = 0;

    if (cellCount === 2) basePoints = 5;

    else if (cellCount === 3) basePoints = 10;

    else if (cellCount === 4) basePoints = 15;

    else basePoints = 20;



    const diagonalBonus = countDiagonals() * 2;

    return basePoints + diagonalBonus;

}



function findPossibleCombination() {

    // Chercher les combinaisons de 2 chiffres

    for (let r1 = 0; r1 < gridSize; r1++) {

        for (let c1 = 0; c1 < gridSize; c1++) {

            for (let r2 = Math.max(0, r1-1); r2 <= Math.min(gridSize-1, r1+1); r2++) {

                for (let c2 = Math.max(0, c1-1); c2 <= Math.min(gridSize-1, c1+1); c2++) {

                    if (r1 === r2 && c1 === c2) continue;

                    if (grid[r1][c1] + grid[r2][c2] === 10) {

                        return [[r1, c1], [r2, c2]];

                    }

                }

            }

        }

    }

    return null;

}



function showHint() {

    if (lives <= 0 || isGameOver) return;

    

    const combination = findPossibleCombination();

    if (combination) {

        lives--;

        document.getElementById('lives').textContent = '❤️'.repeat(lives);

        

        combination.forEach(([r, c]) => {

            const cell = gridElement.children[r * gridSize + c];

            cell.classList.add('hint');

            setTimeout(() => {

                cell.classList.remove('hint');

            }, 1500);

        });

    }

    

    if (lives === 0) {

        document.getElementById('lives').textContent = '❤️'.repeat(0);

        // enlever le bouton de révéler une combinaison
        const hintButton = document.getElementById('hintButton');
        hintButton.disabled = true;
        hintButton.style.backgroundColor = '#ccc';
        hintButton.style.cursor = 'not-allowed';

        //setTimeout(() => gameOver('Plus de vies!'), 500);

    }

}



function gameOver(reason) {

    isGameOver = true;

    clearInterval(timerInterval);

    

    const currentHighScore = getHighScore();

    if (score > currentHighScore) {

        setHighScore(score);

    }

    

    updateHighScoresDisplay();

    document.getElementById('finalScore').innerHTML = 

        `Score final: ${score}<br>Meilleur score: ${getHighScore()}`;

    document.getElementById('gameOverPopup').style.display = 'block';

}



function getHighScore() {

    return parseInt(localStorage.getItem(`highScore${gridSize}x${gridSize}`) || '0');

}



function setHighScore(newScore) {

    localStorage.setItem(`highScore${gridSize}x${gridSize}`, newScore.toString());

}



function updateHighScoresDisplay() {

    document.getElementById('highScores3x3').textContent = `3x3: ${localStorage.getItem('highScore3x3') || '0'}`;

    document.getElementById('highScores4x4').textContent = `4x4: ${localStorage.getItem('highScore4x4') || '0'}`;

    document.getElementById('highScores5x5').textContent = `5x5: ${localStorage.getItem('highScore5x5') || '0'}`;

}



function renderGrid() {

    gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;

    gridElement.innerHTML = '';

    

    grid.forEach((row, r) => {

        row.forEach((value, c) => {

            const cell = document.createElement('div');

            cell.classList.add('cell');

            cell.textContent = value;

            

            if (selectedCells.some(([sr, sc]) => sr === r && sc === c)) {

                cell.style.animation = 'numberChange 0.5s ease';

            }

            

            cell.onclick = () => selectCell(r, c, cell);

            gridElement.appendChild(cell);

        });

    });

}



function selectCell(r, c, cell) {

    if (isGameOver) return;

    if (selectedCells.length > 0) {

        const [lastR, lastC] = selectedCells[selectedCells.length - 1];

        if (lastR === r && lastC === c) {

            selectedCells.pop();

            cell.classList.remove('selected');

            return;

        }

    }

    if (selectedCells.some(([sr, sc]) => sr === r && sc === c)) return;

    if (!canSelectCell(r, c)) {

        cell.classList.add('invalid');

        setTimeout(() => cell.classList.remove('invalid'), 500);

        return;

    }

    selectedCells.push([r, c]);

    cell.classList.add('selected');

    checkSum();

}



function checkSum() {

    let sum = selectedCells.reduce((acc, [r, c]) => acc + grid[r][c], 0);

    if (lives === 0) {
            // Désactive le bouton indice
            const hintButton = document.getElementById('hintButton');
            if (hintButton) {
                hintButton.disabled = true;
                hintButton.style.backgroundColor = '#ccc';
                hintButton.style.cursor = 'not-allowed';
            }
        }

    if (sum > 10) {
        // Perte de vie en cas de mauvaise combinaison
        if (lives > 0) {
            lives--;
            document.getElementById('lives').textContent = '❤️'.repeat(lives);
        }else{
            setTimeout(() => gameOver('Plus de vies!'), 500);
        }

        selectedCells.forEach(([r, c]) => {
            const cell = gridElement.children[r * gridSize + c];
            cell.classList.add('invalid');
            setTimeout(() => {
                cell.classList.remove('selected', 'invalid');
            }, 500);
        });
        selectedCells = [];

    } else if (sum === 10) {

        const points = calculatePoints(selectedCells.length);

        score += points;

        

        selectedCells.forEach(([r, c]) => {

            const cell = gridElement.children[r * gridSize + c];

            cell.classList.add('matched');

            setTimeout(() => {

                grid[r][c] = Math.floor(Math.random() * 9) + 1;

                renderGrid();

            }, 500);

        });

        

        document.getElementById('score').textContent = `Score: ${score}`;

        selectedCells = [];

        timeLeft = initialDuration; // réinitialise avec la durée sélectionnée

        

        setTimeout(() => {

            if (!findPossibleCombination()) {

                generateValidGrid();

            }

        }, 600);

    }

}



// Initialisation

updateHighScoresDisplay();