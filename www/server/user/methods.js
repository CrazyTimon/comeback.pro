Meteor.methods({
	'addFriend': function(username) {
		if (!username) throw new Meteor.Error(404, "Нет аргументов");
		var user = Meteor.users.findOne({_id: this.userId});
		if (!user) throw new Meteor.Error(404, "Доступ запрещён");
		if (user.username === username) throw new Meteor.Error(404, "Нельзя добавить самого себя");
		Meteor.users.update({username: user.username}, {$addToSet: {"profile.friends": {username: username, accepted: true}}});
		Meteor.users.update({username: username}, {$addToSet: {"profile.friends": {username: user.username, accepted: false}}});
		mainStream.emit('addFriend', user.username, username);
	},
	'deleteFriend': function(username) {
		if (!username) throw new Meteor.Error(404, "Нет аргументов");
		var user = Meteor.users.findOne({_id: this.userId});
		if (!user) throw new Meteor.Error(404, "Доступ запрещён");
		if (user.username === username) throw new Meteor.Error(404, "Нельзя удалить самого себя");
		Meteor.users.update({username: user.username}, {$pull: {"profile.friends": {username: username}}});
		Meteor.users.update({username: username}, {$pull: {"profile.friends": {username: user.username}}});
		mainStream.emit('deleteFriend', user.username, username);
	},
	'acceptRequestFriend': function(username) {
		if (!username) throw new Meteor.Error(404, "Нет аргументов");
		var user = Meteor.users.findOne({_id: this.userId});
		if (!user) throw new Meteor.Error(404, "Доступ запрещён");
		if (user.username === username) throw new Meteor.Error(404, "Нельзя принять заявку в друзья самого себя");
		Meteor.users.update({username: user.username, "profile.friends.username": username}, {$set: {"profile.friends.$.accepted": true}});
		mainStream.emit('acceptRequestFriend', user.username, username);
	},
	'declineRequestFriend': function(username) {
		if (!username) throw new Meteor.Error(404, "Нет аргументов");
		var user = Meteor.users.findOne({_id: this.userId});
		if (!user) throw new Meteor.Error(404, "Доступ запрещён");
		if (user.username === username) throw new Meteor.Error(404, "Нельзя отклонить заявку самого себя");
		Meteor.users.update({username: user.username}, {$pull: {"profile.friends": {username: username}}});
		Meteor.users.update({username: username}, {$pull: {"profile.friends": {username: user.username}}});
		mainStream.emit('declineRequestFriend', user.username, username);
	},
	'abortRequestFriend': function(username) {
		if (!username) throw new Meteor.Error(404, "Нет аргументов");
		var user = Meteor.users.findOne({_id: this.userId});
		if (!user) throw new Meteor.Error(404, "Доступ запрещён");
		if (user.username === username) throw new Meteor.Error(404, "Нельзя отменить заявку в друзья самого себя");
		Meteor.users.update({username: user.username}, {$pull: {"profile.friends": {username: username}}});
		Meteor.users.update({username: username}, {$pull: {"profile.friends": {username: user.username}}});
	}
});