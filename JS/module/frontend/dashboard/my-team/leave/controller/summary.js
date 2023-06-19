app.controller('LeaveSummaryController', [
	'$scope', '$timeout', '$q', '$location', 'utilityService', 'ServerUtilityService', 'LeaveSummaryService', 'NewHireManagementService',
	function ($scope, $timeout, $q, $location, utilityService, serverUtilityService, summaryService, NewHireManagementService) {
        
        var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);        
        $scope.summary = summaryService.buildSummaryModel();
        
        var isSectionMyTeam = function() {
            return $scope.section.dashboard.team;
        };
        var buildGetParams = function(isAvailed) {
            isAvailed = angular.isDefined(isAvailed) ? isAvailed : false;
            var params = {
                permission: isSectionMyTeam() ? 'can_view_my_team_leaves' : 'can_view_requested_leaves'
            };
            if(isAvailed) {
                params.duration = $scope.summary.availed.duration.value;
            }

            if(isSectionMyTeam()) {
                params.rel_id = $scope.relationship.primary.model._id;
                params.direct_reportee = $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false;
                if(teamOwnerId) {
                    params.emp_id = teamOwnerId;
                }
            }            
            
            return params;
        };
        var buildAvailedLeaveHeaderData = function(data) {
            var header = [],
                categories = [];

            data.start = parseInt(data.start, 10);
            data.end = parseInt(data.end, 10);

            if($scope.isDurationQuarterOnQuarter()) {
                categories = utilityService.buildQuarterList();
            } else if($scope.isDurationYearOnYear()) {
                for(var i=data.start; i <= data.end; i++) {
                    categories.push(i);
                }                
            } else {                
                var start = parseInt(data.start, 10),
                    end = parseInt(data.end),
                    list = utilityService.buildMonthList();

                if(start > end) {
                    end = end + 12;
                }
                for(var i=start; i <= end; i++) {
                    var index = i > 12 ? (i - 12) : i;
                    categories.push(list[index - 1]);
                }
            }

            $scope.summary.availed.header[$scope.summary.availed.duration.slug] = categories;
            $scope.summary.availed.xAxisData = categories;
        };
        var availedListCallback = function(data) {
            buildAvailedLeaveHeaderData(data.data);           
            $scope.summary.availed.list = data.data.graph_detail;
            $scope.summary.availed.visible = true;
        };        
        var leavelistCallback = function(data, section) {
            if(!data.data.length) {
                return false;
            }
            $scope.summary[section].list = data.data;
            $scope.summary[section].graphData = angular.isDefined(data.graphData) 
                ? data.graphData : summaryService.buildGraphData(data.data, section);
            $scope.summary[section].xAxisData = summaryService.getXAxisData(data.data);   
            $scope.summary[section].visible = true;
        };
        var getAvailedLeaveList = function() {
            $scope.summary.availed.list = [];
            $scope.summary.availed.visible = false;

            var url = summaryService.getUrl(isSectionMyTeam() ? 'availed' : 'availedAdmin'),
                params = buildGetParams(true);

            serverUtilityService.getWebService(url, params).then(function(data) {
                availedListCallback(data);
            });
        };        
        var getApprovedLeaveList = function() {
            $scope.summary.approved.list = [];
            $scope.summary.approved.visible = false;

            var url = summaryService.getUrl(isSectionMyTeam() ? 'approved' : 'approvedAdmin'),
                params = buildGetParams();

            serverUtilityService.getWebService(url, params).then(function(data) {
                leavelistCallback(data, 'approved');
            });
        };
        var getPendingLeaveList = function() {
            $scope.summary.pending.list = [];
            $scope.summary.pending.visible = false;

            var url = summaryService.getUrl(isSectionMyTeam() ? 'pending' : 'pendingAdmin'),
                params = buildGetParams();

            serverUtilityService.getWebService(url, params).then(function(data) {
                leavelistCallback(data, 'pending');
            });
        };
        var getBalanceList = function() {
            $scope.summary.balance.list = [];
            $scope.summary.balance.visible = false;
            
            var url = summaryService.getUrl(isSectionMyTeam() ? 'balance' : 'balanceAdmin'),
                params = buildGetParams();

            serverUtilityService.getWebService(url, params).then(function(data) {
                leavelistCallback(data, 'balance');
            });
        };
        var canViewRequestedLeaves = function(list) {
            var canView = false,
                permission = isSectionMyTeam() ? 'can_view_my_team_leaves' : 'can_view_requested_leaves';

            angular.forEach(list, function(value, key) {                
                if(value.permission_slug === permission) {
                    canView = true;
                }
            });

            return canView;
        };
        var setSummaryVisible = function() {
            $scope.summary.availed.visible = true;
            $scope.summary.approved.visible = true;
            $scope.summary.pending.visible = true;
            $scope.summary.balance.visible = true;
        };
        var actionListCallback = function(data) {
            if(data.data.length) {
                if(canViewRequestedLeaves(data.data)) {
                    getAvailedLeaveList();
                    getApprovedLeaveList();
                    getPendingLeaveList();
                    getBalanceList();
                } else {
                    setSummaryVisible();
                    $location.url('frontend/no-permission');
                }                                
            } else {
                setSummaryVisible();
            }            
        };
        var getActionList = function() {
            serverUtilityService.getWebService(summaryService.getUrl('action') + '/lms')
                .then(function(data) {
                    actionListCallback(data);
                });
        };
        if(!isSectionMyTeam()) {
            getActionList();
        } else {
            getAvailedLeaveList();
            getApprovedLeaveList();
            getPendingLeaveList();
            getBalanceList();
        }        
        $scope.changeSummaryDuration = function(item) {
            $scope.summary.availed.xAxisData = $scope.summary.availed.header[item.slug];
            getAvailedLeaveList();
        };
        $scope.isDurationMonthOnMonth = function() {
            return $scope.summary.availed.duration.slug == 'mom';
        };
        $scope.isDurationQuarterOnQuarter = function() {
            return $scope.summary.availed.duration.slug == 'qoq';
        };        
        $scope.isDurationYearOnYear = function() {
            return $scope.summary.availed.duration.slug == 'yoy';
        };

        /*** Start filter related code ***/
        $scope.filterIncludes ={};
        $scope.manAllFilter = [];
        var getGroupDetails = function() {
            var url = NewHireManagementService.getUrl('allmandatorygroup');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.groupList = data.data;
            });
        };
        getGroupDetails();

        $scope.includeFilter = function(element, slug, flag) {
            element.slug = slug;
            if(angular.isDefined(flag)){
                element.isChecked = flag;
            }
            $scope.filterIncludes[slug] = angular.isDefined($scope.filterIncludes[slug]) 
                && $scope.filterIncludes[slug].length ? $scope.filterIncludes[slug] : [];
                
            var i = $.inArray(element._id, $scope.filterIncludes[slug]),
                j = $.inArray(element, $scope.manAllFilter);

            (i > -1) ? $scope.filterIncludes[slug].splice(i, 1) 
                : $scope.filterIncludes[slug].push(element._id);

            (j > -1) ? $scope.manAllFilter.splice(j, 1) 
                :  $scope.manAllFilter.push(element);
        };

        $scope.candidateFilter = function(candidate) {
            var flag = true;
            if(Object.keys($scope.filterIncludes).length > 0) {
                angular.forEach($scope.filterIncludes, function(value, key) {
                    if ( angular.isDefined($scope.filterIncludes[key]) 
                        && $scope.filterIncludes[key].length > 0) {
                        if ($window._.intersection(candidate.candidate_detail[0][key], $scope.filterIncludes[key]).length == 0) {
                            flag = false;
                        }
                    }                    
                });   
                if(flag) {
                    return candidate;
                } else {
                    return ;
                }
            } else {
                return candidate;
            }
        };

        $scope.getLeaveClass = function(leaveType) {
            leaveType = leaveType.replace(/ /g,"_").toLowerCase();

            return utilityService.getValue($scope.summary.colors[leaveType], 'class') 
                ? $scope.summary.colors[leaveType].class
                : $scope.summary.colors.other_leave.class;
        };
        $scope.getLeaveCode = function(leaveType) {
            leaveType = leaveType.replace(/ /g,"_").toLowerCase();
            
            return utilityService.getValue($scope.summary.colors[leaveType], 'code') 
                ? $scope.summary.colors[leaveType].code
                : $scope.summary.colors.other_leave.code;
        };
        
	}
]);