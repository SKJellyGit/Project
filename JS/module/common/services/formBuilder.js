app.service('formBuilderService', [
	'utilityService',        
	function (utilityService) {
		'use strict';

	    this.url = {
	    	question: 'data/question.json',
	    	form: 'formbuilder/form',
	    	ques: 'formbuilder/question',
	    	workflowDetails: 'formbuilder/form?key=workflow',
	    	changestatus: 'formbuilder/form/changestatus'
	    };	    
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };	 
	    this.buildFormModel = function(model, module) {
	    	return {
	    		_id: utilityService.getValue(model, '_id'),
	    		name: utilityService.getValue(model, 'name'),
	    		description: utilityService.getValue(model, 'description'),
	    		module_key: utilityService.getValue(module, 'name'),
	    		exit_type: utilityService.getValue(module, 'type'),
	    		submodule: utilityService.getValue(module, 'submodule'),
	    		formType: utilityService.getValue(module, 'formType'),
	    		is_comment_mandatory: utilityService.getValue(model, 'is_comment_mandatory', false)
	    	}
	    };
	    this.buildFormPayload = function(model, isWorkflow) {
	    	isWorkflow = angular.isDefined(isWorkflow) ? isWorkflow : false;
	    	var payload = {
	    		name: model.name,
	    		description: model.description,
	    		module_key: model.module_key
	    	};
            if(payload.module_key == 'employee_exit'){
                payload.exit_type = model.exit_type;
            }
            if(payload.module_key == 'appraisal'){
                payload.type = parseInt(model.formType);
                payload.is_scratch = 1;
                payload.is_mandatory = false;
            }
            if(model.submodule == "request-form") {
            	payload.form_type = model.formType;
            }
            if(isWorkflow) {
            	payload.is_comment_mandatory =  model.is_comment_mandatory;
            }
            
	    	return payload;
	    };
	    /*this.buildWorkFlowFormModel = function(model, module) {
	    	console.log(module);
	    	return {
	    		_id: utilityService.getValue(model, '_id'),
	    		name: utilityService.getValue(model, 'name'),
	    		description: utilityService.getValue(model, 'description'),
	    		module_key: utilityService.getValue(module, 'module_key'),
	    		wf_form_type: utilityService.getValue(module, 'wf_form_type'),
	    		is_comment_required: utilityService.getValue(module, 'is_comment_required'),
	    		is_notify_required: utilityService.getValue(module, 'is_notify_required')
	    	}
	    };
	    this.buildWorkFlowFormPayload = function(model) {
	    	console.log(model);
	    	return {
	    		name: model.name,
	    		description: model.description,
	    		form_type: model.formType
	    	}
	    };*/
	    this.getOptionsObject = function(model) {
	    	var options = [];
	    	angular.forEach(model.options, function(value, key) {
				var id = angular.isObject(value._id) ? value._id.$id : null;
				if(id != null ) {
					var obj = {
						name : value.name,
						_id : id
					}
				} else {
					var obj = value.name
				}
	    		options.push(obj);
	    	});
	    	return options;
	    };
	    this.buildParentOption = function(list) {
	    	var parentOption = [];
	    	angular.forEach(list, function(value, key) {
	    		if(angular.isObject(value)) {
	    			value = JSON.parse(value);
	    			parentOption.push(value.$id);
	    		} else {
	    			parentOption.push(value);
	    		}
	    	});
	    	return parentOption;
	    };
	    this.buildQuestionPayload = function(model, module) {
	    	var payload = { 
				form_id : module.form,
				header:  utilityService.getValue(model, 'header'),
	    		question : model.question, 
	    		description : model.description, 
	    		question_type: parseInt(model.question_type),
	    		isMandatory : model.isMandatory, 
	    		isConditional : model.isConditional
	    	};
	    	if(utilityService.getValue(module, 'form')) {
	    		payload.form_id = utilityService.getValue(module, 'form');
	    	}
	    	if(utilityService.getValue(module, 'template')) {
	    		payload.template_id = utilityService.getValue(module, 'template');
	    	}

	    	if(model.isConditional) {
	    		payload.parent_qus_id = model.parentQuestion;
	    		payload.parent_option_id = this.buildParentOption(model.parentOption);
	    	}
	    	if(model.question_type == 2 || model.question_type == 3 || model.question_type == 4) {
	    		payload.options = this.getOptionsObject(model);
	    	}
	    	if(model.question_type == 1) {
	    		payload.isValidation = model.isValidation;
	    		if(payload.isValidation) {
	    			payload.datatype = model.datatype;
	    			payload.min_limit = model.min_limit;
	    			payload.max_limit = model.max_limit;
	    			payload.isSpecCharAllowed = utilityService.getValue(model, 'isSpecCharAllowed', false);
	    		}
			}
			
			if(module.formSlug=='poll' || module.formSlug=='survey')
			{
				payload.isMandatory=true
			}

	    	return payload;
	    };
	    this.buildOptionnObject = function(item) {
       		return {
				name: "Option" + (item.options.length + 1)
			}
       	};	
       	this.buildQuestionObject = function(module_key) {
       		return {
				"_id": null,
				"header": null,
				"question": null,
				"description": null,
				"question_type": angular.isDefined(module_key) && module_key == 'appraisal' ? 2 : 1,
				"isDescription": false,
				"isValidation": false,		    		
				"isMandatory": true,
				"isConditional": false,
				"parentQuestion": null,
				"parentOption": null,
				"options": [
					{
						"_id": null,
						"name": "Option1"
					},
					{
						"_id": null,
						"name": "Option2"
					}
				]
			}
       	};
       	this.buildValidationObject = function() {
       		return {
                dataType: 1,
                min: null,
                max: null,
                isSpecCharAllowed: false
            }
       	};
       	this.buildDataTypeList = function() {
	    	return [
	    		{
		            value: 1,
		            label: "Text"
		        },
		        {
		            value: 2,
		            label: "Number"
		        },
		        {
		            value: 3,
		            label: "Alpha Numeric"
		        }
	    	]
	    };
	    this.buildRowObject = function() {
	    	return {
	            selectedIndex: -1
	        }
	    };
	    this.buildModuleHashMap = function() {
	    	return {
	    		workflow: "work-flow",
	    		employee_exit: "exit-formalities",
	    		user_management: "user-management",
	    		appraisal: "user-management",
	    	}
		};
		this.buildQuestionTypeCountMappingObject = function () {
			return {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
				6: 0,
				9: 0, 
				10: 0,
				11: 0,
				12: 0,
				13: 0,
				14: 0,
				15: 0,
				16: 0
			};
		};
	}
]);