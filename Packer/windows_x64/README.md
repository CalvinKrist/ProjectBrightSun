## Current Windows Build Process:

1. Clone Repository and navigate to build area
```cmd
git clone https://github.com/CalvinKrist/RedBlueCyberlab.git
cd RedBlueCyberlab/Packer
cd windows_x64
```

2. Build select Windows machine. This outputs a built .box to `RedBlueCyberlab/Boxes/windows_x64/windows_version_here.box`
```cmd
packer build windows_version_here.json
```
Supported Windows Versions:

| Windows Version  | JSON Config File |
| ------------- | ------------- |
| Windows 7  | `windows_7.json`  |
| Windows 8.1 | `windows_81.json`  |
| Windows 10 | `windows_10.json`  |
| Windows Server 2008 R2 | `windows_server_2008_r2.json`  |
| Windows Server 2012 R2  | `windows_server_2012_r2.json`  |
| Windows Server 2016 | `windows_server_2016.json`  |

3. 