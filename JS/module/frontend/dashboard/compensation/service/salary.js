app.service('SalaryService', [
	'$timeout', 'utilityService', 'FORM_BUILDER',       
	function ($timeout, utilityService, FORM_BUILDER) {
		'use strict';
		var self = this;
		this.envMnt = null;
		this.allowedDomains = ['local', 'prod3', 'myhr', 'ess', 'hronline', 'shriramggn', 'mempl', 'mis', 'edusch'];

        this.url = {
        	salary: 'employee-salary/salary-detail',    	  	
    	   	slip: 'employee/slips/settings',
    	   	benefitsOptions: 'employee/benefits-options',
    	   	benefits: 'employee/benefits',
    	   	expenses: 'employee/claims-category',
    	   	claim: 'employee/claims',
    	   	preview: 'employee-salary/current-salary-breakup',
    	   	claimApprover: 'employee/claims-approvers',
            expenseCatergory: 'expense/frontend/policy-expense-categories',
            claimAmount: 'employee/claim-details',
            allExpense: 'expense/frontend/all-expense-categories',
			slipStatus: 'employee/slip-status',
			getFlexiForm: 'payroll/employee/get-flexi-form',
			fillFlexiForm: 'payroll/employee/flexi/fill-form',
			downloadAnswerAttachment: 'payroll/download/flexi-form-attachment',
			claimProof: 'employee/claim-proof',
			claimSetting: 'employee/claim-setting',
			eligibility: 'employee/claim/details',
			claimSummary: 'employee/claim-summary',
			claimSummaryMonthwise: 'employee/claim-monthly-summary'
        };        
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };	    
	    this.buildMonthObject = function() {
	    	return {
    			1: "Jan",
    			2: "Feb",
    			3: "Mar",
    			4: "Apr",
    			5: "May",
    			6: "Jun",
    			7: "July",
    			8: "Aug",
    			9: "Sep",
    			10: "Oct",
    			11: "Nov",
    			12: "Dec"
    		}
	    };	    	 
	    this.buildSalaryObject = function(model) {
	    	var year = utilityService.getValue(model, 'year', (new Date().getFullYear() - 1));
	    	return {
    			fromYear: year,
    			toYear: new Date().getFullYear(),
    			yearList: utilityService.getYearList(year),
    			reverse: false,
            	propertyName: 'year',
    			visible: false,
    			details: utilityService.getValue(model, 'details', []),
    			cpdetails: [],
    			graph: [],
    			categories: [],
    			ctcBreakup: [],
    			start: {
    				month: null,
    				year: null
    			},
    			end: {
    				month: null,
    				year: null
    			}
    		}
	    };
	    this.buildSlipObject = function(model) {
	    	return {
    			type: 1,
    			download: false,
    			yearList: utilityService.getYearList(utilityService.startYear),
    			currentYear: utilityService.getCurrentYear(),
    			monthList: utilityService.buildMonthList(),
    			currentMonth: utilityService.startMonth,
    			typeList: [{id: 1, name: "Salary Slip"}, {id: 3, name: "Reimbursement Slip"}],
    			enable: false,
    			message: null
    		}
	    };
	    this.buildBenefitObject = function(model) {
	    	return {
				breakup: [],
				constant: {
					pf: 1,
					vpf: 2,
					esi: 3,
					flexi: 4
				},
				comment: {
					text: null
				},
	    		optout: {
	    			isSubmitted: utilityService.getInnerValue(model, 'opt_out', 'emp_data_submitted'),
					status: utilityService.getInnerValue(model, 'opt_out', 'status'),
					approver_chain: utilityService.getInnerValue(model, 'opt_out', 'approver_chain', []),
					approverChain: [],
					isDisabled: false,
					reason: utilityService.getInnerValue(model, 'opt_out', 'can_edit_reason'),
					can_edit_existing: utilityService.getInnerValue(model, 'opt_out', 'can_edit_existing', true)
	    		},
	    		vpf: {
	    			isSubmitted: utilityService.getInnerValue(model, 'vpf', 'emp_data_submitted'),
					status: utilityService.getInnerValue(model, 'vpf', 'status'),
					approver_chain: utilityService.getInnerValue(model, 'vpf', 'approver_chain', []),
					approverChain: [],
					basic: utilityService.getInnerValue(model, 'vpf', 'basic_applicable'),
					isDisabled: false,
					reason: utilityService.getInnerValue(model, 'vpf', 'can_edit_reason'),
					can_edit_existing: utilityService.getInnerValue(model, 'vpf', 'can_edit_existing', true)
	    		},	    		
				pf: {
					enable: utilityService.getValue(model, 'enable_pf_contribution', false),
					isOptOut: utilityService.getValue(model, 'allow_pf_opt_out', true),
					isOptOutEmp: utilityService.getValue(model, 'emp_allow_pf_opt_out'),

					isVPFContribute: utilityService.getValue(model, 'vpf_contribution', true),
					isVPFContributeEmp: utilityService.getValue(model, 'emp_vpf_contribution'),
					vpfContribution: utilityService.getValue(model, 'vpf_max_limit'),
					vpfContributionEmp: utilityService.getValue(model, 'emp_vpf_max_limit')				
				},
				esi: {
					enable: utilityService.getValue(model, 'enable_esi_contribution', false),
					isContinue: utilityService.getValue(model, 'allow_esi_to_continue', true),
					isContinueEmp: utilityService.getValue(model, 'emp_allow_esi_to_continue'),
					isDisabled: false,
					reason: utilityService.getInnerValue(model, 'esi', 'can_edit_reason'),
					can_edit_existing: utilityService.getInnerValue(model, 'esi', 'can_edit_existing', true)
				},
				flexi: {
					lastDate: utilityService.getInnerValue(model, 'flexi_pay', 'last_date'),
					isFlexiPay: utilityService.getInnerValue(model, 'flexi_pay', 'is_flexi_pay'),
					totalMax: utilityService.getInnerValue(model, 'flexi_pay', 'max_allocated_amt'),
					totalSum: 0,
					list: utilityService.getInnerValue(model, 'flexi_pay', 'components', []),
					isSubmitted: utilityService.getInnerValue(model, 'flexi_pay', 'emp_data_submitted'),
					status: utilityService.getInnerValue(model, 'flexi_pay', 'status'),
					approver_chain: utilityService.getInnerValue(model, 'flexi_pay', 'approver_chain', []),
					request_id: utilityService.getInnerValue(model, 'flexi_pay', 'request_id'),
					approverChain: [],
					mandatoryComponents: utilityService.getInnerValue(model, 'flexi_pay', 'mandatory_components'),
					hashmap: {
                        vehicle_allowance: {
                        	message: "INR 1800 per month up to Car engine 1600 CC. INR 2400 per month above 1600 CC Driver Exemption 900"
                        },
                        chauffer_allowance: {
                        	message: "INR 900 per month	above Vehicle Allowance"
                        }
					},
					isDisabled: false,
					reason: utilityService.getInnerValue(model, 'flexi_pay', 'can_edit_reason'),
					can_edit_existing: utilityService.getInnerValue(model, 'flexi_pay', 'can_edit_existing', true),
					effectiveFrom: utilityService.getInnerValue(model, 'flexi_pay', 'effective_from'),
					effectiveDate: utilityService.getInnerValue(model, 'flexi_pay', 'effective_date'),
					can_change: utilityService.getInnerValue(model, 'flexi_pay', 'can_change'),

				}
			}
	    };
	    this.buildGraphObject = function(data, keyName, fromYear, toYear) {
	    	var categories = [],
	    		graph = [],
	    		keyName = angular.isDefined(keyName) ? keyName : 'ctc',
	    		fromYear = angular.isDefined(fromYear) ? fromYear : null,
	    		toYear = angular.isDefined(toYear) ? toYear : null,
	    		monthObject = this.buildMonthObject();

	    	angular.forEach(data, function(value, key) {
	    		if(fromYear && toYear) {
	    			if(value.year >= fromYear && value.year <= toYear) {
			    		categories.push(monthObject[value.month] + ' ' + value.year);
			    		graph.push(value[keyName]);
		    		}
	    		} else {
		    		categories.push(monthObject[value.month] + ' ' + value.year);
		    		graph.push(value[keyName]);
	    		}	    		
	    	});

	    	return {
	    		categories: categories,
	    		graph: graph
	    	};
	    };
	    this.buildBenefitPayload = function(model) {
	    	return {
	    		enable_pf_contribution: model.pf.enable,
			    allow_pf_opt_out: model.pf.enable,
			    pf_optout_max_basic_salary: model.pf.enable,
			    vpf_contribution: model.pf.enable,
			    vpf_max_limit: model.pf.enable,
			    enable_esi_contribution: model.pf.enable,
			    allow_esi_to_continue: model.pf.enable,
			    flexi_pay: model.flexi.compenentList
	    	}
	    };
	    this.buildClaimModel = function(data, model) {
	    	return {
    			_id : utilityService.getValue(model, 'enable_pf_contribution'),
				expense_category : utilityService.getValue(model, 'enable_pf_contribution'),
				bill_date : this.allowedDomains.indexOf(this.envMnt) >= 0 ? new Date() : null,
				bill_no : utilityService.getValue(model, 'enable_pf_contribution'),
				bill_amount : utilityService.getValue(model, 'enable_pf_contribution'),
				claim_amount : utilityService.getValue(model, 'enable_pf_contribution'),
				bill_detail : utilityService.getValue(model, 'enable_pf_contribution'),
				proof: utilityService.getValue(model, 'enable_pf_contribution'),
				declare_status : utilityService.getValue(model, 'declare_status',true),
				approver_chain : utilityService.getValue(data, 'approver_chain', []),
				herebyDeclare: false
    		}
		};
		this.buildClaimSummaryObject = function () {
			return {
				list: [],
				visible: false,
				filteredList: [],
				propertyName: '',
				reverse: false,
				search: '',
				year: '',
				month: ''
			};
		};
	    this.buildClaimObject = function() {
	    	return {
	    		expenses: [],
	    		list: [],
	    		model: this.buildClaimModel(),
	    		propertyName: 'expense_name',
	    		reverse: false,
	    		visible: false,
	    		search: '',
                amountDetails: null,
                error: {
                    status: false,
                    message: null
                },
				isEligible: false,
				proofs: [],
				filteredList: [],
				comment: {
					text: null
				},
				billDetails: null,
				timeline: {
					isOpen: false,
					fromDay: null,
					toDay: null,
					fromDayString: null,
					toDayString: null,
					error: {
						status: false,
						message: null
					},
					visible: false
				},
				reason: null,
				type: null,
				typeList: [
					{
						title: "All Status",
						status: ''
					},
					{
						title: "Pending",
						status: 1
					},
					{
						title: "Rejected",
						status: 2
					},
					{
						title: "Approved",
						status: 3
					}
				],
				month: '',
				isRaiseNext: false,
				year: '',
				summary: this.buildClaimSummaryObject(),
				tabname: 'summary'
	    	}
	    };
	    this.buildMyPayObject = function() {
	    	return  {
	            months: this.buildMonthObject(),
	            salary: this.buildSalaryObject(),
	            slip: null,
	            benefit: null,
	            claim: this.buildClaimObject(),
                expenseCatList: [],
				selectedClaimType: 101,
				yearList: utilityService.getYearList(utilityService.startYear),
				tax_regime: null
	        }
		};
		this.buildPFPayload = function (model) {
			var payload = {
    			enable_pf_contribution: model.pf.enable
    		};

	    	if(model.pf.enable)  {
	    		payload.allow_pf_opt_out = model.pf.isOptOut;
	    		payload.emp_allow_pf_opt_out = model.pf.isOptOutEmp;	    		
	    	}

	    	return payload;
		};
		this.buildVPFPayload = function (model) {
			var payload = {
    			enable_pf_contribution: model.pf.enable
    		};

	    	if(model.pf.enable)  {
	    		payload.vpf_contribution = model.pf.isVPFContribute;
	    		payload.emp_vpf_contribution = model.pf.isVPFContributeEmp;
	    		if(model.pf.vpfContributionEmp) {
	    			payload.emp_vpf_max_limit = model.pf.vpfContributionEmp;
	    		}
	    	}

	    	return payload;
		};
		this.buildESIPayload = function(model) {
    		var payload = {
    			enable_esi_contribution: model.esi.enable
    		};

	    	if(model.esi.enable) {
	    		payload.allow_esi_to_continue = model.esi.isContinue;
	    		payload.emp_allow_esi_to_continue = model.esi.isContinueEmp;
	    	}

	    	return payload;
		};
	    this.buildFlexiPayPayload = function(list) {
			var flexiPay = [];
			
	    	angular.forEach(list, function(value, key) {
                //if (value.amount && value.amount > 0 ) {
                    flexiPay.push({component_slug: value.slug, amount: parseInt(value.amount, 10)});
                //}
			});
			
	    	return flexiPay;
		};		
		this.buildFlexiComponentPayload = function(model) {
    		var payload = {
    			is_flexi_pay: model.flexi.isFlexiPay
    		};

	    	if(payload.is_flexi_pay) {
				payload.flexi_pay = this.buildFlexiPayPayload(model.flexi.list);
            }

	    	return payload;
		};
		// Earlier PF, ESI & Flexi Pay payload was clubbed
	    /* this.buildBenefitsPayload = function(model) {
    		var payload = {
    			enable_pf_contribution: model.pf.enable,
    			enable_esi_contribution: model.esi.enable,
    			is_flexi_pay: model.flexi.isFlexiPay,
    			emp_pf_optout_submitted: model.optout.isSubmitted,
    			emp_vpf_submitted: model.vpf.isSubmitted
    		};

	    	if(model.pf.enable)  {
	    		payload.allow_pf_opt_out = model.pf.isOptOut;
	    		payload.emp_allow_pf_opt_out = model.pf.isOptOutEmp;

	    		payload.vpf_contribution = model.pf.isVPFContribute;
	    		payload.emp_vpf_contribution = model.pf.isVPFContributeEmp;
	    		if(model.pf.vpfContributionEmp) {
	    			payload.emp_vpf_max_limit = model.pf.vpfContributionEmp;
	    		}
	    	}

	    	if(model.esi.enable) {
	    		payload.allow_esi_to_continue = model.esi.isContinue;
	    		payload.emp_allow_esi_to_continue = model.esi.isContinueEmp;
	    	}

	    	if(payload.is_flexi_pay) {
                var flexiPay = model.flexi.isSubmitted ? [] : this.buildFlexiPayPayload(model.flexi.list);
                    payload.flexi_pay = flexiPay;
	    	}

	    	return payload;
		}; */
	    this.buildClaimPayload = function(claim) {
	    	var payload = {
                expense_category: claim.model.expense_category,
                bill_date: utilityService.dateToString(claim.model.bill_date),
                bill_no: claim.model.bill_no,
                bill_amount: claim.model.bill_amount,
                claim_amount: claim.model.claim_amount,
				bill_detail: claim.model.bill_detail,
				declare_status: utilityService.getInnerValue(claim, 'model', 'herebyDeclare')
			};

			angular.forEach(claim.proofs, function (value, key) {
				payload[value.slug] = value.proof;
			});
			
			return payload;
	    };
	    this.durationListCallback = function(data, salary) {
            salary.yearList = data.data;                    
            salary.fromYear = data.data[0].year;
            salary.toYear = data.data[data.data.length - 1].year;
            salary.start.month = data.data[0].month;
            salary.start.year = data.data[0].year;
            salary.end.month = data.data[data.data.length - 1].month;
            salary.end.year = data.data[data.data.length - 1].year;
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
        this.convertTimeToStringFormat = function(time) {
            if(!time) {return time;}
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
		this.buildCsvData = function(list, approvalStatus) {
			var csv = {
				content: new Array(["Category Name", 
					self.allowedDomains.indexOf(self.envMnt) >= 0 ? "No. of Voucher(s)" : "Bill No.", "Bill Amount", 
					"Claim Amount", "Approved Amount", "Requsted On", "Period", 
					"Details", "Approval Status"])
			};

			angular.forEach(list, function(value, key) {
				var array = new Array(),
					statusText = approvalStatus[utilityService.getValue(value, 'status', 1)];

				if (utilityService.getValue(value, 'status') == 8) {
					statusText = statusText + ' (Approved by Admin)';
				} else if (utilityService.getValue(value, 'status') == 9) {
					statusText = statusText + ' (Rejected by Admin)';
				}

				array.push(utilityService.getValue(value, 'expense_category_name'));
				array.push(utilityService.getValue(value, 'bill_no'));
				array.push(utilityService.getValue(value, 'bill_amount'));
				array.push(utilityService.getValue(value, 'claim_amount'));				
				array.push(utilityService.getValue(value, 'approved_amount'));
				array.push(utilityService.getValue(value, 'claim_date'));
				array.push(utilityService.getValue(value, 'bill_date'));
				array.push(utilityService.getValue(value, 'bill_detail'));
				array.push(statusText);
				
				csv.content.push(array);
			});

			return csv;
		};
		this.getRecentUnClaimedAmount = function (amountDetails) {
            var amount = 0;

            angular.forEach(amountDetails, function (value, key) {
                amount = utilityService.getValue(value, 'unclaimed', 0);
            });

            return amount;
		};
		this.isClaimWindowOpen = function (timeline) {
			var currentDay = utilityService.getCurrentDate();
			
			if (timeline.fromDay < timeline.toDay) {
				return currentDay >= timeline.fromDay && currentDay <= timeline.toDay;
			} else {
				return currentDay <= timeline.toDay;
			}			
		};
		this.buildClaimSummaryCsvData = function(list, tabname) {
			var headers = ["Category Name", "Eligibility", "Unclaimed", "Claimed", "Pending", 
				"Paid", "Approved", "Balance", "Carry Over (Last Month)", "Carry Over (Next Month)"];
			
			if (tabname === 'summary-monthwise') {
				headers.unshift("Month");
			}

			var csv = {
				content: new Array(headers)
			};		

			angular.forEach(list, function(value, key) {
				var array = new Array();

				if (tabname === 'summary-monthwise') {
					var strMonth = utilityService.getValue(value, 'month_text') + '-' + utilityService.getValue(value, 'year');
					array.push(strMonth);
				}

				array.push(utilityService.getValue(value, 'component_name'));
				array.push(utilityService.getValue(value, 'eligibility'));
				array.push(utilityService.getValue(value, 'unclaimed'));
				array.push(utilityService.getValue(value, 'claimed'));
				array.push(utilityService.getValue(value, 'pending'));
				array.push(utilityService.getValue(value, 'paid'));
				array.push(utilityService.getValue(value, 'approved'));	
				array.push(utilityService.getValue(value, 'balance'));	
				array.push(utilityService.getValue(value, 'co_last_month'));	
				array.push(utilityService.getValue(value, 'co_next_month'));	
				
				csv.content.push(array);
			});

			return csv;
		};

	    return this;
	}
]);