var Connection = Meteor.require('ssh2');
var Rcon = Meteor.require('rcon');

startServer = function(matchId, server, map, type, team, team2) {
	var c = new Connection();
	var server = Servers.findOne({name: server});
	var maxplayers = (type[0] * 2) + 1;
	c.on('ready', function() {
	    c.exec('cd /home/comeback/hlds/servers/cw && screen -AdmS cw-'+matchId+' ./hlds_run -game cstrike +maxplayers '+maxplayers+' +map '+map+' +rcon_password 64276472 -secure -master -pingboost 3', function(err, stream) {
			if (err) throw err;
	    	stream.on('exit', function(code, signal) {
	    		startCW(server.ip, team, team2);
	    		c.end();
	    	});
	    });
	});
	c.connect({
		host: server.ip,
		port: 22,
		username: server.login,
		password: server.password
	});
};

startCW = function(server, team, team2) {
	var conn = new Rcon(server, 27015, "64276427", { tcp: false});
		conn.on('auth', function() {
			conn.send("cw_start "+team+' '+team2);
		}).on('response', function() {
			conn.disconnect();
		});
		conn.connect();
};