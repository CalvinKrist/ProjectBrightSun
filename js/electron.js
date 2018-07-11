// Used to load a 'View': a 'view' is a section of HTML that is then inserted into the
// content-view div of index.html. Its script tags are dynamically executed and inserted into
// index.html as well if they don't already exist.

//TODO: add ability to manually specify that a script tag should not be inserted into index.html
function loadWebView(webPage) {
	
	var fileReader = require('fs');
	fileReader.readFile(webPage, function (err, data) {
		if (err) {
			throw err; 
		}
		
		// Clear HTML from current view
		document.getElementById("content-view").innerHTML = "";
		
		// Get array of src and innerHTML attributes of current javascript tags. 
		// Array is taken instead of 'getElementByTagName' because that returns a list that dynamically updates as the parent does.
		var documentScriptTags  = document.body.getElementsByTagName('script');
		var srcAttributes       = [];
		var innerHTMLAttributes = [];
		for(var k = 0; k < documentScriptTags.length; k++) {
			srcAttributes.push(documentScriptTags[k].src);
			innerHTMLAttributes.push(documentScriptTags[k].innerHTML)
		}
		
		// Set content-view to the real value and extract script tags
		document.getElementById("content-view").innerHTML = data.toString();
		var scriptTags = document.getElementById("content-view").getElementsByTagName('script');
		
		// Add script tags that don't already exist to the document
		for (var i = 0; i < scriptTags.length; i++) {
			
			var alreadyExists = false;
			for(var k = 0; k < srcAttributes.length; k++)
				if(srcAttributes[k] == scriptTags[i].src && innerHTMLAttributes[k] == scriptTags[i].innerHTML) 
					alreadyExists = true;
				
			// Create script element and append to document
			if(!alreadyExists) {
				var script = document.createElement('script');
				if(scriptTags[i].src != null)
					script.src = scriptTags[i].src;
				if(scriptTags[i].innerHTML != null) {
					script.innerHTML = scriptTags[i].innerHTML;
					eval(scriptTags[i].innerHTML);
				}
				
				document.body.appendChild( script );
			}
		}
	});
}