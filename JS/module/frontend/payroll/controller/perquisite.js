app.controller('PayrollAdminPerquisiteController', [
    '$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$q', '$modal', 'FORM_BUILDER', 'PayrollOverviewService', 'utilityService', 'ServerUtilityService', 'PayrollAdminPerquisiteService',
    function ($scope, $rootScope, $routeParams, $location, $timeout, $q, $modal, FORM_BUILDER,  payrollOverviewService, utilityService, serverUtilityService, service) {
        'use strict';

        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.perquisite = {
            tabSelected: 0,
            perquisiteComponents: [],
            summary: service.buildSummaryObject(),
            monthlyDetails: service.buildMonthlyDetailsObject()
        };
        $scope.openedModal = {};
        $scope.csv = {};
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

        var getAllPerquisiteComponents = function(cb) {
            var url = service.getUrl('allComponents') + '/8';
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.perquisite.perquisiteComponents = utilityService.getValue(data, 'data');
                if(cb) { cb(); }
            });
        };

        $scope.sortTableBy = function(key) {
            if($scope.perquisite.tabSelected == 0) {
                $scope.perquisite.summary.sort.reverse = $scope.perquisite.summary.sort.key == key ? !$scope.perquisite.summary.sort.reverse : false;
                $scope.perquisite.summary.sort.key = key;
            }
            if($scope.perquisite.tabSelected == 1) {
                $scope.perquisite.monthlyDetails.sort.reverse = $scope.perquisite.monthlyDetails.sort.key == key ? !$scope.perquisite.monthlyDetails.sort.reverse : false;
                $scope.perquisite.monthlyDetails.sort.key = key;
            }
        };

        $scope.exportTableToCsv = function(list, section) {
            if(section == 'summary') {
                var csvData = service.buildSummaryListExport(list);
                var prefix = '_' + utilityService.getInnerValue($scope.perquisite.summary, 'selectedComponent', 'slug');
                prefix += '_' + utilityService.getInnerValue($scope.perquisite.summary, 'year', 'selected');
                var fileName = section + prefix;
                if($scope.legal_entity.entity_id) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                utilityService.exportToCsv(csvData, fileName);
            }
            if(section == 'monthly') {
                var url = service.getUrl('csvDownloadMonthly') + '/'
                    + $scope.perquisite.monthlyDetails.year.selected + '/'
                    + (parseInt($scope.perquisite.monthlyDetails.month.selected, 10) + 1) + '/'
                    + utilityService.getInnerValue($scope.perquisite.monthlyDetails, 'selectedComponent', 'slug');
                $scope.viewDownloadFileUsingForm(url);
            }
        };

        /*************Summary Tab: Start****************/
        var getYearlyBreakupsList = function() {
            var comp = utilityService.getValue($scope.perquisite.summary.selectedComponent, 'slug');
            var year = utilityService.getValue($scope.perquisite.summary.year, 'selected');
            if(comp) {
                $scope.perquisite.summary.breakups.visible = false;
                var url = service.getUrl('perquisiteYearly') + '/' + comp;
                var param = {};
                if(year) { param.year = year; }
                serverUtilityService.getWebService(url, param).then(function(data) {
                    $scope.perquisite.summary.breakups.list = service.buildSummaryList(utilityService.getValue(data, 'data', []));
                    $scope.perquisite.summary.breakups.visible = true;
                });
            } else {
                $scope.perquisite.summary.breakups.list = [];
                $scope.perquisite.summary.breakups.visible = true;
            }
        };

        var getHistoryFormsList = function(cb) {
            var actObj = $scope.perquisite.summary.action,
                emp_id = utilityService.getInnerValue(actObj, 'selectedBreakupItem','employee_id', null),
                selected_comp = utilityService.getInnerValue($scope.perquisite.summary, 'selectedComponent','slug', null);
            if(emp_id && selected_comp) {
                var url = service.getUrl('perquisiteFormsListHistory') + '/' + emp_id + '/' + selected_comp;
                serverUtilityService.getWebService(url).then(function(data) {
                    actObj.historyForms = utilityService.getValue(data, 'data', []);
                    if(actObj.historyForms.length) {
                        actObj.selectedHistoryForm = actObj.historyForms[actObj.historyForms.length-1];
                    } else {
                        actObj.selectedHistoryForm = null;
                    }
                    if(cb) { cb(actObj.historyForms.length); }
                });
            } else {
                if(cb) { cb(false); }
            }

        };

        var getFormDetailsFromHistory = function(cb) {
            var actObj = $scope.perquisite.summary.action;
            var history_form_id = utilityService.getInnerValue(actObj, 'selectedHistoryForm', '_id');
            if(history_form_id) {
                var url = service.getUrl('perquisiteFormHistory') + '/' + history_form_id;
                serverUtilityService.getWebService(url).then(function(data) {
                    $scope.perquisite.summary.action.form = service.buildFormObject(utilityService.getInnerValue(data, 'data', 'form_detail', []));
                    $scope.perquisite.summary.action.visible = true;
                    if(cb) { cb(history_form_id); }
                });
            } else {
                if(cb) { cb(history_form_id); }
            }
        };

        var getFormDetails = function(cb) {
            var actObj = $scope.perquisite.summary.action;
            var form_id = utilityService.getInnerValue(actObj, 'selectedBreakupItem', 'perquisite_form');
            if(form_id) {
                var url = service.getUrl('perquisiteForm') + '/' + form_id;
                url += '/' + utilityService.getInnerValue(actObj, 'selectedBreakupItem', '_id');
                serverUtilityService.getWebService(url).then(function(data) {
                    $scope.perquisite.summary.action.form = service.buildFormObject(utilityService.getInnerValue(data, 'data', 'form_detail', []));
                    $scope.perquisite.summary.action.visible = true;
                    if(cb) { cb(form_id); }
                });
            } else {
                if(cb) { cb(form_id); }
            }
        };

        $scope.HandleSelectFormInHistory = function() {
            getFormDetailsFromHistory();
        };

        $scope.openModalToViewHistoryForm = function() {
            $scope.errorMessages = [];
            getHistoryFormsList(function() {
                getFormDetailsFromHistory(function(form_id) {
                    var size = 'lg';
                    if(!form_id) {
                        size = 'sm';
                    }
                    $scope.openModal('admin-perquisite-form-question-tmpl.html', 'adminPerquisiteFormQuestion', size);
                });
            });
        };

        $scope.openModalToActivate = function() {
            $scope.errorMessages = [];
            getFormDetails(function(form_id) {
                var size = 'lg';
                if(!form_id) {
                    size = 'sm';
                }
                $scope.openModal('admin-perquisite-form-question-tmpl.html', 'adminPerquisiteFormQuestion', size);
            });
        };

        $scope.openModalToStop = function() {
            $scope.openModal('admin-perquisite-summary-stop-tmpl.html', 'adminPerquisiteSummaryStop', 'sm');
        };

        $scope.initiateAction = function(item, formMode, action) {
            if(item.isModalOpened) { return false; }
            item.isModalOpened = true;
            var actObj = service.buildActionInSummaryObject();
            actObj.selectedBreakupItem = item;
            actObj.actionType = action;
            actObj.formMode = formMode;
            actObj.historyForms = [];
            actObj.selectedHistoryForm = null;
            $scope.perquisite.summary.action = actObj;
            if(action == 'activate' || actObj.formMode == 'edit' || actObj.formMode == 'view') {
                if (actObj.formMode == 'view') {
                    $scope.openModalToViewHistoryForm();
                } else {
                    $scope.openModalToActivate();
                }
            }
            if(action == 'stop') {
                $scope.openModalToStop();
            }
            item.isModalOpened = false;
        };

        $scope.submitAction = function(inDraft) {
            var actObj = $scope.perquisite.summary.action;
            if(actObj) {
                var url, payload = {}, reqMethod = 'uploadWebService';
                if(actObj.actionType == 'activate' || actObj.formMode == 'edit') {
                    url = service.getUrl('activateEmpPerquisite');
                    reqMethod = 'uploadWebService';
                    if(actObj.actionType == 'activate') {
                        if(inDraft) {
                            payload.is_draft = true;
                        } else {
                            payload.status = 2;
                        }
                    }
                    if(utilityService.getValue(actObj.form, 'questions')) {
                        payload = service.addQuestionsInPayload(payload, actObj.form.questions);
                    }
                }
                if(actObj.actionType == 'stop') {
                    reqMethod = 'putWebService';
                    url = service.getUrl('stopEmpPerquisite');
                    payload.status = 3;
                }
                url += '/' + utilityService.getValue(actObj.selectedBreakupItem, '_id');
                serverUtilityService[reqMethod](url, payload).then(function(data) {
                    $scope.errorMessages = [];
                    if(data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        if(actObj.actionType == 'activate') {
                            if(!inDraft) {
                                actObj.selectedBreakupItem.status = 2;
                            }
                            if(utilityService.getValue(actObj.form, 'questions')) {
                                actObj.selectedBreakupItem.form_submitted = true;
                            }
                        }
                        if(actObj.actionType == 'activate' || actObj.formMode == 'edit') {
                            $scope.closeModal('adminPerquisiteFormQuestion');
                        }
                        if(actObj.actionType == 'stop') {
                            actObj.selectedBreakupItem.status = 3;
                            $scope.closeModal('adminPerquisiteSummaryStop');
                        }
                    } else {
                        if(angular.isString(utilityService.getValue(data.data, 'message'))) {
                            $scope.errorMessages.push(utilityService.getValue(data.data, 'message'));
                        } else {
                            angular.forEach(utilityService.getValue(data.data, 'message'), function(val, key) {
                                angular.forEach(val, function(v, k) {
                                    $scope.errorMessages.push(v);
                                });
                            });
                        }
                    }
                });
            }
        };

        /******Start: Form Attachment*********/
        $scope.setFileObject = function(file, item){
            item.fileError = null;
            if(!file) {
                return;
            }

            var is_valid_file = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
            
            if(is_valid_file){
                item.fileError = "Each file size must be less than or equal to " + $scope.allowedFileSizeGlobal.text;
                return ;
            }else{
                item.fileError = null;
            }
            item.isUploaded = true;
            item.proof = file;
        };
        $scope.removeUpload = function(item){
            item.isUploaded = false;
            item.answer = null;
        };
        $scope.downloadAnswerAttachment = function(item) {
            var urlKey = 'downloadAnswerAttachment';
            if($scope.perquisite.tabSelected == 0 && utilityService.getValue($scope.perquisite.summary.action, 'formMode') == 'view') {
                urlKey = 'downloadAnswerAttachmentHistory';
            }
            var url = service.getUrl(urlKey)
                + "/" + item._id
                + "/" + utilityService.getInnerValue($scope.perquisite.summary.action, 'selectedBreakupItem','employee_id', '');

            $scope.viewDownloadFileUsingForm(url);
        };
        /******End: Form Attachment*********/

        $scope.initializeSummaryTab = function() {
            $scope.perquisite.summary = service.buildSummaryObject();
            if($scope.perquisite.perquisiteComponents.length) {
                $scope.perquisite.summary.selectedComponent = utilityService.getValue($scope.perquisite.perquisiteComponents, '0');
                getYearlyBreakupsList();
            } else {
                getAllPerquisiteComponents(function() {
                    $scope.perquisite.summary.selectedComponent = utilityService.getValue($scope.perquisite.perquisiteComponents, '0');
                    getYearlyBreakupsList();
                });
            }
        };

        /*************Summary Tab: End****************/

        /*************Monthly Tab: Start****************/
        var getMonthlyBreakupsList = function() {
            $scope.perquisite.monthlyDetails.breakups.visible = false;
            var comp = utilityService.getValue($scope.perquisite.monthlyDetails.selectedComponent, 'slug');
            var year = utilityService.getValue($scope.perquisite.monthlyDetails.year, 'selected');
            var month = parseInt(utilityService.getValue($scope.perquisite.monthlyDetails.month, 'selected'));
            if(comp && year && !isNaN(month)) {
                var url = service.getUrl('perquisiteMonthly') + '/' + year + '/' + (month + 1) + '/' + comp;
                serverUtilityService.getWebService(url).then(function(data) {
                    $scope.perquisite.monthlyDetails.breakups.list = utilityService.getValue(data, 'data', []);
                    $scope.perquisite.monthlyDetails.breakups.visible = true;
                });
            } else {
                $scope.perquisite.monthlyDetails.breakups.list = [];
                $scope.perquisite.monthlyDetails.breakups.visible = true;
            }
        };

        $scope.downloadSampleTemplate = function() {
            var url = service.getUrl('monthlySampleTemplate') + '/' 
                + $scope.perquisite.monthlyDetails.year.selected + '/'
                + (parseInt($scope.perquisite.monthlyDetails.month.selected, 10) + 1) + '/'
                + utilityService.getInnerValue($scope.perquisite.monthlyDetails, 'selectedComponent', 'slug');
            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.onSelectFileUpload = function(model, keyName, file){
            model[keyName].file = file;
            model[keyName].isUploaded = true;
        };
        $scope.clearFileUpload = function(model, keyName) {
            model[keyName].isUploaded = false;
            model[keyName].file = null;
        };

        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        var getAlphaIndexing = function (resp) {
            $rootScope.errCount = 0;
            var data = [];
            angular.forEach(resp, function (val, key) {
                data.push(val);
                angular.forEach(val, function (v, k) {
                    if (v.error.length) {
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
            $scope.csv.visible = true;
        };

        var csvUploadStatusCallback = function(response) {
            getAlphaIndexing(response);

            if($rootScope.errCount === 0) {
                $scope.csv.parsedCsv = response;
            } else {
                var data = [];
                angular.forEach(response, function(val, key) {
                    var isError = false;
                    angular.forEach(val, function (v, k) {
                        if (angular.isDefined(v.error) && v.error.length) {
                            isError = true;
                        }
                    });
                    if(isError) {
                        data.push(val);
                    }
                });
                $scope.csv.parsedCsv = data;
            }
            $scope.openModal('preview-sheet-csv.tmpl.html', 'previewCsv', 'lg');
        };

        $scope.uploadFilledTemplate = function() {
            var url = service.getUrl('uploadMonthlyTemplate') + '/' 
                + $scope.perquisite.monthlyDetails.year.selected + '/'
                + (parseInt($scope.perquisite.monthlyDetails.month.selected, 10) + 1) + '/'
                + utilityService.getInnerValue($scope.perquisite.monthlyDetails, 'selectedComponent', 'slug');
            
            var payload = {
                upload_employee_perquisite: utilityService.getInnerValue($scope.perquisite.monthlyDetails, 'bulkUpload', 'file')
            };

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                $scope.errorMessages = [];
                if(utilityService.getValue(data, 'status') == "success") {
                    $scope.clearFileUpload($scope.perquisite.monthlyDetails, 'bulkUpload');
                    utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Sheet has been uploaded successfully'));
                    getMonthlyBreakupsList();
                } else if (utilityService.getInnerValue(data, 'data', 'status') == 'error') {
                    var msg = utilityService.getInnerValue(data, 'data', 'message');
                    var errTable = utilityService.getInnerValue(data, 'data', 'data');
                    if(msg) {
                        utilityService.resetAPIError(true, "something went wrong", 'bulkFilledTemplate');
                        if (angular.isArray(msg) || angular.isObject(msg)) {
                            angular.forEach(msg, function (value, key) {
                                angular.forEach(value, function (v, k) {
                                    $scope.errorMessages.push(v);
                                });
                            });
                        } else {
                            $scope.errorMessages.push(msg);
                        }
                        $scope.openModal('perquisite-monthly-bulk-upload-error-log.tmpl.html', 'perquisiteMonthlyBulkUploadErrorLog', 'md');
                    } else if(errTable) {
                        console.log(errTable);
                        csvUploadStatusCallback(errTable);
                    }
                }
            });
        };

        $scope.changeMonth = function(index) {
            $scope.perquisite.monthlyDetails.month.selected = index;
            $scope.perquisite.monthlyDetails.bulkUpload = null;
            getMonthlyBreakupsList();
        };

        $scope.viewFormDetails = function(item) {
            var actObj = service.buildActionInSummaryObject();
            actObj.formMode = 'view';
            actObj.selectedBreakupItem = {
                employee_id: item.employee_id,
                perquisite_form: item.form_id,
                _id: item.emp_perquisite_id
            };
            $scope.perquisite.summary.action = actObj;
            $scope.openModalToActivate();
        };

        $scope.initializeMonthlyTab = function() {
            $scope.perquisite.monthlyDetails = service.buildMonthlyDetailsObject();
            if($scope.perquisite.perquisiteComponents.length) {
                $scope.perquisite.monthlyDetails.selectedComponent = utilityService.getValue($scope.perquisite.perquisiteComponents, '0');
                getMonthlyBreakupsList();
            } else {
                getAllPerquisiteComponents(function() {
                    $scope.perquisite.monthlyDetails.selectedComponent = utilityService.getValue($scope.perquisite.perquisiteComponents, '0');
                    getMonthlyBreakupsList();
                });
            }
        };

        $scope.downloadPerquisiteReport = function(type) {
            var filename = 'perquisite_' + type + '_report.csv',
                url = service.getUrl('perquisiteMonthlyBankReport'),
                param = {
                    year: utilityService.getValue($scope.perquisite.monthlyDetails.year, 'selected'),
                    month: (parseInt(utilityService.getValue($scope.perquisite.monthlyDetails.month, 'selected')) + 1)
                };
            serverUtilityService.getWebService(url, param)
                .then(function (data) {
                var table = service.buildPerquisiteCarHireReport(utilityService.getValue(data, 'data', []), type);
                utilityService.exportToCsv(table, filename);
            });
        };
        /*************Monthly Tab: End****************/
        
        $scope.changeYear = function() {
            if($scope.perquisite.tabSelected == 0) {
                getYearlyBreakupsList();
            }
            if($scope.perquisite.tabSelected == 1) {
                $scope.perquisite.monthlyDetails.bulkUpload = null;
                getMonthlyBreakupsList();
            }
        };
        
        $scope.changeComponent = function() {
            if($scope.perquisite.tabSelected == 0) {
                getYearlyBreakupsList();
            }
            if($scope.perquisite.tabSelected == 1) {
                $scope.perquisite.monthlyDetails.bulkUpload = null;
                getMonthlyBreakupsList();
            }
        };

        /***** Start Angular Modal Section *****/
        $scope.openModal = function(templateUrl, instance, size) {
            if(utilityService.getValue($scope.openedModal, instance)) {
                return false;
            }
            $scope.openedModal[instance] = true;
            size = size || 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass : 'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
            $scope.openedModal[instance] = false;
        };
        /***** End Angular Modal Section *****/

        /**** Start Pagination Section ****/
        $scope.updatePaginationSettings('admin_perquisite_components_summary');
        $scope.updatePaginationSettings('admin_perquisite_components_monthly_breakups');
        /**** End Pagination Section ****/
    }
]);
