app.controller('HistoryController', [
    '$scope','$routeParams','$location', 'HistoryService', 'ServerUtilityService',   
    function ($scope, $routeParams, $location, HistoryService, serverUtilityService) {
        $scope.empHistory = {
            overview: null,
            profile_update: null,
            segment: 'overview'            
        };
        var empId = angular.isDefined($routeParams.id) ? $routeParams.id : null;
        var view = angular.isDefined($routeParams.view) ? $routeParams.view : null;
        
        var getAdminEmployeeHistory = function () {
            var url = HistoryService.getUrl('getEmployee') + "/" + empId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.empHistory.overview = data.data[0];
                    $scope.empHistory.profile_update = data.data[1];
                    $scope.empHistory.emp_detail = data.data[2];
                });
        };
        var getHistory = function () {
            var url = HistoryService.getUrl('getOtherEmpHistory');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.empHistory.overview = data.data[0];
                    $scope.empHistory.profile_update = data.data[1];
                    $scope.empHistory.emp_detail = data.data[2];
                });
        };
        var getEmployeeHistory = function () {
            var url = HistoryService.getUrl('getOtherEmpHistory') + "/" + empId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.empHistory.overview = data.data[0];
                    $scope.empHistory.profile_update = data.data[1];
                    $scope.empHistory.emp_detail = data.data[2];
                });
        };        
        $scope.changeSegment = function (item){
            $scope.empHistory.segment = item;
        };
        switch (view) {
            case 'admin':
                getAdminEmployeeHistory();
                break;

            case 'employee':
                getEmployeeHistory();
                break;

            default:
                getHistory();                        
        }
        $scope.redirectTo = function () {
            switch (view) {
                case 'admin':
                    $location.url('frontend/user-management').search({tab: 1});
                    break;

                case 'employee':
                    $location.url('dashboard');
                    break;

                default:
                    $location.url('dashboard');
            }
        };
    }
]);