app.controller('ExpenseController', [
    '$scope', '$timeout', '$filter', '$window','$route', '$sce', '$location', '$routeParams', '$modal', '$mdDialog', 'ExpenseService', 'TravelExpenseAdminService', 'travelService', 'utilityService', 'ServerUtilityService', 'Upload', '$mdBottomSheet', 'FORM_BUILDER',
    function ($scope, $timeout, $filter, $window, $route, $sce, $location, $routeParams, $modal, $mdDialog, service, TravelExpenseAdminService, travelService, utilityService, serverUtilityService, Upload, $mdBottomSheet, FORM_BUILDER) {
        $scope.delegetFlag = false;
        $scope.attachment_url = 0;
        $scope.isDoc = false;
        $scope.previousReqs = null;        
        $scope.applicabilityList = null;  
        $scope.expenceObj = service.buildExpenseObj();
        $scope.dateToday = new Date();
        $scope.dateCurrentYear = new Date().getFullYear();
        $scope.dateCurrentMonth = new Date().getMonth();
        $scope.fileOwner = {
            ownerDetails: null,
            ownerId: null,
            isChecked: false
        };
        $scope.monthFilterObj = {
            monthList: utilityService.buildMonthList(),
            month: $scope.dateCurrentMonth,
            year: $scope.dateCurrentYear,
            type: null,
            isCustom: false,
            start_date: null,
            end_date: null,
            start_date_str: null,
            end_date_str: null,
            end_date_max: null
        };
        $scope.dummyModel = { val: null };
        var self = this;
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        self.group_employee_ids = [];
        self.selectedCity = null;
        self.simulateQuery = false;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;
        self.querySearchChips = querySearchChips;
        self.filterSelected = true;
        self.querySearchPostChips = querySearchPostChips;
        self.filterPostSelected = true;
        //For city search
        self.isCityDisabled = false;
        self.querySearchCity = querySearchCity;
        self.searchTextChangeCity = searchTextChangeCity;
        self.selectedItemChangeCity = selectedItemChangeCity;
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        $scope.isAdminView = utilityService.getValue($routeParams, 'isAdminView', false);
        $scope.attachments = service.buildAttachmentObject();
        $scope.requestFor = utilityService.getValue($routeParams, 'requestFor');
        $scope.requestedCategory = utilityService.getValue($routeParams, 'requestedCategory');
        $scope.actionPage = utilityService.getValue($routeParams, 'page');
        $scope.actionDetails = { '_id': $routeParams.actionId, 'status': $routeParams.acs}
        $scope.expense_id = utilityService.getValue($routeParams, 'expense_id');
        $scope.isReconcile = $routeParams.isReconcile && $routeParams.isReconcile == 'true' ? true : false;
        $scope.selectedUserView = service.buildUserViewObj($scope.user, 'delegate');
        $scope.expenceTypes = service.expenceTypes();
        $scope.paymentModes = service.buildPaymentModeObj();
        $scope.limitType = service.builLimitTypeHasMapObj();
        $scope.isReconsile = angular.isDefined($routeParams.isReconsile) && ($routeParams.isReconsile == true || $routeParams.isReconsile == 'true') ? $routeParams.isReconsile : false;
        $scope.is_edit = angular.isDefined($routeParams.is_edit) ? $routeParams.is_edit : false;
        $scope.request_resubmit = angular.isDefined($routeParams.request_resubmit) ? $routeParams.request_resubmit : false;
        $scope.uploadedFile = [];
        $scope.expenceTypeSetting = null;
        $scope.travelRequests = null;
        $scope.scheduledFrequency = service.scheduledFrequency();
        $scope.scheduledDay = service.buildDayHasMapObj();        
        $scope.isSaved  = false;
        $scope.isAddOtherRequest  = true;
        $scope.travelDetailsFilter = {
            list: [],
            selected: "",
            category: "",
            categoryList: []
        };
        $scope.expenseCategories = {
            list: [],
            selectedIndex: null,
            visible: false
        }
        $scope.selectedAttachment = {
            attachment_url: null,
            isImage: false,
            isCsv: false
        };
        $scope.questionList = [];
        $scope.projectableTimesheets = null;
        $scope.billdateRestriction = {
            min_date: null,
            max_date: null
        };
        $scope.expenseObject = {
            filteredList: []
        };
        $scope.statusMapping = utilityService.buildApproverStatusHashMap();
        $scope.approveRejectObject = {

        };

        $scope.restrictBillDate = function(expenseSetting) {
            $scope.billdateRestriction.min_date = null;
            $scope.billdateRestriction.max_date = null;
        };
        $scope.viewEmployeeProfile = function (profileId) {
            $location.url("dashboard/profile/" + profileId);
        };
        var syncExpenseModel = function (model) {
            $scope.expenseModel = service.buildExpenseModel(model);
            if(!$scope.expense_id) {
                if($scope.expenseModel && $scope.expenceTypeSetting && $scope.expenceTypeSetting.is_hard_limit == 3 && ([3, 4, 5, 7, 9].indexOf($scope.expenceTypeSetting.budget_type))>-1) {
                    $scope.expenseModel.total_amount = $scope.expenceTypeSetting.budget_amount;
                    if($scope.expenceTypeSetting.payment_mode == 2) {
                        $scope.expenseModel.amount_without_tax = $scope.expenceTypeSetting.budget_amount;
                    } else {
                        $scope.expenseModel.amount_without_tax = null;
                    }
                    $scope.expenseModel.toDate = null;
                    $scope.expenseModel.fromDate = null;
                } else {
                    $scope.expenseModel.total_amount = null;
                }
            }
            if($scope.expense_id) {
                $scope.questionList = service.buildQuestionList(utilityService.getInnerValue($scope.expenseModel, 'question_details', 'questions', []));
            }            
            self.group_employee_ids = loadChipList($scope.expenseModel.group_employee_ids);
            if (Object.keys($scope.expenseModel.expense_attachment).length > 0) {
                var bill = $scope.expenseModel.receipt_names.find(function (item) {
                    var id = angular.isObject(item._id) ? item._id.$id : item._id;
                    return angular.isDefined($scope.expenseModel.expense_attachment[id]);
                });
                if(bill) {
                    $scope.getSelectedBillAttachments(bill);
                }
            }
            if($scope.request_resubmit && $scope.is_edit) {
                $scope.expenseModel.expense_attachment = [];
            }
            if ($scope.expenseModel.tickets_attachment.length > 0) {
                $scope.viewAttachments($scope.expenseModel, $scope.expenseModel.tickets_attachment[0], 3);
            }
        };
        $scope.sortBy = function (propertyName) {
            $scope.expenceObj.expense.reverse = ($scope.expenceObj.expense.propertyName === propertyName) ? !$scope.expenceObj.expense.reverse : false;
            $scope.expenceObj.expense.propertyName = propertyName;
        };

        /* Start Expense Request */
        $scope.isListVisible = false;
        var reBuildExpenseRequestList = function (data) {
            $scope.travelDetailsFilter.categoryList = [];
            var requestStatusObject = service.buildRequestStatusObject();

            angular.forEach(data, function(value, key) {
                if (value.approve_requested_on) {
                    value.action_taken_on = $filter('date')((value.approve_requested_on * 1000), "dd/MM/yyyy");
                }

                if (utilityService.getValue(value, 'status')) {
                    value.statusText = requestStatusObject[value.status] + (value.action_taken_on ? (' on ' + value.action_taken_on) : '');
                }

                if(value.budget_type == 3 || value.budget_type == 7) {
                    if (utilityService.getValue(value, 'from_date')
                        && utilityService.getValue(value, 'to_date')) {
                        if (value.to_date > value.from_date) {
                            value.expense_duration = $filter('stringMonthDate')((value.from_date * 1000), "/")
                                + ' to ' + $filter('stringMonthDate')((value.to_date * 1000), "/");
                        } else {
                            value.expense_duration = $filter('stringMonthDate')((value.from_date * 1000), "/");
                        }
                    }
                } else {
                    value.expense_duration = $filter('stringMonthDate')((value.bill_date), "/");
                }

                if (utilityService.getValue(value, 'expense_category_type')) {                    
                    value.expense_category_type_name = utilityService.getValue($scope.expenceTypes, value.expense_category_type, 'N/A');
                }

                if ($scope.travelDetailsFilter.categoryList.indexOf(value.expense_category_name) == -1
                    && utilityService.getValue(value, 'expense_category_name')) {
                    $scope.travelDetailsFilter.categoryList.push(value.expense_category_name);
                }
            });
        };
        var getExpenseRequest = function (isAllRequests) {
            var url = service.getUrl('getExpence');

            if(!isAllRequests) {
                if (!$scope.monthFilterObj.isCustom) {
                    url = url + "?" + $scope.monthFilterObj.type + "_month=" + ($scope.monthFilterObj.month + 1) + "&year=" + $scope.monthFilterObj.year;
                } else if ($scope.monthFilterObj.isCustom && $scope.monthFilterObj.start_date_str && $scope.monthFilterObj.end_date_str) {
                    url = url + "?" + $scope.monthFilterObj.type + "_from_date=" +  $scope.monthFilterObj.start_date_str + "&" + $scope.monthFilterObj.type + "_to_date=" + $scope.monthFilterObj.end_date_str;
                }
            }
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    reBuildExpenseRequestList(utilityService.getValue(data, 'data', []));
                    $scope.expenseRequest = data.data;
                    $scope.expenceObj.credit_currency = data.credit_currency;
                    $scope.expenceObj.credit_amount = data.credit_amount;
                    $scope.isListVisible = true;
                });
        };
        if ($scope.section.dashboard.travelExpense) {
            getExpenseRequest(true);
        }
        var getCityDetails = function () {
            serverUtilityService.getWebService(service.getUrl('city'))
                .then(function (data) {
                    $scope.expenceObj.cityList = data.data;
                    self.city = loadCityChipList(data.data);
                });
        };
        getCityDetails();
        var getPolicyRule = function() {
            var url = travelService.getUrl('policyRule') + "/" + $scope.user.travelPolicy;
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.policyRule = data.data;
                });
        };
        getPolicyRule();        
        $scope.getCityName = function (cityList, cityId) {
            if (cityList) {
                var city = cityList.find(function (item) {
                    return  item._id == cityId;
                });
            }
            if (angular.isDefined(city)) {
                return city.city_name;
            } else {
                return {city_name: null};
            }
        };
        var resetForm = function (key) {
            if ($scope.expense_id) {
                if (!key) {
                    $scope.expenseModel = service.buildRefreshReqForm($scope.expenseModel);
                    if(!$scope.expense_id) {
                        if($scope.expenseModel && $scope.expenceTypeSetting && $scope.expenceTypeSetting.is_hard_limit == 3 && ([3, 4, 5, 7, 9].indexOf($scope.expenceTypeSetting.budget_type))>-1) {
                            $scope.expenseModel.total_amount = $scope.expenceTypeSetting.budget_amount;
                            if($scope.expenceTypeSetting.payment_mode == 2) {
                                $scope.expenseModel.amount_without_tax = $scope.expenceTypeSetting.budget_amount;
                            } else {
                                $scope.expenseModel.amount_without_tax = null;
                            }
                            $scope.expenseModel.toDate = null;
                            $scope.expenseModel.fromDate = null;
                        } else {
                            $scope.expenseModel.total_amount = null;
                        }
                    }
                    if($scope.expense_id) {
                        $scope.questionList = service.buildQuestionList(utilityService.getInnerValue($scope.expenseModel, 'question_details', 'questions', []), true);
                    }
                    $scope.attachments.files = {};
                    angular.forEach($scope.expenceTypeSetting.receipt_names, function (bill, k){
                        bill.files = [];
                    });
                }
                var url = service.getUrl('previousRequests') + "/" + $scope.expense_id;
                serverUtilityService.getWebService(url)
                    .then(function (data) {
                        $scope.previousReqs = data.data;
                    });
            } else {
                $route.reload();
            }
        };
        /* End Expense Request */

        if ($scope.expense_id) {
            var url = service.getUrl('addExpence') + "/" + $scope.expense_id;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.getExpenseSetting(data.data.expense_type);
                    syncExpenseModel(data.data);
                    resetForm('home');
                    $timeout(function () {
                        $scope.updateTotalAmount();
                    }, 100);
                    $scope.getExpenseType();
                });
        } else {
            syncExpenseModel();
        }
        var imgExtn = ['jpg', 'png'];
        var extCheck = function (item) {
            if (imgExtn.indexOf(item.attachment_ext) > -1) {
                return true;
            } else {
                return false;
            }
        };
        $scope.downloadAttachment = function(item, attachment) {
            var attachId = angular.isObject(attachment._id) ? attachment._id.$id : attachment._id;
            var url = service.getUrl('viewAttachment') + "/" + item._id + "/" + attachId;
            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.getAttachment = function (item, tempId) {
            $scope.expenceObj.isAdded = false;
            var id = angular.isObject(item._id) ? item._id.$id : item._id;
            if (tempId) {
                var url = service.getUrl('viewAttachment') + "/" + tempId._id + "/" + id + "?access_token=" + utilityService.getStorageValue('accessToken');
            } else {
                var url = service.getUrl('viewAttachment') + "/" + $scope.expense_id + "/" + id + "?access_token=" + utilityService.getStorageValue('accessToken');
            }
            if (extCheck(item)) {
                $scope.isDoc = false;
                $scope.attachment_url = url;
            } else {
                $scope.isDoc = true;
                var embeddedUrl = "//docs.google.com/gview?url=" + url + "&embedded=true";
                $scope.attachment_url = $sce.trustAsResourceUrl(embeddedUrl);
            }
            toggleModal('view-attachments', true);
        };
        $scope.selectedBill = null, $scope.selectedBillAttachment = [];
        $scope.getSelectedBillAttachments = function (bill){
            $scope.selectedBill = bill;
            var billId = angular.isObject(bill._id) ? bill._id.$id : bill._id;
            $scope.selectedBillAttachment = $scope.expenseModel.expense_attachment[billId]; 
            $scope.viewAttachments($scope.expenseModel, $scope.selectedBillAttachment[0]);
        };
        $scope.viewAttachment = function (item, index) {
            $scope.expenceObj.isAdded = false;
            var id = angular.isObject(item._id) ? item._id.$id : item._id;
            var url = service.getUrl('downloadTickets') + "/" + $scope.expenseId + "/" + id + "?access_token=" + utilityService.getStorageValue('accessToken');
            if (extCheck(item)) {
                $scope.attachment_url = url;
            } else {
                var embeddedUrl = "//docs.google.com/gview?url=" + url + "&embedded=true";
                $scope.attachment_url = $sce.trustAsResourceUrl(embeddedUrl);
            }
        };
        $scope.downloadRecipet = function (item, reciept) {
            var recieptId = angular.isObject(reciept._id) ? reciept._id.$id : reciept._id;
            var url = TravelExpenseAdminService.getUrl('downloadReciept') + "/" + item._id + "/" + recieptId + "?access_token=" + utilityService.getStorageValue("accessToken");
            $window.open(url);
        };
        $scope.viewAttachments = function (item, attachment, mode) {
            var imgExt = ['jpg', 'png', 'jpeg', 'jfif', 'ppm', 'pgm', 'pbm', 'pnm'];
            var id = angular.isObject(attachment._id) ? attachment._id.$id : attachment._id,
                urlKey = angular.isDefined(mode) && mode == 3 ? 'downloadTickets' : 'downloadReciept',
                url = TravelExpenseAdminService.getUrl(urlKey) + "/" + item._id + "/" + id + "?access_token=" + utilityService.getStorageValue('accessToken'),
                embeddedUrl = "//docs.google.com/gview?url=" + url + "&pid=explorer&efh=false&a=v&chrome=false&embedded=true";
            
            if (attachment.attachment_ext.toLowerCase() == 'csv') {
                attachment.attachment_url = url;
                attachment.isCsv = true;
                attachment.isImage = false;
            } else if(imgExt.indexOf(attachment.attachment_ext.toLowerCase()) > -1) {
                attachment.attachment_url = url;
                attachment.isCsv = false;
                attachment.isImage = true;
            } else {
                attachment.attachment_url = $sce.trustAsResourceUrl(embeddedUrl);
                attachment.isCsv = false;
                attachment.isImage = false;
            }
            $scope.selectedAttachment = attachment;
        };
        var getCurrency = function () {
            serverUtilityService.getWebService(service.getUrl('currency'))
                .then(function (data) {
                    $scope.currencyList = data;
                });
        };
        getCurrency();
        var getApplicabilityList = function (){
            var url = service.getUrl('applicabilityList')+"/"+$scope.requestFor;
            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.applicabilityList = data.data;   
                });
        };
        if($scope.requestFor){
            getApplicabilityList();  
        };
        $scope.updateTotalAmount = function (isSeprate) {
            $scope.expenseModel.claimed_tax = isSeprate ? 0 : $scope.expenseModel.claimed_tax;
            var taxRate = isSeprate || (angular.isDefined($scope.expenseModel) && angular.isUndefined($scope.expenseModel.claimed_tax)) ? 0 : $scope.expenseModel.claimed_tax;
            if ($scope.expenseModel.amount_without_tax) {
                $scope.expenseModel.amount_with_tax = parseFloat((($scope.expenseModel.amount_without_tax * taxRate) / 100).toFixed(2));
                $scope.expenseModel.claimed_amount = parseFloat($scope.expenseModel.amount_with_tax) + parseFloat($scope.expenseModel.amount_without_tax);
            } else {
                $scope.expenseModel.claimed_amount = null;
                $scope.expenseModel.amount_with_tax = null;
                return;
            }
        };
        $scope.updateTaxRate = function () {
            var taxAmount = angular.isDefined($scope.expenseModel && angular.isDefined($scope.expenseModel.amount_with_tax)) ? $scope.expenseModel.amount_with_tax : 0;
            if ($scope.expenseModel.amount_without_tax) {
                $scope.expenseModel.claimed_tax = parseFloat(((taxAmount * 100) / $scope.expenseModel.amount_without_tax).toFixed(2));
                $scope.expenseModel.claimed_amount = taxAmount > 0 ? parseFloat(taxAmount) + parseFloat($scope.expenseModel.amount_without_tax) : 0 + parseFloat($scope.expenseModel.amount_without_tax);
            } else {
                return;
            }
        };
        $scope.checkAmount = function () {
            var amountTotal = 0;
            angular.forEach($scope.expenseModel.itemize_details, function (val, key) {
                if (val.itemize_amount && val.reimbursement) {
                    amountTotal += parseFloat(val.itemize_amount);
                }
            });
            if ($scope.expenseModel.amount_without_tax) {
                if (amountTotal > $scope.expenseModel.amount_without_tax) {
                    $scope.amountErr = 'Itemize reimbursement amount must equal to total amount'
                } else {
                    $scope.amountErr = '';
                }
            } else {
                $scope.amountErr = 'Claim amount is required';
            }
        };
        $scope.totalTax = function () {
            var taxTotal = 0;
            angular.forEach($scope.expenseModel.itemize_details, function (val, key) {
                taxTotal += parseFloat(val.itemize_tax);
            });
            if ($scope.expenseModel.claimed_tax) {
                if (taxTotal > $scope.expenseModel.claimed_tax) {
                    $scope.taxErr = 'Itemize tax rate must equal to total tax rate';
                } else {
                    $scope.taxErr = '';
                }
            } else {
                $scope.taxErr = 'Claim amount tax rate is required';
            }
        };
        $scope.assignDelegate = function () {
            resetErrorMessages();
            var payload = {
                delegate_id: $scope.fileOwner.ownerId
            };
            serverUtilityService.postWebService(service.getUrl('delegate'), payload).then(function (data) {
                if (data.status === "success") {
                    utilityService.showSimpleToast(data.message);
                    getDelegateDetails();
                }
            });
        };
        var changeDelegate = function (list) {
            self.selectedItem = {
                _id: angular.isObject(list.delegate_details[0]._id) ? list.delegate_details[0]._id.$id : list.delegate_details[0]._id,
                full_name: utilityService.getValue(list.delegate_details[0], 'full_name')
            };
            $scope.fileOwner.ownerId = list.delegate_details[0]._id;
            $scope.fileOwner.ownerDetails = list.delegate_details[0];
            self.isDisabled = false;
        };
        var getDelegateDetails = function () {
            serverUtilityService.getWebService(service.getUrl('delegate')).then(function (data) {
                $scope.expenceObj.delegate = data.data;
                if (angular.isObject($scope.expenceObj.delegate) && $scope.expenceObj.delegate.delegate_details.length) {
                    $scope.delegetFlag = true;
                    changeDelegate($scope.expenceObj.delegate);
                }
            });
        };
        getDelegateDetails();
        var getAssignDelegateDetails = function () {
            serverUtilityService.getWebService(service.getUrl('delegatesEmployee'))
                .then(function (data) {
                    $scope.expenceObj.assignDelegate = data.data;
                    $scope.expenceObj.assignDelegate.push($scope.selectedUserView);
                });
        };
        getAssignDelegateDetails();
        $scope.updateUserView = function (item) {
            $scope.selectedUserView = service.buildUserViewObj(item, 'employee');
        };
        $scope.updateDelegate = function (delegateId) {
            resetErrorMessages();
            var url = service.getUrl('delegate') + "/" + delegateId,
                payload = {
                    delegate_id: $scope.fileOwner.ownerId
                };

            serverUtilityService.putWebService(url, payload).then(function (data) {
                if (data.status === "success") {
                    utilityService.showSimpleToast(data.message);
                    getDelegateDetails();
                }
            });
        };
        $scope.deleteDelegate = function (list) {
            var url = service.getUrl('delegate') + "/" + list.id;
            serverUtilityService.deleteWebService(url).then(function (data) {
                list.delegate_details = utilityService.deleteCallback(data, list.delegate_details[0], list.delegate_details);
                if (data.status === "success") {
                    $scope.delegetFlag = false;
                    self.selectedItem = [];
                    utilityService.showSimpleToast(data.message);
                }
            });
        };        
        var getEmployeeForGroupRequest = function (id){
            var url = service.getUrl('empForGroupRequest') + "/" + id +"/"+$scope.requestFor;
            serverUtilityService.getWebService(url)
                .then(function (data){
                    self.allEmployees = loadChipList(data.data);
                });
        };        
        $scope.getExpenseSetting = function (id) {
            resetErrorMessages();
            if($scope.expenseModel) {
                $scope.expenseModel.expense_type = id;
            }
            var url = service.getUrl('expenceTypeSettings') + "/" + id +"/"+$scope.requestFor;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    if (data.data.status == 'error') {                            
                        $scope.expenceObj.error_message = data.data.message;
                        $scope.expenceObj.has_error = true;
                    } else {
                        if (data.data.applicability == 1 && data.data.payment_mode != 1) {
                            getEmployeeForGroupRequest(id);
                        }
                        $scope.expenceTypeSetting = data.data;
                        $scope.restrictBillDate($scope.expenceTypeSetting);
                        $scope.travelRequests = data.request_details;
                        if(!$scope.expense_id) {
                            if($scope.expenseModel && $scope.expenceTypeSetting && $scope.expenceTypeSetting.is_hard_limit == 3 && ([3, 4, 5, 7, 9].indexOf($scope.expenceTypeSetting.budget_type))>-1) {
                                $scope.expenseModel.total_amount = $scope.expenceTypeSetting.budget_amount;
                                if($scope.expenceTypeSetting.payment_mode == 2) {
                                    $scope.expenseModel.amount_without_tax = $scope.expenceTypeSetting.budget_amount;
                                } else {
                                    $scope.expenseModel.amount_without_tax = null;
                                }
                                $scope.expenseModel.toDate = null;
                                $scope.expenseModel.fromDate = null;
                            } else {
                                $scope.expenseModel.total_amount = null;
                            }
                            $scope.questionList = utilityService.getInnerValue(data, 'question_details', 'questions', []);
                        }
                    }                        
                });
        };
        $scope.refreshOnselectExpenseType = function(type) {
            if(!type) {
                $scope.expenseCategories.list = [];
                $scope.expenseCategories.selectedIndex = null;
            } else {
                $scope.expenseModel.expense_type = null;
            }
            $scope.dummyModel.val = null;
            resetErrorMessages();
            $scope.expenceTypeSetting = null;
            $scope.questionList = [];
            $scope.travelRequests = [];
            $scope.expenseModel = service.buildRefreshReqForm({applicability: $scope.expenseModel.applicability});
        };
        $scope.getExpenseType = function () {
            var urlPrefix = $scope.section.newAdvanceRequest || $scope.section.viewAdvanceRequest 
                    ? 'advanceCatergory' : 'expenseCatergory',
                catType = $scope.expenseModel && $scope.expenseModel.applicability ? $scope.expenseModel.applicability : 1,
                url = service.getUrl(urlPrefix) + "/" + $scope.requestFor + "/" + catType;
            
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    if(!$scope.expense_id) {
                        $scope.refreshOnselectExpenseType();
                    }
                    $scope.expenseType = data.data;
                    $scope.expenseCategories.list = service.createSubCatogories(data.data, $scope.expenseCategories.list);
                    if($scope.expense_id && $scope.expenseModel && $scope.expenseModel.expense_type) {
                        $scope.expenseCategories.list = [];
                        $scope.preFiledExpenseCatogary($scope.expenseModel.expense_type);
                        $scope.dummyModel.val = $scope.expenseModel.expense_type;
                    }
                });
        };
        if ($scope.requestFor) {
            $scope.getExpenseType();
        }
        $scope.onSelectCatogary = function(selectedCatog) {
            if(!$scope.expense_id) {
                $scope.refreshOnselectExpenseType(true);
            }
            var selectedIndex = $scope.expenseCategories.list.findIndex(function(elem) { return elem.category === selectedCatog; });
            if(selectedIndex == -1) {
                return;
            }
            $scope.expenseCategories.selectedIndex = selectedIndex;
            $scope.expenseCategories.list = service.createSubCatogories($scope.expenseType, $scope.expenseCategories.list, selectedIndex);
            if($scope.expenseCategories.list[selectedIndex].id) {
                $scope.expenseModel.expense_type = $scope.expenseCategories.list[selectedIndex].id;
                $scope.getExpenseSetting($scope.expenseCategories.list[selectedIndex].id);
            }
        };
        $scope.preFiledExpenseCatogary = function(expense_type) {
            $scope.expenseCategories.list = service.createSubCatogories($scope.expenseType, $scope.expenseCategories.list);
            var ind = $scope.expenseType.findIndex(function(ele) { return ele._id === expense_type; });
            var nam = '';
            if(ind>=0) {
                nam = $scope.expenseType[ind].name.split('-')[0].trim();
            }
            if(nam.length) {
                $scope.onSelectCatogary(nam);
            }       
        };

        /* for Applicability */
        $scope.applicabilityStatus = {
            1: 'In Office',
            2: 'Domestic',
            3: 'International'
        };
        
        /********* Start Angular Modal Section *********/
        $scope.openModal = function(templateUrl, keyName) {
            $scope.modalInstance[keyName] = $modal.open({
                templateUrl : templateUrl,
                scope : $scope,                
                windowClass: 'fadeEffect',
            });
        };
        $scope.closeModal = function (keyName) {
            if ($scope.modalInstance[keyName]) {
                $scope.modalInstance[keyName].dismiss('cancel');
            }
        };
        /********* End Angular Modal Section *********/

        var toggleModal = function (id, flag) {
            flag ? $scope.openModal('viewExpenseReceipt.html', 'viewExpenseReceipt')
                    : $scope.closeModal('viewExpenseReceipt');
        };
        $scope.goBack = function () {            
            if($scope.isAdminView) {
                var adminObj = JSON.parse(utilityService.getStorageValue('travelExpenseAdminObject'));
                
                $location.url(adminObj.url).search({
                    expenseId: adminObj.param.expenseId, 
                    expenseType: adminObj.param.expenseType, 
                    empId: adminObj.param.empId, 
                    isReconcile: angular.isDefined(adminObj.param.isReconcile) ? adminObj.param.isReconcile : true
                });

                return;
            }
            if ($scope.isReconcile) {
                var expenseId = utilityService.getStorageValue('reconcile_expense_id'),
                    searchObj = {
                        expense_id: expenseId, 
                        requestFor: $scope.selectedUserView._id
                    };

                if ($scope.isReconsile) {
                    searchObj.isReconsile = $scope.isReconsile;
                    $location.url($scope.getRequestedLocationUrl()).search(searchObj);
                } else {
                    searchObj.tabIndex = $scope.getCurrentTabIndex();
                    $location.url('dashboard/view-expense').search(searchObj);
                }

                utilityService.setReloadOnSearch(true);
            } else {
                var tabIndex = $scope.section.newAdvanceRequest 
                    || utilityService.getValue($routeParams, 'tabIndex') == 2 ? 2 : 1;
                $location.url('dashboard/travel-expense').search({
                    tab: tabIndex
                });
            }        
        };
        $scope.checkExpType = function () {
            $scope.expTypeErr = $scope.expenseModel.expense_type ? '' : 'Please select Expense Type';
        };
        $scope.newExpense = function () {
            var viewPath = 'dashboard/new-expense?requestFor=' + $scope.selectedUserView._id,
                currentPath = window.location.href.substr(0, window.location.href.indexOf('#') + 1),
                fullPath = currentPath + viewPath;

            $window.open(fullPath, '_blank');
        };
        $scope.getCurrentTabIndex = function () {
            return utilityService.getValue($scope.travelEmployeeObject, 'selectedTab', 1);
        };
        $scope.getTabIndexQueryStringParams = function () {
            return '&tabIndex=' + $scope.getCurrentTabIndex();
        };
        $scope.viewExpense = function (item, mainRequestId) {
            var expId = mainRequestId ? mainRequestId : item._id,
                viewPath = 'dashboard/view-expense?expense_id=' + expId + '&requestFor=' + $scope.selectedUserView._id,
                currentPath = window.location.href.substr(0, window.location.href.indexOf('#') + 1),
                fullPath = currentPath + viewPath + $scope.getTabIndexQueryStringParams();

            $window.open(fullPath, '_blank');
        };
        $scope.viewRejectedExpense = function(expense_id) {
            var viewPath = 'dashboard/view-expense?expense_id=' + expense_id + '&requestFor=' + $scope.requestFor,
                currentPath = window.location.href.substr(0, window.location.href.indexOf('#') + 1),
                fullPath = currentPath + viewPath; //+ $scope.getTabIndexQueryStringParams()

            $window.open(fullPath, '_blank');
        };
        $scope.viewReconcileExpense = function (item){
            utilityService.setStorageValue('reconcile_expense_id', $scope.expense_id);           
            var locUrl = '#/dashboard/view-expense?expense_id=' + item._id +'&requestFor=' + $scope.selectedUserView._id 
                + '&isReconcile=true&isReconsile='+ $scope.isReconsile + $scope.getTabIndexQueryStringParams();
            
            $window.open(locUrl);            
            utilityService.setReloadOnSearch(true);
        };
        $scope.changeReceipt = function (item) {
            toggleModal('view-attachments', true);
            $scope.expenceObj.isAdded = true;
            $scope.selectedFile = item;
        };
        $scope.removeReceipt = function (item,index) {
            item.splice(index, 1);
        };
        $scope.showBottomSheet = function () {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'bottom-sheet-template.html'
            });
        };
        $scope.addMoreItemize = function () {
            $scope.expenseModel.itemize_details.push({"itemize_name": null, "itemize_amount": null, "reimbursement": false, "billable": false, "remark": null});
        };
        $scope.removeItemize = function (index) {
            $scope.expenseModel.itemize_details.splice(index, 1);
        };
        $scope.filterByStatus = function (item) {
            if ($scope.selectedUserView._id == item.emp_id 
                && ($scope.selectedUserView._id == item.emp_id)) {
                return item;
            }
        };
        $scope.getProjectableTimesheets = function() {
            if(!$scope.projectableTimesheets) {
                var url = service.getUrl('projectableTimesheets');
                serverUtilityService.getWebService(url).then(function(data) {
                    $scope.projectableTimesheets = utilityService.getValue(data, 'data', null);
                });
            }
        };
        if($scope.expense_id) {
            $scope.getProjectableTimesheets();
        }

        /******************** Code For Autocomplete ******************/
        var getEmployeeList = function (isCallback, callback, event) {
            isCallback = angular.isDefined(isCallback) ? isCallback : false;
            if (isCallback) {
                callback(event);
            }
            
            var url = service.getUrl('expenseEmployees');            
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.employeeList = data.data;
                self.repos = loadAll($scope.employeeList);
                self.allEmployeesList = loadChipList(data.data);                
            });
        };
        if (!$scope.section.dashboard.travelExpense) {
            getEmployeeList();
        }
        function querySearch(query) {
            return query ? self.repos.filter(createFilterForPoc(query)) : [];
        }
        function searchTextChange(text) {
            $scope.fileOwner = {
                ownerDetails: null,
                ownerId: null,
                isChecked: false
            };
        }
        function selectedItemChange(item) {
            if (angular.isDefined(item) && item) {
                $scope.fileOwner.ownerId = angular.isObject(item._id) ? item._id.$id : item._id;
                $scope.fileOwner.ownerDetails = item;
            }
        }
        function loadAll() {
            var repos = $scope.employeeList;
            return repos.map(function (repo) {
                repo.value = repo.full_name && repo.full_name != null ? repo.full_name.toLowerCase() : "";
                return repo;
            });
        }
        function createFilterForPoc(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }

        /***** START CHIPS SECTION *****/
        function querySearchChips(keyword) {
            return keyword ? self.allEmployees.filter(createFilterForFn(keyword)) : [];
        }
        function createFilterForFn(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(approver) {
                return (approver._lowername.indexOf(lowercaseQuery) != -1);
            };
        }
        function querySearchPostChips(keyword) {
            return keyword ? self.allEmployeesList.filter(createFilterForEmp(keyword)) : [];
        }
        function createFilterForEmp(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterEmp(approver) {
                return (approver._lowername.indexOf(lowercaseQuery) != -1);
            };
        }
        function loadChipList(list) {
            return list.map(function (c, index) {
                var object = {
                    id: angular.isObject(c._id) ? c._id.$id : c._id,
                    name: c.full_name && c.full_name != null ? c.full_name : "",
                    email: c.email,
                    display: c.display_detail,
                    image: angular.isDefined(c.profile_pic) ? c.profile_pic : 'images/no-avatar.png'
                };
                object._lowername = object.name.toLowerCase();
                return object;
            });
        }

        /***** Start File Upload Section *****/
        $scope.bindMultipleFileChangeEvent = function () {
            $scope.selectedFile = null;
            //$scope.attachments.files = [];
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    $scope.attachments.isUploaded = true;
                });
            }, 100);
        };

        $scope.defaultsize = '2MB';
        if($scope.envMnt == 'tsmg') {
            $scope.defaultsize = '6MB';
        } 

        $scope.setFiles = function (files, item) {
            var defaultFilesize = 2*1024*1024;
            if($scope.envMnt == 'tsmg') {
                defaultFilesize = 6*1024*1024;
            } 
            var id = angular.isDefined(item) && angular.isObject(item._id)?item._id.$id:item._id;
            item.files = angular.isDefined(item.files) ? item.files : [];
            item.errorMessage = [];
            if(files.length) {
                var allowedfileType = ['jpeg', 'jpg', 'png', 'doc', 'docx', 'pdf','xls', 'csv', 'xlsx'];
                angular.forEach(files, function(file, key) {
                    var name = file.name.split('.');
                    if(!allowedfileType.includes(name[name.length-1].toLowerCase())) {
                        item.errorMessage.push( '"' + file.name + '" is not allowed file format');
                    } else if(file.size > defaultFilesize) {
                        item.errorMessage.push( '"' + file.name + '" is large then allowed file size (' + $scope.defaultsize + ')');
                    } else {
                        item.files.push(file);
                    }
                });
            }
            $scope.attachments.files[id] = item.files;
        };
        $scope.reUpload = function () {
            $scope.attachments.isUploaded = false;
            $scope.attachments.files = [];
        };
        /***** End File Upload Section ******/
        
        var resetOnSaveNext = function (formName) {
            $scope.expenseModel = service.buildRefreshReqForm($scope.expenseModel);
            if(!$scope.expense_id) {
                if($scope.expenseModel && $scope.expenceTypeSetting && $scope.expenceTypeSetting.is_hard_limit == 3 && ([3, 4, 5, 7, 9].indexOf($scope.expenceTypeSetting.budget_type))>-1) {
                    $scope.expenseModel.total_amount = $scope.expenceTypeSetting.budget_amount;
                    if($scope.expenceTypeSetting.payment_mode == 2) {
                        $scope.expenseModel.amount_without_tax = $scope.expenceTypeSetting.budget_amount;
                    } else {
                        $scope.expenseModel.amount_without_tax = null;
                    }
                    $scope.expenseModel.toDate = null;
                    $scope.expenseModel.fromDate = null;
                } else {
                    $scope.expenseModel.total_amount = null;
                }
            }
            if($scope.expense_id) {
                $scope.questionList = service.buildQuestionList(utilityService.getInnerValue($scope.expenseModel, 'question_details', 'questions', []));
            }            
            $scope.attachments.files = {};
            angular.forEach($scope.expenceTypeSetting.receipt_names, function (bill, k) {
                bill.files = [];
            });
            self.group_employee_ids = [];
            self.searchText = '';
            if (formName) {
                utilityService.resetForm(formName);
            }
            $scope.isAddOtherRequest = true;
        };        
        var setAddOtherRequestFlag = function (isAddOtherRequest) {
            $scope.isAddOtherRequest = !isAddOtherRequest;
        };        
        var successCallback = function (data, list, section, isAdded, isAddOtherRequest) {
            $scope.errorMessages = []
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            if(isAddOtherRequest) {
                resetOnSaveNext();
            } else {
                $scope.goBack();
            }
            if (angular.isDefined(data.data)) {
                isAdded ? list.unshift(data.data) : utilityService.refreshList(list, data.data);
            }
        };
        var errorCallback = function (data, section) {
            $scope.errorMessages = buildError(data);
            // $scope.isAddOtherRequest = true;
            // if (data.status == "error") {
            //     utilityService.resetAPIError(true, data.data.error, section);
            // } else {
            //     utilityService.resetAPIError(true, data.data.error, section);
            //     angular.forEach(data.data.error, function (value, key) {
            //         angular.forEach(value, function(v, k) {
            //             $scope.errorMessages.push(v);
            //         });
            //     });
            // }
        };
        var successErrorCallback = function (data, list, section, isAdded, isAddOtherRequest) {
            data.status === "success" ? successCallback(data, list, section, isAdded, isAddOtherRequest) 
                : errorCallback(data, section);
        };
        var uploadSuccessCallback = function (response, key, isAddOtherRequest, formName) {
            $scope.errorMessages =  []
            if (response.data.status === "success") {
                utilityService.showSimpleToast(response.data.message);
                utilityService.resetAPIError(false, response.data.message, 'expense');
                if (key || key == 'advance') {
                    resetForm();
                }else if(isAddOtherRequest){
                    resetOnSaveNext();
                } else {
                    $scope.goBack();
                }
            } else if (response.data.status === "error") {
                utilityService.resetAPIError(true, response.data.message, 'expense');
            }
        };
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        var resetErrorMessages = function () {
            $scope.expenceObj.error_message = null;
            $scope.expenceObj.has_error = false;
            $scope.errorMessages = [];
        };
        var uploadErrorCallback = function (response) {
            errorCallback(response, 'expense');
        };
        var uploadProgressCallback = function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };
        $scope.getRequestedLocationUrl = function () {
            return utilityService.getValue($scope.travelEmployeeObject, 'selectedTab') == 2
                ? 'dashboard/new-advance-request' : 'dashboard/new-expense';
        };
        $scope.editExpenseRequest = function (item) {            
            $location.url($scope.getRequestedLocationUrl()).search({
                expense_id: item._id, 
                requestFor: item.emp_id, 
                is_edit: true
            });
        };
        $scope.reconcilationRequest = function (item) {
            $location.url($scope.getRequestedLocationUrl()).search({
                expense_id: item._id, 
                requestFor: item.emp_id, 
                isReconsile: true
            });
        };
        $scope.resubmitRejectedRequest = function (item) {
            $location.url($scope.getRequestedLocationUrl()).search({
                expense_id: item._id, 
                requestFor: item.emp_id, 
                is_edit: true, 
                request_resubmit: true
            });
        };
        $scope.reSubmitExpence = function() {
            var payload;
            if($scope.expenceTypeSetting.payment_mode == 1) {
                payload = service.buildAdvanceExpensePayload($scope.requestFor, $scope.expenseModel);
                if ($scope.expenceTypeSetting.applicability != 1 && $scope.expenseModel && $scope.expenseModel.travel_id) {
                    payload.travel_id = utilityService.getValue($scope.expenseModel, 'travel_id');
                    var requestedOnObj = $scope.travelRequests.find(function (item) {
                        return item._id == payload.travel_id;
                    })
                    payload.travel_requested_on = angular.isDefined(requestedOnObj) ? requestedOnObj.travel_requested_on : '';
                }
                payload.is_reconcile_request = $scope.isReconsile;
                payload.is_advance_request = true;
                payload = service.addQuestionsInPayload(payload, $scope.questionList);
            } else if($scope.expenceTypeSetting.payment_mode == 2) {
                payload = service.buildExpensePayload($scope.requestFor, $scope.expenseModel,self);
                if ($scope.expenceTypeSetting.applicability != 1 && $scope.expenseModel && $scope.expenseModel.travel_id) {
                    payload.travel_id = utilityService.getValue($scope.expenseModel, 'travel_id');
                    var requestedOnObj = $scope.travelRequests.find(function (item) {
                        return item._id == payload.travel_id;
                    });
                    payload.travel_requested_on = angular.isDefined(requestedOnObj) ? requestedOnObj.travel_requested_on : '';
                }
                payload = service.addQuestionsInPayload(payload, $scope.questionList);
                payload.claime_receipts = $scope.attachments.files;
            } else {
                payload = {
                    is_reconcile_request: true,
                    expense_type: $scope.expenseModel.expense_type,
                    travel_id: $scope.expenseModel.travel_id,
                    applicability: $scope.expenceTypeSetting.applicability,
                    travel_planner_id: $scope.expenseModel.travel_planner_id
                };
                if ($scope.expenceTypeSetting.applicability != 1 && $scope.expenseModel && $scope.expenseModel.travel_id) {
                    payload.travel_id = utilityService.getValue($scope.expenseModel, 'travel_id');
                    var requestedOnObj = $scope.travelRequests.find(function (item) {
                        return item[item.length-1]._id == payload.travel_id;
                    })
                    payload.bill_date = requestedOnObj ? requestedOnObj[requestedOnObj.length-1].requested_departure_date : null;
                    payload.travel_requested_on = angular.isDefined(requestedOnObj) ? requestedOnObj.travel_requested_on : '';
                }
                payload = service.addQuestionsInPayload(payload, $scope.questionList);
            }
            var url = $scope.section.newAdvanceRequest || $scope.section.viewAdvanceRequest
                ? service.getUrl('advance') : service.getUrl('addExpence');
            Upload.upload({
                url: url + "?resubmit_request_id=" + $scope.expense_id + "&resubmit_request_unique_id=" + $scope.expenseModel.expense_unique_id,
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: payload,
            }).then(function (response) {
                uploadSuccessCallback(response);
                $scope.isSaved  = false;
            }, function (response) {
                uploadErrorCallback(response);
                $scope.isSaved  = false;
            }, function (evt) {
                uploadProgressCallback(evt);
            });
        };
        $scope.addExpence = function (key, isAddOtherRequest, formName) {
            $scope.isSaved  = true;
            var isAddOtherReq = angular.isDefined(isAddOtherRequest) ? isAddOtherRequest : false;
            setAddOtherRequestFlag(isAddOtherReq);
            var payload = service.buildExpensePayload($scope.requestFor, $scope.expenseModel,self);
            if ($scope.expenseModel.applicability != 1 && $scope.expenseModel && $scope.expenseModel.travel_id) {
                payload.travel_id = utilityService.getValue($scope.expenseModel, 'travel_id');
                var requestedOnObj = $scope.travelRequests.find(function (item) {
                    return item._id == payload.travel_id;
                });
                payload.travel_requested_on = angular.isDefined(requestedOnObj) ? requestedOnObj.travel_requested_on : '';
            }
            if (key == 'advance') {
                payload.advance_request_id = $scope.expense_id;
            }
            if($scope.expenceTypeSetting.payment_mode == 1 && $scope.expenseModel.is_final_request){
                payload.advance_request_id = $scope.expense_id;
            }
            payload = service.addQuestionsInPayload(payload, $scope.questionList);
            payload.claime_receipts = $scope.attachments.files;            
            var url = $scope.section.newAdvanceRequest 
                ? service.getUrl('advance') + "/2" : service.getUrl('addExpence');
            Upload.upload({
                url: url,
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: payload
            }).then(function (response) {
                uploadSuccessCallback(response, key, isAddOtherReq, formName);
                $scope.isSaved  = false;
            }, function (response) {
                uploadErrorCallback(response);
                $scope.isSaved  = false;
            }, function (evt) {
                uploadProgressCallback(evt);
            });
        };
        $scope.addTravelPlannerExpense = function (isAddOtherRequest) {
            $scope.isSaved  = true;
            var isAddOtherReq = angular.isDefined(isAddOtherRequest) ? isAddOtherRequest : false;
            setAddOtherRequestFlag(isAddOtherReq);
            var payload = {
                emp_id: $scope.requestFor,
                expense_type: $scope.expenseModel.expense_type,
                applicability: $scope.expenceTypeSetting.applicability,
                travel_planner_id: $scope.expenseModel.travel_planner_id,
                // bill_date: utilityService.dateToString($scope.expenseModel.expense_date, '-')
            };
            if ($scope.expenceTypeSetting.applicability != 1 && $scope.expenseModel && $scope.expenseModel.travel_id) {
                payload.travel_id = utilityService.getValue($scope.expenseModel, 'travel_id');
                var requestedOnObj = $scope.travelRequests.find(function (item) {
                    return item[item.length-1]._id == payload.travel_id;
                })
                payload.bill_date = requestedOnObj ? requestedOnObj[requestedOnObj.length-1].requested_departure_date : null;
                payload.travel_requested_on = angular.isDefined(requestedOnObj) ? requestedOnObj.travel_requested_on : '';
            }
            payload = service.addQuestionsInPayload(payload, $scope.questionList);
            var url = service.getUrl('addExpence');
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, null, 'expense', false, isAddOtherReq);
                    $scope.isSaved  = false;
                });
        };
        $scope.updateTravelPlannerExpense = function () {
            $scope.isSaved = true;
            var payload = {
                is_reconcile_request: true,
                expense_type: $scope.expenseModel.expense_type,
                travel_id: $scope.expenseModel.travel_id,
                applicability: $scope.expenceTypeSetting.applicability,
                travel_planner_id: $scope.expenseModel.travel_planner_id,
                // expense_date: $scope.expenseModel.expense_date,
                // bill_date: utilityService.dateToString($scope.expenseModel.expense_date, '-')
            };
            if ($scope.expenceTypeSetting.applicability != 1 && $scope.expenseModel && $scope.expenseModel.travel_id) {
                payload.travel_id = utilityService.getValue($scope.expenseModel, 'travel_id');
                var requestedOnObj = $scope.travelRequests.find(function (item) {
                    return item[item.length-1]._id == payload.travel_id;
                })
                payload.bill_date = requestedOnObj ? requestedOnObj[requestedOnObj.length-1].requested_departure_date : null;
                payload.travel_requested_on = angular.isDefined(requestedOnObj) ? requestedOnObj.travel_requested_on : '';
            }
            payload = service.addQuestionsInPayload(payload, $scope.questionList);
            var url = service.getUrl('addExpence') + "/" + $scope.expense_id;
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, null, 'expense');
                    $scope.isSaved = false;
                });
        };
        $scope.updateExpence = function (k) {
            $scope.isSaved  = true;
            var key = k ? k : null;
            var payload = service.buildExpensePayload($scope.requestFor, $scope.expenseModel,self);
            //payload.destination_city = self.selectedCity.id?self.selectedCity.id:self.selectedCity._id;
            if ($scope.expenceTypeSetting.applicability != 1 && $scope.expenseModel && $scope.expenseModel.travel_id) {
                payload.travel_id = utilityService.getValue($scope.expenseModel, 'travel_id');
                var requestedOnObj = $scope.travelRequests.find(function (item) {
                    return item._id == payload.travel_id;
                    ;
                });
                payload.travel_requested_on = angular.isDefined(requestedOnObj) ? requestedOnObj.travel_requested_on : '';
            }
            payload = service.addQuestionsInPayload(payload, $scope.questionList);
            payload.claime_receipts = $scope.attachments.files;
            if($scope.expenseModel.resubmit_request_id) {
                payload.resubmit_request_id = $scope.expenseModel.resubmit_request_id
            }
            var url = $scope.section.newAdvanceRequest || $scope.section.viewAdvanceRequest
                ? service.getUrl('advance') : service.getUrl('addExpence');
            Upload.upload({
                url: url + "/" + $scope.expense_id,
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: payload,
            }).then(function (response) {
                uploadSuccessCallback(response, key);
                $scope.isSaved  = false;
            }, function (response) {
                uploadErrorCallback(response);
                $scope.isSaved  = false;
            }, function (evt) {
                uploadProgressCallback(evt);
            });
        };
        $scope.requestAdvanceAmount = function (isAddOtherRequest, formName) {
            $scope.isSaved = true;
            var isAddOtherReq = angular.isDefined(isAddOtherRequest) ? isAddOtherRequest : false;
            setAddOtherRequestFlag(isAddOtherReq);
            var payload = service.buildAdvanceExpensePayload($scope.requestFor, $scope.expenseModel);
            if ($scope.expenceTypeSetting.applicability != 1 && $scope.expenseModel && $scope.expenseModel.travel_id) {
                payload.travel_id = utilityService.getValue($scope.expenseModel, 'travel_id');
                var requestedOnObj = $scope.travelRequests.find(function (item) {
                    return item._id == payload.travel_id;
                })
                payload.travel_requested_on = angular.isDefined(requestedOnObj) ? requestedOnObj.travel_requested_on : '';
            }
            payload.is_reconcile_request = $scope.isReconsile;
            payload.is_advance_request = true;
            payload = service.addQuestionsInPayload(payload, $scope.questionList);
            var url = $scope.section.newAdvanceRequest || $scope.section.viewAdvanceRequest
                ? service.getUrl('advance') + '/2' : service.getUrl('addExpence');
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, null, 'expense', false, isAddOtherReq);
                        if(angular.isDefined(formName)){
                            utilityService.resetForm(formName);
                        }
                        $scope.isSaved = false;
                    });
        };
        var deleteExpenseCallback = function (data, item, isReconcile) {
            var is_reconcile = isReconcile ? true : false;
            if (is_reconcile) {
                $scope.previousReqs = utilityService.deleteCallback(data, item, $scope.previousReqs);
            } else {
                $scope.expenseRequest = utilityService.deleteCallback(data, item, $scope.expenseRequest);
            }
            if(item.resubmit_request_id) {
                angular.forEach($scope.expenseRequest, function(val, key) {
                    if(val._id == item.resubmit_request_id) {
                        val.resubmit_request_raised = false;
                    }
                });
            }
            if (data.status === "success") {
                utilityService.showSimpleToast(data.message);
            }
        };
        $scope.deleteExpence = function (item, isReconcile) {
            var urlPrefix = $scope.getCurrentTabIndex() == 2 ? 'deleteAdvance' : 'addExpence',
                url = service.getUrl(urlPrefix) + "/" + item._id;

            serverUtilityService.deleteWebService(url)
                .then(function (data) {                
                    deleteExpenseCallback(data, item, isReconcile);
                });
        };
        $scope.deleteAttachment = function (item, index,file) {
            var id = angular.isObject(item._id) ? item._id.$id : item._id;
            if($scope.request_resubmit) {
                $scope.expenseModel.expense_attachment[id].splice(index, 1);
                return false;
            }
            var file_id = angular.isObject(file._id) ? file._id.$id : file._id;
            var url = service.getUrl('deleteExpense') + "/" + $scope.expense_id + "/" + file_id;
            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    if (data.status === "success") {
                        $scope.expenseModel.expense_attachment[id].splice(index, 1);
                        utilityService.showSimpleToast(data.message);
                    }
                });
        };
        var statusObject = {
            0: "All Request",
            1: "Pending",
            10: "Approved By Workflow",
            8: "Approved By Admin",
            3: "Auto Approved",
            11: "Rejected By Approver",
            9: "Rejected By Admin"
        };
        $scope.expenseTypeFilter = function (item) {
            if ($scope.expenceObj.expenseStatus != 0) {
                if ($scope.expenceObj.expenseStatus == item.status) {
                    return item;
                }
            } else {
                return item;
            }
        };
        if ($location.path() == '/dashboard/travel-expense') {
            $scope.updatePaginationSettings('expense_pagination');
        }

        /*** Auto Complete **/
        function loadAllCities(list) {
            return list.map(function (repo) {
                repo.city_name = repo.city_name.toLowerCase();
                return repo;
            });
        }
        function querySearchCity(query) {
            return query ? self.city.filter(createFilterFor(query)) : self.city;
        }
        function searchTextChangeCity(text, model, key) {
//            if (angular.isDefined(model[key])) {
//                model[key] = null;
//            }
        }
        function selectedItemChangeCity(item, model, key) {
            //self.selectedCity = null;
            if (angular.isDefined(item) && item) {
                var id = angular.isObject(item._id) ? item._id.$id : item._id;
                $scope.calculateFixedAmount($scope.expenceTypeSetting, $scope.expenseModel)
                //model[key] = id;
            }
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item._lowername.indexOf(lowercaseQuery) === 0);
            };
        }
        function loadCityChipList(list) {
            return list.map(function (c, index) {
                var object = {
                    _id: angular.isObject(c._id) ? c._id.$id : c._id,
                    city_name: c.city_name,
                    code: c.code,
                };
                object._lowername = object.city_name.toLowerCase();
                return object;
            });
        }
        if ($scope.requestedCategory) {
            $scope.getExpenseSetting($scope.requestedCategory);
            $scope.expenseModel.expense_type = $scope.requestedCategory;
        }        
        $scope.downloadTicket = function (item, ticket){
            var id = angular.isObject(ticket._id) ? ticket._id.$id : ticket._id;
            $scope.viewDownloadFileUsingForm(service.getUrl('downloadTickets') + "/" + item._id + "/" + id);
        };        
        $scope.sendReminder = function (item, approver, type){
            var url = TravelExpenseAdminService.getUrl('reminder'),
                payload = payload = {
                    master_emp_id: utilityService.getStorageValue('loginEmpId'),
                    slave_emp_id: approver.employee_id,
                    type: type,
                    request_id: item._id
                };
                
            serverUtilityService.postWebService(url, payload)
                .then(function (data){
                    if(data.status == 'success'){
                        utilityService.showSimpleToast(data.message);
                    }
                });
        };
        
        /***** Calculate Fixed Amount *****/
        $scope.isDateSameForPerNight = false;
        $scope.calculateFixedAmount = function (settings, modal) {
            $scope.isDateSameForPerNight = false;
            var noOfGroupEmp = settings.is_group_request && utilityService.getInnerValue($scope.ctrl, 'group_employee_ids', 'length') ? $scope.ctrl.group_employee_ids.length+1 : 1;
            if(settings.budget_type == 7 && modal.toDate && modal.fromDate){
                modal.toDate.setHours(0, 0, 0);
                modal.fromDate.setHours(0, 0, 0);
                if(modal.toDate.getTime() == modal.fromDate.getTime()){
                    $scope.isDateSameForPerNight = true;
                }
            }
            if($scope.isDateSameForPerNight){
                alert('Since this expense has a per night limit, the from and to dates must be different.');
                return;
            }
            if (settings.is_hard_limit == 3) {
                var total = 0;
                var amount = parseFloat(settings.budget_amount);
                if (settings.has_city_limit && settings.city_budget_limit.length && modal.stay_city_name) {
                    var is_city_exist = settings.city_budget_limit.find(function (city) {
                        return city.city_name == modal.stay_city_name._id
                    });
                    if (is_city_exist) {
                        amount = is_city_exist.budget_amount;
                    }
                }
                if (([3, 7].indexOf(settings.budget_type) > -1) && modal.toDate && modal.fromDate) {
                    modal.toDate.setHours(0, 0, 0);
                    modal.fromDate.setHours(0, 0, 0);
                    var totalDays = Math.round((modal.toDate - modal.fromDate) / (1000 * 60 * 60 * 24));
                    total = settings.budget_type == 3 ? totalDays + 1 : totalDays;
                }
                if (([4, 5].indexOf(settings.budget_type) > -1) && modal.distance) {
                    total = parseInt(modal.distance);
                }
                total = (amount && !total) ? 1 : total;
                if (settings.payment_mode == 1 && !$scope.isReconsile) {
                    modal.total_amount = total * amount * noOfGroupEmp;
                } else {
                    modal.amount_without_tax = total * amount * noOfGroupEmp;
                    modal.claimed_amount = total * amount * noOfGroupEmp;
                }
            }            
        };
        $scope.exportToCsv = function() {
            var csvData = service.buildCSVContent(utilityService.getValue($scope.expenseObject, 'filteredList', []), $scope.currencyList);
            utilityService.exportToCsv(csvData.content, 'expense-list.csv');
        };
        $scope.assignDelgateClickHandler = function(callback, event) {
            getEmployeeList(true, callback, event);
        };
        $scope.changeExpenseType = function () {
            $scope.travelDetailsFilter.category = "";
            $scope.travelDetailsFilter.travel_id = '';
            if (utilityService.getValue($scope.travelDetailsFilter, 'selected') == 2
                || utilityService.getValue($scope.travelDetailsFilter, 'selected') == 3) {
                $scope.getEmployeeTravelList();
            }
        };
        $scope.changeExpenseCategory = function () {
            $scope.travelDetailsFilter.selected = "";
        };  
        $scope.createSrcDestCityName = function (item, cityList, reqObj) {
            if(!(angular.isArray(item) || angular.isString(item)) || !cityList){ return ''; }
            var date = null;
            if(angular.isString(item)) {
                if(!reqObj || !reqObj.length) { return ''; }
                item = reqObj.find(function(el) { return (el[0]._id == item); });
                date = ($filter('stringMonthDate')(item[item.length-1].requested_departure_date)) + (item.length>1 ? (' to '+ ($filter('stringMonthDate')(item[0].requested_departure_date))) : '');
            }
            var cityName = $scope.getCityName(cityList, item[item.length-1].source_city);
            for(var i=item.length-1; i>=0; i--) {
                cityName = cityName + '-' + $scope.getCityName(cityList, item[i].destination_city)
            }
            if(date) { return date + ',' + cityName; }
            return cityName;
        }
        $scope.setMaxDate = function (){
            $scope.monthFilterObj.start_date.setHours(0, 0, 0);
            var dateAfterTwoMonth = new Date($scope.monthFilterObj.start_date.getFullYear(), $scope.monthFilterObj.start_date.getMonth(), $scope.monthFilterObj.start_date.getDate() + 60);
            if(dateAfterTwoMonth.getTime() >= $scope.dateToday.getTime()){
                $scope.monthFilterObj.end_date_max = $scope.dateToday;
            } else {
                $scope.monthFilterObj.end_date_max = dateAfterTwoMonth;
            }
        };
        $scope.getRequestMonthWise = function (index){
            if(!utilityService.getValue($scope.monthFilterObj, 'type')) {
                getExpenseRequest(true);
            } else {
                if (angular.isDefined(index) && !$scope.monthFilterObj.isCustom) {
                    $scope.monthFilterObj.start_date =  null;
                    $scope.monthFilterObj.end_date = null;
                    $scope.monthFilterObj.start_date_str =  null;
                    $scope.monthFilterObj.end_date_str = null;
                    $scope.monthFilterObj.month = index || index == 0 ? index : $scope.monthFilterObj.month;
                } else if($scope.monthFilterObj.isCustom && $scope.monthFilterObj.start_date && $scope.monthFilterObj.end_date){
                    $scope.monthFilterObj.start_date_str =  utilityService.dateToString($scope.monthFilterObj.start_date, '-');
                    $scope.monthFilterObj.end_date_str =  utilityService.dateToString($scope.monthFilterObj.end_date, '-');
                }
                getExpenseRequest();
            }
        }
        $scope.preventDateClose = function(){
            $('md-datepicker .md-datepicker-input-container .md-datepicker-triangle-button ,md-datepicker .md-datepicker-button .md-datepicker-calendar-icon, md-datepicker .md-datepicker-button').attr("md-prevent-menu-close", "md-prevent-menu-close");
        };
        $scope.getEmployeeTravelList = function () {
            var url = service.getUrl('travelList') + "/" + $scope.travelDetailsFilter.selected;
            
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.travelRequests = utilityService.getValue(data, 'request_details');
                });
        };
        $scope.downloadAllExpenseReceipts = function () {
            var url = service.getUrl('downloadAllReceipts') + "/" 
                + utilityService.getValue($routeParams, 'expense_id') + "?access_token=" 
                + utilityService.getStorageValue("accessToken");
            $window.open(url);            
        };

        /***** Start: Advance Tab Section *****/
        $scope.advance = service.buildAdvanceObject();        
        var advanceDetailsCallback = function (data) {
            //$scope.advance.list = service.clubAdvanceRequestWithReconsiledOnes(utilityService.getValue(data, 'data', []));
            $scope.advance.list = utilityService.getValue(data, 'data', []);
            $scope.advance.balance.amount = service.getAdvanceBalanceAmount(utilityService.getValue($scope.advance, 'list', []));
            $scope.advance.visible = true;
        };
        var getAdvanceDetails = function () {            
            $scope.advance.visible = false;
            $scope.advance.list = [];
            var url = service.getUrl('advanceDetails') + "/" + utilityService.getInnerValue($scope.advance, 'type', 'selected', 1);            
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    advanceDetailsCallback(data);
                });
        };
        if (utilityService.getValue($scope.travelEmployeeObject, 'selectedTab') == 2) {
            getAdvanceDetails();
            $scope.updatePaginationSettings('advance_pagination');
        }        
        $scope.changeTypeHandler = function () {
            getAdvanceDetails();
        };
        $scope.raiseAdvanceRequest = function () {
            var viewPath = 'dashboard/new-advance-request?requestFor=' + $scope.selectedUserView._id,
                currentPath = window.location.href.substr(0, window.location.href.indexOf('#') + 1),
                fullPath = currentPath + viewPath;

            $window.open(fullPath, '_blank');
        };
        $scope.exportAdvanceToCsv = function() {
            var list = utilityService.getValue($scope.advance, 'filteredList', []),
                csvData = service.buildAdvanceCSVContent(list),
                advanceType = utilityService.getInnerValue($scope.advance, 'type', 'selected', 1),
                fileName = 'advance-list-' + '(' + $scope.expenceTypes[advanceType] + ')';

            utilityService.exportToCsv(csvData.content, fileName + '.csv');
        };
        $scope.showAlert = function(ev, title, message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
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
            if(angular.isDefined(data.error)){
                angular.forEach(data.error, function (v, k) {
                    error.push(v);
                });
            }

            if(utilityService.getInnerValue(data, 'data', 'error')) {
                angular.forEach(data.data.error, function (v, k) {
                    error.push(v);
                }); 
            }

            return error;
        }
        /***** End: Advance Tab Section *****/

        /***** Start: Approve & Reject Request With Comment *****/
        $scope.approveRejectWithComment = function (actionStatus) {
            $scope.actionDetails.actionStatus = actionStatus;
            $scope.openModal('addCommentTmpl', 'commnet');
        };
        /***** End: Approve & Reject Request With Comment *****/

        $scope.changeAdvanceReconciliationTypeHandler = function (type) {
            $scope.expenseModel.is_final_request = type == 2 ? true : false;
        };
        $scope.changeFinalRreconciliationHandler = function (isChecked) {
            $scope.expenseModel.advance_reconciliation_type = isChecked ? 2 : 1;
        };
    }
]);