function build_boxes() {
	if(window.boxes.length === 0) {
		alert("Please add a new machine first!");
		return;
	}
	var boxes = window.boxes;
	
	var zip = new JSZip();
	
	var vagrantfile = "Vagrant.configure(\"2\") do |config|\n";
		
	//ADD JSON CONFIGS FOR EACH MACHINE and create Vagrantfile
	for(var i = 0; i < boxes.length; i++) {
		//Create box object for generating JSON and Vagranfile
		var box_json = window[boxes[i]['os_version']];	
		box_json['variables']['vm_name'] = boxes[i]['name'];
		box_json['variables']['output_dir'] = "../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box";
		
		//Generate Vagrantfile using box JSON
		if(boxes[i]['platform'] === "linux_x64") {
			vagrantfile += "\tconfig.vm.box = \"../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box\"\n";
			vagrantfile += "\tconfig.vm.define \"" + boxes[i]['name'] + "\"\n";
			vagrantfile += "\tconfig.vm.provider :virtualbox do |vb|\n";
			vagrantfile += "\t\tvb.name = \"" + boxes[i]['name'] + "\"\n";
			vagrantfile += "\t\tvb.customize [\"modifyvm\", :id, \"--memory\", " + box_json['variables']['memory'] + "]\n";
			vagrantfile += "\t\tvb.customize [\"modifyvm\", :id, \"--cpus\", " + box_json['variables']['cpus'] + "]\n";
			vagrantfile += "\t\tvb.customize [\"modifyvm\", :id, \"--vram\", \"" + box_json['variables']['vram'] + "\"]\n";
		} else if(boxes[i]['platform'] === "windows_x64") {
			vagrantfile += "\tconfig.vm.define \"" + boxes[i]['name'] + "\" do |" + boxes[i]['name'] + "|\n";
			vagrantfile += "\t\t" + boxes[i]['name'] + ".vm.box = \"../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box\"\n";
			vagrantfile += "\t\t" + boxes[i]['name'] + ".vm.provider :virtualbox do |vb|\n";
			vagrantfile += "\t\t\tvb.name = \"" + boxes[i]['name'] + "\"\n";
			vagrantfile += "\t\t\tvb.gui = true\n";
			vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--memory\", " + box_json['variables']['memory'] + "]\n";
			vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--cpus\", " + box_json['variables']['cpus'] + "]\n";
			vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--vram\", \"32\"]\n";
			vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--clipboard\", \"bidirectional\"]\n";
			vagrantfile += "\t\t\tvb.customize [\"setextradata\", \"global\", \"GUI/SuppressMessages\", \"all\"]\n";
			vagrantfile += "\t\tend\n";
			vagrantfile += "\t\t\n";
			vagrantfile += "\t\t" + boxes[i]['name'] + ".winrm.transport = :plaintext\n";
			vagrantfile += "\t\t" + boxes[i]['name'] + ".winrm.basic_auth_only = true\n";
			vagrantfile += "\t\t" + boxes[i]['name'] + ".vm.communicator = \"winrm\"\n";
		}
		vagrantfile += "\tend\n";
		
		//Add box JSON to zip file
		box_json = JSON.stringify(box_json, null, 2);
		zip.add(boxes[i]['name'] + ".json", box_json);
	}
	
	vagrantfile += "\nend";
	zip.add("Vagrantfile", vagrantfile);

	
	//GENERATE THE BUILD SCRIPT
	var build_script = "";
	
	for(var i = 0; i < boxes.length; i++) {
			build_script += "packer build " + boxes[i]['name'] + ".json\n";
	}
	build_script += "vagrant up";
	
	zip.add("build.ps1", build_script);
	zip.add("build.sh", build_script);
	
	
	//GENERATE THE ZIP FILE AND START DOWNLOAD
	content = zip.generate();
	download("data:application/zip;base64," + content, "boxes.zip", "application/zip");
}