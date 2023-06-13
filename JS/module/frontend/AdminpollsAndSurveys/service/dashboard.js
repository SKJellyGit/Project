app.service('DashBoardAdminAttendanceService', [
    'utilityService', '$filter',
	function (utilityService, $filter) {
        'use strict';
        var selfService = this;
        this.groupList = [];

        this.url = {
            shifts: 'admin-shift/planner',
            allmandatorygroup : 'user-management/active/group?mandatory=true&field=true',

            workingHour: 'timeattendance/admin/dashboard/avg-working-hours',
            inTime: 'timeattendance/admin/dashboard/avg-in-time',
            outTime: 'timeattendance/admin/dashboard/avg-out-time',
            breakTime: 'timeattendance/admin/dashboard/avg-break-time',

            presentEmployee: 'timeattendance/admin/dashboard/present-employee-count',
            lateComing: 'timeattendance/admin/dashboard/late-coming-trend',
            earlyGoing: 'timeattendance/admin/dashboard/early-going-trend',
            avgWorkingHour: 'timeattendance/admin/dashboard/avg-working-hours',
            employeesByWorkingHour: 'timeattendance/admin/dashboard/employee-list-by-working-hour'

        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildDashboardObject = function() {
            return {
                summary: this.buildSummaryObject(),
                presentEmployee: this.buildPresentEmployeeObject(),
                lateComing: this.buildEarlyGoingLateComingObject(),
                earlyGoing: this.buildEarlyGoingLateComingObject(),
                avgWorkingHour: this.buildAvgWorkingHourObject(),
                employeesByWorkingHour: this.buildEmployeesByWorkingHourObject()
            };
        };
        this.buildSummaryObject = function() {
            return {
                workingHour: {
                    imageLink: '/images/svg/attendance-time3.svg',
                    imageClass: 'green-bg',
                    colorClass: 'green',
                    text: 'Average working Hours',
                    data: this.buildDefaultDataObject()
                },
                breakTime: {
                    imageLink: '/images/svg/attendance-cup.svg',
                    imageClass: 'blue-bg',
                    colorClass: 'blue',
                    text: 'Average Break Hours',
                    data: this.buildDefaultDataObject()
                },
                inTime: {
                    imageLink: '/images/svg/attendance-time2.svg',
                    imageClass: 'light-green-bg',
                    colorClass: 'q-light-green',
                    text: 'Average In Time',
                    data: this.buildDefaultDataObject()
                },
                outTime: {
                    imageLink: '/images/svg/attendance-time1.svg',
                    imageClass: 'orange-bg',
                    colorClass: 'orange',
                    text: 'Average Out Time',
                    data: this.buildDefaultDataObject()
                }
            };
        };
        this.buildDefaultDataObject = function() {
            return {
                value: null,
                days: 30,
                selectedShift: null,
                shiftName: null,
                daysOptions: this.buildDaysOptionsObject()
            };
        };
        this.buildDaysOptionsObject = function() {
            return {
                7: '07 Days',
                15: '15 Days',
                30: '30 Days',
                // 90: '3 Months',
                // 365: 'Year'
            };
        };
        this.buildPresentEmployeeObject = function () {
            return {
                groups: this.groupList,
                selectedGroup: null,
                selectedSubGroup: null,
                startDate: null,
                endDate: null,
                selectedMonthYear: null,
                chart: {
                    data: [],
                    chartConfig: {
                        title: null,
                        subtitle: null,
                        xTitle: null,
                        yTitle: 'Number of employees',
                        column_grouping: false
                    },
                    visible: false
                }
            };
        };
        this.buildEarlyGoingLateComingObject = function () {
            return {
                groups: this.groupList,
                selectedGroup: null,
                selectedSubGroup: null,
                startDate: null,
                endDate: null,
                selectedMonthYear: null,
                chart: {
                    data: [],
                    chartConfig: {
                        title: null,
                        subtitle: null,
                        xTitle: null,
                        yTitle: 'Number of employees',
                        legend_enabled: true
                    },
                    visible: false
                }
            };
        };
        this.buildAvgWorkingHourObject = function () {
            return {
                groups: this.groupList,
                selectedGroup: null,
                selectedSubGroup: null,
                startDate: null,
                endDate: null,
                selectedMonthYear: null,
                chart: {
                    data: [],
                    chartConfig: {
                        title: null,
                        subtitle: null,
                        xTitle: null,
                        yTitle: 'Hours'
                    },
                    visible: false
                }
            };
        };
        this.buildEmployeesByWorkingHourObject = function () {
            var obj = {
                groups: this.groupList,
                selectedGroup: null,
                selectedSubGroup: null,
                startDate: null,
                endDate: null,
                days: 30,
                daysOptions: this.buildDaysOptionsObject(),
                employees: {
                    topList: [],
                    bottomList: [],
                    visible: false
                }
            };
            obj.daysOptions[90] = '90 Days';
            return obj;
        };

        this.getRandomColor = function () {
            var rn = function () { return Math.floor(Math.random()*210); };
            return "rgb(" + rn() + "," + rn() + "," + rn() + ")";
        };
        this.buildColumnChartData = function(name, model, color) {
            var defaultValue = [{
                name: name,
                data: [{
                    name: 'No Data Available',
                    y: 0,
                    color : color 
                        ? (color == 'random' ? selfService.getRandomColor() 
                            : (color == 'percentage' 
                                ?  'red'
                                : color)) 
                        : undefined
                }]
            }];
            if(!model || !model.length) { return defaultValue; }
            var data =  model.map(function(elem) {
                return {
                    name: elem.name ? elem.name : undefined,
                    y: elem.value,
                    color : color 
                        ? (color == 'random' ? selfService.getRandomColor() 
                            : (color == 'percentage' 
                                ?  (elem.percentage >= 90 
                                    ? 'green' 
                                    : (elem.percentage < 60 ? 'red' : 'orange'))
                                : color))
                        : undefined
                };
            });
            return [{
                name: name,
                data: data
            }];
        };
        this.buildPresentEmployeeChartData = function(model) {
            if(!model || !model.length) {
                model = [];
            }
            var finalData = {
                x_categories: [],
                data: [
                    {
                        name: 'Total',
                        color: 'lightgray',
                        data: [],
                    },
                    {
                        name: 'Present',
                        color: 'black',
                        data: [],
                    }
                ]
            };
            model.forEach(function(val, key) {
                var name = $filter('stringMonthDate')(parseInt(val.date)*1000, ' ');
                finalData.x_categories.push(name);
                finalData.data[0].data.push(val.total);
                finalData.data[1].data.push({
                    y: val.present_count,
                    color: (val.present_percentage >= 90) ? 'green' : ((val.present_percentage < 60) ? 'red' : 'orange')
                });
            });
            return finalData;
        };
        this.buildLateComingChartData = function(model) {
            if(!model || !model.length) {
                model = [];
            }
            var finalData = {
                x_categories: [],
                data: [
                    {
                        name: 'Total Present',
                        data: [],
                    },
                    {
                        name: 'Total Late Count',
                        data: [],
                    }
                ]
            };
            model.forEach(function(val, key) {
                var name = $filter('stringMonthDate')(parseInt(val.date)*1000, ' ');
                finalData.x_categories.push(name);
                finalData.data[0].data.push(val.total);
                finalData.data[1].data.push(val.total_late_count);
            });
            return finalData;
        };
        this.buildEarlyGoingChartData = function(model) {
            if(!model || !model.length) {
                model = [];
            }
            var finalData = {
                x_categories: [],
                data: [
                    {
                        name: 'Total Present',
                        data: [],
                    },
                    {
                        name: 'Total Early Count',
                        data: [],
                    }
                ]
            };
            model.forEach(function(val, key) {
                var name = $filter('stringMonthDate')(parseInt(val.date)*1000, ' ');
                finalData.x_categories.push(name);
                finalData.data[0].data.push(val.total);
                finalData.data[1].data.push(val.total_early_count);
            });
            return finalData;
        };
        this.buildWorkingHourChartData = function(name, model, color) {
            if(!model || !model.length) {
                model = [];
            }
            model = model.map(function(el) {
                return {
                    name: $filter('stringMonthDate')(parseInt(el.date)*1000, ' '),
                    value: el.avg_working_hour
                };
            });
            return this.buildColumnChartData(name, model, color);
        };
    }
]);