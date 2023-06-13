app.controller('ExceptionController', [
    '$scope', '$routeParams', 'exceptionService', 'utilityService', 'ServerUtilityService', 
    function ($scope, $routeParams, exceptionService, utilityService, serverUtilityService) {
        $scope.exceptionModule = {
            name: $routeParams.moduleName
        };
        $scope.exceptionElementId = utilityService.getValue($routeParams, 'planId');
        $scope.exceptionAction = exceptionService.buildExceptionAction();
        $scope.groupList = [];
        $scope.exceptionList = [];
        $scope.filterList = [];
        $scope.groupObject = {};
        $scope.elementObject = {};
        $scope.addFilter = {
            status: false
        };
        $scope.moduleName = angular.isDefined($routeParams.moduleName) ? $routeParams.moduleName : null;
        $scope.companyWide = {
            element_ids: [],
            groups: [],
            elements: [],
            type: null,
            value: null
        };
        if(!$scope.exceptionElementId) {
            return false;
        }

        /********** START COMMON SECTION **********/
        var syncExceptionModel = function(model, isApply) {
            isApply = angular.isDefined(isApply) ? isApply : false;
            $scope.exception = exceptionService.buildExceptionModel(model, $scope.exceptionElementId, isApply, $scope.exceptionModule);
        };  
        syncExceptionModel();      
        var buildGroupElementObject = function() {
            angular.forEach($scope.groupList, function(value, key) {
                $scope.groupObject[value._id] = value.name;
                angular.forEach(value.element_details, function(v, k) {
                    $scope.elementObject[v._id] = v.name;
                });
            });
        };
        var getGroupList = function() {
            var url = exceptionService.getUrl('grplst') + "?field=true&status=true";
            serverUtilityService.getWebService(url).then(function(data) {                
                $scope.companyWide.groups = $scope.groupList = data.data;
                $scope.filters = exceptionService.buildFilters($scope.groupList);
                buildGroupElementObject();
            }); 
        };
        getGroupList();
        var buildFilterList = function(data) {            
            if(data.is_company_wide) {
                $scope.companyWide.element_ids = utilityService.getValue(data, 'exception_element_ids', []);
                $scope.exception.apply = true;
            } else {
                $scope.filterList = utilityService.getValue(data,'applicability',[]);
                $scope.exception.apply = false;
            }
        }; 
        var getApplicabilityList = function() {
            var url = exceptionService.getUrl('applicability') + "/" + $scope.exceptionElementId + "?module_key=" + $scope.exceptionModule.name;
            serverUtilityService.getWebService(url).then(function(data) {
                buildFilterList(data.data);
            }); 
        };
        getApplicabilityList();
        var successCallback = function(data, section) {
            utilityService.showSimpleToast(data.message);            
            (angular.isDefined(data.data) && data.data) 
                ? buildFilterList(data.data) : getApplicabilityList();
            resetAddNewFilter();            
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };        
        var successErrorCallback = function (data, section) {
            data.status === "success" ? 
                successCallback(data, section) : errorCallback(data, section);
        };            
        /********** END COMMON SECTION **********/

        /********** START COMPANY WIDE SECTION **********/
        $scope.addElements = function(form) {
            utilityService.resetForm(form);
            var element = $scope.companyWide.value;
            if($scope.companyWide.element_ids.indexOf(element) == -1) {
                $scope.companyWide.element_ids.push(element);
                $scope.companyWide.type = null;
                $scope.companyWide.value = null;
            }
        };
        $scope.removeElement = function(index) {
            $scope.companyWide.element_ids.splice(index, 1);
        };
        var updateCWExceptionCallback = function(data) {
            if (data.status === "success") {
                hideModal('add-company-wide-exception', false);
                utilityService.showSimpleToast(data.message);
//                $location.url('segment-field').search("segmentId", $routeParams.segmentId);
            } else {
                errorCallback(data, "exception");
            }
        };
        $scope.updateCWException = function() {
            var url = exceptionService.getUrl('exception') 
                + "/" + $scope.exceptionElementId 
                + "?module_key=" + $scope.exceptionModule.name,
            payload = exceptionService.buildOverwriteExceptionPayload($scope.companyWide);
    console.log(payload);

            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    updateCWExceptionCallback(data);
                });
        };
        /********** END COMPANY WIDE SECTION **********/

        /********** START FILTER SECTION **********/
        var getElementList = function(type) {
            var list = $scope.groupList.filter(function(item, index, arr){
                return (item._id == type) ? item : null;
            });

            return list[0].element_details;
        };
        var resetAddNewFilter = function() {
            syncExceptionModel();
            $scope.filters = exceptionService.buildFilters($scope.groupList);
        };
        $scope.changeGroup = function(filter) {
            filter.elements = getElementList(filter.type);
        };
        $scope.toggleFilterAction = function(action) {
            angular.forEach($scope.filterAction, function(value, key) {
                $scope.filterAction[key] = false;
            });
            $scope.filterAction[action] = true;
        };        
        $scope.isAndDisabled = function(filter) {
            return (!filter.type || !filter.value || filter.groups.length==1);
        };
        var extractGroupList = function() {            
            var arrTypes = [],
                groupList = [];

            angular.forEach($scope.filters, function(v, k) {
                if(v.type) {
                    arrTypes.push(v.type);
                }
            });
            
            angular.forEach($scope.groupList, function(value, key) {
                if(arrTypes.indexOf(value._id) == -1 && value.element_details.length) {
                    groupList.push(value);
                }
            });
            return groupList;            
        };
        $scope.andClickHandler = function(filter, index) {
            if(index == $scope.filters.length - 1) {
                filter.className = 2;
                $scope.filters.push(exceptionService.buildDefaultFilterObject(extractGroupList()));
            }
        };
        $scope.removeFilter = function(index) {
            $scope.filters.splice(index, 1);
            if($scope.filters.length == 0){
               //$scope.relevance._id = null;
               resetAddNewFilter();
            }
        };
        $scope.renderGroupName = function(key) {
            return angular.isDefined(key) && $scope.groupObject[key];
        };
        $scope.renderElementName = function(key) {
            return angular.isDefined(key) && $scope.elementObject[key];
        };
        $scope.isElementVisible = function(item) {
            return $scope.exception.elements.indexOf(item._id) == -1 ? true : false;
        };
        $scope.getObjectLength = function(item, key) {
            return utilityService.getValue(item, key) && Object.keys(item[key]).length ? Object.keys(item[key]).length : 0;
        };
        $scope.editException = function(item) {
            $scope.filters = [];
            $scope.exception.applicability = item;
            $scope.exception._id = angular.isObject(item._id) ? item._id.$id : item._id;
            angular.forEach(item.exception, function(value, key) {
                var type = key,
                    filter = {
                        type: type,
                        value: value,
                        className: 2,
                        groups: $scope.groupList,
                        elements: getElementList(type)
                    };

                $scope.filters.push(filter);
            });
        };        
        $scope.changeApplicabilty = function(item) {
            $scope.exception.elements = [];
            if(angular.isDefined(item.scope)) {
                for(key in item.scope) {
                    if(item.scope.hasOwnProperty(key)) {
                        $scope.exception.elements.push(item.scope[key]);
                    }
                }
            }
            if(angular.isUndefined(item.exception) || !item.exception) {
                $scope.filters = exceptionService.buildFilters($scope.groupList);
            }    
        }; 
        var buildExceptionUrl = function(item) {
            return exceptionService.getUrl('exception') 
                + "/" + $scope.exceptionElementId 
                + "/" + (angular.isObject(item._id) ? item._id.$id : item._id)
                + "?module_key=" + $scope.exceptionModule.name
        };
        $scope.updateApplicabilityException = function() {
            resetErrorMessages();
            var url = buildExceptionUrl($scope.exception.applicability),
                payload = exceptionService.bulidExceptionPayload($scope.filters);

            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, "exception");
                });
        };
        $scope.deleteException = function(item) {
            serverUtilityService.deleteWebService(buildExceptionUrl(item))
                .then(function(data) {
                    successErrorCallback(data, "exception");
                });
        };      
        /********** END FILTER SECTION **********/

        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        var hideModal = function(id) {
            $('#' + id).modal('hide');
        };

    }
]);