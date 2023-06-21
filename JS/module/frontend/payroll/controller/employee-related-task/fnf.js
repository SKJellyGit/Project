 app.controller('FullFinalController', [
    '$scope', '$rootScope', '$modal', '$q', '$timeout', 'Upload', '$mdDialog', '$window', 'utilityService', 'ServerUtilityService', 'FullFinalService', 'SlipService', 'EmployeeTaskService', 
    function ($scope, $rootScope, $modal, $q, $timeout, Upload, $mdDialog, $window, utilityService, serverUtilityService, service, SlipService, EmployeeTaskService) {
        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        $scope.getRunPayrollAutomation();
        $scope.fnfDetails = service.buildFnfFDetailsObject();
        $scope.fnfModel = service.buildFnfObject();
        $scope.bulk = service.buildBulkObject();        
        $scope.usermanagent = {
            isBulkVisible: true,
            errorGrid: false
        };
        $scope.totalLeaveEncashmentBalance = {
            postive: true,
            value: 0,
            overwriteValue: null,
        };

        $scope.cannotFinalizeFnf = false

        
        var fnfDetailsCallback = function (list) {            
            angular.forEach(list, function (v, k) {
                v.full_name = utilityService.getInnerValue(v, 'employee_preview', 'full_name');
                v.employee_id = utilityService.getInnerValue(v, 'employee_preview', 'personal_profile_employee_code');
                if (angular.isUndefined(v.is_draft)) {
                    v.is_draft = undefined;
                }
                v.isChecked = false;                
            });
            $scope.fnfDetails.selectedEmployees = 0;
        };
        var getEmployeeDetails = function () {
            var url = service.getUrl('listing'),
                params = {};

            // if (utilityService.getInnerValue($scope.fnfDetails, 'fnfStatus', 'selected') == 3) {
                params.year = utilityService.getInnerValue($scope.fnfDetails.fnfStatus, 'year', 'selected');
                params.month = utilityService.getInnerValue($scope.fnfDetails.fnfStatus, 'month', 'selected');
                params.action_type = utilityService.getInnerValue($scope.fnfDetails, 'fnfStatus', 'selected')
            // }

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    fnfDetailsCallback(utilityService.getValue(data, 'employees', []), true);
                    $scope.fnfDetails.list = data.employees;
                    $scope.fnfDetails.visible = true;
                });
        };
        getEmployeeDetails();
        var syncInitiateFnfData = function(model, item, data, encashableLeaveObject, otherDamagePenaltyObject, exitClearancesObject, recoverableLeaveObject) {
            /***** Start: Leave Encashable Section *****/
            model.payable_to_employee.leave_incashable = [];
            if (encashableLeaveObject) {
                encashedBalanceCondition(encashableLeaveObject, data)
                angular.forEach(utilityService.getValue(data, 'leave_details', []), function(value, key) {
                    model.payable_to_employee.leave_incashable.push({
                        plan_id: utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'plan_id', utilityService.getValue(value, 'plan_id')),                
                        name: utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'name', utilityService.getValue(value, 'name')),                
                        balance: utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'balance', utilityService.getValue(value, 'balance')),
                        actual_balance: utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'actual_balance', utilityService.getValue(value, 'actual_balance')),
                        amount_based_on_setup: utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'amount_based_on_setup', utilityService.getValue(value, 'amount_based_on_setup')),
                        amount_overwrite: utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'amount_overwrite', utilityService.getValue(value, 'amount_overwrite')),
                        overwite_balance: utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'overwite_balance', utilityService.getValue(value, 'overwite_balance')),
                        encashable_leave_calculation: utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'encashable_leave_calculation', utilityService.getValue(value, 'encashable_leave_calculation')),
                        encashable_leave_calculation_display: utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'encashable_leave_calculation_display', utilityService.getValue(value, 'encashable_leave_calculation_display')),
                        per_day_blance: utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'per_day_blance', utilityService.getValue(value, 'per_day_blance')),


                    });
                });
            } else {
                encashedBalanceCondition(encashableLeaveObject, data)
                angular.forEach(utilityService.getValue(data, 'leave_details', []), function(value, key) {
                    model.payable_to_employee.leave_incashable.push({
                        plan_id: utilityService.getValue(value, 'plan_id'),
                        name: utilityService.getValue(value, 'name'),
                        balance: utilityService.getValue(value, 'balance'),
                        actual_balance: utilityService.getValue(value, 'actual_balance'),
                        amount_based_on_setup: utilityService.getValue(value, 'amount_based_on_setup'),
                        amount_overwrite: utilityService.getValue(value, 'amount_overwrite'),
                        overwite_balance: utilityService.getValue(value, 'overwite_balance'),
                        encashable_leave_calculation: utilityService.getValue(value, 'encashable_leave_calculation'),
                        encashable_leave_calculation_display: utilityService.getValue(value, 'encashable_leave_calculation_display'),
                        per_day_blance: utilityService.getValue(value, 'per_day_blance'),

                    });
                });
            }
            /***** End: Leave Encashable Section *****/

            /***** Start: Exit Clearance Section *****/
            model.payable_by_employee.exit_clearances = [];
            if (exitClearancesObject) {
                angular.forEach(utilityService.getValue(data, 'exit_clearances', []), function(value, key) {
                    var clearanceId = utilityService.getInnerValue(value, '_id', "$id");
                    model.payable_by_employee.exit_clearances.push({
                        clearance_id: clearanceId,                
                        clearance_name: utilityService.getInnerValue(exitClearancesObject, clearanceId, 'clearance_name', utilityService.getValue(value, 'clearance_name')),                
                        amount_due: utilityService.getInnerValue(exitClearancesObject, clearanceId, 'amount_due', utilityService.getValue(value, 'amount_due')),
                        amount_overwrite: utilityService.getInnerValue(exitClearancesObject, clearanceId, 'amount_overwrite'),
                        overwite_balance: utilityService.getInnerValue(exitClearancesObject, clearanceId, 'overwite_balance'),
                    });
                });
            } else {
                angular.forEach(utilityService.getValue(data, 'exit_clearances', []), function(value, key) {
                    model.payable_by_employee.exit_clearances.push({
                        clearance_id: utilityService.getInnerValue(value, '_id', "$id"),                    
                        clearance_name: utilityService.getValue(value, 'clearance_name'),
                        amount_due: utilityService.getValue(value, 'amount_due') 
                    });
                });
            }
            /***** End: Exit Clearance Section *****/

            /***** Start: Other Damage Penalties Section *****/
            model.payable_by_employee.other_damage_penalities = [];
            angular.forEach(utilityService.getValue(data, 'other_damage_penalties', []), function(value, key) {
                value.amount = utilityService.getInnerValue(otherDamagePenaltyObject, value.provision_id, 'amount') ? utilityService.getInnerValue(otherDamagePenaltyObject, value.provision_id, 'amount') : value.amount;

                model.payable_by_employee.other_damage_penalities.push(value);
            });
            /***** End: Other Damage Penalties Section *****/

            /***** Start: Leave Recovery Section *****/
            model.payable_by_employee.leave_recovery = [];
            // This code has been commented as it has been already merge with leave encashment
            /* if (recoverableLeaveObject) {
                angular.forEach(utilityService.getValue(data, 'leave_details', []), function(value, key) {
                    model.payable_by_employee.leave_recovery.push({
                        plan_id: utilityService.getInnerValue(recoverableLeaveObject, value.plan_id, 'plan_id', utilityService.getValue(value, 'plan_id')),                
                        name: utilityService.getInnerValue(recoverableLeaveObject, value.plan_id, 'name', utilityService.getValue(value, 'name')),                
                        leave_recovery_balance: utilityService.getInnerValue(recoverableLeaveObject, value.plan_id, 'leave_recovery_balance', utilityService.getValue(value, 'leave_recovery_balance')),
                        leave_recovery_amount: utilityService.getInnerValue(recoverableLeaveObject, value.plan_id, 'leave_recovery_amount', utilityService.getValue(value, 'leave_recovery_amount'))
                    });
                });
            } else {
                angular.forEach(utilityService.getValue(data, 'leave_details', []), function(value, key) {
                    model.payable_by_employee.leave_recovery.push({
                        plan_id: utilityService.getValue(value, 'plan_id'),
                        name: utilityService.getValue(value, 'name'),
                        leave_recovery_balance: utilityService.getValue(value, 'leave_recovery_balance'),
                        leave_recovery_amount: utilityService.getValue(value, 'leave_recovery_amount')
                    });
                });
            } */
            /***** End: Leave Recovery Section *****/

            model.ctc_breakup = utilityService.getValue(data, 'ctc_breakup', []);
            model.relieving_date = utilityService.getValue(item, 'system_plan_last_working_date');
            model.full_name = utilityService.getInnerValue(item, 'employee_preview', 'full_name');
            model.emp_code = utilityService.getInnerValue(item, 'employee_preview', 'personal_profile_employee_code');
        };
        var initiateFnfDataCallback = function (model, item, data) {
            model.employee_id = item._id;
            model.payable_to_employee.hold_amount = utilityService.getValue(data, 'hold_amount');
            model.payable_to_employee.advance_amount = utilityService.getValue(data, 'advance_amount');
            model.payable_to_employee.expense_advance_amount = utilityService.getValue(data, 'expense_advance_amount');
            model.payable_to_employee.expense_reimbrusment_amount = utilityService.getValue(data, 'expense_reimbrusment_amount');
            model.payable_to_employee.is_gratuity_enabled = utilityService.getValue(data, 'is_gratuity_enabled', false);
            model.payable_to_employee.gratuity.amount = utilityService.getValue(data, 'gratuity_amount');
            model.payable_to_employee.gratuity.tenure = utilityService.getValue(data, 'gratuity_tenure');
            model.payable_to_employee.gratuity.payable_at = utilityService.getValue(data, 'gratuity_payable_at', 2);
            model.payable_to_employee.other_remark = utilityService.getValue(data, 'other_remark', null);
        };
        $scope.initiateFnfData = function(item) {
            if(item.isDisabled) {
                return false;
            }
            $scope.fnfModel = service.buildFnfObject();
            item.isDisabled = true;
            var url = service.getUrl('fnfDetails') + '/' + item._id;
            serverUtilityService.getWebService(url)
            .then(function (data) {
                    syncInitiateFnfData($scope.fnfModel, item, utilityService.getValue(data, 'data'));
                    initiateFnfDataCallback($scope.fnfModel, item, utilityService.getValue(data, 'data'));
                    $scope.openModal('fnf-details.tmpl.html', 'fndDetails');
                    item.isDisabled = false;
                });
        };
        var pendingRequestsCallback = function (data, item) {
            $scope.fnfDetails.request.totalCount = service.getTotalPendingRequestCount(utilityService.getValue(data, 'data'));                    
            $scope.fnfDetails.pendingRequests = utilityService.getValue(data, 'data');
            $scope.fnfDetails.request.totalCount 
                ? $scope.openModal('fnf-pending-requests.tmpl.html', 'pendingRequest', 'md')
                : $scope.initiateFnfData(item);
        };
        $scope.getPendingRequests = function (item) {
            var url = service.getUrl('pendingRequests') + '/' + item._id;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    if (utilityService.getValue(data, 'status') === 'success') {
                    pendingRequestsCallback(data, item);
                    } else {
                        $scope.errorMessagesInitiateFnf = buildError(data)
                        $scope.openModal('initiate-fnf-error.tmpl.html', 'errorInitiateFnf', 'md')
                    }
                });
        };
        $scope.addMore = function(key1, key2) {
            $scope.fnfModel[key1][key2].push({
                title : null,
                amount : null,
                is_amount_taxable: false
            });
        };
        $scope.checkDuplicate = function(title, allTitles){
            var titles = allTitles.map(function(val){
                return val.title.toLowerCase();
            })
            var count = window._.countBy(titles)
            $scope.duplicateTitle = count[title.toLowerCase()] > 1

        }
        $scope.removeExisting = function(key1, key2, index) {
            $scope.fnfModel[key1][key2].splice(index, 1);
        };        
        $scope.updateFnfDetails = function(isDraft) {
            isDraft = angular.isDefined(isDraft) ? isDraft : false;           
            var url = service.getUrl('initiateFnf'),
                payload = service.buildFnfPayload($scope.fnfModel, isDraft, $scope.totalLeaveEncashmentBalance);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data);
                });            
        };        
        $scope.saveAsDraftFnf = function () {
            var isDraft = true;
            $scope.updateFnfDetails(isDraft);
        };
        $scope.viewDownloadFnfCertificate = function(item, certificateType) {            
            var url = service.getUrl('certificate') + "/"
                + item.initiate_id + "/" + certificateType;

            $scope.viewDownloadFileUsingForm(url);
        };

        $scope.viewDownloadTaxSlip = function (item, action) {
            var url = SlipService.getUrl('viewDownloadTaxSlip')
                + "/" + item.relieved_payroll_year 
                + "/" + item.relieved_payroll_month
                + "/" + action + "/"+ item._id;

            $scope.viewDownloadFileUsingForm(url);
           
        };
        $scope.viewDownloadfnfSlip = function (item, action) {
            var url = EmployeeTaskService.getUrl('salarySlipViewDownload')
                + "/" + item.relieved_payroll_year
                + "/" + item.relieved_payroll_month
                + "/" + '4' + "/"+ action + "/"+ item._id;

            $scope.viewDownloadFileUsingForm(url);
            
        };
        $scope.viewInitiateFnfDetail = function(item, title) {
            if(item.isDisabled) {
                return false;
            }
            
            item.isDisabled = true;            
            var empId = item._id,                
                url1 = service.getUrl('initiateFnf') + "/" + empId,
                url2 = service.getUrl('fnfDetails')+ '/'+ empId;

            $q.all([
                serverUtilityService.getWebService(url1), 
                serverUtilityService.getWebService(url2)
            ]).then(function(data) {
                $scope.fnfModel = service.buildFnfObject(data[0].data, title);
                syncInitiateFnfData($scope.fnfModel, item, data[1].data, service.convertLeaveListToObject(
                    utilityService.getInnerValue(data[0].data, 'payable_to_employee', 'leave_incashable', [])
                ), service.convertAssetListToObject(
                    utilityService.getInnerValue(data[0].data, 'payable_by_employee', 'other_damage_penalities', [])
                ), service.convertExitClearanceListToObject(
                    utilityService.getInnerValue(data[0].data, 'payable_by_employee', 'exit_clearances', [])
                ), service.convertLeaveListToObject(
                    utilityService.getInnerValue(data[0].data, 'payable_by_employee', 'leave_recovery', [])
                ));        

                $scope.openModal('fnf-details.tmpl.html', 'fndDetails');
                item.isDisabled = false;
            });
        };
        $scope.isFnFDetailsEditable = function() {
            return $scope.fnfModel.title == 'Add' || $scope.fnfModel.title == 'Edit';
        };        
        $scope.changeFnfStatusHandler = function (newValue, oldValue) {
            $scope.fnfDetails.fnfStatus.isDraft = undefined;
            // if (((oldValue == 1 || oldValue == 2) && newValue == 3) 
            //     || (oldValue == 3 && (newValue == 1 || newValue == 2))) {
                getEmployeeDetails();
            // }          
        };
        $scope.changeYearMonthHandler = function () {
            getEmployeeDetails();
        };
        $scope.exportFndFDetails = function () {
            var csvData = service.buildFndFDetailsCSVData(utilityService.getValue($scope.fnfDetails, 'filteredItems', []), $scope.fnfDetails.fnfStatus.mapping, $scope.fnfDetails.actionStatus.mapping);
            utilityService.exportToCsv(csvData.content, 'fndf-details-listing.csv');
        };
        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };
        $scope.updatePaginationSettings('fndf_details_listing');

        /***** Start Success Error Callback *****/
        var successCallback = function (data, section) {
            $scope.closeModal('fndDetails');
            utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            getEmployeeDetails();
        };
        var errorCallback = function (data, section) {
            $scope.errorMessages = [];
            if (utilityService.getInnerValue(data, 'data', 'message')) {
                utilityService.resetAPIError(true, "", section);
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function (value, key) {
                        $scope.errorMessages.push(value[0]);
                    });
                    
                } else {
                    $scope.errorMessages.push(data.data.message);
                }
            } else {
                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(utilityService.getValue(data, 'message'));                   
            }
        };
        var successErrorCallback = function (data, section) {
            section = angular.isDefined(section) ? section : "initiateFnf";
            data.status === "success" ? successCallback(data, section) : errorCallback(data, section);
        };
        /***** End Success Error Callback *****/         
        
        /***** Start Download Sample Template & Upload Filled Template Section *****/
        var downloadFile = function (uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            window.location.assign(uri);
        };
        $scope.downloadSampleTemplate = function (urlPrefix) {
            serverUtilityService.getWebService(service.getUrl(urlPrefix))
                .then(function (data) {                    
                    downloadFile(utilityService.getValue(data, 'data'), "bulk-initiate-fnf.csv");
                });
        };
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
        var uploadSuccessCallback = function (response) {
            if (utilityService.getInnerValue(response, 'data', 'status') === "error") {
                var message = utilityService.getInnerValue(response, 'data', 'message');                
                
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
                    $scope.usermanagent.isBulkVisible = true;
                }
                $scope.openModal('bulk-upload-fnf-error.tmpl.html', 'uploadFnf');
            } else {
                $scope.usermanagent.errorGrid = false;
                $scope.errorMessages = [];
                $scope.closeModal('uploadFnf');
                utilityService.showSimpleToast(utilityService.getInnerValue(response, 'data', 'message'));
                getEmployeeDetails();
            }                    
        };        
        var uploadErrorCallback = function (response) {
            var msg = response.data.message ? response.data.message : "Something went worng.";
            $scope.errorMessages.push(msg);
        };
        var uploadProgressCallback = function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };        
        $scope.changeList = function (key) {
            $scope.parsedCsv = key == 'all' ? $scope.dataList : $scope.data;
        };        
        $scope.uploadFnf = function (fileObject, urlPrefix) {
            $scope.errorMessages = [];
            $scope.usermanagent.errorGrid = false;
            $scope.usermanagent.isBulkVisible = false;

            Upload.upload({
                url: service.getUrl(urlPrefix),
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: {
                    'upload_csv': fileObject
                },
            }).then(function (response) {
                uploadSuccessCallback(response);
            }, function (response) {
                uploadErrorCallback(response);
            }, function (evt) {
                uploadProgressCallback(evt);
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

        /***** Start: Update Personal Email & Send Link Section *****/
        $scope.updatePersonalEmail = function (event, item) {
            item.isDisabled = true;            
            var url = service.getUrl('updateEmail') + "/" + item.employee_preview._id,
                payload = {
                    email_id: utilityService.getValue(item, 'personal_email_id')
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    item.isDisabled = false;
                    if (utilityService.getValue(data, 'status') === 'success') {
                        utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                        $scope.toggleEditableEmail(item, false);
                    } else {
                        showAlert(event, utilityService.getValue(data, 'message'));
                    }
                });
        };
        $scope.sendLink = function (event, item, actionStatus) {
            item.isDisabled = true;
            var url = service.getUrl('sendLink'),
                payload = {
                    email_id: utilityService.getValue(item, 'personal_email_id'),
                    emp_id: item.employee_preview._id,
                    action_status: actionStatus
                };

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    item.isDisabled = false;
                    if (utilityService.getValue(data, 'status') === 'success') {
                        getEmployeeDetails();
                        utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                    } else {
                        showAlert(event, utilityService.getValue(data, 'message'));
                    }
                });
        };
        $scope.toggleEditableEmail = function (item, flag) {
            item.isEditable = flag;
        };
        /***** End: Update Personal Email & Send Link Section *****/

        /***** Start: Download Bulk FNF Details Section *****/
        $scope.downloadFnfDetailsInBulk = function () {
            $scope.formSubmitHandler('bulkDownloadFnf', true);
            $q.all([                 
                serverUtilityService.getWebService(service.getUrl('allLeaves'), {status: true}),
                serverUtilityService.getWebService(service.getUrl('allAssets')),
                serverUtilityService.getWebService(service.getUrl('allClearances')),
                serverUtilityService.getWebService(service.getUrl('bulkFnfDetails')),
            ]).then(function(data) {
                var leaves = service.extractAllLeaves(utilityService.getValue(data[0], 'data', [])),
                    assets = service.extractAllAssets(utilityService.getValue(data[1], 'data', [])),
                    clearances = service.extractAllClearances(utilityService.getValue(data[2], 'data', [])),
                    list = utilityService.getValue(data[3], 'data', []);
                
                var csvData = service.buildBulkFnfDetailsCSVData(leaves, assets, clearances, list);
                $scope.formSubmitHandler('bulkDownloadFnf', false);
                utilityService.exportToCsv(csvData.content, 'bulk-fndf-details-listing.csv');
            });
        };        
        /***** End: Download Bulk FNF Details Section *****/

        /***** Start: FNF History Section *****/
        var fnfHistoryCallback = function (title) {
            title = angular.isDefined(title) ? title : 'View';
            $scope.fnfModel = service.buildFnfObject($scope.fnfDetails.history.log, title);
            syncInitiateFnfData($scope.fnfModel, $scope.fnfDetails.item, $scope.fnfDetails.defaultData, 
                service.convertLeaveListToObject(
                    utilityService.getInnerValue($scope.fnfDetails.history.log, 
                        'payable_to_employee', 'leave_incashable', [])
                ), 
                service.convertAssetListToObject(
                    utilityService.getInnerValue($scope.fnfDetails.history.log, 
                        'payable_by_employee', 'other_damage_penalities', [])
                ), 
                service.convertExitClearanceListToObject(
                    utilityService.getInnerValue($scope.fnfDetails.history.log, 
                        'payable_by_employee', 'exit_clearances', []))
                ),
                service.convertLeaveRecoveryListToObject(
                    utilityService.getInnerValue($scope.fnfDetails.history.log, 
                        'payable_by_employee', 'leave_recovery', [])
                );
        };
        $scope.viewFnfHistory = function(item, title) {
            if(item.isDisabled) {
                return false;
            }
            
            item.isDisabled = true;       
            $q.all([
                serverUtilityService.getWebService(service.getUrl('fnfHistory')+ '/'+ item._id), 
                serverUtilityService.getWebService(service.getUrl('fnfDetails')+ '/'+ item._id)
            ]).then(function(data) {
                $scope.fnfDetails.history.list = utilityService.getValue(data[0], 'data', []);
                $scope.fnfDetails.history.log = $scope.fnfDetails.history.list[0];
                $scope.fnfDetails.defaultData = utilityService.getValue(data[1], 'data');
                $scope.fnfDetails.item = item;
                fnfHistoryCallback(title);
                $scope.openModal('fnf-history.tmpl.html', 'fnfHistory');
                item.isDisabled = false;
            });
        };
        $scope.changeHistoryHandler = function (log) {
            $scope.fnfDetails.history.log = log;
            fnfHistoryCallback();
        };
        /***** End: FNF History Section *****/

        /***** Start: Bulk Initiate Fnf Section *****/
        $scope.checkboxSelectionHandler = function (isChecked) {
            $scope.fnfDetails.selectedEmployees = isChecked 
                ? parseInt(utilityService.getValue($scope.fnfDetails, 'selectedEmployees', 0)) + 1
                : parseInt(utilityService.getValue($scope.fnfDetails, 'selectedEmployees', 0)) - 1;

            if (!isChecked) {
                $scope.fnfDetails.checkAll = isChecked;
            }
        };
        $scope.allCheckboxSelectionHandler = function (isChecked) {
            $scope.fnfDetails.selectedEmployees = 0;
            var list = utilityService.getValue($scope.fnfDetails, 'filteredItems', []);                        
            angular.forEach(list, function (value, key) {
                if (!utilityService.getValue(value, 'is_pending_request', false)) {
                    value.isChecked = isChecked;
                    if (isChecked) {
                        $scope.checkboxSelectionHandler(isChecked);
                    }                    
                }
            });
        };
        var prepareBulkInititateFnfData = function (list) {
            var output = [];

            angular.forEach(list, function (value, employeeId) {
                object = service.buildFnfObject();
                syncInitiateFnfData(object, { _id: employeeId }, value);
                initiateFnfDataCallback(object, { _id: employeeId }, value);
                output.push(object);
            });
            
            return output;
        };
        var bulkIniitateFnfCallback = function (event, data) {
            if (utilityService.getValue(data, 'status') === "success") {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                getEmployeeDetails();
            } else {
                showAlert(event, utilityService.getValue(data, 'message'));
            }
        };
        var bulkIniitateFnf = function (event, input) {
            var url = service.getUrl('bulkSaveAsDraft'),
                output = prepareBulkInititateFnfData(utilityService.getValue(input, 'data')),
                payload = service.buildBulkInitiatePayload(output);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    $scope.formSubmitHandler('bulkInitiateFnf', false);
                    bulkIniitateFnfCallback(event, data);
                });
        };
        $scope.bulkIniitateFnf = function (event) {
            $scope.formSubmitHandler('bulkInitiateFnf', true);
            var url = service.getUrl('bulkInitiate'),
                payload = service.buildPrepareBulkInitiatePayload(utilityService.getValue($scope.fnfDetails, 'filteredItems', []));

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    bulkIniitateFnf(event, data);
                });
        };
        /***** End: Bulk Initiate Fnf Section *****/

        /***** Start Angular Modal Section *****/
        $scope.openModal = function(templateUrl, instance, size) {
            size = angular.isDefined(size) ? size : 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
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
        /***** End Angular Modal Section *****/

        /***** Start: Conformation Dialog & Alert Section ******/
        var showConfirmDialog = function(ev, functionName, item, section, actionStatus) {
            var confirm = $mdDialog.confirm()
                .title(utilityService.getInnerValue($scope.fnfDetails.dialogBox, section, 'title'))
                .textContent(utilityService.getInnerValue($scope.fnfDetails.dialogBox, section, 'textContent'))
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok(utilityService.getInnerValue($scope.fnfDetails.dialogBox, section, 'ok'))
                .cancel(utilityService.getInnerValue($scope.fnfDetails.dialogBox, section, 'cancel'));

            $mdDialog.show(confirm).then(function() {
                if (section === 'updateFnf') {
                    var isDraft = false;
                    functionName(isDraft);
                } else if (section === 'bulkUpdateFnf') {
                    functionName(ev);
                } else {
                    functionName(ev, item, actionStatus);
                }                
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function(event, functionName, item, section, actionStatus) {
            actionStatus = angular.isDefined(actionStatus) ? actionStatus : null;
            showConfirmDialog(event, functionName, item, section, actionStatus);
        };
        $scope.confirmAndUpdateFnf = function (event, functionName, section) {
            showConfirmDialog(event, functionName, null, section);
        };
        var showAlert = function(ev, textContent) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Alert!')
                    .textContent(textContent)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
        /***** End: Conformation Dialog & Alert Section ******/

        $scope.adminUploadProofs = function (item) {
            var url = '#/frontend/payroll/investmentProof',
                    queryParams = 'empId=' + utilityService.getValue(item, '_id')
                    + "&name=" + utilityService.getValue(item, 'full_name')
                    + "&code=" + utilityService.getValue(item, 'employee_id')
                    + "&pic=" + utilityService.getInnerValue(item, 'employee_preview', 'profile_pic')
                    + "&employee_type=relieved"
                    + "&fnf_type";
            if (item.system_plan_last_working_date !== '') {
                var year = getCurrentFiscalYear(item.system_plan_last_working_date);
                queryParams = queryParams + '&year=' + year;
            }

            $window.open(url + '?' + queryParams, '_blank');
        };

        function getCurrentFiscalYear(date) {
            //get current date
            var today = new Date();
            if (date) {
                today = new Date(date);
            }
            //get current month
            var curMonth = today.getMonth() + 1;

            var fiscalYr = "";
            if (curMonth > 3) { //
                fiscalYr = Math.abs(today.getFullYear());
            } else {
                fiscalYr = Math.abs(today.getFullYear()) - 1;
            }

            return fiscalYr;
        }

        var encashedBalanceCondition = function (encashableLeaveObject, data) {
            var map = utilityService.getValue(data, 'leave_details', []).reduce(function(intialValue, value) {
                 var balance = utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'amount_based_on_setup', utilityService.getValue(value, 'amount_based_on_setup'))
                 var amount_overwrite = utilityService.getInnerValue(encashableLeaveObject, value.plan_id, 'amount_overwrite', utilityService.getValue(value, 'amount_overwrite'))
                 if(angular.isDefined(amount_overwrite) && isNumber(amount_overwrite)){
                    return amount_overwrite + intialValue
                 }else if (isNumber(balance)){
                    return balance + intialValue
                 }
                 return intialValue
            } , 0)

            $scope.fnfModel.payable_to_employee.total_encashment_or_recovery_amt_as_per_setting = Math.round(map);
            // console.log(map)
            // if(map > 0) {
            //     $scope.fnfModel.payable_to_employee.is_encashment_taxable = true;
            // }
            // if(map < 0) {
            //     $scope.fnfModel.payable_to_employee.is_encashment_taxable = false;
            // }
        }

        var isNumber = function isNumber(value) {
            return typeof value === 'number' && isFinite(value);
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

        $scope.checkMonthGracia = function (value) {
            if(value >= 54) {
                $scope.fnfModel.payable_to_employee.gratuity.payable_at = 1
            } else {
                $scope.fnfModel.payable_to_employee.gratuity.payable_at = 2
            }

        }

        var getPayrollModulePermissions = function () {
            var url = service.getUrl('modulePermission') + '/payroll'; 
            serverUtilityService.getWebService(url)
                .then(function (data){
                    console.log(data)
                    var response = utilityService.getValue(data, 'data', []);
                    angular.forEach(response, function(value){
                        if(value.permission_slug === 'cannot_finalize_fnf'){
                            $scope.cannotFinalizeFnf = true
                        }
                    })
        
                });
        };

        getPayrollModulePermissions();

        $scope.viewEncashedCalulation = function(balance) {
            $scope.encashedBalancecalulation = null
            $scope.openModal('fnf-encashed-calculation.tmpl.html', 'fndEncashedDetails');
            $scope.encashedBalancecalulation = balance
        }

        $scope.calculatOverwriteAmount = function(item) {
            item.amount_overwrite = Math.round(item.per_day_blance * item.overwite_balance)
            if( item.amount_overwrite === 0){
                delete  item.amount_overwrite
            }
            // angular.forEach($scope.fnfModel.payable_to_employee.leave_incashable, function(value){

            // })

            var map = $scope.fnfModel.payable_to_employee.leave_incashable.reduce(function(intialValue, value) {
                var balance =  utilityService.getValue(value, 'amount_based_on_setup')
                var amount_overwrite =  utilityService.getValue(value, 'amount_overwrite')
                if(angular.isDefined(amount_overwrite) && isNumber(amount_overwrite)){
                   return amount_overwrite + intialValue
                }else if (isNumber(balance)){
                   return balance + intialValue
                }
                return intialValue
           } , 0)

           $scope.fnfModel.payable_to_employee.total_encashment_or_recovery_amt_as_per_setting = Math.round(map);
           
        }


	}
]);