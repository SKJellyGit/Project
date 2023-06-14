app.service('TaxService', [
    'utilityService',

    function (utilityService) {
	    'use strict';
        var self = this;
        
        this.hraDetails = {
            status : 1,
            approved_amount: 0,
            reason: null
        };
	    this.url = {
			taxMaster: 'manage_tax',
			claimtax: 'employee/tax/claim',
			billDetail: 'employee/tax/claim/detail',
			rentDetail: 'employee/tax/claim/rentInfo',
			landlord: 'employee/tax/claim/landlord',
			guideline: 'employee/investment-guideline',
			otherIncome: 'employee/other-income/detail',
			taxComputation: 'data/compensation/tax-computation.json',
            viewDownloadFile: 'employee/tax/computation',
            slipStatus: 'employee/tax-slip-status',
            landlordDetails: 'employee/landlord-details',
            deleteHRADetails: 'employee/rent-detail',
            amountDeclared: 'employee/declare-investment',
            investmentHead: 'employee/claim-investment',
            taxRegime: 'employee/tax-regime',
            calculateEstimatedTax: 'employee/calculate-estimated-tax',
            downloadEstimatedTax: 'employee/download-calculate-estimated-tax',

            // Admin Section APIs
            adminClaimtax: 'payroll/tax/claim', // GET API
            adminInvestmentHead: 'payroll/claim-investment', // POST for create, POST for update, DELETE
            adminRentDetail: 'payroll/tax/claim/rentInfo', // POST for create, POST for update
            adminDeleteHRADetails: 'payroll/rent-detail', // DELETE for HRA
            taxRegimePayroll: 'payroll/tax-regime'
		};
		this.getUrl = function(apiUrl) {
			return getAPIPath() + this.url[apiUrl];
		};
		this.buildManageTaxStatusObject = function() {
			return {
				1: "Pending", 
				2: "Approved", 
				3: "Rejected"
			}
		};
		this.buildRelationList = function() {
			return [{ id: 1, name: "Self" },
				{ id: 2, name: "Spouse" },
				{ id: 3, name: "Mother" },
				{ id: 4, name: "Father" },
				{ id: 5, name: "Son" },
				{ id: 6, name: "Daughter" }]
		};
		this.syncRentDetailModel = function(model, guideLine) {
			return {
                _id: utilityService.getValue(model, '_id') && angular.isObject(model, '_id') 
                    ? model._id.$id: utilityService.getValue(model, '_id'),
				tax_id: utilityService.getValue(model, 'tax_id'),
				sec_no: utilityService.getValue(model, 'sec_no'),
				title: utilityService.getValue(model, 'title'),
				from_date: utilityService.getDefaultDate(utilityService.getValue(model, 'from_date'), false, true),
				end_date: utilityService.getDefaultDate(utilityService.getValue(model, 'end_date'), false, true),
				amount: utilityService.getValue(model, 'amount'),
				name: utilityService.getValue(model, 'name'),
				address: utilityService.getValue(model, 'address'),
				pincode: utilityService.getValue(model, 'pincode'),
				city: utilityService.getValue(model, 'city'),
				proof_name: utilityService.getValue(model, 'proof_name'),
				document_type: utilityService.getValue(model, 'document_type', 1),
				pan_number: utilityService.getValue(model, 'pan_number'),
                list: utilityService.getValue(model, 'list', []),
                is_metro: utilityService.getValue(model, 'is_metro', false),
                datepicker_min_date: new Date('04/01/' + guideLine.year),
                datepicker_from_max_date: new Date('03/31/' + (parseInt(guideLine.year, 10) + 1)),
                datepicker_to_max_date: new Date('03/31/' + (parseInt(guideLine.year, 10) + 1)),
                pan_no: utilityService.getValue(model, 'pan_no'),
                landlord_name: utilityService.getValue(model, 'landlord_name'),
                landlord_address: utilityService.getValue(model, 'landlord_address'),
                landlord_pan: utilityService.getValue(model, 'landlord_pan'),
                landlord_pincode: utilityService.getValue(model, 'landlord_pincode'),
                landlord_city: utilityService.getValue(model, 'landlord_city'),
                landlord_proof_name: utilityService.getValue(model, 'landlord_proof_name'),
                landlord_id: utilityService.getValue(model, 'landlord_id'),
                delete_rent_receipt: utilityService.getValue(model, 'delete_rent_receipt', false),
                delete_pan_card: utilityService.getValue(model, 'delete_pan_card', false),
                fileError: {
                    rent_receipt: null,
                    pan_card: null
                }
			}
		};
		this.buildNewBillObject = function() {
			return {
				billNo: null, 
				name: null, 
				billDate: null,
				billAccount: null, 
				relation : 2, 
				isDisabled: false, 
				isNew: true
			}
        };
        this.buildInvestmentPayload = function(item) {
        	var payload = {},
        		investments = [];

            angular.forEach(item, function(value, key) {
               // if(value.amount_declared) {
                var payloadRow = { 
                    tax_id: value.id, 
                    amount_declared: value.amount_declared ? value.amount_declared : 0,
                    amount_claimed: value.amount_claimed ? value.amount_claimed : 0,
                    proof: value.proof,
                    remove_proof: utilityService.getValue(value, 'remove_proof', false)
                };
                if(value.amount_default) {
                    payloadRow.amount_declared = parseFloat(payloadRow.amount_declared) + parseFloat(value.amount_default);
                    // payloadRow.amount_claimed = parseFloat(payloadRow.amount_claimed) + parseFloat(value.amount_default);
                }
                investments.push(payloadRow);
               // }                
            });

            payload.tax_details = investments;
            return payload;
        };
        this.buildRentDetailPayload = function(model, rentReceipt, panCard) {
        	var payload = {
	        	address: utilityService.getValue(model, 'address', ''),
	        	from_date: utilityService.dateFormatConvertion(model.from_date),
	        	end_date: utilityService.dateFormatConvertion(model.end_date),
	        	city: utilityService.getValue(model, 'city', ''),
	        	pincode: utilityService.getValue(model, 'pincode', ''),
                amount: utilityService.getValue(model, 'amount', ''),
                is_metro: utilityService.getValue(model, 'is_metro', false),                
                landlord_name: utilityService.getValue(model, 'landlord_name', ''),
                landlord_address: utilityService.getValue(model, 'landlord_address', ''),
                landlord_city: utilityService.getValue(model, 'landlord_city', ''),
                landlord_pincode: utilityService.getValue(model, 'landlord_pincode', ''),
                landlord_pan: utilityService.getValue(model, 'landlord_pan', '')
            };

            if (utilityService.getValue(model, 'landlord_id')) {
                payload.landlord = model.landlord_id;
            }
            
            if (rentReceipt && angular.isObject(rentReceipt)) {
                payload.rent_receipt = rentReceipt;
            }

            if (panCard && angular.isObject(panCard)) {
                payload.pan_card = panCard;
            }

            if (utilityService.getValue(model, 'delete_rent_receipt')) {
                payload.delete_rent_receipt = model.delete_rent_receipt;
            }

            if (utilityService.getValue(model, 'delete_pan_card')) {
                payload.delete_pan_card = model.delete_pan_card;
            }

            return payload;
		};
		this.buildLandlordDetailPayload = function(model, file) {
        	var payload = {
	        	address: model.address,
	        	from_date: utilityService.dateFormatConvertion(model.from_date),
	        	end_date: utilityService.dateFormatConvertion(model.end_date),
	        	city: model.city,
	        	pincode: model.pincode,
	        	name: model.name,
	        	document_type: model.document_type
	       	};
	       	if(model.document_type == 1) {
	       		payload.pan_no = model.pan_no;
            }
               
            if (file && angular.isObject(file)) {
                payload.file = file;
            }

	       	return payload;	       	     	
		};
        this.isWindowOpen = function(object) {
            var startTimestamp = new Date(utilityService.changeDateFormat(object.nextOpenDate) + " 00:00:00").getTime(),
                endTimestamp = new Date(utilityService.changeDateFormat(object.nextCloseDate) + " 11:59:59").getTime(),
                d = new Date(),
                dd = d.getDate(),
                mm = d.getMonth() + 1,
                yyyy = d.getFullYear(),
                dateString = mm + "/" + dd + "/" + yyyy + " 00:00:00",
                currentTimestamp = new Date(dateString).getTime();

            return currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp;
        };
        this.getMonthLastDay = function(year, month) {
            return new Date(year, month, 0).getDate();
        };
        this.madeCorrectionInDate = function(strDate) {
            if (!strDate) {
                return strDate;
            }

            var delimeter = strDate.indexOf('-') ? '-' : '/',
                arrDate = strDate.split(delimeter),
                lastDay = this.getMonthLastDay(arrDate[2], arrDate[1]);

            if (arrDate[0] > lastDay) {
                arrDate[0] = lastDay;
                strDate = arrDate[0] + delimeter + arrDate[1] + delimeter + arrDate[2];
            }

            return strDate;            
        };
		this.buildGuideLineObject = function(model, selectedYear, yearList) {
            var currMonth = utilityService.getCurrentMonth(),
                currYear = utilityService.getCurrentYear(),
                year = selectedYear ? selectedYear : (currMonth >= utilityService.startMonth ? currYear : currYear - 1),
                object = {
                    currYear: currMonth >= utilityService.startMonth ? currYear : currYear - 1,
                    year: year,
                    yearList: yearList.length ? yearList : utilityService.getFinancialYearList(utilityService.startYear, year),
    	            declaration: {
    	                enable: utilityService.getValue(model, 'investment_declaration_enable', false),
    	                deadline: utilityService.getValue(model, 'investment_declaration_date'),
    	                nextOpenDate: this.madeCorrectionInDate(utilityService.getValue(model, 'investment_open_window_date')),
                        nextCloseDate: this.madeCorrectionInDate(utilityService.getValue(model, 'investment_close_window_date'))
    	            },
    	            proof: {
    	                enable: utilityService.getValue(model, 'proof_submission_enable', false),
    	                deadline: utilityService.getValue(model, 'proof_submission_date'),
    	                nextOpenDate: this.madeCorrectionInDate(utilityService.getValue(model, 'proof_submission_open_window_date')),
                        nextCloseDate: this.madeCorrectionInDate(utilityService.getValue(model, 'proof_submission_close_window_date'))
    	            }
    	        },
                isDeclarationOpen = this.isWindowOpen(object.declaration),
                isSubmissionOpen = this.isWindowOpen(object.proof);

            object.declaration.enable = object.declaration.enable && isDeclarationOpen;            
            object.proof.enable = object.proof.enable && isSubmissionOpen;

            return object;
		};
		this.setKey = function(investmentObject, item, key, defaultValue) {
            defaultValue = angular.isDefined(defaultValue) ? defaultValue : null;
            item[key] = angular.isDefined(investmentObject[item.id]) 
                ? investmentObject[item.id][key] : defaultValue;
        };
        this.isSectionHRA = function(detail) {
        	return (detail.sec_no === "rent_info" || detail.sec_no === "Landlord_info");
        };
        this.isSectionOtherIncome = function(detail) {
        	return (detail.sec_no === "other");
        };
        this.isSection80D = function(detail) {
        	return (detail.sec_no === "80D");
        };
		this.buildTaxMasterList = function(data, investmentObject, isProofTab) {
            isProofTab = angular.isDefined(isProofTab) ? isProofTab : false;           
            angular.forEach(data, function(tax, key) {
                angular.forEach(tax.detail, function(detail, k) {
                    detail.sum = 0;
                    detail.amount_declared_section_sum = 0;
                    detail.amount_claimed_section_sum = 0;
                    angular.forEach(detail.details, function(item, k) {
                        if(self.isSectionHRA(detail)) {
                            self.setKey(investmentObject, item, 'rent_detail', []);
                            self.setKey(investmentObject, item, 'status');
                            self.setKey(investmentObject, item, 'allowance_id');
                            self.setKey(investmentObject, item, 'reason');
                            self.setKey(investmentObject, item, 'amount_approved', 0);
                        } else if(self.isSectionOtherIncome(detail)) {
                        	self.setKey(investmentObject, item, 'allowance_id');
                            self.setKey(investmentObject, item, 'amount_declared');
                            self.setKey(investmentObject, item, 'applicable');
                            self.setKey(investmentObject, item, 'reason');
                        }
                       else {
                            self.setKey(investmentObject, item, 'allowance_id');
                            self.setKey(investmentObject, item, 'amount_declared');
                            self.setKey(investmentObject, item, 'amount_default');
                            self.setKey(investmentObject, item, 'amount_claimed', 0);
                            self.setKey(investmentObject, item, 'amount_approved');
                            self.setKey(investmentObject, item, 'investment_proofs', []);
                            self.setKey(investmentObject, item, 'isMultipleUploaded', false);
                            self.setKey(investmentObject, item, 'status');
                            self.setKey(investmentObject, item, 'reminders', []);
                            self.setKey(investmentObject, item, 'reason');
                            self.setKey(investmentObject, item, 'investment_claimed', []);
                         

                            detail.sum = detail.sum + item.amount_declared;
                            if (isProofTab) {
                                detail.amount_claimed_section_sum = detail.amount_claimed_section_sum + item.amount_claimed;
                            } else {
                                detail.amount_declared_section_sum = detail.amount_declared_section_sum + item.amount_declared;
                            }

                            if(self.isSection80D(detail)) {
                                self.setKey(investmentObject, item, 'amount_declared_company', 0);
                                self.setKey(investmentObject, item, 'amount_claimed_company', 0);
                                self.setKey(investmentObject, item, 'amount_approved_company', 0);
                            }
                           
                        }
                    });                    
                });
            });

            return data;
        };
		this.buildInvestmentObject = function(list) {     
            var investment = {};            

            angular.forEach(list, function(value, key) {                
                investment[value.tax_id] = {};                
                investment[value.tax_id].allowance_id = value._id;
                investment[value.tax_id].investment_claimed = utilityService.getValue(value, 'investment_claimed', []);

                if(angular.isDefined(value.sec_no) && value.sec_no === "other") {
                    investment[value.tax_id].amount_declared = utilityService.getValue(value, 'amount_declared');
                    //  utilityService.convertIntoInteger(value.amount_declared);
                	investment[value.tax_id].applicable = utilityService.getValue(value, 'is_enable', false);
                    investment[value.tax_id].reason = utilityService.getValue(value, 'reason');
                } else if(angular.isDefined(value.rent_detail)) {
                    investment[value.tax_id].rent_detail = value.rent_detail;
                    investment[value.tax_id].status = value.status;
                    investment[value.tax_id].reason = utilityService.getValue(value, 'reason');
                    investment[value.tax_id].amount_approved = utilityService.getValue(value, 'amount_approved');
                    self.hraDetails = {
                        status : value.status,
                        amount_approved: utilityService.getValue(value, 'amount_approved'),
                        reason: utilityService.getValue(value, 'reason')
                    };
                } else if(angular.isDefined(value.landlord_detail)) {
                    investment[value.tax_id].rent_detail = value.landlord_detail;
                    investment[value.tax_id].status = value.status;
                    investment[value.tax_id].reason = utilityService.getValue(value, 'reason');
                } else {
                    investment[value.tax_id].amount_declared = utilityService.getValue(value, 'amount_declared', 0);
                    investment[value.tax_id].amount_claimed = utilityService.convertIntoInteger(utilityService.getValue(value, 'amount_claimed', 0));
                    investment[value.tax_id].investment_proofs = utilityService.getValue(value, 'investment_proofs', []);
                    investment[value.tax_id].isMultipleUploaded = investment[value.tax_id].investment_proofs.length ? true : false;
                    investment[value.tax_id].amount_approved = utilityService.getValue(value, 'amount_approved', 0);
                    investment[value.tax_id].status = value.status; 
                    investment[value.tax_id].reminders = angular.isDefined(value.reminders) ? value.reminders : [];
                    investment[value.tax_id].reason = utilityService.getValue(value, 'reason');
                }   
                if(angular.isDefined(value.amount_default)) {
                    investment[value.tax_id].amount_default = parseFloat(utilityService.getValue(value, 'amount_default', 0));
                    investment[value.tax_id].amount_declared = investment[value.tax_id].amount_declared ? (investment[value.tax_id].amount_declared - investment[value.tax_id].amount_default) : investment[value.tax_id].amount_declared;
                }           

                if(angular.isDefined(value.sec_no) && value.sec_no === "80D") {
                    investment[value.tax_id].amount_declared_company = utilityService.getValue(value, 'amount_declared_company', 0);
                    investment[value.tax_id].amount_claimed_company = utilityService.getValue(value, 'amount_claimed_company', 0);
                    investment[value.tax_id].amount_approved_company = utilityService.getValue(value, 'amount_approved_company', 0);
                }
            });
            
            return investment;
        };
        this.buildOtherIncomePayload = function(item) {
        	var payload = [];

            angular.forEach(item, function(value, key) {
            	payload.push({ 
                    tax_id: value.id, 
                    amount_declared: value.amount_declared,
                    is_enable: value.applicable ? true : false
                });
	        });

            return payload;
        };
        this.buildTaxComputationObject = function(model) {
        	return {
        		totalIncome: [],
        		finalComputation: [],
        		monthlyTaxLiability: [],
        		taxableAmount: 0
        	}
        };
        this.deleteHRADetailsCallback = function (data, detail, item) {
            utilityService.showSimpleToast(utilityService.getValue(data, "message"));

            if (utilityService.getValue(data, "status") === "success") {
                var list = [];
                
                angular.forEach(detail.details[0].rent_detail, function (value, key) {
                    if (value._id.$id != item._id.$id) {
                        list.push(value);
                    }
                });

                detail.details[0].rent_detail = list;
            }
        };
        this.extractItemFromList = function (list, selectedId, keyName) {
            var item = null;
            keyName = keyName || '_id';            

            angular.forEach(list, function (value, key) {
                if (utilityService.getValue(value, keyName) == selectedId) {
                    item = value;
                }
            });

            return item;
        };
        this.getUpdatedDetailObject = function (list) {
            var isFound = false,
                detailObject = null;

            angular.forEach(list, function (tax, key) {
                angular.forEach(tax.detail, function (detail, k) {
                    console.log(detail);                        
                    if (detail.sec_no == 'rent_info' && !isFound) {
                        detailObject = detail;
                        isFound = true;
                    }
                });
            });

            return detailObject;
        };
        this.buildDeclaredAmountPayload = function (model) {
            return {
                amount_declared: parseFloat(utilityService.getValue(model, 'amount_declared', 0))
            };
        };
        this.buildDefaultHeadObject = function () {
            return {
                amount_claimed: null,
                proof: null
            };
        };
        this.buildInvestmentHeadPayload = function (model) {
            var payload = {
                amount_claimed : parseFloat(utilityService.getValue(model, 'amount_claimed', 0))
            };

            if (utilityService.getValue(model, 'claim_proof') && angular.isObject(model.claim_proof)) {
                payload.proof = model.claim_proof;
            }

            return payload;
        };
        this.addSyncMissingClaimToList = function (list, claimObject) {
            list[claimObject.tax_id] = claimObject;
        };

        this.buildCompareTaxPayload = function(model) {
            var withInvestment = model.withInvestment
            return {
                "annual_rent": utilityService.getValue(model, 'annual_rent'),
                "is_metro": utilityService.getValue(model, 'is_metro'),
                "80_C": utilityService.getInnerValue(withInvestment, '80_C', 'invested'),
                "80_D_17": utilityService.getInnerValue(withInvestment, '80_D_17', 'invested'),
                "80_D_18": utilityService.getInnerValue(withInvestment, '80_D_18', 'invested'),
                "80_D_19": utilityService.getInnerValue(withInvestment, '80_D_19', 'invested'),
                "80_E": utilityService.getInnerValue(withInvestment, '80_E', 'invested'),
                "80_CCD": utilityService.getInnerValue(withInvestment, '80_CCD', 'invested'),
                "80_G" :utilityService.getInnerValue(withInvestment, '80_G', 'invested'),
                "income_from_house_property": utilityService.getInnerValue(withInvestment, 'income_from_house_property', 'invested'),
                "housing_loan_interest": utilityService.getInnerValue(withInvestment, 'housing_loan_interest', 'invested'),
                "other_source_income": utilityService.getInnerValue(withInvestment, 'other_source_income', 'invested')
            }
        }
    }
]);
