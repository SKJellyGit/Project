app.service('RecruitmentJobsService', [ 'utilityService', '$sce',
    function (utilityService, $sce) {
        'use strict';

        var self = this;

        this.url = {
            content: 'recruitment-frontend/external-company-job-page/2',
            additionalField: 'recruitment-frontend/addition-field-candidate-detail',
            saveAdditionalField: 'recruitment-frontend/save-addition-stage-fields'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.loadTeamCarousel = function () {
            $("#team-list").owlCarousel({
                items: 3,
                loop: true,
                lazyLoad: true,
                navText: ["<i class='fa fa-angle-left fa-lg'></i>","<i class='fa fa-angle-right fa-lg'></i>"],
                pagination: false,
                nav: true,
                dots: false,
                margin: 10
            });
        };
        
    }
]);