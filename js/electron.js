/**

This script file contains general utility functions that may need to be available from any webView.

*/

function loadFile(filePath) {
	var fileReader = require('fs');
	
	return fileReader.readFileSync(filePath).toString();
}

// Used to load a 'View': a 'view' is a section of HTML that is then inserted into the
// content-view div of index.html. Its script tags are dynamically executed and inserted into
// index.html as well if they don't already exist.

//TODO: add ability to manually specify that a script tag should not be inserted into index.html
function loadWebView(webView) {
	// Set innerHTML for content-view
	document.getElementById("content-view").innerHTML = loadFile(webView);
	
	// Clear footer
	document.getElementById("document-footer").innerHTML = "";
	
	// Add new script tags in order to dynamically execute JS and import JS
	var scriptTags = document.getElementById("content-view").getElementsByTagName('script');
	
	for(var i = 0; i < scriptTags.length; i++) {
		var script = document.createElement('script');
		if(scriptTags[i].src != null)
			script.src = scriptTags[i].src;
		if(scriptTags[i].id != null)
			script.id = scriptTags[i].id;
		if(scriptTags[i].className != null)
			script.className = scriptTags[i].className;
		if(scriptTags[i].innerHTML != null) {
			script.innerHTML = scriptTags[i].innerHTML;
			eval(script.innerHTML);
		}
		
		scriptTags[i].parentNode.replaceChild(script, scriptTags[i]);
	}
}

function setCurrentNavPage(currentNavPageLinkId) {
	// Move span showing screen readers the selected tab
	var selectedSpan = document.getElementById('selected-nav-page');
	selectedSpan     = selectedSpan.parentNode.removeChild(selectedSpan);
	document.getElementById(currentNavPageLinkId).appendChild(selectedSpan);
	
	// Update the classes of the nav elements
	$(".nav").find(".active").removeClass("active");
	$(".nav").find("#" + currentNavPageLinkId).addClass("active");
}