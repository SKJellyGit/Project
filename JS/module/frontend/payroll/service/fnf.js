app.service('FullFinalService', ['utilityService', '$filter',
    function (utilityService, $filter) {
		'use strict';
		var self = this;
		this.domainApiUrl = utilityService.getInnerValue(config[envMnt], 'path', 'api');
		this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
        this.url = {
    	   listing: 'payroll/relieved-employees',
    	   fnfDetails: 'payroll/initiate-fnf-data',
    	   initiateFnf: 'payroll/initiate-fnf',
		   certificate: 'payroll/download-fnf-certificate',
		   downloadFnf: 'payroll/download-bulk-initiate-fnf',
		   uploadFnf: 'payroll/upload-bulk-initiate-fnf',
		   updateEmail: 'payroll/emp-personal-field',
		   sendLink: 'payroll/send-exit-expire-link',
		   pendingRequests: 'payroll/all-pending-requests',
		   bulkFnfDetails: 'payroll/all-initiate-fnf-data',
		   allLeaves: 'admin/leave/type',
		   allAssets: 'provisions/settings',
		   allClearances: 'exit-formalities/clearance',
		   fnfHistory: 'payroll/fnf-history',
		   bulkInitiate: 'payroll/bulk-initiate-fnf-data',
		   bulkSaveAsDraft: 'payroll/initiate-bulk-fnf',
		   modulePermission: 'employee/module-permission'
		};		
		this.buildFnfFDetailsObject = function () {
			return {
				list: [],
				visible: false,
				propertyName: '',
				reverse: false,
				filteredItems: [],
				search: '',
				fnfStatus: {
					selected: 1,
					list: this.buildFnfStatusList(),
					mapping: this.buildFnfStatusMappingObject(),
					month: {
						object: utilityService.buildMonthObject(),
						selected: utilityService.getCurrentMonth()
					},
					year: {
						list: utilityService.getYearList(utilityService.startYear),
						selected: utilityService.getCurrentYear()
					},
					isDraft: undefined
				},
				actionStatus: {
					mapping: this.buildActionStatusMappingObject()
				},
				dialogBox: {
					updateEmail: {
						title: 'Update Email',
						textContent: 'Please double check every thing before taking this action.',
						ok: 'Continue',
						cancel: 'Cancel'
					},
					generateAndSendLink: {
						title: 'Generate & Send Link',
						textContent: 'Please double check every thing before taking this action.',
						ok: 'Continue',
						cancel: 'Cancel'
					},
					reGenerateAndSendLink: {
						title: 'Re-Generate & Send Link',
						textContent: 'Please double check every thing before taking this action.',
						ok: 'Continue',
						cancel: 'Cancel'
					},
					stopAccessToLink: {
						title: 'Stop Access to Link',
						textContent: 'This action will cause the link available with the employee to stop working and they will no longer be able to view their documents.',
						ok: 'Continue',
						cancel: 'Cancel'
					},
					updateFnf: {
						title: 'Update FNF',
						textContent: 'Please make sure that once you take this action you will not be able to make any further changes.',
						ok: 'Continue',
						cancel: 'Cancel'
					},
					bulkUpdateFnf: {
						title: 'Bulk Initiate FNF',
						textContent: 'Please make sure that once you take this action you will not be able to make any further changes.',
						ok: 'Continue',
						cancel: 'Cancel'
					}
				},
				pendingRequests: null,
				request: {
					mapping: {
						'travel_request': 'Travel Request',
						'expense_request': 'Expense Request',
						'leave_request': 'Leave Request',
						'provision_request': 'Provision Request',
						'advance_request': 'Advance Request'
					},
					totalCount: 0
				},
				history: {
					logId: null,
					logDate: null,
					list: []
				},
				defaultData: null,
				item: null,
				selectedEmployees: 0,
				checkAll: false
			}
		};				
        this.buildFnfObject = function(model, title) {
            model = angular.isDefined(model) ? model : null;
            title = angular.isDefined(title) ? title : 'Add';
            
        	return {                
                _id: utilityService.getValue(model, '_id'),
				employee_id: utilityService.getValue(model, 'employee_id'),
				is_payable_to_employee: utilityService.getValue(model, 'is_payable_to_employee', true),
				ctc_breakup: [],
				relieving_date: null,
				full_name: null,
				emp_code: null,
				payable_to_employee: {
					hold_amount: utilityService.getInnerValue(model, 'payable_to_employee', 'hold_amount', 0),
					adjustment_days: utilityService.getInnerValue(model, 'payable_to_employee', 'adjustment_days'),
					expense_advance_amount: utilityService.getInnerValue(model, 'payable_to_employee', 'expense_advance_amount', 0),
					expense_reimbrusment_amount: utilityService.getInnerValue(model, 'payable_to_employee', 'expense_reimbrusment_amount', 0),
					advance_amount: utilityService.getInnerValue(model, 'payable_to_employee', 'advance_amount', 0),
					is_severance_package: utilityService.getInnerValue(model, 'payable_to_employee', 'is_severance_package', true),
					severance_package: {
						severance_type: model ? utilityService.getInnerValue(model.payable_to_employee, 'severance_package', 'severance_type', "1") : "1",
						severance_fixed_amt: model ? utilityService.getInnerValue(model.payable_to_employee, 'severance_package', 'severance_fixed_amt') : null,
						days_type_2: model ? utilityService.getInnerValue(model.payable_to_employee, 'severance_package', 'severance_x_days_basic_salary') : null,
						days_type_3: model ? utilityService.getInnerValue(model.payable_to_employee, 'severance_package', 'severance_x_days_gross_salary') : null,
					},
				  	is_leave_incashable: utilityService.getInnerValue(model, 'payable_to_employee', 'is_leave_incashable', true),
				  	leave_incashable: [],
					other: utilityService.getInnerValue(model, 'payable_to_employee', 'other', this.buildDefaultOtherList()),
					is_gratuity_enabled: utilityService.getInnerValue(model, 'payable_to_employee', 'is_gratuity_enabled', false),
					gratuity: {
						amount: utilityService.getInnerValue(utilityService.getValue(model, 'payable_to_employee'), 'gratuity', 'amount'),
						tenure: utilityService.getInnerValue(utilityService.getValue(model, 'payable_to_employee'), 'gratuity', 'tenure'),
						payable_at: utilityService.getInnerValue(utilityService.getValue(model, 'payable_to_employee'), 'gratuity', 'payable_at', 1)
					},
					is_encashment_taxable: utilityService.getInnerValue(model, 'payable_to_employee', 'is_encashment_taxable', true),
					total_encashment_or_recovery_amt_as_per_setting: utilityService.getInnerValue(model, 'payable_to_employee', 'total_encashment_or_recovery_amt_as_per_setting', 0),
					hold_amount: utilityService.getInnerValue(model, 'payable_to_employee', 'hold_amount', 0),
					other_remark: utilityService.getInnerValue(model, 'payable_to_employee', 'other_remark', null)
			 	},
				is_payable_by_employee: utilityService.getValue(model, 'is_payable_by_employee', true),
				payable_by_employee: {
			  		is_notice_buyout_payment: utilityService.getInnerValue(model, 'payable_by_employee', 'is_notice_buyout_payment', true),
                    notice_buyout_package: {
                        notice_buyout_type: model ? utilityService.getInnerValue(model.payable_by_employee, 'notice_buyout_package', 'notice_buyout_type', "1") : "1",
                        notice_buyout_fixed_amt: model ? utilityService.getInnerValue(model.payable_by_employee, 'notice_buyout_package', 'notice_buyout_fixed_amt') : null,
                        days_type_2: model ? utilityService.getInnerValue(model.payable_by_employee, 'notice_buyout_package', 'notice_buyout_x_days_basic_salary') : null,
                        days_type_3: model ? utilityService.getInnerValue(model.payable_by_employee, 'notice_buyout_package', 'notice_buyout_x_days_gross_salary') : null
                    },
				  	other_damage_penalities: utilityService.getInnerValue(model, 'payable_by_employee', 'other_damage_penalities', []),
					other: utilityService.getInnerValue(model, 'payable_by_employee', 'other', this.buildDefaultOtherList()),
					is_leave_recoverable: utilityService.getInnerValue(model, 'payable_by_employee', 'is_leave_recoverable', true),
					leave_recovery: [],
					exit_clearances: [],
					other_remark: utilityService.getInnerValue(model, 'payable_by_employee', 'other_remark', null)
			 	},
                title: title			 	
			}
		};
		this.buildBulkObject = function () {
            return {
                fnf: {
                    isUploaded: false,
                    file: null
                }
            };
        };
		this.buildFnfStatusList = function () {
			return [{
				id: 1,
				title: 'Pending'
			},
			{
				id: 2,
				title: 'In Progress'
			},
			{
				id: 3,
				title: 'Done'
			}];
		};
		this.buildFnfStatusMappingObject = function () {
			return {
				1: 'Pending',
				2: 'In Progress',
				3: 'Done'
			};
		};
		this.buildActionStatusMappingObject = function () {
			return {
				1: 'Generated On',
				2: 'Re-Generated On',
				3: 'Stopped On'
			};
		};
        this.buildDefaultOtherList = function() {
            return [{
                title: null,
				amount: null,
				is_amount_taxable: false
            }]
        };
        this.extractFillableData = function(list, keyname, flag) {
            flag = angular.isDefined(flag) ? flag :  false;
        	var extractedList = [];

        	angular.forEach(list,  function(value, key) {
        		if(value[keyname]) {
                    if(flag && value.encashment_type != 1) {
                        delete value.fixed_amount;
                    }

        			extractedList.push(value);
        		}
        	});

        	return extractedList;
        };
        this.extractOtherFillableData = function(list, key1,  key2) {
        	var extractedList = [];

        	angular.forEach(list,  function(value, key) {
        		if(value[key1] && value[key2]) {
        			extractedList.push(value);
        		}
        	});

        	return extractedList;
        };
        this.buildFnfPayload = function(model, isDraft) {
        	var payload = {
        		employee_id: model.employee_id,
        		is_payable_to_employee: model.is_payable_to_employee,
				is_payable_by_employee: model.is_payable_by_employee,
				is_draft: isDraft
        	},
            toEmployee = model.payable_to_employee,
            byEmployee = model.payable_by_employee;

        	if(model.is_payable_to_employee) {
        		payload.payable_to_employee = {
        			other: this.extractOtherFillableData(toEmployee.other, 'title', 'amount'),
        			is_leave_incashable: toEmployee.is_leave_incashable,
					is_severance_package: toEmployee.is_severance_package,
					is_gratuity_enabled: utilityService.getValue(toEmployee, 'is_gratuity_enabled', false),
					hold_amount: utilityService.getValue(toEmployee, 'hold_amount'),
					expense_advance_amount: utilityService.getValue(toEmployee, 'expense_advance_amount'),
					expense_reimbrusment_amount: utilityService.getValue(toEmployee, 'expense_reimbrusment_amount'),
					advance_amount: utilityService.getValue(toEmployee, 'advance_amount'),
					adjustment_days: utilityService.getValue(toEmployee, 'adjustment_days'),
					is_encashment_taxable: utilityService.getInnerValue(model, 'payable_to_employee', 'is_encashment_taxable', true),
					total_encashment_or_recovery_amt_as_per_setting: utilityService.getInnerValue(model, 'payable_to_employee', 'total_encashment_or_recovery_amt_as_per_setting', 0),
					// total_encashment_or_recovery_overwrite_amt: utilityService.getInnerValue(model, 'payable_to_employee', 'total_encashment_or_recovery_overwrite_amt', null),
					other_remark: utilityService.getInnerValue(model, 'payable_to_employee', 'other_remark', null)
				};
				
        		if(toEmployee.is_leave_incashable) {
        			payload.payable_to_employee.leave_incashable = this.extractFillableData(toEmployee.leave_incashable, 'balance', true)
        		}

        		if(toEmployee.is_severance_package) {
        			payload.payable_to_employee.severance_package = {
        				severance_type: toEmployee.severance_package.severance_type
        			};

        			if(toEmployee.severance_package.severance_type == 1) {
        				payload.payable_to_employee.severance_package.severance_fixed_amt  = toEmployee.severance_package.severance_fixed_amt;
        			} else if(toEmployee.severance_package.severance_type == 2) {
        				payload.payable_to_employee.severance_package.severance_x_days_basic_salary = model.payable_to_employee.severance_package['days_type_' + toEmployee.severance_package.severance_type];
        			} else {
                        payload.payable_to_employee.severance_package.severance_x_days_gross_salary = model.payable_to_employee.severance_package['days_type_' + toEmployee.severance_package.severance_type];
                    }
				}
				
				if (utilityService.getValue(toEmployee, 'is_gratuity_enabled')) {
					payload.payable_to_employee.gratuity = {
						amount: utilityService.getInnerValue(toEmployee, 'gratuity', 'amount'),
						tenure: utilityService.getInnerValue(toEmployee, 'gratuity', 'tenure'),
						payable_at: utilityService.getInnerValue(toEmployee, 'gratuity', 'payable_at', 2)
					};
				}

				
        	}        	

        	if(model.is_payable_by_employee) {
        		payload.payable_by_employee = {
        			other_damage_penalities: this.extractOtherFillableData(byEmployee.other_damage_penalities, 'title', 'amount'),
        			other: this.extractOtherFillableData(byEmployee.other, 'title', 'amount'),
					is_notice_buyout_payment: byEmployee.is_notice_buyout_payment,
					other_remark: utilityService.getValue(byEmployee, 'other_remark', null)
					//is_leave_recoverable: utilityService.getValue(byEmployee, 'is_leave_recoverable', false),
				};
				
				// if(utilityService.getValue(byEmployee, 'is_leave_recoverable', false)) {
				// 	payload.payable_by_employee.leave_recovery = utilityService.getValue(byEmployee, 'leave_recovery', []);
        		// }

        		if(byEmployee.is_notice_buyout_payment) {
        			payload.payable_by_employee.notice_buyout_package = {
                        notice_buyout_type: byEmployee.notice_buyout_package.notice_buyout_type
                    };

                    if(byEmployee.notice_buyout_package.notice_buyout_type == 1) {
                        payload.payable_by_employee.notice_buyout_package.notice_buyout_fixed_amt  = byEmployee.notice_buyout_package.notice_buyout_fixed_amt;
                    } else if(byEmployee.notice_buyout_package.notice_buyout_type == 2) {
                        payload.payable_by_employee.notice_buyout_package.notice_buyout_x_days_basic_salary = model.payable_by_employee.notice_buyout_package['days_type_' + byEmployee.notice_buyout_package.notice_buyout_type];
                    } else {
                        payload.payable_by_employee.notice_buyout_package.notice_buyout_x_days_gross_salary = model.payable_by_employee.notice_buyout_package['days_type_' + byEmployee.notice_buyout_package.notice_buyout_type];
                    }
				}
				
				if (utilityService.getValue(byEmployee, 'exit_clearances', []).length) {
					payload.payable_by_employee.exit_clearances = utilityService.getValue(byEmployee, 'exit_clearances', []);
				}
        	}

        	return payload;
		};		
		this.buildFndFDetailsCSVData = function(list, mapping, actionStatusMapping) {
			var arr = new Array(["Employee Details", "Employee Code", "Relieving Date", 
					"Bank Account Number", "PAN Number", "FNF Status", "Personal Email", 
					"Link for Employee Documents", "Link History for Employee Documents ", "FNF Remark"]), 
                object = {
                    list: list,
                    content: arr
                };

            angular.forEach(object.list, function(value, key) {                
                var array = new Array();

                array.push(utilityService.getInnerValue(value, 'employee_preview', 'full_name'));
                array.push(utilityService.getValue(value, 'personal_profile_employee_code'));
				array.push(utilityService.getValue(value, 'system_plan_last_working_date'));				
				array.push(utilityService.getValue(value, 'financial_details_bank_account_number', 'N/A'));
				array.push(utilityService.getValue(value, 'financial_details_pan_card_number', 'N/A'));

				var actionType = mapping[utilityService.getValue(value, 'action_type')];
				if (utilityService.getValue(value, 'is_draft') === true) {
					actionType = actionType + ' - Draft';
				}
				array.push(actionType);
				
				array.push(utilityService.getValue(value, 'personal_email_id'));
				
				if (utilityService.getValue(value, 'action_status') && utilityService.getValue(value, 'token')) {
					var linkGenerationDate = ($filter('date')(new Date(value.generated_date * 1000), 'dd-MMM-yy'));
					array.push(self.domainApiUrl + '#/fnf-letters?token=' + value.token);
					array.push('Link ' + actionStatusMapping[value.action_status] + ':' + linkGenerationDate);
				} else {
					array.push('');
					array.push('');
				}

				if (utilityService.getValue(value, 'action_type') == 2 
					&& utilityService.getValue(value, 'is_draft') === false) {
					array.push('Pending (will be available on/before' + utilityService.getValue(value, 'initiate_date') + ')');
				} else {
					array.push('');
				}

                object.content.push(array);
            });

            return object;
		};
		this.getTotalPendingRequestCount = function (requests) {
			var count = 0;
			
			angular.forEach(requests, function (value, key) {
				count = count + parseInt(value, 10);
			});

			return count;
		};
		this.extractAllLeaves = function (data) {
            var leaves = {};

            angular.forEach(data, function (value, key) {
                leaves[value._id] = {};
				leaves[value._id].name = value.display_name;
            });
            
            return leaves;
		};
		this.extractAllAssets = function (data) {
            var assets = {};

            angular.forEach(data, function (value, key) {
                assets[value._id] = {};
				assets[value._id].name = value.provision_name;
            });
            
            return assets;
		};
		this.extractAllClearances = function (data) {
            var clearances = {};

            angular.forEach(data, function (value, key) {
				if (utilityService.getValue(value, 'status')) {
					clearances[value._id] = {};
					clearances[value._id].name = value.clearance_name;
				}                
            });
            
            return clearances;
		};
		this.buildDefaultHeaderColumns = function () {
			return ["Employee Details", "Employee Code", "Hold Amount", "Pending Advance Amount",
				"Pending Advance Expense Amount", "Unpaid Reimburesment Amount"];
		};
		this.buildLeavesHeaderColumns = function (headers, leaves) {
			angular.forEach(leaves, function (value, key) {
				headers.push(value.name + ' Balance');
				headers.push(value.name + ' Encashed/Recovery Balance');
				headers.push(value.name + ' Amount as per setting');
			});

			return headers;
		};
		this.buildAssetsHeaderColumns = function (headers, assets) {
			angular.forEach(assets, function (value, key) {
				headers.push('Asset ' + '(' + value.name + ')');
				headers.push(value.name + ' Amount');
			});

			return headers;
		};
		this.buildClearancesHeaderColumns = function (headers, clearances) {
			angular.forEach(clearances, function (value, key) {
				headers.push('No Dues ' + value.name + ' Amount');
			});

			return headers;
		};
		this.buildBulkFnfCSVColumnHeader = function (leaves, assets, clearances) {
			var headers = this.buildDefaultHeaderColumns();			
			
			headers = this.buildLeavesHeaderColumns(headers, leaves);
			headers = this.buildAssetsHeaderColumns(headers, assets);
			headers = this.buildClearancesHeaderColumns(headers, clearances);

			return headers;
		};
		this.buildBulkFnfDetailsCSVData = function(leaves, assets, clearances, list) {
			var arr = new Array(this.buildBulkFnfCSVColumnHeader(leaves, assets, clearances)), 
                object = {
                    list: list,
                    content: arr
                };

            angular.forEach(object.list, function(value, key) {                
				var array = new Array(),
					fullName = utilityService.getInnerValue(value, 'employee_preview', 'personal_profile_first_name');
					
				if (utilityService.getInnerValue(value, 'employee_preview', '2')) {
					fullName = fullName + ' ' + utilityService.getInnerValue(value, 'employee_preview', '2');
				}

				if (utilityService.getInnerValue(value, 'employee_preview', 'personal_profile_last_name')) {
					fullName = fullName + ' ' + utilityService.getInnerValue(value, 'employee_preview', 'personal_profile_last_name');
				}
				
                array.push(fullName);
                array.push(utilityService.getInnerValue(value, 'employee_preview', 'personal_profile_employee_code'));				
				array.push(utilityService.getValue(value, 'hold_amount'));
				array.push(utilityService.getValue(value, 'advance_amount'));
				array.push(utilityService.getValue(value, 'expense_advance_amount'));
				array.push(utilityService.getValue(value, 'expense_reimbrusment_amount'));

				/***** Start: Parsing Leave Related Data *****/
				var leaveDetailsObject = {};
				angular.forEach(utilityService.getValue(value, 'leave_details', []), function(v, k) {
					var leaveId = angular.isObject(v._id) ? v._id.$id : v._id;
					leaveDetailsObject[leaveId] = {};
					leaveDetailsObject[leaveId].balance = utilityService.getValue(v, 'actual_balance');
					leaveDetailsObject[leaveId].actual_balance = utilityService.getValue(v, 'balance');
					leaveDetailsObject[leaveId].amount_based_on_setup = utilityService.getValue(v, 'amount_based_on_setup');
					leaveDetailsObject[leaveId].amount_overwrite = utilityService.getValue(v, 'amount_overwrite');
					leaveDetailsObject[leaveId].overwite_balance = utilityService.getValue(v, 'overwite_balance');
				});

				angular.forEach(leaves, function (v, k) {
					array.push(utilityService.getInnerValue(leaveDetailsObject, k, 'balance'));
					array.push(utilityService.getInnerValue(leaveDetailsObject, k, 'actual_balance'));
					array.push(utilityService.getInnerValue(leaveDetailsObject, k, 'overwite_balance'));
					array.push(utilityService.getInnerValue(leaveDetailsObject, k, 'amount_based_on_setup'));					
				});
				/***** End: Parsing Leave Related Data *****/

				/***** Start: Parsing Asset Related Data *****/
				var assetDetailsObject = {};
				angular.forEach(utilityService.getValue(value, 'other_damage_penalties', []), function(v, k) {
					assetDetailsObject[v.setting_id] = {};
					assetDetailsObject[v.setting_id].title = utilityService.getValue(v, 'title');
					assetDetailsObject[v.setting_id].amount = utilityService.getValue(v, 'amount');
				});

				angular.forEach(assets, function (v, k) {
					array.push(utilityService.getInnerValue(assetDetailsObject, k, 'title'));
					array.push(utilityService.getInnerValue(assetDetailsObject, k, 'amount'));				
				});
				/***** End: Parsing Asset Related Data *****/

				/***** Start: Parsing No Dues Related Data *****/
				var clearanceDetailsObject = {};
				angular.forEach(utilityService.getValue(value, 'exit_clearances', []), function(v, k) {
					var clearanceId = angular.isObject(v._id) ? v._id.$id : v._id;
					clearanceDetailsObject[clearanceId] = {};
					clearanceDetailsObject[clearanceId].name = utilityService.getValue(v, 'clearance_name');
					clearanceDetailsObject[clearanceId].amount_due = utilityService.getValue(v, 'amount_due');
				});

				angular.forEach(clearances, function (v, k) {
					array.push(utilityService.getInnerValue(clearanceDetailsObject, k, 'amount_due'));
				});
				/***** End: Parsing No Dues Related Data *****/

                object.content.push(array);
            });

            return object;
		};
		this.convertLeaveListToObject = function (list) {
			var object = {};

			angular.forEach(list, function(value, key) {
                object[value.plan_id] = {};                    
                object[value.plan_id].name = utilityService.getValue(value, 'name');
                object[value.plan_id].balance = utilityService.getValue(value, 'balance');
                object[value.plan_id].actual_balance = utilityService.getValue(value, 'actual_balance');
                object[value.plan_id].overwite_balance = utilityService.getValue(value, 'overwite_balance');
                object[value.plan_id].amount_based_on_setup = utilityService.getValue(value, 'amount_based_on_setup');
                object[value.plan_id].amount_overwrite = utilityService.getValue(value, 'amount_overwrite');
			});
			
			return object;
		};
		this.convertAssetListToObject = function (list) {
			var object = {};

			angular.forEach(list, function(value, key) {
                object[value.provision_id] = {};
                object[value.provision_id].amount = value.amount;
			});
			
			return object;
		};
		this.convertExitClearanceListToObject = function (list) {
			var object = {};

			angular.forEach(list, function(value, key) {
                object[value.clearance_id] = {};                    
                object[value.clearance_id].clearance_name = utilityService.getValue(value, 'clearance_name');
                object[value.clearance_id].amount_due = utilityService.getValue(value, 'amount_due');
                object[value.clearance_id].amount_overwrite = utilityService.getValue(value, 'amount_overwrite');
                object[value.clearance_id].overwite_balance = utilityService.getValue(value, 'overwite_balance');
			});
			
			return object;
		};
		this.convertLeaveRecoveryListToObject = function (list) {
			var object = {};

			angular.forEach(list, function(value, key) {
                object[value.plan_id] = {};                    
                object[value.plan_id].name = utilityService.getValue(value, 'name');
                object[value.plan_id].leave_recovery_balance = utilityService.getValue(value, 'leave_recovery_balance');
                object[value.plan_id].leave_recovery_amount = utilityService.getValue(value, 'leave_recovery_amount');
			});
			
			return object;
		};
		this.extractSelectedEmployeeIds = function (list) {
			var employeeIds = [];

			angular.forEach(list, function(value, key) {
				if (utilityService.getValue(value, 'isChecked')) {
					employeeIds.push(utilityService.getInnerValue(value, 'employee_preview', '_id'));
				}
			});

			return employeeIds;
		};
		this.buildPrepareBulkInitiatePayload = function (list) {
			return {
				emp_ids: this.extractSelectedEmployeeIds(list)
			}
		};
		this.buildBulkInitiatePayload = function (list) {
			var payload = {
				bulk_fnf: []
			};

			angular.forEach(list, function (value, key) {
                payload.bulk_fnf.push(self.buildFnfPayload(value, true));
			});
			
			return payload;
		};
								
		return this;
	}
]);