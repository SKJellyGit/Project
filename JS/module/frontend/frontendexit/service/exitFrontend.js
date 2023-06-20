app.service('FrontendExitService', ['utilityService', 'FORM_BUILDER',       
	function (utilityService, FORM_BUILDER) {
		'use strict';

        this.url = {	   
            getEmployee: 'user-addition/all-user-with-permission', //'user-exit/employees-list',
            getExitType : 'user/exit/type',
            exitEmpInfo : 'user-exit/employee-info',
            getEmpRoles : 'employee/assigned-roles',
            getAllocationList : 'user-exit/provisions',
            group : 'org-details/group',
            getExitDetail : 'user-exit/details',
            unassign : 'user-exit/clearance',
            empDues : 'user-exit/no-dues',
            exitFeedback : 'user-exit/exit-feedback',
            getExitForm : 'exit-formalities/exit-interview-form?status=true',
            getExitSurveyForm : 'exit-formalities/exit-survey-form?status=true',
            getExitCertifiates : 'letters/types-with-dates/employee_exit',
            exitCertifiates : 'user-exit/add-certificates',
            getNoDues : 'user-exit/clearance-by-relevance',
            provisions : 'user-exit/provisions',
            getExitList : 'user-exit/details',
            allmandatorygroup : 'user-management/active/group?mandatory=true&field=true',
            getDraftList : 'user-exit/drafts',
            finalizeExit : 'user-exit/initiate',
            deleteDraftList : 'user-exit/details',
            getProbationDetails : 'user-exit/probation-detail',
            exitSettings: 'exit-formalities/settings',
            revokeAccess: 'remove/access',           
            payrollError: 'user-exit/in-sync-detail',
            removeCertificate: 'user-exit/remove-certificate',
            viewPermission:'user-exit/permission-detail',
            markDone:'user-exit/relieved',
            setReminder:'reminder/settings',
            previewOffer: 'user-exit/offer-history',
            getAssignedTeam:'user-exit/team',
            getEmpByexit: 'user-exit/employees',
            getEmpOffDay: "employee/offleave",
            provisionByManager: "provisions/settings/by-manager",
            otherAutorities:"user-exit/other-clearance-settings",
            viewFeedbackForms:"user-exit/form-detail",
            viewSelfInitiateFormDetails: 'employee/self-exit-form-detail',
            approverSelfInitiateForm: 'employee/self-exit-approver-form-detail',
            pendingRequests: 'user-exit/self-initiate-exit/pending-requests',
            noDuesReport: 'user-exit/clearances-report'
        };
        this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
        this.buildActionObject = function() {
	        return {
                add: false,
                edit: false
            };
        };
        this.buildEmployeeInfo = function(model) {
            return {
                leaveMinDate : utilityService.getDefaultDate(utilityService.getValue(model, 'leaveMinDate'),false,true),
                employee_detail :utilityService.getValue(model, 'employee_detail'), 
                employee_preview :utilityService.getValue(model, 'employee_preview'), 
                employee_id : utilityService.getValue(model, 'employee_id'), 
                exit_type_id : utilityService.getValue(model, 'exit_type_id',1), 
                resignation_date : utilityService.getDefaultDate(utilityService.getValue(model, 'resignation_date'),false,true), 
                last_serving_date : utilityService.getDefaultDate(utilityService.getValue(model, 'last_serving_date'),false,true), 
                is_notice_period_applicable : utilityService.getValue(model, 'is_self_initiated') 
                    && angular.isUndefined(model.is_notice_period_applicable)
                        ? false : (utilityService.getValue(model, 'is_notice_period_applicable',true)),
                serving_notice_period : utilityService.getValue(model, 'serving_notice_period'), 
                is_waiver : utilityService.getValue(model, 'is_waiver',false), 
                waiver_days : parseFloat(utilityService.getValue(model, 'waiver_days')), 
                is_buyout : utilityService.getValue(model, 'is_buyout',false), 
                buyout_days : parseFloat(utilityService.getValue(model, 'buyout_days')), 
                is_gratuity : utilityService.getValue(model, 'is_gratuity',false), 
                is_trigger_gratuity : utilityService.getValue(model, 'is_trigger_gratuity',false), 
                trigger_gratuity_date : utilityService.getDefaultDate(utilityService.getValue(model, 'trigger_gratuity_date'),false,true), 
                is_immediate_pf : utilityService.getValue(model, 'is_immediate_pf',false),
                is_triger_immediate_pf : utilityService.getValue(model, 'is_triger_immediate_pf',false), 
                triger_immediate_pf_date : utilityService.getDefaultDate(utilityService.getValue(model, 'triger_immediate_pf_date'),false,true), 
                is_EDLI_on_draw : utilityService.getValue(model, 'is_EDLI_on_draw',false), 
                is_trigger_EDLI_on_draw : utilityService.getValue(model, 'is_trigger_EDLI_on_draw',false),
                trigger_EDLI_date : utilityService.getDefaultDate(utilityService.getValue(model, 'trigger_EDLI_date'),false,true), 
                admin_role : utilityService.getValue(model, 'admin_role',false),
                admin_role_revoke_date :utilityService.getDefaultDate(utilityService.getValue(model, 'admin_role_revoke_date'),false,true),
                non_admin_role : utilityService.getValue(model, 'non_admin_role',false),
                non_admin_role_revoke_date : utilityService.getDefaultDate(utilityService.getValue(model, 'non_admin_role_revoke_date'),false,true),
                feedback_detail : utilityService.getValue(model, 'feedback_detail'),
                exit_interview_date_from : utilityService.getValue(model, 'exit_interview_date_from'),
                exit_interview_date_to : utilityService.getValue(model, 'exit_interview_date_to'),
                feedback_trigger_date : utilityService.getValue(model, 'feedback_trigger_date'),
                revoke_detail : utilityService.getValue(model, 'revoke_detail'),
                exit_interview_by : utilityService.getValue(model, 'exit_interview_by'),
                certificates_detail :angular.isDefined(model)&& model && angular.isDefined(model.certificates_detail) && model.certificates_detail.length?model.certificates_detail:[{"autocompleteKey":"searchText0","letter_id":null,"sign_authority":null,"trigger_date":null,"due_date":null}]
            }
        };
        this.buildEmpInfoPayload = function(model) {
            var payload = { 
                employee_id : utilityService.getValue(model, 'employee_id'), 
                exit_type_id : parseInt(utilityService.getValue(model, 'exit_type_id',1)), 
                resignation_date : utilityService.getValue(model, 'resignation_date'), 
                last_serving_date : utilityService.getValue(model, 'last_serving_date'), 
                is_notice_period_applicable : utilityService.getValue(model, 'is_notice_period_applicable'), 
                serving_notice_period : utilityService.getValue(model, 'serving_notice_period',false), 
                is_gratuity : utilityService.getValue(model, 'is_gratuity'), 
                is_trigger_gratuity : utilityService.getValue(model, 'is_trigger_gratuity'), 
                is_immediate_pf : utilityService.getValue(model, 'is_immediate_pf'),
                is_triger_immediate_pf : utilityService.getValue(model, 'is_triger_immediate_pf'), 
                is_EDLI_on_draw : utilityService.getValue(model, 'is_EDLI_on_draw'), 
                is_trigger_EDLI_on_draw : utilityService.getValue(model, 'is_trigger_EDLI_on_draw'),
                trigger_EDLI_date : utilityService.getValue(model, 'trigger_EDLI_date'), 
                triger_immediate_pf_date : utilityService.getValue(model, 'triger_immediate_pf_date'), 
                trigger_gratuity_date : utilityService.getValue(model, 'trigger_gratuity_date')
            };
            if(!payload.serving_notice_period){
                payload.is_buyout = utilityService.getValue(model, 'is_buyout');
                payload.is_waiver = utilityService.getValue(model, 'is_waiver');
                payload.waiver_days = parseFloat(utilityService.getValue(model, 'waiver_days'));
                payload.buyout_days = parseFloat(utilityService.getValue(model, 'buyout_days'));
            }
            return payload;
        };
        this.buildRoleTypeObject = function() {
            return {
                1: "Admin",
                2: "Non-Admin"
            };
        };
        this.buildUnAssignAssetPayload = function(list) {
            var payload = [];
            angular.forEach(list, function (value, key) {
                var object = {
                    provision_id : angular.isObject(value.provision_id) ? value.provision_id.$id : value.provision_id
                };
                object.unassign_date = (value.unassign_date && !isNaN(new Date(value.unassign_date).getDate())) ? utilityService.dateFormatConvertion(value.unassign_date) : value.unassign_date;
                object.poc_notify_date = (value.notified_date && !isNaN(new Date(value.notified_date).getDate())) ? utilityService.dateFormatConvertion(value.notified_date) : value.notified_date;
                payload.push(object);
            });

            return payload;
        };
        this.buildNoDuesPayload = function (list) {
            var payload = [];
            angular.forEach(list, function (value, key) {
                var object = {
                    no_dues_id: value.nodue_id
                };
                if (1 == 1) {
                    object.notified_date = (value.notified_date && !isNaN(new Date(value.notified_date).getDate())) ? utilityService.dateFormatConvertion(value.notified_date) : value.notified_date;
                    object.due_date = (value.unassign_date && !isNaN(new Date(value.unassign_date).getDate())) ? utilityService.dateFormatConvertion(value.unassign_date) : value.unassign_date;
                }
                payload.push(object);
            });

            return payload;
        };
        this.buildEmpExitFeedbackPayload = function (list, enterviewerFlag, selectedFeedback, exitSettings) {
            var payload = [];
            angular.forEach(list, function (value, key) {
                var object = {};
                if(exitSettings.is_exit_interview && value.form_type == 'feedback'){
                    object.exit_form_id = value.exit_form_id;
                    object.form_type = value.form_type;
                    if (angular.isDefined(value.exit_interview_by_new) && value.exit_interview_by_new != null) {
                        if (angular.isObject(value.exit_interview_by_new) && angular.isDefined(value.exit_interview_by_new._id)) {
                            object.exit_interview_by = angular.isObject(value.exit_interview_by_new._id) ? value.exit_interview_by_new._id.$id : value.exit_interview_by_new._id;
                        } else {
                            object.exit_interview_by = angular.isObject(value.exit_interview_by_new) ? value.exit_interview_by_new.$id : value.exit_interview_by_new;
                        }
                    }
                    if (enterviewerFlag && selectedFeedback != null) {
                        object.exit_interview_by = angular.isObject(selectedFeedback._id) ? selectedFeedback._id.$id : selectedFeedback._id;
                    }
                   payload.push(object);
                }
                if(exitSettings.is_exit_survey && value.form_type == 'survey'){
                    object.exit_form_id = value.exit_form_id;
                    object.form_type = value.form_type;
                     payload.push(object);
                }
            });

            return payload;
        };        
        this.buildEmpExitFeedbackModel = function (data, exitSettings) {
            var model = angular.isDefined(data) && data ? data : [{form_type: "feedback"},{form_type: "survey"}];            
            var arrayObject = [];
            angular.forEach(model, function (value, key) {
                var object = {
                   form_type: value.form_type,
                   exit_form_id: utilityService.getValue(value, "exit_form_id")
                };
                if (value.form_type == "feedback") {
                    object.exit_interview_by_new = utilityService.getValue(value, "exit_interview_by"); 
                }
                arrayObject.push(object);
            });
            if (arrayObject.length == 1) {
                if (exitSettings.is_exit_interview && arrayObject[0].form_type != 'feedback') {
                    arrayObject.push({
                        form_type: "feedback",
                        exit_form_id: null,
                        exit_interview_by_new: null
                    });
                }
                if (exitSettings.is_exit_survey && arrayObject[0].form_type != 'survey') {
                    arrayObject.push({
                        form_type: "survey",
                        exit_form_id: null,
                    });
                }
            }

            return arrayObject;
        };
        this.buildExitStatus = function() {
            return {
                1 : {    
                    id:1,
                    label: 'On Notice',
                    isChecked: false
                },
                2 : {    
                    id:2,
                    label: 'Relieved',
                    isChecked: false
                }
            }
        };
        this.getTime = function (from, to, flag) {
            var time = [];
            if (flag) {
                time.push({time: from + ":59", value: from + ":59"})
            } else {
                for (var i = from; i < to; i = i + 1) {
                    var x = i <= 9 ? "0" + i : i;
                    time.push({time: x + ":00", value: x + ":00"}, {time: x + ":30", value: x + ":30"})
                }
            }
            return time;
        };
        this.buildDateObject = function(){
            return{
                1 : {
                    label: 3,
                    isChecked: false
                },
                2 : {
                    label: 7,
                    isChecked: false
                },
                3 : {
                    label: 15,
                    isChecked: false
                },
                4 : {
                    label: 70,
                    isChecked: false
                }    
            };
        };
        this.buildAccessPayload = function (model, revokeDate) {
            if (angular.isDefined(model) && model && angular.isDefined(model._id)) {
                var payload = {};
                var object = {
                    role_id: model._id,
                };
                object.revoke_date = (revokeDate && !isNaN(new Date(revokeDate).getDate())) 
                    ? utilityService.dateFormatConvertion(revokeDate) : revokeDate;
                payload = object;
                return payload;
            } else {
                return;
            }
        };        
        this.buildExitCertificatePayload = function(model,isDraft){
            var payload = [];

            if(model.length == 1 && (model[0].letter_id == null || angular.isUndefined(model[0].letter_id))){
                return payload;
            }
            angular.forEach(model,function(val,key){
                var obj = {
                    is_draft: isDraft,
                    letter_id: val.letter_id,
                    sign_authority: val.sign_authority,
                    trigger_date: (val.trigger_date && !isNaN(new Date(val.trigger_date).getDate())) 
                        ? utilityService.dateFormatConvertion(val.trigger_date) : val.trigger_date,
                    due_days: parseInt(val.due_days),
                    title: val.title,
                    is_viewed: angular.isDefined(val.isViewed) ? val.isViewed : false
                };
                if(val._id!=null){
                    obj._id = val._id;
                }
                payload.push(obj);
            });

            return payload;
        };
	    this.exitStatusObj = function () {
            return {
                1: 'On Notice',
                2: 'Relieved'
            };
        };        
        this.duesStatusObj = function () {
            return {
                1: 'Pending',
                2: 'No dues',
                3: 'Dues Payable',
                4: 'Done',
                5: 'Revoked',
                6: 'Provided',
                14: 'Rejected',
                8: 'Triggered'
            };
        };        
        this.buildHandoverPayload = function (list){
            var payload= [];

            angular.forEach(list, function (v, k){
                var obj = {};
                obj.emp_id = v._id;
                obj.new_manager = v.reporting_manager;
                obj.relationship_type_id = v.relationship_type_id;
                obj.relationship_type_name = v.relationship_type_name;
                obj.handover_date = (v.handover_date && !isNaN(new Date(v.handover_date).getDate())) ? utilityService.dateFormatConvertion(v.handover_date) : v.handover_date;
                payload.push(obj);
            });

            return payload;
        };        
        this.buildProvisionByManagerPayload = function (list){
            var payload= [];

            angular.forEach(list, function (v, k){
                var obj = {};
                obj.emp_id = v.emp_id;
                obj. provision_id = v._id;
                obj.handover_date = (v.handover_date && !isNaN(new Date(v.handover_date).getDate())) ? utilityService.dateFormatConvertion(v.handover_date) : v.handover_date;
                payload.push(obj);
            });

            return payload;
        };
        this.buildOtherAuthoritiesPayload = function (list){
            var payload= [];

            angular.forEach(list, function (v, k){
                var obj = {};
                obj.emp_id = v.emp_id;
                obj.type_id = v.type_id;
                obj.type = v.type;
                obj.type_name = v.type_name;
                obj.type_heading = v.type_heading;
                obj.handover_date = (v.handover_date && !isNaN(new Date(v.handover_date).getDate())) 
                    ? utilityService.dateFormatConvertion(v.handover_date) : v.handover_date;
                payload.push(obj);
            });
            
            return payload;
        };            
        this.buildAutoritiesType = function (type) {
            var obj = {
                specific_employee_reporting: "Specific Employee Reporting",
                fnf_authority: "Full and final settlement authority",
                clearance_poc: "Clearance POC",
                clearance_escalation_poc: "Clearance Escalation POC",
                certificate_signature_setup: "Certificate Signature",
                helpdesk_poc: "Helpdesk POC"
            };

            return obj[type];
        };
        this.buildQuestionList = function(questionList, reset) {
            if(!questionList || !questionList.length) {
                return questionList;
            }
            angular.forEach(questionList, function (value, key) {
                if(reset) {
                    value.answer = '';
                } else {
                    if(value.question_type == FORM_BUILDER.questionType.date) {
                        value.answer = angular.isDate(value.answer)
                            ? value.answer
                            : (angular.isString(value.answer) && value.answer.length)
                                ? utilityService.getDefaultDate(value.answer)
                                : null;
                    } else if(value.question_type == FORM_BUILDER.questionType.time) {
                        value.answer = angular.isDate(value.answer)
                            ? value.answer
                            : (angular.isString(value.answer) && value.answer.length)
                                ? utilityService.getDefaultDate('01/01/1970 ' + value.answer)
                                : null;
                    }
                }
            });

            return questionList;
        };
		this.buildFormObject = function(model) {
			return {
				_id: utilityService.getValue(model, '_id'),
				name: utilityService.getValue(model, 'name'),
				description: utilityService.getValue(model, 'description'),
				questions: this.buildQuestionList(utilityService.getValue(model, 'questions', []))
			};
        };
        this.buildSameDateSectionsObject = function() {
            return {
                qandle_access : {
                    date: null,
                    isAllFilled: false,
                    listKey: null
                },
                assigned_team : {
                    date: null,
                    isAllFilled: false,
                    listKey : 'teamsList'
                },
                other_assigned_authorities : {
                    date: null,
                    isAllFilled: false,
                    listKey : 'authoritiesList'
                },
                change_assets_manager : {
                    date: null,
                    isAllFilled: false,
                    listKey : 'provisionByManagerList'
                },
                assets : {
                    date: null,
                    isAllFilled: false,
                    listKey : 'provisions'
                },
                other_clearances : {
                    date: null,
                    isAllFilled: false,
                    listKey : 'noDues'
                },
            };
        };
        this.buildPendingRequestsCSVData = function(list) {
            var arr = new Array(["Employee Details", "Employee Code", "Requested On", 
                    "Inititated By Employee Name", "Inititated By Employee Code", 
                    "Pending On Employee Name", "Pending On Employee Code"]), 
                object = {
                    list: list,
                    content: arr
                };

            angular.forEach(object.list, function(value, key) {                
                var array = new Array();

                array.push(utilityService.getValue(value, 'full_name'));
                array.push(utilityService.getValue(value, 'employee_id'));
                array.push(utilityService.getValue(value, 'requested_on'));
                array.push(utilityService.getInnerValue(value, 'initiated_by', 'name'));
                array.push(utilityService.getInnerValue(value, 'initiated_by', 'code'));
                array.push(utilityService.getInnerValue(value, 'pending_on', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'pending_on', 'personal_profile_employee_code'));

                object.content.push(array);
            });

            return object;
        };
        this.buildConfirmationDialogContentObject = function () {
			return {
				assignedTeam: {
					title: 'Assigned Team',
					textContent: 'Are you sure you want to assign/overwrite this employee to appropriate relationship',
					ariaLabel: '',
					ok: 'Yes',
					cancel: 'No'
                },
                otherAssignedAuthorities: {
					title: 'Other Assigned Authorities',
					textContent: 'Are you sure you want to assign/overwrite this employee to appropriate authority type',
					ariaLabel: '',
					ok: 'Yes',
					cancel: 'Yes'
				},
				default: {
					title: 'Would you like to proceed with this?',
					textContent: 'Please double check every thing before taking this action.',
					ariaLabel: '',
					ok: 'Yes',
					cancel: 'No'
				}
			}
        };
                
		return this;
	}
]);