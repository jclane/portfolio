const randRange = (minNum, maxNum) => { return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum }
const inRange = (num, min, max) => { return num >= min && num <= max }
const createVector = (x, y) => { return {"x":x, "y":y} }

class Lightning {
  
  static boltLength = 5;
  static boltThickness = 2.5;
  static offset = 5;
   
  constructor(startVector, endVector, thickness, opacity, context) {
    this.start = startVector;
    this.end = endVector;
    this.thickness = thickness;
    this.opacity = opacity;
    this.ctx = context
  }

  line(start, end, thickness, opacity) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.lineWidth = thickness;
    this.ctx.strokeStyle = `rgba(255, 255, 0, ${opacity})`;
    this.ctx.shadowBlur = 30;
    this.ctx.shadowColor = "rgb(255, 255, 145)";
    this.ctx.stroke();
    this.ctx.closePath();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
    this.ctx.beginPath();
  }
  
  draw() {
    return this.line(this.start, this.end, this.thickness, this.opacity);
  }
}

class Cloud {
  
  constructor(id, coords, size, opacity, speed) {
    this.id = id;
    this.coords = coords;
    this.size = size;
    this.opacity = opacity;
    this.speed = speed;
  }
  
  getID() {
    return "#" + this.id
  }
  
  getPosition() {
    return $(this.getID()).offset();
  }
  
  getHTML() {
    return `<div class=cloud id=${this.id}
        style="left:${this.coords.x};
        top:${this.coords.y};
        transform: scale(${this.size});
        opacity:${this.opacity}%;
        -webkit-animation:moveclouds ${this.speed}s linear infinite;
        -moz-animation:moveclouds ${this.speed}s linear infinite;
        -o-animation:moveclouds ${this.speed}s linear infinite"></div>`;
  }
}  

class Drop {
  constructor(id, screenWidth, screenHeight) {
    this.id = id;  
    this.opacity = randRange(50, 100);
    this.left = `${randRange(0, screenWidth)}px`;
    this.top = `${randRange(-Math.abs(screenHeight), -90)}px`;
    this.speed = `${randRange(0, 500) / 100}s`
  }
 
  getHTML() {
    return `<div class=drop id=${this.id}
        style="left:${this.left};
        top:${this.top};
        opacity:${this.opacity}%;
        -webkit-animation:fall ${this.speed} linear infinite;
        -moz-animation:fall ${this.speed} linear infinite;
        -o-animation:fall ${this.speed} linear infinite"></div>`;
  } 
}

$(document).ready(() => {
  let HEIGHT = $(window).height();
  let WIDTH = $(window).width();

  const createRain = (intensity) => {
    let rainArr = [];
    for (let i = 1; i < intensity; i++) {
      rainArr.push(new Drop(`drop${i}`, WIDTH, HEIGHT));
    }
    
    return rainArr;
  }

  const drawRain = (rain) => {
    const container = $("<div>", {"id": "rain"});
    $("body").prepend(container);
    
    for (i in rain) {
      container.append(rain[i].getHTML());
    }
  }
   
  const handleRain = (conditions_id) => {
    switch (conditions_id) {
      case "501":  // moderate
        drawRain(createRain(500));
        break;
      case "503":  // heavy
        drawRain(createRain(700));
        break;
      case "504": // extreme
        drawRain(createRain(1000));
        break;
      case "500": // light/unknown
      default:
        drawRain(createRain(250));
    } 
  }

  const createClouds = (intensity) => {
    let cloudArr = [];
    for (let i = 1; i < intensity; i++) {
      const id = "cloud" + i;
      const randX = `${randRange(-250, WIDTH - 10)}px`;
      const randY = `${randRange(0, HEIGHT / 2)}px`;
      const size = randRange(0, 200) / 100;
      const opacity = randRange(35, 100);
      const speed = randRange(15, 25);
      const cloud = new Cloud(id, {x:randX, y:randY}, 
                              size, opacity, speed); 
      cloudArr.push(cloud);
    }

    return cloudArr;
  }

  const drawClouds = (clouds) => {
    const container = $("<div>", {"id": "clouds"});
    $("body").prepend(container);
    
    
    for (i in clouds) {
      const c = clouds[i];
      container.append(c.getHTML());
    }
  }

  const handleClouds = (conditions_id) => {
    switch (conditions_id) {
      case "802":  // scattered
        drawClouds(createClouds(8));
        break;
      case "803":  // broken
        drawClouds(createClouds(16));
        break;
      case "804":  // overcast
        drawClouds(createClouds(160));
        $("#clouds").css("background", "rgba(0, 0, 0, .3)");
        break;
      case "801":
      default:  // few/unknown
        drawClouds(createClouds(5));
    }
  }

  const createSnow = (intensity) => {
    let snow = $("<div>", {"class": "snow"});
    $("body").prepend(snow);  
    
    for (let i = 1; i < intensity; i++) {
      const flakeLeft = randRange(-50, WIDTH + 50);
      const flakeTop = randRange(-Math.abs(HEIGHT), HEIGHT);
      const flakeSize = randRange(2, 10);
      const flakeBlur = randRange(1, flakeSize);
      let flakeSpeed = randRange(10, 15);

      if ($("body").has(".rain").length) {
        flakeSpeed = flakeSpeed - 8;
      }

      $(".snow").append('<div class="flakes" id="flake' + i + '"></div>');
      $("#flake" + i).css("left", flakeLeft);
      $("#flake" + i).css("top", flakeTop);
      $("#flake" + i).css("height", flakeSize + "px");
      $("#flake" + i).css("width", flakeSize + "px");
      $("#flake" + i).css("box-shadow", "0 0 " + flakeBlur + "px 2px #FFF");
    } 
  }

  const handleSnow = (conditions_id) => {
    switch (conditions_id) {
      case 601:  // moderate
        createSnow(500);
        break;
      case 602:  // heavy
        createSnow(700);
      case 600:
      default: // light/unkonwn
        createSnow(250);      
    }
  }

  const createLightning = (context) => {
    lightning = [];
    let x1 = randRange(2, context.canvas.clientWidth - 2);
    let x2 = randRange(x1 - Lightning.offset, x1 + Lightning.offset);
    lightning[0] = new Lightning(createVector(x1, 0), createVector(x2, Lightning.boltLength), Lightning.boltThickness, 1, context);
    console.log(lightning);
    for (let l = 1; l < context.canvas.clientHeight; l++) {
      let lastBolt = lightning[l - 1];
      let lastX1 = lastBolt.end.x;
      let lastX2 = randRange(lastX1 - 5, lastX1 + 5);
      lightning.push(new Lightning(
        createVector(lastX1, lastBolt.end.y), 
        createVector(lastX2, lastBolt.end.y + Lightning.boltLength), 
        lastBolt.thickness, 
        lastBolt.opacity, 
        context
      ));
    }
  }

  const createStorm = (intensity) => {
    const storm = $("<canvas/>", {"id": "tstorm-canvas"});
    $("body").prepend(storm);
    const canvas = document.getElementById("tstorm-canvas");
    const context = canvas.getContext("2d");
    
    const animate = () => {
      lightning[lightning.length - 1].clearCanvas();

      for (let i = 0 ; i < lightning.length ; i++) {
        lightning[i].opacity -= 0.01;
        lightning[i].thickness -= 0.05;
        if (lightning[i].thickness <= 2) {
          lightning[i].end.y -= 0.05;
        }
        lightning[i].draw();
      }
      requestAnimationFrame(animate);
    }

    const setup = (context) => {
      createLightning(context);
      for (let i = 0 ; i < lightning.length ; i++) {
        lightning[i].draw();       
      }
    }

    setup(context);
    requestAnimationFrame(animate);
    setInterval(() => {
      createLightning(context);
    }, 7000)  
  }

  const handleStorm = (conditions_id) => {
    handleClouds("804");

    switch (conditions_id) {
      case "200":  // with light rain
        handleRain();
        createStorm(7000);
        break;
      case "201":  // with moderate rain
        handleRain("501");
        createStorm(7000);
        break;
      case "202":  // with heavy rain
        handleRain("503");
        createStorm(7000);
        break;
      case "211": // moderate tstorm
        createStorm(7000);
        break;
      case "212": // heavy tstorm
        createStorm(5000);
        break;
      default:  // light/unknown
        createStorm(7000);
    }    
  }
   
  const getConditionsId = () => {
    const id = $("#hidden_field").val();
    return id;
  }
  
  const setWeatherEffects = () => {
    // This will add weather effects;
    let conditions_id = getConditionsId();
    switch (true) {
      case (inRange(conditions_id, 200, 232)):
          handleStorm(conditions_id);
          break;
      case (inRange(conditions_id, 500, 531)):
          handleRain(conditions_id);
          break;
      case (inRange(conditions_id, 600, 622)):
          handleSnow(conditions_id);
          break;
      case (inRange(conditions_id, 801, 804)):
          handleClouds(conditions_id);
          break;     
    }
  }

  const setBackgroundColor = () => {
    // This will change the background depending on the conditions
    const tempText = $("span#curr_temp").text();
    const currTemp = Math.round(tempText.slice(0, -1));
    const tempUnits = $("input[name=temp_units]:checked",
                        "#weather-app-form").val();
    const convertedTemp = (tempUnits === "c") ? (currTemp * 9/5) + 32 : currTemp;

    switch (true) {
      case convertedTemp <= 33: // Freezing
        $("body").css({ background: "hsl(180, 50%, 75%)" });
        $("body").css({ color: "hsl(180, 50%, 30%)" });
        break;
      case convertedTemp <= 59: // Cold
        $("body").css({ background: "hsl(180, 100%, 95%)" });
        $("body").css({ color: "hsl(180, 50%, 55%)" });
        break;
      case convertedTemp <= 75: // Warm
        $("body").css({ background: "hsl(50, 100%, 77%)" });
        $("body").css({ color: "hsl(50, 50%, 45%)" });
        break;
      case convertedTemp >= 76: // HOT
        $("body").css({ background: "hsl(15, 100%, 56%)" });
        $("body").css({ color: "hsl(15, 30%, 25%)" });
        break;
    }
  }

  setBackgroundColor();
  setWeatherEffects();
});
