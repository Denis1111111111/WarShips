const Player = require('./PlayerClass');
const Game = require('./GameClass');
const Server = require('../Server');




let findPlayer = function findPlayer(idPlayer, game) {

    if (game.player1.id === idPlayer) {
        return game.player1;
    }

    else {
        return game.player2;
    }
}


let checkStatusPlayer =  function checkStatusPlayer(player, game) {

    if (game.player2 == null) {
        return 'wait';
    }

    if (Number(player.lostShips) == 5) {

        player.lostShips = 'knowsResult';
        player.sunkShips = 'knowsResult';
        deleteGame(game);

        return 'youLose';
    }

    if (Number(player.sunkShips) == 5) {

        player.sunkShips = 'knowsResult';
        player.lostShips = 'knowsResult';
        deleteGame(game);

        return 'youWin';
    }

    if (Number(game.whoWalk) == 1 && game.player1.id === player.id || Number(game.whoWalk) == 2 && game.player2.id === player.id) {
        return 'youShoot';
    }

    else {
        return 'wait';
    }


}



let createPlayer = function createPlayer(cells) {

    let now = new Date().toString();
    let player = new Player(now, cells);

    return player;
}



let createGame = function createGame(playerId, playShipsCoordinat) {
    let game;

    if (Server.listGames.length == 0) {
        game = new Game(1, playerId, playShipsCoordinat);
    }

    else {
        game = new Game(Number(Server.listGames[(Server.listGames.length - 1)].id) + 1, playerId, playShipsCoordinat);
    }

    return game;
}



let findGameForPlayer = function findGameForPlayer(player) {

    if (Server.listGames.length == 0) {
        return false;
    }

    else {

        if (Server.listGames[(Server.listGames.length - 1)].player2 != null) {
            return false;
        }

        if (Server.listGames[(Server.listGames.length - 1)].player2 == null) {
            Server.listGames[(Server.listGames.length - 1)].player2 = player;
            return true;
        }
    }
}



let findGame = function findGame(idGAme) {
    let game;
    Server.listGames.forEach(function (item) {

        if (item.id == idGAme) {
            game = item;
        }
    });

    return game;
}



let checkShoot = function checkShoot(target, idPlayer, game) {

    let answer = false;

    if (game.player1.id == idPlayer) {

        let arrCoord = game.player2.shipsCoordinat;
        arrCoord.forEach(function (item) {

            if (item.substring(1, item.length) == target.substring(1, target.length)) {

                answer = true;
                game.player2.lostShips = Number(game.player2.lostShips) + 1;
                game.player2.lostShipsInLastWalk.push(target.replace('E', 'U'));  
                game.player1.sunkShips = Number(game.player1.sunkShips) + 1;
            }
        });

        if(!answer)
        {
            game.player2.missEnemyInLastWalk.push(target.replace('E', 'U'));
        }
        
        
        return answer;
    }

    else {

        let arrCoord = game.player1.shipsCoordinat;
        arrCoord.forEach(function (item) {

            if (item.substring(1, item.length) == target.substring(1, target.length)) {

                answer = true;
                game.player1.lostShips = Number(game.player1.lostShips) + 1;
                game.player1.lostShipsInLastWalk.push(target.replace('E', 'U')); 
                game.player2.sunkShips = Number(game.player2.sunkShips) + 1;
            }
        });
    }

    if(!answer)
        {
            game.player1.missEnemyInLastWalk.push(target.replace('E', 'U'));
        }

    

    return answer;
}


let changeWhoWalk = function changeWhoWalk(idGAme) {
    Server.listGames.forEach(function (item) {

        if (item.id == idGAme) {

            if (Number(item.whoWalk) == 1) {
                item.whoWalk = 2;
                return;
            }

            if (Number(item.whoWalk) == 2) {
                item.whoWalk = 1;
            }
        }
    });
}

let findIdGame = function findIdGame(token) {
    let idGame;

    Server.listGames.forEach(function (item) {

        if (item.player1.id === token) {
            idGame = item.id;

            return false;
        }

        if (item.player2 != null) {
            if (item.player2.id === token) {
                idGame = item.id;
            }
        }
    });

    return idGame;
}

let deleteGame = function deleteGame(game) {
    if (game.player1.lostShips === 'knowsResult' && game.player2.lostShips === 'knowsResult') {
        let index = Server.listGames.indexOf(game);
        Server.listGames.splice(index, 1);
    }
}



module.exports.findPlayer = findPlayer;
module.exports.checkStatusPlayer = checkStatusPlayer;
module.exports.createPlayer = createPlayer;
module.exports.createGame = createGame;
module.exports.findGameForPlayer = findGameForPlayer;
module.exports.findGame = findGame;
module.exports.checkShoot = checkShoot;
module.exports.changeWhoWalk = changeWhoWalk;
module.exports.findIdGame = findIdGame;
module.exports.deleteGame = deleteGame;