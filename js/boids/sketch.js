
const boids = [];
var cnv;

let alignSlider, cohesionSlider, separationSlider;

function setup(){
	cnv = createCanvas(windowWidth, 360);
  	//cnv.style('display', 'block');
  	cnv.parent('js');
  	//centerCanvas();
  	//document.body.scrollTop = 0;
  	//document.body.style.overflow = 'hidden';
  	//cnv.width = document.body.clientWidth;
    //cnv.height = document.body.clientHeight;
	for(let i = 0; i < 100; i++){
		boids.push(new Boid());
	}
	
}

function centerCanvas() {
    
    cnv.position(x, y);
}

/*
function windowResized() {
  	centerCanvas();
}*/

function draw(){
	background(51);
	
	
	
	for(let boid of boids){
		boid.flock(boids); 
		boid.tick();
		boid.draw();
	}
	textSize(60);
	stroke(30);
	textAlign(CENTER);
	textFont('Georgia');
	fill(255);
	text('The Website Project', windowWidth / 2, 180);
}