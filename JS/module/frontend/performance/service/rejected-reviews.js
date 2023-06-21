app.service('RejectedReviewsService', ['utilityService',        
	function (utilityService) {
		'use strict';

        this.remainderType = 30;
	    this.url = {
	    	rejectedReviews: 'admin-frontend/performance/rejected-reviews'  	
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
        this.buildOverallObject = function(routeParams) {
            return {
                individualReviews: [],
                filteredList: [],
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
                }
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
                    "Reviewer Name", "Reviewer Employee Code", "Relationship", "Comment"]), 
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
                array.push(utilityService.getValue(value, 'rejected_comment'));

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