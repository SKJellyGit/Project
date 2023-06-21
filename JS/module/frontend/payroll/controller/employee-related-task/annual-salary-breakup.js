app.controller('PayrollAdminAnnualSalaryBreakupController', [
    '$scope', '$rootScope', '$timeout', '$q', '$modal', 'utilityService', 'ServerUtilityService', 'PayrollParentService','$mdDialog',
    function ($scope, $rootScope, $timeout, $q, $modal, utilityService, serverUtilityService, parentService, $mdDialog) {
        /***** Start Download Sample Template & Upload Filled Template Section *****/
        $scope.bulk = parentService.buildBulkObject();
        var bulkSuccessCallback = function (data, section, msg, sectionKey) {
            msg = angular.isDefined(msg) && msg ? msg 
                : utilityService.getValue(data, 'message', 'Sheet has been uploaded successfully');

            utilityService.resetAPIError(false, null, section);
            if (angular.isDefined(data.data)) {
                utilityService.showSimpleToast(msg);
            } else {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            }
        };
        var bulkErrorCallback = function (data, section, sectionKey) {
            $scope.errorMessages = buildError(data)
            if (section === 'bulkFilledTemplate') {
                $scope.openModal('bulk-upload-error.tmpl.html', 'bulkUploadError');
            }
            $scope.clearFileUpload($scope.bulk, sectionKey);            
        };

        var buildError = function (data) {
            var error = []
            if(angular.isDefined(data.data.data)){
                data.data = data.data.data
                data.data.status = 'error'
            }
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
            if(angular.isDefined(data.error)){
                angular.forEach(data.error, function (v, k) {
                    error.push(v);
                });
            }

            if(utilityService.getInnerValue(data, 'data', 'error')) {
                if (angular.isArray(data.data.error) || angular.isObject(data.data.error)) {
                    angular.forEach(data.data.error, function (v, k) {
                        error.push(v);
                    }); 
                } else {
                    error.push(data.data.error);
                }
               
            }

            return error;
        }
        var bulkSuccessErrorCallback = function (data, section, msg, sectionKey) {
            data.status === "success" ? bulkSuccessCallback(data, section, msg, sectionKey)
                    : bulkErrorCallback(data, section, sectionKey);
        };
        $scope.downloadSampleTemplate = function(urlPrefix) {
            $scope.viewDownloadFileUsingForm(parentService.getUrl(urlPrefix));
        };        
        $scope.uploadFilledTemplate = function(fileObject, keyName, urlPrefix, sectionKey) {
            $scope.errorMessages = [];
            var url = parentService.getUrl(urlPrefix), msg = "",
                payload = {};

            payload[keyName] = fileObject;

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    bulkSuccessErrorCallback(data, 'bulkFilledTemplate', msg, sectionKey);
                });
        };
        /***** End Download/Upload Template & CSV Section *****/
        
        /**** Start: Generic File Upload Related Function  *****/
        $scope.bindFileChangeEvent = function (model, keyname) {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    model[keyname].isUploaded = true;
                });
            }, 100);
        };
        $scope.clearFileUpload = function(model, keyname) {
            model[keyname].isUploaded = false;
            model[keyname].file = null;
        };
        $scope.setCommonFileObject = function(model, keyname, file){
            model[keyname].file = file;
            model[keyname].isUploaded = true;
        };
        /**** End: Generic File Upload Related Function  *****/

        /***** Start Angular Modal Section *****/
        $scope.openModal = function(templateUrl, instance, size) {
            size = angular.isDefined(size) ? size : 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl : templateUrl,
                scope : $scope,
                windowClass : 'fadeEffect',
                size: size,
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };
        /********* End Angular Modal Section *********/
    }
]);