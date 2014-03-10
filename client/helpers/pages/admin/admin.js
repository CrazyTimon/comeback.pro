Template.admin.events({
	'click #btn-add-server': function () {
		$('#btn-add-server').button('loading');
		Meteor.call('addServer', 
			$('#input-server-name').val(), 
			$('#input-server-ip').val(), 
			$('#input-server-login').val(), 
			$('#input-server-password').val(), 
			$('#input-server-path').val(), 
			$('#input-server-country').val(), 
			$('#input-server-city').val(), 
			function(error, result) {
				$('#btn-add-server').button('reset');
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
	},

	'click #btn-remove-server': function(e) {
		var target = e.currentTarget;
		if (!target) return;
		Meteor.call('removeServer', target.getAttribute('data-id'), function(error) {
			if (error) alert (error);
		});
	},

	'click #btn-reboot-server': function(e) {
		var target = e.currentTarget;
		if (!target) return;
		Meteor.call('rebootServer', target.getAttribute('data-id'), function(error) {
			if (error) alert (error);
		});
	}
});