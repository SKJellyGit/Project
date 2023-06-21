app.controller('PayrollNiyoCouponController', [
    '$scope', '$timeout', 'utilityService', 'ServerUtilityService', 'EmployeeTaskService', 'PayrollParentService',
    function ($scope, $timeout, utilityService, serverUtilityService, EmployeeTaskService, parentService) {
        $scope.uploadErrorMessages = []
        var today = new Date();
        var month = today.getMonth();
        $scope.overall = EmployeeTaskService.buildOveralNiyolObject()
        $scope.slectedYear = {
        month: month,
        year: $scope.yearList[0],
        monthYear: $scope.yearList[0] + "/" +  (month + 1),
        currentYear: $scope.yearList[0],
        currentMonth: month + 1
        };

        $scope.updateList = function (year) {
            $scope.slectedYear.year = year;
            $scope.slectedYear.monthYear = year + "/" + (parseInt($scope.slectedYear.month) + 1);
            getNiyoCouponList();
        };      

        $scope.changeMonth = function() {
            $scope.slectedYear.monthYear = $scope.slectedYear.year + "/" + (parseInt($scope.slectedYear.month) + 1);
            getNiyoCouponList();
        };
        
        $scope.clearFileUpload = function(model, keyname) {
            model[keyname].isUploaded = false;
            model[keyname].file = null;
        };

        $scope.setMonthTab = function () {
            // $scope.attendanceList = [];
            // $scope.isAttendanceListVisible = false;
            $scope.slectedYear.monthYear = $scope.slectedYear.year + "/" +  (parseInt($scope.slectedYear.month) + 1);
            // getEmployeeAttendance();
        };

        $scope.setCommonFileObject = function(model, keyname, file){
            model[keyname].file = file;
            model[keyname].isUploaded = true;
        };

        $scope.downloadSampleTemplate = function(urlPrefix) {
            $scope.viewDownloadFileUsingForm(parentService.getUrl(urlPrefix) + '/' + $scope.slectedYear.monthYear);
        };   

        $scope.uploadFilledTemplate = function(fileObject, keyName, urlPrefix, section) {
            section = 'bulkFilledTemplate';
            var url = parentService.getUrl(urlPrefix) + "/" 
                    + $scope.slectedYear.monthYear;
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
        
        var successCallback = function (data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(utilityService.getValue(data, 'message', 'Sheet has been uploaded successfully'));
            getniyoCouponComponentList();
        };
        var errorCallback = function (data, section) {
           $scope.uploadErrorMessages = buildError(data);
        };

        var reBuildList = function(list) {
            angular.forEach(list, function(value, key) {
                value.empFullName = utilityService.getInnerValue(value, 'employee', 'full_name');                
            });

            return list;
        };
        $scope.sortBy = function(object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };
        var niyoCouponCallback = function(data) {
            if (utilityService.getValue(data, 'status') === 'success') {
                $scope.overall.niyoCouponComponent.heads = utilityService.getInnerValue(data, 'data', 'heads', null);
                $scope.overall.niyoCouponComponent.rows = reBuildList(utilityService.getInnerValue(data, 'data', 'rows', []));
            } else {
                $scope.overall.error.status = true;
                $scope.overall.error.message = buildError(data);
            }

            $scope.overall.visible = true;
        };
        var getNiyoCouponList = function () {
            var url = EmployeeTaskService.getUrl('getNiyoCouponEmp') + "/" 
                + $scope.slectedYear.monthYear;

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    niyoCouponCallback(data);
            });
        };
        getNiyoCouponList()
        $scope.updatePaginationSettings('niyo_coupon');

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

        $scope.exportToCsv = function() {
            var content = EmployeeTaskService.buildExportData($scope.overall),
                filename = 'niyo-coupon-list',
                month = parseInt($scope.slectedYear.month, 10) + 1;

            if($scope.legal_entity.entity_id) {
                filename += '-' + utilityService.getValue($scope.legal_entity.selected, 'name');
            }
            filename += '-' + utilityService.buildMonthObject()[month] + '-' 
                + $scope.slectedYear.year + '.csv';

            utilityService.exportToCsv(content, filename);
        };
    }

]);