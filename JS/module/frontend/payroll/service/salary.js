  app.service('SalaryRevisionService', [
	'ServerUtilityService', 'utilityService',        
	function (ServerUtilityService, utilityService) {
		'use strict';

        var selfServive = this;

        this.url = {
            allUser : 'payroll/all-user',
            getPlanPreview:'payroll/compensation-plan/structure-preview',
            breakupSettings: 'payroll/salary-breakup/settings',
            esi: 'payroll/esi',
            pf: 'payroll/pf'
        };
        
        this.buildCompensationPlanPayLoad = function (credit, debit, ctc){
            var obj = {};
            angular.forEach(credit, function (val, key){
                if (val.value) {
                    obj[val.slug] = parseFloat(val.value);
                }
            });
            angular.forEach(debit, function (val, key){
                if (val.value) {
                    obj[val.slug] = parseFloat(val.value);
                }
            });
            
            angular.forEach(ctc, function (val, key){
                if (val.value) {
                    obj[val.slug] = parseFloat(val.value);
                }
            });
            
            return obj;
            
        };
        
        this.extractPreviewGrossCTC = function (data) {
            var obj = {
                ctc: null,
                gross: null
            };
            if (data.ctc.breakup_status) {
                obj.ctc = data.ctc;
            }
            obj.gross = data.gross;
            return obj;
        };
        this.extractPreviewError = function (data, section) {
            var error = [];
            angular.forEach(data, function (v, k) {
                var errObj = {
                    name: null,
                    err: null,
                    section: section
                };
                if (v.error_status) {
                    errObj.err = v.error;
                    errObj.name = v.slug;
                    error.push(errObj);
                }
                ;
            });
            return error;
        };

	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
        
        this.buildBreakupPayload = function (model, breakupType) {
             var payload = {
                per_cycle: 1,
                preview_breakup_by: 1
            };
            if (breakupType == 1) {
                payload.gross = utilityService.getValue(model, 'work_profile_compensation_gross');
            } else {
                payload.work_profile_compensation_ctc = utilityService.getValue(model, 'work_profile_compensation_ctc');
            }
            return payload;
        };
		return this;
	}
]);