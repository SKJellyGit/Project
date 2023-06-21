app.controller('PayrollSalarySlipController', [
    '$scope', '$timeout', 'utilityService', 'ServerUtilityService', 'EmployeeTaskService','SlipService','$mdDialog', '$modal','RunPayrollService',
    function ($scope, $timeout, utilityService, serverUtilityService, EmployeeTaskService, service, $mdDialog, $modal, RunPayrollService) {
        var today = new Date();
        var month = today.getMonth();
        $scope.slip = service.buildSlipObject();   
        $scope.resetAllTypeFilters();
        $scope.salarySlip = [];
        $scope.isAttendanceListVisible = false;        
        $scope.updatePaginationSettings('payroll_emp_salary_slip');
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
        $scope.tabIndexSlipTypeMaping = {
            9: 1,
            10: 2,
            11: 3
        };
        $scope.disabledBulkGenerate = true
        $scope.canGenerateSalarySlip = false
        $scope.canReleaseSalarySlip = false
        $scope.canGenerateTaxSlip = false
        $scope.canReleaseTaxSlip = false
        if($scope.tab.employeeTaskRelatedchildTab == 10){
            $scope.slip.type.value = 2;
        }
        var salarySlipCallback = function (data, flag) {
            angular.forEach(data, function (v, k) {
                v.full_name = utilityService.getInnerValue(v, 'employee_preview', 'full_name');
                v.employee_id = utilityService.getInnerValue(v, 'employee_preview', 'personal_profile_employee_code');
                v.employee_status = utilityService.getInnerValue(v, 'employee_preview', 'system_plans_employee_status');
                $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject, v);
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
                collection: [1,2,3,4,5],
                isArray: false,
                key: 'employee_status'
            }
        ];
        var getEmployeeAttendance = function () {
            var url = EmployeeTaskService.getUrl('salarySlip') + "/" + $scope.slectedYear.monthYear,
                params = {
                    slip_type: $scope.tabIndexSlipTypeMaping[$scope.tab.employeeTaskRelatedchildTab]
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    salarySlipCallback(data.data, true);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.salarySlip = data.data;
                    $timeout(function (){
                        $scope.isAttendanceListVisible = true;
                    }, 200);
                });
        };
        $scope.setMonthTab = function () {
            $scope.salarySlip = [];
            $scope.isAttendanceListVisible = false;
            $scope.slectedYear.monthYear = (parseInt($scope.slectedYear.month) + 1) + "_" + $scope.slectedYear.year;
            getEmployeeAttendance();
        };
        $scope.updateList = function (year) {
            $scope.salarySlip = [];
            $scope.isAttendanceListVisible = false;
            $scope.slectedYear.year = year;
            $scope.slectedYear.monthYear = (parseInt($scope.slectedYear.month) + 1) + "_" + year;
            getEmployeeAttendance();
        };        
        $scope.approveRejectAttendance = function (comment, status, item){
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
        $scope.approveRejectLeave = function (status, item, requestItem){
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
        $scope.attendance = {
            filteredList: []
        };
        $scope.csvColumn = {
            'Employee Detail': 'full_name',
            'Employee Id': 'employee_id',
            'Loss Of Pay Days': 'lwp_count',
            'Pending Requests': 'total_pending_request'
        };        
        $scope.viewDownloadProof = function (item, action, slipType) {
            slipType = slipType || 1;
            var url = EmployeeTaskService.getUrl('salarySlipViewDownload') 
                + "/" + $scope.slectedYear.year 
                + "/" + (parseInt($scope.slectedYear.month, 10) + 1)
                + "/" + slipType + "/"+ action + "/"+ item.employee_preview._id;

            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.viewDownloadTaxSlip = function (item, action) {
            var url = EmployeeTaskService.getUrl('taxSlipViewDownload') 
                + "/" + $scope.slectedYear.year 
                + "/" + (parseInt($scope.slectedYear.month, 10) + 1)
                + "/" + action + "/"+ item.employee_preview._id;

            $scope.viewDownloadFileUsingForm(url);
        };
        var generateErrorCallback = function(data) {
            var errorList = utilityService.getValue(data, 'error_list', []);
            angular.forEach(errorList, function(value, key) {
                $scope.slip.error.list.push(value);
            });
            // if (!$scope.slip.error.list.length) {
            //     $scope.slip.error.list.push('Some error has been occured.');
            // } 
            $scope.slip.error.section = 'generate';               
            $scope.openModal('slip.tmpl.html', 'slip');
        };
        var releaseErrorCallback = function(data) {
            angular.copy(utilityService.getValue(data, 'error_list'), $scope.slip.error.object);
            $scope.slip.error.section = 'release';               
            $scope.openModal('slip.tmpl.html', 'slip');
        };
        var generateReleaseCallback = function(data) {
            $scope.slip.isButtonDisabled = false;            
            if (utilityService.getValue(data, 'status') == 'success') {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                $scope.slip.isAllChecked = false
                $scope.isAttendanceListVisible = false;
                getEmployeeAttendance();
            } else {
                if($scope.slip.action.value == 2) {
                    generateErrorCallback(data);
                } else if($scope.slip.action.value == 3 || $scope.slip.action.value == 4) {
                    releaseErrorCallback(data);
                }
            }
        };
        var releaseEmployeeSlip = function(employees) {
            if(!employees.length) {
                showAlert();
                return false;
            }
            $scope.slip.error.list = [];
            $scope.slip.isButtonDisabled = true;

            var url = service.getUrl('releaseSlip');
            if ($scope.slip.action.value == 4) {
                url = url + '?sendMail=yes';
            }
            var payload = service.buildReleaseSlipPayload($scope.slip, employees, $scope.slectedYear);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    generateReleaseCallback(data);                  
                });
        };

        var generateSlip = function(employees) {
            $scope.loader = true
            if(!employees.length) {
                showAlert();
                return false;
            }
            var url = null,
                payload = null;

            $scope.slip.error.list = [];
            $scope.slip.isButtonDisabled = true;           

            if (utilityService.getInnerValue($scope.slip, 'type', 'value') == 101) {
                url = service.getUrl('generateForm12bb');
                payload = service.buildGenerateFormPayload(employees, $scope.slectedYear);
            } else if(utilityService.getInnerValue($scope.slip, 'type', 'value') == 102) {
                url = service.getUrl('generateForm16B');
                payload = service.buildGenerateFormPayload(employees, $scope.slectedYear);
            } else {            
                if ($scope.slip.type.value == 1) {
                    url = service.getUrl('generateSalarySlip');
                } else if ($scope.slip.type.value == 2) {
                    url = service.getUrl('generateTaxSlip');
                } else if ($scope.slip.type.value == 3 || $scope.slip.type.value == 4) {
                    url = service.getUrl('generateSlip') + "/" + $scope.slip.type.value;                    
                }
                
                payload = service.buildGenerateSlipPayload($scope.slip, employees, $scope.slectedYear);
            }
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    generateReleaseCallback(data);
                }).finally(function(){
                    console.log('finally')
                    $scope.loader = false
                });
        };

        $scope.generateIndividualSlip = function(item) {
            generateSlip(new Array(item.employee_preview._id));
        };
        $scope.releaseIndividualSlip = function(item) {
            releaseEmployeeSlip(new Array(item.employee_preview._id));
        };
        $scope.generateBulkSlip = function() {
            generateSlip(service.extractCheckedEmpIds($scope.attendance.filteredList));
        };
        $scope.releaseBulkSlip = function() {
            releaseEmployeeSlip(service.extractCheckedEmpIds($scope.attendance.filteredList));
        };

        var showConfirmDialog = function(ev, functionName, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to proceed with this?')
                .textContent('Please double check every thing before taking this action.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('No, want to cancel');

            $mdDialog.show(confirm).then(function() {
                functionName(item);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function(event, functionName, item) {
            showConfirmDialog(event, functionName, item);
        };

        $scope.checkUnCheckAll = function(flag) {
            angular.forEach($scope.attendance.filteredList, function (v, k) {
                v.isChecked = flag && v.slip_detail.can_generate;                
            });    
            var employees = service.extractCheckedEmpIds($scope.attendance.filteredList) 
            if(employees.length && flag) {
                $scope.disabledBulkGenerate = false
            }else{
                $scope.disabledBulkGenerate = true
            }      
        };

        $scope.checkIfBulkDisabled = function(){
            var employees = service.extractCheckedEmpIds($scope.attendance.filteredList) 
            if(employees.length) {
                $scope.disabledBulkGenerate = false
            }else{
                $scope.disabledBulkGenerate = true
            }   
        }
        $scope.openModal = function (templateUrl, keyName){
            $scope.modalInstance[keyName] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass:'fadeEffect'
            });
        };        
        $scope.closeModal = function(keyName) {
            if(utilityService.getValue($scope.modalInstance, keyName)) {
                $scope.modalInstance[keyName].dismiss();
            }            
        };

        $scope.syncDataBeforeClosing = function(keyName) {
            $scope.slip.isAllChecked = false
            $scope.isAttendanceListVisible = false;
            getEmployeeAttendance();
            $scope.closeModal(keyName);
        };

        var getPayrollModulePermissions = function () {
            var url = RunPayrollService.getUrl('modulePermission') + '/payroll'; 
            serverUtilityService.getWebService(url)
                .then(function (data){
                    var response = utilityService.getValue(data, 'data', []);
                    angular.forEach(response, function(value){
                        if(value.permission_slug === 'can_generate_salary_slip'){
                            $scope.canGenerateSalarySlip = true
                        }
                        if(value.permission_slug === 'can_release_salary_slip'){
                            $scope.canReleaseSalarySlip = true
                        }
                        if(value.permission_slug === 'can_generate_tax_slip'){
                            $scope.canGenerateTaxSlip = true
                        }
                        if(value.permission_slug === 'can_release_tax_slip'){
                            $scope.canReleaseTaxSlip = true
                        }
                        
                    })

                });
        };
        getPayrollModulePermissions()
    }
]);