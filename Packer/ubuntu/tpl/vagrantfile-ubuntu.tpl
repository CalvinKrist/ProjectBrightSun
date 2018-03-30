# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.define "vagrant-ubuntu"
    config.vm.provider :virtualbox do |vb|
        vb.name = "vagrant-vb-ubuntu"

    end
end
