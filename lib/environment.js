Comeback = {
	version: '0.7',
	dateRelease: '06.03.2014',
	api: {},
	pro: true
};

if (Meteor.isServer) {
	Comeback.api.privateKey = process.env.APIKEY;
	Comeback.url = process.env.ROOT_URL;
	console.log(Comeback);
}