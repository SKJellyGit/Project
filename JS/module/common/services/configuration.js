app.service('configurationService', [
	'ServerUtilityService', 'utilityService', 'SYSTEM_INFO',       
	function (ServerUtilityService, utilityService, SYSTEM_INFO) {
		'use strict';
		
	    this.url = {
	    	configuration : 'email-config/settings',
	    	connection: 'email-config/test-connection'	    	
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildEmailConfigurationModel = function(model, module) {
			return {
                _id: utilityService.getValue(model, '_id'),
                module_key: module.name,
                type: module.emailType,
                mailServer : utilityService.getValue(model, 'out_email_server'),
                username : utilityService.getValue(model, 'email_username'),
				password : utilityService.getValue(model, 'email_password'),
				port : utilityService.getValue(model, 'out_email_port', SYSTEM_INFO.connectivityType.ssl.port),
				fromName : utilityService.getValue(model, 'email_from_name'),
				email : utilityService.getValue(model, 'email_id'),
				encryptionType : utilityService.getValue(model, 'encryption_type', SYSTEM_INFO.connectivityType.ssl.value)
	        }
		};
		this.buildConfigurationPayload = function(model) {
			return {
				module_key: model.module_key,
				type: model.type,
				out_email_server: model.mailServer,
				email_username: model.username,
				email_password: model.password,
				out_email_port: model.port,
				email_from_name: model.fromName,
				email_id: model.email,
				encryption_type: model.encryptionType
			}
		};
        this.buildConnectivityTypeList = function() {
        	return [
	    		{
	    			value: SYSTEM_INFO.connectivityType.ssl.value, 
	    			displayValue: SYSTEM_INFO.connectivityType.ssl.displayValue
	    		},
	    		{
	    			value: SYSTEM_INFO.connectivityType.tls.value, 
	    			displayValue: SYSTEM_INFO.connectivityType.tls.displayValue
	    		}
	    	]
        };
	}
]);