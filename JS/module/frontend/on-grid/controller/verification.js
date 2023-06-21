app.controller('AdminOnGridController', [
    '$scope', '$modal', '$mdDialog', '$timeout', '$q', 'AdminOnGridService', 'utilityService', 'ServerUtilityService', '$window',
    function ($scope, $modal, $mdDialog, $timeout, $q, service, utilityService, serverUtilityService, $window) {
        $scope.ongrid = service.buildOnGridObject();
        $scope.updatePaginationSettings('employee_verification_listing');        
                
        var masterVerificationCallback = function (data) {
            $scope.ongrid.master.verifications = service.changeArrayToObject(utilityService.getValue(data, 'data', []));
        };
        var employeesVerificationCallback = function (data) {
            $scope.ongrid.verification.list = utilityService.getValue(data, 'data', []);
            $scope.ongrid.verification.visible = true;
        };
        var getVerificationDetails = function () {
            $q.all([
                serverUtilityService.getWebService(service.getUrl('types')),
                serverUtilityService.getWebService(service.getUrl('list'))
            ]).then(function(data) {
                masterVerificationCallback(data[0]);
                employeesVerificationCallback(data[1]);
            });
        };
        getVerificationDetails();

        $scope.exportToCsv = function() {
            var csvData = service.buildEmployeeVerificationCsvData($scope.ongrid);
                filename = 'employee-verification-list.csv';
            
            $timeout(function () {
                utilityService.exportToCsv(csvData.content, filename);
            }, 200);            
        }; 
        $scope.displayErrorMessage = function (item) {
            $scope.ongrid.errors = utilityService.getValue(item, 'errors', []);
            $scope.openModal('comment', 'ongrid-verification-error.tmpl.html', 'md')
        };

        /**** Start: Dialog Box Section *****/
        var showConfirmDialog = function(event, functionName, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Delete Request?')
                .textContent('Do you really want to delete this request')
                .ariaLabel('Lucky day')
                .targetEvent(event)
                .ok('Please do it!')
                .cancel('No, want to cancel');

            $mdDialog.show(confirm).then(function() {
                functionName(event, item);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function(event, functionName, item) {
            showConfirmDialog(event, functionName, item);
        };
        var showAlert = function(ev, title, message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
        $scope.showAlert = function (ev, title, message) {
            showAlert(ev, title, message);
        };
        /**** End: Dialog Box Section *****/

        /***** Start: AngularJS Modal *****/
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                size: size,
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function (instance) {
            if($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].dismiss();                
            }
        };
        /****** End: AngularJS Modal ******/  
        
        $scope.exportEmployeeGrid = function (emp) {
            console.log(emp);
            var url = service.getUrl('downloadOngridReport') + "/" + emp.employee_id + "?access_token=" 
            + utilityService.getStorageValue("accessToken");

            $window.open(url);            
        };

        $scope.verificationMessage = {};
        $scope.handleVerification = function(key, verification, reqid) {
            console.log(key, verification, reqid);
            try {
                if(verification.status == 7 || verification.status == 5) {
                    $scope.verificationMessage = {
                        message : verification,
                        req_id : reqid,
                        key : key
                    };
                    $scope.openModal('ongridMessage', 'ongrid-verification-message.tmpl.html', 'md')
                }    
            } catch (error) {
                
            }
        }

        $scope.handleVerificationMessage = function(verification) {
            var url = service.getUrl('verificationRequest') + "/" + $scope.verificationMessage.req_id + "/" + $scope.verificationMessage.key;
            serverUtilityService.getWebService(url).then(function(data) {
                saveSuccessErrorCallback(data); 
            });
        }

        $scope.showConfirm = function(ev, verification) {
            console.log(verification);
            var confirm = $mdDialog.confirm()
              .title('Please note that your previous submission was rejected due to the reason:' + verification.message.reason)
              .textContent('Kindly make sure that the correction of the details has been met, before initiating the re-submission of detail(s).')
              .ariaLabel('Alert')
              .targetEvent(ev)
              .ok('Re-submit')
              .cancel('Cancel');
        
            $mdDialog.show(confirm).then(function () {
                $scope.handleVerificationMessage(verification)
            }, function () {
              //$scope.status = 'You decided to keep your debt.';
            });
        };

        $scope.errorMessages = [];
        var saveSuccessErrorCallback = function(data){
            if(data.status === "success") {
                utilityService.showSimpleToast(data.message);
                getVerificationDetails();
                $scope.closeModal('ongridMessage')
            } else if(data.status === "error") {
                 $scope.errorMessages.push(data.message);
            } else if(data.data.status === "error") {
                $scope.errorMessages = [];    
                utilityService.resetAPIError(true, "Something went wrong");
                angular.forEach(data.data.message, function(value, key){
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
    }
]);