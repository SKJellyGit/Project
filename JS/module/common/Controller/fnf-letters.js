app.controller('FnfLettersController', [
    '$scope', '$routeParams', '$modal', '$window', 'FnfLettersService', 'CompensationFormService', 'utilityService', 'ServerUtilityService',  
    function ($scope, $routeParams, $modal, $window, service, formService, utilityService, serverUtilityService) {
        'use strict';
        $scope.linkToken = service.buildLinkTokenObject($routeParams);
        $scope.myPay = service.buildMyPayObject();
        $scope.forms = formService.buildFormObject();
        $scope.getRunPayrollAutomation();
        
        /***** Start Letters Section *****/
        var employeeLettersCallback = function (data) {
            $scope.linkToken.letters = utilityService.getInnerValue(data, 'data', 'letters');
            $scope.linkToken.employee_preview = utilityService.getInnerValue(data, 'data', 'employee_preview');
            $scope.linkToken.joiningDateObject = service.extractAndAssignJoiningMonthYear(utilityService.getInnerValue($scope.linkToken, 'employee_preview', 'work_profile_joining_date'));
            $scope.linkToken.relievingDateObject = service.extractAndAssignRelievingMonthYear(utilityService.getInnerValue($scope.linkToken, 'employee_preview', 'system_plan_last_working_date'), $scope.linkToken.monthReverseMapping);
            $scope.myPay.fnfInitiatedId = utilityService.getInnerValue(data, 'data', 'initiate_id');
            service.setFormSectionAdditionalKeys($scope.forms.list);
            $scope.linkToken.visible = true;
        };
        var getEmployeeLetters = function () {
            var url = service.getUrl('letters') + "/" + utilityService.getValue($scope.linkToken, 'token');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    employeeLettersCallback(data); 
                });
        };
        $scope.downloadLetter = function (letter) {
            var letterId = angular.isObject(letter._id) ? letter._id.$id : letter._id,
                url = service.getUrl('downloadLetter') + '/' + letterId + "/" 
                    + utilityService.getValue($scope.linkToken, 'token');

            $window.open(url);
        };        
        /***** End Letters Section *****/

        /***** Start Slip Section *****/        
        $scope.viewDownloadFile = function(action) {
            var url = service.getUrl('slip') + "/" + $scope.myPay.slip.year + "/" 
                + $scope.myPay.slip.month + "/" + $scope.myPay.slip.type + "/" + action+ "/" 
                + utilityService.getValue($scope.linkToken, 'token');

            $scope.viewDownloadFileUsingForm(url);       
        };
        $scope.viewDownloadSlipFile = function (action) {
            var url = service.getUrl('slip') + "/" + $scope.linkToken.relievingDateObject.year + "/"
                    + $scope.linkToken.relievingDateObject.month + "/" + $scope.myPay.slip.type + "/" + action + "/"
                    + utilityService.getValue($scope.linkToken, 'token');
            if (!$scope.runFnfAutomate.enabled) {
                var certificateType = null;
                if ($scope.myPay.slip.type == 2) {
                    certificateType = 3;
                } else if ($scope.myPay.slip.type == 4) {
                    certificateType = 1;
                } else {
                    return false;
                }
                url = service.getUrl('slipManual') + "/" + $scope.myPay.fnfInitiatedId + "/" + certificateType;
            }

            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.changeSlipYear = function(form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.myPay.slip.month = null;
        };
        var getSlipStatus = function() {
            var url = service.getUrl('slipStatus') + "/" + $scope.myPay.slip.year + "/" 
                + $scope.myPay.slip.month + "/" + $scope.myPay.slip.type + "/" 
                + utilityService.getValue($scope.linkToken, 'token');
            
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.myPay.slip.enable = utilityService.getValue(data, 'status') == 'success';
                    $scope.myPay.slip.message = utilityService.getValue(data, 'message');
                });
        };
        $scope.changeSlipMonth = function() {
            if ($scope.myPay.slip.type == 3 && $scope.myPay.slip.year == 2019 
                && ($scope.myPay.slip.month == 4 || $scope.myPay.slip.month == 5)) {
                $scope.myPay.slip.enable = true;
                $scope.myPay.slip.message = null;
            } else {
                getSlipStatus();
            }            
        };
        $scope.changeSlipTypeHandler = function (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.myPay.slip.year = null;
            $scope.myPay.slip.month = null;
            $scope.myPay.slip.message = null;
            $scope.myPay.slip.enable = false;
        };
        $scope.isSalarySlipMonthVisibleOld = function(index, year, monthStartDay) {
            var isVisible = false,
                currYear = utilityService.getCurrentYear(),
                currMonth = utilityService.getCurrentMonth(),
                currDay = utilityService.getCurrentDay();

            monthStartDay = monthStartDay || utilityService.payrollProcessingDay;
            year = year || $scope.myPay.slip.year;

            if(year >= currYear) {
                if (index < currMonth 
                    || (index == currMonth && currDay >= monthStartDay)) {
                    isVisible = true;
                }            
            } else {
                if(year == utilityService.startYear) {
                    isVisible = index >= utilityService.startMonth;                 
                } else { 
                    isVisible = true;
                }               
            }
            
            return isVisible;
        };
        $scope.isSalarySlipMonthVisible = function(month, year, monthStartDay) {
            var isVisible = false;

            monthStartDay = monthStartDay || utilityService.getInnerValue($scope.linkToken, 'joiningDateObject', 'date');
            year = year || $scope.myPay.slip.year;

            if (year == utilityService.getInnerValue($scope.linkToken, 'joiningDateObject', 'year')) {
                isVisible = month >= utilityService.getInnerValue($scope.linkToken, 'joiningDateObject', 'month');             
            } else if(year == utilityService.getInnerValue($scope.linkToken, 'relievingDateObject', 'year')) {
                isVisible = month <= utilityService.getInnerValue($scope.linkToken, 'relievingDateObject', 'month');
            } else {
                isVisible = true;
            }
            
            return isVisible;
        };
        $scope.isSalarySlipYearVisible = function(year) {
            return year >= utilityService.getInnerValue($scope.linkToken, 'joiningDateObject', 'year')  
                && year <= utilityService.getInnerValue($scope.linkToken, 'relievingDateObject', 'year');
        };
        /***** End Slip Section *****/
       
        /***** Start Validate Link Token Section *****/
        var validateLinkTokenCallback = function (data) {
            $scope.linkToken.valid = utilityService.getValue(data, 'status') === "success";
            $scope.linkToken.message = utilityService.getValue(data, 'message');            
            if ($scope.linkToken.valid) {
                getEmployeeLetters();
            } else {
                $scope.linkToken.visible = true;
            }
        };
        var validateLinkToken = function() {
            var url = service.getUrl('validateToken') + "/" + $scope.linkToken.token;
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    validateLinkTokenCallback(data);
                });
        };
        validateLinkToken();
        /***** End Validate Link Token Section *****/

        /***** Start: AngularJS Modal Section *****/
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                backdrop: 'static',
                keyboard: false,
                size: size
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };
        /***** End: AngularJS Modal Section *****/
    }
]);