app.service('TeamScreenshotService', ['utilityService', 
    function (utilityService) {
        'use strict';

        this.url = {
            summary: 'timeattendance/manager/wfh-pc-info',//'data/screenshot/summary.json'//
            getScreenshotCollection:'timeattendance/employee/wfh-screenshots',
            getNthScreenshot:'timeattendance/employee/wfh-single-screenshots' /*  /{ss_id}/{number_of_screenshot}   */
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildScreenshotObject = function (routeParams) {
            return {
                dailyView: this.buildDailyViewObject(),
                weeklyView: this.buildWeeklyViewObject(),
                monthMapping: this.buildMonthMapping(),
                tabname: "daily-view"
            };
        };
        this.buildDailyViewObject = function () {
            return {
                list: [],
                visible: false,
                filteredList: [],
                propertyName: '',
                reverse: false,
                duration: this.buildDailyViewDurationObject(),
                graph:{}
            };
        };
        this.buildWeeklyViewObject = function () {
            return {
                list: [],
                visible: false,
                filteredList: [],
                propertyName: '',
                reverse: false,
                duration: this.buildWeeklyViewDurationObject(),
                graph:{}
            };
        };        
        this.buildDailyViewDurationObject = function (date) {
            return this.buildDateObject(angular.isDefined(date) ? date : new Date());
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
        this.buildDateObject = function (date) {
            return {
                date: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                fullDate: date
            };
        };
        this.buildDailyViewParams = function (duration) {
            var startTimestamp = (new Date(duration.month + '/' + duration.date + '/' + duration.year + ' 00:00:00')).getTime(),
                endTimestamp = (new Date(duration.month + '/' + duration.date + '/' + duration.year + ' 00:00:00')).getTime();
               
            return {
                from_date: startTimestamp/1000,
                to_date: endTimestamp/1000
            };
        };
        this.buildWeekViewParams = function (duration) {
            var startTimestamp = (new Date(duration.start.month + '/' + duration.start.date + '/' + duration.start.year + ' 00:00:00')).getTime(),
                endTimestamp = (new Date(duration.end.month + '/' + duration.end.date + '/' + duration.end.year + ' 00:00:00')).getTime();
               
            return {
                from_date: startTimestamp/1000,
                to_date: endTimestamp/1000
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
        this.convertDateFormatToTimestamp = function (dateFormat) {
            var ddMMYYYYFormat = utilityService.dateFormatConvertion(dateFormat),
                mmDDYYYYFormat = utilityService.changeDateFormat(ddMMYYYYFormat),
                midNightDate = new Date(mmDDYYYYFormat + ' 00:00:00'),
                timestamp = midNightDate.getTime();

            return timestamp/1000;
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
        
        this.getGraphColorCodes = function(list) {
	    	list = angular.isObject(list) ? list : JSON.parse(list);
	    	var colorCodes = [],
	    		colorObject = utilityService.buildColorObject();

	    	angular.forEach(list, function(value, key) {
	    		var leaveType = value.name.replace(/ /g,"_").toLowerCase();            
	            var code = utilityService.getValue(colorObject[leaveType], 'code') 
	                ? colorObject[leaveType].code : colorObject.other_leave.code;

	            colorCodes.push(code);
	    	});
	    	return colorCodes;
        };
        
        this.monthHashMap = {
    		1: "JAN",
    		2: "FEB",
    		3: "MAR",
    		4: "APR",
    		5: "MAY",
    		6: "JUN",
    		7: "JULY",
    		8: "AUG",
    		9: "SEP",
    		10: "OCT",
    		11: "NOV",
    		12: "DEC"
        };
        
        this.getDODCategories = function(mdl, additionalData) {
	    	var categories = [];
	    	for (var i = additionalData.start; i <= additionalData.end; i++) {
               categories.push('Day' + i);
            }
            return categories;
	    };
	    this.getWOWCategories = function(mdl, additionalData) {
            var categories = [];
            for (var i = additionalData.start; i <= additionalData.end; i++) {
	            categories.push('Week' + i);
	        }            
            return categories;
	    };
	    this.getMOMCategories = function(mdl, additionalData) {
	    	var categories = [];
	    	additionalData.end = additionalData.start > additionalData.end ? parseInt(additionalData.end, 10) + 12 : parseInt(additionalData.end, 10);

    		for(var i=additionalData.start; i<=additionalData.end; i++) {
    			categories.push((i > 12 ? this.monthHashMap[i-12] : this.monthHashMap[i]) + ' ' + (i > 12 ? additionalData.endYear : additionalData.startYear));
    		}
	    	
	    	return categories;
	    };
	    this.getYOYCategories = function(mdl, additionalData) {
	    	var categories = [];	    		
	    	for (var i = additionalData.start; i <= additionalData.end; i++) {
               categories.push(i);
            }
	    	return categories;
	    };
	    this.buidXAxisSummaryGraphData = function(mdl, additionalData) {	    
	    	var categories = [];
		    switch(mdl.duration.slug) {
	            case 'dod':
            		categories = this.getDODCategories(mdl, additionalData);
            		break;

	            case 'wow':
            		categories = this.getWOWCategories(mdl, additionalData);
            		break;

	            case 'yoy':
            		categories = this.getYOYCategories(mdl, additionalData);
            		break;

	            default:
	            	categories = this.getMOMCategories(mdl, additionalData);            		
           			break;
	        }
	        return categories;
        };  
        
        this.buildScreenshotCarousel=function (model) {
            return{
                employee_name:model.employee_name,
                employee_code:model.employee_code,
                collectionId:model.ss_id,
                currentScreenshotUrl:null,
                currentScreenshotDate:null,
                currentScreenshotNum:0,
                totalCount:model.ss_count,
                loadingImage:false
            }
        }



    }
]);