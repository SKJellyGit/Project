app.controller('PayrollChecksController', [
    '$scope', '$routeParams', '$location', '$timeout', '$window', '$route', 'utilityService', 'ServerUtilityService', 'PayrollOverviewService', 'RunPayrollService', '$filter', '$routeParams', '$rootScope',
    function ($scope, $routeParams, $location, $timeout, $window, $route, utilityService, serverUtilityService, PayrollOverviewService, RunPayrollService, $filter, $routeParams, $rootScope) {
         
        var initializeOnTabClcik = function () {
            $scope.isAll = {
                flag: false,
                count: 0,
                totalErrors: 0,
                recheckedErrors: 0,
                isRecheck: false
            };
        };
        $scope.salaryBand = PayrollOverviewService.buildSalarayBandObj();
        $scope.employeeStatus = PayrollOverviewService.buildEmployeeStatus();
        initializeOnTabClcik();
        
        var runPayrollObject = JSON.parse(utilityService.getStorageValue('runPayrollObject'));
        var checksEmployeeObject = JSON.parse(utilityService.getStorageValue('checkesForEmployee'));
        var checksIdToBeCorrect = JSON.parse(utilityService.getStorageValue('checksIdToBecorrect'));
        console.log(checksIdToBeCorrect);
        
        $scope.operators = RunPayrollService.BuildOperatorsHashMap();
        $scope.definedChecks = RunPayrollService.buildDefinedChecksObj();
        $scope.employeeStatus = PayrollOverviewService.buildEmployeeStatus();
        $scope.ComponentsList = [];
        $scope.correctionList = [];
        $scope.groupList = [];
        
//        var getGroupDetails = function() {
//            var url = PayrollOverviewService.getUrl('allmandatorygroup');
//            serverUtilityService.getWebService(url).then(function(data) {
//                $scope.groupList = data.data;
//                angular.forEach($scope.groupList, function (v) {
//                    $scope.filterIncludes[v.slug] = [];
//                    angular.forEach(v.element_details, function (val) {
//                        val.isChecked = false;
//                    });
//                });
//            });
//        };
//        getGroupDetails();   
        
        var getCompanyBasicInfo = function () {
            var url = RunPayrollService.getUrl('basic');
            serverUtilityService.getWebService(url)
                    .then(function (data) {
                        if(data.data.compensate_credit){
                             angular.forEach(data.data.compensate_credit,function(v,k){
                                $scope.ComponentsList.push(v);
                             });
                        }
                        if(data.data.compensate_debit){
                            angular.forEach(data.data.compensate_debit,function(v,k){
                                $scope.ComponentsList.push(v);
                             });
                        }
                    });
        };
        getCompanyBasicInfo();
        
        var syncPayrollChecksModel = function (model) {
            $scope.payrollChecks = RunPayrollService.buildPayrollChecksModel(model);
            console.log($scope.payrollChecks);
        };
//        syncPayrollChecksModel();
        
        var getPayrollChecks = function () {
            var url = RunPayrollService.getUrl('Checks');
            serverUtilityService.getWebService(url)
                    .then(function (data) {
                        syncPayrollChecksModel(data.data);
                });
        };
        getPayrollChecks();
        
        $scope.selectAllChecks = function (isAll, section) {
            var count = 0;
            if(angular.isDefined(section) && section == 'correction'){
                angular.forEach($scope.correctionList, function (value) {
                value.isSelected = isAll;
                if (value.isSelected) {
                    count += 1;
                }
            });
            }else{
            angular.forEach($scope.definedChecks, function (value) {
                value.isSelected = isAll;
                if (value.isSelected) {
                    count += 1;
                }
            });
            angular.forEach($scope.payrollChecks.custom_checks, function (value) {
                value.isSelected = isAll;
                if (value.isSelected) {
                    count += 1;
                }
            });
        }
            $scope.isAll.count = count;
            $scope.isAll.flag = isAll;
        };
        
        
        $scope.updateSelected = function (section) {
            var count = 0;
            if (angular.isDefined(section) && section == 'correction') {
                angular.forEach($scope.correctionList, function (value) {
                    if (value.isSelected) {
                        count += 1;
                    }
                });
                $scope.isAll.flag = (count == $scope.correctionList.length) ? true: false;
            } else {
                angular.forEach($scope.definedChecks, function (value) {
                    if (value.isSelected) {
                        count += 1;
                    }
                });
                angular.forEach($scope.payrollChecks.custom_checks, function (value) {
                    if (value.isSelected) {
                        count += 1;
                    }
                });
            $scope.isAll.flag = (count == $scope.payrollChecks.custom_checks.length + $scope.definedChecks.length) ? true : false;
            }
            $scope.isAll.count = count;
        };
        
        var updateChecksList = function (data, list){
            angular.forEach(list, function (value){
                var id = angular.isObject(value._id) ? value._id.$id : value._id;
                if(value.isSelected){
                    value.isComputing = false;
                    value.isComputed = true;
                    if (angular.isDefined(data[id]) && data[id] > 0) {
                        value.isError = true;
                        value.error = data[id];
                        $scope.isAll.totalErrors += parseInt(data[id]);
                    }
                }
            });
        };
        
        var computeCallback = function (data, item) {
            if (angular.isDefined(item)) {
                var id = angular.isObject(item._id) ? item._id.$id : item._id;
                item.isComputing = false;
                item.isComputed = true;
                if (angular.isDefined(data[id]) && data[id] > 0) {
                    item.isError = true;
                    item.error = data[id];
                    $scope.isAll.totalErrors += parseInt(data[id]);
                }
            } else {
                $scope.isAll.totalErrors = 0;
                updateChecksList(data, $scope.definedChecks);
                updateChecksList(data, $scope.payrollChecks.custom_checks);
            }
        };
        
        $scope.computeChecks = function (item, isCustom) {
            var payload = {};
            if (angular.isDefined(item) && angular.isDefined(isCustom)) {
                item.isComputing = false;
                item.isComputed = false;
                item.isError = false;
                payload = {
                    ids: checksEmployeeObject,
                    checks:[ {
                        id: angular.isObject(item._id) ? item._id.$id : item._id,
                        is_custom_check: isCustom
                    }
                    ]
                };
                item.isComputing = true;
            }else{      
               payload = RunPayrollService.buildDefinedChecksPayLoad(checksEmployeeObject, $scope.definedChecks, $scope.payrollChecks.custom_checks);
            }
            var url = RunPayrollService.getUrl('computeCheck');
            serverUtilityService.postWebService(url, payload)
                    .then(function (data) {
                        if (data.status == 'success') {
                            $timeout(function () {
                                computeCallback(data.data, item);
                            }, 500);
                        }
                    });
        };
        
        $scope.correctErrorInChecks = function (item, isCustom) {
            var payload = {};
            if (angular.isDefined(item) && angular.isDefined(isCustom)) {
                item.isComputing = false;
                item.isComputed = false;
                item.isError = false;
                payload = {
                    ids: checksEmployeeObject,
                    checks:[ {
                        id: angular.isObject(item._id) ? item._id.$id : item._id,
                        is_custom_check: isCustom
                    }
                    ]
                };
                item.isComputing = true;
            }else{      
               payload = RunPayrollService.buildDefinedChecksPayLoad(checksEmployeeObject, $scope.definedChecks, $scope.payrollChecks.custom_checks);
            }
            var url = RunPayrollService.getUrl('computeCheck');
            serverUtilityService.postWebService(url, payload)
                    .then(function (data) {
                        if (data.status == 'success') {
                            $timeout(function () {
                                computeCallback(data.data, item);
                            }, 500);
                        }
                    });
        };
        
        $scope.navigateToDiffrentSections = function (url, page, item) {
            if (angular.isDefined(page) && page == 'corection') {
                console.log(item);
                if (angular.isDefined(item)) {
                    var id = angular.isObject(item._id) ? item._id.$id : item._id;
                    var checksIdToBecorrect = [id];
                } else {
                     checksIdToBecorrect = RunPayrollService.buildChecksIdsToBeCorrect($scope.definedChecks, $scope.payrollChecks.custom_checks);
                };
                utilityService.setStorageValue('checksIdToBecorrect', JSON.stringify(checksIdToBecorrect));
            }
            $location.url(url);
        };
        
    }
]);