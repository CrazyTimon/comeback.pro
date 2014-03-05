Meteor.methods({
	addServer: function(name, ip, login, password, path, country, city) {
		console.log(name, ip, login, password, path, country, city);
		if (!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) throw new Meteor.Error(403, 'Permission denied');
		if (!(name && ip && login && password && path && country && city)) throw new Meteor.Error(400, 'Bad request');
		if (Servers.findOne({name: name}) || Servers.findOne({ip: ip})) throw new Meteor.Error(400, 'Такой сервер уже существует');
		Servers.add(name, ip, login, password, path, country, city);
	}
});