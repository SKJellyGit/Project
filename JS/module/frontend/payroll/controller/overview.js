app.controller('PayrollOverviewController', [
    '$scope', '$routeParams', '$location', '$timeout', '$q', 'PayrollOverviewService', 'utilityService', 'ServerUtilityService',
    function ($scope, $routeParams, $location, $timeout, $q,  PayrollOverviewService, utilityService, serverUtilityService) {
        var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true,
            }
        ];

        $scope.monthObj = PayrollOverviewService.buildMonthObject();
        $scope.yearList = PayrollOverviewService.getYearList(10); 
        $scope.approvalStatus = PayrollOverviewService.requestStatusObj(); 
        $scope.empReminderType = PayrollOverviewService.empRemiderTypeObj(); 
        $scope.taskSummary = [];
        $scope.isViewTaskSummary = false;
        $scope.tab = {
            parentTab: 0,
            employeeTaskRelatedchildTab: 0,
            employeeTemplate: 0,
            statutory: 0
        };
        //$scope.childTab = PayrollOverviewService.pyrollTabObj();
        $scope.statutoryCompliances = {
            list: [],
            color: {
                class: ["orange", "green", "blue", "vilot", "blue"],
                code: ['rgb(250, 160, 93)', 'rgb(112, 164, 61)', 'rgb(0, 126, 229)', 'rgb(151, 128, 201)']
            }
        };
        
        var minVagesStateVise = PayrollOverviewService.buildMinimumWagesStateVise();
        $scope.minimumVagesList = [];
        $scope.wagesCount = {
            unskilled: 0,
            semi_skilled: 0,
            skilled: 0,
            supervisory: 0,
            totalBreaches: 0
        };
        $scope.wageEmp = PayrollOverviewService.wagesEmployee();        

        if (utilityService.getValue($routeParams, 'tab')) {
            $scope.childTab = PayrollOverviewService.pyrollTabObj();            
            $scope.tab.parentTab = $scope.childTab[$routeParams.tab].pTab;
            $scope.tab.employeeTaskRelatedchildTab = $scope.childTab[$routeParams.tab].tab;
        }

        var handleBackFunctionality = function () {
            if (utilityService.getValue($routeParams, 'tabname')) {            
                $scope.tab.parentTab = $scope.childTab[$routeParams.tabname].pTab;
                $scope.tab.employeeTaskRelatedchildTab = $scope.childTab[$routeParams.tabname].tab;

                $timeout (function (){
                    $location.search('tabname', null);
                }, 1000)
            }
        };                
        var getTaskSummaryDetails = function (){
            var url = PayrollOverviewService.getUrl('taskSummary');
            serverUtilityService.getWebService(url).then(function (data){
                $scope.taskSummary = data.data;
                $timeout(function (){
                    $scope.isViewTaskSummary = true;
                }, 200);
            });
        };
        var getStatutoryCompliances = function() {
            var url = PayrollOverviewService.getUrl('statutoryCompliances');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.statutoryCompliances.list = data.data;
            });
        };
        var extractMinWages = function (emp) {
            angular.forEach(minVagesStateVise, function (v, k) {
                if(angular.isDefined(emp.work_profile_location_detail) && emp.work_profile_location_detail.length && (emp.work_profile_location_detail[0].name).toLowerCase() == v.location){
                    if (angular.isDefined(emp.work_profile_skill_level_detail)) {
                        emp.minwages = v[emp.work_profile_skill_level_detail[0].slug];
                    } else {
                        emp.minwages = 0;
                    }
                }
            });
        };
        var getMinimumWagesList = function () {
            var payload = {
                month: 5,
                year: utilityService.startYear,
                plan_id :['58db578239473e0e368b630a', '58e75df9ec9575ac26000037']
            }
            $q.all([
                serverUtilityService.postWebService(PayrollOverviewService.getUrl('tobecomputed'), payload),
                serverUtilityService.getWebService(PayrollOverviewService.getUrl('allUser'))
            ]).then(function (data) {
                var array = [];
                angular.forEach(data[0].data, function (v,k){
                    for(var i = 0; i < data[1].data.length; i++){
                        var id  = angular.isObject(data[1].data[i]['_id']) ? data[1].data[i]['_id']['$id'] : data[1].data[i]['_id']
                        if(v.employee_preview._id == id){
                            extractMinWages(data[1].data[i]);
                            if (angular.isDefined(data[1].data[i].work_profile_skill_level_detail) && data[1].data[i].work_profile_skill_level_detail.length) {
                               $scope.wagesCount[data[1].data[i].work_profile_skill_level_detail[0].slug]++ ;
                            }
                            if(angular.isDefined(data[1].data[i].employee_id)){ 
                              data[1].data[i].basic_salary = angular.isDefined($scope.wageEmp[data[1].data[i].employee_id]) ? $scope.wageEmp[data[1].data[i].employee_id] : 0;
                            }else {
                                data[1].data[i].basic_salary = 0;
                            }
                            var diff = $scope.getWagesDiffernece(data[1].data[i].basic_salary, data[1].data[i].minwages);
                            if (diff) {
                            data[1].data[i].diffPercent = diff.diffPercent;
                            data[1].data[i].diffFlag = diff.flag;
                            if(!diff.flag){
                                $scope.wagesCount.totalBreaches++;
                            }
                        }
                            array.push(data[1].data[i]);
                            break;
                        }
                    }
                });
                $scope.minimumVagesList = array;
                $scope.calculateFacadeCountOfAllFilters($scope.minimumVagesList, allFilterObject);
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);                
            });
        };
        
        $scope.hasAdminAllTabAccess = {
            enabled: false,
            isLoaded: false
        };
        var initializeAPICall = function () {
            getTaskSummaryDetails();
            getStatutoryCompliances();
            getMinimumWagesList();
        };
        var payrollModulePermissionsCallback = function (list) {
            $scope.hasAdminAllTabAccess.enabled = !PayrollOverviewService.hasOnlyInvestmentsAndClaimsPermission(list);
            $scope.hasAdminAllTabAccess.isLoaded = true;
            $scope.childTab = PayrollOverviewService.pyrollTabObj($scope.hasAdminAllTabAccess);
            handleBackFunctionality();
            if ($scope.hasAdminAllTabAccess.enabled) {
                initializeAPICall();
            }
        };
        var getPayrollModulePermissions = function () {
            var url = PayrollOverviewService.getUrl('modulePermission') + '/payroll'; 
            serverUtilityService.getWebService(url)
                .then(function (data){
                    payrollModulePermissionsCallback(utilityService.getValue(data, 'data', []));
                });
        };

        if (utilityService.getInnerValue($scope.wrapperObject, 'legalEntity', 'enabled')) {
            getPayrollModulePermissions();
        } else {            
            initializeAPICall();
            $scope.hasAdminAllTabAccess.enabled = true;
            $scope.hasAdminAllTabAccess.isLoaded = true;
            $scope.childTab = PayrollOverviewService.pyrollTabObj($scope.hasAdminAllTabAccess);
            handleBackFunctionality();
        }

        $scope.getWagesDiffernece = function (baisc, wages){
            if(angular.isNumber(baisc) && angular.isNumber(wages)){
                var obj = {
                    diffPercent: null,
                };
                var change = baisc - wages;
                obj.flag = change > 0 ? true : false;
                var diffPercent = parseFloat(((change/wages) * 100).toFixed(2));
                obj.diffPercent = diffPercent > 0 ? "+" + diffPercent + "%" : "-" + diffPercent + "%";
                return obj;
            }
        };
        $scope.goToStatutory = function (key){
            $scope.tab.parentTab = $scope.childTab[key].pTab;
            $scope.tab.statutory = $scope.childTab[key].tab;
        };
        $scope.goToListing = function (item){
            $scope.tab.parentTab = $scope.childTab[item.title].pTab;
            $scope.tab.employeeTaskRelatedchildTab = $scope.childTab[item.title].tab;
        };
        $scope.goToMainList = function (item) {
            var tab = item.title;
            utilityService.setReloadOnSearch(true);
            $location.url('/frontend/payroll/summary').search({tab: tab});
        };

        /***** Start: Section to handle Payroll Admin Tabs other than Payments *****/
        $scope.forceHideAdminPayrollTab = function() {
            var exceptionIds = [];
            return exceptionIds.indexOf($scope.user.loginEmpId) == -1 ? true : false;
        };
        /***** End: Section to handle Payroll Admin Tabs other than Payments *****/
    }
]);