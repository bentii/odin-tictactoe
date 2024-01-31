function Gameboard(){
    const score01 = document.getElementById('score01');
    const score02 = document.getElementById('score02');
    let points01 = 0;
    let points02 = 0;
    const rows = 3;
    const cols = 3;

    let board;

    const createBoard = (delayVariable) => {
        if(delayVariable){
            console.log('dalay');
            setTimeout(() => {
                board = Array.from({ length: rows }, () => Array.from({ length: cols }, Cell));
                gameScreen().updateScreen();
                return board;
                }, 1000);
        } else {
            console.log('normal');
            board = Array.from({ length: rows }, () => Array.from({ length: cols }, Cell));
            return board;
        }
    };

    createBoard();
    
    const dropToken = (row, column, player) => {
        const availableCell = board[row][column].getValue();
        return typeof availableCell === 'undefined' ? (board[row][column].addToken(player), true) : false;
    };

    const printBoard = () => {
        const boardCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        return boardCellValues;
    };

    const checkWinner = (boardValue, winner) => {
        const checkLine = (a, b, c) => typeof a !== 'undefined' && a === b && b === c;
        for (let i = 0; i < 3; i++) {
            if (checkLine(boardValue[i][0], boardValue[i][1], boardValue[i][2]) ||
                checkLine(boardValue[0][i], boardValue[1][i], boardValue[2][i])) {
                    if(winner == "X"){
                        score01.textContent = ++points01;
                    } else {
                        score02.textContent = ++points02;
                    }
                    createBoard('delayVariable');
                return true;
            }
        }
    
        if (checkLine(boardValue[0][0], boardValue[1][1], boardValue[2][2]) ||
            checkLine(boardValue[0][2], boardValue[1][1], boardValue[2][0])) {
                if(winner == "X"){
                    score01.textContent = ++points01;
                } else {
                    score02.textContent = ++points02;
                }
                    createBoard('delayVariable');
                return true;
        }
        return false;
    }

    const getBoard = () => {
        return board;
    };

    return {printBoard, dropToken, checkWinner, getBoard, createBoard};
}

function Cell() {
   let value;

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
    
        if (board.checkWinner(board.printBoard(), activePlayer.token)) {
            console.log(`${activePlayer.name} won`);
            roundCounter = 0;
            return activePlayer.token;
        }
    
        if (roundCounter === 8) {
            board.createBoard('delayVariable');
            roundCounter = 0;
            return 'tie';
        }
    
        switchPlayer();
        newRound();
        roundCounter++;
    };

    newRound();

    return {
        playRound,
        getActivePlayer,
        switchPlayer,
        getBoard: board.getBoard
    };
}

function gameScreen (){
    let idCounter = 0;
    const game = gameController();
    const boardDiv = document.getElementById('cellbox');

    const resetButton = document.getElementById('buttonreset');
    resetButton.addEventListener('click', function () {location.reload()});

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
        if(!selectedCell) return;

       switch(game.playRound(selectedCell[0], selectedCell[1])) {
        case 'X': document.getElementById('sidebar01').style.backgroundColor = 'green';
            setTimeout(() => {
                document.getElementById('sidebar01').style.backgroundColor = '';
                boardDiv.addEventListener('click', clickHandlerBoard);
            }, 1000);
            boardDiv.removeEventListener('click', clickHandlerBoard);
            updateScreen();
            break;

        case 'O': document.getElementById('sidebar02').style.backgroundColor = 'green';
            setTimeout(() => {
                document.getElementById('sidebar02').style.backgroundColor = '';
                boardDiv.addEventListener('click', clickHandlerBoard);
            }, 1000);
            boardDiv.removeEventListener('click', clickHandlerBoard);
            game.switchPlayer();
            updateScreen();
            break;

        case 'tie': document.getElementById('sidebar02').style.backgroundColor = 'grey';
            document.getElementById('sidebar01').style.backgroundColor = 'grey';
            setTimeout(() => {
                document.getElementById('sidebar01').style.backgroundColor = '';
                document.getElementById('sidebar02').style.backgroundColor = '';
                boardDiv.addEventListener('click', clickHandlerBoard);
            }, 1000);
            boardDiv.removeEventListener('click', clickHandlerBoard);
            updateScreen();
            break;

        default: updateScreen();
       }
            
        
    }

    if(!gameScreen.done){
        boardDiv.addEventListener('click', clickHandlerBoard);
        gameScreen.done = true;
    }

    updateScreen();

    return { 
        clickHandlerBoard,
        updateScreen
    };
}

gameScreen();
