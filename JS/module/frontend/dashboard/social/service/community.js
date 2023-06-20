app.service('CommunityService', ['utilityService',
    function (utilityService) {
        'use strict';

        this.url = {
            community: 'social-frontend/community',
            joinCommunity:'social-frontend/community-join',
            approveRequest:'social-frontend/approve-reject',
            employee: 'user-addition/all-user?status=true',
            invitation:'social-frontend/add-members',
            leaveCommunity: 'social-frontend/community-leave',
            socialEmployee: 'social-frontend/all-active-user',

        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildCommunityModel = function(model){
            return {
                _id: utilityService.getValue(model, '_id'),
                community_name: utilityService.getValue(model,'community_name'),
                description: utilityService.getValue(model, 'description'),
                community_type: utilityService.getValue(model,'community_type',1),
                search: {}
            };
        };
        this.buildCommunityObject = function(){
            return {
                model: this.buildCommunityModel(),
                list: [],
                filteredList:[],
                type: [{
                    id: 1,
                    name: "Public"
                },
                {
                    id: 2,
                    name: "Moderated"
                },
                {
                    id: 3,
                    name: "Private"
                }],
                employeeList : [],
                isPostVisible: false,
                communityId: null,
                object: null,
                communityFlag: false
            }
        };
        this.buildCommunityDetailObject = function(data,loginEmpId) {
            angular.forEach(data,function(value,key){
                value.isAdmin = loginEmpId == value.created_by._id ? true : false;
                value.isMember = false;
               if(angular.isDefined(value.members) && value.members.length){
                   angular.forEach(value.members,function (val,key){
                        if(val._id == loginEmpId ){
                            value.isMember =  true;
                        }
                   });                    
               }
               if(angular.isDefined(value.join_requests) && value.join_requests.length){
                   angular.forEach(value.join_requests,function (val,key){
                        val.isJoined = false;
                   });                    
               }
            });
            return data;
        };
    }
]);