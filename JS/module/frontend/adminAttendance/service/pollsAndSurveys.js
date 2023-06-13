app.service('AdminPollsAndSurveyService', [
    'ServerUtilityService', 'utilityService',
    function (ServerUtilityService, utilityService) {
        'use strict';

        var self = this
        this.url = {
            getPollList: 'polls-surveys-admin/get-poll',
            getPollDetails: 'polls-surveys-admin/get-poll',
            getSurveyList: 'polls-surveys-admin/get-survey',
            getSurveyDetails: 'polls-surveys-admin/get-survey',
            changePollSettings: 'polls-surveys-admin/change_poll_show_result',
            getSurveyQuestionSummary:'polls-surveys-admin/survey-result', //{survey_id}/{question_id}
            changeEndDate:'polls-surveys-admin/end-date',
            employeeReminder: 'polls-surveys-admin/send-reminder'
        };

        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };

        /*  Polls Tab Start*/


        this.buildPollsModel = function (model) {
            return {

                visible: false,
                pollList: [],
                currentPoll: null,
                details: null
                
            }
        }

        this.buildPollDetails = function (model) {
            var pollData=self.buildPollList(utilityService.getValue(model, 'list', null), utilityService.getInnerValue(model, 'poll_details', 'options', null))
            return {
                question_details: self.buildQuestionDetails(utilityService.getValue(model, 'poll_details', null)),
                graph: self.buildPollGraph(utilityService.getValue(model, 'graph_details', null)),
                list: pollData.listing,
                isAnonymous:utilityService.getInnerValue(model,'poll_details','keep_anonymous',false),
                filteredList: [],
                propertyName: '',
                reverse: false,
                createdBy:utilityService.getInnerValue(model,'poll_details','created_by',false),
                startDate:self.convertToDate(utilityService.getInnerValue(model,'poll_details','start_date',false)),
                endDate:self.convertToDate(utilityService.getInnerValue(model,'poll_details','end_date',false)),
                modifiedEndDate:self.convertToDate(utilityService.getInnerValue(model,'poll_details','end_date',false)),
                canModifyEndDate:utilityService.getInnerValue(model,'poll_details','can_modify_enddate'),
                resultVisibleToEmployee: utilityService.getValue(model, 'show_result_on_submission_front', null),
                visibilityEndDate:model.emp_result_visibility_end_date? self.convertToDate(model.emp_result_visibility_end_date):new Date(Date.now()),
                resultVisibleToEmployeeSetup:utilityService.getValue(model, 'show_result_on_submission', null),
                summary:self.buildPollSummary(pollData.summary)
            }
        }

       


        this.buildPollSettingsPayload = function (model) {
            return {
                resultVisibleToEmployee: utilityService.getValue(model, 'show_result_on_submission_front', null),
                visibilityEndDate: model.emp_result_visibility_end_date? self.convertToDate(model.emp_result_visibility_end_date):new Date(Date.now())
            }
        }

        this.convertToDate = function (date) {
            return new Date(date * 1000)
        }

        this.buildQuestionDetails = function (model) {
            var options = {}
            model.options.map(function (option) {
                options[option.id] = option.name
            })
            return {
                question: utilityService.getValue(model, 'question', null),
                options: options
            }
        }


        var modifyDataPoints=function (value,count) {
            return (value/count)*100
        }

        this.buildPollSummary=function (model) {
            
            return[
                {
                    y: model.completed,
                    name: 'Completed',
                    color:'#75aa1e'
                },
                {
                    y: model.not_started,
                    name: 'Not Started',
                    color:'#bf184a'
                }
            ]
        }

        this.buildPollGraph = function (model) {
         
            var data = []
            var categories = []
            var answeredBy=model['total']-model['not_answer']
            console.log('XYZ',data)
            if(!answeredBy) return {data:[]}
             
            Object.keys(model).map(function (key) {
                if (!(key == 'total' || key == 'not_answer')) {
                    data.push(modifyDataPoints(model[key],answeredBy))
                    categories.push(key)
                                        
                }

            })
            console.log('XYZ',data)
            return {
                overall: {
                    total: utilityService.getValue(model, 'total', null),
                    not_answered: utilityService.getValue(model, 'not_answer', null)
                },
                 
                data: data,
                categories: categories,
                hash:model
            }
        }

        this.buildPollList = function (model, options) {
            var list = []
            var summary={
                completed:0,
                not_started:0
            }
            
           
            model.map(function (employee) {

                if (employee.answer) {
                    
                    var answers = self.buildOptions(options)
                    answers.emp_code = employee.employee_code?employee.employee_code:'Anonymous'
                    answers.employee_name = employee.employee_name?employee.employee_name:'Anonymous'
                    answers.Department = utilityService.getInnerValue(employee, 'employee_details', 'Department', 'N/A')
                    answers.Designation = utilityService.getInnerValue(employee, 'employee_details', 'Designation', 'N/A')
                    answers.Leagal_Entry = utilityService.getInnerValue(employee, 'employee_details', 'Leagal_Entry', 'N/A')
                    answers.Location = utilityService.getInnerValue(employee, 'employee_details', 'Location', 'N/A')
                    var emp_response = employee.answer
                    answers.options[emp_response] = true
                    
                    list.push(answers)
                    summary.completed+=1
                }
                else
                {
                    summary.not_started+=1
                }
                
            })
            //console.log(list,summary)
           
            return {listing:list,summary:summary}
        }

        this.buildPollExportData=function (question_details,list) {
            var exportData=[]
            var Headers = [
                'Employee Code',
                'Employee Name',
                'Department',
                'Designation',
                'Leagal Entity',
                'Location',
            ]
            var questions = Object.values(question_details.options)
            questions.map(function(question) {  
                Headers.push(question)
            })
            exportData.push(Headers)
            list.map(function (employee) {
                var empRecord=[]
                empRecord.push(utilityService.getValue(employee, 'emp_code', 'Anonymous'))
                empRecord.push(utilityService.getValue(employee, 'employee_name', 'Anonymous'))
                empRecord.push(utilityService.getValue(employee, 'Department', 'N/A'))
                empRecord.push(utilityService.getValue(employee, 'Designation', 'N/A'))
                empRecord.push(utilityService.getValue(employee, 'Leagal_Entry', 'N/A'))
                empRecord.push(utilityService.getValue(employee, 'Location', 'N/A'))
                var responses=Object.values(employee.options).map(function (response) {
                    if(response)
                    {
                        return empRecord.push('Y')
                    }
                    else
                    {
                        return empRecord.push('N')
                    }
                })
                empRecord.concat(responses)
                exportData.push(empRecord)
            })
            console.log('POLL EXPORT : ',exportData)
            

            return exportData
        }

        this.buildOptions = function (model) {
            var options = {}
            var optionNames=[]
            
            model.map(function (option) {
                optionNames.push(option.name)
                
                options[option.id] = false
            })
            return { emp_code: null, options: options,names:optionNames }
        }

        /*  Polls Tab End*/



        /*  Surveys Tab Start*/


        this.buildSurveyModel = function (model) {
            return {
                visible: false,
                surveyList: [],
                currentSurvey: null,
                details: null,
                selectedQuestion:null
            }
        }

        this.buildSurveyDetails = function (model) {
            var surveyData=self.buildSurveyList(utilityService.getValue(model, 'tableData', null))
            return {
                graph: self.buildSurveyGraph(utilityService.getValue(model, 'graphData', null)),
                hasResponses:utilityService.getInnerValue(model,'graphData','submitted',-1)>0,
                list: surveyData.listing,
                isAnonymous:utilityService.getInnerValue(model, 'tableData','keep_anonymous', false),
                startDate:self.convertToDate(utilityService.getInnerValue(model, 'tableData','start_date')),
                endDate:self.convertToDate(utilityService.getInnerValue(model, 'tableData','end_date')),
                modifiedEndDate:self.convertToDate(utilityService.getInnerValue(model, 'tableData','end_date')),
                canModifyEndDate:utilityService.getInnerValue(model,'tableData','can_modify_enddate',false),
                createdBy:utilityService.getInnerValue(model,'tableData','created_by',false),
                filteredList: [],
                propertyName: '',
                reverse: false,
                questions:self.buildSurveyQuestions(utilityService.getValue(model, 'tableData', null)),
                questionSummaryVisible:false,
                questionSummary:null
            }
        }

        this.buildSurveyQuestions=function (model) {
            var questions={}
            var questionNameHash={}
            var optionsHash={}
            
            model.questions.map(function (question) {
                questions[question.question_id]={
                    question:question.question,
                    header:question.header
                }
                questionNameHash[question.question_id]=question.question
                optionsHash[question.question_id]={}
                question.options.map(function (opt) {
                    optionsHash[question.question_id][opt._id]=opt.name
                })
            })

            console.log('OPTION hash',optionsHash)

            return {
                data:questions,
                names:questionNameHash,
                options:optionsHash
            }
        }

        this.buildIndividualSurveyResponse=function (employeeResponse,questionsData) {
            console.log('Responses',employeeResponse,questionsData)
            return {
                responses:employeeResponse,
                questionsData:questionsData
            }
        }
        


        this.buildSurveyList = function (model) {
            var employeeListing = utilityService.getValue(model, 'employee_status', null)
            
            employeeListing.map(function (item) {
                item.employee=item.employee?item.employee:'Anonymous'
                item.employee_name = item.employee_name?item.employee_name:'Anonymous'
            })
            return {listing:employeeListing}
        }

        this.statusConverter = function (status) {
            if(status === 1){
                return 'Not Started'
            }else if(status === 2){
                return 'In Progress'
            }else if(status === 3) {
                return 'Submitted'
            }else{
                return 'N/A'
            }
        }

        this.buildSurveyExportData=function (list,questionsData) {
            var exportData=[]
            var Headers = [
                'Employee Code',
                'Employee Name',
                'Department',
                'Designation',
                'Leagal Entity',
                'Location',
                'status'      
            ]
            var questions=Object.values(questionsData.names)
            questions.map(function(question) {  
                Headers.push(question)
            })
            exportData.push(Headers)
            
            list.map(function (employee) {
                var empRecord=[]
                empRecord.push(utilityService.getValue(employee, 'employee', 'Anonymous'))
                empRecord.push(utilityService.getValue(employee, 'employee_name', 'Anonymous'))
                empRecord.push(utilityService.getInnerValue(employee, 'employee_details', 'Department', 'N/A'))
                empRecord.push(utilityService.getInnerValue(employee, 'employee_details', 'Designation', 'N/A'))
                empRecord.push(utilityService.getInnerValue(employee, 'employee_details', 'Leagal_Entry', 'N/A'))
                empRecord.push(utilityService.getInnerValue(employee, 'employee_details', 'Location', 'N/A'))
                empRecord.push(self.statusConverter(utilityService.getValue(employee, 'status')))
                if(employee.answers != null && employee.answers != undefined){
                    Object.keys(employee.answers).map(function (qKey) {
                        var aKey = employee.answers[qKey]
                        var answer = questionsData.options[qKey][aKey]
                        if(answer){
                            empRecord.push(questionsData.options[qKey][aKey])
                        }else{
                            empRecord.push(aKey)
                        }
                    })
                }else{
                    empRecord.push("_")
                }
                exportData.push(empRecord)

            })

            

            return exportData
        }
        this.buildSurveyGraph = function (model) {
            if (!model) {
                return null;
            }
            var categories = { 'not_started': 'Not Started', 'inprocess': 'In Progress', 'submitted': 'Submitted' }
            var colors={'not_started': '#bf184a', 'inprocess': '#FAB875', 'submitted': '#75aa1e' }
            var dataExists=0
            var data = Object.keys(model).map(function (key) {
                
                return {
                    y: model[key],
                    name: categories[key],
                    color:colors[key]
                }
            })
           
            return {
                data: data,
                categories: categories
            }


        }

        this.buildSurveyQuestionSummary=function (model,questionDetails,questionId) {
            // console.log('QUESTION SUMMARY',model,questionDetails)
            var graphData=[]
            var graphCategories=[]
            var totalCount=0
            var hash={}
            Object.keys(model.answer).map(function (answerId) {
                graphCategories.push(questionDetails.options[questionId][answerId])
                graphData.push(model.answer[answerId])
                totalCount+=model.answer[answerId]
                hash[questionDetails.options[questionId][answerId]]=model.answer[answerId]
            })

            return {
                data:graphData.map(function (item) {
                    return (item/totalCount)*100
                }),
                categories:graphCategories,
                hash:hash
            }
        }
        /*  Surveys Tab End*/









    }
]);