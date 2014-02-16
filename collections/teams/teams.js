Teams = new Meteor.Collection("Teams");

Teams.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fields, modifier) {
		return true;
	}
});