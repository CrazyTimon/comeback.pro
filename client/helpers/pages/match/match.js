Handlebars.registerHelper('matchGameStatus', function(username) {
	var match = Matches.findOne({'team1.members': username}) ? Matches.findOne({'team1.members': username}) : Matches.findOne({'team2.members': username});
	if (match) {
		switch (match.gameStatus) {
			case 'warmup':
				return 'Разминка'
				break;
			case 'knife':
				return 'Ножевой раунд'
				break;
			case 'half1':
				return 'Первая половина'
				break;
			case 'half2':
				return 'Вторая половина'
				break;
			case 'overtime':
				return 'Овертайм'
				break;
		}
	}
});

Handlebars.registerHelper('matchGameStatusByMatchId', function(matchId) {
	var match = Matches.findOne(matchId);
	if (match) {
		switch (match.gameStatus) {
			case 'warmup':
				return 'Разминка'
				break;
			case 'knife':
				return 'Ножевой раунд'
				break;
			case 'half1':
				return 'Первая половина'
				break;
			case 'half2':
				return 'Вторая половина'
				break;
			case 'overtime':
				return 'Овертайм'
				break;
		}
	}
});

Handlebars.registerHelper('matchStatus', function(username) {
	var match = Matches.findOne({'team1.members': username}) ? Matches.findOne({'team1.members': username}) : Matches.findOne({'team2.members': username});
	return match ? match.status : false;
});

Handlebars.registerHelper('matchId', function(username) {
	var match = Matches.findOne({'team1.members': username}) ? Matches.findOne({'team1.members': username}) : Matches.findOne({'team2.members': username});
	return match ? match._id : false;
});

Handlebars.registerHelper('myMatchId', function() {
	var username = Meteor.user().profile.name;
	var match = Matches.findOne({'team1.members': username}) ? Matches.findOne({'team1.members': username}) : Matches.findOne({'team2.members': username});
	return match ? match._id : false;
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

Template.match.events({
	'click #abortMatch': function () {
		if (confirm('Вы действительно хотите отменить текущий матч?')) {
			Meteor.call('abortMatch', function(error, result) {
				error ? alert(error) : Router.go('/')
			});
		}
	},
	'click .goCW': function (e) {
		var target = e.currentTarget;
		if(!target) return;
		var members = $('#selectPlayers').val();
		if(target.hasAttribute('data-id')) {
			Meteor.call('goCW', target.getAttribute('data-id'), members, function(error, result) {
				if (error) alert(error);
			});
		}
	}
});