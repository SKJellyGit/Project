 app.controller('FnFCertificateController', [
    '$scope', '$modal','$routeParams', '$location', '$timeout', '$window', '$route', 'PayrollOverviewService', 'utilityService', 'ServerUtilityService', 'TimeOffService', 'FnFCertificateService', '$filter', '$routeParams', '$rootScope', '$q',
    function ($scope, $modal, $routeParams, $location, $timeout, $window, $route, PayrollOverviewService, utilityService, serverUtilityService, timeOffService, FnFCertificateService, $filter, $routeParams, $rootScope, $q) {
        $scope.fnfCertificateDetails = [];
        var extractUploadedFile = function(item, type){
            var obj = {flag: false, file: null}
            if(item.certificate && item.certificate.length){
               var file = item.certificate.find(function(file){
                      return file.certificate_type == type;
               });
               if(file){
                 obj.flag = true;
                 obj.file = file;
               }
            }
            return obj;
        }
        var fnfCertificateDetailsCallback = function (data, flag) {
            angular.forEach(data, function (v, k) {
                v.full_name = utilityService.getInnerValue(v, 'employee_preview', 'full_name');
                v.employee_id = v.employee_preview.personal_profile_employee_code;                
                v.employee_status = v.employee_preview.relieving_date;  
                v.certificate_type = 1; 
                v.fnfCertificateType = {
                    1: {name: "FNF CERTIFICATE TYPE", isFileUploded: extractUploadedFile(v, 1).flag , type: 1, file: extractUploadedFile(v, 1).file},
                    2: {name: "FNF 12 CERTIFICATE TYPE", isFileUploded: extractUploadedFile(v, 2).flag, type: 2, file: extractUploadedFile(v, 2).file},
                    3: {name: "FN TAX COMPUTATION CERTIFICATE TYPE", isFileUploded: extractUploadedFile(v, 3).flag, type: 3, file: extractUploadedFile(v, 3).file},
                }              
                //$scope.calculateFacadeCountOfAllFilters(data.data, allFilterObject, v);
            });
        };

        var getfnfCertificateDetails = function () {
            var url = FnFCertificateService.getUrl('fnf_listing');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    fnfCertificateDetailsCallback(data.data, true);
                    $scope.fnfCertificateDetails = data.data;
                });
        };
        getfnfCertificateDetails();

        $scope.remove = function(item){
            item.isFileUploded = false;
            item.file = null;
        };

        $scope.uploadCertificateDetails = function(file, cType, item) {
         cType.file = file; 
        if(file) { 
            cType.isFileUploded = true;
            var rowId = angular.isObject(item._id) ? item._id.$id : item._id ;  
            var url = FnFCertificateService.getUrl('fnf_upload_certificate') + "/" + rowId,
                payload = {
                    emp_id: item.employee_preview._id,
                    certificate_type: item.certificate_type,
                    files: file
                };

            serverUtilityService.uploadWebService(url, payload)
                .then(function (data) {
                     if(data.status == 'success'){
                            utilityService.showSimpleToast(data.message);
                        }else{
                            $scope.error = data.message ? data.message : 'Something went wrong.';
                            alert(data.message);
                        }  
                });
            }
        };
        $scope.downloadFnfCertificate = function(cType,item) {   
            var fnfInitiateId = angular.isObject(item._id) ? item._id.$id : item._id;
            var url = FnFCertificateService.getUrl('download_fnf_certificate')+ "/" + fnfInitiateId + "/" + cType.type;
            $scope.viewDownloadFileUsingForm(url);
        };

	}
]);