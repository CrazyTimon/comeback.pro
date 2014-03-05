News = new Meteor.Collection("News");

if (Meteor.isServer) {
	News.allow({
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

	Meteor.publish('news', function() {
		if (this.userId) {
			return News.find();
		} else {
			return null;
		}
	});
}