app.controller('TimesheetController', [
    '$scope', '$location', 'utilityService', 'ServerUtilityService', 'TimesheetService', '$modal', '$mdDialog', '$routeParams', '$rootScope',
    function ($scope, $location, utilityService, serverUtilityService, service, $modal, $mdDialog, $routeParams, $rootScope) {
        'use strict';
        $scope.dateHashMapObject = null;
        $scope.timesheet = service.buildTimesheetObject();
        $scope.timesheet.job_slug = utilityService.getValue($routeParams, 'job');
        $scope.timesheet.client_slug = utilityService.getValue($routeParams, 'client');
        $scope.dateHashMapObject = {};
        $scope.timesheetDetail = null;
        $scope.csv = {};

         /***** Start: Fetch Currency List *****/
         var getCurrencyList = function() {
            serverUtilityService.getWebService(service.getUrl('currency'))
                .then(function(data) {
                    utilityService.setCurrencyList(data);
                    $scope.timesheet.currencyList = data;
                });
        };
        $scope.timesheet.currencyList = utilityService.getCurrencyList() 
            ?  utilityService.getCurrencyList() : getCurrencyList();
        /***** End: Fetch Currency List *****/

        var getClientsAndGroups = function () {
            serverUtilityService.getWebService(service.getUrl('clients'))
                .then(function (data) {
                    $scope.timesheet.clientsAndGroups = service.buildClientsAndGroupsObject(utilityService.getValue(data, 'data'), $scope.timesheet.client_slug);
                });
        };
        getClientsAndGroups();

        $scope.onClientSelect = function() {
            $scope.timesheet.clientsAndGroups = service.buildClientsAndGroupsObject($scope.timesheet.clientsAndGroups.clients, $scope.timesheet.client_slug);
            $scope.getOldTimesheets();
        };
        $scope.onSubmitTimesheetButtonClick = function() {
            $scope.accordionTab.timesheet.dashboard.selected = 1;
        };

        var trackerMinMaxDates = function(traverse) {
            var preNextMinMaxDate = function(tr, tempVal) {
                return tr === 'pre'
                        ? utilityService.dateToString(tempVal - 7*24*3600*1000, '-')
                        : utilityService.dateToString(tempVal + 7*24*3600*1000, '-');
            };
            if(traverse) {
                if(traverse !== 'current') {
                    var minTempValue = utilityService.getDefaultDate($scope.timesheet.tracker.minDate).getTime();
                    $scope.timesheet.tracker.minDate = preNextMinMaxDate(traverse, minTempValue);
    
                    var maxTempValue = utilityService.getDefaultDate($scope.timesheet.tracker.maxDate).getTime();
                    $scope.timesheet.tracker.maxDate = preNextMinMaxDate(traverse, maxTempValue);
                } else if(!$scope.timesheet.tracker.minDate || !$scope.timesheet.tracker.maxDate) {
                    var today = new Date().getDay();
                    today = today === 0 ? 7 : today;
                    $scope.timesheet.tracker.minDate = utilityService.dateToString((new Date().getTime()) - (today-1)*24*3600*1000, '-');
                    $scope.timesheet.tracker.maxDate = utilityService.dateToString((new Date().getTime()) + (7-today)*24*3600*1000, '-');
                }
            } else {
                var today = new Date().getDay();
                today = today === 0 ? 7 : today;
                $scope.timesheet.tracker.minDate = utilityService.dateToString((new Date().getTime()) - (today-1)*24*3600*1000, '-');
                $scope.timesheet.tracker.maxDate = utilityService.dateToString((new Date().getTime()) + (7-today)*24*3600*1000, '-');
            }
        };

        $scope.trackerDatePosition = function(projectStartDate, projectEndDate, itemDate) {
            projectStartDate = utilityService.getDefaultDate(projectStartDate).getTime();
            projectEndDate = utilityService.getDefaultDate(projectEndDate).getTime();
            itemDate = utilityService.getDefaultDate(itemDate).getTime();

            if(itemDate < projectStartDate) {
                return '1';
            }
            if(itemDate >= projectStartDate && itemDate <= projectEndDate) {
                return '2';
            }
            return '3';
        };

        $scope.isFuture = function(itemDate) {
            itemDate = utilityService.getDefaultDate(itemDate).getTime();
            var today = new Date().getTime();
            return itemDate>today ? true : false;
        };

        $scope.noOfElements = function(obj) {
            if(obj) {
                return angular.isArray(obj) ? obj.length : Object.keys(obj).length;
            }
            return 0;
        };

        $scope.getTimesheetTrackerData = function(traverse) {
            if($scope.isToggelEditSubmitModel) { return false; }
            $scope.isToggelEditSubmitModel = true;
            trackerMinMaxDates(traverse);
            serverUtilityService.getWebService(service.getUrl('tracker') + '/' + $scope.timesheet.tracker.minDate + '/' + $scope.timesheet.tracker.maxDate)
            .then(function(data) {
                $scope.isToggelEditSubmitModel = false;
                $scope.timesheet.tracker.clients = utilityService.getInnerValue(data, 'data', 'clients');
                $scope.timesheet.tracker.dates = utilityService.getInnerValue(data, 'data', 'dates');
                $scope.timesheet.tracker.overall = utilityService.getInnerValue(data, 'data', 'overall');
                $scope.timesheet.tracker.convertedDates = utilityService.getInnerValue(data, 'data', 'converted_dates');
                // console.log(data);
                // console.log($scope.timesheet.tracker);
            });
        };
        $scope.getTimesheetTrackerData();

        $scope.changeDateHandler = function(item) {
            $scope.dateHashMapObject[item.slug] = item.field_type === 6 ? service.formatTime(item.value) : item.value;
            // console.log(item);
            // console.log($scope.dateHashMapObject);
        };

        $scope.submitMultipleTimesheet = function(item) {
            $scope.changeDateHandler(item);
            $scope.timesheet.submitForMultipleDate = !$scope.timesheet.submitForMultipleDate;
        };

        $scope.submitTimeSheet = function (id, trackerItemDate) {
            if($scope.isToggelEditSubmitModel) { return false; }
            $scope.isToggelEditSubmitModel = true;
            serverUtilityService.getWebService(service.getUrl('timesheetJobData') + '/' + id)
                .then(function (data) {
                    $scope.isToggelEditSubmitModel = false;
                    $scope.timesheet.formFields = utilityService.getInnerValue(data, 'data', 'fields');
                    angular.forEach($scope.timesheet.formFields, function(field) {
                        $scope.timesheet.formFieldsObject[field.slug] = field.value;
                        if(field.slug === 'timesheet_start_date') {
                            $scope.dateHashMapObject[field.slug] = new Date();
                            field.min_value = utilityService.getDefaultDate($scope.timesheet.job.project_start_date);
                        }
                        if(field.slug === 'timesheet_end_date') {
                            $scope.dateHashMapObject[field.slug] = new Date();
                            field.max_value = new Date();
                            if(!$scope.isFuture($scope.timesheet.job.project_end_date)) {
                                $scope.dateHashMapObject[field.slug] = utilityService.getDefaultDate($scope.timesheet.job.project_end_date);
                                field.max_value = utilityService.getDefaultDate($scope.timesheet.job.project_end_date);
                            }
                        }
                        if(field.slug === 'timesheet_start_time') {
                            $scope.dateHashMapObject[field.slug] = "00:00";
                        }
                        if(field.slug === 'timesheet_end_time') {
                            $scope.dateHashMapObject[field.slug] = "24:00";
                        }
                        if(field._id === '1' && trackerItemDate) {
                            field.value = utilityService.getDefaultDate(trackerItemDate);
                        }
                    });
                    // $scope.timesheet.defaultFields = service.submitTimesheetModel();
                    $scope.openModal('timesheetEditor', 'editTimesheet', 'md');
                });
        };
        var successCallback = function (data, modelName) {
            $scope.timesheet.errorMessages = [];
            if(modelName) {
                $scope.closeModal(modelName);
            }
            $scope.closeModal('assignOfferLetter');
            $scope.closeModal('timesheetEditor');
            utilityService.showSimpleToast(data.message);
            $scope.getOldTimesheets();
            $scope.getTimesheetTrackerData('current');
        };
        var errorCallback = function (data, section) {
            $scope.timesheet.errorMessages = [];
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
                if(utilityService.getInnerValue(data, 'data', 'message')) {
                    angular.forEach(data.data.message, function (value, key) {
                        $scope.timesheet.errorMessages.push(value[0]);
                    });
                } else if(angular.isDefined(data.errors) && angular.isArray(data.errors) && data.errors.length) {
                    angular.forEach(data.errors, function(v, k) {
                        $scope.timesheet.errorMessages.push(v);
                    });
                } else if(angular.isDefined(data.errors) && angular.isObject(data.errors) && $scope.noOfElements(data.errors)) {
                    angular.forEach(data.errors, function (value, key) {
                        $scope.timesheet.errorMessages.push(value);
                    });
                } else if(angular.isDefined(data.message)) {
                    $scope.timesheet.errorMessages.push(data.message);
                }
            } else {
                utilityService.resetAPIError(true, "", section);
                if(utilityService.getInnerValue(data, 'data', 'status') === 'error') {
                    if(utilityService.getInnerValue(data, 'data', 'message')) {
                        if(angular.isObject(data.data.message)) {
                            angular.forEach(data.data.message, function (value, key) {
                                $scope.timesheet.errorMessages.push(value[0]);
                            });
                        } else {
                            $scope.timesheet.errorMessages.push(data.data.message);
                        }
                    }
                }
            }
        };
        var successErrorCallback = function (data, modelName) {
            data.status === "success" ? successCallback(data, modelName) : errorCallback(data, 'timesheet');
        };
        $scope.submitRequest = function () {
            if($scope.isToggelEditSubmitModel) { return false; }
            $scope.isToggelEditSubmitModel = true;
            var url = service.getUrl('timesheet') + '/' + $scope.settingId;
            var payload = service.buildDynamicPayloadForTimesheet($scope.timesheet.formFields, true, $scope.timesheet.submitForMultipleDate);
            if($scope.timesheet.editMode) {
                url += '/' + $scope.timesheet.timesheetId;
                serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    $scope.isToggelEditSubmitModel = false;
                    successErrorCallback(data);
                });
            } else {
                serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    $scope.isToggelEditSubmitModel = false;
                    successErrorCallback(data);
                });
            }
            
        };
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'sm';
            if($scope.timesheet.errorMessages.length) {
                $scope.timesheet.errorMessages = [];
            }
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                size: size,
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
            if($scope.timesheet.editMode) {
                $scope.timesheet.editMode = false;
            }
            if($scope.csvTimesheetFile) {
                $scope.csvTimesheetFile = null;
            }
        };
        $scope.openTimesheetEditor = function() {
            $scope.openModal('timesheetEditor', 'editTimesheet', 'md');
        };
        $scope.populateJobDates = function(item) {
            if(item && (item.project_start_date || item.job_start_date) && (item.project_end_date || item.job_end_date)) {
                $scope.timesheet.job = {
                    project_start_date: utilityService.getValue(item, 'project_start_date') ? utilityService.getValue(item, 'project_start_date') : utilityService.getValue(item, 'job_start_date'),
                    project_end_date: utilityService.getValue(item, 'project_end_date') ? utilityService.getValue(item, 'project_end_date') : utilityService.getValue(item, 'job_end_date')
                };
            }
        };
        $scope.getOldTimesheets = function() {
            if(!$scope.timesheet.weekStartDate || !$scope.timesheet.weekEndDate) {
                $scope.timesheet.weekEndDate = new Date();
                $scope.timesheet.weekStartDate = new Date(new Date().getTime() - (15*24*3600*1000));
            }
            if($scope.noOfElements($scope.timesheet.clientsAndGroups.clients) && (!$scope.timesheet.client_slug && !$scope.timesheet.job_slug)) {
                $scope.timesheet.client_slug = Object.keys($scope.timesheet.clientsAndGroups.clients)[0];
                $scope.onClientSelect();
                $scope.timesheet.job_slug = Object.keys($scope.timesheet.clientsAndGroups.clients[$scope.timesheet.client_slug]['job_group'])[0];
            }
            if ($scope.timesheet.client_slug && $scope.timesheet.job_slug && $scope.timesheet.weekStartDate && $scope.timesheet.weekEndDate) {
                var params = {
                    start_date : utilityService.dateToString($scope.timesheet.weekStartDate, '-'),
                    end_date: utilityService.dateToString($scope.timesheet.weekEndDate, '-')
                };
                var url = service.getUrl('timesheets') + '/' + $scope.timesheet.client_slug + '/' + $scope.timesheet.job_slug;
                serverUtilityService.getWebService(url, params)
                    .then(function (data) {
                        $scope.timesheet.allTimesheets = service.buildRequestList(utilityService.getValue(data, 'data'));
                        $scope.settingId = utilityService.getInnerValue(data, 'data', 'setting_id');
                        $scope.populateJobDates(utilityService.getValue(data, 'data'));
                    });
            } else {
                $scope.timesheet.allTimesheets = null;
            }
        };
        $scope.getOldTimesheets();

        $scope.editTimesheet = function(item) {
            if($scope.isToggelEditSubmitModel) { return false; }
            $scope.isToggelEditSubmitModel = true;
            $scope.populateJobDates(item);
            serverUtilityService.getWebService(service.getUrl('timesheetJobData') + '/' + item.setting_id + '/' + item.timesheet_id)
                .then(function(data) {
                    $scope.isToggelEditSubmitModel = false;
                    var stat = utilityService.getInnerValue(data, 'data', 'status');
                    if(stat===1) {
                        $scope.settingId = item.setting_id;
                        $scope.timesheet.timesheetId = item.timesheet_id;
                        $scope.timesheet.formFields = utilityService.getInnerValue(data, 'data', 'fields');
                        angular.forEach($scope.timesheet.formFields, function(field) {
                            if(field.field_type === 5) {
                                if(field.slug === 'timesheet_end_date') {
                                    $scope.dateHashMapObject[field.slug] = new Date();
                                    if(!$scope.isFuture($scope.timesheet.job.project_end_date)) {
                                        $scope.dateHashMapObject[field.slug] = utilityService.getDefaultDate($scope.timesheet.job.project_end_date);
                                    }
                                } else {
                                    field.value = utilityService.getDefaultDate(field.value);
                                    if(field.slug === 'timesheet_start_date') {
                                        field.min_value = utilityService.getDefaultDate($scope.timesheet.job.project_start_date);
                                    }
                                }
                            } else if(field.field_type === 6) {
                                $scope.dateHashMapObject[field.slug] = field.value;
                                field.value = field.value.length ? new Date("1970-01-01" + " " + field.value) : null;
                            } else if(field.field_type === 11) {
                                angular.forEach(field.element_details, function(subField) {
                                    subField.isChecked = field.value.includes(subField._id);
                                });
                            } else if(field.field_type === 12) {
                                field.value = field.value[0];
                            }
                        });
                        $scope.timesheet.submitForMultipleDate = false;
                        $scope.timesheet.editMode = true;
                        $scope.openModal('timesheetEditor', 'editTimesheet', 'md');
                    } else {
                        var alertMsg = (stat===9 || stat===11 || stat===13 || stat===14) ? 'Timesheet has Rejected' : 'Timesheet is already Approved';
                        $scope.showAlert(event, alertMsg, "Can't Edit Timesheet");
                    }
                });
        };

        $scope.deleteTimesheet = function(id) {
            serverUtilityService.deleteWebService(service.getUrl('deleteTimesheet') + '/' + id)
                .then(function (data) {
                    (utilityService.getValue(data, 'status') === 'success') 
                        ? successCallback(data)
                        : $scope.showAlert(event, utilityService.getValue(data, 'message'), "Can't Delete Timesheet");
                });
        };

        $scope.createTimesheetFromTracker = function(item, itemDate) {
            $scope.populateJobDates(item);
            // console.log(itemDate);
            if(!$scope.isFuture(itemDate)) {
                $scope.settingId = item.setting_id;
                $scope.submitTimeSheet(item.setting_id, itemDate);
            }
        };

        $scope.approveRequest = function (item, key) {
            utilityService.showSimpleToast('Action successfull');
            item.status = key;
        };
        $scope.navigateToApproverSection = function () {
            $location.url('/dashboard/timesheet/approver');
        };
        var isTimesheetApprover = function () {
            serverUtilityService.getWebService(service.getUrl('isApprover'))
                .then(function (data) {
                    $scope.timesheet.isApprover = utilityService.getValue(data, 'status') === 'success';
                });
        };
        isTimesheetApprover();

        /*********** Start: Timesheet CSV Upload ************/

        $scope.downloadCsvFormat = function() {
            var url = service.getUrl('downloadCsvForm') + '/' + $scope.settingId;
            $scope.viewDownloadFileUsingForm(url);
        };

        $scope.AttachCsv = function(file) {
            if(file) {
                $scope.csvTimesheetFile = file;
                $scope.timesheet.errorMessages = [];
            }
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
            $scope.closeModal('uploadCsv');
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
            $scope.openModal('previewCsv', 'preview-sheet-csv.tmpl.html', 'lg');
        };

        $scope.uploadTimesheetCsv = function(file) {
            var url = service.getUrl('uploadTimesheet') + '/' + $scope.settingId;
            var payload = {
                timesheet_csv: file
            };
            serverUtilityService.uploadWebService(url, payload)
            .then(function(data) {
                if(angular.isDefined(data.status)) {
                    if(data.status === "success") {
                        $scope.csvTimesheetFile = null;
                        successCallback(data, 'uploadCsv');
                    } else {
                        errorCallback(data.data);
                    }
                } else {
                    csvUploadStatusCallback(data);
                }
            });
        };

        /*********** End: Timesheet CSV Upload ************/

        /**** Start: View Details Section ****/
        $scope.viewMoreDetails = function(item, heads, currency, duration_type) {
            $scope.timesheetDetail = null;
            item['heads'] = heads;
            item['currency_code'] = currency || 'INR';
            item['duration_type'] = duration_type;
            $scope.timesheetDetail = item;
            $scope.openModal('viewDetails', 'timesheet-view-details.tmpl.html', 'lg');
        };
        /**** End: View Details Section ****/

        /********* Start: Angular Dialog     *********/
        $scope.showAlert = function(event, textContent, title) {
            title = title || 'ALERT!';
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            var alert = $mdDialog.alert()
                .clickOutsideToClose(true)
                .title(title)
                .textContent(textContent)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(event);

            $mdDialog.show(alert);
        }; 
        /********* End: Angular Dialog     *********/

        $scope.updatePaginationSettings('provision_manager_emp_view');
        // console.log('scope', $scope);
        // console.log('utilityService', utilityService);
        $scope.timeConvert24to12 = function (time) {
            var h, AM_PM = '';
            if(angular.isDate(time)) {
                var m = time.getMinutes();
                var s = time.getSeconds();
                h = time.getHours();
                if(h > 11 ) {
                    AM_PM = 'PM';
                    h = h === 12 ? h : h - 12;
                } else {
                    AM_PM = 'AM';
                    h = h === 0 ? 12 : h;
                }
                return  '' + (h>9?h:('0'+h)) + ':' + (m>9?m:('0'+m)) + ':' + (s>9?s:('0'+s)) + ' ' + AM_PM;
            }
            if(angular.isString(time) && /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(time)) {
                var tArr = time.split(':');
                h = parseInt(tArr[0], 10);
                if(h > 11 ) {
                    AM_PM = 'PM';
                    h = h === 12 ? h : h - 12;
                } else {
                    AM_PM = 'AM';
                    h = h === 0 ? 12 : h;
                }
                tArr[0] = '' + (h>9?h:('0'+h));
                return tArr.join(':') + ' ' + AM_PM;
            }
            return time ? time : null;
        };
    }
]);