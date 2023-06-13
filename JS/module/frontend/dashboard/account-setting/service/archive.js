app.service('ArchiveService', [
	'utilityService',    
	function (utilityService) {
		'use strict';

        this.url = {	   
        	pdf: 'prejoin/generate-pdf',
        	archive: 'employee/account-summary'
        };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    
	    this.buildArchiveObject = function() {
	    	return {
	    		list: []
	    	}
	    };	    

		return this;
	}
]);