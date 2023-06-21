app.service('PotentialGridService', ['utilityService',        
	function (utilityService) {
		'use strict';

        this.remainderType = 30;
	    this.url = {
            potentialGridStatistics: 'admin-frontend/performance/grid-statistics',
            potentialGridListing: 'admin-frontend/performance/grid-listing',
            potentiaListing: 'admin-frontend/performance/potential-listing'
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
        };
        
        this.buildMatrixScore = function() {
            var arrMatrix = [ "1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3-1", "3-2", "3-3" ];
            return arrMatrix;
        }
        this.buildOverallObject = function(routeParams) {
            return {
                consolidatedReviews: {
                    heads: {},
                    rows: []
                },
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
                gridfilter: {
                    selected : [],
                    listSelected : [],
                    list : [
                        { searchid : 9, name : "Diamond"},
                        { searchid : 8, name : "High Potential"},
                        { searchid : 7, name : "Superstar"},
                        { searchid : 6, name : "On the fence"},
                        { searchid : 5, name : "Solid Players"},
                        { searchid : 4, name : "High Performer"},
                        { searchid : 3, name : "Bad Hires"},
                        { searchid : 2, name : "Backups"},
                        { searchid : 1, name : "Workhorses"},
                    ]
                },
                error: {
                    status: false,
                    message: null
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
        this.buildExportDataPotential = function(overall, relationWise) {
            console.log(relationWise);
            var empDetailsData = overall.filteredList,
                mapping = overall.relationship.mapping,
                arr = new Array(["Reviewee Name", "Reviewee Employee Code", "Manager Rating", 
                    "Skip Level Manager Rating", "Direct Reports Rating", "Peer Rating", 
                    "Consolidated 9 grid value", "Consolidated Overall rating"]), 
                object = {
                    list: empDetailsData,
                    content: arr
                };

            angular.forEach(object.list, function(value, key) { 
                console.log(value);               
                var array = new Array();

                array.push(utilityService.getInnerValue(value, 'reviewee', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'reviewee', 'emp_code'));
                
                utilityService.getInnerValue(relationWise, 'setting', 'manager')
                    ? array.push(utilityService.getValue(value, 'manager')) : array.push('N/A');
                utilityService.getInnerValue(relationWise, 'setting', 'skip_manager')
                    ? array.push(utilityService.getValue(value, 'skip_manager')) : array.push('N/A');
                utilityService.getInnerValue(relationWise, 'setting', 'direct_reports')
                    ? array.push(utilityService.getValue(value, 'direct_reports')) : array.push('N/A');
                utilityService.getInnerValue(relationWise, 'setting', 'peer')
                    ? array.push(utilityService.getValue(value, 'peer')) : array.push('N/A');
                array.push(utilityService.getValue(value, 'consolidated_rating'));

                object.content.push(array);
            });

            console.log(object)

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
        this.buildExportListHeader = function(overall) {
			// Build header columns with some static values
			var columnHeaders = new Array('Reviewee', 'Reviewee Code');

			// Build header columns with some dynamic values
            angular.forEach(overall.consolidatedReviews.heads.relationships, function (value, key) {
                columnHeaders.push(value);
            });
            
            // Build header columns with some static values
            columnHeaders.push('Consolidated 9 grid value');

            columnHeaders.push('Consolidated Overall rating');
            
            return new Array(columnHeaders);
		};
		this.buildExportData = function (overall) {
			var csvContent = this.buildExportListHeader(overall);

            angular.forEach(overall.filteredList, function(value, key) {
                var array = new Array();
                
                array.push(utilityService.getInnerValue(value, 'reviewee', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'reviewee', 'personal_profile_employee_code'));
                
                angular.forEach(overall.consolidatedReviews.heads.relationships, function(v, k) {                	
                	array.push(utilityService.getValue(value, k, '') ? utilityService.getValue(value, k, '') : '');
                });
                
                array.push(utilityService.getValue(value, 'consolidated_potetial_rating') ? utilityService.getValue(value, 'consolidated_potetial_rating') + "(" + utilityService.getValue(value, 'consolidated_potetial_rating_display') + ")" : 'NA');
                
                array.push(utilityService.getValue(value, 'consolidated_rating') ? utilityService.getValue(value, 'consolidated_rating') + "(" + utilityService.getValue(value, 'consolidated_rating_display') + ")" : 'NA');

                csvContent.push(array);
            });

            return csvContent;
		};       
        	    	    
		return this;
	}
]);