app.service('travelParentService', [
    'ServerUtilityService', 'utilityService',
    function (ServerUtilityService, utilityService) {
        'use strict';

        var self = this;
        this.url = {
            travelSetting: 'travel-expense/travel-settings',
            expenseSetting: 'travel-expense/expense-settings',
            getExpenseCategory: 'travel-expense/expense-category',
            expenseCategory: 'travel-expense/expense-only-category',
            travelPolicies: 'travel-expense/travel-policies',
            travelPolicy: 'travel-expense/travel-policy',
            currency: 'data/travel/currency-code.json',
            categories: 'travel-expense/expense-categories',
            policyCategorySetting: 'travel-expense/policy-settings',
            allTravelPlanner: 'travel-expense/travel-planners'
        };
        this.getUrl = function (apiUrl) {
            return this.url[apiUrl];
        };
        this.buildTravelSettingObj = function() {
            return {
                travel: {
                    setting: null,
                },
                expense: {
                    categories: [],
                } 
            }
        };

    }
]);