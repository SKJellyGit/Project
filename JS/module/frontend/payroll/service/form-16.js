app.service('AdminForm16Service', ['utilityService',
    function (utilityService) {
        'use strict';
        var self = this;

        this.url = {            
            employeeList : 'payroll/form16-employees',
            viewDownloadTaxForm16: 'payroll/form16',
            AQU: 'payroll/upload/form16',
            AQD: 'payroll/upload/form16'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildAllFilterObject = function () {
            return [
                {
                    countObject: 'group',
                    isGroup: true,
                    collection_key: 'employee_preview'
                },
                {
                    countObject: 'employeeStatus',
                    collection: [1, 2, 3, 4, 5],
                    isArray: false,
                    key: 'employee_status'
                }
            ];
        };
        this.buildFormList = function (forms) {
            return [
                {
                    slug: "A",
                    title: "Form 16 Part A",
                    isHidden: forms.form_16a.isHidden
                },
                {
                    slug: "B",
                    title: "Form 16 Part B",
                    isHidden: forms.form_16b.isHidden
                },
                {
                    slug: "AQ",
                    title: "Form 16 Part A Quarter",
                    quarter: true,
                    isHidden: forms.form_16a_q.isHidden
                }
            ];
        };
        this.buildEmployeeObject = function () {
            return {
                list: [],
                filteredList: [],
                visible: false,
                propertyName: '',
	            reverse: false
            };
        };
        this.buildAdminFormsObject = function (forms) {
            return {
                selected: "B",
                list: this.buildFormList(forms)
            };
        };
        this.buildAssessmentYearObject = function () {
            var assessmentYear = utilityService.getCurrentAssessmentYear(),
                object = {
                    start: assessmentYear,
                    list: []
                };
            var startYear = utilityService.startYear + 1;
            while(startYear <= assessmentYear){
                object.list.push(startYear);
                startYear++;
            }
            // object.list.push(utilityService.startYear + 1);

            return object;
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

    }
]);