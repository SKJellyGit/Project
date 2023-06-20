app.service('ExpenseService', ['utilityService', 'FORM_BUILDER',
    function (utilityService, FORM_BUILDER) {
        'use strict';

        var self = this;

        this.url = {
            delegate: 'expense/frontend/assign-delegate',
            delegatesEmployee: "expense/frontend/assign-employee",
            expenseCatergory: 'expense/frontend/policy-expense-categories',            
            city: 'travel-expense/frontend/country-cities',
            expenceTypeSettings: 'expense/frontend/expense-setting',
            addExpence: 'expense/frontend/expense-request',
            deleteExpense:'expense/frontend/download-attachment',
            getExpence: 'expense/frontend/employee/all-expense-request',
            currency: 'data/travel/currency-code.json',
            employee: 'user-addition/users-preview',
            expenseEmployees:'travel-expense/frontend/all-user',
            viewAttachment:'expense/frontend/download-attachment',
            downloadTickets: 'travel-planner/download-ticket',
            previousRequests: 'expense/frontend/expense-requests',
            applicabilityList:'expense/frontend/user-expense-categories',
            empForGroupRequest: 'expense/frontend/group-employees',
            projectableTimesheets: 'timesheet/employee-clients',
            travelList: 'expense/frontend/travel-details',
            downloadAllReceipts: 'expense/frontend/download-all-attachment',

            // Advance related APIs
            advanceCatergory: 'expense/frontend/advance-expense-policy-categories',
            advance: 'expense/frontend/advance-expense-request',
            advanceDetails: 'expense/frontend/global-advanace-request',
            deleteAdvance: 'expense/frontend/global-expense-request',
            employeeAdvanceDetails: 'expense/frontend/employee-advanace-request'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildExpenseObj = function () {
            return {
                delegate: null,
                assignDelegate: null,
                cityList: null,
                expenseStatus: 0,
                isAdded: false,
                credit_currency: null,
                credit_amount: 0,
                expense: {
                    reverse: null,
                    propertyName: null
                },
                journeyType: {
                    1: "One-way Journey",
                    2: "Trip",
                    3: "Day",
                    4: "Mile",
                    5: "KM",
                    6: "Month",
                    7: "Night",
                    8: "Weekly",
                    9: "Occurance"
                },
                selectedTab: 1,
                expenseType:1,
                has_error:false,
                error_message:null
            };
        };
        this.buildExpenseModel = function (model) {
            var expDate = angular.isNumber(utilityService.getValue(model, 'expense_date'))
                    ? utilityService.dateToString(utilityService.getValue(model, 'expense_date'))
                    : utilityService.getValue(model, 'expense_date'); 
            return {
                expense_id: utilityService.getValue(model, 'expense_id'),
                travel_expense: utilityService.getValue(model, 'travel_expense'),
                expense_category_name: utilityService.getValue(model, 'expense_category_name'),
                applicability: utilityService.getValue(model, 'applicability'),
                expense_type: utilityService.getValue(model, 'expense_type'),
                travel_id: utilityService.getValue(model, 'travel_id'),
                file: utilityService.getValue(model, 'file'),
                travel_planner_id: utilityService.getValue(model, 'travel_planner_id'),
                city_budget_limit: utilityService.getValue(model, 'city_budget_limit'),
                exchange_rate: utilityService.getValue(model, 'exchange_rate'),
                destination_city: utilityService.getValue(model, 'destination_city'),
                expenseRequest: utilityService.getValue(model, 'expenseRequest', 1),
                expense_date: utilityService.getDefaultDate(expDate),
                expense_category: utilityService.getValue(model, 'expense_category'),
                advance_currency_code: utilityService.getValue(model, 'advance_currency_code'),
                advance_amount: utilityService.getValue(model, 'advance_amount'),
                status: utilityService.getValue(model, 'status'),
                travel_info: utilityService.getValue(model, 'travel_info'),                
                //total_amount: utilityService.getValue(model, 'total_amount'),
                is_itemized: utilityService.getValue(model, 'is_itemized',false),
                is_tax_seprate: utilityService.getValue(model, 'is_tax_seprate',false),
                expense_billable: utilityService.getValue(model, 'expense_billable',false),
                projectable_expense: utilityService.getValue(model, 'projectable_expense',false),
                expense_comment: utilityService.getValue(model, 'expense_comment'),
                merchant_name: utilityService.getValue(model, 'merchant_name'),
                itemize_details: utilityService.getValue(model, 'itemize_details',[{"itemize_amount":null,"itemize_tax":null,"reimbursement":false,"billable":false,"remark":null}]),
                claim_id:utilityService.getValue(model, 'claim_id'),
                claimed_amount_currency: utilityService.getValue(model, 'claimed_amount_currency'),
                amount_without_tax: utilityService.getValue(model, 'amount_without_tax'),
                amount_with_tax: utilityService.getValue(model, 'tax_amount'),
                claimed_amount: utilityService.getValue(model, 'claimed_amount'),
                claimed_tax: utilityService.getValue(model, 'tax_rate'),
                claim_status: utilityService.getValue(model, 'claim_status'),
                advance_output_currency: utilityService.getValue(model, 'advance_output_currency'),
                claim_output_currency: utilityService.getValue(model, 'claim_output_currency'),
                //claim_details: angular.isDefined(model.claim_details) && model.claim_details.length?model.claim_details[0]:null,
                concidered_tax_amount: utilityService.getValue(model, 'concidered_tax_amount'),
                expense_attachment: utilityService.getValue(model, 'expense_attachment',[]),
                tickets_attachment: utilityService.getValue(model, 'tickets_attachment', []),
                is_final_request: utilityService.getValue(model, 'is_final_request'),
                expense_bill_to: utilityService.getValue(model, 'expense_bill_to'),
                timesheet: utilityService.getInnerValue(model, 'timesheet', '_id'),
                timesheetName: utilityService.getValue(model, 'timesheet') ? (model.timesheet.client_name+' - '+model.timesheet.job_name) : null,
                distance: utilityService.getValue(model, 'distance'),
                fromDate: utilityService.getDefaultDate(utilityService.getValue(model, 'from_date'),false,true),
                toDate: utilityService.getDefaultDate(utilityService.getValue(model, 'to_date'),false,true),
                billNo: utilityService.getValue(model, 'bill_no'),
                from_date: utilityService.getValue(model, 'from_date'),
                to_date: utilityService.getValue(model, 'to_date'),
                receipt_names: utilityService.getValue(model, 'receipt_names'),
                multiple_bill: utilityService.getValue(model, 'multiple_bill',false),
                group_employee_ids: utilityService.getValue(model, 'group_employee_ids',[]),
                group_requests_status: utilityService.getValue(model, 'group_requests_status',[]),
                stay_city_name: utilityService.getValue(model, 'stay_city_name'),
                billDate: utilityService.getDefaultDate(utilityService.getValue(model, 'bill_date'),false,true),
                _id: utilityService.getValue(model, '_id'),
                travelPlanneramount: utilityService.getValue(model, 'amount'),
                travel_planner_merchant_name: utilityService.getValue(model, 'travel_planner_merchant_name'),
                total_amount: utilityService.getValue(model, 'total_amount'),
                otherCities: utilityService.getValue(model, 'other_cities'),
                employee_preview: utilityService.getValue(model, 'employee_preview'),
                confirm_amount: utilityService.getValue(model, 'confirm_amount'),
                parent_request_id: utilityService.getValue(model, 'parent_request_id'),
                requester_preview: utilityService.getValue(model, 'requester_preview'),
                expense_unique_id: utilityService.getValue(model, 'expense_unique_id'),
                resubmit_request_id: utilityService.getValue(model, 'resubmit_request_id'),
                resubmit_request_unique_id: utilityService.getValue(model, 'resubmit_request_unique_id'),
                reject_comment: utilityService.getValue(model, 'reject_comment'),
                approver_chain: utilityService.getValue(model, 'approver_chain', []),
                is_advance_request: utilityService.getValue(model, 'is_advance_request', false),
                question_details: {
                    questions: utilityService.getInnerValue(model, 'question_details', 'questions', []),
                },
            };
        };
        this.buildRefreshReqForm = function (model){
            return {
                expense_id: utilityService.getValue(model, 'expense_id'),
                travel_expense: utilityService.getValue(model, 'travel_expense'),
                expense_category_name: utilityService.getValue(model, 'expense_category_name'),
                applicability: utilityService.getValue(model, 'applicability'),
                expense_type: utilityService.getValue(model, 'expense_type'),
                travel_id: utilityService.getValue(model, 'travel_id'),
                file: utilityService.getValue(model, 'file'),
                travel_planner_id: utilityService.getValue(model, 'travel_planner_id'),
                city_budget_limit: utilityService.getValue(model, 'city_budget_limit'),
                exchange_rate: null,
                multiple_bill: utilityService.getValue(model, 'multiple_bill',false),
                destination_city: null,
                expenseRequest: utilityService.getValue(model, 'expenseRequest', 1),
                expense_date: null,
                expense_category: utilityService.getValue(model, 'expense_category'),
                advance_currency_code: utilityService.getValue(model, 'advance_currency_code'),
                advance_amount: null,
                status: utilityService.getValue(model, 'status'),
                travel_info: utilityService.getValue(model, 'travel_info'),                
                //total_amount: utilityService.getValue(model, 'total_amount'),
                is_itemized: false,
                is_tax_seprate: false,
                expense_billable: false,
                projectable_expense: false,
                expense_comment: null,
                merchant_name: null,
                itemize_details: [{"itemize_amount":null,"itemize_tax":null,"reimbursement":false,"billable":false,"remark":null}],
                claim_id:null,
                claimed_amount_currency: utilityService.getValue(model, 'claimed_amount_currency'),
                amount_without_tax: null,
                amount_with_tax: null,
                claimed_amount: null,
                claimed_tax: null,
                claim_status: utilityService.getValue(model, 'claim_status'),
                advance_output_currency: utilityService.getValue(model, 'advance_output_currency'),
                claim_output_currency: utilityService.getValue(model, 'claim_output_currency'),
                //claim_details: angular.isDefined(model.claim_details) && model.claim_details.length?model.claim_details[0]:null,
                concidered_tax_amount: utilityService.getValue(model, 'concidered_tax_amount'),
                expense_attachment: [],
                tickets_attachment: [],
                is_final_request: false,
                expense_bill_to: null,
                timesheet: null,
                distance: null,
                fromDate: null,
	    		// fromDate: utilityService.getDefaultDate(utilityService.getInnerValue(model.date, 'from_date', 'selected_value'), true, true),
                toDate: null,
                billNo: null,
                stay_city_name: null,
                billDate: null,
                question_details: {
                    questions: utilityService.getInnerValue(model, 'question_details', 'questions', []),
                },
                advance_reconciliation_type: null
            };
        };
        this.checkClaimDetails = function (item){
            angular.forEach(item,function (val,key){
                angular.forEach(val, function (v, k){ 
                    if(!v){
                        delete val[k];
                    }  
                });
            });
            return item;
        };
        this.extractIds = function (list) {
            var ids = [];
            angular.forEach(list, function (value, key) {
                angular.isObject(value.id) ? ids.push(value.id.$id) : ids.push(value.id);
            });
            return ids;
        };
        this.buildExpensePayload = function (emp_id,model,self) {
            var obj = {
                is_reconcile_request: true,
                copy_id: utilityService.getValue(model, 'copy_id'),
                multiple_bill: utilityService.getValue(model, 'multiple_bill',false),
                applicability: utilityService.getValue(model, 'applicability'),                
                travel_planner_id: utilityService.getValue(model, 'travel_planner_id'),
                expense_date: utilityService.dateToString(utilityService.getValue(model, 'expense_date'),'-'),
                advance_currency_code: utilityService.getValue(model, 'advance_currency_code'),
                expense_category: utilityService.getValue(model, 'expense_category'),
                is_itemized: utilityService.getValue(model, 'is_itemized'),
                expense_billable: utilityService.getValue(model, 'expense_billable'),  
                projectable_expense: utilityService.getValue(model, 'projectable_expense'),              
                is_tax_seprate: utilityService.getValue(model, 'is_tax_seprate'),
                _id: utilityService.getValue(model, 'claim_id'),
                claimed_amount_currency: utilityService.getInnerValue(model, 'claimed_amount_currency', 'code'),
                amount_without_tax: utilityService.getValue(model, 'amount_without_tax'),
                tax_rate: utilityService.getValue(model, 'claimed_tax'),
                tax_amount: utilityService.getValue(model, 'amount_with_tax'),
                total_amount: utilityService.getValue(model, 'claimed_amount'),
                //claimed_amount: utilityService.getValue(model, 'claimed_amount'),
                expense_attachment: utilityService.getValue(model, 'expense_attachment'),
                is_final_request: utilityService.getValue(model, 'is_final_request'),
            };     
            
            if(obj.total_amount === null) {
                obj.total_amount = utilityService.getValue(model, 'total_amount')
            }
            if (model.billDate) {
                obj.bill_date = utilityService.dateToString(utilityService.getValue(model, 'billDate'),'-');
            }
            if (model.fromDate) {
                obj.from_date = utilityService.dateToString(utilityService.getValue(model, 'fromDate'),'-');
            }
            if (model.toDate) {
                obj.to_date = utilityService.dateToString(utilityService.getValue(model, 'toDate'),'-');
                // obj.to_date = utilityService.dateFormatConvertion(model.toDate);
            }
            if (model.is_itemized) {
                obj.itemize_details = utilityService.getValue(model, 'itemize_details');
            }
            if(model.stay_city_name){
                obj.stay_city_name = utilityService.getInnerValue(model, 'stay_city_name','_id');
                if(utilityService.getInnerValue(model, 'stay_city_name','code') == "OTH"){
                    obj.other_cities = utilityService.getValue(model, 'otherCities');
                }
            }
            if(model.expense_type){
                obj.expense_type = utilityService.getValue(model, 'expense_type');
            }
            if(model.distance){
                obj.distance = utilityService.getValue(model, 'distance');
            }
            if (model.expense_bill_to) {
                obj.expense_bill_to = utilityService.getValue(model, 'expense_bill_to');
            }
            if (model.projectable_expense) {
                obj.timesheet = utilityService.getValue(model, 'timesheet');
            }
            if (model.billNo) {
                obj.bill_no = utilityService.getValue(model, 'billNo');
            }
            if (model.merchant_name && model.merchant_name != 'null') {
                obj.merchant_name = utilityService.getValue(model, 'merchant_name');
            }
            if (emp_id) {
                obj.emp_id = emp_id;
            }
            if (model.expense_comment) {
                obj.expense_comment = utilityService.getValue(model, 'expense_comment');
            }
            if(self.group_employee_ids.length){
                obj.group_employee_ids = this.extractIds(self.group_employee_ids);
            }
            if (model.exchange_rate) {
                obj.exchange_rate = utilityService.getValue(model, 'exchange_rate');
            }
            return obj;
        };
        this.buildAdvanceExpensePayload = function (emp_id,model){
            var obj = {
                applicability: utilityService.getValue(model, 'applicability'),
                expense_type: utilityService.getValue(model, 'expense_type'),
                total_amount: utilityService.getValue(model, 'total_amount'),                
                expense_comment: utilityService.getValue(model, 'expense_comment'),  
            };
            if (model.fromDate) {
                obj.from_date = utilityService.dateToString(utilityService.getValue(model, 'fromDate'), '-');
            }
            if (model.toDate) {
                obj.to_date = utilityService.dateToString(utilityService.getValue(model, 'toDate'), '-');
                // obj.to_date = utilityService.dateFormatConvertion(model.toDate);
            }
            if (emp_id) {
                obj.emp_id = emp_id;
            }
            if(model.distance){
                obj.distance = utilityService.getValue(model, 'distance');
            }
            if (model.stay_city_name) {
                obj.stay_city_name = utilityService.getInnerValue(model, 'stay_city_name', '_id');
                if(utilityService.getInnerValue(model, 'stay_city_name','code') == "OTH"){
                    obj.other_cities = utilityService.getValue(model, 'otherCities');
                }
            }
            if (model.exchange_rate) {
                obj.exchange_rate = utilityService.getValue(model, 'exchange_rate');
            }
            return obj;
        };
        this.expenceTypes = function () {
            return {
                1: "In Office",
                2: "Domestic",
                3: "International"
            };
        };
        this.buildPaymentModeObj = function () {
            return {
                1: "Advance",
                2: "Reimbursed",
                3: "Travel Planner"
            };
        };
        this.buildAttachmentObject = function () {
            return {
                files: {},
                isUploaded: false
            }
        };
        this.buildUserViewObj = function(item,type) {
            return {
                _id: type == 'delegate' ? item.loginEmpId : item._id ,
                full_name: type == 'delegate' ? item.fullname : item.full_name,
                profile_pic: type == 'delegate' ? item.profilePic : item.profile_pic,
                display_detail: type == 'delegate' ? item.displayDetail : item.display_detail
            }
        };        
        this.scheduledFrequency = function () {
            return {
                1: 'Weekly',
                2: 'Twice in a month',
                3: 'Monthly',
                4: 'Trip'
            };
        };
        this.buildDayHasMapObj = function () {
            return {
                1: "Monday",
                2: "Tuesday",
                3: "Wednesday",
                4: "Thursday",
                5: "Friday",
                6: "Saturday",
                7: "Sunday"
            };
        };
        this.buildRequestStatusObject = function() {
            return {
                0: "All Request",
                1: "Pending",
                3: "Auto Approved",
                8: "Approved By Admin",
                9: "Rejected By Admin",
                10: "Approved By Workflow",
                11: "Rejected By Approver",
                16: "Escalated"                
            }
        };
        this.buildCSVContent = function(list, currencyList) {
            var arr = new Array(['Expense Type', 'Expense Category', 'Expense Duration', 
                'Raised Date', 'Amount', 'Comment', 'Confirmed Amount', 'Status']); 
            
            var object = {
                list: list,
                content: arr
            };

            angular.forEach(object.list, function(value, key) {
                var array = new Array();
                var strAmount = null;

                array.push(utilityService.getValue(value, 'expense_category_type_name'));
                array.push(utilityService.getValue(value, 'expense_category_name'));
                array.push(utilityService.getValue(value, 'expense_duration'));
                array.push(utilityService.getValue(value, 'raised_on'));                

                if (utilityService.getValue(value, 'payment_method') != 3) {
                    strAmount = (utilityService.getInnerValue(value, 'expense_request_setting', 'budget_amount')
                        ? currencyList[value.claimed_amount_currency].symbol_native 
                        : currencyList[value.output_amount_currency].symbol_native) + ' '
                        + value.claim_amount ? value.claim_amount : 'N/A' + ' = ' 
                        + value.output_total_amount
                            ? currencyList[value.output_amount_currency].symbol_native
                                + value.output_total_amount
                            : 'N/A';
                    array.push(strAmount);
                } else if (utilityService.getValue(value, 'payment_method') == 3 && value.amount) {
                    strAmount = currencyList[value.output_currency_code].symbol_native 
                        + ' ' + value.amount;
                    array.push(strAmount);                    
                }

                array.push(utilityService.getValue(value, 'expense_comment'));
                array.push(utilityService.getValue(value, 'confirm_amount'));
                array.push(utilityService.getValue(value, 'statusText'));

                object.content.push(array);
            });

            return object;
        };

        this.builLimitTypeHasMapObj = function () {
            return {
                1: "Soft Limit",
                2: "Hard Limit",
                3: "Fixed Limit",
            };
        };

        this.createSubCatogories = function(dataArray, categoryArray, selectedIndex) {
            if(!dataArray || !dataArray.length) {
                return categoryArray;
            }
            if(categoryArray.length) {
                if(angular.isDefined(selectedIndex) && !categoryArray[selectedIndex].subcatogories.length && !categoryArray[selectedIndex].id) {
                    angular.forEach(dataArray, function(element) {
                        var catog = element.name.split('-');
                        if(catog[0].trim() === categoryArray[selectedIndex].category) {
                            if(catog.length>1) {
                                catog.shift();
                                categoryArray[selectedIndex].subcatogories.push({
                                    subcatogory: catog.join('-').trim(),
                                    id: element._id
                                });
                            } else {
                                categoryArray[selectedIndex].id = element._id;
                                categoryArray[selectedIndex].subcatogories = [];
                            }
                        }
                    });
                }
            } else {
                angular.forEach(dataArray, function(element) {
                    // var delimeterIndex = element.name.indexOf('-')
                    // var catog = element.name.substr(0, delimeterIndex===-1?element.name.length:delimeterIndex);
                    var catog = element.name.split('-')[0].trim();
                    var ind = categoryArray.findIndex(function(el) { return el.category === catog;});
                    if(ind === -1) {
                        categoryArray.push({
                            category: catog,
                            id: null,
                            subcatogories: []
                        });
                    }
                });
            }
            return categoryArray;
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
                            : (angular.isString(value.answer) && !value.answer.length)
                                ? null
                                : utilityService.getDefaultDate(value.answer);
                    } else if(value.question_type == FORM_BUILDER.questionType.time) {
                        value.answer = angular.isDate(value.answer)
                            ? value.answer
                            : (angular.isString(value.answer) && !value.answer.length)
                                ? null
                                : utilityService.getDefaultDate('01/01/1970 ' + value.answer);
                    }
                }
            });
            return questionList;
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
                if(value.question_type == FORM_BUILDER.questionType.date) {
                    payload["question_" + value._id] = utilityService.dateFormatConvertion(value.answer);
                } else if(value.question_type == FORM_BUILDER.questionType.time) {
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

        /**** Start Advance Section *****/
        this.buildAdvanceObject = function () {
            return {
                list: [],
                visible: false,
                type: {
                    list: {
                        1: "In Office",
                        2: "Domestic",
                        3: "International"
                    },
                    selected: 1
                },
                filteredList: [],
                propertyName: '',
                reverse: false,
                balance: {
                    amount: 0
                },
                search: {
                    text: ''
                },
                employee: {
                    id: null,
                    name: null,
                    code: null,
                    pic: null
                },
                isModalOpen: false
            }
        };
        this.clubAdvanceRequestWithReconsiledOnes = function (list) {
            var clubedResponse = [];
            if (!list.length) {
                return clubedResponse;
            }            
            
            for(var i=list.length - 1; i>=0; i--) {
                // This sortOrder key has been added because we need to sort clubedResponse
                // array after loop completion
                list[i].sortOrder = ++clubedResponse.length;
                list[i].clubType = 1; // 1 means this is normal advance request
                clubedResponse.push(list[i]);
                angular.forEach(list[i].reconcile_request, function (value, key) {
                    value.sortOrder = ++clubedResponse.length;
                    value.clubType = 2; // 2 means this is consiled advance request
                    clubedResponse.push(value);
                });
            }

            clubedResponse.sort(utilityService.dynamicSort("-sortOrder"));

            return clubedResponse;
        };
        this.getAdvanceBalanceAmount = function (list) {
            return utilityService.getInnerValue(list, 0, 'balance_amount', 0);
        };
        this.buildAdvanceCSVHeaders = function () {
            return ['Advance Category Name', 'Raised Date', 'Credit', 'Debit', 
                'Balance', 'Comment', 'Status'];
        };
        this.buildAdvanceCSVContent = function(list) {
            var arr = new Array(this.buildAdvanceCSVHeaders()),
                object = {
                    content: arr
                },
                statusMapping = utilityService.buildApproverStatusHashMap();

            angular.forEach(list, function(value, key) {
                var array = new Array();

                array.push(utilityService.getValue(value, 'expense_category_name'));
                array.push(utilityService.getValue(value, 'raised_on'));

                if (utilityService.getValue(value, 'is_advance_request')) {
                    array.push(utilityService.getValue(value, 'total_amount'));
                } else {
                    array.push('-');
                }

                if (utilityService.getValue(value, 'advance_request_id')) {
                    array.push(utilityService.getValue(value, 'total_amount'));
                } else {
                    array.push('-');
                }
                
                array.push(utilityService.getValue(value, 'balance_amount'));
                array.push(utilityService.getValue(value, 'expense_comment'));
                array.push(statusMapping[utilityService.getValue(value, 'status', 1)]);

                object.content.push(array);
            });

            return object;
        };
        /**** End Advance Section *****/
    }
]);