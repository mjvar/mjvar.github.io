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

	if(proj == "sonar-dj"){
		popCont.innerHTML = `
				<div class="popup-img">
					<img src="media/sonar-dj.png">
				</div>
				<h1>Sonar DJ</h1>
				<h5><a href="https://www.youtube.com/watch?v=uY-fv90nOMc&feature=youtu.be" class="projlink">link</a> | <a href="https://github.com/mjvar/intro-to-interactive-media/tree/master/finalProject" class="codelink">code</a></h5>
				<p>
					Sonar DJ is an interactive electronic music installation made with Java, Processing, and Arduino. A sonar sensor constantly scans a mat in front of it. By placing different objects on the mat and moving them around, the user can trigger different sound loops and jam along to them live. The project also features audio visualizations using the Processing sound library.<br><br>This project was borned out of a desire I had to explore different tactile ways to make electronic music. I wanted to create something that felt responsive, and got people excited about making electronic music. 
				</p>`;
	}else if(proj == "bullet-time"){
		popCont.innerHTML = `
				<div class="popup-img">
					<img src="media/bullet-time.png">
				</div>
				<h1>Bullet Time</h1>
				<h5><a href="https://infairvar.itch.io/bullet-time" class="projlink">link</a> | <a href="https://github.com/mjvar/intro-to-interactive-media/tree/master/midtermProject" class="codelink">code</a></h5>
				<p>
					Bullet Time is a fast-paced bullet hell game where you can slow time. You pilot a ship (WASD/arrows) towards a portal, while dodging an onslaught of bullets from enemies. You can also use Slow (SPACE) to more precisely control your ship. This consumes a limited Slow Meter that slows both the bullets and your ship, allowing you to perfectly time and execute tight maneuvers. If you hold the button for too long, though, your Slow Meter depletes, which fast forwards the game back to normal speed. <br><br> I've always been fascinated by hard games, even though I'm not very good at them. What entices me about them is the feeling of invincibility one gets after failing a level over and over, and then succeeding in the end. In Bullet Time, I strove to make the game feel difficult but also satisfying.
				</p>`;
	}else if(proj == "map"){
		popCont.innerHTML = `
				<div class="popup-img">
					<img src="media/map.png">
				</div>
				<h1>Procedural Map Generation</h1>
				<h5><a href="https://github.com/mjvar/intro-to-interactive-media/tree/master/September22" class="codelink">code & docs</a></h5>
				<p>
					I wrote a procedural map generation tool in Java that generates maps (for use in games, Dungeons & Dragons campaigns, etc.) from Voronoi tessellations. The system generates Voronoi tessellations and uses Manhattan distance calculations to emulate land features like islands and lakes.
				</p>`;
	}
	else if(proj == "body"){
		popCont.innerHTML = `
				<div class="popup-img">
					<img src="media/body.png">
				</div>
				<h1>The Body at the Dorm Party</h1>
				<h5><a href="https://mjvar.github.io/body-at-the-dorm-party" class="projlink">link</a> | <a href="https://github.com/mjvar/body-at-the-dorm-party" class="codelink">code</a></h5>
				<p>
					I worked on an interactive, video-based murder mystery with a group of 3 students. I used jQuery UI and p5.js to develop the website, and acted in some of the videos.
				</p>`;
	}
	else if(proj == "sakay"){
		popCont.innerHTML = `
				<div class="popup-img">
					<img src="media/sakay.png">
				</div>
				<h1>The Body at the Dorm Party</h1>
				<h5><a href="https://https://blog.sakay.ph/transport-coverage-in-greater-manila-during-april-ecq/" class="projlink">link</a></h5>
				<p>
					I spent the summer of 2020 as a Data Science intern at Sakay.ph. I used kepler.gl, Pandas, and SQL to build a data analysis toolkit for researchers and policymakers. I also used this tool for an exploratory research project visualizing transport coverage in Manila during COVID-19, which was published on the Sakay.ph data science blog.
				</p>`;
	}
}