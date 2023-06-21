app.controller('PayrollInvestmentDeclarationFormController', [
    '$scope', '$timeout', 'utilityService', 'ServerUtilityService', 'EmployeeTaskService',
    function ($scope, $timeout, utilityService, serverUtilityService, EmployeeTaskService) {
        $scope.invDeclaration = [];
        $scope.isAttendanceListVisible = false;
        $scope.updatePaginationSettings('inv_dec_form');

        var invDeclartionCallback = function (data, flag) {
            angular.forEach(data, function (v, k) {
                v.full_name = utilityService.getInnerValue(v,'employee_preview','full_name');
                v.employee_id = v.employee_preview.personal_profile_employee_code;
                v.employee_status = v.employee_preview.system_plans_employee_status;
            });
        };
        var getEmployeeAttendance = function () {
            var url = EmployeeTaskService.getUrl('investmentDeclarationForm');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    invDeclartionCallback(data.data, true);
                    $scope.invDeclaration = data.data;
                    $timeout(function (){
                        $scope.isAttendanceListVisible = true;
                    }, 200);
                });
        };
        getEmployeeAttendance();
        $scope.viewDownloadProof = function (item, action) {
            var url = EmployeeTaskService.getUrl('investmentDeclarationFormDownload') + "/" + item.employee_preview._id;
            $scope.viewDownloadFileUsingForm(url);
        };
    }
]);