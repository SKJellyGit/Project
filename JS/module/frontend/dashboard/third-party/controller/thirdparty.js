app.controller('ThirdPartyController', [
    '$scope', '$rootScope', '$routeParams', '$modal', '$mdDialog', '$sce', 'ThirdPartyService', 'utilityService', 'ServerUtilityService',
    function ($scope, $rootScope, $routeParams, $modal, $mdDialog, $sce, service, utilityService, serverUtilityService) {
        $scope.insurance = service.buildInsuranceObject();

        console.log(utilityService.getValue($routeParams, 'module'));
        $scope.thirdPartyList = [];
        var getThirdPartyIntegration = function () {
            var url = service.getUrl('integrationsThirdParty');
            serverUtilityService.getWebService(url).then(function (data) {
                if(data.status == "success") {
                    $scope.thirdPartyList = data.data;
                    var findthirdparty = _.findWhere($scope.thirdPartyList, { _id : utilityService.getValue($routeParams, 'module') + ""});
                    if(findthirdparty != undefined) {
                        if(findthirdparty.auth === true){
                            $scope.insurance.details.iframeSrc = $sce.trustAsResourceUrl(findthirdparty.sso_route + "?access_token=" + utilityService.getStorageValue('accessToken'));
                        }else{
                            $scope.insurance.details.iframeSrc = $sce.trustAsResourceUrl(findthirdparty.sso_route);
                        }
                        $scope.insurance.visible = true;
                    } else {
                        $scope.insurance.details.iframeSrc = $sce.trustAsResourceUrl(findthirdparty.sso_route + "?access_token=" + utilityService.getStorageValue('accessToken'));
                        $scope.insurance.visible = false;
                    }
                } else {
                    console.log("Need to handle error");
                }
            });
        };
        // getThirdPartyIntegration();
        
    }
]);