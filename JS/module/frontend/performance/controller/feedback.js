app.controller('KeyResultAdminController', [
    '$scope', '$rootScope', '$timeout', '$routeParams', '$filter', '$location', '$modal', 'KeyResultAdminService', 'ObjectiveService', 'utilityService', 'ServerUtilityService',
    function ($scope, $rootScope, $timeout, $routeParams, $filter, $location, $modal, KeyResultAdminService, objectiveService, utilityService, serverUtilityService) {
        $scope.keyResultObject = KeyResultAdminService.buildKeyResultObject();
        $scope.filteredList = {
            list: []
        };
        $scope.buildAppraisalTabTitle();
        $scope.allUsersForExcel = [];
        $scope.requestedFeedback = 0;
        $scope.givenFeedback = 0;
        $scope.meeting = {
            admin: {
                list: [],
                visible: false
            }
        };

        $scope.routeFlags = {
            tab: utilityService.getValue($routeParams, "tab"),
            subTab: utilityService.getValue($routeParams, "subtab")
        };

        $scope.selectedTabs = {
            parentTab: 0,
            reviewsTab: 0,
            subtabsIndex: {
                2: "reviewsTab"
            }
        };
        $scope.resetAllTypeFilters();
        var allFilterObject = [];
        
        /*******For Communication********/
        $scope.module_key = 'performance';

        var getLastRandomDate = function () {
            var dateList = ["1/10/2017", "2/10/2017", "3/10/2017", "4/10/2017",
                "5/10/2017", "6/10/2017", "7/10/2017", "8/10/2017", "9/10/2017", "10/10/2017",
                "11/10/2017", "12/10/2017", "13/10/2017", "14/10/2017", "15/10/2017", "16/10/2017"];
            return dateList[Math.floor(Math.random() * dateList.length)];
        };
        var getNextRandomDate = function () {
            var dateList = ["1/11/2017", "2/11/2017", "3/11/2017", "4/11/2017",
                "5/11/2017", "6/11/2017", "7/11/2017", "8/11/2017", "9/11/2017", "10/11/2017",
                "11/11/2017", "12/11/2017", "13/11/2017", "14/11/2017", "15/11/2017", "16/11/2017"];
            return dateList[Math.floor(Math.random() * dateList.length)];
        };
        var getRandomFeedBack = function () {
            var dateList = ["11", "15", "17", "29",
                "21", "8", "9", "10", "12", "25"];
            return dateList[Math.floor(Math.random() * dateList.length)];
        };
        /* $scope.sum = function(items) {
            return items.reduce( function(a, b) {
                return a + b;
            }, 0);
        }; */
        //getRandomDate();

        var getFeedbackCounts = function () {
            serverUtilityService.getWebService(KeyResultAdminService.getUrl('feedbackCount'))
                    .then(function (data) {
                        $scope.feedbackCount = data.data;
                    });
        };
        getFeedbackCounts();
        $scope.sendReminder = function () {
            utilityService.showSimpleToast("Reminder has been sent successfully.");
        };
        $scope.updatePaginationSettings('feedback');

        var getFeedBackList = function(filterType) {
            var url = KeyResultAdminService.getUrl('allUser');
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    var totalRequested = 0, totalGiven = 0;

                    angular.forEach(data.data, function (v, k) {
                        var item = $scope.feedbackCount.find(function(item) {
                                return item.emp_id === v._id.$id
                            });
                        if(angular.isUndefined(item)){
                            item = {
                               total_feedback_request: 0, 
                               total_feedback_received: 0,
                               total_feedback_given: 0
                            };
                        }
                        if (angular.isDefined(v.full_name) && v.full_name) {
                            if (angular.isDefined(v.work_profile_reporting_manager_detail) 
                                && v.work_profile_reporting_manager_detail[0]) {
                                v.manager = v.work_profile_reporting_manager_detail[0].full_name 
                                    ? v.work_profile_reporting_manager_detail[0].full_name : 'Not Yet Defined';
                            }
                            if (angular.isDefined(v.work_profile_designation_detail) 
                                && v.work_profile_designation_detail[0]) {
                                v.designation = v.work_profile_designation_detail[0].name 
                                    ? v.work_profile_designation_detail[0].name : 'Not Yet Defined';
                            }
                            if (angular.isDefined(v.work_profile_level_detail) 
                                && v.work_profile_level_detail[0]) {
                                v.level = v.work_profile_level_detail[0].name 
                                    ? v.work_profile_level_detail[0].name : 'Not Yet Defined';
                            }
                            v.last = getLastRandomDate();
                            v.next = getNextRandomDate();
                            v.requested = angular.isDefined(item.total_feedback_request) ? 
                            item.total_feedback_request : 0;
                            v.recieved = angular.isDefined(item.total_feedback_received) ? item.total_feedback_received : 0;
                            v.given = angular.isDefined(item.total_feedback_given) ? item.total_feedback_given : 0;
                            $scope.keyResultObject.feedback.push(v);
                            totalRequested += parseInt(v.requested);
                            totalGiven += parseInt(v.recieved);
                        }
                    });
                    
                    $scope.requestedFeedback = totalRequested;
                    $scope.givenFeedback = totalGiven;
                    angular.copy($scope.keyResultObject.feedback, $scope.allUsersForExcel);
                    $scope.keyResultObject.feedback = data.data;
            }); 
        };
        getFeedBackList();
		var getAdminMeetingList = function() {
            $scope.resetFacadeCountObject(allFilterObject);
            serverUtilityService.getWebService(KeyResultAdminService.getUrl('meeting'))
                    .then(function (data) {
                        angular.forEach(data.data, function (v, k) {
                            $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject, v);
                        });
                        $scope.meeting.admin.list = data.data;
                        angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                        $scope.meeting.admin.visible = true;
                    });
        };
        getAdminMeetingList();

        var isBackTriggered = false;
        if ($scope.routeFlags.tab && ($scope.routeFlags.subTab || $scope.routeFlags.subTab == 0)) {
            $scope.selectedTabs.parentTab = $scope.routeFlags.tab;
            $scope.selectedTabs[$scope.selectedTabs.subtabsIndex[$scope.routeFlags.tab]] = $scope.routeFlags.subTab;
            isBackTriggered = true;
        }
        if(isBackTriggered) {
            $timeout(function() {
                $location.search("subtab", null);
            }, 1000);
        }

        $scope.exportMeetingsList = function() {
            if(utilityService.getInnerValue($scope.meeting.admin, 'list', 'length')) {
                var data = KeyResultAdminService.buildMeetingsCsvContent($scope.meeting.admin.list),
                    filename = 'All_Meetings.csv';
                utilityService.exportToCsv(data, filename);
            }
        };
    }

]);