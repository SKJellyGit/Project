app.service('relevanceService', [
	'ServerUtilityService', 'utilityService',        
	function (ServerUtilityService, utilityService) {
		'use strict';

	    this.url = {
	    	relevance: 'relevance/applicability',
            provisions: 'provisions/applicability',
            lnd: 'LND/applicability',
	    	leave: 'admin/leave/plan/applicability',
	    	user_management: 'user-management/applicability',
	    	employee_exit: 'exit-formalities/applicability',
	    	payroll: 'payroll/plan/applicability',
	    	workflow: 'work-flow/approverflow',
            timePlan: 'timeattendance/timeplan/applicability',
            regularization: 'timeattendance/regularization-method/applicability',
            reporting: 'timeattendance/reporting-method/applicability',
            wfh: 'timeattendance/policy-wfh/applicability',
            lateAtte: 'timeattendance/min-late-early-policy/applicability',
            earlyGo: 'timeattendance/policy-earlygoing/applicability',
            minWork: 'timeattendance/policy-minhour/applicability',
            absent: 'timeattendance/policy-noshow/applicability',
            compOff: 'timeattendance/policy-compoff/applicability',
            overTime: 'timeattendance/policy-overtime/applicability',
            prejoining: 'prejoin/plan/applicability',
            pf: 'payroll/statutory/applicability',
            esi: 'payroll/statutory/applicability',
            bonus: 'payroll/statutory/applicability',
            holiday: 'admin/holiday/applicability',
            resourcefile: 'resources/file-applicability',
            resourcefolder: 'resources/folder-applicability',
            broadcastNotice: 'notice/applicability',
	    	field: 'user-management/active/group?mandatory=true&field=true',
	    	OnlyFieldTrue: 'user-management/active/group?field=true',
//	    	emplist: 'user-addition/all-user?status=true',
	    	emplist: 'user-addition/users-preview',
	    	detail: 'relevance/detail',
	    	grplst: 'user-management/active/group',
	    	exception: 'relevance/exception',
            assignForm: 'work-flow/request-form-by-type?form_key=',
            activeWorkflow: 'admin/approverflow',
            travelExpense: 'travel-expense/applicability',
            reviewCycle: 'admin-frontend/performance/applicability',
            recruitment: 'recruitment-frontend/applicability',
            internal_recruitment_job_posting: 'recruitment-frontend/applicability',
            recruitmentOfferLetter: 'recruitment/offer-letter-applicability',
            pollsandsurveys: 'polls-and-surveys/applicability',
            ongrid: 'ongrid/applicability',
            helpdesk: 'helpdesk/applicability',
            letterDocument: 'letters/templates/applicability',
            formDocument : 'user-management/form/applicability',
            docDocument : 'user-management/document/applicability',
            exitFeedback : 'exit-formalities/form/applicability',
            okradmin: 'okr-admin/applicability',
            helpdesk: 'helpdesk/applicability'
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildRelevanceAction = function() {
	    	return {
	            add: false,
	            edit: false,
	            view: false
	        };
	    };
	    this.buildFilterAction = function() {
	    	return {
	            apply: true,
	            add: false
	        };
	    };
	    this.buildCompanyWideAction = function() {
	    	return {
	            add: true,
	            edit: false,
	            view: false
	        };
	    };
	    this.buildDefaultFilterObject = function(groupList) {
	    	return {
	            type: null,
	            value: null,
	            className: 1,
	            groups: groupList,
	            elements: []
	        };
	    };
	    this.buildFilters = function(groupList) {
	    	var filters = [];
	    	filters.push(this.buildDefaultFilterObject(groupList));
	    	return filters;
	    };
	    this.buildRelevanceModel = function(model, elementId, isApply, relevanceModule) {
	    	return {
                _id: utilityService.getValue(model, '_id'),
                apply: utilityService.getValue(model, 'apply', isApply),
                companyWideAdded: true,	    		
                module: utilityService.getValue(relevanceModule, 'name'),
                plan: elementId,                
                workflow: utilityService.getInnerValue(model, 'workflow', 'id'),
                assign_form: utilityService.getValue(model, 'assign_form'),
                manager: [],
                escalation_contact: [],
                applyNew: true,
                salMin: utilityService.getValue(model, 'relevance_salary_range_from'),
                salMax: utilityService.getValue(model, 'relevance_salary_range_to'),
                compOff_workflow:utilityService.getValue(model, 'avail_workflow'),
                avail_form:utilityService.getValue(model, 'avail_form'),
                isGroup: utilityService.getValue(model, 'is_group', false),
                travel_workflow : utilityService.getValue(model, 'travel_workflow', {international_travel_request:null, domestic_travel_request:null}),
                common_category_workflow : utilityService.getValue(model, 'common_category_workflow'),
                is_category_workflow : utilityService.getValue(model, 'is_category_workflow', false),
                emp_eligibility : utilityService.getValue(model, 'emp_eligibility', false),
                emp_joining_cutoff_date : utilityService.getValue(model, 'emp_joining_cutoff_date'),
                is_publish : utilityService.getValue(model, 'is_publish', false),
                is_seek_referral : utilityService.getValue(model, 'is_seek_referral', false),
                internal_job_post : utilityService.getValue(model, 'internal_job_post', false),
                internal_job_start_date : utilityService.getValue(model, 'internal_job_start_date'),
                internal_job_end_date : utilityService.getValue(model, 'internal_job_end_date'),
                seek_referral_start_date : utilityService.getValue(model, 'seek_referral_start_date'),
                seek_referral_end_date : utilityService.getValue(model, 'seek_referral_end_date'),
                holiday_application_before_days : utilityService.getValue(model, 'holiday_application_before_days')
            };
	    };
	    this.buildConditionObject = function(filters) {
	    	var conditions = {};
	    	angular.forEach(filters, function(v, k) {
	    		conditions[v.type] = v.value;
	    	});
	    	return conditions;
	    };
	    this.extractIds = function(list) {
	    	var ids = [];
	    	angular.forEach(list, function(value, key) {
                    angular.isObject(value.id) ? ids.push(value.id.$id) : ids.push(value.id);	    		
	    	});
	    	return ids;
	    };
        this.buildUserManagementPayload = function(model){
            return {
                is_company_wide : model.apply
            };
        };
        this.buildReviewCyclePayload = function(model){
            var payload =  {
                is_company_wide : model.apply,
                emp_eligibility : model.emp_eligibility
            };
            if(model.emp_eligibility){
                var date = model.emp_joining_cutoff_date;
                payload.emp_joining_cutoff_date = date ? (new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)).getTime()/1000 : null;         
            }
            return payload;
        };
        this.buildRecruitmentPayload = function(model){
            var payload =  {
                is_company_wide : model.apply,
                is_seek_referral: model.is_seek_referral,
                is_referral_mail: model.is_referral_mail
            };
            if(model.is_seek_referral){
                // payload.seek_referral_start_date = utilityService.dateToString(model.seek_referral_start_date,"-");
                // payload.seek_referral_end_date = utilityService.dateToString(model.seek_referral_end_date,"-");
                payload.seek_referral_start_date = utilityService.getValue(model, 'seek_referral_start_date') 
                    ? parseInt((model.seek_referral_start_date)/1000, 10) : '';
                payload.seek_referral_end_date = utilityService.getValue(model, 'seek_referral_end_date') 
                    ? parseInt((model.seek_referral_end_date)/1000, 10) : '';
            }
            return payload;
        };
        this.buildRecruitmentIjpPayload = function(model){
            var payload =  {
                is_company_wide : model.apply,
                internal_job_post: model.internal_job_post,
                is_internal_mail: model.is_internal_mail
            };
            if(model.internal_job_post){
                payload.internal_job_start_date = utilityService.dateToString(model.internal_job_start_date,"-");
                payload.internal_job_end_date = utilityService.dateToString(model.internal_job_end_date,"-");
            }
            return payload;
        };
        this.buildPayrollPlanPayload = function(model){
            var payload = {
                is_company_wide : model.apply,
                workflow:  model.workflow
            };
            if(!model.apply){
              payload.relevance_salary_range_from = parseInt(model.salMin); 
              payload.relevance_salary_range_to = parseInt(model.salMax); 
            }
            return payload;
        };
        this.buildProvisionPayload = function(model,provisionManager,escalationContact){
            console.log(provisionManager, escalationContact);
            return {
                is_company_wide : model.apply,
                workflow: model.workflow,
                assign_form:  model.assign_form,
                manager: this.extractIds(provisionManager),
                escalation_contact: this.extractIds(escalationContact)
            };
        };
        this.buildLndPayload = function(model, lndManager,escalationContact, applicability){
            //console.log(lndManager, escalationContact);
            //console.log('here', applicability);
            // if(applicability.capacity.selected == 1) {
            //     applicability.capacity_limit = ''
            // }
            return {
                is_company_wide : model.apply,
                workflow: model.workflow,
                assign_form:  model.assign_form,
                manager: this.extractIds(lndManager),
                escalation_contact: this.extractIds(escalationContact),
                capacity: applicability.capacity.toString(),
                capacity_limit: applicability.capacity==1?null:applicability.capacity_limit,
                can_employee_nominate: applicability.can_employee_nominate,
                can_manager_nominate: applicability.can_manager_nominate 
            };
        };
        this.buildNoticePayload = function(model,escalationContact){
            var payload = {
                is_company_wide : model.apply,
                is_group :  model.apply ? false : model.isGroup
            };
            if(!model.apply){
//              payload.is_group = model.isGroup; 
              payload.specific_employees = this.extractIds(escalationContact); 
            }
            return payload;
        };
        
        this.buildTimePlanPayload = function(model,timeScheduler){
            return {
                regularization_workflow: model.workflow,
                regularization_assign_form:  model.assign_form,
                is_company_wide : model.apply,
                time_scheduler: this.extractIds(timeScheduler),
            };
        };
        this.buildRegularizationPayload = function(model){
            return {
                is_company_wide : model.apply,
                workflow: model.workflow,
                assign_form:  model.assign_form
            };
        };
        this.buildCompOffPayload = function(model){
            return {
                is_company_wide : model.apply,
                workflow: model.workflow,
                avail_workflow: model.compoff_workflow,
                assign_form:  model.assign_form,
                avail_form:  model.avail_form
            };
        };
        this.buildLeavePayload = function(model,provisionManager,escalationContact){
            return {
                is_company_wide : model.apply,
                workflow: model.workflow,
                assign_form:  model.assign_form
            };
        };
        this.buildHolidayPayload = function(model,provisionManager,escalationContact){
            return {
                is_company_wide : model.apply,
                workflow: model.workflow,
                assign_form:  model.assign_form,
                holiday_application_before_days : model.holiday_application_before_days
            };
        };
        this.buildTravelExpensePayload = function (model) {
            console.log(model.travel_workflow);
            var payload = {
                is_company_wide: model.apply,
                travel_workflow: {},
                is_category_workflow: model.is_category_workflow
            };
            if (!model.is_category_workflow) {
                payload.travel_workflow.international_travel_request = model.travel_workflow.international_travel_request;
                payload.travel_workflow.domestic_travel_request = model.travel_workflow.domestic_travel_request;
                payload.travel_workflow.common_category_workflow = model.common_category_workflow;
            } else {
                delete model.travel_workflow['common_category_workflow']; 
                payload.travel_workflow = model.travel_workflow;
            }
            return  payload;
        };
        this.bulidGenericPayload = function (model) {
            return {
                is_company_wide : model.apply,
                workflow: model.workflow,
                assign_form:  model.assign_form
            };
        };            
	    this.buildWorkflowModel = function(model) {
	    	return {
	    		list: model.workflow,
	    		isRequired: model.workflow_required
	    	}
	    };
        this.buildAssignFormModel = function(model) {
	    	return {
	    		list: model.form,
	    		isRequired: model.form_required
	    	};
	    };            
        this.buildFormHasmap = {
            leave: 'leave_application',
            provisions: 'provision_request',
            wfh: 'work_from_home',
            timePlan: 'attendance_regularization',
            compOff:'compensatory_off_credit',
            availForm: 'compensatory_off_use',
            holiday:'restricted_holiday_request'
        };        
        this.returnFormType = function (module){
           return this.buildFormHasmap[module];
        };
	}
]);