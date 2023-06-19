app.controller('EmployeeLeaveDetailController', [
	'$scope', '$rootScope', '$location', '$timeout', '$modal', 'utilityService', 'ServerUtilityService', 'EmployeeLeaveDetailService', 'TimeOffService', 'LeaveSummaryService',
	function ($scope, $rootScope, $location, $timeout, $modal, utilityService, serverUtilityService, empLeaveDetailService, timeOffService, summaryService) {
        var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);
        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        $scope.model = empLeaveDetailService.buildEmployeeDetailObject();
        $scope.timeoff = empLeaveDetailService.buildTimeOffObject();
        $scope.updatePaginationSettings('my_team_time_off');
        $scope.updatePaginationSettings('individual_requests_listing');
        $scope.errCount = 0;
        $scope.alphIndex = null;
        $scope.totalRecords = null;

        var isSectionMyTeam = function() {
            return $scope.section.dashboard.team;
        };                        
        var buildGetParams = function() {
            var params = {
                permission: $scope.model.action.current.permission_slug
            };            
            if(isSectionMyTeam()) {
                params.rel_id = $scope.relationship.primary.model._id;
                params.direct_reportee = $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false;
                if(teamOwnerId) {
                    params.emp_id = teamOwnerId;
                }
            }

            return params;
        };
        var allLeaveTypes = function() {
            serverUtilityService.getWebService(empLeaveDetailService.getUrl('getLeaveType')+"?status=true")
                .then(function (data){
                    $scope.leaveList = data.data;
                    $scope.bulkList = data.data;
                    $scope.model.leaveId = $scope.leaveList[0]._id;
                    $scope.model.leaveBulkId = $scope.bulkList[0]._id;
                });
        };
        allLeaveTypes();
        var leaveListCallback = function (data) {
            angular.forEach(data.data, function (value, key) {
                value.leave_data.approved_leave = isNaN(value.leave_data.approved_leave) 
                    ? value.leave_data.approved_leave 
                    : parseFloat(value.leave_data.approved_leave);

                value.leave_data.availed_leave = isNaN(value.leave_data.availed_leave) 
                    ? value.leave_data.availed_leave 
                    : parseFloat(value.leave_data.availed_leave);

                value.leave_data.balance_leave = isNaN(value.leave_data.balance_leave) 
                    ? value.leave_data.balance_leave 
                    : parseFloat(value.leave_data.balance_leave);

                value.leave_data.deduct_leave = isNaN(value.leave_data.deduct_leave) 
                    ? value.leave_data.deduct_leave 
                    : parseFloat(value.leave_data.deduct_leave);

                value.leave_data.pending_leave = isNaN(value.leave_data.pending_leave) 
                    ? value.leave_data.pending_leave 
                    : parseFloat(value.leave_data.pending_leave);
            });
        };

        var allFilterObject = [{countObject: 'group',isGroup: true,collection_key: 'employee_preview'}];
        
        var getEmployeeLeaveList = function() {
            if(!$scope.model.action.current) {
                return false;
            }
            $scope.model.visible = false;
            var url = empLeaveDetailService.getUrl(isSectionMyTeam() ? 'empLeaves' : 'empLeavesAdmin') 
                +'/' + $scope.model.leaveId;

            serverUtilityService.getWebService(url, buildGetParams())
                .then(function(data) {
                    leaveListCallback(data);
                    // angular.forEach(data.data, function(val, key) {
                    //     val['employee_preview'] = val;
                    // })
                    $scope.model.pending.count = empLeaveDetailService.getTotalPendingRequests(data.data);
                    $scope.model.list = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.model.list, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);                    
                    $scope.model.visible = true;
                });
        };        
        $scope.updateEmpLeaveList = function(id) {
            $scope.model.leaveId = id;
            $scope.model.individualRequests.status ? getIndividualRequests() : getEmployeeLeaveList();
        };
        $scope.updateEmpLeaveBulkList = function(id) {
            $scope.model.leaveBulkId = id;
        };        
        var getActionList = function() {
            var url = null;

            if(isSectionMyTeam()) {
                url = empLeaveDetailService.getUrl('actionNonAdmin') + "/lms/" + $scope.relationship.primary.model._id
            } else {
                url = empLeaveDetailService.getUrl('actionAdmin') + "/lms";
            }
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    angular.forEach(data.data, function(value, key) {
                        value._id = angular.isObject(value._id) ? value._id.$id : value._id;
                        if(value.permission_slug.indexOf('report') >= 0) {
                            data.data.splice(key, 1);
                        }                        
                    });
                    $scope.model.action.list = data.data;
                    $scope.model.action.current = data.data.length ? data.data[0] : null;
                    if(data.data.length) {
                        getEmployeeLeaveList();
                    }
                });
        };
        getActionList();   
        
        var getLeaveTypeList = function(id) {
            id = angular.isDefined(id) ? id : null;
            var url = id ? (timeOffService.getUrl('summary') + "/" + id) 
                : empLeaveDetailService.getUrl('leaveList');

            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.model.leaveTypeList = timeOffService.buildSummaryList(data.data);
                    $scope.model.creditDebit = empLeaveDetailService.buildEmployeeDetailObject().creditDebit;
                    toggleModal('credit-debit', true);
                });
        }        
        $scope.changeTab = function(model, tab) {            
            angular.forEach(model, function(value, key) {
                model[key] = false;
            });
            model[tab] = true;
            if ($scope.model.individualRequests.status) {
                getEmployeeLeaveList($scope.model.leaveId);
            }
            $scope.model.individualRequests.status = false;
        };        
        $scope.selectAllEmployees = function(model) {
            angular.forEach(model.list, function(value, key) {
                value.isChecked = model.isChecked;
            });
        };   
        var getSelectedEmployeesForCreditDebit = function(list) {
            var checkedList = [];
            angular.forEach(list, function(value, key) {
                if(value.isChecked) {
                    value.isChecked = true;
                    checkedList.push(value);
                }
            });
            return checkedList;
        };     
        var getSelectedEmployeesForApproveReject = function(list) {           
            var checkedList = [];
            angular.forEach(list, function(value, key) {
                if(value.isChecked && utilityService.getInnerValue(value, 'leave_data', 'pending_leave')) {
                    value.isChecked = true;
                    angular.forEach(value.leave_details, function(v, k) {
                        v.isChecked = true;
                    });
                    checkedList.push(value);
                }
            });
            return checkedList;
        };
        $scope.creditDebitLeaves = function(form) {
            utilityService.resetForm(form);
            $scope.model.selectedEmployees = [];
            $scope.model.selectedEmployees = getSelectedEmployeesForCreditDebit($scope.model.list);
            $scope.model.creditDebit.leaveType = null;
            getLeaveTypeList();
        };
        $scope.approveRejectLeaves = function(status) {
            $scope.model.status = status;
            angular.copy($scope.model.selectedEmployees, []);
            $scope.model.selectedEmployees = getSelectedEmployeesForApproveReject($scope.model.list);
            toggleModal('approve-reject', true);
        };        
        $scope.renderRequestStatus = function() {
            return $scope.model.status == $scope.model.possibility.approved  
                ? 'Approve' : 'Reject';
        };
        var sendRequestCallback = function() {
            $scope.model.isChecked = false;
            if ($scope.model.individualRequests.status) {
                $scope.model.individualRequests.isChecked = false;
                angular.forEach($scope.model.individualRequests.filteredItems, function (value, key) {
                    value.isChecked = true;
                });
                getIndividualRequests();
                $scope.closeModal('comment');
                $scope.model.comment.text = null;
            } else {
                getEmployeeLeaveList();
                toggleModal('approve-reject', false);
            }            
        };
        $scope.sendRequest = function() {
            var url = empLeaveDetailService.getUrl(isSectionMyTeam() ? 'approveReject' : 'approveRejectAdmin'),
                payload = empLeaveDetailService.buildBulkRequestPayload($scope.model);

            if(!payload.length) {
                return false;
            }
            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, "approveReject");
                });
        };
        var creditDebitSuccessCallback = function() {
            $scope.model.isChecked = false;
            getEmployeeLeaveList();
            toggleModal('credit-debit', false);
        };
        var successCallback = function(data, section) {
            utilityService.resetAPIError(false, null, section);
            utilityService.showSimpleToast(data.message);
            section == "creditDebit" ? creditDebitSuccessCallback() : sendRequestCallback();
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {                
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });                               
            }
        };        
        var successErrorCallback = function (data, section) {
            data.status === "success" ? 
                successCallback(data, section) : errorCallback(data, section);
        }; 
        $scope.updateLeaves = function() {
            var url = empLeaveDetailService.getUrl(isSectionMyTeam() ? 'creditDebit' : 'creditDebitAdmin'),
                payload = empLeaveDetailService.buildCreditDebitPayload($scope.model);
            
             serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, "creditDebit");
                });
        };
        $scope.toggleComment = function() {
            return $scope.model.comment.visible = $scope.model.comment.visible 
                ? false : true;
        };
        $scope.employeeCount = function(list) {
            var count = 0;
            angular.forEach(list, function(value, key) {
                if(value.isChecked) {
                    count++;
                }
            });
            return count;
        };
        $scope.requestCount = function(list) {
            var count = 0;
            angular.forEach(list, function(value, key) {
                if(value.isChecked && utilityService.getInnerValue(value, 'leave_data', 'pending_leave')) {
                    angular.forEach(value.leave_details, function(v, k) {
                        if(v.isChecked) {
                            count++;
                        }
                    });
                }
            });
            return count;
        };
        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };
        $scope.viewTimeOffDetails = function(item, tabIndex) {
            var url = '/dashboard/profile/' + item._id,
                searchParams = {
                    tabIndex: angular.isDefined(tabIndex) ? tabIndex : 0
                };

            if ($scope.section.dashboard.team) {
                searchParams.source = 'team';
            }

            $location.url(url).search(searchParams);
        };
        $scope.individualCreditDebitLeaves = function(item,form) {
            utilityService.resetForm(form);
            item.isChecked = true;
            $scope.model.selectedEmployees = [];          
            $scope.model.selectedEmployees.push(item);
            $scope.model.creditDebit.leaveType = null;
            getLeaveTypeList(item._id);            
        };
        var getIndividualEmployeeSelected = function(list, empId, requestId) {
            var checkedList = [];
            angular.forEach(list, function(value, key) {
                //if(value._id == empId && value.pending) {
                if(value._id == empId && utilityService.getInnerValue(value, 'leave_data', 'pending_leave')) {
                    value.isChecked = true;
                    angular.forEach(value.leave_details, function(v, k) {
                        v.isChecked = (v._id == requestId) ? true : false;
                        v.isDisabled = (v._id == requestId) ? false : true;
                    });
                    checkedList.push(value);
                }
            });
            return checkedList;
        };
        $scope.individualApproveReject = function(empId, requestId, status) {
            toggleModal('pending-leave', false);
            $scope.model.status = status;
            angular.copy($scope.model.selectedEmployees, []);
            $scope.model.selectedEmployees = getIndividualEmployeeSelected($scope.model.list, empId, requestId);
            toggleModal('approve-reject', true);
        };
        $scope.sendRemainder = function(master, slave) {
            var url = empLeaveDetailService.getUrl('remainder'),
                payload = empLeaveDetailService.buildRemainderPayload(master, slave);

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    utilityService.showSimpleToast(data.message);
                });
        };
        $scope.showPendingLeaves = function(item) {
            $scope.model.pending._id = item._id;
            $scope.model.pending.count = item.pending;
            $scope.model.pending.leave_details = item.leave_details;
            toggleModal('pending-leave', true);
        };   
        var toggleModal = function(id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false, 
                    show: true
                }) 
                : $('#' + id).modal('hide');
        };
        $scope.clickOutSideClose = function() {
            $("._md-select-menu-container").hide();
        };
        $scope.changeAction = function(item) {
            $scope.model.individualRequests.status = false;
            $scope.model.action.current = item;
            $scope.changeTab($scope.model.tab, 'all');
            getEmployeeLeaveList();
        };
        var hasMyTeamLeavePermission = function(permissionName) {
            var isGiven = false;

            angular.forEach($scope.model.action.list, function(value, key) {
                if(!isGiven && value.permission_slug === permissionName) {
                    isGiven = true;
                }                
            });

            return isGiven;
        };
        $scope.isActionView = function() {
            return isSectionMyTeam() ? hasMyTeamLeavePermission('can_view_my_team_leaves')
                : utilityService.getValue($scope.model.action.current, 'permission_slug') === 'can_view_requested_leaves';
        };
        $scope.isActionApproveReject = function() {
            return isSectionMyTeam() ? hasMyTeamLeavePermission('can_approve_reject_leave')
                : utilityService.getValue($scope.model.action.current, 'permission_slug') === 'can_view_approve_reject_leave';
        };
        $scope.isActionCreditDebit = function() {
            return isSectionMyTeam() ? hasMyTeamLeavePermission('can_credit_debit_leave')
                : utilityService.getValue($scope.model.action.current, 'permission_slug') === 'can_view_credit_debit_leave';
        };
        $scope.isActionApplyLeaveOnBehalf = function() {
            return isSectionMyTeam() ? hasMyTeamLeavePermission('can_apply_leave_on_behalf')
                : utilityService.getValue($scope.model.action.current, 'permission_slug') === 'can_view_apply_leave_on_behalf';
        };
        $scope.isActionBulkUpload = function() {
            return isSectionMyTeam() ? hasMyTeamLeavePermission('can_upload_leave')
                : utilityService.getValue($scope.model.action.current, 'permission_slug') === 'can_upload_leave';
        };
        var broadCastEvent = function (event, params) {
            $rootScope.$broadcast(event, {
                params: params
            });
        };
        $scope.applyLeaveOnBehalf = function(item) {
            var broadcastParams = {
                "on_behalf_emp_id": item._id
            };
            if(isSectionMyTeam()) {
               broadcastParams.relationship = $scope.relationship.primary.model._id; 
            }
            broadCastEvent('request-leave', broadcastParams);
        };
        $scope.isSectionMyTeam = function() {
            return isSectionMyTeam();
        };
        $scope.exportToCsv = function() {
            var empDetailsData = empLeaveDetailService.buildEmpDetailList($scope.model.filteredItems, $scope.model.tab);

            $timeout(function () {
                utilityService.exportToCsv(empDetailsData.content, 'employee-leave-details.csv');
            }, 1000);            
        };

        /**** Start Individual Requests Section ****/
        var getIndividualRequests = function () {
            $scope.model.individualRequests.visible = false;
            var urlPrefix = isSectionMyTeam() ? 'individualRequest' : 'individualRequestAdmin',            
                url = empLeaveDetailService.getUrl(urlPrefix) + '/' + $scope.model.leaveId;

            serverUtilityService.getWebService(url, buildGetParams())
                .then(function(data) {
                    $scope.model.individualRequests.list = utilityService.getValue(data, 'data', []);
                    $scope.model.individualRequests.visible = true;                    
                });
        };
        $scope.changeTabHandler = function (model) {
            angular.forEach(model, function(value, key) {
                model[key] = false;
            });            
            $scope.model.individualRequests.status = true;
            getIndividualRequests();
        };
        $scope.exportIndividualRequestsToCsv = function() {
            var csvData = empLeaveDetailService.buildCSVData($scope.model.individualRequests.filteredItems);

            $timeout(function () {
                utilityService.exportToCsv(csvData.content, 'individual-requests-list.csv');
            }, 1000);            
        };
        $scope.viewComment = function (text) {
            $scope.model.individualRequests.comment.text = text;
            $scope.openModal('comment', 'view-comment.tmpl.html');
        };
        $scope.approveRejectPendingRequests = function(status) {
            $scope.errorMessages = [];
            $scope.model.status = status;
            $scope.model.selectedEmployees = [];

            angular.forEach($scope.model.individualRequests.filteredItems, function (value, key) {
                if (utilityService.getValue(value, 'isChecked')) {
                    $scope.model.selectedEmployees.push(value);
                }
            });

            $scope.openModal('comment', 'approve-reject-pending-request.tmpl.html');
        };
        $scope.submitForApprovalOrRejection = function () {
            var url = empLeaveDetailService.getUrl(isSectionMyTeam() ? 'approveReject' : 'approveRejectAdmin'),
                payload = empLeaveDetailService.buildBulkApproveRejectPayload($scope.model);

            if(!payload.length) {
                return false;
            }

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, "approveReject");
                });
        };
        $scope.isDurationCustom = function() {
            return $scope.timeoff.requests.duration.slug == 'custom';
        };
        $scope.changeDateRange = function(model) {
            var dateRange = empLeaveDetailService.getDateRange(model.duration.slug);
            model.fromDate = dateRange.from;
            model.toDate = dateRange.to;
        };
        $scope.resetRequestDate = function() {
            resetFromToDate($scope.timeoff.requests);
            $scope.timeoff.requests.duration = empLeaveDetailService.buildDefaultRequestDuration();
            getIndividualRequests();
        };
        var resetFromToDate = function(model) {
            model.fromDate = null;
            model.toDate = null;
        };     
        /**** End Individual Requests Section ****/

        /********* Start Angular Modal Section *********/
        $scope.openModal = function(instance, template, size) {
            size = size || 'sm';

            $scope.modalInstance[instance] = $modal.open({
                templateUrl : template,
                scope : $scope,
                windowClass : template === 'bulk-leave.tmpl.html' ? "fadeEffect" : 'zindex',
                size: size
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }            
        };
        /********* End Angular Modal Section *********/

        /**** Start: Leave Bulk Upload  *****/
        var downloadFile = function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            link.click();
        };
        $scope.downloadLeaveApplyCsv = function () {
            serverUtilityService.postWebService(empLeaveDetailService.getUrl('downloadBulkAssignCsv'))
                .then(function (data) {
                    if(data.status === 'success'){
                        downloadFile(data.data.csv, 'bulk_apply_leave.csv')
                    }
                });
        };
        $scope.showBulkLeaveModal = function () {
            $scope.openModal('bulkLeave', 'bulk-leave.tmpl.html')
        };
        var getAlphaIndexing = function (resp) {
            $scope.errCount = 0;
            var data = [];
            angular.forEach(resp.data, function (val, key) {
                data.push(val);
                angular.forEach(val, function (v, k) {
                    if (angular.isDefined(v.error) && v.error.length) {
                        $scope.errCount += 1;
                    }
                });
            });
            $scope.totalRecords = data.length;
            $scope.alphIndex = [];
            var len = utilityService.getValue(data, 0) ? Object.keys(data[0]).length : 0;
            for (var i = 0; i < len; i++) {
                if (i > 25) {
                    $scope.alphIndex.push("A" + alphabets[(i % 25) - 1]);
                } else {
                    $scope.alphIndex.push(alphabets[i]);
                }
            }
            $scope.flag = true;
        };
        var uploadSuccessCallback = function (response) {
            getAlphaIndexing(response);
            $scope.parsedCsv = response.data;            
            if (utilityService.getValue(response,  'status') === 'success') {
                utilityService.showSimpleToast(utilityService.getValue(response, 'message'));
            } else {
                var error = typeof response.message === 'string' || response.message instanceof String;
                error ? alert(response.message) : $scope.openModal('previewBulkLeaveCSV', 'bulk-leave-preview-sheet-csv.html', 'lg');  
            }            
        };
        $scope.upload = function (file, errFiles) {
            $scope.closeModal('bulkLeave');

            if($scope.model.leaveBulkId) {
                if (file) {
                    var url = empLeaveDetailService.getUrl('bulkAssignCsv'),
                        payload = {
                            leave_csv: file
                        };

                    serverUtilityService.uploadWebService(url + '/' + $scope.model.leaveBulkId, payload)
                        .then(function(response) {
                            uploadSuccessCallback(response)
                        });
                }
            }
        };
        /**** End: Leave Bulk Upload ******/
	}
]);