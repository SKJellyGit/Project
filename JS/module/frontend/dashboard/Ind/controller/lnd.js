app.controller('MyLndController',['$scope','utilityService', 'ServerUtilityService','LeaveSummaryService','MyLndService','$modal','$routeParams','$location','FORM_BUILDER',function ($scope,utilityService, ServerUtilityService,summaryService,MyLndService,$modal,$routeParams,$location,FORM_BUILDER) {
    
    
    $scope.updatePaginationSettings('lnd_emp_training_listing')
    $scope.questionTypeConstant = FORM_BUILDER.questionType;
    var self=this
    var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);
    $scope.currentDate = null
    var buildGetParams = function() {
        var params = {
            rel_id: $scope.relationship.primary.model._id,
            direct_reportee: $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false
        };
        if(teamOwnerId) {
            params.emp_id = teamOwnerId;
        }
        return params;
    };
    var successCallback=function (data) {
        $scope.error_messages=[]
    }


    /* Summary start */
    $scope.summaryPayload= MyLndService.buildGetSummaryPayload()
    $scope.employeeSummary=null
    $scope.eventCount=null
    $scope.getEmployeeSummary=function () {
        var url= $scope.summaryPayload.employeeSummary?MyLndService.getUrl('employeeSummary')+'?search='+ $scope.summaryPayload.employeeSummary:MyLndService.getUrl('employeeSummary')
        $scope.employeeSummaryVisible=false
        ServerUtilityService.getWebService(url).then(function (response) {
            
            if(response.status=='success')
            {
                $scope.employeeSummary=MyLndService.buildEmployeeSummary(response.data)
                $scope.employeeSummaryVisible=true
            }
            else
            {
                $scope.employeeSummaryVisible=true
            }
        })

    }

    $scope.getEventCount=function () {
        var url=MyLndService.getUrl('eventCount')+'?search='+ $scope.summaryPayload.eventCount
        $scope.eventCountVisible=false
        ServerUtilityService.getWebService(url).then(function (response) {
            $scope.eventCount=MyLndService.buildEventCount(response.data)
            $scope.eventCountVisible=true
        })
    }

    $scope.getEmployeeSummary()
    $scope.getEventCount()

    $scope.resetTrainingSummary=function () {
        $scope.summaryPayload.employeeSummary=null
        $scope.getEmployeeSummary()
    }



    /* Summary end */

    var errorCallback = function (data, section) {
        if (data.status === "error") {
            $scope.errorMessages.push(data.message);
        } else {
            angular.forEach(data.data.message, function (value, key) {
                $scope.errorMessages.push(value[0]);
                $('#training-employee-register-alert').modal('hide');
            });
        }
    };


    $scope.openUrlInOtherTab=function (url) {
        window.open(addHttpPrefix(url),'_blank')
    }
    $scope.openDetailsPage=function (id) {
        $scope.detailsLoading=true
        ServerUtilityService.getWebService(MyLndService.getUrl('getTraining')+id)
        .then(
            function (data) {
                
                $scope.detailsLoading=false
                $scope.selectedTraining=MyLndService.buildTrainingDetails(data.data)
            },
            function (err) {
                $scope.detailsLoading=false
            }
        )
        //$scope.selectedTraining=
        $scope.openModal('lndDetailsEmp','lnd-details-emp.tmpl.html')
        
    }

    $scope.trainingTypes=MyLndService.buildTrainingTypes()
    
    
    $scope.error_messages=[]
    $scope.success_messages=[]
    $scope.modal_loader=false
    $scope.filters={
        keyWordSearch:{
            training_name:{
                training_name:''
            }

        },
        status:{
            request_status:''
        },
        type:{
            training_type:""
        },
        sort:{
            propertyName:'',
            reverse:false
        }

    }

    $scope.sortBy = function(model, propertyName) {
        model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
        model.propertyName = propertyName;
    };

    $scope.resetTrainingFilter=function () {
        $scope.filters.keyWordSearch.training_name={training_name:''}
        $scope.filters.status={request_status:''}
        $scope.filters.type={training_type:''}
        $scope.filters.sort.propertyName=''
        $scope.filters.sort.reverse=false
    }

    $scope.openModal = function(instance, templateUrl) {
        $scope.modalInstance[instance] = $modal.open({
            templateUrl: templateUrl,
            scope:$scope,
            windowClass:'fadeEffect',
            size:'lg'
        });
    };
    $scope.closeModal = function (instance) {
        if ($scope.modalInstance[instance]) {
            $scope.modalInstance[instance].close();
        }
    };

    //Creates listing data
    $scope.buttonHide = false;
    var getListing=function (hide,tag) {
        ServerUtilityService.getWebService(MyLndService.getUrl('getTrainingList'))
        .then(
            function (data) {
                console.log(data)
                
                $scope.trainings=MyLndService.buildTrainingHash(data.data)
                $scope.filteredTrainings=$scope.trainings
                if(hide)
                {
                    $(tag).modal('hide');
                }
                       
            }
        )
    }
    $scope.iscurrentDateMore = function(query){
        //console.log(query)
        var currentDay = utilityService.getCurrentDate();
        var date = new Date(),
                //timestamp = date.getTime()/1000;
                currentDay = date.getTime()/1000;
                if(parseInt(currentDay) < query.start_date){
                    console.log(currentDay)
                    return false

                }else{
                    return true

                }
    }
    


    $scope.getImagePath=function (name) {
    
        return getAPIPath() +'images/'+name
    }

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
    getListing()


    /**
     * 0-No request raised
     * 1-Pending
     *  
     */


    
    $scope.getStatus=function (request_status,allocated_seats)
    {    
        switch(request_status)
        {
            case 0:return '';
            case 1:return 'Request Pending';
            case 2:return 'Request Cancelled';
            case 3:
                if(allocated_seats)
                {
                    return 'Registered'
                }   
                else
                {
                    return 'Request Approved\n(Registration Pending)';
                } 
            ;
            case 4:return 'Request Denied';
            case 11:return '';
            default:return '';
        }
    }

    $scope.isPublicProfileVisit=function () {
        return $scope.employeeId
    }



    $scope.openRegisterAlert=function (training) {
        $scope.alertData={
            training:training,
            status:0
        }

        $('#training-employee-register-alert').appendTo("body").modal('show');
        
    }

    $scope.openCancelAlert=function (training) {
        $scope.alertData={
            training:training,
            status:1
        }

        $('#training-employee-cancel-alert').appendTo("body").modal('show');
        
    }





    $scope.makeRegisterRequest=function (training) {
        var nomTraining={
            training_type_id:training._id,
            workflow_id:training.workflow,
            request_type:1,//1 for nominating 2/3-for unregistering members
            requested_quantity:1 
        }
        ServerUtilityService.postWebService(MyLndService.getUrl('makeRegisterRequest'),nomTraining)
        .then(
            function (response) {
                
                response.data.status=='success'?getListing(true,'#training-employee-register-alert'):errorCallback(response.data,'past_start_date')
                 
            } 
        )
    }

    $scope.cancelRequest=function (training) {
        //change training._id to training.request_id which is present when request_status!==0
        var url = MyLndService.getUrl('cancelRequest') + "/" + training.request_id + "/" + 2,
            payload = {
                action: 'cancel'
            };

        ServerUtilityService.patchWebService(url, payload)
            .then(function (data){
                getListing(true,'#training-employee-cancel-alert')
                // $('#training-employee-alert').modal('hide');
            });
    }

    var buildFeedbackForm=function (model) {
        $scope.feedbackFormDetails=model.details
        $scope.questionList = angular.isDefined(model.questions) ? model.questions : [];

            angular.forEach($scope.questionList, function(value, key) {
                if(value.question_type != 3 && angular.isDefined(value.answer)
                    && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];                    
                }
                // If question type is of time
                if(utilityService.getValue(value, 'answer') && value.answer && value.question_type == 6) {
                    value.answer = new Date(def + " " + value.answer);
                }

                // If question type is of date
                if(utilityService.getValue(value, 'answer') && value.answer && value.question_type == 5) {
                    value.answer = utilityService.getDefaultDate(value.answer);
                }
            });    
    }

    

    $scope.saveFeedbackForm=function () {
        var payload=MyLndService.buildFeedbackPayload($scope.questionList,$scope.feedbackFormDetails._id,$scope.trainingFormTraining)
        ServerUtilityService.postWebService(MyLndService.getUrl('saveFeedback')+'/'+$scope.trainingFormId,payload).then(function (data) {
            if(data.status=='success')
            {
                $scope.closeModal('lndFeedbackForm')
                utilityService.showSimpleToast(data.message )
                $scope.trainingFormId=null
                $scope.trainingFormTraining=null
                // $scope.answers=null

            }
            
        })
    }

    

    $scope.showFeedbackForm=function (formTemplate,trainingTypeId) {
        $scope.answers=null
        ServerUtilityService.getWebService(MyLndService.getUrl('showFeedback')+'/'+formTemplate+'/'+trainingTypeId).then(function (data) {
            buildFeedbackForm(data.data)
            $scope.trainingFormId=formTemplate
            $scope.trainingFormTraining=trainingTypeId
            if(data.data.questions && data.data.details)
            {
                if(data.data.answers)
                {
                    $scope.answers=data.data.answers
                }
                $scope.openModal('lndFeedbackForm','lnd-feedback-form.tmpl.html')
                
            }
            else
            {
                utilityService.showSimpleToast('Feedback form has no data')
            }
        })
    }

    

    $scope.handleAdditionalAttribute=function (value,type) {
        switch(type)
        {
            case 5:return getAdditionalDate(value)
            case 6:return getAdditionalTime(value)
            default:return value
        }
    }

    $scope.convertTimeStamp = function (stamp) {
        return {
            date:utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[0],
            time:utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[1]+' '+utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[2]
        };
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





    
    

    
}])