app.controller('OnBoardingTaskController', [
    '$scope', '$filter', '$mdSidenav', 'OnBoardingTaskService', 'utilityService', 'ServerUtilityService', '$mdDialog', 
    function ($scope, $filter, $mdSidenav, OnBoardingTaskService, utilityService, serverUtilityService, $mdDialog) {
        
        var self = this, lastSearch;
        self.simulateQuery = false;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;
        $scope.systemPlanOngridPlan = null
        $scope.taskList = {};
        $scope.filterHeaderList = {
            provisions: [],
            forms: [],
            letters: [],
            documents:[],
            tempTaskList: [],
            onGridList: []
        };
        $scope.onboardingList =[];
        $scope.checkLetterID = null;
        $scope.palnID = null;
        $scope.sidNavFlag = true;
        $scope.resetAllTypeFilters();
        $scope.hideSideNav = function(){
            $scope.sidNavFlag = false;
        };
        $scope.taskListVisible= false;
        $scope.getPlansDetail = function(item){
            $scope.palnID = item._id;
        };
        $scope.openLeftMenu = function(item) {
            $scope.sidNavFlag = true;
            $scope.taskList = angular.copy(item);
            $scope.systemPlanOngridPlan = utilityService.getValue($scope.taskList, 'system_plan_ongrid_plan')
            if ($scope.taskList.plans && $scope.taskList.plans.length) {
                $scope.getPlansDetail($scope.taskList.plans[0])
            }
            $mdSidenav('right').toggle();  
        };
        $scope.closeLeftMenu = function() {
            $mdSidenav('right').close();
        };
        $scope.checkLetter = function(item){
            $scope.checkLetterID = item;
        };

        $scope.time = {
            year : new Date().getFullYear(),
            month : new Date().getMonth() + 1,
            startDate: new Date(new Date(utilityService.dateToString(new Date(), '/', 'ymd') + ' 00:00:00').setDate(new Date().getDate()-60)),
            endDate: new Date(utilityService.dateToString(new Date(), '/', 'ymd') + ' 00:00:00'),
            endDateMax: new Date(new Date(new Date(utilityService.dateToString(new Date(), '/', 'ymd') + ' 00:00:00').setMonth(new Date().getMonth()+2)).setDate(0))
        };
        $scope.setEndDateMaxvalue = function(date, months) {
            $scope.time.endDateMax =  new Date(new Date(new Date(date).setMonth(new Date(date).getMonth()+months+1)).setDate(0));
        };

        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('-');
        };

        $scope.getTotalSelectedTemplates = function(item){
            $scope.totalLetter = 0;
            angular.isDefined(item) ? item : null;
            if (angular.isDefined(item)) {
                angular.forEach(item, function(value, key) {
                    if(value.selected_template.length){
                        $scope.totalLetter = $scope.totalLetter+ 1;
                    }
                });
                return $scope.totalLetter;
            }
        };
        $scope.getSelectedPlans = function (item){
            var count = 0;
            angular.isDefined(item) ? item : null;
            if (angular.isDefined(item) && item!=null) {
                angular.forEach(item, function(value, key) {
                    if(angular.isDefined(value.selected_plan) && value.selected_plan !== ""){
                        count = count + 1;
                    }
                });
            }
            return count;
        };        
        $scope.getSelectedRelationship = function (item){
            var count = 0;
            angular.isDefined(item) ? item : null;
            if (angular.isDefined(item) && item!=null) {
                angular.forEach(item, function(value, key) {
                   if(value !== null && angular.isDefined(value)){
                       count = count + 1;
                   }
                });
            }
            return count;
        };        
        $scope.selectedDetails = function(form, selectedForm){
            if(angular.isArray(selectedForm)){
              return selectedForm.indexOf(form._id) >= 0 ? true : false; 
            }
        };
        $scope.selectedModules = function(module,selectedSlug){
            return selectedSlug.indexOf(module.slug) >= 0 ? true : false;
        };
        $scope.toggleFormSelection = function(array, item) {
            var idx = array.indexOf(item._id);
            idx > -1 ? array.splice(idx, 1) : array.push(item._id);
        };        
        var rebuildOnboardingList = function() {
            angular.forEach($scope.onboardingList, function(value, key) {
                synchipData(value);
                value.full_name = value.candidate_detail.full_name;
                value.joining_date = value.work_profile_joining_date;
                value.joiningDateTimestamp = value.work_profile_joining_date ? utilityService.getDefaultDate(value.work_profile_joining_date, false, true).getTime() : 0;
                value.copy_selected_form = [];
                value.copy_selected_document = [];
                value.copy_selected_provision = [];
                value.copy_selected_relationship = [];
                value.copy_selected_module = [];
                value['isSelected'] = false;
                angular.copy(value.selected_form, value.copy_selected_form);
                angular.copy(value.selected_document, value.copy_selected_document);
                angular.copy(value.selected_provision, value.copy_selected_provision);
                angular.copy(value.selected_relationship, value.copy_selected_relationship);
                angular.copy(value.selected_module, value.copy_selected_module); 
                $scope.calculateFacadeCountOfAllFilters($scope.onboardingList, allFilterObject, value);
            });
        };
        var synchipData = function (data){
            self.selectedItem = {};
            angular.forEach(data.relationship, function (value, key){ 
                angular.forEach(data.selected_relationship, function (v, k){
                    if(value.slug == v.slug && v.emp_detail.length){
                        value.relationId = v.emp_detail[0]._id;
                        self.selectedItem[value.slug] = v.emp_detail[0];
                    }
                });
            });
        };      
        var allFilterObject = [
            {countObject: 'group', isGroup: true, collection_key:'candidate_detail'},
            {countObject: 'form', collection: $scope.filterHeaderList.forms, isArray: true, key: 'selected_form'},
            {countObject: 'document', collection:$scope.filterHeaderList.documents, isArray: true, key: 'selected_document'},
            {countObject: 'type', collection:$scope.filterHeaderList.provisions, isArray: true, key: 'selected_provision'}
        ];        
        var getOnboardingList = function() {
            $scope.resetFacadeCountObject(allFilterObject);
            var url = OnBoardingTaskService.getUrl('onboarding');
            payload = { start: ($scope.formatDate($scope.time.startDate)), end : ($scope.formatDate($scope.time.endDate)) };
            serverUtilityService.getWebService(url, payload).then(function(data) {
                $scope.onboardingList = data.data;
                rebuildOnboardingList();
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                $scope.onboardingList1 = data.data;
                $scope.taskListVisible= true;
            });
        };  
        $scope.setQueryNewvalue = function() {
            if($scope.time.endDate != null) {
                getOnboardingList();
            } 
        }      
        var getFormDetails = function() {
            var url = OnBoardingTaskService.getUrl('form');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.formList = data.data;
                angular.forEach(data.data, function (v, k) {
                    $scope.filterHeaderList.forms.push(v._id)
                });
            });
        };        
        var getDocumentDetails = function() {
            var url = OnBoardingTaskService.getUrl('document');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.documentList = data.data;
                 angular.forEach(data.data, function (v, k) {
                    $scope.filterHeaderList.documents.push(v._id)
                });
            });
        };
        var getProvisionDetails = function() {
            var url = OnBoardingTaskService.getUrl('provision');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.provisionList = [];
                angular.forEach(data.data, function (v, k) {
                    if (v.enabled) {
                        $scope.provisionList.push(v);
                        $scope.filterHeaderList.provisions.push(v._id);
                    }
                });
            });
        };
        var getOnGridDetails = function() {
            var url = OnBoardingTaskService.getUrl('onGrid');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.onGridList = data.data;
                 angular.forEach(data.data, function (v, k) {
                    $scope.filterHeaderList.onGridList.push(v._id)
                });
            });
        };
        var getLettersDetails = function() {
            var url = OnBoardingTaskService.getUrl('letters');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.letterList = data.data;
            });
        };
        var getEmployeeDetails = function() {
            var url = OnBoardingTaskService.getUrl('getEmployee');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.employeeList = data.data;
                self.repos = loadAll();
            });
        };
        getEmployeeDetails();
        getLettersDetails();
        getProvisionDetails();
        getOnGridDetails()
        getDocumentDetails();
        getFormDetails();
        getOnboardingList();        
        $scope.isAll = {
            count: 0,
            flag: false
        };
        $scope.selectDeselectUser = function (isAll) {
            $scope.hideSideNav();
            var count = 0;
            angular.forEach($scope.onboardingList, function (value, key) {
                for(var i=0; i<$scope.filterHeaderList.tempTaskList.length; i++){
                    if(value._id.$id == $scope.filterHeaderList.tempTaskList[i]._id.$id){
                        value.isSelected = isAll;
                        break;
                    }
                }
                if (value.isSelected) {
                    count += 1;
                }
            });
            $scope.isAll.count = count;
            $scope.isAll.flag = isAll;
        };
        $scope.updateCount = function() {
            var count = 0;
            angular.forEach($scope.onboardingList, function (value, key) {
                if (value.isSelected) {
                    count += 1;
                }
            }); 
            $scope.isAll.count =  count;
            $scope.isAll.flag = (count == $scope.onboardingList.length ) ? true : false;            
        };        
        $scope.finalizeTask = function() {            
            var candidatesID = [];
            angular.forEach($scope.onboardingList, function(value,key) {
                if(value.isSelected){
                    candidatesID.push(value.candidate_detail._id);
                }
            });
            if(!candidatesID.length){
                return false;
            }
            var url = OnBoardingTaskService.getUrl('finalTask'),
                payload = {
                    candidates: candidatesID
                };

            serverUtilityService.postWebService(url ,payload)
                .then(function(data) {
                    saveSuccessErrorCallback(data);
                    if(data.status == 'success'){
                        $scope.wizardSetting('onboarding-status');
                    }
                });
        };

        $scope.confirmFinalizeTask = function () {
            showConfirmDialog(event, $scope.finalizeTask)
        }

        $scope.updateOnboardingTask = function(systemPlanOngridPlan){
            $scope.selectedPlans = {};
            var url = OnBoardingTaskService.getUrl('task') + "/" + $scope.taskList.candidate_detail._id,
                payload = {},
                letterDetails = [],
                planList = [],
                relationshipList = [],
                planDetails ={
                    slug : null,
                    value: null

                };

            payload.forms = $scope.taskList.copy_selected_form;
            payload.documents = $scope.taskList.copy_selected_document;
            payload.provisions = $scope.taskList.copy_selected_provision;
            if(systemPlanOngridPlan){
                payload.system_plan_ongrid_plan = systemPlanOngridPlan
            }
            /* Start building Payload for templates */
            angular.forEach($scope.taskList.letter_details, function(value,key) {
                if(value.selected_template.length){
                        letterDetails.push(value.selected_template);
                }
            });

            /* Start building Payload for plans */
            angular.forEach($scope.taskList.plans, function(v, k) {
                if(angular.isDefined($scope.selectedPlans[v.slug])) {
                    if(v.selected_plan) {
                        $scope.selectedPlans[v.slug].push(v.selected_plan);
                    }                                        
                } else {
                    $scope.selectedPlans[v.slug] = [];
                    if(v.selected_plan) {
                        $scope.selectedPlans[v.slug].push(v.selected_plan);
                    }
                }
            });

            angular.forEach($scope.taskList.relationship, function(value,key) {
                if (angular.isDefined(value.relationId) && value.relationId!=null) {
                    var relationshipDetails = {
                        id: null,
                        value: null
                    };
                    relationshipDetails.id = value.relationship_id;
                    relationshipDetails.value = value.relationId;
                    relationshipList.push(relationshipDetails);
                }
            });
            angular.forEach($scope.selectedPlans, function(v, k) {
                if(v.length)  {
                    planList.push({
                        slug: k,
                        value: v,
                    });
                }                
            });

            payload.letters = letterDetails;
            payload.plans = planList;
            payload.relationship = relationshipList;
            serverUtilityService.putWebService(url ,payload)
                .then(function(data) {
                    saveSuccessErrorCallback(data);
                });
        };
        var saveSuccessErrorCallback = function(data){
            if(data.status === "success") {
                $scope.isAll = false;
                utilityService.showSimpleToast(data.message);
                getOnboardingList();
                $scope.hideSideNav();
                $scope.resetAPIError(false, null, "candidateofferstatus");
            } else if(data.status === "error") {
                 $scope.errorMessages.push(data.message);
                $scope.resetAPIError(true, data.message, "candidateofferstatus");
            } else if(data.data.status === "error") {
                $scope.errorMessages = [];    
                utilityService.resetAPIError(true, "Something went wrong", "candidateofferstatus");
                angular.forEach(data.data.message, function(value, key){
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };

        /************ START SIGNATORY AUTOCOMPLETE ************/
        function querySearch(query) {
            return query ? self.repos.filter(createFilterFor(query)) : self.repos;
        }
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }            
        }
        function selectedItemChange(item, model, key) {
            model[key] = null;
            if (angular.isDefined(item) && item && angular.isDefined(model[key])) {
                    model[key] = angular.isObject(item._id)? item._id.$id : item._id;
            }
        }
        function loadAll() {
            var repos = $scope.employeeList;
            return repos.map(function (repo) {
                repo['full_name'] = repo.full_name ? repo.full_name : '';
                repo.value = repo.full_name.toLowerCase();
                return repo;
            });
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }
        /************ END SIGNATORY AUTOCOMPLETE ************/
        $scope.$watch('filterHeaderList.tempTaskList', function (newVal, oldVal) {
            $scope.filterHeaderList.tempTaskList = newVal;
            if(newVal.length == $scope.onboardingList.length){
                $scope.updateCount();
            } 
        }, true);
        $scope.updatePaginationSettings("nhm_offer_task_page", $scope.onboardingList.length);    
        var showConfirmDialog = function (event, functionName, detail, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                // .title('Do you wish to continue ?')
                // .textContent('Please check whether all the relevant documents and forms are assigned to the candidate before proceeding further')
                .htmlContent("<h1 class='blue'>Do you wish to continue ? </h1> <p class='md-body-1'>Please check whether all the relevant documents and forms are assigned to the candidate before proceeding further.</p></br></br><p class='md-body-1'>Note : No documents and forms would be assigned to the candidate if not selected. Please check now and then proceed, as you would not be able to assign them later.</p>")
                .ariaLabel('')
                .targetEvent(event)
                .ok('Proceed')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                functionName(detail, item, event);
            }, function() {
                console.log('Close confirm dialog');
            });
        };

        /***** Start: Search by employee name and code section */
        $scope.usermanagent = {
            searchKey: 'full_name',
            searchText: 'Search by Candidate Name'
        };
        $scope.changeSearchTextHandler = function (search) {
            $scope.name_filter = {};
            $scope.usermanagent.searchText = search == 'applicant_id' 
                ? 'Search by Applicant ID' : 'Search by Candidate Name';
        };
        /***** End: Search by employee name and code section */

    }
]);