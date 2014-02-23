Servers = new Meteor.Collection("Servers");

if (Meteor.isServer) {
	Servers.allow({
		insert: function (userId, doc) {
			return true;
			//if (Roles.userIsInRole(userId, ['admin'])) return true;
		},
		update: function (userId, doc, fields, modifier) {
			return true;
			//if (Roles.userIsInRole(userId, ['admin'])) return true;
		},
		remove: function (userId, doc) {
			return true;
			//if (Roles.userIsInRole(userId, ['admin'])) return true;
		}
	});

	Meteor.publish('servers', function() {
		if (this.userId) {
			return Servers.find({}, {
				fields: {
					'ip': 1, 
					'location': 1, 
					'name': 1
				}
			});
		} else {
			this.stop();
			return;
		}
	});
}