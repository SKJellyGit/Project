app.controller('LndAdminController', [
    '$scope', '$q', '$timeout', 'LndAdminService', 'utilityService', 'ServerUtilityService','$modal','$location' , '$routeParams', 
    function ($scope, $q, $timeout, lndAdminService, utilityService, ServerUtilityService,$modal,$location,$routeParams) {
     
         //lnd_admin_training_listing

        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

        var self=this
        $scope.minDate=new Date()
        $scope.updatePaginationSettings('lnd_admin_training_listing')
        $scope.updatePaginationSettings('lnd_admin_training_marks_listing')
        $scope.updatePaginationSettings('lnd_admin_training__attendance_listing')
        $scope.updatePaginationSettings('lnd_admin_training_feedback_listing')
        $scope.mainTab = 1;
        $scope.loadingData=false
        $scope.setMainTab = function (tab, key){
            $scope.mainTab = tab;
        };
        $scope.durationParams=[7,14,21,30]
        $scope.trainingsVisible=false
        $scope.trainings=[]
        $scope.filteredTrainings=[]
        $scope.loadingTab=false
        $scope.trainingTypes=lndAdminService.buildTrainingType()
        $scope.detailsModel=lndAdminService.buildDetailsModel()
        $scope.bulkAssignModel=lndAdminService.buildBulkAssignModel($routeParams)
        
        $scope.detailsModel.csvData=null
        
        var csvHeaders=[]

        $scope.summary=null
        $scope.summaryPayload=lndAdminService.buildSummaryPayload()
        $scope.getSummary=function () {
            var url=lndAdminService.getUrl('summary')
            var params=$scope.summaryPayload
            $scope.summaryLoading=true
            $scope.summary=null
            ServerUtilityService.getWebService(url,params).then(function (response) {
                if(response.status=='success')
                {
                    $scope.summary=lndAdminService.buildSummary(response.data)
                    $scope.summaryLoading=false
                }
                else
                {
                    $scope.summary=null
                    $scope.summaryLoading=false
                }
            })
        }

        $scope.getSummary()




        var viewUploadedMarks=function (trainingTypeId) {
            ServerUtilityService.getWebService(lndAdminService.getUrl('viewUploadedMarks')+trainingTypeId).then(
                
                function (data) {
                    console.log(data)
                    if(data.status=='success')
                    {
                        successErrorCallback(data.status,data,'view_uploaded_marks')
                    }
                    else if(data.status=='error')
                    {
                        successErrorCallback(data.status,data,'view_uploaded_marks')
                    }
                    else if(data.data.status=='error')
                    {
                        successErrorCallback(data.data.status,data.data,'view_uploaded_marks')
                    }
                }
            )
        }

         
        $scope.currentTab={
            inputTab:0
        }
        $scope.navigateTabs=function (tabIndex,training) {

                
                $scope.detailsModel.listingData=null
                $scope.detailsModel.filteredListingData=null
                $scope.detailsModel.csvData=null
                
                if(training)
                {
                    $scope.detailsModel.currentTraining=training               
                }
                else
                {
                    $scope.detailsModel.currentTraining=null
                }
                $scope.detailsModel.currentDetailsMode=null
                $scope.currentTab.inputTab=tabIndex
                
        }

            

        $scope.renderDetails =function (training,trainingMode) {
            $scope.loadingData=true
            if(training)
            {
                if(trainingMode==1)
                {
                    $scope.detailsModel.listingData=[]
                    $scope.detailsModel.filteredListingData=[]
                    $scope.detailsModel.csvData=[]
                    $scope.listingHeaders=['Employee Code','Employee Name','Marks Secured'+'(Out of '+training.total_marks+')']
                    csvHeaders=['Employee Code','Employee Name','Marks Secured']    
                    viewUploadedMarks(training._id)
                }
                else if(trainingMode==2)
                {
                    $scope.detailsModel.listingData=[]
                    $scope.detailsModel.filteredListingData=[]
                    $scope.detailsModel.csvData=[]
                    $scope.listingHeaders=['Employee Code','Employee Name','Total Present'] //Add dates to Remaining Columns
                    csvHeaders=['Employee Code','Employee Name','Total Present']
                    viewUploadedAttendance(training._id)
                }
                else if(trainingMode==3)
                {
                    // viewEmployeeFeedback(training._id)
                    $scope.detailsModel.listingData=[]
                    $scope.detailsModel.filteredListingData=[]
                    $scope.detailsModel.csvData=[]
                    $scope.listingHeaders=['Employee Code','Employee Name'] //Add dates to Remaining Columns
                    csvHeaders=['Employee Code','Employee Name']
                    viewEmployeeFeedback(training._id)

                }
            }
            else
            {
                utilityService.showSimpleToast('Select a training first')
            }
        }


        $scope.filter={
            keyWordSearch:{
                name:{
                    training_name:''
                }
            },
            type:{
                training_type:''
            },
            sort:{
                propertyName:'',
                reverse:false
            }
            
        }

        $scope.resetTrainingFilter=function () {
            $scope.filter.keyWordSearch.name={training_name:''}
            $scope.filter.type={training_type:''}
            $scope.filter.sort.propertyName=''
            $scope.filter.sort.reverse=false
        }

        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };

        $scope.dateRangeFilter=function (data,start_date,end_date) {
           
            var modifiedStartDate=new Date(start_date).getTime()
            var modifiedEndDate=new Date(end_date).getTime()
            
            if(isNaN(modifiedStartDate) || isNaN(modifiedEndDate))
            {
                return data
            }
            else
            {

                var newData=data.filter(function (item,index) {
                    return item.startDate>=modifiedStartDate || item.endDate<=modifiedEndDate
                })
                return newData
            }
        }

        $scope.viewAttendeeList=function ($event,training) {
            $event.stopPropagation();
            $scope.attendeeList=[]
            if(training.personAttended>0)
            {
                ServerUtilityService.getWebService(lndAdminService.getUrl('viewAttendees')+'/'+training._id).then(function (response) {
                    $scope.attendeeList=response.data
                    $scope.openModal('viewLndAttendees','view-lnd-attendees.html','md')
                })
            }
            else
            {
                utilityService.showSimpleToast('No '+(training.endDatePassed?'Attendees':'Enrolled Employees')+' for '+training.training_name)
            }
        }

        $scope.openDetailsPage=function (id,$event) {
            $event.stopPropagation();
            $scope.detailsLoading=true
            ServerUtilityService.getWebService(lndAdminService.getUrl('getTrainingDetails')+id)
            .then(
                function (data) {
                    $scope.detailsLoading=false
                    $scope.detailsTraining=lndAdminService.buildTrainingDetails(data.data)
                },
                function (err) {
                    $scope.detailsLoading=false
                }
            )
            
            $scope.openModal('lndDetailsAdmin','lnd-details-admin.tmpl.html')
            
        }


        $scope.openCertificateTemplateChooser=function (trainingTypeId,mode) {
            $scope.lndCertificatePayload=lndAdminService.buildAssignCertificatePayload(trainingTypeId)
            var certificatePropertiesCall=ServerUtilityService.getWebService(lndAdminService.getUrl('getCertificateProperties'))
            var certificateTemplatesCall=ServerUtilityService.getWebService(lndAdminService.getUrl('getCertificateTemplates')+'?trainingTypeId='+trainingTypeId)
            var trainingAttendeesCall=ServerUtilityService.getWebService(lndAdminService.getUrl('getTrainingAttendees')+trainingTypeId)
            $scope.certificateAssignmentMode=mode
            
                $q.all([certificatePropertiesCall,certificateTemplatesCall,trainingAttendeesCall]).then(
                    function (responses) {
                        console.log(responses)
                        var certificateProperties=responses[0].data
                        var certificateTemplates=responses[1]
                        var trainingAttendees=responses[2]
                        
                        if(trainingAttendees.status=='success' && trainingAttendees.data.length!==0 && certificateTemplates.status=='success' && certificateTemplates.data && certificateTemplates.data.length!==0)
                        {
                            
                            if(mode=='individual')
                            {

                                $scope.lndCertificate= lndAdminService.buildAssignCertificateModel(certificateProperties,certificateTemplates.data,trainingAttendees.data)
                            }
                            else
                            {
                                $scope.lndCertificate= lndAdminService.buildAssignCertificateModel(certificateProperties,certificateTemplates.data,null)
                            }
                            
                            $scope.openModal('lndAdminCertificateAssign','lnd-admin-certificate-assign.tmpl.html','sm')
                        }
                        
                        else
                        {
                            if(trainingAttendees.status=='error')
                            {
                                // utilityService.showSimpleToast('No attendees found')
                                errorCallback(trainingAttendees,'open_certificate_chooser')
                            }
                            if(!certificateTemplates || certificateTemplates.length==0)
                            {
                                utilityService.showSimpleToast('No Certificate Templates found') 
                            }
                        }
                    }
                )
            
             
            
        }

        

        $scope.startCertificateAssignment=function (mode) {
            if(mode==='individual')
            {
                var payload=[]
                payload.push({
                    letter_id:$scope.lndCertificatePayload.template,
                    sign_authority:$scope.lndCertificatePayload.signing_authority
                })
                var url=lndAdminService.getUrl('assignCertificateLetter')+$scope.lndCertificatePayload.template+'/'+$scope.lndCertificatePayload.training+'/'+$scope.lndCertificatePayload.employee
                ServerUtilityService.putWebService(url,{letter_detail:payload}).then(function () {
                    navigateToCertificateTrigger($scope.lndCertificatePayload.template,
                        $scope.lndCertificatePayload.employee,
                        $scope.lndCertificatePayload.training,
                       )    
                })
            }
            else
            {
                $location.url('frontend/lnd/bulk-assign').search({
                    lndId:$scope.detailsModel.currentTraining._id,
                    signing_authority:$scope.lndCertificatePayload.signing_authority,
                    templateId:$scope.lndCertificatePayload.template,
                    signature_mandatory:$scope.detailsModel.currentTraining.is_sign_non_mandatory?1:2
                })
            }
            
        }

        $scope.downloadFormat=function (mode,trainingId) {
            if(mode==1)
            {
                downloadMarksCSV(trainingId)
            }
            else if(mode==2)
            {
                downloadTrainingAttendence(trainingId)
            }
        }

        var downloadMarksCSV=function(training_type_id){
            ServerUtilityService.getWebService(lndAdminService.getUrl('downloadMarksCsv')+training_type_id)
            .then(
                function(data){
                    successErrorCallback(data.status,data,'download_marks_csv')
                }
            )
        }

        var downloadTrainingAttendence=function (trainingTypeId) {
            ServerUtilityService.getWebService(lndAdminService.getUrl('getTrainingAttendence')+trainingTypeId).then(function (data) {
                successErrorCallback(data.status,data,'download_trainining_attendance_csv')
            })
        }

        $scope.attachCsv=function(file,training_type_id,upload_mode){
            $scope.duplicatesAlert=null
            if(upload_mode==1)
            {
                $scope.marksCsv=file
                uploadMarksCsv(file,training_type_id)
            }
            else if(upload_mode==2)
            {
                $scope.attendanceCsv=file
                uploadAttendanceCsv(file,training_type_id)
            }
        }


        var uploadMarksCsv=function(file,training_type_id){
            
            var payload={}
            payload.upload_csv=file
            payload.training_type_id=training_type_id
            if(payload.upload_csv)
            {
                ServerUtilityService.uploadWebService(lndAdminService.getUrl('uploadMarksCsv')+training_type_id,payload)
                .then(
                function(data){

                    // console.clear()
                    // console.log('HERE',data)
                    if(data.status=='success' || data.status=='error')
                    {
                        successErrorCallback(data.status,data,'upload_marks_csv',true,1,training_type_id)
                        $scope.marksCsv=null
                    }
                    else if(data.data.status=='success' || data.data.status=='error')
                    {
                        successErrorCallback(data.data.status,data.data,'upload_marks_csv',true,1,training_type_id)
                        $scope.marksCsv=null
                    }
                }
            )
            }
        }

        var uploadAttendanceCsv=function(file,training_type_id){
            
            var payload={}
            payload.upload_csv=file
            payload.training_type_id=training_type_id
            if(payload.upload_csv)
            {
                ServerUtilityService.uploadWebService(lndAdminService.getUrl('uploadTrainingAttendance')+training_type_id,payload)
                .then(
                function(data){
                    // console.clear()
                    // console.log('HERE',data)
                    if(data.status=='success' || data.status=='error')
                    {
                        successErrorCallback(data.status,data,'upload_attendance_csv',true,2,training_type_id)
                        $scope.attendanceCsv=null
                    }
                    else if(data.data.status=='success' || data.data.status=='error')
                    {
                        successErrorCallback(data.data.status,data.data,'upload_attendance_csv',true,2,training_type_id)
                        $scope.attendanceCsv=null
                    }
                }
            )
            }
        }

        $scope.assignCertificateMessage=function (currentTraining) {
            
            switch(currentTraining.certificationAction)
            {
                case '3':
                    if(currentTraining.can_assign_certificate)
                    {
                        return 'End date not crossed'
                    }
                    else
                    {
                        return 'This training does not support certifcates'
                    }
                
            }
        }

        var navigateToCertificateTrigger=function (template,employee,trainingTypeId) {
            $location.url('/template-consumer').search({
                template:template,
                refUrl:'lnd',
                empId:employee,
                typeId:trainingTypeId
            })
        }

        $scope.openModal = function(instance, templateUrl,size) {
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope:$scope,
                windowClass:'fadeEffect',
                size:size || 'lg'
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };

        

        $scope.convertTimeStamp = function (stamp) {
            return {
                date:utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[0],
                time:utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[1]+' '+utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[2]
            };
        }

        $scope.openUrlInOtherTab=function (url) {
            window.open(addHttpPrefix(url),'_blank')
        }

        var successErrorCallback = function (_status,data,tag,rerender,mode,trainingTypeId) {
             
            if(tag!=='download_marks_csv')
            {
                _status === "success" ?  successCallback(data,tag,rerender,mode,trainingTypeId) : errorCallback(data,tag);
            }
            else if(tag=='download_marks_csv' && data.status=='success')
            {
                data.data!==null? successCallback(data,tag):errorCallback(data,tag)
            }
            else if(tag=='download_marks_csv' && data.status=='error')
            {
                errorCallback(data,tag)
            }
            else if(tag==='download_trainining_attendance_csv')
            {
                data.data!=null?successCallback(data,tag):errorCallback(data,tag)
            }
        };

     

        var addHttpPrefix=function (url) {
            var regex=/^http/
            if(regex.test(url))
            {
                return url
            }
            else
            {
                return 'https://'+url
            }
        }

        var successCallback = function (data,tag,rerender,mode,trainingTypeId) {
            if(tag=='training_list')
            {
                var trainings=[]
                angular.forEach(data.data, function (value, key) {
                    var transformedData = lndAdminService.buildTrainingModel(value);
                    // $scope.detailsModel.trainings.push(transformedData);
                    trainings.push(transformedData)
                });
                $scope.trainings=trainings
                $scope.trainingsVisible=true

                if(rerender)
                {
                     $scope.loadingTab=false
                     $scope.detailsModel.currentTraining=$scope.trainings.filter(function (tr) {
                         return tr._id==trainingTypeId
                     })[0]
                    if(mode===1)
                    {
                        $scope.detailsModel.listingData=[]
                        $scope.detailsModel.csvData=[]
                        // $scope.listingHeaders=['Employee Code','Employee Name','Marks Secured']
                        // csvHeaders=['Employee Code','Employee Name','Marks Secured']
                        
                        viewUploadedMarks(trainingTypeId)
                    }
                    else
                    {
                        $scope.detailsModel.listingData=[]
                        $scope.detailsModel.csvData=[]
                        // $scope.listingHeaders=['Employee Code','Employee Name','Total Present'] //Add dates to Remaining Columns
                        // csvHeaders=['Employee Code','Employee Name','Total Present']
                        viewUploadedAttendance(trainingTypeId)
                    }
                }
                
            }
            else if(tag=='download_marks_csv' || tag==='download_trainining_attendance_csv')
            {
                window.open(data.data)
            }
            else if(tag=='view_uploaded_marks')
            {
                
                parseToViewableData(data.data,'marks')

            }
            else if(tag=='upload_marks_csv' || tag=='upload_attendance_csv')
            {
                getTrainingList(true,tag=='upload_marks_csv'?1:2,trainingTypeId)
            }
            else if(tag=='view_employee_feedback')
            {
                if(data.data.length===0)
                {
                    $scope.feedback_employees=[]
                    $scope.feedbackResponses={}
                    utilityService.showSimpleToast('No responses Found')
                    $scope.loadingData=false
                }
                else
                {
                    parseToViewableData(data.data,'feedback')

                }
                
            }
            else if(tag=='view_uploaded_attendance')
            {
                
                parseToViewableData(data.data,'attendance')
                               
            }
            else
            {
                utilityService.showSimpleToast(data.message)

            }            
        };

        var errorCallback = function (data,tag) {
            // console.log('here',data,tag)
            if(tag=='download_marks_csv' && data.data==null)
            {   
                utilityService.showSimpleToast("No attendees found")
            }
            else if((tag=='upload_marks_csv' && data.message=='data_invalid') || (tag=='upload_attendance_csv' && data.message=='data_invalid'))
            {
              getAlphaIndexing(data)
              $scope.parsedCsv= lndAdminService.createParsedData(data.data)
              
              $scope.openModal('errorUploadMarksLnd','error-upload-marks-lnd.html','lg') 
            }
            else if(tag=='open_certificate_chooser')
            {
                $scope.duplicatesAlert=data.message
                $scope.duplicatesTitle=data.error
                $('#training-duplicates').appendTo("body").modal('show');
            }
            else
            {
                if(tag=='upload_marks_csv' || tag=='upload_attendance_csv')
                {
                    $scope.duplicatesAlert=data.message
                    $scope.duplicatesTitle=data.error
                    $('#training-duplicates').appendTo("body").modal('show');
                }               
                else
                {
                    
                    utilityService.showSimpleToast(data.message)
                }
            }
            $scope.trainingsVisible=true
            $scope.loadingData=false
        };

        $scope.downloadData=function (data,detailsMode,currentTraining,mode) {
            var filename=''
            if(mode=='xlsx')
            {
                if(detailsMode==1)
                {
                    filename='training_marks_'+currentTraining.training_name.toLowerCase()+'.xlsx'
                }
                else if(detailsMode==2)
                {
                    filename='training_attendance_'+currentTraining.training_name.toLowerCase()+'.xlsx'
                }
                else
                {
                    filename='training_feedback_'+currentTraining.training_name.toLowerCase()+'.xlsx'
                }
                $timeout(function () {
                    utilityService.exportToExcel(data, filename);
                }, 1000);
            }
            else
            {
                 
                if(detailsMode==1)
                {
                    filename='training_marks_'+currentTraining.training_name.toLowerCase()+'.csv'
                }
                else if(detailsMode==2)
                {
                    filename='training_attendance_'+currentTraining.training_name.toLowerCase()+'.csv'
                }
                else
                {
                    filename='training_feedback_'+currentTraining.training_name.toLowerCase()+'.csv'
                }
                $timeout(function () {
                    utilityService.exportToCsv(data,filename );
                }, 1000);
            }
        }

        var parseToViewableData=function (data,mode) {       
            if(mode=='marks')
            {
               
                $scope.detailsModel.csvData.push(csvHeaders)
                data.map(function (item) {
                    var empRecord=[]
                
                    $scope.detailsModel.listingData.push({
                        employee_code:item.employee_detail.emp_code,
                        employee_name:item.employee_detail.full_name,
                        marks:item.training_marks
                    })
                    empRecord.push(item.employee_detail.emp_code,item.employee_detail.full_name,item.training_marks)
                   $scope.detailsModel.csvData.push(empRecord)
                })
                
            }
            else if(mode=='attendance')
            {
                $scope.listingHeaders=['Employee Code','Employee Name','Total Present']
                csvHeaders=['Employee Code','Employee Name','Total Present']
                
                data.dates.map(function (date) {
                    $scope.listingHeaders.push(date)
                    csvHeaders.push(date)
                })
                $scope.detailsModel.csvData.push(csvHeaders)

                data.employees.map(function (employee) {
                    var empRecord=[]
                    var empCsvRecord=[]
                    empRecord.push(employee.employee_detail.emp_code,employee.employee_detail.full_name)
                    empCsvRecord.push(employee.employee_detail.emp_code,employee.employee_detail.full_name)
                    var total_present=0
                    employee.employee_detail.attendance.map(function (attendance_status) {
                        if(attendance_status)
                        {
                            total_present+=1  
                        }
                    })
                    empRecord.push(total_present)
                    empCsvRecord.push(total_present)
                    employee.employee_detail.attendance.map(function (attendance_status) {
                        empRecord.push(attendance_status)
                        empCsvRecord.push(attendance_status?'Present':'Absent')
                    })
                    $scope.detailsModel.listingData.push(empRecord)
                    $scope.detailsModel.csvData.push(empCsvRecord)
                })
            }
            else
            {
                var feedback=lndAdminService.buildEmployeeFeedbackHash(data)
                $scope.listingHeaders=feedback.responseHeaders
                csvHeaders=feedback.responseHeaders
                $scope.detailsModel.listingData=feedback.responses
                $scope.detailsModel.csvData.push(csvHeaders)
                $scope.detailsModel.listingData.map(function (item) {
                    $scope.detailsModel.csvData.push(item)
                })
            }
            $scope.loadingData=false
        }

        $scope.getImagePath=function (name) {
            return getAPIPath() +'images/'+name
        }



        var viewUploadedAttendance=function (trainingTypeId) {
            ServerUtilityService.getWebService(lndAdminService.getUrl('viewUploadedAttendance')+trainingTypeId).then(function (data) {
                console.log(data)
                if(data.status=='success' && !(data.data.dates.length==0 || data.data.employees.length==0) )
                {
                    
                    successErrorCallback(data.status,data,'view_uploaded_attendance',true,2,trainingTypeId)
                }
                else if(data.status=='success' && (data.data.dates.length==0 || data.data.employees.length==0) )
                {
                    
                    utilityService.showSimpleToast('No Attendance Data Found')
                    $scope.loadingData=false
                }
                else if(data.status=='error')
                {
                    successErrorCallback(data.status,data,'view_uploaded_attendance')
                }
                else if(data.data.status=='error')
                {
                    successErrorCallback(data.data.status,data.data,'view_uploaded_attendance')
                }
            })
        }

       


        var viewEmployeeFeedback=function (trainingTypeId) {
            ServerUtilityService.getWebService(lndAdminService.getUrl('viewEmployeeFeedback')+trainingTypeId).then(function (data) {
                successErrorCallback(data.status,data,'view_employee_feedback')
            })
        }

        

        $scope.changeEmployeeFeedback=function (employeeId) {
            $scope.selectedFeedback=employeeId
        }

        var getAlphaIndexing = function (response,bulk) {
            if(bulk)
            {
                console.log(response.data)
                $scope.bulkAssignModel.uploadValidation=lndAdminService.buildBulkUploadValidation(response.data)
                console.log($scope.bulkAssignModel.uploadValidation)
            }
            else
            {
                $scope.errCount = 0;
                var data = [];
                angular.forEach(response.data, function (val, key) {
                    data.push(val);
                    
                    angular.forEach(val, function (v, k) {
                        if (angular.isDefined(v.error) && v.error.length) {
                            $scope.errCount += 1;
                        }
                    });
                });
                $scope.totalRecords = data.length;
                $scope.alphIndex = [];
                // debugger;
                var len = Object.keys(data[0]).length;
                for (var i = 0; i < len; i++) {
                    if (i > 25) {
                        $scope.alphIndex.push("A" + alphabets[(i % 25) - 1]);
                    } else {
                        $scope.alphIndex.push(alphabets[i]);
                    }
                }
                $scope.flag = true;
            }
        };



        var getTrainingList = function (rerender,mode,trainingTypeId) {
            $scope.trainingsVisible=false
            var url = lndAdminService.getUrl('getTrainingList')  + '/' + 3;
            if(rerender)
            {
                $scope.loadingTab=true
            }
            ServerUtilityService.getWebService(url).then(function(data) {
                successErrorCallback(data.status,data,'training_list',rerender,mode,trainingTypeId)
                
            });
        }
        getTrainingList();


        //Bulk Assign functions

        var bulkSuccessCallback=function (data,tag) {
            
        }

        $scope.downloadBulkCsv=function () {
            var url=lndAdminService.getUrl('downloadBulkCsv')+'/'+$scope.bulkAssignModel.templateId
            ServerUtilityService.getWebService(url).then(function (response) {
                if(response.status=='success')
                {
                    window.open(response.data)
                }
            })
        }
        

        // $scope.attachBulkCsv=function (file) {
            
            
        // }

        $scope.uploadBulkAssignCsv=function (file) {
            $scope.bulkAssignModel.attachedCsv=file
            var url=lndAdminService.getUrl('validateBulkCsv')+'/'+$scope.bulkAssignModel.templateId+'/'+$scope.bulkAssignModel.trainingTypeId
            var payload={}
            payload.cert_csv=file
            if(payload.cert_csv)
            {
                ServerUtilityService.uploadWebService(url,payload).then(function (response) {
                    if(response.status=='error' )
                    {
                       if(response.data.length>0)
                       {
                        getAlphaIndexing(response,true)
                        
                       }
                       else
                       {
                           
                        utilityService.showSimpleToast(response.message)
                       }
                       //$scope.bulkAssignModel.attachedCsv=null
                       $scope.bulkAssignModel.canAssign=false
                    }
                    else if(response.status=='success')
                    {
                        if(response.data.length>0)
                        {
                            getAlphaIndexing(response,true)
                            utilityService.showSimpleToast(response.message)
                        }
                        else
                        {
                            utilityService.showSimpleToast(response.message)
                        }
                        console.log(response.data)
                        $scope.bulkAssignModel.uploadValidationResponse=response.data
                        $scope.bulkAssignModel.canAssign=true
                    }
                    
                })
            }
            
        }
        //$routeParams.signature_mandatory => 1 :true
        //$routeParams.signature_mandatory => 2 :false
        $scope.assignBulkCertificate=function (){
            var url=lndAdminService.getUrl('assignBulkCertificate')+'/'+$scope.bulkAssignModel.templateId+'/'+$scope.bulkAssignModel.trainingTypeId
            var payload={}
            $scope.bulkAssignModel.assigning=true
            if($scope.bulkAssignModel.uploadValidationResponse)
            {
                
                payload={
                    csv_data:$scope.bulkAssignModel.uploadValidationResponse,
                    
                    signing_authority:$scope.bulkAssignModel.signing_authority
                }
                payload.is_sign_non_mandatory=$routeParams.signature_mandatory==1?true:false
                console.log(payload)
                ServerUtilityService.postWebService(url,payload).then(function (response) {
                    
                    if(response.status=='success')
                    {
                        utilityService.showSimpleToast($scope.bulkAssignModel.signing_authority?'Successfully sent certificates for approval by signing authority':'Successfully Assigned Certificates')
                        $scope.bulkAssignModel.assigning=false
                        // $timeout(function () {
                        //     $location.url('frontend/lnd')
                        // },1000)
                    }
                    else
                    {
                        $scope.bulkAssignModel.assigning=false
                    }
                })
            }
            else 
            {
                utilityService.showSimpleToast('No Csv attached')
            }
        }

        $scope.handleAdditionalAttribute=function (value,type) {
            switch(type)
            {
                case 5:return getAdditionalDate(value)
                case 6:return getAdditionalTime(value)
                default:return value
            }
        }
    
        var getAdditionalDate=function (date) {
            var vals=date.split('/').reverse().join('-')
            var timestamp=new Date(vals).getTime()
            return $scope.convertTimeStamp(timestamp).date
        }
    
        var getAdditionalTime=function (time) {
            return moment(time, 'HH:mm').format('hh:mm a') 
        }
    
        $scope.isClickable=function (type) {
            return type==8 //type==9
        }
    


    }
]);