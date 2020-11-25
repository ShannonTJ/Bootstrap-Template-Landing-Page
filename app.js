//CONST DECLARATIONS
const snakeBody = [{ x: 11, y: 11 }]; //draw snake in the middle of the screen
const GRID_SIZE = 21;
const SNAKE_SPEED = 4;
const EXPANSION_RATE = 1; //how much the snake grows after eating food
const gameGrid = document.getElementById("game-grid");

//LET DECLARATIONS
let lastRenderTime = 0;
let inputDirection = { x: 0, y: -1 }; //default direction is moving up
let newSegments = 0;
let gameOver = false;
let food = getRandomFoodPosition(); //set initial food position

//EVENT LISTENER
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

//---------------------------------------------------------------------------------------------//

//ADD SEGMENTS TO THE SNAKE
function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    //duplicate the last segment of our snake and push it on the end
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;
}

//GET A NEW FOOD POSITION
function getRandomFoodPosition() {
  let newFoodPosition;
  //generate a new position if the position is null or the food is generated on top of the snake
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    //generate a random position on the grid
    newFoodPosition = {
      x: Math.floor(Math.random() * GRID_SIZE) + 1,
      y: Math.floor(Math.random() * GRID_SIZE) + 1,
    };
  }
  return newFoodPosition;
}

//CHECK FOR SNAKE INTERSECTIONS
function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    //ignore the head "intersecting" with itself
    if (ignoreHead && index === 0) return false;
    //if the head (position) intersects with another segment, return true
    return segment.x === position.x && segment.y === position.y;
  });
}

//CHECK IF THE SNAKE LEAVES THE GRID
function outsideGrid(position) {
  return (
    position.x < 1 ||
    position.x > GRID_SIZE ||
    position.y < 1 ||
    position.y > GRID_SIZE
  );
}

//---------------------------------------------------------------------------------------------//

//UPDATE SNAKE AND FOOD DATA
function update() {
  //grow the snake
  addSegments();

  //start the iteration at the second-last segment
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    //shift the entire snake array upwards
    //current segment = values in the preceding segment
    snakeBody[i + 1] = { ...snakeBody[i] };
  }

  lastInputDirection = inputDirection;
  inputDirection = inputDirection;

  //move the head independently
  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;

  //if the food is eaten...
  if (onSnake(food)) {
    //grow the snake
    newSegments = newSegments + EXPANSION_RATE;
    //generate new food position
    food = getRandomFoodPosition();
  }
  //check for snake death (snake head outside grid or snake hitting itself)
  gameOver =
    outsideGrid(snakeBody[0]) || onSnake(snakeBody[0], { ignoreHead: true });
}

//REDRAW THE GRID
function draw(gameGrid) {
  if (gameOver) return;

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

  //draw the food element
  const foodElement = document.createElement("div");
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.gridRowStart = food.y;
  foodElement.classList.add("food");
  gameGrid.appendChild(foodElement);
}

//---------------------------------------------------------------------------------------------//

//MAIN FUNCTION
function main(currentTime) {
  //check for game over
  if (gameOver) {
    if (confirm("You lost. Press OK to restart.")) {
      //refresh the game
      location.reload();
    }
    return;
  }
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

  //update snake and food
  //redraw the grid
  update();
  draw(gameGrid);
}

//start main
requestAnimationFrame(main);
