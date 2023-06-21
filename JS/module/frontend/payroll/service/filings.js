app.service('PayrollFilingsService', [
    'ServerUtilityService', 'utilityService',
    function (ServerUtilityService, utilityService) {
        'use strict';
        
        this.url = {
            calender: 'payroll/statutory-calendar',
            ecr: 'payroll/ecr-file',
            uploadChallan: 'payroll/upload-challan',
            changeStatus: 'payroll/change-status',

            /* Provident Fund Related URLs */
            pf: 'payroll/pf-filing',                        
            pfchallan: 'payroll/add-pf-challan',
            
            /* ESI Related URLs */
            esi: 'payroll/esi-filing',
            uploadESIChallan: 'payroll/upload-esi-challan',

            /* LWF Related URLs */
            lwf: 'payroll/lwf-filing',

            /* Professional Tax Related URLs */            
            pt: 'payroll/pt-filing',            
            ptFilingStatus: 'payroll/pt-change-status',            
            uploadPTChallan: 'payroll/upload-pt-challan',            
  
            /* Document Related URLs */
            viewDocument: 'payroll/challan-file',

            /* Bonus Related URLs */
            bonus: 'payroll/bonus-filing',            
            
            /* Income Tax Related URLs */
            incomeTaxChallan: 'payroll/it-filing',
            uploadITChallan: 'payroll/upload-it-challan',
            incomeTaxFilingStatus: 'payroll/it-filing-status',
            incomeTaxReturn: 'payroll/it-return-filing',
            download_itr: 'payroll/download-itr-fvu'         
        };        
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildChallanObject = function() {
            return {
                businessNo: null,
                vrdNo: null,
                particulars: [
                    {
                        _id: 1,
                        sno: 1,
                        title: "EMPLOYER'S SHARE OF CONT.",
                        ac01: null,
                        ac02: null,
                        ac10: null,
                        ac21: null,
                        ac22: null,
                        total: null
                    },
                    {
                        _id: 2,
                        sno: 2,
                        title: "EMPLOYEE'S SHARE OF CONT.",
                        ac01: null,
                        ac02: null,
                        ac10: null,
                        ac21: null,
                        ac22: null,
                        total: null
                    },
                    {
                        _id: 3,
                        sno: 3,
                        title: "ADMIN CHARGES",
                        ac01: null,
                        ac02: null,
                        ac10: null,
                        ac21: null,
                        ac22: null,
                        total: null
                    },
                    {
                        _id: 4,
                        sno: 4,
                        title: "INSPECTION CHARGES",
                        ac01: null,
                        ac02: null,
                        ac10: null,
                        ac21: null,
                        ac22: null,
                        total: null
                    },
                    {
                        _id: 5,
                        sno: 5,
                        title: "PENAL DAMAGES",
                        ac01: null,
                        ac02: null,
                        ac10: null,
                        ac21: null,
                        ac22: null,
                        total: null
                    },
                    {
                        _id: 6,
                        sno: 6,
                        title: "MISC. PAYMENT (INTEREST U/S 7Q)",
                        ac01: null,
                        ac02: null,
                        ac10: null,
                        ac21: null,
                        ac22: null,
                        total: null
                    }
                ],
                depositeDate: null,
                chequeNo: null,
                chequeDate: null,
                amount: 0,
                bankCode: null,
                branchName: null,
                bankName: null,
                referenceNo: null,
                total: 0
            }
        };

        this.buildFilingsObject = function () {
            return {
                pf:{
                    list:[],
                    challanFile: {uploadFile:null},
                    isAll: false,
                    challan: this.buildChallanObject()
                },
                esi:{
                    list:[],
                    isAll: false
                },
                lwf:{
                    list:[]
                },
                pt:{
                    list: []
                },
                incomeTax: {
                    list: {
                        challan: [],
                        return: []
                    }
                },
                bonus:{
                    list: [],
                    isAll: false
                },
                status: {
                    1: 'Due',
                    2: 'Submitted',
                    3: 'Overdue'
                }
            };
        };             
        this.buildPfECRPayload = function (model){
            var payload = {
                genrated_id: []
            };
            angular.forEach(model, function (value, key){
               if(value.isChecked){
                   payload.genrated_id.push(value._id);
               } 
            });
            return payload;
        };
        this.getCurrentDate = function() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;

            var yyyy = today.getFullYear();
            if(dd < 10) {
                dd = '0' + dd;
            } 
            if(mm < 10) {
                mm = '0' + mm;
            }
            today = dd + '/' + mm + '/' + yyyy; 
            return today; 
        };

    }
]);