let lastRenderTime = 0;
let inputDirection = { x: 0, y: -1 }; //default direction is moving up
let food = { x: 10, y: 1 };
let newSegments = 0;

const gameGrid = document.getElementById("game-grid");
const SNAKE_SPEED = 4;
const EXPANSION_RATE = 1; //how much the snake grows after eating food
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
  addSegments();
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

  if (eat(food)) {
    expandSnake(EXPANSION_RATE);
    food = { x: 20, y: 1 };
  }
}

function expandSnake(amount) {
  newSegments = newSegments + amount;
}

function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    //duplicate the last segment of our snake and push it on the end
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;
}

function eat(position) {
  return snakeBody.some((segment) => {
    return equalPositions(segment, position);
  });
}

function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
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

  const foodElement = document.createElement("div");
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.gridRowStart = food.y;
  foodElement.classList.add("food");
  gameGrid.appendChild(foodElement);
}

requestAnimationFrame(main);
