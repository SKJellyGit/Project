app.service('OverviewService', [
	'utilityService', 'FORM_BUILDER',
	function (utilityService, FORM_BUILDER) {
		'use strict';
		var self = this;

        this.url = {
        	attendance: 'myteam/attendance/overview',
        	hourWorked: 'myteam/working-hour/overview',
        	overtime: 'myteam/overtime/overview',
        	pendingApprovals: 'myteam/pending-req/overview',
        	empDetails: 'myteam/employee_detail',
			empConfirmationForm: 'prejoin/employee-confirmation-form-detail',
			approverNHMForm: 'prejoin/confirmation-form-by-approver',
			action: 'employee/action',
			initiateExit: 'user-exit/my-team/initiate-self-exit'
        };
        this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };	    
	    this.buildOverviewModel = function() {
	    	return {
	    		durationList: [
	    			{
		    			id: 1,
		    			slug: "today",
		    			title: "Today"
		    		},
		    		{
		    			id: 2,
		    			slug: "last_14_days",
		    			title: "Last 14 Days"
		    		},
		    		{
		    			id: 3,
		    			slug: "last_month",
		    			title: "Last Month"
		    		}/*,
		    		{
		    			id: 4,
		    			slug: "last_6_months",
		    			title: "Last 6 Months"
		    		}*/
		    	],
	        	attendance: {
	        		duration: {
		    			id: 1,
		    			slug: "today",
		    			title: "Today"
		    		},
		    		value: 0,
		    		count: 0
	        	},
	        	hourWorked: {
	        		duration: {
		    			id: 1,
		    			slug: "today",
		    			title: "Today"
		    		},
		    		value: 0
	        	},
	        	overtime: {
	        		duration: {
		    			id: 1,
		    			slug: "today",
		    			title: "Today"
		    		},
		    		value: 0
	        	},
	        	pendingApprovals: {
	        		duration: {
		    			id: 1,
		    			slug: "today",
		    			title: "Today"
		    		},
		    		value: 0
	        	},
	        	empDetails: {
	        		list: [],
	        		content: [],
	        		hashmap: utilityService.buildEmployeeStatusHashMap(),
	        		propertyName: '',
	            	reverse: false
				},
				confirmationDialog: utilityService.buildConfirmationDialogContentObject(),
				searchKey: 'full_name',
            	searchText: 'Search by Employee Name'
	        }
	    };
	    this.getTeamOwnerId = function(breadcrum) {
	    	var ownerId = null;
	    	if(breadcrum.length) {
	            var lastObject = _.last(breadcrum);
	            ownerId = lastObject._id;
	        }
	        return ownerId;
	    };	    
	    this.renderDateFormat = function(timestamp) {
	    	timestamp = timestamp * 1000;
            var dd = new Date(timestamp).getDate(),
                mm = new Date(timestamp).getMonth() + 1,
                yy = new Date(timestamp).getFullYear();

            dd = dd <= 9 ? ('0' + dd) : dd;
            mm = mm <= 9 ? ('0' + mm) : mm;            
            return dd + '-' + mm + '-' + yy;
	    };
	    this.buildEmpDetailList = function(empDetails, hashmap,envmt) {
                var arr;
                if(envmt == 'nearbuy'){
                   arr = new Array(["Employee Name", "Employee ID", "Joining Date", "Level"]); 
                }else{
                    arr = new Array(["Employee Name", "Employee ID", "Joining Date", "Status"]);
                }
	    	var object = {
	    		list: empDetails,
	    		content: arr
	    	};

	    	angular.forEach(object.list, function(value, key) {
	    		value.joining_date_format = self.renderDateFormat(value.work_profile_joining_date);
	    		value.status_text = hashmap[value.status];
	    		value.employee_status = value.status;
	    		
	    		var array = new Array();
	    		array.push(value.full_name );
	    		array.push(value.emp_id);
	    		array.push(value.work_profile_joining_date);
	    		array.push(value.status_text);

	    		object.content.push(array);
 	    	});

	    	return object;
	    };
	    this.buildCSVContent = function() {

		};
		
		/************Start: EmpApprFormAction***********/
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
            // console.log(FORM_BUILDER.questionType);
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
                                                            ? Number(value.answer)
                                                            : value.answer;
                    }                  
                }

                if(!utilityService.getValue(payload, 'template_id')) {
                    payload.template_id = value.form_id;
                }
            });
            return payload;
		};
		/************End: EmpApprFormAction***********/
		
	    return this;
	}
]);