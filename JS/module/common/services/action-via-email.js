app.service('ActionViaEmailService', ['utilityService', 'SalaryService', 
    function (utilityService, salaryService) {
        'use strict';

        this.url = {
            validateToken: 'employee/mail-action',
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildLinkTokenObject = function (routeParams) {
            return {
                valid: false,
                message: false,
                visible: false,
                token: utilityService.getValue(routeParams, 'token'),
                status: utilityService.getValue(routeParams, 'status'),
                action_id: utilityService.getValue(routeParams, 'action_id'),
                employee_id: utilityService.getValue(routeParams, 'employee_id'),
                defaultMessage: "This link has expired. Please connect with your HR team or Qandle team for more details."
            };
        };
        this.buildParamsObject = function (model) {
            return {
                token: utilityService.getValue(model, 'token'),
                status: parseInt(utilityService.getValue(model, 'status'), 10),
                action_id: utilityService.getValue(model, 'action_id'),
                employee_id: utilityService.getValue(model, 'employee_id')
            };
        };                    
    }
]);