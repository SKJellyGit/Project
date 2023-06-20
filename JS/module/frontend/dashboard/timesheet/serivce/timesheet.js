app.service('TimesheetService', [
	'utilityService',
	function (utilityService) {
		'use strict';
		var self = this;
		var selfService = this;
		this.url = {
			timesheetJobData: 'timesheet/fields',
			timesheet: 'timesheet/fill',
			timesheets: 'timesheet/my-timesheets',
			clients: 'timesheet/clients',
			deleteTimesheet: 'timesheet/delete',
			tracker: 'timesheet/tracker',
			isApprover: 'timesheet/is-approver',
			currency: 'data/travel/currency-code1.json',
			downloadCsvForm: 'timesheet/download-form-sheet',
			uploadTimesheet: 'timesheet/upload-timesheets'
		};
		this.getUrl = function (apiUrl) {
			return getAPIPath() + this.url[apiUrl];
		};
		this.submitTimesheetModel = function (model) {
			return {
				start_date: utilityService.getValue(model, 'start_date'),
				end_date: utilityService.getValue(model, 'end_date'),
				description: utilityService.getValue(model, 'description'),
				start_time: utilityService.getValue(model, 'start_time'),
				end_time: utilityService.getValue(model, 'end_time'),
				multiple: false
			};
		};
		this.buildTrackerObject = function() {
			return {
				minDate: null,
				maxDate: null,
				clients: [],
				dates: [],
				convertedDates: [],
				overall: null
			};
		};

		this.buildClientsAndGroupsObject = function(model, client_slug) {
			return {
				clients: model ? model : null,
				job_groups: utilityService.getInnerValue(model, client_slug, 'job_group')
			};
		};

		this.buildTimesheetObject = function () {
			return {
				timesheetId: null,
				job_slug: null,
				job: null,
				client_slug: null,
				formFields: [],
				formFieldsObject: {},
				errorMessages: [],
				submitForMultipleDate: false,
				editMode: false,
				clientsAndGroups: this.buildClientsAndGroupsObject(),
				allTimesheets: null,
				weekStartDate: null,
				weekEndDate: null,
				defaultFields: {},
				visible: false,
				tracker: this.buildTrackerObject(),
				isApprover: false,
				currencyList: null
			};
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
		this.buildRequestList = function(data) {
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

			if(data && data.timesheets) {
				angular.forEach(data.timesheets, function(value, key) {
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
				});
			}

            return data;          
        };

		this.formatTime = function (time) {
			if (time && angular.isDefined(time.getHours()) && angular.isDefined(time.getMinutes())) {
				return (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
			}
		};
		this.buildDynamicPayloadForTimesheet = function (item, self, multiple) {
			// var payload = {
			// 	timesheet_start_time: selfService.formatTime(defaultFields.start_time),
			// 	timesheet_end_time: selfService.formatTime(defaultFields.end_time),
			// 	timesheet_start_date: utilityService.dateToString(defaultFields.start_date),
			// 	timesheet_description: defaultFields.description
			// };
			// if(defaultFields.multiple) {
			// 	payload['timesheet_end_date'] = utilityService.dateToString(defaultFields.end_date);
			// }
			var payload = {};
			angular.forEach(item, function (v, k) {
				if (v.field_type == 13 && self && angular.isDefined(v.validator) &&
					v.validator.is_multi_select == '0' && v.value != null) {
					payload[v.slug] = angular.isObject(v.value._id) ?
						new Array(v.value._id.$id) : new Array(v.value._id);
				} else if (v.field_type == 13 && self && angular.isDefined(v.validator) &&
					v.validator.is_multi_select == '1') {
					angular.forEach(self.value, function (val, ke) {
						var values = [];
						angular.forEach(val, function (result, index) {
							values.push(result.id);
						})
						payload[ke] = values;
					})
				} else if (v.field_type == 6) {
					payload[v.slug] = selfService.formatTime(v.value);
				} else if (((v.field_type === 5 && v.slug!=='timesheet_end_date') || (v.field_type === 5 && v.slug==='timesheet_end_date' && multiple)) && v.value && v.value!=="" && v.value != "NaN/NaN/NaN") {
					payload[v.slug] = utilityService.dateFormatConvertion(v.value);
				} else if (v.format_type == 1 || v.field_type == 10 || v.field_type == 12) {
					if (v.value != null) {
						payload[v.slug] = v.value.toString();
					}
				} else if (v.field_type == 11) {
					payload[v.slug] = [];
					angular.forEach(v.element_details, function (v11, k11) {
						if (angular.isDefined(v11.isChecked) && v11.isChecked) {
							payload[v.slug].push(v11._id);
						}
					});
				} else if (v.field_type == 3) {
					payload[v.slug] = v.value != "" ? parseInt(v.value) : v.value;
				} else if (v.field_type == 9) {
					payload[v.slug] = v.value ? v.value.toLowerCase() : null;
				} else {
					payload[v.slug] = v.value;
				}
			});
			return payload;
		};
	}
]);