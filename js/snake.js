const canvas = document.querySelector('#snake')
const ctx = canvas.getContext('2d')

const box = 32

const background = new Image()
background.src = 'img/board-bg.png'

const foodImg = new Image()
foodImg.src = 'img/food.png'

const moveUpAudio = new Audio('audio/up.mp3')
const moveDownAudio = new Audio('audio/down.mp3')
const moveLeftAudio = new Audio('audio/left.mp3')
const moveRightAudio = new Audio('audio/right.mp3')
const eatAudio = new Audio('audio/eat.wav')
const gameOverAudio = new Audio('audio/game-over.wav')

let score, food, game, direction
let snake = []
let bestScore = 0

document.addEventListener('keydown', changeDirection);

init()

function init() {
    score = 0
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    }
    food = generateFoodPosition()
    game = setInterval(update, 100)
    direction = ''
}

function draw() {
    ctx.drawImage(background, 0, 0)

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = '#A7D83B';
        if (i === 0) {
            ctx.fillRect(snake[i].x, snake[i].y, box, box)
        } else {
            ctx.fillRect(snake[i].x + 4, snake[i].y + 4, 24, 24)
        }
    }

    ctx.drawImage(foodImg, food.x, food.y)

    ctx.fillStyle = 'white'
    ctx.font = '40px Ranchers'
    ctx.fillText(score.toString(), 2.2 * box, 1.7 * box)
    ctx.fillText(bestScore.toString(), 6.2 * box, 1.7 * box)
}

function update() {
    draw()

    let snakeHeadX = snake[0].x
    let snakeHeadY = snake[0].y

    if (direction === 'UP') snakeHeadY -= box
    else if (direction === 'DOWN') snakeHeadY += box
    else if (direction === 'LEFT') snakeHeadX -= box
    else if (direction === 'RIGHT') snakeHeadX += box

    if (snakeHeadX === food.x && snakeHeadY === food.y) {
        eatAudio.play()
        score++;
        food = generateFoodPosition()
        if (bestScore < score) bestScore = score
    } else {
        snake.pop()
    }

    let newSnakeHead = {
        x: snakeHeadX,
        y: snakeHeadY
    }

    if (snakeHeadX < box || snakeHeadX > 17 * box || snakeHeadY < 3 * box || snakeHeadY > 17 * box
        || snakeCollision(newSnakeHead, snake)) {
        clearInterval(game)
        showGameOverScreen()
        gameOverAudio.play()
    }

    snake.unshift(newSnakeHead)
}

function changeDirection(event) {
    switch (event.key) {
        case "Up":
        case "ArrowUp":
            if (direction !== 'DOWN') {
                direction = 'UP'
                moveUpAudio.play()
            }
            break
        case "Down":
        case "ArrowDown":
            if (direction !== 'UP') {
                direction = 'DOWN'
                moveDownAudio.play()
            }
            break
        case "Left":
        case "ArrowLeft":
            if (direction !== 'RIGHT') {
                direction = 'LEFT'
                moveLeftAudio.play()
            }
            break
        case "Right":
        case "ArrowRight":
            if (direction !== 'LEFT') {
                direction = 'RIGHT'
                moveRightAudio.play()
            }
            break
        default:
            return
    }
}

function snakeCollision(snakeHead, snakeArray) {
    for (let i = 0; i < snakeArray.length; i++) {
        if (snakeHead.x === snakeArray[i].x && snakeHead.y === snakeArray[i].y) {
            return true
        }
    }
    return false
}

function generateFoodPosition() {
    let randomPosition
    let snakeAtGeneratedPosition

    do {
        randomPosition = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        }

        snakeAtGeneratedPosition = snake.find(element => {
            return element.x === randomPosition.x && element.y === randomPosition.y
        })
    } while (snakeAtGeneratedPosition !== undefined)

    return randomPosition
}

function showGameOverScreen() {
    document.querySelector('.game-over').style.display = 'block'
    document.querySelector('#score').innerText = score
    const resetButton = document.querySelector('.restart-button')
    resetButton.addEventListener('click', restart)
}

function hideGameOverScreen() {
    document.querySelector('.game-over').style.display = 'none'
}

function restart() {
    snake = []
    hideGameOverScreen()
    init()
}