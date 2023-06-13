app.controller('TemplateBuilderController', [
    '$scope', '$routeParams', '$timeout', '$location', '$window', 'templateBuilderService', 'utilityService', 'ServerUtilityService', 
    function ($scope, $routeParams, $timeout, $location, $window, templateBuilderService, utilityService, serverUtilityService) {
        var h = 842,
            w = 450,
            resizeHeight = h,
            resizeWidth = w;

            var self = this;
            self.selectedIndex = 0;

        $scope.getDateDiff = function(date1, date2) {
            var timeDiff = null;
            var now = moment(date2); //todays date
            var end = moment(date1); // another date
            var duration = now.diff(end, 'hours');
            if(duration > 24) {
                timeDiff = now.diff(end, 'days') + now.diff(end, 'days') > 1 ? "days" : "day";
                return timeDiff;
            } else {
                return duration + " hours"
            }            
        };
        $scope.fieldType = templateBuilderService.buildFieldTypeHashMap();
        $scope.filename = "letterhead";
        $scope.referenceIds = [];
        $scope.payrollRefereceIds = [];
        $scope.NoduesRefereceIds = [];
        $scope.noDuesRefereceIds = [];
        $scope.templateBuilder = {
            showCustom: false,
            customRefList: []
        };
        $scope.module = {
            refUrl: utilityService.getValue($routeParams, "refUrl"),
            template: utilityService.getValue($routeParams, "template"),
            module: utilityService.getValue($routeParams, "module"),
            template_type: utilityService.getValue($routeParams, "template_type"),
            candidate: utilityService.getValue($routeParams, "candidate"),
            exit_id: utilityService.getValue($routeParams, "exit_id"),
            letter_type: utilityService.getValue($routeParams, "letter_type"),
            template_id: utilityService.getValue($routeParams, "template_id"),
            actionId: utilityService.getValue($routeParams, "actionId"),
            isTriggerCert: utilityService.getValue($routeParams, "isTriggerCert"),
            isRefrenceVisible: angular.isDefined($routeParams.isRefrenceVisible) ? utilityService.getValue($routeParams, "isRefrenceVisible") : false,
            isRevoke: angular.isDefined($routeParams.isRevoked) && $routeParams.isRevoked ? utilityService.getValue($routeParams, "isRevoked") : false,
        };
        if ($scope.module.refUrl) {
            $scope.tmplConstant = utilityService.buildTmplConstantObject($scope.module.refUrl);
        }
        $scope.isEdit = $routeParams.edit ? true : false;
        $scope.title = templateBuilderService.buildTitleObject();;
        $scope.tinymceOptions = templateBuilderService.buildTinyMceOptionsObject(); 
        $scope.editor = templateBuilderService.buildEditorObject();
        $scope.row = templateBuilderService.buildRowObject();
        $scope.payrollComponentSelected = null;

        $scope.loadTemplate = function() {
            var url = "data/" + $scope.editor.template + ".html";
            serverUtilityService.getWebService(url)
                .then(function(data){
                    $scope.insertContent(data);     
                });
        };
        $scope.insertReference = function(item) {
            if(item.field_type != 14){
                var content = "{{model." + item.slug + "}}";
                $scope.insertContent(content);
                $scope.referenceIds.push(item._id);
            }
        };
        $scope.insertPayrollReference = function(item) {
            if(!item.slug){
                item.slug = item.deduction_name ? item.deduction_name.replace(/[^a-zA-Z0-9]/g,'_') : item.component_name.replace(/[^a-zA-Z0-9]/g,'_');
            }
            var content = "{{model." + item.slug + "}}";
            $scope.insertContent(content);
            $scope.payrollRefereceIds.push(angular.isObject(item._id)?item._id.$id:item._id);
        };        
        $scope.insertNoduesReference = function(type, item) {
            var content = "{{model." + item.provision_name + "_" + type + "}}";
            $scope.insertContent(content);
            var obj = {
                type: type,
                provision_type_id: angular.isObject(item._id)?item._id.$id:item._id
            };
            $scope.NoduesRefereceIds.push(obj);
        };
        $scope.insertContent = function(content) {
            tinyMCE.execCommand('mceInsertContent', true, content);
        };
        var repaintEditor = function() {
            tinyMCE.execCommand('mceRepaint');
        };
        var resizeEditor = function() {
            resizeHeight = resizeHeight + h;
            tinyMCE.DOM.setStyle(tinyMCE.DOM.get("ui-tinymce-0_ifr"), 'height', resizeHeight + 'px');
        };     
        var resetSnippetList = function(list) {
            $scope.tinymceOptions.snippet_list = list;
        };
        var reloadSnippetList = function(list) {
            resetSnippetList(list);
            toggleEditor(false, 0);
            toggleEditor(true, 0);            
            $timeout(function() {
                $('body').on('click', '#mceu_16', function() {
                    resizeEditor();
                    $scope.loadTemplate($scope.editor.template);
                });
            }, 1500);
        };
        var syncReferenceModel = function() {
            $scope.reference = templateBuilderService.buildReferenceModel($scope.module, $scope.tmplConstant);
        };        
        var toggleEditor = function(flag, time) {
            $timeout(function() {
                $scope.editor.isVisible = flag;                
            }, time);            
        };
        var getReferenceList = function(isReloaded) {
            isReloaded = angular.isDefined(isReloaded) ? isReloaded : false;    
            var url = templateBuilderService.getUrl('reference') 
                + "/" + $scope.module.template_type + "/true/" + $scope.module.module;

            if(utilityService.getValue($routeParams, 'certificate_id')) {
                url = url + "/" + $routeParams.certificate_id;
            }
            serverUtilityService.getWebService(url).then(function(data) {
                if(isReloaded) {
                    resetSnippetList(data.data);
                    repaintEditor();                            
                } else {
                    reloadSnippetList(data.data);
                }  
                $scope.templateBuilder.customRefList = data.data;
            });
        };               
        var getProfileFields = function() {
            serverUtilityService.getWebService(templateBuilderService.getUrl('profileFields'))
                .then(function(data){
                    $scope.fields = data.data;     
                });
        };        
        var syncTemplateContentModel = function (model, item) {
            $scope.template = templateBuilderService.buildTemplateContentModel(model, item, $scope.tmplConstant.type);
        };
        var getTemplateDetails = function () {
            if($routeParams.candidate) {
                var url = templateBuilderService.getUrl($scope.tmplConstant.refUrl) + "/" + $scope.module.template + "/" + $routeParams.candidate;
            } else if($routeParams.exit_id) {
                url = "user-exit/certificate-html/" + $scope.module.exit_id + "/" +$scope.module.letter_type;
            } else {
                var url = templateBuilderService.getUrl($scope.tmplConstant.refUrl) + "/" + $scope.module.template;
            }
            serverUtilityService.getWebService(url).then(function (data) {
                if(data.data.filename){
                    $scope.templateModel.isDocumentUploaded =true;
                    $scope.templateModel.isLoaded = true;
                }
                syncTemplateContentModel(data.data, {_id: data.data.certificate_id});
                if ($routeParams.isRefrenceVisible) {
                    $scope.tinymceOptions.templates.push(data.data.signature);
                }
                if(data.data.reference_list){
                    $scope.referenceIds = data.data.reference_list;
                }
                if(data.data.reference_list_no_dues){
                    $scope.NoduesRefereceIds = data.data.reference_list_no_dues; 
                }
                if(data.data.reference_list_payroll){
                    $scope.payrollRefereceIds =  data.data.reference_list_payroll;
                }                
            });
        };
        var getPayrollComponentList = function () {
            var url = templateBuilderService.getUrl('payrollComponent');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.payrollComponets = data.data;
            });
        };        
        var getNoDuesComponentList = function () {
            var url = templateBuilderService.getUrl('noduesRef');
            serverUtilityService.getWebService(url).then(function (data) {
                angular.forEach(data.data, function (v, k) {
                    v.slugFileds = angular.isDefined(v.slugFileds)  && v.slugFileds.length ?  v.slugFileds : [];
                    var replaceSpace = v.provision_name.replace(/ /g, "_");
                    if (v.managers.length) {
                        v.slugFileds.push({
                            slug: replaceSpace + "_poc",
                            name: "Point of contact"
                        });
                    }
                    if (v.escalation_contacts.length) {
                         v.slugFileds.push({
                            slug: replaceSpace + "_escalation_contact",
                            name: "Escalation contact"
                        });
                    }
                });
                $scope.noDuesComponets = data.data;
            });
        };
        $scope.collapseExpand = function (field) {
            field.isExpanded = field.isExpanded ? false : true;
        };
        var getSegmentList = function () {
            var url = templateBuilderService.getUrl('segment') + "?field=true&status=true&is_letter_reference=true";
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.segmentList = data.data;
            });
        };
        
        var getRecruitmentRefList = function () {
            var url = templateBuilderService.getUrl('recruitmentRef');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.segmentList = data.data;
            });
        };
        var getRecruitmentGroupRefList = function () {
            var url = templateBuilderService.getUrl('recruitmentGroupRef');
            serverUtilityService.getWebService(url).then(function (data) {
                console.log(data);
                $scope.recruitmentGroupList = data.data;
            });
        };
        var getRecruitmentApplicationRefList = function () {
            var url = templateBuilderService.getUrl('recruitmentAppFileds');
            serverUtilityService.getWebService(url).then(function (data) {
                console.log(data);
                $scope.recruitmentApplicationList = data.data;
            });
        };
        syncReferenceModel();
        getReferenceList();
        getProfileFields();
        getTemplateDetails();
        getPayrollComponentList();
        getNoDuesComponentList();
        if ($scope.module.module == 'recruitment') {
            getRecruitmentRefList();
           getRecruitmentGroupRefList();
           getRecruitmentApplicationRefList();
        }else{
           getSegmentList();
        }

        $scope.updateTitle = function () {      
            if(!$scope.title.isVisible){
                return;
            }
            var url = templateBuilderService.getUrl($scope.tmplConstant.refUrl) + "/" + $scope.module.template,
                payload = templateBuilderService.buildTemplateTitlePayload($scope.template);

            serverUtilityService.putWebService(url, payload).then(function (data) {
                $scope.update = false;
                successErrorCallback(data, [], "reference", true,true);
            });
        };
        $scope.updateTemplateContent = function () {
            var url = templateBuilderService.getUrl($scope.tmplConstant.refUrl) + "/content/" + $scope.module.template,
                payload = templateBuilderService.buildTemplateContentPayload($scope.template, $scope.referenceIds,$scope.payrollRefereceIds, $scope.NoduesRefereceIds);
            serverUtilityService.putWebService(url, payload).then(function (data) {
                if (data.status == "success") {
                    utilityService.showSimpleToast(data.message);
                    $scope.navigateToBack();
                }
            });
        };
        $scope.addReference = function() {
            var url = templateBuilderService.getUrl('reference'),
                payload = templateBuilderService.buildReferencePayload($scope.reference, $routeParams.certificate_id,  $scope.module);

            serverUtilityService.postWebService(url, payload).then(function(data) {
                successErrorCallback(data, [], "reference", true);
            });
        };
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        $scope.previewOffer = function(){
            $('#preview-letter').appendTo("body").modal('show');
        };        
        $scope.toggleTemplateTitle = function(flag){
            $scope.title.isVisible = flag;
        };
        $scope.setSelectedIndex = function(item) {
            $scope.row.selectedIndex = ($scope.row.selectedIndex != item._id) 
                ? item._id : $scope.row.selectedIndex = -1;
        };
        $scope.setPayrollCompoent = function(name) {
            $scope.payrollComponentSelected = name; 
        };
        $scope.addToReferenceList = function() {
            console.log("addToReferenceList");
            var url = templateBuilderService.getUrl('bulkReference'),
                snippetList = [];
            console.log($scope.referenceIds);

            angular.forEach($scope.segmentList, function(value, key) {
                angular.forEach(value.profile_field, function(v, k) {
                    //if(v.isChecked) {
                    if($scope.referenceIds.indexOf(v._id) >= 0) {
                        snippetList.push({
                            module_key: $scope.reference.module_key,
                            template_type: $scope.reference.template_type,
                            reference_id: v._id,
                            certificate_id: utilityService.getValue($routeParams, 'certificate_id'),
                            text: v.name,
                            value: "{{model." + v.slug + "}}",
                            is_profile: true
                        });
                    }
                    if (angular.isDefined(v.child_details)) {
                        angular.forEach(v.child_details, function (val, ke) {
                            if ($scope.referenceIds.indexOf(val._id) >= 0) {
                                snippetList.push({
                                    module_key: $scope.reference.module_key,
                                    template_type: $scope.reference.template_type,
                                    reference_id: val._id,
                                    certificate_id: utilityService.getValue($routeParams, 'certificate_id'),
                                    text: val.name,
                                    value: "{{model." + val.slug + "}}",
                                    is_profile: true
                                });
                            }
                        });
                    }
                });
            });
            console.log(snippetList);
            if(!snippetList.length) {
                return false;
            }
            var payload = {
                references: snippetList
            };
            serverUtilityService.postWebService(url, payload).then(function(data) {
                successErrorCallback(data, [], "bulkReference", true);
            }); 
        };
        var successCallback = function (data, list,section, isAdded,titleUpdate) {
            $scope.templateBuilder.showCustom = false;
            resetErrors();
            isAdded = angular.isDefined(isAdded) ? isAdded : false;
            utilityService.resetAPIError(false, null,section);
            utilityService.showSimpleToast(data.message);
            if(titleUpdate){
              $scope.title.isVisible = false;  
            };
            $scope.reference.text = null;
            getReferenceList();            
        };        
        var errorCallback = function (data, section) {
             resetErrors();
            if (data.status === "error") {
                $scope.errorMessages.push(data.message);
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data, function (value, key) {
                    if(value.status == "error") {
                        $scope.errorMessages.push(value.message + value.data.text);
                    }
                });
            }
        };
        var successErrorCallback = function (data, list, section, isAdded,titleUpdate) {
            data.status === "success" ?
                successCallback(data, list, section, isAdded,titleUpdate) : errorCallback(data, section);
        };
        var resetErrors = function() {
            $scope.errorMessages = [];
        };
        
        ///////////////////////For send Offer///////////////////////////
         $scope.sendOffer = function () {
            var url = templateBuilderService.getUrl('sendOffer'),
                payload = {
                    candidate_id : $scope.module.candidate, 
                    body : $scope.template.body, 
                    action_id : $scope.module.actionId 
                };

            serverUtilityService.putWebService(url, payload).then(function (data) {
                if (data.status == "success") {
                    utilityService.showSimpleToast(data.message);
                    $location.url('/dashboard/alert');
                }
            });
        };
        $scope.revokeOffer = function () {
            var url = templateBuilderService.getUrl('revokeOffer'),
                payload = {
                    candidate_id : $scope.module.candidate, 
                    body : $scope.template.body, 
                    action_id : $scope.module.actionId 
                };

            serverUtilityService.putWebService(url, payload).then(function (data) {
                if (data.status == "success") {
                    utilityService.showSimpleToast(data.message);
                    $location.url('/dashboard/alert');
                }
            });
        };
        
        $scope.backHashMap = {
            prejoining: {
                tab: "letter",
                subtab: "letters"
            },
            employee_exit :{
                tab: "letter"
            },
            payroll :{
              tab: "payroll",
              subtab: "salarySlip"
            },
            recruitment:{
              tab: "recruitment",
              subtab: "template"
            }
        };
        if($routeParams.refUrl == 'fndf'){
            $scope.backHashMap.employee_exit.subtab = "fullFinal";
        }
        if($routeParams.module=='employee_exit' && $routeParams.refUrl == 'certificate'){
            $scope.backHashMap.employee_exit.subtab = "certificates";
        }
        if($routeParams.refUrl == 'noDues'){
           $scope.backHashMap.employee_exit.subtab = "eSepration"; 
        }
    
        $scope.navigateToLndSettings=function () {
                $location.url('/lndSetting').search({
                    lndId:$routeParams.lndId,
                    moduleName:'lnd',
                    currentTab:2
                })
        }
    
        // if($routeParams.refUrl=='lnd')
        // {
        //     $location.
        // }
        $scope.navigateToBack = function() {
            if($scope.module.isRefrenceVisible){
                $location.url('/dashboard/alert');
                return false;
            }
            if($routeParams.module!=='lnd')
            {
                var tab, subtab;
                tab = $scope.backHashMap[$routeParams.module].tab;
                subtab = $scope.backHashMap[$routeParams.module].subtab;
            
                $location.url('admin').search({
                    "tab": tab, 
                    "subtab": subtab
                });
            }
        };   
        ///////////////////////////////////////Upload Functionality//////////////////////////////////////
        $scope.templateModel = {
            attached: null,
            isDocumentUploaded : false,
            isLoaded : false
        };
        $scope.remove = function(item){
            item.isDocumentUploaded = false;
            item.file_name = "";
        };
        
        $scope.selectDoc = function (file){
            if(file){
               $scope.templateModel.attached = file; 
               $scope.templateModel.isLoaded = false; 
               $scope.templateModel.isDocumentUploaded = true; 
            }else{
                $scope.templateModel.attached = null; 
               $scope.templateModel.isLoaded = false; 
               $scope.templateModel.isDocumentUploaded = false; 
            }
        };
        
//        $scope.bindFileChangeEvent = function(item) {
//            $timeout(function() {
//                $("input[type=file]").on('change',function(){
//                        item.isLoaded = false;
//                        item.isDocumentUploaded = true;
//                });
//            }, 100);            
//        };
        $scope.lndSaveDisabled=true
        $scope.uploadTemplate = function () {
            var url = templateBuilderService.getUrl($scope.tmplConstant.refUrl) + "/content/" + $scope.module.template,
                    payload = {
                        file: $scope.templateModel.attached
                    };
            serverUtilityService.uploadWebService(url, payload).then(function (data) {
                if (data.status == "success") {
                    $scope.lndSaveDisabled=false
                    utilityService.showSimpleToast(data.message);
                    if(utilityService.getValue($routeParams, "moduleName") ==='letterDocument') {
                        self.selectedIndex = 2;
                    } else {
                        $scope.navigateToBack();
                    }
                }
            });
        };
        
        $scope.previewOfferLetter = function (){
            var offerUrl = "//docs.google.com/viewerng/viewer?url="+templateBuilderService.getUrl('downloadTemplate') + "/" + $scope.module.template;;
                            $window.open(offerUrl);
//            var url = templateBuilderService.getUrl('downloadTemplate') + "/" + $scope.module.template;
//            serverUtilityService.getWebService(url)
//                    .then(function (data){
//                        console.log(data);
//                        var offerUrl = "//docs.google.com/viewerng/viewer?url="+templateBuilderService.getUrl('downloadTemplate') + "/" + $scope.module.template;;
//                            $window.open(offerUrl);
//                    });
        };
        
        
    }
]);