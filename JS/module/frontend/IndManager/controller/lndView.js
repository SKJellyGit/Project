app.controller('LndViewController', [
    '$scope', '$routeParams', '$q', '$location', '$timeout', '$route', 'LndViewService', 'utilityService', 'ServerUtilityService', 'Upload', '$modal',
    function($scope, $routeParams, $q, $location, $timeout, $route, LndViewService, utilityService, serverUtilityService, Upload, $modal) {

        var self = this;

        self.simulateQuery = false;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;
        $scope.AllotmentFlag = false;
        var allFilterObject = [{ countObject: 'common', collection: [], isArray: false, key: '_id'}];
        var allFilterDetailsObject = [{ countObject: 'employeeStatus', collection: [], isArray: false, key: 'status'}];
        $scope.trainingView = LndViewService.buildTrainingViewModel();
        $scope.detailStatusObj = LndViewService.buildDetailStatus();
        $scope.bulkTrainingFlag = false;
        $scope.damageReportList = [];
        $scope.orderByTrainingViewField = '_id';
        $scope.orderByTrainingInventoryField = 'status';
        $scope.csvErrorFlag = false;
        $scope.selectTraining = {
            list: null
        };
        $scope.selectedTrainingId = null;
        $scope.totalLength = null;
        $scope.bulkUploadType = $routeParams.bulkType;

        var syncStockModel = function(model) {
            $scope.trainingView.stock.model = LndViewService.buildStockModel(model);
        };
        // var getDamagedTrainingDetails = function(trainingTypeId) {
        //     var url = LndViewService.getUrl('damageReport') + "/" + trainingTypeId;
        //     serverUtilityService.getWebService(url)
        //         .then(function(data) {
        //             $scope.damageTrainingDetailList = data.data;
        //         });
        // };
        var emailPattern=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        $scope.modalUpdateEnabled=true
        $scope.setValidity=function () {
            var attrListLength=$scope.editTrainingObject.attributeList.length
            var validLength=0
            //Validation for email required
            
            $scope.editTrainingObject.attributeList.map(function (attr) {
                if(attr.value!=="")
                {
                    validLength+=1
                }
                 
            })
            $scope.modalUpdateEnabled=(validLength === attrListLength)
            
        }
        

        $scope.trainingCapacityHash={}
        $scope.trainingTypeHash={}

        var createTrainingTypeHash=function(list){
            list.map(function(training){
                $scope.trainingTypeHash[training._id]=training.training_attributes_created
            })
        }

        var createTrainingCapacityHash=function (list) {
            list.map(function (item) {
                   
                    $scope.trainingCapacityHash[item._id]=parseInt(item.capacity_limit)
                 
            })
        }

        var getTrainingViewDetails = function(item,shouldChange) {
            $scope.damageReportList = item;
            if (angular.isDefined(item)) {
                $scope.damageReportId = item._id
                //getDamagedTrainingDetails(item._id);
                $scope.currentTraining=item._id
                $scope.currentTrainingName=item.training_name
                $scope.currentTrainingType=item.training_type_id
                $scope.trainingView.details.column = item.attributes;
                $scope.trainingView.filters.typeFilter = item.training_name;
                var url = LndViewService.getUrl('getDetails') + '/' + item._id;
                
                serverUtilityService.getWebService(url)
                    .then(function(data) {     
                        
                        $scope.calculateFacadeCountOfAllFilters(data.data, allFilterDetailsObject);
                        angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                        
                        $scope.trainingView.details.list = data.data;
                            
                        // debugger;                   
                        angular.forEach($scope.trainingView.details.list, function (value, key) {
                            value.full_name = utilityService.getInnerValue(value, 'employee', 'full_name');
                            value.personal_profile_employee_code = utilityService.getInnerValue(value, 'employee', 'personal_profile_employee_code');
                            var uniqueAttributeId = utilityService.getValue(value, 'unique_attr_id');
                            if (uniqueAttributeId) {
                                value.unique_attribute_name = utilityService.getInnerValue(value, 'attributes', uniqueAttributeId);
                            } else {
                                value.unique_attribute_name = null;
                            }                            
                        });

                        if ($scope.trainingView.details.list) {
                            $scope.trainingView.details.loaderFlag = true;
                        }
                        $('#add-lnd').modal('hide');
                    });
            }
        };
        var trainingDetailsCallback = function(data) {
            $scope.trainingView.summary.detail = data.data;
            if ($scope.trainingView.summary.detail) {
                $scope.trainingView.summary.loaderFlag = true;
            }
            getTrainingViewDetails($scope.trainingView.summary.detail[0]);
        };

        var successCallback = function(data, list, section, isAdded, returnTo) {
            $('#status-update-alert').modal('hide');
            utilityService.resetAPIError(false, null, section);
            getTrainingViewDetails($scope.damageReportList);
            utilityService.showSimpleToast(data.message);
            if (angular.isDefined(data.data)) {
                isAdded ? list.unshift(data.data)
                    : utilityService.refreshList(list, data.data);
            }
        };
        var errorCallback = function(data, section) {
            if (data.status == "error") {
                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(data.message);
            } else if (data.data.status == 'error') {
                utilityService.resetAPIError(true, "something went wrong", section);
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function(value, key) {
                        angular.forEach(value, function(v, k) {
                            $scope.errorMessages.push(v);
                        });
                    });
                } else {
                    $scope.errorMessages.push(data.data.message);
                }
            }
        };
        var successErrorCallback = function(data, list, section, isAdded, returnTo) {
            data.status === "success" ?
                successCallback(data, list, section, isAdded, returnTo) : errorCallback(data, section);
        };
        $scope.updateStatusAlert = function(item) {
            if (item.status == 3) {
                item.repair_cost = null;
                item.repair_cost_borne_by = null;
                item.repair_cost_by_specific_emp = null;
            }
            $scope.alertData = {
                message: "Are You sure you want to change the status of training.",
                data: item
            }
            $('#status-update-alert').appendTo("body").modal('show');
        };
        $scope.updateInventoryStatus = function(item) {
            if (item.repair_cost_borne_by == 3 && item.status == 3) {
                item.repair_cost_by_specific_emp = angular.isObject(self.pfSelectedItem._id) ? self.pfSelectedItem._id.$id : self.pfSelectedItem._id;
            }
            serverUtilityService.putWebService(LndViewService.getUrl('updatestatus') + "/" + item.training_id.$id + "/" + item.status, item)
                .then(function(data) {
                    successErrorCallback(data, 'add-stock');
                });
        };

        $scope.fetchType={
            overall:1,
            inprogress:4
        } // 1-All, 2-
        
        $scope.getSummary=function (type) {
            $scope.trainingView.summary.loaderFlag = false;
            serverUtilityService.getWebService(LndViewService.getUrl('getSummary')+'/'+type).then(function (data) {
                 
                $scope.trainingView.summary.list=data.data
                $scope.trainingView.summary.loaderFlag = true;  
            })
        }

        $scope.timeRanges=[1,2,3,4]
        $scope.timeRangeNames={1:'All',2:'Previous',3:'Upcoming',4:'Ongoing'}
        
        $scope.inProgressModes=[4,5,1,2,3,]
        $scope.inProgressModeNames={4:'7 Days',5:'10 Days',1:'30 Days',2:'60 Days',3:'90 Days'}

        $scope.getEventsInProgress=function (inProgressMode) {
            serverUtilityService.getWebService(LndViewService.getUrl('inProgressEventSummary')+'/'+inProgressMode).then(function (data) {
                
                $scope.trainingView.summary.event.inProgress=angular.isDefined(data.data.in_process)?data.data.in_process:'N/A'
                $scope.trainingView.summary.event.upcoming=angular.isDefined(data.data.upcoming)?data.data.upcoming:'N/A'
            })
        }

        /**
          const NEXT_30= 1;
          const NEXT_60= 2;
          const NEXT_90= 3;
          const NEXT_7= 4;
          const NEXT_10= 5;
         */

        var modifySummarySeats=function (list) {
            list.map(function (item) {
                if(item.capacity_type==1)
                {
                    item.total_quantity=Infinity
                    item.inventory=Infinity
                }
            })
            return list
        }

        var getTrainingSummaryDetails = function() {
            $q.all([
                serverUtilityService.getWebService(LndViewService.getUrl('getTrainingType')),
                serverUtilityService.getWebService(LndViewService.getUrl('getSummary')+'/1'),
                serverUtilityService.getWebService(LndViewService.getUrl('inProgressEventSummary')+'/'+$scope.fetchType.inprogress)
            ]).then(function(data) { 
                createTrainingTypeHash(data[0].data)
                setModifyVisibility()
                trainingDetailsCallback(data[0]);
                $scope.trainingView.summary.event.inProgress=data[2].data.in_process
                $scope.trainingView.summary.event.upcoming=data[2].data.upcoming
                $scope.calculateFacadeCountOfAllFilters(data[1].data, allFilterObject);
                angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                
                $scope.trainingView.summary.list = modifySummarySeats(data[1].data)
                if ($scope.trainingView.summary.list) {
                    $scope.trainingView.summary.loaderFlag = true;
                }
                
            });
        };

        $scope.getSummaryDetails=function (type) {
            getTrainingSummaryDetails(type)
        }

        getTrainingSummaryDetails();
        $scope.getTrainingDetails = function(trainingId, key) {
            var obj = {
                name: null,
                icon: null,
                attr: []
            };
            angular.forEach($scope.trainingView.summary.detail, function(v, k) {
                if (v._id == trainingId) {
                    obj.name = v.training_name;
                    obj.icon = v.training_icon;//change
                    obj.attr = v.attributes;
                     
                }
            });
            return obj[key];
        };
        var chipDetailList = function(list) {
            var listToBeExclude = ["personal_profile_first_name",
                "personal_profile_middle_name", "personal_profile_last_name"]
            $scope.chipsNameDetail = [];
            $scope.chipsSlugDetail = [];
            angular.forEach(list, function(value, key) {
                if (listToBeExclude.indexOf(value.slug) === -1) {
                    var slugDetail = value.slug + "_detail"
                    $scope.chipsNameDetail.push(value.name);
                    $scope.chipsSlugDetail.push(slugDetail);
                }
            });
        };
        var getPreviewDetails = function() {
            serverUtilityService.getWebService(LndViewService.getUrl('preview'))
                .then(function(data) {
                    $scope.employeeDetailList = data.data.group_details;
                    chipDetailList($scope.employeeDetailList);
                });
        };
        getPreviewDetails();
        $scope.filterTrainingViewDetailList = function(item) {
            //$scope.damageReportId = item._id;
            getTrainingViewDetails(item);
        };
        $scope.getNumber = function(num) {
            return new Array(num);
        };
        $scope.checkAttributeLength = function(attr, val) {
            var flag = false;
            if (angular.isDefined(attr) && angular.isDefined(val) && !angular.equals({}, val)) {
                var valueLength = Object.keys(val.attributes).length;
                if (attr.length > valueLength) {
                    $scope.totalLength = parseInt(attr.length) - parseInt(valueLength);
                    flag = true;
                }
                return flag;
            }
        };
        $scope.deleteTraining = function(item,selectedTraining) {
            var url = LndViewService.getUrl('deleteTraining') + "/" + item.training_id.$id;
            serverUtilityService.deleteWebService(url)
                .then(function(data) {
                    $scope.trainingView.details.list = utilityService.deleteCallbackProvision(data, item, $scope.trainingView.details.list,'training_id');
                
                     if(!data.data)
                     {
                         if(data.status!=='error')
                         {
                            utilityService.showSimpleToast(data.message)
                          
                            getTrainingSummaryDetails()
                            
                        }
                        else
                        {
                            utilityService.showSimpleToast(data.message)
                        }
                     }
                     else
                     {
                         if(data.data.status=='error') {
                             utilityService.showSimpleToast(data.data.message)
                            }
                     }
                    // if(data.data.status != 'error')
                    // {
                        
                    //     utilityService.showSimpleToast(data.data.message)
                    //     getTrainingViewDetails(item)   
                    // }
                    // else
                    // {
                        
                    //     utilityService.showSimpleToast(data.data.message)
                        
                    // }
                        
                    
                    
                     
                });
        };

        $scope.handlePopupAction = function(id, form) {
            
            if (angular.isDefined(form)) {
                utilityService.resetForm(form);
            }
            syncStockModel();
            $scope.trainingView.stock.isUnique = false;
            $scope.systemGeneratedUniqueID = false;
            $scope.trainingView.stock.attrList = [];
            $scope.trainingView.stock.stockRow = [];
            $scope.trainingView.stock.errorMessages = [];
            $scope.trainingView.stock.filterList = [];
            $scope.trainingView.stock.selectedList = null;
            $scope.trainingView.stock.listAction.selected = false;
            $scope.trainingView.stock.trainingAttributeList = [{
                "attribute_id": null,
                "attribute_value": null,
                list: []
            }];
            
            $('#add-lnd').appendTo('body').modal('show');
        };
        $scope.modifyVisibility=true
        
        var setModifyVisibility=function(){
            $scope.modifyDisabled={}
            var shouldNotOpen=true
            if(Object.keys($scope.trainingTypeHash).length!==0)
            {
                
                Object.keys($scope.trainingTypeHash).map(function (key) {
                    shouldNotOpen=shouldNotOpen && $scope.trainingTypeHash[key];
                    $scope.modifyDisabled[key]=($scope.trainingTypeHash[key])
                })
            }
            
            
           if(!shouldNotOpen)
           {
               $scope.modifyVisibility=true
               
           }
           else{
                $scope.modifyVisibility=false
           }
        }

        $scope.saveAttributesDisabled=function (item) {
            var result=false
            if(item.attrList)
            {
                item.attrList.map(function (attr) {
                    result =result & attr.value
                })
            }
            return result
        }

        

        $scope.getAttributeList = function(id, type) {
            $scope.trainingView.stock.isUnique = false;
            $scope.trainingView.stock.listAction.selected = false;
            $scope.trainingView.stock.stockRow = [];
            $scope.trainingView.stock.filterList = [];
            $scope.trainingView.stock.model.selectedTraining = null;
            $scope.trainingView.stock.trainingAttributeList = [{
                attribute_id: null,
                attribute_value: null,
                list: []
            }];
            $scope.createObj = {};
            angular.forEach($scope.trainingView.summary.detail, function(v, k) {
                if (id == v._id) {
                    $scope.systemGeneratedUniqueID = v.is_system_generated_unique_key;
                    $scope.trainingView.stock.attrList = v.attributes;
                }
            });
            angular.forEach($scope.trainingView.stock.attrList, function(v, k) {
                if (v.is_unique) {
                    $scope.trainingView.stock.isUnique = true;
                    $scope.trainingView.stock.uniqueId = LndViewService.extractId(v._id);
                }
            });
            if (type == 'stock') {
                LndViewService.addMoreRows(1, $scope.trainingView.stock.attrList, $scope.trainingView.stock.stockRow);
            }
        };
        $scope.getAttributeValueList = function(attributeId, index, trainingTypeId) {
            $scope.trainingView.stock.model.selectedTraining = null;
            var id = LndViewService.extractId(attributeId),
                url = LndViewService.getUrl('attributeList') + "/" + trainingTypeId + "/" + id;

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.trainingView.stock.trainingAttributeList[index].list = data.data;
                });
        };
        $scope.addFiltter = function() {
            var filter = {
                attribute_id: null,
                attribute_value: null,
                list: []
            };
            $scope.trainingView.stock.trainingAttributeList.push(filter);
        };
        $scope.remove = function(index, item) {
            item.splice(index, 1);
        };
        $scope.getFilterdList = function(trainingId, trainingTypeId) {
            $scope.trainingView.stock.selectedList = null;
            //$scope.trainingView.stock.selectedList.attributes = [];
            $scope.trainingView.stock.model.selectedTraining = null;
            $scope.trainingView.stock.listAction.selected = false;

            var url = LndViewService.getUrl('trainingValue') + "/" + trainingId,
                payload = LndViewService.createStockFilterPayload($scope.trainingView.stock.trainingAttributeList);

            serverUtilityService.getWebService(url, payload)
                .then(function(data) {
                    $scope.trainingView.stock.filterList = data.data;
                });
        };
        $scope.addMoreRows = function(rows) {
            LndViewService.addMoreRows(rows, $scope.trainingView.stock.attrList, $scope.trainingView.stock.stockRow);
            $scope.trainingView.stock.model.noRows = null;
        };
        var stockSuccessCallback = function(data, id, tabName) {
            data.data._id = data.data.training_type_id;//training_type_id
            
            data.data.attributes = $scope.getTrainingDetails(data.data.training_type_id, 'attr');
            data.data.training_name = $scope.getTrainingDetails(data.data.training_type_id, 'name');
            getTrainingViewDetails(data.data);
            if (angular.isDefined(tabName) && tabName == 'requestView') {
                $route.reload();
            }
            utilityService.showSimpleToast(data.message);
            $('#' + id).modal('hide');
            getTrainingSummaryDetails()
            
            
        };
        var stockErrorCallback = function(data) {
            if (data.status == 'error') {
                alert('Something went wrong');
            } else if (data.data.status == 'error') {
                angular.forEach(data.data.message, function(value, key) {
                    var obj = {
                        row: key,
                        error: []
                    };
                    angular.forEach(value, function(val, k) {
                        obj.error.push(val);
                    });
                    if (obj.error.length) {
                        $scope.trainingView.stock.errorMessages.push(obj);
                    }
                });
            }
        };
        var stockSuccessErrorCallback = function(data, id, tabName) {
            data.status == 'success' ? stockSuccessCallback(data, id, tabName) : stockErrorCallback(data);
        };
        $scope.saveNewStock = function(tabName) {
            $scope.trainingView.stock.errorMessages = [];
            createTrainingCapacityHash($scope.trainingView.summary.detail)
            
            var url = LndViewService.getUrl('addStock'),
                payload = LndViewService.createAddStockPayload($scope.trainingView.stock.stockRow, $scope.trainingView.stock.model,$scope.trainingCapacityHash);
                
            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    
                    stockSuccessErrorCallback(data, 'add-lnd', tabName);

                });
        };
        $scope.saveUpdateExitingStock = function() {
            var url = $scope.trainingView.stock.isUnique
                ? LndViewService.getUrl('addExistStock')
                : LndViewService.getUrl('updateExistStock');
            var payload = LndViewService.buildExistStockPayload($scope.systemGeneratedUniqueID, $scope.trainingView.stock.isUnique, $scope.trainingView.stock.uniqueId, $scope.trainingView.stock.model);
            if ($scope.trainingView.stock.isUnique) {
                serverUtilityService.postWebService(url, payload)
                    .then(function(data) {
                        stockSuccessErrorCallback(data, 'add-stock-existing-provision');
                    });
            } else {
                serverUtilityService.putWebService(url + "/" + payload.training_id, payload)
                    .then(function(data) {
                        stockSuccessErrorCallback(data, 'add-stock-existing-provision');
                    });
            }
        };
        /* $scope.getHistory = function(id, item) {
            $scope.trainingView.details.history.detailList = item;
            $('#' + id).appendTo('body').modal('show');
        }; */
        var historyCallback = function (data, id, item) {
            if (utilityService.getValue(data, "status") === "success") {
                $scope.trainingView.details.history.detailList = item;
                $scope.trainingView.details.history.detailList.history = utilityService.getValue(data, "data", []);
                $('#' + id).appendTo('body').modal('show');
            } else {
               
            }
        };
        $scope.getHistory = function(id, item) {            
            var url = LndViewService.getUrl('history') + "/" + item.training_id.$id;
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    historyCallback(data, id, item);        
                });            
        };
        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        $scope.flag = false;
        var getAlphaIndexing = function(resp,AllotmentFlag) {
            $scope.errCount = 0;
            var data = [];
            var list = angular.isDefined(AllotmentFlag) && AllotmentFlag ? resp.data : resp.data.provisions;
            angular.forEach(list, function(val, key) {
                data.push(val);
                angular.forEach(val, function(v, k) {
                    if (angular.isDefined(v.error)) {
                        if (v.error.length) {
                            $scope.errCount += 1;
                        }
                    }
                });
            });
            $scope.totalRecords = data.length;
            $scope.alphIndex = [];
            var len = Object.keys(data[0]).length;
            for (var i = 0; i < len; i++) {
                if (i > 25) {
                    $scope.alphIndex.push("A" + alphabets[(i % 25) - 1]);
                } else {
                    $scope.alphIndex.push(alphabets[i]);
                }
            }
            $scope.flag = true;
        };
        $scope.bindFileChangeEvent = function(trainingId) {
            $timeout(function() {
                $("input[type=file]").on('change', function() {
                    $scope.isUploaded = true;
                });
            }, 100);
        };
        $scope.reUpload = function() {
            $scope.isUploaded = false;
        };
        $scope.getSelectedTraining = function(id) {
            $scope.trainingView.stock.selectedList = null;
            angular.forEach($scope.trainingView.stock.filterList, function(v, k) {
                if (v._id == id) {
                    $scope.trainingView.stock.selectedList = v;
                }
            });
            $scope.handleAction($scope.trainingView.stock.listAction, 'selected', true);
        };
        $scope.getTrainingAttributeDetail = function(trainingId) {
            $scope.selectedTrainingId = trainingId;
            $scope.isUniqueAttribute = false;
            $scope.bulkTrainingFlag = false;
            $scope.selectedAttributeList = null;
            $scope.errCount = 0;
            $scope.parsedCsv = null;
            $scope.parsedCsvError = null;
            angular.forEach($scope.trainingView.summary.detail, function(value, key) {
                if (value._id == trainingId) {
                    $scope.selectedAttributeList = value.attributes;
                    angular.forEach(value.attributes, function(v, k) {
                        if (v.is_unique === true) {
                            $scope.isUniqueAttribute = true;
                        }
                    });
                }
            });
        };
        var downloadAllotCsv = function () {
           var url = LndViewService.getUrl('downloadAllotBulkCsv')
           serverUtilityService.getWebService(url)
                    .then(function (data) {
                        downloadFile(data.data);
                    });

        }
        var downloadFile = function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            window.location.assign(uri);
        };
        $scope.downloadCsv = function(trainingId) {
            if (trainingId && angular.isUndefined($routeParams.bulkType)) {
                $scope.bulkTrainingFlag = false;
                var url = LndViewService.getUrl('stockCsv') + "/" + $scope.selectedTrainingId,
                    payload = {
                        is_unique: $scope.isUniqueAttribute
                    },
                    csvName = 'Bulk_Stock_Csv';

                serverUtilityService.getWebService(url, payload)
                    .then(function(data) {
                        downloadFile(data.data, csvName + ".csv");
                    });
            }else if(angular.isDefined($routeParams.bulkType) && $routeParams.bulkType == 'allot' && $scope.user.isSuperAdmin){
                downloadAllotCsv()
            } else if(!trainingId && angular.isUndefined($routeParams.bulkType)) {
                $scope.bulkTrainingFlag = true;
            }
        };
        $scope.changeList = function(key) {
            $scope.parsedCsv = key == 'all' ? $scope.dataList : $scope.data;
        };
        var uploadStockSuccessCallback = function(response,AllotmentFlag) {
            $scope.csvErrorFlag = false;
            getAlphaIndexing(response.data,AllotmentFlag);
            $scope.data = [];
            angular.forEach(response.data.data, function(val, key) {
                var isError = false;
                angular.forEach(val, function(v, k) {
                    if (angular.isDefined(v.error)) {
                        isError = true;
                    }
                });
                isError ? $scope.data.push(val) : null;
            });
            $scope.parsedCsv = $scope.errCount == 0 ? response.data.data : $scope.data;
            $scope.dataList = response.data.data;
            utilityService.showSimpleToast(response.data.message);
        };
        var uploadErrorCallback = function(response,AllotmentFlag) {
            $scope.csvErrorFlag = true;
            $scope.parsedCsvError = response.data.data;
            getAlphaIndexing(response.data,AllotmentFlag);
        };
        var uploadProgressCallback = function(evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };
        $scope.uploadModel = {
            upload_zip: null
        };

        $scope.getTimestamp=function (date) {
            if(date)
            {
                return new Date(date).getTime()
            }
            else
            {
                return null
            }
        }
        $scope.saveStockOnImport = function(uploadType) {
            $scope.AllotmentFlag = uploadType === 'allot' ? true : false;
            if ($scope.selectedTrainingId) {
                var url = angular.isDefined($routeParams.bulkType) && $routeParams.bulkType == 'allot' && $scope.user.isSuperAdmin ? LndViewService.getUrl('uploadAllotCsv') + "/" + $scope.selectedTrainingId
                                 :LndViewService.getUrl('uploadStock'),
                    payload = {
                        training_type_id: $scope.selectedTrainingId,
                        is_unique: $scope.isUniqueAttribute,
                        upload_csv: $scope.uploadModel.upload_zip
                    };

                Upload.upload({
                    url: url,
                    headers: {
                        'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                    },
                    data: payload
                }).then(function(response) {
                    if ($routeParams.bulkType == 'allot') {
                        if(response.data.status == 'error'){
                             alert(response.data.error);
                        }else{
                        utilityService.showSimpleToast(response.data.message);
                        uploadStockSuccessCallback(response,$scope.AllotmentFlag);
                        }
                    } else {
                        uploadStockSuccessCallback(response,$scope.AllotmentFlag);
                    }
                }, function(response) {
                    uploadErrorCallback(response,$scope.AllotmentFlag);
                }, function(evt) {
                    uploadProgressCallback(evt);
                });
            } else {
                $scope.bulkTrainingFlag = true;
            }
        };
        $scope.report = {
            list: [],
            content: [],
            listWithoutHeader: []
        };
        $scope.exportToCsv = function(item) {
            var attrList = new Array();//"Status", "Current User", "Current User ID"
            angular.forEach($scope.trainingView.details.column, function(val, key) {
                attrList.push(val.attribute_name);
            });
            $scope.report = {
                content: new Array(attrList),
            };
            
            angular.forEach($scope.trainingView.details.list, function(value, key) {
                var array = new Array();
                var trainingTypeIndex=1
                var count=0
                angular.forEach(value.attributes, function(v, k) {
                    
                    if(count==trainingTypeIndex)
                    {
                        array.push($scope.learningType[v]);
                    }
                    else
                    {
                        array.push(v)
                    }
                    count++
                });
                $scope.report.content.push(array);
            });
            var reportName = "Training View.csv";
            if ($scope.report.content.length > 1) {
                setTimeout(function() {
                    utilityService.exportToCsv($scope.report.content, reportName);
                }, 500);
            }
        };
        var getTrainingName = function(typeId) {
            var trainingName = null;
            angular.forEach($scope.requestView.requestDetails.trainingType, function(value, key) {
                if (value._id == typeId) {
                    trainingName = value.training_name;
                }
            });

            return trainingName;
        };
        $scope.exportDamagedReport = function(trainingTypeId) {
            //getDamagedProvisionDetails(trainingTypeId);
            var attrList = new Array("Asset ID", "Provision Type", "Damage Remarks", "Amount", "Amount  Borne By", "Logged By", "Logged On");
            $scope.report = {
                content: new Array(attrList),
            };
            angular.forEach($scope.damageProvisionDetailList, function(value, key) {
                var array = new Array();
                array.push(value.asset_id ? value.asset_id : "");
                array.push(getTrainingName(value.training_type_id) ? getTrainingName(value.training_type_id) : "N/A");
                array.push(value.damage_remark ? value.damage_remark : "N/A");
                array.push(value.repair_cost ? value.repair_cost : "N/A");
                array.push(value.born_by_details.full_name ? value.born_by_details.full_name : "N/A");
                array.push(value.logged_by_details.full_name ? value.logged_by_details.full_name : "N/A");
                array.push(value.logged_on ? value.logged_on : "N/A");
                $scope.report.content.push(array);
            });
            var reportName = "Damaged Provision.csv";
            if ($scope.report.content.length > 1) {
                setTimeout(function() {
                    utilityService.exportToCsv($scope.report.content, reportName);
                }, 500);
            }
        };
        $scope.goBack = function(tab, subtab) {
            subtab = $scope.bulkUploadType == 'allot' && $scope.user.isSuperAdmin ? 'requestView' : subtab;
            $location.url('frontend/lnd-manager').search({
                tab: tab,
                subtab: subtab
            });
        };
        var getEmployeeDetails = function() {
            var url = LndViewService.getUrl('getEmployee');
            serverUtilityService.getWebService(url).then(function(data) {
                $scope.employeeList = data.data;
                self.repos = loadAll();
            });
        };
        getEmployeeDetails();
        $scope.handleAction = function(actionObject, action, flag) {
            angular.forEach(actionObject, function(value, key) {
                actionObject[key] = false;
            });
            actionObject[action] = flag;
        };

        $scope.learningType={
            1:'Classroom',
            2:'Self',
            3:'Virtual Classroom'
        }

        $scope.editTrainingObject = null;
        $scope.editTraining = function(item, columns) {
            $scope.editTrainingObject = {
                training_type_id: utilityService.getValue(item, 'training_type_id'),
                training_id: item.training_id.$id,
                attributeList: [],
                item: item
            };
            //Adding support for email, dropdown
            angular.forEach(columns, function(value, key) {
              if (!value.is_unique && (
                    utilityService.getInnerValue(value, 'field_type', 'field_type') == 1
                || utilityService.getInnerValue(value, 'field_type', 'field_type') == 2
                || utilityService.getInnerValue(value, 'field_type', 'field_type') == 3 
                || utilityService.getInnerValue(value, 'field_type', 'field_type') == 4
                || utilityService.getInnerValue(value, 'field_type', 'field_type') == 5 
                // || utilityService.getInnerValue(value, 'field_type', 'field_type') == 6
                || utilityService.getInnerValue(value, 'field_type', 'field_type') == 8
                || utilityService.getInnerValue(value, 'field_type', 'field_type') == 9
                || utilityService.getInnerValue(value, 'field_type', 'field_type') == 12
                )) {
                var fieldType=utilityService.getInnerValue(value, 'field_type', 'field_type')
                
                $scope.editTrainingObject.attributeList.push({
                  _id: value._id.$id,
                  name: utilityService.getValue(value, 'attribute_name'),
                  value: fieldType==5?modifyDate(item.attributes[value._id.$id]): item.attributes[value._id.$id],
                  field_type: utilityService.getValue(value, 'field_type')
                });
              }
            });

            $scope.openModal('editTrainingAttributeValue', 'edit-asset-attribute-value.tmpl.html', 'lg');
        };

        //Returns number of trainings associated with a particular training_type_id
        $scope.getTrainingTypeQuantity=function (training_type_id) {
            var quant=0;
           
            $scope.trainingView.details.list.map(function (item) {
                    
                    if(item.training_type_id===training_type_id)
                    {
                        quant+=1
                    }
                
            })
             
            return quant
        
             
        }

        $scope.updateAttributeValues = function () {
          var url = LndViewService.getUrl('updateAttributeValues') + "/"
              + $scope.editTrainingObject.training_id,
              payload = LndViewService.buildUpdateAttributeValuesPayload($scope.editTrainingObject);

          serverUtilityService.putWebService(url, payload)
            .then(function(data) {
                if (utilityService.getValue(data, 'status') == 'success') {
                  getTrainingSummaryDetails();
                  
                  $scope.closeModal('editTrainingAttributeValue');
                  utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                } else {
                  alert(utilityService.getValue(data, 'message'));
                }
            });
        };

        /********* Start Angular Modal Section *********/
        $scope.openModal = function(instance, template, size) {
            $scope.modalInstance[instance] = $modal.open({
                templateUrl : template,
                scope : $scope,
                size: size,
                backdrop: 'static'
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        /********* End Angular Modal Section *********/

        /************ START SIGNATORY AUTOCOMPLETE ************/
        function selectedItemChange(item, model, key) {
            if (angular.isDefined(model[key]) && angular.isDefined(item) && item) {
                model[key] = LndViewService.extractId(item._id);
            }
        }
        function querySearch(query) {
            return query ? self.repos.filter(createFilterFor(query)) : self.repos;
        }
        function searchTextChange(text, model, key) {
            if (angular.isDefined(model[key])) {
                model[key] = null;
            }
        }
        function loadAll() {
            var repos = $scope.employeeList;
            return repos.map(function(repo) {
                repo['full_name'] = angular.isDefined(repo.full_name) ? repo.full_name : null;
                repo.value = repo.full_name.toLowerCase();
                return repo;
            });
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }
        /************ END SIGNATORY AUTOCOMPLETE ************/

        /**** Start Pagination Section ****/
        $scope.updatePaginationSettings('provision_manager_view');
        /**** End Pagination Section ****/

        /***** Start: Search by employee name and code section */
        $scope.usermanagent = {
            searchKey: 'unique_attribute_name',
            searchText: 'Search by Unique Attribute'
        };
        $scope.changeSearchTextHandler = function (search) {
            $scope.name_filter = {};
            $scope.usermanagent.searchText = search == 'unique_attribute_name' 
                ? 'Search by Unique Attribute'
                : (search == 'employee_id' ? 'Search by Employee Code' : 'Search by Employee Name');
        };
        /***** End: Search by employee name and code section */


        $scope.convertTimeStamp = function (stamp) {
            return {
                date:utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[0],
                time:utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[1]+' '+utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A" ).split(' ')[2]
            };
        }

        $scope.dateView=function (date) {
            var vals=date.split('/').reverse().join('-')
            var timestamp=new Date(vals).getTime()
            return $scope.convertTimeStamp(timestamp).date
        }

        $scope.timeView=function (time) {
            return moment(time, 'HH:mm').format('hh:mm a') 
        }

        var addHttpPrefix=function (url) {
            var regex=/^http/
            if(regex.test(url))
            {
                return url
            }
            else
            {
                return 'https://'+url
            }
        }
        $scope.openUrlInOtherTab=function (url) {
            window.open(addHttpPrefix(url),'_blank')
        }

        var modifyDate=function (date) {

            var temp=date.split('/')
            var modDate=temp[2]+'-'+temp[1]+'-'+temp[0]+' 00:00:00'
            return new Date(modDate)

        }

        // var editTimeView=function (time,type) {
        //     if(type==6)
        //     {
        //         var editTime='01-JAN-2020 '+time
        //         return moment(editTime,).format(,'DD-MMM-YYYY HH:mm') 
        //     }
        //     else if(type==5)
        //     {
        //         return moment(time).format(,'DD-MMM-YYYY')
        //     }
        // }

    }
]);
