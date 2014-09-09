import Login from '../models/login';
import User	from '../models/user';

export default Ember.ObjectController.extend({

	loginInProgress 	: false,
	loginError			: null,
	username 			: 'ianbale',
	password			: 'Lotusm250',
	user 				: User.create(),
	
	needs 				: ["refsets"],
	
	loginButtons:
	[
   	    Ember.Object.create({title: 'Cancel', clicked: 'closeLoginModal'}),
   		Ember.Object.create({title: 'Login', clicked:'loginUser'})
   	],

   	registrationButtons: 
   	[
   		Ember.Object.create({title: 'Cancel', clicked: 'closeRegistrationModal'}),
   		Ember.Object.create({title: 'Register', clicked:'registerUser'})
   	],

	showLoginForm: function() 
	{
		return Bootstrap.ModalManager.open('loginModal', '<img src="assets/img/login.png"> Snomed CT Login', 'login', this.loginButtons, this);
	},
	
	loginUser: function()
	{
		var _this = this;

		_this.set("loginInProgress",1);
		_this.set('loginError', null);
		
		Login.authenticate(this.username,this.password).then(function(authResult)
		{
			var loggedInUser = User.create({
				username: authResult.user.name,
				firstName: authResult.user.givenName,
				lastName: authResult.user.surname,
				token: authResult.user.token,
				permissionGroups: Ember.A(),
				loggedIn : true
			});

			Login.isPermittedToUseRefset(loggedInUser.username).then(function(isAllowedAccessToRefset)
			{
				_this.set('loginInProgress', 0);

				switch(isAllowedAccessToRefset)
				{
					case 1:
					{
						_this.set('globals.user',loggedInUser);
						_this.send('closeLoginModal');
						
						_this.set("user",loggedInUser);

						var controller = _this.get('controllers.refsets');
						controller.getAllRefsets(1);

						break;
					}
					
					case 0:
					{
						_this.set('loginError', "You do not have access to this application");
						break;
					}
					
					default:
					{
						_this.set('loginError', "Unable to check application access: " + isAllowedAccessToRefset);
						break;
					}
				}
					
			},

			function(error)
			{
				_this.set('loginInProgress', 0);
				_this.set('loginError', "Unable to check application access: " + error.errorMessage);
			});
			
			/*					
			var permissionGroups = Login.getPermissionGroups(user.get('username')).then(function(permResult)
			{
				Ember.Logger.log('success roles:' + permResult);

			for (var i = 0; i < success.perms.length; i++)
				{
					User.get('permissionGroups').pushObject(
						PermissionGroup.create({
							app:     success.perms[i].app,
							role:    success.perms[i].role,
							country: success.perms[i].member
						})
					);
				}
			},


			
			function(error)
			{
				Ember.Logger.log('permissionGroups error:' + error);
				
				_this.set('loginInProgress', 0);
				_this.set('loginError', "Unable to load permissions: " + error.errorMessage);
			});
*/			
		},
		
		function(error)
		{
			Ember.Logger.log('error',error);
			
			_this.set('loginInProgress', 0);
			_this.set('loginError', "Username and password not recognised");
		});
	},

	showRegistrationForm: function() 
	{
		return Bootstrap.ModalManager.open('registrationModal', '<img src="assets/img/login.png">  Snomed CT Registration', 'registration', this.registrationButtons, this);
	},

	registerUser: function()
	{
		var regBody = "Name : " + this.regname + "%0A%0A";
		regBody += "Phone : " + this.regphone + "%0A%0A";
		regBody += "IHTSDO Login : " + this.reguser + "%0A%0A";
		regBody += "Nationality : " + this.regnationality + "%0A%0A";
		regBody += this.regnotes;
		
		window.location.href = 'mailto:' + SnomedENV.APP.RegistrationEmail + '?subject=Request for access to Snomed CT&body=' + regBody;
		this.send('closeRegistrationModal');
	},
	
	closeLoginModal: function()
	{
		return Bootstrap.ModalManager.close('loginModal');
	},

	closeRegistrationModal: function()
	{
		return Bootstrap.ModalManager.close('registrationModal');
	},
	
	logout : function()
	{
		this.set('globals.user',User.create());
		var controller = this.get('controllers.refsets');
		
		controller.getAllRefsets(1);
	}
});