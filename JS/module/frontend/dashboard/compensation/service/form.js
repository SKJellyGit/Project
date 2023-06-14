app.service('CompensationFormService', [
	'$timeout', 'utilityService',        
	function ($timeout, utilityService) {
		'use strict';
		var self = this;

        this.url = {
            formEligibility: 'employee/forms/check-eligibility',
            viewDownloadForm16: 'employee/form16',
            viewDownloadForm12: 'employee/form12',
            generateForm12bb: 'employee/generate-form',

        };        
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildFormObject = function() {
            var assessmentYear = utilityService.getCurrentAssessmentYear(),
    	        object = {
                    year: assessmentYear,
            		yearList: [],
        			list: this.buildFormList(),
                    visible: false,
                    type: {
                        form_16a: false,
                        form_16b: false,
                        form_12bb: false,
                        form_16: false,
                        form_16aq: false,

                    }
                };
                
                var startYear = utilityService.startYear + 1;
                while(startYear <= assessmentYear){
                    object.yearList.push(startYear);
                    startYear++;
                }

            // object.yearList.push(utilityService.startYear + 1);
            // object.yearList.push(assessmentYear);

            return object;
        };
        this.buildFormList = function() {
            return [
                {
                    name: "Form 16",                    
                    description: "Form 16A is applicable for TDS on Income Other than Salary. Part B of Form 16 is an annexure to Part A. If you change your job in one financial year, then it is for you to decide if you would want Part B of the Form from both the employers or from the last employer.",
                    enable: false,
                    slug: "form_16",
                    type: "AB",
                    visible: true,
                    generated: false,
                    message: null,
                    urlPrefix: 'viewDownloadForm16'
                },
                {
                    name: "Form 16 Part A",                    
                    description: "Form 16A is applicable for TDS on Income Other than Salary",
                    enable: false,
                    slug: "form_16a",
                    type: "A",
                    visible: true,
                    generated: false,
                    message: null,
                    urlPrefix: 'viewDownloadForm16'
                },
                {
                    name: "Form 16 Part B",
                    description: "Part B of Form 16 is an annexure to Part A. If you change your job in one financial year, then it is for you to decide if you would want Part B of the Form from both the employers or from the last employer.",
                    enable: false,
                    slug: "form_16b",
                    type: "B",
                    visible: true,
                    generated: false,
                    message: null,
                    urlPrefix: 'viewDownloadForm16'
                },
                
                {
                    name: "Form 16A Quarter 1",
                    // description: "Form 12BB is to claim Income Tax Deductions by Employees. If you are an employee of a company, at the beginning of every financial year (or) while joining the company you have to submit 'Income Tax Declaration' to your employer.",
                    enable: true,
                    slug: "form_16a_q1",
                    type: "A",
                    visible: true,
                    generated: true,
                    message: null,
                    urlPrefix: 'viewDownloadForm16',
                    quarter: 'Q1'
                    // quarter: {
                    //     enable: true,
                    //     list: this.buildQuarterList()
                    // }
                    // generateUrlPrefix: 'generateForm12bb',
                    // generate_type: '12bb'
                },
                {
                    name: "Form 16A Quarter 2",
                    // description: "Form 12BB is to claim Income Tax Deductions by Employees. If you are an employee of a company, at the beginning of every financial year (or) while joining the company you have to submit 'Income Tax Declaration' to your employer.",
                    enable: true,
                    slug: "form_16a_q2",
                    type: "A",
                    visible: true,
                    generated: true,
                    message: null,
                    urlPrefix: 'viewDownloadForm16',
                    quarter: 'Q2'
                    // quarter: {
                    //     enable: true,
                    //     list: this.buildQuarterList()
                    // }
                    // generateUrlPrefix: 'generateForm12bb',
                    // generate_type: '12bb'
                },
                {
                    name: "Form 16A Quarter 3",
                    // description: "Form 12BB is to claim Income Tax Deductions by Employees. If you are an employee of a company, at the beginning of every financial year (or) while joining the company you have to submit 'Income Tax Declaration' to your employer.",
                    enable: true,
                    slug: "form_16a_q3",
                    type: "A",
                    visible: true,
                    generated: true,
                    message: null,
                    urlPrefix: 'viewDownloadForm16',
                    quarter: 'Q3'
                    // quarter: {
                    //     enable: true,
                    //     list: this.buildQuarterList()
                    // }
                    // generateUrlPrefix: 'generateForm12bb',
                    // generate_type: '12bb'
                },
                {
                    name: "Form 16A Quarter 4",
                    // description: "Form 12BB is to claim Income Tax Deductions by Employees. If you are an employee of a company, at the beginning of every financial year (or) while joining the company you have to submit 'Income Tax Declaration' to your employer.",
                    enable: true,
                    slug: "form_16a_q4",
                    type: "A",
                    visible: true,
                    generated: true,
                    message: null,
                    urlPrefix: 'viewDownloadForm16',
                    quarter: 'Q4'
                    // quarter: {
                    //     enable: true,
                    //     list: this.buildQuarterList()
                    // }
                    // generateUrlPrefix: 'generateForm12bb',
                    // generate_type: '12bb'
                },
                {
                    name: "Form 12BB",
                    description: "Form 12BB is to claim Income Tax Deductions by Employees. If you are an employee of a company, at the beginning of every financial year (or) while joining the company you have to submit 'Income Tax Declaration' to your employer.",
                    enable: false,
                    slug: "form_12bb",
                    type: "BB",
                    visible: true,
                    generated: false,
                    message: null,
                    urlPrefix: 'viewDownloadForm12',
                    generateUrlPrefix: 'generateForm12bb',
                    generate_type: '12bb'
                },
            ]
        };
        this.buildGenerateFormPayload = function(object) {
            return {
                ay_year_from: parseInt(object.year, 10),
                ay_year_to: (parseInt(object.year, 10)) + 1
            };
        };
        this.buildQuarterList = function() {
            return {
                list: [
                    {
                        name: 'Q1',
                        value: 1
                    },
                    {
                        name: 'Q2',
                        value: 2
                    },
                    {
                        name: 'Q3',
                        value: 3
                    },
                    {
                        name: 'Q4',
                        value: 4
                    }
                ],
                selected: 'Q1'
            };
        };

	    return this;
	}
]);