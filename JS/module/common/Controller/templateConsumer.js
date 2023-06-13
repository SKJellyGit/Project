app.controller('TemplateConsumerController', [
    '$scope', '$routeParams', '$q', '$sce', '$timeout', '$modal', '$location', 'templateBuilderService', 'utilityService', 'ServerUtilityService', '$window',
    function ($scope, $routeParams, $q, $sce, $timeout, $modal, $location, templateBuilderService, utilityService, serverUtilityService, $window) {
        $scope.template = null;
        $scope.referenceList = [];
        $scope.isVisible = true;
        $scope.isPreviewed = false;
        $scope.isLoaded = false;
        $scope.isUploaded = false;
        $scope.groupList = [];
        $scope.is_upload_to_drive = false;
        $scope.isUploadedDrive= function(){
            $scope.is_upload_to_drive = (!$scope.is_upload_to_drive)? true:false
            console.log($scope.is_upload_to_drive)
        }
        $scope.consumer = {
            trigger_date: null,
            today: new Date(new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate() + 1)
        };
        $scope.candidateId = utilityService.getStorageValue("candidateId") ? utilityService.getStorageValue("candidateId") : null;
        $scope.module = {
            refUrl: utilityService.getValue($routeParams, "refUrl"),
            template: utilityService.getValue($routeParams, "template"),
            empId: utilityService.getValue($routeParams, "empId"),
            isExit: angular.isDefined($routeParams.isExit) && $routeParams.isExit!='false' ? $routeParams.isExit : false,
            exitId: angular.isDefined($routeParams.exitId) ? $routeParams.exitId : null,
            isRevoke: angular.isDefined($routeParams.isRevoke) ? $routeParams.isRevoke : false,
            type: angular.isDefined($routeParams.type) ? $routeParams.type : 1
        };
        $scope.offerLetter = {
            file: null,
            error: null
        };
        var reBuildCandidateObject = function () {
            angular.forEach($scope.model, function (value, key) {
                $scope.model[key] = value ? value : '';
            });
        };
        var buildCandidateObject = function (list) {
            var model = {};
            angular.forEach(list, function (v, k) {
                if (v != null) {
                    model[v.slug] =  v.value ? v.value : "";
                }
            });
            return model;
        };
        var getGroupDetails = function () {
            var url = templateBuilderService.getUrl('allmandatorygroup');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.groupList = data.data;
            });
        };
        getGroupDetails();
        var getDriveCredentials = function () {
            var url = templateBuilderService.getUrl('driveCredentails');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.isDriveActive = data.data;
            });
        };
        getDriveCredentials()
        var getMandatoryGroupValue = function (id, slug) {
            var name = '';
            angular.forEach($scope.groupList, function (value, key) {
                if (value.slug == slug) {
                    angular.forEach(value.element_details, function (v, k) {
                        if (v._id == id) {
                            name = v.name;
                        }
                    });
                }
            });
            return name;
        };
        var buildReferenceList = function (data) {
            var list = [];
            angular.forEach(data, function (v, k) {
                if (v != null) {
                    var obj = {
                        id: v._id,
                        model: v.slug,
                        text: angular.isDefined(v.name) ? v.name : v.text,
                        value: v.value,
                        contact_name: angular.isDefined(v.contact_name) ? v.contact_name : [],
                        is_nodues: angular.isDefined(v.is_nodues) ? v.is_nodues : false,
                        is_custom_reference: angular.isDefined(v.is_custom_reference) ? v.is_custom_reference : false,
                        is_mandatory_group: v.is_mandatory_group,
                        field_type: angular.isDefined(v.field_type) ? v.field_type : null,
                        format_type: angular.isDefined(v.format_type) ? v.format_type : null,
                        is_editable: v.is_editable
                    };

                    list.push(obj);
                }
            });
            return list;
        };
        var getReferenceUrl = function () {
            var url;
            if ($scope.module.isExit) {
                url =  templateBuilderService.getUrl('exitCertificateRef') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId;
            } else if($scope.module.refUrl == 'recruitment') {
                url =  templateBuilderService.getUrl('recruitmentRefUrl') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId + '/' + $routeParams.jobId;
            }
            else if($scope.module.refUrl=='lnd')
            {
                url =  templateBuilderService.getUrl('lndCertificateRef') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId + '/' + $routeParams.typeId;
                
            } 
            else {
                url = templateBuilderService.getUrl('selectedReference') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId;
            }
            return url;
        };
        var getTemplateUrlUrl = function () {
            var url;
            if($scope.module.isExit){
                url =  templateBuilderService.getUrl('exitCertificate') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId;
            } else if($scope.module.refUrl == 'recruitment') {
                url =  templateBuilderService.getUrl('recruitmentTempUrl') + "/" 
                    + $scope.module.template;
                if (utilityService.getValue($routeParams, 'assignedLetter') == 'with-breakup') {
                    url = url + "/" + $scope.module.empId;
                }                
            } else if($scope.module.refUrl =='lnd'){
                url =  templateBuilderService.getUrl('lndCertificateDetail') + "/" 
                    + $scope.module.template ;//+ "/" + $scope.module.empId;
            } else{
                url = templateBuilderService.getUrl($scope.module.refUrl) + "/" + $scope.module.template + "/" + $scope.module.empId;
            }
            return url;
        };
        var referenceUrl = getReferenceUrl();
        var templateUrl = getTemplateUrlUrl();
        $q.all([
            serverUtilityService.getWebService(referenceUrl),
            serverUtilityService.getWebService(templateUrl)//,  
        ]).then(function (data) {
            //data[0] =  {"status":"success","message":"Reference detail.","data":[{"_id":"5d89f0a9ec161ce1465ce1c6","enabled":true,"module_key":"employee_exit","template_type":"7","text":"Date of Issue","value":"","is_profile":false,"slug":"custom_reference_date_of_issue","updated_at":"2019-09-24 16:02:09","created_at":"2019-09-24 16:02:09","is_editable":true,"field_type":1},{"_id":"61","name":"Employee Code","slug":"personal_profile_employee_code","segment_id":"2","field_type":2,"is_default":true,"status":true,"is_mandatory_group":false,"is_group":false,"is_mandatory":true,"can_modify":false,"can_changable":false,"is_visible":false,"public_visible":2,"is_company_wide":true,"order":8,"setup_field":true,"validator":{"is_special_chr":true},"value":"110001"},{"_id":"95","name":"Full Name","slug":"personal_profile_full_name","field_type":2,"segment_id":"1","is_default":true,"status":true,"is_mandatory_group":false,"is_group":false,"is_mandatory":false,"can_modify":false,"can_changable":false,"public_visible":1,"is_company_wide":true,"order":4,"validator":{"min_limit":1,"max_limit":"200"},"updated_at":"2020-02-04 12:44:56","value":"Rohit Jain"},{"_id":"38","name":"Location","slug":"work_profile_location","format_type":1,"segment_id":"6","is_default":true,"status":true,"is_mandatory_group":true,"is_group":true,"is_mandatory":true,"can_modify":false,"can_changable":true,"public_visible":2,"is_company_wide":true,"order":1,"setup_field":true,"element_ids":["5cd9c5e539473e4408a7f891","5cd9c5e839473ec737a7f873","5cd9c5eb39473eb727a7f87a","5cd9c5f439473ebf4fa7f864","5cd9c5f839473ead27a7f87a","5cd9c5fb39473ebc32a7f873","5e4b999b39473e3603188851","5e4b999c39473eb40118885c","5e4b999d39473ec37f18885d","5e4b999d39473e3c03188851","5e4b999e39473eb101188852","5e4b999e39473e3a0218885f","5e4b999f39473eb701188855","5e4b999f39473eb40118885d"],"value":"Bangalore"},{"_id":"42","name":"Division","slug":"work_profile_division","format_type":1,"segment_id":"6","is_default":true,"status":true,"is_mandatory_group":true,"is_group":true,"is_mandatory":true,"can_modify":true,"public_visible":2,"is_company_wide":true,"order":5,"setup_field":true,"ref_id":"41","element_ids":["5cd9c6eb39473eed53a7f862","5cd9c6f539473e7c52a7f864","5cd9c6f939473eed53a7f863","5ce94707ec161cb6728360f6","5ce9470dec161c7272836105","5ce94712ec161cb7728360f6","5ce94718ec161cb6728360f7","5ce9471eec161c9e728360fa","5ce94724ec161cb7728360f7","5ce94729ec161cb6728360f9","5ce9472fec161cb7728360f8","5ce94733ec161cb9728360fa","5ce94738ec161cbe728360f6"],"is_drafted":false,"updated_at":"2019-07-12 16:37:08","value":"Head Office"},{"_id":"1","name":"First Name","slug":"personal_profile_first_name","segment_id":"1","field_type":1,"is_default":true,"status":true,"is_mandatory_group":false,"is_group":false,"is_mandatory":true,"can_modify":false,"can_changable":false,"public_visible":2,"is_company_wide":true,"order":1,"setup_field":true,"validator":{"is_special_chr":true},"value":"Rohit"},{"_id":"5d89f1a6ec161c99465ce1c7","enabled":true,"module_key":"employee_exit","template_type":"7","text":"Last Working Date","value":"","is_profile":false,"slug":"custom_reference_last_working_date","updated_at":"2019-09-24 16:06:22","created_at":"2019-09-24 16:06:22","is_editable":true,"field_type":1},{"_id":"63","name":"Designation","slug":"work_profile_designation","format_type":1,"segment_id":"6","is_default":true,"status":true,"is_mandatory_group":true,"is_group":true,"is_mandatory":true,"can_modify":true,"public_visible":2,"is_company_wide":true,"order":7,"setup_field":true,"ref_id":"62","element_ids":["5cd9c71a39473ef053a7f862","5cd9c71f39473e1853a7f867","5cd9c73039473e7c52a7f866","5cd9c73d39473e2053a7f866","5cd9c74939473e1853a7f868","5cd9c76d39473eed53a7f864","5cd9c77739473e1f53a7f869","5cd9c78839473ee856a7f862","5cd9c79239473e7c52a7f867","5cd9c79f39473e2053a7f868","5cd9c7a939473ee556a7f863","5cd9c7ba39473ee856a7f863","5cd9c7c139473e7c52a7f868","5cd9c7cb39473ee756a7f863","5cd9c7d439473eed53a7f866","5cd9c7e839473eee53a7f86f","5cd9c7f939473ee856a7f864","5cd9c7fe39473ec527a7f883","5cd9c81339473e2053a7f86a","5cd9c83d39473e1f53a7f86d","5cd9c8bb39473eee53a7f872","5cd9c8c239473ee856a7f867","5cd9c8d139473eed53a7f86b","5cd9c8f339473e2053a7f86e","5cd9c91039473eee53a7f873","5cd9c91839473ee856a7f868","5cd9c92539473eed53a7f86c","5cd9c93439473e2053a7f86f","5cd9c93a39473e1853a7f86f","5cd9c94639473e795da7f863","5cd9c95439473ee556a7f86a","5cd9c95939473e795da7f864","5cd9c96439473e955ea7f862","5cd9c96939473e985ea7f863","5cd9c97a39473e955ea7f863","5cd9c98a39473e795da7f866","5cd9c99339473eee53a7f874","5cd9c9a139473ec527a7f88b","5cd9c9ac39473e945ea7f864","5cd9c9b839473eee53a7f875","5cd9c9c339473e1f53a7f873","5cd9c9d139473ec527a7f88c","5cd9c9dd39473e985ea7f866","5cd9c9e839473e2053a7f872","5cd9c9ee39473e795da7f868","5cdd05cdec161c0e2953f60b","5d50417dec161cdc5acd954c","5d50432fec161c115bcd954c","5d504393ec161c155bcd954e","5d5043ecec161c245bcd9549","5d50440eec161cf95acd956e","5d50441fec161c125bcd9552","5d50444fec161c335bcd954b","5d50450aec161c3f5bcd954e","5d504531ec161c255bcd9559","5d504587ec161ce05bcd954b","5d5182d4ec161cbf3a2f5f4e","5d6f621cec161c093041c676","5d6f6232ec161c3c3041c671","5d6f6248ec161c1f3041c671","5d6f62b9ec161c793041c66f","5d6f62c2ec161c823041c66f","5d6f62caec161c763041c674","5d6f62d8ec161c873041c670","5d6f633cec161c5a3041c678","5d6f65b1ec161c303241c675","5d726213ec161c3c6e6fbe39","5d763f3fec161c5841f3320b","5d763fb2ec161cb241f3320a","5d763fd5ec161cb141f3320c","5d7641fcec161cce43f3320b","5d7642cbec161c2844f3320b","5d91db0dec161c54434f4c1c","5d93404aec161c9f02ffb056","5dca551dec161c175f134250","5dca5528ec161c205f134250","5dd67095ec161cef7076f714","5ddf834dec161c92106165a7","5de4eac2ec161c8b2f7b23d0","5deddb74ec161cf1369fee9a","5df351f9ec161ced5d31de39","5df49b5bec161c766d68aebc","5e00a840ec161cc33c1902e8","5e07018cec161c0960a35279","5e0850d2ec161c734e34ffb3","5e09c718ec161cbf58a35241","5e0d92e2ec161c341ab1c66a","5e4b932f39473e946c188851","5e4b932f39473e606a188854","5e4b933039473e1d6c188851","5e4b933039473e4c66188857","5e4b933139473e116c188851","5e4b933239473e696a188857","5e4b933239473e606a188855","5e4b933339473e1b6c188851","5e4b933339473e116c188852","5e4b933439473e606a188856","5e4b933439473e4c66188858","5e4b933539473e1d6c188852","5e4b933539473e696a188858","5e4b933639473e116c188853","5e4b933639473e606a188857","5e4b933739473e1b6c188852","5e4b933739473e1d6c188853","5e4b933839473e186c188851","5e4b933939473e696a188859","5e4b933939473e116c188854","5e4b933a39473e1b6c188853","5e4b933a39473e946c188852","5e4b933b39473e606a188858"],"is_drafted":false,"updated_at":"2019-07-12 16:37:08","value":"Core Team Member"},{"_id":"39","name":"Joining Date","slug":"work_profile_joining_date","field_type":5,"segment_id":"6","is_default":true,"status":true,"is_mandatory_group":false,"is_group":false,"is_mandatory":true,"can_modify":false,"can_changable":false,"public_visible":2,"is_company_wide":true,"order":8,"updated_at":"2019-07-12 16:37:08","value":"01\/03\/2017"}]};
            $scope.model = buildCandidateObject(data[0].data);
            $scope.template = data[1].data;
            console.log($scope.template);
            var fileUrl = angular.isDefined(data[1].data.certificate_file_download_url) 
                ? data[1].data.certificate_file_download_url : data[1].data.file_download_url;
            var embeddedUrl = "//docs.google.com/gview?embedded=true&url=" + fileUrl;
            $scope.template.fileUrl = fileUrl;
            $scope.template.finalFileUrl =  $sce.trustAsResourceUrl(embeddedUrl);
            $scope.referenceList = buildReferenceList(data[0].data);
            reBuildCandidateObject(data[0].data, data[1].data);
            $timeout(function(){
                $scope.isVisible = true;
                $scope.isLoaded = true;
            }, 200);
        });
        $scope.renderAsHtml = function (content) {
            return $sce.trustAsHtml(content);
        };
        $scope.errorMessages = [];
        $scope.sendOffer = function (is_previewed, trigger_now) {
            is_previewed = is_previewed ? is_previewed : false;
            trigger_now = trigger_now ? trigger_now : false;
            $scope.isLoaded = false;
            $scope.errorMessages = [];
            var refValues = {};
            var url , payload = {};
            if($scope.module.refUrl == 'recruitment') {
                url =  templateBuilderService.getUrl('assignRecruitmentLetter') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId;
            }
            else if($scope.module.refUrl=='lnd')
            {
                url =  templateBuilderService.getUrl('assignLndCertificate') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId+"/"+$routeParams.typeId
            } 
            else {
                url =  templateBuilderService.getUrl('elcmTrigger') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId;
            }
            angular.forEach($scope.referenceList, function (v, k) {
                if(utilityService.getValue(refValues,utilityService.getValue(v,'model'))) {
                    console.log('duplicate key');
                } else {
                    refValues[v.model] = v.val ? v.val : v.value ? v.value : '';
                }
            });
            if (is_previewed) {
                payload.is_previewed = true;
            } else {
                payload.is_viewed = true;
            }
            payload.trigger_now = trigger_now;
            if (!trigger_now) {
                payload.trigger_date = utilityService.dateToString($scope.consumer.trigger_date);
            }
            payload.reference_values = refValues;
            if (utilityService.getValue($routeParams, 'assignedLetter')) {
                payload.isSalaryBreakp = utilityService.getValue($routeParams, 'assignedLetter') === 'with-breakup';
            }
            payload.is_upload_to_drive= $scope.is_upload_to_drive;
            // LND specific change
                // if($scope.module.refUrl=='lnd' && !$scope.module.signature_mandatory)
                // {
                //     payload.is_previewed = false;
                //     payload.is_viewed = true;
                // }
                // else if($scope.module.refUrl=='lnd' && $scope.module.signature_mandatory)
                // {
                //     payload.is_previewed = true;
                //     payload.is_viewed = false;
                // }

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (data.status == "success") {
                        $scope.closeModal();
                        if(data.data.is_viewed && data.data.is_viewed){
                            $scope.goBack();
                        }
                        $scope.isLoaded = true;
                        $scope.isPreviewed = data.data.is_previewed ? data.data.is_previewed : false;
                        if($scope.module.refUrl != 'recruitment' && $scope.module.refUrl != 'lnd') {
                            var embeddedUrl = "//docs.google.com/gview?url=" + data.data.file_download_url + '/' + utilityService.getStorageValue('accessToken') + "&embedded=true";
                            var embeddedfileUrl = data.data.file_download_url + '/' + utilityService.getStorageValue('accessToken');
                        }else {
                            var embeddedUrl = "//docs.google.com/gview?url=" + data.data.file_download_url + "&embedded=true";
                            var embeddedfileUrl = data.data.file_download_url;
                        }
                        $scope.template.fileUrl = embeddedfileUrl;
                        $scope.template.finalFileUrl =  $sce.trustAsResourceUrl(embeddedUrl);
                        utilityService.showSimpleToast(data.message);
                        if (payload.is_viewed) {
                            $scope.goBack();
                        }
                    } else if (data.status == 'error') {
                        alert(data.message);
                    } else if (data.data.status == 'error') {
                        angular.forEach(data.data.message, function (v, k) {
                            $scope.errorMessages.push(v[0]);
                        });
                    }
                });
        };
        $scope.sendOfferSaveDraft = function (is_previewed, trigger_now, save_as_draft) {
            is_previewed = is_previewed ? is_previewed : false;
            trigger_now = trigger_now ? trigger_now : false;
            save_as_draft = save_as_draft ? save_as_draft : false;
            $scope.isLoaded = false;
            $scope.errorMessages = [];
            var refValues = {};
            var url , payload = {};
            if($scope.module.refUrl == 'recruitment') {
                url =  templateBuilderService.getUrl('assignRecruitmentLetter') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId;
            }
            else if($scope.module.refUrl=='lnd')
            {
                url =  templateBuilderService.getUrl('assignLndCertificate') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId+"/"+$routeParams.typeId
            } 
            else {
                url =  templateBuilderService.getUrl('elcmTrigger') + "/" 
                    + $scope.module.template + "/" + $scope.module.empId;
            }
            angular.forEach($scope.referenceList, function (v, k) {
                if(utilityService.getValue(refValues,utilityService.getValue(v,'model'))) {
                    console.log('duplicate key');
                } else {
                    refValues[v.model] = v.val ? v.val : v.value ? v.value : '';
                }
            });
            if (is_previewed) {
                payload.is_previewed = true;
            } else {
                payload.is_previewed = false;
            }
            if(save_as_draft){
                payload.save_as_draft = false;
            }else{
                payload.save_as_draft = true;
            }
            //payload.is_previewed = is_previewed;
            //payload.save_as_draft = save_as_draft;
            payload.trigger_now = trigger_now;
            if (!trigger_now) {
                payload.trigger_date = utilityService.dateToString($scope.consumer.trigger_date);
            }
            payload.reference_values = refValues;
            if (utilityService.getValue($routeParams, 'assignedLetter')) {
                payload.isSalaryBreakp = utilityService.getValue($routeParams, 'assignedLetter') === 'with-breakup';
            }
            payload.is_upload_to_drive= $scope.is_upload_to_drive;
            // LND specific change
                // if($scope.module.refUrl=='lnd' && !$scope.module.signature_mandatory)
                // {
                //     payload.is_previewed = false;
                //     payload.is_viewed = true;
                // }
                // else if($scope.module.refUrl=='lnd' && $scope.module.signature_mandatory)
                // {
                //     payload.is_previewed = true;
                //     payload.is_viewed = false;
                // }

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (data.status == "success") {
                        $scope.closeModal();
                        if(data.data.is_viewed && data.data.is_viewed){
                            $scope.goBack();
                        }
                        $scope.isLoaded = true;
                        $scope.isPreviewed = data.data.is_previewed ? data.data.is_previewed : false;
                        if($scope.module.refUrl != 'recruitment' && $scope.module.refUrl != 'lnd') {
                            var embeddedUrl = "//docs.google.com/gview?url=" + data.data.file_download_url + '/' + utilityService.getStorageValue('accessToken') + "&embedded=true";
                            var embeddedfileUrl = data.data.file_download_url + '/' + utilityService.getStorageValue('accessToken');
                        }else {
                            var embeddedUrl = "//docs.google.com/gview?url=" + data.data.file_download_url + "&embedded=true";
                            var embeddedfileUrl = data.data.file_download_url;
                        }
                        $scope.template.fileUrl = embeddedfileUrl;
                        $scope.template.finalFileUrl =  $sce.trustAsResourceUrl(embeddedUrl);
                        utilityService.showSimpleToast(data.message);
                        if (payload.is_viewed) {
                            $scope.goBack();
                        }
                    } else if (data.status == 'error') {
                        alert(data.message);
                    } else if (data.data.status == 'error') {
                        angular.forEach(data.data.message, function (v, k) {
                            $scope.errorMessages.push(v[0]);
                        });
                    }
                });
        };
        $scope.triggerExitLetter = function (flag) {
            $scope.errorMessages = [];
            var refValues = {};
            var url = angular.isDefined(flag) && !flag 
                    ? templateBuilderService.getUrl('saveExitCer') + "/" + $scope.module.exitId + "/false" 
                    : templateBuilderService.getUrl('saveExitCer') + "/" + $scope.module.exitId,
                payload = {
                    template_id: $scope.module.template,
                };

            angular.forEach($scope.referenceList, function (v, k) {
                refValues[v.model] = v.val ? v.val : v.value;
            });
            payload.reference_values = refValues;
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (data.status == "success") {
                        var embeddedUrl = "//docs.google.com/gview?url=" + data.data.certificate_file_download_url + "&embedded=true";
                        $scope.template.finalFileUrl =  $sce.trustAsResourceUrl(embeddedUrl);
                        utilityService.showSimpleToast(data.message);
                    } else if (data.status == 'error') {
                        alert(data.message);
                    } else if (data.data.status == 'error') {
                        angular.forEach(data.data.message, function (v, k) {
                            $scope.errorMessages.push(v[0]);
                        });
                    }
                });
        };
        $scope.goBack = function () {
            if ($scope.module.isExit && (!$routeParams.isSummary || $routeParams.isSummary == "false")) {
                $location.url('frontend/exit/initiate').search({
                    id: $scope.module.exitId, 
                    isEdit: true, 
                    tab: 'certificate', 
                    isCertificate: true
                });
            } else if ($scope.module.isExit && ($routeParams.isSummary || $routeParams.isSummary == "false")) {
                $location.url('frontend/exit');
            } else if ($scope.module.refUrl == 'recruitment') {
                $location.url('dashboard/job-details').search({
                    jobId: $routeParams.jobId, 
                    stage_id: $routeParams.stage_id, 
                    substage_id: $routeParams.substage_id, 
                    tab: $routeParams.selectedTab
                });
            } 
            else if($scope.module.refUrl=='lnd')
            {
                $location.url('frontend/lnd')
            }
            else {
                $location.url('frontend/elcm');
            }
        };
        $scope.selectMultiple = function (item, val) {
            item.valArray = item.valArray ? item.valArray : [];
            var i = item.valArray.indexOf(val);
            if(i == -1){
                item.valArray.push(val);
            }else{
                item.valArray.splice(i, 1)
            }
            item.val = item.valArray.join(', ')
        };
        $scope.delteCertficate = function () {
            var url;
            if ($scope.module.refUrl == 'recruitment') {
                url = templateBuilderService.getUrl('removeRecruitmentLetter') + '/' 
                    + $scope.module.empId + "/" + $scope.module.template;
            } 
            else if($scope.module.refUrl == 'lnd')
            {
                url = templateBuilderService.getUrl('removeLndCertificate') + '/' 
                    +$scope.module.empId+"/"+$routeParams.typeId+"/"+ $scope.module.template;
            }
            else {
                url =  templateBuilderService.getUrl('elcmDeleteLetter') + '/' 
                    + $scope.module.empId + "/" + $scope.module.template;
            }
            serverUtilityService.putWebService(url)
                .then(function (data){
                    if(data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        $scope.goBack();
                    }
                });
        };        
        $scope.openModal = function() {
            $scope.modalInstance.triggerLetter = $modal.open({
                templateUrl : 'triggerLetterTmpl',
                scope : $scope,
                size: 'sm'
            });
        };
        $scope.closeModal = function() {
            if(utilityService.getValue($scope.modalInstance, 'triggerLetter')) {
                $scope.modalInstance.triggerLetter.dismiss();
            }            
        };
        $scope.attachFile = function(file, item, allowedTypes) {
            if (file) {
                var isError = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
                if (isError) {
                    item.error = isError ? "File size must be less than or equal to " + $scope.allowedFileSizeGlobal.text : null;
                    item.file = null;
                } else if(!allowedTypes.includes(file.type)) {
                    item.file = null;
                    item.error = 'File Format is incorrect';
                } else {
                    item.file = file;
                    item.error = null;
                }
            } else {
                item.error = null;
                item.file = null;
            }
        };
        $scope.removeAttachment = function(item) {
            item.error = null;
            item.file = null;
            $scope.isUploaded = false;
        };
        $scope.uploadOfferLetter = function(offerLetter) {
            var url = templateBuilderService.getUrl('recruitmentOfferLetter') + '/' + $scope.module.template + '/' + $scope.module.empId;
            var payload = {
                offer_letter_pdf: offerLetter.file
            };
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    utilityService.showSimpleToast(data.message);
                    $scope.isUploaded = true;
                });
        };

        $scope.downloadFile = function (url) {
            $window.open(url);
        };  
    }
]);
