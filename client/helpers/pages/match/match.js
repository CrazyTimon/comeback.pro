Handlebars.registerHelper('myMatchStatus', function() {
	var user = Meteor.user().profile.name;
	var myMatch = Matches.findOne({membersTeam1: user}) ? Matches.findOne({membersTeam1: user}) : Matches.findOne({membersTeam2: user});
	var status = myMatch ? myMatch.status : false;
	switch (status) {
		case "inGame":
			return "inGame";
			break;
		case "inSearch":
			return "inSearch";
			break;
		case "finished":
			return "finished";
			break;
	}
});

Handlebars.registerHelper('myMatchId', function() {
	var user = Meteor.user().profile.name;
	var myMatch = Matches.findOne({membersTeam1: user}) ? Matches.findOne({membersTeam1: user}) : Matches.findOne({membersTeam2: user});
	return myMatch ? myMatch._id : false;
});

Handlebars.registerHelper('matchStatus', function(username) {
	var match = Matches.findOne({membersTeam1: username}) ? Matches.findOne({membersTeam1: username}) : Matches.findOne({membersTeam2: username});
	var status = match ? match.status : false;
	switch (status) {
		case "inGame":
			return "inGame";
			break;
		case "inSearch":
			return "inSearch";
			break;
		case "finished":
			return "finished";
			break;
	}
});

Handlebars.registerHelper('matchStatusInSearch', function(username) {
	var match = Matches.findOne({membersTeam1: username}) ? Matches.findOne({membersTeam1: username}) : Matches.findOne({membersTeam2: username});
	var status = match ? match.status : false;
	return (status === 'inSearch') ? status : false;
});

Handlebars.registerHelper('matchStatusInGame', function(username) {
	var match = Matches.findOne({membersTeam1: username}) ? Matches.findOne({membersTeam1: username}) : Matches.findOne({membersTeam2: username});
	var status = match ? match.status : false;
	return (status === 'inGame') ? status : false;
});

Handlebars.registerHelper('matchId', function(username) {
	var match = Matches.findOne({membersTeam1: username}) ? Matches.findOne({membersTeam1: username}) : Matches.findOne({membersTeam2: username});
	return match ? match._id : false;
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