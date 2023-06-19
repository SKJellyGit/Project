app.controller('DashboardAdminLeaveController', [
    '$scope', '$q', 'DashBoardAdminLeaveService', 'utilityService', 'ServerUtilityService', 
    function ($scope, $q, service, utilityService, serverUtilityService) {
        'use strict';
        var self = this;
        
        service.groupList = $scope.groupList;
        $scope.dashboard = service.buildDashboardObject();
        $scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $scope.currentYear = new Date().getFullYear();
        $scope.currentMonth = new Date().getMonth();
        $scope.leaveTypeList = null;

        $scope.getAllLeavesData = function(year, month, groupId, subGroupId) {
            if(!angular.isDefined(year) || !angular.isDefined(month)) { return false; }
            if(year == $scope.currentYear && month>$scope.currentMonth) {
                $scope.dashboard.allLeaves.selectedMonth = month = $scope.currentMonth;
            }
            $scope.dashboard.allLeaves.chart.visible = false;
            month = month + 1;
            var url = service.getUrl('allLeaves') + '/' + ((month>9 ? month : ('0'+month)) + '_' + year);
            if(groupId) {
                if(!subGroupId) {
                    $scope.dashboard.allLeaves.selectedSubGroup = $scope.dashboard.allLeaves.selectedGroup.element_details[0];
                    subGroupId = $scope.dashboard.allLeaves.selectedSubGroup._id;
                }
                url += '/' + groupId + '/' + subGroupId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.dashboard.allLeaves.chart.data = service.buildDataForPieChart(utilityService.getValue(data, 'data'));
                if(groupId && subGroupId){
                    $scope.dashboard.allLeaves.chart.chartConfig.title = $scope.dashboard.allLeaves.selectedGroup.name;
                    $scope.dashboard.allLeaves.chart.chartConfig.subtitle = $scope.dashboard.allLeaves.selectedSubGroup.name;
                } else {
                    $scope.dashboard.allLeaves.chart.chartConfig.title = "Overall";
                    $scope.dashboard.allLeaves.chart.chartConfig.subtitle = null;
                }
                $scope.dashboard.allLeaves.chart.visible = true;
            });
        };
        var buildAllLeavesDetails = function () {
            $scope.dashboard.allLeaves.years = utilityService.getLastFiveYearList();
            $scope.dashboard.allLeaves.months = $scope.months;
            $scope.dashboard.allLeaves.selectedYear = $scope.dashboard.allLeaves.years[$scope.dashboard.allLeaves.years.length-1];
            $scope.dashboard.allLeaves.selectedMonth = $scope.currentMonth;
            $scope.getAllLeavesData($scope.dashboard.allLeaves.selectedYear, $scope.dashboard.allLeaves.selectedMonth);
        };

        $scope.getPlanedUnplanedLeavesData = function(year, month, groupId, subGroupId) {
            if(!angular.isDefined(year) || !angular.isDefined(month)) { return false; }
            if(year == $scope.currentYear && month>$scope.currentMonth) {
                $scope.dashboard.planedUnplanedLeaves.selectedMonth = month = $scope.currentMonth;
            }
            $scope.dashboard.planedUnplanedLeaves.chart.visible = false;
            month = month + 1;
            var url = service.getUrl('planedUnplaned') + '/' + ((month>9 ? month : ('0'+month)) + '_' + year);
            if(groupId) {
                if(!subGroupId) {
                    $scope.dashboard.planedUnplanedLeaves.selectedSubGroup = $scope.dashboard.planedUnplanedLeaves.selectedGroup.element_details[0];
                    subGroupId = $scope.dashboard.planedUnplanedLeaves.selectedSubGroup._id;
                }
                url += '/' + groupId + '/' + subGroupId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.dashboard.planedUnplanedLeaves.chart.data = service.buildColumnChartData('Employees', utilityService.getValue(data, 'data'), 'random');
                if(groupId && subGroupId){
                    $scope.dashboard.planedUnplanedLeaves.chart.chartConfig.title = $scope.dashboard.planedUnplanedLeaves.selectedGroup.name;
                    $scope.dashboard.planedUnplanedLeaves.chart.chartConfig.subtitle = $scope.dashboard.planedUnplanedLeaves.selectedSubGroup.name;
                } else {
                    $scope.dashboard.planedUnplanedLeaves.chart.chartConfig.title = "Overall";
                    $scope.dashboard.planedUnplanedLeaves.chart.chartConfig.subtitle = null;
                }
                $scope.dashboard.planedUnplanedLeaves.chart.visible = true;
            });
        };
        var getPlanedUnplanedLeavesDetails = function () {
            $scope.dashboard.planedUnplanedLeaves.years = utilityService.getLastFiveYearList();
            $scope.dashboard.planedUnplanedLeaves.months = $scope.months;
            $scope.dashboard.planedUnplanedLeaves.selectedYear = $scope.dashboard.planedUnplanedLeaves.years[$scope.dashboard.planedUnplanedLeaves.years.length-1];
            $scope.dashboard.planedUnplanedLeaves.selectedMonth = $scope.currentMonth;
            $scope.getPlanedUnplanedLeavesData($scope.dashboard.planedUnplanedLeaves.selectedYear, $scope.dashboard.planedUnplanedLeaves.selectedMonth);
        };
        getPlanedUnplanedLeavesDetails();

        $scope.getLeastLeavesData = function(year, month, leaveType) {
            if(!angular.isDefined(year) || !angular.isDefined(month)) { return false; }
            if(year == $scope.currentYear && month>$scope.currentMonth) {
                $scope.dashboard.leastLeaves.selectedMonth = month = $scope.currentMonth;
            }
            $scope.dashboard.leastLeaves.chart.visible = false;
            month = month + 1;
            var url = service.getUrl('leastLeaves') + '/' + ((month>9 ? month : ('0'+month)) + '_' + year);
            if(leaveType) {
                url += '/' + leaveType;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.dashboard.leastLeaves.chart.data = service.buildColumnChartData('Number of Leaves', utilityService.getValue(data, 'data'), 'green');
                $scope.dashboard.leastLeaves.chart.chartConfig.title = leaveType ? $scope.dashboard.leastLeaves.selectedLeaveType.type_name : 'Overall';
                $scope.dashboard.leastLeaves.chart.visible = true;
            });
        };
        var getLeastLeavesDetails = function () {
            $scope.dashboard.leastLeaves.leaveType = $scope.leaveTypeList;
            $scope.dashboard.leastLeaves.years = utilityService.getLastFiveYearList();
            $scope.dashboard.leastLeaves.months = $scope.months;
            $scope.dashboard.leastLeaves.selectedLeaveType = $scope.leaveTypeList[0];
            $scope.dashboard.leastLeaves.selectedYear = $scope.dashboard.leastLeaves.years[$scope.dashboard.leastLeaves.years.length-1];
            $scope.dashboard.leastLeaves.selectedMonth = $scope.currentMonth;
            $scope.getLeastLeavesData($scope.dashboard.leastLeaves.selectedYear, $scope.dashboard.leastLeaves.selectedMonth, $scope.dashboard.leastLeaves.selectedLeaveType._id);
        };

        $scope.getMostLeavesData = function(year, month, leaveType) {
            if(!angular.isDefined(year) || !angular.isDefined(month)) { return false; }
            if(year == $scope.currentYear && month>$scope.currentMonth) {
                $scope.dashboard.mostLeaves.selectedMonth = month = $scope.currentMonth;
            }
            $scope.dashboard.mostLeaves.chart.visible = false;
            month = month + 1;
            var url = service.getUrl('mostLeaves') + '/' + ((month>9 ? month : ('0'+month)) + '_' + year);
            if(leaveType) {
                url += '/' + leaveType;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.dashboard.mostLeaves.chart.data = service.buildColumnChartData('Number of Leaves', utilityService.getValue(data, 'data'), 'red');
                $scope.dashboard.mostLeaves.chart.chartConfig.title = leaveType ? $scope.dashboard.mostLeaves.selectedLeaveType.type_name : 'Overall';
                $scope.dashboard.mostLeaves.chart.visible = true;
            });
        };
        var getMostLeavesDetails = function () {
            $scope.dashboard.mostLeaves.leaveType = $scope.leaveTypeList;
            $scope.dashboard.mostLeaves.years = utilityService.getLastFiveYearList();
            $scope.dashboard.mostLeaves.months = $scope.months;
            $scope.dashboard.mostLeaves.selectedLeaveType = $scope.leaveTypeList[0];
            $scope.dashboard.mostLeaves.selectedYear = $scope.dashboard.mostLeaves.years[$scope.dashboard.mostLeaves.years.length-1];
            $scope.dashboard.mostLeaves.selectedMonth = $scope.currentMonth;
            $scope.getMostLeavesData($scope.dashboard.mostLeaves.selectedYear, $scope.dashboard.mostLeaves.selectedMonth, $scope.dashboard.mostLeaves.selectedLeaveType._id);
        };

        var getAllLeaveTypes = function() {
            var url = service.getUrl('leaveType')+"?status=true";
            serverUtilityService.getWebService(url).then(function (data){
                $scope.leaveTypeList = utilityService.getValue(data, 'data');
                // getLeastLeavesDetails();
                getMostLeavesDetails();
            });
        };

        $scope.getLwpLeavesData = function(groupId, subGroupId) {
            $scope.dashboard.lwpLeaves.chart.visible = false;
            var url = service.getUrl('lwpLeaves');
            if(groupId) {
                if(!subGroupId) {
                    $scope.dashboard.lwpLeaves.selectedSubGroup = $scope.dashboard.lwpLeaves.selectedGroup.element_details[0];
                    subGroupId = $scope.dashboard.lwpLeaves.selectedSubGroup._id;
                }
                url += '/' + groupId + '/' + subGroupId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.dashboard.lwpLeaves.chart.data = service.buildColumnChartData('Days', utilityService.getValue(data, 'data'), 'red');
                if(groupId && subGroupId){
                    $scope.dashboard.lwpLeaves.chart.chartConfig.title = $scope.dashboard.lwpLeaves.selectedGroup.name;
                    $scope.dashboard.lwpLeaves.chart.chartConfig.subtitle = $scope.dashboard.lwpLeaves.selectedSubGroup.name;
                } else {
                    $scope.dashboard.lwpLeaves.chart.chartConfig.title = "Overall";
                    $scope.dashboard.lwpLeaves.chart.chartConfig.subtitle = null;
                }
                $scope.dashboard.lwpLeaves.chart.visible = true;
            });
        };

        var getGroupDetails = function() {
            var url = service.getUrl('allmandatorygroup');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.groupList = data.data;
                $scope.dashboard.allLeaves.groups = data.data;
                $scope.dashboard.planedUnplanedLeaves.groups = data.data;
                $scope.dashboard.lwpLeaves.groups = data.data;
            });
        };

        var initializeDashboard = function() {
            buildAllLeavesDetails();
            getPlanedUnplanedLeavesDetails();
            getAllLeaveTypes();
            $scope.getLwpLeavesData();
            if(!service.groupList || !service.groupList.length) {
                getGroupDetails();
            }
        };
        initializeDashboard();
        // console.log($scope);
    }
]);