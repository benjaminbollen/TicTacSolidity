var TicTac = artifacts.require("./TicTac.sol");

contract('TicTac', function(accounts) {


    it("At the beginning of game, the game state should be notStarted", function() {
        return TicTac.new().then(function(instance) {
            return instance.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 0, "Game State wasn't notStarted in beginning");
        });
    });

    it("At the beginning of game, the board state should be empty", function() {
        return TicTac.new().then(function(instance) {
            return instance.getBoardState.call();
        }).then(function(stateOfBoard) {
            assert.equal(stateOfBoard, 0, "Board State wasn't empty in beginning");
        });
    });

    it("When players join, the board state should change from empty to playerWaiting to Occupied", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.getBoardState.call();
        }).then(function(stateOfBoard) {
            assert.equal(stateOfBoard, 1, "Board State wasn't playerWaiting after player one joined");
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.getBoardState.call();
        }).then(function(stateOfBoard) {
            assert.equal(stateOfBoard, 2, "Board State wasn't occupied after player two joined");
        });
    });

    it("Once the game starts, the game state changes to running", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 1, "Game State wasn't running");
        });
    });

    it("Once the game starts, the next move is assigned to player who started the game", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.getNextPlayer.call();
        }).then(function(playerOne) {
            assert.equal(playerOne, account_one, "Player wasn't assigned correctly");
        });
    });

    it("After every move, the next player is correctly assigned", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.getNextPlayer.call();
        }).then(function(playerOne) {
            assert.equal(playerOne, account_one, "Player wasn't assigned correctly");
        }).then(function(){
            return ticTacContract.makeAMove(0,0,{from: account_one});
        }).then(function(){
            return ticTacContract.getNextPlayer.call();
        }).then(function(nextPlayer) {
            assert.equal(nextPlayer, account_two, "Player wasn't assigned correctly");
        }).then(function(){
            return ticTacContract.makeAMove(0,2,{from: account_two});
        }).then(function(){
            return ticTacContract.getNextPlayer.call();
        }).then(function(nextPlayer) {
            assert.equal(nextPlayer, account_one, "Player wasn't assigned correctly");
        }).then(function(){
            return ticTacContract.makeAMove(1,1,{from: account_one});
        }).then(function(){
            return ticTacContract.getNextPlayer.call();
        }).then(function(nextPlayer) {
            assert.equal(nextPlayer, account_two, "Player wasn't assigned correctly");
        });
    });

    it("Game tied", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(2,1,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,1,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,2,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(1,0,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(2,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(2,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(0,1,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 2, "Game wasn't tied");
        });
    });

    it("Game tied", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(2,2,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(2,1,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,1,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,2,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(1,0,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(2,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,0,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(0,1,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 2, "Game wasn't tied");
        });
    });

    it("Game tied", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,1,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,1,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,2,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(1,0,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(2,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(2,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(2,1,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 2, "Game wasn't tied");
        });
    });

    it("Player one won", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(2,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(1,0,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(2,2,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 1, "Game result is not correct");
        }).then(function(){
            return ticTacContract.makeAMove(1,1,{from: account_two});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 1, "Game result is not correct");
        }).then(function(){
            return ticTacContract.makeAMove(2,1,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 3, "Player one did not win");
        });
    });

    it("Player one won", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(2,2,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(1,1,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(2,0,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 1, "Game result is not correct");
        }).then(function(){
            return ticTacContract.makeAMove(2,1,{from: account_two});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 1, "Game result is not correct");
        }).then(function(){
            return ticTacContract.makeAMove(1,0,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 3, "Player one did not win");
        });
    });

    it("Player one won", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,1,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(1,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(2,2,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 3, "Player one did not win");
        });
    });

    it("Player two won", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(2,0,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,1,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 1, "Game result is not correct");
        }).then(function(){
            return ticTacContract.makeAMove(1,2,{from: account_two});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 1, "Game result is not correct");
        }).then(function(){
            return ticTacContract.makeAMove(2,1,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 1, "Game result is not correct");
        }).then(function(){
            return ticTacContract.makeAMove(2,2,{from: account_two});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 4, "Player two did not win");
        });
    });

    it("Player two won", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(1,1,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,0,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(2,0,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,2,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,2,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 1, "Game result is not correct");
        }).then(function(){
            return ticTacContract.makeAMove(0,1,{from: account_two});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 4, "Player two did not win");
        });
    });

    it("Player two won", function() {
        var account_one = accounts[0];
        var account_two = accounts[1];
        var ticTacContract;

        return TicTac.new().then(function(instance) {
            ticTacContract = instance;
            return ticTacContract.joinGame({from: account_one});
        }).then(function(){
            return ticTacContract.joinGame({from: account_two});
        }).then(function(){
            return ticTacContract.startNewGame({from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,2,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(0,0,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,1,{from: account_one});
        }).then(function(){
            return ticTacContract.makeAMove(1,0,{from: account_two});
        }).then(function(){
            return ticTacContract.makeAMove(1,2,{from: account_one});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 1, "Game result is not correct");
        }).then(function(){
            return ticTacContract.makeAMove(2,0,{from: account_two});
        }).then(function(){
            return ticTacContract.getGameState.call();
        }).then(function(stateOfGame) {
            assert.equal(stateOfGame, 4, "Player two did not win");
        });
    });

});