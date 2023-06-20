app.controller('EmployeeTaskController', [
    '$scope', '$modal', '$mdDialog', '$routeParams', '$location', 'EmployeeTaskManagementService', 'utilityService', 'ServerUtilityService',
    function ($scope, $modal, $mdDialog, $routeParams, $location, service, utilityService, serverUtilityService) {
        $scope.task = service.buildTaskObject($routeParams);

        var buildAdditionalParams = function(params) {
            if(utilityService.getValue($routeParams, 'refId')) {
                params.emp_id = utilityService.getValue($routeParams, 'refId');
            }

            return params;
        };
        var taskByWeekCallback = function (data) {
            $scope.task.weeklyView.list = utilityService.getValue(data, 'data', []);
            $scope.task.weeklyView.visible = true;
        };
        var getTaskListByWeek = function(isReloadingRequired) {
            isReloadingRequired = angular.isDefined(isReloadingRequired) ? isReloadingRequired: true;
            if (isReloadingRequired) {
                $scope.task.weeklyView.list = [];
                $scope.task.weeklyView.visible = false;
            }            
            var url = service.getUrl('weekwiseList'),
                params = buildAdditionalParams(service.buildWeekWiseParams($scope.task.weeklyView.duration));

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    taskByWeekCallback(data);
                });
        };
        getTaskListByWeek();
        
        var taskByStatusCallback = function (data) {
            if (!utilityService.getValue(data, 'data', []).length) {
                data.data = service.buildDefaultByStatusList();
            }
            $scope.task.statusView.list = utilityService.getValue(data, 'data', []);
            $scope.task.statusView.visible = true;
        };
        var getTaskListByStatus = function(isReloadingRequired) {
            isReloadingRequired = angular.isDefined(isReloadingRequired) ? isReloadingRequired: true;
            if (isReloadingRequired) {
                $scope.task.statusView.list = [];
                $scope.task.statusView.visible = false;
            }
            var url = service.getUrl('statuswiseList'),
                params = buildAdditionalParams(service.buildWeekWiseParams($scope.task.statusView.duration));

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    taskByStatusCallback(data);
                });
        };

        var completedTaskByDateCallback = function (data) {
            $scope.task.statusView.list[2].task = utilityService.getValue(data, 'data', []);
        };
        var getCompletedTaskByDate = function () {
            var url = service.getUrl('completedTask'),
                params = buildAdditionalParams(service.buildWeekWiseParams($scope.task.statusView.duration));

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    completedTaskByDateCallback(data);
                });
        };
             
        $scope.tabClickHandler = function (tabname) {
            $scope.task.tabname = tabname;
            if (tabname === 'status-view') {
                $scope.task.statusView.duration = service.buildStatusViewDurationObject();
                getTaskListByStatus();
            } else {
                $scope.task.weeklyView.duration = service.buildWeeklyViewDurationObject();
                getTaskListByWeek();
            }
        };        
        var navigateToPreviousWeek = function (keyname) {
            var startDate = service.addSubtractDays($scope.task[keyname].duration.start.fullDate, 7, '-'),
                endDate = service.addSubtractDays($scope.task[keyname].duration.end.fullDate, 7, '-');

            $scope.task[keyname].duration.start = service.buildDateObject(startDate);
            $scope.task[keyname].duration.end = service.buildDateObject(endDate);
        };
        var navigateToNextWeek = function (keyname) {
            var startDate = service.addSubtractDays($scope.task[keyname].duration.start.fullDate, 7, '+'),
                endDate = service.addSubtractDays($scope.task[keyname].duration.end.fullDate, 7, '+');
            
            $scope.task[keyname].duration.start = service.buildDateObject(startDate);
            $scope.task[keyname].duration.end = service.buildDateObject(endDate);
        };
        $scope.navigateToPreviousNextWeek = function (action, keyname) {
            action === 'next' ? navigateToNextWeek(keyname) : navigateToPreviousWeek(keyname);
            utilityService.getValue($scope.task, 'tabname') === 'status-view'
                ? getCompletedTaskByDate() : getTaskListByWeek();
        };
        $scope.toggleView = function (item, keyname, flag) {
            item[keyname] = flag;
        };
        $scope.setActiveActionTab = function (item, tabname) {
            item.activeTab = tabname;
            if (tabname === 'task_date') {
                item.action.task_date = new Date(item.task_date * 1000);
            }
        };
        $scope.sortBy = function(object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };        
        var updateTaskCallback = function (event, item, data) {
            if (utilityService.getValue(data, "status") === "success") {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                utilityService.getValue($scope.task, 'tabname') === 'status-view' 
                    ? getTaskListByStatus(false) : getTaskListByWeek(false);
            } else if (utilityService.getInnerValue(data, 'data', 'message')) {
                showAlert(event, 'Error', utilityService.getInnerValue(data, 'data', 'message'));
            } else {
                showAlert(event, 'Error', utilityService.getValue(data, 'message'));
            }
        };
        var updateTask = function (event, item, url, payload) {            
            serverUtilityService.patchWebService(url, payload)
                .then(function (data) {
                    updateTaskCallback(event, item, data);                    
                });
        };
        $scope.updateTask = function (event, item) {
            var urlPrefix = utilityService.getValue(item, 'activeTab') === 'task_date' 
                    ? 'updateTaskDate' : utilityService.getValue(item, 'activeTab') === 'task_status' 
                        ? 'updateTaskStatus' : 'updateTaskName',
                url = service.getUrl(urlPrefix) + "/" + utilityService.getValue(item, '_id');
                payload = service.buildUpdateTaskPayload(item);
            
            updateTask(event, item, url, payload);
        };
        var saveTaskCallback = function (data, event) {
            if (utilityService.getValue(data, "status") === "success") {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                utilityService.getValue($scope.task, 'tabname') === 'status-view' 
                    ? getTaskListByStatus(false) : getTaskListByWeek(false);
            } else if (utilityService.getInnerValue(data, 'data', 'message')) {
                showAlert(event, 'Error', utilityService.getInnerValue(data, 'data', 'message'));
            } else {
                showAlert(event, 'Error', utilityService.getValue(data, 'message'));
            }
        };
        $scope.saveTask = function (event, item) {
            var url = service.getUrl('saveTask'),
                payload = service.buildSaveTaskPayload(item);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    saveTaskCallback(data, event);
                });            
        };
        $scope.takeAction = function (item) {
            $scope.task.action._id = item._id;
            $scope.openModal('taskStatus', 'change-task-status.tmpl.html', 'md');
        };
        $scope.goBack = function () {
            $location.url('/dashboard/my-team').search({ subtab: 'task', child: 0 });
        };
                        
        /***** Start: AngularJS Modal *****/
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function (instance) {
            if($scope.modalInstance[instance]){
                $scope.modalInstance[instance].dismiss();
            }
        };
        /****** End: AngularJS Modal ******/    
        
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
    }
]);