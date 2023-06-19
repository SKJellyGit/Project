app.service('EmployeeLeaveDetailService', [
	'utilityService', 'TimeOffService',        
	function (utilityService, timeOffService) {
		'use strict';

		this.remainderType = 8;
        this.url = {
        	actionAdmin: 'employee/module-permission',
        	actionNonAdmin: 'myteam/na-module-permission',

        	remainder: 'prejoin/frontend/send-reminder',
        	leaveList: 'employee/leave-type/list',

        	empLeaves: 'myteam/leave/emp-detail',        	
        	pendingLeave: 'myteam/leave/detail',
        	approveReject: 'myteam/leave/approve-reject',
			creditDebit: 'myteam/credit-debit-leave',
			individualRequest: 'myteam/leave/pending-requests',

        	empLeavesAdmin: 'admin-frontend/leave/emp-detail',        	
        	pendingLeaveAdmin: 'admin-frontend/leave/detail',
        	approveRejectAdmin: 'admin-frontend/leave/approve-reject',
			creditDebitAdmin: 'admin-frontend/credit-debit-leave',
			individualRequestAdmin: 'admin-frontend/leave/pending-requests',
			leaveDetails: 'admin-frontend/leave/detail',
			    
			getLeaveType: 'admin/leave/type',
			downloadBulkAssignCsv: 'admin-frontend/leave/download-bulk-assign-csv',
			bulkAssignCsv: 'admin-frontend/leave/bulk-assign-csv',
			allmandatorygroup : 'user-management/active/group?mandatory=true&field=true',		
        };
        this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildEmployeeDetailObject = function() {	    	
            return {
            	action: {
            		list: [],
            		current: null
            	},
                comment: {
	            	visible: false,
	            	text: null
	            },
	            creditDebit: {
	    			type: 1,
	    			leaveType: null,
	    			count: null,
	    			remark: null,
	    			emp_ids: []
	    		},
		        isChecked: false,
	            leaveTypeList: [],
	            list: [],
	            pending: {
	    			_id: null,
	    			leaveDetails: [],
	    			count: 0
	    		},
	            possibility: {
	    			pending: 1,
	    			rejected: 2,
	    			approved: 3
	    		},
	            propertyName: 'leave_data.pending_leave',
	            reverse: true,	            
	            search: '',
	            selectedEmployees: [],
	            status: 2,
	            tab: {
		            all: true,
		            balance: false,
		            approved: false,
		            availed: false,
		            pending: false
		        },
		        visible: false,
				leaveId: null,
				filteredItems: [],
				unlimited: {
					text: utilityService.unlimitedText
				},
				individualRequests: {
					status: false,
					list: [],
					visible: false,
					filteredItems: [],
					search: '',
					propertyName: 'employee_details.full_name',
					reverse: true,
					isChecked: false,
					comment: {
						text: null
					}
				}				   			    		
            }
	    };
	    this.buildBulkRequestPayload = function(model) {
	    	var payload = [];
	    	angular.forEach(model.selectedEmployees, function(value, key) {
	    		if(value.isChecked) {
	    			var object  = {
						employee_id: value._id,
						request_ids: [],
						comment: model.comment.text,
						status: model.status
					};
					angular.forEach(value.leave_details, function(v, k) {
						if(v.isChecked) {
							object.request_ids.push(v._id);
						}						
					});
					payload.push(object);
	    		}
	    	});
	    	return payload;
	    };
	    var extractEmployeeIds = function(model) {
	    	var ids = [];
	    	angular.forEach(model.selectedEmployees, function(value, key) {
	    		if(value.isChecked) {
	    			ids.push(value._id);
	    		}
	    	});
	    	return ids;
	    };
	    this.buildCreditDebitPayload = function(model) {
	    	return {
	    		type: model.creditDebit.type,
    			leaveType: model.creditDebit.leaveType,
    			count: model.creditDebit.count,
    			remark: model.creditDebit.remark,
    			emp_ids: extractEmployeeIds(model)
	    	}
	    };
	    this.buildRemainderPayload = function(master, slave) {
	    	return {
	    		master_emp_id: master,
				slave_emp_id: slave,
				type: this.remainderType
	    	}
	    };
	    this.getTotalPendingRequests = function(list) {
	    	var count = 0;
	    	angular.forEach(list, function(value, key) {
	    		//count = count + value.pending_leave;
	    		count = count + utilityService.getValue(value, 'pending_leave', 0);
	    	});

	    	return count;
		};		
		this.buildEmpDetailList = function(empDetails, tab) {
			var arr = new Array(["Employee Name", "Employee ID"]);
			
			if (tab.availed) {
				arr[0].push("Availed");
			} else if (tab.approved) {
				arr[0].push("Approved");
			} else if (tab.pending) {
				arr[0].push("Pending");
			} else if (tab.balance) {
				arr[0].push("Balance");
			} else {
				arr[0].push("Availed");
				arr[0].push("Approved");
				arr[0].push("Pending");
				arr[0].push("Deducted");
				arr[0].push("Balance");
			}

			var object = {
				list: empDetails,
				content: arr
			};
			
			angular.forEach(object.list, function(value, key) {
				var array = new Array();

				array.push(utilityService.getValue(value.employee_preview, 'full_name'));
				array.push(utilityService.getValue(value.employee_preview, 'emp_id'));

				if (tab.all || tab.availed) {
					array.push(utilityService.getInnerValue(value, 'leave_data', 'availed_leave', 0));
				}
				
				if (tab.all || tab.approved) {
					array.push(utilityService.getInnerValue(value, 'leave_data', 'approved_leave', 0));
				}
				
				if (tab.all || tab.pending) {
					array.push(utilityService.getInnerValue(value, 'leave_data', 'pending_leave', 0));
				}
				
				if (tab.all) {
					array.push(utilityService.getInnerValue(value, 'leave_data', 'deduct_leave', 0));
				}

				if (tab.all || tab.balance) {
					var balanceLeave = utilityService.getInnerValue(value, 'leave_data', 'balance_leave', 0);
					array.push(balanceLeave == "unlimited" ? utilityService.unlimitedText : balanceLeave);
				}				

				object.content.push(array);
			});

			return object;
		};
		this.buildCSVData = function(list) {
			var object = {
				list: list,
				content: new Array(["Employee Name", "Employee ID", "Request Type", "Request Unit", 
					"Request On", "From", "To", "Leave Count", "Comment (If any)"])
			};
			
			angular.forEach(object.list, function(value, key) {
				var array = new Array();

				array.push(utilityService.getValue(value, 'full_name'));
				array.push(utilityService.getValue(value, 'employee_code'));
				array.push(utilityService.getValue(value, 'name'));
				array.push(utilityService.getValue(value, 'is_days') ? 'In Days' : 'In Hours');
				array.push(utilityService.getValue(value, 'request_on'));

				if (utilityService.getValue(value, 'is_days')) {
					array.push(utilityService.getValue(value, 'from_date_format'));
					array.push(utilityService.getValue(value, 'to_date_format'));
				} else {
					array.push(utilityService.getValue(value, 'from_hours'));
					array.push(utilityService.getValue(value, 'to_hours'));
				}

				array.push(utilityService.getValue(value, 'requested') 
					+ ' ' + (utilityService.getValue(value, 'is_days') ? 'Day(s)' : 'Hours'));
				array.push(utilityService.getValue(value, 'comment'));

				object.content.push(array);
			});

			return object;
		};
		this.buildBulkApproveRejectPayload = function(model) {
			var payload = [];
			
	    	angular.forEach(model.selectedEmployees, function(value, key) {
	    		if(value.isChecked) {
	    			var object  = {
						employee_id: value.emp_id,
						request_ids: [],
						comment: model.comment.text,
						status: model.status
					};
											
					object.request_ids.push(value._id);
					
					payload.push(object);
	    		}
			});
			
	    	return payload;
		};
		this.buildRequestDurationList = function() {
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
		this.buildDefaultRequestDuration = function() {
	    	return {
    			id: 4,
    			title: "Custom",
    			slug: "custom"
    		}
		};
		this.buildTimeOffObject = function () {
			return {
				requests: {
					duration: this.buildDefaultRequestDuration(),	            	
					durationList: this.buildRequestDurationList(),
					fromDate: null,
					toDate: null
				}
			}
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
	        		},
	        		next_7_days: {
	        			from: new Date(new Date(now).setDate(now.getDate())),
	        			to: new Date(new Date(now).setDate(now.getDate() + 6))
	        		},
	        		next_30_days: {
	        			from: new Date(new Date(now).setDate(now.getDate())),
	        			to: new Date(new Date(now).setDate(now.getDate() + 29))
	        		},
	        		next_90_days: {
	        			from: new Date(new Date(now).setDate(now.getDate())),
	        			to: new Date(new Date(now).setDate(now.getDate() + 89))
	        		},
	        	};
        	return rangeObject[slug];
        };
				
	    return this;
	}
]);