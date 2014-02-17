mainStream.on('joinToTeam', function(captain, username) {
	if (captain == Meteor.user().username) {
		var notify = new Notification("Новый тиммейт", {
			tag: 'joinToTeam',
			body: 'В вашу команду подал заявку на вступление ' + username + '.',
			icon: Teams.findOne({'members._id': Meteor.userId()}).image
		});
	}
});

mainStream.on('acceptFromTeam', function(username, team) {
	if (username == Meteor.user().username) {
		var notify = new Notification("Заявка одобрена", {
			tag: 'acceptFromTeam',
			body: username + ', Вас приняли в команду ' + team + '.',
			icon: Teams.findOne({'members._id': Meteor.userId()}).image
		});
	}
});

mainStream.on('declineFromTeam', function(username, team) {
	if (username == Meteor.user().username) {
		var notify = new Notification("Заявка отклонена", {
			tag: 'declineFromTeam',
			body: username + ', Вашу заявку на вступление в команду ' + team + ' отклонили',
			icon: Teams.findOne({'members._id': Meteor.userId()}).image
		});
	}
});

mainStream.on('kickFromTeam', function(username, team) {
	if (username == Meteor.user().username) {
		var notify = new Notification("ComeBack.pro", {
			tag: 'KickFromTeam',
			body: username + ', Ваc исключили из команды ' + team,
			icon: Teams.findOne({'members._id': Meteor.userId()}).image
		});
	}
});

mainStream.on('leaveFromTeam', function(captain, username, team) {
	if (captain == Meteor.user().username) {
		var notify = new Notification("ComeBack.pro", {
			tag: 'leaveFromTeam',
			body: username + ' покинул вашу команду',
			icon: Teams.findOne({'members._id': Meteor.userId()}).image
		});
	}
});