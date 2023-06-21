app.controller('PayrollPaymentController', [
    '$scope', '$timeout', '$window', '$location', 'PayrollPaymentService', 'utilityService', 'ServerUtilityService', 'UserManagementService', 'RunPayrollService', 'PayrollOverviewService', '$modal',
    function ($scope, $timeout, $window, $location, payrollPaymentService, utilityService, serverUtilityService, UserManagementService, RunPayrollService, PayrollOverviewService, $modal) {
        $scope.payment = payrollPaymentService.buildPaymentObject($scope.yearExtendedConfig);
        $scope.payment.tabSelected = 0;
        $scope.errorMessages = []
        $scope.resetAllTypeFilters();
        $scope.legal_entity = {
            selected: null,
            entity_id: utilityService.getStorageValue("legalEntityId")
        };
        $scope.computedObject = RunPayrollService.buildComputedObject();
        $scope.employeeStatus = PayrollOverviewService.buildEmployeeStatus();
        $scope.tempObject = {
            plan_ids: []
        };
        $scope.runPayrollLoader = false;
        $scope.getLegalEntity = function () {
            if ($scope.legal_entity.entity_id) {
                var entities_list = JSON.parse(utilityService.getStorageValue("legalEntityElements"));
                $scope.legal_entity.selected = entities_list.find(function (val) { return val._id == $scope.legal_entity.entity_id; });
            } else {
                $scope.legal_entity.selected = null;
            }
        };
        $scope.getLegalEntity();
        $scope.getRunPayrollAutomation();


        /***** START PAYMENT SUMMARY SECTION *****/
        var buildGraphData = function (item) {
            $scope.payment.summary.visible.graph = false;
            $scope.payment.summary.graph = utilityService.buildCompuationGraphData(item);
            $scope.payment.summary.category = utilityService.buildCompuationGraphCategoryData();
            $timeout(function () {
                $scope.payment.summary.visible.graph = true;
            }, 500);
        };
        var buildFilteredList = function () {
            var begin = (($scope.payment.pagination.currentPage - 1) * $scope.payment.pagination.numPerPage),
                end = begin + $scope.payment.pagination.numPerPage;

            $scope.payment.summary.filteredList = $scope.payment.summary.list.slice(begin, end);
        };

        var addLoaderToEachItem = function (data) {
            if(angular.isArray(data)){
                return data.map(function(el) {
                    var obj = Object.assign({}, el);
                    obj.isLoading = false;
                    return obj;
                })
            }else{
                return data
            }
        }
        var getPaymentSummary = function () {
            $scope.payment.summary.list = [];
            $scope.payment.summary.visible.graph = false;
            $scope.payment.summary.visible.list = false;
            var url = payrollPaymentService.getUrl('summary') + "/"
                + ($scope.payment.summary.current.month + 1) + "/"
                + $scope.payment.summary.current.year,
                params = {
                    year: $scope.payment.summary.current.year,
                    month: $scope.payment.summary.current.month + 1
                };

            serverUtilityService.getWebService(url).then(function (data) {
                $scope.payment.summary.list = data.data;
                if ($scope.payment.summary.list.length) {
                    angular.forEach($scope.payment.summary.list, function (value, key) {
                        $scope.tempObject.plan_ids.push(utilityService.getValue(value, 'plan_id'));
                    });
                    buildGraphData($scope.payment.summary.list[0]);
                }
                $timeout(function () {
                    $scope.payment.summary.visible.graph = true;
                    $scope.payment.summary.visible.list = true;
                }, 500);
                buildFilteredList();
            });
        };
        //getPaymentSummary();

        $scope.$watch('payment.pagination.currentPage + payment.pagination.numPerPage',
            function (newValue, oldValue) {
                if ($scope.payment.summary.list.length) {
                    buildFilteredList();
                }
            }
        );
        /***** End PAYMENT SUMMARY SECTION *****/

        /***** START PAYMENT DETAILS SECTION *****/
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
            }
        ];
        $scope.updatePaginationSettings('payroll_admin_details');
        var employeeDetailsCallback = function (data) {
            $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject);
            angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
            $scope.payment.details.list = data.data;
            //$scope.payment.details.filtered.list = data.data;            
        };
        var getPaymentDetails = function () {
            var url = payrollPaymentService.getUrl('details'),
                params = {
                    year: $scope.payment.details.current.year,
                    month: $scope.payment.details.current.month + 1
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    employeeDetailsCallback(data);
                });
        };
        //getPaymentDetails();
        $scope.sortBy = function (propertyName) {
            $scope.payment.details.reverse = ($scope.payment.details.propertyName === propertyName) ? !$scope.payment.details.reverse : false;
            $scope.payment.details.propertyName = propertyName;
        };
        $scope.toggleBreakup = function (item) {
            $scope.payment.details.breakup = item.salary_breakup;
            toggleModal('ctc-breakup', true);
        };
        var toggleModal = function (id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            })
                : $('#' + id).modal('hide');
        };
        $scope.exportToCsv = function () {
            var object = payrollPaymentService.buildEmpDetailList($scope.payment.details.filtered.list, $scope.payment.details.hashmap);
            $scope.payment.details.content = object.content;
            var filename = 'export';
            if ($scope.legal_entity.entity_id) {
                filename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
            filename += '.csv';
            utilityService.exportToCsv($scope.payment.details.content, filename);
        };
        /***** END PAYMENT DETAILS SECTION *****/

        $scope.changeMonth = function (model, index, tab) {
            tab = angular.isDefined(tab) ? tab : 'summary';
            model.current.month = index;
            //tab === 'summary' ? getPaymentSummary() : getPaymentDetails();
            
            if (tab === 'summary') {
                getPaymentSummary();
                if (utilityService.getInnerValue($scope.payment, 'summary', 'hasPermission')) {
                    $scope.downloadComputedSheet();
                }
            } else {
                getPaymentDetails();
            }
        };
        $scope.changeYear = function (tab) {
            tab = angular.isDefined(tab) ? tab : 'summary';
            //tab === 'summary' ? getPaymentSummary() : getPaymentDetails();
            
            if (tab === 'summary') {
                getPaymentSummary();
                if (utilityService.getInnerValue($scope.payment, 'summary', 'hasPermission')) {
                    $scope.downloadComputedSheet();
                }
            } else {
                getPaymentDetails();
            }
        };
        $scope.changePlan = function (item) {
            if ($scope.payment.summary.current.row == item._id) {
                return false;
            }
            $scope.payment.summary.current.row = item._id;
            buildGraphData(item);
        };
        $scope.runPayroll = function (item, cstep, amount) {
            amount = angular.isDefined(amount) ? amount : -1;
            if (amount == 0) {
                return false;
            }
            if(angular.isDefined(cstep)){
                utilityService.removeStorageValue('runPayrollErrorObject')
            }
            var planIds = item.plan_ids;
            var runPayrollObject = {
                planId: planIds,
                month: $scope.payment.summary.current.month + 1,
                year: $scope.payment.summary.current.year
            };
            utilityService.setStorageValue('runPayrollObject', JSON.stringify(runPayrollObject));
            if (angular.isDefined(cstep)) {
                $location.url('/frontend/payroll/runPayroll').search({ cstep: cstep });
            } else {
                $location.url('/frontend/payroll/runPayroll')
            }
        };
        $scope.runPayrollHandler = function (item) {
            $scope.noticeErrors = []
            $scope.runPayrollLoader = true;
            if($scope.runPayrollAutomate.enabled) {
                var url = payrollPaymentService.getUrl('generateMonthlySalary'),
                payload = {
                    month: $scope.payment.summary.current.month + 1,
                    year: $scope.payment.summary.current.year,
                    plan_ids: utilityService.getValue(item, 'plan_ids', [])
                };
                
                // if(utilityService.getValue($scope.runPayrollConfig, 'enabled') && (utilityService.getValue($scope.runPayrollConfig, 'planIds', []).length > 0)) {
                //     payload.plan_ids = utilityService.getValue($scope.runPayrollConfig, 'planIds');
                // }
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {     
                    if (utilityService.getValue(data, 'status') == 'success') {
                        $scope.runPayrollLoader = false
                        $scope.runPayroll(item);
                        if(utilityService.getValue(data, 'error')){
                            if(data.error.length > 0){
                                utilityService.setStorageValue('runPayrollErrorObject', JSON.stringify(data.error));
                            }else{
                                utilityService.removeStorageValue('runPayrollErrorObject')
                            }
                        }else{
                            utilityService.removeStorageValue('runPayrollErrorObject')
                        }
                        if (utilityService.getValue(data, 'notice')) {
                            if (data.notice.length > 0) {
                                utilityService.setStorageValue('runPayrollNoticeObject', JSON.stringify(data.notice));
                            } else {
                                utilityService.removeStorageValue('runPayrollNoticeObject')
                            }
                        } else {
                            utilityService.removeStorageValue('runPayrollNoticeObject')
                        }
                    } else {
                        $scope.runPayrollLoader = false
                        // $scope.errorMessages = buildError(data)
                        $scope.errorMessages = utilityService.getValue(data, 'error');
                        // $scope.noticeErrors = utilityService.getInnerValue(data, 'data', 'notice')
                        $scope.noticeErrors = utilityService.getValue(data, 'notice');
                        $scope.openModal('run-payroll-error.tmpl.html', 'runPayrollError', 'md')
                        // console.log('Need to handle error here');
                    }
                });
            }else {
                $scope.runPayroll(item);
            }
           
        };
        $scope.isNotExceptionalCase = function () {
            var exceptionList = ['local', 'prod1', 'prod2', 'prod3', 'prod5', 'prod7', 'hrconnectdemo', 'demo', 'demo1'];

            return !(exceptionList.indexOf($scope.envMnt) >= 0
                && $scope.payment.summary.current.year == utilityService.getCurrentYear()
                && $scope.payment.summary.current.month == utilityService.getCurrentMonth() - 1);
        };

        /***** Start: Computed Salary Sheet *****/
        var extractMandatoryGroupName = function (array) {
            return array.map(function (elem) {
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

                if (angular.isDefined(statusKey) && statusKey == 'status_paid') {
                    $scope.isAll.totalNetPayout += v.total_net_pay ? parseFloat(v.total_net_pay) : 0;
                    $scope.isAll.totalGross += v.total_gross ? parseFloat(v.total_gross) : 0;

                    v.bankName = angular.isDefined(v.employee_preview.financial_details_bank_name)
                        ? v.employee_preview.financial_details_bank_name : '-';

                    v.accountNo = angular.isDefined(v.employee_preview.bank_account_number)
                        ? v.employee_preview.bank_account_number : '-';

                    v.ifsc = angular.isDefined(v.employee_preview.financial_details_ifsc_code)
                        ? v.employee_preview.financial_details_ifsc_code : '-';
                }

                if (angular.isDefined(statusKey) && statusKey == 'status_finalized') {
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
        $scope.totalRow = {}

        $scope.downloadComputedSheet = function () {
            $scope.computedObject.visible = false;
            var url = RunPayrollService.getUrl("computedSalary"),
                params = {
                    "year": $scope.payment.summary.current.year,
                    "month": parseInt($scope.payment.summary.current.month) + 1,
                    "all-legal-entities": true
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    if (data.status == 'success') {
                        extractEmployeeData(utilityService.getInnerValue(data, 'data', 'rows', []), 'status_finalized');
                        $scope.computedList = utilityService.getInnerValue(data, 'data', 'rows', []);
                        $scope.totalRow = utilityService.getInnerValue(data, 'data', 'total', [])
                        angular.copy($scope.computedList, $scope.computedObject.filteredList);
                        $scope.computedObject.heads = utilityService.getInnerValue(data, 'data', 'heads', []);
                        $scope.computedCsvColumn = RunPayrollService.buildComputedColumn($scope.computedObject.heads, $scope.groupList, $scope.envMnt);
                        $scope.computedObject.visible = true;
                    }
                });
        };
        var getAllEntityComputedSheetPermission = function () {
            serverUtilityService.getWebService(payrollPaymentService.getUrl('allEntityPermission'))
                .then(function (data) {
                    $scope.payment.summary.hasPermission = utilityService.getValue(data, 'data', []).indexOf($scope.payment.summary.permissionSlug) >= 0;
                    if (utilityService.getInnerValue($scope.payment, 'summary', 'hasPermission')) {
                        $scope.downloadComputedSheet();
                    }
                });
        };
        getAllEntityComputedSheetPermission();
        /***** End: Computed Salary Sheet *****/

        $scope.disabledMonth2020 = function (month) {
            var disabledMonth =  ['Jan', 'Feb', 'Mar'];
             var isdisabled = false;
            if(disabledMonth.indexOf(month) > -1) {
                isdisabled = true;
            }
            return isdisabled;
         }


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
            if(angular.isDefined(data.error)){
                angular.forEach(data.error, function (v, k) {
                    error.push(v);
                });
            }

            if(utilityService.getInnerValue(data, 'data', 'error')) {
                angular.forEach(data.data.error, function (v, k) {
                    error.push(v);
                }); 
            }

            return error;
        }
         
    }
]);
