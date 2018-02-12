var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

var eagle = {speed: 300};
var art = {};
var artSmashed = [];
var smashCount = 0;

// thing to do to prepare images for loading
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function(){bgReady = true;};
bgImage.src = "bg.jpg";

var eagleReady = false;
var eagleImage = new Image();
eagleImage.onload = function(){eagleReady = true;};
eagleImage.src = "eagle.png";

var boomReady = false;
var boomImage = new Image();
boomImage.onload = function(){boomReady = true;};
boomImage.src = "boom.png";

var artReady = false;
var artImage = new Image();
artImage.onload = function(){artReady = true;};
// called on reset

var randomArtwork = function () {
  thumb = $.ajax({
    url: ("https://hackathon.philamuseum.org/api/v0/collection/objectsOnView?limit=1&offset=" + (Math.floor(Math.random() * (5000 - 1) + 1)) + "&api_token=OsuC8gmCvToQ3dTnOU9oPISnHWkRq9kYgbjOxNl9AvJP5yPZpMAELyn8zgo0"),
    async: false,
    type: 'GET',
    success: function (data) {
      return data;
    },
    error: function () {
      setTimeout(function () {
        console.log("partying too hard, damn");
        return randomArtwork();
      },500)
    }
  });
  if (thumb) {return thumb["responseJSON"][0]["Thumbnail"]} else {randomArtwork();};
}

var reset = function () {
  artImage.src = randomArtwork();
  eagle.x = canvas.width / 2;
	eagle.y = canvas.height / 2;
  art.x = 32 + (Math.random() * (canvas.width - 50));
	art.y = 32 + (Math.random() * (canvas.height - 50));	
};

var update = function (modifier) {
  var keysDown = {};
  window.onkeydown = function(e) {
    keysDown[e.keyCode] = true;
    if (keysDown["38"]) {eagle.y -= eagle.speed * modifier;} // up
    if (keysDown["40"]) {eagle.y += eagle.speed * modifier;} // down
    if (keysDown["37"]) {eagle.x -= eagle.speed * modifier;} // left
    if (keysDown["39"]) {eagle.x += eagle.speed * modifier;} // right
    if (keysDown["32"]) { // spacebar
      eagle.x = canvas.width / 2;
      eagle.y = canvas.height / 2;
    } 
  };
  window.onkeyup = function(e) {
    keysDown[e.keyCode] = false;
  };
  
	if (
  		eagle.x <= (art.x + 100)
  		&& art.x <= (eagle.x + 100)
  		&& eagle.y <= (art.y + 100)
  		&& art.y <= (eagle.y + 100)
	  ) {
    ctx.drawImage(boomImage, (art.x-75), (art.y-100));
    artImage.src = "";
    ++smashCount;
    artSmashed.push({"x":art.x,"y":art.y});
		reset();
	}
};

var drawScore = function (score) {
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "28px Comic Sans MS";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  if (score < 15) {
    script = "Art smashed: " + score;
  } else {
    script = "Art smashed: " + score + " WOOOOOOOOOOO!!! GO EAGLES!!!!!!!!";
  }
  ctx.fillText(script, 24, 24);
  if (score > 30) {
    ctx.fillText("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", 48, 48);
    ctx.fillText("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", 72, 72);
    ctx.fillText("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", 148, 148);
    ctx.fillText("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", 172, 172);
    ctx.fillText("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", 120, 372);
    ctx.fillText("WOOOOOOOO", 448, 448);
    ctx.fillText("...", 72, 572);
  }
}

var render = function () {
	if (bgReady) {
		var pattern = ctx.createPattern(bgImage, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	if (eagleReady) {ctx.drawImage(eagleImage, eagle.x, eagle.y);}
	if (artReady) {ctx.drawImage(artImage, (art.x-75), (art.y-100), 150, 200);}
  if (boomReady) {
    for (i=0; i < artSmashed.length; i++) {
      ctx.drawImage(boomImage, (artSmashed[i].x-75), (artSmashed[i].y-100));
    }
  }
  drawScore(smashCount);
};

var main = function () {
	var now = Date.now();
	var d = (now - then);
	update(d/500);
	render();
	then = now;
	requestAnimationFrame(main);
};

var then = Date.now();
reset();
main();
