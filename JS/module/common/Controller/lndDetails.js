app.controller('LndDetailsController',['$scope','ServerUtilityService','$routeParams','utilityService',function ($scope,ServerUtilityService,$routeParams,utilityService) {
    
    var trainingTypeId=utilityService.getValue($routeParams,'lndId')

    ServerUtilityService.getWebService('LND-frontend/training-details/'+trainingTypeId)
    .then(function (data) {
        console.log(data)
    })

}])