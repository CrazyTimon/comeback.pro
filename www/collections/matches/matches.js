Matches = new Meteor.Collection("Matches");

Matches.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fields, modifier) {
		return true;
	}
});