app.service('OnBoardingTaskService', ['utilityService',        
	function (utilityService) {
		'use strict';

        this.url = {	   
    	    onboarding: 'onboarding/tasks/list',
            finalTask: 'onboarding/finalize',
            form : 'user-management/form?status=true',
            document :'user-management/document?status=true',
            provision: 'provisions/settings',
            //getEmployee: 'user-addition/all-user?status=true',
            getEmployee: 'user-addition/users-preview',
            task : 'onboarding/save-detail',
            letters: 'letters/types-with-templates/{onboarding}',
            getProvisionType: 'provisions/settings',
            onGrid: 'ongrid/plans?status=true'
        };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
        };
        
		return this;
	}
]);