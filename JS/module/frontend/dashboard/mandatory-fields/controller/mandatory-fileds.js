app.controller('MandatoryFiledController', [
	'$scope', '$timeout', '$routeParams', '$location', '$mdSidenav', '$window', 'utilityService', 'ServerUtilityService', 'MandatoryFiledService', 'FORM_BUILDER', 'CandidatePortalService',
	function ($scope, $timeout, $routeParams, $location, $mdSidenav, $window, utilityService, serverUtilityService, MandatoryFiledService,FORM_BUILDER, CandidatePortalService) {

        $scope.tab = 0;
        $scope.segmentFieldJson = [];
        $scope.minimumRepeatValue = {};
        $scope.isEditable = false;
        $scope.errorMessages = [];
        $scope.todaysDate = new Date();
        $scope.pattern = {
            email: /^[a-zA-Z0-9-]+[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.-]{2,20}$/,
            alphaNumeric: /^[0-9a-zA-Z \b]+$/
        };
         var self = this;
          self.simulateQuery = false;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;
        self.contacts = [];
        self.value = {};
        self.querySearchChips = querySearchChips;
         
         var reportingManagerCallback = function (data) {
            var array = [];
            angular.forEach(data.data, function (c, key) {
                if (c.full_name) {
                    array.push({
                        id: angular.isObject(c._id) ? c._id.$id : c._id,
                        name: c.full_name,
                        email: c.email,
                        image: angular.isDefined(c.employee_preview.profile_pic) ? c.employee_preview.profile_pic : 'images/user-icon.png'
                    });
                }
            });
            self.reportingEmp = array;
        };
        var segmentFiledSyncRapper = function (v, k) {
            if (v.field_type != 14) {
                if (v.format_type == 1 || v.field_type == 10 || v.field_type == 12 && v.value) {
                    v.value = v.value.toString();
                } else if (v.field_type == 5 && v.value != "") {
                    v.value = utilityService.getDefaultDate(v.value);
                } else if (v.field_type == 13) {
                    if (angular.isDefined(v.validator) && v.validator.is_multi_select == '1') {
                        self.value[v.slug] = [];
                        angular.forEach(self.reportingEmp, function (val, ke) {
                            angular.forEach(v.value, function (id, index) {
                                if (id == val.id) {
                                    self.value[v.slug].push(val);
                                }
                            });
                        });
                    } else if (angular.isDefined(v.validator) && v.validator.is_multi_select == '0') {
                        angular.forEach(self.reportingEmp, function (val, ke) {
                            if (v.value[0] == val.id) {
                                val.full_name = val.name;
                                val._id = val.id;
                                v.value = val;
                            }
                        });
                        if (!v.value.length && !angular.isObject(v.value)) {
                            v.value = null;
                            self[v.slug] = '';
                        }
                    }
                } else if (v.field_type == 6) {
                    v.value = new Date(def + " " + v.value);
                } else if (v.field_type == 11) {
                    angular.forEach(v.element_details, function (v11, k11) {
                        v11.isChecked = v.value.indexOf(v11._id) == -1 ? false : true;
                    });
                }
            }
        };
        
            
            var arrangeChildData = function (item){
                var childDetails = item.child_detail, count=0;
                for(var i= 0; i < item.child_detail.length; i++){
                    if(item.value_on_set.indexOf(i) > -1){
                        count += 1;
                    }else{
                        var removalItem = item.child_detail[i];
                        item.child_detail.splice(i, 1);
                        item.child_detail.push(removalItem);
                    }
                    if(count == item.value_on_set.length){
                        break;
                    }
                }
            }
        var segmentFieldCallback = function (allData, permission) {
            angular.forEach(allData, function (data, alk) {
//                var isViewable = false;
                angular.forEach(data.emp_visible_mandatory_profile_field, function (v, k) {
//                    if (permission.indexOf('can_edit_' + v.slug) > -1) {
//                        isViewable = true;
                        if (v.field_type == 14 && angular.isDefined(v.child_details) && v.child_details.length) {
                            angular.forEach(v.child_details, function (value, key) {
                                if (!v.is_repeatable) {
                                    if (value.field_type == 14) {
                                        angular.forEach(value.child_detail, function (value2, key2) {
                                            segmentFiledSyncRapper(value2, key2)
                                        });
                                    } else {
                                        segmentFiledSyncRapper(value, key);
                                    }
                                } else {
                                    v.maxShowFirstTime = v.min_repeat;
                                    $scope.minimumRepeatValue[v.slug] = parseInt(v.min_repeat);
                                    angular.forEach(value, function (vr, kr) {
                                        segmentFiledSyncRapper(vr, kr);
                                    });
                                }
                            });
                            if (v.is_repeatable && v.value_on_set.length) {
                                arrangeChildData(v);
                            }
                        } else {
                            segmentFiledSyncRapper(v, k);
                        }
                });
            });
            $scope.segmentFieldJson = allData;
        };
        
        $scope.addMoreFieldSet = function (item){
            item.maxShowFirstTime = parseInt(item.maxShowFirstTime) + 1;
        };
        
        var resetRepeateChild = function (item, removedItem, index) {
            angular.forEach(removedItem, function (v, k) {
                v.value = '';
                if (v.field_type == 11) {
                    angular.forEach(v.element_details, function (v11, k11) {
                        v11.isChecked = false;
                    });
                }
                if (v.field_type == 13) {
                    if (angular.isDefined(v.validator) && v.validator.is_multi_select == '1') {
                        self.value[v.slug] = [];
                    }
                    if (angular.isDefined(v.validator) && v.validator.is_multi_select == '0') {
                        v.value = null;
                        self[v.slug] = '';
                    }
                }
            });
            item.child_details.splice(index, 1);
            item.child_details.push(removedItem);
            console.log(item.maxShowFirstTime);
            
            if (item.min_repeat == 0) {
                item.maxShowFirstTime = item.maxShowFirstTime > 1 ? item.maxShowFirstTime : 0;
            }
            if (item.maxShowFirstTime > 1) {
                item.maxShowFirstTime = item.maxShowFirstTime - 1;
            }
        };
        
        $scope.removeFieldSet = function (item, repeatElement, index) {
            var removedItem = repeatElement;
            var payload = MandatoryFiledService.buildRemoveRepeateChildPayload(removedItem, item, index)
            if (payload.isRemoveByDB) {
                var url = MandatoryFiledService.getUrl('removeRepeatedFiledset') + "/" + $scope.userId,
                        payloadFinal = {
                            unset_data: payload.removedItemSulgs
                        };
                serverUtilityService.putWebService(url, payloadFinal)
                        .then(function (data) {
                            if (data.status == 'success') {
                                utilityService.showSimpleToast(data.message);
                                resetRepeateChild(item, removedItem, index);
                            }
                        });
            } else {
                //utilityService.showSimpleToast('data removed successfully')
                resetRepeateChild(item, removedItem, index);
            }
        }
         
         var getSegmentData = function (){
             var url = MandatoryFiledService.getUrl('segment') ;
            serverUtilityService.getWebService(url)
                    .then(function (data){
                        segmentFieldCallback(data.data.field_Detail, data.data.permission);
                    });
         }
         getSegmentData();
         
         $scope.setChild = function (item) {
            $scope.childElements = item;
        };
        
        var successCallback = function (data, section, isAdded) {
            $scope.errorMessages = [];
                utilityService.showSimpleToast(data.message);
                utilityService.removeStorageValue('isMandatoryFieldRequired');
                $location.url('dashboard/home');
        };
        var errorCallback = function (data, section) {
            $scope.errorMessages = [];
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            } else {
                $scope.errorMessages = [];
                utilityService.resetAPIError(true, "", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        var successErrorCallback = function (data, section, isAdded) {
            data.status === "success" ?
                successCallback(data, section, isAdded) : errorCallback(data, section);
        };
        
        $scope.editProfileBySegmentFields = function () {
            $scope.errorMessages = [];
            var url = MandatoryFiledService.getUrl('segment');
            var payload = MandatoryFiledService.buildDynamicPayloadForSetupField($scope.segmentFieldJson, self, $scope.minimumRepeatValue);
            if (payload['errorMessages'].length) {
                $scope.errorMessages = payload['errorMessages'];
                return false;
            } else {
                delete payload['errorMessages'];
            }
            serverUtilityService.putWebService(url, payload)
                    .then(function (data) {
                        successErrorCallback(data, "saveSetupFields", true);
                    });
        };
        
        
        /******************CHIPS SECTION START*************************/
        var getALlActiveEmp = function () {
            var url = MandatoryFiledService.getUrl('allUser');
            serverUtilityService.getWebService(url)
                    .then(function (data){
                        self.allSignAuth = loadAll(data.data);
                        self.allEmployees = loadChipList(data.data);
                    });
        };
        getALlActiveEmp();
        
        /*********** START CHIPS INTEGRATION ***********/
        function querySearchChips(keyword) {
            return keyword ? self.allEmployees.filter(createFilterForChips(keyword)) : [];
        }
        function createFilterForChips(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(approver) {
                return (approver._lowername.indexOf(lowercaseQuery) != -1);
        };
        }
        function loadChipList(list) {
            return list.map(function (c, index) {
                var object = {
                    id: c._id,
                    name: c.full_name ? c.full_name : "",
                    email: c.email,
                    image: angular.isDefined(c.profile_pic) ? c.profile_pic : 'images/no-avatar.png'
                };
                object._lowername = object.name.toLowerCase();
                return object;
            });
        }
        /*********** END CHIPS INTEGRATION ***********/

        /************ Start AUTOCOMPLETE Section ************/
        function loadAll(repos) {
            return repos.map(function (repo) {
                repo.value = repo.full_name ? repo.full_name.toLowerCase() : "";
                return repo;
            });
        }
        function querySearch(query) {
            return query ? self.allSignAuth.filter(createFilterFor(query)) : self.allSignAuth;
        }
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function selectedItemChange(item, model, key) {
            if (angular.isDefined(item) && item) {
                var id = angular.isObject(item._id) ? item._id.$id : item._id;
                model[key] = id;
            }
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }

        /************ End AUTOCOMPLETE Section ************/
        
	}
]);