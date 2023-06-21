app.controller('PayrollEmployeeClaimsController', [
    '$scope', '$timeout', '$modal', 'utilityService', 'ServerUtilityService', 'TimeOffService', 'EmployeeTaskService', 
    function ($scope, $timeout, $modal, utilityService, serverUtilityService, timeOffService, EmployeeTaskService) {
         
        var today = new Date(),
            month = today.getMonth();

        $scope.resetAllTypeFilters();
        $scope.claimList = [];
        $scope.claimObj = {
            selectedSubTab: 0,
            filteredList:[],
            comment: {
                text: null
            },
            expenses: {
                list: [],
                selected: ''
            },
            billDetails: null,
            possibility: {
                pending: 1,
                rejected: 9,
                approved: 8
            },
            status: null,
            selectedEmployees: [],
            isChecked: false,
            statusMapping: {
                1: 'Pending',
                9: 'Reject',
                8: 'Approve'
            },
            selected: {},
            amountDetails: {},
            type: null,
            typeList: [
                {
                    title: "All Status",
                    status: ''
                },
                {
                	title: "Pending",
                	status: 1
                },
                {
                    title: "Rejected",
                    status: 2
                },
                {
                    title: "Approved",
                    status: 3
                }
            ],
            reason: null,
            pendingChecked: 0
        };
        $scope.isClaimListSummary = false;  
        $scope.updatePaginationSettings('payroll_emp_claim');
        $scope.slectedYear = {
            month: month,
            year: $scope.yearList[0],
            monthYear: $scope.yearList[0] + "_" + (month + 1),
            currentYear: $scope.yearList[0],
            currentMonth: month + 1
        };
        $scope.pendingClaim = {
            count: 0,
            totalAmount: 0
        };
        $scope.eligible = {
            enabled: $scope.isEligibleForClaim(),
            amountDetails: null
        };

        $scope.legal_entity = {
            selected: null,
            entity_id: utilityService.getStorageValue("legalEntityId")
        };
        $scope.getLegalEntity = function() {
            if($scope.legal_entity.entity_id) {
                var entities_list = JSON.parse(utilityService.getStorageValue("legalEntityElements"));
                $scope.legal_entity.selected = entities_list.find(function(val) { return val._id == $scope.legal_entity.entity_id; });
            } else {
                $scope.legal_entity.selected = null;
            }
        };
        $scope.getLegalEntity();
        
        var getPendingClaimCount = function (data) {
            $scope.pendingClaim = {
                count: 0,
                totalAmount: 0
            };

            $scope.claimObj.isChecked = false;
            $scope.claimObj.pendingChecked = 0;

            angular.forEach(data, function (value) {
                value.full_name = value.employee_preview.full_name;
                value.employee_id = value.employee_preview.emp_code;
                value.employee_status = value.employee_preview.emp_status;
                value.requestStatus = $scope.approvalStatus[value.status];
                if(value.status == 1) {
                   $scope.pendingClaim.count += 1; 
                   $scope.pendingClaim.totalAmount += parseFloat(value.claim_amount); 
                }
                value.isChecked = false;

                utilityService.setFilterStatusKey(value);
            });
        };        
        var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true,
                collection_key: 'employee_preview'
            },
            {
                countObject: 'employeeStatus',
                collection: [1,2,3,4,5],
                isArray: false,
                key: 'employee_status'
            },
            {
                countObject: 'salary',
                collection: [],
                isSalary:true
            }
        ];
        var getAllEmployeeClaims = function (){
            var url = EmployeeTaskService.getUrl('claimList') + "/" + $scope.slectedYear.monthYear;
            serverUtilityService.getWebService(url).then(function (data){
                getPendingClaimCount(data.data);
                $scope.claimList = timeOffService.buildRequestList(data.data);
                $scope.calculateFacadeCountOfAllFilters($scope.claimList, allFilterObject);
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                $timeout(function (){
                    $scope.isClaimListSummary = true;
                }, 200);
            });
        };
        $scope.setMonthTab = function (){
            $scope.claimList = [];
            $scope.isClaimListSummary = false;
            $scope.slectedYear.monthYear = $scope.slectedYear.year + "_" + (parseInt($scope.slectedYear.month) + 1);
            getAllEmployeeClaims();
        };         
        $scope.updateClaimList = function (year){
            $scope.claimList = [];
            $scope.isClaimListSummary = false;
            $scope.slectedYear.year = year;
            $scope.slectedYear.monthYear = year + "_" + (parseInt($scope.slectedYear.month) + 1);
            getAllEmployeeClaims();
        };         
        $scope.viewClaimDocument = function(claim, proof) {
            var url = EmployeeTaskService.getUrl('claimProof') + "/" + claim._id + "/" + proof.slug;
            $scope.viewDownloadFileUsingForm(url);
        };        
        $scope.csvColumn = {
            'Employee Detail' : 'full_name',
            'Employee Id' : 'employee_id',
            'Category Name' : 'expense_category_name',
            'Bill No.' : 'bill_no',
            'Claim Amount' : 'claim_amount',
            'Requsted On' : 'claim_date',
            'Period': 'bill_date',
            'Details': 'bill_detail',
            'Approval Status': 'requestStatus'
        };
        $scope.sendReminder = function() {
            utilityService.showSimpleToast("Remainder has been sent successfully.");
        };
        $scope.viewRejectedComment = function (comment) {
            $scope.openModal('rejected-comment.html', 'comment', 'sm');
            $scope.claimObj.comment.text = comment;
        };
        var getExpenseCategoryList = function () {
            serverUtilityService.getWebService(EmployeeTaskService.getUrl('expenses'))
                .then(function(data) {
                    $scope.claimObj.expenses.list = utilityService.getValue(data, 'data');
                });
        };
        getExpenseCategoryList();
        $scope.exportToCsv = function() {
            var filename = 'claim-list-' + (parseInt($scope.slectedYear.month) + 1) + "-" + $scope.slectedYear.year + '.csv',
                csvData = EmployeeTaskService.buildCsvData($scope.claimObj.filteredList, $scope.approvalStatus);

            $timeout(function () {
                utilityService.exportToCsv(csvData.content, filename);
            }, 1000);
        };
        $scope.viewBillDetails = function (details) {
            $scope.claimObj.billDetails = details;
            $scope.openModal('bill-details.tmpl.html', 'billDetails', 'sm');         
        };                  
        $scope.selectAllEmployees = function(model) {
            var pendingChecked = 0;            
            model.pendingChecked = 0;

            angular.forEach(model.filteredList, function(value, key) {
                if (utilityService.getValue(value, 'status') == 1) {
                    value.isChecked = model.isChecked;
                    pendingChecked++;
                }                
            });

            model.pendingChecked = model.isChecked ? pendingChecked : 0;
        };
        $scope.checkboxHandler = function (isChecked) {
            if (isChecked) {
                $scope.claimObj.pendingChecked = parseInt($scope.claimObj.pendingChecked, 10) + 1;
                var pendingCount = $scope.getPendingClaims();
                if (pendingCount == $scope.claimObj.pendingChecked) {
                    $scope.claimObj.isChecked = true;
                }
            } else {
                $scope.claimObj.pendingChecked = parseInt($scope.claimObj.pendingChecked, 10) - 1;
                $scope.claimObj.isChecked = false;
            }
        };
        $scope.viewEligibility = function (item) {
            var url = EmployeeTaskService.getUrl('eligibility') + "/" + item._id;

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.eligible.amountDetails = data.data;
                    $scope.openModal('claim-eligibility.tmpl.html', 'eligibility');
                });            
        };
        $scope.changeClaimAmount = function (item) {
            $scope.errorMessages = [];
            angular.copy(item, $scope.claimObj.selected);
            $scope.openModal('change-claim-amount.tmpl.html', 'claimAmount', 'md');
        };
        $scope.updateClaimAmount = function () {
            $scope.formSubmitHandler('claim', true);
            var url = EmployeeTaskService.getUrl('updateClaimAmount') + "/" + utilityService.getInnerValue($scope.claimObj, 'selected', '_id'),
                payload = EmployeeTaskService.buildUpdateClaimAmountPayload($scope.claimObj.selected);

            serverUtilityService.patchWebService(url, payload)
                .then(function(data) {
                    $scope.formSubmitHandler('claim', false);
                    successErrorCallback(data, "claimAmount");
                });

        };
        var getSelectedEmployeesForApproveReject = function(list) {           
            var checkedList = [];
            angular.forEach(list, function(value, key) {
                if(value.isChecked && utilityService.getValue(value, 'status') == 1) {
                    checkedList.push(value);
                }
            });

            return checkedList;
        };
        $scope.approveRejectClaims = function(status) {
            $scope.errorMessages = [];
            $scope.claimObj.comment.text = null;
            $scope.claimObj.status = status;
            angular.copy($scope.claimObj.selectedEmployees, []);
            $scope.claimObj.selectedEmployees = getSelectedEmployeesForApproveReject($scope.claimObj.filteredList);
            $scope.openModal('claim-approve-reject.tmpl.html', 'approveReject', 'sm');
        };
        $scope.approveReject = function() {
            var url = EmployeeTaskService.getUrl('approveReject'),
                payload = EmployeeTaskService.buildApproveRejectPayload($scope.claimObj);
            
            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, "approveReject");
                });
        };
        $scope.getPendingClaims = function () {
            var count = 0;

            angular.forEach($scope.claimObj.filteredList, function (value) {
                if (utilityService.getValue(value, 'status') == 1) {
                    count++;
                }
            });

            return count;
        };
        $scope.getPendingClaimAmount = function () {
            var amount = 0;

            angular.forEach($scope.claimObj.filteredList, function (value) {
                if (utilityService.getValue(value, 'status') == 1) {
                    amount = amount + parseInt(utilityService.getValue(value, 'claim_amount', 0));
                }
            });

            return amount;
        };
        $scope.viewReason = function (reason) {
            $scope.claimObj.reason = reason;
            $scope.openModal('view-reason.tmpl.html', 'reason', 'sm');         
        };

        /***** Start Angular Modal Section *****/
        $scope.openModal = function(templateUrl, instance, size) {
            size = size || 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass : 'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };
        /***** End Angular Modal Section *****/

        $scope.resetAPIError = function(status, message, api) {
            return utilityService.resetAPIError(status, message, api);
        };
        var successErrorCallback = function (data, section) {
            if (data.status === "success") {                
                utilityService.showSimpleToast(data.message);
                $scope.resetAPIError(false, null, section);
                if(section === "claimAmount") {
                    $scope.closeModal('claimAmount');
                }
                if(section === "approveReject") {
                    $scope.closeModal('approveReject');
                }
                getAllEmployeeClaims();
            } else if (data.status === "error") {
                $scope.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(utilityService.getValue(data, 'message'));
            } else {
                $scope.resetAPIError(true, data.data.message, section);
                var message = utilityService.getInnerValue(data, 'data', 'message');                
                if (typeof message === 'string') {
                    $scope.errorMessages.push(message);                    
                } else {
                    angular.forEach(data.data.message, function (value, key) {
                        $scope.errorMessages.push(value[0]);
                    });
                }                
            }
        };

        $scope.reimbursement = {
            summary: null,
            bt: null
        };

        $scope.getReimbursementSummaryList = function() {
            var year = utilityService.getValue($scope.reimbursement.summary.year, 'selected');
            var month = parseInt(utilityService.getValue($scope.reimbursement.summary.month, 'selected'));
            if(!year || isNaN(month)) { return false; }
            $scope.reimbursement.summary.visible = false;
            var url = EmployeeTaskService.getUrl('reimbursementSummary') + '/' + year + '/' + (month+1);
            
            serverUtilityService.getWebService(url)
                .then(function(data) {
                $scope.reimbursement.summary.dynamic_head = utilityService.getInnerValue(data, 'data', 'heads', null);
                var buildObj = EmployeeTaskService.buildReimbursementSummaryList(utilityService.getInnerValue(data, 'data', 'rows', []));
                $scope.reimbursement.summary.list = buildObj.list;
                $scope.reimbursement.summary.total_amount = buildObj.total_amount;
                $scope.reimbursement.summary.visible = true;
            });
        };

        $scope.initializeReimbursementSummaryTab = function() {
            var obj = EmployeeTaskService.initialReimbursementBuild();
            $scope.reimbursement.summary = EmployeeTaskService.buildReimbursementSummaryObj(obj);
            // $scope.getReimbursementSummaryList();
        };

        $scope.getReimbursementBTList = function() {
            var year = utilityService.getValue($scope.reimbursement.bt.year, 'selected');
            var month = parseInt(utilityService.getValue($scope.reimbursement.bt.month, 'selected'));
            if(!year || isNaN(month)) { return false; }
            $scope.reimbursement.bt.visible = false;
            var url = EmployeeTaskService.getUrl('reimbursementBt') + '/' + year + '/' + (month+1);
            
            serverUtilityService.getWebService(url)
                .then(function(data) {
                $scope.reimbursement.bt.dynamic_head = utilityService.getInnerValue(data, 'data', 'heads', null);
                var buildObj = EmployeeTaskService.buildReimbursementBTList(utilityService.getInnerValue(data, 'data', 'rows', []));
                $scope.reimbursement.bt.list = buildObj.list;
                $scope.reimbursement.bt.total_amount = buildObj.total_amount;
                $scope.reimbursement.bt.visible = true;
            });
        };

        $scope.initializeReimbursementBTTab = function() {
            var obj = EmployeeTaskService.initialReimbursementBuild();
            $scope.reimbursement.bt = EmployeeTaskService.buildReimbursementBTObj(obj);
            // $scope.getReimbursementBTList();
        };

        $scope.niyoCouponTab = function() {
            $scope.niyoCouponTabActivate = true;
        }

        $scope.exportReimbursement = function(section, list) {
            var table = [],
                filename = '';
            if(section == 'summary') {
                table = EmployeeTaskService.buildReimbursementSummaryReport($scope.reimbursement.summary.list, $scope.reimbursement.summary.dynamic_head, $scope.reimbursement.summary.total_amount);
                filename = 'Reimbursement_Summary';
                if(utilityService.getValue($scope.reimbursement.summary.year, 'selected')) {
                    filename += '_' + utilityService.getValue($scope.reimbursement.summary.year, 'selected');
                }
                if(utilityService.getValue($scope.reimbursement.summary.month, 'selected')) {
                    filename += '_' + utilityService.getValue($scope.reimbursement.summary.month.list, $scope.reimbursement.summary.month.selected);
                }
                if($scope.legal_entity.entity_id) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
            }
            if(section == 'bt') {
                table = EmployeeTaskService.buildReimbursementBTReport($scope.reimbursement.bt.list, $scope.reimbursement.bt.dynamic_head, $scope.reimbursement.bt.total_amount);
                filename = 'Reimbursement_Bank_transfer';
                if(utilityService.getValue($scope.reimbursement.bt.year, 'selected')) {
                    filename += '_' + utilityService.getValue($scope.reimbursement.bt.year, 'selected');
                }
                if(utilityService.getValue($scope.reimbursement.bt.month, 'selected')) {
                    filename += '_' + utilityService.getValue($scope.reimbursement.bt.month.list, $scope.reimbursement.bt.month.selected);
                }
                if($scope.legal_entity.entity_id) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
            }
            if(filename) {
                utilityService.exportToCsv(table, filename);
            }
        };

        $scope.changeReimbursementYear = function(section) {
            if(section == 'summary') {
                $scope.getReimbursementSummaryList();
            }
            if(section == 'bt') {
                $scope.getReimbursementBTList();
            }
        };

        $scope.changeReimbursementMonth = function(section, month) {
            if(section == 'summary') {
                $scope.reimbursement.summary.month.selected = month;
                $scope.getReimbursementSummaryList();
            }
            if(section == 'bt') {
                $scope.reimbursement.bt.month.selected = month;
                $scope.getReimbursementBTList();
            }
        };

        $scope.downloadReimbursementMonthlyReport = function() {
            var url = EmployeeTaskService.getUrl('reimbursementMonthly') + '/' + $scope.slectedYear.year + '/' + (parseInt($scope.slectedYear.month) + 1);
            var filename = 'Reimbursement_Report';
            if($scope.legal_entity.entity_id) {
                filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
            filename += '.csv';
            var topHeader = 'Reimbursement Final Cut for month of ';
            if($scope.legal_entity.entity_id) {
                topHeader += utilityService.getValue($scope.legal_entity.selected, 'name') + ' ';
            }
            var months = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov","Dec"];
            topHeader += months[$scope.slectedYear.month]+'-'+$scope.slectedYear.year;
            serverUtilityService.getWebService(url)
                .then(function(data) {
                var table = EmployeeTaskService.buildReimbursementMonthlyReport(data.data, topHeader);
                utilityService.exportToCsv(table, filename);
            });
        };
        $scope.downloadReimbursementMonthlyReport2 = function() {
            var url = EmployeeTaskService.getUrl('reimbursementMonthly2') + '/' + $scope.slectedYear.year + '/' + (parseInt($scope.slectedYear.month) + 1);
            var filename = 'Reimbursement_Report';
            if($scope.legal_entity.entity_id) {
                filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
            filename += '.csv';
            var topHeader = 'Reimbursement Final Cut for month of ';
            if($scope.legal_entity.entity_id) {
                topHeader += utilityService.getValue($scope.legal_entity.selected, 'name') + ' ';
            }
            var months = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov","Dec"];
            topHeader += months[$scope.slectedYear.month]+'-'+$scope.slectedYear.year;
            serverUtilityService.getWebService(url)
                .then(function(data) {
                var table = EmployeeTaskService.buildReimbursementMonthlyReport(data.data, topHeader);
                utilityService.exportToCsv(table, filename);
            });
        };

        $scope.disabledMonth2020 = function (month) {
            var disabledMonth =  ['Jan', 'Feb', 'Mar'];
             var isdisabled = false;
            if(disabledMonth.indexOf(month) > -1) {
                isdisabled = true;
            }
            return isdisabled;
         }

        /**** Start Pagination Section ****/
        $scope.updatePaginationSettings('reimbursement_summary_tab');
        $scope.updatePaginationSettings('reimbursement_bank_transfer_tab');
        /**** End Pagination Section ****/
    }
]);