app.controller('NewHireManagementController', [
    '$scope','$routeParams','$location', '$timeout', 'NewHireManagementService', 'utilityService', 'ServerUtilityService', 'Upload', '$rootScope', '$mdDialog',  
    function ($scope, $routeParams, $location, $timeout, NewHireManagementService, utilityService, serverUtilityService, Upload, $rootScope, $mdDialog) {
        var refUrl = 'offer',
            self = this, lastSearch;

        self.simulateQuery = false;
        self.querySearch = querySearch;
        self.sugnAuthQuerySearch = sugnAuthQuerySearch;
        self.revokeSignAuthQuerySearch = revokeSignAuthQuerySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;        
        self.contacts = [];
        self.value = {};
        self.querySearchChips = querySearchChips;

        $scope.template = {
            body : "not yet defined"
        };  
        $scope.pattern = {
            email: /^[a-zA-Z0-9-]+[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.-]{2,20}$/,
            alphaNumeric: /^[0-9a-zA-Z \b]+$/
        };
        $scope.candidateId = utilityService.getStorageValue('candidateId');
        $scope.module_key = 'prejoining';
        $scope.newHire = NewHireManagementService.buildNewHire();
        $scope.model = {
            signatory : null
        };
        $scope.revoke = {
            signatory : null,
            templateId : null
        };
        $scope.verifiedStep = 1;
        $scope.wizardFlag = "offer-status";        
        $scope.makeVisible = false;
        $scope.apiError = utilityService.buildAPIErrorObject();
        $scope.errorMessages = [];  
        $scope.usersIncluded = [];
        $scope.employeeList = [];
        $scope.lettersList = [];
        $rootScope.childElements = null;
        $scope.isSystemPlanPermission = true;
        $scope.wizard = {
            "initate": true,
            "offerletter": false,
            "finalizeOffer": false
        };
        $scope.sendOfferWizard = {
            1: false,
            2: true,
            3: true
        };
        $scope.newhire = {
            listVisible: false,
            formVisible: false,
            selectedToBoard: 0,
            filteredList: [],
            permission: {
                canViewOthersOfferLetter: false,
                slug: 'can_view_others_offer_letter'
            }
        };
        $scope.sendOfferWizardHashMap = {
            1: "initate",
            2: "offerletter",
            3: "finalizeOffer"
        };        
        $scope.todaysDate = new Date();
        $scope.countryDialCode = {
            list: []
        };

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

        var setVerifiedStep = function(flag) {
            flag = angular.isDefined(flag) ? flag : false;
            var verifiedStep = parseInt($scope.verifiedStep, 10) + 1;
            angular.forEach($scope.sendOfferWizard, function(value, key) {
                $scope.sendOfferWizard[key] = (parseInt(key, 10) <= verifiedStep) ? false :  true;
            });
        };
        var getVerifiedStep = function(verified_step) {
            $scope.verifiedStep = angular.isDefined(verified_step) && verified_step ? verified_step : 1;
        };

        /***** filter *****/
        $scope.offerLetterStatusObject = NewHireManagementService.buildOfferLetterStatus();
        $scope.acceptanceStatusObject = NewHireManagementService.buildAcceptanceStatus();
        $scope.initDate = {
            from: null,
            to: null 
        };
        $scope.lastDate = {
            from: null,
            to: null 
        };
        $scope.groupObject = {};
        $scope.elementObject = {};
        $scope.offerLetterStatusIncludes = [];

        $scope.wizardSetting = function(item, page){
            if (item == 'offer-status') {
                getCandidateList();
            }
            $scope.wizardFlag = item;    
            $scope.updatePaginationSettings(page);
            $scope.resetAllTypeFilters();
        };

        var verifyActivateEmployee = function(objpermission) {
            angular.forEach(objpermission, function(v,k) {
                if(v.permission_slug === 'can_not_activate_employee') {
                    $scope.isSystemPlanPermission = false;
                }
            });
        }

        var getPermission = function () {
            var url = NewHireManagementService.getUrl('modulePermission') + "/all";
            serverUtilityService.getWebService(url)
                .then(function (data){
                    verifyActivateEmployee(data.data);
                });
        };
        getPermission();

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

        /************ Start filter Section *************/
        $scope.setWizard = function (action, moveNext) {
            moveNext = angular.isDefined(moveNext) ? moveNext : false;
            if(action != "initate" 
                && (!$scope.candidateId || !$scope.verifiedStep || $scope.verifiedStep < 1)
                && !moveNext) {
                return false;
            }                

            angular.forEach($scope.wizard, function (key, value) {
                $scope.wizard[value] = false;
            });
            $scope.wizard[action] = true;
        };

        var getAllUsers = function() {
            $scope.chipsEmp = [];
            serverUtilityService.getWebService(NewHireManagementService.getUrl('newEmployee'))
                .then(function(data) {
                    angular.forEach(data.data,function(v,k){
                        if(angular.isDefined(v.full_name) && v.full_name){
                            $scope.employeeList.push({
                                full_name: v.full_name,
                                id: v._id.$id,
                                image: v.employee_preview.profile_pic ? v.employee_preview.profile_pic : "../../images/no-avatar.png"
                            });
                            $scope.chipsEmp.push({
                                full_name: v.full_name,
                                id: v._id.$id,
                                image: v.employee_preview.profile_pic ? v.employee_preview.profile_pic : "../../images/no-avatar.png"                        });
                        }
                    })
                    self.allSignAuth = loadAll();
                    self.allEmployees = loadChipList();
                });
        };  
        getAllUsers();

        $scope.candidateList = [];
        var allFilterObject = [{countObject: 'group',isGroup: true, collection_key:'candidate_detail'}];
        var getCandidateList = function () {
            $scope.resetFacadeCountObject(allFilterObject);
            var url = NewHireManagementService.getUrl('candidates');
            payload = { start: ($scope.formatDate($scope.time.startDate)), end : ($scope.formatDate($scope.time.endDate)) };
            serverUtilityService.getWebService(url, payload).then(function (data) {  
                angular.forEach(data.data,function(v,k){
                    v.full_name =  angular.isDefined(v.candidate_detail) && v.candidate_detail.full_name ? v.candidate_detail.full_name : '';
                    v.joining_date = v.work_profile_joining_date;
                    v.joiningDateTimestamp = v.work_profile_joining_date ? utilityService.getDefaultDate(v.work_profile_joining_date, false, true).getTime() : 0;
                    v.creationDateTimestamp = v.creation_date ? utilityService.getDefaultDate(v.creation_date, false, true).getTime() : 0;
                    $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject, v);
                });
                $scope.candidateList = data.data;
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                $scope.newhire.listVisible = true;
            });
        };
        getCandidateList();
        /*$scope.draftCandidateList = [];
        var getDraftCandidateList = function () {
            var url = NewHireManagementService.getUrl('draftCandidates');
            payload = { start: ($scope.formatDate($scope.time.startDate)), end : ($scope.formatDate($scope.time.endDate)) };
            serverUtilityService.getWebService(url, payload).then(function (data) {
                angular.forEach(data.data, function (v, k){
                    v.isChecked = false;
                });
                $scope.draftCandidateList = data.data;
            });
        };
        getDraftCandidateList();*/

        $scope.setQueryNewvalue = function() {
            if($scope.time.endDate != null) {
                getCandidateList();
            } 
        }

        /************ Start Pre-join backend fields *************/
        $scope.associatedProfileFields = [];
        var getAssociatedProfileFields = function () {
            var url = NewHireManagementService.getUrl('associateFields');
            serverUtilityService.getWebService(url).then(function (data) {
            });
        };
        getAssociatedProfileFields();
        var getSettingDetails = function () {
            var url = NewHireManagementService.getUrl('settings');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.preJoinList = data.data;
                var list = [];
                angular.copy($scope.preJoinList, list);
            });
        };
        getSettingDetails();
        /************ End Pre-join backend fields *************/

        $scope.isAll = {
            flag: false
        };
        $scope.selectDesectUser = function(isAll) {
            var count = 0;
            angular.forEach($scope.candidateList, function (value, key) {
                for(var i=0; i< $scope.newhire.filteredList.length; i++){
                    if(value._id == $scope.newhire.filteredList[i]._id &&  !value.is_onboarding && value.is_fresh_record){
                        value.isChecked = isAll;
                        break;
                    }
                }
                if (value.isChecked) {
                    count += 1;
                }
            });
            $scope.isAll.flag= count == 0 ? false : isAll;
            $scope.newhire.selectedToBoard =  count;
        };
        $scope.updateCount = function () {
            var count1 = 0,
                count2 = 0;

            angular.forEach($scope.candidateList, function (value, key) {
                if (value.isChecked) {
                    count1 += 1;
                }
                if(value.is_onboarding){
                    count2 += 1;
                }
            }); 
            $scope.newhire.selectedToBoard =  count1;
            $scope.isAll.flag = (count1 == $scope.candidateList.length - count2) ? true : false;
        };
        $scope.sendToOnboarding = function (isIndividual, candidate, event) {
            // candidate.is_fresh_record = false
            if(!candidate.is_fresh_record) {
                showAlert(event, "Please assign mandatory group field values to the candidate by editing the profile. 'Start Onboarding' button would only activate once the above step is completed")
                return false;
            }
            isIndividual = isIndividual || false;
            candidate = candidate || null;

            var url =  NewHireManagementService.getUrl('sendToOnboarding'),
                payload ={
                    candidate_ids: []
                };

            if(isIndividual) {
                payload.candidate_ids.push(candidate._id);
            } else {
                angular.forEach($scope.candidateList, function (value, key) {
                    if (value.isChecked) {
                        payload.candidate_ids.push(value._id);
                    }
                });
            }

            serverUtilityService.putWebService(url, payload)
                .then(function (data){
                    if(data.status == "success"){
                        utilityService.showSimpleToast(data.message);
                        $scope.selectDesectUser(false);
                        $scope.wizardSetting('onboarding-task');
                    }
                });
        };
        var getLettersList = function () {
            var url = NewHireManagementService.getUrl('letterWithTemp');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.lettersList = data.data;
                    var listofAllOfferLetters = [],
                        listofAllRevokeLetters = [];

                    angular.forEach($scope.lettersList,function(v,k){
                        if(v._id == 2){
                            listofAllOfferLetters = v.templates;
                        }
                        if(v._id == 3){
                            listofAllRevokeLetters = v.templates;
                        }
                    });
                    $scope.templateList = listofAllOfferLetters;
                    $scope.revokeList = listofAllRevokeLetters;
                });
        };
        getLettersList();
        var getSetupFieldJson = function() {
            serverUtilityService.getWebService(NewHireManagementService.getUrl('associate_fields')) .then(function(data) {
                angular.forEach(data.data, function (v, k){
                    if(v.field_type == 13){
                        self.value[v.slug] = [];
                    }
                });
                $scope.triggerOfferJson = data.data;
                $scope.newhire.formVisible = true;
            });
        }; 
        $scope.offerLetterSignAuth = [];
        var getSpecificCandidateDetail = function(flag) {
            flag = angular.isDefined(flag) ? flag : false;
            if ($scope.candidateId) {
                var url = NewHireManagementService.getUrl('associate_fields') + "/" + $scope.candidateId;
                serverUtilityService.getWebService(url)
                    .then(function(data){
                        self.contacts = [];
                        $scope.newHire = NewHireManagementService.buildNewHire();
                        angular.forEach(utilityService.getInnerValue(data, 'data', 'associate_fields', []), function(v, k) {
                            if(v.format_type == 1 || v.field_type==10 || v.field_type==12) {
                                v.value = v.value.toString();
                            } else if(v.field_type == 5 && v.value != "") {
                                v.value = utilityService.getDefaultDate(v.value);
                            } else if(v.field_type == 13) {
                                self.value[v.slug] = [];
                                angular.forEach(self.allEmployees,function(val,ke) {
                                    angular.forEach(v.value,function(id,index) {
                                        if(id == val.id) {
                                            self.value[v.slug].push(val);
                                        }
                                    });                                                               
                                });
                            } else if(v.field_type == 14) {
                                angular.forEach(v.child_detail,function(value,key) {
                                    if(value.format_type == 1 || value.field_type == 10 && value.value != "") {
                                        value.value = value.value.toString();
                                    } else if(value.field_type == 5 && value.value != "") {
                                        value.value = utilityService.getDefaultDate(value.value);
                                    }
                                });
                            }
                        })
                        $scope.triggerOfferJson = data.data.associate_fields;
                        if(data.data.offer_letter){
                            $scope.newHire.isDocumentUploaded = true; 
                            $scope.newHire.isLoaded = true;
                            $scope.newHire.file_name = data.data.offer_letter;
                        }
                        $scope.email.body = data.data.email_message;
                        $scope.email.subject = data.data.email_subject;
                        if (data.status == "success") {
                            $scope.newhire.formVisible = true;
                        }                        
                    });
            } else {
                getSetupFieldJson();
            }
        };
        getSpecificCandidateDetail();
        $scope.setChild = function(item) {
            $scope.childElements =  item;
        };
        $scope.editCandidate = function(candidate, key) {           
            utilityService.setStorageValue('candidateId', candidate[key]);
            $scope.candidateId = candidate[key];
            getSpecificCandidateDetail(true);
            $scope.verifiedStep = 1;
            $location.url('frontend/new-hire/offer').search({"id":candidate[key]});
        };

        $scope.getDetail = function(id){
            $location.url('frontend/new-hire/detail').search({"id":id});
        };

        $scope.sendReminder = function(master, slave, action){
            var url = NewHireManagementService.getUrl('sendReminder');
            if(action == 1) {
                var payload = {
                    master_emp_id : master.candidate_id,
                    slave_emp_id : slave,
                    type : 1
                };
            } else if(action == 2) {
                var payload = {
                    master_emp_id : master.candidate_id,
                    slave_emp_id : master.candidate_id,
                    type : 2
                };
            }
            serverUtilityService.postWebService(url, payload)
                .then(function(data){
                    if(data.status == "success"){
                        utilityService.showSimpleToast(data.message);
                    }
                });
        };
        var selectRemoveTemplateCallback = function(data, action) {
            var step = null;
            if(data.status == "success" && action == "select") {
                step = 2;                
            } else if(data.status == "success" && action == "remove") {
                step = 1;
                $scope.newHire.template = null;   
            }
            getVerifiedStep(step);
            setVerifiedStep();
            getSpecificCandidateDetail();
        };
        $scope.selectTemplate = function(template){
            if(!$scope.candidateId) {
                return false;
            }
            var url = NewHireManagementService.getUrl('selectTemplate'),
                payload = {
                    candidate_id : $scope.candidateId,
                    offer_template_id : angular.isObject(template._id) ? template._id.$id : template._id,
                    letter_type : 1
                };

            serverUtilityService.putWebService(url, payload)
                .then(function(data){
                    selectRemoveTemplateCallback(data,"select");
                });                  
        };
        $scope.previewOffer = function (candidate, flag) {
            flag = angular.isDefined(flag) ? flag: false;
            if (angular.isDefined(candidate) && !flag) {
                if (angular.isDefined(candidate.letter_preview) && candidate.letter_preview) {
                    $scope.template.body = candidate.letter_preview;
                }
                $('#preview-letter-draft').appendTo("body").modal('show');
            } else {
                flag ? $('#preview-letter').appendTo("body").modal('show')
                    : $('#preview-email').appendTo("body").modal('show');
            }
        };  
        $scope.removeTemplate = function(){
            if(!$scope.candidateId) {
                return false;
            }
            var url = NewHireManagementService.getUrl('removeTemplate'),
                payload = {
                    candidate_id : $scope.candidateId
                };

            serverUtilityService.putWebService(url, payload)
                .then(function(data){
                    selectRemoveTemplateCallback(data,"remove");
                });     
        };
        var saveTriggerOfferSuccessErrorCallback = function (data, action) {
            $scope.errorMessages = [];
            if (data.status == "success") {
                utilityService.showSimpleToast(data.message);
                $scope.resetAPIError(false, null, "candidateofferstatus");
                $location.url('/frontend/new-hire');
            } else if (data.status === "error") {
                if (angular.isObject(data.message) || angular.isArray(data.message)) {
                    angular.forEach(data.message, function (value, key) {
                        $scope.errorMessages.push(value[0]);
                    });
                } else {
                    $scope.errorMessages.push(data.message);
                }
                $scope.resetAPIError(true, data.message, "candidateofferstatus");
            } else if (data.data.status === "error") {
                utilityService.resetAPIError(true, "Something went wrong", "candidateofferstatus");
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }                      
        };
        $scope.resetCandidate = function() {
            if($scope.candidateId) {
                utilityService.removeStorageValue('candidateId');
                $scope.candidateId = null;
                getVerifiedStep(1);
                setVerifiedStep();
                getSpecificCandidateDetail();
            }
        };
        if($scope.section.frontend.newHireManagement.home) {
            $scope.resetCandidate();
        }
        var getOfferDetails = function () {
            var url = NewHireManagementService.getUrl('associate_fields') + "/" + $routeParams.id;
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.candidateDetails = data.data;
                });
        };
        var onBoardingModulePermissionsCallback = function (data) {
            var isExists = false;

            angular.forEach(data, function (value, key) {
                if (!isExists && utilityService.getValue(value, 'permission_slug') === utilityService.getInnerValue($scope.newhire, 'permission', 'slug')) {
                    $scope.newhire.permission.canViewOthersOfferLetter = true;
                    isExists = true;
                }
            });
        };
        var getOnboardingModulePermissions = function () {
            var url = NewHireManagementService.getUrl('modulePermission') + "/onboarding";
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    onBoardingModulePermissionsCallback(utilityService.getValue(data, 'data', []));
                });
        };
        if($scope.section.frontend.newHireManagement.detail) {
            getOfferDetails();            
        }
        getOnboardingModulePermissions();
        var finalizeSuccessErrorCallback = function(data) {
            if(data.status === "success") {
                utilityService.showSimpleToast(data.message);
                $scope.resetAPIError(false, null, "candidateofferstatus");
                $scope.resetCandidate();
                $location.url('frontend/new-hire');
            } else if(data.status === "error") {
                $scope.resetAPIError(true, data.message, "candidateofferstatus");
            } else if(data.data.status === "error") {
                $scope.errorMessages = [];    
                utilityService.resetAPIError(true, "Something went wrong", "candidateofferstatus");
                angular.forEach(data.data.message, function(value, key){
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        $scope.finalizeOffer = function() {
            var url = NewHireManagementService.getUrl('finalizeOffer'),
                payload = NewHireManagementService.buildFinalizeOfferPayload($scope.model,self.contacts,$scope.candidateId);
            
            serverUtilityService.putWebService(url ,payload)
                .then(function(data) {
                    finalizeSuccessErrorCallback(data);
                });
        };       
        $scope.saveAsDraft = function(section) {
            var url = NewHireManagementService.getUrl('saveAsDraft'),
                payload = {};

            if(section.initate) {
                url = url + "/" + '1';
                payload = NewHireManagementService.buildDynamicPayloadForDraftOffer($scope.triggerOfferJson,self,$scope.newHire);
            } else if(section.finalizeOffer) {
                url = url + "/" + '3';
                payload = NewHireManagementService.buildFinalizeOfferPayload($scope.model,self.contacts,$scope.candidateId);
            } else {
                $location.url('frontend/new-hire');
            }

            if($scope.candidateId){
                payload.candidate_id = $scope.candidateId;
            }

            serverUtilityService.putWebService(url,payload)
                .then(function(data) {
                    finalizeSuccessErrorCallback(data);
                });
        };        
        $scope.remove = function(item) {
            item.isDocumentUploaded = false;
            item.offreLetterAttached = null;
            item.file_name = "";
        };        
        $scope.bindFileChangeEvent = function(item) {
            $timeout(function() {
                $("input[type=file]").on('change',function(){
                    item.isLoaded = false;
                    item.isDocumentUploaded = true;
                });
            }, 100);            
        };
        $scope.checkFileType = function (file,item){
            if (file && file.type.indexOf('video') > - 1) {
                alert('File uploaded must be of type docx,doc,pdf,jpeg,jpg'); file = null
                item.offreLetterAttached = null;
                item.isDocumentUploaded = false;
            }            
        };
        var downloadFile = function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            window.location.assign(uri);
        };
        $scope.downloadOffer = function(name, candidateID){
            candidateID = angular.isDefined(candidateID) ? candidateID : $routeParams.id;
            $scope.viewDownloadFileUsingForm(NewHireManagementService.getUrl('downloadOffer') + "/" + candidateID);
        };
        var uploadProgressCallback = function(evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };        
        $scope.saveTriggerOfferFields = function () {
            var url = NewHireManagementService.getUrl('associate_fields'),
                payload = NewHireManagementService.buildDynamicPayloadForTriggerOffer($scope.triggerOfferJson, self, $scope.newHire);
            
            if ($scope.candidateId) {
                url = url + "/" + $scope.candidateId;
            }
            Upload.upload({
                url: url,
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: payload
            }).then(function (response) {
                saveTriggerOfferSuccessErrorCallback(response.data);
            }, function (response) {
                saveTriggerOfferSuccessErrorCallback(response.data);
            }, function (evt) {
                uploadProgressCallback(evt);
            });
        };        
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        $scope.isTabVisited = function(tabNo, wizardKey) {
            var isVisited = false;
            if($scope.verifiedStep && tabNo <= $scope.verifiedStep) {
                isVisited = true && !$scope.wizard[wizardKey];
            }
            return isVisited;
        };

        /* START CHIPS INTEGRATION */
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
                var object = {
                    id: c.id,
                    name: c.full_name,
                    email: c.email,
                    image: c.image
                };
                object._lowername = object.name.toLowerCase();
                return object;
            });
        }
        /* END CHIPS INTEGRATION */      
        
        /************ Start AUTOCOMPLETE Section ************/
        function loadAll() {
            var repos = $scope.employeeList;
            return repos.map(function (repo) {
                repo.value = repo.full_name.toLowerCase();
                return repo;
            });
        }
        function laodAllSignAutg(list) {
            var repos = list;querySearchChips
            return repos.map(function (repo) {
                repo.value = repo.full_name.toLowerCase();
                return repo;
            });
        }
        function querySearch(query) {
            return query ? self.allSignAuth.filter(createFilterFor(query)) : self.allSignAuth;
        }        
        function sugnAuthQuerySearch(query) {
            return query ? self.offerSignAuth.filter(createFilterFor(query)) : self.offerSignAuth;
        }
        function revokeSignAuthQuerySearch(query) {
            self.revokeOfferSignAuth = laodAllSignAutg($scope.revokeCandidate.plan_revoke_letters_sign_auth)
            return query ? self.revokeOfferSignAuth.filter(createFilterFor(query)) : self.revokeOfferSignAuth;
        }
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }            
        }
        function selectedItemChange(item, model, key) {
            if (angular.isDefined(item) && item){
                model[key] = angular.isDefined(item.id) ? item.id : item._id;
            }
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }
        /************ End AUTOCOMPLETE Section ************/
        
        /********** Code related to template integration **********/
        $scope.editTemplate = function(item, isRevoke) {
            isRevoke = angular.isDefined(isRevoke) ? isRevoke : false;
            $location.url('template-consumer').search({
                "template": angular.isObject(item._id) ? item._id.$id : item._id, 
                "refUrl": "offer",
                isRevoke: isRevoke
            });
        };
        angular.element(document).ready(function() {
            $timeout(function () {
                $("#owl-demo").owlCarousel({
                    items : 5,
                    lazyLoad : true,
                    navigation : true,
                    itemsDesktop : [1199,4],
                    itemsDesktopSmall : [979,3],
                    itemsTablet : [768,2],
                    itemsMobile : [479,1]
                }); 
            }, 1000);
        });
        
        /********** Candidate History **********/
        $scope.goTo = function (url) {
            $location.url(url);
        };                
        $scope.extractProfileFieldValue = function (id, detail) {
            var val = null;
            id = angular.isArray(id) ? id[0] : id;

            angular.forEach(detail, function (value, key) {
                if(id == value._id) {
                    val = value.name;
                }
            });
            
            return val;
        };        
        var triggerSuccessCalback = function (data) {
            if(angular.isDefined(data.error) && data.error.length) {
                angular.forEach(data.error, function (v, k){
                    $scope.errorList.push(v)
                });
                $scope.isAll = false;
                $scope.selectDesectUser(false);
            } else {
                utilityService.showSimpleToast(data.message);
                $location.url('/frontend/new-hire');
            }
        };        
        $scope.getFieldsetValue = function (value) {
            if(value == '' || value == null) {
                return ;
            }
            value = angular.isArray(value) ? value[0] : value;

            var obj = null;
            angular.forEach(self.allEmployees, function (val, ke) {
                if (value == utilityService.getValue(val, 'id')) {
                    obj = val;
                }
            });

            return utilityService.getValue(obj, '_lowername');
        };        
        $scope.email = {
            body: 'not yet defined',
            subject: 'not yet defined'
        };
        $scope.previewEmail = function (candidate){
            $scope.email.body = candidate.email_message;
            $scope.email.subject = candidate.email_subject;
            $('#preview-email').appendTo('body').modal('show');
        };        
        $scope.updatePaginationSettings("nhm_offered_page");
        if($routeParams.isVerify){
            $scope.updatePaginationSettings("nhm_onboarding_status_page");
            $scope.wizardFlag = 'onboarding-status';
            $location.url('/frontend/new-hire').search({isVerify: null});
        }

        /********** Start NHM Permission Section **********/
        $scope.nhmPermission = {
            action: {
                list: [],
                current: null,
                visible: false
            }
        };
        var extractReportFromPermissionList = function(data) {
            angular.forEach(data.data, function(value, key) {
                value._id = angular.isObject(value._id) ? value._id.$id : value._id;
                if(value.permission_slug.indexOf('report') >= 0) {
                    data.data.splice(key, 1);
                }
            });
        };
        var getActionListCallback = function(data) {
            extractReportFromPermissionList(data);            
            $scope.nhmPermission.action.list = data.data;
            $scope.nhmPermission.action.current = data.data.length ? data.data[0] : null;
            $scope.nhmPermission.action.visible = true;
        };
        var getActionList = function() {
            var url = NewHireManagementService.getUrl('actionAdmin') + "/onboarding";
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    getActionListCallback(data);
                });
        };
        getActionList();
        var isPermisionExist = function (slug){
            var permisionObject = $scope.nhmPermission.action.list.filter(function filterBySlug(item) {
                    if (item.permission_slug == slug) {
                        return true;
                    }
                });
            
            var flag = permisionObject.length ? true : false;
            return flag;
        };
        
        $scope.isActionView = function() {
            var permissionSlug = 'can_view_new_joinees';
            return isPermisionExist(permissionSlug);
        };
        $scope.isActionSendOfferLetter = function() {
            var permissionSlug = 'can_send_offer_letter';
            return isPermisionExist(permissionSlug);
        };
        $scope.isActionEdit = function() {
            var permissionSlug = 'can_view_new_joinees';
            return isPermisionExist(permissionSlug);
        };
        /********** End NHM Permission Section **********/

        var getCountryDialCodeList = function() {
            var url = NewHireManagementService.getUrl('countryDialCodes');
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.countryDialCode.list = utilityService.getValue(data, 'data');
                });
        };
        getCountryDialCodeList();

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

        // Document Information

        var rebuildDocumentList = function() {
            angular.forEach($scope.docList, function(value, key) {
                value['upload_file'] = null;
                value['isLoaded'] = true;
                value['isDocumentUploaded'] = (!value.file_name) ? false : true;
            });
        };
        var getDocumentDetails = function() {
            var url = NewHireManagementService.getUrl('doc') + "/" + $routeParams.id;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.docList = data.data;
                rebuildDocumentList();
            });
        };

        getDocumentDetails();

        $scope.reUpload = function(){
            $scope.isUploaded = false;
            $scope.file = null;
        };
        $scope.saveDocuments = function(){
            var payload = {};
                angular.forEach($scope.docList, function(value,key){
                    if(value.upload_file){
                        payload[value.slug] = value.upload_file;
                    }
                });

            Upload.upload({
                url: NewHireManagementService.getUrl('updateDoc') + "/" + $routeParams.id,
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: payload,
                }).then(function (response) {
                    if(utilityService.getInnerValue(response, 'data', 'status') === 'error') {
                     uploadErrorCallback(response.data);
                    } else{
                      uploadSuccessCallback(response);
                    }
                }, function (response) {
                    uploadErrorCallback(response.data);
                }, function (evt) {
                    uploadProgressCallback(evt);
                });
        };
        var uploadSuccessCallback = function(response) {
            if(response.data.status === "success") {
                utilityService.showSimpleToast(response.data.message);
            }
        };
        var uploadErrorCallback = function(data) {
            $scope.errorMessages = [];
            if (data.status === "error") {
                if (angular.isArray(data.message) || data.message instanceof Object) {
                    angular.forEach(data.message, function (value, key) {
                        $scope.errorMessages.push(value[0]);
                    });
                } else {
                    $scope.errorMessages.push(data.message);
                }
            } else {
                $scope.errorMessages = [];
                angular.forEach(data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        var uploadProgressCallback = function(evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };

        $scope.selectDocument = function (file,item) {
            if (file) {
                var isNotValid = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
                if (isNotValid) {
                    item.upload_file = null;
                    item.isLoaded = false;
                    item.fileError = "File size must be less than or equal to " + $scope.allowedFileSizeGlobal.text;
                    item.isDocumentUploaded = false;
                } else {
                    item.upload_file = file;
                    item.isLoaded = false;
                    item.fileError = null;
                    item.isDocumentUploaded = true;
                }
            } else {
                item.upload_file = null;
                item.isLoaded = false;
                item.fileError = null;
                item.isDocumentUploaded = false;
            }
        }


        $scope.goToBulkUpload = function () {
            $location.url('/frontend/new-hire/bulk')
        };

        $scope.file = {
            key: null
        };

        $scope.newHireupload = {
            isBulkVisible: true,
        }

        /*$scope.bindFileChangeEvent = function (individulaFlag) {
            $scope.individulaFlag = angular.isDefined(individulaFlag) ? true : false;
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    $scope.isUploaded = true;
                });
            }, 100);
        };*/

        var uploadProgressCallback = function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };

        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var getAlphaIndexing = function (resp) {
            $rootScope.errCount = 0;
            var data = [];
            angular.forEach(resp.data, function (val, key) {
                data.push(val);
                angular.forEach(val, function (v, k) {
                    if (v.error.length) {
                        $rootScope.errCount += 1;
                    }
                });
            });
            $rootScope.totalRecords = data.length;
            $rootScope.alphIndex = [];
            var len = Object.keys(data[0]).length;
            var counter = -1;
            for (var i = 0; i < len; i++) {
                if (i % 26 == 0 && i != 0) {
                    counter = counter + 1;
                }
                if (i > 25) {
                    $rootScope.alphIndex.push(alphabets[counter % 26] + alphabets[(i % 26)]);
                } else {
                    $rootScope.alphIndex.push(alphabets[i]);
                }
            }
            $scope.flag = true;
        };

        var uploadSuccessCallback = function (response) {
            if (angular.isDefined(response) && angular.isDefined(response.data) && !response.data.status) {
                getAlphaIndexing(response);
                $scope.data = [];
                angular.forEach(response.data, function (val, key) {
                    var isError = false;
                    angular.forEach(val, function (v, k) {
                        if (angular.isDefined(v.error) && v.error.length) {
                            isError = true;
                        }
                    });
                    isError ? $scope.data.push(val) : null;
                });
                $scope.parsedCsv = $rootScope.errCount == 0 ? response.data : $scope.data;
                $scope.dataList = response.data;
                $timeout(function () {
                    $scope.newHireupload.isBulkVisible = true;
                }, 100);
            }
            if(response.data.status == 'error' ) {
               $scope.newHireupload.isBulkVisible = true;
                $scope.errorMessages.push(response.data.message);
            } else if (utilityService.getInnerValue(response, 'data', 'status') === 'success') {
                $scope.newHireupload.isBulkVisible = true;
                utilityService.showSimpleToast(utilityService.getInnerValue(response, 'data', 'message'));
            }
            /*if ($scope.individulaFlag) {
                $('#import-emp-data').appendTo("body").modal('hide');
                $location.url('frontend/user-management/summary-bulk').search({flag: true});
            }*/
        };
        var uploadErrorCallback = function (response) {
            var msg = response.data.message ? response.data.message : "Something went worng.";
            $scope.errorMessages.push(msg);
        };
        $scope.changeList = function (key) {
            $scope.parsedCsv = key == 'all' ? $scope.dataList : $scope.data;
        };

        $scope.upload = function () {
            $scope.errorMessages = [];
            $scope.newHireupload.isBulkVisible = false;
            url = NewHireManagementService.getUrl('uploadCsv'),
            data = {
                upload_csv: $scope.file.key
            };
            Upload.upload({
                url: url,
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: data,
            }).then(function (response) {
                uploadSuccessCallback(response);
            }, function (response) {
                uploadErrorCallback(response);
            }, function (evt) {
                uploadProgressCallback(evt);
            });
        };

        var downloadFile = function (uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            window.location.assign(uri);
        };

        $scope.downloadCsv = function (key) {
            var url = NewHireManagementService.getUrl('downloadCsv');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    if(angular.isDefined(data.data.csv)){
                        data.data['user-csv'] = data.data.csv;
                    }
                    if (data.status = "success" && angular.isDefined(data.data[key])) {
                        downloadFile(data.data[key], "employee_Data.csv");
                    }
                });
        };
    }
]);