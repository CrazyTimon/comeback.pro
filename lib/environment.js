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
	Comeback.api.privateKey = '3F9E8D7BDBDB32A1909A74C983AFD11C';
}