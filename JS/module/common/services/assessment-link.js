app.service('AssessmentLinkService', ['utilityService',  
    function (utilityService) {
        'use strict';

        this.url = {
            download: 'recruitment-frontend/job-assessment-download',
            upload: 'recruitment-frontend/job-assessment-upload',
            validateToken: 'recruitment-frontend/job-assessment'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildLinkTokenObject = function (routeParams) {
            return {
                valid: false,
                message: false,
                visible: false,
                token: utilityService.getValue(routeParams, 'q'),
                defaultMessage: "This link has expired. Please connect with your HR team or Qandle team for more details.",
                filename: null,
                assessment_submitted: false,
                object: {
                    file: null,
                    isUploaded: false
                }
            };
        };
                               
    }
]);