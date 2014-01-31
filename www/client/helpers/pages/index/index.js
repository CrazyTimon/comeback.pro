regTeam = function() {
	if (!(Meteor.user().profile.team)) {
		var teamName = $("#teamName").val();
		if (teamName) {
			if (!(Teams.findOne({name: teamName}))) {
				
				Meteor.call('createTeam', teamName, Meteor.users.findOne()._id, function(error, result) {
					if (error) {
						alert(error);
					} else {
						$('#regTeamModal').modal('hide');
						Router.go('/teams/' + teamName);
					}
				});
			} else {
				alert("Такая команда уже существует");
			}
		} else {
			alert("Заполните поле");
		}
	} else {
		alert("Вы уже в команде");
	}
};

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
		var members = $("#selectPlayers").val();
		members.push(Meteor.user().username);
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