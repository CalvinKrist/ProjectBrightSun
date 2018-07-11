console.log("yooo");
function build_boxes() {
	if(window.boxes.length === 0) {
		alert("Please add a machine first!");
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

	//GENERATE THE BUILD SCRIPTS
	var win_build_script = "";
	var nix_build_script = "";
	var win_dependencies = "ZnVuY3Rpb24gSW5zdGFsbC1EZXBlbmRlbmNpZXMgewoJIyBNYWtlIHN1cmUgdGhhdCBJbnZva2UtV2ViUmVxdWVzdCB1c2VzIHJpZ2h0IFRMUyB2ZXJzaW9uCglbTmV0LlNlcnZpY2VQb2ludE1hbmFnZXJdOjpTZWN1cml0eVByb3RvY29sID0gInRsczEyLCB0bHMxMSwgdGxzIgoKCSMgU2V0IHVwIGJ1aWxkIGRpcmVjdG9yeSBzdHJ1Y3R1cmUKCU5ldy1JdGVtIC1Gb3JjZSAtSXRlbVR5cGUgZGlyZWN0b3J5IC1QYXRoICgoR2V0LUl0ZW0gLVBhdGggIi5cIikuRnVsbE5hbWUgKyAiXEJveGVzIikgfCBvdXQtbnVsbAoJTmV3LUl0ZW0gLUZvcmNlIC1JdGVtVHlwZSBkaXJlY3RvcnkgLVBhdGggKChHZXQtSXRlbSAtUGF0aCAiLlwiKS5GdWxsTmFtZSArICJcQm94ZXNcd2luZG93c194NjQiKSB8IG91dC1udWxsCglOZXctSXRlbSAtRm9yY2UgLUl0ZW1UeXBlIGRpcmVjdG9yeSAtUGF0aCAoKEdldC1JdGVtIC1QYXRoICIuXCIpLkZ1bGxOYW1lICsgIlxCb3hlc1xsaW51eF94NjQiKSB8IG91dC1udWxsCglOZXctSXRlbSAtRm9yY2UgLUl0ZW1UeXBlIGRpcmVjdG9yeSAtUGF0aCAoKEdldC1JdGVtIC1QYXRoICIuXCIpLkZ1bGxOYW1lICsgIlx3aW5kb3dzX3g2NCIpIHwgb3V0LW51bGwKCU5ldy1JdGVtIC1Gb3JjZSAtSXRlbVR5cGUgZGlyZWN0b3J5IC1QYXRoICgoR2V0LUl0ZW0gLVBhdGggIi5cIikuRnVsbE5hbWUgKyAiXHdpbmRvd3NfeDY0XGFuc3dlcl9maWxlcyIpIHwgb3V0LW51bGwKCU5ldy1JdGVtIC1Gb3JjZSAtSXRlbVR5cGUgZGlyZWN0b3J5IC1QYXRoICgoR2V0LUl0ZW0gLVBhdGggIi5cIikuRnVsbE5hbWUgKyAiXHdpbmRvd3NfeDY0XGFuc3dlcl9maWxlc1w3IikgfCBvdXQtbnVsbAoJTmV3LUl0ZW0gLUZvcmNlIC1JdGVtVHlwZSBkaXJlY3RvcnkgLVBhdGggKChHZXQtSXRlbSAtUGF0aCAiLlwiKS5GdWxsTmFtZSArICJcd2luZG93c194NjRcYW5zd2VyX2ZpbGVzXDEwIikgfCBvdXQtbnVsbAoJTmV3LUl0ZW0gLUZvcmNlIC1JdGVtVHlwZSBkaXJlY3RvcnkgLVBhdGggKChHZXQtSXRlbSAtUGF0aCAiLlwiKS5GdWxsTmFtZSArICJcd2luZG93c194NjRcYW5zd2VyX2ZpbGVzXDgxIikgfCBvdXQtbnVsbAoJTmV3LUl0ZW0gLUZvcmNlIC1JdGVtVHlwZSBkaXJlY3RvcnkgLVBhdGggKChHZXQtSXRlbSAtUGF0aCAiLlwiKS5GdWxsTmFtZSArICJcd2luZG93c194NjRcYW5zd2VyX2ZpbGVzXDIwMDhfcjIiKSB8IG91dC1udWxsCglOZXctSXRlbSAtRm9yY2UgLUl0ZW1UeXBlIGRpcmVjdG9yeSAtUGF0aCAoKEdldC1JdGVtIC1QYXRoICIuXCIpLkZ1bGxOYW1lICsgIlx3aW5kb3dzX3g2NFxhbnN3ZXJfZmlsZXNcMjAxMl9yMiIpIHwgb3V0LW51bGwKCU5ldy1JdGVtIC1Gb3JjZSAtSXRlbVR5cGUgZGlyZWN0b3J5IC1QYXRoICgoR2V0LUl0ZW0gLVBhdGggIi5cIikuRnVsbE5hbWUgKyAiXHdpbmRvd3NfeDY0XGFuc3dlcl9maWxlc1wyMDE2IikgfCBvdXQtbnVsbAoJTmV3LUl0ZW0gLUZvcmNlIC1JdGVtVHlwZSBkaXJlY3RvcnkgLVBhdGggKChHZXQtSXRlbSAtUGF0aCAiLlwiKS5GdWxsTmFtZSArICJcd2luZG93c194NjRcY29uZmlncyIpIHwgb3V0LW51bGwKCU5ldy1JdGVtIC1Gb3JjZSAtSXRlbVR5cGUgZGlyZWN0b3J5IC1QYXRoICgoR2V0LUl0ZW0gLVBhdGggIi5cIikuRnVsbE5hbWUgKyAiXHdpbmRvd3NfeDY0XGZsb3BweSIpIHwgb3V0LW51bGwKCU5ldy1JdGVtIC1Gb3JjZSAtSXRlbVR5cGUgZGlyZWN0b3J5IC1QYXRoICgoR2V0LUl0ZW0gLVBhdGggIi5cIikuRnVsbE5hbWUgKyAiXHdpbmRvd3NfeDY0XHNjcmlwdHMiKSB8IG91dC1udWxsCglOZXctSXRlbSAtRm9yY2UgLUl0ZW1UeXBlIGRpcmVjdG9yeSAtUGF0aCAoKEdldC1JdGVtIC1QYXRoICIuXCIpLkZ1bGxOYW1lICsgIlx1YnVudHUiKSB8IG91dC1udWxsCglOZXctSXRlbSAtRm9yY2UgLUl0ZW1UeXBlIGRpcmVjdG9yeSAtUGF0aCAoKEdldC1JdGVtIC1QYXRoICIuXCIpLkZ1bGxOYW1lICsgIlx1YnVudHVcZmxvcHB5IikgfCBvdXQtbnVsbAoJTmV3LUl0ZW0gLUZvcmNlIC1JdGVtVHlwZSBkaXJlY3RvcnkgLVBhdGggKChHZXQtSXRlbSAtUGF0aCAiLlwiKS5GdWxsTmFtZSArICJcdWJ1bnR1XGh0dHAiKSB8IG91dC1udWxsCglOZXctSXRlbSAtRm9yY2UgLUl0ZW1UeXBlIGRpcmVjdG9yeSAtUGF0aCAoKEdldC1JdGVtIC1QYXRoICIuXCIpLkZ1bGxOYW1lICsgIlx1YnVudHVcc2NyaXB0IikgfCBvdXQtbnVsbAoJCgkjIFB1bGwgcmVxdWlyZWQgV2luZG93cyBidWlsZCBmaWxlcwoJJFdpbmRvd3NCYXNlVVJMID0gImh0dHBzOi8vZ2l0aHViLmNvbS9DYWx2aW5LcmlzdC9Qcm9qZWN0QnJpZ2h0U3VuL2Jsb2IvbWFzdGVyL2J1aWxkL3dpbmRvd3NfeDY0LyIKCSRXaW5kb3dzRmlsZXMgPSBAKCJhbnN3ZXJfZmlsZXMvMTAvQXV0b3VuYXR0ZW5kLnhtbCIsICJhbnN3ZXJfZmlsZXMvMjAwOF9yMi9BdXRvdW5hdHRlbmQueG1sIiwgImFuc3dlcl9maWxlcy8yMDEyX3IyL0F1dG91bmF0dGVuZC54bWwiLCAiYW5zd2VyX2ZpbGVzLzIwMTYvQXV0b3VuYXR0ZW5kLnhtbCIsICJhbnN3ZXJfZmlsZXMvMjAxNi9BdXRvdW5hdHRlbmRfc3lzcHJlcC54bWwiLCAiYW5zd2VyX2ZpbGVzLzcvQXV0b3VuYXR0ZW5kLnhtbCIsICJhbnN3ZXJfZmlsZXMvODEvQXV0b3VuYXR0ZW5kLnhtbCIsICJjb25maWdzL2xvY2FsX3VzZXJzLmpzb24iLCAiY29uZmlncy93aW5kb3dzX29wdGlvbmFsX2ZlYXR1cmVzLmpzb24iLCAiZmxvcHB5L1BpblRvMTAuZXhlIiwgImZsb3BweS9SRUFETUUubWQiLCAiZmxvcHB5L1dpbmRvd3NQb3dlcnNoZWxsLmxuayIsICJzY3JpcHRzL2FkZC11c2Vycy5wczEiLCAic2NyaXB0cy9hZGQtd2luZG93cy1vcHRpb25hbC1mZWF0dXJlcy5wczEiLCAic2NyaXB0cy9jb21wYWN0LmJhdCIsICJzY3JpcHRzL2NvbXBpbGUtZG90bmV0LWFzc2VtYmxpZXMuYmF0IiwgInNjcmlwdHMvZGVibG9hdC13aW5kb3dzLnBzMSIsICJzY3JpcHRzL2Rpc2FibGUtc2NyZWVuc2F2ZXIucHMxIiwgInNjcmlwdHMvZGlzYWJsZS13aW5ybS5wczEiLCAic2NyaXB0cy9lbmFibGUtcmRwLmJhdCIsICJzY3JpcHRzL2VuYWJsZS13aW5ybS5wczEiLCAic2NyaXB0cy9maXhuZXR3b3JrLnBzMSIsICJzY3JpcHRzL2hvdGZpeC1LQjMxMDI4MTAuYmF0IiwgInNjcmlwdHMvTWFrZVdpbmRvd3MxMEdyZWF0QWdhaW4ucHMxIiwgInNjcmlwdHMvTWFrZVdpbmRvd3MxMEdyZWF0QWdhaW4ucmVnIiwgInNjcmlwdHMvbWljcm9zb2Z0LXVwZGF0ZXMuYmF0IiwgInNjcmlwdHMvb3JhY2xlLWNlcnQuY2VyIiwgInNjcmlwdHMvcGluLXBvd2Vyc2hlbGwuYmF0IiwgInNjcmlwdHMvUkVBRE1FLm1kIiwgInNjcmlwdHMvcmVhcm0td2luZG93cy5wczEiLCAic2NyaXB0cy9zZXQtcG93ZXJwbGFuLnBzMSIsICJzY3JpcHRzL3NldC13aW5ybS1hdXRvbWF0aWMuYmF0IiwgInNjcmlwdHMvc3lzcHJlcC5iYXQiLCAic2NyaXB0cy91YWMtZW5hYmxlLmJhdCIsICJzY3JpcHRzL3VuYXR0ZW5kLnhtbCIsICJzY3JpcHRzL3ZtLWd1ZXN0LXRvb2xzLmJhdCIsICJzY3JpcHRzL3dpbi11cGRhdGVzLnBzMSIpCgkKCWZvcmVhY2ggKCRmaWxlIGluICRXaW5kb3dzRmlsZXMpIHsKCQlpZighKFRlc3QtUGF0aCAoKEdldC1JdGVtIC1QYXRoICIuXCIpLkZ1bGxOYW1lICsgIlx3aW5kb3dzX3g2NFwiICsgJGZpbGUpIC1QYXRoVHlwZSBMZWFmKSkgewoJCQlJbnZva2UtV2ViUmVxdWVzdCAoJFdpbmRvd3NCYXNlVVJMICsgJGZpbGUgKyAiP3Jhdz10cnVlIikgLU91dEZpbGUgKChHZXQtSXRlbSAtUGF0aCAiLlwiKS5GdWxsTmFtZSArICJcd2luZG93c194NjRcIiArICRmaWxlKSAtUGFzc1RocnUgfCBvdXQtbnVsbAoJCX0KCX0KCQoJIyBQdWxsIHJlcXVpcmVkIFVidW50dSBidWlsZCBmaWxlcwoJJFVidW50dUJhc2VVUkwgPSAiaHR0cHM6Ly9naXRodWIuY29tL0NhbHZpbktyaXN0L1Byb2plY3RCcmlnaHRTdW4vYmxvYi9tYXN0ZXIvYnVpbGQvdWJ1bnR1LyIKCSRVYnVudHVGaWxlcyA9IEAoImZsb3BweS9pbm9kZS1kX2FsaWFzLnBhdGNoIiwgImZsb3BweS9wYWdlLXNtcF9tYi5wYXRjaCIsICJmbG9wcHkvdm1oZ2ZzLWZfZGVudHJ5LWtlcm5lbC0zLjE5LXRvb2xzLTkuOS4yLnBhdGNoIiwgImh0dHAvcHJlc2VlZC0xMjA0LWRlc2t0b3AuY2ZnIiwgImh0dHAvcHJlc2VlZC0xNTA0LmNmZyIsICJodHRwL3ByZXNlZWQtZGVza3RvcC5jZmciLCAiaHR0cC9wcmVzZWVkLmNmZyIsICJzY3JpcHQvY2xlYW51cC5zaCIsICJzY3JpcHQvY3VzdG9tLXNjcmlwdC5zaCIsICJzY3JpcHQvZGVza3RvcC5zaCIsICJzY3JpcHQvbWluaW1pemUuc2giLCAic2NyaXB0L21vdGQuc2giLCAic2NyaXB0L3BhcmFsbGVscy5zaCIsICJzY3JpcHQvc3NoZC5zaCIsICJzY3JpcHQvdXBkYXRlLnNoIiwgInNjcmlwdC92YWdyYW50LnNoIiwgInNjcmlwdC92aXJ0dWFsYm94LnNoIiwgInNjcmlwdC92bXdhcmUuc2giKQoJCglmb3JlYWNoICgkZmlsZSBpbiAkVWJ1bnR1RmlsZXMpIHsKCQlpZighKFRlc3QtUGF0aCAoKEdldC1JdGVtIC1QYXRoICIuXCIpLkZ1bGxOYW1lICsgIlx1YnVudHVcIiArICRmaWxlKSAtUGF0aFR5cGUgTGVhZikpIHsKCQkJSW52b2tlLVdlYlJlcXVlc3QgKCRVYnVudHVCYXNlVVJMICsgJGZpbGUgKyAiP3Jhdz10cnVlIikgLU91dEZpbGUgKChHZXQtSXRlbSAtUGF0aCAiLlwiKS5GdWxsTmFtZSArICJcdWJ1bnR1XCIgKyAkZmlsZSkgLVBhc3NUaHJ1IHwgb3V0LW51bGwKCQl9Cgl9Cn0=";
	
	win_build_script += atob(win_dependencies);
	
	 //Windows Build SCRIPTS
	win_build_script += "\nworkflow Parallel-Vagrant {\n";
	win_build_script += "\t$loc = (Get-Item -Path \".\\\").FullName\n";
	win_build_script += "\t$machines = \"" + packers[0][0]['variables']['vm_name'] + ".json\"";
	nix_build_script += "packer build " + packers[0][0]['variables']['vm_name'] + ".json";
	for(var i = 1; i < packers.length; i++) {
		win_build_script +=  ", \"" + packers[i][0]['variables']['vm_name'] + ".json\"";
		nix_build_script += " & packer build " + packers[i][0]['variables']['vm_name'] + ".json"
	}
	win_build_script += "\n\tforeach -parallel($mach in $machines) {\n";
	win_build_script += "\t\tpowershell.exe -Command \"Set-Location '$loc';packer build $mach\"\n";
	win_build_script += "\t}\n";
	win_build_script += "}\n\n";
	win_build_script += "Install-Dependencies\n"; 
	win_build_script += "Parallel-Vagrant\n"; 
	
	win_build_script += "vagrant up";
	nix_build_script += "\nvagrant up";
	
	zip.add("build.ps1", win_build_script);
	zip.add("build.sh", nix_build_script);
	
	
	//GENERATE THE ZIP FILE AND START DOWNLOAD
	var content = zip.generate();
	console.log(content);
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
	box_json['variables']['output_dir'] = "Boxes/" + boxes[indx]['platform'] + "/" + boxes[indx]['name'] + ".box";
	box_json['post-processors'][0]['output'] = "Boxes/" + boxes[indx]['platform'] + "/" + boxes[indx]['name'] + ".box";
	box_json['builders'][0]['output_directory'] = boxes[indx]['name'] + "-iso-output";
	return box_json;
}