app.controller('SignatureController', [
    '$scope', '$timeout', '$location', '$routeParams', 'signatureService', 'utilityService', 'ServerUtilityService', 'Upload',
    function ($scope, $timeout, $location, $routeParams, signatureService, utilityService, serverUtilityService, Upload) {
    
        $scope.isUploaded1 = false;
        $scope.isUploaded2 = false;
        $scope.errorMessages = [];
        $scope.file = null;  
        $scope.file2 = null;        
        $scope.fonts = signatureService.buildFontObject();
        $scope.longUrl = signatureService.getUrl('getAPISignaturesLong');
        $scope.shorlUrl = signatureService.getUrl('getAPISignaturesShort');
        $scope.apiError = utilityService.buildAPIErrorObject();        
        $scope.signatory = {fonts: $scope.fonts[1] ? $scope.fonts[1].name : null};
        $scope.select = {type:'choose'};        

        var getInitials = function (string) {
            var names = string.split(' '),
                initials = names[0].substring(0, 1).toUpperCase();
            
            if (names.length > 1) {
                initials += names[names.length - 1].substring(0, 1).toUpperCase();
            }
            return initials;
        };
        $scope.Initials = getInitials($scope.user.fullname);
        var signattureSuccessCallback = function(response) {            
            if(response.data.status === "success") {
                utilityService.showSimpleToast(response.data.message);
                utilityService.resetAPIError(false, response.data.message, 'signatureUpload');
                $scope.backTopage();
                // $scope.sideBarNavigation('dashboard/account-settings');
            } else if (response.data.status === "error") {
                utilityService.resetAPIError(true, response.data.message, 'signatureUpload');
            } 
        };        
        $scope.acceptCallback = function(imageData,initialsData){
            if(angular.isDefined(imageData) && angular.isDefined(initialsData) && !imageData.isEmpty && !initialsData.isEmpty){
                var data = {
                    signature : Upload.dataUrltoBlob(imageData.dataUrl),
                    sign_init : Upload.dataUrltoBlob(initialsData.dataUrl),
                    type: 2,
                };
                Upload.upload({
                    url: signatureService.getUrl('upload'),
                    headers: {
                        'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                    },
                    data: data
                }).then(function (response) {
                    signattureSuccessCallback(response);
                });
            } else {
                utilityService.resetAPIError(true, "Please sign Before Uploading", 'signatureUpload');
            }
        };
        var getSignatureTypesFromAPI = function() {
            var url = signatureService.getUrl('getAPISignaturesLong') + "/" +  'BillionStars_PersonalUse.ttf';
            angular.forEach($scope.fonts, function(v, k) {
                serverUtilityService.getWebService(v.longUrl).then(function(data) {
                    v.longImage = data;
                });
            });
        };
        getSignatureTypesFromAPI();
        $scope.bindFileChangeEvent = function(num){
            $timeout(function() {
                $("input[type=file]").on('change',function(){
                    if(num === 1){  
                        $scope.isUploaded1 = true;
                    } else if(num === 2){
                        $scope.isUploaded2 = true;
                    }
                });
            }, 100);
        };        
        $scope.reUpload = function(form,num){
            if(num == 1) {
                $scope.isUploaded1 = false;
                $scope.file = null; 
            } else if(num == 2) {
                $scope.isUploaded2 = false;
                $scope.file2 = null; 
            }           
        };        
        var uploadSuccessCallback = function(response) {
            if(response.data.status === "success") {
                $scope.reUpload("form",1);
                $scope.reUpload("form",2);
                utilityService.showSimpleToast(response.data.message);
                utilityService.resetAPIError(false, response.data.message, 'signatureUpload');
                //$scope.sideBarNavigation('dashboard/account-settings');
                $scope.backTopage();
            } else if (response.data.status === "error") {
                utilityService.resetAPIError(true, response.data.message, 'signatureUpload');
            }
        };
        $scope.uploadSignature = function(file,file2){
            if(angular.isDefined(file) && angular.isDefined(file2)){
                var data = {
                    signature : file,
                    sign_init : file2,
                    type: 3,
                };
                
                Upload.upload({
                    url: signatureService.getUrl('upload'),
                    headers: {
                        'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                    },
                    data: data
                }).then(function (response) {
                    uploadSuccessCallback(response);
                }, function (response) {
                    uploadErrorCallback(response);
                });
            }            
        };
        var saveFontsuccessErrorCallback = function(response){
            if(response.status === "success") {
                utilityService.showSimpleToast(response.message);
                utilityService.resetAPIError(false, response.message, 'signatureUpload');
                 $scope.backTopage();
            } else if (response.status === "error") {
                utilityService.resetAPIError(true, response.message, 'signatureUpload');
            } 
        };
        $scope.saveFontSignature = function(){
            if(angular.isDefined($scope.signatory.fonts) && $scope.signatory.fonts) {
                var payload = {font : $scope.signatory.fonts, type:1},
                    url = signatureService.getUrl('saveFont') + "/" + $scope.signatory.fonts;

                serverUtilityService.postWebService(url, payload)
                    .then(function (response) {
                       saveFontsuccessErrorCallback(response);
                    });
            }  else {
                utilityService.resetAPIError(true, "set signatory signature from fonts", 'signatureUpload');
            }
        };        
        $scope.handelUploadSignature = function(form){
           $scope.reUpload(form);
        };
        $scope.resetErrorMessages = function() {
            $scope.errorMessages = [];
            utilityService.resetAPIError(false,null,'signatureUpload');
        };
        $scope.setSelectType = function(type) {
            $scope.select.type = type;
        };
        $scope.setForm = function() {
            $scope.select.type = 'draw';
        };
        $scope.backTopage = function() {
            var url, searchObj = {};
            switch($routeParams.page) {
                case 'sign': 
                    url = 'template-sign';
                    break;

                case 'nodues': 
                    url = 'frontend/exit/nodues-manager';
                    break;

                default: 
                    url = 'dashboard/account-settings';
            }
            if ($routeParams.page == 'sign') {
                searchObj = {
                    exit_id: $routeParams.exitId,
                    certificate_template_id: $routeParams.certificateId,
                    template_id: $routeParams.template_id,
                    emp_id: $routeParams.emp_id,
                    action_id: $routeParams.action_id,
                    letter_type: $routeParams.letter_type
                };
            }
            $location.url(url).search(searchObj);
        };

    }
]);