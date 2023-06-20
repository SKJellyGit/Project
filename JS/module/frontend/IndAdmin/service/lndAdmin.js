app.service('LndAdminService', [
    'utilityService',
    function (utilityService) {
        'use strict';

        var self=this
        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        this.url = {
            summary:'LND-admin/summary',
            getTrainingList: "LND-admin/training/listing",
            getTrainingDetails:"LND-frontend/training-details/",
            downloadMarksCsv:"LND-admin/download-assign-marks/",
            uploadMarksCsv:"LND-admin/upload-training-marks/",
            getCertificateProperties:"letters/types/child/lnd/17",   //GET
            getCertificateTemplates:"letters/templates/18", //{training_type_id} //GET
            assignCertificateLetter:"LND-admin/assign-certificate-letter/", //{template_id}/{type_id}/{emp_id}            
            getTrainingAttendees:"LND-admin/training/attended/",// {training_type_id} GET
            getTrainingAttendence:"LND-admin/download-attendance/",
            uploadTrainingAttendance:"LND-admin/upload-training-attendance/",
            viewUploadedMarks:"LND-admin/show-marks/",
            viewUploadedAttendance:"LND-admin/show-attendance/",
            viewEmployeeFeedback:'LND-admin/show-admin-feedback/',
            viewAttendees:'LND-admin/training-attendant',
            downloadBulkCsv:'LND-admin/cert-csv',
            validateBulkCsv:'LND-admin/validate-cert-csv',
            assignBulkCertificate:'LND-admin/assign-cert-csv'// {template_id}/{training_type_id}
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };      

        this.buildSummaryPayload=function () {
            return{
                ue:7,
                ec:7,
                ci:7,
                fr:7
            }
        }

        this.buildSummary=function (model) {
            return{
                upcoming: utilityService.getValue(model,'upcoming',0),
                conducted: utilityService.getValue(model,'conducted',0),
                certificates_issued: utilityService.getValue(model,'cert',0),
                feedback: utilityService.getValue(model,'feedback',0),
            }
        }
        
        this.buildTrainingModel = function (model) {
            var trainingModel = {
                _id: utilityService.getValue(model, '_id'),
                training_name: utilityService.getInnerValue(model ,'training_details','training_name'),
                description: utilityService.getInnerValue(model ,'training_details','training_description'),
                instructor: this.resolveAtributes(utilityService.getInnerValue(model, 'attributes','attributes'), 2),
                training_type: this.resolveAtributes(utilityService.getInnerValue(model, 'attributes','attributes'), 1),
                startDate: utilityService.getInnerValue(model ,'training_details','start_date'),
                endDate: utilityService.getInnerValue(model ,'training_details','end_date'),
                owner: this.displayDetailCreator(utilityService.getInnerValue(model ,'training_details','manager_details')) ,
                attachments: utilityService.getValue(model, 'attachments'),
                totalQuantity: utilityService.getValue(model, 'total_quantity'),
                seating_mode:utilityService.getInnerValue(model,'training_details', 'capacity',null),
                personAttended: utilityService.getValue(model, 'allotted_quantity'),
                certificateAction:utilityService.getInnerValue(model,'training_details', 'action_on_separation',null),
                can_view_feedback:utilityService.getInnerValue(model,'training_details','can_view_feedback',false),
                can_view_marks:utilityService.getInnerValue(model,'training_details','can_view_marks',false),
                can_view_attendance:utilityService.getInnerValue(model,'training_details','can_view_attendance',false),
                can_assign_certificate:utilityService.getInnerValue(model,'training_details','can_assign_certificate',false),
                total_marks:utilityService.getInnerValue(model,'training_details','total_marks',100),
                is_sign_non_mandatory:utilityService.getInnerValue(model,'training_details','is_sign_non_mandatory',false),
                endDatePassed:utilityService.getInnerValue(model,'training_details','can_view_marks',false) // 
            };

            return trainingModel;
        };

        this.buildDetailsModel=function () {
            return {
                currentTraining:null,
                currentDetailsMode:null,
                listingData:null,
                filteredListingData:null,
                csvData:null,
                trainings:[]
            }
        }

        this.buildEmployeeFeedbackHash=function (model) {
             
            var responseHeaders=['Employee Code','Employee Name']
            var responses=[]
            model[0].questions.map(function (question) {
                responseHeaders.push(question.question_detail.question)
            })
            model.map(function (item) {
                var temp=[]
                temp.push(item.employee.emp_code)
                temp.push(item.employee.full_name)
                
                item.questions.map(function (question) {
                    
                    temp.push(question.question_detail.answer)
                })
                responses.push(temp)
            })

            return {
                responseHeaders:responseHeaders,
                responses:responses
            }
        }

        this.createParsedData=function (data) {
            var csvErrors={}
            console.log(data)
            Object.keys(data).map(function (rowNum) {
                       var row=data[rowNum]
                        for(var i=0;i<Object.keys(row).length;i++)
                        {
                            var value=row[Object.keys(row)[i]]
                            if(value.error.length!==0)
                            {
                                csvErrors[rowNum]=row
                                break
                            }
                        }
                         
                  })
            return csvErrors
        }

        this.buildAssignCertificateModel=function (properties,templates,employees) {
            var certification_model={}
            certification_model['templates']=[]
            certification_model['signing_authorities']=[]
            certification_model['employees']=[]
            
            templates.map(function (template){
                certification_model['templates'].push({
                    _id:template._id,
                    name:template.title,
                    status:template.status
                })
            })
            properties[0].signature_setup.map(function (authority) {
                certification_model['signing_authorities'].push({
                    _id:authority._id.$id,
                    name:authority.full_name
                })
            })

            if(employees)
            {
                employees.map(function (employee) {
                    certification_model['employees'].push({
                        _id:employee._id,
                        name:employee.full_name,
                        pic:employee.profile_pic,
                        employee_code:employee.personal_profile_employee_code
                    })
                })
            }

            return certification_model
        }

        this.buildAssignCertificatePayload=function (trainingTypeId) {
            var certification_payload={
                training:trainingTypeId,
                template:null,
                signing_authority:null,
                employee:null
            }
            return certification_payload
        }

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
        

        this.displayDetailCreator = function (data) {
            var item = data[0];
            return {
                avatar: item.profile_pic,
                name: item.full_name
            }
        }

        this.converTimeStamp = function (stamp) {
            return utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ');
        }

        this.resolveAtributes = function (attribute, index) {
            return Object.values(attribute)[index];
        }

        this.extractId = function (id) {
            var _id = angular.isObject(id) ? id.$id : id;
            return _id;
        };

        this.buildTrainingType = function () {
            return {
                1: "Classroom",
                2: "Self",
                3: "Virtual Classroom"
            }
        }

        this.buildBulkAssignModel=function (model) {
            return{
                trainingTypeId:utilityService.getValue(model,'lndId',null),
                signing_authority:utilityService.getValue(model,'signing_authority',null),
                templateId:utilityService.getValue(model,'templateId',null),
                signature_mandatory:utilityService.getValue(model,'signature_mandatory',null),
                uploadValidation:{},
                attachedCsv:null,
                canAssign:false,
                uploadValidationResponse:null,
                assigning:false
            }
        }

        this.buildBulkUploadValidation=function (response) {

            var bulkErrCount=0
                var data=[]
                var maxLen=0
                angular.forEach(response, function (val, key) {
                    data.push(val);
                    var tempLen=0
                    angular.forEach(val, function (v, k) {
                        if (angular.isDefined(v.error) && v.error.length) {
                            bulkErrCount += 1;
                        }
                        tempLen+=1
                    });
                    if(tempLen>maxLen)
                    {
                        maxLen=tempLen
                    }
                });
                

                var totalBulkRecords = data.length;
                var bulkAlphIndex = [];
                // debugger;
                
                // var len = Object.keys(data[0]).length;
                for (var i = 0; i < maxLen; i++) {
                    if (i > 25) {
                        bulkAlphIndex.push("A" + alphabets[(i % 25) - 1]);
                    } else {
                        bulkAlphIndex.push(alphabets[i]);
                    }
                }
                var bulkFlag = true;
                var tableRecords=[]
                

                return {
                    errCount:bulkErrCount,
                    totalRecords:totalBulkRecords,
                    alphaIndex:bulkAlphIndex,
                    flag:bulkFlag,
                    // tableHeaders:Object.values(response[0]).map(function (record) {
                    //     return record.name
                    // }),
                    tableRecords:response
                }
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
        
    }
]);