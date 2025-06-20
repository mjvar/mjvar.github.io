window.onload = function() {
    console.log('User Agent:', navigator.userAgent);
    console.log('Touch support:', 'ontouchstart' in window);
    console.log('Max touch points:', navigator.maxTouchPoints);
    console.log('Screen width:', window.innerWidth);
    console.log('Screen height:', window.innerHeight);

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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
        height: height,
    });    

    p5 = new P5({
        width: width,
        height: height
    });

    p5.hide();
	  hydra.canvas.style.zIndex = -1;
    hydra.canvas.style.cursor = 'pointer';

    // weezetastic
    const audio = new Audio();
    audio.preload = 'auto';
    audio.loop = false; // Set to true if you want it to loop
    
    // More robust loading
    let audioReady = false;
    
    const loadAudio = () => {
        audio.src = 'assets/media/Buddy Holly.mp3';
        audio.load(); // Force reload
    };
    
    audio.addEventListener('canplaythrough', () => {
        console.log('Song loaded and ready to play');
        audioReady = true;
    });
    
    audio.addEventListener('error', (e) => {
        console.error('Error loading song:', e);
        console.error('Audio error details:', {
            error: audio.error,
            networkState: audio.networkState,
            readyState: audio.readyState,
            src: audio.src
        });
        // Try to reload after error
        setTimeout(loadAudio, 1000);
    });
    loadAudio();

    var phrase = isMobile ? ['m', 
      "(tap to\nmelt)", 
      "🌱", "🌊", "🥭", "🌈","(if you\nwant actual\ninformation\nit's in\nthe about\npage...",
      "or you can\nhang out\nhere too", "no\njudgment!)",":-)", 
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
      "🍓", "🧋", "🌽", "🥞", "dude what\nthe heck?", "you\nfinished\nall my\nsnacks...!",
      "grumble\ngrumble", "it's fine\ndon't feel\nbad", "i just\ndidn't think\nyou'd\nactually\nfinish them",
      "also they\nwere kinda\nmelted", "i guess\neverything\nis melting\nround here", 
      "is that\nnormal?","anyway","i was\ngonna put\non some\nmusic",
      "if that's\nok with\nyou", "🎸","🥁","🎶","🎵","🎤","💃",
      "what a\ngreat song","oh you're\nstill here?", 
      "you must\nbe really\nbored", "i get\nbored too\nsometimes", 
      "being a\npage on\na website\nisn't\nexactly\nthe most\nexciting\nlife",
      "ok i'm\ngonna loop\nback now", "but it\nwas nice\nchatting!",
      "come back\nanytime 🫶", "maybe next\ntime you'll\nmeet my\nroommate?"]
    :['m', "(move, scroll, \n& click)", 
      "🌈", "🌱", "📈", "🌱", "🌊", "🥭", "🌈", "📀",
      "(also you should\ntry this on a\nmobile device 🎶)",];
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
        noiseVal += 0.5; // Increase noise value on scroll up
      }
      else {
        noiseVal -= 0.5; // Decrease noise value on scroll down
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
          const currentIndex = phraseIndex % phraseLength;
          console.log(phrase[currentIndex]);
          // Start music at 🎸 emoji
          if (phrase[currentIndex] === "🎸" && audioReady && audio.paused) {
            audio.currentTime = 0; // Start from beginning
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log('Audio started successfully');
                })
                .catch(error => {
                  console.error('Play failed:', error);
                  // Try again after user interaction
                  setTimeout(() => {
                    audio.play().catch(e => console.log('Retry also failed:', e));
                  }, 100);
                });
            }
          }
          
          // Fade out music after 💃 emoji
          if (phrase[currentIndex] === "what a\ngreat song" && !audio.paused) {
            // Simple fade out by reducing volume over time
            const fadeOut = () => {
              if (audio.volume > 0.1) {
                audio.volume -= 0.1;
                setTimeout(fadeOut, 300); // Reduce volume every 300ms
              } else {
                audio.pause();
                audio.volume = 1; // Reset volume for next time
              }
            };
            fadeOut();
          }

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

    // spacebar to "fullscreen" the canvas
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // Prevent page scroll
            hydra.canvas.style.zIndex *= -1; // Move canvas to the back
            console.log(hydra.canvas.style.zIndex);
    }
});
  }

