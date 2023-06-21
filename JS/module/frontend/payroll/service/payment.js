app.service('PayrollPaymentService', [
    'ServerUtilityService', 'utilityService',
    function (ServerUtilityService, utilityService) {
        'use strict';

		var self = this;


    	this.url = {
			summary: 'payroll/payment-summary',
			details: 'payroll/payment-details',
			allEntityPermission: 'payroll/permissions',
			generateMonthlySalary: 'payroll/generate-monthly-salary',
			canSyncAttendance: 'payroll/can-sync-lo-from-attendance',
			syncAttendance: 'payroll/sync-lo-from-attendance'
		};
		this.getUrl = function(apiUrl) {
			return getAPIPath() + this.url[apiUrl];
		};
		this.range = function (min, max) {
            var input = [],
            	min = parseInt(min),
            	max = parseInt(max);

            for (var i = min; i <= max; i++)
                input.push(i);
            
            return input;
        };
        this.getYearList = function(yearExtended) {
        	var d = new Date(),
        		year = d.getFullYear(),
        		list = [];
        	for(var i=0; i<= year - utilityService.startYear; i++) {
        		list.push(year - i);
			}
			if(yearExtended.enabled) {
				angular.forEach(yearExtended.upto, function(value) {
					list.push(value)
				})
			}
			
			list = _.uniq(list);
        	return list;
        };
		this.buildPaymentObject = function(yearExtended){
			return {
				month: {
					list: ["Jan", "Feb", "Mar", "April", "May", "June", 
						"July", "Aug", "Sep", "Oct", "Nov","Dec"],
					current: utilityService.getCurrentMonth(),
					start: 4
				},
				year: {
					list: this.getYearList(yearExtended),
					current: utilityService.getCurrentYear(),
					start: utilityService.startYear
				},
				summary: {
					category: [],
					current: {
	    				month: utilityService.getCurrentMonth(),
	    				row: 1,
	    				year: utilityService.getCurrentYear()
	    			},
	    			filteredList: [],
	    			graph: [],
	    			list: [],
	    			visible: {
	    				graph: false,
	    				list: false
					},
					hasPermission: false,
					permissionSlug: 'can_view_payroll'
	    		},
				details: {          		    			
	    			breakup: [],
	    			content: [],
	    			current: {
	    				month: utilityService.getCurrentMonth(),
	    				year: utilityService.getCurrentYear()
	    			},
	    			filtered: {
	    				list: []
	    			},
	    			graph: [],	    			
	            	hashmap: utilityService.buildEmployeeStatusHashMap(),
	        		list: [],
	        		propertyName: '',
	        		reverse: false,
	        		search: '',
	            	visible: false,
	        		yearList: utilityService.getLastFiveYearRangeList()
	    		},	    		
	    		pagination: {
                    currentPage: 1,                    
                    maxSize: 15,
                    numPerPage: 15,
                    range: this.range(1, 15)
                }
			}
		};
		this.buildEmpDetailList = function(list, hashmap) {
	    	var object = {
	    		content: new Array(["Employee Name", "Employee ID", "Joining Date", "Last Working Date", "Employee Status", "Gross Amount", "Net Amount", "Payment Status"])
	    	};

	    	angular.forEach(list, function(value, key) {
	    		value.status_text = utilityService.getInnerValue(value, 'employee_preview', 'system_plans_employee_status') 
	    			? hashmap[value.employee_preview.system_plans_employee_status]
	    			: null;
	    		
	    		var array = new Array();

	    		array.push(utilityService.getInnerValue(value, 'employee_preview', 'full_name'));
	    		array.push(utilityService.getInnerValue(value, 'employee_preview', 'personal_profile_employee_code'));
	    		array.push(utilityService.getInnerValue(value, 'employee_preview', 'work_profile_joining_date'));
	    		array.push(utilityService.getInnerValue(value, 'employee_preview', 'last_working_date', '-'));
	    		array.push(utilityService.getInnerValue(value, 'employee_preview', 'status_text'));
	    		array.push(utilityService.getValue(value, 'total_gross', 0));
	    		array.push(utilityService.getValue(value, 'total_net_pay', 0));
	    		array.push(utilityService.getValue(value, 'payment_status'));

	    		object.content.push(array);
 	    	});

	    	return object;
	    };   
	}
]);