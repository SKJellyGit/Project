app.service('AdminAttendanceService', [
	'$timeout', 'utilityService',        
	function ($timeout, utilityService) {
		'use strict';
		var self = this;

        this.url = {
            attendanceSummary: 'timeattendance/admin/summary-calender?month_year=',
            liveTrack: 'timeattendance/admin/live-attendance',
            attendanceGraph: 'timeattendance/admin/summary-graph?display_type=1&month_year=',           
            allAtendance: 'timeattendance/admin/all-attendance?month_year=',           
            reject: 'timeattendance/admin/action',
            bulkAction: 'admin-frontend/bulk-request',
            uploadCsv: 'timeattendance/admin/csv',
            downloadCsv: 'timeattendance/reporting-method/another-system-csv',
            allmandatorygroup: 'user-management/active/group?mandatory=true&field=true',
            actionAdmin: 'employee/module-permission',
            checkInDetails:'timeattendance/employee/checkin-by-employee',
            googleMapData: 'timeattendance/employee/get-track',
            selfieUrl: 'timeattendance/employee/get-selfie',
            bulkRegularization: 'timeattendance/admin/bulk-regularization/category',
            resyncAttendance: 'timeattendance/admin/resync-attendance',
            ssLiveTrack: 'ssearch/attendance/live-traker',
        };        
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };            
        this.checkForPending = function(v, list) {
        	if(list.indexOf(v.status) == -1) {
				v.pending = true;
				list.push(v.status);
			} else {
				v.notReceived = true;
			}
        };
        this.checkForRejected = function(v, list) {
        	if(list.indexOf(v.status) == -1) {
				v.rejected = true;
				list.push(v.status);
				list.push(1);
			} else {
				v.notReceived = true;
			}
        };
        this.buildRequestList = function(data) {
        	angular.forEach(data, function(value, key) {
        		var list = [];
        		value.approver_chain_list = [];
            	angular.forEach(value.approver_chain, function(v, k) {
            		(v.status == 1) ? self.checkForPending(v, list)
            			: ((v.status == 2) ? self.checkForRejected(v, list) 
            				: v.approved = true);

            		value.approver_chain_list.push(v);
            	}); 
            });
            return data;
        };
        this.buildDateObject = function(){
            return {
                1 : {
                    label: 3,
                    isChecked: false
                },
                2 : {
                    label: 7,
                    isChecked: false
                },
                3 : {
                    label: 15,
                    isChecked: false
                },
                4 : {
                    label: 30,
                    isChecked: false
                }    
            }
        };
        this.buildMonthsObject = function(){
            return [
                {
                    type: "1", 
                    name: "January"
                },
                {
                    type: "2", 
                    name: "February"
                },
                {
                    type: "3", 
                    name: "March"
                },
                {
                    type: "4", 
                    name: "April"
                },
                {   
                    type: "5", 
                    name: "May"
                },
                {
                    type: "6", 
                    name: "June"
                },
                {
                    type: "7", 
                    name: "July"
                },
                {type: "8", 
                name: "August"},
                {type: "9", 
                name: "September"},
                {type: "10", 
                name: "October"},
                {type: "11", 
                name: "November"},
                {type: "12", 
                name: "December"}]
        };
        this.getMonthsName = function(){
            return ["January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"]              
        };
        this.buildSummaryCSVData = function(empDetails) {
            var arr = new Array(["Employee Name", "Employee ID", "Total Working Days", 
                    "Present Days", "Average In Time", "Average Out Time", 
                    "Average Total Working Hours", "Pending Requests"]); 
            
            var object = {
                list: empDetails,
                content: arr
            };

            angular.forEach(object.list, function(value, key) {
                var array = new Array();

                array.push(utilityService.getInnerValue(value, 'employee_preview', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'employee_preview', 'personal_profile_employee_code'));
                array.push(utilityService.getValue(value, 'working_days'));
                array.push(utilityService.getValue(value, 'total_present_day'));
                array.push(utilityService.getValue(value, 'avg_in_time'));
                array.push(utilityService.getValue(value, 'avg_out_time'));
                array.push(utilityService.getValue(value, 'total_working_hour'));
                array.push(utilityService.getValue(value, 'total_pending_request'));

                object.content.push(array);
            });

            return object;
        };
        this.buildLiveTrackerCSVData = function(empDetails) {
            var arr = new Array(["Employee Name", "Employee ID", "Clock In Time", "Clock In Address",
                    "Clock Out Time", "Clock Out Address", "Break Duration", "Work Duration", "Status"]); 
            
            var object = {
                list: empDetails,
                content: arr
            };

            angular.forEach(object.list, function(value, key) {
                var array = new Array();
                
                array.push(utilityService.getValue(value, 'employee_name'));
                array.push(utilityService.getValue(value, 'employee_code'));
                array.push(utilityService.getValue(value, 'in_time'));
                array.push(utilityService.getInnerValue(value, 'check_in', 'address', '-'));
                array.push(utilityService.getValue(value, 'out_time'));
                array.push(utilityService.getInnerValue(value, 'check_out', 'address', '-'));
                array.push(utilityService.getValue(value, 'total_break_hours'));
                array.push(utilityService.getValue(value, 'total_hours_seconds'));
                array.push(utilityService.getValue(value, 'status') == 'Absent'
                    ?'No Attendance' : utilityService.getValue(value, 'status'));

                object.content.push(array);
            });

            return object;
        };

        this.buildMapdata = function(model) {
            if(!model || !model.length) {
                return model;
            }
            var uniqueArr = [];
            angular.forEach(model, function(val, key) {
                var lat = val.lat ? val.lat : val.latitude;
                var lng = val.lng ? val.lng : val.longitude;
                var ind = uniqueArr.findIndex(function(v, k) {
               var lat_ = v.lat ? v.lat : v.latitude;
               var lng_ = v.lng ? v.lng : v.longitude;
                    return ((lat_ == lat) && (lng_ == lng));
                });
                if(ind == -1) {
                    uniqueArr.push(val);
                } else if(uniqueArr[ind].type == 0) {
                    uniqueArr[ind] = val;
                }
            });
            return uniqueArr;
        };

        

        this.buildTrackerMap = function() {
            var today = utilityService.dateToString(new Date(), '-', 'ymd');
            return {
                emp: null,
                from_date: new Date(new Date(today).getTime()-24*3600*1000),
                to_date: new Date(today),
                data: [],
                visible: false
            };
        };

        this.buildLiveTrackerList = function(list) {    
            var arrTrack = new Array();
            angular.forEach(list, function(value, key) {
                var obj = {};
                obj = value;
                obj.is_clock_in_selfie = utilityService.getValue(value, 'is_clock_in_selfie') == "true" ? true : false;
                obj.is_clock_out_selfie = utilityService.getValue(value, 'is_clock_out_selfie') == "true" ? true : false;
                if(angular.isDefined(value.break_start_time)) {
                    obj['breaks'] = new Array();
                    for (var brk = 0; brk < value.break_start_time.length; brk++) {
                        var objbreak = {};
                        objbreak.start_time = value.break_start_time[brk] ? value.break_start_time[brk] : "-";
                        objbreak.end_time = value.break_end_time[brk] ? value.break_end_time[brk] : "-";
                        objbreak.duration = value.break_duration_time[brk] ? value.break_duration_time[brk] : "-";
                        obj['breaks'].push(objbreak);
                    }
                }
                obj.isCheck = false;
                arrTrack.push(obj);
            });

            return arrTrack;
        };
    }
]);