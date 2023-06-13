app.service('CandidatePortalService', [
	'ServerUtilityService', 'utilityService','FORM_BUILDER',        
	function (ServerUtilityService, utilityService,FORM_BUILDER) {
		'use strict';

		var selfServive = this;

	    this.url = {	   
	    	profile: 'my/profile',
            offer: 'prejoin/candidate/portal/accept-reject-offer',              
            skill: 'skill',
            candidateDetail: 'send-offer/candidate/detail',
            documentUpload: 'my/required/document',
            myDetail: 'my/detail',
            doc: 'prejoin/candidate/allowed-document',
            updateDoc: 'prejoin/candidate/documents',
            welcomeMessage: 'prejoin/communication',
            setupFields: 'prejoin/candidate/portal-fields',
            downloadOffer: 'prejoin/candidate/download-letter',
            getForm: 'prejoin/candidate/allowed-forms',
            updateForm: 'prejoin/candidate/forms',
            getGlobalSetting: 'prejoin/candidate/portal',
            countryDialCodes: 'user-addition/dial-codes',
            checkMandatoryForm: 'prejoin/candidate/check-mandatory-form-submitted'
	    };
            
        this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };

	    this.buildWizardObject = function() {
	    	return {
	            "welcome": true,
	            "offer": false,
	            "profile": false,
	            "documents": false,
                "forms" : false
	        }
	    };

	    this.buildOfferStatusObject = function() {
	    	return {
	            pending: 1,
	            accepted: 5,
	            rejected: 6
	        }
	    };

	    this.buildProfileModel = function(model) {
	    	return {
	            name: utilityService.getValue(model, 'first_name') + " " +utilityService.getValue(model, 'last_name'), 
	            email: utilityService.getValue(model, 'email'), 
	            contact_no: utilityService.getValue(model, 'contact_no'),
	            father_name: utilityService.getValue(model, 'father_name'),
	            mother_name: utilityService.getValue(model, 'mother_name'),
	            skill: utilityService.getValue(model, 'skill'),
	            education: utilityService.getValue(model, 'education'),
	            work_expirence: utilityService.getValue(model, 'work_expirence')
	        }
	    };

        this.buildFormModel = function(model) {
            return {
                form: {
                    _id : utilityService.getValue(model,'_id'),
                    name: utilityService.getValue(model,'name'),
                    description: utilityService.getValue(model,'description'),
                    isVerified: utilityService.getValue(model,'verified', false)
                }
            }
        };

        this.buildQuestionModel = function(model) {
            return utilityService.getInnerValue(model, 'form_detail', 'questions',[])

        };

        this.buildQuestionPayload = function(questionList,form) {
            var payload = { 
                form_id : form._id
            };
            angular.forEach(questionList, function(value, key) {
                if(!value.isConditional) {                  
                    payload["question_" + value._id] = (value.question_type == FORM_BUILDER.questionType.date)
                        ? utilityService.dateFormatConvertion(value.answer)
                            : (value.question_type == FORM_BUILDER.questionType.time) 
                            	? utilityService.convertTimeInStandardForms(value.answer)
                            		: payload["question_" + value._id] = value.answer;                                      
                }  
                if(value.isConditional && value.isChoosen) {                  
                    payload["question_" + value._id] = (value.question_type == FORM_BUILDER.questionType.date)
                        ? utilityService.dateFormatConvertion(value.answer)
                            : (value.question_type == FORM_BUILDER.questionType.time) 
                            	? utilityService.convertTimeInStandardForms(value.answer)
                            		: payload["question_" + value._id] = value.answer;                                      
                }
            });
            return payload;
        };
         

	    this.formatTime = function(time) {
             if(angular.isDefined(time) && angular.isDefined(time.getHours()) && angular.isDefined(time.getMinutes())){
                 return time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
             }
        };

	    this.buildDynamicPayloadForSetupField = function(item,self){
            var payload = {};
            angular.forEach(item,function(v,k){
                if(v.field_type == 14){
                    angular.forEach(v.child_detail,function(value,key){
                        if(value.field_type == 14){
                            angular.forEach(value.child_detail,function(value2,key2){
                                payload[value2.slug] = value2.value;
                            })
                        }else if(value.field_type == 5 && value.value  && value.value != "NaN/NaN/NaN"){
                            payload[value.slug] = utilityService.dateFormatConvertion(value.value);
                        }else if(value.field_type == 6){
                            payload[value.slug] = selfServive.formatTime(value.value);
                        }else if(value.format_type == 1 || value.field_type==10){
                            if(value.value != null) {
                                 payload[value.slug] = value.value.toString();
                            }
                        }
                        else{
                            payload[value.slug] = value.value;
                        }                  
                    })
                }else if(v.field_type == 13 && self){
                    angular.forEach(self.value,function(val,ke){
                        var values = [];
                        angular.forEach(val,function(result,index){
                            values.push(result.id);
                        })
                        payload[ke] = values;
                    })
                }else if(v.field_type == 5 && v.value && v.value != "NaN/NaN/NaN"){
                    payload[v.slug] = utilityService.dateFormatConvertion(v.value);
                }else if(v.field_type == 6){
                    payload[v.slug] = selfServive.formatTime(v.value);
                }else if(v.format_type == 1 || v.field_type == 10){
                    if(v.value != null) {
                        payload[v.slug] = v.value.toString();
                    }
                }else{
                    payload[v.slug] = v.value;
                }
            })
            return payload;
        };

	    this.buildPersonObject = function() {
	    	return {
	            name: "HR Person",
	            email: "hr@qandle.com",
	            subject: "Offer Letter Related Concern"
	        }
	    };

        return this;
        
	}
]);