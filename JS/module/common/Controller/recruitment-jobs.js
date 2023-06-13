app.controller('RecruitmentJobsController', [
    '$scope', '$timeout', '$routeParams', 'utilityService', 'RecruitmentJobsService', 'ServerUtilityService', '$anchorScroll', '$location', 'JobCommonService', '$modal',
    function ($scope, $timeout, $routeParams, utilityService, service, serverUtilityService, $anchorScroll, $location, JobCommonService, $modal) {
        'use strict';
        var self = this;
        $scope.errorMessages = [];
        $scope.additionalFieldSection = {
            pageVisible: false,
            pageExpire: false,
            job_id: utilityService.getValue($routeParams, 'job_id', null),
            candidate_id: utilityService.getValue($routeParams, 'candidate_id', null),
            application_fields: null,
            additional_fields: [],
            job_details: null,
            pattern: {
                email: /^[a-zA-Z0-9-]+[a-zA-Z0-9._-]+@[a-zA-Z-]+\.[a-zA-Z.-]{2,20}$/,
                alphaNumeric: /^[0-9a-zA-Z \b]+$/
            }
        };
        $scope.pages = null;
        $scope.banner = {
            content: null
        };
        $scope.viewJobList = {
            visible: false,
            no_section: false,
        };
        // $scope.socialLinks = {
        //     linkedin : $scope.envMnt === 'local' 
        //         ? 'https://in.linkedin.com/company/shadowfax' : '#/',
        //     facebook: $scope.envMnt === 'local' 
        //         ? 'https://in.linkedin.com/company/shadowfax' : '#/',
        //     twitter: $scope.envMnt === 'local' 
        //         ? 'https://in.linkedin.com/company/shadowfax' : '#/',
        //     instagram: $scope.envMnt === 'local' 
        //         ? 'https://in.linkedin.com/company/shadowfax' : '#/',
        // };

        $scope.isAdditionalFieldSectionActive = function() {
            return $scope.additionalFieldSection.job_id && $scope.additionalFieldSection.candidate_id;
        };
        $scope.setBannerTitle = function (JobDetail) {
            var iconDiv = document.getElementById('jobsIcons');
            var depIconDiv = document.getElementById('jobsIconsDep');
            if(angular.isDefined(JobDetail)) {
                $scope.banner.description = null;
                var dep = JobDetail.body.find(function(elem) { return elem.slug === 'work_profile_department';});
                $scope.banner.selectedJob = {
                    title: JobDetail.head.job_title.value,
                    location: JobDetail.head.location,
                    department: dep ? dep.value : null
                };
                if(iconDiv) {
                    iconDiv.style.visibility = 'visible';
                }
                if(depIconDiv) {
                    depIconDiv.style.visibility = dep ? 'visible' : 'hidden';
                }
            } else {
                $scope.banner.selectedJob = {
                    title: null,
                    location: null,
                    department: null
                };
                $scope.banner.description = $scope.banner.title;
                if(iconDiv) {
                    iconDiv.style.visibility = 'hidden';
                }
                if(depIconDiv) {
                    depIconDiv.style.visibility = 'hidden';
                }
            }
        };        
        var pageContentCallback = function (data) {
            var pageData = utilityService.getValue(data, 'data') ? data.data : [];
            var bannerData = pageData.find(function(elem) {
                return elem.slug === 'banner';
            });
            $scope.banner = bannerData ? bannerData : $scope.banner;
            $scope.pages = pageData;
            if(!pageData.length) {
                $scope.viewJobList.no_section = true;
            }
            $scope.setBannerTitle();
            $timeout(function () {
                service.loadTeamCarousel();
            }, 1000);
        };
        var getPageContent = function() {
            serverUtilityService.getWebService(service.getUrl('content'))
                .then(function(data){
                    pageContentCallback(data);
                });
        };
        var getyoutubeVidId = function(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
        
            if (match && match[2].length === 11) {
                return match[2];
            } else {
                return 'QELAhddrs4s';
            }
        };
        $scope.createIFrame = function(url) {
            var id = getyoutubeVidId(url);
            return '<iframe width="640" height="360" src="//www.youtube.com/embed/' + id + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
        };
        $scope.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        };
        $scope.isSection = function(section) {
            if(!angular.isArray($scope.pages) || !section) { return false; }
            if(section === 'any_section') {
                return $scope.pages.length ? true : false;
            }
            var ind = $scope.pages.findIndex(function(elem) {return elem.slug === section;});
            return (ind === -1) ? false : true;
        };
        $scope.homePageRedirect = function() {
            $location.url("dashboard/home");
        };
        $scope.goToDefaultJobs = function() {
            $scope.additionalFieldSection.job_id = null;
            $scope.additionalFieldSection.candidate_id = null;
            $location.search('job_id', null);
            $location.search('candidate_id', null);
            getPageContent();
        };
        var getAdditionalFields = function(cb) {
            var url = service.getUrl('additionalField') + '/' + $scope.additionalFieldSection.candidate_id + '/' + $scope.additionalFieldSection.job_id;
            serverUtilityService.getWebService(url)
                .then(function(data){
                    $scope.additionalFieldSection.job_details = utilityService.getInnerValue(data, 'data', 'job_details', null);
                    $scope.additionalFieldSection.application_fields = utilityService.getInnerValue(data, 'data', 'application_fields', null);
                    $scope.additionalFieldSection.additional_fields = utilityService.getInnerValue(data, 'data', 'additional_fields', []);
                    if(cb) { cb(data); }
                });
        };
        $scope.attachFile = function(file, item) {
            if (file) {
                var isError = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
                if (isError) {
                    item.error = isError ? "File size must be less than or equal to " + $scope.allowedFileSizeGlobal.text : null;
                    item.value = null;
                } else {
                    item.value = file;
                    item.error = null;
                }
            } else {
                item.error = null;
                item.value = null;
            }
        };
        $scope.removeAttachment = function(item) {
            item.error = null;
            item.value = null;
        };
        $scope.saveAdditionalField = function() {
            $scope.errorMessages = [];
            var url = service.getUrl('saveAdditionalField') + '/' + $scope.additionalFieldSection.candidate_id + '/' + $scope.additionalFieldSection.job_id;
            var payload = JobCommonService.buildApplyJobPayload($scope.additionalFieldSection.additional_fields, {value: {}});
            serverUtilityService.uploadWebService(url, payload)
                .then(function(data){
                    if (data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        $scope.openModal('successOnAdditionalFieldsSubmission', 'success-on-additional-fields-submission.tmpl.html');
                    } else {
                        if (data.status == 'error') {
                            $scope.errorMessages.push(data.message);
                        } else {
                            if(angular.isString(utilityService.getInnerValue(data, 'data', 'message'))) {
                                $scope.errorMessages.push(data.data.message);
                            } else {
                                angular.forEach(utilityService.getInnerValue(data, 'data', 'message'), function (v, k) {
                                    $scope.errorMessages.push(v[0]);
                                });
                            }
                        }
                    }
                });
        };
        $scope.closeSuccessModal = function() {
            $scope.closeModal('successOnAdditionalFieldsSubmission');
            $scope.goToDefaultJobs();
        };
        $scope.initializeAdditionalFieldSection = function() {
            $scope.additionalFieldSection.pageVisible = false;
            $scope.errorMessages = [];
            getAdditionalFields(function(data) {
                if(data.status == 'success') {
                    $scope.additionalFieldSection.pageExpire = false;
                } else {
                    if(angular.isString(data.message)) {
                        $scope.errorMessages.push(data.message);
                    } else {
                        if(angular.isString(utilityService.getInnerValue(data, 'data', 'message'))) {
                            $scope.errorMessages.push(data.data.message);
                        } else {
                            angular.forEach(utilityService.getInnerValue(data, 'data', 'message'), function (v, k) {
                                $scope.errorMessages.push(v[0]);
                            });
                        }
                    }
                    $scope.additionalFieldSection.pageExpire = true;
                }
                $scope.additionalFieldSection.pageVisible = true;
            });
        };
        $scope.initializeRecruitmentJobSection = function() {
            if($scope.isAdditionalFieldSectionActive()) {
                $scope.initializeAdditionalFieldSection();
            } else {
                $scope.goToDefaultJobs();
            }
        };
        $scope.initializeRecruitmentJobSection();
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                backdrop: 'static',
                keyboard: false,
                size: size
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };

        angular.element(document).ready(function () {
            $timeout(function(){
                $('#owl-carouselQandle').owlCarousel({
                    items:1,
                    stagePadding:50,
                    loop:true,
                    margin:10,
                    smartSpeed:450,
                });
                $('#owl-carouselQandlePartner').owlCarousel({
                    items:4,
                    loop:true,
                    autoplay:true,
                    margin:10,
                    smartSpeed:450,
                });

                $('.owl-dot').click(function () {
                    var n = $(this).index();
                    $(".owl-dot").removeClass("active");
                    $(this).addClass("active");
                    console.log(n);
                    $('#owl-carouselQandle').trigger('to.owl.carousel', n);
                });
            }, 3000);
        });
    }
]);