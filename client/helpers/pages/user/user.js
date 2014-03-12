Handlebars.registerHelper('isMyFriend', function(username) {
	if (Meteor.users.findOne({_id: Meteor.userId(), "profile.friends": {username: username, accepted: true}}) && Meteor.users.findOne({'profile.name': username, "profile.friends": {username: Meteor.user().profile.name, accepted: true}})) return true;
});

Handlebars.registerHelper('isRequesterFriend', function(username) {
	if (Meteor.users.findOne({'profile.name': username, "profile.friends": {username: Meteor.user().profile.name, accepted: true}}) && Meteor.users.findOne({'profile.username': Meteor.user().profile.name, "profile.friends": {username: username, accepted: false}})) return true;
});

Handlebars.registerHelper('isAccepterFriend', function(username) {
	if (Meteor.users.findOne({'profile.name': username, "profile.friends": {username: Meteor.user().profile.name, accepted: false}}) && Meteor.users.findOne({'profile.name': Meteor.user().profile.name, "profile.friends": {username: username, accepted: true}})) return true;
});

Template.user.events({
	'click #addFriend': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			Meteor.call('addFriend', target.getAttribute("data-id"), function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	},
	'click #deleteFriend': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			var username = target.getAttribute("data-id");
			Meteor.call('deleteFriend', username, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	},
	'click #acceptRequestFriend': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			var username = target.getAttribute("data-id");
			Meteor.call('acceptRequestFriend', username, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	},
	'click #declineRequestFriend': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			var username = target.getAttribute("data-id");
			Meteor.call('declineRequestFriend', username, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	},
	'click #abortRequestFriend': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			var username = target.getAttribute("data-id");
			Meteor.call('abortRequestFriend', username, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	}
});