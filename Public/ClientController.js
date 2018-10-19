window.onload = function () {
    sessionStorage.clear();
}

var xhr = new XMLHttpRequest();


function clickOnTable(event) {

    if (!event.target.id || event.target.id === 'MyTable') {
        return;
    }

    let cells = sessionStorage.getItem('cells');

    if (cells == null) {
        cells = [];
        cells.push(event.target.id)
        sessionStorage.setItem('cells', JSON.stringify(cells));
    }

    else {

        if (checkReplayInCoordinat(cells, event.target.id)) {
            return;
        }

        cells = JSON.parse(cells);

        if (cells.length == 5) {
            return;
        }

        cells.push(event.target.id);
        sessionStorage.setItem('cells', JSON.stringify(cells));
    }
    document.getElementById(event.target.id).className = "th-Border-none background-black";
}


function checkReplayInCoordinat(cells, target) {
    let result = false;

    JSON.parse(cells).forEach(function (item) {

        if (item === target) {
            result = true;
            return false;
        }
    });

    return result;
}



function play() {
    let cells = sessionStorage.getItem('cells');
    cells = JSON.parse(cells);

    if (cells.length != 5) {
        return;
    }

    document.getElementById('MyTable').className = "table disableObject";
    cells = sessionStorage.getItem('cells');
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/addPlayer', false);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    sessionStorage.clear();
    xhr.send('cells=' + cells);
    document.getElementById('btnPlay').className = "btn disableObject";
    waiting();
}



function shoot(event) {

    if (!event.target.id || event.target.id === 'tableEnemy') {
        return;
    }

    document.getElementById('tableEnemy').className = "table disableObject";

    xhr.open('POST', '/api/shoot', false);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('target=' + event.target.id);
    let answer = xhr.responseText;

    answer = decodeURI(answer);
    answer = JSON.parse(answer, true);

    if (answer[1] === 'hit') {
        document.getElementById(answer[0]).className = 'background-red';
        waiting();
        return;
    }
    else {
        document.getElementById(answer[0]).className = 'background-yellow';
    }
    waiting();
}



function waiting() {
    var timer = setInterval(function () {

        document.getElementById('tableEnemy').className = "table disableObject";

        checkLostShips();

        xhr.open('POST', '/whatsNew', false);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send();
        let answer = xhr.responseText;



        if (answer != 'wait') {
            checkAnswer(answer);
            clearInterval(timer);
            return;
        }
        document.getElementById('text').innerHTML = 'Expect an opponent';
    }, 1000);
}



function checkAnswer(answer) {

    let text = document.getElementById('text');

    switch (answer) {
        case 'youShoot':
            {
                text.innerHTML = 'You shoot';
                document.getElementById('tableEnemy').className = "table";
                break;
            }

        case 'youWin':
            {
                text.innerHTML = 'You win';
                document.getElementById('tableEnemy').className = "table disableObject";
                document.getElementById('btnPlayAgain').className = "btn ";
                document.getElementById('btnPlay').className = "displayNone ";
                break;
            }

        case 'youLose':
            {
                text.innerHTML = 'You lose';
                document.getElementById('tableEnemy').className = "table disableObject";
                document.getElementById('btnPlayAgain').className = "btn ";
                document.getElementById('btnPlay').className = "displayNone ";
                break;
            }
    }
}



function playAgain() {
    document.location.href = "/";
}


function checkLostShips() {
    xhr.open('POST', '/whoLost', false);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();

    answer = xhr.responseText;
    answer = JSON.parse(answer);

    if (answer[0].length != 0) {
        answer[0].forEach(function (item) {
            document.getElementById(item).className = 'background-red';
        });
    }

    if (answer[1].length != 0) {
        answer[1].forEach(function (item) {
            document.getElementById(item).className = 'background-yellow';
        });
    }
}

