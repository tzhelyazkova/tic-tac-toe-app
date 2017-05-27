$(document).ready(function() {

//***temporary hardcoded***//
var signX = { 
    link : "https://cdn0.iconfinder.com/data/icons/solid-line-essential-ui-icon-set/512/essential_set_close-64.png",
    symbol : "x"
};
var signO = { 
    link : "https://cdn1.iconfinder.com/data/icons/material-core/20/check-circle-outline-blank-64.png",
    symbol : "o"
};
var userSign;
var computerSign;
setPlayerSymbol();
//***on-click events***//
$('#btnReset').click(function (){
    resetGame();
});
$('#btnSubmit').click(function (){
    setPlayerSymbol();
});

$('.flex-item').click(function (){
    console.log($(this).attr('id')+" clicked");
    $('#btnSubmit').prop('disabled', true);
    playerMove($(this).attr('id'), function(){
        if(isEndGame(userSign.symbol, "Human")) {
            return;
        }
        else {
            computerMove(function() {
                if(isEndGame(computerSign.symbol, "Computer")) {
                    return;
                }
            });
        }
    });
});

function setPlayerSymbol() {
    var usrChoice = $('input:checked').attr("value");
    userSign = (usrChoice === "x") ? signX : signO;
    computerSign = (usrChoice === "x") ? signO : signX;
}
/**
* @description clears the game board
* @method clearBoard
*/
function clearBoard() {
    $(".flex-item img").attr("src", "");
    $(".flex-item").attr("name", "");
}

/**
* @description sets the sign for a field
* @method setField
* @param {string} field - the name of the field which will be set
* @sign {string} - the sign to be set on the field - O or X
*/
function setField(field, sign) {
    console.log("setting "+sign.symbol);
    $("#"+ field + " img").attr("src", sign.link);
    $("#"+ field).attr("name", sign.symbol);
}

/**
* @description makes a filed non-clickable
* @method deactivateField
* @param {string} field - the name field which will be deactivated
*/
function deactivateField(field) {
    $(field).css("pointer-events", "none");
}

/**
* @description makes all the fields on the board clickable
* @method activateBoard
*/
function activateBoard() {
    $(".flex-item").css("pointer-events", "auto");
}

/**
* @description checks if there's a row with the same symbol (o or x)
* @method isHorizontalWin
* @param {array} rows - first digits of cells with the same symbols
*/
function isHorizontalWin(rows) {
    var sortedRows = rows.reduce(function (acc, current) {
        if (typeof acc[current] == 'undefined') {
            acc[current] = 1;
        } else {
            acc[current] += 1;
        }
            return acc;
        }, {});
    console.log("sortedRows: "+JSON.stringify(sortedRows));
    if (sortedRows["1"] === 3 || sortedRows["2"] === 3 || sortedRows["3"] === 3) {
        return true;
    }
    else {
        return false;
    }
}

/**
* @description checks if there's a column with the same symbol (o or x)
* @method isVerticalWin
* @param {array} cols - last digits of cells with the same symbols
*/
function isVerticalWin(cols) {
    var sortedCols = cols.reduce(function (acc, current) {
        if (typeof acc[current] == 'undefined') {
            acc[current] = 1;
        } else {
            acc[current] += 1;
        }
           return acc;
        }, {});
    console.log("sortedCols: "+JSON.stringify(sortedCols));
    if (sortedCols["1"] === 3 || sortedCols["2"] === 3 || sortedCols["3"] === 3) {
        return true;
    }
    else {
        return false;
    }
}

/**
* @description checks if there's a diagonal with the same symbol (o or x)
* @method isDiagonalWin
* @param {array} cols - IDs of cells with the same symbols
*/
function isDiagonalWin(diagonal) {
    if ((diagonal.indexOf("11") !== -1 && diagonal.indexOf("22") !== -1 && diagonal.indexOf("33") !== -1) ||
        (diagonal.indexOf("13") !== -1 && diagonal.indexOf("22") !== -1 && diagonal.indexOf("31") !== -1)
        ) 
    {
        return true;
    }
    else {
        return false;
    }
}

/**
* @description checks if the player won with his current move
* @method isWin
* @param {string} sign - the sign which the player uses (x or o)
*/
function isWin(sign) {
    var rows = [];
    var cols = [];
    var diagonal = [];
    $('.flex-item').each(function(i, obj) {
        if ($(obj).attr("name") === sign) {
            diagonal.push($(obj).attr("id"));
            rows.push($(obj).attr("id").substr(0, 1))
            cols.push($(obj).attr("id").substr(1))
        }
    });
    if (isHorizontalWin(rows)) 
        return true;
    else if (isVerticalWin(cols)) 
        return true;
    else if (isDiagonalWin(diagonal)) 
        return true;
    else 
        return false;
}

function computerMove(callback) {
    var field = "";
    sleep(1000).then(() => {
        console.log("computer move");
        var available = [];
        $('.flex-item').each(function(i, obj) {
            if ($(obj).css("pointer-events") !== "none") {
                available.push($(obj).attr("id"));
            }
        });
        field = available[Math.floor(Math.random()*available.length)];
        setField(field, computerSign);
        deactivateField("#"+field);
        return callback();
    });
}

function playerMove(field, callback) {
    setField(field, userSign);
    deactivateField("#"+field);
    return callback();
}

function resetGame() {
    clearBoard();
    activateBoard();
    $('#btnSubmit').prop('disabled', false);
    //$('input[value=x').prop('checked', true);
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function isBoardFull() {
    var temp = [];
    $('.flex-item').each(function(i, obj) {
        if ($(obj).attr("name") === undefined || $(obj).attr("name") === "") {
            temp.push($(obj).attr("id"));
        }
    });
    return temp.length === 0;
}

function isEndGame(symbol, player) {
    if (isWin(symbol)) {
        alert(player + " wins.");
        resetGame();
        return true;
    }
    else if(isBoardFull()) {
        alert("Noone wins.");
        resetGame();
        return true;
    }
    else {
        return false;
    }
}

});
