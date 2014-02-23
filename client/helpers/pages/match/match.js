Handlebars.registerHelper('myMatchStatus', function() {
	if (Matches.findOne({members: Meteor.user().profile.name})) {
		var status = Matches.findOne({members: Meteor.user().profile.name}).status;
		if (status) {
			if (status == "inGame") {
				return "inGame";
			}
			if (status == "inSearch") {
				return "inSearch";
			}
			if (status == "finished") {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Handlebars.registerHelper('myMatchId', function() {
	if (Matches.findOne({members: Meteor.user().profile.name})) {
		var id = Matches.findOne({members: Meteor.user().profile.name})._id;
		if (id) {
			return id;
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Handlebars.registerHelper('matchStatus', function(username) {
	if (Matches.findOne({members: username})) {
		var status = Matches.findOne({members: username}).status;
		if (status) {
			if (status == "inGame") {
				return "inGame";
			}
			if (status == "inSearch") {
				return "inSearch";
			}
			if (status == "finished") {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Handlebars.registerHelper('matchStatusInSearch', function(username) {
	if (Matches.findOne({members: username})) {
		var status = Matches.findOne({members: username}).status;
		if (status) {
			if (status == "inSearch") {
				return "inSearch";
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Handlebars.registerHelper('matchStatusInGame', function(username) {
	if (Matches.findOne({members: username})) {
		var status = Matches.findOne({members: username}).status;
		if (status) {
			if (status == "inSearch") {
				return "inGame";
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Handlebars.registerHelper('matchId', function(username) {
	if (Matches.findOne({members: username})) {
		var id = Matches.findOne({members: username})._id;
		if (id) {
			return id;
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Template.match.events({
	'click #abortMatch': function () {
		if (confirm("Вы действительно хотите отменить текущий матч?")) {
			Meteor.call('abortMatch', function(error, result) {
				if (error) {
					alert(error);
				} else {
					Router.go('/');
				}
			});
		}
	},
	'click .goCW': function (e) {
		e.preventDefault();
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			Meteor.call('goCW', target.getAttribute("data-id"),function(error, result) {
				if (error) alert(error);
			});
		}
	}
});