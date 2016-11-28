var Meta = function(fayeClient, data) {
  var self = this;

  this.init = function(fayeClient, data) {
    self.lobbyName = data.lobbyName;
    self.userId = data.userId;
    self.username = data.username;
    self.leaderId = data.leaderId;
    self.playerIndex = data.playerIndex;
    self.fayeClient = fayeClient;
    self.metaChannel = "/" + this.lobbyName + "/meta";
    self.fayeClient.subscribe(this.metaChannel, this.onChange);
    // other props
    self.players = data.players;
    self.sendChange("player_join", self.players[self.userId]);
    self.updatePlayerList();
  }

  this.onChange = function(data) {
    console.log("on change fired", data);
    switch(data.action){
      case "name_change":
        self.onNameChange(data.userId, data.value);
        break;
      case "player_join":
        self.onPlayerJoin(data.userId, data.value);
        break;
      case "player_leave":
        self.onPlayerLeave(data.userId);
        break;
      case "state_change":
        self.onReadyChange(data.userId, data.value);
        break;
      case "leader_change":
        self.onLeaderChange(data.userId);
        break;
      case "game_start":
        self.onGameStart(data.value);
        break;
    }
  }

  this.onGameStart = function(value) {
    if(value) {
      var game = new PongGame(Object.keys(players).length, 225, "#eee", canvas, ctx, self, client);
      game.startGame();
    }
  }

  this.onLeaderChange = function(userId) {
    self.leaderId = userId;
    // if I become the leader, change button to be the Start Button
    if (self.isLeader()) {
      $button = $("#readyButton");
      $button.attr("value", "start");
      $button.html("Start!");
      $button[0].disabled = true;
    }
    self.onReadyChange(self.leaderId, "ready"); // set leader state to be ready
  }

  this.onReadyChange = function(userId, value) {
    self.players[userId]["readystate"] = value;
    self.updateReadyStatusList();
    console.log("hi someone changed state", self.players);
  }

  this.onNameChange = function(userId, value) {
    self.players[userId]["username"] = value;
    console.log(self);
    console.log("player name changed", userId, value, this.players);
    self.updatePlayerList();
  }

  this.onPlayerJoin = function(userId, value) {
    self.players[userId] = value;
    console.log("player joined", self.players);
    self.updateReadyStatusList();
  }

  this.onPlayerLeave = function(userId) {
    delete self.players[userId];
    console.log("player left", self.players);
    self.updatePlayerList();
  }

  this.sendChange = function(action, value) {
    console.log('sent change', action, value);
    console.log(this.userId);
    self.fayeClient.publish(this.metaChannel, {
      action: action,
      userId: this.userId,
      value: value
    });
  }

  this.isLeader = function() {
    return self.userId == self.leaderId;
  }

  this.updateReadyStatusList = function() {
    // do shit
    if(self.isLeader()){
      var start = true;
      for(var id in self.players) {
        if(self.players[id].readystate !== "ready") {
          start = false;
        }
      }
      if(start) {
        $("#readyButton")[0].disabled = false;
      }
      else {
        $("#readyButton")[0].disabled = true;
      }
      console.log($("#readyButton")[0].disabled);
    }
    this.updatePlayerList();
  }

  this.updatePlayerList = function() {
    var list = document.getElementById("others");
    list.innerHTML = "";
    for (id in self.players) {
      var li = document.createElement("li");
      li.innerHTML = id + ": " + self.players[id]["username"] + " is " + self.players[id]["readystate"];
      if(id == self.leaderId) {
        li.innerHTML = "<img src='" + CROWN_IMG_URL + "' class='crownstyle'  >" + " " + li.innerHTML;
        //li.innerHTML = "leader is: " + li.innerHTML;
      }
      if (self.players[id]["readystate"] == "ready") {
        li.innerHTML = li.innerHTML + " " + "<img src='" + CHECK_IMG_URL + "' class='crownstyle'  >";
      }
      else {
        li.innerHTML = li.innerHTML + " " + "<img src='" + NOCHECK_IMG_URL + "' class='crownstyle'  >";
      }
      list.appendChild(li);
    }
  }

  this.init(fayeClient, data);
};

$(document).on('turbolinks:load', function() {
  $button = $("#readyButton")

  if(meta.isLeader()) {
    meta.onLeaderChange(meta.leaderId); // if i'm the leader, perform leader change callback manually
  }
  $button.click(function() {
    if($button.attr("value") == "ready") {
      meta.sendChange("state_change", "ready")
      $button.attr("value", "not_ready")
      $button.html("I m not redy!")
    }
    else if($button.attr("value") == "not_ready") {
      meta.sendChange("state_change", "not_ready")
      $button.attr("value", "ready")
      $button.html("I m redy!")
    }
    else if($button.attr("value") == "start") {
      meta.sendChange("game_start", true);
    }
  })

  $("form#my_name").submit(function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    var val = $("#my_name #name").val();
    meta.sendChange("name_change", val);
  });
  $("#my_name #name").blur(function(){
    $("#my_name").submit();
  });
});
