app.service('AdminLeaveDetailsService', ['utilityService',        
	function (utilityService) {
		'use strict';

        this.url = {
            employee: 'user-addition/all-user-with-permission',
            leaveDetails: 'admin-frontend/leave/request',
            cancelRequestLeave : 'admin-frontend/cancel/future-leave',
            //leaveDetails: 'employee/leave/request'
        };        
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
        };
        this.buildBulkRegularizationObject = function () {
            return {
                list: [],
                filteredList: [],
                visible: false,
                propertyName: '',
                reverse: false,
                employee_id: null,
                permission: 'can_view_requested_leaves',
                //timesheetList: [],
                //timesheetVisible: false,
            };
        };                
    }
]);