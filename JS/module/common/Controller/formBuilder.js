app.controller('FormBuilderController', [
    '$scope', '$routeParams', '$location', 'FORM_BUILDER', 'formBuilderService', 'utilityService', 'ServerUtilityService',
    function ($scope, $routeParams, $location, FORM_BUILDER, builderService, utilityService, serverUtilityService) {
        $scope.module = {            
            form: utilityService.getValue($routeParams, "form"),
            name: utilityService.getValue($routeParams, "module"),
            module_key: utilityService.getValue($routeParams, "module_key"),
            submodule: utilityService.getValue($routeParams, "submodule"),
            type: utilityService.getValue($routeParams, "exit_type"),
            formType: utilityService.getValue($routeParams, "formType"),
            formTypeId: utilityService.getValue($routeParams, "formTypeId"), 
            isDisabled: utilityService.getValue($routeParams, "isDisabled", 0),
            formSlug: utilityService.getValue($routeParams, "formSlug"),
        };
        $scope.buildAppraisalTabTitle();
        $scope.moduleHashMap = builderService.buildModuleHashMap();        
        var formUrl = $scope.moduleHashMap[$scope.module.name] + "/" + $scope.module.submodule;
        
        $scope.parentQuestionList = [];
        $scope.formBuilderConstant = FORM_BUILDER;
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.dataTypeList = builderService.buildDataTypeList();
        $scope.row = builderService.buildRowObject();     
        $scope.isButtonDisable = false;
        $scope.backHashMap = {
            user_management: {
                tab: "letter",
                subtab: "forms"
            },
            workflow: {
                tab: "workflow",
                subtab: utilityService.getValue($routeParams, "submodule") == "other-form" ? "other" : "request"
            },
            employee_exit:  {
                tab: "exitstp",
                subtab: utilityService.getValue($routeParams, "submodule") == "exit-interview-form" ? "interview" : "survey"
            }
        };
        $scope.formAction = {
            save: false,
            addQuestion: true
        };

        /*********** START GENERIC FORM SECTION ***********/
        var setFormAction = function(action) {
            angular.forEach($scope.formAction, function(value, key) {
                $scope.formAction[key] = false;
            });
            $scope.formAction[action] = true;
        };
        var syncFormModel = function(model) {
            $scope.form = builderService.buildFormModel(model, $scope.module);
        };
        syncFormModel();
        var getFormDetails = function() {
            var url = null;
            if($scope.module.module_key === 'performance' || $scope.module.module_key === 'appraisal') {
                url = formUrl + "/" + $scope.module.form +"?module_key=" + $scope.module.module_key; 
            } else {
                url = formUrl + "/" + $scope.module.form;
            }
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    syncFormModel(data.data);
                });
        };
        if($scope.module.form) {
            getFormDetails();
        }
        var createForm = function() {
            var url = formUrl,
                payload = builderService.buildFormPayload($scope.form);
                if($scope.module.module_key == 'performance') {
                    payload.module_key = 'performance';
                }

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, [], "formBuilder", true);
                    $scope.isButtonDisable = false;
                });
        };
        var updateForm = function() {
            var url = formUrl + "/" + $scope.module.form,
                payload = builderService.buildFormPayload($scope.form);
                if($scope.module.module_key == 'performance'){
                    payload.module_key = 'performance';
                }

            serverUtilityService.putWebService(url, payload)
                .then(function(data){
                    successErrorCallback(data, [], "formBuilder", false);
                    $scope.isButtonDisable = false;
                });
        };        
        $scope.createUpdateForm = function(action) {
            $scope.isButtonDisable = true;
            setFormAction(action);
            $scope.form._id ? updateForm() : createForm();
        };                
        /*********** END GENERIC FORM SECTION ***********/


        /*********** START WORKFLOW FORM SECTION ***********/
        var createWorkFlowForm = function(item, ftype) {
            var url = formUrl,
                payload = builderService.buildFormPayload($scope.form, true);

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {                    
                    successErrorCallback(data, [], "formBuilder", true);
                });
        };
        var updateWorkFlowForm = function(item) {
            var url = formUrl + "/" + $scope.module.form,
                payload = builderService.buildFormPayload($scope.form, true);
            
            serverUtilityService.putWebService(url, payload)
                .then(function(data){
                    successErrorCallback(data, [], "formBuilder", false);
                });
        };
        $scope.createUpdateWorkFlowForm = function(item, ftype, action) {
            setFormAction(action);
            $scope.form._id ? updateWorkFlowForm(item, ftype) 
                : createWorkFlowForm(item, ftype);
        };
        $scope.navigateToBack = function () {
            if ($scope.module.module_key == 'performance') {
                $location.url('dashboard/my-team').search({
                    "tab": 7,
                    "subTab": 1
                });
            } else if($scope.module.module_key == 'appraisal') {
                $location.url('frontend/adminPerformance').search({
                    "tab": 2,
                    "subtab": 1
                });
            } else {
                var tab, subtab;
                tab = $scope.backHashMap[$routeParams.module].tab;
                subtab = $scope.backHashMap[$routeParams.module].subtab;
                utilityService.setReloadOnSearch();
                $location.url('admin').search({
                    "tab": tab,
                    "subtab": subtab
                });
            }
        };
        $scope.backToPerformance = function() {          
            $location.url('dashboard/my-team').search({
                "tab": 7,
                "subTab":1
            });
        };
        /*********** END WORKFLOW FORM SECTION ***********/


        /*********** START QUESTION SECTION ***********/
        $scope.questionTypeCountMapping = builderService.buildQuestionTypeCountMappingObject();     
        var isQuestionHavingMultipleOptions = function(value) {
            return $scope.formBuilderConstant.multipleOptions.indexOf(parseInt(value.question_type, 10)) >= 0 
                ? true : false;
        };
        var rebuildParentQuestionList = function(value) {
            if(!value.isConditional && isQuestionHavingMultipleOptions(value) && value._id) {
                $scope.parentQuestionList.push({
                    _id: value._id, 
                    question: value.question
                });
            }
        };
        var buildParentQuestionList = function(list) {
            $scope.questionTypeCountMapping = builderService.buildQuestionTypeCountMappingObject();
            $scope.parentQuestionList = [];
            angular.forEach(list, function(value, key) {
                if(!value.isConditional && isQuestionHavingMultipleOptions(value) && value._id) {
                    $scope.parentQuestionList.push({
                        _id: value._id, 
                        question: value.question
                    });
                }
                
                if (angular.isDefined($scope.questionTypeCountMapping[value.question_type])) {
                    $scope.questionTypeCountMapping[value.question_type] = $scope.questionTypeCountMapping[value.question_type] + 1;
                }
            });
        };
        var syncParentWithChild = function() {
            angular.forEach($scope.questionList, function(value, key) {
                if(value.hasParent) {
                    $scope.changeQuestion(value, value.parentQuestion);
                }
            });
        };
        var questionCallback = function(isLoaded, resetIndex) {
            buildParentQuestionList($scope.questionList);
            $scope.addQuestion();
            if(resetIndex) {
               $scope.row.selectedIndex = -1; 
            }            
            syncParentWithChild();                        
        };
        /* var scrollToBottom = function() {
           $timeout(function() {
               var $target = $('md-content');
               $target.animate({ scrollTop: $('.generic-form-builder').height() }, 2000);
           }, 0);
        }; */
        var getQuestionList = function(isLoaded, resetIndex) {
            if (!$scope.module.form) {
                return false;
            }
            
            isLoaded = angular.isDefined(isLoaded) ? isLoaded : false;
            resetIndex = angular.isDefined(resetIndex) ? resetIndex : true;

            var url = builderService.getUrl('ques'),
                params = {form_id: $scope.module.form};
            
            serverUtilityService.getWebService(url, params)
                .then(function(data) {
                    $scope.questionList = data.data;
                    if(isLoaded) {
                       //scrollToBottom();                    
                    }                   
                    questionCallback(isLoaded, resetIndex);
                }); 
        };
        if ($scope.module.form) {
            getQuestionList();
        }

       	$scope.addMoreOption = function(item) {
       		item.options.push(builderService.buildOptionnObject(item));
       	};
       	$scope.removeOption = function(item, index) {
       		item.options.splice(index, 1);
       	};
       	$scope.addQuestion = function() {
            $scope.questionList.push(builderService.buildQuestionObject($scope.module.module_key));
       	};               
        $scope.setSelectedIndex = function(item) {
            $scope.row.selectedIndex = item._id;
            $scope.resetErrorMessages();
        };
        $scope.changeQuestionType = function(item, model) {
            item.validation = (model == $scope.questionTypeConstant.textbox) 
                ? builderService.buildValidationObject() : null;

            if(isQuestionHavingMultipleOptions(item)) {
                item.options = [
                    {
                        "_id": null,
                        "name": "Option1"
                    },
                    {
                        "_id": null,
                        "name": "Option2"
                    }
                ];
            }
        };
        $scope.changeQuestion = function(item, model) {
            angular.forEach($scope.questionList, function(value, key) {
                if(model == value._id) {
                    angular.forEach(value.options, function(v, k) {
                        if(angular.isObject(v._id)) {
                            value.options[k]._id = v._id;
                        } else {
                            value.options[k]._id = {$id: v._id};
                        }
                    });
                    item.allOptions = value.options;
                } 
            });
        };
        $scope.createQuestion = function(item) {
            $scope.resetErrorMessages();
            $scope.isButtonDisable = true;
            var url = builderService.getUrl('ques'),
                payload = builderService.buildQuestionPayload(item, $scope.module);
            serverUtilityService.postWebService(url, payload)
                .then(function(data) {         
                    successErrorCallback(data, $scope.questionList, "questionBuilder", true);
                    $scope.isButtonDisable = false;
                });
        };
        $scope.updateQuestion = function(item) {
            $scope.resetErrorMessages();
            $scope.isButtonDisable = true;
            var url = builderService.getUrl('ques') + "/" + item._id,
                payload = builderService.buildQuestionPayload(item, $scope.module);

            serverUtilityService.putWebService(url, payload)
                .then(function(data){
                    successErrorCallback(data, $scope.questionList, "questionBuilder", false);
                    $scope.isButtonDisable = false;
                });
        };
        $scope.deleteQuestion = function(item, index) {
            if(!item._id) {
                return false;
            }
            var url = builderService.getUrl('ques') + "/" + item._id;
            serverUtilityService.deleteWebService(url)
                .then(function(data){                    
                    $scope.questionList = utilityService.deleteCallback(data, item, $scope.questionList);
                    buildParentQuestionList($scope.questionList);
                });
        }; 
        /*********** END QUESTION SECTION ***********/

        var successCallbackFormBuilder = function (data, list, section, isAdded) {
            if (isAdded) {
                utilityService.setReloadOnSearch(true);
                $scope.module.form = data.data._id;
                $location.search("form", data.data._id);
            }
            $scope.formAction.addQuestion ? getQuestionList(true) : $scope.navigateToBack();
        };
        var successCallback = function(data, list, section, isAdded) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            if(section == "formBuilder") { 
                successCallbackFormBuilder(data, list, section, isAdded);
            } else {
                getQuestionList(false, false);
                // Please don't delete this, might be used in future
                /*if(isAdded) {
                    var lastObject = list[list.length - 1],
                        obj = {
                            parentOption: [],
                            allOptions: []
                        };

                    angular.copy(lastObject.parentOption, obj.parentOption);
                    angular.copy(lastObject.allOptions, obj.allOptions);
                    data.data.parentOption = obj.parentOption;
                    data.data.allOptions = obj.allOptions;
                    list.pop();
                    list.push(data.data);
                    $scope.addQuestion();
                } else {
                    utilityService.refreshList(list, data.data);
                }
                rebuildParentQuestionList(data.data);*/
            }
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };        
        var successErrorCallback = function (data, list, section, isAdded) {
            data.status === "success" ? 
                successCallback(data, list, section, isAdded) : errorCallback(data, section);
        };
        $scope.isQuestionHavingMultipleOptions = function(value) {
            return isQuestionHavingMultipleOptions(value);
        };
        $scope.resetErrorMessages = function () {
            $scope.errorMessages = [];
        };

        $scope.isPollAndSurveyForm=function () {
            return ($scope.module.formSlug=='poll' 
                   ||$scope.module.formSlug=='survey')
                    
        }
    }
]);
