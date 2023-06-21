app.controller('IndividualReviewTimelineController', [
	'$scope', '$routeParams', '$location', '$window', '$modal', 'FORM_BUILDER', 'utilityService', 'ServerUtilityService', 'IndividualReviewTimelineService', 
	function ($scope, $routeParams, $location, $window, $modal, FORM_BUILDER, utilityService, serverUtilityService, service) {
        var allFilterObject = service.buildAllFilterObject();        
        var cycleId = utilityService.getValue($routeParams, 'cycle_id');

        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.overall = service.buildOverallObject($routeParams);
        $scope.resetAllTypeFilters();
        $scope.buildAppraisalTabTitle();
        $scope.resetFacadeCountObject(allFilterObject);

        var traverseWithinObject = function(data) {
            var mapObject =  service.buildRatingMappingObject(data),
                list = utilityService.getValue(data, 'rows'),
                currentDate = new Date(),
                currentTime = currentDate.getTime();
           
            angular.forEach(list, function(value, key) {
                var reviewStatus = $scope.overall.statusMapping[value.review_status];
                
                if (value.review_status == 2) {
                    var startDate = utilityService.getDefaultDate(utilityService.getValue(value, 'start_date'));
                    value.review_status = startDate.getTime() > currentTime ? 99 : value.review_status;
                }

                value.review_status_text =  utilityService.getValue(reviewStatus, 'text');
                value.review_status_class = utilityService.getValue(reviewStatus, 'class');                
                value.reviewer_type_text = $scope.overall.relationship.mapping[value.reviewer_type];                
                value.revieweeFullName = utilityService.getInnerValue(value, 'reviewee', 'full_name');
                value.reviewerFullName = utilityService.getInnerValue(value, 'reviewer', 'full_name');
                
                $scope.calculateFacadeCountOfAllFilters(list, allFilterObject, value);
            });
            angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);

            return list;
        };
        var reBuildOtherRelationsObject = function () {
            $scope.overall.otherRelations.enabled = Boolean(utilityService.getStorageValue('enable_other_relations_' + cycleId));
            $scope.overall.otherRelations.object = JSON.parse(utilityService.getStorageValue('other_relations_' + cycleId));
            utilityService.rebuildReviewerNameForRelationship($scope.overall.relationship.mapping, cycleId);
            utilityService.rebuildFilterObjectForRelationship($scope.overall.relationFilterList, cycleId);
        };
        var individualReviewDetailsCallback = function(data) {
            reBuildOtherRelationsObject();
            $scope.overall.setting.cycle_start = utilityService.getValue(data, 'cycle_start');
            $scope.overall.setting.cycle_end = utilityService.getValue(data, 'cycle_end');
            $scope.overall.setting.cycle_start_date = utilityService.getDefaultDate(utilityService.getValue(data, 'cycle_start'));
            $scope.overall.setting.cycle_end_date = utilityService.getDefaultDate(utilityService.getValue(data, 'cycle_end'));
            $scope.overall.individualReviews = traverseWithinObject(data);
            $scope.overall.individualTimeline.isCheckbox.disabled = $scope.overall.setting.cycle_end_date.getTime() < $scope.overall.individualTimeline.currentDate.getTime(); 
            $scope.overall.visible = true;
        };             
        var getIndividualReviewDetails = function() {
            var url = service.getUrl('individualReviewTimetime') + "/" 
                + utilityService.getValue($routeParams, 'cycle_id');
            
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    individualReviewDetailsCallback(data.data);
                });
        };
        var otherRelationsCallback = function (data) {
            $scope.overall.otherRelations.enabled = utilityService.getInnerValue(data, 'data', 'is_other_relation', false);
            $scope.overall.otherRelations.list = utilityService.getInnerValue(data, 'data', 'details', []);
            $scope.overall.otherRelations.object = utilityService.buildOtherRelationsObject($scope.overall.otherRelations.list);
            utilityService.setOtherRelationsWithinStorage(cycleId, $scope.overall.otherRelations);
            getIndividualReviewDetails();
        };
        var getOtherRelations = function () {
            var url = service.getUrl('otherRelations') + "/" + cycleId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    otherRelationsCallback(data);                         
                });
        };
        utilityService.getStorageValue('other_relations_' + cycleId)
            ? getIndividualReviewDetails() : getOtherRelations();

        //getIndividualReviewDetails();        
        $scope.sortBy = function(object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };
        $scope.viewReviewCycleFeedback = function(as, item) {
            $location.url('dashboard/view-feedback').search({
                as: as, 
                cycle: utilityService.getValue($routeParams, 'cycle_id'),                
                reviewee: utilityService.getValue(item.reviewee, '_id'),
                reviewer: utilityService.getValue(item.reviewer, '_id'),
                isAdmin : 1,
                relationship: item.reviewer_type == 'self' ? 'self_review' : item.reviewer_type,
                status: 4, //$scope.manageReviewCycleModal && $scope.manageReviewCycleModal.hideMyTeam ? utilityService.getValue($routeParams, 'status') : null,
                admin: 3,
            });
        };
        $scope.goBack = function() {
            utilityService.getValue($routeParams, 'cycle') 
                ? $location.url('/dashboard/my-team').search({subtab: 'feedback'})
                : $window.history.back();            
        };
        $scope.isDirectReports = function() {
            return utilityService.getValue($routeParams, 'direct_reportee') == "true"
                || utilityService.getValue($routeParams, 'direct_reportee') == true;
        };
        $scope.viewDevelopmentPlan = function(item) {
            $scope.overall.developmentPlan = item.development_plans;
            $scope.openModal();
        };        
        $scope.exportToCsv = function() {
           var empDetailsData = service.buildExportData($scope.overall);
            utilityService.exportToCsv(empDetailsData.content, 'individual-review-timeline.csv');
        };
        $scope.updatePaginationSettings('review_overall');

        $scope.updateCount = function () {
            var tempCount = 0;
            angular.forEach($scope.overall.filteredList, function (value, key) {
                if (value.isChecked) {
                    tempCount += 1;
                }
            }); 
            $scope.overall.selectedCount = tempCount;
        };        
        $scope.isIndeterminateComplted = function () {
            if ($scope.overall.selectedCount > 0) {
                return $scope.overall.selectedCount != $scope.overall.filteredList.length;
            } else {
                return false;
            }
        };        
        $scope.isAllSelected = function () {
            if ($scope.overall.filteredList.length) {
                return $scope.overall.selectedCount == $scope.overall.filteredList.length;
            } else {
                return false;
            }
        };        
        $scope.selectMultipleToChange = function () {
            var count = 0;
            if ($scope.overall.selectedCount == $scope.overall.filteredList.length) {
                angular.forEach($scope.overall.filteredList, function (value, k) {
                    value.isChecked = false;
                });
            } else {
                angular.forEach($scope.overall.filteredList, function (value, k) {
                    if (!value.released) {
                        value.isChecked = true;
                    }
                    if (value.isChecked) {
                        count += 1;
                    }
                });
            }
            $scope.overall.selectedCount =  count;
        };
        var successErrorCallback = function (data, section) {
            if(data.status == 'success'){
                angular.forEach($scope.overall.filteredList, function (value, key) {
                    value.isChecked = false;
                });
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                $scope.overall.selectedCount = 0;
                getIndividualReviewDetails();
                if (section === 'individual-timeline') {
                    $scope.closeModal('individualTimeline');
                }                
            } else {
                alert(utilityService.getValue(data, 'message'));
            }
        };
        $scope.updateIndividualTimeline = function () {
            var url = service.getUrl('changeTime') + "/" + utilityService.getValue($routeParams, 'cycle_id'),
                payload = service.buildChangeTimelinePaylod($scope.overall);
                        
            serverUtilityService.patchWebService(url, payload)
                .then(function (data){
                    successErrorCallback(data, 'individual-timeline');
                });
        };
        $scope.changeIndividualTimeline = function () {
            $scope.overall.individualTimeline = service.buildDefaultIndividualTimelineObject();
            $scope.openModal('individualTimeline', 'change-individual-timeline.tmpl.html', 'md');
        };

        /***** Start Send Remainder Section *****/
        $scope.sendReminder = function (isIndividual, item, type, reviewer_type) {
            if(!$scope.manageReviewCycleModal.status 
                || $scope.manageReviewCycleModal.status == 4) {
                return;
            }
            $scope.overall.isRemainderClicked = true;
            reviewer_type = reviewer_type || null;

            var url = service.getUrl('sendReminder'),
                payload = {
                    master_emp_id: utilityService.getStorageValue('loginEmpId'),
                    slave_emp_id: isIndividual ? utilityService.getValue(item, '_id') 
                        : service.extractReviewerIds($scope.overall.filteredList),
                    type: type,
                    request_id: utilityService.getValue($routeParams, 'cycle_id')
                };

            if (reviewer_type) {
                payload.reviewer_type = reviewer_type;
            }
            
            serverUtilityService.postWebService(url, payload)
                .then(function (data){
                    $scope.overall.isRemainderClicked = false;
                    successErrorCallback(data, 'send-remainder');
                });
        };
        /***** End Send Remainder section *****/

        /********* Start Angular Modal Section *********/
        $scope.openModal = function (instance, templateUrl, size) {
            instance = instance || 'developmentPlan';
            templateUrl = templateUrl || 'development-plan.tmpl.html';
            size = size || 'lg';

            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass:'fadeEffect',
                size: size
            });
        };        
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }           
        };
        /********* End Angular Modal Section *********/
        
    }
]);