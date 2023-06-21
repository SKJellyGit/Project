app.service('PayrollParentService', [
    'utilityService',
    function (utilityService) {
        'use strict';

        var self = this;

        this.url = {
            download : 'employee-salary/salary-template',
            upload : 'employee-salary/import/emp-salary',
            empDetailsHeader : 'payroll/employee-data/headers',
            empDetailsContent : 'payroll/employee-data',
            empDetailsAnnualContent : 'payroll/employee-data-annual',
            uploadSlip: 'employee-salary/import/salary-slip',
            downloadBreakup: 'employee-salary/download/annual-salary-template',
            downloadNiyoCoupon: 'payroll/download-niyo-template',
            uploadNiyoCoupon: 'payroll/upload-niyo-template',
            uploadBreakup: 'employee-salary/import/emp-annual-salary',
            declarationCsv : 'payroll/bulk-tax-declaration-template',
            uploadDeclaration: 'payroll/upload-bulk-tax-declaration',
            uploadTaxComputation: 'payroll/upload-tax-computation',
            uploadFutureSalaryBreakup: 'employee-salary/import/emp-salary/true',
            downloadBulkTaxClaim: 'payroll/bulk-tax-claimed-template',
            uploadBulkTaxClaim: 'payroll/upload-bulk-tax-claimed',            
            downloadBulkHRA: 'payroll/bulk-hra-template',
            uploadBulkHRA: 'payroll/upload-bulk-approved-hra',
            uploadBulkTaxSheet: 'payroll/upload-bulk-tax-sheet',
            uploadFndF: 'payroll/multi-legal-upload-fndf',
            downloadBulkFndFCertificate: 'payroll/bulk-fnf-template',
            uploadBulkFndFCertificate: 'payroll/upload-bulk-fnf',
            checkToAllowBulkOption: 'payroll/allow-bulk-option',
            //uploadFndF: 'payroll/upload-fndf',
            taxRegimeUpload: 'payroll/upload/template/tax-regime',
            taxRegimeDownload: 'payroll/download/template/tax-regime',
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildTemplateObject = function() {
            return {
                list: {
                    salary: {
                        id: 1,
                        title: "Employee Salary Breakup",
                        filename: "employees-salary.csv"
                    },
                    investment: {
                        id: 2,
                        title: "Investments Declarations",
                        filename: "employees-investment.csv"
                    },
                    allowance: {
                        id: 3,
                        title: "Bill Allowances Declarations",
                        filename: "employees-bill-allownace.csv"
                    },
                    hra: {
                        id: 4,
                        title: "HRA Declarations",
                        filename: "employees-hra.csv"
                    },
                    previousEmployer: {
                        id: 5,
                        title: "Prev Employer Details",
                        filename: "employees-prev-employer.csv"
                    },
                    loanAdvance: {
                        id: 6,
                        title: "Employee Loan Advance",
                        filename: "employee-loan-advance.csv"
                    }
                },
                hashMap: utilityService.buildEmployeeStatusHashMap(),
                content: new Array()
            }
        };
        this.renderDateFormat = function(timestamp) {
            timestamp = timestamp * 1000;
            var dd = new Date(timestamp).getDate(),
                mm = new Date(timestamp).getMonth() + 1,
                yy = new Date(timestamp).getFullYear();

            dd = dd <= 9 ? ('0' + dd) : dd;
            mm = mm <= 9 ? ('0' + mm) : mm;            
            return dd + '-' + mm + '-' + yy;
        };
        this.buildHeaderList = function(headers, headingText) {
            var list = [];
            angular.forEach(headers, function(value, key) {
                list.push(value.component_name);
                if(angular.isNumber(value.slug)) {
                    value.slug = 'tax' + value.slug;
                }
            });

            return list;
        };
        this.buildHeaderListExcludedNull = function(headers) {
            var list = [];
            angular.forEach(headers, function(value, key) {
                var append = value.component_name === '' ? null : value.component_name;
                list.push(append);
                if(angular.isNumber(value.slug)) {
                    value.slug = 'tax' + value.slug;
                }
            });

            return list;
        };
        
        this.buildCSVContent = function(headers, content, hashmap, headingText) {

            var objectList = [],
                object = {
                    content: new Array(this.buildHeaderList(headers))
                };        
                
            

            angular.forEach(content, function(value, key) {
                angular.forEach(value, function(v, k) {
                    if(!isNaN(k)) {
                        content[key]['tax' + k] = v;
                        delete content[key][k];
                    }
                });
            });


            angular.forEach(headers, function(value, key) {
                var slug = value.slug;
                angular.forEach(content, function(v, k) {
                    var keys = Object.keys(v),
                        index = keys.indexOf(slug);

                    if(angular.isUndefined(objectList[k])) {
                        objectList[k] = {};
                    }
                    objectList[k][slug] = (index < 0) ? null : v[slug];
                });
            });           

            angular.forEach(objectList, function(value, key) {
                var array = new Array();
                angular.forEach(value, function(v, k) {
                    if(k === 'emp_status') {
                        array.push(isNaN(v) ? v : hashmap[v]);
                    } else if ((k === 'emp_doj' || k === 'emp_doe') && v) {
                        if (angular.isNumber(v)) {
                            array.push(self.renderDateFormat(v));
                        } else {
                            array.push(v);
                        }
                    } else {
                        array.push(v);
                    }
                });            
                object.content.push(array);
            });

            if (utilityService.getValue(headingText, 'length') > 0) {
                var headingTextString = this.buildHeaderListExcludedNull(headingText);
                object.content.unshift(headingTextString);
            }
            

            return object;
        };
        this.buildMonthwiseObject = function () {
            return {
                taxComputation: {
                    isUploaded: false,
                    file: null
                },
                futureSalaryBreakup: {
                    isUploaded: false,
                    file: null
                }
            };
        };
        this.buildBulkObject = function () {
            return {
                taxDeclaration: {
                    isUploaded: false,
                    file: null
                },
                taxClaim: {
                    isUploaded: false,
                    file: null
                },
                hra: {
                    isUploaded: false,
                    file: null
                },
                taxRegime: {
                    isUploaded: false,
                    file: null
                },
                incomeTax: {
                    isUploaded: false,
                    file: null
                },
                fndf: {
                    isUploaded: false,
                    file: null
                },
                fndfCertificate: {
                    isUploaded: false,
                    file: null
                },
                annualSalaryBreakup: {
                    isUploaded: false,
                    file: null
                }
            };
        };
    }
]);