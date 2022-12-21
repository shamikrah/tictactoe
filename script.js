// Player factory to create players
const createPlayer = (name) => {
    return { name };
}

// Game board module to to create and modify game board
const gameBoard = (() => {
    let boardArray = [];
    let boardLength = 9;
    let board = document.querySelector(".board");

    function drawBoard() {
        for (let i = 0; i < boardLength; i++) {
            let square = document.createElement("div");
            square.dataset.id = i;
            square.classList.add("square");
            square.addEventListener("click", markSquare);
            board.appendChild(square);
            boardArray.push("");
        }
    }

    function resetBoard() {
        while (board.hasChildNodes()) {
            board.removeChild(board.lastElementChild);
        }
        boardArray = [];
    }

    function disableBoard() {
        let squares = board.children;
        for (let i = 0; i < squares.length; i++) {
            let square = squares[i];
            square.removeEventListener("click", markSquare);
        }
    }

    function markSquare(e) {
        let square = e.target;
        if ((square.textContent == "") && (gameEngine.isPlayerOneTurn())) {
            square.textContent = "X";
            boardArray[square.dataset.id] = "X";
        }
        else if ((square.textContent == "") && (gameEngine.isPlayerTwoTurn())) {
            square.textContent = "O";
            boardArray[square.dataset.id] = "O";
        }
        checkBoard();
        gameEngine.endTurn();
    }

    function checkBoard() {
        let isEmptySquare = false;
        if ((boardArray[0] == "X" && boardArray[1] == "X" && boardArray[2] == "X") ||
        (boardArray[3] == "X" && boardArray[4] == "X" && boardArray[5] == "X") ||
        (boardArray[6] == "X" && boardArray[7] == "X" && boardArray[8] == "X") ||
        (boardArray[0] == "X" && boardArray[3] == "X" && boardArray[6] == "X") ||
        (boardArray[1] == "X" && boardArray[4] == "X" && boardArray[7] == "X") ||
        (boardArray[2] == "X" && boardArray[5] == "X" && boardArray[8] == "X") ||
        (boardArray[0] == "X" && boardArray[4] == "X" && boardArray[8] == "X") ||
        (boardArray[2] == "X" && boardArray[4] == "X" && boardArray[6] == "X")) {
            gameEngine.setWin(gameEngine.getPlayerOne());
            disableBoard();
            return;
        }
        else if ((boardArray[0] == "O" && boardArray[1] == "O" && boardArray[2] == "O") ||
        (boardArray[3] == "O" && boardArray[4] == "O" && boardArray[5] == "O") ||
        (boardArray[6] == "O" && boardArray[7] == "O" && boardArray[8] == "O") ||
        (boardArray[0] == "O" && boardArray[3] == "O" && boardArray[6] == "O") ||
        (boardArray[1] == "O" && boardArray[4] == "O" && boardArray[7] == "O") ||
        (boardArray[2] == "O" && boardArray[5] == "O" && boardArray[8] == "O") ||
        (boardArray[0] == "O" && boardArray[4] == "O" && boardArray[8] == "O") ||
        (boardArray[2] == "O" && boardArray[4] == "O" && boardArray[6] == "O")) {
            gameEngine.setWin(gameEngine.getPlayerTwo());
            disableBoard();
            return;
        }
        for (let i = 0; i < boardLength; i++) {
            if (boardArray[i] == "") {
                isEmptySquare = true;
                break;
            }
        }
        if (!isEmptySquare) {
            gameEngine.setTie();
        }
    }

    return { drawBoard, resetBoard, boardArray };
})();

const gameEngine = (() => {
    let playerOne = createPlayer("");
    let playerTwo = createPlayer("");

    let playerOneName = document.querySelector("#player-1-name");
    let playerTwoName = document.querySelector("#player-2-name");
    let playerOneNameDisplay = document.querySelector(".player-1");
    let playerTwoNameDisplay = document.querySelector(".player-2");

    let playerOneTurn = true;
    let playerTwoTurn = false;

    let isTie = false;
    let winner = null;

    function initGame(e) {
        e.preventDefault();
        startGame();
    }

    function startGame() {
        displayController.displayGame();
        playerOne = createPlayer(playerOneName.value);
        playerTwo = createPlayer(playerTwoName.value);
        playerOneNameDisplay.textContent = playerOne.name;
        playerTwoNameDisplay.textContent = playerTwo.name;
        displayController.updateStatusMessage();
    }

    function endTurn() {
        if (playerOneTurn) {
            playerOneTurn = false;
            playerTwoTurn = true;
        }
        else {
            playerOneTurn = true;
            playerTwoTurn = false;
        }
        displayController.updateStatusMessage();
    }

    function resetGame() {
        playerOneTurn = true;
        playerTwoTurn = false;
    }

    function isPlayerOneTurn() {
        return playerOneTurn;
    }

    function isPlayerTwoTurn() {
        return playerTwoTurn;
    }

    function getPlayerOne() {
        return playerOne;
    }

    function getPlayerTwo() {
        return playerTwo;
    }

    function checkWin() {
        if (winner != null) {
            return true;
        }
        return false;
    }

    function setWin(player) {
        winner = player;
    }

    function getWinner() {
        return winner;
    }

    function setTie() {
        isTie = true;
    }

    function checkTie() {
        return isTie ? true : false;
    }

    return { startGame, initGame, endTurn, isPlayerOneTurn, isPlayerTwoTurn, getPlayerOne, getPlayerTwo, resetGame, setWin, getWinner, checkWin, setTie, checkTie };
})();

// Module to control display elements
const displayController = (() => {
    let playerFormBtn = document.querySelector("#player-form-button");
    playerFormBtn.addEventListener("click", displayModal);

    let aiFormBtn = document.querySelector("#ai-form-button");
    aiFormBtn.addEventListener("click", displayModal);

    let overlay = document.querySelector(".modal-overlay");

    let formContainer = document.querySelector(".form-container");

    let playerFormCancelBtn = document.querySelector("#player-form > .cancel-button");
    playerFormCancelBtn.addEventListener("click", closeModal);

    let aiFormCancelBtn = document.querySelector("#ai-form > .cancel-button");
    aiFormCancelBtn.addEventListener("click", closeModal);

    let playerForm = document.querySelector("#player-form");
    playerForm.addEventListener("submit", gameEngine.initGame);

    let landingPage = document.querySelector(".landing-page");
    let gamePage = document.querySelector(".game-page");

    let goBackBtn = document.querySelector("#go-back-button");
    goBackBtn.addEventListener("click", displayLanding);
    let restartBtn = document.querySelector("#restart-button");
    restartBtn.addEventListener("click", restartGame);

    let message = document.querySelector(".status-message");

    function displayModal() {
        overlay.classList.add("active");
        formContainer.classList.add("active");
    }

    function closeModal() {
        overlay.classList.remove("active");
        formContainer.classList.remove("active");
    }

    function displayGame() {
        closeModal();
        landingPage.style.display = "none";
        gamePage.style.display = "flex";
        gameBoard.drawBoard();
    }

    function displayLanding() {
        gameBoard.resetBoard();
        gamePage.style.display = "none";
        landingPage.style.display = "flex";
    }

    function restartGame() {
        gameEngine.resetGame();
        gameBoard.resetBoard();
        gameBoard.drawBoard();
        gameEngine.startGame();
    }

    function updateStatusMessage() {
        if (gameEngine.checkWin()) {
            message.textContent = `${gameEngine.getWinner().name} has won!`;
        }
        else if (gameEngine.checkTie()) {
            message.textContent = `It's a draw!`;
        }
        else if (gameEngine.isPlayerOneTurn()) {
            message.textContent = `${gameEngine.getPlayerOne().name}'s turn`;
        }
        else if (gameEngine.isPlayerTwoTurn()) {
            message.textContent = `${gameEngine.getPlayerTwo().name}'s turn`;
        }
    }

    return { displayGame, updateStatusMessage };
})();