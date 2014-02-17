Handlebars.registerHelper('isMyFriend', function(username) {
	if (Meteor.users.findOne({_id: Meteor.userId(), "profile.friends": {username: username, accepted: true}}) && Meteor.users.findOne({'profile.name': username, "profile.friends": {username: Meteor.user().profile.name, accepted: true}})) return true;
});

Handlebars.registerHelper('isRequesterFriend', function(username) {
	if (Meteor.users.findOne({'profile.name': username, "profile.friends": {username: Meteor.user().profile.name, accepted: true}}) && Meteor.users.findOne({'profile.username': Meteor.user().profile.name, "profile.friends": {username: username, accepted: false}})) return true;
});

Handlebars.registerHelper('isAccepterFriend', function(username) {
	if (Meteor.users.findOne({'profile.name': username, "profile.friends": {username: Meteor.user().profile.name, accepted: false}}) && Meteor.users.findOne({'profile.name': Meteor.user().profile.name, "profile.friends": {username: username, accepted: true}})) return true;
});


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

Handlebars.registerHelper('myMatchStatus', function() {
	if (Matches.findOne({members: Meteor.user().profile.name})) {
		var status = Matches.findOne({members: Meteor.user().profile.name}).status;
		if (status) {
			if (status == "inGame") {
				return "inGame";
			}
			if (status == "inSearch") {
				return "inSearch";
			}
			if (status == "finished") {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Handlebars.registerHelper('myMatchId', function() {
	if (Matches.findOne({members: Meteor.user().profile.name})) {
		var id = Matches.findOne({members: Meteor.user().profile.name})._id;
		if (id) {
			return id;
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Handlebars.registerHelper('matchStatus', function(username) {
	if (Matches.findOne({members: username})) {
		var status = Matches.findOne({members: username}).status;
		if (status) {
			if (status == "inGame") {
				return "inGame";
			}
			if (status == "inSearch") {
				return "inSearch";
			}
			if (status == "finished") {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Handlebars.registerHelper('matchStatusInSearch', function(username) {
	if (Matches.findOne({members: username})) {
		var status = Matches.findOne({members: username}).status;
		if (status) {
			if (status == "inSearch") {
				return "inSearch";
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Handlebars.registerHelper('matchStatusInGame', function(username) {
	if (Matches.findOne({members: username})) {
		var status = Matches.findOne({members: username}).status;
		if (status) {
			if (status == "inSearch") {
				return "inGame";
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Handlebars.registerHelper('matchId', function(username) {
	if (Matches.findOne({members: username})) {
		var id = Matches.findOne({members: username})._id;
		if (id) {
			return id;
		} else {
			return false;
		}
	} else {
		return false;
	}
});

Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading'
});

Router.map(function() {

	this.route('index', {
		path: '/',
		template: 'index',
		waitOn: function() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('teams'),
				Meteor.subscribe('matches')
			]
		},
		data: {
			Teams: function() {
				return Teams.find();
			},
			matchesInSearch: function() {
				return Matches.find({status: 'inSearch'});
			},
			matchesInGame: function() {
				return Matches.find({status: 'inGame'});
			},
			matchesPlayed: function() {
				return Matches.find({status: 'finished'});
			}
		}
	});

	this.route('news', {
		path: '/news',
		template: 'news',
		waitOn: function() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('teams'),
				Meteor.subscribe('matches'),
				Meteor.subscribe('news')
			]
		},
		data: {
			news: function() {
				return News.find({}, {sort: {date: -1}});
			}
		}
	});
	
	this.route('users', {
		path: '/users',
		template: 'users',
		waitOn: function() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('teams'),
				Meteor.subscribe('matches')
			]
		},
		data: {
			users: function() {
				return Meteor.users.find();
			}
		}
	});

	this.route('user', {
		path: '/users/:username',
		template: 'user',
		waitOn: function() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('teams'),
				Meteor.subscribe('matches')
			]
		},
		data: function() {
			return Meteor.users.findOne({'profile.name': this.params.username})
		}
	});

	this.route('teams', {
		path: '/teams',
		template: 'teams',
		waitOn: function() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('teams'),
				Meteor.subscribe('matches')
			]
		},
		data: {
			teams: function() {
				return Teams.find();
			}
		}
	});

	this.route('team', {
		path: '/teams/:name',
		template: 'team',
		waitOn: function() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('teams'),
				Meteor.subscribe('matches')
			]
		},
		data: function() {
			return Teams.findOne({name: this.params.name});
		}
	});

	this.route('matches',{
		path: '/matches/:id',
		template: 'match',
		waitOn: function() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('teams'),
				Meteor.subscribe('matches')
			]
		},
		data: function() {
			return Matches.findOne({_id: this.params.id});
		}
	});

	this.route('about', {
		path: '/about',
		template: 'about'
	});

	this.route('contacts', {
		path: '/contacts',
		template: 'contacts'
	});

	this.route('notFound', { 
		path: '*',
		template: 'notFound'
	});
});