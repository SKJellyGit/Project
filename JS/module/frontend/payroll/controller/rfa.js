app.controller('RFAController', [
    '$scope', '$timeout', '$modal', 'utilityService', 'ServerUtilityService', 'LWPArrearService', 'PayrollPaymentService',
    function ($scope, $timeout, $modal, utilityService, serverUtilityService, service, payrollPaymentService) {

        $scope.bulk = service.buildBulkObject();
        $scope.rfa = service.buildLWPDaysObject();
        $scope.resetAllTypeFilters();
        $scope.currentState = {}
        $scope.errorMessages = [];
        var fetchEmployeeListCallback = function(data, keyName) {
            var allFilterObject = service.buildAllFilterObject();
             $scope.resetFacadeCountObject(allFilterObject);
            if (utilityService.getValue(data, 'status') === 'success') {
                data.data = data.data.rows
                allFilterObject[0].collection_key = 'employee'
                $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject);
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                $scope.rfa[keyName].list = utilityService.getValue(data, 'data', []);
            } else {
                $scope.rfa[keyName].error.status = true;
                $scope.rfa[keyName].error.message = utilityService.getValue(data, 'message');
            }
            
            $scope.rfa[keyName].visible = true;
        };
        $scope.fetchEmployeeList = function (keyName) {
            $scope.rfa[keyName].visible = false;
            var url = service.getUrl('rfaAmount') + "/" 
                + $scope.payment.summary.current.year + "/"
                + ($scope.payment.summary.current.year + 1) + '/'
                + keyName;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    fetchEmployeeListCallback(data, keyName);
                });
        };
          
        var resetAllFileObject = function () {
            angular.forEach($scope.bulk, function (value, key) {
                $scope.clearFileUpload($scope.bulk, key);
            });            
        };
        $scope.changeTabHandler = function (tabname) {   
            if (tabname == $scope.rfa.tabs.selected) {
                return false;
            }
            
            $scope.rfa.tabs.selected = tabname;
            $scope.fetchEmployeeList(tabname);
        };

        var buildDownloadUploadUrl = function (urlPrefix) {
            return (service.getUrl(urlPrefix) + "/" 
            + $scope.payment.summary.current.year + "/"
            + ($scope.payment.summary.current.year + 1) + '/' + $scope.rfa.tabs.selected)
          
        }                  
        $scope.downloadSampleTemplate = function(urlPrefix) {
            $scope.viewDownloadFileUsingForm(buildDownloadUploadUrl(urlPrefix));
        };        
        $scope.uploadFilledTemplate = function(fileObject, keyName, urlPrefix, section, proceedAnyway) {
            $scope.currentState = {
                fileObject:fileObject, 
                keyName: keyName, 
                urlPrefix: urlPrefix, 
                section : section
            }
            console.log(section);

            var url = ''
                payload = {};
                url = buildDownloadUploadUrl(urlPrefix);
            payload[keyName] = fileObject;
            if(proceedAnyway) {
                payload.override_warning=true
            }
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    if(utilityService.getInnerValue(data, 'data', 'errors') || utilityService.getValue(data, 'errors')) {
                        if(utilityService.getInnerValue(data, 'data', 'errors')){
                            uploadSuccessCallback(data.data)
                        }else{
                            uploadSuccessCallback(data)
                        }
                    }else{
                        successErrorCallback(data, section);
                    }

                });
        };
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
        $scope.changeMonth = function() {
            $scope.fetchEmployeeList($scope.rfa.tabs.selected);
        };
        $scope.changeYear = function() {
            $scope.fetchEmployeeList($scope.rfa.tabs.selected);
        };
        $scope.sortBy = function(object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };
        $scope.exportToCsv = function(filename) {
            var content = service.buildExportData($scope.rfa),
                month = ($scope.payment.summary.current.year + 1),
                filename = filename + '_' +
                    $scope.payment.summary.current.year + '_' + month + '.csv';
                        
            utilityService.exportToCsv(content, filename);
        };
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        $scope.getDayOfMonthSuffix = function (day) {
            return utilityService.getDayOfMonthSuffix(day);
        };
        $scope.viewDayDetails = function (item) {
            $scope.rfa.dayDetails = {};
            angular.copy(item, $scope.rfa.dayDetails);
            $scope.openModal('view-day-details.tmpl.html', 'comment', 'sm');
        };       

        /**** Start: Success Error Callback Section *****/
        var successCallback = function (data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Sheet has been uploaded successfully'));
            $scope.clearFileUpload($scope.bulk, section);
            $scope.fetchEmployeeList($scope.rfa.tabs.selected);
        };
        var errorCallback = function (data, section) {
            resetErrorMessages();
            utilityService.resetAPIError(true, "something went wrong", section);

            var message = "There is some error in uploading this sheet";
            if (data.status == "error") {
                message = utilityService.getValue(data, 'message');                                
            } else if (data.data.status == 'error') {
                message = utilityService.getInnerValue(data, 'data', 'message');
            }            
            
            if (angular.isArray(message) || angular.isObject(message)) {
                angular.forEach(message, function (value, key) {
                    angular.forEach(value, function (v, k) {
                        $scope.errorMessages.push(v);
                    });
                });
            } else {
                $scope.errorMessages.push(message);
            }

            if ((section === 'lwpOverride' || section === 'lwppOverride' 
                || section === 'lwprOverride') && $scope.errorMessages.length) {
                utilityService.resetAPIError(true, "something went wrong", 'bulkFilledTemplate');
                $scope.openModal('bulk-upload-error.tmpl.html', 'bulkUploadError');
            }
        };
        var successErrorCallback = function (data, section) {
            data.status === "success" ? successCallback(data, section)
                    : errorCallback(data, section);
        };
        /**** End: Success Error Callback Section *****/

        /**** Start: Angular Modal Section *****/
        $scope.openModal = function (templateUrl, keyName, size) {
            size = size || 'lg';
            $scope.modalInstance[keyName] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass:'fadeEffect',
                size: size
            });
        };        
        $scope.closeModal = function(keyName) {
            if(utilityService.getValue($scope.modalInstance, keyName)) {
                $scope.modalInstance[keyName].dismiss();
            }            
        };
        /**** End: Angular Modal Section *****/

        $scope.updatePaginationSettings('lwp_arrear_summary');
        $scope.updatePaginationSettings('lwp_details');
        $scope.updatePaginationSettings('arrear_details');
        $scope.parsedCsv = []
        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
                'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        $scope.errCount = 0;
        $scope.alphIndex = null;
        $scope.totalRecords = {
            warnings: null,
            errors: null,
            total: null
        };
        
        var getAlphaIndexing = function (resp) {
            $scope.errCount = 0;
            var warning = 0
            var data = [];
            angular.forEach(resp.errors, function (val, key) {
                data.push(val);
                angular.forEach(val, function (v, k) {
                    if (angular.isDefined(v.error) && v.error.length) {
                        $scope.errCount += 1;
                        if(v.warning){
                            warning++
                        }
                    }
                });
            });
            $scope.totalRecords.total = data.length;
            $scope.totalRecords.warnings = warning
            $scope.totalRecords.errors = $scope.errCount - $scope.totalRecords.warnings
            $scope.alphIndex = [];
            var len = Object.keys(data[0]).length;
            for (var i = 0; i < len; i++) {
                if (i > 25) {
                    $scope.alphIndex.push("A" + alphabets[(i % 25) - 1]);
                } else {
                    $scope.alphIndex.push(alphabets[i]);
                }
            }
            $scope.flag = true;
        };
        $scope.uploadCSVAnyway = function() {
            $scope.closeModal('pyarollPreviewCSV');
            var params = $scope.currentState
            $scope.uploadFilledTemplate(params.fileObject, params.keyName, params.urlPrefix, params.section, true)
        }
        var uploadSuccessCallback = function (response) {
            getAlphaIndexing(response);
            $scope.parsedCsv = response.errors      
            // if (utilityService.getInnerValue(response, 'data', 'status') === 'success') {
            //     utilityService.showSimpleToast(utilityService.getInnerValue(response, 'data', 'message'));
            // } else {
                $scope.openModal( 'preview-sheet-csv-payroll.html', 'pyarollPreviewCSV', 'lg');    
            // }            
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


    
    }
]);