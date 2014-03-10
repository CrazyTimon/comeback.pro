Router.map(function () {
	this.route('serverSendInfo', {
		where: 'server',
		path: '/server/:key/sendInfo/:typeRequest/:request/',
		action: function () {
			if (!this.params.key || (this.params.key !== Comeback.api.privateKey)) this.response.writeHead(403);
			var Request = JSON.parse(this.params.request.replace(/'/g,'"'));
			console.log(Request);
			switch (this.params.typeRequest) {
				case 'score':
					Matches.update(Request.matchId, { $set: {
							'team1.score': Request.score1,
							'team2.score': Request.score2
						}
					});
					break;
				case 'event':
					switch (Request.eventName) {
						case 'serverOn':
							Matches.update(Request.matchId, { 
								$set: {
									'gamestatus': 'warmup'
								}
							});
							break;
						case 'serverOff':
							Matches.remove(Request.matchId);
							break;
						case 'knifeStarted':
							Matches.update(Request.matchId, { 
								$set: {
									'gamestatus': 'knife'
								}
							});
							break;
						case 'half1Started':
							Matches.update(Request.matchId, { 
								$set: {
									'gamestatus': 'half1'
								}
							});
							break;
						case 'half2Started':
							Matches.update(Request.matchId, { 
								$set: {
									'gamestatus': 'half2'
								}
							});
							break;
						case 'overtimeStarted':
							Matches.update(Request.matchId, { 
								$set: {
									'gamestatus': 'overtime'
								}
							});
							break;
						case 'gameEnd': {
							Matches.update(Request.matchId, {
								$set: {
									'status': 'finished'
								}
							});
						}
					}
					break;
			}
		}
	});
});
