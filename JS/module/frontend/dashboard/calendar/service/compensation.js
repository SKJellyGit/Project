app.service('CompensationService', [
	'$timeout', 'utilityService',        
	function ($timeout, utilityService) {
		'use strict';
		var self = this;

        this.url = {
        	duration: 'employee-salary/revised-date-list',
    	   	ctc: 'employee-salary/ctc-component', 
    	   	tax: 'employee-salary/tax-saving',
			account: 'employee-salary/account-details',
			getEmployeeTaxRegime: 'employee/tax-calculator'
        }; 
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildDefaultYearObject = function() {
        	var year = utilityService.getCurrentYear(),
        		month = utilityService.getCurrentMonth();

        	if(year > utilityService.startYear && month < utilityService.startMonth) {
        		--year;
        	}

        	return year;
            //return year + " - " + (year + 1);
        };
	    this.buildTaxYearList = function(start) {
            var date = new Date(),
                year = utilityService.getCurrentYear(),
                month = utilityService.getCurrentMonth(),
                start = angular.isDefined(start) ? start : (year - 5),
                yearList = [];

            for(var i = year; i >= start; i--) {
            	if (i > start && month < utilityService.startMonth && i == utilityService.getCurrentYear()) {
            		continue;
            	}                
                yearList.push(i);
                //yearList.push(i + " - " + (i+1));
            }

		    return yearList.reverse();
		};        
	    this.buildSummaryObject = function() {
	    	return {
	    		ctc: {
	    			visible: false,
	    			amount: null,
	    			breakup: [],
	    			graph: [],
	    			duration: null,
	    			durationList:  [],
		    		monthList: utilityService.buildMonthList()
	    		},
	    		tax: {
	    			year: this.buildDefaultYearObject(),
	    			yearList: this.buildTaxYearList(utilityService.startYear),
	    			visible: false,	    			
	    			amount: null,
	    			savings: null,
	    			breakup: [],
	    			graph: []
	    		},
	    		account: {
	    			segmentId: null,
	    			details: [],
	    			cpdetails: []
	    		}
	    	}
	    };
	    this.calculatePercentage = function(value, total) {
	    	var percentage = ((value/total) * 100),
	    		fixed = percentage.toFixed(2);

	    	return parseFloat(fixed); 
	    };
	    this.extractMaxComponent = function(breakup, key) {
	    	if(!breakup.length) {
	    		return {};
	    	}
	    	var max = breakup.reduce(function(prev, current) {
    			return (prev[key] > current[key]) ? prev : current
			});

	    	return max;
	    };
	    this.buildGraphObject = function(v, percentage, maxObject, componentValue, name) {
	    	return {
    			name: v[name],
    			y: percentage,
    			amount: v[componentValue],
    			sliced: false, //maxObject[componentValue] == v[componentValue] ? true : false,
	    		selected: false,//maxObject[componentValue] == v[componentValue] ? true : false
    		}
	    };
	    this.buildGraphData = function(data, maxObject, componentValue, amount, name) {
	    	var graph = [];
	    		
	    	angular.forEach(data.breakup, function(v, k) {
	    		if(v[componentValue] > 0) {
	    			graph.push(self.buildGraphObject(v, self.calculatePercentage(v[componentValue], data[amount]), maxObject, componentValue, name));	
	    		}	    		
	    	});

	    	return graph;
	    };
	    this.buildCTCComponentGraph = function(data) {
	    	if(!data) {
	    		return [];
	    	}

	    	var graph = [],
	    		maxObject = this.extractMaxComponent(data.breakup, 'value');

	    	graph = this.buildGraphData(data, maxObject, 'value', 'amount', 'name');

	    	return graph;
	    };
	    this.buildTaxComponentGraph = function(data) {
	    	if(!data) {
	    		return [];
	    	}

	    	var graph = [],
	    		maxObject = this.extractMaxComponent(data.breakup, 'declared_amt');

	    	graph = this.buildGraphData(data, maxObject, 'declared_amt', 'total_investments', 'sec_no');

	    	return graph;
	    };
	    this.resetBreakup = function(model, key) {
            model[key].breakup = [];
        };
        this.toggleGraphVisible = function(model, key, flag) {
            if(flag) {
                $timeout(function() {
                    model[key].visible = true;
                }, 100);
            } else {
                model[key].visible = false;
            }
        };
        
	    return this;
	}
]);