Meteor.methods({
	'createTeam': function(teamName) {
		if (teamName) {
			if (Teams.findOne({name: teamName})) {
				throw new Meteor.Error(403, "Команда " + teamName + " уже существует.");
			} else {
				if (!Meteor.users.findOne({_id: this.userId}).profile.team) {
					var username = Meteor.users.findOne({_id: this.userId}).profile.name;
					if (!Teams.findOne({captain: username})) {
							var username = Meteor.users.findOne({_id: this.userId}).profile.name;
							var teamId = Teams.insert({
								name: teamName,
								captain: username,
								dateCreate: Date.now(), 
								image: "/img/teams/default.png"
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
					} else {
						throw new Meteor.Error(403, "Вы капитан другой команды");
					}
				} else {
					throw new Meteor.Error(403, "Вы уже в команде");
				}
			}
		} else {
			throw new Meteor.Error(403, "Нет аргументов");
		}
	},

	'joinToTeam': function(teamName) {
		if (teamName) {
			var username = Meteor.users.findOne(this.userId).profile.name;
			if (!Teams.findOne({"members.username": username})) {
				var teamId = Teams.findOne({name: teamName})._id;
				var captain = Teams.findOne({name: teamName}).captain;
				if (teamId) {
					Teams.update({_id: teamId}, {
						$addToSet: {
							members: {
								_id: this.userId,
								username: username, 
								accepted: false,
								dateJoin: Date.now()
							}
						}
					});
					mainStream.emit('joinToTeam', captain, username);
				} else {
					throw new Meteor.Error(404, "Команда " + teamName + " не найдена.");
				}
			} else {
				throw new Meteor.Error(403, "Вы уже в команде");
			}
		} else {
			throw new Meteor.Error(403, "Нет аргументов");
		}
	},

	'acceptFromTeam': function(username) {
		if (username) {
			var captain = Meteor.users.findOne({_id: this.userId});
			if (Teams.findOne({captain: captain.profile.name})) {
				if (Teams.findOne({captain: captain.profile.name, "members.username": username})) {
					if (Teams.findOne({captain: captain.profile.name, "members.username": username, "members.accepted": false})) {
						var teamId = Teams.findOne({captain: captain.profile.name})._id;
						var teamName = Teams.findOne({captain: captain.profile.name}).name;
						Teams.update({
							_id: teamId, 
							"members.username": username
						}, 
						{
							$set: {
								'members.$.accepted': true
							}
						});
						mainStream.emit('acceptFromTeam', username, teamName);
					} else {
						throw new Meteor.Error(403, "Данный пользователь уже допущен к команде");
					}
				} else {
					throw new Meteor.Error(403, "Данный пользователь не вступал в команду");
				}
			} else {
				throw new Meteor.Error(403, "Вы не капитан данной команды");
			}
		} else {
			throw new Meteor.Error(403, "Нет аргументов");
		}
	},

	'declineFromTeam': function(username) {
		if (username) {
			var captain = Meteor.users.findOne({_id: this.userId});
			if (Teams.findOne({captain: captain.profile.name})) {
				if (Teams.findOne({captain: captain.profile.name, "members.username": username})) {
					if (Teams.findOne({captain: captain.profile.name, "members.username": username, "members.accepted": false})) {
						var teamId = Teams.findOne({captain: captain.profile.name})._id;
						var teamName = Teams.findOne({captain: captain.profile.name}).name;
						Teams.update({_id: teamId}, {
							$pull: {
								members: {
									username: username
								}
							}
						});
						mainStream.emit('declineFromTeam', username, teamName);
					} else {
						throw new Meteor.Error(403, "Данный пользователь уже допущен к команде");
					}
				} else {
					throw new Meteor.Error(403, "Данный пользователь не вступал в команду");
				}
			} else {
				throw new Meteor.Error(403, "Вы не капитан данной команды");
			}
		} else {
			throw new Meteor.Error(403, "Нет аргументов");
		}
	},
	'kickFromTeam': function(username) {
		if (username) {
			var captain = Meteor.users.findOne({_id: this.userId});
			var teamName = Teams.findOne({captain: captain.profile.name}).name;
			if (Teams.findOne({captain: captain.profile.name})) {
				if (Teams.findOne({captain: captain.profile.name, "members.username": username})) {
					if (!(Teams.findOne({name: teamName}).captain === username) || Teams.findOne({name: teamName}).members.length === 1) {
						if ( !(Matches.findOne({'team.name': teamName}) || Matches.findOne({'team2.name': teamName})) ) {
							if (Teams.findOne({name: teamName}).members.length === 1) {
								Teams.remove({name: teamName});
							} else {
								Teams.update({name: teamName}, {
									$pull: {
										members: {
											username: username
										}
									}
								});
								mainStream.emit('kickFromTeam', username, teamName);
							}
						} else {
							throw new Meteor.Error(403, "Ваша команда учавствует на CW");
						}
					} else {
						throw new Meteor.Error(403, "Сначала сделайте капитаном другого игрока");
					}
				} else {
					throw new Meteor.Error(403, "Данный пользователь не вступал в команду");
				}
			} else {
				throw new Meteor.Error(403, "Вы не капитан данной команды");
			}
		} else {
			throw new Meteor.Error(403, "Нет аргументов");
		}
	},
	'leaveFromTeam': function(teamName) {
		if (teamName) {
			var username = Meteor.users.findOne({_id: this.userId}).profile.name;
			if (Teams.findOne({"members.username": username})) {
				if (!(Teams.findOne({name: teamName}).captain === username) || Teams.findOne({name: teamName}).members.length === 1) {
					if ( !(Matches.findOne({'team.name': teamName}) || Matches.findOne({'team2.name': teamName})) ) {
						if (Teams.findOne({name: teamName}).members.length === 1) {
							Teams.remove({name: teamName});
						} else {
							Teams.update({name: teamName}, {
								$pull: {
									members: {
										username: username
									}
								}
							});
							var captain = Teams.findOne({name: teamName}).captain;
							mainStream.emit('leaveFromTeam', captain, username);
						}
					} else {
						throw new Meteor.Error(403, "Ваша команда учавствует на CW");
					}
				} else {
					throw new Meteor.Error(403, "Сначала сделайте капитаном другого игрока");
				}
			} else {
				throw new Meteor.Error(403, "Вы не вступали в данную команду");
			}
		} else {
			throw new Meteor.Error(403, "Нет аргументов");
		}
	},
	'makeCaptain': function(username) {
		if (username) {
			var captain = Meteor.users.findOne({_id: this.userId});
			var teamName = Teams.findOne({captain: captain.profile.name}).name;
			if (Teams.findOne({captain: captain.profile.name})) {
				if (!(username === Teams.findOne({name: teamName}).captain)) {
					Teams.update({name: teamName}, {
						$set: {
							captain: username
						}
					});					
				} else {
					throw new Meteor.Error(403, "Вы уже являетесь капитаном");
				}
			} else {
				throw new Meteor.Error(403, "Вы не капитан данной команды");
			}
		} else {
			throw new Meteor.Error(403, "Нет аргументов");
		}
	}
}); 