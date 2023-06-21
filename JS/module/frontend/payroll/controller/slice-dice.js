app.controller('SliceDiceController', [
    '$scope', '$timeout', 'utilityService', 'ServerUtilityService', 'SliceDiceService',
    function ($scope, $timeout, utilityService, serverUtilityService, sliceDiceService) {

    	$scope.sliceDice = sliceDiceService.buildSliceDiceObject();
                
        var resetObject = function(keyName) {
            $scope.sliceDice[$scope.sliceDice.tab.current].visible = false;
            $scope.sliceDice[$scope.sliceDice.tab.current].list = [];
        };
        // This method has been used to handle ALL Groups
        var addGroupSlugToElements = function(elementDetails, groupSlug) {
            angular.forEach(elementDetails, function(value, key) {
                value.group_slug = groupSlug;
            });
        };
        var buildBarChartData = function(elementDetails) {
            var data = [],
                xAxisData = [];           

            angular.forEach(elementDetails, function(value, key) {
                data.push(value.amount);
                xAxisData.push(value.name);
            });

            $scope.sliceDice[$scope.sliceDice.tab.current].data = data;
            $scope.sliceDice[$scope.sliceDice.tab.current].xAxisData = xAxisData;
        };        
        var buildPieChartData = function(elementDetails) {
            var data = [],
                maxObject = sliceDiceService.extractMaxComponent(elementDetails, 'amount');

            angular.forEach(elementDetails, function(v, k) {
                data.push({
                    name: v.name,
                    y: sliceDiceService.calculatePercentage(v.amount, $scope.sliceDice.group.sum),
                    visible: v.amount ? true : false,
                    selected: v._id === maxObject._id ? true : false,
                    sliced: v._id === maxObject._id ? true : false
                });
            });         

            $scope.sliceDice[$scope.sliceDice.tab.current].data = data;
        }; 
        var commonBuildGraph = function(elements, slug) {
            $scope.sliceDice.group.sum = $scope.sliceDice.group.object[slug].sum;
            $scope.sliceDice.tab.current === 'salaryDistribution' 
                ? buildPieChartData(elements) : buildBarChartData(elements);

            $timeout(function() {
                $scope.sliceDice[$scope.sliceDice.tab.current].visible = true;
            }, 100);
        };
        var calculateElementWiseSum = function(item) {
            sliceDiceService.calculateElementWiseSum($scope.sliceDice[$scope.sliceDice.tab.current].list,
                $scope.sliceDice.group.object[item.slug].element_details, $scope.sliceDice.group.object, 
                $scope.sliceDice[$scope.sliceDice.tab.current].filter.aggregate.slug, item.slug);
            
            commonBuildGraph($scope.sliceDice.group.object[item.slug].element_details, item.slug);
        };
        var calculateAllElementsSum = function() {
            sliceDiceService.calculateElementWiseSum($scope.sliceDice[$scope.sliceDice.tab.current].list,
                $scope.sliceDice.group.elements, $scope.sliceDice.group.object, 
                $scope.sliceDice[$scope.sliceDice.tab.current].filter.aggregate.slug, 'all');

            commonBuildGraph($scope.sliceDice.group.elements, 'all');
        }; 
        var arrangeMandatoryGroups = function(list) {            
            var groupObject = {
                all: {
                    sum: 0
                }
            };
            angular.forEach($scope.groupMandatoryList, function(value, key) {
                groupObject[value.slug] = {};
                groupObject[value.slug].element_details = value.element_details;
                groupObject[value.slug].sum = 0;
                addGroupSlugToElements(value.element_details, value.slug);
                $scope.sliceDice.group.elements = $scope.sliceDice.group.elements.concat(value.element_details);
                if(key === 0 && !$scope.sliceDice.group.current) {
                    $scope.sliceDice.group.current = value._id;
                    $scope.sliceDice.group.item = value;
                }
            });
            $scope.sliceDice.group.object = groupObject;
            if(!list.length) {                
                $scope.sliceDice[$scope.sliceDice.tab.current].visible = true;
                $scope.sliceDice[$scope.sliceDice.tab.current].data = [],
                $scope.sliceDice[$scope.sliceDice.tab.current].xAxisData = [],  
                $scope.sliceDice.group.sum = 0;
                //return false;
            }

            $scope.sliceDice.group.current ? calculateElementWiseSum($scope.sliceDice.group.item) 
                : calculateAllElementsSum();
        };
    	var getSliceDiceDetails = function () {
            resetObject();
            var url = sliceDiceService.getUrl('details') + "/" 
                + $scope.sliceDice[$scope.sliceDice.tab.current].filter.duration.id + "/" 
                + $scope.sliceDice[$scope.sliceDice.tab.current].filter.year + "/" 
                + $scope.sliceDice[$scope.sliceDice.tab.current].filter.month;

            serverUtilityService.getWebService(url).then(function (data) {
                $scope.sliceDice.grossNetPayout.list = data.data;
                $scope.sliceDice.employeeCount.list = data.data;
                $scope.sliceDice.salaryDistribution.list = data.data;                
                arrangeMandatoryGroups(data.data);                            
            });
        };
        getSliceDiceDetails();    
        $scope.setCurrentTab = function(tabname) {
            $scope.sliceDice.tab.current = tabname;
            $scope.sliceDice.group.current ? calculateElementWiseSum($scope.sliceDice.group.item) 
                : calculateAllElementsSum();          
        };
        $scope.changeDuration = function() {
            if($scope.sliceDice.tab.current === 'grossNetPayout') {
                getSliceDiceDetails();
            }
        };        
        $scope.changeMandatoryGroup = function(item) {
            $scope.sliceDice.group.all = false; 
            $scope.sliceDice[$scope.sliceDice.tab.current].visible = false;          
            $scope.sliceDice.group.current = item._id;
            $scope.sliceDice.group.item = item;
            calculateElementWiseSum(item);
        };        
        $scope.changeMandatoryGroupAll = function() {
            $scope.sliceDice.group.all = true;
            $scope.sliceDice[$scope.sliceDice.tab.current].visible = false;
            $scope.sliceDice.group.current = null;
            $scope.sliceDice.group.sum = 0;
            calculateAllElementsSum();
        };
        $scope.setMonth = function(tabname, month) {
            $scope.sliceDice[tabname].filter.month = month;
            getSliceDiceDetails();
        };
        $scope.changeYear = function() {
            getSliceDiceDetails();
        };
        $scope.isMonthDisabled = function(month) {
            var isDisabled = false,
                d = new Date(),
                currentMonth = d.getMonth();

            if($scope.sliceDice[$scope.sliceDice.tab.current].filter.year >= $scope.sliceDice.year.current
                && month >= currentMonth + 2) {
                isDisabled = true;
            }
            return isDisabled;
        };
        $scope.changeAggregate = function() {
            $scope.sliceDice.group.current ? $scope.changeMandatoryGroup($scope.sliceDice.group.item) 
                : $scope.changeMandatoryGroupAll();
        };
        $scope.renderTotal = function() {
            if(!$scope.sliceDice.group.item) {
                return null;
            }
            return $scope.sliceDice.tab.current === 'employeeCount' 
                ? $scope.sliceDice.group.object[$scope.sliceDice.group.item.slug].sum
                : ($scope.sliceDice.group.object[$scope.sliceDice.group.item.slug].sum/100000).toFixed(2);
        };
        
	}
]);