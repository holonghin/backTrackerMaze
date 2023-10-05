var cols = 10;
var rows = 10;
let autoPlay = false;
let checkBox, create, textBox, mode, origin;
let modeAI = false;
let human;
let isFinished = false;
function setup() {
  createCanvas(800 - 65, 800 - 65);
  frameRate(100000);
  displayDensity(pixelDensity());
  colorMode(HSB, 255);
  background(255);
  rectMode(CENTER);
  mode = createSelect("MODE");
  mode.position(width + 5, 20);
  mode.size(50);
  mode.option("HUMAN");
  mode.option("AI");
  mode.selected("HUMAN");
  mode.changed(modeSelect);
  create = createButton("create");
  create.position(width + 5, 90);
  create.mousePressed(createEvent);
  textBox = createInput();
  textBox.position(width + 5, 120);
  textBox.size(50);
  textBox.value("10");
  origin = createButton("origin");
  origin.position(width + 5, 150);
  origin.mousePressed(() => {
    human = spots[0][0];
  });
  createEvent();
}

function draw() {
  if (modeAI) {
    frameRate(100000);
    if (autoPlay && !isSolved && isGenerated) AStar();
  } else {
    frameRate(30);
    background(255);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        spots[i][j].show();
        
      }
    }
    for (let i of wall_spots) {
      i.show();
    }
    human.highLight();
    if (keyIsPressed === true) {
      if (keyCode === UP_ARROW || key == "w" || key == "W") {
        human = human.move(spots, 0, 1);
      }
      if (keyCode === DOWN_ARROW || key == "s" || key == "S") {
        human = human.move(spots, 0, -1);
      }
      if (keyCode === LEFT_ARROW || key == "a" || key == "A") {
        human = human.move(spots, -1, 0);
      }
      if (keyCode === RIGHT_ARROW || key == "d" || key == "D") {
        human = human.move(spots, 1, 0);
      }
    }
    if (human == end) {
      isFinished = true;
      createEvent();
    }
  }
}

var createEvent = () => {
  if (isFinished) {
    cols += 4;
    rows += 4;
  } else {
    cols = int(textBox.value());
    rows = int(textBox.value());
  }
  isFinished = false;
  spots = [];
  wall_spots = [];
  cells = [];
  stack = [];
  isSolved = false;
  isGenerated = false;
  start = null;
  end = null;
  openSet = [];
  closeSet = [];
  path = [];
  for (let i = 0; i < cols; i++) {
    let temp = [];
    for (let j = 0; j < rows; j++) {
      temp.push(new Spot(i, j));
    }
    spots.push(temp);
  }

  for (let i = 0; i < cols; i++) {
    let temp = [];
    for (let j = 0; j < rows; j++) {
      temp.push(new Cell(i, j));
    }
    cells.push(temp);
  }
  for (let i = 0; i < cols / 2; i++) {
    for (let j = 0; j < rows / 2; j++) {
      cells[i][j].addSpots(spots);
      cells[i][j].addNeighbors(cells);
    }
  }

  for (let i = -1; i < cols; i++) {
    wall_spots.push(new Spot(i, -1));
  }
  for (let j = -1; j < rows; j++) {
    wall_spots.push(new Spot(-1, j));
  }
  for (let i of wall_spots) {
    i.wall = true;
  }
  current = cells[0][0];
  current.visited = true;
  while (!isGenerated) backtracking();
  end = cells[cols / 2 - 1][rows / 2 - 1].cells[random([1, 3])];
  end.wall = false;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      spots[i][j].show();
    }
  }
  for (let i of wall_spots) {
    i.show();
  }
  if (modeAI) AStarIniti();
  else humanIniti();
};

function removeWall(a, b) {
  x = b.j - a.j;
  y = b.i - a.i;
  if (x == 1) a.cells[1].wall = false;
  if (x == -1) b.cells[1].wall = false;
  if (y == 1) a.cells[3].wall = false;
  if (y == -1) b.cells[3].wall = false;
}
function backtracking() {
  // current.highLight();
  unvisitedNeighbors = current.checkNeighbors();
  if (unvisitedNeighbors.length > 0) {
    let next = random(unvisitedNeighbors);
    stack.push(current);
    removeWall(current, next);
    next.visited = true;
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  } else {
    isGenerated = true;
  }
}

function AStarIniti() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      spots[i][j].addNeighbors(spots);
    }
  }
  start = spots[0][0];
  openSet.push(end);
  end.gCost = 0;
}

function AStar() {
  let minIndex = 0;
  for (let i = 0; i < openSet.length; i++) {
    if (openSet[i].fCost < openSet[minIndex].fCost) {
      minIndex = i;
    }
  }
  var current = openSet[minIndex];

  if (current == start) {
    path.push(current);
    let temp = current;
    while (temp.previous != null) {
      path.push(temp.previous);
      temp = temp.previous;
    }
    for (let p of path) p.show("#00000f");
    isSolved = true;
    print("Path is Found");
  }
  openSet.splice(minIndex, 1);
  closeSet.push(current);
  for (let neighbor of current.neighbors) {
    if (!closeSet.includes(neighbor) && !neighbor.wall) {
      let tempGCost = current.gCost + 1;
      if (openSet.includes(neighbor)) {
        if (tempGCost < neighbor.gCost) neighbor.gCost = tempGCost;
      } else {
        neighbor.gCost = tempGCost;
        openSet.push(neighbor);
      }
      neighbor.hCost = walkingDist(neighbor, start);
      neighbor.fCost = neighbor.gCost + neighbor.hCost;
      neighbor.previous = current;
    }
  }
  let s = closeSet[closeSet.length - 1];
  if (s)
    s.show(
      color(
        int(s.fCost) % 255,
        255,
        255
        // map(s.fCost, 0, cols + rows, 0, 255),
        // map(s.fCost, 0, cols + rows, 0, 255)
      )
    );
  start.show("#ffff00");
  end.show("#00ffff");
}
let walkingDist = (a, b) => abs(a.i - b.i) + abs(a.j - b.j);
function keyPressed() {
  if (key == " " && !isSolved && modeAI) {
    AStar();
  }
}
function humanIniti() {
  human = spots[0][0];
}
function modeSelect() {
  if (mode.value() == "HUMAN") {
    origin = createButton("origin");
    origin.position(width + 5, 150);
    origin.mousePressed(() => {
      human = spots[0][0];
    });
    checkBox.remove();
    modeAI = false;
    autoPlay = false;
    createEvent();
    humanIniti();
  } else {
    human.show();
    origin.remove();
    checkBox = createCheckbox("AutoPlay");
    checkBox.position(width + 5, 50);
    checkBox.changed(() => {
      autoPlay = !autoPlay;
    });
    modeAI = true;
    AStarIniti();
  }
}
