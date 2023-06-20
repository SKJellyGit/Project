app.controller('CrowdsolveController', [
    '$scope', '$timeout', 'CrowdsolveService', 'utilityService', 'ServerUtilityService', '$modal',
    function ($scope, $timeout, CrowdsolveService, utilityService, serverUtilityService, $modal) {
        var date = new Date();
        $scope.minDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()+1);
        $scope.responce = {
            comment: null  
        };        
        $scope.crowdsolve = CrowdsolveService.buildCrowdSolveObject();
        $scope.attachedFileName = null;
        $scope.id = "_id";
        $scope.reverse = true;
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        var successCallback = function (data, list, section, isAdded, type) {
            utilityService.resetAPIError(false, null, section);
            if (angular.isDefined(data.data)) {
                $scope.closeModal('issueRequest');
                $scope.attachedFileName = null;
                utilityService.showSimpleToast(data.message);
                isAdded ? list.unshift(data.data) : utilityService.refreshList(list, data.data);
            }
        };
        var errorCallback = function (data, section) {
            if (data.status == "error") {
                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(data.message);
            } else if (data.data.status == 'error') {
                utilityService.resetAPIError(true, "something went wrong", section);
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            $scope.errorMessages.push(v);
                        });
                    });
                } else {
                    $scope.errorMessages.push(data.data.message);
                }
            }
        };
        var successErrorCallback = function (data, list, section, isAdded, type) {
            data.status === "success" ? successCallback(data, list, section, isAdded, type)
                    : errorCallback(data, section);
        };
        var sycnIssueModel = function() {
            $scope.crowdsolve.model = CrowdsolveService.buildCrowdSolveModel();
        };
        $scope.toggleModal = function (id, flag, form, type, item) {
            if(angular.isDefined(form)) {
                utilityService.resetForm(form);
            }
            $scope.attachedFileName = null;
            sycnIssueModel();
            flag ? $('#' + id).appendTo("body").modal('show') : $('#' + id).modal('hide');
            item = angular.isDefined(item) ? item : null;
            $scope.openModal('add-issue.tmpl.html', 'issueRequest');
        };
        var getIssueDetails = function () {
            serverUtilityService.getWebService(CrowdsolveService.getUrl('issue'))
                .then(function (data) {
                    $scope.crowdsolve.openProblemsCount = CrowdsolveService.buildResponseFlagObject(data.data);
                    $scope.crowdsolve.list = data.data;
                });
        };
        getIssueDetails();
        var getResponseDetails = function (issueId, item) {
            item = angular.isDefined(item) ? item : null;
            var url = CrowdsolveService.getUrl('response') + "/" + issueId;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.crowdsolve.response.list = data.data;
                    if(item) {
                        item.responseFlag = item.responseFlag ? false : true;
                        $scope.reloadEmoji();
                    }
                });
        };
        $scope.showResponseDetails = function (item) {            
            getResponseDetails(item._id, item);
        };
        $scope.getFileName = function (file) {
            $scope.attachedFileName = file.name;
        };
        $scope.bindFileChangeEvent = function () {
            $timeout(function () {
                $("input[type=file]").on('change', function () {
                    $scope.isUploaded = true;
                });
            }, 100);
        };
        $scope.resetImage = function (model) {
            model.attachment = null;
            $scope.attachedFileName = null;
        };
        $scope.addIssue = function () {
            resetErrorMessages();
            var url = CrowdsolveService.getUrl('issue'),
                payload = {
                    issue_name: $scope.crowdsolve.model.issue_name,
                    description: $scope.crowdsolve.model.description,
                    end_date: utilityService.dateToString($scope.crowdsolve.model.end_date),
                    reward: $scope.crowdsolve.model.reward,
                    attachment: $scope.crowdsolve.model.attachment
                };

            if (payload.attachment === null) {
                delete payload["attachment"];
            }
            serverUtilityService.uploadWebService(url, payload)
                .then(function (data) {
                    data.data.expireFlag = data.status === 'success' ? true : false;                             
                    successErrorCallback(data, $scope.crowdsolve.list, "social", true);
                });
        };
        $scope.deleteIssue = function (item) {
            var url = CrowdsolveService.getUrl('issue') + "/" + item._id;

            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    $scope.crowdsolve.list = utilityService.deleteCallback(data, item, $scope.crowdsolve.list);
                    $scope.crowdsolve.openProblemsCount = CrowdsolveService.buildResponseFlagObject($scope.crowdsolve.list);
                });
        };
        $scope.addResponse = function (item) {
            var payload = {
                issue_id: item._id,
                description: item.comment
            };

            serverUtilityService.postWebService(CrowdsolveService.getUrl('response'), payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.crowdsolve.response.list, "social", true, 'comment');
                    if (data.status === "success") {
                        item.comment = null;
                        $scope.reloadEmoji();
                        ++item.responseCount;
                    }
                });
        };
        $scope.inableReply = function (item){
            item.replyFlag = item.replyFlag ? false : true;
            $scope.reloadEmoji();
        };
        $scope.postReply = function (item) {
            var payload = {
                resp_id: item._id,
                description: item.comment,
            };

            item.commentFlag = true;
            serverUtilityService.postWebService(CrowdsolveService.getUrl('reply'), payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.crowdsolve.response.list, "social", false, 'comment');
                    if (data.status === "success") {
                        item.comment = null;
                        $scope.showResponseDetails(item);
                        //$scope.reloadEmoji();
                    }
                });
        };

        /********* Start Angular Modal Section *********/
        $scope.openModal = function(template, keyName) {
            $scope.modalInstance[keyName] = $modal.open({
                templateUrl : template,
                scope : $scope,
                size : 'lg',
                windowClass:'fadeEffect'
            });
        };
        $scope.closeModal = function(keyName) {
            if(utilityService.getValue($scope.modalInstance, keyName)) {
                $scope.modalInstance[keyName].dismiss();
            }             
        };
        /********* End Angular Modal Section *********/

        angular.element(document).ready(function () {
            $scope.reloadEmoji(true);
        });
    }
]);