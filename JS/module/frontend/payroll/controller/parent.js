app.controller('PayrollParentController', [
    '$scope', '$rootScope', '$timeout', '$q', '$modal', 'utilityService', 'ServerUtilityService', 'PayrollParentService','$mdDialog',
    function ($scope, $rootScope, $timeout, $q, $modal, utilityService, serverUtilityService, parentService, $mdDialog) {
        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        $scope.templateObject = parentService.buildTemplateObject();
        $scope.monthwise = parentService.buildMonthwiseObject();
        $scope.bulk = parentService.buildBulkObject();
        $scope.errorObject = {
            salaryTemplate: {
                header: null,
                status: false
            }
        };
        $scope.usermanagent = {
            errorGrid: false,
            isBulkVisible: false,
            file: null
        };
        $scope.file = {
            object: null
        };

        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        var successCallback = function (data, section, msg) {
            msg = angular.isDefined(msg) && msg ? msg 
                : utilityService.getValue(data, 'message', 'Sheet has been uploaded successfully');

            utilityService.resetAPIError(false, null, section);
            if (angular.isDefined(data.data)) {
                utilityService.showSimpleToast(msg);
            } else {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            }
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
                    $scope.openModal('bulk-upload-error.tmpl.html', 'bulkUploadError');
                }
            }
        };
        var successErrorCallback = function (data, section, msg) {
            data.status === "success" ? successCallback(data, section, msg)
                    : errorCallback(data, section);
        };        
        $scope.downloadSalarySlipFormat = function(flag) {
            $scope.viewDownloadFileUsingForm(parentService.getUrl('download'));
        };
        $scope.bindTemplateFileChangeEvent = function () {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    $scope.isUploaded = true;
                });
            }, 100);
        };
        $scope.uploadSalaryTemplate = function(file, withoutValidate) {
            withoutValidate = angular.isDefined(withoutValidate) ? withoutValidate : false;
            $scope.errorMessages = [];
            $scope.errorObject.salaryTemplate.header = null;
            $scope.errorObject.salaryTemplate.status = false;
            $scope.usermanagent.isBulkVisible = false;
            $scope.usermanagent.errorGrid = false;

            var url = parentService.getUrl('upload'),
                payload = {
                    upload_csv: file
                };

            if (withoutValidate) {
                payload.without_validate = withoutValidate;
            } else {
                $scope.usermanagent.file = file;
            }

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    if(data.status == "success") {                        
                        $scope.closeModal('bulkUploadError');
                        $scope.clearSalaryTemplate();
                        utilityService.showSimpleToast("Salary sheet has been uploaded successfully.");
                    } else {
                        salaryUploadErrorCallback(data, withoutValidate);                                                    
                    }
                });
        };
        $scope.clearSalaryTemplate = function(){
            $scope.isUploaded = false;
            $scope.file.object = null;
            $scope.usermanagent.file = null;
        };
        $scope.cancelSalaryTemplateUpload = function () {
            $scope.closeModal('bulkUploadError');
            $scope.clearSalaryTemplate();
        };
        var exportToCsv = function(object, filename) {
            utilityService.exportToCsv(object.content, filename);
        };
        $scope.downloadEmployeeDetails = function(item) {
            $q.all([
                serverUtilityService.getWebService(parentService.getUrl('empDetailsHeader') + '/' + item.id),
                serverUtilityService.getWebService(parentService.getUrl('empDetailsContent') + '/'  + item.id)
            ]).then(function (data) {
                var object = parentService.buildCSVContent(data[0].data, data[1].data, $scope.templateObject.hashMap);
                exportToCsv(object, item.filename);
            });
        };
        $scope.setFileObject = function(files){
            $scope.fileSlip = files;
        };
        $scope.bindSalarySlipFileChangeEvent = function () {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    $scope.isSlipUploaded = true;
                });
            }, 100);
        };
        $scope.uploadSalarySlip = function() {
            resetErrorMessages();
            var url = parentService.getUrl('uploadSlip'),
                payload = {
                    salary_slips: $scope.fileSlip
                };

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    if(data.status == "success") {
                        utilityService.showSimpleToast("Salary slips have been uploaded successfully.");
                    }
                });
        };
        $scope.clearSalarySlip = function(){
            $scope.isSlipUploaded = false;
            $scope.fileSlip = null;
        };   
        
        /** Salary Brakup Template Section **/
        $scope.downloadSalaryBreakup = function() {
            $scope.viewDownloadFileUsingForm(parentService.getUrl('downloadBreakup'));
        };
         $scope.bindSalaryBreakupFileChangeEvent = function () {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    $scope.isBreakupUploaded = true;
                });
            }, 100);
        };
        var salaryBreakupErrorCallback = function (data) {
            $scope.errorMessages = []
            $scope.errorObject.salaryTemplate.status = false;  
            if (utilityService.getValue(data, 'status') === 422) {
                var response = utilityService.getValue(data, 'data')
                if(angular.isDefined(response.data.message)){
                    angular.forEach(response.data.message, function(val){
                        $scope.errorMessages.push(val);
                    })
                }else {
                    $scope.errorMessages.push('Please fill all the required columns');
                }
                $scope.errorObject.salaryTemplate.status = true;                                                                                  
            } else {
                var response = utilityService.getValue(data, 'data')
                if(angular.isDefined(response.message)){
                    angular.forEach(response.message, function(val){
                        $scope.errorMessages.push(val);
                    })
                }else {
                    $scope.errorMessages.push('Please fill all the required columns');
                }
                $scope.errorObject.salaryTemplate.status = true;                 
            }
            $scope.openModal('salary-template-error.tmpl.html', 'bulkUploadError');
        }
        
        $scope.uploadSalaryBreakupTemplate = function(breakupFile) {
            var url = parentService.getUrl('uploadBreakup'),
                payload = {
                    upload_csv: breakupFile,
                    legal_entity : false
                };

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    if(data.status == "success") {
                        utilityService.showSimpleToast("Salary sheet has been uploaded successfully.");
                    } else {
                        console.log('error need to handle');
                        salaryBreakupErrorCallback(data)
                    }
                });
        };
        $scope.clearSalaryBreakupTemplate = function(){
            $scope.isBreakupUploaded = false;
            $scope.breakupFile = null;
        };

        /***** Start Download Sample Template & Upload Filled Template Section *****/
        $scope.downloadSampleTemplate = function(urlPrefix) {
            $scope.viewDownloadFileUsingForm(parentService.getUrl(urlPrefix));
        };        
        $scope.uploadFilledTemplate = function(fileObject, keyName, urlPrefix, section) {
            section = 'bulkFilledTemplate';
            $scope.errorMessages = [];
            var url = parentService.getUrl(urlPrefix), msg = "",
                payload = {};

            payload[keyName] = fileObject;

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, section, msg);
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

        /**** Start: Angular Modal Section *****/
        $scope.openModal = function (templateUrl, keyName) {
            $scope.modalInstance[keyName] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                keyboard: false,
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

        var getAlphaIndexing = function (resp) {
            $rootScope.errCount = 0;
            var data = [];
            angular.forEach(resp, function (val, key) {
                data.push(val);
                angular.forEach(val, function (v, k) {
                    if (angular.isDefined(v.error) && v.error.length) {
                        $rootScope.errCount += 1;
                    }
                });
            });
            $rootScope.totalRecords = data.length;
            $rootScope.alphIndex = [];
            var len = Object.keys(data[0]).length;
            var counter = -1;
            for (var i = 0; i < len; i++) {
                if (i % 26 == 0 && i != 0) {
                    counter = counter + 1;
                }
                if (i > 25) {
                    $rootScope.alphIndex.push(alphabets[counter % 26] + alphabets[(i % 26)]);
                } else {
                    $rootScope.alphIndex.push(alphabets[i]);
                }
            }
            $scope.flag = true;
        };
        var salaryUploadErrorCallback = function (response, withoutValidate) {
            if (utilityService.getValue(data, 'status') === 422) {
                var data = utilityService.getValue(response, 'data'),
                    header = utilityService.getInnerValue(response, 'message', 'header', []);
                if (header.length) {
                    $scope.errorObject.salaryTemplate.header = header.join(', ');
                } else {
                    $scope.errorMessages.push('Please fill all the required columns');
                }
                $scope.errorObject.salaryTemplate.status = true;                                                                                  
            } else {
                if (utilityService.getValue(response, 'is_error') === false) {
                    $scope.errorMessages.push(utilityService.getValue(response, 'message'));
                    $scope.errorObject.salaryTemplate.status = true;
                } else {
                    handleGridErrorCallback(response);
                }                            
            }
            $scope.openModal('salary-template-error.tmpl.html', 'bulkUploadError');
        };
        var handleGridErrorCallback = function (response) {
            var message = utilityService.getValue(response, 'message');

            if (angular.isObject(message)) {
                $scope.usermanagent.errorGrid = true;
                getAlphaIndexing(message);
                $scope.data = [];
                angular.forEach(message, function (val, key) {
                    var isError = false;
                    angular.forEach(val, function (v, k) {
                        if (angular.isDefined(v.error) && v.error.length) {
                            isError = true;
                        }
                    });
                    isError ? $scope.data.push(val) : null;
                });
                $scope.parsedCsv = $rootScope.errCount == 0 ? message : $scope.data;
                $scope.dataList = message;
                $timeout(function () {
                    $scope.usermanagent.isBulkVisible = true;
                }, 100);
            } else {
                $scope.usermanagent.errorGrid = false;
                $scope.errorMessages.push(message);
                $scope.errorObject.salaryTemplate.status = true;
            }
        };

        var showConfirmDialog = function(ev, functionName, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to proceed with this?')
                .textContent('After uploading this annual salary breakup, Please make sure that all other existing future annual salary breakup will be deleted.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('No, want to cancel');

            $mdDialog.show(confirm).then(function() {
                functionName(item);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function(event, functionName, item) {
            showConfirmDialog(event, functionName, item);
        };

        $scope.getRunPayrollAutomation();

    }
]);