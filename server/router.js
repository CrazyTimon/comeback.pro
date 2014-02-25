Router.map(function () {
	this.route('writeInfo', {
		where: 'server',
		path: '/writeInfo/',
		action: function () {
			console.log('Что-то пришло');
			this.response.writeHead(200, {'Content-Type': 'text/html'});
			this.response.end('hello from server');
		}
	});
});