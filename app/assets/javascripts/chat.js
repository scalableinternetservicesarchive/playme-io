var Meta = function(fayeClient, data) {
  var self = this;

  this.init = function(fayeClient, data) {
    self.lobbyName = data.lobbyName;
    self.userId = data.userId;
    self.username = data.username;
    self.fayeClient = fayeClient;
    self.metaChannel = "/" + this.lobbyName + "/meta";
    self.fayeClient.subscribe(this.metaChannel, this.onChange);
    // other props
    self.players = data.players
    self.sendChange("player_join", this.username);
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
    }
  }

  this.onNameChange = function(userId, value) {
    self.players[userId] = value;
    console.log(self);
    console.log("player name changed", userId, value, this.players);
    self.updatePlayerList();
  }

  this.onPlayerJoin = function(userId, value) {
    self.players[userId] = value;
    console.log("player joined", self.players);
    self.updatePlayerList();
  }

  this.onPlayerLeave = function(userId) {
    delete self.players[userId];
    console.log("player left", self.players);
    self.updatePlayerList();
  }

  this.sendChange = function(action, value) {
    console.log('sent change', action, value);
    self.fayeClient.publish(this.metaChannel, {
      action: action,
      userId: this.userId,
      value: value
    });
  }

  this.updatePlayerList = function() {
    var list = document.getElementById("others");
    list.innerHTML = "";
    count = 0;

    var titlerow = document.createElement("div");
    titlerow.className += " titlerow";
    titlerow.innerHTML = "Lobby Players";
    list.appendChild(titlerow);

    for (id in self.players) {
      if (id !== self.userId) {
        count += 1;
        var new_row = document.createElement("div");
        if (count == 1 || count == 3) {
          new_row.className += " leftuser";
        }
        if (count == 2 || count == 4) {
          new_row.className += " rightuser";
        }
        new_row.innerHTML = "Player: " + (self.players[id]).bold();
        list.appendChild(new_row);
      }
    }
  }

  this.init(fayeClient, data);
};



var Chat = function(lobbyName, meta, fayeClient) {
  this.lobbyName = lobbyName;
  this.meta = meta;
  this.fayeClient = fayeClient;
  this.chatChannel = "/" + this.lobbyName + "/chat";
  this.fayeClient.subscribe(this.chatChannel, this.onMessage);
}
Chat.prototype.onMessage = function(data) {
  var message = document.createElement("p");
  message.className = "message";
  message.innerHTML = data['username'] + ": " + data['msg'];
  $('#chat_box').append(message);
  updateScroll()
}
Chat.prototype.sendMessage = function(message) {
  this.fayeClient.publish(this.chatChannel, {
    username: this.meta.players[this.meta.userId],
    msg: message
  });
}
$(document).on('turbolinks:load', function() {
  document.getElementById("roomLink").value = document.location.href; // automatically adds lobby url to text box
  $('#message_form').submit(function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    lobbyChat.sendMessage($('#message_box').val());
    //updateScroll();

    // Clear the message box
    $('#message_box').val('');

    // Don't actually submit the form, otherwise the page will refresh.
    return false;
  });
  $("form#my_name").submit(function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    var val = $("#my_name #name").val();
    meta.sendChange("name_change", val);
  });
  $("#my_name #name").blur(function(){
    console.log('ayy');
    $("#my_name").submit();
  });
});

/* Keep chatbox scroll at bottom */
function updateScroll(){
  var element = document.getElementById("chat_box");
  element.scrollTop = element.scrollHeight;
}
