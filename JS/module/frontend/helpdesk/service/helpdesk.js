app.service('FrontHelpDeskService', [
    'utilityService',
    function (utilityService) {
        'use strict';

        this.url = {
            getPriority: 'helpdesk/priority-list',
            getEmployee: 'user-addition/all-user',
            getAllCategory: 'helpdesk/active-categories',
            getOneCategory: 'helpdesk/category',
            createTicket: 'helpdesk/frontend/ticket',
            allTickets: "helpdesk/frontend/employee/all-tickets",
            allPocTickets: "helpdesk/frontend/poc/all-tickets",
            ticketDetails: 'helpdesk/frontend/ticket',
            reply: "helpdesk/frontend/reply",
            adminView: "helpdesk/frontend/admin-ticket-view",
            adminOwnerView: "helpdesk/frontend/admin-owner-view",
            sendReminder: "prejoin/frontend/send-reminder",
            adminEmployeeView: "helpdesk/frontend/admin-employee-view",
            closeTicket: "helpdesk/frontend/close-tickets",
            replyTicket: "helpdesk/frontend/reply-tickets",
            replyAndCloseTicket: "helpdesk/frontend/replynclose-tickets",
            updateTicket: 'helpdesk/frontend/ticket',
            allmandatorygroup : 'user-management/active/group?mandatory=true&field=true',
            getGlobalSet: 'helpdesk/setting',
            showAttachment: 'helpdesk/frontend/download-attachment',
            actionAdmin: 'employee/module-permission'            
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.createTicketModel = function(model){
             return {
                _id: utilityService.getValue(model, '_id'),
                category: utilityService.getValue(model, 'category'),
                subcategory: utilityService.getValue(model, 'subcategory'),
                subject: utilityService.getValue(model, 'subject'),
                issue: utilityService.getValue(model, 'issue'),
                priority: utilityService.getValue(model, 'priority'),
                ticket_attachment: utilityService.getValue(model, 'ticket_attachment'),
            };
        };
        this.makeIdsArray = function(data){
            var arr = [];
            angular.forEach(data, function (row,index){
                var id = angular.isObject(row.id)?row.id.$id:row.id;
                arr.push(id);
            });
            return arr;
        };        
        this.extractChipId = function (data){
            var arr = [];
            if(angular.isDefined(data)&& data.length){
                angular.forEach(data, function (v, k){
                    arr.push(v.id);
                });
            }
            return arr;
        };
        this.buildDateObject = function () {
            return {
                1: {
                    name: "All Time",
                    isChecked: 0
                },
                2: {
                    name: "Last Week",
                    label: 7,
                    isChecked: 1
                },
                3: {
                    name: "Last Month",
                    label: 30,
                    isChecked: 2
                }
            };
        };
        this.buildTicketStatusObject = function () {
            return{
                1: {
                    name: "Pending: In TAT",
                    isChecked: false,
                    refrence: 1
                },
                2: {
                    name: "Pending: Over TAT",
                    isChecked: false,
                    refrence: 2,
                    label: [
                        {
                            name: "Over TAT by 0-1 days",
                            isChecked: false,
                            refrence: 3,
                            start: 0,
                            end:1
                        },
                        {
                            name: "Over TAT by 2-3 days",
                            isChecked: false,
                            refrence: 4,
                            start: 2,
                            end:3
                        },
                        {
                            name: "Over TAT by 4-5 days",
                            isChecked: false,
                            refrence: 5,
                            start: 4,
                            end:5
                        },
                        {
                            name: "Over TAT by 6-10 days",
                            isChecked: false,
                            refrence: 6,
                            start: 6,
                            end:10
                        },
                        {
                            name: "Over TAT by 11-30 days",
                            isChecked: false,
                            refrence: 7,
                            start: 11,
                            end:30
                        },
                        {
                            name: "Over TAT by 30+ days",
                            isChecked: false,
                            refrence: 8,
                            start: 31,
                            end: Infinity
                        }
                    ]
                },
                3: {
                    name: "closed",
                    refrence: 0,
                    isChecked: false
                }
            };
        };        
        this.statusDueObject = function () {
            return {
                3: {
                    start: 0,
                    end: 1
                },
                4: {
                    start: 2,
                    end: 3
                },
                5: {
                    start: 4,
                    end: 5
                },
                6: {
                    start: 6,
                    end: 10
                },
                7: {
                    start: 11,
                    end: 30
                },
                8: {
                    start: 31,
                    end: Infinity
                }
            };
        };
        this.priorityObject = function () {
            return {
                1: "orange-bg orange",
                2: "green-bg green",
                3: "gray-bg gray",
                4: "red-bg red",
                5: "blue-bg blue",
                6: "light-gray-bg light-gray ",
                7: "yellow-bg yellow"  
            };
        };
        this.buildResolutionDurationObject = function() {
            return {
                1: 'Working Day(s)',
                2: 'Working Hour(s)'
            };
        };
    }
]);