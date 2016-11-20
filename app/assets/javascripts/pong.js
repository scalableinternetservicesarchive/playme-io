var PongGame = function(myIndex, numPlayers, boardRadius, boardColor, canvas, ctx) {
  var self = this;

  this.init = function(myIndex, numPlayers, boardRadius, boardColor, canvas, ctx) {
    self.ctx = ctx;
    self.boardColor = boardColor;
    self.boardRadius = boardRadius;
    self.centerX = canvas.width/2;
    self.centerY = canvas.height/2;
    self.index = myIndex;

      // paddle properties
    self.paddle_width = 20;
    self.colors = ["#8E44AD", "#CB4335", "#2E86C1", "#229954", "#F1C40F", "#E67E22"]
    self.paddles = [];

      // generate paddles for every player
    bound_width = 2*Math.PI/numPlayers;
    start_rad = 0;
    start_color_index = Math.random()*self.colors.length;
    for(var i = 0; i < numPlayers; i++) {
      color_index = parseInt(start_color_index);
      self.paddles.push(new Paddle(i, self.colors[color_index], bound_width, self.paddle_width*2, self.centerX, self.centerY,
                              self.boardRadius, start_rad, start_rad + bound_width, self.ctx));
      start_rad += bound_width;
      start_color_index = (start_color_index + 1) % self.colors.length;
    }
    self.paddles[1].width = bound_width/4;

    self.ball = new Ball("#34495E", 10, self.centerX, self.centerY, self.ctx);
  }

  this.draw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    self.drawBoard();
      // update paddles
    for(var i = 0; i < self.paddles.length; i++) {
      paddle = self.paddles[i]
      paddle.drawPaddle();
      if(paddle.cw && paddle.startPos+paddle.width + paddle.dRad < paddle.endBound) {
        paddle.startPos += paddle.dRad;
      }
      else if(paddle.ccw && paddle.startPos - paddle.dRad > paddle.startBound) {
        paddle.startPos -= paddle.dRad;
      }
    }

      // update ball
    self.ball.drawBall();
    absDistFromCenter = Math.sqrt(Math.pow(Math.abs(self.ball.x+self.ball.dx-self.centerX)+self.ball.radius, 2) +
                        Math.pow(Math.abs(self.ball.y+self.ball.dy-self.centerY)+self.ball.radius, 2))
    polarRad = Math.atan2(-(self.ball.y+self.ball.dy-self.centerY), self.ball.x+self.ball.dx-self.centerX);
    if(polarRad < 0) {
      polarRad += Math.PI*2;
    }

    if(absDistFromCenter < self.boardRadius) {
      self.ball.x += self.ball.dx;
      self.ball.y += self.ball.dy;
    }
    else {
      bounce = false;
      for(var i = 0; i < self.paddles.length; i++) {
        paddle = self.paddles[i];
        normalizedStartPos = Math.PI*2 - paddle.startPos;
        if(polarRad > normalizedStartPos - paddle.width && polarRad < normalizedStartPos) {

          midX = 2/3*self.boardRadius*Math.cos(normalizedStartPos-paddle.width/2)
          midY = -2/3*self.boardRadius*Math.sin(normalizedStartPos-paddle.width/2)

          speed = 2*Math.sqrt(2)
          dX = midX-(self.ball.x - self.centerX)
          dY = midY-(self.ball.y - self.centerY)
          distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2))
          self.ball.dx = dX*speed/distance
          self.ball.dy = dY*speed/distance
          bounce = true;
        }
      }
      if(bounce) {
      } else {
        console.log("lose!");
        self.ball.x = self.centerX;
        self.ball.y = self.centerY;
        self.ball.dx = 0;
        self.ball.dy = 0;
      }
    }
  }

  this.drawBoard = function() {
    self.ctx.beginPath();
    self.ctx.arc(self.centerX, self.centerY, self.boardRadius, 0, Math.PI*2);
    self.ctx.fillStyle = self.boardColor;
    self.ctx.fill();
    self.ctx.closePath();
  }

  this.keyDownHandler = function(e) {
    if(e.keyCode == 37) {
      self.paddles[self.index].cw = true;
    }
    else if(e.keyCode == 39) {
      self.paddles[self.index].ccw = true;
    }
  }

  this.keyUpHandler = function(e) {
    if(e.keyCode == 37) {
      self.paddles[self.index].cw = false;
    }
    else if(e.keyCode == 39) {
      self.paddles[self.index].ccw = false;
    }
  }

  self.init(myIndex, numPlayers, boardRadius, boardColor, canvas, ctx);
}

var Paddle = function(index, color, width, height, centerX, centerY, radius, startBound, endBound, ctx) {
  var self = this;

  this.init = function(index, color, width, height, centerX, centerY, radius, startBound, endBound, ctx) {
    self.index = index;
    self.color = color;
    self.width = width;
    self.height = height;
    self.centerX = centerX;
    self.centerY = centerY;
    self.radius = radius;
    self.startBound = startBound;
    self.endBound = endBound;
    self.ccw = false;
    self.cw = false;
    self.dRad = 0.02;
    self.startPos = self.startBound + (self.endBound - self.startBound)/2 - self.width/2;
    self.ctx = ctx;
  }

  this.drawPaddle = function() {
    ctx.save();

      // paddle
    self.ctx.beginPath();
    self.ctx.arc(self.centerX, self.centerY, self.radius, self.startPos, self.startPos+self.width, false);
    self.ctx.lineWidth = 6;
    self.ctx.strokeStyle = self.color;
    self.ctx.stroke();
    self.ctx.closePath();

      // draw start bound
    self.ctx.beginPath();
    self.ctx.arc(self.centerX, self.centerY, self.radius, self.startBound, self.startBound + 0.01, false);
    self.ctx.lineWidth = 10;
    self.ctx.strokeStyle = "#111";
    self.ctx.stroke();
    self.ctx.closePath();

      // draw end bound
    self.ctx.beginPath();
    self.ctx.arc(self.centerX, self.centerY, self.radius, self.endBound, self.endBound + 0.01, false);
    self.ctx.stroke();
    self.ctx.closePath();

    ctx.restore();
  }

  this.init(index, color, width, height, centerX, centerY, radius, startBound, endBound, ctx);
}

var Ball = function(color, radius, initX, initY, ctx) {
  var self = this;

  this.init = function(color, radius, initX, initY, ctx) {
    self.color = color;
    self.radius = radius;
    self.ctx = ctx;
    self.x = initX;
    self.y = initY;
    self.dx = -2;
    self.dy = 2;
  }

  this.drawBall = function() {
    self.ctx.beginPath();
    self.ctx.arc(self.x, self.y, self.radius, 0, Math.PI*2);
    self.ctx.fillStyle = self.color;
    self.ctx.fill();
    self.ctx.closePath();
  }

  this.init(color, radius, initX, initY, ctx);
}

$(document).on('turbolinks:load', function() {
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");

  var game = new PongGame(1, 3, 225, "#eee", canvas, ctx);

  document.addEventListener("keydown", game.keyDownHandler, false);
  document.addEventListener("keyup", game.keyUpHandler, false);
  setInterval(game.draw, 10);
});
