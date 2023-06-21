app.controller('NhmAdminConfirmationFlowController', [
    '$scope', '$q', '$modal', '$mdDialog', 'NhmAdminConfirmationFlowService', 'utilityService', 'ServerUtilityService', 'FORM_BUILDER', 
    function ($scope, $q, $modal, $mdDialog, service, utilityService, serverUtilityService, FORM_BUILDER) {
        'use strict';
        
        $scope.updatePaginationSettings('nhm_confirmation_flow_page');
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.confirmationFlow = {
            requests: {
                list: [],
                visible: false
            }
        };
        $scope.sortTable = {
            key: null,
            reverse: false,
            setKey: function(key) {
                if(key != $scope.sortTable.key) {
                    $scope.sortTable.key = key;
                    $scope.sortTable.reverse = false;
                } else {
                    $scope.sortTable.reverse = !$scope.sortTable.reverse;
                }
            }
        };
        $scope.resetAllTypeFilters();
        var allFilterObject = [{
            countObject: 'group',
            isGroup: true,
            collection_key: 'employee_preview'
        }];
        var getAllConfirmationRequests  = function() {
            $scope.confirmationFlow.requests.visible = false;
            var url = service.getUrl('confirmationRequests');
            serverUtilityService.getWebService(url).then(function (data) {

                $scope.confirmationFlow.requests.list = utilityService.getValue(data, 'data', []);
                angular.forEach($scope.confirmationFlow.requests.list, function(val, key) {
                    $scope.calculateFacadeCountOfAllFilters($scope.confirmationFlow.requests.list, allFilterObject, val);
                });
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                $scope.confirmationFlow.requests.visible = true;
            });
        };
        getAllConfirmationRequests();

        /***** Start: AngularJS Modal *****/
        $scope.openModal = function(instance, templateUrl, size) {
            size = size ? size : 'md'
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope:$scope,
                windowClass:'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            $scope.modalInstance[instance].close();
            if(instance == 'requestApproveFormQuestion') {
                $scope.requestApproveForm.approverChain = null;
            }
        };
        /***** End: AngularJS Modal *****/

        /***** Start: Emp Appr Form Action ******/
        $scope.requestApproveForm = {
            empForm: service.buildFormObject(),
            apprForm: service.buildFormObject(),
            viewMode: 'admin'
        };
        $scope.getEmpApprForm = function(item) {
            var requestArray = [
                serverUtilityService.getWebService(service.getUrl('nhmConfEmpForm') +"/" + item._id),
                serverUtilityService.getWebService(service.getUrl('nhmConfApprForm') +"/" + item._id)
            ];
            $q.all(requestArray).then(function(data) {
                $scope.requestApproveForm.empForm = service.buildFormObject(utilityService.getInnerValue(data[0], 'data', 'form_detail'));
                $scope.requestApproveForm.apprForm = service.buildFormObject(utilityService.getInnerValue(data[1], 'data', 'form_detail'));
                $scope.requestApproveForm.approverChain = utilityService.getInnerValue(data[0], 'data', 'approver_chain');
                if($scope.requestApproveForm.empForm.name || $scope.requestApproveForm.apprForm.name) {
                    $scope.openModal('requestApproveFormQuestion', 'request-approve-form-question-tmpl.html', 'lg');
                }
            });
        };
        /***** End: Emp Appr Form Action ******/

        /***** Start: Send Reminder Section *****/
        $scope.sendReminder = function (event, item, notifyTo) {
            console.log(item);
            console.log(notifyTo);

            var url = service.getUrl('notifyTo'),
                payload = service.buildSendReminderPayload(item, notifyTo);

            console.log(url);
            console.log(payload);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    utilityService.getValue(data, 'status') === 'success'
                        ? utilityService.showSimpleToast(utilityService.getValue(data, 'message'))
                        : showAlert(event, 'There is some error in sending reminder');
                }, function (error) {
                    console.log(error);
                });
        };
        /***** End: Send Reminder Section *****/

        /***** Start: Show Alert Section *****/
        var showAlert = function(ev, message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Alert!')
                    .textContent(message)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
        /***** End: Show Alert Section *****/
    }
]);