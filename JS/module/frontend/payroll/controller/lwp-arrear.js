app.controller('LWPArrearController', [
    '$scope', '$timeout', '$modal', 'utilityService', 'ServerUtilityService', 'LWPArrearService', 'PayrollPaymentService',
    function ($scope, $timeout, $modal, utilityService, serverUtilityService, service, payrollPaymentService) {

        $scope.bulk = service.buildBulkObject();
        $scope.lwpArrear = service.buildLWPDaysObject();
        $scope.resetAllTypeFilters();
        $scope.currentState = {}
        $scope.isCheck = {
            key: false,
            keyWD: false,
        };
        $scope.errorMessages = [];
        $scope.selectedTicketsCount = 0;

        $scope.selectedTicketsCountWD = 0;

        var fetchEmployeeListCallback = function(data, keyName) {
            var allFilterObject = service.buildAllFilterObject();
             $scope.resetFacadeCountObject(allFilterObject);
            if (utilityService.getValue(data, 'status') === 'success') {
                if(['arrearDays', 'paidDays', 'rfaAmount'].includes(keyName)){
                    angular.forEach(data.data.rows, function (row, index) {
                        row.isCheck = false;
                    });
                    data.data = data.data.rows
                    allFilterObject[0].collection_key = 'employee'
                }
                $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject);
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                $scope.lwpArrear[keyName].list = utilityService.getValue(data, 'data', []);
            } else {
                $scope.lwpArrear[keyName].error.status = true;
                $scope.lwpArrear[keyName].error.message = utilityService.getValue(data, 'message');
            }
            
            $scope.lwpArrear[keyName].visible = true;
        };
        $scope.fetchEmployeeList = function (keyName) {
            $scope.lwpArrear[keyName].visible = false;
            $scope.selectedTicketsCountWD = 0;
            $scope.selectedTicketsCount = 0;
            $scope.isCheck.key = false;
            $scope.isCheck.keyWD = false;

            var url = service.getUrl(keyName) + "/" 
                + $scope.payment.summary.current.year + "/"
                + (parseInt($scope.payment.summary.current.month, 10) + 1) + '/'
                + $scope.lwpArrear.payrollLockDays.selected;
            if(['paidDays', 'arrearDays', 'rfaAmount'].includes(keyName)){
                url = service.getUrl(keyName) + "/" 
                + $scope.payment.summary.current.year + "/"
                + (parseInt($scope.payment.summary.current.month, 10) + 1)
            }
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    fetchEmployeeListCallback(data, keyName);
                });
        };
        var payrollLockDaysCallback = function (data) {
            $scope.lwpArrear.payrollLockDays.list = utilityService.getValue(data, 'data', []);
            if ($scope.lwpArrear.payrollLockDays.list.length) {
                $scope.lwpArrear.payrollLockDays.selected = $scope.lwpArrear.payrollLockDays.list[0];                
                $scope.fetchEmployeeList('summary');
            } else {
                console.log('It seems that payroll lock day list is empty.')
            }
        };
        var getPayrollLockDays = function () {
            serverUtilityService.getWebService(service.getUrl('payrollLockDays'))
                .then(function (data) {
                    payrollLockDaysCallback(data);                        
                });
        };
        getPayrollLockDays();        
        var resetAllFileObject = function () {
            angular.forEach($scope.bulk, function (value, key) {
                $scope.clearFileUpload($scope.bulk, key);
            });            
        };
        $scope.changeTabHandler = function (tabname) {   
            if (tabname == $scope.lwpArrear.tabs.selected) {
                return false;
            }

            if (tabname != 'summary') {
                $scope.lwpArrear[tabname].uploadType.selected = 1;
                resetAllFileObject();
            }
            
            $scope.lwpArrear.tabs.selected = tabname;
            $scope.fetchEmployeeList(tabname);
        };
        var getTemplateType = function () {
            return $scope.lwpArrear.tabs.templateMapping[$scope.lwpArrear.tabs.selected];
        };
        var getUploadType = function () {
            return $scope.lwpArrear[$scope.lwpArrear.tabs.selected].uploadType.selected;
        };
        var buildDownloadUploadUrl = function (urlPrefix) {
            if(['paidDaysDownload', 'arrearDaysDownload', 'paidDaysUpload', 'arrearDaysUpload', 'rfaAmountUpload', 'rfaAmountDownload'].includes(urlPrefix)){
                return (service.getUrl(urlPrefix) + "/" 
                + $scope.payment.summary.current.year + "/"
                + (parseInt($scope.payment.summary.current.month, 10) + 1));
            }else{
                return (service.getUrl(urlPrefix) + "/" 
                + $scope.payment.summary.current.year + "/"
                + (parseInt($scope.payment.summary.current.month, 10) + 1) + "/"
                + getTemplateType());
            }
          
        };                     
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
            if(['paidDaysUpload', 'arrearDaysUpload', 'rfaAmountUpload'].includes(urlPrefix)){
                url = buildDownloadUploadUrl(urlPrefix)
            }else{
                url = buildDownloadUploadUrl(urlPrefix) + "/" + getUploadType();
            }
            payload[keyName] = fileObject;
            if(proceedAnyway) {
                payload.override_warning=true
            }
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    if(utilityService.getInnerValue(data, 'data', 'errors')) {
                        uploadSuccessCallback(data.data)
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
            $scope.fetchEmployeeList($scope.lwpArrear.tabs.selected);
            canSyncAttendanceHandler()
        };
        $scope.changeYear = function() {
            $scope.fetchEmployeeList($scope.lwpArrear.tabs.selected);
            canSyncAttendanceHandler()
        };
        $scope.sortBy = function(object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };
        $scope.exportToCsv = function(filename) {
            var content = service.buildExportData($scope.lwpArrear),
                payrollLockDay = utilityService.getInnerValue($scope.lwpArrear, 'payrollLockDays', 'selected'),
                payrollLockDaySuffix = utilityService.getDayOfMonthSuffix(payrollLockDay),
                month = parseInt($scope.payment.summary.current.month, 10) + 1,
                filename = filename + '_' + payrollLockDay + payrollLockDaySuffix + '_' +
                    $scope.payment.summary.current.year + '_' + month + '.csv';
                        
            utilityService.exportToCsv(content, filename);
        };
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        $scope.changeTypeHandler = function (keyName) {
            $scope.lwpArrear[keyName].visible = false;
            $scope.fetchEmployeeList(keyName);
        };
        $scope.changePayrollLockDayHandler = function () {
            $scope.fetchEmployeeList($scope.lwpArrear.tabs.selected);
        }; 
        $scope.getDayOfMonthSuffix = function (day) {
            return utilityService.getDayOfMonthSuffix(day);
        };
        $scope.viewDayDetails = function (item) {
            $scope.lwpArrear.dayDetails = {};
            angular.copy(item, $scope.lwpArrear.dayDetails);
            $scope.openModal('view-day-details.tmpl.html', 'comment', 'sm');
        };       

        /**** Start: Success Error Callback Section *****/
        var successCallback = function (data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Sheet has been uploaded successfully'));
            $scope.clearFileUpload($scope.bulk, section);
            $scope.fetchEmployeeList($scope.lwpArrear.tabs.selected);
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

        $scope.syncAttendanceHandler = function (item) {
            var month = parseInt($scope.payment.summary.current.month) + 1
            $scope.loader = true;
                var url = payrollPaymentService.getUrl('syncAttendance') + '/' + $scope.payment.summary.current.year + '/' + month,
                payload = {
                  
                };
                
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {                    
                    if (utilityService.getValue(data, 'status') == 'success') {
                       console.log(data)
                       utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Attendance Sync successfully'));
                       $scope.fetchEmployeeList('summary');
                    } else {
                        $scope.errorMessages = buildError(data)
                        console.log('Need to handle error here');
                    }
                });
           
        };
        $scope.canSyncAttendance = false
        var canSyncAttendanceHandler = function () {
            if(['arrearDays', 'paidDays', 'rfaAmount'].includes($scope.lwpArrear.tabs.selected)){
                return false
            }
            var month = parseInt($scope.payment.summary.current.month) + 1

            var url = payrollPaymentService.getUrl('canSyncAttendance') + '/' + $scope.payment.summary.current.year + '/' + month;
            serverUtilityService.getWebService(url)
            .then(function (data) {
               console.log(data)
               $scope.canSyncAttendance = data.data.can_sync
            });
        }
        canSyncAttendanceHandler()
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
       

        $scope.updateCount = function (isSingleCheckbox, data) {
            isSingleCheckbox = angular.isDefined(isSingleCheckbox) ? isSingleCheckbox : false;
            $scope.selectedTicketsCount = 0;
            angular.forEach(data, function (val, key) {
                if (val.isCheck) {
                    $scope.selectedTicketsCount += 1;
                }
            });

            // if (isSingleCheckbox ) {
            //     if($scope.selectedTicketsCount > 0){
            //         $scope.isCheck.key = true;
            //     }else{
            //         $scope.isCheck.key = false;
    
            //     } 
            // }           
        };
        $scope.checkAll = function (flag, data) {
            angular.forEach(data, function (row, index) {
                if(row.uploaded){
                    row.isCheck = flag;
                }
            });
            
            $scope.updateCount(undefined, data);
        };
        
        $scope.deleteEmployee = function(isBulk, item) {
            var month = parseInt($scope.payment.summary.current.month) + 1

            var url = service.getUrl('deleteArrearEmployee') + '/' + $scope.payment.summary.current.year + '/' + month,
                payload = {
                    emp_ids: []
                };
                if(isBulk){
                    angular.forEach($scope.lwpArrear.arrearDays.filteredList, function (val, key) {
                        if (val.isCheck) {
                            payload.emp_ids.push(val.employee._id)
                        }
                    });
                }else{
                    payload.emp_ids.push(item.employee._id)
                }
            // serverUtilityService.deleteTask(url, payload)
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {                    
                    if (utilityService.getValue(data, 'status') == 'success') {
                       console.log(data)
                       utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Deleted successfully'));
                       $scope.fetchEmployeeList('arrearDays')
                    } else {
                        $scope.errorMessages = buildError(data);
                        $scope.openModal('employee-error.tmpl.html', 'employeeError');
                        console.log('Need to handle error here');
                    }
                });
        }



        // worked days function
        $scope.updateCountWD = function (isSingleCheckbox, data) {
            isSingleCheckbox = angular.isDefined(isSingleCheckbox) ? isSingleCheckbox : false;
            $scope.selectedTicketsCountWD = 0;
            angular.forEach(data, function (val, key) {
                if (val.isCheck) {
                    $scope.selectedTicketsCountWD += 1;
                }
            });

            // if (isSingleCheckbox &&  $scope.selectedTicketsCountWD > 0) {
            //     if($scope.selectedTicketsCountWD > 0){
            //         $scope.isCheck.keyWD = true;
            //     }else{
            //         $scope.isCheck.keyWD = false;
    
            //     } 
            // }          
        };
        $scope.checkAllWD = function (flag, data) {
            angular.forEach(data, function (row, index) {
                if(row.uploaded){
                    row.isCheck = flag;
                }
            });
            
            $scope.updateCountWD(undefined, data);
        };

        $scope.deleteEmployeeWD = function(isBulk, item) {
            var month = parseInt($scope.payment.summary.current.month) + 1

            var url = service.getUrl('deletePaidEmployee') + '/' + $scope.payment.summary.current.year + '/' + month,
                payload = {
                    emp_ids: []
                };
                if(isBulk){
                    angular.forEach($scope.lwpArrear.paidDays.filteredList, function (val, key) {
                        if (val.isCheck) {
                            payload.emp_ids.push(val.employee._id)
                        }
                    });
                }else{
                    payload.emp_ids.push(item.employee._id)
                }
            // serverUtilityService.deleteTask(url, payload)
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {     
                    if (utilityService.getValue(data, 'status') == 'success') {
                       console.log(data)
                       utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Deleted successfully'));
                       $scope.fetchEmployeeList('paidDays')
                    } else {
                        $scope.errorMessages = buildError(data)
                        $scope.openModal('employee-error.tmpl.html', 'employeeError');
                        console.log('Need to handle error here');
                    }
                });
        }

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