function build_boxes() {
	if(window.boxes.length === 0) {
		alert("Please add a new machine first!");
		return;
	}
	
	//Create necessary objects
	var boxes = window.boxes;
	var zip = new JSZip();
	var packers = []; //maps each packer object to user defined differences. See 'getPackerDiffs' for more
	var differences = ['vm_name', 'memory', 'cpus', 'output_dir']; //defines allowed differences between 'same' packer files
	
	//Create packer objects and map to user defined machines
	for(var i = 0; i < boxes.length; i++) {
		var box_json = getPackerBox(boxes, i);
		packers = getPackerDiffs(packers, box_json, differences);
	}
	
	//Add each packer config to zip
	for(var i = 0; i < packers.length; i++)
		zip.add(packers[i][0]['variables']['vm_name'] + ".json", JSON.stringify(packers[i][0], null, 2));
	
	//Add Vagranfile to zip
	var vagrantfile = generateVagrantfile(packers, differences);
	zip.add("Vagrantfile", vagrantfile);

	//GENERATE THE BUILD SCRIPT
	var build_script = "";
	
	for(var i = 0; i < packers.length; i++) {
		build_script += "packer build " + packers[i][0]['variables']['vm_name'] + ".json\n"; //&
	}
	//build_script += "wait";
	build_script += "vagrant up";
	
	zip.add("build.ps1", build_script);
	zip.add("build.sh", build_script);
	
	
	//GENERATE THE ZIP FILE AND START DOWNLOAD
	content = zip.generate();
	download("data:application/zip;base64," + content, "boxes.zip", "application/zip");
}

/**
A function used to map each variation of a packer object that needs to be created by the Vagrantfile. 
@param packs the map of each packer object to its variations. A list of lists, where the first entry of each list is a packer object and each subsequent entry is a user defined variation
@param box the packer box being analyzed for differences
@param the valid differences between packer boxes. referes to variables in the 'variables' section. valid differences should be definable in Vagrant.

@return the modified 'packs' object
*/
function getPackerDiffs(packs, box, differences) {
	//make params a deep copy of differences
	var params = [];
	for(var i = 0; i < differences.length; i++)
			params.push(differences[i]);
	
	//iterate through each packer machine already defined
	for(var i = 0; i < packs.length; i++) {
		base_box = packs[i][0];
		
		//only continue of same OS
		if(base_box['variables']['iso_url'] == box['variables']['iso_url']) {
			//get a list of different variables
			var diffs = [];
			for(var key in base_box['variables']) {
				if(base_box['variables'][key] != box['variables'][key]) 
					diffs.push(key);
			}
			console.log(diffs);
			//do differences match valid differences? is a 'same' packer config
			var valid = true;
			for(var k = 0; k < diffs.length; k++) 
				if(!differences.includes(diffs[k])) 
					valid = false;
			if(valid) {
				for(var k = 0; k < params.length; k++)
					params[k] = box['variables'][params[k]];
				packs[i].push(params);
				return packs;
			}
		}
		
	}

	//differences between other packer configs were not valid. warrants unique entry in packs
	packs.push([]);
	packs[packs.length - 1].push(box);
	for(var k = 0; k < params.length; k++)
		params[k] = box['variables'][params[k]];
	packs[packs.length - 1].push(params);
	return packs;
}

function generateVagrantfile(packs, differences) {
	var vagrantfile = "Vagrant.configure(\"2\") do |config|\n";
	for(var i = 0; i < packs.length; i++) {
		var box_json = packs[i][0];
		for(var k = 1; k < packs[i].length; k++) {
			//Generate Vagrantfile using box JSON
			var name = "mach" + i + k;
			if(box_json['variables']['platform'] === "linux") {
				vagrantfile += "\tconfig.vm.define \"" + name + "\" do |" + name + "|\n";
				vagrantfile += "\t\t" + name + ".vm.box = \"" + box_json['variables']['output_dir'] +"\"\n";
				vagrantfile += "\t\t" + name + ".vm.define \"" + packs[i][k][differences.indexOf('vm_name')] + "\"\n";
				vagrantfile += "\t\t" + name + ".vm.provider :virtualbox do |vb|\n";
				vagrantfile += "\t\t\tvb.name = \"" + packs[i][k][differences.indexOf('vm_name')] + "\"\n";
				vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--memory\", " + packs[i][k][differences.indexOf('memory')] + "]\n";
				vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--cpus\", " + packs[i][k][differences.indexOf('cpus')] + "]\n";
				vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--vram\", \"" + box_json['variables']['vram'] + "\"]\n";
				vagrantfile += "\t\tend\n";
			} else if(box_json['variables']['platform'] === "windows") {
				vagrantfile += "\tconfig.vm.define \"" + name + "\" do |" + name + "|\n";
				vagrantfile += "\t\t" + name + ".vm.box = \"" + box_json['variables']['output_dir'] +"\"\n";
				vagrantfile += "\t\t" + name + ".vm.provider :virtualbox do |vb|\n";
				vagrantfile += "\t\t\tvb.name = \"" + packs[i][k][differences.indexOf('vm_name')] + "\"\n";
				vagrantfile += "\t\t\tvb.gui = true\n";
				vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--memory\", " + packs[i][k][differences.indexOf('memory')] + "]\n";
				vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--cpus\", " + packs[i][k][differences.indexOf('cpus')] + "]\n";
				vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--vram\", \"32\"]\n";
				vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--clipboard\", \"bidirectional\"]\n";
				vagrantfile += "\t\t\tvb.customize [\"setextradata\", \"global\", \"GUI/SuppressMessages\", \"all\"]\n";
				vagrantfile += "\t\tend\n";
				vagrantfile += "\t\t\n";
				vagrantfile += "\t\t" + name + ".winrm.transport = :plaintext\n";
				vagrantfile += "\t\t" + name + ".winrm.basic_auth_only = true\n";
				vagrantfile += "\t\t" + name + ".vm.communicator = \"winrm\"\n";
			}
			vagrantfile += "\tend\n";
		}
	}
	vagrantfile += "end\n";
	return vagrantfile;
}

/**
Given an instance from the user defined boxes array, returns the corresponding packer object. includes modifications to variables defined by user.
@param boxes the user definend boxes array
@param indx the index within the array
@pre the vagrant post-processor is in the 0th index of post-processors
*/
function getPackerBox(boxes, indx) {
	var box_json = jQuery.extend(true, {}, window[boxes[indx]['os_version']]);	
	box_json['variables']['vm_name'] = boxes[indx]['name'];
	box_json['variables']['output_dir'] = "../Boxes/" + boxes[indx]['platform'] + "/" + boxes[indx]['name'] + ".box";
	box_json['post-processors'][0]['output'] = "../Boxes/" + boxes[indx]['platform'] + "/" + boxes[indx]['name'] + ".box";
	return box_json;
}