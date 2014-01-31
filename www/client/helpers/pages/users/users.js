Template.users.usersOnlineCount = function() {
 	return Meteor.users.find({"profile.online": true}).count();
};
