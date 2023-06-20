app.controller('TimesheetAppoverController', [
    '$scope', '$location', '$modal', '$routeParams', 'utilityService', 'ServerUtilityService', 'TimesheetApproverService', 'TimeOffService',
    function ($scope, $location, $modal, $routeParams, utilityService, serverUtilityService, service, timeOffService) {
        'use strict';
        
        service.isApprover = $scope.section.dashboard.timesheet.approver ? true : false;
        $scope.timesheet = service.buildTimesheetApproverObject();
        $scope.timesheetDetail = null;
        $scope.timesheetObject = {
            isCustom: false,
            from_date: null,
            to_date: null,
            today: new Date(),
            toMaxDate: new Date(),
        }

        var getCurrencyList = function() {
            serverUtilityService.getWebService(service.getUrl('currency'))
                .then(function(data) {
                    utilityService.setCurrencyList(data);
                    $scope.timesheet.currencyList = data;
                });
        };
        $scope.timesheet.currencyList = utilityService.getCurrencyList() 
            ?  utilityService.getCurrencyList() : getCurrencyList();

        var getClientList = function(cb) {
            var urlKey = null;

            if ($scope.section.dashboard.timesheet.approver) {
                urlKey = 'clients';
            } else if ($scope.section.frontend.timesheet.home) {
                urlKey = 'clientsAdmin';
            } else if ($scope.section.frontend.timesheet.manager) {
                urlKey = 'clientsProjectManager';
            } else if ($scope.section.frontend.timesheet.follower) {
                urlKey = 'clientsFollowers';
            }

            serverUtilityService.getWebService(service.getUrl(urlKey))
                .then(function (data) {
                    $scope.timesheet.client.list = data.data;
                    if(cb) { cb(); }
                });
        };
        var getJobListByClient = function(cb) {
            var urlKey = null;

            if ($scope.section.dashboard.timesheet.approver) {
                urlKey = 'jobs';
            } else if ($scope.section.frontend.timesheet.home) {
                urlKey = 'jobsAdmin';
            } else if ($scope.section.frontend.timesheet.manager) {
                urlKey = 'jobsProjectManager';
            } else if ($scope.section.frontend.timesheet.follower) {
                urlKey = 'jobsFollowers';
            }

            var url = service.getUrl(urlKey) + '/' + $scope.timesheet.client.selected;
            
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.timesheet.job.list = data.data;
                    if(cb) { cb(); }
                });
        };
        var getApproverCallback = function(data) {
            timeOffService.buildRequestList(utilityService.getInnerValue(data, 'data', 'timesheets', []));
            service.rebuildArroverList(utilityService.getInnerValue(data, 'data', 'timesheets', []));
            $scope.timesheet.approver.list = data.data;
            $scope.timesheet.approver.duration_type = utilityService.getInnerValue(data, 'data', 'duration_type', 1);
            $scope.timesheet.approver.visible = true;
        };
        var getApproverTimesheetList = function () {
            var urlKey = null;

            if ($scope.section.dashboard.timesheet.approver) {
                urlKey = 'approver';
            } else if ($scope.section.frontend.timesheet.home) {
                urlKey = 'approverAdmin';
            } else if ($scope.section.frontend.timesheet.manager) {
                urlKey = 'approverProjectManager';
            } else if ($scope.section.frontend.timesheet.follower) {
                urlKey = 'approverFollowers';
            }
            var filter_status_type = ['AL', 'P', 'A', 'R'];
            var filter_status = utilityService.getInnerValue($scope.timesheet, 'approver', 'filter');
            var url = service.getUrl(urlKey);
            var params = {
                client: utilityService.getInnerValue($scope.timesheet, 'client', 'selected'),
                job: utilityService.getInnerValue($scope.timesheet, 'job', 'selected'),
                status: filter_status_type[utilityService.getValue(filter_status, 'type')],
                year: utilityService.getInnerValue($scope.timesheet, 'year', 'selected'),
                month: utilityService.getInnerValue($scope.timesheet, 'month', 'selected'),
            };
            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    getApproverCallback(data);
                });
        };
        var getApproverTimesheetListDate = function () {
            var urlKey = null;

            if ($scope.section.dashboard.timesheet.approver) {
                urlKey = 'approver';
            } else if ($scope.section.frontend.timesheet.home) {
                urlKey = 'approverAdmin';
            } else if ($scope.section.frontend.timesheet.manager) {
                urlKey = 'approverProjectManager';
            } else if ($scope.section.frontend.timesheet.follower) {
                urlKey = 'approverFollowers';
            }
            var filter_status_type = ['AL', 'P', 'A', 'R'];
            var filter_status = utilityService.getInnerValue($scope.timesheet, 'approver', 'filter');
            var url = service.getUrl(urlKey);
            var params = {
                client: utilityService.getInnerValue($scope.timesheet, 'client', 'selected'),
                job: utilityService.getInnerValue($scope.timesheet, 'job', 'selected'),
                status: filter_status_type[utilityService.getValue(filter_status, 'type')],
                from_date: moment(utilityService.getInnerValue($scope.timesheet, 'from_date', 'selected')).format("DD-MM-YYYY"),
                to_date: moment(utilityService.getInnerValue($scope.timesheet, 'to_date', 'selected')).format("DD-MM-YYYY"),
            };
            //moment(params.from_date).format("dd-mm-yyyy");
            console.log(moment(utilityService.getInnerValue($scope.timesheet, 'to_date', 'selected')).format("DD-MM-YYYY"))
            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    getApproverCallback(data);
                });
        };
        
        $scope.preventDateClose = function() {
            $('md-datepicker .md-datepicker-input-container .md-datepicker-triangle-button ,md-datepicker .md-datepicker-button .md-datepicker-calendar-icon, md-datepicker .md-datepicker-button').attr("md-prevent-menu-close", "md-prevent-menu-close");
        }
        var getStaffSummaryCallback = function (data) {
            $scope.timesheet.staff.list = data.data;
            $scope.timesheet.staff.visible = true;
        };
        var getStaffSummaryList = function () {
            var urlKey = null;

            if ($scope.section.dashboard.timesheet.approver) {
                urlKey = 'staffSummary';
            } else if ($scope.section.frontend.timesheet.home) {
                urlKey = 'staffSummaryAdmin';
            } else if ($scope.section.frontend.timesheet.manager) {
                urlKey = 'staffSummaryProjectManager';
            } else if ($scope.section.frontend.timesheet.follower) {
                urlKey = 'staffSummaryFollowers';
            }

            var start_date = utilityService.dateToString(utilityService.getInnerValue($scope.timesheet, 'staff', 'startDate'), '-'),
                end_date = utilityService.dateToString(utilityService.getInnerValue($scope.timesheet, 'staff', 'endDate'), '-'),
                url = service.getUrl(urlKey) + '/' + start_date + '/' + end_date;
            var params = {
                client: utilityService.getInnerValue($scope.timesheet, 'client', 'selected'),
                job: utilityService.getInnerValue($scope.timesheet, 'job', 'selected')
            };
            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    getStaffSummaryCallback(data);
                });
        };
        var resetEmployeeSummaryList = function() {
            $scope.timesheet.staff.list.summary = [];
            $scope.timesheet.staff.filteredList = [];
        };
        $scope.approveRejectTimesheet = function (action, form, source, item) {
            item = item || null;
            $scope.timesheet.approver.comment = null;
            $scope.timesheet.approver.action = action;
            $scope.timesheet.approver.source = source;

            if (item) {
                $scope.timesheet.approver.action_id = item ? item.action_detail._id.$id : null;
            } else {
                $scope.timesheet.approver.action_ids = service.extractActionIds($scope.timesheet.approver.filteredList);
            }

            utilityService.resetForm(form);
            $scope.openModal('approver-comment.tmpl.html', 'comment');
        };
        var approverActionCallback = function (data) {
            $scope.closeModal('comment');
            if(utilityService.getValue(data, 'status') === 'success') {
                utilityService.showSimpleToast(data.message);
                getApproverTimesheetList(); //need to replace this by updating only udated elements in list
            } else {
                $scope.errorMessage.push(data.message);
                console.log('Need to handle error message here');
            }
        };
        $scope.takeApproverAction = function () {
            var urlKey = null;

            if ($scope.section.dashboard.timesheet.approver) {
                urlKey = 'approverAction';
            } else if ($scope.section.frontend.timesheet.home) {
                urlKey = 'approverActionAdmin';
            } else if ($scope.section.frontend.timesheet.manager) {
                urlKey = 'approverActionProjectManager';
            } else if ($scope.section.frontend.timesheet.follower) {
                urlKey = 'approverActionFollowers';
            }

            var url = service.getUrl(urlKey),
                payload = service.buildApproverActionPayload($scope.timesheet.approver);

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    approverActionCallback(data);                        
                });
        };
        $scope.isAtleastOneActionChecked = function() {
            var isChecked = false;
            
            angular.forEach($scope.timesheet.approver.filteredList, function(value, key) {
                isChecked = isChecked || value.isChecked;
            });

            return isChecked;
        };
        $scope.isAnyPending = function() {
            for(var i = 0; i<$scope.timesheet.approver.filteredList.length; i++) {
                if($scope.timesheet.approver.filteredList[i].status === 1) {
                    return true;
                }
            }
            return false;
        };
        $scope.isAllPendingChecked = function() {
            var isChecked = true;
            for(var i = 0; i<$scope.timesheet.approver.filteredList.length; i++) {
                if($scope.timesheet.approver.filteredList[i].status === 1 && !$scope.timesheet.approver.filteredList[i].isChecked) {
                    return false;
                }
            }
            return isChecked;
        };
        $scope.toggleCheckAllPending = function() {
            var allChecked = $scope.isAllPendingChecked();
            angular.forEach($scope.timesheet.approver.filteredList, function(value, key) {
                if(value.status === 1) {
                    value.isChecked = allChecked ? false : true;
                }
            });
        };
        $scope.exportStaffSummary = function () {
            var content = service.buildStaffSummaryCSVContent($scope.timesheet.staff),
                filename = "timesheet-staff-summary.csv";

            utilityService.exportToCsv(content, filename);
        };
        $scope.exportApproverSummary = function () {
            var content = service.buildApproverSummaryCSVContent($scope.timesheet.approver),
                filename = "timesheet-approver-summary.csv";

            utilityService.exportToCsv(content, filename);
        };
        $scope.onSelectOption = function() {
            var selected = $scope.timesheet.approver.filter.selectedOption;
            var val = [];
            angular.forEach($scope.timesheet.approver.list.timesheets, function(elem) {
                var el = selected==='emp_name' ? elem.action_detail[selected] : elem[selected];
                if(val.indexOf(el) < 0) {
                    val.push(el);
                }
            });
            $scope.timesheet.approver.filter.values = val;
        };
        $scope.sortBy = function(field) {
            $scope.timesheet.approver.sort.reverse = ($scope.timesheet.approver.sort.field === field) ? !$scope.timesheet.approver.sort.reverse : false;
            $scope.timesheet.approver.sort.field = field;
        };
        $scope.changeClientHandler = function(tabSection) {
            $scope.timesheet.job.selected = null;
            if($scope.timesheet.client.selected) {
                getJobListByClient(function() {
                    $scope.timesheet.job.selected = utilityService.getInnerValue($scope.timesheet.job.list, '0', 'job_slug');
                    $scope.timesheet.approver.filter.type = $scope.timesheet.approver.filter.type ? $scope.timesheet.approver.filter.type : 1;
                    if(tabSection === 'staff') {
                        getStaffSummaryList();
                    } else {
                        getApproverTimesheetList();
                    }
                });
            } else {
                $scope.timesheet.job.list = [];
            }         
        };
        $scope.changeJobStatusHandler = function(status, tabSection) {
            console.log(status)
            $scope.timesheet.approver.filter.type = status ? status : 0;
            if(tabSection === 'staff') {
                getStaffSummaryList();
            } else {
                getApproverTimesheetList();
            }
        };

        $scope.setMaxDate = function () {
            //$scope.timesheetObject = ($scope.from_date.getFullYear() + '-' + ('0' + ($scope.from_date.getMonth() + 1)) + '-' + ('0' + $scope.from_date.getDate())+45);
            $scope.from_date.getFullYear(),
            $scope.from_date.getMonth(),
            $scope.from_date.getDate() + 45
        }
        
        /**** Start: View Details Section ****/
        $scope.viewMoreDetails = function(item, heads, currency, duration_type) {
            $scope.timesheetDetail = null;
            item['heads'] = heads;
            item['currency_code'] = currency || 'INR';
            item['duration_type'] = duration_type;
            $scope.timesheetDetail = item;
            $scope.openModal('timesheet-view-details.tmpl.html', 'viewDetails', 'lg');
        };
        $scope.sendRemainder = function(item) {
            var url = service.getUrl('remainder'),
                payload = service.buildRemainderPayload(item, $scope.user.loginEmpId);
        
            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    utilityService.showSimpleToast(data.message);
                });
        };
        /**** End: View Details Section ****/

        /********* Start Angular Modal Section *********/
        $scope.openModal = function(templateUrl, instance, size) {
            size = size || 'sm';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass: 'fadeEffect',
                size: size,
                flex: '100%'
            });
        };
        $scope.closeModal = function (instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        /********* End Angular Modal Section *********/
        
        /***** Start: Check if current user is assigned as approver in any of the timesheet *****/
        var isApproverCallback = function(data) {
            $scope.timesheet.isApprover = utilityService.getValue(data, 'status') === 'success';
            $scope.timesheet.errorMessage = utilityService.getValue(data, 'message');
            if ($scope.timesheet.isApprover) {
                getApproverTimesheetList();
                getStaffSummaryList();
            }
        };
        var isTimesheetApprover = function () {
            serverUtilityService.getWebService(service.getUrl('isApprover'))
                .then(function (data) {
                    isApproverCallback(data);
                });
        };

        getClientList(function() {
            //timesheet.approver.filter.type, timesheet.job.selected, timesheet.client.selected
            $scope.timesheet.client.selected = utilityService.getInnerValue($scope.timesheet.client.list, '0', '_id');
            if($scope.timesheet.client.selected) {
                getJobListByClient(function() {
                    $scope.timesheet.job.selected = utilityService.getInnerValue($scope.timesheet.job.list, '0', 'job_slug');
                    $scope.timesheet.approver.filter.type = 1;
                    if ($scope.section.dashboard.timesheet.approver) {
                        isTimesheetApprover();
                    } else {
                        getApproverTimesheetList();
                        getStaffSummaryList();
                    }
                });
            }
        });
        /***** End: Check if current user is assigned as approver in any of the timesheet *****/

        $scope.noOfElements = function(obj) {
            if(obj) {
                return angular.isArray(obj) ? obj.length : Object.keys(obj).length;
            }
            return 0;
        };

        /**** Start Pagination Section ****/
        $scope.updatePaginationSettings('approver_all_timesheet');
        $scope.updatePaginationSettings('staff_summary_timesheet');        
        /**** End Pagination Section ****/

        $scope.changeYearHandler = function () {
            getApproverTimesheetList();
        };
        $scope.changeMonthHandler = function (month) {
            getApproverTimesheetList();
        };
        $scope.getRequestMonthWise = function () {
            getApproverTimesheetListDate();
        };
        $scope.closeSubMenu = function(event){
            $mdMenu.hide();
        };
    }
]);