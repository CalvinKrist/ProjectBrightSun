$(function(){ //shorthand for $(document).ready(function(){...});

		window.boxes=[];
		var osSelect = $('#osSelect');
		var osWindows64Array = ["windows_7", "windows_81", "windows_10", "windows_server_2008_r2", "windows_server_2012_r2", "windows_server_2016"];
		var osLinux64Array = ["ubuntu_1404", "ubuntu_1404_desktop", "ubuntu_1604", "ubuntu_1604_desktop", "ubuntu_1710", "ubuntu_1710_desktop"];
		var osLinux32Array = ["ubuntu_1404_i386", "ubuntu_1604_i386", "ubuntu_1710_i386"];
		
		
		//populates options modal os drop-down with windows options when options modal is 
		//created since windows is the default selected platform
		$.each(osWindows64Array, function (i, item) {
			$('#osSelect').append($('<option>', { 
				value: item,
				text : item
			}));
		});
		
		
		//options-modal: When the platform is changed in the drop-down, clears and repopulates os drop-down options
		$('#platformSelect').change(function() {
			if($( "#platformSelect option:selected" ).val() !== 'default'){
				osSelect.removeAttr('disabled');
				if($("#platformSelect option:selected").val()==="windows_x64"){
					$("#osSelect option").remove();
					$.each(osWindows64Array, function (i, item) {
						$('#osSelect').append($('<option>', { 
							value: item,
							text : item
						}));
					});
				} else if($("#platformSelect option:selected").val()==="linux_x64"){
				$("#osSelect option").remove();
					$.each(osLinux64Array, function (i, item) {
						$('#osSelect').append($('<option>', { 
							value: item,
							text : item
						}));
					});
				} else if($("#platformSelect option:selected").val()==="linux_x32"){
				$("#osSelect option").remove();
					$.each(osLinux32Array, function (i, item) {
						$('#osSelect').append($('<option>', { 
							value: item,
							text : item
						}));
					});
				}
			}
			else{
				// not functional should reset selection when dropdown is disabled $('#defaultOs').attr('selected','selected').siblings().removeAttr('selected');
				osSelect.attr('disabled','disabled');
			}
		});
		
		//Duplicate of the above - clean up in future
		//edit-modal: When the platform is changed in the drop-down, clears and repopulates os drop-down options

		function updateOsDropdown(){	
			if($( "#editPlatformSelect option:selected" ).val() !== 'default'){
				osSelect.removeAttr('disabled');
				if($("#editPlatformSelect option:selected").val()==="windows_x64"){
					$("#editOsSelect option").remove();
					$.each(osWindows64Array, function (i, item) {
						$('#editOsSelect').append($('<option>', { 
							value: item,
							text : item
						}));
					});
				} else if($("#editPlatformSelect option:selected").val()==="linux_x64"){
				$("#editOsSelect option").remove();
					$.each(osLinux64Array, function (i, item) {
						$('#editOsSelect').append($('<option>', { 
							value: item,
							text : item
						}));
					});
				} else if($("#editPlatformSelect option:selected").val()==="linux_x32"){
				$("#editOsSelect option").remove();
					$.each(osLinux32Array, function (i, item) {
						$('#editOsSelect').append($('<option>', { 
							value: item,
							text : item
						}));
					});
				}
			}
			else{
				// not functional should reset selection when dropdown is disabled $('#defaultOs').attr('selected','selected').siblings().removeAttr('selected');
				osSelect.attr('disabled','disabled');
			}
		}
		$('#editPlatformSelect').change(updateOsDropdown);
				
		
		//When "add" button on modal is clicked, checks if all fields are populated. If not,
		//gives a warning saying to do so and lets you return to the modal to try again. 
		//If so, hides the modal and calls the add_box() function
		$("#addButton").on('click', function(){
			if(check_all_add_fields_set()) {
				$('#optionsModal').modal('hide');
				add_box();
			} else {
				$('#optionsModal').modal('show');
			}
		});
		
		//When "Save Edits" button on edit modal is clicked, checks if all fields are populated. If not,
		//gives a warning saying to do so and lets you return to the modal to try again. 
		//If so, hides the modal and calls the save_edits() function
		$("#saveEditsButton").on('click', function(){
			if(edit_check_all_add_fields_set()) {
				$('#editModal').modal('hide');
				save_edits();
			} else {
				$('#editModal').modal('show');
			}
		});
		
		
		//checks if name field is populated with valid content. If not, returns false and gives an alert, otherwise, returns true.
		function check_all_add_fields_set() {
			if($("#machineNameBox").val() === "") { //name not set
				alert("Please give your box a hostname!");
				return false;
			} else if(window.boxes.map(value => value.name).includes($("#machineNameBox").val())) {
				alert("Your box hostname cannot be the same as another box!");
				return false;
			}
			else if($("#machineNameBox").val().indexOf(' ') >= 0){
				alert("Your box hostname cannot contain whitespace!");
				return false;
			}
			return true;
		}
		
		//Duplicate of the above - clean up in future 
		//edit-modal- checks if name field is populated with valid content. If not, returns false and gives an alert, otherwise, returns true.
		function edit_check_all_add_fields_set() {
			if($("#editMachineNameBox").val() === "") { //name not set
				alert("Please give your box a hostname!");
				return false;
			} else if($("#editMachineNameBox").val() !== $("#editModal").data("currentMachName") && window.boxes.map(value => value.name).includes($("#editMachineNameBox").val())) {
				alert("Your box hostname cannot be the same as another box!");
				return false;
			}
			else if($("#editMachineNameBox").val().indexOf(' ') >= 0){
				alert("Your box hostname cannot contain whitespace!");
				return false;
			}
			return true;
		}
		
		
		//adds data selected in modal to a box for later download
		function add_box() {
			var machName = $("#machineNameBox").val();
			var plat = $("#platformSelect option:selected").val();
			var os = $("#osSelect option:selected").val();
			
			
			window.boxes.push({'name': machName, 'platform':plat, 'os_version':os});
			
			if(window.boxes.length === 0) {
				$('#no_box_text').show();
			} else {
				$('#no_box_text').hide();
			}
			
			//Add card to page
			if(window.boxes.length % 3 === 1 && window.boxes.length !== 0) { //add new row
				$('#card_well')[0].innerHTML += '<br><div class="row"><div class="card-deck"></div></div>';
			}
			
			if(plat.includes('windows')) {
				var plat_label = '<span class="badge badge-info">Windows</span>';
			} else if(plat.includes('linux')) {
				var plat_label = '<span class="badge badge-warning">Linux</span>';
			} else {
			}
			
			var os_label = '<p>' + os + '</p>';
			
			$($('#card_well').last().children().last().children().last())[0].innerHTML += '<div class="card" data-name="'+machName+'" data-platform = "'+plat+'" data-os = "'+os+'"><div class="card-body"><h5 class="card-title">' + machName + '</h5><p class="card-text"><table class="table"><tbody><tr><td>Platform:</td><td>' + plat_label + '</td></tr><tr><td>Operating System:</td><td>' + os_label + '</td></tr></table></p></div><div class="card-footer"><a href="#" class="card-link btn btn-sm btn-info editButton" data-toggle="modal" data-target="#editModal">Edit</a><a href="#" class="card-link btn btn-sm btn-danger removeButton">Remove</a></div></div>';
		}
		
		//saves data selected in modal to the current box and card being edited
		function save_edits(){
			var oldMachName = $("#editModal").data("currentMachName");
			var newMachName = $("#editMachineNameBox").val();
			var plat = $("#editPlatformSelect option:selected").val();
			var os = $("#editOsSelect option:selected").val();

			
			//find the right box and change the content in it
			
			var machToEditIndex;
			$.each(window.boxes, function(index, value){
				if(oldMachName === value.name){
					machToEditIndex = index;
					return false;
				}
			});
	
			window.boxes[machToEditIndex].name = newMachName;
			window.boxes[machToEditIndex].platform = plat;
			window.boxes[machToEditIndex].os_version = os;
		
			console.log(machToEditIndex+"\n"+window.boxes[machToEditIndex].name+"\n"+window.boxes[machToEditIndex].platform+"\n"+window.boxes[machToEditIndex].os_version);
			
			
		var currentCard = $('#card_well').find('div[data-name]').filter(function(){
				return $(this).data('name') === oldMachName;
		});//theoretically this should be doable with $('#card_well').find('div[data-name = oldMachName]') but that was returning undefined
		
		currentCard.data('name', newMachName);
		currentCard.data('platform', plat);
		currentCard.data('os', os);
		console.log(currentCard.data('name')+ "  "+ newMachName);
		//oddly enough, these return the same thing so it is setting it correctly, 
		//but when the HTML is logged, it says that the cards still have their original data
		//weirder than that is the fact that the edit modal gets its contents from the card data
		//and it functions as if the card data was successfully changed....
		//identify what is going on here before it causes a problem....
		/*
		
		DD      OO    N   N  TTTTTTT        IIIII    GG    N   N    OO    RRR    EEEE
		D  D   O  O   NN  N     T             I     G      NN  N   O  O   R  R   E
		D  D   O  O   N N N     T             I     G  G   N N N   O  O   RRR    EEEE
		D  D   O  O   N  NN     T             I     G  G   N  NN   O  O   R  R   E
		DD      OO    N   N     T           IIIII    GG    N   N    OO    R  R   EEEE 
		
		*/
		
		if(plat.includes('windows')) {
				var plat_label = '<span class="badge badge-info">Windows</span>';
			} else if(plat.includes('linux')) {
				var plat_label = '<span class="badge badge-warning">Linux</span>';
			} else {
			}
			
			var os_label = '<p>' + os + '</p>';
		
		currentCard[0].innerHTML = '<div class="card-body"><h5 class="card-title">' + newMachName + '</h5><p class="card-text"><table class="table"><tbody><tr><td>Platform:</td><td>' + plat_label + '</td></tr><tr><td>Operating System:</td><td>' + os_label + '</td></tr></table></p></div><div class="card-footer"><a href="#" class="card-link btn btn-sm btn-info editButton" data-toggle="modal" data-target="#editModal">Edit</a><a href="#" class="card-link btn btn-sm btn-danger removeButton">Remove</a></div>';
		console.log(currentCard.parent()[0].innerHTML);
		}
		
		
		//removes the object represented by the card from window.boxes then removes the card from the GUI
		$('#card_well').on('click', '.removeButton', function(event){   			//must use  $('#card_well').on('click', '.removeButton', function(event){ instead of $('.removeButton').on('click', function(event){ because you can only directly target elements that exist when the script it initially executed

			var machToRemoveName = $(event.currentTarget).closest('.card').data("name");
			var machToRemoveIndex;
			$.each(window.boxes, function(index, value){
				if(machToRemoveName === value.name){
					machToRemoveIndex = index;
					return false;
				}
			});
			window.boxes.splice(machToRemoveIndex, 1);
			
			$(event.currentTarget).closest(".card").remove();
		});
		
		
		$('#card_well').on('click', '.editButton', function(event){
			var machName = $(event.currentTarget).closest('.card').data("name");
			var machPlat = $(event.currentTarget).closest('.card').data("platform");
			var machOs = $(event.currentTarget).closest('.card').data("os");

			$('#editMachineNameBox').val(machName);
			$('#editPlatformSelect').val(machPlat);
			updateOsDropdown();
			$('#editOsSelect').val(machOs);
			
			$('#editModal').data("currentMachName", machName);
			$('#editModal').data("currentMachPlat", machPlat);
			$('#editModal').data("currentMachOs", machOs);
		});
		
		
		//clears name text box in the options modal
		$("#addNewMachineButton").on('click', function(){
			$("#machineNameBox").val('');
		});

});