Template.admin.events({
	'click #btn-add-server': function () {
		Meteor.call('addServer', 
			$('#input-server-name').val(), 
			$('#input-server-ip').val(), 
			$('#input-server-login').val(), 
			$('#input-server-password').val(), 
			$('#input-server-path').val(), 
			$('#input-server-country').val(), 
			$('#input-server-city').val(), 
			function(error, result) {
				if (error) {
					alert (error);
				} else {
					$('#input-server-name').val('');
					$('#input-server-ip').val(''); 
					$('#input-server-login').val('');
					$('#input-server-password').val('');
					$('#input-server-path').val('');
					$('#input-server-country').val('');
					$('#input-server-city').val('');
				}
			}
		);
	}
});