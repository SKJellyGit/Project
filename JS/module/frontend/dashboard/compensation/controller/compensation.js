app.controller('CompensationController', [
    '$scope', 'utilityService', 'ServerUtilityService', 'CompensationService', '$modal', '$mdDialog',
    function ($scope, utilityService, serverUtilityService, compensationService, $modal, $mdDialog) {

        $scope.summary = compensationService.buildSummaryObject();
        $scope.currentFinancialYear = utilityService.getCurrentFinancialYear();
        /************* Start CTC Component Section *************/        
        var ctcDetailsCallback = function(data) {
            $scope.summary.ctc.amount = utilityService.getInnerValue(data, 'data', 'amount', 0);
            $scope.summary.ctc.breakup = utilityService.getInnerValue(data, 'data', 'breakup', []);
            $scope.summary.ctc.graph = compensationService.buildCTCComponentGraph(data.data);
            compensationService.toggleGraphVisible($scope.summary, 'ctc', true);
        };
        var getCTCDetails = function() {
            compensationService.resetBreakup($scope.summary, 'ctc');
            compensationService.toggleGraphVisible($scope.summary, 'ctc', false);
            var url = compensationService.getUrl('ctc') + "/" + $scope.summary.ctc.duration._id.$id;

            serverUtilityService.getWebService(url)
                .then(function(data) {
                	ctcDetailsCallback(data);
                });
        };
        var getDurationList = function() {
            serverUtilityService.getWebService(compensationService.getUrl('duration'))
                .then(function(data) {
                    $scope.summary.ctc.durationList = data.data;
                    $scope.summary.ctc.duration = data.data[data.data.length - 1];
                    getCTCDetails();
                });
        };
        getDurationList();                
        /************* End CTC Component Section *************/

        /************* Start Tax Component Section *************/
        var taxDetailsCallback = function(data) {
            $scope.summary.tax.amount = utilityService.getInnerValue(data, 'data', 'total_investments', 0);
            $scope.summary.tax.savings = utilityService.getInnerValue(data, 'data', 'tax_saved', 0); 
            $scope.summary.tax.breakup = utilityService.getInnerValue(data, 'data', 'breakup', []);
            $scope.summary.tax.graph = compensationService.buildTaxComponentGraph(data.data);
            compensationService.toggleGraphVisible($scope.summary, 'tax', true);
        };
        var getTaxDetails = function() {
            compensationService.resetBreakup($scope.summary, 'tax');
            compensationService.toggleGraphVisible($scope.summary, 'tax', false);
            var url = compensationService.getUrl('tax') + "/" 
                + $scope.summary.tax.year + "/" 
                + ($scope.summary.tax.year + 1);
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    taxDetailsCallback(data);
                });
        };
        getTaxDetails();
        $scope.changeFinancialYear = function(section) {
            section === "tax" ? getTaxDetails() : getCTCDetails();
        };
        /************* End Tax Component Section *************/

        /************* Start Account Detail Section *************/
        var resolveValueFields = function(data) {
            angular.forEach(data, function(item){
                if(angular.isArray(item.value)) {
                    if(angular.isDefined(item.element_details) && angular.isDefined(item.element_ids)) {
                        var index = item.element_ids.indexOf(item.value[0]);
                        var value = item.element_details[index].name;
                        item.value = value;
                    } else {
                        item.value = '';
                    }
                }
            });
            return data;
        }
        var getSalaryDetails = function() {
            $scope.summary.account.details = [];
            serverUtilityService.getWebService(compensationService.getUrl('account'))
                .then(function(data) {
                    $scope.summary.account.segmentId = data.data.segement_id;
                	$scope.summary.account.details = resolveValueFields(data.data.details);
                });
        };
        getSalaryDetails();
        $scope.editAccountDetails = function() {
            angular.copy($scope.summary.account.details, $scope.summary.account.cpdetails);
            toggleModal('account-details', true);
        };
        $scope.updateAccountDetails = function() {
            console.log($scope.summary.account.cpdetails);
            var url = compensationService.getUrl('account') + "/" + $scope.summary.account.segmentId,
                payload = $scope.summary.account.cpdetails;
            
            serverUtilityService.getWebService(url, payload)
                .then(function(data) {
                    toggleModal('account-details', false);
                    utilityService.showSimpleToast("Your request has been sent for approval");
                });            
        };
        var toggleModal = function(id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false, 
                    show: true
                }) 
                : $('#' + id).modal('hide');
        };

        /************* End Account Detail Section *************/
        $scope.openModal = function(templateUrl, instance, size) {
            size = angular.isDefined(size) ? size : 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl : templateUrl,
                scope : $scope,
                windowClass : 'fadeEffect',
                size: size,
                backdrop: 'static',
                keyboard: false
            });
        };

        $scope.calculateEmployeeRegime = function (id) {
            var url = compensationService.getUrl('getEmployeeTaxRegime')
            serverUtilityService.getWebService(url).then(function (data) {
                if (data.status === "error") {
                    showAlert(event, data.message);
                } else {
                    $scope.regimeTax = data.data;
                    $scope.openModal('calculateRegime-Employee.tmpl.html', 'calculateEmployeeRegimeTmpl', 'lg');
                }
            });
        };

        if (utilityService.getStorageValue('employeeCurrency')) {
            var styleElem = document.head.appendChild(document.createElement("style"));
            styleElem.innerHTML = ".fa-inr:before {content: '" + utilityService.getStorageValue('employeeCurrency') + "' !important;}";
        }

        var showAlert = function (ev, textContent, title) {
            title = angular.isDefined(title) ? title : 'Alert!';
            $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(textContent)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev));
        };
    }

]);