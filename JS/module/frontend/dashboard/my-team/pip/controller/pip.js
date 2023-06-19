app.controller('TeamPIPController', [
    '$scope', '$timeout', '$modal', '$mdDialog', 'TeamPIPService', 'utilityService', 'ServerUtilityService', 'LeaveSummaryService', 'FORM_BUILDER',
    function ($scope, $timeout, $modal, $mdDialog, service, utilityService, serverUtilityService, summaryService, FORM_BUILDER) {
        var self = this,
            teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);

        self.simulateQuery = false;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;

        $scope.pip = service.buildPerformanceImprovementPlanObject();
        $scope.questionList = [];
        $scope.questionTypeConstant = FORM_BUILDER.questionType;       
        $scope.updatePaginationSettings('team_requests_listing');
        $scope.updatePaginationSettings('team_details_listing');
        
        var isSectionMyTeam = function() {
            return $scope.section.dashboard.team;
        };                        
        var buildGetParams = function() {
            var params = {};            
            if(isSectionMyTeam()) {
                params.rel_id = utilityService.getInnerValue($scope.relationship.primary, 'model', '_id');
                params.direct_reportee = $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false;
                if(teamOwnerId) {
                    params.emp_id = teamOwnerId;
                }
            }

            return params;
        };
        $scope.pip.relationship = buildGetParams();
        var getPIPRequests = function() {
            serverUtilityService.getWebService(service.getUrl('requests'), $scope.pip.relationship)
                .then(function (data) {                    
                    $scope.pip.requests.list = utilityService.getValue(data, 'data', []);
                    $scope.pip.requests.visible = true;                    
                });
        };
        getPIPRequests();
        var getPIPDetails = function() {
            serverUtilityService.getWebService(service.getUrl('details'), $scope.pip.relationship)
                .then(function (data){
                    $scope.pip.details.list = utilityService.getValue(data, 'data', []);
                    $scope.pip.details.visible = true;
                });
        };        
        $scope.tabOnSelectHandler = function (tabname) {
            if ($scope.pip.requests === 'tabname') {
                return false;
            }

            $scope.pip.tabname = tabname;
            tabname === 'details' ? getPIPDetails() : getPIPRequests();
        };
        var requestFormCallback = function (data, instance, templateUrl) {
            $scope.questionList = utilityService.getInnerValue(data.data, 'form_detail', 'questions');
            angular.forEach($scope.questionList, function (value, key) {
                if (value.question_type != 3 && angular.isDefined(value.answer)
                        && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];
                }
                if (value.question_type == 5 && angular.isDefined(value.answer)) {
                    var date = value.answer;
                    var datearray = date.split("/");
                    var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
                    value.answer = new Date(newdate);
                }
            });
            $scope.openModal(instance, templateUrl);    
        };
        var getPIPRequestForm = function() {
            serverUtilityService.getWebService(service.getUrl('requestForm'))
                .then(function (data){
                    requestFormCallback(data, 'raisePIPRequest', 'raise-pip-request-form.tmpl.html');                    
                });
        };
        $scope.raisePIPRequest = function () {            
            self.searchText = null;
            self.selectedItem = null;
            $scope.pip.model.employee_id = null;
            resetErrorMessages();
            getPIPRequestForm();
        };
        $scope.viewRequestForm = function (item) {
            var url = service.getUrl('formDetails') + "/" + item.request_id;
            serverUtilityService.getWebService(url)
                .then(function (data){
                    requestFormCallback(data, 'viewPIPRequest', 'view-pip-request-form.tmpl.html');                   
                });
        };
        $scope.submitPIPRequest = function () {
            $scope.formSubmitHandler('raiseRequest', true);
            var url = service.getUrl('raiseRequest'),
                payload = service.buildRaiseRequestPayload($scope.pip, $scope.questionList);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    $scope.formSubmitHandler('raiseRequest', false);
                    successErrorCallback(data, 'raisePIPRequest');                
                });            
        };
        var buildEmployeeAutoCompleteData = function (list) {
            $scope.pip.employeeList = [];
            angular.forEach(list, function(value, key) {
                if(value.full_name) {
                    $scope.pip.employeeList.push(value);
                }
            });

            self.repos = loadAll($scope.pip.employeeList);
        };
        buildEmployeeAutoCompleteData($scope.team.list);
        $scope.sortBy = function(object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };
        $scope.exportToCsv = function() {
            var csvData,
                filename = null;

            if ($scope.pip.tabname === 'details') {
                csvData = service.buildDetailsCsvData($scope.pip.details);
                filename = 'team-pip-details.csv';
            } else {
                csvData = service.buildRequestsCsvData($scope.pip.requests.filteredList, $scope.pip.statusMapping);
                filename = 'team-pip-requests.csv';
            }
            
            $timeout(function () {
                utilityService.exportToCsv(csvData.content, filename);
            }, 200);            
        };
        $scope.viewRejectionReason = function (item) {
            $scope.pip.requests.reject_comment = item.reject_comment;
            $scope.openModal('rejectPIPReason', 'view-rejection-reason-pip.tmpl.html', 'md');
        };
        var deleteRequestCallback = function (event, data) {
            var message = utilityService.getValue(data, 'message');
            if (utilityService.getValue(data, 'status') === 'success') {
                getPIPRequests();
                utilityService.showSimpleToast(message);
            } else {
                showAlert(event, 'Delete Request', message);
            }                
        };
        $scope.deleteRequest = function (event, item) {
            var url = service.getUrl('raiseRequest') + "/" + item.request_id;

            serverUtilityService.deleteWebService(url)
                .then(function (data){
                    deleteRequestCallback(event, data);            
                });
        };

        /***** Start Assign Deliverable Section  ******/
        var assignDeliverableCallback = function (data) {
            var strInterimScheduleDays = service.convertInterimScheduleArrayToString(utilityService.getValue(data, 'interim_schedule', [])),
                deliverables = utilityService.getValue(data, 'deliverables', []);

            if (!deliverables.length) {
                deliverables.push(service.buildDeliverablesDefaultObject());
            }

            $scope.pip.details.assignDeliverable.isEditable = !(utilityService.getValue(data, 'deliverable_status') == 3);
            $scope.pip.details.assignDeliverable.request_id = utilityService.getValue(data, '_id');
            $scope.pip.details.assignDeliverable.employee_detail = utilityService.getValue(data, 'employee_detail');
            $scope.pip.details.assignDeliverable.duration = utilityService.getValue(data, 'duration');
            $scope.pip.details.assignDeliverable.interim_schedule = strInterimScheduleDays;
            $scope.pip.details.assignDeliverable.deliverables = deliverables; 
            $scope.pip.details.assignDeliverable.follower_detail = utilityService.getValue(data, 'follower_detail', []);
            $scope.pip.details.assignDeliverable.deliverable_status = utilityService.getValue(data, 'deliverable_status');

            $scope.openModal('assignPIPDeliverable', 'assign-devliverable.tmpl.html', 'md')
        };
        $scope.assignDeliverable = function (item) {
            resetErrorMessages();            
            var url = service.getUrl('detail') + "/" + item._id;
            serverUtilityService.getWebService(url, $scope.pip.relationship)
                .then(function (data){
                    assignDeliverableCallback(data.data);                  
                });
        };
        $scope.submitAssignedDeliverable = function (request) {
            $scope.formSubmitHandler('deliverable', true);
            resetErrorMessages();
            $scope.pip.details.assignDeliverable.request = request;
            
            var url = service.getUrl('asssignDeliverable') + "/" + $scope.pip.details.assignDeliverable.request_id,
                payload = service.buildAssignDeliverablePayload($scope.pip.details.assignDeliverable);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    $scope.formSubmitHandler('deliverable', false);
                    successErrorCallback(data, 'assignPIPDeliverable');                
                });
        };
        $scope.addMoreDeliverable = function () {
            $scope.pip.details.assignDeliverable.deliverables.push(service.buildDeliverablesDefaultObject());
        };
        $scope.removeDeliverable = function (index) {
            $scope.pip.details.assignDeliverable.deliverables.splice(index, 1);
        };
        $scope.renderSuffix = function (number) {
            return utilityService.getDayOfMonthSuffix(number);
        };        
        /***** End Assign Deliverable Section  ******/

        /***** Start Update Deliverable Status Section  ******/
        var deliverableStatusCallback = function (data, isFirstTime) {
            var deliverables = utilityService.getValue(data, 'deliverables', []);

            if (!deliverables.length) {
                deliverables.push(service.buildDeliverablesDefaultObject());
            }

            $scope.pip.details.deliverableStatus.isEditable = false;
            $scope.pip.details.deliverableStatus.request_id = utilityService.getValue(data, '_id');
            $scope.pip.details.deliverableStatus.employee_detail = utilityService.getValue(data, 'employee_detail');
            $scope.pip.details.deliverableStatus.interim_schedule_date = utilityService.getValue(data, 'interim_schedule_date', []);
            $scope.pip.details.deliverableStatus.deliverables = deliverables; 
            $scope.pip.details.deliverableStatus.follower_detail = utilityService.getValue(data, 'follower_detail', []);
            $scope.pip.details.deliverableStatus.end_date = utilityService.getValue(data, 'end_date');
            $scope.pip.details.deliverableStatus.reviewer_detail = utilityService.getValue(data, 'reviewer_detail');
            $scope.pip.details.deliverableStatus.interim_updates = utilityService.getValue(data, 'interim_updates', []);
            $scope.pip.details.deliverableStatus.deliverable_status = utilityService.getValue(data, 'deliverable_status');
            $scope.pip.details.deliverableStatus.reviewee_comment = utilityService.getValue(data, 'reviewee_comment');
            $scope.pip.details.deliverableStatus.reviewer_comment = utilityService.getValue(data, 'reviewer_comment');
            $scope.pip.details.deliverableStatus.overall_status = utilityService.getValue(data, 'overall_status');
            $scope.pip.details.deliverableStatus.is_final_update_visible = utilityService.getValue(data, 'is_final_update_visible', false);

            if ($scope.pip.details.deliverableStatus.is_final_update_visible) {
                $scope.pip.details.deliverableStatus.is_reviewee_comment_editable = false;
                $scope.pip.details.deliverableStatus.is_reviewer_comment_editable = false;
                $scope.pip.details.deliverableStatus.is_overall_status_editable = false;
            }

            $scope.pip.details.deliverableStatus.status = utilityService.getValue(data, 'status');

            if (isFirstTime) {            
                $scope.openModal('updatePIPDeliverableStatus', 'update-devliverable-status.tmpl.html', 'lg');
            }
        };
        $scope.getDeliverableStatus = function (item, isFirstTime) {
            isFirstTime = angular.isDefined(isFirstTime) ? isFirstTime : true;
            resetErrorMessages();            
            var url = service.getUrl('deliverableStatus') + "/" + item._id;
            serverUtilityService.getWebService(url, $scope.pip.relationship)
                .then(function (data){
                    deliverableStatusCallback(data.data, isFirstTime);                  
                });            
        };
        $scope.toggleEditableSection = function (object, keyname) {
            object[keyname] = true;
        };
        $scope.updateDeliverableStatus = function () {
            $scope.formSubmitHandler('deliverableStatus', true);
            resetErrorMessages();            
            var url = service.getUrl('updateDeliverableStatus') + "/" + $scope.pip.details.deliverableStatus.request_id,
                payload = service.buildUpdpateDeliverableStatusPayload($scope.pip.details.deliverableStatus);

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    $scope.formSubmitHandler('deliverableStatus', false);
                    successErrorCallback(data, "updatePIPDeliverableStatus");                  
                });
        };
        $scope.freezeDeliverableStatus = function (event, model) {
            var url = service.getUrl('freezeDeliverableStatus') + "/" + $scope.pip.details.deliverableStatus.request_id,
                payload = service.buildFreezeDeliverableStatusPayload(model);
            
            serverUtilityService.patchWebService(url, payload)
                .then(function (data){
                    successErrorCallback(data, "freezePIPDeliverableStatus");                  
                });
        };
        $scope.submitReviewerFinalUpdate = function () {
            var url = service.getUrl('reviewerFinalUpdate') + "/" + $scope.pip.details.deliverableStatus.request_id,
                payload = {
                    reviewer_comment: utilityService.getValue($scope.pip.details.deliverableStatus, 'reviewer_comment'),
                    overall_status: utilityService.getValue($scope.pip.details.deliverableStatus, 'overall_status')
                };

            serverUtilityService.patchWebService(url, payload)
                .then(function (data){
                    successErrorCallback(data, "updatePIPFinalStatus");                  
                });
        };
        /***** End Update Deliverable Status  ******/

        /***** Start Stop PIP Section  *****/
        $scope.viewStopPIPComment = function (item) {
            $scope.pip.stop.overall_status_comment = utilityService.getValue(item, 'overall_status_comment');
            $scope.openModal('stopPIP', 'view-stop-comment.tmpl.html', 'sm');
        };
        /***** End Stop PIP Section  *****/

        /***** Start Callback Methods *****/
        var successCallback = function(data, section) {
            utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            $scope.closeModal('raisePIPRequest');
            if (section === 'raisePIPRequest') {
                getPIPRequests();
            }
            if (section === 'assignPIPDeliverable') {
                getPIPDetails();
                $scope.closeModal('assignPIPDeliverable');
            }
            if (section === 'updatePIPDeliverableStatus') {         
                getPIPDetails();       
                $scope.getDeliverableStatus({_id: $scope.pip.details.deliverableStatus.request_id}, false);
            }
            if (section === 'freezePIPDeliverableStatus') {
                $scope.getDeliverableStatus({_id: $scope.pip.details.deliverableStatus.request_id}, false);
            }
            if (section === 'updatePIPFinalStatus') {
                getPIPDetails();       
                $scope.closeModal('updatePIPDeliverableStatus');
            }
        };
        var errorCallback = function(data, section) {
            if (data.status == "error") {
                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(data.message);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                if (($scope.envMnt === 'local' || $scope.envMnt === 'prod2' 
                    || $scope.envMnt === 'prod5' || $scope.envMnt === 'chaipoint' 
                    || $scope.envMnt === 'prod40') 
                    && utilityService.getValue(data, 'status') == 422
                    && section === 'raisePIPRequest') {
                    $scope.errorMessages.push("Please fill all the mandatory fields to submit");
                } else {                    
                    angular.forEach(data.data.message, function (value, key) {
                        $scope.errorMessages.push(value[0]);
                    });
                }                
            }
        };        
        var successErrorCallback = function (data, section) {
            data.status === "success" ? successCallback(data, section) : errorCallback(data, section);
        };        
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };        
        var showConfirmDialog = function(event, functionName, item, source) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.pip.confirmDialog[source].title)
                .textContent($scope.pip.confirmDialog[source].content)
                .ariaLabel('Lucky day')
                .targetEvent(event)
                .ok('Please do it!')
                .cancel('No, want to cancel');

            $mdDialog.show(confirm).then(function() {
                console.log(item);
                functionName(event, item);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function(event, functionName, item, source) {
            showConfirmDialog(event, functionName, item, source);
        };
        var showAlert = function(ev, title, message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };

        /***** Start: AngularJS Modal *****/
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'lg';
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
            if($scope.modalInstance[instance]){
                $scope.modalInstance[instance].dismiss();
            }
        };
        /****** End: AngularJS Modal ******/

        /****** Start Auto Complete Section ******/
        function querySearch(query) {
            return query ? self.repos.filter(createFilterFor(query)) : self.repos;
        }        
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function selectedItemChange(item, model, key) {
            if (angular.isDefined(model[key]) && angular.isDefined(item) && item) {
                var id =  angular.isObject(item._id) ? item._id.$id : item._id;
                model[key] = id; 
            } 
        }
        function loadAll(list) {
            return list.map(function (c, index) {
                var object = {
                    _id: c._id,
                    name: c.full_name,
                    image: c.profile_pic
                };

                object._lowername = utilityService.getValue(object, 'name') ? object.name.toLowerCase() : null;
                object.value = object._lowername;
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
    }
]);