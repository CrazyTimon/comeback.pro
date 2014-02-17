Meteor.startup(function() {
	chatStream = new Meteor.Stream('chat', function() {
		if (Meteor.isServer) {
			chatStream.permissions.read(function() {
			  return true;
			});

			chatStream.permissions.write(function() {
			  return true;
			});
		}

		if (Meteor.isClient) {
			chatStream.on('chat', function(message) {
				chatCollection.insert({
					username: message.username,
					message: message.text,
					date: Date.now()
				});
				Meteor.setTimeout(function() {
					$("#chat").scrollTop(99999999);
				}, 1)
			});
		}
	});
});