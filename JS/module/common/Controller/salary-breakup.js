app.controller('SalaryBreakupController', [
    '$scope', '$routeParams', '$location', '$timeout', '$window', '$route', '$q', '$modal', 'UserManagementService', 'utilityService', 'ServerUtilityService', 'Upload', '$rootScope',
    function ($scope, $routeParams, $location, $timeout, $window, $route, $q, $modal, UserManagementService, utilityService, serverUtilityService, Upload, $rootScope) {

        var self = this,
            frequencyObj = {
                payout_frequency: null,
                payout_x_cycle_value: null,
                on_first_payroll_cycle: null,
                once_on_payroll_cycle: null,
                once_on_x_payroll_cycle: null
            },
            currentDate = new Date(),   
            def = "1970-01-01";

        self.simulateQuery = false;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;
        self.contacts = [];
        self.value = {};
        self.querySearchChips = querySearchChips;
        
        $scope.effectiveDateObj = {
            flag: false, 
            method: null,
            date: null,
            minDate: new Date()
        };
        $scope.pattern = {
            email: /^[a-zA-Z0-9-]+[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.-]{2,20}$/,
            alphaNumeric: /^[0-9a-zA-Z \b]+$/
        };
        $scope.userSegmentForm = {form: null};
        $scope.flag = angular.isDefined($routeParams.flag) ? $routeParams.flag : false;
        $scope.activeDisable = true;
        $scope.allfields = null;
        $scope.segmentHashmap = {};
        $scope.apiError = utilityService.buildAPIErrorObject();
        $scope.errorMessages = [];
        $scope.tab = 1;
        $scope.tabHeading = $scope.segmentHashmap[$scope.tab];
        $scope.tabId = null;
        $scope.individulaFlag = false;
        $scope.isSystemPlanActive = false;
        $scope.employeeOtherData = null;
        $scope.file = {
            key: null
        };
        $scope.usermanagent = {
            allVisible: false,
            visible: false,
            listVisibale: false,
            isBulkVisible: true, 
            listVisible: false,
            isSelected: false,
            isAllChecked: false,
            isDesination: false,
            isLevel: false,
            isPreviewVisible: false,
            isEditPayrollPlan: false,
            isSuperAdmin: utilityService.getStorageValue('isSuperAdmin') == 'true' ? true : false,
            minimumRepeatValue: {},
            isBulkUpdate: angular.isDefined($routeParams.isUpdate) && ($routeParams.isUpdate == 'true') ? true : false,
            instructions: null,
            ctc: null,
            gross: null,
            selectedPlanId: null,
            selected: 0,
            totalActiveUser: 0,
            checkedCount: 0,
            breakupType: 1, 
            roundType: 1, 
            roundUpto: null, 
            bulkUpdateType:$routeParams.updateType,
            excelFilterVisible: false,
            selectedEmpStatus: $routeParams.status ? $routeParams.status : 1,
            searchKey: 'full_name',
            searchText: 'Search by Name',
            isDebit : true
        };
        $scope.statutoryCompliances = {
            lwf: null,
            pt: null
        };
        $scope.preview = {
            credit: [],
            debit: [],
            tempCredit:[],
            tempDebit:[],
            ctc_breakup: [],
            totat_deducted: null,
            totalCtc: null,
            isVisible: false,
            finalPreview: {balance: null, ctc: {breakup: [], total_ctc: null}}
        };
        $scope.intialValue = {
            credit: {},
            debit: {}
        };
        $scope.esiModule = {
            isEnabled: false,
            isButtonEnabled: true,
            nonEffectiveMonths:  {
                4: 'April',
                10: 'October'
            },
            name: ['esi_employee', 'esi_employer']
          }
        if ($routeParams.isDataMigration) {
            $scope.usermanagent.selected = 1;
            $scope.usermanagent.isSelected = true;
        }
        if ($scope.usermanagent.isSelected) {
            $timeout(function () {
                $location.search("isDataMigration", null);
            }, 1000);
        }
        $scope.usersIncluded = [];
        $scope.allSlug = [];
        $scope.segmentID = null;
        $scope.joiningDate = {
            from: null,
            to: null
        };        
        $scope.maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
        $scope.today = new Date();
        $scope.userId = utilityService.getValue($routeParams, 'id');
        $scope.profileStatus = UserManagementService.buildProfileStatus();
        $scope.userStatus = UserManagementService.buildUserStatusObject();
        $scope.groupObject = {};
        $scope.elementObject = {};
        $scope.allUsers = [];
        $scope.allUsersForExcel = [];
        $scope.norLankaFlag = false
        $scope.countryDialCode = {
            list: []
        };
        $scope.errorObject = {
            status: false,
            message: null
        };
        $scope.isValueAffectedByStatutory = false;
        var getSalaryBreakupType = function (){
            var url = UserManagementService.getUrl('breakupSettings');
            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.usermanagent.breakupType = data.data.salary_breakup_from;
                    $scope.usermanagent.roundType = data.data.breakup_round_type;
                    $scope.usermanagent.roundUpto = data.data.breakup_round_upto;
                });
        };
        var getIndividualUserDetail = function () {
            if (!$scope.userId) {
                return false;
            }
            $scope.userData = [];
            var url = UserManagementService.getUrl('userDetail') + "/" + $scope.userId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                     $scope.userData = data.data;
                    $scope.showActive = angular.isDefined(data.data.status) ? data.data.status : false;
                    if (angular.isDefined(data.data) && data.data.step_completed) {
                        $scope.activeDisable = data.data.step_completed >= 200 && !data.data.status ? false : true;
                    }
                });
        };
        $scope.setTab = function (newValue, item) {
            $scope.usermanagent.visible = false;
            $scope.tab = newValue;
            if (angular.isDefined(item) && item != null) {
                $scope.tabId = item;
                $scope.tabHeading = $scope.segmentHashmap[item._id];
            }
        };
        $scope.isSet = function (tabName) {
            return $scope.tab === tabName;
        };
        $scope.reset = function () {
            $route.reload();
            getGroupDetails();
            getAllUsers();
            $scope.resetSortForCollection('all');
        };
        $scope.returnHtml = function () {
            return $scope.formFieldsHtml.inputBox;
        };
        var getUserSegmentList = function () {
            var url = UserManagementService.getUrl('segment') + "/employee/" + $scope.userId;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.userSegmentList = data.data;
                $scope.segmentHashmap = UserManagementService.bulidSegmentHashmap(data.data);
                $scope.usermanagent.allVisible = true;
            });
        };
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
        var joiningDate= null;
        var segmentFiledSyncRapper = function (v, k) {
            if (v.field_type != 14) {
                if (v.format_type == 1 || v.field_type == 10 || v.field_type == 12 && v.value) {
                    v.value = v.value.toString();
                } else if (v.field_type == 5 && v.value != "") {
                    v.value = utilityService.getDefaultDate(v.value);      
                    if (v.slug == "work_profile_joining_date") {
                        joiningDate = v.value;
                    }
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
                    if (angular.isArray(v.value)) {
                        angular.forEach(v.element_details, function (v11, k11) {
                            v11.isChecked = v.value.indexOf(v11._id) == -1 ? false : true;
                        });
                    }
                }
                
                if(v.slug == "work_profile_tenure"){
                    v.valueTemp = $scope.calculateTenure(joiningDate, true);
                }
            }
        };        
        var arrangeChildData = function (item) {
            var childDetails = item.child_detail, count = 0;
            for (var i = 0; i < item.child_detail.length; i++) {
                if (item.value_on_set.indexOf(i) > -1) {
                    count += 1;
                } else {
                    var removalItem = item.child_detail[i];
                    item.child_detail.splice(i, 1);
                    item.child_detail.push(removalItem);
                }
                if (count == item.value_on_set.length) {
                    break;
                }
            }
        };
        var segmentFieldCallback = function (data) {
            angular.forEach(data, function (v, k) {
                if (v.field_type == 14 && angular.isDefined(v.child_detail) && v.child_detail.length) {
                    angular.forEach(v.child_detail, function (value, key) {
                        if (!v.is_repeatable) {
                            if (value.field_type == 14) {
                                angular.forEach(value.child_detail, function (value2, key2) {
                                    segmentFiledSyncRapper(value2, key2)
                                });
                            } else {
                                segmentFiledSyncRapper(value, key);
                            }
                        } else {
                            v.maxShowFirstTime = parseInt(v.min_repeat);
                            $scope.usermanagent.minimumRepeatValue[v.slug] = parseInt(v.min_repeat);
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
            $scope.segmentFieldJson = data;
            $scope.usermanagent.visible = true;
        };
        $scope.getSegmentFields = function (item) {
            utilityService.resetAPIError(false, "all is well", 'saveSetupFields');
            if ($scope.userId) {
                $scope.segmentID = item._id;
                $q.all([
                    serverUtilityService.getWebService(UserManagementService.getUrl('allUser') + "?status=true"),
                    serverUtilityService.getWebService(UserManagementService.getUrl('getFieldBySegment') + "/" + item._id + "/" + $scope.userId)
                ]).then(function (data) {
                    reportingManagerCallback(data[0]);
                    segmentFieldCallback(data[1]);
                });
            }
        };
        var setErrorObject = function (data) {
            $scope.errorObject.status = utilityService.getValue('status');
            $scope.errorObject.message = utilityService.getValue('message');
        };
        $scope.payrollPlan = {
            list: [],
            visible: false
        };
        $scope.getSystemPlans = function (item) {
            $scope.isPreviewVisible = false;
            $scope.usermanagent.selectedPlanId = null;
            if ($scope.userId) {
                var url = UserManagementService.getUrl('candidatePayrollPlans') + "/" + $scope.userId;
                serverUtilityService.getWebService(url).then(function (data) {
                    setErrorObject(data);
                    if (utilityService.getValue(data, 'status') === 'success') {
                        $scope.payrollPlan.list = utilityService.getInnerValue(data.data, 0, 'details', []);
                        $scope.payrollPlan.visible = true; 
                        var isCandidate = true;
                        $scope.setupFieldJson = UserManagementService.selectFirstPlan(data.data, isCandidate);
                        $scope.employeeOtherData = utilityService.getValue(data, 'employee_detail');
                        $scope.usermanagent.gross = utilityService.getValue(data.employee_detail, 'work_profile_compensation_gross');
                        $scope.usermanagent.ctc = utilityService.getValue(data.employee_detail, 'work_profile_compensation_ctc');
                        var slecttedCompensationPlan = data.data.filter(function filterBySlug(item) {
                            if (item.slug == 'system_plans_compensation_plan') {
                                return true;
                            }
                        });
                        var lastWorkingDateObjIndex = $scope.setupFieldJson.findIndex(function (item){
                            return item.slug == 'system_plan_last_working_date';
                        });
                        if(lastWorkingDateObjIndex > -1){
                            $scope.setupFieldJson[lastWorkingDateObjIndex]['selected'] = $scope.setupFieldJson[lastWorkingDateObjIndex]['selected'] ? utilityService.getDefaultDate($scope.setupFieldJson[lastWorkingDateObjIndex]['selected']) : null;
                        }
                        $scope.isSystemPlanActive = data.segment_completed;
                        if (!$scope.isCompensationHide() && slecttedCompensationPlan.length && angular.isDefined(slecttedCompensationPlan[0].selected) && slecttedCompensationPlan[0].selected) {
                            slecttedCompensationPlan[0].selected = null;
                            //$scope.setPayrolPlanId(slecttedCompensationPlan[0].selected);
                            $scope.usermanagent.isEditPayrollPlan = false;
                            //$scope.getStructureCreditPlanSetting(slecttedCompensationPlan[0].selected, true);
                        } else {
                            $scope.usermanagent.isEditPayrollPlan = true;
                            $timeout(function () {
                                $scope.usermanagent.visible = true;
                            }, 200);
                        }
                    }
                });
            }
        };  
        var isEsiModuleApplicableForThePlane = function  (isEnabled) {
            // console.log(list)
            // // return (list === 'esi_employee' || 'esi_employer') ? true : false;
            // var isEnabled = false;
            // angular.forEach(list, function(val, key) {
            //     if ((utilityService.getValue(val, 'slug')  === 'esi_employee')
            //     && val.debit_structure_settings.is_applicable) {
            //         isEnabled = true;
            //     }
            // })
            if(!isEnabled) {
                // var alwaysApplicable = [4,10];
                $scope.esiModule.isButtonEnabled = utilityService.getInnerValue($scope.esiModule, 'updateButtonAlwaysEnabled', 'month') && utilityService.getValue($scope.esiModule, 'isEnabled');
            } else {
                 $scope.esiModule.isButtonEnabled = isEnabled;
            }


        }      
        var downloadFile = function (uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            window.location.assign(uri);
        };
        $scope.downloadCsv = function (key) {
            var updateUrl = {
                    fileds: UserManagementService.getUrl('downloadUpdateCsv'),
                    plan: UserManagementService.getUrl('downloadSpCsv'),
                },
                url = $scope.usermanagent.isBulkUpdate
                    ? updateUrl[$scope.usermanagent.bulkUpdateType]
                    : UserManagementService.getUrl('downloadCsv');

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    if(angular.isDefined(data.data.csv)){
                        data.data['user-csv'] = data.data.csv;
                    }
                    if (data.status = "success" && angular.isDefined(data.data[key])) {
                        downloadFile(data.data[key], "employee_Data.csv");
                    }
                });
        };
        $scope.groupObject = {};
        $scope.elementObject = {};
        var getGroupDetails = function () {
            var url = UserManagementService.getUrl('allmandatorygroup');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.groupList = data.data;
                angular.forEach($scope.groupList, function (v, k) {
                    if (v.slug == 'work_profile_designation') {
                        $scope.usermanagent.isDesination = true;
                    }
                    if (v.slug == 'work_profile_level') {
                        $scope.usermanagent.isLevel = true;
                    }
                    angular.forEach(v.element_details, function (value, key) {
                        value.isChecked = false;
                    });
                    $scope.allSlug.push(v.slug);
                });
                $scope.conditions = UserManagementService.buildConditionsForCsv($scope.usermanagent.isLevel, $scope.usermanagent.isDesination);
            });
        };
        var getSetupFieldJson = function () {
            serverUtilityService.getWebService(UserManagementService.getUrl('setupFields'))
                .then(function (data) {
                    $scope.setupFieldJson = data;
                });
        };
        var allFilterObject = [{countObject: 'group',isGroup: true},
            {countObject: 'employeeStatus',collection: [1,2,3,4,5],isArray: false,key: 'employee_status'}];
        
        var profileStatus = ['active', 'draft', 'inactive'];
        
        var getAllUsers = function () {
            $scope.allUsers = [];
            $scope.usermanagent.excelFilterVisible = false;
            $scope.resetFacadeCountObject(allFilterObject);
            var url = UserManagementService.getUrl('allUser'),
                params = {
                    permission: $scope.userManagementPermission.action.current.permission_slug
                };

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    angular.forEach(data.data, function (v, k) {
                        if (angular.isDefined(v.full_name) && v.full_name) {
                            v.empStatus = $scope.profileStatus[v.employee_status].label;
                            v.full_name = v.full_name.replace(/\s+/g, " ");
                            if (angular.isDefined(v.work_profile_reporting_manager_detail) 
                                && v.work_profile_reporting_manager_detail[0]) {
                                v.manager = v.work_profile_reporting_manager_detail[0].full_name 
                                    ? v.work_profile_reporting_manager_detail[0].full_name : 'Not Yet Defined';
                            }
                            if (angular.isDefined(v.work_profile_designation_detail) 
                                && v.work_profile_designation_detail[0]) {
                                v.designation = v.work_profile_designation_detail[0].name 
                                    ? v.work_profile_designation_detail[0].name : 'Not Yet Defined';
                            }
                            if (angular.isDefined(v.work_profile_level_detail) 
                                && v.work_profile_level_detail[0]) {
                                v.level = v.work_profile_level_detail[0].name 
                                    ? v.work_profile_level_detail[0].name : 'Not Yet Defined';
                            }
                            v.empStatus = $scope.profileStatus[v.employee_status].label;
                        }

                        if (v.status) {
                            v.profile_status = 'active';
                        } else {
                            if (v.employee_status == 7 || v.employee_status == 22) {
                                v.profile_status = 'inactive';
                            } else {
                                v.profile_status = 'draft';
                            }
                        }

                        $scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject, v);
                    });
                    $scope.allUsers = data.data;
                    angular.copy($scope.allUsers, $scope.allUsersForExcel);
                    $scope.calculateAllFacadeCount($scope.allUsers, 'status', 'profile_status', profileStatus, 'employee_status');
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.usermanagent.listVisible = true;
                    $timeout(function() {
                        $scope.usermanagent.excelFilterVisible = true;
                    }, 1000);
                });
        };        
        var userCallBack = function (data) {
            angular.forEach(data.data, function (v, k) {
                if (angular.isDefined(v.full_name) && v.full_name) {
                    if (angular.isDefined(v.work_profile_reporting_manager_detail) 
                        && v.work_profile_reporting_manager_detail[0]) {
                        v.manager = v.work_profile_reporting_manager_detail[0].full_name 
                            ? v.work_profile_reporting_manager_detail[0].full_name 
                            : 'Not Yet Defined';
                    }
                    if (angular.isDefined(v.work_profile_designation_detail) 
                        && v.work_profile_designation_detail[0]) {
                        v.designation = v.work_profile_designation_detail[0].name 
                            ? v.work_profile_designation_detail[0].name : 'Not Yet Defined';
                    }
                    $scope.activeUsers.push(v);
                }
            })
            self.allSignAuth = loadAll();
            self.allEmployees = loadChipList();
        };
        var getActiveUsers = function () {
            $scope.activeUsers = [];
            var url = UserManagementService.getUrl('allUser') + "?status=true";
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    userCallBack(data);
                });
        };
        var deleteCallback = function (data, item, list, key) {
            key = angular.isDefined(key) ? key : '_id';
            if (data.status == "success") {
                list = list.filter(function (el) {
                    return el[key] !== item[key];
                });
            }
            return list;
        };
        $scope.editIndividualUser = function (candidate) {
           var id = angular.isObject(candidate._id) ? candidate._id.$id : candidate._id;
            if (id) {
                $location.url('frontend/user-management/profile').search({
                    "id": id,
                    "status": candidate.employee_status,
                });
            }
        };
        $scope.viewEmployeeHistory = function (candidate) {
           var id = angular.isObject(candidate._id) ? candidate._id.$id : candidate._id;
            if (id) {
                $location.url('employee-history').search({
                    "id": id,
                    "view":'admin'
                });
            }
        };
        this.deleteCallback = function (data, item, list, key) {
            key = angular.isDefined(key) ? key : 'single';
            if (key == 'single') {
                if (data.status == "success") {
                    list = list.filter(function (el) {
                        return el[_id.$id] !== item[_id.$id];
                    });
                }
                return list;
            }
        };
        $scope.deleteIndividualUser = function (candidate) {
            var url = UserManagementService.getUrl('deleteUser') + "/" + candidate._id.$id;
            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    $scope.allUsers = deleteCallback(data, candidate, $scope.allUsers);
                });
        };
        $scope.deleteMultipleUsers = function () {
            var url = UserManagementService.getUrl('deleteMultipleUsers'),
                payload = {
                    user_ids: $scope.usersIncluded
                };

            if ($scope.usersIncluded.length && $scope.usersIncluded.length > 0) {                
                serverUtilityService.postWebService(url, payload)
                    .then(function (data) {
                        if (data.status == "success") {
                            $scope.usersIncluded = [];
                            $scope.reset();
                            $scope.usersIncluded = [];
                        }
                        utilityService.showSimpleToast(data.message);
                    });
            }
        };
        $scope.activateIndividualUser = function (candidate) {
            var url = UserManagementService.getUrl('activateSingle'),
                payload = {
                    employee_id: candidate._id.$id
                };

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (data.status == "success") {
                        getAllUsers();
                        utilityService.showSimpleToast(data.message);
                    } else {
                        utilityService.showSimpleToast(data.data.message.employee_id[0]);
                    }
                });
        };
        $scope.activeFromProfile = function () {
            if(angular.isUndefined($scope.userId) || !$scope.userId) {
                return false;
            }
            
            var url = UserManagementService.getUrl('activateSingle'),
                payload = {
                    employee_id: $scope.userId
                };

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if (data.status == "success") {
                        utilityService.showSimpleToast(data.message);
                        $scope.backToLocation('frontend/user-management')
                    } else {
                        errorCallback(data, "saveSetupFields")
                    }
                });            
        };
        $scope.activateMultipleUsers = function () {            
            if ($scope.usersIncluded.length && $scope.usersIncluded.length > 0) {
                var url = UserManagementService.getUrl('activateAll'),
                    payload = {
                        employee_id: $scope.usersIncluded
                    };

                serverUtilityService.postWebService(url, payload)
                    .then(function (data) {
                        if (data.status = "success") {
                            $scope.usersIncluded = [];
                            $scope.usermanagent.isAllChecked = false;
                            utilityService.showSimpleToast(data.message);
                            $scope.usersIncluded = [];
                            getAllUsers();
                        }else{
                           $scope.usersIncluded = [];
                           $scope.usermanagent.isAllChecked = false; 
                           alert('something went wrong');
                        }
                    });
            }
        };
        var saveSetupFieldsSuccessErrorCallback = function (response, type) {
            if (response.status === "success") {
                utilityService.showSimpleToast(response.message);
                if (type == 'later') {
                    $location.url('frontend/user-management')
                } else {
                    $location.url('frontend/user-management/profile').search({"id": response.data});
                }
                utilityService.resetAPIError(false, response.message, 'saveSetupFields');
            } else if (response.status === "error") {
                utilityService.resetAPIError(true, response.message, 'saveSetupFields');
            } else if (response.data.status == "error") {
                angular.forEach(response.data.message, function (v, k) {
                    $scope.errorMessages.push(v[0]);
                });
            }
        };
        var activateNextSegment = function (data) {
            angular.forEach($scope.userSegmentList, function (v, k) {
                if (v.order == data.next_step) {
                    v.segment_completed = true;
                }
            });
        };
        var successCallback = function (data, section, isAdded) {
            if (section == "saveSetupFields" && data.data.step_completed 
                && $scope.userSegmentList) {
                if (data.data.next_step != 200) {
                    var object = {
                        _id: data.data.next_step_id,
                        key: data.data.next_step_key
                    };
                    activateNextSegment(data.data);
                    $scope.getSegmentFields(object);
                    $scope.setTab(data.data.next_step_key, object);
                } else if (data.data.next_step == 200) {
                    $scope.isSystemPlanActive = true;
                    $scope.setTab('systemPlan');
                    $scope.getSystemPlans();
                }
            }
            utilityService.resetAPIError(false, data.message, section);
            $scope.errorMessages = [];
            if (angular.isDefined(data.data)) {
                utilityService.showSimpleToast(data.message);
            }
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
            section = angular.isDefined(section) ? section : "saveSetupFields";
            isAdded = angular.isDefined(isAdded) ? isAdded : false;
            data.status === "success" ?
                successCallback(data, section, isAdded) : errorCallback(data, section);
        };
        $scope.selectAll = function(isAll){
            $scope.usermanagent.isAllChecked = isAll;
            if (isAll) {
                angular.forEach($scope.filteredList.list, function (v, k) {
                    if (v.step_completed == 200 && !v.status && (v.employee_status == 2 || v.employee_status == 3)) {
                        var id = angular.isObject(v._id) ? v._id.$id : v._id;
                        $scope.usersIncluded.push(id);
                        v.isChecked = true;
                    }

                });
            } else {
                angular.forEach($scope.filteredList.list, function (v, k) {
                    v.isChecked = false;
                });
                $scope.usersIncluded = [];
            }
        };
        
        $scope.selectDesectUser = function (elementID) {
            var i = $.inArray(elementID, $scope.usersIncluded);
            if (i > -1) {
                $scope.usersIncluded.splice(i, 1);
            } else {
                $scope.usersIncluded.push(elementID);
            }
        };
        $scope.bindFileChangeEvent = function (individulaFlag) {
            $scope.individulaFlag = angular.isDefined(individulaFlag) ? true : false;
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    $scope.isUploaded = true;
                });
            }, 100);
        };
        $scope.saveSetupFields = function (type) {
            $scope.errorMessages = [];
            var url = UserManagementService.getUrl('addUser'),
                payload = UserManagementService.buildDynamicPayloadForSetupField($scope.setupFieldJson, self,  $scope.usermanagent.minimumRepeatValue);
       
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    saveSetupFieldsSuccessErrorCallback(data, type);
                });
        };
        var getBalancingHeadSlug = function() {
            var slug = null;
            angular.forEach($scope.preview.credit, function(value, key) {
                if(value.value_type == "6") {
                    slug = value.slug;
                }
            });

            return slug;
        };        
        $scope.editProfileBySegmentFields = function (flag, method){
            $scope.effectiveDateObj.method = method;
            $scope.effectiveDateObj.flag = flag;
            $scope.effectiveDateObj.date = null;
            $scope.openModal('userManageEffectiveDate','changeEffectiveDate');    
        };
        $scope.saveEffectiveDate = function (){
            $scope.updateFields($scope.effectiveDateObj.flag,$scope.effectiveDateObj.method); 
        };
        $scope.saveAndActivate = function () {
            $scope.updateFields(true);
        };
        $scope.updateFields = function (flag, method) {
            $scope.errorMessages = [];
            var flag = angular.isDefined(flag) ? flag : false;
            if (angular.isDefined($scope.userId) && $scope.userId) {
                if (!$scope.isSet("systemPlan")) {
                    var url = UserManagementService.getUrl('updateUserBySegment') + "/" + $scope.userId + "/" + $scope.segmentID;
                    if(!flag && angular.isDefined(method) && method == 'correction'){
                        url = url + "?update_type=correction";
                    }
                    var payload = UserManagementService.buildDynamicPayloadForSetupField($scope.segmentFieldJson, self,  $scope.usermanagent.minimumRepeatValue);
                    if($scope.segmentID == "6" && $scope.isCompensationHide()){
                        payload.work_profile_compensation_ctc =  payload.work_profile_compensation_ctc ?  payload.work_profile_compensation_ctc : 0;
                        payload.work_profile_compensation_gross =  payload.work_profile_compensation_gross ?  payload.work_profile_compensation_gross : 0;
                    }
                    if($scope.effectiveDateObj.date){
                    payload.effective_date = $scope.effectiveDateObj.date.getTime();
                    }
                    if(payload['errorMessages'].length){
                        $scope.errorMessages = payload['errorMessages'];
                        return false;
                    }else{
                        delete payload['errorMessages'];
                    }
                    serverUtilityService.putWebService(url, payload)
                            .then(function (data) {
                                successErrorCallback(data, "saveSetupFields", true);
                                $scope.closeModal('userManageEffectiveDate');
                            });
                } else if ($scope.isSet("systemPlan")) {
                    var url = UserManagementService.getUrl('systemPlans') + "/" + $scope.userId;
                    if (flag) {
                        url = url + "?to_activate=true";
                    }
                    if(!flag && angular.isDefined(method) && method == 'update'){
                        url = UserManagementService.getUrl('updateSystemPlan') + "/" + $scope.userId;
                    }
                    console.log(!flag && angular.isDefined(method) && method == 'correction');
                    if(!flag && angular.isDefined(method) && method == 'correction'){
                        url = UserManagementService.getUrl('updateSystemPlan') + "/" + $scope.userId + "?update_type=correction";
                    }
                    var payload = UserManagementService.buildDynamicPayloadForSystemField($scope.setupFieldJson);
                    //payload.effective_date = $scope.effectiveDateObj.date.getTime();
                    if (!$scope.isCompensationHide()) {
                        payload.ctc_breakup = UserManagementService.buildCompensationPlanPayLoad($scope.preview.credit, $scope.preview.debit, $scope.preview.finalPreview.ctc.breakup);
                        payload.balancing_head_slug = getBalancingHeadSlug();
                        var payroll_frequency_settings = UserManagementService.buildCompensationPlanFrequencyPayLoad($scope.preview.credit, $scope.preview.debit, $scope.preview.finalPreview.ctc.breakup);
                        if (payroll_frequency_settings.length) {
                            payload.payroll_frequency_settings = payroll_frequency_settings;
                        }
                        if ($scope.preview.finalPreview.totalCtc > 0) {
                            payload.work_profile_compensation_ctc = $scope.preview.finalPreview.totalCtc;
                        }
                        if ($scope.preview.finalPreview.gross > 0) {
                            payload.work_profile_compensation_gross = $scope.preview.finalPreview.gross;
                        }
                    }
                    //return false;
                    serverUtilityService.putWebService(url, payload)
                        .then(function (data) {
                            successErrorCallback(data, "saveSetupFields", true);
                            getIndividualUserDetail();
                            if (data.status == 'success') {
                                $scope.backToLocation('frontend/user-management');  
                                $scope.closeModal('userManageEffectiveDate');
                            }
                        });
                }
            }
        };
        $scope.openPopup = function () {
            return false;
            $('#import-emp-data').appendTo("body").modal('show');
        };
        
        $scope.goToBulkScreen = function (isUpdate, type) {
            isUpdate = isUpdate ? 'true' : 'false';
            $location.url('/frontend/user-management/summary-bulk').search({isUpdate: isUpdate, updateType: type});
        };
        var uploadProgressCallback = function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };
        var uploadSuccessCallback = function (response) {
            if (angular.isDefined(response) && angular.isDefined(response.data) && !response.data.status) {
                getAlphaIndexing(response);
                $scope.data = [];
                angular.forEach(response.data, function (val, key) {
                    var isError = false;
                    angular.forEach(val, function (v, k) {
                        if (angular.isDefined(v.error) && v.error.length) {
                            isError = true;
                        }
                    });
                    isError ? $scope.data.push(val) : null;
                });
                $scope.parsedCsv = $rootScope.errCount == 0 ? response.data : $scope.data;
                $scope.dataList = response.data;
                $timeout(function () {
                    $scope.usermanagent.isBulkVisible = true;
                }, 100);
            }
            if(response.data.status == 'error' ){
               $scope.usermanagent.isBulkVisible = true;
                $scope.errorMessages.push(response.data.message);
            }else if (utilityService.getInnerValue(response, 'data', 'status') === 'success') {
                $scope.usermanagent.isBulkVisible = true;
                utilityService.showSimpleToast(utilityService.getInnerValue(response, 'data', 'message'));
            }
            if ($scope.individulaFlag) {
                $('#import-emp-data').appendTo("body").modal('hide');
                $location.url('frontend/user-management/summary-bulk').search({flag: true});
            }
        };
        
        var uploadErrorCallback = function (response){
            var msg = response.data.message ? response.data.message : "Something went worng.";
            $scope.errorMessages.push(msg);
        };
        
        $scope.changeList = function (key) {
            $scope.parsedCsv = key == 'all' ? $scope.dataList : $scope.data;
        };
        
        $scope.upload = function () {
            $scope.errorMessages = [];
            $scope.usermanagent.isBulkVisible = false;
            var updateUrl = {
                fileds: UserManagementService.getUrl('uploadUpdateCsv'),
                plan: UserManagementService.getUrl('uploadSpCsv'),
            },
            url = $scope.usermanagent.isBulkUpdate 
                ? updateUrl[$scope.usermanagent.bulkUpdateType] : UserManagementService.getUrl('uploadCsv'),           
            data = {
                upload_csv: $scope.file.key
            };
            Upload.upload({
                url: url,
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: data,
            }).then(function (response) {
                uploadSuccessCallback(response);
            }, function (response) {
                uploadErrorCallback(response);
            }, function (evt) {
                uploadProgressCallback(evt);
            });
        };

        /************ CSV ALPHABETS INDEXING ************/       
        $rootScope.employeeList = false;
        $rootScope.childElements = null;
        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        var getAlphaIndexing = function (resp) {
            $rootScope.errCount = 0;
            var data = [];
            angular.forEach(resp.data, function (val, key) {
                data.push(val);
                angular.forEach(val, function (v, k) {
                    if (v.error.length) {
                        $rootScope.errCount += 1;
                    }
                });
            });
            $rootScope.totalRecords = data.length;
            $rootScope.alphIndex = [];
            var len = Object.keys(data[0]).length;
            var counter = -1;
            for (var i = 0; i < len; i++) {
                if (i % 26 == 0 && i != 0) {
                    counter = counter + 1;
                }
                if (i > 25) {
                    $rootScope.alphIndex.push(alphabets[counter % 26] + alphabets[(i % 26)]);
                } else {
                    $rootScope.alphIndex.push(alphabets[i]);
                }
            }
            $scope.flag = true;
        };
        $scope.setChild = function (item) {
            $scope.childElements = item;
        };
        $scope.employeeList = [];
        var getEmployeeDetails = function () {
            var url = UserManagementService.getUrl('getEmployee');
            serverUtilityService.getWebService(url).then(function (data) {
                angular.forEach(data.data, function (v, k) {
                    if (v.full_name) {
                        $scope.employeeList.push(v);
                    }
                });
            });
        };
        $scope.resetForm = function (form) {
            $scope.getSegmentFields($scope.tabId)
        };
        $scope.backToLocation = function (path) {
            $location.url(path);
        };

        /*********** START CHIPS INTEGRATION ***********/
        function querySearchChips(keyword) {
            return keyword ? self.allEmployees.filter(createFilterForChips(keyword)) : [];
        }
        function createFilterForChips(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(approver) {
                return (utilityService.getValue(approver, '_lowername') 
                    && approver._lowername.indexOf(lowercaseQuery) != -1);
        };
        }
        function loadChipList() {
            var list = $scope.activeUsers;
            return list.map(function (c, index) {
                if (utilityService.getInnerValue(c, 'employee_preview', '_id') != utilityService.getValue($routeParams, 'id')) {
                    var object = {
                        id: c._id.$id,
                        name: c.full_name,
                        email: c.email,
                        image: angular.isDefined(c.employee_preview.profile_pic) ? c.employee_preview.profile_pic : 'images/no-avatar.png'
                    };
                    object._lowername = object.name.toLowerCase();
                    return object;
                }                
            });
        }
        /*********** END CHIPS INTEGRATION ***********/

        /************ Start AUTOCOMPLETE Section ************/
        function loadAll() {
            var repos = $scope.activeUsers;
            return repos.map(function (repo) {
                repo.value = repo.full_name.toLowerCase();
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
        $timeout(function () {
            $(".to_be_removed").filter(function () {
                return this.attributes.length == 0 && this.childNodes.length == 0;
            }).remove();
        }, 500);

        /************ End AUTOCOMPLETE Section ************/
        $scope.updatePaginationSettings('user_management_summary');

        /********************Start Compensation Plan****************/
        $scope.multiObj = {
            valueObj: {},
            formulaObj: {},
            discritionComponents: [],
            creditList: [],
            ctcList: [],
            debitList: []
        };
        
        //round calculated value        
        $scope.roundUpBreakup = function (calculatedValue) {
            var roundedVal;
            if ($scope.usermanagent.roundType == 1) {
                roundedVal = Math.round(calculatedValue)
            } else if ($scope.usermanagent.roundType == 2) {
                roundedVal = calculatedValue.toFixed(parseInt($scope.usermanagent.roundUpto));
            }
            return roundedVal;
        };
        
        //toggle editing of payroll plan
        $scope.togglePlanEditing = function (){
            $scope.usermanagent.isEditPayrollPlan = !$scope.usermanagent.isEditPayrollPlan;
        };        
        $scope.setPayrolPlanId = function (planId){
            $scope.usermanagent.selectedPlanId = planId;
        };
        
        //To Calculate Esi
        var calculateEsi = function (list, grossSum) {
            angular.forEach(list, function (component, key) {
                if ((component.slug == 'esi_employee' || component.slug == 'esi_employer') && $scope.payrollSettings.esiList.enable_esi_contribution && component.value_type == 1) {
                    var percent = component.slug == 'esi_employee' ? $scope.payrollSettings.esiList.esi_emp_contribution : $scope.payrollSettings.esiList.esi_employer_contribution;
                    var monthlyAmt = grossSum / 12;
                    if ($scope.payrollSettings.esiList.is_continue_esi_contribution == 1) {
                        if (Math.round(monthlyAmt) > $scope.payrollSettings.esiList.statutory_max_grass_amt) {
                            component.value = 0;
                            component.roundOffValue = $scope.roundUpBreakup(component.value);
                        } else {
                            component.value = grossSum * (percent / 100);
                            component.roundOffValue = $scope.roundUpBreakup(component.value);
                        }
                    } else if ($scope.payrollSettings.esiList.is_continue_esi_contribution == 2) {
                        component.value = 0;
                        component.roundOffValue = $scope.roundUpBreakup(component.value);
                    }
                }
                if ((component.slug == 'esi_employee' || component.slug == 'esi_employer') && !$scope.payrollSettings.esiList.enable_esi_contribution) {
                    component.value = 0;
                    component.roundOffValue = $scope.roundUpBreakup(component.value);
                }
            });
        };
        
        //To Calculate Balancing Head
          var calculateBalancingHead = function (gross) {
            var credit_sum = 0;
            angular.forEach($scope.preview.credit, function (component, key) {
                if (component.value_type != "6") {
                    var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                    credit_sum += val;
                }
            });
            $scope.preview.finalPreview.tempBalance = gross - credit_sum;
            $scope.preview.finalPreview.balance = $scope.preview.finalPreview.tempBalance;
            angular.forEach($scope.preview.credit, function (component, key) {
                if (component.value_type == "6") {
                    component.value = $scope.preview.finalPreview.tempBalance;
                    component.roundOffValue = $scope.roundUpBreakup(component.value);
                }
                if (component.payout_frequency == "4") {
                    component.frequency = frequencyObj;
                }
            });
        };

        //To Calculate Gross Value
        var calculateGross = function () {
            var ctc_breakup_sum = 0;
            var esiCount = 0; 
            var perquisiteSum = 0;
            $scope.perquisiteSum = 0;

            angular.forEach($scope.preview.finalPreview.ctc.breakup, function (component, key) {
                if (component.value_type == 8) {
                    var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                    perquisiteSum += val;
                } else {
                    if((component.slug == 'esi_employee' || component.slug == 'esi_employer') 
                        && component.value_type == 1){
                        esiCount += 1;
                    }
                    if (component.slug != 'esi_employee' && component.slug != 'esi_employer') {
                        var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                        if(component.slug === 'lwf_employer' && utilityService.getInnerValue($scope.statutoryCompliances, 'lwf', 'is_lwf_outside_emp_ctc')) {
                            ctc_breakup_sum += 0;
                        } else {
                            ctc_breakup_sum += val;
                        }
                    } else if((component.slug == 'esi_employee' || component.slug == 'esi_employer') && component.value_type != 1){
                        var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                        ctc_breakup_sum += val;
                    }
                }
            });

            
            $scope.perquisiteSum = parseFloat(perquisiteSum);
            // This number 1.0325 is based on employer ESI contribution and will applicable 
            // only if plan is based on CTC and having ESI as component, earlier it was 1.0475
            var gross = ($scope.preview.finalPreview.totalCtc - ctc_breakup_sum)/ 1.0325;
            var monthlyGross = gross / 12;
            // || $scope.preview.finalPreview.totalCtc > 252000
            if (!$scope.payrollSettings.esiList.enable_esi_contribution 
                || $scope.payrollSettings.esiList.is_continue_esi_contribution == 2 
                || Math.round(monthlyGross) > $scope.payrollSettings.esiList.statutory_max_grass_amt 
                || esiCount == 0) {
                gross = $scope.preview.finalPreview.totalCtc - ctc_breakup_sum;
            }

            $scope.preview.finalPreview.gross = $scope.roundUpBreakup(gross);
            if ($scope.perquisiteSum > 0) {
                $scope.preview.finalPreview.gross = $scope.preview.finalPreview.gross - $scope.perquisiteSum;
            }
            //console.log($scope.preview.finalPreview.gross, $scope.perquisiteSum);

            calculateEsi($scope.preview.finalPreview.ctc.breakup, gross);
            calculateEsi($scope.preview.debit, gross);
            calculateBalancingHead(gross - perquisiteSum);
        };
        
       // To Calculate CTC Value
        var calculateCtc = function (gross){
            var ctc_breakup_sum = 0;
            
            angular.forEach($scope.preview.finalPreview.ctc.breakup, function (component, key) {
                var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                if(component.slug === 'lwf_employer' && utilityService.getInnerValue($scope.statutoryCompliances, 'lwf', 'is_lwf_outside_emp_ctc')) {
                    ctc_breakup_sum += 0;
                } else {
                    ctc_breakup_sum += val;
                }
            });

            $scope.preview.finalPreview.totalCtc = $scope.roundUpBreakup(ctc_breakup_sum + parseFloat(gross));
        }; 

        var calculateDebit = function (preview){
            var debit_sum = 0;
            
            angular.forEach(preview.debit, function (component, key) {
                var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                if(val > 0) {
                    debit_sum += val;
                }
            });

            $scope.preview.finalPreview.totalDebit = $scope.roundUpBreakup(debit_sum);
        }; 
        
        //To Extract All Component Used in Formula recursive method
        var extractword = function (str, start, end, strtSrchIndex) {
            var startindex = str.indexOf(start, strtSrchIndex);
            var endindex = str.indexOf(end, startindex);
            strtSrchIndex = endindex + 1;
            if (startindex != -1 && endindex != -1 && endindex > startindex) {
                var slug = str.substring(startindex + 1, endindex);
                var i = $.inArray(slug, $scope.compArray);
                if (i < 0) {
                    $scope.compArray.push(slug);
                }
                extractword(str, "{", "}", strtSrchIndex);
            } else {

                return $scope.compArray;
            }
        };
        
        //To Create Breakup List
        var createList = function (list, collection, settingKey, syncFlag) {

            angular.forEach(list, function (val, key) {

                if (syncFlag && settingKey === 'debit_structure_settings'
                    && (utilityService.getValue(val, 'slug')  === 'esi_employee')
                    && utilityService.getInnerValue(val, 'debit_structure_settings', 'is_applicable', false)) {
                        $scope.esiModule.isEnabled = true;
                }

                if (!syncFlag && settingKey === 'debit_structure_settings' 
                    && (utilityService.getValue(val, 'slug')  === 'esi_employee')) {
                        isEsiModuleApplicableForThePlane(utilityService.getInnerValue(val, 'debit_structure_settings', 'is_applicable', false));
                }          
                if (angular.isDefined(val[settingKey]) && val[settingKey].is_applicable) {
                    val[settingKey]['is_part_CTC'] = val.is_part_CTC;
                    val[settingKey]['is_part_Gross'] = val.is_part_Gross;
                    val[settingKey]['is_arrear_component'] = utilityService.getValue(val, 'is_arrear_component', false);
                    if (val[settingKey].value_type == 2) {
                        val[settingKey].value = parseInt(val[settingKey].costant_value);
                        val[settingKey].roundOffValue = val[settingKey].value;
                        val[settingKey].isValue = true;
                    } else if (val[settingKey].value_type == 1) {
                        $scope.compArray = [];
                        if (angular.isDefined(val[settingKey].value) && val[settingKey].value != null) {
                            val[settingKey].isValue = true;
                            val[settingKey].roundOffValue = syncFlag ? val[settingKey].value : $scope.roundUpBreakup(val[settingKey].value);
                        } else {
                            val[settingKey].value = null;
                            val[settingKey].roundOffValue = null;
                            val[settingKey].isValue = false;
                        }
                        var compArry = extractword(val[settingKey].formula, "{", "}", 0);
                        val[settingKey].tempFormula = val[settingKey].formula;
                        val[settingKey].formulaArray = $scope.compArray;
                        val[settingKey].discritionFormula = val[settingKey].formula;
                        $scope.multiObj.formulaObj[val.slug] = val[settingKey].formula;
                    } else if (val[settingKey].value_type == 6) {
                        val[settingKey].isValue = true;
                        if (angular.isDefined(val[settingKey].value) && val[settingKey].value != null) {
                            val[settingKey].roundOffValue = syncFlag ? val[settingKey].value : $scope.roundUpBreakup(val[settingKey].value);
                        }
                    } else {
                        val[settingKey].isValue = true;
                        val[settingKey].value =  angular.isDefined(val[settingKey].value) ? val[settingKey].value : 0;
                        val[settingKey].roundOffValue = syncFlag ? val[settingKey].value : $scope.roundUpBreakup(val[settingKey].value);
                    }
                    if (val[settingKey].value_type == 4 || val[settingKey].value_type == 8) {
                        $scope.multiObj.discritionComponents.push(val.slug);
                    }
                    $scope.multiObj.valueObj[val.slug] = val[settingKey].value;
                    if (val.is_part_Gross) {
                        collection.push(val[settingKey]);
                    } else {
                        $scope.multiObj.ctcList.push(val[settingKey]);
                    }
                }

                /***** Start LWF & PT Calculation Section *****/
                if (!utilityService.getInnerValue($scope.generateBreakup, "error", "status")) {                    
                    if (val.slug === 'lwf_employee' && angular.isDefined(val[settingKey])) {
                        val[settingKey].value = utilityService.getInnerValue($scope.statutoryCompliances, "lwf", val.slug);
                    }

                    if (val.slug === 'lwf_employer' && angular.isDefined(val[settingKey])) {
                        val[settingKey].value = utilityService.getInnerValue($scope.statutoryCompliances, "lwf", val.slug);
                    }

                    if (val.slug === 'professional_tax' && angular.isDefined(val[settingKey])) {  
                        var grossToCalculatePT = $scope.usermanagent.gross;
                        if($scope.usermanagent.breakupType == 2 && grossToCalculatePT == 0)  {
                            grossToCalculatePT = $scope.usermanagent.ctc;
                        }
                        val[settingKey].value = UserManagementService.getProfessionalTaxAmount(grossToCalculatePT, $scope.statutoryCompliances.pt);
                    }                    
                }
                /***** End LWF & PT Calculation Section *****/
            });
        };

          //To Evaluate Formula 
          var multipleFormulaCalculation = function (flag, syncFlag, discrtionItem) {
            flag = angular.isDefined(flag) ? flag : false;
            if (!flag && angular.isDefined(discrtionItem)) {
                $scope.multiObj.valueObj[discrtionItem.slug] = discrtionItem.value == null ? 0 : discrtionItem.value;
            }

            function ExtractFormulaName (str) {
                var regexToExtract = /[^{\}]+(?=})/g;
                var ExtractedValue = str.match(regexToExtract);
                return ExtractedValue[0] ? ExtractedValue[0] : null;
            }

            function evaluateFormula(item) {
                $scope.compArray = [];
                var discritionFlag = false;
                var slugValObj = {};
                
                if (flag && $window._.intersection($scope.multiObj.discritionComponents, item.formulaArray).length > 0) {
                    angular.forEach($scope.multiObj.formulaObj, function (val, key) {
                        if (item.discritionFormula.indexOf('{' + key + '}') > -1) {
                            item.discritionFormula = item.discritionFormula.replace('{' + key + '}', '(' + val + ')');
                        }
                    });
                    var compArry = extractword(item.discritionFormula, "{", "}", 0);
                    item.formulaArray = $scope.compArray;
                    item.isConsistDiscition = true;
                } else if ($scope.isValueAffectedByStatutory && $scope.multiObj.valueObj[ExtractFormulaName(item.formula)]) {
                    item.tempFormula = item.formula.replace('{' + ExtractFormulaName(item.formula) + '}', '(' + $scope.multiObj.valueObj[ExtractFormulaName(item.formula)] + ')')
                    $scope.isValueAffectedByStatutory = false;
                } else {
                    angular.forEach($scope.multiObj.formulaObj, function (val, key) {
                        if (item.tempFormula.indexOf('{' + key + '}') > -1) {
                            item.tempFormula = item.tempFormula.replace('{' + key + '}', '(' + val + ')');
                        }
                    });
                    var compArry = extractword(item.tempFormula, "{", "}", 0);
                    item.formulaArray = $scope.compArray;
                }
                if (!flag) {
                    var discrtionFormula = item.tempFormula;
                }
                for (var i = 0; i < item.formulaArray.length; i++) {
                    if ($scope.multiObj.discritionComponents.indexOf(item.formulaArray[i]) != -1 && $scope.multiObj.valueObj[item.formulaArray[i]] == 0) {
                        item.isValue = true;
                        item.isConsistDiscition = true;
                        if (flag) {
                            discritionFlag = true;
                            break;
                        }
                    }
                    if (angular.isDefined($scope.multiObj.valueObj[item.formulaArray[i]]) && ($scope.multiObj.valueObj[item.formulaArray[i]] || $scope.multiObj.valueObj[item.formulaArray[i]] ==0)) {
                        slugValObj[item.formulaArray[i]] = $scope.multiObj.valueObj[item.formulaArray[i]];
                        var find = '{' + item.formulaArray[i] + '}';
                        var regex = new RegExp(find, 'g');
                        if (!flag) {
                            discrtionFormula = discrtionFormula.replace(regex, $scope.multiObj.valueObj[item.formulaArray[i]]);
                        } else if($window._.intersection($scope.multiObj.discritionComponents, item.formulaArray).length > 0){
                            item.discritionFormula = item.discritionFormula.replace(regex, $scope.multiObj.valueObj[item.formulaArray[i]]);
                        } else {
                            item.tempFormula = item.tempFormula.replace(regex, $scope.multiObj.valueObj[item.formulaArray[i]]);
                        }
                    }
                }


                if (discritionFlag) {
                    return false;
                }

                if (Object.keys(slugValObj).length == item.formulaArray.length) {

                    item.isValue = true;
                    if (!flag) {
                        var newValue = $scope.$eval(discrtionFormula);
                    } else if ($window._.intersection($scope.multiObj.discritionComponents, item.formulaArray).length > 0 && flag) {
                        newValue = $scope.$eval(item.discritionFormula)
                    } else {
                        newValue = $scope.$eval(item.tempFormula);
                    }
                    if (!$scope.norLankaFlag) {
                        if ((item.slug == "pf_employee_applicable" || item.slug == "pf_employer_applicable") 
                            && $scope.payrollSettings.pfList.enable_pf_contribution) {
								
							if (utilityService.getInnerValue($scope.payrollSettings, 'pfList', 'pf_statutory_minimum_relation') == 2 ) {
                                if(!!utilityService.getValue(item, "statutory_max_value") 
                                   && newValue >= utilityService.getValue(item, "statutory_max_value")) {
                                  newValue = utilityService.getValue(item, "statutory_max_value");
                                }
                            } else {
								console.log(newValue)
                              var monthlyAmt = newValue;
                              if ( Math.round(monthlyAmt) > $scope.payrollSettings.pfList.statutory_min_amt) {
                                newValue = 21600;
                              }
                            }
                          }
                          if ((item.slug == "pf_employee_applicable" ||
                              item.slug == "pf_employer_applicable") &&
                            !$scope.payrollSettings.pfList.enable_pf_contribution ) {
                            newValue = 0;
                          }                     
                    }


                    if(utilityService.getValue(item, 'statutory_min_value')){
                        var totalAmount = newValue;
                        var minAmount = utilityService.getValue(item, 'statutory_min_value') 
                        newValue =  totalAmount < minAmount ? minAmount : totalAmount;
                        $scope.isValueAffectedByStatutory = true;
                    }

                    if(utilityService.getValue(item, 'statutory_max_value')){
                        var totalAmount = newValue;
                        var maxAmount = utilityService.getValue(item, 'statutory_max_value') 
                        newValue =  totalAmount > maxAmount ? maxAmount : totalAmount;
                        $scope.isValueAffectedByStatutory = true;
                    }



                    item.value = newValue;
                    item.roundOffValue = $scope.roundUpBreakup(newValue);
                    $scope.multiObj.valueObj[item.slug] = newValue;
                }
            };            
            //To Calculate Formula
            function calculateValue(credit, debit, ctc) {
                var creditCount = 0;
                var debitCount = 0;
                var ctcCount = 0;
                angular.forEach(credit, function (val, key) {
                    if (val.value_type == 1) {
                        if (!flag && val.isConsistDiscition) {
                            evaluateFormula(val);
                        } else if(flag) {
                            evaluateFormula(val);
                        }
                    }
                    if (val.isValue) {
                        creditCount += 1;
                    }
                });
                angular.forEach(debit, function (val, key) {
                    if (val.value_type == 1) {
                        if (!flag && val.isConsistDiscition) {
                            evaluateFormula(val);
                        } else if(flag) {
                            evaluateFormula(val);
                        }
                    }
                    if (val.isValue) {
                        debitCount += 1;
                    }
                });
                angular.forEach(ctc, function (val, key) {
                    if (val.value_type == 1) {
                       if (!flag && val.isConsistDiscition) {
                            evaluateFormula(val);
                        } else if(flag) {
                            evaluateFormula(val);
                        }
                    }
                    if (val.isValue) {
                        ctcCount += 1;
                    }
                });
                if (creditCount != credit.length || debitCount != debit.length || ctcCount != ctc.length) {
                    calculateValue($scope.multiObj.creditList, $scope.multiObj.debitList, $scope.multiObj.ctcList)
                } else {
                    return 1;
                }
            };
            // For perquisite type compenent, no need to caluculate value because its similar to admin discretion
            if (!syncFlag && utilityService.getValue(discrtionItem, 'value_type') != 8) {
                calculateValue($scope.multiObj.creditList, $scope.multiObj.debitList, $scope.multiObj.ctcList);
            }
            $scope.preview.credit = $scope.multiObj.creditList;
            $scope.preview.debit = $scope.multiObj.debitList;
            $scope.preview.finalPreview.ctc.breakup = $scope.multiObj.ctcList;
            
            if ($scope.usermanagent.breakupType == 1) {
                if (!syncFlag) {
                    calculateBalancingHead($scope.multiObj.gross);
                    calculateEsi($scope.preview.finalPreview.ctc.breakup, $scope.multiObj.gross);
                    calculateEsi($scope.preview.debit, $scope.multiObj.gross);
                    calculateCtc($scope.multiObj.gross);
                    $scope.usermanagent.ctc = $scope.preview.finalPreview.totalCtc;
                }
            }
            
            if ($scope.usermanagent.breakupType == 2 && !syncFlag) {
                calculateGross();
                $scope.usermanagent.gross = $scope.preview.finalPreview.gross;                
            }   

            /*** When Compensation plan is selected Start ***/
            if (syncFlag) {
                var credit_breakup_sum = 0;
                angular.forEach($scope.preview.credit, function (component, key) {
                    var val = isNaN(parseFloat(component.value)) ? 0 : parseFloat(component.value);
                    credit_breakup_sum += val;
 
                    if (component.value_type == "6") {
                        $scope.preview.finalPreview.balance = val;
                    }
                });
                $scope.preview.finalPreview.gross = $scope.roundUpBreakup(utilityService.getValue($scope.usermanagent, 'gross'), 0);
                calculateCtc($scope.preview.finalPreview.gross);
            }

            /*** When Compensation plan is selected End ***/
            $scope.getDeductedAmount();
            $timeout(function () {
                $scope.usermanagent.visible = true;
                $scope.isPreviewVisible = true;
            }, 200);
        };     
        
        var createSalaryStructure = function (creditList, debitList, syncFlag) {
            $scope.isPreviewVisible = false;
            $scope.preview.credit = [];
            $scope.preview.debit = [];
            $scope.preview.finalPreview.ctc = {};
            $scope.multiObj = {
                valueObj: {},
                formulaObj: {},
                discritionComponents: [],
                creditList: [],
                ctcList: [],
                debitList: [],
                gross: null,
                ctc: null
            };
            if ($scope.usermanagent.breakupType == 2) {
                $scope.multiObj.ctc = $scope.usermanagent.ctc
                $scope.multiObj.valueObj.work_profile_compensation_ctc = $scope.multiObj.ctc;
                $scope.preview.finalPreview.totalCtc = $scope.multiObj.ctc;
            }
            if ($scope.usermanagent.breakupType == 1) {
                $scope.multiObj.gross = $scope.usermanagent.gross;
                $scope.multiObj.valueObj.gross = $scope.multiObj.gross;
                $scope.preview.finalPreview.gross = $scope.multiObj.gross;
            }
            createList(debitList, $scope.multiObj.debitList, 'debit_structure_settings', syncFlag);
            createList(creditList, $scope.multiObj.creditList, 'credit_structure_settings', syncFlag);
            multipleFormulaCalculation(true, syncFlag);
        };
        
        $scope.getStructureCreditPlanSetting = function (planId, syncFlag) {
            syncFlag = angular.isDefined(syncFlag) ? syncFlag : false;
            $q.all([
                serverUtilityService.getWebService(UserManagementService.getUrl('creditStructure') + "/" + planId),
                serverUtilityService.getWebService(UserManagementService.getUrl('debitStructure') + "/" + planId),
            ]).then(function (data) {
                createSalaryStructure(data[0].data, data[1].data, syncFlag);
            });
        };
        
        $scope.formulaCalculation = function (item) {
            multipleFormulaCalculation(false, false, item);
        };
        
        $scope.payrollSettings = {
            pfList: null,
            esiList: null
        };
        var getPfDetails = function () {
            serverUtilityService.getWebService(UserManagementService.getUrl('pf'))
                .then(function (data) {
                    $scope.payrollSettings.pfList = data.data;
                });
        };
        var getEsiDetails = function () {
            serverUtilityService.getWebService(UserManagementService.getUrl('esi'))
                .then(function (data) {
                    $scope.payrollSettings.esiList = data.data;
                });
        };
        $scope.getDeductedAmount = function (flag) {
            var debitTotal = 0;
            flag = angular.isDefined(flag) ? flag : false;            
            angular.forEach($scope.preview.debit, function (v, key) {
                if (v.payout_frequency == "4" && flag) {
                    v.frequency = frequencyObj;
                }
                if (angular.isDefined(v.value)) {
                    v.value = isNaN(parseFloat(v.value)) ? 0 : parseFloat(v.value);
                    debitTotal += v.value;
                }
            });
            //$scope.preview.totat_deducted = debitTotal.toFixed(2);
            $scope.preview.totat_deducted = $scope.roundUpBreakup(debitTotal);
        };
        $scope.handleFrequency = function (frequency, index, section) {
            $scope.frequency = {};
            $scope.frequencyIndex = index;
            angular.copy(frequency, $scope.frequency);
            $scope.frequency.section = section;
            $("#payout-frequency-setting-um").appendTo('body').modal('show');
        };
        $scope.setFrequency = function (section) {
            var list = section == 'credit' ? $scope.preview.credit : section == 'ctc' ? $scope.preview.finalPreview.ctc.breakup : $scope.preview.debit;
            angular.forEach(list, function (row, index) {
                if (index == $scope.frequencyIndex && row.payout_frequency == "4") {
                    row.frequency = $scope.frequency;
                }
            });
            $("#payout-frequency-setting-um").modal('hide');
        };
        $scope.resetKey = function (model, key) {
            if (key == 'payout_frequency') {
                if (model[key] != 2) {
                    model['payout_x_cycle_value'] = null;
                    model['on_first_payroll_cycle'] = null;
                } else if (model[key] != 3) {
                    model['once_on_x_payroll_cycle'] = null;
                    model['once_on_payroll_cycle'] = null;
                }
            } else if (key == 'once_on_payroll_cycle') {
                if (model[key] != 1) {
                    model['once_on_x_payroll_cycle'] = null;
                }
            }
        };
        /********************End Compensation Plan****************/

        $scope.filteredList = {
            list: [],
            csvList: [],
        };        
        $scope.$watch('filteredList.list', function (newVal, oldVal) {
            if (angular.isUndefined(newVal)) {
                angular.copy([], $scope.filteredList.csvList);
                $scope.usermanagent.totalActiveUser = 0;
                return false;
            }          

            if(newVal != oldVal) {
                var activeList = newVal.filter(function (item) {
                    return item.status;
                });
                angular.copy(newVal, $scope.filteredList.csvList);
                $scope.usermanagent.totalActiveUser = activeList.length;
            }
        }, true);
        $scope.csvColumn = {
            'Candidate Detail': 'full_name',
            'Employee Id': 'employee_id',
            'Employee Status': 'empStatus',
            'Reporting Manager': 'manager',
            'Designation': 'designation',
            'level': 'level',
            'Date of Joining': 'joining_date'
        };        
        $scope.addMoreFieldSet = function (item){
            item.maxShowFirstTime += 1;
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
            item.child_detail.splice(index, 1);
            item.child_detail.push(removedItem);
            if (item.min_repeat == 0) {
                item.maxShowFirstTime = item.maxShowFirstTime > 1 ? item.maxShowFirstTime : 0;
            }
            if (item.maxShowFirstTime > 1) {
                item.maxShowFirstTime = item.maxShowFirstTime - 1;
            }
        };        
        $scope.removeFieldSet = function (item, repeatElement, index) {
            var removedItem = repeatElement;
            var payload = UserManagementService.buildRemoveRepeateChildPayload(removedItem, item, index)

            if (payload.isRemoveByDB) {
                var url = UserManagementService.getUrl('removeRepeatedFiledset') + "/" + $scope.userId,
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
                resetRepeateChild(item, removedItem, index);
            }
        };
        $scope.calculateAge = function (value){
            var d = new Date();
            var ageDifMs = d.getTime() - value.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            var year = Math.abs(ageDate.getUTCFullYear() - 1970);
            angular.forEach($scope.segmentFieldJson, function (v, k) {
                if (v.slug == 'personal_profile_age') {
                    v.value = year;
                }
            });
        };
        
        $scope.diffrentTypeDateCollection = {
            work_profile_confirmation_date: {
                date: null,
                day:null
            },
            work_profile_retirement_date:{
                date: null,
                day:null
            }
        };
        $scope.calculateTenure = function (value, flag) {
            if (!value) {
                return;
            }
            $scope.diffrentTypeDateCollection.work_profile_confirmation_date.date = value;
            flag = angular.isDefined(flag) ? flag : false;
            var d = new Date(), message = "", monthsTosend = 0, dayToadd = null;
            if (value.getTime() < d.getTime()) {
                var diff = Math.floor(d.getTime() - value.getTime());
                var totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
                monthsTosend = Math.floor(totalDays / 31);                
            }
            
            message = utilityService.calculateTenureUsingMoment(value);

            if (!flag) {
                angular.forEach($scope.segmentFieldJson, function (v, k) {
                    if (v.slug == 'work_profile_tenure') {
                        v.valueTemp = message;
                        v.value = monthsTosend;
                    }
                    if(v.slug == 'work_profile_probation_period'){
                        dayToadd = v;
                    }
                    if(v.slug == 'work_profile_confirmation_date'){
                        v.value = $scope.calculateDates(dayToadd, true);
                    }
                });
            } else {
                return message;
            }
        };        
        $scope.calculateDates = function (dayToaddObj, flag) {
            flag = angular.isDefined(flag) ? flag : false;
            var daeSlugObj = {work_profile_probation_period: 'work_profile_confirmation_date', work_profile_retirement_age: 'work_profile_retirement_date'},
            finalDate = null, year = 0,
            dateSlug = daeSlugObj[dayToaddObj.slug];
            if(dateSlug == 'work_profile_retirement_date'){
                $scope.diffrentTypeDateCollection[dateSlug].date = dayToaddObj && dayToaddObj.birthday? utilityService.getDefaultDate(dayToaddObj.birthday) : null;
                $scope.diffrentTypeDateCollection[dateSlug].day = 0;
                year =  dayToaddObj.value;
            }else{
                $scope.diffrentTypeDateCollection[dateSlug].day = dayToaddObj ? dayToaddObj.value : null;
                year = 0;
            }
            if (dayToaddObj.value && $scope.diffrentTypeDateCollection[dateSlug].date) {
                finalDate = new Date(
                    $scope.diffrentTypeDateCollection[dateSlug].date.getFullYear() + parseInt(year),
                    $scope.diffrentTypeDateCollection[dateSlug].date.getMonth(),
                    $scope.diffrentTypeDateCollection[dateSlug].date.getDate() + parseInt($scope.diffrentTypeDateCollection[dateSlug].day)
                );
            }
            if (flag) {
                return finalDate;
            } else {
                angular.forEach($scope.segmentFieldJson, function (v, k) {
                    if (v.slug == dateSlug) {
                        v.value = v.slug  == 'work_profile_retirement_date' ? utilityService.dateFormatConvertion(finalDate):  finalDate;
                    }
                });
            }
        };        
        $scope.changeSearchText = function (search) {
            $scope.name_filter = {};
            $scope.usermanagent.searchText = search == 'full_name' ? 'Search by Name' : 'Search by Employee Code';
        };

        /********** Start User Management Permission Section **********/
        $scope.userManagementPermission = {
            action: {
                list: [],
                current: null,
                visible: false
            }
        };
        var extractReportFromPermissionList = function(data) {
            var permissionSlug = 'can_view_attendance';

            angular.forEach(data.data, function(value, key) {
                value._id = angular.isObject(value._id) ? value._id.$id : value._id;
                if(value.permission_slug.indexOf('report') >= 0) {
                    data.data.splice(key, 1);
                }
                if(value.permission_slug == permissionSlug) {
                    $scope.userManagementPermission.action.isLiveTrackerVisible = true;
                }
            });
        };
        var getActionListCallback = function(data) {
            extractReportFromPermissionList(data);            
            $scope.userManagementPermission.action.list = data.data;
            $scope.userManagementPermission.action.current = data.data.length ? data.data[0] : null;
            $scope.userManagementPermission.action.visible = true;
            $scope.usermanagent.isSuperAdmin = $scope.isActionCreate();

            // Here 1 == 1 has been used to by-pass user management permission for generating break-up
            if(data.data.length || 1 == 1) {  
                getIndividualUserDetail();
                if ($scope.userId) {
                    getUserSegmentList();
                    $scope.getSystemPlans();
                    $scope.setTab('systemPlan', null); 
                    getSalaryBreakupType(); 
                    getActiveUsers();
                    getPfDetails();
                    getEsiDetails();                     
                } else {
                    getGroupDetails();
                    getSetupFieldJson();
                    getAllUsers();
                }
            }
        };
        var getActionList = function() {
            var url = UserManagementService.getUrl('actionAdmin') + "/user_management";
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    getActionListCallback(data);
                });
        };
        getActionList();        
        $scope.changeAction = function(item) {
            $scope.usermanagent.listVisible = false;
            $scope.userManagementPermission.action.current = item;
            getAllUsers();
        };
        var hasUserManagementPermission = function(permissionName) {
            var isGiven = false;

            angular.forEach($scope.userManagementPermission.action.list, function(value, key) {
                if(!isGiven && value.permission_slug === permissionName) {
                    isGiven = true;
                }                
            });

            return isGiven;
        };
        $scope.isActionView = function() {            
            return hasUserManagementPermission('can_view_users');
        };
        $scope.isActionCreate = function() {            
            return hasUserManagementPermission('can_view_create_users');
        };        
        $scope.isCompensationHide = function() {            
            return hasUserManagementPermission('can_edit_without_payroll');
        };
        /********** End User Management Permission Section **********/
        
        /***** Start Recruitment Breakup Section ******/        
        $scope.breakupObject = UserManagementService.buildDefaultBreakupObject();
        var getMonthlyAmount = function (annualAmount) {
            var monthlyAmount = annualAmount/12,
                monthlyAmountString = monthlyAmount.toString();

            return monthlyAmountString.indexOf('.') >= 0 ? monthlyAmount.toFixed(2) : monthlyAmount;
        };
        var filterNullableAmountIndividually = function (list, keyname) {
            angular.forEach(list, function (item, index) {
                if (utilityService.getValue(item, 'value')) {
                    var object = {
                        component_name: utilityService.getValue(item, 'component_name'),
                        value: utilityService.getValue(item, 'value'),
                        // Here isOtherChecked is an additional condition to check either 
                        // Excluded from monthly breakup, gross & ctc is checked or not
                        isChecked: utilityService.getValue(item, 'isChecked', false)
                            || utilityService.getValue(item, 'isOtherChecked', false)
                    };
                    
                    if (object.value) {
                        object.value_monthly = getMonthlyAmount(utilityService.getValue(object, 'value', 0));
                    }

                    $scope.breakupObject[keyname].push(object);
                }                
            });
        };
        var filterNullableAmount = function (preview) {
            $scope.breakupObject = UserManagementService.buildDefaultBreakupObject();

            filterNullableAmountIndividually(preview.credit, 'credit');
            filterNullableAmountIndividually(preview.finalPreview.ctc.breakup, 'ctc');
            filterNullableAmountIndividually(preview.debit, 'debit');

            calculateDebit(preview)    

            $scope.breakupObject.ctc_amount = parseFloat(utilityService.getInnerValue(preview, 'finalPreview', 'totalCtc', 0));
            $scope.breakupObject.isCTCExcluded = utilityService.getValue($scope.breakupObject, 'isCTCExcluded', false);
            $scope.breakupObject.ctc_amount_monthly = $scope.breakupObject.isCTCExcluded 
                ? 0 : getMonthlyAmount($scope.breakupObject.ctc_amount);

            $scope.breakupObject.gross_amount = parseFloat(utilityService.getInnerValue(preview, 'finalPreview', 'gross', 0));
            $scope.breakupObject.isGrossExcluded = utilityService.getValue($scope.breakupObject, 'isGrossExcluded', false);
            $scope.breakupObject.gross_amount_monthly = $scope.breakupObject.isGrossExcluded
                ? 0 : getMonthlyAmount($scope.breakupObject.gross_amount);

            $scope.breakupObject.debit_amount = parseFloat(utilityService.getInnerValue(preview, 'finalPreview', 'totalDebit', 0));
            $scope.breakupObject.isDEBITExcluded = utilityService.getValue($scope.breakupObject, 'isDEBITExcluded', false);
            $scope.breakupObject.debit_amount_monthly = $scope.breakupObject.isDEBITExcluded 
                ? 0 : getMonthlyAmount($scope.breakupObject.debit_amount);
                        
            $scope.breakupObject.balance = parseFloat(utilityService.getInnerValue(preview, 'finalPreview', 'balance', 0));
            $scope.breakupObject.type = utilityService.getValue($scope.usermanagent, 'breakupType');
            
        };
        var buildSearchObjectParams = function (assignedLetter) {
            return {
                template: utilityService.getValue($routeParams, 'template'),
                refUrl: 'recruitment',
                empId: utilityService.getValue($routeParams, 'empId'),
                jobId: utilityService.getValue($routeParams, 'jobId'),
                stage_id: utilityService.getValue($routeParams, 'stage_id'),
                substage_id: utilityService.getValue($routeParams, 'substage_id'),
                selectedTab: utilityService.getValue($routeParams, 'selectedTab'),
                assignedLetter: assignedLetter
            };
        };
        var setSearchObjectParamsAndRedirect = function (assignedLetter) {
            var searchObject = buildSearchObjectParams(assignedLetter);
            $location.url('/template-consumer').search(searchObject);
        };
        $scope.proceedWithoutSalaryBreakup = function () {
            setSearchObjectParamsAndRedirect('without-breakup');
        };
        var assignBreakupCallback = function (data) {
            if (utilityService.getValue(data, 'status') == "success") {
                setSearchObjectParamsAndRedirect('with-breakup');
            } else {
                console.log('need to handle error here')
            }
        };
        $scope.assignBreakupToOfferLetter = function (isFirstTime) {
            isFirstTime = angular.isDefined(isFirstTime) ? isFirstTime : true;
            if (isFirstTime) {
                filterNullableAmount($scope.preview);
            }            

            var url = UserManagementService.getUrl('mergeSalaryBreakup') 
                    + "/" + utilityService.getValue($routeParams, 'template') + "/" + $scope.userId,
                payload = {};
                if(!$scope.usermanagent.isDebit){
                    delete $scope.breakupObject.debit
                }
            angular.copy($scope.breakupObject, payload);
           
            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    assignBreakupCallback(data);
                });            
        };
        $scope.changeCompensationPlanHandler = function (plan) {
            $scope.breakupObject = UserManagementService.buildDefaultBreakupObject();
            $scope.usermanagent.ctc = 0;
            $scope.usermanagent.gross = 0;            
            $scope.setPayrolPlanId(plan);
            $scope.getStructureCreditPlanSetting(plan, true);
        };
        $scope.previewCTCBreakup = function () {
            filterNullableAmount($scope.preview);
            $scope.openModal('ctcBreakup', 'preview-ctc-breakup.tmpl.html', 'lg');
        };
        var calculateExcludedTotal = function (list) {
            var excludedTotal = 0;

            angular.forEach(list, function (value, key) {
                if (utilityService.getValue(value, 'value_monthly')) {
                    excludedTotal = excludedTotal + Number(value.value_monthly);
                }
            });

            return excludedTotal;
        };
        var reCalculateMonthlyGrossAmount = function () {
            var excludedTotal = calculateExcludedTotal(utilityService.getValue($scope.breakupObject, 'credit', [])),
                stringExcludedTotal = excludedTotal ? excludedTotal.toString() : '';
            
            if (stringExcludedTotal.indexOf('.') >= 0) {
                excludedTotal = excludedTotal.toFixed(2);
            }

            $scope.breakupObject.gross_amount_monthly = Number(excludedTotal);
        };
        var reCalculateCtcGrossAmount = function () {
            var excludedTotal = calculateExcludedTotal(utilityService.getValue($scope.breakupObject, 'ctc', [])),
                stringExcludedTotal = excludedTotal ? excludedTotal.toString() : '',
                grossAmount = Number($scope.breakupObject.gross_amount_monthly);

            if (stringExcludedTotal.indexOf('.') >= 0) {
                excludedTotal = excludedTotal.toFixed(2);
                $scope.breakupObject.ctc_amount_monthly = (grossAmount + parseFloat(excludedTotal)).toFixed(2);
            } else {
                $scope.breakupObject.ctc_amount_monthly = grossAmount + parseInt(excludedTotal, 10);
            }            
        };
        $scope.excludeFromMonthlyHandler = function (object, checkedKey, valueKey, assignedValueKey) {
            var isChecked = utilityService.getValue(object, checkedKey, false);

            // This is an additional condition to check either Excluded from monthly breakup, gross & ctc is checked or not
            if (assignedValueKey === 'value_monthly') {
                isChecked = isChecked || utilityService.getValue(object, 'isOtherChecked', false);
            }
                
            object[assignedValueKey] = isChecked ? 0 : getMonthlyAmount(utilityService.getValue(object, valueKey, 0));
        };
        $scope.excludeFromMonthlyAndGrossHandler = function (object, checkedKey, valueKey, assignedValueKey) {
            object.isChecked = object.isOtherChecked;
            $scope.excludeFromMonthlyHandler(object, 'isChecked', valueKey, assignedValueKey);
            // Need to recalculate monthly gross amount
            reCalculateMonthlyGrossAmount();

            // TODO: Need to recalculate monthly ctc amount
            reCalculateCtcGrossAmount();
        };
        $scope.excludeFromMonthlyAndCtcHandler = function (object, checkedKey, valueKey, assignedValueKey) {
            object.isChecked = object.isOtherChecked;
            $scope.excludeFromMonthlyHandler(object, 'isChecked', valueKey, assignedValueKey);
            // Need to recalculate monthly ctc amount
            reCalculateCtcGrossAmount();
        };
        $scope.proceedWithBreakup = function () {
            $scope.closeModal('ctcBreakup');
            $scope.assignBreakupToOfferLetter(false);
        };
        /***** End Recruitment Breakup Section ******/

        $scope.openModal = function(instance, templateUrl, size) {
            size = angular.isDefined(size) ? size : 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',                
                backdrop: 'static',
                keyword: false,
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };

        $scope.roundOff = function (number) {
            return Math.round(number)
        }
    }
]);
