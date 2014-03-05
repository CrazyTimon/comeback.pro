Matches = new Meteor.Collection("Matches");

if (Meteor.isServer) {
	Matches.allow({
		insert: function (userId, doc) {
			if (Roles.userIsInRole(userId, ['admin'])) return true;
		},
		update: function (userId, doc, fields, modifier) {
			if (Roles.userIsInRole(userId, ['admin'])) return true;
		},
		remove: function (userId, doc) {
			if (Roles.userIsInRole(userId, ['admin'])) return true;
		}
	});

	Meteor.publish('matches', function() {
		if (this.userId) {
			return Matches.find();
		} else {
			return null;
		}
	});
}