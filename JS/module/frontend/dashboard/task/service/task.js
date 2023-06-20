app.service('EmployeeTaskManagementService', ['utilityService', 
    function (utilityService) {
        'use strict';

        this.url = {
            summary: 'data/task/summary.json',
            details: 'data/task/details.json',
            task: 'data/task/save-update.json',
            status: 'data/task/save-update.json',
            teamDetails: 'data/task/team-tasks.json',
            weekwise: 'data/task/week-wise.json',
            statuswise: 'data/task/status-wise.json',
            weekwiseList: 'tasklist/task-detail/1',
            statuswiseList: 'tasklist/status-wise-task-detail',
            completedTask: 'tasklist/done-task-detail',
            saveTask: 'tasklist/task',
            updateTaskName: 'tasklist/task',
            updateTaskStatus: 'tasklist/task-status',
            updateTaskDate: 'tasklist/modify-date'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildTaskObject = function (routeParams) {
            return {
                weeklyView: this.buildWeeklyViewObject(),
                statusView: this.buildStatusViewObject(),
                statusMapping: this.buildTaskStatusMappingObject(),                
                monthMapping: this.buildMonthMapping(), //utilityService.buildMonthObject(),
                tabname: "weekly-view",
                model: this.buildModelObject(),
                action: this.buildActionObject(),
                refId: utilityService.getValue(routeParams, 'refId'),
                characterLimit: 200
            };
        };        
        this.buildWeeklyViewObject = function () {
            return {
                list: [],
                visible: false,
                filteredList: [],
                propertyName: '',
                reverse: false,
                duration: this.buildWeeklyViewDurationObject()
            };
        };
        this.buildStatusViewObject = function () {
            return {
                list: [],
                visible: false,
                filteredList: [],
                propertyName: '',
                reverse: false,
                duration: this.buildStatusViewDurationObject()
            };
        };
        this.buildWeekWiseParams = function (duration) {
            var startTimestamp = (new Date(duration.start.month + '/' + duration.start.date + '/' + duration.start.year + ' 00:00:00')).getTime(),
                endTimestamp = (new Date(duration.end.month + '/' + duration.end.date + '/' + duration.end.year + ' 00:00:00')).getTime();
               
            return {
                from_date: startTimestamp/1000,
                to_date: endTimestamp/1000
            };
        };
        this.buildDateObject = function (date) {
            return {
                date: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                fullDate: date
            };
        };
        this.buildWeeklyViewDurationObject = function () {
            var date = utilityService.getPreviousMondayDate(),
                start = this.buildDateObject(date),
                end = {};

            angular.copy(start, end);

            return {
                start: start,
                end: this.buildDateObject(this.addSubtractDays(end.fullDate, 6, '+'))
            };
        };
        this.buildStatusViewDurationObject = function () {
            var date = utilityService.getPreviousMondayDate(),
                start = this.buildDateObject(date),
                end = {};

            angular.copy(start, end);

            return {
                start: start,
                end: this.buildDateObject(this.addSubtractDays(end.fullDate, 6, '+'))
            };
        };
        this.buildModelObject = function () {
            return {
                name: null,
                date: null
            };
        };
        this.buildActionObject = function () {
            return {
                _id: null,
                status: null,
                remark: null
            };
        };
        this.buildMonthMapping = function () {
            return {
                1: "January",
                2: "February",
                3: "March",
                4: "April",
                5: "May",
                6: "June",
                7: "July",
                8: "August",
                9: "September",
                10: "October",
                11: "November",
                12: "December"
            };
        };
        this.buildTaskStatusMappingObject = function () {
            return  {
                1: {
                    title: 'Not Started'
                },
                2: {
                    title: 'On Going'
                },
                3: {
                    title: 'Done'
                }
            };
        };
        this.buildSaveTaskPayload = function (item) {
            return {
                name: utilityService.getValue(item, 'new_task_name'),
                date: angular.isDate(item.date) 
                    ? this.convertDateFormatToTimestamp(item.date).toString()
                    : utilityService.getValue(item, 'date').toString()
            };
        };
        this.addSubtractDays = function (date, days, operator) {
            if (operator === '+') {
                date.setDate(date.getDate() + days);
            } else {
                date.setDate(date.getDate() - days);
            }            
            
            return date;
        };
        this.buildTaskNamePayload = function (item) {
            return {
                name: utilityService.getInnerValue(item, 'action', 'task_name')
            };
        };
        this.buildTaskStatusPayload = function (item) {
            return {
                name: utilityService.getInnerValue(item, 'action', 'task_name'),
                status: utilityService.getInnerValue(item, 'action', 'task_status')
            };
        };
        this.convertDateFormatToTimestamp = function (dateFormat) {
            var ddMMYYYYFormat = utilityService.dateFormatConvertion(dateFormat),
                mmDDYYYYFormat = utilityService.changeDateFormat(ddMMYYYYFormat),
                midNightDate = new Date(mmDDYYYYFormat + ' 00:00:00'),
                timestamp = midNightDate.getTime();

            return timestamp/1000;
        };
        this.buildTaskDatePayload = function (item) {
            var dateFormat = utilityService.getInnerValue(item, 'action', 'task_date'),
                timestamp = this.convertDateFormatToTimestamp(dateFormat);
            
            return {
                date: timestamp.toString()
            };
        };
        this.buildUpdateTaskPayload = function (item) {
            var payload = {};

            if (utilityService.getValue(item, 'activeTab') === 'task_date') {
                payload = this.buildTaskDatePayload(item);
            } else if (utilityService.getValue(item, 'activeTab') === 'task_status') {
                payload = this.buildTaskStatusPayload(item);
            } else {
                payload = this.buildTaskNamePayload(item);
            }

            return payload;
        };
        this.buildDefaultByStatusList = function () {
            return [
                {
                    status: 1,
                    date: new Date(),
                    task: []
                },
                {
                    status: 2,
                    date: new Date(),
                    task: []
                },
                {
                    status: 3,
                    date: new Date(),
                    task: []
                }
            ];
        }; 
    }
]);