app.controller('ManagerReviewController', [
	'$scope', '$routeParams', '$location', 'utilityService', 'ServerUtilityService', 'ManagerReviewService', 'LeaveSummaryService',
	function ($scope, $routeParams, $location, utilityService, serverUtilityService, service, summaryService) {
        var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);
        $scope.review = {
            cycle: service.buildCycleListObject()
        };

        var buildGetParams = function () {
            var params = {
                rel_id: $scope.relationship.primary.model._id,
                direct_reportee: $scope.relationship.secondary.model.slug == "direct_reportee",
            };
            if (teamOwnerId) {
                params.emp_id = teamOwnerId;
            }
            return params;
        };
        var reviewCycleListCallback = function (data) {
            if (utilityService.getValue(data, 'status') === 'success') {
                $scope.review.cycle.list = data.data;
            } else {
                $scope.review.cycle.error.status = true;
                $scope.review.cycle.error.message = utilityService.getValue(data, 'message');
            }                    
            $scope.review.cycle.visible = true;
        };
        var getReviewCycleList = function() {
            serverUtilityService.getWebService(service.getUrl('reviews'), buildGetParams())
                .then(function(data) {
                    reviewCycleListCallback(data);                    
                });
        };
        getReviewCycleList();
        $scope.viewOverallDetails = function(item) {
            $location.url('dashboard/cycle-overall-details').search({ 
                cycle: item.cycle_id,
                rel_id: $scope.relationship.primary.model._id,
                direct_reportee: $scope.relationship.secondary.model.slug == "direct_reportee"
            });
        };
        $scope.sortBy = function(object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };
        $scope.doEvaluation = function(as, relationship, item, task) {
            $location.url('dashboard/cycle-evaluation').search({ 
                as: as,
                cycle:  utilityService.getValue(item, 'cycle_id'),
                emp_id: utilityService.getValue(task, '_id'),
                relationship: relationship                
            });
        };
        $scope.viewCycleDetails = function(item) {
            $location.url('dashboard/cycle-details').search({ 
                cycle: item.cycle_id, 
                callback: 'my-team' 
            });
        };

        $scope.updatePaginationSettings('review_cycle');
    }
]);