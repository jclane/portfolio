$(document).ready(() => {
  const HEIGHT = $(window).height();
  const WIDTH = $(window).width();
  
  class Cloud {
    constructor(id, coords, sizeAndOpacity, speed) {
      this.id = id;
      this.coords = coords;
      this.sizeAndOpacity = sizeAndOpacity;
      this.speed = speed;
    }
    
    getHTML() {
      return `<div class=cloud id=${this.id}
          style="left:${this.coords.x};
          top:${this.coords.y};
          transform: scale(${this.sizeAndOpacity});
          opacity:scale(${this.sizeAndOpacity});
          -webkit-animation:moveclouds ${this.speed}s linear infinite;
          -moz-animation:moveclouds ${this.speed}s linear infinite;
          -o-animation:moveclouds ${this.speed}s linear infinite"></div>`;
    }
  }  
  
  const getConditionsId = () => {
    const id = $("#hidden_field").val();
    return id;
  }
  
  // function to generate a random number range.
  const randRange = (minNum, maxNum) => {   
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  }
  
  const createRain = (intensity) => {
    const rain = $("<div>", {"class": "rain"});
    $("body").prepend(rain);  
    
    for (let i = 1; i < intensity; i++) {
      const dropLeft = randRange(0, WIDTH);
      const dropTop = randRange(-Math.abs(HEIGHT), -90);
      const dropOpacity = randRange(0, 200) / 100;
      $(".rain").append('<div class="drop" id="drop' + i + '"></div>');
      $("#drop" + i).css("left", dropLeft);
      $("#drop" + i).css("top", dropTop);
      $("#drop" + i).css("opacity", "scale( " + dropOpacity + ")");
      $("#drop" + i).css("-webkit-animation-delay", randRange(0, 500) / 100 + "s");
      $("#drop" + i).css("-moz-animation-delay", randRange(0, 500) / 100 + "s");
      $("#drop" + i).css("-o-animation-delay", randRange(0, 500) / 100 + "s");
    }
  }
  
  const handleRain = (conditions_id) => {
    switch (conditions_id) {
      case "501":  // moderate
        createRain(500);
        break;
      case "503":  // heavy
        createRain(700);
        break;
      case "504": // extreme
        createRain(1000);
        break;
      case "500": // light/unknown
      default:
        createRain(250);
    } 
  }

  const createSnow = (intensity) => {
    const snow = $("<div>", {"class": "snow"});
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
    
  const createClouds = (intensity) => {
    let cloudArr = [];
    for (let i = 1; i < intensity; i++) {
      const id = "cloud" + i;
      const randX = randRange(-250, WIDTH);
      const randY = randRange(-250, 0);
      const sizeAndOpacity = randRange(0, 200) / 100;
      const speed = randRange(15, 25);
      const cloud = new Cloud(id, {x:randX, y:randY}, 
                              sizeAndOpacity, speed); 
      cloudArr.push(cloud);
    }

    return cloudArr;
  }

  const drawClouds = (clouds) => {
    const container = $("<div>", {"class": "clouds"});
    $("body").prepend(container);

    for (i in clouds) {
      const c = clouds[i];
      container.append(c.getHTML());
    }
  }  
  
  const handleClouds = (conditions_id) => {
    switch (conditions_id) {
      case 802:  // scattered
        drawClouds(createClouds(8));
        break;
      case 803:  // broken
        drawClouds(createClouds(16));
        break;
      case 804:  // overcast
        drawClouds(createClouds((160));
        break;
      case 801:
      default:  // few/unknown
        drawClouds(createClouds(5));
    }
  }

  const inRange = (num, min, max) => {
    return num >= min && num <= max;
  }

  const setWeatherEffect = () => {
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

  function setBackgroundColor() {
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
  setWeatherEffect();
});
