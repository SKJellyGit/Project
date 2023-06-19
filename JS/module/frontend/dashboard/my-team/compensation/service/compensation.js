app.service('ManagerCompensationService', [
	'utilityService',        
	function (utilityService) {
		'use strict';

        this.url = {
        	list: 'myteam/compensation',
        	duration: 'employee-salary/revised-date-list',
        	breakup: 'myteam/ctc-component',
        	incrementalSalary: 'myteam/salary-detail'
        };
        this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildCompensationObject = function() {
	    	return {
	    		breakup: {
	    			list: [],
	    			type: null,
	    			empId: null
	    		},
	    		appraisal: {
	    			list: [],
	    			current: null,
	    			graph: [],
	    			categories: [],
	    			visible: false
	    		},
	    		grossBreakup: [],	    		
	    		list: [],
	    		propertyName: 'name',
	    		reverse: false,
	    		monthList: utilityService.buildMonthList(),
	    		visible: false
	    	}
	    };
	    
	    return this;
	}
]);