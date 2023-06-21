app.service('NewHireManagementService', ['utilityService',        
	function (utilityService) {
		'use strict';

        var selfService = this;

        this.url = {	   
            getEmployee: 'employee/list',
            grplst : 'user-addition/all-mandatory-group',
            associate_fields : 'prejoin/frontend/associate_fields',
            allmandatorygroup : 'user-management/active/group?mandatory=true&field=true',
            associateFields : 'prejoin/associate_fields',
            offerletter: 'offer/template',
            newEmployee : 'user-addition/all-user?status=true',
            candidates : 'prejoin/frontend/candidates',
            finalizeOffer : 'prejoin/frontend/finalize-offer',
            settings: 'prejoin/setting?is_active=true',
            selectTemplate : 'prejoin/frontend/offer-letter-template',
            sendReferenceList : 'prejoin/frontend/offer-letter-template-html',
            removeTemplate : 'prejoin/frontend/remove-template',
            sendReminder : 'prejoin/frontend/send-reminder',
            history : 'prejoin/frontend/history',
            draftCandidates: 'prejoin/frontend/candidates?is_drafted=true',
            letterType : 'letters/types/prejoining/', 
            letterWithTemp : 'letters/types-with-templates/prejoining?status=true',
            saveAsDraft : 'prejoin/frontend/save-as-draft',
            revoke : 'prejoin/frontend/revoke-letter',
            retrigger : 'prejoin/frontend/retrigger-offers',
            bulkTrigger: 'prejoin/frontend/trigger-offers',
            removeDraft: 'prejoin/frontend/candidate/delete',
            downloadOffer: 'prejoin/candidate/download-letter',
            sendToOnboarding: 'prejoin/frontend/send-to-onboarding',
            actionAdmin: 'employee/module-permission',
            countryDialCodes: 'user-addition/dial-codes',
            modulePermission: 'employee/module-permission',
            doc: 'prejoin/candidate/allowed-document',
            updateDoc: 'prejoin/candidate/documents',
            modulePermission: 'employee/module-permission',
            uploadCsv : 'prejoin/frontend/csv',
            downloadCsv : 'prejoin/frontend/csv',
        };

        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildNewHire = function(model) {
            return {
                new_hire_plan : utilityService.getValue(model, 'new_hire_plan'),
                also_notify : utilityService.getValue(model, 'also_notify'),
                sign_auth : utilityService.getValue(model, 'sign_auth'),
                template : {
                    _id : utilityService.getValue(model, 'template')
                },
                offreLetterAttached : utilityService.getValue(model, 'offer_letter_attachment'),
                isDocumentUploaded : false,
                isLoaded : false
            };
        };
        this.buildActionObject = function() {
    	    return {
                    add: false,
                    edit: false
                }
        };
        this.buildOfferLetterStatus = function() {
            return {
                1 : {
                    label: 'Pending',
                    isChecked: false
                },
                2 : {
                    label: 'Offer Sent',
                    isChecked: false
                },
                3 : {
                    label: 'Rejected',
                    isChecked: false
                },
                8 : {
                    label: 'Offer Revoked',
                    isChecked: false
                }
            }
        };
        this.buildAcceptanceStatus = function(){
            return{
                4 : {
                        label: 'Pending acceptence',
                        isChecked: false,
                        reference: 4
                    },
                5 : {
                        label: 'Accepted',
                        isChecked: false,
                        reference: 5
                    },
                6 : {   
                        label : 'Rejected',
                        isChecked: false,
                        reference: 6
                    }, 
                8 : {
                    label: 'Offer Revoked',
                    isChecked: false
                }
                /* 7 : {
                   label: 'Query Raised',
                   isChecked: false,
                   reference: 7
                } */
            }
        };
        this.formatTime = function(time) {
            if(angular.isDefined(time) && angular.isDefined(time.getHours()) 
                && angular.isDefined(time.getMinutes())){
                return time.getHours() + ":" + (time.getMinutes() < 10 
                    ? "0" + time.getMinutes() : time.getMinutes());
            }
        };
        this.buildDynamicPayloadForDraftOffer = function(item,self,newHirePlan) {
            var payload = {};
            angular.forEach(item,function(v,k) {
                if(v.field_type == 14) {
                    angular.forEach(v.child_detail,function(value,key) {
                        if(value.value){
                            if(value.field_type == 14) {
                                angular.forEach(value.child_detail,function(value2,key2) {
                                    payload[value2.slug] = value2.value;
                                });
                            } else if(value.field_type == 5) {
                                payload[value.slug] = utilityService.dateFormatConvertion(value.value);
                            } else if(value.field_type == 6) {
                                payload[value.slug] = selfService.formatTime(value.value);
                            } else{
                                payload[value.slug] = value.value;
                            }     
                        }
                    });
                } else if(v.field_type == 13 && self) {
                    angular.forEach(self.value,function(val,ke) {
                        var values = [];
                        angular.forEach(val,function(result,index) {
                            values.push(result.id);
                        })
                        payload[ke] = values;
                    })
                } else if(v.field_type == 5) {
                    payload[v.slug] = utilityService.dateFormatConvertion(v.value);
                } else if(v.field_type == 6) {
                    payload[v.slug] = selfService.formatTime(v.value);
                } else if((v.format_type == 1 || v.field_type==10) && v.value != null) {
                    payload[v.slug] = v.value.toString();
                } else {
                    payload[v.slug] = v.value;
                } 
            })
            if(newHirePlan.new_hire_plan) {
                payload.new_hire_plan = newHirePlan.new_hire_plan;
            }
            
            return payload;
        };
        this.buildDynamicPayloadForTriggerOffer = function(item, self, newHirePlan) {
            var payload = {};
            angular.forEach(item,function(v,k) {
                if(v.field_type == 14){
                    angular.forEach(v.child_detail,function(value,key) {
                        if(value.field_type == 14) {
                            angular.forEach(value.child_detail,function(value2,key2) {
                                payload[value2.slug] = value2.value;
                            });
                        } else if(value.field_type == 5 && value.value  
                            && value.value != "NaN/NaN/NaN") {
                            payload[value.slug] = utilityService.dateFormatConvertion(value.value);
                        } else if(value.field_type == 6) {
                            payload[value.slug] = selfService.formatTime(value.value);
                        } else if(value.format_type == 1 || value.field_type==10) {
                            if(value.value != null) {
                                payload[value.slug] = value.value.toString();
                            }
                        } else {
                            payload[value.slug] = value.value;
                        }                  
                    });
                } else if(v.field_type == 13 && self) {
                    angular.forEach(self.value,function(val,ke) {
                        var values = [];
                        angular.forEach(val,function(result,index) {
                            values.push(result.id);
                        });
                        payload[ke] = values;
                    })
                } else if(v.field_type == 5 && v.value && v.value != "NaN/NaN/NaN") {
                    payload[v.slug] = utilityService.dateFormatConvertion(v.value);
                } else if(v.field_type == 6) {
                    payload[v.slug] = selfService.formatTime(v.value);
                } else if(v.format_type == 1 || v.field_type==10) {
                    if(v.value){
                        payload[v.slug] = v.value.toString();
                    }
                } else {
                    payload[v.slug] = v.value;
                }
            })
            if(newHirePlan.new_hire_plan){
                payload.new_hire_plan = newHirePlan.new_hire_plan;
            }
            payload.offer_letter_attachment = newHirePlan.offreLetterAttached;

            return payload;
        };
        this.buildFinalizeOfferPayload = function(item,self,id){
            var payload = {
                    sign_auth:item.signatory,
                    candidate_id: id
                },
                notifyId = [];

            angular.forEach(self,function(v,k){
                notifyId.push(v.id);
            });
            payload.also_notify = notifyId;

            return payload;
        };
	    
		return this;
	}
]);