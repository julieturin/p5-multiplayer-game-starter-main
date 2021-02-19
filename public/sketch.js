let playerSize = 50;
let button;
let playMode;
let counter = 10;
let gameInterval;
let checkWinner;

socket.on("update game", data => {
  playMode = data[0];
  counter = data[1];
  if (playMode) {
    button.hide();
  } else {
    button.show();
  }

});

function setup() {
  cv = createCanvas(windowWidth, windowHeight);
  cv.mousePressed()
  centerCanvas();
  noStroke();
  textSize(playerSize);
  textAlign(CENTER, CENTER);

  button = createButton("Start the game!");
  button.position(
    windowWidth / 2 - button.width / 2,
    windowHeight / 2 - button.height / 2
  );
  button.mousePressed(startTheGame);
}

function draw() {
  background(50);


  players.forEach((player) => {
    if (currentPlayer.id == player.id) player.move();
    player.collide();
    player.draw();

  });
  //dire à tout le monde ma nouvelle position
  socket.emit("update player", currentPlayer);
  if (playMode) {
    let allInfected = players.every(player => {
      return player.infected == true;
    });
    if (allInfected) {
      playMode = false;
      button.show();
      socket.emit("update game", playMode, counter);
    }
  }
}

function checkWinner() {

}

function startTheGame() {

  console.log("ready!!");
  playMode = true;
  button.hide();
  socket.emit("update game", playMode);

  players.forEach((player) => {
    player.infected = false;
    socket.emit("update player", player);

  });
  let randomPlayer = random(players);
  randomPlayer.infected = true;
  socket.emit("update player", randomPlayer);
  gameInterval = setInterval(updateInterval, 1000);

}

function updateInterval() {
  count--;
  if (counter == 0) {
    clearInterval(gameInterval);
  }
}

function mouseMoved() {
  players.forEach((player) => {
    if (currentPlayer.id == player.id) player.move();


  });

}

//function mousePressed() {
//console.log(players);
//console.log("You are:" + currentPlayer.id);

//currentPlayer.infected = true;

//}