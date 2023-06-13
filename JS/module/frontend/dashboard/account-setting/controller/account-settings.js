app.controller('AccountSettingsController', [
	'$scope','$rootScope','$timeout', '$routeParams', '$location', 'utilityService', 'ServerUtilityService', 'AccountSettingsService', 'signatureService', 'userService','$window',
	function ($scope,$rootScope,$timeout, $routeParams, $location, utilityService, serverUtilityService, service,  signatureService, userService,$window) {
                
        $scope.accountSettings = service.buildAccountSettingsObject();

        /***** Start General Setting Section *****/       
        $scope.viewArchiveProfile = function() {
            $location.url('archive-profile');
        };
        $scope.downloadArchiveProfile = function() {

        };
        /***** End General Setting Section *****/



        /***** Start Security Setting Section *****/
        $scope.updatePassword = function() {
            resetErrorMessages();
            var url = service.getUrl('changePassword'),
                payload = service.buildChangePasswordPayload($scope.accountSettings.security.password);
            
            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, "changePassword");
                });
        };
        $scope.createSignature = function() {
            $location.url('dashboard/signature');
        };
        var getCurrentSignature = function() {
            var url = service.getUrl('fullSignature');
            
            serverUtilityService.getWebService(url).then(function(data) {
                if(data.status === 500) {
                    $scope.accountSettings.security.signature.full = null;
                    $scope.accountSettings.security.signature.short = null;
                }
            });
        };
        getCurrentSignature();
        var buildSessionObject = function(data) {
            $scope.accountSettings.security.session.current = data.data.current;
            $scope.accountSettings.security.session.list = utilityService.getValue(data.data, 'list') 
                ? data.data.list : [] ;
            $scope.accountSettings.security.session.activeCount = utilityService.getValue(data.data, 'list') 
                ? data.data.list.length : 0;
        };
        var getAllSessions = function() {
            serverUtilityService.getWebService(service.getUrl('session'))
                .then(function(data) {
                    buildSessionObject(data);                    
                });
        };
        getAllSessions();
        $scope.timeSince = function(dateString) {
            var date = new Date(dateString),
                timestamp = date.getTime()/1000;

            return utilityService.timeSince(timestamp);
        };
        $scope.changeTab = function(tab) {
            $scope.accountSettings.security.session.selectedTab = tab;
        };  
        $scope.logoutSpecificSession = function(item) {
            var url = userService.getUrl('deleteSession') + "/" + item._id.$id;
            serverUtilityService.deleteWebService(url).then(function(data) {
                    item.is_active = false;
                    utilityService.showSimpleToast("You have been successfully logout from requested session.");
                });
        };
        $scope.logoutAllSession = function() {
            var url = userService.getUrl('deleteSession');
            serverUtilityService.deleteWebService(url).then(function(data) {
                    utilityService.showSimpleToast("You have been successfully logout from all active sessions.");
                    getAllSessions();
                });
        };
        /***** End Security Setting Section *****/



        /***** Start Communication Setting Section *****/
        var communicationSettingCallback = function(data) {
            if(!data.data) {
                return false;
            }
            $scope.accountSettings.communications.notification = data.data.browser_notification;
            $scope.accountSettings.communications.modulelist = data.data.module_details;
        };
        var getCommunicationSetting = function() {
            serverUtilityService.getWebService(service.getUrl('communication'))
                .then(function(data) {
                    communicationSettingCallback(data);                    
                });
        };
        getCommunicationSetting();
        $scope.updateBrowserNotificationSetting = function() {
            resetErrorMessages();
            var url = service.getUrl('browser'),
                payload = service.buildNotificationPayload($scope.accountSettings.communications);
            
            console.log(payload);
            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, "browser");
                });
        };
        $scope.updateModuleSetting = function() {
            resetErrorMessages();
            var url = service.getUrl('module'),
                payload = service.buildModulePayload($scope.accountSettings.communications.modulelist);
            
            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, "communication");
                });
        };
        /***** End Communication Setting Section *****/
        
        var changePasswordSuccessCallback = function(data) {
            if($scope.accountSettings.security.password.signout) {
                $scope.logout();
            }
        };
        var doSomething = function(data, section) {

        };
        var successCallback = function(data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            section == "changePassword" ? changePasswordSuccessCallback(data) : doSomething(data);
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };        
        var successErrorCallback = function (data, section) {
            data.status === "success" ? 
                successCallback(data, section) : errorCallback(data, section);
        };       
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        var toggleModal = function(id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false, 
                    show: true
                }) 
                : $('#' + id).modal('hide');
        };
        $scope.resetErrorStatus = function() {
            utilityService.resetAPIError(false, null, 'changePassword');
        };

//        $rootScope.$on('signature',function(){
//            $window.location.reload();           
//        })
	}
]);