app.controller('RegularizationReqController', [
    '$scope', '$rootScope', '$q','$modal', '$mdDialog', 'utilityService', 'ServerUtilityService', 'ReguReqService', 'FORM_BUILDER',
    function ($scope, $rootScope, $q, $modal, $mdDialog, utilityService, serverUtilityService, ReguReqService, FORM_BUILDER) {

        var self = this;
        self.notifyTo = [];
        self.allEmployees = [];
        self.querySearchChips = querySearchChips;

        $scope.employeeList = [];
        $scope.questionTypeConstant = FORM_BUILDER.questionType;
        $scope.args = null;
        $scope.reqName = null;
        $scope.isEmployeeReq = true;
        $scope.relationship = null;
        $scope.regReq = null;
        $scope.reqFields = null;
        $scope.totalReguRequests = [];
        $scope.errorMessages = [];
        $scope.bulkRegularization = {
            dateInString: null,
            commonInTime: null,
            commonOutTime: null,
            comment: null,
            date: null,
            commonDaysToCredit: null,
            apiError: {
                status: false,
                header: ['Employee', 'Error'],
                errors: new Array,
                errorCount: null,
                successCount: null
            }
        }

        var syncRegularizationRequestModel = function (model) {
            $scope.regReq = ReguReqService.buildLeaveRequestModel(model);
        };
        var reguDetailsCallback = function (model, args) {
            $scope.questionList = utilityService.getInnerValue(model, 'form_detail', 'questions', []);
            
            angular.forEach($scope.questionList, function (value, key) {
                if (value.question_type != 3 && angular.isDefined(value.answer)
                        && angular.isArray(value.answer)) {
                    value.answer = value.answer[0];
                }
            });

            model.form_data = model;
            syncRegularizationRequestModel(model);
            toggleModal('regularizationRequest', 'regReq.html', true);
        };
        var updateFormate = function (arr) {
            if(arr.length) {
                if(arr[0] == 12) {
                   return parseInt(12) + ":" + arr[1];   
                } else {
                    return parseInt(arr[0]) + 12 + ":" + arr[1];  
                }                
            }
        };
        $scope.totalReq = function () {
            $scope.totalReguRequests = [];
            $scope.errorMessages = [];

            var attRecord = utilityService.getInnerValue($scope.args, 'params', 'isAdminBulk', false) === true
                ? utilityService.getInnerValue($scope.args, 'params', 'list')
                : angular.copy($scope.attendanceRecord);
            
            angular.forEach(attRecord.attendance, function (val, key) {
                if (val.date.split("/")[0] == parseInt($scope.args.params.calReguDate)) {
                    val.isCheck = true;
                }
            });

            angular.forEach(attRecord.attendance, function (row, index) {
                if (row.isCheck == true || row.isIndividual == true 
                    || utilityService.getValue(row, 'isChecked', false) == true) {

                    row.in_time = row.in_time == '-' || !utilityService.getValue(row, 'in_time') 
                        ? null : new Date("1970-01-01" + " " + (row.in_time.includes('am') 
                            ? row.in_time.replace(' am', '') : (row.in_time.includes('pm') 
                                ? updateFormate(row.in_time.replace(' pm', '').split(':')) 
                                : row.in_time.replace(' pm', ''))));
                    row.out_time = row.out_time == '-' || !utilityService.getValue(row, 'in_time') 
                        ? null : new Date("1970-01-01" + " " + (row.out_time.includes('am') 
                            ? row.out_time.replace(' am', '') : (row.out_time.includes('pm')
                                ? updateFormate(row.out_time.replace(' pm', '').split(':')) 
                                : row.out_time.replace(' pm', ''))));

                    $scope.totalReguRequests.push(row);
                };
            });
        };
        var makeRequest = function (item) {
            var date = utilityService.getValue(item, 'is_future', false) == true
                ? utilityService.dateToString(new Date(item.future_date))
                : utilityService.dateToString(new Date(item.date));
            
            $scope.totalReguRequests = [];
            var obj = {
                in_time: null,
                out_time: null,
                emp_id: item.empId,
                date: date
            };
            $scope.totalReguRequests.push(obj);
        };
        var getReguDetails = function (item) {
            $scope.reqName = item.name;
            $scope.isEmployeeReq = item.isEmployee;
            $scope.relationship = item.relationship;
            $scope.catId = item.id;
            if (utilityService.getValue(item, 'isAdminBulk')) {
                $scope.employeeId = item.empId;
            }            
            var url = $scope.employeeId || !item.isEmployee
                ? (ReguReqService.getUrl('getAdminApprovers') + "/" + item.id + "/" + ($scope.employeeId?$scope.employeeId:item.empId))
                : ReguReqService.getUrl('getApprovers') + "/" + item.id;

            $q.all([
                serverUtilityService.getWebService(ReguReqService.getUrl('employee')),
                serverUtilityService.getWebService(url)
            ]).then(function (data) {
                $scope.employeeList = data[0].data;
                self.allEmployees = loadChipList();
                $scope.reqFields = data[1].data;
                (item.isEmployee || item.isAdminBulk) && !item.is_future ? $scope.totalReq() : makeRequest(item);
                reguDetailsCallback(data[1].data.form_data);                   
            });
        };

        $scope.totalBulkReq = function () {
            $scope.totalReguRequests = [];
            $scope.errorMessages = [];

            var attRecord = utilityService.getInnerValue($scope.args, 'params', 'isAdminBulk', false) === true
                ? utilityService.getInnerValue($scope.args, 'params', 'list')
                : angular.copy($scope.attendanceRecord);
            
            angular.forEach(attRecord.attendance, function (val, key) {
                if (val.date.split("/")[0] == parseInt($scope.args.params.calReguDate)) {
                    val.isCheck = true;
                }
            });

            angular.forEach(attRecord.attendance, function (row, index) {
                if (row.isCheck == true || row.isIndividual == true 
                    || utilityService.getValue(row, 'isChecked', false) == true) {

                    row.in_time = row.in_time == '-' || !utilityService.getValue(row, 'in_time') 
                        ? null : new Date("1970-01-01" + " " + (row.in_time.includes('am') 
                            ? row.in_time.replace(' am', '') : (row.in_time.includes('pm') 
                                ? updateFormate(row.in_time.replace(' pm', '').split(':')) 
                                : row.in_time.replace(' pm', ''))));
                    row.out_time = row.out_time == '-' || !utilityService.getValue(row, 'in_time') 
                        ? null : new Date("1970-01-01" + " " + (row.out_time.includes('am') 
                            ? row.out_time.replace(' am', '') : (row.out_time.includes('pm')
                                ? updateFormate(row.out_time.replace(' pm', '').split(':')) 
                                : row.out_time.replace(' pm', ''))));

                    $scope.totalReguRequests.push(row);
                };
            });
        };
    


        /* Listening request leave broadcast event triggered from request/modify leave callback */
        $scope.$on('request-regu', function (event, args) {
            self.notifyTo = [];
            $scope.args = args;
            if(args.params.isBulkRegularization){
                $scope.bulkRegularization = resetToInitialState();
                getBulkReguDetails(args.params)
            }else{
                getReguDetails(args.params);
            }
        });

        var formatTime = function (time) {
            if(isNaN(time)){
                return null;
            }
            if (angular.isDefined(time.getHours()) && angular.isDefined(time.getMinutes())) {
                return time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
            }
        };
        var extractIds = function (list) {
            var ids = [];
            angular.forEach(list, function (value, key) {
                ids.push(value.id);
            });
            return ids;
        };
        $scope.applyReq = function () {
            angular.forEach($scope.totalReguRequests, function (val, key) {
                if (utilityService.getValue(val, 'in_time')) {
                    val.start_time = formatTime(val.in_time);
                    if(val.start_time === null){
                        val.in_time = null
                    }
                }

                if (utilityService.getValue(val, 'out_time')) {
                    val.end_time = formatTime(val.out_time);
                    if(val.end_time === null){
                        val.out_time = null
                    }
                }
            });
            var payload = ReguReqService.buildLeaveRequestPayload($scope.questionList);
            payload.category = $scope.catId;
            payload.request_data = $scope.totalReguRequests;
            payload.comment = $scope.regReq.form.comment;
            payload.also_notify = extractIds(self.notifyTo);
            if($scope.employeeId){
                payload.admin_requested=true;
                payload.employee_id=$scope.employeeId;
            }
            var url = ReguReqService.getUrl('applyRegReq');
            serverUtilityService.uploadWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, 'reguReq');
                });
        };        
        $scope.applyReqFromManager = function () {
           angular.forEach($scope.totalReguRequests, function (val, key) {

                if(val.in_time && angular.isDefined(val.in_time)){
                    val.start_time = formatTime(val.in_time);
                    if(val.start_time === null){
                        val.in_time = null
                    }
                }

                if(val.out_time && angular.isDefined(val.out_time)){
                    val.end_time = formatTime(val.out_time);
                    if(val.end_time === null){
                        val.out_time = null
                    }
                }
            });
            var payload = ReguReqService.buildLeaveRequestPayload($scope.questionList);
            payload.category = $scope.catId;
            payload.request_data = $scope.totalReguRequests;
            payload.comment = $scope.regReq.form.comment;
            payload.relationship = $scope.relationship ;
            payload.also_notify = extractIds(self.notifyTo);
            if($scope.employeeId) {
                payload.admin_requested = true;
                payload.employee_id = $scope.employeeId;
            }
            if($scope.relationship) {
                var url = ReguReqService.getUrl('applyManagerRegReq') + "/" + $scope.totalReguRequests[0].emp_id; 
            } else {
                var url = ReguReqService.getUrl('applyAdminRegReq') + "/" + utilityService.getInnerValue($scope.totalReguRequests, '0', 'emp_id', $scope.employeeId);  
            }
            serverUtilityService.uploadWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, 'reguReq');
                });
        };        
        var updateList = function() {
            if ($scope.attendanceRecord) {
                angular.forEach($scope.attendanceRecord.attendance , function(val, key) {
                    val.isCheck = false; 
                }); 
            }   
        };
        var broadCastEvent = function (event, params) {
            $rootScope.$broadcast(event, {
                params: params
            });
        };        
        var successCallback = function (data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            $scope.$emit("regReqSuccess");
            toggleModal('regularizationRequest', 'regPolicies.html', false);            
            /*** NOTE: This event has been listened within bulk regularization controller, 
                * once listening this event entire list will be reloaded ***/
            if (utilityService.getInnerValue($scope.args, 'params', 'isAdminBulk')) {
                broadCastEvent('admin-bulk-regularization-done', {
                    regularizationDone: true
                });
            } else {
                broadCastEvent('request-attendance-callback', {
                    regularizationOne: true
                });
                updateList();
            }            
        };
        var errorCallback = function (data, section) {
            $scope.errorMessages = [];
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
                angular.forEach(data.message, function (value, key) {
                    angular.forEach(value, function(v, k) {
                        $scope.errorMessages.push(v && angular.isArray(v) 
                            ? utilityService.getValue(v, '0', v) : v);
                    });
                });
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                if(angular.isString(data.data.message)) {
                    $scope.errorMessages.push(data.data.message);
                } else {
                    angular.forEach(data.data.message, function (value, key) {
                        $scope.errorMessages.push(value[0]);
                    });
                }
            }
        };
        var successErrorCallback = function (data, section) {
            data.status === "success" ?
                successCallback(data, section) : errorCallback(data, section);
        };
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        $scope.clickQuestionAnswer = function (item, answer) {
            item.answer = angular.isDefined(item.answer) && item.answer != "" ? item.answer : [];
            var idx = item.answer.indexOf(answer);
            (idx > -1) ? item.answer.splice(idx, 1) : item.answer.push(answer);
        };        
        var toggleModal = function (instance, templateUrl , flag){
            flag = angular.isDefined(flag) ? flag : false;
            flag ? $scope.openModal(instance, templateUrl) : $scope.closeModal(instance);
        };
        
        /***** Start Angular Modal Section *****/
        $scope.openModal = function(instance, templateUrl, size) {
            size = angular.isDefined(size) ? size : 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope:$scope,
                windowClass: 'app-modal-lg',
                size: size,
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function(instance) {
            if (utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };
        /***** End Angular Modal Section *****/

        /******** Start Chip Integration **********/
        function querySearchChips(keyword) {
            return keyword ? self.allEmployees.filter(createFilterForChips(keyword)) : [];
        }
        function createFilterForChips(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(approver) {
                return (approver._lowername.indexOf(lowercaseQuery) != -1);
            };
        }
        function loadChipList() {
            var list = [];
            angular.forEach($scope.employeeList, function (c, key) {
                if (c.full_name) {
                    var object = {
                        id: c._id && c._id.$id ? c._id.$id : c._id,
                        name: c.full_name,
                        image:  c.profile_pic
                    };
                    object._lowername = object.name.toLowerCase();
                    list.push(object);
                }

            });
            return list;
        }


        var getBulkReguDetails = function (item) {
            $scope.totalReguRequests = []
            $scope.bulkRegularization.date = new Date(item.date)
            $scope.reqName = item.name;
            $scope.bulkRegularization.dateInString = utilityService.dateToString($scope.bulkRegularization.date)

            $scope.isEmployeeReq = item.isEmployee;
            $scope.relationship = item.relationship;
            $scope.catId = item._id;
            var url = ReguReqService.getUrl('adminBulkRegularization') + '/' + item._id;
            serverUtilityService.getWebService(url)
            .then(function (data) {
               console.log(data)
               $scope.employeeList = angular.copy($scope.args.params.employeesList);
               angular.forEach($scope.employeeList, function (row, index) {
                if (row.isCheck == true || row.isIndividual == true 
                    || utilityService.getValue(row, 'isChecked', false) == true) {

                    row.in_time = row.in_time == '-' || !utilityService.getValue(row, 'in_time') 
                        ? null : new Date("1970-01-01" + " " + (row.in_time.includes('am') 
                            ? row.in_time.replace(' am', '') : (row.in_time.includes('pm') 
                                ? updateFormate(row.in_time.replace(' pm', '').split(':')) 
                                : row.in_time.replace(' pm', ''))));
                    row.out_time = row.out_time == '-' || !utilityService.getValue(row, 'in_time') 
                        ? null : new Date("1970-01-01" + " " + (row.out_time.includes('am') 
                            ? row.out_time.replace(' am', '') : (row.out_time.includes('pm')
                                ? updateFormate(row.out_time.replace(' pm', '').split(':')) 
                                : row.out_time.replace(' pm', ''))));

                    $scope.totalReguRequests.push(row);
                };
            });
               self.allEmployees = loadChipList();
               $scope.reqFields = data.data;
               toggleModal('regularizationRequest', 'regReq.html', true);
            //    reguDetailsCallback(utilityService.getValue(data.data, 'form_data'));     
            });
        };    

        $scope.buildCommonTime = function(commonTime, to) {
            
            angular.forEach($scope.totalReguRequests, function (row, index) {
                if(to === 'inTime') {
                  row.in_time = commonTime;
                }
                if(to === 'outTime') {
                  row.out_time = commonTime;
                }
            });

        }


        $scope.buildCommonCompOf = function(value) {
            angular.forEach($scope.totalReguRequests, function (row, index) {
               row.credit_days = value;
            });
        }

        var policyCallback = function (ev) {
            var payload = {};
            var date =unixTimeStamp($scope.bulkRegularization.date);
            payload.bulk_data = ReguReqService.buildPayloadRegFromAdmin($scope.totalReguRequests);
            payload.comment = $scope.bulkRegularization.comment;
            var url = ReguReqService.getUrl('postAdminBulkRegularizationValidation') + "/" + date + "/" + $scope.catId;  
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    payload.validation_key = utilityService.getValue(data.data, 'validation_key');
                    if(utilityService.getValue(data, 'status') === 'success') {
                        showConfirm(ev, 'successfully validate please submit', undefined, payload, bulkAdinSuccessCallback)
                    }else {
                        bulkAdminErrorCallback(ev, data.data, payload) ;
                    }
            });
        }

        $scope.applyReqFromAdmin = function(ev) { 
            policyCallback(ev)
        }

        var bulkAdinSuccessCallback = function(payload) {
            console.log(payload)
            var date =unixTimeStamp($scope.bulkRegularization.date);
            var url = ReguReqService.getUrl('postAdminBulkRegularizationApply') + "/" + date + "/" + $scope.catId;  
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    if(utilityService.getValue(data, 'status') === 'success') {
                      if(utilityService.getValue(data.data, 'error_count') == 0){
                          $scope.closeModal("regularizationRequest");
                          utilityService.showSimpleToast('success');
                          broadCastEvent('admin-bulk-regularization-done-callback', {
                            regularizationDone: true
                          });
                      }else {
                        $scope.bulkRegularization.apiError.errorCount = utilityService.getValue(data.data, 'error_count')
                        $scope.bulkRegularization.apiError.successCount = utilityService.getValue(data.data, 'success_count')
                      }
                    }else {
                      console.log(data)
                    }
            });
        }

        var bulkAdminErrorCallback = function(ev, data, payload) {
            $scope.bulkRegularization.apiError.errors = utilityService.getValue(data, 'error')
            
            if(utilityService.getValue(data, 'error').length > 0) {
                $scope.bulkRegularization.apiError.status = true;
            }else if(utilityService.getValue(data, 'method_not_assigned_to') > 0) {
                var count = utilityService.getValue(data, 'method_not_assigned_to');
                var policyName = utilityService.getInnerValue($scope.args, 'params', 'name')
                showAlert(ev, "You cannot proceed further as " + count + " of the selected employees have not been assigned the " + policyName + " policy. To view the complete list of assigned employees to this policy download the System Plan report from Left Navigation >> Admin Tools >> Reports >> User Management")
            } else if(utilityService.getValue(data, 'method_excluded_for') > 0){
                var count = utilityService.getValue(data, 'method_excluded_for');
                var content = "This regularisation type is not included in the time plan for " + count + " of the selected employees. If you still wish to proceed then click on Submit."
                var title = "Would you like to proceed ?"
                showConfirm(ev, content, title, payload, bulkAdinSuccessCallback)
                //show confiem dialog
            }

        }

        var showAlert = function(ev, content) {
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Alert!')
                .textContent(content)
                .ariaLabel('')
                .ok('Got it!')
                .targetEvent(ev)
            );
        };

        var showConfirm = function(ev, content, title, data, functionName) {
            title = angular.isDefined(title) ? title : 'Would you like to proceed'
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title(title)
                  .textContent(content)
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Submit')
                  .cancel('Cancel');
        
            $mdDialog.show(confirm).then(function() {
              console.log('proccedd')
              console.log(data)
              functionName(data)
            }, function() {
               console.log('dialog cancel')
            });
        };

        var resetToInitialState = function() {
            return {
                dateInString: null,
                commonInTime: null,
                commonOutTime: null,
                comment: null,
                date: null,
                commonDaysToCredit: null,
                apiError: {
                    status: false,
                    header: ['Employee', 'Error'],
                    errors: new Array,
                    errorCount: null,
                    successCount: null
                }
            }
        }
        var unixTimeStamp = function(date) {
            return Math.floor(date.getTime() / 1000)
        }


        $scope.isValidationButtonDisabled = function() {
            return !($scope.bulkRegularization.commonInTime !== null &&
            $scope.bulkRegularization.commonOutTime !== null && $scope.bulkRegularization.comment !== null)
        }
        /******** End Chip Integration **********/

        /*** Start: Attachment Question Section ****/
        $scope.setFileObject = function(file, item){
            item.fileError = null;
            if(!file) {
                return;
            }

            var is_valid_file = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
            
            if(is_valid_file){
                item.fileError = "Each file size must be less than or equal to " + $scope.allowedFileSizeGlobal.text;
                return ;
            }else{
                item.fileError = null;
            }
            item.isUploaded = true;
            item.proof = file;
        };
        $scope.removeUpload = function(item){
            item.isUploaded = false;
            item.answer = null;
        };
        // $scope.downloadAnswerAttachment = function(item) {
        //     var url = service.getUrl('downloadAnswerAttachment') 
        //         + "/" + utilityService.getInnerValue($scope.evaluation.details, 'recommendation_details', 'recommendation_id') 
        //         + "/" + item._id;

        //     $scope.viewDownloadFileUsingForm(url);
        // };
        /*** End: Attachment Question Section ****/

    }
]);