app.service('RequestLeaveService', [
	'utilityService', 'FORM_BUILDER',        
	function (utilityService, FORM_BUILDER) {
		'use strict';

        this.url = {	   
        	leaveType: 'admin/leave/type',
    	   	leaveDetail: 'employee/leave/validation',
    	   	leaveRequest: 'employee/leave',
    	   	employee: 'user-addition/users-preview',
    	   	checkLeave: 'employee/check/leave',
    	   	leaveList: 'admin-frontend/leave/list',
    	   	adminLeaveRequest: 'admin-frontend/apply-leave',
    	   	managerLeaveRequest: 'myteam/apply-leave'
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
	    this.buildHoursList = function(startForm) {
	    	var date, list = [];

			if(startForm) {
				date = new Date(utilityService.dateToString(new Date(), '-', 'ymd') + ' ' + startForm);
			} else {
				date = new Date();
			}

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
        this.checkForMinDate = function (model,key) {
            if (key === 'date') {
                var minDate = utilityService.getDefaultDate(utilityService.getInnerValue(model.date, 'from_date', 'start_Date'), true, false);
            } else {
                var minDate = utilityService.getDefaultDate(utilityService.getInnerValue(model.hours, 'from_date', 'start_Date'), true, false);
            }
            var minDateTimeStamp = new Date(minDate.toString()).getTime();
            var minDateToApply = model.last_date_for_apply * 1000;
            return minDateToApply > minDateTimeStamp ? new Date(minDateToApply) : minDate;
		};		
		this.getDateBasedOnLast21st = function () {
			var date = new Date();

			if(date.getDate() < 22) {
				date.setMonth((date.getMonth() - 1));
			}
			
			date.setDate(21);

			return date;
		};
		this.getDateBeforeSpecificDays = function (date, days) {
			days = angular.isDefined(days) ? days : 60;
			var y = date.getFullYear(), m = date.getMonth(), d = date.getDate();

			return new Date(y, m, d-days);
		};
		this.getDate20 = function (model, envMnt) {
			var date20;

			if (envMnt === 'myhr' || envMnt === 'ess') {
				date20 = this.getDateBasedOnLast21st();
			} else if (envMnt === 'mempl' || envMnt === 'edusch' || envMnt === 'mis' 
				|| envMnt === 'shriramggn') {
				date20 = this.getDateBeforeSpecificDays(new Date());
			} else {
				date20 = this.checkForMinDate(model, 'date');
			}

			return date20;
		};
	    this.buildLeaveRequestModel = function(model, envMnt, applyOnBehalf) {
	    	var object = {
	    		isDisabled: model.isDisabled,
	    		leaveType: utilityService.getValue(model, 'leaveType'),
	    		leaveTypeName: utilityService.getValue(model, 'leaveTypeName'),
	    		leavePlan: utilityService.getValue(model, 'leavePlan'),	
	    		leaveLogId: utilityService.getValue(model, 'leaveLogId'),    		
	    		hoursType: utilityService.getValue(model, 'hours') ? true: false,
	    		fromDate: utilityService.getDefaultDate(utilityService.getInnerValue(model.date, 'from_date', 'selected_value'), true, true),
	    		toDate: utilityService.getDefaultDate(utilityService.getInnerValue(model.date, 'to_date', 'selected_value'), true, true),
	    		fromHours: utilityService.getValue(model, 'from_hours'),
	    		toHours: utilityService.getValue(model, 'to_hours'),
	    		fromHoursList: this.buildHoursList(),
	    		toHoursList: this.buildHoursList(),
	    		comment: utilityService.getInnerValue(model, 'comment', 'selected_value'),
	    		notifyTo: utilityService.getValue(model, 'notify_to'),
	    		approverChain: utilityService.getValue(model, 'approver_chain'),
	    		form: {
	    			name: utilityService.getInnerValue(model, 'form_detail', 'name'),
	    			description: utilityService.getInnerValue(model, 'form_detail', 'description')
	    		},	    		
	    		triggerFrom: utilityService.getValue(model, 'triggerFrom', 'summary'),
	    		maxDate: new Date(),
	    		leaveCount: 0,
	    		totalLeaveCount: 0,
	    		isUploaded: false,
	    		file: null,
	    		isDocumentRequired: utilityService.getValue(model, 'document_required', false),
	    		isLeaveInvalid: utilityService.getValue(model, 'leave_invalid', false),
	    		errorMsg: utilityService.getValue(model, 'message'),
	    		minLeaveDuration: utilityService.getValue(model, 'min_leave_duration')
	    	};
	    	if(angular.isDefined(model.date)) {
				var date20 = this.getDate20(model, envMnt);
				object.minDate = utilityService.applyLeave.domains.indexOf(envMnt) >= 0
					? (applyOnBehalf ? this.checkForMinDate(model, 'date') : new Date(date20)) 
					: this.checkForMinDate(model, 'date'),
                object.toMaxDate = utilityService.getDefaultDate(utilityService.getInnerValue(model.date, 'to_date', 'end_Date'), true, false);
                object.fromType = utilityService.getInnerValue(model.date.from_date, 'from_leave_type', 'selected_value', 1);
                object.toType = utilityService.getInnerValue(model.date.to_date, 'to_leave_type', 'selected_value', 1);
                object.fromTypeList = utilityService.getInnerValue(model.date.from_date, 'from_leave_type', 'values', []);
                object.toTypeList = utilityService.getInnerValue(model.date.to_date, 'to_leave_type', 'values', []);
	    	}
	    	if(angular.isDefined(model.hours)) {
                object.minDate = this.checkForMinDate(model,'hours'),                        
                object.toMaxDate = utilityService.getDefaultDate(utilityService.getInnerValue(model.hours, 'from_date', 'end_date'), true, false);
            }

			/**** Start Special handling for min date in case of min leave duration as 180 days *****/
			if (utilityService.getValue(model, 'min_leave_duration') >= 180 && applyOnBehalf) {
				var currentYear = utilityService.getCurrentYear(),
					currentMonth = utilityService.getCurrentMonth(),
					financialYear = utilityService.getCurrentFinancialYear();

				object.minDate = (currentYear == financialYear.end 
						&& currentMonth >= utilityService.startMonth) 
							? utilityService.getDateBeforeAfterMonths(3, 'before') 
							: new Date(utilityService.applyLeave.fromMinDate);
			}
			/**** End Special handling for min date in case of min leave duration as 180 days *****/

	    	return object;
	    };
	    this.extractIds = function(list) {
	    	var ids = [];
	    	angular.forEach(list, function(value, key) {
	    		ids.push(value.id);
	    	});
	    	return ids;
	    };
	    this.buildLeaveRequestPayload = function(model, list, questionList) {
	    	var payload = { 
	    		leave_plan_id: model.leavePlan, 
	    		from_date: utilityService.dateFormatConvertion(model.fromDate),
 				comment: model.comment,
 				notify_to: this.extractIds(list)
 			};
 			if(model.hoursType) {
 				payload.from_hours = model.fromHours;
 				payload.to_hours = model.toHours;
 			} else {
 				payload.to_date = utilityService.dateFormatConvertion(model.toDate);
 				payload.from_leave_type = model.fromType;
 				payload.to_leave_type = model.toType;
 			}
 			if(model.relationship) {
 				payload.relationship = model.relationship;
			}
 			angular.forEach(questionList, function(value, key) {
 				//if(!value.isConditional) { 	
 				 	payload["question_" + value._id] = (value.question_type == FORM_BUILDER.questionType.date)
                            ? utilityService.dateFormatConvertion(value.answer)
                            : (value.question_type == FORM_BUILDER.questionType.time) 
                            ? utilityService.convertTimeInStandardForms(value.answer)
                            : payload["question_" + value._id] = value.answer;
 				//} 				
 			});
 			return payload;
	    };
	    this.buildDummyNotifyList = function() {
	    	return [{id: "577a70cddabd11b82300002e", name: "Ansh Katiyar"}, 
	    		{id: "577a6fc8dabd11901b00002a", name: "Amit"}]
	    };
	    this.buildLeaveTypeMappingObject = function() {
	    	return {
	            1: "Full Day",
	            2: "First Half",
	            3: "Second Half"
	        }
	    };
	    this.buildLeaveDurationPayload = function(model) {
	    	return { 
	    		leave_plan_id: model.leavePlan, 
	    		start_date: utilityService.dateFormatConvertion(model.fromDate),
	    		end_date: utilityService.dateFormatConvertion(model.toDate),
 				is_day: true,
 				from_leave_type: parseInt(model.fromType, 10),
 				to_leave_type: parseInt(model.toType, 10)
 			}
	    };
	    this.calculateDaysDifference = function(model) {
	    	var fromDate = utilityService.getValue(model, 'fromDate'),
	    		toDate = utilityService.getValue(model, 'toDate'),
	    		fromType = utilityService.getValue(model, 'fromType'),
	    		toType = utilityService.getValue(model, 'toType');

			var timeDiff = Math.abs(toDate.getTime() - fromDate.getTime()),
				diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

			if(fromType != 1 || toType != 1) {
				diffDays = parseInt(diffDays, 10) - .5;
			}

			return diffDays;
	    };

		return this;
	}
]);