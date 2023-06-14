app.service('LoanService', [
	'$timeout', 'utilityService',        
	function ($timeout, utilityService) {
		'use strict';
		var self = this;

        this.url = {
            getLoanType: 'loan-advance/loan-categories',
            getRequest: 'loan-advance/employee-requests',
            newRequest: 'loan-advance/request',            
            getApprovalChain: 'loan-advance/approver-chain',
            deleteLoanType: 'loan-advance/request-delete',
            viewDetail: 'loan-advance/request-details',
            approveRejectCheck: 'employee/action',
            formDetails: 'loan-advance/new-request-form-details',
            updateStatus: 'loan-advance/status',
            action: 'employee/action',
            approverChain: 'loan-advance/approver-detail'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };       
        this.buildRequestModel = function(model){
            return {
                _id: utilityService.getValue(model,'_id'),
                request_type: utilityService.getValue(model, 'request_type', 2),
                loan_type: utilityService.getValue(model, 'loan_type'),
                amount: utilityService.getValue(model, 'amount'),
                interest_rate: utilityService.getValue(model, 'interest_rate'),
                total_interest: utilityService.getValue(model, 'total_interest'),
                installments: utilityService.getValue(model, 'installments'),
                description: utilityService.getValue(model, 'description'),
            };
        };

	    return this;
	}
]);