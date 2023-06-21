app.service('PayrollRegisterReportService', [
    'ServerUtilityService', 'utilityService',
    function (ServerUtilityService, utilityService) {
        'use strict';
        
        this.url = {
            getProfileFields : 'user-management/segment?field=true',
            grplst: 'user-management/active/group?mandatory=true&field=true',
            getComponent: 'payroll/statutory-compliance/register-reports'
        };        
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };        
        this.buildRegistersReportObject = function () {
            return {
                component:{
                    list:[]
                },
                associateField:{
                    list:[]
                },
                groups:{
                    list:[]
                },
                model:{
                    list:[]
                },
                routeParam:{
                    component: null,
                    type: null
                }
            };
        };        
        this.buildRegistersReportModel = function (model){
            return {
                reportHeader : utilityService.getValue(model,'report_header'),
                reportFooter : utilityService.getValue(model,'report_footer'),
                fromDate : utilityService.getValue(model,'from_date'),
                toDate : utilityService.getValue(model,'to_date')
            };
        };        
        this.buildRegistersReportPayload = function (model) {
            return {
                report_header : model.reportHeader,
                report_footer : model.reportFooter,
                from_date : utilityService.dateToString(model.fromDate,'/'),
                to_date : utilityService.dateToString(model.toDate,'/')
            };
        };        
        this.buildAssociateFieldPayload = function(model){
            var associate_field = [];
            angular.forEach(model, function(value,key){
                angular.forEach(value.profile_field, function (v, k) {
                    if(v.isChecked){
                       associate_field.push(v._id); 
                    }
                    angular.forEach(v.child_details, function (va, ke) {
                        if(va.isChecked){
                       associate_field.push(va._id); 
                    }
                    });
                });
            });
            return associate_field;
        };        
        this.buildGroupFieldPayload = function(model){
            var group_field = [];
            angular.forEach(model, function (v,k){
                if(angular.isDefined(v.elementId)){
                    group_field.push(v.elementId);
                }
            });
            return group_field;
        };        
        this.is31DaysMonth = function(date) {
        	var m = date.getMonth() + 1;
        	return (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12);
        };
        this.is30DaysMonth = function(date) {
        	var m = date.getMonth() + 1;
        	return (m == 4 || m == 6|| m == 9 || m == 11);
        };

    }
]);