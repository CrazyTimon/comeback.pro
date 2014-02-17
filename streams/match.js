matchStream = new Meteor.Stream('matchStream', function() {
	if (Meteor.isServer) {
		matchStream.permissions.read(function() {
			return true;
		});

		matchStream.permissions.write(function() {
			return true;
		});
	}

	if (Meteor.isClient) {
		matchStream.on('makeMatch', function(member, matchId, type, map) {
			if (member == Meteor.user().username) {
				var notify = new Notification("Приглашение на CW", {
					tag: 'makeMatch',
					body: Meteor.user().username + ', готовьтесь к CW ('+type+') на карте '+map+'.',
					icon: Teams.findOne({'members._id': Meteor.userId()}).image
				});
			}
		});
	}
});