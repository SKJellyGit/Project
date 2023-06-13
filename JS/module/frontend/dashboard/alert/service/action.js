app.service('ActionService', [
	'utilityService', 'FORM_BUILDER',       
	function (utilityService, FORM_BUILDER) {
		'use strict';
		var self = this;

        this.url = {
    	   action: 'employee/action',
    	   bulkAction: 'employee/bulk-action',
           revokeProvision: 'user-exit/set-provision-revoked',
           revokeClearance: 'user-exit/set-clearance-revoked',
           submitExitForms: 'user-exit/employee-feedback-reply',
           summary: 'employee/action-summary',
           regularizationForm:'timeattendance/employee/form-detail',
           triggerCertificate: 'user-exit/trigger-certificate',
           requestedLeave: 'employee/leave-detail',
           rejectExitCer: 'user-exit/reject-certificate',
           rejectElcmCer: 'admin-frontend/reject-sign-letter',
           postDetail:'social-frontend/post',
           viewFormProfileFieldChange: 'employee/profile-field-change-detail',
		   timesheetDetails: 'timesheet/timesheet-detail',
		   viewSelfInitiateFormDetails: 'employee/self-exit-form-detail',
		   approverSelfInitiateForm: 'employee/self-exit-approver-form-detail',
		   empConfirmationForm: 'prejoin/employee-confirmation-form-detail',
		   approverNHMForm: 'prejoin/confirmation-form-by-approver',
		   submitEmpConfirmationForm: 'prejoin/employee-confirmation-form',
		   payrollFlexiPayForms: 'payroll/employee/get-all-flexi-form',
		   downloadAnswerAttachment: 'payroll/download/flexi-form-attachment',
			downloadCompOffFormAttachment: 'timeattendance/employee/download-form-attachment',
			claimDetails: 'employee/action/claim',
			claimProof: 'employee/action/claim-proof',
			pipAction: 'pip-myteam/action-status'
		};
        this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildDurationList = function() {
	    	return [
	    		{
	    			id: 1,
	    			title: "Last Week",
	    			slug: "last_week",
	    		},
	    		{
	    			id: 2,
	    			title: "Last Month",
	    			slug: "last_month"
	    		},
	    		{
	    			id: 3,
	    			title: "Last Year",
	    			slug: "last_year"
	    		},
	    		{
	    			id: 4,
	    			title: "Custom",
	    			slug: "custom"
	    		}
	    	]
	    };
	    this.buildRequestTypeList = function() {
	    	return [
				{
					slug: "",
					title: "All Modules"
				},
				{
					slug: "asset",
					title: "Assets",
					permission: "sidenav_view_provision"
				},
				{
					slug: "social",
					title: "Collabration",
					permission: "sidenav_view_social"
				},
				{
					slug: "compensation",
					title: "Compensation",
					permission: "sidenav_view_compensation"
				},
				{
					slug: "leave",
					title: "Leave",
					permission: "sidenav_view_lms"
				},
				{
					slug: "time_attendance",
					title: "Attendance",
					permission: "sidenav_view_time_attendance"
				},
				{
					slug: "travel_expense",
					title: "Expense Management",
					permission: "sidenav_view_travel_expense"
				},
				{
					slug: "timesheet",
					title: "Timesheet",
					permission: "sidenav_view_timesheet"
				},
				{
					slug: "performance",
					title: "Performance",
					permission: "sidenav_view_performance"
				},
				{
					slug: "document_nd_letters",
					title: "Documents & Letters",
					permission: "admin_sidenav_view_nhm"
				},
				{
					slug: "exit",
					title: "Exit",
					permission: "admin_sidenav_view_nhm"
				},
				{
					slug: "onboarding",
					title: "On-Boarding",
					permission: "admin_sidenav_view_nhm"
				},
				{
					slug: "user_management",
					title: "User Management",
					permission: "admin_sidenav_view_user_management"
				},
				{
					slug: "recruitment",
					title: "Recruitment",
					permission: "sidenav_create_job_requisition"
				},
				{
					slug: "self_exit",
					title: "Self Exit",
					permission: "self_initiate_exit_request"
				},
				{
					slug: "pip",
					title: "PIP",
					permission: "sidenav_view_pip"
				}
			]
		};
		this.buildRequestListMapping = function() {
	    	return {
		    	time_attendance: ['regularization_request'],
		    	social: ['anonymous_post'],
				compensation: ['loan_or_advance_salary_request', 'emp_claim_request', 
					'investment_declaration_request', 'pf_opt_out_request', 
					'emp_vpf_contribution_request', 'emp_flexi_pay_request'],
		    	asset: ['provision_unassign', 'emp_request_raised_to_approver', 'provision_request'],
				leave: ['leave_request', 'leave_cancel_request', 
					'holiday_request', 'holiday_cancel_request'],
				travel_expense: ['travel_request', 'co-traveller_travel_request', 
					'expense_request', 'group_employee_expense_request'],
				timesheet: ['fill_timesheet'],
				performance: ['peer_review_request', 'employee_one_on_one_request'],
				document_nd_letters: ['elcm_sign_pending'],
				exit: ['exit_certificate_sign_pending', 'send_revoke_letter', 'exit_interview_employee', 
					'exit_interview_interviewer', 'clearance_trigger_poc'],
				onboarding: ['send_offer_letter'],
				user_management: ['field_change_request'],
				recruitment: ['new_job_requisition', 'recruitment_offer_request'],
				self_exit: ['sidenav_view_exit_management'],
				pip: this.buildPIPTypeSlugList()
		    }
		};
		this.buildRequestTypeModuleSlugMapping = function() {
			var mapping = this.buildRequestListMapping(),
				object = {};

			angular.forEach(mapping, function (value, key) {
				angular.forEach(value, function (v, k) {
					object[v] = key;
				});
			});

			return object;
		};
		this.buildPIPTypeSlugList = function () {
			return ['admin_add_employee_send_employee', 'pending_reviewer_reminder_action', 
				'fill_deliverable_reviewer_auto_reminder', 'reviewer_final_update_passed_day', 
				'reviewer_final_update_on_day', 'employee_final_interim_reminder_after_day_passed', 
				'auto_employee_interim_reminder_on_day', 'reviewer_final_interim_reminder_after_day_passed', 
				'fill_final_iterim_reminder_on_same_day', 'auto_pending_reviewer_reminder'];
		};
	    this.buildActionObject = function() {
	    	return {
	    		possibility: {
	    			pending: 1,
	    			rejected: 11,
	    			approved: 10
	    		},
	    		objCopyItem: {},
	    		source: 'single',
	    		toggle: false,
	    		actionItem: null,
	    		list: [],
	    		pendingCount: 0,
	    		model: {
	    			status: 1,
	    			comment: null
	    		},
	    		selectedIndex: -1,
	    		selectedActionIndex: -1,
	    		selectedAction: null,
	    		type: null,
	    		typeList: [
	    			{
	    				title: "All Actions",
	    				status: ''
	    			},
					// {
	    			// 	title: "Pending",
	    			// 	status: 1
	    			// },
	    			{
	    				title: "Rejected",
	    				status: 2
	    			},
	    			{
	    				title: "Approved",
	    				status: 3
	    			}
	    		],
	    		duration: {
	    			id: 4,
	    			title: "Custom",
	    			slug: "custom"
	    		},
	    		durationList: this.buildDurationList(),
                fromDate: null,
		        toDate: null,
		        visible: false,
		        requestType: "",
				requestTypeList: this.buildRequestTypeList(),
				requestTypeObject: {},
				requestTypeModuleSlugMapping: this.buildRequestTypeModuleSlugMapping(), 
		        filterList: [],
		        requestListMapping: this.buildRequestListMapping(),
		        comment: {
		        	text: null
				},
				tabs: {
					selected: 0,
					status: 'pending',
					list: {
						pending: {
							index: 0,
							status: 'pending'
						},
						archived: {
							index: 1,
							status: 'archived'
						}
					}
				},
				isChecked: false,
				checkedCount: 0,
				possibleSlug: {
					pip: this.buildPIPTypeSlugList()
				}
	    	}
	    };
	    this.buildAlertList = function(data) {	
	    	angular.forEach(data, function(value, key) {
	    		value._id = angular.isObject(value._id) ? value._id.$id : value._id;	    		
	    	});
	    	return data;
	    };
	    this.getPendingActionCount = function(data) {
	    	var count = 0;    	
	    	angular.forEach(data, function(value, key) {
	    		if(value.status == 1) {
	    			count++;
	    		}
	    	});
	    	return count;
	    };
	    this.buildActionPayload = function(model) {
	    	return {
	    		status: model.status,
	    		comment: model.comment
	    	}
	    };
	    this.buildBulkActionPayload = function(object) {
	    	var payload = {
	    		ids: [],
	    		status: object.model.status,
	    		comment: object.model.comment
	    	};
	    	angular.forEach(object.list, function(v, k) {
	    		if(v.isChecked) {
	    			payload.ids.push(v._id);
	    		}
	    	});
	    	return payload;
	    };
	    this.getDateRange = function(slug) {
        	var now = new Date(),
        		rangeObject = {
	        		last_week: {
	        			from: new Date(new Date(now).setDate(now.getDate() - 6)),
	        			to: new Date(new Date(now).setDate(now.getDate()))
	        		},
	        		last_month: {
	        			from: new Date(new Date(now).setMonth(now.getMonth() - 1)),
	        			to: new Date(new Date(now).setMonth(now.getMonth()))
	        		},
	        		last_year: {
	        			from: new Date(new Date(now).setFullYear(now.getFullYear() - 1)),
	        			to: new Date(new Date(now).setFullYear(now.getFullYear()))
	        		},
	        		custom: {
	        			from: null,
	        			to: null
	        		}
	        	};
        	return rangeObject[slug];
        };        
        this.bulidExitClearanceRevokePayload = function (model){
            var payload = {
                exit_id: model.exit_id,
                action_id: angular.isObject(model._id) ? model._id.$id : model._id
			};
			
            if(model.type == 'provision_unassign') {
                payload.provision_id = model.provision_id;
            } else {
            	payload.no_dues_id = model.no_dues_id;
			}
			
            return payload;
        };
        this.buildFormModel = function(model) {
            return {
                _id: utilityService.getValue(model,'_id'),
                exit_id: utilityService.getValue(model,'exit_id'),
                form_type: utilityService.getValue(model,'form_type'),
                form_id: utilityService.getValue(model,'exit_form_id'),
                form: {
                    _id : utilityService.getValue(model.exit_form_detail.form_detail,'_id'),
                    name: utilityService.getValue(model.exit_form_detail.form_detail,'name'),
                    description: utilityService.getValue(model.exit_form_detail.form_detail,'description')
                }
            };
        };
        this.buildQuestionModel = function(model) {
            return utilityService.getInnerValue(model, 'form_detail', 'questions',[]);
        };        
        this.buildQuestionPayload = function (questionList, form, model) {
            var payload = {
                action_id : angular.isObject(model._id) ? model._id.$id : model._id,
                exit_id: utilityService.getValue(model, 'exit_id'),
                form_type: utilityService.getValue(model, 'form_type'),
                form_id: utilityService.getValue(model, 'form_id'),
                feedback_details: {
                    form_id: form._id
                }
            };
            angular.forEach(questionList, function (value, key) {
                if (!value.isConditional) {
                    payload.feedback_details["question_" + value._id] = (value.question_type == FORM_BUILDER.questionType.date)
                            ? utilityService.dateFormatConvertion(value.answer)
                            : payload.feedback_details["question_" + value._id] = value.answer;
                }
            });
            return payload;
        };
        this.buildRequestModuleObject = function() {
	    	return {
	    		can_view_exit_module: {
	    			list: []
	    		},
	    		can_view_helpdesk_module: {
	    			list: []
	    		},
	    		can_view_lms_module: {
	    			list: []
	    		},
	    		can_view_provision_module: {
	    			list: []
	    		},
	    		can_view_time_attendance_module: {
	    			list: []
	    		},
	    		can_view_user_management_module: {
	    			list: []
	    		},
	    		can_view_compensation_module: {
	    			list: []
	    		},
	    		can_view_compensation_social: {
	    			list: []
	    		}
	    	};
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
        self.convertTimeToStringFormat = function(time) {
            if(!time) return time;
            if(!angular.isDate(time)){
                time = new Date(time);
            }
            if(angular.isDefined(time.getHours()) && angular.isDefined(time.getMinutes())){
                return time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
            }
        };
        this.addQuestionsInPayload = function(payload, questionList) {
            if(!angular.isArray(questionList) || utilityService.getValue(questionList,'length') === 0) {
                return payload;
            }

			angular.forEach(questionList, function (value, key) {
                if(value.question_type == FORM_BUILDER.questionType.date && value.answer) {
                    payload["question_" + value._id] = utilityService.dateFormatConvertion(value.answer);
                } else if(value.question_type == FORM_BUILDER.questionType.time && value.answer) {
                    payload["question_" + value._id] = self.convertTimeToStringFormat(value.answer);
                } else if (value.question_type == FORM_BUILDER.questionType.attachment && angular.isObject(value.answer)) {
                    payload["question_" + value._id] = value.answer;
                } else {
                    if (value.isMandatory || value.answer) {
                        payload["question_" + value._id] = (value.question_type === FORM_BUILDER.questionType.rating)
                            ? Number(value.answer) : value.answer;
                    }
                }

                if(!utilityService.getValue(payload, 'template_id')) {
                    payload.template_id = value.form_id;
                }
			});
			
            return payload;
        };

		return this;
	}
]);
