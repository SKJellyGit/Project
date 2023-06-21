app.controller('AdminDiscretionController', [
    '$scope', '$timeout', '$modal', 'utilityService', 'ServerUtilityService', 'AdminDiscretionService',
    function ($scope, $timeout, $modal, utilityService, serverUtilityService, service) {
        var allFilterObject = service.buildAllFilterObject();
        $scope.bulk = service.buildBulkObject();
        $scope.overall = service.buildOverallObject();
        $scope.resetAllTypeFilters();
        $scope.resetFacadeCountObject(allFilterObject);

        $scope.legal_entity = {
            selected: null,
            entity_id: utilityService.getStorageValue("legalEntityId")
        };
        $scope.getLegalEntity = function() {
            if($scope.legal_entity.entity_id) {
                var entities_list = JSON.parse(utilityService.getStorageValue("legalEntityElements"));
                $scope.legal_entity.selected = entities_list.find(function(val) { return val._id == $scope.legal_entity.entity_id; });
            } else {
                $scope.legal_entity.selected = null;
            }
        };
        $scope.getLegalEntity();
        var reBuildList = function(list) {
            angular.forEach(list, function(value, key) {
                value.empFullName = utilityService.getInnerValue(value, 'employee', 'full_name');                
                $scope.calculateFacadeCountOfAllFilters(list, allFilterObject, value);
            });
            angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);

            return list;
        };
        var adminDiscretionComponentCallback = function(data) {
            if (utilityService.getValue(data, 'status') === 'success') {
                $scope.overall.adminDiscretionComponent.heads = utilityService.getInnerValue(data, 'data', 'heads', null);
                $scope.overall.adminDiscretionComponent.rows = reBuildList(utilityService.getInnerValue(data, 'data', 'rows', []));
            } else {
                $scope.overall.error.status = true;
                $scope.overall.error.message = utilityService.getValue(data, 'message');
            }

            $scope.overall.visible = true;
        };
        var getAdminDiscretionComponentList = function () {
            var url = service.getUrl('adminDiscretionComponents') + "/" 
                + $scope.payment.summary.current.year + "/"
                + (parseInt($scope.payment.summary.current.month, 10) + 1);

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    adminDiscretionComponentCallback(data);
                });
        };             
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        var successCallback = function (data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Sheet has been uploaded successfully'));
            getAdminDiscretionComponentList();
        };
        var errorCallback = function (data, section) {
            if (data.status == "error") {
                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(data.message);
            } else if (data.data.status == 'error') {
                utilityService.resetAPIError(true, "something went wrong", section);
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            $scope.errorMessages.push(v);
                        });
                    });
                } else {
                    $scope.errorMessages.push(data.data.message);
                }

                if (section === 'bulkFilledTemplate') {
                    $scope.openModal('bulk-upload-admin-discretion-components-error.tmpl.html', 'bulkUploadError');
                }
            }
        };
        var successErrorCallback = function (data, section) {
            data.status === "success" ? successCallback(data, section)
                    : errorCallback(data, section);
        };        
        
        /***** Start Download Sample Template & Upload Filled Template Section *****/
        $scope.downloadSampleTemplate = function(urlPrefix) {
            var url = service.getUrl(urlPrefix) + "/" 
                + $scope.payment.summary.current.year + "/"
                + (parseInt($scope.payment.summary.current.month, 10) + 1);

            $scope.viewDownloadFileUsingForm(url);
        };        
        $scope.uploadFilledTemplate = function(fileObject, keyName, urlPrefix, section) {
            section = 'bulkFilledTemplate';
            $scope.errorMessages = [];
            var url = service.getUrl(urlPrefix) + "/" 
                    + $scope.payment.summary.current.year + "/"
                    + (parseInt($scope.payment.summary.current.month, 10) + 1), 
                payload = {};

            payload[keyName] = fileObject;

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, section);
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

        
        $scope.changeMonth = function(model, index, tab) {
            model.current.month = index;
            getAdminDiscretionComponentList();
        };
        $scope.changeYear = function(tab) {
            getAdminDiscretionComponentList();
        }; 

        /**** Start: Angular Modal Section *****/
        $scope.openModal = function (templateUrl, keyName){
            $scope.modalInstance[keyName] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass:'fadeEffect',
                size: 'lg'
            });
        };        
        $scope.closeModal = function(keyName) {
            if(utilityService.getValue($scope.modalInstance, keyName)) {
                $scope.modalInstance[keyName].dismiss();
            }            
        };
        /**** End: Angular Modal Section *****/

        $scope.sortBy = function(object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };
        $scope.exportToCsv = function() {
            var content = service.buildExportData($scope.overall),
                filename = 'admin-discretion-components-list',
                month = parseInt($scope.payment.summary.current.month, 10) + 1;

            if($scope.legal_entity.entity_id) {
                filename += '-' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
            filename += '-' + utilityService.buildMonthObject()[month] + '-' 
                + $scope.payment.summary.current.year + '.csv';

            utilityService.exportToCsv(content, filename);
        };

        $scope.updatePaginationSettings('admin_discretions');

    }
]);