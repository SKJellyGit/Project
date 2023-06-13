app.service('templateConsumerService', [
	'utilityService', '$sce', 'TEMPLATE_BUILDER',      
	function (utilityService, $sce, TEMPLATE_BUILDER) {
		'use strict';

	    this.url = {	    	
	    	certificate: 'certificate/template',
	    	appointment: 'appointment/template',
	    	offer: 'offer/template',
            references: 'data/references.json',
            candidate: 'data/candidate.json'
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };        
	}
]);