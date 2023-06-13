app.controller('AssessmentLinkController', [
    '$scope', '$routeParams', '$modal', '$mdDialog', '$window', 'AssessmentLinkService', 'utilityService', 'ServerUtilityService',  
    function ($scope, $routeParams, $modal, $mdDialog, $window, service, utilityService, serverUtilityService) {
        'use strict';
        $scope.linkToken = service.buildLinkTokenObject($routeParams);
        
        var getAssessmentDetails = function (data) {
            $scope.linkToken.filename = utilityService.getInnerValue(data, 'data', 'filename');
            $scope.linkToken.job = utilityService.getInnerValue(data, 'data', 'job');
            $scope.linkToken.assessment_submitted = utilityService.getInnerValue(data, 'data', 'assessment_submitted', false);
            $scope.linkToken.visible = true;
        };

        /***** Start Validate Link Token Section *****/
        var validateLinkTokenCallback = function (data) {
            $scope.linkToken.valid = utilityService.getValue(data, 'status') === "success";
            $scope.linkToken.message = $scope.linkToken.valid 
                ? utilityService.getValue(data, 'message') : $scope.linkToken.defaultMessage;

            $scope.linkToken.valid ?  getAssessmentDetails(data) : $scope.linkToken.visible = true;
        };
        var validateLinkToken = function() {
            var url = service.getUrl('validateToken');
            var params = {q:$scope.linkToken.token}
            serverUtilityService.getWebService(url,params)
                .then(function(data) {
                    validateLinkTokenCallback(data);
                });
        };
        validateLinkToken();
        /***** End Validate Link Token Section *****/

        /**** Start: Assign Assessment Section *****/
        $scope.clearFileUpload = function(model, keyname) {
            model[keyname].isUploaded = false;
            model[keyname].file = null;
        };
        $scope.setCommonFileObject = function(model, keyname, file){
            model[keyname].file = file;
            model[keyname].isUploaded = true;
            $scope.errorMessages = [];
        };
        $scope.downloadAssessment = function(urlPrefix) {
            var url = service.getUrl(urlPrefix) + "?q=" 
                + utilityService.getValue($scope.linkToken, 'token');

            $scope.viewDownloadFileUsingForm(url);
        };
        var uploadSuccessCallback = function (data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            validateLinkToken();
        };
        var uploadErrorCallback = function (data, section, event) {
            showAlert(event, utilityService.getValue(data, 'message'));
        };  
        var uploadSuccessErrorCallback = function (data, section, event) {
            data.status === "success" 
                ? uploadSuccessCallback(data, section, event)
                : uploadErrorCallback(data, section, event);
        };     
        $scope.uploadFilledTemplate = function(fileObject, keyName, urlPrefix, event) {
            $scope.errorMessages = [];
            var url = service.getUrl(urlPrefix),
                payload = {q:$scope.linkToken.token};

            payload[keyName] = fileObject;
            
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    uploadSuccessErrorCallback(data, 'assessment', event);
                });
        };
        /**** End: Assign Assessment Section *****/

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