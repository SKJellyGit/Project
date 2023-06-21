app.controller('PayrollEmployeeAttendanceController', [
    '$scope', '$routeParams', '$location', '$timeout', '$window', '$route', 'PayrollOverviewService', 'utilityService', 'ServerUtilityService', 'TimeOffService', 'EmployeeTaskService', '$filter', '$routeParams', '$rootScope',
    function ($scope, $routeParams, $location, $timeout, $window, $route, PayrollOverviewService, utilityService, serverUtilityService, timeOffService, EmployeeTaskService, $filter, $routeParams, $rootScope) {
        var today = new Date();
        var month = today.getMonth();

        $scope.resetAllTypeFilters();
        $scope.attendanceList = [];
        $scope.isAttendanceListVisible = false;
        $scope.slectedYear = {
            month: month,
            year: $scope.yearList[0],
            monthYear: (month + 1) + "_" + $scope.yearList[0],
            currentYear: $scope.yearList[0],
            currentMonth: month+1
        };
        $scope.pendingCount = {
            lossOfPayDays: 0,
            notRequested: 0,
            pendingRequest: 0
        };
        $scope.attendance = {
            filteredList: []
        };
        $scope.csvColumn = {
            'Employee Detail': 'full_name',
            'Employee Id': 'employee_id',
            // 'Loss Of Pay Days': 'lwp_count',
            'Pending Request': 'total_pending_request'
        };
        $scope.legal_entity = {
            selected: null,
            entity_id: utilityService.getStorageValue("legalEntityId")
        };
        $scope.getLegalEntity = function() {
            if($scope.legal_entity.entity_id) {
                var entities_list = JSON.parse(utilityService.getStorageValue("legalEntityElements"));
                $scope.legal_entity.selected = entities_list.find(function(val) { return val._id == $scope.legal_entity.entity_id; });
            } else {
                $scope.legal_entity.selected = null;
            }
            $scope.attendanceExportFilename = 'attendance_list';
            if($scope.legal_entity.entity_id) {
                $scope.attendanceExportFilename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
        };
        $scope.getLegalEntity();

        var attendanceCallback = function (data, flag) {
            flag = angular.isDefined(flag) ? flag : false;
            $scope.pendingCount = {
                lossOfPayDays: 0,
                notRequested: 0,
                pendingRequest: 0,
                salary: 0
            };
            angular.forEach(data, function (v) {
                $scope.pendingCount.salary += 30000;
                v.full_name = v.employee_preview.full_name;
                v.employee_id = v.employee_preview.personal_profile_employee_code;
                v.employee_status = v.employee_preview.system_plans_employee_status;
                v.total_net_pay = $scope.pendingCount.salary;
                $scope.pendingCount.lossOfPayDays += v.lwp_count;
                $scope.pendingCount.pendingRequest += v.total_pending_request;
                if(flag && angular.isDefined(v.pending_request)){
                    v.pending_request = timeOffService.buildRequestList(v.pending_request);
                }
                if(flag && angular.isDefined(v.pending_leave_request)){
                    v.pending_leave_request = timeOffService.buildRequestList(v.pending_leave_request);
                }
            });
        };
        var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true,
                collection_key: 'employee_preview'
            },
            {
                countObject: 'employeeStatus',
                collection: [1, 2, 3, 4, 5],
                isArray: false,
                key: 'employee_status'
            },
            {
                countObject: 'salary',
                collection: [],
                isSalary:true
            }
        ];
        var getEmployeeAttendance = function () {
            var url = EmployeeTaskService.getUrl('attendanceList') + "/" + $scope.slectedYear.monthYear;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    attendanceCallback(data.data, true);
                    $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.attendanceList = data.data;
                    $timeout(function (){
                        $scope.isAttendanceListVisible = true;
                    }, 200);
                });
        };
        $scope.setMonthTab = function () {
            $scope.attendanceList = [];
            $scope.isAttendanceListVisible = false;
            $scope.slectedYear.monthYear = (parseInt($scope.slectedYear.month) + 1) + "_" + $scope.slectedYear.year;
            getEmployeeAttendance();
        };
        $scope.updateList = function (year) {
            $scope.attendanceList = [];
            $scope.isAttendanceListVisible = false;
            $scope.slectedYear.year = year;
            $scope.slectedYear.monthYear = (parseInt($scope.slectedYear.month) + 1) + "_" + year;
            getEmployeeAttendance();
        };        
        $scope.approveRejectAttendance = function (comment, status, item) {
            var id = angular.isObject(item._id) ? item._id.$id : item._id,
                url = EmployeeTaskService.getUrl('approveRejectAtt') + "/" + id,
                payload = {
                    comment: comment,
                    status: status
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data){
                    if(data.status == 'success'){
                        utilityService.showSimpleToast(data.message);
                        getEmployeeAttendance();
                    }
                });            
        };        
        $scope.approveRejectLeave = function (status, item, requestItem) {
            var url = EmployeeTaskService.getUrl('approveRejectLeave'),
                payload = [{
                    employee_id: item.employee_preview._id,
                    request_ids: [requestItem._id],
                    comment: status == 2 ? "Rejected" : "Approved",
                    status: status
                }];

            serverUtilityService.postWebService(url, payload)
                .then(function (data){
                    if(data.status == 'success'){
                        utilityService.showSimpleToast(data.message);
                        getEmployeeAttendance();
                    }
                });
        };
        $scope.updatePaginationSettings('payroll_emp_attn');        

    }
]);