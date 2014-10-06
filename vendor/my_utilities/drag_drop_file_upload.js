function readSingleFile(evt)
{
	evt.stopPropagation();
	evt.preventDefault();

	if (typeof evt.dataTransfer === "undefined")
		var f = evt.target.files[0];
	else	
		var f = evt.dataTransfer.files[0];

	if (f) 
	{
		var r = new FileReader();
		
		r.onload = function(e) 
		{ 
			var contents = e.target.result;

			var controller = Refset.__container__.lookup("controller:refsets.upload");
			controller.send('importFlatFile',contents);
		}
		
		r.readAsText(f);
	} 
	else 
	{ 
		alert("Failed to load file");
	}
}

function handleDragOver(evt) 
{
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
}

function handleDragEnter(evt) 
{
	this.classList.add('over');
}

function handleDragLeave(evt) 
{
	try {
	    if(evt.relatedTarget == 3) return;
	} catch(err) {}
	
	if (typeof evt.relatedTarget.id === "undefined" && evt.target.id === "fileUploadDropZone") return;
	if (typeof evt.target.id === "undefined" && evt.relatedTarget.id === "fileUploadDropZone") return;
	
	this.classList.remove('over');
}