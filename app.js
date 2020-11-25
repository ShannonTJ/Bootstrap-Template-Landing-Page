let lastRenderTime = 0;
let inputDirection = { x: 0, y: -1 }; //default direction is moving up
let food = { x: 0, y: 0 };

const gameGrid = document.getElementById("game-grid");
const SNAKE_SPEED = 4;
const snakeBody = [{ x: 11, y: 11 }]; //draw snake in the middle of the screen

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (lastInputDirection.y !== 0) break; //do not move the snake 180 degrees
      inputDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (lastInputDirection.y !== 0) break;
      inputDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (lastInputDirection.x !== 0) break;
      inputDirection = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (lastInputDirection.x !== 0) break;
      inputDirection = { x: 1, y: 0 };
      break;
  }
});

function getInput() {
  lastInputDirection = inputDirection;
  return inputDirection;
}

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
  const inputDirection = getInput();
  //start the iteration at the second-last segment
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    //shift the entire snake array upwards
    //current segment = values in the preceding segment
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  //move the head independently
  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
}

function draw(gameGrid) {
  //clear the grid
  gameGrid.innerHTML = "";
  //draw the new snake body
  snakeBody.forEach((segment) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridColumnStart = segment.x; //set x coordinate of snake segment
    snakeElement.style.gridRowStart = segment.y; //set y coordinate of snake segment
    snakeElement.classList.add("snake"); //color the snake blocks
    gameGrid.appendChild(snakeElement); //add snake segments to the grid
  });
}

requestAnimationFrame(main);
