Template.match.events({
	'click #abortMatch': function () {
		if (confirm("Вы действительно хотите отменить текущий матч?")) {
			Meteor.call('abortMatch', function(error, result) {
				if (error) alert(error);
			});
		}
	},
	'click .goCW': function (e) {
		e.preventDefault();
		var target = e.currentTarget;
		if(!target) return;
		if(target.hasAttribute("data-id")) {
			Meteor.call('goCW', target.getAttribute("data-id"),function(error, result) {
				if (error) alert(error);
			});
		}
	}
});