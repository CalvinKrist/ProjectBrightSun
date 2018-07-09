// Provisioner manipulation functions, including loading provisioners, generating configuration menus, and using provisioner information
// to help generate downloads

// Used to asyncronously load all provisioners and their basic information.
// TODO: take in callback function or add to window?
function asyncLoadProvisionerList() {
	const python = spawn('python', ['python/provisioners.py', 'getProvisionerDict', 'provisioners']);
	python.stdout.on('data', (data) => {
	  window.provisioners = JSON.parse(data.toString());
	  console.log(window.provisioners)
	});
	
	python.stderr.on('data', (data) => {
	  console.error("ERROR loading provisioners: " + data.toString());
	});
	
}

/* Loaded object has this structure:
{
	"package1" = {
		"name" = "Provisioners",
		"provisioners" = [
			{
				
			},
			{
			
			}
		},
		"packages" = [{
			"name" = "System",
			"provisioners" = [
		
			]
		},
		{
			"name" = "System",
			"provisioners" = [
		
			]
		}]
	}
}
*/