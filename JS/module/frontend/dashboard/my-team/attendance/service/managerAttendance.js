app.service('ManagerAttendanceService', [
    '$timeout', 'utilityService',
    function ($timeout, utilityService) {
        'use strict';
        var self = this;

        this.url = {
            attendanceSummary: 'timeattendance/manager/summary-calender?month_year=',
            liveTrack: 'timeattendance/manager/live-attendance',
            attendanceGraph: 'timeattendance/manager/summary-graph?display_type=1&month_year=',
            allAtendance: 'timeattendance/manager/all-attendance?month_year=',
            reject: 'employee/action',
            bulkAction: 'timeattendance/manager/bulk-approve',
            relationship: 'employee/relationship-fields',
            getEmps: 'employee/multi-employee-preview',
            allmandatorygroup : 'user-management/active/group?mandatory=true&field=true',
            actionNonAdmin: 'myteam/na-module-permission',
            checkInDetails:'timeattendance/employee/checkin-by-employee',
            googleMapData: 'timeattendance/employee/get-track',
            selfieUrl: 'timeattendance/employee/get-selfie',
            reportInOut: 'timeattendance/manager/my-team-in-out-attendance'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };

        this.checkForPending = function (v, list) {
            if (list.indexOf(v.status) == -1) {
                v.pending = true;
                list.push(v.status);
            } else {
                v.notReceived = true;
            }
        };
        this.checkForRejected = function (v, list) {
            if (list.indexOf(v.status) == -1) {
                v.rejected = true;
                list.push(v.status);
                list.push(1);
            } else {
                v.notReceived = true;
            }
        };
        this.buildRequestList = function (data) {
            angular.forEach(data, function (value, key) {
                var list = [];
                value.approver_chain_list = [];
                angular.forEach(value.approver_chain, function (v, k) {
                    (v.status == 1) ? self.checkForPending(v, list)
                            : ((v.status == 2) ? self.checkForRejected(v, list)
                                    : v.approved = true);

                    value.approver_chain_list.push(v);
                });
            });
            return data;
        };
        this.buildDateObject = function () {
            return{
                1: {
                    label: 3,
                    isChecked: false
                },
                2: {
                    label: 7,
                    isChecked: false
                },
                3: {
                    label: 15,
                    isChecked: false
                },
                4: {
                    label: 30,
                    isChecked: false
                },
            }
        };
        this.buildMonthsObject = function () {
            return [
                {type: "1", name: "January"},
                {type: "2", name: "February"},
                {type: "3", name: "March"},
                {type: "4", name: "April"},
                {type: "5", name: "May"},
                {type: "6", name: "June"},
                {type: "7", name: "July"},
                {type: "8", name: "August"},
                {type: "9", name: "September"},
                {type: "10", name: "October"},
                {type: "11", name: "November"},
                {type: "12", name: "December"}
            ];
        };
        this.getMonthsName = function () {
            return ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                "October", "November", "December"];
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
    }
]);