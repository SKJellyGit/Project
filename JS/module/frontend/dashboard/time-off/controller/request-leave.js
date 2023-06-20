app.controller('RequestLeaveController', [
	'$scope', '$rootScope', '$timeout', '$modal', 'utilityService', 'ServerUtilityService', 'TimeOffService', 'RequestLeaveService', 'FORM_BUILDER', 
	function ($scope, $rootScope, $timeout, $modal, utilityService, serverUtilityService, timeOffService, requestLeaveService, FORM_BUILDER) {
        
        var self = this;
        self.notifyTo = [];
        self.allEmployees = [];
        self.querySearchChips = querySearchChips;        

        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.leaveTypeList = [];
        $scope.leaveDetails = null;
        $scope.employeeList = [];
        $scope.args = null;
        $scope.tnaLeave = false;
        $scope.fromToLeaveTypeMapping = requestLeaveService.buildLeaveTypeMappingObject();
        $scope.timeoff = {
            summary: {
                list: []
            }
        };

        var syncRequestLeaveModel = function(model) {
            $scope.requestLeave = requestLeaveService.buildLeaveRequestModel(model, $scope.envMnt, $scope.args.params.on_behalf_emp_id);
            if($scope.tnaLeave) {
                $scope.requestLeave.fromDate = utilityService.getDefaultDate(utilityService.getValue($scope.args.params, 'from_date'));
                $scope.requestLeave.toDate = utilityService.getDefaultDate(utilityService.getValue($scope.args.params, 'to_date'));
                $scope.requestLeave.isleaveswap = utilityService.getValue($scope.args.params, 'isleaveswap') ? true : false;
            }
            if($scope.args.params.relationship) {
                $scope.requestLeave.relationship = $scope.args.params.relationship;
            }
        };
        var getLeaveTypeList = function() {
            var url = $scope.args.params.on_behalf_emp_id 
                ? (requestLeaveService.getUrl('leaveList') + "/" + $scope.args.params.on_behalf_emp_id)
                : timeOffService.getUrl('summary');
                if($scope.args.params.emp_id){
                    url = requestLeaveService.getUrl('leaveList') + "/" + $scope.args.params.emp_id
                }
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.leaveTypeList = timeOffService.buildSummaryList(data.data);
                });
        };
        var isABootstrapModalOpen = function () {    
            return document.querySelectorAll('.modal.in').length > 0;
        };
        /***************Modal Code********************/
        var toggleModal = function (instance, templateUrl, flag) {
            flag = angular.isDefined(flag) ? flag : false;
            flag ? $scope.openModal(instance, templateUrl)
                    : $scope.closeModal(instance);
        };
        $scope.openModal = function (instance, templateUrl) {
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'cust_modal-lg',
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function (instance) {
            if($scope.modalInstance[instance]){
                $scope.modalInstance[instance].dismiss();
            }
        };
        var leaveDetailsCallback = function (model, args) {
            var def = "1970-01-01";
            $scope.leaveDetails = model;
            $scope.questionList = angular.isDefined(model.form_detail) ? model.form_detail.questions : [];

            angular.forEach($scope.questionList, function(value, key) {
                if(value.question_type != 3 && angular.isDefined(value.answer)
                    && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];                    
                }
                // If question type is of time
                if(utilityService.getValue(value, 'answer') && value.answer && value.question_type == 6) {
                    value.answer = new Date(def + " " + value.answer);
                }

                // If question type is of date
                if(utilityService.getValue(value, 'answer') && value.answer && value.question_type == 5) {
                    value.answer = utilityService.getDefaultDate(value.answer);
                }
            });

            model.triggerFrom = args.params.triggerFrom;
            model.leaveType = args.params.leaveType;
            model.leavePlan = args.params.leavePlan;
            model.leaveLogId = args.params.leaveLogId;            
            model.isDisabled = args.params.triggerFrom == "requests" ? true : false;

            syncRequestLeaveModel(model);
            if(!isABootstrapModalOpen() && $scope.section.dashboard.timeoff) {
                toggleModal('requestLeave',"request-leave.html", true);
            }            
        };
        
        var leaveDetailsCallbackFromDashboard = function(model, args) {
            toggleModal("requestLeave","request-leave-from-dashboard", false);
            toggleModal("requestLeave","request-leave.html", false);
            var def = "1970-01-01";
            $scope.leaveDetails = model;
            $scope.questionList = angular.isDefined(model.form_detail) ? model.form_detail.questions : [];

            angular.forEach($scope.questionList, function(value, key) {
                if(value.question_type != 3 && angular.isDefined(value.answer)
                    && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];                    
                }
                // If question type is of time
                if(utilityService.getValue(value, 'answer') && value.answer && value.question_type == 6) {
                    value.answer = new Date(def + " " + value.answer);
                }

                // If question type is of date
                if(utilityService.getValue(value, 'answer') && value.answer && value.question_type == 5) {
                    value.answer = utilityService.getDefaultDate(value.answer);
                }
            });

            model.triggerFrom = args.params.triggerFrom;
            model.leaveType = args.params.leaveType;
            model.leavePlan = args.params.leavePlan;
            model.leaveLogId = args.params.leaveLogId;            
            model.isDisabled = args.params.triggerFrom == "requests" ? true : false;

            syncRequestLeaveModel(model);
            if(!isABootstrapModalOpen() && args.params.action) {
                toggleModal("requestLeave","request-leave-from-dashboard", true);
            }
            getTimeOffList();            
        };
        var getDetails = function(args, url) {
            console.log(args);
            console.log(url);
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    leaveDetailsCallback(data.data, args);
                });
        };
        $scope.getLeaveDetails = function(args) {
            var leavePlan = args.params.leavePlan,
                url = requestLeaveService.getUrl('leaveDetail') + "/" + leavePlan;

            if($scope.args.params.on_behalf_emp_id) {
                url = url + "/" + $scope.args.params.on_behalf_emp_id;
            }
            if($scope.args.params.emp_id){
                url = url + "/" + $scope.args.params.emp_id;
            }

            getDetails(args, url);            
        }; 
        $scope.getLeaveLogDetails = function(args) {
            var leaveLogId = args.params.leaveLogId,
                url = requestLeaveService.getUrl('leaveRequest') + "/" + leaveLogId;

            getDetails(args, url);
        };  

        /* Listening request leave broadcast event triggered 
            * from request/modify leave callback */
        $scope.$on('request-leave', function(event, args) {
            $scope.args = args;
            $scope.tnaLeave = false;
            self.notifyTo = [];
            utilityService.resetAPIError(false,'', 'requestLeave')
            getLeaveTypeList();
            getTimeOffList();
            if(angular.isDefined(args.params) && args.params.leaveLogId) {
                $scope.getLeaveLogDetails(args);
            } else if(angular.isDefined(args.params) && args.params.leavePlan) {
                $scope.getLeaveDetails(args);
            } else if(angular.isDefined(args.params) && args.params.on_behalf_emp_id) {
                syncRequestLeaveModel({});
                $timeout(function() {
                    toggleModal('requestLeave',"request-leave.html", true);
                }, 500);
            } else {
                $scope.tnaLeave = true;
                syncRequestLeaveModel({});
                $timeout(function() {
                    toggleModal('requestLeave',"request-leave.html", true);
                }, 500);                
            }           
        });
        $scope.$on('request-leave-from-dashboard', function(event, args) {
            $scope.args = args;
            $scope.tnaLeave = false;
            self.notifyTo = [];
            utilityService.resetAPIError(false,'', 'requestLeave')
            getLeaveTypeList();
            $scope.getLeaveDetails(args);            
            var leavePlan = args.params.leavePlan,
                url = requestLeaveService.getUrl('leaveDetail') + "/" + leavePlan;
            
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    leaveDetailsCallbackFromDashboard(data.data, args);
                });        
        });
        $scope.changeLeaveType = function(leavePlan) {
            $scope.args.params.leavePlan = leavePlan;
            $scope.getLeaveDetails($scope.args);
        };
        var submitLeaveRequest = function(url, payload) {
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    $scope.formSubmitHandler('requestLeave', false);
                    successErrorCallback(data, 'requestLeave');
                });
        };
        var updateLeaveRequest = function(url, payload) {
            url = url + "/" + $scope.args.params.leaveLogId;
            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    $scope.formSubmitHandler('requestLeave', false);
                    successErrorCallback(data, 'requestLeave');
                });
        };
        $scope.submitLeaveRequest = function(file) {
            $scope.formSubmitHandler('requestLeave', true);
            resetErrorMessages();
            var url = $scope.args.params.on_behalf_emp_id 
                ? (($scope.args.params.relationship 
                    ? requestLeaveService.getUrl('managerLeaveRequest') 
                    : requestLeaveService.getUrl('adminLeaveRequest'))  
                        + "/" + $scope.args.params.on_behalf_emp_id)                  
                : requestLeaveService.getUrl('leaveRequest'),
                payload = requestLeaveService.buildLeaveRequestPayload($scope.requestLeave, self.notifyTo, $scope.questionList);
                if($scope.args.params.leaveIsSwapAdmin){
                    url = requestLeaveService.getUrl('adminLeaveRequest');
                }
                if($scope.args.params.emp_id){
                   url =  requestLeaveService.getUrl('adminLeaveRequest')  
                   + "/" + $scope.args.params.emp_id
                }
                if($scope.requestLeave.isleaveswap) {
                    url = url + "?is_swap=" + $scope.requestLeave.isleaveswap
                }
            if(file) {
                payload.doc_file = file;
            }            
            ($scope.args.params.leaveLogId) ? updateLeaveRequest(url, payload) : submitLeaveRequest(url, payload);            
        };
        var successCallback = function(data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            if(section == "requestLeave") { 
                toggleModal('requestLeave',"request-leave.html", false);
                toggleModal("requestLeave","request-leave-from-dashboard", false);
                $rootScope.$broadcast('leave-requested', { 
                    params: {
                        triggerFrom: $scope.requestLeave.triggerFrom                  
                    } 
                });
                $rootScope.$broadcast("regReqSuccess");
            }
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
        var isSameDayLeave = function() {
            var fromDate = new Date($scope.requestLeave.fromDate),
                toDate = new Date($scope.requestLeave.toDate),
                fromTime = fromDate.getTime(),
                toTime = toDate.getTime();

            return fromTime == toTime;
        };
        var autoSyncToTypeDuration = function() {
            $scope.requestLeave.toTypeList = new Array();
            $scope.requestLeave.toTypeList.push(parseInt($scope.requestLeave.fromType, 10));
            $scope.requestLeave.toType = $scope.requestLeave.fromType;
        };
        var rebuildToLeaveDuration = function() {
            if(isSameDayLeave()) {                
                autoSyncToTypeDuration();
            } else {
                // If first dropdown has first half as option
                if($scope.requestLeave.fromType == 2) {
                    $scope.requestLeave.toDate = $scope.requestLeave.fromDate;
                    autoSyncToTypeDuration();
                } else {
                    angular.copy($scope.requestLeave.fromTypeList, $scope.requestLeave.toTypeList);
                    var findIndex = $scope.requestLeave.toTypeList.indexOf(3);
                    if(findIndex >= 0) {
                        $scope.requestLeave.toTypeList.splice(findIndex, 1);
                    }

                    if ($scope.requestLeave.toTypeList.indexOf($scope.requestLeave.toType) == -1) {
                        $scope.requestLeave.toType = utilityService.getValue($scope.requestLeave.toTypeList, 0, 1);
                    }
                }
            }
        };
        var checkLeaveDuration = function() {
            $scope.requestLeave.leaveCount = 0;
            $scope.requestLeave.totalLeaveCount = 0;
            rebuildToLeaveDuration();
            $scope.requestLeave.totalLeaveCount = requestLeaveService.calculateDaysDifference($scope.requestLeave);
            var url = requestLeaveService.getUrl('checkLeave'),
                payload = requestLeaveService.buildLeaveDurationPayload($scope.requestLeave);

            if($scope.args.params.on_behalf_emp_id) {
                url = url + "/" + $scope.args.params.on_behalf_emp_id;
            }

            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    if(data.status === "success") {
                        if(!utilityService.getValue(data.data, 'leave_invalid')) {
                            $scope.requestLeave.fromDate = utilityService.getDefaultDate(utilityService.getValue(data.data, 'leave_start'), true, false);
                            $scope.requestLeave.toDate = utilityService.getDefaultDate(utilityService.getValue(data.data, 'leave_end'), true, false);
                            $scope.requestLeave.leaveCount = utilityService.getValue(data.data, 'leave_count');
                            $scope.requestLeave.isLeaveInvalid = utilityService.getValue(data.data, 'leave_invalid', false);
                            $scope.requestLeave.errorMsg = null;
                            $scope.requestLeave.approverChain = utilityService.getValue(data.data, 'approver_chain');
                        } else {
                            $scope.requestLeave.approverChain = [];
                            $scope.requestLeave.leaveCount = 0;
                            $scope.requestLeave.isLeaveInvalid = true;
                            $scope.requestLeave.errorMsg = utilityService.getValue(data.data, 'message', 'It seems that there is some issue with either your balance leave or requested date(s).');;
                        }
                    } else {
                        console.log("API responding some error");
                    }                  
                });
        };
        var isValidDate = function() {
            var isValid = false;
            if($scope.requestLeave.fromDate && $scope.requestLeave.toDate) {
                var fromTimestamp = $scope.requestLeave.fromDate.getTime(),
                    toTimestamp = $scope.requestLeave.toDate.getTime();

                isValid =  fromTimestamp <= toTimestamp;
            }
            return isValid;
        };
        $scope.changeToDate = function() {
            if(isValidDate()) {
                checkLeaveDuration();
            }
        };
        $scope.changeFromDate = function() {
            if(isValidDate()) {
                var fromDate = new Date($scope.requestLeave.fromDate),
                    toDate = new Date($scope.requestLeave.toDate),
                    fromTime = fromDate.getTime(),
                    toTime = toDate.getTime();

                if(fromTime > toTime) {
                    fromTime = toTime;
                    $scope.requestLeave.fromDate = new Date(fromTime);
                }
                checkLeaveDuration();
            } else if($scope.requestLeave.toDate) {
                $scope.requestLeave.toDate = $scope.requestLeave.fromDate;
                checkLeaveDuration();
            } else if (!$scope.requestLeave.toDate && $scope.requestLeave.minLeaveDuration) {
                var minLeaveDuration = $scope.requestLeave.minLeaveDuration <= 1 
                    ? 0 : Math.round($scope.requestLeave.minLeaveDuration);
                $scope.requestLeave.toDate = utilityService.addDays($scope.requestLeave.fromDate, minLeaveDuration);
                checkLeaveDuration();
            }
        };        
        $scope.changeLeaveDuration = function() {
            if(isValidDate()) {
                checkLeaveDuration();
            }
        };

        /******** Start Chip Integration **********/
        var getEmployeeList = function() {
            serverUtilityService.getWebService(requestLeaveService.getUrl('employee'))
                .then(function(data) {
                    $scope.employeeList = [];
                    angular.forEach(data.data, function(value, key) {
                        if(value.full_name) {
                            $scope.employeeList.push(value);
                        }
                    });
                    self.allEmployees = loadChipList();
                });
        };  
        getEmployeeList();

        function querySearchChips(keyword) {
            return keyword ? self.allEmployees.filter(createFilterForChips(keyword)) : [];
        }
        function createFilterForChips(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(approver) {
                return (approver._lowername && approver._lowername.indexOf(lowercaseQuery) != -1);
            };
        }
        function loadChipList() {
            var list = $scope.employeeList;
            return list.map(function (c, index) {
                var object = {
                    id: c._id,
                    name: c.full_name,
                    image: c.profile_pic
                };
                object._lowername = utilityService.getValue(object, 'name') ? object.name.toLowerCase() : null;
                return object;
            });
        }
        /******** End Chip Integration **********/

        $scope.clickOutSideClose = function() {
            $("._md-select-menu-container").hide();
        };
        $scope.bindFileChangeEvent = function() {
            $timeout(function() {
                $("input[type=file]").on('change',function(){
                    $scope.requestLeave.isUploaded = true;
                });
            }, 100);            
        };
        $scope.reUpload = function(){
            $scope.requestLeave.isUploaded = false;
            $scope.requestLeave.file = null;
        };

        /**** Start: Function to display leave balance on the top of the popup *****/
        var loadLeaveCarousel = function () {
            $("#lv-blnc-popup").owlCarousel({
                items: 4,
                loop: true,
                lazyLoad: true,
                navText: ["<i class='fa fa-angle-left fa-lg'></i>","<i class='fa fa-angle-right fa-lg'></i>"],
                pagination: false,
                nav: true,
                dots: false
            });
        };
        var getTimeOffList = function () {
            if (!($scope.section.dashboard.home || $scope.section.dashboard.timeoff)) {
                return false;
            }
            $scope.timeoff.summary.list = [];
            serverUtilityService.getWebService(timeOffService.getUrl('summary'))
                .then(function (data) {
                    $scope.timeoff.summary.list = timeOffService.buildSummaryList(data.data);
                    $timeout(function () {
                        loadLeaveCarousel();
                    }, 1000);
                });
        };        
        $scope.renderSuffix = function (item) {
            var mapping = utilityService.buildDaysMappingObject();
            return utilityService.getValue(item, 'unit') ? mapping[item.unit] : "";
        };
        /**** End: Function to display leave balance on the top of the popup *****/

        $scope.changeHoursListForTodaySelection = function(fromDate) {
            if(!fromDate) { return false; }
            var today = new Date();
            if(today.getFullYear() == fromDate.getFullYear() && today.getMonth() == fromDate.getMonth() && today.getDate() == fromDate.getDate()) {
                $scope.requestLeave.fromHoursList = requestLeaveService.buildHoursList();
            } else {
                $scope.requestLeave.fromHoursList = requestLeaveService.buildHoursList('00:00');
            }
        };

        $scope.onSelectFromTime = function(fromTime) {
            var minLeaveDuration = utilityService.getValue($scope.requestLeave, 'minLeaveDuration');
            if(minLeaveDuration && fromTime) {
                minLeaveDuration = parseInt(minLeaveDuration * 60, 10);
                fromTime = new Date('1970/01/01 ' + fromTime);
                fromTime = new Date(fromTime.setMinutes(fromTime.getMinutes() + minLeaveDuration));
                var toTime = requestLeaveService.getDisplayHours(fromTime) + ':' + requestLeaveService.getDisplayMinutes(fromTime);
                $scope.requestLeave.toHoursList = requestLeaveService.buildHoursList(toTime);
            } else {
                $scope.requestLeave.toHoursList = requestLeaveService.buildHoursList();
            }
        };
	}
]);