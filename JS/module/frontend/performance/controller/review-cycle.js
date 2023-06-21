app.controller('AdminReviewCycleController', [
    '$scope', '$timeout', '$routeParams', '$location', 'AdminReviewCycleService', 'utilityService', 'ServerUtilityService', 'Upload','$modal',
    function ($scope, $timeout, $routeParams, $location, AdminReviewCycleService, utilityService, serverUtilityService, Upload, $modal) {
        AdminReviewCycleService.cycleId = utilityService.getValue($routeParams, 'planId');
        $scope.reviewCycleObj = {
            modal: null,
            tab: utilityService.getValue($routeParams, 'step', 1),
            isLaunch: utilityService.getValue($routeParams, 'step'),
            page: utilityService.getValue($routeParams, 'page'),
            errorMessages: [],
            templateList: [],
            cycleId: utilityService.getValue($routeParams, 'planId'),
            stepCompleted : 0,
            tabSlugs: AdminReviewCycleService.buildTabSlug(),
            reviewerNameObj: AdminReviewCycleService.buildReviewerName(),
            reviewerOptionNameObj: AdminReviewCycleService.buildReviewerOptionName(),
            taday: new Date(),
            templateEditTypeList: {
                1: 'As per template + No edits',
                2: 'As per template + Employee AND/OR Manager edits'
            },
            unAssignedList: {
                okr: [],
                competency: [],
                promotionRecommendation: []
            },
            peer: {
                enabled: false
            },
            manager: {
                enabled: false
            },
            skip_manager: {
                enabled: false
            },
            systemRelationship: {
                list: [],
                maxCount: utilityService.systemRelationshipMaxCount
            },
            defaultRelationship: {
                list: ['Self', 'Reporting Manager', 'Skip Level Manager', 'Direct Reports', 'Peer']
            },
            otherRelations: {
                enabled: false,
                list: [],
                object: {}
            },
            visible: false,
            uploadedFile: null,
            isBulkVisible: true            
        };
        $scope.tabSection = AdminReviewCycleService.buildTabSectionObject();
        $scope.category = {
            goal: [],
            compentency: [],
            selected: null,
            previousName: null
        }
        $scope.hideForRelationships = function (key) {
            return key === 'peer' || key === 'direct_reports' || key.indexOf('_team') >= 0
        };
        $scope.reviewsTabSwitchHandler = function(key, value) {
            if(key === 'peer') {
                $scope.reviewCycleObj.peer.enabled = value.goal_review || value.competency_review;
                $scope.reviewCycleObj.modal.peer_reviewers_cap = value.goal_review || value.competency_review;
            }

            angular.forEach($scope.reviewCycleObj.modal.reviewAllSettings, function (v, k) {
                if (!$scope.hideForRelationships(k)) {
                    if (!value.goal_review && !value.competency_review && key == k) {
                        $scope.reviewCycleObj.modal['ask_' + k] = false;
                    }
                }
            });                                   
        };
        $scope.isSwitchEnabled = function () {
            var isEnabled = false;

            angular.forEach(utilityService.getInnerValue($scope.reviewCycleObj, 'modal', 'reviewAllSettings'), function (v, k) {
                if (!$scope.hideForRelationships(k)) {
                    isEnabled = isEnabled || (v.goal_review || v.competency_review);
                }
            });

            if (!isEnabled && angular.isDefined($scope.reviewCycleObj.modal) && $scope.reviewCycleObj.modal) {
                $scope.reviewCycleObj.modal.promotion_recommendation = false;
                $scope.reviewCycleObj.modal.is_midterm_appraisal = false;
            }

            return isEnabled;
        };
        var autoSyncPeerEnabled = function() {
            angular.forEach($scope.reviewCycleObj.modal.reviewAllSettings, function(value, key) {
                $scope.reviewsTabSwitchHandler(key, value);
            });
        };
        $scope.isConsolidated = false;
        var syncReviewCycleModal = function (modal) {
            $scope.reviewCycleObj.reviewerNameObj = AdminReviewCycleService.buildReviewerName();
            $scope.reviewCycleObj.modal = AdminReviewCycleService.buildReviewCycleModal(modal);            
            autoSyncPeerEnabled();
            $scope.isConsolidated = utilityService.getValue($scope.reviewCycleObj.modal, 'is_consolidated_rating', false);
            angular.forEach($scope.tabSection.list, function(val, key) {
                if(val.slug == 'potential_grid') {
                    val.visible = utilityService.getValue($scope.reviewCycleObj.modal, 'is_consolidated_rating', false);
                }
            })
            if(!$scope.reviewCycleObj.modal.ratings.length) {
                $scope.reviewCycleObj.modal.ratings = [{
                    score: null, 
                    description: null, 
                    isEdit: false
                }];
            }
        };        
        var getReviewCyclesettings = function (cycleId) {
            var url = AdminReviewCycleService.getUrl('reviewCycleSettings') + '/' + cycleId;
            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.reviewCycleObj.stepCompleted = parseInt(utilityService.getKeyByValue($scope.reviewCycleObj.tabSlugs, data.data.step_completed));
                    syncReviewCycleModal(data.data);
                    $scope.reviewCycleObj.visible = true;
                });
        };
        var getAllTemplates = function () {
            serverUtilityService.getWebService(AdminReviewCycleService.getUrl('getAllTemplate'))
                .then(function (data) {
                    angular.forEach(data.data, function (v,k) {
                        if(v.status){
                            $scope.reviewCycleObj.templateList.push(v);
                        }
                    });
                });
        };
        getAllTemplates();                
        var successCallback = function (data, tab, isGoBack, isConsolidated) {
            var nextTab = 0;
            if(isConsolidated != undefined && isConsolidated) {
                nextTab = (tab == 4) ? 4.5 : (tab == 4.5) ? 5 : parseInt(tab) + 1;
            } else {
                nextTab = parseInt(tab) + 1;
            }
            if(tab == 1 && !$scope.reviewCycleObj.cycleId) {
                $scope.reviewCycleObj.cycleId = data.data._id;
            }
            utilityService.showSimpleToast(data.message);
            if(isGoBack) {
                $scope.goBack();
            } else {
                $location.url('frontend/adminPerformance/reviewCycle').search({
                    planId: $scope.reviewCycleObj.cycleId, 
                    step: nextTab, 
                    moduleName: 'reviewCycle'
                });
                $scope.setTab(nextTab);
            }  
        };        
        var errorCallback = function (data) {
            if(data.status == 'error') {
                $scope.reviewCycleObj.errorMessages.push(data.message);
            } else {
                if(data.data.message && (angular.isArray(data.data.message) 
                    || angular.isObject(data.data.message))) {
                    angular.forEach(data.data.message, function (err, k) {
                        $scope.reviewCycleObj.errorMessages.push(err[0])
                    });
                } else {
                    $scope.reviewCycleObj.errorMessages.push(data.data.message);
                }
            }
        };        
        var successErrorCallback = function (data, tab, isGoBack, isConsolidated){
            data.status == 'success' ? successCallback(data, tab, isGoBack, isConsolidated)
                : errorCallback(data);
        };

        var potentialSettingCalculation = function() {
            //var ratingCalculation = false;
            var count = 0,
                totalPotential = 0;
            angular.forEach($scope.reviewCycleObj.modal.ratingPotentialSetting, function(val, key) {
                if($scope.reviewCycleObj.modal.ratingPotentialAssigned[key + '_assigned']) {
                    totalPotential = totalPotential + $scope.reviewCycleObj.modal.ratingPotentialSetting[key];
                } else {
                    $scope.reviewCycleObj.modal.ratingPotentialSetting[key] = null;
                }
                count = count + 1;
            });
            //return ratingCalculation;
        }

        $scope.saveCycleSettings = function (tab, isGoBack) {
            if(tab == 7){
                $scope.goBack();
            }

            if(tab == 4 && $scope.reviewCycleObj.modal.enable_rating 
                && $scope.reviewCycleObj.modal.ratings.length < 2) {
                $scope.reviewCycleObj.errorMessages.push("Minimum two levels of rating are required");
                return false;
            }

            if(tab == 4.5 && $scope.reviewCycleObj.modal.enable_potential_grid) {
                potentialSettingCalculation();
            }

            $scope.reviewCycleObj.errorMessages = [];
            var url = AdminReviewCycleService.getUrl('reviewCycleSettings'),
                payload = AdminReviewCycleService.buildReviewCyclePayload($scope.reviewCycleObj.modal, tab, $scope.reviewCycleObj.cycleId, $scope.reviewCycleObj.peer.enabled);
                if(!utilityService.getValue($routeParams, 'planId')){
                    payload.goal_category = $scope.category.goal.map(function(val){
                        return val.name
                    });
                    payload.compentency_category = $scope.category.compentency.map(function(val){
                        return val.name
                    });;
                }
                
                var isConsolidated = utilityService.getValue(payload, 'is_consolidated_rating', false);

                serverUtilityService.postWebService(url, payload)
                    .then(function (data) {
                        successErrorCallback(data, tab, isGoBack, isConsolidated);
                    });
        };        

        $scope.addMoreScores = function () {
            if ($scope.reviewCycleObj.modal.ratings.length) {
                $scope.reviewCycleObj.modal.ratings[$scope.reviewCycleObj.modal.ratings.length - 1]['isEdit'] = true;
            }
            
            $scope.reviewCycleObj.modal.ratings.push({score: null, description: null, isEdit: false});
        };  
              
        $scope.removeScore = function (index){
            $scope.reviewCycleObj.modal.ratings.splice(index, 1);
            if(!$scope.reviewCycleObj.modal.ratings.length){
                $scope.addMoreScores();
            }
        };

        $scope.removeOptions = function (index){
            $scope.reviewCycleObj.modal.options.splice(index, 1);
            if(!$scope.reviewCycleObj.modal.options.length){
                $scope.addMoreScores();
            }
        };

        $scope.toogleEdit = function (item){
            item.isEdit = !item.isEdit;
        };

        $scope.claculatePercentage = function (item, key1, key2) {
            item[key2] = 100 - item[key1];
        };

        $scope.setPercentage = function (value, modal, key) {
            if (key == 'self') {
                if ((modal.isGoalOkr && !modal.isCompetency) 
                    || (value.enable_rating_goal && !value.enable_rating_competency)) {
                    value.compentency_rate_percent = 0;
                    value.goal_rate_percent = 100;
                }
                if ((!modal.isGoalOkr && modal.isCompetency) 
                    || (!value.enable_rating_goal && value.enable_rating_competency)) {
                    value.compentency_rate_percent = 100;
                    value.goal_rate_percent = 0;
                }
            } else {
                if((modal.reviewAllSettings[key]['goal_review'] 
                    && !modal.reviewAllSettings[key]['competency_review']) 
                    || (value.enable_rating_goal && !value.enable_rating_competency)) {
                    value.compentency_rate_percent = 0;
                    value.goal_rate_percent = 100;
                }
                if((!modal.reviewAllSettings[key]['goal_review'] 
                    && modal.reviewAllSettings[key]['competency_review']) 
                    || (!value.enable_rating_goal && value.enable_rating_competency)) {
                    value.compentency_rate_percent = 100;
                    value.goal_rate_percent = 0;
                }
            }
        };        
        $scope.launchCycle = function () {
            var url = AdminReviewCycleService.getUrl('launchCycle') + '/' + $scope.reviewCycleObj.cycleId;
            serverUtilityService.patchWebService(url)
                .then(function (data) {
                    if(data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        $scope.goBack();
                    } else {
                        alert('Something went wrong.');
                    }
                });
        };
        var otherRelationsCallback = function (data) {
            $scope.reviewCycleObj.otherRelations.enabled = utilityService.getInnerValue(data, 'data', 'is_other_relation', false);
            $scope.reviewCycleObj.otherRelations.list = utilityService.getInnerValue(data, 'data', 'details', []);
            $scope.reviewCycleObj.otherRelations.object = utilityService.buildOtherRelationsObject($scope.reviewCycleObj.otherRelations.list);
            utilityService.setOtherRelationsWithinStorage($scope.reviewCycleObj.cycleId, $scope.reviewCycleObj.otherRelations);
            getReviewCyclesettings($scope.reviewCycleObj.cycleId);
        };
        var getOtherRelations = function () {
            var url = AdminReviewCycleService.getUrl('otherRelations') + "/" 
                + $scope.reviewCycleObj.cycleId;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    otherRelationsCallback(data);                         
                });
        };
        //getReviewCyclesettings($scope.reviewCycleObj.cycleId)
        $scope.reviewCycleObj.cycleId ? getOtherRelations() : syncReviewCycleModal();


        $scope.setTab = function (tab) {
            $scope.reviewCycleObj.errorMessages = [];
            if ($scope.reviewCycleObj.cycleId) {
                if (tab === 1) {
                    utilityService.removeStorageValue('enable_other_relations_' + $scope.reviewCycleObj.cycleId);
                    utilityService.removeStorageValue('other_relations_' + $scope.reviewCycleObj.cycleId);
                    getReviewCyclesettings($scope.reviewCycleObj.cycleId);
                } else {
                    if (utilityService.getStorageValue('other_relations_' + $scope.reviewCycleObj.cycleId)) {
                        var otherRelations = utilityService.getStorageValue('other_relations_' + $scope.reviewCycleObj.cycleId);
                        getReviewCyclesettings($scope.reviewCycleObj.cycleId);
                    } else {
                        getOtherRelations();
                    }                    
                }                
            }
            $scope.reviewCycleObj.tab = tab;
        };        
        $scope.goBack = function () {
            $location.url('frontend/adminPerformance').search({tab: 2, subtab:0});
        };        
        $scope.goTopreview = function (url) {
            $location.url(url).search({
                planId: $scope.reviewCycleObj.cycleId, 
                step: 7,
                moduleName: 'reviewCycle',
                page: 'previewPreviewCycle'
            });
        };

        $scope.numReviewCycleTab = function(tabname) {
            if(angular.isDefined(tabname)) {
                if(tabname == 'potentialGrid') {
                    return
                }
            }
        };

        var unAssignedListCallback = function(data) {
            angular.forEach(data.data, function(value, key) {
                if(value.type == 11) {
                    $scope.reviewCycleObj.unAssignedList.okr.push(value);
                } else if(value.type == 12) {
                    $scope.reviewCycleObj.unAssignedList.competency.push(value);
                } else if(value.type == 13) {
                    $scope.reviewCycleObj.unAssignedList.promotionRecommendation.push(value);
                }
            });

            $scope.reviewCycleObj.unAssignedList.okr.sort(utilityService.dynamicSort("-updated_at"));  
            $scope.reviewCycleObj.unAssignedList.competency.sort(utilityService.dynamicSort("-updated_at"));
            $scope.reviewCycleObj.unAssignedList.promotionRecommendation.sort(utilityService.dynamicSort("-updated_at"));
        };
        var getAllUnAssignedTemplates = function () {
            var url = AdminReviewCycleService.getUrl('allUnAssignedTemplate'),
                params = {
                    cycle_id: utilityService.getValue($routeParams, 'planId')
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    unAssignedListCallback(data);                       
                });
        };
        getAllUnAssignedTemplates();        
        $scope.addMore = function (list) {            
            var object = AdminReviewCycleService.buildDefaultRatingRangeObject(),
                findIndex = $scope.reviewCycleObj.modal.ratings_range.length - 1,                
                nextMaxValue = $scope.reviewCycleObj.modal.ratings_range[findIndex].min;
            
            object.max = nextMaxValue - .01;

            if (object.max > 0) {
                list.push(object);
            }            
        };
        $scope.removeRange = function (list, index){
            list.splice(index, 1);
            if(!list.length){
                $scope.addMore(list);
            }
        };

        $scope.enableDisableSelfEvaluation = function () {
            $scope.reviewCycleObj.modal.isSelfEvaluation = $scope.reviewCycleObj.modal.self_goal_review 
                || $scope.reviewCycleObj.modal.self_competency_review;
        };
        $scope.changeAssignWeights = function (value) {
            if (!value.weights_assigned) {
                value.can_admin_overwrite_rating = false;
            }
        };
        $scope.changeRatingTypeHandler = function (ratingType) {
            if (ratingType == 2) {
                $scope.reviewCycleObj.modal.ratings_range[0]['max'] = $scope.reviewCycleObj.modal.ratings[0].score;
                $scope.reviewCycleObj.modal.potential_grid_ratings_range[0]['max'] = $scope.reviewCycleObj.modal.ratings[0].score;
            }
        };
        $scope.changeMinRangeHandler = function (range) {
            var minScore = $scope.reviewCycleObj.modal.ratings[$scope.reviewCycleObj.modal.ratings.length - 1].score;
            
            if (range.min < minScore) {
                range.min = minScore;
            } else if (range.min > range.max) {
                range.min = (range.max - 1) < 1 ? 1 : (range.max - 1);
            }
        };

        $scope.changePotentialTypeHandler = function () {
            $scope.reviewCycleObj.modal.potential_grid_ratings_range[0]['max'] = $scope.reviewCycleObj.modal.ratings[0].score;
        };

        $scope.changeMinPotentialHandler = function (range, index) {
            var nextMaxValue = $scope.reviewCycleObj.modal.potential_grid_ratings_range[index].min;
            $scope.reviewCycleObj.modal.potential_grid_ratings_range[index + 1].max = nextMaxValue - .01;
        };

        $scope.changeMinOptionHandler = function (range, index) {
            if($scope.reviewCycleObj.modal.options_range[index].min >= 3 || $scope.reviewCycleObj.modal.options_range[index].min <= 1) { return; }
            var nextMaxValue = $scope.reviewCycleObj.modal.options_range[index].min;
            $scope.reviewCycleObj.modal.options_range[index + 1].max = nextMaxValue - .01;
        };

        /***** Start: Other Relationship Section *****/
        $scope.toggleRelationship = function (item, list) {
            var idx = list.indexOf(item);
            (idx > -1) ? list.splice(idx, 1) : list.push(item);
        };   
        $scope.existsRelationship = function (item, list) {
            return list.indexOf(item) > -1;;
        };
        var getSystemDefinedRelationships = function () {
            serverUtilityService.getWebService(AdminReviewCycleService.getUrl('relationships'))
                .then(function (data) {
                    data.data.sort(utilityService.dynamicSort("name")); 
                    $scope.reviewCycleObj.systemRelationship.list = data.data;                       
                });
        };
        getSystemDefinedRelationships();
        /***** End: Other Relationship Section *****/

        /***** Start: Calculate Consolidated Rating Across Reviewers ******/
        $scope.isNextButtonDisabled = function () {
            var isDisabled = false,
                tabIndex = utilityService.getValue($scope.reviewCycleObj, 'tab'),
                isConsolidatedRating = utilityService.getInnerValue($scope.reviewCycleObj, 'modal', 'is_consolidated_rating');
            
            if (tabIndex == 4 && isConsolidatedRating) {
                var sum = 0;

                angular.forEach($scope.reviewCycleObj.modal.ratingReviewrSetting, function(v, k) {
                    if((k != 'self' && $scope.reviewCycleObj.modal.enable_rating && ($scope.reviewCycleObj.modal.reviewAllSettings[k]['goal_review'] || $scope.reviewCycleObj.modal.reviewAllSettings[k]['competency_review']))
                        || (k == 'self' && $scope.reviewCycleObj.modal.isSelfEvaluation && ($scope.reviewCycleObj.modal.isGoalOkr || $scope.reviewCycleObj.modal.isCompetency))){
                        sum = sum + utilityService.getValue(v, 'consolidated_percent', 0);
                    }
                });

                isDisabled = sum < 100;
            }

            return isDisabled;
        };
        /***** End: Calculate Consolidated Rating Across Reviewers ******/


        /***** Start: Set Relevance Using CSV *****/
        // $scope.reviewsObject = {
        //     uploadedFile: null,
        //     isBulkVisible: true
        // };
        $scope.errorMessages = [];

        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        var getAlphaIndexing = function (resp) {
            $rootScope.errCount = 0;
            var data = [];
            angular.forEach(resp.data, function (val, key) {
                data.push(val);
                angular.forEach(val, function (v, k) {
                    if (v.error.length) {
                        $rootScope.errCount += 1;
                    }
                });
            });
            $rootScope.totalRecords = data.length;
            $rootScope.alphIndex = [];
            var len = Object.keys(data[0]).length;
            var counter = -1;
            for (var i = 0; i < len; i++) {
                if (i % 26 == 0 && i != 0) {
                    counter = counter + 1;
                }
                if (i > 25) {
                    $rootScope.alphIndex.push(alphabets[counter % 26] + alphabets[(i % 26)]);
                } else {
                    $rootScope.alphIndex.push(alphabets[i]);
                }
            }
            $scope.flag = true;
        };        
        $scope.selectFile = function (file){
            $scope.reviewCycleObj.uploadedFile = file;
        };        
        var uploadProgressCallback = function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };
        var uploadSuccessCallback = function (response) {            
            if (angular.isDefined(response) && angular.isDefined(response.data) 
                && !response.data.status) {
                getAlphaIndexing(response);
                $scope.data = [];
                angular.forEach(response.data, function (val, key) {
                    var isError = false;
                    angular.forEach(val, function (v, k) {
                        if (angular.isDefined(v.error) && v.error.length) {
                            isError = true;
                        }
                    });
                    isError ? $scope.data.push(val) : null;
                });
                $scope.parsedCsv = $rootScope.errCount == 0 ? response.data : $scope.data;
                $scope.dataList = response.data;
                $timeout(function () {
                    $scope.reviewCycleObj.isBulkVisible = true;
                }, 100);
            }
            if(utilityService.getInnerValue(response, 'data', 'status') == 'error' ) {
                $scope.reviewCycleObj.isBulkVisible = true;
                $scope.errorMessages.push(response.data.message);
            } else {
                $scope.reviewCycleObj.uploadedFile = null;
                $scope.reviewCycleObj.modal.is_employee_assigned = true;
                utilityService.showSimpleToast(utilityService.getValue(response, 'message'));
            }
        };        
        var uploadErrorCallback = function (response){
            var msg = response.data.message ? response.data.message : "Something went worng.";
            $scope.errorMessages.push(msg);
        };        
        $scope.changeList = function (key) {
            $scope.parsedCsv = key == 'all' ? $scope.dataList : $scope.data;
        };        
        $scope.upload = function () {
            $scope.errorMessages = [];
            $scope.reviewCycleObj.isBulkVisible = false;

            var urlPrefix = utilityService.getInnerValue($scope.reviewCycleObj, 'modal', 'upload_type', 1) == 1 ? 'uploadRelevanceCSV' : 'deleteRelevanceCSV',
                url = AdminReviewCycleService.getUrl(urlPrefix) + "/" + utilityService.getValue($routeParams, 'planId'),
                payload = {
                    upload_csv: $scope.reviewCycleObj.uploadedFile
                };

            serverUtilityService.uploadWebService(url, payload)
                .then(function (data){
                    data.status === 'success' ? uploadSuccessCallback(data) 
                        : uploadErrorCallback(data);
                });
        };
        $scope.downloadSampleRelevanceCSV = function () {
            serverUtilityService.getWebService(AdminReviewCycleService.getUrl('downloadRelevanceCSV'))
                .then(function (data){
                    if (data.status == 'success') {
                        window.location.assign(data.data);
                    } else {
                        alert('Something went wrong.');
                    }
                });
        };
        /***** End: Set Relevance Using CSV *****/        
        
        $scope.changeRemindBeforeEndDateHandler = function (value) {
            var remindDays = 1,
                startTime = value.start_date.getTime(),
                endTime = value.end_date.getTime(),
                timeDiff = endTime - startTime,
                totalDays = timeDiff/(24 * 60 * 60 * 1000);

            if (timeDiff == 0) {
                value.remind_before_end_date = 1;  
            } else {
                remindDays = value.remind_before_end_date > totalDays 
                    ? totalDays : value.remind_before_end_date;
                
                value.remind_before_end_date = remindDays >= 1 ? remindDays : 1;
            }                        
        };
        $scope.changeFeedbackHandler = function (value, source) {
            if (value.feedback == 3) {
                value.final_score = false;
                if (source === 'upline') {
                    value.show_reviewee_self = false;
                }                
            }
        };
        $scope.uploadTypeChangeHandler = function () {
            $scope.reviewCycleObj.uploadedFile = null;
        };

        $scope.isRatingEnable = function(val) {
            var arr_str = val.split("_");
            arr_str.pop();
            var relationReview = arr_str.join("_");
            //enable_rating_goal
            if(!($scope.reviewCycleObj.modal.ratingReviewrSetting[relationReview].enable_rating_goal || $scope.reviewCycleObj.modal.ratingReviewrSetting[relationReview].enable_rating_competency) || !$scope.reviewCycleObj.modal.ratingReviewrSetting[relationReview].weights_assigned) {
                $scope.reviewCycleObj.modal.ratingPotentialAssigned[val + '_assigned'] = false;
                $scope.reviewCycleObj.modal.ratingPotentialSetting[val] = "";
                return true;
            } else {
                return false;
            }
        }
        $scope.openModal = function (instance, templateUrl, size) {
            var modalObject = {
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass: 'fadeEffect'
            };

            if(angular.isDefined(size)) {
                modalObject.size = size;
            }
            $scope.modalInstance[instance] = $modal.open(modalObject);
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };
        var getCategories = function() {
            var type = $scope.category.selected === 'goal' ? 11 : 12;
            var id = utilityService.getValue($routeParams, 'planId');
            var url = AdminReviewCycleService.getUrl('getCategories') + '/' + type + '/' + id;
            serverUtilityService.getWebService(url)
                .then(function (data){
                   console.log(data)
                   $scope.category[$scope.category.selected] = data.data
                });
        }
        var postCategories = function(name) {
            var type = $scope.category.selected === 'goal' ? 11 : 12;
            var id = utilityService.getValue($routeParams, 'planId');
            var url = AdminReviewCycleService.getUrl('getCategories') + '/' + type + '/' + id;
            var payload = {
                name: name,
            }
            if($scope.category.previousName){
                payload.old_name = $scope.category.previousName
            }
            serverUtilityService.postWebService(url, payload)
                .then(function (data){
                   console.log(data)
                   getCategories()
                });
        }

        $scope.addCategoryPopup = function(name, status) {
            if(!status) {
                return
            }
            $scope.category.selected = name
            if(name === 'goal'){
                $scope.openModal('viewEditCategoryReview', 'view-edit-category-review.tmpl.html')
            }
            if(name === 'compentency'){
                $scope.openModal('viewEditCategoryReview', 'view-edit-category-review.tmpl.html')
            }
            if(name === 'goal' && utilityService.getValue($routeParams, 'planId')){
                getCategories(name)
            }
            if(name === 'compentency' && utilityService.getValue($routeParams, 'planId')){
                getCategories(name)
            }
        }
        $scope.addMoreCategory = function() {
            $scope.category[$scope.category.selected].push({
                editableMode: true,
                name: "",
                is_edit: true
            });
        };
        $scope.changeEditableMode = function(item, flag) {
            item.editableMode = flag;
        };
        $scope.removeCatergory = function(index) {
            $scope.category[$scope.category.selected].splice(index, 1);
        };
        $scope.postCategory = function(item){
            if(utilityService.getValue($routeParams, 'planId')){
                postCategories(item.name)
            }else{
                return
            }
        }
        $scope.storeOldName = function(item){
            $scope.category.previousName = item.name
        }
    }
]);