app.controller('JobCommonController', [
    '$scope', '$routeParams', '$modal', '$location', '$timeout', 'utilityService', 'JobCommonService', 'ServerUtilityService', 'RecruitmentAdminService',
    function ($scope, $routeParams, $modal, $location, $timeout, utilityService, JobCommonService, serverUtilityService, RecruitmentAdminService) {
        var self = this;
        self.value = {};

        $scope.jobsObject = {
            isAllJobs: true,
            isJobDescription: false,
            isJobApply: false,
            isRefer: false,
            allJobsList: [],
            errorMessages: [],
            filterList: [],
            jobDetails: null,
            selectedJob: null,
            applyForm: null,
            parsedData: null,
            dummyItem: {},
            accessToken: utilityService.getStorageValue('accessToken'),
            employmentype: JobCommonService.buildEmploymentype(),
            pattern: {
                email: /^[a-zA-Z0-9-]+[a-zA-Z0-9._-]+@[a-zA-Z-]+\.[a-zA-Z.-]{2,20}$/,
                alphaNumeric: /^[0-9a-zA-Z \b]+$/
            },
            isDepartment: false
        };
        $scope.defaultJobObject = JobCommonService.buildDefaultJobObject();
        $scope.jobId = utilityService.getValue($routeParams, 'jobId');
        $scope.is_external = utilityService.getValue($routeParams, 'is_external');
        $scope.is_myReferral = utilityService.getValue($routeParams, 'my_refer');
        $scope.apply_now = utilityService.getValue($routeParams, 'apply_now');

        var extractItemObject = function () {
            var item = null;
            angular.forEach($scope.jobsObject.allJobsList, function (value, key) {
                if ($scope.jobId == value._id) {
                    item = value;
                }
            });
            if (item) {
                $scope.viewDetails(item, function() {
                    if($scope.apply_now) {
                        $scope.jobsObject.isJobDescription = false;
                        $scope.applyJob(false);
                    } else {
                        $scope.jobsObject.isJobDescription = true;
                    }
                });
            }
        };

        var setJobListView = function(selectedJob) {
            $scope.viewJobList.visible = true;
            $scope.setBannerTitle(selectedJob);
        };
        var resetJobListView = function() {
            $scope.viewJobList.visible = false;
            $scope.setBannerTitle();
        };

        var getAllJobs = function () {
            var url = $scope.jobsObject.accessToken 
                ? JobCommonService.getUrl('ijpJob') : JobCommonService.getUrl('allJobs');
            console.log($scope.jobId)
            if($scope.jobId != undefined && $scope.jobId != null) {
                url = url + "/" + $scope.jobId;
            }

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    //data.data = JobCommonService.buildSampleJobResponse();
                    $scope.jobsObject.isDepartment = JobCommonService.isJobListHavingDepartment(utilityService.getValue(data, 'data', []));
                    $scope.jobsObject.allJobsList = data.data;
                    if ($scope.jobId) {
                        extractItemObject();
                    }
                });
        };
        getAllJobs();
        var getJobDetails = function (item) {
            if($scope.is_external) {
                var url = JobCommonService.getUrl('jobDetails') + '/' + item._id + "?is_my_referral_request=" + true + '&requested_by=1';
            } else {
                url = JobCommonService.getUrl('jobDetails') + '/' + item._id;
            }            
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.jobsObject.jobDetails = data.data;
                    $scope.jobsObject.selectedJob = data.data.head;
                    setJobListView(data.data);
                });
        };
        var segmentFiledSyncRapper = function (v, k, job_details) {
            var def = "1970-01-01";
            if ((v.format_type == 1 || v.field_type == 10 || v.field_type == 12) && v.value) {
                v.value = v.value.toString();
            } else if (v.field_type == 5 && v.value != "") {
                v.value = utilityService.getDefaultDate(v.value);
            } else if (v.field_type == 13) {
                if (angular.isDefined(v.validator) && v.validator.is_multi_select == '1') {
                    self.value[v.slug] = [];
                    angular.forEach(self.allEmployees, function (val, ke) {
                        angular.forEach(v.value, function (id, index) {
                            if (id == val.id) {
                                self.value[v.slug].push(val);
                            }
                        });
                    });
                } else if (angular.isDefined(v.validator) && v.validator.is_multi_select == '0') {
                    angular.forEach(self.allEmployees, function (val, ke) {
                        if (v.value[0] == val.id) {
                            val.full_name = val.name;
                            val._id = val.id;
                            v.value = val;
                        }
                    });
                    if (!v.value.length && !angular.isObject(v.value)) {
                        v.value = null;
                        self[v.slug] = '';
                    }
                }
            } else if (v.field_type == 6) {
                v.value = new Date(def + " " + v.value);
            } else if (v.field_type == 11) {
                if (angular.isArray(v.value)) {
                    angular.forEach(v.element_details, function (v11, k11) {
                        v11.isChecked = v.value.indexOf(v11._id) == -1 ? false : true;
                    });
                }
            }
            if (!$scope.jobsObject.isRefer && job_details.internal_job_post && (v.slug == 'full_name' || v.slug == 'email')) {
                v.value = job_details[v.slug];
            }
        };
        var getApplyForm = function (item) {
            var tempUrl = $scope.jobsObject.accessToken 
                ? JobCommonService.getUrl('ijpJob') : JobCommonService.getUrl('allJobs'),
                url = tempUrl + '/' + $scope.jobsObject.selectedJob._id+($scope.is_external?('?can_refer='+$scope.jobsObject.isRefer):'');

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    angular.forEach(data.data.application_field, function (v, k) {
                        segmentFiledSyncRapper(v, k, data.data.job_details);
                    });
                    $scope.jobsObject.applyForm = data.data;
                });
        };
        $scope.attachFile = function (file, item) {
            if (file) {
                var isError = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
                if (isError) {
                    item.error = isError ? "File size must be less than or equal to " + $scope.allowedFileSizeGlobal.text : null;
                    item.value = null;
                } else {
                    if(localStorage.getItem('accessToken')){
                        parseCv(file)
                    }else{
                        parseCvOpen(file)
                    }
                    item.value = file;
                    item.error = null;                    
                }
                item.isUploaded = true;
            } else {
                item.error = null;
                item.value = null;
            }
        };
        $scope.removeAttachment = function (item) {
            item.isUploaded = false;
            item.value = null;
        };

        var parseCvOpen = function (file) {
            $scope.loader = true
            var url = JobCommonService.getUrl('cvParserOpen');
            var payload = {
                cv: file
            }
            serverUtilityService.uploadWebService(url, payload).then(function(data) {
                if (data.status == 'success') {
                    $scope.jobsObject.parsedData = data.data.parsed_data;
                    console.log(data)
                    angular.forEach($scope.jobsObject.applyForm.application_field, function(val){
                        if(val.slug === 'full_name') {
                            val.value = data.data.full_name
                        }
                        if(val.slug === 'email') {
                            val.value = data.data.email
                        }
                        if(val.slug === 'phone') {
                            val.value = data.data.phone
                        }
                        if(val.slug === 'keywords_skill') {
                            val.value = data.data.keywords_skill.join(', ')
                        }
                        if(val.slug === 'previous_organization_s') {
                            val.value = data.data.previous_organization_s.join(', ')
                        }
                        if(val.slug === 'degree_s') {
                            val.value = data.data.degree_s.join(', ')
                        }
                        if(val.slug === 'education') {
                            val.value = data.data.education.join(', ')
                        }
                        if(data.data.success_rate){
                            $scope.weightage = data.data.success_rate
                        }
                    })

                } else {
                    console.log(data.message);
                }
            }).finally(function() {
                $scope.loader = false
            });
        }

        var parseCv = function (file) {
            $scope.loader = true
            var url = RecruitmentAdminService.getUrl('cvParser');
            var payload = {
                cv: file
            }
            serverUtilityService.uploadWebService(url, payload).then(function(data) {
                if (data.status == 'success') {
                    $scope.jobsObject.parsedData = data.data.parsed_data;
                    console.log(data)
                    angular.forEach($scope.jobsObject.applyForm.application_field, function(val){
                        if(val.slug === 'full_name') {
                            val.value = data.data.full_name
                        }
                        if(val.slug === 'email') {
                            val.value = data.data.email
                        }
                        if(val.slug === 'phone') {
                            val.value = data.data.phone
                        }
                        if(val.slug === 'keywords_skill') {
                            val.value = data.data.keywords_skill.join(', ')
                        }
                        if(val.slug === 'previous_organization_s') {
                            val.value = data.data.previous_organization_s.join(', ')
                        }
                        if(val.slug === 'degree_s') {
                            val.value = data.data.degree_s.join(', ')
                        }
                        if(val.slug === 'education') {
                            val.value = data.data.education.join(', ')
                        }
                        if(data.data.success_rate){
                            $scope.weightage = data.data.success_rate
                        }
                    })

                } else {
                    console.log(data.message);
                }
            }).finally(function() {
                $scope.loader = false
            });
        }

        $scope.applyNewJob = function () {
            $scope.jobsObject.errorMessages = [];
            if (utilityService.getStorageValue('loginEmpId')) {
                var url = JobCommonService.getUrl('applyJobLoginEmp') + '/' + $scope.jobsObject.selectedJob._id;
            } else {
                var url = JobCommonService.getUrl('applyJob') + '/' + $scope.jobsObject.selectedJob._id;
            }

            var payload = JobCommonService.buildApplyJobPayload($scope.jobsObject.applyForm.application_field, self);
            payload['g-recaptcha-response'] = '6Lf8TFAUAAAAAJ0e5hCYlYidLxqnxvDiLDuBP3eJ';
            payload['is_refer'] = $scope.jobsObject.isRefer;
            payload.parsed_data = $scope.jobsObject.parsedData;
            if ($scope.jobsObject.isRefer) {
                payload['refer_by'] = utilityService.getStorageValue('loginEmpId');
            } else if (!$scope.jobsObject.isRefer && $scope.jobsObject.accessToken) {
                payload['applied_for'] = utilityService.getStorageValue('loginEmpId');
            }
            serverUtilityService.uploadWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        $scope.goTojobs();
                    } else {
                        if (data.status == 'error') {
                            $scope.jobsObject.errorMessages.push(data.message);
                        } else {
                            angular.forEach(data.data.message, function (v, k) {
                                $scope.jobsObject.errorMessages.push(v[0]);
                            });
                        }
                    }
                });
        };
        var getJobDetailByExternal = function () {
            var routeFlags = {
                _id: $scope.jobId
            };
            getJobDetails(routeFlags);
            $scope.jobsObject.errorMessages = [];
            $scope.jobsObject.isJobApply = false;
            $scope.jobsObject.isAllJobs = false;
            $scope.jobsObject.isJobDescription = true;
        };
        if ($routeParams.page == 'external') {
            getJobDetailByExternal();
        }
        $scope.viewDetails = function (item, cb) {
            getJobDetails(item);
            $scope.jobsObject.selectedJob = item;
            $scope.jobsObject.errorMessages = [];
            $scope.jobsObject.isJobApply = false;
            $scope.jobsObject.isAllJobs = false;
            $scope.jobsObject.isJobDescription = true;
            if(cb) { cb(); }
        };
        $scope.applyJob = function (isRefer) {
            $scope.jobsObject.isRefer = isRefer;
            getApplyForm();
            $scope.jobsObject.errorMessages = [];
            $scope.jobsObject.isAllJobs = false;
            $scope.jobsObject.isJobDescription = false;
            $scope.jobsObject.isJobApply = true;
        };
        $scope.goTojobs = function () {
            if($scope.is_myReferral) {
                $location.url('dashboard/recruitment?tab=2');  
            } else if ($scope.is_external) {
                $location.url('dashboard/externalRecruiter');
            } else if($scope.jobsObject.isJobApply) {
                $scope.viewDetails($scope.jobsObject.selectedJob);
            } else {
                $scope.jobsObject.selectedJob = null;
                $scope.jobsObject.errorMessages = [];
                $scope.jobsObject.isJobApply = false;
                $scope.jobsObject.isJobDescription = false;
                $scope.jobsObject.isAllJobs = true;
                resetJobListView();
            }
        };

        /*************************************/
        var excellCollection = function () {
            $scope.excelCollections = {
                selectedLocation: {},
                selectedType: {},
                locationCollection: [],
                typeCollection: [],
                departmentCollection: []
            };
        };
        excellCollection();
        $scope.includeExcelFilters = function (value, collection) {
            value = value.toLowerCase();
            var i = $.inArray(value, collection);
            (i > -1) ? collection.splice(i, 1) : collection.push(value);
        };
        $scope.orderByField = 'location';
        $scope.reverseSort = false;
        $scope.sortExcelList = function (orderByField, reverseBoolean) {
            $scope.orderByField = orderByField;
            $scope.reverseSort = reverseBoolean;
        };
        $scope.commonExcelFilter = function (key, collection, detailObject) {
            return function (object) {
                if (collection.length > 0) {
                    if (angular.isDefined(detailObject)) {
                        var value = object[detailObject][key].toLowerCase();
                        if ($.inArray(value, collection) < 0)
                            return;
                    } else {
                        var value = object[key].toLowerCase();
                        if ($.inArray(value, collection) < 0)
                            return;
                    }
                }
                return object;
            }
        };
        $scope.resetSortForCollection = function (type) {
            switch (type) {
                case 'location':
                    $scope.excelCollections.locationCollection = [],
                    $scope.excelCollections.selectedLocation = [];
                    break;
                
                case 'employment_type':
                    $scope.excelCollections.typeCollection = [],
                    $scope.excelCollections.selectedType = {};
                    break;

                case 'department':
                    $scope.excelCollections.departmentCollection = [],
                    $scope.excelCollections.selectedDepartment = [];
                    break;
                    
                default:
                    excellCollection();
            }
        };
        $scope.parshResume = function () {
            $scope.openModal('assignOfferLetter', 'parseResume');
        };
        $scope.applyJobPopup = function () {
            $scope.defaultJobObject = JobCommonService.buildDefaultJobObject($scope.defaultJobObject.id);
            $scope.jobsObject.errorMessages = [];
            $scope.openModal('assignOfferLetter', 'applyhere');
        };
        $scope.openModal = function (instance, templateUrl) {
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                // backdrop: 'static',
                windowClass: 'fadeEffect'
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };

        var getDefaultJob = function() {
            if($scope.jobsObject.accessToken) {
                $scope.defaultJobObject.id = null;
            } else {
                serverUtilityService.getWebService(JobCommonService.getUrl('defaultJob')).then(function(data) {
                    $scope.defaultJobObject.id = utilityService.getInnerValue(data, 'data', '_id');
                });
            }
        };
        getDefaultJob();
        
        $scope.defaultJobAttachFile = function (file) {
            if (file) {
                var isError = utilityService.validateFileSize(file, $scope.allowedFileSizeGlobal);
                if (isError) {
                    $scope.defaultJobObject.file.error = isError ? "File size must be less than or equal to " + $scope.allowedFileSizeGlobal.text : null;
                    $scope.defaultJobObject.file.value = null;
                } else {
                    $scope.defaultJobObject.file.value = file;
                    $scope.defaultJobObject.file.error = null;
                }
            } else {
                $scope.defaultJobObject.file.error = 'Attach your Resume in proper Format';
                $scope.defaultJobObject.file.value = null;
            }
        };
        $scope.applyJobNow = function () {
            var url = JobCommonService.getUrl('applyJob') + '/' + $scope.defaultJobObject.id;
            var payload = JobCommonService.buildDefaultJobapllyPayload($scope.defaultJobObject);
            serverUtilityService.uploadWebService(url, payload).then(function (data) {
                if (data.status == 'success') {
                    $scope.closeModal('assignOfferLetter');
                    utilityService.showSimpleToast(data.message);
                    $scope.defaultJobObject = JobCommonService.buildDefaultJobObject($scope.defaultJobObject.id);
                    $scope.goTojobs();
                } else {
                    if (data.status == 'error') {
                        $scope.jobsObject.errorMessages.push(data.message);
                    } else {
                        angular.forEach(data.data.message, function (v, k) {
                            $scope.jobsObject.errorMessages.push(v[0]);
                        });
                    }
                }
            });
        };
        $scope.exportAllJobsToCsv = function() {
            var filteredList = utilityService.getValue($scope.jobsObject, 'filterList', []),
                isDepartment = utilityService.getValue($scope.jobsObject, 'isDepartment', false),
                csvData = JobCommonService.buildJobsCsvData(filteredList, isDepartment);
                filename = 'jobs.csv';
            
            $timeout(function () {
                utilityService.exportToCsv(csvData.content, filename);
            }, 200);            
        };
    }
]);