import sys
import os
import json

provisioner_list = []

class Configurer:

    def __init__(self, configuration_file_location):
        self.variables = {}

    def get_variable_names(self):
        return list(self.variables.keys())

class Provisioner:

    # todo: support loading both ps1 script and sh script
    def __init__(self, configuration_file_location, windows_script_location = "", linux_script_location = "" ):
        self.configurer  = Configurer(configuration_file_location)
        self.NAME        = "Test Provisioner"
        self.AUTHOR      = "Calvin Krist"
        self.DESCRIPTION = "A test provisioner with dummy data."
        self.SUPPORTED_OPERATING_SYSTEMS = ["Windows 10"]
        self.REQUIRED_PROVISIONERS       = ["users"]

###########################
##       Functions       ##
###########################

# Recursive function that retuns a list of provisioner objects, representing each provisioner in the repository
def get_package_dict(dir_path):
    provisioner_dict = {"name" : os.path.basename(dir_path), "provisioners" : [], "packages" : []}

    files = os.listdir(dir_path)
    for file_path in files:
        file_path = dir_path + "/" + file_path + ""
        if os.path.isdir(file_path):
            provisioner_dict["packages"].append(get_package_dict(file_path))
        elif os.path.splitext(file_path)[1] == ".json":
            provisioner = Provisioner(file_path)
            provisioner_dict["provisioners"].append({"name" : provisioner.NAME, "author" : provisioner.AUTHOR, "description" : provisioner.DESCRIPTION,
                                       "supportedOperatingSystems" : provisioner.SUPPORTED_OPERATING_SYSTEMS,
                                       "requiredProvisioners" : provisioner.REQUIRED_PROVISIONERS})

    return provisioner_dict

if __name__ == '__main__':
    if(len(sys.argv) == 1):
        print("Please give a command to be run.")
        quit(0)

    command = sys.argv[1]
    if(command == 'getProvisionerDict'):
        provisionerDict = get_package_dict(sys.argv[2])
        stuff = json.dumps(provisionerDict)
        print(stuff)