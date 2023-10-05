class Cell {
  constructor(_i, _j) {
    this.i = _i;
    this.j = _j;
    this.cells = [];
    this.neighbors = [];
    this.visited = false;
  }
  addSpots(_spots) {
    let i = this.i;
    let j = this.j;
    this.cells[0] = _spots[i * 2][j * 2];
    this.cells[1] = _spots[i * 2][j * 2 + 1];
    this.cells[2] = _spots[i * 2 + 1][j * 2 + 1];
    this.cells[3] = _spots[i * 2 + 1][j * 2];
    this.cells[1].wall = true;
    this.cells[2].wall = true;
    this.cells[3].wall = true;
  }
  addNeighbors(_cells) {
    let i = this.i;
    let j = this.j;
    if (i > 0) this.neighbors.push(_cells[i - 1][j]);
    if (j < rows / 2 - 1) this.neighbors.push(_cells[i][j + 1]);
    if (i < cols / 2 - 1) this.neighbors.push(_cells[i + 1][j]);
    if (j > 0) this.neighbors.push(_cells[i][j - 1]);
  }
  isVisited() {
    return this.visited;
  }
  checkNeighbors() {
    let unvisited = [];
    for (let i = 0; i < this.neighbors.length; i++) {
      if (this.neighbors[i] != null && !this.neighbors[i].isVisited())
        unvisited.push(this.neighbors[i]);
    }
    return unvisited;
  }
  highLight() {
    this.cells[0].highLight();
  }
}
