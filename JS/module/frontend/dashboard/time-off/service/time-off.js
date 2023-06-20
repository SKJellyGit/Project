app.service('TimeOffService', [
	'utilityService', 'FORM_BUILDER', 'DashboardService', '$filter',   
	function (utilityService, FORM_BUILDER, DashboardService, $filter) {
		'use strict';
		var self = this;

        this.url = {
    	   summary: 'employee/leave/list',
		   leaveRequest: 'employee/leave',
    	   cancelRequest : 'employee/leave/cancel',
    	   graph: 'employee/leave/graph/detail',
    	   details: 'employee/leave/detail',
    	   holiday: 'employee/holiday/detail',
    	   applyRH: 'employee/restricted/holiday-validation',
    	   updateRH: 'employee/restricted/holiday',
    	   cancelRH: 'employee/holiday/cancel',
    	   specificDetail: 'employee/leave-plan/detail',
    	   otherLeaveRequest: 'employee/leave/request',
    	   otherHolidayList: 'employee/holiday/list',
    	   leaveDocument: 'employee/leave-document'
        };
        this.functionMap = {
        	status: 'getTimeOffList',
        	request: 'getLeaveRequestList',
        	detail: 'getLeaveDetails',
        	holiday: 'getHolidayList'
        };
        this.monthHashMap = {
    		1: "JAN",
    		2: "FEB",
    		3: "MAR",
    		4: "APR",
    		5: "MAY",
    		6: "JUN",
    		7: "JULY",
    		8: "AUG",
    		9: "SEP",
    		10: "OCT",
    		11: "NOV",
    		12: "DEC"
    	};
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildDurationList = function() {
	    	return [
	    		{
	    			id: 2,
	    			title: "Day on Day",
	    			slug: "dod",
	    		},
	    		{
	    			id: 3,
	    			title: "Week on Week",
	    			slug: "wow"
	    		},
	    		{
	    			id: 4,
	    			title: "Month on Month",
	    			slug: "mom"
	    		},
	    		{
	    			id: 5,
	    			title: "Year on Year",
	    			slug: "yoy"
	    		}
	    	]
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
	    this.buildDefaultSummaryDuration = function() {
	    	return {
	            id: 4,
	            title: "Month on Month",
	            slug: "mom"
	        }
	    };
	    this.buildDefaultRequestDuration = function() {
	    	return {
    			id: 4,
    			title: "Custom",
    			slug: "custom"
    		}
	    };
	    this.buildDefaultSelectedType = function() {
	    	return {
    			id: 1,
    			title: "All Holiday Type",
    			slug: "all"
    		}
	    };
	    this.buildDefaultSummaryPeriod = function() {
	    	return {
    			id: 3,
    			title: "Next 90 Days",
    			slug: "next_90_days"
    		}
	    };
	    this.buildSummaryPeriodList = function() {
    		return [
    			{
	    			id: 1,
	    			title: "Next 7 Days",
	    			slug: "next_7_days"
	    		},
	    		{
	    			id: 2,
	    			title: "Next 30 Days",
	    			slug: "next_30_days"
	    		},
	    		{
	    			id: 3,
	    			title: "Next 90 Days",
	    			slug: "next_90_days"
	    		}]
	    };
	    this.getCurrentYear = function() {
	    	var date = new Date(),
                currentYear = date.getFullYear();

            return currentYear;
	    };
	    this.buildTimeOffObject = function() {
	    	return {
	            leaveTypeList: [],
	            propertyName: '',
	            reverse: false,
                selectedTab: 0,
                isSelected: false,
	            daysMap: utilityService.buildDaysMappingObject(),
	            summary: {
	                list: [],
	                graph: [],
	                graphData: [],
	                selectedLeaveType: [],
			        duration: this.buildDefaultSummaryDuration(),
	                durationList: this.buildDurationList(),
	                fromDate: null,
			        toDate: null,
	                visible: true,
	                viewType: {
	                    list: {
	                        status: true
	                    },
	                    graph: {
	                        status: false
	                    }
	                },
	                period: this.buildDefaultSummaryPeriod(),
	                periodList: this.buildSummaryPeriodList(),
	                graphNoData: true,
	                graphOriginal: [],
	                additionalData: null,
	                loader : {
	                	visible: false
	                },
					toMaxDate: new Date("12/31/"+ this.getCurrentYear()),
					unlimited: {
						text: utilityService.unlimitedText
					}
	            },
	            requests: {
	            	list: [],
	            	selectedLeaveType: [],
		            duration: this.buildDefaultRequestDuration(),	            	
	            	durationList: this.buildRequestDurationList(),
	            	fromDate: null,
			        toDate: null,
			        visible: true,
			        comment: {
			        	text: null
					},
					filterList: []
	            },
	            details: {
	            	list: [],
			        visible: true,
	            	mapping: {
	            		day: {
				            1: "Full Day",
				            2: "First Half",
				            3: "Second Half"
				        },
				        accrual: {
				        	cycle: {
					        	1: "Weekly",
							    2: "Bi-Weekly",
							    3: "Monthly",
							    4: "Bi-Monthly",
							    5: "Quarterly",
							    6: "Semi-Annually",
							    7: "Annually",
							    8: "Bi-Annually"
					        },
					        time: {
					        	1: "Beginning Of The Cycle",
					        	2: "Middle Of The Cycle",
					        	3: "End Of The Cycle"
					        }
					    },
					    renewal: {
					    	1: "Do Not Renewal",
				            2: "On Work Anniversary",
				            3: "On Date",
				            4: "Max Limit Dring Employeement Tenure"
					    },
					    newHire: {
					    	accrual: {
					    		type: {
					    			1: "From Start Day",
					    			2: "Post Probation"
					    		},
					    		postUnit: {
				    				2: "Day",
					    			3: "Week",
					    			4: "Month"
				    			}
					    	},
					    	usage: {
					    		type: {
					    			1: "From Start Day",
					    			2: "Post Probation"
					    		},
					    		postUnit: {
				    				2: "Day",
					    			3: "Week",
					    			4: "Month"
				    			}
					    	},
					    	proRate: {
					    		type: {
					    			1: "Nearest No",
					    			2: "Round Up",
					    			3: "Round Down"
					    		}
					    	}
					    },
					    month: this.monthHashMap,
					    gender: {
					    	12: "Male",
					    	13: "Female"
						},
						baseEntitlement: {
							type: {
								1 : utilityService.unlimitedText
							},
							unit: {
								1: 'Hour(s)',
								2: 'Day(s)'
							}
						}
	            	}
	            },
	            holiday: {
	            	list: [],
	            	totalRestricted: 0,
	            	selectedType: this.buildDefaultSelectedType(),
	            	typeList: [
	            		{
	            			id: 1,
	            			title: "All Holiday Type",
            				slug: "all",
            				is_restricted: ''
	            		},
	            		{
	            			id: 2,
	            			title: "Mandatory",
            				slug: "mandatory",
            				is_restricted: false
	            		},
	            		{
	            			id: 3,
	            			title: "Restricted/Optional",
            				slug: "restricted",
            				is_restricted: true
	            		}
	            	],
	            	cpylist: [],
	            	visible: false,
	            	restricted: {
	            		allowed: 0,
	            		applied: 0,
	            		avail: 0,
	            		total: 0	            		
	            	},
	            	filterList: []
	            },
	            carryOverMap: {
	            	1: "Days",
	            	2: "%",
	            	3: "Hours"
	            }
	        }
	    };
	    this.getDODCategories = function(mdl, additionalData) {
	    	var categories = [];
	    	for (var i = additionalData.start; i <= additionalData.end; i++) {
               categories.push('Day' + i);
            }
            return categories;
	    };
	    this.getWOWCategories = function(mdl, additionalData) {
            var categories = [];
            for (var i = additionalData.start; i <= additionalData.end; i++) {
	            categories.push('Week' + i);
	        }            
            return categories;
	    };
	    this.getMOMCategories = function(mdl, additionalData) {
	    	var categories = [];
	    	additionalData.end = additionalData.start > additionalData.end ? parseInt(additionalData.end, 10) + 12 : parseInt(additionalData.end, 10);

    		for(var i=additionalData.start; i<=additionalData.end; i++) {
    			categories.push((i > 12 ? this.monthHashMap[i-12] : this.monthHashMap[i]) + ' ' + (i > 12 ? additionalData.endYear : additionalData.startYear));
    		}
	    	
	    	return categories;
	    };
	    this.getYOYCategories = function(mdl, additionalData) {
	    	var categories = [];	    		
	    	for (var i = additionalData.start; i <= additionalData.end; i++) {
               categories.push(i);
            }
	    	return categories;
	    };
	    this.buidXAxisSummaryGraphData = function(mdl, additionalData) {	    
	    	var categories = [];
		    switch(mdl.duration.slug) {
	            case 'dod':
            		categories = this.getDODCategories(mdl, additionalData);
            		break;

	            case 'wow':
            		categories = this.getWOWCategories(mdl, additionalData);
            		break;

	            case 'yoy':
            		categories = this.getYOYCategories(mdl, additionalData);
            		break;

	            default:
	            	categories = this.getMOMCategories(mdl, additionalData);            		
           			break;
	        }
	        return categories;
        };
        this.is31DaysMonth = function(date) {
        	var m = date.getMonth() + 1;
        	return (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12);
        };
        this.is30DaysMonth = function(date) {
        	var m = date.getMonth() + 1;
        	return (m == 4 || m == 6|| m == 9 || m == 11);
        };

        this.setAdditionalSortableKey = function(v) {
        	v.hrsaccrued = v.accrued;
        	v.hrsused = v.used;
        	v.hrsrequested = v.requested;
        	v.hrsbalance = v.balance;
        	if(utilityService.getValue(v, 'unit') && v.unit == 2) {
        		v.hrsaccrued = v.accrued * 24;
	        	v.hrsused = v.used * 24;
	        	v.hrsrequested = v.requested * 24;
	        	v.hrsbalance = v.balance * 24;
        	}
        };
        this.buildSummaryList = function(data) {
            angular.forEach(data, function(v, k) {
				v._id = angular.isObject(v._id) ? v._id.$id : v._id;
				v.used_current_year = '-';
				if(v.accrued != 'unlimited' && v.name != 'Paternity Leave' && v.name != 'Maternity Leave') {
					v.used_current_year = (v.accrued - v.balance - v.requested);
					v.used_current_year = v.used_current_year<0 ? 0 : v.used_current_year;
					if(!isNaN(v.used_current_year)) {
						v.used_current_year = $filter('numbers')(v.used_current_year, 2);
					}
				}
                self.setAdditionalSortableKey(v);
            });
            return data;
        };
        this.checkForPending = function(v, list) {
        	v.dummyStatus = (v.status==16)?1:v.status;
        	if(list.indexOf(v.dummyStatus) == -1) {
				v.pending = true;
				list.push(v.dummyStatus);
			} else {
				v.notReceived = true;
			}
        };
        this.checkForRejected = function(v, list) {
        	if(list.indexOf(v.status) == -1) {
				v.rejected = true;
				list.push(v.status);
				list.push(1);
			} else {
				v.notReceived = true;
			}
        };
        this.checkForCancelled = function(v, list) {
        	if(list.indexOf(v.status) == -1) {
				v.cancelled = true;
				list.push(v.status);
				list.push(1);
			} else {
				v.notReceived = true;
			}
        };
        this.hasAdminOrLeadTakenAnyAction = function(status) {
         	var list = [8, 9, 12, 13];
         	return list.indexOf(status) >= 0 ? true : false;
        };
        this.setAdminAction = function(value) {
         	if(value.status == 8) {
    			value.adminApproved = true;
   			} else if(value.status == 9) {
    			value.adminRejected = true;
   			} else if(value.status == 12) {
    			value.leadApproved = true;
   			} else {
    			value.leadRejected = true;
   			}
        };
        this.buildRequestList = function(data, setAdditionalKey) {
         	/* 	Pending: 1;
				Cancle: 2;
				Approved: 3;
				Request for Calcellation: 4;
				Request for Modified: 5;
				Accelerate Request: 6;
				Accelerated: 7;
				Admin Approved: 8;
				Admin Rejected: 9;
				Approver Approved: 10;
				Approver Reject: 11;
				Team Leader Approved: 12;
				Team Leader Reject: 13;
				Rejected: 14;
				Cancel Request: 15;
				Status Escalated: 16; */

			setAdditionalKey = setAdditionalKey || false;
			
			angular.forEach(data, function(value, key) {
        		if(utilityService.getValue(value, 'approver_chain') && value.approver_chain.length
        			&& !self.hasAdminOrLeadTakenAnyAction(value.status)) {
        			var list = [];
	        		value.approver_chain_list = [];
	            	angular.forEach(value.approver_chain, function(v, k) {
	            		(value.status == 2) ? self.checkForCancelled(v, list)
	            			: ((v.status == 9 || v.status == 11 || v.status == 13 || v.status == 14) 
	            				? self.checkForRejected(v, list) 
	            					: ((v.status == 1 || v.status == 16) ? self.checkForPending(v, list) : v.approved = true));

	               		value.approver_chain_list.push(v);
	              	});
	              	
	              	if(utilityService.getValue(value, 'cancle_approver_chain') && value.cancle_approver_chain.length) {
	            		var list = [];
	            		value.cancle_approver_chain_list = [];
	               		angular.forEach(value.cancle_approver_chain, function(v, k) {
	                		(value.status == 2) ? self.checkForCancelled(v, list)
	                 			: ((v.status == 9 || v.status == 11 || v.status == 13 || v.status == 14) 
	                  				? self.checkForRejected(v, list) 
	                  					: ((v.status == 1 || v.status == 16) ? self.checkForPending(v, list) : v.approved = true));

	                		value.cancle_approver_chain_list.push(v);
	               		});
	           		}
	          	} else {
	           		value.approver_chain_list = [];
	           		(value.status == 2) ? value.cancelled = true
	               		: ((value.status == 9 || value.status == 11 || value.status == 13 || value.status == 14) 
	                		? value.rejected = true 
	                 		: ((value.status == 1 || value.status == 16) ? value.pending = true : value.approved = true));

	              	if(self.hasAdminOrLeadTakenAnyAction(value.status)) {
	               		self.setAdminAction(value);
	              	}                      
				}

				// Here we need to set some additional keys like filter_status, employee_original_claim_amount etc
				if (setAdditionalKey) {
					utilityService.setFilterStatusKey(value);
					utilityService.setClaimMonthKey(value);
					utilityService.setClaimYearKey(value);
				}
            });

            return data;          
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
        this.buildGraphData = function(leaveDetails) {
        	var total = 0;
        	angular.forEach(leaveDetails, function(v, k) {
                v._id = v._id.$id;
                var sum = v.data.reduce(function(a, b){return a + b}, 0);
                total = total + sum;
            });
            return {
            	leaveDetails: leaveDetails,
            	graphNoData: total > 0 ? false : true
            };
        };
        this.buildDurationParams = function(model) {
            var params = {
                duration: model.duration.id
            };
            if(model.fromDate && model.toDate) {
            	params.from = utilityService.dateFormatConvertion(model.fromDate, true);
            	params.to = utilityService.dateFormatConvertion(model.toDate, true);
            }
            return params;
        };
        this.filterHolidayList = function(object) {
            var result = [];
            if(object.fromDate && object.toDate) {
                        
                for (var i=0; i < object.list.length; i++){
                    var tf = new Date(object.list[i][object.key1] * 1000),
                        tt = new Date(object.list[i][object.key2] * 1000);
                        
                    if (tf > object.fromDate && tt <= object.toDate)  {
                        result.push(object.list[i]);
                    }
                }
            } else {
                result = list;
            }
            return result;
        };
        this.buildRestrictedHolidayModel = function(model) {
	    	return {
	    		holidayId: utilityService.getValue(model, 'holidayId'),
	    		approverChain: utilityService.getValue(model, 'approver_chain'),
	    		form: {
	    			name: utilityService.getInnerValue(model, 'form_detail', 'name'),
	    			description: utilityService.getInnerValue(model, 'form_detail', 'description')
	    		}    		
	    	}
	    };
	    this.buildRestrictedHolidayPayload = function(model, questionList) {
	    	var payload = {};
 			angular.forEach(questionList, function(value, key) {
 				if(!value.isConditional) { 					
					payload["question_" + value._id] = (value.question_type == FORM_BUILDER.questionType.date) 
						? utilityService.dateFormatConvertion(value.answer) 
						: payload["question_" + value._id] = value.answer; 					 					
 				} 				
 			});
 			return payload;
	    };
	    this.syncGraphAdditionalData = function(model) {
	    	return {
	    		start: parseInt(utilityService.getValue(model, 'start'), 10),
	    		end: parseInt(utilityService.getValue(model, 'end'), 10),
	    		startYear: parseInt(utilityService.getValue(model, 'start_year'), 10),
	    		endYear: parseInt(utilityService.getValue(model, 'end_year'), 10)
	    	}
	    };
	    this.getGraphColorCodes = function(list) {
	    	list = angular.isObject(list) ? list : JSON.parse(list);
	    	var colorCodes = [],
	    		colorObject = utilityService.buildColorObject();

	    	angular.forEach(list, function(value, key) {
	    		var leaveType = value.name.replace(/ /g,"_").toLowerCase();            
	            var code = utilityService.getValue(colorObject[leaveType], 'code') 
	                ? colorObject[leaveType].code : colorObject.other_leave.code;

	            colorCodes.push(code);
	    	});
	    	return colorCodes;
	    };
	    this.buildMonthDurationObject = function(date, months) {
            date.setMonth(date.getMonth() + months);
            var month = date.getMonth(),
            	year = date.getFullYear(),
            	monthList = DashboardService.getMonthsName(),
                object = {
                    month: month == 0 ? 12 : month,
                    year: month == 0 ? year - 1 : year,
                    active: month == utilityService.getCurrentMonth()
                };
                
            object.monthName = monthList[object.month - 1];

            return object;
        };
        this.buildMonthDurationList = function() {
        	var list = [];
        	for(var i=-5; i<= 6; i++) {
                list.push(this.buildMonthDurationObject(new Date(), i));                
            }

            return list;
		};
		this.buildCSVColumns = function () {
			var columns = ["Request Type", "Request Type Comment", "Request On", 
				"Request On Comment (If any)", "Request From", "Request To", "Duration", 
				"Status"];
				
            return new Array(columns);
        };
        this.buildCSVData = function(model) {
			var leaveStatusMapping = utilityService.buildApproverStatusHashMap(),
				object = {
					list: model.filterList,
					content: this.buildCSVColumns()
				};
			
			angular.forEach(object.list, function(value, key) {
				var array = new Array(),
					requestedBy = utilityService.getValue(value, 'requested_by'),
                    requestedOnComment = requestedBy ? 'On Behalf of you by ' + (utilityService.getValue(value, 'relationship') == 'admin' ? 'Admin' : 'Manager') : '',
                    durationUnit =  utilityService.getValue(value, 'is_days') 
                        ? (utilityService.getValue(value, 'requested') > 1 ? 'Days': 'Day') 
                        : (utilityService.getValue(value, 'requested') > 1 ? 'Hours': 'Hour')                
                    
                array.push(utilityService.getValue(value, 'name'));
                array.push(utilityService.getValue(value, 'comment'));
                array.push(utilityService.getValue(value, 'request_on'));
                array.push(requestedOnComment);

                if (utilityService.getValue(value, 'is_days')) {
                    array.push(utilityService.getValue(value, 'from_date_format'));
                    array.push(utilityService.getValue(value, 'to_date_format'));
                } else {
                    array.push(utilityService.getValue(value, 'from_hours'));
                    array.push(utilityService.getValue(value, 'to_hours'));
                }   
                
				array.push(utilityService.getValue(value, 'requested') + ' ' + durationUnit);				
				array.push(leaveStatusMapping[utilityService.getValue(value, 'status', 1)]);
                
				object.content.push(array);
			});

			return object;
		};

		return this;
	}
]);
