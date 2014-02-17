userStream = new Meteor.Stream('userStream', function() {
	if (Meteor.isServer) {
		userStream.permissions.read(function() {
			return true;
		});

		userStream.permissions.write(function() {
			return true;
		});
	}

	if (Meteor.isClient) {
		userStream.on('addFriend', function(user, username) {
			if (username === Meteor.user().username) {
				var notify = new Notification("Заявка в друзья", {
					tag: 'addFriend',
					body: user + ' хочет добавить Вас в друзья',
					icon: 'http://comeback.pro' + Meteor.users.findOne({username: user}).profile.image
				});
				notify.onclick = function() {
					Router.go('/users/' + user);
				};
			}
		});

		userStream.on('deleteFriend', function(user, username) {
			if (username === Meteor.user().username) {
				var notify = new Notification("ComeBack.pro", {
					tag: 'deleteFriend',
					body: user + ' удалил вас из списка друзей',
					icon: 'http://comeback.pro' + Meteor.users.findOne({username: user}).profile.image
				});
				notify.onclick = function() {
					Router.go('/users/' + user);
				};
			}
		});

		userStream.on('acceptRequestFriend', function(user, username) {
			if (username === Meteor.user().username) {
				var notify = new Notification("Заявка принята", {
					tag: 'acceptRequestFriend',
					body: user + ' подтвердил, что вы его друг',
					icon: 'http://comeback.pro' + Meteor.users.findOne({username: user}).profile.image
				});
				notify.onclick = function() {
					Router.go('/users/' + user);
				};
			}
		});

		userStream.on('declineRequestFriend', function(user, username) {
			if (username === Meteor.user().username) {
				var notify = new Notification("Заявка отклонена", {
					tag: 'declineRequestFriend',
					body: user + ' отклонил вашу заявку в друзья',
					icon: 'http://comeback.pro' + Meteor.users.findOne({username: user}).profile.image
				});
				notify.onclick = function() {
					Router.go('/users/' + user);
				};
			}
		});
	}
});