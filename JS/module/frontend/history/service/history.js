app.service('HistoryService', ['$interpolate',        
	function ($interpolate) {
		'use strict';

        this.url = {	   
            getEmployee: 'admin-frontend/employee-history',
            getOtherEmpHistory:'employee/history'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.historyTypeMapping = function () {
            return {
				joining_date: {
					text:'Joined',
					icon:'add'
				},  
				profile_pic: {
					text:'Updated Profile Picture',
					icon:'person_add'
				},  
				status_changed: {
					text: $interpolate('Changed Status {{item.status}}'),
					icon:'cached'
				},  
				exit_initiated: {
					text:'Exit Initiated',
					icon:'cancel'
				},  
				exit_revoked: {
					text:'Exit Revoked',
					icon:'cancel'
				},
				exit_relieved: {
                    text:'Relieved',
                    icon:'cancel'
                }
            };
        };
    }
]);

