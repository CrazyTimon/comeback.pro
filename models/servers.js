Meteor.startup(function() {
	if (Meteor.isServer) {
		ssh2 = Meteor.require('ssh2');
		var c = new ssh2();
		c.connect({
			host: 'comeback.pro',
			port: 22,
			username: 'maxpain177',
			password: '64276427'
		})

		Servers.start = function(matchId, serverName, map, type, team1Name, team2Name) {
			if (!(matchId && serverName && map && type && team1Name && team2Name)) throw new Meteor.Error('Нет аргументов');
			if (!Servers.findOne({name: serverName})) throw new Meteor.Error('Сервер не найден');
			var server = Servers.findOne({name: serverName});
			var maxPlayers = parseInt(type[0], 10) + parseInt(type[2], 10) + 1; // + 1 HLTV
			var port = server.lastUsedPort + 1;
			c.exec('cd ~/hlds/cw && screen -AdmS comeback.cw-' + matchId + ' ./hlds_run -game cstrike -port ' + port + ' +maxplayers ' + maxPlayers + ' +map ' + map + ' -pingboost 3 -master -secure', function() {
				var rconC = new RCON(server.ip, port, server.password);
				rconC.query('cw_start ' + team1Name + ' ' + team2Name);
			});
			Servers.update({name: serverName}, {$set: {lastUsedPort: port}});
			Matches.update({_id: matchId}, {$set: {ip: server.ip, port: port}});
		};
	}
});