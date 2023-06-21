app.service('EmployeeTaskService', [
    '$timeout','ServerUtilityService', 'utilityService', 'FORM_BUILDER',
    function ($timeout,ServerUtilityService, utilityService, FORM_BUILDER) {
        'use strict';

        var self = this;
        this.url = {
            claimList: 'payroll/employee-claims',
            attendanceList: 'payroll/attendance-data',
            approveRejectAtt: 'timeattendance/admin/action',
            approveRejectLeave: 'admin-frontend/leave/approve-reject ',
            bankDetails: 'payroll/employee/bank-details',
            investmentDeclaration: 'payroll/declaration-data',
            investmentProof: 'payroll/investment-proof-data',
            claimtax: 'employee/tax/claim',
            taxMaster: 'manage_tax',
            previousEmployerList: 'payroll/previous-employer-list',
            previousEmployer: 'payroll/prev-employer/detail', //'employee/prev-employer/detail',
            approveAmount: 'payroll/approve-investment',
            deadlineWindow: 'payroll/unlock-window',
            salarySlip:'payroll/all-employees-list',
            salarySlipViewDownload:'payroll/slips',
            incomeTaxGuildline:'payroll/investment-guideline',
            approvedAmount:'payroll/investment-approved-data',
            investmentDeclarationForm:'payroll/employees-list',
            investmentDeclarationFormDownload:'payroll/download-investment-form',
            taxSlipViewDownload: 'payroll/tax/computation',
            flexiPayRequests: 'payroll/admin/flexi-requests',
            flexiPayRequestApproveReject: 'payroll/admin/flexi-request/approve-reject',
            payrollFlexiPayForms: 'payroll/employee/get-all-flexi-form',
            downloadAnswerAttachment: 'payroll/download/flexi-form-attachment',
            claimProof: 'payroll/claim-proof',
            expenses: 'employee/claims-category',
            eligibility: 'payroll/claim/details',
            approveReject: 'payroll/approve-reject-claims',
            updateClaimAmount: 'payroll/claim-amount',
            reimbursementSummary: 'payroll/claim/reimbursement-summary',
            reimbursementBt: 'payroll/claim/reimbursement-bank-transfer',
            reimbursementMonthly: 'payroll/claim/reimbursement-report',
            reimbursementMonthly2: 'payroll/claim/reimbursement-report-2',
            // relievedEmployees: 'payroll/relieved-employees',
            fnfEmployeesForPayroll: 'payroll/fnf-employees-for-payroll',
            approveRejectRequest: 'payroll/investment-claim-action',
            investmentProofMultipleHead: 'payroll/investment-proof-count',
            taxRegimeReport : 'payroll/tax-regime-data',
            getNiyoCouponEmp: 'payroll/emp-niyo-coupon',
            adminClaimtax: 'payroll/tax/claim',
            getTaxRegime: 'payroll/tax-calculator',
            downloadSalaryCertificate: 'payroll/download/template/salary_certificate',
            revertToPending: 'payroll/revert-to-pending',
            // nonHraRevertPending: 'payroll/non-hra-status',
            // hraRevertPending: 'payroll/hra-status'
            downloadBulkAttachments: 'payroll/investment-attachments/download',
            modulePermission:'employee/module-permission'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };        
        this.declarationObj = function (){
            return {
                1: "Pending",
                2: "Declared"
            };
        };        
        this.buildReminderPayload = function (type, slaveId, section, isMultiple, list, item){
            var payload ={
                master_emp_id: utilityService.getStorageValue('loginEmpId'),
                type: type
            };
            if (isMultiple) {
                var arr = [];
                angular.forEach(list, function (value, key) {
                    if (value.isSelected) {
                        arr.push(value.employee_preview._id);
                    }
                });
                 payload.slave_emp_id = arr;
            } else {
                payload.slave_emp_id = slaveId;
            }
            if(section == 'proofAllowence'){
                payload.reference_id = item.allowance_id;
            }
            return payload;
        };
        this.buildDeadLineWindowPayload = function(model) {
            var hashMap = {
                declaration: 'investment_declaration',
                proof: 'investment_proof_submission'
            }
            return {
                emp_ids: model.empIds,
                start_date: utilityService.dateFormatConvertion(model.openDate, true),
                end_date: utilityService.dateFormatConvertion(model.closeDate, true),
                module: 'payroll',
                sub_module: hashMap[model.title]
            }
        };
        this.buildOtherSectionStatusObject = function(){
            return {
                other_section_status: {
                    status: 1,
                    amount: null,
                    reason: null                    
                }
            }
        };        
        this.buildFlexiPayRequestObj = function() {
            return {
                requests: {
                    list: [],
                    dynamic_head: null,
                    filteredList: [],
                    visible: false
                },
                filters: {
                    searchText: ''
                }
            };
        };
        this.getStatus = function(status) {
            var status_map = {
                1: 'Pending',
                3: 'Auto Approved',
                8: 'Approved by Admin',
                9: 'Rejected by Admin',
                10: 'Approved',
                11: 'Rejected'
            };
            return utilityService.getValue(status_map, status, 'Pending');
        };
        this.buildFlexiPayRequestsExportData = function(model, dynamic_head) {
            var table = [],
                headers = ['S. No', 'Emp Name', 'Emp Code'];
            
            angular.forEach(dynamic_head, function(v, k) {
                headers.push(v);
            });
            headers.push('Request Date');
            headers.push('Action Taken On');
            headers.push('Status');
            table.push(headers);

            angular.forEach(model, function(val, key) {
                var row = [];

                row.push(key+1);
                row.push(utilityService.getInnerValue(val, 'employee_preview', 'full_name', ''));
                row.push(utilityService.getInnerValue(val, 'employee_preview', 'personal_profile_employee_code', ''));
                angular.forEach(dynamic_head, function(v, k) {
                    row.push(utilityService.getInnerValue(val,'component_data', k, ''));
                });
                row.push(utilityService.getValue(val, 'requested_on', ''));
                row.push(utilityService.getValue(val, 'action_taken_on', ''));
                row.push(self.getStatus(val.status));

                table.push(row);
            });
            return table;
        };
        this.buildQuestionList = function(questionList, reset) {
            if(!questionList || !questionList.length) {
                return questionList;
            }
            angular.forEach(questionList, function (value, key) {
                if(reset) {
                    value.answer = '';
                } else {
                    if(value.question_type == FORM_BUILDER.questionType.date) {
                        value.answer = angular.isDate(value.answer)
                            ? value.answer
                            : (angular.isString(value.answer) && value.answer.length)
                                ? utilityService.getDefaultDate(value.answer)
                                : null;
                    } else if(value.question_type == FORM_BUILDER.questionType.time) {
                        value.answer = angular.isDate(value.answer)
                            ? value.answer
                            : (angular.isString(value.answer) && value.answer.length)
                                ? utilityService.getDefaultDate('01/01/1970 ' + value.answer)
                                : null;
                    }
                }
            });
            return questionList;
        };

        this.buildCsvData = function(list, approvalStatus) {
			var csv = {
                content: new Array(["Employee Name", "Employee ID", "Category Name", "Bill No.", 
                    "Bill Amount", "Claim Amount", "Approved Amount", "Requsted On", 
                    "Period", "Details", "Approval Status"])
			};

			angular.forEach(list, function(value, key) {
				var array = new Array(),
                    statusText = approvalStatus[utilityService.getValue(value, 'status', 1)];
                
                if (utilityService.getValue(value, 'status') == 8) {
                    statusText = statusText + ' (Approved by Admin)';
                } else if (utilityService.getValue(value, 'status') == 9) {
                    statusText = statusText + ' (Rejected by Admin)';
                }

                array.push(utilityService.getInnerValue(value, 'employee_preview', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'employee_preview', 'emp_code'));
				array.push(utilityService.getValue(value, 'expense_category_name'));
                array.push(utilityService.getValue(value, 'bill_no'));
                array.push(utilityService.getValue(value, 'bill_amount'));
                array.push(utilityService.getValue(value, 'claim_amount'));                
                array.push(utilityService.getValue(value, 'approved_amount'));
				array.push(utilityService.getValue(value, 'claim_date'));
				array.push(utilityService.getValue(value, 'bill_date'));
				array.push(utilityService.getValue(value, 'bill_detail'));
				array.push(statusText);

				csv.content.push(array);
			});

			return csv;
        };
        this.buildApproveRejectPayload = function(model) {
	    	var payload = {
                request_ids: [],
                status: utilityService.getValue(model, 'status'),
                comment: utilityService.getInnerValue(model, 'comment', 'text')
            };

	    	angular.forEach(model.selectedEmployees, function(value, key) {
	    		payload.request_ids.push(utilityService.getValue(value, '_id'));
            });
            
	    	return payload;
        };
        this.buildUpdateClaimAmountPayload = function(model) {
            return {
                claim_amount: model.claim_amount,
                approved_amount: model.new_claim_amount,
                comment: model.claim_update_reason
            };
        };          

        this.getYearList = function() {
        	var d = new Date(),
        		year = d.getFullYear(),
        		list = [];
        	for(var i=0; i<= year - utilityService.startYear; i++) {
        		list.push(year - i);
        	}
        	return list;
        };
        this.initialReimbursementBuild = function() {
            return {
                month: {
                    list: ["Jan", "Feb", "Mar", "April", "May", "June", 
                        "July", "Aug", "Sep", "Oct", "Nov","Dec"],
                    current: utilityService.getCurrentMonth(),
                    start: 4,
                    selected: utilityService.getCurrentMonth()
                },
                year: {
                    list: this.getYearList(),
                    current: utilityService.getCurrentYear(),
                    start: utilityService.startYear,
                    selected: utilityService.getCurrentYear()
                },
                searchText: '',
                sort: {
                    key: 'employee_name',
                    reverse: false
                }
            };
        };
        this.buildReimbursementSummaryObj = function(initialBuild) {
            initialBuild = initialBuild || {};
            initialBuild.list = [];
            initialBuild.dynamic_head = null;
            initialBuild.filteredList = [];
            initialBuild.visible = false;
            initialBuild.total_amount = 0;
            return initialBuild;
        };
        this.buildReimbursementSummaryList = function(list) {
            var obj = {
                list: [],
                total_amount: 0
            };
            obj.list = list.filter(function(value, key) {
                var emp_prev = utilityService.getValue(value, 'employee_preview');
                if(emp_prev) {
                    value.location = utilityService.getInnerValue(emp_prev.location_detail, '0', 'name');
                    value.department = utilityService.getInnerValue(emp_prev.department_detail, '0', 'name');
                    value.designation = utilityService.getInnerValue(emp_prev.designation_detail, '0', 'name');
                    if(utilityService.getValue(emp_prev.location_detail, 'length') > 1) {
                        angular.forEach(emp_prev.location_detail, function(val, k) {
                            if(k>0) {
                                value.location += ',' + val.name;
                            }
                        });
                    }
                    if(utilityService.getValue(emp_prev.department_detail, 'length') > 1) {
                        angular.forEach(emp_prev.department_detail, function(val, k) {
                            if(k>0) {
                                value.department += ',' + val.name;
                            }
                        });
                    }
                    if(utilityService.getValue(emp_prev.designation_detail, 'length') > 1) {
                        angular.forEach(emp_prev.designation_detail, function(val, k) {
                            if(k>0) {
                                value.designation += ',' + val.name;
                            }
                        });
                    }
                    return true;
                } else {
                    obj.total_amount = value.total;
                    return false;
                }
            });
            return obj;
        };
        this.buildReimbursementBTObj = function(initialBuild) {
            initialBuild = initialBuild || {};
            initialBuild.list = [];
            initialBuild.dynamic_head = null;
            initialBuild.filteredList = [];
            initialBuild.total_amount = 0;
            initialBuild.visible = false;
            return initialBuild;
        };
        this.buildReimbursementBTList = function(list) {
            var obj = {
                list: [],
                total_amount: 0
            };
            obj.list = list.filter(function(value, key) {
                if(value.employee_preview) {
                    return true;
                } else {
                    obj.total_amount = value.total;
                    return false;
                }
            });
            return obj;
        };

        this.buildReimbursementSummaryReport = function(model, dynamic_head, total_amount) {
            var table = [],
            headers = ['S. No', 'Emp Name', 'Emp Code'];

            if(dynamic_head.legal_entity) {
                headers.push(dynamic_head.legal_entity);
            }
            headers.push('Department');
            headers.push('Designation');
            headers.push('Location');
            
            angular.forEach(dynamic_head, function(v, k) {
                if(k != 'legal_entity') {
                    headers.push(v);
                }
            });
            table.push(headers);

            angular.forEach(model, function(val, key) {
                var row = [];

                row.push(key+1);
                row.push(utilityService.getInnerValue(val, 'employee_preview', 'full_name', ''));
                row.push(utilityService.getInnerValue(val, 'employee_preview', 'personal_profile_employee_code', ''));
                if(dynamic_head.legal_entity) {
                    row.push(utilityService.getValue(val, 'legal_entity', ''));
                }
                row.push(utilityService.getValue(val, 'department', ''));
                row.push(utilityService.getValue(val, 'designation', ''));
                row.push(utilityService.getValue(val, 'location', ''));
                angular.forEach(dynamic_head, function(v, k) {
                    if(k != 'legal_entity') {
                        row.push(utilityService.getValue(val, k, ''));
                    }
                });

                table.push(row);
            });

            if(total_amount) {
                var row = ['', '', '', '', '', ''];
                angular.forEach(dynamic_head, function(v, k) {
                    if(k == 'total') {
                        row.push(total_amount);
                    } else {
                        row.push('');
                    }
                });
                table.push(row);
            }
            return table;
        };
        this.buildReimbursementBTReport = function(model, dynamic_head, total_amount) {
            var table = [],
            headers = ['S. No', 'Emp Name', 'Emp Code'];

            if(dynamic_head.legal_entity) {
                headers.push(dynamic_head.legal_entity);
            }
            
            angular.forEach(dynamic_head, function(v, k) {
                if(k != 'legal_entity') {
                    headers.push(v);
                }
            });
            table.push(headers);

            angular.forEach(model, function(val, key) {
                var row = [];

                row.push(key+1);
                row.push(utilityService.getInnerValue(val, 'employee_preview', 'full_name', ''));
                row.push(utilityService.getInnerValue(val, 'employee_preview', 'personal_profile_employee_code', ''));
                if(dynamic_head.legal_entity) {
                    row.push(utilityService.getValue(val, 'legal_entity', ''));
                }
                angular.forEach(dynamic_head, function(v, k) {
                    if(k != 'legal_entity') {
                        row.push(utilityService.getValue(val, k, ''));
                    }
                });

                table.push(row);
            });

            if(total_amount) {
                var row = ['', '', ''];
                angular.forEach(dynamic_head, function(v, k) {
                    if(k == 'total') {
                        row.push(total_amount);
                    } else {
                        row.push('');
                    }
                });
                table.push(row);
            }
            return table;
        };
        this.buildReimbursementMonthlyReport = function(model, topHeader) {
            if(!model) { return []; }
            var table = [];
            if(topHeader) {
                table.push(['', topHeader]);
            }
            var head1 = [], head2 = [];
            angular.forEach(model.heads2, function(val, key) {
                head1.push(utilityService.getValue(model.heads1, key, ''));
                head2.push(val || '');
            });
            table.push(head1, head2);
            angular.forEach(model.rows, function(val, key) {
                var row = [];
                angular.forEach(model.heads2, function(v, k) {
                    row.push(utilityService.getValue(val, k, ''));
                });
                table.push(row);
            });
            return table;
        };
        this.buildTemplateObject = function() {
            return {
                list: {
                    investment: {
                        id: 7,
                        title: "Investment Declarations",
                        filename: "employees-investment-declarations",
                        extension: ".csv"
                    },
                    hra: {
                        id: 4,
                        title: "HRA Declarations",
                        filename: "employees-hra-declarations",
                        extension: ".csv"
                    }
                },
                hashMap: utilityService.buildEmployeeStatusHashMap(),
                content: new Array()
            }
        };        
        this.buildPreviousEmployerCSVData = function(list) {
        
            var arr = new Array(["Employee Details", "Employee Code", "Status"]), 
                object = {
                    list: list,
                    content: arr
                };

            angular.forEach(object.list, function(value, key) {                
                var array = new Array();

                array.push(utilityService.getValue(value, 'full_name'));
                array.push(utilityService.getValue(value, 'employee_id'));
                array.push(utilityService.getValue(value, 'status', 1) == 2 ? 'Provided' : 'Pending');
                
                object.content.push(array);
            });

            return object;
        };
        this.buildApproveRejectRequestPayload = function (model, object) {
            var payload = {
                action: parseInt(utilityService.getValue(model, 'action'), 10),
                reason: utilityService.getValue(model, 'reason')
            };

            if (utilityService.getValue(model, 'action') == 1) {
                payload.amount_approved = utilityService.getValue(model, 'amount');
            }

            return payload;
        };  
        
        this.buildTaxRegimeCSV = function (list) {
            var arr = new Array(['Employee Name', 'Employee Code', 'Tax Regime Name']), 
            object = {
                list: list,
                content: arr
            };

            angular.forEach(object.list, function(value, key) { 
                var array = new Array();
                array.push(utilityService.getInnerValue(value, 'emp_preview', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'emp_preview', 'personal_profile_employee_code'));

                if(angular.isDefined(value.type) && (value.type === 1 || value.type === 2)){
                   array.push(utilityService.getValue(value, 'type', 1) == 2 ? 'New Tax Regime' : 'Previous Tax Regime');
                } else {
                    array.push('Not Selected')
                }
                
                object.content.push(array);
            });

            return object;
        }

        this.buildOveralNiyolObject = function() {
            return {
                niyoCouponComponent: {
                    heads: {},
                    rows: []
                },
                filteredList: [],
                propertyName: 'employee.full_name',                                                
                reverse: false,
                visible: false,
                search: {
                    selected: 1,
                    list: [
                        {
                            id: 1,
                            title: 'Reviewee'
                        },
                        {
                            id: 2,
                            title: 'Reviewer'
                        }
                    ]
                },
                error: {
                    status: false,
                    message: null
                }
            }
        };

        this.buildAllFilterObject = function () {
            return [
                {
                    countObject: 'groupTemp', 
                    isGroup: true, 
                    collection_key: 'employee'
                }
            ];
        };

        this.buildExportListHeader = function(overall) {
			// Build header columns with some static values
			var columnHeaders = new Array('Employee Details', 'Employee ID');

			// Build header columns with some dynamic values
            angular.forEach(overall.niyoCouponComponent.heads.niyo_coupon, function (value, key) {
                columnHeaders.push(value);
            });
            
            return new Array(columnHeaders);
		};
		this.buildExportData = function (overall) {
			var csvContent = this.buildExportListHeader(overall);

            angular.forEach(overall.filteredList, function(value, key) {
                var array = new Array();
                
                array.push(utilityService.getInnerValue(value, 'employee', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'employee', 'personal_profile_employee_code'));
                
                angular.forEach(overall.niyoCouponComponent.heads.niyo_coupon, function(v, k) {                	
                	array.push(utilityService.getValue(value, k, '') ? utilityService.getValue(value, k, '') : '');
                });                
                
                csvContent.push(array);
            });

            return csvContent;
		};

    }
]);