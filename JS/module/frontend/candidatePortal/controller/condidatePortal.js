app.controller('CandidatePortalController', [
    '$scope', '$window', '$timeout', '$location', 'relevanceService', '$routeParams', '$modal', 'CandidatePortalService', 'utilityService', 'ServerUtilityService', 'VALIDATION_ERROR', 'Upload', '$mdDialog', 'FORM_BUILDER',  
    function ($scope, $window, $timeout, $location, relevanceService, $routeParams, $modal, CandidatePortalService, utilityService, serverUtilityService, VALIDATION_ERROR, Upload, $mdDialog, FORM_BUILDER) {
        var self = this;

        self.filterSelected = true;
        self.querySearchChips = querySearchChips;
        self.skills = [];

        $scope.questionTypeConstant = FORM_BUILDER.questionType;        
        $scope.attachedFileFlag = [];
        $scope.apiError = utilityService.buildAPIErrorObject();
        $scope.accessToken = utilityService.getStorageValue("accessToken");
        $scope.validationError = VALIDATION_ERROR[countryCode];
        $scope.skillList = null;
        $scope.candidateDetails = {acceptance_date: 1, accepted: false};
        $scope.accepted = false;
        $scope.rejected = false;
        $scope.lockWizard = false;
        $scope.wizard = CandidatePortalService.buildWizardObject();        
        $scope.offerStatus = CandidatePortalService.buildOfferStatusObject();
        $scope.person = CandidatePortalService.buildPersonObject();
        $scope.formList = [];
        $scope.groupObject = {};
        $scope.elementObject = {};
        $scope.formDoc = {
            upload_file : null
        };

        $scope.countryDialCode = {
            list: []
        };
        $scope.todaysDate = new Date();
        $scope.isPreview = angular.isDefined($routeParams.isPreview) && $routeParams.isPreview == 'true' ? true : false;
        var syncProfileModel = function(model) {
            $scope.profile = CandidatePortalService.buildProfileModel(model);
        };
        syncProfileModel();
        var syncFormModel = function(model){
            $scope.formModel = CandidatePortalService.buildFormModel(model);
            $scope.questionList = CandidatePortalService.buildQuestionModel(model);
        };

        /*************** tart Modal Code ********************/
        var toggleModal = function (instance, templateUrl , flag){
            flag = angular.isDefined(flag) ? flag : false;
                flag ? $scope.openModal(instance, templateUrl)
                        : $scope.closeModal(instance);
        };        
        $scope.openModal = function(instance, templateUrl) {
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope:$scope,
                backdrop: 'static'
            });
        };
        $scope.closeModal = function(instance) {
            $scope.modalInstance[instance].dismiss();
        };
        /***************End  Modal Code ********************/

        $scope.answerQuestions = function(form){
            syncFormModel(form);
            toggleModal("questionAnswerForm", "questionAnswerFormPopup.html", true);
        };
        $scope.submitAnswers = function(form){
            var payload = CandidatePortalService.buildQuestionPayload($scope.questionList,form);
            var url = CandidatePortalService.getUrl('updateForm');
            serverUtilityService.postWebService(url ,payload)
                .then(function(data) {
                    successErrorCallback(data, 'candidateForm');
                });
        };
        var initializeSkillModel = function(skill) {
            self.skills = [];
            angular.forEach(skill, function(value, key){
                self.skills.push({
                    id: value._id.$id,
                    name: value.skill_name,
                    code: value.skill_code
                });
            });            
        };
        var getCandidateDetails = function() {
            var url = CandidatePortalService.getUrl('myDetail');
            serverUtilityService.getWebService(url).then(function (data) {
                if(data.data) {
                    $scope.candidateDetails = data.data;
                    $scope.lockWizard  = $scope.candidateDetails.recruitment_offer_status == 5?true:false;
                    if(data.data.acceptance_date){
                        var theDate = new Date(data.data.acceptance_date * 1000);
                        $scope.candidateDetails.acceptance_date = theDate.toGMTString();
                    }
                    syncProfileModel(data.data);
                    initializeSkillModel(data.data.skill);
                }                    
            });
        };
        if($scope.user.accessToken) {
            getCandidateDetails();
        }
        var buildGroupElementObject = function() {
            angular.forEach($scope.groupList, function(value, key) {
                $scope.groupObject[value._id] = value.name;
                angular.forEach(value.element, function(v, k) {
                    $scope.elementObject[v._id] = v.name;
                });
            });
        };
        var getGroupList = function() {
            serverUtilityService.getWebService(relevanceService.getUrl('field'))
                .then(function(data){
                    $scope.groupList = data.data;
                    buildGroupElementObject();
                }); 
        };  
        getGroupList();
        $scope.renderGroupName = function(key) {
            return angular.isDefined(key) && $scope.groupObject[key];
        };
        $scope.renderElementName = function(key) {
            return angular.isDefined(key) && $scope.elementObject[key];
        };
        var rebuildDocumentList = function() {
            angular.forEach($scope.docList, function(value, key) {
                value['upload_file'] = null;
                value['isLoaded'] = true;
                value['isDocumentUploaded'] = (!value.file_name) ? false : true; 
            });
        };
        var getDocumentDetails = function() {            
            var url = CandidatePortalService.getUrl('doc');
            serverUtilityService.getWebService(url).then(function (data) {                    
                $scope.docList = data.data;
                rebuildDocumentList();
            });
        };
        var getFormDetails = function() {            
            serverUtilityService.getWebService(CandidatePortalService.getUrl('getForm'))
                .then(function (data) {                    
                    angular.forEach(data.data, function(value) {
                        value['is_uploading'] = false;
                        value['upload_file_name'] = null;
                        // console.log(value)
                    })
                    $scope.formList = data.data;
                    // console.log($scope.formList)
                });
        };
        getDocumentDetails();
        getFormDetails();
        var def = "1970-01-01";
        var segmentFiledSyncRapper = function (v, k) {
            if (v.field_type != 14) {
                if (v.format_type == 1 || v.field_type == 10 || v.field_type == 12 && v.value) {
                    v.value = v.value.toString();
                } else if (v.field_type == 5 && v.value != "") {
                    v.value = utilityService.getDefaultDate(v.value);
                } else if (v.field_type == 13) {
                    if (angular.isDefined(v.validator) && v.validator.is_multi_select == '2') {
                        self.value[v.slug] = [];
                        angular.forEach(self.reportingEmp, function (val, ke) {
                            angular.forEach(v.value, function (id, index) {
                                if (id == val.id) {
                                    self.value[v.slug].push(val);
                                }
                            });
                        });
                    } else if (angular.isDefined(v.validator) && v.validator.is_multi_select == '1') {
                        angular.forEach(self.reportingEmp, function (val, ke) {
                            if (v.value[0] == val.id) {
                                val.full_name = val.name;
                                val._id = val.id;
                                v.value = val;
                            }
                        });
                        if (!v.value.length && !angular.isObject(v.value)) {
                            v.value = null;
                            self[v.slug] = '';
                        }
                    }
                } else if (v.field_type == 6) {
                    v.value = new Date(def + " " + v.value);
                } else if (v.field_type == 11) {
                    angular.forEach(v.element_details, function (v11, k11) {
                        v11.isChecked = v.value.indexOf(v11._id) == -1 ? false : true;
                    });
                }
            }
        };
        var getSetupFieldJson = function() {
            serverUtilityService.getWebService(CandidatePortalService.getUrl('setupFields'))
                .then(function(data) {
                    angular.forEach(data.data, function (v, k) {
                        if (v.field_type == 14) {
                            angular.forEach(v.child_detail, function (value, key) {
                                if (value.field_type == 14) {
                                    angular.forEach(value.child_detail, function (value2, key2) {
                                        segmentFiledSyncRapper(value2, key2)
                                    });
                                } else {
                                    segmentFiledSyncRapper(value, key);
                                }
                            });
                        } else {
                            segmentFiledSyncRapper(v, k);
                        }
                    });
                    $scope.setupFieldJson = data.data;
                });
        };  
        getSetupFieldJson();
        var saveSetupFieldsSuccessErrorCallback = function(response) {
            if(response.status === "success") {
                utilityService.showSimpleToast(response.message);
                $location.url('userManagementProfileField').search({"id":response.data});
                utilityService.resetAPIError(false, response.message, 'saveSetupFields');
            } else if (response.status === "error") {
                utilityService.resetAPIError(true, response.message, 'saveSetupFields');
            } 
        };
        var successErrorCallback = function(data, tabName) {
            if(data.status == "success") {
                utilityService.showSimpleToast(data.message);
                $scope.resetAPIError(false, null, tabName);
                if(tabName == 'candidatePortal' && $scope.globalSettings.document_upload){
                    console.log('asda');
                    $scope.setWizard('documents', true);
                }
                if(tabName == 'candidatePortal' && !$scope.globalSettings.document_upload && $scope.globalSettings.form_upload){
                    $scope.setWizard('forms', true);
                }
                if(tabName == 'candidateForm'){
                   toggleModal("questionAnswerForm", "questionAnswerFormPopup.html", false);
                }
                if(tabName == 'candidateUploadForm'){
                    $scope.isFormUploaded = true;
                }

            } else if(data.status === "error") {
                $scope.resetAPIError(true, data.message, tabName);
            } else {
                $scope.resetAPIError(true, data.data.message, tabName);
                if(angular.isString(utilityService.getInnerValue(data, 'data', 'message'))) {
                    $scope.errorMessages.push(utilityService.getInnerValue(data, 'data', 'message'));
                } else {
                    angular.forEach(data.data.message, function(value, key){
                        $scope.errorMessages.push(value[0]);
                    });
                }
            }
        };
        $scope.saveSetupFields = function(fields){
            $scope.errorMessages = [];
            var url = CandidatePortalService.getUrl('setupFields');
            var payload = CandidatePortalService.buildDynamicPayloadForSetupField($scope.setupFieldJson);
            serverUtilityService.putWebService(url ,payload)
                .then(function(data) {
                    successErrorCallback(data, 'candidatePortal');
                });
        };
        $scope.downloadFile = function downloadURI(uri) {
            $window.open(uri);
        };
        $scope.rediretToLink = function(uri){
            var newTab = $window.open(uri, '_blank');
        };
        var performCandidateAction = function (offerStatus) {
            var status = offerStatus?8:5;
            var url = CandidatePortalService.getUrl('offer')+'/'+$scope.candidateDetails._id+'/'+status;

            serverUtilityService.putWebService(url)
                .then(function (data) {
                    $scope.candidateDetails = data.data
                    
                });
        };
        $scope.setWizard = function (action, flag) {
            flag = angular.isDefined(flag) ? flag : false;

            angular.forEach($scope.wizard, function (key, value) {
                $scope.wizard[value] = false;
            });

            $scope.wizard[action] = true;
        };
        $scope.goToNext = function (action){
            if(action == "profile" && !$scope.globalSettings.profile_update 
                && $scope.globalSettings.document_upload) {
                $scope.setWizard('documents');
            } else if(action == "profile" && !$scope.globalSettings.profile_update 
                && !$scope.globalSettings.document_upload && $scope.globalSettings.form_upload) {
                $scope.setWizard('forms');
            } else {
                $scope.setWizard(action);
            }
        };
        $scope.acceptOffer = function (ev) {
            performCandidateAction(true);
        };
        $scope.rejectOffer = function (ev) {
            var confirm = $mdDialog.confirm()
                .title('Hello --!')
                .textContent('Are you sure do you want to reject the offer.')
                .targetEvent(ev)
                .ok('YES')
                .cancel('No');

            $mdDialog.show(confirm).then(function () {
                performCandidateAction(false);
                $scope.rejected = true;
                $scope.lockWizard = true;
            });
        };
        $scope.email = function () {
            alert('This action needs to be completed ')
        };
        var buildProfilePayload = function() {
            var payload = {},
                skills = [];

            angular.copy($scope.profile, payload);
            angular.forEach(self.skills, function (val, key) {
                skills.push(val.id);
            });
            payload.skill = skills;
            return payload;
        };
        $scope.updateProfile = function (act) {
            var url = CandidatePortalService.getUrl('profile'),
                payload = buildProfilePayload();
            
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, 'candidatePortal');
                });            
        };
        $scope.isAcceptanceDate = function() {
            return angular.isDefined($scope.candidateDetails.acceptance_date) 
                && $scope.candidateDetails.acceptance_date ? true : false;
        };
        $scope.sendEmail = function() {
            window.open('mailto:' + $scope.person.email + '?subject=' + $scope.person.subject);
        };
        $scope.resetAPIError = function(status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        $scope.setChild = function(item){
           $scope.childElements =  item;
        };

        /* START CHIPS INTEGRATION */
        var getSkillList = function () {
            var url = CandidatePortalService.getUrl('skill');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.skillList = data.data;
                    self.allSkills = loadSkills();
                });
        };
        getSkillList();
        function querySearchChips(criteria) {
            return criteria ? self.allSkills.filter(createFilterFor(criteria)) : [];
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item._lowername.indexOf(lowercaseQuery) != -1);
            };
        }
        function loadSkills() {
            var skills = $scope.skillList;
            return skills.map(function (c, index) {
                var skill = {
                    id: c._id,
                    name: c.skill_name,
                    code: c.skill_code
                };
                skill._lowername = skill.name.toLowerCase();
                return skill;
            });
        }        
        /* END CHIPS INTEGRATION */

        var downloadFile = function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            link.click();
        };
        $scope.downloadOffer = function (flag) {
            $scope.viewDownloadFileUsingForm(CandidatePortalService.getUrl('downloadOffer'));
        };
        $scope.remove = function(item) {
            item.isDocumentUploaded = false;
            item.file_name = "";
            item.upload_file = null;
        };
        $scope.bindFileChangeEvent = function(item) {
            $timeout(function() {
                $("input[type=file]").on('change',function() {
                    $scope.isUploaded = true;
                    item.isLoaded = false;
                    item.isDocumentUploaded = true;
                })
                ;
            }, 100);            
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
        $scope.bindFormFileChangeEvent = function(item,form) {
            form.is_uploading = true;
            form.upload_file_name = item.upload_file.name;
            $scope.selectedForm = null;
            $scope.selectedForm = form;
            $timeout(function() {
                $("input[type=file]").on('change',function(){
                    //$scope.isFormUploaded = true;
                });
            }, 100);   
            if($scope.formDoc.upload_file){
                var url = CandidatePortalService.getUrl('updateForm'),
                    payload = {
                        form_id : $scope.selectedForm._id,
                        upload_file : $scope.formDoc.upload_file
                    };

                serverUtilityService.uploadWebService(url ,payload)
                    .then(function(data) {
                        successErrorCallback(data, 'candidateUploadForm');                        
                    });
            }         
        };
        $scope.bytesToSize = function (bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Byte';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        };
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
                url: CandidatePortalService.getUrl('updateDoc'),
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
                if($scope.globalSettings.form_upload) {
                    $scope.setWizard('forms', true);
                }
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
        $scope.navigateToBack = function() {
            $location.url('admin').search({
                "tab": "prejoin", 
                "subtab": "candidatePortal"
            });
        };
        $scope.globalSettings = null;
        var getGlobalSetting = function (){
            var url = CandidatePortalService.getUrl('getGlobalSetting');
            serverUtilityService.getWebService(url)
                    .then(function (data){
                        $scope.globalSettings = data.data;
                    });
        };
        getGlobalSetting();

        var getCountryDialCodeList = function() {
            var url = CandidatePortalService.getUrl('countryDialCodes');
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.countryDialCode.list = utilityService.getValue(data, 'data');
                });
        };
        getCountryDialCodeList();

        $scope.callApiBeforeProceed = function () {
            $scope.is_forms_saved
            var url = CandidatePortalService.getUrl('checkMandatoryForm');
            serverUtilityService.getWebService(url)
                .then(function(response) {
                    if(utilityService.getValue(response, 'status') === 'error') {
                        uploadErrorCallback(response);
                    }else {
                        $scope.is_forms_saved = true;
                    }
                });
                
        }
    }

]);