app.service('FnFCertificateService', [
    '$timeout','ServerUtilityService', 'utilityService',
    function ($timeout,ServerUtilityService, utilityService) {
        'use strict';

		this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };

        this.url = {
    	   fnf_listing: 'payroll/fnf-initiated-employees',
           fnf_upload_certificate: 'payroll/upload-fnf-certificate',
           download_fnf_certificate:'payroll/download-fnf-certificate'
        };   
        /*this.buildFnfCertificatePayload = function(model){
            var payload = {
                fnf_initiate_id: model.employee_id,
                certificate_type: model.certificate_type,
            }
        }   */ 
	}
]);