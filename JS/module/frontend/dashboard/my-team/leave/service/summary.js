app.service('LeaveSummaryService', [
	'utilityService',        
	function (utilityService) {
		'use strict';

        this.url = {
        	action: 'employee/module-permission',
        	// My Team URLs        	
        	approved: 'myteam/approved-leave/summary',
        	availed: 'myteam/availed-leave/summary',
        	balance: 'data/leave/summary-balance-leaves.json',
        	pending: 'myteam/pending-leave/summary',        	
        	// Admin Frontend URLs
        	approvedAdmin: 'admin-frontend/approved-leave/summary',
        	availedAdmin: 'admin-frontend/availed-leave/summary',
        	balanceAdmin: 'data/leave/summary-balance-leaves.json',
        	pendingAdmin: 'admin-frontend/pending-leave/summary'        	
        };
        this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };	    
	    this.buildDurationObject = function() {
	    	return {
    			id: 4,
    			title: "Month on Month",
    			slug: "mom",
	    		value: 1
    		}
	    };
	    this.buildDurationList = function() {
	    	return [
	    		{
	    			id: 4,
	    			title: "Month on Month",
	    			slug: "mom",
	    			value: 1
	    		},
	    		{
	    			id: 6,
	    			title: "Quarter on Quarter",
	    			slug: "qoq",
	    			value: 2
	    		},
	    		{
	    			id: 5,
	    			title: "Year on Year",
	    			slug: "yoy",
	    			value: 3
	    		}
	    	]
	    };
	    this.buildApprovedHeaderList = function() {
	    	return ['7 Days', '30 Days', '90 Days'];
	    };
	    this.buildPendingHeaderList = function() {
	    	return ['0-3', '3-5', '5-10', '10+'];
	    };
	    this.buildBalanceHeaderList = function() {
	    	return ['Outstanding Encashable Days', 'Potential Liability'];
	    };
	    this.buildSummaryModel = function() {
	    	return {
	    		approved: {
	        		list: [],
	        		graphData: [],
	        		xAxisData: [],
	        		header: this.buildApprovedHeaderList(),
	        		visible: false
	        	},
	        	availed: {
	        		list: [],
	        		xAxisData: [],
	        		header: {
	        			mom: [],
	        			qoq: [],
	        			yoy: []
	        		},
	        		duration: this.buildDurationObject(),
		    		durationList: this.buildDurationList(),
	        		visible: false
	        	},
	        	balance: {
	        		list: [],
	        		graphData: [],
	        		xAxisData: [],
	        		header: this.buildBalanceHeaderList(),
	        		visible: false
	        	},	        	
	        	colors: utilityService.buildColorObject(),
	        	pending: {
	        		list: [],
	        		graphData: [],
	        		xAxisData: [],
	        		header: this.buildPendingHeaderList(),
	        		visible: false
	        	}
	        }
	    };
	    this.getXAxisData = function(list) {
	    	var category = [];
	    	angular.forEach(list, function(value, key) {
	    		category.push(value.name);
	    	});
	    	return category;
	    };
	    this.buildHeaderList = function(section) {
	    	var header = [];
	    	if(section === "approved") {
	    		header = this.buildApprovedHeaderList();
	    	} else if(section === "pending") {
	    		header = this.buildPendingHeaderList();
	    	} else if(section === "balance") {
	    		header = this.buildBalanceHeaderList();
	    	}
	    	return header;
	    };
	    this.buildGraphData = function(list, section) {
	    	var graphData = [],
	    		header = this.buildHeaderList(section);	    	

	    	for(var i = 0; i < list[0].data.length; i++) {
	    		var object = {
	    			name: header[i],
	    			data: []
	    		};
	    		angular.forEach(list, function(value, key) {
		    		object.data.push(value.data[i]);
		    	});
		    	graphData.push(object);
	    	}
	    	return graphData;
	    };
	    this.getTeamOwnerId = function(breadcrum) {
	    	var ownerId = null;
	    	if(angular.isDefined(breadcrum) && breadcrum.length) {
	            var lastObject = _.last(breadcrum);
	            ownerId = lastObject._id;
	        }
	        return ownerId;
	    };

	    return this;
	}
]);