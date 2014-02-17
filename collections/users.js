if (Meteor.isServer) {
	Meteor.users.allow({
		insert: function (userId, doc) {
			if (Roles.userIsInRole(userId, ['admin'])) return true;
		},
		update: function (userId, doc, fields, modifier) {
			if (Roles.userIsInRole(userId, ['admin'])) return true;
		},
		remove: function (userId, doc) {
			if (Roles.userIsInRole(userId, ['admin'])) return true;
		}
	});

	Meteor.publish('users', function() {
		if (this.userId) {
			return Meteor.users.find({}, {
				fields: {
					'username': 1, 
					'emails': 1, 
					'profile': 1,
					'roles': 1
				}
			});
		} else {
			this.stop();
			return;
		}
	});
}