app.service('PayrollLegalEntityService', ['utilityService',
    function (utilityService) {
        'use strict';

        this.url = {            
            legalEntities : 'payroll/admin-legal-entities',
            verify: 'payroll/legal-entity-permission'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildVerifyLegalEntityPayload = function (legalEntity) {
            return {
                legal_entity_id: legalEntity.selected
            };
        };
        
    }
]);