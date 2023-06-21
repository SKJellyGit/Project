app.controller('OkrAdminSetting', [
    '$scope', '$rootScope', '$timeout', '$routeParams', '$window', '$filter', '$location', '$modal', 'ServerUtilityService', 'utilityService', 'AdminOkrService', 'ObjectiveService',
    function($scope, $rootScope, $timeout, $routeParams, $window, $filter, $location, $modal, serverUtilityService, utilityService, service, objectiveService) {
        'use strict';

        $scope.navigateTo = function () {
            $location.url('/frontend/okr');
        };











        
    }
]);