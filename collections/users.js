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
			if (Roles.userIsInRole(this.userId, ['admin'])) {
				return Meteor.users.find();
			} else {
				return Meteor.users.find({}, {
					fields: {
						'profile': 1,
						'roles': 1,
						'services.steam': 1
					}
				});
			}
		} else {
			return null;
		}
	});
}