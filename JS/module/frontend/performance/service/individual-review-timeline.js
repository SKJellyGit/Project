app.service('IndividualReviewTimelineService', ['utilityService',        
	function (utilityService) {
		'use strict';

        this.remainderType = 30;
	    this.url = {
	    	individualReviewTimetime: 'admin-frontend/performance/reviewee-reviewer',
            changeTime: 'admin-frontend/performance/change-review-end-date',
            sendReminder: 'prejoin/frontend/send-reminder'	    	
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
        this.buildReviewStatusMapping = function () {
            return {
                1: {
                    text: 'Completed',
                    class: 'green'
                },
                2:  {
                    text: 'Not Started',
                    class: 'red'
                },
                3: {
                    text: 'Not Applicable',
                    class: 'red'
                },
                4: {
                    text: 'In Progess',
                    class: 'orange'
                }/*,
                99: {
                    text: 'Not Started Yet',
                    class: 'gray'
                }*/
            };
        };
        this.buildDefaultIndividualTimelineObject = function () {
            return {
                type: {
                    selected: 1,
                    list: [
                        {
                            id: 1,
                            title: "Tomorrow's Date"
                        },
                        {
                            id: 2,
                            title: "Custom Date"
                        }
                    ]
                },
                endDate: null,
                currentDate: new Date(),
                isCheckbox: {
                    disabled: false
                }
            }
        };    
	    this.buildOverallObject = function(routeParams) {
            return {
                setting: {
                    cycle_start: null,
                    cycle_end: null,
                    cycle_start_date: null,
                    cycle_end_date: null
                },
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
                status: '',
                statusMapping: this.buildReviewStatusMapping(),
                selectedCount: 0,
                individualTimeline: this.buildDefaultIndividualTimelineObject(),
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
                },
                otherRelations: {
                    enabled: false,
                    list: [],
                    object: {}
                },
                isRemainderClicked: false
            }
        };	    
        this.buildRatingMappingObject = function(data) {
            var mapObject = {},
                ratings = utilityService.getInnerValue(data, 'settings', 'ratings');

            angular.forEach(ratings, function(value, key) {
                mapObject[value.score] = value.description;
            });

            return mapObject;
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
        this.buildExportData = function(overall) {
            var empDetailsData = overall.filteredList,
                mapping = overall.relationship.mapping,
                arr = new Array(["Reviewee Name", "Reviewee Employee Code", 
                    "Reviewer Name", "Reviewer Employee Code", "Relationship", 
                    "Start Date", "End Date", "Review Status"]), 
                object = {
                    list: empDetailsData,
                    content: arr
                };

            angular.forEach(object.list, function(value, key) {                
                var array = new Array();

                array.push(utilityService.getInnerValue(value, 'reviewee', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'reviewee', 'employee_code'));
                array.push(utilityService.getInnerValue(value, 'reviewer', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'reviewer', 'employee_code'));
                array.push(utilityService.getValue(value, 'reviewer_type_text'));
                array.push(utilityService.getValue(value, 'start_date'));
                array.push(utilityService.getValue(value, 'end_date'));
                array.push(utilityService.getValue(value, 'review_status_text'));                

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
        this.buildChangeTimelinePaylod = function (overall) {
            var payload = [],
                endDate = overall.individualTimeline.type.selected == 1 
                    ? new Date(Date.now() + 24 * 60 * 60 * 1000)
                    : overall.individualTimeline.endDate;
                        
            angular.forEach(overall.filteredList, function (value, key) {
                if (value.isChecked) {
                    payload.push({
                        reviewee: utilityService.getInnerValue(value, 'reviewee', '_id'),
                        reviewer: utilityService.getInnerValue(value, 'reviewer', '_id'),
                        relation: utilityService.getValue(value, 'reviewer_type'),
                        end_date: utilityService.dateFormatConvertion(endDate)
                    });
                }
            });
            
            return payload;
        };        
        this.extractReviewerIds = function (list) {
            var ids = [];

            angular.forEach(list, function (value, key) {
                if (value.isChecked) {
                    ids.push(utilityService.getInnerValue(value, 'reviewer', '_id'));
                }
            });
            
            return ids;
        }; 
        	    	    
		return this;
	}
]);