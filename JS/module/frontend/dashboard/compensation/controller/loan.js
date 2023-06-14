app.controller('LoanController', [
	'$scope', '$q', '$routeParams', '$modal', '$mdDialog', '$location', 'utilityService', 'ServerUtilityService', 'LoanService',  
	function ($scope, $q, $routeParams, $modal, $mdDialog, $location, utilityService, serverUtilityService, loanService) {

        $scope.loan = {
            types: [],
            list: [],
            request: null,
            typeMap: {},
            requestId: utilityService.getValue($routeParams, 'requestId'),
            isAction: utilityService.getValue($routeParams, 'isAction',false),
            visible: false
        };
        $scope.reqFields = null;
        $scope.dataCheck = null;
        $scope.viewType = 2;
        $scope.editFlag = false;
        $scope.accountStatus = {
            1: 'Pending',
            3: 'Approved',
            8: 'Admin Approved',
            10: 'Approver Approved',
            11: 'Approver Reject',
            9: 'Admin Reject',
            17: 'Disbursed'
        };
        $scope.salaryAdvance = {
            list: [],
            visible: false,
            approveReject: {
                action: null,
                comment: null
            }
        };
        var syncLoanAdvanceModel = function (model) {
            $scope.loan.request = loanService.buildRequestModel(model);
        };
        syncLoanAdvanceModel();
        var buildLoanTypeMap = function(data) {
            angular.forEach(data, function(value, key) {
                $scope.loan.typeMap[value._id] = value.name;
            });
        };
        var buildLoanList = function(data) {
            angular.forEach(data, function(value, key) {
                value.name = $scope.loan.typeMap[value.loan_type];
            });
        };
        var allRequestCallback = function(data) {
            buildLoanTypeMap(data[0].data);
            buildLoanList(data[1].data);
            $scope.loan.types = data[0].data;
            $scope.loan.list = data[1].data;
            $scope.salaryAdvance.list = data[2].data;
            $scope.loan.visible = true;
            $scope.salaryAdvance.visible = true;
        };
        var getAllRequest = function () {
            $scope.loan.visible = false;
            $scope.salaryAdvance.visible = false;
            var requestUrl = loanService.getUrl('getRequest');
            $q.all([
                serverUtilityService.getWebService(loanService.getUrl('getLoanType')),
                serverUtilityService.getWebService(requestUrl + "/1"),
                serverUtilityService.getWebService(requestUrl + "/2")
            ]).then(function (data) {
                allRequestCallback(data);
            });
        };
        getAllRequest();
        var getIndividualRequests = function () {
            $q.all([
                serverUtilityService.getWebService(loanService.getUrl('getLoanType')),
                serverUtilityService.getWebService(loanService.getUrl('viewDetail') + "/" + $scope.loan.requestId),
                serverUtilityService.getWebService(loanService.getUrl('approveRejectCheck') + "/" + $scope.loan.requestId),
            ]).then(function (data) {
                buildLoanTypeMap(data[0].data);
                $scope.detailview = data[1].data;
                $scope.approveRejectCheck = data[2].data;
            });
        };
        if ($scope.loan.requestId) {
            getIndividualRequests();
        }
        var successCallback = function (data, list, section, isAdded) {
            utilityService.resetAPIError(false, null, section);
            if (angular.isDefined(data.data)) {
                utilityService.showSimpleToast(data.message);
                $scope.closePopup('loanReq');
                isAdded ? list.unshift(data.data) 
                    : utilityService.refreshList(list, data.data);
                buildLoanList(list);
            }
        };
        var errorCallback = function (data, section) {
            $scope.errorMessages = [];
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        var successErrorCallback = function (data, list, section, isAdded) {
            section = angular.isDefined(section) ? section : "loanAdvance";
            isAdded = angular.isDefined(isAdded) ? isAdded : false;
            data.status === "success" ? successCallback(data, list, section, isAdded)
                : errorCallback(data, section);
        };        
        //add new request 
        $scope.addNewRequest = function() {
            $scope.formSubmitHandler('advanceRequest', true);
            var url = loanService.getUrl('newRequest'),
                payload = $scope.loan.request;

            payload.request_from = 1;
            serverUtilityService.postWebService(url,payload)
                .then(function (data) {
                    $scope.formSubmitHandler('advanceRequest', false);
                    $scope.getFormDetails();
                    $scope.loan.request.request_type == 1 
                        ? successErrorCallback(data, $scope.loan.list, "loan", true) 
                        : successErrorCallback(data, $scope.salaryAdvance.list, "loan", true);
                });            
        };        
        //update request
        $scope.updateRequest = function() {
            $scope.formSubmitHandler('advanceRequest', true);
            var url = loanService.getUrl('newRequest') + "/" + $scope.loan.request._id,
                payload = $scope.loan.request;

            payload.request_from = 1;
            serverUtilityService.putWebService(url,payload)
                .then(function (data) {
                    $scope.formSubmitHandler('advanceRequest', false); 
                    $scope.getFormDetails();
                    $scope.loan.request.request_type == 1 
                        ? successErrorCallback(data, $scope.loan.list, "loan", false) 
                        : successErrorCallback(data, $scope.salaryAdvance.list, "loan", false);
                });  
        };         
        //change view for loan and salary advance
        $scope.changeView = function(type) {
            $scope.loan.visible = false;
            $scope.salaryAdvance.visible = false;
            $timeout(function() {
                if(type == 1) {
                    $scope.loan.visible = true;
                } else {
                    $scope.salaryAdvance.visible = true;
                }
                $scope.viewType = type;
            }, 500);
        };
        //Approver chain
        var approverChainCallback = function(data, item) {
            $scope.reqFields = data.data;
            item = angular.isDefined(item) ? item: null;
            syncLoanAdvanceModel(item);            
            toggleModal('add-request', true);
        };
        $scope.getFormDetails = function(item) {
            var reqType = angular.isDefined(item) ? item : 2;
            serverUtilityService.getWebService(loanService.getUrl('formDetails')+"/"+reqType)
                .then(function (data){
                    $scope.reqFields = data.data;
                });           
        }; 
        $scope.getFormDetails();
        //Edit Loan/Salary Advance Request
        $scope.editLoanRequest = function (item){
            $scope.editFlag = true;
            syncLoanAdvanceModel(item);
           $scope.newLoanRequest(); 
        };
        $scope.loanRequest = function (){
          $scope.editFlag = false;
          syncLoanAdvanceModel();
          $scope.newLoanRequest();
        };
        $scope.newLoanRequest = function() {
            $scope.modalInstance['loanReq'] = $modal.open({
                templateUrl: 'loanReq.html',
                scope:$scope,
                size:'sl',
                windowClass:'fadeEffect'
            });  
        };
        $scope.closePopup = function (instance){
          $scope.modalInstance[instance].dismiss();  
        };
        //Delete Loan/Salary Advance Request
        $scope.deleteRequest = function(item) {
            var url = loanService.getUrl('deleteLoanType') + "/" + item._id;

            serverUtilityService.deleteWebService(url)
                .then(function(data) {
                    if(item.request_type == 1) {
                        $scope.loan.list = utilityService.deleteCallback(data, item, $scope.loan.list);
                    } else {
                        $scope.salaryAdvance.list = utilityService.deleteCallback(data, item, $scope.salaryAdvance.list);
                        $scope.getFormDetails();
                    }                    
                    utilityService.showSimpleToast(data.message);
                });
        };     
        //Update Account Status
        $scope.updateStatus = function(item,status){
            var url = loanService.getUrl('updateStatus') + "/" + item._id,
                payload = {
                    status: status
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data){
                    successErrorCallback(data);
                    getAllRequest();
                });
        };
        //For Modal Box
        var toggleModal = function(id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false, 
                    show: true
                }) 
                : $('#' + id).modal('hide');
        };        
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        //view details
        $scope.viewDetails = function(item){
            $location.url('loan-details').search({'requestId': item._id});
        };
        $scope.goBack = function () {
            $location.url('/dashboard/compensation').search({linkTab: 'salary-advance'});
        };
        var approveRejectCallback = function (data, event) {
            $scope.closeModal('comment');
            if (utilityService.getValue(data, 'status') === 'success') {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                $location.url('dashboard');
            } else {
                showAlert(event, utilityService.getValue(data, 'message'));
            }
        };
        $scope.approveRejectRequest = function (event, action) {
            var url = loanService.getUrl('action') + "/" + $scope.approveRejectCheck._id.$id,
                payload = {
                    status: utilityService.getValue($scope.salaryAdvance, 'action', action),
                    comment: utilityService.getValue($scope.salaryAdvance, 'comment')
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {                    
                    approveRejectCallback(data, event);                
                });
        };
        $scope.addApproveRejectComment = function (action) {
            $scope.salaryAdvance.action = action;
            $scope.salaryAdvance.comment = null;
            $scope.openModal('add-approve-reject-comment.tmpl.html', 'comment', 'sm');
        };
        
        /***** Start: View Approver Chain Section *****/
        $scope.apporverChain = {
            list: [],
            visible: false,
            statusMapping: utilityService.buildApproverStatusHashMap()
        };
        $scope.viewApporverChain = function (item) {
            var requestId = angular.isObject(item._id) ? item._id.$id : item._id,
                url = loanService.getUrl('approverChain') + "/" + requestId;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.apporverChain.list = utilityService.getInnerValue(data, 'data', 'approver_chain', []);
                    $scope.apporverChain.visible = true;
                    $scope.openModal('view-approver-chain.tmpl.html', 'approverChain', 'md');
                });
        };
        /***** End: View Approver Chain Section *****/

        /**** Start: Angular Modal Section *****/
        $scope.openModal = function (templateUrl, instance, size) {
            size = angular.isDefined(size) ? size : 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass:'fadeEffect',
                size: size,
                keyboard: false
            });
        };        
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };
        /**** End: Angular Modal Section *****/

        /***** Start: MdDialog Section *****/
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
        /***** End: MdDialog Section *****/
	}
]);