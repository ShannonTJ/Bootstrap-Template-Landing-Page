let lastRenderTime = 0;
const SNAKE_SPEED = 2;
const snakeBody = [
  { x: 10, y: 11 },
  { x: 11, y: 11 },
  { x: 12, y: 11 },
]; //draw snake at the middle of the screen
const gameGrid = document.getElementById("game-grid");

//loop forever, updating the game's frames
function main(currentTime) {
  //always request next frame
  requestAnimationFrame(main);
  //divide by 1000 to convert from ms to seconds
  const deltaTime = (currentTime - lastRenderTime) / 1000;
  //check if the change in time is less than the render time
  //if so, exit immediately (no re-render)
  if (deltaTime < 1 / SNAKE_SPEED) {
    return;
  }

  lastRenderTime = currentTime;

  update();
  draw(gameGrid);
}

function update() {
  console.log("update snake");
}

function draw(gameGrid) {
  console.log("draw snake");
  snakeBody.forEach((segment) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.x; //set x coordinate of snake segment
    snakeElement.style.gridColumnStart = segment.y; //set y coordinate of snake segment
    snakeElement.classList.add("snake"); //color the snake blocks
    gameGrid.appendChild(snakeElement); //add snake segments to the grid
  });
}

requestAnimationFrame(main);
