let step;
let mouseDist;
let fillFactor;
let agitateFactor;

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

function setup(){
	var canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0,0);
	// stay behind everything
	canvas.style('z-index', '-1');
	frameRate(30);
} 

function draw(){
	step = min(width,height)/3;
	background(250);
	for(let x = -step; x <= width + step; x += step){
		for(let y = -step; y <= height + step; y += step){
			mouseDist = dist(mouseX, mouseY, x, y);
			fillFactor = constrain(map(mouseDist, 0, 1000, 30, 60), 30, 60);
			agitateFactor = constrain(map(mouseDist, 0, 1000, 0, step/3), 0, step/3);
			drawCirc(x,y, mouseDist, fillFactor, agitateFactor);
		}
	}
}

function drawCirc(x, y, mouseDist, fillFactor, agitateFactor){
	noStroke();
	// blendMode(DIFFERENCE);

	// let agitateFactor = step/1.5;
	fill(237, 88, 210, fillFactor);
	ellipse(x + agitateFactor/3, y + agitateFactor/3, step/1.3, step/1.3);
	fill(41, 249, 255, fillFactor);
	ellipse(x, y - agitateFactor/2, step/1.3, step/1.3);
	fill(255, 251, 25, fillFactor);
	ellipse(x - agitateFactor/3, y + agitateFactor/3, step/1.3, step/1.3);
}