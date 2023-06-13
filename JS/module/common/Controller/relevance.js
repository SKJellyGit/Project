app.controller('RelevanceController', [
    '$scope', '$routeParams', '$rootScope', '$timeout', 'relevanceService', 'utilityService', 'ServerUtilityService', 'RELEVANCE_MODULE', '$location',
    function ($scope, $routeParams, $rootScope, $timeout, relevanceService, utilityService, serverUtilityService, RELEVANCE_MODULE, $location) {
        var self = this;
        self.filterSelected = true;
        self.querySearchChips = querySearchChips;
        self.provisionManager = [];
        self.trainingManager= []
        self.escalationContact = [];
        self.timeScheduler = [];
        self.specificEmployee = [];

        $scope.selectedTAb = 0;        
        $scope.isDisableApplicabilty = true;
        $scope.isLoaded = false;
        $scope.check = function(tab) {
            
            $scope.selectedTAb = tab;
            $scope.isDisableApplicabilty = (tab == 0 && $scope.moduleName!=='lnd') ? true : false;
        };
        $scope.relevanceAction = relevanceService.buildRelevanceAction();
        $scope.companyWide = relevanceService.buildCompanyWideAction();
        $scope.filterAction = relevanceService.buildFilterAction();
        $scope.groupList = [];
        $scope.relevanceList = [];
        $scope.companyWideList = [];
        $scope.filterList = [];
        $scope.groupObject = {};
        $scope.elementObject = {};
        $scope.relevanceModule = {};
        $scope.addFilter = {
            status: false
        };
        $scope.isSaveVisible = $routeParams.page && $routeParams.page == 'previewPreviewCycle' ?  false : true;
        $scope.navigateToExit = function() {
            if($scope.isExitRelevance) {
                var subtab = 'otherClearance';
                var tab = 'exitstp';
            } else if($scope.isHoliday) {
                subtab = 'holiday';
                tab = 'leave';
            }
            $location.url('/admin').search({tab:tab, subtab: subtab});
        };        
        $scope.moduleName = angular.isDefined($routeParams.moduleName) 
            ? $routeParams.moduleName : localStorage.getItem('moduleName');
        var moduleNameArray = ['reporting', 'pf', 'esi', 'user_management',
            'resourcefile', 'resourcefolder', 'wfh', 'regularization', 'minWork', 'lateAtte', 
            'absent', 'earlyGo', 'compOff', 'overTime', 'bonus', 'broadcastNotice'];
        $scope.enableKeys = {
            provisions:{
                assign_workflow: true,
                assign_form: false,
                provision_manager: true,
                escalation_contact: false
            },
            lnd: {
                assign_workflow: true,
                assign_form: false,
                training_manager: true,
                escalation_contact: false
            },
            user_management: {
                assign_workflow: false,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            leave: {
                assign_workflow: true,
                assign_form: true,
                provision_manager: false,
                escalation_contact: false
            },
            holiday: {
                assign_workflow: true,
                assign_form: true,
                provision_manager: false,
                escalation_contact: false
            },
            prejoining:{
                assign_workflow: false,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            employee_exit:{
                assign_workflow: false,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            payroll:{
                assign_workflow: true,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            timePlan:{
                assign_workflow: true,
                assign_form: true,
                provision_manager: false,
                escalation_contact: false
            },
            regularization:{
                assign_workflow: true,
                assign_form: true,
                provision_manager: false,
                escalation_contact: false
            },
            reporting:{
                assign_workflow: true,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            wfh:{
                assign_workflow: true,
                assign_form: true,
                provision_manager: false,
                escalation_contact: false
            },
            lateAtte:{
                assign_workflow: false,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            earlyGo:{
                assign_workflow: false,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            compOff:{
                assign_workflow: false,
                compOff_workflow: false,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            overTime:{
                assign_workflow: true,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            recruitmentOfferLetter:{
                assign_workflow: true,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            okradmin:{
                assign_workflow: false,
                assign_form: false,
                provision_manager: false,
                escalation_contact: false
            },
            helpdesk:{
                assign_workflow: true,
                assign_form: false,
                provision_manager: true,
                escalation_contact: false
            }
        };
        var getPayload = function(){                  
            switch ($scope.moduleName){
                case "provisions":
                    return relevanceService.buildProvisionPayload($scope.relevance,self.provisionManager, self.escalationContact);
                case "lnd":
                    return relevanceService.buildLndPayload($scope.relevance,self.trainingManager, self.escalationContact, $scope.provision);
                case "user_management":
                    return relevanceService.buildUserManagementPayload($scope.relevance);
                case "leave":
                    return relevanceService.buildLeavePayload($scope.relevance);
                case "employee_exit":
                    return relevanceService.buildUserManagementPayload($scope.relevance);
                case "payroll":
                    return relevanceService.buildPayrollPlanPayload($scope.relevance); 
                case "regularization":
                    return relevanceService.buildRegularizationPayload($scope.relevance); 
                case "compOff":
                    return relevanceService.buildCompOffPayload($scope.relevance);
                case "overTime":
                    return relevanceService.buildRegularizationPayload($scope.relevance); 
                case "prejoining":
                    return relevanceService.buildUserManagementPayload($scope.relevance);
                case "holiday":
                    return relevanceService.buildHolidayPayload($scope.relevance);
                case "timePlan":
                    return relevanceService.buildTimePlanPayload($scope.relevance, self.timeScheduler);
                case "broadcastNotice":
                    return relevanceService.buildNoticePayload($scope.relevance, self.specificEmployee);
                case "travelExpense":
                    return relevanceService.buildTravelExpensePayload($scope.relevance);
                case "reviewCycle":
                    return relevanceService.buildReviewCyclePayload($scope.relevance);
                case "recruitment":
                    return relevanceService.buildRecruitmentPayload($scope.relevance);
                case "internal_recruitment_job_posting":
                    return relevanceService.buildRecruitmentIjpPayload($scope.relevance);
                case "okradmin":
                    return relevanceService.buildLeavePayload($scope.relevance);
                case "helpdesk":
                    return relevanceService.buildProvisionPayload($scope.relevance);
                default:
                    return relevanceService.buildLeavePayload($scope.relevance);
            }
        };
        
        if(utilityService.getValue($routeParams, 'moduleName')) {
            $scope.relevanceModule = {
                name: $routeParams.moduleName
            };
        }else if(angular.isDefined(localStorage.getItem('moduleName'))){
            $scope.relevanceModule = {
                name: localStorage.getItem('moduleName')
            };
        }
        $scope.relevanceModule.title = RELEVANCE_MODULE[$scope.relevanceModule.name]
                                             ? RELEVANCE_MODULE[$scope.relevanceModule.name].title : null;
                                      
        $scope.isUserManagement = $scope.relevanceModule.name == RELEVANCE_MODULE.user_management.name ? true : false;
        $scope.isProvisionRelevance = $scope.relevanceModule.name == RELEVANCE_MODULE.provisions.name ? true : false;
        $scope.isLeaveRelevance = $scope.relevanceModule.name == RELEVANCE_MODULE.leave.name ? true : false;
        $scope.isExitRelevance = $scope.relevanceModule.name == RELEVANCE_MODULE.employee_exit.name ? true : false;
        $scope.isPayrollPlan = $scope.relevanceModule.name == RELEVANCE_MODULE.payroll.plan.name ? true : false;
        $scope.isTimePlan = $scope.relevanceModule.name == RELEVANCE_MODULE.timeAttendenc.timePlan.name ? true : false;
        $scope.isReporting = $scope.relevanceModule.name == RELEVANCE_MODULE.timeAttendenc.reporting.name ? true : false;
        $scope.isLateAtte = $scope.relevanceModule.name == RELEVANCE_MODULE.timeAttendenc.lateAtte.name ? true : false;
        $scope.isEarlyGo = $scope.relevanceModule.name == RELEVANCE_MODULE.timeAttendenc.earlyGo.name ? true : false;
        $scope.isMinWork = $scope.relevanceModule.name == RELEVANCE_MODULE.timeAttendenc.minWork.name ? true : false;
        $scope.isAbsent = $scope.relevanceModule.name == RELEVANCE_MODULE.timeAttendenc.absent.name ? true : false;
        $scope.isPf = $scope.moduleName == RELEVANCE_MODULE.payroll.pf.name ? true : false;
        $scope.isEsi= $scope.moduleName == RELEVANCE_MODULE.payroll.esi.name ? true : false;
        $scope.isBonus= $scope.moduleName == RELEVANCE_MODULE.payroll.bonus.name ? true : false;
        $scope.isPrejoining= $scope.moduleName == RELEVANCE_MODULE.prejoining.name ? true : false;
        $scope.isHoliday= $scope.moduleName == RELEVANCE_MODULE.holiday.name ? true : false;
        $scope.isResourceFile = $scope.moduleName == RELEVANCE_MODULE.resourcefile.name ? true : false;
        $scope.isResourceFolder = $scope.moduleName == RELEVANCE_MODULE.resourcefolder.name ? true : false;
        $scope.isCompOff = $scope.moduleName == RELEVANCE_MODULE.timeAttendenc.compOff.name ? true : false;
        $scope.broadcastNotice = $scope.moduleName == RELEVANCE_MODULE.broadcast.name ? true : false;
        $scope.travelExpense = $scope.moduleName == RELEVANCE_MODULE.travelExpense.name ? true : false;
        $scope.reviewCycle = $scope.moduleName == RELEVANCE_MODULE.reviewCycle.name ? true : false;
        $scope.recruitmentOfferLetter = $scope.moduleName == RELEVANCE_MODULE.recruitmentOfferLetter.name ? true : false;
        $scope.isPollSurvey = utilityService.getValue($routeParams, 'module') === 'poll' || utilityService.getValue($routeParams, 'module') === 'survey';
        $scope.isOnGridPlan = utilityService.getValue($routeParams, 'module') == 'ongrid' ? true : false;
        $scope.isOkrAdmin = utilityService.getValue($routeParams, 'module') == 'okradmin' ? true : false;
        $scope.isHelpdeskRelevance = $scope.relevanceModule.name == RELEVANCE_MODULE.helpdesk.name ? true : false;
        $scope.isLetterDocument = utilityService.getValue($routeParams, 'moduleName') == 'letterDocument' ? true : false;
        $scope.isFormDocument = utilityService.getValue($routeParams, 'moduleName') == 'formDocument' ? true : false;
        $scope.isDocDocument = utilityService.getValue($routeParams, 'moduleName') == 'docDocument' ? true : false;
        $scope.isExitFeedback = utilityService.getValue($routeParams, 'moduleName') == 'exitFeedback' ? true : false;
        
        
        var isNotWorkflowVisible = function (){
            return ($scope.isUserManagement || $scope.isExitRelevance || $scope.isReporting || $scope.isLateAtte || $scope.isEarlyGo || $scope.isMinWork || $scope.isAbsent || $scope.isPf || $scope.isEsi || $scope.isPrejoining || $scope.isResourceFile || $scope.isResourceFolder || $scope.isBonus || $scope.broadcastNotice || $scope.reviewCycle || $scope.isPollSurvey || $scope.isLetterDocument || $scope.isFormDocument || $scope.isDocDocument || $scope.isExitFeedback || $scope.isOkrAdmin);
        };
        $scope.isNotWorkflowVisible = isNotWorkflowVisible() || utilityService.getValue($routeParams, 'module') === 'ongrid';
        
        var isWorkflowVisible = function (){
            return (!$scope.isUserManagement && !$scope.isExitRelevance && !$scope.isReporting && !$scope.isLateAtte && !$scope.isEarlyGo && !$scope.isMinWork && !$scope.isAbsent && !$scope.isPf && !$scope.isEsi && !$scope.isPrejoining && !$scope.isResourceFile && !$scope.isResourceFolder && !$scope.isBonus && !$scope.broadcastNotice && !$scope.reviewCycle && !$scope.isPollSurvey && !$scope.isLetterDocument && !$scope.isFormDocument && !$scope.isDocDocument && !$scope.isExitFeedback && !$scope.isOkrAdmin);
        };
        $scope.isWorkflowVisible = isWorkflowVisible() && utilityService.getValue($routeParams, 'module') !== 'ongrid';
        
        var isLndModuleVisible = function(){
            if ($scope.moduleName == 'lnd')
                return true;
            else    
                return false;
        }
        $scope.isLndModuleVisible = isLndModuleVisible();
        
        if($scope.moduleName){
            if($scope.moduleName == 'provisions'){
               $scope.releventElementId = utilityService.getValue($routeParams, 'provisionId'); 
            }else if ($scope.moduleName == 'prejoining'){
               $scope.releventElementId = utilityService.getValue($routeParams, 'preJoinId');
            }else if(moduleNameArray.indexOf($scope.moduleName) >= 0){
                $scope.releventElementId = localStorage.getItem('planId');
            }else if ($scope.moduleName == 'recruitmentOfferLetter' || $scope.moduleName == 'letterDocument'){
               $scope.releventElementId = utilityService.getValue($routeParams, 'template');
            }
            else if ($scope.moduleName == 'pollsandsurveys'){
                $scope.releventElementId = utilityService.getValue($routeParams, 'id');
            }
            else if($scope.moduleName == 'lnd'){
                    $scope.releventElementId = utilityService.getValue($routeParams, 'lndId');
            }
            else if ($scope.moduleName == 'ongrid'){
                $scope.releventElementId = utilityService.getValue($routeParams, 'id');
            }else if ($scope.moduleName == 'okradmin'){
                $scope.releventElementId = utilityService.getValue($routeParams, 'id');
            }
            else if($scope.moduleName == 'helpdesk') {
                $scope.releventElementId = utilityService.getValue($routeParams, 'categoryId');    
            } else if ($scope.moduleName == 'formDocument' || $scope.moduleName == 'docDocument' || $scope.moduleName == 'exitFeedback'){
                $scope.releventElementId = utilityService.getValue($routeParams, 'id');    
            } else {
                 $scope.releventElementId = utilityService.getValue($routeParams, 'planId');
            }
        } 
        
        if(!$scope.releventElementId) {
            return false;
        }
        //console.log("relevance loaded.......");
        /********** START COMMON SECTION **********/
        var syncRelevanceModel = function(model, isApply) {
            //console.log(model)
            isApply = angular.isDefined(isApply) ? isApply : false;
            $scope.relevance = relevanceService.buildRelevanceModel(model, $scope.releventElementId, isApply, $scope.relevanceModule);
            //console.log($scope.relevance);
        };
        syncRelevanceModel();
        var syncWorkflowModel = function(model) {
            var object = {workflow: model, workflow_required: true}
            $scope.workflow = relevanceService.buildWorkflowModel(object);
        };
        var syncAssignFormModel = function(model) {
            var object = {form: model, form_required: true};
            $scope.assignForm = relevanceService.buildAssignFormModel(object);
        };
        var syncChipModel = function(item) {
            self.provisionManager = [];
            self.escalationContact = [];
            self.timeScheduler = [];
            self.specificEmployee = [];
            setChipsModel(item.manager_details, self.provisionManager);
            setChipsModel(item.manager_details, self.trainingManager);

            setChipsModel(item.escalation_contact_details, self.escalationContact);
            setChipsModel(item.time_scheduler, self.timeScheduler);
            setChipsModel(item.specific_employees_detail, self.specificEmployee);
        };
        var getCompanyWideList = function(data){                  
            switch ($scope.moduleName){
                case "provisions":
                case "lnd":
                    return [{
                    workflow: {
                        name: data.workflow_detail.name,
                        id: data.workflow_detail._id
                    },
                    is_company_wide: data.is_company_wide,
                    manager_details: data.manager_details,
                    escalation_contact_details: data.escalation_contact_details,
                    form_detail: data.form_detail,
                    assign_form: data.assign_form
                }];
                case "user_management":
                    return [{is_company_wide: data.is_company_wide}];
                default:
                    return [{is_company_wide: data.is_company_wide}];
            }
        };
        
        var getFilterList = function(value){
            switch ($scope.moduleName){
                case "user_management":
                    return null;
                default:
                    return {
                        name: value.workflow_detail.name,
                        id: value.workflow_detail._id
                    };
            }        
        };
        
        var buildList = function (data, flag) {
            if (angular.isDefined(data)) {
                flag = angular.isDefined(flag) ? flag : true;
//                $scope.relevance.salMin = angular.isDefined(data.relevance_salary_range_from) ? data.relevance_salary_range_from : null;
//                $scope.relevance.salMax = angular.isDefined(data.relevance_salary_range_to) ? data.relevance_salary_range_to : null;
                $scope.relevance.compoff_workflow = utilityService.getValue(data, 'avail_workflow');
                $scope.relevance.avail_form = utilityService.getValue(data, 'avail_form');
                $scope.relevance.travel_workflow = utilityService.getValue(data, 'travel_workflow', {international_travel_request: null, domestic_travel_request: null});
                $scope.relevance.is_category_workflow = utilityService.getValue(data, 'is_category_workflow', false);
                $scope.relevance.common_category_workflow = utilityService.getInnerValue(data, 'travel_workflow', 'common_category_workflow');
                $scope.relevance.emp_eligibility = utilityService.getValue(data, 'emp_eligibility');
                $scope.relevance.emp_joining_cutoff_date = utilityService.getDefaultDate((utilityService.getValue(data, 'emp_joining_cutoff_date')));
                if($scope.moduleName == 'recruitment'){
                    $scope.relevance.is_seek_referral = utilityService.getValue(data, 'is_seek_referral', false);
                    $scope.relevance.seek_referral_start_date = utilityService.getDefaultDate((utilityService.getValue(data, 'seek_referral_start_date')));
                    $scope.relevance.is_referral_mail = utilityService.getValue(data, 'is_referral_mail', false);
                    $scope.relevance.seek_referral_end_date = utilityService.getDefaultDate((utilityService.getValue(data, 'seek_referral_end_date')));
                }
                if($scope.moduleName == 'internal_recruitment_job_posting'){
                    $scope.relevance.internal_job_post = utilityService.getValue(data, 'internal_job_post', false);
                    $scope.relevance.is_internal_mail = utilityService.getValue(data, 'is_internal_mail', false);
                    $scope.relevance.internal_job_start_date = utilityService.getDefaultDate((utilityService.getValue(data, 'internal_job_start_date')));
                    $scope.relevance.internal_job_end_date = utilityService.getDefaultDate((utilityService.getValue(data, 'internal_job_end_date')));
                }
                if($scope.moduleName == 'holiday'){ 
                    $scope.relevance.holiday_application_before_days = utilityService.getValue(data, 'holiday_application_before_days');
                }
                if ($scope.moduleName == 'timePlan') {
                    $scope.relevance.workflow = angular.isDefined(data.regularization_workflow) ? data.regularization_workflow : null;
                    $scope.relevance.assign_form = angular.isDefined(data.regularization_assign_form) ? data.regularization_assign_form : null;
                } else {
                    $scope.relevance.workflow = angular.isDefined(data.workflow) ? data.workflow : null;
                    $scope.relevance.assign_form = angular.isDefined(data.assign_form) ? data.assign_form : null;
                }
                if (flag) {
                    syncChipModel(data);
                }
                if ($scope.moduleName == 'internal_recruitment_job_posting') {
                    if (data.internal_job_company_wide) {
                        $scope.relevance.apply = false;
                        $scope.toggleCompanyWide('view');
                        $scope.relevance.apply = true;
                    }else {
                        $scope.filterList = utilityService.getValue(data, 'internal_job_applicability', []);
                        $scope.relevance.apply = false;
                    }
                } else {
                    if (data.is_company_wide) {
                        $scope.relevance.apply = false;
//                $scope.companyWideList = getCompanyWideList(data);
                        $scope.toggleCompanyWide('view');
                        $scope.relevance.apply = true;
                    } else {
                        $scope.relevance.salMin = angular.isDefined(data.relevance_salary_range_from) ? parseInt(data.relevance_salary_range_from) : null;
                        $scope.relevance.salMax = angular.isDefined(data.relevance_salary_range_to) ? parseInt(data.relevance_salary_range_to) : null;
                        $scope.relevance.isGroup = angular.isDefined(data.is_group) ? data.is_group : false;
                        $scope.filterList = utilityService.getValue(data, 'applicability', []);
                        $scope.relevance.apply = false;
                    }
                }
            }
        };
        var getRelevanceList = function() {
            var url = relevanceService.getUrl($scope.moduleName) + "/" + $scope.releventElementId + "?module_key=" + $scope.relevanceModule.name;
            serverUtilityService.getWebService(url).then(function(data) {
                buildList(data.data);
            }); 
        };
        var getWorkflowList = function() {
            var url = relevanceService.getUrl('activeWorkflow');
            serverUtilityService.getWebService(url).then(function(data){
                syncWorkflowModel(data.data);
            });
        };
        var getAssignFormList = function () {
            var url = ($scope.moduleName == 'prejoining') ? 'user-management/form'
                : relevanceService.getUrl('assignForm') + relevanceService.returnFormType($scope.moduleName);
            
            serverUtilityService.getWebService(url).then(function(data){
                syncAssignFormModel(data.data);
            });
        };
        var buildGroupElementObject = function() {
            angular.forEach($scope.groupList, function(value, key) {
                $scope.groupObject[value._id] = value.name;
                angular.forEach(value.element_details, function(v, k) {
                    $scope.elementObject[v._id] = v.name;
                });
            });
        };
        var getGroupList = function() {
            var url = $scope.isUserManagement 
                ? relevanceService.getUrl('grplst') + "?mandatory=true" + "&field=true" 
                : relevanceService.getUrl('grplst') + "?field=true";

            serverUtilityService.getWebService(url).then(function (data) {
                $scope.groupList = data.data;
                $scope.filters = relevanceService.buildFilters($scope.groupList);
                buildGroupElementObject();
            }); 
        };  
        var getEmployeeList = function () {
            serverUtilityService.getWebService(relevanceService.getUrl('emplist')).then(function (data) {
                self.allEmployes = loadEmployeeList(data.data);
            });
        };
        getEmployeeList();
        getRelevanceList();
        getWorkflowList();
        getAssignFormList();
        getGroupList();  

        var successCallback = function(data, list, section, isAdded) {
            $scope.errorMessages = [];
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            if (angular.isDefined(data.data)) {
                if($scope.relevance.apply) {
                    $scope.companyWideList = getCompanyWideList(data.data);
                } else {
                    buildList(data.data, false);
                }
                
                $scope.relevance.apply ? $scope.toggleCompanyWide('view') 
                    : $scope.toggleAddFilter(false);
            }
            if($scope.moduleName === 'lnd'){
                $scope.settingSelected.tabIndex= 2;
            }

            $rootScope.$broadcast('get-profile-properties', {param: true, item: data.data});            
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
                if (utilityService.getValue($scope.section, 'jobPublish')
                    && utilityService.getValue(data, 'message')) {
                    alert(utilityService.getValue(data, 'message'));
                }
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        var backToList = function(moduleName) {
            if (moduleName == 'provisions' || moduleName == 'lnd') {
                var tabName = 'management';
            }
            if(moduleName === 'pollsandsurveys') {
                moduleName = 'social'
                var tabName = utilityService.getValue($routeParams, 'module')
            }
            if(moduleName == 'okradmin') {
                $location.url('/frontend/okr');
            } else {
                $location.url('/admin').search({
                    tab: moduleName,
                    subtab: tabName
                });
            }
        };
        var moduleNameNotForRedirection = ['pf', 'esi', 'user_management',
                               'resourcefile', 'resourcefolder', 'bonus', 'broadcastNotice', 'reviewCycle', 'recruitment',"internal_recruitment_job_posting", 'lnd'];
        var successErrorCallback = function (data, list, section, isAdded) {
            section = angular.isDefined(section) ? section : "relevance";
            isAdded = angular.isDefined(isAdded) ? isAdded : false;
            data.status === "success" ? 
                successCallback(data, list, section, isAdded) : errorCallback(data, section);
            
            if(angular.isDefined($scope.moduleName) && moduleNameNotForRedirection.indexOf($scope.moduleName) < 0) {
                backToList($scope.moduleName);
            }
        };
        var getList = function() {
            return $scope.relevance.apply ? $scope.companyWideList : $scope.filterList;
        };
        var createRelevance = function(url, payload, flag) {
            flag = angular.isDefined(flag) ? flag : true;
            url = url + "?module_key=" + $scope.relevanceModule.name;
            serverUtilityService.putWebService(url, payload).then(function(data) {                    
                successErrorCallback(data, getList(), "relevance", flag);
            });
        };
        var updateRelevance = function(url, payload) {
            url = url + "/" + $scope.relevance._id + "?module_key=" + $scope.relevanceModule.name;
            serverUtilityService.patchWebService(url, payload).then(function(data) {
                successErrorCallback(data, getList(), "relevance", false);
            });
        };
        var checkIfFilterNotSelected = function (conditions){
            if (Object.keys(conditions).length === 1) {
                if (Object.keys(conditions)[0] == "null" || conditions[Object.keys(conditions)[0]] == null) {
                    return false;
                }else {
                    return true;
                }
            } else {
                return true;
            }
        };
        var notCheckForFilter = ['broadcastNotice', 'payroll', 'resourcefile', 'resourcefolder', 'recruitment'];
        $scope.createUpdateRelevance = function () {
            resetErrorMessages();
            var url = relevanceService.getUrl($scope.moduleName) + "/" + $scope.releventElementId,
                    payload = getPayload();
            
            if (!$scope.relevance.apply && !checkIfFilterNotSelected(relevanceService.buildConditionObject($scope.filters)) && notCheckForFilter.indexOf($scope.moduleName) == -1) {
                alert('Please Select Filter');
                return false;
            }
            if (!$scope.relevance.apply && !$scope.broadcastNotice) {
                payload.conditions = JSON.stringify(relevanceService.buildConditionObject($scope.filters));
            }
            if ($scope.moduleName == 'recruitment' && $scope.relevance.is_seek_referral && !$scope.relevance.apply) {
                payload.conditions = JSON.stringify(relevanceService.buildConditionObject($scope.filters));
            }
            if ($scope.moduleName == 'internal_recruitment_job_posting' && $scope.relevance.internal_job_post && !$scope.relevance.apply) {
                payload.conditions = JSON.stringify(relevanceService.buildConditionObject($scope.filters));
            }
            if (!$scope.relevance.apply && $scope.broadcastNotice && $scope.relevance.isGroup) {
                payload.conditions = JSON.stringify(relevanceService.buildConditionObject($scope.filters));
            }
           
            if ($scope.relevance.apply) {
                $scope.companyWide.edit ? createRelevance(url, payload, false)
                        : createRelevance(url, payload, true);
            } else {
                utilityService.getValue($scope.relevance, '_id')
                        ? updateRelevance(url, payload) : createRelevance(url, payload);
            }
            
            if($scope.moduleName ===  'lnd') { 
                $scope.proceedToNextTab(2)
            }
        };
        $scope.createUpdateRecruitmentRelevance = function () {
            $scope.createUpdateRelevance();
        };
        $scope.deleteRelevance = function(item) {
            if (angular.isObject(item._id)) {
                angular.forEach(item._id, function (v, k) {
                    item._id = v;
                });
            }
            var url = null;
            if($scope.relevance.apply) {
                url = relevanceService.getUrl('detail') + "/" + $scope.releventElementId + "?module_key=" + $scope.relevanceModule.name;
            } else {
                url = relevanceService.getUrl($scope.moduleName) + "/" + $scope.releventElementId + "/" + item._id + "?module_key=" + $scope.relevanceModule.name;
            }
            
            serverUtilityService.deleteWebService(url).then(function(data) {
                if($scope.relevance.apply) {
                    $scope.companyWideList = utilityService.deleteCallback(data, item, $scope.companyWideList);
                    var obj = {
                        workflow : {
                            id: null
                        }
                    };
                    syncRelevanceModel(obj, true);
                    $scope.toggleCompanyWide('add');
                } else {
                    $scope.filterList = utilityService.deleteCallback(data, item, $scope.filterList);
                }
            });
        };
        var setChipsModel = function(list, model) {
            angular.forEach(list, function(value, key) {
                model.push({
                    id: value._id,
                    name: value.full_name,
                    email: value.email,
                    image: value.profile_pic ? value.profile_pic : 'images/user-icon.png'
                });
            });            
        };        
        var editRelevance = function(item) {  
            console.log(item);          
            item = angular.isDefined(item) ? item : null;
            $scope.relevance.apply = true;
            syncRelevanceModel(item, true);
            syncChipModel(item);
        };
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        /********** END COMMON SECTION **********/

        /********** START APPLY COMPANY WIDE SECTION **********/
        $scope.toggleCompanyWide = function(action, item) {            
            angular.forEach($scope.companyWide, function(value, key) {
                $scope.companyWide[key] = false;
            });
            $scope.companyWide[action] = true;
            if(action == "edit") {
                editRelevance(item);
            }
        };
        $scope.isListVisible = function(section) {
            if(section == "company-wide") {
                return ($scope.companyWide.view || $scope.companyWideList.length) 
                    && !($scope.companyWide.add || $scope.companyWide.edit);
            }            
        };
        $scope.isApplyFilterDisabled = function() {
           return !$scope.relevance.apply ? false : true;                        
        };
        /********** END APPLY COMPANY WIDE SECTION **********/

        /********** START FILTER SECTION **********/
        var getElementList = function(type) {
            var list = $scope.groupList.filter(function(item, index, arr){
                return (item._id == type) ? item : null;
            });

            return list[0].element_details;
        };
        $scope.changeGroup = function(filter) {
            filter.elements = getElementList(filter.type);
        };
        $scope.toggleFilterAction = function(action) {
            console.log('action = ' + action);
            angular.forEach($scope.filterAction, function(value, key) {
                $scope.filterAction[key] = false;
            });
            $scope.filterAction[action] = true;
            console.log($scope.filterAction[action]);
        };
        var toggleAddFilter = function(flag) {
            $scope.addFilter.status = flag;
        };
        var resetAddNewFilter = function() {
//            syncRelevanceModel();
//            self.provisionManager = [];
//            self.escalationContact = [];
            $scope.filters = relevanceService.buildFilters($scope.groupList);
        };
        $scope.toggleAddFilter = function(flag) {
            $scope.relevance._id = null;
            toggleAddFilter(flag);
            resetAddNewFilter();               
        };
        $scope.isAndDisabled = function(filter) {
            return (!filter.type || !filter.value || filter.groups.length==1);
        };
        var extractGroupList = function() {            
            var arrTypes = [],
                groupList = [];

            angular.forEach($scope.filters, function(v, k) {
                if(v.type) {
                    arrTypes.push(v.type);
                }
            });
            
            angular.forEach($scope.groupList, function(value, key) {
                if(arrTypes.indexOf(value._id) == -1 && value.element_details.length) {
                    groupList.push(value);
                }
            });
            return groupList;            
        };
        $scope.andClickHandler = function(filter, index) {
            if(index == $scope.filters.length - 1) {
                filter.className = 2;
                $scope.filters.push(relevanceService.buildDefaultFilterObject(extractGroupList()));
            }
        };
        $scope.removeFilter = function(index) {
            $scope.filters.splice(index, 1); 
            if($scope.filters.length == 0){
               //$scope.relevance._id = null;
               resetAddNewFilter();
            }
        };
        $scope.renderGroupName = function(key) {
            return angular.isDefined(key) && $scope.groupObject[key];
        };
        $scope.renderElementName = function(key) {
            return angular.isDefined(key) && $scope.elementObject[key];
        };
        $scope.editRelevance = function(item) {
            if (angular.isObject(item._id)) {
                angular.forEach(item._id, function (v, k) {
                    item._id = v;
                });
            }
            $scope.filters = [];
            $scope.relevance._id = item._id;
//            $scope.relevance.workflow = item.workflow ? item.workflow.id : null;
//            $scope.relevance.assign_form = item.assign_form;
            angular.forEach(item.scope, function(value, key) {
                var type = key,
                    filter = {
                        type: type,
                        value: value,
                        className: 2,
                        groups: $scope.groupList,
                        elements: getElementList(type)
                    };

                $scope.filters.push(filter);
            });
            toggleAddFilter(true);
            //syncChipModel(item);   
        };
        /********** END FILTER SECTION **********/

        /************ START CHIPS INTEGRATION ***********/
        function querySearchChips(criteria, allList) {
            return criteria ? allList.filter(createFilterForChips(criteria)) : [];
        }
        function createFilterForChips(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item._lowername.indexOf(lowercaseQuery) != -1);
            };
        }
        

        function loadEmployeeList(items) {
            var arr = [];
            angular.forEach(items,function (c,key){
                if(c.full_name){
                var item = {
                    id: c._id,
                    name: c.full_name,
                    code: c.employee_code,
                    image: c.profile_pic ? c.profile_pic : 'images/user-icon.png'
                };
                item._lowername = item.name.toLowerCase(); 
                arr.push(item);
                }
            });
            return arr;            
        }
        /************ END CHIPS INTEGRATION ***********/
        //////////////////get avail form list////////////////////
        var syncAvailFormModel = function(model) {
            var object = {form: model, form_required: true};
            $scope.availForm = relevanceService.buildAssignFormModel(object);
        };
        var getAvailFormList = function () {
            var url = relevanceService.getUrl('assignForm') + relevanceService.returnFormType('availForm');
            serverUtilityService.getWebService(url).then(function(data){
                syncAvailFormModel(data.data);
            });
        };
        getAvailFormList();
        $scope.clickOutSideClose = function() {
            $("._md-select-menu-container").hide();
        };
        $scope.isSaveDisabledForNotice = function () {
            return utilityService.getStorageValue('isNoticePublished') == true 
                || utilityService.getStorageValue('isNoticePublished') == "true";
        };
        $(document).ready(function() {
            $timeout(function() {
                $('.popoverOption').popover({ trigger: "hover" });
            }, 1000);
        });        
        
        // Lnd applicability
        // $scope.lnd = {
        //     capacity: {
        //         selected: 2
        //     },
        //     capacity_limit: 50,
        //     can_employee_nominate: false,
        //     can_manager_nominate: false
        // }
    }
]);