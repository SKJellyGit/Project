app.controller('AdminAttendanceController', [
    '$scope','$modal', '$mdSidenav','ManagerAttendanceService', '$timeout', '$window', '$location', '$rootScope', 'TimeOffService', 'AdminAttendanceService', 'DashboardService', 'utilityService', 'ServerUtilityService', 'Upload', '$mdDialog',
    function ($scope, $modal, $mdSidenav, ManagerAttendanceService, $timeout, $window, $location, $rootScope, timeOffService, AdminAttendanceService, DashboardService, utilityService, serverUtilityService, Upload, $mdDialog) {
        var modifyReqId = null,
            parentIndex, childIndex = null,
            alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
                'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            days = [
                'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
            ];
        
        $scope.mapToday = new Date();
        $scope.dateToday = null;        
        $scope.view = 'list';
        $scope.totalRecords = null;
        $scope.indexOf = null;
        $scope.minDate = new Date($scope.joiningDate);
        $scope.myDate = new Date();
        $scope.regularizeEmpId = null;
        $scope.policy = {
            model: null
        };
        $scope.errCount = 0;
        $scope.alphIndex = null;
        $scope.monthsName = AdminAttendanceService.getMonthsName();
        $scope.orderByField = 'category';
        $scope.selectedTicketsCount = 0;
        $scope.reqAction = null;
        $scope.enableSubmit = 0;
        $scope.csv = {
            attendanceDate:null,
            csv_attachment: null
        };        
        $scope.selectedTickets = {};
        $scope.isCheck = {
            key:false,
            liveTrack: false
        };

        $scope.requestComment = {
            cmnt: null
        };
        $scope.isAllCheck = false;
        $scope.graphData = null;
        $scope.currentMonth = null;
        $scope.currentGraphMonth = null;
        $scope.currentGraphYear = null;
        $scope.selectedDateTrack = (new Date().getTime()/1000).toFixed(0);
        $scope.currentTimestamp = null;
        $scope.todaysTimestamp = null;
        $scope.disableNext = true;
        $scope.showBreakColumn = false;
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
        $scope.attendanceSummary = null;
        $scope.visible = {
            attendance : false
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
        $scope.allAttendance = [];
        $scope.filteredItems = {
            list: [],
            liveTrack: []
        };
        $scope.isBulkRegularization = false;
        $scope.selectedTicketsCountLiveTracker = 0;

        $scope.trackerMap = AdminAttendanceService.buildTrackerMap();
        $scope.attendanceRecord = null;
        
        var todaysDate = function () {
            $scope.currentTimestamp = Math.floor(Date.now() / 1000);
            $scope.todaysTimestamp = Math.floor(Date.now() / 1000);
            $scope.dateToday = new Date();
            $scope.currentMonth = $scope.dateToday.getMonth() + 1;
            $scope.currentGraphMonth = $scope.dateToday.getMonth() + 1;
            $scope.thisMonth = $scope.dateToday.getMonth() + 1;
            $scope.selectedMonth = $scope.dateToday.getMonth() + 1;
            $scope.currentYear = $scope.dateToday.getFullYear();
            $scope.shiftGraphYear = $scope.dateToday.getFullYear();
            $scope.shiftYear = $scope.currentYear;
        };
        todaysDate();
        var getMonth = function (timeStamp) {
            var date = new Date(timeStamp * 1000),
                month = date.getMonth() + 1,
                year = date.getFullYear();

            if (month < $scope.currentMonth || month > $scope.currentMonth || year < $scope.currentYear || year < $scope.currentYear) {
                $scope.currentGraphMonth = month;
                $scope.currentGraphYear = year;
            }
        };
        var getAttendanceGraphSummary = function () {
            var url = AdminAttendanceService.getUrl('attendanceGraph') + $scope.currentGraphMonth + "_" + $scope.shiftGraphYear,
                params = {
                    permission: $scope.taPermission.action.current.permission_slug
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.graphData = data.data;
                    makeGraphData($scope.graphData);
                });
        };
        //getAttendanceGraphSummary();
        var disableNext = function () {
            $scope.disableNext = ($scope.currentTimestamp >= $scope.todaysTimestamp) ? true : false;
        };
        $scope.getWeeklyGraphData = function (action) {
            $scope.time.graph.visible = false;
            if (action == 'previous') {
                $scope.previousCount += 1;
                $scope.currentTimestamp = $scope.currentTimestamp - $scope.sevenDaysTimestamp;
            } else {
                $scope.previousCount -= 1;
                $scope.currentTimestamp = $scope.currentTimestamp + $scope.sevenDaysTimestamp;
            }
            disableNext();
            getMonth($scope.currentTimestamp);
            getAttendanceGraphSummary();
        };
        $scope.getMonthWiseGraphDetail = function (action) {
            $scope.time.graph.visible = false;
            if (action == 'previous') {
                if ($scope.currentGraphMonth == 1) {
                    $scope.currentGraphMonth = 13;
                    $scope.shiftGraphYear = $scope.shiftGraphYear - 1;
                }
                $scope.currentTimestamp = $scope.currentTimestamp - $scope.oneMonthTimestamp;
                disableNext();
                $scope.currentGraphMonth = $scope.currentGraphMonth - 1;
                // getAttendanceGraphSummary();
                getAllAttendance();
            } else {
                if ($scope.currentGraphMonth == 12) {
                    $scope.currentGraphMonth = 0;
                    $scope.shiftGraphYear = $scope.shiftGraphYear + 1;
                }
                if ($scope.currentGraphMonth + 1 == $scope.thisMonth) {
                    $scope.currentTimestamp = $scope.todaysTimestamp;
                } else {
                    $scope.currentTimestamp = $scope.currentTimestamp + $scope.oneMonthTimestamp;
                }
                disableNext();
                $scope.currentGraphMonth = $scope.currentGraphMonth + 1;
                // getAttendanceGraphSummary();
                getAllAttendance();
            }
            $scope.checkPreviousMonths(new Date($scope.shiftGraphYear, $scope.currentGraphMonth - 1, 1).getTime(),'aSummaryGraph');
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
                }, {
                    name: 'Work Hour',
                    data: arr
                }, {
                    name: 'Auto ClockOut',
                    data: aut
                }];
        };
        var allFilterObject = [{countObject: 'group',isGroup: true,collection_key: 'employee_preview'}];
        var getAllAttendance = function () {
            var url = AdminAttendanceService.getUrl('allAtendance') + $scope.currentGraphMonth + "_" + $scope.shiftGraphYear,
                params = {
                    permission: $scope.taPermission.action.current.permission_slug
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.allAttendance = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.allAttendance, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    if($scope.isCheck.key || $scope.selectedTicketsCount >0){
                        var flag = $scope.isCheck.key?true:false;
                        $scope.checkAll(flag);
                    }
                });
        };
        //getAllAttendance();
        $scope.manageCount = function(item){
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
            angular.forEach(utilityService.getValue($scope.filteredItems, 'allAttendance', []), function (val, key) {
                if (val.check) {
                    $scope.selectedTicketsCount += 1;
                }
            });
        };
        $scope.unCheckCount = function () {
            $scope.selectedTicketsCount = 0;            
            angular.forEach(utilityService.getValue($scope.filteredItems, 'allAttendance', []), function (val, key) {
                if (val.check) {
                    val.check = false;
                }
            });
        };
        $scope.checkAllRequests = function () {
            $scope.isAllCheck = !$scope.isAllCheck;
            $scope.enableSubmit = 0;
            if ($scope.isAllCheck) {
                angular.forEach(utilityService.getValue($scope.filteredItems, 'allAttendance', []), function (row, index) {
                    if(row.total_pending_request != 0) {
                        row.check = true;
                    }
                    angular.forEach(row.pending_request, function (value, key) {
                        value.isCheck = true;                        
                        $scope.enableSubmit += 1;
                    });
                });
            } else {
                angular.forEach(utilityService.getValue($scope.filteredItems, 'allAttendance', []), function (row, index) {
                    angular.forEach(row.pending_request, function (value, key) {
                        value.isCheck = false;
                       $scope.enableSubmit = 0;
                    });
                });
            }
        };
        $scope.checkAll = function (flag) {
            angular.forEach(utilityService.getValue($scope.filteredItems, 'allAttendance', []), function (row, index) {
                if(row.total_pending_request != 0){
                    row.check = flag;  
                }
            });
            $scope.isCheck.key = flag;
            $scope.updateCount();
        };
        var updateRegReqList = function () {
            $scope.allAttendance[parentIndex].pending_request.splice(childIndex, 1);
        };
        var successCallback = function (data, section, flag) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            toggleModal('approve-reject', false);
            $scope.updateReqList(flag);
        };
        var errorCallback = function (data, section) {
            if (data.status === "error") {
                alert("Error Occured:" + data.message);
                utilityService.resetAPIError(true, data.message, section);
                angular.forEach(data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        var successErrorCallback = function (data, updateList) {
            var section = angular.isDefined(section) ? section : "reguReq";
            var flag = angular.isDefined(updateList) ? updateList : false;
            data.status === "success" ?
                    successCallback(data, section, flag) : errorCallback(data, section);
        };
        $scope.updateReqList = function (flag) {
            $scope.isCheck.key = false;
            getAllAttendance();
            $scope.unCheckCount();
        };
        $scope.approveRequests = function (action) {
            var ids = [];
            angular.forEach($scope.allAttendance, function (val, key) {
                if (val.check) {
                    angular.forEach(val.pending_request, function (value, key) {
                        if (value.isCheck){
                            ids.push(value._id);
                        }
                    });
                }
            });
            var url = AdminAttendanceService.getUrl('bulkAction'),
                payload = {
                    request_ids: ids,
                    type: 'regularization_request',
                    status: action == 'approve' ? 8 : 9,
                    comment: $scope.requestComment.cmnt
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data);
                });
        };
        $scope.bulkApproveReject = function (status,form) {
            if(angular.isDefined(form)){
                utilityService.resetForm(form);   
            }
            $scope.reqAction = (status == 2) ? 'Approve' : 'Reject';
            $timeout(function (){
                toggleModal('approve-reject', true); 
            }, 100);            
        };
        $scope.acceptRejectRequest = function (item, status, pIndex, index) {
            parentIndex = pIndex;
            childIndex = index;
            var url = AdminAttendanceService.getUrl('reject') + "/" + item._id,
                payload = {
                    comment: status == '9' ? 'rejected' : null,
                    status: status
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, true);
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
                        toggleModal('adminEmpSummary',true);
                    }, 500);
                });            
        };        
        var getAttendanceSummary = function () {
            var url = AdminAttendanceService.getUrl('attendanceSummary') + $scope.selectedMonth + "_" + $scope.shiftYear,
                params = {
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
        var updateLiveData = function (data){
            angular.forEach(data,function (val,key){
                if(val.total_break_hours > 0){
                    $scope.showBreakColumn = true;
                    return;
                }
            });
        };

        var allFilterLiveObject = [{countObject: 'groupTemp',isGroup: true,collection_key: 'employee_detail'}]

        var getLiveTrack = function () {
            $scope.selectedTicketsCountLiveTracker = 0;
            $scope.taPermission.action.isLiveTrackerVisible = false;
            serverUtilityService.getWebService(AdminAttendanceService.getUrl('liveTrack')+"/"+$scope.selectedDateTrack)
                .then(function (data) {
                    updateLiveData(data.data);
                    $scope.calculateFacadeCountOfAllFilters(data.data, allFilterLiveObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.liveTrack = data.data;
                    $scope.taPermission.action.isLiveTrackerVisible = true;
                });
        };
        $scope.previousRecords = function(date){ 
           $scope.taPermission.action.isLiveTrackerVisible = false;
           $scope.myDate = date;
           $scope.selectedDateTrack = (new Date(date).getTime()/1000).toFixed(0);
           getLiveTrack();
        };
        $scope.refresh = function(){
            getLiveTrack();
        };

        $scope.attendanceSystem = {
            page_total : 0,
            page_current : 1,
            page_per : 10,
            page_first : 1,
            page_last : 1,
            totalUser:0,
            sort_by: "name",
            sort_type: "ASC",
            listVisible: false,
            "new-field":{},
            searchKey : "name",
            searchValue:"",
            pages : []
        };

        $scope.liveTrackDataList = [];


        $scope.attendanceFilter = function() {
            var filter = {};
            filter.current_page = $scope.attendanceSystem.page_current;
            filter.per_page = $scope.attendanceSystem.page_per;
            filter.sort_by = $scope.attendanceSystem.sort_by;
            filter.sort_type = $scope.attendanceSystem.sort_type;
            filter.date = $scope.selectedDateTrack
            if($scope.attendanceSystem.searchValue != "") {
                filter[$scope.attendanceSystem.searchKey] = $scope.attendanceSystem.searchValue;
            }
            return filter;
        }

        var getSolarLiveTrack = function() {
            $scope.liveTrackDataList = [];
            var url = AdminAttendanceService.getUrl('ssLiveTrack');
            var payload = $scope.attendanceFilter();
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    $scope.liveTrack = AdminAttendanceService.buildLiveTrackerList(data.data);
                    updateLiveData(data.data)
                    $scope.attendanceSystem.page_total = utilityService.getValue(data, "total");
                    $scope.attendanceSystem.page_current = utilityService.getValue(data, "current_page");
                    $scope.attendanceSystem.page_per = utilityService.getValue(data, "per_page");
                    $scope.attendanceSystem.page_first = utilityService.getValue(data, "first");
                    $scope.attendanceSystem.page_last = utilityService.getValue(data, "last");
                    $scope.attendanceSystem.pages = utilityService.setTotalPages($scope.attendanceSystem.page_last, $scope.attendanceSystem.page_current);
                    $scope.attendanceSystem.listVisible = true;
                    $scope.range = utilityService.paginationRange($scope.attendanceSystem.page_total);
                    $scope.taPermission.action.isLiveTrackerVisible = true;
                });

        }

        //getSolarLiveTrack();

        $scope.previousSolarRecords = function(date){ 
            $scope.taPermission.action.isLiveTrackerVisible = false;
            $scope.myDate = date;
            $scope.selectedDateTrack = (new Date(date).getTime()/1000).toFixed(0);
            getSolarLiveTrack();
         };

        $scope.setPage = function(pagenumber) {
            if($scope.attendanceSystem.page_current !== pagenumber && pagenumber > 0 && !(pagenumber > $scope.attendanceSystem.page_last)) {
                $scope.attendanceSystem.page_current = pagenumber;
                getSolarLiveTrack();
            }
        }

        $scope.setPerpage = function(val) {
            $scope.attendanceSystem.page_current = 1;
            $scope.attendanceSystem.page_per = val;
            getSolarLiveTrack();
        }
        
        
        $scope.getMonthWiseDetail = function (action) {
            if (action == 'previous') {
                if ($scope.selectedMonth == 1) {
                    $scope.selectedMonth = 13;
                    $scope.shiftYear = $scope.shiftYear - 1;
                }
                $scope.currentTimestamp = $scope.currentTimestamp - $scope.oneMonthTimestamp;
                $scope.selectedMonth = $scope.selectedMonth - 1;                
            } else {
                if ($scope.selectedMonth == 12) {
                    $scope.selectedMonth = 0;
                    $scope.shiftYear = $scope.shiftYear + 1;
                }
                $scope.selectedMonth = $scope.selectedMonth + 1;
            }
            $scope.checkPreviousMonths(new Date($scope.shiftYear, $scope.selectedMonth - 1, 1).getTime(),'aSummary');
            getAttendanceSummary();
            getAllAttendance();
        };
        $scope.initRequestFilter = function (record) {
            if ($scope.filterRequestStatusValue) {
                var requested_on = utilityService.getDefaultDate(record.requested_on, false, true);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - requested_on.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if ($scope.filterRequestStatusValue.value < diffDays){
                    return;
                }
            }

            return record;
        };
        $scope.initAttendenceFilter = function (record) {
            if ($scope.filterRequestStatusValue) {
                var requested_on = utilityService.getDefaultDate(record.date, false, true);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - requested_on.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if ($scope.filterAttendanceStatusValue.value < diffDays)
                    return;
            }

            return record;
        };
        $scope.changeView = function (action) {
            $scope.view = (action == 'list') ? 'list' : 'graph';
        };
        var getAlphaIndexing = function (resp) {
            $scope.errCount = 0;
            var data = [];
            angular.forEach(resp.data, function (val, key) {
                data.push(val);
                angular.forEach(val, function (v, k) {
                    if (angular.isDefined(v.error) && v.error.length) {
                        $scope.errCount += 1;
                    }
                });
            });
            $scope.totalRecords = data.length;
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
        var uploadSuccessCallback = function (response) {
            getAlphaIndexing(response);
            $rootScope.parsedCsv = response.data;            
            if (utilityService.getInnerValue(response, 'data', 'status') === 'success') {
                utilityService.showSimpleToast(utilityService.getInnerValue(response, 'data', 'message'));
            } else {
                $scope.openModal('previewCSV', 'preview-sheet-csv.html', 'lg');    
            }            
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
        $scope.showDatePicker = function (){
            $scope.openModal('attendance', 'attendance.tmpl.html');
        };
        $scope.upload = function (file, errFiles) {
            $scope.closeModal('attendance');
            if($scope.csv.attendanceDate) {
                $scope.f = file;
                $scope.errFile = errFiles && errFiles[0];
                if (file) {
                    Upload.upload({
                        url: AdminAttendanceService.getUrl('uploadCsv'),
                        headers: {
                            'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                        },
                        data: {
                            'ta_csv': file,
                            'uploaded_to_date':utilityService.dateToString($scope.csv.attendanceDate)
                        },
                    }).then(function (response) {
                        uploadSuccessCallback(response);
                    }, function (response) {
                        successErrorCallback(response.data, 'helpdesk');
                    }, function (evt) {
                        uploadProgressCallback(evt);
                    });
                };
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
        var downloadFile = function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            link.click();
        };
        $scope.downloadCsv = function () {
            serverUtilityService.getWebService(AdminAttendanceService.getUrl('downloadCsv'))
                .then(function (data) {
                    window.open(data.data, "reporting.csv");
                });
        };

        /********** Start Time Attendance Permission Section **********/
        $scope.taPermission = {
            action: {
                list: [],
                current: null,
                isLiveTrackerVisible: false,
                hasPermission: false,
                visible: false
            }
        };
        var extractReportFromPermissionList = function(data) {
            var permissionSlug = 'can_view_attendance';
            var perList = [];
            angular.copy(data.data, perList);

            angular.forEach(data.data, function(value, key) {
                value._id = angular.isObject(value._id) ? value._id.$id : value._id;
                if(value.permission_slug.indexOf('report') >= 0) {
                    perList.splice(key, 1);
                }

                if(value.permission_slug == permissionSlug) {
                    $scope.taPermission.action.isLiveTrackerVisible = true;
                    $scope.taPermission.action.hasPermission = true;
                }
            });
            angular.copy(perList, data.data);
        };
        var getActionListCallback = function(data) {
            extractReportFromPermissionList(data);
            $scope.taPermission.action.list = data.data;
            $scope.taPermission.action.current = data.data.length ? data.data[0] : null;
            $scope.taPermission.action.visible = true;
            if(data.data.length) {                        
                getAllAttendance();
                getAttendanceSummary();
                // getAttendanceGraphSummary();
                if($scope.taPermission.action.isLiveTrackerVisible) {
                    if($scope.isSolarSystem.enabled && $scope.isSolarSystem.isAttendance) {
                        getSolarLiveTrack();
                    } else {
                        getLiveTrack();
                    }
                }
            }
        };
        var getActionList = function() {
            var url = AdminAttendanceService.getUrl('actionAdmin') + "/time_attendance";
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
        $scope.isActionView = function() {
            var permissionSlug = 'can_view_attendance';
            return utilityService.getValue($scope.taPermission.action.current, 'permission_slug') === permissionSlug;
        };
        $scope.isActionApproveReject = function() {
            var permissionSlug = 'can_view_approve_reject_request';
            return utilityService.getValue($scope.taPermission.action.current, 'permission_slug') === permissionSlug;
        };
        $scope.isActionUploadCSV = function() {
            var permissionSlug = 'can_upload_attendance';
            return utilityService.getValue($scope.taPermission.action.current, 'permission_slug') === permissionSlug;
        };
        var hasAdminTimeAttendancePermission = function(permissionName) {
            var isGiven = false;

            angular.forEach($scope.taPermission.action.list, function(value, key) {
                if(!isGiven && value.permission_slug === permissionName) {
                    isGiven = true;
                }                
            });

            return isGiven;
        };
        $scope.isActionRegularizeOnBehalf = function() {
            return hasAdminTimeAttendancePermission('can_view_regularize_on_behalf');
        };
        $scope.isVisibleMap = function() {
            var permission = ['view_field_force_tracking', 'assign_view_beats'],
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
        getSelectedEmplyeeids = function() {
            var employees = [];

            angular.forEach(utilityService.getValue($scope, 'liveTrack', []), function (row) {
               if(row.isCheck){
                employees.push(row);
               }
            });

            return employees;
        }
        $scope.reguRequest = function (item) {
            $timeout(function () {
                $('#policies').modal('hide');
            }, 500);            
            item.calReguDate = $scope.calReguDate;
            item.isEmployee = false;
            item.empId = $scope.regularizeEmpId;
            item.relationship = null;
            item.date = $scope.myDate;
            if($scope.isBulkRegularization){
              item.isBulkRegularization = $scope.isBulkRegularization;
              item.employeesList = getSelectedEmplyeeids()
            }
            broadCastEvent('request-regu', item);
        };
        var getRegularizationMethods = function () {
            var url = DashboardService.getUrl('regularizationReq') + "/" + $scope.regularizeEmpId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.regularizationRequests = data.data;
                });
        };

        $scope.regularizeOneDay = function (item) {
            $scope.isBulkRegularization = false
            if($scope.isSolarSystem.enabled) {
                $scope.regularizeEmpId = item.emp_id;
            } else {
                $scope.regularizeEmpId = item.employee_detail._id;
            }
            $scope.policy.model = null;
            console.log($scope.regularizeEmpId);
            getRegularizationMethods();
            $scope.modalInstance['regularizationPolicies'] = $modal.open({
                templateUrl: 'regPolicies.html',
                scope:$scope,
                size:'sm',
                windowClass:'fadeEffect'
            });
        };
        $scope.openModal = function (instance, template, size) {
            size = angular.isDefined(size) ? size : 'sm';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: template,
                scope: $scope,
                backdrop: 'static',
                windowClass: 'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        $scope.checkInDetails = function (item){
            $scope.checkInList = [];
            if($scope.isSolarSystem.enabled) {
                var emp_id = item.emp_id;
            } else {
                var emp_id = item.employee_detail._id;
            }
            var cDate  = utilityService.dateToString($scope.selectedDateTrack*1000,'-');
            var url = AdminAttendanceService.getUrl('checkInDetails');
            var params = {
              'date':cDate,
              'id':emp_id
            };
            serverUtilityService.getWebService(url,params)
                    .then(function (data){
                $scope.checkInList = data.data;
            });
        }
        $scope.resetFilter = function(page){
            $scope.resetAllTypeFilters();
            $scope.updatePaginationSettings(page);
        };
        $scope.exportSummary = function () {
            var csv = AdminAttendanceService.buildSummaryCSVData($scope.filteredItems.allAttendance);
            utilityService.exportToCsv(csv.content, 'attendance-summary.csv');
        };
        $scope.exportLiveTracker = function () {
            if($scope.isSolarSystem.enabled && $scope.isSolarSystem.isAttendance) {
                var url = AdminAttendanceService.getUrl('ssLiveTrack')
                var payload = $scope.attendanceFilter();
                payload.is_csv = true;
                $scope.viewDownloadFileUsingFormAndPayload(url,payload)
            } else {
                var csv = AdminAttendanceService.buildLiveTrackerCSVData($scope.filteredItems.liveTrack);
                utilityService.exportToCsv(csv.content, 'attendance-live-tracker.csv');
            }
        };

        /***** Start: Search by employee name and code section */
        $scope.usermanagent = {
            searchKey: 'employee_name',
            searchText: 'Search by Employee Name'
        };
        $scope.changeSearchTextHandler = function (search) {
            $scope.name_filter = {};
            $scope.usermanagent.searchText = search == 'employee_code' 
                ? 'Search by Employee Code' : 'Search by Employee Name';
        };

        $scope.searchTextFun = function(search) {
            if($scope.usermanagent.searchKey == 'employee_name') {
                $scope.attendanceSystem.searchKey = 'name';
            } 
            if($scope.usermanagent.searchKey == 'employee_code') {
                $scope.attendanceSystem.searchKey = 'emp_code';
            } 
            if(search) {
                $scope.attendanceSystem.searchValue = search;
                $scope.attendanceSystem.page_current = 1;
                getSolarLiveTrack();
            } else {
                $scope.attendanceSystem.searchValue = "";
                $scope.attendanceSystem.page_current = 1;
                getSolarLiveTrack();
            }
        }
        /***** End: Search by employee name and code section */

        /***********Start: Google Map Integration*************/
        $scope.getMapView = function(emp, ismodalOpen) {
            if(!emp || !emp._id || emp.disableClick) {
                return false;
            }
            emp.disableClick = true;
            if(!ismodalOpen) {
                $scope.trackerMap = AdminAttendanceService.buildTrackerMap();
            } else {
                $scope.trackerMap.visible = false;
            }
            $scope.trackerMap.emp = emp;
            $scope.trackerMap.from_date = new Date($scope.trackerMap.to_date.getTime()-24*3600*1000);
            var nextToDate = new Date($scope.trackerMap.to_date.getTime()+24*3600*1000);
            // var url = AdminAttendanceService.getUrl('googleMapData') + '/' + emp._id + '/' + ($scope.trackerMap.to_date.getTime()/1000) + '/' + (nextToDate.getTime()/1000);
            var url = AdminAttendanceService.getUrl('googleMapData') + '/' + emp._id + '/' + (moment($scope.trackerMap.to_date).startOf("day").unix()) + '/' + (moment($scope.trackerMap.to_date).subtract(1, 'days').unix());
            // var url = 'http://prod4.hrms.com/data/my_team/store-track.json';
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.trackerMap.data = AdminAttendanceService.buildMapdata(utilityService.getValue(data, 'data', []));
                emp.disableClick = false;
                $scope.trackerMap.visible = true;
                if(!ismodalOpen) {
                    $scope.openModal('googleMapTracker','google-map-tracker-tmpl.html', 'lg');
                }
            });
        };
        /***********End: Google Map Integration*************/

        /**** Start: Employee Selfie Url Section ****/
        var employeeSelfieUrlCallback = function (event, data) {
            if (utilityService.getValue(data, 'status') === 'success') {
                utilityService.getInnerValue(data, 'data','url')
                    ? $window.open(utilityService.getInnerValue(data, 'data','url'))
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

        //live tracker

        $scope.updateCountLiveTracker = function (item) {
            if (angular.isDefined(item)) {
                item.isCheck = item.isCheck; 
            };

            $scope.selectedTicketsCountLiveTracker = 0;
            angular.forEach(utilityService.getValue($scope, 'liveTrack', []), function (val, key) {
                if (val.isCheck) {
                    $scope.selectedTicketsCountLiveTracker += 1;
                }
            });
        };

        $scope.checkAllLiveTrcker = function (flag) {
            angular.forEach(utilityService.getValue($scope, 'liveTrack', []), function (row, index) {
                console.log(row);
                // if(row.total_pending_request != 0){
                    row.isCheck = flag;  
                // }
            });
            $scope.isCheck.liveTrack = flag;
            $scope.updateCountLiveTracker();
        };


        var getBulkRegularizationMethods = function () {
            var url = AdminAttendanceService.getUrl('bulkRegularization');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.regularizationRequests = data.data;
                    $scope.isBulkRegularization = true
                });
        };

        $scope.bulkRegularization= function () {
            // $scope.regularizeEmpId = item.employee_detail._id;
            $scope.policy.model = null;
            getBulkRegularizationMethods();
            $scope.modalInstance['regularizationPolicies'] = $modal.open({
                templateUrl: 'regPolicies.html',
                scope:$scope,
                size:'sm',
                windowClass:'fadeEffect'
            });
            // $scope.policy.model = null;
            // getBulkRegularizationMethods();
            // $scope.modalInstance['regularizationPolicies'] = $modal.open({
            //     templateUrl: 'regPolicies.html',
            //     scope:$scope,
            //     size:'sm',
            //     windowClass:'fadeEffect'
            // });
        };

        $scope.attendanceResync = function() {
            var url = AdminAttendanceService.getUrl('resyncAttendance') + "/?date=" 
                    + moment($scope.myDate).format('YYYY-MM-DD');

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    if(data.status === "success") {
                        utilityService.showSimpleToast(data.messsage);
                        if($scope.isSolarSystem.enabled && $scope.isSolarSystem.isAttendance) {
                            getSolarLiveTrack();
                        } else {
                            getLiveTrack();
                        }
                    }
                });
        }

        $scope.$on('request-attendance-callback', function (event, args) {
            if($scope.isSolarSystem.enabled && $scope.isSolarSystem.isAttendance) {
                getSolarLiveTrack();
            } else {
                getLiveTrack();
            }
        });

        $rootScope.$on('admin-bulk-regularization-done-callback', function (event, args) {
            if($scope.isSolarSystem.enabled && $scope.isSolarSystem.isAttendance) {
                getSolarLiveTrack();
            } else {
                getLiveTrack();
            }
        });
    }
]);