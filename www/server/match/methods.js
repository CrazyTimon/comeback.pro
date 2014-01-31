Meteor.methods({
	startMatch: function(server, map, members) {
		if (this.userId) {
			var team = Teams.findOne({"members._id": this.userId});
			if (server && map && team && members) {
				if ( !(Matches.findOne({team2: team})) && !(Matches.findOne({team: team})) ) {
					if (!(members.length > 5)) {
						for (var i = 0; i < members.length; i++) {
							var member = members[i];
							if (!Teams.findOne({"members.username": member})) {
								break;
								throw new Meteor.Error(403, "Пользователь не найден");
							}
						}
						var type = members.length + "x" + members.length;
						var matchId = Matches.insert({server: server, map: map, type: type, team: team, members: members, status: 'inSearch'});
						for (var i = 0; i < members.length; i++) {
							var member = members[i];
							Meteor.users.update({username: member}, {$set: {"profile.inGame": true}});
							mainStream.emit('makeMatch', member, matchId, type, map);
						}
						return matchId;
					} else {
						throw new Meteor.Error(403, "Вы выбрали больше 5 игроков.");
					}
				} else {
					throw new Meteor.Error(403, "Ваша команда уже находитесь в игре");
				}
			} else {
				throw new Meteor.Error(404, "Нет аргументов");
			}
		} else {
			throw new Meteor.Error(403, "Доступ запрещен");
		}
	},

	abortMatch: function() {
		if (this.userId) {
			var team = Teams.findOne({"members._id": this.userId});
			var username = Meteor.users.findOne({_id: this.userId}).username;
			if (Matches.findOne({'team.name': team.name, "members": username})) {
				if (!(Matches.findOne({'team.name': team.name, "members": username}).status === 'inGame')) {
					Matches.remove({'team.name': team.name, "members": username});
				} else {
					throw new Meteor.Error(403, "Игра уже началась");
				}
			} else {
				throw new Meteor.Error(403, "Вы не начинали CW");
			}
		} else {
			throw new Meteor.Error(403, "Доступ запрещен");
		}
	},

	goCW: function(matchId) {
		if (!matchId) throw new Meteor.Error(404, "ID матча не найден");
		var username = Meteor.users.findOne({_id: this.userId}).username;
		var team2 = Teams.findOne({"members.username": username});
		var match = Matches.findOne({_id: matchId});
		if (username && team2) {
			if (!(team2.name === match.team.name)) {
				if (match.status === "inSearch") {
					Matches.update({_id: matchId}, {
						$set: {
							team2: team2,
							status: 'inGame'
						}
					});
					startServer(match._id, match.server, match.map, match.type, match.team.name, team2.name);
				} else {
					throw new Meteor.Error(403, "Эта команда уже играет с другой командой");
				}
			} else {
				throw new Meteor.Error(403, "Невозможно начать CW против своей команды");
			}
		} else {
			throw new Meteor.Error(403, "Вы не в команде");
		}
	}
});