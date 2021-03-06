Meteor.methods({
	startMatch: function(serverName, game, map, members) {
		if (!this.userId) throw new Meteor.Error('Доступ запрещен');
		var team = Teams.findOne({'members._id': this.userId});
		var user = Meteor.users.findOne(this.userId);
		if (!(serverName && game && map && team && members)) throw new Meteor.Error('Нет аргументов');
		check([serverName, game, map], [String]);
		check(members, Array);
		if (!inArray(user.profile.name, members)) throw new Meteor.Error('Вы не в списке участников');
		if ((members.length > 5) || (members.length < 1)) throw new Meteor.Error('Вы выбрали неправильное количество тиммейтов');
		if (Matches.findOne({$and: [{$or: [{'team1._id': team._id}, {'team2._id': team._id}]}, {$or: [{'status': 'inGame'}, {'status': 'inSearch'}]}]})) throw new Meteor.Error('Ваша команда уже в другой игре');
		for (var i = 0; i < members.length; i++) {
			var member = members[i];
			if (!Teams.findOne({'members.username': member, name: team.name})) {
				break;
				throw new Meteor.Error('Пользователь ' + member + ' не найден');
			}
		}
		var server = Servers.findOne({'name': serverName});
		if (!server) throw new Meteor.Error('Такого сервера не существует');
		var type = members.length + 'x' + members.length;
		var matchId = Matches.insert({
			server: {
				name: server.name,
				location: server.location
			}, 
			map: map,
			game: game,
			type: type, 
			team1: {
				_id: team._id,
				name: team.name,
				members: members,
				score: 0
			}, 
			team2: {
				score: 0
			},
			status: 'inSearch'
		});
		for (var i = 0; i < members.length; i++) {
			matchStream.emit('makeMatch', members[i]);
		}
		return matchId;
	},

	abortMatch: function() {
		if (!this.userId) throw new Meteor.Error('Доступ запрещен');
		var team = Teams.findOne({'members._id': this.userId});
		if (!team) throw new Meteor.Meteor.Error('Вы не в команде');
		var match = Matches.findOne({$or: [{'team1._id': team._id}, {'team2._id': team._id}]});
		if (!match) throw new Meteor.Error('Вы не начинали CW');
		if ((match.status === 'inGame') || (match.status === 'finished')) throw new Meteor.Error('Этот матч уже идёт/закончен');
		Matches.remove(match._id);
	},

	goCW: function(matchId, members) {
		if (!(matchId && members)) throw new Meteor.Error('Нет аргументов');
		check(matchId, String);
		check(members, Array);
		if (!Matches.find(matchId)) throw new Meteor.Error('Матч не найден');
		var user = Meteor.users.findOne(this.userId);
		var team = Teams.findOne({'members.username': user.profile.name});
		var match = Matches.findOne(matchId);
		if (Matches.findOne({$and: [{$or: [{'team1._id': team._id}, {'team2._id': team._id}]}, {$or: [{'status': 'inGame'}, {'status': 'inSearch'}]}]})) throw new Meteor.Error('Ваша команда уже в другой игре');
		if (!(user.profile.name && team)) throw new Meteor.Error('Вы не в команде');
		if (team._id === match.team1._id) throw new Meteor.Error('Невозможно начать CW против своей команды');
		if (!(match.status === 'inSearch')) throw new Meteor.Error('Эта команда уже играет с другой командой');
		Matches.update(matchId, {
			$set: {
				team2: {
					_id: team._id,
					name: team.name,
					members: members,
					score: 0
				},
				status: 'inGame',
				gamestatus: 'startingServer',
			}
		}, function() {
			var match = Matches.findOne(matchId);
			Servers[match.server.name].start(match);
		});
	}
});