app.controller('RejectedReviewsController', [
	'$scope', '$routeParams', '$modal', 'utilityService', 'ServerUtilityService', 'RejectedReviewsService', 
	function ($scope, $routeParams, $modal, utilityService, serverUtilityService, service) {
        var allFilterObject = service.buildAllFilterObject();        
        var cycleId = utilityService.getValue($routeParams, 'cycle_id');

        $scope.overall = service.buildOverallObject($routeParams);
        $scope.resetAllTypeFilters();
        $scope.buildAppraisalTabTitle();
        $scope.resetFacadeCountObject(allFilterObject);

        var reBuildList = function(list) {
            angular.forEach(list, function(value, key) {
                value.reviewer_type_text = $scope.overall.relationship.mapping[value.reviewer_type];                
                value.revieweeFullName = utilityService.getInnerValue(value, 'reviewee', 'full_name');
                value.reviewerFullName = utilityService.getInnerValue(value, 'reviewer', 'full_name');
                
                $scope.calculateFacadeCountOfAllFilters(list, allFilterObject, value);
            });
            angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);

            return list;
        };
        var reBuildOtherRelationsObject = function () {
            $scope.overall.otherRelations.enabled = Boolean(utilityService.getStorageValue('enable_other_relations_' + cycleId));
            $scope.overall.otherRelations.object = JSON.parse(utilityService.getStorageValue('other_relations_' + cycleId));
            utilityService.rebuildReviewerNameForRelationship($scope.overall.relationship.mapping, cycleId);
            utilityService.rebuildFilterObjectForRelationship($scope.overall.relationFilterList, cycleId);
        };
        var rejectedReviewsCallback = function(data) {
            reBuildOtherRelationsObject();
            $scope.overall.rejectedReviews = reBuildList(data);
            $scope.overall.visible = true;
        };             
        var getRejectedReviews = function() {
            var url = service.getUrl('rejectedReviews') + "/" 
                + utilityService.getValue($routeParams, 'cycle_id');
            
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    rejectedReviewsCallback(data.data);
                });
        };
        var otherRelationsCallback = function (data) {
            $scope.overall.otherRelations.enabled = utilityService.getInnerValue(data, 'data', 'is_other_relation', false);
            $scope.overall.otherRelations.list = utilityService.getInnerValue(data, 'data', 'details', []);
            $scope.overall.otherRelations.object = utilityService.buildOtherRelationsObject($scope.overall.otherRelations.list);
            utilityService.setOtherRelationsWithinStorage(cycleId, $scope.overall.otherRelations);
            getRejectedReviews();
        };
        var getOtherRelations = function () {
            var url = service.getUrl('otherRelations') + "/" + cycleId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    otherRelationsCallback(data);                         
                });
        };
        utilityService.getStorageValue('other_relations_' + cycleId)
            ? getRejectedReviews() : getOtherRelations();

        //getRejectedReviews();        
        $scope.sortBy = function(object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };
        $scope.exportToCsv = function() {
            var csvData = service.buildExportData($scope.overall);
            utilityService.exportToCsv(csvData.content, 'rejected-reviews.csv');
        };
        $scope.updatePaginationSettings('review_overall');

        /********* Start Angular Modal Section *********/
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'lg';

            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                backdrop: 'static',
                windowClass:'fadeEffect',
                size: size
            });
        };        
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }           
        };
        /********* End Angular Modal Section *********/
        
    }
]);