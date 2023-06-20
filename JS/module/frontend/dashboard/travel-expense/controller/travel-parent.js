app.controller('TravelParentController', [
    '$scope', '$routeParams', '$q', 'travelParentService', 'utilityService', 'ServerUtilityService', 
    function($scope, $routeParams, $q, travelParentService, utilityService, serverUtilityService) {

        $scope.travelSettingObj = travelParentService.buildTravelSettingObj();

        var getTravelSettings = function() {
        	$q.all([
                serverUtilityService.getWebService(travelParentService.getUrl('travelSetting'))
            ]).then(function(data) {  
                $scope.travelSettingObj.travel.setting = data[0].data;
            });
        };
        getTravelSettings();
        
        $scope.travelEmployeeObject = {
            selectedTab : 0
        };

        if($routeParams.tab){
            $scope.travelEmployeeObject.selectedTab = $routeParams.tab;
        }
        
        $scope.converTimeStampToDate = function (timestamp) {
            if (timestamp) {
                var d = new Date(timestamp * 1000);
                return utilityService.dateToString(d);
            } else {
                return null;
            }
        };
    }
]);