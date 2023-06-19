app.controller('GoalCompetencyController', [
    '$scope', '$modal', '$location', 'utilityService', 'ServerUtilityService', 'GoalCompetencyService', 'LeaveSummaryService', 'ManagerReviewService', 'ObjectiveService','AdminReviewCycleService',
    function ($scope, $modal, $location, utilityService, serverUtilityService, service, summaryService, reviewService, objectiveService, AdminReviewCycleService) {
        var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum),
            allFilterObject = service.buildAllFilterObject();

        $scope.resetAllTypeFilters();
        $scope.updatePaginationSettings('my_team_overview');        
        $scope.overview = service.buildOverviewModel();
        $scope.empObj = {
            filteredItems: null,
            copyList: []
        };
        $scope.category = {
            type: 1,
            list: []
        }
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
        var reBuildEmployeeDetails = function(data) {
            $scope.resetFacadeCountObject(allFilterObject);
            angular.forEach(data, function(value, key) {
                if($scope.tabAppraisal.selected === 'goal') {
                    var object = service.buildGoalCompetencyList(value, 'goals');
                    value.goalList = object.list;
                    value.goalCount = object.count;
                } else {
                    var object = service.buildGoalCompetencyList(value, 'compentencies');
                    value.competencyList = object.list;
                    value.competencyCount = object.count;
                }

                $scope.calculateFacadeCountOfAllFilters(data, allFilterObject, value);
            });
            angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);

            return data;
        };
        var employeeDetailsCallback = function(data) {
            $scope.appraisal.titleTabOne = utilityService.getInnerValue(data, 'data', 'goal_display_name');
            $scope.appraisal.titleTabTwo = utilityService.getInnerValue(data, 'data', 'competency_display_name');
            var employeeDetails = reBuildEmployeeDetails(utilityService.getInnerValue(data, 'data', 'csv_param', []));
            $scope.overview.empDetails.list = employeeDetails;
            $scope.overview.empDetails.visible = true;
        };
        var getEmployeeDetails = function() {
            var template = $scope.tabAppraisal.selected === 'goal' ? 11 : 12,
                url = service.getUrl('empDetails') + "/" + template 
                    + "/" + $scope.overview.selectedCycle;
            checkTheCategoryType(template, $scope.overview.selectedCycle)
            serverUtilityService.getWebService(url, buildGetParams())
                .then(function(data) {
                    employeeDetailsCallback(data);
                });
        };        
        $scope.sortBy = function(propertyName) {
            $scope.overview.empDetails.reverse = ($scope.overview.empDetails.propertyName === propertyName) ? !$scope.overview.empDetails.reverse : false;
            $scope.overview.empDetails.propertyName = propertyName;
        };
        $scope.exportToCsv = function() {
            var csvData = service.buildCSVData($scope.empObj.filteredItems, $scope.tabAppraisal.selected, $scope.appraisal),
                fileName = 'team-' + ($scope.tabAppraisal.selected === 'goal' 
                    ? 'goals' : 'competencies') + '.csv';

            utilityService.exportToCsv(csvData, fileName);
        };
        $scope.canViewOKRAsManagerInGoalCompetency = function() {
            return $scope.empViewOKR() && $scope.viewMyTeamObjective();
        };
        var checkTheCategoryType = function(type, id){
            var url = AdminReviewCycleService.getUrl('getMyteamCategories') + '/' + type + '/' + id;
            serverUtilityService.getWebService(url)
                .then(function (data){
                    if(utilityService.getValue(data, 'status') === 'success'){
                        console.log(data)
                        $scope.category.type = utilityService.getValue(data, 'type', 1)
                        $scope.category.list = utilityService.getValue(data, 'data', [])
                    }
                });
        }
        $scope.viewEditOkrCompetency = function(item, isEditable) {
            utilityService.resetAPIError(false, null, 'weightage');
            $scope.overview.goalCompetencyList = [];
            angular.copy(item, $scope.overview.empDetails.selected);
            $scope.overview.isEditable = isEditable;
            $scope.overview.enableWeightage = utilityService.getValue(item, 'is_weightage', false);

            if($scope.tabAppraisal.selected === 'goal') {
                $scope.overview.section.title = $scope.appraisal.titleTabOne;                
                angular.copy(item.goalList, $scope.overview.goalCompetencyList);
            } else {
                $scope.overview.section.title = $scope.appraisal.titleTabTwo;
                angular.copy(item.competencyList, $scope.overview.goalCompetencyList);
            }

            angular.forEach($scope.overview.goalCompetencyList, function(value, key) {
                value.editableMode = false;
            });
            
            if($scope.tabAppraisal.selected === 'goal' && $scope.canViewOKRAsManagerInGoalCompetency() && utilityService.getInnerValue(item, 'employee_details', '_id')) {
                $scope.getKeyResultsForEmp(utilityService.getInnerValue(item, 'employee_details', '_id'), function() {
                    $scope.keyResults.showKrSection = true;
                    $scope.keyResults.switchOnKrSection = false;
                    $scope.openModal('teamGoalCompetency', 'view-edit-okr-competency.tmpl.html', 'lg'); 
                });
            } else {
                $scope.keyResults.showKrSection = false;
                $scope.openModal('teamGoalCompetency', 'view-edit-okr-competency.tmpl.html', 'lg');
            }
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
        $scope.copyTheItem = function(header, text) {
            $scope.overview.goalCompetencyList.push({
                editableMode: true,
                text: text,
                description: "",
                header: header,
                weightage: 0
            });

            var $target = $('.kraCompetencyContainer');
            $target.animate({scrollTop: $target.height()}, 1000); 
        };
        var reviewCycleListCallback = function (data) {
            if (utilityService.getValue(data, 'status') === 'success') {
                $scope.overview.cycle.list = data.data;
            } else {
                $scope.overview.cycle.error.status = true;
                $scope.overview.cycle.error.message = utilityService.getValue(data, 'message');
            }                    
            $scope.overview.cycle.visible = true;
        };
        var getReviewCycleList = function() {
            serverUtilityService.getWebService(reviewService.getUrl('reviews'), buildGetParams())
                .then(function(data) {
                    reviewCycleListCallback(data);
                });
        };
        getReviewCycleList();
        $scope.changeReviewCycle = function() {
            getEmployeeDetails();
        };
        $scope.changeEditableMode = function(item, flag) {
            item.editableMode = flag;
        };
        $scope.removeGoalCompetency = function(index) {
            $scope.overview.goalCompetencyList.splice(index, 1);
        };
        $scope.updateGoalCompetency = function(draft) {
            var template = $scope.tabAppraisal.selected === 'goal' ? 11 : 12,
                url = service.getUrl('empDetails') + "/" + template 
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
                        getEmployeeDetails();
                        utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                    } else if (utilityService.getInnerValue(data, 'data', 'message')
                        && angular.isObject(utilityService.getInnerValue(data, 'data', 'message'))) {
                        var messageArray = utilityService.getInnerValue(data, 'data', 'message'),
                            dataArray = utilityService.getValue(messageArray, 'data', []),
                            message = dataArray.join(',');
                        utilityService.resetAPIError(true, message, 'weightage');
                    }  else {
                        utilityService.resetAPIError(true, data.message, 'weightage');
                    }                   
                });
        };
        $scope.goToRepositoryPage = function (url, type, direction) {
            $location.url(url).search({
                repository: $scope.tabAppraisal.selected === 'goal' ? 11 : 12,
                selectedCycle: $scope.overview.selectedCycle,
                callback: 'feedback'
            });
        };
        $scope.copyTemplate = function(item) {
            angular.copy(item, $scope.overview.empDetails.selected);
            angular.copy($scope.empObj.filteredItems, $scope.empObj.copyList);
            $scope.openModal('copyTemplate', 'copy-template.tmpl.html');
        };
        $scope.startCopyTemplate = function() {
            var template = $scope.tabAppraisal.selected === 'goal' ? 11 : 12,
                url = service.getUrl('copyTemplate') + "/" + template 
                    + "/" + $scope.overview.selectedCycle,
                payload = service.buildCopyTemplatePayload($scope.overview.empDetails.selected.employee_details._id, $scope.empObj.copyList);

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    if(utilityService.getValue(data, 'status') == 'success') {
                        $scope.closeModal('copyTemplate');
                        getEmployeeDetails();
                        utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                    }                    
                });
        };

        /****** Start: Open Modal *******/
        $scope.openModal = function (instance, templateUrl, size, isXL) {
            size = angular.isDefined(size) ? size : 'lg';
            var conf = {
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass:'fadeEffect',
                size: size
            };
            if(isXL) {
                conf.windowTopClass = 'customModalWidth';
            }
            $scope.modalInstance[instance] = $modal.open(conf);
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        }; 
        
        var buildKRList = function(list) {
            if(!list || !list.length) { return []; }
            angular.forEach(list, function(val, key) {
                if(val.target_enabled) {
                    val.updatedCount = utilityService.getValue(val, 'current_state', 0);
                    objectiveService.updateProgressBar(val);
                }
                val.status_if_target_not_enabled = objectiveService.getKRStatus(val, '_id');
            });
            return list;
        };

        $scope.keyResults = {
            showKrSection: false,
            switchOnKrSection: false,
            statusList: objectiveService.buildKRStatusList(),
            statusHashMap: objectiveService.buildStatusHashMap(),
            filter: {
                searchText: '',
                from_date: new Date(new Date().setDate(new Date().getDate() - 90)),
                to_date: new Date(),
                current_date: new Date(),
                status: ''
            },
            list: [],
            filteredList: [],
            visible: false
        };
        $scope.getKeyResultsForEmp = function(empId, cb) {
            var url = service.getUrl('krListing') + '/' + empId,
                param = {
                    from_date: utilityService.dateToString(utilityService.getValue($scope.keyResults.filter, 'from_date', new Date()), '-'),
                    to_date: utilityService.dateToString(utilityService.getValue($scope.keyResults.filter, 'to_date', new Date()), '-')
                };
            serverUtilityService.getWebService(url, param)
                .then(function(data) {
                    $scope.keyResults.list = buildKRList(utilityService.getValue(data, 'data'));
                    $scope.keyResults.visible = true;
                    if(cb) { cb(); }
                });
        };

        $scope.applyMonthFilterOnKeyResultsListing = function() {
            $scope.keyResults.visible = false;
            if($scope.keyResults.filter.from_date && $scope.keyResults.filter.to_date) {
                $scope.getKeyResultsForEmp(utilityService.getInnerValue($scope.overview.empDetails.selected, 'employee_details', '_id'));
            } else {
                $scope.keyResults.list = [];
                $scope.keyResults.visible = true;
            }
        };

        $scope.addRemoveClassDynamically = function(switchKey) {
            var elem = angular.element(document.getElementsByClassName('fadeEffect')[0]);
            if(switchKey) {
                elem.addClass('customModalWidth');
            } else {
                elem.removeClass('customModalWidth');
            }
        };
        /****** End: Close Modal *******/  
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
    }
]);