Meteor.startup(function() {
	if (Meteor.isServer) {
		ssh2 = Meteor.require('ssh2');
		_.each(Servers.find().fetch(), function(server) {
			Servers[server.name] = {};
			Servers[server.name].sshConnection = new ssh2();
			Servers[server.name].sshConnection.connect({
				host: server.ip,
				port: 22,
				username: server.login,
				password: server.password
			});

			Servers[server.name].sshConnection.on('error', function(err) {
				console.log('Connection :: error :: ' + err);
				return;
			});

			Servers[server.name].sshConnection.on('ready', function() {
				Servers[server.name].start = function(match) {
					if (!match) throw new Meteor.Error('Нет аргументов');
						console.log(match);
						var maxPlayers = parseInt(match.type[0], 10) + parseInt(match.type[2], 10) + 1 ,
						port = server.lastUsedPort + 1 ,
						password = Math.random().toString(36).slice(-8),
						path = server.config.path;
					switch (match.game) {
						case 'cs16': {
							Servers[server.name].sshConnection.exec('cd ' + path + ' && cd ' + match.game + ' && screen -AdmS comeback.cw-' + match._id + ' ./hlds_run -game cstrike -port ' + port + ' +maxplayers ' + maxPlayers + ' +map ' + match.map + ' +sv_password ' + password + ' +rcon_password ' + server.password + ' -pingboost 3 -master -secure', function() {
								var rconConnection = new RCON(server.ip, port, server.password);
								rconConnection.query('cw_start ' + match.team1.name + ' ' + match.team2.name + ' ' + match._id);
							});
						}
						case 'csgo': {
							// Future...
						}
						case 'css': {
							// Future...
						}
					}
					Servers.update({name: server.name}, {$set: {lastUsedPort: port}}, function() {
						Matches.update(match._id, {$set: {'server.ip': server.ip, 'server.port': port, 'server.password': password}});
					});
				};
				Servers[server.name].reboot = function() {
					Servers[server.name].sshConnection.exec('reboot');
				};
			});
		});

		Servers.add = function(name, ip, login, password, path, country, city) {
			if (!(name && ip && login && password && path && country && city)) throw new Meteor.Error(400, 'Bad request');
			check([name, ip, login, password, path, country, city], [String]);
			if (Servers.findOne({name: name}) || Servers.findOne({ip: ip})) throw new Meteor.Error(400, 'Такой сервер уже существует');
			var sshConnection = new ssh2();

			var res = Async.runSync(function(done) {
				sshConnection.on('error', function(err) {
					done(null, err);
				});
				sshConnection.on('ready', function() {
					done(null, true);
				});
				sshConnection.connect({
					host: ip,
					port: 22,
					username: login,
					password: password
				});
			});

			if (res.result.code === 'EINVAL') throw new Meteor.Error('Невозможно подключиться к данному серверу');
			if (res.result.level === 'authentication') throw new Meteor.Error('Ошибка авторизации');

			if (res.result === true && res.error === null) {
				Servers.insert({
					name: name,
					ip: ip,
					login: login,
					password: password,
					config: {
						path: path
					},
					location: {
						country: country,
						city: city
					},
					lastUsedPort: 27015
				}, function() {
					Servers[name] = {};
					Servers[name].sshConnection = sshConnection;
					Servers[name].start = function(match) {
						if (!match) throw new Meteor.Error('Нет аргументов');
							var server = Servers.findOne({name: name}),
							maxPlayers = parseInt(match.type[0], 10) + parseInt(match.type[2], 10) + 1 ,
							port = server.lastUsedPort + 1 ,
							password = randomstring = Math.random().toString(36).slice(-8),
							path = server.config.path;
						switch (match.game) {
							case 'cs16': {
								Servers[server.name].sshConnection.exec('cd ' + path + ' && cd ' + match.game + ' && screen -AdmS comeback.cw-' + match._id + ' ./hlds_run -game cstrike -port ' + port + ' +maxplayers ' + maxPlayers + ' +map ' + match.map + ' sv_password ' + password + ' -pingboost 3 -master -secure', function() {
									var rconConnection = new RCON(server.ip, port, server.password);
									rconConnection.query('cw_start ' + match.team1.name + ' ' + match.team2.name + ' ' + match._id);
								});
							}
							case 'csgo': {
								// Future...
							}
							case 'css': {
								// Future...
							}
						}
						Servers.update({name: name}, {$set: {lastUsedPort: port}}, function() {
							Matches.update(match._id, {$set: {'server.ip': server.ip, 'server.port': port, 'server.password': password}});
						});
					};
					Servers[name].reboot = function() {
						Servers[server.name].sshConnection.exec('reboot');
					};
				});
			}
		};
	}
});