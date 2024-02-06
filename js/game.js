'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPERFOOD = '!'
const CHERRY = '🍒'

let gCherryInterval 

// Model
const gGame = {
    score: 0,
    isOn: false
}
var gBoard

function onInit() {
    updateScore(0)
    gBoard = buildBoard(15)
    createGhosts(gBoard)
    createPacman(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
    document.querySelector(".modal-container").style.display = "none"
    gCherryInterval = setInterval(placeCherry,15_000)
    if(gMoveInterval) clearInterval(gMoveInterval)

    // moveGhosts()
}

function buildBoard(size = 10) {
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            
            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
            
        }
    }
    //place superfood
    board[1][size - 2] = 
    board[size - 2][size - 2] = 
    board[size - 2][1] = 
    board[1][1] = SUPERFOOD
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            var className = `cell cell-${i}-${j}`
            if (cell === WALL) className += ' wall'
            if (cell === WALL && i > 0 && j > 0 && i < board.length -1  &&  j < board[0].length -1 ) className += ' middle-wall'
           

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getAllEmptyCells(){
    const emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === EMPTY) {
                emptyCells.push({i,j})
            }
        }
    }

    return emptyCells
}

function placeCherry(){
    const emptyCells = getAllEmptyCells()

    if (emptyCells.length === 0) return
    const rand = getRandomIntInclusive(0,emptyCells.length-1)
    console.log(rand)
    const pickedPos = emptyCells[rand]
    console.log(pickedPos)

    //model
    gBoard[pickedPos.i][pickedPos.j] = CHERRY
    //dom
    renderCell(pickedPos, CHERRY)

    setTimeout(()=>{
        if(gBoard[pickedPos.i][pickedPos.j] === CHERRY){
            gBoard[pickedPos.i][pickedPos.j] = EMPTY
            renderCell(pickedPos, EMPTY)
        }
    },4_000)
}





function updateScore(diff) {
    // DONE: update model and dom
    if (!diff) {
        gGame.score = 0
    } else {
        gGame.score += diff
    }
    document.querySelector('span.score').innerText = gGame.score
}


function checkVictory(){
    if(countFood() === 0){
        victory()
    }
}

function countFood(){
    let remainingFood = -1
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell === FOOD) {
                remainingFood++
            }
        }
    }

    return remainingFood
}


function victory(){
    document.querySelector(".modal-container").style.display = "flex"
    const elModalTitle = document.querySelector(".modal-container h3")
    
    elModalTitle.innerText = "You Won! " +  gGame.score + " points"
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    renderCell(gPacman.location, '😵')
    gGame.isOn = false
    
}

function gameOver() {
    const elModalTitle = document.querySelector(".modal-container h3")
    
    elModalTitle.innerText = "You Lose "
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    renderCell(gPacman.location, '😵')
    document.querySelector(".modal-container").style.display = "flex"
    gGame.isOn = false
}