app.controller('ElcmAdminController', [
    '$scope', '$routeParams', '$location', '$timeout', '$window', '$modal', 'Upload', '$routeParams', 'ElcmAdminService', 'utilityService', 'ServerUtilityService', 'FORM_BUILDER',
    function ($scope, $routeParams, $location, $timeout, $window, $modal, Upload, $routeParams, ElcmAdminService, utilityService, serverUtilityService, FORM_BUILDER) {
        var self = this;
        
        self.filterSelected = true;
        self.querySearchChips = querySearchChips;
        self.searchTextChange = searchTextChange;
        self.selectedItemChange = selectedItemChange;
        self.queryCertificateSearch = queryCertificateSearch;
        //self.queryCertificateSearch1 = queryCertificateSearch1;
        self.certificateSelectedItem = null;
        self.selectedRelievedEmployees = selectedRelievedEmployees;
        self.searchRelievedEmployeesChange = searchRelievedEmployeesChange;

        $scope.resetAllTypeFilters();
        $scope.todaysDate = new Date();
        $scope.documentUpload = {
            file: null,
            select: 'employee',
            isUploaded: false,
            listingSelect: 'form',
            employeeList: []
        }
        $scope.documentUploadForm = {
            file: null,
            select: 'employee',
            isUploaded: false,
            listingSelect: 'form',
            employeeList: []
        }
        $scope.clearFile = function(){
            $scope.documentUpload.fileUpload = null;
        }
        $scope.clearFormFile = function(){
            $scope.documentUploadForm.fileUpload = null;
        }
        $scope.elcmFormObj = {
            summaryList: [],
            filteredList: [],
            isLoaded: false,
            assignModel: ElcmAdminService.buildAssignModel(),
            checkLetterID: null,
            allFormIds: [],
            allDocIds: [],
            selectedCsv: null,
            progress: null,
            isBulkVisible: true
        }
        $scope.elcmObj = {
            summaryList: [],
            filteredList: [],
            isLoaded: false,
            assignModel: ElcmAdminService.buildAssignModel(),
            checkLetterID: null,
            allFormIds: [],
            allDocIds: [],
            selectedCsv: null,
            progress: null,
            isBulkVisible: true
        };
        $scope.formList = [];
        $scope.documentList = [];
        $scope.activeUsers = [];
        $scope.certifiateSignAuth = [];
        $scope.certifiateSignAuth1 = [];
        $scope.certificate = {}
        $scope.is_upload_to_drive = null;
        $scope.isUploadedGoogleDrive= function(val){
            //console.log(val)
            if(val == "false") {
                $scope.is_upload_to_drive = false;
            } else {
                $scope.is_upload_to_drive = true;
            }
            //$scope.is_upload_to_drive = (Boolean(val))? Boolean(val):false
            console.log($scope.is_upload_to_drive)
        }
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.certificateList = ElcmAdminService.buildCertificateList();
        $scope.verifyData = {
            type: $routeParams.type,
            docId: $routeParams.docId,
            candidateId: $routeParams.candidateId
        };
        $scope.letterModel = {
            employeeId: null,
            seacrchText: null,
        };
        $scope.employeeType = ElcmAdminService.buildEmployeeTypeObject()
        
        var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true,
                collection_key: 'employee_preview'
            },
            {
                countObject: 'form',
                collection: $scope.elcmObj.allFormIds,
                isArray: true,
                key: 'selected_form'
            },
            {
                countObject: 'document',
                collection: $scope.elcmObj.allDocIds,
                isArray: true,
                key: 'selected_document'
            }
        ];        
        var extractCount = function (list, collection, type) {
            var obj = {};
            obj.submitted = 0;
            obj.verified = 0;
            obj.total = list.length;
            angular.forEach(list, function (v, k) {
                type == 1 ? collection.push(v.form_id) : collection.push(v.document_id);
                if (v.submitted) {
                    obj.submitted += 1;
                }
                if (v.verified) {
                    obj.verified += 1;
                }
            });
            return obj;
        };
        var extractLetterCount = function (list, collection, type) {
            var obj = {};
            obj.viewed = 0;
            obj.triggered = 0;
            obj.total = list.length;
            angular.forEach(list, function (v, k) {
                collection.push(v.letter_id);
                if (v.is_triggered) {
                    obj.triggered += 1;
                }
                if (v.is_viewed) {
                    obj.viewed += 1;
                }
            });
            return obj;
        };        
        var buildSummaryList = function (data) {
            angular.forEach(data, function (v, k) {
                v.selected_form = [];
                v.selected_document = [];
                v.selected_letter = [];
                if (v.employee_form && angular.isDefined(v.employee_form)) {
                    v.form_detail = extractCount(v.employee_form, v.selected_form, 1);
                }
                if (v.employee_document && angular.isDefined(v.employee_document)) {
                    v.document_detail = extractCount(v.employee_document, v.selected_document, 'document_id');
                }
                if (v.employee_letter && angular.isDefined(v.employee_letter)) {
                    v.letter_detail = extractLetterCount(v.employee_letter, v.selected_letter);
                }
                v.employee_id = v.employee_preview.personal_profile_employee_code;
                v.full_name = v.employee_preview.full_name;
                v.sysPlanEmpStatus = (v.employee_preview.system_plans_employee_status == 7) ? 'relieved' : 'active';
                $scope.calculateFacadeCountOfAllFilters(data, allFilterObject, v);
            });
        };        
        var getFormDocSummary = function () {
            $scope.resetFacadeCountObject(allFilterObject);
            var url = ElcmAdminService.getUrl('summary');
            serverUtilityService.getWebService(url)
                .then(function (data){
                    buildSummaryList(data.data);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.elcmObj.summaryList = data.data;
                    $scope.elcmObj.isLoaded = true;
                });
        };        
        var getFormList = function () {
            var url = ElcmAdminService.getUrl('getAllForms');
            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.formListS = [];
                    angular.forEach(data.data, function (v, k) {
                        if(v.exist_form_way == 3){
                            $scope.formListS.push(v)
                        }
                    });
                    $scope.formList = data.data;
                    angular.forEach(data.data, function (v, k) {
                        $scope.elcmObj.allFormIds.push(v._id)
                    });
                });
        };      
        var getDocumentList = function () {
            var url = ElcmAdminService.getUrl('document');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.documentList = data.data;
                angular.forEach(data.data, function (v, k) {
                    $scope.elcmObj.allDocIds.push(v._id)
                });
            });
        };        
        var letterCallback = function (data) {
            var list = [];
            angular.forEach(data, function (item, k) {
                if(item.templates.length){
                    var activeItem = item.templates.find(function (cert) {
                        return !cert.is_drafted;
                    });
                    if(angular.isDefined(activeItem)) {
                        list.push(item);
                    }
                }
            });
            
            return list;
        };        
        var getLettersDetails = function(empId) {
            var url = ElcmAdminService.getUrl('letters');
            if(angular.isDefined(empId)) {
                url = url + "?emp_id=" + empId;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                var list = letterCallback(data.data);
                $scope.elcmObj.checkLetterID = utilityService.getValue(list[0], '_id');
                $scope.letterList = list;
                $scope.mainCertificateCollections = list;
            });
        };
        var getDriveCredentials = function() {
            var url = ElcmAdminService.getUrl('driveCredentials');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.googleDrive = data.data;
            });
        };
        var getSigningAuthByEmp = function(emp_id, letter_id) {
            var url = ElcmAdminService.getUrl('emp_signing_authority') + '/' + emp_id + '/' + letter_id;
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.empSigningAuth = data.data;
            });
        };
        var getAllUsersList = function (params) {
            var url = ElcmAdminService.getUrl('allUser') + '?permission=can_view_document_form_letter';
            params = angular.isDefined(params) ? params : null;

            serverUtilityService.getWebService(url, params)
                .then(function (data){
                    $scope.activeUsers = data.data;
                    self.allEmployees = loadChipList();
                });
        };        
        // getAllUsersList();
        getFormDocSummary();
        getFormList();
        getDocumentList();
        getLettersDetails();
        getDriveCredentials();
        $scope.sendReminder = function (item, type, pro, managers) {
            var url = ElcmAdminService.getUrl('sendReminder');
            var payload = {
                master_emp_id: item.employee_preview._id,
                type: type,
                slave_emp_id: item.employee_preview._id,
            };
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (data.status=='success') {
                        utilityService.showSimpleToast(data.message);
                    } else {
                        alert(data.message);
                    }
                });
        };        
        $scope.verifySubmittedData = function (candidate, doc, type, isVerified) {
            var candidateID = angular.isObject(candidate._id) ? candidate._id.$id : candidate._id,
                docID = type == 2 ? doc.document_id : doc.form_id,
                searchParams = {
                    candidateId: candidateID, 
                    docId:docID, 
                    type: type, 
                    module: 'elcm', 
                    isVerified: isVerified
                },
                queryParams = $.param( searchParams );
            
            $window.open('#/frontend/new-hire/verify?' + queryParams, '_blank');
            //$location.url("/frontend/new-hire/verify").search(searchParams);
        };
        
        /****** START: ASSIGN SECTION FORM AND DOCUMENT *******/
        $scope.checkLetter = function(item){
            $scope.elcmObj.checkLetterID = item;
        };        
        $scope.assignFiles = function (){
            $scope.errorMessages = [];
            var url = ElcmAdminService.getUrl('assignFile'),
                payload = ElcmAdminService.buildAssignPayload($scope.elcmObj.assignModel, $scope.activeUsers);
            
            serverUtilityService.putWebService(url, payload)
                .then(function (data){
                    if(data.status == 'success'){
                        utilityService.showSimpleToast(data.message);
                        $scope.elcmObj.assignModel = ElcmAdminService.buildAssignModel();
                        getFormDocSummary();
                    } 
                    if(data.status == 'error'){
                        utilityService.resetAPIError(true, "something went wrong", 'elcm');
                        angular.forEach(data.message, function (value, key) {
                            $scope.errorMessages.push({
                                "emplyee_id" : value.employee,
                                "Reason" : value.Reason,
                                "Form_name" : value.Form_name
                            });
                        });
                    }
                });
        };
        /****** END: ASSIGN SECTION FORM AND DOCUMENT *******/
        
        /****** START: ASSIGN SECTION LETTERS *******/        
        $scope.slectedCertificates = [];
        $scope.certficateOriginalLength = 0;
        var createCertificateList = function (data) {
            var list = [], flag = false;
            $scope.certficateOriginalLength = 0;
            angular.forEach(data, function (value, key) {
                for (var i = 0; i < value.templates.length; i++) {
                    if ($scope.slectedCertificates.indexOf(value.templates[i]["_id"]) > -1) {
                        flag = false;
                        break;
                    } else {
                        flag = true;
                    }
                }
                if (flag && value.templates.length && value.signature_setup) {
                    list.push(value);
                }
                if(value.templates.length && value.signature_setup && value.signature_setup.length) {
                    $scope.certficateOriginalLength += 1;
                }
            });
            return list;
        };
        var getAssignedLetterToEmployee = function (employeeId, letterId, listItem) {            
            var url = ElcmAdminService.getUrl('checkAssignedLetter') + "/" + employeeId + "/" + letterId;
            
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    listItem.letterAssignedMessage = utilityService.getValue(data, 'message');
                });
        };
        $scope.setValues = function(template, item, listItem) {
            if (angular.isDefined(template)) {
                $scope.slectedCertificates.push(template._id);
                listItem.typeName = item.name;
                listItem.letterName = template.title;
                if (utilityService.getValue($scope.letterModel, 'employeeId', 'id')
                    && utilityService.getValue(template, '_id')) {
                    getAssignedLetterToEmployee($scope.letterModel.employeeId.id, template._id, listItem);
                    getSigningAuthByEmp($scope.letterModel.employeeId.id, template._id);
                }                
            }
            self.isDisabled = false; 
        };
        $scope.addMoreCertificates = function () {
            var len = $scope.certificateList.length;
            if (len > 0) {
                $scope.certificateList[len - 1]['isSelected'] = true;
            }
            $timeout(function () {
                $scope.letterList = createCertificateList($scope.mainCertificateCollections);
            }, 100);
            $scope.certificateList.push({
                autocompleteKey: "searchText" + len, 
                letter_id: null, 
                sign_authority: null, 
                trigger_date: null, 
                due_days: null, 
                isViewed: false
            });
        };
        $scope.cut = function (index, certificate) {
            $scope.certificateList.splice(index, 1);
            if ($scope.certificateList.length == 0) {
                $scope.addMoreCertificates();
            }
            var i = $scope.slectedCertificates.indexOf(certificate.letter_id); 
            if(i > -1){
               $scope.slectedCertificates.splice(i, 1); 
            }
            $timeout(function () {
                $scope.letterList = createCertificateList($scope.mainCertificateCollections);
            }, 100);
        };
        $scope.isViewed = function (list) {
            if(angular.isDefined(list) && list.length == 1 
                && (!list[0].letter_id || list[0].letter_id == null)) {
                return false;
            }
            if (angular.isDefined(list) && list.length) {
                var notViewedItem =  list.find(function (item) {
                    return item.isViewed === false;
                });
                return (angular.isDefined(notViewedItem) ?  true :  false) ;
            } else {
                return false;
            }
        };        
        $scope.assignLetters = function (isDraft, tempId, type) {
            $scope.errorMessages = [];
            var payload = ElcmAdminService.buildAssignLettersPayload($scope.certificateList, $scope.letterModel);
            var url = ElcmAdminService.getUrl('assignLetters') + "/" + $scope.letterModel.employeeId.id;
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (data.status === "success") {
                        if (angular.isDefined(data.error) && data.error.length) {
                            angular.forEach(data.error, function (value, key) {
                                angular.forEach(value, function (val, ke) {
                                    $scope.errorMessages.push("row" + (key + 1) + ":" + val[0]);
                                });
                            });
                        } 
                        if((!$scope.errorMessages.length || $scope.errorMessages.length == 0) && isDraft) {
                            $location.url('template-consumer').search({
                                template: tempId,
                                refUrl: "elcm",
                                isRevoke: false,
                                empId: $scope.letterModel.employeeId.id,
                                isExit: false,
                                isSummary: false,
                                type: type
                            });
                        } else if((!$scope.errorMessages.length || $scope.errorMessages.length == 0) && !isDraft) { 
                            utilityService.showSimpleToast(data.message);
                            $scope.certificateList = ElcmAdminService.buildCertificateList();
                            $scope.letterModel = {
                                employeeId: null,
                                seacrchText: null
                            };
                            getFormDocSummary();
                        }
                    } else {
                        angular.forEach(data.data.message, function (value, key) {
                            $scope.errorMessages.push( value[0]);
                        });
                    }
                });
        };        
        $scope.verifyLetter = function (employeeData, letter) {
            $location.url('template-consumer').search({
                template: letter.letter_id,
                refUrl: "elcm",
                isRevoke: false,
                empId: employeeData._id,
                isExit: false,
                isSummary: false,
                type: 2
            });
        };        
        $scope.downloadLetter = function (employeeData, letter){
            var url = ElcmAdminService.getUrl('downloadLetter') + '/' + letter.letter_id + "/" + employeeData._id + '/' + utilityService.getStorageValue('accessToken');
            $window.open(url);
        };
        /****** END: ASSIGN SECTION LETTERS *******/
        
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
            var list = $scope.activeUsers;
            return list.map(function (c, index) {
                var object = {
                    id:  angular.isObject(c._id) ? c._id.$id : c._id,
                    name: c.full_name ? c.full_name : '',
                    code: c.employee_code,
                    personal_email_id: c.personal_email_id,
                    image: angular.isDefined(c.profile_pic) ? c.profile_pic : 'images/no-avatar.png'
                };
                object._lowername = object.name.toLowerCase();
                return object;
            });
        }
        /* END CHIPS INTEGRATION */
        
        /******** Start: Autocomplete Section *********/
        function loadAll(list) {
            var repos = list;
            return repos.map(function (repo) {
                repo._id =  angular.isObject(repo._id) ? repo._id.$id : repo._id,
                repo.full_name = angular.isDefined(repo.full_name) ? repo.full_name : " ";
                repo.value = repo.full_name.toLowerCase();
                repo._lowername = repo.full_name.toLowerCase();
                return repo;
            });
        }

        // function loadAll1(list) {
        //     var repos = list;
        //     console.log(list);
        //     return repos.map(function (repo) {
        //         repo._id =  angular.isObject(repo.value) ? repo.value : null,
        //         repo.name = angular.isDefined(repo.name) ? repo.name : " ";
        //         repo.value = repo.value;
        //         repo.relationship = angular.isObject(repo.relationship) ? repo.relationship : null;
        //         return repo;
        //     });
        // }

        function selectedItemChange(item, model, key) {
            if (angular.isDefined(item) && item && angular.isDefined(model[key])) {
                var id = angular.isObject(item._id) ? item._id.$id : item._id;
                model[key] = id;;
            }
        }
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model) && model && angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function queryCertificateSearch(query, letterId) {
            angular.forEach($scope.mainCertificateCollections, function (val, key) {
                angular.forEach(val.templates, function (v, k) {
                    if (v._id == letterId) {
                        $scope.certifiateSignAuth = val.signature_setup;
                    }
                });
            });
            self.certificaterepos = [];
            if ($scope.certifiateSignAuth) {
                self.certificaterepos = loadAll($scope.certifiateSignAuth);
            }
            return self.certificaterepos;
        }
        // function queryCertificateSearch1(query, letterId) {
        //     angular.forEach($scope.empSigningAuth, function (val, key) {
        //         angular.forEach(val.templates, function (v, k) {
        //             if (v._id == letterId) {
        //                 $scope.certifiateSignAuth1 = val.signature_setup;
        //             }
        //         });
        //     });
        //     self.certificaterepos = [];
        //     if ($scope.certifiateSignAuth1) {
        //         self.certificaterepos = loadAll1($scope.certifiateSignAuth1);
        //     }
        //     return self.certificaterepos;
        // }
        function selectedRelievedEmployees(item, certificate) {
            if (angular.isDefined(item) && item && $scope.employeeType.selected == 2) {
                $scope.employeeType.isSet = true;
                $scope.employeeType.email = utilityService.getValue(item, 'personal_email_id');
                $scope.employeeType.empId = utilityService.getValue(item, 'id');                 
            }

            $scope.getRelevanceLetter(item)

            if (utilityService.getValue(item, 'id') && utilityService.getValue(certificate, 'letter_id')) {
                getAssignedLetterToEmployee(utilityService.getValue(item, 'id'), utilityService.getValue(certificate, 'letter_id'), certificate);
            }
        }

        $scope.getRelevanceLetter = function(item) {
            if(utilityService.getValue(item, 'id')) {
                getLettersDetails(utilityService.getValue(item, 'id'));
            }
        }
        function searchRelievedEmployeesChange(text) {            
            $scope.employeeType.isSet = false;
            $scope.employeeType.email = null;
            $scope.employeeType.empId = null;
        }
        /******** End: Autocomplete Section *********/
        $scope.updatePaginationSettings("elcm_summary", $scope.elcmObj.summaryList.length);
        
        /***** Bulk Upload Letters *****/
        $scope.bulkAssignLetter = function(){
            $scope.openModal('assignBulkLetterTmpl', 'assignBulkLetter');
        };        
        $scope.assignInBulk = function (){
            $scope.closeModal('assignBulkLetter');
            $scope.closeModalForm('assignBulkLetter');
            $location.url('frontend/elcm/bulk-assign').search({tempId: $scope.certificate.letter_id});
        };        
        $scope.openModal = function (templateUrl, instance, size) {
            size = size || 'sm';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                size: size
            });
        };
        $scope.closeModal = function (instance) {
            $scope.elcmObj.assignModel.selectedDoc = null;
            $scope.documentUpload.file = null;
            $scope.documentUpload.isUploaded = false;
            if (utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        $scope.closeModalForm = function (instance) {
            $scope.elcmFormObj.assignModel.selectedForm = null;
            $scope.documentUploadForm.file = null;
            $scope.documentUploadForm.isUploaded = false;
            if (utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        $scope.downLoadCsv = function () {
            var url = ElcmAdminService.getUrl('letterCsv') + '/' + $routeParams.tempId;
            serverUtilityService.getWebService(url).then(function(data) {
                $window.open(data.data);
            });
        };
        $scope.selectFile = function (file) {
            if (file) {
                $scope.elcmObj.selectedCsv = file;
            } else {
                $scope.elcmObj.selectedCsv = file;
            }
        };

        /************ CSV ALPHABETS INDEXING ************/ 
        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        var getAlphaIndexing = function (resp) {
            $scope.errCount = 0;
            var data = [];
            angular.forEach(resp.data, function (val, key) {
                data.push(val);
                angular.forEach(val, function (v, k) {
                    if (v.error.length) {
                        $scope.errCount += 1;
                    }
                });
            });
            $scope.totalRecords = data.length;
            $scope.alphIndex = [];
            var len = Object.keys(data[0]).length;
            var counter = -1;
            for (var i = 0; i < len; i++) {
                if (i % 26 == 0 && i != 0) {
                    counter = counter + 1;
                }
                if (i > 25) {
                    $scope.alphIndex.push(alphabets[counter % 26] + alphabets[(i % 26)]);
                } else {
                    $scope.alphIndex.push(alphabets[i]);
                }
            }
            $scope.flag = true;
        };        
        var uploadProgressCallback = function (evt) {
            $scope.elcmObj.progress = parseInt(100.0 * evt.loaded / evt.total);
        };        
        var uploadSuccessCallback = function (response) {
            if (angular.isDefined(response) && angular.isDefined(response.data) && !response.data.data.status) {
                getAlphaIndexing(response.data);
                $scope.data = [];
                angular.forEach(response.data.data, function (val, key) {
                    var isError = false;
                    angular.forEach(val, function (v, k) {
                        if (angular.isDefined(v.error) && v.error.length) {
                            isError = true;
                        }
                    });
                    isError ? $scope.data.push(val) : null;
                });
                $scope.parsedCsv = $scope.errCount == 0 ? response.data.data : $scope.data;
                $scope.dataList = response.data.data;
                $timeout(function () {
                    $scope.elcmObj.isBulkVisible = true;
                }, 100);
            }
            if(response.data.status == 'error' ){
               $scope.elcmObj.isBulkVisible = true;
                $scope.errorMessages.push(response.data.message);
            }
            if ($scope.individulaFlag) {
                $('#import-emp-data').appendTo("body").modal('hide');
                $location.url('frontend/user-management/summary-bulk').search({flag: true});
            }
        };        
        var uploadErrorCallback = function (response){
            var msg = response.data.message ? response.data.message : "Something went worng.";
            $scope.errorMessages.push(msg);
        };        
        $scope.changeList = function (key) {
            $scope.parsedCsv = key == 'all' ? $scope.dataList : $scope.data;
        };        
        $scope.uploadCsv = function () {
            $scope.errorMessages = [];
            $scope.elcmObj.isBulkVisible = false;
            Upload.upload({
                url: ElcmAdminService.getUrl('uploadCsv') + '/' + $routeParams.tempId,
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: {
                    letter_csv: $scope.elcmObj.selectedCsv
                }
            }).then(function (response) {
                uploadSuccessCallback(response);
            }, function (response) {
                uploadErrorCallback(response);
            }, function (evt) {
                uploadProgressCallback(evt);
            });
        };  
        $scope.assignBulkLetters = function () {
            var url = ElcmAdminService.getUrl('assignLettreBulk') + '/' + $routeParams.tempId,
                payload = {csv_data: $scope.parsedCsv, signatory: $scope.bulkSigningAuth.selected, is_upload_to_drive: Boolean($scope.is_upload_to_drive)};
            
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        $location.url('frontend/elcm');
                    } else {
                        alert("Something went wrong.");
                    }
                });
        };
        $scope.tabChangeHandler = function () {
            $scope.employeeType.selected = 1;
            getAllUsersList();
        };
        $scope.typeChangeHandler = function () {
            var params = null;
            if ($scope.employeeType.selected === 2) {
                params = {relieved_emp: true};
            }
            $scope.letterModel = {
                employeeId: null,
                seacrchText: null,
            };
            $scope.employeeType.isSet = false;
            $scope.employeeType.email = null;
            $scope.employeeType.empId = null;
            resetErrorMessages();
            getAllUsersList(params);
            $scope.certificateList = ElcmAdminService.buildCertificateList();
        };
        $scope.updatePersonalEmail = function () {
            resetErrorMessages();
            var url = ElcmAdminService.getUrl('updateEmail') + "/" + $scope.employeeType.empId,
                payload = {
                    slug: 'contact_details_personal_email_id',
                    value: $scope.employeeType.email
                };
            
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data,'elcm');
                    successErrorCallbackForm(data, 'elcm')
                });
        };
        var successCallback = function(data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
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
        var errorCallbackForm = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessagess.push(value[0]);
                });
            }
        };
        var successErrorCallback = function (data, section) {
            data.status === "success" ?
                successCallback(data, section) : errorCallback(data, section);
        };
        var successErrorCallbackForm = function (data, section) {
            data.status === "success" ?
            successCallback(data, section) : errorCallbackForm(data, section);
        };
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        var resetErrorMessagess = function () {
            $scope.errorMessagess = [];
        };

        $scope.reportLetter = {
            typeofletter : "",
            list : [],
            isloaded : false,
            propertyName: null,
            reverse: null,
        }
        $scope.forReportSelectLetter = function(typeletter) {
            var url = ElcmAdminService.getUrl('acknowledementReport') + "/" + typeletter;
            serverUtilityService.getWebService(url).then(function (data){
                $scope.reportLetter.list = data.data;
                $scope.reportLetter.isloaded = true;
            });
        }

        $scope.sortBy = function (model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };

        $scope.exportAcknowledgementViewToCsv = function(item){
            var attrList = new Array("Employee Code", "Employee Name", "Letter", 
                "Acknowledgement Status");
            $scope.report = {
                content: new Array(attrList),
            };
            
            //var filteredList = utilityService.getInnerValue($scope.adminProvisionView, 'provisionView', 'filteredList', []);

            angular.forEach($scope.reportLetter.list, function(value, key) {
                var array = new Array(),
                    assetManaged = [];

                array.push(value.employee_code);
                array.push(value.employee_name);
                array.push(value.letter_name);
                array.push(value.acknowledgement_status);
                
                $scope.report.content.push(array);
            });
            
            var reportName = "admin-acknowledgement-view.csv";
            if($scope.report.content.length > 1){
                $timeout(function() {
                    utilityService.exportToCsv($scope.report.content, reportName);
                }, 500);
            }
        };
        $scope.bulkSigningAuth = {
            list: [],
            selected: null
        }
        $scope.getBulkSigningAuth = function () {
            var url = ElcmAdminService.getUrl('bulkSigningAuth') + '/' + $routeParams.tempId;
            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.bulkSigningAuth.list = data.data
                });
        }; 

        /**** Start: Generic File Upload Related Function  *****/
        $scope.bindFileChangeEvent = function () {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                   $scope.documentUpload.isUploaded = true;
                });
            }, 100);
        };
        $scope.bindFileFormChangeEvent = function () {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                   $scope.documentUploadForm.isUploaded = true;
                });
            }, 100);
        };
        $scope.clearFileUpload = function() {
           $scope.documentUpload.isUploaded = false;
           $scope.documentUpload.file = null;
           resetErrorMessages();
        };
        $scope.clearFormFileUpload = function() {
            $scope.documentUploadForm.isUploaded = false;
            $scope.documentUploadForm.file = null;
            resetErrorMessagess();
         };
        $scope.setCommonFileObject = function(file){
           $scope.documentUpload.file = file;
           $scope.documentUpload.isUploaded = true;
        };
        $scope.setCommonFormFileObject = function(file){
            $scope.documentUploadForm.file = file;
            $scope.documentUploadForm.isUploaded = true;
         };
        /**** End: Generic File Upload Related Function  *****/
        $scope.loader = false;
        $scope.errorCount = 0
        
        $scope.uploadFilledTemplate = function(fileObject, type) {
            $scope.errorMessagesBulk = []
            $scope.errorMessages = []
            var url = ElcmAdminService.getUrl('uploadBulkDocs') + '/' + type;
            if(type === 'employee'){
                if($scope.elcmObj.assignModel.selectedEmp[0] == undefined){
                    $scope.errorMessages = buildError({'status':'error', 'message':"Please Select Employee/Document"});
                    return; 
                }
                url = url + '/' +  $scope.elcmObj.assignModel.selectedEmp[0].id
            }else if (type === 'document'){
                if($scope.elcmObj.assignModel.selectedDoc == undefined){
                    $scope.errorMessages = buildError({'status':'error', 'message':"Please Select Employee/Document"})
                    return;
                }
                url = url + '/' +  $scope.elcmObj.assignModel.selectedDoc
            }else{
                $scope.errorMessages = buildError({'status':'error', 'message':"Please Select Employee/Document"})
                return;
            }
                payload = {};
                
            payload.zip_file = fileObject;
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    if(data.status === 'success'){
                        // if(data.error_count > 0){
                            $scope.errorMessagesBulk = data.data
                            $scope.errorCount = data.error_count
                            $scope.openModal('errormessageBulkupload.html', 'errormessageBulkupload','lg');
                        // }else{
                            if($scope.errorCount == 0){
                                //utilityService.showSimpleToast(data.message, 'Uploaded successfully');
                            }
                        // }
                    }else{
                        $scope.errorMessages = buildError(data)
                    }
                   console.log(data)
                });
        };

        $scope.uploadFormTemplate = function(fileObject, type) {
            $scope.errorMessagesBulk = []
            $scope.errorMessagess = []
            var url = ElcmAdminService.getUrl('uploadBulkForm') + '/' + type;
            if(type === 'employee'){
                if($scope.elcmFormObj.assignModel.selectedEmp[0] == undefined){
                    $scope.errorMessagess = buildError({'status':'error', 'message':"Please Select Employee/Form"});
                    return; 
                }
                url = url + '/' +  $scope.elcmFormObj.assignModel.selectedEmp[0].id
            }else if(type === 'form'){
                if($scope.elcmFormObj.assignModel.selectedForm == undefined){
                    $scope.errorMessagess = buildError({'status':'error', 'message':"Please Select Employee/Form"});
                    return; 
                }
                url = url + '/' + $scope.elcmFormObj.assignModel.selectedForm
            }else{
                $scope.errorMessagess = buildError({'status':'error', 'message':"Please Select Employee/Form"});
                return; 
            }
                payload = {};
                
            payload.zip_file = fileObject;
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    if(data.status === 'success'){
                        // if(data.error_count > 0){
                            $scope.errorMessagesBulk = data.data
                            $scope.errorCount = data.error_count
                            $scope.openModal('errormessageBulkuploadForm.html', 'errormessageBulkuploadForm','lg');
                        // }else{
                            if($scope.errorCount == 0){
                               // utilityService.showSimpleToast(data.message, 'Uploaded successfully');
                            }
                        // }
                    }else{
                        $scope.errorMessagess = buildError(data)
                    }
                   console.log(data)
                });
        };

        $scope.searchEmployeeListing = function(type, name) {
            $scope.documentUpload.employeeList = []
            $scope.loader = true;
            var url = ElcmAdminService.getUrl('employeeListing');
            if(type === 'form'){
                url = url + '/' + 'form' + '/' + $scope.elcmObj.assignModel.selectedForm
            }else if(type === 'document'){
                url = url + '/' + 'document' + '/' + $scope.elcmObj.assignModel.selectedDoc
            }else {
                $scope.loader = false;
                return
            }
            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.documentUpload.employeeList = data.data
                }).finally(function(){
                    $scope.loader = false;
                });
    }

    $scope.searchFormEmployeeListing = function(type, name) {
        $scope.documentUploadForm.employeeList = []
        $scope.loader = true;
        var url = ElcmAdminService.getUrl('employeeListing');
        if(type === 'form'){
            url = url + '/' + 'form' + '/' + $scope.elcmFormObj.assignModel.selectedForm
        }else if(type === 'document'){
            url = url + '/' + 'document' + '/' + $scope.elcmFormObj.assignModel.selectedDoc
        }else {
            $scope.loader = false;
            return
        }
        serverUtilityService.getWebService(url)
            .then(function (data){
                $scope.documentUploadForm.employeeList = data.data
            }).finally(function(){
                $scope.loader = false;
            });
}

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
    $scope.updatePaginationSettings('doc_form_emp_listing');

    $scope.exportDataToCsv = function(data) {
        var content = [['Employee Code', 'Employee Name', 'Status']]
        var fileName = ''
        if($scope.documentUpload.listingSelect === 'form'){
           fileName = $scope.formList.filter(function(val){
            return val._id === $scope.elcmObj.assignModel.selectedForm
           })
        }else if($scope.documentUpload.listingSelect === 'document'){
            fileName = $scope.documentList.filter(function(val){
             return val._id === $scope.elcmObj.assignModel.selectedDoc
            })
         }
         console.log(fileName)
        
        angular.forEach(data, function(value) {
            var array = new Array();
            array.push(utilityService.getValue(value, 'employee_code'));
			array.push(utilityService.getValue(value, 'employee_name'));
            array.push(utilityService.getValue(value, 'status'));
			content.push(array);
        })
        utilityService.exportToCsv(content, $scope.documentUpload.listingSelect + '_' + fileName[0].name );
    }


}]);