app.controller('UserController', [
	'$scope', '$location', '$window', '$timeout', '$routeParams', 'userService', 'utilityService', 'ServerUtilityService', '$q',
	function ($scope, $location, $window, $timeout, $routeParams, userService, utilityService, serverUtilityService, $q) {
		var token = utilityService.getValue($routeParams, 'token'),
			isCP = utilityService.getValue($routeParams, 'cp');

		$scope.verificationToken = token ? token : utilityService.getStorageValue('verificationToken');
		$scope.resetToken = utilityService.getValue($routeParams, 'resetToken');
		$scope.apiError = utilityService.buildAPIErrorObject();
		$scope.errorMessages = [];
		$scope.loginFrgtPwdSection = userService.buildLoginFrgtPwdSectionObject();
		$scope.loginClick = userService.buildLoginClickObject();
		$scope.loginVia = userService.buildLoginViaObject();
		$scope.loginWithUserAndPassword = false;
		$scope.isClockinDone = utilityService.getStorageValue('isClockin') ? utilityService.stringToBooleanConversion(utilityService.getStorageValue('isClockin')) : false;

		var getIsCorrectTime = function(servicedata, url) {
			var serviceurl = userService.getUrl('totalTime');
            serverUtilityService.getWebService(serviceurl, null, servicedata.data.accessToken).then(function (data) {
				var conversionformat = "HH";
				$scope.localStartTime = data.data.shift_start_timestamp ? moment(new Date(data.data.shift_start_timestamp * 1000)).format(conversionformat) : 0;
                $scope.localendTime = data.data.shift_end_timestamp ? moment(new Date(data.data.shift_end_timestamp * 1000)).format(conversionformat) : 0;               
				$scope.localReporting = data.data.reporting_method ? data.data.reporting_method : "";

				var getCurrentTime = parseInt(moment(new Date()).format("HH"));
				var startRange = parseInt($scope.localStartTime) - 1;
				var endRange = parseInt($scope.localStartTime) + 1;

				var logoutMinus = parseFloat($scope.localendTime) - 0.30;
				var logoutPlus = parseInt($scope.localendTime) + 1;

				console.log(logoutMinus);
				var isCorrectInTime = false;
				if(getCurrentTime >= startRange && getCurrentTime <= endRange) {
					isCorrectInTime = true;
				}
				var isCorrectOutTime = false;
				if(getCurrentTime >= logoutMinus && getCurrentTime <= logoutPlus) {
					isCorrectOutTime = true;
				}

					if(isCorrectInTime && !$scope.isClockinDone && ($scope.localReporting == 'web' || $scope.localReporting == 'web_app')) {
						$location.url('firstattendance');
					} else if(isCorrectOutTime && $scope.isClockinDone && ($scope.localReporting == 'web' || $scope.localReporting == 'web_app')) {
						$location.url('firstattendance');
					} else {
						$location.url(url);
					}
				}, function(data) { // error handler
					$location.url(url);
				}
			);
		}

		var syncLoginModel = function() {
			$scope.login = userService.buildLoginModel();
		};
		syncLoginModel();
		var isCallbackWizard = function() {
			return ($scope.callback && $scope.callback == "candidatePortal");
		};
		var isCandidateLogin = function(data) {
            var is_candidate = data.is_candidate ? true : false;
            utilityService.setStorageValue('isCandidateLogin', is_candidate);
			
			return data.is_candidate ? true : false;
		};
		var loginCallbackSuccess = function(data, ischeckin) {
				utilityService.resetAPIError(false, null, "login");
				userService.setStorageValue(data.data);
				var isMandatoryFieldRequired = utilityService.getInnerValue(data.data, 'employee_detail', 'mandatory_fields_required', false);
				utilityService.setStorageValue('refreshToken', utilityService.getValue(data.data, 'refreshToken'), 3500);
				var url = isCandidateLogin(data.data) ? 'candidatePortal' : isMandatoryFieldRequired
							? 'user-mandatory-fileds' : (utilityService.getStorageValue('hasPasswordChanged') 
								? 'dashboard/home' : 'reset-password');	 
				if(isCandidateLogin(data.data)) {
					$location.url(url);
				} else {
					getIsCorrectTime(data, url);
				}
	    };
	    var loginCallbackError = function(data) {
	    	var message = data.status === "error" ? data.message : data.data.message;
	    	utilityService.resetAPIError(true, message, "login");				
	    };
	    var loginCallback = function(data, ischeckin) {
	    	data.status === "success" ? loginCallbackSuccess(data, ischeckin) : loginCallbackError(data);
	    };
	    $scope.frgtPwd = {
	    	success: false,
	    	message: null
	    };
		var frgtPwdCallbackSuccess = function(data) {
	    	utilityService.resetAPIError(true, "We have sent you an email with the instructions to reset your password. Please wait for upto 2 minutes to receive the mail. Check your spam folder if you do not receive the mail even after 2 minutes.", "login");	 
	    	//$scope.toggleLoginFrgtwdSection('login');
	    	$scope.resetToken = data.data.reset_token;
	    };
		var frgtPwdCallback = function(data) {
	    	data.status === "success" ? frgtPwdCallbackSuccess(data) : loginCallbackError(data);
	    };
	    $scope.changePassword = {
	    	success: false
	    };
	    var resetPwdCallbackSuccess = function(data) {
	    	utilityService.resetAPIError(false, null, "login");	 
	    	$scope.resetToken = null;
	    	$scope.changePassword = {
		    	success: true
		    };
	    	$timeout(function() {
	    		$scope.changePassword = {
			    	success: false
			    };
	    		$location.url('login').search('resetToken', null);
	    	}, 5000);	    	
	    };
		var resetPwdCallback = function(data) {
	    	data.status === "success" ? resetPwdCallbackSuccess(data) : loginCallbackError(data);
	    };
	    $scope.submitLogin = function() {
			$scope.loginClick.triggered = true;
			$scope.login.otp = null;
	    	var url = userService.getUrl("login"),
	    		payload = userService.buildLoginPayload($scope.login, $scope.loginVia);

	    	serverUtilityService.postWebService(url, payload)
                .then(function(data) {
					var currencySign = utilityService.getInnerValue(data.data.employee_detail, 'currency', 'symbol_native');utilityService.setStorageValue('employeeCurrency', currencySign)
					if(currencySign) {
						var styleElem = document.head.appendChild(document.createElement("style"));
						styleElem.innerHTML = ".fa-inr:before {content: '" + currencySign + "' !important;}";
					}
					$scope.loginClick.triggered = false;
					$scope.login.otp_token = utilityService.getInnerValue(data, 'data', 'otp_token');
					$scope.login.otp_token ? $scope.toggleLoginFrgtwdSection('otp') : loginCallback(data, payload.for_clockin);                 
				}, function(error) {
                	$scope.loginClick.triggered = false;
                });		 	
		};
		$scope.forgotPassword = function() {
	    	var url = userService.getUrl("forgotPassword"),
	    		payload = userService.buildForgotPasswordPayload($scope.login);

	    	serverUtilityService.postWebService(url, payload)
                .then(function(data){
                    frgtPwdCallback(data);
                });		 	
		};
		$scope.submitOTP = function() {
	    	$scope.loginClick.triggered = true;
	    	var url = userService.getUrl("login"),
	    		payload = userService.buildOTPPayload($scope.login);

	    	serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                	$scope.loginClick.triggered = false;
                    loginCallback(data);
                }, function(error) {
                	$scope.loginClick.triggered = false;
                });		 	
		};
		$scope.resetAPIError = function(status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        $scope.toggleLoginFrgtwdSection = function(section) {
        	$scope.resetToken = null;
        	$scope.frgtPwd = {
		    	success: false,
		    	message: null
		    };
        	angular.forEach($scope.loginFrgtPwdSection, function(value, key) {
        		$scope.loginFrgtPwdSection[key] = false;
        	});
        	$scope.loginFrgtPwdSection[section] = true;
        	utilityService.resetAPIError(false, null, "login");
        };
        $scope.resetPassword = function() {
        	var url = userService.getUrl("resetPassword"),
	    		payload = userService.buildResetPasswordPayload($scope.login, $scope.resetToken);

	    	serverUtilityService.postWebService(url, payload)
                .then(function(data){
                    resetPwdCallback(data);
                });
        };
        $scope.isActiveDirectoryLoginEnabled = function() {
            return typeof config[$scope.envMnt].activeDirectoryLogin != "undefined" 
				&& config[$scope.envMnt].activeDirectoryLogin.enabled 
				&& !(config[$scope.envMnt].activeDirectoryLogin.loginWithUserAndPassword)
		};

		$scope.isActiveLoginAndDirectoryLogin = function() {
			if(typeof config[$scope.envMnt].activeDirectoryLogin != "undefined" 
				&& config[$scope.envMnt].activeDirectoryLogin.enabled 
				&& config[$scope.envMnt].activeDirectoryLogin.loginWithUserAndPassword) {
					$scope.loginWithUserAndPassword = true;
			}
		}

		$scope.isActiveLoginAndDirectoryLogin();
		
        $scope.loginViaActiveDirectory = function () {
			var url = config[envMnt].activeDirectoryLogin.url,
				clientId = config[envMnt].activeDirectoryLogin.clientId,
				response_type = config[envMnt].activeDirectoryLogin.response_type,
				redirectUri = config[envMnt].activeDirectoryLogin.redirectUri,
				responseMode = config[envMnt].activeDirectoryLogin.responseMode,
				// access = config[envMnt].activeDirectoryLogin.access,
				state = config[envMnt].activeDirectoryLogin.state,
				scope = config[envMnt].activeDirectoryLogin.scope,
				nonce = config[envMnt].activeDirectoryLogin.nonce
			href = url + "?client_id=" + clientId + "&response_type=" + response_type
				+ "&redirect_uri=" + redirectUri + "&response_mode=" + responseMode
				+ "&scope=" + scope + "&state=" + state + '&nonce=' + nonce ;

			window.location = href;
        };

        if($scope.section.login && isCP) {
        	$scope.toggleLoginFrgtwdSection('frgtPwd');
        	$timeout(function() {
        		$location.search("cp", null);
        	}, 500);
		}
		
		$scope.loginWithGoogle = function () {
			serverUtilityService.getWebService(userService.getUrl('googleLogin'))
				.then(function (data) {
					$window.location.href = data.data;
				});
		};        
	}
]);