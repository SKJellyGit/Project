app.service('FnfLettersService', ['utilityService', 'SalaryService', 
    function (utilityService, salaryService) {
        'use strict';

        this.url = {
            validateToken: 'fnf/validate-fnf-link',
            letters: 'fnf/employee-letters',
            slipStatus: 'fnf/employee-slip-status',
            slip: 'fnf/employee-slips',
            downloadLetter: 'fnf/employee-download-letter',
            slipManual: 'fnf/employee-download-fnf-certificate'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildLinkTokenObject = function (routeParams) {
            return {
                valid: false,
                message: false,
                visible: false,
                token: utilityService.getValue(routeParams, 'token'),
                letterList: [],
                monthReverseMapping: {
                    'January': 1,
                    'February': 2,
                    'March': 3,
                    'April': 4,
                    'May': 5,
                    'June': 6,
                    'July': 7,
                    'August': 8,
                    'September': 9,
                    'October': 10,
                    'November': 11,
                    'December': 12
                }
            };
        };
        this.buildMyPayObject = function () {
            return {
                slip: this.buildSlipObject()
            };
        };

        this.buildSlipObject = function(model) {
	    	return {
    			type: 1,
    			download: false,
    			yearList: utilityService.getYearList(utilityService.startYear),
    			currentYear: utilityService.getCurrentYear(),
    			monthList: utilityService.buildMonthList(),
    			currentMonth: utilityService.startMonth,
    			typeList: [{id: 1, name: "Salary Slip"}, {id: 2, name: "Tax Slip"}, {id: 4, name: "Fnf Slip"}],
    			enable: false,
    			message: null
    		}
	    };
        this.extractAndAssignJoiningMonthYear = function (dateString) {
            if (!dateString) {
                return null;
            }

            var dateArray = dateString.split('/');
            return {
                date: parseInt(dateArray[0], 10),
                month: parseInt(dateArray[1], 10),
                year: parseInt(dateArray[2], 10),
                fullDate: parseInt(dateArray[1], 10) + '-' + parseInt(dateArray[0], 10) + '-' + parseInt(dateArray[2], 10)
            };
        };
        this.extractAndAssignRelievingMonthYear = function (dateString, monthReverseMapping) {
            if (!dateString) {
                return null;
            }

            var dateArray = dateString.split(' ');
            return  {
                date: parseInt(dateArray[0], 10),
                month: monthReverseMapping[dateArray[1]],
                year: parseInt(dateArray[2], 10),
                fullDate: monthReverseMapping[dateArray[1]] + '-' + parseInt(dateArray[0], 10) + '-' + parseInt(dateArray[2], 10)
            };
        };
        this.setFormSectionAdditionalKeys = function(list, data) {
            angular.forEach(list, function(value, key) {
                var object = utilityService.getValue(data, value.slug);
                value.enable = utilityService.getValue(object, 'is_eligible', false);
                value.generated = utilityService.getValue(object, 'generated', false);
                value.message = utilityService.getValue(object, 'message', 'Form has not been generated yet!');
            });
        };
                
    }
]);