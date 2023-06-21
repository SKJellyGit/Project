app.service('SliceDiceService', [
    '$timeout', 'utilityService',
    function ($timeout, utilityService) {
        'use strict';

        var self = this;

        this.url = {
            details : 'payroll/employee/payout',
            monthlyComparison : 'data/adminPayroll/slice-dice/monthly-comparison.json'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildDurationList = function() {
            return [
                /*{
                    id: 1,
                    title: "Week",
                    slug: "week",
                },*/
                {
                    id: 2,
                    title: "Month",
                    slug: "month",
                }/*,
                {
                    id: 3,
                    title: "Quarter",
                    slug: "Quarter"
                }*/                
            ]
        };
        this.buildDefaultDurationObject = function() {
            return {
                id: 2,
                title: "Month",
                slug: "month",
            }
        };
        this.getCurrentYear = function() {
            var d = new Date();
            return d.getFullYear();
        };
        this.getCurrentMonth = function() {
            var d = new Date();
            return d.getMonth() + 1;
        };
        this.getLastPayrollMonth = function() {
            var d = new Date();
            return d.getMonth() + 1;
        };
        this.buildYearList = function() {
            var year = this.getCurrentYear(),
                list = [];

            for(var i=year, j=1; i>= utilityService.startYear; i--, j++) {
                list.push({id: j, year: i})
            }

            return list;
        };
        this.buildQuarterList = function() {
            return [
                {
                    id: 1,
                    title: "Quarter1",
                    start: 4,
                    end: 6
                },
                {
                    id: 2,
                    title: "Quarter2",
                    start: 7,
                    end: 9
                },
                {
                    id: 3,
                    title: "Quarter3",
                    start: 10,
                    end: 12
                },
                {
                    id: 4,
                    title: "Quarter4",
                    start: 1,
                    end: 3
                }]
        };
        this.buildAggregateList = function() {
            return [
                {
                    id: 1,
                    slug: 'total_net_pay',
                    title: "Net Payout"
                },
                {
                    id: 2,
                    slug: 'total_gross',
                    title: "Gross Payout"
                }
            ]
        };
        this.buildDefaultAggregateObject = function() {
            return {
                id: 2,
                slug: 'total_gross',
                title: "Gross Payout"
            }
        };        
        this.buildSliceDiceObject = function() {
            return {
                duration: {
                    list: this.buildDurationList()
                },
                year: {
                    list: this.buildYearList(),
                    current: this.getCurrentYear()
                },
                quarter: {
                    list: this.buildQuarterList()
                },
                month: {
                    list: utilityService.buildMonthList(),
                    current: this.getCurrentMonth()
                },                                
                tab: {
                    current: "grossNetPayout"
                },
                group: {                    
                    current: null,
                    object: {},
                    item: null,
                    sum: 0,
                    all: false,
                    elements: []
                },
                grossNetPayout: {
                    visible: false,
                    list: [],
                    data: [],
                    xAxisData: [],                    
                    filter: {
                        duration: this.buildDefaultDurationObject(),
                        year: this.getCurrentYear(),
                        month: this.getLastPayrollMonth(),                        
                        aggregateList: this.buildAggregateList(),
                        aggregate: this.buildDefaultAggregateObject() 
                    }
                },
                monthlyComparison: {
                    visible: false,
                    list: [],
                    data: [],
                    xAxisData: [],                    
                    duration: this.buildDefaultDurationObject()
                },
                employeeCount: {
                    visible: false,
                    list: [],
                    data: [],
                    xAxisData: [],                    
                    filter: {
                        duration: this.buildDefaultDurationObject(),
                        year: this.getCurrentYear(),
                        month: this.getLastPayrollMonth(),                        
                        aggregateList: [{
                            id: 1,
                            slug: 'count',
                            title: "Employee Count"
                        }],
                        aggregate: {
                            id: 1,
                            slug: 'count',
                            title: "Employee Count"
                        } 
                    }
                },
                salaryDistribution: {
                    visible: false,
                    list: [],
                    data: [],
                    xAxisData: [],                    
                    filter: {
                        duration: this.buildDefaultDurationObject(),
                        year: this.getCurrentYear(),
                        month: this.getLastPayrollMonth(),                        
                        aggregateList: [{
                            id: 1,
                            slug: 'total_ctc',
                            title: "Salary Distribution"
                        }],
                        aggregate: {
                            id: 1,
                            slug: 'total_ctc',
                            title: "Salary Distribution"
                        } 
                    }
                }
            }
        };
        this.calculateElementWiseSum = function(list, elements, groupObject, keyName, grpSlug) {
            if(grpSlug === 'all') {
                groupObject['all'] = {
                    sum : 0
                };
                angular.forEach(elements, function(value, key) {
                    value.amount = 0;
                    angular.forEach(list, function(v, k) {
                        v.count = 1;
                        if(angular.isDefined(v.employee_detail[value.group_slug]) ) {
                            var arrayElements = v.employee_detail[value.group_slug];
                            if(arrayElements.indexOf(value._id) >= 0) {
                                if (!isNaN(v[keyName])) {
                                    value.amount = value.amount + parseInt(v[keyName], 10);
                                    groupObject['all'].sum+= parseInt(v[keyName], 10);
                                }
                            }                      
                        }
                    });
                });
            } else {
                groupObject[grpSlug].sum = 0;
                angular.forEach(elements, function(value, key) {
                    value.amount = 0;
                    angular.forEach(list, function(v, k) {
                        v.count = 1;
                        if(angular.isDefined(v.employee_detail[grpSlug]) ) {
                            var arrayElements = v.employee_detail[grpSlug];
                            if(arrayElements.indexOf(value._id) >= 0) {
                                if (!isNaN(v[keyName])) {
                                    value.amount = value.amount + parseInt(v[keyName], 10);
                                    groupObject[grpSlug].sum+= parseInt(v[keyName], 10);
                                }
                            }                        
                        }
                    });
                });
            }            
        };
        this.calculatePercentage = function(value, total) {
            if(!total) {
                return 0;
            }
            var percentage = ((value/total) * 100),
                fixed = percentage.toFixed(2);

            return parseFloat(fixed); 
        };        
        this.extractMaxComponent = function(list, key) {
            if(!list.length) {
                return {};
            }
            var max = list.reduce(function(prev, current) {
                return (prev[key] > current[key]) ? prev : current
            });

            return max;
        };

    }
]);