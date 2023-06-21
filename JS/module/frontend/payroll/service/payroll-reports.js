app.service('PayrollReportsService', ['utilityService',
    function (utilityService) {
        'use strict';
        var self = this;

        this.url = {
            modulePermission: 'employee/module-permission',
            downloadSalaryCsv: 'payroll/download-salary-csv',
            monthlySalaryBreakup: 'payroll/reports/monthly-compensation-salary-breakup',
            annualSalaryBreakup: 'payroll/reports/annual-compensation-salary-breakup',
            relievedAnnualSalaryBreakup: 'payroll/reports/relieved-annual-compensation-salary-breakup',
            downloadIncomeTax: 'payroll/reports/download-bulk-tax-sheet',
            downloadAutomationIncomeTax: 'payroll/reports/tax-computation',
            paidTillDate: 'payroll/reports/paid-till-date',
            downloadFndF: 'payroll/reports/fnf',
            olddownloadFndF: 'payroll/multi-legal-reports/download-fndf',
            annualSalaryBreakupHistory: 'payroll/reports/compensation-salary-breakup-history',
            journalVoucher: 'payroll/reports/journal-voucher',
            allEntityPermission: 'payroll/permissions',
            pendingClaimReport: "payroll/pending-claim-report",
            salary24q: 'payroll/24q-salary',
            deductions24q: 'payroll/24q-deductions',
            emiratesList: 'payroll/emirates',
            wpsReport: 'payroll/reports/wps',
            ytdReport: 'payroll/reports/ytd-report',
            payrollAutomation: 'payroll/automation-details'


        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildReportList = function (envMnt, automation) {
            var list = [{
                    'name': 'Monthly Salary Breakup Report',
                    'id': 'csb',
                    'module': 'Compensation',
                    'loading': false,

                }, {
                    'name': 'Annual Salary Breakup Report',
                    'id': 'casb',
                    'module': 'Compensation',
                    'loading': false
                }, {
                    'name': 'Annual Salary Breakup Report (Relieved Employees)',
                    'id': 'crasb',
                    'module': 'Compensation',
                    'loading': false
                }, {
                    'name': 'Tax Sheet Report',
                    'id': 'taxsh',
                    'module': 'Compensation',
                    'loading': false,
                    'dropdown': {
                        'visible': true,
                        'year': false,
                        'quater': false,
                        'normalYear': automation && true,
                        'months': automation && true
                    }
                }, 
                {
                    'name': 'Paid Till Date Report',
                    'id': 'ptd',
                    'module': 'Compensation',
                    'loading': false
                }, 
                
                {
                    'name': 'YTD Report',
                    'id': 'ytd',
                    'module': 'Compensation',
                    'loading': false,
                    'dropdown': {
                        'visible': true,
                        'year': true,
                        'fromMonth': true,
                        'toMonth': true,
                        'fromMonthValue': null,
                        'toMonthValue': null
                    }
                }, 
                
                {
                    'name': 'Full & Final Report',
                    'id': 'cfndf',
                    'module': 'Compensation',
                    'loading': false,
                    'dropdown': {
                        'visible': true,
                        'year': true,
                    }
                }, {
                    'name': 'Annual Salary Breakup History Report',
                    'id': 'casbh',
                    'module': 'Compensation',
                    'loading': false
                },
                {
                    'name': "Claims Outstanding Report",
                    'id': 'ccor',
                    'module': 'Compensation',
                    'loading': false
                },
                {
                    'name': "24q-deductions Report",
                    'id': 'c24qd',
                    'module': 'Compensation',
                    'loading': false,
                    'dropdown': {
                        'visible': true,
                        'year': true,
                        'quater': true
                    }

                },
                {
                    'name': "24q-salary Report",
                    'id': 'c24qs',
                    'module': 'Compensation',
                    'loading': false,
                    'dropdown': {
                        'visible': true,
                        'year': true,
                        'quater': false
                    }
                },
                {
                    'name': "WPS Report",
                    'id': 'cwpsr',
                    'module': 'Compensation',
                    'loading': false,
                    'dropdown': {
                        'visible': true,
                        'payrollYear': true,
                        'months': true,
                        'emirates': true
                    }
                },
            ];

            if (envMnt == 'autoninja' || envMnt == 'cogoport' || envMnt == 'zaggle'
                    || envMnt == 'local' || envMnt == 'prod3') {
                list.push({
                    'name': 'Monthly Salary Report (Before Qandle)',
                    'id': 'cmsb',
                    'module': 'Compensation'
                });
            }

            if (envMnt == 'powergroups' || envMnt == 'prod4' || envMnt == 'prod1'
                    || envMnt == 'local' || envMnt == 'prod3' || envMnt == 'prod2'
                    || envMnt == 'imaginetechservices' || envMnt == 'energyengg'
		    || envMnt == 'hrconnect') {
                list.push({
                    'name': 'Salary Journal Voucher Template',
                    'id': 'sjvt',
                    'module': 'Compensation'
                });
            }

            return list;
        };
        this.buildReportObject = function (envMnt, automation) {
            return {
                module: 'payroll',
                list: this.buildReportList(envMnt, automation),
                visible: false,
                hasPermission: false,
                permissionSlug: "can_view_compensation_report"
            };
        };
        this.buildMonthObject = function () {
            return {
                1: "January",
                2: "February",
                3: "March",
                4: "April",
                5: "May",
                6: "June",
                7: "July",
                8: "August",
                9: "September",
                10: "October",
                11: "November",
                12: "December"
            }
        };
        this.getDaysInMonth = function (y, m) {
            return m === 2 ? y & 3 || !(y % 25) && y & 15 ? 28 : 29 : 30 + (m + (m >> 3) & 1);
        };
        var pushRowToArray = function (column) {
            var rowArray = new Array();

            rowArray.push(column.vType);
            rowArray.push(column.date);
            rowArray.push(column.voucherNo);
            rowArray.push(column.company);
            rowArray.push(column.division);
            rowArray.push(column.account);
            rowArray.push(column.narration);
            rowArray.push(column.debitAmount);
            rowArray.push(column.creditAmount);

            return rowArray;
        };
        this.getGroupElementName = function (groups) {
            return utilityService.getInnerValue(groups, 0, 'name');
        };
        this.buildJournalVoucherCSVContent = function (data, year, month) {
            var heads = utilityService.getValue(data, 'heads'),
                    list = utilityService.getValue(data, 'rows'),
                    monthObject = {
                        mapping: this.buildMonthObject(),
                        days: this.getDaysInMonth(year, month)
                    },
                    column = {
                        vType: 'Cn4',
                        date: month + '/' + monthObject.days + '/' + year,
                        voucherNo: 0,
                        account: null,
                        narration: 'SALARY FOR THE MONTH OF ' + monthObject.mapping[month].toUpperCase() + ' ' + year,
                        debitAmount: null,
                        creditAmount: null,
                        company: null,
                        division: null
                    },
                    object = {
                        content: []
                    };

            object.content.push(["Vtype", "Date", "VoucherNo", "Company", "Division", "Account",
                "Narration", "Debit Amt", "Credit Amt"]);

            angular.forEach(list, function (value, key) {
                if (utilityService.getValue(value, 'total_net_pay')) {

                    column.voucherNo = column.voucherNo + 1;
                    column.company = self.getGroupElementName(utilityService.getInnerValue(value, 'employee_preview', 'work_profile_company_detail', []));
                    column.division = self.getGroupElementName(utilityService.getInnerValue(value, 'employee_preview', 'work_profile_division_detail', []));
                    column.account = utilityService.getInnerValue(value, 'employee_preview', 'full_name');
                    column.debitAmount = null;
                    column.creditAmount = utilityService.getValue(value, 'total_net_pay', 'N/A');
                    object.content.push(pushRowToArray(column));

                    column.account = 'Tax Deduction Amount';
                    column.debitAmount = null;
                    column.creditAmount = utilityService.getValue(value, 'tax_deduction_amount', 'N/A');
                    object.content.push(pushRowToArray(column));

                    angular.forEach(utilityService.getValue(heads, 'debit_components', []), function (v, k) {
                        if (utilityService.getValue(value, v.slug)) {
                            column.account = (utilityService.getValue(v, 'slug') == 'advance'
                                    || utilityService.getValue(v, 'slug') == 'other_deduction')
                                    ? utilityService.getInnerValue(value, 'employee_preview', 'full_name')
                                    : utilityService.getValue(v, 'component_name');
                            column.debitAmount = null;
                            column.creditAmount = utilityService.getValue(value, v.slug);
                            object.content.push(pushRowToArray(column));
                        }
                    });

                    angular.forEach(utilityService.getValue(heads, 'credit_components', []), function (v, k) {
                        if (utilityService.getValue(value, v.slug)) {
                            column.account = (utilityService.getValue(v, 'slug') == 'advance'
                                    || utilityService.getValue(v, 'slug') == 'other_deduction')
                                    ? utilityService.getInnerValue(value, 'employee_preview', 'full_name')
                                    : utilityService.getValue(v, 'component_name');
                            column.debitAmount = utilityService.getValue(value, v.slug);
                            column.creditAmount = null;
                            object.content.push(pushRowToArray(column));
                        }
                    });
                }
            });

            return object;
        };


        this.buildClaimsOutstandingReport = function (data) {

// 			0: {component_name: "Leave Travel Allowance", slug: "leave_travel_allowance"}
// 1: {component_name: "Fuel", slug: "fuel"}
// 2: {component_name: "Telephone/Mobile Reimbursement", slug: "telephone/mobile_reimbursement"}
// 3: {component_name: "Driver Salary", slug: "driver_salary"}
// 4: {component_name: "Books & Periodicals", slug: "books_&_periodicals"}
// 5: {component_name: "Car Maintenance", slug: "car_maintenance"}
// 6: {component_name: "Zeta Food", slug: "zeta_food"}
// 7: {component_name: "Driver Salary 1", slug: "Driver_Salary_1"}
// 8: {component_name: "Car Maintenance 1", slug: "Car_Maintenance_1"}
// 9: {component_name: "Car Petrol", slug: "car_petrol"}
// 10: {component_name: "Internet Claim", slug: "internet_claim
            var headers = ["Leave Travel Allowance", "Fuel", "Telephone/Mobile Reimbursement", ""],
                    contents = [];

            angular.forEach(utilityService.getInnerValue(data, 'data', 'heads'), function (value, key) {
                headers.push(value);
            });

            angular.forEach(utilityService.getInnerValue(data, 'data', 'rows'), function (value, key) {
                contents.push(value);

            });

            angular.forEach(contents, function (value, key) {
                console.log(value);

            })



            return headers;
        };

        this.getWPAname = function() {
            var format = "YYMMDDmmss";
            var date = new Date();
            return moment(date).format(format);
        }

        return this;
    }
]);
