app.controller('PayrollGlanceController', [
    '$scope', 'utilityService', 'ServerUtilityService', 'PayrollGlanceService', 'CompensationService',
    function ($scope, utilityService, serverUtilityService, glanceService, compensationService) {
    	
        $scope.glance = glanceService.buildGlanceObject();
        
        var reBuildList = function(list) {
            angular.forEach(list, function(value, key) {
                if(angular.isUndefined(value.data.length)) {
                    value.data = [{
                        _id: $scope.glance.lastMonth.display,
                        emp_count: 0,
                        amount: 0
                    }]
                }
                if(value.data.length > 1) {
                    value.data.sort(utilityService.dynamicSort("_id"));
                    value.data = glanceService.findAndFillMissingData(value.data);
                }                

                value.emp_count = 0;
                value.current_worth = 0;
                value.graph = [];
                value.empdata = [];
                value.xAxisData = [];
                value.firstObject = null
                value.lastObject = null;

                if(value.data.length == 1) {                    
                    value.firstObject = value.data[0];
                    value.emp_count = value.firstObject.emp_count;
                    value.current_worth = value.firstObject.amount;
                } else if(value.data.length > 1) {
                    value.firstObject = value.data[value.data.length - 2];
                    value.lastObject = value.data[value.data.length - 1];
                    value.emp_count = value.lastObject.emp_count;
                    value.previous_worth = value.firstObject.amount;
                    value.current_worth = value.lastObject.amount;
                }

                angular.forEach(value.data,  function(v, k) {                       
                    value.empdata.push(v.emp_count);
                    value.graph.push(v.amount);
                    value.xAxisData.push($scope.glance.month[v._id - 1]);
                });

                delete value.firstObject;
                delete value.lastObject;
                delete value.data;
            });
            return list;
        };

    	var getAtGlanceDetails = function () {
            var url = glanceService.getUrl('keyMetrices') + "/" 
                + $scope.glance[$scope.glance.tab.current].duration.id;

            serverUtilityService.getWebService(url).then(function (data) {
                //data =  glanceService.overWriteAtAGlanceAPIResponse();
                if(!isNaN(data.data.month) && !isNaN(data.data.year)) {
                    $scope.glance.currentYear = parseInt(data.data.year);
                    $scope.glance.lastMonth.value = parseInt(data.data.month) - 1;
                    $scope.glance.lastMonth.display = $scope.glance.month[$scope.glance.lastMonth.value];
                }
                var list = reBuildList(data.data.key_metrices);
            	$scope.glance.keyMetrices.list = glanceService.reBuildList(list);
                $scope.glance.keyMetrices.visible = true;

                var list = reBuildList(data.data.statutory_deductions);
                $scope.glance.statutoryDeductions.list = glanceService.reBuildList(list);
                $scope.glance.statutoryDeductions.visible = true;
            });
        };
        getAtGlanceDetails();
        var getInvestmentDetails = function (year) {
            var year = angular.isDefined(year) ? year : compensationService.buildDefaultYearObject(),
                url = glanceService.getUrl('investments') + "/" 
                + year + "/" + (year + 1);
                //+ $scope.glance.investments.duration.id;

            serverUtilityService.getWebService(url).then(function (data) {
            	$scope.glance.investments.list = glanceService.reBuildList(data.data);
                $scope.glance.investments.visible = true;
            });
        };
        getInvestmentDetails();
        $scope.setCurrentTab = function(tabname) {
            $scope.glance.tab.current = tabname;
            //$scope.glance[tabname].duration = glanceService.buildDefaultDurationObject();
        };
        $scope.changeDuration = function(duration, tabname) {
            var durationType = $scope.glance[tabname].duration.id;
            tabname === 'investments' ? getInvestmentDetails(durationType) : getAtGlanceDetails(durationType);
        };
        $scope.changeFinancialYear = function(year) {
            getInvestmentDetails(year);
        };     
	}
]);