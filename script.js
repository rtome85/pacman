const width = 28
const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
let squares = []
let score = 0

class Ghost {
    constructor(className, startIndex, speed){
        this.className = className
        this.startIndex = startIndex
        this.speed = speed
        this.currentIndex = startIndex
        this.isScared = false
        this.timerId = NaN
    }
}


//28 * 28 = 784
  // 0 - pac-dots
  // 1 - wall
  // 2 - ghost-lair
  // 3 - power-pellet
  // 4 - empty

const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,1,2,2,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 
]

createBoard()

//Initialize pacman 
let pacmanCurrentPos = 490;
squares[pacmanCurrentPos].classList.add('pacman')



//Event Listeners ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

//Move pacman event listener 
document.addEventListener('keydown', ev => {
    const keyPressed = ev.code

    switch (keyPressed) {
        //Move left 
        case 'ArrowLeft':
            updatePacmanPos(-1)
            break;
        //Move up
        case 'ArrowUp':
            updatePacmanPos(-width)          
            break;
        //Move right 
        case 'ArrowRight':
            updatePacmanPos(1)
            break;
        //Move down
        case 'ArrowDown':
            updatePacmanPos(width)
            break;
    
        default:
            break;
    }

} )

// Functions ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function createBoard() {

    for (let i = 0; i < layout.length; i++) {
        //Create square
        const square = document.createElement('div')
        //Put square in grid 
        grid.appendChild(square)
        //add square to squares list 
        squares.push(square)

        switch (layout[i]) {
            case 0:  
                squares[i].classList.add('pac-dot')
                break;
            case 1:
                squares[i].classList.add('wall')
                break;
            case 2:
                squares[i].classList.add('ghost-lair')
                break;
            case 3:
                squares[i].classList.add('power-pellet')
                break;                     
            default:
                break;
        }
    } 
}

function updatePacmanPos(step){

    //Validate if next position is valid 
    if(!squares[pacmanCurrentPos + step].classList.contains('wall') &&
       !squares[pacmanCurrentPos + step].classList.contains('ghost-lair') || 
       pacmanCurrentPos + step === 363 || pacmanCurrentPos + step === 392){

        switch (squares[pacmanCurrentPos + step].className) {
            case 'pac-dot':
                score += 1
                scoreDisplay.innerText = score
                break;

            case 'power-pellet':
                score += 10
                scoreDisplay.innerText = score
                ghosts.forEach(ghost => ghost.isScared = true )
                //calls function that freezes ghosts for a determined time interval 
                setTimeout( unscareGhosts, 10000 );
                break;

            case 'scared-ghost':
                score += 50
                break;
        
            default:
                break;
        }

        switch (pacmanCurrentPos + step) {
            case 363:
                squares[pacmanCurrentPos].classList.remove('pacman')
                pacmanCurrentPos = 392
                break;
 
            case 392:
                squares[pacmanCurrentPos].classList.remove('pacman')
                pacmanCurrentPos = 363
                break;     

            default:
                break;
        }
        
        squares[pacmanCurrentPos].classList.remove('pacman')
        squares[pacmanCurrentPos].classList.remove('pac-dot')
        squares[pacmanCurrentPos].classList.remove('power-pellet')
        pacmanCurrentPos = pacmanCurrentPos + step
        squares[pacmanCurrentPos].classList.add('pacman') 
    }
}

//Initialize ghosts 
const ghosts = [
    new Ghost('blinky', 348, 250),
    new Ghost('pinky', 376, 400),
    new Ghost('inky', 351, 300),
    new Ghost('clyde', 379, 500)
]
//Draw ghosts into grid using foreach iterator (more elegant than for of)
ghosts.forEach( ghost => {
    squares[ghost.startIndex].classList.add(ghost.className) 
    squares[ghost.startIndex].classList.add('ghost')
})

//Unscare ghosts
function unscareGhosts() {
    ghosts.forEach(ghost => ghost.isScared = false)
}

//Move ghosts 
ghosts.forEach( ghost => moveGhost(ghost));

//Move the ghosts in the board 
function moveGhost(ghost){
    const directions = [-1, +1, -width, +width]
    let direction = directions[ Math.floor(Math.random() * directions.length) ]

    ghost.timerId = setInterval( () => {
        //Code goes here 
        if (!squares[ghost.currentIndex + direction].classList.contains('wall') &&
        !squares[ghost.currentIndex + direction].classList.contains('ghost')) {

            squares[ghost.currentIndex].classList.remove(ghost.className)
            squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
            ghost.currentIndex += direction
            
            squares[ghost.currentIndex].classList.add('ghost')
            squares[ghost.currentIndex].classList.add(ghost.className) 
        } //else compute new direction using random()
        else direction = directions[ Math.floor(Math.random() * directions.length) ] 

        if (ghost.isScared) {
            squares[ghost.currentIndex].classList.add('scared-ghost')
            
        }
        else console.log('not scared')

    }, ghost.speed );
     
}


