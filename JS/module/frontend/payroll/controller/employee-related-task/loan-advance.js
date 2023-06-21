app.controller('LoanAdvanceController', [
    '$scope', '$q', '$timeout', '$routeParams', '$mdDialog', '$location', '$modal', 'LoanAdvanceService', 'utilityService', 'UserManagementService', 'ServerUtilityService', 
    function ($scope, $q, $timeout, $routeParams, $mdDialog, $location, $modal, LoanAdvanceService, utilityService, UserManagementService, serverUtilityService) {
        if ($location.path() != '/loan-request' && $location.path() != '/view-loan-details') {
            $scope.resetAllTypeFilters();
        }
        var repaymentDate,
            self = this;
        $scope.slectedYear = {
            year: utilityService.getCurrentYear(),
            month: utilityService.getCurrentMonth()
        }
        $scope.isEMIDetailListVisible = true;
        $scope.yearListing = LoanAdvanceService.getYearList($scope.yearExtendedConfig).sort()
        $scope.allEntityReport = {
            selectedOption: ''
        }
        $scope.requestId = utilityService.getValue($routeParams, 'requestId');
        $scope.isEdit = angular.isDefined($routeParams.isEdit) && $routeParams.isEdit != 'false' ? true : false;
        $scope.isDisburse = angular.isDefined($routeParams.isDisburse) && $routeParams.isDisburse != 'false' && $routeParams.isDisburse ? true : false;
        $scope.loanTypes = null;
        $scope.loanList = [];
        $scope.monthlyEmi = []
        $scope.noEdit = false;
        $scope.minDate = new Date();
        $scope.viewType = 2;
        $scope.salaryAdvanceList = [];
        $scope.emiCalculated = false;
        $scope.emiPrinciple = 'view';
        $scope.errorMessages = [];
        $scope.apiError = utilityService.buildAPIErrorObject();
        $scope.loanSummaryObject = LoanAdvanceService.buildLoanSummaryObject();
        $scope.bulk = LoanAdvanceService.buildBulkObject();
        $scope.loanAdvances = {
            lastDayOfMonth: false,
            maxDisburseDate: utilityService.getDateAfterSpecificMonths(),
            error:{
                status: false,
                message: null
            }
        };
        $scope.searchText = {
            name: '',
            key: ''
        };
        $scope.repaymentStatusMapping = LoanAdvanceService.buildRepaymentStatusMapping();
        $scope.statusMapping = LoanAdvanceService.buildStatusMapping();
        $scope.editAdvance = LoanAdvanceService.buildEditAdvanceObject();

        self.selectedItem = null;
        self.simulateQuery = false;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;
        self.contacts = [];
        self.value = {};
        self.querySearchChips = querySearchChips;
        $scope.employeeId = null
        var syncLoanDetailsModel = function (model) {
            $scope.emiCalculationObj = LoanAdvanceService.loanDetailsModel(model);
        };
        $scope.monthObject = {
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
        };
        syncLoanDetailsModel();
        $scope.filteredList = {
            list: [],
            report: []
        };
        $scope.changeView = function (type) {
            var pagename = type == 1 ? 'payroll_emp_loan' : 'payroll_emp_advance';
            $scope.filteredList = {
                list: []
            };
            $scope.updatePaginationSettings(pagename);
            $scope.resetAllTypeFilters();
            $scope.viewType = type;
        };
        if ($location.path() !== '/loan-request' && $location.path() !== '/view-loan-details') {
            //$scope.updatePaginationSettings('payroll_emp_loan');
            $scope.updatePaginationSettings('payroll_emp_advance');
        }
        $scope.newLoanRequest = function (ev) {
            $mdDialog.show({
                templateUrl: 'request.html',
                controller: 'LoanController',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            }).then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };
        var getAllRequests = function () {
            $q.all([
                serverUtilityService.getWebService(LoanAdvanceService.getUrl('getLoanType')),
                //serverUtilityService.getWebService(LoanAdvanceService.getUrl('getLoanRequests') + "/1"),
                serverUtilityService.getWebService(LoanAdvanceService.getUrl('getLoanRequests') + "/2")
            ]).then(function (data) {
                $scope.loanTypes = data[0].data;
                //$scope.loanList = $scope.checkLoanType(data[1].data);
                $scope.salaryAdvanceList = $scope.checkLoanType(data[1].data);
                updateLoanType();
            });
        };
        getAllRequests();
        $scope.getEmployeeDetails = function (id) {
            var url = LoanAdvanceService.getUrl('employeeDetail') + "/" + id;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.empDetails = data.data;
                });
        };
        $scope.checkMinRepayment = function () {
            $scope.minTenure = null;
//            var empEligiblity = ($scope.empGrossSal * 70) / 100;
            var empEligiblity = $scope.empGrossSal;

            if (empEligiblity <= 0) {
                $scope.empEligiblityZeroError = {
                    visible: true,
                    message: 'Salary of the employee should be greater than 0'
                }
            } else {
                $scope.emiCalculationObj.monthlyEmi = empEligiblity;
                if ($scope.emiCalculationObj.amount < empEligiblity) {
                    $scope.minTenure = 1;
                } else {
                    $scope.minTenure = Math.floor($scope.emiCalculationObj.amount / empEligiblity);
                    if ($scope.emiCalculationObj.amount % empEligiblity > 1) {
                        $scope.minTenure += 1;
                    }
                }
                $scope.updateRepaymentDate();
            }
        };
        
        function getEmpGrossDetails(empId) {
            var rmpId = angular.isDefined(empId) ? empId : $scope.employeeId;
            var payoutDate = LoanAdvanceService.getUrl('payoutDate') + "/" + rmpId + "/2";
            var empMonthlyGross = LoanAdvanceService.getUrl('empMonthlyGross') + "/" + rmpId;
            if($scope.emiCalculationObj.disbursed_type === "2" && $scope.emiCalculationObj.disbursed_date !== null) {
                var d = new Date($scope.emiCalculationObj.disbursed_date)
                var month = d.getMonth() + 1;
                var year = d.getFullYear()
                var day = d.getDate()
                payoutDate = LoanAdvanceService.getUrl('payoutDate') + "/" + rmpId + "/2" + "/" + day + "/" + month + "/" + year;
            }
            $q.all([
                serverUtilityService.getWebService(payoutDate),
                serverUtilityService.getWebService(empMonthlyGross)
            ]).then(function (data) {
                $scope.payoutDate = data[0].data.automatic_disbursement_date;
                $scope.payoutMonth = data[0].data.automatic_payroll_month;
                $scope.payoutYear = data[0].data.automatic_payroll_year;
                $scope.instructions = data[0].data.instructions;
                $scope.next_payroll_cycles = data[0].data.next_payroll_cycles;
                $scope.emiCalculationObj.max_limit =  data[0].data.max_limit;                
                if($scope.requestId && utilityService.getValue($scope.emiCalculationObj, 'max_limit')) {
                    $scope.emiCalculationObj.max_limit = $scope.emiCalculationObj.max_limit + $scope.emiCalculationObj.amount;
                }
                $scope.emiCalculationObj.payroll_cycle =  $scope.payoutDate;
                $scope.empGrossSal = data[1].data.monthly_gross;
                $scope.loanAdvances.lastDayOfMonth = utilityService.getInnerValue(data[0], 'data', 'last_day_of_month', false);
                $scope.loanAdvances.maxDisburseDate = $scope.next_payroll_cycles.length 
                    ? utilityService.getDateBeforeSpecificMonths($scope.next_payroll_cycles[$scope.next_payroll_cycles.length - 1])
                    : utilityService.getDateAfterSpecificMonths();
                $scope.checkMinRepayment();
            }); 
        }        
        function updateLoanType() {
            if ($scope.requestId) {
                hideEMILoader('installment');
                var url = LoanAdvanceService.getUrl('requestDetails') + "/" + $scope.requestId;
                serverUtilityService.getWebService(url)
                    .then(function (data) {
                        var dta = data.data;
                        angular.forEach($scope.loanTypes, function (v, k) {
                            if (v._id == dta.loan_type) {
                                dta.name = v.name;
                            }
                        });
                        $timeout(function () {
                            $scope.loanDetails = dta;
                            getEmpGrossDetails(utilityService.getInnerValue(dta, 'employee_details', '_id'));
                            $scope.employeeId = utilityService.getInnerValue(dta, 'employee_details', '_id')
                            setAutoComplete($scope.loanDetails.employee_details);
                            syncLoanDetailsModel($scope.loanDetails);
                            showEMILoader('details');
                            showEMILoader('installment');
                        }, 500);
                    });
            } else {
                return;
            }
        }
        var setAutoComplete = function (item) {
            $scope.noEdit = $scope.isEdit?false:$scope.isEdit;
            self.selectedItem = {
                _id: angular.isObject(item._id) ? item._id.$id : item._id,
                full_name: utilityService.getValue(item, 'full_name'),
                email: utilityService.getValue(item, 'email')
            };
            self.isDisabledEmployee = $scope.isEdit?false:true;;
        };
        $scope.checkLoanType = function (data) {
            angular.forEach($scope.loanTypes, function (v, k) {
                angular.forEach(data, function (val, key) {
                    if (v._id == val.loan_type) {
                        val.name = v.name;
                    }
                });
            });

            return data;
        };
        $scope.updateStatus = function (item, status) {
            var url = LoanAdvanceService.getUrl('updateStatus') + "/" + item._id,
                payload = {
                    status: status
                };

            if(status == 17) {
                payload.amount = item.amount;
                payload.installments = item.period;
                payload.interest_rate = item.interest;
                payload.installments_preview = $scope.emiArray;
            };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data);
                });
        };
        var deleteSuccessCallback = function (data, item) {
            if (item.request_type == 1) {
                $scope.loanList = utilityService.deleteCallback(data, item, $scope.loanList);
            } else {
                $scope.salaryAdvanceList = utilityService.deleteCallback(data, item, $scope.salaryAdvanceList);
            }
            utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
        };
        var deleteRequest = function (urlPrefix, item) {
            var url = LoanAdvanceService.getUrl(urlPrefix) + "/" + item._id;

            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    utilityService.getValue(data, 'status') === 'success'
                        ? deleteSuccessCallback(data, item)
                        : uploadErrorCallback(data, 'bulkFilledTemplate');                 
                });
        };     
        $scope.deleteRequest = function (item) {
            deleteRequest('deleteRequest', item);
        };
        $scope.deleteUploadedRequest = function (item) {
            deleteRequest('deleteUploadedRequest', item);
        };
        $scope.updateRepaymentDate = function () {
            repaymentDate = utilityService.getDefaultDate($scope.emiCalculationObj.payroll_cycle); 
        };        
        var checkPrinciple = function (emiArray, mainAmount) {
            var allEmis = 0;

            angular.forEach(emiArray, function (val, key) {
                allEmis = allEmis + val.principle; 
            });

            return (mainAmount - allEmis);
        };        
        $scope.calculateEMI = function () {
            $scope.updateRepaymentDate();
            $scope.emiArray = [];
            var amount = $scope.emiCalculationObj.amount;
            var r = $scope.emiCalculationObj.interest / 100 / 12;
            var x = $scope.emiCalculationObj.period;
            var currentDate = repaymentDate;

            // This cutomized date has been introduced, in order to handle 30, 31 in case of february
            if (utilityService.getValue($scope.loanAdvances, 'lastDayOfMonth')) {                
                var customizedDate = new Date( new Date(repaymentDate).setDate(10) );
            }

            for (var i = 0; i < x; i++) {
                var someDate = utilityService.getValue($scope.loanAdvances, 'lastDayOfMonth') ? customizedDate : currentDate;
                var numberOfDaysToAdd = 30;
                var monthIncrementCount = (i == 0) ? 0 : 1;
                var dueDate = someDate.setMonth(someDate.getMonth() + monthIncrementCount);
                someDate = dueDate;                
                var n = x - i;
                if($scope.emiCalculationObj.interest == 0 || !$scope.emiCalculationObj.interest) {
                    var emi = Math.round($scope.emiCalculationObj.amount/$scope.emiCalculationObj.period);
                } else {
                    var emi = Math.round(amount * r * (Math.pow((1 + r), n))) / ((Math.pow((1 + r), n)) - 1);
                }
                var monthlyIntrst = (amount * r);
                var montlyPrncpl = emi - monthlyIntrst;
                var checkLastPrinciple = (i + 1 == x) 
                    ? checkPrinciple($scope.emiArray,$scope.emiCalculationObj.amount) : Math.round(montlyPrncpl);
                var dueDateObject = {
                    date: new Date(dueDate).getDate(),
                    month: (new Date(dueDate).getMonth() + 1),
                    year: new Date(dueDate).getFullYear()
                };

                if (utilityService.getValue($scope.loanAdvances, 'lastDayOfMonth')) {
                    dueDateObject.date = utilityService.getMonthLastDate(dueDateObject.year, dueDateObject.month);
                }

                $scope.emiArray.push({
                    principle: checkLastPrinciple,
                    emi: parseInt(emi),
                    interest: parseInt(monthlyIntrst),
                    balance: Math.round(amount - checkLastPrinciple),
                    dueDate: dueDateObject.date + '/' +  dueDateObject.month + '/' + dueDateObject.year
                });
                
                amount = amount - montlyPrncpl;
            }
            $scope.emiCalculated = true;
        };
        $scope.updateEmi = function () {
            $scope.emiPrinciple = 'edit';
        };
        var successCallback = function (data, list, section, isAdded) {
            utilityService.resetAPIError(false, null, section);
            if (angular.isDefined(data.data)) {
                utilityService.showSimpleToast(data.message);
                isAdded ? list.unshift(data.data) : utilityService.refreshList(list, data.data);
                getAllRequests();
                $scope.goBack();
            }
        };
        var errorCallback = function (data, section) {
            $scope.errorMessages = [];
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        var successErrorCallback = function (data, list, section, isAdded) {
            section = angular.isDefined(section) ? section : "loanAdvance";
            isAdded = angular.isDefined(isAdded) ? isAdded : false;
            data.status === "success" ? successCallback(data, list, section, isAdded)
                    : errorCallback(data, section);
        };
        $scope.approveRequest = function () {
            var url = LoanAdvanceService.getUrl('approveLoanRequest'),          
                payload = {
                    request_type: $scope.emiCalculationObj.request_type,
                    loan_type: $scope.emiCalculationObj.loan_type,
                    employee_id: $scope.emiCalculationObj.employee_id,
                    description: $scope.emiCalculationObj.reason,
                    amount: parseInt($scope.emiCalculationObj.amount),
                    installments: $scope.emiCalculationObj.period,
                    interest_rate: $scope.emiCalculationObj.interest,
                    disbursed_date: utilityService.getValue($scope.emiCalculationObj, 'disbursed_date')
                        ? utilityService.dateToString($scope.emiCalculationObj.disbursed_date) : $scope.payoutDate,
                    disbursed_type: $scope.emiCalculationObj.disbursed_type,
                    payout_cycle: $scope.emiCalculationObj.payroll_cycle,
                    installments_preview: $scope.emiArray,
                    request_from: 2
                };

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data);
                });
        };
        $scope.disburseEmpReq = function (item) {
            var url = LoanAdvanceService.getUrl('approveLoanRequest') + "/" + item._id,
                payload = {
                    request_type: $scope.emiCalculationObj.request_type,
                    loan_type: $scope.emiCalculationObj.loan_type,
                    employee_id: $scope.emiCalculationObj.employee_id,
                    description: $scope.emiCalculationObj.reason,
                    amount: parseInt($scope.emiCalculationObj.amount),
                    installments: $scope.emiCalculationObj.period,
                    disbursed_date: angular.isDefined($scope.emiCalculationObj.disbursed_date) && $scope.emiCalculationObj.disbursed_date?utilityService.dateToString($scope.emiCalculationObj.disbursed_date) : $scope.payoutDate,
                    disbursed_type: $scope.emiCalculationObj.disbursed_type,
                    payout_cycle: $scope.emiCalculationObj.payroll_cycle,
                    interest_rate: $scope.emiCalculationObj.interest,
                    installments_preview: $scope.emiArray,
                    request_from: 2
                };
            
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data);
                });
        };
        $scope.updateRequest = function(){
            var url = LoanAdvanceService.getUrl('approveLoanRequest') + "/" + $scope.requestId,
                payload = {
                    request_type: $scope.emiCalculationObj.request_type,
                    loan_type: $scope.emiCalculationObj.loan_type,
                    description: $scope.emiCalculationObj.reason,
                    amount: parseInt($scope.emiCalculationObj.amount),
                    request_from: 1
                };

            serverUtilityService.putWebService(url,payload)
                .then(function (data){
                    successErrorCallback(data);
                });
        };
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
        $scope.createRequest = function (item,edit,disburse) {
            var id = angular.isDefined(item) ? item._id : null,
                isEdit = angular.isDefined(edit) ? edit : false,
                isDisburse = angular.isDefined(disburse) ? disburse : false;

            $location.url('loan-request').search({
                'requestId': id,
                'isEdit': isEdit,
                'isDisburse': isDisburse
            });
        };
        $scope.viewLoanDetails = function (item) {
            var id = angular.isDefined(item) ? item._id : null;           
            $location.url('view-loan-details').search({'requestId': id});
        };        
        $scope.payEmi = function (request, item) {
            var id = angular.isObject(item._id) ? item._id.$id : item._id;
            var url = LoanAdvanceService.getUrl('updateEmi') + "/" + request._id + "/" + id;
            serverUtilityService.patchWebService(url)
                .then(function (data) {
                    if(data.status == 'success'){
                        $scope.loanDetails.details = data.data.details;
                    }
                });
        };        
        var getActiveUsers = function () {
            $scope.activeUsers = [];
            var url = LoanAdvanceService.getUrl('allUser'),
                params = {
                    status: true
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.activeUsers = data.data;
                    self.allSignAuth = loadAll();
                });
        };
        getActiveUsers();

        /************ Start AUTOCOMPLETE Section ************/
        function querySearchChips(keyword) {
            return keyword ? self.allEmployees.filter(createFilterForChips(keyword)) : [];
        }
        function loadAll() {
            var repos = $scope.activeUsers;

            return repos.map(function (repo) {
                repo.value = repo.full_name ? repo.full_name.toLowerCase() : "";
                return repo;
            });
        }
        function querySearch(query) {
            return query ? self.allSignAuth.filter(createFilterFor(query)) : self.allSignAuth;
        }
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function selectedItemChange(item, model, key) {
            if (angular.isDefined(item) && item) {
                var id = angular.isObject(item._id) ? item._id.$id : item._id;
                model[key] = id;
                $scope.employeeId = id
                $scope.getEmployeeDetails(id);
                getEmpGrossDetails(id);
            }
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }        
        
        var covertDateToTimeStamp = function (date) {
            var tempDate = date.setHours(00, 00, 00, 00);
            var dateTimeStamp = Math.round(new Date(tempDate) / 1000);

            return dateTimeStamp;
        };        
        var getLoanAdvanceSummary = function () {
            var url = LoanAdvanceService.getUrl('getLoanSummary'),
                params = {
                    till_date: $scope.loanSummaryObject.tillDate
                };

            if (!$scope.loanSummaryObject.tillDate) {
                params.from = covertDateToTimeStamp($scope.loanSummaryObject.fromDate),
                params.to = covertDateToTimeStamp($scope.loanSummaryObject.toDate);
            }
            
            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    $scope.loanSummaryObject.list = LoanAdvanceService.loanAdvanceSummaryCallback(data.data);
                });
        };
        getLoanAdvanceSummary();
        $scope.getSummaryForTillDate = function () {
            if ($scope.loanSummaryObject.tillDate) {
                $scope.loanSummaryObject.fromDate = null;
                $scope.loanSummaryObject.toDate = null;
                getLoanAdvanceSummary();
            }
        };        
        $scope.sendReminder = function (approver, type) {
            var masterId = utilityService.getStorageValue('loginEmpId'),
                url = LoanAdvanceService.getUrl('reminder'),
                payload = LoanAdvanceService.buildReminderPayload(masterId, approver);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if(data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                    }
                });
        };        
        $scope.getSummaryBetweenDates = function (fromDate, toDate) {
            if (fromDate != null && toDate != null) {
                $scope.loanSummaryObject.from = utilityService.dateFormatConvertion(fromDate);
                $scope.loanSummaryObject.to = utilityService.dateFormatConvertion(toDate);
                var d1 = new Date(fromDate);
                var d2 = new Date(toDate);
                var t1 = d1.getTime();
                var t2 = d2.getTime();
                if (t1 > t2) {
                    $scope.loanSummaryObject.fromDate = null;
                }
            }
            if ($scope.loanSummaryObject.fromDate != null && $scope.loanSummaryObject.toDate != null && !$scope.loanSummaryObject.tillDate) {
                getLoanAdvanceSummary();
            }
        };
        $scope.goBack = function () {
            var tab = 'Loan Advance';
            $location.url('/frontend/payroll/summary').search({tabname: tab});
        };        
        var allFilterObject = [{
            countObject: 'group',
            isGroup: true,
            collection_key: 'employee_details'
        }];        
        $scope.$watch('filteredList.list', function (newVal, oldVal) {
            if (newVal != oldVal) {
                $scope.calculateFacadeCountOfAllFilters(newVal, allFilterObject);
            }
            if($scope.viewType == 1 && $scope.loanList.length == newVal.length){
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
            }
            if($scope.viewType == 2 && $scope.salaryAdvanceList.length == newVal.length){
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
            }
        }, true);
        var resetPayrollCycleOptionValue = function () {
            $scope.emiCalculationObj.payroll_cycle = null;
        };
        var resetManualDisburseDate = function () {
            $scope.emiCalculationObj.disbursed_date = null;
        };
        $scope.changeDisbursedTypeHandler = function () {
           
            resetPayrollCycleOptionValue();
            if (utilityService.getValue($scope.emiCalculationObj, 'disbursed_type') == 1) {
                resetManualDisburseDate();
                getEmpGrossDetails();
            }
        };
        $scope.changeDisburseDateHandler = function () {
            getEmpGrossDetails();
            resetPayrollCycleOptionValue();
        };
        $scope.isPayoutCycleOptionHidden = function (optionValue) {
            var isHidden = false;

            if (utilityService.getValue($scope.emiCalculationObj, 'disbursed_type') == 2 
                && utilityService.getValue($scope.emiCalculationObj, 'disbursed_date') && optionValue ) {
                var cycleTimestamp = utilityService.getDefaultDate(optionValue).getTime(),
                    disburseTimestamp = utilityService.getValue($scope.emiCalculationObj, 'disbursed_date').getTime();

                isHidden = cycleTimestamp < disburseTimestamp;
            }

            return isHidden;
        };

        /***** Start Download/Upload Template & CSV Section *****/               
        $scope.downloadSampleTemplate = function(urlPrefix) {
            var url = LoanAdvanceService.getUrl(urlPrefix);
            
            $scope.viewDownloadFileUsingForm(url);
        };        
        $scope.uploadFilledTemplate = function(fileObject, keyName, urlPrefix) {
            $scope.errorMessages = [];
            var url = LoanAdvanceService.getUrl(urlPrefix), 
                payload = {};

            payload[keyName] = fileObject;

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    uploadSuccessErrorCallback(data, 'bulkFilledTemplate');
                });
        };
        /***** End Download/Upload Template & CSV Section *****/

        /**** Start: Generic File Upload Related Function  *****/
        $scope.bindFileChangeEvent = function (model, keyname) {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    model[keyname].isUploaded = true;
                });
            }, 100);
        };
        $scope.clearFileUpload = function(model, keyname) {
            model[keyname].isUploaded = false;
            model[keyname].file = null;
        };
        $scope.setCommonFileObject = function(model, keyname, file){
            model[keyname].file = file;
            model[keyname].isUploaded = true;
        };
        /**** End: Generic File Upload Related Function  *****/

        /***** Start Success Error Callback Section *****/
        var uploadSuccessCallback = function (data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Sheet has been uploaded successfully'));
            getAllRequests();
        };
        var uploadErrorCallback = function (data, section) {
            if (utilityService.getValue(data, 'status') === "error") {
                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(data.message);
            } else if (utilityService.getInnerValue(data, 'data', 'status') === 'error') {
                utilityService.resetAPIError(true, "something went wrong", section);
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            $scope.errorMessages.push(v);
                        });
                    });
                } else {
                    $scope.errorMessages.push(data.data.message);
                }                
            }
            $scope.openModal('bulk-upload-loan-advances-error.tmpl.html', 'bulkUploadError');
        };
        var uploadSuccessErrorCallback = function (data, section) {
            data.status === "success" ? uploadSuccessCallback(data, section)
                    : uploadErrorCallback(data, section);
        };
        /***** End Success Error Callback Section *****/ 
        
        /**** Start: Angular Modal Section *****/
        $scope.openModal = function (templateUrl, instance, size) {
            size = angular.isDefined(size) ? size : 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass:'fadeEffect',
                size: size,
                keyboard: false
            });
        };        
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };
        /**** End: Angular Modal Section *****/

        var checkAdvanceUploadPermission = function () {
            var url = LoanAdvanceService.getUrl('checkAdvanceUploadPermission');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    if (utilityService.getValue(data, 'status') === 'error') {
                        $scope.loanAdvances.error.status = true;
                        $scope.loanAdvances.error.message = utilityService.getValue(data, 'message');
                    }
                });
        };
        checkAdvanceUploadPermission();
        $scope.exportToCsv = function() {
            var content = LoanAdvanceService.buildExportData($scope.filteredList.list, $scope.statusMapping, $scope.repaymentStatusMapping),
                filename = 'advance-details.csv';

            utilityService.exportToCsv(content, filename);
        };

        /**** Start Edit Advance Section  *****/        
        var getPaidAmount = function (selectedIndex) {
            var paidAmount = 0;

            angular.forEach($scope.loanDetails.details, function (value, key) {
                if (key < selectedIndex) {
                    paidAmount = paidAmount + parseInt(value.principle);
                }
            });

            return parseInt(paidAmount, 10);
        };  
        var convertTimestampToStringDate = function (num) {
            return LoanAdvanceService.convertTimestampToStringDate(num);
        };      
        var assignPaidEMIsToNewObject = function (item) {
            return {
                balance: utilityService.getValue(item, 'balance'),
                dueDate: convertTimestampToStringDate(utilityService.getInnerValue(item, 'dueDate', 'sec')),
                emi: utilityService.getValue(item, 'emi'),
                interest: utilityService.getValue(item, 'interest'),
                principle: utilityService.getValue(item, 'principle'),
                status: utilityService.getValue(item, 'status'),
                _id: utilityService.getValue(item, '_id'),
                can_edit_emi: utilityService.getValue(item, 'can_edit_emi', true)
            }
        };
        var createForeCloseEMIsObject = function (item, foreClosureAmount) {
            return {
                balance: 0,
                dueDate: convertTimestampToStringDate(utilityService.getInnerValue(item, 'dueDate', 'sec')),
                emi: foreClosureAmount,
                interest: utilityService.getValue(item, 'interest'),
                principle: foreClosureAmount,
                status: utilityService.getValue(item, 'status'),
                _id: utilityService.getValue(item, '_id'),
                can_edit_emi: utilityService.getValue(item, 'can_edit_emi', true),
                is_emi_updated: true
            }
        };        
        var extractPaidEMIs = function () {            
            var selectedIndex = $scope.editAdvance.index,
                paidEMIs = [];

            angular.forEach($scope.loanDetails.details, function (item, key) {
                if (key < selectedIndex) {
                    paidEMIs.push(assignPaidEMIsToNewObject(item));
                }
            });

            return paidEMIs;
        };
        var getForeClosureAmount = function () {
            return utilityService.getValue($scope.loanDetails, 'amount', 0) - utilityService.getValue($scope.editAdvance, 'paidAmount');
        };
        var hideEMILoader = function (keyName) {
            $scope.editAdvance.visible[keyName] = false;
        };
        var showEMILoader = function (keyName) {
            $timeout(function () {
                $scope.editAdvance.visible[keyName] = true;
            }, 100);
        };
        var recalculateBasedOnForeclosure = function (paidEMIs) {
            var foreClosureAmount = getForeClosureAmount();
            paidEMIs.push(createForeCloseEMIsObject($scope.editAdvance.item, foreClosureAmount));
            angular.copy(paidEMIs, $scope.editAdvance.emiList);
            showEMILoader('recalculate');
        };

        var recalculateBasedOnTenure = function (paidEMIs, isChanged) {
            isChanged = isChanged || false;
            if (isChanged) {
                hideEMILoader('recalculate');

                var balanceBefore = parseInt(utilityService.getInnerValue($scope.editAdvance, 'item', 'balance'), 10),
                        currentEmi = parseInt(utilityService.getInnerValue($scope.editAdvance, 'item', 'principle'), 10),
                        balance = balanceBefore + currentEmi,
                        tenure = parseInt($scope.editAdvance.model.tenure, 10),
                        lastTenureIndex = tenure - 1;
                if (balance > 0) {
                    var balanceEmiCount = tenure - paidEMIs.length,
                            newEmiAmount = parseInt(balance / balanceEmiCount, 10),
                            balancingHead = balance - (newEmiAmount * balanceEmiCount);
                    angular.forEach($scope.loanDetails.details, function (item, key) {
                        if (key >= $scope.editAdvance.index && key <= lastTenureIndex) {
                            // For last installment, set balance as 0 and adjust balancing head into last emi
                            if (key == lastTenureIndex) {
                                balance = 0;
                                newEmiAmount = newEmiAmount + balancingHead;
                            } else {
                                balance = balance - newEmiAmount;
                            }

                            paidEMIs.push({
                                balance: balance,
                                dueDate: convertTimestampToStringDate(utilityService.getInnerValue(item, 'dueDate', 'sec')),
                                emi: newEmiAmount,
                                interest: utilityService.getValue(item, 'interest'),
                                principle: newEmiAmount,
                                status: utilityService.getValue(item, 'status'),
                                _id: utilityService.getValue(item, '_id'),
                                can_edit_emi: utilityService.getValue(item, 'can_edit_emi', true)
                            });
                        }
                    });

                    /***** If someone want to increase the tenure *****/
                    if ($scope.editAdvance.model.tenure > $scope.loanDetails.installments) {
                        for (var i = $scope.loanDetails.details.length; i <= lastTenureIndex; i++) {
                            if (i == lastTenureIndex) {
                                balance = 0;
                                newEmiAmount = newEmiAmount + balancingHead;
                            } else {
                                balance = balance - newEmiAmount;
                            }

                            /***** Start Payment Date Handling Section *****/
                            // This section of code has been introduced, in order to handle 30, 31 in case of february
                            var lastDayOfMonth = utilityService.getValue($scope.loanAdvances, 'lastDayOfMonth', false),
                                    lastEMIDate = utilityService.changeDateFormat(paidEMIs[paidEMIs.length - 1].dueDate),
                                    someDate = lastDayOfMonth ? new Date(new Date(lastEMIDate).setDate(10))
                                    : (angular.isDate(lastEMIDate) ? lastEMIDate : new Date(lastEMIDate)),
                                    increaseMonthCount = 1,
                                    dueDate = someDate.setMonth(someDate.getMonth() + increaseMonthCount),
                                    dueDateObject = {
                                        date: new Date(dueDate).getDate(),
                                        month: (new Date(dueDate).getMonth() + 1),
                                        year: new Date(dueDate).getFullYear()
                                    };

                            if (lastDayOfMonth) {
                                dueDateObject.date = utilityService.getMonthLastDate(dueDateObject.year, dueDateObject.month);
                            }
                            /***** End Payment Date Handling Section ****/

                            paidEMIs.push({
                                balance: balance,
                                dueDate: dueDateObject.date + '/' + dueDateObject.month + '/' + dueDateObject.year,
                                emi: newEmiAmount,
                                interest: 0,
                                principle: newEmiAmount,
                                status: 1,
                                _id: null,
                                can_edit_emi: true,
                                is_emi_new: true
                            });
                        }
                    }
                }
            } else {
                paidEMIs = [];
                angular.forEach($scope.loanDetails.details, function (item) {
                    paidEMIs.push(assignPaidEMIsToNewObject(item));
                });
            }

            angular.copy(paidEMIs, $scope.editAdvance.emiList);
            showEMILoader('recalculate');
        };

        var recalculateBasedOnAmount = function (paidEMIs, isChanged) {
            isChanged = isChanged || false;
            if (isChanged) {
                hideEMILoader('recalculate');

                var item = utilityService.getValue($scope.editAdvance, 'item'),
                        balance = item.balance + item.principle - $scope.editAdvance.model.emi_amount,
                        emiAmount = parseInt($scope.editAdvance.model.emi_amount, 10);

                paidEMIs.push({
                    balance: balance,
                    dueDate: convertTimestampToStringDate(utilityService.getInnerValue(item, 'dueDate', 'sec')),
                    emi: emiAmount,
                    interest: utilityService.getValue(item, 'interest'),
                    principle: emiAmount,
                    status: utilityService.getValue(item, 'status'),
                    _id: utilityService.getValue(item, '_id'),
                    can_edit_emi: utilityService.getValue(item, 'can_edit_emi', true)
                });

                if (balance > 0) {
                    var balanceEmiCount = $scope.loanDetails.installments - $scope.editAdvance.installment,
                            newEmiAmount = parseInt(balance / balanceEmiCount, 10),
                            balancingHead = balance - (newEmiAmount * balanceEmiCount);

                    angular.forEach($scope.loanDetails.details, function (item, key) {
                        if (key > $scope.editAdvance.index) {
                            // For last installment, set balance as 0 and adjust balancing head into last emi
                            if (key == $scope.loanDetails.details.length - 1) {
                                balance = 0;
                                newEmiAmount = newEmiAmount + balancingHead;
                            } else {
                                balance = balance - newEmiAmount;
                            }

                            paidEMIs.push({
                                balance: balance,
                                dueDate: convertTimestampToStringDate(utilityService.getInnerValue(item, 'dueDate', 'sec')),
                                emi: newEmiAmount,
                                interest: utilityService.getValue(item, 'interest'),
                                principle: newEmiAmount,
                                status: utilityService.getValue(item, 'status'),
                                _id: utilityService.getValue(item, '_id'),
                                can_edit_emi: utilityService.getValue(item, 'can_edit_emi', true)
                            });
                        }
                    });
                }
            } else {
                paidEMIs = [];
                angular.forEach($scope.loanDetails.details, function (item) {
                    paidEMIs.push(assignPaidEMIsToNewObject(item));
                });
            }

            angular.copy(paidEMIs, $scope.editAdvance.emiList);
            showEMILoader('recalculate');
        };

        $scope.editAdvanceHandler = function (item, type, selectedIndex) {
            $scope.editAdvance.model.tenure = utilityService.getValue($scope.loanDetails, 'installments', 0);
            $scope.editAdvance.model.emi_amount = utilityService.getValue(item, 'principle', 0);;
            $scope.editAdvance.selected = type;
            $scope.editAdvance.index = selectedIndex;
            $scope.editAdvance.installment = selectedIndex + 1;
            $scope.editAdvance.paidAmount = getPaidAmount(selectedIndex);
            $scope.editAdvance.emiList = [];
            angular.copy(item, $scope.editAdvance.item);

            var paidEMIs = extractPaidEMIs();

            switch (type.slug) {
                case 'foreclose':
                    recalculateBasedOnForeclosure(paidEMIs);
                    break;
                    
                case 'change_tenure':
                    recalculateBasedOnTenure(paidEMIs);
                    break;

                default:
                    recalculateBasedOnAmount(paidEMIs);
                    break;
            }
            
            $scope.openModal('edit-advance.tmpl.html', 'editAdvance');
        };        
        $scope.recalculateHandler = function () {
            var paidEMIs = extractPaidEMIs();
            $scope.editAdvance.selected.slug === 'change_tenure'
                ? recalculateBasedOnTenure(paidEMIs, true) : recalculateBasedOnAmount(paidEMIs, true);
        };
        $scope.tenureOnBlurHandler = function () {
            if (utilityService.getInnerValue($scope.editAdvance, 'model', 'tenure')) {
                $scope.editAdvance.model.tenure = $scope.editAdvance.model.tenure < $scope.editAdvance.installment 
                    ? $scope.editAdvance.installment : $scope.editAdvance.model.tenure;
                $scope.editAdvance.model.tenure = parseInt($scope.editAdvance.model.tenure, 10);
            }
        };
        $scope.emiAmountOnBlurHandler = function () {
            if (utilityService.getInnerValue($scope.editAdvance, 'model', 'emi_amount')) {
                $scope.editAdvance.model.emi_amount = $scope.editAdvance.model.emi_amount > $scope.editAdvance.item.balance 
                    ? $scope.editAdvance.item.balance + $scope.editAdvance.item.principle 
                    : $scope.editAdvance.model.emi_amount;              
            }
        };
        $scope.updateEMIDetails = function () {
            var url = LoanAdvanceService.getUrl('updateEMIDetails') + "/" 
                    + utilityService.getValue($routeParams, 'requestId') + "/"
                    + utilityService.getInnerValue($scope.editAdvance, 'selected', 'id'),
                payload = LoanAdvanceService.buildUpdateEMIPayload($scope.editAdvance.emiList);

            serverUtilityService.patchWebService(url, payload)
                .then(function (data) {
                    if (utilityService.getValue(data, 'status') === 'success') {
                        updateLoanType();
                        utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                        $scope.closeModal('editAdvance');
                    } else {
                        console.log('Need to handle error here');
                    }
                });
            };
        /**** End Edit Advance Section  *****/
        
        /***** Start: View Approver Chain Section *****/
        $scope.apporverChain = {
            list: [],
            visible: false,
            statusMapping: utilityService.buildApproverStatusHashMap()
        };
        $scope.viewApporverChain = function (item) {
            var requestId = angular.isObject(item._id) ? item._id.$id : item._id,
                url = LoanAdvanceService.getUrl('approverChain') + "/" + requestId;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.apporverChain.list = utilityService.getInnerValue(data, 'data', 'approver_chain', []);
                    $scope.apporverChain.visible = true;
                    $scope.openModal('view-approver-chain.tmpl.html', 'approverChain', 'md');
                });
        };
        /***** End: View Approver Chain Section *****/ 

        $scope.changeSearchText = function (search) {
            $scope.name_filter = {};
            $scope.searchText.key = (search == 'manager') ? 'Search By Manager'
                : (search == 'name' ? 'Search by Name' : 'Search by Employee Code');
        };

        var exportToCsv = function(object, filename) {
            utilityService.exportToCsv(object.content, filename);
        };

        var TaxRegimeSuccessCallback = function (data) {
            var year = utilityService.getValue($scope.slectedYear, 'year'),
            month = utilityService.getValue($scope.slectedYear, 'month') + 1,
            // accountingYear = year + '-' + (parseInt(year, 10) + 1),
            fileName = 'emp-monthly-emi-report' + '-' + month + '-' + year + ".csv";
            exportToCsv(data, fileName)
        };

        $scope.downloadReport = function() {
            var url = LoanAdvanceService.getUrl('empMonthlyEmiReport')
            url = url + "/" + ($scope.slectedYear.month + 1) + "/" + $scope.slectedYear.year;
            var param = {};

            if (utilityService.getValue($scope.allEntityReport, 'selectedOption') === 'all') {
                param['all-legal-entities'] = true;
            }
            serverUtilityService.getWebService(url, param)
            .then(function (response){
                var csvData = LoanAdvanceService.buildTaxCSV(response.data)
                TaxRegimeSuccessCallback(csvData)
            });
        };

      

        var getMonthlyEmpEmi = function () {
            $scope.isEMIDetailListVisible = true;

            var url = LoanAdvanceService.getUrl('empMonthlyEmiReport')
            url = url + "/" + ($scope.slectedYear.month + 1) + "/" + $scope.slectedYear.year;
            var param = {};

            if (utilityService.getValue($scope.allEntityReport, 'selectedOption') === 'all') {
                param['all-legal-entities'] = true;
            }
            serverUtilityService.getWebService(url, param)
            .then(function (response){
                // var csvData = LoanAdvanceService.buildTaxCSV(response.data)
                // TaxRegimeSuccessCallback(csvData)
                $scope.monthlyEmi = response.data;
                $scope.isEMIDetailListVisible = false;
            });
        }

        $scope.emiRepaymentCallback = function () {
            getMonthlyEmpEmi()
            $scope.updatePaginationSettings('emi_repayment_report');
        }

        $scope.reFetchEmiRepayment = function () {
            getMonthlyEmpEmi()

        }

        
    }
]);