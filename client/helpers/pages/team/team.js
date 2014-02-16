Template.team.events({
	'click #joinTeam': function(e) {
		if (!(Meteor.user().profile.team)) {
			Meteor.call('joinToTeam', Session.get("currentShowTeam"), function(error, result) {
				if (error) {
					alert(error);
				}
				if (result) {
					alert("Заявка отправлена капитану, ожидайте.");
				}
			});
		} else {
			alert("Вы уже в команде");
		}
	},
	'click #leaveFromTeam': function(e) {
		var teamName = Teams.findOne({"members.username": Meteor.user().username}).name;
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
			Meteor.call('acceptFromTeam', Meteor.users.findOne({_id: target.getAttribute("data-id")}).username, function(error, result) {
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
			Meteor.call('declineFromTeam', Meteor.users.findOne({_id: target.getAttribute("data-id")}).username, function(error, result) {
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
				Meteor.call('kickFromTeam', Meteor.users.findOne({_id: target.getAttribute("data-id")}).username, function(error, result) {
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
			Meteor.call('makeCaptain', Meteor.users.findOne({_id: target.getAttribute("data-id")}).username, function(error, result) {
				if(error) {
					alert(error);
				}
			});
		}
	}
});

Template.team.isCaptain = function() {
	var teamName = Session.get('currentShowTeam');
	if (Teams.findOne({name: teamName, captain: Meteor.user().username})) {
		return true;
	} else {
		return false;
	}
};