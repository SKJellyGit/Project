app.controller('AdminLeaveDetailsController', [
    '$scope', '$modal', '$timeout', '$window', 'AdminLeaveDetailsService', 'DashboardService', 'TimeOffService', 'utilityService', 'ServerUtilityService','$rootScope',
    function ($scope, $modal, $timeout, $window, service, DashboardService, timeOffService, utilityService, serverUtilityService, $rootScope) {
        var self = this;

        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.repos = [];

        $scope.bulkRegularization = service.buildBulkRegularizationObject();
        
        var getAssignedLeaveTypeList = function() {
            var url = timeOffService.getUrl('summary') + "/" + $scope.bulkRegularization.employee_id;
            
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.timeoff.leaveTypeList = timeOffService.buildSummaryList(utilityService.getValue(data, 'data', []));
            });
        };
        var autoCompleteSelectHandler = function () {
            getAssignedLeaveTypeList();
            getLeaveRequestList();
            $scope.updatePaginationSettings('request');
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

        $scope.changeAutoCompleteVia = function () {
            self.repos = loadAll($scope.bulkRegularization.employeeList);
        };

        /***** Start Leave Details Section *****/
        $scope.timeoff = timeOffService.buildTimeOffObject();
        $scope.sortBy = function(propertyName) {
            $scope.timeoff.reverse = ($scope.timeoff.propertyName === propertyName) ? !$scope.timeoff.reverse : false;
            $scope.timeoff.propertyName = propertyName;
        };
        var resetSelectedLeaveType = function(model) {
            model.selectedLeaveType= [];
        };
        var resetFromToDate = function(model) {
            model.fromDate = null;
            model.toDate = null;
        };
        $scope.leaveTypeFilter = function(leave) {
            if ($scope.timeoff.requests.selectedLeaveType.length > 0 && leave.leave_type_id) {
                if ($.inArray(leave.leave_type_id, $scope.timeoff.requests.selectedLeaveType) < 0)
                    return;
            }
            return leave;
        };
        var resetRequestFilter = function() {
            resetSelectedLeaveType($scope.timeoff.requests);
            timeOffService.buildDefaultRequestDuration();
            resetFromToDate($scope.timeoff.requests);
        };
        resetRequestFilter();

        //$scope.btnhide = false;
        var getLeaveRequestList = function() {
            $scope.timeoff.requests.list = [];
            $scope.timeoff.requests.visible = false;

            var url = service.getUrl('leaveDetails') + "/" + $scope.bulkRegularization.employee_id;

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    if(data.data) {
                        angular.forEach(data.data, function(item, key) {
                            if(item.can_cancel_leave === false) {
                                $scope.btnhide = true;
                            } else {
                                $scope.btnhide = false;
                            }
                        });
                    }
                    $scope.timeoff.requests.list = timeOffService.buildRequestList(data.data);
                    $timeout(function() {
                        $scope.timeoff.requests.visible = true;
                    }, 100);
                });
        };  
        $scope.cancelRequestLeave = function(item) {
            serverUtilityService.getWebService(service.getUrl('cancelRequestLeave') + "/" + item._id)
                .then(function(data) {
                        getLeaveRequestList();                  
                });
        };    
        $scope.isDurationCustom = function() {
            return $scope.timeoff.requests.duration.slug == 'custom';
        };
        $scope.changeDateRange = function(model) {
            var dateRange = timeOffService.getDateRange(model.duration.slug);
            model.fromDate = dateRange.from;
            model.toDate = dateRange.to;
        };
        $scope.resetRequestDate = function() {
            resetFromToDate($scope.timeoff.requests);
            $scope.timeoff.requests.duration = timeOffService.buildDefaultRequestDuration();
            getLeaveRequestList();
        };
        $scope.viewDocument = function (file,type){
            var mainUrl = "https://docs.google.com/viewerng/viewer?url=" + file.doc_path;
            $window.open(mainUrl);
        };
        $scope.viewDownloadFile = function(file, type) {
            $window.open(file.doc_path, '_blank');
        };
        var isPastDate = function(item) {
            var cDate = new Date(),
                ctmstmp = cDate.getTime(),
                applyDate = new Date(item.from_date * 1000),
                dstmp = applyDate.getTime();

            return dstmp < ctmstmp && item.status != 1;
        };
        $scope.hideCancelRequestedLeave = function(item) {
            return isPastDate(item) || item.deduction_type == "2" || item.deduction_type == "3" || item.status == '2';
        };
        $scope.viewComment = function (text) {
            $scope.timeoff.requests.comment.text = text;
            $scope.openModal('comment', 'view-comment.tmpl.html');
        };
        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };       
        $scope.exportToCsv = function() {
            var username = utilityService.getValue(self.selectedItem, 'name'),
                filePrefix = 'employee-leave-requests',
                filename = (username ? filePrefix + '(' + username + ')' : filePrefix) + '.csv',
                csvData = timeOffService.buildCSVData($scope.timeoff.requests);

            $timeout(function () {
                utilityService.exportToCsv(csvData.content, filename);
            }, 1000);            
        }; 
        /***** End Leave Details Section *****/

        /********* Start Angular Modal Section *********/
        $scope.openModal = function(instance, template, size) {
            size = size || 'sm';

            $scope.modalInstance[instance] = $modal.open({
                templateUrl : template,
                scope : $scope,
                windowClass : 'zindex',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };
        /********* End Angular Modal Section *********/
        var broadCastEvent = function(event, params) {
            $rootScope.$broadcast(event, { 
                params: params 
            });
        };
        $scope.swapLeaveRequest = function(item, triggerFrom, action) {
            action = angular.isDefined(action) ? action : "summary";
            var params = {
                triggerFrom: triggerFrom,
            };
            if(action === "swapleave") {
                params.isleaveswap = true;
                params.from_date = item.from_date_format;
                params.to_date = item.to_date_format;
            } 
            params.leaveType = item._id;
            params.leavePlan = item.plan_id; 
            params.leaveIsSwapAdmin = true
            params.emp_id = item.emp_id
            broadCastEvent('request-leave', params);            
        };
    }
]);
