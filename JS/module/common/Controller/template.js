app.controller('TemplateController', [
    '$scope', '$timeout', '$location', '$window', 'templateService', 'utilityService', 'ServerUtilityService','$routeParams',
    function ($scope, $timeout, $location, $window, templateService, utilityService, serverUtilityService,$routeParams) {
        $scope.temp_id = null;
        $scope.url = null;        
        if($scope.tmplConstant.type == 16) {
            $scope.temp_id = 16;
            $scope.url = $scope.tmplConstant.refUrl;
        }

        if($scope.tmplConstant.type === 18) {
            $scope.temp_id = 18;
            $scope.url = $scope.tmplConstant.refUrl
        }
        var modalHashMap = templateService.buildModalHashMap();       
		$scope.templateAction = templateService.buildTemplateAction();
		$scope.templateList = [];
        var syncTemplateModel = function(model) {
            $scope.template = templateService.buildTemplateModel(model, $scope.tmplConstant.type);
        };        
        var getTemplateList = function (id) {
            $scope.templateList = [];
            var url
            if(id==18)
            {
                url = templateService.getUrl('templets') + "/" + id+'?trainingTypeId='+$routeParams.lndId;
            }
            else
            {
                url = templateService.getUrl('templets') + "/" + id
            }
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.templateList = data.data; 
                });
        };
        var toggleModal = function(modal, action, flag) {
            flag ? $('#' + modalHashMap[modal][action]).appendTo("body").modal({ show: true }) 
                : $('#' + modalHashMap[modal][action]).modal('hide');
        };
        if ($scope.tmplConstant.type == 16) {
            getTemplateList(16);
        }
        if($scope.tmplConstant.type ==18)
        {
            getTemplateList(18)
        }
        $scope.$on('getId', function(event, args) {
            $scope.temp_id = args.any._id;
            $scope.url = args.any.url;
            getTemplateList(args.any._id);
        });
        var createTemplate = function() {
            var url = templateService.getUrl($scope.url)+"/"+$scope.temp_id
            var payload=null
            if($scope.tmplConstant.type==18)
            {

                payload= templateService.buildLndTemplatePayload($scope.template,$routeParams.lndId)
            }
            else
            {
                payload = templateService.buildTemplatePayload($scope.template);
            }
            
            serverUtilityService.postWebService(url, payload)
                .then(function(data){
                    successErrorCallback(data, $scope.templateList, "template", true);
                });
        };
        var updateTemplate = function() {
            var url = templateService.getUrl($scope.tmplConstant.refUrl) + "/" + $scope.template._id,
                payload = templateService.buildTemplatePayload($scope.template);

            serverUtilityService.putWebService(url, payload)
                .then(function(data){
                    successErrorCallback(data, $scope.templateList, "template", false);
                });
        };
        $scope.createUpdateTemplate = function() {
            $scope.template._id ? updateTemplate() : createTemplate();             
        };
        $scope.deleteTemplate = function(item) {
            var url = templateService.getUrl($scope.tmplConstant.refUrl) + "/" + item._id;
            serverUtilityService.deleteWebService(url)
                .then(function(data){                    
                    $scope.templateList = utilityService.deleteCallback(data, item, $scope.templateList);
                });
        };
        $scope.copyTemplate = function(item) {
            var url = templateService.getUrl('copyTemplate') + "/" + item._id;
            serverUtilityService.postWebService(url)
                .then(function(data){                    
                   successErrorCallback(data, $scope.templateList, "template", true);
                });
        };        
        $scope.previewTemplate = function (item){            
            var fileUrl =  item.file_download_url;
            var embeddedUrl = "//docs.google.com/gview?url=" + fileUrl + "&embedded=true";
            $window.open(embeddedUrl);
        };
        $scope.handleTemplateAction = function(action, item, model, form) {
            utilityService.resetForm(form);
            model = angular.isDefined(model) && model ? model : {};
            angular.forEach($scope.templateAction, function(value, key){
                $scope.templateAction[key] = false;
            });
            $scope.templateAction[action] = true;    
            model.certificate_id = utilityService.getValue(item, '_id');
            syncTemplateModel(model);
            $scope.template.title = null;
            toggleModal('builder', 'add_edit_template', true);              
        };
        $scope.editTemplate = function(item) {
            $location.url('template-builder').search({
                template: item._id, 
                refUrl: $scope.tmplConstant.refUrl,
                edit: true,
                module: $scope.tmplConstant.module,
                template_type: $scope.temp_id,
                moduleName: $scope.tmplConstant.moduleName ? $scope.tmplConstant.moduleName : null,
                lndId:$routeParams.lndId || null
            });
        };
        $scope.changeStatus = function(item) {
            var url = templateService.getUrl('changeStatus') + "/" + item._id;

            serverUtilityService.patchWebService(url)
                .then(function(data) {
                    getTemplateList($scope.temp_id);
                });
        };
        $scope.resetPopups = function () {
            $(".modal-backdrop").hide();
            $('#add-edit-template').appendTo("body").remove();
        };
        var successCallback = function(data, list, section, isAdded) {
            utilityService.resetAPIError(false, null, section);
            $timeout(function (){            
                  $scope.resetPopups();
            },1000);
            if (angular.isDefined(data.data)) {
                $location.url('template-builder').search({
                    template: data.data._id, 
                    refUrl: $scope.tmplConstant.refUrl,
                    module: $scope.tmplConstant.module,
                    template_type: $scope.temp_id ,
                    moduleName: $scope.tmplConstant.moduleName ? $scope.tmplConstant.moduleName : null,
                    lndId:$routeParams.lndId || null
                });   
            }
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
        var successErrorCallback = function (data, list, section, isAdded) {
            data.status === "success" ? 
                successCallback(data, list, section, isAdded) : errorCallback(data, section);
        };       
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        $(document).ready(function() {
            $timeout(function() {
                $('.popoverOption').popover({ trigger: "hover" });
            }, 1000);
        });
        
    }
]);