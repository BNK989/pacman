'use strict'

const PACMAN = '😎'
var gPacman
var gMoveInterval
var gLastKeyPressed
var gMoveIntervalCount = 1

function createPacman(board) {
    gPacman = {
        location: {
            i: 2,
            j: 2
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function pressedLast(ev) {
    if (gMoveIntervalCount<1) return
    clearInterval(gMoveInterval)
    gLastKeyPressed = ev
    
    gMoveInterval = setInterval(()=>{
        gMoveIntervalCount++
        onMovePacman(gLastKeyPressed)
    },500)

    if(gMoveIntervalCount>=1) gMoveIntervalCount = 0
}

function onMovePacman(ev) {
    if (!gGame.isOn) return
    const nextLocation = nextLocationNew(ev.key)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    switch (nextCell) {
        case WALL: return
        case GHOST:
            if (gPacman.isSuper) {
                eatGhost(nextLocation)
            } else {
                gameOver()
                return
            }
            break
        case SUPERFOOD:
            if (!gPacman.isSuper) {
                superPacman()
            } else {
                return
            }
            break
        case FOOD:
            updateScore(1)
            checkVictory()
            break
        case CHERRY:
            updateScore(10)
            checkVictory()
            break
        default:
            break

    }

    // model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // DOM
    renderCell(gPacman.location, EMPTY)

    // model
    gPacman.location = nextLocation
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    // DOM
    renderCell(nextLocation, `<img class="pacman ${ev.key}" src="img/pacman3.png">`)
}

//MOVE BY INTERVAL

function nextLocationNew(eventKeyboard){
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }

    switch (eventKeyboard) {
        case 'ArrowUp':
            nextLocation.i--
            break
        case 'ArrowRight':
            nextLocation.j++
            break
        case 'ArrowDown':
            nextLocation.i++
            break
        case 'ArrowLeft':
            nextLocation.j--
            break
    }
    return nextLocation
}

function superPacman() {
    gPacman.isSuper = true
    const elAllGhosts = document.querySelectorAll(".ghost")
    elAllGhosts.forEach((ghost) => ghost.classList.add("vulnerable"))

    setTimeout(regularPacman, 5_000)
}

function regularPacman() {
    gPacman.isSuper = false

}

function eatGhost(cellPos) {
    const eattenGhosts = []
    console.log(cellPos)
    console.log(gBoard[cellPos.i][cellPos.j])

    //**GET RID OF FINDINDEX ***
    // const ghostIdx = gGhosts.findIndex((g)=> g.location.i === cellPos.i &&
    // g.location.j === cellPos.j)

    var ghostIdx
    for (let i = 0; i < gGhosts.length; i++) {
        const currGhostLocation = gGhosts[i].location
        console.log(i)
        if (currGhostLocation.i === cellPos.i &&
            currGhostLocation.j === cellPos.j) {
            ghostIdx = i
            
        }

    }


    const eattenGhost = gGhosts.splice(ghostIdx, 1)[0]
    eattenGhosts.push(eattenGhost)

    if (eattenGhosts.length > 0) {
        resuscitate(eattenGhosts)
    }
}

function resuscitate(ghosts) {

    setTimeout(() => {
        gGhosts.push(ghosts[0])
    }, 5_000)

}