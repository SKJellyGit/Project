app.controller('AdminBulkRegularizationController', [
    '$scope', '$rootScope', '$modal', '$timeout', '$mdDialog', '$window', 'AdminBulkRegularizationService', 'DashboardService', 'utilityService', 'ServerUtilityService',
    function ($scope, $rootScope, $modal, $timeout, $mdDialog, $window, service, DashboardService, utilityService, serverUtilityService) {
        var self = this;

        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.repos = [];

        $scope.bulkRegularization = service.buildBulkRegularizationObject();
        $scope.updatePaginationSettings('employee_attendance_listing');
                
        var isTotalBreakHoursExists = function (list) {
            var isFounded = false;
            angular.forEach(list, function (value, key) {                                
                if(utilityService.getValue(value, 'total_break_hours', 0) > 0 || !isFounded) {
                    $scope.bulkRegularization.showBreakColumn = true;
                    isFounded = true;
                }
                value.isChecked = false;
            });
        };
        var monthWiseEmployeeAttendanceCallback = function (data) {
            isTotalBreakHoursExists(utilityService.getInnerValue(data, 'data', 'attendance', []));
            $scope.bulkRegularization.canReguDate = utilityService.getInnerValue(data, 'data', 'last_date_for_regularization');
            $scope.bulkRegularization.show_overtime = utilityService.getInnerValue(data, 'data', 'show_overtime', false);
            $scope.bulkRegularization.list = utilityService.getInnerValue(data, 'data', 'attendance', []);
            $scope.bulkRegularization.isChecked = false;
            $scope.bulkRegularization.selectedRows = 0;
            $scope.bulkRegularization.visible = true;
            $scope.bulkRegularization.monthYear.isDisabled = false;
        };
        var getMonthwiseEmployeeAttendance = function () {
            $scope.bulkRegularization.visible = false;
            var url = service.getUrl('attendance') + '/' 
                + utilityService.getValue($scope.bulkRegularization, 'employee_id') + '/'
                + utilityService.getInnerValue($scope.bulkRegularization, 'monthYear', 'month') + '/'
                + utilityService.getInnerValue($scope.bulkRegularization, 'monthYear', 'year');

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    monthWiseEmployeeAttendanceCallback(data);
                });
        };        
        $scope.previousNext = function (direction, item, currentIndex) {
            var index = direction === 'next' ? currentIndex + 1 : currentIndex - 1,            
                upcomingObject = $scope.bulkRegularization.monthYear.list[index];

            $scope.bulkRegularization.monthYear.month = upcomingObject.month;
            $scope.bulkRegularization.monthYear.year = upcomingObject.year;
            $scope.bulkRegularization.monthYear.index = index;

            item.visible = false;
            upcomingObject.visible = true;
            $scope.bulkRegularization.monthYear.isDisabled = true;
            getMonthwiseEmployeeAttendance();
        };
        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };
        var setSelectedRows = function () {
            var filteredList = utilityService.getValue($scope.bulkRegularization, 'filteredList', []);
            $scope.bulkRegularization.selectedRows = 0;           
            
            angular.forEach(filteredList, function (val, key) {
                if (val.isChecked) {
                    $scope.bulkRegularization.selectedRows += 1;
                }
            });

            $scope.bulkRegularization.isChecked = filteredList.length == $scope.bulkRegularization.selectedRows;
        };
        $scope.checkUncheckAllHandler = function (flag) {
            angular.forEach(utilityService.getValue($scope.bulkRegularization, 'filteredList', []), function (row, index) {
                row.isChecked = flag;
            });
            $scope.bulkRegularization.isChecked = flag;
            setSelectedRows();
        };
        $scope.checkUncheckIndividualHandler = function () {
            setSelectedRows();
        };
        var getRegularizationMethods = function () {
            var url = DashboardService.getUrl('regularizationReq') + "/" + $scope.bulkRegularization.employee_id;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.regularizationRequests = utilityService.getValue(data, 'data', []);
                    $scope.modalInstance['regularizationPolicies'] = $modal.open({
                        templateUrl: 'regPolicies.html',
                        scope: $scope,
                        size: 'sm',
                        windowClass:'fadeEffect',
                        backdrop: 'static',
                        keyboard: false
                    });
                });
        };
        $scope.regularizationReq = function () {
            $scope.policy.model = null;
            getRegularizationMethods();            
        };
        $scope.regularizeOneDay = function (item) {
            item.isChecked = true;
            $scope.checkUncheckIndividualHandler();
            getRegularizationMethods();
        };
        var broadCastEvent = function (event, params) {
            $rootScope.$broadcast(event, {
                params: params
            });
        }; 
        $scope.reguRequest = function (item) {
            $scope.closeModal('regularizationPolicies');
            item.empId = utilityService.getValue($scope.bulkRegularization, 'employee_id');
            item.isAdminBulk = true;
            item.list = {
                attendance: utilityService.getValue($scope.bulkRegularization, 'filteredList', [])
            };
            broadCastEvent('request-regu', item);
        };
        $scope.exportToCsv = function() {
            var month = utilityService.getInnerValue($scope.bulkRegularization, 'monthYear', 'month'),
                year = utilityService.getInnerValue($scope.bulkRegularization, 'monthYear', 'year'),
                username = utilityService.getValue(self.selectedItem, 'name'),
                filePrefix = 'employee-tracker-' + month + '-' + year,
                filename = (username ? filePrefix + '(' + username + ')' : filePrefix) + '.csv',
                csvData = service.buildCSVData($scope.bulkRegularization);
            
            $timeout(function () {
                utilityService.exportToCsv(csvData.content, filename);
            }, 1000);            
        };
        var resetYearMonthObject = function () {
            var currentIndex = $scope.bulkRegularization.monthYear.index,            
                currentObject = $scope.bulkRegularization.monthYear.list[currentIndex],
                lastIndex = $scope.bulkRegularization.monthYear.list.length - 1,
                lastObject = $scope.bulkRegularization.monthYear.list[lastIndex];           

            $scope.bulkRegularization.monthYear.month = lastObject.month;
            $scope.bulkRegularization.monthYear.year = lastObject.year;            
            $scope.bulkRegularization.monthYear.index = lastIndex;

            currentObject.visible = false;
            lastObject.visible = true;
            $scope.bulkRegularization.monthYear.isDisabled = true;            
        };
        var autoCompleteSelectHandler = function () {
            resetYearMonthObject();
            getMonthwiseEmployeeAttendance();
        };
        
        /***** Start: Auto Complete Section *****/
        var buildEmployeeAutoCompleteData = function (list) {
            $scope.bulkRegularization.employeeList = [];

            angular.forEach(list, function(value, key) {
                if(utilityService.getValue(value, 'full_name')
                    && utilityService.getValue(value, 'personal_profile_employee_code')) {
                    $scope.bulkRegularization.employeeList.push(value);
                }
            });

            self.repos = loadAll($scope.bulkRegularization.employeeList);
        };
        var getEmployeeList = function() {
            var url = service.getUrl('employee') + "/" + $scope.bulkRegularization.permission,
                params = {
                    hide_display_detail: true
                };

            serverUtilityService.getWebService(url, params)
                .then(function(data) {
                    buildEmployeeAutoCompleteData(data.data);
                });
        };  
        getEmployeeList();
        function querySearch(query) {
            return query ? self.repos.filter(createFilterFor(query)) : self.repos;
        }        
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function selectedItemChange(item, model, key) {
            if (angular.isDefined(model[key]) && angular.isDefined(item) && item) {
                var id =  angular.isObject(item._id) ? item._id.$id : item._id;
                model[key] = id;
                autoCompleteSelectHandler();
            } 
        }
        function loadAll(list) {
            return list.map(function (c, index) {
                var object = {
                    _id: c._id,
                    name: c.full_name,
                    image: c.profile_pic,
                    empcode: utilityService.getValue(c, 'personal_profile_employee_code')
                };

                object._lowername = utilityService.getValue(object, 'name') ? object.name.toLowerCase() : null;
                
                if (utilityService.getValue($scope.autoCompleteVia, 'selected') === 'empcode') {
                    object.value = utilityService.getValue(object, 'empcode') ? object.empcode.toLowerCase() : null;
                } else {
                    object.value = object._lowername;
                }
                
                object.image = utilityService.getValue(object, 'image', 'images/no-avatar.png');

                return object;
            });
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }
        /****** End Auto Complete Section ******/

        /*** This event has been triggered from regularization controller, 
         * once bulk admin regulation will be done ***/
        $rootScope.$on('admin-bulk-regularization-done', function (event, args) {
            getMonthwiseEmployeeAttendance();
        });

        $scope.changeAutoCompleteVia = function () {
            self.repos = loadAll($scope.bulkRegularization.employeeList);
        };

        /**** Start: Employee Selfie Url Section ****/
        var employeeSelfieUrlCallback = function (event, data) {
            if (utilityService.getValue(data, 'status') === 'success') {
                utilityService.getInnerValue(data, 'data','url')
                    ? $window.open(utilityService.getInnerValue(data, 'data','url'))
                    : showAlert(event, 'Employee Selfie',  'It seems that there is no selfie available');
            } else {
                showAlert(event, 'Employee Selfie',  utilityService.getValue(data, 'message', 'It seems that there is some error in displaying selfie'));
            }            
        };
        $scope.getEmployeeSelfieUrl = function (event, item, type) {
            var url = service.getUrl('selfieUrl') + "/" 
                    + utilityService.getValue($scope.bulkRegularization, 'employee_id') + "/"
                    + utilityService.getValue(item, 'date_timestamp') + "/" + type;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    employeeSelfieUrlCallback(event, data);
                });
        };
        /**** End: Employee Selfie Url Section ****/

        var showAlert = function(ev, title, textContent) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(textContent)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
    }
]);