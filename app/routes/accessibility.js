export default Ember.Route.extend({
   model: function() {
	   return $.get("assets/static-content/accessibility.html");
   }
 });