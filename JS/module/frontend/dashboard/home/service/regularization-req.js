app.service('ReguReqService', [
	'utilityService', 'FORM_BUILDER',        
	function (utilityService, FORM_BUILDER) {
		'use strict';
		var self = this;
        this.url = {	
            getApprovers: 'timeattendance/employee/request-fields-approvers',
            getAdminApprovers: 'timeattendance/employee/admin-request-fields-approvers',
            applyRegReq: 'timeattendance/employee/regularization',
            applyManagerRegReq: 'timeattendance/manager/apply-regularization',
            applyAdminRegReq: 'timeattendance/admin/apply-regularization',
        	leaveType: 'admin/leave/type',
    	   	leaveDetail: 'employee/leave/validation',
    	   	leaveRequest: 'employee/leave',
			employee: 'user-addition/users-preview',
			adminBulkRegularization: 'timeattendance/admin/bulk-regularization/request-fields-approvers',
			postAdminBulkRegularizationValidation: 'timeattendance/admin/bulk-regularization/validate',
			postAdminBulkRegularizationApply: 'timeattendance/admin/bulk-regularization/apply'
        };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.getDisplayHours = function(date) {
	    	return date.getHours() > 9 ? date.getHours() : ('0' + date.getHours()) ;
	    };
	    this.getDisplayMinutes = function(date) {
	    	return date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes()) ;
	    };
	    this.buildHoursList = function() {
	    	var date, list = [];
				date = new Date();

			while (date.getMinutes() % 15 !== 0) {
			    date.setMinutes ( date.getMinutes() + 1 );
			}

			for (var i = 0; i < 24 * 4; i++) {
			    list.push({
			    	k: this.getDisplayHours(date) + '' + this.getDisplayMinutes(date),
			    	v: this.getDisplayHours(date) + ':' + this.getDisplayMinutes(date)
			    });
			    date.setMinutes ( date.getMinutes() + 15);
			}
			return list;
	    };
	    this.buildLeaveRequestModel = function(model) {
	    	var object = {
	    		form: {
	    			name: utilityService.getInnerValue(model, 'form_data', 'name'),
	    			description: utilityService.getInnerValue(model,'form_data','description'),
	    			comment: utilityService.getInnerValue(model, 'comment','selected_value')
	    		}   		
	    	};	
	    	return object;
	    };	    
	    this.buildLeaveRequestPayload = function(questionList) {
	    	var payload = {}; 			
 			angular.forEach(questionList, function(value, key) {
				// If question is of attachment type and user has attach some documents, 
                // otherwise else condition will get executed (Earlier default condition)
                if (value.question_type == FORM_BUILDER.questionType.attachment) {
                    if (value.isMandatory) {
                        payload["question_" + value._id] = value.answer;
                    } else if (!value.isMandatory && (angular.isObject(value.answer) || value.answer)) {
                        payload["question_" + value._id] = value.answer;
                    }
                } else {
					if(!value.isConditional) { 					
						payload["question_" + value._id] = (value.question_type == FORM_BUILDER.questionType.date) 
							? utilityService.dateFormatConvertion(value.answer)
							: (value.question_type == FORM_BUILDER.questionType.time) 
								? utilityService.convertTimeInStandardForms(value.answer)
								: payload["question_" + value._id] = value.answer; 					 					
					}
				} 				
 			});
 			return payload;
		};
		
		this.buildPayloadRegFromAdmin = function (model) {
			var payload = []; 			
 			angular.forEach(model, function(value) {
				var obj = {}
				if(value.emp_id) {
					obj.employee_id = value.emp_id;
				} else {
					obj.employee_id = value.employee_detail._id;
				}

				if(angular.isDefined(value.in_time) && value.in_time !== null) {
					obj.start_time = self.formatTime(value.in_time);
				}

				if(angular.isDefined(value.out_time) && value.out_time !== null) {
					obj.end_time =   self.formatTime(value.out_time);
				}

				if(angular.isDefined(value.credit_days) && value.credit_days !== null) {
					obj.credit_days =  utilityService.getValue(value, 'credit_days')
				}

				payload.push(obj)
 			});
 			return payload;
		}
		this.formatTime = function (time) {
            if (angular.isDefined(time.getHours()) && angular.isDefined(time.getMinutes())) {
                return time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
            }
		};
		
		this.bulkRegularizationModel = function()  {
            return {
			dateInString: null,
            commonInTime: null,
            commonOutTime: null,
            comment: null,
            date: null,
            commonDaysToCredit: null,
				apiError: {
					status: false,
					header: ['Employee', 'Error'],
					errors: new Array,
					errorCount: null,
					successCount: null
				}
			}
		}
		return this;
	}
]);