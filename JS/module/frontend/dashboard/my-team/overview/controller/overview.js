app.controller('OverviewController', [
	'$scope', '$timeout', '$q', '$modal', '$mdDialog', 'utilityService', 'ServerUtilityService', 'OverviewService', 'LeaveSummaryService', 'FORM_BUILDER',
	function ($scope, $timeout, $q, $modal, $mdDialog, utilityService, serverUtilityService, overviewService, summaryService, FORM_BUILDER) {

        var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.resetAllTypeFilters();
        $scope.updatePaginationSettings('my_team_overview');        
        $scope.overview = overviewService.buildOverviewModel();
        $scope.empObj = {
            filteredItems:null
        };
        var buildGetParams = function() {
            var params = {
                rel_id: $scope.relationship.primary.model._id,
                direct_reportee: $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false
            };
            if(teamOwnerId) {
                params.emp_id = teamOwnerId;
            }
            return params;
        };
        //
        var attendanceCallback = function(data) {
            $scope.overview.attendance.value = utilityService.getInnerValue(data, 'data', 'present_percent');
            $scope.overview.attendance.count = utilityService.getInnerValue(data, 'data', 'on_leave_count');
        };
        var hourWorkedCallback = function(data) {
            $scope.overview.hourWorked.value = utilityService.getInnerValue(data, 'data', 'working_hours');
        };
        var overtimeCallback = function(data) {
            $scope.overview.overtime.value = utilityService.getInnerValue(data, 'data', 'overtime');
        };
        var getAttendanceDetails = function() {
            var params = buildGetParams();
            params.days = $scope.overview.attendance.duration.id;

            serverUtilityService.getWebService(overviewService.getUrl('attendance'), params)
                .then(function(data) {
                    attendanceCallback(data);
                });
        };
        var getHourWorkedDetails = function() {
            var params = buildGetParams();
            params.days = $scope.overview.hourWorked.duration.id;

            serverUtilityService.getWebService(overviewService.getUrl('hourWorked'), params)
                .then(function(data) {
                    hourWorkedCallback(data);
                });
        };
        var getOvertimeDetails = function() {
            var params = buildGetParams();
            params.days = $scope.overview.overtime.duration.id;

            serverUtilityService.getWebService(overviewService.getUrl('overtime'), params)
                .then(function(data) {
                    overtimeCallback(data);
                });
        };
        if($scope.viewMyTeamTimeAttendance()) {
            getAttendanceDetails();
            getHourWorkedDetails();
            //getOvertimeDetails();
        }
        var pendingAppovalCallback = function(data) {
            $scope.overview.pendingApprovals.value = data.data.pending_request;
        };
        var getPendingAppovalDetails = function() {
            serverUtilityService.getWebService(overviewService.getUrl('pendingApprovals'), buildGetParams(true))
                .then(function(data) {
                    pendingAppovalCallback(data);
                });
        };
        /*if($scope.viewMyTeamLeave()) {
            getPendingAppovalDetails();
        }*/
        var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true,
            },
            {
                countObject: 'employeeStatus',
                collection: [1,2,3,4,5],
                isArray: false,
                key: 'employee_status'
            }
        ];
        var employeeDetailsCallback = function(data) {
            var object = overviewService.buildEmpDetailList(data.data, $scope.overview.empDetails.hashmap,$scope.envMnt);
            $scope.calculateFacadeCountOfAllFilters(object.list, allFilterObject);
            angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
            $scope.overview.empDetails.list = object.list;
            $scope.overview.empDetails.content = object.content;
        };
        var getEmployeeDetails = function() {
            serverUtilityService.getWebService(overviewService.getUrl('empDetails'), buildGetParams())
                .then(function(data) {
                    employeeDetailsCallback(data);
                });
        };
        getEmployeeDetails();
        $scope.sortBy = function(propertyName) {
            $scope.overview.empDetails.reverse = ($scope.overview.empDetails.propertyName === propertyName) ? !$scope.overview.empDetails.reverse : false;
            $scope.overview.empDetails.propertyName = propertyName;
        };
        $scope.renderDateFormat = function(timestamp) {
            return overviewService.renderDateFormat(timestamp);
        };
        $scope.changeOverviewDuration = function(item, section) {
            if(section === 'attendance') {
                getAttendanceDetails();
            } else if(section === 'hourWorked') {
                getHourWorkedDetails();
            } else {                
                getOvertimeDetails();
            }
        };
        $scope.exportToCsv = function() {
            var empDetailsData = overviewService.buildEmpDetailList($scope.empObj.filteredItems, $scope.overview.empDetails.hashmap,$scope.envMnt);

            $timeout(function () {
                utilityService.exportToCsv(empDetailsData.content, 'team-overview.csv');
            }, 1000);
        };
        $scope.isLevelColumnVisible = function() {
            return $scope.envMnt === 'nearbuy';
        };

        /***** Start: AngularJS Modal *****/
        $scope.openModal = function(instance, templateUrl, size) {
            size = size ? size : 'md'
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope:$scope,
                windowClass:'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            $scope.modalInstance[instance].close();

            if(instance == 'requestApproveFormQuestion') {
                $scope.requestApproveForm.selectedItem = null;
                $scope.requestApproveForm.viewMode = null;
                $scope.requestApproveForm.extraQuestions = null;
                $scope.requestApproveForm.approverChain = null;
            }
        };
        /***** End: AngularJS Modal *****/

        /***** Start: EmpApprFormAction *****/
        $scope.requestApproveForm = {
            selectedItem: null,
            approverChain: null,
            empForm: overviewService.buildFormObject(),
            apprForm: overviewService.buildFormObject(),
            viewMode: null,
            extraQuestions: null
        };
        $scope.getEmpApprForm = function(item) {
            var requestsArray = [
                serverUtilityService.getWebService(overviewService.getUrl('empConfirmationForm') +"/" + item.confirmation_log._id),
                serverUtilityService.getWebService(overviewService.getUrl('approverNHMForm') +"/" + item.confirmation_log._id)
            ];
            $q.all(requestsArray).then(function(data) {
                $scope.requestApproveForm.selectedItem = item;
                $scope.requestApproveForm.empForm = overviewService.buildFormObject(utilityService.getInnerValue(data[0], 'data', 'form_detail'));
                $scope.requestApproveForm.apprForm = overviewService.buildFormObject(utilityService.getInnerValue(data[1], 'data', 'form_detail'));
                $scope.requestApproveForm.approverChain = utilityService.getInnerValue(data[0], 'data', 'approver_chain');
                if(item.confirmation_log.action_id) {
                    $scope.requestApproveForm.extraQuestions = {
                        confirmation_action: utilityService.getInnerValue(data[1], 'data', 'confirmation_action'),
                        increase_probation_days: utilityService.getInnerValue(data[1], 'data', 'increase_probation_days'),
                        is_manager_descretion: utilityService.getInnerValue(data[1], 'data', 'is_manager_descretion', true),
                        probation_days_options: utilityService.getInnerValue(data[1], 'data', 'probation_days_options', [])
                    };
                    $scope.requestApproveForm.selectedItem.type = 'approver_confirmation_flow';
                } else {
                    $scope.requestApproveForm.viewMode = 'admin';
                }
                $scope.openModal('requestApproveFormQuestion', 'request-approve-form-question-tmpl.html', 'lg');
            });
        };
        $scope.addComment = function(single, status, item) {
            var url = overviewService.getUrl('action') + '/' + item.confirmation_log.action_id;
            var payload = {
                status: status,
                comment: null,
                confirmation_action: $scope.requestApproveForm.extraQuestions.confirmation_action
            };
            if(payload.confirmation_action == '2') {
                payload.increase_probation_days = $scope.requestApproveForm.extraQuestions.increase_probation_days;
            }
            payload = overviewService.addQuestionsInPayload(payload, $scope.requestApproveForm.apprForm.questions);
            serverUtilityService.putWebService(url, payload).then(function(data) {
                if(data.status == 'success') {
                    $scope.errorMessages = [];
                    utilityService.showSimpleToast(data.message);
                    $scope.closeModal('requestApproveFormQuestion');
                    getEmployeeDetails();
                } else {
                    $scope.errorMessages = [];
                    if(angular.isString(utilityService.getInnerValue(data, 'data', 'message'))) {
                        $scope.errorMessages.push(data.data.message);
                    } else {
                        angular.forEach(utilityService.getInnerValue(data, 'data', 'message'), function(val, key) {
                            angular.forEach(val, function(v, k) {
                                $scope.errorMessages.push(v);
                            });
                        });
                    }
                }
            });
        };
        /***** End: EmpApprFormAction *****/
        
        /***** Start: Confirmation & Alert Dialog Section *****/
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
        var showConfirmDialog = function(ev, functionName, item, actionName) {
            var actionName = angular.isDefined(actionName) ? actionName : 'default',
                confirmationDialog = utilityService.getValue($scope.overview, 'confirmationDialog'),
                textContent = utilityService.getInnerValue(confirmationDialog, actionName, 'textContent'),
                confirm = $mdDialog.confirm()
                    .title(utilityService.getInnerValue(confirmationDialog, actionName, 'title'))
                    .textContent(actionName === 'initiateExit' ? (textContent + ' ' + 
                        utilityService.getValue(item, 'full_name')) : textContent)
                    .ariaLabel(utilityService.getInnerValue(confirmationDialog, actionName, 'ariaLabel'))
                    .targetEvent(ev)
                    .ok(utilityService.getInnerValue(confirmationDialog, actionName, 'ok'))
                    .cancel(utilityService.getInnerValue(confirmationDialog, actionName, 'cancel'));

            $mdDialog.show(confirm).then(function() {
                functionName(item, ev);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function(event, functionName, item, actionName) {
            showConfirmDialog(event, functionName, item, actionName);
        };
        /***** End: Confirmation & Alert Dialog Section *****/
        
        /***** Start: Initiate Exit by Relationship Manager *****/
        $scope.initiateExit = function (item, ev) {
            var url = overviewService.getUrl('initiateExit') + '/' + item._id + '?' +  
                    new URLSearchParams(buildGetParams()).toString();

            serverUtilityService.postWebService(url, {})
                .then(function(data) {
                    utilityService.getValue(data, 'status') === 'success' 
                        ? utilityService.showSimpleToast(utilityService.getValue(data, 'message'))
                        : showAlert(ev, utilityService.getValue(data, 'message'));
                });
        };
        /***** End: Initiate Exit by Relationship Manager *****/

        /***** Start: Search by employee name and code section */
        $scope.changeSearchTextHandler = function (search) {
            $scope.name_filter = {};
            $scope.overview.searchText = search == 'emp_id' ? 'Search by Employee Code' : 'Search by Employee Name';
        };
        /***** End: Search by employee name and code section */
	}
]);