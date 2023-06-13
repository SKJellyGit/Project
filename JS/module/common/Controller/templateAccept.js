app.controller('TemplateAcknowledgeController', [
    '$scope', '$routeParams', '$location', '$window', '$sce', 'ProfileService', 'utilityService', 'ServerUtilityService', 
    function ($scope, $routeParams, $location, $window, $sce, ProfileService, utilityService, serverUtilityService) {
        
        $scope.acknowledgeObj = {
            isVisible: true,
            fullName: utilityService.getStorageValue('fullname'),
            displayDetail: utilityService.getStorageValue('displayDetail'),
            empId: $routeParams.empId,
            letter: $routeParams.letter,
            title: $routeParams.title,
            typeName: $routeParams.typeName,
            status: $routeParams.status,
            letterUrl: $sce.trustAsResourceUrl("//docs.google.com/gview?url=" 
                + ProfileService.getUrl('downloadLetter') + '/' + $routeParams.letter + "/" 
                + $routeParams.empId  + "/" + utilityService.getStorageValue('accessToken') + "&embedded=true"),
            trainingRequest:$routeParams.trainingRequest,
            moduleName:$routeParams.moduleName
        };        
        $scope.downloadLetter = function () {
            if($scope.acknowledgeObj.moduleName=='lnd')
            {
                var url = ProfileService.getUrl('downloadLndLetter') + '/' + $scope.acknowledgeObj.letter + "/" 
                + $scope.acknowledgeObj.trainingRequest;
            $window.open(url);
            }   
            else
            {
                var url = ProfileService.getUrl('downloadLetter') + '/' + $scope.acknowledgeObj.letter + "/" 
                + $scope.acknowledgeObj.empId + "/" + utilityService.getStorageValue('accessToken');
            $window.open(url);
            }
        };        
        $scope.AcknowledgeLetter = function () {
            if($scope.acknowledgeObj.moduleName=='lnd')
            {
                var url = ProfileService.getUrl('acknowledgeLndLetter') + '/' + $scope.acknowledgeObj.empId + "/" 
                + $scope.acknowledgeObj.letter+'/'+$scope.acknowledgeObj.trainingRequest;
            }
            else
            {
                var url = ProfileService.getUrl('acknowledgeLetter') + '/' + $scope.acknowledgeObj.empId + "/" 
                + $scope.acknowledgeObj.letter;
            }

            serverUtilityService.putWebService(url)
                .then(function (data) {
                    if(data.status == 'success') {
                        var routParam = $routeParams;
                        $scope.acknowledgeObj.status = 1;
                        routParam.status = 1;
                        utilityService.showSimpleToast(data.message);
                        $location.search(routParam);
                        utilityService.setReloadOnSearch(true);
                    } else {
                        alert("Something went wrong.");
                    }
                });
        };
        
    }
]);