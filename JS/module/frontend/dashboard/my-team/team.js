app.controller('TeamController', [
        '$scope', '$rootScope', '$timeout', '$location', '$routeParams', '$q', 'utilityService', 'ServerUtilityService', 'TeamService',
    function ($scope, $rootScope, $timeout, $location, $routeParams, $q, utilityService, serverUtilityService, teamService) {
        $scope.buildAppraisalTabTitle();
        $scope.relationship = teamService.buildRelationshipObject();
        $scope.team = teamService.buildTeamObject();
        $scope.profile = teamService.buildProfileObject();
        $scope.tab = utilityService.getValue($routeParams, "tab");
        $scope.setTab = function (newValue) {
            $scope.tab = newValue;
            $scope.accordionTab.myTeam.selected = newValue - 1;
        };
        $scope.isSet = function (tabName) {
            return $scope.tab === tabName;
        };
        $scope.tabs = {
            mainTab: utilityService.getValue($routeParams, "tab"),
            subTab: utilityService.getValue($routeParams, "subTab")
        };
        if ($scope.tabs.mainTab != null) {
            $scope.setTab($scope.tabs.mainTab);
            $scope.isSet($scope.tabs.mainTab);
        } else {
            $scope.tab = 1;
            $scope.tabs.subTab = 0;
        }
        $scope.breadcrum = [];
        $scope.tabAppraisal = {
            selected: 'goal',
            possibility: {
                goal: 0,
                competency: 1,
                feedback: 2
            }
        };
        var getRelationshipList = function () {
            serverUtilityService.getWebService(teamService.getUrl('permission'))
                .then(function (data) {
                    $scope.relationship.primary.list = data.data.profile_field;
                    $scope.relationship.primary.model = data.data.profile_field[0];
                    $scope.modulePermissions.relationship = teamService.buildMyTeamPermissionObject(data.data.relationship_detail);
                    $scope.relationship.permission.content = data.data.permission_deatil;
                    $scope.relationship.overview.visible = true;
                    $scope.getOwnTeamList();
                });
        };
        getRelationshipList();
        var setProfileDetails = function () {
            $scope.profile.detail = {
                pic: $scope.breadcrum.length ? $scope.breadcrum[$scope.breadcrum.length - 1].profile_pic : $scope.user.profilePic,
                fullname: $scope.breadcrum.length ? $scope.breadcrum[$scope.breadcrum.length - 1].full_name : $scope.user.fullname
            };
        };
        var resetTeamObject = function () {
            $scope.team.visible = false;
            $scope.team.list = [];
        };
        var getTeamList = function (url, params) {
            resetTeamObject();
            params = angular.isDefined(params) ? params : {};
            serverUtilityService.getWebService(url, params).then(function (data) {
                $scope.team.list = data.data;
                $scope.team.visible = true;
                setProfileDetails();
            });
        };
        var isBreadCrumExists = function (item) {
            var isExists = false;
            angular.forEach($scope.breadcrum, function (value, key) {
                if (value._id == item._id) {
                    isExists = true;
                }
            });
            return isExists;
        };
        var resetBreadcrum = function () {
            $scope.breadcrum = [];
        };
        $scope.getOwnTeamList = function () {
            var params = {
                rel_id: utilityService.getInnerValue($scope.relationship.primary, 'model', '_id'),
                direct_reportee: $scope.relationship.secondary.model.slug == 'direct_reportee' ? true : false
            },
            url = teamService.getUrl('ownTeam');

            getTeamList(url, params);
        };
        $scope.getEmployeeTeamList = function (item) {
            var params = {
                rel_id: $scope.relationship.primary.model._id,
                direct_reportee: $scope.relationship.secondary.model.slug == 'direct_reportee' ? true : false
            },
            url = teamService.getUrl('employeeTeam') + "/" + item._id;

            getTeamList(url, params);
        };
        $scope.isValueArray = function (value) {
            return angular.isArray(value);
        };
        var resetRelationshipSecondaryDropdown = function () {
            if (utilityService.getInnerValue($scope.relationship.primary, 'model', 'slug') != 'work_profile_reporting_manager') {
                $scope.relationship.secondary.model = {
                    id: 1,
                    slug: "direct_reportee",
                    name: "Direct Reportee"
                };
            }
        };
        $scope.changeRelationship = function () {
            resetTeamObject();
            resetBreadcrum();
            resetRelationshipSecondaryDropdown();
            $scope.getOwnTeamList();
            $rootScope.$broadcast('reporteeChange');
        };
        $scope.changeReportee = function () {
            resetTeamObject();
            resetRelationshipSecondaryDropdown();
            if ($scope.breadcrum.length) {
                var item = $scope.breadcrum[$scope.breadcrum.length - 1];
                $scope.getEmployeeTeamList(item);
            } else {
                $scope.getOwnTeamList();
            }
            $rootScope.$broadcast('reporteeChange');
        };
        $scope.setSelectedIndex = function (item) {
            $scope.profile.selectedIndex = ($scope.profile.selectedIndex != item._id)
                    ? item._id : -1;
        };
        $scope.viewTeam = function (item) {
            if (!isBreadCrumExists(item)) {
                $scope.profile.selectedIndex = -1;
                $scope.breadcrum.push({
                    _id: item._id,
                    full_name: item.full_name,
                    profile_pic: item.profile_pic
                });
            }
            $scope.getEmployeeTeamList(item);
        };
        $scope.navigateToHome = function () {
            if (!$scope.breadcrum.length) {
                return false;
            }
            resetBreadcrum();
            $scope.getOwnTeamList();
        };
        $scope.updateBreadcrum = function (item, index) {
            if ($scope.breadcrum.length - 1 == index) {
                return false;
            }
            var index = null,
                    count = 0;

            angular.forEach($scope.breadcrum, function (value, key) {
                if (!index) {
                    count++;
                }
                if (value._id == item._id) {
                    index = key + 1;
                }
            });
            $scope.breadcrum.splice(index, count);
            $scope.getEmployeeTeamList(item);
        };
        $scope.clickOutSideClose = function () {
            $scope.profile.selectedIndex = -1;
        };
        $scope.viewEmployeeProfile = function (item) {
            $location.url("dashboard/profile/" + item._id).search({source: 'team'});
        };
        $scope.toggleMemberList = function () {
            $scope.team.toggle = $scope.team.toggle ? false : true;
        };

        /********** Start Relationship Permission Section **********/

        var isMyTeamSectionVisible = function (sectionName) {
            return $scope.relationship.primary.model
                    && utilityService.getValue($scope.modulePermissions.relationship, $scope.relationship.primary.model.slug)
                    && $scope.modulePermissions.relationship[$scope.relationship.primary.model.slug][sectionName];
        };
        $scope.viewMyTeamLeave = function () {
            return isMyTeamSectionVisible('can_view_my_team_leaves');
        };
        $scope.viewMyTeamTimeAttendance = function () {
            return isMyTeamSectionVisible('can_view_my_team_attendance');
        };
        $scope.viewMyTeamProvision = function () {
            return isMyTeamSectionVisible('can_view_my_team_provisions');
        };
        $scope.viewMyTeamCompensation = function () {
            return isMyTeamSectionVisible('can_view_my_team_compensation');
        };
        $scope.viewMyTeamObjective = function() {
            return isMyTeamSectionVisible('can_view_my_team_okr');
        };
        $scope.viewMyTeamPerformance = function() {
            return isMyTeamSectionVisible('can_view_my_team_performance');
        };
        $scope.viewMyTeamPIP = function() {
            return isMyTeamSectionVisible('can_view_my_team_pip');
        };
        $scope.viewMyTeamScreenshot = function() {
            return isMyTeamSectionVisible('can_view_my_team_productivity')
        };         
        $scope.viewMyTeamTask = function() {
            return isMyTeamSectionVisible('can_view_my_team_tasklist');
        };        
        $scope.viewMyTeamPollsAndSurveys = function() {
            return isMyTeamSectionVisible('can_view_my_team_performance');
        };
            
        $scope.viewMyTeamLnd=function () {
            return isMyTeamSectionVisible('can_view_my_team_trainings')
        };                
        /********** End Relationship Permission Section **********/

        //This is for future reference, so please don't delete this
        /*$scope.mdOpenMenu = function(item, func, event) {
            if(!item.relationship_count) {
                return false;
            }
            $scope.profile.detail = item;
            setSelectedIndex(item);
            $timeout(function() {
                func(event);
            }, 500);            
        };*/


        var isBackTriggered = false,
            subtab = utilityService.getValue($routeParams, 'subtab');
            child = utilityService.getValue($routeParams, 'child');

        var handleBackFunctionality = function(accordion) {
            $scope.accordionTab[accordion].selected = $scope.accordionTab[accordion].tabs[subtab];
            isBackTriggered = true;
        };

        if(subtab && subtab == 'feedback') {
            $scope.setTab(7);
            $scope.tabs.subTab = child;

            handleBackFunctionality('myTeam');
        }
        if(subtab && subtab == 'pip') {
            $scope.setTab(8);
            $scope.tabs.subTab = child;

            handleBackFunctionality('myTeam');
        }
        if(subtab && subtab == 'task') {
            $scope.setTab(9);
            $scope.tabs.subTab = child;

            handleBackFunctionality('myTeam');
        }
        if(isBackTriggered) {
            $timeout(function() {
                $location.search("subtab", null);
                $location.search("child", null);
            }, 1000);
        }
        
        $scope.redirectToOrgDir = function (routeUserId) {
            if (routeUserId) {
                $location.url('/frontend/people').search({"routeUserId": routeUserId});
            }
        };
        $scope.teamAppraisalHandler = function(tabname) {
            $scope.tabAppraisal.selected = tabname;
        };
        $scope.canInitiateExitByRelationship = function () {
            return utilityService.getValue(
                utilityService.getValue(
                    utilityService.getValue($scope.modulePermissions, 'relationship'), 
                        utilityService.getInnerValue($scope.relationship.primary, 'model', 'slug')
                ), 
                'can_initiate_employee_exit', false
            );
        };
    }
]);
