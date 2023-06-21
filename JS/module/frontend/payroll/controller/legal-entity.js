app.controller('PayrollLegalEntityController', [
    '$scope', '$modal', '$timeout', '$location', 'utilityService', 'ServerUtilityService', 'PayrollLegalEntityService',
    function ($scope, $modal, $timeout, $location, utilityService, serverUtilityService, service) {
        var verifyLegalEntityCallback = function (data) {
            if (utilityService.getValue(data, 'status') === 'success') {
                var currency = utilityService.getInnerValue(data.data, 'currency', 'symbol_native');
                if(currency) {
                    var styleElem = document.head.appendChild(document.createElement("style"));
                    styleElem.innerHTML = ".fa-inr:before {content: '" + currency + "' !important;}";
                }
                $scope.closeModal('payrollLegalEntity');
                var currency = utilityService.getValue(data, 'data')
                if(currency){
                    utilityService.setStorageValue("legalCurrencysymbol", utilityService.getInnerValue(data.data, 'currency', 'symbol_native'));

                    utilityService.setStorageValue("legalCurrency", utilityService.getInnerValue(data.data, 'currency', 'code'));
                }else{
                    utilityService.setStorageValue("legalCurrency", null);
                }

                $timeout(function () {
                    utilityService.setStorageValue("legalEntityId", $scope.wrapperObject.legalEntity.selected);
                    $scope.wrapperObject.legalEntity.id = utilityService.getStorageValue("legalEntityId");
                }, 200);                
            } else {
                console.log('error need to handle');
            }
        };
        if(utilityService.getStorageValue("legalCurrencysymbol")){
            var styleElem = document.head.appendChild(document.createElement("style"));
            styleElem.innerHTML = ".fa-inr:before {content: '" + utilityService.getStorageValue("legalCurrencysymbol") + "' !important;}";
        }
        $scope.verifyLegalEntity = function () {
            if (utilityService.getInnerValue($scope.wrapperObject, 'legalEntity', 'id')) {
                $scope.wrapperObject.legalEntity.id = null;
            }

            if($scope.wrapperObject.legalEntity.selected === '5feda7a54e7e6ec75b5ced0e'){
                utilityService.setStorageValue("hasUAELegalEntity", true);
            }else{
               utilityService.setStorageValue('hasUAELegalEntity', false);
            }

            var url = service.getUrl('verify'),
                payload = service.buildVerifyLegalEntityPayload($scope.wrapperObject.legalEntity);

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    verifyLegalEntityCallback(data);                 
                });
        };
        $scope.changeLegalEntityHandler = function () {
            $scope.wrapperObject.legalEntity.selected = utilityService.getStorageValue("legalEntityId");;
            $scope.openModal('payroll-legal-entity.tmpl.html', 'payrollLegalEntity');
        };
        $scope.renderLegalEntityName = function () {
            var entityName = null;

            angular.forEach($scope.wrapperObject.legalEntity.list, function (value, key) {
                if (utilityService.getValue(value, '_id') == utilityService.getInnerValue($scope.wrapperObject, 'legalEntity', 'id')) {
                    entityName = value.name;
                }
            });

            return entityName;
        };
        $scope.navigateToHomePage = function () {
            $scope.closeModal('payrollLegalEntity');
            $timeout(function () {
                $location.url('/');
            }, 200);
        };

        /********* Start Angular Modal Section *********/
        $scope.openModal = function(templateUrl, instance) {
            $scope.modalInstance[instance] = $modal.open({
                templateUrl : templateUrl,
                scope : $scope,
                windowClass: 'fadeEffect',
                backdrop: 'static',
                keyboard: false,
                size: 'lg'
            });
        };
        $scope.closeModal = function (instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        /********* End Angular Modal Section *********/

        /* console.log($scope.wrapperObject.legalEntity.enabled,
            $scope.wrapperObject.isPayrollAdminSection, !$scope.wrapperObject.legalEntity.id); */

        // Call this only if legal entity enabled, visited section is payorll admin 
        // and Payroll admin has not selected any legal entity yet! 
        if ($scope.wrapperObject.legalEntity.enabled
            && $scope.wrapperObject.isPayrollAdminSection 
            && !$scope.wrapperObject.legalEntity.id
            && $scope.wrapperObject.legalEntity.list.length) {            
            $scope.openModal('payroll-legal-entity.tmpl.html', 'payrollLegalEntity');
        }
    }
]);