var defense = [];
var offense = [];
var simulateBoard = [];
var strategy = {};

function simulation(board, player){
    var simulateBoard = JSON.parse(JSON.stringify(board));
    // simulateBoard = board;  
    for(var i = 0; i < 7; i++) {
        simulateAddChecker(i, player, simulateBoard)
    }
    strategy = {
        defense: defense,
        offense: offense
    }
    return strategy;
}

function simulateAddChecker(col, player, board) {
        lastCheckerSim = [];
        if (board[0][col] !== 0){
            return;
        }
        for (var j = 6 - 1; j >= 0; j--) {
            if (board[j][col] === 0) {
                board[j][col] = player.value;
                lastCheckerSim.push(col);
                lastCheckerSim.push(j);
                break;
            }
        }
        checkPosition(lastCheckerSim, board, player);
        board[lastCheckerSim[1]][lastCheckerSim[0]] = 0;
}

function checkPosition(position, board, player){

    var defenseSituation = {
        horizontal: 0,
        vertical: 0,
        diagonal: 0
    };

    var offenseSituation = {
        horizontal: 0,
        vertical: 0,
        diagonal: 0
    };

    // vertical simulation

    if (position[1] === 5 && player.value === 1) {
        defenseSituation.vertical = 1;
        defense[position[0]] = defenseSituation;
    } else if (position[1] === 5 && player.value === 2) {
        offenseSituation.vertical = 1;
        offense[position[0]] = offenseSituation;
    }
    else {
        var countVertical = 1;
        for (var k = 1; k <= 3; k++){
            if (position[1] + k > 5) {
                continue;
            }  
            if (board[position[1] + k][position[0]] === player.value){
                countVertical++
            } else {
                break;
            }
        }
        if (player.value === 1) {
            defenseSituation.vertical = countVertical;
            defense[position[0]] = defenseSituation;
        } else if (player.value === 2) {
            offenseSituation.vertical = countVertical;
            offense[position[0]] = offenseSituation;
        }
        
    }

    //horizontal simulation

    var countHorizontal = 1;
    for (var l = 1; l <= 3; l++ ){
        if (position[0] + l > 6 ) {
            continue;
        }
        if(board[position[1]][position[0] + l] === player.value) {
            if (countDiagonalTwo === 4) {
                break;
            }
            countHorizontal++;
        } else if (board[position[1]][position[0] + l] === 0) {
            continue;
        } else {
            break;
        }
    } 

    for (var m = 1; m <= 3; m++ ){
        if (position[0] - m < 0 ) {
            continue;
        }
        if(board[position[1]][position[0] - m] === player.value)  {
            if (countDiagonalTwo === 4) {
                break;
            }
            countHorizontal++;
        }  else if (board[position[1]][position[0] - m] === 0) {
            continue;
        } else {
            break;
        }
    }  
    if (player.value === 1) {
        defenseSituation.horizontal = countHorizontal;
        defense[position[0]] = defenseSituation; 
    } else if (player.value === 2) {
        offenseSituation.horizontal = countHorizontal;
        offense[position[0]] = offenseSituation;
    }
       

    // diagonal simulation 
    // direction /
    var countDiagonalOne = 1;
    for (var n = 1; n <= 3; n++ ){
        if (position[0] + n > 6 || position[1] - n < 0 ) {
            continue;
        }
        if(board[position[1] - n][position[0] + n] === player.value) {
            if (countDiagonalOne === 4) {
                break;
            }
            countDiagonalOne++;
        } else if (board[position[1] - n][position[0] + n] === 0){
            continue;
        } else {
            break;
        }
    } 
    for (var o = 1; o <= 3; o++ ){
        if (position[0] - o < 0 || position[1] + o > 5) {
            continue;
        }
        if(board[position[1] + o][position[0] - o] === player.value)  {
            if (countDiagonalOne === 4) {
                break;
            }
            countDiagonalOne++;
        } else if (board[position[1] + o][position[0] - o] === 0) {
            continue;
        } else {
            break;
        }
    } 
    // direction \
    var countDiagonalTwo = 1;
    for (var p = 1; p <= 3; p++ ){
        if (position[0] - p < 0 || position[1] - p < 0 ) {
            continue;
        }
        if(board[position[1] - p][position[0] - p] === player.value) {
            if (countDiagonalTwo === 4) {
                break;
            }
            countDiagonalTwo++;
        } else if (board[position[1] - p][position[0] - p] === 0) {
            continue;
        } else {
            break;
        }
    } 
    for (var q = 1; q <= 3; q++ ){
        if (position[0] + q > 6 || position[1] + q > 5) {
            continue;
        }
        if (board[position[1] + q][position[0] + q] === player.value) {
            if (countDiagonalTwo === 4) {
                break;
            }
            countDiagonalTwo++;
        } else if(board[position[1] + q][position[0] + q] === 0) {
            continue;
        }  else {
            break;
        }
    } 
    var countDiagonal = (countDiagonalOne >= countDiagonalTwo) ? countDiagonalOne : countDiagonalTwo;
    if (player.value === 1) {
        defenseSituation.diagonal = countDiagonal;
        defense[position[0]] = defenseSituation; 
    } else if (player.value === 2) {
        offenseSituation.diagonal = countDiagonal;
        offense[position[0]] = offenseSituation; 
    }
    console.log(defense)
    console.log(offense)
}  
