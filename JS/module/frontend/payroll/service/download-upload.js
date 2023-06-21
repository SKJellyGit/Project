app.service('ExternalComponentService', [
    'utilityService',
    function (utilityService) {
        'use strict';

        var self = this;

        this.url = {
            downloadExternalComponents: 'payroll/download-external-component-template',
            uploadExternalComponents: 'payroll/upload-external-component-template',
            externalComponents: 'payroll/emp-external-component' 
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildBulkObject = function () {
            return {
                externalComponents: {
                    isUploaded: false,
                    file: null
                }
            };
        };
        this.buildAllFilterObject = function () {
            return [
                {
                    countObject: 'groupTemp', 
                    isGroup: true, 
                    collection_key: 'employee'
                }
            ];
        };
        this.buildOverallObject = function() {
            return {
                externalComponent: {
                    heads: {},
                    rows: []
                },
                filteredList: [],
                propertyName: 'employee.full_name',                                                
                reverse: false,
                visible: false,
                search: {
                    selected: 1,
                    list: [
                        {
                            id: 1,
                            title: 'Reviewee'
                        },
                        {
                            id: 2,
                            title: 'Reviewer'
                        }
                    ]
                },
                error: {
                    status: false,
                    message: null
                }
            }
        };
        this.buildExportListHeader = function(overall) {
			// Build header columns with some static values
			var columnHeaders = new Array('Employee Details', 'Employee ID');

			// Build header columns with some dynamic values
            angular.forEach(overall.externalComponent.heads.external_components, function (value, key) {
                columnHeaders.push(value);
            });
            
            return new Array(columnHeaders);
		};
		this.buildExportData = function (overall) {
			var csvContent = this.buildExportListHeader(overall);

            angular.forEach(overall.filteredList, function(value, key) {
                var array = new Array();
                
                array.push(utilityService.getInnerValue(value, 'employee', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'employee', 'personal_profile_employee_code'));
                
                angular.forEach(overall.externalComponent.heads.external_components, function(v, k) {                	
                	array.push(utilityService.getValue(value, k, '') ? utilityService.getValue(value, k, '') : '');
                });                
                
                csvContent.push(array);
            });

            return csvContent;
		};
    }
]);