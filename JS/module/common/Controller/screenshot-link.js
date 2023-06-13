app.controller('ScreenshotLinkController', [
    '$scope', '$routeParams', '$modal', '$mdDialog', '$window', 'ScreenshotLinkService', 'utilityService', 'ServerUtilityService',  
    function ($scope, $routeParams, $modal, $mdDialog, $window, service, utilityService, serverUtilityService) {
        'use strict';
        $scope.linkToken = service.buildLinkTokenObject($routeParams);
               
        /***** Start Validate Link Token Section *****/
        var validateLinkTokenCallback = function (data) {
            $scope.linkToken.valid = utilityService.getValue(data, 'success') === "success";
            $scope.linkToken.message = $scope.linkToken.valid 
                ? utilityService.getValue(data, 'message') : $scope.linkToken.defaultMessage;
            $scope.linkToken.visible = true;
        };
        var validateLinkToken = function() {
            var url = service.getUrl('validateToken') + "/" + $scope.linkToken.token;
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    validateLinkTokenCallback(data);
                });
        };
        validateLinkToken();
        /***** End Validate Link Token Section *****/

        /***** Start: Download Link for application & video *****/
        var downloadLinkCallback = function (event, data) {
            console.log(data);
            if (utilityService.getValue(data, 'status') === "success") {
                if(data.data)
                {
                    $scope.linkToken.url.application = utilityService.getInnerValue(data, 'data', 'app_url');
                    $scope.linkToken.url.video = utilityService.getInnerValue(data, 'data', 'video_url');
                    $scope.linkToken.url.visible = true;
                }
                else
                {
                    showAlert(event, utilityService.getValue(data, 'message'));
                    $scope.linkToken.url.visible = true;
                }
            } else {
                showAlert(event, utilityService.getValue(data, 'message'));
                $scope.linkToken.url.visible = true;
            }
        };

        $scope.getDownloadLink = function(event) {
            var operatingSystem = utilityService.getInnerValue($scope.linkToken, 'operatingSystem', 'selected')
            var url = service.getUrl('link')+'/'+$scope.linkToken.token+'/'+operatingSystem
            $scope.linkToken.url.visible=false
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    downloadLinkCallback(event, data);
                });
        };
        $scope.downloadUrl = function (url) {
            if(url)
            {
                $window.open(url, '_blank');
            }
            else
            {
                showAlert(event,'Url already accessed/ Token expired')
            }
        };
        /***** End: Download Link for application & video *****/

        var showAlert = function(ev, message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error!')
                    .textContent(message)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
        
        /***** Start: AngularJS Modal Section *****/
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                backdrop: 'static',
                keyboard: false,
                size: size
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };
        /***** End: AngularJS Modal Section *****/
    }
]);