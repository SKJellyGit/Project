app.controller('OnBoardingStatusController', [
    '$scope', '$routeParams', '$location', '$timeout', '$sce', '$q', '$window', '$modal', 'OnBoardingStatusService', 'UserManagementService', 'utilityService', 'ServerUtilityService', 'Upload', 'FORM_BUILDER',
    function ($scope, $routeParams, $location, $timeout, $sce, $q, $window, $modal, OnBoardingStatusService, UserManagementService, utilityService, serverUtilityService, Upload, FORM_BUILDER) {
    
        $scope.resetAllTypeFilters();
        $scope.onboardingStatusList = [];
        $scope.formList = [];
        $scope.documentList = [];
        $scope.provisionList = [];
        $scope.selectedCandidate = {};
        $scope.selectedCount = null;
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.activation = {
            disabled: false,
            allDisabled: false,
            disabledStatus: false,
            isAll: false,
            activeDisable: false,
            visible: false,
            isLoader: false,
            filteredList: [],
            forms:[],
            documents:[],
            provisions:[]
        };

        $scope.generateBreakup = {
            error: {
                message: null,
                status: true
            },            
        };
        $scope.payroll = {
            breakupType: 1,
            roundType: 1, 
            roundUpto: null,
            gross: null,
            ctc: null,
            selectedPlanId: null,
            isEditPayrollPlan: false,
            isPreviewVisible: false,
        };
        $scope.employeeOtherData = null;
        $scope.isPreviewVisible = false;
        $scope.preview = {
            credit: [],
            debit: [],
            tempCredit:[],
            tempDebit:[],
            ctc_breakup: [],
            totat_deducted: null,
            totalCtc: null,
            isVisible: false,
            finalPreview: {balance: null, ctc: {breakup: [], total_ctc: null}}
        };
        var frequencyObj = {
            payout_frequency: null,
            payout_x_cycle_value: null,
            on_first_payroll_cycle: null,
            once_on_payroll_cycle: null,
            once_on_x_payroll_cycle: null
        };
        $scope.verifyData = {
            type: $routeParams.type,
            docId: $routeParams.docId,
            candidateId: $routeParams.candidateId,
            isVerified:$routeParams.isVerified
        };
        $scope.isSystemPlanPermission = true;
        $scope.isOfferLetterPermission = false;
        $scope.empStatusObj = OnBoardingStatusService.buildEmpStatusObj();
        $scope.empStatusArray = OnBoardingStatusService.buildObjectArray($scope.empStatusObj, 7);
        $scope.tab = 'profileField';
        $scope.countryDialCode = {
            list: []
        };
        $scope.assetAttributes = {
            asset: {
                name: null,
                description: null
            },
            list: []
        };

        $scope.statutoryCompliances = {
            lwf: null,
            pt: null
        };


        $scope.setTab = function(newValue){
            $scope.tab = newValue;
        };
        $scope.isSet = function(tabName){
            return $scope.tab === tabName;
        };

        var verifyActivateEmployee = function(objpermission) {
            angular.forEach(objpermission, function(v,k) {
                if(v.permission_slug === 'can_not_activate_employee') {
                    $scope.isSystemPlanPermission = false;
                }
                if(v.permission_slug === 'can_view_others_offer_letter') {
                    $scope.isOfferLetterPermission = true;
                }
            });
        }

        var getPermission = function () {
            var url = OnBoardingStatusService.getUrl('modulePermission');
            serverUtilityService.getWebService(url)
                .then(function (data){
                    verifyActivateEmployee(data.data);
                });
        };
        getPermission();

        $scope.time = {
            year : new Date().getFullYear(),
            month : new Date().getMonth() + 1,
            startDate: new Date(new Date(utilityService.dateToString(new Date(), '/', 'ymd') + ' 00:00:00').setDate(new Date().getDate()-60)),
            endDate: new Date(utilityService.dateToString(new Date(), '/', 'ymd') + ' 00:00:00'),
            endDateMax: new Date(new Date(new Date(utilityService.dateToString(new Date(), '/', 'ymd') + ' 00:00:00').setMonth(new Date().getMonth()+2)).setDate(0))
        };
        $scope.setEndDateMaxvalue = function(date, months) {
            $scope.time.endDateMax =  new Date(new Date(new Date(date).setMonth(new Date(date).getMonth()+months+1)).setDate(0));
        };

        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('-');
        };


        $scope.todaysDate = new Date();        
        var getFormList = function () {
            var url = OnBoardingStatusService.getUrl('getAllForms');
            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.formList = data.data;
                    angular.forEach(data.data, function (v, k) {
                        $scope.activation.forms.push(v._id)
                    });
                });
        };

        $scope.loadingState = false;
        getFormList();
        var getDocumentList = function () {
            var url = OnBoardingStatusService.getUrl('document');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.documentList = data.data;
                angular.forEach(data.data, function (v, k) {
                    $scope.activation.documents.push(v._id)
                });
            });
        };
        getDocumentList();        
        var getProvisionList = function () {
            var url = OnBoardingStatusService.getUrl('getProvisionType');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.provisionList =[];
                angular.forEach(data.data, function (v, k) {
                    if (v.enabled) {
                        $scope.provisionList.push(v);
                        $scope.activation.provisions.push(v._id);
                    }
                });
            });
        };
        getProvisionList();
        var allFilterObject = [{countObject: 'group', isGroup: true, collection_key: 'candidate_detail'},
            {countObject: 'form', collection: $scope.activation.forms, isArray: true, key: 'selected_form'},
            {countObject: 'document', collection: $scope.activation.documents, isArray: true, key: 'selected_document'},
            {countObject: 'type', collection: $scope.activation.provisions, isArray: true, key: 'selected_provision'},
            {countObject: 'employeeStatus', collection: [1,2,3,4,5,6,7], isArray: false, key: 'system_plans_employee_status'}
        ];
        var getOnBoardingStatusList = function (params) {
            // var params = isAll ? "?is_all=true" : '';
            params = angular.isDefined(params) ? params : '';
            $scope.loadingState = true;
            var url = OnBoardingStatusService.getUrl('onboardingStatus') + params;
            payload = { start: ($scope.formatDate($scope.time.startDate)), end : ($scope.formatDate($scope.time.endDate)) };
            $scope.resetFacadeCountObject(allFilterObject);
            serverUtilityService.getWebService(url,payload)
                .then(function (data) {
                    angular.forEach(data.data, function (v, k) {
                        v.personal_email = utilityService.getInnerValue(v, 'candidate_detail', 'personal_email');
                        v.full_name = v.candidate_detail.full_name;
                        v.selected_form = [];
                        v.selected_document = [];
                        v.selected_provision = [];
                        v.offerStatus = v.system_plans_employee_status;
                        v.employee_status = v.system_plans_employee_status;
                        v.joiningDateTimestamp = v.work_profile_joining_date ? utilityService.getDefaultDate(v.work_profile_joining_date, false, true).getTime() : 0;
                        v.isChecked = false;
                            if (angular.isDefined(v.form_detail) && angular.isDefined(v.form_detail.forms)) {
                                v.selected_form = v.form_detail.forms.map(function (form) {
                                    return form.id;
                                });
                            }
                            if (angular.isDefined(v.document_detail) && angular.isDefined(v.document_detail.documents)) {
                                v.selected_document = v.document_detail.documents.map(function (doc) {
                                    return doc.id;
                                });
                            }
                            if (angular.isDefined(v.provision_details) && angular.isDefined(v.provision_details.provisions)) {
                                v.selected_form = v.provision_details.provisions.map(function (provision) {
                                    return provision.type_id;
                                });
                            }
                      $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject, v);
                    });
                    $scope.onboardingStatusList = data.data;
                    $scope.loadingState = false;
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.activation.visible = true;
                    $scope.activation.isLoader = true;
                });
        };
        getOnBoardingStatusList();
        $scope.setQueryNewvalue = function() {
            if($scope.time.endDate != null) {
                getOnBoardingStatusList();
            } 
        }  
        var statusSuccessCallback = function (data, item) {
            utilityService.showSimpleToast(data.message);
            item.offerStatus = data.data.system_plans_employee_status;
            item.system_plans_employee_status = data.data.system_plans_employee_status;
            utilityService.refreshList($scope.onboardingStatusList, data.data);
        };
        var activateSuccessCallback = function (data) {
            $scope.selectedCandidate = {};
            $scope.activation.isAll = false;
            $scope.selectedCount = null;
            getOnBoardingStatusList();
        };
        $scope.sendReminder = function (item, type,pro, managers) {
            var url = OnBoardingStatusService.getUrl('sendReminder'),
                payload = {
                    master_emp_id: item.candidate_detail._id,
                };

            if(angular.isDefined(managers)) {
                var array = [];
                angular.forEach(managers, function (val, key){
                    array.push(val._id);
                });
                payload.slave_emp_id = array;
                payload.reference_id = pro.id;
                payload.request_type = pro.request_type;
                payload.request_id = pro.request_id;
                payload.provision_name = pro.name;
                payload.employee_detail = item.candidate_detail;
                payload.type = type;
            } else {
                payload.slave_emp_id = item.candidate_detail._id;
                payload.type = type;
            }
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (data.status=='success') {
                        if(angular.isDefined(managers)){
                            pro.reminders = angular.isDefined(pro.reminders) && angular.isArray(pro.reminders) ? pro.reminders : [];
                            var d = new Date;
                            var date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
                            time = d.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
                            pro.reminders.push(date + ", " + time);
                        }
                        utilityService.showSimpleToast(data.message);
                    }else{
                        alert(data.message);
                    }
                });
        };
        $scope.setStatus = function (offerStatus, item) {
            $scope.activation.disabledStatus = true;
            var url = OnBoardingStatusService.getUrl('changeStatus'),
                payload = {
                    employee_id: item._id.$id,
                    status: offerStatus
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    $scope.activation.disabledStatus = false;
                    if (data.status == 'success') {
                        statusSuccessCallback(data, item)
                    } else if (data.status == 'error') {
                        alert(data.error);
                    }
                });
        };
        $scope.activateEmployee = function (type, item) {
            $scope.activation.disabled = true;
            var employee = [];
            employee.push(item._id.$id);
            var url = OnBoardingStatusService.getUrl('activate'),
                payload = {
                    type: type,
                    employee: employee
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    $scope.activation.disabled = false;
                    getOnBoardingStatusList();
                });
        };        
        $scope.beforeActivation = {
            type: null,
            item: null
        };        
        $scope.goToSystemPaln = function (type, item){
            $scope.activation.disabled = true;
            $scope.beforeActivation = {
                type: type,
                item: item
            };
            $('#alert-before-activation').appendTo('body').modal('show');
        };
        $scope.selectAllCandidate = function (isAll) {
            if (isAll) {
                var count = 0;
                angular.forEach($scope.onboardingStatusList, function (row, index) {
                    if(!(row.status || (row.system_plans_employee_status!=2 && row.system_plans_employee_status!=3))){
                        count++; 
                    row.isChecked= true;
                }
                });
                $scope.selectedCount = count;
                $scope.activation.isAll = true;
            } else {
                $scope.selectedCount = null;
                angular.forEach($scope.onboardingStatusList, function (row, index) {
                    row.isChecked= false;
                });
                $scope.activation.isAll = false;
            }
            $scope.activation.activeDisable = ($scope.selectedCount > 0 || $scope.selectedCount != null) ? true : false;
        };
        $scope.usersIncluded = [];
        $scope.selectDesectUser = function(elementID) {
            var i = $.inArray(elementID, $scope.usersIncluded);
            if (i > -1) {
                $scope.usersIncluded.splice(i, 1);
            } else {
                $scope.usersIncluded.push(elementID);
            }

            if($scope.usersIncluded.length) {
                $scope.activation.activeDisable = true;
            } else {
                $scope.activation.activeDisable = false;
            }
        };
        $scope.activateAllEmployee = function (type) {
            $scope.activation.allDisabled = true;
            var employee = [];
            angular.forEach($scope.onboardingStatusList, function (row, index) {
                if (row.isChecked && !row.status) {
                    employee.push(row._id.$id);
                }
            });
            var url = OnBoardingStatusService.getUrl('activate'),
                payload = {
                    type: type,
                    employee: employee
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    $scope.activation.allDisabled = false;
                    activateSuccessCallback(data);
                });
        };        
        $scope.verifySubmittedData = function (candidate, doc, type, isVerified) {
            var candidateID = angular.isObject(candidate._id) ? candidate._id.$id : candidate._id,
                docID = angular.isObject(doc.id) ? doc.id.$id : doc.id;

            var viewPath = 'frontend/new-hire/verify?candidateId=' + candidateID 
                    + '&docId=' + docID + '&type=' + type + '&isVerified=' + isVerified,
                currentPath = window.location.href.substr(0, window.location.href.indexOf('#') + 1),
                fullPath = currentPath + viewPath;

            $window.open(fullPath, '_blank');
            /* $location.url("/frontend/new-hire/verify").search({
                candidateId: candidateID, docId:docID, type: type, isVerified: isVerified
            }); */
        };        
        $scope.backFromverify = function () {
            if (angular.isDefined($routeParams.module)) {
                $location.url('/frontend/elcm');
            } else {
                $scope.wizardFlag = 'onboarding-status';
                $location.url('/frontend/new-hire').search({isVerify: true});
            }
        };
        $scope.docToverify = null;        
        var getExtOfFile = function (filename){
            return filename.split('.').pop();
        };
        $scope.viewVerifySection = {
            visible: false
        };
        var viewFormDetailsCallback = function(model) {
            var def = "1970-01-01";
            $scope.questionList = angular.isDefined(model.form_data) && angular.isDefined(model.form_data.form_detail) ? model.form_data.form_detail.questions : [];
            angular.forEach($scope.questionList, function(value, key) {
                if(value.question_type != 3 && angular.isDefined(value.answer)
                    && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];                    
                }
                // If question type is of time
                if(utilityService.getValue(value, 'answer') && value.answer) {
                    if (value.question_type == 6) {
                        value.answer = new Date(def + " " + value.answer);
                    }else if (value.question_type == 5 && value.answer!= ""){
                       value.answer = new Date(parseInt(value.answer)); 
                    }
                }
            });
            $timeout(function () {
                $scope.viewVerifySection.visible = true;
            }, 3000);
        };        
        var getDocToVerify = function () {
            var url = OnBoardingStatusService.getUrl('getDocumentToverify') + "/" + $scope.verifyData.candidateId + "/" + $scope.verifyData.docId + "/" + $scope.verifyData.type;
            serverUtilityService.getWebService(url)
                .then(function (data){
                    var isImg = ['jpg', 'png', 'jpeg']
                    if(angular.isDefined(data.data.document_file_name)) {
                        var fileType = (data.data.document_file_name.split('.').pop()).toLowerCase();
                        data.data.isImg = isImg.indexOf(fileType) > -1 ? true : false;
                        data.data.image = data.data.url + '/' + utilityService.getStorageValue('accessToken');
                    }
                    if(angular.isDefined(data.data.form_file_name) && data.data.form_type == 3) {
                        var fileType = (data.data.form_file_name.split('.').pop()).toLowerCase();
                        data.data.isImg = isImg.indexOf(fileType) > -1 ? true : false;
                        data.data.image = data.data.url + '/' + utilityService.getStorageValue('accessToken');
                    }
                    
                    data.data.mainUrl = data.data.url;
                    data.data.downloadUrl = data.data.url+ '/' + utilityService.getStorageValue('accessToken');
                    data.data.url  = $sce.trustAsResourceUrl("https://docs.google.com/gview?url=" + data.data.url + '/' + utilityService.getStorageValue('accessToken') + "&embedded=true");
                    $scope.docToverify  = data.data;
                    //console.log($scope.docToverify);
                    viewFormDetailsCallback(data.data);
                });
        };
        if($scope.verifyData.candidateId && $scope.verifyData.docId && $scope.verifyData.type) {
            getDocToVerify();
        }
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };        
        $scope.verifyDocuments = function (isReject, comment) {
            isReject = angular.isDefined(isReject) ? isReject : false;
            comment = angular.isDefined(comment) ? comment : '';
            
            var url = isReject ? 'prejoin/frontend/reject-forms-documents' 
                    : OnBoardingStatusService.getUrl('verifyDocs'),
                payload = {
                    employee_id: $scope.verifyData.candidateId,
                    type: $scope.verifyData.type,
                };

            if($scope.verifyData.type == 1) {
                payload.form_id =  $scope.verifyData.docId;
            } else {
                payload.document_id =  $scope.verifyData.docId;
            }

            if(isReject) {
                payload.rejection_comment = comment;
            }
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if(utilityService.getValue(data, 'status') == 'success') {
                        var defaultMessage = isReject ? 'Document has been rejected successfully.' 
                            : 'Document has been verified successfully.';
                        utilityService.showSimpleToast(utilityService.getValue(data, 'message', defaultMessage));
                        $scope.backFromverify();
                    } else {
                        console.log('error need to handle here...');
                    }
                });
        };
        
        $scope.downloadExcelTypeFile = function (url){
            $window.open(url);
        };

        ////////////////////complete activation//////////////////////////////////////
        $scope.userId = $routeParams.empId;
        $scope.type = $routeParams.type;
        var self = this;
        self.value = {}; 
        self.querySearchChips = querySearchChips; 
        self.filterSelected = true;  
        $scope.segmentFieldJson = null;
        $scope.employeeList = [];  
        $scope.errorMessages = [];
        function querySearchChips(keyword) {
            return keyword ? self.allEmployees.filter(createFilterForChips(keyword)) : [];
        }
        function createFilterForChips(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(approver) {
                return (approver._lowername.indexOf(lowercaseQuery) != -1);
            };
        }
        function loadChipList() {
            var list = $scope.employeeList;
            return list.map(function (c, index) {
                c.email = '('+c.email+')'
                var object = {
                    id: c.id,
                    name: c.full_name,
                    email: c.email,
                    image: 'images/user.png'
                };
                object._lowername = object.name.toLowerCase();
                return object;
            });
        }
        $scope.resetPopups = function () {
            $(".modal-backdrop").hide();
            $('#alert-before-activation').appendTo("body").remove();
        };
        $scope.gotofields = function (obj){
            var empId = angular.isObject(obj.item._id) ? obj.item._id.$id : obj.item._id;
            $timeout(function (){            
                  $scope.resetPopups();
            },500);
            $location.url('/frontend/new-hire/profile-field').search({empId: empId, type: obj.type});
        };        
        var getAllUsers = function() {
            $scope.chipsEmp = [];
            serverUtilityService.getWebService(OnBoardingStatusService.getUrl('newEmployee'))
                .then(function(data) {
                    angular.forEach(data.data,function(v,k){
                        if(angular.isDefined(v.full_name) && v.full_name){
                            $scope.employeeList.push({
                                full_name: v.full_name,
                                id: v._id.$id,
                                email: v.employee_id
                            });
                            $scope.chipsEmp.push({
                                full_name: v.full_name,
                                id: v._id.$id,
                                email: v.employee_id
                            });
                        }
                    })
                    self.allEmployees = loadChipList();
                });
        };  
        getAllUsers();        
        $scope.getSegmentFields = function() {            
            if($scope.userId){
                var url = OnBoardingStatusService.getUrl('getProfileFields') + "/" + $scope.userId;
                serverUtilityService.getWebService(url).then(function(data) {
                    angular.forEach(data.data,function(v,k) {
                        if(v.format_type == 1 || v.field_type==10 && v.value || v.field_type == 12) {
                            v.value = v.value.toString();
                        } else if(v.field_type == 5 && v.value != "") {
                            v.value = utilityService.getDefaultDate(v.value);
                        } else if(v.field_type == 13){
                            self.value[v.slug] = [];
                            angular.forEach(self.allEmployees,function(val,ke) {
                                angular.forEach(v.value,function(id,index) {
                                    if(id == val.id){
                                        self.value[v.slug].push(val);
                                    }
                                });                                                           
                            });
                        } else if(v.field_type == 14) {
                            angular.forEach(v.child_detail,function(value,key) {
                                if(value.format_type == 1 || value.field_type == 10 && value.value) {
                                        value.value = value.value.toString();
                                    }else if(value.field_type == 5 && value.value != "") {
                                        value.value = utilityService.getDefaultDate(value.value);
                                    }
                            })
                        }
                    });
                    $scope.segmentFieldJson = data.data;
                });
            }            
        };
        $scope.getSegmentFields();
        var extractDebitCreditCtc = function (v, list) {
            angular.forEach(list, function (val, key) {
                if (v.slug == val.slug) {
                    v.value = val.value;
                }
                if (val.payout_frequency == "4") {
                    v.frequency = frequencyObj;
                }
            });
        };
        var getRemainingBalanceAndCtc = function (creditBreakup, ctcBreakup) {
            $scope.preview.totalCtc = null,
            $scope.preview.finalPreview.ctc.total_ctc = null;
            var totalGross = 0;
            var total = 0;
            angular.forEach(creditBreakup, function (v, k) {
                if (v.value_type == "6") {
                    $scope.preview.finalPreview.tempBalance = v.value;
                }
                totalGross = totalGross + v.value;
            });
            $scope.preview.finalPreview.gross = totalGross;
            angular.forEach(ctcBreakup, function (v, k) {
                total = total + v.value;

            });
            $scope.preview.finalPreview.ctc.total_ctc = totalGross + total;
            $scope.preview.finalPreview.totalCtc = totalGross + total;
        };
        var syncPreviewCallback = function (data, data1) {
            angular.forEach(data.data.credit.breakup, function (v, k) {
                extractDebitCreditCtc(v, data1.credit);
            });
            angular.forEach(data.data.debit.breakup, function (v, k) {
                extractDebitCreditCtc(v, data1.debit);
            });
            angular.forEach(data.data.ctc.breakup, function (v, k) {
                extractDebitCreditCtc(v, data1.credit);
                extractDebitCreditCtc(v, data1.debit);
            });

            $scope.preview.credit = data.data.credit.breakup;
            $scope.preview.debit = data.data.debit.breakup;
            $scope.preview.finalPreview = {
                ctc: {
                    breakup: data.data.ctc.breakup
                }
            };
            $scope.getDeductedAmount();
            getRemainingBalanceAndCtc($scope.preview.credit, $scope.preview.finalPreview.ctc.breakup);
            $timeout(function () {
                $scope.isPreviewVisible = true;
            }, 200);
        };
        var getCompensationPlanPreview = function (planId, data1) {
            $scope.preview = {
                credit: [],
                debit: [],
                finalPreview: {
                    balance: null
                }
            };
            var url = UserManagementService.getUrl('getPlanPreview') + "/" + planId;
            var payload = UserManagementService.buildBreakupPayload($scope.employeeOtherData, $scope.payroll.breakupType);
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    syncPreviewCallback(data, data1);
                });
        };        
        $scope.getSystemPlans = function() { 
            if($scope.userId){
                var url = UserManagementService.getUrl('systemPlans') + "/" + $scope.userId;
                serverUtilityService.getWebService(url).then(function(data) {
                    $scope.setupFieldJson = data.data;
                    $scope.employeeOtherData = data.employee_detail;
                    $scope.payroll.gross = utilityService.getValue(data.employee_detail, 'work_profile_compensation_gross');
                    $scope.payroll.ctc = utilityService.getValue(data.employee_detail, 'work_profile_compensation_ctc');
                    var slecttedCompensationPlan = data.data.filter(function filterBySlug(item) {
                        if (item.slug == 'system_plans_compensation_plan') {
                            return true;
                        }
                    });
                    if (slecttedCompensationPlan.length && angular.isDefined(slecttedCompensationPlan[0].selected) && slecttedCompensationPlan[0].selected) {
                        $scope.setPayrolPlanId(slecttedCompensationPlan[0].selected);
                        $scope.payroll.isEditPayrollPlan = false;
                        $scope.getStructureCreditPlanSetting(slecttedCompensationPlan[0].selected, true);
                    }else{
                        
                    }
                });
            }            
        };        
        var successCallback = function(data, section) {                
            $scope.getSegmentFields();  
            if(section=='profileFiled'){
                if($scope.isSystemPlanPermission) {
                    $scope.setTab('systemPlan');
                    $scope.getSystemPlans();
                } else {
                    $scope.backFromverify();
                }
            }
            if(section=='systemPlan'){
                $scope.backFromverify();
            }
            $scope.errorMessages = [];
            if (angular.isDefined(data.data)) {
                utilityService.showSimpleToast(data.message);
            }
        };
        var errorCallback = function (data, section) {
            $scope.errorMessages = [];
            if (data.status === "error") {
                if (angular.isArray(data.message)) {
                    angular.forEach(data.message, function (value, key) {
                        $scope.errorMessages.push(value[0]);
                    });
                } else {
                    $scope.errorMessages.push(data.message);
                }
            } else {
                $scope.errorMessages = [];
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };        
        var successErrorCallback = function (data, section) {
            data.status === "success" ? 
                successCallback(data, section) : errorCallback(data, section);
        };
        var getBalancingHeadSlug = function() {
            var slug = null;
            angular.forEach($scope.preview.credit, function(value, key) {
                if(value.value_type == "6") {
                    slug = value.slug;
                }
            });
            return slug;
        };        
        $scope.editProfileBySegmentFields = function() {
            if(angular.isDefined($scope.userId) && $scope.userId) {
                if(!$scope.isSet("systemPlan")) {
                    var url = OnBoardingStatusService.getUrl('getProfileFields') + "/" + $scope.userId;
                    var payload = UserManagementService.buildDynamicPayloadForSetupField($scope.segmentFieldJson,self);
                    serverUtilityService.putWebService(url ,payload)
                        .then(function(data) {
                            successErrorCallback(data, "profileFiled");
                            if(data.new_employee_code){
                                angular.forEach($scope.segmentFieldJson, function (v, k) {
                                    if (v.slug === 'personal_profile_employee_code') {
                                        console.log(data);
                                        console.log(utilityService.getValue(data, 'new_employee_code'));

                                        v.value = utilityService.getValue(data,'new_employee_code');
                                        v.is_disabled = v.value ? true : false;
                                    }
                                });
                            }
                        });
                } else if($scope.isSet("systemPlan")) {
                    var url = OnBoardingStatusService.getUrl('saveSystemPlan') + "/" + $scope.userId + "/" + $scope.type;
                    var payload = UserManagementService.buildDynamicPayloadForSystemField($scope.setupFieldJson);
                    payload.ctc_breakup = UserManagementService.buildCompensationPlanPayLoad($scope.preview.credit, $scope.preview.debit, $scope.preview.finalPreview.ctc.breakup);
                    payload.balancing_head_slug = getBalancingHeadSlug();
                    var payroll_frequency_settings = UserManagementService.buildCompensationPlanFrequencyPayLoad($scope.preview.credit, $scope.preview.debit, $scope.preview.finalPreview.ctc.breakup);
                    if (payroll_frequency_settings.length) {
                        payload.payroll_frequency_settings = payroll_frequency_settings;
                    }
                    if ($scope.preview.finalPreview.totalCtc > 0) {
                        payload.work_profile_compensation_ctc = $scope.preview.finalPreview.totalCtc;
                    }
                    serverUtilityService.putWebService(url ,payload)
                        .then(function(data) {
                            successErrorCallback(data, "systemPlan");                            
                        });
                }                    
            }
        };        
        $scope.triggerLetters = function (item) {
            $location.url('template-consumer').search({
                "template": '57ff718cec95751827000036', 
                "refUrl": "offer",
                isRevoke: false
            });
        };

        /***** Start Compensation Plan *****/
        $scope.payrollSettings = {
            pfList: null,
            esiList: null,
        };
        var getPfDetails = function () {
            var url = UserManagementService.getUrl('pf');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.payrollSettings.pfList = data.data;
                });
        };
        getPfDetails();
        var getEsiDetails = function () {
            var url = UserManagementService.getUrl('esi');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.payrollSettings.esiList = data.data;
                });
        };
        getEsiDetails();
        var getSalaryBreakupType = function (){
            var url = UserManagementService.getUrl('breakupSettings');
            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.payroll.breakupType = data.data.salary_breakup_from;
                    $scope.payroll.roundType = data.data.breakup_round_type;
                    $scope.payroll.roundUpto = data.data.breakup_round_upto;
                });
        };
        getSalaryBreakupType();
        
        $scope.handleFrequency = function (frequency, index, section) {
            $scope.frequency = {};
            $scope.frequencyIndex = index;
            angular.copy(frequency, $scope.frequency);
            $scope.frequency.section = section;
            $("#payout-frequency-setting-um").appendTo('body').modal('show');
        };
        $scope.setFrequency = function (section) {
            var list = section == 'credit' ? $scope.preview.credit 
                : (section == 'ctc' ? $scope.preview.finalPreview.ctc.breakup 
                    : $scope.preview.debit);
                
            angular.forEach(list, function (row, index) {
                if (index == $scope.frequencyIndex && row.payout_frequency == "4") {
                    row.frequency = $scope.frequency;
                }
            });
            $("#payout-frequency-setting-um").modal('hide');
        };
        $scope.resetKey = function (model, key) {
            if (key == 'payout_frequency') {
                if (model[key] != 2) {
                    model['payout_x_cycle_value'] = null;
                    model['on_first_payroll_cycle'] = null;
                } else if (model[key] != 3) {
                    model['once_on_x_payroll_cycle'] = null;
                    model['once_on_payroll_cycle'] = null;
                }
            } else if (key == 'once_on_payroll_cycle') {
                if (model[key] != 1) {
                    model['once_on_x_payroll_cycle'] = null;
                }
            }
        };            
        $scope.updatePaginationSettings("nhm_onboarding_status_page", $scope.onboardingStatusList.length);
        $scope.multiObj = {
            valueObj: {},
            formulaObj: {},
            discritionComponents: [],
            creditList: [],
            ctcList: [],
            debitList: [],
            gross: null,
            ctc: null
        };
        $scope.roundUpBreakup = function (calculatedValue) {
            var roundedVal;
            
            if ($scope.payroll.roundType == 1) {
                roundedVal = Math.round(calculatedValue);
            } else if ($scope.payroll.roundType == 2) {
                roundedVal = calculatedValue.toFixed(parseInt($scope.payroll.roundUpto));
            }

            return roundedVal;
        };
        $scope.togglePlanEditing = function (){
            $scope.payroll.isEditPayrollPlan = !$scope.payroll.isEditPayrollPlan;
        };
        
        $scope.setPayrolPlanId = function (planId){
            $scope.payroll.selectedPlanId = planId;
        };
        //To Calculate Deducted Amount
        $scope.getDeductedAmount = function (flag) {
            var debitTotal = 0;
            flag = angular.isDefined(flag) ? flag : false;            
            angular.forEach($scope.preview.debit, function (v, key) {
                if (v.payout_frequency == "4" && flag) {
                    v.frequency = frequencyObj;
                }
                if (angular.isDefined(v.value)) {
                    v.value = isNaN(parseFloat(v.value)) ? 0 : parseFloat(v.value);
                    debitTotal += v.value;
                }
            });
            $scope.preview.totat_deducted = $scope.roundUpBreakup(debitTotal);
        };
        
        //To Calculate Esi
        var calculateEsi = function (list, grossSum) {
            angular.forEach(list, function (component, key) {
                if ((component.slug == 'esi_employee' || component.slug == 'esi_employer') && $scope.payrollSettings.esiList.enable_esi_contribution && component.value_type == 1) {
                    var percent = component.slug == 'esi_employee' ? $scope.payrollSettings.esiList.esi_emp_contribution : $scope.payrollSettings.esiList.esi_employer_contribution;
                    var monthlyAmt = grossSum / 12;
                    if ($scope.payrollSettings.esiList.is_continue_esi_contribution == 1) {
                        if (Math.round(monthlyAmt) > $scope.payrollSettings.esiList.statutory_max_grass_amt) {
                            component.value = 0;
                            component.roundOffValue = $scope.roundUpBreakup(component.value);
                        } else {
                            component.value = grossSum * (percent / 100);
                            component.roundOffValue = $scope.roundUpBreakup(component.value);
                        }
                    } else if ($scope.payrollSettings.esiList.is_continue_esi_contribution == 2) {
                        component.value = 0;
                        component.roundOffValue = $scope.roundUpBreakup(component.value);
                    }
                }
                if ((component.slug == 'esi_employee' || component.slug == 'esi_employer') && !$scope.payrollSettings.esiList.enable_esi_contribution) {
                    component.value = 0;
                    component.roundOffValue = $scope.roundUpBreakup(component.value);
                }
            });
        };
        
        //To Calculate Balancing Head
        var calculateBalancingHead = function (gross) {
            var credit_sum = 0;
            angular.forEach($scope.preview.credit, function (component, key) {
                if (component.value_type != "6") {
                    var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                    credit_sum += val;
                }
            });
            $scope.preview.finalPreview.tempBalance = gross - credit_sum;
            $scope.preview.finalPreview.balance = $scope.preview.finalPreview.tempBalance;
            angular.forEach($scope.preview.credit, function (component, key) {
                if (component.value_type == "6") {
                    component.value = $scope.preview.finalPreview.tempBalance;
                    component.roundOffValue = $scope.roundUpBreakup(component.value);
                }
                if (component.payout_frequency == "4") {
                    component.frequency = frequencyObj;
                }
            });
        };
        //To Calculate Gross Value
        var calculateGross = function () {
            var ctc_breakup_sum = 0;
            var esiCount = 0; 
            var perquisiteSum = 0;
            $scope.perquisiteSum = 0;

            angular.forEach($scope.preview.finalPreview.ctc.breakup, function (component, key) {
                if (component.value_type == 8) {
                    var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                    perquisiteSum += val;
                } else {
                    if((component.slug == 'esi_employee' || component.slug == 'esi_employer') 
                        && component.value_type == 1){
                        esiCount += 1;
                    }
                    if (component.slug != 'esi_employee' && component.slug != 'esi_employer') {
                        var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                        if(component.slug === 'lwf_employer' && utilityService.getInnerValue($scope.statutoryCompliances, 'lwf', 'is_lwf_outside_emp_ctc')) {
                            ctc_breakup_sum += 0;
                        } else {
                            ctc_breakup_sum += val;
                        }
                    } else if((component.slug == 'esi_employee' || component.slug == 'esi_employer') && component.value_type != 1){
                        var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                        ctc_breakup_sum += val;
                    }
                }
            });

            
            $scope.perquisiteSum = parseFloat(perquisiteSum);
            // This number 1.0325 is based on employer ESI contribution and will applicable 
            // only if plan is based on CTC and having ESI as component, earlier it was 1.0475
            var gross = ($scope.preview.finalPreview.totalCtc - ctc_breakup_sum)/ 1.0325;
            var monthlyGross = gross / 12;
            // || $scope.preview.finalPreview.totalCtc > 252000
            if (!$scope.payrollSettings.esiList.enable_esi_contribution 
                || $scope.payrollSettings.esiList.is_continue_esi_contribution == 2 
                || Math.round(monthlyGross) > $scope.payrollSettings.esiList.statutory_max_grass_amt 
                || esiCount == 0) {
                gross = $scope.preview.finalPreview.totalCtc - ctc_breakup_sum;
            }

            $scope.preview.finalPreview.gross = $scope.roundUpBreakup(gross);
            if ($scope.perquisiteSum > 0) {
                $scope.preview.finalPreview.gross = $scope.preview.finalPreview.gross - $scope.perquisiteSum;
            }
            //console.log($scope.preview.finalPreview.gross, $scope.perquisiteSum);

            calculateEsi($scope.preview.finalPreview.ctc.breakup, gross);
            calculateEsi($scope.preview.debit, gross);
            calculateBalancingHead(gross - perquisiteSum);
        };
        
        //To Calculate CTC Value
        var calculateCtc = function (gross){
            var ctc_breakup_sum = 0;
            
            angular.forEach($scope.preview.finalPreview.ctc.breakup, function (component, key) {
                var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                if(component.slug === 'lwf_employer' && utilityService.getInnerValue($scope.statutoryCompliances, 'lwf', 'is_lwf_outside_emp_ctc')) {
                    ctc_breakup_sum += 0;
                } else {
                    ctc_breakup_sum += val;
                }
            });

            $scope.preview.finalPreview.totalCtc = $scope.roundUpBreakup(ctc_breakup_sum + parseFloat(gross));
        };   
        
       //To Extract All Component Used in Formula
        var extractword = function (str, start, end, strtSrchIndex) {
            var startindex = str.indexOf(start, strtSrchIndex);
            var endindex = str.indexOf(end, startindex);
            strtSrchIndex = endindex + 1;
            if (startindex != -1 && endindex != -1 && endindex > startindex) {
                var slug = str.substring(startindex + 1, endindex);
                var i = $.inArray(slug, $scope.compArray);
                if (i < 0) {
                    $scope.compArray.push(slug);
                }
                extractword(str, "{", "}", strtSrchIndex);
            } else {

                return $scope.compArray;
            }
        };
        
        //To Create Breakup List
        var createList = function (list, collection, settingKey, syncFlag) {
            
            angular.forEach(list, function (val, key) {


                if(syncFlag && angular.isDefined($scope.employeeOtherData.ctc_breakup) 
                    && angular.isDefined($scope.employeeOtherData.ctc_breakup[val.slug])
                    && angular.isDefined(val[settingKey])) {
                    val[settingKey].value = $scope.employeeOtherData.ctc_breakup[val.slug];
                    val[settingKey].is_arrear_component = utilityService.getValue(val, 'is_arrear_component', false);
                }                
                if (angular.isDefined(val[settingKey]) && val[settingKey].is_applicable) {
                    val[settingKey]['is_part_CTC'] = val.is_part_CTC;
                    val[settingKey]['is_part_Gross'] = val.is_part_Gross;
                    val[settingKey]['is_arrear_component'] = utilityService.getValue(val, 'is_arrear_component', false);
                    if (val[settingKey].value_type == 2) {
                        val[settingKey].value = parseInt(val[settingKey].costant_value);
                        val[settingKey].roundOffValue = val[settingKey].value;
                        val[settingKey].isValue = true;
                    } else if (val[settingKey].value_type == 1) {
                        $scope.compArray = [];
                        if (angular.isDefined(val[settingKey].value) && val[settingKey].value != null) {
                            val[settingKey].isValue = true;
                            val[settingKey].roundOffValue = syncFlag ? val[settingKey].value : $scope.roundUpBreakup(val[settingKey].value);
                        } else {
                            val[settingKey].value = null;
                            val[settingKey].roundOffValue = null;
                            val[settingKey].isValue = false;
                        }
                        var compArry = extractword(val[settingKey].formula, "{", "}", 0);
                        val[settingKey].tempFormula = val[settingKey].formula;
                        val[settingKey].formulaArray = $scope.compArray;
                        val[settingKey].discritionFormula = val[settingKey].formula;
                        $scope.multiObj.formulaObj[val.slug] = val[settingKey].formula;
                    } else if (val[settingKey].value_type == 6) {
                        val[settingKey].isValue = true;
                        if (angular.isDefined(val[settingKey].value) && val[settingKey].value != null) {
                            val[settingKey].roundOffValue = syncFlag ? val[settingKey].value : $scope.roundUpBreakup(val[settingKey].value);
                        }
                    } else {
                        val[settingKey].isValue = true;
                        val[settingKey].value =  angular.isDefined(val[settingKey].value) ? val[settingKey].value : 0;
                        val[settingKey].roundOffValue = syncFlag ? val[settingKey].value : $scope.roundUpBreakup(val[settingKey].value);
                    }
                    if (val[settingKey].value_type == 4 || val[settingKey].value_type == 8) {
                        $scope.multiObj.discritionComponents.push(val.slug);
                    }
                    $scope.multiObj.valueObj[val.slug] = val[settingKey].value;
                    if (val.is_part_Gross) {
                        collection.push(val[settingKey]);
                    } else {
                        $scope.multiObj.ctcList.push(val[settingKey]);
                    }
                }

                /***** Start LWF & PT Calculation Section *****/
                if (!utilityService.getInnerValue($scope.generateBreakup, "error", "status")) {                    
                    if (val.slug === 'lwf_employee' && angular.isDefined(val[settingKey])) {
                        val[settingKey].value = utilityService.getInnerValue($scope.statutoryCompliances, "lwf", val.slug);
                    }

                    if (val.slug === 'lwf_employer' && angular.isDefined(val[settingKey])) {
                        val[settingKey].value = utilityService.getInnerValue($scope.statutoryCompliances, "lwf", val.slug);
                    }

                    if (val.slug === 'professional_tax' && angular.isDefined(val[settingKey])) {  
                        var grossToCalculatePT = $scope.payroll.gross;
                        if($scope.payroll.breakupType == 2 && grossToCalculatePT == 0)  {
                            grossToCalculatePT = $scope.payroll.ctc;
                        }
                        val[settingKey].value = UserManagementService.getProfessionalTaxAmount(grossToCalculatePT, $scope.statutoryCompliances.pt);
                    }                    
                }
                /***** End LWF & PT Calculation Section *****/
            });
        };

         //To Evaluate Formula 
         var multipleFormulaCalculation = function (flag, syncFlag, discrtionItem) {
            flag = angular.isDefined(flag) ? flag : false;
            if (!flag && angular.isDefined(discrtionItem)) {
                $scope.multiObj.valueObj[discrtionItem.slug] = discrtionItem.value == null ? 0 : discrtionItem.value;
            }

            function ExtractFormulaName (str) {
                var regexToExtract = /[^{\}]+(?=})/g;
                var ExtractedValue = str.match(regexToExtract);
                return ExtractedValue[0] ? ExtractedValue[0] : null;
            }

            function evaluateFormula(item) {
                $scope.compArray = [];
                var discritionFlag = false;
                var slugValObj = {};
                
                if (flag && $window._.intersection($scope.multiObj.discritionComponents, item.formulaArray).length > 0) {
                    angular.forEach($scope.multiObj.formulaObj, function (val, key) {
                        if (item.discritionFormula.indexOf('{' + key + '}') > -1) {
                            item.discritionFormula = item.discritionFormula.replace('{' + key + '}', '(' + val + ')');
                        }
                    });
                    var compArry = extractword(item.discritionFormula, "{", "}", 0);
                    item.formulaArray = $scope.compArray;
                    item.isConsistDiscition = true;
                } else if ($scope.isValueAffectedByStatutory && $scope.multiObj.valueObj[ExtractFormulaName(item.formula)]) {
                    item.tempFormula = item.formula.replace('{' + ExtractFormulaName(item.formula) + '}', '(' + $scope.multiObj.valueObj[ExtractFormulaName(item.formula)] + ')')
                    $scope.isValueAffectedByStatutory = false;
                } else {
                    angular.forEach($scope.multiObj.formulaObj, function (val, key) {
                        if (item.tempFormula.indexOf('{' + key + '}') > -1) {
                            item.tempFormula = item.tempFormula.replace('{' + key + '}', '(' + val + ')');
                        }
                    });
                    var compArry = extractword(item.tempFormula, "{", "}", 0);
                    item.formulaArray = $scope.compArray;
                }
                if (!flag) {
                    var discrtionFormula = item.tempFormula;
                }
                for (var i = 0; i < item.formulaArray.length; i++) {
                    if ($scope.multiObj.discritionComponents.indexOf(item.formulaArray[i]) != -1 && $scope.multiObj.valueObj[item.formulaArray[i]] == 0) {
                        item.isValue = true;
                        item.isConsistDiscition = true;
                        if (flag) {
                            discritionFlag = true;
                            break;
                        }
                    }
                    if (angular.isDefined($scope.multiObj.valueObj[item.formulaArray[i]]) && ($scope.multiObj.valueObj[item.formulaArray[i]] || $scope.multiObj.valueObj[item.formulaArray[i]] ==0)) {
                        slugValObj[item.formulaArray[i]] = $scope.multiObj.valueObj[item.formulaArray[i]];
                        var find = '{' + item.formulaArray[i] + '}';
                        var regex = new RegExp(find, 'g');
                        if (!flag) {
                            discrtionFormula = discrtionFormula.replace(regex, $scope.multiObj.valueObj[item.formulaArray[i]]);
                        } else if($window._.intersection($scope.multiObj.discritionComponents, item.formulaArray).length > 0){
                            item.discritionFormula = item.discritionFormula.replace(regex, $scope.multiObj.valueObj[item.formulaArray[i]]);
                        } else {
                            item.tempFormula = item.tempFormula.replace(regex, $scope.multiObj.valueObj[item.formulaArray[i]]);
                        }
                    }
                }


                if (discritionFlag) {
                    return false;
                }

                if (Object.keys(slugValObj).length == item.formulaArray.length) {

                    item.isValue = true;
                    if (!flag) {
                        var newValue = $scope.$eval(discrtionFormula);
                    } else if ($window._.intersection($scope.multiObj.discritionComponents, item.formulaArray).length > 0 && flag) {
                        newValue = $scope.$eval(item.discritionFormula)
                    } else {
                        newValue = $scope.$eval(item.tempFormula);
                    }
                    if (!$scope.norLankaFlag) {
                        if ((item.slug == "pf_employee_applicable" || item.slug == "pf_employer_applicable") 
                            && $scope.payrollSettings.pfList.enable_pf_contribution) {
								
							if (utilityService.getInnerValue($scope.payrollSettings, 'pfList', 'pf_statutory_minimum_relation') == 2 ) {
                                if(!!utilityService.getValue(item, "statutory_max_value") 
                                   && newValue >= utilityService.getValue(item, "statutory_max_value")) {
                                  newValue = utilityService.getValue(item, "statutory_max_value");
                                }
                            } else {
								console.log(newValue)
                              var monthlyAmt = newValue;
                              if ( Math.round(monthlyAmt) > $scope.payrollSettings.pfList.statutory_min_amt) {
                                newValue = 21600;
                              }
                            }
                          }
                          if ((item.slug == "pf_employee_applicable" ||
                              item.slug == "pf_employer_applicable") &&
                            !$scope.payrollSettings.pfList.enable_pf_contribution ) {
                            newValue = 0;
                          }                     
                    }


                    if(utilityService.getValue(item, 'statutory_min_value')){
                        var totalAmount = newValue;
                        var minAmount = utilityService.getValue(item, 'statutory_min_value') 
                        newValue =  totalAmount < minAmount ? minAmount : totalAmount;
                        $scope.isValueAffectedByStatutory = true;
                    }

                    if(utilityService.getValue(item, 'statutory_max_value')){
                        var totalAmount = newValue;
                        var maxAmount = utilityService.getValue(item, 'statutory_max_value') 
                        newValue =  totalAmount > maxAmount ? maxAmount : totalAmount;
                        $scope.isValueAffectedByStatutory = true;
                    }



                    item.value = newValue;
                    item.roundOffValue = $scope.roundUpBreakup(newValue);
                    $scope.multiObj.valueObj[item.slug] = newValue;
                }
            };            
            //To Calculate Formula
            function calculateValue(credit, debit, ctc) {
                var creditCount = 0;
                var debitCount = 0;
                var ctcCount = 0;
                angular.forEach(credit, function (val, key) {
                    if (val.value_type == 1) {
                        if (!flag && val.isConsistDiscition) {
                            evaluateFormula(val);
                        } else if(flag) {
                            evaluateFormula(val);
                        }
                    }
                    if (val.isValue) {
                        creditCount += 1;
                    }
                });
                angular.forEach(debit, function (val, key) {
                    if (val.value_type == 1) {
                        if (!flag && val.isConsistDiscition) {
                            evaluateFormula(val);
                        } else if(flag) {
                            evaluateFormula(val);
                        }
                    }
                    if (val.isValue) {
                        debitCount += 1;
                    }
                });
                angular.forEach(ctc, function (val, key) {
                    if (val.value_type == 1) {
                       if (!flag && val.isConsistDiscition) {
                            evaluateFormula(val);
                        } else if(flag) {
                            evaluateFormula(val);
                        }
                    }
                    if (val.isValue) {
                        ctcCount += 1;
                    }
                });
                if (creditCount != credit.length || debitCount != debit.length || ctcCount != ctc.length) {
                    calculateValue($scope.multiObj.creditList, $scope.multiObj.debitList, $scope.multiObj.ctcList)
                } else {
                    return 1;
                }
            };
            // For perquisite type compenent, no need to caluculate value because its similar to admin discretion
            if (!syncFlag && utilityService.getValue(discrtionItem, 'value_type') != 8) {
                calculateValue($scope.multiObj.creditList, $scope.multiObj.debitList, $scope.multiObj.ctcList);
            }
            $scope.preview.credit = $scope.multiObj.creditList;
            $scope.preview.debit = $scope.multiObj.debitList;
            $scope.preview.finalPreview.ctc.breakup = $scope.multiObj.ctcList;
            
            if ($scope.payroll.breakupType == 1) {
                if (!syncFlag) {
                    calculateBalancingHead($scope.multiObj.gross);
                    calculateEsi($scope.preview.finalPreview.ctc.breakup, $scope.multiObj.gross);
                    calculateEsi($scope.preview.debit, $scope.multiObj.gross);
                    calculateCtc($scope.multiObj.gross);
                    $scope.payroll.ctc = $scope.preview.finalPreview.totalCtc;
                }
            }
            
            if ($scope.payroll.breakupType == 2 && !syncFlag) {
                calculateGross();
                $scope.payroll.gross = $scope.preview.finalPreview.gross;                
            }   

            /*** When Compensation plan is selected Start ***/
            if (syncFlag) {
                var credit_breakup_sum = 0;
                angular.forEach($scope.preview.credit, function (component, key) {
                    var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                    credit_breakup_sum += val;
 
                    if (component.value_type == "6") {
                        $scope.preview.finalPreview.balance = val;
                    }
                });
                $scope.preview.finalPreview.gross = $scope.roundUpBreakup(utilityService.getValue($scope.payroll, 'gross'), 0);
                calculateCtc($scope.preview.finalPreview.gross);
            }

            /*** When Compensation plan is selected End ***/
            $scope.getDeductedAmount();
            $timeout(function () {
                $scope.payroll.visible = true;
                $scope.isPreviewVisible = true;
            }, 200);
        };   
        var createSalaryStructure = function (creditList, debitList, syncFlag) {
            $scope.isPreviewVisible = false;
            $scope.preview.credit = [];
            $scope.preview.debit = [];
            $scope.preview.finalPreview.ctc = {};
            $scope.multiObj = {
                valueObj: {},
                formulaObj: {},
                discritionComponents: [],
                creditList: [],
                ctcList: [],
                debitList: [],
                gross: null,
                ctc: null
            };
            if ($scope.payroll.breakupType == 2) {
                $scope.multiObj.ctc = $scope.payroll.ctc
                $scope.multiObj.valueObj.work_profile_compensation_ctc = $scope.multiObj.ctc;
                $scope.preview.finalPreview.totalCtc = $scope.multiObj.ctc;
            }
            if ($scope.payroll.breakupType == 1) {
                $scope.multiObj.gross = $scope.payroll.gross;
                $scope.multiObj.valueObj.gross = $scope.multiObj.gross;
                $scope.preview.finalPreview.gross = $scope.multiObj.gross;
            }
            createList(debitList, $scope.multiObj.debitList, 'debit_structure_settings', syncFlag);
            createList(creditList, $scope.multiObj.creditList, 'credit_structure_settings', syncFlag);
            multipleFormulaCalculation(true, syncFlag);
        };        
        $scope.getStructureCreditPlanSetting = function (planId, syncFlag) {
            syncFlag = angular.isDefined(syncFlag) ? syncFlag : false;
            $q.all([
                serverUtilityService.getWebService(UserManagementService.getUrl('creditStructure') + "/" + planId),
                serverUtilityService.getWebService(UserManagementService.getUrl('debitStructure') + "/" + planId),
            ]).then(function (data) {
                createSalaryStructure(data[0].data, data[1].data, syncFlag);
            });
        };        
        $scope.formulaCalculation = function (item) {
            multipleFormulaCalculation(false, false, item);
        };
        var getCountryDialCodeList = function() {
            var url = OnBoardingStatusService.getUrl('countryDialCodes');
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.countryDialCode.list = utilityService.getValue(data, 'data');
                });
        };
        getCountryDialCodeList();
        var viewAssetAttrubutesCallback = function (list, pro) {
            var assetObject = null,
                attributes = [],
                attributesWithValue = {};

            angular.forEach(list, function (value, key) {
                if (pro.type_id == value.provision_type_id) {
                    assetObject = value;
                }
            });

            attributes = utilityService.getInnerValue(assetObject, 'provision_type_data', 'attributes');

            angular.forEach(attributes, function (value, key) {
                attributesWithValue[value._id.$id] = {};
                attributesWithValue[value._id.$id].attr_name = value.attribute_name;
                attributesWithValue[value._id.$id].attr_value = null;
            });

            angular.forEach(utilityService.getValue(assetObject, 'provisions', []), function (value, key) {
                angular.forEach(utilityService.getValue(value, 'attributes', []), function (v, k) {
                    attributesWithValue[k].attr_value = v;
                });
            });

            $scope.assetAttributes.asset.name = utilityService.getValue(pro, 'name');
            $scope.assetAttributes.list = attributesWithValue;
            $scope.openModal('view-asset-attributes.html', 'assetAttributes');
        };
        $scope.viewAssetAttrubutes = function (item, pro) {
            var url = OnBoardingStatusService.getUrl('assetAttributes') + "/" 
                + utilityService.getInnerValue(item, 'candidate_detail', '_id');

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    viewAssetAttrubutesCallback(utilityService.getValue(data, 'data', []), pro);
                });
        };
        
        /***** Start Angular Modal Section *****/
        $scope.openModal = function(templateUrl, instance, size) {
            size = size || 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass : 'fadeEffect',
                size: size,
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        /***** End Angular Modal Section *****/

        /***** Start: Auto Fill Employee Code *****/
        var autoFillEmployeeCode = function (isAutoFill, data) {
            angular.forEach($scope.segmentFieldJson, function (v, k) {
                if (v.slug === 'personal_profile_employee_code') {
                    if (isAutoFill) {
                        v.value = utilityService.getInnerValue(data, 'data', 'employee_code');
                    }                    
                    v.is_disabled = v.value ? true : false;
                }
            });
        };
        var getEmployeeCode = function(elementId) {
            elementId = angular.isDefined(elementId) ? elementId : null;
            var url = UserManagementService.getUrl('previousEmpCode');
            if (elementId) {
                url = url + "/" + elementId;
            }
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.employeeCode = utilityService.getValue(data, 'data');
                    autoFillEmployeeCode(utilityService.getInnerValue(data, 'data', 'auto_fill'), data);
                });
        };
        getEmployeeCode();
        $scope.mandatoryGroupChangeHandler = function (elementId) {
            getEmployeeCode(elementId);
        };

        $scope.changeOnboardingStatusList = function (value) {
            var hashMap = {
                all: '?is_all=true',
                pending: ''
            }
            getOnBoardingStatusList(hashMap[value])
        }


        $scope.rejectForm = function (){
            $scope.openModal('rejectionComment.tmpl.html', 'rejectionComment');
        };

        $scope.downloadForm = function() {
            var url = $scope.docToverify.downloadUrl;
            $window.open(url);
        }
        
        /***** End: Auto Fill Employee Code *****/

        var lwfndPTCallback = function (data) {
            var lwfEnabled = utilityService.getInnerValue(data[2], 'data', 'lwf_deduction', false),
                ptEnabled = utilityService.getInnerValue(data[3], 'data', 'pt_deduction', false);

            // NOTE: If either lwf or pt setting is enabled from payroll setup, 
            // then only caluculate lwf & pt
            if (lwfEnabled || ptEnabled) {
                $scope.generateBreakup.error.status = utilityService.getValue(data[0], "status") === "error" 
                    || utilityService.getValue(data[1], "status") === "error";
                
                if ($scope.generateBreakup.error.status) {
                    $scope.generateBreakup.error.message = utilityService.getValue(data[0], "message");
                } else {
                    $scope.statutoryCompliances.lwf = utilityService.getValue(data[0], "data");
                    if (utilityService.getValue($scope.statutoryCompliances, "lwf")) { 
                        $scope.statutoryCompliances.lwf.lwf_employee = utilityService.getInnerValue($scope.statutoryCompliances, "lwf", "employee", 0);
                        $scope.statutoryCompliances.lwf.lwf_employer = utilityService.getInnerValue($scope.statutoryCompliances, "lwf", "employer", 0);
                    }                
                    $scope.statutoryCompliances.pt = utilityService.getValue(data[1], "data", []);
                }
            } else {
                $scope.generateBreakup.error.status = false;
                $scope.generateBreakup.error.message = null;
            }                        
        };
        $scope.getLWFndPTSetting = function () {
            var lwfUrl = UserManagementService.getUrl('lwf') + "/" + utilityService.getValue($routeParams, "id"),
                ptUrl = UserManagementService.getUrl('pt') + "/" + utilityService.getValue($routeParams, "id"),
                lwfSettingUrl = UserManagementService.getUrl('lwfSetting'),
                ptSettingUrl = UserManagementService.getUrl('ptSetting')
            $q.all([
                serverUtilityService.getWebService(lwfUrl),
                serverUtilityService.getWebService(ptUrl),
                serverUtilityService.getWebService(lwfSettingUrl),
                serverUtilityService.getWebService(ptSettingUrl)
            ]).then(function (data) {
                lwfndPTCallback(data);
            });
        };
        if ($scope.userId && !$scope.isSystemPlanActive) {
            $scope.getLWFndPTSetting();
        }

        $scope.onboardingProfile = {
            profiledetail : null,
            visible : false
        }

        $scope.boardingProfileDetail = function(userid) {
            $scope.onboardingProfile.visible = false;
            $scope.openModal('view-onboarding-profile-detail.html', 'onBoardingProfileDetail');
            var url = OnBoardingStatusService.getUrl('profileOnboarding') + "/" + userid;
            serverUtilityService.getWebService(url).then(function (data){
                $scope.onboardingProfile.profiledetail = data.data;
                $scope.onboardingProfile.visible = true;
            });
        }

        $scope.boardingDocumentUpload = function(userid) {
            $location.url('frontend/new-hire/filedoc').search({"id":userid});
        }

        /***** Start: Search by employee name and code section */
        $scope.usermanagent = {
            searchKey: 'full_name',
            searchText: 'Search by Candidate Name'
        };
        $scope.changeSearchTextHandler = function (search) {
            $scope.name_filter = {};
            $scope.usermanagent.searchText = search == 'applicant_id'
                ? 'Search by Applicant ID' : 'Search by Candidate Name';
        };
        /***** End: Search by employee name and code section */

        $scope.downloadLetter = function (empId){
            var url = OnBoardingStatusService.getUrl('downloadLetter') + '/' + empId;
            $window.open(url);
        }; 

    }
]);