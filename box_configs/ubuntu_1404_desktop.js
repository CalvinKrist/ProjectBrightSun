var ubunt_1404_desktop ={
  "builders": [
    {
	  "output_directory":"{{user `vm_output`}}",
      "boot_command": [
        "{{ user `boot_command_prefix` }}",
        "/install/vmlinuz noapic ",
        "initrd=/install/initrd.gz ",
        "file=/floppy/{{ user `preseed` }} ",
        "debian-installer={{ user `locale` }} auto locale={{ user `locale` }} kbd-chooser/method=us ",
        "hostname={{ user `hostname` }} ",
        "grub-installer/bootdev=/dev/sda<wait> ",
        "fb=false debconf/frontend=noninteractive ",
        "keyboard-configuration/modelcode=SKIP keyboard-configuration/layout=USA ",
        "keyboard-configuration/variant=USA console-setup/ask_detect=false ",
        "passwd/user-fullname={{ user `ssh_fullname` }} ",
        "passwd/user-password={{ user `ssh_password` }} ",
        "passwd/user-password-again={{ user `ssh_password` }} ",
        "passwd/username={{ user `ssh_username` }} ",
        "-- <enter>"
      ],
      "disk_size": "{{ user `disk_size` }}",
      "floppy_files": [
        "ubuntu/http/{{ user `preseed` }}"
      ],
      "guest_additions_path": "VBoxGuestAdditions_{{.Version}}.iso",
      "guest_os_type": "{{ user `virtualbox_guest_os_type` }}",
      "hard_drive_interface": "sata",
      "headless": "{{ user `headless` }}",
      "iso_checksum": "{{ user `iso_checksum` }}",
      "iso_checksum_type": "{{ user `iso_checksum_type` }}",
      "iso_urls": [
        "{{ user `iso_path` }}/{{ user `iso_name` }}",
        "{{ user `iso_url` }}"
      ],
      "output_directory": "output-{{ user `vm_name` }}-virtualbox-iso",
      "post_shutdown_delay": "1m",
      "shutdown_command": "echo '{{ user `ssh_password` }}'|sudo -S shutdown -P now",
      "ssh_password": "{{ user `ssh_password` }}",
      "ssh_username": "{{ user `ssh_username` }}",
      "ssh_wait_timeout": "10000s",
      "type": "virtualbox-iso",
      "vboxmanage": [
        [
          "modifyvm", "{{.Name}}", "--nictype1", "virtio"
        ],
        [
          "modifyvm", "{{.Name}}", "--memory", "{{ user `memory` }}"
        ],
        [
          "modifyvm", "{{.Name}}", "--cpus", "{{ user `cpus` }}"
        ],
		["modifyvm", "{{.Name}}", "--vram", "{{user `vram`}}"]
      ],
      "virtualbox_version_file": ".vbox_version",
      "vm_name": "{{user `vm_name`}}"
    }
  ],
  "post-processors": [
    {
      "keep_input_artifact": false,
      "output": "{{user `output`}}",
      "type": "vagrant"
    }
  ],
  "provisioners": [
    {
      "environment_vars": [
        "CLEANUP_PAUSE={{user `cleanup_pause`}}",
        "DESKTOP={{user `desktop`}}",
        "UPDATE={{user `update`}}",
        "INSTALL_VAGRANT_KEY={{user `install_vagrant_key`}}",
        "SSH_USERNAME={{user `ssh_username`}}",
        "SSH_PASSWORD={{user `ssh_password`}}",
        "http_proxy={{user `http_proxy`}}",
        "https_proxy={{user `https_proxy`}}",
        "ftp_proxy={{user `ftp_proxy`}}",
        "rsync_proxy={{user `rsync_proxy`}}",
        "no_proxy={{user `no_proxy`}}"
      ],
      "execute_command": "echo '{{ user `ssh_password` }}' | {{.Vars}} sudo -E -S bash '{{.Path}}'",
      "scripts": [
        "ubuntu/script/update.sh",
        "ubuntu/script/desktop.sh",
        "ubuntu/script/vagrant.sh",
        "ubuntu/script/sshd.sh",
        "ubuntu/script/vmware.sh",
        "ubuntu/script/virtualbox.sh",
        "ubuntu/script/parallels.sh",
        "ubuntu/script/motd.sh",
        "ubuntu/{{user `custom_script`}}",
        "ubuntu/script/minimize.sh",
        "ubuntu/script/cleanup.sh"
      ],
      "type": "shell",
      "expect_disconnect": "true"
    }
  ],
  "variables": {
    "cleanup_pause": "",
	"platform":"linux",
    "custom_script": "script/custom-script.sh",
    "ftp_proxy": "{{env `ftp_proxy`}}",
    "headless": "",
    "http_proxy": "{{env `http_proxy`}}",
    "https_proxy": "{{env `https_proxy`}}",
    "install_vagrant_key": "true",
    "iso_path": "/Volumes/Storage/software/ubuntu",
    "locale": "en_US",
    "no_proxy": "{{env `no_proxy`}}",
    "parallels_guest_os_type": "ubuntu",
    "rsync_proxy": "{{env `rsync_proxy`}}",
    "hostname": "vagrant",
    "ssh_fullname": "vagrant",
    "ssh_password": "vagrant",
    "ssh_username": "vagrant",
    "update": "false",
    "vagrantfile_template": "",
    "version": "0.1.0",
    "virtualbox_guest_os_type": "Ubuntu_64",
    "vmware_guest_os_type": "ubuntu-64",
    "output_dir": "../Boxes/ubuntu/default_name.box",
	"vram": "32",
	"vm_name": "ubuntu1404-desktop",
	"desktop": "true",
	"cpus": "1",
	"disk_size": "130048",
	"iso_checksum": "dde07d37647a1d2d9247e33f14e91acb10445a97578384896b4e1d985f754cc1",
	"iso_checksum_type": "sha256",
	"iso_name": "ubuntu-14.04.5-server-amd64.iso",
	"iso_url": "http://releases.ubuntu.com/14.04.5/ubuntu-14.04.5-server-amd64.iso",
	"memory": "1024",
	"preseed": "preseed.cfg",
	"vm_output":"vm-iso-output",
	"boot_command_prefix": "<esc><esc><enter><wait>"
  }

}
