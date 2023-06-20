app.controller('CommunityController', [
    '$scope', '$timeout', 'CommunityService', 'utilityService', 'ServerUtilityService',
    function($scope, $timeout, CommunityService, utilityService, serverUtilityService) {
    	var resetErrorMessages = function() {
            $scope.errorMessages = [];
        };        
        var successCallback = function(data, list, section, isAdded, type) {
            utilityService.resetAPIError(false, null, section);
                $scope.toggleModal('add-community', false); 
                $scope.toggleModal('join-request',false);
                $scope.toggleModal('send-invitation',false);
                utilityService.showSimpleToast(data.message);     
            if (angular.isDefined(data.data)) {          
                isAdded ? list.unshift(data.data) : utilityService.refreshList(list, data.data);
                if(type=='join'){
                    CommunityService.buildCommunityDetailObject(list,$scope.user.loginEmpId);
                }
                if(type=='community'){
                  utilityService.showSimpleToast(data.message);
                  getCommunityDetails();
                }
            }
        };
        var errorCallback = function(data, section) {
            if (data.status == "error") {
                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(data.message);
            } else if (data.data.status == 'error') {
                utilityService.resetAPIError(true, "something went wrong", section);
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function(value, key) {
                        angular.forEach(value, function(v, k) {
                            $scope.errorMessages.push(v);
                        });
                    });
                } else {
                    $scope.errorMessages.push(data.data.message);
                }
            }
        };
        var successErrorCallback = function(data, list, section, isAdded, type) {
            data.status === "success" ? successCallback(data, list, section, isAdded, type) 
            	: errorCallback(data, section);
        };
        $scope.community = CommunityService.buildCommunityObject();
        $scope.logedInUserID = utilityService.getStorageValue('loginEmpId');
        $scope.filterCommunities = function(item){
            if($scope.user.loginEmpId == item.created_by._id || item.isMember || item.community_type == 3){
                 return;
            }
                return item;
        };
        $scope.id = "_id";
        $scope.reverse = true;
        $scope.inviteAll = false;
        $scope.noEmployee = false;
        var sycnCommunityModel = function() {
            $scope.community.model = CommunityService.buildCommunityModel();
        };
        var getCommunityDetails = function() {
            serverUtilityService.getWebService(CommunityService.getUrl('community'))
	            .then(function(data) {                    
	                $scope.community.list = CommunityService.buildCommunityDetailObject(data.data,$scope.user.loginEmpId);
                });
        };
        getCommunityDetails();
    	$scope.toggleModal = function(id, flag,type,item,form) {
            if(angular.isDefined(form)) {
                utilityService.resetForm(form);
            }
            if(type == 'addCommunity'){
                sycnCommunityModel();
            }
            item = angular.isDefined(item) ? item : null;
            if(type == 'join' && item){
                $scope.joinRequestDetails = item;
            }
            if(type == 'invite' && item){
                $scope.inviteAll = false;
                $scope.community.model.search = {};
                getEmployeeList(item);
                $scope.inviteComDetails = item;
            }
            flag ? $('#' + id).appendTo("body").modal('show')
                : $('#' + id).modal('hide');
        };
        $scope.saveCommunity = function(){
        	resetErrorMessages();
            var payload = {
                community_name: $scope.community.model.community_name,
                description: $scope.community.model.description,
                community_type: $scope.community.model.community_type
            };        
            serverUtilityService.postWebService(CommunityService.getUrl('community'),payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.community.list, "social", true, 'community');
                });   
        };
        $scope.requestToJoin = function(item){
            serverUtilityService.postWebService(CommunityService.getUrl('joinCommunity')+ "/" + item._id)
                .then(function (data) {
                    successErrorCallback(data, $scope.community.list, "social", false,'community');
                    if(data.status === "success"){
                        item.is_requested = true;
                    }
                });   
        };
        $scope.userCommunityCount = function(list){
            var count = 0;
            angular.forEach(list,function(value,key){
                if(value.created_by._id == $scope.user.loginEmpId){
                    ++count;
                } 
            });
            return count;
        }
        $scope.acceprtRequest = function(list,item,type, index){
            var url = CommunityService.getUrl('approveRequest')+ "/" + list._id,
            payload = {
                emp_id: item._id,
                action: type
            }; 
            serverUtilityService.postWebService(url,payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.community.list, "community", true,'join');
                    if(data.status === "success"){
                        list.join_requests.splice(index, 1);
                    }
                }); 
        };
        $scope.confirmDelete = function(item) {
            $scope.deleteCommunityDetails = item;
            $scope.toggleModal('alert-Message',true);
        }
        $scope.deleteCommunity = function(item) {
            var url = CommunityService.getUrl('community') + "/" + item._id;
            serverUtilityService.deleteWebService(url)
                    .then(function (data) {
                        $scope.community.list = utilityService.deleteCallback(data, item, $scope.community.list);
                        if(data.status === "success"){
                            $scope.toggleModal('alert-Message',false);
                            utilityService.showSimpleToast(data.message);
                        }
                    });
        };
        $scope.leaveCommunity = function(item) {
            var index = item.members.map(function(o) { return o._id; }).indexOf($scope.user.loginEmpId);
            var url = CommunityService.getUrl('leaveCommunity') + "/" + item._id;
            serverUtilityService.putWebService(url)
            .then(function (data) {
                successErrorCallback(data, $scope.community.list, "social", false, "community");
                if(data.status === "success"){
                        item.isMember = false;
                        item.is_joined = false; 
                        item.members.splice(index, 1);
                }
            }); 
        };
        $scope.backToCommunity = function() {
            $scope.community.communityId = null;
            $timeout(function() {
                $scope.community.isPostVisible = false;
            }, 200);
            getCommunityDetails();
        };
        $scope.togglePost = function(item,type) {
            $scope.community.communityId = item._id;
            $scope.community.object = item;
            $scope.community.communityFlag = angular.isDefined(type) && type == 'notJoin' ? true : false;
            $scope.community.isPostVisible = false;
            $timeout(function() {
                $scope.community.isPostVisible = true;
            }, 200);
            $scope.reloadEmoji();
        };
        var buildEmpObject = function(list,item) {
            var totalNonMember = [];
            angular.forEach(list,function(value,key){
                value.isAdmin = value.employee_preview._id == item.created_by._id ? true : false;
                value.isSelected = false;
                value.isMember = false;
                value._id = value.employee_preview._id;
                if(angular.isDefined(item.members) && item.members.length) {
                    angular.forEach(item.members,function(val,key){
                        if(val._id == value.employee_preview._id){
                            value.isMember = true;
                        }
                    });
                }
                if (!value.isMember && !value.isAdmin) {
                    totalNonMember.push(value)
                }
            });
            $scope.noEmployee = totalNonMember.length ? false : true;
            return list;
        };

        var allFilterObject = [{countObject: 'group',isGroup: true,collection_key: 'employee_preview'}];

        var getEmployeeList = function(item) {
            $scope.community.employeeList = [];
            serverUtilityService.getWebService(CommunityService.getUrl('socialEmployee'))
                .then(function(data) {
                    $scope.community.employeeList = buildEmpObject(data,item);
                    //$scope.community.employeeList = data;
                    $scope.calculateFacadeCountOfAllFilters($scope.community.employeeList, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject); 
                });
        };
        $scope.sendInvitation = function(item,list){
            var payload = {}, empList =[];
            payload.com_id = item._id;
            angular.forEach(list,function(value,key){
                console.log(value);
                if(value.isSelected){
                    angular.isObject(value._id) ? empList.push(value._id) : empList.push(value._id);
                }
            });
            payload.members = empList;
            serverUtilityService.postWebService(CommunityService.getUrl('invitation'),payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.community.list, "community", true);
                }); 
        };
        $scope.inviteAllEmp = function(list,checkAll) {
            angular.forEach(list,function(value,key){
                value.isSelected = value.isAdmin || value.isMember ? false : checkAll;
            });
        };
        $scope.clickOutSideClose = function() {
            console.log('here');
            $("._md-open-menu-container").hide();
        };

    }
]);