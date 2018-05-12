var windows_10 = {
  "builders": [{
	"output_directory":"{{user `vm_output`}}",
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
	"output_directory": "output-{{ user `vm_name` }}-virtualbox-iso",
    "winrm_password": "vagrant",
    "winrm_timeout": "{{user `winrm_timeout`}}",
    "shutdown_command": "shutdown /s /t 10 /f /d p:4:1 /c \"Packer Shutdown\"",
    "guest_os_type": "Windows10_64",
    "guest_additions_mode": "{{user `guest_additions_mode`}}",
    "disk_size": "{{user `disk_size`}}",
	"floppy_files": [
        "{{user `autounattend`}}",
        "./windows_x64/floppy/WindowsPowershell.lnk",
        "./windows_x64/floppy/PinTo10.exe",
        "./windows_x64/scripts/fixnetwork.ps1",
        "./windows_x64/scripts/MakeWindows10GreatAgain.ps1",
        "./windows_x64/scripts/MakeWindows10GreatAgain.reg",
        "./windows_x64/scripts/rearm-windows.ps1",
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
      "remote_path": "/tmp/script.bat",
      "execute_command": "{{ .Vars }} cmd /c \"{{ .Path }}\"",
      "scripts": [
        "./windows_x64/scripts/vm-guest-tools.bat",
        "./windows_x64/scripts/enable-rdp.bat"
      ]
    },
    {
      "type": "powershell",
      "scripts": [
        "./windows_x64/scripts/debloat-windows.ps1",
        "./windows_x64/scripts/MakeWindows10GreatAgain.ps1",
        "./windows_x64/scripts/rearm-windows.ps1"
      ]
    },
    {
      "type": "windows-restart"
    },
    {
      "type": "powershell",
      "scripts": [
        "./windows_x64/scripts/set-powerplan.ps1"
      ]
    },
    {
      "type": "windows-shell",
      "remote_path": "/tmp/script.bat",
      "execute_command": "{{ .Vars }} cmd /c \"{{ .Path }}\"",
      "scripts": [
        "./windows_x64/scripts/pin-powershell.bat",
        "./windows_x64/scripts/compile-dotnet-assemblies.bat",
        "./windows_x64/scripts/set-winrm-automatic.bat",
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
    "iso_url": "http://care.dlservice.microsoft.com/dl/download/B/8/B/B8B452EC-DD2D-4A8F-A88C-D2180C177624/15063.0.170317-1834.RS2_RELEASE_CLIENTENTERPRISEEVAL_OEMRET_X64FRE_EN-US.ISO",
	"platform":"windows",
    "iso_checksum_type": "sha1",
    "iso_checksum": "6c60f91bf0ad7b20f469ab8f80863035c517f34f",
    "autounattend": "./windows_x64/answer_files/10/Autounattend.xml",
    "disk_size": "61440",
    "headless": "false",
    "vm_name": "windows_10",
    "winrm_timeout": "6h",
    "guest_additions_mode": "disable",
    "memory": "2048",
    "cpus": "2",
	"vm_output":"vm-iso-output",
    "output_dir": "../Boxes/windows_x64/windows_10.box"
  }
}
