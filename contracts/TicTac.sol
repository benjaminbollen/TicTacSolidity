pragma solidity^0.4.18;

contract TicTac {
    address ticTacAdmin;
    function TicTac() public {
        ticTacAdmin = msg.sender;
    }

    //The board can be in 3 states
    //--empty (no player is in it)
    //--playerWaiting (player one has joined)
    //--occupied (both players have joined and game is in progress)
    enum BoardState {empty, playerWaiting, occupied}

    //The game can be in 5 states
    enum GameState {notStarted, running, tied, playerOneWon, playerTwoWon}

    //This is the Board data structure
    struct Board {
        BoardState stateOfBoard;
        address player1;    //address of player one
        address player2;    //address of player two
        address nextMove;   //address of player who will legally have the next move
        uint numberOfMoves;

        GameState stateOfGame;
        //a 3x3 representation of the board with a mapping to which player is occupying which box
        mapping(uint => mapping(uint => address)) boardPositions;
    }

    Board public boardOne;

    //players call this method to join the game
    function joinGame() public {
        require(boardOne.stateOfBoard != BoardState.occupied); //board should have place for the player
        require(msg.sender != boardOne.player1);        //same player can not join the board as both players
        require(msg.sender != boardOne.player2);        

        if (boardOne.stateOfBoard == BoardState.empty) {       //If board is empty, player joins as player one
            boardOne.player1 = msg.sender;
            boardOne.stateOfBoard = BoardState.playerWaiting;  //state of board is updated to playerWaiting
        } else {
            boardOne.player2 = msg.sender;              //If board has playerWaiting, new player joins as player 2
            boardOne.stateOfBoard = BoardState.occupied;
        }
    }

    //When board is occupied, the player who initiates this method gets the first move.
    function startNewGame() public onlyPlayers {
        require(boardOne.stateOfBoard == BoardState.occupied);
// To prevent a player to grab the next move during the game this can only be called
// when the game is not yet running
// SHOULD require(boardOne.stateOfGame == GameState.notStarted);
        boardOne.nextMove = msg.sender;
        boardOne.stateOfGame = GameState.running;
    }

    //Players provide the row and column of the box they want to make the move in
// uint could be restricted to a uint8 eg
    function makeAMove(uint _row, uint _col) public onlyPlayers {
        require(boardOne.stateOfBoard == BoardState.occupied);              //board should be occupied
// a modifier CurrentPlayer would simplify this requirement and OnlyPLayers
        require(msg.sender == boardOne.nextMove);                           //the player invoking this method should have the legal next move
        require(_row<=2 && _row>=0 && _col<=2 && _col>=0);                  //the box provided should not be out of bounds 
        require(boardOne.stateOfGame == GameState.running);                 //the game should be running
        address defaultAddress;
        require(boardOne.boardPositions[_row][_col] == defaultAddress);     //the box provided should be empty (hence the defaultAddress)

        boardOne.boardPositions[_row][_col] = msg.sender;
        boardOne.numberOfMoves++;

        if (didIWin(msg.sender)) {
            if (msg.sender == boardOne.player1) {
                boardOne.stateOfGame = GameState.playerOneWon;
            }else {
                boardOne.stateOfGame = GameState.playerTwoWon;
            }
        }

        if (boardOne.nextMove == boardOne.player1) {                        //nextMove is assigned to the other player
            boardOne.nextMove = boardOne.player2;
        }else {
            boardOne.nextMove = boardOne.player1;
        }
        if (boardOne.numberOfMoves == 9 ) {                                 //if 9 moves have been made and no one has one, game is tied
            boardOne.stateOfGame = GameState.tied;
        }
    }

    //Checks for all the possible positions from which a player can win
    //  00  01  02
    //  10  11  12
    //  20  21  22
    //[00,11,22], [02,11,20] (Diagonal)
    //[00,01,02], [10,11,12], [20,21,22] (Horizontal)
    //[00,10,20], [01,11,21], [02,12,22] (Vertical)
    function didIWin(address _player) internal view returns(bool) {
        if (isItAScore(0, 1, 2, 0, 1, 2, _player) || isItAScore(0, 1, 2, 2, 1, 0, _player)) {
            return true;
        }
        for (uint i = 0; i < 3; i++) {
            if (isItAScore(i, i, i, 0, 1, 2, _player) || isItAScore(0, 1, 2, i, i, i, _player)) {
                return true;
            } 
        }
        return false;
    }

    //Assists didIWin, checks for provided position from didIWin
    function isItAScore(uint _r1, uint _r2, uint _r3, uint _c1, uint _c2, uint _c3, address _player) internal view returns(bool) {
        if (boardOne.boardPositions[_r1][_c1] == _player && boardOne.boardPositions[_r2][_c2] == _player && boardOne.boardPositions[_r3][_c3] == _player) {
            return true;
        } else {
            return false;
        }
    }

    //This method would assist in case a UI is developed on top of this
    //Provides the occupied positions on the board and the respective players
    function getBoardPositions () public view returns (address[]) {
        address[] memory boardState = new address[](9);
        uint counter = 0;
        for (uint i = 0; i < 3; i++) {
            for (uint j = 0; j < 3; j++) {
                boardState[counter] = boardOne.boardPositions[i][j];
                counter++;
            }
        }
        return (boardState);
    }

    //returns current board state
    function getBoardState () public view returns (BoardState) {
        return(boardOne.stateOfBoard);
    }

    //returns current game state
    function getGameState () public view returns (GameState) {
        return(boardOne.stateOfGame);
    }

    //returns next player
    function getNextPlayer () public view returns (address) {
        return(boardOne.nextMove);
    }

    //reset board
    function resetBoard () public onlyAdmin {
        delete boardOne;
    } 

    modifier onlyPlayers() {
        require(msg.sender == boardOne.player1 || msg.sender == boardOne.player2);
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == ticTacAdmin);
        _;
    }
}