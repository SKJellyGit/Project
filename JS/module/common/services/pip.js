app.service('CommonPIPService', ['utilityService',
    function (utilityService) {
        'use strict';
        
        this.buildStatusMappingObject = function () {
            return {
                1: {
                    title: 'Pending',
                    classname: 'orange',
                    icon: 'more_horiz'
                },
                3: {
                    title: 'Approved',
                    classname: 'green',
                    icon: 'check'
                },
                8: {
                    title: 'Approved',
                    classname: 'green',
                    icon: 'check'
                },
                9: {
                    title: 'Rejected',
                    classname: 'red',
                    icon: 'close'
                }
            };
        };
        this.buildDeliverableMappingObject = function () {
            return {
                1: {
                    title: 'Pending',
                    classname: 'orange',
                    icon: 'more_horiz'
                },
                2: {
                    title: 'In Draft',
                    classname: 'orange',
                    icon: 'email'
                },
                3: {
                    title: 'Frozen',
                    classname: 'blue',
                    icon: 'ac_unit'
                }
            };
        };
        this.buildPIPStatusMapping = function () {
            return {
                1: {
                    title: 'Pending',
                    classname: 'orange',
                    icon: 'more_horiz'
                },
                2: {
                    title: 'In Draft',
                    classname: 'orange',
                    icon: 'email'
                },
                3: {
                    title: 'On Going',
                    classname: 'blue',
                    icon: 'ac_unit'
                },
                4: {
                    title: 'Completed',
                    classname: 'green',
                    icon: 'check'
                },
                5: {
                    title: 'Stopped',
                    classname: 'red',
                    icon: 'stop'
                }
            };
        };
        this.buildDetailsMappingObject = function () {
            return {
                deliverable: this.buildDeliverableMappingObject(),
                pip: this.buildPIPStatusMapping()
            };
        };
        this.buildAssignDeliverablesObject = function () {
            return {
                isEditable: false,
                request_id: null,
                employee_detail: null,
                duration: null,
                interim_schedule: [],
                deliverables: [{
                    name: null,
                    weightage: null
                }],
                followers: [],
                acion: {
                    pending: 1,
                    saveAsDraft: 2,
                    freeze: 3
                },
                deliverable_status: null
            };
        };
        this.buildInterimUpdateMappingObject = function () {
            return {
                1: {
                    title: 'On Track'
                },
                2: {
                    title: 'Off Track'
                }
            };
        };
        this.buildFinalUpdateStatusMappingObject = function () {
            return {
                1: {
                    title: 'Satisfactory'
                },
                2: {
                    title: 'Unsatisfactory'
                }
            };
        };
        this.buildDeliverableStatusObject = function () {
            return {
                isEditable: false,
                request_id: null,
                employee_detail: null,
                interim_schedule_date: [],
                deliverables: [{
                    name: null,
                    weightage: null
                }],
                followers: [],
                end_date: null,
                reviewer_detail: null,
                interim_updates: [],
                deliverable_status: null,
                interimUpdateMapping: this.buildInterimUpdateMappingObject(),
                finalUpdateStatusMapping: this.buildFinalUpdateStatusMappingObject()
            };
        };
        this.buildDetailsObject = function () {
            return {
                filteredList: [],
                list: [],
                propertyName: '',
                search: '',
                reverse: false,                    
                visible: false,
                mapping: this.buildDetailsMappingObject(),
                assignDeliverable: this.buildAssignDeliverablesObject(),
                deliverableStatus: this.buildDeliverableStatusObject(),
                statusFilter: '',
                searchReviewer: '',
                searchRequester: '',
                deliverableStatusFilter: ''
            };
        };
        this.buildDeliverablesDefaultObject = function () {
            return {
                name: null,
                weightage: null
            };
        };
        this.convertInterimScheduleArrayToString = function (interimSchedule) {
            var interimScheduleDays = [],
                strInterimScheduleDays = null;

            if (interimSchedule.length) {
                var interimScheduleDays = interimSchedule.map(function (day) {
                    return day + '' + utilityService.getDayOfMonthSuffix(day);
                });

                strInterimScheduleDays = interimScheduleDays.join(', ');
            }

            return strInterimScheduleDays;
        };
        this.buildTypeList = function () {
            return [
                {
                    title: "All Status",
                    status: ''
                },
                {
                    title: "Pending",
                    status: 1
                },
                {
                    title: "Rejected",
                    status: 2
                },
                {
                    title: "Approved",
                    status: 3
                }
            ]
        };
        this.extractFollowersIds = function (followers) {
            var ids = [];

            angular.forEach(followers, function (value, key) {
                ids.push(value._id);
            });

            return ids;
        };
        this.extractInterimUpdateDays = function (list) {
            var days = [];

            angular.forEach(list, function (value, key) {
                if (utilityService.getValue(value, 'day_no')) {
                    days.push(utilityService.getValue(value, 'day_no'));
                }
            });

            return days;
        };
        this.buildDefaultInterimUpdate = function () {
            return {
                day_no: null
            };
        };                               
    }
]);