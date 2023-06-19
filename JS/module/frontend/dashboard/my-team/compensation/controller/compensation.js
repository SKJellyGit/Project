app.controller('ManagerCompensationController', [
	'$scope', '$location', '$q', 'utilityService', 'ServerUtilityService', 'ManagerCompensationService', 'LeaveSummaryService', 'SalaryService',
	function ($scope, $location, $q, utilityService, serverUtilityService, compensationService, summaryService, salaryService) {
        
        var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);
        $scope.compensation = compensationService.buildCompensationObject();

        var buildGetParams = function () {
            var params = {
                rel_id: $scope.relationship.primary.model._id,
                direct_reportee: $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false,
            };
            if (teamOwnerId) {
                params.emp_id = teamOwnerId;
            }
            return params;
        };
        var getCompensationList = function() { 
            serverUtilityService.getWebService(compensationService.getUrl('list'), buildGetParams())
                .then(function(data) {
                    $scope.compensation.list = data.data;
                    $scope.compensation.visible = true;
                });
        };        
        getCompensationList();        
        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };
        /*var getAppraisalCycle = function(item) {
            $scope.compensation.breakup.empId = utilityService.getInnerValue(item, 'employee_preview', '_id');
            var url = compensationService.getUrl('duration');
                params = {
                    emp_id: $scope.compensation.breakup.empId
                };

            serverUtilityService.getWebService(url, params)
                .then(function(data) {
                    $scope.compensation.appraisal.list = data.data;
                    $scope.compensation.appraisal.current = data.data[data.data.length - 1];
                    toggleModal('ctc-gross-breakup', true);
                });
        };*/
        var getAppraisalCycle = function(item) {
            console.log(item);

            $scope.compensation.appraisal.visible = false;
            $scope.compensation.breakup.empId = utilityService.getInnerValue(item, 'employee_preview', '_id');
            
            $q.all([
                serverUtilityService.getWebService(compensationService.getUrl('duration'), { emp_id: $scope.compensation.breakup.empId }),
                serverUtilityService.getWebService(compensationService.getUrl('incrementalSalary') + "/" + $scope.compensation.breakup.empId)
            ]).then(function (data) {
                $scope.compensation.appraisal.list = data[0].data;
                $scope.compensation.appraisal.current = data[0].data[data[0].data.length - 1];

                var graphObject = {},
                    arrKeyName = $scope.compensation.breakup.type.split('_'),
                    keyName = arrKeyName[0];

                graphObject = salaryService.buildGraphObject(data[1].data, keyName);
                $scope.compensation.appraisal.graph = graphObject.graph;
                $scope.compensation.appraisal.categories = graphObject.categories;
                $scope.compensation.appraisal.visible = true;
                toggleModal('ctc-gross-breakup', true);
            });
        };
        $scope.toggleBreakup =function(item, keyname) {
            $scope.compensation.breakup.list = [];
            $scope.compensation.breakup.type = keyname;
            $scope.compensation.breakup.list = utilityService.getValue(item, keyname, []);
            getAppraisalCycle(item);
        };
        $scope.changeAppraisalCycle = function() {
            var url = compensationService.getUrl('breakup') + "/" 
                + $scope.compensation.breakup.empId + "/"
                + $scope.compensation.appraisal.current._id.$id;
            
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.compensation.breakup.list = utilityService.getValue(data.data, $scope.compensation.breakup.type, []);
                });
        };
        var toggleModal = function(id, flag) {
            flag ? $('#' + id).appendTo("body").modal({keyboard: false, show: true}) 
                : $('#' + id).modal('hide');
        };
	}
]);