app.controller('CompensationFormController', [
	'$scope', '$mdDialog', 'utilityService', 'ServerUtilityService', 'CompensationFormService',
	function ($scope, $mdDialog, utilityService, serverUtilityService, service) {

        $scope.forms = service.buildFormObject();   
        $scope.quarter = service.buildQuarterList()     
        var checkEligibilityCallback = function(data) {
            var isEligible = false,
                generated = false;

            angular.forEach($scope.forms.list, function(value, key) {
                var object = utilityService.getValue(data, value.slug);

                if (value.slug === 'form_16') {
                    value.enable = utilityService.getInnerValue(data, 'form_16a', 'is_eligible')
                        || utilityService.getInnerValue(data, 'form_16b', 'is_eligible');

                    value.generated = utilityService.getInnerValue(data, 'form_16a', 'generated')
                        || utilityService.getInnerValue(data, 'form_16b', 'generated');

                    value.message = utilityService.getInnerValue(data, 'form_16a', 'message')
                        || utilityService.getInnerValue(data, 'form_16b', 'message');
                } else {
                    value.enable = utilityService.getValue(object, 'is_eligible', false);
                    value.generated = utilityService.getValue(object, 'generated', false);
                    value.message = utilityService.getValue(object, 'message');
                }                
            });
        };
        var checkFormEligibility = function() {
            var year = parseInt($scope.forms.year, 10),
                url = service.getUrl('formEligibility') + "/" + year + "/" + (year + 1);

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    checkEligibilityCallback(data.data);
                });
        };
        checkFormEligibility();
        var viewDownloadForm16PartABBoth = function (item, action, year) {
            var urlPartA = service.getUrl(item.urlPrefix) + "/" + action + "/" + year + "/" 
                    + (year + 1) + "/A",
                urlPartB = service.getUrl(item.urlPrefix) + "/" + action + "/" + year + "/" 
                    + (year + 1) + "/B";

            $scope.viewDownloadFileUsingForm(urlPartA);
            $scope.viewDownloadFileUsingForm(urlPartB);
        };

        $scope.viewDownloadForm = function (item, action) {
            var year = parseInt($scope.forms.year, 10),
                url = service.getUrl(item.urlPrefix) + "/" + action + "/" + year + "/" 
                    + (year + 1) + "/" + item.type;
            if(item.quarter){
                url = url + '/' + item.quarter
            }

            item.slug === 'form_16' 
                ? viewDownloadForm16PartABBoth(item, action, year)
                : $scope.viewDownloadFileUsingForm(url);
        };
        $scope.changeFinancialYear = function (year) {
            checkFormEligibility();
        };
        var generateFormCallback = function (data, item, event) {
            if (utilityService.getValue(data, 'status') === "success") {
                item.generated = true;
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            } else {
                showAlert(event, utilityService.getValue(data, 'message'));
            }
        };
        $scope.generateForm = function (item, event) {
            var url = service.getUrl(item.generateUrlPrefix) + "/" + item.generate_type,
                payload = service.buildGenerateFormPayload($scope.forms);

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    generateFormCallback(data, item, event);                 
                });
        }; 
        var showAlert = function(ev, textContent) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Alert!')
                    .textContent(textContent)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };       
	}
]);