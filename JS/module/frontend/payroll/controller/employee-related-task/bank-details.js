app.controller('PayrollEmployeeBankDetailsController', [
    '$scope', '$timeout', 'PayrollOverviewService', 'utilityService', 'ServerUtilityService', 'EmployeeTaskService', 
    function ($scope, $timeout, PayrollOverviewService, utilityService, serverUtilityService, EmployeeTaskService) {
        var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true
            },
            {
                countObject: 'employeeStatus',
                collection: [1,2,3,4,5],
                isArray: false,
                key: 'employee_status'
            }
        ];
        $scope.resetAllTypeFilters();
        $scope.bankDetailList = [];
        $scope.isBankDetailListVisible = false;
        $scope.pending = {
            details: 0
        };        
        $scope.isAll = {
            flag: false,
            count: 0,
            filteredList:[]
        };
        $scope.legal_entity = {
            selected: null,
            entity_id: utilityService.getStorageValue("legalEntityId")
        };

        $scope.slectedYear = {
            // month: month,
            year:  utilityService.getCurrentFinancialYear().start,
            // monthYear: (month + 1) + "_" + defaultFinancialYear
        };
        $scope.getLegalEntity = function() {
            if($scope.legal_entity.entity_id) {
                var entities_list = JSON.parse(utilityService.getStorageValue("legalEntityElements"));
                $scope.legal_entity.selected = entities_list.find(function(val) { 
                    return val._id == $scope.legal_entity.entity_id; 
                });
            } else {
                $scope.legal_entity.selected = null;
            }
            $scope.investmentApprovedAmountsExportFilename = 'investment_approved_amount';
            $scope.bifurcation80cFileName = '80c_Bifurcation_report'
            $scope.investmentApprovedBifurcationFileName = 'investment_approved_bifurcation_report'
            $scope.bankDetailsExportFilename = 'bank_details';
            if($scope.legal_entity.entity_id) {
                $scope.investmentApprovedAmountsExportFilename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                $scope.bankDetailsExportFilename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                $scope.bifurcation80cFileName += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                $scope.investmentApprovedBifurcationFileName += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
        };
        $scope.getLegalEntity();
        var bankDetailCallback = function (data) {
            $scope.pending = {
                details: 0
            };
            angular.forEach(data, function (item) {
                item.employee_status = item.system_plans_employee_status;
                if (item.financial_details_ifsc_code && item.financial_details_bank_account_number 
                    && item.financial_details_bank_name) {
                    item.status = 2;
                } else {
                    $scope.pending.details +=1;
                    item.status = 1;
                }
            });            
        };        
        var getEmployeeBankDetails = function () {
            var url = EmployeeTaskService.getUrl('bankDetails');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    bankDetailCallback(data.data);
                    $scope.bankDetailList = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.bankDetailList, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $timeout(function (){
                        $scope.isBankDetailListVisible = true;
                    }, 200);
                });
        };
        getEmployeeBankDetails();     
        $scope.selectDeselectUser = function (isAll, section) {
            var count = 0;
            angular.forEach($scope.bankDetailList, function (value) {
                value.isSelected = value.status == 1 ? isAll : false;
                if (value.isSelected) {
                    count += 1;
                }
            });
            $scope.isAll.count = count;
            $scope.isAll.flag = isAll;
        };
        $scope.updateCount = function(section) {
            var count = 0;
            var declaredCount = 0;
            angular.forEach($scope.bankDetailList, function (value, key) {
                if (value.isSelected) {
                    count += 1;
                }
                if (value.status == 2) {
                    declaredCount += 1;
                }
            }); 
            $scope.isAll.count =  count;
            $scope.isAll.flag = (count == $scope.bankDetailList.length - declaredCount ) ? true : false;
        };        
        $scope.sendRemiderToEmployee = function (type, slaveId, isMultiple) {
            var url = PayrollOverviewService.getUrl('reminderToEmp');
            var payload = {
                master_emp_id: utilityService.getStorageValue('loginEmpId'),
                type: $scope.empReminderType[type]
            };
            if (isMultiple) {
                var arr = [];
                angular.forEach($scope.bankDetailList, function (value, key) {
                    if (value.isSelected) {
                        arr.push(value._id);
                    }
                });
                payload.slave_emp_id = arr;
                if(arr.length) {
                    utilityService.showSimpleToast("Reminder has been sent successfully.");
                }                
                return false; 
            } else {
                payload.slave_emp_id = slaveId;
                utilityService.showSimpleToast("Reminder has been sent successfully.");
                return false;
            }            
            serverUtilityService.postWebService(url,payload)
                .then(function (data) {
                    if(data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        getEmployeeBankDetails();
                        $scope.isAll = {
                            flag: false,
                            count: 0
                        };
                    }
                });
        };       
        $scope.csvColumn = {
            'Employee Detail': 'full_name',
            'Employee Id': 'employee_id',
            'status': 'status',
            'Bank Name': 'financial_details_bank_name',
            'Bank Account Number': 'financial_details_bank_account_number',
            'IFSC Code': 'financial_details_ifsc_code'
        };        
        $scope.investmentAmountCsv = {};
        var updateData = function (data) {
            angular.forEach(data.headers,function (val, key) {
               $scope.investmentAmountCsv[val] =  val;
            });
            
            angular.forEach(data.approved_data,function (val, key) {
               val['Employee Name'] =  val.emp_preview.full_name;
               val['Employee ID'] =  val.emp_preview.emp_code;
            });

            return data;
        };
        var getApprovedAmountDetail = function () {
            var url = PayrollOverviewService.getUrl('approvedAmount');
            if (utilityService.getValue($scope.multipleInvestmentHeads, 'enabled')) {
                var financialYear = utilityService.getCurrentFinancialYear();
                url = url + "/" + $scope.slectedYear.year + "/" + ($scope.slectedYear.year + 1);
            }

            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.bnkData = updateData(data.data);
                });
        };
        getApprovedAmountDetail();
        $scope.exportToCsv = function() {
            var empDetailsData = PayrollOverviewService.buildEmpDetailList($scope.bnkData);
            utilityService.exportToCsv(empDetailsData.content, 'export.csv');
        };       
        $scope.updatePaginationSettings('payroll_emp_bank_detail');


        $scope.bifurcation80cCsv = {};
        var bifurcation80cDataCallback = function (data) {
            angular.forEach(data.headers,function (val, key) {
               $scope.bifurcation80cCsv[val] =  val;
            });
            
            angular.forEach(data.approved_data,function (val, key) {
               val['Employee Name'] =  val.emp_preview.full_name;
               val['Employee ID'] =  val.emp_preview.emp_code;
            });

            return data;
        };

     var export80cBifurcation = function() {
         var url = PayrollOverviewService.getUrl('bifurcation80cReport');
         var financialYear = utilityService.getCurrentFinancialYear();
         url = url + "/" + $scope.slectedYear.year + "/" + ($scope.slectedYear.year + 1);
         serverUtilityService.getWebService(url)
         .then(function (data){
             if(utilityService.getValue(data, 'status') === 'success') {
                 $scope.bifurcation80cData = bifurcation80cDataCallback(data.data)
             }
         });
     }
       export80cBifurcation();
       
        //investment Approved Bifurcation
        $scope.investmentApprovedBifurcation = {};
        var investmentApprovedBifurcationDataCallback = function (data) {
            angular.forEach(data.headers,function (val, key) {
               $scope.investmentApprovedBifurcation[val] =  val;
            });
            
            angular.forEach(data.approved_data,function (val, key) {
               val['Employee Name'] =  val.emp_preview.full_name;
               val['Employee ID'] =  val.emp_preview.emp_code;
            });

            return data;
        };

     var exportInvestmentApprovedBifurcation = function() {
         var url = PayrollOverviewService.getUrl('investmentApprovedBifurcationReport');
         var financialYear = utilityService.getCurrentFinancialYear();
         url = url + "/" + $scope.slectedYear.year + "/" + ($scope.slectedYear.year + 1);
         serverUtilityService.getWebService(url)
         .then(function (data){
             if(utilityService.getValue(data, 'status') === 'success') {
                 $scope.investmentApprovedBifurcationData = investmentApprovedBifurcationDataCallback(data.data)
             }
         });
     }
     exportInvestmentApprovedBifurcation();
     
       $scope.updateList = function (year) {
        $scope.slectedYear.year = year;
        getApprovedAmountDetail();
        export80cBifurcation();
        exportInvestmentApprovedBifurcation();
    };

    $scope.downloadSalaryCertificate = function (id) {
        var url = EmployeeTaskService.getUrl('downloadSalaryCertificate') + "/" + id;
        console.log(url);
        $scope.viewDownloadFileUsingForm(url);
    }
    }
]);