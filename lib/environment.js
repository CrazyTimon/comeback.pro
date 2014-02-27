Comeback = {
	version: '0.6.3',
	dateRelease: '26.02.2014',
	api: {},
	pro: true,
	sayVersion: function() {
		alert(this.version);
	}
};

if (Meteor.isServer) {
	Comeback.api.privateKey = process.env.APIKEY;
}