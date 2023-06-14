app.service('PreviousEmployerService', ['utilityService', 
    function (utilityService) {
        'use strict';

        this.url = {
            taxMaster: 'manage_tax',
            prevEmpDtls: 'employee/prev-employer/detail'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildPreviousEmployerModel = function (model) {
            return {
                _id: utilityService.getValue(model, '_id'),
                personal: {
                    name: utilityService.getValue(model, 'name'),
                    address: utilityService.getValue(model, 'address'),
                    pan: utilityService.getValue(model, 'pan_no'),
                    tan: utilityService.getValue(model, 'tan_no'),
                    joiningDate: utilityService.getValue(model, 'joining_date') ?
                        utilityService.stringToDate(
                            utilityService.changeDateFormat(
                                utilityService.getValue(model, 'joining_date')
                            )                        
                        ) : null,
                    exitDate: utilityService.getValue(model, 'exit_date') ?
                        utilityService.stringToDate(
                            utilityService.changeDateFormat(
                                utilityService.getValue(model, 'exit_date')                                            
                            )
                        ) : null
                },
                salary: {
                    sal_amt_excluding_allowances_perquisite_epf: utilityService.getValue(model, 'sal_amt_excluding_allowances_perquisite_epf'),
                    allowances: utilityService.getValue(model, 'allowances'),
                    perquisite_and_epf: utilityService.getValue(model, 'perquisite_and_epf'),
                    sal_sum: this.salSum(model),
                    deduction_under_80c: utilityService.getValue(model, 'deduction_under_80c'),
                    tax_deduction: utilityService.getValue(model, 'tax_deduction'),
                    remarks: utilityService.getValue(model, 'remarks'),
                }
            }
        };
        this.buildPreviousEmployerPayload = function (model) {
            return {
                name: model.personal.name,
                address: model.personal.address,
                pan_no: model.personal.pan,
                tan_no: model.personal.tan,
                joining_date: utilityService.dateToString(model.personal.joiningDate),
                exit_date: utilityService.dateToString(model.personal.exitDate),
                
                sal_amt_excluding_allowances_perquisite_epf: model.salary.sal_amt_excluding_allowances_perquisite_epf,
                allowances: model.salary.allowances,
                perquisite_and_epf: model.salary.perquisite_and_epf,
                deduction_under_80c: model.salary.deduction_under_80c,
                tax_deduction: model.salary.tax_deduction,
                remarks: model.salary.remarks
            }
        };
        this.salSum = function (model) {
            return parseFloat(utilityService.getValue(model, 'sal_amt_excluding_allowances_perquisite_epf', 0), 10)
                + parseFloat(utilityService.getValue(model, 'allowances', 0), 10)
                + parseFloat(utilityService.getValue(model, 'perquisite_and_epf', 0), 10);
        };

        return this;
    }
]);