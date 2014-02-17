mainStream = new Meteor.Stream('mainStream');

if (Meteor.isServer) {
	mainStream.permissions.read(function() {
	  return true;
	});

	mainStream.permissions.write(function() {
	  return true;
	});
}