app.controller('AllFilterController', [
    '$scope', '$window', 'UserManagementService', 'utilityService', 'ServerUtilityService', 'PayrollOverviewService', 'FrontendExitService',
    function ($scope, $window, UserManagementService, utilityService, serverUtilityService, PayrollOverviewService, FrontendExitService) {
        $scope.groupList = [];
        $scope.filterIncludes = {};
        $scope.salaryBand = PayrollOverviewService.buildSalarayBandObj();
        $scope.employeeStatus = UserManagementService.buildEmployeeStatus();
        $scope.allEmployeeStatus = UserManagementService.buildProfileStatus();
        $scope.userStatus = UserManagementService.buildUserStatusObject();
        $scope.exitStatusObject = FrontendExitService.buildExitStatus();
        $scope.allSlug = [];

        var initialiseFacadeCount = function () {
            $scope.allFacadeCountObject = UserManagementService.buildAllFacadeCountDefaultObject();
            $scope.allFacadeCountCopyObject = UserManagementService.buildAllFacadeCountDefaultObject();
        };
        initialiseFacadeCount();        
        $scope.initialiseFacadeCount = function (type){
            $scope.allFacadeCountObject[type] = {};
            $scope.allFacadeCountCopyObject[type] = {};
        };
        var setAdditionalKeysWithinMandatoryGroups = function () {
            var locationElements = [],
                legalEntityElements = [];

            angular.forEach($scope.groupList, function (v, k) {
                $scope.filterIncludes[v.slug] = [];
                $scope.allFacadeCountObject.group[v.slug] = {};
                $scope.allFacadeCountObject.groupTemp[v.slug] = {};
                $scope.allFacadeCountObject.groupTicketView[v.slug] = {};
                $scope.allFacadeCountObject.groupOwnerView[v.slug] = {};
                $scope.allFacadeCountCopyObject.group[v.slug] = {};
                $scope.allFacadeCountCopyObject.groupTemp[v.slug] = {};
                $scope.allFacadeCountCopyObject.groupTicketView[v.slug] = {};
                $scope.allFacadeCountCopyObject.groupOwnerView[v.slug] = {};
                $scope.allSlug.push(v.slug);

                angular.forEach(v.element_details, function (value, key) {
                    value.isChecked = false;
                });

                if (v.slug === 'work_profile_location') {
                    $scope.mandatorySearchObject.push('location');
                    locationElements = utilityService.getValue(v, 'element_details', []);
                }
                if (v.slug === 'work_profile_department') {
                    $scope.mandatorySearchObject.push('department');
                }
                if (v.slug === 'work_profile_division') {
                    $scope.mandatorySearchObject.push('designation');
                }
                if (v.slug === 'work_profile_legal_entity') {
                    legalEntityElements = utilityService.getValue(v, 'element_details', []);
                }                
            });
            
            if (locationElements.length) {
                utilityService.setStorageValue("locationElements", JSON.stringify(locationElements));
            }
            
            if (legalEntityElements.length) {
                utilityService.setStorageValue("legalEntityElements", JSON.stringify(legalEntityElements));
            }
        };
        var getGroupDetails = function () {
            var mandatoryGroups = utilityService.getStorageValue("mandatoryGroups") || null;

            if (mandatoryGroups) {
                $scope.groupList = JSON.parse(mandatoryGroups);
                $scope.groupMandatoryList = JSON.parse(mandatoryGroups);
                setAdditionalKeysWithinMandatoryGroups();                
            } else {
                var url = PayrollOverviewService.getUrl('allmandatorygroup');
                serverUtilityService.getWebService(url).then(function (data) {
                    $scope.groupList = data.data;
                    $scope.groupMandatoryList = data.data;                    
                    setAdditionalKeysWithinMandatoryGroups();
                    utilityService.setStorageValue("mandatoryGroups", JSON.stringify(utilityService.getValue(data, 'data')));
                });
            }            
        };
        if (utilityService.getValue($scope.user, 'accessToken')) {
            getGroupDetails();
        }

        /* $scope.calculateGroupFacadeCount = function (list, countObject, collection, allSlug) {
            $scope.allFacadeCountObject[countObject] = {};
            var allSlugs = angular.isDefined(allSlug) ? allSlug : $scope.allSlug;
            function innerFunc(value) {
                angular.forEach(value, function (innerValue, innerKey) {
                    if (allSlugs.indexOf(innerKey) >= 0 && innerValue && angular.isArray(innerValue)) {
                        var obj = innerValue.reduce(function (o, v, i) {
                            if (angular.isDefined($scope.allFacadeCountObject[countObject][v])) {
                                $scope.allFacadeCountObject[countObject][v]++;
                            } else {
                                $scope.allFacadeCountObject[countObject][v] = 1;
                            }
                            return o;
                        }, {});
                    }
                });
            }
            angular.forEach(list, function (value, key) {
                if (angular.isDefined(collection)) {
                    innerFunc(value[collection]);
                } else {
                    innerFunc(value);
                }
            });
        }; */
        $scope.calculateAllFacadeCount = function (list, countObject,  key, collection, key2) {
            $scope.allFacadeCountObject[countObject] = {};
            function innerFunc(value) {
                if (collection.indexOf(value[key]) >= 0) {
                    if (angular.isDefined($scope.allFacadeCountObject[countObject][value[key]])) {
                        $scope.allFacadeCountObject[countObject][value[key]]++;
                    } else {
                        $scope.allFacadeCountObject[countObject][value[key]] = 1;
                    }
                }
                if (angular.isDefined(key2) && collection.indexOf(value[key2]) >= 0) {
                    if (angular.isDefined($scope.allFacadeCountObject[countObject][value[key2]])) {
                        $scope.allFacadeCountObject[countObject][value[key2]]++;
                    } else {
                        $scope.allFacadeCountObject[countObject][value[key2]] = 1;
                    }
                }
            };
            angular.forEach(list, function (value, k) {
                if (angular.isDefined(collection)) {
                    innerFunc(value);
                } else {
                   if (angular.isDefined($scope.allFacadeCountObject[countObject][value[key]])) {
                        $scope.allFacadeCountObject[countObject][value[key]]++;
                    } else {
                        $scope.allFacadeCountObject[countObject][value[key]] = 1;
                    }
                }
            });
        };
        $scope.calculateOtherFacadeCount = function (list, collection, countObject) {
            $scope.allFacadeCountObject[countObject] = {};
            angular.forEach(list, function (value, key) {
                angular.forEach(collection, function (v, k) {
                    if (value[v]) {
                        if (angular.isDefined($scope.allFacadeCountObject[countObject][v])) {
                            $scope.allFacadeCountObject[countObject][v]++;
                        } else {
                            $scope.allFacadeCountObject[countObject][v] = 1;
                        }
                    }
                });
            });
        };

        /***** Main Count Code *****/
        $scope.hideMoreFilterWithNoCount = function (list, index, facadeCountObj){
            var flag = false;
            for(var i= index; i < list.length; i++){
                if(Object.keys(facadeCountObj[list[i]['slug']]).length > 0){
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        $scope.resetFacadeCountObject = function (countObjectList){
            angular.forEach(countObjectList, function (v, k){
                var allSlugs = angular.isDefined(v.allSlug) ? v.allSlug : $scope.allSlug;
                $scope.allFacadeCountObject[v.countObject] = {};
                $scope.allFacadeCountCopyObject[v.countObject] = {};
                if(v.isGroup){
                    angular.forEach(allSlugs, function (val, key){
                        $scope.allFacadeCountObject[v.countObject][val] = {};
                        $scope.allFacadeCountCopyObject[v.countObject][val] = {};
                    });
                }
            });
        };
        var calculateAllGroupFacadeCount = function (value, allFilterObject){
            var allSlugs = angular.isDefined(allFilterObject.allSlug) ? allFilterObject.allSlug : $scope.allSlug;
            angular.forEach(value, function (innerValue, innerKey) {
                if (allSlugs.indexOf(innerKey) >= 0 && innerValue && angular.isArray(innerValue)) {
                    var obj = innerValue.reduce(function (o, v, i) {
                        if (angular.isDefined($scope.allFacadeCountObject[allFilterObject.countObject][innerKey][v])) {
                            $scope.allFacadeCountObject[allFilterObject.countObject][innerKey][v]++;
                        } else {
                            $scope.allFacadeCountObject[allFilterObject.countObject][innerKey][v] = 1;
                        }
                        return o;
                    }, {});
                }
            });
        };        
        var calculateSalaryFacade = function (value, allFilterObject) {
            angular.forEach($scope.salaryBand, function (v, k) {
                if (value.total_net_pay && value.total_net_pay >= v.low && value.total_net_pay < v.high) {
                    if (angular.isDefined($scope.allFacadeCountObject[allFilterObject.countObject][v.id])) {
                        $scope.allFacadeCountObject[allFilterObject.countObject][v.id]++;
                    } else {
                        $scope.allFacadeCountObject[allFilterObject.countObject][v.id] = 1;
                    }
                }
            });
        };            
        var calculateCommonFacadeCount = function (value, allFilterObject) {
            if (angular.isDefined(allFilterObject.collection) && allFilterObject.collection.length) {
                if (allFilterObject.collection.indexOf(value[allFilterObject.key]) >= 0) {
                    if (angular.isDefined($scope.allFacadeCountObject[allFilterObject.countObject][value[allFilterObject.key]])) {
                        $scope.allFacadeCountObject[allFilterObject.countObject][value[allFilterObject.key]]++;
                    } else {
                        $scope.allFacadeCountObject[allFilterObject.countObject][value[allFilterObject.key]] = 1;
                    }
                }
            } else {
                if (angular.isDefined($scope.allFacadeCountObject[allFilterObject.countObject][value[allFilterObject.key]])) {
                    $scope.allFacadeCountObject[allFilterObject.countObject][value[allFilterObject.key]]++;
                } else {
                    $scope.allFacadeCountObject[allFilterObject.countObject][value[allFilterObject.key]] = 1;
                }
            }
        };        
        var countAccordingToItem = function (value, allFilterObject){
            angular.forEach(allFilterObject, function (filter, k){
                if (filter.isGroup) {
                    if(angular.isDefined(filter.embed_collection_key) && angular.isDefined(filter.collection_key)){
                        calculateAllGroupFacadeCount(value[filter.embed_collection_key][filter.collection_key], filter)
                    }else if(angular.isUndefined(filter.embed_collection_key) && angular.isDefined(filter.collection_key)){
                        calculateAllGroupFacadeCount(value[filter.collection_key], filter);
                    }else{
                        calculateAllGroupFacadeCount(value, filter); 
                    }
                } else if (filter.isSalary) {
                    calculateSalaryFacade(value, filter);
                } else if (filter.isArray && !filter.isGroup && !filter.isSalary) {
                    var matchedItem = $window._.intersection(value[filter.key], filter.collection);
                    if (matchedItem.length > 0) {
                        var obj = matchedItem.reduce(function (o, v, j) {
                            if (angular.isDefined($scope.allFacadeCountObject[filter.countObject][v])) {
                                $scope.allFacadeCountObject[filter.countObject][v]++;
                            } else {
                                $scope.allFacadeCountObject[filter.countObject][v] = 1;
                            }
                            return o;
                        }, {});
                    }
                } else {
                    angular.isDefined(filter.collection_key) 
                        ? calculateCommonFacadeCount(value[filter.collection_key], filter)
                        : calculateCommonFacadeCount(value, filter);
                }
            });
        };
        $scope.calculateFacadeCountOfAllFilters = function (list, allFilterObject, item) {
            if (angular.isDefined(item)) {
                countAccordingToItem(item, allFilterObject);
            } else {
                $scope.resetFacadeCountObject(allFilterObject);
                angular.forEach(list, function (value, key) {
                    countAccordingToItem(value, allFilterObject);
                });
            }
        };
        var intialiseFilterIncluded = function () {
            $scope.allCollections = UserManagementService.buildAllCollectionsDefaultObject();
            $scope.name_filter = {};
            $scope.allFilters = UserManagementService.buildAllFiltersDefaultObject();
        };
        intialiseFilterIncluded();

        $scope.isCheckboxExists = function (item, key, collection) {
            return collection && collection.indexOf(item[key]) > -1;
        };
        $scope.isAllChecked = function (list, collection) {
            if (angular.isArray(list)) {
                var listLength = list.length;
            }
            if (angular.isObject(list)) {
                listLength = Object.keys(list).length;
            }
            
            if(angular.isUndefined(collection) || listLength == 0){
                return false;
            }
            return listLength === collection.length ;
        };
        $scope.isIndeterminate = function (list, collection) {
            if (angular.isUndefined(collection)) {
                return false;
            }
            if (angular.isArray(list)) {
                var listLength = list.length;
            }
            if (angular.isObject(list)) {
                listLength = Object.keys(list).length;
            }
            return (collection.length !== 0 && collection.length !== listLength);
        };
        
        // filterKey: varible on which we applying filter
        // list: filter element list (Object or Array)
        // collection: array in which we storing checked value
        // allFilterCollection: collectin for show checked value name on horizontal bar
        // allFilterObject: object for storing  allFilterCollection
        
        $scope.selectAllCheckbox = function (filterKey, list, collection, allFilterObject, allFilterCollection, facadeCountObj, facadeKey, groupSlug) {
            if (angular.isArray(list)) {
                var listLength = list.length;
            }
            if (angular.isObject(list)) {
                listLength = Object.keys(list).length;
            }
            if (collection.length === listLength) {
                angular.forEach(list, function (v, k) {
                    v.slug = angular.isDefined(groupSlug) ? groupSlug : allFilterCollection;
                    var i = $.inArray(v[filterKey], collection),
                        j = $.inArray(v, allFilterObject[allFilterCollection]);
                    if (i > -1) {
                        collection.splice(i, 1);
                    }
                    if (j > -1) {
                        allFilterObject[allFilterCollection].splice(j, 1);
                    }
                });
            } else if (collection.length === 0 || collection.length > 0) {
                var tempCollection = [];
                angular.forEach(list, function (v, k) {
                    var i = $.inArray(v, allFilterObject[allFilterCollection]);
                    v.slug = angular.isDefined(groupSlug) ? groupSlug : allFilterCollection;

                    tempCollection.push(v[filterKey]);
                    if (angular.isDefined(facadeCountObj) && facadeCountObj[v[facadeKey]] > 0) {
                        if (i == -1 && angular.isDefined(allFilterObject[allFilterCollection])) {
                            allFilterObject[allFilterCollection].push(v);
                        }
                    } else if (angular.isUndefined(facadeCountObj)) {
                        if (i == -1 && angular.isDefined(allFilterObject[allFilterCollection])) {
                            allFilterObject[allFilterCollection].push(v);
                        }
                    }
                });
                angular.copy(tempCollection, collection);
            }
        };        
        var getGroupElementList  = function (slug){
            var list = $scope.groupList.find(function (item){
                return  item.slug == slug;
            });
            return list;
        };
        $scope.includeAllFilterCollection = function (filterKey, item, collection, allFilterObject, allFilterCollection, allFacadeCountObject, list, groupSlug, isPeople) {
            item.slug = angular.isDefined(groupSlug) ? groupSlug : allFilterCollection;
            isPeople = angular.isDefined(isPeople) ? isPeople : false;
            var i = $.inArray(item[filterKey], collection);
            i > -1 ? collection.splice(i, 1) : collection.push(item[filterKey]);
            if (angular.isDefined(allFilterObject[allFilterCollection])) {
                var j = $.inArray(item, allFilterObject[allFilterCollection]);
                j > -1 ? allFilterObject[allFilterCollection].splice(j, 1) : allFilterObject[allFilterCollection].push(item);
            };
            // Handle select All functionality
            if (angular.isDefined(allFacadeCountObject) && !isPeople) {
                var definedCount = 0, tempCollection = [];
                for (var d = 0; d < collection.length; d++) {
                    if (angular.isDefined(allFacadeCountObject[collection[d]])) {
                        definedCount += 1;
                    }
                }
                if (definedCount == 0) {
                    collection.splice(0, collection.length);
                }
                if (definedCount > 0  && Object.keys(allFacadeCountObject).length == definedCount) {
                    if (angular.isDefined(list) && !angular.isDefined(groupSlug)) {
                        angular.forEach(list, function (v, k) {
                            tempCollection.push(v[filterKey]);
                        });
                    } else if (angular.isDefined(groupSlug)) {
                        var gplist = getGroupElementList(groupSlug);
                        if (angular.isDefined(gplist)) {
                            tempCollection = gplist.element_ids;
                        }
                    }
                    angular.copy(tempCollection, collection);
                }
            }
        };

        /* $scope.candidateFilter = function (candidate) {
            var flag = true;
            if (Object.keys($scope.filterIncludes).length > 0) {
                angular.forEach($scope.filterIncludes, function (value, key) {
                    if (angular.isDefined($scope.filterIncludes[key]) && $scope.filterIncludes[key].length > 0) {
                        if (angular.isDefined(candidate.employee_preview) && angular.isDefined(candidate.employee_preview[key])) {
                            if ($window._.intersection(candidate.employee_preview[key], $scope.filterIncludes[key]).length == 0)
                                flag = false;
                        } else if (angular.isDefined(candidate.employee_detail) && angular.isDefined(candidate.employee_detail[key])) {
                            if ($window._.intersection(candidate.employee_detail[key], $scope.filterIncludes[key]).length == 0)
                                flag = false;
                        } else if (angular.isDefined(candidate.candidate_detail) && angular.isDefined(candidate.candidate_detail[key])) {
                            if ($window._.intersection(candidate.candidate_detail[key], $scope.filterIncludes[key]).length == 0)
                                flag = false;
                        } else if (angular.isDefined(candidate.manager) && angular.isDefined(candidate.manager[key])) {
                            if ($window._.intersection(candidate.manager[key], $scope.filterIncludes[key]).length == 0)
                                flag = false;
                        }else if (angular.isDefined(candidate.travel_details) && angular.isDefined(candidate.travel_details.employee_preview[key])) {
                            if ($window._.intersection(candidate.travel_details.employee_preview[key], $scope.filterIncludes[key]).length == 0)
                                flag = false;
                        }else if (angular.isDefined(candidate.requester_details) && angular.isDefined(candidate.requester_details[key])) {
                            if ($window._.intersection(candidate.requester_details[key], $scope.filterIncludes[key]).length == 0)
                                flag = false;
                        }else{
                            if ($window._.intersection(candidate[key], $scope.filterIncludes[key]).length == 0)
                                flag = false;
                        }
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
        }; */

        $scope.candidateGroupFilter = function (collection, embedCollection) {
            return function (candidate) {
                var flag = true;
                if (Object.keys($scope.filterIncludes).length > 0) {
                    angular.forEach($scope.filterIncludes, function (value, key) {
                        if (angular.isDefined($scope.filterIncludes[key]) && $scope.filterIncludes[key].length > 0) {
                            if (angular.isDefined(collection) && angular.isUndefined(embedCollection) && angular.isDefined(candidate[collection]) && angular.isDefined(candidate[collection][key])) {
                                if ($window._.intersection(candidate[collection][key], $scope.filterIncludes[key]).length == 0)
                                    flag = false;
                            } else if (angular.isDefined(collection) && angular.isDefined(embedCollection) && angular.isDefined(candidate[embedCollection][collection][key])) {
                                if ($window._.intersection(candidate[embedCollection][collection][key], $scope.filterIncludes[key]).length == 0)
                                    flag = false;
                            }else {
                                if ($window._.intersection(candidate[key], $scope.filterIncludes[key]).length == 0)
                                    flag = false;
                            }
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
        };        
        $scope.salaryFilter = function (object) {
            if ($scope.allCollections.salaryIncludes.length > 0) {
                for (var i = 0; i < $scope.allCollections.salaryIncludes.length; i++) {
                    var low = $scope.salaryBand[$scope.allCollections.salaryIncludes[i]].low;
                    var high = $scope.salaryBand[$scope.allCollections.salaryIncludes[i]].high;
                    if (object.total_net_pay && object.total_net_pay >= low && object.total_net_pay < high) {
                        return object;
                    }
                }
            } else {
                return object;
            }
        };

        /****** Employee Status Filter ********/
        $scope.employeeAllStatusFilter = function (key, collection) {
            return function (candidate) {
                if ($scope.allCollections.employeeStatus.length > 0) {
                    if (angular.isDefined(collection) && candidate[collection][key]) {
                        if ($.inArray(candidate[collection][key], $scope.allCollections.employeeStatus) < 0)
                            return;
                    } else if(candidate[key]) {
                        if ($.inArray(candidate[key], $scope.allCollections.employeeStatus) < 0)
                            return;
                    }
                }
                return candidate;
            };
        };        

        /* $scope.employeeStatusFilter = function (candidate) {
            if ($scope.allCollections.employeeStatus.length > 0 && candidate.employee_status) {
                if ($.inArray($scope.allEmployeeStatus[candidate.employee_status].label, $scope.allCollections.employeeStatus) < 0)
                    return;
            }
            return candidate;
        };
        $scope.profileStatusFilter = function (candidate) {
            if ($scope.allCollections.employeeStatus.length > 0 && candidate.employee_preview.system_plans_employee_status) {
                if ($.inArray($scope.allEmployeeStatus[candidate.employee_preview.system_plans_employee_status].label, $scope.allCollections.employeeStatus) < 0)
                    return;
            }
            return candidate;
        }; */

        /****** Employee Status Filter ********/
        $scope.statusFilter = function (request) {
            if ($scope.allCollections.employeeStatus.length > 0) {
                if ($.inArray(request.status, $scope.allCollections.employeeStatus) < 0)
                    return;
            }
            return request;
        };

        /****** Employee Active Status Filter ********/
        $scope.userStatusFilter = function (candidate) {
            if ($scope.allCollections.includeProfileStatus.length > 0) {
                if ($.inArray(candidate.profile_status, $scope.allCollections.includeProfileStatus) < 0 && $.inArray(candidate.employee_status, $scope.allCollections.includeProfileStatus) < 0)
                    return;
            }
            return candidate;
        };
        /****** Employee Active Status Filter ********/

        /************ Start NHM FILTER ************/
        $scope.formFilter = function (candidate) {
            if (angular.isDefined($scope.allCollections.formIncludes) && $scope.allCollections.formIncludes.length > 0) {
                if ($window._.intersection(candidate.selected_form, $scope.allCollections.formIncludes).length == 0)
                    return;
            }
            return candidate;
        };
        $scope.provisionFilter = function (candidate) {
            if (angular.isDefined($scope.allCollections.provisionIncludes) && $scope.allCollections.provisionIncludes.length > 0) {
                if ($window._.intersection(candidate.selected_provision, $scope.allCollections.provisionIncludes).length == 0)
                    return;
            }
            return candidate;
        };
        $scope.letterFilter = function (candidate) {
            if (angular.isDefined($scope.allCollections.letterIncludes) && $scope.allCollections.letterIncludes.length > 0) {
                if ($window._.intersection(candidate.selected_letters, $scope.allCollections.letterIncludes).length == 0)
                    return;
            }
            return candidate;
        };
        $scope.documentFilter = function (candidate) {
            if ($scope.allCollections.documentIncludes.length > 0) {
                if ($window._.intersection(candidate.selected_document, $scope.allCollections.documentIncludes).length == 0)
                    return;
            }
            return candidate;
        };
        /************ End NHM FILTER************/

        /************ Start PROVISION FILTER ************/
        $scope.provisionTypeFilter = function (key, collection) {
            return function (request) {
                if ($scope.allCollections.provisionIncludes.length > 0) {
                    if (angular.isDefined(collection)) {
                        if ($.inArray(request[collection][key], $scope.allCollections.provisionIncludes) < 0)
                            return;
                    } else {
                        if ($.inArray(request[key], $scope.allCollections.provisionIncludes) < 0)
                            return;
                    }
                }
                return request;
            };
        };
        $scope.provisionReqTypeFilter = function (request) {
            if ($scope.allCollections.provisionReqIncludes.length > 0) {
                if ($.inArray(request.provision_type_id, $scope.allCollections.provisionReqIncludes) < 0)
                    return;
            }
            return request;
        };
        /* $scope.provisionTypeManagerFilter = function (request) {
            if ($scope.allCollections.provisionIncludes.length > 0) {
                if ($.inArray(request.provision_type_id, $scope.allCollections.provisionIncludes) < 0)
                    return;
            }
            return request;
        }; */

        $scope.requestStatusFilter = function(request) {
            if ($scope.allCollections.statusIncludes.length > 0) {
                if ($.inArray(request.request_status, $scope.allCollections.statusIncludes) < 0)
                    return;
            }
            return request;
        };
        /************ End PROVISION FILTER ************/

        /***********Start Exit Filter***************/
        /* $scope.exitStatusFilter = function (candidate) {
            if ($scope.allCollections.statusIncludes.length > 0) {
                if ($.inArray($scope.exitStatusObject[candidate.on_notice].label, $scope.allCollections.statusIncludes) < 0)
                    return;
            }
            return candidate;
        }; */

        /***********End Exit Filter***************/
        
        /***********Start Travel-Expense Filter***************/
        $scope.travelTypeFilter = function (key, collection) {
            return function (item) {
                if ($scope.allCollections.typeIncludes.length > 0) {
                    if(angular.isDefined(collection)){
                        if ($.inArray(item[collection][key], $scope.allCollections.typeIncludes) < 0)
                        return;
                    }else{
                        if ($.inArray(item[key], $scope.allCollections.typeIncludes) < 0)
                        return;
                    }
                      
                }
                return item;
            }
        };        
        $scope.expenseCategoryFilter = function (key, collection) {
            return function (item){
                if ($scope.allCollections.anyIncludes.length > 0) {
                    if(angular.isDefined(collection)){
                        if ($.inArray(item[collection][key], $scope.allCollections.anyIncludes) < 0)
                        return;
                    }else{
                        if ($.inArray(item[key], $scope.allCollections.anyIncludes) < 0)
                        return;
                    }                      
                }
                return item;
            }
        };
        /*********** End Travel-Expense Filter ***************/

        /************************* All Excel Filter ***************************/
        $scope.orderByField = 'full_name';
        $scope.reverseSort = false;
        $scope.sortExcelList = function (orderByField, reverseBoolean) {
            $scope.orderByField = orderByField;
            $scope.reverseSort = reverseBoolean;
        };
        $scope.resetExcelSortVariables = function () {
            $scope.excelCollections = UserManagementService.buildExcelCollectionsDefaultObject();
        };
        $scope.resetExcelSortVariables();
        $scope.includeExcelFilters = function (object, collection) {
            var i = $.inArray(object, collection);
            (i > -1) ? collection.splice(i, 1) : collection.push(object);
        };
        $scope.nameFilter = function (object) {
            if ($scope.excelCollections.nameCollection.length > 0) {
                if ($.inArray(object.full_name, $scope.excelCollections.nameCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.commonExcelFilter = function (key,  collection, detailObject) {
            return function(object) {
                if (collection.length > 0) {
                    if(angular.isDefined(detailObject)){
                        if ($.inArray(object[detailObject][key], collection) < 0)
                            return;
                        } else {
                           if ($.inArray(object[key], collection) < 0)
                                return; 
                        }
                }
                return object;
            }
        };
        $scope.fromCityFilter = function (object) {
            if ($scope.excelCollections.fromCityCollection.length > 0) {
                if ($.inArray(object.travel_details[0].fromCityName, $scope.excelCollections.fromCityCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.toCityFilter = function (object) {
            if ($scope.excelCollections.toCityCollection.length > 0) {
                if ($.inArray(object.travel_details[0].toCityName, $scope.excelCollections.toCityCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.reasonFilter = function (object) {
            if ($scope.excelCollections.travelReasonCollection.length > 0) {
                if ($.inArray(object.travelReason, $scope.excelCollections.travelReasonCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.requestFilter = function (object) {
            if ($scope.excelCollections.nameCollection.length > 0) {
                if ($.inArray(object.requestStatus, $scope.excelCollections.nameCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.travelDateFilter = function(object) {
            if ($scope.excelCollections.creationDateCollection.length > 0) {
                if ($.inArray(object.requestDate, $scope.excelCollections.creationDateCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.insureFilter = function (object) {
            if ($scope.excelCollections.nameCollection.length > 0) {
                if ($.inArray(object.name, $scope.excelCollections.nameCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.relationFilter = function (object) {
            if ($scope.excelCollections.relationCollection.length > 0) {
                if ($.inArray(object.relationship, $scope.excelCollections.relationCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.managerFilter = function (object) {
            if ($scope.excelCollections.managerCollection.length > 0) {
                if ($.inArray(object.manager, $scope.excelCollections.managerCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.idFilter = function (object) {
            if ($scope.excelCollections.idCollection.length > 0) {
                if ($.inArray(object.employee_id, $scope.excelCollections.idCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.designationsFilter = function (object) {
            if ($scope.excelCollections.designationCollection.length > 0) {
                if ($.inArray(object.designation, $scope.excelCollections.designationCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.levelsFilter = function (object) {
            if ($scope.excelCollections.levelCollection.length > 0) {
                if ($.inArray(object.level, $scope.excelCollections.levelCollection) < 0)
                    return;
            }
            return object;
        };

        //joining date
        $scope.dateSortFilter = function (object) {
            if ($scope.excelCollections.dateCollection.length > 0) {
                if ($.inArray(object.joining_date, $scope.excelCollections.dateCollection) < 0)
                    return;
            }
            return object;
        };

        /****** Start Employee Status Filter ********/
        $scope.empStatusFilter = function (object) {
            if ($scope.excelCollections.statusCollection.length > 0) {
                if ($.inArray(object.empStatus, $scope.excelCollections.statusCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.claimDateFilter = function (object) {
            if ($scope.excelCollections.claimDateCollection.length > 0) {
                if ($.inArray(object.claim_date, $scope.excelCollections.claimDateCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.billDateFilter = function (object) {
            if ($scope.excelCollections.billDateCollection.length > 0) {
                if ($.inArray(object.bill_date, $scope.excelCollections.billDateCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.creationDateSortFilter = function (object) {
            if ($scope.excelCollections.creationDateCollection.length > 0) {
                if ($.inArray(object.creation_date, $scope.excelCollections.creationDateCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.typeFilter = function (object) {
            if ($scope.excelCollections.typeCollection.length > 0) {
                if ($.inArray(object.provision_type_id, $scope.excelCollections.typeCollection) < 0)
                    return;
            }
            return object;
        };

        /********** Last Serving Date Filter ***********/
        $scope.lastDateSortFilter = function (object) {
            if ($scope.excelCollections.dateCollection.length > 0) {
                if ($.inArray(object.last_serving_date, $scope.excelCollections.dateCollection) < 0)
                    return;
            }
            return object;
        };

        /********** Full & Final Date Filter ***********/
        $scope.fnfDateSortFilter = function (object) {
            if ($scope.excelCollections.fnfDateCollection.length > 0) {
                if ($.inArray(object.fnf_due_date, $scope.excelCollections.fnfDateCollection) < 0)
                    return;
            }
            return object;
        };

        /******************** Clearance Name Filter *********/
        $scope.clearanceFilter = function (object) {
            if ($scope.excelCollections.clearanceCollection.length > 0) {
                if ($.inArray(object.clearanceName, $scope.excelCollections.clearanceCollection) < 0)
                    return;
            }
            return object;
        };

        /********************Clearance Date Filter *********/
        $scope.clearanceDateFilter = function (object) {
            if ($scope.excelCollections.cDatesCollection.length > 0) {
                if ($.inArray(object.clearanceDate, $scope.excelCollections.cDatesCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.statusFilter = function (object) {
            if ($scope.excelCollections.statusCollection.length > 0) {
                if ($.inArray(object.status, $scope.excelCollections.statusCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.resetSortForCollection = function (string) {
            if (string == "all") {
                $scope.resetExcelSortVariables();
                $scope.orderByField = 'full_name';
                $scope.reverseSort = false;
            } else {
                string == 'name' ? ($scope.excelCollections.nameCollection = [], $scope.excelCollections.selectedNames = []) :
                string == 'request' ? ($scope.excelCollections.nameCollection = [], $scope.excelCollections.selectedNames = []) :
                string == 'reason' ? ($scope.excelCollections.travelReasonCollection = [], $scope.excelCollections.selectedTravelReason = []) :
                string == 'insure' ? ($scope.excelCollections.nameCollection = [], $scope.excelCollections.selectedNames = []) :
                string == 'fromCity' ? ($scope.excelCollections.fromCityCollection = [], $scope.excelCollections.selectedFromCity = []) :
                string == 'toCity' ? ($scope.excelCollections.toCityCollection = [], $scope.excelCollections.selectedToCity = []) :
                string == 'travelDate' ? ($scope.excelCollections.creationDateCollection = [], $scope.excelCollections.selectedCreationDate = []) :
                string == 'relation' ? ($scope.excelCollections.relationCollection = [], $scope.excelCollections.selectedRelation = []) :
                string == 'id' ? ($scope.excelCollections.idCollection = [], $scope.excelCollections.selectedIds = []) :
                string == 'designation' ? ($scope.excelCollections.designationCollection = [], $scope.excelCollections.selectedDesignation = []) :
                string == 'manager' ? ($scope.excelCollections.managerCollection = [], $scope.excelCollections.selectedManager = []) :
                string == 'date' ? ($scope.excelCollections.dateCollection = [], $scope.excelCollections.selectedDates = []) :
                string == 'empStatus' || string == 'status' ? ($scope.excelCollections.statusCollection = [], $scope.excelCollections.selectedStatus = []) :
                string == 'level' ? ($scope.excelCollections.levelCollection = [], $scope.excelCollections.selectedLevel = []) : 
                string == 'claimDate' ? ($scope.excelCollections.claimDateCollection = [], $scope.excelCollections.selectedClaimDate = []) :
                string == 'billDate' ? ($scope.excelCollections.billDateCollection = [], $scope.excelCollections.selectedBillDate = []) : 
                string == 'creationDate' ? ($scope.excelCollections.creationDateCollection = [], $scope.excelCollections.selectedCreationDate = []) : 
                string == 'type' ? ($scope.excelCollections.typeCollection = [], $scope.excelCollections.selectedTypes = []) :
                string == 'clearance' ? ($scope.excelCollections.clearanceCollection = [], $scope.excelCollections.selectedClearance = []) :
                string == 'clearanceDate' ? ($scope.excelCollections.cDatesCollection = [], $scope.excelCollections.selectedCDates = []) :
                string == 'fnfDate' ? ($scope.excelCollections.fnfDateCollection = [], $scope.excelCollections.selectedFnfDate = []) : string = "";
            }
        };
        $scope.resetAllTypeFilters = function (allKey, collKey) {
            $scope.resetSortForCollection('all');
            $scope.resetFilterCustomDate();
            //initialiseFacadeCount();
            angular.forEach($scope.groupList, function (v) {
                $scope.filterIncludes[v.slug] = [];
            });
            if (angular.isDefined(allKey) && angular.isDefined(collKey)) {
                $scope.allCollections[collKey] = [];
                $scope.allFilters[allKey] = [];
                $scope.allFilters.group = [];
                $scope.allCollections.statusIncludes = [];
            } else {
                intialiseFilterIncluded();
            }
        };        
        $scope.resetFilterCustomDate = function (){
            $scope.allCollections.dueFrom =  null,
            $scope.allCollections.dueTo= null;
            $scope.allCollections.dueFrom1 = null;
            $scope.allCollections.dueTo1 = null;
        };

        /***************** Pagination Settings *******************/
        $scope.updatePaginationSettings = function (pageName, maxRange) {
            $scope.pageName = pageName;
            $scope.$watch('pageName', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    utilityService.removeStorageValue(oldVal + '_np');
                    utilityService.removeStorageValue(oldVal + '_cp');
                    utilityService.setStorageValue(newVal + '_np', 10);
                    utilityService.setStorageValue(newVal + '_cp', 1);
                    $scope.paginationObject.pagination[newVal + '_cp'] = 1;
                    $scope.paginationObject.pagination[newVal + '_np'] = 10;
                }
            }, true);
            // $scope.paginationObject = utilityService.buildPaginationObject(pageName, maxRange);

            if (!utilityService.getValue($scope.paginationObject, 'pagination')) {
                $scope.paginationObject = utilityService.buildPaginationObject(pageName, maxRange);
            }

            var string = "paginationObject.pagination." + pageName + "_np";

            $scope.paginationObject.pagination[pageName + '_cp'] = angular.isDefined(utilityService.getStorageValue(pageName + '_cp')) && utilityService.getStorageValue(pageName + '_cp')
                    ? parseInt(utilityService.getStorageValue(pageName + '_cp')) : 1;

            $scope.paginationObject.pagination[pageName + '_np'] = angular.isDefined(utilityService.getStorageValue(pageName + '_np')) && utilityService.getStorageValue(pageName + '_np')
                    ? parseInt(utilityService.getStorageValue(pageName + '_np')) : 10;

            $scope.$watch(string, function (newVal, oldVal) {
                if (newVal != oldVal) {
                    $scope.paginationObject.pagination[pageName + '_cp'] = 1;
                } else {
                    $scope.paginationObject.pagination[pageName + '_cp'] = utilityService.getStorageValue(pageName + '_cp') ? parseInt(utilityService.getStorageValue(pageName + '_cp')) : 1;
                }
                if (angular.isDefined(newVal)) {
                    utilityService.setStorageValue(pageName + '_np', newVal);
                }
            }, true);
        };

        $scope.getPaginationCurrentPage = function (newv, oldv, pageName) {
            utilityService.setStorageValue(pageName + '_cp', newv);
        };
    }
]);

app.filter("customDateFilter",['utilityService', function(utilityService) {
  	return function(items, selectedValue ,fromDate, toDate,key) {
        if(fromDate && toDate && selectedValue == 'custom') {
            var parseDate = function(myDate) {
                if(myDate.toString().indexOf('/') == -1){
                    return (myDate * 1000);
                }
                myDate = myDate.split("/");
                var newDate=myDate[1]+","+myDate[0]+","+myDate[2],
                    dateFormat = new Date(newDate);

                return dateFormat.getTime();
            };

            toDate.setHours("23", "59", "00", "00");
            var df = fromDate.getTime(),
                dt = toDate.getTime(),
                result = [];
            for (var i=0; i<items.length; i++) {
                if(items[i][key]){
                    var d = parseDate(items[i][key]);
                    if (d >= df && d <= dt)  {
                        result.push(items[i]);
                    }
                }
                
            }        
            return result;
        } else if(selectedValue != 'custom' && selectedValue != 0) {
            var result = [];
            for (var i=0; i<items.length; i++) {
                if(items[i][key]) {
                    var date2 = new Date(),
                        raised_date = utilityService.getDefaultDate(items[i][key], false, true),
                        timeDiff = Math.abs(date2.getTime() - raised_date.getTime()),
                        diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
                         if(parseInt(selectedValue) >= diffDays && diffDays != 0){
                             result.push(items[i]);
                         }
                }
            }
            return result;
        } else {
           return items; 
        }        
  	};
}]);

app.filter('recruitmentInteligenceSearch', [
    'utilityService', '$window', function (utilityService, $window) {
        return function (items, filterIncludes) {
            if (Object.keys(filterIncludes).length > 0) {
                var result = [];
                /******** GET TIME STAMP ********/
                var parseDate = function (myDate) {
                    if (myDate.toString().indexOf('/') == -1) {
                        return (myDate * 1000);
                    }
                    myDate = myDate.split("/");
                    var newDate = myDate[1] + "," + myDate[0] + "," + myDate[2],
                            dateFormat = new Date(newDate);

                    return dateFormat.getTime();
                };

                /************* FUNCTION TO FILTER ****************/
                function filterAllType(candidate) {
                    var flag = true;
                    angular.forEach(filterIncludes, function (value, key) {
                        if (angular.isDefined(filterIncludes[key]) && angular.isArray(filterIncludes[key]) && filterIncludes[key].length > 0) {
                            if (angular.isArray(candidate[key])) {
                                if ($window._.intersection(candidate[key], filterIncludes[key]).length == 0)
                                    flag = false;
                            } else {
                                if (filterIncludes[key].indexOf(candidate[key]) == -1)
                                    flag = false;
                            }
                        } else if (angular.isDefined(filterIncludes[key]) && angular.isObject(filterIncludes[key])) {
                            if (angular.isNumber(filterIncludes[key].from) && angular.isNumber(filterIncludes[key].to)) {
                                if (parseInt(candidate[key]) < filterIncludes[key].from || parseInt(candidate[key]) > filterIncludes[key].to)
                                    flag = false;
                            } else if (angular.isObject(filterIncludes[key].from) && angular.isObject(filterIncludes[key].to)) {
                                var df = filterIncludes[key].from.getTime(),
                                        dt = filterIncludes[key].to.getTime(),
                                        d = candidate[key] ? parseDate(candidate[key]) : null;
                                if (!d || d < df || d > dt)
                                    flag = false;
                            }
                        } else if (candidate && angular.isDefined(candidate[key]) && candidate[key].indexOf(filterIncludes[key]) == -1) {                            
                            flag = false;
                        }
                    });
                    if (flag) {
                        return candidate;
                    } else {
                        return;
                    }
                };

                for (var i = 0; i < items.length; i++) {
                    var item = filterAllType(items[i]);
                    if (item) {
                        result.push(item);
                    }
                }
                return result;
            } else {
                return items;
            }
        };
    }
]);
