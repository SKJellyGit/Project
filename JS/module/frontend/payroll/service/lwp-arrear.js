app.service('LWPArrearService', [
    'utilityService',
    function (utilityService) {
        'use strict';

        var self = this;        
        
        this.url = {
            payrollLockDays: 'payroll/lock-days',
            download: 'payroll/download-lwp-arrear-template',
            upload: 'payroll/upload-lwp-arrear-template',
            summary: 'payroll/lwp-arrear-summary',
            lwpDetails: 'payroll/lwp-detail',
            lwprDetails: 'payroll/lopr-detail',
            lwppDetails: 'payroll/lopp-detail',            
            arrearDetails: 'payroll/arrear-detail',
            paidDays: 'payroll/emp-worked-days',
            arrearDays: 'payroll/emp-arrear-days',
            paidDaysUpload: 'payroll/upload-worked-days-template',
            paidDaysDownload: 'payroll/download-worked-days-template',
            arrearDaysUpload: 'payroll/upload-arrear-days-template',
            arrearDaysDownload: 'payroll/download-arrear-days-template',
            deleteArrearEmployee: 'payroll/emp-arrear-days',
            deletePaidEmployee: 'payroll/emp-worked-days',
            rfaAmount: 'payroll/rfa-related-data',
            rfaAmountDownload: 'payroll/rfa-related-template',
            rfaAmountUpload: 'payroll/upload-rfa-related-template'

        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildBulkObject = function () {
            return {
                lwpOverride: {
                    isUploaded: false,
                    file: null
                },
                lwprOverride: {
                    isUploaded: false,
                    file: null
                },
                lwppOverride: {
                    isUploaded: false,
                    file: null
                }                
            };
        };
        this.buildAllFilterObject = function () {
            return [
                {
                    countObject: 'groupTemp', 
                    isGroup: true, 
                    collection_key: 'employee_preview'
                }
            ];
        };
        this.buildCommonObject = function () {
            return {
                list: [],
                filteredList: [],
                propertyName: 'employee_preview.full_name',                                                
                reverse: false,
                visible: false,
                error: {
                    status: false,
                    message: null
                },
                searchText: {
                    name: ''
                }
            };
        };
        this.buildUploadTypeList = function () {
            return [                    
                {
                    id: 1,
                    title: 'Override'
                },
                {
                    id: 2,
                    title: 'Merge'
                }
            ];
        };
        this.buildUploadTypeObject = function () {
            return {
                selected: 1,
                list: this.buildUploadTypeList()
            };
        };
        this.buildSummaryObject = function () {
            return this.buildCommonObject();
        };
        this.buildSummaryObject = function () {
            return this.buildCommonObject();
        };
        this.buildDetailsObject = function () {
            var details = this.buildCommonObject();
            details.uploadType = this.buildUploadTypeObject();

            return details;
        };
        this.buildLWPDaysObject = function() {
            return {
                tabs: {
                    selected: 'summary',
                    templateMapping: {
                        lwpDetails: 1,
                        lwprDetails: 3,
                        lwppDetails: 4
                    }                    
                },
                payrollLockDays: {
                    selected: null,
                    list: []
                },
                summary: this.buildSummaryObject(),
                lwpDetails: this.buildDetailsObject(),
                lwprDetails: this.buildDetailsObject(),
                lwppDetails: this.buildDetailsObject(),
                arrearDays: this.buildDetailsObject(),
                paidDays: this.buildDetailsObject(),
                furnished_amount: this.buildDetailsObject(),
                hire_charges: this.buildDetailsObject(),
                lease_amount: this.buildDetailsObject(),
                license_fee_of_house: this.buildDetailsObject(),

            }            
        };
        this.getSummaryTabAdditionalColumns = function () {
            return ['System LOP Days', 'Uploaded LOP Days', 'Total LOP Days',
                'System LOPR Days', 'Uploaded LOPR Days', 'Total LOPR Days',
                'System LOPP Days', 'Uploaded LOPP Days', 'Total LOPP Days'];
        };
        this.getDetailsAdditionalColumns = function (tabname) {
            return [ 'Date', 'Days', 'Reason', 'Consideration'];
        };
        this.getAdditionalColumns = function (tabname) {
            return tabname === 'summary'
                ? this.getSummaryTabAdditionalColumns(tabname)
                : this.getDetailsAdditionalColumns(tabname)
        };
        this.buildExportListHeader = function(tabname) {
            if(tabname === 'paidDays'){
                var columnHeaders = new Array('Employee Name', 'Employee ID','Worked Days');
                return new Array(columnHeaders)
            }else if (tabname === 'arrearDays') {
                var columnHeaders = new Array('Employee Name', 'Employee ID','Arrear Days');
                return new Array(columnHeaders)
            }else if(['furnished_amount', 'hire_charges', 'lease_amount', 'license_fee_of_house'].includes(tabname)){
                var columnHeaders = 
                new Array(
                 "Employee",
                 "April",
                 "May",
                 "June",
                 "July",
                 "August",
                 "September",
                 "October",
                 "November",
                 "December",
                 "January",
                 "February",
                 "March",
                 "Total");
                 return new Array(columnHeaders)
            } else {
            var columnHeaders = new Array('Employee Details', 'Employee ID',
                    'Attendance Cycle', 'Payroll Lock Day'),
                additionColumns = this.getAdditionalColumns(tabname);
            
            columnHeaders = columnHeaders.concat(additionColumns);

            return new Array(columnHeaders);
            }
        };
        this.getDaysDetailsColumnValue = function (value, keyName) {
            var details = '';
                        
            angular.forEach(value[keyName], function (v, k) {
                details = details + '(Date: ' + v.date + ', Days: ' + v.days + ')' + "\n";
            });

            return details;
        };
        this.buildExportData = function (lwpArrear) {
            var lockDays = lwpArrear.payrollLockDays.selected,
                tabname = lwpArrear.tabs.selected,
                filteredList = lwpArrear[tabname].filteredList,
                csvContent = this.buildExportListHeader(tabname);

            angular.forEach(filteredList, function(value, key) {
                var array = new Array();
                if(tabname === 'paidDays'){
                    array.push(utilityService.getInnerValue(value, 'employee', 'full_name'));
                    array.push(utilityService.getInnerValue(value, 'employee', 'personal_profile_employee_code'));
                    array.push(utilityService.getValue(value, 'days'));
                }else if (tabname === 'arrearDays') {
                    array.push(utilityService.getInnerValue(value, 'employee', 'full_name'));
                    array.push(utilityService.getInnerValue(value, 'employee', 'personal_profile_employee_code'));
                    array.push(utilityService.getValue(value, 'days'));
                } else if(['furnished_amount', 'hire_charges', 'lease_amount', 'license_fee_of_house'].includes(tabname)){
                    array.push(utilityService.getInnerValue(value, 'employee', 'full_name'));
                    array.push(utilityService.getValue(value, 'apr'));
                    array.push(utilityService.getValue(value, 'may'));
                    array.push(utilityService.getValue(value, 'jun'));
                    array.push(utilityService.getValue(value, 'jul'));
                    array.push(utilityService.getValue(value, 'aug'));
                    array.push(utilityService.getValue(value, 'sep'));
                    array.push(utilityService.getValue(value, 'oct'));
                    array.push(utilityService.getValue(value, 'nov'));
                    array.push(utilityService.getValue(value, 'dec'));
                    array.push(utilityService.getValue(value, 'jan'));
                    array.push(utilityService.getValue(value, 'feb'));
                    array.push(utilityService.getValue(value, 'mar'));
                    array.push(utilityService.getValue(value, 'total'));
                } else {
                    array.push(utilityService.getInnerValue(value, 'employee_preview', 'full_name'));
                    array.push(utilityService.getInnerValue(value, 'employee_preview', 'personal_profile_employee_code'));
                    array.push(utilityService.getValue(value, 'attendance_cycle', 'N/A'));
                    array.push(lockDays + utilityService.getDayOfMonthSuffix(lockDays));
    
                    if (tabname === 'summary') {
                        array.push(utilityService.getValue(value, 'lop'));
                        array.push(utilityService.getValue(value, 'lop_uploaded'));
                        array.push(utilityService.getValue(value, 'lop_total'));
    
                        array.push(utilityService.getValue(value, 'lopr'));
                        array.push(utilityService.getValue(value, 'lopr_uploaded'));
                        array.push(utilityService.getValue(value, 'lopr_total'));
    
                        array.push(utilityService.getValue(value, 'lopp'));
                        array.push(utilityService.getValue(value, 'lopp_uploaded'));
                        array.push(utilityService.getValue(value, 'lopp_total'));
                    } else {
                        array.push(utilityService.getValue(value, 'date'));
                        array.push(utilityService.getValue(value, 'days'));
                        array.push(utilityService.getValue(value, 'reason'));
                        array.push(utilityService.getValue(value, 'consideration'));
                    }

                }
                
               
                
                csvContent.push(array);
            });

            return csvContent;
        };
    }
]);