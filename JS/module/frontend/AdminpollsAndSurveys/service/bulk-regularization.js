app.service('AdminBulkRegularizationService', ['utilityService',        
	function (utilityService) {
		'use strict';
        var self = this;

        this.url = {
            attendance: 'timeattendance/admin/employee/monthly-attendance',
            employee: 'user-addition/all-user-with-permission', //'user-addition/users-preview'
            selfieUrl: 'timeattendance/employee/get-selfie'
        };        
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
        };
        this.buildMonthHashMap = function () {
            return {
                1: 'January',
                2: 'February',
                3: 'March',
                4: 'April',
                5: 'May',
                6: 'June',
                7: 'July',
                8: 'August',
                9: 'September',
                10: 'October',
                11: 'November',
                12: 'December'
            };
        };
        this.buildMonthYearObject = function (month, year, monthHashMap, visible) {
            return {
                month: month,
                year: year,
                monthName: monthHashMap[month],
                visible: visible
            };
        };
        this.buildMonthYearList = function () {
            var currentMonth = utilityService.getCurrentMonth(),
                currentYear = utilityService.getCurrentYear(),
                monthHashMap = this.buildMonthHashMap(),
                list = [],
                visible = false;
            
            for (var year = utilityService.startYear; year <= currentYear ; year++) {
                for (var month = 1; month <= 12; month++) {
                    if (year === currentYear && month <= currentMonth) {
                        visible = (year === currentYear && month === currentMonth);
                        list.push(self.buildMonthYearObject(month, year, monthHashMap, visible));
                    } else if (year === utilityService.startYear && month >= utilityService.startMonth) {
                        list.push(self.buildMonthYearObject(month, year, monthHashMap, visible));
                    } else if (year > utilityService.startYear && year < currentYear) {
                        list.push(self.buildMonthYearObject(month, year, monthHashMap, visible));
                    }
                }
            }

            return list;
        };
        this.buildBulkRegularizationObject = function () {
            var monthYearList = this.buildMonthYearList();

            return {
                monthYear: {
                    list: monthYearList,
                    month: utilityService.getCurrentMonth(),
                    year: utilityService.getCurrentYear(),
                    index: monthYearList.length - 1,
                    isDisabled: false
                }, 
                list: [],
                filteredList: [],
                visible: false,
                showBreakColumn: false,
                propertyName: 'date.full_name',
                reverse: true,
                isChecked: false,
                selectedRows: 0,
                employee_id: null,
                permission: 'can_view_attendance'
            };
        };
        this.buildCSVColumns = function (bulkRegularization) {
            var columns = ["Date", "Clock In Time", "Clock In Location", "Clock Out Time", 
                "Clock Out Location"];

            if (utilityService.getValue(bulkRegularization, 'showBreakColumn')) {
                columns.push("Break Duration");
            }

            if (utilityService.getValue(bulkRegularization, 'show_overtime')) {
                columns.push("Overtime");
            }

            columns.push("Total Work Hours");
            columns.push("Remark");

            return new Array(columns);
        };
        this.buildCSVData = function(bulkRegularization) {
			var object = {
				list: bulkRegularization.filteredList,
                content: this.buildCSVColumns(bulkRegularization)
			};
			
			angular.forEach(object.list, function(value, key) {
				var array = new Array();

                array.push(utilityService.getValue(value, 'date'));                
                array.push(utilityService.getValue(value, 'in_time'));
                array.push(utilityService.getInnerValue(value, 'check_in', 'address', '-'));                
                array.push(utilityService.getValue(value, 'out_time'));
                array.push(utilityService.getInnerValue(value, 'check_out', 'address', '-'));
                
                if (utilityService.getValue(bulkRegularization, 'showBreakColumn')) {
                    array.push(utilityService.getValue(value, 'total_break_hours'));
                }

                if (utilityService.getValue(bulkRegularization, 'show_overtime')) {
                    array.push(utilityService.getValue(value, 'overtime'));
                }				
				
                array.push(utilityService.getValue(value, 'total_hours_seconds'));
                array.push(utilityService.getValue(value, 'remark'));
				
				object.content.push(array);
			});

			return object;
		};
        
    }
]);