app.controller('ReviewOverallDetailsController', [
	'$scope', '$routeParams', '$location', '$window', 'utilityService', 'ServerUtilityService', 'ManagerReviewService', '$modal', 'FORM_BUILDER',
	function ($scope, $routeParams, $location, $window, utilityService, serverUtilityService, service, $modal, FORM_BUILDER) {
        var allFilterObject = service.buildAllFilterObject(),
            cycleId = utilityService.getValue($routeParams, 'cycle')
                ? utilityService.getValue($routeParams, 'cycle') 
                : utilityService.getValue($routeParams, 'cycle_id');

        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.overall = service.buildOverallObject($routeParams);
        $scope.resetAllTypeFilters();
        $scope.buildAppraisalTabTitle();
        $scope.resetFacadeCountObject(allFilterObject);
        
        var getRecommendedForPromotion = function(value) {
            var isPromoted = null;
            
            if (utilityService.getValue($routeParams, 'cycle_id')) {
                isPromoted =  value.reviewer_type == 'self' || value.reviewer_type == 'direct_reports'  
                    ? null : utilityService.getInnerValue(value, "recommended_for_promotion", "11");
            } else {
                isPromoted = utilityService.getInnerValue(value, "recommended_for_promotion", "11");
            }

            return isPromoted;    
        };
        var traverseWithinObject = function(data) {
            var mapObject =  service.buildRatingMappingObject(data),
                ratingDetails = utilityService.getValue(data, 'rating_details');
           
            angular.forEach(ratingDetails, function(value, key) {
                value.goal_rating = utilityService.getInnerValue(value, "rating", "11");
                value.goal_rating_text = value.goal_rating ? mapObject[value.goal_rating] : null;
                value.competency_rating = utilityService.getInnerValue(value, "rating", "12");
                value.competency_rating_text = value.competency_rating ? mapObject[value.competency_rating] : null;
                value.recommended_for_promotion = getRecommendedForPromotion(value);                             
                value.revieweeFullName = utilityService.getInnerValue(value, 'reviewee', 'full_name');
                value.reviewerFullName = utilityService.getValue(value, 'is_anonymous') 
                    ? 'Anonymous' : utilityService.getInnerValue(value, 'reviewer', 'full_name');
                $scope.calculateFacadeCountOfAllFilters(ratingDetails, allFilterObject, value);   
            });
            angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);

            return ratingDetails;
        };
        var reBuildOtherRelationsObject = function () {
            $scope.overall.otherRelations.enabled = Boolean(utilityService.getStorageValue('enable_other_relations_' + cycleId));
            $scope.overall.otherRelations.object = JSON.parse(utilityService.getStorageValue('other_relations_' + cycleId));
            utilityService.rebuildReviewerNameForRelationship($scope.overall.relationship.mapping, cycleId);
            utilityService.rebuildFilterObjectForRelationship($scope.overall.relationFilterList, cycleId);
        };
        var overallDetailsCallback = function(data) {
            reBuildOtherRelationsObject();
            $scope.overall.summary = utilityService.getValue(data, 'summary');
            $scope.overall.settings = utilityService.getValue(data, 'settings');
            $scope.overall.rating_details = traverseWithinObject(data);                    
            $scope.overall.graph = service.buildGraphObject(data.rating_details);
            $scope.overall.visible = true;
        };             
        var getReviewOverallDetails = function() {
            if (utilityService.getValue($routeParams, 'cycle')) {
                var url = service.getUrl('details') + "/" + utilityService.getValue($routeParams, 'cycle');
            }
            if (utilityService.getValue($routeParams, 'cycle_id')) {
               var url = service.getUrl('adminDetails') + "/" + utilityService.getValue($routeParams, 'cycle_id');
            }
            serverUtilityService.getWebService(url, service.buildGetParams($routeParams))
                .then(function(data) {
                    overallDetailsCallback(data.data);
                });
        };
        var otherRelationsCallback = function (data) {
            $scope.overall.otherRelations.enabled = utilityService.getInnerValue(data, 'data', 'is_other_relation', false);
            $scope.overall.otherRelations.list = utilityService.getInnerValue(data, 'data', 'details', []);
            $scope.overall.otherRelations.object = utilityService.buildOtherRelationsObject($scope.overall.otherRelations.list);
            utilityService.setOtherRelationsWithinStorage(cycleId, $scope.overall.otherRelations);
            getReviewOverallDetails();
        };
        var getOtherRelations = function () {
            var url = service.getUrl('otherRelations') + "/" + cycleId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    otherRelationsCallback(data);                         
                });
        };
        getOtherRelations();
                    
        $scope.sortBy = function(object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };
        $scope.viewReviewCycleFeedback = function(as, item) {
            $location.url('dashboard/view-feedback').search({
                as: as, 
                cycle: utilityService.getValue($routeParams, 'cycle') ? utilityService.getValue($routeParams, 'cycle') : utilityService.getValue($routeParams, 'cycle_id'),                
                reviewee: utilityService.getValue(item.reviewee, '_id'),
                reviewer: utilityService.getValue(item.reviewer, '_id'),
                isAdmin : utilityService.getValue($routeParams, 'rel_id') ? 0 : 1,
                relationship: item.reviewer_type == 'self' ? 'self_review' : item.reviewer_type,
                status: $scope.manageReviewCycleModal && $scope.manageReviewCycleModal.hideMyTeam ? utilityService.getValue($routeParams, 'status') : null,
                admin: $scope.manageReviewCycleModal && $scope.manageReviewCycleModal.hideMyTeam ? 3 : null,
            });
        };
        $scope.checkUncheckAll = function() {
            angular.forEach($scope.overall.filteredList, function(value, key) {
                value.isChecked = $scope.overall.isChecked;
            });
        };
        var sendRemainderCallback = function(data) {
            utilityService.showSimpleToast(data.message);
            $scope.overall.isChecked = false;
            $scope.checkUncheckAll();
        };
        $scope.sendRemainder = function() {
            var url = service.getUrl('remainder'),
                payload = service.buildRemainderPayload($scope.user.loginEmpId, $scope.overall.filteredList);

            if(!payload.master_emp_id.length || !payload.slave_emp_id.length) {
                console.log("Please select employee(s) first to send remainder.");
                return false;
            }

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    sendRemainderCallback(data);
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
           var empDetailsData = service.buildOverallRatingExportListData($scope.overall);
            utilityService.exportToCsv(empDetailsData.content, 'overall-rating.csv');
        };
        $scope.updatePaginationSettings('review_overall');

        /*** Start: Recommendation for promotion Section ****/
        var traverseQuestionList = function(questionList, isSummary) {
            isSummary = angular.isDefined(isSummary) ? isSummary : false;
            angular.forEach(questionList, function(value, key) {
                if(value.question_type != $scope.questionTypeConstant.checkbox 
                    && utilityService.getValue(value, 'answer') && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];                 
                }
            });
        };
        $scope.syncPromotionRecommendationData = function (item) {
            $scope.recommendationQuestionList = [];

            var url = service.getUrl('recommendationDetails') + '/' + cycleId,
                params = {
                    reviewee: utilityService.getInnerValue(item, 'reviewee', '_id'),
                    reviewer: utilityService.getInnerValue(item, 'reviewer', '_id'),
                    relationship: utilityService.getValue(item, 'reviewer_type')
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    response = utilityService.getValue(data, 'data');                    
                    $scope.overall.recommendation_id = utilityService.getValue(response, 'recommendation_id');
                    $scope.recommendationQuestionList = utilityService.getInnerValue(response, 'template_detail', 'questions', []);
                    traverseQuestionList($scope.recommendationQuestionList);
                    $scope.openModal('promotionRecommendation', 'promotion-recommendation-question.tmpl.html');
                });
        };

        $scope.downloadAnswerAttachment = function(item) {
            var url = service.getUrl('downloadAnswerAttachment') 
                + "/" + utilityService.getValue($scope.overall, 'recommendation_id') 
                + "/" + item._id;

            $scope.viewDownloadFileUsingForm(url);
        };
        /*** End: Recommendation for promotion Section ****/

        /********* Start Angular Modal Section *********/
        $scope.openModal = function (instance, templateUrl) {
            instance = instance || 'developmentPlan';
            templateUrl = templateUrl || 'development-plan.tmpl.html';

            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass:'fadeEffect',
                size: 'lg'
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