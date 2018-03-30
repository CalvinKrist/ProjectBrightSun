#Ubuntu Packer Files
### Coppied from [this guy](https://github.com/kaorimatz/packer-templates), edited by Calvin Krist

* When this works correctly, it can take a while even AFTER everything is downloaded. It downloads, launches to VirtualBox, does some stuff
 that takes a while, closes it, and cleans up. Only at the end do we have a Vagrant 
* From this point, one can initialize vagrant and set the default box to be the newly created box. Calling 'vagrant init' will then result in the VM being launched in headless mode.

* Frozen VMs while packer waits for SSH to connect can be caused by not having a large enough 'boot_wait' value
	** With Desktop installations, packer never does get past 'Waiting for SSH', but VM will be succesfully installed regardless. This will likely cause issues if we want to install custom software.
* For the desktop the boot command isn't completely corrent, requires manual interaction with installation. This prevents the rest of the scripts from running, including the parts where the vagrant box is created
 and the scripts clean everything up/
* I also have support for VMware for some reason
* If scripts are not left to complete, or you install a desktop version, then there will be left over files in the json directory and the VirtualBox 'Virtual Machines' directory. These can cause issues.

* Note: the only servers tested are 16.0.4 i386 and 17.10.1 amd64. It is just assumed the others too shall work.

* Most of this could be refactored, so that the 'main scripts' just call a base script with different iso link, checksum, and desktop flag. Would make code more readable / maintainable, easier to edit with HTML.

* ubuntu1604-desktop.json should be build as 'packer build -var-file=ubuntu1604-desktop.json ubuntu.json'

    //"vagrantfile_template": "vagrantfile/vagrantfile-ubuntu1604-desktop.tpl",