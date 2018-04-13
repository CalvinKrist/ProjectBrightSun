$(function(){ //shorthand for $(document).ready(function(){...});

		window.boxes=[];
		var osSelect = $('#osSelect');
		var osWindows64Array = ["windows_7", "windows_81", "windows_10", "windows_server_2008_r2", "windows_server_2012_r2", "windows_server_2016"];
		var osLinux64Array = ["ubuntu_1404", "ubuntu_1404_desktop", "ubuntu_1604", "ubuntu_1604_desktop", "ubuntu_1710", "ubuntu_1710_desktop"];
		var osLinux32Array = ["ubuntu_1404_i386", "ubuntu_1604_i386", "ubuntu_1710_i386"];
		
		
		//populates modal os drop-down with windows options when modal is 
		//created since windows is the default selected platform
		$.each(osWindows64Array, function (i, item) {
			$('#osSelect').append($('<option>', { 
				value: item,
				text : item
			}));
		});
		
		
		//When the platform is changed in the drop-down, clears and repopulates os drop-down options
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
		
		
		//checks if name field is populated with valid content. If not, returns false and gives an alert, otherwise, returns true.
		function check_all_add_fields_set() {
			if($("#machineNameBox").val() === "") { //name not set
				alert("Please give your box a hostname!");
				return false;
			} else if(window.boxes.map(value => value.name).includes($("#machineNameBox").val())) {
				alert("Your box hostname cannot be the same as another box!");
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
			
			$($('#card_well').last().children().last().children().last())[0].innerHTML += '<div class="card"><div class="card-body"><h5 class="card-title">' + machName + '</h5><p class="card-text"><table class="table"><tbody><tr><td>Platform:</td><td>' + plat_label + '</td></tr><tr><td>Operating System:</td><td>' + os_label + '</td></tr></table></p></div><div class="card-footer"><a href="#" class="card-link btn btn-sm btn-info">Edit</a><a href="#" class="card-link btn btn-sm btn-danger removeButton">Remove</a></div></div>';
		}
		
		
		//below is the not (not yet working) foundation for card removal
		var i =1;
		$(".removeButton").on('mouseenter', function(event){
			console.log(i);
			i++;
			console.log($(event.currentTarget).closest(".card-title").text());
		});
		
		
		//clears name text box in the modal
		$("#addNewMachineButton").on('click', function(){
			$("#machineNameBox").val('');
		});

});