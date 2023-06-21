app.service('PayrollGlanceService', [
    '$timeout', 'utilityService', 'CompensationService',
    function ($timeout, utilityService, compensationService) {
        'use strict';

        var self = this;

        this.url = {
            keyMetrices : 'payroll/keymetrics/statutory-deduction',
            investments : 'payroll/employee/investment'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildDurationList = function() {
            return [
                /*{
                    id: 1,
                    title: "Last Week",
                    slug: "last_week",
                },*/
                {
                    id: 2,
                    title: "Last Month",
                    slug: "last_month"
                }/*,
                {
                    id: 3,
                    title: "Last Quarter",
                    slug: "last_quater"
                },
                {
                    id: 4,
                    title: "Last Year",
                    slug: "last_year"
                }*/                
            ]
        };
        this.buildDefaultDurationObject = function() {
            return {
                id: 2,
                title: "Last Month",
                slug: "last_month"
            }
        };
        this.getMonthList = function() {
            return ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        };
        this.buildGlanceObject = function() {
            var monthList = this.getMonthList();
            var date = new Date();
            var lastMonthValue = date.getMonth();
            //var lastMonthName = monthList[lastMonthValue - 1];
            var lastMonthName = lastMonthValue == 0 ? monthList[11] : monthList[lastMonthValue - 1];
            var currentYear = lastMonthValue == 0 ? date.getFullYear() -1 : date.getFullYear();

            return {
                durationList: this.buildDurationList(),
                tab: {
                    current: "keyMetrices"
                },
                month: monthList,
                lastMonth: {
                    display: lastMonthName,
                    value: lastMonthValue
                },
                currentYear: currentYear,
                keyMetrices: {
                    visible: false,
                    list: [],
                    xAxisData: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
                    duration: this.buildDefaultDurationObject(),
                    color: {
                        class: ["orange", "blue", "red"],
                        code: ['rgb(250, 160, 93)', 'rgb(0, 126, 229)', 'rgb(219, 67, 54)']
                    }
                },
                statutoryDeductions: {
                    visible: false,
                    list: [],
                    xAxisData: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
                    duration: this.buildDefaultDurationObject(),
                    color: {
                        class: ["orange", "light-blue", "green", "blue", "vilot"],
                        code: ['rgb(250, 160, 93)', 'rgba(0, 0, 0, 0.23)', 'rgb(112, 164, 61)', 
                            'rgb(0, 126, 229)', 'rgb(151, 128, 201)']
                    }
                },
                investments: {
                    visible: false,
                    list: [],
                    xAxisData: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
                    durationList: [{
                        id: 1,
                        title: "Current Financial Year",
                        slug: "current_financial_year"
                    }],
                    duration: {
                        id: 1,
                        title: "Current Financial Year",
                        slug: "current_financial_year"
                    },
                    color: {
                        class: ["orange", "green", "vilot"],
                        code: ['rgb(250, 160, 93)', 'rgb(112, 164, 61)', 'rgb(151, 128, 201)']
                    },
                    year: compensationService.buildDefaultYearObject(),
                    yearList: compensationService.buildTaxYearList(utilityService.startYear)
                }
            }
        };
        this.getPercentageDifference = function(item) {
            var per,
                difference,
                differenceStr,
                object = {
                    difference : 0
                };

            if(!item || !item.current_worth || !item.previous_worth) {
                return object;
            }

            per = item.current_worth / item.previous_worth * 100;
            difference = Math.round(per*10)/10 - 100;
            differenceStr =  difference.toString();          
            object.difference = differenceStr.indexOf('.') >= 0 ? Math.abs(difference.toFixed(2)) : Math.abs(difference);
            if(difference > 0) {
                object.flag = 1; 
            } else if(difference < 0) {
                object.flag = -1; 
            } else {
                object.flag = 0; 
            }
            
            return object;
        };
        this.reBuildList = function(list, isGraph) {
            angular.forEach(list, function(value, key) {
                if(angular.isObject(value)) {
                    var object = self.getPercentageDifference(value);
                    value.difference = object.difference;
                    value.flag = object.flag;
                }
            });
            return list;
        };
        this.findAndFillMissingData = function(array) {
            var start = array[0]._id,
                end = array[array.length - 1]._id,
                obj = {},
                data = [];

            if(end - start == 1) {
                angular.copy(array, data);
            }

            angular.forEach(array,  function(v, k) {                       
                obj[v._id] = v;
            });
            
            for(var i=start; i<=end; i++) {
                if(angular.isDefined(obj[i])) {
                    data.push(obj[i]);
                } else {
                    data.push({
                        _id: i,
                        emp_count: 0,
                        amount: 0
                    });
                }
            }

            return data;
        };
        this.overWriteAtAGlanceAPIResponse = function() {
            return {
                status: "success",
                message: "Key metrics and statutory deductions",
                data: {
                    key_metrices: [{
                        title: "Employees got Paid",
                        data: [{
                            _id: "7",
                            emp_count: 26,
                            amount: 2766200
                        }]
                    }, {
                        title: "Loss of Pay Days",
                        data: [{
                            _id: "7",
                            emp_count: 1,
                            amount: 0
                        }]
                    }, {
                        title: "Total Claims",
                        data: [{
                            _id: "6",
                            emp_count: 1,
                            amount: 1000
                        }, {
                            _id: "4",
                            emp_count: 10,
                            amount: 153956
                        }]
                    }],
                    statutory_deductions: [{
                        title: "Employees TDS Deducted",
                        data: [{
                            _id: "7",
                            emp_count: 20,
                            amount: 48167
                        }]
                    }, {
                        title: "Employees PF Deducted",
                            data: [{
                            _id: "7",
                            emp_count: 21,
                            amount: 119962
                        }]
                    }, {
                        title: "Employees ESI Deducted",
                        data: 0
                    }, {
                        title: "Employees LWF Deducted",
                        data: [{
                            _id: "7",
                            emp_count: 0,
                            amount: 0
                        }]
                    }, {
                        title: "Employees PT Deducted",
                        data: [{
                            _id: "7",
                            emp_count: 0,
                            amount: 0
                        }]
                    }]
                }
            };
        };

    }
]);