app.controller('LndManagerController', [
    '$scope', '$routeParams', '$q', '$location', '$timeout', '$window', 'LndManagerService', 'utilityService', 'ServerUtilityService', '$modal',
    function ($scope, $routeParams, $q, $location, $timeout, $window, LndManagerService, utilityService, serverUtilityService, $modal) {

        var self = this;

        self.simulateQuery = false;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;

        $scope.minDate = new Date();
        $scope.requestId = utilityService.getValue($routeParams, 'requestId');
        $scope.requestFor = utilityService.getValue($routeParams, 'requestFor');
        $scope.multipleRequestReurnFlag = false;
        $scope.multipleRequestFlag = false;
        $scope.filterFlag = false;
        $scope.forMeFlag = false;
        $scope.byMeFlag = false;
        $scope.sendNotification = {
            isCheck: null,
        };
        $scope.damageRequest = {
            1: "Yes",
            2: "No"
        };
        $scope.mainTab = 1;
        $scope.orderByManagerField = 'employee_detail.full_name';
        $scope.colorCodes = ['#002b4d', '#003a66', '#004276', '#004880', '#005799', '#0065b3', '#0074cc', '#0082e6', '#0091ff', '#1a9cff', '#33a7ff', '#4db2ff', '#66bdff', '#80c8ff', '#99d3ff', '#b3deff', '#cce9ff', '#e6f4ff'];
        $scope.requester = angular.isDefined($routeParams.requestFor) ? $routeParams.requestFor : 2;
        $scope.requestType = 2;
        $scope.requestStatus = 4;
        $scope.requestView = LndManagerService.buildRequestViewModel();
        $scope.requestView.pending.forFilteredList = [];
        $scope.isUniqueAttribute = false;
        $scope.allAttribute = true;
        $scope.employeeStatus = LndManagerService.buildEmployeeStatusObj();
        $scope.statusFilterObj = LndManagerService.buildReqStatusFilterObj();
        $scope.includeStatusFilter = [];
        $scope.includeCandidateFilter = {};
        $scope.includePTypeFilter = {
            requestViewDetail: [],
            requestViewSummary: [],
            provisionViewSummary: []
        };
        $scope.allFilter = {
            requestViewDetail: [],
            requestViewDetailGroup: [],
            requestViewSummary: [],
            provisionViewSummary: [],
            pDetailAllFilter: [],
            empallFilters: []
        };
        $scope.getListLength = {
            flag: false
        };
        $scope.employeeWiseFlag = false;

        $scope.searchByName = {
            employee_detail: {
                full_name: ''
            }
        }

        /* Summary Section Start */
        $scope.summaryPayload = LndManagerService.buildGetSummaryPayload()
        $scope.summaryTrainingList = []
        $scope.employeeSummary = null
        $scope.eventCount = null
        $scope.getEmployeeSummary = function () {
            var url = $scope.summaryPayload.employeeSummary ? LndManagerService.getUrl('employeeSummary') + '?search=' + $scope.summaryPayload.employeeSummary : LndManagerService.getUrl('employeeSummary')
            $scope.employeeSummaryVisible = false
            serverUtilityService.getWebService(url).then(function (response) {

                if (response.status == 'success') {
                    $scope.employeeSummary = LndManagerService.buildEmployeeSummary(response.data)
                    $scope.employeeSummaryVisible = true
                }
                else {
                    $scope.employeeSummaryVisible = true
                }
                // console.log(response)
            })

        }

        $scope.getEventCount = function () {
            var url = LndManagerService.getUrl('eventCount') + '?search=' + $scope.summaryPayload.eventCount
            $scope.eventCountVisible = false
            serverUtilityService.getWebService(url).then(function (response) {
                $scope.eventCount = LndManagerService.buildEventCount(response.data)
                $scope.eventCountVisible = true
                // console.log(response)
            })
        }

        $scope.getEmployeeSummary()
        $scope.getEventCount()

        $scope.resetTrainingSummary = function () {
            $scope.summaryPayload.employeeSummary = null
            $scope.getEmployeeSummary()
        }
        /* Summary Section End*/

        $scope.updateFlagForMultipleRequest = function (list, trainingList) {
            trainingList = angular.isDefined(trainingList) ? trainingList : [];

            var allotedTrainingList = [];
            if (angular.isDefined(list.training_id)) {
                angular.forEach(trainingList, function (value, key) {
                    allotedTrainingList.push(value.training_id);
                });
                if (allotedTrainingList.indexOf(list.training_id) === -1) {
                    $scope.multipleRequestReurnFlag = true;
                }
            }
            if (!trainingList.length) {
                $scope.multipleRequestReurnFlag = true;
            }
        };
        $scope.updateFlagForChangeMultipleRequest = function (list, trainingList) {
            trainingList = angular.isDefined(trainingList) ? trainingList : [];

            if (list.request_type == 2) {
                var allotedTrainingList = [];
                if (angular.isDefined(list.training_id)) {
                    angular.forEach(trainingList, function (value, key) {
                        allotedTrainingList.push(value.training_id);
                    });
                    if (allotedTrainingList.indexOf(list.training_id) === -1) {
                        $scope.multipleRequestFlag = true;
                    }
                }
                if (!trainingList.length) {
                    $scope.multipleRequestFlag = true;
                }
            }
        };
        $scope.setMainTab = function (tab) {
            $scope.resetAllTypeFilters();
            $scope.mainTab = tab;
        };
        $scope.getNotificationData = function (list) {
            resetErrorMessages();
            var url = LndManagerService.getUrl('notification'),
                payload = [];

            angular.forEach(list, function (value, key) {
                if (value.isCheck == true) {
                    payload.push({
                        emp_id: value.employee,
                        emp_full_name: value.employee_detail.full_name,
                        emp_email: value.employee_detail.emp_email,
                        emp_mobile: value.employee_detail.emp_mobile,
                        training_type_id: value.training_type_id,
                        training_name: $scope.getTrainingName(value.training_type_id),
                        request_id: value.request_id,
                        _id: value._id,
                        due_date: value.due_date,
                        request_type: value.request_type
                    });
                }
            });
            if (!payload.length) {
                alert('Please select an employee first');
            } else {
                serverUtilityService.postWebService(url, payload)
                    .then(function (data) {
                        successErrorCallback(data, $scope.requestView.requestDetails.list, "group", true);
                    });
            }
        };
        $scope.candidateRequestFilter = function (candidate) {
            var flag = true;
            if (Object.keys($scope.includeCandidateFilter).length > 0) {
                angular.forEach($scope.includeCandidateFilter, function (value, key) {
                    if (angular.isDefined($scope.includeCandidateFilter[key]) && $scope.includeCandidateFilter[key].length > 0) {
                        if ($window._.intersection(candidate.employee_detail[key], $scope.includeCandidateFilter[key]).length == 0) flag = false; //return;
                    }
                });
                if (flag) {
                    return candidate;
                } else {
                    return;
                }
            } else {
                return candidate;
            }
        };
        var chipDetailList = function (list) {
            var listToBeExclude = ["personal_profile_first_name",
                "personal_profile_middle_name", "personal_profile_last_name"];

            $scope.chipsNameDetail = [];
            $scope.chipsSlugDetail = [];
            angular.forEach(list, function (value, key) {
                if (listToBeExclude.indexOf(value.slug) === -1) {
                    $scope.chipsNameDetail.push(value.name);
                    $scope.chipsSlugDetail.push(value.slug + "_detail");
                }
            });
        };
        var getPreviewDetails = function () {
            serverUtilityService.getWebService(LndManagerService.getUrl('preview'))
                .then(function (data) {
                    $scope.employeeDetailList = data.data.group_details;
                    chipDetailList($scope.employeeDetailList);
                });
        };
        getPreviewDetails();
        var resetAllListing = function () {
            $scope.requestView.pending.byList = [];
            $scope.requestView.pending.byCategory = [];
            $scope.requestView.pending.byGraphData = [];
            $scope.requestView.pending.forList = [];
            $scope.requestView.pending.forCategory = [];
            $scope.requestView.pending.forGraphData = [];
        };
        $scope.changeListByFilter = function (status) {
            resetAllListing();
            $scope.requestStatus = status;
            getPendingTrainingList(status);
        };
        var getTrainingRequestList = function (requester) {
            var typeID = null,
                urlType = null;

            if (!$routeParams.requestId) {
                typeID = angular.isDefined(requester) ? requester : 1;
                urlType = "managerRequest";
            } else {
                typeID = $routeParams.requestId;
                urlType = "individualRequest";
            }
            serverUtilityService.getWebService(LndManagerService.getUrl(urlType) + "/" + typeID).then(function (data) {
                // debugger;
                getRequestDetailListObj(data.data);
                $scope.requestView.requestDetails.list = data.data;
                if ($routeParams.requestId) {
                    $scope.getTrainingName(data.data.training_type_id);
                    $scope.getTrainingValueList(data.data.training_type_id);
                }
                $scope.requestView.requestDetails.returnValueList = data.data;

                if (urlType === "individualRequest") {
                    $scope.requestView.requestDetails.model.old_training_id = data.data.training_id;
                    $scope.requestView.requestDetails.returnModal.training_id = data.data.training_id;
                }
                $scope.requestView.requestDetails.visible = true;
                //console.log($scope.requestView.requestDetails.returnValueList);
                if ($scope.requestView.requestDetails.returnValueList) {

                    $scope.updateFlagForMultipleRequest($scope.requestView.requestDetails.returnValueList, $scope.requestView.requestDetails.returnValueList.alloted_trainings);
                }
                if ($scope.requestView.requestDetails.list) {
                    if (requester == 1) {
                        $scope.forMeFlag = false;
                        $scope.byMeFlag = true;
                    } else {
                        $scope.forMeFlag = true;
                        $scope.byMeFlag = false;
                    }
                    $scope.updateFlagForChangeMultipleRequest($scope.requestView.requestDetails.list, $scope.requestView.requestDetails.list.alloted_trainings);
                }
                if ($scope.requestView.requestDetails.returnValueList || $scope.requestView.requestDetails.list) {
                    $scope.getListLength.flag = true;
                }
            });
        };
        $scope.setTab = function (tab, type, key) {
            resetAllListing();
            $scope.forMeFlag = false;
            $scope.byMeFlag = false;
            if (type == 'detail') {
                $scope.requestView.requestDetails.list = [];
                $scope.requester = tab;
                getTrainingRequestList(tab);
                $scope.updatePaginationSettings(key);
            }
            if (type == 'summary') {
                $scope.requestStatus = 4;
                getPendingTrainingList($scope.requestStatus);
                $scope.requestType = tab;
            }
        };
        var pagName = $scope.requester == 1 ? 'request_by' : 'request_for';
        $scope.setTab($scope.requester, 'detail', pagName);
        $scope.trainingAttributeList = [{
            attribute_id: null,
            attribute_value: null,
            list: []
        }];
        $scope.addFiltter = function () {
            var filter = {
                attribute_id: null,
                attribute_value: null,
                list: []
            };
            $scope.trainingAttributeList.push(filter);
        }
        $scope.remove = function (index, item) {
            item.splice(index, 1);
        };
        $scope.removeEmployee = function (index, item) {
            item.splice(index, 1);
        };
        var createGraphList = function (data) {
            var graphData = [];
            for (var i = 0; i < 4; i++) {
                var obj = {
                    name: null,
                    data: [],
                    color: null
                };
                obj.name = $scope.requestView.pending.header[i];
                obj.color = $scope.colorCodes[i];
                angular.forEach(data, function (v, k) {
                    obj.data.push(v.data[i]);
                });
                if (obj.data.length) {
                    graphData.push(obj);
                }
            }

            return graphData;
        };
        var createSummarryList = function (data) {
            var obj = {
                list: [],
                category: []
            };
            angular.forEach($scope.requestView.requestDetails.trainingType, function (value, key) {
                angular.forEach(data, function (val, key) {
                    if (value._id == val.training_type_id) {
                        obj.category.push(value.training_name);
                        val.training_name = value.training_name
                        val.training_icon = value.training_icon
                    }
                });
            });
            obj.list = data;

            return obj;
        };
        var createByListCallBack = function (data, list, grpahList) {
            var obj = createSummarryList(data);
            $scope.requestView.pending.byList = obj.list;
            $scope.requestView.pending.byCategory = obj.category;
            $scope.requestView.pending.byGraphData = createGraphList(data);
            if ($scope.requestView.pending.byGraphData.length) {
                $scope.requestView.pending.byVisible = true;
            }
        };
        var createForListCallBack = function (data) {
            var obj = createSummarryList(data);
            $scope.requestView.pending.forList = obj.list;
            $scope.requestView.pending.forCategory = obj.category;
            $scope.requestView.pending.forGraphData = createGraphList(data);
            if ($scope.requestView.pending.forGraphData.length) {
                $scope.requestView.pending.forVisible = true;
            }
        };
        var getPendingTrainingList = function (status) {
            $scope.requestView.pending.byVisible = false;
            $scope.requestView.pending.forVisible = false;
            $q.all([
                serverUtilityService.getWebService(LndManagerService.getUrl('getSeatSummary') + "/1/" + status),
                serverUtilityService.getWebService(LndManagerService.getUrl('getSeatSummary') + "/2/" + status)
            ]).then(function (data) {
                createByListCallBack(data[0].data);
                createForListCallBack(data[1].data);
            });
        };
        var getRequestDetailListObj = function (list) {
            if (angular.isObject(list) && !angular.isArray(list)) {
                var newList = [];
                list = newList.push(list);
            }

            angular.forEach(list, function (value, key) {
                value['isCheck'] = false;
                value.training_name = $scope.getTrainingName(value.training_type_id);
                value.full_name = value.employee_detail.full_name;
                value.employee_id = value.employee_detail.emp_code;
                value.empStatus = value.employee_detail.emp_status;
            });
        };
        $scope.trainingCapacities = []
        $scope.filteredTrainingCapacities = []
        var getTrainingList = function () {
            $scope.trainingCapacities = []

            serverUtilityService.getWebService(LndManagerService.getUrl('training')).then(function (response) {
                // console.log('HERE',data)
                $scope.summaryTrainingListVisible = false
                if (response.status == 'success') {
                    $scope.requestView.requestDetails.trainingType = response.data;
                    response.data.map(function (training) {
                        $scope.trainingCapacities.push({
                            name: training.training_name,
                            seating_mode: training.capacity,
                            total_capacity: training.capacity_limit,
                            available_seats: training.capacity_limit - (training.allocated_quantity ? training.allocated_quantity : 0)
                        })

                        $scope.summaryTrainingList.push({
                            _id: training._id,
                            name: training.training_name
                        })
                        $scope.summaryTrainingListVisible = true
                    })
                }
                else {
                    $scope.summaryTrainingList = []
                    $scope.summaryTrainingListVisible = true
                    utilityService.showSimpleToast('No Trainings Found')
                }
                // console.log($scope.summaryTrainingList)
            })
        }


        getTrainingList();
        getPendingTrainingList($scope.requestStatus);
        getTrainingRequestList($scope.requester);
        var checkIfUniqueAttribute = function (list) {
            angular.forEach(list, function (value, key) {
                if (value.is_unique === true) {
                    $scope.isUniqueAttribute = true;
                }
            });
        };
        $scope.selectedTrainingFlag = true;
        $scope.getSelectedAttribute = function (item) {
            angular.forEach($scope.requestView.requestDetails.trainingValueList, function (value, key) {
                if (value._id == item) {
                    $scope.allAttribute = false;
                    $scope.selectedAttributeList = value;
                    $scope.selectedTrainingFlag = false;
                }
            });
        };
        $scope.checkAvailableQuantity = function (allotedQuantity, item) {
            $scope.allotedQuantity = null;
            if (allotedQuantity > item.available_quantity) {
                $scope.allotedQuantity = allotedQuantity;
                $('#alert-popup').appendTo("body").modal('show');
            }
        };
        $scope.updateTrainingInventory = function () {
            var url = LndManagerService.getUrl('updateExistStock') + "/" + $scope.selectedAttributeList._id,
                payload = {
                    training_type_id: $scope.selectedAttributeList.training_type_id,
                    quantity: parseInt($scope.allotedQuantity) - parseInt($scope.selectedAttributeList.available_quantity)
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    $scope.selectedAttributeList.available_quantity = data.data.available_quantity;
                    $('#alert-popup').modal('hide');
                });
        };
        $scope.getTrainingDetails = function (trainingId) {
            $scope.requestView.requestDetails.model.training_id = null;
            $scope.selectedTrainingFlag = false;
            $scope.getTrainingValueList(trainingId);
            angular.forEach($scope.requestView.requestDetails.trainingType, function (value, key) {
                if (value._id == trainingId) {
                    $scope.requestView.requestDetails.attributeEmpList = value.attributes;
                }
            });
        };
        $scope.getTrainingName = function (trainingId) {
            var trainingName = null;
            angular.forEach($scope.requestView.requestDetails.trainingType, function (value, key) {
                if (value._id == trainingId) {
                    trainingName = value.training_name;
                    $scope.requestView.requestDetails.attributeList = value.attributes;
                }
            });
            return trainingName;
        };
        $scope.enableSelect = function () {
            $scope.selectedTrainingFlag = true;
        };
        $scope.getAttributeValueList = function (attributeId, index) {
            $scope.selectedTrainingFlag = false;
            $scope.requestView.requestDetails.model.training_id = null;

            var trainingTypeId = angular.isDefined($scope.requestView.requestDetails.list.training_type_id)
                ? $scope.requestView.requestDetails.list.training_type_id
                : $scope.requestView.newRequest.trainingModel.training_type_id;
            var id = angular.isObject(attributeId) ? attributeId.$id : attributeId;

            serverUtilityService.getWebService(LndManagerService.getUrl('attributeList') + "/" + trainingTypeId + "/" + id)
                .then(function (data) {

                    $scope.trainingAttributeList[index].list = data.data;

                });
        };
        $scope.getTrainingValueList = function (trainingId) {
            $scope.allAttribute = true;
            var filters = {};
            angular.forEach($scope.trainingAttributeList, function (value, key) {
                filters[value.attribute_id] = value.attribute_value;
                if ($scope.filterFlag) {
                    filters['all_provisions'] = true;
                }
            });
            checkIfUniqueAttribute($scope.requestView.requestDetails.attributeList);
            trainingId = angular.isDefined(trainingId) ? trainingId : "57ff3f287d1341cc0900002f";
            var url = LndManagerService.getUrl('trainingValue') + "/" + trainingId,
                payload = {
                    filters: JSON.stringify(filters),
                    is_unique: $scope.isUniqueAttribute
                };

            serverUtilityService.getWebService(url, payload)
                .then(function (data) {
                    $scope.requestView.requestDetails.trainingValueList = data.data;

                });
        };
        $scope.removeSelectedTraining = function (trainingId) {
            $scope.trainingAttributeList = [{
                "attribute_id": null,
                "attribute_value": null,
                list: []
            }];
            $scope.getTrainingValueList(trainingId);
            $scope.selectedTrainingFlag = true;
            $scope.requestView.requestDetails.model.training_id = null;
        };
        $scope.getEmployeeListByTraining = function () {
            var selectedTrainings = [],
                trainingId = $scope.requestView.newRequest.trainingModel.training_type_id,
                url = LndManagerService.getUrl('employeeList') + "/" + trainingId,
                payload = {};

            angular.forEach($scope.requestView.requestDetails.trainingValueList, function (row, index) {
                if ($scope.requestView.newRequest.trainingModel.selectedAttributeId[index] === true) {
                    selectedTrainings.push(row._id);
                }
            });
            payload.training_ids = JSON.stringify(selectedTrainings);
            serverUtilityService.getWebService(url, payload)
                .then(function (data) {
                    $scope.requestView.requestDetails.trainingEmployeeList = data.data;
                });
        };
        var sycnNewRequestModel = function (model) {
            $scope.requestView.newRequest.model = LndManagerService.buildNewRequestModel(model);
        };
        var syncTrainingRequestModel = function (model) {
            $scope.requestView.newRequest.trainingModel = LndManagerService.buildTrainingNewRequestModel(model);
        };
        var sycnReturnRequestModel = function (model) {
            $scope.requestView.requestDetails.returnModal = LndManagerService.buildReturnRevokeModel(model);
        };
        var sycnAttributeRequestModel = function (model) {
            $scope.requestView.requestDetails.model = LndManagerService.buildAttributeRequestModel(model);
        };
        sycnNewRequestModel();
        syncTrainingRequestModel();
        sycnReturnRequestModel();
        sycnAttributeRequestModel();
        var setAdditionalKeys = function (data) {
            angular.forEach(data, function (value, key) {
                value.isSelected = false;
            });

            return data;
        };
        var getUnAssignedList = function (flag, trainingType) {
            trainingType = angular.isDefined(trainingType) ? trainingType : null;
            var url = flag ? LndManagerService.getUrl('employeeList') + "/" + trainingType
                : LndManagerService.getUrl('unassign');

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.requestView.newRequest.unAssignedList = setAdditionalKeys(data.data);
                });
        };
        getUnAssignedList($scope.employeeWiseFlag);
        $scope.getEmployeeTraining = function (trainingId, trainingType) {
            if (trainingType) {
                $scope.requestView.newRequest.assignedList = [];
                if (!trainingId) {
                    $scope.requestView.newRequest.model.request_type = null;
                    alert("Please select training first.")
                }
                if (trainingType != 1 && trainingId) {
                    $scope.employeeWiseFlag = true;
                    getUnAssignedList($scope.employeeWiseFlag, trainingId);
                }
                if (trainingType == 1) {
                    $scope.employeeWiseFlag = false;
                    getUnAssignedList($scope.employeeWiseFlag);
                }
            }
        };
        $scope.userClickHandler = function (item) {
            item.isSelected = item.isSelected ? false : true;
        };
        $scope.moveToList = function (popList, pushList, isAll) {
            var selectedIndexes = [];
            angular.forEach(popList, function (value, key) {
                if (value.isSelected || isAll) {
                    selectedIndexes.push(key);
                    value.isSelected = false;
                    pushList.push(value);
                }
            });
            for (var i = selectedIndexes.length - 1; i >= 0; i--) {
                popList.splice(selectedIndexes[i], 1);
            }
        };
        $scope.atLeastOneSelected = function (list) {
            var isSelected = false;
            angular.forEach(list, function (value, key) {
                isSelected = isSelected || value.isSelected;
            });

            return isSelected;
        };
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        $scope.raiseNewRequest = function () {
            resetErrorMessages();
            var url = LndManagerService.getUrl('addRequest'),
                payload = {};

            angular.copy($scope.requestView.newRequest.model, payload);
            payload.request_type = parseInt(payload.request_type);
            payload.employee_id = LndManagerService.buildAssignUserPayload($scope.requestView.newRequest.assignedList);
            payload.continue_request = false;
            serverUtilityService.postWebService(url, payload).then(function (data) {
                if (data.data.error) {
                    $scope.errorValue = null;
                    var nameList = [];
                    angular.forEach(data.data.error, function (value, key) {
                        angular.forEach($scope.employeeList, function (v, k) {
                            if (value == v._id.$id) {
                                nameList.push(v.full_name);
                            }
                        });
                    });
                    $scope.errorValue = nameList.toString();
                }
                successErrorCallback(data, $scope.requestView.requestDetails.list, "newRequest", true);
            });
        };
        $scope.requestTypeHash = {
            1: "Training Registration",
            2: "Change",
            3: "Return/Revoke"
        }

        $scope.alocateTraining = function (requestId) {
            $scope.errorMessages = [];
            var url = LndManagerService.getUrl('allocation') + "/" + requestId //$routeParams.requestId,
            var payload = $scope.requestActionPayload
            serverUtilityService.putWebService(url, payload)
                .then(
                    function (data) {

                        successErrorCallback(data, $scope.requestView.requestDetails.list, "group", false, null, true);
                        $scope.resetTrainingSummary()
                    }

                );
        };
        $scope.raiseProvisonWiseRequest = function () {
            resetErrorMessages();
            var url = LndManagerService.getUrl('addRequest'),
                payload = {};

            angular.copy($scope.requestView.newRequest.trainingModel, payload);
            payload.request_type = parseInt(payload.request_type);
            payload.employee_id = LndManagerService.buildRequestUserPayload($scope.requestView.requestDetails.trainingEmployeeList);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.requestView.requestDetails.list, "newRequest", true);
                });
        };
        $scope.raiseReturnRequest = function () {
            resetErrorMessages();
            var url = LndManagerService.getUrl('cancelRequest') + "/" + $routeParams.requestId,
                payload = {};

            angular.copy($scope.requestView.requestDetails.returnModal, payload);
            payload.request_type = $scope.requestView.requestDetails.returnValueList.request_type;
            payload.employee = $scope.requestView.requestDetails.returnValueList.employee_detail._id;
            angular.forEach($scope.requestView.requestDetails.returnValueList.alloted_trainings, function (value, key) {
                if ($scope.requestView.requestDetails.returnModal.training_id == value.training_id) {
                    payload.owned_quantity = value.quantity;
                }
            });
            payload.is_damaged = $scope.requestView.requestDetails.returnModal.is_damaged === "1" ? true : false;
            payload.quantity_returned = 1;
            payload.manager_remark = $scope.requestView.requestDetails.returnModal.manager_remark;
            if (payload.repair_cost_borne_by == 3) {
                payload.repair_cost_by_specific_emp = angular.isObject(self.pfSelectedItem._id) ? self.pfSelectedItem._id.$id : self.pfSelectedItem._id;
            }

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.requestView.requestDetails.list, "group", false, 'allocation');
                });
        };
        $scope.toggelRequest = function (frm) {
            $scope.errorMessages = [];
            resetRelFilter();
            sycnNewRequestModel();
            syncTrainingRequestModel();
            $scope.requestView.newRequest.assignedList = [];
            // This condition has been commented as we are already making a request on change request type
            // if ($scope.employeeWiseFlag) {
            //     getUnAssignedList($scope.employeeWiseFlag);
            // }            
            if (angular.isDefined(frm)) {
                utilityService.resetForm(frm);
            }
            //$('#raise-new-request-lnd').appendTo("body").modal('show');
            $scope.openModal('raise-new-request-lnd.tmpl.html', 'mngrLndRequest');
        };
        $scope.toggleNewTraining = function () {
            $('#add-stock').appendTo("body").modal('show');
        };
        $scope.toggelReturn = function (item) {
            $location.url('provision-return').search({
                'requestId': item._id
            });
        };
        $scope.editAllocationPlan = function (item) {
            $scope.requestActionId = item._id
            if (item.request_type == 3) {
                $location.url('/frontend/lnd-manager/lndRevoke').search({
                    'requestId': item._id,
                    'requestFor': $scope.requester
                });
            } else {
                var url = LndManagerService.getUrl('trainingValue') + "/" + item.training_type_id
                serverUtilityService.getWebService(url).then(
                    function (value_data) {
                        $scope.requestView.requestDetails.trainingValueList = value_data.data[0];
                        $scope.requestActionDetails = item
                        $scope.requestActionPayload = {
                            training_id: $scope.requestView.requestDetails.trainingValueList._id,
                            request_type: item.request_type,
                            employee: item.employee,
                            manager_remark: '',
                            is_unique: $scope.isUniqueAttribute,
                            quantity_allocated: 1
                        }
                        $scope.openModal('request-lnd-action.tmpl.html', 'requestLndAction')
                        $scope.allotPopupMessage = null
                        // console.log($scope.requestActionPayload)


                    }
                )



            }
        };
        $scope.navigateTo = function () {
            $location.url('/frontend/lnd-manager');
        };
        var successCallback = function (data, list, section, isAdded, returnTo, requestAction) {
            $('#deny-popup-lnd').modal('hide');
            if (!requestAction) {

                $('#raise-new-request-lnd').modal('hide');
                if (section === 'newRequest') {
                    $scope.closeModal('mngrLndRequest');
                    getTrainingRequestList($scope.requester);
                }
                $('#request-delete-alert').modal('hide');
            }
            else {
                console.log('Will close')
                $scope.closeModal('requestLndAction');
                getTrainingList()
            }
            utilityService.resetAPIError(false, null, section);
            if (angular.isDefined(data.data)) {
                utilityService.showSimpleToast(data.message);
                isAdded ? list.unshift(data.data) : utilityService.refreshList(list, data.data);
                getTrainingRequestList($scope.requester);
                if (returnTo == "allocation") {
                    $location.url('/frontend/lnd-manager').search({
                        'requestFor': $scope.requester
                    });
                }
                // $('#return-revoke').modal('hide');
            }
        };

        var errorCallbackOne = function (data, section) {
            if (data.status === "error") {
                $scope.errorMessages.push(data.message);
            } else {
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                    $('#training-employee-register-alert').modal('hide');
                });
            }
        };
        $scope.modifyDate = function (date) {
            var stamp = new Date(date).getTime()
            return utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A").split(' ')[0]
        }
        var errorCallback = function (data, section, newRequest) {
            if (newRequest) {

                if (data.data) {
                    $scope.errorMessages.push(data.data.message)

                }
                else {
                    $scope.errorMessages.push(data.message)

                }
            }
            if (data.status == "error") {

                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(data.message);

                if ((data.message instanceof Object) && data.message.quantity_allocated) {
                    $scope.allotPopupMessage = data.message.quantity_allocated[0]
                    utilityService.showSimpleToast(data.message.quantity_allocated[0])
                }
                else {
                    $scope.allotPopupMessage = data.message
                }
            } else if (data.data.status == 'error') {
                utilityService.resetAPIError(true, "something went wrong", section);
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            $scope.errorMessages.push(v);
                        });
                    });
                    if (data.data.message && data.data.message.quantity_allocated) {
                        $scope.allotPopupMessage = data.data.message.quantity_allocated[0]
                    }
                } else {
                    $scope.errorMessages.push(data.data.message);
                }
            }
        };
        var successErrorCallback = function (data, list, section, isAdded, returnTo, requestAction) {
            data.status === "success" ? successCallback(data, list, section, isAdded, returnTo, requestAction) : errorCallbackOne(data, section, section == 'newRequest');
        };


        $scope.alertData = {
            message: "Are You sure you want to cancel the request.",
            data: null,
            frmName: null
        };
        $scope.deleteAlert = function (item, form) {
            $scope.alertData = {
                message: "Are You sure you want to cancel the request.",
                data: item,
                frmName: form
            }
            $('#request-delete-alert').appendTo("body").modal('show');
        }
        $scope.handleDenyAction = function (item, form) {
            utilityService.resetForm(form);
            $scope.requestView.requestDetails.denyComment = null;
            $scope.requestView.requestDetails.denyItem = item;
            $('#deny-popup-lnd').appendTo('body').modal('show');
        };
        $scope.cancelRequest = function (item, action) {
            var url = LndManagerService.getUrl('cancelRequest') + "/" + item._id + "/" + 1,
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
        $scope.setReminder = function (item) {
            var url = LndManagerService.getUrl('setReminder'),
                payload = {
                    master_emp_id: item.logged_in_mgr_id,
                    slave_emp_id: item.employee,
                    reference_id: item._id,
                    request_id: item.request_id,
                    request_type: item.request_type,
                    training_name: $scope.getTrainingName(item.training_type_id),
                    employee_detail: item.employee_detail,
                    type: 8
                };

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.requestView.requestDetails.list, 'group', false);
                });
        };
        var getEmployeeDetails = function () {
            serverUtilityService.getWebService(LndManagerService.getUrl('getEmployee'))
                .then(function (data) {
                    $scope.employeeList = data.data;
                    $scope.requestView.newRequest.unAssignedList = setAdditionalKeys(utilityService.getValue(data, 'data', []));
                    self.repos = loadAll();
                });
        };
        getEmployeeDetails();

        /************ START SIGNATORY AUTOCOMPLETE ************/
        function selectedItemChange(item, model, key) {
            if (angular.isDefined(model[key]) && angular.isDefined(item) && item) {
                model[key] = LndManagerService.extractId(item._id);
            }
        }
        function querySearch(query) {
            return query ? self.repos.filter(createFilterFor(query)) : self.repos;
        }
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function loadAll() {
            var repos = $scope.employeeList;
            return repos.map(function (repo) {
                repo['full_name'] = angular.isDefined(repo.full_name) ? repo.full_name : null;
                repo.value = utilityService.getValue(repo, 'full_name') ? repo.full_name.toLowerCase() : null;
                return repo;
            });
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }
        /************ END SIGNATORY AUTOCOMPLETE ************/

        /************ Raise New Request Relevance Filter *****/
        $scope.includeRelFilter = {};
        $scope.allRelFilter = [];
        $scope.includeRelivanceFilter = function (element, slug, flag) {
            element.slug = slug;
            if (angular.isDefined(flag)) {
                element.isCheck = flag;
            }
            $scope.includeRelFilter[slug] = angular.isDefined($scope.includeRelFilter[slug]) && $scope.includeRelFilter[slug].length ? $scope.includeRelFilter[slug] : [];
            var i = $.inArray(element._id, $scope.includeRelFilter[slug]);
            var j = $.inArray(element, $scope.allRelFilter);
            if (i > -1) {
                $scope.includeRelFilter[slug].splice(i, 1);
            } else {
                $scope.includeRelFilter[slug].push(element._id);
            }

            if (j > -1) {
                $scope.allRelFilter.splice(j, 1);
            } else {
                $scope.allRelFilter.push(element);
            }
        };
        $scope.candidateRelFilter = function (candidate) {
            var flag = true;
            if (Object.keys($scope.includeRelFilter).length > 0) {
                angular.forEach($scope.includeRelFilter, function (value, key) {
                    if (angular.isDefined($scope.includeRelFilter[key]) && $scope.includeRelFilter[key].length > 0) {
                        if ($window._.intersection(candidate[key], $scope.includeRelFilter[key]).length == 0) flag = false; //return;
                    }
                });
                if (flag) {
                    return candidate;
                } else {
                    return;
                }
            } else {
                return candidate;
            }
        };
        var resetRelFilter = function () {
            angular.forEach($scope.groupList, function (value, key) {
                angular.forEach(value.element_details, function (v, k) {
                    if (v.isCheck) {
                        delete v.isCheck;
                    }
                });
            });
            $scope.includeRelFilter = {};
            $scope.allRelFilter = [];
        };
        $scope.clickOutSideClose = function (key) {
            $("._md-open-menu-container").removeClass('_md-clickable').addClass('_md-leave');
        };
        $scope.clickOutSideSelectClose = function () {
            $("._md-select-menu-container").hide();
        };
        var isBackTriggered = false,
            subtab = utilityService.getValue($routeParams, 'subtab');

        var handleBackFunctionality = function (accordion, tabname) {
            $scope.accordionTab[accordion].selected = $scope.accordionTab[accordion].tabs[subtab];
            $scope.setMainTab($scope.accordionTab[accordion].tabs[subtab] + 1);
            isBackTriggered = true;
        };
        if (utilityService.isSectionProvisionManager(subtab)) {
            handleBackFunctionality('provisionManager', subtab);
        }
        if (isBackTriggered) {
            $timeout(function () {
                $location.search("subtab", null);
            }, 1000);
        }
        $scope.getNumber = function (num) {
            return new Array(num);
        };
        $scope.totalLength = null;
        $scope.checkAttributeLength = function (attr, val) {
            var flag = false;
            if (angular.isDefined(attr) && angular.isDefined(val) && !angular.equals({}, val)) {
                var valueLength = Object.keys(val.attributes).length;
                if (attr.length > valueLength) {
                    $scope.totalLength = parseInt(attr.length) - parseInt(valueLength);
                    flag = true;
                }
                return flag;
            }
        };
        $scope.report = {
            list: [],
            content: [],
            listWithoutHeader: []
        };
        $scope.exportToCsv = function (item) {
            var attrList = new Array("Employee Details", "Employee ID", "Employee Status");

            attrList.push("Training Request", "Request Type", "Request Date", "Category");
            console.log(attrList)
            $scope.report = {
                content: new Array(attrList),
            };
            angular.forEach($scope.requestView.requestDetails.list, function (value, key) {
                var array = new Array();
                array.push(value.employee_detail.full_name ? value.employee_detail.full_name : "");
                array.push(value.employee_detail.emp_code ? value.employee_detail.emp_code : "");
                array.push($scope.employeeStatus[value.employee_detail.emp_status] ? $scope.employeeStatus[value.employee_detail.emp_status] : "");
                array.push($scope.getTrainingName(value.training_type_id) ? $scope.getTrainingName(value.training_type_id) : "");
                array.push($scope.requestView.requestDetails.requestType[value.request_type] ? $scope.requestView.requestDetails.requestType[value.request_type] : "");
                array.push(value.created_at ? value.created_at : "");
                array.push($scope.requester == 1 ? "By Me" : "For Me");
                $scope.report.content.push(array);
            });
            var reportName = "Request View.csv";
            if ($scope.report.content.length > 1) {
                setTimeout(function () {
                    utilityService.exportToCsv($scope.report.content, reportName);
                }, 500);
            }
        };
        var allFilterRequestByObject = [{ countObject: 'rest', collection: [], isArray: false, key: 'training_type_id' }];
        var allFilterRequestForObject = [{ countObject: 'restFor', collection: [], isArray: false, key: 'training_type_id' }];

        $scope.$watch('requestView.pending.byFilteredList', function (newVal, oldVal) {
            var obj = createSummarryList(newVal);
            $scope.requestView.pending.byVisible = false;
            if (newVal != oldVal) {
                $scope.calculateFacadeCountOfAllFilters(newVal, allFilterRequestByObject);
            }
            if ($scope.requestView.pending.byList.length == newVal.length) {
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
            }
            $timeout(function () {
                $scope.requestView.pending.byCategory = obj.category;
                $scope.requestView.pending.byGraphData = createGraphList(newVal);
                $scope.requestView.pending.byVisible = true;
            }, 500);
        }, true);

        $scope.$watch('requestView.pending.forFilteredList', function (newVal, oldVal) {
            var obj = createSummarryList(newVal);
            $scope.requestView.pending.forVisible = false;
            if (newVal != oldVal) {
                $scope.calculateFacadeCountOfAllFilters(newVal, allFilterRequestForObject);
            }
            if ($scope.requestView.pending.forList.length == newVal.length) {
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
            }
            $timeout(function () {
                $scope.requestView.pending.forCategory = obj.category;
                $scope.requestView.pending.forGraphData = createGraphList(newVal);
                $scope.requestView.pending.forVisible = true;
            }, 500);
        }, true);

        var allFilterObject = [{ countObject: 'group', isGroup: true, collection_key: 'employee_detail' },
        { countObject: 'status', collection: [], isArray: false, key: 'request_status' },
        { countObject: 'type', collection: [], isArray: false, key: 'training_type_id' }];
        $scope.$watch('requestView.requestDetails.filteredList', function (newVal, oldVal) {
            if (newVal != oldVal) {
                $scope.calculateFacadeCountOfAllFilters(newVal, allFilterObject);
            }
            if ($scope.requestView.requestDetails.list.length == newVal.length) {
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
            }
        }, true);
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        $scope.getFlag = function (type) {
            $scope.filterFlag = type == 2 ? true : false;
        };

        /********* Start Angular Modal Section *********/
        $scope.openModal = function (template, keyName) {
            $scope.modalInstance[keyName] = $modal.open({
                templateUrl: template,
                scope: $scope,
                size: 'lg',
                windowClass: 'fadeEffect',
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function (keyName) {
            $scope.modalInstance[keyName].dismiss();
        };
        /********* End Angular Modal Section *********/

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

    }
]);