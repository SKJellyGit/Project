app.service('ThirdPartyService', ['utilityService', 
    function (utilityService) {
        'use strict';

        this.url = {
            integrationsThirdParty: 'third-party/integrations',          
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildInsuranceObject = function () {
            return {
                details: {
                    iframeSrc: null
                },
                visible: false                
            };
        };
    }
]);