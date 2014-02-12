/*var passport = Meteor.require("passport");
var SteamStrategy = Meteor.require("passport-steam");
passport.use(new SteamStrategy({
    returnURL: 'http://comeback.pro/authSteam',
    realm: 'http://comeback.pro/'
  },
  function(identifier, done) {
    User.findByOpenID({ openId: identifier }, function (err, user) {
      return done(err, user);
    });
  }
));

Router.map(function () {
  this.route('authSteam', {
	where: 'server',
    action: function () {
		this.response.writeHead(200, {'Content-Type': 'text/html'});
		this.response.end('hello from server');
		passport.authenticate('steam');
    }
  });
});
*/