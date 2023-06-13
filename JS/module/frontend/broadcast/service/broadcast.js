app.service('FrontendBroadcastService', [
    'ServerUtilityService', 'utilityService',
    function (ServerUtilityService, utilityService) {
        'use strict';
        this.url = {
            addNoitce: 'notice/add',
            allNoitce: 'notice/all-notice',
            getNoitce: 'notice/get',
            editNoitce: 'notice/edit',
            duplicate: 'notice/duplicate',
            publish: 'notice/publish',
            delete: 'notice/delete'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };        
        this.bulidNoticeModel = function (model) {
            return {
                topicName: utilityService.getValue(model, 'topic_name'),
                subject: utilityService.getValue(model, 'subject'),
                message: utilityService.getValue(model, 'message'),
                isEmail: utilityService.getValue(model, 'is_email', false),
                isNotification: utilityService.getValue(model, 'is_notification', false),
                isPersistent: utilityService.getValue(model, 'is_persistent', false),
                startDate: angular.isDefined(model) && angular.isDefined(model.notice_start_day) ? utilityService.getDefaultDate(model.notice_start_day) : null,
                endDate: angular.isDefined(model) && angular.isDefined(model.notice_end_day) ? utilityService.getDefaultDate(model.notice_end_day) : null,
                startTime: angular.isDefined(model) && angular.isDefined(model.notice_start_time) ? new Date("1970-01-01" + " " + model.notice_start_time) : null,
                endTime: angular.isDefined(model) && angular.isDefined(model.notice_end_time) ? new Date("1970-01-01" + " " + model.notice_end_time) : null,
                canEmployeeHideNotification: utilityService.getValue(model, 'can_employee_hide_notification', false),
                isPublished: utilityService.getValue(model, 'is_published', false),
            };
        };        
        this.bulidNoticePayload = function (model) {
            var payload =  {
                topic_name: model.topicName,
                subject: model.subject,
                message: model.message,
                is_email: model.isEmail,
                is_notification: model.isNotification,
                is_persistent: model.isPersistent,
                notice_start_day: utilityService.dateFormatConvertion(model.startDate),
                notice_start_time: utilityService.convertTimeInStandardForms(model.startTime),
                can_employee_hide_notification: model.canEmployeeHideNotification
            };
            if(model.isPersistent) {
                payload.notice_end_day = utilityService.dateFormatConvertion(model.endDate);    
                payload.notice_end_time = utilityService.convertTimeInStandardForms(model.endTime);
            }
            
            return payload;
        };        
        this.typeObject = function () {
            return [
                {
                    name : 'Email',
                    label: 'is_email',
                    isChecked: false
                },
                {
                    name : 'Notification',
                    label: 'is_notification',
                    isChecked: false
                },
                {
                    name : 'Persistent',
                    label: 'is_persistent',
                    isChecked: false
                }
            ];
        };        
        this.statusObject = function () {
            return [
                {
                    name : 'Published',
                    label: 'is_published',
                    countFlag: true,
                    isChecked: false
                },
                {
                    name : 'Draft',
                    label: 'is_drafted',
                    countFlag: false,
                    isChecked: false
                },
//                {
//                    name : 'Expired',
//                    slug: true,
//                    isChecked: false
//                }
            ];
        };
        this.buildBroadCastStatusMapping = function () {
            return {
                "true": {
                    title: "Published",
                    color: "green"
                },
                "false": {
                    title: "In Draft",
                    color: "orange"
                }
            }
        };
        
    }
]);