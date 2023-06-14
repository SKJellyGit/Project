app.controller('CompensationTemplatesController', [
	'$scope', 'utilityService', 'ServerUtilityService', 'CompensationTemplatesService',
	function ($scope, utilityService, serverUtilityService, service) {

        $scope.templates = service.buildTemplatesObject();
        
        var checkEligibilityCallback = function(data) {
            angular.forEach($scope.templates.list, function(value, key) {
                var object = utilityService.getValue(data, value.slug);
                value.enable = utilityService.getValue(object, 'is_eligible', false);
                value.generated = utilityService.getValue(object, 'generated', false);
                value.message = utilityService.getValue(object, 'message');
            });
        };
        var checkEligibility = function() {
            checkEligibilityCallback(service.buildEligibilityObject());
        };
        checkEligibility();

        $scope.viewDownloadTemplate = function (item, action) {
            //item.urlPrefix
            var url = service.getUrl('downloadTemplate') + "/" + item.slug;

            console.log(url);

            $scope.viewDownloadFileUsingForm(url);
        };                
	}
]);