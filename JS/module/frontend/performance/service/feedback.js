app.service('KeyResultAdminService', ['utilityService', '$filter',
    function (utilityService, $filter) {
        'use strict';
        var self = this;

        this.url = {     
            allUser : 'user-addition/all-user',
            meeting: 'admin-frontend/performance/meeting',
            feedbackCount: 'performance/admin-regular-feedback'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildKeyResultObject = function() {
            return {
                feedback: [],
                selectAll: false
            }
        };

        this.buildMeetingsCsvContent = function(list) {
            var createDate = function(date, time) {
                if(angular.isNumber(date) && angular.isNumber(time)) {
                    return $filter('date')(date, 'dd MMM, yyyy') + ' - ' + $filter('date')(time, 'hh:mm a');
                }
                return '-';
            };
            var csvContent = [],
                headers = ['Employee', 'Employee ID', 'Last 1:1', 'Next 1:1', 'Upline manager'];
            csvContent.push(headers);
            angular.forEach(list, function(val, key) {
                var row = [];
                row.push(utilityService.getInnerValue(val, 'employee_preview', 'full_name', '-'));
                row.push(utilityService.getValue(val, 'employee_id', '-'));
                row.push(createDate(val.lastOneOnOne, val.lastOneOnOneTime));
                row.push(createDate(val.nextOneOnOne, val.nextOneOnOneTime));
                row.push(utilityService.getInnerValue(val, 'manager_preview', 'full_name', '-'));

                csvContent.push(row);
            });
            return csvContent;
        };

        return this;
    }
]);