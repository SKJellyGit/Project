app.controller('PayrollRegisterReportController', [
    '$scope', '$routeParams', '$location', '$timeout', '$window', '$route', 'PayrollRegisterReportService', 'utilityService', 'ServerUtilityService', 'VALIDATION_ERROR', '$filter', '$mdSidenav', 'Upload', '$routeParams', '$rootScope',
    function ($scope, $routeParams, $location, $timeout, $window, $route, PayrollRegisterReportService, utilityService, serverUtilityService, VALIDATION_ERROR, $filter, $mdSidenav, Upload, $routeParams, $rootScope) {
      
        $scope.registerObj = PayrollRegisterReportService.buildRegistersReportObject();
        $scope.registerObj.routeParam.component = angular.isDefined($routeParams.component) ? $routeParams.component : null;
        $scope.registerObj.routeParam.type = angular.isDefined($routeParams.type) ? $routeParams.type : null;
      
        var syncRegisterReportModel = function (model){
            $scope.registerObj.model.list = PayrollRegisterReportService.buildRegistersReportModel(model);
        };
        syncRegisterReportModel();      
        var getComponentList = function (){
            var url = PayrollRegisterReportService.getUrl('getComponent');

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.registerObj.component.list = data.data;
                }); 
        };
        getComponentList();      
        var getGroupList = function() {
            var url = PayrollRegisterReportService.getUrl('grplst');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.registerObj.groups.list = data.data;
            }); 
        }; 
        getGroupList();      
        var getAssociateField = function () {
            var url = PayrollRegisterReportService.getUrl('getProfileFields');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.registerObj.associateField.list = data.data;
                angular.forEach($scope.registerObj.associateField.list, function (value, key) {
                    value.isChecked = false;
                    angular.forEach(value.profile_field, function (v, k) {
                        v.isChecked = false;
                        angular.forEach(v.child_details, function (va, ke) {
                            va.isChecked = false;
                        });
                    });
                });
            });
        };
        getAssociateField();        
        $scope.collapseExpand = function (field) {
            field.isExpanded = field.isExpanded ? false : true;
        };        
        $scope.changeSegmentStatus = function (field) {
            angular.forEach(field.profile_field, function (value, key) {
                value.isChecked = field.isChecked;
                angular.forEach(value.child_details, function (v, k) {
                    v.isChecked = field.isChecked;
                });
            });
        };        
        $scope.changeFieldStatus = function (field, profile) {
            angular.forEach(profile.child_details, function (v, k) {
                v.isChecked = profile.isChecked;
            });
        };      
        $scope.navagteSetting = function (component, type) {
            $location.url('registersReport').search({'component': component, 'type': type});
        };      
        $scope.navigateToTab = function (){
            $location.url('/frontend/payroll');
        };      
        $scope.onlyMonthSelectable = function (date) {
            var d = date.getDate(),
                fromDate =$scope.registerObj.model.list.fromDate;

            return d == fromDate.getDate() - 1;
        };      
        $scope.exportReport = function (){
            var payload = PayrollRegisterReportService.buildRegistersReportPayload($scope.registerObj.model.list);
            
            payload.associate_field = PayrollRegisterReportService.buildAssociateFieldPayload($scope.registerObj.associateField.list);
            payload.group_field = PayrollRegisterReportService.buildGroupFieldPayload($scope.registerObj.groups.list);
            console.log(payload);
        };

    }
]);