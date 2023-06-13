app.controller('ConfigurationController', [
    '$scope', '$timeout','configurationService', 'utilityService', 'ServerUtilityService', 'SYSTEM_INFO', 
    function ($scope, $timeout, configurationService, utilityService, serverUtilityService, SYSTEM_INFO) {
        $scope.connectivityTypeList = configurationService.buildConnectivityTypeList();

        var syncConfigurationModel = function(model) {
            $scope.systemInfo = configurationService.buildEmailConfigurationModel(model, $scope.module);
        };
        syncConfigurationModel();
        
        var getEmailConfigurationSetting = function() {
            var url = configurationService.getUrl('configuration') + "/" + $scope.module.name + "/" + $scope.module.emailType;
            serverUtilityService.getWebService(url).then(function(data){
                syncConfigurationModel(data.data);
            });            
        };
        getEmailConfigurationSetting();

        $scope.updateEmailConfiguration = function() {
            var url = configurationService.getUrl('configuration') + "/" + $scope.module.name + "/" + $scope.module.emailType,
                payload = configurationService.buildConfigurationPayload($scope.systemInfo);

            serverUtilityService.postWebService(url, payload).then(function(data) {
                successErrorCallback(data, "configuration");
            });
        };
        $scope.checkConnection = function() {
            var url = configurationService.getUrl("connection"),
                payload = configurationService.buildConfigurationPayload($scope.systemInfo);

            serverUtilityService.postWebService(url, payload).then(function(data) {
                successErrorCallback(data, "connection");
            });
        };
        $scope.changeEncryptionType = function(encryptionType) {
            $scope.systemInfo.port = SYSTEM_INFO.connectivityType[encryptionType].port
        };
        $scope.resetAPIError = function(status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        var successCallback = function(data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            if(section === "configuration") {
                $scope.navigateSetupWizard('organization', 'userManagement', 'userIdentification');
            }
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                if(section == "connection") {
                    utilityService.resetAPIError(true, data.data.message, section);
                } else {
                    utilityService.resetAPIError(true, "something went wrong", section);
                    angular.forEach(data.data.message, function (value, key) {
                        $scope.errorMessages.push(value[0]);
                    });
                }                
            }
        };        
        var successErrorCallback = function (data, section) {
            data.status === "success" ? successCallback(data, section) : errorCallback(data, section);
        };  
        $(document).ready(function() {
            $timeout(function() {
                $('.popoverOption').popover({ trigger: "hover" });
            }, 1000);
        });        
        $scope.skipToNextTab = function() {
            if($scope.module.name === "prejoining") {
                $scope.navigateSetupWizard('prejoin', 'candidatePortal', 'home');
            } else {
                $scope.navigateSetupWizard('organization', 'userManagement', 'userIdentification');
            }            
        }  
    }
]);