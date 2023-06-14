app.controller('PayController', [
	'$scope', 'utilityService', '$routeParams', '$location', 'ServerUtilityService', '$q', '$timeout', 'TimeOffService', 'SalaryService', 'CompensationService', '$modal', '$mdDialog', 'PayrollOverviewService', 'FORM_BUILDER',
	function ($scope, utilityService, $routeParams, $location, serverUtilityService, $q, $timeout, timeOffService, salaryService, compensationService, $modal, $mdDialog, PayrollOverviewService, FORM_BUILDER) {
        salaryService.envMnt = $scope.envMnt;
        $scope.myPay = salaryService.buildMyPayObject();
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.staticWork = 1;
        $scope.myPay.claim.isEligible = $scope.isEligibleForClaim();
        $scope.salaryClaimId = 101;
        $scope.approvalStatus = PayrollOverviewService.requestStatusObj();
        $scope.eligible = {
            enabled: $scope.isEligibleForClaim(),
            amountDetails: null,
            yearlyBalance: null
        };
        $scope.allowedDomains = salaryService.allowedDomains;
        
        /************* Start Account Detail Section *************/        
        var getDurationList = function() {
            serverUtilityService.getWebService(compensationService.getUrl('duration'))
                .then(function(data) {
                    salaryService.durationListCallback(data, $scope.myPay.salary);
                });
        };
        if ($scope.section.dashboard.compensation) {
            getDurationList();
        }        
        var syncSalaryModel = function(model) {
            $scope.myPay.salary = salaryService.buildSalaryObject(model);
        };
        var buildGraphData = function(data) {
            var graphObject = {};            
            graphObject = salaryService.buildGraphObject(data, 'ctc', $scope.myPay.salary.fromYear, $scope.myPay.salary.toYear);
            $scope.myPay.salary.graph = graphObject.graph;
            $scope.myPay.salary.categories = graphObject.categories;
            compensationService.toggleGraphVisible($scope.myPay, 'salary', true);
        };
        var getSalaryDetails = function() {
            compensationService.toggleGraphVisible($scope.myPay, 'salary', false);
            $scope.myPay.salary.details = [];
            serverUtilityService.getWebService(salaryService.getUrl('salary'))
                .then(function(data) {
                    $scope.myPay.salary.details = data.data;
                    angular.copy($scope.myPay.salary.details, $scope.myPay.salary.cpdetails);
                    buildGraphData(data.data);
                });
        };
        if ($scope.section.dashboard.compensation) {
            getSalaryDetails();
        }                
        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };
        $scope.changeYear = function() {
            compensationService.toggleGraphVisible($scope.myPay, 'salary', false);
            buildGraphData($scope.myPay.salary.cpdetails);
        };
        $scope.toggleCTCBreakup =function(item) {
            $scope.myPay.salary.ctcBreakup = item.ctc_breakup;
            toggleModal('ctc-breakup', true);
        };
        var toggleModal = function(id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false, 
                    show: true
                }) 
                : $('#' + id).modal('hide');
        };
        /************* End Account Detail Section *************/

        /************* Start Salary Slip Section *************/        
        var syncSlipModel = function(model) {
            $scope.myPay.slip = salaryService.buildSlipObject(model);
        };
        var getSlipDetails = function() {
            serverUtilityService.getWebService(salaryService.getUrl('slip'))
                .then(function(data) {
                    syncSlipModel(data.data);
                });
        };        
        if ($scope.section.dashboard.compensation) {
            getSlipDetails();
        }        
        $scope.viewDownloadFile = function(action) {
//            if ($scope.myPay.slip.type == 3 && $scope.myPay.slip.year == 2019 
//                && ($scope.myPay.slip.month == 4 || $scope.myPay.slip.month == 5)) {
//                var filename = $scope.myPay.slip.month == 4 
//                    ? 'myhr-reimbursement-slip-4-2019.pdf'
//                    : 'myhr-reimbursement-slip-5-2019.pdf';
//
//                var link = document.createElement("a");
//                link.target ="_blank";
//                link.download = filename;
//                link.href = "images/" + filename;
//                link.click();
//            } else {
//                var target = action == 'download' ? '_blank' : '';  
                $scope.viewDownloadFileUsingForm(getAPIPath() + "employee/slips/" + $scope.myPay.slip.year 
                    + "/" + $scope.myPay.slip.month + "/" + $scope.myPay.slip.type 
                    + "/" + action);
//            }            
        };
        $scope.changeSlipYear = function() {
            $scope.myPay.slip.month = null;
        };
        var getSlipStatus = function() {
            var url = salaryService.getUrl('slipStatus') 
                + "/" + $scope.myPay.slip.year + "/" + $scope.myPay.slip.month 
                + "/" + $scope.myPay.slip.type;
            
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.myPay.slip.enable = utilityService.getValue(data, 'status') == 'success';
                    $scope.myPay.slip.message = utilityService.getValue(data, 'message');
                });
        };
        $scope.changeSlipMonth = function() {
            if ($scope.myPay.slip.type == 3 && $scope.myPay.slip.year == 2019 
                && ($scope.myPay.slip.month == 4 || $scope.myPay.slip.month == 5)) {
                $scope.myPay.slip.enable = true;
                $scope.myPay.slip.message = null;
            } else {
                getSlipStatus();
            }            
        };
        $scope.changeSlipTypeHandler = function (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.myPay.slip.year = null;
            $scope.myPay.slip.month = null;
            $scope.myPay.slip.message = null;
            $scope.myPay.slip.enable = false;
        };
        $scope.changeSlipTypeHandler = function (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.myPay.slip.year = null;
            $scope.myPay.slip.month = null;
            $scope.myPay.slip.message = null;
            $scope.myPay.slip.enable = false;
        };
        /************* End Salary Slip Section *************/

        /************* Start Benefit Management Section *************/        
        var buildSpecificApproverList = function(object) {
            object.approverChain.push({
                approver_chain: object.approver_chain.length ? object.approver_chain : [],
                status: object.status
            });

            timeOffService.buildRequestList(object.approverChain);            
        };
        var buildApproverList = function() {
            // Build approver list for PF Opt-out
            buildSpecificApproverList($scope.myPay.benefit.optout);
            
            // Build approver list for voluntary PF
            buildSpecificApproverList($scope.myPay.benefit.vpf);

            // Build approver list for flexi pay
            buildSpecificApproverList($scope.myPay.benefit.flexi);
        };
        var isFlexiComponentDisabled = function () {
            return !$scope.isFlexiWindowOn() || !$scope.myPay.benefit.flexi.can_edit_existing;
        };
        var syncBenefitModel = function(model) {
            $scope.myPay.tax_regime = utilityService.getValue(model, 'tax_regime'),
            $scope.myPay.benefit = salaryService.buildBenefitObject(model);
            buildApproverList();
            $scope.myPay.benefit.flexi.isDisabled = isFlexiComponentDisabled();
        };
        var getBenefitDetails = function() {
            serverUtilityService.getWebService(salaryService.getUrl('benefitsOptions'))
                .then(function(data) {
                    syncBenefitModel(data.data);                                                           
                });
        };
        if ($scope.section.dashboard.compensation) {
            getBenefitDetails();
        }
        $scope.previewBreakup = function() {
            serverUtilityService.getWebService(salaryService.getUrl('preview'))
                .then(function(data) {
                    $scope.myPay.benefit.breakup = utilityService.getInnerValue(data, 'data', 'breakup', [])
                    toggleModal('preview-ctc-breakup', true);
                });
        };
        var getBenefitsTotal = function() {
            var object = {
                totalSum: 0
            };

            angular.forEach($scope.myPay.benefit.flexi.list, function(value, key) {
                object.totalSum += (isNaN(value.amount) || value.amount === null || !value.amount) 
                    ? 0 : parseInt(value.amount, 10);
            });

            return object;
        };
        $scope.isBenefitAmountExceeded = function() {            
            if(angular.isUndefined($scope.myPay.benefit) || !$scope.myPay.benefit) {
                return false;
            }

            var object = getBenefitsTotal();
            $scope.myPay.benefit.flexi.totalSum = object.totalSum;
            return ($scope.myPay.benefit.flexi.totalSum > $scope.myPay.benefit.flexi.totalMax);
        };
        $scope.resetAPIError = function(status, message, api) {
            return utilityService.resetAPIError(status, message, api);
        };
        var successErrorCallback = function (data, section) {
            if (data.status === "success") {
                if(section === "claims") {
                    getClaimList();
                    $scope.myPay.claim.isRaiseNext ? $scope.addEditClaim() : $scope.closeModal('addEditClaim');                   
                } else if(section === 'pf'  || section === 'vpf' || section === 'benefits') {
                    getBenefitDetails();
                }
                utilityService.showSimpleToast(data.message);
                $scope.resetAPIError(false, null, section);
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
        var resetErrorStatus = function () {
            $scope.errorMessages = [];
            $scope.apiError.pf.status = false;
            $scope.apiError.vpf.status = false;
            $scope.apiError.esi.status = false;
            $scope.apiError.benefits.status = false;            
        }; 
        $scope.updatePF = function() {
            resetErrorStatus();
            var url = salaryService.getUrl('benefits') + "/" + utilityService.getInnerValue($scope.myPay.benefit, 'constant', 'pf', 1),
                payload = salaryService.buildPFPayload($scope.myPay.benefit);

            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, 'pf');
                });          
        };
        $scope.updateVPF = function() {
            resetErrorStatus();
            var url = salaryService.getUrl('benefits') + "/" + utilityService.getInnerValue($scope.myPay.benefit, 'constant', 'vpf', 2),
                payload = salaryService.buildVPFPayload($scope.myPay.benefit);

            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, 'vpf');
                });          
        };
        $scope.updateESI = function() {
            resetErrorStatus();
            var url = salaryService.getUrl('benefits') + "/" + utilityService.getInnerValue($scope.myPay.benefit, 'constant', 'esi', 3),
                payload = salaryService.buildESIPayload($scope.myPay.benefit);

            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, 'esi');
                });          
        };
        $scope.updateFlexiComponent = function() {
            if (utilityService.getInnerValue($scope.myPay.benefit, 'flexi', 'isDisabled')) {
                console.log("It seems that this section is disabled.");
                return false;
            }

            resetErrorStatus();
            var url = salaryService.getUrl('benefits') + "/" + utilityService.getInnerValue($scope.myPay.benefit, 'constant', 'flexi', 4),
                payload = salaryService.buildFlexiComponentPayload($scope.myPay.benefit);

            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, 'benefits');
                });          
        };
        $scope.amountFocusOut = function(item) {
            if(item.amount) {
                if(item.amount < item.min_amount) {
                    item.amount = item.min_amount;
                }
                if(item.amount > item.max_amount) {
                    item.amount = item.max_amount;
                }
            }
        };
        $scope.isFlexiWindowOn = function() {
            if(!utilityService.getInnerValue($scope.myPay.benefit, 'flexi', 'lastDate')){
               return false; 
            }
            var lastDate = utilityService.changeDateFormat($scope.myPay.benefit.flexi.lastDate),
                lastTime = new Date(lastDate + " 23:59:00").getTime();
                currentTime = new Date().getTime();

            return lastTime >= currentTime;
        };
        $scope.isMandatoryComponentFilled = function() {
            if (!utilityService.getValue($scope.myPay, 'benefit')) {
                return false;
            }

            var filledCount = 0;

            angular.forEach(utilityService.getInnerValue($scope.myPay.benefit, 'flexi', 'list'), function(value, key) {
                if(value.amount && value.amount != "null" && value.amount > 0) {
                    filledCount++;
                }                
            });

            return filledCount >= $scope.myPay.benefit.flexi.mandatoryComponents || !$scope.myPay.benefit.flexi.mandatoryComponents;
        };
        $scope.isAllFlexiFormFilled = function() {
            var allFilled = true;
            angular.forEach(utilityService.getInnerValue($scope.myPay.benefit, 'flexi', 'list'), function(value, key) {
                if(value.amount && value.flexi_form_id && !value.is_flexi_form_submitted) {
                    allFilled = false;
                }
            });
            return allFilled;
        };
        $scope.isVPFContributionValid = function () {
            var isEmpVpfContribution = utilityService.getInnerValue($scope.myPay.benefit, 'pf', 'isVPFContributeEmp', false);

            if (!isEmpVpfContribution) {
                return true;
            }
                        
            var employeeVpfContribution = utilityService.getInnerValue($scope.myPay.benefit, 'pf', 'vpfContributionEmp', 0),
                maxVpfContribution = utilityService.getInnerValue($scope.myPay.benefit, 'pf', 'vpfContribution', 0);
            
            isValid = parseInt(employeeVpfContribution, 10) > 0 
                && parseInt(employeeVpfContribution, 10) <= parseInt(maxVpfContribution, 10);
            
            return isValid;
        };
        $scope.viewRejectedComment = function (comment, section) {
            section = section || 'benefit';            
            $scope.myPay[section].comment.text = comment;
            $scope.openModal('rejected-comment.html', 'comment', 'sm');
        };
        $scope.renderAvailableAmount = function () {
            if (!utilityService.getInnerValue($scope.myPay.benefit, 'flexi', 'totalMax')) {
                return '';
            }

            var availableAmt = utilityService.getInnerValue($scope.myPay.benefit, 'flexi', 'totalMax', 0) - utilityService.getInnerValue($scope.myPay.benefit, 'flexi', 'totalSum', 0),        
                availableAmtString = availableAmt.toString();

            return (availableAmtString.indexOf('.') >= 0) ? availableAmt.toFixed(2) : availableAmt;
        };
        $scope.viewBillDetails = function (details) {
            $scope.myPay.claim.billDetails = details;
            $scope.openModal('bill-details.tmpl.html', 'comment', 'sm');         
        };
        /************* End Benefit Management Section *************/

        /************* Start Claim Section *************/
        var sycnClaimModel = function(data, model){
            $scope.myPay.claim.model = salaryService.buildClaimModel(data, model);
        };
        var getClaimList = function() {
            $scope.myPay.claim.list = [];
            $scope.myPay.claim.visible = false;
            serverUtilityService.getWebService(salaryService.getUrl('claim'))
                .then(function(data) {
                    // Here we are passing second argument as true, because while traversing we want to set some additional keys
                    $scope.myPay.claim.list = timeOffService.buildRequestList(utilityService.getValue(data, 'data', []), true);
                    $scope.myPay.claim.visible = true;
                });
        };
        var claimSettingCallback = function (data) {
            if (utilityService.getValue(data, 'status') === 'success') {
                var fromDay = utilityService.getInnerValue(data, 'data', 'claim_day_from'),
                    toDay = utilityService.getInnerValue(data, 'data', 'claim_day_to');

                $scope.myPay.claim.timeline.fromDay = isNaN(fromDay) || !fromDay ? 1 : parseInt(fromDay, 10);
                $scope.myPay.claim.timeline.toDay = isNaN(toDay) || !toDay ? 31 : parseInt(toDay, 10);
                $scope.myPay.claim.timeline.fromDayString = isNaN(fromDay) || !fromDay ? 1 : parseInt(fromDay, 10);
                $scope.myPay.claim.timeline.toDayString = isNaN(toDay) || !toDay ? 'Last Day of Month' : parseInt(toDay, 10);
                $scope.myPay.claim.timeline.isOpen = salaryService.isClaimWindowOpen($scope.myPay.claim.timeline);                
            } else {
                $scope.myPay.claim.timeline.error.status = true;
                $scope.myPay.claim.timeline.error.message = utilityService.getValue(data, 'message');
            }
            $scope.myPay.claim.timeline.visible = true;
            getClaimList();
        };
        var getClaimSetting = function() {
            serverUtilityService.getWebService(salaryService.getUrl('claimSetting'))
                .then(function(data) {                    
                    claimSettingCallback(data);
                });
        };
        getClaimSetting();        
        $scope.addEditClaim = function() {
            if ($scope.myPay.selectedClaimType == 101) {
                $scope.errorMessages = [];
                $scope.myPay.claim.error.status = false;
                $scope.myPay.claim.proofs = [];
                utilityService.resetForm($scope.frmClaim);
                $q.all([
                    serverUtilityService.getWebService(salaryService.getUrl('claimApprover')),
                    serverUtilityService.getWebService(salaryService.getUrl('expenses'))
                ]).then(function (data) {
                    sycnClaimModel(data[0].data);
                    $scope.myPay.claim.expenses = data[1].data;
                    if (!$scope.myPay.claim.isRaiseNext) {
                        $scope.openModal('new-claim.tmpl.html', 'addEditClaim');
                    }                    
                });
            } else {
                var searchObj = {
                    requestFor: utilityService.getStorageValue('loginEmpId'),
                    requestedCategory: $scope.myPay.selectedClaimType
                };
                $location.url('/dashboard/new-expense').search(searchObj)
            }
            $scope.eligible.amountDetails = null;
            $scope.eligible.yearlyBalance = null;
        };        
        $scope.checkFileSize = function(file) {
            $scope.myPay.claim.model.fileError = null;
            if(!file){
                return;
            }
            var is_valid_file = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
            if(is_valid_file){
                $scope.myPay.claim.model.fileError = "File size must be less than or equal to " + $scope.allowedFileSizeGlobal.text;;
            } else {
                $scope.myPay.claim.model.fileError = null;
                $scope.myPay.claim.model.isUploaded = true;
                $scope.myPay.claim.model.proof = file;
            }
        };        
        $scope.bindFileChangeEvent = function () {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    //$scope.myPay.claim.model.isUploaded = true;
                });
            }, 100);
        };
        var setClaimErrors = function(flag, message) {
            flag = angular.isDefined(flag) ? flag : false;
            message = angular.isDefined(message) ? message : null;
            $scope.myPay.claim.error.status = flag;
            $scope.myPay.claim.error.message = message;
        };        
        $scope.saveClaim = function(isRaiseNext) {
            $scope.myPay.claim.isRaiseNext = isRaiseNext;
//            if ($scope.eligible.enabled) {
//                var unclaimedAmount = salaryService.getRecentUnClaimedAmount($scope.eligible.amountDetails);
//                setClaimErrors();
//                if (!unclaimedAmount) {
//                    setClaimErrors(true, 'You are not allowed to claim for this category');
//                    return false;
//                } else if ($scope.myPay.claim.model.claim_amount > unclaimedAmount) {
//                    setClaimErrors(true, 'You can not claim amount more than ' + unclaimedAmount);
//                    return false;
//                }
//            }
            $scope.formSubmitHandler('claim', true);
            $scope.errorMessages = [];
            var url = salaryService.getUrl('claim'),
                payload = salaryService.buildClaimPayload($scope.myPay.claim);
            
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    $scope.formSubmitHandler('claim', false);
                    successErrorCallback(data, "claims");
                });
        };
        var deleteClaimCallback = function (data, item, event) {
            if (utilityService.getValue(data, 'status') === 'success') {
                $scope.myPay.claim.list = utilityService.deleteCallback(data, item, $scope.myPay.claim.list);
            } else {
                $scope.showAlert(event, 'Delete Claim', utilityService.getValue(data, 'message'));
            }
        };
        $scope.deleteClaim = function(item, event) {
            var url = salaryService.getUrl('claim') + "/" + item._id;
            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    deleteClaimCallback(data, item, event);                        
                });
        };
        $scope.removeDocument = function(){
            $scope.myPay.claim.model.isUploaded = false;
            $scope.myPay.claim.model.proof = null;
        };
        $scope.viewClaimDocument = function(claim, proof) {
            var url = salaryService.getUrl('claimProof') + "/" + claim._id + "/" + proof.slug;
            $scope.viewDownloadFileUsingForm(url);
        };
        var resetFilledClaimDetails = function (form) {
            $scope.myPay.claim.model.bill_date = $scope.isAllowedDomains() ? new Date() : null;
            $scope.myPay.claim.model.bill_no = null;
            $scope.myPay.claim.model.bill_amount = null;
            $scope.myPay.claim.model.claim_amount = null;
            $scope.myPay.claim.model.bill_detail = null;
            $scope.myPay.claim.proofs = [];
            $scope.eligible.amountDetails = null;
            $scope.eligible.yearlyBalance = null;
            utilityService.resetForm(form);
        };
        $scope.getClaimAmountBasedOnCategory = function(form) {
            resetFilledClaimDetails(form);            
            var url = salaryService.getUrl('claimAmount'); // + "/" + $scope.myPay.claim.model.expense_category;
            var payload = {claim_category: $scope.myPay.claim.model.expense_category};

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    $scope.eligible.amountDetails = utilityService.getInnerValue(data, 'data', 'details');
                    $scope.eligible.yearlyBalance = utilityService.getInnerValue(data, 'data', 'yearly_balance');
                    $scope.myPay.claim.proofs = utilityService.getInnerValue($scope.myPay.claim.expenses, $scope.myPay.claim.model.expense_category, 'claim_proofs', []);
                });
        };
        $scope.clearFileUpload = function(item) {
            item.isUploaded = false;
            item.proof = [];
        };
        $scope.setFileObject = function(file, item) {
            item.fileError = null;

            if (!file) {
                return;
            }
            var is_valid_file = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);

            if (is_valid_file) {
                item.fileError = "Each file size must be less than or equal to " + $scope.allowedFileSizeGlobal.text;
            } else {
                item.fileError = null;
                item.isUploaded = true;
                item.proof = file;
            }
        };
        $scope.isClaimProofAttached = function () {
            var proofs = utilityService.getInnerValue($scope.myPay, 'claim', 'proofs', []),
                isAttached = true;

            if (proofs.length) {
                angular.forEach(proofs, function (item, key) {
                    if (utilityService.getValue(item, 'is_required')) {
                        isAttached = isAttached && (utilityService.getValue(item, 'isUploaded', false) 
                            && utilityService.getValue(item, 'fileError', false) == false);
                    } else {
                        isAttached = isAttached && true;
                    }                    
                });
            }

            return isAttached;
        };
        $scope.exportToCsv = function() {
            var csvData = salaryService.buildCsvData($scope.myPay.claim.filteredList, $scope.approvalStatus);
            $timeout(function () {
                utilityService.exportToCsv(csvData.content, 'claim-list.csv');
            }, 1000);
        };
        $scope.changeClaimAmountHandler = function () {
            var billAmount = utilityService.getInnerValue($scope.myPay.claim, 'model', 'bill_amount', 0),
                claimAmount = utilityService.getInnerValue($scope.myPay.claim, 'model', 'claim_amount', 0);
              
            if (claimAmount > billAmount) {
                setClaimErrors(true, 'You can not claim amount more than bill amount which is ' + billAmount);
            } else {
                setClaimErrors(false, null);
            }                
        };
        $scope.renderDaySuffix = function (day) {
            return isNaN(day) ? '' : utilityService.getDayOfMonthSuffix(day);
        };
        $scope.viewEligibility = function (item) {
            var url = salaryService.getUrl('eligibility') + "/" + item._id;

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.eligible.amountDetails = data.data;
                    $scope.openModal('claim-eligibility.tmpl.html', 'eligibility');
                });            
        };
        $scope.viewReason = function (reason) {
            $scope.myPay.claim.reason = reason;
            $scope.openModal('view-reason.tmpl.html', 'reason', 'sm');         
        };
        /************* End Claim Section *************/

        var toggleModal = function(id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false, 
                    show: true
                }) 
                : $('#' + id).modal('hide');
        };
        $scope.clickOutSideClose = function() {
            $("._md-select-menu-container").hide();
        };
        $scope.isSalarySlipMonthVisible = function(index, year, monthStartDay) {
            var isVisible = false,
                currYear = utilityService.getCurrentYear(),
                currMonth = utilityService.getCurrentMonth(),
                currDay = utilityService.getCurrentDay();

            monthStartDay = monthStartDay || utilityService.payrollProcessingDay;
            year = year || $scope.myPay.slip.year;

            if(year >= currYear) {
                if (index < currMonth 
                    || (index == currMonth && currDay >= monthStartDay)) {
                    isVisible = true;
                }            
            } else {
                if(year == utilityService.startYear) {
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
        $scope.isClaimMonthVisible = function(index) {
            return $scope.isSalarySlipMonthVisible(index, $scope.myPay.claim.year, 1);
        };
        $scope.isClaimYearVisible = function(item) {
            return $scope.isSalarySlipYearVisible(item);
        };
        $scope.changeClaimYearHandler = function () {
            $scope.myPay.claim.month = '';
        };
        $scope.isClaimSummaryMonthVisible = function(index) {
            return $scope.isSalarySlipMonthVisible(index, $scope.myPay.claim.summary.year, 1);
        };
        $scope.changeClaimSummaryYearHandler = function () {
            $scope.myPay.claim.summary.month = '';
        };
            
        /***** Expense Category List *****/
        $scope.myPay.expenseCatList = [{id: $scope.salaryClaimId, value: "Salary Claim"}];
        var getExpenseCategoryCallback = function(data) {
            angular.forEach(data.data, function(value, key) {
                $scope.myPay.expenseCatList.push(value);
            });            
        };
        var getExpenseCategory = function () {
            serverUtilityService.getWebService(salaryService.getUrl('allExpense'))
                .then(function (data) {
                    if(data.data.length) {
                        getExpenseCategoryCallback(data);
                    }
                });
        };
        if($scope.empViewTravelExpense()) {
            getExpenseCategory();
        }

        /***** Start Angular Modal Section *****/
        $scope.openModal = function(templateUrl, instance, size) {
            size = size || 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass : 'fadeEffect',
                size: size,
                backdrop: 'static'
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        /***** End Angular Modal Section *****/
        
        /***** Start: Flexi Pay form section *****/
        $scope.flexiPayForm = {
            mode: null, //'view', 'edit', 'create'
            selectedComponent: null,
            form : salaryService.buildFormObject(),
            visible: false
        };

        $scope.openFlexiForm = function(benefitItem, mode, request_id) {
            if(benefitItem.isFormModalOpened) { return false; }
            benefitItem.isFormModalOpened = true;
            $scope.flexiPayForm.mode = mode = mode || 'create';
            $scope.flexiPayForm.selectedComponent = benefitItem;
            $scope.errorMessages = [];
            var url = salaryService.getUrl('getFlexiForm'),
                payload = {
                    form_id: utilityService.getValue(benefitItem, 'flexi_form_id'),
                    employee_id: $scope.user.loginEmpId,
                    component_slug: utilityService.getValue(benefitItem, 'slug')
                };
                if(mode == 'view' && request_id) {
                    payload.request_id = request_id;
                }

            serverUtilityService.putWebService(url, payload)
                .then(function(data){
                    $scope.flexiPayForm.form = salaryService.buildFormObject(utilityService.getValue(data.data,'form_detail'));
                    $scope.openModal('flexi-pay-form-question-tmpl.html', 'flexiPayFormQuestion', 'lg');
                    benefitItem.isFormModalOpened = false;
                });
        };

        $scope.setFileObject = function(file, item){
            item.fileError = null;
            if(!file) {
                return;
            }

            var is_valid_file = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
            
            if(is_valid_file){
                item.fileError = "Each file size must be less than or equal to " + $scope.allowedFileSizeGlobal.text;
                return ;
            }else{
                item.fileError = null;
            }
            item.isUploaded = true;
            item.proof = file;
        };
        $scope.removeUpload = function(item){
            item.isUploaded = false;
            item.answer = null;
        };
        $scope.downloadAnswerAttachment = function(item) {
            var url = salaryService.getUrl('downloadAnswerAttachment')
                + "/" + item._id
                + "/" + $scope.user.loginEmpId;

            $scope.viewDownloadFileUsingForm(url);
        };

        $scope.saveFlexiForm = function() {
            var url = salaryService.getUrl('fillFlexiForm') + '/' + utilityService.getValue($scope.flexiPayForm.selectedComponent, 'flexi_form_id'),
                payload = {
                    component_name: utilityService.getValue($scope.flexiPayForm.selectedComponent, 'component_name'),
                    component_slug: utilityService.getValue($scope.flexiPayForm.selectedComponent, 'slug')
                };
            payload = salaryService.addQuestionsInPayload(payload, utilityService.getValue($scope.flexiPayForm.form, 'questions', []));
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    if(data.status == 'success') {
                        $scope.flexiPayForm.selectedComponent.is_flexi_form_submitted = true;
                        $scope.closeModal('flexiPayFormQuestion');
                        utilityService.showSimpleToast(data.message);
                        $scope.flexiPayForm.form = salaryService.buildFormObject();
                        $scope.flexiPayForm.selectedComponent = null;
                    } else {
                        $scope.errorMessages = [];
                        angular.forEach(utilityService.getInnerValue(data, 'data', 'message'), function(val, key) {
                            angular.forEach(val, function(v, k) {
                                $scope.errorMessages.push(v);
                            });
                        });
                    }
                });
        };
        /***** End Angular Modal Section *****/        
        
        var showConfirmDialog = function(ev, functionName, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to proceed with this?')
                .textContent('Please double check every thing before taking this action.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('No, want to cancel');

            $mdDialog.show(confirm).then(function() {
                functionName(item, ev);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function(event, functionName, item) {
            showConfirmDialog(event, functionName, item);
        };

        /****** Start: Claim Summary Section ******/
        var resetClaimSummaryObject = function (tabname) {
            tabname = tabname || 'summary';
            $scope.myPay.claim.summary = salaryService.buildClaimSummaryObject();
            if (tabname === 'summary-monthwise') {
                $scope.myPay.claim.summary.propertyName = '';
                $scope.myPay.claim.summary.reverse = false;
            }
        };
        $scope.getClaimSummary = function () {            
            var financialYear = utilityService.getCurrentFinancialYear(),
                url = salaryService.getUrl('claimSummary') + "/" + financialYear.start + "/" + financialYear.end;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.myPay.claim.summary.list = utilityService.getValue(data, 'data', []);
                    $scope.myPay.claim.summary.visible = [];
                });
        };
        $scope.exportClaimSummary = function() {
            var csvData = salaryService.buildClaimSummaryCsvData($scope.myPay.claim.summary.filteredList, $scope.myPay.claim.tabname);
            $timeout(function () {
                utilityService.exportToCsv(csvData.content, 'claim-summary.csv');
            }, 1000);
        };
        $scope.getClaimSummaryMonthWise = function () {
            var financialYear = utilityService.getCurrentFinancialYear(),
                url = salaryService.getUrl('claimSummaryMonthwise') + "/" + financialYear.start + "/" + financialYear.end;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.myPay.claim.summary.list = utilityService.getValue(data, 'data', []);
                    $scope.myPay.claim.summary.visible = [];
                });
        };
        $scope.changeClaimTabHandler = function (tabname) {
            resetClaimSummaryObject(tabname);
            $scope.myPay.claim.tabname = tabname;
            tabname === 'summary-monthwise' ? $scope.getClaimSummaryMonthWise() : $scope.getClaimSummary();
        };
        /****** End: Claim Summary Section ******/

        /***** End Angular Modal Section *****/
        $scope.updatePaginationSettings('payroll_emp_claim');
        $scope.updatePaginationSettings('payroll_emp_claim_summary');
        $scope.updatePaginationSettings('payroll_emp_claim_summary_monthwise');        
        
        $scope.isAllowedDomains = function () {
            return $scope.allowedDomains.indexOf($scope.envMnt) >= 0;
        }; 
    }

]);