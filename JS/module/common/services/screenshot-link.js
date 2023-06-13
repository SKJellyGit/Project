app.service('ScreenshotLinkService', ['utilityService',  
    function (utilityService) {
        'use strict';

        this.url = {
            validateToken: 'timeattendance/employee/validate-screenshot-app-link', //{token}
            link: 'timeattendance/employee/screenshot-app-link' //{token}/{os_name} windows, mac, linux
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildOperatingList = function () {
            return [
                {
                    slug: 'windows',
                    name: 'Windows'
                },
                {
                    slug: 'mac',
                    name: 'Mac'
                },
                {
                    slug:'linux',
                    name:'Linux'
                }
            ];
        };
        this.buildLinkTokenObject = function (routeParams) {
            return {
                valid: false,
                message: false,
                visible: false,
                token: utilityService.getValue(routeParams, 'token'),
                defaultMessage: "This link has expired. Please connect with your HR team or Qandle team for more details.",
                operatingSystem: {
                    list: this.buildOperatingList(),
                    selected: null
                },
                url: {
                    visible: false,
                    application: null,
                    video: null 
                }
            };
        };
                               
    }
]);