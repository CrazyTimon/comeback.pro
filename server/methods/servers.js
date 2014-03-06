Meteor.methods({
	addServer: function(name, ip, login, password, path, country, city) {
		if (!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) throw new Meteor.Error(403, 'Permission denied');
		if (!(name && ip && login && password && path && country && city)) throw new Meteor.Error(400, 'Bad request');
		if (Servers.findOne({name: name}) || Servers.findOne({ip: ip})) throw new Meteor.Error(400, 'Такой сервер уже существует');
		return Servers.add(name, ip, login, password, path, country, city);
	},
	removeServer: function(serverId) {
		if (!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) throw new Meteor.Error(403, 'Permission denied');
		if (!serverId) throw new Meteor.Error(400, 'Bad request');
		check(serverId, String);
		var serverName = Servers.find(serverId);
		Servers.remove(serverId, function() {
			delete Servers[serverName];
		});
	},
	rebootServer: function(serverId) {
		if (!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) throw new Meteor.Error(403, 'Permission denied');
		if (!serverId) throw new Meteor.Error(400, 'Bad request');
		check(serverId, String);
		var server = Servers.findOne(serverId);
		if (!server) throw new Meteor.Error('Такого сервера не существует');
		Servers[server.name].reboot();
	}
});