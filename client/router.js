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
			if (Meteor.user()) {
				return [
					Meteor.subscribe('users'),
					Meteor.subscribe('teams'),
					Meteor.subscribe('matches')
				]
			}
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