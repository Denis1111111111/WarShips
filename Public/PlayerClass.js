 class Player {
    constructor(id, shipsCoordinat) {
        this.id = id;
        this.shipsCoordinat = shipsCoordinat;
        this.lostShips = 0;
        this.sunkShips = 0;
        this.lostShipsInLastWalk = [];
        this.missEnemyInLastWalk = [];
    }
}

module.exports = Player;