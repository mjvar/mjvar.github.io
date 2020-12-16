let step;

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

function setup(){
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0,0);
	// stay behind everything
	canvas.style('z-index', '-1');
}

function draw(){
	step = max(width,height)/8;
	blendMode(BLEND);
	background(250);
	for(let x = -step; x <= width + step; x += step){
		for(let y = -step; y <= height + step; y += step){
			drawCirc(x,y,dist(mouseX, mouseY, x, y));
		}
	}
}

function drawCirc(x, y, mouseDist){
	noStroke();
	blendMode(DIFFERENCE);
	let fillFactor = constrain(map(mouseDist, 0, 1000, 100, 255), 120, 255);
	let agitateFactor = constrain(map(mouseDist, 0, 1000, 0, step/3), 0, step/3);

	// let agitateFactor = step/1.5;
	fill(fillFactor,0,0,30);
	ellipse(x + agitateFactor/3, y + agitateFactor/3, step/1.3, step/1.3);
	fill(0,fillFactor,0,30);
	ellipse(x, y - agitateFactor/2, step/1.3, step/1.3);
	fill(0,0,fillFactor,30);
	ellipse(x - agitateFactor/3, y + agitateFactor/3, step/1.3, step/1.3);
}
