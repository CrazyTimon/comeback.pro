Meteor.methods({
	'connectServer': function(ip) {
		Servers.start('123', 'NSK', 'de_inferno', '2x2', 'f.mix', 'NaVi');
	}
});