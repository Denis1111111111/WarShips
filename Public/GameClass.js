const Player = require('./PlayerClass');

class Game {
 
  constructor(idGame, idPlayer1, shipsCoordinatPlayer1) {
        this.id = idGame;
        this.player1 = new Player(idPlayer1, shipsCoordinatPlayer1);
        this.player2 = null;
        this.whoWalk = 1;
    }
}

module.exports = Game;