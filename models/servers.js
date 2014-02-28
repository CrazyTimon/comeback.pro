Meteor.startup(function() {
	if (Meteor.isServer) {
		if (Servers.findOne({name: 'NSK'})) {
			ssh2 = Meteor.require('ssh2');
			c = new ssh2();
			c.connect({
				host: Servers.findOne({name: 'NSK'}).ip,
				port: 22,
				username: Servers.findOne({name: 'NSK'}).login,
				password: Servers.findOne({name: 'NSK'}).password
			});
		}
		Servers.start = function(matchId, serverName, map, type, team1_id, team2_id) {
			if (!(matchId && serverName && map && type && team1_id && team2_id)) throw new Meteor.Error('Нет аргументов');
			if (!Servers.findOne({name: serverName})) throw new Meteor.Error('Сервер не найден');
			var server = Servers.findOne({name: serverName}),
				team1Name = Teams.findOne(team1_id).name,
				team2Name = Teams.findOne(team2_id).name,
				maxPlayers = parseInt(type[0], 10) + parseInt(type[2], 10) + 1 ,
				port = server.lastUsedPort + 1 ,
				password = randomstring = Math.random().toString(36).slice(-8);
			c.exec('cd ~/hlds/cw && screen -AdmS comeback.cw-' + matchId + ' ./hlds_run -game cstrike -port ' + port + ' +maxplayers ' + maxPlayers + ' +map ' + map + ' sv_password ' + password + ' -pingboost 3 -master -secure', function() {
				var rconC = new RCON(server.ip, port, server.password);
				rconC.query('cw_start ' + team1Name + ' ' + team2Name + ' ' + matchId);
			});
			Servers.update({name: serverName}, {$set: {lastUsedPort: port}}, function() {
				Matches.update({_id: matchId}, {$set: {ip: server.ip, port: port, password: password}});
			});
		};
	}
});