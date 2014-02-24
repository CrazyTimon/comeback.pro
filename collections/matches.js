Matches = new Meteor.Collection("Matches");

if (Meteor.isServer) {
	Matches.allow({
		insert: function (userId, doc) {
			return true;
		},
		update: function (userId, doc, fields, modifier) {
			return true;
		},
		remove: function (userId, doc) {
			return true;
		}
	});

	Meteor.publish('matches', function() {
		if (this.userId) {
			return Matches.find();
		} else {
			this.stop();
			return;
		}
	});
}