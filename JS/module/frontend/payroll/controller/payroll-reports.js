app.controller('PayrollReportsController', [
	'$scope', '$timeout', '$modal', 'utilityService', 'ServerUtilityService', 'PayrollReportsService', 'PayrollParentService',
	function ($scope, $timeout, $modal, utilityService, serverUtilityService, service, parentService) {
        $scope.report = service.buildReportObject($scope.envMnt, $scope.runPayrollAutomate.enabled);

        $scope.getRunPayrollAutomationReport = function () {
            var url = service.getUrl('payrollAutomation');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    console.log(data)
                    $scope.runPayrollAutomate.enabled = utilityService.getInnerValue(data, 'data', 'payroll_automation', false)
                    $scope.runFnfAutomate.enabled  = utilityService.getInnerValue(data, 'data', 'fnf_automation', false)
                    $scope.report = service.buildReportObject($scope.envMnt, utilityService.getInnerValue(data, 'data', 'payroll_automation', false));
                        
                });
        };
        $scope.getRunPayrollAutomationReport();
        $scope.templateObject = parentService.buildTemplateObject();

        $scope.legal_entity = {
            selected: null,
            entity_id: utilityService.getStorageValue("legalEntityId")
        };
        var months = {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "June",
            7: "July",
            8: "Aug",
            9: "Sept",
            10: "Oct",
            11: "Nov",
            12: "Dec"
        }
        $scope.emirates = {
            list: [],
            years: utilityService.getYearList(2018),
            months: months,
            selected: {
                month: null,
                year: null,
                emirate: null
            }
        }
        $scope.financialYearHaspMap = {
            1: 4,
            2: 5,
            3: 6,
            4: 7,
            5: 8,
            6: 9,
            7: 10,
            8: 11,
            9: 12,
            10: 1,
            11: 2,
            12: 3
        }
        $scope.fyMonths = {
            months: ['Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar' ],
        }
        $scope.getLegalEntity = function() {
            if($scope.legal_entity.entity_id) {
                var entities_list = JSON.parse(utilityService.getStorageValue("legalEntityElements"));
                $scope.legal_entity.selected = entities_list.find(function(val) { return val._id == $scope.legal_entity.entity_id; });
            } else {
                $scope.legal_entity.selected = null;
            }
        };
        $scope.currentYear = utilityService.getCurrentYear()
        $scope.getLegalEntity();
        var reportPermissionCallback = function(data) {
            angular.forEach(data.data, function(value, key) {
                value._id = angular.isObject(value._id) ? value._id.$id : value._id;
                if(utilityService.getValue(value, "permission_slug") === utilityService.getValue($scope.report, "permissionSlug")){
                    $scope.report.hasPermission = true; 
                }                
            });          
            
            $scope.report.visible = true;
        };
        var getReportPermissions = function() {
            var url = service.getUrl('modulePermission') + "/" + $scope.report.module;
                
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    reportPermissionCallback(data);
                });
        };
        getReportPermissions();        
        var exportToCsv = function(object, filename) {
            utilityService.exportToCsv(object.content, filename);
        };
        $scope.report24q = {
            year:  {
            list: utilityService.getYearList(utilityService.startYear),
            selected: {
                c24qd: null,
                c24qs: null,
                cfndf: null,
            }
            },
            quarter: {
                list: [
                {
                    name: 'Q1',
                    value: 1
                },
                {
                    name: 'Q2',
                    value: 2
                },
                {
                    name: 'Q3',
                    value: 3
                },
                {
                    name: 'Q4',
                    value: 4
                },
            ],
                selected: {
                    c24qd: null,
                    c24qs: 4
                }
            }
        }

        $scope.year = {
            list: utilityService.getYearList(2020),
            selected: null
        }

        var getMonthlyAnnualSalaryBreakup = function (keyname, item) {
            item.loading = true;
            var fileNameMapping = {
                monthlySalaryBreakup: 'compensation-monthly-salary-breakup',
                annualSalaryBreakup: 'compensation-annual-salary-breakup',
                relievedAnnualSalaryBreakup: 'compensation-annual-salary-breakup-for-relieved-employees',
                annualSalaryBreakupHistory: 'compensation-annual-salary-breakup-history',
                pendingClaimReport: "claims-outstanding-report",
                deductions24q: '24q-deductions-report',
                salary24q: '24q-salary-report'
            },
            param = {};

            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                param['all-legal-entities'] = true;
            }

            serverUtilityService.getWebService(service.getUrl(keyname), param)
                .then(function (data) {
                    var headers = [],
                        contents = [];

                    angular.forEach(utilityService.getInnerValue(data, 'data', 'heads') , function(value, key) {
                        headers.push(value);
                    });

                    angular.forEach(utilityService.getInnerValue(data, 'data', 'rows'), function(value, key) {
                        contents.push(value);
                    });

                    var object = parentService.buildCSVContent(headers, contents, $scope.templateObject.hashMap);
                    var filename = fileNameMapping[keyname];
                    if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                        filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                    }
                    filename += '.csv';
                    exportToCsv(object, filename);
                    item.loading = false;
                });
        };


        var get24qReport = function (keyname, item) {
            item.loading = true;
            var fileNameMapping = {
                deductions24q: '24q-deductions-report',
                salary24q: '24q-salary-report'
            },
            // payroll/24q-salary/2019/2020/4
            param = {};

            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                param['all-legal-entities'] = true;
            }

            var url = service.getUrl(keyname) + '/' + $scope.report24q.year.selected[item.id] + '/' + ($scope.report24q.year.selected[item.id] + 1) + '/' + $scope.report24q.quarter.selected[item.id];

            serverUtilityService.getWebService(url, param)
                .then(function (data) {
                    var headingText = [],
                        headers = [],
                        contents = [];
                    var heads = utilityService.getInnerValue(data, 'data', 'heads') 
                    ? utilityService.getInnerValue(data, 'data', 'heads')
                    : utilityService.getInnerValue(data, 'data', 'heads2')

                    if(utilityService.getInnerValue(data, 'data', 'head1')) {
                        angular.forEach(utilityService.getInnerValue(data, 'data', 'head1'), function(value, key) {
                            headingText.push(value);
                        });
                    }


                    angular.forEach(heads, function(value, key) {
                        headers.push(value);
                    });

                    angular.forEach(utilityService.getInnerValue(data, 'data', 'rows'), function(value, key) {
                        contents.push(value);
                    });

                    var object = parentService.buildCSVContent(headers, contents, $scope.templateObject.hashMap, headingText);
                    var filename = fileNameMapping[keyname];
                    if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                        filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                    }
                    filename += '.csv';
                    exportToCsv(object, filename);
                    item.loading = false;
                });
        };



        var downloadMonthlyPayableSalary = function() {
            $scope.openModal('monthly-salary.tmpl.html', 'monthlySalary');
        };
        var downloadIncomeTaxReport = function (automation) {
            var url = service.getUrl('downloadIncomeTax');
            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                url = url + "?all-legal-entities=true";
            }

            $scope.viewDownloadFileUsingForm(url);
          
        };
        var downloadAutomationIncomeTax = function (item) {
            item.loading = true;
            var filename = 'tax-computation'
            param = {};

            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                param['all-legal-entities'] = true;
            }
            var url = service.getUrl('downloadAutomationIncomeTax') + '/' + $scope.year.selected + '/' + $scope.emirates.selected.month;
                serverUtilityService.getWebService(url, param)
                .then(function (data) {
                    console.log(data)
                    var headers = [],
                        contents = [];

                    angular.forEach(utilityService.getInnerValue(data, 'data', 'heads') , function(value, key) {
                        headers.push(value);
                    });

                    angular.forEach(utilityService.getInnerValue(data, 'data', 'rows'), function(value, key) {
                        contents.push(value);
                    });

                    var object = parentService.buildCSVContent(headers, contents, $scope.templateObject.hashMap);
                    if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                        filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                    }
                    filename += '.csv';
                    exportToCsv(object, filename);
                    item.loading = false;
                })
        }
        var paidTillDateReport = function() {
            var url = service.getUrl("paidTillDate"),
                filename = 'Paid_Till_Date_Report',
                param = {};

            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                param['all-legal-entities'] = true;
            }

            serverUtilityService.getWebService(url, param)
                .then(function (data) {
                    var object = parentService.buildCSVContent(data.data.heads, data.data.rows);
                    if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                        filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                    }
                    filename += '.csv';
                    utilityService.exportToCsv(object.content, filename);
                });
        };
      
        var ytdReport = function(item) {
            item.loading = true;
            console.log(item)

            var url = service.getUrl("ytdReport"),
                filename = 'ytdReport',
                param = {
                    "fy_start": $scope.report24q.year.selected[item.id],
                    "fy_end": $scope.report24q.year.selected[item.id] + 1,
                    "from_month": $scope.financialYearHaspMap[item.dropdown.fromMonthValue],
                    "to_month" : $scope.financialYearHaspMap[item.dropdown.toMonthValue]
                };

            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                param['all-legal-entities'] = true;
            }

            serverUtilityService.postWebService(url, param)
                .then(function (data) {
                    var object = parentService.buildCSVContent(data.data.heads, data.data.rows);
                    if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                        filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                    }
                    filename += '.csv';
                    utilityService.exportToCsv(object.content, filename);
                }).finally(function(){
                    item.loading = false;
                });
        };
        var downloadIncomeTaxReport = function () {
            var url = service.getUrl('downloadIncomeTax');
            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                url = url + "?all-legal-entities=true";
            }

            $scope.viewDownloadFileUsingForm(url);
        };

        var downloadFndFReportOldMethod = function (item) {
            var url = service.getUrl('olddownloadFndF');
            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                url = url + "?all-legal-entities=true";
            }
        
            $scope.viewDownloadFileUsingForm(url);
        };


        var extractMandatoryGroupName = function (array) {
            return array.map(function(elem){
                return elem.name;
            }).join(",");
        };
        var addMandatoryGroupsToList = function (v) {            
            angular.forEach($scope.groupList, function (value, key) {
                var array = utilityService.getInnerValue(v, 'employee_preview', value.slug + '_detail', []);
                v[value.slug] = array.length ? extractMandatoryGroupName(array) : null;
            });
        };  
        var extractEmployeeData = function (data) {
            angular.forEach(data, function (v) {
              
                // v.joining_date = angular.isDefined(v.employee_preview.work_profile_joining_date) 
                //     ? v.employee_preview.work_profile_joining_date : 'not defined';

                v.employee_name = utilityService.getInnerValue(v, 'employee_preview', 'full_name', '-');
                v.employee_code = utilityService.getInnerValue(v, 'employee_preview', 'personal_profile_employee_code', '-');
                v.location = angular.isDefined(v.employee_preview.work_profile_location_detail) && v.employee_preview.work_profile_location_detail.length 
                    ? v.employee_preview.work_profile_location_detail[0].name : 'not defined';

                v.department = angular.isDefined(v.employee_preview.work_profile_department_detail) && v.employee_preview.work_profile_department_detail.length 
                    ? v.employee_preview.work_profile_department_detail[0].name : 'not defined';
                v.bankName = utilityService.getInnerValue(v, 'employee_preview', 'bank_name', '-');
                v.accountNo = utilityService.getInnerValue(v, 'employee_preview', 'bank_account_number', '-');
                v.ifsc = utilityService.getInnerValue(v, 'employee_preview', 'ifsc_code', '-');
                v.pan = utilityService.getInnerValue(v, 'employee_preview', 'pan', '-');
                
                addMandatoryGroupsToList(v);
            });
        };

        var downloadFndFReportNewMethod = function(item) {
            item.loading = true;
            console.log($scope.groupList )
            var url = service.getUrl('downloadFndF') + '/' + $scope.report24q.year.selected[item.id] + '/' + ($scope.report24q.year.selected[item.id] + 1);
            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                url = url + "?all-legal-entities=true";
            }

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    extractEmployeeData(utilityService.getInnerValue(data, 'data', 'rows', []));
                    var hardocodedFields = {
                        'Employee Name' : 'employee_name',
                        'Employee Code' : 'employee_code',
                        'Account Number': 'accountNo',
                        'Bank Name': 'bankName',
                        'IFSC Code': 'ifsc',
                        'PAN Card No': 'pan'
                    }
                    var headers = [],
                        contents = [];
                    angular.forEach(hardocodedFields, function (value, key) {
                        headers.push(
                            {
                                'component_name': key,
                                'slug': value
                            }
                        )
                    });
                    angular.forEach($scope.groupList, function (v, k) {
                        headers.push(
                            {
                                'component_name': v.name,
                                'slug': v.slug
                            }
                        )
                    });
                    angular.forEach(utilityService.getInnerValue(data, 'data', 'heads') , function(value, key) {
                        headers.push(value);
                    });

                    angular.forEach(utilityService.getInnerValue(data, 'data', 'rows'), function(value, key) {
                        contents.push(value);
                    });

                    var object = parentService.buildCSVContent(headers, contents, $scope.templateObject.hashMap);
                    var filename = 'fnf-report';
                    if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                        filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                    }
                    filename += '.csv';
                    exportToCsv(object, filename);
                    item.loading = false;
                });

        }

        var downloadFndFReport = function (item) {
            if (!$scope.runFnfAutomate.enabled) {
                downloadFndFReportOldMethod(item)
            } else {
                downloadFndFReportNewMethod(item)
            }
        };

        
        var getSalaryJournalVoucherTemplate = function() {
            $scope.openModal('salary-journal-voucher.tmpl.html', 'monthlySalary');
        };
        $scope.downloadSalaryBreakup = function(item) {
            if(item.id == 'cmsb') { //done
                downloadMonthlyPayableSalary();
            } else if(item.id === 'csb') { //done
                getMonthlyAnnualSalaryBreakup('monthlySalaryBreakup', item);
            } else if (item.id === 'casb') { //done
                getMonthlyAnnualSalaryBreakup('annualSalaryBreakup', item);
            } else if (item.id === 'crasb') { //done
                getMonthlyAnnualSalaryBreakup('relievedAnnualSalaryBreakup', item);
            } else if (item.id === 'taxsh') { //done
                if($scope.runPayrollAutomate.enabled){
                    downloadAutomationIncomeTax(item)
                }else{
                    downloadIncomeTaxReport();
                }
            } else if(item.id == 'ptd') { //done
                paidTillDateReport();
            } else if (item.id === 'cfndf') { //done
                downloadFndFReport(item);
            } else if (item.id === 'casbh') { //done
                getMonthlyAnnualSalaryBreakup('annualSalaryBreakupHistory', item);
            } else if(item.id == 'sjvt') { //done
                getSalaryJournalVoucherTemplate();
            } else if (item.id == 'ccor') {
                getMonthlyAnnualSalaryBreakup('pendingClaimReport', item)
            } else if (item.id == 'c24qd') {
                get24qReport('deductions24q', item)
            } else if (item.id == 'c24qs') {
                get24qReport('salary24q', item)
            } else if(item.id == 'cwpsr'){
                getWPSreport('wps', item)
            }else if(item.id  = 'ytd'){
                ytdReport(item)
            }
        };

       

        var claimsOutstandingReport = function (keyname) {
            var param = {};
            
            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                param['all-legal-entities'] = true;
            }
            serverUtilityService.getWebService(service.getUrl(keyname), param)
            .then(function (data) {


                
                // var headers = [],
                //     contents = [];

                // angular.forEach(utilityService.getInnerValue(data, 'data', 'heads'), function(value, key) {
                //     headers.push(value);
                // });

                // angular.forEach(utilityService.getInnerValue(data, 'data', 'rows'), function(value, key) {
                //     contents.push(value);
                // });

                var object = parentService.buildClaimsOutstandingReport(data)


                var filename = "claims-outstanding-report";
               
                filename += '.csv';

                exportToCsv(object, filename);
            });
        }

        /********** Start: Section for Monthly Salary Slip **********/
        $scope.slip = {
            type: 1,
            download: true,
            yearList: utilityService.getYearList(utilityService.startYear),
            currentYear: utilityService.getCurrentYear(),
            monthList: utilityService.buildMonthList(),
            currentMonth: utilityService.startMonth,
            year: null,
            month: null
        };
        $scope.changeSlipYear = function() {
            $scope.slip.month = null;
        };
        $scope.isSalarySlipMonthVisible = function(index) {
            var isVisible = false,
                currYear = utilityService.getCurrentYear(),
                currMonth = utilityService.getCurrentMonth(),
                currDay = utilityService.getCurrentDay();

            if($scope.slip.year >= currYear) {
                if (index < currMonth 
                    || (index == currMonth && currDay >= utilityService.payrollProcessingDay)) {
                    isVisible = true;
                }            
            } else {
                if($scope.slip.year == utilityService.startYear) {
                    isVisible = $scope.envMnt == 'norlanka' 
                        ? index >= utilityService.norlankaStartMonth
                        : index >= utilityService.startMonth;                 
                } else { 
                    isVisible = true;
                }               
            }
            
            return isVisible;
        };
        $scope.isSalarySlipYearVisible = function(item) {
            var isVisible = false,
                currYear = utilityService.getCurrentYear(),
                currMonth = utilityService.getCurrentMonth(),
                currDay = utilityService.getCurrentDay();

            if (item >= currYear && (currMonth > 1 || currDay >= utilityService.payrollProcessingDay)) {
                isVisible = true;
            } else if(item == utilityService.startYear 
                || (item < currYear && item > utilityService.startYear)) {
                isVisible = true;
            }

            return isVisible;
        };
        $scope.downloadMonthlySalaryTemplate = function() {
            var url = service.getUrl('downloadSalaryCsv') + "/" + $scope.slip.year + "/" + $scope.slip.month + '?is_report=true';
            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                url = url + "&all-legal-entities=true";
            }

            $scope.viewDownloadFileUsingForm(url);
        };
        /********** End: Section for Monthly Salary Slip **********/
        
        /********* Start Angular Modal Section *********/
        $scope.openModal = function(templateUrl, keyName) {
            $scope.modalInstance[keyName] = $modal.open({
                templateUrl : templateUrl,
                scope : $scope,
                windowClass : 'fadeEffect'
            });
        };
        $scope.closeModal = function(keyName) {
            if(utilityService.getValue($scope.modalInstance, keyName)) {
                $scope.modalInstance[keyName].dismiss();
            }            
        };
        /********** End: Section for Monthly Salary Slip **********/

        /***** Start: Salary Journal Voucher Section *****/
        var exportToCsv = function(object, filename) {
            utilityService.exportToCsv(object.content, filename);
        };
        var journalVoucherCallback = function (data) {
            var data = utilityService.getValue(data, 'data'),
                year = parseInt($scope.slip.year, 10),
                month = parseInt($scope.slip.month, 10),
                object = service.buildJournalVoucherCSVContent(data, year, month),
                filename = 'salary-journal-voucher-template-' + month + '-' + year + '.csv';
            
            $timeout(function () {
                exportToCsv(object, filename);
                $scope.formSubmitHandler('downloadReport', false);
            }, 1000);            
        };
        $scope.downloadSalaryJournalVoucherTemplate = function () {
            $scope.formSubmitHandler('downloadReport', true);
            var url = service.getUrl("journalVoucher"),
                params = {
                    year: parseInt($scope.slip.year, 10),
                    month: parseInt($scope.slip.month, 10)
                };

            if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                params['all-legal-entities'] = true;
            }

            serverUtilityService.getWebService(url, params)
                .then(function (data) {                
                    journalVoucherCallback(data);
                });
        };
        /***** End: Salary Journal Voucher Section *****/

        /***** Start: Get Payroll All Entity Permission Section *****/
        var getPayrollAllEntityPermission = function () {
            $scope.wrapperObject.allEntityReport.selectedOption = '';
            serverUtilityService.getWebService(service.getUrl('allEntityPermission'))
                .then(function(data) {                    
                    $scope.wrapperObject.allEntityReport.hasPermission = utilityService.getValue(data, 'data', []).indexOf($scope.wrapperObject.allEntityReport.permissionSlug) >= 0;
                });
        };
        if (utilityService.getInnerValue($scope.wrapperObject, 'legalEntity', 'enabled') 
            && utilityService.getInnerValue($scope.wrapperObject, 'legalEntity', 'id')
            && utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'enabled')) {
            getPayrollAllEntityPermission();
        }        
        /***** End: Get Payroll All Entity Permission Section *****/
        var getEmpirates = function() {
            var url = service.getUrl('emiratesList')
            serverUtilityService.getWebService(url)
                .then(function(data) {                    
                    $scope.emirates.list = data.data;
                });
        }
        getEmpirates()

        var getWPSreport = function (keyname, item) {
            item.loading = true;
           var param = {
                year: $scope.emirates.selected.year,
                month: $scope.emirates.selected.month,
                emirate: $scope.emirates.selected.emirate._id
            };
            var url = service.getUrl('wpsReport')+'/'+param.year+'/'+param.month+'/'+param.emirate

            // if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
            //     param['all-legal-entities'] = true;
            // }

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    var headers = [],
                        contents = [];

                    angular.forEach(utilityService.getInnerValue(data, 'data', 'heads') , function(value, key) {
                        headers.push(value);
                    });

                    angular.forEach(utilityService.getInnerValue(data, 'data', 'rows'), function(value, key) {
                        contents.push(value);
                    });

                    var object = parentService.buildCSVContent(headers, contents, $scope.templateObject.hashMap);
                    // 0000000`XXXXXX’’year (yy)’month(mm)’date(dd)’time(mm:ss)`00 - 'Emirate Name'
                    // 0000000XXXXXX201228123500 - Sharjah
                    var nameFormat = service.getWPAname().toString()

                    var filename = '0000000XXXXXX'+nameFormat+' - ' +$scope.emirates.selected.emirate.name;
                    filename += '.csv';
                    exportToCsv(object, filename);
                    item.loading = false;
                }).finally(function(){
                    item.loading = false;
                })
        };
	}
]);