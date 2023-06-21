app.controller('AdminManageReviewStatusController', [
    '$scope', '$routeParams', '$modal', '$mdDialog', 'AdminManageReviewCycleService', 'utilityService', 'ServerUtilityService',
    function ($scope, $routeParams, $modal, $mdDialog, AdminManageReviewCycleService, utilityService, serverUtilityService) {
        var self = this,
            cycleId = utilityService.getValue($routeParams, 'cycle_id');

        self.filterSelected = true;
        self.querySearchChips = querySearchChips;
        $scope.reviewStatusObj = {
            list: [],
            filteredList: [],
            employeeList:[],
            isListVisible: false,
            revieweeDetails : null,
            deleteItem : null,
            deleteIndex : null,
            reviewerModel: {},
            reviewerHeading: {
                reviewers_manager: 'Manager Reviewer',
                reviewers_skip_manager: 'Skip Level Manager Reviewer',
                reviewers_direct_reports: 'Direct Report Reviewer',
                reviewers_peer: 'Peer Reviewer'
            },
            reviewerFlags: {},
            routeFlags: {
                cycleId: utilityService.getValue($routeParams, 'cycle_id')
            },
            revieweeCsv:{
                "Reviewee": 'full_name',
                "Employee Id": 'employee_code',
                "Total": 'total_reviews_to_be_received',
                "Pending": 'reviews_pending',
                "Completed": 'reviews_received',
                "Not Started": 'reviews_not_started',
            },
            reviewerCsv:{
                "Reviewer": 'full_name',
                "Reviewer Employee Id": 'employee_code',
                "Completed": 'reviews_given',
                "Total": 'total_reviews_to_be_given',
            },
            otherRelations: {
                enabled: false,
                list: [],
                object: {}
            },
            relationship: {
                reviewers_manager: 'manager', 
                reviewers_skip_manager: 'skip_manager', 
                reviewers_direct_reports: 'direct_reports',
                reviewers_peer: 'peer'
            }
        };        
        $scope.resetAllTypeFilters();
        
        var getAllemployeeList = function (){
            var url = AdminManageReviewCycleService.getUrl('allUser');
            serverUtilityService.getWebService(url)
                .then(function (data){
                    angular.forEach(data.data, function (v, k){
                        v._lowername = v.full_name ? v.full_name.toLowerCase() : '';
                    });
                    $scope.reviewStatusObj.employeeList = data.data;
                });
        };
        if ($scope.manageReviewCycleModal && $scope.manageReviewCycleModal.reviewStatusTab == 0) {
            getAllemployeeList();
        }        
        
        /***** Reviewees Tab *****/
        var allFilterObject = [{
            countObject: 'group',
            isGroup: true, 
            collection_key: 'employee_preview'
        }];        
        var buildList = function (data) {
            angular.forEach(data, function (v, k) {
                v.full_name = v.employee_preview.full_name;
                v.employee_code = v.employee_preview.emp_code;
                $scope.calculateFacadeCountOfAllFilters(data, allFilterObject, v);
            });
        };        
        var getReviewStatusList = function () {
            var urlKey = {0: 'revieweesList', 1: 'reviewerList'};
            var filterKey = {0: 'reviewees', 1: 'reviewers'};
            var url = AdminManageReviewCycleService.getUrl(urlKey[$scope.manageReviewCycleModal.reviewStatusTab]) + "/" + $scope.reviewStatusObj.routeFlags.cycleId;
            
            serverUtilityService.getWebService(url)
                .then(function (data){
                    buildList(data.data[filterKey[$scope.manageReviewCycleModal.reviewStatusTab]]);
                    $scope.reviewStatusObj.list = data.data;
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.reviewStatusObj.isListVisible = true;
                });
        };
        if ($scope.manageReviewCycleModal && $scope.reviewStatusObj.routeFlags.cycleId) {
            $scope.resetFacadeCountObject(allFilterObject);
            getReviewStatusList();
        }        
        $scope.openRightMenu = function (item) {            
            $scope.reviewStatusObj.revieweeDetails = angular.copy(item);

            if ($scope.reviewStatusObj.revieweeDetails.reviewers.length === 0) {
                $scope.reviewStatusObj.revieweeDetails.reviewers = {};
            }
            
            angular.forEach($scope.reviewStatusObj.reviewerHeading, function (value, key) {                
                if (angular.isUndefined($scope.reviewStatusObj.revieweeDetails.reviewers[key])) {
                    $scope.reviewStatusObj.revieweeDetails.reviewers[key] = [];
                }
            });
            
            angular.forEach($scope.reviewStatusObj.revieweeDetails.reviewers, function (v, k) {
                $scope.reviewStatusObj.reviewerModel[k] = [];
                $scope.reviewStatusObj.reviewerFlags[k] = false;
            });
            
            $scope.openModal('viewReviewerDetails', 'view-reviewer-details.tmpl.html');
        };
        $scope.closeSideNavPanel = function (instance) {
            getReviewStatusList();
            $scope.reviewStatusObj.revieweeDetails = null;
            $scope.reviewStatusObj.reviewerModel = {};
            $scope.reviewStatusObj.reviewerFlags = {};
            $scope.closeModal(instance);
        };
        $scope.toggleAddNewReviewer = function (key, action) {
            action = angular.isDefined(action) ? action : 'add';
            $scope.reviewStatusObj.reviewerFlags[key] = !$scope.reviewStatusObj.reviewerFlags[key];
            if (action === 'close') {
                $scope.reviewStatusObj.reviewerModel[key] = [];
            }
        };        
        $scope.addMoreReviewer = function (key) {
            if(!$scope.manageReviewCycleModal.status || $scope.manageReviewCycleModal.status == 4) {
                return;
            }
            $scope.toggleAddNewReviewer(key);
        };        
        $scope.saveReviewers = function (key, value) {
            if(!$scope.manageReviewCycleModal.status || $scope.manageReviewCycleModal.status == 4) {
                return;
            }
            var url = AdminManageReviewCycleService.getUrl('assignReviewer') + "/" 
                + $scope.reviewStatusObj.routeFlags.cycleId + "/" 
                + $scope.reviewStatusObj.revieweeDetails.employee_preview._id,
                payload = {};

            payload[key] = $scope.reviewStatusObj.reviewerModel[key].map(function (item) {
                var id = angular.isObject(item._id) ? item._id.$id : item._id;
                return id;
            });

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if(data.status == 'success') {
                        angular.forEach($scope.reviewStatusObj.reviewerModel[key], function (v, k) {
                            var temp_id = angular.isObject(v._id) ? v._id.$id : v._id;
                            var is_exist = value.find(function (val) {
                                return val._id == temp_id;
                            });
                            if(angular.isUndefined(is_exist)) {
                                v.review_status = 2;
                                value.push(v);
                            };
                        });
                        $scope.reviewStatusObj.reviewerFlags[key] = false; 
                        $scope.reviewStatusObj.reviewerModel[key] = [];
                        utilityService.showSimpleToast(data.message);
                    } else {
                        alert("Something went wrong.");
                    }
                });
        };
        var deleteReviewerCallback = function (data, collection, index) {
            if (data.status == 'success') {                        
                collection.splice(index, 1);
                $scope.loadRevieweeChartData();
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            } else {
                alert(utilityService.getValue(data, 'message'));
            }
        };        
        $scope.deleteReviewer = function (key, reviewer, collection, index) {
            if(!$scope.manageReviewCycleModal.status || $scope.manageReviewCycleModal.status == 4) {
                return;
            }
            var url = AdminManageReviewCycleService.getUrl('assignReviewer') + "/" 
                + $scope.reviewStatusObj.routeFlags.cycleId + "/" 
                + $scope.reviewStatusObj.revieweeDetails.employee_preview._id + "?" 
                + key + "=" + reviewer._id;

            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    deleteReviewerCallback(data, collection, index);
                });
        };
        var deleteRevieweeCallback = function (data) {
            if (utilityService.getValue(data, 'status') == 'success') {                        
                getReviewStatusList();
                $scope.loadRevieweeChartData();
                utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
            } else {
                alert(utilityService.getValue(data, 'message'));
            }
        };        
        $scope.deleteReviewee = function (item, index) {
            if(!$scope.manageReviewCycleModal.status || $scope.manageReviewCycleModal.status == 4) {
                return;
            }
            
            var url = AdminManageReviewCycleService.getUrl('deleteReviewee') + "/" + $scope.reviewStatusObj.routeFlags.cycleId,
                payload = {
                    emp_id: [utilityService.getInnerValue(item, 'employee_preview', '_id')]
                };

            serverUtilityService.patchWebService(url, payload)
                .then(function (data) {
                    deleteRevieweeCallback(data);
                });
        };        
        $scope.reOpenReviewees = function (reviewer, key) {
            if(!$scope.manageReviewCycleModal.status || $scope.manageReviewCycleModal.status == 4) {
                return;
            }

            var url = AdminManageReviewCycleService.getUrl('reopenRequest'),
                payload = {
                    appraisal_cycle_id: $scope.reviewStatusObj.routeFlags.cycleId ,
                    reviewee: $scope.reviewStatusObj.revieweeDetails.employee_preview._id,
                    reviewer: reviewer._id,
                    relationship: $scope.reviewStatusObj.relationship[key]
                };
            
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                            reviewer.review_status = 4;
                    } else {
                        alert("Something went wrong.");
                    }
                });
        };
        
        /***** START CHIPS INTEGRATION *****/
        function querySearchChips(keyword, value) {
            return keyword ?  $scope.reviewStatusObj.employeeList.filter(createFilterForChips(keyword, value)) : [];
        }
        function createFilterForChips(query, value) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(employee) {
                var is_exist = value.find(function (item) {
                    return item._id == employee._id;
                });
                return (employee._lowername.indexOf(lowercaseQuery) != -1 && angular.isUndefined(is_exist) && employee._id != $scope.reviewStatusObj.revieweeDetails.employee_preview._id);
            };
        }
        if ($scope.manageReviewCycleModal) {
            var page = $scope.manageReviewCycleModal.reviewStatusTab == 0 ? "manage_cycle_review_status_reviewee" : "manage_cycle_review_status_reviewer" ;
            $scope.updatePaginationSettings(page);
        }
        var reBuildOtherRelationsObject = function () {
            $scope.reviewStatusObj.otherRelations.enabled = Boolean(utilityService.getStorageValue('enable_other_relations_' + cycleId));
            $scope.reviewStatusObj.otherRelations.object = JSON.parse(utilityService.getStorageValue('other_relations_' + cycleId));
            utilityService.rebuildReviewerHeadingForRelationship($scope.reviewStatusObj.reviewerHeading, cycleId);
            utilityService.rebuildReverseMappingForRelationship($scope.reviewStatusObj.relationship, cycleId);
        };
        var otherRelationsCallback = function (data) {
            $scope.reviewStatusObj.otherRelations.enabled = utilityService.getInnerValue(data, 'data', 'is_other_relation', false);
            $scope.reviewStatusObj.otherRelations.list = utilityService.getInnerValue(data, 'data', 'details', []);
            $scope.reviewStatusObj.otherRelations.object = utilityService.buildOtherRelationsObject($scope.reviewStatusObj.otherRelations.list);
            utilityService.setOtherRelationsWithinStorage(cycleId, $scope.reviewStatusObj.otherRelations);
            reBuildOtherRelationsObject();
        };
        var getOtherRelations = function () {
            var url = service.getUrl('otherRelations') + "/" + cycleId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    otherRelationsCallback(data);                         
                });
        };
        utilityService.getStorageValue('other_relations_' + cycleId)
            ? reBuildOtherRelationsObject() : getOtherRelations();

        /***** Start Modal Section ****/
        $scope.openModal = function(instance, templateUrl) {
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope:$scope,
                backdrop: 'static',
                size: 'lg',
                windowClass:'fadeEffect'
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        /***** End Modal Section ****/

        /***** Start Confirm Dialog *****/
        var showConfirmDialog = function(source, event, functionName, item, index, key, collection) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to proceed with this?')
                .textContent('Please double check every thing before taking this action.')
                .ariaLabel('Lucky day')
                .targetEvent(event)
                .ok('Please do it!')
                .cancel('No, want to cancel');

            $mdDialog.show(confirm).then(function() {
                if (source === 'reviewee') {
                    functionName(item, index);
                } else if (source === 'reviewer') {
                    functionName(key, item, collection, index);
                }                
            }, function() {
                console.log('Close confirm dialog');
            });
        };
        $scope.confirmDialog = function(source, event, functionName, item, index, key, collection) {
            showConfirmDialog(source, event, functionName, item, index, key, collection);
        };
        /***** End Confirm Dialog *****/

    }
]);