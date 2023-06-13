app.service('templateService', [
	'utilityService', '$sce', 'TEMPLATE_BUILDER',      
	function (utilityService, $sce, TEMPLATE_BUILDER) {
		'use strict';

	    this.url = {	    	
	    	certificate: 'certificate/template',
	    	appointment: 'appointment/template',
	    	offer: 'offer/template',
            revoke: 'revoke/template',
            templets:'letters/templates',
            letter:'letter/type/template',
            changeStatus:'letter/type/template/changestatus',
        	copyTemplate: 'letter/type/template/copy'
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };	
	    this.buildTemplateAction = function() {
	    	return {
	            add: false,
	            edit: false
	        }
	    };
	    this.buildModalHashMap = function() {
	    	return {
	            builder: {
	            	add_edit_template: 'add-edit-template'
	            }
	        }
	    };
	    this.buildTemplateModel = function(model, templateType) {
			return {
	    		_id: utilityService.getValue(model, '_id'),
	    		title: utilityService.getValue(model, 'title'),
	    		template_type: utilityService.getValue(model, 'template_type', templateType),
	    		certificate_id: utilityService.getValue(model, 'certificate_id')
	    	}
	    };
	    this.buildTemplatePayload = function(model,lndId) {
	    	var payload = {
	    		title: model.title,
				template_type: model.template_type
	    	};
//	    	if(model.template_type == TEMPLATE_BUILDER.map.certificate.type) {
//	    		payload.certificate_id = model.certificate_id;
//	    	}
	    	return payload;
		};
		
		this.buildLndTemplatePayload=function (model,lndId) {
			var payload = {
	    		title: model.title,
				template_type: model.template_type,
				training_type_id:lndId
	    	};
 
	    	return payload;
		}
	}
]);