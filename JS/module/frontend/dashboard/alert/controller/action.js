app.controller('ActionController', [
	'$scope', '$rootScope', '$modal', '$location', '$routeParams', '$q', '$timeout', '$window', 'utilityService', 'ServerUtilityService', 'ActionService', 'FORM_BUILDER', 'RequestLeaveService', 'TimeOffService',
	function ($scope, $rootScope, $modal, $location, $routeParams, $q, $timeout, $window, utilityService, serverUtilityService, actionService, FORM_BUILDER, requestLeaveService, timeOffService) {
        $scope.action = actionService.buildActionObject();
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.fromToLeaveTypeMapping = requestLeaveService.buildLeaveTypeMappingObject();
        $scope.approveWithComment = {
            isApproveWithComment: false
        };
        $scope.requestApproveForm = {
            selectedItem: null,
            empForm: actionService.buildFormObject(),
            apprForm: actionService.buildFormObject(),
            viewMode: null,
            extraQuestions: null
        };
        $scope.empRequestForm = {
            selectedItem: null,
            empForm: actionService.buildFormObject(),
            viewMode: null
        };
        $scope.eligible = {
            enabled: $scope.isEligibleForClaim(),
            amountDetails: null
        };

        $scope.downloadAttachment = {
            urlPrefix : null,
            regularizationId: null
        };

        var syncProfileFieldForm = function (model) {
            $scope.profileFieldForm = {
                visible: utilityService.getValue(model, 'profile_field_name') ? true : false,
                name: utilityService.getValue(model, 'profile_field_name'),
                oldValue: utilityService.getValue(model, 'old_value'),
                newValue: utilityService.getValue(model, 'new_value'),
                is_repeatable : utilityService.getValue(model, 'is_repeatable', false),
                repeated_child_data : utilityService.getValue(model, 'repeated_child_data', [])
            };
        };
        syncProfileFieldForm();
        
        var getPendingActionCount = function(data) {
            $scope.alert.actionCount = actionService.getPendingActionCount(data);
        };
        var resetActionObject = function() {
            $scope.action.list = [];
            $scope.action.visible = false;
        };
        $scope.isAdminModulePermission = function(permission) {
            return $scope.modulePermissions.admin[permission];
        };
        var checkForModuleExistence = function() {
            var requestTypeList = [],
                requestTypeObject = {};

            angular.forEach($scope.action.requestTypeList, function(value, key) {
                if(!value.slug || $scope.isEmpSideNavVisible(value.permission) 
                    || $scope.isAdminModulePermission(value.permission) || value.slug === 'pip') {
                    requestTypeList.push(value);
                    if (value.slug) {
                        requestTypeObject[value.slug] = {
                            count: 0
                        } 
                    }                    
                }
            });

            $scope.action.requestTypeList = requestTypeList;
            $scope.action.requestTypeObject = requestTypeObject;
        };
        var reBuildApiResponse = function (data) {
            angular.forEach(data.data, function(value, key) {                            
                value.dummy_status = value.status == 1 ? 1 : 0;
                value.filter_status = value.status == 11 
                    ? 2 : (value.status == 10 ? 3 : (value.status == 15 ? 4 : 1));
                var moduleSlug = utilityService.getValue($scope.action.requestTypeModuleSlugMapping, value.type);
                if (moduleSlug && utilityService.getInnerValue($scope.action, 'requestTypeObject', moduleSlug)) {
                    ++$scope.action.requestTypeObject[moduleSlug].count;
                }
            });
        };
        var actionListCallback = function (data) {
            if(utilityService.getValue(data, 'data')) {
                checkForModuleExistence();
                reBuildApiResponse(data);
                data.data.sort(utilityService.dynamicSortMultiple("-dummy_status", "-time"));
                $scope.action.list = actionService.buildAlertList(data.data);
                $scope.action.isChecked = false;
                $scope.action.checkedCount = 0;
                $scope.action.visible = true;
            }
        };
        var getActionList = function(initialLoading) {
            initialLoading = angular.isDefined(initialLoading) ? initialLoading : false;
            if(initialLoading) {
                resetActionObject();
            }
            var url = actionService.getUrl('action'),
                params = {
                    status: $scope.action.tabs.status
                };

            serverUtilityService.getWebService(url, params)
                .then(function(data) {
                    actionListCallback(data);                        
                });
        };       
        getActionList(true);
        
        var errorCallback = function(data) {
            $scope.errorMessages = [];
            if(angular.isString(utilityService.getInnerValue(data, 'data', 'message'))) {
                $scope.errorMessages.push(data.data.message);
            } else {
                angular.forEach(utilityService.getInnerValue(data, 'data', 'message'), function(val, key) {
                    angular.forEach(val, function(v, k) {
                        $scope.errorMessages.push(v);
                    });
                });
            }
        };
        $scope.setSelectedIndex = function(item, key, form) {
            if ($scope.action[key] == item._id) {
                $scope.action[key] = -1;
                $scope.action.confirm = null;
                if (angular.isDefined(form)) {
                    utilityService.resetForm(form);
                }                
            } else {
                $scope.action[key] = item._id;
                var status1 = (item.type == 'self_initiate_exit_request' || item.type == 'approver_confirmation_flow') ? $scope.action.model.status : $scope.action.possibility.approved
                $scope.changeConfirmAction(2, status1, undefined, $scope.action.actionItem, 'selectedActionIndex');
            }
        };
        $scope.askForConfirmation = function(flag) {
            $scope.action.toggle = flag;
            if(!flag) {
                $scope.action.confirm = null;
            }
        };
        var showCommentModal = function(form, item, key) {
            $scope.actionKey = key;
            $scope.action.model.comment = null;
            utilityService.resetForm(form);
            $scope.openModal();
        };
        $scope.changeConfirmAction = function(confirm, status, form, item, key) {
            if(confirm == 1) {
                showCommentModal(form, item, key);
            } else {
                $scope.action.model.status = status;
                $scope.action.source == "single" ? takeAction() : takeBulkAction();
            }
        };
        $scope.viewTimesheetDetail = function(actionItem) {
            $scope.timesheetDetail = null;
            var url = actionService.getUrl('timesheetDetails') + '/' + actionItem.timesheet_setting_id + '/' + actionItem.log_id;
            serverUtilityService.getWebService(url).then(function(data) {
                var item = utilityService.getInnerValue(data, 'data', 'list');
                item.heads = utilityService.getInnerValue(data, 'data', 'heads');
                item.duration_type = utilityService.getInnerValue(data, 'data', 'duration_type');

                $scope.timesheetDetail = item;
                $scope.openModal('viewDetails', 'timesheet-view-details.tmpl.html', 'lg');
                $timeout(function() {
                    $('#alert-menu-content').hide();
                }, 500);
            });
        };
        $scope.noOfElements = function(obj) {
            if(obj) {
                return angular.isArray(obj) ? obj.length : Object.keys(obj).length;
            }
            return 0;
        };
        $scope.addComment = function(source, status, item, form, approveWithComment) {
            item = angular.isDefined(item) ? item : null;
            $scope.action.source = source;
            $scope.action.model.status = status;
            if(item){
                angular.copy(item, $scope.action.objCopyItem);
            }
            $scope.approveWithComment.isApproveWithComment = ((status == $scope.action.possibility.approved)
                && (utilityService.getValue(item, 'type') =='expense_request'
                    || utilityService.getValue(item, 'type') == 'travel_request')
                && approveWithComment) ? true : false;
            
            (status == (utilityService.getValue(item, 'type') != 'self_initiate_exit_request'
                && (utilityService.getValue(item, 'type') != 'approver_confirmation_flow')
                && $scope.action.possibility.rejected)) || $scope.approveWithComment.isApproveWithComment
                    ? showCommentModal(form)
                    : (source == "single" ? $scope.setSelectedIndex(item, 'selectedActionIndex', form)
                        : $scope.askForConfirmation(true));                     
        };

        var takeAction = function() {
            var url = $scope.action.objCopyItem.exit_id 
                ? actionService.getUrl('rejectExitCer') + "/" + $scope.action.objCopyItem.exit_id
                :  $scope.action.objCopyItem.type== 'elcm_sign_pending' 
                ? actionService.getUrl('rejectElcmCer') + "/" + $scope.action.objCopyItem._id + "/" + $scope.action.objCopyItem.new_emp_id
                :  actionService.getUrl('action') + "/" + $scope.action.objCopyItem._id,
                payload = actionService.buildActionPayload($scope.action.model);

            if($scope.action.objCopyItem.exit_id){
                payload.action_id = $scope.action.objCopyItem._id;
                payload.template_id = $scope.action.objCopyItem.template_id;
                payload.status = 14;
            }
            if($scope.action.objCopyItem.type== 'elcm_sign_pending'){
                payload.letter_id = $scope.action.objCopyItem.template_id;
            }
            if($scope.action.objCopyItem.type == 'self_initiate_exit_request' || $scope.action.objCopyItem.type == 'approver_confirmation_flow'){
                if($scope.action.objCopyItem.type == 'approver_confirmation_flow') {
                    payload.confirmation_action = utilityService.getInnerValue($scope.requestApproveForm, 'extraQuestions', 'confirmation_action');
                    payload.increase_probation_days = utilityService.getInnerValue($scope.requestApproveForm, 'extraQuestions', 'increase_probation_days');
                }
                payload = actionService.addQuestionsInPayload(payload, $scope.requestApproveForm.apprForm.questions);
            }
            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    if(data.status == 'success') {
                        $scope.action.confirm = null;
                        if (!$scope.action.objCopyItem.exit_id && $scope.action.model.status != 11) {
                            $scope.setSelectedIndex($scope.action.objCopyItem, 'selectedActionIndex');
                        }
                        if($scope.modalInstance.comment){
                            $scope.closeModal();
                        }
                        if($scope.action.objCopyItem.type== 'self_initiate_exit_request' || $scope.action.objCopyItem.type== 'approver_confirmation_flow'){
                            $scope.requestApproveForm.selectedItem = null;
                            $scope.requestApproveForm.extraQuestions = null;
                            $scope.closeModal('requestApproveFormQuestion');
                        }
                        $scope.errorMessages = [];
                        utilityService.showSimpleToast(data.message);
                        $scope.action.model.comment = null;
                        getActionList();
                        broadCastEvent('get-alert-count', {});
                    } else {
                        errorCallback(data);
                    }
                });
        };
        var broadCastEvent = function(event, params) {
            $rootScope.$broadcast(event, {
                params: params
            });
        };
        var takeBulkAction = function() {
            var url = actionService.getUrl('bulkAction'),
                payload = actionService.buildBulkActionPayload($scope.action);

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    $scope.action.confirm = null;
                    $scope.askForConfirmation(false);
                    $scope.closeModal();
                    utilityService.showSimpleToast(data.message);
                    $scope.action.model.comment = null;
                    getActionList();
                    broadCastEvent('get-alert-count', {});
                });
        };
        $scope.publishJob = function(item) {
            // $scope.action.objCopyItem._id = item._id.$id;
            // takeAction();
            $window.open('#/dashboard/job-publish?planId='+item.log_id);
        };
        $scope.saveComment = function(form) {
            $scope.action.source == "single" ? takeAction() : takeBulkAction();              
        };
        $scope.isDurationCustom = function() {
            return $scope.action.duration.slug == 'custom';
        };
        $scope.changeDateRange = function(model) {
            var dateRange = actionService.getDateRange(model.duration.slug);
            model.fromDate = dateRange.from;
            model.toDate = dateRange.to;
        };
        $scope.resetDate = function() {
            $scope.action.fromDate = null;
            $scope.action.toDate = null;
        };
        $scope.history = function(item) {
            var hashmap = {
                leave_request: 2,
                regularization_request: 1
            },
            searchParams = {
                tabIndex: hashmap[item.type]
            };

            if (item.type === 'leave_request') {
                searchParams.source = 'team'
            }
            $location.url('dashboard/profile/' + item.new_emp_id).search(searchParams);
        };
        $scope.isAtleastOneActionChecked = function() {
            var isChecked = false;

            angular.forEach($scope.action.filterList, function(value, key) {
                isChecked = isChecked || value.isChecked;
            });

            return isChecked;
        };
        var toggleModal = function(id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false, 
                    show: true
                }) 
                : $('#' + id).modal('hide');
        };
        /*var listenerCleanFn = $rootScope.$on('ev', cb);
        $scope.$on('$destroy', function() {
            listenerCleanFn();
        });*/
            
        /************ Signatue Option Updated by developer ************/
        $scope.isOtherType = function (item) {
            return item.type != 'send_offer_letter' && item.type != 'send_revoke_letter' 
                && item.type != 'provision_unassign' && item.type != 'clearance_trigger_poc'
                && item.type != 'exit_interview_interviewer' && item.type != 'exit_interview_employee' 
                && item.type !='exit_certificate_sign_pending'
                && item.type !='elcm_sign_pending'
                && item.type !='letter_acknowledgement'
                && item.type != 'self_initiate_exit_request'
                && item.type != 'approver_confirmation_flow'
                && item.type != 'employee_confirmation_flow_request'
                && item.type !='lnd_sign_pending'
                ;
        };
        $scope.palceSignatue = function (item, isRevoke) {
            var obj = {
                template: item.template_id,
                refUrl: 'letter',
                edit: true,
                module: 'prejoining',
                template_type: 2,
                isRefrenceVisible: true,
                candidate: item.candidate_id,
                actionId: item._id,
            };
            if (angular.isDefined(isRevoke)) {
                obj.isRevoked = isRevoke;
            }
            $location.url('template-builder').search(obj);
        };

        /************ Start Exit Actions ************/
        $scope.triggerExitCertificate = function(item) {
            utilityService.setStorageValue('fromUrlToSignature', $location.path());
            $location.url('template-sign').search({
                template_id: item.template_id,
                certificate_template_id: item.certificate_template_id,
                exit_id: item.exit_id,
                emp_id: item.emp_id ? item.emp_id : item.new_emp_id,
                action_id: item._id,
                letter_type : item.letter_type_name
            });
        };        
        $scope.viewCertificate = function (item){
            if(item.certificate_file_download_url.indexOf('emp-download-letter') >= 0){
                var mainUrl = "https://docs.google.com/viewerng/viewer?url=" + item.certificate_file_download_url + "/" + utilityService.getStorageValue('accessToken');
            }else{
                var mainUrl = "https://docs.google.com/viewerng/viewer?url=" + item.certificate_file_download_url;
            }
            $window.open(mainUrl);
        };        
        $scope.revokeExitClearances = function (item) {
            var url = (item.type == 'clearance_trigger_poc') 
                ? actionService.getUrl('revokeClearance') : actionService.getUrl('revokeProvision'),
                payload = actionService.bulidExitClearanceRevokePayload(item);

            serverUtilityService.putWebService(url, payload).then(function (data) {
                if (data.status == 'success') {
                    utilityService.showSimpleToast(data.message);
                    getActionList();
                }
            });
        };
        var syncFormModel = function (model) {
            $scope.formModel = actionService.buildFormModel(model);
            $scope.questionList = actionService.buildQuestionModel(model.exit_form_detail);
        };        
        $scope.answerQuestions = function(form){
            syncFormModel(form);
            toggleModal("form-ques-action", true);
        };
        $scope.submitAnswers = function(form){
            var url = actionService.getUrl('submitExitForms'),
                payload = actionService.buildQuestionPayload($scope.questionList, form, $scope.formModel);

            serverUtilityService.putWebService(url ,payload).then(function(data) {
                if(data.status == 'success'){
                    utilityService.showSimpleToast(data.message);
                    toggleModal("form-ques-action", false);
                    getActionList();
                }
            });
        };
        var syncRequestLeaveModel = function(model) {
            $scope.requestLeave = requestLeaveService.buildLeaveRequestModel(model);
            $scope.requestLeave.doc_path = utilityService.getValue(model, 'doc_path');
        };
        var viewFormDetailsCallback = function(model) {
            var def = "1970-01-01";
            $scope.questionList = utilityService.getInnerValue(model , 'form_detail', 'questions', []);
            angular.forEach($scope.questionList, function(value, key) {
                if(value.question_type != 3 && angular.isDefined(value.answer)
                    && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];                    
                }
                // If question type is of time
                if(utilityService.getValue(value, 'answer') && value.answer && value.question_type == 6) {
                    value.answer = new Date(def + " " + value.answer);
                }

                // If question type is of date
                if(utilityService.getValue(value, 'answer') && value.answer && value.question_type == 5) {
                    value.answer = utilityService.getDefaultDate(value.answer);
                }
            });
            $scope.openOtherModal('requestForm','requester-form.html');
            //toggleModal("requester-form", true);
        };
        $scope.viewFormDetails = function(item) {
            $scope.downloadAttachment.urlPrefix = null;
            syncProfileFieldForm();
            $scope.questionList = [];            
            var url = actionService.getUrl('requestedLeave') + "/" + item.log_id; 
            serverUtilityService.getWebService(url).then(function(data) {
                if (utilityService.getValue(data, 'status') === 'success') {
                    data.data.isDisabled = true;
                    syncRequestLeaveModel(data.data);
                    viewFormDetailsCallback(data.data);
                } else {
                    alert(utilityService.getValue(data, 'message'));
                }                             
            });
        };
        $scope.viewAttendanceFormDetails = function(item) {
            $scope.downloadAttachment.urlPrefix = 'downloadCompOffFormAttachment';
            $scope.downloadAttachment.regularizationId = item.log_id;
            syncProfileFieldForm();
            var url = actionService.getUrl('regularizationForm') +"/" + item.log_id;
            serverUtilityService.getWebService(url).then(function(data) {
                if (utilityService.getValue(data, 'status') === 'success') {
                    $scope.requestLeave = null;
                    $scope.regularizationData = data.data;
                    viewFormDetailsCallback(data.data);
                } else {
                    alert(utilityService.getValue(data, 'message'));
                }              
            });
        };
        $scope.viewGenericFormDetails = function(item, urlPrefix) {
            $scope.downloadAttachment.urlPrefix = null;
            var url = actionService.getUrl(urlPrefix) +"/" + item.log_id;
            serverUtilityService.getWebService(url).then(function(data) {
                if(urlPrefix === 'viewFormProfileFieldChange') {
                    syncProfileFieldForm(data.data);
                }
                viewFormDetailsCallback(data.data);                
            });
        };
        $scope.alertOnSelect = function(selected) {
            $scope.accordionTab.alert.selected = selected;
        };
        if(utilityService.getValue($routeParams, 'action') == 1) {
            $scope.accordionTab.alert.selected = utilityService.getValue($routeParams, 'action');
            //$scope.action.requestType = utilityService.getValue($routeParams, 'request_type');
            $timeout(function() {
                //, "request_type": null
                $location.search({"action": null});
            }, 1000);
        }

        $scope.paginationObject = utilityService.buildPaginationObject(); 
        $scope.paginationObject.pagination.currentPage = utilityService.setStorageValue('NewHirePageNo', 1);       
        $scope.paginationObject.pagination.currentPage = utilityService.getStorageValue('NewHirePageNo') 
            ? utilityService.getStorageValue('NewHirePageNo') : 1;
        $scope.paginationObject.pagination.numPerPage = utilityService.getStorageValue('NewHireNumPerPage') 
            ? utilityService.getStorageValue('NewHireNumPerPage') : 10;
        $scope.$watch("paginationObject.pagination.numPerPage", function(newVal,oldVal) {
            if( newVal != oldVal) {
                $scope.paginationObject.pagination.currentPage = 1;
            } else {
                $scope.paginationObject.pagination.currentPage = utilityService.getStorageValue('NewHirePageNo') ? utilityService.getStorageValue('NewHirePageNo') : 1;
            }
            utilityService.setStorageValue('NewHireNumPerPage',newVal);
        }, true);

        $scope.getRecord = function (newv, oldv) {
            utilityService.setStorageValue('NewHirePageNo', newv);
        };
        $scope.viewPost = function (item) {
            var url = actionService.getUrl('postDetail') + "/" + item.log_id; 
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.item = data.data;
                    toggleModal("post-approve-reject", true);         
                });             
        };        
        $scope.viewExpenseRequest = function (item) {
            $location.url('dashboard/view-expense').search({'expense_id': item.log_id});              
        };        
        $scope.loanDetails = function (item){
            $location.url('loan-details').search({requestId:item.log_id,isAction:true});
        };
        $scope.viewCandidateOffer = function (item){
            $window.open('#/recruitmentOfferWorkflow?url=' + item.certificate_file_download_url+'&id='+item._id)
            //$location.url('recruitmentOfferWorkflow').search({requestId:item.log_id});
        };
        $scope.viewComment = function (item) {
            $scope.action.comment.text = utilityService.getValue(item, 'comment');
            $scope.openModal('comment', 'view-comment-alert.html');
        };

        /********* Start Angular Modal Section *********/
        $scope.openModal = function(instance, template, size) {
            $scope.errorMessages = [];
            instance = angular.isDefined(instance) ? instance : 'comment';
            template = angular.isDefined(template) ? template : 'add-comment.tmpl.html';
            size = angular.isDefined(size) ? size : 'sm';

            $scope.modalInstance[instance] = $modal.open({
                templateUrl : template,
                scope : $scope,
                // windowClass : 'zindex',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            instance = angular.isDefined(instance) ? instance : 'comment';
            if (instance === 'requestApproveFormQuestion' || instance === 'viewDetails' || instance === 'flexiPayComponentsApproverForm') {
                $scope.requestApproveForm.approverChain = null;
                $scope.toggleAlert(true);
            }

            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
            //$scope.modalInstance.close() also works I think            
        };
        /********* End Angular Modal Section *********/

        
        $scope.viewTravelExpenseDetails = function (item) {
            if (item.type == 'expense_request' || item.type == "group_employee_expense_request") {
                $window.open('#/dashboard/view-expense?expense_id=' + item.log_id + "&requestFor=" + item.new_emp_id + "&page=action&actionId=" + item._id + "&acs=" + item.status, '_blank');
            } else if (item.type == 'travel_request' || item.type == "co-traveller_travel_request") {
                $window.open('#/travel-request-details?requestId=' + item.log_id + "&empId=" + item.new_emp_id + "&page=action&actionId=" + item._id + "&acs=" + item.status, '_blank');

            }
        };
        $scope.paginationObject.pagination.numPerPage = 10;
        
        $scope.viewJobDetails = function (item) {
            if (item.type == 'new_job_requisition') {
                $window.open('#/dashboard/job-detail?id=' + item.log_id+'&log_id=' +item._id +'&isAction='+true , '_blank');
                //$location.url('job-detail').search({id:item.log_id,isAction:true});

            }
        };

        /***** Start: Alert View Claim Details Section *****/
        $scope.viewEmployeeClaims = function (item) {
            var url = actionService.getUrl('claimDetails') + "/" + item.log_id; 
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.alert.salaryClaims = utilityService.getInnerValue(data, 'data', 'details');
                    $scope.eligible.amountDetails = utilityService.getInnerValue(data, 'data', 'eligibility');
                    $scope.openOtherModal('actionEmployeeClaim', 'action-employee-claim.html', 'lg');
                });            
        };
        $scope.viewClaimDocument = function(claim, proof) {
            var url = actionService.getUrl('claimProof') + "/" + claim._id + "/" + proof.slug;
            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.openOtherModal = function (instance, tempUrl, size){
            size = size || 'md';
            
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: tempUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass: 'fadeEffect zindex',
                size: size
            });
        };        
        $scope.closeOtherModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };
        /***** End: Alert View Claim Details Section *****/
        
        $scope.viewDetails = function (item) {
            switch(item.type){
                case 'letter_acknowledgement' :
                    if(item.module_name && item.module_name=='lnd')
                    {
                        $window.open('#/acknowledge-letter?empId=' + item.targeted_emp + "&letter=" + item.template_id + "&typeName=" + item.template_type_name + "&title=" + item.template_name +"&moduleName=lnd"+"&trainingRequest="+item.trainingRequestId+ "&status=0", '_blank');
                    }
                    else
                    {
                        $window.open('#/acknowledge-letter?empId=' + item.targeted_emp + "&letter=" + item.template_id + "&typeName=" + item.template_type_name + "&title=" + item.template_name + "&status=0", '_blank');
                    }
                    break;
                default: console.log('');
            }
        };

        /*****Start: EmpApprFormAction *****/
        $scope.getEmpApprForm = function(item) {
            var requestsArray = [];
            if(item.type == 'self_initiate_exit_request') {
                requestsArray = [
                    serverUtilityService.getWebService(actionService.getUrl('viewSelfInitiateFormDetails') +"/" + item.log_id),
                    serverUtilityService.getWebService(actionService.getUrl('approverSelfInitiateForm') +"/" + item.log_id)
                ];
            } else if(item.type == 'approver_confirmation_flow') {
                requestsArray = [
                    serverUtilityService.getWebService(actionService.getUrl('empConfirmationForm') +"/" + item.log_id),
                    serverUtilityService.getWebService(actionService.getUrl('approverNHMForm') +"/" + item.log_id)
                ];
            }
            $q.all(requestsArray).then(function(data) {
                $scope.requestApproveForm.selectedItem = item;
                $scope.requestApproveForm.empForm = actionService.buildFormObject(utilityService.getInnerValue(data[0], 'data', 'form_detail'));
                $scope.requestApproveForm.apprForm = actionService.buildFormObject(utilityService.getInnerValue(data[1], 'data', 'form_detail'));
                if(item.type == 'approver_confirmation_flow') {
                    $scope.requestApproveForm.approverChain = utilityService.getInnerValue(data[0], 'data', 'approver_chain');
                    $scope.requestApproveForm.extraQuestions = {
                        confirmation_action: utilityService.getInnerValue(data[1], 'data', 'confirmation_action'),
                        increase_probation_days: utilityService.getInnerValue(data[1], 'data', 'increase_probation_days'),
                        is_manager_descretion: utilityService.getInnerValue(data[1], 'data', 'is_manager_descretion', true),
                        probation_days_options: utilityService.getInnerValue(data[1], 'data', 'probation_days_options', [])
                    };
                }
                $scope.requestApproveForm.last_working_date = utilityService.getInnerValue(data[0], 'data', 'last_working_date');
                $scope.requestApproveForm.last_working_date_source = 'employee';
                if (!utilityService.getValue($scope.requestApproveForm, 'last_working_date')) {
                    $scope.requestApproveForm.last_working_date = utilityService.getInnerValue(data[1], 'data', 'last_working_date');
                    $scope.requestApproveForm.last_working_date_source = 'approver';
                }
                $scope.openModal('requestApproveFormQuestion', 'request-approve-form-question-tmpl.html', 'lg');
                $timeout(function() {
                    $('#alert-menu-content').hide();
                }, 500);
            });
        };
        /***** End: EmpApprFormAction *****/

        /***** Start: EmpRequestFormAction *****/
        $scope.getEmployeeRequestForm = function(item) {
            var url = actionService.getUrl('empConfirmationForm') +"/" + item.log_id;
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.empRequestForm.selectedItem = item;
                $scope.empRequestForm.empForm = actionService.buildFormObject(utilityService.getInnerValue(data, 'data', 'form_detail'));
                $scope.openModal('empRequestFormQuestion', 'emp-request-form-question-tmpl.html', 'lg');
                $timeout(function() {
                    $('#alert-menu-content').hide();
                }, 500);
            });
        };
        $scope.submitEmployeeRequestForm = function(item) {
            var url = actionService.getUrl('submitEmpConfirmationForm') +"/" + item.log_id;
            var payload = {};
            payload = actionService.addQuestionsInPayload(payload, $scope.empRequestForm.empForm.questions);
            serverUtilityService.postWebService(url, payload).then(function(data) {
                if(data.status == 'success') {
                    $scope.closeModal('empRequestFormQuestion');
                    utilityService.showSimpleToast(data.message);
                    $scope.empRequestForm.selectedItem = null;
                } else {
                    errorCallback(data);
                }
            });
        }
        /***** End: EmpRequestFormAction *****/

        $scope.changeActionTabHandler = function (object) {
            $scope.action.tabs.selected = object.index;
            $scope.action.tabs.status = object.status;
            getActionList();
        };
        $scope.checkUncheckHandler = function(source, isChecked) {
            var count = 0;
            if (source === 'individual') {
                count = utilityService.getValue($scope.action, 'checkedCount', 0);
                isChecked ? ++count : --count;
                $scope.action.checkedCount = count;
                $scope.action.isChecked = ($scope.action.filterList.length == $scope.action.checkedCount) ? true : false;
            } else {                
                angular.forEach($scope.action.filterList, function(value, key) {
                    value.isChecked = isChecked;

                    if (isChecked) {
                        ++count;
                    }
                });
                $scope.action.checkedCount = count;
            }
        };

        $scope.flexiPayForms = {
            components: [],
            visible: false
        }
        $scope.viewFlexiForm = function(item) {
            $scope.flexiPayForms.visible = true;
            var url = actionService.getUrl('payrollFlexiPayForms') +"/" + item.log_id;
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.flexiPayForms.components = utilityService.getValue(data, 'data', []);
                angular.forEach($scope.flexiPayForms.components, function(val, key) {
                    actionService.buildQuestionList(utilityService.getInnerValue(val.form_data, 'form_detail', 'questions', []))
                });
                $scope.flexiPayForms.visible = true;
                var modelSize = 'lg';
                if(!$scope.flexiPayForms.components.length) {
                    modelSize = 'sm';
                }
                $scope.openModal('flexiPayComponentsApproverForm', 'flexi-pay-components-approver-form.tmpl.html', modelSize);
                $timeout(function() {
                    $('#alert-menu-content').hide();
                }, 500);
            });
        };

        $scope.downloadAnswerAttachment = function(item) {
            var url = null;
            url = ($scope.downloadAttachment.urlPrefix === 'downloadCompOffFormAttachment')
            ? actionService.getUrl('downloadCompOffFormAttachment')+ "/" + item._id + "/" + $scope.downloadAttachment.regularizationId
            : actionService.getUrl('downloadAnswerAttachment') + "/" + item._id + "/" + $scope.user.loginEmpId;

            $scope.viewDownloadFileUsingForm(url);
        };
        $scope.viewPIPDetails = function (item) {
            $scope.formSubmitHandler('pipActiactionon', true);
            var url = actionService.getUrl('pipAction') + "/" + item._id;

            serverUtilityService.putWebService(url, {}).then(function(data) {
                $scope.formSubmitHandler('pipAction', false);
                if (utilityService.getValue(data, 'status') == "success") {
                    $location.url('dashboard/my-team').search({'subtab':'pip'});
                }
            });
        };
        $scope.isActionForPIP = function (item) {
            return $scope.action.possibleSlug.pip.indexOf(utilityService.getValue(item, 'type')) >= 0;
        };
        $scope.viewCandidateProfile = function (item) {
            var queryParams = $.param({
                candidateId: angular.isObject(item.candidate_id) ? item.candidate_id.$id : item.candidate_id
            });

            $window.open('#/dashboard/candidate-details?' + queryParams, '_blank');
        };
    }
]);
