
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");

    /* Ball properties */
  var x = canvas.width/2;
  var y = canvas.height-30;
  var dx = 0;
  var dy = 0;
  var ballRadius = 10;
  var color = 0; // index in ballColors array
  var ballColors = ["#0095DD", "#9B59B6", "#28B463", "#D68910", "#F1C40F" ];

    /* Paddle 1 properties */
  var paddle1Height = 70;
  var paddle1Width = 10;
  var paddle1X = 0
  var paddle1Y = (canvas.height-paddle1Height)/2;
  var paddle1Speed = 5;

    /* Paddle 2 properties */
  var paddle2Height = 70;
  var paddle2Width = 10;
  var paddle2X = canvas.width-paddle2Width;
  var paddle2Y = (canvas.height-paddle2Height)/2;
  var paddle2Speed = 5;

    /* User input */
  var paddle1Up = false;
  var paddle1Down= false;
  var paddle2Up = false;
  var paddle2Down = false;

  // VARIABLE END


  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColors[color];
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddles() {
    ctx.beginPath();
    ctx.rect(paddle1X, paddle1Y, paddle1Width, paddle1Height);
    ctx.fillStyle = "#CC0000";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(paddle2X, paddle2Y, paddle2Width, paddle2Height);
    ctx.fillStyle = "#3333FF";
    ctx.fill();
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddles();
    x += dx;
    y += dy;
    //if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    //  dx = -dx;
    //  changeBallColor()
    //}
    if(x + dx < 0) { // left edge
      if(y + dy > paddle1Y && y + dy < paddle1Y + paddle1Height) {
        dx = -dx;
        changeBallColor();
      }
      else {
        resetGame()
        document.getElementById("output").innerHTML = "Red Paddle Loses! Press 'n' to play again."
      }
    }
    if(x + dx > canvas.width) { // right edge
      if(y + dy > paddle2Y && y + dy < paddle2Y + paddle2Height) {
        dx = -dx;
        changeBallColor();
      }
      else {
        resetGame()
        document.getElementById("output").innerHTML = "Blue Paddle Loses! Press 'n' to play again."
      }
    }
    if(y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
      dy = -dy;
      changeBallColor();
    }
  /*
    else if(y > canvas.height) {
        alert("GAME OVER");
        document.location.reload();
    }*/
    if(paddle1Up && paddle1Y > 0) {
      paddle1Y -= paddle1Speed;
    }
    else if(paddle1Down && paddle1Y < canvas.height-paddle1Height) {
      paddle1Y += paddle1Speed;
    }
    if (paddle2Up && paddle2Y > 0) {
      paddle2Y -= paddle2Speed;
    }
    else if(paddle2Down && paddle2Y < canvas.height-paddle2Height) {
      paddle2Y += paddle2Speed;
    }
  }

  function changeBallColor() {
    if (color < ballColors.length - 1) {
      color += 1
    }
    else {
      color = 0
    }
  }

  function resetGame() {
      /* Ball properties */
    x = canvas.width/2;
    y = canvas.height-30;
    dx = 0;
    dy = 0;
    ballRadius = 10;
    color = 0; // index in ballColors array
    ballColors = ["#0095DD", "#9B59B6", "#28B463", "#D68910", "#F1C40F" ];

      /* Paddle 1 properties */
    paddle1Height = 70;
    paddle1Width = 10;
    paddle1X = 0
    paddle1Y = (canvas.height-paddle1Height)/2;
    paddle1Speed = 5;

      /* Paddle 2 properties */
    paddle2Height = 70;
    paddle2Width = 10;
    paddle2X = canvas.width-paddle2Width;
    paddle2Y = (canvas.height-paddle2Height)/2;
    paddle2Speed = 5;

      /* User input */
    paddle1Up = false;
    paddle1Down= false;
    paddle2Up = false;
    paddle2Down = false;
  }

  function keyDownHandler(e) {
      if(e.keyCode == 78) {
        dx = -3;
        dy = 3;
        document.getElementById("output").innerHTML = "-"
      }
      else if(e.keyCode == 83) {
        paddle1Down = true;
      }
      else if(e.keyCode == 87) {
        paddle1Up = true;
      }
      else if(e.keyCode == 40) {
        paddle2Down = true;
      }
      else if(e.keyCode == 38) {
        paddle2Up = true;
      }
  }

  function keyUpHandler(e) {
      if(e.keyCode == 83) {
        paddle1Down = false;
      }
      else if(e.keyCode == 87) {
        paddle1Up = false;
      }
      else if(e.keyCode == 40) {
        paddle2Down = false;
      }
      else if(e.keyCode == 38) {
        paddle2Up = false;
      }
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  setInterval(draw, 10);
