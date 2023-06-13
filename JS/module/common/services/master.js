app.service('masterService', function () {
    'use strict';

    this.url = {	   
    	location : 'company/location',
    	signatory : 'company/signatory'
    };

    this.getUrl = function(apiUrl) {
    	return getAPIPath() + this.url[apiUrl];
    };
    
	return this;
});