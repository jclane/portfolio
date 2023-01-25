

const randRange = (minNum, maxNum) => { return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum }
const inRange = (num, min, max) => { return num >= min && num <= max }
const createVector = (x, y) => { return {"x":x, "y":y} };

/**
 * Object representing a fragment of a lightning bolt with start and ends
 * points, line thickness, and opactity for an HTML5 canvas. Static properties
 * [boltLength], [boltThickness], and [offset] can be changed here to alter the
 * general appearance of the lightning strikes.
 */
class LightningFragment {
  static boltLength = 5;
  static boltThickness = 2.5;
  static offset = 5;
  /**
   * @param {x:Number, y:Number} startVector starting point for the fragment.
   * @param {x:Number, y:Number} endVector ending point for the fragment.
   * @param {Number} thickness how thick the fragment will be.
   * @param {Number} opacity how transparent the fragement will be.
   * @param {object} context HTML5 canvas context.
   */
  constructor(startVector, endVector, thickness, opacity, context) {
    this.start = startVector;
    this.end = endVector;
    this.thickness = thickness;
    this.opacity = opacity;
    this.ctx = context
  }

  /**
   * @param {x:Number, y:Number} start starting point for the line.
   * @param {x:Number, y:Number} end ending point for the line.
   * @param {Number} thickness how thick the line will be.
   * @param {Number} opacity how transparent the line will be.
   */
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

  // Clears to the canvas that is the parent of [this.ctx].
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
    this.ctx.beginPath();
  }

  // Draws the line on [this.ctx].
  draw() {
    return this.line(this.start, this.end, this.thickness, this.opacity);
  }
}

/**
 * Object representing a cloud, which can be appended to a webpage using the
 * [getHTML] method.
 */
class Cloud {
  /**
   * @param {String} id Unique ID of the object.
   * @param {Number} screenWidth Width of the screen.
   * @param {Number} screenHeight Height of the screen.
   */
  constructor(id, screenWidth, screenHeight) {
    this.id = id;
    this.className = "cloud";
    this.left = `${randRange(-250, screenWidth - 10)}px`;
    this.top = `${randRange(0, screenHeight / 2)}px`;
    this.size = randRange(0, 200) / 100;
    this.opacity = `${randRange(35, 100)}%`;
    this.speed = `${randRange(15, 25)}s`;
  }

  // Returns HTML used to the place the object on the page.
  getHTML() {
    return `<div class=cloud id=${this.id}
        style="left:${this.left};
        top:${this.top};
        transform: scale(${this.size});
        opacity:${this.opacity};
        -webkit-animation:moveclouds ${this.speed} linear infinite;
        -moz-animation:moveclouds ${this.speed} linear infinite;
        -o-animation:moveclouds ${this.speed} linear infinite"></div>`;
  }
}

/**
 * Object representing a raindrop, which can be appended to a webpage using the
 * [getHTML] method.
 */
class Drop {
  /**
   * @param {String} id Unique ID of the object.
   * @param {Number} screenWidth Width of the screen.
   * @param {Number} screenHeight Height of the screen.
   */
  constructor(id, screenWidth, screenHeight) {
    this.id = id;
    this.opacity = randRange(50, 100);
    this.left = `${randRange(0, screenWidth)}px`;
    this.top = `${randRange(-Math.abs(screenHeight), -90)}px`;
    this.speed = `${randRange(0, 500) / 100}s`
  }

  // Returns HTML used to the place the object on the page.
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

/**
 * Object representing a snowflake, which can be appended to a webpage using the
 * [getHTML] method.
 */
class Flake {
  /**
   * @param {String} id Unique ID of the object.
   * @param {Number} screenWidth Width of the screen.
   * @param {Number} screenHeight Height of the screen.
   */
  constructor(id, screenWidth, screenHeight) {
    this.id = id;
    let sizeAndBlur = randRange(2, 10);
    this.size = `${sizeAndBlur}px`;
    this.blur = `${randRange(1, sizeAndBlur)}px`;
    this.left = `${randRange(-50, screenWidth + 50)}px`;
    this.top = `${randRange(-Math.abs(screenHeight), screenHeight)}px`;
    this.speed = `${randRange(8, 15)}s`

  }

  // Returns HTML used to the place the object on the page.
  getHTML() {
    return `<div class=flakes id=${this.id}
        style="left:${this.left};
        top:${this.top};
        height:${this.size};
        width:${this.size};
        box-shadow:0 0 ${this.blur} 2px #FFF;
        -webkit-animation:snowflakes-fall ${this.speed} linear infinite;
        -moz-animation:snowflakes-fall ${this.speed} linear infinite;
        -o-animation:snowflakes-fall ${this.speed} linear infinite"></div>`;
  }
}

$(document).ready(() => {
  let HEIGHT = $(window).height();
  let WIDTH = $(window).width();

  function requestPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(success => {
        const lat = success.coords.latitude;
        const log = success.coords.longitude;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${log}&zoom=14`;
        fetch(url)
          .then(res => res.json())
          .then(data => $("#zipcode").val(data.address.postcode));
      }, error => {
	 console.log(error);
      });
    }
  }

  requestPosition();

  // Creates object based on [type].
  const createObj = (type, num) => {
    switch (type) {
      case "drop":
        return new Drop(`${type + num}`, WIDTH, HEIGHT);
      case "flake":
        return new Flake(`${type + num}`, WIDTH, HEIGHT);
      case "cloud":
        return new Cloud(`${type + num}`, WIDTH, HEIGHT);
    }
  }

  // Returns an array of objects equal to [intensity] and created by [createObj].
  const createWeatherArray = (type, intensity) => {
    let arr = [];
    for (let i = 1; i < intensity; i++) {
      arr.push(createObj(type, i));
    }

    return arr;
  }

  /**
  * Calls the [getHTML] method on each item in [objs] and appends them to an
  * HTML container [div] with id of [type].
  */
  const addObjsToPage = (type, objs) => {
    const container = $("<div>", {"id": type});
    $("body").prepend(container);

    for (i in objs) {
      container.append(objs[i].getHTML())
    }
  }

  const handleRain = (conditions_id) => {
    let drops;
    switch (conditions_id) {
      case "501":  // moderate
        drops = 500;
        break;
      case "503":  // heavy
        drops = 700;
        break;
      case "504": // extreme
        drops = 1000;
        break;
      case "500": // light/unknown
      default:
        drops = 250;
    }
    arr = createWeatherArray("drop", drops);
    addObjsToPage("rain", arr);
  }

  const handleClouds = (conditions_id) => {
    let clouds;
    switch (conditions_id) {
      case "802":  // scattered
        clouds = 8;
        break;
      case "803":  // broken
        clouds = 16;
        break;
      case "804":  // overcast
        clouds = 60;
        $("#clouds").css("background", "rgba(0, 0, 0, .3)");
        break;
      case "801":
      default:  // few/unknown
        clouds = 5;
    }
    cloudArr = createWeatherArray("cloud", clouds);
    addObjsToPage("clouds", cloudArr);
  }

  const handleSnow = (conditions_id) => {
    let flakes;
    switch (conditions_id) {
      case "601":  // moderate
        flakes = 500;
        break;
      case "602":  // heavy
        flakes = 700;
      case "600":
      default: // light/unkonwn
        flakes = 250;
    }
    arr = createWeatherArray("flake", flakes);
    addObjsToPage("snow", arr);
  }

  const createLightning = (context) => {
    lightning = [];
    let x1 = randRange(2, context.canvas.clientWidth - 2);
    let x2 = randRange(x1 - LightningFragment.offset, x1 + LightningFragment.offset);
    lightning[0] = new LightningFragment(createVector(x1, 0), createVector(x2, LightningFragment.boltLength), LightningFragment.boltThickness, 1, context);

    for (let l = 1; l < context.canvas.clientHeight; l++) {
      let lastBolt = lightning[l - 1];
      let lastX1 = lastBolt.end.x;
      let lastX2 = randRange(lastX1 - 5, lastX1 + 5);
      lightning.push(new LightningFragment(
        createVector(lastX1, lastBolt.end.y),
        createVector(lastX2, lastBolt.end.y + LightningFragment.boltLength),
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

  // This will add weather effects;
  const setWeatherEffects = () => {
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

  // This will change the background depending on the conditions
  const setBackgroundColor = () => {
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
