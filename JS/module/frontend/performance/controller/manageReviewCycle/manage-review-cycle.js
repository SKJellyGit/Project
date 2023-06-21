app.controller('AdminManageReviewCycleController', [
    '$scope', '$timeout', '$routeParams', '$location', '$modal', '$mdDialog', '$q', 'AdminManageReviewCycleService', 'utilityService', 'ServerUtilityService',
    function ($scope, $timeout, $routeParams, $location, $modal, $mdDialog, $q, service, utilityService, serverUtilityService) {

        $scope.manageReviewCycleModal = service.buildManageReviewCycleModalObject($routeParams);
        var cycleId = $scope.manageReviewCycleModal.cycleId;
        $scope.tabVisibility = service.buildTabVisibilityObject();
        $scope.relationWise = {
            setting: null
        };
        $scope.buildAppraisalTabTitle();

        $scope.goBack = function () {
            $location.url('frontend/adminPerformance').search({tab: 2, subtab:0});
        };
        $scope.selectUnselectAll = function (key, list, collection, condition, embed) {
            if (angular.isArray(list)) {
                var listLength = list.length;
            }
            if (angular.isObject(list)) {
                listLength = Object.keys(list).length;
            }
            if (listLength == collection.length) {
                angular.forEach(list, function (v, k) {
                    var i = angular.isDefined(embed) ?  $.inArray(v[embed][key], collection) :  $.inArray(v[key], collection);
                    if (i > -1) {
                       collection.splice(i, 1);
                    }
                });
            } else {
                var tempCollection = [];
                angular.forEach(list, function (v, k) {
                    if (eval(condition)) {
                        if (angular.isDefined(embed)) {
                            tempCollection.push(v[embed][key]);
                        } else{
                            tempCollection.push(v[key]);
                        }
                    }
                });
              angular.copy(tempCollection, collection);
            }
        };        
        $scope.selectUnselectIndividual = function (value, collection) {
            var i = $.inArray(value, collection);
            i > -1 ? collection.splice(i, 1) : collection.push(value);
        };
        $scope.sendReminder = function (isIndividula, item, type) {
            if(!$scope.manageReviewCycleModal.status 
                || $scope.manageReviewCycleModal.status == 4) {
                return;
            }
            $scope.manageReviewCycleModal.isRemainderClicked = true;
            var url = service.getUrl('sendReminder'),
                payload = {
                    master_emp_id: utilityService.getStorageValue('loginEmpId'),
                    slave_emp_id: isIndividula ? [item._id] : $scope.manageReviewCycleModal.mulipleSelected,
                    type: type,
                    request_id: $scope.manageReviewCycleModal.cycleId
                };

            serverUtilityService.postWebService(url, payload)
                .then(function (data){
                    $scope.manageReviewCycleModal.isRemainderClicked = false;
                    if (data.status == "success"){
                        utilityService.showSimpleToast(data.message);
                    }
                });
        };        
        $scope.reOpenReview = function (item, collection, index, comment) {
            if (!$scope.manageReviewCycleModal.status 
                || $scope.manageReviewCycleModal.status == 4) {
                return;
            }
            var url = service.getUrl('reopenRequest'),
                payload = {
                    appraisal_cycle_id: $scope.manageReviewCycleModal.cycleId,
                    reviewee: item.reviewee._id,
                    reviewer: item.reviewer._id,
                    relationship: item.reviewer_type == "self" ? 'self_review' : item.reviewer_type,
                    reopen_comment: comment,
                };

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        collection.splice(index, 1);
                        if ($scope.manageReviewCycleModal.selectedTabSlug === 'completeReview') {
                            $scope.manageReviewCycleModal.graphData = {};
                            $scope.manageReviewCycleModal.isGraphVisible = false;
                            getManageCycleChartData('compltedReviewsChart', 'total_reviews');
                        }
                    } else {
                        alert("Something went wrong.");
                    }
                });
        };
        var buildFinalGraphObject = function (name, valueCount, totalCount) {
            function calculatePercentage(value, total) {
                var percentage = ((value / total) * 100),
                    fixed = percentage.toFixed(2);
                
                return parseFloat(fixed);
            }

            var obj = {
                name: name,
                y: valueCount > 0 ? calculatePercentage(valueCount, totalCount) : 0,
                amount: valueCount,
                sliced: false,
                selected: false
            };

            return obj;
        };
        var graphDataReviewStatusCallback = function (data, totalKey) {
            var gData = [];
            gData.push(buildFinalGraphObject('Completed', data.reviews_completed, data[totalKey]));
            gData.push(buildFinalGraphObject('Not Started', data.reviews_not_started, data[totalKey]));
            gData.push(buildFinalGraphObject('In Progress', data.reviews_in_progress, data[totalKey]));
            $scope.manageReviewCycleModal.graphData.gData = gData;
            $scope.manageReviewCycleModal.graphData.data = data;
            $scope.manageReviewCycleModal.can_admin_release = utilityService.getValue(data, 'can_admin_release', false);
            $scope.manageReviewCycleModal.isGraphVisible = true;
            $scope.manageReviewCycleModal.rating_settings = utilityService.getValue(data, 'rating_settings');
            $scope.manageReviewCycleModal.ratings_range = utilityService.getValue(data, 'ratings_range', []);
        };        
        var getManageCycleChartData = function (urlKey, totalKey) {
            var url = service.getUrl(urlKey) + '/' 
                + $scope.manageReviewCycleModal.cycleId;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    graphDataReviewStatusCallback(data.data, totalKey);
                });
        };        
        $scope.endSelfEvalCycle = function() {
            var url = service.getUrl('endSelfEvaluationCycle') + "/" 
                + $scope.manageReviewCycleModal.cycleId;

            serverUtilityService.patchWebService(url)
                .then(function (data){
                    if(data.status == 'success'){
                        utilityService.showSimpleToast(data.message);
                        $scope.manageReviewCycleModal.graphData.data.self_evaluation_phase.is_ended = true;
                    }
                });
        };
        $scope.exportCsv = function (data, column, name){
            var finalData = service.buildCsvData(data, column, name);
            utilityService.exportToCsv(finalData, name + ".csv");
        };        
        $scope.getCallTabwise = function (key) {
            $scope.manageReviewCycleModal.selectedTabSlug = key;
            $scope.manageReviewCycleModal.graphData = {};
            $scope.manageReviewCycleModal.mulipleSelected = [];
            $scope.manageReviewCycleModal.isGraphVisible = false;
            $scope.resetAllTypeFilters();
            switch (key) {
                case 'selfEval':
                    getManageCycleChartData('selfEvalChart', 'total_reviewees');
                    break;

                case 'reviewStatus':
                    getManageCycleChartData('reviewStatusChart', 'total_reviews');
                    break;

                case 'completeReview':
                    getManageCycleChartData('compltedReviewsChart', 'total_reviews');
                    break;

                case 'overallRating':
                    break;

                case 'individualReviewTimeline':
                    break;

                case 'rejectedReviews':
                    break;

                case 'consolidatedReviews':
                    break;

                case 'potentialgrid':
                    break;

                default:
                    getSelfEvalChartData();
            }
        };

        /***** Start: Review Cycle Timeline Section *****/
        $scope.getReviewCycleTimeLine = function () {
            $scope.manageReviewCycleModal.reviewCycleTimeline = null;
            $scope.manageReviewCycleModal.isRCTVisible = false;
            var url = service.getUrl('reviewCycleTimeline') + '/' + $scope.manageReviewCycleModal.cycleId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    service.buildReviewCycleTimeLineData(data.data);
                    $scope.manageReviewCycleModal.reviewCycleTimeline = data.data;
                    $scope.manageReviewCycleModal.isRCTVisible = true;
                    $scope.openModal('reviewCycleTimeline', 'reviewCycleTimeline.html');
                });
        };        
        $scope.changeReviewCycleTimeline = function () {
            if(!$scope.manageReviewCycleModal.status 
                || $scope.manageReviewCycleModal.status == 4) {
                return;
            }
            var url = service.getUrl('changeRCT') + '/' 
                    + $scope.manageReviewCycleModal.cycleId,
                payload= service.buildRCTPayload($scope.manageReviewCycleModal.reviewCycleTimeline);
            
            serverUtilityService.putWebService(url, payload)
               .then(function (data) {
                    if(data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        $scope.closeModal('reviewCycleTimeline');
                    } else {
                       alert("Something went worng.");
                    }
                });
        };
        /***** End: Review Cycle Timeline Section *****/
        
        var isBackTriggered = false;
        if(utilityService.getValue($routeParams, 'subtab')){
            $scope.manageReviewCycleModal.slectedTab = utilityService.getValue($routeParams, 'subtab');
            isBackTriggered = true;
        }
        if(isBackTriggered) {
            $timeout(function() {
                $location.search("subtab", null);
            }, 1000);
        }
        $scope.isOverallRatingTabVisible = function() {
            // Put all the cycles related appraisal only 
            var arrayIds = ['5b5af2376542845016000088', '5b5b329a39473e363ecaff73', 
                '5b5f0bbe39473ebf6ad976db', '5b600e9539473e1676a8d78b', '5b5f0bbe39473ebf6ad976db',
                '5b583e85052c5357048b4567', '5bae88be654284242e000036'];
                
            return arrayIds.indexOf(utilityService.getValue($routeParams, 'cycle_id')) >= 0;
        };
        var reBuildOtherRelationsObject = function () {
            $scope.manageReviewCycleModal.otherRelations.enabled = Boolean(utilityService.getStorageValue('enable_other_relations_' + cycleId));
            $scope.manageReviewCycleModal.otherRelations.object = JSON.parse(utilityService.getStorageValue('other_relations_' + cycleId));
            utilityService.rebuildReviewerNameForRelationship($scope.manageReviewCycleModal.reviewCycleTimelineName, cycleId);
            utilityService.rebuildFilterObjectForRelationship($scope.manageReviewCycleModal.relationFilterList, cycleId);
        };        
        var globalCycleSettingCallback = function (data, isConsolidatedRating) {
            reBuildOtherRelationsObject();
            $scope.tabVisibility.loaded = true;                    
            $scope.tabVisibility.enable = service.buildVisibilityEnableObject(data.data, isConsolidatedRating);
            $scope.relationWise.setting = service.buildRelationWiseSetting(data.data);
        };
        var getGlobalCycleSetting = function () {
            $q.all([
                serverUtilityService.getWebService(service.getUrl('acrossReviewerSetting') + '/' + $scope.manageReviewCycleModal.cycleId), 
                serverUtilityService.getWebService(service.getUrl('relationWiseSetting') + '/' + $scope.manageReviewCycleModal.cycleId),
                serverUtilityService.getWebService(service.getUrl('appraisalCycleSetting') + '/' + $scope.manageReviewCycleModal.cycleId),
            ]).then(function(data) {
                angular.copy(utilityService.getValue(data[0], 'data'), $scope.manageReviewCycleModal.acrossReviewer);
                if ($scope.manageReviewCycleModal.acrossReviewer.is_consolidated_rating) {
                    $scope.manageReviewCycleModal.acrossReviewer.weightageMapping = service.buildAcrossReviewerWeightageMappingObject(utilityService.getValue($scope.manageReviewCycleModal.acrossReviewer, 'consolidated_rating_breakup'));
                } 
                var appraisalSetting = utilityService.getValue(data[2], 'data');  
                $scope.manageReviewCycleModal.isPotentialGrid = false;   
                if(appraisalSetting['potential_grid'] != undefined && appraisalSetting['potential_grid'] != null) {
                    if(appraisalSetting['potential_grid'].enable_potential_grid) {
                        $scope.manageReviewCycleModal.isPotentialGrid = appraisalSetting['potential_grid'].enable_potential_grid;
                    }
                }          
                globalCycleSettingCallback(data[1], $scope.manageReviewCycleModal.acrossReviewer.is_consolidated_rating);                        
            });
        };
        var otherRelationsCallback = function (data) {
            $scope.manageReviewCycleModal.otherRelations.enabled = utilityService.getInnerValue(data, 'data', 'is_other_relation', false);
            $scope.manageReviewCycleModal.otherRelations.list = utilityService.getInnerValue(data, 'data', 'details', []);
            $scope.manageReviewCycleModal.otherRelations.object = utilityService.buildOtherRelationsObject($scope.manageReviewCycleModal.otherRelations.list);
            utilityService.setOtherRelationsWithinStorage(cycleId, $scope.manageReviewCycleModal.otherRelations);
            getGlobalCycleSetting();
        };
        var getOtherRelations = function () {
            var url = service.getUrl('otherRelations') + "/" + cycleId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    otherRelationsCallback(data);                         
                });
        };
        getOtherRelations();        

        /***** Start Confirm Dialog *****/
        var showConfirmDialog = function(event, functionName, item, list, index) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('Would you like to proceed with this?')
                .textContent('Please double check every thing before taking this action.')
                .placeholder('Write comment')
                .ariaLabel('Lucky day')
                .targetEvent(event)
                .ok('Please do it!')
                .cancel('No, want to cancel');

            $mdDialog.show(confirm).then(function(result) {
                functionName(item, list, index, result);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.confirmDialog = function(event, functionName, item, list, index) {
            showConfirmDialog(event, functionName, item, list, index);
        };
        /***** End Confirm Dialog *****/

        /***** Start Modal Section ****/
        $scope.openModal = function(instance, templateUrl) {
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope:$scope,
                backdrop: 'static',
                size: 'lg',
                windowClass:'fadeEffect'
            });
        };
        $scope.closeModal = function(instance) {
            $scope.modalInstance[instance].close();
        };
        /***** End Modal Section ****/

        $scope.loadRevieweeChartData = function () {
            getManageCycleChartData('reviewStatusChart', 'total_reviews');
        };
    }
]);