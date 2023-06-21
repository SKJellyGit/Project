app.service('PerformanceReportService', ['utilityService',        
	function (utilityService) {
		'use strict';

	    this.url = {
	    	getAllReviewCycle: 'admin-frontend/performance/review-cycles', 
            getCycleRelation: 'performance/appraisal-cycle-relations',
            appraisalReport: 'performance/appraisal-report',
            promotionReport: 'performance/appraisal-promotion-recommendation-report',
            salaryPromotionReport: 'performance/salary-promotion-recommendation-report'
 	
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };

        this.bulidFinalTaList = function (list,header) {
            var object = {listWithoutHeader: [], content:[]};
			
			object.content.push(header);
            angular.forEach(list, function (value, key){
                object.content.push(value);
                object.listWithoutHeader.push(value);
            });
			
            return object;
		};      
        	    	    
		return this;
	}
]);