$(function(){ //shorthand for $(document).ready(function(){...});

		window.boxes=[];
		var osSelect = $('#osSelect');

		////////////////////////////////
		//   Load packer JSON files   //
		////////////////////////////////
		const fs = require('fs');
		const path = require( 'path' );
		window.operatingSystems = {};

		// Iterate through every file in the BOX_CONFIGS_LOCATION
		fs.readdir(settings.BOX_CONFIGS_LOCATION, function( err, files ) {
			for(var i = 0; i < files.length; i++) {

				// If file is a directory, treat as a platform
				var platformDir = settings.BOX_CONFIGS_LOCATION + "/" + files[i];
				if(fs.lstatSync(platformDir).isDirectory()) { // load synchronously so the value of platformDir doesn't change
					// Generate option element for dropdown
					var platform       = document.createElement("option");
					var displayOption  = path.basename(platformDir).replace(/_/g," (") + ")"; // pretty it for display
					platform.innerHTML = displayOption;
					var platformCopy   = platform.cloneNode(true);
					// Insert option elements into dropdowns
					$('#platformSelect').prepend(platformCopy);
					$('#settingsPlatformSelect').prepend(platform);

					window.operatingSystems[displayOption] = {};

					// Load files in platform directory into window.operatingSystems
					fs.readdirSync(platformDir).forEach(function(packerConfig) {
						if(fs.lstatSync(platformDir + "/" + packerConfig).isFile()) {

							// Store contents of packer config file in window.operatingSystems
							var osName = path.parse(packerConfig).name.replace(/_/g, " "); // pretty it for display
							loadResourceSync(platformDir + "/" + packerConfig, function(contents) {
								window.operatingSystems[displayOption][osName] = JSON.parse(contents);
							});
						}
					});
				}
			}
		});


		//When the platform is changed in the drop-down, clears and repopulates os drop-down options
		function updateOsDropdown() {

			var platformDropdownID = $(this).attr('id');
			var osDropdownID = (platformDropdownID == "platformSelect") ? "osSelect" : "settingsOsSelect" ;

			Object.keys(window.operatingSystems).forEach(function(key, index){
				if($("#"+platformDropdownID+" option:selected").text()===key){
					$("#"+osDropdownID+" option").remove();
					Object.keys(window.operatingSystems[key]).forEach(function(subkey, index) {
						$('#'+osDropdownID).append($('<option>', {
							value: subkey,
							text : subkey
						}));
					});
				}
			});
		}

		$('.platform-select').change(updateOsDropdown); //updateOsDropdown is called in multiple places which is why it cannot just be an anonymous function

		//////////////////////////
		// Navbar Button Events //
		//////////////////////////

		$("#importEnvironmentButton").on('change', function(){
			// Access file
			var file = this.files[0];
			var reader = new FileReader();

			reader.onloadend = function(evt) {
				var result = JSON.parse(evt.currentTarget.result);
				window.boxes = result;

				render_machine_cards();
			}

			reader.readAsText(file);
		});

		$("#exportEnvironmentButton").on('click', function(){
			download(JSON.stringify(window.boxes, null, 2), "MyEnvironment.json", "application/json");
		});


		/////////////////////////
		// Modal Button Events //
		/////////////////////////

		$("#addButton").on('click', function(){
			if(check_all_add_fields_set(false)) {
				$('#optionsModal').modal('hide');
				add_box();
			} else {
				$('#optionsModal').modal('show');
			}
		});

		$("#saveButton").on('click', function(){
			if(check_all_add_fields_set(true)) {
				$('#settingsModal').modal('hide');
				save_edits();
			} else {
				$('#settingsModal').modal('show');
			}
		});


		//checks if name field is populated with valid content. If not, returns false and gives an alert, otherwise, returns true.
		function check_all_add_fields_set(settingsNotOptionsModal) {

			var nameBox;
			var stringToTest;

			if(typeof settingsNotOptionsModal === "boolean"){//handles if one of the modals
				nameBox = settingsNotOptionsModal ? "settingsMachineNameBox" : "machineNameBox" ;
				stringToTest = $("#"+nameBox+"").val();
			}
			else if(typeof settingsNotOptionsModal === "string"){ //handles for general string testing
				stringToTest = settingsNotOptionsModal;
			}
			else{
				console.log("Input to check_all_add_fields_set was not a string, nor boolean");
			}


			if(stringToTest === "") { //name not set
				alert("Please give your box a hostname!");
				return false;
			} else if(!isNaN(stringToTest)){
				alert('Your box hostname cannot be all numbers!')
				return false;
			}else if((window.boxes.map(value => value.name).includes(stringToTest))&&((nameBox === "settingsMachineNameBox") ? $("#settingsMachineNameBox").val() !== $("#settingsModal").data("currentMachName") : true)) {
				alert("Your box hostname cannot be the same as another box!");
				return false;
			}
			else if(stringToTest.indexOf(' ') >= 0){
				alert("Your box hostname cannot contain whitespace!");
				return false;
			}
			return true;
		}


		function render_machine_cards() {
			$('#card_well')[0].innerHTML = '<br><div class="row"><div class="card-deck"></div></div>'
			for(var i = 0; i < window.boxes.length; i++) {
					add_machine_card(i);
			}
		}
		// Adds a new machine to the environment, given a machine object
		// Does not add the machine to window.boxes
		function add_machine_card(index) {
			var machName = window.boxes[index]["name"];
			var plat     = window.boxes[index]["platform"];
			var os       = window.boxes[index]["os_version"];

			//Add new row if necessary
			if((index + 1) % 3 === 1 && index !== 1)
				$('#card_well')[0].innerHTML += '<br><div class="row"><div class="card-deck"></div></div>';

			if(plat.toLowerCase().includes('windows')) {
				var plat_label = '<span class="badge badge-info">Windows</span>';
			} else if(plat.toLowerCase().includes('linux')) {
				var plat_label = '<span class="badge badge-warning">Linux</span>';
			} else {
				var plat_label = '<span class="badge badge-success">'+plat+'</span>';
			}

			var os_label = '<p>' + os + '</p>';

			$($('#card_well').last().children().last().children().last())[0].innerHTML += `
			<div class="card" data-name="`+machName+`" data-platform = "`+plat+`" data-os = "`+os+`">
				<div class="card-body" style="">
					<div class = "container">
						 <div class="row">
							<div class="col">
								<h5 class="card-title" contenteditable="true">
									`+ machName +`
								</h5>
							</div>
							<div class="col-2">
								<a href="#" class="card-link btn btn-sm btn-info settingsButton" data-toggle="modal" data-target="#settingsModal" style="float:right;">
									<i class="material-icons md-48">
										settings
									</i>
								</a>
							</div>
						</div>
					</div>
					<p class="card-text">
						<table class="table">
							<tbody>
								<tr>
									<td>
										Platform:
									</td>
									<td>
										`+ plat_label +`
									</td>
								</tr>
								<tr>
									<td>
										Operating System:
									</td>
									<td>
										`+ os_label + `
									</td>
								</tr>
							</tbody>
						</table>
					</p>
				</div>
				<div class="card-footer">
					<a href="#" class="card-link btn btn-sm btn-success cloneButton">
						Clone
					</a>
					<a href="#" class="card-link btn btn-sm btn-danger removeButton">
						Remove
					</a>
				</div>
			</div>`;
 		}

		// uses data from selected modal to add a new machine to the environment
		function add_box() {
			var machName = $("#machineNameBox").val();
			var plat = $("#platformSelect option:selected").val();
			var os = $("#osSelect option:selected").val();

			var machine = {'name': machName, 'platform':plat, 'os_version':os};
			window.boxes.push(machine);
			render_machine_cards();

		}

		//saves data selected in modal to the current box and card being edited
		function save_edits(){

			////////////////////////////////////
			// Saves data from different tabs //
			////////////////////////////////////

			//Basic
			var oldMachName = $("#settingsModal").data("currentMachName");
			var newMachName = $("#settingsMachineNameBox").val();
			var plat = $("#settingsPlatformSelect option:selected").val();
			var os = $("#settingsOsSelect option:selected").val();
			//find the right box and change the content in it
			var machToEditIndex;
			$.each(window.boxes, function(index, value){
				if(oldMachName === value.name){
					machToEditIndex = index;
					return false;
				}
			});
			window.boxes[machToEditIndex]["name"] = newMachName;
			window.boxes[machToEditIndex]["platform"] = plat;
			window.boxes[machToEditIndex]["os_version"] = os;
			render_machine_cards();


		}

		///////////////////////////////
		// Machine card interactions //
		///////////////////////////////



		// Quick Rename By Clicking Name
		$('#card_well').on('blur', '.card-title', function(event){
			var titleElement = $(event.currentTarget);
			var oldMachName = titleElement.closest(".card").data("name");
			var newMachName = titleElement.text();

			if(check_all_add_fields_set(newMachName)){
				titleElement.closest('.card').data("name", titleElement.text());

				//find the right box and change the content in it
				var machToEditIndex;
				console.log(oldMachName);
				$.each(window.boxes, function(index, value){
					if(oldMachName === value.name){
						machToEditIndex = index;
						return false;
					}
				});
				console.log(window.boxes[machToEditIndex]);
				window.boxes[machToEditIndex]["name"] = newMachName;
			}
			else{
				//timeout prevents focus from activating simultaneously with the alert popping up and trapping you in a loop of eternal alerts
				setTimeout(function(){
					titleElement.focus();
				}, 0);
			}
		});

		// Remove Button
		$('#card_well').on('click', '.removeButton', function(event){   			//must use  $('#card_well').on('click', '.removeButton', function(event){ instead of $('.removeButton').on('click', function(event){ because you can only directly target elements that exist when the script it initially executed
			var machToRemoveName = $(event.currentTarget).closest('.card').data("name");
			if(confirm("Are you sure you want to remove "+machToRemoveName+"?")){
				var machToRemoveIndex;
				$.each(window.boxes, function(index, value){
					if(machToRemoveName === value.name){
						machToRemoveIndex = index;
						return false;
					}
				});
				window.boxes.splice(machToRemoveIndex, 1);

				render_machine_cards();
			}
		});

		// Settings Button
		$('#card_well').on('click', '.settingsButton', function(event) {
			var machName = $(event.currentTarget).closest('.card').data("name");
			var machPlat = $(event.currentTarget).closest('.card').data("platform");
			var machOs = $(event.currentTarget).closest('.card').data("os");

			$('#settingsMachineNameBox').val(machName);
			$('#settingsPlatformSelect').val(machPlat);

			$('#settingsPlatformSelect').trigger('change');
			$('#settingsOsSelect').val(machOs);

			$('#settingsModalTitle').text(machName+" - Settings");

			$('#settingsModal').data("currentMachName", machName);
			$('#settingsModal').data("currentMachPlat", machPlat);
			$('#settingsModal').data("currentMachOs", machOs);
		});

		// Clone Button
		$('#card_well').on('click', '.cloneButton', function(event){
			var machToCloneName	= $(event.currentTarget).closest('.card').data("name");
			var machToCloneIndex;
			$.each(window.boxes, function(index, value){
				if(machToCloneName === value.name){
					machToCloneIndex = index;
					return false;
				}
			});

			// Use JSON parsing as a copy constructor
			var clonedObject = JSON.parse(JSON.stringify(window.boxes[machToCloneIndex]));

			// Keep multiple clones of the same machine from sharing a name
			var nameOfCloned = window.boxes[machToCloneIndex]["name"];
			var counter = 0;
			var cloneAlreadyExists = true;
			while(cloneAlreadyExists){
				counter++;
				cloneAlreadyExists = false;
				$.each(window.boxes, function(index, value){
					if("Clone_"+counter+"_of_"+nameOfCloned === value.name){
						cloneAlreadyExists = true;
						return false;// breaks out of the itteratator to save resources
					}
				});
			}
			clonedObject["name"] ="Clone_"+counter+"_of_"+nameOfCloned;

			window.boxes.push(clonedObject);

			render_machine_cards();
		});


		//clears name text box in the options modal
		$("#addNewMachineButton").on('click', function(){
			$("#machineNameBox").val('');
			$('#platformSelect').trigger('change');
		});

		//focuses on the textbox when a modal pops up
		$('.modal').on('shown.bs.modal', function () {
			$('.form-control').focus();
		});

});
