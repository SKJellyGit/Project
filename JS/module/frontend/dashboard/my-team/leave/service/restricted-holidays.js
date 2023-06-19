app.service('RestrictedHolidaysService', [
	'utilityService', 'TimeOffService',        
	function (utilityService, timeOffService) {
		'use strict';

		this.remainderType = 8;
        this.url = {
        	teamRestrictedHolidays: 'myteam/restricted-holidays',        	
        	adminRestrictedHolidays: 'admin-frontend/restricted-holidays'        	
        };
        this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildRestrictedHolidaysObject = function() {	    	
            return {
                list: [],
                visible: false,
				filteredList: [],
	            propertyName: 'employee_preview.full_name',
	            reverse: true,	            
				search: '',
				leaveStatusMapping: utilityService.buildApproverStatusHashMap()		   			    		
            };
		};
		this.setAdditionalKeysInResponse = function (list, mapping) {
			angular.forEach(list, function (value, key) {
				value.statusText = mapping[utilityService.getValue(value, 'status', 1)];
				if (value.status == 3 || value.status == 8 || value.status == 10 || value.status == 12) {
					value.className = 'green';
				} else if (value.status == 2 || value.status == 4 || value.status == 9 
					|| value.status == 11 || value.status == 13 || value.status == 14) {
					value.className = 'red';
				} else if (value.status == 1) {
					value.className = 'orange';
				} else {
					value.className = 'gray';
				}	
			});

			return list;
		};
        this.buildCSVColumns = function () {
			//"Restricted Holiday Date", "Restricted Holiday Day",
			var columns = ["Employee Name", "Employee Code", "Restricted Holiday Name", 
				"Date", "Day", "Requested On", "Status"];
				
            return new Array(columns);
        };
        this.buildCSVData = function(list) {
			var object = {
				list: list,
				content: this.buildCSVColumns()
			};
			
			angular.forEach(object.list, function(value, key) {
				var array = new Array();               
                    
                array.push(utilityService.getValue(value, 'employee_name'));
                array.push(utilityService.getValue(value, 'employee_code'));
				array.push(utilityService.getValue(value, 'holiday_name'));				
				array.push(utilityService.getValue(value, 'date_format'));
				array.push(utilityService.getValue(value, 'day'));
                array.push(utilityService.getValue(value, 'requested_on'));
                array.push(utilityService.getValue(value, 'statusText'));
                
				object.content.push(array);
			});

			return object;
		};  
				
	    return this;
	}
]);