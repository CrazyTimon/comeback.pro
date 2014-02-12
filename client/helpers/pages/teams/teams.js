Template.teams.events({
	'click #createTeamButton': function(e) {
		regTeam();
	},
	'keypress #teamName': function(e) {
		if (e.which == 13) {
			e.preventDefault();
			regTeam();
		}
	}
});