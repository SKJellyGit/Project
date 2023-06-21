app.service('StatutoryReportsService', ['utilityService',
    function (utilityService) {
        'use strict';
        this.url = {
            report_api_pf: 'payroll/reports/pf',
            report_api_pf_sum: 'payroll/reports/pf-summary',
            report_api_esi: 'payroll/reports/esi',
            report_api_esi_sum: 'payroll/reports/esi-summary',
            report_api_it: 'payroll/reports/it',
            report_api_it_sum: 'payroll/reports/it-summary',
            report_api_bonus: 'payroll/reports/statutory-bonus',
            report_api_lwf: 'payroll/reports/lwf',
            report_api_pt: 'payroll/reports/pt',
            report_api_pfa: 'payroll/reports/pf-arrear',
            report_api_pf_sum_a: 'payroll/reports/pf-arrear-summary',
            report_api_pfwa: 'payroll/reports/pf-without-arrear',
            report_api_pf_sum_w_a: 'payroll/reports/pf-without-arrear-summary',
            states: 'states/IN',
            allEntityPermission: 'payroll/permissions'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildStatutoryReportsObject = function (portal, UAERegion) {
            return {
                viewMode: false,
                currentYear: utilityService.getCurrentYear(),
                currentMonth: utilityService.getCurrentMonth(),
                currentDay: utilityService.getCurrentDay(),
                startYear: utilityService.startYear,
                startMonth: utilityService.startMonth,
                filters: {
                    type: {
                        visible: true,
                        list: [
                            {
                                id: 1,
                                slug: "pf",
                                name: "Provident Fund",
                                abbrev: "PF",
                                buildTableFunction: 'buildReportTableForType_pf',
                                hidden: (UAERegion || ['prod3', 'frontier'].includes(portal))
                            },
                            {
                                id: 2,
                                slug: "pf_sum",
                                name: "Provident Fund Summary",
                                abbrev: "PFS",
                                buildTableFunction: 'buildReportTableForType_pf_summary',
                                reportHeaderText: 'PF Report For Month Of',
                                hidden: (UAERegion || ['prod3', 'frontier'].includes(portal))
                            },
                            {
                                id: 3,
                                slug: "esi",
                                name: "Employee State Insurance",
                                abbrev: "ESI",
                                buildTableFunction: 'buildReportTableForType_esi',
                                hidden: UAERegion
                            },
                            {
                                id: 4,
                                slug: "esi_sum",
                                name: "Employee State Insurance Summary",
                                abbrev: "ESIS",
                                buildTableFunction: 'buildReportTableForType_esi_summary',
                                reportHeaderText: 'ESI Report For Month Of',
                                hidden: UAERegion
                            },
                            {
                                id: 5,
                                slug: "it",
                                name: "Income Tax",
                                abbrev: "IT",
                                buildTableFunction: 'buildReportTableForType_it',
                            },
                            {
                                id: 6,
                                slug: "it_sum",
                                name: "Income Tax Summary",
                                abbrev: "ITS",
                                buildTableFunction: 'buildReportTableForType_it_summary',
                                reportHeaderText: 'Income Tax Report For Month'
                            },
                            {
                                id: 7,
                                slug: "bonus",
                                name: "Bonus & Gratuity",
                                abbrev: "Bonus",
                                buildTableFunction: 'buildReportTableForType_bonus'
                            },
                            {
                                id: 8,
                                slug: "lwf",
                                name: "Labour Welfare Fund",
                                abbrev: "LWF",
                                buildTableFunction: 'buildReportTableForType_lwf'
                            },
                            {
                                id: 9,
                                slug: "pt",
                                name: "Professional Tax",
                                abbrev: "PT",
                                buildTableFunction: 'buildReportTableForType_pt'
                            },
                            {
                                id: 10,
                                slug: "pfwa",
                                name: "Provident Fund without Arrear",
                                abbrev: "PF",
                                buildTableFunction: 'buildReportTableForType_pf',
                                hidden: !(['prod3', 'frontier'].includes(portal))
                            },
                            {
                                id: 11,
                                slug: "pfa",
                                name: "Provident Fund Arrear",
                                abbrev: "PF",
                                buildTableFunction: 'buildReportTableForType_pf',
                                hidden: !(['prod3', 'frontier'].includes(portal))
                            },
                            {
                                id: 12,
                                slug: "pf_sum_w_a",
                                name: "Provident Fund without Arrear Summary",
                                abbrev: "PFS",
                                buildTableFunction: 'buildReportTableForType_pf_summary',
                                reportHeaderText: 'PF Report For Month Of',
                                hidden: !(['prod3', 'frontier'].includes(portal))
                            },
                            {
                                id: 13,
                                slug: "pf_sum_a",
                                name: "Provident Fund Arrear Summary",
                                abbrev: "PFS",
                                buildTableFunction: 'buildReportTableForType_pf_summary',
                                reportHeaderText: 'PF Report For Month Of',
                                hidden: !(['prod3', 'frontier'].includes(portal))
                            }
                        ],
                        selected: null
                    },
                    years: {
                        visible: true,
                        list: utilityService.getYearList(utilityService.startYear),
                        selected: null
                    },
                    months: {
                        visible: true,
                        list: utilityService.buildMonthList(),
                        selected: null
                    },
                    states: {
                        visible: true,
                        list: [],
                        selected: null
                    }
                },
                reports: {
                    headers: [],
                    rows: [],
                    filteredRows: [],
                    visible: false,
                    extraData: null
                }
            };
        };
        this.buildReportTableForType_pf = function(model) {
            // PF wages is now EPS wages as in the pointer bug sheet
            var table = {
                headers: ['S. No', 'Emp Code', 'Emp Name', 'Status', 'Location', 'Department', 'DOJ', 'UAN', 'PF No', 'EPS CONFIRMATION', 'LOP Days', 'Gross', ' EPF Wages', 'Employee PF', 'VPF', 'Total', 'EPS Wages', 'EDLI Wages', 'EPS(8.33%)', 'EPF(3.67%)', 'PF Admin Charges(0.5%)', 'Edli Charges(0.5%)',  'Employer PF', 'Aadhar', 'Remarks'],
                rows: []
            };

            if(!model || !model.length) { return table; }
            angular.forEach(model, function(val, key) {
                var row = [];
                row.push(key+1);
                row.push(utilityService.getValue(val, 'employee_code', ''));
                row.push(utilityService.getValue(val, 'employee_name', ''));
                row.push(utilityService.getValue(val, 'employee_status', 'N/A'));
                row.push(utilityService.getValue(val, 'location', ''));
                row.push(utilityService.getValue(val, 'department', ''));
                row.push(utilityService.getValue(val, 'joining_date', ''));
                row.push(utilityService.getValue(val, 'uan', ''));
                row.push(utilityService.getValue(val, 'pf_number', ''));
                row.push(utilityService.getValue(val, 'epf_confirmation', ''));
                row.push(utilityService.getValue(val, 'lop_days', ''));
                row.push(utilityService.getValue(val, 'gross', ''));
                row.push(utilityService.getValue(val, 'epf_wages', ''));
                row.push(utilityService.getValue(val, 'employee_pf', ''));
                row.push(utilityService.getValue(val, 'vpf', ''));
                row.push(utilityService.getValue(val, 'total', ''));
                row.push(utilityService.getValue(val, 'eps_wages', ''));
                row.push(utilityService.getValue(val, 'edli_wages', ''));
                row.push(utilityService.getValue(val, 'eps(8.33)', ''));
                row.push(utilityService.getValue(val, 'epf(3.67)', ''));
                row.push(utilityService.getValue(val, 'pf_admin(0.5)', ''));
                row.push(utilityService.getValue(val, 'edli_charges(0.5%)', ''));
                row.push(utilityService.getValue(val, 'employer_pf', ''));
                row.push(utilityService.getValue(val, 'aadhar_no', ''));
                row.push(utilityService.getValue(val, 'remarks', ''));
                table.rows.push(row);
            });
            return table;
        };
        this.buildReportTableForType_pf_summary = function(model) {
            var table = {
                headers: ['S. No', 'Legal Entity', 'Employee PF', 'Employer PF', 'Total PF'],
                rows: []
            };
            if(!model || !model.length) { return table; }
            angular.forEach(model, function(val, key) {
                var row = [];
                row.push((key == (model.length-1)) ? '' : (key+1));
                row.push(utilityService.getValue(val, 'title', ''));
                row.push(utilityService.getValue(val, 'employee_pf', ''));
                row.push(utilityService.getValue(val, 'employer_pf', ''));
                row.push(utilityService.getValue(val, 'total_pf', ''));
                table.rows.push(row);
            });
            return table;
        };
        this.buildReportTableForType_esi = function(model) {
            var table = {
                headers: ['S. No.', 'Emp Code', 'Emp Name', 'Status', 'Entity', 'ESI No.', 'Local Dispensary', 'Location', 'Designation', 'DOJ',  'Left Date', 'Date of Birth', 'Aadhar No.', 'PAN No.', 'Pay Days', 'Gross Earn', 'ESI Applicable Amount', 'ESI', 'Er ESI Contribution 3.25%', 'Total Contribution 4%', 'Remarks'],
                rows: []
            };
            if(!model || !model.length) { return table; }
            angular.forEach(model, function(val, key) {
                var row = [];
                row.push(key+1);
                row.push(utilityService.getValue(val, 'employee_code', ''));
                row.push(utilityService.getValue(val, 'employee_name', ''));
                row.push(utilityService.getValue(val, 'employee_status', 'N/A'));
                row.push(utilityService.getValue(val, 'legal_entity', ''));
                row.push(utilityService.getValue(val, 'esi_number', ''));
                row.push(utilityService.getValue(val, 'local_dispensary', ''));
                row.push(utilityService.getValue(val, 'location', ''));
                row.push(utilityService.getValue(val, 'designation', ''));
                row.push(utilityService.getValue(val, 'joining_date', ''));
                row.push(utilityService.getValue(val, 'left_date', ''));
                row.push(utilityService.getValue(val, 'dob', ''));
                row.push(utilityService.getValue(val, 'aadhar_no', ''));
                row.push(utilityService.getValue(val, 'pan_no', ''));
                row.push(utilityService.getValue(val, 'paydays', ''));
                row.push(utilityService.getValue(val, 'gross_earn', ''));
                row.push(utilityService.getValue(val, 'esi_applicable_sum', ''));
                row.push(utilityService.getValue(val, 'esi_employee', ''));
                row.push(utilityService.getValue(val, 'esi_employer', ''));
                row.push(utilityService.getValue(val, 'total_esi_contribution', ''));
                row.push(utilityService.getValue(val, 'remarks', ''));
                table.rows.push(row);
            });
            return table;
        };
        this.buildReportTableForType_esi_summary = function(model) {
            var table = {
                headers: ['S. No', 'Legal Entity', 'Employee ESI', 'Employer ESI', 'Total ESI'],
                rows: []
            };
            if(!model || !model.length) { return table; }
            angular.forEach(model, function(val, key) {
                var row = [];
                row.push((key == (model.length-1)) ? '' : (key+1));
                row.push(utilityService.getValue(val, 'title', ''));
                row.push(utilityService.getValue(val, 'employee_esi', ''));
                row.push(utilityService.getValue(val, 'employer_esi', ''));
                row.push(utilityService.getValue(val, 'total_esi', ''));
                table.rows.push(row);
            });
            return table;
        };
        this.buildReportTableForType_it = function(model, isUAE) {
            var table = {
                headers: ['S. No', 'Emp Code', 'Emp Name', 'Gross Salary', 'Income Tax', 'CESS', 'Total', 'Pan No.', 'Remarks'],
                rows: []
            };
            if(isUAE) {
                var newHeader = table.headers.filter(function(value) {
                    return value !== 'Pan No.'
                })
                table.headers = newHeader
            }
            if(!model || !model.length) { return table; }
            angular.forEach(model, function(val, key) {
                var row = [];
                row.push(key+1);
                row.push(utilityService.getValue(val, 'employee_code', ''));
                row.push(utilityService.getValue(val, 'employee_name', ''));
                row.push(utilityService.getValue(val, 'gross_salary', ''));
                row.push(utilityService.getValue(val, 'it', ''));
                row.push(utilityService.getValue(val, 'cess', ''));
                row.push(utilityService.getValue(val, 'total', ''));
                if(!isUAE) {
                  row.push(utilityService.getValue(val, 'pan_no', ''));
                }
                row.push(utilityService.getValue(val, 'remarks', ''));
                table.rows.push(row);
            });
            return table;
        };
        this.buildReportTableForType_it_summary = function(model) {
            var table = {
                headers: ['S. No', 'Legal Entity', 'Income Tax', 'CESS', 'Total'],
                rows: []
            };
            if(!model || !model.length) { return table; }

            angular.forEach(model, function(val, key) {
                var row = [];
                row.push((key == (model.length-1)) ? '' : (key+1));
                row.push(utilityService.getValue(val, 'title', ''));
                row.push(utilityService.getValue(val, 'it', ''));
                row.push(utilityService.getValue(val, 'cess', ''));
                row.push(utilityService.getValue(val, 'total', ''));
                table.rows.push(row);
            });
            return table;
        };
        this.buildReportTableForType_bonus = function(model) {
            var table = {
                headers: ['S. No.', 'Employee Code', 'Employee Name', 'Status', 'Legal Entity', 'Date of Joining', 'working days', 'Basic Rate', 'Basic', 'Remarks'],
                rows: []
            };
            if(!model || !Object.keys(model).length) { return table; }

            angular.forEach(model, function(val, key) {
                var row = [];
                row.push(key+1);
                row.push(utilityService.getValue(val, 'employee_code', ''));
                row.push(utilityService.getValue(val, 'employee_name', ''));
                row.push(utilityService.getValue(val, 'employee_status', 'N/A'));
                row.push(utilityService.getValue(val, 'legal_entity', ''));
                row.push(utilityService.getValue(val, 'joining_date', ''));
                row.push(utilityService.getValue(val, 'working_days', ''));
                row.push(utilityService.getValue(val, 'basic_rate', ''));
                row.push(utilityService.getValue(val, 'basic', ''));
                row.push(utilityService.getValue(val, 'remarks', ''));
                table.rows.push(row);
            });
            return table;
        };
        this.buildReportTableForType_lwf = function(model, stateCode) {
            var table = {
                headers: [],
                rows: []
            };
            if (stateCode == 'SUMMARY') {
                if(!utilityService.getValue(model, 'state_data', []) 
                    || !utilityService.getValue(model, 'state_data', []).length) { return table; }
            } else {
                if(!model || !model.length) { return table; }
            }
            if(stateCode == 'SUMMARY') {
                table.headers = ['S. No.', 'In Favor of', 'Payable At', 'Total Contribution'];
                var stateData = utilityService.getValue(model, 'state_data', []);
                angular.forEach(stateData, function(val, key) {
                    var row = [];
                    row.push(key+1);
                    row.push(utilityService.getValue(val, 'state', ''));
                    row.push(utilityService.getValue(val, 'state', ''));
                    row.push(utilityService.getValue(val, 'total_contribution', ''));
                    table.rows.push(row);
                });
                table.rows.push(['', '', '', '']);
                table.rows.push(['', 'Grand Total', '', utilityService.getValue(model, 'grand_total', '')]);
            } else {
                table.headers = ['S. No.', 'Employee Code', 'Employee Name', 'Status', 'Work Location', 'LWF Employee Contribution', 'LWF Employer Contribution', 'Remarks'];
                angular.forEach(model, function(val, key) {
                    var row = [];
                    row.push(key+1);
                    row.push(utilityService.getValue(val, 'employee_code', ''));
                    row.push(utilityService.getValue(val, 'employee_name', ''));
                    row.push(utilityService.getValue(val, 'employee_status', 'N/A'));
                    row.push(utilityService.getValue(val, 'work_location', ''));
                    row.push(utilityService.getValue(val, 'lwf_employee', ''));
                    row.push(utilityService.getValue(val, 'lwf_employer', ''));
                    row.push(utilityService.getValue(val, 'remarks', ''));
                    table.rows.push(row);
                });
            }
            return table;
        };
        this.buildReportTableForType_pt = function(model, stateCode) {
            var table = {
                headers: [],
                rows: []
            };
            if (stateCode == 'SUMMARY') {
                if(!utilityService.getValue(model, 'state_data', []) 
                    || !utilityService.getValue(model, 'state_data', []).length) { return table; }
            } else {
                if(!model || !model.length) { return table; }
            }
            if(stateCode == 'SUMMARY') {
                table.headers = ['S. No.', 'State', 'PT', 'PTARR'];
                var stateData = utilityService.getValue(model, 'state_data', []);
                angular.forEach(stateData, function(val, key) {
                    var row = [];
                    row.push(key+1);
                    row.push(utilityService.getValue(val, 'state', ''));
                    row.push(utilityService.getValue(val, 'pt_sum', ''));
                    row.push(utilityService.getValue(val, 'pt_arr', ''));
                    table.rows.push(row);
                });
                table.rows.push(['', '', '', '']);
                table.rows.push(['', 'Grand Total', utilityService.getInnerValue(model, 'grand_total', 'pt', ''), utilityService.getInnerValue(model, 'grand_total', 'pt_arr', '')]);
            } else {
                table.headers = ['S. No.', 'Employee Code', 'Employee Name', 'Status', 'Entity', 'Gross Salary', 'PTax', 'Remarks'];
                angular.forEach(model, function(val, key) {
                    var row = [];
                    row.push(key+1);
                    row.push(utilityService.getValue(val, 'employee_code', ''));
                    row.push(utilityService.getValue(val, 'employee_name', ''));
                    row.push(utilityService.getValue(val, 'employee_status', 'N/A'));
                    row.push(utilityService.getValue(val, 'legal_entity', ''));
                    row.push(utilityService.getValue(val, 'gross_earn', ''));
                    row.push(utilityService.getValue(val, 'pt', ''));
                    row.push(utilityService.getValue(val, 'remarks', ''));
                    table.rows.push(row);
                });
            }
            return table;
        };

        this.extractLastRow = function (model, typeSlug) {
            var lastRow = []
            if(typeSlug === 'pf') {
                lastRow.push([''])
                lastRow.push(['Overall Summary:'])
                lastRow.push(['Total PF Salary', ':', utilityService.getValue(model, 'total_pf', '')])
                lastRow.push(['Gross for EPS Calculation', ':', utilityService.getValue(model, 'total_eps', '')])
                lastRow.push([''])
                lastRow.push(['Employee PF (12%)', ':', utilityService.getValue(model, 'total_employee_pf', '')])
                lastRow.push(['Employer PF (3.67%)', ':', utilityService.getValue(model, 'total_employer_pf', '')])
                lastRow.push(['Pension Fund (8.33%)', ':', utilityService.getValue(model, 'pension_fund', '')])
                lastRow.push(['PF Admin Charges (0.5%)', ':', utilityService.getValue(model, 'pf_admin_charges', '')])
                lastRow.push(['EDLI Charges (0.5%)', ':',  utilityService.getValue(model, 'edli_charges', '')])
                lastRow.push(['Total', ':', utilityService.getValue(model, 'total', '')])
            }

            if(typeSlug === 'it') {
                var totalGross = utilityService.getValue(model, 'total_gross', ''),
                totalIt =  utilityService.getValue(model, 'total_it', ''),
                totalCess =  utilityService.getValue(model, 'total_cess', ''),
                totalSum=  utilityService.getValue(model, 'total_sum', '');

                lastRow.push(['', '', 'Total', totalGross, totalIt, totalCess, totalSum, ''])
            }

            if(typeSlug == 'esi') {
                var row = [];
                row.push('');
                row.push(utilityService.getValue(model, 'employee_code', ''));
                row.push('Total');
                row.push(utilityService.getValue(model, 'legal_entity', ''));
                row.push(utilityService.getValue(model, 'esi_number', ''));
                row.push(utilityService.getValue(model, 'local_dispensary', ''));
                row.push(utilityService.getValue(model, 'location', ''));
                row.push(utilityService.getValue(model, 'designation', ''));
                row.push(utilityService.getValue(model, 'joining_date', ''));
                row.push(utilityService.getValue(model, 'left_date', ''));
                row.push(utilityService.getValue(model, 'dob', ''));
                row.push(utilityService.getValue(model, 'aadhar_no', ''));
                row.push(utilityService.getValue(model, 'pan_no', ''));
                row.push(utilityService.getValue(model, 'paydays', ''));
                row.push(utilityService.getValue(model, 'gross_earn', ''));
                row.push(utilityService.getValue(model, 'total_esi', ''));
                row.push(utilityService.getValue(model, 'total_er_esi', ''));
                row.push(utilityService.getValue(model, 'total_contribution', ''));
                lastRow.push(row)
            }

            return lastRow;
        }

        return this;
    }
]);
