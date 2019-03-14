(function() {
    var COLUMNS = 7;
    var ROWS = 6;
    var message = $('.message');
    var dark = $('.dark');
    var form = $('.form');
    var col = $('.column');
    var btn = $('.btn');
    var name1 = $('#name1');
    var name2 = $('#name2');
    var numberOfPlay = 1;
    var lastChecker = [];
    var win = false;
    var tie = false;
    var diagonalBoard = [];
    var verticalBoard = [];
    var strategy = {};
    var sumIndex=[];
    var freeCol = [true, true, true, true, true, true, true];

    var playerOne = {
        color: "yellow",
        name: "player 1",
        value: 1,
        win: 0,
        isPLaying: true
    };

    var playerTwo = {
        color: "red",
        name: "player 2",
        value: 2,
        win: 0,
        isPLaying: false
    };

    var playNow = playerOne;

    var board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ]

    function togglePlayer() {
        playerOne.isPLaying = !playerOne.isPLaying;
        playerTwo.isPLaying = !playerTwo.isPLaying;
        playNow = playerOne.isPLaying ? playerOne : playerTwo;
        setinfos(playNow)
    }

    function addCheckers(player, col) {
        if(numberOfPlay === 42) {
            tie = true;
            announceWinner(player)
        }
        if(!win) { 
            lastChecker = [];
            if (board[0][col] !== 0){
                return;
            }
            for (var i = ROWS - 1; i >= 0; i--) {
                if (board[i][col] === 0) {
                    board[i][col] = player.value;
                    lastChecker.push(col)
                    lastChecker.push(i)
                    break;
                }
            }
            numberOfPlay++
            $('.col' + lastChecker[0]+ '.row' +lastChecker[1])
                .html('<div class="'+ player.color +'"></div>');

            win = checkForWin();
            togglePlayer();

            if(win) {
                setTimeout(function(){
                    announceWinner(player);
                }, 500);
            }
            for (var j = 0; j < COLUMNS; j++ ){
                if (board[0][j] !== 0){
                    freeCol[j] = false;
                }
            }

            if (playNow === playerTwo && playerTwo.name === 'HAL') {
                simulation(board, player);
                strategy = simulation(board, playerTwo);
                var nextMove = bestNextMove(strategy, freeCol);
                setTimeout(function(){
                    addCheckers(playerTwo, nextMove);
                }, 1000);
            }     
        }      
    }

    function bestNextMove(strategy, freeCol) {
        var defResult = [];
        var offResult = [];
        sumIndex = [];
        for (var j = 0; j < COLUMNS; j++ ){
            if (freeCol[j] === false){
                strategy.defense[j].vertical = -25;
                strategy.defense[j].horizontal = -25;
                strategy.defense[j].diagonal = -25;
            }
        }

        var offenseIs4 = strategy.offense.findIndex( x => x.horizontal === 4 ||
                                                          x.vertical === 4 ||
                                                          x.diagonal === 4 );
        if (offenseIs4 !== -1 && freeCol[offenseIs4]) {
            return offenseIs4;
        }
        var defenseIs4 = strategy.defense.findIndex( x => x.horizontal === 4 ||
                                                          x.vertical === 4 ||
                                                          x.diagonal === 4 );
        if (defenseIs4 !== -1 && freeCol[defenseIs4]) {
            return defenseIs4;
        } 
        var offenseIs3 = strategy.offense.findIndex( x => x.horizontal === 3 ||
                                                          x.vertical === 3 ||
                                                          x.diagonal === 3 );
        if (offenseIs3 !== -1 && freeCol[offenseIs3]) {
            return offenseIs3;
        }
        var defenseIs3 = strategy.defense.findIndex( x => x.horizontal === 3 ||
                                                          x.vertical === 3 ||
                                                          x.diagonal === 3 );
        if (defenseIs3 !== -1 && freeCol[defenseIs3]) {
            return defenseIs3;
        }
        
        
        defResult = strategy.defense.map(function(el) {
            return el.horizontal + el.vertical + el.diagonal;       
        })
        offResult = strategy.offense.map(function(el) {
            return el.horizontal + el.vertical + el.diagonal;       
        })
        var sum = defResult.map(function(x, index) {
            return x + offResult[index]
        })

        var largest=[0];
        for(var i = 0; i < sum.length; i++){
          var comp = (sum[i] - largest[0]) > 0;
             if(comp) {
             largest = [];
             largest.push(sum[i]);
             }
        }
        for(var i = 0; i < sum.length; i++){
           var comp = sum[i] - largest[0] === 0;
           if(comp) {
           sumIndex.push(i);
           }
        }
        if (sumIndex.length >= 1) {
            // console.log(sumIndex)
            var nextcol = Math.floor(Math.random() * Math.floor(sumIndex.length)) + 1;
            return nextcol
        }
    }

    function checkForWin() {
        var horizontalResult = false;
        var verticalResult = false;
        var diagonalResult = false;

        // check for horizontal win 
        horizontalResult = checkFourInRow(board, 4);

        // check for vertical win
        verticalBoard = board[0].map(function(column, index){
            return board.map(function(row){
                return row[index];
            })
        })     
        verticalResult = checkFourInRow(verticalBoard, 4);

        // check for diagonal win
        var temp = [];
        diagonalBoard = [];

        for (var k = 0; k <= 2 * (COLUMNS - 1); k++) {
            for (var y = ROWS - 1; y >= 0; y--) {
                var x = k - y;
                if (x >= 0 && x < COLUMNS) {
                    temp.push(board[y][x]);
                }
            }
        }
        for (var l = 1; l <= ROWS; l++) {
            diagonalBoard.push(temp.splice(0, l));
        }
        for (var l = ROWS; l > 0; l--) {
            diagonalBoard.push(temp.splice(0, l));
        }
        var tempTwo = [];
        for (var k = 0; k <= 2 * (COLUMNS - 1); ++k) {
            for (var y = ROWS - 1; y >= 0; --y) {
                var x = k - (ROWS - y);
                if (x >= 0 && x < COLUMNS) {
                    tempTwo.push(board[y][x]);
                }
            }  
        }
        for (var l = 1; l <= ROWS; l++) {
            diagonalBoard.push(tempTwo.splice(0, l));
        }
        for (var l = ROWS; l > 0; l--) {
            diagonalBoard.push(tempTwo.splice(0, l));
        }

        diagonalBoard = diagonalBoard.filter(function(array){
            return array.length >= 4;
        })

        diagonalResult = checkFourInRow(diagonalBoard, 4);
     
        win = (horizontalResult || verticalResult || diagonalResult) ? true : false;
        return win;        
    }

    function checkFourInRow(array, length) {
        var result = false;
        array.forEach(function(arr) {
            var count = 1;
            var value = arr[0]; 
            for(var i = 1; i < arr.length; i++){
                if(arr[i] === value && arr[i] !== 0){
                    count++;
                    if (count === length) {
                        result = true;
                        break;
                    }
                } else {
                    value = arr[i];
                    count = 1;
                }
            } 
        })
        return result;
    }

    function setinfos(player) {
        if (player === playerOne) {
            $('#playerone').html("<div>"+ playerOne.name+" is playing...</div> \
                                <div>win: " + playerOne.win+ "</div>")
                           .addClass('isplaying1');
            $('#playertwo').html("<div>"+ playerTwo.name+" </div> <div>win: " + playerTwo.win +"</div>")
                           .removeClass('isplaying2');
        } else {
            $('#playerone').html("<div>"+ playerOne.name+"</div> \
                                <div>win: " + playerOne.win+ "</div>")
                           .removeClass('isplaying1');
            $('#playertwo').html("<div>"+ playerTwo.name+"  is playing...</div>  \
                                <div>win: " + playerTwo.win +"</div>")
                           .addClass('isplaying2');
        }
    }

    function announceWinner(player) {
        message.toggle();
        dark.css('transform', 'translateX(0%)');
        if (tie) {
            $('.message').html("<div class='text'>It's a Tie !</div> \
                                <div class='table'>Score \
                                <div class='score'>"+ playerOne.name +": "+ playerOne.win +"</div> \
                                <div class='score'>"+ playerTwo.name +": "+ playerTwo.win +"</div></div> \
                                <div class='reset'>Next Game</div>");
        } else {
            player.win++;
            $('.message').html("<div class='text'>"+ player.name+ " WIN !!</div> \
                                <div class='table'>Score \
                                <div class='score'>"+ playerOne.name +": "+ playerOne.win +"</div> \
                                <div class='score'>"+ playerTwo.name +": "+ playerTwo.win +"</div></div> \
                                <div class='reset'>Next Game</div>");
        } 
        $('.reset').on('click', function(){
            dark.css('transform', 'translateX(100%)');
            message.toggle();
            reset();
            $('.cheat').empty();
        })        
    }

    function reset() {
        $('.case').empty();
        win = false;
        tie = false;
        board = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];
        sumIndex = [];
        freeCol = [true, true, true, true, true, true, true];
        numberOfPlay = 1;
        setinfos(playNow);
        if (playNow === playerTwo && playerTwo.name === 'HAL') {
            togglePlayer();
        }
    }

    col.on('click', function() {
        if (playNow === playerTwo && playerTwo.name === 'HAL') {
            return;
        }
        var checkCol = $(this).index();
        addCheckers(playNow, checkCol);
    })

    col.on('mouseover', function() {
        $('.highlighted').removeClass('highlighted');
        $(this).children('.case').addClass('highlighted');
    })

    btn.on('click', function() {
        playerOne.name = name1.val() !== "" ? name1.val(): playerOne.name;
        playerTwo.name = name2.val() !== "" ? name2.val(): playerTwo.name;
        playerOne.win = 0;
        playerTwo.win = 0;
        if (playNow === playerTwo && playerTwo.name === 'HAL') {
            togglePlayer();
        }
        form.toggle();
        dark.css('transform', 'translateX(100%)');
        setinfos(playNow);
    })

    $('.btn__reset').on('click', function() {
        reset();
        form.toggle();
        dark.css('transform', 'translateX(0%)');
    })

    // CHEAT CODE
    var k = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var n = 0;
    var NapalmDeath = new Audio('assets/YouSuffer.mp3');
    $(document).keydown(function (e) {
        if (e.keyCode === k[n++]) {
            if (n === k.length) {
                for (var p = 0; p < COLUMNS; p++) {
                    if (board[3][p] === 0) {
                        while (!win) {
                            addCheckers(playNow, p);
                            togglePlayer();
                        }
                        NapalmDeath.play();
                    } else {
                        return;
                    }
                }
                $('.cheat').html("Got you ! Loser !!!");
                n = 0;
                togglePlayer();
                return false;
            }
        }
        else {
            n = 0;
        }
    });

    form.toggle();
    dark.css('transform', 'translateX(0%)');
}())