app.controller('AdminPollsAndSurvey', [
  '$scope', '$routeParams', '$location', '$timeout', '$window', '$route', '$q', '$mdDialog', 'AdminPollsAndSurveyService', 'utilityService', 'ServerUtilityService','$modal', 'communicationService',
  function ($scope, $routeParams, $location, $timeout, $window, $route, $q, $mdDialog, AdminPollsAndSurveyService, utilityService, serverUtilityService, $modal,communicationService) {
    $scope.title = 'demo'
    $scope.isBulk = false

    $scope.canUpdate = false
    $scope.pollsModel = AdminPollsAndSurveyService.buildPollsModel()
    $scope.surveysModel = AdminPollsAndSurveyService.buildSurveyModel()

    $scope.updatePaginationSettings('admin_poll_listing')
    $scope.updatePaginationSettings('admin_survey_listing')

      var isSectionMyTeam = function() {
        return $scope.section.dashboard.team;
    };                
    
      var buildGetParams = function() {
          var params = {
              permission: $scope.model.action.current.permission_slug
          };            
          if(isSectionMyTeam()) {
              params.rel_id = $scope.relationship.primary.model._id;
              params.direct_reportee = $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false;
              if(teamOwnerId) {
                  params.emp_id = teamOwnerId;
              }
          }

          return params;
      };



    // For calling APIs on tab change
    $scope.tab = { selectedIndex: 0 }
    $scope.changeTab = function (index) {
      $scope.tab = { selectedIndex: index }
      if (index == 0 && $scope.pollsModel.pollList.length == 0) {
        getPollsList()
      }
      else if (index == 1 && $scope.surveysModel.surveyList.length == 0) {
        getSurveyList()
      }
    }

    /*Poll Tab Start*/


    $scope.pollsFilter = {
      employee: {
        emp_code: ''
      }

    }

    $scope.resetPollsFilter = function () {
      $scope.pollsFilter = {
        employee: {
          emp_code: ''
        }

      }
    }


    var pollsListCallback = function (response) {
      if (response.status == 'success') {
        $scope.pollsModel.pollList = response.data
        $scope.pollsModel.currentPoll = response.data[0]
        $scope.getPoll()
      }
      else {
        $scope.pollsModel.pollList = []
        utilityService.showSimpleToast('No Polls found')
        $scope.pollsModel.visible = true
      }

    }

    var getPollsList = function () {
      var url = AdminPollsAndSurveyService.getUrl(isSectionMyTeam() ? 'getPollListMyTeam' : 'getPollList')
      serverUtilityService.getWebService(url, buildGetParams).then(function (response) {

        //On getting polls list , pollDetails will created by making another call to first poll_id
        pollsListCallback(response)
      })
    }




    $scope.getPoll = function () {
      $scope.pollsModel.details = null
      $scope.pollsModel.visible = false
      $scope.pollsSettings = null

      $scope.resetPollsFilter()
      var url = AdminPollsAndSurveyService.getUrl(isSectionMyTeam() ? 'getPollListMyTeam' : 'getPollList') + '/' + $scope.pollsModel.currentPoll._id
      serverUtilityService.getWebService(url, buildGetParams).then(function (response) {
        if (response.status.toLowerCase() == 'success') {
          $scope.pollsModel.details = AdminPollsAndSurveyService.buildPollDetails(response.data)
          
          $scope.pollsSettings = AdminPollsAndSurveyService.buildPollSettingsPayload(response.data)
          // $scope.resultVisibleToEmployeePayload = $scope.pollsModel.details.resultVisibleToEmployee
          // $scope.visibilityEndDatePayload = $scope.pollsModel.details.visibilityEndDate
          $scope.pollsModel.visible = true

        }
        else {
          
          $scope.pollsModel.details = null
          $scope.pollsModel.visible = true
        }
      })
      
    }

    $scope.$watchCollection('pollsSettings', function () {
     
      if ($scope.pollsSettings) {
        if (xorOp($scope.pollsSettings.resultVisibleToEmployee, $scope.pollsModel.details.resultVisibleToEmployee)
          || !isTimestampEqual($scope.pollsSettings.visibilityEndDate, $scope.pollsModel.details.visibilityEndDate)) {
          $scope.canUpdate = true
        }
        else {
          $scope.canUpdate = false
        }
      }
    })

    var convertToTimeStamp=function (date) {
      return parseInt(new Date(date).getTime()/1000)
    }
    $scope.updatePollSettings = function () {
      var url=AdminPollsAndSurveyService.getUrl(isSectionMyTeam() ? 'changePollSettingsMyTeam' : 'changePollSettings')+'/'+$scope.pollsModel.currentPoll._id
      var payload={
        show_result_on_submission_front:$scope.pollsSettings.resultVisibleToEmployee,
        emp_result_visibility_end_date:$scope.pollsSettings.resultVisibleToEmployee?convertToTimeStamp($scope.pollsSettings.visibilityEndDate):null
      }

      serverUtilityService.putWebService(url,payload).then(function (response) {
        if(response.status.toLowerCase()=='success')
        {
          $scope.getPoll()
        }
        else
        {
          var oldDate=$scope.pollsModel.details.visibilityEndDate
          $scope.pollsSettings.visibilityEndDate=oldDate
          utilityService.showSimpleToast(response.message)
        }
      })
      //On success of update
      
    }

    $scope.endDatesEqual=function (type) {
      return $scope[type].details.endDate.getTime()==$scope[type].details.modifiedEndDate.getTime()
    }

    $scope.openModal = function(template, keyName,size) {
      $scope.modalInstance[keyName] = $modal.open({
          templateUrl : template,
          scope : $scope,
          size : size || 'lg',
          windowClass: 'fadeEffect'
      });
    };
    $scope.closeModal = function(keyName) {
        $scope.modalInstance[keyName].dismiss(); 
    };

    $scope.employeeSurveyResponses=null
    $scope.showEmployeeSurveyResponses=function (employeeResponse) {
      $scope.employeeSurveyResponses=AdminPollsAndSurveyService.buildIndividualSurveyResponse(
        employeeResponse,
        $scope.surveysModel.details.questions
      )

      $scope.openModal('admin-survey-responses.tmpl.html','adminSurveyResponses','md')

      


    }




    // $scope.$watch('pollsSettings.visibilityEndDate', function () {
   
    //   if ($scope.pollsSettings) {
    //     if (isTimestampEqual($scope.pollsSettings.visibilityEndDate, $scope.pollsModel.details.visibilityEndDate)) {
    //       $scope.canUpdate = false
    //     }
    //     else {
    //       $scope.canUpdate = true
    //     }
    //   }
    // })




    $scope.pollSettingsUpdate = function (params) {

    }

    /*Poll Tab End*/



    /*Survey Tab Start*/

    $scope.surveyFilter = {
      employee: {
        employee: ''
      },
      status: {
        status: ''
      }
    }

    $scope.resetSurveyFilter = function () {
      $scope.surveyFilter = {
        employee: {
          employee: ''
        },
        status: {
          status: ''
        }
      }
    }

    var surveyListCallback = function (response) {
      if (response.status == 'success') {

        $scope.surveysModel.surveyList = response.data
        $scope.surveysModel.currentSurvey = response.data[0]
        $scope.getSurvey()
      }
      else {
        $scope.surveysModel.surveyList = []
        utilityService.showSimpleToast('No Surveys found')
        $scope.surveysModel.visible = true
      }
    }


    var getSurveyList = function () {

      var url = AdminPollsAndSurveyService.getUrl(isSectionMyTeam() ? 'getSurveyListMyTeam' : 'getSurveyList')

      serverUtilityService.getWebService(url, buildGetParams).then(function (response) {
        surveyListCallback(response)
      })
    }
    // getSurveyList()

    $scope.getSurvey = function () {
      $scope.surveysModel.details = null
      $scope.surveysModel.visible = false
      $scope.resetSurveyFilter()
      if(!$scope.surveysModel.currentSurvey)
      {
        $scope.surveysModel.visible = true
        return
      }
      var url = AdminPollsAndSurveyService.getUrl(isSectionMyTeam() ? 'getSurveyDetailsMyTeam' : 'getSurveyDetails') + '/' + $scope.surveysModel.currentSurvey._id
      serverUtilityService.getWebService(url, buildGetParams).then(function (response) {
        if (response.status.toLowerCase() == 'success') {
          $scope.surveysModel.details = AdminPollsAndSurveyService.buildSurveyDetails(response.data)
          $scope.surveysModel.visible = true
        }
        else {
          $scope.surveysModel.details = null
          $scope.surveysModel.visible = true
        }
      })

    }

    /*Survey Tab End*/

    $scope.sortBy = function (type, propertyName) {
      $scope[type].details.reverse = ($scope[type].details.propertyName === propertyName) ? !$scope[type].details.reverse : false;
      $scope[type].details.propertyName = propertyName;
    };

    var xorOp = function (op1, op2) {
      return (op1 && !op2) || (!op1 && op2)
    }

    var isTimestampEqual = function (date1, date2) {
      return date1.getTime() == date2.getTime()
    }

    /* Exporting */
    $scope.exportPollData=function (type) {
      var data=AdminPollsAndSurveyService.buildPollExportData(
        $scope.pollsModel.details.question_details,
        $scope.pollsModel.details.list
      )

      var title=$scope.pollsModel.currentPoll.name.split(' ').join('-').toLowerCase()
      if(type=='csv')
      {
        utilityService.exportToCsv(data,title+'.csv')
      }
      else
      {
        utilityService.exportToExcel(data,title+'.xlsx')
      }
    }

    $scope.exportSurveyData=function (type) {
      var data=AdminPollsAndSurveyService.buildSurveyExportData(
        $scope.surveysModel.details.list,
        $scope.surveysModel.details.questions
      )

      var title=$scope.surveysModel.currentSurvey.name.split(' ').join('-').toLowerCase()
      if(type=='csv')
      {
        utilityService.exportToCsv(data,title+'.csv')
      }
      else
      {
        utilityService.exportToExcel(data,title+'.xlsx')
      }
      //console.log(data)
      
    }
    /* */

    $scope.getSurveyQuestionSummary=function (questionId) {
      var url=AdminPollsAndSurveyService.getUrl('getSurveyQuestionSummary')+'/'+$scope.surveysModel.currentSurvey._id+'/'+questionId
      $scope.surveysModel.details.questionSummaryVisible=false
      serverUtilityService.getWebService(url).then(function (response) {
        
        if(response.status=='success' && !(response.data.answer instanceof Array))
        {
          
          var questionsDetails=$scope.surveysModel.details.questions
          $scope.surveysModel.details.questionSummary=AdminPollsAndSurveyService.buildSurveyQuestionSummary(response.data,questionsDetails,questionId)
          console.log('QUESTION SUMMARY : ',$scope.surveysModel.details.questionSummary)
          $scope.surveysModel.details.questionSummaryVisible=true
        }
        else
        {
          $scope.surveysModel.details.questionSummary=null
          $scope.surveysModel.details.questionSummaryVisible=true
        }
      })
    }

    $scope.extendEndDate=function (type) {
      if(type=='pollsModel')
      {
        var id=$scope.pollsModel.currentPoll._id
      }
      else
      {
        var id=$scope.surveysModel.currentSurvey._id
      }
      var url=AdminPollsAndSurveyService.getUrl('changeEndDate')+'/'+id
      var payload={
        end_date:convertToTimeStamp($scope[type].details.modifiedEndDate)
      }
      serverUtilityService.putWebService(url,payload).then(function (response) {
        if(response.status=='success' && response.message)
        {
          utilityService.showSimpleToast(response.message)
          $scope[type].details.endDate=$scope[type].details.modifiedEndDate
          var newVisibilityEndDate=utilityService.getValue(response.data,'emp_result_visibility_end_date')
          $scope.pollsSettings.visibilityEndDate=AdminPollsAndSurveyService.convertToDate(newVisibilityEndDate)
          $scope.pollsModel.details.visibilityEndDate=AdminPollsAndSurveyService.convertToDate(newVisibilityEndDate)    
        }
        else
        {
          $scope[type].details.modifiedEndDate=$scope[type].details.endDate
        }
      })
    }

    $scope.employeeReminder = function(id, isbulk, setting, list){
      var url =AdminPollsAndSurveyService.getUrl('employeeReminder') + '/' + setting,
          payload = { "emp_id":[]};
          if(isbulk){
            var ids = [];
            angular.forEach(list, function(val){
              if(val.isChecked && val.status !== 3){
                ids.push(val.employee)
              }
            })
            payload.emp_id = ids
          }else{
            payload.emp_id.push(id)
          }
          serverUtilityService.putWebService(url,payload).then(function (response) {
            if(response.status=='success'){
              utilityService.showSimpleToast(response.message)
            }
          })
    }

    $scope.selectAll = function(list, checkValue) {
      angular.forEach(list, function(value, key) {
        value.isChecked = checkValue;
     });
     $scope.checkIfBulk()
    }

    $scope.checkIfBulk = function() {
      var count = 0
      angular.forEach($scope.surveysModel.details.filteredList, function(val){
        if(val.isChecked){
          count++
        }
      });
      if(count > 0){
        $scope.isBulk = true
      }else{
        $scope.isBulk = false

      }

  }
}
]);