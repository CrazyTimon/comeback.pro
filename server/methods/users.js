Meteor.methods({
	'addFriend': function(username) {
		if (!username) throw new Meteor.Error(404, "Нет аргументов");
		var user = Meteor.users.findOne({_id: this.userId});
		if (!user) throw new Meteor.Error(404, "Доступ запрещён");
		if (user.profile.name === username) throw new Meteor.Error(404, "Нельзя добавить самого себя");
		Meteor.users.update({username: user.profile.name}, {$addToSet: {"profile.friends": {username: username, accepted: true}}}, function() {
			Meteor.users.update({username: username}, {$addToSet: {"profile.friends": {username: user.profile.name, accepted: false}}}, function() {
				mainStream.emit('addFriend', user.profile.name, username);
			});
		});
	},
	'deleteFriend': function(username) {
		if (!username) throw new Meteor.Error(404, "Нет аргументов");
		var user = Meteor.users.findOne({_id: this.userId});
		if (!user) throw new Meteor.Error(404, "Доступ запрещён");
		if (user.profile.name === username) throw new Meteor.Error(404, "Нельзя удалить самого себя");
		Meteor.users.update({username: user.profile.name}, {$pull: {"profile.friends": {username: username}}}, function() {
			Meteor.users.update({username: username}, {$pull: {"profile.friends": {username: user.username}}}, function() {
				mainStream.emit('deleteFriend', user.profile.name, username);
			});
		});

		
	},
	'acceptRequestFriend': function(username) {
		if (!username) throw new Meteor.Error(404, "Нет аргументов");
		var user = Meteor.users.findOne({_id: this.userId});
		if (!user) throw new Meteor.Error(404, "Доступ запрещён");
		if (user.profile.name === username) throw new Meteor.Error(404, "Нельзя принять заявку в друзья самого себя");
		Meteor.users.update({username: user.profile.name, "profile.friends.username": username}, {$set: {"profile.friends.$.accepted": true}}, function() {
			mainStream.emit('acceptRequestFriend', user.profile.name, username);
		});
		
	},
	'declineRequestFriend': function(username) {
		if (!username) throw new Meteor.Error(404, "Нет аргументов");
		var user = Meteor.users.findOne({_id: this.userId});
		if (!user) throw new Meteor.Error(404, "Доступ запрещён");
		if (user.profile.name === username) throw new Meteor.Error(404, "Нельзя отклонить заявку самого себя");
		Meteor.users.update({username: user.profile.name}, {$pull: {"profile.friends": {username: username}}}, function() {
			Meteor.users.update({username: username}, {$pull: {"profile.friends": {username: user.profile.name}}}, function() {
				mainStream.emit('declineRequestFriend', user.profile.name, username);
			});
		});

		
	},
	'abortRequestFriend': function(username) {
		if (!username) throw new Meteor.Error(404, "Нет аргументов");
		var user = Meteor.users.findOne({_id: this.userId});
		if (!user) throw new Meteor.Error(404, "Доступ запрещён");
		if (user.profile.name === username) throw new Meteor.Error(404, "Нельзя отменить заявку в друзья самого себя");
		Meteor.users.update({username: user.profile.name}, {$pull: {"profile.friends": {username: username}}}, function() {
			Meteor.users.update({username: username}, {$pull: {"profile.friends": {username: user.profile.name}}});
		});	
	}
});