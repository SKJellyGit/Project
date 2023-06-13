app.controller('NotificationController', [
	'$scope', 'utilityService', 'ServerUtilityService', 'NotificationService', 'ActionService',
	function ($scope, utilityService, serverUtilityService, service, actionService) {       
        $scope.notification = service.buildNotificationObject();

        var getAlertNotificationCount = function(data) {
            var object = service.getUnreadCount(data);
            $scope.alert.notificationCount = object.viewedCount;
            $scope.alert.unReadNotificationCount = object.unReadCount;
        };
        var buildNotificationObject = function(list) {
            angular.forEach(list, function(value,key){
                value.isChecked = false;
            });
            return list;
        };
        var getNotificationList = function(initialLoading) {
            initialLoading = angular.isDefined(initialLoading) ? initialLoading : false;
            if (initialLoading) {
                $scope.notification.visible = false;
            }
            
            serverUtilityService.getWebService(service.getUrl('notification'))
                .then(function(data) {
                    $scope.notification.list = buildNotificationObject(data.data);
                    getAlertNotificationCount(data.data);
                    $scope.notification.visible = true;                                      
                });
        };       
        getNotificationList(true);
        $scope.isDurationCustom = function() {
            return $scope.notification.duration.slug == 'custom';
        };
        $scope.changeDateRange = function(model) {
            var dateRange = actionService.getDateRange(model.duration.slug);
            model.fromDate = dateRange.from;
            model.toDate = dateRange.to;
        };
        $scope.resetDate = function() {
            $scope.notification.fromDate = null;
            $scope.notification.toDate = null;
        };
        
        /* Listening request leave broadcast event triggered 
            * from request/modify leave callback */
        $scope.$on('read-notification', function(event, args) {
            $scope.args = args;
            getNotificationList();
        });

        $scope.paginationObject = utilityService.buildPaginationObject();
        $scope.paginationObject.pagination.currentPage = utilityService.setStorageValue('NewHirePageNo', 1);
        /************ End AUTOCOMPLETE Section ************/

        $scope.paginationObject.pagination.currentPage = utilityService.getStorageValue('NewHirePageNo') ? utilityService.getStorageValue('NewHirePageNo') : 1;
        $scope.paginationObject.pagination.numPerPage = utilityService.getStorageValue('NewHireNumPerPage') ? utilityService.getStorageValue('NewHireNumPerPage') : 10;
        $scope.$watch("paginationObject.pagination.numPerPage", function(newVal,oldVal) {
            if( newVal != oldVal){
                $scope.paginationObject.pagination.currentPage = 1;
            }else{
                $scope.paginationObject.pagination.currentPage = utilityService.getStorageValue('NewHirePageNo') ? utilityService.getStorageValue('NewHirePageNo') : 1;
            }
            utilityService.setStorageValue('NewHireNumPerPage',newVal);
        }, true);

        $scope.getRecord = function (newv, oldv){
            utilityService.setStorageValue('NewHirePageNo', newv);
        };
        $scope.timeSince = function(item) {
            if(!item) {
                return false;
            }
            
            return utilityService.timeSince(new Date(item.created_at).getTime()/1000);
        };
        $scope.paginationObject.pagination.numPerPage = 10;        
	}
]);