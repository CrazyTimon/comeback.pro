Template._loginButtonsLoggedInDropdown.firstname = function() {
	return Meteor.user().profile.firstname;
};
Template._loginButtonsLoggedInDropdown.lastname = function() {
	return Meteor.user().profile.lastname;
};
Template._loginButtonsLoggedInDropdown.team = function() {
	return Meteor.user().profile.team;
};
Template._loginButtonsLoggedInDropdown.skill = function() {
	return Meteor.user().profile.skill;
};
Template._loginButtonsLoggedInDropdown.image = function() {
	return Meteor.user().profile.image;
};