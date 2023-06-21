app.controller('FlexiPayRequestsAdminController', [
    '$scope', '$routeParams', '$location', '$timeout', '$window', '$route', 'PayrollOverviewService', 'utilityService', 'ServerUtilityService', '$modal', 'EmployeeTaskService', '$filter', '$rootScope', 'FORM_BUILDER',
    function ($scope, $routeParams, $location, $timeout, $window, $route, PayrollOverviewService, utilityService, serverUtilityService, $modal, EmployeeTaskService, $filter, $rootScope, FORM_BUILDER) {
        'use strict';

        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.flexiPay = EmployeeTaskService.buildFlexiPayRequestObj();

        $scope.sortObj = {
            key: null,
            reverse: false
        };

        $scope.flexiPayForms = {
            components: [],
            visible: false
        };

        $scope.sortTable = function(key) {
            $scope.sortObj.reverse = $scope.sortObj.key == key ? !$scope.sortObj.reverse : false;
            $scope.sortObj.key = key;
        };
        $scope.legal_entity = {
            selected: null,
            entity_id: utilityService.getStorageValue("legalEntityId")
        };
        $scope.getLegalEntity = function() {
            if($scope.legal_entity.entity_id) {
                var entities_list = JSON.parse(utilityService.getStorageValue("legalEntityElements"));
                $scope.legal_entity.selected = entities_list.find(function(val) { return val._id == $scope.legal_entity.entity_id; });
            } else {
                $scope.legal_entity.selected = null;
            }
        };
        $scope.getLegalEntity();

        var getAllFlexiPayRequests = function() {
            $scope.flexiPay.requests.visible = false;
            var url = EmployeeTaskService.getUrl('flexiPayRequests');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.flexiPay.requests.list = utilityService.getInnerValue(data, 'data', 'request', []);
                $scope.flexiPay.requests.dynamic_heads = utilityService.getInnerValue(data, 'data', 'component_heads', null);
                $scope.flexiPay.requests.visible = true;
            });
        };
        getAllFlexiPayRequests();

        $scope.viewFlexiForm = function(item) {
            $scope.flexiPayForms.visible = true;
            var url = EmployeeTaskService.getUrl('payrollFlexiPayForms') +"/" + item.request_id;
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.flexiPayForms.components = utilityService.getValue(data, 'data', []);
                angular.forEach($scope.flexiPayForms.components, function(val, key) {
                    EmployeeTaskService.buildQuestionList(utilityService.getInnerValue(val.form_data, 'form_detail', 'questions', []))
                });
                $scope.flexiPayForms.visible = true;
                $scope.openModal('flexi-pay-components-approver-form.tmpl.html', 'flexiPayComponentsApproverForm', 'lg');
            });
        };

        $scope.takeAction = function(item, action) {
            var url = EmployeeTaskService.getUrl('flexiPayRequestApproveReject') +"/" + item.request_id,
                payload = {};
            if(action == 'approve') {
                payload.status = 8;
            }
            if(action == 'reject'){
                payload.status = 9;
            }
            serverUtilityService.postWebService(url, payload).then(function(data) {
                utilityService.showSimpleToast(data.message);
                item.status = payload.status;
            });
        };

        $scope.exportFlexiPayRequests = function() {
            if(!$scope.flexiPay.requests.list.length) { return false; }
            var csvData = EmployeeTaskService.buildFlexiPayRequestsExportData(utilityService.getInnerValue($scope.flexiPay, 'requests', 'list', []), utilityService.getInnerValue($scope.flexiPay, 'requests', 'dynamic_heads', {}));
            var filename = 'flexi_pay_requests';
            if($scope.legal_entity.entity_id) {
                filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
            filename += '.csv';
            utilityService.exportToCsv(csvData, filename);
        };
        
        $scope.downloadAnswerAttachment = function(item) {
            var url = EmployeeTaskService.getUrl('downloadAnswerAttachment')
                + "/" + item._id
                + "/" + $scope.user.loginEmpId;

            $scope.viewDownloadFileUsingForm(url);
        };

        /***** Start Angular Modal Section *****/
        $scope.openModal = function(templateUrl, instance, size) {
            size = size || 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass : 'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };
        /***** End Angular Modal Section *****/

        /**** Start Pagination Section ****/
        $scope.updatePaginationSettings('flexi_pay_requests_admin');
        /**** End Pagination Section ****/
    }
]);