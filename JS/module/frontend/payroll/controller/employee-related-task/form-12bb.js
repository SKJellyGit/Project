app.controller('PayrollAdminForm12bbController', [
    '$scope', 'utilityService', 'ServerUtilityService', 'AdminForm12bbService',
    function ($scope, utilityService, serverUtilityService, service) {

        var allFilterObject = service.buildAllFilterObject();
        $scope.resetAllTypeFilters();
        $scope.assessmentYear = service.buildAssessmentYearObject();        
        $scope.employee = service.buildEmployeeObject();
        $scope.adminForms = service.buildAdminFormsObject();        

        var form12bbEmployeeListCallback = function (data, flag) {
            angular.forEach(data, function (v, k) {
                v.full_name = utilityService.getInnerValue(v, 'employee_preview', 'full_name');
                v.employee_id = utilityService.getInnerValue(v, 'employee_preview', 'personal_profile_employee_code');
                v.employee_status = v.employee_preview.system_plans_employee_status;                
                $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject, v);
            });
        };
        getForm12bbEmployeeList = function () {
            $scope.employee.visible = false;
            var url = service.getUrl('employeeList')
                + "/" + parseInt($scope.assessmentYear.start, 10)
                + "/" + (parseInt($scope.assessmentYear.start, 10) + 1)
                + "/" + $scope.adminForms.selected;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    form12bbEmployeeListCallback(data.data, true);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.employee.list = data.data;
                    $scope.employee.visible = true;
                });
        };
        getForm12bbEmployeeList();                
        $scope.viewDownloadForm12bb = function (item, action) {
            var url = service.getUrl('viewDownloadTaxForm12bb') 
                + "/" + action
                + "/" + parseInt($scope.assessmentYear.start, 10)
                + "/" + (parseInt($scope.assessmentYear.start, 10) + 1)
                + "/" +  $scope.adminForms.selected.toUpperCase() + "/" 
                + utilityService.getInnerValue(item, 'employee_preview', '_id');

            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.changeAssessmentYearHandler = function() {
            getForm12bbEmployeeList();
        };
        $scope.sortBy = function(propertyName) {
            $scope.employee.reverse = ($scope.employee.propertyName === propertyName) ? !$scope.employee.reverse : false;
            $scope.employee.propertyName = propertyName;
        };
        
        $scope.updatePaginationSettings('payroll_emp_form_12bb');
    }
]);