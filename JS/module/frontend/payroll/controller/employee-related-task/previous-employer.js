app.controller('PayrollPrevEmployerDetailsController', [
    '$scope', '$routeParams', '$location', '$timeout', 'PayrollOverviewService', 'utilityService', 'ServerUtilityService', 'EmployeeTaskService', '$routeParams', 'PreviousEmployerService', 
    function ($scope, $routeParams, $location, $timeout, PayrollOverviewService, utilityService, serverUtilityService, EmployeeTaskService, $routeParams, previousEmployerService) {
        $scope.prevEmployer = {
            visible: false,
            list: [],
            propertyName: '',
            reverse: false,
            filteredList: [],
            status: ''
        };
        $scope.empDetails = {
            display: angular.isDefined($routeParams.display) ? $routeParams.display : [],
            profilePic:  angular.isDefined($routeParams.profilePic) ? $routeParams.profilePic : '../../images/avatar.png'
        };
        $scope.pending = {
            employeerDetails: 0
        };        
        $scope.isAll = {
            flag: false,
            count: 0,
            filteredList:[]
        };
        if ($location.path() != '/frontend/payroll/previousEmployer') {
            $scope.resetAllTypeFilters();
        }
        $scope.legal_entity = {
            selected: null,
            entity_id: utilityService.getStorageValue("legalEntityId")
        };
        $scope.tax = {
            previousEmployer: {
                enable: false,
                list: [],
                visible: false,
                selectedIndex: -1
            }
        };        
        var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true,
                collection_key: 'employee_preview'
            },
            {
                countObject: 'employeeStatus',
                collection: [1,2,3,4,5],
                isArray: false,
                key: 'employee_status'
            },
            {
                countObject: 'salary',
                collection: [],
                isSalary:true
            }
        ];

        $scope.getLegalEntity = function() {
            if($scope.legal_entity.entity_id) {
                var entities_list = JSON.parse(utilityService.getStorageValue("legalEntityElements"));
                $scope.legal_entity.selected = entities_list.find(function(val) { return val._id == $scope.legal_entity.entity_id; });
            } else {
                $scope.legal_entity.selected = null;
            }
            $scope.previousEmployerExportFilename = 'employer_details';
            if($scope.legal_entity.entity_id) {
                $scope.previousEmployerExportFilename += '_' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
        };
        $scope.getLegalEntity();
        
        var prevEmployeeCallback = function (data) {
            $scope.pending = {
                employeerDetails: 0
            };
            angular.forEach(data, function (v) {
                v.full_name = v.employee_preview.full_name;
                v.employee_id = v.employee_preview.personal_profile_employee_code;
                v.employee_status = v.employee_preview.system_plans_employee_status;
                v.Declarationstatus = v.status == 1 ? 'Pending' : 'Provided';
                if(v.status == 1) {
                    $scope.pending.employeerDetails += 1;
                }
            });
        };
        
        var getPrevEmployerData = function () {
            serverUtilityService.getWebService(EmployeeTaskService.getUrl('previousEmployerList'))
                .then(function (data) {
                    prevEmployeeCallback(data.data);
                    $scope.prevEmployer.list = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.prevEmployer.list, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $timeout(function (){
                        $scope.prevEmployer.visible = true;
                    }, 200);
                });
        };
        getPrevEmployerData();       
        $scope.seeDetails = function (item) {
            var obj = {
                empId: item.employee_preview._id,
                display: item.employee_preview.display_detail,
                profilePic: item.employee_preview.profile_pic
            };
            $location.url('/frontend/payroll/previousEmployer').search(obj);
        };
        var addDefaultPreviousEmployerObject = function () {
            $scope.tax.previousEmployer.list.push(previousEmployerService.buildPreviousEmployerModel());
        };
        var previousEmployerDetailsCallback = function (data) {
            $scope.tax.previousEmployer.enable = utilityService.getInnerValue(data, 'data', 'prev_employer_window', false);
            $scope.tax.previousEmployer.list = [];

            angular.forEach(utilityService.getInnerValue(data, 'data', 'prev_employers', []), function (value, key) {
                $scope.tax.previousEmployer.list.push(previousEmployerService.buildPreviousEmployerModel(value));               
            });

            if (!$scope.tax.previousEmployer.list.length) {
                addDefaultPreviousEmployerObject();
            }

            $scope.tax.previousEmployer.visible = true;
        };       
        var getPrevEmployerDataIndividually = function (){
            var url = EmployeeTaskService.getUrl('previousEmployer') + "/" 
                + utilityService.getValue($routeParams, 'empId');

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    previousEmployerDetailsCallback(data);
                });
        };       
        if ($routeParams.empId) {
            getPrevEmployerDataIndividually();
        }        
        $scope.selectDeselectUser = function (isAll) {
            var count = 0;
            angular.forEach($scope.prevEmployer.list, function (value) {
                value.isSelected = value.status == 1 ? isAll : false;
                if (value.isSelected) {
                    count += 1;
                }
            });
            $scope.isAll.count = count;
            $scope.isAll.flag = isAll;
        };
        $scope.updateCount = function() {
            var count = 0;
            var declaredCount = 0;
            angular.forEach($scope.prevEmployer.list, function (value, key) {
                if (value.isSelected) {
                    count += 1;
                }
                if (value.status == 2) {
                    declaredCount += 1;
                }
            }); 
            $scope.isAll.count =  count;
            $scope.isAll.flag = (count == $scope.prevEmployer.list.length - declaredCount ) ? true : false;
        };        
        $scope.sendRemiderToEmployee = function (type, slaveId, isMultiple) {
            var url = PayrollOverviewService.getUrl('reminderToEmp');
            var payload = {
                master_emp_id: utilityService.getStorageValue('loginEmpId'),
                type: $scope.empReminderType[type]
            };
            if (isMultiple) {
                var arr = [];
                angular.forEach($scope.prevEmployer.list, function (value, key) {
                    if (value.isSelected) {
                        arr.push(value.employee_preview._id);
                    }
                });
                payload.slave_emp_id = arr;
                if(arr.length) {
                    utilityService.showSimpleToast("Reminder has been sent successfully.");
                } else {
                    return false;
                }
            } else {
                payload.slave_emp_id = slaveId;
                utilityService.showSimpleToast("Reminder has been sent successfully.");
            }

            $scope.formSubmitHandler('sendReminder', true);
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    $scope.formSubmitHandler('sendReminder', false);
                    if(data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        getPrevEmployerData();
                        $scope.isAll = {
                            flag: false,
                            count: 0
                        };
                    }
                });
        };        
        $scope.goBack = function () {
            $location.url('/frontend/payroll/summary').search({
                tab: 'Previous Employer Details'
            });
        };       
        $scope.csvColumn = {
            'Employee Detail': 'full_name',
            'Employee Id': 'employee_id',
            'status': 'Declarationstatus'
        };
        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };        
        $scope.exportPreviousEmployer = function () {
            var csvData = EmployeeTaskService.buildPreviousEmployerCSVData(utilityService.getValue($scope.prevEmployer, 'filteredList', []));
            utilityService.exportToCsv(csvData.content, 'previous-employer-details.csv');
        };
        $scope.updatePaginationSettings('payroll_emp_prev_employer');
    }
]);