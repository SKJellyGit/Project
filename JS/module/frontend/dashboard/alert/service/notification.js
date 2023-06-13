app.service('NotificationService', [
	'utilityService',        
	function (utilityService) {
		'use strict';

        this.url = {
        	notification: 'communication/settings/site-notifications'
        };
        this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildDurationList = function() {
	    	return [
	    		{
	    			id: 1,
	    			title: "Last Week",
	    			slug: "last_week",
	    		},
	    		{
	    			id: 2,
	    			title: "Last Month",
	    			slug: "last_month"
	    		},
	    		{
	    			id: 3,
	    			title: "Last Year",
	    			slug: "last_year"
	    		},
	    		{
	    			id: 4,
	    			title: "Custom",
	    			slug: "custom"
	    		}
	    	]
	    };
	    this.buildNotificationObject = function() {
	    	return {
	    		possibility: {
	    			unread: false,
	    			read: true
	    		},
	    		list: [],
	    		visible: false,
	    		type: null,
	    		typeList: [
	    			{
	    				title: "All Actions",
	    				status: null
	    			},
					{
	    				title: "Pending",
	    				status: 1
	    			},
	    			{
	    				title: "Rejected",
	    				status: 2
	    			},
	    			{
	    				title: "Approved",
	    				status: 3
	    			}
	    		],
	    		duration: {
	    			id: 4,
	    			title: "Custom",
	    			slug: "custom"
	    		},
	    		durationList: this.buildDurationList(),
                fromDate: null,
				toDate: null,
				filterList: []
	    	}
	    };
	    this.getUnreadCount = function(data) {
	    	var viewedCount = 0,
	    		unReadCount = 0;

	    	angular.forEach(data, function(value, key) {
	    		if(!value.view_status) {
	    			viewedCount++;
	    		}
	    		if(!value.read_status) {
	    			unReadCount++;
	    		}
	    	});
	    	return {
	    		viewedCount: viewedCount,
	    		unReadCount: unReadCount
	    	};
	    };
	    this.markNotificationAsRead = function(list) {
            angular.forEach(data, function(value, key) {
                if(!value.view_status) {
                    value.view_status = true;
                }
            });
        };    
	    
		return this;
	}
]);