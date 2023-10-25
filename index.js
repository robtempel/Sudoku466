document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9;
    const solveButton = document.getElementById("solve-btn");
    solveButton.addEventListener('click', solveSudoku);

    const sudokuGrid = document.getElementById("sudoku-grid");
    // Crea la cuadrícula del sudoku y las celdas de entrada
    for (let row = 0; row < gridSize; row++) {
        const newRow = document.createElement("tr");
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
});

async function solveSudoku() {
    const gridSize = 9;
    const sudokuArray = [];

    // Llenar el sudokuArray con valores de entrada de la grilla
    for (let row = 0; row < gridSize; row++) {
        sudokuArray[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
        }
    }

    console.log(sudokuArray)
    // Identificar celdas ingresadas por el usuario y marcarlas
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            if (sudokuArray[row][col] !== 0) {
                cell.classList.add("user-input");
            }
        }
    }

    // Resuelve el sudoku y muestra la solución
    if (solveSudokuHelper(sudokuArray)) {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                // Completa los valores resueltos y aplica la animación.
                if (!cell.classList.contains("user-input")) {
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(0); // Agregar un retraso para la visualización
                }
            }
        }
    } else {
        alert("No existe ninguna solución para este Tablero.");
    }
}

function solveSudokuHelper(board) {
    const gridSize = 9;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;

                        // Intento recursivamente resolver el Sudoku
                        if (solveSudokuHelper(board)) {
                            return true; // Puzzle solved
                        }

                        board[row][col] = 0; // Retractarse
                    }
                }
                return false; // No se encontró ningún número válido
            }
        }
    }

    return true; // Todas las celdas llenas
}

function isValidMove(board, row, col, num) {
    const gridSize = 9;

    // Comprobar filas y columnas en busca de conflictos
    for (let i = 0; i < gridSize; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false; // Conflicto encontrado
        }
    }

    // Verifique la subcuadrícula 3*3 para ver si hay conflictos
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) {
                return false; // Conflicto encontrado
            }
        }
    }

    return true; // No se encontraron conflictos
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
