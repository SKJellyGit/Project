app.service('ExitManagerService', [ 'utilityService',
    function (utilityService) {
        'use strict';

        this.url = {
            getNoduesList : "user-exit/employees-provisions",
            changeStatus : "user-exit/provision-dues",
            changeOtherClearanceStatus : "user-exit/other-clearance-dues",
            getSignature: "download/signature-url/full"
        };
        this.getUrl = function (apiUrl){
            return getAPIPath() + this.url[apiUrl];
        };    
        this.exitManagerObj = function (){
            return {
                noduesList:[],
                filteredList:[],
                statusObj:{
                    1: "Pending",
                    2: "No Dues",
                    3: "Amount Due",
                    // 5: "Revoked"
                }
            };
        };        
        this.buildDuesModel = function (model) {
            return {
                _id: angular.isObject(model._id) ? model._id.$id : model._id, 
                empId : utilityService.getValue(model, "employee_id"),
                clearanceID : utilityService.getValue(model, "clearanceID"),
                status : utilityService.getValue(model, "clearanceStatus"),
                amountDue : utilityService.getValue(model, "amount_due"),
                comment : utilityService.getValue(model, "comments_on_dues"),
                type : utilityService.getValue(model, "type")
            };
        };        
        this.buildDuesPayload = function (model){
            var payload = {
                amount_due : model.amountDue,
                comments_on_dues : model.comment
            };
            if(model.type=='provision'){
                payload.provision_id = model.clearanceID;
                payload.provision_status = model.status;
            }
            if(model.type=='exit_clearance'){
                payload.exit_clearance_id = model.clearanceID;
                payload.exit_clearance_status = model.status;
            }
            return payload;
        };
        this.buildObjectArray = function (obj,objLength) {
            var list = [];
            
            for (var i = 1; i <= objLength; i++) {
                var object = {};
                object.id = i;
                object.name = obj[i];
                object.isChecked = false;
                list.push(object);
            }

            return list;
        };
    }
]);