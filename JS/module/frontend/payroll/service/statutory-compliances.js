app.service('StatutoryCompliancesService', [
    'utilityService',
    function (utilityService) {
        'use strict';
        
        this.url = {
            pfAccount: 'payroll/employee-pf-uan',
            esiAccount: 'payroll/employee-esi'
        };        
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildAccountObject = function () {
            return {
                pf: {
                    list:[],
                    count: {
                        pf: 0,
                        uan: 0
                    }
                },
                esi: {
                    list:[],
                    esiPending: null,
                    isAll: false
                }
            };
        };
        
        

    }
]);