let step;
let mouseDist;
let fillFactor;
let agitateFactor;

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
	step = max(width,height)/4;
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

let projectPopup = document.querySelector(".project-popup");
let popCont = document.querySelector(".popup-container");

function toggleProjectPopup(proj){
	projectPopup.classList.toggle("active");

	if(proj == "sonar"){
		popCont.innerHTML = `
				<div class="popup-img">
					<img src="media/sonar-dj.png">
				</div>
				<h1>Sonar DJ</h1>
				<h5><a href="index.html" class="projlink">link</a> | <a href="index.html" class="codelink">code</a></h5>
				<p>
					Sonar DJ is an interactive electronic music installation made with Java, Processing, and Arduino. A sonar sensor constantly scans a mat in front of it. By placing different objects on the mat and moving them around, the user can trigger different sound loops and jam along to them live.
				</p>`;
	}
}