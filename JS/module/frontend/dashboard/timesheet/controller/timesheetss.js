app.controller('AdminTimesheetssController', [
    '$scope', '$modal', '$timeout', '$window', 'TimeOffService', 'utilityService', 'ServerUtilityService', 'AdminTimesheetssService',
    function ($scope, $modal, $timeout, $window, timeOffService, utilityService, serverUtilityService, AdminTimesheetssService) {
        var self = this;

        self.querySearch = querySearch;
        self.selectedItemChangeItems = selectedItemChangeItems;
        self.searchTextChange = searchTextChange;
        self.repos = [];

        AdminTimesheetssService.isApprover = $scope.section.dashboard.timesheet.approver ? true : false;
        $scope.timesheet = AdminTimesheetssService.buildTimesheetApproverObject();
        $scope.timesheetDetail = null;

        $scope.bulkRegularization = AdminTimesheetssService.buildBulkRegularizationObject();
        $scope.employeTimesheet = AdminTimesheetssService.buildApproverObjectTimesheet();
        $scope.timesheetObject = {
            isCustom: false,
            from_date: null,
            to_date: null,
            today: new Date(),
            toMaxDate: new Date(),
        }
        
        var getAssignedLeaveTypeList = function() {
            var url = timeOffService.getUrl('summary') + "/" + $scope.bulkRegularization.emp_id;
            
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.timeoff.leaveTypeList = timeOffService.buildSummaryList(utilityService.getValue(data, 'data', []));
            });
        };
        var autoCompleteSelectHandler = function () {
            getAssignedLeaveTypeList();
            getLeaveRequestList();
            //$scope.updatePaginationSettings('request');
        };
        
        /***** Start: Auto Complete Section *****/
        var buildEmployeeAutoCompleteData = function (list) {
            $scope.bulkRegularization.employeeList = [];

            angular.forEach(list, function(value, key) {
                if(utilityService.getValue(value, 'full_name')
                    && utilityService.getValue(value, 'personal_profile_employee_code')) {
                    $scope.bulkRegularization.employeeList.push(value);
                }
            });

            self.repos = loadAll($scope.bulkRegularization.employeeList);
        };
        var getEmployeeList = function() {
            var url = AdminTimesheetssService.getUrl('employee')
            + "/" + $scope.bulkRegularization.permission
             serverUtilityService.getWebService(url)
             .then(function(data) {
                buildEmployeeAutoCompleteData(data.data)
            });
        };
        getEmployeeList();
        function querySearch(query) {
            return query ? self.repos.filter(createFilterFor(query)) : self.repos;
        }        
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function selectedItemChangeItems(item, model, key) {
            // if (angular.isDefined(model[key]) && angular.isDefined(item) && item) {
            //     var id =  angular.isObject(item._id) ? item._id.$id : item._id;
            //     model[key] = id;
            //     console.log(item)
            //     autoCompleteSelectHandler();
            // } 
            getLeaveRequestList();
        }
        function loadAll(list) {
            return list.map(function (c, index) {
                var object = {
                    _id: c._id,
                    name: c.full_name,
                    image: c.profile_pic,
                    empcode: utilityService.getValue(c, 'personal_profile_employee_code')
                };

                object._lowername = utilityService.getValue(object, 'name') ? object.name.toLowerCase() : null;
                
                if (utilityService.getValue($scope.autoCompleteVia, 'selected') === 'empcode') {
                    object.value = utilityService.getValue(object, 'empcode') ? object.empcode.toLowerCase() : null;
                } else {
                    object.value = object._lowername;
                }
                
                object.image = utilityService.getValue(object, 'image', 'images/no-avatar.png');

                return object;
            });
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }
        /****** End Auto Complete Section ******/

        $scope.changeAutoCompleteVia = function () {
            self.repos = loadAll($scope.bulkRegularization.employeeList);
        };

        /***** Start Leave Details Section *****/
        $scope.timeoff = timeOffService.buildTimeOffObject();
        $scope.sortBy = function(propertyName) {
            $scope.timeoff.reverse = ($scope.timeoff.propertyName === propertyName) ? !$scope.timeoff.reverse : false;
            $scope.timeoff.propertyName = propertyName;
        };
        var resetSelectedLeaveType = function(model) {
            model.selectedLeaveType= [];
        };
        var resetFromToDate = function(model) {
            model.fromDate = null;
            model.toDate = null;
        };
        $scope.leaveTypeFilter = function(leave) {
            if ($scope.timeoff.requests.selectedLeaveType.length > 0 && leave.leave_type_id) {
                if ($.inArray(leave.leave_type_id, $scope.timeoff.requests.selectedLeaveType) < 0)
                    return;
            }
            return leave;
        };
        var resetRequestFilter = function() {
            resetSelectedLeaveType($scope.timeoff.requests);
            timeOffService.buildDefaultRequestDuration();
            resetFromToDate($scope.timeoff.requests);
        };
        resetRequestFilter();
        var getLeaveRequestList = function() {
            $scope.timeoff.requests.list = [];
            $scope.timeoff.requests.visible = false;
            console.log($scope.autoCompleteVia)
            var url = AdminTimesheetssService.getUrl('employeeTimesheets'),
            params = {
                emp_id: utilityService.getValue(self.selectedItem, '_id'),
                year: utilityService.getInnerValue($scope.employeTimesheet, 'year', 'selected'),
                month: utilityService.getInnerValue($scope.employeTimesheet, 'month', 'selected'),
            };

            serverUtilityService.getWebService(url, params)
                .then(function(data) {
                    $scope.timeoff.requests.list = timeOffService.buildRequestList(data.data);
                    $timeout(function() {
                        $scope.timeoff.requests.visible = true;
                    }, 100);
                });
        };   
        
        var getLeaveRequestListDate = function() {
            $scope.timeoff.requests.list = [];
            $scope.timeoff.requests.visible = false;
            var url = AdminTimesheetssService.getUrl('employeeTimesheets'),
            params = {
                emp_id: utilityService.getValue(self.selectedItem, '_id'),
                from_date: moment(utilityService.getInnerValue($scope.timesheet, 'from_date', 'selected')).format("DD-MM-YYYY"),
                to_date: moment(utilityService.getInnerValue($scope.timesheet, 'to_date', 'selected')).format("DD-MM-YYYY"),
            };

            serverUtilityService.getWebService(url, params)
                .then(function(data) {
                    $scope.timeoff.requests.list = timeOffService.buildRequestList(data.data);
                    $timeout(function() {
                        $scope.timeoff.requests.visible = true;
                    }, 100);
                });
        };     
        $scope.isDurationCustom = function() {
            return $scope.timeoff.requests.duration.slug == 'custom';
        };
        $scope.changeDateRange = function(model) {
            var dateRange = timeOffService.getDateRange(model.duration.slug);
            model.fromDate = dateRange.from;
            model.toDate = dateRange.to;
        };
        $scope.resetRequestDate = function() {
            resetFromToDate($scope.timeoff.requests);
            $scope.timeoff.requests.duration = timeOffService.buildDefaultRequestDuration();
            getLeaveRequestList();
        };
        $scope.viewDocument = function (file,type){
            var mainUrl = "https://docs.google.com/viewerng/viewer?url=" + file.doc_path;
            $window.open(mainUrl);
        };
        $scope.viewDownloadFile = function(file, type) {
            $window.open(file.doc_path, '_blank');
        };
        var isPastDate = function(item) {
            var cDate = new Date(),
                ctmstmp = cDate.getTime(),
                applyDate = new Date(item.from_date * 1000),
                dstmp = applyDate.getTime();

            return dstmp < ctmstmp && item.status != 1;
        };
        $scope.hideCancelRequestedLeave = function(item) {
            return isPastDate(item) || item.deduction_type == "2" || item.deduction_type == "3" || item.status == '2';
        };
        $scope.viewComment = function (text) {
            $scope.timeoff.requests.comment.text = text;
            $scope.openModal('comment', 'view-comment.tmpl.html');
        };
        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };       
        $scope.exportToCsv = function() {
            var username = utilityService.getValue(self.selectedItem, 'name'),
                filePrefix = 'employee-leave-requests',
                filename = (username ? filePrefix + '(' + username + ')' : filePrefix) + '.csv',
                csvData = timeOffService.buildCSVData($scope.timeoff.requests);

            $timeout(function () {
                utilityService.exportToCsv(csvData.content, filename);
            }, 1000);            
        };
        
        $scope.changeYearHandlerTimesheet = function () {
            getLeaveRequestList();
        };
        $scope.changeMonthHandlerTimesheet = function () {
            getLeaveRequestList();
        };
        $scope.changeSearchType = function () {
            getLeaveRequestList();
        };
        $scope.getRequestMonthWiseTimesheet = function () {
            getLeaveRequestListDate();
        };
        /***** End Leave Details Section *****/

        /********* Start Angular Modal Section *********/
        $scope.openModal = function(instance, template, size) {
            size = size || 'sm';

            $scope.modalInstance[instance] = $modal.open({
                templateUrl : template,
                scope : $scope,
                windowClass : 'zindex',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };

        var getCurrencyList = function() {
            serverUtilityService.getWebService(AdminTimesheetssService.getUrl('currency'))
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

            serverUtilityService.getWebService(AdminTimesheetssService.getUrl(urlKey))
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

            var url = AdminTimesheetssService.getUrl(urlKey) + '/' + $scope.timesheet.client.selected;
            
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.timesheet.job.list = data.data;
                    if(cb) { cb(); }
                });
        };
        var getApproverCallback = function(data) {
            timeOffService.buildRequestList(utilityService.getInnerValue(data, 'data', 'timesheets', []));
            AdminTimesheetssService.rebuildArroverList(utilityService.getInnerValue(data, 'data', 'timesheets', []));
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
            var url = AdminTimesheetssService.getUrl(urlKey);
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
            var url = AdminTimesheetssService.getUrl(urlKey);
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
                url = AdminTimesheetssService.getUrl(urlKey) + '/' + start_date + '/' + end_date;
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
                $scope.timesheet.approver.action_ids = AdminTimesheetssService.extractActionIds($scope.timesheet.approver.filteredList);
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

            var url = AdminTimesheetssService.getUrl(urlKey),
                payload = AdminTimesheetssService.buildApproverActionPayload($scope.timesheet.approver);

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
            var content = AdminTimesheetssService.buildStaffSummaryCSVContent($scope.timesheet.staff),
                filename = "timesheet-staff-summary.csv";

            utilityService.exportToCsv(content, filename);
        };
        $scope.exportApproverSummary = function () {
            var content = AdminTimesheetssService.buildApproverSummaryCSVContent($scope.timesheet.approver),
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
            var url = AdminTimesheetssService.getUrl('remainder'),
                payload = AdminTimesheetssService.buildRemainderPayload(item, $scope.user.loginEmpId);
        
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
            serverUtilityService.getWebService(AdminTimesheetssService.getUrl('isApprover'))
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
        $scope.closeSubMenu = function(event){
            $mdMenu.hide();
        };
    }
]);
