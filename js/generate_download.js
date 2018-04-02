function build_boxes() {
	var boxes = window.boxes;
	
	var zip = new JSZip();
	
	//CREATE THE MASTER VAGRANTFILE
	var vagrantfile = "Vagrant.configure(\"2\") do |config|\n";
	
	for(var i = 0; i < boxes.length; i++) {
		if(boxes[i]['platform'] === "linux_x64") {
			vagrantfile += "config.vm.box = \"../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box\"\n"
			vagrantfile += "config.vm.provider :virtualbox do |vb|\n"
			vagrantfile += "\tvb.name = \"" + boxes[i]['name'] + "\"\n"
			vagrantfile += "\tend\n"
		} else if(boxes[i]['platform'] === "windows_x64") {
			vagrantfile += "\tconfig.vm.define \"" + boxes[i]['name'] + "\" do |" + boxes[i]['name'] + "|\n";
			vagrantfile += "\t\t" + boxes[i]['name'] + ".vm.box = \"../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box\"\n"
			vagrantfile += "\t\t" + boxes[i]['name'] + ".vm.provider :virtualbox do |vb|\n";
			vagrantfile += "\t\t\tvb.name = \"" + boxes[i]['name'] + "\"\n";
			vagrantfile += "\t\t\tvb.gui = true\n";
			vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--memory\", 2048]\n";
			vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--cpus\", 1]\n";
			vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--vram\", \"32\"]\n";
			vagrantfile += "\t\t\tvb.customize [\"modifyvm\", :id, \"--clipboard\", \"bidirectional\"]\n";
			vagrantfile += "\t\t\tvb.customize [\"setextradata\", \"global\", \"GUI/SuppressMessages\", \"all\"]\n";
			vagrantfile += "\t\tend\n";
			vagrantfile += "\t\t\n";
			vagrantfile += "\t\t" + boxes[i]['name'] + ".winrm.transport = :plaintext\n";
			vagrantfile += "\t\t" + boxes[i]['name'] + ".winrm.basic_auth_only = true\n";
			vagrantfile += "\t\t" + boxes[i]['name'] + ".vm.communicator = \"winrm\"\n";
			vagrantfile += "\tend\n";
		}
	}
	vagrantfile += "\nend";
	
	zip.add("Vagrantfile", vagrantfile);
	
	
	//ADD JSON CONFIGS FOR EACH MACHINE
	for(var i = 0; i < boxes.length; i++) {
		var box_json = "";
		if(boxes[i]['platform'] === "linux_x64") {
			ubuntu['variables']['output'] = "../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box"
			switch(boxes[i]['os_version']) {
				case "ubuntu_1404":
					ubuntu_1404['vm_name'] = boxes[i]['name'];
					box_json = JSON.stringify(ubuntu_1404, null, 2);
					break;
				case "ubuntu_1404_i386":
					ubuntu_1404_i386['vm_name'] = boxes[i]['name'];
					box_json = JSON.stringify(ubuntu_1404_i386, null, 2);
					break;
				case "ubuntu_1404_desktop":
					ubuntu_1404_desktop['vm_name'] = boxes[i]['name'];
					box_json = JSON.stringify(ubuntu_1404_desktop, null, 2);
					break;
				case "ubuntu_1604":
					ubuntu_1604['vm_name'] = boxes[i]['name'];
					box_json = JSON.stringify(ubuntu_1604, null, 2);
					break;
				case "ubuntu_1604_i386":
					ubuntu_1604_i386['vm_name'] = boxes[i]['name'];
					box_json = JSON.stringify(ubuntu_1604_i386, null, 2);
					break;
				case "ubuntu_1604_desktop":
					ubuntu_1604_desktop['vm_name'] = boxes[i]['name'];
					box_json = JSON.stringify(ubuntu_1604_desktop, null, 2);
					break;
				case "ubuntu_1710":
					ubuntu_1710['vm_name'] = boxes[i]['name'];
					box_json = JSON.stringify(ubuntu_1710, null, 2);
					break;
				case "ubuntu_1710_i386":
					ubuntu_1710_i386['vm_name'] = boxes[i]['name'];
					box_json = JSON.stringify(ubuntu_1710_i386, null, 2);
					break;
				case "ubuntu_1710_desktop":
					ubuntu_1710_desktop['vm_name'] = boxes[i]['name'];
					box_json = JSON.stringify(ubuntu_1710_desktop, null, 2);
					break;
				default:
					continue;
			}
		} else if(boxes[i]['platform'] === "windows_x64") {
			switch(boxes[i]['os_version']) {
				case "windows_7":
					windows_7['variables']['vm_name'] = boxes[i]['name'];
					windows_7['variables']['output_dir'] = "../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box"
					box_json = JSON.stringify(windows_7, null, 2);
					break;
				case "windows_81":
					windows_81['variables']['vm_name'] = boxes[i]['name'];
					windows_81['variables']['output_dir'] = "../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box"
					box_json = JSON.stringify(windows_81, null, 2);
					break;
				case "windows_10":
					windows_10['variables']['vm_name'] = boxes[i]['name'];
					windows_10['variables']['output_dir'] = "../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box"
					box_json = JSON.stringify(windows_10, null, 2);
					break;
				case "windows_server_2008_r2":
					windows_server_2008_r2['variables']['vm_name'] = boxes[i]['name'];
					windows_server_2008_r2['variables']['output_dir'] = "../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box"
					box_json = JSON.stringify(windows_server_2008_r2, null, 2);
					break;
				case "windows_server_2012_r2":
					windows_server_2012_r2['variables']['vm_name'] = boxes[i]['name'];
					windows_server_2012_r2['variables']['output_dir'] = "../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box"
					box_json = JSON.stringify(windows_server_2012_r2, null, 2);
					break;
				case "windows_server_2016":
					windows_server_2016['variables']['vm_name'] = boxes[i]['name'];
					windows_server_2016['variables']['output_dir'] = "../Boxes/" + boxes[i]['platform'] + "/" + boxes[i]['name'] + ".box"
					box_json = JSON.stringify(windows_server_2016, null, 2);
					break;
				default:
					continue;
			}
		} else {
			continue;
		}
		zip.add(boxes[i]['name'] + ".json", box_json);
	}
	
	for(var i = 0; i < boxes.length; i++) {
		if(boxes[i]['platform'] === "linux_x64") {
			zip.add("ubuntu.json", JSON.stringify(ubuntu, null, 2));
			break;
		}
	}
	
	//GENERATE THE BUILD SCRIPT
	var build_script = "";
	
	for(var i = 0; i < boxes.length; i++) {
		if(boxes[i]['platform'] === "linux_x64") {
			build_script += "packer build -var-file=" + boxes[i]['os_version'] + ".json ubuntu.json\n";
		} else if(boxes[i]['platform'] === "windows_x64") {
			build_script += "packer build " + boxes[i]['name'] + ".json\n";
		}
	}
	build_script += "vagrant up";
	
	zip.add("build.ps1", build_script);
	
	
	//GENERATE THE ZIP FILE AND START DOWNLOAD
	content = zip.generate();
	download("data:application/zip;base64," + content, "boxes.zip", "application/zip");
}