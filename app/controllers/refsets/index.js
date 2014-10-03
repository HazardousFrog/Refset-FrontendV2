export default Ember.ObjectController.extend({
		
	needs 			: ["data","login"],

	published 		: Ember.computed.alias("controllers.data.publishedRefsets"),
	unpublished 	: Ember.computed.alias("controllers.data.unpublishedRefsets"),
	user 			: Ember.computed.alias("controllers.login.user"),
	
	initModel : function()
	{
		Ember.Logger.log("controllers.refsets.index:initModel");
		
		var _this 			= this;
		var dataController 	= this.get('controllers.data');
		
		// Run next so that we do not prevent the UI being displayed if the data is delayed...
		return Ember.run.next(function(){dataController.getAllRefsets(_this,'getAllRefsetsComplete');});
	},
	
	actions :
	{
		refresh : function()
		{
			Ember.Logger.log("controllers.refsets.index:actions:refresh");
			var dataController = this.get('controllers.data');
			dataController.getAllRefsets();
		},

		getAllRefsetsComplete : function(response)
		{
			Ember.Logger.log("controllers.refsets.index:actions:getAllRefsetsComplete (response)",response);

		},	
	}
	
});
