app.service('SlipService', [
    '$timeout', 'utilityService',
    function ($timeout, utilityService) {
        'use strict';

        var self = this;

        this.url = {            
            employeeList : 'payroll/employees-list/3_2018?slip_type=1',
            // generateSalarySlip: 'payroll/generate-salary-slip',
            generateSalarySlip: 'payroll/generate-slip/1',
            // generateTaxSlip: 'payroll/generate-tax-slip',
            generateTaxSlip: 'payroll/generate-slip/2',
            releaseSlip : 'payroll/slip/release-to-employee',
            viewDownloadTaxSlip: 'payroll/tax/computation',
            downloadZip: 'payroll/download-slip-zip',
            generateForm12bb: 'payroll/generate-form/12bb',
            downloadFormZip: 'payroll/download-form-zip',
            generateSlip: 'payroll/generate-payroll-slip',
            generateForm16B: 'payroll/generate-form/16b'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };

        this.buildSlipTypeList = function() {
            return [
                {
                    id: 1,
                    title: "Salary Slip",
                    slug: "salary_slip"
                },
                {
                    id: 2,
                    title: "Tax Slip",
                    slug: "tax_slip"
                },
                {
                    id: 3,
                    title: "Reimbursement Slip",
                    slug: "reimbursement_slip"
                },
                {
                    id: 101,
                    title: "Form 12BB",
                    slug: "bb"
                },
                {
                    id: 4,
                    title: "FndF Slip",
                    slug: "fndf_slip"
                },

                {
                    id: 102,
                    title: "Form 16B",
                    slug: "B"
                }
            
            ]
        };

        this.templateNamesHash = function ()  {
            return {
                1: {
                    1: 'Tax calculation shown',
                    2: 'All claims shown when paid',
                    3: 'No claims shown',
                    4: 'Profile fields change',
                    5: 'Claims shown if paid & in gross',
                    6: 'Credit rate shown'
                }
            }
        }   
        this.buildSlipTypeMapping = function() {
            return {
                1: "Salary Slip",
                2: "Tax Slip",
                3: "Reimbursement Slip",                
                4: "FndF Slip",
                101: "Form 12BB",
                5: 'Form 16B'
            }
        };
        this.buildActionList = function() {
            return [
                {
                    id: 1,
                    title: "View/Download",
                    slug: "view_download"
                },
                {
                    id: 2,
                    title: "Generate",
                    slug: "generate"
                },
                {
                    id: 3,
                    title: "Release",
                    slug: "release"
                },
                {
                    id: 4,
                    title: "Release & Send",
                    slug: "release"
                }]
        };
        this.buildSalarySlipTemplateList = function() {
            return [
                {
                    id: 1,
                    title: "Template One",
                    slug: "template_1"
                },
                {
                    id: 2,
                    title: "Template Two",
                    slug: "template_2"
                },
                {
                    id: 3,
                    title: "Template Three",
                    slug: "template_3"
                },
                {
                    id: 4,
                    title: "Template Four",
                    slug: "template_4"
                },
                {
                    id: 5,
                    title: "Template Five",
                    slug: "template_5"
                },
                {
                    id: 6,
                    title: "Template Six",
                    slug: "template_6"
                }
            ]
        };
        this.extractCheckedEmpIds = function(list) {
            var empIds = [];

            angular.forEach(list, function(value, key) {
                if(value.isChecked) {
                    empIds.push(value.employee_preview._id);
                }
            });

            return empIds;
        };
        this.buildGenerateSlipPayload = function(model, employees, object) {
            var payload = {
                template_type: model.template.value.toString(),
                month: (parseInt(object.month) + 1).toString(),
                year: object.year.toString(),
                employees: employees
            };

            return payload;
        };
        this.buildReleaseSlipPayload = function(model, employees, object) {
            var payload = {
                slip_type: model.type.value.toString(),
                month: (parseInt(object.month) + 1).toString(),
                year: object.year.toString(),
                employees: employees
            };

            return payload;
        };
        this.buildSlipObject = function() {
            return {
                action: {
                    list: this.buildActionList(),
                    value: 1
                },
                error: {
                    list: [],
                    object: {},
                    section: null,
                    status: false
                },
                filteredList: [],
                list: [],
                isAllChecked: false,
                isButtonDisabled: false,
                template: {
                    list: this.buildSalarySlipTemplateList(),
                    value: 1,
                    nameHash: this.templateNamesHash()
                },
                type: {
                    list: this.buildSlipTypeList(),
                    value: 1,
                    mapping: this.buildSlipTypeMapping()
                },
                visible: false,
                propertyName: '',
	            reverse: false
            }
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
                    collection: [1,2,3,4,5],
                    isArray: false,
                    key: 'employee_status'
                }
            ];
        };
        this.buildGenerateFormPayload = function(employees, object) {
            return {
                ay_year_from: parseInt(object.year, 10),
                ay_year_to: (parseInt(object.year, 10)) + 1,
                employees: employees
            };
        };

    }
]);