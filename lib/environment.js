Meteor.startup(function () {
	if(Meteor.isServer) {
		process.env.MAIL_URL = 'smtp://postmaster%40comeback.pro:5yqunm5ae6h5@smtp.mailgun.org:587/';
		Accounts.emailTemplates.siteName = "ComeBack.pro";
		Accounts.emailTemplates.from = "ComeBack.Support <support@comeback.pro>";
		Accounts.emailTemplates.enrollAccount.subject = function (user) {
			return "Добро пожаловать на ComeBack.pro, " + user.profile.name;
		};
		Accounts.emailTemplates.enrollAccount.text = function (user, url) {
			return "Спасибо за регистрацию!" + " Для активации Вашего аккаунта, перейдите по ссылке ниже: \n\n" + url;
		};
		
	}
});
