app.service('travelService', ['utilityService', 'FORM_BUILDER',
    function (utilityService, FORM_BUILDER) {
        'use strict';
        var self = this;
        this.url = {
            delegate: 'travel-expense/frontend/assign-delegate',
            employee: 'user-addition/users-preview',
            cotravellers: 'travel-expense/frontend/all-user',
            travelSetting: 'travel-expense/travel-settings',
            categories: 'travel-expense/expense-categories',
            city: 'travel-expense/frontend/country-cities',
            tripRequest: "travel-expense/frontend/travel-request",
            requestDetails: "travel-expense/frontend/employee/all-travel-request",
            //individualRequest: "travel-expense/frontend/travel-request",
            delegatesEmployee: "travel-expense/frontend/assign-employee",
            approvers: "travel-expense/frontend/workflow-preview",
            policyRule: "travel-expense/travel-policy",
            currency: 'data/travel/currency-code1.json',
            reminder: 'prejoin/frontend/send-reminder'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildTravelModel = function(model){
            return {
                _id: utilityService.getValue(model, '_id'),
                emp_id: utilityService.getValue(model,'emp_id'),
                travel_type: utilityService.getValue(model, 'travel_type',1),
                trip_type: utilityService.getValue(model,'trip_type',1),
                travel_reason: utilityService.getValue(model,'travel_reason'),
                also_notify_employee: utilityService.getValue(model, 'also_notify_employee', []),
                comments: utilityService.getValue(model,'comments'),
                visa: utilityService.getValue(model,'visa',1),
                co_travellers: utilityService.getValue(model, 'co_travellers', []),
                approval_comment: utilityService.getValue(model,'approval_comment'),
                status: utilityService.getValue(model, 'status'),
                travel_details: utilityService.getValue(model,'travel_details'),
                requestType: utilityService.getValue(model,'requestType', 0),
                template: utilityService.getValue(model,'template', 1)
            };
        };
        this.getListId = function(list) {
            var empDetails = [];
            angular.forEach(list,function(value,key){
                empDetails.push(value.id);
            });

            return empDetails;
        };
        this.buildUserViewObj = function(item,type) {
            return {
                _id: type == 'delegate' ? item.loginEmpId : item._id ,
                full_name: type == 'delegate' ? item.fullname : item.full_name,
                profile_pic: type == 'delegate' ? item.profilePic : item.profile_pic,
                display_detail: type == 'delegate' ? item.displayDetail : item.display_detail
            }
        };
        this.convertDate = function(dateTime) {
            // var myDate = new Date(dateTime * 1000);
            // myDate = myDate.toLocaleString();
            // myDate = utilityService.dateFormatConvertion(myDate);

            // return new Date(myDate);
            return new Date(dateTime * 1000);
        };
        this.travelDetailModel = function(item) {
            return {
                _id: item._id.$id,
                source_city: item.source_city ? item.source_city : null,
                destination_city: item.destination_city ? item.destination_city : null,
                requested_departure_date: this.convertDate(item.requested_departure_date),
                //return_date: angular.isDefined(item.return_date) ? this.convertDate(item.return_date) : null,
                fromCity: [],
                toCity: []
            }
        };
        this.buildTravelDetailObj = function(list, tripType, flag) {
            var empDetails = [];
            angular.forEach(list,function(value,key){
                var detail = {
                    source_city: value.source_city,
                    destination_city: value.destination_city,
                    requested_departure_date: utilityService.dateFormatConvertion(value.requested_departure_date),
                };
                if(value.fromCountrycode == "OTH"){
                    detail.from_other_city = value.from_other_city
                }
                if(value.toCountrycode == "OTH"){
                    detail.to_other_city = value.to_other_city
                }
                if(tripType == 2){
                    detail.return_date = utilityService.dateFormatConvertion(value.return_date);
                }
                if(flag && angular.isDefined(value._id)) {
                    detail._id = value._id;
                }
                empDetails.push(detail);
            });

            return empDetails;
        };
        this.addNameInSpecificKey = function(item) {
            var object = [];
            angular.forEach(item,function(v,k) {
                object.push({
                    id : v._id,
                    email : v.email,
                    name : v.full_name,
                    image: utilityService.getValue(v, 'profile_pic') ? v.profile_pic : 'images/no-avatar.png'
                });
            });

            return object;
        };
        this.buildRequestPayload = function(UserId, model, travelDetails, flag) {
            flag = angular.isDefined(flag) ? flag : false;
            var payload = {
                emp_id: UserId,
                travel_type: model.travel_type,
                trip_type: model.trip_type,
                travel_reason: model.travel_reason,
                also_notify_employee: this.getListId(model.also_notify_employee),
                co_travellers: this.getListId(model.co_travellers),
                approval_comment: model.approval_comment,
                comments: model.comments,
                travel_details: this.buildTravelDetailObj(travelDetails,model.trip_type,flag)
            };
            if (model.travel_type == 2) { 
                payload.visa = model.visa;
            }

            return payload;
        };
        this.buildDefaultTravelDetailObject = function(minDateValue) {
            minDateValue = angular.isDefined(minDateValue) ? minDateValue : new Date();
            return {
                source_city: null,
                destination_city:null,
                requested_departure_date: null,
                min_requested_departure_date: minDateValue,
                return_date: null,
                fromCity: [],
                toCity: [],
                pickUpCity: null,
                dropUpCity: null,
                fromInternational: false,
                toInternational: false,
                fromCountry: null,
                toCountry:null,
                errorFlag: false
            };
        };
        this.buildDefaultTravelDetailList = function() {
            var list = [];
            list.push(this.buildDefaultTravelDetailObject());

            return list;
        };
        this.buildPaymentModeObject = function() {
            return {
                1: "Advance",
                2: "Reimbursed",
                3: "Travel Planner"
            }
        };
        this.buildRequestStatusObject = function() {
            return {
                0: "All Requests",
                1: "Pending",
                10: "Approved By Workflow",
                8: "Approved By Admin",
                3: "Auto Approved",
                11: "Rejected By Approver",
                9: "Rejected By Admin",
                16: "Escalated"
            }
        };
        this.buildTravelModelObject = function() {
            return {
                travel: {
                    model: this.buildTravelModel(),
                    list: [],
                    categoryType: [],
                    setting: null,
                    delegate: null,
                    approverChain: [],
                    approverList:[],
                    existingList: [],
                    delegateEmployee: {
                        list: []
                    },
                    paymentMode: this.buildPaymentModeObject(),
                    city: [],
                    fromCity: [],
                    toCity: [],
                    travelType: [{
                        id: 1,
                        name: "Domestic"
                    },
                    {
                        id: 2,
                        name: "International"
                    }],
                    tripType: [{
                        id: 1,
                        name: "One Way"
                    },
                    {
                        id: 2,
                        name: "Round Trip"
                    },
                    {
                        id: 3,
                        name: "Multicity"
                    }],
                    visaDetails: [{
                        id: 1,
                        name: "Already have Visa"
                    },
                    {
                        id: 2,
                        name: "Visa Required"
                    }],
                    travelDetails: this.buildDefaultTravelDetailList(),
                    status: this.buildRequestStatusObject(),
                    requestTemplate: {
                        1: "Create request from scratch",
                        2: "Use an existing request as template"
                    }
                }
            }
        };
        this.getCityName = function(cityId,cityList, isCode) {
            isCode = angular.isDefined(isCode) ? isCode : false;
            var cityName = null;
            angular.forEach(cityList, function(value, key) {
                if (value._id == cityId) {
                    cityName = isCode ? value.code :  value.city_name + " (" + value.code + ")";
                }
            });

            return cityName;
        };
        this.getTravelReasonName = function(reasonId,reasonList) {
            var reasonName = null;
            angular.forEach(reasonList, function(value, key) {
                if (value._id.$id == reasonId) {
                    reasonName = value.name;
                }
            });

            return reasonName;
        };
        this.buildRequestDetails = function(list, travelObject) {
            angular.forEach(list,function(v,k) {
                v.travelReason = travelObject.setting && travelObject.setting.travel_reasons ? self.getTravelReasonName(v.travel_reason,travelObject.setting.travel_reasons) : null;
                v.requestStatus = travelObject.status[v.status];
                if(v.trip_type != 2) {
                    angular.forEach(v.travel_details,function(value,key) {
                        var details = {};
                        details._id = v._id;
                        details.fromCityName = self.getCityName(value.source_city,travelObject.city);
                        value.fromCityName = self.getCityName(value.source_city,travelObject.city);
                        details.toCityName = self.getCityName(value.destination_city,travelObject.city);
                        value.toCityName = self.getCityName(value.destination_city,travelObject.city);
                        var fromDate = new Date(value.requested_departure_date * 1000);
                        //fromDate = fromDate.toLocaleString();
                        details.departDate = utilityService.dateFormatConvertion(fromDate);
                        value.departDate = details.departDate;
                        v.requestDate = utilityService.dateFormatConvertion(v.created_at.date);
                        travelObject.existingList.push(details);
                    });
                }
                if(v.trip_type == 2) {
                    var details = {};
                        details._id = v._id;
                        details.fromCityName = self.getCityName(v.travel_details[0].source_city,travelObject.city);
                        details.toCityName = self.getCityName(v.travel_details[0].destination_city,travelObject.city);

                        v.travel_details[0].fromCityName = self.getCityName(v.travel_details[0].source_city,travelObject.city);
                        v.travel_details[0].toCityName = self.getCityName(v.travel_details[0].destination_city,travelObject.city);
                        var fromDate = new Date(v.travel_details[0].requested_departure_date * 1000);
                        //fromDate = fromDate.toLocaleString();
                        details.departDate = utilityService.dateFormatConvertion(fromDate);
                        v.travel_details[0].departDate = details.departDate;
                        var toDate = new Date(v.travel_details[1].requested_departure_date * 1000);
                        //toDate = toDate.toLocaleString();
                        v.travel_details[0].return_date = v.travel_details[1].requested_departure_date;
                        v.travel_details[0].returnDate = utilityService.dateFormatConvertion(toDate);
                        v.requestDate = utilityService.dateFormatConvertion(v.created_at.date);
                        v.travel_details.splice(1, 1);
                        travelObject.existingList.push(details);
                }
            });
            return list;
        };
        this.buildTravelDetailPayload = function(list,data,travelObject) {
            var details = [];
            if (data.trip_type != 2) {
                angular.forEach(list, function(value, key) {
                    var travelKey = self.travelDetailModel(value);
                        travelKey.pickUpCity = value.source_city ? self.getCityName(value.source_city,travelObject.city) : null;
                        travelKey.dropUpCity = value.destination_city ? self.getCityName(value.destination_city,travelObject.city) : null;
                        travelKey.from_other_city = value.from_other_city,
                        travelKey.to_other_city = value.to_other_city,
                        travelKey.fromCountrycode = value.source_city ? self.getCityName(value.source_city,travelObject.city, true) : null;
                        travelKey.toCountrycode = value.destination_city ? self.getCityName(value.destination_city,travelObject.city, true) : null;
                    details.push(travelKey);
                });
            }
            if (data.trip_type == 2) {
                angular.forEach(list, function(value, key) {
                    var travelKey = self.travelDetailModel(value);
                        travelKey.pickUpCity = value.source_city ? self.getCityName(value.source_city,travelObject.city) : null;
                        travelKey.dropUpCity = value.destination_city ? self.getCityName(value.destination_city,travelObject.city) : null;
                    details.push(travelKey);
                });
                details[0].return_date = details[1].requested_departure_date;
                details.splice(1,1);
            }
            return details;
        };
        this.buildReminderPayload = function (item, approver, type){
            return {
                master_emp_id: item.emp_id,
                slave_emp_id: approver.employee_id,
                type: type,
                request_id: item._id
            };
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

    }
]);