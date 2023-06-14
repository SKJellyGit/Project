app.controller('TaxController', [
    '$scope', '$q', '$timeout', '$modal', '$mdDialog', 'utilityService', 'ServerUtilityService', 'TaxService', 'TimeOffService',
    function ($scope, $q, $timeout, $modal, $mdDialog, utilityService, serverUtilityService, taxService, timeOffService) {
        var self = this;
        $scope.manageTaxStatus = taxService.buildManageTaxStatusObject();
        $scope.relations = taxService.buildRelationList();
        $scope.allowanceBillList = [];
        $scope.showPanDetails = false;
        $scope.showDeclaration = false;
        $scope.investmentObject = {};

        $scope.viewInvestment = {
            id: null,
            title: null
        };
        $scope.isUploaded = {
            rent_receipt: false,
            pan_card: false
        };
        $scope.file = {
            object: null
        };
        $scope.taxComputation = taxService.buildTaxComputationObject();
        $scope.monthList = utilityService.buildMonthList();
        $scope.taxSlip = {
            enable: false,
            message: null
        };
        $scope.statusMapping = {
            1: {
                title: 'Pending',
                color: 'orange'
            },
            2: {
                title: 'Approved',
                color: 'green'
            },
            3: {
                title: 'Rejected',
                color: 'red'
            }
        };
        $scope.hraDetails = {};
        $scope.landlord = {
            list: [],
            selected: {},
            viewDetails: {},
            detailsObject: {},
            viewType: 'add',
            rentDetailList: []
        };
        $scope.apiResponse = {
            claim: [],
            masterList: []
        };

        $scope.inputDisabledId = {
            59: false,
            33: false
        }

        $scope.taxRegime ={}      

        $scope.taxRegimeComparison = {
            full_name: localStorage.getItem('fullname'),
            withInvestment : null,
            withOutInvestment :  null,
            annual_rent: 0,
            is_metro: false,
            show_total: false
        }
        $scope.taxRegimeEditable = false;
                
        /********** START INVESTMENT DECLARATION SECTION ***********/
        var synGuideLineModel = function (model, initialLoading) {
            var year = initialLoading ? null : $scope.guideLine.year,
                yearList = initialLoading ? [] : $scope.guideLine.yearList;

            $scope.guideLine = taxService.buildGuideLineObject(model, year, yearList);
            $scope.setForceHideDisable($scope.guideLine.year);
        };
        var getInvestmentGuideLines = function (initialLoading) {
            initialLoading = angular.isDefined(initialLoading) ? initialLoading : false;
            serverUtilityService.getWebService(taxService.getUrl('guideline'))
                .then(function (data) {
                    synGuideLineModel(data.data, initialLoading);
                    getInvestmentDetails();
                    $scope.getTaxRegime();
                });
        };
        getInvestmentGuideLines(true);
        var synTaxComputationModel = function (model) {
            $scope.taxComputation.totalIncome = utilityService.getValue(model, 'total_income', []);
            $scope.taxComputation.finalComputation = utilityService.getValue(model, 'final_computation', []);
            $scope.taxComputation.monthlyTaxLiability = utilityService.getValue(model, 'monthy_tax_liability', []);
            $scope.taxComputation.taxableAmount = utilityService.getValue(model, 'taxable_amount', 0);
        };
        var getTaxComputationData = function () {
            serverUtilityService.getWebService(taxService.getUrl('taxComputation'))
                .then(function (data) {
                    synTaxComputationModel(data.data);
                });
        };
        getTaxComputationData();
        var getInvestmentDetails = function(isSaveAndNext) {
            var claimUrl = taxService.getUrl('claimtax') + "/" + $scope.guideLine.year + "/" + ($scope.guideLine.year + 1);
            $q.all([
                serverUtilityService.getWebService(taxService.getUrl('taxMaster')),
                serverUtilityService.getWebService(claimUrl)
            ]).then(function(data) {
                $scope.apiResponse.masterList = utilityService.getValue(data[0], 'data', []);
                $scope.apiResponse.claim = utilityService.getValue(data[1], 'data', []);
                $scope.investmentObject = taxService.buildInvestmentObject(data[1].data);
                syncInputDisabled($scope.investmentObject);
                $scope.taxMasterList = taxService.buildTaxMasterList(data[0].data, $scope.investmentObject);
                angular.copy(taxService.hraDetails, $scope.hraDetails);
                if (isSaveAndNext) {
                    $scope.closeModal('hra');
                    $scope.addEditReceipt(taxService.getUpdatedDetailObject($scope.taxMasterList), null, isSaveAndNext);
                }
                $scope.isloadingState = false;

            });

        };
        $scope.changeFinancialYear = function () {
            $scope.isloadingState = true;
            getInvestmentGuideLines();

        };

        /******* Start Method used for individual *******/
        $scope.changeAmountDeclared = function (item) {
            var declaredAmount = utilityService.convertIntoInteger(item.amount_declared),
                maxAmount = utilityService.convertIntoInteger(item.limit);

            if (declaredAmount > maxAmount) {
                item.amount_declared = item.limit;
            }
        };
        $scope.changeAmountClaimed = function (item) {
            var declaredAmount = utilityService.convertIntoInteger(item.amount_declared),
                claimedAmount = utilityService.convertIntoInteger(item.amount_claimed),
                maxAmount = utilityService.convertIntoInteger(item.limit);

            if (claimedAmount > maxAmount || claimedAmount > declaredAmount) {
                item.amount_claimed = item.amount_declared;
            }
        };
        /******* End Method used for individual *******/

        /******* Start Method used for section like chapter VI-A *******/
        $scope.changeSectionAmount = function (item, details, keyname) {
            var amount = utilityService.convertIntoInteger(item[keyname]),
                maxLimit = utilityService.convertIntoInteger(item.limit),
                sum = 0;

            item[keyname] = amount;
            angular.forEach(details, function (value, key) {
                if (angular.isNumber(value[keyname])) {
                    sum = sum + utilityService.convertIntoInteger(value[keyname]);
                }
            });

            sum = sum - amount;

            if ((sum + amount) > maxLimit) {
                var diff = (sum + amount) - maxLimit;
                item[keyname] = item[keyname] - diff;
            }
        };
        $scope.syncClaimWithDeclaration = function (item) {
            if ($scope.envMnt === 'autoninja') {
                item.amount_declared = item.amount_claimed;
            }
        };
        $scope.assignDeclaredAsClaimed = function (item) {
            if (!item.amount_declared && $scope.envMnt !== 'autoninja') {
                item.amount_declared = item.amount_claimed;
            }
        };
        /******* End Method used for section like chapter VI-A *******/

        $scope.submitDeclarations = function (item) {
            $scope.errorMessages = [];
            var url = taxService.getUrl('claimtax'),
                payload = taxService.buildInvestmentPayload(item.details);

            if (!payload.tax_details.length) {
                console.log("Do Nothing");
                return false;
            }
            serverUtilityService.uploadWebService(url, payload.tax_details)
                .then(function (data) {
                    successErrorCallback(data, "investmentDeclaration");
                });
        };
        $scope.calculateTotalInvestment = function (detail) {
            var sum = 0;
            angular.forEach(detail, function (value, key) {
                angular.forEach(value.details, function (v, k) {
                    if (v.amount_declared) {
                        sum = sum + parseInt(v.amount_declared, 10);
                    }
                });
            });
            return sum;
        };
        $scope.calculateTotalApprovedAmount = function (detail) {
            var sum = 0;
            angular.forEach(detail, function(value, key) {
                angular.forEach(value.details, function(v, k) {
                    if(utilityService.getValue(v,'amount_approved', 0)) {
                        sum = sum + parseInt(utilityService.getValue(v,'amount_approved', 0), 10);
                    }                    

                });
            });
            return sum;
        };
        $scope.removeUpload = function (item) {
            item.isMultipleUploaded = false;
            item.proof = [];
            item.investment_proofs = [];
            item.remove_proof = true;
        };
        $scope.bindMultipleFileChangeEvent = function (item) {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    //item.isMultipleUploaded = true;
                    //item.fileError = null;
                });
            }, 100);
        };
        $scope.setFileObject = function (files, item) {
            item.fileError = null;
            if (!files.length) {
                return;
            }
            var is_valid_file = files.find(function (file) {
                return utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
            });

            if (is_valid_file) {
                item.fileError = "Each file size must be less than or equal to " + $scope.allowedFileSizeGlobal.text;
                //return;
            } else {
                item.fileError = null;
                item.isMultipleUploaded = true;
                item.proof = files;
            }
        };
        $scope.viewDownloadProof = function (item, proofId, slug, oldHra) {
            if(oldHra){
                $scope.viewDownloadFileUsingForm(getAPIPath() + "employee/investment-proofs/"
                + item.allowance_id + "/" + proofId + "/" + slug + "?from_year=" 
                + parseInt(utilityService.getValue($scope.guideLine, 'year')) 
                + "&to_year=" + (parseInt(utilityService.getValue($scope.guideLine, 'year')) + 1)); 
            }else {
                $scope.viewDownloadFileUsingForm(getAPIPath() + "employee/investment-proofs/"
                    + item.allowance_id + "/" + proofId + "/" + slug);
            }
            
        };
        $scope.isProofSubmissionDisabled = function (details) {
            var isDisabled = false;

            angular.forEach(details, function (item, key) {
                isDisabled = isDisabled || item.fileError;
            });

            return isDisabled;
        };
        /********** END INVESTMENT DECLARATION SECTION ***********/

        /********** START PROOF/BILL SECTION ***********/
        var viewBillDetailCallback = function (data) {
            $scope.allowanceBillList = angular.isDefined(data.data.details)
                ? data.data.details : [];
            $('#medical-bill').modal('show');
        };
        $scope.viewBillDetail = function (item) {
            $scope.viewInvestment.id = item.allowance_id;
            $scope.viewInvestment.title = item.name;

            var url = taxService.getUrl('claimtax') + "/" + item.allowance_id;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    viewBillDetailCallback(data);
                });
        };
        $scope.addBillDetail = function () {
            $scope.allowanceBillList.push(taxService.buildNewBillObject());
        };
        var updateBillDetailsCallback = function (data) {
            if (data.status === "success") {
                $scope.allowanceBillList = data.data;
            } else if (data.status === "error") {
                utilityService.resetAPIError(true, data.message);
            }
        };
        var buildBillPayload = function () {
            var list = [], payload = [];

            angular.copy($scope.allowanceBillList, list);
            angular.forEach(list, function (value, key) {
                if (value.isNew) {
                    value.date = utilityService.dateToString(value.date, '/');
                    payload.push(value);
                }
            });
            return payload;
        };
        $scope.updateBillDetails = function () {
            var url = taxService.getUrl('billDetail') + "/" + $scope.viewInvestment.id,
                payload = buildBillPayload();

            if (!payload.length) {
                return false;
            }

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    updateBillDetailsCallback(data, true);
                });
        };
        $scope.deleteBillDetail = function (item) {
            var url = taxService.getUrl('billDetail') + "/" + $scope.viewInvestment.id + "/" + item._id.$id
            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    $scope.allowanceBillList = utilityService.deleteCallback(data, item, $scope.allowanceBillList);
                });
        };
        $scope.removeBill = function (item, index) {
            var list = [];
            angular.copy($scope.allowanceBillList, list);
            list = list.filter(function (value, key) {
                return key !== index;
            });
            $scope.allowanceBillList = list;
        };
        /********** END PROOF/BILL SECTION ***********/

        /********** START RENT DETAIL SECTION ***********/
        $scope.getDeclaration = function (val) {
            $scope.showDeclaration = (val == 2) ? true : false;
        };
        var syncRentDetailModel = function (model) {
            $scope.rentDetail = taxService.syncRentDetailModel(model, $scope.guideLine);
        };
        var syncAddRentReceipt = function (detail) {
            var model = {
                sec_no: detail.sec_no,
                title: detail.sec_name,
                tax_id: detail.details[0].id
            };
            model.list = detail.details[0].rent_detail;

            return model;
        };
        var syncEditRentReceipt = function (detail, item) {
            item.sec_no = detail.sec_no;
            item.title = detail.sec_name;
            item.tax_id = detail.details[0].id;
            item.list = detail.details[0].rent_detail;
        };
        $scope.tempObject = {
            detail: {}
        };
        $scope.addEditReceipt = function (detail, item, isSaveAndNext) {
            isSaveAndNext = angular.isDefined(isSaveAndNext) ? isSaveAndNext : false;
            $scope.errorMessages = [];
            $scope.isUploaded = {
                rent_receipt: false,
                pan_card: false
            };
            angular.copy(detail.details[0].rent_detail, $scope.landlord.rentDetailList);
            var popupView = null;
            if (angular.isDefined(item) && item) {
                popupView = 'edit';
                syncEditRentReceipt(detail, item);
            } else {
                popupView = 'add';
                item = syncAddRentReceipt(detail, null);
            }
            syncRentDetailModel(item);
            $scope.rentDetail.popupView = popupView;

            if (item) {
                $scope.autoSyncToDate();
            }
            if (!utilityService.getValue($scope.rentDetail, '_id')) {
                $scope.clearUpload('rent_receipt');
                $scope.clearUpload('pan_card');
            }
            if (!isSaveAndNext) {
                //$scope.tempObject.detail = detail;
                //angular.copy(detail, $scope.tempObject.detail);                
            }
            $scope.openModal('house-rent-detail.tmpl.html', 'hra', 'lg');
        };
        var saveDetailsSuccessCallback = function(data, list, isSaveAndNext) {                     
            utilityService.showSimpleToast(data.message);
            getInvestmentDetails(isSaveAndNext);
            getLandlordDetails();
            if (!isSaveAndNext) {
                $scope.closeModal('hra');
            }                      
        };
        var saveDetailsErrorCallback = function (data) {
            $scope.resetAPIError(true, "something went wrong", "rentDetail");
            if (utilityService.getInnerValue(data, 'data', 'message')) {
                if (angular.isObject(utilityService.getInnerValue(data, 'data', 'message'))) {
                    angular.forEach(data.data.message, function (value, key) {
                        $scope.errorMessages.push(value[0]);
                    });
                } else {
                    $scope.errorMessages.push(utilityService.getInnerValue(data, 'data', 'message'));
                }
            } else {
                $scope.errorMessages.push(utilityService.getValue(data, 'message'));
            }
        };
        var saveDetailsCallback = function (data, list, isSaveAndNext) {
            utilityService.getValue(data, 'status') === "success" 
                || utilityService.getValue(data, 'status') === true
                    ? saveDetailsSuccessCallback(data, list, isSaveAndNext) 
                    : saveDetailsErrorCallback(data);
        };
        var saveDetails = function(url, payload, list, isSaveAndNext) {            
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    $scope.formSubmitHandler('hraLandlord', false);
                    saveDetailsCallback(data, list, isSaveAndNext);
                });
        };        
        $scope.saveRentDetails = function(rentReceipt, panCard, isSaveAndNext) {
            $scope.formSubmitHandler('hraLandlord', true);
            $scope.errorMessages = [];
            var url = taxService.getUrl('rentDetail') + "/" + $scope.rentDetail.tax_id,
                payload = taxService.buildRentDetailPayload($scope.rentDetail, rentReceipt, panCard);

            if (utilityService.getValue($scope.rentDetail, '_id')) {
                url = url + "/" + utilityService.getValue($scope.rentDetail, '_id');
            }

            saveDetails(url, payload, $scope.rentDetail.list, isSaveAndNext);
        };
        $scope.checkFileSize = function (file, keyName) {
            $scope.rentDetail.fileError[keyName] = null;
            if (!file) {
                return;
            }
            var is_valid_file = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
            if (is_valid_file) {
                $scope.rentDetail.fileError[keyName] = "File size must be less than or equal to " + $scope.allowedFileSizeGlobal.text;;
            } else {
                $scope.rentDetail.fileError[keyName] = null;
                $scope.isUploaded[keyName] = true;
                $scope.rentDetail[keyName] = file;
            }
            $scope.rentDetail['delete_' + keyName] = false;
        };
        $scope.bindFileChangeEvent = function (keyName) {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    $scope.rentDetail.fileError[keyName] = null;
                });
            }, 100);
        };
        $scope.clearUpload = function (keyName, viaAPI) {
            viaAPI = viaAPI || false;
            $scope.isUploaded[keyName] = false;
            $scope.rentDetail[keyName] = null;
            //$scope.rentDetail.proof_name = null;
            if (viaAPI) {
                keyName === 'rent_receipt'
                    ? $scope.rentDetail.proof_name = null
                    : $scope.rentDetail.landlord_proof_name = null;
                $scope.rentDetail['delete_' + keyName] = true;
            }
        };
        $scope.changeOption = function () {
            $scope.clearUpload('rent_receipt');
            $scope.clearUpload('pan_card');
        };
        $scope.onlyFirstDaySelectable = function (date) {
            var d = date.getDate();
            return d === 1;
        };
        $scope.onlyLastDaySelectable = function (date) {
            var d = date.getDate();

            if (timeOffService.is31DaysMonth(date)) {
                return d === 31;
            } else if (timeOffService.is30DaysMonth(date)) {
                return d === 30;
            } else {
                return d === 28 || d === 29;
            }
        };
        $scope.deleteHRADetails = function (detail, item) {
            var url = taxService.getUrl('deleteHRADetails') + "/" + item._id.$id;
            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    taxService.deleteHRADetailsCallback(data, detail, item);
                });
        };
        $scope.viewRentDetails = function (detail, item) {
            angular.copy(item, $scope.landlord.viewDetails);
            angular.copy(detail.details[0], $scope.landlord.detailsObject);
            $scope.openModal('hra-landlord-details.tmpl.html', 'hra', 'lg');
        };
        $scope.viewDownloadLandlordProof = function (investmentId, proofId, slug) {
            $scope.viewDownloadFileUsingForm(getAPIPath() + "employee/investment-proofs/"
                + investmentId + "/" + proofId + "/" + slug);
        };
        $scope.autoSyncToDate = function (isChangeTriggered) {
            isChangeTriggered = isChangeTriggered || false;
            if (utilityService.getValue($scope.rentDetail, 'from_date')) {
                $scope.errorMessages = [];
                var date = $scope.rentDetail.from_date,
                    y = date.getFullYear(),
                    m = date.getMonth();

                if (isChangeTriggered) {
                    $scope.rentDetail.end_date = new Date(y, m + 1, 0);
                }
            }
        };
        var autoFillLandlordDetails = function (item) {
            $scope.rentDetail.delete_rent_receipt = false;
            $scope.rentDetail.delete_pan_card = false;
            $scope.rentDetail.landlord_id = utilityService.getValue(item, '_id');
            $scope.rentDetail.landlord_name = utilityService.getValue(item, 'name');
            $scope.rentDetail.landlord_address = utilityService.getValue(item, 'address');
            $scope.rentDetail.landlord_pan = utilityService.getValue(item, 'pan_no');
            $scope.rentDetail.landlord_pincode = utilityService.getValue(item, 'pincode');
            $scope.rentDetail.landlord_city = utilityService.getValue(item, 'city');
            $scope.rentDetail.landlord_proof_name = utilityService.getValue(item, 'proof_name');
        };
        $scope.toggleLandlordView = function (viewType, selectedId) {
            var item = null;
            $scope.landlord.viewType = viewType;
            if (viewType === 'existing') {
                item = taxService.extractItemFromList($scope.landlord.list, selectedId);
            }
            autoFillLandlordDetails(item);
        };
        var autoFillHraBasicDetails = function (item) {
            $scope.rentDetail.amount = utilityService.getValue(item, 'amount');
            $scope.rentDetail.address = utilityService.getValue(item, 'address');
            $scope.rentDetail.is_metro = utilityService.getValue(item, 'is_metro');
            $scope.rentDetail.pincode = utilityService.getValue(item, 'pincode');
            $scope.rentDetail.city = utilityService.getValue(item, 'city');
            $scope.rentDetail.landlord_id = utilityService.getValue(item, 'landlord_id');
            if (utilityService.getValue($scope.rentDetail, 'landlord_id')) {
                landlordObject = taxService.extractItemFromList($scope.landlord.list, $scope.rentDetail.landlord_id);
            } else {
                landlordObject = null;
            }
            autoFillLandlordDetails(landlordObject);
        };
        $scope.copyDetailsFromExistingChangeHandler = function (selectedId) {
            var item = taxService.extractItemFromList($scope.landlord.rentDetailList, selectedId);
            autoFillHraBasicDetails(item);
        };
        $scope.newDetailsClickHandler = function () {
            $scope.rentDetail.existing_hra_id = null;
            autoFillHraBasicDetails();
        };
        /********** END RENT DETAIL SECTION ***********/

        /********** START OTHER INCOME DETAIL SECTION ***********/
        $scope.submitOtherIncomeDetails = function (details) {
            $scope.errorMessages = [];
            var url = taxService.getUrl('otherIncome'),
                payload = taxService.buildOtherIncomePayload(details);

            if (!payload.length) {
                return false;
            }
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, "otherIncome");
                });
        };
        $scope.isOtherIncomeFormInvalid = function (details) {
            var isDisabled = false;

            angular.forEach(details, function (value, key) {
                value.isRequired = false;
                if (value.applicable && !value.amount_declared) {
                    isDisabled = isDisabled || true;
                    value.isRequired = true;
                }
            });
            return isDisabled;
        };
        /********** END OTHER INCOME DETAIL SECTION ***********/

        /********* START TAX COMPUTATION SECTION *********/
        $scope.viewDownloadFile = function (action) {
            var target = action == 'download' ? '_blank' : '',
                date = new Date(),
                month = date.getMonth() + 1,
                year = date.getFullYear();

            $scope.viewDownloadFileUsingForm(taxService.getUrl('viewDownloadFile') + "/" + action);
        };
        var getSlipStatus = function () {
            serverUtilityService.getWebService(taxService.getUrl('slipStatus'))
                .then(function (data) {
                    $scope.taxSlip.enable = utilityService.getValue(data, 'status') == 'success';
                    $scope.taxSlip.message = utilityService.getValue(data, 'message');
                });
        };
        getSlipStatus();
        /********* END TAX COMPUTATION SECTION ********/

        /***** Start Lanlord Details Section *****/
        var getLandlordDetails = function () {
            serverUtilityService.getWebService(taxService.getUrl('landlordDetails'))
                .then(function (data) {
                    $scope.landlord.list = utilityService.getValue(data, 'data', []);
                });
        };
        getLandlordDetails();
        /***** End Landlord Details Section *****/

        $scope.resetAPIError = function (status, message, api) {
            return utilityService.resetAPIError(status, message, api);
        };
        var successErrorCallback = function (data, tabName) {
            if (data.status === "success") {
                utilityService.showSimpleToast(data.message);
                $scope.resetAPIError(false, null, tabName);
                if (tabName === 'investmentDeclaration') {
                    getInvestmentDetails();
                }
            } else if (data.status === "error") {
                $scope.resetAPIError(true, data.message, tabName);
            } else {
                $scope.resetAPIError(true, data.data.message, tabName);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };

        /********* Start Angular Modal Section *********/
        $scope.openModal = function (templateUrl, instance, size) {
            size = angular.isDefined(size) ? size : 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                size: size,
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function (instance) {
            if (utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        /********* End Angular Modal Section *********/

        /***** Start Confirm Dialog *****/
        var showConfirmDialog = function (event, functionName, detail, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Delete Confirmation')
                .textContent('Would you like to delete this entry?')
                .ariaLabel('')
                .targetEvent(event)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                functionName(detail, item, event);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function (event, functionName, detail, item) {
            showConfirmDialog(event, functionName, detail, item);
        };
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

        $scope.getReconciliationYear = function () {
            var year = utilityService.getValue($scope.guideLine, 'year', utilityService.getCurrentYear);

            return utilityService.getCurrentMonth >= utilityService.startMonth ? year + 1 : year;
        };        
        
        /***** Start: Update Investment Head Section ******/
        var updateDeclaredAmountCallback = function (data, event, item) {
            $scope.formSubmitHandler('amountDeclared', false);
            $scope.toggleEditableSection(item, false)

              // below condition
            if (item.id == 33 || item.id == 59) {
                condtionForSpecificIds(item, event);
            }

            utilityService.getValue(data, 'status') === 'success'
                ? utilityService.showSimpleToast(utilityService.getValue(data, 'message'))
                : showAlert(event, utilityService.getValue(data, 'message'));              
        };
        $scope.updateDeclaredAmount = function (item, event) {
            $scope.formSubmitHandler('amountDeclared', true);
            var url = taxService.getUrl('amountDeclared') + "/" + item.id,
                payload = taxService.buildDeclaredAmountPayload(item);

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    updateDeclaredAmountCallback(data, event, item);                      
                });
        };
        /***** End: Update Investment Head Section ******/

        /***** Start: Multiple Head Amount Claim & Proof Section ******/
        $scope.investmentHead = {
            list: [],
            visible: true,
            item: {},
            amount_claimed: null           
        };
        $scope.viewInvestmentHead = function (item) {
            $scope.investmentHead.item = item;
            angular.copy(utilityService.getInnerValue($scope.investmentHead, 'item', 'investment_claimed', []), $scope.investmentHead.list);
            if (!utilityService.getValue($scope.investmentHead, 'list').length) {
                $scope.investmentHead.list = new Array(taxService.buildDefaultHeadObject());
            }
            $scope.openModal('multiple-head-claim.tmpl.html', 'multipleHead', 'lg');            
        };
        $scope.addMoreHeadAmount = function () {
            $scope.investmentHead.list.push(taxService.buildDefaultHeadObject());
        };
        var syncUpdatedResponseWithExistingApiResponse = function (claimObject) {
            taxService.addSyncMissingClaimToList($scope.apiResponse.claim, claimObject);
            $scope.investmentObject = taxService.buildInvestmentObject($scope.apiResponse.claim);
            $scope.taxMasterList = taxService.buildTaxMasterList($scope.apiResponse.masterList, $scope.investmentObject);
        };
        var saveUpdateInvestmentHeadSuccessCallback = function (data) {
            angular.copy(utilityService.getInnerValue(data, 'data', 'investment_claimed', []), $scope.investmentHead.list);
            utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            syncUpdatedResponseWithExistingApiResponse(utilityService.getValue(data, 'data'));
        };
        var saveUpdateInvestmentHeadCallback = function (data, item, event) {
            $scope.formSubmitHandler('investmentHead', false);
            utilityService.getValue(data, 'status') === 'success'
                ? saveUpdateInvestmentHeadSuccessCallback(data)
                : showAlert(event, utilityService.getValue(data, 'message'));              
        };
        $scope.saveUpdateInvestmentHead = function (item, event) {
            $scope.formSubmitHandler('investmentHead', true);
            var url = taxService.getUrl('investmentHead') + "/" 
                    + utilityService.getInnerValue($scope.investmentHead, 'item', 'id'),
                payload = taxService.buildInvestmentHeadPayload(item);

            if (utilityService.getValue(item, '_id')) {
                url = url + "/" + (angular.isObject(item._id) ? item._id.$id : item._id);
            }

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    saveUpdateInvestmentHeadCallback(data, item, event);                      
                });
        };
        var deleteInvestmentHeadCallback = function (data, event) {
            if (utilityService.getValue(data, 'status') === 'success') {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                angular.copy(utilityService.getInnerValue(data, 'data', 'investment_claimed', []), $scope.investmentHead.list);
                syncUpdatedResponseWithExistingApiResponse(utilityService.getValue(data, 'data'));
            } else {
                showAlert(event, utilityService.getValue(data, 'message'));
            } 
        };
        $scope.deleteInvestmentHead = function (detail, item, event) {
            var url = taxService.getUrl('investmentHead') + "/" 
                + utilityService.getInnerValue($scope.investmentHead, 'item', 'id') + "/" 
                + (angular.isObject(item._id) ? item._id.$id : item._id);
            
            serverUtilityService.deleteWebService(url)
                .then(function(data) {
                    deleteInvestmentHeadCallback(data, event);                   
                });
        };
        $scope.removeUploadObject = function(item) {
            item.isUploaded = false;
            item.claim_proof = null;
            item.proof_name = null;
            item.remove_proof = true;
        };
        $scope.bindMultipleFileChangeEvent = function(item) {
            $timeout(function() {
                $("input[type=file]").on('change',function() {
                    //item.isMultipleUploaded = true;
                    //item.fileError = null;
                });
            }, 100);            
        };
        $scope.setCommonFileObject = function(file, item) {
            item.fileError = null;
            if (!file) {
                return;
            }
            var is_valid_file = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);

            if (is_valid_file) {
                item.fileError = "File size must be less than or equal to " + $scope.allowedFileSizeGlobal.text;
            } else {
                item.fileError = null;
                item.isUploaded = true;
                //item.proof = file;
            }            
        };
        $scope.viewDownloadClaimProof = function(item, slug, action) {
            var claimId = angular.isObject(item._id) ? item._id.$id : item._id;
            $scope.viewDownloadFileUsingForm(getAPIPath() + "employee/investment-proof/" 
                + utilityService.getInnerValue($scope.investmentHead, 'item', 'allowance_id') + "/" 
                + claimId + "/" + action + "/" + slug + "?from_year=" 
                + parseInt(utilityService.getValue($scope.guideLine, 'year')) 
                + "&to_year=" + (parseInt(utilityService.getValue($scope.guideLine, 'year')) + 1));
        };
        $scope.toggleEditableSection = function (item, isEditable) {
            item.is_editable = isEditable;
        };
        $scope.isInputDisabled = function(item) {
            if(item.id == 59) {
               $scope.inputDisabledId[33] = item.amount_declared > 0;
            }

            if(item.id == 33) {
               $scope.inputDisabledId[59] = item.amount_declared > 0;
            }
        };
        var syncInputDisabled = function (item) {
            if(angular.isDefined(item[59]) || angular.isDefined(item[33])) {
                var id33 = utilityService.getInnerValue(item, 33, 'amount_declared');
                var id59 = utilityService.getInnerValue(item, 59, 'amount_declared');
                if(id33 > 0) {
                  $scope.inputDisabledId[59] = true;
                }else if (id59 > 0) {
                  $scope.inputDisabledId[33] = true;
                }
            }
        };
        function condtionForSpecificIds(item, details) {
            var hashId = {
                33: 59,
                59: 33
            };

            angular.forEach(details, function (value, key) {
                if (value.id === hashId[item.id]) {
                    value.amount_claimed = 0;
                }
            });
        }

        /***** Start: Tax Regime Section ******/
        $scope.getTaxRegime = function () {
            var Url = taxService.getUrl('taxRegime') + "/" + $scope.guideLine.year + "/" + ($scope.guideLine.year + 1);
            serverUtilityService.getWebService(Url)
                .then(function (data) {
                    $scope.taxRegime = data.data;
                    
                });     
        };

        $scope.updateTaxRegime = function (item) {
            $scope.taxRegimeEditable = false;
            var url = taxService.getUrl('taxRegime') + "/" + $scope.guideLine.year + "/" + ($scope.guideLine.year + 1);
                payload = {
                    type: item
                };
            serverUtilityService.patchWebService(url, payload)
                .then(function(data) {
                    if(utilityService.getValue(data, 'status') === 'error') {
                        showAlert(event, utilityService.getValue(data, 'message')); 
                    } else {
                        utilityService.showSimpleToast(data.message);
                    }
                });
        };
        $scope.toggleEditTaxRegime = function () {
            $scope.taxRegimeEditable = true;
        };
        var calculateEstimatedTax = function(payload) {
            
            $scope.isloadingState = true;
            var url = taxService.getUrl('calculateEstimatedTax');
            payload = angular.isDefined(payload) ? payload : {};
            serverUtilityService.postWebService(url, payload)
            .then(function(response) {
                if(utilityService.getValue(response, 'status') === 'success') {
                       $scope.closeModal('compareTax');
                       $scope.openModal('compare-tax.tmpl.html', 'compareTax', 'lg');
                       $scope.taxRegimeComparison.withInvestment = response.data[1];
                       $scope.taxRegimeComparison.withOutInvestment = response.data[2];
                    
                    } else {
                        showAlert(event, utilityService.getValue(response, 'message'));   
                    }
                    $scope.isloadingState = false;
                });
        };
        $scope.taxCalculator = function () {
            $scope.taxRegimeComparison.show_total = false;
            $scope.taxRegimeComparison.annual_rent = 0;
            $scope.taxRegimeComparison.is_metro = false;
            calculateEstimatedTax();
        };

        $scope.compareTaxRegime = function () {
           $scope.taxRegimeComparison.show_total = true;
           var payload = taxService.buildCompareTaxPayload($scope.taxRegimeComparison);
           calculateEstimatedTax(payload);
        };
        $scope.downloadTaxRegime = function () {
           var url = taxService.getUrl('downloadEstimatedTax');
           var payload = taxService.buildCompareTaxPayload($scope.taxRegimeComparison);
           serverUtilityService.postWebService(url, payload)
           .then(function(response) { 
                 $scope.viewDownloadFileUsingForm(getAPIPath() + response.data.api_url + '?file_path=' + response.data.file_path + '&file_name=' + response.data.file_name);
           })
        }

        var downloadFile = function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.target ="_blank";
            link.href = uri;
            link.click();
        };

        $scope.checkbankInterestOptoin = function (id) {
            if(id == 32 && utilityService.getValue( $scope.taxRegime, 'max_age_in_FY') >= 60) {
                return true
            }
            if(id == 70 && utilityService.getValue( $scope.taxRegime, 'max_age_in_FY') < 60) {
                return true
            }
        }

        $scope.checkIfEmpty = function(value) {
            if(value !== null && angular.isDefined(value) && value >= 0){
                return true
            }else{
                return false
            }
        }
        /***** End: Tax Regime Section ******/
	}
    /***** End: Multiple Head Amount Claim & Proof Section ******/
]);

