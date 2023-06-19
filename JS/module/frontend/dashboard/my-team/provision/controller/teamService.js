app.controller('ProvisionRelaionViewController', [
    '$scope', '$routeParams', '$q', '$location', '$timeout', '$window', '$route', 'ProvisionRelaionViewService', 'utilityService', 'ServerUtilityService', 'VALIDATION_ERROR', '$filter', '$mdSidenav', 'Upload', 'LeaveSummaryService',
    function ($scope, $routeParams, $q, $location, $timeout, $window, $route, ProvisionRelaionViewService, utilityService, serverUtilityService, VALIDATION_ERROR, $filter, $mdSidenav, Upload, summaryService) {

        var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);
        $scope.employeeView = ProvisionRelaionViewService.buildEmployeeViewObj();
        $scope.orderByManagerField = 'employee_detail.full_name';
        $scope.employeeStatus = ProvisionRelaionViewService.buildEmployeeStatusObj();
        $scope.requestType = ProvisionRelaionViewService.buildRequestTypeObj();
        $scope.openRequestFlag = 1; 
        $scope.resetAllTypeFilters();
        $scope.updatePaginationSettings('my_team_provision');        
         var allFilterObject = [
            {
                countObject: 'group',
                isGroup: true,
                collection_key: 'employee_detail'
            }
        ];
       $scope.loaderFlag = false;
        var employeeDeatailCallBack = function (provisinType, data) {
            angular.forEach(data.data, function (value, key) {
                var detailObj = {
                    provisions: [],
                    employee_detail: {}
                };
                angular.forEach(provisinType, function (val, ke) {
                    var count = 0;
                    angular.forEach(value.provisions, function (v, k) {
                        if (val._id == v.provision_type_id) {
                            detailObj.provisions.push(v);
                            count++;
                        }
                    });
                    if (count == 0) {
                        detailObj.provisions.push(null)
                    }
                });
                detailObj.employee_detail = value.employee_detail;
                $scope.employeeView.employee.list.push(detailObj);
            });
            $scope.calculateFacadeCountOfAllFilters($scope.employeeView.employee.list, allFilterObject);
            angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
            if ($scope.employeeView.employee.list) {
                $scope.loaderFlag = true;
            }
        };        
        $scope.changeView = function (val) {
            $scope.openRequestFlag = val;
        };        
        var buildGetParams = function () {
            var params = {
                rel_id: $scope.relationship.primary.model._id,
                direct_reportee: $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false,
            };
            if (teamOwnerId) {
                params.emp_id = teamOwnerId;
            }
            return params;
        };
        var getEployeeDetails = function () {
            $q.all([
                serverUtilityService.getWebService(ProvisionRelaionViewService.getUrl('getProvisionType')),
                serverUtilityService.getWebService(ProvisionRelaionViewService.getUrl('getEmployeeViewDetails'), buildGetParams())
            ]).then(function (data) {
                $scope.employeeView.employee.provisionType = data[0].data;
                if(data[1] && data[1].status=="success"){
                    employeeDeatailCallBack(data[0].data, data[1]);
                }
            });
        };
        getEployeeDetails();
        
        $scope.getProvisionName = function (provisionId) {
            var provisonName = null;
            angular.forEach($scope.employeeView.employee.provisionType, function (value, key) {
                if (value._id == provisionId) {
                    provisonName = value.provision_name;
                    $scope.requestView.requestDetails.attributeList = value.attributes;
                }
            });
            return provisonName;
        };
        var getViewDetails = function (item) {
            var url = ProvisionRelaionViewService.getUrl('getEmpViewDetail') + "/" + item.proID + "/" + item.empID;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.employeeView.employee.viewDetail = data.data;
            });
            $timeout(function () {
                $('#view-details').appendTo("body").modal('show');
            }, 3000);
        }
        $scope.getProvisionDetails = function (provisionId) {
            angular.forEach($scope.employeeView.employee.provisionType, function (value, key) {
                if (value._id == provisionId) {
                    $scope.employeeView.employee.attributeEmpList = value.attributes;
                }
            });
        };
        $scope.toggalView = function (empDetail, ProDetails) {
            if (ProDetails) {
                $scope.employeeDetails = empDetail.employee_detail;
                $scope.provisionDetail = {
                    empID: ProDetails.employee,
                    proID: ProDetails.provision_type_id
                };
                $scope.getProvisionDetails(ProDetails.provision_type_id);
                getViewDetails($scope.provisionDetail);
            } else {
                alert("Provision Not Assigned Yet.");
                return false;
            }
        };
        $scope.editAllocationPlan = function (item) {
            $('#view-details').modal('hide');
            $location.url('provision-allotment').search({'requestId': item._id});
        };
        $scope.cancelRequest = function (item, action) {
            var url = ProvisionRelaionViewService.getUrl('cancelRequest') + "/" + item._id,
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
    }
]);