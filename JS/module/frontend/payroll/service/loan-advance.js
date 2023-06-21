app.service('LoanAdvanceService', [
	'$timeout', 'utilityService',        
	function ($timeout, utilityService) {
		'use strict';
		var self = this;

        this.url = {
        	getLoanRequests: 'loan-advance/details',
            getLoanType: 'loan-advance/loan-categories',
            approveLoanRequest: 'loan-advance/request',
            employeeDetail: 'loan-advance/employee-details',
            requestDetails: 'loan-advance/request-details',
            updateStatus: 'loan-advance/status',
            updateEmi: 'loan-advance/update_emi',
            deleteRequest:'loan-advance/request-delete',
    	   	ctc: 'employee-salary/ctc-component', 
    	   	tax: 'employee-salary/tax-saving',
    	   	account: 'employee-salary/account-details',
    	   	forms2015: 'data/compensation/forms-2015.json',
    	   	forms2016: 'data/compensation/forms-2016.json',
    	   	forms2017: 'data/compensation/forms-2017.json',
            getLoanSummary: 'loan-advance/summary',
            empMonthlyGross: 'loan-advance/monthly-gross',
            payoutDate: 'loan-advance/payout-date',
            reminder: 'prejoin/frontend/send-reminder',
            downloadLoanAdvances: 'admin-loan-advance/download-advance-template',
            uploadLoanAdvances: 'admin-loan-advance/upload-advance-template',
            deleteUploadedRequest: 'admin-loan-advance/delete-advance',
            checkAdvanceUploadPermission : 'admin-loan-advance/check-advance-upload-permission',
            allUser: 'payroll/all-user',
            updateEMIDetails: 'admin-loan-advance/update-emi-details',
            approverChain: 'loan-advance/approver-detail',
            empMonthlyEmiReport: 'admin-loan-advance/emp-monthly-emi'
        };        
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.loanDetailsModel = function(model) {
            return {
                _id: utilityService.getValue(model, '_id'),
                name: utilityService.getValue(model, 'name'),
                loan_type: utilityService.getValue(model, 'loan_type', 1),
                request_type: utilityService.getValue(model, 'request_type', 2),
                disbursed_type: utilityService.getValue(model, 'repayment_period', 1),
                disbursed_date: utilityService.getValue(model, 'disbursed_date'),
                reason: utilityService.getValue(model, 'description'),
                payroll_cycle: utilityService.getValue(model, 'payout_cycle'),
                max_limit: utilityService.getValue(model, 'max_limit'),
                amount: utilityService.getValue(model, 'amount'),
                interest: utilityService.getValue(model, 'interest'),
                period: utilityService.getValue(model, 'period'),
                employee_id: utilityService.getValue(model, 'employee_id')
            };  
        };
        this.getApproverId = function (approver) {
            var arr = [];
            
            angular.forEach(approver.all_approver_preview,function (val,key) {
                arr.push(val._id);
            });

            return arr;
        };
        this.buildReminderPayload = function (materId, approver) {
            return  {
                master_emp_id: materId,
                slave_emp_id: this.getApproverId(approver),
                type: 23
            };
        };
        this.summaryObj = function (type) {
            return {
                _id: type,
                type: type == 1 ? "Loan" :  "Advance",
                disbursedAmt: 0,
                paidPrincipalAmt: 0,
                pendingPrincipalAmt: 0,
                totalInterest:  type == 1 ? 0 : "N/A",
                paidInterest:  type == 1 ? 0 : "N/A",
                pendingInterest: type == 1 ? 0 : "N/A"
            };
        };
        this.loanAdvanceSummaryCallback = function (data) {
            var list = [];

            angular.forEach(data, function (v) {
                var obj = {};
                if (v._id == 1) {
                    obj._id = 1;
                    obj.type = "Loan";
                    obj.disbursedAmt = v.total_loan_disbursed_amt;
                    obj.paidPrincipalAmt = v.total_loan_repaid_amt;
                    obj.pendingPrincipalAmt = (v.total_loan_disbursed_amt - v.total_loan_repaid_amt);
                    obj.totalInterest = v.total_interest;
                    obj.paidInterest = v.total_loan_interest_amt;
                    obj.pendingInterest = (v.total_interest - v.total_loan_interest_amt);
                }
                if (v._id == 2) {
                    obj._id = 2;
                    obj.type = "Advance";
                    obj.disbursedAmt = v.total_advance_disbursed_amt;
                    obj.paidPrincipalAmt = v.total_advance_repaid_amt;
                    obj.pendingPrincipalAmt = (v.total_advance_disbursed_amt - v.total_advance_repaid_amt);
                    obj.totalInterest = "N/A";
                    obj.paidInterest = "N/A";
                    obj.pendingInterest = "N/A";
                }
                list.push(obj);
            });

            if (!list.length) {
                list.push(this.summaryObj(1))
                list.push(this.summaryObj(2))
            }
            
            return list;
        };
        this.buildLoanSummaryObject = function () {
            return {
                tillDate: true,
                fromDate: null,
                toDate: null,
                list: [],
                from: null,
                to: null,
            };
        };
        this.buildBulkObject = function () {
            return {
                loanAdvances: {
                    isUploaded: false,
                    file: null
                }
            };
        };
        this.buildRepaymentStatusMapping = function () {
            return {
                1: {
                    title: 'Not Repaid',
                    class: 'red'
                },
                2: {
                    title: 'In Progress',
                    class: 'orange'
                },
                3: {
                    title: 'Paid',
                    class: 'green'
                }
            };
        };
        this.buildStatusMapping = function () {
            return {
                1: {
                    title: 'Pending'
                },
                3: {
                    title: 'Approved'
                },
                8: {
                    title: 'Approved'
                },
                10: {
                    title: 'Approved'
                },
                9: {
                    title: 'Rejected'
                },
                11: {
                    title: 'Rejected'
                },
                17: {
                    title: 'Disbursed'
                }
            };
        };
        this.buildExportListHeader = function() {
            var columnHeaders = new Array('Employee Details', 'Employee ID', 
                'Total Amount', 'Installments', 'Recovered Amount', 'Outstanding Amount', 
                'EMIs Left', 'Account Status', 'Disbursed On', 'Repayment Status');
            
            return new Array(columnHeaders);
		};
		this.buildExportData = function (list, statusMapping, repaymentStatusMapping) {
			var csvContent = this.buildExportListHeader(list);

            angular.forEach(list, function(value, key) {
                var array = new Array();
                
                array.push(utilityService.getInnerValue(value, 'employee_details', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'employee_details', 'emp_code'));
                
                array.push(utilityService.getValue(value, 'amount'));
                array.push(utilityService.getValue(value, 'installments'));

                array.push(utilityService.getValue(value, 'amount_recovered'));
                array.push(utilityService.getValue(value, 'outstanding_amount'));
                array.push(utilityService.getValue(value, 'emis_left'));

                array.push(statusMapping[utilityService.getValue(value, 'status', 1)].title);
                array.push(utilityService.getValue(value, 'disbursed_date'));
                array.push(repaymentStatusMapping[utilityService.getValue(value, 'repayment_status', 1)].title);
                
                csvContent.push(array);
            });

            return csvContent;
        };
        this.buildEditAdvanceObject = function () {
            return {
                index: -1,
                installment: 0,
                paidAmount: 0,
                item: {},
                type: {
                    selected: null,
                    list: [{
                        id: 1,
                        slug: 'foreclose',
                        title: 'Foreclose'
                    }, {
                        id: 2,
                        slug: 'change_tenure',
                        title: 'Change Tenure'
                    }, {
                        id: 3,
                        slug: 'change_emi_amount',
                        title: 'Change Amount'
                    }]
                },
                model: {
                    tenure: null,
                    emi_amount: null
                },
                emiList: [],
                visible: {
                    recalculate: false,
                    installment: false,
                    details: false
                }
            };
        };
        this.convertTimestampToStringDate = function (num) {
            if (!num) {
                return num;
            }

            return (new Date(num*1000).getDate() + "/" 
                + parseInt(new Date(num*1000).getMonth() +1) + "/" 
                + new Date(num*1000).getFullYear());
        };
        this.buildUpdateEMIPayload = function (emiList) {
            return {
                installments_preview: emiList
            }
        };

        this.buildTaxCSV = function (list) {
            var arr = new Array(['Employee Name', 'Employee Code', 'EMI']), 
            object = {
                list: list,
                content: arr
            };

            angular.forEach(object.list.rows, function(value, key) { 
                var array = new Array();
                array.push(utilityService.getValue(value, 'emp_name'));
                array.push(utilityService.getValue(value, 'emp_code'));
                array.push(utilityService.getValue(value, 'emi'));
                
                object.content.push(array);
            });

            return object;
        }

        this.getYearList = function(yearExtended) {
        	var d = new Date(),
        		year = d.getFullYear(),
        		list = [];
        	for(var i=0; i<= year - utilityService.startYear; i++) {
        		list.push(year - i);
			}
			if(yearExtended.enabled) {
				angular.forEach(yearExtended.upto, function(value) {
					list.push(value)
				})
			}
        	return list;
        };

	    return this;
	}
]);