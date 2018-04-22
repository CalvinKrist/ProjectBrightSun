var windows_server_2008_r2 = {
  "builders": [{
    "type": "virtualbox-iso",
	"vm_name": "{{user `vm_name`}}",
	"communicator": "winrm",
    "iso_url": "{{user `iso_url`}}",
    "iso_checksum_type": "{{user `iso_checksum_type`}}",
    "iso_checksum": "{{user `iso_checksum`}}",
    "headless": "{{user `headless`}}",
	"boot_wait": "4m",
    "boot_command": "",
    "winrm_username": "vagrant",
	"winrm_password": "vagrant",
	"winrm_timeout": "{{user `winrm_timeout`}}",
    "shutdown_command": "shutdown /s /t 10 /f /d p:4:1 /c \"Packer Shutdown\"",
    "guest_os_type": "Windows2008_64",
	"guest_additions_mode": "{{user `guest_additions_mode`}}",
    "disk_size": "{{user `disk_size`}}",
    "floppy_files": [
        "{{user `autounattend`}}",
		"./windows_x64/scripts/disable-screensaver.ps1",
		"./windows_x64/scripts/disable-winrm.ps1",
		"./windows_x64/scripts/enable-winrm.ps1",
        "./windows_x64/scripts/microsoft-updates.bat",
        "./windows_x64/scripts/win-updates.ps1",
		"./windows_x64/scripts/oracle-cert.cer",
        "./windows_x64/configs/local_users.json",
        "./windows_x64/configs/windows_optional_features.json"
    ],
	"vboxmanage": [
      ["modifyvm", "{{.Name}}", "--memory", "{{user `memory`}}"],
      ["modifyvm", "{{.Name}}", "--cpus", "{{user `cpus`}}"]
    ]
  }],
  "provisioners": [
    {
      "type": "windows-shell",
      "execute_command": "{{ .Vars }} cmd /c \"{{ .Path }}\"",
      "scripts": [
        "./windows_x64/scripts/vm-guest-tools.bat",
        "./windows_x64/scripts/enable-rdp.bat"
      ]
    },
    {
      "type": "windows-restart"
    },
    {
      "type": "windows-shell",
      "execute_command": "{{ .Vars }} cmd /c \"{{ .Path }}\"",
      "scripts": [
        "./windows_x64/scripts/set-winrm-automatic.bat",
        "./windows_x64/scripts/compile-dotnet-assemblies.bat",
        "./windows_x64/scripts/uac-enable.bat",
        "./windows_x64/scripts/compact.bat"
      ]
    },
    {
      "type": "powershell",
      "scripts": [
        "./windows_x64/scripts/add-users.ps1",
        "./windows_x64/scripts/add-windows-optional-features.ps1"
      ]
    }
  ],
  "post-processors": [{
    "type": "vagrant",
    "keep_input_artifact": false,
    "output": "{{user `output_dir`}}"
  }],
  "variables": {
    "iso_url": "http://download.microsoft.com/download/7/5/E/75EC4E54-5B02-42D6-8879-D8D3A25FBEF7/7601.17514.101119-1850_x64fre_server_eval_en-us-GRMSXEVAL_EN_DVD.iso",
    "iso_checksum_type": "md5",
    "iso_checksum": "4263be2cf3c59177c45085c0a7bc6ca5",
    "autounattend": "./windows_x64/answer_files/2008_r2/Autounattend.xml",
    "disk_size": "61440",
    "headless": "false",
    "vm_name": "windows_server_2008_r2",
    "winrm_timeout": "8h",
    "guest_additions_mode": "disable",
    "memory": "2048",
    "cpus": "2",
    "output_dir": "../Boxes/windows_x64/windows_server_2008_r2.box"
  }
}
