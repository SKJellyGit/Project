app.controller('PreviousEmployerController', [
    '$scope', 'utilityService', 'ServerUtilityService', 'PreviousEmployerService', 
    function ($scope, utilityService, serverUtilityService, previousEmployerService) {
        $scope.tax = {
            previousEmployer: {
                enable: false,
                list: [],
                visible: false,
                selectedIndex: -1
            }
        };
        var addDefaultPreviousEmployerObject = function () {
            $scope.tax.previousEmployer.list.push(previousEmployerService.buildPreviousEmployerModel());
        };
        var previousEmployerDetailsCallback = function (data) {
            $scope.tax.previousEmployer.enable = utilityService.getInnerValue(data, 'data', 'prev_employer_window', false);
            $scope.tax.previousEmployer.list = [];

            angular.forEach(utilityService.getInnerValue(data, 'data', 'prev_employers', []), function (value, key) {
                $scope.tax.previousEmployer.list.push(previousEmployerService.buildPreviousEmployerModel(value));               
            });

            if (!$scope.tax.previousEmployer.list.length) {
                addDefaultPreviousEmployerObject();
            }

            $scope.tax.previousEmployer.visible = true;
        };
        var getPreviousEmployerDetails = function () {
            serverUtilityService.getWebService(previousEmployerService.getUrl('prevEmpDtls'))
                .then(function (data) {
                    previousEmployerDetailsCallback(data);                    
                });
        };
        getPreviousEmployerDetails();
        $scope.updatePreviousEmployerDetails = function (item, index) {
            $scope.tax.previousEmployer.selectedIndex = index;
            $scope.errorMessages = [];
            var url = previousEmployerService.getUrl('prevEmpDtls'), 
                payload = previousEmployerService.buildPreviousEmployerPayload(item);

            if (utilityService.getValue(item, '_id')) {
                url = url + "/" + utilityService.getValue(item, '_id');
            }

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, 'previousEmployer');
                });
        };
        $scope.resetAPIError = function (status, message, api) {
            return utilityService.resetAPIError(status, message, api);
        };
        var successErrorCallback = function (data, tabName) {
            if (data.status === "success") {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Previous Employer Details has been updated successfully'));
                $scope.resetAPIError(false, null, tabName);
                getPreviousEmployerDetails();
            } else {
                $scope.errorMessages = buildError(data);
            }
        };
        var buildError = function (data) {
            var error = []
            if (data.status == "error") {
                error.push(data.message);
            } else if (data.data.status == 'error') {
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            error.push(v);
                        });
                    });
                } else {
                    error.push(data.data.message);
                }
            }
            if(angular.isDefined(data.error)){
                angular.forEach(data.error, function (v, k) {
                    error.push(v);
                });
            }

            if(utilityService.getInnerValue(data, 'data', 'error')) {
                angular.forEach(data.data.error, function (v, k) {
                    error.push(v);
                }); 
            }

            return error;
        }
        $scope.salSum = function (item) {
            item.salary.sal_sum = previousEmployerService.salSum(utilityService.getValue(item, 'salary'));
        };
        $scope.addMore = function () {
            addDefaultPreviousEmployerObject();
        };
        $scope.removeItem = function (index) {
            $scope.tax.previousEmployer.list.splice(index, 1);
        };
    }
]);