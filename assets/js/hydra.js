window.onload = function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    console.log('isMobile:', isMobile);
    const hydra = new Hydra({
        detectAudio: false,
        enableStreamCapture: false,
        width: window.innerWidth,
        height: window.innerHeight,
    });

    p5 = new P5({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    

    p5.hide();
	  p5.canvas.style.zIndex = -1000;

    var phrase = ['m', "move, scroll, \n& click", "🌈", "🌱", "📈", "🦤", "📀"];
    var phraseLength = phrase.length;
    var phraseIndex = 0;
    var noiseVal = 1;
    var yMax = 1;

    
    p5.windowResized = ()=>{
        p5.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    p5.draw = ()=>{
      p5.background(240,150);
      p5.noStroke();

      p5.fill("#e35b00")
      p5.textFont('Figtree');
      p5.textStyle(p5.BOLD);
      p5.textAlign(p5.CENTER, p5.CENTER);

      var currentPhrase = phrase[phraseIndex % phraseLength];
      p5.textSize(p5.height/2);
      if (currentPhrase.length > 3) {
        p5.textSize(p5.height/12);
      }

      p5.text(currentPhrase, p5.width/2, p5.height/2);
    }
    
    p5.mouseWheel = (event)=>{
      console.log(noiseVal, event.delta);
      if (event.delta > 0) {
        noiseVal += 0.2; // Increase noise value on scroll up
      }
      else {
        noiseVal -= 0.2; // Decrease noise value on scroll down
      }
      noiseVal = p5.constrain(noiseVal, 1, 100);
      yMax -= event.delta * 0.001;
      yMax = p5.constrain(yMax, 1, 1.5);
    }

    // hydra
    s0.init({src: p5.canvas})

    if (isMobile) {
        // Simple version for mobile
        src(s0).out()

        osc(10,0.01,1).modulate(noise(100,0.5),1).out(o1)

        src(o2).modulate(src(o1).blend(solid(-1,1),2),0.01)
        .blend(src(o0),1.1)
        .out(o2)

        src(o0).blend(o2,100).out(o3)

        render(o3)
    } else {
      p5.mouseClicked = ()=>{
        phraseIndex++;
      };  

      src(s0).out()

      console.log(noiseVal);
      osc(1,0.01,1).modulate(noise(()=>noiseVal,1),1).out(o1)

      src(o2).modulate(
        src(o1).add(solid(
          ()=>p5.map(p5.mouseX,0,p5.width,2,-2),
          ()=>p5.map(p5.mouseY,0,p5.height,2,0.5)),-1),
        ()=>p5.map((Math.abs(p5.mouseX-p5.width/2)),0,p5.width/2,0.0,.01))
      .blend(
        src(o0),()=>p5.map(p5.mouseY,p5.height/4,p5.height,yMax,yMax/4))
      .out(o2)

      src(o0).blend(o2,()=>Math.pow((Math.abs(p5.width/2-p5.mouseX)),1.1)).out(o3)

      render(o3)
    }
  }