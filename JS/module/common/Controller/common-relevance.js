app.controller('CommonRelevanceController', [
    '$scope', '$routeParams', '$sce',  '$timeout', '$location',
    function ($scope, $routeParams, $sce, $timeout, $location) {
        
        $scope.urlModuleName = angular.isDefined($routeParams.moduleName) 
            ? $routeParams.moduleName : null;
        
        $scope.headerModule = "Relevance";
        if($scope.urlModuleName == 'formDocument') {
            $scope.headerModule = "Letters, Forms & Documents -> Forms";
        }

        if($scope.urlModuleName == 'docDocument') {
            $scope.headerModule = "Letters, Forms & Documents -> Documents";
        }

        if($scope.urlModuleName == 'exitFeedback') {
            $scope.headerModule = "EXIT FEEDBACK";
        }
        
        $scope.navigateTo = function() {
            if($scope.urlModuleName == 'formDocument') {
                $location.url('admin').search({
                    "tab": "letter",
                    "subTab": "forms"
                });
            } else if($scope.urlModuleName == 'docDocument') {
                $location.url('admin').search({
                    "tab": "letter",
                    "subTab": "document"
                });
            } else if($scope.urlModuleName == 'exitFeedback') {
                $location.url('admin').search({
                    "tab": "exitstp",
                    "subTab": "interview"
                });
            } else {
                $location.url("admin");
            }
        }

    }
]);