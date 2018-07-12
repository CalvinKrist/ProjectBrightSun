/**

This script file contains general utility functions that may need to be available from any webView.

*/

var settings = {
	BOX_CONFIG_URL: "https://api.github.com/repos/CalvinKrist/ProjectBrightSun/contents/box_configs"
};

function loadResource(resourcePath, 
					callbackFunction = function(){}, 
					errorHandlingFunction = function() {alert( "error: failed to load " + resourcePath);}, 
					alwaysFunction        = function(){}) {
	
	$.get(resourcePath, callbackFunction).fail(errorHandlingFunction).always(alwaysFunction);
}

// Used to load a 'View': a 'view' is a section of HTML that is then inserted into the
// content-view div of index.html.
function loadWebView(webView) {
	loadResource(webView, callbackFunction = function(webViewHTML) {
		setContent(webViewHTML);
	}, errorHandlingFunction = function(data) {
		setContent("<h1>404 File not Found: " + webView + "</h1>");
	});
}

// Used to set the content / current view of the application and dynamically 
// run any JavaScript the content contains
function setContent(webContent) {
	// Set innerHTML for content-view
	document.getElementById("content-view").innerHTML = webContent;
	
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