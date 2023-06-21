app.service('PayrollAdminPerquisiteService', [
    '$timeout', 'utilityService', 'FORM_BUILDER',
    function ($timeout, utilityService, FORM_BUILDER) {
        'use strict';

        var self = this;
    	this.url = {
            allComponents: 'payroll/components-by-type',
            perquisiteYearly: 'payroll/all-employee/perquisite',
            perquisiteForm: 'payroll/perquisite-form-detail',
            downloadAnswerAttachment: 'payroll/download/perquisite-form-attachment',
            activateEmpPerquisite: 'payroll/activate-employee-perquisite',
            stopEmpPerquisite: 'payroll/stop-employee-perquisite',
            monthlySampleTemplate: 'payroll/download-perquisite-csv',
            uploadMonthlyTemplate: 'payroll/upload-perquisite-csv',
            perquisiteMonthly: 'payroll/perquisite-monthly-detail',
            csvDownloadMonthly: 'payroll/perquisite-monthly-detail-csv-export',
            perquisiteFormsListHistory: 'payroll/perquisite-form-dropdown',
            perquisiteFormHistory: 'payroll/perquisite-form-history-detail',
            downloadAnswerAttachmentHistory: 'payroll/download/perquisite-history-form-attachment',
            perquisiteMonthlyBankReport: 'payroll/reports/perquisite'
		};
		this.getUrl = function(apiUrl) {
			return getAPIPath() + this.url[apiUrl];
		};

        this.buildSummaryObject = function() {
            return {
                year: {
                    list: this.getYearList(),
                    current: utilityService.getCurrentYear(),
                    start: utilityService.startYear,
                    selected: utilityService.getCurrentYear()
                },
                selectedComponent: null,
                searchText: '',
                sort: {
                    key: null,
                    reverse: true
                },
                breakups: {
                    list: [],
                    filteredList: [],
                    visible: false
                },
                action: self.buildActionInSummaryObject()
            };
        };

        this.buildActionInSummaryObject = function() {
            return {
                selectedBreakupItem: null,
                actionType: null,
                form: null,
                visible: false,
                formMode: null //'fill', 'edit', 'view'
            };
        };

        this.buildMonthlyDetailsObject = function() {
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
                selectedComponent: null,
                bulkUpload: null,
                searchText: '',
                sort: {
                    key: 'employee_name',
                    reverse: false
                },
                breakups: {
                    list: [],
                    filteredList: [],
                    visible: false
                }
            };
        };

        this.buildSortableDate = function(date) {
            var newDate = new Date(date);
            return isNaN(newDate.getDate()) ? null : newDate.getTime();
        };

        this.buildSummaryList = function(list) {
            if(!list || !list.length) { return []; }
            angular.forEach(list, function(val, key) {
                val.start_date_sort = self.buildSortableDate(val.start_date);
                val.end_date_sort = self.buildSortableDate(val.end_date);
            });
            return list;
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

        this.getStatus = function(item) {
            var status = '';
            if(item.status == 1) {
                status = 'Pending';
            }
            if(item.status == 2) {
                status = 'Activated';
            }
            if(item.status == 3) {
                status = 'Stopped';
            }
            return status;
        };

        this.buildSummaryListExport = function(list) {
            var table = [],
                headers = ['S. No', 'Employee Name', 'Employee Code', 'Amount', 'Start Date', 'End Date', 'Status'];
            table.push(headers);
            if(!list || !list.length) { return table; }
            angular.forEach(list, function(val, key) {
                var row = [];
                row.push(key+1);
                row.push(utilityService.getValue(val, 'emp_name', ''));
                row.push(utilityService.getValue(val, 'emp_code', ''));
                row.push(utilityService.getValue(val, 'amount', ''));
                row.push(utilityService.getValue(val, 'start_date', ''));
                row.push(utilityService.getValue(val, 'end_date', ''));
                row.push(self.getStatus(val));
                table.push(row);
            });
            return table;
        };

        this.buildMonthlyListExport = function(list) {
            var table = [],
            headers = ['S. No', 'Employee Name', 'Employee Code', 'Component', 'Monthly Amount', 'Amount Paid', 'Amount Pending'];
            table.push(headers);
            if(!list || !list.length) { return table; }
            angular.forEach(list, function(val, key) {
                var row = [];
                row.push(key+1);
                row.push(utilityService.getValue(val, 'employee_name', ''));
                row.push(utilityService.getValue(val, 'employee_code', ''));
                row.push(utilityService.getValue(val, 'component_name', ''));
                row.push(utilityService.getValue(val, 'monthly_amount', ''));
                row.push(utilityService.getValue(val, 'amount_paid', ''));
                row.push(utilityService.getValue(val, 'total_pending_amount', ''));
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
		this.buildFormObject = function(model) {
			return {
				_id: utilityService.getValue(model, '_id'),
				name: utilityService.getValue(model, 'name'),
				description: utilityService.getValue(model, 'description'),
				questions: this.buildQuestionList(utilityService.getValue(model, 'questions', []))
			};
		};
        this.convertTimeToStringFormat = function(time) {
            if(!time) { return time; }
            if(!angular.isDate(time)){
                time = new Date(time);
            }
            if(angular.isDefined(time.getHours()) && angular.isDefined(time.getMinutes())){
                return time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
            }
        };
        this.addQuestionsInPayload = function(payload, questionList) {
            if(!angular.isArray(questionList) || utilityService.getValue(questionList,'length') === 0) {
                return payload;
            }
			angular.forEach(questionList, function (value, key) {
                if(value.question_type == FORM_BUILDER.questionType.date && value.answer) {
                    payload["question_" + value._id] = utilityService.dateFormatConvertion(value.answer);
                } else if(value.question_type == FORM_BUILDER.questionType.time && value.answer) {
                    payload["question_" + value._id] = self.convertTimeToStringFormat(value.answer);
                } else if (value.question_type == FORM_BUILDER.questionType.attachment && angular.isObject(value.answer)) {
                    payload["question_" + value._id] = value.answer;
                } else if(value.question_type == FORM_BUILDER.questionType.singleCheckbox) {
                    payload["question_" + value._id] = value.answer;
                } else {
                    if (value.isMandatory || value.answer) {
                        payload["question_" + value._id] = (value.question_type === FORM_BUILDER.questionType.rating)
                            ? Number(value.answer) : value.answer;
                    }
                }
                if(!utilityService.getValue(payload, 'template_id')) {
                    payload.template_id = value.form_id;
                }
			});
            return payload;
        };
        this.buildPerquisiteCarHireReport = function(list, report_type) {
            var table = [],
            headers = ['S. No', 'Emp Code', 'Emp Name', 'Name of Party', 'DOJ', 'Car Hire w.e.f.', 'Legal Entity', 'Department', 'Paid Days'];
            if(report_type == 'bank') {
                headers.push('Bank Name');
                headers.push('Account No');
            }
            if(report_type == 'neft') {
                headers.push('Bank Name');
                headers.push('IFSC');
                headers.push('Account No');
            }
            if(report_type == 'cheque') {
                headers.push('Payment Method');
            }
            headers.push('Monthly Entitlement');
            headers.push('Claim Amount');
            headers.push('Paid');
            headers.push('Remarks');
            table.push(headers);
            if(!list || !list.length) { return table; }
            angular.forEach(list, function(val, key) {
                var row = [];
                row.push(key+1);
                row.push(utilityService.getValue(val, 'employee_code', ''));
                row.push(utilityService.getValue(val, 'employee_name', ''));
                row.push(utilityService.getValue(val, 'party_name', ''));
                row.push(utilityService.getValue(val, 'joining_date', ''));
                row.push(utilityService.getValue(val, 'start_date', ''));
                row.push(utilityService.getValue(val, 'leagl_entity', ''));
                row.push(utilityService.getValue(val, 'department', ''));
                row.push(utilityService.getValue(val, 'paid_days', ''));
                if(report_type == 'bank') {
                    row.push(utilityService.getValue(val, 'bank_name', ''));
                    row.push(utilityService.getValue(val, 'account_number', ''));
                }
                if(report_type == 'neft') {
                    row.push(utilityService.getValue(val, 'bank_name', ''));
                    row.push(utilityService.getValue(val, 'ifsc', ''));
                    row.push(utilityService.getValue(val, 'account_number', ''));
                }
                if(report_type == 'cheque') {
                    row.push(utilityService.getValue(val, 'payment_method', ''));
                }
                row.push(utilityService.getValue(val, 'monthly_amount', ''));
                row.push(utilityService.getValue(val, 'claim_amount', ''));
                row.push(utilityService.getValue(val, 'amount_paid', ''));
                row.push(utilityService.getValue(val, 'remarks', ''));
                table.push(row);
            });
            return table;
        };
    }
]);