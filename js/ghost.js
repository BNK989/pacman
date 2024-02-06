'use strict'

const GHOST = '👻'
var gGhosts = []

var gIntervalGhosts

function createGhosts(board, ghostsNum = 3) {
    // 3 ghosts and an interval
    gGhosts = []
    for (var i = 0; i < ghostsNum; i++) {
        createGhost(board,i)
    }
    
    if (gIntervalGhosts) clearInterval(gIntervalGhosts)
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function createGhost(board, i = 0) {
    const colors = ['red', 'orange','turquoise','pink','blue']
    const ghost = {
        id: i,
        location: {
            i: 2,
            j: 6+i
        },
        color: colors[i],
        currCellContent: FOOD
    }

    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    const moveDiff = getMoveDiff()//gets one step
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    // Return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return

    // Hitting pacman
    if (nextCell === PACMAN) {
        if(!gPacman.isSuper){
            gameOver()
            return
        } else{
            return//eatGhost(ghost.location)
        }
    }

    if(ghost.currCellContent === PACMAN) ghost.currCellContent = null
    // Moving from current location: what will stay behind.
    // Model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // DOM
    renderCell(ghost.location,  ghost.currCellContent)


    // Move the ghost to new location:
    // Update the model 
    ghost.location = nextLocation
    ghost.currCellContent = nextCell
    gBoard[ghost.location.i][ghost.location.j] = GHOST
    // Update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    const vulnerable = gPacman.isSuper
    const classes = `ghost ${vulnerable ? 'vulnerable' : ''} ${ghost.color}`
    return `<span class="${classes}">${GHOST}</span>`
}