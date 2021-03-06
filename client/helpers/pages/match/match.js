Handlebars.registerHelper('teamMatchesWin', function(teamname) {
	return Matches.find({'winTeam.name': teamname}).fetch();
});

Handlebars.registerHelper('teamMatchesLose', function(teamname) {
	return Matches.find({'loseTeam.name': teamname}).fetch();
});

Handlebars.registerHelper('teamMatches', function(teamname) {
	return Matches.find({$or: [{'winTeam.name': teamname}, {'loseTeam.name': teamname}]}).fetch();
});

Handlebars.registerHelper('userMatchesWin', function(username) {
	return Matches.find({'winTeam.members': username}).fetch();
});

Handlebars.registerHelper('userMatchesLose', function(username) {
	return Matches.find({'loseTeam.members': username}).fetch();
});

Handlebars.registerHelper('userMatches', function(username) {
	return Matches.find({$or: [{'winTeam.members': username}, {'loseTeam.members': username}]}).fetch();
});

Handlebars.registerHelper('getGameStatus', function(status) {
	switch (status) {
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
		case 'startingServer':
			return 'Запуск сервера'
			break;
	}
});

Handlebars.registerHelper('winTeam', function(team1, team2) {
	if (team1 && team2) {
		return (team1.score > team2.score) ? team1.name : (team1.score < team2.score) ? team2.name : 'Ничья'
	}
});

Handlebars.registerHelper('matchGameStatus', function(username) {
	var match = Matches.findOne({$or: [{'team1.members': username}, {'team2.members': username}]});
	if (match) {
		switch (match.gamestatus) {
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
		if (match.status !== 'inGame') return;
		switch (match.gamestatus) {
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
	var match = Matches.findOne({
		$and: [
			{
				$or: [
					{'team1.members': username},
					{'team2.members': username}
				]
			}, {
				$or: [
					{status: 'inGame'},
					{status: 'inSearch'}
				]
			}
		]
	});
	if (match) {
		return match.status;
	}
});

Handlebars.registerHelper('matchId', function(username) {
	var match = Matches.findOne({$and: [{$or: [{'team1.members': username}, {'team2.members': username}]}, {$or: [{'status': 'inSearch'}, {'status': 'inGame'}]}]});
	return match ? match._id : false;
});

Handlebars.registerHelper('myMatchId', function() {
	var username = Meteor.user().profile.name;
	var match = Matches.findOne({$and: [{$or: [{'team1.members': username}, {'team2.members': username}]}, {$or: [{'status': 'inSearch'}, {'status': 'inGame'}]}]});
	return match ? match._id : false;
});

Handlebars.registerHelper('matchStatusInSearch', function(username) {
	if (Matches.findOne({$or: [{'team1.members': username}, {'team2.members': username}], status: 'inSearch'})) return true;
});

Handlebars.registerHelper('matchStatusInGame', function(username) {
	if (Matches.findOne({$or: [{'team1.members': username}, {'team2.members': username}], status: 'inGame'})) return true;
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
		$('#goCWModal').modal('hide');
		var target = e.currentTarget;
		if(!target) return;
		var members = $('#selectPlayers').val();
		var matchId = target.getAttribute('data-id');
		if(target.hasAttribute('data-id')) {
			Meteor.call('goCW', matchId, members, function(error, result) {
				if (error) alert(error);
			});
		}
	}
});