chatStream = new Meteor.Stream('chat');

if (Meteor.isServer) {
	chatStream.permissions.read(function() {
	  return true;
	});

	chatStream.permissions.write(function() {
	  return true;
	});
}