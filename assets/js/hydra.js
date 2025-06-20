window.onload = function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    console.log('isMobile:', isMobile);

    let width, height;
    if (isMobile) {
        width = 200;
        height = 400;
    } else {
        width = window.innerWidth;
        height = window.innerHeight;
    }

    console.log('Canvas size:', width, height);

    const hydra = new Hydra({
        detectAudio: false,
        enableStreamCapture: false,
        width: width,
        height: height
    });

    p5 = new P5({
        width: width,
        height: height
    });
    

    p5.hide();
	  p5.canvas.style.zIndex = -1000;

    var phrase = isMobile ? ['m', 
      "(tap to\nmelt)", 
      "🌱", "🌊", "🥭", "🌈","if you\nwant actual\ninformation\nit's in\nthe about\npage...",
      "or you can\nhang out\nhere too", "no\njudgment!",":-)", 
      "📀", "👽","🍄","🚅","🏠",
      "oh!\nwhere are\nmy manners", "i haven't\nintroduced\nmyself",
      "my name\nis mo", "well my\nfull name\nis mobile", "but mo\nis usually\neasier for\npeople",
      "no i'm not\nmatthew", "i just\nlive on\ntheir\nwebsite",
      "it's kind\nof a\nweird\nplace", "but rent\nis dirt\ncheap",
      "and my\nroommate\ndes is\npretty\nchill", "des is\nshort for\ndesktop", 
      "well she\ndoesn't\nreally\ntalk much", "but\nshe has\npretty\ncool mouse\nfunctionality", 
      "so i\ncan't really\ncomplain","ummm",
      "while\nyou're\nhere", "do you\nwant some\nsnacks?", 
      "ok here\n ya go", "🍩",  "🍰", "🍫","🍪",
      "🍓", "🧋", "🌽", "🥞", "dude what\nthe heck", "you\nfinished\nall my\nsnacks...!",
      "grumble\ngrumble", "it's fine\ndon't feel\nbad", "i just\ndidn't think\nyou'd\nactually\nfinish them",
      "also they\nwere kinda\nmelted\nanyway", "i guess\neverything\nis melting\nround here", 
      "is that\nnormal?","anyway","i was\ngonna put\non some\nmusic",
      "if that's\nok with\nyou", "🎸","🥁","🎶","🎵","🎤","💃",
      "what a\ngreat song","oh you're\nstill here?", 
      "you must\nbe really\nbored", "i get\nbored too\nsometimes", 
      "being a\npage on\na website\nisn't\nexactly\nthe most\nexciting\nlife",
      "ok i'm\ngonna loop\nback now", "but it\nwas nice\nchatting!",
      "come back\nanytime 🫶", "maybe next\ntime you'll\nmeet my\nroommate?"]
    :['m', "(move, scroll, \n& click)", 
      "🌈", "🌱", "📈", "🌱", "🌊", "🥭", "🌈", "📀",
      "(also you should\ntry this on a\nmobile device)",];
    var phraseLength = phrase.length;
    var phraseIndex = 0;
    var noiseVal = 1;
    var yMax = 1;
    var mobileShuffleX = 2;
    var mobileShuffleY = -1;
    var blendVal = 1.01;

    if (!isMobile) {
      p5.windowResized = ()=>{
          p5.resizeCanvas(window.innerWidth, window.innerHeight);
      }
    }

    p5.draw = ()=>{
      p5.background(240,150);
      p5.noStroke();

      p5.fill("#e35b00")
      p5.textFont('Figtree');
      p5.textStyle(p5.BOLD);
      p5.textAlign(p5.CENTER, p5.CENTER);

      var currentPhrase = phrase[phraseIndex % phraseLength];
      p5.textSize(p5.height/3);
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
        p5.mouseClicked = ()=>{
          phraseIndex++;
          mobileShuffleX = (p5.random()-0.5)*4;
          mobileShuffleY = (p5.random()-0.5)*4;
          noiseVal = p5.random();
          blendVal += 0.025;
          console.log(Math.sin(blendVal)/2);
        };  
        src(s0).out()

        osc(10,0.01,2).modulate(noise(()=>noiseVal,0.2),1.1).out(o1)

        src(o2).modulate(src(o1).blend(solid(()=>mobileShuffleX,()=>mobileShuffleY),-1),0.01)
        .blend(src(o0),()=>Math.sin(blendVal)/2)
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

