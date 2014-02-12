Meteor.publish("users", function() {
	return Meteor.users.find({}, {fields: {
		'username': 1, 
		'emails': 1, 
		'profile': 1
	}});
});

Meteor.publish("teams", function() {
	return Teams.find();
});

Meteor.publish("matches", function() {
	return Matches.find();
});

Meteor.publish("news", function() {
	return News.find();
});

Meteor.publish("servers", function() {
	return Servers.find({}, {fields: {
		'ip': 1, 
		'location': 1, 
		'name': 1
	}});
});
