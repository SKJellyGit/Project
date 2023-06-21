app.service('AdminForm12bbService', ['utilityService',
    function (utilityService) {
        'use strict';
        var self = this;

        this.url = {            
            employeeList : 'payroll/form12-employees',
            viewDownloadTaxForm12bb: 'payroll/form12'
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
        this.buildFormList = function () {
            return [
                {
                    slug: "bb",
                    title: "Form 12BB"
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
        this.buildAdminFormsObject = function () {
            return {
                selected: "bb",
                list: this.buildFormList()
            };
        };
        this.buildAssessmentYearObject = function () {
            var assessmentYear = utilityService.getCurrentAssessmentYear(),
                object = {
                    start: assessmentYear,
                    list: []
                };

            object.list.push(utilityService.startYear + 1);
            object.list.push(assessmentYear);

            return object;
        };

    }
]);