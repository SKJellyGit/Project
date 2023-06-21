app.controller('RunPayrollController', [
    '$scope', '$routeParams', '$location', '$timeout', '$q', '$routeParams', 'utilityService', 'ServerUtilityService', 'RunPayrollService', 'PayrollOverviewService', 'PayrollParentService', '$modal',
    function ($scope, $routeParams, $location, $timeout, $q, $routeParams, utilityService, serverUtilityService, RunPayrollService, PayrollOverviewService, parentService, $modal) {
        $scope.uploadErrorMessages = []
        $scope.errorMessages = []
        $scope.step = 1;
        var paginationKey = {
            1: "run_payroll_1",
            2: "run_payroll_2",
            3: "run_payroll_3",
            4: "run_payroll_4",
            5: "run_payroll_5",
        };
        $scope.monthsList = ["January", "February", "March", "April", "May", "June", "July", 
            "August", "September", "October", "November", "December"];
        if ($location.path() != "/bank-report") {
            $scope.updatePaginationSettings(paginationKey[$scope.step]);
        }
        $scope.employeeStatus = PayrollOverviewService.buildEmployeeStatus();
        $scope.graph = {
            data: [],
            category: [],
            isVisible : false
        };
        var initializeOnTabClcik = function () {
            utilityService.removeStorageValue('checkesForEmployee');
            $scope.isAll = {
                flag: false,
                count: 0,
                unholdCount: 0,
                totalNetPayout: 0,
                totalGross: 0,
                holdTill: 1,
                holdComment: null
            };
        };
        var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true,
                collection_key: 'employee_preview'
            },
            {
                countObject: 'employeeStatus',
                collection: [1, 2, 3, 4, 5],
                isArray: false,
                collection_key: 'employee_preview',
                key: 'system_plans_employee_status'
            },
            {
                countObject: 'salary',
                collection: [],
                isSalary:true
            }
        ];
        $scope.legal_entity = {
            selected: null,
            entity_id: utilityService.getStorageValue("legalEntityId")
        };
        $scope.getLegalEntity = function() {
            if($scope.legal_entity.entity_id) {
                var entities_list = JSON.parse(utilityService.getStorageValue("legalEntityElements"));
                $scope.legal_entity.selected = entities_list.find(function(val) { return val._id == $scope.legal_entity.entity_id; });
            } else {
                $scope.legal_entity.selected = null;
            }
        };
        $scope.getLegalEntity();
        initializeOnTabClcik();        
        var runPayrollObject = JSON.parse(utilityService.getStorageValue('runPayrollObject'));
        $scope.runPayrollErrorObject = JSON.parse(utilityService.getStorageValue('runPayrollErrorObject'));
        $scope.runPayrollNoticeObject = JSON.parse(utilityService.getStorageValue('runPayrollNoticeObject'));
        if (($scope.runPayrollErrorObject && $scope.runPayrollErrorObject.length > 0)
            || ($scope.runPayrollNoticeObject && $scope.runPayrollNoticeObject.length > 0)) {
            $timeout(function () {
                $scope.openModal('re-run-payroll-error-object.tmpl.html', 'runPayrollErrorObject', 'md')
            }, 3000);
        }
        $scope.routeFlag = {
            planIds : angular.isDefined(runPayrollObject.planId) ? runPayrollObject.planId : null,
            month : angular.isDefined(runPayrollObject.month) ? runPayrollObject.month : null,
            year : angular.isDefined(runPayrollObject.year) ? runPayrollObject.year : null
        };        
        $scope.toBeComputedList = [];
        $scope.computedList = [];
        $scope.finalizedList = [];
        $scope.paidList = [];
        $scope.externalList = [];
        $scope.externalComponets = [];
        $scope.externalComponetsPlanwise = null;
        $scope.payrollStatusCount = null;
        $scope.isVisible = false;
        $scope.isdownload = false;
        $scope.brakeupComponents = {credit:[], debit:[], other:[]};
        $scope.computedObject = RunPayrollService.buildComputedObject();
        $scope.finalizedObject = {
            filteredList: []
        };
        $scope.paidObject = {
            filteredList: []
        };
        $scope.toBeComputedObject = {
            filteredList: []
        };
        $scope.externalComponentObject = {
            filteredList: []
        };

        $scope.cannotFinalizePayroll = false
        $scope.cannotPayPayroll = false
        $scope.getRunPayrollAutomation();
        var extractMandatoryGroupName = function (array) {
            return array.map(function(elem){
                return elem.name;
            }).join(",");
        };
        var addMandatoryGroupsToList = function (v) {            
            angular.forEach($scope.groupList, function (value, key) {
                var array = utilityService.getInnerValue(v, 'employee_preview', value.slug + '_detail', []);
                v[value.slug] = array.length ? extractMandatoryGroupName(array) : null;
            });
        };      
        var extractEmployeeData = function (data, statusKey) {
            $scope.isAll.totalNetPayout = 0; 
            angular.forEach(data, function (v) {
                v.full_name = utilityService.getInnerValue(v, 'employee_preview', 'full_name');
                
                v.employee_code = angular.isDefined(v.employee_preview.personal_profile_employee_code) 
                    ? v.employee_preview.personal_profile_employee_code : 'not defined';

                v.employee_id = angular.isDefined(v.employee_preview.personal_profile_employee_code) 
                    ? v.employee_preview.personal_profile_employee_code : 'not defined';

                v.employee_status = angular.isDefined(v.employee_preview.system_plans_employee_status) 
                    ? $scope.employeeStatus[v.employee_preview.system_plans_employee_status].label : $scope.employeeStatus[1].label;

                v.empStatus = angular.isDefined(v.employee_preview.system_plans_employee_status) 
                    ? $scope.employeeStatus[v.employee_preview.system_plans_employee_status].label : $scope.employeeStatus[1].label;

                v.joining_date = angular.isDefined(v.employee_preview.work_profile_joining_date) 
                    ? v.employee_preview.work_profile_joining_date : 'not defined';

                v.last_working_date = angular.isDefined(v.employee_preview.last_working_date) 
                    ? v.employee_preview.last_working_date : '-';

                v.location = angular.isDefined(v.employee_preview.work_profile_location_detail) && v.employee_preview.work_profile_location_detail.length 
                    ? v.employee_preview.work_profile_location_detail[0].name : 'not defined';

                v.department = angular.isDefined(v.employee_preview.work_profile_department_detail) && v.employee_preview.work_profile_department_detail.length 
                    ? v.employee_preview.work_profile_department_detail[0].name : 'not defined';

                v.mainStatus = angular.isDefined(statusKey) && angular.isDefined(v[statusKey]) ? v[statusKey] : false; 
                
                if(angular.isDefined(statusKey) && statusKey == 'status_paid'){
                    $scope.isAll.totalNetPayout += v.total_net_pay ? parseFloat(v.total_net_pay) : 0;
                    $scope.isAll.totalGross += v.total_gross ? parseFloat(v.total_gross) : 0;
                    
                    v.bankName = angular.isDefined(v.employee_preview.financial_details_bank_name) 
                        ? v.employee_preview.financial_details_bank_name : '-';

                    v.accountNo = angular.isDefined(v.employee_preview.financial_details_bank_account_number) 
                        ? v.employee_preview.financial_details_bank_account_number : '-';

                    v.ifsc = angular.isDefined(v.employee_preview.financial_details_ifsc_code) 
                        ? v.employee_preview.financial_details_ifsc_code : '-';
                    v.work_profile_work_email = angular.isDefined(v.employee_preview.work_profile_work_email) 
                    ? v.employee_preview.work_profile_work_email : '-';
                }

                if(angular.isDefined(statusKey) && statusKey == 'status_finalized'){
                    v.bankName = utilityService.getInnerValue(v, 'employee_preview', 'bank_name', '-');
                    v.accountNo = utilityService.getInnerValue(v, 'employee_preview', 'bank_account_number', '-');
                    v.ifsc = utilityService.getInnerValue(v, 'employee_preview', 'ifsc_code', '-');
                    v.pan = utilityService.getInnerValue(v, 'employee_preview', 'pan', '-');
                }

                if (utilityService.getValue(v, 'mainStatus')) {
                    v.filter_status = 3;
                } else if (utilityService.getValue(v, 'status_with_held')) {
                    v.filter_status = 2;
                } else if (!utilityService.getValue(v, 'status_with_held') 
                    && !utilityService.getValue(v, 'mainStatus')) {
                    v.filter_status = 1;
                } else {
                    v.filter_status = '';
                }
                
                addMandatoryGroupsToList(v);
            });
        };        
        var getPayrollStatusCount = function () {
            $scope.graph.isVisible = false;
            var url = RunPayrollService.getUrl('payrollStatus'),
                payload = RunPayrollService.buildPayrollPayload($scope.routeFlag);

            serverUtilityService.postWebService(url, payload).then(function (data) {
                if (data.status == 'success') {
                    $scope.payrollStatusCount = data.data;

                    $scope.graph.data = utilityService.buildCompuationGraphData(data.data);                         
                    $scope.graph.category = utilityService.buildCompuationGraphCategoryData();
                    $timeout(function (){
                        $scope.graph.isVisible = true;
                    },500);
                }
            });            
        };
        getPayrollStatusCount();

        /***** To Be Computed Section *****/
        $scope.isEmpSalaryProcessed = false;

        var updateSalaryProcessedFlag = function() {
            angular.forEach($scope.toBeComputedList, function(value, key) {
                $scope.isEmpSalaryProcessed = $scope.isEmpSalaryProcessed || value.salary_processed;
            });
        };  
        var getToBeComputedList = function () {
            var url = RunPayrollService.getUrl("toBeComputed"),
                payload = RunPayrollService.buildPayrollPayload($scope.routeFlag);

            serverUtilityService.postWebService(url, payload).then(function (data) {
                if (data.status == 'success') {
                    extractEmployeeData(data.data, 'status_computed');
                    $scope.toBeComputedList = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.toBeComputedList, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    updateSalaryProcessedFlag();
                }
            });
        };
        getToBeComputedList();        
        $scope.computePayroll = function () {
            var url = RunPayrollService.getUrl("computePayroll"),
                // filteredList = utilityService.getValue($scope.toBeComputedObject, 'filteredList', []),
                payload = RunPayrollService.buildComputePayrollPayload($scope.toBeComputedList);

            serverUtilityService.postWebService(url, payload).then(function (data) {
                if(data.status == 'success'){
                    $scope.errorMessages = []
                    utilityService.showSimpleToast(data.message);
                    getPayrollStatusCount();
                    $scope.setStep(2);  // it is changed from 5 to 2 to bypass external component tab
                }else{
                    $scope.errorMessages = buildError(data);
                    $scope.openModal('runPayrollErrorsOnclick.tmpl.html', 'runPayrollErrorsOnclick', 'md');

                }
            }); 
        };
        
        /***** External Section *****/       
        var externalCompCallback = function (data, externalComponets){  
            $scope.intialExternalComp = [];
            function extractInitialValue (item){
                var obj = {};
                obj._id = item._id;
                angular.forEach(externalComponets, function (value) {
                    obj[value.slug] = angular.isDefined(item[value.slug]) ? item[value.slug] : 0; 
                });
                $scope.intialExternalComp.push(obj);
            }
            angular.forEach(data, function (v){
                v.full_name = v.employee_preview.full_name;
                v.employee_code = angular.isDefined(v.employee_preview.personal_profile_employee_code) ? v.employee_preview.personal_profile_employee_code : 'not defined';
                v.employee_id = angular.isDefined(v.employee_preview.personal_profile_employee_code) ? v.employee_preview.personal_profile_employee_code : 'not defined';
                v.employee_status = angular.isDefined(v.employee_preview.system_plans_employee_status) ? $scope.employeeStatus[v.employee_preview.system_plans_employee_status].label : $scope.employeeStatus[1].label;
                v.empStatus = angular.isDefined(v.employee_preview.system_plans_employee_status) ? $scope.employeeStatus[v.employee_preview.system_plans_employee_status].label : $scope.employeeStatus[1].label;
                extractInitialValue(v);
            });
        };       
        var getExternalList = function (flag) {
            flag = angular.isDefined(flag) ? flag : false;
            $q.all([
               serverUtilityService.getWebService(RunPayrollService.getUrl("planWiseExtComponet")+ "?" + $.param({ year: $scope.routeFlag.year, month: $scope.routeFlag.month})), 
               serverUtilityService.getWebService(RunPayrollService.getUrl("externalComponets")+ "?" + $.param({ year: $scope.routeFlag.year, month: $scope.routeFlag.month}))
            ]).then(function (data){
                $scope.externalComponetsPlanwise = data[0].data;
                externalCompCallback(data[1].data.data, data[1].data.external_component);
                $scope.externalList = data[1].data;
                if (flag) {
                    $scope.calculateFacadeCountOfAllFilters($scope.externalList.data, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                   }
                $scope.externalComponets = data[1].data.external_component;
                $scope.externalCsvColumn = createCsvColumn(data[1].data.external_component); 
            });
        };
        getExternalList();
        
        $scope.saveExternalComponents = function () {
            var url = RunPayrollService.getUrl('externalComponets'),
                payload = RunPayrollService.buildExternalComponentPayload($scope.externalList, $scope.intialExternalComp);
            
            serverUtilityService.postWebService(url, payload)
                .then(function (data){
                    utilityService.showSimpleToast(data.message);
                    $scope.setStep(2);
                });
        };        
        var createCsvColumn = function (list){
            var column = {
                'employee_code' : ''
            };
            angular.forEach(list, function (v, k){
               column[v.slug] = '';
            });
            return column;
        };        
        $scope.isExternalComponentExist = function (planId, slug){
            var flag = $scope.externalComponetsPlanwise[planId].indexOf(slug) > -1 ? true : false;
            return flag;
        };

        /***** Computed Section *****/
        var getAllBreakupComponent = function () {
            var url = RunPayrollService.getUrl('allBreakupComponents');
            serverUtilityService.getWebService(url)
                .then(function (data){
                    if (data.status == 'success') {
                        $scope.brakeupComponents.credit = data.data.credit;  
                        $scope.brakeupComponents.debit = data.data.debit;  
                        $scope.brakeupComponents.other = data.data.other; 
                        //$scope.computedCsvColumn = RunPayrollService.buildComputedColumn($scope.brakeupComponents.credit, $scope.brakeupComponents.debit, $scope.brakeupComponents.other, $scope.groupList, $scope.envMnt);
                    }
                });
        };
        getAllBreakupComponent();
        $scope.totalRow = {}
        var getComputedList = function () {
            var url = RunPayrollService.getUrl("computedSalary") + "?" + $.param({year: $scope.routeFlag.year, month: $scope.routeFlag.month});
            serverUtilityService.getWebService(url).then(function (data) {    
                if (data.status == 'success') {
                    extractEmployeeData(utilityService.getInnerValue(data, 'data', 'rows', []), 'status_finalized');
                    $scope.computedList = utilityService.getInnerValue(data, 'data', 'rows', []);
                    $scope.totalRow = utilityService.getInnerValue(data, 'data', 'total', [])
                    $scope.computedObject.heads = utilityService.getInnerValue(data, 'data', 'heads', []);
                    $scope.computedCsvColumn = RunPayrollService.buildComputedColumn($scope.computedObject.heads, $scope.groupList, $scope.envMnt);
                    $scope.calculateFacadeCountOfAllFilters($scope.computedList, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    angular.copy($scope.computedList, $scope.computedObject.filteredList);
                    $scope.computedObject.visible = true;
                }
            }); 
        };
        $scope.navigateToDiffrentSections = function (url) {
            var array = [];
            angular.forEach($scope.computedList, function (v) {
                if (v.isSelected) {
                    array.push(v._id);
                }
            });
            utilityService.setStorageValue('checkesForEmployee', JSON.stringify(array));
            $location.url(url);
        };        
        $scope.choseHoldOptions = function () {
            $('#hold-salary-till').appendTo('body').modal('show');
        };        
        $scope.selectDeselectComputedList = function (isAll) {
            var list = $scope.computedObject.filteredList,
                count = 0, unhold = 0 ;

            angular.forEach(list, function (value) {
                value.isSelected = value.mainStatus ? false : isAll;
                if (value.isSelected && !value.status_with_held) {
                    count += 1;
                }
                if(value.isSelected && value.status_with_held){
                    unhold += 1;
                }
            });
            $scope.isAll.count = count;
            $scope.isAll.unholdCount = unhold;
            $scope.isAll.flag = isAll;
        };
        $scope.updateComputedListCount = function() {
            var list = $scope.computedList,
                count = 0, unhold = 0 , notSelectedCount = 0;

            angular.forEach(list, function (value, key) {
                if (value.isSelected && !value.status_with_held) {
                    count += 1;
                }
                if(value.isSelected && value.status_with_held){
                    unhold += 1;
                }
                if(value.mainStatus){
                    notSelectedCount += 1; 
                }
            }); 
            $scope.isAll.count =  count;
            $scope.isAll.unholdCount = unhold;
            $scope.isAll.flag = (count + unhold == list.length - notSelectedCount) ? true : false;
        };

        /***** To Finalized Section *****/ 
        $scope.norLankaFlag = false
        var updateFlagForNorLanka = function(){
            var url = $location.host();
            if(url == 'norlanka.qandle.com' || url == 'prod4.hrms.com'){
                $scope.norLankaFlag = true;
            }
        };
        updateFlagForNorLanka();
        $scope.pdfTotalPage = [];
        var today = new Date();
        var motnh =  [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        var finalizedCsvColumn  = {
            'Employee Detail': 'full_name',
            'Employee Id': 'employee_code',
            'Work Email': 'work_profile_work_email',
            'Gross Payment': 'total_gross',
            'Net Payment': 'total_net_pay',
            'Bank Name': 'bank_name',
            'Account Number': 'accountNo',
            'IFSC Code': 'ifsc'
        };        
        var getFinalizedList = function (){
            var url = RunPayrollService.getUrl("finalizedPayroll") + "?" + $.param({year: $scope.routeFlag.year, month: $scope.routeFlag.month});
            serverUtilityService.getWebService(url).then(function (data) {
                if (data.status == 'success') {
                    extractEmployeeData(data.data, 'status_paid');
                    var totalPage = Math.ceil(data.data.length/26);
                    for(var i =0; i < totalPage; i++){
                        var obj = {
                            page: i+1,
                            min: i == 0 ? 0 : (18*i) + 1,
                            max: i == 0 ? 18: 18 * (i+1),
                            motnh: motnh[$scope.routeFlag.month - 1],
                            year: $scope.routeFlag.year,
                            date: utilityService.dateToString(today, "/"),
                            grandTotal: $scope.isAll.totalNetPayout
                        };
                        $scope.pdfTotalPage.push(obj);
                    }
                    $scope.finalizedList = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.finalizedList, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.finalizedCsvColumn = RunPayrollService.addMandatoryGroupsToColumnHeaders(finalizedCsvColumn, $scope.groupList);
                    $timeout(function (){
                        $scope.isVisible = true;
                    }, 100);
                }
            });
        };

        /***** To Paid Section *****/
        var paidCsvColumn = {
            'Employee Detail': 'full_name',
            'Employee Id': 'employee_code',
            //'Department': 'department',
            //'Location': 'location',
            'Date of Joining': 'joining_date',
            'Total Gross': 'total_gross',
            'Employee Deductions': 'total_deduction',
            'Net Payout': 'total_net_pay',
            'Total CTC': 'total_ctc'
        };                
        var getPaidList = function (){
            var url = RunPayrollService.getUrl("paidPayroll") + "?" + $.param({year: $scope.routeFlag.year, month: $scope.routeFlag.month});
            serverUtilityService.getWebService(url).then(function (data) {                
                if (data.status == 'success') {
                    extractEmployeeData(data.data);
                    $scope.paidList = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.paidList, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.paidCsvColumn = RunPayrollService.addMandatoryGroupsToColumnHeaders(paidCsvColumn, $scope.groupList);
                }
            });
        };        

        var holdStatusCallback = function (ids, status){
            $('#hold-salary-till').modal('hide');
            $scope.isAll.flag =  false;
            $scope.isAll.count =  0;
            $scope.isAll.unholdCount = 0;
            angular.forEach($scope.computedList, function (value){
                value.isSelected = false;
                if(ids.indexOf(value._id) !== -1){
                   value.status_with_held = status;
                   value.filter_status = status ? 2 : 1; 
                }
            });
        };
        $scope.updateStatus = function (status, isHold) {
            var tabMainList = {
                    2: $scope.computedList,
                    3: $scope.finalizedList
                },
                list = tabMainList[$scope.step],
                url = RunPayrollService.getUrl("updateStatus"),
                payload = angular.isDefined(isHold) 
                    ? RunPayrollService.buildHoldStatusPayload(list, status, isHold, $scope.isAll)
                    : RunPayrollService.buildStatusPayload(list, status);

            serverUtilityService.postWebService(url, payload).then(function (data) {
                if (data.status == 'success') {
                    $scope.errorMessages = []
                    utilityService.showSimpleToast(data.message);
                    if (angular.isDefined(isHold)) {
                        holdStatusCallback(payload.processed_ids, isHold);
                    } else {
                        status == 4 ? $scope.setStep(3) : $scope.setStep(4);
                    }
                }else{
                   $scope.errorMessages = buildError(data);
                   $scope.openModal('runPayrollErrorsOnclick.tmpl.html', 'runPayrollErrorsOnclick', 'md');

                }
            });
        };        
        $scope.selectDeselectUser = function (isAll) {
            var tabMainList = {
                    1: $scope.toBeComputedList,
                    //2: $scope.computedList,
                    3:$scope.finalizedList,
                    4:$scope.paidList
                };

            var list = tabMainList[$scope.step],
                count = 0;

            angular.forEach(list, function (value) {
                if($scope.step == 1) {
                    value.isSelected = (value.mainStatus || !value.salary_processed) ? false : isAll;
                } else {
                    value.isSelected = value.mainStatus ? false : isAll;
                }
                if (value.isSelected) {
                    count += 1;
                }
            });

            $scope.isAll.count = count;
            $scope.isAll.flag = isAll;
        };
        $scope.updateCount = function() {
            var tabMainList = {
                1: $scope.toBeComputedList,
                //2: $scope.computedList,
                3: $scope.finalizedList,
                4: $scope.paidList
            };
            var list = tabMainList[$scope.step];
            var count = 0;
            var notSelectedCount = 0;
            angular.forEach(list, function (value, key) {
                if (value.isSelected) {
                    count += 1;
                }
                if(value.mainStatus){
                    notSelectedCount += 1; 
                }
            });

            $scope.isAll.count =  count;
            $scope.isAll.flag = (count == list.length - notSelectedCount) ? true : false;
        };        
        $scope.setStep = function (step) {
            $scope.resetAllTypeFilters();
            initializeOnTabClcik();
            getPayrollStatusCount();
            $scope.updatePaginationSettings(paginationKey[step]);
            switch(step){
                case 1: getToBeComputedList();
                    break;

                case 2: getComputedList();
                    break;

                case 3: getFinalizedList();
                    break;

                case 4: getPaidList();
                    break;

                case 5: getExternalList(true);
                    break;

                default : console.log('asdad');
            }
            $scope.step = step; 
        };        
        $scope.navigateBack = function() {
            $location.url('frontend/payroll/summary').search({"tab": "payment"});
        };        
        $scope.isOnlyReadable = false;
        if(utilityService.getValue($routeParams, 'cstep')){
            $scope.setStep(parseInt(utilityService.getValue($routeParams, 'cstep')));
            $scope.isOnlyReadable = true;
        }
        if ($location.path() == "/bank-report") {
            getFinalizedList();
        }        
        $scope.currentPage = 1;        
        $scope.traverseToPages = function (token){
            $scope.isdownload = false;
            $scope.currentPage = $scope.currentPage + token;
            if($scope.currentPage == 0){
                $scope.currentPage = 1;
            };
            if($scope.currentPage > $scope.pdfTotalPage.length){
                $scope.currentPage = $scope.pdfTotalPage.length;
            };
        };
        var exportToCsv = function(object, filename) {
            utilityService.exportToCsv(object.content, filename);
        };
        $scope.exportSalaryReport = function() {
            var url = RunPayrollService.getUrl("exportSalaryReport"),
                params = {
                    year: $scope.routeFlag.year,
                    month: $scope.routeFlag.month
                },
                filename = 'salary-report';

            if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
            filename += '.csv';

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    var object = parentService.buildCSVContent(data.data.header, data.data.report_data, RunPayrollService.buildProfileStatus());
                    exportToCsv(object, filename);
                });
        };        
        $scope.exportSalaryReportText = function () {
            var url = RunPayrollService.getUrl("exportSalaryReportText");
                params = {
                    year: $scope.routeFlag.year, 
                    month: $scope.routeFlag.month
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    utilityService.exportToText(data.data, 'salary-report.txt');
                });
        };
        $scope.exportBankTransferSummaryReport = function(async) {
            var promise = $q(function(resolve, reject) {
                var url = RunPayrollService.getUrl("payrollBTSummaryReport") + '/' + 
                        $scope.routeFlag.year + '/' + $scope.routeFlag.month,
                    filename = 'bank_transfer_summary_report',
                    param = {};

                if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                
                if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                    param['all-legal-entities'] = true;
                }

                serverUtilityService.getWebService(url, param)
                    .then(function (data) {
                        var object = parentService.buildCSVContent(data.data.header, data.data.report_data);
                        table = [];
                        var yearMonth = 'Payroll: ' + $scope.monthsList[(parseInt($scope.routeFlag.month) - 1)] + ' ' + $scope.routeFlag.year;
                        table.push(['', yearMonth]);
                        if($scope.legal_entity.entity_id) {
                            table.push(['']);
                            table.push(['', utilityService.getValue($scope.legal_entity.selected, 'name')]);
                        }
                        table.push(['']);
                        angular.forEach(object.content, function(val, key) {
                            table.push(val);
                        });
                        table.push(['*** The Difference of Head count in Paysheet and the Bank Transfer File because of Stop Salary & Negative Salary']);
                        resolve({data: table, name: filename});
                    });
            });
            if(async) {
                return promise;
            } else {
                promise.then(function(data) {
                    utilityService.exportToCsv(data.data, data.name);
                });
            }
        };
        $scope.exportSalaryHoldReport = function(async) {
            var promise = $q(function(resolve, reject) {
                var url = RunPayrollService.getUrl("payrollSalaryHoldReport") + '/' + 
                        $scope.routeFlag.year + '/' + $scope.routeFlag.month,
                    filename = 'Salary_Hold_Report',
                    param = {};

                if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                
                if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                    param['all-legal-entities'] = true;
                }

                serverUtilityService.getWebService(url, param)
                    .then(function (data) {
                        var object = parentService.buildCSVContent(data.data.header, data.data.report_data);
                        table = [];
                        var yearMonth = 'Salary for the month of ' + $scope.monthsList[(parseInt($scope.routeFlag.month) - 1)] + ' ' + $scope.routeFlag.year;
                        table.push(['', yearMonth]);
                        if($scope.legal_entity.entity_id) {
                            table.push(['']);
                            table.push(['', utilityService.getValue($scope.legal_entity.selected, 'name')]);
                        }
                        table.push(['']);
                        angular.forEach(object.content, function(val, key) {
                            table.push(val);
                        });
                        resolve({data: table, name: filename});
                    });
            });
            if(async) {
                return promise;
            } else {
                promise.then(function(data) {
                    utilityService.exportToCsv(data.data, data.name);
                });
            }
        };
        $scope.exportBankTransferReport = function(type, async) {
            var promise = $q(function(resolve, reject) {
                var filename = null,
                    url = RunPayrollService.getUrl("bankTransferReport") + '/' + 
                        $scope.routeFlag.year + '/' + $scope.routeFlag.month + '/' + type,
                    param = {};

                if(type == 'BANK') {
                    filename = 'Bank_transfer_Report_BANK';
                }
                if(type == 'NEFT') {
                    filename = 'Bank_transfer_Report_NEFT';
                }
                if(type == 'CHEQUE') {
                    filename = 'Bank_transfer_Report_CHEQUE';
                }
                if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                
                if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                    param['all-legal-entities'] = true;
                }

                serverUtilityService.getWebService(url, param)
                    .then(function (data) {
                        var object = parentService.buildCSVContent(data.data.header, data.data.report_data);
                        table = [];
                        var yearMonth = 'Salary for the month of ' + $scope.monthsList[(parseInt($scope.routeFlag.month) - 1)] + ' ' + $scope.routeFlag.year;
                        table.push(['', yearMonth]);
                        if($scope.legal_entity.entity_id) {
                            table.push(['']);
                            table.push(['', utilityService.getValue($scope.legal_entity.selected, 'name')]);
                        }
                        table.push(['']);
                        angular.forEach(object.content, function(val, key) {
                            table.push(val);
                        });
                        resolve({data: table, name: filename});
                    });
            });
            if(async) {
                return promise;
            } else {
                promise.then(function(data) {
                    utilityService.exportToCsv(data.data, data.name);
                });
            }
        };
        $scope.exportBankTransferMasterReport = function(async) {
            var promise = $q(function(resolve, reject) {
                var filename = 'Bank_transfer_master_Report',
                    url = RunPayrollService.getUrl("bankTransferMasterReport") + '/' + 
                        $scope.routeFlag.year + '/' + $scope.routeFlag.month,
                    param = {};

                if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                
                if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                    param['all-legal-entities'] = true;
                }

                serverUtilityService.getWebService(url, param)
                    .then(function (data) {
                        var object = parentService.buildCSVContent(data.data.header, data.data.report_data);
                        table = [];
                        var yearMonth = 'Salary for the month of ' + $scope.monthsList[(parseInt($scope.routeFlag.month) - 1)] + ' ' + $scope.routeFlag.year;
                        table.push(['', yearMonth]);
                        if($scope.legal_entity.entity_id) {
                            table.push(['']);
                            table.push(['', utilityService.getValue($scope.legal_entity.selected, 'name')]);
                        }
                        table.push(['']);
                        angular.forEach(object.content, function(val, key) {
                            table.push(val);
                        });
                        resolve({data: table, name: filename});
                    });
            });
            if(async) {
                return promise;
            } else {
                promise.then(function(data) {
                    utilityService.exportToCsv(data.data, data.name);
                });
            }
        };
        $scope.exportPayRegisterReport = function(async) {
            var promise = $q(function(resolve, reject) {
                var filename = 'Pay_register_Report',
                    url = RunPayrollService.getUrl("payRegisterReport") + '/' + 
                        $scope.routeFlag.year + '/' + $scope.routeFlag.month,
                    param = {};

                if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                
                if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                    param['all-legal-entities'] = true;
                }

                serverUtilityService.getWebService(url, param)
                    .then(function (data) {
                        var object = parentService.buildCSVContent(data.data.header, data.data.report_data);
                        // table = [];
                        // var yearMonth = 'Salary for the month of ' + $scope.monthsList[(parseInt($scope.routeFlag.month) - 1)] + ' ' + $scope.routeFlag.year;
                        // table.push(['', yearMonth]);
                        // if($scope.wrapperObject.legalEntity.id && $scope.wrapperObject.legalEntity.name) {
                        //     table.push(['', $scope.wrapperObject.legalEntity.name]);
                        // }
                        // table.push(['']);
                        // angular.forEach(object.content, function(val, key) {
                        //     table.push(val);
                        // });
                        resolve({data: object.content, name: filename});
                    });
            });
            if(async) {
                return promise;
            } else {
                promise.then(function(data) {
                    utilityService.exportToCsv(data.data, data.name);
                });
            }
        };
        $scope.exportVarianceReport = function(async) {
            var promise = $q(function(resolve, reject) {
                var filename = 'Variance_Report',
                    url = RunPayrollService.getUrl("varianceReport") + '/' + $scope.routeFlag.year + '/' + $scope.routeFlag.month;

                if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                
                serverUtilityService.getWebService(url)
                    .then(function (data) {
                        var first_row = [], header1 = utilityService.getValue(data.data, 'header1', []);
                        for(var i = 0; i<header1.length; i++) {
                            first_row.push(utilityService.getInnerValue(header1, i, 'component_name'));
                        }
                        var object = parentService.buildCSVContent(data.data.header2, data.data.report_data);
                        var table = [first_row];
                        angular.forEach(object.content, function(val, key) {
                            table.push(val);
                        });
                        resolve({data: table, name: filename});
                    });
            });
            if(async) {
                return promise;
            } else {
                promise.then(function(data) {
                    utilityService.exportToCsv(data.data, data.name);
                });
            }
        };

        angular.element(document).ready(function () {
            $timeout(function() {
                $scope.dowloadReoprt =  function () {
                    $scope.isdownload = true;
                    var pdf =  new jsPDF('p', 'pt', 'a4'), count= 0;
                    var base64Images = [];
                    html2canvas($("#page" + $scope.currentPage), {
                        allowTaint: true,
                        onrendered: function (canvas) {
                            var width = canvas.width;
                            var height = canvas.clientHeight;
                            base64Images.push( {'index': 1, 'data':canvas.toDataURL("image/png"), width: width, height: height} );
                        }
                    });
                    setTimeout(function () {
                        for (var i = 0; i < base64Images.length; i++) {
                            pdf.addImage(base64Images[i]['data'], 'PNG', 20, 20, base64Images[i]['data']['width'], base64Images[i]['data']['height']);
                            count +=1;
                        }
                    }, 3000);
                    $timeout(function () {
                       if (count == 1) {
                           $scope.isdownload = false;
                            pdf.save('bank_report_'+$scope.currentPage+'.pdf');
                        }
                    },3000);
                }
            }, 2000);
        });
        
        $scope.downloadAllReports = function () {
            var zipData = [], zipName = 'all_reports';
            if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                zipName += utilityService.getValue($scope.legal_entity.selected, 'name');
            }
            zipName += '.zip';
            var requests = [
                $scope.exportBankTransferSummaryReport(true),
                $scope.exportSalaryHoldReport(true),
                $scope.exportBankTransferReport('BANK', true),
                $scope.exportBankTransferReport('NEFT', true),
                $scope.exportBankTransferReport('CHEQUE', true),
                $scope.exportBankTransferMasterReport(true),
                $scope.exportPayRegisterReport(true)
            ];
            $q.all(requests).then(function(data) {
                zipData = data;
                utilityService.exportToZip(zipData, zipName);
            });
        };

        /***** Start: Search by employee name and code section */
        $scope.usermanagent = {
            searchKey: 'full_name',
            searchText: 'Search by Employee Name'
        };
        $scope.changeSearchTextHandler = function (search) {
            $scope.name_filter = {};
            $scope.usermanagent.searchText = search == 'employee_id' 
                ? 'Search by Employee Code' : 'Search by Employee Name';
        };
        /***** End: Search by employee name and code section */

        /***** Start: Get Payroll All Entity Permission Section *****/
        var getPayrollAllEntityPermission = function () {
            $scope.wrapperObject.allEntityReport.selectedOption = '';
            serverUtilityService.getWebService(RunPayrollService.getUrl('allEntityPermission'))
                .then(function(data) {                    
                    $scope.wrapperObject.allEntityReport.hasPermission = utilityService.getValue(data, 'data', []).indexOf($scope.wrapperObject.allEntityReport.permissionSlug) >= 0;
                });
        };
        if (utilityService.getInnerValue($scope.wrapperObject, 'legalEntity', 'enabled') 
            && utilityService.getInnerValue($scope.wrapperObject, 'legalEntity', 'id')
            && utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'enabled')) {
            getPayrollAllEntityPermission();
        }        
        /***** End: Get Payroll All Entity Permission Section *****/

        $scope.handleSingleRunPayroll = function (item) {
            var employeeId = utilityService.getInnerValue(item, "employee_preview", '_id');
            item.runPayrollLoader = true;
                var url = RunPayrollService.getUrl('generateMonthlySalary'),
                payload = {
                    month: runPayrollObject.month,
                    year: runPayrollObject.year,
                    emp_id: employeeId
                };

            
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {                    
                    if (utilityService.getValue(data, 'status') == 'success') {
                        if (utilityService.getValue(data, 'notice').length > 0) {
                            $scope.runPayrollNoticeObject = utilityService.getValue(data, 'notice');
                            $scope.openModal('re-run-payroll-error.tmpl.html', 'reRunPayrollError', 'md');
                        } else {
                            item.runPayrollLoader = false
                            utilityService.showSimpleToast(data.message);
                        }
                        getToBeComputedList();
                    } else {
                        // $scope.runPayrollObjectError = buildError(data)
                        $scope.runPayrollErrorObject = utilityService.getValue(data, 'error');
                        $scope.runPayrollNoticeObject = utilityService.getValue(data, 'notice');
                        $scope.openModal('re-run-payroll-error.tmpl.html', 'reRunPayrollError', 'md')
                    }
                });
        
        }

        $scope.slectedYear = {
            month: 7,
            year: 2020
        }

        $scope.downloadSampleTemplate = function(urlPrefix) {
            $scope.viewDownloadFileUsingForm(RunPayrollService.getUrl(urlPrefix) + '/' + $scope.routeFlag.year + '/' + $scope.routeFlag.month);
        };   

        $scope.uploadFilledTemplate = function(fileObject, keyName, urlPrefix, section) {
            section = 'bulkFilledTemplate';
            var url = RunPayrollService.getUrl(urlPrefix) + '/' + $scope.routeFlag.year + '/' + $scope.routeFlag.month;
                payload = {};

            payload[keyName] = fileObject;

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, section);
            });
        };

        var successErrorCallback = function (data, section) {
            data.status === "success" ? successCallback(data, section) : errorCallback(data, section);
        };  

        var errorCallback = function (data, section) {
            $scope.uploadErrorMessages = buildError(data);
         };

        

        var successCallback = function (data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Sheet has been uploaded successfully'));
            getComputedList();
        };


        $scope.setCommonFileObject = function(model, keyname, file){
            model[keyname].file = file;
            model[keyname].isUploaded = true;
        };

        $scope.clearFileUpload = function(model, keyname) {
            $scope.uploadErrorMessages = []
            model[keyname].isUploaded = false;
            model[keyname].file = null;
        };

        $scope.openModal = function(templateUrl, instance, size) {
            size = angular.isDefined(size) ? size : 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                size: size,
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function(instance) {
            $scope.errorMessages = []
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };

        var buildError = function (data) {
            var error = []
            if (data.status == "error") {
                error.push(data.message);
            } else if (data.data.status == 'error') {
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            error.push(v);
                        });
                    });
                } else {
                    error.push(data.data.message);
                }
            }
            return error;
        }

        $scope.exportSalaryReportHdfc = function(isHdfc) {
            var url = RunPayrollService.getUrl("exportSalaryReport"),
                params = {
                    bank_type: isHdfc ? 'hdfc' : 'non_hdfc',
                    year: $scope.routeFlag.year,
                    month: $scope.routeFlag.month,
                },
                filename = 'salary-report-' + (isHdfc ? 'hdfc' : 'non_hdfc');

            if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
            filename += '.csv';

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    var object = parentService.buildCSVContent(data.data.header, data.data.report_data, RunPayrollService.buildProfileStatus());
                    exportToCsv(object, filename);
                });
        }; 

        $scope.exportSalaryFileFormat = function(async) {
            var promise = $q(function(resolve, reject) {
                var url = RunPayrollService.getUrl("salaryFileFormat") + '/' + 
                        $scope.routeFlag.year + '/' + $scope.routeFlag.month,
                    filename = 'salary_file_format',
                    param = {};

                if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                
                if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                    param['all-legal-entities'] = true;
                }

                serverUtilityService.getWebService(url, param)
                    .then(function (data) {
                        var object = parentService.buildCSVContent(data.data.heads, data.data.rows);
                        console.log(object)
                        resolve({data: object.content, name: filename});
                    });
            });
            if(async) {
                return promise;
            } else {
                promise.then(function(data) {
                    utilityService.exportToCsv(data.data, data.name);
                });
            }
        };

        $scope.exportFrontierBankTransferSummary = function(async) {
            var promise = $q(function(resolve, reject) {
                var url = RunPayrollService.getUrl("frontierBankTransferSummary") + '/' + 
                        $scope.routeFlag.year + '/' + $scope.routeFlag.month,
                    filename = 'frontier_BankTransfer_Summary',
                    param = {};

                if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                
                if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                    param['all-legal-entities'] = true;
                }

                serverUtilityService.getWebService(url, param)
                    .then(function (data) {
                        var object = parentService.buildCSVContent(data.data.heads, data.data.rows);
                        table = [];
                        table.push([data.data.head1[0].component_name])
                        table.push([data.data.head2[0].component_name])
                        table.push([data.data.head3[0].component_name])
                        angular.forEach(object.content, function(val, key) {
                            table.push(val);
                        });
                        resolve({data: table, name: filename});
                    });
            });
            if(async) {
                return promise;
            } else {
                promise.then(function(data) {
                    utilityService.exportToCsv(data.data, data.name);
                });
            }
        };

        $scope.exportFrontierBankTransferReport = function(type, async) {
            var promise = $q(function(resolve, reject) {
                var filename = null;
                if(type === 'BANK') {
                    filename = 'Bank_transfer_Report_BANK';
                }
                if(type === 'NEFT') {
                    filename = 'Bank_transfer_Report_NEFT';
                }
                if(type === 'CHEQUE') {
                    filename = 'Bank_transfer_Report_CHEQUE';
                }
                if(type === 'HOLD') {
                    filename = 'Bank_transfer_Report_HOLD';
                }

               var url = RunPayrollService.getUrl(filename) + '/' + 
                $scope.routeFlag.year + '/' + $scope.routeFlag.month,
                param = {};
                if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                
                if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                    param['all-legal-entities'] = true;
                }

                serverUtilityService.getWebService(url, param)
                    .then(function (data) {
                        var object = parentService.buildCSVContent(data.data.heads, data.data.rows);
                        table = [];
                        var header = data.data.head1.map(function(val) {
                            return val.component_name
                        })
                        table.push(header)
                        angular.forEach(object.content, function(val, key) {
                            table.push(val);
                        });
                        resolve({data: table, name: filename});
                    });
            });
            if(async) {
                return promise;
            } else {
                promise.then(function(data) {
                    utilityService.exportToCsv(data.data, data.name);
                });
            }
        };

        var getPayrollModulePermissions = function () {
            var url = RunPayrollService.getUrl('modulePermission') + '/payroll'; 
            serverUtilityService.getWebService(url)
                .then(function (data){
                    console.log(data)
                    var response = utilityService.getValue(data, 'data', []);
                    angular.forEach(response, function(value){
                        if(value.permission_slug === 'cannot_finalize_payroll'){
                            $scope.cannotFinalizePayroll = true
                        }
                        if(value.permission_slug === 'cannot_pay_payroll'){
                            $scope.cannotPayPayroll = true
                        }
                        
                    })

                });
        };
        getPayrollModulePermissions()

        $scope.exportAvasotechBankTransferReport = function(type, async) {
            var promise = $q(function(resolve, reject) {
                var filename = null;
                if(type === 'BANK') {
                    filename = 'Avasotech_bank_transfer_Report';
                }
                if(type === 'NEFT') {
                    filename = 'Bank_transfer_Report_NEFT';
                }
                if(type === 'CHEQUE') {
                    filename = 'Bank_transfer_Report_CHEQUE';
                }
                if(type === 'HOLD') {
                    filename = 'Bank_transfer_Report_HOLD';
                }
                if(type === 'primussoftBANK') {
                    filename = 'primussoft_Salary_transfer_Report_Bank';
                }

                if(type === 'SaffronGSBANK') {
                    filename =  'saffron_global_services_bank_transfer_Report'
                }
                if(type === 'udBankTransferReport') {
                    filename =  'ud_bank_transfer_Report'
                }

               var url = RunPayrollService.getUrl(filename) + '/' + 
                $scope.routeFlag.year + '/' + $scope.routeFlag.month,
                param = {};
                if($scope.legal_entity.entity_id && !utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption')) {
                    filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
                }
                filename += '.csv';
                
                if (utilityService.getInnerValue($scope.wrapperObject, 'allEntityReport', 'selectedOption') === 'all') {
                    param['all-legal-entities'] = true;
                }

                serverUtilityService.getWebService(url, param)
                    .then(function (data) {
                        var object = parentService.buildCSVContent(data.data.heads, data.data.rows);
                        table = [];
                        // var header = data.data.heads.map(function(val) {
                        //     return val.component_name
                        // })
                        // table.push(header)
                        angular.forEach(object.content, function(val, key) {
                            table.push(val);
                        });
                        resolve({data: table, name: filename});
                    });
            });
            if(async) {
                return promise;
            } else {
                promise.then(function(data) {
                    utilityService.exportToCsv(data.data, data.name);
                });
            }
        };

       
    }
]);
