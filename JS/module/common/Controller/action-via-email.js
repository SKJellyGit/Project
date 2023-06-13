app.controller('ActionViaEmailController', [
    '$scope', '$routeParams', 'ActionViaEmailService', 'utilityService', 'ServerUtilityService',  
    function ($scope, $routeParams, service, utilityService, serverUtilityService) {
        'use strict';
        $scope.linkToken = service.buildLinkTokenObject($routeParams);
               
        /***** Start Validate Link Token Section *****/
        var validateLinkTokenCallback = function (data) {
            $scope.linkToken.valid = utilityService.getValue(data, 'status') === "success";
            $scope.linkToken.message = utilityService.getValue(data, 'message'); //$scope.linkToken.valid ? utilityService.getValue(data, 'message') : $scope.linkToken.defaultMessage;
            $scope.linkToken.visible = true;
        };
        var validateLinkToken = function() {
            var url = service.getUrl('validateToken') + "/" 
                    + utilityService.getValue($scope.linkToken, 'status') + "/"
                    + utilityService.getValue($scope.linkToken, 'action_id') + "/"
                    + utilityService.getValue($scope.linkToken, 'employee_id') + "/"
                    + utilityService.getValue($scope.linkToken, 'token') + "/";

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    validateLinkTokenCallback(data);
                });
        };
        validateLinkToken();
        /***** End Validate Link Token Section *****/        
    }
]);