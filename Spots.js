class Spot {
  constructor(_i, _j) {
    this.i = _i;
    this.j = _j;
    this.w = width / (rows + 1);
    this.h = height / (cols + 1);
    this.x = (this.j + 1) * this.w + this.w / 2;
    this.y = (this.i + 1) * this.h + this.h / 2;
    this.wall = false;
    this.neighbors = [];
    this.gCost = float("inf");
    this.hCost = 0;
    this.fCost = 0;
    this.previous = null;
  }
  show(_color = "#ffffff") {
    if (this.wall) {
      stroke("#999999");
      fill("#999999");
    } else {
      stroke(_color)
      fill(_color)
    }
    rect(this.x, this.y, this.w, this.h);
    // if (openSet.includes(this) || closeSet.includes(this)){
    //   fill(0)
    //   textSize(12)
    //   text("G:" + str(this.gCost), this.x - this.w/2, this.y-this.h/4)
    //   text("H:" + str(this.hCost), this.x + this.w/6, this.y-this.h/4)
    //   text("F:" + str(this.fCost), this.x + this.w/6, this.y+this.h/3)
    //   textSize(18)
    // }
  }
  addNeighbors(_spots) {
    let i = this.i;
    let j = this.j;
    if (i > 0 && !_spots[i - 1][j].wall) this.neighbors.push(_spots[i - 1][j]);
    if (j < rows - 1 && !_spots[i][j + 1].wall) this.neighbors.push(_spots[i][j + 1]);
    if (j > 0 && !_spots[i][j - 1].wall) this.neighbors.push(_spots[i][j - 1]);
    if (i < cols - 1 && !_spots[i + 1][j].wall) this.neighbors.push(_spots[i + 1][j]);
  }
  highLight() {
    noStroke();
    fill("#ff5594");
    circle(this.x, this.y, this.w/1.3);
    fill("#000000");
    ellipse(this.x+15/this.w, this.y-10/this.w, this.w/16, this.h/6)
  }
  move(_spots, _x, _y){
    let i = this.i;
    let j = this.j;
    let x = _x;
    let y = _y
    let next;
    if (i > 0 && !_spots[i - 1][j].wall && y == 1) return  _spots[i - 1][j]
    else if (i < cols - 1 && !_spots[i + 1][j].wall && y == -1) return _spots[i + 1][j];
    else if (j > 0 && !_spots[i][j - 1].wall && x == -1) return _spots[i][j - 1];
    else if (j < rows - 1 && !_spots[i][j + 1].wall && x == 1) return _spots[i][j + 1];
    return this;
  }
}
