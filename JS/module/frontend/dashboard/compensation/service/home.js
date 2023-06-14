app.service('HomeService', [
	'$timeout', 'utilityService',        
	function ($timeout, utilityService) {
		'use strict';
		var self = this;

        this.url = {
           modulestatus: 'payroll/loan-advance/settings'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
         this.compensationTabObj = function () {
            return{
                "Loan Advance": {
                    pTab: 1,
                    cTab: 4
                }
            };
        };
        }]);