mainStream.on('addFriend', function(user, username) {
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

mainStream.on('deleteFriend', function(user, username) {
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

mainStream.on('acceptRequestFriend', function(user, username) {
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

mainStream.on('declineRequestFriend', function(user, username) {
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



Template.user.events({
	'click #addFriend': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			var username = target.getAttribute("data-id");
			Meteor.call('addFriend', username, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	},
	'click #deleteFriend': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			var username = target.getAttribute("data-id");
			Meteor.call('deleteFriend', username, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	},
	'click #acceptRequestFriend': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			var username = target.getAttribute("data-id");
			Meteor.call('acceptRequestFriend', username, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	},
	'click #declineRequestFriend': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			var username = target.getAttribute("data-id");
			Meteor.call('declineRequestFriend', username, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	},
	'click #abortRequestFriend': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			var username = target.getAttribute("data-id");
			Meteor.call('abortRequestFriend', username, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	}
});