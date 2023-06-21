app.controller('AdminManageSelfEvaluationController', [
    '$scope', '$rootScope', '$location', '$routeParams', '$modal', '$mdDialog', 'AdminManageReviewCycleService', 'utilityService', 'ServerUtilityService', 'FORM_BUILDER', 'SampleResponseService',
    function ($scope, $rootScope, $location, $routeParams, $modal, $mdDialog, service, utilityService, serverUtilityService, FORM_BUILDER, sampleResponseService) {
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.resetAllTypeFilters();        
        $scope.selfEvalObj = service.buildSelfEvalObject($routeParams);
        $scope.midTermAppraisal = {
            comment: null
        };
        $scope.overwriteRating = {
            newRating: null,
            currentObject: null,
            minValue: null,
            maxValue: null
        };

        var cycleId = utilityService.getValue($routeParams, 'cycle_id');
        var allFilterObject = [{
            countObject: 'group',
            isGroup: true, 
            collection_key: utilityService.getValue($scope.manageReviewCycleModal, 'selectedTabSlug') === 'selfEval' ? 'employee_preview' : 'reviewee'
        }];
        var buildList = function (data){
            allFilterObject.push({countObject: 'status', key:'review_status'});
            angular.forEach(data, function (v, k){
                v.full_name = v.employee_preview.full_name;
                v.employee_code = v.employee_preview.emp_code;
                v.reviewStatus = $scope.selfEvalObj.reviewStatusObj[v.review_status];
                $scope.calculateFacadeCountOfAllFilters(data, allFilterObject, v);
            });
        };        
        var getSelfEvalDetails = function () {
            var url = service.getUrl('selfEvaldetails') + '/' 
                + $scope.selfEvalObj.routeFlags.cycleId;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    buildList(data.data.self);
                    $scope.selfEvalObj.list = data.data;
                    $scope.selfEvalObj.removeList = angular.copy($scope.selfEvalObj.list.self);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.selfEvalObj.isListVisible = data.data;
                });
        };
        if (utilityService.getValue($scope.manageReviewCycleModal, 'selectedTabSlug') === 'selfEval') {
            $scope.resetFacadeCountObject(allFilterObject);
            getSelfEvalDetails();
            $scope.updatePaginationSettings('manage_cycle_self_eval');
        }        
        $scope.deleteSelfEvalEmployee = function () {
            if(!$scope.manageReviewCycleModal.status 
                || $scope.manageReviewCycleModal.status == 4) {
                return;
            }
            var url = service.getUrl('deleteReviewee') 
                + "/" + $scope.selfEvalObj.routeFlags.cycleId,
                payload = {
                    emp_id: $scope.manageReviewCycleModal.mulipleSelected
                };

            serverUtilityService.patchWebService(url, payload)
                .then(function (data){
                    if(data.status == 'success'){
                        utilityService.showSimpleToast(data.message);
                        $scope.manageReviewCycleModal.mulipleSelected = [];
                        getSelfEvalDetails();
                        $scope.closeModal('removeReviewCycleSelfEval');
                    }
                });
        };        
        
        /***** Completed Review *****/        
        /* $scope.viewReviewCycleFeedback = function(item) {
            $location.url('dashboard/view-feedback').search({
                as: 'reviewee', 
                cycle: utilityService.getValue($routeParams, 'cycle_id'),                
                reviewee: utilityService.getValue(item.reviewee, '_id'),
                reviewer: utilityService.getValue(item.reviewer, '_id'),
                isAdmin : utilityService.getValue($routeParams, 'rel_id') ? 0 : 1,
                relationship: item.reviewer_type == "self" ? "self_review" : item.reviewer_type,
                admin: 2,
                status: utilityService.getValue($routeParams, 'status')
            });
        }; */
        $scope.viewReviewCycleFeedback = function(item) {
            var searchParams = {
                as: 'reviewee', 
                cycle: utilityService.getValue($routeParams, 'cycle_id'),                
                reviewee: utilityService.getValue(item.reviewee, '_id'),
                reviewer: utilityService.getValue(item.reviewer, '_id'),
                isAdmin : utilityService.getValue($routeParams, 'rel_id') ? 0 : 1,
                relationship: item.reviewer_type == "self" ? "self_review" : item.reviewer_type,
                admin: 2,
                status: utilityService.getValue($routeParams, 'status')
            };
            $scope.redirectUsingNewTab('dashboard/view-feedback', searchParams);                        
        };        
        var buildCompletedList = function (data){
            angular.forEach(data, function (v, k){
                v.revieweeFullName = v.reviewee.full_name;
                v.revieweeEmployeeCode = utilityService.getInnerValue(v, 'reviewee', 'emp_code');
                v.reviewerFullName = v.reviewer.full_name;
                v.reviewerEmployeeCode = utilityService.getInnerValue(v, 'reviewer', 'employee_code');
                v.reviewerType = $scope.selfEvalObj.buildManagerTypeName[v.reviewer_type];
                //v.overallRating = v.reviewer_type !== 'peer' ? utilityService.getValue(v, 'overall_rating', 'N/A') : 'N/A';
                v.overallRating = utilityService.getValue(v, 'overall_rating') > 0 
                    ? utilityService.getValue(v, 'overall_rating', '') : '';

                if (utilityService.getValue($scope.manageReviewCycleModal, 'status') != 4
                    && utilityService.getValue($scope.manageReviewCycleModal, 'can_admin_release')) {
                    v.releaseStatus = utilityService.getValue(v, 'can_admin_release') 
                        ? (v.released ? "Released" : 'Not Released') : 'N/A';
                }

                v.is_recommended_for_promotion_text = '';
                if (utilityService.getInnerValue(v, 'recommended_for_promotion', 11) 
                    || utilityService.getInnerValue(v, 'recommended_for_promotion', 12)) {                    
                    if (utilityService.getValue(v, 'fill_recommendation') 
                        && utilityService.getInnerValue(v, 'recommendation_details', 'status') == 2) {
                        v.is_recommended_for_promotion_text = 'Yes'; 
                    } else if (!utilityService.getValue(v, 'fill_recommendation')) {
                        v.is_recommended_for_promotion_text = 'Yes';
                    }
                }
                
                if (utilityService.getInnerValue($scope.appraisal, 'visibility', 'breakupRating')) {
                    v.goalRating = utilityService.getInnerValue(v, 'rating', 11);
                    v.competencyRating = utilityService.getInnerValue(v, 'rating', 12);
                }

                $scope.calculateFacadeCountOfAllFilters(data, allFilterObject, v);
            });
            $scope.selfEvalObj.completedCsvColumn = {
                'Reviewee': 'revieweeFullName',
                'Reviewee Employee Id': 'revieweeEmployeeCode',
                'Reviewer': 'reviewerFullName',
                'Reviewer Employee Id': 'reviewerEmployeeCode',
                "Reviewer is Reviewee's": 'reviewerType',
                "Overall Rating": 'overallRating' 
            };
            if (utilityService.getInnerValue($scope.appraisal, 'visibility', 'breakupRating')) {
                $scope.selfEvalObj.completedCsvColumn[utilityService.getValue($scope.appraisal, 'titleTabOne', 'Goal') + ' Rating'] = 'goalRating';
                $scope.selfEvalObj.completedCsvColumn[utilityService.getValue($scope.appraisal, 'titleTabTwo', 'Competency') + ' Rating'] = 'competencyRating';
            }
            if (utilityService.getValue($scope, 'envMnt') === 'spinzone'
                || utilityService.getInnerValue($scope.appraisal, 'visibility', 'promotionRecommendation')) {
                $scope.selfEvalObj.completedCsvColumn["Recommended For Promotion"] = 'is_recommended_for_promotion_text';
            }
            if (utilityService.getValue($scope.manageReviewCycleModal, 'status') != 4
                && utilityService.getValue($scope.manageReviewCycleModal, 'can_admin_release')) {
                $scope.selfEvalObj.completedCsvColumn["Release Status"] = 'releaseStatus';
            }                        
        };        
        var getCompleteReviewDetails = function () {
            var url = service.getUrl('compltedReviews') 
                + '/' + $scope.selfEvalObj.routeFlags.cycleId;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    buildCompletedList(data.data);
                    $scope.selfEvalObj.list = data.data;
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.selfEvalObj.isListVisible = data.data;
                });
        };
        if (utilityService.getValue($scope.manageReviewCycleModal, 'selectedTabSlug') === 'completeReview') {
            allFilterObject.push({countObject: 'employeeStatus', key: 'reviewer_type'});
            $scope.resetFacadeCountObject(allFilterObject);
            getCompleteReviewDetails();
            $scope.updatePaginationSettings('manage_cycle_completed_review');
        }        
        $scope.releaseToReviewee = function(item) {
            if(!$scope.manageReviewCycleModal.status || $scope.manageReviewCycleModal.status == 4){
                return;
            }
            var url = service.getUrl('release') 
                + "/" + $scope.selfEvalObj.routeFlags.cycleId ,
                payload = service.buildReleaseToRevieweePaylod($scope.selfEvalObj.filteredList, item);
            
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if(data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        $scope.selfEvalObj.selectedCount = 0;
                        getCompleteReviewDetails();
                    }
                });
        };        
        $scope.updateCount = function () {
            var count1 = 0;
            angular.forEach($scope.selfEvalObj.filteredList, function (value, key) {
                if (value.isChecked) {
                    count1 += 1;
                }
            }); 
            $scope.selfEvalObj.selectedCount =  count1;
        };        
        $scope.isIndeterminateComplted = function () {
            if ($scope.selfEvalObj.selectedCount > 0) {
                return $scope.selfEvalObj.selectedCount != $scope.selfEvalObj.filteredList.length;
            } else {
                return false;
            }
        };        
        $scope.isAllSelected = function () {
            if ($scope.selfEvalObj.filteredList.length) {
                return $scope.selfEvalObj.selectedCount == $scope.selfEvalObj.filteredList.length;
            } else {
                return false;
            }
        };        
        $scope.selectMultipleToRelease = function (isAll) {
            var count = 0;
            if ($scope.selfEvalObj.selectedCount == $scope.selfEvalObj.filteredList.length) {
                angular.forEach($scope.selfEvalObj.filteredList, function (value, k) {
                    value.isChecked = false;
                });
            } else {
                angular.forEach($scope.selfEvalObj.filteredList, function (value, k) {
                    if (!value.released) {
                        value.isChecked = true;
                    }
                    if (value.isChecked) {
                        count += 1;
                    }
                });
            }
            $scope.selfEvalObj.selectedCount =  count;
        };        
        $scope.openModalSelfEval = function(instance, templateUrl, size) {
            size = angular.isDefined(size) ? size : 'sm';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope:$scope,
                backdrop: 'static',
                size: size,
                windowClass:'fadeEffect'
            });
        };

        /***** Start: Recommendation for promotion Section *****/
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

            var url = service.getUrl('recommendationDetails') 
                + '/' + utilityService.getValue($routeParams, 'cycle_id'),
                params = {
                    reviewee: utilityService.getInnerValue(item, 'reviewee', '_id'),
                    reviewer: utilityService.getInnerValue(item, 'reviewer', '_id'),
                    relationship: utilityService.getValue(item, 'reviewer_type')
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    response = utilityService.getValue(data, 'data');                    
                    $scope.selfEvalObj.recommendation_id = utilityService.getValue(response, 'recommendation_id');
                    $scope.recommendationQuestionList = utilityService.getInnerValue(response, 'template_detail', 'questions', []);
                    traverseQuestionList($scope.recommendationQuestionList);
                    $scope.openModal('promotionRecommendation', 'promotion-recommendation-question.tmpl.html');
                });
        };
        $scope.downloadAnswerAttachment = function(item) {
            var url = service.getUrl('downloadAnswerAttachment') 
                + "/" + utilityService.getValue($scope.selfEvalObj, 'recommendation_id') 
                + "/" + item._id;

            $scope.viewDownloadFileUsingForm(url);
        };
        /*** End: Recommendation for promotion Section ****/

        /*** Start: Mid Term Appraisal Comment Section ***/
        $scope.viewMidTermAppraisalComment = function (item) {
            $scope.midTermAppraisal.comment = utilityService.getInnerValue(item, 'midterm_appraisal_details', 'comment');
            $scope.openModal('midTermAppraisalComment', 'midterm-appraisal-comment.tmpl.html', 'sm');
        };
        /*** End: Mid Term Appraisal Comment Section ***/

        /***** Start Overwrite Rating *****/
        var extractRatingMinMaxValue = function () {
            $scope.manageReviewCycleModal.ratingSettingsArray = [];
            
            angular.forEach($scope.manageReviewCycleModal.rating_settings, function(value, key) {
                $scope.manageReviewCycleModal.ratingSettingsArray.push({
                    score: parseInt(key, 10),
                    description: value
                });
            });

            $scope.manageReviewCycleModal.ratingSettingsArray.sort(utilityService.dynamicSort("-score"));
            $scope.overwriteRating.minValue = $scope.manageReviewCycleModal.ratingSettingsArray[$scope.manageReviewCycleModal.ratingSettingsArray.length - 1].score;
            $scope.overwriteRating.maxValue = $scope.manageReviewCycleModal.ratingSettingsArray[0].score;
        };
        var setOverallRatingObject = function(item) {            
            $scope.overwriteRating.currentObject = item || null;
            $scope.overwriteRating.newRating = null;
            extractRatingMinMaxValue();
        };
        $scope.overwriteOverallRating = function(item) {
            setOverallRatingObject(item);
            $scope.openModalSelfEval('overwriteRating', 'overwriteRating.tmpl.html', 'md');
        };
        var updateOverallRatingCallback = function (data) {
            if(data.status == 'success'){
                utilityService.showSimpleToast(data.message);
                $scope.overwriteRating.currentObject.overall_rating = $scope.overwriteRating.newRating; 
                $scope.closeModal('overwriteRating');
            } else {
                alert(utilityService.getValue(data, 'message'));
            }
        };
        $scope.updateOverallRating = function() {
            var url = service.getUrl('updateOverallRating') + "/" + $scope.selfEvalObj.routeFlags.cycleId
                + "/" + utilityService.getInnerValue($scope.overwriteRating.currentObject, 'reviewee', '_id')
                + "/" + utilityService.getInnerValue($scope.overwriteRating.currentObject, 'reviewer', '_id'),
            payload = service.buildOverwriteRatingPayload($scope.overwriteRating);
            
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    updateOverallRatingCallback(data);
                });
        };
        $scope.isOverallRatingValueExists = function () {
            var isRatingExists = false;

            angular.forEach($scope.manageReviewCycleModal.rating_settings, function (value, key) {
                if ($scope.overwriteRating.currentObject.overall_rating == key) {
                    isRatingExists = true;
                }
            });

            return isRatingExists;
        };
        $scope.changeRatingHandler = function (newRating, oldRating) {
            if (newRating < $scope.overwriteRating.minValue 
                || newRating > $scope.overwriteRating.maxValue) {
                newRating = oldRating;
            }
        };
        /***** End Overwrite Rating *****/

        /****** Start: Open Modal *******/
        $scope.openModal = function (instance, templateUrl, size){
            size = angular.isDefined(size) ? size : 'lg';

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
        /****** End: Close Modal *******/
        
        /***** Start Confirm Dialog *****/
        var showConfirmDialog = function(event, functionName, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to proceed with this?')
                .textContent('Please double check every thing before taking this action.')
                .ariaLabel('Lucky day')
                .targetEvent(event)
                .ok('Please do it!')
                .cancel('No, want to cancel');

            $mdDialog.show(confirm).then(function() {
                functionName(item);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function(event, functionName, item) {
            showConfirmDialog(event, functionName, item);
        };
        /***** End Confirm Dialog *****/

        var reBuildOtherRelationsObject = function () {
            $scope.selfEvalObj.otherRelations.enabled = Boolean(utilityService.getStorageValue('enable_other_relations_' + cycleId));
            $scope.selfEvalObj.otherRelations.object = JSON.parse(utilityService.getStorageValue('other_relations_' + cycleId));
            utilityService.rebuildReviewerNameForRelationship($scope.selfEvalObj.buildManagerTypeName, cycleId);
        };
        var otherRelationsCallback = function (data) {
            $scope.selfEvalObj.otherRelations.enabled = utilityService.getInnerValue(data, 'data', 'is_other_relation', false);
            $scope.selfEvalObj.otherRelations.list = utilityService.getInnerValue(data, 'data', 'details', []);
            $scope.selfEvalObj.otherRelations.object = utilityService.buildOtherRelationsObject($scope.selfEvalObj.otherRelations.list);
            utilityService.setOtherRelationsWithinStorage(cycleId, $scope.selfEvalObj.otherRelations);
            reBuildOtherRelationsObject();
        };
        var getOtherRelations = function () {
            var url = service.getUrl('otherRelations') + "/" + cycleId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    otherRelationsCallback(data);                         
                });
        };
        utilityService.getStorageValue('other_relations_' + cycleId)
            ? reBuildOtherRelationsObject() : getOtherRelations();
    }
]);