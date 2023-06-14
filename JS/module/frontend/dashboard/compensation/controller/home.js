app.controller('HomeController', [
    '$scope', '$routeParams', '$location', '$timeout', 'utilityService', 'ServerUtilityService', 'HomeService',
    function ($scope, $routeParams, $location, $timeout, utilityService, serverUtilityService, HomeService) {
        $scope.tab = {
            parentTab: 0,
            childTab: 0,
            linkTabMapping: {
                'benefit-management': 2,
                'claims': 3,
                'salary-advance': 4
            }
        };
        $scope.childTab = HomeService.compensationTabObj();
        if (angular.isDefined($routeParams.tab)) {
            $scope.tab.parentTab = $scope.childTab[$routeParams.tab].pTab;
            $scope.tab.childTab = $scope.childTab[$routeParams.tab].cTab;
        }
        var moduleStatus = function(){
            serverUtilityService.getWebService(HomeService.getUrl('modulestatus'))
                .then(function (data){
                    $scope.modulestatus = data.data;
                });
        };
        moduleStatus();

        if (utilityService.getValue($routeParams, 'linkTab')) {
            $scope.tab.childTab = utilityService.getInnerValue($scope.tab, 'linkTabMapping', utilityService.getValue($routeParams, 'linkTab'), 0);
            $timeout(function() {
                $location.search({"linkTab": null});
            }, 1000);
        }    
    }
]);