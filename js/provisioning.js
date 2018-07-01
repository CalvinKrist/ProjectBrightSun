var provisioners = []

function Provisioner() {
	console.log("PROVISIONER CREATED");
}

Provisioner.prototype.testFunc = function() {
	console.log("provisioner's test");
};

function loadProvisioner(filename) {
	/*var script = document.createElement("script"); // Make a script DOM node
    script.src = filename; // Set it's src to the provided URL

    document.head.appendChild(script); // Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead) */
	
	var request = new XMLHttpRequest();
	request.open("GET", filename, false);
	var result = request.send();
}

//--browsers can load local JS, but not other files
//--have developers extend Provisioner or something . . . provisioner registers the JS file with some kind of list
//  so we always know what's happening with it

function loadProvisioners() {
	loadProvisioner("js/test/test.js");
}

function testProvisioners() {
	console.log("Creating Provisioner . . .");
	var provisioner = new Provisioner();
	
	console.log("Creating Teacher . . .");
	var teacher = new Teacher();
}