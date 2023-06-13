app.service('JobCommonService', ['utilityService', '$sce',
    function (utilityService, $sce) {
        'use strict';

        var selfService = this;
        this.url = {
            allJobs: 'recruitment-frontend/open-jobs',
            jobDetails: 'recruitment-frontend/job-details',
            ijpJob: 'recruitment-frontend/internal-open-jobs',
            applyJob: 'recruitment-frontend/apply-job',
            applyJobLoginEmp: 'recruitment-frontend/internal-apply-job',
            myReferral:'recruitment-frontend/my-refferals',
            defaultJob: 'recruitment-frontend/default-job',
            cvParserOpen: 'recruitment-frontend/open-parse-resume'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.formatTime = function (time) {
            if (time && angular.isDefined(time.getHours())
                && angular.isDefined(time.getMinutes())) {
                return time.getHours() + ":" + (time.getMinutes() < 10
                        ? "0" + time.getMinutes() : time.getMinutes());
            }
        };
        this.buildApplyJobPayload = function (item, self) {
            var payload = {};
            angular.forEach(item, function (v, k) {
                if (v.field_type == 13 && self && angular.isDefined(v.validator)
                        && v.validator.is_multi_select == '0' && v.value != null) {
                    payload[v.slug] = angular.isObject(v.value._id)
                            ? new Array(v.value._id.$id) : new Array(v.value._id);
                } else if (v.field_type == 13 && self && angular.isDefined(v.validator)
                        && v.validator.is_multi_select == '1') {
                    angular.forEach(self.value, function (val, ke) {
                        var values = [];
                        angular.forEach(val, function (result, index) {
                            values.push(result.id);
                        })
                        payload[ke] = values;
                    })
                } else if (v.field_type == 6) {
                    payload[v.slug] = selfService.formatTime(v.value);
                } else if (v.field_type == 5 && v.value && v.value != "NaN/NaN/NaN") {
                    payload[v.slug] = utilityService.dateFormatConvertion(v.value);
                } else if (v.format_type == 1 || v.field_type == 10 || v.field_type == 12) {
                    if (v.value != null) {
                        payload[v.slug] = v.value.toString();
                    }
                } else if (v.field_type == 11) {
                    payload[v.slug] = [];
                    angular.forEach(v.element_details, function (v11, k11) {
                        if (angular.isDefined(v11.isChecked) && v11.isChecked) {
                            payload[v.slug].push(v11._id);
                        }
                    });
                } else if (v.field_type == 3) {
                    payload[v.slug] = v.value != "" ? parseInt(v.value) : v.value;
                } else if (v.field_type == 9) {
                    payload[v.slug] = v.value ? v.value.toLowerCase() : null;
                } else {
                    payload[v.slug] = v.value;
                }
            });
            return payload;
        };        
        this.buildEmploymentype = function (){
            return[
                {
                    type:'Full Time'
                },
                {
                    type:'Part Time'
                },
                {
                    type:'Internship'
                }
            ];
        };
        this.buildDefaultJobObject = function(id) {
            return {
                id: id ? id : null,
                name: null,
                email: null,
                mobile: null,
                skill: null,
                file: {
                    value: null,
                    error: null
                }
            };
        };
        this.buildDefaultJobapllyPayload = function(model) {
            return {
                full_name: utilityService.getValue(model, 'name'),
                email: utilityService.getValue(model, 'email'),
                phone: utilityService.getValue(model, 'mobile'),
                keywords_skill: utilityService.getValue(model, 'skill'),
                cv: utilityService.getInnerValue(model, 'file', 'value'),
                is_refer: false
            };
        };
        this.isJobListHavingDepartment = function (list) {
            return utilityService.getInnerValue(list, 0, 'department');
        };
        this.buildCSVHeaderColumnHeader = function () {
            return ["Job Title", "Job Post Date", "Location"];
        };
        this.buildJobsCsvData = function(list, isDepartment) {
            var headers = this.buildCSVHeaderColumnHeader(),
                object = {
                    list: list,
                    content: new Array()
                },
                additionalHeaders = isDepartment ? ["Department", "Employment Type"] : ["Employment Type"];

            headers = headers.concat(additionalHeaders);
            object.content.push(headers);

            angular.forEach(object.list, function(value, key) {
                var array = new Array();
                
                array.push(utilityService.getInnerValue(value, 'job_title', 'value'));
                array.push(utilityService.getValue(value, 'job_post_date'));
                array.push(utilityService.getValue(value, 'location'));
                if (isDepartment) {
                    array.push(utilityService.getValue(value, 'department'));
                }
                array.push(utilityService.getValue(value, 'employment_type'));
                
                object.content.push(array);
            });

            return object;
        };
        this.buildSampleJobResponse = function () {
            return  [
                {
                    "_id": "5ea2e27b6542842466000032",
                    "job_title": {
                        "value": "React JS Develeper",
                        "visibility": true
                    },
                    "internal_job_post": true,
                    "is_refer_someone": true,
                    "job_post_date": "24-Apr-20",
                    "location": "Gurgaon",
                    "department": "Engineering",
                    "employment_type": "Full Time"
                },
                {
                    "_id": "5ea2e27b6542842466000033",
                    "job_title": {
                        "value": "Laravel PHP Developer",
                        "visibility": true
                    },
                    "internal_job_post": true,
                    "is_refer_someone": true,
                    "job_post_date": "25-Apr-20",
                    "location": "Noida",
                    "department": "Engineering",
                    "employment_type": "Full Time"
                },
                {
                    "_id": "5ea2e27b6542842466000034",
                    "job_title": {
                        "value": "FullStack Developer",
                        "visibility": true
                    },
                    "internal_job_post": true,
                    "is_refer_someone": true,
                    "job_post_date": "25-Apr-20",
                    "location": "Gurgaon",
                    "department": "Engineering",
                    "employment_type": "Full Time"
                },
                {
                    "_id": "5ea2e27b6542842466000035",
                    "job_title": {
                        "value": "Accountant",
                        "visibility": true
                    },
                    "internal_job_post": true,
                    "is_refer_someone": true,
                    "job_post_date": "21-Apr-20",
                    "location": "Gurgaon",
                    "department": "Finance",
                    "employment_type": "Full Time"
                }
            ]
        };
    }
]);