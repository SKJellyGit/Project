app.service('TimesheetApproverService', [
	'utilityService',
	function (utilityService) {
		'use strict';
		var self = this;
		this.isApprover = false;
		
		this.url = {
			/**** Approver Related Routes ****/
			isApprover: 'timesheet/is-approver',

			approver: 'timesheet/approver-timesheets',
			staffSummary: 'timesheet/approver-staff-summary',
			approverAction: 'timesheet/approver-bulk-action',			
			clients: 'timesheet/approver-client-names',
			jobs: 'timesheet/approver-job-names',

			/**** Admin Related Routes ****/
			approverAdmin: 'timesheet-admin/approver-timesheets',
			staffSummaryAdmin: 'timesheet-admin/approver-staff-summary',
			approverActionAdmin: 'timesheet-admin/approver-bulk-action',
			clientsAdmin: 'timesheet-admin/approver-client-names',
			jobsAdmin: 'timesheet-admin/approver-job-names',
			allocated: 'timesheet-admin/allocated-timesheets',


			/**** Project Manager Related Routes ****/
			approverProjectManager: 'timesheet-project-manager/approver-timesheets',
			staffSummaryProjectManager: 'timesheet-project-manager/approver-staff-summary',
			approverActionProjectManager: 'timesheet-project-manager/approver-bulk-action',
			clientsProjectManager: 'timesheet-project-manager/approver-client-names',
			jobsProjectManager: 'timesheet-project-manager/approver-job-names',

			/**** Follower Related Routes ****/
			approverFollowers: 'timesheet-followers/approver-timesheets',
			staffSummaryFollowers: 'timesheet-followers/approver-staff-summary',
			approverActionFollowers: 'timesheet-followers/approver-bulk-action',
			clientsFollowers: 'timesheet-followers/approver-client-names',
			jobsFollowers: 'timesheet-followers/approver-job-names',
			
			/**** Generic Routes ****/
	    	currency: 'data/travel/currency-code1.json',
	    	remainder: 'prejoin/frontend/send-reminder',
		};
		this.getUrl = function (apiUrl) {
			return getAPIPath() + this.url[apiUrl];
		};				
		this.buildTypeList = function () {
			return [
    			{
    				title: "All Status",
    				status: 0
    			},
    			{
    				title: "Pending",
    				status: 1
    			},
    			{
    				title: "Approved",
    				status: 2
    			},
    			{
    				title: "Rejected",
    				status: 3
    			}
    		]
		};
		this.buildStatusHashmap = function () {
			return {
    			1: {
	    			title: 'Pending',
	    			class: 'orange',
	    			icon: 'more_horiz'
	    		},
	    		3: {
	    			title: 'Approved',
	    			class: 'green',
	    			icon: 'check'
	    		},
	    		10: {
	    			title: 'Approved',
	    			class: 'green',
	    			icon: 'check'
	    		},
	    		11: {
	    			title: 'Rejected',
	    			class: 'red',
	    			icon: 'cear'
	    		},
	    		8: {
	    			title: 'Approved',
	    			class: 'green',
	    			icon: 'check'
	    		},
	    		9: {
	    			title: 'Rejected',
	    			class: 'red',
	    			icon: 'cear'
	    		}
	    	}
		};
		this.buildStatusPossibilityObject = function () {
			return {
    			pending: 1,
    			reject: this.isApprover ? 11 : 9,
    			approve: this.isApprover ? 10 : 8 
    		}
		};
		this.buildOptionsList = function() {
			return [
				{
					title: 'Client',
					keyName: 'client_name'
				},
				{
					title: 'Job',
					keyName: 'job_group'
				},
				{
					title: 'Employee',
					keyName: 'emp_name'
				}
			];
		};
		this.buildFilterObject = function() {
			return {
				options: this.buildOptionsList(),
				selectedOption: null,
				values: [],
				selectedValue: null,
				type: null,
				typeList: this.buildTypeList(),
				startDate: null,
				endDate: null
			};
		};
		this.buildApproverObject = function () {
			return {
				list: [],
				filteredList: [],
				visible: false,
	    		statusMap: this.buildStatusHashmap(),
		    	statusPossibility: this.buildStatusPossibilityObject(),
	    		comment: null,
	    		action: null,
	    		action_id: null,
	    		action_ids: [],
				source: null,
				filter: this.buildFilterObject(),
				sort: {
					field: null,
					reverse: false
				}
			};
		};
		this.buildStaffObject = function() {
			var date = utilityService.getCurrentAndOneMonthPreviousDate();
			return {
				list: [],
				filteredList: [],
				visible: false,
				startDate: date.startDate,
				endDate: date.endDate
			}
		};
		this.buildTimesheetApproverObject = function () {
			return {
				approver: this.buildApproverObject(),
				staff: this.buildStaffObject(),
				isApprover: false,
				errorMessage: null,
				client: {
					selected: '',
					list: []
				},
				job: {
					selected: '',
					list: []
				},
				year: {
					selected: utilityService.getCurrentYear(),
					list: utilityService.getYearList(utilityService.startYear)
				},
				month: {
					selected: utilityService.getCurrentMonth(),
					list: utilityService.buildMonthList()
				}
			}
		};
		this.extractActionIds = function(list) {
			var actionIds = [];

			angular.forEach(list, function(value, key) {
                if (value.isChecked) {
                    actionIds.push(value.action_detail._id.$id);
                }
            });

            return actionIds;
		};
		this.buildPayloadForIndividual = function (model) {
			var payload = [];

			payload.push({
				action_id: model.action_id,
	            status: model.action,
	            comment: model.comment
			});

			return payload;
		};
		this.buildPayloadForBulk = function (model) {
			var payload = [];

			angular.forEach(model.action_ids, function(value, key) {
				payload.push({
					action_id: value,
		            status: model.action,
		            comment: model.comment
				});
			});

			return payload;
		};
		this.buildApproverActionPayload = function (model) {
			return  {
				actions: (model.source === 'individual') 
					? this.buildPayloadForIndividual(model) 
					: this.buildPayloadForBulk(model)
			}
		};
		this.buildStaffExportListHeader = function(staff) {
			// Build header columns with some static values
			var columnHeaders = new Array('Employee Details', 'Employee Code', 'Client', 'Job');

			// Build header columns with some dynamic values
            angular.forEach(staff.list.heads.dates, function (value, key) {
                columnHeaders.push(key);
            });
            
            // Build header columns with some static values
            columnHeaders.push('Total Hours');
            columnHeaders.push('Budgeted Hours');
            
            return new Array(columnHeaders);
		};
		this.buildStaffSummaryCSVContent = function (staff) {
			var csvContent = this.buildStaffExportListHeader(staff);

            angular.forEach(staff.filteredList, function(value, key) {
                var array = new Array();
                
                array.push(utilityService.getInnerValue(value, 'employee', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'employee', 'personal_profile_employee_code'));
                array.push(utilityService.getValue(value, 'client_name'));
                array.push(utilityService.getValue(value, 'job_group'));
                
                angular.forEach(staff.list.heads.dates, function(v, date) {
                	if (angular.isDefined(value[date]) && value[date]) {
						var totalDateWiseHours = utilityService.changeTimesheetFormat(utilityService.getInnerValue(value, date, 'total'));
						array.push(totalDateWiseHours);

                		/* var strTimeHours = '';
                		if (value[date].total) {
                			strTimeHours = value[date].total + ' Hours';
                		}

                		angular.forEach(value[date].durations, function (v, k) {
                			strTimeHours+= "\n" + v;
                		});

                		if (!strTimeHours) {
                			strTimeHours = 'N/A';
                		}

						array.push(strTimeHours); */
					} else {
                		array.push('N/A');
                	}
                });
				
				var totalHours = utilityService.changeTimesheetFormat(utilityService.getValue(value, 'total'));
				var budgetedHours = utilityService.changeTimesheetFormat(utilityService.getValue(value, 'budgeted_hours'));
				
				array.push(totalHours);
				array.push(budgetedHours);

                //array.push(utilityService.getValue(value, 'total', 'N/A'));
                //array.push(utilityService.getValue(value, 'budgeted_hours', 'N/A'));
                
                csvContent.push(array);
            });

            return csvContent;
		};
		this.buildApproverExportListHeader = function(approver) {
			// Build header columns with some static values
			var columnHeaders = new Array('Client', 'Job', 'Employee Code', 'Employee', 'expense', 
				'Date');

			if(approver.duration_type == 1) {
				columnHeaders.push('Time Duration');
			}
			columnHeaders.push(approver.duration_type === 1 ? 'Total Time' : 'Duration');
			columnHeaders.push('Status');

			var dynamicColumns = utilityService.getInnerValue(approver.list, 'heads', 'dynamic');
			// Build header columns with some dynamic values
            angular.forEach(dynamicColumns, function (value, key) {
                columnHeaders.push(value);
			});
			
			columnHeaders.push('Description');

            	
            // Build header columns with some static values
            //columnHeaders.push('Status');
            
            return new Array(columnHeaders);
		};		
		this.buildApproverSummaryCSVContent = function (approver) {
			var csvContent = this.buildApproverExportListHeader(approver);

            angular.forEach(approver.filteredList, function(value, key) {
                var array = new Array(),
                	employee = value.action_detail.emp_detail;
                
                array.push(utilityService.getValue(value, 'client_name'));
				array.push(utilityService.getValue(value, 'job_group'));
                array.push(utilityService.getValue(employee, 'personal_profile_employee_code'));
                array.push(utilityService.getValue(employee, 'full_name'));
                array.push(utilityService.getValue(value, 'expense', ' '));
				array.push(utilityService.getValue(value, 'timesheet_start_date', ' '));
				if(approver.duration_type == 1) {
					var timeDuration = ' ';
					if (utilityService.getValue(value, 'timesheet_start_time')
						&& utilityService.getValue(value, 'timesheet_end_time')) {
						timeDuration = value.timesheet_start_time + '-' + value.timesheet_end_time;
					}
					array.push(timeDuration);
				}
				
				array.push(utilityService.getValue(value, 'formatted_time', 0));
				array.push(approver.statusMap[value.status].title);
				
				var dynamicColumns = utilityService.getInnerValue(approver.list, 'heads', 'dynamic');
                angular.forEach(dynamicColumns, function(v, k) {
                	array.push(utilityService.getInnerValue(value, 'dynamic', k, ' '));
                });
				array.push(utilityService.getValue(value, 'timesheet_description', ' '));
                
                csvContent.push(array);
            });

            return csvContent;
		};
		this.rebuildArroverList = function(list) {
			angular.forEach(list, function(value, key) {
                value.dummy_status = value.status == 1 ? 1 : 0;
                value.filter_status = (value.status == 9 || value.status == 11) ? 3 
                	: ((value.status == 3 || value.status == 8 || value.status == 10) 
						? 2 : (value.status == 15 ? 4 : 1));
				
				value.formatted_time = utilityService.changeTimesheetFormat(utilityService.getValue(value, 'total_time'));
			});
		};
		this.getClientIdByName = function(client) {
			var clientId = null;
			
			angular.forEach(client.list, function(value, key) {
				if (value.client_name === client.selected) {
					clientId = value._id;
				}
			});

			return clientId;
		};
		this.buildRemainderPayload = function(item, empId) {
			return {
				slave_emp_id: new Array(utilityService.getInnerValue(item, 'action_detail', 'targeted_emp')),
				master_emp_id: empId,
				request_id: utilityService.getValue(item, 'setting_id'),
				reference_id: utilityService.getValue(item, 'timesheet_id'),
				type : "timesheet_approver_reminder"
			};
		};
		this.buildAllocatedExportListHeader = function(approver) {
			// Build header columns with some static values
			var columnHeaders = new Array('Client', 'Job', 'Employee', 'Employee ID', 
				'Start Date', 'End Date', 'Allocated Hours');
						
            return new Array(columnHeaders);
		};		
		this.buildAllocatedTimesheetCSVContent = function (approver) {
			var csvContent = this.buildAllocatedExportListHeader(approver);

            angular.forEach(approver.filteredList, function(value, key) {
                var array = new Array(),
                	employee = utilityService.getValue(value, 'emp_detail');
                
                array.push(utilityService.getValue(value, 'client_name'));
                array.push(utilityService.getValue(value, 'job_group'));
				array.push(utilityService.getValue(employee, 'full_name'));
				array.push(utilityService.getValue(employee, 'personal_profile_employee_code'));
				array.push(utilityService.getValue(value, 'start_date', 'N/A'));
				array.push(utilityService.getValue(value, 'end_date', 'N/A'));				
                array.push(utilityService.getValue(value, 'formatted_time', 'N/A'));
				
                csvContent.push(array);
            });

            return csvContent;
		};
		
	}
]);