Meteor.methods({
	startMatch: function(server, map, membersTeam1) {
		if (!this.userId) throw new Meteor.Error(403, "Доступ запрещен");
		var team1 = Teams.findOne({"members._id": this.userId});
		if (!(server && map && team1 && membersTeam1)) throw new Meteor.Error(404, "Нет аргументов");
		if (Matches.findOne({team2: team1}) && Matches.findOne({team1: team1})) throw new Meteor.Error(403, "Ваша команда уже в другой игре");
		if ((membersTeam1.length > 5) || (membersTeam1.length < 1)) throw new Meteor.Error(403, "Вы выбрали больше 5 / меньше 1 игроков.");
		for (var i = 0; i < membersTeam1.length; i++) {
			var memberTeam1 = membersTeam1[i];
			if (!Teams.findOne({"members.username": memberTeam1})) {
				break;
				throw new Meteor.Error(403, "Пользователь не найден");
			}
		}
		var type = membersTeam1.length + "x" + membersTeam1.length;
		var matchId = Matches.insert({server: server, map: map, type: type, team1: team1, membersTeam1: membersTeam1, status: 'inSearch'});
		for (var i = 0; i < membersTeam1.length; i++) {
			var memberTeam1 = membersTeam1[i];
			Meteor.users.update({username: memberTeam1}, {$set: {"profile.inGame": true}}, function() {
				matchStream.emit('makeMatch', member, matchId, type, map);
			});
		}
		return matchId;
	},

	abortMatch: function() {
		if (!this.userId) throw new Meteor.Error(403, "Доступ запрещен");
		var team1 = Teams.findOne({"members._id": this.userId});
		var username = Meteor.users.findOne({_id: this.userId}).profile.name;
		if (!(Matches.findOne({'team1.name': team1.name, "membersTeam1": username}) || Matches.findOne({'team2.name': team1.name, "membersTeam2": username}))) throw new Meteor.Error(403, "Вы не начинали CW");
		if (Matches.findOne({'team1.name': team1.name, "membersTeam1": username}).status === 'inGame') throw new Meteor.Error(403, "Игра уже началась");
		Matches.remove({'team1.name': team1.name, "membersTeam1": username});
	},

	goCW: function(matchId, membersTeam2) {
		if (!matchId) throw new Meteor.Error(404, "ID матча не найден");
		var username = Meteor.users.findOne({_id: this.userId}).profile.name;
		var team2 = Teams.findOne({"members.username": username});
		var match = Matches.findOne({_id: matchId});
		if (!(username && team2)) throw new Meteor.Error(403, "Вы не в команде");
		if (team2.name === match.team1.name) throw new Meteor.Error(403, "Невозможно начать CW против своей команды");
		if (!(match.status === "inSearch")) throw new Meteor.Error(403, "Эта команда уже играет с другой командой");
		Matches.update({_id: matchId}, {
			$set: {
				team2: team2,
				membersTeam2: membersTeam2,
				status: 'inGame'
			}
		}, function() {
			Servers.start(match._id, match.server, match.map, match.type, match.team1.name, team2.name);
		});
		
	}
});