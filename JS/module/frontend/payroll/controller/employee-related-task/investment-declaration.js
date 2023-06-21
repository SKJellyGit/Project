app.controller('PayrollInvestmentDeclarationController', [
    '$scope', '$routeParams', '$location', '$timeout', '$q', '$routeParams', '$modal', '$mdDialog', '$window', 'PayrollOverviewService', 'utilityService', 'ServerUtilityService', 'TaxService', 'EmployeeTaskService', 'PayrollParentService',
    function ($scope, $routeParams, $location, $timeout, $q, $routeParams, $modal, $mdDialog, $window, PayrollOverviewService, utilityService, serverUtilityService, taxService, EmployeeTaskService, parentService) {
        var today = new Date(),
            month = today.getMonth(),
            defaultFinancialYear = utilityService.getValue($routeParams, 'fromYear') 
                ? utilityService.getValue($routeParams, 'fromYear') 
                : ((angular.isDefined($scope.yearList) && $scope.yearList.length 
                    ? $scope.yearList[0] : utilityService.getCurrentYear()));            

        if (angular.isDefined($scope.yearList) && $scope.yearList.length) {
            $scope.setForceHideDisable($scope.yearList[0]);
            if ($scope.forceHideDisable) {
                defaultFinancialYear = parseInt($scope.yearList[0], 10) - 1;
            }
        }

        $scope.declarationStatusObj = EmployeeTaskService.declarationObj();
        $scope.empReminderType = PayrollOverviewService.empRemiderTypeObj(); 
        $scope.declarationList = [];
        $scope.isDeclarationListVisible = false;
        $scope.proofList = [];
        $scope.isProofListVisible = false;
        $scope.otherSectionStatusModel = EmployeeTaskService.buildOtherSectionStatusObject();
        $scope.isAll = {
            flag: false,
            count: 0,
            filteredList: [],
            orderByField: '',
            reverse: false
        };        
        $scope.isProofTab = utilityService.getValue($routeParams, 'isProof', 0) == 1 ? true: false;
        $scope.isDeclarationTab = utilityService.getValue($routeParams, 'type') == 'invementDeclaration' ? true: false;
        $scope.allEntityReport = {
            selectedOption: ''
        }
        $scope.downloadInvestmentAttachments = false

        if ($location.path() != '/frontend/payroll/investmentDeclaration') {
            $scope.resetAllTypeFilters();
            $scope.slectedYear = {
                month: month,
                year: defaultFinancialYear,
                monthYear: (month + 1) + "_" + defaultFinancialYear
            };
        }
        $scope.pendingCount = {
            declaration: 0,
            proofSubmission: 0,
            proofApproval: 0
        };
        $scope.modalInstance.deadline = null;
        $scope.deadlineWindow = {
            empIds: [],
            openDate: null,
            closeDate: null
        };
        $scope.isPreviousFinancialYear = false;
        $scope.filterDeclaration = {
            status: ""
        };
        $scope.templateObject = EmployeeTaskService.buildTemplateObject();
        $scope.apiResponse = {
            claim: [],
            masterList: [],
            proofStatus: 'pending'
        };
        $scope.manageTaxStatus = taxService.buildManageTaxStatusObject();

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
        $scope.legal_entity = {
            selected: null,
            entity_id: utilityService.getStorageValue("legalEntityId")
        };

        $scope.landlord = {
            list: [],
            selected: {},
            viewDetails: {},
            detailsObject: {},
            viewType: 'add',
            rentDetailList: []
        };
        $scope.getLegalEntity = function() {
            if($scope.legal_entity.entity_id) {
                var entities_list = JSON.parse(utilityService.getStorageValue("legalEntityElements"));
                $scope.legal_entity.selected = entities_list.find(function(val) { return val._id == $scope.legal_entity.entity_id; });
            } else {
                $scope.legal_entity.selected = null;
            }
            $scope.investmentDeclarationExportFilename = 'declaration_list';
            if($scope.legal_entity.entity_id) {
                $scope.investmentDeclarationExportFilename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
        };
        $scope.getLegalEntity();
        var isInvestmentDeclarationSection = function () {
            return ($scope.hasAdminAllTabAccess.enabled && $scope.tab.employeeTaskRelatedchildTab == 2)
                || (!$scope.hasAdminAllTabAccess.enabled && $scope.tab.employeeTaskRelatedchildTab == 1);
        };
        var isInvestmentProofSection = function () {
            return ($scope.hasAdminAllTabAccess.enabled && $scope.tab.employeeTaskRelatedchildTab == 3)
                || (!$scope.hasAdminAllTabAccess.enabled && $scope.tab.employeeTaskRelatedchildTab == 2);
        };
        var declarationCallback = function (data) {
            $scope.pendingCount = {
                declaration: 0,
                proofSubmission: 0,
                proofApproval: 0
            };
            angular.forEach(data, function (v) {
                v.full_name = v.employee_preview.full_name;
                v.employee_id = v.employee_preview.personal_profile_employee_code;
                v.employee_status = v.employee_preview.system_plans_employee_status;
                v.declarationStatus = $scope.declarationStatusObj[v.status];
                v.empId = v.employee_preview._id;
                if (v.status == 1 && isInvestmentDeclarationSection()) {
                    $scope.pendingCount.declaration += 1;
                }
                if (isInvestmentProofSection()) {
                    if (v.total_submitted_proofs == 0) {
                        $scope.pendingCount.proofSubmission += 1;
                    }
                    $scope.pendingCount.proofApproval += v.total_pending_proof;
                    v.proof_status_filter = utilityService.getValue(v, 'total_pending_proof') ? 'pending' : '';
                }
            });
        };
        var getInvestmentDeclaration = function () {
            var url = EmployeeTaskService.getUrl('investmentDeclaration') 
                + "/" + $scope.slectedYear.year + "/" + ($scope.slectedYear.year + 1);

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    declarationCallback(data.data);
                    $scope.declarationList = data.data;
                    angular.copy($scope.declarationList, $scope.isAll.filteredList);
                    $scope.calculateFacadeCountOfAllFilters($scope.declarationList, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $timeout(function () {
                        $scope.isDeclarationListVisible = true;
                    }, 200);
                });
        };        
        var getInvestmentProofData = function () {
            var financialYearObject = utilityService.getCurrentFinancialYear(),
                // urlPrefix = utilityService.getValue($scope.multipleInvestmentHeads, 'enabled', false) 
                //     && (financialYearObject.start == $scope.slectedYear.year)
                //         ? 'investmentProofMultipleHead' : 'investmentProof',
                url = EmployeeTaskService.getUrl("investmentProofMultipleHead") 
                    + "/" + $scope.slectedYear.year + "/" + ($scope.slectedYear.year + 1);

            serverUtilityService.getWebService(url)
                .then(function (data) {

                    declarationCallback(data.data);
                    $scope.proofList = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.proofList, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $timeout(function () {
                        $scope.isProofListVisible = true;
                    }, 200);
                });
        };
        if($location.path() != '/frontend/payroll/investmentDeclaration'){    
            if (isInvestmentDeclarationSection()) {
                $scope.declarationList = [];
                $scope.isDeclarationListVisible = false;
                getInvestmentDeclaration();
            }
            if (isInvestmentProofSection()) {
                $scope.proofList = [];
                $scope.isProofListVisible = false;
                getInvestmentProofData();
            }
        }
        $scope.updateList = function (year) {
            $scope.slectedYear.year = year;
            $scope.slectedYear.monthYear = (parseInt($scope.slectedYear.month) + 1) + "_" + year;
            
            if (isInvestmentDeclarationSection()) {
                $scope.declarationList = [];
                $scope.isDeclarationListVisible = false;
                getInvestmentDeclaration();
            }
            if (isInvestmentProofSection()) {
                $scope.proofList = [];
                $scope.isProofListVisible = false;
                getInvestmentProofData();
            }
            $scope.setForceHideDisable($scope.slectedYear.year);
        };
        $scope.seeDeclaredData = function (item, flag) {
            flag = angular.isDefined(flag) ? flag : 0;
            var obj = {
                empId: item.employee_preview._id, 
                display: item.employee_preview.display_detail, 
                profile_pic: item.employee_preview.profile_pic,
                fromYear: $scope.slectedYear.year,
                toYear: $scope.slectedYear.year+1,
                type: 'invementDeclaration'
            };
            obj.isProof = flag;
            utilityService.setReloadOnSearch(true);
            $location.url('/frontend/payroll/investmentDeclaration').search(obj);
        };        
        $scope.selectDeselectUser = function (isAll, section) {
            var list = utilityService.getValue($scope.isAll, 'filteredList', []);
            var count = 0;
            angular.forEach(list, function (value) {
                if (section == 'declaration' || section == 'proof') {
                    value.isSelected = isAll;
                } else {
                    value.isSelected = value.total_submitted_proofs == 0 ? isAll : false;
                }
                if (value.isSelected) {
                    count += 1;
                }
            });
            $scope.isAll.count = count;
            $scope.isAll.flag = isAll;
        };
        $scope.updateCount = function(section) {
            var list = utilityService.getValue($scope.isAll, 'filteredList', []);
            var count = 0;
            var declaredCount = 0;
            angular.forEach(list, function (value, key) {
                if (value.isSelected) {
                    count += 1;
                }
                if (value.status == 2 && section == 'declaration') {
                    declaredCount += 1;
                } else if(section == 'proof' && value.total_submitted_proofs > 0) {
                    declaredCount += 1
                }
            }); 
            $scope.isAll.count =  count;
            $scope.isAll.flag = (count == list.length - declaredCount ) ? true : false;
        };
        var addSentReminderObjectToList = function (item) {
            var list = utilityService.getValue(item, 'reminders', []),
                strDate = utilityService.getCurrentDate() + "/" + utilityService.getCurrentDate() + "/"
                    + utilityService.getCurrentYear() + ", " +  utilityService.getCurrentHours() + ":" 
                    + utilityService.getCurrentMinutes();
            
            list.push(strDate);
        };     
        $scope.sendRemiderToEmployee = function (type, slaveId, section, isMultiple, item) {
            $scope.formSubmitHandler('sendReminder', true);
            utilityService.showSimpleToast("Reminder has been sent successfully.");
            var list = utilityService.getValue($scope.isAll, 'filteredList', []);
            var url = PayrollOverviewService.getUrl('reminderToEmp');
            var payload = EmployeeTaskService.buildReminderPayload($scope.empReminderType[type], slaveId, section, isMultiple, list, item);      
            serverUtilityService.postWebService(url,payload)
                .then(function (data){
                    $scope.formSubmitHandler('sendReminder', false);
                    if(data.status == 'success'){                        
                        utilityService.showSimpleToast(data.message);
                        section == 'declaration' ? getInvestmentDeclaration() : 
                            section == 'proof' ? getInvestmentProofData() :
                                section == 'proofAllowence' && $routeParams.empId 
                                    ? getInvestmentDetails() : console.log('something wrong');
                        $scope.isAll.count = 0;
                        $scope.isAll.flag = false;
                        if (section == 'proofAllowence' 
                            && utilityService.getValue($scope.multipleInvestmentHeads, 'enabled', false)) {
                            addSentReminderObjectToList(item);
                        }
                    }
                });
        };
        $scope.csvColumn = {
            'Employee Detail': 'full_name',
            'Employee Id': 'employee_id',
            'Investment Declaration Status': 'declarationStatus',
            'Total Amount Declared': 'total_amount_declared'
        };
        
        /***** Employee declaration *****/
        $scope.slectedEmpDetails = angular.isDefined($routeParams.display) ? $routeParams.display : [];
        $scope.profile_pic = angular.isDefined($routeParams.profile_pic) ? $routeParams.profile_pic : '../../images/avatar.png';
        $scope.empId = angular.isDefined($routeParams.empId) ? $routeParams.empId : null;
        var isProofWindowOpen = function(model)  {
            var proof = {
                enable: utilityService.getValue(model, 'proof_submission_enable', false),
                deadline: utilityService.getValue(model, 'proof_submission_date'),
                nextOpenDate: utilityService.getValue(model, 'proof_submission_open_window_date'),
                nextCloseDate: utilityService.getValue(model, 'proof_submission_close_window_date')
            };

            return taxService.isWindowOpen(proof);
        };
        var synGuideLineModel = function(model, initialLoading) {
            var year = initialLoading ? null : $scope.guideLine.year,
                yearList = initialLoading ? [] : $scope.guideLine.yearList;

            $scope.guideLine = taxService.buildGuideLineObject(model, year, yearList);
        };
        var getInvestmentDetails = function() {
            $q.all([
                serverUtilityService.getWebService(EmployeeTaskService.getUrl('taxMaster')), 
                serverUtilityService.getWebService(EmployeeTaskService.getUrl('adminClaimtax') + "/" + $routeParams.empId + "/" + $routeParams.fromYear + "/" + $routeParams.toYear),
                serverUtilityService.getWebService(EmployeeTaskService.getUrl('incomeTaxGuildline') + '/' + $routeParams.empId)
            ]).then(function(data) {
                $scope.apiResponse.masterList = utilityService.getValue(data[0], 'data', []);
                $scope.apiResponse.claim = utilityService.getValue(data[1], 'data', []);                
                $scope.investmentObject = taxService.buildInvestmentObject(data[1].data);
                $scope.taxMasterList = taxService.buildTaxMasterList(data[0].data, $scope.investmentObject, $scope.isProofTab);
                $scope.isProofWindowOpen = isProofWindowOpen(data[2].data);
                synGuideLineModel(data[2].data, true);
            });
        };        
        if($routeParams.empId) {
            getInvestmentDetails();
            var excludedPortals = ['hrconnect']
            $scope.IsPreviousYear = ($routeParams.fromYear < 2020) && !excludedPortals.includes(envMnt);
        }
        var approvedAmountCallback = function (data){
            var count = 0;
            for(var i = 0; i < $scope.taxMasterList.length; i++){
                for(var j = 0; j < $scope.taxMasterList[i]['detail'].length; j++){
                   if(data.data.sec_no == $scope.taxMasterList[i]['detail'][j].sec_no){
                       for(var k = 0; k < $scope.taxMasterList[i]['detail'][j]['details'].length; k++){
                           if($scope.taxMasterList[i]['detail'][j]['details'][k]['allowance_id'] == data.data._id){
                                $scope.taxMasterList[i]['detail'][j]['details'][k]['status'] = data.data.status;
                                $scope.taxMasterList[i]['detail'][j]['details'][k]['amount_approved'] = data.data.amount_approved;
                                j = $scope.taxMasterList[i]['detail'].length + 1;
                                count = 1;
                                break;
                            }
                       }
                   } 
                }
                if(count > 0){
                    break;
                }
            }
            utilityService.showSimpleToast(data.message);
        }; 
        var resetFieldAfterSubmitting = function (payload) {
            if (payload.action == 1) {
                $scope.otherSectionStatusModel.other_section_status.amount = 0;
            } else {
                $scope.otherSectionStatusModel.other_section_status.reason = null;
            }
        };    
        $scope.approveAmount = function (item){
            var url = EmployeeTaskService.getUrl('approveAmount') + "/" + item.allowance_id,
                payload = {
                    action: $scope.otherSectionStatusModel.other_section_status.status                    
                };

            if(payload.action == 1) {
                payload.amount_approved = $scope.otherSectionStatusModel.other_section_status.amount;
            } else {
                payload.reason = $scope.otherSectionStatusModel.other_section_status.reason;
            }

            serverUtilityService.postWebService(url, payload)
                .then(function (data){
                    if(data.status == 'success') {                                               
                        approvedAmountCallback(data);
                        resetFieldAfterSubmitting(payload);
                    }
                });
        };
        // $scope.viewDownloadProof = function (item, proofId, slug) {
        //     $scope.viewDownloadFileUsingForm(getAPIPath() + "employee/investment-proof/"
        //         + item.allowance_id + "/" + proofId  + "/" + slug + "?employee_id=" + $routeParams.empId);
        // };
        $scope.viewDownloadProof = function (item, proofId, slug) {
            $scope.viewDownloadFileUsingForm(getAPIPath() + "payroll/investment-proof/"
                + item.allowance_id + "/" + proofId + "/view/" + slug);
        };
        $scope.viewDownloadLandlordProof = function (investmentId, proofId, slug) {
            $scope.viewDownloadFileUsingForm(getAPIPath() + "payroll/investment-proof/"
                + investmentId + "/" + proofId + "/view/" + slug);
        };
        $scope.viewDownloadProofhandler = function (item, proofId, slug, action) {
            var fromYear = utilityService.getValue($routeParams, 'fromYear');
            var toYear = utilityService.getValue($routeParams, 'toYear');
            $scope.viewDownloadFileUsingForm(getAPIPath() + "payroll/investment-proof/"
                + item.allowance_id + "/" + proofId  + "/" + action + "/" + slug
                + "?from_year=" + parseInt(fromYear) 
                + "&to_year=" + parseInt(toYear));
        };
        $scope.goBack = function () {
            var tab = $scope.isProofTab ? 'Investment Proofs' : 'Investment Declaration'
            $location.url('/frontend/payroll/summary').search({tabname: tab});
        };
        if ($routeParams.tab == 'declaration') {
            $timeout(function () {
                $routeParams.tab = null;
            }, 500);
        }        
        var setPagination = function () {
            if (isInvestmentDeclarationSection()) {
                $scope.updatePaginationSettings('payroll_emp_investment_dec');
            } else if (isInvestmentProofSection()) {
                $scope.updatePaginationSettings('payroll_emp_investment_proof');
            }
        };
        if (!$scope.empId) {
            setPagination();
        }
        
        /****** Start Overwrite deadline functionality *******/        
        $scope.openDeadlineModal = function() {
            $scope.modalInstance.deadline = $modal.open({
                templateUrl : 'overwrite-deadline.tmpl.html',
                scope : $scope,                
                windowClass: 'fadeEffect',
                backdrop: 'static'
            });
        };
        $scope.closeDeadlineModal = function () {
            $scope.modalInstance.deadline.dismiss('cancel');
        };
        $scope.openDeadLineWindow = function(section) {            
            $scope.deadlineWindow = {
                empIds: [],
                openDate: new Date(),
                closeDate: new Date(),
                title: section
            };
            var list = utilityService.getValue($scope.isAll, 'filteredList', []);
            angular.forEach(list, function (value, key) {
                if (value.isSelected) {
                    $scope.deadlineWindow.empIds.push(value.empId);
                }
            });

            $scope.openDeadlineModal();
        };
        $scope.updateDeadLineSetting = function() {
            $scope.errorMessages = [];
            var url = EmployeeTaskService.getUrl('deadlineWindow'),
                payload = EmployeeTaskService.buildDeadLineWindowPayload($scope.deadlineWindow);
            
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, 'deadlineWindow');
                });
        };
        var successCallback = function(data, section) {
            $scope.closeDeadlineModal();
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            if($scope.deadlineWindow.title == "declaration") {
                getInvestmentDeclaration();
            } else if ($scope.deadlineWindow.title == "proof") {
                getInvestmentProofData();
            }
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };        
        var successErrorCallback = function (data, section) {
            data.status === "success" ? 
                successCallback(data, section) : errorCallback(data, section);
        };        
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        /****** End Overwrite deadline functionality ******/        
        
        $scope.hraPendingAmount =  0;
        $scope.openHRAPendingAmt = function(detail) {
            var amount = 0;

            angular.forEach(detail.details[0].rent_detail, function(item, key) {
                if(detail.sec_no == 'rent_info' && item.proof) {
                    amount = amount + parseInt(item.amount, 10);
                }                
            });

            $scope.hraPendingAmount =  amount;
        };
        $scope.approveHRAAmount = function (detail, hraPendingAmount) {
            var url = EmployeeTaskService.getUrl('approveAmount') + "/" + detail.details[0].allowance_id,
                payload = {
                    action: $scope.otherSectionStatusModel.other_section_status.status,
                    start_year: $routeParams.fromYear,
                    end_year :  $routeParams.toYear                   
                };

            if (payload.action == 1) {
                payload.amount_approved = parseInt(hraPendingAmount);
            } else {
                payload.reason = $scope.otherSectionStatusModel.other_section_status.reason;
            }
            serverUtilityService.postWebService(url, payload)
                .then(function (data){
                    if(data.status == 'success'){
                        approvedAmountCallback(data);
                    }
                });
        };
        var exportToCsv = function(object, filename) {
            utilityService.exportToCsv(object.content, filename);
        };
        $scope.downloadEmployeeDetails = function(item) {
            // var param = {};
            // if (utilityService.getValue($scope.allEntityReport, 'selectedOption') === 'all') {
            //     param['all-legal-entities'] = true;
            // }

            $q.all([
                serverUtilityService.getWebService(parentService.getUrl('empDetailsHeader') + '/' + item.id),
                serverUtilityService.getWebService(parentService.getUrl('empDetailsContent') + '/'  + item.id)
            ]).then(function (data) {
                var object = parentService.buildCSVContent(data[0].data, data[1].data, $scope.templateObject.hashMap),  
                    year = utilityService.getValue($scope.slectedYear, 'year'),
                    accountingYear = year + '-' + (parseInt(year, 10) + 1),
                    fileName = item.filename + '-' + accountingYear + item.extension;

                exportToCsv(object, fileName);
            });
        };
        
        if (utilityService.getValue($routeParams, 'fromYear')) {
            $scope.setForceHideDisable(utilityService.getValue($routeParams, 'fromYear'));
        } else {
            $scope.setForceHideDisable(defaultFinancialYear);
        }
        $scope.sortBy = function(orderByField) {
            $scope.isAll.reverse = ($scope.isAll.orderByField === orderByField) ? !$scope.isAll.reverse : false;
            $scope.isAll.orderByField = orderByField;
        };
        
        /***** Start: Multiple Head Amount Claim & Proof Section ******/
        $scope.investmentHead = {
            list: [],
            visible: true,
            item: {},
            amount_claimed: null           
        };
        $scope.viewInvestmentHead = function (item, allowanceId) {
            $scope.investmentHead.item = item;
            angular.copy(utilityService.getInnerValue($scope.investmentHead, 'item', 'investment_claimed', []), $scope.investmentHead.list);
            if(item.amount){
                $scope.investmentHead.item.amount_claimed = item.amount
                $scope.investmentHead.item.amount_declared = item.amount
            }
            if(item.landlord_name){
                // $scope.investmentHead.item._id = item._id.$id
                $scope.investmentHead.item.allowance_id =   allowanceId
                $scope.investmentHead.item.name = item.landlord_name
                $scope.investmentHead.list = [{
                    amount_approved: item.amount_approved,
                    amount_claimed: item.amount,
                    is_uploaded_tax_claimed: false,
                    reason: "",
                    status: item.status,
                    _id: item._id,
                   
                }]
            }

            if (!utilityService.getValue($scope.investmentHead, 'list').length) {
                $scope.investmentHead.list = new Array(taxService.buildDefaultHeadObject());
            }
            $scope.openModal('multiple-head-claim.tmpl.html', 'multipleHead', 'lg');            
        };
        var syncUpdatedResponseWithExistingApiResponse = function (claimObject) {
            taxService.addSyncMissingClaimToList($scope.apiResponse.claim, claimObject);
            $scope.investmentObject = taxService.buildInvestmentObject($scope.apiResponse.claim);
            $scope.taxMasterList = taxService.buildTaxMasterList($scope.apiResponse.masterList, $scope.investmentObject);
        };
        var approveRejectSuccessCallback = function (data) {
            if(data.data.parent_sec_no === 'house_rent_detail'){
                $scope.closeModal('multipleHead')
            }
            angular.copy(utilityService.getInnerValue(data, 'data', 'investment_claimed', []), $scope.investmentHead.list);
            utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            getInvestmentDetails();
            //syncUpdatedResponseWithExistingApiResponse(utilityService.getValue(data, 'data'));
        };
        var approveRejectRequestCallback = function (data, event) {
            $scope.formSubmitHandler('approveReject', false);
            utilityService.getValue(data, 'status') === 'success'
                ? approveRejectSuccessCallback(data)
                : showAlert(event, utilityService.getValue(data, 'message'));              
        };
        $scope.approveRejectRequest = function (item, event) {
            $scope.formSubmitHandler('approveReject', true);
            var url = EmployeeTaskService.getUrl('approveRejectRequest') + "/" 
                    + $scope.investmentHead.item.allowance_id + "/"
                    + (angular.isObject(item._id) ? item._id.$id : item._id),
                payload = EmployeeTaskService.buildApproveRejectRequestPayload(item);                

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    approveRejectRequestCallback(data, event);
                });
        };
        $scope.viewDownloadClaimProof = function(item, slug, action) {
            var claimId = angular.isObject(item._id) ? item._id.$id : item._id;
            var fromYear = utilityService.getValue($routeParams, 'fromYear');
            var toYear = utilityService.getValue($routeParams, 'toYear');
            var allowanceId = utilityService.getInnerValue($scope.investmentHead, 'item', 'allowance_id');
            $scope.viewDownloadFileUsingForm(getAPIPath() + "payroll/investment-proof/" 
                + allowanceId + "/" 
                + claimId + "/" + action + "/" + slug
                + "?from_year=" + parseInt(fromYear) 
                + "&to_year=" + parseInt(toYear));
        };

        $scope.viewDownloadClaimProofHra = function(item, proofId, slug, action) {
            var claimId = angular.isObject(proofId._id) ? proofId._id.$id : proofId._id;
            var fromYear = utilityService.getValue($routeParams, 'fromYear');
            var toYear = utilityService.getValue($routeParams, 'toYear');
            var allowanceId = utilityService.getValue(item, 'allowance_id');
            
            $scope.viewDownloadFileUsingForm(getAPIPath() + "payroll/investment-proof/" 
                + allowanceId + "/" 
                + claimId + "/" + action + "/" + slug
                + "?from_year=" + parseInt(fromYear) 
                + "&to_year=" + parseInt(toYear));
        };
        
        $scope.toggleEditableSection = function (item, isEditable) {
            item.is_editable = isEditable;
        };
        $scope.isPendingRequest = function (item) {
            var isPending = false;

            angular.forEach(utilityService.getValue(item, 'investment_claimed', []), function (value, key) {
                if (!isPending && utilityService.getValue(value, 'status') == 1) {
                    isPending = isPending || true;
                }
            });

            return isPending;
        };     
        /***** End: Multiple Head Amount Claim & Proof Section *****/

        /***** Start Angular Modal Section *****/
        $scope.openModal = function(templateUrl, instance, size) {
            size = angular.isDefined(size) ? size : 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl : templateUrl,
                scope : $scope,
                windowClass : 'fadeEffect',
                size: size,
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function(instance) {
            $scope.errorMessages = []
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };
        /********* End Angular Modal Section *********/

        /***** Start Confirm Dialog *****/
        var showAlert = function(ev, textContent, title) {
            title = angular.isDefined(title) ? title : 'Alert!';
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(textContent)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
        $scope.showAlert = function (ev, textContent, title) {
            showAlert(ev, textContent, title);
        };
        /***** End Confirm Dialog *****/  

        var TaxRegimeSuccessCallback = function (data) {
            var year = utilityService.getValue($scope.slectedYear, 'year'),
            accountingYear = year + '-' + (parseInt(year, 10) + 1),
            fileName = 'tax-regime-report' + '-' + accountingYear + ".csv";
            exportToCsv(data, fileName)
        };

        $scope.downloadTaxRegimeReport = function() {
            var url = EmployeeTaskService.getUrl('taxRegimeReport')
            var financialYear = utilityService.getCurrentFinancialYear();
            url = url + "/" + financialYear.start + "/" + financialYear.end;

            serverUtilityService.getWebService(url)
            .then(function (response){
                var csvData = EmployeeTaskService.buildTaxRegimeCSV(response.data)
                TaxRegimeSuccessCallback(csvData)
            });
        };

        /***** Start Download Sample Template & Upload Filled Template Section *****/
        $scope.bulk = parentService.buildBulkObject();
        $scope.allowBulkUpload = {
            visible: false,
            message: null,
            status: false
        };
        var checkToAllowBulkUploadCallback = function (data) {
            $scope.allowBulkUpload.status = utilityService.getValue(data, 'status') === 'success'
                && utilityService.getInnerValue(data, 'data', 'allow_bulk_upload');
            $scope.allowBulkUpload.message = utilityService.getValue(data, 'message');
            $scope.allowBulkUpload.visible = true;
        };
        var checkToAllowBulkUpload = function() {
            serverUtilityService.getWebService(parentService.getUrl('checkToAllowBulkOption'))
                .then(function (data) {
                    checkToAllowBulkUploadCallback(data);
                });
        };
        checkToAllowBulkUpload();
        var bulkSuccessCallback = function (data, section, msg, sectionKey) {
            msg = angular.isDefined(msg) && msg ? msg 
                : utilityService.getValue(data, 'message', 'Sheet has been uploaded successfully');

            utilityService.resetAPIError(false, null, section);
            if (angular.isDefined(data.data)) {
                utilityService.showSimpleToast(msg);
            } else {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            }
        };
        var bulkErrorCallback = function (data, section, sectionKey) {
            if (data.status == "error") {
                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(data.message);
            } else if (data.data.status == 'error') {
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

                if (section === 'bulkFilledTemplate') {
                    $scope.openModal('bulk-upload-error.tmpl.html', 'bulkUploadError');
                }
            }
            $scope.clearFileUpload($scope.bulk, sectionKey);            
        };
        var bulkSuccessErrorCallback = function (data, section, msg, sectionKey) {
            data.status === "success" ? bulkSuccessCallback(data, section, msg, sectionKey)
                    : bulkErrorCallback(data, section, sectionKey);
        };
        $scope.downloadSampleTemplate = function(urlPrefix) {
            $scope.viewDownloadFileUsingForm(parentService.getUrl(urlPrefix));
        };        
        $scope.uploadFilledTemplate = function(fileObject, keyName, urlPrefix, sectionKey) {
            $scope.errorMessages = [];
            var url = parentService.getUrl(urlPrefix), msg = "",
                payload = {};

            payload[keyName] = fileObject;
            if(urlPrefix === 'taxRegimeUpload'){
                payload["start_year"] = $scope.slectedYear.year;
                payload["end_year"] = ($scope.slectedYear.year + 1)
            }

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    bulkSuccessErrorCallback(data, 'bulkFilledTemplate', msg, sectionKey);
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
            console.log(model);
        };
        $scope.setCommonFileObject = function(model, keyname, file) {
            model[keyname].file = file;
            model[keyname].isUploaded = true;
        };

        $scope.calculateRegime = function (id) {
            var url = EmployeeTaskService.getUrl('getTaxRegime') + '/' + $routeParams.empId;
            serverUtilityService.getWebService(url).then(function (data) {
                if (data.status === "error") {
                    showAlert(event, data.message);
                } else {
                    $scope.regimeTax = data.data;
                    $scope.openModal('calculateRegime.tmpl.html', 'calculateRegimeTmpl', 'lg');
                }
            });
        };

        $scope.downloadBulkAttachments = function () {
            var url = EmployeeTaskService.getUrl('downloadBulkAttachments');
            var payload = {
                "from_year": $routeParams.fromYear,
                "to_year": $routeParams.toYear,
                "emp_ids": [$routeParams.empId]
            }
            $scope.viewDownloadFileUsingFormAndPayload(url, payload);
        }; 
        var buildError = function (data) {
            var error = []
            if (data.status == "error") {
                error.push(data.message);
            } else if (data.data.status == 'error') {
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            error.push(v);
                        });
                    });
                } else {
                    error.push(data.data.message);
                }
            }
            return error;
        }

        var  revertThePendingState = function(itemId, parentId, item) {
            $scope.errorMessages = [];
            var fromYear = utilityService.getValue($routeParams, 'fromYear');
            var toYear = utilityService.getValue($routeParams, 'toYear');
            var url = EmployeeTaskService.getUrl('revertToPending') + "/" + parseInt(fromYear) + "/" + parseInt(toYear) + "/" + parentId + "/" + itemId,
                payload = {};
            serverUtilityService.patchWebService(url, payload)
                .then(function(data){
                    if((utilityService.getValue(data, 'status') === 'success') ||  (utilityService.getValue(data, 'status') === 'status')){
                        item.status = 1
                        getInvestmentDetails();
                    }else {
                        $scope.errorMessages = buildError(data)
                    }
                });
        };
        var  revertThePendingStateHRA = function(item) {
            var fromYear = utilityService.getValue($routeParams, 'fromYear');
            var toYear = utilityService.getValue($routeParams, 'toYear');
            var url = EmployeeTaskService.getUrl('revertToPending') + "/" + parseInt(fromYear) + "/" + parseInt(toYear) + "/" + item.allowance_id,
                payload = {};
            serverUtilityService.patchWebService(url, payload)
                .then(function(data){
                    if(utilityService.getValue(data, 'status') === 'success'||  (utilityService.getValue(data, 'status') === 'status')){
                        item.status = 1
                        // getInvestmentDetails();
                    }
                });
        };

        $scope.revertToPendingState = function(item){
            console.log($scope.investmentHead.item)
            revertThePendingState(angular.isObject(item._id) ? item._id.$id : item._id, $scope.investmentHead.item.allowance_id, item)

        }
        $scope.revertToPendingStateHra = function(item){
            revertThePendingStateHRA(item)
        }
        $scope.viewRentDetails = function (detail, item) {
            angular.copy(item, $scope.landlord.viewDetails);
            angular.copy(detail.details[0], $scope.landlord.detailsObject);
            $scope.openModal('hra-landlord-details.tmpl.html', 'hra', 'lg');
        };

        /**** End: Generic File Upload Related Function  *****/
        $scope.adminUploadProofs = function (item) {
            var url = '#/frontend/payroll/investmentProof',
                queryParams = 'empId=' + item.empId 
                    + "&name=" + item.full_name 
                    + "&code=" + item.employee_id 
                    + "&pic=" + utilityService.getInnerValue(item, 'employee_preview', 'profile_pic')
                    + "&employee_type=active" + "&year=" + $scope.slectedYear.year;

            $window.open(url + '?' + queryParams, '_blank');
        };

        var getPayrollModulePermissions = function () {
            var url = EmployeeTaskService.getUrl('modulePermission') + '/payroll'; 
            serverUtilityService.getWebService(url)
                .then(function (data){
                    console.log(data)
                    var response = utilityService.getValue(data, 'data', []);
                    angular.forEach(response, function(value){
                        if(value.permission_slug === 'download_investment_attachments'){
                            $scope.downloadInvestmentAttachments = true
                        }
                        
                    })

                });
        };
        getPayrollModulePermissions()
    }

]);