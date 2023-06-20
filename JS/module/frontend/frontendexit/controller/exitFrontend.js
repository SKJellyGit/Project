app.controller('FrontendExitController', [
    '$scope', '$routeParams', '$q', '$location', '$timeout', '$modal', '$mdDialog', 'FrontendExitService', 'utilityService', 'ServerUtilityService', 'FORM_BUILDER', 'TimeOffService', 'ActionService', 
    function ($scope, $routeParams, $q, $location, $timeout, $modal, $mdDialog, FrontendExitService, utilityService, serverUtilityService, FORM_BUILDER, timeOffService, actionService) {
        console.log('exit admin controller loaded...');
        var isEdit = angular.isDefined($routeParams.isEdit) ? true : false,
            moveTab = null;

        $scope.resetAllTypeFilters();
        $scope.tabs = {
            "empInfo": true,
            "clear": false,
            "exit": false,
            "certificate": false
        };
        $scope.statusTabs = {
            "empInfo": true,
            "clear": false,
            "exit": false,
            "certificate": false
        };
        $scope.exitSettings = null;
        $scope.LeaveMinDate = new Date();
        $scope.waive = {
            maxWaiver: 0,
            maxBuyout: 0,
            servedNoticePeriod: 0
        };
        $scope.disableField = {
            admin_role: false,
            non_admin_role: false,
            adminRole: null,
            adminNonRole: null,
        };
        $scope.exitFrontend = {
            listVisible: false,
            draftListVisible: false,
            isWeekOff: false,
            selectedClearances: [],
            slectedCertificates: [],
            mainCertificateCollections: null,
            certficateOriginalLength: 0,
            isLwdChanged: false,
            permission: 'can_view_exit_initiated_users',
            pendingRequests: {
                list: [],
                visible: false,
                propertyName: '',
                reverse: false,
                filteredItems: [],
                approverChainDetail: [],
                statusMapping: {
                    null: "Not received yet",
                    1: "Pending",
                    3: "Approved",
                    8: "Approved",
                    9: "Rejected",
                    10: "Approved",
                    11: "Rejected",
                    12: "Approved",
                    13: "Rejected",
                    14: "Rejected"
                }
            }
        };
        $scope.verifiedStep = 1;
        $scope.weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $scope.statusTab = angular.isDefined($routeParams.tab) ? $routeParams.tab : null;
        $scope.empId = angular.isDefined($routeParams.id) ? $routeParams.id : null;
        $scope.isCertificate = angular.isDefined($routeParams.isCertificate) ? $routeParams.isCertificate : false;
        $scope.isCertificateTrue = false;
        $scope.payStatus = null;
        $scope.authorityType = function (type) {
            return FrontendExitService.buildAutoritiesType(type);
        };
        $scope.todaysDate = new Date();
        $scope.isTabVisible = false;
        $scope.requestApproveForm = {
            empForm: FrontendExitService.buildFormObject(),
            apprForm: FrontendExitService.buildFormObject(),
            viewMode: 'admin',
            last_working_date: null,
            last_working_date_source: null
        };
        var self = this,
            lastSearch;

        self.searchTextHandoverPoc = '';
        self.querySearchHandoverPoc = querySearchHandoverPoc;
        self.searchTextChangeHandoverPoc = searchTextChangeHandoverPoc;
        self.selectedItemChangeHandoverPoc = selectedItemChangeHandoverPoc;
        $scope.handoverPoc = {
            employee_id: '',
            date: new Date(),
            minDate: new Date()
        };

        /***** Start Bulk Assign Employee Section *****/
        self.searchTextBulkAssignPoc = '';
        self.querySearchBulkAssignPoc = querySearchBulkAssignPoc;
        self.searchTextChangeBulkAssignPoc = searchTextChangeBulkAssignPoc;
        self.selectedItemChangeBulkAssignPoc = selectedItemChangeBulkAssignPoc;
        $scope.bulkAssign = {
            assignedTeam: {
                relationship: {},
                selected: null,
                employee_id: ''                
            },
            otherAssignedAuthorities: {
                authorityType: {},
                selected: null,
                employee_id: ''
            },
            assetManager: {
                asset: {
                    'all': 'All Assets'
                },
                selected: 'all',
                employee_id: ''
            }            
        };
        /***** End Bulk Assign Employee Section *****/

        if ($scope.statusTab && $scope.empId) {
            angular.forEach($scope.statusTabs, function (val, key) {
                $scope.statusTabs[key] = false;
                $scope.tabs[key] = false;
            });
            $scope.statusTabs[$scope.statusTab] = true;
            $scope.tabs[$scope.statusTab] = true;
            moveTab = $scope.statusTab;
        }
        var getExitSettings = function () {
            serverUtilityService.getWebService(FrontendExitService.getUrl('exitSettings'))
                .then(function (data) {
                    $scope.exitSettings = data.data;
                });
        };
        getExitSettings();
        $scope.getLeaveRange = function () {
            var today = new Date();
            $scope.LeaveMinDate = today;
        };

        var exitViewDetailsCallback = function(data){
            $scope.exitStatus = data.data;
            getExitTypeName(data.data);
            if(utilityService.getInnerValue(data.data, 'pending_actions_handover_poc', '_id')){
                self.searchTextHandoverPoc = utilityService.getInnerValue(data.data, 'pending_actions_handover_poc', 'full_name');
                $scope.handoverPoc.employee_id = utilityService.getInnerValue(data.data, 'pending_actions_handover_poc', '_id');
            }
        };

        var getEXitViewDetails = function () {
            var url = FrontendExitService.getUrl('getExitDetail') + "/" + $scope.empId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    exitViewDetailsCallback(data);
                });
        };
        if ($scope.empId) {
            getEXitViewDetails();
        }
        $scope.setRoute = function (tab, index) {
            var id = angular.isObject(index._id) ? index._id.$id : index._id;
            $location.url('frontend/exit/status').search({'tab': tab, 'id': id});
        };
        $scope.setEditRoute = function (empId) {
            var id = angular.isDefined(empId) ? empId : $scope.empId;
            var tab = null;
            angular.forEach($scope.statusTabs, function (val, key) {
                if ($scope.statusTabs[key] == true) {
                    tab = key;
                }
            });
            $location.url('frontend/exit/initiate').search({'tab': tab, 'id': id, 'isEdit': true});
        };
        $scope.setTab = function (tab, flag, step) {
            flag = angular.isDefined(flag) ? flag : false;
            $scope.exitFrontend.slectedCertificates = [];
            if (tab == 'certificate' && $scope.verifiedStep == 2 && !$scope.exitSettings.is_exit_interview && !$scope.exitSettings.is_exit_survey) {
                moveTab = tab;
                flag = true;
            }
            if (angular.isDefined(step) && step <= $scope.verifiedStep + 1) {
                moveTab = tab;
                flag = true;
            }
            if (flag) {
                angular.forEach($scope.tabs, function (val, key) {
                    $scope.tabs[key] = false;
                });
                $scope.tabs[tab] = true;
            }
            if (flag && angular.isDefined(step)) {
                getExitDetails();
            }
            if(tab == 'exit') {
                getExitFeedbackForm($scope.empId);
                getExitFeedbackSurveyForm($scope.empId);
            }
        };
        $scope.setStatusTab = function (tab) {
            angular.forEach($scope.statusTabs, function (val, key) {
                $scope.statusTabs[key] = false;
            });
            $scope.statusTabs[tab] = true;
        };


        self.selectedItem = null;
        self.certificateSelectedItem = null;
        self.selectedFeedback = null;
        self.selectedTeam = null;
        self.selectedOtherAuthorities = null;
        self.simulateQuery = false;
        self.isDisabled = false;
        self.isDisabledEmployee = false;
        self.querySearch = querySearch;
        self.queryCertificateSearch = queryCertificateSearch;
        self.queryInterviewerSearch = queryInterviewerSearch;
        self.queryReportingManagerSearch = queryReportingManagerSearch;
        self.selectedItemChange = selectedItemChange;
        self.interviewSelectedItemChange = interviewSelectedItemChange;
        self.searchTextChange = searchTextChange;
        self.interviewSearchTextChange = interviewSearchTextChange;
        self.filterSelected = true;
        $scope.apiError = utilityService.buildAPIErrorObject();
        $scope.leave_plans = null;
        $scope.makeVisible = false;
        $scope.exitType = null;
        $scope.employeeList = null;
        $scope.employeeListByExit = null;
        $scope.exitName = null;
        $scope.feedBackSurveyForm = null;
        $scope.enterviewerFlag = false;
        $scope.feedBackForm = null;
        $scope.feedBackCertificate = null;
        $scope.probationDetails = null;
        $scope.exitAdmin = {
            filteredList: []
        };
        self.repos = [];

        /***** Start filters *****/
        $scope.exitInitiationDate = FrontendExitService.buildDateObject();
        $scope.lastWorkingDate = FrontendExitService.buildDateObject();
        $scope.initDate = {
            from: null,
            to: null
        };
        $scope.lastDate = {
            from: null,
            to: null
        };
        $scope.resetFilterCustomDate = function (key) {
            if (key = 'init') {
                $scope.initDate = {
                    from: null,
                    to: null
                };
            }
            if ('last') {
                $scope.lastDate = {
                    from: null,
                    to: null
                };
            }
        };
        $scope.filterExitInitStatus = [];
        $scope.initExitStatusFilter = function (employee) {
            if (employee.resignation_date && ($scope.filterExitInitStatus.length > 0)) {
                var resignation_date = utilityService.getDefaultDate(employee.resignation_date, false, true);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - resignation_date.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (Math.max.apply(Math, $scope.filterExitInitStatus) < diffDays)
                    return;
            }
            if ($scope.filterExitInitStatus.length > 0 && !employee.resignation_date && !employee.last_serving_date) {
                return;
            }
            return employee;
        };

        $scope.filterLastWorkStatus = [];
        $scope.lastWorkStatusFilter = function (employee) {
            if (employee.last_serving_date && ($scope.filterLastWorkStatus.length > 0)) {
                var last_serving_date = utilityService.getDefaultDate(employee.last_serving_date, false, true);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - last_serving_date.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (Math.max.apply(Math, $scope.filterLastWorkStatus) < diffDays)
                    return;
            }
            if ($scope.filterLastWorkStatus.length > 0 && !employee.resignation_date && !employee.last_serving_date) {
                return;
            }
            return employee;
        }
        $scope.reset = function () {
            $scope.resetAllTypeFilters();
            $scope.resetFilterCustomDate();
            $scope.filterExitInitStatus = [];
            $scope.filterLastWorkStatus = [];
        };
        /***** End filters *****/

        $scope.exitId = utilityService.getStorageValue('exitId');
        if (isEdit) {
            $scope.exitId = $scope.empId;
        }
        var getExitTypeName = function (data) {
            var exit_type = angular.isDefined(data) ? data.exit_type_id : null;
            if (exit_type) {
                angular.forEach($scope.exitType, function (val, key) {
                    if (val._id == exit_type) {
                        $scope.exitName = val.name;
                    }
                });
            }
        };
        var notNomalType = ['suntuity', 'suntuityusa'];
        var getExitType = function () {
            var url = FrontendExitService.getUrl('getExitType');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.exitType = [];
                angular.forEach(data.data, function (v, k) {
                    if ($scope.envMnt === 'acpl') {
                        if (angular.isDefined(v.parent_id)) {
                            v.tempName = v.name;
                            $scope.exitType.push(v);
                        }
                    } else {
                        if(notNomalType.indexOf( $scope.envMnt) > -1){
                            if (angular.isDefined(v.parent_id) && v.parent_id == 1) {
                                v.tempName = "Voluntary - " + v.name;
                                $scope.exitType.push(v);
                            }
                            if (angular.isDefined(v.parent_id) && v.parent_id == 2) {
                                v.tempName = "InVoluntary - " + v.name;
                                $scope.exitType.push(v);
                            }
                        }else {
                            if (v._id == 1 && !angular.isDefined(v.parent_id)) {
                                v.tempName = v.name;
                                $scope.exitType.push(v);
                            }
                            if (v._id != 1 && angular.isDefined(v.parent_id)) {
                                v.tempName = "InVoluntary - " + v.name;
                                $scope.exitType.push(v);
                            }
                        }
                    }
                });
            });
        };
        getExitType();
        $scope.initiateExit = function () {
            if ($scope.exitId) {
                utilityService.removeStorageValue('exitId');
            }
            $location.url('frontend/exit/initiate');
        };
        var setAutoComplete = function (item) {
            self.selectedItem = {
                _id: angular.isObject(item._id) ? item._id.$id : item._id,
                full_name: utilityService.getValue(item, 'full_name'),
                email: utilityService.getValue(item, 'email')
            };
            self.isDisabledEmployee = true;
        };
        var checkIfAccessRevoked = function (data) {
            if (angular.isDefined(data) && angular.isDefined(data.revoke_detail) && data.revoke_detail) {
                angular.forEach(data.revoke_detail, function (val, key) {
                    val.revoke_date = utilityService.getDefaultDate(val.revoke_date, false, true);
                    if (val.type == 1 && val.status == 5) {
                        $scope.disableField.admin_role = true;
                        $scope.disableField.adminRole = val;
                    }
                    if (val.type == 2 && val.status == 5) {
                        $scope.disableField.non_admin_role = true;
                        $scope.disableField.adminNonRole = val;
                    }
                });
            }
        };
        var createListForClearanceTab = function (data) {
            checkIfAccessRevoked(data.data);
            buildProvisions(data.data);
            bulidTeamList(data.data);
            getForOtherAuthorities(data.data);
            getProvisionListByManager(data.data);
            buildNoDuesList(data.data);
        };
        var exitDetailsCallback = function (data) {
            if (data.data) {
                syncExitModel(data.data);
                $scope.exit.employee_id = data.data.employee_id;
                $scope.exit.clearance_last_serving_date = data.data.last_serving_date;
                setAutoComplete($scope.exit.employee_preview);
                $scope.getNoticePeriodDetails(true, false);
                $scope.getLeaveRange();
                getExitTypeName(data.data);
                getEmployeeAccordingToExit();
                if (moveTab == 'clear') {
                    createListForClearanceTab(data);
                }
                if (moveTab == 'exit') {
                    self.interviewRepo = loadAllInterviewer();
                    getExitFeedBackDetail();
                }
                getExitCertificates();
                buildExitObject();
                $scope.verifiedStep = data.data.verified_step;
                $timeout(function () {
                    $scope.isTabVisible = true;
                }, 100);
            }
        };
        var syncExitModel = function (model) {
            $scope.exit = FrontendExitService.buildEmployeeInfo(model);
            if ($scope.exit.resignation_date == null) {
                $scope.exit.resignation_date = new Date();
            }
        };
        var getExitDetails = function () {
            if ($scope.exitId) {
                $scope.isTabVisible = false;
                var url = FrontendExitService.getUrl('getExitDetail') + "/" + $scope.exitId;
                serverUtilityService.getWebService(url)
                    .then(function (data) {
                        exitDetailsCallback(data);
                    });
            } else {
                syncExitModel();
                $scope.isTabVisible = true;
            }
        };
        getExitDetails();
        var getExitPayrollDetails = function (empId) {
            if (empId) {
                var url = FrontendExitService.getUrl('payrollError') + "/" + empId;
                serverUtilityService.getWebService(url)
                    .then(function (data) {
                        $scope.payStatus = data.data;
                    });
            }
        };
        var formatDate = function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;

            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('/');
        };
        $scope.formatDate = function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('/');
        };
        $scope.setLastWorkingDay = function (isPageLoad) {
            isPageLoad = angular.isDefined(isPageLoad) ? isPageLoad : false;
            $scope.makeCalculations(isPageLoad, true);
        };
        $scope.dayOffList = {};
        $scope.tempOffDates = [];
        var getEmployeeOffDays = function (monthYear, empId) {
            var start_date = new Date(
                    monthYear.getFullYear(),
                    monthYear.getMonth(),
                    monthYear.getDate() - 90
                );
            var end_date = new Date(
                    monthYear.getFullYear(),
                    monthYear.getMonth(),
                    monthYear.getDate() + 90
                );
            var start_time_stamp = start_date.getTime() / 1000;
            var end_time_stamp = end_date.getTime() / 1000;
            $scope.dayOffList.currentDate = monthYear;
            empId = angular.isDefined(empId) ? empId : $scope.exit.employee_id;
            var url = FrontendExitService.getUrl('getEmpOffDay') + "/" + empId + "/" + start_time_stamp + "/" + end_time_stamp;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.dayOffList.data = data.data;
                });
        };
        var checkLwdIsCorrect = function (flag) {
            flag = angular.isDefined(flag) ? flag : false;
            var leaveCount = 0;
            if (!flag) {
                for (var i = 0; i < 90; i++) {
                    var Ithdate = new Date(
                            $scope.dayOffList.currentDate.getFullYear(),
                            $scope.dayOffList.currentDate.getMonth(),
                            $scope.dayOffList.currentDate.getDate() - i
                        );
                    var IthdateTimeStamp = Ithdate.getTime() / 1000;
                    if ((angular.isDefined($scope.dayOffList.data)) && ((angular.isDefined($scope.dayOffList.data.holiday) && $scope.dayOffList.data.holiday.indexOf(IthdateTimeStamp) >= 0) || (angular.isDefined($scope.dayOffList.data.week_off) && $scope.dayOffList.data.week_off.indexOf(IthdateTimeStamp) >= 0))) {
                        leaveCount += 1;
                    } else {
                        break;
                    }
                }
            }
            return leaveCount;
        };
        $scope.checkForOff = function (lwd) {
            var date = new Date(lwd);
            var dateTimeStamp = date.getTime() / 1000;
            if ($scope.dayOffList.data.holiday.indexOf(dateTimeStamp) >= 0 || $scope.dayOffList.data.week_off.indexOf(dateTimeStamp) >= 0) {
                $scope.exitFrontend.isWeekOff = true;
            } else {
                $scope.exitFrontend.isWeekOff = false;
            }
        };       
        $scope.$watch('exit.last_serving_date', function (newLwd, oldLwd) {
            if (angular.isDefined(oldLwd) && newLwd != oldLwd && !$scope.exitFrontend.isLwdChanged && $routeParams.isEdit) {
                $scope.exitFrontend.isLwdChanged = true;
            }
        });
        $scope.makeCalculations = function (isPageLoad, isChanged) {
            if (!$scope.exit.is_notice_period_applicable && $scope.exit.resignation_date && !isPageLoad) {
                getEmployeeOffDays($scope.exit.resignation_date);
                $timeout(function () {
                    $scope.exit.last_serving_date = new Date(
                        $scope.exit.resignation_date.getFullYear(),
                        $scope.exit.resignation_date.getMonth(),
                        $scope.exit.resignation_date.getDate()
                    );
                    $scope.checkForOff($scope.exit.last_serving_date);
                }, 1000);
                return false;
            }
            var waive = $scope.exit.waiver_days && $scope.exit.is_waiver && $scope.exit.is_notice_period_applicable && isChanged ? parseFloat($scope.exit.waiver_days, 10) : 0,
                buyout = $scope.exit.buyout_days && $scope.exit.is_buyout && $scope.exit.is_notice_period_applicable && isChanged ? parseFloat($scope.exit.buyout_days, 10) : 0;
            var firstDate = new Date();
            if ($scope.probationDetails && angular.isDefined($scope.probationDetails) && angular.isDefined($scope.probationDetails.joining_date)) {
                var secondDate = utilityService.getDefaultDate($scope.probationDetails.joining_date);
                var diffDays = utilityService.getTwoDaysDiff(firstDate, secondDate);
            } else {
                return;
            }
            if ($scope.probationDetails.probation_period != null && parseInt($scope.probationDetails.probation_period) <= diffDays) {
                var probationPeriod = angular.isDefined($scope.probationDetails.notice_post_probation) && $scope.probationDetails.notice_post_probation != null ? $scope.probationDetails.notice_post_probation : 0;
            } else {
                probationPeriod = angular.isDefined($scope.probationDetails.notice_during_probation) && $scope.probationDetails.notice_during_probation != null ? $scope.probationDetails.notice_during_probation : 0;
            }
            $scope.waive.servedNoticePeriod = probationPeriod;
            if (!isPageLoad) {
                var lastWorkingDate = new Date(
                    $scope.exit.resignation_date.getFullYear(),
                    $scope.exit.resignation_date.getMonth(),
                    $scope.exit.resignation_date.getDate() + parseInt(probationPeriod) - Math.floor(waive + buyout)
                );
                getEmployeeOffDays(lastWorkingDate);
                $timeout(function () {
                    $scope.exit.last_serving_date = new Date(
                        lastWorkingDate.getFullYear(),
                        lastWorkingDate.getMonth(),
                        lastWorkingDate.getDate() - checkLwdIsCorrect()
                    );
                }, 1500);
            }

            if ($scope.exitSettings.is_notice_waiver) {
                $scope.waive.maxWaiver = $scope.exitSettings.max_notice_waiver_unit == 1 
                    ? (probationPeriod * $scope.exitSettings.max_notice_waiver) / 100 
                    : $scope.exitSettings.max_notice_waiver;
            }
            if ($scope.exitSettings.is_notice_buyout) {
                $scope.waive.maxBuyout = $scope.exitSettings.max_notice_buyout_unit == 1 
                    ? (probationPeriod * $scope.exitSettings.max_notice_buyout) / 100 
                    : $scope.exitSettings.max_notice_buyout;
            }
        };
        $scope.checkEmployeeid = function () {
            if (!$scope.exit.employee_id) {
                console.log('Please Select Employee Name');
            }
        };
        $scope.getNoticePeriodDetails = function (isPageLoad, isChanged) {
            isPageLoad = angular.isDefined(isPageLoad) ? isPageLoad : false;
            isChanged = angular.isDefined(isChanged) ? isChanged : false;
            var url = FrontendExitService.getUrl('getProbationDetails') + "/" + $scope.exit.employee_id;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.probationDetails = data.data;
                    $scope.makeCalculations(isPageLoad, isChanged);
                });
        };
        var successCallback = function (data, tabName, section, isAdded) {
            if (data.status === "success") {
                if (angular.isDefined(data.error) && data.error.length) {
                    angular.forEach(data.error, function (value, key) {
                        angular.forEach(value, function (val, ke) {
                            $scope.errorMessages.push("row" + (key + 1) + ":" + val[0]);
                        });
                    });
                }
                if ($scope.errorMessages.length == 0 || !$scope.errorMessages.length) {
                    if (tabName == "exitInfo") {
                        utilityService.setStorageValue("exitId", data.data._id);
                        $scope.exitId = data.data._id;
                        $scope.exitFrontend.isLwdChanged = false;
                        $location.search({'id': $scope.exitId, 'isEdit': true});
                        utilityService.resetAPIError(false, null, section);
                    }
                    getExitDetails();
                    if (tabName == "exitCertificate") {
                        alert("Exit completed for Employee");
                        $scope.resetExitEmployee();
                    }
                    $scope.setTab(moveTab, true);
                }
                if (angular.isDefined(data.data)) {
                    utilityService.showSimpleToast(data.message);
                } else if (angular.isDefined(data.message)) {
                    utilityService.showSimpleToast(data.message);
                }
            }
        };
        var errorCallback = function (data, section) {
            var errors = angular.isDefined(data.message) ? data.message : data.data.message;
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
                if (angular.isArray(errors)) {
                    angular.forEach(errors, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            $scope.errorMessages.push(v[0]);
                        });
                    });
                } else {
                    $scope.errorMessages.push(errors);
                }
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                if (angular.isArray(errors)) {
                    angular.forEach(data.data.message, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            $scope.errorMessages.push(v[0]);
                        });
                    });
                } else {
                    $scope.errorMessages.push(data.data.message);
                }
            }
        };
        var successErrorCallback = function (data, tabName, section, isAdded, tab) {
            $scope.errorMessages = [];
            moveTab = tab;
            section = angular.isDefined(section) ? section : "exitInfo";
            isAdded = angular.isDefined(isAdded) ? isAdded : false;
            data.status === "success" ?
                successCallback(data, tabName, section, isAdded) : errorCallback(data, section);
        };
        $scope.updateEmployeeInfo = function (isDraft) {
            var url = FrontendExitService.getUrl("exitEmpInfo"),
                payload = {};

            angular.copy($scope.exit, payload);
            payload.last_serving_date = formatDate($scope.exit.last_serving_date);
            payload.resignation_date = formatDate($scope.exit.resignation_date);
            payload.trigger_gratuity_date = angular.isDefined($scope.exit.trigger_gratuity_date) && $scope.exit.is_trigger_gratuity ? formatDate($scope.exit.trigger_gratuity_date) : null;
            payload.triger_immediate_pf_date = angular.isDefined($scope.exit.triger_immediate_pf_date) && $scope.exit.is_triger_immediate_pf ? formatDate($scope.exit.triger_immediate_pf_date) : null;
            payload.trigger_EDLI_date = angular.isDefined($scope.exit.trigger_EDLI_date) && $scope.exit.is_trigger_EDLI_on_draw ? formatDate($scope.exit.trigger_EDLI_date) : null;
            payload = FrontendExitService.buildEmpInfoPayload(payload);
            if (isDraft) {
                payload.is_draft = true;
            }
            if (!$scope.exitId) {
                serverUtilityService.postWebService(url, payload)
                    .then(function (data) {
                        if (isDraft) {
                            $location.url("frontend/exit");
                        }
                        successErrorCallback(data, "exitInfo", 'exitInfo', 'true', 'clear');
                    });
            } else {
                url = url + "/" + $scope.exitId;
                serverUtilityService.putWebService(url, payload)
                    .then(function (data) {
                        if (isDraft) {
                            $location.url("frontend/exit");
                        }
                        successErrorCallback(data, "exitInfo", 'exitInfo', 'false', 'clear');
                    });
            }
        };

        /***** START SIGNATORY AUTOCOMPLETE *****/
        var getEmployeeAccordingToExit = function () {
            if ($scope.exitId) {
                var url = FrontendExitService.getUrl('getEmpByexit') + "/" + $scope.exitId;
                serverUtilityService.getWebService(url).then(function (data) {
                    $scope.employeeListByExit = [];
                    angular.forEach(data.data, function (value, key) {
                        value.full_name = angular.isDefined(value.full_name) ? value.full_name : value.employee_detail.personal_profile_first_name + " " + value.employee_detail.personal_profile_last_name;
                        if (value.full_name) {
                            $scope.employeeListByExit.push(value);
                        }
                    });
                    self.exitRepos = loadAll($scope.employeeListByExit);
                });
            }
        };
        var getEmployeeDetails = function () {
            var url = FrontendExitService.getUrl('getEmployee') + "/" + $scope.exitFrontend.permission;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.employeeList = [];
                angular.forEach(data.data, function (value, key) {
                    if (angular.isDefined(value.employee_detail) && value.employee_detail) {
                        value.full_name = value.employee_detail.personal_profile_first_name + " " + value.employee_detail.personal_profile_last_name;
                    }
                    if (value.full_name) {
                        $scope.employeeList.push(value);
                    }
                });
                self.repos = loadAll($scope.employeeList);
            });
        };
        getEmployeeDetails();

        /**** Start: Handover Auto Complete Section ****/
        function querySearchHandoverPoc(query) {
            return query ? self.repos.filter(createFilterFor(query)) : self.repos;
        }
        function searchTextChangeHandoverPoc(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function selectedItemChangeHandoverPoc(item, model, key) {
            if (angular.isDefined(model[key]) && angular.isDefined(item) && item) {
                var id =  angular.isObject(item._id) ? item._id.$id : item._id;
                model[key] = id;
            }
        }
        /**** End: Handover Auto Complete Section ****/

        /***** FOR EXIT FEEDBACK *****/
        function querySearch(query) {
            return query ? self.repos.filter(createFilterFor(query)) : self.repos;
        }
        function queryInterviewerSearch(query) {
            return query ? self.interviewRepo.filter(createFilterFor(query)) : self.interviewRepo;
        }
        function queryReportingManagerSearch(query) {
            return query ? self.exitRepos.filter(createFilterFor(query)) : self.exitRepos;
        }
        function queryCertificateSearch(query, letterId) {
            angular.forEach($scope.exitFrontend.mainCertificateCollections, function (val, key) {
                angular.forEach(val.templates, function (v, k) {
                    if (v._id == letterId) {
                        $scope.certifiateSignAuth = val.signature_setup;
                    }
                });
            });
            self.certificaterepos = loadAll($scope.certifiateSignAuth);
            return  self.certificaterepos;
        }
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model) && model && angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function interviewSearchTextChange(text, model, key) {
            if (angular.isDefined(model) && model && angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function selectedItemChange(item, model, key) {
            if (angular.isDefined(item) && item && angular.isDefined(model[key])) {
                var id = angular.isObject(item._id) ? item._id.$id : item._id;
                model[key] = id;
                $scope.getNoticePeriodDetails(self.isDisabledEmployee, true);
                //console.log(self.selectedItem[model.uniqueKey]);
            }
        }
        function interviewSelectedItemChange(item, model, key) {
            if (angular.isDefined(item) && item && angular.isDefined(model[key])) {
                var id = angular.isObject(item._id) ? item._id.$id : item._id;
                model[key] = id;
            }
        }
        function loadAllInterviewer() {
            var repos = $scope.exitSettings.at_admin_discretion || !$scope.exit.exit_interview_by.length ? $scope.employeeListByExit : $scope.exit.exit_interview_by;
            return repos.map(function (repo) {
                repo.full_name = angular.isDefined(repo.full_name) ? repo.full_name : repo.personal_profile_first_name + " " + repo.personal_profile_last_name;
                repo.value = repo.full_name.toLowerCase();
                return repo;
            });
        }
        function loadAll(list) {
            var repos = list;
            return repos.map(function (repo) {
                repo._id =  angular.isObject(repo._id) ? repo._id.$id : repo._id;
                repo.full_name = angular.isDefined(repo.full_name) ? repo.full_name : repo.personal_profile_first_name + " " + repo.personal_profile_last_name;
                repo.name = utilityService.getValue(repo, 'full_name');
                repo.empcode = utilityService.getValue(repo, 'personal_profile_employee_code');
                repo.image = utilityService.getValue(repo, 'profile_pic', 'images/no-avatar.png');
                repo.profile_pic = utilityService.getValue(repo, 'image');
                if (utilityService.getValue($scope.autoCompleteVia, 'selected') === 'empcode') {
                    repo.value = utilityService.getValue(repo, 'empcode') ? repo.empcode.toLowerCase() : null;
                } else {
                    repo.value = repo.full_name.toLowerCase();
                }

                return repo;
            });
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }

        /********** CLEARANCE SECTION **********/
        $scope.revokeAccess = function (type) {
            if (type == 'admin_role') {
                var url = FrontendExitService.getUrl('revokeAccess') + "/" + $scope.exit.admin_role._id + "/" + $scope.exitId;
            } else if (type == 'non_admin_role') {
                var url = FrontendExitService.getUrl('revokeAccess') + "/" + $scope.exit.non_admin_role._id + "/" + $scope.exitId;
            }
            var payload = {
                employee_id: $scope.exit.employee_detail._id.$id
            };
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        alert(data.message);
                        $scope.disableField[type] = true;
                        $('#revoke-alert').modal('hide');
                    }
                });
        };
        var getProvisionListByManager = function (comingData) {
            var url = FrontendExitService.getUrl('provisionByManager') + "/" + comingData.employee_id;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.provisionByManager = data.data;
                bulidProvisionByManagerList(comingData);
            });
        };
        var bulidProvisionByManagerList = function (data) {
            $scope.provisionByManagerList = [];
            if (angular.isDefined(data) && angular.isDefined(data.new_provision_managers)) {
                angular.forEach(data.new_provision_managers, function (value, key) {
                    var id = angular.isObject(value._id) ? value._id.$id : value._id;
                    self.selectedItem[id] = value.new_provision_manager;
                    $scope.provisionByManagerList.push({
                        _id: angular.isObject(value._id) ? value._id.$id : value._id,
                        provision_name: value.provision_name,
                        provision_icon: value.provision_icon,
                        emp_id: value.new_provision_manager._id,
                        handover_date: utilityService.getDefaultDate(utilityService.getValue(value, 'handover_date'), false, true)
                    });
                });
            } else {
                angular.forEach($scope.provisionByManager, function (value, key) {
                    var id = angular.isObject(value._id) ? value._id.$id : value._id;
                    self.selectedItem[id] = angular.isDefined(value.new_provision_manager) ? value.new_provision_manager : '';
                    $scope.provisionByManagerList.push({
                        _id: angular.isObject(value._id) ? value._id.$id : value._id,
                        provision_name: value.provision_name,
                        provision_icon: value.provision_icon,
                        emp_id: null,
                        handover_date: utilityService.getDefaultDate(utilityService.getValue(value, 'handover_date'), false, true)
                    });
                });
            }
        };
        var bulidTeamList = function (comingData) {
            $scope.teamsList = [];
            if (angular.isDefined(comingData) && angular.isDefined(comingData.handovers_to) && comingData.handovers_to.length) {
                bulidHandoverList(comingData);
            } else {
                var url = FrontendExitService.getUrl('getAssignedTeam') + "/" + comingData.employee_id;
                serverUtilityService.getWebService(url).then(function (data) {
                    $scope.teamList = data.data;
                    bulidHandoverList();
                });
            }
        };
        var bulidHandoverList = function (data) {
            if (angular.isDefined(data)) {
                angular.forEach(data.handovers_to, function (value, key) {
                    var uniqueKey = "team" + key;
                    self.selectedItem[uniqueKey] = value.new_manager;
                    $scope.teamsList.push({
                        _id: angular.isObject(value.employee_id) ? value.employee_id.$id : value.employee_id,
                        uniqueKey: uniqueKey,
                        full_name: value.full_name,
                        relationship_type_id: value.relationship_type_id,
                        relationship_type_name: value.relationship_type_name,
                        reporting_manager: value.new_manager._id,
                        handover_date: utilityService.getDefaultDate(utilityService.getValue(value, 'handover_date'), false, true)
                    });
                    $scope.bulkAssign.assignedTeam.relationship[value.relationship_type_id] = value.relationship_type_name;
                });
            } else {
                angular.forEach($scope.teamList, function (value, key) {
                    var id = angular.isObject(value._id) ? value._id.$id : value._id;
                    $scope.teamsList.push({
                        _id: id,
                        uniqueKey: "team" + key,
                        full_name: value.full_name,
                        reporting_manager: null,
                        relationship_type_id: value.relationship_type_id,
                        relationship_type_name: value.relationship_type_name,
                        handover_date: utilityService.getDefaultDate(utilityService.getValue(value, 'handover_date'), false, true)
                    });
                    $scope.bulkAssign.assignedTeam.relationship[value.relationship_type_id] = value.relationship_type_name;
                });
            }
            console.log($scope.bulkAssign);
        };
        var getForOtherAuthorities = function (data1) {
            $scope.authoritiesList = [];
            if (angular.isDefined(data1.other_ownerships) && data1.other_ownerships.length) {
                buildAuthoritiesList(data1);
            } else {
                var url = FrontendExitService.getUrl('otherAutorities') + "/" + $scope.exit.employee_id;
                serverUtilityService.getWebService(url).then(function (data) {
                    angular.forEach(data.data, function (v, k) {
                        v.handover_date = null;
                        v.emp_id = null;
                        v.uniqueKey = "otherAuth" + k;
                        $scope.bulkAssign.otherAssignedAuthorities.authorityType[v.type] = v.type_heading;
                    });
                    $scope.authoritiesList = data.data;
                });
            }
        };
        var buildAuthoritiesList = function (data) {
            angular.forEach(data.other_ownerships, function (v, k) {
                v.uniqueKey = "otherAuth" + k;
                var newAuthority = {
                    full_name: v.full_name,
                    _id: angular.isObject(v.employee_id) ? v.employee_id.$id : v.employee_id
                };
                self.selectedItem[v.uniqueKey] = newAuthority;
                $scope.authoritiesList.push({
                    uniqueKey: v.uniqueKey,
                    type_id: v.ownership_type_id,
                    type: v.ownership_type,
                    type_name: v.ownership_type_name,
                    type_heading: v.ownership_type_heading,
                    ownership_type: v.ownership_type,
                    emp_id: angular.isObject(v.employee_id) ? v.employee_id.$id : v.employee_id,
                    handover_date: utilityService.getDefaultDate(utilityService.getValue(v, 'handover_date'), false, true)
                });
                $scope.bulkAssign.otherAssignedAuthorities.authorityType[v.type] = v.type_heading;
            });
        };
        var buildProvisions = function (dataa) {
            var url = FrontendExitService.getUrl('provisions') + "/" + $scope.exit.employee_id;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.provision = data.data;
                buildProvisionsList(dataa);
            });
        };
        var buildProvisionsList = function (data) {
            $scope.provisions = [];

            if (angular.isDefined(data) && angular.isDefined(data.employee_detail.provision_detail)) {
                angular.forEach(data.employee_detail.provision_detail, function (value, key) {
                    $scope.provisions.push({
                        provision_id: angular.isObject(value.provision_id) ? value.provision_id.$id : value.provision_id,
                        provision_name: value.provision_name,
                        poc: value.poc,
                        unassign_date: utilityService.getDefaultDate(utilityService.getValue(value, 'unassign_date'), false, true),
                        notified_date: utilityService.getDefaultDate(utilityService.getValue(value, 'poc_notify_date'), false, true)
                    });
                });
            } else {
                angular.forEach($scope.provision, function (value, key) {
                    $scope.provisions.push({
                        provision_id: value.provision_id,
                        provision_name: value.provision_name,
                        poc: value.poc,
                        unassign_date: utilityService.getDefaultDate(utilityService.getValue(value, 'unassign_date'), false, true),
                        notified_date: utilityService.getDefaultDate(utilityService.getValue(value, 'poc_notifying_date'), false, true)
                    });
                });
            }
        };
        var buildNoDuesList = function (dataa) {
            $scope.noDue = [];
            $scope.noDues = [];
            $scope.exitFrontend.selectedClearances = [];
            if (angular.isDefined(dataa.exit_clearances) && dataa.exit_clearances.length) {
                buildOtherClearances(dataa);
            }
            var url = FrontendExitService.getUrl('getNoDues') + "/" + $scope.exitId;
            serverUtilityService.getWebService(url).then(function (data) {
                angular.forEach(data.data, function (value, key) {
                    $scope.noDue.push({
                        nodue_id: value._id,
                        noDue_name: value.clearance_name,
                        pocs: value.clearance_poc,
                        unassign_date: utilityService.getDefaultDate(utilityService.getValue(value, 'due_date'), false, true),
                        notified_date: utilityService.getDefaultDate(utilityService.getValue(value, 'clearance_poc_notify_date'), false, true)
                    });
                });
            });
        };
        var buildOtherClearances = function (data) {
            angular.forEach(data.exit_clearances, function (value, key) {
                var id = angular.isObject(value._id) ? value._id.$id : value._id;
                $scope.exitFrontend.selectedClearances.push(id);
                $scope.noDues.push({
                    nodue_id: id,
                    noDue_name: value.clearance_name,
                    pocs: value.clearance_poc,
                    unassign_date: utilityService.getDefaultDate(utilityService.getValue(value, 'due_date'), false, true),
                    notified_date: utilityService.getDefaultDate(utilityService.getValue(value, 'notified_date'), false, true)
                });
            });
        };
        $scope.selectAllClearance = function () {
            $scope.exitFrontend.selectedClearances = [];
            $scope.noDues = [];
            angular.forEach($scope.noDue, function (item, key) {
                $scope.noDues.push(item);
                $scope.exitFrontend.selectedClearances.push(item.nodue_id);
            });
        };
        $scope.deselectAllClearance = function () {
            $scope.exitFrontend.selectedClearances = [];
            $scope.noDues = [];
        };
        $scope.selectClearnace = function (item) {
            if (!$scope.noDues.length || $scope.noDues.length == 0) {
                $scope.noDues.push(item);
            } else {
                var count = 0;
                for (var i = 0; i < $scope.noDues.length; i++) {
                    if ($scope.noDues[i]['nodue_id'] == item.nodue_id) {
                        count += 1;
                        $scope.noDues.splice(i, 1);
                        break;
                    }
                }
                if (count == 0) {
                    $scope.noDues.push(item);
                }
            }
            $scope.sameDate.preFillIsAll();
        };
        $scope.clearanceDetail = function (isDraft) {
            var payload = {
                provisions: FrontendExitService.buildUnAssignAssetPayload($scope.provisions),
                clearances: FrontendExitService.buildNoDuesPayload($scope.noDues),
                handovers_to: FrontendExitService.buildHandoverPayload($scope.teamsList),
                new_provision_managers: FrontendExitService.buildProvisionByManagerPayload($scope.provisionByManagerList),
                other_ownerships: FrontendExitService.buildOtherAuthoritiesPayload($scope.authoritiesList),
                pending_actions_handover_poc: utilityService.getValue($scope.handoverPoc,'employee_id'),
                pending_actions_handover_date: utilityService.dateFormatConvertion(utilityService.getValue($scope.handoverPoc,'date'))

            };
            if (FrontendExitService.buildAccessPayload($scope.exit.admin_role, $scope.exit.admin_role_revoke_date) != null || FrontendExitService.buildAccessPayload($scope.exit.non_admin_role, $scope.exit.non_admin_role_revoke_date) != null) {
                payload.accesses = [FrontendExitService.buildAccessPayload($scope.exit.admin_role, $scope.exit.admin_role_revoke_date), FrontendExitService.buildAccessPayload($scope.exit.non_admin_role, $scope.exit.non_admin_role_revoke_date)];
            }
            if (isDraft) {
                payload.is_draft = true;
            }
            var url = FrontendExitService.getUrl('unassign') + "/" + $scope.exitId;
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (isDraft) {
                        $location.url("frontend/exit");
                    }
                    getExitFeedbackForm($scope.exitId);
                    getExitFeedbackSurveyForm($scope.exitId);
                    if ($scope.exitSettings.is_exit_interview || $scope.exitSettings.is_exit_survey) {
                        successErrorCallback(data, "clearance", 'exitInfo', 'un_assignments', 'exit');
                    } else if ($scope.exitSettings.is_certificates) {
                        
                        successErrorCallback(data, "feedback", 'exitInfo', 'false', 'certificate');
                    } else {
                        $scope.verifiedStep = 2; // added by vipin
                        utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                        $scope.setTab('certificate', false, 4);
                    }
                });
        };

        /********** EXIT FEEDBACK **********/
        var getExitFeedBackDetail = function () {
            var model = angular.isDefined($scope.exit.feedback_detail) && $scope.exit.feedback_detail.length ? $scope.exit.feedback_detail : null;
            if (model) {
                self.selectedFeedback = {
                    _id: angular.isObject($scope.exit.feedback_detail._id) ? $scope.exit.feedback_detail._id.$id : $scope.exit.feedback_detail._id,
                    full_name: utilityService.getValue($scope.exit.feedback_detail[0].exit_interview_by, 'personal_profile_first_name', 'please') + " " + utilityService.getValue($scope.exit.feedback_detail[0].exit_interview_by, 'personal_profile_last_name', 'select'),
                    email: utilityService.getValue($scope.exit.feedback_detail, 'email')
                };
                $scope.enterviewerFlag = false;
            } else if (angular.isDefined($scope.exit.exit_interview_by) && $scope.exit.exit_interview_by.length && !model) {
                var obj = {};
                $scope.exit.exit_interview_by = $scope.exit.exit_interview_by.length ? $scope.exit.exit_interview_by[0] : null;
                obj._id = angular.isObject($scope.exit.exit_interview_by._id) ? $scope.exit.exit_interview_by._id.$id : $scope.exit.exit_interview_by._id;
                obj.full_name = angular.isDefined($scope.exit.exit_interview_by.full_name) ? $scope.exit.exit_interview_by.full_name : utilityService.getValue($scope.exit.exit_interview_by, 'personal_profile_first_name', 'please') + " " + utilityService.getValue($scope.exit.exit_interview_by, 'personal_profile_last_name', 'select');
                obj.email = utilityService.getValue($scope.exit.exit_interview_by, 'email');
                self.selectedFeedback = obj;
                if (obj) {
                    $scope.enterviewerFlag = true;
                }
            }
            $scope.exitFormTypes = FrontendExitService.buildEmpExitFeedbackModel(model, $scope.exitSettings);
            if(!self.selectedFeedback){
                self.searchText = '';
            }
        };
        $scope.updateExitFeedback = function (isDraft) {
            var payload = FrontendExitService.buildEmpExitFeedbackPayload($scope.exitFormTypes, $scope.enterviewerFlag, self.selectedFeedback, $scope.exitSettings);
            if (isDraft) {
                payload.is_draft = true;
            }
            var url = FrontendExitService.getUrl('exitFeedback') + "/" + $scope.exitId;
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (isDraft) {
                        $location.url("frontend/exit");
                    }
                    self.isDisabled = false;
                    successErrorCallback(data, "feedback", 'exitInfo', 'false', 'certificate');
                });
        };
        var getExitFeedbackForm = function (exitid) {
            var url = FrontendExitService.getUrl('getExitForm');
            if(angular.isDefined(exitid)) {
                url = url + "?status=true&exit_id=" + exitid;
            }
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.feedBackForm = data.data;
                });
        };
        getExitFeedbackForm();
        var getExitFeedbackSurveyForm = function (exitid) {
            var url = FrontendExitService.getUrl('getExitSurveyForm');
            if(angular.isDefined(exitid)) {
                url = url + "?status=true&exit_id=" + exitid;
            }
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.feedBackSurveyForm = data.data;
                });
        };
        getExitFeedbackSurveyForm();

        /*********** EXIT CERTIFICATES ***********/
        $scope.certifiateSignAuth = [];
        $scope.setValues = function (to, from, template) {
            to.due_date = utilityService.getDefaultDate(utilityService.getValue(from, 'due_date'), false, true);
            if (angular.isDefined(template)) {
                $scope.exitFrontend.slectedCertificates.push(template._id);
                to.typeName = from.name;
                to.letterName = template.title;
            }
            self.isDisabled = false;
        };
        var createCertificateList = function (data) {
            var list = [], flag = false;
            $scope.exitFrontend.certficateOriginalLength = 0;
            angular.forEach(data, function (value, key) {
                for (var i = 0; i < value.templates.length; i++) {
                    if ($scope.exitFrontend.slectedCertificates.indexOf(value.templates[i]["_id"]) > -1) {
                        flag = false;
                        break;
                    } else {
                        flag = true;
                    }
                }
                if (flag && value.templates.length && value.signature_setup) {
                    list.push(value);
                }
                if (value.templates.length && value.signature_setup && value.signature_setup.length) {
                    $scope.exitFrontend.certficateOriginalLength += 1;
                }
            });
            return list;
        };
        var getExitCertificates = function () {
            var url = FrontendExitService.getUrl('getExitCertifiates'),
                params = {
                    lastServingDay: $scope.formatDate($scope.exit.last_serving_date),
                    status: true
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.exitFrontend.mainCertificateCollections = data.data;
                    $scope.feedBackCertificate = createCertificateList(data.data);
                });
        };
        if ($scope.isCertificate) {
            var date = localStorage.getItem('lastServingDate'),
                url = FrontendExitService.getUrl('getExitCertifiates'),
                params = {
                    lastServingDay: $scope.formatDate(date),
                    status: true
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.exitFrontend.mainCertificateCollections = data.data;
                    $scope.feedBackCertificate = createCertificateList(data.data);
                });
            $scope.isCertificateTrue = true;
        }
        if ($scope.isCertificateTrue) {
            $timeout(function () {
                $location.search("isCertificate", null);
            }, 1000);
        }
        var buildExitObject = function () {
            var obj = [];
            self.certificateSelectedItem = {};
            if (angular.isDefined($scope.exit.certificates_detail) && $scope.exit.certificates_detail.length) {
                angular.forEach($scope.exit.certificates_detail, function (val, key) {
                    var id = angular.isObject(val._id) ? val._id.$id : val._id;
                    if (angular.isDefined(val.sign_authority) && val.sign_authority != null) {
                        val.sign_authority.full_name = val.sign_authority.personal_profile_first_name + " " + val.sign_authority.personal_profile_last_name;
                        self.certificateSelectedItem[id] = val.sign_authority;
                    }
                    obj.push({
                        _id: id,
                        autocompleteKey: "searchText0",
                        letter_id: angular.isDefined(val._id) ? (angular.isObject(val._id) ? val._id.$id : val._id) : null,
                        title: val.title,
                        isViewed: angular.isDefined(val.is_viewed) ? val.is_viewed : false,
                        sign_authority: val.sign_authority != null ? val.sign_authority._id.$id : null,
                        trigger_date: utilityService.getDefaultDate(utilityService.getValue(val, 'trigger_date'), false, true),
                        due_days: utilityService.getValue(val, 'due_days'),
                        template_type: utilityService.getValue(val, 'template_type'),
                        isSelected: angular.isDefined(id) ? true : false,
                        letterName: utilityService.getValue(val, 'title'),
                        typeName: utilityService.getValue(val, 'title'),
                    });
                    if (angular.isDefined(id)) {
                        $scope.exitFrontend.slectedCertificates.push(id);
                    }
                });
                $scope.exit.certificates_detail = obj;
            }
        };
        $scope.addMoreCertificates = function () {
            var len = $scope.exit.certificates_detail.length;
            if (len > 0) {
                $scope.exit.certificates_detail[len - 1]['isSelected'] = true;
            }
            $timeout(function () {
                $scope.feedBackCertificate = createCertificateList($scope.exitFrontend.mainCertificateCollections);
            }, 100);
            $scope.exit.certificates_detail.push({
                autocompleteKey: "searchText" + len, 
                letter_id: null, 
                sign_authority: null, 
                trigger_date: null, 
                due_date: null, 
                isViewed: false
            });
        };
        $scope.cut = function (index, certificate) {
            if (angular.isDefined(certificate._id) && certificate._id != null) {
                var id = angular.isObject(certificate._id) ? certificate._id.$id : certificate._id,
                    url = FrontendExitService.getUrl('removeCertificate') + "/" + $scope.exitId + "/" + id;
                
                serverUtilityService.deleteWebService(url)
                    .then(function (data) {
                        $scope.exit.certificates_detail = utilityService.deleteCallback(data, certificate, $scope.exit.certificates_detail);
                        if ($scope.exit.certificates_detail.length == 0) {
                            $scope.addMoreCertificates();
                        }
                    });
            } else {
                $scope.exit.certificates_detail.splice(index, 1);
                if ($scope.exit.certificates_detail.length == 0) {
                    $scope.addMoreCertificates();
                }
            }
            var i = $scope.exitFrontend.slectedCertificates.indexOf(certificate.letter_id);
            if (i > -1) {
                $scope.exitFrontend.slectedCertificates.splice(i, 1);
            }
            $timeout(function () {
                $scope.feedBackCertificate = createCertificateList($scope.exitFrontend.mainCertificateCollections);
            }, 100);
        };
        $scope.finalExit = function (isDraft) {
            var url = FrontendExitService.getUrl('exitCertifiates') + "/" + $scope.exitId,
                payload = FrontendExitService.buildExitCertificatePayload($scope.exit.certificates_detail, isDraft);
            
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (isDraft) {
                        $location.url("frontend/exit");
                    }
                    successErrorCallback(data, "exitCertificate", 'exitInfo', 'false', 'empInfo');
                });
        };
        $scope.resetExitEmployee = function () {
            if ($scope.exitId) {
                utilityService.removeStorageValue('exitId');
                $scope.exitId = null;
                $location.url("frontend/exit");
            }
        };

        $scope.employeeExitList = [];
        $scope.exitDraftList = null;
        $scope.showRmndrHstry = false;
        $scope.selectedEmployee = 0;
        $scope.roleTypeToAccess = null;
        $scope.orderByField = 'full_name';
        $scope.exitStatus = FrontendExitService.exitStatusObj();
        $scope.duesStatus = FrontendExitService.duesStatusObj();
        $scope.showReminderHistory = function () {
            $scope.showRmndrHstry = $scope.showRmndrHstry ? false : true;
        };        
        var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true,
                collection_key: 'employee_preview'
            },
            {
                countObject: 'status',
                collection: [],
                isArray: false,
                key: 'on_notice'
            }
        ];        
        var getEmployeeExitList = function () {
            $scope.resetFacadeCountObject(allFilterObject);
            var url = FrontendExitService.getUrl('getExitList');
            serverUtilityService.getWebService(url).then(function (data) {
                angular.forEach(data.data, function (v, k) {
                    v.full_name = v.employee_preview.full_name;
                    v.employee_id = v.employee_preview.personal_profile_employee_code;
                    $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject, v);
                });
                $scope.employeeExitList = data.data;
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                $scope.exitFrontend.listVisible = true;
            });
        };
        getEmployeeExitList();
        var getExitDraftList = function () {
            var url = FrontendExitService.getUrl('getDraftList');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.exitDraftList = data.data;
                $scope.exitFrontend.draftListVisible = true;
            });
        };
        getExitDraftList();
        $scope.removeDrftedList = function (item) {
            var url = FrontendExitService.getUrl('deleteDraftList') + "/" + item._id;
            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    $scope.exitDraftList = utilityService.deleteCallback(data, item, $scope.exitDraftList);
                });
        };
        $scope.revokeExit = function (item, key) {
            key = angular.isDefined(key) ? key : 'list';
            var id = angular.isObject(item._id) ? item._id.$id : item._id,
                url = FrontendExitService.getUrl('getExitList') + "/" + id;

            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    if (data.status == 'success') {
                        $scope.backToUrl('/frontend/exit');
                    }
                    $scope.employeeExitList = utilityService.deleteCallback(data, item, $scope.employeeExitList);
                });
        };
        $scope.selectDraftList = {};
        $scope.isCheck = false;
        $scope.checkAll = function () {
            $scope.isCheck = !$scope.isCheck;
            if ($scope.isCheck) {
                angular.forEach($scope.exitDraftList, function (row, index) {
                    $scope.selectDraftList[index] = true;
                });
            } else {
                angular.forEach($scope.exitDraftList, function (row, index) {
                    $scope.selectDraftList[index] = false;
                });
            }
        };
        $scope.errorList = {};
        $scope.selectedArray = [];
        $scope.finalizeExit = function () {
            angular.forEach($scope.exitDraftList, function (row, index) {
                if ($scope.selectDraftList[index]) {
                    $scope.selectedArray.push(row._id);
                }
            });
            var url = FrontendExitService.getUrl('finalizeExit'),
                payload = {
                    id: $scope.selectedArray
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        if (angular.isDefined(data.error) && data.error.length) {
                            angular.forEach(data.error, function (row, index) {
                                $scope.errorList[index] = row;
                                if (data.error[index] == null) {
                                    delete $scope.exitDraftList[index];
                                }
                            });
                        } else {
                            $scope.resetExitEmployee();
                        }
                    }
                });
        };
        $scope.backToUrl = function (url) {
            if ($routeParams.page == 'detailPage') {
                $scope.setRoute('exit', {_id: $routeParams.exitId});
            } else {
                $location.url(url);
            }
        };
        $scope.viewPermissionData = [];
        $scope.rolesDetails = {};
        $scope.viewPermision = function (role, id) {
            id = angular.isDefined(id) ? id : role._id;
            $scope.viewPermissionData = null;
            $scope.rolesDetails = role;
            var url = FrontendExitService.getUrl('viewPermission') + "/" + role.type + "/" + id;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.viewPermissionData = data.data;
                });
            $('#view-role-permission').appendTo('body').modal('show');
        };
        $scope.sendReminderTo = function (type, slave, master, clearanceObject) {
            clearanceObject = angular.isDefined(clearanceObject) ? clearanceObject : null;
            var slave_arr = [];
            slave_arr.push(angular.isObject(slave) ? slave.$id : slave);
            
            var url = FrontendExitService.getUrl('setReminder'),
                payload = {
                    slave_emp_id: slave_arr,
                    master_emp_id: angular.isObject(master) ? master.$id : master,
                    type: type
                };

            if (clearanceObject) {
                payload.clearance_name = clearanceObject.clearance_name;
                payload.clearance_due_date = clearanceObject.due_date;
            }
            
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                    }
                });
        };
        $scope.markDoneObject = {
            item: null,
            exitId: null
        };        
        var markDoneCallback = function (data, event) {
            $scope.closeModal('markDone');
            if (utilityService.getValue(data, 'status') == 'success') {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                $scope.markDoneObject.item.status = data.data.status;
                $scope.markDoneObject.item.relieved_date = data.data.relieved_date;
            } else {
                showAlert(event, utilityService.getValue(data, 'message'));
            }
        };
        $scope.markDone = function (event) {
            var url = FrontendExitService.getUrl('markDone') + "/" 
                    + utilityService.getValue($scope.markDoneObject, 'exitId'),
                payload = {
                    pending_actions_handover_poc: utilityService.getValue($scope.handoverPoc, 'employee_id')
                };

            serverUtilityService.patchWebService(url, payload)
                .then(function (data) {
                    markDoneCallback(data, event);
                });
        };
        $scope.openMarkDonePopup = function (item) {
            $scope.markDoneObject.item = item;
            $scope.markDoneObject.exitId = id = angular.isObject(item._id) ? item._id.$id : item._id;
            self.searchTextHandoverPoc = utilityService.getInnerValue(item, 'pending_actions_handover_poc', 'full_name', '');
            $scope.handoverPoc.employee_id = utilityService.getInnerValue(item, 'pending_actions_handover_poc', '_id');
            $scope.openModal('markDone', 'exit-mark-done.tmpl.html', 'md');
        };
        $scope.template = {
            body: 'Not Yet Defined',
            isVisible: false
        };
        var previewOfferLetter = function () {
            var url = FrontendExitService.getUrl('previewOffer') + "/" + $scope.exit.employee_id;
            serverUtilityService.getWebService(url).then(function (data) {
                if (data.status == 'error') {
                    $scope.template.isVisible = false;
                } else {
                    $scope.template.isVisible = true;
                    $scope.template.body = data.data;
                }
            });
        };
        $scope.previewOfferLetter = function () {
            previewOfferLetter();
            $('#preview-offer-letter').appendTo('body').modal('show');
        };
        $scope.triggerCertificate = function (tempId, isDraft, type) {
            $scope.errorMessages = [];
            var url = FrontendExitService.getUrl('exitCertifiates') + "/" + $scope.exitId,
                payload = FrontendExitService.buildExitCertificatePayload($scope.exit.certificates_detail, isDraft);
            
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (data.status === "success") {
                        if (angular.isDefined(data.error) && data.error.length) {
                            angular.forEach(data.error, function (value, key) {
                                angular.forEach(value, function (val, ke) {
                                    $scope.errorMessages.push("row" + (key + 1) + ":" + val[0]);
                                });
                            });
                        }
                        if (!$scope.errorMessages.length || $scope.errorMessages.length == 0) {
                            localStorage.setItem('lastServingDate', $scope.exit.last_serving_date);
                            $location.url('template-consumer').search({
                                template: tempId,
                                refUrl: "exitCertificate",
                                isRevoke: false,
                                empId: $scope.exit.employee_id,
                                isExit: true,
                                exitId: $scope.exitId,
                                isSummary: false,
                                type: type
                            });
                        }
                    }
                });
        };
        $scope.checkDateRelation = function (firstDate, secondDate, indx, key, list) {
            var d1 = new Date(firstDate),
                d2 = new Date(secondDate),
                t1 = d1.getTime(),
                t2 = d2.getTime();

            if (t1 > t2) {
                angular.forEach(list, function (val, index) {
                    if (indx == index) {
                        val[key] = null;
                    }
                });
            }
        };
        $scope.handleRevokePopup = function (role) {
            $scope.roleTypeToAccess = role;
            $('#revoke-alert').appendTo('body').modal('show');
        };
        $scope.useTempTrigger = function (tempId, exitId, empId) {
            tempId = angular.isObject(tempId) ? tempId.$id : tempId;
            $location.url('template-consumer').search({
                template: tempId,
                refUrl: "exitCertificate",
                isRevoke: false,
                empId: angular.isObject(empId) ? empId.$id : empId,
                isExit: true,
                exitId: angular.isObject(exitId) ? exitId.$id : exitId,
                isSummary: true
            });
        };
        $scope.isViewed = function (list) {
            if (angular.isDefined(list) && list.length == 1 && (!list[0].letter_id || list[0].letter_id == null)) {
                return false;
            }
            if (angular.isDefined(list) && list.length) {
                var notViewedItem = list.find(function (item) {
                    return item.isViewed === false;
                });
                return (angular.isDefined(notViewedItem) ? true : false);
            } else {
                return false;
            }
        };
        /***** Export CSV *****/
        $scope.makeCsvData = function () {
            var finalArray = [];
            var column = ['Employee Details', 'Employee Id', 'Resignation Date', 'Last Day', 'Exit Type', 'Exit Status', 'Full And Final Status'];
            finalArray.push(column);

            angular.forEach($scope.employeeExitList, function (item, key) {
                var tempArray = new Array();
                tempArray.push(item.full_name);
                tempArray.push(item.employee_preview.personal_profile_employee_code);
                tempArray.push(item.resignation_date);
                tempArray.push(item.last_serving_date);
                if (item.exit_type_detail._id == 1) {
                    tempArray.push(item.exit_type_detail.name);
                } else {
                    tempArray.push("Involuntary-" + item.exit_type_detail.name);
                }
                tempArray.push($scope.exitStatus[item.status]);
                tempArray.push($scope.duesStatus[item.fnf_status]);
                finalArray.push(tempArray);
            });
            if (finalArray.length > 1) {
                utilityService.exportToCsv(finalArray, 'exit_csv.csv');
            }
        };
        $scope.updatePaginationSettings('admin_exit');

        /***** View Feedback Form *****/
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.viewDocs = function (item, type, page) {
            var exitId = angular.isObject(item._id) ? item._id.$id : item._id;
            $location.url('/frontend/exit/verifyDocument').search({"feedback_type": type, exitId: exitId, page: page});
        };
        var viewFormDetailsCallback = function (model) {
            var def = "1970-01-01";
            $scope.questionList = angular.isDefined(model.form_data) && angular.isDefined(model.form_data.form_detail) ? model.form_data.form_detail.questions : [];
            angular.forEach($scope.questionList, function (value, key) {
                if (value.question_type != 3 && angular.isDefined(value.answer)
                        && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];
                }
                // If question type is of time
                if (utilityService.getValue(value, 'answer') && value.answer) {
                    if (value.question_type == 6) {
                        value.answer = new Date(def + " " + value.answer);
                    } else if (value.question_type == 5 && value.answer != "") {
                        value.answer = new Date(parseInt(value.answer));
                    }
                }
            });
        };
        var getFeedbackFormDetails = function () {
            var url = FrontendExitService.getUrl('viewFeedbackForms') + "/" 
                + $routeParams.exitId + "/" + $routeParams.feedback_type;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.docToverify = data.data;
                    $scope.docToverify.page = $routeParams.page == 'detailPage' 
                        ? '/frontend/exit/status' : '/frontend/exit';
                    $scope.docToverify.feedback_type = $routeParams.feedback_type == 'survey' 
                        ? 'Survey Form' : 'Interview Form';
                    viewFormDetailsCallback(data.data);
                });
        };
        if ($routeParams.exitId && $routeParams.feedback_type) {
            getFeedbackFormDetails();
        }

        /***** Start: EmpApprFormAction *****/
        $scope.getEmpApprForm = function(item, keyname) {
            $scope.formSubmitHandler('viewForm', true);
            keyname = angular.isDefined(keyname) ? keyname : 'self_initiate_request_id';
            $q.all([
                serverUtilityService.getWebService(FrontendExitService.getUrl('viewSelfInitiateFormDetails') + "/" + item[keyname]),
                serverUtilityService.getWebService(FrontendExitService.getUrl('approverSelfInitiateForm') + "/" + item[keyname])
            ]).then(function(data) {
                $scope.formSubmitHandler('viewForm', false);
                $scope.requestApproveForm.empForm = FrontendExitService.buildFormObject(utilityService.getInnerValue(data[0], 'data', 'form_detail'));
                $scope.requestApproveForm.apprForm = FrontendExitService.buildFormObject(utilityService.getInnerValue(data[1], 'data', 'form_detail'));
                $scope.requestApproveForm.last_working_date = utilityService.getInnerValue(data[0], 'data', 'last_working_date');
                $scope.requestApproveForm.last_working_date_source = 'employee';
                if (!utilityService.getValue($scope.requestApproveForm, 'last_working_date')) {
                    $scope.requestApproveForm.last_working_date = utilityService.getInnerValue(data[1], 'data', 'last_working_date');
                    $scope.requestApproveForm.last_working_date_source = 'approver';
                }
                if($scope.requestApproveForm.empForm.name || $scope.requestApproveForm.apprForm.name
                    || utilityService.getValue($scope.requestApproveForm, 'last_working_date')) {
                    $scope.openModal('requestApproveFormQuestion', 'request-approve-form-question-tmpl.html', 'lg');
                }
                console.log($scope.requestApproveForm.last_working_date, $scope.requestApproveForm.last_working_date_source);
            });
        };
        /***** End: EmpApprFormAction *****/
       
        /***** Start: Angular Modal *****/
        $scope.openModal = function(instance, templateUrl, size) {
            size = angular.isDefined(size) ? size : 'sm';
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
        };
        /***** End: Angular Modal *****/

        /***** Start: Clearance Same Date functionality *****/
        $scope.sameDate = {
            section: FrontendExitService.buildSameDateSectionsObject(),
            setDate: function(section) {
                if(section && $scope.sameDate.section.hasOwnProperty(section)) {
                    if(section == 'qandle_access' && $scope.exit) {
                        $scope.exit['admin_role_revoke_date'] = $scope.sameDate.section.qandle_access.date;
                        $scope.exit['non_admin_role_revoke_date'] = $scope.sameDate.section.qandle_access.date;
                        $scope.sameDate.section.qandle_access.isAllFilled = true;
                    } else if($scope[$scope.sameDate.section[section].listKey]) {
                        angular.forEach($scope[$scope.sameDate.section[section].listKey], function(val, key) {
                            if(section == 'assigned_team' || section == 'other_assigned_authorities' || section == 'change_assets_manager') {
                                val['handover_date'] = !val.handover_date ? $scope.sameDate.section[section].date : val.handover_date;
                            }
                            if(section == 'assets' || section == 'other_clearances') {
                                val['notified_date'] = !val.notified_date ? $scope.sameDate.section[section].date : val.notified_date;
                                val['unassign_date'] = !val.unassign_date ? $scope.sameDate.section[section].date : val.unassign_date;
                            }
                        });
                        $scope.sameDate.section[section].isAllFilled = true;
                    }
                }
            },
            preFillIsAll: function() {
                angular.forEach($scope.sameDate.section, function(val,key) {
                    if(key == 'qandle_access') {
                        val.isAllFilled = utilityService.getValue($scope.exit, 'admin_role_revoke_date') && utilityService.getValue($scope.exit, 'non_admin_role_revoke_date') && utilityService.getInnerValue($scope.disableField, 'adminRole', 'revoke_date') && utilityService.getInnerValue($scope.disableField, 'adminNonRole', 'revoke_date');
                    } else {
                        if(!$scope[$scope.sameDate.section[key].listKey]) {
                            val.isAllFilled = false;
                        } else {
                            var notFilled = 0;
                            angular.forEach($scope[$scope.sameDate.section[key].listKey], function(v, k) {
                                if(key == 'assigned_team' || key == 'other_assigned_authorities' || key == 'change_assets_manager') {
                                    if(!v.handover_date) {
                                        notFilled++;
                                    }
                                } else if(key == 'assets' || key == 'other_clearances') {
                                    if(!val.notified_date || !val.unassign_date) {
                                        notFilled++
                                    }
                                }
                            });
                            val.isAllFilled = notFilled ? false : true;
                        }
                    }
                });
            }
        };
        $scope.sameDate.preFillIsAll();
        /***** End: Clearance Same Date functionality ******/

        /***** Start: Search by employee name and code section */
        $scope.usermanagent = {
            searchKey: 'full_name',
            searchText: 'Search by Employee Name'
        };
        $scope.changeSearchTextHandler = function (search) {
            $scope.name_filter = {};
            $scope.usermanagent.searchText = search == 'employee_id' 
                ? 'Search by Employee Code' : 'Search by Employee Name';
        };
        /***** End: Search by employee name and code section */

        $scope.changeAutoCompleteVia = function () {
            self.repos = loadAll($scope.employeeList);
        };

        /**** Start: Pending Requests Section *****/
        $scope.getExitPendingRequests = function () {
            $scope.exitFrontend.pendingRequests.false = true;            
            var url = FrontendExitService.getUrl('pendingRequests');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.exitFrontend.pendingRequests.list = timeOffService.buildRequestList(utilityService.getValue(data, 'data', []));
                    $scope.exitFrontend.pendingRequests.visible = true;
                });
        };        
        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };
        $scope.exportPendingRequests = function () {
            var csvData = FrontendExitService.buildPendingRequestsCSVData(utilityService.getInnerValue($scope.exitFrontend, 'pendingRequests', 'filteredItems', []));
            utilityService.exportToCsv(csvData.content, 'exit-pending-requests.csv');
        };
        $scope.viewApproverChainDetail = function (item) {
            angular.copy(utilityService.getValue(item, 'approver_chain_detail', []), $scope.exitFrontend.pendingRequests.approverChainDetail);
            var size = utilityService.getInnerValue($scope.exitFrontend, 'pendingRequests', 'approverChainDetail', []).length >= 2 ? 'lg' : 'md';
            $scope.openModal('viewApproverChain', 'view-stop-comment.tmpl.html', size);
        };
        $scope.updatePaginationSettings('exit_pending_requests_listing');
        /**** End: Pending Requests Section *****/

        /***** Start: MdDialog Section *****/
        var showAlert = function(ev, message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Alert!')
                    .textContent(message)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
        /***** End: MdDialog Section *****/

        /**** Start: Bulk Assign Auto Complete Section ****/
        function querySearchBulkAssignPoc(query) {
            return query ? self.repos.filter(createFilterFor(query)) : self.repos;
        }
        function searchTextChangeBulkAssignPoc(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function selectedItemChangeBulkAssignPoc(item, model, key) {
            if (angular.isDefined(model[key]) && angular.isDefined(item) && item) {
                var id =  angular.isObject(item._id) ? item._id.$id : item._id;
                model[key] = id;
            }
        }
        /**** End: Bulk Assign Auto Complete Section ****/

        /**** Start: Bulk Assign POC Section *****/
        var resetBulkAssignDropdown = function (section) {
            $scope.bulkAssign[section].selected = section === 'assetManager' ? 'all' : null;
        };
        var resetBulkAssignAutoComplete = function (section) {
            self.searchTextBulkAssignPoc = '';
            self.bulkAssign[section].employee_id = null;
        };     
        var resetBulkAssignDropdownAndAutoComplete = function (section) {
            resetBulkAssignDropdown(section);
            resetBulkAssignAutoComplete(section);
        };
        $scope.bulkAssignToAssignedTeam = function (section) {
            var selectedRelationship = utilityService.getInnerValue($scope.bulkAssign, section, 'selected');
            
            angular.forEach($scope.teamsList, function (value, key) {
                if (selectedRelationship == utilityService.getValue(value, 'relationship_type_id')) {
                    self.selectedItem[value.uniqueKey] = self.bulkAssign[section].employee_id;
                }
            });

            resetBulkAssignDropdownAndAutoComplete(section);
        };
        $scope.bulkAssignToOtherAssignedAuthorities = function (section) {
            var selectedAuthorityType= utilityService.getInnerValue($scope.bulkAssign, section, 'selected');
            
            angular.forEach($scope.authoritiesList, function (value, key) {
                if (selectedAuthorityType == utilityService.getValue(value, 'type')) {
                    self.selectedItem[value.uniqueKey] = self.bulkAssign[section].employee_id;
                }
            });

            resetBulkAssignDropdownAndAutoComplete(section);
        };
        $scope.bulkAssignToAssets = function (section) {
            angular.forEach($scope.provisionByManagerList, function (value, key) {
                self.selectedItem[value._id] = self.bulkAssign[section].employee_id;
            });

            resetBulkAssignDropdownAndAutoComplete(section);
        };
        /**** End: Bulk Assign POC Section *****/

        /**** Start: Show Confirmation Dialog Section ****/
        var showConfirmDialog = function(ev, functionName, section) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Do you wish to continue ?')
                .textContent('Please check the new employee being assigned in bulk before proceeding')
                .ariaLabel('')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('No, want to cancel');

            $mdDialog.show(confirm).then(function() {
                functionName(section);
            }, function() {
                resetBulkAssignDropdownAndAutoComplete(section);
            });
        };
        $scope.showConfirmDialog = function(event, functionName, section) {
            showConfirmDialog(event, functionName, section);
        };
        /**** End: Show Confirmation Dialog Section ****/
        $scope.noDuesReportresponse = []
        var getNoduesReport = function(){
            serverUtilityService.getWebService(FrontendExitService.getUrl('noDuesReport'))
            .then(function (data) {
                $scope.noDuesReportresponse = data.data;
            });
        }
        getNoduesReport()
        $scope.noDuesReport = function () {
            console.log( $scope.noDuesReportresponse)
            var empStatusHashMap = utilityService.buildEmployeeStatusHashMap()
            var finalArray = [];
            var column = ['Emp Name', 'Emp Code'];
            angular.forEach($scope.noDuesReportresponse[0].all_exit_clearances_detail, function(item){
                column.push(item)
            })
            finalArray.push(column);
            console.log(column)

            angular.forEach($scope.noDuesReportresponse, function (item, key) {
                var tempArray = new Array();
                tempArray.push(item.employee_preview.personal_profile_first_name + ' ' + item.employee_preview.personal_profile_last_name);
                tempArray.push(item.employee_preview.personal_profile_employee_code);
                angular.forEach(item.all_exit_clearances_detail, function(value){
                    if(item.non_assign_exit_clearances_detail.includes(value)){
                        tempArray.push('N/A');
                    }else{
                        var status = empStatusHashMap[item.assign_exit_clearances_detail[value]]
                        tempArray.push(status);
                    }
                })
                finalArray.push(tempArray);
            });

            if (finalArray.length > 1) {
                utilityService.exportToCsv(finalArray, 'exit_csv.csv');
            }
        };
    }
]);