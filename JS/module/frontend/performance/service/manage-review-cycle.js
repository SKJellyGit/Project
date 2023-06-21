app.service('AdminManageReviewCycleService', ['utilityService',
    function (utilityService) {
        'use strict';

        this.url = {
            sendReminder: 'prejoin/frontend/send-reminder',
            reviewCycleTimeline: 'admin-frontend/performance/review-cycle-timeline',
            changeRCT: 'admin-frontend/performance/change-review-cycle-timeline',

            /***** Self Evaluation *****/
            selfEvalChart : 'admin-frontend/performance/self-evaluation',
            selfEvaldetails : 'admin-frontend/performance/appraisal-status-self',            
            endSelfEvaluationCycle: 'admin-frontend/performance/end-evaluation/self_review',
            
            /***** Reviewee Status *****/
            revieweesList: 'admin-frontend/performance/appraisal-status-reviewees',
            reviewerList: 'admin-frontend/performance/appraisal-status-reviewers',
            allUser : 'user-addition/users-preview',
            assignReviewer: 'admin-frontend/performance/assign-reviewer',
            deleteReviewee: 'admin-frontend/performance/reviewee',
            reviewStatusChart: 'admin-frontend/performance/appraisal-status',
            reopenRequest: 'admin-frontend/performance/reopen-emp-evaluation',
            
            /***** COMPLETED REVIEWS *****/
            compltedReviews: 'admin-frontend/performance/completed-review-details',
            compltedReviewsChart: 'admin-frontend/performance/completed-review',
            release: 'admin-frontend/performance/released-reviewees',
            recommendationDetails: 'admin-frontend/performance/appraisal-fill-recommendation--details',
            downloadAnswerAttachment: 'performance/download-recommendation-file',
            updateOverallRating: 'admin-frontend/performance/override_rating',
             
            /***** Overall Rating *****/
            ratingCount: 'admin-frontend/performance/overall-rating',
            ratingDetails: 'admin-frontend/performance/overall-rating-details',

            /***** Generic Settings *****/
            relationWiseSetting: 'admin-frontend/performance/relation-wise-settings',
            otherRelations: 'performance/other-relations',
            acrossReviewerSetting: 'admin-frontend/performance/settings',
            appraisalCycleSetting: 'admin-frontend/performance/appraisal-cycle-settings',
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };        
        this.buildReviewStatusObj = function () {
            return {
                1: "Completed",
                2: "Not Started",
                3: "Not Apllicable",
                4: "In Progress"
            };
        };
        this.buildReviewStatusFilterList = function () {
            return[{
                    id: 1,
                    name: "Completed"
                },
                {
                    id: 2,
                    name: "Not Started"
                },
                {
                    id: 3,
                    name: "Not Apllicable"
                },
                {
                    id: 4,
                    name: "In Progress"
                }];
        };        
        this.buildReviewCycleTimeLineName = function () {
            return {
                manager_template_edit: 'Manager KR/Competency Determination',
                employee_template_edit: 'Employee KR/Competency Determination',
                peer_selection: 'Peer Selection (Nominate)',
                peer: "Peer",
                self: "Self",
                manager: "Manager",
                direct_reports: "Direct Report",
                skip_manager: "Skip Level Manager"
            };
        };        
        this.buildManagerTypeName = function () {
            return {
                self: "Self Evaluation",
                manager: "Manager",
                direct_reports: "Direct Report",
                skip_manager: "Skip Level Manager",
                peer: "Peer"
            };
        };        
        this.buildReviewCycleTimeLineData = function (modal) {
            modal.cycle_timeline.start_date = utilityService.getDefaultDate(utilityService.getInnerValue(modal, 'cycle_timeline', 'start_date'));
            modal.cycle_timeline.end_date = utilityService.getDefaultDate(utilityService.getInnerValue(modal, 'cycle_timeline', 'end_date'));
            angular.forEach(modal.relation_timeline, function (v, k) {
                v.start_date = utilityService.getDefaultDate(utilityService.getValue(v, 'start_date'));
                v.end_date = utilityService.getDefaultDate(utilityService.getValue(v, 'end_date'));
            });
        };        
        this.buildRCTPayload = function (modal) {
            var obj = {end_date: utilityService.dateToString(utilityService.getInnerValue(modal, 'cycle_timeline', 'end_date'))};
            angular.forEach(modal.relation_timeline, function (v, k) {
                obj[k] = {};
                obj[k]['start_date'] = utilityService.dateToString(utilityService.getValue(v, 'start_date'));
                obj[k]['end_date'] = utilityService.dateToString(utilityService.getValue(v, 'end_date'));
                obj[k]['remind_duration'] = utilityService.getValue(v, 'remind_duration');
            });
            
            return obj;
        };        
        this.buildReleaseToRevieweePaylod = function (list, item) {
            var payload = {reviewee_info: []};
            if (angular.isDefined(item) && item) {
                if (!item.released) {
                    payload.reviewee_info.push({
                        reviewee: item.reviewee._id,
                        reviewer: item.reviewer._id,
                        reviewer_type: item.reviewer_type
                    });
                }
            } else {
                angular.forEach(list, function (v, k) {
                    if (v.isChecked && !v.released) {
                        payload.reviewee_info.push({
                            reviewee: v.reviewee._id,
                            reviewer: v.reviewer._id,
                            reviewer_type: v.reviewer_type
                        });
                    }
                });
            }
            return payload;
        };        
        this.buildRelationFilterObject = function () {
            return[
                {
                    key: 'self',
                    value: 'Self Evaluation'
                },
                {
                    key: 'direct_reports',
                    value: 'Direct Reports'
                },
                {
                    key: 'manager',
                    value: 'Manager'
                },
                {
                    key: 'skip_manager',
                    value: 'Skip Level Manager'
                },
                {
                    key: 'peer',
                    value: 'Peer'
                }
            ];
        };
        this.buildManageReviewCycleModalObject = function (routeParams) {
            return {
                slectedTab: 0,
                reviewStatusTab: 0,
                overAllRatingCount: null,
                overAllRatingDetails: null,
                reviewCycleTimeline:null,
                graphData: {
                    data: {
                        self_evaluation_enabled: false
                    }
                },
                mulipleSelected: [],
                isGraphVisible: false,
                isRCTVisible: false,
                reviewCycleTimelineName: this.buildReviewCycleTimeLineName(),
                cycleId: utilityService.getValue(routeParams, 'cycle_id'),
                status: utilityService.getValue(routeParams, 'status'),
                hideMyTeam: true,
                today: new Date(),
                relationFilterList: this.buildRelationFilterObject(),
                can_admin_release: false,
                rating_settings: null,
                selectedTabSlug: 'selfEval',
                otherRelations: {
                    enabled: false,
                    list: [],
                    object: {}
                },
                acrossReviewer: {
                    
                },
                isRemainderClicked: false,
                isPotentialGrid: false
            };
        };
        this.buildSelfEvalObject = function (routeParams) {
            return {
                list: [],
                removeList: [],
                filteredList: [],
                employeeList: [],
                selectToRelease: {},
                isListVisible: false,
                selectedCount: 0,
                reviewStatusObj: this.buildReviewStatusObj(),
                buildManagerTypeName: this.buildManagerTypeName(),
                reviewStatusFilterList: this.buildReviewStatusFilterList(),
                completedCsvColumn: {},
                selfCsvColumn: {
                    'Reviewee': 'full_name',
                    'Employee Id': 'employee_code',
                    'Self Evaluation Status': 'reviewStatus'
                },
                routeFlags: {
                    cycleId: utilityService.getValue(routeParams, 'cycle_id')
                },
                recommendationReadOnly: true,
                recommendation_id: null,
                otherRelations: {
                    enabled: false,
                    list: [],
                    object: {}
                },
                isRemainderClicked: false
            };
        };
        this.buildOverwriteRatingPayload = function (model) {
            return {
                overall_rating: utilityService.getValue(model, 'newRating'),
                relationship: utilityService.getInnerValue(model, 'currentObject', 'reviewer_type')
            };
        };
        this.buildCsvData = function (data, column, name) {
            var finalData = [],
                header = [];

            angular.forEach(data, function (val, key) {
                var row = [];
                angular.forEach(column, function (v, k) {
                    if (key == 0) {
                        header.push(k);
                    }
                    angular.isDefined(val[v]) ? row.push(val[v]) : row.push(' ');
                });
                if (key == 0) {
                    finalData.push(header);
                }
                finalData.push(row);
            });

            return finalData;
        };
        this.isRequestedTabVisible = function (model, relation) {
            return utilityService.getInnerValue(model, relation, 'goal_review', false) 
                || utilityService.getInnerValue(model, relation, 'competency_review', false)
        };
        this.isRejectedReviewsVisible = function (model) {
            var isVisible = false,
                keepGoing = true

            angular.forEach(model, function (value, key) {
                if(keepGoing) {
                    isVisible = isVisible || utilityService.getInnerValue(model, key, 'can_reviewee_accept_reject', false);
                    if(isVisible){
                        keepGoing = false;
                    }
                }               
            });

            return isVisible;
        };
        this.buildVisibilityEnableObject = function (model, isConsolidatedRating) {
            return {
                selfEvaluation: this.isRequestedTabVisible(model, 'self'),
                reviewStatus: true, // now known as reviewee status
                completedReviews: true,
                overallRating: false, //as per product requirement
                individualReviewTimeline: true, // now known as reviewer status
                rejectedReviews: this.isRejectedReviewsVisible(model),
                consolidatedReviews: isConsolidatedRating, // now known as across reviwer rating
                questionsFeedback: false, //as per product requirement
                potentialgrid: true //as per product requirement
            };
        };
        this.buildTabVisibilityObject = function (model) {
            return {
                loaded: false,
                enable: this.buildVisibilityEnableObject(model)                
            };
        };
        this.buildRelationWiseSetting = function (model) {
            var object = {};

            angular.forEach(model, function (value, key) {
                object[key] = utilityService.getValue(value, 'goal_review', false) || utilityService.getValue(value, 'competency_review', false);
            });

            return object;
        };
        this.buildAcrossReviewerWeightageMappingObject = function (list) {
            var object = {};

            angular.forEach(list, function (value, key) {
                object[value.relation] = value.percent;
            });

            return object;
        };
    }
]);