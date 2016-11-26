var Chat = function(meta, fayeClient) {
  this.meta = meta;
  this.lobbyName = this.meta.lobbyName;
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
});

/* Keep chatbox scroll at bottom */
function updateScroll(){
  var element = document.getElementById("chat_box");
  element.scrollTop = element.scrollHeight;
}
