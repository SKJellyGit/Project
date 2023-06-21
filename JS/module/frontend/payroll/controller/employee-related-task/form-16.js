app.controller('PayrollAdminForm16Controller', [
    '$scope', 'utilityService', 'ServerUtilityService', 'AdminForm16Service','$timeout','$modal',
    function ($scope, utilityService, serverUtilityService, service, $timeout, $modal) {

        var allFilterObject = service.buildAllFilterObject();
        $scope.resetAllTypeFilters();
        $scope.assessmentYear = service.buildAssessmentYearObject();        
        $scope.employee = service.buildEmployeeObject();
        $scope.adminForms = service.buildAdminFormsObject($scope.adminCompensationForm);
        $scope.quarter = service.buildQuarterList()
        $scope.upload = {
            file: null,
            year: $scope.assessmentYear.start,
            quarter: $scope.quarter.selected
        }
        $scope.errorMessages = null
        $scope.formNames = {
         "A":"Form 16 Part A",
         "B": "Form 16 Part B",
         "AQ": "Form 16 Part A Quarterly",
        }
        var form16EmployeeListCallback = function (data, flag) {
            angular.forEach(data, function (v, k) {
                v.full_name = utilityService.getInnerValue(v, 'employee_preview', 'full_name');
                v.employee_id = v.employee_preview.personal_profile_employee_code;
                v.employee_status = v.employee_preview.system_plans_employee_status;                
                $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject, v);
            });
        };
        $scope.checkForQuarterEnabled = function (slug) {
            var enabled = false;
            angular.forEach($scope.adminForms.list, function (val) {
                if (val.slug === slug && val.quarter) {
                    enabled = true;
                }
            });
            return enabled;
        };
        getForm16EmployeeList = function () {
            $scope.employee.list=[]
            $scope.employee.visible = false;
            var url = service.getUrl('employeeList')
                    + "/" + parseInt($scope.assessmentYear.start, 10)
                    + "/" + (parseInt($scope.assessmentYear.start, 10) + 1);
            if ($scope.checkForQuarterEnabled($scope.adminForms.selected)) {
                url += "/A/" + $scope.quarter.selected;
            } else {
                url += "/" + $scope.adminForms.selected;
            }

            serverUtilityService.getWebService(url).then(function (data) {
                form16EmployeeListCallback(data.data, true);
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                $scope.employee.list = data.data;
                $scope.employee.visible = true;
            });
        };
        getForm16EmployeeList();                
        $scope.viewDownloadForm16 = function (item, action) {
            var url = service.getUrl('viewDownloadTaxForm16') 
                + "/" + action
                + "/" + parseInt($scope.assessmentYear.start, 10)
                + "/" + (parseInt($scope.assessmentYear.start, 10) + 1);
            url += "/" + ($scope.checkForQuarterEnabled($scope.adminForms.selected)
                ? "A" : $scope.adminForms.selected);
            url += "/" + utilityService.getInnerValue(item, 'employee_preview', '_id')
            if ($scope.checkForQuarterEnabled($scope.adminForms.selected)) {
                url += "/" + $scope.quarter.selected
            }

            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.changeAssessmentYearHandler = function() {
            getForm16EmployeeList();
            $scope.clearSalarySlip();
        };
        $scope.changeFormTypeHandler = function() {
            getForm16EmployeeList();
            $scope.clearSalarySlip();
        };
        $scope.sortBy = function(propertyName) {
            $scope.employee.reverse = ($scope.employee.propertyName === propertyName) ? !$scope.employee.reverse : false;
            $scope.employee.propertyName = propertyName;
        };

        $scope.setFileObject = function(files){
            $scope.upload.file = files;
        };
        $scope.bindSalarySlipFileChangeEvent = function () {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    $scope.isSlipUploaded = true;
                });
            }, 100);
        };
        $scope.uploadform16quarter = function () {
            // resetErrorMessages();
            $scope.errorMessages = null
            $scope.errorMessageArray = null
            var type = $scope.adminForms.selected,
                    ayFrom = $scope.assessmentYear.start,
                    ayTo = $scope.assessmentYear.start + 1;
                    
                    if(type === 'AQ'){
                        type = 'A'
                        var quarter = $scope.quarter.selected;
                    }
            var url = service.getUrl('AQU') + '/' + type + '/' + ayFrom + '/' + ayTo,
                    payload = {
                        form_16: $scope.upload.file
                    };

                    if(quarter){
                        url = url + '/' + quarter;
                     }

            serverUtilityService.uploadWebService(url, payload).then(function (data) {
                if (data.status == "success") {
                    utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                    getForm16EmployeeList()
                } else {
                    $scope.errorMessageArray = utilityService.getInnerValue(data, 'data', 'errors')
                            ? utilityService.getInnerValue(data, 'data', 'errors')
                            : utilityService.getValue(data, 'errors');
                    $scope.errorMessages = buildError(data);
                    $scope.openModal('error_upload_files_in_bulk.html', 'errorUploadBulkFile')
                    getForm16EmployeeList()
                }
            });
        };
        $scope.clearSalarySlip = function(){
            $scope.isSlipUploaded = false;
            $scope.upload.file = null;
            $scope.errorMessages = null

        };   

        var buildError = function (data) {
            var error = []
            if (data.status == "error") {
                error.push(data.message);
            } else if (data.data.status == 'error') {
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            error.push(v);
                        });
                    });
                } else {
                    error.push(data.data.message);
                }
            }
            return error;
        }

        $scope.openHelpingText = function () {
            $scope.openModal('Instructions_to_upload_files_in_bulk.html', 'InstructionsToUpload')
        }

        /********* Start Angular Modal Section *********/
        $scope.openModal = function(templateUrl, keyName) {
            $scope.modalInstance[keyName] = $modal.open({
                templateUrl : templateUrl,
                scope : $scope,
                windowClass: 'fadeEffect',
                controller: 'ModalInstanceCtrl',
                //backdrop: 'static',
                size: 'lg'
            });
        };
        $scope.closeModal = function (keyName) {
            $scope.modalInstance[keyName].dismiss('cancel');
        };
        /********* End Angular Modal Section *********/

       

        $scope.updatePaginationSettings('payroll_emp_form_16');
    }
]);