app.service('PayrollOverviewService', [ 'utilityService',
    function (utilityService) {
        'use strict';
        var self = this;

        this.permission = {
            slug: 'can_view_investment_claim_payroll'
        };
        this.url = {
            taskSummary: 'payroll/task-summary',
            allmandatorygroup: 'user-management/active/group?mandatory=true&field=true',
            reminderToEmp: 'prejoin/frontend/send-reminder',
            statutoryCompliances: 'payroll/statutory-compliances',
            allUser: 'payroll/all-user',
            tobecomputed: 'payroll/tobecomputed',
            approvedAmount: 'payroll/investment-approved-data',
            modulePermission: 'employee/module-permission',
            bifurcation80cReport: 'payroll/80c-approved-data',
            investmentApprovedBifurcationReport: 'payroll/investment-approved-bifurcation'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.hasOnlyInvestmentsAndClaimsPermission = function (list) {
            var hasOnlyPermission = false;

            angular.forEach(list, function (value, key) {
                if (utilityService.getValue(value, 'permission_slug') === self.permission.slug) {
                    hasOnlyPermission = hasOnlyPermission || true;
                }
            });

            return hasOnlyPermission;
        };
        this.pyrollTabObj = function (hasAdminAllTabAccess) {
            return{
                "Attendance Regularization": {
                    pTab: 3,
                    tab: 0
                },
                "Claims": {
                    pTab: utilityService.getValue(hasAdminAllTabAccess, 'enabled') ? 3 : 0,
                    tab: utilityService.getValue(hasAdminAllTabAccess, 'enabled') ? 1 : 0
                },
                "Previous Employer Details": {
                    pTab: 3,
                    tab: 5
                },
                "Investment Declaration": {
                    pTab: utilityService.getValue(hasAdminAllTabAccess, 'enabled') ? 3 : 0,
                    tab: utilityService.getValue(hasAdminAllTabAccess, 'enabled') ? 2 : 1
                },
                "Investment Proofs": {
                    pTab: utilityService.getValue(hasAdminAllTabAccess, 'enabled') ? 3 : 0,
                    tab: utilityService.getValue(hasAdminAllTabAccess, 'enabled') ? 3 : 2
                },
                "Loan Advance": {
                    pTab: 3,
                    tab: 8
                },
                "payment": {
                    pTab: 1,
                    tab: 0
                },
                "MinimumWages": {
                    pTab: 2,
                    tab: 3
                },
                "Statutory Filings Due": {
                    pTab: 2,
                    tab: 0
                },
                "PF Accounts Pending": {
                    pTab: 2,
                    tab: 1
                }, 
                "UANs Pending": {
                    pTab: 2,
                    tab: 1
                },
                "ESI Accounts Pending": {
                    pTab: 2,
                    tab: 2
                },
                "full-and-final": {
                    pTab: 3,
                    tab: 7
                },
                "salary-advance": {
                    pTab: 3,
                    tab: 8
                }                
            };
        };
        this.buildMonthObject = function () {
            return {
                1: "Jan",
                2: "Feb",
                3: "Mar",
                4: "Apr",
                5: "May",
                6: "Jun",
                7: "July",
                8: "Aug",
                9: "Sep",
                10: "Oct",
                11: "Nov",
                12: "Dec"
            };
        };
        this.getYearList = function () {
            var d = new Date();
            var currentYear = d.getFullYear();
            var yearList = [];
            for (var i = 0; i <= currentYear - utilityService.startYear; i++) {
                yearList.push(currentYear - i);
            }
            return yearList;
        };
        this.requestStatusObj = function () {
            return {
                1: "Pending",
                2: 'Rejected',
                3: "Approved",
                4: "Cancellation",
                5: "Modified",
                6: "Accelerate Request",
                7: "Accelerated",
                8: "Approved",
                9: 'Rejected',
                10: "Approved",
                11: 'Rejected',
                12: "Approved",               
                13: 'Rejected',
                14: 'Rejected',                
                15: 'Cancel',
                16: 'Escalated'
            };
        };
        this.empRemiderTypeObj = function () {
            return {
                to_declare_investment: 16,
                to_Provide_Prev_Employer_Detail: 17,
                to_Provide_Bank_Detail: 18,
                to_Provide_Investment_Proofs: 19

            };
        };
        this.buildSalarayBandObj = function () {
            return {
                1: {
                    id: 1,
                    band: "0-25000",
                    low: 0,
                    high: 25000,
                    isChecked: false
                },
                2: {
                    id: 2,
                    band: "25000-50000",
                    low: 25000,
                    high: 50000,
                    isChecked: false
                },
                3: {
                    id: 3,
                    band: "50000-75000",
                    low: 50000,
                    high: 75000,
                    isChecked: false
                },
                4: {
                    id: 4,
                    band: "75000-100000",
                    low: 75000,
                    high: 100000,
                    isChecked: false
                },
                5: {
                    id: 5,
                    band: "100000-125000",
                    low: 100000,
                    high: 125000,
                    isChecked: false
                },
                6: {
                    id: 6,
                    band: "125000-150000",
                    low: 125000,
                    high: 150000,
                    isChecked: false
                },
                7: {
                    id: 7,
                    band: "150000-175000",
                    low: 150000,
                    high: 175000,
                    isChecked: false
                },
                8: {
                    id: 8,
                    band: "175000-200000",
                    low: 175000,
                    high: 200000,
                    isChecked: false
                },
                9: {
                    id: 9,
                    band: "More Than 200000",
                    low: 200000,
                    high: 100000000000000000000000,
                    isChecked: false
                }
            };
        };
        this.buildEmployeeStatus = function () {
            return{
                1: {
                    label: 'Pending',
                    value: 1,
                    class: 'qb_violet',
                    isChecked: false
                },
                2: {
                    label: 'On Probation',
                    value: 2,
                    class: 'qb_indigo',
                    isChecked: false
                },
                3: {
                    label: 'Confirmed',
                    value: 3,
                    class: 'qb_blue',
                    isChecked: false
                },
                4: {
                    label: 'Not Joining',
                    value: 4,
                    class: 'qb_green',
                    isChecked: false
                },
                5: {
                    label: 'Exit Initiated',
                    value: 5,
                    class: 'qb_yellow',
                    isChecked: false
                },
                6 : {
                    label: 'Terminated',
                    value : 6,
                    class : 'qb_orange',
                    isChecked: false
                },
                7 : {
                    label: 'Relieved',
                    value : 7,
                    class : 'qb_red',
                    isChecked: false
                },
                22 : {
                    label: 'Absconding',
                    value : 22,
                    class : 'qb_red',
                    isChecked: false
                }
            };
        };
        this.buildMinimumWagesStateVise = function () {
            return [
                {
                    location: 'gurgaon',
                    unskilled: 8280,
                    semi_skilled: 8694,
                    skilled: 10065,
                    supervisory: 10568
                },
                {
                    location: 'mumbai',
                    unskilled: 8256,
                    semi_skilled: 8656,
                    skilled: 9056
                },
                {
                    location: 'bangalore',
                    unskilled: 7905.3,
                    semi_skilled: 7968.48,
                    skilled: 8188.44,
                    supervisory: 8471.84
                }
            ];
        };
        this.wagesEmployee = function () {
            var obj = {
                Q00940317: 50000,
                Q00950317: 66667,
                Q00960317: 8333,
                Q00970317: 33333,
                Q00980317: 66667,
                Q01020417: 33333,
                Q01030417: 10000,
                Q01040417: 8333,
                Q01050417: 40000,
                Q01060417: 133333,
                Q01070417: 100000,
                Q01080417: 200000,
                Q01100417: 50000,
                Q01110417: 10000,
                Q01120417: 13333,
                Q01130417: 16667,
                Q01140417: 20000,
                admin_01: 20000
            };
            return obj;
        };
    }
]);