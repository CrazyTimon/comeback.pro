sendMessage = function() {
	if (!($("#chatMessageTextInput").val() == 0)) {
		var message = new Object();
		message.text = $("#chatMessageTextInput").val();
		message.username = Meteor.user().profile.name;
		chatCollection.insert({
			username: message.username,
			message: message.text,
			date: Date.now()
		});
		$("#chatMessageTextInput").val('');
		chatStream.emit('chat', message);
		var height = $("#chat").height() + $("#chat").outerHeight();
		Meteor.setTimeout(function() {
			$("#chat").scrollTop(99999999);
		}, 1)
	}
};

Template.chat.helpers({
	"messages": function() {
		return chatCollection.find();
	}
});

Template.chat.events({
	'click #chatMessageSendButton': function() {
		sendMessage();
	},
	'keypress #chatMessageTextInput': function(event) {
		if (event.which == 13) {
			sendMessage();
		}
	}
});