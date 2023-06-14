app.service('CalendarService', ['utilityService',
    function (utilityService) {
        'use strict';
        
        this.url = {
            monthCal: 'employee/calendar',
            weekCal: 'employee/calendar',
            holidayList: 'employee/holiday/detail',
            calender : 'data/adminPayroll/filling-calender.json',
            googleToken : 'employee/create-google-token',
            googleTokenPost : 'employee/assign-calender'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.dayDuration = [
            {value:'12 am'}, {value:'1 am'}, {value:'2 am'}, {value:'3 am'},
            {value:'4 am'}, {value:'5 am'}, {value:'6 am'}, {value:'7 am'},
            {value:'8 am'}, {value:'9 am'}, {value:'10 am'}, {value:'11 am'}, 
            {value:'12 pm'}, {value:'1 pm'}, {value:'2 pm'}, {value:'3 pm'},
            {value:'4 pm'}, {value:'5 pm'}, {value:'6 pm'}, {value:'7 pm'},
            {value:'8 pm'}, {value:'9 pm'}, {value:'10 pm'}, {value:'11 pm'}
        ];
        this.buildFilterTypelist = function (envMnt) {
            var list = [
                {
                    name: 'Holiday',
                    type: 5,
                    icon: 'green',
                    isChecked: true
                },
                {
                    name: 'Team Leaves',
                    type: 4,
                    icon: 'blue',
                    isChecked: true
                },
                {
                    name: 'My Leaves',
                    type: 1,
                    icon: 'red',
                    isChecked: true
                },
                {
                    name: 'My Leave Request',
                    type: 2,
                    icon: 'orange',
                    isChecked: true
                },
                {
                    name: 'Week Off',
                    type: 6,
                    icon: 'gray',
                    isChecked: true
                },
                {
                    name: 'Notify',
                    type: 3,
                    icon: 'gray',
                    isChecked: true
                }                
            ];                

            if (envMnt === 'demo' || envMnt === 'demo1') {
                list.push({
                    name: 'Google Event',
                    type: 7,
                    icon: 'vilot',
                    isChecked: true
                });
            }

            return list;
        };
        this.buildEventObj = function (model) {
            return {
                title: model.title,
                type: model.type,
                startsAt: new Date(utilityService.getDefaultDate(model.payDate)),
                //endsAt: null,
                draggable: false,
                resizable: true,
                incrementsBadgeTotal: true
            }
        };
        this.buildColorFlagsObject = function () {
            return {
                1: "important",
                2: "warning",
                3: "special",
                4: "info",
                5: "success",
                6: "Optional",
                7: "googleEvent"
            };
        };
        this.buildFilterFlagsObject = function () {
            return {
                holidayFlag: true,
                myLeaveFlag: true,
                isNotification: true
            };
        };
        this.buildColorClassMappingObject = function () {
            return {
                1: {
                    'class':'red'
                },
                2: {
                    'class':'orange'
                },
                3: {
                    'class':'purpul'
                },
                4: {
                    'class':'blue'
                },
                5: {
                    'class':'green'
                },
                6: {
                    'class':'light-gray'
                },
                7: {
                    'class':'light-brown'
                },
                8: {
                    'class':'cyan'
                },
                9: {
                    'class':'d-yellow'
                },
                10: {
                    'class':'maroon'
                },
                11: {
                    'class':'pink'
                },
                12: {
                    'class':'light-blue'
                }
            };
        };

    }
]);