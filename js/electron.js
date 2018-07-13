/**

This script file contains general utility functions that may need to be available from any webView.

*/

////////////////////////////////
//       BOOT Operations      //
////////////////////////////////

const ipc = require('electron').ipcRenderer
ipc.send('test', 'from client to main');
ipc.on('test', function(event, arg) {
	console.log(arg);
});

var settings = {
	BOX_CONFIGS_URL: "https://api.github.com/repos/CalvinKrist/ProjectBrightSun/contents/box_configs",
	BOX_CONFIGS_LOCATION: "box_configs"
};

downloadGitHubNode(settings.BOX_CONFIGS_URL, settings.BOX_CONFIGS_LOCATION);

////////////////////////////////
//       Global Functions     //
////////////////////////////////

// Used to download a 'GitHubNode', which is either a file or a directory, to disk.
// @param 'nodeURL': the GitHub API url of the object being downloaded
// @param 'downloadLocation': the relative location to where the obejct will be downloaded
// If the file already exists at the location, it will be overwritten. Files will not be deleted.
function downloadGitHubNode(nodeURL, downloadLocation) {
	var fs = require('fs');
	if(!fs.existsSync(downloadLocation))
					fs.mkdirSync(downloadLocation);
	
	loadResource(nodeURL, callbackFunction = function(nodeData) {
		for(var i = 0; i < nodeData.length; i++) {
			if(nodeData[i].type === "dir") {
				var dirLocation = downloadLocation + "/" + nodeData[i].name;
				if(!fs.existsSync(dirLocation))
					fs.mkdirSync(dirLocation);

				downloadGitHubNode(nodeData[i].url, dirLocation);
			}
			else if(nodeData[i].type == "file") {
				var name = nodeData[i].name;
				
				loadResourceSync(nodeData[i].download_url, callbackFunction = function(fileData) {
					fs.writeFileSync(downloadLocation + "/" + nodeData[i].name, fileData);
				});
			}
		}
	});
}

function loadResourceSync(resourcePath, callbackFunction) {
	jQuery.ajax({
		url: resourcePath,
		success: callbackFunction,
		async: false
	});
}

function loadResource(resourcePath, 
					callbackFunction, 
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