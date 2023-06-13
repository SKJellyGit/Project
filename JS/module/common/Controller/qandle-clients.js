app.controller('QandleClientController',
    ['$scope', 'QandleClientService', 'ServerUtilityService','$routeParams','utilityService', '$modal', '$mdDialog', 'communicationService',
    function ($scope, service, ServerUtilityService,$routeParams,utilityService, $modal, $mdDialog, communicationService) {

        $scope.qandleClients = service.buildQandleCompanyModel();
        $scope.tinymceOptions = service.buildTinyMceOptionsObject();

        $scope.currentDate = new Date();

        $scope.qandleClientFilter = {
            filter : service.buildCompanyFilter(),
            selectedFilter : null,
            fromDate : null,
            toDate : null,
            filtertype : service.buildCompanyFilterType(),
            selectedType : 'all'
        }

        $scope.usersList = [];
        $scope.notifyText = "";

        var getNotifyText = function(flag){
            var url = service.getUrl('notifyTextUrl');
            ServerUtilityService.getWebService(url).then(function (data) { 
                $scope.notifyText = data.data;
            });
        }

        getNotifyText();


        $scope.addclintedetails = function() {
            $scope.qandleClients.modal = service.buildQandleCompanyModel();
            $scope.qandleClients.modal.notify_text = $scope.notifyText; 
            $scope.openModal('qandleClient', 'qandle-client-details.tmpl.html')
        }

        var unixTimeStamp = function(date) {
            return Math.floor(date.getTime() / 1000)
        }

        var clientDetailView = function(data) {
            angular.forEach(data, function (v, k) {
                v.notify_from  = moment.unix(v.notify_from).format("DD-MM-YYYY");
                v.block_on  = moment.unix(v.block_on).format("DD-MM-YYYY");
                v.last_paid_on  = moment.unix(v.last_paid_on).format("DD-MM-YYYY");
                v.last_inovice_raised  = moment.unix(v.last_inovice_raised).format("DD-MM-YYYY");
                v.paid_till  = moment.unix(v.paid_till).format("DD-MM-YYYY");
                v.invoice_shared_on  = moment.unix(v.invoice_shared_on).format("DD-MM-YYYY");
                v.payment_due_date  = moment.unix(v.payment_due_date).format("DD-MM-YYYY"); 
            });
            return data;
        }

        var getclientsdetails = function(flag){
            $scope.qandleClients.list = [];
            var url = service.getUrl('qandleClients');
            ServerUtilityService.getWebService(url).then(function (data) { 
                if(data.data) { 
                    $scope.qandleClients.list = clientDetailView(data.data); 
                    $scope.qandleClients.visible = true;
                }
                if(flag){ $scope.closeModal('qandleClient')}
            });
        }
        getclientsdetails()

        var saveUpdateclientsdetailsCallback = function (data) {
            if (utilityService.getValue(data, 'status') == "success") {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                getclientsdetails(true)
            } else {
                var message = utilityService.getValue(data.data, 'message')
                var errorMessage=[]
                if ((typeof data.data.message) == "object"){
                    angular.forEach(data.data.message, function (value, key) {
                        errorMessage.push(value[0]);
                    });
                    errorMessage=errorMessage.join(', ')
                }else{
                    errorMessage = data.data.message
                }
                showAlert('Save Record',errorMessage );
            }
        };

        $scope.saveUpdateclientsdetails= function(){
            var url = service.getUrl('qandleClients');
            var payload = angular.copy($scope.qandleClients.modal);
            payload.block_on = (payload.block_on != null) ? utilityService.convertDateFormatToUnixTimeStamp(new Date($scope.qandleClients.modal.block_on)) : null;
            payload.notify_from = (payload.notify_from != null) ? utilityService.convertDateFormatToUnixTimeStamp(new Date($scope.qandleClients.modal.notify_from)) : null;
            payload.last_paid_on = (payload.last_paid_on != null) ? utilityService.convertDateFormatToUnixTimeStamp(new Date($scope.qandleClients.modal.last_paid_on)) : null;
            payload.last_inovice_raised = (payload.last_inovice_raised != null) ? utilityService.convertDateFormatToUnixTimeStamp(new Date($scope.qandleClients.modal.last_inovice_raised)) : null;
            payload.paid_till = (payload.paid_till != null) ? utilityService.convertDateFormatToUnixTimeStamp(new Date($scope.qandleClients.modal.paid_till)) : null;
            payload.invoice_shared_on = (payload.invoice_shared_on != null) ? utilityService.convertDateFormatToUnixTimeStamp(new Date($scope.qandleClients.modal.invoice_shared_on)) : null;
            payload.payment_due_date = (payload.payment_due_date != null) ? utilityService.convertDateFormatToUnixTimeStamp(new Date($scope.qandleClients.modal.payment_due_date)) : null;
            if($scope.qandleClients.modal._id != null) {
                var editurl = service.getUrl('qandleClients') + "/" + $scope.qandleClients.modal._id;
                ServerUtilityService.putWebService(editurl, payload).then(function (data) {    
                    saveUpdateclientsdetailsCallback(data);
                });
            } else {
                ServerUtilityService.postWebService(url, payload).then(function (data) {    
                    saveUpdateclientsdetailsCallback(data);
                });
            }
            
        }

        

        $scope.updateclientsdetails= function(list){
            var url = service.getUrl('qandleClients');
            var payload = $scope.qandleClients.modal;
            // payload.block_on = moment(payload.block_on).unix()
            // payload.notify_from = moment(payload.notify_from).unix()
            // payload.last_payment = moment(payload.last_payment).unix()
            ServerUtilityService.putWebService(url, payload).then(function (data) {    
                updateclientsdetailsCallback(data);
            });
        }

        var updateclientsdetailsCallback = function (data) {
            if (utilityService.putValue(data, 'status') == "success") {
                utilityService.showSimpleToast(utilityService.putValue(data, 'message'));
                getclientsdetails()
            } else {
                var message = utilityService.getValue(data.data, 'message')
                var errorMessage=[]
                if ((typeof data.data.message) == "object"){
                    angular.forEach(data.data.message, function (value, key) {
                        errorMessage.push(value[0]);
                    });
                    errorMessage=errorMessage.join(', ')
                }else{
                    errorMessage = data.data.message
                }
                showAlert('Save Record',errorMessage );
            }
        };

        $scope.editClientsDetails = function( item) {
            var url = service.getUrl('qandleClients') + "/" + item._id;
            ServerUtilityService.getWebService(url).then(function (data) {
                $scope.qandleClients.modal = service.buildQandleCompanyModel(data.data);
                $scope.openModal('qandleClient', 'qandle-client-details.tmpl.html')
            });
        };
        var deleteClientsDetailsCallback = function (data) {
            if (utilityService.getValue(data, 'status') == "success") {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                getclientsdetails()
            } else {
                showAlert('Delete Record', utilityService.getValue(data, 'message'));
            }
        };

        $scope.deleteClientsDetails = function (item) {
            var url = service.getUrl('qandleClients') + "/" + item._id;
            ServerUtilityService.deleteWebService(url)
                .then(function (data) {
                    deleteClientsDetailsCallback(data);
                });
        };

        var showAlert = function(ev, message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error!')
                    .textContent(message)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
        

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

        $scope.handlerSearchCompany = function() {
            if($scope.qandleClientFilter.selectedFilter == null || $scope.qandleClientFilter.fromDate == null || $scope.qandleClientFilter.toDate == null) {
                return;
            }
            $scope.qandleClients.list = [];
            var url = service.getUrl('qandleClients') + "?filter=" + $scope.qandleClientFilter.selectedFilter + "&filterfromdate=" + moment(new Date($scope.qandleClientFilter.fromDate)).unix() + "&filtertodate=" + moment(new Date($scope.qandleClientFilter.toDate)).unix() + "&type=" + $scope.qandleClientFilter.selectedType;
            ServerUtilityService.getWebService(url).then(function (data) { 
                if(data.data) { 
                    $scope.qandleClients.list = clientDetailView(data.data); 
                    $scope.qandleClients.visible = true;
                }
            });
        }

        $scope.viewClientUsersDetails = function( item) {
            $scope.usersList = [];
            $scope.usersList = item.notification_view_to;
            $scope.openModal('qandleClientUsers', 'qandle-client-user-detail.html')
        };

}])