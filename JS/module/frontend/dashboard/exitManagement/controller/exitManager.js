app.controller('ExitManagerController', [
    '$scope', '$location', '$modal', 'ExitManagerService', 'utilityService', 'ServerUtilityService', 
    function ($scope, $location, $modal, ExitManagerService, utilityService, serverUtilityService) {
        var allFilterObject = [{countObject: 'group', isGroup: true, collection_key: 'employee_preview'}];
        
        $scope.exitManager = ExitManagerService.exitManagerObj();
        $scope.exitManager.statusArray = ExitManagerService.buildObjectArray($scope.exitManager.statusObj, 3);
        $scope.isListVisible = false;
        $scope.isSignatureProvided = false;

        var syncDuesModel = function (model) {
            $scope.exitManager.duesModel = ExitManagerService.buildDuesModel(model);
        };
        var extractDataFromList = function (data) {
            var array = [];

            angular.forEach(data, function (v, key) {
                if (v.type == 'exit_clearance') {
                    var obj = {
                        _id: angular.isObject(v.exit_id) ? v.exit_id.$id : v.exit_id,
                        clearanceName: v.clearance_name,
                        clearanceDate: v.due_date,
                        clearanceID: angular.isObject(v._id) ? v._id.$id : v._id,
                        clearanceStatus: v.status,
                        amount_due: angular.isDefined(v.amount_due) ? v.amount_due : null,
                        comments_on_dues: angular.isDefined(v.comments_on_dues) ? v.comments_on_dues : null,
                        employee_preview: v.emp_preview_detail,
                        full_name: v.emp_preview_detail.full_name,
                        last_serving_date: v.last_serving_date,
                        employee_id: v.employee_id,
                        type: v.type,
                        status: $scope.exitManager.statusObj[v.status],
                        action_taken_by : angular.isDefined(v.action_taken_by) ? v.action_taken_by : null,
                    };
                    $scope.calculateFacadeCountOfAllFilters(data,allFilterObject, obj);
                    array.push(obj);
                }
            });

            return array;
        };
        var getNoduesDataList = function () {
            $scope.resetFacadeCountObject(allFilterObject);
            var url = ExitManagerService.getUrl('getNoduesList');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.closeModal('noDues');
                    $scope.exitManager.noduesList = extractDataFromList(data.data);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.isListVisible = true;  
                });
        };
        $scope.handleEditAction = function (item) {
            item = angular.isDefined(item) ? item : null;
            syncDuesModel(item);
            $scope.openModal('noDues', 'noDues.html');
        };
        $scope.editDuesStatus = function () {
            var temp_url = $scope.exitManager.duesModel.type == 'provision' 
                    ? ExitManagerService.getUrl('changeStatus') 
                    : ExitManagerService.getUrl('changeOtherClearanceStatus'),
                url = temp_url + "/" + $scope.exitManager.duesModel._id,
                payload = ExitManagerService.buildDuesPayload($scope.exitManager.duesModel);

            serverUtilityService.patchWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        getNoduesDataList();
                    }
                });
        };        
        var getCurrentSignature = function () {
            var url = ExitManagerService.getUrl('getSignature') + "/" 
                + utilityService.getStorageValue('loginEmpId');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    if(data.status == 'success') {
                        $scope.isSignatureProvided = true;
                    }
                });
        };
        getCurrentSignature();
        getNoduesDataList();        
        $scope.createSignature = function () {
            $location.url('dashboard/signature').search({page: 'nodues'});
        };        
        $scope.csvColumn = {
            'Employee Name' : 'full_name',
            'Provision Name' : 'clearanceName',
            'Last Working Day' : 'last_serving_date',
            'Clearance Date' : 'clearanceDate',
            'Status' : 'clearanceStatusName',
            'Due Amount': 'amount_due',
            'Action Taken By' : 'action_taken_by'
        };
        $scope.clickOutSideClose = function() {
            $("._md-select-menu-container").hide();
        };        
        $scope.openModal = function(instance, templateUrl, size) {
            size = angular.isDefined(size) ? size : 'sm';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope:$scope,
                windowClass:'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };        
        $scope.updatePaginationSettings('manager_exit');
    }
]);