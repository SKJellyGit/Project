app.service('CrowdsolveService', ['utilityService',
    function (utilityService) {
        'use strict';

        this.url = {
            issue: 'social-frontend/issue',
            response: 'social-frontend/response',
            reply:'social-frontend/reply-on-response'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildCrowdSolveModel = function(model){
            return {
                _id: utilityService.getValue(model, '_id'),
                issue_name: utilityService.getValue(model,'issue_name'),
                description: utilityService.getValue(model, 'description'),
                end_date: utilityService.getValue(model,'end_date'),
                reward: utilityService.getValue(model, 'reward'),
                attachment: utilityService.getValue(model,'attachment')
            }
        };
        this.buildCrowdSolveObject = function(){
            return {
                model: this.buildCrowdSolveModel(),
                list: [],
                type: [{
                    id: 1,
                    name: "Make Response Public"
                },
                {
                    id: 2,
                    name: "Make Response Private"
                }],
                response : {
                    list : []
                },
                openProblemsCount:0
            };
        };
        this.buildResponseFlagObject = function(data) {
            var openProblemCount = 0;
            var currentDate = new Date().getTime();
            if(data.length) {
                angular.forEach(data,function(value,key) {     
                    value.expireFlag = false;               
                    var endDate = utilityService.changeDateFormat(value.end_date);
                    endDate = new Date(endDate).getTime();
                    if(endDate > currentDate){
                        value.expireFlag = true;
                        ++openProblemCount;
                    }
                    value.responseFlag = false;
                    //value.end_date = utilityService.changeDateFormat(value.end_date);
                });
            }
            return openProblemCount;
        };
    }
]);