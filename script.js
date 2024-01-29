function Gameboard(){
    const rows = 3;
    const cols = 3;
    const board = Array.from({ length: rows }, () => Array.from({ length: cols }, Cell));
    
    const dropToken = (row, column, player) => {
        const availableCell = board[row][column].getValue();
        return availableCell === 0 ? (board[row][column].addToken(player), true) : false;
    };

    const printBoard = () => {
        const boardCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        return boardCellValues;
    };

    const checkWinner = (boardValue) => {
        const checkLine = (a, b, c) => a !== 0 && a === b && b === c;
        for (let i = 0; i < 3; i++) {
            if (checkLine(boardValue[i][0], boardValue[i][1], boardValue[i][2]) ||
                checkLine(boardValue[0][i], boardValue[1][i], boardValue[2][i])) {
                return true;
            }
        }
    
        if (checkLine(boardValue[0][0], boardValue[1][1], boardValue[2][2]) ||
            checkLine(boardValue[0][2], boardValue[1][1], boardValue[2][0])) {
            return true;
        }
        return false;
    }

    const getBoard = () => board;

    return {printBoard, dropToken, checkWinner, getBoard};
}

function Cell() {
   let value = 0;

   const addToken = (player) => {
    value = player;
   };

   const getValue = () => value;

   return {
    addToken,
    getValue
   };
}

function gamePlayers(playerOne = 'One', playerTwo = 'Two') {
    const players = [
        {
            name: playerOne,
            token: 'X'
        },
        {
            name: playerTwo,
            token: 'O'
        }
    ];
    return players;
}

function gameController() {
    const board = Gameboard();
    const player = gamePlayers();
    let roundCounter = 0;

    let activePlayer = player[0];

    const switchPlayer = () => {
        activePlayer = activePlayer === player[0] ? player[1] : player[0];
    };

    const getActivePlayer = () => activePlayer;

    const newRound = () => {
        console.log(`${getActivePlayer().name}'s turn!`);
    };

    const playRound = (row, column) => {
        const activePlayer = getActivePlayer();
        console.log(`${activePlayer.name} just played`);
    
        if (!board.dropToken(row, column, activePlayer.token)) {
            console.log("Invalid movement, play again!");
            return;
        }
    
        if (board.checkWinner(board.printBoard())) {
            console.log(`${activePlayer.name} won`);
            console.log(board.printBoard());
            gameScreen().score(activePlayer);
            return;
        }
    
        if (roundCounter === 8) {
            console.log('tie');
            return;
        }
    
        switchPlayer();
        newRound();
        ++roundCounter;
    };

    newRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function gameScreen (){
    let points01 = 0;
    let points02 = 0;
    const game = gameController();
    const boardDiv = document.getElementById('cellbox');

    const resetButton = document.getElementById('buttonreset');
    resetButton.addEventListener('click', function () {location.reload()});

    // const deleteScreen = () => {
    //     const divs = document.getElementsByClassName('cell');
    //     Array.from(divs).forEach(div => div.remove());
    // }

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();

        board.forEach((row, indexRow) => {
            row.forEach((cell, indexColumn) => {
                const cellButton = document.createElement('div');
                cellButton.classList.add('cell');
                cellButton.dataset.rowColumn = [indexRow, indexColumn];
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedCell = e.target.dataset.rowColumn.split('').filter(comma => comma !== ',');
        console.log(selectedCell[0], selectedCell[1]);
        if(!selectedCell) return;

        game.playRound(selectedCell[0], selectedCell[1]);
        updateScreen();
    }

    const score = (winnerPlayer) => {
        const score01 = document.getElementById('score01');
        const score02 = document.getElementById('score02');
            if(winnerPlayer.token === 'X'){
                points01 = points01++;
                score01.textContent = points01;
                console.log('x ganho')
                updateScreen();
                return;
            } else {
                score02.textContent = points02++;
                console.log('O ganho');
                return updateScreen;
            }
    }

    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();

    return {score};
}

gameScreen();
