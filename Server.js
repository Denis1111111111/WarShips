const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const Player = require('./Public/PlayerClass');
const Game = require('./Public/GameClass');
const functions = require('./Public/FunctionsServer');

const app = express();
app.listen('9000');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/Public', express.static('Public'));
app.use('/Pages', express.static('Pages'));

var listGames = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/Public/" + "Index.html");
});


app.post('*api/addPlayer', (req, res) => {

    let cells = JSON.parse(req.body.cells);
    let player = functions.createPlayer(cells);

    if (functions.findGameForPlayer(player)) {

        res.cookie('cookieName', player.id);
        res.send('ok');
        return;
    }


    let game = functions.createGame(player.id, player.shipsCoordinat);
    listGames.push(game);

    res.cookie('cookieName', player.id);
    res.send('ok');
});


app.post('*/api/shoot', (req, res) => {

    let target = req.body.target;
    let idPlayer = req.cookies.cookieName;
    let idGame = functions.findIdGame(idPlayer);
    let game = functions.findGame(idGame);

    if (functions.checkShoot(target, idPlayer, game)) {

        let answ = [target, 'hit'];
        answ = JSON.stringify(answ);

        res.send(answ);
        return;
    }

    let answ = [target, 'miss'];
    answ = JSON.stringify(answ);

    functions.changeWhoWalk(idGame);
    res.send(answ);
});


app.post('*/whatsNew', (req, res) => {

    let idPlayer = req.cookies.cookieName;
    let idGame = functions.findIdGame(idPlayer);
    let game = functions.findGame(idGame);
    let player = functions.findPlayer(idPlayer, game);

    let answer = functions.checkStatusPlayer(player, game);
    res.send(answer);
});





app.post('*/whoLost', (req, res) => {

    let idPlayer = req.cookies.cookieName;
    let idGame = functions.findIdGame(idPlayer);
    let game = functions.findGame(idGame);
    let player = functions.findPlayer(idPlayer, game);



    let answer = [];
    answer.push(player.lostShipsInLastWalk);
    answer.push(player.missEnemyInLastWalk);
    player.lostShipsInLastWalk = [];
    player.missEnemyInLastWalk = [];

    JSON.stringify(answer);
    res.send(answer);
});

module.exports.listGames = listGames;