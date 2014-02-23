Meteor.methods({
	'createTeam': function(teamName) {
		if (!teamName) throw new Meteor.Error(403, "Нет аргументов");
		if (Teams.findOne({name: teamName})) throw new Meteor.Error(403, "Команда " + teamName + " уже существует.");
		if (Meteor.users.findOne({_id: this.userId}).profile.team) throw new Meteor.Error(403, "Вы уже в команде");
		var username = Meteor.users.findOne({_id: this.userId}).profile.name;
		if (Teams.findOne({captain: username})) throw new Meteor.Error(403, "Вы капитан другой команды");
		var username = Meteor.users.findOne({_id: this.userId}).profile.name;
		var teamId = Teams.insert({
			name: teamName,
			captain: username,
			dateCreate: Date.now(), 
			image: "/img/teams/default.jpg"
		});
		Teams.update({_id: teamId}, {
			$addToSet: {
				members: {
					_id: this.userId,
					username: username, 
					accepted: true,
					dateJoin: Date.now()
				}
			}
		});
	},

	'joinToTeam': function(teamName) {
		if (!teamName) throw new Meteor.Error(403, "Нет аргументов");
		var username = Meteor.users.findOne(this.userId).profile.name;
		if (Teams.findOne({"members.username": username})) throw new Meteor.Error(403, "Вы уже в команде");
		var teamId = Teams.findOne({name: teamName})._id;
		var captain = Teams.findOne({name: teamName}).captain;
		if (!teamId) throw new Meteor.Error(404, "Команда " + teamName + " не найдена.");
		Teams.update({_id: teamId}, {
			$addToSet: {
				members: {
					_id: this.userId,
					username: username, 
					accepted: false,
					dateJoin: Date.now()
				}
			}
		}, function() {
			teamStream.emit('joinToTeam', captain, username);
		});
		return 'Заявка принята, ожидайте подтверждение капитана команды ' + teamName;
	},

	'acceptFromTeam': function(username) {
		if (!username) throw new Meteor.Error(403, "Нет аргументов");
		var captain = Meteor.users.findOne({_id: this.userId});
		if (!Teams.findOne({captain: captain.profile.name})) throw new Meteor.Error(403, "Вы не капитан данной команды");
		if (!Teams.findOne({captain: captain.profile.name, "members.username": username})) throw new Meteor.Error(403, "Данный пользователь не вступал в команду");
		if (!Teams.findOne({captain: captain.profile.name, "members.username": username, "members.accepted": false})) throw new Meteor.Error(403, "Данный пользователь уже допущен к команде");
		var teamId = Teams.findOne({captain: captain.profile.name})._id;
		var teamName = Teams.findOne({captain: captain.profile.name}).name;
		Teams.update({
			_id: teamId, 
			"members.username": username
		}, {
			$set: {
				'members.$.accepted': true
			}
		}, function() {
			teamStream.emit('acceptFromTeam', username, teamName);
		});
	},

	'declineFromTeam': function(username) {
		if (!username) throw new Meteor.Error(403, "Нет аргументов");
		var captain = Meteor.users.findOne({_id: this.userId});
		if (!Teams.findOne({captain: captain.profile.name})) throw new Meteor.Error(403, "Вы не капитан данной команды");
		if (!Teams.findOne({captain: captain.profile.name, "members.username": username})) throw new Meteor.Error(403, "Данный пользователь не вступал в команду");
		if (!Teams.findOne({captain: captain.profile.name, "members.username": username, "members.accepted": false})) throw new Meteor.Error(403, "Данный пользователь уже допущен к команде");
		var teamId = Teams.findOne({captain: captain.profile.name})._id;
		var teamName = Teams.findOne({captain: captain.profile.name}).name;
		Teams.update({_id: teamId}, {
			$pull: {
				members: {
					username: username
				}
			}
		}, function() {
			teamStream.emit('declineFromTeam', username, teamName);
		});
	},
	'kickFromTeam': function(username) {
		if (!username) throw new Meteor.Error(403, "Нет аргументов");
		var captain = Meteor.users.findOne({_id: this.userId});
		var teamName = Teams.findOne({captain: captain.profile.name}).name;
		if (!Teams.findOne({captain: captain.profile.name})) throw new Meteor.Error(403, "Вы не капитан данной команды");
		if (!Teams.findOne({captain: captain.profile.name, "members.username": username})) throw new Meteor.Error(403, "Данный пользователь не вступал в команду");
		if (!(Teams.findOne({name: teamName}).members.length === 1)) throw new Meteor.Error(403, "Сначала сделайте капитаном другого игрока");
		if ( Matches.findOne({'team1.name': teamName}) || Matches.findOne({'team2.name': teamName})) throw new Meteor.Error(403, "Ваша команда учавствует на CW");
		if (Teams.findOne({name: teamName}).members.length === 1) {
			Teams.remove({name: teamName});
		} else {
			Teams.update({name: teamName}, {
				$pull: {
					members: {
						username: username
					}
				}
			}, function() {
				teamStream.emit('kickFromTeam', username, teamName);
			});
		}
	},
	'leaveFromTeam': function() {
		var username = Meteor.users.findOne({_id: this.userId}).profile.name;
		var teamName = Teams.findOne({'members.username': username}).name;
		if (!Teams.findOne({"members.username": username})) throw new Meteor.Error(403, "Вы не вступали в данную команду");
		if (!(Teams.findOne({name: teamName}).members.length === 1)) throw new Meteor.Error(403, "Сначала сделайте капитаном другого игрока");
		if (Matches.findOne({'team1.name': teamName}) || Matches.findOne({'team2.name': teamName})) throw new Meteor.Error(403, "Ваша команда учавствует на CW");
		if (Teams.findOne({name: teamName}).members.length === 1) {
			Teams.remove({name: teamName});
		} else {
			Teams.update({name: teamName}, {
				$pull: {
					members: {
						username: username
					}
				}
			}, function() {
				var captain = Teams.findOne({name: teamName}).captain;
				teamStream.emit('leaveFromTeam', captain, username);
			});	
		}
	},
	'makeCaptain': function(username) {
		if (!username) throw new Meteor.Error(403, "Нет аргументов");
		var captain = Meteor.users.findOne({_id: this.userId});
		var teamName = Teams.findOne({captain: captain.profile.name}).name;
		if (!Teams.findOne({captain: captain.profile.name})) throw new Meteor.Error(403, "Вы не капитан данной команды");
		if (username === Teams.findOne({name: teamName}).captain) throw new Meteor.Error(403, "Вы уже являетесь капитаном");
		Teams.update({name: teamName}, {
			$set: {
				captain: username
			}
		});					
	}
}); 