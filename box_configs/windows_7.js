var windows_7 = {
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
    "guest_os_type": "Windows7_64",
    "guest_additions_mode": "{{user `guest_additions_mode`}}",
    "disk_size": "{{user `disk_size`}}",
    "floppy_files": [
        "{{user `autounattend`}}",
		"./windows_x64/scripts/disable-screensaver.ps1",
		"./windows_x64/scripts/disable-winrm.ps1",
		"./windows_x64/scripts/enable-winrm.ps1",
        "./windows_x64/scripts/hotfix-KB3102810.bat",
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
  "post-processors": [
    {
      "type": "vagrant",
      "keep_input_artifact": false,
      "output": "{{user `output_dir`}}"
    }
  ],
  "variables": {
    "iso_url": "http://care.dlservice.microsoft.com/dl/download/evalx/win7/x64/EN/7600.16385.090713-1255_x64fre_enterprise_en-us_EVAL_Eval_Enterprise-GRMCENXEVAL_EN_DVD.iso",
	"platform":"windows",
    "iso_checksum_type": "md5",
    "iso_checksum": "1d0d239a252cb53e466d39e752b17c28",
    "autounattend": "./windows_x64/answer_files/7/Autounattend.xml",
    "disk_size": "61440",
    "headless": "false",
    "vm_name": "windows_7",
    "winrm_timeout": "8h",
    "guest_additions_mode": "disable",
    "memory": "2048",
    "cpus": "2",
    "output_dir": "../Boxes/windows_x64/windows_7.box"
  }
}
