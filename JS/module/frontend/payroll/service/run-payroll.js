app.service('RunPayrollService', ['utilityService',
    function (utilityService) {
        'use strict';
        
        this.url = {
            toBeComputed : 'payroll/tobecomputed',
            payrollStatus : 'payroll/payroll-status-count',
            computePayroll : 'payroll/compute',
            computedSalary: 'payroll/computed-salary',
            Checks: 'payroll/checks',
            basic : 'payroll/basicinfo',
            computeCheck: 'payroll/checks-compute',
            checkCorrection : 'payroll/checks-correct',
            updateStatus : 'payroll/update-status',
            finalizedPayroll : 'payroll/finalized-salary',
            paidPayroll : 'payroll/paid-salary',
            externalComponets: 'payroll/external-component',
            allBreakupComponents: 'payroll/plan-components',
            planWiseExtComponet: 'payroll/external-components',
            exportSalaryReport: 'payroll/salary-report',
            exportSalaryReportText: 'payroll/salary-report-text',
            payrollBTSummaryReport: 'payroll/bank-transfer-summary',
            payrollSalaryHoldReport: 'payroll/salary-hold-report',
            bankTransferReport: 'payroll/bank-transfer-report',
            bankTransferMasterReport: 'payroll/bank-transfer-master-report',
            payRegisterReport: 'payroll/pay-register',
            varianceReport: 'payroll/variance-report',
            allEntityPermission: 'payroll/permissions',
            generateMonthlySalary: 'payroll/regenerate-monthly-salary',
            downloadOverideTaxTml: 'payroll/override-monthly-tax-template',
            uploadOverideTaxTml: 'payroll/override-monthly-tax',
            salaryFileFormat: 'payroll/frontier/salary-file-format',
            frontierBankTransferSummary: 'payroll/frontier/bank-transfer-summary',
            'Bank_transfer_Report_BANK': 'payroll/frontier/bank-transfer',
            'Bank_transfer_Report_NEFT':'payroll/frontier/neft-transfer',
            'Bank_transfer_Report_CHEQUE':'payroll/frontier/cheque-transfer',
            'Bank_transfer_Report_HOLD':'payroll/frontier/hold-transfer',
            modulePermission: 'employee/module-permission',
            Avasotech_bank_transfer_Report: 'payroll/avasotech/bank-transfer',
            primussoft_Salary_transfer_Report_Bank: 'payroll/primussoft/salary-transfer',
            saffron_global_services_bank_transfer_Report: 'payroll/saffron-global-services/salary-transfer',
            ud_bank_transfer_Report: 'payroll/ud/salary-transfer'

        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildPayrollPayload = function (model){
            return {
                month: model.month,
                year: model.year
            }; 
        };
        this.buildComputePayrollPayload = function (model){
            var paylaod = {
                ids: []
            };

            angular.forEach(model, function (v, k){
                var obj = {};
                obj.id = v._id;
                obj.status = angular.isDefined(v.isSelected) ? v.isSelected : false;
                if(v.mainStatus){
                    obj.status = v.mainStatus;
                }
                paylaod.ids.push(obj);
            });

            return paylaod;
        };        
        this.buildProfileStatus = function(){
            return utilityService.buildEmployeeStatusHashMap();
        };        
        this.buildPayrollChecksModel = function (model) {
            return {
                _id : utilityService.getValue(model, '_id'),
                auto_payroll_run : utilityService.getValue(model, 'auto_payroll_run',true),
                is_emp_salary_computed_zero : utilityService.getValue(model, 'is_emp_salary_computed_zero',true),
                is_emp_salary_less_than_zero : utilityService.getValue(model, 'is_emp_salary_less_than_zero',true),
                max_deduction_greater_than_grass_half : utilityService.getValue(model, 'max_deduction_greater_than_grass_half',false),
                fine_greater_than_some_of_salary : utilityService.getValue(model, 'fine_greater_than_some_of_salary',false),
                enable_increase_in_net_pay : utilityService.getValue(model, 'enable_increase_in_net_pay',false),
                enable_adhoc_payment : false,
                increase_in_net_pay : utilityService.getValue(model, 'increase_in_net_pay'),
                custom_checks : utilityService.getValue(model, 'custom_checks',[]),
            };
        };        
        this.BuildOperatorsHashMap = function() {
            return{
                1 : {
                    label: 'EQUAL_TO',
                    operator: "="
                },
                2 : {
                    label: 'GREATER_THAN',
                    operator: ">"
                },
                3 : {   
                    label : 'LESS_THAN',
                    operator: "<"
                },
                4 : {
                    label: 'GREATER_OR_EQUAL',
                    operator: ">="
                },
                5 : {
                    label: 'LESS_OR_EQUAL',
                    operator: "<="
                }    
            }
        };        
        this.buildDefinedChecksObj = function () {
            return [
                {
                    _id: 1,
                    name: "Salary of an employee computed as zero",
                    isComputing: false,
                    isComputed: false,
                    isError: false
                },
                {
                    _id: 2,
                    name: "Salary of an employee computed < zero",
                    isComputing: false,
                    isComputed: false,
                    isError: false
                },
                {
                    _id: 3,
                    name: "Maximum aggregate deduction < 50% of maximum gross",
                    isComputing: false,
                    isComputed: false,
                    isError: false
                },
                {
                    _id: 4,
                    name: "Total amount of fines in the payroll period > 3% of Payable salary",
                    isComputing: false,
                    isComputed: false,
                    isError: false
                },
                {
                    _id: 5,
                    name: "Increase in net pay vis-a-vis last payroll cycle >=",
                    isComputing: false,
                    isComputed: false,
                    isError: false
                }
            ];
        };        
        this.buildDefinedChecksPayLoad = function (idToBeComputed, definedList, customList) {
            var payload = {
                    ids: idToBeComputed
                },
                checks = [];

            angular.forEach(definedList, function (value) {
                value.isComputing = false;
                value.isComputed = false;
                value.isError = false;
                var obj = {};
                if (value.isSelected) {
                    value.isComputing = true;
                    obj.id = value._id;
                    obj.is_custom_check = false;
                    checks.push(obj);
                }
            });

            angular.forEach(customList, function (value) {
                value.isComputing = false;
                value.isComputed = false;
                value.isError = false;
                var obj = {};
                if (value.isSelected) {
                    value.isComputing = true;
                    obj.id = angular.isObject(value._id) ? value._id.$id : value._id;
                    obj.is_custom_check = true;
                    checks.push(obj);
                }
            });
            payload.checks = checks;

            return payload; 
        };        
        this.buildChecksIdsToBeCorrect = function (definedList, customList) {
            var checks = [];
            angular.forEach(definedList, function (value) {
                if (value.isSelected) {
                    checks.push(value._id);
                }
            });
            angular.forEach(customList, function (value) {
                if (value.isSelected) {
                    var id = angular.isObject(value._id) ? value._id.$id : value._id;
                    checks.push(id);
                }
            });

            return checks;
        };        
        var checkPayloadCallback = function (checksIdToBeCorrect) {
            var definedChecks = [1, 2, 3, 4, 5];
            var checks = [];
            for(var i = 0; i < checksIdToBeCorrect.length; i++) {
                var obj = {};
                obj.id = checksIdToBeCorrect[i];
                obj.is_custom_check  = definedChecks.indexOf(checksIdToBeCorrect[i]) != -1 ? false : true;
                checks.push(obj);
            }

            return checks;
        };        
        this.buildCorrectionListPayload = function (idToBeComputed, checksIdToBeCorrect) {
            var payload = {
                ids: idToBeComputed
            };
            payload.checks = checkPayloadCallback(checksIdToBeCorrect);

            return payload; 
        };        
        this.buildReCheckPayload = function (list, checksIdToBeCorrect) {
            var payload = {};
            var ids = [];
            angular.forEach(list, function (v){
                if(v.isSelected){
                    ids.push(v._id);
                }
            });
            payload.ids = ids;
            payload.checks = checkPayloadCallback(checksIdToBeCorrect);

            return payload; 
        };        
        this.buildStatusPayload = function (list, status) {
            var payload = {
                status: status,
                processed_ids: [],
                unprocessed_ids: []
            };
             
            angular.forEach(list, function (value) {
                var id = angular.isObject(value._id) ? value._id.$id : value._id;
                if (status == 4 && !value.status_with_held && !value.status_finalized) {
                    value.isSelected ? payload.processed_ids.push(id) : payload.unprocessed_ids.push(id);
                }
                if(status == 6 && !value.status_paid){
                  value.isSelected ? payload.processed_ids.push(id) : payload.unprocessed_ids.push(id);  
                }
            });

            return payload;
        };        
        this.buildHoldStatusPayload = function (list, status, isHold, isAll) {
            var payload = {
                status: status,
                processed_ids: []
            };
            if(isHold){
                payload.with_held_till = isAll.holdTill;
                payload.comment = isAll.holdComment;
            }
            angular.forEach(list, function (value) {
                var id = angular.isObject(value._id) ? value._id.$id : value._id;
                if(value.isSelected && isHold && !value.status_with_held){
                   payload.processed_ids.push(id); 
                }
                if(value.isSelected && !isHold && value.status_with_held){
                    payload.processed_ids.push(id);
                }
            });
            
            return payload;
        }; 
        this.buildTakeActionModel = function (model) {
            return {
                rowId : utilityService.getValue(model, '_id'),
                salaryBreakup : utilityService.getValue(model, 'salary_breakup', []),
                employeeName : utilityService.getValue(model, 'employee_name'),
                error: utilityService.getValue(model, 'error', [])
            }; 
        };
        this.buildExternalComponentPayload = function (model, initialValue) {
            var payload = [];
            angular.forEach(model.data, function (value, key) {
                var object = {};
                object.id = value._id;
                object.components = [];
                angular.forEach(model.external_component, function (val) {
                    angular.forEach(initialValue, function (v) {
                        if ((v._id == value._id) && angular.isDefined(value[val.slug]) && (value[val.slug] !=  v[val.slug])){
                            var obj = {
                                slug: val.slug,
                                value: value[val.slug],
                                component_type: val.component_type
                            };
                            object.components.push(obj);
                        }
                    });
                });
                if (object.components.length) {
                    payload.push(object);
                }
            });
            return payload;
        };        
        this.buildComputedColumn = function (heads, groups, envMnt) {
            var column = {
                'Employee Detail': 'full_name',
                'Employee Id': 'employee_code',
                'Employee Status': 'employee_status',
                'Date of Joining': 'joining_date',
                'Last Working Date': 'last_working_date',
                'Account Number': 'accountNo',
                'Bank Name': 'bankName',
                'IFSC Code': 'ifsc',
                'PAN Card No': 'pan'
            };
            
            angular.forEach(groups, function (v, k){
                column[v.name] = v.slug;
            });

            angular.forEach(heads, function (v, k){
                if ((envMnt === 'gsl' && v.slug === 'variable_compensation')
                    || (envMnt === 'zaggle' && (v.slug === 'fuel' || v.slug === 'meal_allowance'))) {
                } else {
                    column[v.component_name] = v.slug;
                }                
            });

            return column;
        };
        this.buildComputedObject = function () {
            return {
                status: '',
                list: [
                    {
                        id: '',
                        title: 'All'
                    },
                    {
                        id: 1,
                        title: 'Pending'
                    },
                    {
                        id: 2,
                        title: 'On Hold'
                    },                
                    {
                        id: 3,
                        title: 'Finalized'
                    }
                ],
                fileNameMapping: {
                    1: 'pending_computed_list',
                    2: 'onhold_computed_list',
                    3: 'finalized_computed_list'
                },
                filteredList: [],
                visible: false,
                heads: []
            };
        };
        this.addMandatoryGroupsToColumnHeaders = function (columnHeaders, groups) {
            angular.forEach(groups, function (value, key) {
                columnHeaders[value.name] = value.slug;
            });

            return columnHeaders;
        };                
    }
]);
