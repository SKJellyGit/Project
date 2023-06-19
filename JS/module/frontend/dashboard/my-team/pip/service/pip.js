app.service('TeamPIPService', ['CommonPIPService', 'utilityService', 'FORM_BUILDER',
    function (commonPIPService, utilityService, FORM_BUILDER) {
        'use strict';

        this.url = {
            requestForm: 'pip-myteam/active-form',
            employee: 'user-addition/users-preview',
            raiseRequest: 'pip-myteam/request',
            requests: 'pip-myteam/requests',
            formDetails: 'pip/form-detail',
            details: 'pip-myteam/details',
            detail: 'pip-myteam/detail',
            asssignDeliverable: 'pip-myteam/assign-deliverable',
            deliverableStatus: 'pip-myteam/deliverable',
            updateDeliverableStatus: 'pip-myteam/update-deliverable-status',
            freezeDeliverableStatus: 'pip-myteam/freezed-deliverable',
            reviewerFinalUpdate: 'pip-myteam/update-overall-status'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };                                
        this.buildRequestsObject = function () {
            return {
                filteredList: [],
                list: [],
                propertyName: '',
                search: '',
                reverse: false,
                visible: false,
                reject_comment: null,                
                type: '',
                typeList: commonPIPService.buildTypeList()
            };
        };        
        this.buildPerformanceImprovementPlanObject = function () {
            return {
                details: commonPIPService.buildDetailsObject(),
                requests: this.buildRequestsObject(),
                relationship: null,
                model: {
                    employee_id: null,
                    relationship_id: null
                },
                employeeList: [],
                statusMapping: commonPIPService.buildStatusMappingObject(),                
                tabname: 'requests',
                confirmDialog: {
                    delete: {
                        title: 'Delete Request?',
                        content: 'Do you really want to delete this request'
                    },
                    freeze: {
                        title: 'Freeze Interim Update?',
                        content: 'Do you really want to freeze this interim update. Please make sure that you have already updated comment & status against all the deliverable of this interim update before freezing it.'
                    },
                    finalUpdate: {
                        title: 'Final Update?',
                        content: 'Do you really want to submit this final update. Please make sure that you will not be able to change this further.'
                    }
                },
                stop: {
                    overall_status_comment: null
                }                                  
            }
        };
        this.buildDeliverablesDefaultObject = function () {
            return commonPIPService.buildDeliverablesDefaultObject();
        };
        this.buildRaiseRequestPayload = function(pip, questionList) {
	    	var payload = {
                    employee_id: pip.model.employee_id,
                    relation_id: pip.relationship.rel_id
                };
                
            if (utilityService.getInnerValue(pip, 'relationship', 'direct_reportee') === false) {
                payload.is_upline = true;
            }

			angular.forEach(questionList, function (value, key) {
                if (value.isMandatory || value.answer) {
                    if (value.question_type == FORM_BUILDER.questionType.checkbox) {
                        payload["question_" + value._id] = utilityService.getValue(value, 'answer', []);
                    } else {
                        payload["question_" + value._id] = utilityService.getValue(value, 'answer');
                    } 
                    if(value.question_type == FORM_BUILDER.questionType.date) {
                        payload["question_" + value._id] = utilityService.dateFormatConvertion(utilityService.getValue(value, 'answer'));
                    }                   
                }           
            });            

			return payload;
        };
        this.convertInterimScheduleArrayToString = function (interimSchedule) {
            return commonPIPService.convertInterimScheduleArrayToString(interimSchedule);
        };
        this.filterNullableDeliverables = function (list) {
            var deliverables = [];

            angular.forEach(list, function(value, key) {
                if (value.name) {
                    deliverables.push(value);
                }
            });

            return deliverables;
        };
        this.buildAssignDeliverablePayload = function (model) {
            return {
                deliverables: this.filterNullableDeliverables(utilityService.getValue(model, 'deliverables', [])),
                request: utilityService.getValue(model, 'request')
            };
        };
        this.buildRequestsCsvData = function(empDetails, hashmap) {
            var object = {
                list: empDetails,
                content: new Array(["Employee Details", "Employee ID", "Requester Details", 
                    "Requester ID", "Requester Relationship", "Request Date", "Status"])
            };

            angular.forEach(object.list, function(value, key) {
                var array = new Array();
                array.push(utilityService.getInnerValue(value, 'employee_detail', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'employee_detail', 'personal_profile_employee_code'));
                array.push(utilityService.getInnerValue(value, 'requester_detail', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'requester_detail', 'personal_profile_employee_code'));
                array.push(utilityService.getValue(value, 'request_date'));
                array.push(utilityService.getValue(value, 'status') == 3 ? 'Admin' : utilityService.getValue(value, 'relationship_name'));
                array.push(hashmap[utilityService.getValue(value, 'status', 1)].title);

                object.content.push(array);
            });

            return object;
        };
        this.buildDetailsCsvData = function(details) {
            var object = {
                list: details.filteredList,
                content: new Array(["Employee Details", "Employee ID", "Deliverable Status", 
                    "Assigned Date", "Start Date", "End Date", "Next Update", "Last Update Status",  
                    "Last Update Date", "PIP Status", "Stopped Comment (If any)"])
            };

            angular.forEach(object.list, function(value, key) {
                var array = new Array(),
                    statusText = null,
                    stopComment = null,
                    status = utilityService.getValue(value, 'status', 1),
                    pipStatusText = details.mapping.pip[status].title;

                if (utilityService.getInnerValue(value, 'stopped_by', 'full_name')) {
                    pipStatusText = pipStatusText + ' by ' + utilityService.getInnerValue(value, 'stopped_by', 'full_name');
                }

                if (utilityService.getValue(value, 'stopped_time')) {
                    pipStatusText = pipStatusText + ' on ' + utilityService.getValue(value, 'stopped_time');
                }

                if (value.last_update_status && value.status == 3) {
                    statusText = details.deliverableStatus.interimUpdateMapping[value.last_update_status].title
                }
                
                if (value.last_update_status && (value.status == 4 || value.status == 5)) {
                    statusText = details.deliverableStatus.finalUpdateStatusMapping[value.last_update_status].title
                    stopComment = utilityService.getValue(value, 'overall_status_comment');
                }

                array.push(utilityService.getInnerValue(value, 'employee_detail', 'full_name'));
                array.push(utilityService.getInnerValue(value, 'employee_detail', 'personal_profile_employee_code'));
                array.push(details.mapping.deliverable[utilityService.getValue(value, 'deliverable_status', 1)].title);
                array.push(utilityService.getValue(value, 'assigned_date', '-'));
                array.push(utilityService.getValue(value, 'start_date', '-'));
                array.push(utilityService.getValue(value, 'end_date', '-'));
                array.push((status == 4 || status == 5) ? 'N/A' : utilityService.getValue(value, 'next_update', '-'));                
                array.push(statusText);
                array.push(utilityService.getValue(value, 'last_update_date', '-'));
                array.push(pipStatusText);
                array.push(stopComment);

                object.content.push(array);
            });

            return object;
        };
        this.buildUpdpateDeliverableStatusPayload = function (model) {
            return {
                interim_updates: utilityService.getValue(model, 'interim_updates')
            };
        };
        this.buildFreezeDeliverableStatusPayload = function (model) {
            return {
                _id: utilityService.getValue(model, '_id'),
                interim_summary: utilityService.getValue(model, 'interim_summary')
            };
        };     

    }
]);