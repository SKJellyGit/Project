app.service('EmployeeViewLndService', [
    'ServerUtilityService', 'utilityService',
    function (ServerUtilityService, utilityService) {
        'use strict';

        this.url = {
            getEmployeeViewDetails: 'provisions-manager/employee-view/1',
            getProvisionType: 'provisions-manager/provision-types',
            allmandatorygroup: 'user-management/active/group?mandatory=true&field=true',
            preview: 'user-management/employee-preview',
            getEmpViewDetail: 'provisions-manager/employee-view/details'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildEmployeeStatusObj = function(){
            return utilityService.buildEmployeeStatusHashMap();
        };
        this.buildRequestTypeObj = function (){
            return {
                1: "Allotment",
                2: "Change",
                3: "Return/Revoke"
            }
        };        
        this.buildRequestStatusObj = function (){
            return {
                1: "Request Raised",
                2: "Request Completed",
                3: "Request Cancelled",
                4: "Request Denied"
            }
        };        
        this.buildEmployeeViewObj = function () {
            return {
                employee:{
                    list:[],
                    filteredList:[],
                    provisionType:[],
                    viewDetail:[],
                    attributeEmpList: [],
                    buildEmployeeStatusList: this.buildEmployeeStatusObj()
                }
            };
        };

    }
]);