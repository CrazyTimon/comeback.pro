Meteor.startup(function() {
	if (Meteor.isServer) {
		ssh2 = Meteor.require('ssh2');
		var ssh2C = new ssh2();
		ssh2C.connect({
			host: 'comeback.pro',
			port: 22,
			username: 'maxpain177',
			password: '64276427'
		})

		Servers.start = function(matchId, serverName, map, type, team1Name, team2Name) {
			if (!(matchId && serverName && map && type && team1Name && team2Name)) throw new Meteor.Error('Нет аргументов');
			if (!Servers.findOne({name: serverName})) throw new Meteor.Error('Сервер не найден');
			var server = Servers.findOne({name: serverName});
			ssh2C.exec('uptime', function() {
				var rconC = RCON(server.ip, 27016, '64276427');
				rconC.command('status', function(result) {
					console.log(result);
				});
			});
		};
	}
});