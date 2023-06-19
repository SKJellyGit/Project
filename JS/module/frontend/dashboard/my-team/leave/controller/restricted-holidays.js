app.controller('RestrictedHolidaysController', [
	'$scope', '$timeout', 'utilityService', 'ServerUtilityService', 'RestrictedHolidaysService', 'LeaveSummaryService', 
	function ($scope, $timeout, utilityService, serverUtilityService, service, summaryService) {
        var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);
        $scope.restrictedHolidays = service.buildRestrictedHolidaysObject();
        
        var isSectionMyTeam = function() {
            return $scope.section.dashboard.team;
        };                        
        var buildGetParams = function() {
            var params = {
                permission: null
            };            
            if(isSectionMyTeam()) {
                params.rel_id = $scope.relationship.primary.model._id;
                params.direct_reportee = $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false;
                if(teamOwnerId) {
                    params.emp_id = teamOwnerId;
                }
            }

            return params;
        };        
        var getRestrictedHolidaysList = function() {
            var url = service.getUrl(isSectionMyTeam() ? 'teamRestrictedHolidays' : 'adminRestrictedHolidays');

            serverUtilityService.getWebService(url, buildGetParams())
                .then(function(data) {
                    $scope.restrictedHolidays.list = service.setAdditionalKeysInResponse(utilityService.getValue(data, 'data'), $scope.restrictedHolidays.leaveStatusMapping);
                    $scope.restrictedHolidays.visible = true;
                });
        };
        getRestrictedHolidaysList();   
        $scope.sortBy = function(propertyName) {
            $scope.restrictedHolidays.reverse = ($scope.restrictedHolidays.propertyName === propertyName) 
                ? !$scope.restrictedHolidays.reverse : false;
            $scope.restrictedHolidays.propertyName = propertyName;
        };
        $scope.exportToCsv = function() {
            var filename = isSectionMyTeam() ? 'team-restricted-holidays.csv' : 'admin-restricted-holidays.csv',
                csvData = service.buildCSVData($scope.restrictedHolidays.filteredList);

            $timeout(function () {
                utilityService.exportToCsv(csvData.content, filename);
            }, 1000);            
        }; 
        
        $scope.updatePaginationSettings('holiday');
	}
]);