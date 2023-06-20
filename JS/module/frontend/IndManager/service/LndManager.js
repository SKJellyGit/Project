app.service('LndManagerService', [ 'utilityService',
    function (utilityService) {
        'use strict';

        this.url = {
            employeeSummary:'training-manager/event_details',
            eventCount:'training-manager/event-count',
            pending: 'data/provision-summary.json',
            pendingRequestType: 'data/provision-new-request-type.json',
            getSeatSummary : 'training-manager/request-view/summary',
            managerRequest: 'training-manager/training/requests',
            individualRequest: 'training-manager/requets',
            allocation:'training-manager/training-request',
            employeeRequest: 'data/manager-request-details.json',
            updateExistStock: 'training-manager/add/training',
            training: 'training-manager/training-types',
            assign: 'manage-permission/users/assign',
            unassign: 'user-addition/all-user?status=true',
            addRequest: 'training-manager/training/new-request',
            attributeList: 'training-manager/attributes-values',
            trainingValue: 'training-manager/training-list',
            cancelRequest: 'training-manager/training-request',
            getEmployee: 'user-addition/all-user?status=true',
            setReminder: 'prejoin/frontend/send-reminder',
            employeeList: 'training-manager/employees',
            allmandatorygroup: 'user-management/active/group?mandatory=true&field=true',
            notification: 'training-manager/sendnotifications',
            preview: 'user-management/employee-preview'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };

        this.buildGetSummaryPayload=function () {
            return{
                employeeSummary:null,
                eventCount:7
            }
        }
    
        this.buildEmployeeSummary=function (model) {
            return{
                attended: utilityService.getValue(model,'attended',0), 
                assessed: utilityService.getValue(model,'assessed',0), 
                certified: utilityService.getValue(model,'certified',0), 
                completed: utilityService.getValue(model,'completed',0)
            }
        }
    
        this.buildEventCount=function (model) {
            return{
                inprogress: utilityService.getValue(model,'in_progress',0),
                upcoming: utilityService.getValue(model,'upcoming',0),
            }
        }


        this.buildPendingHeaderList = function() {
            return ['0-3', '3-5', '5-7', '7+'];
        };
        this.buildRequestTypeObj = function () {
            return {
                1: "Registration",
                // 2: "Change",
                // 3: "Revoke"
            }
        };
        this.buildRequestStatusObj = function () {
            return {
                1: "Request Raised",
                2: "Request Completed",
                3: "Request Cancelled",
                4: "Request Denied"
            }
        };        
        this.buildDamageBorneBYObj = function () {
            return {
                1:"User",
                2:"Company",
                3:"Specific Employee"
            }
        };
        this.buildEmployeeStatusObj = function() {
            return utilityService.buildEmployeeStatusHashMap();
        };
        this.buildNewRequestModel = function(model) {
            return {
                training_type_id: utilityService.getValue(model, 'training_type_id'), 
                request_type: utilityService.getValue(model, 'request_type'),
                employee_id: utilityService.getValue(model, 'employee_id'),
                due_date: utilityService.getValue(model, 'due_date'),
                manager_remark: utilityService.getValue(model, 'manager_remark'),
                search: {}
            }
        };
        this.buildTrainingNewRequestModel = function(model) {
            return {
                training_type_id: utilityService.getValue(model, 'training_type_id'), 
                request_type: utilityService.getValue(model, 'request_type'),
                employee_id: utilityService.getValue(model, 'employee_id'),
                selectedAttributeId: {},
                manager_remark: utilityService.getValue(model, 'manager_remark'),
                due_date: utilityService.getValue(model, 'due_date')
            }
        };
        this.buildAttributeRequestModel = function(model) {
            return {
                training_id: utilityService.getValue(model, 'training_id'),
                comments: utilityService.getValue(model, 'comments'),
                quantity_allocated: utilityService.getValue(model, 'quantity_allocated'),
                is_damaged: utilityService.getValue(model, 'is_damaged',2),
                repair_cost: utilityService.getValue(model, 'repair_cost'),
                /*repair_cost_borne_by: utilityService.getValue(model, 'repair_cost_borne_by'),*/
                remark: utilityService.getValue(model, 'remark'),
                manager_remark: utilityService.getValue(model, 'manager_remark'),
                old_training_id: utilityService.getValue(model, 'old_training_id'),
                quantity_changed: utilityService.getValue(model, 'quantity_changed'),
                repair_cost_by_specific_emp: utilityService.getValue(model, 'repair_cost_by_specific_emp'),
                repair_cost_borne_by: utilityService.getValue(model, 'repair_cost_borne_by',1)
            }
        };
        this.buildReturnRevokeModel = function(model) {
            return {
                training_id: utilityService.getValue(model, 'training_id'),
                request_type: utilityService.getValue(model, 'request_type'),
                is_damaged: utilityService.getValue(model, 'is_damaged',2),
                repair_cost: utilityService.getValue(model, 'repair_cost'),
                repair_cost_by_specific_emp: utilityService.getValue(model, 'repair_cost_by_specific_emp'),
                employee: utilityService.getValue(model, 'employee'),
                remark: utilityService.getValue(model, 'remark'),
                manager_remark: utilityService.getValue(model, 'manager_remark'),
                comments: utilityService.getValue(model, 'comments'),
                quantity_returned: utilityService.getValue(model, 'quantity_returned'),
                repair_cost_borne_by: utilityService.getValue(model, 'repair_cost_borne_by',1)
            }
        };
        this.buildAssignUserPayload = function(list) {
            var employee_ids = [];
            angular.forEach(list, function(value, key) {
                var empID = value._id.$id ? value._id.$id : value._id;
                employee_ids.push(empID);
            });
            return employee_ids;
        };
        this.buildRequestUserPayload = function(list) {
            var employee_ids = [];
            angular.forEach(list, function(value, key) {
                console.log(value);
                employee_ids.push(value._id);
            });
            return employee_ids;
        };
        this.buildRequestViewModel = function() {
            return {
                pending: {
                    forList: [],
                    byList: [],
                    byCategory : [],
                    byFilteredList : [],
                    forCategory : [],
                    forFilteredList : [],
                    xAxisData: utilityService.buildMonthList(),
                    header: this.buildPendingHeaderList(),
                    visible: false
                },
                requestDetails: {
                    list: [],
                    trainingType:[],
                    requestType: this.buildRequestTypeObj(),
                    requestStatus: this.buildRequestStatusObj(),
                    attributeList:[],
                    attributeEmpList:[],
                    attributeValueList:[],
                    trainingValueList:[],
                    trainingEmployeeList:[],
                    returnValueList:[],
                    buildEmployeeStatusList: this.buildEmployeeStatusObj(),
                    damageBorne: this.buildDamageBorneBYObj(),
                    model: this.buildAttributeRequestModel(),
                    returnModal: this.buildReturnRevokeModel(),
                    denyComment: null,
                    denyItem: null,
                    visible:false,
                    filteredList: [] 
                },
                newRequest: {
                    unAssignedList:[],
                    assignedList:[],
                    model: this.buildNewRequestModel(),
                    trainingModel: this.buildTrainingNewRequestModel()
                },
                colors: ['md-primary', 'red-bg', 'green-bg', 'orange-bg', 'gray-bg', 'vilot-bg'],
                colorCodes: ['#66b1ef', '#e98e86', '#a9c88a']
            }
        };
        this.extractId = function (id) {
            var _id = angular.isObject(id) ? id.$id : id;
            return _id;
        };        
        this.buildReqStatusFilterObj = function () {
            return {
                1:{
                    name: "Request Raised",
                    label: 1,
                    isChecked: false
                },
                2:{
                    name: "Request Completed",
                    label: 2,
                    isChecked: false
                },
                3:{
                    name: "Request Cancelled",
                    label: 3,
                    isChecked: false
                },
                4:{
                    name: "Request Denied",
                    label: 4,
                    isChecked: false
                }
            }
        };

        return this;

    }
]);