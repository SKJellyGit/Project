app.controller('EmployeeViewLndController', [
    '$scope', '$q', '$location', '$timeout', '$window', '$route', 'EmployeeViewLndService', 'utilityService', 'ServerUtilityService', 'VALIDATION_ERROR', '$filter', '$mdSidenav','Upload',
    function ($scope, $q, $location, $timeout, $window, $route, EmployeeViewLndService, utilityService, serverUtilityService, VALIDATION_ERROR, $filter, $mdSidenav,Upload) {
        
        $scope.employeeView = EmployeeViewLndService.buildEmployeeViewObj();
        $scope.orderByManagerField = 'employee_detail.full_name';
        $scope.lodarFlag = false;
        $scope.employeeStatus = EmployeeViewLndService.buildEmployeeStatusObj();
        $scope.requestType = EmployeeViewLndService.buildRequestTypeObj();
        $scope.openRequestFlag = 1;
        $scope.isHistoryVisible = false;
        $scope.totalLength = null;
        $scope.report = {
            list : [],
            content : [],
            listWithoutHeader : []
        };
        $scope.resetAllTypeFilters();
        var allFilterObject = [{countObject: 'groupTemp', isGroup: true, collection_key: 'employee_detail'}];

        var employeeDeatailCallBack = function (provisinType, data){
            angular.forEach(data.data, function (value, key){
                var detailObj = {
                    provisions : [],
                    employee_detail : {}
                };
                angular.forEach(provisinType, function(val, ke){
                    var count = 0;
                    angular.forEach(value.provisions, function (v, k){
                        if(val._id == v.provision_type_id){
                            detailObj.provisions.push(v);
                            count++;
                        }
                    });
                    if(count==0){
                        detailObj.provisions.push(null)
                    }
                });
                detailObj.employee_detail = value.employee_detail;
                $scope.employeeView.employee.list.push(detailObj);
            });
            $scope.calculateFacadeCountOfAllFilters($scope.employeeView.employee.list, allFilterObject);
            angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
            $scope.lodarFlag = $scope.employeeView.employee.list ? true : false;
        };        
        var getEployeeDetails = function () {
            $q.all([
                serverUtilityService.getWebService(EmployeeViewLndService.getUrl('getProvisionType')),
                serverUtilityService.getWebService(EmployeeViewLndService.getUrl('getEmployeeViewDetails'))
            ]).then(function (data) {
                $scope.employeeView.employee.provisionType = data[0].data;
                employeeDeatailCallBack(data[0].data, data[1]);
            });
        };
        getEployeeDetails();
        $scope.changeView = function(val){
            $scope.openRequestFlag = val;
        };
        $scope.getProvisionName = function(provisionId){ 
            var provisonName = null;
            angular.forEach($scope.employeeView.employee.provisionType, function(value,key){
                if(value._id == provisionId){
                    provisonName = value.provision_name;
                    $scope.requestView.requestDetails.attributeList = value.attributes;
                }
            });

            return provisonName;
        };        
        var getViewDetails = function(item) {
            serverUtilityService.getWebService(EmployeeViewLndService.getUrl('getEmpViewDetail') + "/" + item.proID + "/" + item.empID)
                .then(function(data) {                    
                    $scope.employeeView.employee.viewDetail = data.data;
                    if($scope.employeeView.employee.viewDetail) {
                        $scope.isHistoryVisible = true;
                        $('#view-details').appendTo("body").modal('show');
                    }                    
            });
        }
        $scope.getProvisionDetails=function(provisionId) {
            angular.forEach($scope.employeeView.employee.provisionType , function(value,key) {
                if(value._id == provisionId){
                    $scope.employeeView.employee.attributeEmpList = value.attributes;
                }
            });
        };
        $scope.toggalView = function(empDetail,ProDetails) { 
            if(ProDetails) {
                $scope.employeeDetails = empDetail.employee_detail;
                $scope.provisionDetail = {
                    empID: ProDetails.employee,
                    proID: ProDetails.provision_type_id
                };
                $scope.getProvisionDetails(ProDetails.provision_type_id);
                getViewDetails($scope.provisionDetail);
            }
        };
        $scope.editAllocationPlan = function (item) {
            //$('#view-details').modal('hide');
            $(".modal-backdrop").hide();
            $('#view-details').appendTo("body").remove();
            //$location.url('provision-allotment').search({'requestId': item._id});
            if (item.request_type == 3) {
                $location.url('/frontend/provision-manager/provisionRevoke').search({
                    'requestId': item._id
                });
            } else {
                $location.url('/frontend/provision-manager/provisionAllotment').search({
                    'requestId': item._id
                });
            }
        };
        $scope.cancelRequest = function (item, action) {
            var url = EmployeeViewLndService.getUrl('cancelRequest') + "/" + item._id,
                payload = {
                    action: action
                };

            if (action == 'denied') {
                payload.deny_comment = $scope.requestView.requestDetails.denyComment;
            }
            serverUtilityService.patchWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.requestView.requestDetails.list, 'group', false);
                });
        };
        $scope.getNumber = function(num) {
            return new Array(num);   
        };        
        $scope.checkAttributeLength = function(attr,val){
            var flag = false;
            if(angular.isDefined(attr) && angular.isDefined(val)){
                var valueLength = Object.keys(val.attributes).length;
                if(attr.length && valueLength){
                    if(attr.length > valueLength){
                        $scope.totalLength = parseInt(attr.length) - parseInt(valueLength);
                        flag = true;
                    }
                }
            }

            return flag;
        };        
        var chipDetailList = function(list){
            var listToBeExclude = ["personal_profile_first_name",
                "personal_profile_middle_name", "personal_profile_last_name"];

            $scope.chipsNameDetail = [];
            $scope.chipsSlugDetail = [];
            angular.forEach(list,function(value,key){
                if (listToBeExclude.indexOf(value.slug) === -1) {
                    var slugDetail = value.slug + "_detail"
                    $scope.chipsNameDetail.push(value.name);
                    $scope.chipsSlugDetail.push(slugDetail);
                }                
            });
        };
        var getPreviewDetails = function () {
            serverUtilityService.getWebService(EmployeeViewLndService.getUrl('preview'))
                .then(function (data) {
                    $scope.employeeDetailList = data.data.group_details;
                    chipDetailList($scope.employeeDetailList);
                });            
        };
        getPreviewDetails();
        $scope.exportToCsv = function(item) {
            var attrList = new Array("Employee Full Name", "Employee ID", "Employee Status",
                    "Provision Name", "Number of Provisions Allotted", 
                    "Number of Open Allotment Requests", "Number of Open Change Requests",
                    "Number of Open Return Requests");
            $scope.report = {
                content: new Array(attrList),
            };
            angular.forEach($scope.employeeView.employee.list,function(value,key) {
                angular.forEach(value.provisions,function(val,k){
                    var array = new Array();
                    array.push(value.employee_detail.full_name ? value.employee_detail.full_name : "N/A");
                    array.push(value.employee_detail.emp_code ? value.employee_detail.emp_code : "N/A");
                    array.push($scope.requestView.requestDetails.buildEmployeeStatusList[value.employee_detail.emp_status] ? $scope.requestView.requestDetails.buildEmployeeStatusList[value.employee_detail.emp_status] : "N/A");
                    if(val){
                        array.push($scope.getProvisionName(val.provision_type_id) ? $scope.getProvisionName(val.provision_type_id) : "N/A");
                        array.push(val.total_allotted ? val.total_allotted : "N/A");
                        array.push(val.total_allotment_pending ? val.total_allotment_pending : "N/A");
                        array.push(val.total_change_pending ? val.total_change_pending : "N/A");
                        array.push(val.total_return_pending ? val.total_return_pending : "N/A");
                    }
                    $scope.report.content.push(array);
                });
            });

            var reportName = "Employee View.csv";
            if($scope.report.content.length > 1){
                $timeout(function() {
                    utilityService.exportToCsv($scope.report.content, reportName);
                }, 500);                
            }
        };
        
        $scope.updatePaginationSettings('provision_manager_emp_view');

    }
]);