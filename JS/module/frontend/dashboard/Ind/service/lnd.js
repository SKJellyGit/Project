app.service('MyLndService',['utilityService','FORM_BUILDER',function (utilityService,FORM_BUILDER) {
    
    this.url={
        employeeSummary:'LND-frontend/event_details',//GET ?search=7,14,21,30 default null
        eventCount:'LND-frontend/event-count', //GET ?search=7,14,21,30 default 7
        getTrainingList:'LND-frontend/relevance-training/1/1',//GET
        cancelRequest:'training-manager/training-request',//PATCH
        makeRegisterRequest:'LND-frontend/training/request',//POST
        getTraining:'LND-frontend/training-details/',//GET
        showFeedback:'LND-frontend/show-feedback',//GET
        saveFeedback:'LND-frontend/save-feedback'//
    }

    this.getUrl=function (path) {
        return getAPIPath() +this.url[path]
    }
    
    
    var self=this


    this.buildGetSummaryPayload=function () {
        return{
            employeeSummary:null,
            eventCount:7
        }
    }

    this.buildEmployeeSummary=function (model) {
        return{
            attended: utilityService.getValue(model,'attended',0), 
            assessed: utilityService.getValue(model,'assessed',0), 
            certified: utilityService.getValue(model,'certified',0), 
            completed: utilityService.getValue(model,'completed',0)
        }
    }

    this.buildEventCount=function (model) {
        return{
            inprogress: utilityService.getValue(model,'inprogress',0),
            upcoming: utilityService.getValue(model,'upcoming',0),
        }
    }
    this.buildTrainingHash=function (model) {
        var trainings=[]
        model.map(function (training) {
            if(training.attributes && training.details  )
            {
                var trainingId=training.details._id
                var training_data={}
                
                
                
                training_data._id=trainingId
                // training_data.typeId=training.details.training_type_id
                training_data.training_name=training.details.training_name
                training_data.training_description=training.details.training_description
                training_data.start_date=training.details.start_date
                training_data.end_date=training.details.end_date
                training_data.allocated_seats=training.allocated_quantity
                training_data.seating_mode=training.details.capacity
                training_data.total_seats=training.details.capacity_limit
                training_data.workflow=training.details.workflow
                training_data.can_nominate=training.details.can_employee_nominate
                training_data.certificationAction=training.details.action_on_separation
                training_data.request_status=training.request_status
                training_data.request_id=training.request_status!==0?training.request_id:null
                training_data.available_seats=training.available_quantity
                training_data.marks_received=training.training_marks?training.training_marks:null
                training_data.can_give_feedback=training.can_give_feedback
                training_data.feedback_template=training.details.feedback_template_id
                training_data.owner_name=training.details && training.details.manager_details && training.details.manager_details[0] ?training.details.manager_details[0].full_name:null
                training_data.owner_avatar=training.details && training.details.manager_details && training.details.manager_details[0] ?training.details.manager_details[0].profile_pic:null
                var attrHash={
                    training_type:training.details.attributes[1]._id.$id,
                    instructor_name:training.details.attributes[2]._id.$id,
                    instructor_bio:training.details.attributes[3]._id.$id,
                    instructor_email:training.details.attributes[4]._id.$id
                }
                training_data.training_type=training.attributes[0].attributes[attrHash.training_type]
                training_data.instructor_name=training.attributes[0].attributes[attrHash.instructor_name]
                training_data.instructor_bio=training.attributes[0].attributes[attrHash.instructor_bio]
                training_data.instructor_email=training.attributes[0].attributes[attrHash.instructor_email]
                
                trainings.push(training_data)
                
            }
             
            
        })
        return trainings
    }    


    

    this.buildFeedbackPayload = function(questionList,detailsId,trainingTypeId) {
        var payload = {  };
         payload._id=detailsId
         payload.training_type_id=trainingTypeId
         
         angular.forEach(questionList, function(value, key) {
             //if(!value.isConditional) { 	
                  payload["question_" + value._id] = (value.question_type == FORM_BUILDER.questionType.date)
                        ? utilityService.dateFormatConvertion(value.answer)
                        : (value.question_type == FORM_BUILDER.questionType.time) 
                        ? utilityService.convertTimeInStandardForms(value.answer)
                        : payload["question_" + value._id] = value.answer;
                  payload['question_type_'+value._id]=value.question_type
             //} 				
         });
         return payload;
    };
    
     

    this.buildTrainingDetails=function (model) {

        var attrHash={
            training_type:model.attribute_details[1]._id,
            instructor_name:model.attribute_details[2]._id,
            instructor_bio:model.attribute_details[3]._id,
            instructor_email:model.attribute_details[4]._id
        }
        return{
            training_name:utilityService.getValue(model,'training_name',''),
            training_description:utilityService.getValue(model,'training_description',''),
            start_date:utilityService.getValue(model,'start_date',null),
            end_date:utilityService.getValue(model,'end_date',null),
            assessment_url:utilityService.getValue(model,'assesment_url',''),
            training_type:utilityService.getValue(model.attributes,attrHash['training_type'],null),
            instructor_name:utilityService.getValue(model.attributes,attrHash['instructor_name'],null),
            instructor_bio:utilityService.getValue(model.attributes,attrHash['instructor_bio'],null),
            instructor_email:utilityService.getValue(model.attributes,attrHash['instructor_email'],null),
            manager_name:utilityService.getValue(model.training_manager[0],'full_name',''),
            manager_avatar:utilityService.getValue(model.training_manager[0],'profile_pic',''),
            additionalAttributes:self.getAdditionalAttributes(model.attribute_details,model.attributes)
        }
    }

    //This will be called at every success-callback
    this.buildNominateModalViewPayload=function (model,training) {
        return {
            selected:[],
            selected_training:training,
            team_members:utilityService.getValue(model,'data',[])
        }
    }
    this.buildNominateRequestPayload=function (model) {
        var payload=[]
        model.selected.map(function (team_member) {
            payload.push({
                employee_id:team_member._id,//user_id or _id
                request_type:model.selected_training.request_type,
                workflow_id:model.selected_training.workflow_id,
                training_type_id:model.selected_training.training_type_id,
                requested_quantity:model.selected_training.requested_quantity
            })
        })
         
        return payload
    }

    this.buildTrainingTypes=function () {
        return{
            1:'Classroom',
            2:'Self',
            3:'Virtual Classroom'
        }
    }

    this.convertTimeStamp = function (stamp) {
        return {
            date:utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[0],
            time:utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[1]+' '+utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[2]
        };
    }

    this.getAdditionalAttributes=function (attrDetails,attrValues) {
        var additionalAttributes=[]
        
        attrDetails.slice(5,attrDetails.length).map(function (item) {
            var attrObj={}
            
            attrObj.key=item.attribute_name
            attrObj.type=item.field_type.field_type
            attrObj.value=attrValues[item._id]
            additionalAttributes.push(attrObj)
        })
        console.log(additionalAttributes)
        return additionalAttributes
    }



}])