$(document).ready(() => {

  const getIntensity = () => {
    const id = $("#hidden_field").val();
    return id;
  }

  // function to generate raindrops
  const createRain = () => {
    // number of drops created.
    const nbDrop = getIntensity();

    // function to generate a random number range.
    const randRange = (minNum, maxNum) => {
      return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    }

    for (let i = 1; i < nbDrop; i++) {
      const dropLeft = randRange(0, 1600);
      const dropTop = randRange(-1000, 1400);

      $(".rain").append('<div class="drop" id="drop' + i + '"></div>');
      $("#drop" + i).css("left", dropLeft);
      $("#drop" + i).css("top", dropTop);
    }
  }

  const createClouds = () => {
    let clouds = document.createElement("div");
    clouds.id = "clouds";
    document.body.appendChild(clouds);
    for (let i = 1; i < 5; i++) {
      let cloud = document.createElement("div");
      cloud.className = "cloud x" + i;
      clouds.appendChild(cloud);
    }
  }

  const setWeatherEffect = () => {
    // This will add weather effects;
    const conditions = $("#conditions").text().toLowerCase();

    /*
    for word in conditions {
        if word in ["snow", "wind", "rain", "clouds"] {
            $("body").addClass(word);
            // then how to call function?
        }
    }
    */

    switch (true) {
      case conditions === "snow":
        // Snow effect is handled in 'weather.css'.
        $("body").addClass("snow");
        break;
      case conditions === "wind":
        // I need to add a 'wind' effect. Perhaps CCS/SVG leaves going back or
        // maybe could be funny and throw in the odd kitchen sink or cow.
        break;
      case conditions === "rain":
        $("body").addClass("rain");
        createRain();
        break;
      case conditions === "clouds":
        $("body").addClass("clouds");
        createClouds();
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
