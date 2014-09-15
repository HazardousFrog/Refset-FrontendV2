import RefsetModel 		from '../../models/refset';
import RefsetsAdapter 	from '../../adapters/refsets';

var refsetsAdapter 		= RefsetsAdapter.create();

export default Ember.ObjectController.extend({
		
	needs : ["login","utilities","refsets","refsets/upload"],

	model 	: RefsetModel.create(),
	
	doImportPublishedRefset : false,
	doImportMembers : false,
	getConceptDataInProgress : Ember.computed.alias("controllers.refsets/upload.getConceptDataInProgress"),
	
	create : function()
	{
		// Need to serialise the form into the model

		var URLSerialisedData 	= $('#newRefsetForm').serialize();

		var MemberData = []
		$("#importedMemberForm input[type=checkbox]:checked").each(function ()
		{
			MemberData.push(parseInt($(this).val()));
		});
		
		var utilitiesController = this.get('controllers.utilities');		
		var refsetData = utilitiesController.deserialiseURLString(URLSerialisedData);
		
		refsetData.active = (typeof refsetData.active !== "undefined" && refsetData.active === "1") ? true : false;

		delete refsetData["import"];
		delete refsetData["import-members"];
		
		this.set("model",refsetData);	
		
		var loginController = this.get('controllers.login');
		var user = loginController.user;

		refsetsAdapter.create(user,this.model).then(function(refset)
		{
			if (refset.meta.status === "CREATED")
			{
				Ember.Logger.log("Refset created:",refset.content.id);
				
				var refsetId = refset.content.id;
				
				MemberData.map(function(member)
				{
					Ember.Logger.log("Adding member",member);
					refsetsAdapter.addMember(user,refsetId,member);
				});
			}
			else
			{
				Ember.Logger.log("Refset create failed:",refset.meta.message);				
			}	
		});
	},

    actions :
    {
    	togglePublishedRefsetImportForm : function()
    	{
    		Ember.Logger.log("togglePublishedRefsetImportForm",this.doImportPublishedRefset);
    		this.set("doImportPublishedRefset",!this.doImportPublishedRefset);
    	},

		toggleMembersImportForm : function()
		{
			Ember.Logger.log("togglePublishedRefsetImportForm",this.doImportPublishedRefset);
			this.set("doImportMembers",!this.doImportMembers);
			
			if (this.doImportMembers)
			{
				Ember.run.next(this,function()
				{
					Ember.Logger.log("controllers.refsets.new:actions:toggleMembersImportForm (Setting event listeners)");
					
					document.getElementById('refsetUploadFileInput').addEventListener('change', readSingleFile, false);
					document.getElementById('fileUploadDropZone').addEventListener('dragover', handleDragOver, false);
					document.getElementById('fileUploadDropZone').addEventListener('drop', readSingleFile, false);
				});
			}
			else
			{
				Ember.Logger.log("controllers.refsets.new:actions:toggleMembersImportForm (Clearing members)");

				var uploadController = this.get('controllers.refsets/upload');
				uploadController.clearMemberList();
			}
		},

    }
});
