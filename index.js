
//get elements
const $btnStartPause = document.getElementById("btn-start")
const $btnReset = document.getElementById("btn-reset")
const $mobileButtons = document.querySelector(".buttons")
const $score = document.getElementById("score")
const $gameover = document.getElementById("gameover")

let $gridSquares = Array.from(document.querySelectorAll(".container-content > .grid .cell"))
let $gridSquaresPanel = Array.from(document.querySelectorAll(".panel > .grid .cell"))

//variables and constants

//dimensions
const gridWidth = 10
const panelWidth = 6

//shapes 
const tShapes = [
  [1, gridWidth, gridWidth+1, gridWidth+2],
  [1, gridWidth+1, gridWidth*2 +1, gridWidth+2],
  [gridWidth, gridWidth+1, gridWidth+2, gridWidth*2 +1],
  [1, gridWidth, gridWidth+1, gridWidth*2 +1],
]

const lShapes = [
  [0, gridWidth, gridWidth*2, gridWidth*2 +1],
  [gridWidth, gridWidth+1, gridWidth+2, gridWidth*2],
  [0, 1, gridWidth+1, gridWidth*2 +1],
  [gridWidth, gridWidth+1, gridWidth+2, 2]
]

const l2Shapes = [
  [1, gridWidth+1, gridWidth*2 +1, gridWidth*2],
  [gridWidth, gridWidth*2, gridWidth*2 +1, gridWidth*2 +2],
  [1, 2, gridWidth+1, gridWidth*2 +1],
  [gridWidth, gridWidth+1, gridWidth+2, gridWidth*2 +2]
]

const oShapes = [
  [0, 1, gridWidth, gridWidth+1],
  [0, 1, gridWidth, gridWidth+1],
  [0, 1, gridWidth, gridWidth+1],
  [0, 1, gridWidth, gridWidth+1]
]

const iShapes = [
  [1, gridWidth+1, gridWidth*2 +1, gridWidth*3 +1],
  [gridWidth, gridWidth+1, gridWidth+2, gridWidth+3],
  [1, gridWidth+1, gridWidth*2 +1, gridWidth*3 +1],
  [gridWidth, gridWidth+1, gridWidth+2, gridWidth+3]
]

const zShapes = [
  [0, 1, gridWidth+1, gridWidth+2],
  [2, gridWidth+2, gridWidth+1, gridWidth*2 +1],
  [0, 1, gridWidth+1, gridWidth+2],
  [2, gridWidth+2, gridWidth+1, gridWidth*2 +1]
]

const z2Shapes = [
  [gridWidth, gridWidth+1, 1, 2],
  [1, gridWidth+1, gridWidth+2, gridWidth*2 +2],
  [gridWidth, gridWidth+1, 1, 2],
  [1, gridWidth+1, gridWidth+2, gridWidth*2 +2],
]

const allShapes = [tShapes, lShapes, l2Shapes, oShapes, iShapes, zShapes, z2Shapes]

//shape, position and rotation
let currentPosition = 3
let currentRotation = 0
let randomShape = Math.floor(Math.random() * allShapes.length)
let currentShape = allShapes[randomShape][currentRotation]
//FPS
let FPS = null
//next shape and mini-grid
let nextPosition = 2

let possibleNextShapes = [
  [1, panelWidth, panelWidth+1, panelWidth+2],
  [0, panelWidth, panelWidth*2, panelWidth*2 +1],
  [1, panelWidth+1, panelWidth*2 +1, panelWidth*2],
  [0, 1, panelWidth, panelWidth+1],
  [1, panelWidth+1, panelWidth*2 +1, panelWidth*3 +1],
  [0, 1, panelWidth+1, panelWidth+2],
  [panelWidth, panelWidth+1, 1, 2]
]

let nextRandomShape = 0
let nextShape = []

//colors
const colors = ["red", "blue", "yellow", "purple", "black", "white", "pink"]
let currentColor = Math.floor(Math.random() * colors.length)
let nextColor = colors[currentColor]

//function area
function drawGame(){
  
  currentShape.map(indexShape => {
    $gridSquares[indexShape + currentPosition].classList.add("shape-painted", `shape-${colors[currentColor]}`)
  })

}

function unDrawGame(){
  
  currentShape.map(indexShape => {
    $gridSquares[indexShape + currentPosition].classList.remove("shape-painted", `shape-${colors[currentColor]}`)
  })
  
}

function moveDown(){
  freezeGame()
  
  unDrawGame()
  currentPosition+=gridWidth
  drawGame()
}

function freezeGame(){
  if (currentShape.some(indexShape =>
  $gridSquares[indexShape + currentPosition + gridWidth].classList.contains("filled"))){
    currentShape.map(indexShape => $gridSquares[indexShape + currentPosition].classList.add("filled"))
  
    currentPosition = 3
    currentRotation = 0
    randomShape = nextRandomShape
    currentShape = allShapes[randomShape][currentRotation]
    currentColor = nextColor
    
    drawGame()
    displayNextShape()
    checkIfRowIsFilled()
    updateScore(10)
    gameOver()
  }
  
}

//moves
function moveLeft(){
  
  const isLeftEdgeLimit = currentShape.some(indexShape => ((indexShape + currentPosition) % gridWidth === 0))
  const isNextPosFilled = currentShape.some(indexShape => $gridSquares[indexShape + currentPosition -1].classList.contains("filled"))
  if (isLeftEdgeLimit || isNextPosFilled) return
  
  unDrawGame()
  currentPosition--
  drawGame()
}

function moveRight(){
  
  const isRightEdgeLimit = currentShape.some(indexShape => (indexShape + currentPosition) % gridWidth === gridWidth-1)
  const isNextPosFilled = currentShape.some(indexShape => $gridSquares[indexShape + currentPosition + 1].classList.contains("filled"))
  if (isRightEdgeLimit || isNextPosFilled) return
  
  unDrawGame()
  currentPosition++
  drawGame()
}

function rotate(){
  unDrawGame()
  
  if (currentRotation === currentShape.length-1){
    currentRotation = 0
  } else {
    currentRotation++
  }
  currentShape = allShapes[randomShape][currentRotation]
  
  const isLeftEdgeLimit = currentShape.some(indexShape => (indexShape + currentPosition) % gridWidth === 0)
  const isRightEdgeLimit = currentShape.some(indexShape => (indexShape + currentPosition) % gridWidth === gridWidth-1)
  const isNextPosFilled = currentShape.some(indexShape => $gridSquares[indexShape + currentPosition].classList.contains("filled"))
  if ((isLeftEdgeLimit && isLeftEdgeLimit) || isNextPosFilled) {
    if (currentRotation === 0){
      currentRotation = currentShape.length-1
    } else {
      currentRotation--
    }
    currentShape = allShapes[randomShape][currentRotation]
  }

  drawGame()
  
}

function checkIfRowIsFilled(){
  
  for (let row = 0; row < $gridSquares.length; row+=gridWidth){
   let currentRow = []
    for (let square = row; square < row+gridWidth; square++){
      currentRow.push(square)
    }
    
  const isRowFilled = currentRow.every(square => $gridSquares[square].classList.contains("shape-painted"))
   if (isRowFilled){
      const squaresRemoved = $gridSquares.splice(row, gridWidth)
      squaresRemoved.map(square => {
        square.classList.remove("filled", "shape-painted", `shape-${colors[currentColor]}`)
        square.removeAttribute("class")
        square.classList.add("cell")
      })
      $gridSquares = squaresRemoved.concat($gridSquares)
      $gridSquares.map($square => $gridGame.appendChild($square))
      updateScore(100)
    }
  }
}

function updateScore(score){
  let scoreUpdated = parseInt($score.innerText)
  $score.innerText = scoreUpdated + score
}

function displayNextShape(){

  $gridSquaresPanel.map($indexGrid => $indexGrid.classList.remove("shape-painted", `shape-${colors[nextColor]}`))
  //generate new shape
  nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)
  nextShape = possibleNextShapes[nextRandomShape]
  nextColor = Math.floor(Math.random() * colors.length)
  
  nextShape.map(indexShape => {
    $gridSquaresPanel[indexShape + nextPosition + panelWidth].classList.add("shape-painted", `shape-${colors[nextColor]}`)
  })

}

function gameOver(){
  
  if (currentShape.some(indexShape => $gridSquares[indexShape + currentPosition].classList.contains("filled"))){
    clearInterval(FPS)
    FPS = null
    $btnStartPause.setAttribute("disabled", true)
    $btnStartPause.innerText = "..."
    
    $gridGame.classList.add("gray-scale")
    $gridPanel.classList.add("gray-scale")
    $gameover.style.display = "flex"
  }
  
}

function startOrPauseGame(e){
  if (FPS){
    e.target.innerText = "Continuar"
    clearInterval(FPS)
    FPS = null
    return
  }
  
  e.target.innerText = "Pausar"
  FPS = setInterval(moveDown, 600)
  
}

function controlMobile(e){
  const id = e.target.getAttribute("id")
  if (FPS){
    if (id === "btn-left"){
      moveLeft()
    } else if (id === "btn-right"){
      moveRight()
    } else if (id === "btn-down"){
      moveDown()
    } else if (id === "btn-rotate"){
      rotate()
    }
  }
}

function controlKeyboard(e){
  const id = e.target.getAttribute("id")
  const key = e.key
  if (FPS){
    if (key === "ArrowLeft"){
      moveLeft()
    } else if (key === "ArrowRight"){
      moveRight()
    } else if (key === "ArrowDown"){
      moveDown()
    } else if (key === "ArrowUp"){
      rotate()
    }
  }
}

function resetGame(){
  location.reload()
}

//draw game
drawGame()

//events
$btnStartPause.addEventListener("click", startOrPauseGame)
$btnReset.addEventListener("click", resetGame)
$mobileButtons.addEventListener("click", controlMobile)
document.addEventListener("keydown", controlKeyboard)

//display shape
displayNextShape()