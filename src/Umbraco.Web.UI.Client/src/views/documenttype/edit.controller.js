/**
 * @ngdoc controller
 * @name Umbraco.Editors.DocumentType.EditController
 * @function
 *
 * @description
 * The controller for the content type editor
 */
function DocumentTypeEditController($scope, $rootScope, $routeParams, $log, contentTypeResource, dataTypeResource) {
	$scope.page = {action: [], menu: [] };
	
	$rootScope.emptySection = true; 
	$scope.$hidePreview = false;

	contentTypeResource.getById($routeParams.id).then(function(dt){
		$scope.contentType = dt;
		$scope.currentTab = dt.groups[0];

		$scope.showSettings(dt);
	});

	//hacking datatypes and their icons
	dataTypeResource.getAll().then(function(data){

		var favs = ["Textstring", "Media Picker", "Image Cropper", "List View - Content", "Date Picker", "Richtext editor"];
		$scope.favs = [];

		$scope.allDataTypes = data;

		data = _.groupBy(data, function(dt){ 
			dt.icon = "icon-autofill";

			//fav list
			if(favs.indexOf(dt.name) >= 0){
				$scope.favs.push(dt);
			}

			if(dt.name.indexOf("Dropdown") > -1 || dt.name.indexOf("Checkbox") > -1){
				dt.icon = "icon-bulleted-list";
				return "Lists";
			}

			if(dt.name.indexOf("Grid") > -1 || dt.name.indexOf("List View") > -1){
				dt.icon = "icon-item-arrangement";
				return "Collections";
			}



			if(dt.name.indexOf("Picker") > -1){
				dt.icon ="icon-hand-pointer-alt"
				
				if(dt.name.indexOf("Date") > -1){
					dt.icon =" icon-calendar"
				}

				return "Pickers";
			}

			if(dt.name.indexOf("Media") > -1 || dt.name.indexOf("Upload") > -1 || dt.name.indexOf("Crop") > -1){
				dt.icon ="icon-picture"
				return "Media";
			}

			return "Fields";				
		});

		$scope.dataTypes = data;
	});

	$scope.actions = [{name: "Structure", cssClass: "list"},{name: "Structure", cssClass: "list"},{name: "Structure", cssClass: "list"}];


	$scope.showSettings = function(ct){
		$scope.dialogModel = {};
		$scope.dialogModel.title = "Doctype stuff";
		$scope.dialogModel.contentType = ct;
		$scope.dialogModel.view = "views/documentType/dialogs/contentType.html";
	};


	$scope.editIcon = function(ct){
		$scope.dialogModel = {};
		$scope.dialogModel.title = "Add property type";
		$scope.dialogModel.datatypes = $scope.dataTypes;

		$scope.dialogModel.addNew = true;
		$scope.dialogModel.view = "views/common/dialogs/iconpicker.html";

		$scope.dialogModel.submit = function(icon){
			ct.icon = icon;
			$scope.showSettings();
		};	
	};



	$scope.editProperty = function(property){
		$scope.dialogModel = {};
		$scope.dialogModel.title = property.label;
		$scope.dialogModel.property = property;
		$scope.dialogModel.dataTypes = $scope.dataTypes;
		
		//$scope.dialogModel.prevals = createPreValueProps($scope.dialogModel.dataType.preValues);
		$scope.dialogModel.view = "views/documentType/dialogs/property.html";

		dataTypeResource.getById(property.dataType)
        	.then(function(data) {
        		$scope.dialogModel.meh = data;
        	});


		$scope.dialogModel.changeType = function(dt){
			contentTypeResource.getPropertyTypeScaffold(dt.id)
				.then(function(pt){
					property.config = pt.config;
					property.editor = pt.editor;
					property.view = pt.view;
					$scope.dialogModel = null;
				});	
		};
	};



	$scope.addItems = function(tab){
		$scope.dialogModel = {};
		$scope.dialogModel.title = "Add fields";
		$scope.dialogModel.dataTypes = $scope.dataTypes;
		$scope.dialogModel.favs = $scope.favs;
		$scope.dialogModel.view = "views/documentType/dialogs/dataTypes.html";

		var target = tab;
		if(tab.groups && tab.groups.length > 0){
			target = _.last(tab.groups);
		}

		$scope.dialogModel.close = function(model){
			$scope.showSettings();
		};

		$scope.dialogModel.submit = function(dt){
			contentTypeResource.getPropertyTypeScaffold(dt.id).then(function(pt){
				pt.label = dt.name +" field";
				pt.dataType = dt.id; 

				target.properties.push(pt);
			});
		};

		$scope.dialogModel.addGroup = function(){
			var newGroup = {name: "New fieldset", properties:[]};
			tab.groups.push(newGroup);
			target = newGroup;
		};
	};

	$scope.addTab = function(groups){
		var newTab = {name: "New tab", properties:[], groups:[]};
		groups.push(newTab);
		$scope.currentTab = newTab;
	};

	$scope.selectTab = function(tab){
		$scope.currentTab = tab;
	};

	

	$scope.toggleGroupSize = function(group){
		if(group.columns !== 12){
			group.columns = 12;
		}else{
			group.columns = 6;
		}
	};

	

	function createPreValueProps(preVals) {
        var preValues = [];
        for (var i = 0; i < preVals.length; i++) {
            $scope.preValues.push({
                hideLabel: preVals[i].hideLabel,
                alias: preVals[i].key,
                description: preVals[i].description,
                label: preVals[i].label,
                view: preVals[i].view,
                value: preVals[i].value
            });
        }

        return preValues;
    }




	$scope.sortableOptionsFieldset = {
		distance: 10,
		revert: true,
		tolerance: "pointer",
		opacity: 0.7,
		scroll:true,
		cursor:"move",
		placeholder: "ui-sortable-placeholder",
		connectWith: ".edt-tabs",
		handle: ".handle",
		zIndex: 6000,
		start: function (e, ui) {
           	ui.placeholder.addClass( ui.item.attr("class") );
        },
        stop: function(e, ui){
         	ui.placeholder.remove();
        }
	};


	$scope.sortableOptionsEditor = {
		distance: 10,
		revert: true,
		tolerance: "pointer",
		connectWith: ".edt-props-sortable",
		opacity: 0.7,
		scroll:true,
		cursor:"move",
		handle: ".handle",
		placeholder: "ui-sortable-placeholder",
		zIndex: 6000
	};

	$scope.sortableOptionsTab = {
		distance: 10,
		revert: true,
		tolerance: "pointer",
		opacity: 0.7,
		scroll:true,
		cursor:"move",
		placeholder: "ui-sortable-placeholder",
		zIndex: 6000,
		handle: ".handle"
	};
            
}

angular.module("umbraco").controller("Umbraco.Editors.DocumentType.EditController", DocumentTypeEditController);
