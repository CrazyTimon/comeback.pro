mainStream.on('makeMatch', function(member, matchId, type, map) {
	if (member == Meteor.user().username) {
		var notify = new Notification("Приглашение на CW", {
			tag: 'makeMatch',
			body: Meteor.user().username + ', готовьтесь к CW ('+type+') на карте '+map+'.',
			icon: Teams.findOne({'members._id': Meteor.userId()}).image
		});
	}
});