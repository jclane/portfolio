$(document).ready(function() {
  //conditions = document.getElementById("conditions").innerText;
  conditions = "Snow";
  tempText = document.getElementById("curr_temp").innerText;
  convertedTemp = Math.round(tempText.slice(0, -2));

  // function to generate drops
  function createRain() {
    // number of drops created.
    var nbDrop = 858;

    // function to generate a random number range.
    function randRange(minNum, maxNum) {
      return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    }

    for (i = 1; i < nbDrop; i++) {
      var dropLeft = randRange(0, 1600);
      var dropTop = randRange(-1000, 1400);

      $(".rain").append('<div class="drop" id="drop' + i + '"></div>');
      $("#drop" + i).css("left", dropLeft);
      $("#drop" + i).css("top", dropTop);
    }
  }

  // function to generate clouds
  function createClouds() {
    var clouds = document.createElement("div");
    clouds.id = "clouds";
    document.body.appendChild(clouds);
    for (var i = 1; i < 5; i++) {
      var cloud = document.createElement("div");
      cloud.className = "cloud x" + i;
      var clouds = document.getElementById("clouds");
      clouds.appendChild(cloud);
    }
  }

  // This will add weather effects;
  switch (true) {
    case conditions == "Snow":
      $("body").addClass("snow");
      break;
    case conditions == "Wind":
      // wind
      break;
    case conditions == "Rain":
      $("body").addClass("rain");
      createRain();
      break;
    case conditions == "Clouds":
      $("body").addClass("clouds");
      createClouds();
  }

  // This will change the background depending on the conditions
  switch (true) {
    case convertedTemp < 33: // Freezing
      $("body").css({ background: "hsl(180, 50%, 75%)" });
      $("body").css({ color: "hsl(180, 50%, 30%)" });
      break;
    case convertedTemp < 59: // Cold
      $("body").css({ background: "hsl(180, 100%, 95%)" });
      $("body").css({ color: "hsl(180, 50%, 55%)" });
      break;
    case convertedTemp < 75: // Warm
      $("body").css({ background: "hsl(50, 100%, 77%)" });
      $("body").css({ color: "hsl(50, 50%, 45%)" });
      break;
    case convertedTemp > 76: // HOT
      $("body").css({ background: "hsl(15, 100%, 56%)" });
      $("body").css({ color: "hsl(15, 30%, 25%)" });
  }

});
