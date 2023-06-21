app.service('AdminReviewCycleService', ['utilityService',
    function (utilityService) {
        'use strict';
        var self = this;
        this.cycleId = null;

        this.url = {
            /***** Review Cycle *****/
            getAllReviewCycle: 'admin-frontend/performance/review-cycles',
            repositoryReviewCycle: 'admin-frontend/performance/repository-review-cycles',
            reviewCycleSettings: 'admin-frontend/performance/appraisal-cycle-settings',
            launchCycle: 'admin-frontend/performance/launch-appraisal-cycle',
            deleteCycle: 'admin-frontend/performance/delete-appraisal-cycle',
            copyCycle: 'admin-frontend/performance/copy-appraisal-cycle-settings',
            relationships: 'admin-frontend/performance/relationship-groups',
            otherRelations: 'performance/other-relations',
            downloadRelevanceCSV: 'admin-frontend/performance/download-assign-employee-appraisal-cycle-csv',
            uploadRelevanceCSV: 'admin-frontend/performance/upload-assign-employee-appraisal-cycle-csv',
            runAssignEmployeesCronJob: 'admin-frontend/performance/assign-employee-appraisal-cycle',
            runAssignQuestionsCronJob: 'admin-frontend/performance/create-appraisal-template-questions',
            deleteRelevanceCSV: 'admin-frontend/performance/remove-employee-csv',
            unAssignedEmployees: 'admin-frontend/performance/unassign-employee',
            addEmployeesToCycle: 'admin-frontend/performance/assign-running-appraisal-cycle',
            addCycleforEmployees: 'admin-frontend/performance/goal-setting-phase-assign-employee-appraisal-cycle',

            /***** Template *****/
            getAllTemplate: 'admin-frontend/performance/apprisal-template',
            allUnAssignedTemplate: 'admin-frontend/performance/template-not-in-use',
            form : 'user-management/form',
            
            /***** Goal/OKR AND Competency section *****/
            downloadRepoFormat : 'admin-frontend/performance/download-template-parameter-csv',
            uploadRepoFormat : 'admin-frontend/performance/upload-template-parameter-csv',
            getRepoDetails: 'admin-frontend/performance/parameterdetails',
            getCategories: 'admin-frontend/performance/category',
            getEmployeeCategories:'performance/category',
            getMyteamCategories:'myteam/performance/category',
            /***** Team Bulk Upload Goals & Competencties *****/
            uploadTeamRepoFormat : 'myteam/performance/upload-template-parameter-csv',

            /***** Template Section *****/
            createTempate: 'user-management/form'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };        
        this.buildRCStatusObj = function () {
            return {
                1: "Draft",
                3: "Active",
                4: "Completed",
                5: "Upcoming",
            };
        };
        this.buildTabSlug = function () {
            return {
                1: 'name',
                2: 'self_evalution',
                3: 'reviews',
                4: 'overall_rating',
                4.5: 'potential_grid',
                5: 'visibility',
                6: 'schedule',
                
            };
        };                
        this.buildReviewerName = function () {
            var reviewerName = {
                manager: 'Manager',
                skip_manager: 'Skip Level Manager',
                direct_reports: 'Direct Reports',
                self: 'Self Evaluation',
                manager_template_edit: 'Manager KR/Competency Determination',
                employee_template_edit: 'Employee KR/Competency Determination',
                peer: 'Peer',
                peer_selection: 'Peer Selection'
            };

            utilityService.rebuildReviewerNameForRelationship(reviewerName, this.cycleId);
            
            return reviewerName;
        };  
        
        this.buildReviewerOptionName = function () {
            var reviewerName = {
                manager_weightage: 'Manager',
                skip_manager_weightage: 'Skip Level Manager',
                direct_reports_weightage: 'Direct Reports',
                self_weightage: 'Self Evaluation',
                manager_template_edit_weightage: 'Manager KR/Competency Determination',
                employee_template_edit_weightage: 'Employee KR/Competency Determination',
                peer_weightage: 'Peer',
                peer_selection_weightage: 'Peer Selection'
            };
            var otherRelations = utilityService.getStorageValue('other_relations_' + this.cycleId);
            otherRelations = JSON.parse(otherRelations);
            angular.forEach(otherRelations, function(value, relation) {
                reviewerName[relation + "_weightage"] = value;
            });
            utilityService.rebuildReviewerNameForRelationship(reviewerName, this.cycleId);
            return reviewerName;
        };     

        var reviewsSettingDefaultobj = function (modal) {
            return {
                goal_review: utilityService.getValue(modal, 'goal_review', false),
                goal_template: utilityService.getValue(modal, 'goal_template'),
                goal_visible: utilityService.getValue(modal, 'goal_visible', false),
                competency_review: utilityService.getValue(modal, 'competency_review', false),
                competency_template: utilityService.getValue(modal, 'competency_template'),
                competency_visible: utilityService.getValue(modal, 'competency_visible', false),
                can_reviewee_accept_reject: utilityService.getValue(modal, 'can_reviewee_accept_reject', false),
                can_admin_release: utilityService.getValue(modal, 'can_admin_release', false),
                fill_recommendation: utilityService.getValue(modal, 'fill_recommendation', false),
                recommendation_template: utilityService.getValue(modal, 'recommendation_template'),
                fill_midterm: utilityService.getValue(modal, 'fill_midterm', false),
                can_admin_reopen_evaluation: true //utilityService.getValue(modal, 'can_admin_reopen_evaluation', true)
            };
        };        
        var shareWithRevieweeDefaultObj = function (modal, isExtraKey) {
            isExtraKey = angular.isDefined(isExtraKey) ? isExtraKey : false
            var obj = {
                feedback: utilityService.getValue(modal, 'feedback'),
                reviewers_name: utilityService.getValue(modal, 'reviewers_name', false),
                final_score: utilityService.getValue(modal, 'final_score', false)
            };
            if(isExtraKey) {
                obj.show_reviewee_self = utilityService.getValue(modal, 'show_reviewee_self', false);
            }
            return obj;
        };        
        var scheduleObject = function (model, key){
            return{
                start_date: utilityService.getDefaultDate(utilityService.getValue(model, key + '_start_date')),
                end_date: utilityService.getDefaultDate(utilityService.getValue(model, key + '_end_date')),
                reminder_frequency: utilityService.getValue(model, key + '_reminder_frequency'),
                remind_before_end_date: utilityService.getValue(model, key + '_after_start_reminder')
            };
        };        
        var overallratingObject = function (model) {
            return {
                enable_rating_goal: utilityService.getValue(model, 'enable_rating_goal', false),
                goal_calculation_type: utilityService.getValue(model, 'goal_calculation_type', 1),
                goal_round_to_nearest: utilityService.getValue(model, 'goal_round_to_nearest', false),
                goal_rate_percent: utilityService.getValue(model, 'goal_rate_percent'),
                goal_round_type: utilityService.getValue(model, 'goal_round_type', 1),
                enable_rating_competency: utilityService.getValue(model, 'enable_rating_competency', false),
                competency_calculation_type: utilityService.getValue(model, 'competency_calculation_type', 1),
                competency_round_to_nearest: utilityService.getValue(model, 'competency_round_to_nearest', false),                                
                compentency_rate_percent: utilityService.getValue(model, 'compentency_rate_percent'),
                competency_round_type: utilityService.getValue(model, 'competency_round_type', 1),
                weights_assigned: utilityService.getValue(model, 'weights_assigned', false),
                can_admin_overwrite_rating: utilityService.getValue(model, 'can_admin_overwrite_rating', false),
                consolidated_percent: utilityService.getValue(model, 'consolidated_percent', 0)
            };
        };
        this.reBuildReviewCycleModalForRelationship = function (object, modal) {
            if (Boolean(utilityService.getStorageValue('enable_other_relations_' + this.cycleId))) {
                var otherRelations = utilityService.getStorageValue('other_relations_' + this.cycleId);
                otherRelations = JSON.parse(otherRelations);

                angular.forEach(otherRelations, function(value, relation) {
                    object.reviewAllSettings[relation] = reviewsSettingDefaultobj(utilityService.getInnerValue(modal, 'reviews', relation, null));
                    object.share_with_reviewee[relation] = shareWithRevieweeDefaultObj(utilityService.getInnerValue(utilityService.getValue(modal, 'visibility'), 'share_with_reviewee', relation, null));
                    object.share_with_reviewees_manager[relation] = shareWithRevieweeDefaultObj(utilityService.getInnerValue(utilityService.getValue(modal, 'visibility'), 'share_with_reviewees_manager', relation, null), true);
                    object.communitionSettings[relation] = scheduleObject(utilityService.getValue(modal, 'schedule'), relation);
                    object.ratingReviewrSetting[relation] = overallratingObject(utilityService.getInnerValue(modal, 'overall_rating', relation));
                });
            }            
        };

        
        this.reBuildOptionsCycleModalForRelationship = function (object, modal) {
            if (Boolean(utilityService.getStorageValue('enable_other_relations_' + this.cycleId))) {
                var otherRelations = utilityService.getStorageValue('other_relations_' + this.cycleId);
                otherRelations = JSON.parse(otherRelations);
                angular.forEach(otherRelations, function(value, relation) {
                    object.ratingPotentialSetting[relation + "_weightage"] = utilityService.getInnerValue(modal, 'potential_grid', relation + "_weightage");
                    object.ratingPotentialAssigned[relation + "_weightage_assigned"] = utilityService.getInnerValue(modal, 'potential_grid', relation + "_weightage_assigned", false);
                });
            }            
        };
        this.extractOtherRelationIds = function (list) {
            var ids = [];
            
            angular.forEach(list, function (value, index) {
                if (value.key) {
                    ids.push(value.key);
                }
            });

            return ids;
        }; 
        this.buildReviewCycleModal = function (modal) {
            var object = {
                _id: utilityService.getValue(modal, '_id'), 
                step_completed: utilityService.getValue(modal, 'step_completed', 'name'), 
                cycleName: utilityService.getInnerValue(modal, 'name', 'cycle_name'),
                description: utilityService.getInnerValue(modal, 'name', 'description'),
                isGoalOkr: utilityService.getInnerValue(modal, 'name', 'is_goal_enabled', false),
                goalOkrDisplayName: utilityService.getInnerValue(modal, 'name', 'goal_display_name'),
                isCompetency: utilityService.getInnerValue(modal, 'name', 'is_compentency_enabled', false),
                competencyDisplayName: utilityService.getInnerValue(modal, 'name', 'competency_display_name'),
                goalTemplateEditType: utilityService.getInnerValue(modal, 'name', 'goal_template_edit_type', 1),
                competencyTemplateEditType: utilityService.getInnerValue(modal, 'name', 'competency_template_edit_type', 1),
                isGoalWeightage: utilityService.getInnerValue(modal, 'name', 'is_goal_weightage', false),
                is_goal_category: utilityService.getInnerValue(modal, 'name', 'is_goal_category', false),
                is_competency_category: utilityService.getInnerValue(modal, 'name', 'is_competency_category', false),
                isCompetencyWeightage: utilityService.getInnerValue(modal, 'name', 'is_competency_weightage', false),
                isOtherRelation: utilityService.getInnerValue(modal, 'name', 'is_other_relation', false),
                otherRelation: this.extractOtherRelationIds(utilityService.getInnerValue(modal, 'name', 'other_relation', [])),

                /***** Self Evaluation Tab *****/
                isSelfEvaluation: utilityService.getInnerValue(modal, 'self_evalution', 'self_evaluation', false),
                seGoalOkrTemplate: utilityService.getInnerValue(modal, 'self_evalution', 'self_goal_template'),
                seCompetencyTemplate: utilityService.getInnerValue(modal, 'self_evalution', 'self_competency_template'),
                self_goal_review: utilityService.getInnerValue(modal, 'self_evalution', 'self_goal_review', false),
                self_competency_review: utilityService.getInnerValue(modal, 'self_evalution', 'self_competency_review', false),
                can_employee_reopen_self_evaluation: utilityService.getInnerValue(modal, 'self_evalution', 'can_employee_reopen_self_evaluation', false),
                can_admin_reopen_self_evaluation: true, //utilityService.getInnerValue(modal, 'self_evalution', 'can_admin_reopen_self_evaluation', true),

                /***** Reviews *****/
                promotion_recommendation: utilityService.getInnerValue(modal, 'reviews', 'promotion_recommendation', false),
                promotion_recommendation_to_employee: utilityService.getInnerValue(modal, 'reviews', 'promotion_recommendation_to_employee', 1),
                is_midterm_appraisal: utilityService.getInnerValue(modal, 'reviews', 'is_midterm_appraisal', false),
                reviewAllSettings: {
                    manager: reviewsSettingDefaultobj(utilityService.getInnerValue(modal, 'reviews', 'manager', null)),
                    skip_manager: reviewsSettingDefaultobj(utilityService.getInnerValue(modal, 'reviews', 'skip_manager', null)),
                    direct_reports: reviewsSettingDefaultobj(utilityService.getInnerValue(modal, 'reviews', 'direct_reports', null)),
                    peer: reviewsSettingDefaultobj(utilityService.getInnerValue(modal, 'reviews', 'peer', null)),
                },
                peer_reviewers_cap: utilityService.getInnerValue(modal, 'reviews', 'peer_reviewers_cap', false),
                min_peer_reviewers_by_reviewee: utilityService.getInnerValue(modal, 'reviews', 'min_peer_reviewers_by_reviewee', 0),
                max_peer_reviewers_by_reviewee: utilityService.getInnerValue(modal, 'reviews', 'max_peer_reviewers_by_reviewee', 10),
                min_peer_reviewers_by_reviewee_manager: utilityService.getInnerValue(modal, 'reviews', 'min_peer_reviewers_by_reviewee_manager', 0),
                max_peer_reviewers_by_reviewee_manager: utilityService.getInnerValue(modal, 'reviews', 'max_peer_reviewers_by_reviewee_manager', 5),
                view_peer_analytics: utilityService.getInnerValue(modal, 'reviews', 'view_peer_analytics', false),

                /***** Visibility *****/
                share_with_reviewee: {
                    manager: shareWithRevieweeDefaultObj(utilityService.getInnerValue(utilityService.getValue(modal, 'visibility'), 'share_with_reviewee', 'manager', null)),
                    skip_manager: shareWithRevieweeDefaultObj(utilityService.getInnerValue(utilityService.getValue(modal, 'visibility'), 'share_with_reviewee', 'skip_manager', null)),
                    direct_reports: shareWithRevieweeDefaultObj(utilityService.getInnerValue(utilityService.getValue(modal, 'visibility'), 'share_with_reviewee', 'direct_reports', null)),
                    peer: shareWithRevieweeDefaultObj(utilityService.getInnerValue(utilityService.getValue(modal, 'visibility'), 'share_with_reviewee', 'peer', null)),
                },
                share_with_reviewees_manager: {
                    manager: shareWithRevieweeDefaultObj(utilityService.getInnerValue(utilityService.getValue(modal, 'visibility'), 'share_with_reviewees_manager', 'manager', null), true),
                    skip_manager: shareWithRevieweeDefaultObj(utilityService.getInnerValue(utilityService.getValue(modal, 'visibility'), 'share_with_reviewees_manager', 'skip_manager', null), true),
                    direct_reports: shareWithRevieweeDefaultObj(utilityService.getInnerValue(utilityService.getValue(modal, 'visibility'), 'share_with_reviewees_manager', 'direct_reports', null), true),
                    peer: shareWithRevieweeDefaultObj(utilityService.getInnerValue(utilityService.getValue(modal, 'visibility'), 'share_with_reviewees_manager', 'peer', null), true)
                },
                entire_upline_visiblity: utilityService.getInnerValue(modal, 'share_with_reviewees_manager', 'entire_upline_visiblity', false),
                
                /***** Schedule *****/
                launch_communication: utilityService.getDefaultDate(utilityService.getInnerValue(modal, 'schedule', 'launch_communication')),
                end_communication: utilityService.getDefaultDate(utilityService.getInnerValue(modal, 'schedule', 'end_date')),
                communitionSettings: {
                    manager_template_edit: scheduleObject(utilityService.getValue(modal, 'schedule'), 'manager_template_edit'),
                    employee_template_edit: scheduleObject(utilityService.getValue(modal, 'schedule'), 'employee_template_edit'),
                    peer_selection: scheduleObject(utilityService.getValue(modal, 'schedule'), 'peer_selection'),
                    peer: scheduleObject(utilityService.getValue(modal, 'schedule'), 'peer'),
                    self: scheduleObject(utilityService.getValue(modal, 'schedule'), 'self'),
                    manager: scheduleObject(utilityService.getValue(modal, 'schedule'), 'manager'),
                    skip_manager: scheduleObject(utilityService.getValue(modal, 'schedule'), 'skip_manager'),
                    direct_reports: scheduleObject(utilityService.getValue(modal, 'schedule'), 'direct_reports')                    
                },
                
                /***** Overall Rating *****/
                enable_rating: utilityService.getInnerValue(modal, 'overall_rating', 'enable_rating', true),
                ratings: utilityService.getInnerValue(modal, 'overall_rating', 'ratings', [{score: null, description: null, isEdit: false}]),
                ratingType: this.buildRatingTypeObject(),
                ratings_display: utilityService.getInnerValue(modal, 'overall_rating', 'ratings_display', 1),
                ratings_range: this.getRatingsRange(modal),
                ratingReviewrSetting: {
                    self: overallratingObject(utilityService.getInnerValue(modal, 'overall_rating', 'self')),
                    manager: overallratingObject(utilityService.getInnerValue(modal, 'overall_rating', 'manager')),
                    skip_manager: overallratingObject(utilityService.getInnerValue(modal, 'overall_rating', 'skip_manager')),
                    direct_reports: overallratingObject(utilityService.getInnerValue(modal, 'overall_rating', 'direct_reports')),
                    peer: overallratingObject(utilityService.getInnerValue(modal, 'overall_rating', 'peer'))
                },
                is_consolidated_rating: utilityService.getInnerValue(modal, 'overall_rating', 'is_consolidated_rating', false),

                /***** Potential Grid *****/
                enable_potential_grid: utilityService.getInnerValue(modal, 'potential_grid', 'enable_potential_grid', false),
                header: utilityService.getInnerValue(modal, 'potential_grid', 'header'),
                question: utilityService.getInnerValue(modal, 'potential_grid', 'question'),
                options: utilityService.getInnerValue(modal, 'potential_grid', 'options', [{score: 3, title: "High", description: null}, {score: 2, title: "Medium", description: null}, {score: 1, title: "Low", description: null}]),
                options_range: this.getOptionRange(modal),
                potential_grid_ratings_range: this.getPotentialRatingsRange(modal),
                ratingPotentialSetting: {
                    manager_weightage: utilityService.getInnerValue(modal, 'potential_grid', 'manager_weightage'),
                    skip_manager_weightage: utilityService.getInnerValue(modal, 'potential_grid', 'skip_manager_weightage'),
                    direct_reports_weightage: utilityService.getInnerValue(modal, 'potential_grid', 'direct_reports_weightage'),
                    peer_weightage: utilityService.getInnerValue(modal, 'potential_grid', 'peer_weightage')
                },
                ratingPotentialAssigned: {
                    manager_weightage_assigned: utilityService.getInnerValue(modal, 'potential_grid', 'manager_weightage_assigned', false),
                    skip_manager_weightage_assigned: utilityService.getInnerValue(modal, 'potential_grid', 'skip_manager_weightage_assigned', false),
                    direct_reports_weightage_assigned: utilityService.getInnerValue(modal, 'potential_grid', 'direct_reports_weightage_assigned', false),
                    peer_weightage_assigned: utilityService.getInnerValue(modal, 'potential_grid', 'peer_weightage_assigned', false)
                },
                
                /***** Relevance *****/
                is_assign_employee_csv: utilityService.getInnerValue(modal, 'relevance', 'is_assign_employee_csv', false),
                is_employee_assigned: utilityService.getInnerValue(modal, 'relevance', 'is_assign_employee_csv', false),
                upload_type: 1
            };  
            
            this.reBuildReviewCycleModalForRelationship(object, modal);  
            this.reBuildOptionsCycleModalForRelationship(object, modal);
                      
            
            /** Start: Sync Promotion Recommendation & MidTerm Appraisal Keys */
            angular.forEach(object.reviewAllSettings, function (value, key) {
                object['ask_' + key + '_midterm_appraisal'] = utilityService.getInnerValue(modal, 'reviews', 'ask_' + key + '_midterm_appraisal', false);
                object['ask_' + key] = utilityService.getInnerValue(modal, 'reviews', 'ask_' + key, false);
            });
            /** End: Sync Promotion Recommendation & MidTerm Appraisal Keys */

            return object;
        };
        this.buildRatingTypeObject = function () {
            return {
                list: [
                    {
                        id: 1,
                        title: 'If Exact score is provided'
                    },
                    {
                        id: 2,
                        title: 'According to a range of scores'
                    }
                ]
            }
        };
        this.buildDefaultRatingRangeObject = function () {
            return {min: null, max: null, description: null};
        };
        this.getRatingsRange = function (modal) {
            var ratingsRange = utilityService.getInnerValue(modal, 'overall_rating', 'ratings_range', []);
            
            return ratingsRange.length ? ratingsRange 
                : new Array(this.buildDefaultRatingRangeObject());
        }; 

        this.getPotentialRatingsRange = function (modal) {
            var ratingsRange = utilityService.getInnerValue(modal, 'potential_grid', 'potential_grid_ratings_range', []);
            return ratingsRange.length ? ratingsRange 
                : new Array({min: null, max: null, description: null}, {min: null, max: null, description: null}, {min: null, max: null, description: null});
        }; 
        
        this.getOptionRange = function (modal) {
            var optionRange = utilityService.getInnerValue(modal, 'potential_grid', 'options_range', []);
            return optionRange.length ? optionRange 
                : new Array({min: null, max: 3, description: "", order: 1}, {min: null, max: null, description: "", order: 2}, {min: 1, max: null, description: "", order: 3});
        };

        var getTimeStamp = function(date, isEnd){
            isEnd = angular.isDefined(isEnd) ? isEnd : false;
            var timeStamp;
            if(isEnd) {
                date = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59) : null;
            } else {
                date = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0) : null;
            }
            timeStamp = date ? date.getTime() / 1000 : null;
            return timeStamp;
        };
        this.hideForRelationships = function (key) {
            return key === 'peer' || key === 'direct_reports' || key.indexOf('_team') >= 0
        };             
        this.buildReviewCyclePayload = function (modal, tab, id, peerEnabled){
            var tabSlug = this.buildTabSlug(),
                obj = {
                    tab_slug: tabSlug[tab],
                    step_completed: modal.step_completed ? modal.step_completed : 'name'
                };

            if(id) {
                obj._id = id;
            }

            obj.is_consolidated_rating = utilityService.getValue(modal, 'is_consolidated_rating', false);

            /******* NAME ********/
            if(tab == 1) {
                obj.appraisal_cycle_name = modal.cycleName;
                obj.description = modal.description;
                obj.is_goal_enabled = modal.isGoalOkr;
                obj.is_compentency_enabled = modal.isCompetency;
                obj.is_other_relation = modal.isOtherRelation;

                if(modal.isGoalOkr) {
                   obj.goal_display_name = modal.goalOkrDisplayName;
                   obj.goal_template_edit_type = modal.goalTemplateEditType;
                   obj.is_goal_weightage = modal.isGoalWeightage;
                   obj.is_goal_category = modal.is_goal_category;
                }

                if(modal.isCompetency) {
                   obj.competency_display_name = modal.competencyDisplayName;
                   obj.competency_template_edit_type = modal.competencyTemplateEditType;
                   obj.is_competency_weightage = modal.isCompetencyWeightage;
                   obj.is_competency_category = modal.is_competency_category

                }

                if (modal.isOtherRelation) {
                    obj.other_relation = modal.otherRelation
                }
            }
            
            /******* SELF EVALUATION ********/
            if(tab == 2){
                obj.self_evaluation = modal.isSelfEvaluation;
                if(modal.isSelfEvaluation && modal.isGoalOkr) {
                    obj.self_goal_review = modal.self_goal_review;
                    if (modal.self_goal_review) {
                        obj.self_goal_template = modal.seGoalOkrTemplate;
                    }
                }
                if(modal.isSelfEvaluation && modal.isCompetency) {
                    obj.self_competency_review = modal.self_competency_review;
                    if (modal.self_competency_review) {
                        obj.self_competency_template = modal.seCompetencyTemplate;
                    }                    
                }
                if (modal.isSelfEvaluation) {
                    obj.can_employee_reopen_self_evaluation = modal.can_employee_reopen_self_evaluation;
                    obj.can_admin_reopen_self_evaluation = modal.can_admin_reopen_self_evaluation;
                }
            }
            
            /******* REVIEWS ********/
            if(tab == 3) {
                obj.review_settings = {};
                obj.review_settings.promotion_recommendation = modal.promotion_recommendation ? modal.promotion_recommendation : false;
                obj.review_settings.is_midterm_appraisal = modal.is_midterm_appraisal ? modal.is_midterm_appraisal : false;

                if (modal.isGoalOkr) {
                    angular.forEach(modal.reviewAllSettings, function (v, k) {
                        obj.review_settings[k] = angular.isDefined(obj.review_settings[k]) ? obj.review_settings[k] : {};
                        obj.review_settings[k]['goal_review'] = v.goal_review;
                        if (v.goal_review) {
                            obj.review_settings[k]['goal_template'] = v.goal_template;
                            obj.review_settings[k]['goal_visible'] = utilityService.getValue(v, 'goal_visible', false);
                        }
                    });
                }

                if (modal.isCompetency) {
                    angular.forEach(modal.reviewAllSettings, function (v, k) {
                        obj.review_settings[k] = angular.isDefined(obj.review_settings[k]) ? obj.review_settings[k] : {};
                        obj.review_settings[k]['competency_review'] = v.competency_review;
                        if (v.competency_review) {
                            obj.review_settings[k]['competency_template'] = v.competency_template;
                            obj.review_settings[k]['competency_visible'] = utilityService.getValue(v, 'competency_visible', false);
                        }
                    });
                }                

                if (modal.isGoalOkr || modal.isCompetency) {
                    angular.forEach(modal.reviewAllSettings, function (v, k) {
                        obj.review_settings[k] = angular.isDefined(obj.review_settings[k]) ? obj.review_settings[k] : {};
                        obj.review_settings[k]['can_reviewee_accept_reject'] = v.can_reviewee_accept_reject;
                        obj.review_settings[k]['can_admin_release'] = v.can_admin_release;
                        obj.review_settings[k]['fill_recommendation'] = utilityService.getValue(v, 'fill_recommendation', false);
                        if (utilityService.getValue(v, 'fill_recommendation')) {
                            obj.review_settings[k]['recommendation_template'] = v.recommendation_template;
                        }
                        obj.review_settings[k]['can_admin_reopen_evaluation'] = v.can_admin_reopen_evaluation;
                    });
                }                                   

                /***** Start: Promotion For Recommendation Section *****/
                if(modal.promotion_recommendation) {
                    obj.review_settings.ask_manager = modal.ask_manager;
                    obj.review_settings.ask_skip_manager = modal.ask_skip_manager;
                    angular.forEach(modal.reviewAllSettings, function (value, key) {
                        if (!self.hideForRelationships(key)) {
                            obj.review_settings['ask_' + key] = utilityService.getValue(modal, 'ask_' + key);
                        }
                    });

                    obj.review_settings.promotion_recommendation_to_employee = modal.promotion_recommendation_to_employee;
                }
                /***** End: Promotion For Recommendation Section *****/

                /***** Start: Mid Term Appraisal Section *****/
                if (modal.is_midterm_appraisal) {
                    angular.forEach(modal.reviewAllSettings, function (value, key) {
                        if (!self.hideForRelationships(key)) {
                            var flag = utilityService.getValue(modal, 'ask_' + key + '_midterm_appraisal', false);
                            obj.review_settings['ask_' + key + '_midterm_appraisal'] = flag;
                            obj.review_settings[key].fill_midterm = flag;
                        }
                    });
                }
                /***** End: Mid Term Appraisal Section *****/

                /***** Start: Peer Review Section *****/
                obj.review_settings.peer_reviewers_cap = modal.peer_reviewers_cap;
                obj.review_settings.view_peer_analytics = modal.view_peer_analytics;
                if (peerEnabled) {                   
                    obj.review_settings.min_peer_reviewers_by_reviewee = modal.min_peer_reviewers_by_reviewee;
                    obj.review_settings.max_peer_reviewers_by_reviewee = modal.max_peer_reviewers_by_reviewee;
                    obj.review_settings.min_peer_reviewers_by_reviewee_manager = modal.min_peer_reviewers_by_reviewee_manager;
                    obj.review_settings.max_peer_reviewers_by_reviewee_manager = modal.max_peer_reviewers_by_reviewee_manager;
                }
                /***** End: Peer Review Section *****/
            }

            /******* VISIBILITY ********/
            if(tab == 4.5 ) {
                obj.enable_potential_grid = modal.enable_potential_grid;
                if(modal.enable_potential_grid) {
                    obj.header = modal.header;
                    obj.question = modal.question;
                    obj.options  = modal.options;
                    obj.options_range  = modal.options_range;
                    obj.potential_grid_ratings_range = modal.potential_grid_ratings_range;
                    angular.forEach(modal.ratingPotentialSetting, function (v, k) {
                    obj[k] = v;
                    });
                    angular.forEach(modal.ratingPotentialAssigned, function (v, k) {
                        obj[k] = v;
                    });
                }
            }

            /******* VISIBILITY ********/
            if(tab == 5) {

                var visibilityConditions = function (data) {
                    var payV = {};
                    angular.forEach(data, function (v, k) {
                        if(modal.reviewAllSettings[k]['competency_review'] || modal.reviewAllSettings[k]['goal_review']) {
                            payV[k] = v;
                        }
                    });
                    return payV;
                };
                obj.share_with_reviewee = visibilityConditions(modal.share_with_reviewee);
                obj.share_with_reviewees_manager = visibilityConditions(modal.share_with_reviewees_manager);
                //obj.entire_upline_visiblity = modal.entire_upline_visiblity;
            }


            
            /******* SCHEDULE ********/
            if(tab == 6) {
                obj.launch_communication = {};
                obj.launch_communication.start_date = getTimeStamp(modal.launch_communication);
                obj.launch_communication.end_date = getTimeStamp(modal.end_communication);
                angular.forEach(modal.communitionSettings, function (v, k) {
                    if (k != 'self' && k != 'manager_template_edit' && k != 'employee_template_edit' && k != 'peer_selection' && (modal.reviewAllSettings[k]['competency_review'] || modal.reviewAllSettings[k]['goal_review'])) {
                        obj.launch_communication[k + '_start_date'] = getTimeStamp(v.start_date);
                        obj.launch_communication[k + '_end_date'] = getTimeStamp(v.end_date, true);
                        obj.launch_communication[k + '_reminder_frequency'] = v.reminder_frequency;
                        obj.launch_communication[k + '_after_start_reminder'] = v.remind_before_end_date;
                    }
                    if (k == 'self' && modal.isSelfEvaluation) {
                        obj.launch_communication[k + '_start_date'] = getTimeStamp(v.start_date);
                        obj.launch_communication[k + '_end_date'] = getTimeStamp(v.end_date, true);
                        obj.launch_communication[k + '_reminder_frequency'] = v.reminder_frequency;
                        obj.launch_communication[k + '_after_start_reminder'] = v.remind_before_end_date;
                    }
                    if ((k == 'manager_template_edit' || k == 'employee_template_edit') && (modal.goalTemplateEditType == 2 || modal.competencyTemplateEditType == 2)) {
                        obj.launch_communication[k + '_start_date'] = getTimeStamp(v.start_date);
                        obj.launch_communication[k + '_end_date'] = getTimeStamp(v.end_date, true);
                        obj.launch_communication[k + '_reminder_frequency'] = v.reminder_frequency;
                        obj.launch_communication[k + '_after_start_reminder'] = v.remind_before_end_date;
                    }
                    if (k == 'peer_selection' && (modal.reviewAllSettings['peer']['competency_review'] || modal.reviewAllSettings['peer']['goal_review'])) {
                        obj.launch_communication[k + '_start_date'] = getTimeStamp(v.start_date);
                        obj.launch_communication[k + '_end_date'] = getTimeStamp(v.end_date, true);
                        obj.launch_communication[k + '_reminder_frequency'] = v.reminder_frequency;
                        obj.launch_communication[k + '_after_start_reminder'] = v.remind_before_end_date;
                    }                    
                });
            }
            
            /******* OVERALL RATING ********/
            if(tab == 4) {
                obj.enable_rating = modal.enable_rating;
                if(modal.enable_rating){
                    obj.ratings = modal.ratings;
                    obj.ratings_display = modal.ratings_display;
                    if (modal.ratings_display == 2) {
                        obj.ratings_range = modal.ratings_range;
                    }

                    obj.is_consolidated_rating = utilityService.getValue(modal, 'is_consolidated_rating', false);
                    angular.forEach(modal.ratingReviewrSetting, function (v, k) {
                        if((k != 'self' && modal.enable_rating && (modal.reviewAllSettings[k]['goal_review'] || modal.reviewAllSettings[k]['competency_review']))
                                || (k == 'self' && modal.isSelfEvaluation && (modal.isGoalOkr || modal.isCompetency))){
                            obj[k] = {weights_assigned: v.weights_assigned};
                            if (obj.is_consolidated_rating) {
                                obj[k]['consolidated_percent'] = utilityService.getValue(v, 'consolidated_percent', 0);
                            }
                            if ((k != 'self' && modal.reviewAllSettings[k]['goal_review']) || (k == 'self' && modal.isGoalOkr)) {
                                obj[k]['enable_rating_goal'] = v.enable_rating_goal;
                                if (v.enable_rating_goal) {
                                    obj[k]['goal_calculation_type'] = parseInt(v.goal_calculation_type);
                                    if (v.goal_calculation_type == 2) {
                                        obj[k]['goal_round_to_nearest'] = v.goal_round_to_nearest;
                                        if (v.goal_round_to_nearest) {
                                            obj[k]['goal_round_type'] = v.goal_round_type;
                                        }
                                    }
                                }
                                if (v.weights_assigned) {
                                    obj[k]['goal_rate_percent'] = v.goal_rate_percent;
                                    obj[k]['compentency_rate_percent'] = v.compentency_rate_percent ? v.compentency_rate_percent : 0;
                                }
                            }
                            
                            if ((k != 'self' && modal.reviewAllSettings[k]['competency_review']) || (k == 'self' && modal.isCompetency)) {
                                obj[k]['enable_rating_competency'] =  v.enable_rating_competency;
                                if (v.enable_rating_competency) {
                                    obj[k]['competency_calculation_type'] = parseInt(v.competency_calculation_type);
                                    if (v.competency_calculation_type == 2) {
                                        obj[k]['competency_round_to_nearest'] = v.competency_round_to_nearest;
                                        if (v.competency_round_to_nearest) {
                                            obj[k]['competency_round_type'] = v.competency_round_type;
                                        }
                                    }
                                }
                                if (v.weights_assigned) {
                                    obj[k]['goal_rate_percent'] = v.goal_rate_percent ? v.goal_rate_percent : 0;
                                    obj[k]['compentency_rate_percent'] = v.compentency_rate_percent;
                                }
                            }

                            if (utilityService.getValue(v, 'enable_rating_goal') || utilityService.getValue(v, 'enable_rating_competency')) {
                                obj[k]['can_admin_overwrite_rating'] = v.can_admin_overwrite_rating;
                            }
                        }
                    });
                }
            }

            return obj;
        };
        this.buildTemplateObject = function() {
            return {
                type: 11,
                is_scratch: true,
                origin: 1,
                is_mandatory: true,
                name: null,
                description: null,
                module_key: "appraisal",
                exist_form_way: 1,
                form_id: null
            }
        };
        this.buildTemplatePayload = function(model) {
            var payload = {
                name: model.name,
                description: model.description,
                module_key: model.module_key,
                is_mandatory: model.is_mandatory,
                is_scratch: model.origin == 1 ? true : false,
                type: parseInt(model.type, 10)
            };

            if(model.origin == 2) {
                payload.exist_form_way = parseInt(model.exist_form_way, 10);
                payload.form_id = model.form_id;
            }

            return payload;            
        }; 
        this.buildSampleResponse = function () {
            return null;
        };
        this.buildTabSectionObject = function () {
            return {
                openMultiple: true,
                list: [
                    {
                        slug: 'name',
                        title: 'Basic Details',
                        visible: true,
                        position : 1,
                        tab : 1,
                        template : 'adminPerformance/reviews/reviewCycle/review-cycle-tabs/name.html'
                    },
                    {
                        slug: 'self_evaluation',
                        title: 'Self Evaluation',
                        visible: true,
                        position : 2,
                        tab : 2,
                        template : 'adminPerformance/reviews/reviewCycle/review-cycle-tabs/self-evaluation.html'
                    },
                    {
                        slug: 'reviews',
                        title: 'Reviews',
                        visible: true,
                        position : 3,
                        tab : 3,
                        template : 'adminPerformance/reviews/reviewCycle/review-cycle-tabs/reviews.html'
                    },
                    {
                        slug: 'overall_rating',
                        title: 'Ratings Methodology',
                        visible: true,
                        position : 4,
                        tab : 4,
                        template : 'adminPerformance/reviews/reviewCycle/review-cycle-tabs/overall-rating.html'
                    },
                    {
                        slug: 'potential_grid',
                        title: '9-Grid',
                        visible: true,
                        position : 4.5,
                        tab : 4.5,
                        template : 'adminPerformance/reviews/reviewCycle/review-cycle-tabs/potential-grid.html'
                    },
                    {
                        slug: 'visibility',
                        title: 'Visiblity Settings',
                        visible: true,
                        position : 5,
                        tab : 5,
                        template : 'adminPerformance/reviews/reviewCycle/review-cycle-tabs/visibility.html'
                    },
                    {
                        slug: 'schedule',
                        title: 'Timelines',
                        visible: true,
                        position: 6,
                        tab : 6,
                        template : 'adminPerformance/reviews/reviewCycle/review-cycle-tabs/schedule.html'
                    },
                    {
                        slug: 'relevance',
                        title: 'Cycle Relevance',
                        visible: true,
                        position : 7,
                        tab : 7,
                        template : 'adminPerformance/reviews/reviewCycle/review-cycle-tabs/relevance.html'
                    }
                ]
            };
        };
        this.buildDialogActionObject = function () {
            return {
                delete: {
                    title: 'Delete Cycle',
                    textContent: 'Reviews, Cycle settings and any other details will be deleted forever and you will not be able to retrieve the same again',
                    ok: 'Yes, please delete',
                    cancel: 'Cancel'
                },
                cron: {
                    title: 'Would you like to run this cron?',
                    textContent: 'Please double check every thing before taking this action.',
                    ok: 'Yes, please run',
                    cancel: 'Cancel'
                },
                removeGoalCompetency: {
                    title: 'Confirm to Remove',
                    textContent: 'Please double check every thing before taking this action.',
                    ok: 'Yes, please remove',
                    cancel: 'Cancel'
                }
            };
        };
        this.extractAddedEmployees = function (list) {
            var ids = [];

            angular.forEach(list, function (value, key) {
                ids.push(value.id);
            });

            return ids;
        };
        this.buildAddEmployeedPayload = function (list) {
            return {
                emp_ids: this.extractAddedEmployees(list)
            };
        };    
    }
]);