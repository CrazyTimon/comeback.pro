Meteor.startup(function() {
	if (Meteor.isServer) {
		ssh2 = Meteor.require('ssh2');

		_.each(Servers.find().fetch(), function(server) {
			Servers[server.name] = {};
			Servers[server.name].sshConnection = new ssh2();
			Servers[server.name].sshConnection.connect({
				host: Servers.findOne({name: server.name}).ip,
				port: 22,
				username: Servers.findOne({name: server.name}).login,
				password: Servers.findOne({name: server.name}).password
			});

			Servers[server.name].sshConnection.on('error', function(err) {
				console.log('Connection :: error :: ' + err);
				return;
			});

			Servers[server.name].start = function(matchId, serverName, game, map, type, team1_id, team2_id) {
				if (!(matchId && serverName && map && type && team1_id && team2_id)) throw new Meteor.Error('Нет аргументов');
				if (!Servers.findOne({name: serverName})) throw new Meteor.Error('Сервер не найден');
				var server = Servers.findOne({name: serverName}),
					team1Name = Teams.findOne(team1_id).name,
					team2Name = Teams.findOne(team2_id).name,
					maxPlayers = parseInt(type[0], 10) + parseInt(type[2], 10) + 1 ,
					port = server.lastUsedPort + 1 ,
					password = randomstring = Math.random().toString(36).slice(-8),
					path = server[game].config.path;
				switch (game) {
					case 'cs16': {
						Servers[server.name].sshConnection.exec('cd ' + path + ' && screen -AdmS comeback.cw-' + matchId + ' ./hlds_run -game cstrike -port ' + port + ' +maxplayers ' + maxPlayers + ' +map ' + map + ' sv_password ' + password + ' -pingboost 3 -master -secure', function() {
							var rconConnection = new RCON(server.ip, port, server.password);
							rconConnection.query('cw_start ' + team1Name + ' ' + team2Name + ' ' + matchId);
						});
					}
					case 'csgo': {
						// Future...
					}
					case 'css': {
						// Future...
					}
				}

				Servers.update({name: serverName}, {$set: {lastUsedPort: port}}, function() {
					Matches.update({_id: matchId}, {$set: {ip: server.ip, port: port, password: password}});
				});
			};
			console.log("Server " + server.name + " started!")
		});

		Servers.add = function(name, ip, login, password, path, country, city) {
			if (!(name && ip && login && password && path && country && city)) throw new Meteor.Error(400, 'Bad request');
			if (Servers.find({name: name}) || Servers.find({ip: ip})) throw new Meteor.Error(400, 'Такой сервер уже существует');
			
			var sshConnection = new ssh2();

			sshConnection.connect({
				host: ip,
				port: 22,
				username: login,
				password: password
			});

			sshConnection.on('error', function(err) {
				throw new Meteor.Error('Ошибка соединения с сервером');
				return;
			});

			Servers.insert({
				name: name,
				ip: ip,
				login: login,
				password: password,
				location: {
					contry: country,
					city: city
				},
				lastUsedPort: 27015
			}, function() {
				
			});
		};
	}
});