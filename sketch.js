let player;
let pigeons = [];
let car = { x: -100, y: 570, speed: 6, color: [200, 50, 50], dir: 1, timer: 0 };
let humanEmoji = '🚶';
let playerFacingRight = false;

function setup() {
  createCanvas(1920, 1080);
  player = { x: 960, y: 850 };
  for (let i = 0; i < 15; i++) pigeons.push(new Pigeon());
}

function draw() {
  background(135, 206, 235);
  
  // Buildings
  drawBuilding(100, 100, 200, 400, 80);
  drawBuilding(500, 150, 300, 350, 90);
  drawBuilding(1100, 50, 400, 450, 70);
  
  // Sidewalks
  stroke(100); strokeWeight(2);
  for (let x = 0; x < 1920; x += 80) { 
    fill(180); rect(x, 480, 80, 100); 
    fill(180); rect(x, 750, 80, 100); 
  }
  noStroke(); fill(50, 180, 50); rect(0, 850, 1920, 230);
  
  // Road
  fill(40); rect(0, 540, 1920, 210);
  stroke(255, 255, 0); strokeWeight(8);
  for(let x = 0; x < 1920; x += 80) line(x, 645, x + 40, 645);
  noStroke();

  // Instructions
  fill(255); textSize(30);
  text("Use WASD to Walk", 50, 1040);

  // Car Logic
  if (car.timer > 0) car.timer--;
  else {
    fill(car.color[0], car.color[1], car.color[2]);
    rect(car.x, car.y + 20, 160, 50, 10);
    fill(200, 230, 255); rect(car.x + 30, car.y + 5, 100, 30, 10);
    fill(30);
    ellipse(car.x + 40, car.y + 70, 40, 40);
    ellipse(car.x + 120, car.y + 70, 40, 40);
    
    car.x += car.speed * car.dir;
    if (car.x > 2000 || car.x < -300) resetCar();
  }

  // Player Movement
  if (keyIsDown(87)) player.y -= 8;
  if (keyIsDown(83)) player.y += 8;
  if (keyIsDown(65)) { player.x -= 8; playerFacingRight = false; }
  if (keyIsDown(68)) { player.x += 8; playerFacingRight = true; }
  player.y = constrain(player.y, 480, 1050);
  
  push();
  translate(player.x, player.y);
  if (playerFacingRight) scale(-1, 1);
  textSize(80); textAlign(CENTER, CENTER); text(humanEmoji, 0, 0);
  pop();
  
  for (let p of pigeons) { p.update(player); p.show(); }
}

function drawBuilding(x, y, w, h, col) {
  fill(col); rect(x, y, w, h);
  fill(255, 255, 150);
  for (let wx = x + 20; wx < x + w - 30; wx += 50) {
    for (let wy = y + 20; wy < y + h - 30; wy += 50) rect(wx, wy, 30, 30);
  }
}

function resetCar() {
  car.dir = random() > 0.5 ? 1 : -1;
  car.x = (car.dir > 0) ? -200 : 2000;
  car.speed = random(4, 8);
  car.timer = random(100, 400); 
}

class Pigeon {
  constructor() {
    this.pos = createVector(random(1920), random(480, 1050));
    this.state = 'wandering'; this.timer = 0; this.facingRight = true;
  }
  update(player) {
    let dP = dist(this.pos.x, this.pos.y, player.x, player.y);
    if (dP < 100) { 
      let flee = p5.Vector.sub(this.pos, createVector(player.x, player.y)); 
      flee.setMag(10); 
      this.pos.add(flee); 
    }
    this.pos.y = constrain(this.pos.y, 480, 1050);
  }
  show() {
    push(); translate(this.pos.x, this.pos.y);
    if (!this.facingRight) scale(-1, 1);
    stroke(255, 215, 0); strokeWeight(5); line(-10, 10, -10, 25); line(10, 10, 10, 25);
    noStroke(); fill(80, 80, 120); ellipse(0, 0, 40, 30);
    fill(100, 100, 140); ellipse(15, -10, 25, 25); 
    fill(255, 180, 50); triangle(25, -12, 35, -8, 25, -4);
    fill(0); ellipse(20, -12, 10, 10); pop();
  }
}