app.controller('FrontendBroadcastController', [
    '$scope','$routeParams', '$location', '$timeout', '$window', '$route', '$q', '$mdDialog', 'FrontendBroadcastService', 'utilityService', 'ServerUtilityService', 'communicationService',
    function ($scope, $routeParams, $location, $timeout, $window, $route, $q, $mdDialog, FrontendBroadcastService, utilityService, serverUtilityService, communicationService) {
        var allFilterObject = [{
            countObject: 'status',
            collection: [true, false],
            isArray: false,
            key: 'is_published'
        }];
        var type = ['is_email', 'is_notification', 'is_persistent'];
        
        $scope.tinymceOptions = communicationService.buildTinyMceOptionsObject();
        $scope.typeObj = FrontendBroadcastService.typeObject();
        $scope.statusObj = FrontendBroadcastService.statusObject();
        $scope.notice = {
            selectedTab: 0,
            isRelevanceVisible : false,
            list: [],
            filteredList:[],
            noticeId: utilityService.getValue($routeParams, 'planId'),
            visible: false,
            statusMapping: FrontendBroadcastService.buildBroadCastStatusMapping()
        };        
        $scope.navigateTo = function (url) {
            utilityService.removeStorageValue('planId');
            utilityService.removeStorageValue('moduleName');
            utilityService.removeStorageValue('isNoticePublished');
            $location.url(url);
        };
        var syncNoticeModel = function (model){
            $scope.noticeObject = FrontendBroadcastService.bulidNoticeModel(model);
        };
        syncNoticeModel();        
        var getAllNotice = function () {
            var url = FrontendBroadcastService.getUrl('allNoitce');
            serverUtilityService.getWebService(url)
                .then(function (data){
                    angular.forEach(data.data, function (v){
                        v.is_drafted = !v.is_published;
                        v.full_name = v.publisher_detail.full_name;
                    });
                    $scope.notice.list = data.data;

                    $scope.calculateFacadeCountOfAllFilters($scope.notice.list, allFilterObject);
                    $scope.calculateOtherFacadeCount($scope.notice.list, type, 'type');
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);

                    $scope.notice.visible = true;
                });
        };
        getAllNotice();        
        var getIndvidualNotice = function () {
            var url = FrontendBroadcastService.getUrl('getNoitce') + "/" + $scope.notice.noticeId;
            serverUtilityService.getWebService(url)
                .then(function (data){
                    syncNoticeModel(data.data);
                });
        };
        if($scope.notice.noticeId){
            $scope.notice.isRelevanceVisible = true;
            getIndvidualNotice(); 
        }        
        var noticeSuccessCallback = function (data) {
            utilityService.showSimpleToast(data.message);
            utilityService.setStorageValue('planId', data.data._id);
            utilityService.setStorageValue('moduleName', 'broadcastNotice');
            //utilityService.setStorageValue('isNoticePublished', true);
            $scope.notice.isRelevanceVisible = true;
            $scope.notice.selectedTab = 1;
        };        
        var noticeErrorCallback = function (data) {
            utilityService.showSimpleToast(utilityService.getValue(data, 'message'));            
        };        
        var noticeSuccessErrorCallback = function (data) {
            data.status == "success" ? noticeSuccessCallback(data) : noticeErrorCallback(data)
        };
        var saveNotice = function (url, paylod) {
            serverUtilityService.postWebService(url, paylod)
                .then(function(data){
                    noticeSuccessErrorCallback(data);
                });
        };        
        var updateNotice = function (url, paylod) {
            serverUtilityService.putWebService(url, paylod)
                .then(function(data){
                    noticeSuccessErrorCallback(data);
                });
        };        
        $scope.saveNotice = function () {
            var url = $scope.notice.noticeId ? FrontendBroadcastService.getUrl('editNoitce') + "/" + $scope.notice.noticeId : FrontendBroadcastService.getUrl('addNoitce'),
                paylod = FrontendBroadcastService.bulidNoticePayload($scope.noticeObject);
            
            $scope.notice.noticeId ? updateNotice(url, paylod) : saveNotice(url, paylod);
        };        
        $scope.editNotice = function (item) {
            console.log(utilityService.getValue(item, 'is_published', false));
            utilityService.setStorageValue('planId', item._id);
            utilityService.setStorageValue('moduleName', 'broadcastNotice');
            utilityService.setStorageValue('isNoticePublished', utilityService.getValue(item, 'is_published', false));
            $location.url('/frontend/broadcast/notice').search({planId: item._id});
        };        
        $scope.duplicateNotice = function (item) {
            var url = FrontendBroadcastService.getUrl('duplicate') + "/" + item._id;
            serverUtilityService.postWebService(url)
                .then(function(data){
                    if(data.status == "success") {
                        utilityService.showSimpleToast(data.message);
                        utilityService.setStorageValue('planId', data.data._id);
                        utilityService.setStorageValue('moduleName', 'broadcastNotice');
                        $location.url('/frontend/broadcast/notice').search({planId: data.data._id});
                    }
                });
        };        
        $scope.publishNotice = function (item, event) {
            var url = FrontendBroadcastService.getUrl('publish') + "/" + item._id;
            serverUtilityService.putWebService(url)
                .then(function (data) {
                    if (data.status == "success") {
                        utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                        item.is_published = true;
                    } else {
                        $scope.showAlert(event, utilityService.getValue(data, 'message'));
                    }
                });
        };
        var deleteNoticeCallback = function (data, event) {
            if (data.status == "success") {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                getAllNotice();
            } else {
                $scope.showAlert(event, utilityService.getValue(data, 'message'));
            }
        };
        $scope.deleteNotice = function (item, event) {
            var url = FrontendBroadcastService.getUrl('delete') + "/" + item._id;
            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    deleteNoticeCallback(data, event);
                });
        };        
        
        /************* Filter Section *************/
        $scope.resetFilter = function (){
            $scope.filterIncludes = {
                type: [],
                status: []
            };
            $scope.allFilters = {
                type: [],
                status: []
            };
            $scope.name_fliter = {};
            $scope.resetAllTypeFilters();
        };
        $scope.resetFilter();                
        $scope.typeFilter = function (notice) {
            if(angular.isDefined($scope.filterIncludes.type) && $scope.filterIncludes.type.length) {
                for(var i = 0; i < $scope.filterIncludes.type.length; i++) {
                    if(notice[$scope.filterIncludes.type[i]]) {
                        return notice;
                    }
                }
            } else {
                return notice;
            }
        };        
        $scope.statusFilter = function (notice) {
            if(angular.isDefined($scope.filterIncludes.status) && $scope.filterIncludes.status.length) {
                if ($.inArray(notice.is_published, $scope.filterIncludes.status) < 0)
                    return ;
            }
            return notice;
        };        
        $scope.updatePaginationSettings('broadcast');


        /********* Start: Angular Dialog     *********/
        var showConfirmDialog = function(event, functionName, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to proceed with this?')
                .textContent('This will be deleted permanently.')
                .ariaLabel('Lucky day')
                .targetEvent(event)
                .ok('Yes, please do it!')
                .cancel('No, want to cancel');

            $mdDialog.show(confirm).then(function() {
                functionName(item, event);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function(event, functionName, item) {                       
            showConfirmDialog(event, functionName, item);
        };
        $scope.showAlert = function(event, textContent, title) {
            title = title || 'ALERT!';
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            var alert = $mdDialog.alert()
                .clickOutsideToClose(true)
                .title(title)
                .textContent(textContent)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(event);

            $mdDialog.show(alert);
        }; 
        /********* End: Angular Dialog *********/  
    }
]);