var windows_server_2012_r2 = {
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
    "guest_os_type": "Windows2012_64",
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
      ["modifyvm", "{{.Name}}", "--memory", "{{user `ram_size`}}"],
      ["modifyvm", "{{.Name}}", "--cpus", "{{user `cpu_count`}}"]
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
    "iso_url": "http://download.microsoft.com/download/6/2/A/62A76ABB-9990-4EFC-A4FE-C7D698DAEB96/9600.16384.WINBLUE_RTM.130821-1623_X64FRE_SERVER_EVAL_EN-US-IRM_SSS_X64FREE_EN-US_DV5.ISO",
    "iso_checksum_type": "md5",
    "iso_checksum": "458ff91f8abc21b75cb544744bf92e6a",
    "autounattend": "./windows_x64/answer_files/2012_r2/Autounattend.xml",
    "disk_size": "61440",
    "headless": "false",
    "vm_name": "windows_server_2012_r2",
    "winrm_timeout": "6h",
    "guest_additions_mode": "disable",
    "ram_size": "2048",
    "cpu_count": "2",
    "output_dir": "../Boxes/windows_x64/windows_server_2012_r2.box"
  }
}
