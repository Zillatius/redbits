let words = [];
let grav;
let gravR = 20;
let startX = 200;
let startY = 100;
let drag = 1;
let gravMag = 10;
let gravCon = 0.2;
let wordAmt = 0;
let velX = 0;
let velY = 0;
let maxVel = 2;
let historyLength = 10;

class word{
  constructor(x,y,destination){
    this.mass = 1;
    this.pos = createVector(x,y);
    this.vel = p5.Vector.random2D(0,5);
    this.acc = createVector(0,0);
    this.history = [];
    this.counter = 0;
    this.type = "dot";
    this.senior = null;
    this.junior = null;
    this.radius = 1;
    this.dest = destination;
    this.id = wordAmt;
    wordAmt++;
  }
  move(destination, mag){
    let grav;
    grav = destination
    //dokładanie do ogonka
    if(this.counter == 0){
      this.history.push(createVector(this.pos.x,this.pos.y));
    }
    if(this.history.length > historyLength){
      this.history.shift();
    }

    this.counter = (this.counter+1)%2;

    let d = 0.1+dist(this.pos.x, this.pos.y ,grav.x, grav.y);
    let dx = grav.x - this.pos.x;
    let dy = grav.y - this.pos.y;
    let dir = createVector(dx,dy);

    this.acc.x = dir.x * gravMag/d*mag;
    this.acc.y = dir.y * gravMag/d*mag;

    if(this.acc.mag() > maxVel/10){
      this.acc.setMag(maxVel/10);
    }

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    //skalowanie predkosci w zalezniosci od odleglosci od celu

    if(this.vel.mag() > maxVel){
      this.vel.setMag(maxVel);
    }


    this.pos.x = (this.pos.x + this.vel.x);
    this.pos.y = (this.pos.y + this.vel.y);
  }
  draw(){
    //rysowanie kulki
    switch(this.type){
      case "dot":
        stroke("red");
        fill("red");
        break;
    }
    ellipse(this.pos.x,this.pos.y, this.radius);
    //rysowanie ogonka
    stroke('red');
    noFill();
    strokeWeight(1);
    beginShape();
    this.history.forEach(x => {
      vertex(x.x,x.y);
    });
    endShape();
  }
}


function setup() {
  //wymiary canvasa
  canv = createCanvas(800,800);
  //dodawanie kulki na klika
  canv.mousePressed(function(){
    words.push(new word(mouseX,mouseY,int(random(0,wordAmt-1))));
  });
  //koordy dziury
  grav = createVector(width/2,height/2);
  for(let i = 0;i<150;i++){
    words.push(
      new word(canv.width/2+(i+150)*sin(i/150*2*3.14),
      canv.width/2+(i+150)*cos(i/150*2*3.14),
      int(i+random(5))%150)
    );
  }
}


function draw() {
  background(51);
  for(let i = 0; i < words.length; i++){
    words[i].move(words[words[i].dest].pos,1);
    words[i].move(grav,0.002);
    words[i].draw();

  }
  stroke(255);
  ellipse(grav.x,grav.y,gravR);
}
