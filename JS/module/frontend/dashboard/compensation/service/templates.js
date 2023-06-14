app.service('CompensationTemplatesService', ['utilityService',        
	function (utilityService) {
		'use strict';
		var self = this;

        this.url = {
            formEligibility: 'employee/forms/check-eligibility',
            downloadTemplate: 'employee/payroll/download/template'
        };        
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
        };
        this.buildEligibilityObject = function () {
            return {
                car_running: {
                    is_eligible: true,
                    generated: true
                },
                driver_salary: {
                    is_eligible: true,
                    generated: true
                },
                lta_claim: {
                    is_eligible: true,
                    generated: true
                },
                salary_certificate:  {
                    is_eligible: true,
                    generated: true
                },
                reimbursement_claim:  {
                    is_eligible: true,
                    generated: true
                }
            }
        };
	    this.buildTemplatesObject = function() {
            var assessmentYear = utilityService.getCurrentAssessmentYear(),
    	        object = {
                    year: assessmentYear,
            		yearList: [],
        			list: this.buildTemplateList(),
                    visible: false,
                    type: {
                        car_running: false,
                        driver_salary: false,
                        lta_claim: false,
                        salary_certificate: false,
                        reimbursement_claim: false
                    }
        		};

            object.yearList.push(utilityService.startYear + 1);
            object.yearList.push(assessmentYear);

            return object;
        };
        this.buildTemplateList = function() {
            return [
                {
                    name: "Car Running Details",                    
                    description: "Car running details",
                    enable: false,
                    slug: "car_running",
                    type: "A",
                    visible: true,
                    generated: false,
                    message: null,
                    urlPrefix: 'downloadTemplate'
                },
                {
                    name: "Driver Salary Claim",
                    description: "Driver salary claim",
                    enable: false,
                    slug: "driver_salary",
                    type: "B",
                    visible: true,
                    generated: false,
                    message: null,
                    urlPrefix: 'downloadTemplate'
                },
                {
                    name: "LTA Claim",
                    description: "LTA Claim",
                    enable: false,
                    slug: "lta_claim",
                    type: "BB",
                    visible: true,
                    generated: false,
                    message: null,
                    urlPrefix: 'downloadTemplate'
                },
                {
                    name: "Salary Certificate",
                    description: "Salary Certificate",
                    enable: false,
                    slug: "salary_certificate",
                    type: "BB",
                    visible: true,
                    generated: false,
                    message: null,
                    urlPrefix: 'downloadTemplate'
                },
                {
                    name: "Reimbursement Claim",
                    description: "Reimbursement Claim",
                    enable: false,
                    slug: "reimbursement_claim",
                    type: "BB",
                    visible: true,
                    generated: false,
                    message: null,
                    urlPrefix: 'downloadTemplate'
                }
            ]
        };

	    return this;
	}
]);
