app.service('DashBoardAdminLeaveService', [
    'utilityService',        
	function (utilityService) {
        'use strict';
        var selfService = this;
        this.groupList = [];

        this.url = {
            allmandatorygroup : 'user-management/active/group?mandatory=true&field=true',
            leaveType: 'admin/leave/type',
            allLeaves: 'admin-frontend/leave/dashboard/leave-used-by-leave-type',
            planedUnplaned: 'admin-frontend/leave/dashboard/planned-unplanned-graph',
            leastLeaves: 'admin-frontend/leave/dashboard/least-leave-takers',
            mostLeaves: 'admin-frontend/leave/dashboard/most-leave-takers',
            lwpLeaves: 'admin-frontend/leave/dashboard/lwp-leave-takers'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildDashboardObject = function() {
            return {
                allLeaves: this.buildAllLeavesObject(),
                planedUnplanedLeaves: this.buildPlanedUnplanedLeavesObject(),
                leastLeaves: this.buildLeastLeaveObject(),
                mostLeaves: this.buildMostLeaveObject(),
                lwpLeaves: this.buildLwpLeavesObject()
            };
        };
        this.buildAllLeavesObject = function () {
            return {
                groups: this.groupList,
                selectedGroup: null,
                selectedSubGroup: null,
                years: [],
                selectedYear: null,
                months: [],
                selectedMonth: null,
                chart: {
                    data: [],
                    chartConfig: {
                        title: null,
                        subtitle: null
                    },
                    visible: false
                }
            };
        };
        this.buildPlanedUnplanedLeavesObject = function () {
            return {
                groups: this.groupList,
                selectedGroup: null,
                selectedSubGroup: null,
                years: [],
                selectedYear: null,
                months: [],
                selectedMonth: null,
                chart: {
                    data: [],
                    chartConfig: {
                        title: null,
                        subtitle: null,
                        xTitle: null,
                        yTitle: 'Employees',
                        y_labels_format: '{value} %',
                        plotOptions_dataLabels_format: '{point.y} %',
                        tooltip_pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} %</b><br/><span style="color:{point.color}">\u25CF</span> Total count: <b>{point.total_count}</b>'
                    },
                    visible: false
                }
            };
        };
        this.buildLeastLeaveObject = function () {
            return {
                leaveType: null,
                selectedLeaveType: null,
                years: [],
                selectedYear: null,
                months: [],
                selectedMonth: null,
                chart: {
                    data: [],
                    chartConfig: {
                        title: null,
                        subtitle: null,
                        xTitle: 'Employees',
                        yTitle: 'Number of Leaves'
                    },
                    visible: false
                }
            };
        };
        this.buildMostLeaveObject = function () {
            return {
                leaveType: null,
                selectedLeaveType: null,
                years: [],
                selectedYear: null,
                months: [],
                selectedMonth: null,
                chart: {
                    data: [],
                    chartConfig: {
                        title: null,
                        subtitle: null,
                        xTitle: 'Employees',
                        yTitle: 'Number of Leaves'
                    },
                    visible: false
                }
            };
        };
        this.buildLwpLeavesObject = function () {
            return {
                groups: this.groupList,
                selectedGroup: null,
                selectedSubGroup: null,
                chart: {
                    data: [],
                    chartConfig: {
                        title: null,
                        subtitle: null,
                        xTitle: 'Last 12 months',
                        yTitle: 'Days',
                        // tooltip_enabled: false,
                        // plotOptions_dataLabels_format: '<div ng-if="false">not</div><div ng-if="true">{point.y}</div>'
                    },
                    visible: false
                }
            };
        };

        this.getRandomColor = function () {
            var rn = function () { return Math.floor(Math.random()*210); };
            return "rgb(" + rn() + "," + rn() + "," + rn() + ")";
        };
        // this.findMaxValue = function(arr, key) {
        //     if(!arr || !arr.length || !key || !angular.isString(key)) { return null; }
        //     var returnValue = arr.reduce(function(pre, cur) {
        //         return (!cur.hasOwnProperty(key) || (pre[key] > cur[key])) ? pre : cur;
        //     }, {[key]: arr[0][key]})[key];
        //     return angular.isDefined(returnValue) ? returnValue : null;
        // };
        this.buildDataForPieChart = function (dataArr) {
            if(!dataArr || !dataArr.length) {
                // return [{
                //     name: 'No Data Available',
                //     y: 100
                // }];
                return [];
            }
            // let maxValue = this.findMaxValue(dataArr, 'count');
            return dataArr.map(function(elem) {
                return {
                    name: elem.name,
                    y: elem.count,
                    // sliced: elem.count === maxValue ? true : false,
                    // selected: elem.count === maxValue ? true : false
                };
            });
        };
        this.buildColumnChartData = function(name, model, color) {
            var defaultValue = [{
                name: name,
                data: [{
                    name: 'No Data Available',
                    y: 0,
                    color: color ? (color == 'random' ? selfService.getRandomColor() : color) : undefined
                }]
            }];
            if(!model || !model.length) { return defaultValue; }
            var data =  model.map(function(elem) {
                var modified_elem = {
                    name: angular.isDefined(elem.name) ? elem.name : (angular.isDefined(elem.employee_preview) ? elem.employee_preview.full_name : null),
                    y: angular.isDefined(elem.value) ? elem.value : (angular.isDefined(elem.count) ? elem.count : null),
                    color : color ? (color == 'random' ? selfService.getRandomColor() : color) : undefined
                };
                if(angular.isDefined(elem.count)) {
                    modified_elem.total_count = elem.count;
                }
                return modified_elem;
            });
            return [{
                name: name,
                data: data
            }];
        };
    }
]);