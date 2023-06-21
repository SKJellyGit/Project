app.service('AdminOkrService', [
    'utilityService', '$filter',
    function(utilityService, $filter) {
        'use strict';

        var self = this;

        this.url = {
            activeUsers: 'user-addition/users-preview',
            individualOkr: 'okr/key-results-objectives',
            companyObjectives: 'okr-admin/company-objectives',
            companyObjective: 'okr-admin/company-objective',
            activeCompObjective: 'okr-admin/active-company-objective',
            permissions: 'employee/module-permission/okr',
            okrSettings: 'okr/setting'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };

        this.buildOkrObject = function() {
            return {
                allActiveUsers: [],
                selectedEmp: [],
                statusHashMap: [],
                individualObjective: {
                    list: [],
                    filteredList: [],
                    visible: false,
                    propertyName: 'updated_at_sort',
                    reverse: true,
                    search: {
	            		name: '',
						role: '',
						status: ''
                    }
                },
                company: {
                    objectives: {
                        list: [],
                        filteredList: [],
                        visible: false,
                        propertyName: 'created_at_sort',
                        reverse: true,
                        filter: {
                            searchText: ''
                        }
                    },
                    selectedObjective: self.buildCompanyObjective(),
                    mode: 'create',
                    toDeleteObj: {
                        id: null,
                        index: null
                    }
                },
                canCollaboratorEditStatus: true
            };
        };

        this.buildCompanyObjectivesList = function(list) {
            if(!list || !list.length) { return []; }
            angular.forEach(list,function(value, key) {
                value.created_at_sort = new Date(value.created_at).getTime();
                value.created_at = $filter('stringMonthDate')(value.created_at_sort);
                value.updated_at_sort = new Date(value.updated_at).getTime();
                value.updated_at = $filter('stringMonthDate')(value.updated_at_sort);
				value.status_text = value.status == 1
								? 'Draft'
								: (value.status == 2)
									? 'Active'
									: '';
            });
            return list;
        };

        this.buildCompanyObjective = function(model) {
            var id = utilityService.getInnerValue(model, '_id', '$id');
            return {
                _id: id || utilityService.getValue(model, '_id'),
                name : utilityService.getValue(model, 'name'),
                description: utilityService.getValue(model, 'description'),
                status: utilityService.getValue(model, 'status'),
                created_at: utilityService.getValue(model, 'created_at'),
                created_at_sort: utilityService.getValue(model, 'created_at_sort'),
                updated_at: utilityService.getValue(model, 'updated_at'),
                updated_at_sort: utilityService.getValue(model, 'updated_at_sort'),
                status_text: utilityService.getValue(model, 'status_text')
            };
        };

        this.buildCompanyObjectivePayload = function(model) {
            return {
                name : utilityService.getValue(model, 'name'),
			    description: utilityService.getValue(model, 'description')
            };
        };

        return this;
    }
]);