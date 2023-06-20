app.controller('TravelController', [
    '$scope', '$timeout', '$q', '$routeParams', '$location', '$window','travelService', 'utilityService', 'ServerUtilityService', 'FORM_BUILDER',
    function($scope, $timeout, $q, $routeParams, $location, $window, travelService, utilityService, serverUtilityService, FORM_BUILDER) {
        
        var self = this;

        self.simulateQuery = false;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;
        self.querySearchChips = querySearchChips;
        self.filterSelected = true;
        self.querySearchPostChips = querySearchPostChips;
        self.filterPostSelected = true;

        $scope.buildTravelObj = travelService.buildTravelModelObject();
        $scope.requestId = utilityService.getValue($routeParams, 'requestId');
        $scope.requestFor = utilityService.getValue($routeParams, 'requestFor');
        $scope.updateRequestFlag = false;
        $scope.delegetFlag = false;
        $scope.loaderFlag = false;
        $scope.individualLoaderFlag = false;
        $scope.totalAmount = 0;
        $scope.setTab = 1;
        $scope.otherCityObj = {};
        $scope.filterList = {
            list:[]
        };
        $scope.minDate = new Date();
        $scope.selectedUserView = travelService.buildUserViewObj($scope.user,'delegate');
        $scope.questionList = [];
        $scope.questionTypeConstant = FORM_BUILDER.questionType;

        var resetErrorMessages = function() {
            $scope.errorMessages = [];
        }; 
        var getPolicyRule = function() {
            serverUtilityService.getWebService(travelService.getUrl('policyRule') + "/" + $scope.user.travelPolicy)
            .then(function(data) {
                $scope.policyRule = data.data;
            });
        };
        getPolicyRule();  
        var getCurrency = function () {
            var url = travelService.getUrl('currency');
            serverUtilityService.getWebService(url)
            .then(function (data) {
                $scope.currencyList = data;
            });
        };
        if ($scope.requestFor ) {
            getCurrency();
        }
        var successCallback = function(data, list, section, isAdded, type) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            if (angular.isDefined(data.data)) {
                isAdded ? list.unshift(data.data) : utilityService.refreshList(list, data.data);
            }
            if (section === 'travel') {
                getAllrequest();
            }
        };
        var errorCallback = function(data, section) {
            if (data.status == "error") {
                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(data.message);
            } else if (data.data.status == 'error') {
                utilityService.resetAPIError(true, "something went wrong", section);
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function(value, key) {
                        angular.forEach(value, function(v, k) {
                            $scope.errorMessages.push(v);
                        });
                    });
                } else {
                    $scope.errorMessages.push(data.data.message);
                }
            }
        };
        var successErrorCallback = function(data, list, section, isAdded, type) {
            data.status === "success" ? successCallback(data, list, section, isAdded, type) : errorCallback(data, section);
        };
        $scope.reSetTab = function(type) {
            $scope.setTab = type;
        };
        $scope.employeeId = $scope.requestFor ? $scope.requestFor : $scope.user.loginEmpId;
        $scope.addEditTravelRequest = function(type, item) {
            if (type == 'add') {
                var viewPath = 'travel-request?requestFor=' + $scope.selectedUserView._id,
                    currentPath = window.location.href.substr(0, window.location.href.indexOf('#') + 1),
                    fullPath = currentPath + viewPath;

                $window.open(fullPath, '_blank');
                //$location.url('/travel-request').search({'requestFor': $scope.selectedUserView._id});
            }
            if (type == 'edit') {
                var viewPath = 'travel-request?requestId=' + item._id + '&requestFor=' + $scope.selectedUserView._id,
                    currentPath = window.location.href.substr(0, window.location.href.indexOf('#') + 1),
                    fullPath = currentPath + viewPath;

                $window.open(fullPath, '_blank');
                /*$location.url('/travel-request').search({
                    'requestId': item._id,
                    'requestFor': $scope.selectedUserView._id
                });*/
            }
        };
        $scope.getTotalAmount = function(list) {
            var totalAmount = 0;
            angular.forEach(list,function(value,key) {
                totalAmount = parseInt(totalAmount) + parseInt(value.claim_details[0].total_amount);
            });

            return totalAmount;
        };
        $scope.updateUserView = function(item) {
            $scope.selectedUserView = travelService.buildUserViewObj(item,'employee');
        };
        var getApproverChainList = function(travelType, empId, isTravelTypeChanged){
            var url = travelService.getUrl('approvers') + "/" + travelType + "/" + empId;
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.buildTravelObj.travel.approverChain = data.data;
                    if(!$scope.requestId || isTravelTypeChanged) {
                        $scope.questionList = utilityService.getInnerValue(data, 'question_details', 'questions', []);
                    }
                });
        };
        var sycnRequestModel = function(model) {
            $scope.buildTravelObj.travel.model = travelService.buildTravelModel(model);
            //console.log($scope.buildTravelObj.travel.model)
            getApproverChainList($scope.buildTravelObj.travel.model.travel_type, $scope.employeeId);
        };
        if($scope.requestFor){
            sycnRequestModel();
        }
        var isRequestForAll = function() {
            return $scope.buildTravelObj.travel.model.requestType == 0;
        };        
        var getCityDetails = function() {
            serverUtilityService.getWebService(travelService.getUrl('city'))
                .then(function(data) {
                    $scope.buildTravelObj.travel.city = data.data;
                    if(data.data.length){
                        $scope.otherCityObj = data.data.find(function (city){
                            return city.code == 'OTH' && city.domestic;
                        });
                        //console.log($scope.otherCityObj, 'other');
                        getTravelSettings();
                        if(utilityService.getValue($routeParams, 'requestId')) {
                            getIndividualRequest($routeParams.requestId, 'edit');
                        }else {
                            $scope.individualLoaderFlag = true;
                        }
                    }
                });
        };
        getCityDetails();
        var getAllrequest = function() {
            serverUtilityService.getWebService(travelService.getUrl('requestDetails'))
                .then(function(data) {
                    $scope.loaderFlag = true;
                    $scope.buildTravelObj.travel.list = travelService.buildRequestDetails(data.data,$scope.buildTravelObj.travel); 
                    if(!utilityService.getValue($routeParams, 'requestFor')) {
                        $scope.updatePaginationSettings('travel');
                    }          
                });
        };
        var getTravelSettings = function() {
            serverUtilityService.getWebService(travelService.getUrl('travelSetting'))
                .then(function(data) {
                    $scope.buildTravelObj.travel.setting = data.data;
                    if(!utilityService.getValue($routeParams, 'requestId')) {
                        getAllrequest();
                    }
                });
        };
        var buildAssignEmployeeObject = function(list) {
            list.push($scope.selectedUserView);
            return list;
        };
        var getAllDetails = function() {
            var urlArray = [serverUtilityService.getWebService(travelService.getUrl('delegatesEmployee'))];
             if ($scope.requestFor){
                 urlArray.push( serverUtilityService.getWebService(travelService.getUrl('categories')));
             }
            $q.all(urlArray).then(function(data) {
                $scope.buildTravelObj.travel.delegateEmployee.list = buildAssignEmployeeObject(data[0].data);
                if ($scope.requestFor) {
                    $scope.buildTravelObj.travel.categoryType = data[1].data;
                }
            });
        };
        getAllDetails();
        $scope.getTravelType = function(categoryId) {
            var name = null;
            angular.forEach($scope.buildTravelObj.travel.categoryType,function(value,key) {
                if (value._id == categoryId) {
                    name = value.name;
                }
            });

            return name;
        };
        $scope.createScratchTemp = function(){
            sycnRequestModel();
            $scope.buildTravelObj.travel.travelDetails = travelService.buildDefaultTravelDetailList();
        }        
        var getIndividualRequest = function(requestId,type,templateType) {
            var url = travelService.getUrl('tripRequest') + "/" + requestId;
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.individualLoaderFlag = true;
                    $scope.buildTravelObj.travel.list = data.data;
                    if (requestId) {
                        $scope.updateRequestFlag = type == 'edit' ? true : false;
                        sycnRequestModel(data.data);
                        $scope.buildTravelObj.travel.model.template = templateType;
                        $scope.buildTravelObj.travel.model.co_travellers = travelService.addNameInSpecificKey(data.data.co_travellers);
                        $scope.buildTravelObj.travel.model.also_notify_employee = travelService.addNameInSpecificKey(data.data.also_notify_employee);
                        $scope.buildTravelObj.travel.travelDetails = travelService.buildTravelDetailPayload(data.data.travel_details,data.data,$scope.buildTravelObj.travel);
                        $scope.buildTravelObj.travel.expenseDetails = data.data.category_setting_details;
                        $scope.buildTravelObj.travel.approverList = data.data.approval_chain;
                        $scope.questionList = travelService.buildQuestionList(utilityService.getInnerValue(data, 'question_details', 'questions', []));
                    }
                });
        };
        /*var getRequestByType = function() {
            utilityService.getValue($routeParams, 'requestId')
                ? getIndividualRequest($routeParams.requestId, 'edit') : getAllrequest();
        };
        getRequestByType();*/
        var getDelegateDetails = function() {
            serverUtilityService.getWebService(travelService.getUrl('delegate'))
                .then(function(data) {
                    $scope.buildTravelObj.travel.delegate = data.data;
                    if (angular.isObject($scope.buildTravelObj.travel.delegate) 
                        && $scope.buildTravelObj.travel.delegate.delegate_details.length) {
                        $scope.delegetFlag = true;
                        changeDelegate($scope.buildTravelObj.travel.delegate);
                    }
                });
        };
        getDelegateDetails();
        var buildCityDetailObject = function(value,name,item,type) {
            var cityName = value.city_name.toLowerCase();
            name = name.toLowerCase();
            if (cityName.indexOf(name) !== -1) {
                    if (type == 'fromCity') {
                        item.fromCity.push(value);
                    }
                    if (type == 'toCity') {
                        item.toCity.push(value);
                    }
            }
        };
        $scope.cityDetails = function(name, item, type, travelType, func, event) {
            item.fromCity = [];
            item.toCity = [];
            if(angular.isUndefined(name)) {
                return false;
            }
            if(name.length < 2){
                $("._md-open-menu-container").removeClass('_md-clickable').addClass('_md-leave');
            }
            if (type == 'fromCity' && name.length < 3) {
                item.source_city = null;
                item.fromCity = [];
            }
            if (type == 'toCity' && name.length < 3) {
                item.destination_city = null;
                item.toCity = [];
            }
            if (name.length > 2) {
                item.errorFlag = false;
                $timeout(function() {
                    func(event);
                }, 100);
                if (travelType == 1) {
                    angular.forEach($scope.buildTravelObj.travel.city, function(value, key) {
                        if (value.domestic) {
                            buildCityDetailObject(value,name,item,type);
                        }

                    });
                }
                else {
                    angular.forEach($scope.buildTravelObj.travel.city, function(value, key) {
                        buildCityDetailObject(value,name,item,type);
                    });
                }
            }
        };
        $scope.removeCity = function(item,type) {
            if (type == 'fromCity') {
                item.pickUpCity = null;
                item.source_city = null;
                item.fromCountrycode = null;
            }
            if (type == 'toCity') {
                item.dropUpCity = null;
                item.destination_city = null;
                item.toCountrycode = null;
            }
        };
        /*$scope.daysBetween = function(date1,date2){
            console.log(date1,date2);
            var oneDay = 1000 * 60 * 60 * 24;
                date1 = new Date(date1);
                date2 = new Date(date2);
                date1 = date1.getTime();
                date2 = date2.getTime();
            var diff = Math.abs(date2 - date1);
            var total = Math.round(diff/oneDay);
            console.log(total);
        };*/
        $scope.remove = function(index,item){
            item.splice(index, 1);
        };        
        $scope.setValue = function(selectedValue, item, type, travelType) {
            if (type == 'fromCity') {
                item.source_city = selectedValue._id;
                item.pickUpCity = selectedValue.city_name + " (" + selectedValue.code + ")" ;
                item.fromInternational = selectedValue.domestic ? false : true;
                item.fromCountry = selectedValue.country;
                item.fromCountrycode = selectedValue.code;
                if(!item.fromInternational && !item.toInternational && item.destination_city && travelType == 2 && (item.fromCountry == item.toCountry)){
                    item.errorFlag = true;
                    item.source_city = null;
                    item.pickUpCity = null;
                }
            }
            if (type == 'toCity') {
                item.destination_city = selectedValue._id;
                item.dropUpCity = selectedValue.city_name + " (" + selectedValue.code + ")";
                item.toCountry = selectedValue.country;
                item.toCountrycode = selectedValue.code;
                item.toInternational = selectedValue.domestic ? false : true;
                if(!item.fromInternational && !item.toInternational && item.source_city && travelType == 2 && (item.toCountry == item.fromCountry)){
                    item.errorFlag = true;
                    item.destination_city = null;
                    item.dropUpCity = null;
                }
            }
        };
        $scope.setTravelType = function(type, model) {
            model.travel_type = type;
            $scope.buildTravelObj.travel.travelDetails = travelService.buildDefaultTravelDetailList();
            getApproverChainList(type, $scope.employeeId, true);
        };
        $scope.setTripType = function(type, model) {
            if (type != 3) {
                $scope.buildTravelObj.travel.travelDetails = travelService.buildDefaultTravelDetailList();
            }
            model.trip_type = type;
        };
        $scope.assignDelegate = function() {
            resetErrorMessages();
            var url = travelService.getUrl('delegate'),
                payload = {
                    delegate_id: $scope.fileOwner.ownerId
                };

            serverUtilityService.postWebService(url, payload).then(function(data) {
                if (data.status === "success") {
                    utilityService.showSimpleToast(data.message);
                    getDelegateDetails();
                } else {
                    console.log("need to handle error for assign delegate");
                }
            });
        };
        $scope.updateDelegate = function(delegateId) {
            resetErrorMessages();
            var url = travelService.getUrl('delegate') + "/" + delegateId,
                payload = {
                    delegate_id: $scope.fileOwner.ownerId
                };

            serverUtilityService.putWebService(url, payload).then(function(data) {
                if (data.status === "success") {
                    utilityService.showSimpleToast(data.message);
                    getDelegateDetails();
                } else {
                    console.log("need to handle error for update delegate");
                }
            });
        };
        var deleteDelegateCallback = function(list, data) {
            list.delegate_details = utilityService.deleteCallback(data, list.delegate_details[0], list.delegate_details);
            if (data.status === "success") {
                $scope.delegetFlag = false;
                self.selectedItem = [];
                $scope.fileOwner = {
                    ownerId: null,
                    ownerDetails: null
                };
                //self.isDisabled = true;
                utilityService.showSimpleToast(data.message);
            }
        };
        $scope.deleteDelegate = function(list) {
            var url = travelService.getUrl('delegate') + "/" + list.id;
            serverUtilityService.deleteWebService(url).then(function(data) {
                deleteDelegateCallback(list, data);
            });
        };
        $scope.addMoreTrip = function(minDateValue) {
            $scope.buildTravelObj.travel.travelDetails.push(travelService.buildDefaultTravelDetailObject(minDateValue));
        };
        $scope.addTripRequest = function(userID) {
            resetErrorMessages();
            var payload = travelService.buildRequestPayload(userID, $scope.buildTravelObj.travel.model, $scope.buildTravelObj.travel.travelDetails);
            payload = travelService.addQuestionsInPayload(payload, $scope.questionList);
            serverUtilityService.postWebService(travelService.getUrl('tripRequest'), payload).then(function(data) {
                if (data.status === "success") {
                    $scope.setTab = 2;
                    $scope.buildTravelObj.travel.expenseDetails = data.data.category_setting_details;
                    getApproverChainList(data.data.travel_type, $scope.employeeId);
                }
                successErrorCallback(data, $scope.buildTravelObj.travel.list, "travel", true);
            });
        };
        $scope.updateTripRequest = function(userID,policyDetails) {
            resetErrorMessages();
            var url = travelService.getUrl('tripRequest') + "/" + $routeParams.requestId,
                payload = travelService.buildRequestPayload(userID, $scope.buildTravelObj.travel.model, $scope.buildTravelObj.travel.travelDetails, $scope.updateRequestFlag);
                payload = travelService.addQuestionsInPayload(payload, $scope.questionList);
            serverUtilityService.putWebService(url, payload).then(function(data) {
                if (data.status === "success") {
                    $scope.setTab = 2;
                    $scope.buildTravelObj.travel.expenseDetails = policyDetails;
                }
                successErrorCallback(data, $scope.buildTravelObj.travel.list, "travel");
            });
        };
        $scope.deleteRequest = function(item) {
            var url = travelService.getUrl('tripRequest') + "/" + item._id;
            serverUtilityService.patchWebService(url).then(function(data) {
                //$scope.buildTravelObj.travel.list = utilityService.deleteCallback(data, item, $scope.buildTravelObj.travel.list);
                /*if (data.status === "success") {
                    //utilityService.showSimpleToast(data.message);
                }*/
                successErrorCallback(data, $scope.buildTravelObj.travel.list, "travel");
            });
        };
        var changeDelegate = function(list) {
            self.selectedItem = {
                _id: angular.isObject(list.delegate_details[0]._id) ? list.delegate_details[0]._id.$id : list.delegate_details[0]._id,
                full_name: utilityService.getValue(list.delegate_details[0], 'full_name'),
            }
            $scope.fileOwner = {
                ownerId: list.delegate_details[0]._id,
                ownerDetails: list.delegate_details[0]
            };
            self.isDisabled = false;
        };
        $scope.filterByStatus = function(item) {
            if($scope.selectedUserView._id == item.emp_id 
                && item.status == $scope.buildTravelObj.travel.model.requestType 
                    || $scope.selectedUserView._id == item.emp_id 
                && isRequestForAll()){
                return item;
            }
        };
        $scope.sendReminder = function (item, approver, type){
            var url = travelService.getUrl('reminder'),
                    payload = travelService.buildReminderPayload(item, approver, type);
            payload.request_id = item._id;
            serverUtilityService.postWebService(url, payload)
                    .then(function (data){
                        if(data.status == 'success'){
                            utilityService.showSimpleToast(data.message);
                        }
                    });
        };
        $scope.viewEmployeeProfile = function(profileId) {
            $location.url("dashboard/profile/" + profileId);
        };
        $scope.getExistingTemplate = function(requestId,type,templateType) {
            getIndividualRequest(requestId,type,templateType);
        };
        $scope.closeTravelDetail = function() {
            $location.url('dashboard/travel-expense');
        };
        $scope.checkDate = function(fromDate,toDate, item) {
            if (toDate) {
                var startTime = new Date(fromDate),
                    endTime = new Date(toDate);
                    if (startTime > endTime) {
                        item.return_date = null;
                    }
            }
        };
        $scope.changeDepartureDate = function (item, buildTravelObj) {
            if (buildTravelObj.travel.model.trip_type == 2) {
                var numberOfDays = 2,
                    departTimeStmp = item.requested_departure_date.getTime(),
                    returnTimeStmp = utilityService.getValue(item, 'return_date') ? item.return_date.getTime() : 0;

                if (departTimeStmp >= returnTimeStmp) {
                    item.return_date = new Date(new Date(item.requested_departure_date).setDate(item.requested_departure_date.getDate() + numberOfDays));
                }                
            }
        };

        /******************** Code For Autocomplete ******************/
        var getEmployeeList = function(item) {
            serverUtilityService.getWebService(travelService.getUrl('employee')).then(function(data) {
                $scope.employeeList = data.data;                
                self.repos = loadAll($scope.employeeList);
                self.allEmployeesList = loadChipList(data.data);
            });
        };
        getEmployeeList();
        var getCoTravelers = function() {
            var url = travelService.getUrl('cotravellers');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.cotravellersList = data.data;
                self.allEmployees = loadChipList(data.data);
                //self.repos = loadAll($scope.employeeList);
            });
        };
        if ($location.path() == '/travel-request') {
            getCoTravelers();
        }
        function querySearch(query) {
            return query ? self.repos.filter(createFilterForPoc(query)) : [];
        };
        function searchTextChange(text) {
            $scope.fileOwner = {
                ownerDetails: null,
                ownerId: null,
                isChecked: false
            };
        };
        function selectedItemChange(item) {
            if (angular.isDefined(item) && item) {
                $scope.fileOwner.ownerId = angular.isObject(item._id) ? item._id.$id : item._id;
                $scope.fileOwner.ownerDetails = item;
            }
        };
        function loadAll(list) {
            var repos = list;
            return repos.map(function(repo) {
                if(repo._id != $scope.user.loginEmpId) {
                    repo.value = repo.full_name ? repo.full_name.toLowerCase() : "";
                    return repo;
                }           
            });
        };
        function createFilterForPoc(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item && angular.isDefined(item.value) 
                    && item.value.indexOf(lowercaseQuery) === 0);
            };
        };
        
        /****************** CHIPS SECTION START*************************/
        function querySearchChips(keyword) {
            return keyword ? self.allEmployees.filter(createFilterForFn(keyword)) : [];
        };
        function createFilterForFn(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(approver) {
                return (approver._lowername.indexOf(lowercaseQuery) != -1);
            };
        };
        function querySearchPostChips(keyword) {
            return keyword ? self.allEmployeesList.filter(createFilterForEmp(keyword)) : [];
        };
        function createFilterForEmp(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterEmp(approver) {
                return (approver._lowername.indexOf(lowercaseQuery) != -1);
            };
        };
        function loadChipList(list) {
            return list.map(function(c, index) {
                var object = {
                    id: angular.isObject(c._id) ? c._id.$id : c._id,
                    name: c.full_name ? c.full_name : "",
                    email: c.email,
                    display: c.display_detail,
                    image: angular.isDefined(c.profile_pic) ? c.profile_pic : 'images/no-avatar.png'
                };
                object._lowername = object.name.toLowerCase();
                return object;
            });
        }
    }
]);