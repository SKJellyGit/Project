app.controller('ManagerAttendanceController', [
    '$scope','$modal', '$mdSidenav', '$mdDialog', '$timeout', '$rootScope', '$window', 'TimeOffService', 'ManagerAttendanceService', 'DashboardService', 'utilityService', 'ServerUtilityService', 'Upload','prebuiltReportsService',
    function ($scope,$modal, $mdSidenav, $mdDialog, $timeout, $rootScope, $window, timeOffService, ManagerAttendanceService, DashboardService, utilityService, serverUtilityService, Upload, prebuiltReportsService) {
        
        var modifyReqId = null,
            days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        $scope.mapToday = new Date();
        $scope.dateToday = null;
        $scope.updatePagination = true;
        $scope.showBreakColumn = false;
        $scope.record = {
          list:null,
          summaryData:null
        };
        $scope.view = 'list';
        $scope.monthsName = ManagerAttendanceService.getMonthsName();
        $scope.orderByField = 'category';
        $scope.selectedTicketsCount = 0;
        $scope.reqAction = null;
        $scope.minimumDate = new Date($scope.joiningDate);
        $scope.relations = null;
        $scope.regularizeEmpId = null;
        $scope.enableSubmit = 0;
        $scope.liveTracking = {
            visible:false
        };
        $scope.policy = {
            model: null
        };
        $scope.csv = {
            csv_attachment: null
        },
        $scope.selectedTickets = {};
        $scope.isCheck = {
            key: false
        };
        $scope.model = {
            nameFilter : ''
        };
        $scope.requestComment = {
            cmnt: null
        };
        $scope.isAllCheck = false;
        $scope.graphData = null;
        $scope.shiftDetailMonth = null;
        $scope.selectedDateTrack = (new Date().getTime()/1000).toFixed(0);
        $scope.myDate = new Date();
        $scope.currentTimestamp = null;
        $scope.todaysTimestamp = null;
        $scope.disableNext = true;
        $scope.previousCount = 0;
        $scope.timeAttendance = {};
        $scope.sevenDaysTimestamp = 604800;
        $scope.oneMonthTimestamp = 2592000;
        $scope.time = {
            graph: {
                visible: false
            }
        };
        $scope.monthsName = DashboardService.getMonthsName();
        $scope.currentMonth = null;
        $scope.selectedMonth = null;
        $scope.currentYear = null;
        $scope.shiftYear = null;
        $scope.shiftGraphYear = null;
        $scope.attendanceSummary = null;
        $scope.indexOf = null;
        $scope.visible = {
            attendance: false
        };
        $scope.liveTrack = null;
        $scope.orderByField = 'category';
        $scope.initDate = {
            from: null,
            to: null
        };
        $scope.initAttendanceDate = {
            from: null,
            to: null
        };
        $scope.filterRequestStatusValue = {
            value: 7
        };
        $scope.filterAttendanceStatusValue = {
            value: 7
        };
        $scope.trackerMap = ManagerAttendanceService.buildTrackerMap();
        $scope.sortBy = function (propertyName) {
            $scope.allAttendance.reverse = ($scope.allAttendance.propertyName === propertyName) ? !$scope.allAttendance.reverse : false;
            $scope.allAttendance.propertyName = propertyName;
        };
        $scope.year = {
            list: utilityService.getYearList(2020),
            selected: null
        }
        $scope.month = {
            list: {
                1: "Jan",
                2: "Feb",
                3: "Mar",
                4: "Apr",
                5: "May",
                6: "June",
                7: "July",
                8: "Aug",
                9: "Sept",
                10: "Oct",
                11: "Nov",
                12: "Dec"
            },
            selected: null
        }
        $scope.time = {
            year : new Date().getFullYear(),
            month : new Date().getMonth() + 1,
            startDate: new Date(new Date(utilityService.dateToString(new Date(), '/', 'ymd') + ' 00:00:00').setDate(new Date().getDate()-1)),
            endDate: new Date(utilityService.dateToString(new Date(), '/', 'ymd') + ' 00:00:00'),
            endDateMax: new Date(new Date(new Date(utilityService.dateToString(new Date(), '/', 'ymd') + ' 00:00:00').setMonth(new Date().getMonth()+2)).setDate(0))
        };
        $scope.setEndDateMaxvalue = function(date, months) {
            $scope.time.endDateMax =  new Date(new Date(new Date(date).setMonth(new Date(date).getMonth()+months+1)).setDate(0));
        };
        var todaysDate = function () {
            $scope.currentTimestamp = Math.floor(Date.now() / 1000);
            $scope.todaysTimestamp = Math.floor(Date.now() / 1000);
            $scope.dateToday = new Date();
            $scope.currentMonth = $scope.dateToday.getMonth() + 1;
            $scope.shiftDetailMonth = $scope.dateToday.getMonth() + 1;
            $scope.thisMonth = $scope.dateToday.getMonth() + 1;
            $scope.selectedMonth = $scope.dateToday.getMonth() + 1;
            $scope.currentYear = $scope.dateToday.getFullYear();
            $scope.shiftYear = $scope.currentYear;
            $scope.shiftGraphYear = $scope.dateToday.getFullYear();
        };
        todaysDate();
        var getMonth = function (timeStamp) {
            var date = new Date(timeStamp * 1000),
                month = date.getMonth() + 1,
                year = date.getFullYear();

            if (month < $scope.currentMonth || month > $scope.currentMonth 
                || year < $scope.currentYear || year > $scope.currentYear) {
                $scope.shiftDetailMonth = month;
                $scope.shiftGraphYear = year;
            }
        };
        $scope.$on('reporteeChange', function () {   
            $scope.updatePagination = false;
            getAttendanceSummary();
            // getAttendanceGraphSummary();
            getAllAttendance();
            getLiveTrack();
            $scope.updatePagination = true;
        });
        var getAttendanceGraphSummary = function () {
            var url = ManagerAttendanceService.getUrl('attendanceGraph') + $scope.shiftDetailMonth + "_" + $scope.shiftGraphYear,
                params = {
                    rel_id: $scope.relationship.primary.model._id,
                    direct_reportee: $scope.relationship.secondary.model.slug == 'direct_reportee' ? true : false,
                    permission: $scope.taPermission.action.current.permission_slug
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.graphData = data.data;
                    if ($scope.graphData) {
                        makeGraphData($scope.graphData);
                    }
                });
        };
        //getAttendanceGraphSummary();
        var disableNext = function () {
            $scope.disableNext = $scope.currentTimestamp >= $scope.todaysTimestamp ? true : false;
        };
        $scope.getWeeklyGraphData = function (action) {
            $scope.time.graph.visible = false;
            if (action == 'previous') {
                $scope.previousCount += 1;
                $scope.currentTimestamp = $scope.currentTimestamp - $scope.sevenDaysTimestamp;
                disableNext();
            } else {
                $scope.previousCount -= 1;
                $scope.currentTimestamp = $scope.currentTimestamp + $scope.sevenDaysTimestamp;
                disableNext();
            }
            getMonth($scope.currentTimestamp);
            getAttendanceGraphSummary();
        };
        $scope.getMonthWiseGraphDetail = function (action) {
            // $scope.time.graph.visible = false;
            if (action == 'previous') {
                if ($scope.shiftDetailMonth == 1) {
                    $scope.shiftDetailMonth = 13;
                    $scope.shiftGraphYear = $scope.shiftGraphYear - 1;
                }
                $scope.currentTimestamp = $scope.currentTimestamp - $scope.oneMonthTimestamp;
                disableNext();
                $scope.shiftDetailMonth = $scope.shiftDetailMonth - 1;
            } else {
                if ($scope.shiftDetailMonth == 12) {
                    $scope.shiftDetailMonth = 0;
                    $scope.shiftGraphYear = $scope.shiftGraphYear + 1;
                }
                if ($scope.shiftDetailMonth + 1 == $scope.thisMonth) {
                    $scope.currentTimestamp = $scope.todaysTimestamp;
                } else {
                    $scope.currentTimestamp = $scope.currentTimestamp + $scope.oneMonthTimestamp;
                }
                disableNext();
                $scope.shiftDetailMonth = $scope.shiftDetailMonth + 1;
            }
            $scope.checkPreviousMonths(new Date($scope.shiftGraphYear, $scope.shiftDetailMonth - 1, 1).getTime(),'mSummaryGraph');
            // getAttendanceGraphSummary();
            getAllAttendance();
        };
        var makeGraphData = function () {
            var arr = [],
                aut = [],
                brk = [];

            angular.forEach($scope.graphData.work_hours, function (val, key) {
                if (val <= 0) {
                    arr.push(null);
                } else {
                    var amt = val - $scope.graphData.break_duration[key];
                    arr.push(parseFloat(amt.toFixed(2)));
                }
            });
            angular.forEach($scope.graphData.break_duration, function (val, key) {
                if (val <= 0) {
                    brk.push(null);
                } else {
                    brk.push($scope.graphData.break_duration[key]);
                }
            });
            angular.forEach($scope.graphData.autoclockout, function (val, key) {
                if (val <= 0) {
                    aut.push(null);
                } else {
                    var auto = val - $scope.graphData.break_duration[key];
                    aut.push(parseFloat(auto.toFixed(2)));
                }
            });
            $scope.time.graph.visible = true;
            $scope.timeAttendance.graphDates = $scope.graphData.date;
            $scope.timeAttendance.categories = [
                {
                    name: 'Break Duration',
                    data: brk
                }, 
                {
                    name: 'Work Hour',
                    data: arr
                }, 
                {
                    name: 'Auto ClockOut',
                    data: aut
                }];
        };
        
        var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true,
                collection_key: 'employee_preview'
            }
        ];
        
        var getAllAttendance = function () {
            var url = ManagerAttendanceService.getUrl('allAtendance') + $scope.shiftDetailMonth + "_" + $scope.shiftGraphYear,
                params = {
                    rel_id: $scope.relationship.primary.model._id,
                    direct_reportee: $scope.relationship.secondary.model.slug == 'direct_reportee' ? true : false,
                    permission: $scope.taPermission.action.current.permission_slug
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.allAttendance = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.allAttendance, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    if ($scope.isCheck.key || $scope.selectedTicketsCount > 0) {
                        var flag = $scope.isCheck.key ? true : false;
                        $scope.checkAll(flag);
                    }
                });
        };
        //getAllAttendance();
        $scope.manageCount = function(item) {
            angular.forEach(item, function (val, key) {                
                if(val.isCheck){
                   $scope.enableSubmit -= 1; 
                }
            });
        };
        $scope.updateCount = function (item) {
            if (angular.isDefined(item)) {
                if(item.isCheck) {
                    $scope.enableSubmit += 1; 
                } else {
                    $scope.enableSubmit -= 1; 
                }  
            };
            $scope.selectedTicketsCount = 0;
            angular.forEach($scope.allAttendance, function (val, key) {
                if (val.check) {
                    $scope.selectedTicketsCount += 1;
                }
            });
        };
        var toggleModal = function (id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                })
                : $('#' + id).modal('hide');
        };
        $scope.unCheckCount = function () {
            $scope.selectedTicketsCount = 0;
            angular.forEach($scope.allAttendance, function (val, key) {
                if (val.isCheck) {
                    val.isCheck = false;
                }
            });
        };
        $scope.checkAllRequests = function (flag) {
            $scope.isAllCheck = !$scope.isAllCheck;
            $scope.enableSubmit = 0;
            if ($scope.isAllCheck) {
                angular.forEach($scope.allAttendance, function (row, index) {
                    if(row.total_pending_request != 0) {
                        row.check = true;
                    }
                    angular.forEach(row.pending_request, function (value, key) {
                        value.isCheck = true;
                        $scope.enableSubmit += 1;
                    });
                });
            } else {
                angular.forEach($scope.allAttendance, function (row, index) {
                    angular.forEach(row.pending_request, function (value, key) {
                        value.isCheck = false;
                        $scope.enableSubmit = 0;
                    });
                });
            }
        };
        $scope.checkAll = function (flag) {
            angular.forEach($scope.allAttendance, function (row, index) {
                if(row.total_pending_request != 0 ){
                    row.check = flag;
                }
            });
            $scope.isCheck.key = flag;
            $scope.updateCount();
        };
        var successCallback = function (data, section, isAdded) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            toggleModal('approve', false);
            $scope.updateReqList();
        };
        var errorCallback = function (data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else if(data.status === 500) {
                utilityService.resetAPIError(true, data.data.message, section); 
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        var successErrorCallback = function (data, section, isAdded) {
            section = angular.isDefined(section) ? section : "approveReject";
            isAdded = angular.isDefined(isAdded) ? isAdded : false;
            data.status === "success" ?
                successCallback(data, section, isAdded) : errorCallback(data, section);
        };
        $scope.updateReqList = function () {
            $scope.isCheck.key = false;
            $scope.unCheckCount();
            getAllAttendance();
        };
        $scope.approveRequests = function (action) {
            var ids = [];
            angular.forEach($scope.allAttendance, function (val, key) {
                if (val.check) {
                    angular.forEach(val.pending_request, function (value, key) {
                        if (value.isCheck) {
                            ids.push(value._id);
                        }
                    });
                }
            });
            var url = ManagerAttendanceService.getUrl('bulkAction'),
                payload = {
                    request_ids: ids,
                    type: 'regularization_request',
                    status: action == 'approve' ? 10 : 11,
                    comment: $scope.requestComment.cmnt
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data);
                });
        };
        $scope.bulkApproveReject = function (status) {
            $scope.reqAction = (status == 2) ? 'Approve' : 'Reject';
            toggleModal('approve',true);
        };
        $scope.acceptRejectRequest = function (item, status) {
            var id = utilityService.getValue(item, '_id') && angular.isObject(item._id) ? item._id.$id : item._id,
                url = ManagerAttendanceService.getUrl('reject') + "/" + item.action_id,
                payload = {
                    comment: status == '9' ? 'rejected' : null,
                    status: status
                };

            serverUtilityService.putWebService(url, payload)
                    .then(function (data) {
                        successErrorCallback(data, 'helpdesk');
                    });
        };
        var getAttendanceSummary = function () {
            var url = ManagerAttendanceService.getUrl('attendanceSummary') + $scope.selectedMonth + "_" + $scope.shiftYear,
                params = {
                    rel_id: $scope.relationship.primary.model._id,
                    direct_reportee: $scope.relationship.secondary.model.slug == 'direct_reportee' ? true : false,
                    permission: $scope.taPermission.action.current.permission_slug
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.attendanceSummary = data.data;
                    $timeout(function () {
                        $scope.visible.attendance = true;
                    }, 1000);
                });
        };
        //getAttendanceSummary();
        $scope.getSelectedEmps = function (item, index) {
            $scope.indexOf = index;
            var url = ManagerAttendanceService.getUrl('getEmps'),
                payload = {
                    noshow_employee: item.noshow_emp,
                    onleave_employee: item.onleave_emp,
                    present_employee: item.present_emp,
                    weekoff_employee: item.weekoff_emp,
                    holiday_employee: item.holiday_emp
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    $scope.attendanceSummary[index].noshow_employees = data.data.noshow_employee;
                    $scope.attendanceSummary[index].onleave_employees = data.data.onleave_employee;
                    $scope.attendanceSummary[index].present_employees = data.data.present_employee;
                    $scope.attendanceSummary[index].weekoff_employees = data.data.weekoff_employee;
                    $scope.attendanceSummary[index].holiday_employee = data.data.holiday_employee;
                    $timeout(function () {
                        toggleModal('empSummary', true);
                    }, 500);
                });            
        };
        var updateLiveData = function (data){           
            angular.forEach(data,function (val,key){                
                if(val.total_break_hours > 0){
                    $scope.showBreakColumn = true;
                    return;
                }
            });
        };
        
        var allFilterLiveObject = [
            {
                countObject: 'groupTemp',
                isGroup: true,
                collection_key: 'employee_detail'
            }
        ]
        
        var getLiveTrack = function () {            
            $scope.liveTracking.visible = false;
            $scope.liveTrack = null;
            var url = ManagerAttendanceService.getUrl('liveTrack')+"/"+$scope.selectedDateTrack,
                params = {
                    rel_id: $scope.relationship.primary.model._id,
                    direct_reportee: $scope.relationship.secondary.model.slug == 'direct_reportee' ? true : false
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    updateLiveData(data.data);
                    $scope.liveTrack = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.liveTrack, allFilterLiveObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.liveTracking.visible = true;
                    $scope.taPermission.action.isLiveTrackerVisible = true;
                });
        };
        
        $scope.previousRecords = function(date){
           $scope.taPermission.action.isLiveTrackerVisible = false;
           $scope.myDate = date;
           $scope.selectedDateTrack = (new Date(date).getTime()/1000).toFixed(0);
           getLiveTrack();
        };
        
        //getLiveTrack();
        $scope.refresh = function () {
            getLiveTrack();
        };
        $scope.getMonthWiseDetail = function (action) {
            if (action == 'previous') {
                if ($scope.selectedMonth == 1) {
                    $scope.selectedMonth = 13;
                    $scope.shiftYear = $scope.shiftYear - 1;
                }
                $scope.selectedMonth = $scope.selectedMonth - 1;
            } else {
                if ($scope.selectedMonth == 12) {
                    $scope.selectedMonth = 0;
                    $scope.shiftYear = $scope.shiftYear + 1;
                }
                $scope.selectedMonth = $scope.selectedMonth + 1;
            }
            $scope.checkPreviousMonths(new Date($scope.shiftYear, $scope.selectedMonth - 1, 1).getTime(),'mSummary');
            getAttendanceSummary();
            getAllAttendance();
        };
        $scope.initRequestFilter = function (record) {
            if ($scope.filterRequestStatusValue) {
                var requested_on = utilityService.getDefaultDate(record.requested_on, false, true),
                    date2 = new Date(),
                    timeDiff = Math.abs(date2.getTime() - requested_on.getTime()),
                    diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if ($scope.filterRequestStatusValue.value < diffDays) {
                    return;
                }
            }
            return record;
        };
        $scope.initAttendenceFilter = function (record) {
            if ($scope.filterRequestStatusValue) {
                var requested_on = utilityService.getDefaultDate(record.date, false, true),
                    date2 = new Date(),
                    timeDiff = Math.abs(date2.getTime() - requested_on.getTime()),
                    diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if ($scope.filterAttendanceStatusValue.value < diffDays) {
                    return;
                }
            }
            return record;
        };
        $scope.changeView = function (action) {
            $scope.view = (action == 'list') ? 'list' : 'graph';
        };
        $scope.bindFileChangeEvent = function (csvData, individulaFlag) {
            $scope.individulaFlag = angular.isDefined(individulaFlag) ? true : false;
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    var data = {
                        ta_csv: csvData.csv_attachment,
                    };
                    $scope.upload(csvData);
                    $scope.isUploaded = true;
                });
            }, 100);
        };
        var uploadProgressCallback = function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };
        $scope.upload = function (file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                Upload.upload({
                    url: ManagerAttendanceService.getUrl('uploadCsv'),
                    headers: {
                        'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                    },
                    data: {'ta_csv': file},
                }).then(function (response) {
                    successErrorCallback(response.data, 'helpdesk');
                }, function (response) {
                    successErrorCallback(response.data, 'helpdesk');
                }, function (evt) {
                    uploadProgressCallback(evt);
                });
            }
        };
        $scope.openSideNavPanel = function () {
            $mdSidenav('left').open();
        };
        $scope.closeSideNavPanel = function () {
            $mdSidenav('left').close();
        };
        $scope.linkAnchors = function () {
            $('ul.nav a').click(function () {
                var path = $(this).attr('href');
                if (path != '#') {
                    window.location = path;
                }
            });
        };
        //js for md-menu-close
        $scope.noop = function(event){
            event.stopImmediatePropagation();
        };
        $scope.closeSubMenu = function(event){
            $mdMenu.hide();
        };
        $scope.resetFilter = function (pageName) {
            $scope.resetAllTypeFilters();
            $scope.updatePaginationSettings(pageName);
        };
        $(document).ready(function () {
            $timeout(function () {
                $('.popoverOption').popover({trigger: "hover"});
            }, 1000);
        });

        /********** Start Time Attendance Permission Section **********/
        $scope.taPermission = {
            action: {
                list: [],
                current: null,
                hasPermission: false,
                isLiveTrackerVisible: false
            }
        };
        var extractReportFromPermissionList = function(data) {
            var permissionSlug = 'can_view_my_team_attendance';

            angular.forEach(data.data, function(value, key) {
                value._id = angular.isObject(value._id) ? value._id.$id : value._id;
                if(value.permission_slug.indexOf('report') >= 0) {
                    data.data.splice(key, 1);
                }
                
                if(value.permission_slug === permissionSlug) {
                    $scope.taPermission.action.hasPermission = true;
                    $scope.taPermission.action.isLiveTrackerVisible = true;
                }
            });
        };
        var getActionListCallback = function(data) {
            extractReportFromPermissionList(data);            
            $scope.taPermission.action.list = data.data;
            $scope.taPermission.action.current = data.data.length ? data.data[0] : null;
            if(data.data.length) {                        
                getAllAttendance();
                getAttendanceSummary();
                // getAttendanceGraphSummary();
                if($scope.taPermission.action.isLiveTrackerVisible) {
                    getLiveTrack();
                }
            } else {
                $location.url('dashboard/no-permission');
            }
        };
        var getActionList = function() {
            var url = ManagerAttendanceService.getUrl('actionNonAdmin') + "/time_attendance/" + $scope.relationship.primary.model._id
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    getActionListCallback(data);
                });
        };
        getActionList();
        $scope.changeAction = function(item) {
            $scope.taPermission.action.current = item;
            getAllAttendance();
            getAttendanceSummary();
            // getAttendanceGraphSummary();
        };
        var hasMyTeamTimeAttendancePermission = function(permissionName) {
            var isGiven = false;

            angular.forEach($scope.taPermission.action.list, function(value, key) {
                if(!isGiven && value.permission_slug === permissionName) {
                    isGiven = true;
                }                
            });

            return isGiven;
        };
        $scope.isActionView = function() {
            return hasMyTeamTimeAttendancePermission('can_view_my_team_attendance');
            //var permissionSlug = 'can_view_my_team_attendance';
            //return utilityService.getValue($scope.taPermission.action.current, 'permission_slug') === permissionSlug;
        };
        $scope.isActionApproveReject = function() {
            return hasMyTeamTimeAttendancePermission('can_approve_reject_attendance');
            //var permissionSlug = 'can_approve_reject_attendance';
            //return utilityService.getValue($scope.taPermission.action.current, 'permission_slug') === permissionSlug;
        };
        $scope.isActionRegularizeOnBehalf = function() {
            return hasMyTeamTimeAttendancePermission('can_regularize_on_behalf');
        };
        $scope.isVisibleMap = function() {
            var permission = ['can_view_field_force_tracking', 'can_assign_view_beats'],
                hasPermissions = $scope.taPermission.action.list.filter(function(el) {
                    return permission.includes(el.permission_slug);
                });
            return hasPermissions.length === permission.length ? true : false;
        };
        /********** End Time Attendance Permission Section **********/
        
        /********** Start Attendance Regularization From Myteam **********/ 
        var getEmpId = function () {
            $scope.loginEmpId = $scope.employeeId ? $scope.employeeId : $scope.user.loginEmpId;
        };
        getEmpId();
        var broadCastEvent = function (event, params) {
            $rootScope.$broadcast(event, {
                params: params
            });
        };        
        $scope.reguRequest = function (item) {
            $timeout(function () {
                $('#policies').modal('hide');
            }, 500);            
            item.calReguDate = $scope.calReguDate;
            item.isEmployee = false;
            item.empId = $scope.regularizeEmpId;
            item.relationship = $scope.relationship.primary.model._id;
            item.date = $scope.myDate;
            broadCastEvent('request-regu', item);
        };
        var getRegularizationMethods = function () {        
            var url = DashboardService.getUrl('regularizationReq')+"/"+$scope.regularizeEmpId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.regularizationRequests = data.data;
                });
        };
        $scope.regularizeOneDay = function (item) {
            $scope.regularizeEmpId = item.employee_detail._id;
            $scope.policy.model = null;
            getRegularizationMethods();
            $scope.modalInstance['regularizationPolicies'] = $modal.open({
                templateUrl: 'regPolicies.html',
                scope:$scope,
                size:'sm',
                windowClass:'fadeEffect'
            });
        };
        $scope.closeModal = function(instance) {
            $scope.modalInstance[instance].dismiss();
        };
        $scope.checkInDetails = function (item){
            $scope.checkInList = [];
            var emp_id = item.employee_detail._id;
            var cDate  = utilityService.dateToString($scope.selectedDateTrack*1000,'-');
            var url = ManagerAttendanceService.getUrl('checkInDetails');
            var params = {
              'date':cDate,
              'id':emp_id
            };
            serverUtilityService.getWebService(url,params)
                    .then(function (data){
                $scope.checkInList = data.data;
            });
        };
        $scope.exportLiveTrackData = function (){
            var attrList = new Array("Emp Name","Emp Code","Clock In Time", "Clock In Address","Clock Out Time", "Clock Out Address","Total Break Hours","Work Duration","Status");
                $scope.report = {
                    content: new Array(attrList),
                };
                angular.forEach($scope.record.list,function(value,key){
                var array = new Array();
                array.push(value.employee_detail ? value.employee_detail.full_name : "N/A");
                array.push(value.employee_detail ? value.employee_detail.personal_profile_employee_code : "N/A");
                array.push(value.in_time ? value.in_time : "N/A");
                array.push(utilityService.getInnerValue(value, 'check_in', 'address', "N/A"));
                array.push(value.out_time ? value.out_time : "N/A");
                array.push(utilityService.getInnerValue(value, 'check_out', 'address', "N/A"));
                array.push(value.total_break_hours ? value.total_break_hours : "N/A");
                array.push(value.total_hours_seconds ? value.total_hours_seconds : "N/A");
                array.push(value.status ? value.status : "N/A");
                $scope.report.content.push(array);
                });
                var reportName = "Employees Attendance Report.csv";
                if($scope.report.content.length > 1){
                    utilityService.exportToCsv($scope.report.content, reportName);
                }
        };
        $scope.exportSummaryData = function (){
            var attrList = new Array("Emp Name","Emp Code","Total Working Days","Total Present Days","Average In Time","Average Out Time","Average Working Hours");
                $scope.report = {
                    content: new Array(attrList),
                };
                angular.forEach($scope.record.summaryData,function(value,key){
                var array = new Array();
                array.push(value.employee_preview ? value.employee_preview.full_name : "N/A");
                array.push(value.employee_preview ? value.employee_preview.employee_id : "N/A");
                array.push(value.working_days ? value.working_days : "N/A");
                array.push(value.total_present_day ? value.total_present_day : "N/A");
                array.push(value.avg_in_time ? value.avg_in_time : "N/A");
                array.push(value.avg_out_time ? value.avg_out_time : "N/A");
                array.push(value.total_working_hour ? value.total_working_hour : "N/A");
                $scope.report.content.push(array);
                });
                var reportName = "Employees Attendance Summary Report.csv";
                if($scope.report.content.length > 1){
                    utilityService.exportToCsv($scope.report.content, reportName);
                } 
        };

        /***********Start: Google Map Integration*************/
        $scope.getMapView = function(emp, ismodalOpen) {
            if(!emp || !emp._id || emp.disableClick) {
                return false;
            }
            emp.disableClick = true;
            if(!ismodalOpen) {
                $scope.trackerMap = ManagerAttendanceService.buildTrackerMap();
            } else {
                $scope.trackerMap.visible = false;
            }
            $scope.trackerMap.emp = emp;
            $scope.trackerMap.from_date = new Date($scope.trackerMap.to_date.getTime()-24*3600*1000);
            var nextToDate = new Date($scope.trackerMap.to_date.getTime()+24*3600*1000);
            var url = ManagerAttendanceService.getUrl('googleMapData') + '/' + emp._id + '/' + ($scope.trackerMap.to_date.getTime()/1000) + '/' + (nextToDate.getTime()/1000);
            // var url = 'http://prod4.hrms.com/data/my_team/store-track.json';
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.trackerMap.data = ManagerAttendanceService.buildMapdata(utilityService.getValue(data, 'data', []));
                emp.disableClick = false;
                $scope.trackerMap.visible = true;
                if(!ismodalOpen) {
                    $scope.openModal('googleMapTracker','google-map-tracker-tmpl.html', 'lg');
                }
            });
        }
        /***********End: Google Map Integration*************/

        /***********Start: Angular Model*************/
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'sm';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                size: size,
                backdrop: 'static'
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
            if($scope.trackerMap.data.length) {
                $scope.trackerMap.data = [];
                $scope.trackerMap.visible = false;
            }
        };
        /***********End: Angular Model*************/

        /**** Start: Employee Selfie Url Section ****/
        var employeeSelfieUrlCallback = function (event, data) {
            if (utilityService.getValue(data, 'status') === 'success') {
                utilityService.getInnerValue(data, 'data','url')
                    ? $window.open(utilityService.getInnerValue(data, 'data', 'url'))
                    : showAlert(event, 'Employee Selfie',  'It seems that there is no selfie available');
            } else {
                showAlert(event, 'Employee Selfie',  utilityService.getValue(data, 'message', 'It seems that there is some error in displaying selfie'));
            }            
        };
        $scope.getEmployeeSelfieUrl = function (event, item, type) {
            var url = ManagerAttendanceService.getUrl('selfieUrl') + "/" 
                    + utilityService.getInnerValue(item, 'employee_detail', '_id') + "/"
                    + $scope.selectedDateTrack + "/" + type;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    employeeSelfieUrlCallback(event, data);
                });
        };
        /**** End: Employee Selfie Url Section ****/

        var showAlert = function(ev, title, textContent) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(textContent)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('-');
        };
        $scope.downloadReport = function(){
            var url = ManagerAttendanceService.getUrl('reportInOut') + '/?start_date=' + ($scope.formatDate($scope.time.startDate)) + '&end_date=' + ($scope.formatDate($scope.time.endDate))
            params = {
                rel_id: $scope.relationship.primary.model._id,
                direct_reportee: $scope.relationship.secondary.model.slug == 'direct_reportee' ? true : false
            };
            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    var object = prebuiltReportsService.buildInOutAttendenceReportList(data.data, [])
                    var finalObj = prebuiltReportsService.bulidFinalTaList(object.content, object.listWithoutHeader);
                    utilityService.exportToCsv(finalObj.content, 'My Team Clock in/Clock out Report.csv');
                })
                
            };
        
    }
]);