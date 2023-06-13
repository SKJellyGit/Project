app.service('AccountSettingsService', [
	'utilityService',    
	function (utilityService) {
		'use strict';

        this.url = {
        	communication: 'employee/account-setting',
        	module: 'employee/account-setting',
        	browser: 'employee/browser-setting',
        	changePassword: 'employee/changePassword',
        	fullSignature: 'signature/sign-image/full',
        	shortSignature: 'signature/sign-image/short',
        	session: 'employee/session-detail'
        };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildTimeZoneList = function() {
	    	return [
				{
					id: 1,
					title: "(UTC + 05 : 30) Chennai, Kolkata, Mumbai, New Delhi"
				}
			]
	    };
	    this.buildDefaultTimeZoneObject = function() {
	    	return {
				id: 1,
				title: "(UTC + 05 : 30) Chennai, Kolkata, Mumbai, New Delhi"
			}
	    };	    
	    this.buildAccountSettingsObject = function() {
	    	return {
	    		general: {
	    			timeZone: {
	    				list: this.buildTimeZoneList(),
	    				selected: this.buildDefaultTimeZoneObject()
	    			}
	    		},
	    		security: {
	    			password: {
	    				old: null,
	    				new: null,
	    				confirm: null,
	    				signout: true
	    			},
	    			signature: {
	    				full: this.url.fullSignature + '?access_token=' + utilityService.getStorageValue('accessToken')+"&"+  new Date().getTime(),
	    				short: this.url.shortSignature + '?access_token='  + utilityService.getStorageValue('accessToken')+"&"+  new Date().getTime()
	    			},
	    			session: {
	    				selectedTab: 'all',
	    				current: null,
	    				list: [],
	    				activeCount: 0
	    			}
	    		},
	    		communications: {
	    			notification: false,
	    			modulelist: []
	    		}
	    	}
	    };
	    this.buildNotificationPayload = function(model) {
	    	return {
	    		browser_notification: model.notification
	    	}
	    };
	    this.buildModulePayload = function(list) {
	    	var payload = {};
	    	angular.forEach(list,  function(value, key) {
	    		payload[value.key] = value.notify_timing;
	    	});
	    	return payload;
	    }; 
	    this.buildChangePasswordPayload = function(model) {
	    	return {
	    		old_password: model.old,
	    		password: model.new,
	    		password_confirmation: model.confirm
	    	}
	    };
	    this.getActiveSessionCount = function(list) {
	    	var count = 0;
	    	angular.forEach(list,  function(value, key) {
	    		if(value.is_active) {
	    			count++;
	    		}
	    	});
	    	return count;
	    };
	    
		return this;
	}
]);