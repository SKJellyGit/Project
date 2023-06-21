app.controller('PerformenceReviewsAdminController', [
    '$scope', '$rootScope', '$timeout', '$routeParams', '$location', '$modal', '$mdDialog', 'AdminReviewCycleService', 'Upload', 'utilityService', 'ServerUtilityService', 'GoalCompetencyService',
    function ($scope, $rootScope, $timeout, $routeParams, $location, $modal, $mdDialog, AdminReviewCycleService, Upload, utilityService, serverUtilityService, goalCompetencyService) {
        var dialogActionObject = AdminReviewCycleService.buildDialogActionObject();

        var self = this;
        self.notifyTo = [];
        self.allEmployees = [];
        self.querySearchChips = querySearchChips;

        $scope.reviewsObject = {
            template: {
                list: [],
                searchTempType: {
                    type: 0, 
                    status: 0
                },
            },
            uploadedFile: null,
            isBulkVisible: true,
            isListVisible: false,
            repositoryList: [],
            repositoryFilteredList: [],
            reviewCycleList: [],
            statusObj : AdminReviewCycleService.buildRCStatusObj(),
            repoCsvColoumns: {
                'Employee Details': 'full_name',
                'Employee Id': 'employee_code',
            },
            routeFlags: {
                repository: utilityService.getValue($routeParams, 'repository', 11),
                callback: utilityService.getValue($routeParams, 'callback')
            },
            pageName:{
                0: 'performence_review_cycle' , 
                1: 'performence_review_template',  
                2: 'performence_review_goal',  
                3: 'performence_review_compentency'  
            },
            selectedCycle: null,
            copyCycle: {
                source: {
                    id: null,
                    name: null
                },
                destination: {
                    id: null,
                    name: null
                }
            },
            cycleStatus: null,
            addEmployees: {
                cycle_id: null,
                cycle_name: null
            }
        };
        $scope.errorMessages = [];

        /**** This object has been introdiced later for goal/competency popup ****/
        $scope.overview = {
            empDetails: {
                selected: {},
                visible: false
            },
            isEditable: false,
            section: {
                title: 'okr'
            },
            goalCompetencyList: [],
            selectedCycle: null,
            cycle: {
                list: [],
                visible: false
            },
            enableWeightage: false,
            goalIsEmployeeAdd : false
        };
        var allFilterObject = goalCompetencyService.buildAllFilterObject();
        $scope.template = AdminReviewCycleService.buildTemplateObject();
        $scope.category = {
            type: 1,
            list: []
        }
        /*********** Tab1: Review Cycle ***********/
        $scope.createReviewCycle = function (item, step) {
            var currentstep = 0, nextstep = currentstep + 1;
            if(item != undefined && utilityService.getValue(item, 'step_completed')) {
                var currentstep = utilityService.getKeyByValue(AdminReviewCycleService.buildTabSlug(), item.step_completed);
                var nextstep = parseInt(currentstep) + 1;
            }
            if(item != undefined && item.is_consolidated_rating && utilityService.getValue(item, 'step_completed')) {
                if(currentstep == 4) { nextstep = 4.5; } else if(currentstep == 4.5) { nextstep = 5; }
            }
            step = angular.isDefined(step) && !isNaN(step)
                ? step 
                : (utilityService.getValue(item, 'step_completed') 
                    ? nextstep
                    : 1);
            
            var obj = {moduleName: 'reviewCycle'};
            if(item){
                obj.planId = item.cycle_id;
                obj.step = step;
            };
            $location.url('frontend/adminPerformance/reviewCycle').search(obj);
        };        
        $scope.manageReviewCycle = function (item) {
            $location.url('frontend/adminPerformance/manage-review-cycle').search({cycle_id: item.cycle_id, status:item.status});;  
        };
        $scope.goTopreview = function (item) {
            $location.url('frontend/adminPerformance/launch-review-cycle').search({
                planId: item.cycle_id, 
                // step: 7,
                moduleName: 'reviewCycle',
                page: 'previewPreviewCycle'
            });
        };
        var getAllReviewCycle = function (urlPrefix) {
            var url = angular.isDefined(urlPrefix) 
                ? (AdminReviewCycleService.getUrl(urlPrefix) + "/" + ($scope.selectedTabs.reviewsTab == 2 ? 11 : 12))
                : AdminReviewCycleService.getUrl('getAllReviewCycle');
            
            serverUtilityService.getWebService(url)
                .then(function (data){
                    console.log(data.data);
                    $scope.reviewsObject.reviewCycleList = data.data;
                    $scope.reviewsObject.isListVisible = true;
                });
        };
        if ($scope.selectedTabs && $scope.selectedTabs.reviewsTab == 0) {
            getAllReviewCycle();
        }

        /*********** Tab2:Template ***********/
        $scope.buildTemplate = function () {
            toggleModal('createPerformenceReviewTemplate', 'createPerformenceReviewTemplate.html', true)
        };
        $scope.createSelectedTemplate = function (type, item) {            
            /*$timeout(function () {
                toggleModal('createPerformenceReviewTemplate', 'createPerformenceReviewTemplate.html', false);
            }, 200);*/
            var searchObj = {
                module: 'appraisal',
                submodule: 'form',
                module_key: 'appraisal',
                formType: type // 11 - goal, 12-competency
            };
            if(angular.isDefined(item)) {
                searchObj.form = item._id;
                if(item.status && !item.is_drafted && item.in_use) {
                    searchObj.isDisabled = 1;
                }
            }
            $location.url('form-builder').search(searchObj);
        };       
        var getAllTemplates = function () {
            var url = AdminReviewCycleService.getUrl('getAllTemplate');
            serverUtilityService.getWebService(url)
                    .then(function (data){
                        $scope.reviewsObject.template.list = data.data;
                        $scope.reviewsObject.isListVisible = true;
                    });
        };
        if ($scope.selectedTabs && $scope.selectedTabs.reviewsTab == 1) {
            getAllTemplates();
        }        
        $scope.changeStatus = function(item) {
            var url = AdminReviewCycleService.getUrl('form') + "/" + item._id;
            serverUtilityService.patchWebService(url)
                .then(function (data) {
                    if(data.status == 'success'){
                        utilityService.showSimpleToast('Template Status Updated Successfuly');
                        utilityService.refreshList($scope.reviewsObject.template.list, data.data);
                    }
                });
        };        
        $scope.templateTypeFilter = function (item) {
            if($scope.reviewsObject.template.searchTempType.type != 0) {
                if(item.type == $scope.reviewsObject.template.searchTempType.type) {
                    return item;
                }
            } else {
                return item;
            }            
        };        
        $scope.templateStatusFilter = function (item) {
            if($scope.reviewsObject.template.searchTempType.status != 0) {
                if($scope.reviewsObject.template.searchTempType.status == 1 
                    && item.is_drafted) {
                    return item;
                } else if($scope.reviewsObject.template.searchTempType.status == 2 
                    && item.status && !item.is_drafted && item.in_use) {
                    return item;
                } else if($scope.reviewsObject.template.searchTempType.status == 3 
                    && item.status && !item.is_drafted && !item.in_use) {
                    return item;
                } else if($scope.reviewsObject.template.searchTempType.status == 4 
                    && !item.status && !item.is_drafted) {
                    return item;
                }
            } else {
                return item;
            }            
        };
        
        /*********** Tab3/Tab4:Goal/OKR And Competency ***********/
        $scope.goToRepositoryPage = function (url, type, direction) {
            direction = angular.isDefined(direction) ? direction : false;
            if (direction) {
                $location.url(url).search({
                    repository: type,
                    selectedCycle: $scope.reviewsObject.selectedCycle
                });
            } else if($scope.reviewsObject.routeFlags.callback == 'feedback') {
                $location.url('dashboard/my-team').search({
                    subtab: $scope.reviewsObject.routeFlags.callback
                });
            } else {
                var searchObj = {tab: 2}
                searchObj.subtab = type == 11 ? 2 : type == 12 ? 3 : null;
                $location.url(url).search(searchObj);
            }
        };
       
        var checkTheCategoryType = function(type, id){
            var url = AdminReviewCycleService.getUrl('getCategories') + '/' + type + '/' + id;
            serverUtilityService.getWebService(url)
                .then(function (data){
                    if(utilityService.getValue(data, 'status') === 'success'){
                        console.log(data)
                        $scope.category.type = utilityService.getValue(data, 'type', 1)
                        $scope.category.list = utilityService.getValue(data, 'data', [])
                    }
                });
        }
        var getRepositoryDetails = function () {
            var type = {2: 11, 3: 12},
                url = AdminReviewCycleService.getUrl('getRepoDetails') + "/" 
                    + type[$scope.selectedTabs.reviewsTab] + "/" 
                    + $scope.reviewsObject.selectedCycle;
            
            $scope.reviewsObject.repositoryList = [];
            $scope.reviewsObject.isListVisible = false;
            checkTheCategoryType(type[$scope.selectedTabs.reviewsTab],$scope.reviewsObject.selectedCycle)
            serverUtilityService.getWebService(url)
                .then(function (data){
                  
                    $scope.appraisal.titleTabOne = utilityService.getInnerValue(data, 'data', 'goal_display_name') 
                        ? utilityService.getInnerValue(data, 'data', 'goal_display_name')
                        : $scope.appraisal.titleTabOne;
                    $scope.appraisal.titleTabTwo = utilityService.getInnerValue(data, 'data', 'competency_display_name')
                        ? utilityService.getInnerValue(data, 'data', 'competency_display_name')
                        : $scope.appraisal.titleTabTwo;
                    $scope.resetFacadeCountObject(allFilterObject);
                    var repositoryList = utilityService.getInnerValue(data, 'data', 'csv_param', []);
                    angular.forEach(repositoryList, function (v, k){
                        v.employee_code = v.employee_details.employee_code
                        v.full_name = v.employee_details.full_name,
                        v.repoDetails = $scope.selectedTabs.reviewsTab == 2 ? v.goals : v.compentencies;

                        if($scope.selectedTabs.reviewsTab == 2) {
                            var object = goalCompetencyService.buildGoalCompetencyList(v, 'goals');
                            v.goalList = object.list;
                            v.goalCount = object.count;
                        } else {
                            var object = goalCompetencyService.buildGoalCompetencyList(v, 'compentencies');
                            v.competencyList = object.list;
                            v.competencyCount = object.count;
                        }
                        if(utilityService.getInnerValue(data, 'data', 'enable_add_employee')) {
                            $scope.overview.goalIsEmployeeAdd = true;
                        } else {
                            $scope.overview.goalIsEmployeeAdd = false;
                        }
                        $scope.calculateFacadeCountOfAllFilters(data, allFilterObject, v);                        
                    });
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);

                    var key = $scope.selectedTabs.reviewsTab == 2 ? 'Golas/OKR' : '"Compentency/Behaviour';
                    $scope.reviewsObject.repoCsvColoumns[key] = 'repoDetails';
                    $scope.reviewsObject.repositoryList = repositoryList;
                    $scope.reviewsObject.cycleStatus = utilityService.getInnerValue(data, 'data', 'cycle_status');
                    $scope.reviewsObject.isListVisible = true;
                });
        };
        if ($scope.selectedTabs && ($scope.selectedTabs.reviewsTab == 2 || $scope.selectedTabs.reviewsTab == 3)) {
            $scope.resetAllTypeFilters();
            getAllReviewCycle('repositoryReviewCycle');
        }
        $scope.changeReviewCycle = function() {
            getRepositoryDetails();
        };
        
        /*********** Bulk Upload Section ***********/        
        $scope.selectFile = function (file){
            $scope.reviewsObject.uploadedFile = file;
        };
        
        var uploadProgressCallback = function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };
        var uploadSuccessCallback = function (response) {            
            if (angular.isDefined(response) && angular.isDefined(response.data) 
                && !response.data.status) {
                getAlphaIndexing(response);
                $scope.data = [];
                angular.forEach(response.data, function (val, key) {
                    var isError = false;
                    angular.forEach(val, function (v, k) {
                        if (angular.isDefined(v.error) && v.error.length) {
                            isError = true;
                        }
                    });
                    isError ? $scope.data.push(val) : null;
                });
                $scope.parsedCsv = $rootScope.errCount == 0 ? response.data : $scope.data;
                $scope.dataList = response.data;
                $timeout(function () {
                    $scope.reviewsObject.isBulkVisible = true;
                }, 100);
            }
            if(response.data.status == 'error' ) {
               $scope.reviewsObject.isBulkVisible = true;
                $scope.errorMessages.push(response.data.message);
            } else {
                utilityService.showSimpleToast(response.data.message)
            }
        };        
        var uploadErrorCallback = function (response){
            var msg = response.data.message ? response.data.message : "Something went worng.";
            $scope.errorMessages.push(msg);
        };        
        $scope.changeList = function (key) {
            $scope.parsedCsv = key == 'all' ? $scope.dataList : $scope.data;
        };        
        $scope.upload = function () {
            $scope.errorMessages = [];
            $scope.reviewsObject.isBulkVisible = false;
            var data = {
                    upload_csv: $scope.reviewsObject.uploadedFile
                },
                urlPrefix = $scope.reviewsObject.routeFlags.callback == 'feedback' 
                    ? 'uploadTeamRepoFormat' : 'uploadRepoFormat';

            Upload.upload({
                url: AdminReviewCycleService.getUrl(urlPrefix) 
                    + "/" + $scope.reviewsObject.routeFlags.repository
                    + "/" + utilityService.getValue($routeParams, 'selectedCycle'),
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: data
            }).then(function (response) {
                uploadSuccessCallback(response);
            }, function (response) {
                uploadErrorCallback(response);
            }, function (evt) {
                uploadProgressCallback(evt);
            });
        };

        /************ CSV ALPHABETS INDEXING ************/       
        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        var getAlphaIndexing = function (resp) {
            $rootScope.errCount = 0;
            var data = [];
            angular.forEach(resp.data, function (val, key) {
                data.push(val);
                angular.forEach(val, function (v, k) {
                    if (v.error.length) {
                        $rootScope.errCount += 1;
                    }
                });
            });
            $rootScope.totalRecords = data.length;
            $rootScope.alphIndex = [];
            var len = Object.keys(data[0]).length;
            var counter = -1;
            for (var i = 0; i < len; i++) {
                if (i % 26 == 0 && i != 0) {
                    counter = counter + 1;
                }
                if (i > 25) {
                    $rootScope.alphIndex.push(alphabets[counter % 26] + alphabets[(i % 26)]);
                } else {
                    $rootScope.alphIndex.push(alphabets[i]);
                }
            }
            $scope.flag = true;
        };        
        $scope.downloadRepoFormat = function (type) {
            var url = AdminReviewCycleService.getUrl('downloadRepoFormat') + '/' + $scope.reviewsObject.routeFlags.repository
                + '/' + utilityService.getValue($routeParams, 'selectedCycle');
            serverUtilityService.getWebService(url)
                .then(function (data){
                    if (data.status == 'success') {
                        window.location.assign(data.data);
                    } else {
                        alert('Something went wrong.');
                    }
                });
        };
        var toggleModal = function (instance, templateUrl, flag) {
            flag = angular.isDefined(flag) ? flag : false;
            flag ? $scope.openModal(instance, templateUrl) : $scope.closeModal(instance);
        };
        $scope.openModal = function (instance, templateUrl, size) {
            var modalObject = {
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass: 'fadeEffect'
            };

            if(angular.isDefined(size)) {
                modalObject.size = size;
            }
            $scope.modalInstance[instance] = $modal.open(modalObject);
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };        
        if ($scope.selectedTabs){
            $scope.updatePaginationSettings($scope.reviewsObject.pageName[$scope.selectedTabs.reviewsTab]);
        }        
        $scope.exportToCsv = function() {
            var csvData = goalCompetencyService.buildCSVData($scope.reviewsObject.repositoryFilteredList, $scope.selectedTabs.reviewsTab, $scope.appraisal),
                fileName = 'performance-' + ($scope.selectedTabs.reviewsTab == 2 
                    ? 'goals' : 'competencies') + '.csv';

            utilityService.exportToCsv(csvData, fileName);
        };
        $scope.clickOutSideClose = function() {
            $("._md-select-menu-container").hide();
        };
        $scope.changeTemplateType = function() {
            $scope.template.origin = 1;
            $scope.template.form_id = null;
        };
        $scope.createTemplate = function() {
            $scope.template = AdminReviewCycleService.buildTemplateObject();
            $scope.openModal('createPerformenceReviewTemplate', 'createPerformenceReviewTemplate.html');
        };
        $scope.saveTemplate = function() {
            $scope.errorMessages = [];
            var url = AdminReviewCycleService.getUrl('createTempate'),
                payload = AdminReviewCycleService.buildTemplatePayload($scope.template);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data);
                });
        };
        $scope.deleteReviewCycle = function (item) {
            var url = AdminReviewCycleService.getUrl('deleteCycle') + "/" + item.cycle_id;

            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    if (utilityService.getValue(data, 'status') === 'success') {
                        utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                        getAllReviewCycle();
                    } else {
                        alert(utilityService.getValue(data, 'message'));
                    }
                });
        };
        $scope.copyReviewCycle = function (item) {
            $scope.reviewsObject.copyCycle.source.id = item.cycle_id;
            $scope.reviewsObject.copyCycle.source.name = item.cycle_name;
            $scope.openModal('copyCycle', 'copy-review-cycle.tmpl.html', 'sm');
        };
        $scope.updateCycleName = function () {
            var url = AdminReviewCycleService.getUrl('copyCycle') 
                + "/" + $scope.reviewsObject.copyCycle.source.id,
                payload = {
                    cycle_name: $scope.reviewsObject.copyCycle.destination.name
                };

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (utilityService.getValue(data, 'status') === 'success') {
                        utilityService.getValue(utilityService.getValue(data, 'message'));
                        $scope.closeModal('copyCycle');
                        $scope.createReviewCycle({cycle_id: utilityService.getInnerValue(data, 'data', '_id')}, 1);
                    } else {
                        alert(utilityService.getValue(data, 'message'));
                    }
                });
        };

        /***** Start: View/Update Goal & Competency Section ******/
        $scope.viewEditOkrCompetency = function(item, isEditable) {
            utilityService.resetAPIError(false, null, 'weightage');
            $scope.overview.goalCompetencyList = [];
            angular.copy(item, $scope.overview.empDetails.selected);
            $scope.overview.isEditable = isEditable;
            $scope.overview.enableWeightage = utilityService.getValue(item, 'is_weightage', false);
            $scope.overview.selectedCycle = $scope.reviewsObject.selectedCycle;
            if($scope.selectedTabs.reviewsTab == 2) {
                $scope.overview.section.title = $scope.appraisal.titleTabOne;
                $scope.overview.goalCompetencyList = item.goalList;
            } else {
                $scope.overview.section.title = $scope.appraisal.titleTabTwo;
                $scope.overview.goalCompetencyList = item.competencyList;
            }

            angular.forEach($scope.overview.goalCompetencyList, function(value, key) {
                value.editableMode = false;
            });
            
            $scope.openModal('teamGoalCompetency', 'view-edit-okr-competency.tmpl.html', 'lg');
            $scope.calculateWeightage()

        };        
        $scope.addMoreGoalCompetency = function() {
            $scope.overview.goalCompetencyList.push({
                editableMode: true,
                text: "",
                description: "",
                header: "",
                isDefault: false
            });

            var $target = $('.kraCompetencyContainer');
            $target.animate({scrollTop: $target.height()}, 1000); 
        };
        $scope.changeEditableMode = function(item, flag) {
            item.editableMode = flag;
        };
        $scope.removeGoalCompetency = function(index) {
            $scope.overview.goalCompetencyList.splice(index, 1);
        };
        $scope.updateGoalCompetency = function(draft) {
            var template = $scope.selectedTabs.reviewsTab == 2 ? 11 : 12,
                url = goalCompetencyService.getUrl('updateAdminGoalCompetency') + "/" + template 
                    + "/" + $scope.overview.selectedCycle
                    + "/" + utilityService.getInnerValue($scope.overview.empDetails.selected, 'employee_details', '_id'),
                payload = utilityService.buildGoalCompetencyPayload($scope.overview);
                if(draft){
                    payload.is_draft = true
                }
            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    if(utilityService.getValue(data, 'status') == 'success') {
                        $scope.closeModal('teamGoalCompetency');
                        getRepositoryDetails();
                        utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                    } else if (utilityService.getInnerValue(data, 'data', 'message')
                        && angular.isObject(utilityService.getInnerValue(data, 'data', 'message'))) {
                        var messageArray = utilityService.getInnerValue(data, 'data', 'message'),
                            dataArray = utilityService.getValue(messageArray, 'data', []),
                            message = dataArray.join(',');
                        utilityService.resetAPIError(true, message, 'weightage');
                    } else {
                        utilityService.resetAPIError(true, data.message, 'weightage');
                    }                   
                });
        };
        /***** End: View-Edit Goal & Competency Section ******/

        /***** Start: Generic Function Section *****/
        var successCallback = function(data, section){
            $scope.closeModal('createPerformenceReviewTemplate');
            var item = {
                _id: utilityService.getInnerValue(data, 'data', '_id'),
                status: 1,
                is_drafted: true,
                in_use: false
            };
            $scope.createSelectedTemplate($scope.template.type, item);
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, 'userManagementForms');
            } else {
                utilityService.resetAPIError(true, "something went wrong", 'userManagementForms');
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        var successErrorCallback = function(data, section) {
            return utilityService.getValue(data, 'status') == 'success' 
                ? successCallback(data, section) : errorCallback(data, section);
        };
        /***** End: Generic Function Section *****/

        /***** Start: Run Cron Job Section *****/
        var runCronJobCallback = function (data) {
            if(utilityService.getValue(data, 'status') == 'success') {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            } else {
                alert(utilityService.getValue(data, 'message'));
            }
        };
        var runCronJob = function (url) {
            serverUtilityService.postWebService(url, {})
                .then(function(data) {
                    runCronJobCallback(data);                          
                });
        };
        $scope.runAssignEmployeeCycleCronJob = function (item) {
            runCronJob(AdminReviewCycleService.getUrl('runAssignEmployeesCronJob') + "/" + item.cycle_id);
        };
        $scope.runAssignQuestionsCronJob = function (item) {
            runCronJob(AdminReviewCycleService.getUrl('runAssignQuestionsCronJob') + "/" + item.cycle_id);
        };
        /***** End: Run Cron Job Section *****/        

        /***** Start Confirm Dialog *****/
        var showConfirmDialog = function(event, functionName, item, action, index) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title(dialogActionObject[action].title)
                .textContent(dialogActionObject[action].textContent)
                .ariaLabel('Lucky day')
                .targetEvent(event)
                .ok(dialogActionObject[action].ok)
                .cancel(dialogActionObject[action].cancel);

            $mdDialog.show(confirm).then(function() {
                action === 'removeGoalCompetency' ? functionName(index) : functionName(item);
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.showConfirmDialog = function(event, functionName, item, action, index) {
            showConfirmDialog(event, functionName, item, action, index);
        };
        /***** End Confirm Dialog *****/

        /******** Start Chip Integration **********/
        $scope.isSelectCycle = false;
        var getUnAssignedEmployeesOfReviewCycle = function() {
            var url = AdminReviewCycleService.getUrl('unAssignedEmployees') + '/' 
                + $scope.reviewsObject.addEmployees.cycle_id;

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.employeeList = [];
                    angular.forEach(data.data, function(value, key) {
                        if(value.full_name) {
                            $scope.employeeList.push(value);
                        }
                    });
                    self.allEmployees = loadChipList();
                    $scope.openModal('addEmployeeInCycle', 'add-employee-in-running-cycle.tmpl.html', 'md');
                });
        };  
        function querySearchChips(keyword) {
            return keyword ? self.allEmployees.filter(createFilterForChips(keyword)) : [];
        }
        function createFilterForChips(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(approver) {
                return (approver._lowername && approver._lowername.indexOf(lowercaseQuery) != -1);
            };
        }
        function loadChipList() {
            var list = $scope.employeeList;
            return list.map(function (c, index) {
                var object = {
                    id: c._id,
                    name: c.full_name,
                    image: utilityService.getValue(c, 'profile_pic', 'images/no-avatar.png'),
                    empCode: utilityService.getValue(c, 'personal_profile_employee_code')
                };
                object._lowername = utilityService.getValue(object, 'name') 
                    ? object.name.toLowerCase() : null;

                if (utilityService.getValue(object, 'empCode')) {
                    object.name = object.name + ' (' + object.empCode + ')';
                }

                return object;
            });
        }
        /******** End Chip Integration **********/

        /***** Start: Add Employees in a running cycle *****/
        $scope.addEmployeesToReviewCycle = function (item) {
            self.notifyTo = [];
            $scope.isSelectCycle = false;
            $scope.reviewsObject.addEmployees.cycle_id = item.cycle_id;
            $scope.reviewsObject.addEmployees.cycle_name = item.cycle_name;
            getUnAssignedEmployeesOfReviewCycle();
        };

        var saveEmployeesCallback = function (data) {
            if (utilityService.getValue(data, 'status') === 'success') {
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                $scope.closeModal('addEmployeeInCycle');
            } else {                
                console.log('TODO: need to handle error here');
                console.log(data);
            }
        };
        $scope.saveEmployees = function () {
            var urlServiceVal = 'addEmployeesToCycle';
            if($scope.isSelectCycle) {
                urlServiceVal = 'addCycleforEmployees';
            }
            var url = AdminReviewCycleService.getUrl(urlServiceVal) + '/'
                    + $scope.reviewsObject.addEmployees.cycle_id,
                payload = AdminReviewCycleService.buildAddEmployeedPayload(self.notifyTo);

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    saveEmployeesCallback(data);
                });
        };
        /***** End: Add Employees in a running cycle *****/

        $scope.addEmployeesToRunningCycle = function (cycle) {
            var findCycle = _.findWhere($scope.reviewsObject.reviewCycleList, { cycle_id : cycle});
            if(findCycle != undefined) {
                self.notifyTo = [];
                $scope.isSelectCycle = true;
                $scope.reviewsObject.addEmployees.cycle_id = findCycle.cycle_id;
                $scope.reviewsObject.addEmployees.cycle_name = findCycle.cycle_name;
                getUnAssignedEmployeesOfReviewCycle();
            }
        };
        $scope.SumOfweightage = 0
        $scope.calculateWeightage = function() {
            var weightage = 0;
            $scope.SumOfweightageWarning = false
            console.log($scope.overview.goalCompetencyList);
            angular.forEach($scope.overview.goalCompetencyList, function(val) {
                if(val.weightage){
                    var weightageFloat = parseFloat(val.weightage); 
                    weightage = weightage + weightageFloat;
                    weightage = parseFloat(weightage);
                }
            })
            if(weightage > 100){
                $scope.SumOfweightageWarning = true
                return
            }
            console.log(weightage)
            $scope.SumOfweightage = weightage;
        }
        $scope.copyTheItem = function(header, text){
            $scope.overview.goalCompetencyList.push({
                editableMode: true,
                text: text,
                description: "",
                header:header,
                isDefault: false
            });

            var $target = $('.kraCompetencyContainer');
            $target.animate({scrollTop: $target.height()}, 1000); 
        }
       
    }
]);