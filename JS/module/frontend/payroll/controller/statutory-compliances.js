app.controller('StatutoryCompliancesController', [
    '$scope', '$location', '$timeout', '$window', '$q','StatutoryCompliancesService', 'utilityService', 'ServerUtilityService', 
    function ($scope, $location, $timeout, $window, $q, statutoryCompliancesService, utilityService, serverUtilityService) {

        $scope.account = statutoryCompliancesService.buildAccountObject();
        $scope.resetAllTypeFilters();
        var getPFAccountDetails = function () {
            var url = statutoryCompliancesService.getUrl('pfAccount');
            serverUtilityService.getWebService(url).then(function (data) {
                
//                var count = {
//                    pf: 0,
//                    uan: 0
//                };

//                angular.forEach(data.data, function(value, key) {
//                    if(!value.pf_number) {
//                        ++count.pf;
//                    }
//                    if(!value.uan_number) {
//                        ++count.uan;
//                    }
//                });

                $scope.account.pf.list = data.data.data;
                $scope.account.pf.count.pf = data.data.pf_number_pending;
                $scope.account.pf.count.uan = data.data.uan_number_pending;
            });
        };
        getPFAccountDetails();

        var getESIAccountDetails = function () {
            var url = statutoryCompliancesService.getUrl('esiAccount');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.account.esi.list = data.data.data;
                $scope.account.esi.esiPending = data.data.esic_pending;
            });
        };
        getESIAccountDetails(); 

        $scope.navigateToPublicProfile = function(item) {
            return false;
            //$location.url("dashboard/profile/" +  item.employee_id);
        }; 
        
        
    }
]);