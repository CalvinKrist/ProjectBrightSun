# RedBlueCyberlab

A local website that allows for the automated installation of a variety of virtual machines to VirtualBox using packer and vagrant. 

## Getting Started

### Required System Specs:
* 16GB+ of RAM
* 60GB+ of free disk space

### Prerequisites:
1. Install VirtualBox: [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)
    * Version `5.2.8+`; Successfully tested on: `5.2.8`
1. Install Packer: [https://www.packer.io/downloads.html](https://www.packer.io/downloads.html)
    * Version `1.2.1+`; Successfully tested on: `1.2.1`
1. Install Vagrant: [https://www.vagrantup.com/downloads.html](https://www.vagrantup.com/downloads.html)
    * Version `2.0.2+`; Successfully tested on: `2.0.2`
1. Install the Vagrant-Reload plugin: `vagrant plugin install vagrant-reload`
1. Install Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)

### Using this tool to build your lab:
* fill_in_here

## Development Progress
[![Throughput Graph](https://graphs.waffle.io/CalvinKrist/RedBlueCyberlab/throughput.svg)](https://waffle.io/CalvinKrist/RedBlueCyberlab/metrics/throughput)

## Project Authors
This project was initially created by Clark Benham, Calvin Krist, Saeed Razavi, and Jake Smith as part of the Synthesis Design II class at the University of Virginia (UVA) for Rodman Engineering Students.
* Clark Benham ([Github](https://github.com/CLARKBENHAM))
* Calvin Krist ([Github](https://github.com/CalvinKrist), [Twitter](https://twitter.com/CalvinKrist), [LinkedIn](https://www.linkedin.com/in/calvin-krist/))
* Saeed Razavi ([Github](https://github.com/SaeedRazavi))
* Jake Smith ([Github](https://github.com/ION28), [Twitter](https://twitter.com/jtsmith282), [LinkedIn](https://linkedin.com/in/jakesmith282/))

## Project Contributers
list_of_awesome_contributers

## Credit & Acknowledgments
Without these amazing people and tools, we would not have been able to build any of this.
* [@clong](https://github.com/clong)'s [Detection Lab](https://github.com/clong/DetectionLab)
* [@joefitzgerald](https://github.com/joefitzgerald)'s [Packer Windows Templates](https://github.com/joefitzgerald/packer-windows)
* [@kaorimatz](https://github.com/kaorimatz)'s [Packer Linux Templates](https://github.com/kaorimatz/packer-templates)
* [@hahndorf](https://github.com/hahndorf)'s [Blog post on Installing Windows Features on the Command Line](https://peter.hahndorf.eu/blog/WindowsFeatureViaCmd.html)
* [@Stuk](https://github.com/Stuk)'s [JSZip](https://github.com/Stuk/jszip)
* [@rndme](https://github.com/rndme)'s [download](https://github.com/rndme/download)
* [@mariahamaris](https://github.com/mariahamaris) for acting as a client to our project team and for her support throughout the project

## Technology Stack
* Oracle's [VirtualBox](https://www.virtualbox.org/): Virtualization software
* HashiCorp's [Packer](https://www.packer.io): Automated building of virtual machines
* HashiCorp's [Vagrant](https://www.vagrantup.com/): Virtual environment management
* Microsoft's [Developer Virtual Machines](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/): Source of Windows VMs
* Canonical's [Ubuntu](http://releases.ubuntu.com/): Source of Ubuntu VMs
* Microsoft's [Windows Powershell](https://docs.microsoft.com/en-us/powershell/scripting/getting-started/getting-started-with-windows-powershell?): Scripting language to automate setup of Windows VMs
* [Shell Scripts](https://en.wikipedia.org/wiki/Shell_script): Scripting language to automate setup of Linux VMs
* work_in_progress

## Miscellaneous Notes
* User Story Template:   As a \_\___role__\_\_ I want \_\___feature__\_\_ so that \_\___benefit__\_\_
* [Notes on Vagrant](VagrantNotes.MD)
