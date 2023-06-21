app.service('InsuranceService', [
    'ServerUtilityService', 'utilityService',
    function (ServerUtilityService, utilityService) {
        'use strict';
        this.url = {
            addInsuranceType: 'insurance/add-insurance-type',
            getInsuranceType: 'insurance/get-insurance-types',
            insuranceDeletion: 'insurance/get-deletion-template',
            insuranceAddition: 'insurance/get-addition-template',
            updateInsuranceType : 'insurance/update-insurance',
            getEmployeeList : "insurance/get-employee-insurances",
            addEmpInsurace : 'insurance/upload-additon-csv',
            deleteInsurancType:'insurance/delete-insurance',
            updateEmpInsurance : 'insurance/upload-deletion-csv',
            deleteEmpInsurance : 'insurance/bulk-delete-employee-insurance'
        };
        this.getUrl = function(apiUrl) {
	    	return this.url[apiUrl];
	    };
	    this.buildEmployeeStatusObj = function(){
            return utilityService.buildEmployeeStatusHashMap();
        };
        this.buildMonthDetails = function(){
            return [
                {id: 1, name: "Jan", days: 31},
                {id: 2, name: "Feb", days: 28},
                {id: 3, name: "Mar", days: 31},
                {id: 4, name: "Apr", days: 30},
                {id: 5, name: "May", days: 31},
                {id: 6, name: "Jun", days: 30},
                {id: 7, name: "Jul", days: 31},
                {id: 8, name: "Aug", days: 31},
                {id: 9, name: "Sep", days: 30},
                {id: 10, name: "Oct", days: 31},
                {id: 11, name: "Nov", days: 30},
                {id: 12, name: "Dec", days: 31}
            ]
        };
        this.buildInsuranceTypeModel = function(model){
             return {
                _id: utilityService.getValue(model, '_id'),
                insurance_name: utilityService.getValue(model, 'insurance_name')
            };
        };
        this.buildInsuranceObject = function(){
        	return {
        		insuranceTypeList : [],
        		allEmployeeList : [],
        		model: this.buildInsuranceTypeModel()
            }
        };
        this.dayDiffrence = function(date1,date2){
            date1 = new Date(date1);
            date2 = new Date(date2);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime())+1;
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        };
        this.getMonthListBetweenDates = function(date1, date2) {            
            var timeValues = {
                monthOnly : [],
                monthWithYear: []
            };
            date1 = moment(date1);
            date2 = moment(date2);
            while (date2 > date1) {
                var list = {
                    month: null,
                    year: null
                };
                timeValues.monthOnly.push(date1.format('M'));
                list.month = date1.format('M');
                list.year = date1.format('YY');
                timeValues.monthWithYear.push(list);
                date1.add(1,'month');
            }
            return timeValues;
        };
        this.changeDateFormat = function(currentdate) {
            var today = new Date(currentdate);
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();

            if(dd < 10) {
                dd = '0' + dd;
            } 
            if(mm < 10) {
                mm = '0' + mm;
            }
            today = mm + '-' + dd + '-' + yyyy;
            
            return today; 
        };

        return this;
    }
]);