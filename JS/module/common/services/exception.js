app.service('exceptionService', [
	'ServerUtilityService', 'utilityService',        
	function (ServerUtilityService, utilityService) {
		'use strict';

	    this.url = {
	    	applicability: 'relevance/applicability',
	    	field: 'plan-allocation/fields',
	    	grplst: 'user-management/group',
	    	exception: 'user-management/exception'
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildExceptionAction = function() {
	    	return {
	            add: false,
	            edit: false,
	            view: false
	        }
	    };
	    this.buildDefaultFilterObject = function(groupList) {
	    	return {
	            type: null,
	            value: null,
	            className: 1,
	            groups: groupList,
	            elements: []
	        }
	    };
	    this.buildFilters = function(groupList) {
	    	var filters = [];
	    	filters.push(this.buildDefaultFilterObject(groupList));
	    	return filters;
	    };
	    this.buildExceptionModel = function(model, elementId, isApply, exceptionModule) {
	    	return {
	    		_id: utilityService.getValue(model, '_id'),
	    		apply: isApply,
	    		applicability: null,
	    		elements: [],	    		                
                module: utilityService.getValue(exceptionModule, 'name'),
                plan: elementId,                
                applyNew: true
            }
	    };
	    this.buildConditionObject = function(filters) {
	    	var conditions = {};
	    	angular.forEach(filters, function(v, k) {
	    		conditions[v.type] = v.value;
	    	});
	    	return conditions;
	    };
        this.bulidExceptionPayload = function(filters) {
            var payload = {
            	conditions: JSON.stringify(this.buildConditionObject(filters))
            };
            return payload;
		};
		this.buildOverwriteExceptionPayload = function(companyWide) {
			return { 
				element_ids: companyWide.element_ids
			}
		};
	}
]);