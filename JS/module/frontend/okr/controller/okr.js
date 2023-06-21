app.controller('AdminOkrController', [
    '$scope', '$rootScope', '$timeout', '$routeParams', '$window', '$filter', '$location', '$modal', 'ServerUtilityService', 'utilityService', 'AdminOkrService', 'ObjectiveService',
    function($scope, $rootScope, $timeout, $routeParams, $window, $filter, $location, $modal, serverUtilityService, utilityService, service, objectiveService) {
        'use strict';

        var self = this;
        self.filterSelected = true;
        self.querySearchChips = querySearchChips;
        self.transformChip = transformChip;
        $scope.okr = service.buildOkrObject();
        $scope.okr.statusHashMap = objectiveService.buildStatusHashMap();
        $scope.okr.statusList = objectiveService.buildKRStatusList();
        /**********Start: OKR Admin Permission************/
        $scope.okrAdminPermission = {
            visible: false,
            sidenav_create_and_edit_company_objective: false,
            can_view_okr: false,
            can_view_okr_report: false
        };

        var getAllOkrPermission = function(cb) {
            $scope.okrAdminPermission.visible = false;
            var url = service.getUrl('permissions');
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    angular.forEach(utilityService.getValue(data, 'data', []), function(val, key) {
                        $scope.okrAdminPermission[val.permission_slug] = true;
                    });
                    $scope.okrAdminPermission.visible = true;
                    if(cb) { cb(); }
                });
        };
        /**********End: OKR Admin Permission************/

        /**********Start: OKR Admin************/
        $scope.exportObjectList = function(section, list, fileName) {
            var csvData;
            if(section == 'individual') {
                csvData = objectiveService.buildExportListObj(list || []);
                fileName = $scope.okr.selectedEmp[0].name + '_okr.csv';
            } else {
                csvData = objectiveService.buildExportListCompanyObj(list || []);
            }
            utilityService.exportToCsv(csvData, fileName);
        };

        $scope.openModal = function (templateUrl, instance, size) {
            size = size || 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };
        /**********End: OKR Admin************/

        /**********Start: Individual okr Tab************/

        /******************CHIPS SECTION START*************************/
        function loadChipList(list) {
            return list.map(function (c, index) {
                var object = {
                    _id: angular.isObject(c._id) ? c._id.$id : c._id,
                    name: c.full_name ? c.full_name : '',
                    email: c.email,
                    display: c.display_detail,
                    image: angular.isDefined(c.profile_pic) ? c.profile_pic : 'images/no-avatar.png',
                    empCode: utilityService.getValue(c, 'employee_code', utilityService.getValue(c, 'personal_profile_employee_code'))
                };
                object._lowerName = object.name.toLowerCase();

                if (utilityService.getValue(object, 'empCode')) {
                    //object.name = object.name + ' (' + object.empCode + ')';
                }

                return object;
            });
        }
        function createFilterForFn(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(emp) {
                return (emp._lowerName.indexOf(lowercaseQuery) != -1);
            };
        }
        function querySearchChips(keyword) {
            return keyword ? $scope.okr.allActiveUsers.filter(createFilterForFn(keyword)) : [];
        }
        function transformChip(chip) {
            if (angular.isObject(chip)) { return chip; }
            return { name: chip, image: '/images/no-avatar.png', display: [''] };
        }
        /******************CHIPS SECTION START*************************/
        var getAllActiveEmployees = function(cb) {
            var url = service.getUrl('activeUsers');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.okr.allActiveUsers = loadChipList(utilityService.getValue(data, 'data', []));
                if(cb) { cb(); }
            });
        };
        getAllOkrPermission(function() {
            if($scope.okrAdminPermission.can_view_okr) {
                getAllActiveEmployees();
            }
        });

        $scope.getAllOkrForEmployee = function(emp_id) {
            $scope.okr.individualObjective.visible = false;
            $scope.okr.individualObjective.search.name = '';
            $scope.okr.individualObjective.search.role = '';
            $scope.okr.individualObjective.search.status = '';
            var url = service.getUrl('individualOkr') + '/1?emp_id=' + emp_id;
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.okr.individualObjective.list = objectiveService.reBuildObjectiveList(data.data, false, emp_id);
                $scope.okr.individualObjective.visible = true;
            });
        };

        $scope.initializeIndividualOkrTab = function() {
            var actUsr = utilityService.getInnerValue($scope.okr, 'allActiveUsers', '0');
            if(actUsr) {
                $scope.okr.selectedEmp[0] = actUsr;
                $scope.getAllOkrForEmployee($scope.okr.selectedEmp[0]._id);
            } else {
                $scope.okr.individualObjective.list = [];
                $scope.okr.individualObjective.visible = true;
            }
        };
        
        /**********End: Individual okr Tab************/

        /**********Start: Company objective Tab************/
        $scope.getCompanyObjectives = function(cb) {
            $scope.okr.company.objectives.visible = false;
            var url = service.getUrl('companyObjectives');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.okr.company.objectives.list = service.buildCompanyObjectivesList(utilityService.getValue(data, 'data', []));
                $scope.okr.company.objectives.visible = true;
                if(cb) { cb(); }
            });
        };

        $scope.sortBy = function(propertyName, object) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };

        $scope.openObjectiveModel = function(mode, objective) {
            $scope.okr.company.mode = mode ? mode : 'create';
            $scope.okr.company.selectedObjective = ($scope.okr.company.mode == 'create')
                    ? service.buildCompanyObjective()
                    : service.buildCompanyObjective(objective);
            
            if(mode == 'view') {
                $scope.openModal('view-company-objective-details-admin.tmpl.html', 'viewCompanyObjectiveDetails', 'lg');
            } else {
                $scope.openModal('create-update-company-objective-admin.tmpl.html', 'createUpdateCompanyObjective', 'md');
            }
        };

        $scope.saveCompanyObjective = function() {
            if($scope.okr.company.selectedObjective.isSavingObjective) { return false; }
            $scope.okr.company.selectedObjective.isSavingObjective = true;
            var url = service.getUrl('companyObjective'),
                method = 'postWebService',
                payload = service.buildCompanyObjectivePayload($scope.okr.company.selectedObjective);
            
            if($scope.okr.company.mode == 'update') {
                method = 'putWebService';
                url += '/' + $scope.okr.company.selectedObjective._id;
            }
            serverUtilityService[method](url, payload).then(function(data) {
                $scope.getCompanyObjectives();
                $scope.okr.company.selectedObjective.isSavingObjective = false;
                $scope.closeModal('createUpdateCompanyObjective');
                utilityService.showSimpleToast(data.message);
                var searchParams = {
                    id:data.data._id,
                    module: 'okradmin',
                    moduleName: 'okradmin',
                };
                $location.url('okr-admin-setting').search(searchParams);
            });
        };

        $scope.activateDeactivateCompanyObjective = function(objective, status) {
            var url = service.getUrl('activeCompObjective') + '/' + objective._id,
                payload = { status: status };

            serverUtilityService.putWebService(url, payload).then(function(data) {
                objective.status = status;
                utilityService.showSimpleToast(data.message);
            });
        };

        $scope.deleteCompanyObjective = function() {
            var url = service.getUrl('activeCompObjective') + '/' + $scope.okr.company.toDeleteObj.id,
                payload = { status: 3 };

            serverUtilityService.putWebService(url, payload).then(function(data) {
                $scope.getCompanyObjectives();
                utilityService.showSimpleToast(data.message);
                $scope.closeModal('deleteWarningCompanyObjectiveAdmin');
            });
        };
        $scope.confirmObjectiveDelete = function(objective, index) {
            $scope.okr.company.toDeleteObj.id = objective._id;
            $scope.okr.company.toDeleteObj.index = index;
            $scope.openModal('delete-warning-company-objective-admin.tmpl.html', 'deleteWarningCompanyObjectiveAdmin', 'sm');
        };

        $scope.goToObjectiveDetail = function (item) {
            var id = angular.isObject(item._id) ? item._id.$id : item._id;
            var url = '#/dashboard/create-objective?id=' + id + '&view=true&pre_section=admin';
            $window.open(url);
        };
        /**********End: Company objective Tab************/

        $scope.updatePaginationSettings('okr_admin_individual_objective_listing');
        $scope.updatePaginationSettings('okr_admin_company_objective_listing');
        // console.log($scope);

        var getOkrSettings = function () {
            var url = service.getUrl('okrSettings')
            serverUtilityService.getWebService(url)
            .then(function(data){
                    $scope.okr.canCollaboratorEditStatus = utilityService.getInnerValue(data, 'data', 'can_collaborator_edit_key_result', true)
            });
        }
        getOkrSettings()

        $scope.canCollaboratorEdit = function (status) {
            var url = service.getUrl('okrSettings'),
                payload = {
                    "can_collaborator_edit_key_result" : status 
                }
            serverUtilityService.postWebService(url, payload)
            .then(function(data){
                // if(data.status == "success"){
                    utilityService.showSimpleToast(data.message);
                // }
            });
        }


        
    }
]);