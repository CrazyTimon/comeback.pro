Servers = new Meteor.Collection("Servers");

if (Meteor.isServer) {
	Servers.allow({
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

	Meteor.publish('servers', function() {
		if (this.userId) {
			if (Roles.userIsInRole(this.userId, ['admin'])) {
				return Servers.find();
			} else {
				return Servers.find({}, {
					fields: {
						'ip': 1, 
						'location': 1, 
						'name': 1
					}
				});
			}
		} else {
			return null;
		}
	});
}