Comeback = {
	version: '0.7-rc1',
	dateRelease: '05.03.2014',
	api: {},
	pro: true,
	sayVersion: function() {
		alert(this.version);
	}
};

if (Meteor.isServer) {
	Comeback.api.privateKey = process.env.APIKEY;
}