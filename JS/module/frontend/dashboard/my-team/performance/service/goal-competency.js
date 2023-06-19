app.service('GoalCompetencyService', [
    'utilityService',        
    function (utilityService) {
        'use strict';
        var self = this;

        this.url = {
            empDetails: 'myteam/performance/parameterdetails',
            copyTemplate: 'myteam/performance/copy-parameters',
            updateAdminGoalCompetency: 'admin-frontend/performance/parameterdetails',
            krListing: 'okr/employee-kra'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };      
        this.buildOverviewModel = function() {
            return {
                empDetails: {
                    list: [],
                    content: [],
                    hashmap: {
                        1: "Pending",
                        2: "On Probation",
                        3: "Confirmed",
                        4: "Not Joining",
                        5: "Exit Initiated",
                        6: "Terminated",
                        7: "Relieved",
                        8: "Absconding"
                    },
                    propertyName: '',
                    reverse: false,
                    selected: {},
                    visible: false
                },
                isEditable: false,
                section: {
                    title: 'okr'
                },
                goalCompetencyList: [],
                selectedCycle: null,
                cycle: {
                    list: [],
                    visible: false,
                    error: {
                        status: false,
                        message: null
                    }
                },
                enableWeightage: false
            }
        };
        this.getTeamOwnerId = function(breadcrum) {
            var ownerId = null;
            if(breadcrum.length) {
                var lastObject = _.last(breadcrum);
                ownerId = lastObject._id;
            }
            return ownerId;
        };      
        this.renderDateFormat = function(timestamp) {
            timestamp = timestamp * 1000;
            var dd = new Date(timestamp).getDate(),
                mm = new Date(timestamp).getMonth() + 1,
                yy = new Date(timestamp).getFullYear();

            dd = dd <= 9 ? ('0' + dd) : dd;
            mm = mm <= 9 ? ('0' + mm) : mm;            
            return dd + '-' + mm + '-' + yy;
        };
        this.buildCSVData = function(empDetails, selectedTab, appraisal) {
            var sectionTitle = null,
                keyName = null,
                csvData = [],
                isWeightage = false,
                listKeyName = null;

            if(selectedTab === 'goal' || selectedTab == 2) {
                sectionTitle = appraisal.titleTabOne;
                keyName = 'goals';
                listKeyName = 'goalList';
            } else {
                sectionTitle = appraisal.titleTabTwo;
                keyName = 'compentencies';
                listKeyName = 'competencyList';
            }

            csvData = new Array(["Employee Name", "Employee Code",  "header", keyName, "description"]);

            angular.forEach(empDetails, function(value, key) {
                angular.forEach(value[listKeyName], function (v, k) {
                    var array = new Array();

                    array.push(utilityService.getInnerValue(value, 'employee_details', 'full_name'));
                    array.push(utilityService.getInnerValue(value, 'employee_details', 'employee_code'));
                    array.push(utilityService.getValue(v, 'header'));
                    array.push(utilityService.getValue(v, 'text'));
                    array.push(utilityService.getValue(v, 'description'));

                    if (utilityService.getValue(v, 'weightage')) {
                        array.push(utilityService.getValue(v, 'weightage'));
                        isWeightage = true;
                    }

                    csvData.push(array);
                });                
            });

            if (isWeightage) {
                csvData[0].push("weightage");
            }

            return csvData;
        };
        this.buildGoalCompetencyList = function(value, keyName) {
            var list = utilityService.getValue(value, keyName) ? value[keyName] : [],
                object = {
                    list: [],
                    count: 0
                },
                descriptionList = utilityService.getValue(value, keyName + '_description') 
                    ? value[keyName + '_description'] : [],
                weightageList = utilityService.getValue(value, keyName + '_weightage') 
                    ? value[keyName + '_weightage'] : [],
                headerList = utilityService.getValue(value, keyName + '_header') 
                    ? value[keyName + '_header'] : [];

            if(list.length) {
                angular.forEach(list, function(v, k) {
                    if(v) {
                       object.count++;
                    }
                    object.list.push({
                        editableMode: false,
                        text: v,
                        description: descriptionList[k],
                        weightage: weightageList[k],
                        header: headerList[k],
                        isDefault: true
                    });
                });
            }

            return object;
        };
        this.buildAllFilterObject = function() {
            return [
                {
                    countObject: 'group',
                    collection_key: 'employee_details',
                    isGroup: true,
                },
                {
                    countObject: 'employeeStatus',
                    collection: [1,2,3,4,5],
                    isArray: false,
                    key: 'employee_status'
                }
            ]
        };        
        this.extractEmpIds = function(list) {
            var ids = [];

            angular.forEach(list, function(value, key) {
                if(value.isChecked) {
                    ids.push(value.employee_details._id);
                }                
            });

            return ids;
        };
        this.buildCopyTemplatePayload = function(from, list) {
            return {
                copy_from: from,
                copy_to: this.extractEmpIds(list)
            }
        };
        
        return this;
    }
]);