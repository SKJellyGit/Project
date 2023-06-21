app.controller('PayrollSlipController', [
    '$scope', '$timeout', '$modal', '$mdDialog', 'utilityService', 'ServerUtilityService', 'EmployeeTaskService', 'SlipService', 'AdminForm12bbService', 'AdminForm16Service',
    function ($scope, $timeout, $modal, $mdDialog, utilityService, serverUtilityService, EmployeeTaskService, service, from12bbService, form16bService ) {
        var today = new Date(),
            month = today.getMonth(),
            allFilterObject = service.buildAllFilterObject();

        $scope.resetAllTypeFilters();
        $scope.updatePaginationSettings('payroll_emp_salary_slips');
        $scope.slip = service.buildSlipObject();        
        $scope.slectedYear = {
            month: month,
            year: $scope.yearList[0],
            monthYear: (month + 1) + "_" + $scope.yearList[0],
            currentYear: $scope.yearList[0],
            currentMonth: month + 1
        };
        $scope.disabledBulkGenerate = true

        var getEmployeeListCallback = function (data, flag) {
            angular.forEach(data, function (v, k) {                
                v.full_name = utilityService.getInnerValue(v,'employee_preview','full_name');
                v.employee_id = utilityService.getInnerValue(v, 'employee_preview', 'personal_profile_employee_code');
                v.employee_status = utilityService.getInnerValue(v, 'employee_preview', 'system_plans_employee_status');
                $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject, v);
            });
        };        
        var getEmployeeList = function () {
            $scope.slip.list = [];
            $scope.slip.visible = false;

            var url, 
                params = {}, 
                month = parseInt($scope.slectedYear.month, 10) + 1,
                year = parseInt($scope.slectedYear.year, 10);

            if (utilityService.getInnerValue($scope.slip, 'type', 'value') == 101) {
                var year = parseInt($scope.slectedYear.year, 10);
                url = from12bbService.getUrl('employeeList') + "/" + year + "/" + (year + 1) + "/bb";
            } else if (utilityService.getInnerValue($scope.slip, 'type', 'value') == 4) {
                // url = EmployeeTaskService.getUrl('relievedEmployees') + "/" + month + "/" + year + "/" +
                //     utilityService.getInnerValue($scope.slip, 'type', 'value');
                url = EmployeeTaskService.getUrl('fnfEmployeesForPayroll') + "/" + month + "/" + year;
            } else if(utilityService.getInnerValue($scope.slip, 'type', 'value') == 102) { 
                var year = parseInt($scope.slectedYear.year, 10);
                url = form16bService.getUrl('employeeList') + "/" + year + "/" + (year + 1) + "/B";
            } else {
                url = EmployeeTaskService.getUrl('salarySlip') + "/" + $scope.slectedYear.monthYear;
                params.slip_type = $scope.slip.type.value;
            }
            
            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    getEmployeeListCallback(data.data, true);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.slip.list = utilityService.getValue(data, 'data', []);
                    $timeout(function () {
                        $scope.slip.isAllChecked = false;
                        $scope.slip.visible = true;
                    }, 200);
                });
        };
        $scope.setMonthTab = function () {
            $scope.slip.list = [];
            $scope.slip.visible = false;
            $scope.slectedYear.monthYear = (parseInt($scope.slectedYear.month) + 1) + "_" + $scope.slectedYear.year;
            getEmployeeList();
        };
        $scope.updateList = function (year) {
            $scope.slip.list = [];
            $scope.slip.visible = false;
            $scope.slectedYear.year = year;
            $scope.slectedYear.monthYear = (parseInt($scope.slectedYear.month) + 1) + "_" + year;
            getEmployeeList();
        };        
        $scope.viewDownloadSalarySlip = function (item, action) {
            var url = EmployeeTaskService.getUrl('salarySlipViewDownload') 
                + "/" + $scope.slectedYear.year 
                + "/" + (parseInt($scope.slectedYear.month, 10) + 1)
                + "/" + $scope.slip.type.value + "/"+ action + "/"+ item.employee_preview._id;

            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.viewDownloadTaxSlip = function (item, action) {
            var url = service.getUrl('viewDownloadTaxSlip') 
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
                getEmployeeList();
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            } else {
                if($scope.slip.action.value == 2) {
                    generateErrorCallback(data);
                } else if($scope.slip.action.value == 3 || $scope.slip.action.value == 4) {
                    releaseErrorCallback(data);
                }
            }
        };
        var showAlert = function(ev) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Alert!')
                    .textContent('It seems that you have not selected any employee(s). Please select employee(s) first.')
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
        var generateSlip = function(employees) {
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
                });
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
        $scope.generateIndividualSlip = function(item) {
            generateSlip(new Array(item.employee_preview._id));
        };
        $scope.generateBulkSlip = function() {
            generateSlip(service.extractCheckedEmpIds($scope.slip.filteredList));
        };
        $scope.releaseIndividualSlip = function(item) {
            releaseEmployeeSlip(new Array(item.employee_preview._id));
        };
        $scope.releaseBulkSlip = function() {
            releaseEmployeeSlip(service.extractCheckedEmpIds($scope.slip.filteredList));
        };
        $scope.changeSlipType = function() {
            $scope.slip.action.value = 1;
            $scope.slip.template.value = 1;
            getEmployeeList();
        };
        $scope.syncDataBeforeClosing = function(keyName) {
            getEmployeeList();
            $scope.closeModal(keyName);
        };
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
        $scope.checkUnCheckAll = function(flag) {
            angular.forEach($scope.slip.filteredList, function (v, k) {
                v.isChecked = flag && v.slip_detail.can_generate;                
            });    
            var employees = service.extractCheckedEmpIds($scope.slip.filteredList) 
            if(employees.length && flag) {
                $scope.disabledBulkGenerate = false
            }else{
                $scope.disabledBulkGenerate = true
            }      
        };
        $scope.checkIfBulkDisabled = function(){
            var employees = service.extractCheckedEmpIds($scope.slip.filteredList) 
            if(employees.length) {
                $scope.disabledBulkGenerate = false
            }else{
                $scope.disabledBulkGenerate = true
            }   
        }
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
        $scope.downloadZipFile = function () {
            var url = service.getUrl('downloadZip') + "/" + $scope.slip.type.value 
                + "/" + $scope.slectedYear.year + "/" + (parseInt($scope.slectedYear.month, 10) + 1);

            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.sortBy = function(propertyName) {
            $scope.slip.reverse = ($scope.slip.propertyName === propertyName) ? !$scope.slip.reverse : false;
            $scope.slip.propertyName = propertyName;
        };
        $scope.viewDownloadForm12bb = function (item, action) {
            var url = from12bbService.getUrl('viewDownloadTaxForm12bb') 
                + "/" + action
                + "/" + parseInt($scope.slectedYear.year, 10)
                + "/" + (parseInt($scope.slectedYear.year, 10) + 1)
                + "/BB/" 
                + utilityService.getInnerValue(item, 'employee_preview', '_id');

            $scope.viewDownloadFileUsingForm(url);
        };

        $scope.viewDownloadForm16 = function (item, action) {
            var url = form16bService.getUrl('viewDownloadTaxForm16') 
                + "/" + action
                + "/" + parseInt($scope.slectedYear.year, 10)
                + "/" + (parseInt($scope.slectedYear.year, 10) + 1)
                + "/B/" 
                + utilityService.getInnerValue(item, 'employee_preview', '_id');

            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.downloadFormZipFile = function () {
            var url = service.getUrl('downloadFormZip') + "/12bb" 
                + "/" + $scope.slectedYear.year + "/" + (parseInt($scope.slectedYear.year, 10) + 1);

            $scope.viewDownloadFileUsingForm(url);
        };

    }
]);