app.controller('DashboardController', [
    '$scope','$modal', '$routeParams', 'LeaveSummaryService', '$mdSidenav', '$timeout', '$window', '$rootScope', '$location', 'TimeOffService', 'DashboardService', 'ReguReqService', 'utilityService', 'ServerUtilityService', 'FORM_BUILDER', 'ActionService', '$mdDialog',
    function ($scope,$modal, $routeParams, summaryService, $mdSidenav, $timeout, $window, $rootScope, $location, timeOffService, DashboardService, ReguReqService, utilityService, serverUtilityService, FORM_BUILDER, actionService, $mdDialog) {
        var self = this;

        self.notifyTo = [];
        $scope.nearBuyFlag = false;
        $scope.policyVisible = false;

        /************ Start Check for near buy *******/
        var updateFlagForNearBuy = function(){
            var url = $location.host();
            if(url == 'nearbuy.qandle.com'){
                $scope.nearBuyFlag = true;
            }
        };
        $scope.dateObj = DashboardService.getCurrentMonthObj();
        updateFlagForNearBuy();
        $scope.resourcePolicyFiles = [];
        $scope.resourcePolicyFolders = [];
        $scope.currentFolderId = null;
        $scope.breadcrumb = [];
        /*********** End Check for near buy *******/

        $scope.employeeList = [];
        $scope.requestName = '';
        $scope.reqFields = null;
        $scope.seletedTab = angular.isDefined($routeParams.tab) ? $routeParams.tab : 0;
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.args = null;
        $scope.policyDetail = null;
        $scope.regReq = null;
        $scope.visible = {
            attendance: false,
            reguRequests: false
        };
        $scope.showMobileMainHeader = true;
        $scope.requestStatus = null;
        $scope.secondsS = 0;
        $scope.timeAttendance = {};
        $scope.shiftDetails = null;
        $scope.weakDays = null;
        $scope.view = 'list';
        $scope.open = false;
        $scope.dateToday = null;
        $scope.dateYesterday = null;
        $scope.selectedMonth = {
            month: null
        };
        $scope.errorFlag = false;
        $scope.errorMsg = null;
        $scope.time = {
            graph: {
                visible: false
            }
        };
        $scope.total_dur = {
            hr: null,
            min: null
        };
        var modifyReqId = null;
        $scope.startEndTime = {
            inTime: null,
            outTime: null,
            breakTime: null
        };
        $scope.monthsName = DashboardService.getMonthsName();
        $scope.currentMonth = null;
        $scope.graphData = null;
        $scope.thisMonth = null;
        $scope.disableNext = true;
        $scope.shiftDetailMonth = null;
        $scope.allAttendanceMonth = null;
        $scope.allAttendanceYear = null;
        $scope.currentYear = null;
        $scope.shiftYear = null;
        $scope.shiftDetailYear = null;
        $scope.currentTimestamp = null;
        $scope.avgDataRecord = null;
        $scope.todaysTimestamp = null;
        $scope.sevenDaysTimestamp = 604800;
        $scope.oneMonthTimestamp = 2592000;
        $scope.graphTimestamp = 0;
        $scope.previousCount = 0;
        $scope.clockIn = true;
        $scope.isSelfReport = false;
        $scope.reportingMethod = null;
        $scope.loginEmpId = null;
        $scope.canTakeBreak = false;
        $scope.isStop = false;
        $scope.breaksAllowed = false;
        $scope.clock_in_second = 0;
        $scope.canClockIn = false;
        $scope.canClockOut = false;
        $scope.clickedTime = null;
        $scope.clockOut = false;
        $scope.totalWorkingHours = "00:00:00";
        $scope.currentClockInTimestamp = 0;
        $scope.startBreak = true;
        $scope.breakAllowed = true;
        $scope.stopTheBreak = false;
        $scope.attendanceRecord = null;
        $scope.allRequests = null;
        $scope.totalReguRequests = [];
        $scope.errorMessages = [];
        $scope.regularizationRequests = null;
        $scope.policy = {
            model: null
        };
        $scope.reqFields = null;
        $scope.catId = null;
        $scope.reqName = null;
        $scope.calReguDate = null;
        $scope.maxDay = null;
        $scope.orderByField = 'category';
        $scope.orderByKey = 'category';
        $scope.canClock = false;
        $scope.shift_start_time = null;
        $scope.shiftDate = {
            val: 1
        };
        $scope.shift_date_popup = false;
        $scope.shift_end_time = null;
        $scope.counter = 0;
        $scope.can_start_break = false;
        $scope.breakCounter = 0;
        $scope.totalBreakDur = 0;
        $scope.isSinglePunch = false;
        $scope.iHideOutTime = false;
        var stopped;
        var type = 1;
        var stoppedBreak;
        $scope.isCheck = {
            key: false,
            conditionalCheckAll: false,
            type: 1
        };
        $scope.selectedTickets = {};
        $scope.selectedTicketsCount = 0;
        $scope.dateObject = DashboardService.buildDateObject();
        $scope.monthObject = DashboardService.buildMonthsObject();
        $scope.policyDetailObj = DashboardService.policyDetailHasMap;
        var days = [
            'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
        ];
        $scope.unlimitedText = utilityService.unlimitedText;

        $scope.sortBy = function (propertyName) {
            $scope.attendanceRecord.attendance.reverse = ($scope.attendanceRecord.attendance.propertyName === propertyName) ? !$scope.attendanceRecord.attendance.reverse : false;
            $scope.attendanceRecord.attendance.propertyName = propertyName;
        };
        $scope.sortRequests = function (propertyName) {
            $scope.allRequests.reverse = ($scope.allRequests.propertyName === propertyName) ? !$scope.allRequests.reverse : false;
            $scope.allRequests.propertyName = propertyName;
        };
        $scope.initDate = {
            from: null,
            to: null
        };
        $scope.resetDate = function () {
            $scope.initDate = {
                from: null,
                to: null
            };
        }
        $scope.initAttendanceDate = {
            from: null,
            to: null
        };
        $scope.filterRequestStatusValue = {
            value: null
        };
        $scope.filterAttendanceStatusValue = {
            value: 7
        };
        $scope.taPolicyMapping = {
            unit: {
                1: 'Week',
                2: 'Month'
            }
        };
        $scope.isPublicProfileVisit = function () {
            return $scope.employeeId;
        };
        var getEmpId = function () {
            $scope.loginEmpId = $scope.employeeId ? $scope.employeeId : $scope.user.loginEmpId;
        };
        getEmpId();
        $scope.empExternalBirthDay = utilityService.getStorageValue('empPermissions');
        $scope.birthDayRequisition = $scope.empExternalBirthDay.indexOf('sidenav_view_external_recruitment')> -1 ? true:false;
        console.log($scope.birthDayRequisition)
        $scope.birthDayExternalRecruiter = $scope.empExternalBirthDay.indexOf('sidenav_view_birthday_anniversaries_of_external_recruiter')> -1 ? true:false;
        console.log($scope.birthDayExternalRecruiter)

        $scope.initRequestFilter = function (record) {
            if ($scope.filterRequestStatusValue) {
                var requested_on = utilityService.getDefaultDate(record.requested_on, false, true);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - requested_on.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if ($scope.filterRequestStatusValue.value < diffDays)
                    return;
            }

            return record;
        };
        var getReportingDetails = function () {
            var url = DashboardService.getUrl('selfReportDetails');
            serverUtilityService.getWebService(url).then(function (data) {
                if (data.data) {
                    $scope.canTakeBreak = data.data.can_start_break;
                    $scope.breaksAllowed = data.data.breaks_allowed;
                    $scope.canClockIn = data.data.can_clock_in;
                    $scope.canClockOut = !data.data.canClockOut;
                    $scope.clock_in_second = data.data.clock_in_second;
                    $scope.startEndTime.inTime = angular.isDefined(data.data.in_time) && data.data.in_time != 0 ? new Date("1970-01-01" + " " + data.data.in_time) : null;
                    $scope.startEndTime.outTime = angular.isDefined(data.data.out_time) && data.data.out_time != 0 ? new Date("1970-01-01" + " " + data.data.out_time) : null;
                    $scope.startEndTime.breakTime = data.data.break_hours != 0 ? new Date("1970-01-01" + " " + data.data.break_hours) : null;
                    $scope.total_dur.hr = data.data.total_hours != 0 && angular.isDefined(data.data.total_hours) ? data.data.total_hours.toString().split(":")[0] ? data.data.total_hours.toString().split(":")[0].length > 1
                            ? data.data.total_hours.toString().split(":")[0] : "0" + data.data.total_hours.toString().split(":")[0] : "00" : null;
                    $scope.total_dur.min = data.data.total_hours != 0 && angular.isDefined(data.data.total_hours) ? data.data.total_hours.toString().split(":")[1] ? data.data.total_hours.toString().split(":")[1].length > 1
                            ? data.data.total_hours.toString().split(":")[1] : "0" + data.data.total_hours.toString().split(":")[0] : "00" : null;
                }
            });
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
        $scope.avgDays = 7;
        $scope.avg = {
            visible: false
        };
        var toggleAvgVisible = function (initialLoaded) {
            var interval = initialLoaded ? 1000 : 0;
            $timeout(function () {
                $scope.avg.visible = true;
                $timeout(function () {
                    loadWorkingHourCarousel();
                }, 10);
            }, interval);
        };
        $scope.getAvgData = function (days, initialLoaded) {
            $scope.avg.visible = false;
            $scope.avgDataRecord = [];
            var url = DashboardService.getUrl('avgData') + "/" + days;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.avgDataRecord = data.data.data;
                toggleAvgVisible(initialLoaded);
            });
        };
        var todaysDate = function () {
            $scope.currentTimestamp = Math.floor(Date.now() / 1000);
            $scope.graphTimestamp = Math.floor(Date.now() / 1000);
            $scope.todaysTimestamp = Math.floor(Date.now() / 1000);
            $scope.dateToday = new Date();
            $scope.dateYesterday = new Date(
            $scope.dateToday.getFullYear(),
            $scope.dateToday.getMonth(),
            $scope.dateToday.getDate() - 1);
            $scope.currentMonth = $scope.dateToday.getMonth() + 1;
            $scope.shiftDetailMonth = $scope.dateToday.getMonth() + 1;
            $scope.allAttendanceMonth = $scope.dateToday.getMonth() + 1;
            $scope.thisMonth = $scope.dateToday.getMonth() + 1;
            $scope.selectedMonth.month = $scope.currentMonth;
            $scope.currentYear = $scope.dateToday.getFullYear();
            $scope.shiftYear = $scope.currentYear;
            $scope.allAttendanceYear = $scope.dateToday.getFullYear();
            $scope.shiftDetailYear = $scope.currentYear;
        };
        todaysDate();
        var successCallBack = function (data) {
            if (data.status == 'success') {
                if ($scope.clockIn) {
                    $scope.currentClockInTimestamp = new Date().getTime();
                    $scope.clickedTime = data.data.clock_in_time * 1000;
                    $scope.countdown();
                } else if ($scope.clockOut) {
                    $scope.stop();
                    $scope.stopBreak();
                }
            } else {
                alert(data.message);
            }
        };
        var breaksSuccessCallBack = function (data) {
            if (data.status == 'success') {
                if ($scope.startBreak) {
                    $scope.currentTimestamp = new Date().getTime();
                    $scope.breakCounter = data.data.break_second;
                    $scope.breakCountdown();
                } else if ($scope.stopTheBreak) {
                    $scope.stopBreak();
                }
            }
        };
        var breakDuration = function (timestamp, input) {
            var difference = (new Date().getTime() - timestamp) + input * 1000;
            var hoursDifference = Math.floor(difference / 1000 / 60 / 60) > 9 ? Math.floor(difference / 1000 / 60 / 60) : "0" + Math.floor(difference / 1000 / 60 / 60);
            difference -= hoursDifference * 1000 * 60 * 60;
            var minutesDifference = Math.floor(difference / 1000 / 60) > 9 ? Math.floor(difference / 1000 / 60) : "0" + Math.floor(difference / 1000 / 60);
            difference -= minutesDifference * 1000 * 60;
            var secondsDifference = Math.floor(difference / 1000) > 9 ? Math.floor(difference / 1000) : "0" + Math.floor(difference / 1000);

            return (hoursDifference + ':' + minutesDifference + ':' + secondsDifference);
        };

        var getClickedTime = function () {
            var url = DashboardService.getUrl('totalTime');
            serverUtilityService.getWebService(url).then(function (data) {
                if(data.status == 'error'){
                    $scope.errorFlag = true;
                    $scope.errorMsg = data.message;
                }
                if (!data.data) {
                    return false;
                }

                var conversionformat = "HH";
                var starttime = moment(new Date(data.data.shift_start_timestamp * 1000)).format(conversionformat);
                var endtime = moment(new Date(data.data.shift_end_timestamp * 1000)).format(conversionformat);               
                $scope.reportingMethod = data.data.reporting_method;
                console.log(starttime, endtime);
                console.log($scope.reportingMethod)
                utilityService.setStorageValue('local_starttime', starttime);
                utilityService.setStorageValue('local_endtime', endtime);
                utilityService.setStorageValue('local_reporting', $scope.reportingMethod);
                
                $scope.currentTimestamp = new Date().getTime();
                $scope.currentClockInTimestamp = new Date().getTime();
                $scope.canClock = data.data.can_clock_in;
                
                if (data.data.reporting_method == 'start_end_time') {
                    $scope.isSelfReport = true;
                }
                $scope.shift_date_popup = data.data.shift_date_popup;
                if ($scope.shift_date_popup) {
                    $scope.shift_end_time = data.data.shift_end_time;
                    $scope.shift_start_time = data.data.shift_start_time;
                }
                $scope.can_start_break = data.data.can_start_break;
                $scope.startBreak = data.data.is_break_allowed;
                $scope.breakAllowed = data.data.is_break_allowed;
                $scope.stopTheBreak = data.data.is_break_allowed;
                $scope.counter = data.data.clock_in_second;
                $scope.breakCounter = data.data.break_second;
                $scope.totalBreakDur = $scope.breakCounter > 0 ? breakDuration($scope.currentTimestamp, $scope.breakCounter) : "00:00:00";
                $scope.clickedTime = data.data.clock_in_time * 1000;
                $scope.isSinglePunch = data.data.is_single_punch;
                $scope.iHideOutTime = data.data.hide_out_time;
                
                if ($scope.counter > 0 && !$scope.canClock) {
                    $scope.clockIn = false;
                    $scope.clockOut = true;
                    $scope.countdown();
                }
                if ($scope.breakCounter > 0 && !$scope.can_start_break) {
                    $scope.startBreak = false;
                    $scope.stopTheBreak = true;
                    $scope.breakCountdown();
                }
            });
        };
        if (($scope.section.dashboard.home || $scope.section.frontend.home) && $scope.empViewAttendance()) {
            getReportingDetails();
            $scope.getAvgData(7, false);
            getClickedTime();
        }
        $scope.clockInOut = function (flag) {
            if (flag && $scope.shift_date_popup) {
                $('#clock-in').appendTo("body").modal('show');
            } else {
                var url = DashboardService.getUrl('clockinout');
                serverUtilityService.postWebService(url)
                .then(function (data) {
                    successCallBack(data);
                    if (data.status == 'success' && (parseInt(data.data.clock_in_time) > 0)) {
                        utilityService.setStorageValue('isClockin', true);
                    } else {
                        utilityService.setStorageValue('isClockin', false);
                    }
                });
            }
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
        var clockInPayload = function () {
            if ($scope.shiftDate.val == 1) {
                return $scope.formatDate($scope.dateToday);
            } else {
                return $scope.formatDate($scope.dateYesterday);
            }
        };
        $scope.clockInNow = function () {
            var url = DashboardService.getUrl('clockinout'),
                payload = {
                    shift_date: clockInPayload()
                };

            serverUtilityService.postWebService(url, payload).then(function (data) {
                successCallBack(data);
            });
        };
        $scope.clockInTotalHours = function () {
            var url = DashboardService.getUrl('selfReport'),
                payload = {
                    type: 4,
                    total_hours: $scope.total_dur.hr + "." + $scope.total_dur.min
                };

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        $scope.total_dur.hr = data.data.total_hours != 0 ? data.data.total_hours.toString().split(":")[0] ? data.data.total_hours.toString().split(":")[0].length > 1
                            ? data.data.total_hours.toString().split(":")[0] : "0" + data.data.total_hours.toString().split(":")[0] : "00" : "00";
                        $scope.total_dur.min = data.data.total_hours != 0 ? data.data.total_hours.toString().split(":")[1] ? data.data.total_hours.toString().split(":")[1] : "00" : "00";
                        alert('Atendance Marked Successfully')
                    }
                });
        };
        $scope.clockOutSummary = function () {
            $('#summary').appendTo("body").modal('show');
        };
        $scope.startStopBreak = function () {
            serverUtilityService.postWebService(DashboardService.getUrl('breaks'))
                .then(function (data) {
                    breaksSuccessCallBack(data);
                });
        };
        $scope.timerRunning = false;
        $scope.countdown = function () {
            $scope.timerRunning = true;
            $scope.clockIn = false;
            $scope.clockOut = true;
            stopped = $timeout(function () {
                $scope.totalWorkingHours = breakDuration($scope.currentClockInTimestamp, $scope.counter);
                $scope.countdown();
            }, 1000);
        };
        $scope.stop = function () {
            $scope.timerRunning = false;
            $scope.canClock = false;
            $scope.clockIn = true;
            $scope.clockOut = false;
            $timeout.cancel(stopped);
        };

        /***** BREAKS COUNTER *****/
        $scope.breakTimerRunning = false;
        $scope.breakCountdown = function () {
            $scope.breakTimerRunning = true;
            $scope.startBreak = false;
            $scope.stopTheBreak = true;
            stoppedBreak = $timeout(function () {
                $scope.totalBreakDur = breakDuration($scope.currentTimestamp, $scope.breakCounter);
                $scope.breakCountdown();
            }, 1000);
        };

        /***** ATTENDANCE *****/
        $scope.showBreakColumn = false;        
        $scope.changeView = function (action) {
            $scope.view = (action == 'list') ? 'list' : 'graph';
        };
        var isTotalBreakHoursExists = function (list) {
            angular.forEach(list, function (val, key){                
                if(val.total_break_hours > 0){
                    $scope.showBreakColumn = true;
                    return;
                }
            });
        };
        var getAttendanceRecord = function () {
            var url = DashboardService.getUrl('attendance'),
                params = {
                    employee_id: $scope.employeeId != null ? $scope.employeeId : null,
                    month_year: $scope.allAttendanceMonth + "_" + $scope.allAttendanceYear,
                    display_type: type
                };

            serverUtilityService.getWebService(url, params).then(function (data) {
                console.log(data);
                isTotalBreakHoursExists(utilityService.getInnerValue(data, 'data', 'attendance', []));
                $scope.attendanceRecord = data.data;
                $scope.attendanceRecord.canReguDate = data.data.last_date_for_regularization;
                $scope.visible.attendance = true;
                $scope.isCheck.key = false;
            });
        };
        getAttendanceRecord();        
        var getMonth = function (timeStamp) {
            var date = new Date(timeStamp * 1000);
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            if (month < $scope.currentMonth || month > $scope.currentMonth || year < $scope.currentYear || year < $scope.currentYear) {
                $scope.currentMonth = month;
                $scope.shiftYear = year;
            }
        };
        var disableNext = function () {
            $scope.disableNext = ($scope.graphTimestamp >= $scope.todaysTimestamp) ? true : false;
        };
        $scope.getWeeklyGraphData = function (action) {
            $scope.time.graph.visible = false;
            if (action == 'previous') {
                $scope.previousCount += 1;
                $scope.graphTimestamp = $scope.graphTimestamp - $scope.sevenDaysTimestamp;
            } else {
                $scope.previousCount -= 1;
                $scope.graphTimestamp = $scope.graphTimestamp + $scope.sevenDaysTimestamp;                
            }
            disableNext();
            $scope.checkPreviousMonths($scope.graphTimestamp*1000,'eGraph');
            getMonth($scope.graphTimestamp);
            getAttendanceGraphSummary();
        };
        var makeGraphData = function () {
            var arr = [], aut = [], brk = [];

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
                }
            ];
        };
        var getAttendanceGraphSummary = function (flag) {
            $scope.time.graph.visible = false;
            var key = flag ? '' : "&" + "date_of_week=" + $scope.graphTimestamp,
                url = DashboardService.getUrl('attendanceGraph');

            url = url + $scope.currentMonth + "_" + $scope.shiftYear + key;

            serverUtilityService.getWebService(url).then(function (data) {
                $scope.graphData = data.data;
                if ($scope.graphData) {
                    makeGraphData($scope.graphData);
                }
            });
        };
        if ($scope.section.dashboard.home && $scope.empViewAttendance()) {
            getAttendanceGraphSummary();
        }
        if ($scope.section.dashboard.attendance || $scope.section.dashboard.calendar && $scope.empViewAttendance()) {
            getAttendanceGraphSummary(true);
        }
        $scope.stopBreak = function () {
            $scope.breakTimerRunning = false;
            $scope.startBreak = true;
            $scope.stopTheBreak = false;
            $timeout.cancel(stoppedBreak);
            $scope.getAvgData(7);
            getAttendanceGraphSummary();
        };
        var allowPrevious = function (timestamp) {
            if(timestamp< $scope.joiningDate){
                $scope.isStop = true;
            }else{
                $scope.isStop = false; 
            }
        };
        $scope.getSelectedMonthRecord = function (action) {
            $scope.resetIsCheckToFalse();
            $scope.selectedTicketsCount = 0;
            if (action == 'previous') {
                if ($scope.allAttendanceMonth == 1) {
                    $scope.allAttendanceMonth = 13;
                    $scope.allAttendanceYear = $scope.allAttendanceYear - 1;
                }
                $scope.allAttendanceMonth = $scope.allAttendanceMonth - 1;                
            } else {
                if ($scope.allAttendanceMonth == 12) {
                    $scope.allAttendanceMonth = 0;
                    $scope.allAttendanceYear = $scope.allAttendanceYear + 1;
                }
                $scope.allAttendanceMonth = $scope.allAttendanceMonth + 1;
            }
            $scope.checkPreviousMonths(new Date($scope.allAttendanceYear, $scope.allAttendanceMonth - 1, 1).getTime(),'eAtten');
            getAttendanceRecord();
        };
        var getAllRequests = function () {
            $scope.visible.reguRequests = false;
            var url = DashboardService.getUrl('regRequests'),
                params = {
                    employee_id: $scope.employeeId != null ? $scope.employeeId : null
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.allRequests = DashboardService.buildRequestList(data.data);
                    $scope.visible.reguRequests = true;
                });
        };
        var getRegularizationMethods = function () {
            var url = DashboardService.getUrl('regularizationReq')+"/"+$scope.loginEmpId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.regularizationRequests = data.data;
                });
        };
        if (($scope.section.dashboard.attendance || $scope.section.dashboard.calendar || $scope.isPublicProfileVisit()) && $scope.empViewAttendance()) {
            getAllRequests();
            getRegularizationMethods();
        }
        $scope.$on("regReqSuccess", function (evt, data) {
            getAttendanceRecord();
            $('#reg-req').modal('hide');
            $scope.checkAll(false);
            getAllRequests();
        });
        var successCallback = function (data, section, isAdded) {
            var message = angular.isDefined(data.data) ? data.data.message : data.message;
            utilityService.showSimpleToast(message);
            getAttendanceRecord();
            getAllRequests();
            $('#reg-req').modal('hide');
            $('#mod-req').modal('hide');
        };
        var errorCallback = function (data, section) {
            if (data.status === "error") {
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
        var successErrorCallback = function (data, section, isAdded) {
            section = angular.isDefined(section) ? section : "reguReq";
            isAdded = angular.isDefined(isAdded) ? isAdded : false;
            data.status === "success" ? successCallback(data, section, isAdded) 
                : errorCallback(data, section);
        };
        $scope.calendarAttendanceSync = function (item) {
            $scope.calReguDate = item;
            $scope.maxDay = $scope.dateToday.getDate();
        };
        $scope.applyRegularizationReq = function () {
            $scope.reguRequest($scope.reqFields);
        };
        $scope.reguRequest = function (item) {
            $timeout(function () {
                $('#policies').modal('hide');
            }, 100);
            if($scope.calReguDate && ($scope.calReguDate.getTime() > $scope.todaysTimestamp*1000)){
                item.is_future = true;
                item.future_date = $scope.calReguDate;
            }
            item.calReguDate = $scope.calReguDate?$scope.calReguDate.getDate():null;
            item.isEmployee = true;
            item.relationship = null;
            broadCastEvent('request-regu', item);
            $scope.reqName = item.name;
            $scope.catId = item.id;
        };
        $scope.cancleRequest = function (id) {
            serverUtilityService.putWebService(DashboardService.getUrl('cancleRequests') + "/" + id)
                .then(function (data) {
                    successErrorCallback(data)
                });
        };
        var formatTime = function (time) {
            if (angular.isDefined(time.getHours()) && angular.isDefined(time.getMinutes())) {
                return time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
            }
        };
        $scope.selfReport = function (action) {
            var url = DashboardService.getUrl('selfReport'),
                payload = {};

            if (action == 'in') {
                payload.type = 1;
                payload.in_time = formatTime($scope.startEndTime.inTime);
            } else if (action == 'out') {
                payload.type = 2;
                payload.out_time = formatTime($scope.startEndTime.outTime);
            } else if (action == 'break') {
                payload.type = 3;
                payload.break_duration = new Date($scope.startEndTime.breakTime).getHours() + "." 
                    + new Date($scope.startEndTime.breakTime).getMinutes();
            }
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        $scope.canClockIn = data.data.can_clock_in;
                        $scope.canTakeBreak = data.data.can_start_break;
                        $scope.clock_in_second = data.data.clock_in_second;
                        $scope.startEndTime.inTime = angular.isDefined(data.data.in_time) && data.data.in_time != 0 ? new Date("1970-01-01" + " " + data.data.in_time) : new Date("1970-01-01" + " " + '0:0');
                        $scope.startEndTime.outTime = angular.isDefined(data.data.out_time) && data.data.out_time != 0 ? new Date("1970-01-01" + " " + data.data.out_time) : new Date("1970-01-01" + " " + '0:0');
                        $scope.startEndTime.breakTime = data.data.break_hours != 0 ? new Date("1970-01-01" + " " + data.data.break_hours) : null;
                    }
                });
        };
        var setAlsoNotifyResults = function (data) {
            self.notifyTo = [];
            angular.forEach(data.also_notify, function (val, key) {
                var object = {
                    id: val._id,
                    name: val.full_name,
                    image: 'images/user.png'
                };
                object._lowername = object.name.toLowerCase();
                self.notifyTo.push(object);
            });
        };
        var syncRegularizationRequestModel = function (model) {
            $scope.regReq = ReguReqService.buildLeaveRequestModel(model);
        };
        $scope.clickQuestionAnswer = function (item, answer) {
            item.answer = angular.isDefined(item.answer) && item.answer != "" ? item.answer : [];
            var idx = item.answer.indexOf(answer);
            (idx > -1) ? item.answer.splice(idx, 1) : item.answer.push(answer);
        };
        var reguDetailsCallback = function (model, args) {
            $scope.questionList = angular.isDefined(model.form_data.form_detail) ? model.form_data.form_detail.questions : [];
            angular.forEach($scope.questionList, function (value, key) {
                if (value.question_type != 3 && angular.isDefined(value.answer)
                        && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];
                }
                if (value.question_type == 5) {
                    value.answer = new Date(parseInt(value.answer));
                }
            });
            syncRegularizationRequestModel(model);
            $('#mod-req').appendTo("body").modal('show');
        };
        $scope.modifyRequest = function (id) {
            modifyReqId = id;
            serverUtilityService.getWebService(DashboardService.getUrl('regRequests') + "/" + id)
                .then(function (data) {
                    $scope.fieldsData = makeDateObjInOut(data.data);
                    setAlsoNotifyResults(data.data);
                    reguDetailsCallback(data.data);
                });
        };
        var extractIds = function (list) {
            var ids = [];
            angular.forEach(list, function (value, key) {
                ids.push(value.id);
            });
            return ids;
        };
        $scope.applyModifyReq = function () {
            var payload = ReguReqService.buildLeaveRequestPayload($scope.questionList);
            angular.forEach($scope.fieldsData.form_fields, function (val, key) {
                if (val.slug == 'in_time') {
                    payload.start_time = formatTime(val.selected_value);
                }
                if (val.slug == 'out_time') {
                    payload.end_time = formatTime(val.selected_value);
                } else if (val.slug == 'date') {
                    payload.date = val.selected_value;
                }
            });

            payload.category = $scope.catId;
            payload.comment = $scope.regReq.form.comment;
            payload.also_notify = extractIds(self.notifyTo);

            var url = DashboardService.getUrl('regRequests') + "/" + modifyReqId;
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, 'modiReq');
                });
        };
        var makeDateObjInOut = function (data) {
            angular.forEach(data.form_fields, function (val, key) {
                if (val.slug == 'in_time' || val.slug == 'out_time') {
                    val.selected_value = new Date("1970-01-01" + " " + val.selected_value);
                }
            });
            return data;
        };
        $scope.openSideNavPanel = function () {
            $mdSidenav('left').open();
        };
        $scope.closeSideNavPanel = function () {
            $mdSidenav('left').close();
        };

        /****** Start Time Attendance Section *******/
        $scope.linkAnchors = function () {
            $('ul.nav a').click(function () {
                var path = $(this).attr('href');
                if (path != '#') {
                    window.location = path;
                }
            });
        };
        $scope.updateCount = function (isSingleCheckbox) {
            isSingleCheckbox = angular.isDefined(isSingleCheckbox) ? isSingleCheckbox : false;
            $scope.selectedTicketsCount = 0;
            angular.forEach($scope.attendanceRecord.attendance, function (val, key) {
                if (val.isCheck && !$scope.isDateAndDomainWiseHidden(val)) {
                    $scope.selectedTicketsCount += 1;
                } else if(val.isIndividual) {
                    val.isIndividual = false;
                }
            });

            if (isSingleCheckbox) {
                if ($scope.attendanceRecord.attendance.length == $scope.selectedTicketsCount) {
                    $scope.isCheck.key = true;
                } else {
                    $scope.isCheck.key = false;
                }
            }            
        };
        $scope.regularizeOneDay = function (item) {
            $scope.selectedTicketsCount = 0;
            item.flag = true;
            angular.forEach($scope.attendanceRecord.attendance, function (row, index) {
                row.isIndividual = false;
                row.isCheck = false;
            });
            item.isIndividual = true;            
            $scope.regularizationReq();
            $timeout(function () {
                item.flag = false;
            }, 1000);
        };
        $scope.isCheckboxEnabledForExcludingCases = function (row) {
            return !$scope.isDateAndDomainWiseHidden(row) 
                && !row.can_not_apply_regularization_week_off_holiday
                && !(row.flag || $scope.attendanceRecord.canReguDate > row.date_timestamp)
                && utilityService.getValue(row, 'holiday_reason') !== "Week off"
                && utilityService.getValue(row, 'remark') != "-";
        };
        $scope.checkAll = function (flag) {
            $scope.isCheck.conditionalCheckAll = false;

            angular.forEach($scope.attendanceRecord.attendance, function (row, index) {
                if (!$scope.isDateAndDomainWiseHidden(row) && utilityService.getValue(row, 'remark') !== "-") {
                    row.isCheck = flag;
                } else if (!flag) {
                    row.isCheck = flag;
                }               
            });
            
            $scope.updateCount();
        };
        $scope.checkAllConditionally = function (flag) {
            $scope.isCheck.key = false;

            angular.forEach($scope.attendanceRecord.attendance, function (row, index) {
                if ($scope.isCheckboxEnabledForExcludingCases(row)) {
                    row.isCheck = flag;
                } else if (!flag) {
                    row.isCheck = flag;
                }               
            });

            $scope.updateCount();
        };
        $scope.totalReq = function () {
            $scope.totalReguRequests = [];
            $scope.errorMessages = [];
            var attRecord = angular.copy($scope.attendanceRecord);
            angular.forEach(attRecord.attendance, function (row, index) {
                if (row.isCheck == true) {
                    row.in_time = row.in_time == '-' ? new Date("1970-01-01" + " " + '00:00:00') : new Date("1970-01-01" + " " + row.in_time);
                    row.out_time = row.out_time == '-' ? new Date("1970-01-01" + " " + '00:00:00') : new Date("1970-01-01" + " " + row.out_time);
                    $scope.totalReguRequests.push(row);
                }
            });
        };
        var broadCastEvent = function (event, params) {
            $rootScope.$broadcast(event, {
                params: params
            });
        };
        $scope.requestLeaveFromDashboard = function (item, triggerFrom, action) {
            action = angular.isDefined(action) ? action : "request";
            var params = {
                triggerFrom: triggerFrom,
                from_date: item.date,
                to_date: item.date,
                action: action
            };
            if (action === "modify") {
                params.leaveLogId = item._id;
                params.leavePlan = item.leave_plan_id;
            } else {
                params.leaveType = item._id;
                params.leavePlan = item.plan_id;
            }
            $scope.broadCastEventUsingScope('request-leave-from-dashboard', params);
        };
        $scope.regularizationReq = function () {
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
        $scope.getShiftDetails = function () {
            var url = DashboardService.getUrl('shiftDetail') + $scope.shiftDetailMonth + "_" + $scope.shiftDetailYear,
                params = {
                    employee_id: $scope.employeeId != null ? $scope.employeeId : null
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.shiftDetails = data.data;
                    $scope.weakDays = data.week_data;
                });
        };
        $scope.getMonthWiseDetail = function (action) {
            if (action == 'previous') {
                if ($scope.shiftDetailMonth == 1) {
                    $scope.shiftDetailMonth = 13;
                    $scope.shiftDetailYear = $scope.shiftDetailYear - 1;
                }
                $scope.shiftDetailMonth = $scope.shiftDetailMonth - 1;
            } else {
                if ($scope.shiftDetailMonth == 12) {
                    $scope.shiftDetailMonth = 0;
                    $scope.shiftDetailYear = $scope.shiftDetailYear + 1;
                }
                $scope.shiftDetailMonth = $scope.shiftDetailMonth + 1;                
            }
            $scope.checkPreviousMonths(new Date($scope.shiftDetailYear, $scope.shiftDetailMonth - 1, 1).getTime(),'eShift');
            $scope.getShiftDetails();
        };
        $scope.getMonthWiseGraphDetail = function (action) {
            $scope.time.graph.visible = false;
            if (action == 'previous') {
                if ($scope.currentMonth == 1) {
                    $scope.currentMonth = 13;
                    $scope.shiftYear = $scope.shiftYear - 1;
                }
                $scope.graphTimestamp = $scope.graphTimestamp - $scope.oneMonthTimestamp;
                disableNext();
                $scope.currentMonth = $scope.currentMonth - 1;
                $scope.section.dashboard.attendance ? getAttendanceGraphSummary(true) : getAttendanceGraphSummary(false);
            } else {
                if ($scope.currentMonth == 12) {
                    $scope.currentMonth = 0;
                    $scope.shiftYear = $scope.shiftYear + 1;
                }
                if ($scope.currentMonth + 1 == $scope.thisMonth) {
                    $scope.graphTimestamp = $scope.todaysTimestamp;
                } else {
                    $scope.graphTimestamp = $scope.graphTimestamp + $scope.oneMonthTimestamp;
                }
                disableNext();
                $scope.currentMonth = $scope.currentMonth + 1;
                $scope.section.dashboard.attendance ? getAttendanceGraphSummary(true) : getAttendanceGraphSummary(false);
            }
            $scope.checkPreviousMonths($scope.graphTimestamp*1000,'oGraph');
        };
        /***** End Time Attendance Section *****/

        /***** Start TimeOff Section *****/
        $scope.timeoff = timeOffService.buildTimeOffObject();
        $scope.monthDuration = timeOffService.buildMonthDurationList();
        var getTimeOffList = function () {
            $scope.timeoff.summary.list = [];
            serverUtilityService.getWebService(timeOffService.getUrl('summary'))
                .then(function (data) {
                    $scope.timeoff.summary.list = timeOffService.buildSummaryList(data.data);
                    $timeout(function () {
                        if ($location.path() != '/dashboard/people') {
                            loadLeaveCarousel();
                            loadWorkingHourCarousel();
                        }
                    }, 2000);
                });
        };
        getTimeOffList();
        var summaryChartCallback = function (data) {
            var response = timeOffService.buildGraphData(data.data.leave_details);
            $scope.timeoff.summary.graph = response.leaveDetails;
            $scope.timeoff.summary.graphNoData = response.graphNoData;
            $scope.timeoff.summary.additionalData = timeOffService.syncGraphAdditionalData(data.data);
            $timeout(function () {
                $scope.timeoff.summary.visible = true;
            }, 100);
        };
        var getSummaryChartData = function (duration) {
            duration = angular.isDefined(duration) ? duration : null;
            $scope.timeoff.summary.visible = false;
            var url = timeOffService.getUrl('graph'),
                params = timeOffService.buildDurationParams($scope.timeoff.summary);

            if(duration) {
                url = url + "/" + duration.month + "/" + duration.year;
            }
            serverUtilityService.getWebService(url, params).then(function (data) {
                summaryChartCallback(data);
            });
        };
        var getHolidayList = function () {
            serverUtilityService.getWebService(timeOffService.getUrl('holiday'))
                .then(function (data) {
                    if (utilityService.getValue(data, 'data')) {
                        $scope.timeoff.holiday.list = data.data.current_holiday_cycle;
                        angular.copy($scope.timeoff.holiday.list, $scope.timeoff.holiday.cpylist);
                        $scope.changePeriodRange($scope.timeoff.summary, true);
                    }
                });
        };        
        if ($scope.empViewTimeoff() && $scope.section.dashboard.home) {
            getSummaryChartData();
            getHolidayList();
        }
        $scope.renderSuffix = function (item) {
            return utilityService.getValue(item, 'unit') ? $scope.timeoff.daysMap[item.unit] : "";
        };
        var toggleVisible = function (initialLoaded) {
            var interval = initialLoaded ? 1000 : 0;
            $timeout(function () {
                $scope.timeoff.holiday.visible = true;
                $timeout(function () {
                    loadHolidayCarousel();
                }, 10);
            }, interval);
        };
        var periodRangeCallback = function (initialLoaded, dateRange) {
            var args = {
                list: $scope.timeoff.holiday.cpylist,
                fromDate: dateRange.from,
                toDate: dateRange.to,
                key1: 'date',
                key2: 'date'
            };
            $scope.timeoff.holiday.list = timeOffService.filterHolidayList(args);
            toggleVisible(initialLoaded);
        };
        $scope.changePeriodRange = function (model, initialLoaded) {
            initialLoaded = angular.isDefined(initialLoaded) ? initialLoaded : false;
            $scope.timeoff.holiday.visible = false;
            periodRangeCallback(initialLoaded, timeOffService.getDateRange(model.period.slug));
        };
        $scope.previousNextMonth = function(item, action) {
            var isChanged = false,
                index = null;
            
            for(var i=0; i<$scope.monthDuration.length; i++) {
                if(item.active == $scope.monthDuration[i].active) {
                    if(action === 'next' && i < $scope.monthDuration.length - 1) {
                        index = i + 1;
                        isChanged = true;
                    }

                    if(action === 'previous' && i > 0) {
                        index = i - 1;
                        isChanged = true;
                    }

                    if(isChanged) {
                        $scope.monthDuration[index].active = true;
                        item.active = false;
                        getSummaryChartData($scope.monthDuration[index]);
                    }
                    break;
                }
            }
        };
        /***** End TimeOff Section *****/

        /***** Start Request Status Summary *****/
        $scope.requestTypePermissionMapping = {
            1: 'sidenav_view_time_attendance',
            2: 'sidenav_view_lms',
            3: 'sidenav_view_provision',
            4: 'sidenav_view_helpdesk'
        };
        var requestStatusCallback = function(data) {
            var list = [];
            angular.forEach(data.data, function(value, key) {
                var permission = $scope.requestTypePermissionMapping[value.request_type];
                if($scope.isEmpSideNavVisible(permission)) {
                    list.push(value); 
                }
            });
            $scope.requestStatus = list;
        };
        $scope.getRequestsStatus = function (days) {
            var url = DashboardService.getUrl('requestSummary') + "/" + days;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    requestStatusCallback(data);
                });
        };

        var nice = false;
        $(document).ready(function () {
            $timeout(function () {
                //nice = $("html, body, md-content").niceScroll();
            }, 2000);
        });

        var loadHolidayCarousel = function () {
            $("#upcoming-h").owlCarousel({
                items:2,
                itemsMobile: [479,1],
                loop: true,
                lazyLoad: true,
                navText: ["<i class='fa fa-angle-left fa-lg'></i>","<i class='fa fa-angle-right fa-lg'></i>"],
                pagination: false,
                nav: true,
                dots: false
            });
        };
        var loadLeaveCarousel = function () {
            $("#lv-blnc").owlCarousel({
                items:2,
                loop: true,
                lazyLoad: true,
                navText: ["<i class='fa fa-angle-left fa-lg'></i>","<i class='fa fa-angle-right fa-lg'></i>"],
                pagination: false,
                nav: true,
                dots: false
            });
        };
        var loadWorkingHourCarousel = function () {
            $("#w-hrs").owlCarousel({
                items: 2,
                loop: true,
                lazyLoad: true,
                navText: ["<i class='fa fa-angle-left fa-lg'></i>","<i class='fa fa-angle-right fa-lg'></i>"],
                pagination: false,
                nav: true,
                dots: false
            });
        };

        /***** Start Exit Process Section *****/
        $scope.exitProcessDetails = null;
        $scope.duesStatus = DashboardService.duesStatusObj();
        $scope.profileStatus = DashboardService.buildProfileStatus();
        $scope.clearance = {
            file: null,
            isDocumentUploaded: false,
            isLoaded: false
        };        
        $scope.sendReminderTo = function (type, slave, master) {
            var payload = {
                slave_emp_id: [],
                master_emp_id: angular.isObject(master) ? master.$id : master,
                type: type
            };
            angular.forEach(slave, function (v, k){
                var id = angular.isObject(v._id) ? v._id.$id : v._id;
                payload.slave_emp_id.push(id);
            });
            
            var url = DashboardService.getUrl('exitReminder');
            serverUtilityService.postWebService(url, payload)
                    .then(function (data) {
                        if (data.status == 'success') {
                            utilityService.showSimpleToast(data.message);
                        }
                    });
        };
        var getExitProcessDetails = function () {
            var url = DashboardService.getUrl('exitDetails');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    if (data.data) {
                        angular.forEach(data.data.feedback_detail, function (v, k) {
                            if (v.form_type == "survey") {
                                data.data.surveyStatus = v.status;
                                data.data.feedback_form_sent = v.feedback_form_sent;
                            }
                        });
                        if (data.data.clearance_offline_form_file_original_name) {
                            $scope.clearance.isLoaded = true;
                            $scope.clearance.isDocumentUploaded = true;
                        }
                        $scope.exitProcessDetails = data.data;
                        getSurveyForm();
                    }
                });
        };
        if ($scope.section.dashboard.home && ($scope.user.isExitInitiated == "true"
            || $scope.user.isExitInitiated == true)) {
            getExitProcessDetails();
        }
        $scope.downloadClearanceFile = function () {
            $scope.viewDownloadFileUsingForm(DashboardService.getUrl('downloadClearance') + "/" +$scope.exitProcessDetails._id);
        };
        $scope.bindFileChangeEvent = function (item) {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    item.isLoaded = false;
                    item.isDocumentUploaded = true;
                });
            }, 100);
        };
        $scope.saveClearenceDoc = function (payld) {
            if (!payld || payld == null) {
                return false;
            }
            var url = DashboardService.getUrl('uploadClearance') + "/" + $scope.exitProcessDetails._id,
                payload = {
                    file: payld
                };

            serverUtilityService.uploadWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                    }
                    if (data.status == 'error') {
                        alert(data.message);
                    }
                });
        };
        $scope.remove = function (item) {
            item.isDocumentUploaded = false;
            item.file_name = "";
        };        
        var syncFormModel = function(model){
            $scope.formModel = DashboardService.buildFormModel(model);
            $scope.questionList = utilityService.getInnerValue(model.exit_form_detail, 'form_detail', 'questions',[]);
            $scope.formModel.exit_id = $scope.exitProcessDetails._id;
        };        
        var getSurveyForm = function (){
            var url = DashboardService.getUrl('exitFeedbackForm') + "/" + $scope.exitProcessDetails._id + "/survey";
            serverUtilityService.getWebService(url)
                .then(function (data){
                    syncFormModel(data.data);
                });            
        };        
        $scope.submitAnswers = function(form){
            var url = actionService.getUrl('submitExitForms'),
                payload = actionService.buildQuestionPayload($scope.questionList, form, $scope.formModel);
            
            serverUtilityService.putWebService(url ,payload).then(function(data) {
                if(data.status == 'success'){
                    utilityService.showSimpleToast(data.message);
                    $scope.exitProcessDetails.surveyStatus = 4;
                    $scope.closeModal('questionAnswerForm');
                }
            });
        };
        /***** End Exit Process Section *****/

        /***** Start Raise Request Section *****/
        $scope.raiseRequest = {
            isProvision: false
        };
        $scope.$on('leave-requested', function (event, args) {
            $scope.getRequestsStatus(7);
        });
        $scope.raiseNewRequest = function (item, form) {
            if (item.request_name == "Provision") {
                if (angular.isDefined(form)) {
                    utilityService.resetForm(form);
                }
                broadCastEvent('raise-asset-request', {form: form});
            }
            if (item.request_name == 'Helpdesk Tickets') {
                $location.url('/dashboard/create-ticket');
            }
            if (item.request_name == 'Time Off' && $scope.timeoff.summary.list.length) {                
                $scope.requestLeaveFromDashboard($scope.timeoff.summary.list[0], "summary", "dashboard")
            }
            if (item.name == 'Attendance Regularization') {
                $location.url('/dashboard/attendance');
            }
            if (item.name == 'Comp Off Credit') {
                $scope.requestName = 'Comp Off Credit';
                $scope.reqFields = item;
                $('#reguDate').appendTo("body").modal('show');
            }
            if (item.name == 'Overtime') {
                $scope.requestName = 'Overtime';
                $scope.reqFields = item;
                $('#reguDate').appendTo("body").modal('show');
            }
            if (item.name == 'Comp Off Use') {
                $scope.requestName = 'Comp Off Use';
                $scope.reqFields = item;
                $('#reguDate').appendTo("body").modal('show');
            }
            if (item.name == 'Work from home') {
                $scope.requestName = 'Work from home';
                $scope.reqFields = item;
                $('#reguDate').appendTo("body").modal('show');
            }
        };
        $scope.$on('raiseProvisionRequest', function (event, data) {
            $scope.getRequestsStatus(7);
        });
        $scope.redirectToPage = function (item, count) {
            if (count > 0) {
                if (item.request_name == "Provision") {
                    $location.url('/frontend/provisions').search({isOverView: true});
                }
                if (item.request_name == 'Helpdesk Tickets') {
                    $location.url('/dashboard/helpdesk');
                }
                if (item.request_name == 'Time Off') {
                    $location.url('/dashboard/time-off').search({isOverView: true});
                }
                if (item.request_type == 1) {
                    $location.url('/dashboard/attendance').search({tab: 1});
                }
            }
        };
        $scope.requestLeave = function (item, triggerFrom, action) {
            action = angular.isDefined(action) ? action : "request";
            var params = {
                triggerFrom: triggerFrom,
                from_date: item.date,
                to_date: item.date
            };
            if (action === "modify") {
                params.leaveLogId = item._id;
                params.leavePlan = item.leave_plan_id;
            } else {
                params.leaveType = item._id;
                params.leavePlan = item.plan_id;
            }
            broadCastEvent('request-leave', params);
        };
        angular.element(document).ready(function () {
            $timeout(function () {
                $(".editabl-txt").prop("contentEditable", "true"); // Note the capital E   
            }, 1000);
        });
        /***** End Raise Request Section *****/
        
        /***** Start Notice Section *****/        
        $scope.todaysNotice = [];
        $scope.sytemInfo = {
            notify_birthday: true,
            notify_work_anniversary: true
        };     
        var getSysInfo = function (){
            serverUtilityService.getWebService(DashboardService.getUrl('getSysInfo'))
                .then(function (data){
                    $scope.sytemInfo = data.data;
                });
        };
        // This call has been commented beacause we have assumed that, both the settings will be always true
        getSysInfo();        
        var getTodaysNotices = function () {
            serverUtilityService.getWebService(DashboardService.getUrl('todaysNotice'))
                .then(function (data) {
                    $scope.todaysNotice = data.data;
                });
        };
        if ($scope.section.dashboard.home) {
            getTodaysNotices();
        }        
        $scope.getPolicyDetails = function () {
            var empId = utilityService.getStorageValue('loginEmpId'),
                url = DashboardService.getUrl('policyDetail') + "/" + empId;
                
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.policyDetail = data.data;
                });
        };

        /***** Start Company Payment Notice *****/        
        $scope.companyPaymentNotice = "";
           
        var getCompanyPaymentNotices = function () {
            serverUtilityService.getWebService(DashboardService.getUrl('companyPaymentNotice'))
                .then(function (data) {
                    $scope.companyPaymentNotice = data;
                });
        };
        if ($scope.section.dashboard.home) {
            getCompanyPaymentNotices();
        }    

        $scope.getPolicyDetails = function () {
            var empId = utilityService.getStorageValue('loginEmpId'),
                url = DashboardService.getUrl('policyDetail') + "/" + empId;
                
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.policyDetail = data.data;
                });
        };

        /********** Start: Resource Widget **********/
        var getResourcePolicy = function (folder) {
            $scope.policyVisible = false;
            //"59ef2b7e39473ea14ee92815" resource id for nearbuy
            //"5a20fa5a654284cc0a000029" resource id for local (need to verify if exists)
            var resourcePolicyId = $scope.nearBuyFlag 
                ? "59ef2b7e39473ea14ee92815" : "5a20fa5a654284cc0a000029",
                policyId = angular.isDefined(folder) ? folder._id : resourcePolicyId,
                url = DashboardService.getUrl('resourcePolicy') + "/" + policyId;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.resourcePolicyFiles = DashboardService.rebuildFileList(data.data.files);
                    $scope.resourcePolicyFolders = DashboardService.rebuildFolderList(data.data.folders);
                    if($scope.resourcePolicyFiles || $scope.resourcePolicyFolders){
                        $scope.policyVisible = true;
                    }
                });
        };
        $scope.nearBuyFlag ? getResourcePolicy() : console.log("Resource Widget Not Applicable");
        $scope.backToPreviousState = function() {
            $scope.breadcrumb = [];
            $scope.currentFolderId = null;
            getResourcePolicy();
        };
        $scope.openFolder = function(folder) {
            $scope.currentFolderId = folder._id;
            $scope.breadcrumb.push(folder);
            $scope.fileIncludes = [];
            $scope.ownerSearch = [];
            getResourcePolicy(folder);
        };
        $scope.updateBreadCrumb = function(folder, index) {
            if($scope.breadcrumb.length - 1 == index) {
                return false;
            }
            var pos = $scope.breadcrumb.map(function(e) { return e._id; }).indexOf(folder._id);
            $scope.breadcrumb.length = pos + 1;
            $scope.currentFolderId = folder._id;
            getResourcePolicy(folder);
        };
        $scope.openFile = function(file) {
            $scope.viewDownloadFileUsingForm(getAPIPath() + "resources/open/" + file._id + "/view");
        };
        /***** End: Resource Widget *****/
        
        $scope.clickOutSideClose = function() {
          $('#alert-menu-content .md-tab').attr("md-prevent-menu-close", "md-prevent-menu-close");
        };
        var toggleModal = function (instance, templateUrl , flag){
            flag = angular.isDefined(flag) ? flag : false;
                flag ? $scope.openModal(instance, templateUrl)
                        : $scope.closeModal(instance);
        };        
        $scope.openModal = function(instance, templateUrl, size) {
            size = angular.isDefined(size) ? size : 'md';
            
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };
        $scope.isDateAndDomainWiseHidden = function (item) {
            var isHidden = false;

            if (utilityService.applyLeave.domains.indexOf($scope.envMnt) >= 0) {
                var allowedTimestamp = new Date(utilityService.applyLeave.fromMinDate),
                    dateTimeStamp = utilityService.getValue(item, 'date_timestamp', 0) * 1000;

                isHidden = allowedTimestamp > dateTimeStamp;                            
            }           

            return isHidden;
        };

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
            var url = DashboardService.getUrl('selfieUrl') + "/" 
                    + item.date_timestamp + "/" + type;

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
        $scope.radioButtonChangeHandler = function () {
            $scope.resetIsCheckToFalse();
            $scope.checkAll(false)
        };
        $scope.resetIsCheckToFalse = function () {
            $scope.isCheck.key = false;
            $scope.isCheck.conditionalCheckAll = false;
        };

        $scope.swapLeaveRequest = function(item, triggerFrom, action) {
            action = angular.isDefined(action) ? action : "summary";
            var params = {
                triggerFrom: triggerFrom,
            };
            if(action === "swapleave") {
                params.isleaveswap = true;
                params.from_date = item.date;
                params.to_date = item.date;
            } 
            params.leaveType = item._id;
            params.leavePlan = item.plan_id; 
            broadCastEvent('request-leave', params);            
        };
    }
]);
