app.controller('QuestionAnalyticsController', [
	'$scope', '$routeParams', 'utilityService', 'ServerUtilityService', 'ReviewAnalyticsService',
	function ($scope, $routeParams, utilityService, serverUtilityService, service) {
        $scope.questionAnalytics = service.buildQuestionAnalyticsObject($routeParams);
        $scope.buildAppraisalTabTitle();

        var questionWiseAnalyticsCallback = function(data) {
            $scope.questionAnalytics.ratingScale = utilityService.getInnerValue(data, 'data', 'rating_scale');
            $scope.questionAnalytics.isRatingReverse = utilityService.getInnerValue(data, 'data', 'order_best') == 'asc';
            $scope.questionAnalytics.list = service.calculatePercentage(utilityService.getInnerValue(data, 'data', 'questions', []), $scope.questionAnalytics);            
            $scope.questionAnalytics.cycle_detail = utilityService.getInnerValue(data, 'data', 'cycle_detail');
            $scope.questionAnalytics.visible = true;
        };
        var getQuestionWiseAnalytics = function() {
            var url = service.getUrl('questionWiseAnalytics') + "/" 
                + utilityService.getValue($routeParams, 'cycle_id') + "/peer/12";

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    questionWiseAnalyticsCallback(data);                                     
                });
        };
        getQuestionWiseAnalytics();       
        
    }
]);