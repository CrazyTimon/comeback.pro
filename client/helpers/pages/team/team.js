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

Handlebars.registerHelper('team', function(username) {
	if (username) {
		return Teams.findOne({'members.username': username});
	} else {
		return Teams.findOne({'members.username': Meteor.user().profile.name});
	}
});

Handlebars.registerHelper('isMyTeam', function() {
	return Teams.findOne({"members.username": Meteor.user().profile.name, name: Session.get("currentShowTeam")});
});

Template.team.events({
	'click #joinTeam': function(e) {
		if (!(Teams.findOne({'members.username': Meteor.user().profile.name}))) {
			Meteor.call('joinToTeam', Session.get("currentShowTeam"), function(error, result) {
				if (error) {
					alert(error);
				}
				if (result) {
					alert(result);
				}
			});
		} else {
			alert("Вы уже в команде");
		}
	},
	'click #leaveFromTeam': function(e) {
		var teamName = Teams.findOne({"members.username": Meteor.user().profile.name}).name;
		Meteor.call('leaveFromTeam', teamName, function(error, result) {
			if (error) {
				alert(error);
			}
		});
	},
	'click .acceptRequestUser': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			Meteor.call('acceptFromTeam', Meteor.users.findOne({_id: target.getAttribute("data-id")}).profile.name, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	},
	'click .declineRequestUser': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			Meteor.call('declineFromTeam', Meteor.users.findOne({_id: target.getAttribute("data-id")}).profile.name, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	},
	'click .kickUserFromTeam': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if (confirm("Вы действительно хотите удалить данного пользователя из команды?")) {
			if(target.hasAttribute("data-id")) {
				Meteor.call('kickFromTeam', Meteor.users.findOne({_id: target.getAttribute("data-id")}).profile.name, function(error, result) {
					if(error) {
						alert(error);
					}
				});
			}
		}
	},
	'click .makeCaptain': function(e) {
		var target = e.currentTarget;
		if(!target) return;
		if (confirm("Вы действительно хотите назначить данного пользователя капитаном?")) {
			Meteor.call('makeCaptain', Meteor.users.findOne({_id: target.getAttribute("data-id")}).profile.name, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	}
});

Template.team.isCaptain = function() {
	var teamName = Session.get('currentShowTeam');
	Teams.findOne({name: teamName, captain: Meteor.user().profile.name}) ? true : false;
};