Handlebars.registerHelper('myMatchStatus', function() {
	if (Matches.findOne({membersTeam1: Meteor.user().profile.name}).status || Matches.findOne({membersTeam2: Meteor.user().profile.name}).status) {
		var status = Matches.findOne({membersTeam1: Meteor.user().profile.name}).status || Matches.findOne({membersTeam2: Meteor.user().profile.name}).status;
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
	if (Matches.findOne({membersTeam1: Meteor.user().profile.name})._id || Matches.findOne({membersTeam2: Meteor.user().profile.name})._id) {
		var id = Matches.findOne({membersTeam1: Meteor.user().profile.name})._id || Matches.findOne({membersTeam2: Meteor.user().profile.name})._id;
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
	if (Matches.findOne({membersTeam1: username}) || Matches.findOne({membersTeam2: username})) {
		var status =  Matches.findOne({membersTeam1: username}).status || Matches.findOne({membersTeam2: username}).status;
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
	if (Matches.findOne({membersTeam1: username}) || Matches.findOne({membersTeam2: username})) {
		var status =  Matches.findOne({membersTeam1: username}).status || Matches.findOne({membersTeam2: username}).status;
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
	if ( Matches.findOne({membersTeam1: username}) || Matches.findOne({membersTeam2: username})) {
		var status = Matches.findOne({membersTeam1: username}).status || Matches.findOne({membersTeam2: username}).status;
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
	if (Matches.findOne({membersTeam1: username}) || Matches.findOne({membersTeam2: username})) {
		var id = Matches.findOne({membersTeam1: username})._id || Matches.findOne({membersTeam2: username})._id;
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
		var members = $('#selectPlayers').val();
		if(target.hasAttribute("data-id")) {
			Meteor.call('goCW', target.getAttribute("data-id"), members, function(error, result) {
				if (error) alert(error);
			});
		}
	}
});