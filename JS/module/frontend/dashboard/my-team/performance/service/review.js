app.service('ManagerReviewService', ['utilityService',        
	function (utilityService) {
		'use strict';

        this.remainderType = 30;
	    this.url = {
	    	reviews: 'myteam/performance/reviews',
	    	details: 'myteam/performance/review-details',
	    	adminDetails: 'admin-frontend/performance/review-details',
            remainder: 'prejoin/frontend/send-reminder',
            recommendationDetails: 'admin-frontend/performance/appraisal-fill-recommendation--details',
            downloadAnswerAttachment: 'performance/download-recommendation-file',
            otherRelations: 'performance/other-relations',	    	
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };	    
	    this.buildCycleListObject = function() {
	    	return {
	    		filteredList: [],
            	list: [],
        		propertyName: '',
            	reverse: false,
            	search: {
            		name: ''
            	},
            	statusHashMap: {
            		1: 'Draft',
            		3: 'Active',
            		4: 'Completed',
            		5: 'Upcoming'
            	},
                visible: false,
                error: {
                    status: false,
                    message: null
                }
            }
	    };
        this.buildOverallObject = function(routeParams) {
            return {
                filteredList: [],
                isChecked: false,
                propertyName: 'reviewee.full_name',                                                
                relationship: {
                    mapping: {
                        self: 'Self Evaluation',
                        direct_reports: 'Direct Reports',
                        manager: 'Manager',
                        skip_manager: 'Skip Level Manager',
                        peer: 'Peer'
                    }   
                },
                relationFilterList: this.buildRelationFilterObject(),
                reverse: false,
                visible: false,
                developmentPlan: [],
                recommendationReadOnly: true,
                recommendation_id: null,
                otherRelations: {
                    enabled: false,
                    list: [],
                    object: {}
                },
                search: {
                    selected: 1,
                    list: [
                        {
                            id: 1,
                            title: 'Reviewee'
                        },
                        {
                            id: 2,
                            title: 'Reviewer'
                        }
                    ]
                }
            }
        };	    
        this.buildGetParams = function (routeParams) {
            return {
                rel_id: utilityService.getValue(routeParams, 'rel_id'),
                direct_reportee: utilityService.getValue(routeParams, 'direct_reportee'),
            };
        };
        this.buildRatingMappingObject = function(data) {
            var mapObject = {},
                ratings = utilityService.getInnerValue(data, 'settings', 'ratings');

            angular.forEach(ratings, function(value, key) {
                mapObject[value.score] = value.description;
            });

            return mapObject;
        };        
        this.buildGraphObject = function(data) {
            return {
                series: [{
                    name: 'Goal/OKR',
                    data: [4, 10, 20, 10, 6]
                }, {
                    name: 'Competency/Behavioral',
                    data: [20, 6, 10, 4, 10]
                }],
                categories: [
                    '0-1 (Poor)',
                    '1-2 (Average)',
                    '2-3 (Good)',
                    '3-4 (Very Good)',
                    '4-5 (Excellent)'
                ],
                visible: true
            }
        };
        this.extractMasterSlaveIds = function(list) {
            var reviewerIds = [];

            angular.forEach(list, function(value, key) {
                if(value.isChecked) {
                    reviewerIds.push(utilityService.getInnerValue(value, 'reviewer', '_id'));
                }                
            });

            return reviewerIds;
        };
        this.buildRemainderPayload = function(masterEmpId, list) {
            return {
                master_emp_id: masterEmpId,
                slave_emp_id: this.extractMasterSlaveIds(list),
                type: this.remainderType
            }
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
        this.buildOverallRatingExportListData = function(overall) {
            var empDetailsData = overall.filteredList,
                mapping = overall.relationship.mapping,
                arr = new Array(["Reviewee Name", "Reviewee Employee Code", "Reviewer Name", "Reviewer Employee Code", "Relationship", 
                    "Overall Rating", "Promotion Recommendation"]), 
                object = {
                    list: empDetailsData,
                    content: arr
                };

            angular.forEach(object.list, function(value, key) {                
                var array = new Array(),
                    reviewer = {
                        name: 'Anonymous', 
                        code: '-',
                        type: '-'
                    };
                
                array.push(utilityService.getInnerValue(value, 'reviewee', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'reviewee', 'emp_code'));
                
                if (!utilityService.getValue(value, 'is_anonymous')) {
                    reviewer.name = utilityService.getInnerValue(value, 'reviewer', 'full_name');
                    reviewer.code = utilityService.getInnerValue(value, 'reviewer', 'employee_code');
                    reviewer.type = mapping[value.reviewer_type];
                }

                array.push(reviewer.name);
                array.push(reviewer.code);
                array.push(reviewer.type);
                array.push(utilityService.getValue(value, 'overall_rating') > 0 
                    ? utilityService.getValue(value, 'overall_rating') : 'N/A');
                
                var recommendationText = (value.recommended_for_promotion === null 
                    || value.reviewer_type == 'direct_reports') ? 'N/A' 
                        : (value.recommended_for_promotion ? 'Yes' : 'No');
                array.push(recommendationText);

                object.content.push(array);
            });

            return object;
        };
        this.buildAllFilterObject = function () {
            return [
                {
                    countObject: 'groupTemp', 
                    isGroup: true, 
                    collection_key: 'reviewee'
                }, 
                {
                    countObject: 'employeeStatus', 
                    key: 'reviewer_type'
                }
            ];
        };
        	    	    
		return this;
	}
]);