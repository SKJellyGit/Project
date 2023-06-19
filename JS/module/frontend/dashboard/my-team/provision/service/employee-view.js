app.service('ProvisionRelaionViewService', [
    'ServerUtilityService', 'utilityService',
    function (ServerUtilityService, utilityService) {
        'use strict';
        this.url = {
            getEmployeeViewDetails: 'myteam/provision/employee-view',
            getProvisionType: 'provisions/settings',
            allmandatorygroup: 'user-management/active/group?mandatory=true&field=true',
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
        this.buildEmployeeViewObj = function () {
            return {
                employee:{
                    list:[],
                    provisionType:[],
                    viewDetail:[],
                    attributeEmpList: [],
                    buildEmployeeStatusList: this.buildEmployeeStatusObj()
                }
            }
        };
    }
]);