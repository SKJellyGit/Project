app.controller('DashboardAdminAttendanceController', [
    '$scope', '$q', 'DashBoardAdminAttendanceService', 'utilityService', 'ServerUtilityService', 
    function ($scope, $q, service, utilityService, serverUtilityService) {
        'use strict';
        var self = this;
        
        service.groupList = $scope.groupList;
        $scope.shiftsList = [];
        $scope.dashboard = service.buildDashboardObject();
        $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Start: summary section
        $scope.detailsCallback = function (keyName, data) {
            $scope.dashboard.summary[keyName].data.value = utilityService.getInnerValue(data, 'data', 'value');
        };
        $scope.registerFunc = function (keyName, days, callback, shiftId) {
            var url = service.getUrl(keyName) + "/" + days;
            if(shiftId) {
                url += '/' + shiftId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                callback(keyName, data);
            });
        };
        $scope.clickDurationHandler = function (keyName, days, func, callback, shiftId) {
            $scope.dashboard.summary[keyName].data.days = days;
            $scope.dashboard.summary[keyName].data.selectedShift = shiftId || null;
            func(keyName, days, callback, shiftId);            
        };       
        var dashboardSummaryCallback = function (data) {
            $scope.detailsCallback('workingHour', data[0]);
            $scope.detailsCallback('inTime',  data[1]);
            $scope.detailsCallback('outTime',  data[2]);
            $scope.detailsCallback('breakTime',  data[3]);
        };
        // Get & Build Dashboard 
        var getDashboardSummary = function(shiftId) {            
            $q.all([
                serverUtilityService.getWebService(service.getUrl('workingHour') + "/" + $scope.dashboard.summary.workingHour.data.days),
                serverUtilityService.getWebService(service.getUrl('inTime') + "/" + $scope.dashboard.summary.inTime.data.days + '/' + shiftId),
                serverUtilityService.getWebService(service.getUrl('outTime') + "/" + $scope.dashboard.summary.outTime.data.days + '/' + shiftId),
                serverUtilityService.getWebService(service.getUrl('breakTime') + "/" + $scope.dashboard.summary.breakTime.data.days)
            ]).then(function(data) {                        
                dashboardSummaryCallback(data);            
            });
        };

        var getShiftsList = function() {
            var url = service.getUrl('shifts');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.shiftsList = utilityService.getValue(data, 'data', []).filter(function(val) {
                    return val.status;
                });
                if($scope.shiftsList.length) {
                    var selectedShift = $scope.shiftsList[0]._id;
                    var selectedName = $scope.shiftsList[0].plan_name;
                    $scope.dashboard.summary.inTime.data.selectedShift = selectedShift;
                    $scope.dashboard.summary.inTime.data.shiftName = selectedName;
                    $scope.dashboard.summary.outTime.data.selectedShift = selectedShift;
                    $scope.dashboard.summary.outTime.data.shiftName = selectedName;
                    getDashboardSummary(selectedShift);
                }
            });
        };

        $scope.getPresentEmployeeData = function(startDate, endDate, groupId, subGroupId) {
            if(!angular.isDate(startDate) || !angular.isDate(endDate)) { return false; }
            $scope.dashboard.presentEmployee.chart.visible = false;
            var tempDate = new Date(startDate.getTime() + (endDate.getTime()-startDate.getTime()));
            $scope.dashboard.presentEmployee.selectedMonthYear = $scope.months[tempDate.getMonth()] + ' ' + tempDate.getFullYear();
            startDate = parseInt(startDate.getTime()/1000);
            endDate = parseInt(endDate.getTime()/1000);
            var url = service.getUrl('presentEmployee') + '/' + startDate + '/' + endDate;
            if(groupId) {
                if(!subGroupId) {
                    $scope.dashboard.presentEmployee.selectedSubGroup = $scope.dashboard.presentEmployee.selectedGroup.element_details[0];
                    subGroupId = $scope.dashboard.presentEmployee.selectedSubGroup._id;
                }
                url += '/' + groupId + '/' + subGroupId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.dashboard.presentEmployee.chart.data = service.buildPresentEmployeeChartData(utilityService.getValue(data, 'data'));
                if(groupId && subGroupId){
                    $scope.dashboard.presentEmployee.chart.chartConfig.title = $scope.dashboard.presentEmployee.selectedGroup.name;
                    $scope.dashboard.presentEmployee.chart.chartConfig.subtitle = $scope.dashboard.presentEmployee.selectedSubGroup.name;
                } else {
                    $scope.dashboard.presentEmployee.chart.chartConfig.title = "Overall";
                    $scope.dashboard.presentEmployee.chart.chartConfig.subtitle = null;
                }
                $scope.dashboard.presentEmployee.chart.visible = true;
            });
        };
        var getPresentEmployeeDetails = function () {
            var currentDate = utilityService.dateToString(new Date(), '/', 'ymd');
            $scope.dashboard.presentEmployee.endDate = new Date(currentDate + ' 23:59:59');
            $scope.dashboard.presentEmployee.startDate = new Date($scope.dashboard.presentEmployee.endDate.getTime()+1000-(7*24*3600*1000));
            $scope.getPresentEmployeeData($scope.dashboard.presentEmployee.startDate, $scope.dashboard.presentEmployee.endDate);
        };

        $scope.getLateComingData = function(startDate, endDate, groupId, subGroupId) {
            if(!angular.isDate(startDate) || !angular.isDate(endDate)) { return false; }
            $scope.dashboard.lateComing.chart.visible = false;
            var tempDate = new Date(startDate.getTime() + (endDate.getTime()-startDate.getTime()));
            $scope.dashboard.lateComing.selectedMonthYear = $scope.months[tempDate.getMonth()] + ' ' + tempDate.getFullYear();
            startDate = parseInt(startDate.getTime()/1000);
            endDate = parseInt(endDate.getTime()/1000);
            var url = service.getUrl('lateComing') + '/' + startDate + '/' + endDate;
            if(groupId) {
                if(!subGroupId) {
                    $scope.dashboard.lateComing.selectedSubGroup = $scope.dashboard.lateComing.selectedGroup.element_details[0];
                    subGroupId = $scope.dashboard.lateComing.selectedSubGroup._id;
                }
                url += '/' + groupId + '/' + subGroupId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.dashboard.lateComing.chart.data = service.buildLateComingChartData(utilityService.getValue(data, 'data'));
                if(groupId && subGroupId){
                    $scope.dashboard.lateComing.chart.chartConfig.title = $scope.dashboard.lateComing.selectedGroup.name;
                    $scope.dashboard.lateComing.chart.chartConfig.subtitle = $scope.dashboard.lateComing.selectedSubGroup.name;
                } else {
                    $scope.dashboard.lateComing.chart.chartConfig.title = "Overall";
                    $scope.dashboard.lateComing.chart.chartConfig.subtitle = null;
                }
                $scope.dashboard.lateComing.chart.visible = true;
            });
        };
        var getLateComingDetails = function () {
            var currentDate = utilityService.dateToString(new Date(), '/', 'ymd');
            $scope.dashboard.lateComing.endDate = new Date(currentDate + ' 23:59:59');
            $scope.dashboard.lateComing.startDate = new Date($scope.dashboard.lateComing.endDate.getTime()+1000-(7*24*3600*1000));
            $scope.getLateComingData($scope.dashboard.lateComing.startDate, $scope.dashboard.lateComing.endDate);
        };

        $scope.getEarlyGoingData = function(startDate, endDate, groupId, subGroupId) {
            if(!angular.isDate(startDate) || !angular.isDate(endDate)) { return false; }
            $scope.dashboard.earlyGoing.chart.visible = false;
            var tempDate = new Date(startDate.getTime() + (endDate.getTime()-startDate.getTime()));
            $scope.dashboard.earlyGoing.selectedMonthYear = $scope.months[tempDate.getMonth()] + ' ' + tempDate.getFullYear();
            startDate = parseInt(startDate.getTime()/1000);
            endDate = parseInt(endDate.getTime()/1000);
            var url = service.getUrl('earlyGoing') + '/' + startDate + '/' + endDate;
            if(groupId) {
                if(!subGroupId) {
                    $scope.dashboard.earlyGoing.selectedSubGroup = $scope.dashboard.earlyGoing.selectedGroup.element_details[0];
                    subGroupId = $scope.dashboard.earlyGoing.selectedSubGroup._id;
                }
                url += '/' + groupId + '/' + subGroupId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.dashboard.earlyGoing.chart.data = service.buildEarlyGoingChartData(utilityService.getValue(data, 'data'));
                if(groupId && subGroupId){
                    $scope.dashboard.earlyGoing.chart.chartConfig.title = $scope.dashboard.earlyGoing.selectedGroup.name;
                    $scope.dashboard.earlyGoing.chart.chartConfig.subtitle = $scope.dashboard.earlyGoing.selectedSubGroup.name;
                } else {
                    $scope.dashboard.earlyGoing.chart.chartConfig.title = "Overall";
                    $scope.dashboard.earlyGoing.chart.chartConfig.subtitle = null;
                }
                $scope.dashboard.earlyGoing.chart.visible = true;
            });
        };
        var getEarlyGoingDetails = function () {
            var currentDate = utilityService.dateToString(new Date(), '/', 'ymd');
            $scope.dashboard.earlyGoing.endDate = new Date(currentDate + ' 23:59:59');
            $scope.dashboard.earlyGoing.startDate = new Date($scope.dashboard.earlyGoing.endDate.getTime()+1000-(7*24*3600*1000));
            $scope.getEarlyGoingData($scope.dashboard.earlyGoing.startDate, $scope.dashboard.earlyGoing.endDate);
        };

        $scope.getAvgWorkingHourData = function(startDate, endDate, groupId, subGroupId) {
            if(!angular.isDate(startDate) || !angular.isDate(endDate)) { return false; }
            $scope.dashboard.avgWorkingHour.chart.visible = false;
            var tempDate = new Date(startDate.getTime() + (endDate.getTime()-startDate.getTime()));
            $scope.dashboard.avgWorkingHour.selectedMonthYear = $scope.months[tempDate.getMonth()] + ' ' + tempDate.getFullYear();
            startDate = parseInt(startDate.getTime()/1000);
            endDate = parseInt(endDate.getTime()/1000);
            var url = service.getUrl('avgWorkingHour') + '/' + startDate + '/' + endDate;
            if(groupId) {
                if(!subGroupId) {
                    $scope.dashboard.avgWorkingHour.selectedSubGroup = $scope.dashboard.avgWorkingHour.selectedGroup.element_details[0];
                    subGroupId = $scope.dashboard.avgWorkingHour.selectedSubGroup._id;
                }
                url += '/' + groupId + '/' + subGroupId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.dashboard.avgWorkingHour.chart.data = service.buildWorkingHourChartData('Hours', utilityService.getValue(data, 'data'));
                if(groupId && subGroupId){
                    $scope.dashboard.avgWorkingHour.chart.chartConfig.title = $scope.dashboard.avgWorkingHour.selectedGroup.name;
                    $scope.dashboard.avgWorkingHour.chart.chartConfig.subtitle = $scope.dashboard.avgWorkingHour.selectedSubGroup.name;
                } else {
                    $scope.dashboard.avgWorkingHour.chart.chartConfig.title = "Overall";
                    $scope.dashboard.avgWorkingHour.chart.chartConfig.subtitle = null;
                }
                $scope.dashboard.avgWorkingHour.chart.visible = true;
            });
        };
        var getAvgWorkingHourDetails = function () {
            var currentDate = utilityService.dateToString(new Date(), '/', 'ymd');
            $scope.dashboard.avgWorkingHour.endDate = new Date(currentDate + ' 23:59:59');
            $scope.dashboard.avgWorkingHour.startDate = new Date($scope.dashboard.avgWorkingHour.endDate.getTime()+1000-(7*24*3600*1000));
            $scope.getAvgWorkingHourData($scope.dashboard.avgWorkingHour.startDate, $scope.dashboard.avgWorkingHour.endDate);
        };

        $scope.getEmployeesByWorkingHourData = function(startDate, endDate, groupId, subGroupId) {
            if(!angular.isDate(startDate) || !angular.isDate(endDate)) { return false; }
            $scope.dashboard.employeesByWorkingHour.employees.visible = false;
            startDate = parseInt(startDate.getTime()/1000);
            endDate = parseInt(endDate.getTime()/1000);
            var url = service.getUrl('employeesByWorkingHour') + '/' + startDate + '/' + endDate;
            if(groupId) {
                if(!subGroupId) {
                    $scope.dashboard.employeesByWorkingHour.selectedSubGroup = $scope.dashboard.employeesByWorkingHour.selectedGroup.element_details[0];
                    subGroupId = $scope.dashboard.employeesByWorkingHour.selectedSubGroup._id;
                }
                url += '/' + groupId + '/' + subGroupId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.dashboard.employeesByWorkingHour.employees.topList = utilityService.getInnerValue(data, 'data', 'top_employees', []);
                $scope.dashboard.employeesByWorkingHour.employees.bottomList = utilityService.getInnerValue(data, 'data', 'bottom_employees', []);
                $scope.dashboard.employeesByWorkingHour.employees.visible = true;
            });
        };
        var getEmployeesByWorkingHourDetails = function () {
            var currentDate = utilityService.dateToString(new Date(), '/', 'ymd');
            $scope.dashboard.employeesByWorkingHour.endDate = new Date(currentDate + ' 23:59:59');
            $scope.dashboard.employeesByWorkingHour.startDate = new Date($scope.dashboard.employeesByWorkingHour.endDate.getTime()+1000-(30*24*3600*1000));
            $scope.dashboard.employeesByWorkingHour.days = 30;
            $scope.getEmployeesByWorkingHourData($scope.dashboard.employeesByWorkingHour.startDate, $scope.dashboard.employeesByWorkingHour.endDate);
        };

        $scope.getWeeklyMonthlyData = function(section, byWeekMonth, nextPre) {
            var startDate = utilityService.getInnerValue($scope.dashboard, section, 'startDate');
            var endDate = utilityService.getInnerValue($scope.dashboard, section, 'endDate');
            if(startDate && endDate && byWeekMonth && nextPre) {
                startDate = new Date(startDate);
                endDate = new Date(endDate);
                if(byWeekMonth === 'week') {
                    if(nextPre === 'next') {
                        startDate = new Date(startDate.setDate(startDate.getDate()+7));
                        endDate = new Date(endDate.setDate(endDate.getDate()+7));
                    } else {
                        startDate = new Date(startDate.setDate(startDate.getDate()-7));
                        endDate = new Date(endDate.setDate(endDate.getDate()-7));
                    }
                }
                if(byWeekMonth === 'month') {
                    var tempDate = new Date(startDate.getTime() + (endDate.getTime()-startDate.getTime()));
                    if(nextPre === 'next') {
                        tempDate = new Date(tempDate.setMonth(tempDate.getMonth() + 1));
                    } else {
                        tempDate = new Date(tempDate.setMonth(tempDate.getMonth() - 1));
                    }
                    tempDate = tempDate.setDate(1);
                    tempDate = utilityService.dateToString(tempDate, '/', 'ymd');
                    startDate = new Date(tempDate + ' 00:00:00');
                    endDate = new Date(startDate.getTime()-1000+(7*24*3600*1000));
                }
                $scope.dashboard[section].startDate = startDate;
                $scope.dashboard[section].endDate = endDate;
                var argArr = [
                    $scope.dashboard[section].startDate,
                    $scope.dashboard[section].endDate,
                    utilityService.getInnerValue($scope.dashboard[section], 'selectedGroup', '_id'),
                    utilityService.getInnerValue($scope.dashboard[section], 'selectedSubGroup', '_id')
                ];
                switch (section) {
                    case 'presentEmployee':
                        $scope.getPresentEmployeeData(argArr[0], argArr[1], argArr[2], argArr[3]);
                        break;
                    case 'lateComing':
                        $scope.getLateComingData(argArr[0], argArr[1], argArr[2], argArr[3]);
                        break;
                    case 'earlyGoing':
                        $scope.getEarlyGoingData(argArr[0], argArr[1], argArr[2], argArr[3]);
                        break;
                    case 'avgWorkingHour':
                        $scope.getAvgWorkingHourData(argArr[0], argArr[1], argArr[2], argArr[3]);
                        break;
                }
            }
        };
        $scope.employeesByWorkingHourDataByDays = function() {
            var days = utilityService.getInnerValue($scope.dashboard, 'employeesByWorkingHour', 'days');
            var currentDate = utilityService.dateToString(new Date(), '/', 'ymd');
            currentDate = new Date(currentDate + ' 23:59:59');
            if(angular.isNumber(days)) {
                $scope.dashboard.employeesByWorkingHour.endDate = currentDate;
                $scope.dashboard.employeesByWorkingHour.startDate = new Date(currentDate.getTime()+1000-(days*24*3600*1000));
                $scope.getEmployeesByWorkingHourData($scope.dashboard.employeesByWorkingHour.startDate, $scope.dashboard.employeesByWorkingHour.endDate, utilityService.getInnerValue($scope.dashboard.employeesByWorkingHour, 'selectedGroup', '_id'), utilityService.getInnerValue($scope.dashboard.employeesByWorkingHour, 'selectedSubGroup', '_id'));
            }
        };
        $scope.isDisableNavigation = function(startDate, endDate, navigator) {
            if(!angular.isDate(startDate) || !angular.isDate(endDate)) { return false; }
            if(navigator === 'month') {
                var tempDate = new Date(startDate.getTime() + (endDate.getTime()-startDate.getTime()));
                return (tempDate.getFullYear() === new Date().getFullYear()) && (tempDate.getMonth() === new Date().getMonth());
            }
            if(navigator === 'week') {
                var today = new Date().getTime();
                return (startDate.getTime() <= today) && (endDate.getTime() >= today);
            }
            return false;
        };

        var getGroupDetails = function() {
            var url = service.getUrl('allmandatorygroup');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.groupList = data.data;
                $scope.dashboard.presentEmployee.groups = data.data;
                $scope.dashboard.lateComing.groups = data.data;
                $scope.dashboard.earlyGoing.groups = data.data;
                $scope.dashboard.avgWorkingHour.groups = data.data;
                $scope.dashboard.employeesByWorkingHour.groups = data.data;
            });
        };

        var initializeDashboard = function() {
            getShiftsList();
            getPresentEmployeeDetails();
            getLateComingDetails();
            getEarlyGoingDetails();
            getAvgWorkingHourDetails();
            getEmployeesByWorkingHourDetails();
            if(!service.groupList || !service.groupList.length) {
                getGroupDetails();
            }
        };
        initializeDashboard();
        // console.log($scope);
    }
]);