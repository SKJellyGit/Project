app.controller('TimeOffController', [
	'$scope', '$rootScope', '$timeout', '$location', '$routeParams', '$window', '$modal', 'utilityService', 'ServerUtilityService', 'TimeOffService',
	function ($scope, $rootScope, $timeout, $location, $routeParams, $window, $modal, utilityService, serverUtilityService, timeOffService) {
        
        $scope.tab1 = true;
        $scope.tab2 = false;
        
        /********* Start common methods *********/
        $scope.timeoff = timeOffService.buildTimeOffObject();
        var broadCastEvent = function(event, params) {
            $scope.$broadcast(event, { 
                params: params 
            });
        };

        $scope.timeEmployeeSide = true;
        $scope.sortBy = function(propertyName) {
            $scope.timeoff.reverse = ($scope.timeoff.propertyName === propertyName) ? !$scope.timeoff.reverse : false;
            $scope.timeoff.propertyName = propertyName;
        };
        $scope.requestLeave = function(item, triggerFrom, action) {
            action = angular.isDefined(action) ? action : "request";
            var params = {
                triggerFrom: triggerFrom
            };
            if(action === "modify") {
                params.leaveLogId = item._id;
                params.leavePlan = item.leave_plan_id;                
            } else {
               params.leaveType = item._id;
               params.leavePlan = item.plan_id; 
            }
            broadCastEvent('request-leave', params);            
        };
        var resetSelectedLeaveType = function(model) {
            model.selectedLeaveType= [];
        };
        var resetFromToDate = function(model) {
            model.fromDate = null;
            model.toDate = null;
        };
        var resetSummaryFilter = function() {
            resetSelectedLeaveType($scope.timeoff.summary);            
            timeOffService.buildDefaultSummaryDuration();
            $scope.resetDate();
            $scope.toggleViewType('list');
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
        var resetHolidayFilter = function() {
            timeOffService.buildDefaultSelectedType();
        };        
        $scope.tabOnSelectListener = function(tab) {
            $scope.updatePaginationSettings(tab);
            switch(tab) {
                case 'request':
                    $scope.tab1 = true;
                    $scope.tab2 = false;
                    resetRequestFilter();
                    getLeaveRequestList();
                    break;

                case 'detail':
                    getLeaveDetails();
                    break;

                case 'holiday':
                    $scope.tab1 = false;
                    $scope.tab2 = true;
                    resetHolidayFilter();
                    getHolidayList();
                    break;

                default:
                    resetSummaryFilter();
                    getTimeOffList();
                    break;
            }
        };
        $scope.toggleLeaveDetail = function(item) {            
            var url = timeOffService.getUrl('specificDetail') + "/" + item.plan_id;
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.item = data.data;
                $scope.item = {
                    name: item.name,
                    leave_plan_detail: data.data
                };
                toggleModal("leave-detail", true);
            });            
        };
        $scope.isPublicProfileVisit = function() {
            return $scope.employeeId;
        };      
        /********* End common methods *********/

        /********* Start status tab methods *********/
        var getTimeOffList = function() {
            $scope.timeoff.summary.loader.visible = false;
            $scope.timeoff.summary.list = [];
            var url = timeOffService.getUrl('summary');

            if($scope.isPublicProfileVisit()) {
                url = url + "/" + $scope.employeeId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.timeoff.summary.list = timeOffService.buildSummaryList(data.data);
                $scope.timeoff.leaveTypeList = $scope.timeoff.summary.list;
                $scope.timeoff.summary.loader.visible = true;
            });
        };
        var summaryChartCallback = function(data) {
            data.data.leave_details.sort(utilityService.dynamicSortMultiple("name"));
            var response = timeOffService.buildGraphData(data.data.leave_details);
            angular.copy(response.leaveDetails, $scope.timeoff.summary.graphOriginal);
            $scope.timeoff.summary.graph = response.leaveDetails;            
            $scope.timeoff.summary.graphNoData = response.graphNoData;
            $scope.timeoff.summary.additionalData = timeOffService.syncGraphAdditionalData(data.data);
            $timeout(function() {
                $scope.timeoff.summary.visible = true;
            }, 100);
        };
        var getSummaryChartData = function() {
            $scope.timeoff.summary.visible = false;
            var url = timeOffService.getUrl('graph'),
                params = timeOffService.buildDurationParams($scope.timeoff.summary);

            serverUtilityService.getWebService(url, params)
                .then(function(data) {
                    summaryChartCallback(data);
                });
        };
        /*if(!$scope.isPublicProfileVisit()) {
            getSummaryChartData();
        }*/
        $scope.changeDate = function() {
            if($scope.timeoff.summary.fromDate
                && $scope.timeoff.summary.toDate) {
                getSummaryChartData();
            }
        };
        $scope.toggleViewType = function(keyName) {
            if(keyName === 'graph') {
                getSummaryChartData();
            }
            $scope.timeoff.summary.selectedLeaveType = [];
            angular.forEach($scope.timeoff.summary.viewType, function(value, key) {
                $scope.timeoff.summary.viewType[key].status = false;
            });
            $scope.timeoff.summary.viewType[keyName].status = true;
        };
        $scope.changeLeaveType = function(selectedTypes) {
            if($scope.timeoff.summary.viewType.graph.status) {
                if(!selectedTypes.length) {
                    getSummaryChartData();
                } else {
                    $scope.timeoff.summary.visible = false;
                    var filteredGraphData = [];
                    angular.forEach($scope.timeoff.summary.graphOriginal, function(v, k) {
                        if(selectedTypes.indexOf(v._id) >= 0) {
                            filteredGraphData.push(v);
                        }
                    });
                    $scope.timeoff.summary.graph = filteredGraphData;
                    $timeout(function() {
                        $scope.timeoff.summary.visible = true;
                    }, 100);
                }
            } else {
                console.log("do nothing...");
            }            
        };        
        $scope.changeSummaryDuration = function(item) {
            resetFromToDate($scope.timeoff.summary);
            getSummaryChartData();
            if($scope.timeoff.summary.selectedLeaveType.length){
                $timeout(function(){
                    $scope.changeLeaveType($scope.timeoff.summary.selectedLeaveType);
                    $scope.$apply()
                },300)
            }
        };
        $scope.onlyMondaySelectable = function(date) {
            var day = date.getDay();
            return day === 1;
        };
        $scope.onlySundaySelectable = function(date) {
            var day = date.getDay();
            return day === 0;
        };
        $scope.onlyFirstDaySelectable = function(date) {
            var d = date.getDate();
            return d === 1;
        };
        $scope.onlyLastDaySelectable = function(date) {
            var d = date.getDate();

            if(timeOffService.is31DaysMonth(date)) {
                return d === 31;
            } else if (timeOffService.is30DaysMonth(date)) {
                return d === 30;
            } else {
                return d === 28 || d === 29;
            }
        };
        $scope.isDurationDayOnDay = function() {
            return $scope.timeoff.summary.duration.slug == 'dod';
        };
        $scope.isDurationWeekOnWeek = function() {
            return $scope.timeoff.summary.duration.slug == 'wow';
        };
        $scope.isDurationMonthOnMonth = function() {
            return $scope.timeoff.summary.duration.slug == 'mom';
        };
        $scope.isDurationYearOnYear = function() {
            return $scope.timeoff.summary.duration.slug == 'yoy';
        };
        $scope.resetDate = function() {
            resetFromToDate($scope.timeoff.summary);
            if($scope.timeoff.summary.viewType.graph.status) {
                getSummaryChartData();
            }            
        };
        $scope.renderSuffix = function(item) {
            return utilityService.getValue(item, 'unit') ? $scope.timeoff.daysMap[item.unit] : "";
        };
        /********* End status tab methods *********/


        /********* Start requests tab methods *********/
        var getLeaveRequestList = function() {
            $scope.timeoff.requests.list = [];
            $scope.timeoff.requests.visible = false;

            var url = $scope.isPublicProfileVisit() 
                ? (timeOffService.getUrl('otherLeaveRequest') + "/" + $scope.employeeId)
                : timeOffService.getUrl('leaveRequest');

            serverUtilityService.getWebService(url).then(function(data) {
                $scope.timeoff.requests.list = timeOffService.buildRequestList(data.data);
                $timeout(function() {
                    $scope.timeoff.requests.visible = true;
                }, 100);
            });
        };      
        $scope.cancelRequest = function(item, index) {
            serverUtilityService.deleteWebService(timeOffService.getUrl('cancelRequest') + "/" + item._id)
                .then(function(data) {
                    if(data.status == "success") {
                        item.is_cancel_req = true;
                        getLeaveRequestList();
                    }                    
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
        /********* End requests tab methods *********/        


        /********* Start details tab related methods *********/
        var getLeaveDetails = function() {
            $scope.timeoff.details.visible = false;
            serverUtilityService.getWebService(timeOffService.getUrl('details'))
                .then(function(data) {
                    $scope.timeoff.details.list = data.data;
                    $timeout(function() {
                        $scope.timeoff.details.visible = true;
                    }, 100);
                });
        };
        /********* End details tab related methods *********/


        /********* Start Holiday tab related methods *********/
        var getHolidayList = function() {
            $scope.timeoff.holiday.visible = false;
            var url = $scope.isPublicProfileVisit() 
                ? (timeOffService.getUrl('otherHolidayList') + "/" + $scope.employeeId)
                : timeOffService.getUrl('holiday');

            serverUtilityService.getWebService(url).then(function(data) {
                $scope.timeoff.holiday.restricted.applied = data.data.applied_res_holiday_count;
                $scope.timeoff.holiday.restricted.availed = data.data.emp_avail_restrict;
                $scope.timeoff.holiday.restricted.allowed = data.data.total_restricted_holiday;                 
                $scope.timeoff.holiday.list = data.data.current_holiday_cycle;
                $scope.timeoff.holiday.totalRestricted = data.data.sum_holiday;
                $scope.timeoff.holiday.visible = true;
            });
        };        
        $scope.isHolidayListVisible = function(item) {
            var isVisible = false;
            if($scope.timeoff.holiday.selectedType.slug == "all") {
                isVisible = true;
            } else {
                if($scope.timeoff.holiday.selectedType.slug == "mandatory") {
                    isVisible = !item.is_restricted;
                } else {
                    isVisible = item.is_restricted;
                }
            }                       
        };
        var syncRestrictedHolidayModel = function(model) {
            $scope.restrictedHoliday = timeOffService.buildRestrictedHolidayModel(model);
        };
        var applyRestrictedHolidayCallback = function(model, item) {
            model = angular.isDefined(model) ? model : {};
            $scope.questionList = utilityService.getValue(model, 'form_detail')
                ? model.form_detail.questions : [];

            angular.forEach($scope.questionList, function(value, key) {
                if(value.question_type != 3 && angular.isDefined(value.answer)
                    && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];
                }
            });

            model.holidayId = item._id;
            syncRestrictedHolidayModel(model);
            toggleModal("request-restricted-holiday", true);
        };
        $scope.applyRestrictedHoliday = function(item) {
            var url = timeOffService.getUrl('applyRH') + "/" + item._id;

            serverUtilityService.getWebService(url).then(function(data) {
                console.log(data);
                if(data.status == 'success') {
                    applyRestrictedHolidayCallback(data.data, item);
                }else{
                    alert(data.message);
                }
            });            
        };
        $scope.cancelRestrictedHoliday = function(item) {
            var url = timeOffService.getUrl('cancelRH') + "/" + item.apply_id;

            serverUtilityService.deleteWebService(url).then(function(data) {
                if(data.status == 'success') {
                    getHolidayList();
                }else{
                    if(data.data && data.data.status == 'error'){
                        var string = "";
                        angular.forEach(data.data.message, function (v, k) {
                            string += v[0] +'.\n'
                        });
                        alert(string);
                    }else{
                        alert(data.message);
                    }
                }
            });
        };
        $scope.saveRestrictedHoliday = function() {
            resetErrorMessages();
            var url = timeOffService.getUrl('updateRH'),
                payload = timeOffService.buildRestrictedHolidayPayload($scope.restrictedHoliday, $scope.questionList);

            url = url + "/" + $scope.restrictedHoliday.holidayId;
            serverUtilityService.putWebService(url, payload).then(function(data) {
                successErrorCallback(data, 'restrictedHoliday', false);
            });
        };
        var successCallback = function(data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            toggleModal("request-restricted-holiday", false);
            getHolidayList();
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };        
        var successErrorCallback = function (data, section) {
            data.status === "success" ? 
                successCallback(data, section) : errorCallback(data, section);
        };        
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        $scope.clickQuestionAnswer = function(item, answer) {
            item.answer = angular.isDefined(item.answer) ? item.answer : [];
            var idx = item.answer.indexOf(answer);
            (idx > -1) ? item.answer.splice(idx, 1) : item.answer.push(answer);
        };
        $scope.canApplyRestrictedHoliday = function(item) {
            var date = new Date(),
                timestamp = date.getTime();

            return (parseInt(item.date*1000, 10) >= timestamp);
        };
        $scope.canCancelRestrictedHoliday = function(item) {
            var cDate = new Date(),
                ctmstmp = cDate.getTime(),
                applyDate = new Date(item.date * 1000);

            applyDate.setMonth(applyDate.getMonth() + 6);
            var dstmp = applyDate.getTime();
            
            return ctmstmp <= dstmp;
        };
        /********* End Holiday tab related methods *********/

        /* Listening leave requested broadcast event triggered 
            * from request leave success callback */
        $scope.$on('leave-requested', function(event, args) {
            if(args.params.triggerFrom == "summary") {
                getTimeOffList();
            } else if(args.params.triggerFrom == "requests") {
                getLeaveRequestList();
            }         
        });

        var toggleModal = function(id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false, 
                    show: true
                }) 
                : $('#' + id).modal('hide');
        };
        /*****************Navigate Section*************************/
        if($routeParams.isOverView){
            getTimeOffList();
            $scope.timeoff.selectedTab = 1; 
            $scope.timeoff.isSelected = true; 
        }
        if($scope.timeoff.isSelected){
            $location.search({isOverView : null});
        }
        $scope.filterHolidayList = function(item) {
            if($scope.timeoff.holiday.selectedType.slug == "all") {
                return item;                
            } else {
                if($scope.timeoff.holiday.selectedType.is_restricted == item.is_restricted) {
                    return item;
                }
            }
        };

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
        /********* End Angular Modal Section *********/

        $scope.exportToCsv = function() {
            var filename = 'employee-leave-requests.csv',
                csvData = timeOffService.buildCSVData($scope.timeoff.requests);

            $timeout(function () {
                utilityService.exportToCsv(csvData.content, filename);
            }, 1000);            
        }; 

        $scope.swapLeaveRequest = function(item, triggerFrom, action) {
            action = angular.isDefined(action) ? action : "summary";
            var params = {
                triggerFrom: triggerFrom,
            };
            if(action === "swapleave") {
                params.isleaveswap = true;
                params.from_date = item.from_date_format;
                params.to_date = item.to_date_format;
            } 
            params.leaveType = item._id;
            params.leavePlan = item.plan_id; 
            broadCastEvent('request-leave', params);            
        };
	}
]);