Template.index.events({
	'click #regButton': function(e) {
		e.stopPropagation();
		$('#dropdownProfile').dropdown('toggle');
	},
	'click a[href="#checkFromPage"]': function(e) {
		e.preventDefault();
	},
	'click a[href="#checkFromServer"]': function(e) {
		e.preventDefault();
	},
	'click #authButton': function(e) {
		e.stopPropagation();
		$('#dropdownProfile').dropdown('toggle');
	},
	'click a[href="#matchesInSearch"]': function(e) {
		e.preventDefault();
	},
	'click a[href="#matchesInGame"]': function(e) {
		e.preventDefault();
	},
	'click a[href="#matchesPlayed"]': function(e) {
		e.preventDefault();
	},
	'click a[href="#matchCreate"]': function(e) {
		e.preventDefault();
	},
	'click #createTeamButton': function(e) {
		regTeam();
	},
	'keypress #teamName': function(e) {
		if (e.which == 13) {
			e.preventDefault();
			regTeam();
		}
	},
	'click #matchStart': function(e) {
		var server;
		if ($("#selectServer").val() == "Новосибирск") {
			server = 'NSK';
		} else {
			server = 'MSK';
		}
		var map = $("#selectMap").val();
		var members = [];
		if ($("#selectPlayers").val()) {
			members.push($("#selectPlayers").val());
		}
		members.push(Meteor.user().profile.name);
		Meteor.call('startMatch', server, map, members, function(error, result) {
			if (error) {
				alert(error);
			}
			if (result) {
				Meteor.go("/matches/" + result);
			}
		});
	}
});