export default Ember.ObjectController.extend({
		
	needs : ["login","data","application"],
	
	model : Ember.computed.alias("controllers.data.refset"),

});