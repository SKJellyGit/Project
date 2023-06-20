
app.service('LndViewService', [
      'utilityService',
    function ( utilityService) {
        'use strict';

        var selfService = this;
        this.url = {
            getSummary: 'training-manager/training-view/summary', 
            getDetails: 'training-manager/training-view/details', 
            getTrainingDetails: 'provisions/settings',
            getTrainingType: 'training-manager/training-types',
            attributeList: 'training-manager/attributes-values',
            trainingValue: 'training-manager/training-list',
            addStock: 'training-manager/add/training',
            addExistStock: 'training-manager/copy/training',
            updateExistStock: 'training-manager/add/training',
            stockCsv: 'training-manager/training-csv',
            uploadStock: 'training-manager/training/bulk-upload',
            deleteTraining: 'training-manager/training',
            updatestatus: 'training-manager/update-inventory',
            preview: 'user-management/employee-preview',
            getEmployee: 'user-addition/all-user?status=true',
            damageReport:'training-manager/damaged-training',
            downloadAllotBulkCsv: 'training-manager/download-bulk-Training-csv',
            uploadAllotCsv: 'training-manager/Training/raise-bulk-request',
            updateAttributeValues: 'training-manager/training',
            history: 'training-manager/training-history',
            inProgressEventSummary:'myteam/training/event-dashboard'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildTrainingViewModel = function() {
            return {
                summary: {
                    list: [],
                    detail: [],
                    loaderFlag: false,
                    event:{
                        inProgress:null,
                        upcoming:null
                    }
                },
                details: {
                    list: [],
                    loaderFlag: false,
                    trainingType: [],
                    column:[],
                    status: {
                        1: 'Alloted',
                        2: 'Inventory',
                        3: 'Damage',
                        4: 'Lost'
                    },
                    history:{
                        detailList: {},
                        historyList:[]
                    }
                },
                filters: {
                    list:[],
                    typeFilter: null
                },
                stock: {
                    attrList:[],
                    stcokRow:[],
                    trainingAttributeList:[{ "attribute_id": null,"attribute_value":null, list:[] }],
                    filterList: [],
                    model:[],
                    isUnique : false,
                    uniqueId : null,
                    errorMessages : [],
                    selectedList: null,
                    listAction: {
                        selected: false,
                        unSelected: false
                    }
                }
            };
        };
        this.addMoreRows = function (rows, objList, list) {
            for (var i = 1; i<=rows; i++) {
                var obj = {
                    attrList : []
                };
                angular.copy(objList, obj.attrList);
               list.push(obj);
            }
        };
        this.buildStockModel = function (model) {
            return {
                trainingTypeId : utilityService.getValue(model, 'training_type_id'),
                noRows : utilityService.getValue(model, 'noRows'),
                slectedProvision: utilityService.getValue(model, 'training_id'),
                quantity: utilityService.getValue(model, 'quantity'),
                uniqueString: utilityService.getValue(model, 'unique_string')
            };
        };
        this.createStockFilterPayload = function (list) {
            var filters = {},
                payload = {};

            angular.forEach(list, function(value,key){
                filters[value.attribute_id]= value.attribute_value;
            });
            payload.filters = JSON.stringify(filters);

            return payload;
        };
        this.formatTime = function(time) {
            if(time){
                if(angular.isDefined(time.getHours()) && angular.isDefined(time.getMinutes())) {
                    return time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
                }
            }
        };

        

        this.createAddStockPayload = function (list, model,capacityHash) {
            var payload = {
                training_type_id: model.trainingTypeId,
                training: []
            };
            angular.forEach(list, function (value, key) {
                var filter = {},
                    isPushed = false;

                angular.forEach(value.attrList, function (v, k) {
                    if (angular.isDefined(v.val)) {
                        if (v.field_type.field_type == 5 && v.val && v.val != "NaN/NaN/NaN") {
                            filter[v._id.$id] = utilityService.dateFormatConvertion(v.val);
                        } else if (v.field_type.field_type == 6) {
                            filter[v._id.$id] = selfService.formatTime(v.val);
                        } else {
                            filter[v._id.$id] = v.val;
                        }
                        isPushed = isPushed || true;
                    } else {
                        filter[v._id.$id] = null;
                        isPushed = isPushed || false;
                    }
                });
                // console.log('val',value)
                // if (angular.isDefined(value.total_quantity)) {
                filter['total_quantity'] = capacityHash[model.trainingTypeId];
                // }
                console.log(capacityHash,model.trainingTypeId,filter)
                if(isPushed) {
                    payload.training.push(filter);
                }
            });

            return payload;
        };
        this.buildExistStockPayload = function (systemUniqeId,isUnique, uniqueId, model) {
            var payload = {
                training_type_id : model.trainingTypeId,
                provision_id : model.slectedProvision
            };

            if(isUnique){
                payload.unique_string = model.uniqueString;
                payload.unique_attr_id = uniqueId;
                payload.is_system_generated_unique_key = systemUniqeId;
                payload.quantity = model.quantity;
            }

            return payload;
        };
        this.extractId = function(id) {
            var _id = angular.isObject(id) ? id.$id : id;
            return _id;
        };
        this.buildDetailStatus = function () {
            return {
                1: {
                    name: "Alloted",
                    label: 1,
                    isChecked: false
                },
                2: {
                    name: "Inventory",
                    label: 2,
                    isChecked: false
                },
                3: {
                    name: "Damage",
                    label: 3,
                    isChecked: false
                },
                4: {
                    name: "Lost",
                    label: 4,
                    isChecked: false
                }
            }
        };

        

        this.buildUpdateAttributeValuesPayload = function (model) {
            var payload = {
                training_type_id : utilityService.getValue(model, 'training_type_id'),
                training: {}
            };

            angular.forEach(model.attributeList, function(item, key) {
                if(item.field_type.field_type==5)
                {
                    console.log()
                    payload.training[item._id]=utilityService.dateFormatConvertion(item.value)
                }
                else
                {
                    payload.training[item._id] = item.value;
                }
            });

            return payload;
        };

    }
]);
