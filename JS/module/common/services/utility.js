app.service('utilityService', [
    '$q', '$location', '$routeParams', '$mdToast', '$route', 'TEMPLATE_BUILDER', '$timeout', '$filter', 'FORM_BUILDER',
    function($q, $location, $routeParams, $mdToast, $route, TEMPLATE_BUILDER, $timeout, $filter, FORM_BUILDER) {
        'use strict';
        var newRelationships = {
            'hod': 'HOD',
            'hr_manager': 'HR Manager'
        };
        var self = this;
        var last = {
            bottom: true,
            top: false,
            left: false,
            right: true
        };
        var errors = ["login", "resetEmail", "resetFrgtPass", "resetPassword", "register", "verify", "token", "profile",
            "superAdmin", "hierarchy", "department", "company", "signatory", "location", "holiday",
            "holidayConfig", "leaveType", "basicInfo", "authSignatory", "bankAccount", "tax", "payrollCycle",
            "lossOfPay", "pfInfo", "pfPolicy", "pfEmpOptions", "esiInfo", "esiStatus", "candidateofferstatus",
            "allowance", "gratuity", "adhoc", "probationNotice", "candidatePortal", "tasks", "updateTask",
            "communication", "permissionRoles", "overtime", "latepolicy", "paymentMode", "approvalLevel",
            "autoRun", "investment", "investmentDeclaration", "rentDetail", "exitOptions", "unassignment",
            "noDues", "exitFeedback", "fndf", "exitSurvey", "exitInfo", "access", "group", "element",
            "format","lnd","lndSetting", "configuration", "connection", "filtersetting", "calenderDetails", "holidayDetails",
            "relevance", "role", "permissionFilter", "planSetting", "prejoin", "setting", "resourceFile",
            "set", "setResponsibility", "certificate", "template", "certificateSetting",
            "taPlan", "taShift", "planner", "reporting", "wfhPolicy", "compOff", "requestflow", "requestform",
            "FiledListId", "changeform", "formBuilder", "questionBuilder","useridentification","userdoclist",
            "userdocsettinglist","workflowDetails","segmentDetails","segmentFields","signatureUpload","provisionSetting",
            "userManagementForms","reference","bulkReference","workflowForms","saveSetupFields","editProfileFields",
            "provision", "exception", "changeManagement", "cms", "fieldType","taxInfo","helpdesk", "requestLeave",
            "action", "compansationPlanSetting","compensationPlan", "cycleInfo","revokeOffer","retriggerOffer",
            "regAddress","otherLocation","statutory", "profileFields", "propertySetting","reguReq","candidateForm",
            "candidateUploadForm", "letter", "renameFile", "folder", "creditDebit", "approveReject", "changePassword",
            "browser", "communication", "restrictedHoliday","reguReq","modiReq", "benefits", "claims", "otherIncome",
            "pf", "pt", "incomeTax", "broadcast", "insurance", "loanAdvance", "loan", "social", "community","feedback",
            "objective", "keyResult", "updatesSchedule", "updatesTemplate", "expense", "travel", "previousEmployer",
            "deadlineWindow", "initiateFnf", "appraisal", "rejectionReason","requisition","mandGroupField","interviewStages",
            "scorecard", "assignUser", "assignWorkflow", "timesheet", "budgetBreakdown", "weightage", "elcm", "initiateExit",
            "taxComputation", "futureSalaryBreakup", "taxDeclaration", "taxClaim", "hra", "bulkFilledTemplate", "appraisal",
            "nominatePeer", "meeting", "sharePeerFeedback", "pf", "vpf", "esi", "changeAmount", "claimAmount", "approveReject",
            "effectiveBreakup", "incomeTax", "fndf", "raisePIPRequest",
            "rejectPIPReason", "approvePIPRequest", "assignPIPDeliverable", "updatePIPDeliverableStatus",
            "freezePIPDeliverableStatus", "updatePIPRevieweeInterimSummary", "stopPIP", "addEmployeeToPIP",
            "sendReminder", "updatePIPFinalStatus", "fndf", "saveReport", "fndfCertificate", "uploadFnf", "modifyApprove",
            "lwpOverride", "lwprOverride", "lwppOverride", "bulkFilledTemplate", "creditInfo", "debitInfo", "onBehalfSettlement","pollNdSurvey", "assessment", "onGridPlan"];

        this.startYear = 2017;
        this.startMonth = 4; //Here 4 means April, first month of the Financial Year
        this.payrollProcessingDay = 20;
        this.norlankaStartMonth = 8;
        this.defSomeDate = "2017-10-01";
        this.apiError = {};
        this.systemRelationshipMaxCount = 6;
        this.isLoginViaEmployeeCode = null;
        this.loggedEmployee = {
            id: null
        };
        this.startForm12BBYear = 2019;
        this.rejectedStatusArray = [2, 9, 11, 14];
        this.approvedStatusArray = [3, 8, 10, 12];
        this.unlimitedText = 'As per need';
        this.applyLeave = {
            fromMinDate: '01/01/2019',
            domains: ['myhr', 'prod3', 'ess', 'hronline', 'shriramggn', 'mempl', 'mis', 'edusch', 'local'],
        };
        this.buildAPIErrorObject = function() {
            var self = this;
            angular.forEach(errors, function(value, key) {
                self.apiError[value] = {
                    status: false,
                    message: null,
                    data: null
                };
            });
        };
        this.buildAPIErrorObject();
        this.buildAPIErrorObject = function() {
            return this.apiError;
        };
        this.resetAPIError = function(status, message, api) {
            api = angular.isDefined(api) ? api : "login";
            status = angular.isDefined(status) ? status : false;
            message = angular.isDefined(message) ? message : null;
            this.apiError[api].status = status;
            this.apiError[api].message = message;
            return this.apiError;
        };
        this.toastPosition = angular.extend({}, last);
        this.sanitizePosition = function() {
            var current = this.toastPosition;
            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;
            last = angular.extend({}, current);
        };
        this.getToastPosition = function() {
            this.sanitizePosition();
            var self = this;
            return Object.keys(this.toastPosition).filter(function(pos) {
                return self.toastPosition[pos];
            }).join(' ');
        };
        this.showSimpleToast = function(message) {
            var pinTo = this.getToastPosition();
            //$mdToast.show($mdToast.simple().textContent(message).position(pinTo).hideDelay(3000));
            $mdToast.show($mdToast.simple().textContent(message).position(pinTo));
        };
        this.parseServiceResponse = function(response) {
            if (response.status === "success") {
                return response.data;
            }
        };
        this.formatCityWebService = function(data, keyName) {
            var callback = function(data) {
                return {
                    display: data[keyName],
                    value: data[keyName],
                    searchString: data[keyName]
                };
            };
            return data.map(callback);
        };
        this.dateFormatConvertion = function(date, isYYMMDD) {
            isYYMMDD = angular.isDefined(isYYMMDD) ? isYYMMDD : false;
            var dateString = null,
                today = new Date(date),
                dd = today.getDate(),
                mm = today.getMonth() + 1, //; //January is 0!
                yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }
            return isYYMMDD ? (yyyy + '/' + mm + '/' + dd) : (dd + '/' + mm + '/' + yyyy);
        };
        this.refreshOldList = function(list, model, keyName) {
            keyName = angular.isDefined(keyName) ? keyName : '_id';
            angular.forEach(list, function(value, key) {
                if(value[keyName] == model[keyName]) {
                    list[key].slideOut = true;
                    list.splice(key, 1);
                    $timeout(function() {
                        list.splice(key, 0, model);
                        list[key].slideIn = true;
                    }, 1000);
                }
            });
        };
        this.refreshList = function(list, model, keyName) {
            keyName = angular.isDefined(keyName) ? keyName : '_id';
            angular.forEach(list, function (v, k , obj){
                if(model[keyName] == v[keyName]){
                    obj[k] = model;
                }
            });
        };
        this.refreshPlanList = function(list, model, keyName) {
            keyName = angular.isDefined(keyName) ? keyName : '_id';
            angular.forEach(list, function(value, key) {
                if (value.leave_plans) {
                    angular.forEach(value.leave_plans, function (val, key) {
                        if (val[keyName] == model[keyName]) {
                            value.leave_plans[key] = model;
                        }
                    });
                }

            });
        };
        this.refreshPolicyList = function(list, model, keyName) {
            keyName = angular.isDefined(keyName) ? keyName : '_id';
            angular.forEach(list, function(value, key) {
                if (value.policy) {
                    angular.forEach(value.policy, function (val, key) {
                        if (val[keyName] == model[keyName]) {
                            value.policy[key] = model;
                        }
                    });
                }

            });
        };
        this.buildBusinessTypeList = function() {
            return [{
                id: 1,
                slug: "limited_liability_partnership",
                name: "Limited Liability Partnership"
            }, {
                id: 2,
                slug: "partnership",
                name: "Partnership"
            }, {
                id: 3,
                slug: "private_limited",
                name: "Private Limited"
            }, {
                id: 4,
                slug: "proprietorship",
                name: "Proprietorship"
            }, {
                id: 5,
                slug: "public_limited",
                name: "Public Limited"
            }];
        };
        this.getValue = function(model, key, defaultValue) {
            return angular.isDefined(model) && model && angular.isDefined(model[key]) && model[key] != null && model[key] != "null" ? model[key] : (angular.isDefined(defaultValue) ? defaultValue : null);
        };
        this.dateToString = function(date, delimeter, dformat) {
            delimeter = angular.isDefined(delimeter) ? delimeter : '/';
            var dateString = null,
                dateFormat = null,
                today = new Date(date),
                dd = today.getDate(),
                mm = today.getMonth() + 1, //; //January is 0!
                yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }

            if(dformat == 'ymd') {
                dateFormat = yyyy + delimeter + mm + delimeter + dd;
            } else {
                dateFormat =  dd + delimeter + mm + delimeter + yyyy;
            }

            return dateFormat;
        };
        this.stringToDate = function(dateString) {
            return dateString ? new Date(dateString) : (new Date);
        };
        this.changeDateFormat = function(dateString, isYYMMDD) {
            isYYMMDD = angular.isDefined(isYYMMDD) && isYYMMDD ? true : false;
            var delimeter = dateString.indexOf('-') >= 0 ? '-' : '/';
            var arrDate = dateString.split(delimeter);

            return (isYYMMDD) ? (arrDate[1] + "/" + arrDate[2] + "/" + arrDate[0])
                : (arrDate[1] + "/" + arrDate[0] + "/" + arrDate[2]);
        };
        this.getDefaultDate = function(dateString, isYYMMDD, isNullable) {
            isYYMMDD = angular.isDefined(isYYMMDD) && isYYMMDD ? true : false;
            isNullable = angular.isDefined(isNullable) && isNullable ? true : false;
            return dateString ? new Date(this.changeDateFormat(dateString, isYYMMDD))
                : (!isNullable ? (new Date) : null);
        };
        this.getDayOfMonthSuffix = function(day) {
            if (angular.isUndefined(day) || !day) {
                return "";
            }
            if (day >= 11 && day <= 13) {
                return "th";
            }
            switch (day % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        };
        this.deleteCallback = function (data, item, list, key) {
            key = angular.isDefined(key) ? key : '_id';

            if (data.status == "success") {
                list = list.filter(function (el) {
                    return el[key] !== item[key];
                });
            }
            return list;
        };
        this.setTotalPages = function(count, current) {
            var shownPages = 3;
            var result = [];
            if (current > count - shownPages) {
                result.push(count - 2, count - 1, count);
            } else {
                result.push(current, current + 1, current + 2, '...', count);
            }
            return result;
        };
        this.deleteCallbackProvision = function (data, item, list, key) {
            key = angular.isDefined(key) ? key : '_id';

            if (data.status == "success") {
                list = list.filter(function (el) {
                    return el[key].$id !== item[key].$id;
                });
            }
            return list;
        };
        this.removeStorageValue = function (name) {
            try {
                localStorage.removeItem(name);
                localStorage.removeItem(name + '_expiresIn');
            } catch(e) {
                console.log('removeStorage: Error removing key ['+ key + '] from localStorage: ' + JSON.stringify(e) );
                return false;
            }
            return true;
        };
        this.getStorageValue = function (key) {
            var now = Date.now(),
                expiresIn = localStorage.getItem(key + '_expiresIn');

            if (expiresIn===undefined || expiresIn===null) {
                expiresIn = 0;
            }

            if (expiresIn < now) {// Expired
                this.removeStorageValue(key);
                return null;
            } else {
                try {
                    var value = localStorage.getItem(key);
                    return value;
                } catch(e) {
                    console.log('getStorage: Error reading key ['+ key + '] from localStorage: ' + JSON.stringify(e) );
                    return null;
                }
            }
        };
        this.setStorageValue = function(key, value, expires) {
            if (expires === undefined || expires === null) {
                expires = (24*60*60);  // default: seconds for 1 day
            } else {
                expires = Math.abs(1000*expires); //make sure it's positive //1000*expires
            }

            var now = Date.now(),
                schedule = now + expires*1000;

            try {
                localStorage.setItem(key, value);
                localStorage.setItem(key + '_expiresIn', schedule);
            } catch(e) {
                console.log('setStorage: Error setting key ['+ key + '] in localStorage: ' + JSON.stringify(e) );
                return false;
            }
            return true;
        };
        /*this.getStorageValue = function(key) {
         return angular.isDefined(localStorage.getItem(key)) ? localStorage.getItem(key) : null;
         };
         this.setStorageValue = function(key, value) {
         localStorage.setItem(key, value);
         };
         this.removeStorageValue = function(key) {
         localStorage.removeItem(key);
         };*/
        this.timeSinceOld = function (date) {
            var seconds =  Math.abs(Math.floor((new Date()/1000 - date)));
            var interval = Math.floor(seconds / 31536000);

            if (interval >= 1) {
                return interval + " years";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                return interval + " months";
            }
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                return interval + " days";
            }
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
                return interval + " hours";
            }
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                return interval + " minutes";
            }
            return Math.floor(seconds) + " seconds";
        };
        this.addCommas = function (nStr){
            if(!nStr)
                return 0;

            nStr = nStr.toString();
            var lastThree = nStr.substring(nStr.length - 3),
                otherNumbers = nStr.substring(0, nStr.length - 3),
                res;

            if(otherNumbers != '')
                lastThree = ',' + lastThree;

            res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            return res;
        };
        this.convertIntoInteger = function(number, base) {
            base = angular.isDefined(base) ? base : 10;
            return parseInt(number, base);
        };
        this.getInnerValue = function(model, key, innerKey, defaultValue) {
            return (angular.isDefined(model) && model
            && angular.isDefined(model[key]) && model[key] != null
            && angular.isDefined(model[key][innerKey]) && model[key][innerKey] != null)
                ? model[key][innerKey] : (angular.isDefined(defaultValue) ? defaultValue : null);
        };
        this.buildTmplConstantObject = function(key) {
            var constant = {
                type: TEMPLATE_BUILDER.map[key].type,
                refUrl: TEMPLATE_BUILDER.map[key].refUrl,
                title: TEMPLATE_BUILDER.map[key].title,
                module: TEMPLATE_BUILDER.map[key].module
            };
            if(TEMPLATE_BUILDER.map[key].moduleName){
                constant.moduleName = TEMPLATE_BUILDER.map[key].moduleName;
            }
            return constant;
        };
        this.resetForm = function(form) {
            if(angular.isDefined(form)){
                form.$setUntouched();
                form.$setPristine();
            }
        };
        this.leadingZeros = function(num, size) {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        };
        this.buildMonthList = function() {
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        };

        this.getDaysInMonth = function(month, year) {
            var date = new Date(year, month, 1);
            var days = [];
            while (date.getMonth() === month) {
              days.push(date.getDate());
              date.setDate(date.getDate() + 1);
            }
            return days;
          }
        this.buildQuarterList = function() {
            return ['Quarter1', 'Quarter2', 'Quarter3', 'Quarter4'];
        };
        this.getLastFiveYearList = function(start) {
            var date = new Date(),
                year = date.getFullYear(),
                start = angular.isDefined(start) ? start : (year - 5),
                yearList = [];

            for(var i = year; i > start; i--) {
                yearList.push(i);
            }
            return yearList.reverse();
        };
        this.getLastFiveYearRangeList = function(start) {
            var date = new Date(),
                year = date.getFullYear(),
                start = angular.isDefined(start) ? start : (year - 5),
                yearList = [];

            for(var i = year; i > start; i--) {
                yearList.push(i-1 + " - " + i);
            }
            return yearList.reverse();
        };
        this.commaSeperated = function(input) {
            if(!input) {
                return input;
            }
            input = input.toString();
            var lastThree = input.substring(input.length-3),
                otherNumbers = input.substring(0, input.length-3);

            if(otherNumbers != '')
                lastThree = ',' + lastThree;

            return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        };
        this.getYearList = function(startYear) {
            var date = new Date(),
                currentYear = date.getFullYear(),
                yearList = [];

            for(var i = currentYear; i >= startYear; i--) {
                yearList.push(i);
            }

            return yearList.reverse();
        };
        this.viewDownloadFile = function(download, href, name) {
            download = angular.isDefined(download) ? download : false;
            var link = document.createElement("a");
            download ? link.download = name : link.target = "_blank";
            link.href = href;
            link.click();
        };
        this.getTwoDaysDiff = function(date1,date2){
            var oneDay = 24 * 60 * 60 * 1000;
            var diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / (oneDay)));
            return diffDays;
        };
        this.setCookie = function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        };
        this.getCookie = function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length,c.length);
                }
            }
            return "";
        };
        this.intersect = function (a, b) {
            var t;
            if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
            return a.filter(function (e) {
                if (b.indexOf(e) !== -1) return true;
            });
        };
        this.getBrowser = function() {
            var nVer = navigator.appVersion,
                nAgt = navigator.userAgent,
                browserName = navigator.appName,
                fullVersion = ''+parseFloat(navigator.appVersion),
                majorVersion = parseInt(navigator.appVersion,10),
                nameOffset, verOffset, ix;

            if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
                // In Opera 15+, the true version is after "OPR/"
                browserName = "Opera";
                fullVersion = nAgt.substring(verOffset+4);
            } else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
                // In older Opera, the true version is after "Opera" or after "Version"
                browserName = "Opera";
                fullVersion = nAgt.substring(verOffset+6);
                if ((verOffset=nAgt.indexOf("Version"))!=-1)
                    fullVersion = nAgt.substring(verOffset+8);
            } else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
                // In MSIE, the true version is after "MSIE" in userAgent
                browserName = "Microsoft Internet Explorer";
                fullVersion = nAgt.substring(verOffset+5);
            } else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
                // In Chrome, the true version is after "Chrome" 
                browserName = "Chrome";
                fullVersion = nAgt.substring(verOffset+7);
            } else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
                // In Safari, the true version is after "Safari" or after "Version"
                browserName = "Safari";
                fullVersion = nAgt.substring(verOffset+7);
                if ((verOffset=nAgt.indexOf("Version"))!=-1)
                    fullVersion = nAgt.substring(verOffset+8);
            } else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
                // In Firefox, the true version is after "Firefox" 
                browserName = "Firefox";
                fullVersion = nAgt.substring(verOffset+8);
            } else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
                (verOffset=nAgt.lastIndexOf('/')) ) {
                // In most other browsers, "name/version" is at the end of userAgent 
                browserName = nAgt.substring(nameOffset,verOffset);
                fullVersion = nAgt.substring(verOffset+1);
                if (browserName.toLowerCase()==browserName.toUpperCase()) {
                    browserName = navigator.appName;
                }
            }
            // trim the fullVersion string at semicolon/space if present
            if ((ix=fullVersion.indexOf(";"))!=-1)
                fullVersion=fullVersion.substring(0,ix);
            if ((ix=fullVersion.indexOf(" "))!=-1)
                fullVersion=fullVersion.substring(0,ix);

            majorVersion = parseInt(''+fullVersion,10);
            if (isNaN(majorVersion)) {
                fullVersion  = ''+parseFloat(navigator.appVersion);
                majorVersion = parseInt(navigator.appVersion,10);
            }

            return {
                name: browserName,
                version: fullVersion,
                majorVersion: majorVersion,
                appName: navigator.appName,
                userAgent: navigator.userAgent
            };
        };
        this.setReloadOnSearch = function (flag) {
            flag = angular.isDefined(flag) ? flag : false;
            $route.current.$$route.reloadOnSearch = flag;
        };
        this.timeSince = function(timestamp) {
            return moment(new Date(timestamp * 1000)).fromNow()
        };
        this.isSectionUserManagement = function(subtab) {
            var array = ["home", "mandatoryGroups", "profileFields", "documents", "forms"];
            return (array.indexOf(subtab) >= 0);
        };
        this.isSectionRolesPermissions = function(subtab) {
            var array = ["admin", "nonAdmin"];
            return (array.indexOf(subtab) >= 0);
        };
        this.isSectionWorkflow = function(subtab) {
            var array = ["request", "other"];
            return (array.indexOf(subtab) >= 0);
        };
        this.isSectionWorkflowCommunication = function(subtab) {
            var array = ["communication"];
            return (array.indexOf(subtab) >= 0);
        };
        this.isExitClearance = function (subtab){
            var array = ["qandle", "provision", "otherClearance"];
            return (array.indexOf(subtab) >= 0);
        };
        this.isExitSettlement = function (subtab){
            var array = ["fullFinal", "certificates"];
            return (array.indexOf(subtab) >= 0);
        };
        this.isExitFeedback = function (subtab){
            var array = ["interview", "survey"];
            return (array.indexOf(subtab) >= 0);
        };
        this.isSectionNewHirePlan = function(tab) {
            var array = ["newHirePlan"];
            return (array.indexOf(tab) >= 0);
        };
        this.isSectionLetter = function(tab) {
            var array = ["letters"];
            return (array.indexOf(tab) >= 0);
        };
        this.isSectionNewHireManagement = function(tab) {
            var array = ["newHirePlan", "letters", "candidatePortal"];
            return (array.indexOf(tab) >= 0);
        };
        this.isSectionTimeAttendance = function(tab) {
            var array = ["timePlan", "shiftRepository", "reportingMethod", "regulations", "policies"];
            return (array.indexOf(tab) >= 0);
        };
        this.isSectionProvisionManager = function(tab) {
            var array = ["requestView", "provisionView", "employeeView"];
            return (array.indexOf(tab) >= 0);
        };
        this.isSectionHelpdesk = function(tab) {
            var array = ["global", "ticket", "communication"];
            return (array.indexOf(tab) >= 0);
        };
        this.isSectionLeave = function(subtab) {
            var array = ['leaveType', 'holiday', 'communication'];
            return (array.indexOf(subtab) >= 0);
        };
        this.buildAccordionTabObject = function() {
            return {
                company: {
                    userManagement: {
                        tabs: {
                            userIdentification: 0,
                            mandatoryGroups: 1,
                            profileFields: 2,
                            documents: 3,
                            forms: 4
                        },
                        selected: 0
                    },
                    role: {
                        tabs: {
                            admin: 0,
                            nonAdmin: 1
                        },
                        selected: 0
                    },
                    communication: {
                        tabs: {
                            home: 0
                        },
                        selected: 0
                    }
                },
                exitstp: {
                    tabs: {
                        exitOption: 0,
                        selfInitiateExit: 1,
                        clearance: 2,
                        eSepration: 3,
                        exitFeedback: 4,
                        settlement: 5,
                        communication: 6
                    },
                    selected: 1,
                    exitOption: {
                        tabs: {
                            notice: 0,
                            payroll: 1
                        },
                        selected: 0
                    },
                    selfInitiateExit: {
                        tabs: {
                            selfInitiateExit: 0
                        },
                        selected: 0
                    },
                    clearance: {
                        tabs: {
                            qandle: 0,
                            provision: 1,
                            otherClearance: 2
                        },
                        selected: 0
                    },
                    eSepration: {
                        tabs: {
                            eSepration: 0
                        },
                        selected: 0
                    },
                    exitFeedback:{
                        tabs: {
                            interview: 0,
                            survey: 1
                        },
                        selected: 0
                    },
                    settlement:{
                        tabs: {
                            fullFinal: 0,
                            certificates: 1
                        },
                        selected: 0
                    }
                },
                workflow: {
                    forms: {
                        tabs: {
                            request: 0,
                            other: 1
                        },
                        selected: 0
                    }
                },
                prejoin: {
                    tabs: {
                        assProfileFields: 0,
                        letters: 1,
                        candidatePortal: 2,
                        communication: 3
                    },
                    selected: 0
                },
                timeAttendance: {
                    tabs: {
                        timePlan: 0,
                        shiftRepository: 1,
                        reportingMethod: 2,
                        regulations: 3,
                        policies: 4,
                        communication: 5
                    },
                    selected: 0
                },
                helpdesk: {
                    tabs: {
                        global: 0,
                        ticket: 1,
                        communication: 2
                    },
                    selected: 0
                },
                provisionManager: {
                    tabs: {
                        requestView: 0,
                        provisionView: 1,
                        employeeView: 2
                    },
                    selected: 0
                },
                myTeam: {
                    tabs: {
                        overview: 0,
                        attendance: 1,
                        timeoff: 2,
                        provision: 3,
                        compensation: 4,
                        objective: 5,
                        feedback: 6,
                        pip: 7,
                        task: 8,
                        lnd:9,
                        screenshot: 10,
                    },
                    selected: 0
                },
                alert: {
                    tabs: {
                        notification: 0,
                        action: 1,
                    },
                    selected: 0
                },
                publicProfile: {
                    tabs: {
                        about: 0,
                        attendance: 1,
                        timeoff: 2,
                        provision: 3
                    },
                    selected: 0
                },
                leave: {
                    tabs: {
                        leaveType: 0,
                        holiday: 1,
                        communication: 2
                    },
                    selected: 0
                },
                payroll: {
                    tabs: {
                        organizationTax: 0,
                        statutory: 1,
                        compensationHead: 2,
                        compensationPlan: 3,
                        salarySlip: 4,
                        checks: 5
                    },
                    selected: 0,
                    organizationTax: {
                        tabs: {
                            companyInfo: 0,
                            bankAccount: 1,
                            taxInfo: 2,
                            workLocation: 3,
                            legalEntity: 4
                        },
                        selected: 0
                    },
                    statutory: {
                        tabs: {
                            pf: 0,
                            esi: 1,
                            gratuity: 2,
                            edli: 3,
                            lwf: 4,
                            pt: 5,
                            incomeTax: 6,
                            minimumWages: 7,
                            bonus: 8
                        },
                        selected: 0
                    },
                    compensationHead:{
                        tabs: {
                            creditHead: 0,
                            debitHead: 1,
                            grossCtc: 2,
                            noLopImpactComponents: 3,
                            pfComponents: 4,
                            esiComponents: 5,
                            rfaComponents: 6,
                            loanAdvance: 7,
                        },
                        selected: 0
                    }
                },
                performance: {
                    objective: {
                        tabs: {
                            own: 0,
                            team: 1,
                            others: 2
                        },
                        selected: 0
                    },
                    feedback: {
                        tabs: {
                            given: 0,
                            received: 1
                        },
                        selected: 0
                    },
                    selected: 0
                },
                timesheet: {
                    tabs: {
                        dashboard: 0,
                        adminSetup: 1
                    },
                    dashboard: {
                        tabs: {
                            dashboard: 0,
                            listing: 1,
                        },
                        selected: 0
                    },
                    adminSetup: {
                        tabs: {
                            details: 0,
                            assignEmployees: 1,
                            budgetBreakdown: 2,
                            approver: 3
                        },
                        selected: 0
                    },
                    selected: 1
                },
                recruitment: {
                    tabs: {
                        dashboard: 0,
                        adminView: 1
                    },
                    adminView: {
                        tabs: {
                            cadndidate: 0,
                            analytics: 1,
                            jobs: 2
                        },
                        selected: 1
                    },
                    selected: 1
                }
            };
        };

        /**
         * @param files array of object: each object represent a file in zip
         * @example
         *      files = [
         *          {
         *              name: 'abc.csv',
         *              data: [Array] // in case of csv files data should be Array of Array
         *          },
         *          {
         *              name: 'abc.txt',
         *              data: String // in case of txt file data should be string
         *          }
         *      ]
         * @param zipFileName string: the name of zip file that will be downloaded
         */
        this.exportToZip = function(files, zipFileName) {
            if(files instanceof Array) {
                zipFileName = zipFileName || 'download';
                var zip = new JSZip();
                for(var i = 0, len = files.length; i<len; i++) {
                    var data = this.getValue(files[i], 'data');
                    var file = angular.isArray(data) ? this.buildCSVFile(data) : data;
                    zip.file(this.getValue(files[i], 'name'), file);
                }
                zip.generateAsync({
                    type: "base64"
                }).then(function(content) {
                    var url = "data:application/zip;base64," + content;
                    var link = document.createElement("a");
                    if (link.download !== undefined) { // feature detection. Browsers that support HTML5 download attribute
                        link.setAttribute("href", url);
                        link.setAttribute("download", zipFileName);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                });
            }
        }

        this.exportToExcel = function (rows, filename) {
            var worksheet1 = XLSX.utils.aoa_to_sheet(rows);
            var workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet1, 'Worksheet1');
            var excelFile = XLSX.write(workbook, {bookType:'xlsx', type:'binary' } );

            var stringToArrayBuffer = function(s) {
                var buffer = new ArrayBuffer(s.length);
                var bufferView = new Uint8Array(buffer);
                for (var i=0; i!=s.length; ++i) {
                    bufferView[i] = s.charCodeAt(i) & 0xFF;
                }
                return buffer;
            }

            var blob = new Blob([stringToArrayBuffer(excelFile)], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
            );


            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }

        };

        this.exportToCsv = function(rows, filename) {
            var processRow = function (row) {
                var finalVal = '';
                for (var j = 0; j < row.length; j++) {
                    var innerValue = row[j] === null ? '' : row[j].toString();
                    if (row[j] instanceof Date) {
                        innerValue = row[j].toLocaleString();
                    };
                    var result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0)
                        result = '"' + result + '"';
                    if (j > 0)
                        finalVal += ',';
                    finalVal += result;
                }
                return finalVal + '\n';
            };

            var csvFile = '';
            for (var i = 0; i < rows.length; i++) {
                csvFile += processRow(rows[i]);
            }

            var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
            
            // This code has been added in order to export as excel file also
            this.exportToExcel(rows, filename.split('.')[0] + '.xlsx');
        };

        this.exportToExcel = function (rows, filename) {
            var worksheet1 = XLSX.utils.aoa_to_sheet(rows);
            var workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet1, 'Worksheet1');
            var excelFile = XLSX.write(workbook, {bookType:'xlsx', type:'binary' } );

            var stringToArrayBuffer = function(s) {
                var buffer = new ArrayBuffer(s.length);
                var bufferView = new Uint8Array(buffer);
                for (var i=0; i!=s.length; ++i) {
                    bufferView[i] = s.charCodeAt(i) & 0xFF;
                }
                return buffer;
            }

            var blob = new Blob([stringToArrayBuffer(excelFile)], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
            );


            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }

        }


        this.exportToText = function (text, filename) {
            var blob = new Blob([text], {type: 'text/plain;charset=utf-8;'});
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        };
        this.range = function (min, max) {
            var input = [],
                min = parseInt(min), //Make string input int
                max = parseInt(max);
            var loopLength = Math.floor(max / 10);
            if(max % 10 != 0){
                loopLength += 1;
            }
            for (var i = min; i <= loopLength; i++)
            {
//              if(i % 10 == 0)
                input.push(i * 10);
            }
            return input;
        };
        this.buildPaginationObject = function(pageName,maxRange) {
//            if(angular.isDefined(maxRange)){
//                maxRange = maxRange < 10 ? 10 : maxRange;
//            }else{
            maxRange = 100;
//            }
            var self = this;
            var obj =  {
                pagination : {
                    currentPage : 1,
                    numPerPage : 10,
                    maxSize : 5,
                    range : self.range(1, maxRange)
                }
            };
            obj.pagination[pageName+"_np"] = 10;
            obj.pagination[pageName+"_cp"] = 1;
            return obj;
        };
        this.dynamicSort = function(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        };
        this.convertTimeInStandardForms = function(time) {
            if(time){
                if(angular.isDefined(time.getHours()) && angular.isDefined(time.getMinutes())){
                    return time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
                }
            }
        };
        this.multiSort = function() {
            var fields = [].slice.call(arguments),
                n_fields = fields.length;

            return function(A, B) {
                var a, b, field, key, primer, reverse, result;
                for (var i = 0, l = n_fields; i < l; i++) {
                    result = 0;
                    field = fields[i];

                    key = typeof field === 'string' ? field : field.name;

                    a = A[key];
                    b = B[key];

                    if (typeof field.primer !== 'undefined') {
                        a = field.primer(a);
                        b = field.primer(b);
                    }

                    reverse = (field.reverse) ? -1 : 1;

                    if (a < b) result = reverse * -1;
                    if (a > b) result = reverse * 1;
                    if (result !== 0) break;
                }
                return result;
            }
        };
        this.dynamicSortMultiple = function () {
            var props = arguments,
                self = this;

            return function (obj1, obj2) {
                var i = 0, result = 0, numberOfProperties = props.length;
                while(result === 0 && i < numberOfProperties) {
                    result = self.dynamicSort(props[i])(obj1, obj2);
                    i++;
                }
                return result;
            }
        };
        this.buildObjectSetupModule = function() {
            return {
                setup_view_company_setup: 1,
                setup_view_workflow: 2,
                setup_view_nhm: 3,
                setup_view_lms: 4,
                setup_view_time_attendance: 5,
                setup_view_provision: 6,
                setup_view_people: 7,
                setup_view_helpdesk: 8,
                setup_view_payroll: 9,
                setup_view_exit: 10
            }
        };
        this.getActiveModuleSetupCount = function(list) {
            var count = -1;
            angular.forEach(list, function(value, key) {
                if(value) {
                    count++;
                }
            });
            return count;
        };
        var resetModuleSequence = function(sequence, sequenceList) {
            angular.forEach(sequenceList, function(value, key){
                if(value >= sequence) {
                    sequenceList[key] = sequenceList[key] -1;
                }
            });
        };
        this.resetSetupModuleSequence = function(moduleList, sequenceList) {
            angular.forEach(moduleList, function(value, key){
                if(!value) {
                    resetModuleSequence(sequenceList[key], sequenceList);
                }
            });
        };
        this.buildColorObject = function() {
            return {
                sick_leave: {
                    code: '#68a5dc',
                    class: 'sick_leave'
                },
                paid_leave: {
                    code: '#6ed56d',
                    class: 'paid_leave'
                },
                casual_leave: {
                    code: '#70cce1',
                    class: 'casual_leave'
                },
                leave_without_pay: {
                    code: '#ff5659',
                    class: 'leave_without_pay'
                },
                maternity_leave: {
                    code: '#c0e073',
                    class: 'maternity_leave'
                },
                paternity_leave: {
                    code: '#feff7b',
                    class: 'paternity_leave'
                },
                adoption_leave: {
                    code: '#fede91',
                    class: 'adoption_leave'
                },
                sabbatical_leave: {
                    code: '#ffc784',
                    class: 'sabbatical_leave'
                },
                transfer_leave: {
                    code: '#ffad85',
                    class: 'transfer_leave'
                },
                exception_leave: {
                    code: '#e36fb6',
                    class: 'exception_leave'
                },
                floater_leave: {
                    code: '#a966cf',
                    class: 'floater_leave'
                },
                privileged_leave: {
                    code: '#6b74d3',
                    class: 'privileged_leave'
                },
                quarantine_leave: {
                    code: '#6dbad6',
                    class: 'quarantine_leave'
                },
                marriage_leave: {
                    code: '#6bdba9',
                    class: 'marriage_leave'
                },
                anniversary_leave: {
                    code: '#a0da76',
                    class: 'anniversary_leave'
                },
                birthday_leave: {
                    code: '#dff179',
                    class: 'birthday_leave'
                },
                half_paid_leave: {
                    code: '#fff081',
                    class: 'half_Paid_leave'
                },
                other_leave: {
                    code: '#007ee5',
                    class: 'other_leave'
                },
                consolidated_leave: {
                    code: '#fed480',
                    class: 'consolidated_leave'
                },
                earned_leave: {
                    code: '#f9bd81',
                    class: 'earned_leave'
                },
                short_leave: {
                    code: '#fff081',
                    class: 'half_Paid_leave'
                },
                short: {
                    code: '#fff081',
                    class: 'half_Paid_leave'
                },
                ntlt: {
                    code: '#dff179',
                    class: 'birthday_leave'
                },
                htak: {
                    code: '#6bdba9',
                    class: 'marriage_leave'
                },
                compensatory_off: {
                    code: '#e36fb6',
                    class: 'exception_leave'
                },
                hourly_leave: {
                    code: '#ffad85',
                    class: 'transfer_leave'
                },
                not_available_leave: {
                    code: '#CCCCCC',
                    class: 'other_leave'
                },
                admin_leave: {
                    code: '#a966cf',
                    class: 'floater_leave'
                },
                admin: {
                    code: '#a966cf',
                    class: 'floater_leave'
                }
            }
        };
        this.buildCompuationGraphData = function(item) {
            var graph = [];
            if(item.total_employee) {
                graph.push(item.total_employee);
                graph.push(item.computed);
                graph.push(item.finalized);
                graph.push(item.paid);
                graph.push(item.paid);
            }
            return graph;
        };
        this.buildCompuationGraphCategoryData = function() {
            return ['To Be Computed', 'Computed', 'Finalized', 'Paid', ''];
        };
        this.getCurrentYear = function() {
            var date = new Date(),
                year = date.getFullYear();

            return year;
        };
        this.getCurrentMonth = function() {
            var date = new Date(),
                month = date.getMonth() + 1;

            return month;
        };
        this.findProperty = function (obj, key, out) {
            var i,
                proto = Object.prototype,
                ts = proto.toString,
                hasOwn = proto.hasOwnProperty.bind(obj);

            if ('[object Array]' !== ts.call(out)) out = [];

            for (i in obj) {
                if (hasOwn(i)) {
                    //if (i === key && typeof obj[key] === "boolean") {
                    if (typeof obj[key] === "object" && obj[key].status === true) {
                        out.push(obj[i]);
                    } else if ('[object Array]' === ts.call(obj[i]) || '[object Object]' === ts.call(obj[i])) {
                        self.findProperty(obj[i], key, out);
                    }
                }
            }

            return out;
        };
        this.getWeekDay = function(date) {
            var d = new Date(date),
                weekDay = d.getDay();

            return weekDay;
        };
        this.decodeHTMLEntities = function(str) {
            var element = document.createElement('div');
            if(str && typeof str === 'string') {
                // strip script/html tags
                str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
                str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
                element.innerHTML = str;
                str = element.textContent;
                element.textContent = '';
            }
            return str;
        };
        this.extractFirstName = function(fullname) {
            var firstName = null;

            if(fullname) {
                var arrFullName = fullname.split(' ');
                firstName = angular.isDefined(arrFullName[0]) ? arrFullName[0] : null;
            }

            return firstName;
        };
        this.convertReportDateFormat = function(dateString) {
            return $filter('date')(new Date(this.changeDateFormat(dateString)), 'dd-MMM-yyyy');
        };
        this.getCurrentDay = function() {
            var date = new Date(),
                day = date.getDate();

            return day;
        };
        this.getFinancialYearList = function(startYear, currentYear) {
            var date = new Date(),
                currentYear = angular.isDefined(currentYear) ? currentYear : date.getFullYear(),
                currentMonth = this.getCurrentMonth(),
                yearList = [];

            for(var i = currentYear; i >= startYear; i--) {
                if(i > startYear && currentMonth < self.startMonth && i == this.getCurrentYear()) {
                    continue;
                }
                yearList.push(i);
            }

            return yearList.reverse();
        };

        this.getKeyByValue = function (object, value) {
            return Object.keys(object).find(function (key) {
                return object[key] === value;
            });
        };
        this.buildFileSizeObject = function (envMnt) {
            //size in mb
            var fileSizeObj = {
                prod4: {
                    size: 2,
                    unit: 'MB',
                    text: '2MB'
                }
            };
            if (fileSizeObj[envMnt]) {
                return fileSizeObj[envMnt]
            } else {
                return {
                    size: 2,
                    unit: 'MB',
                    text: '2MB'
                };
            }
        };
        this.validateFileSize = function (file, sizeObj){
            var isNotValid = false;
            if(sizeObj){
                if(sizeObj.unit == "MB"){
                    isNotValid = ((file.size/1000000) > sizeObj.size);
                }
            }
            return isNotValid;
        };
        this.buildDaysMappingObject = function() {
            return {
                1: "Hours",
                2: "Days",
                3: "Weeks",
                4: "Months"
            }
        };
        this.getCurrentAssessmentYear = function () {
            var currMonth = this.getCurrentMonth(),
                currYear = this.getCurrentYear(),
                year = currMonth <= 3 ? currYear - 1 : currYear;

            return year;
        };
        this.buildEmployeeStatusHashMap = function() {
            return {
                1: 'Pending',
                2: 'On Probation',
                3: 'Confirmed',
                4: 'Not Joining',
                5: 'Exit Initiated',
                6: 'Terminated',
                7: 'Relieved',
                8: 'Absconding'
            }
        };
        this.buildApproverStatusHashMap = function() {
            return {
                1: "Pending",
                2: "Cancel",
                3: "Approved",
                4: "Request For Cancle",
                5: "Request To Modify",
                6: "Accelerate Request",
                7: "Accelerated",
                8: "Approved By Admin",
                9: "Rejected By Admin",
                10: "Approved By Approver",
                11: "Rejected By Approver",
                12: "Approved By Team leader",
                13: "Rejected By Team leader",
                14: "Rejected",
                15: "Cancel Request",
                16: "Escalated",
                17: "Disbursed"
            }
        };
        this.getCurrencyList = function() {
            var currencyObject = this.getStorageValue('currency-list');

            return currencyObject ? JSON.parse(currencyObject) : null;
        };
        this.setCurrencyList = function(data) {
            this.setStorageValue('currency-list', JSON.stringify(data));
        };
        this.excludeEmployeeFromList = function(list, employeeId) {
            var excludedList = [];

            angular.forEach(list, function(value, key) {
                if(value.full_name && value._id !== employeeId) {
                    excludedList.push(value);
                }
            });

            return excludedList;
        };
        this.loadChipList = function (list) {
            return list.map(function (c, index) {
                var object = {
                    id: c._id,
                    name: c.full_name || null,
                    code: c.employee_code || null,
                    image: c.profile_pic || 'images/no-avatar.png'
                };
                object._lowername = self.getValue(object, 'name') ? object.name.toLowerCase() : null;

                return object;
            });
        };
        this.extractIds = function(list) {
            var ids = [];
            angular.forEach(list, function(value, key) {
                ids.push(value.id);
            });
            return ids;
        };

        /*** Start: Permissions Related Methods ***/
        var hasRequestedPermissionInList = function(list, permissionName) {
            var isGiven = false;

            angular.forEach(list, function(value, key) {
                if(!isGiven && value.permission_slug === permissionName) {
                    isGiven = true;
                }
            });

            return isGiven;
        };
        this.extractReportFromPermissionList = function(data) {
            angular.forEach(data.data, function(value, key) {
                value._id = angular.isObject(value._id) ? value._id.$id : value._id;
                if(value.permission_slug.indexOf('report') >= 0) {
                    data.data.splice(key, 1);
                }
            });
        };
        /*** End: Permissions Related Methods ***/

        this.stringToBooleanConversion = function(s) {
            // will match one and only one of the string 'true','1', or 'on' rerardless
            // of capitalization and regardless off surrounding white-space.
            var regex=/^\s*(true|1|on)\s*$/i

            return regex.test(s);
        };
        this.getPreviousMondayDate = function() {
            var prevMonday = new Date();
            prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);

            return prevMonday;
        };
        this.getDateAfter7Days = function(date) {
            return date.setDate(date.getDate() + date.getDay() + 5);
        };
        this.getDefaultStartEndDate = function() {
            var prevMonday = this.getPreviousMondayDate(),
                dateObject = {
                    startDate: null,
                    endDate: null
                };

            dateObject.startDate = new Date(prevMonday);
            dateObject.endDate = new Date(this.getDateAfter7Days(prevMonday));

            return dateObject;
        };
        this.getMonthStartEndDate = function () {
            var date = new Date(), y = date.getFullYear(), m = date.getMonth();

            return {
                startDate: new Date(y, m, 1),
                endDate: new Date(y, m + 1, 0)
            };
        };
        this.getCurrentAndOneMonthPreviousDate = function () {
            var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();

            return {
                startDate: new Date(y, m-1, d+1),
                endDate: new Date(y, m, d)
            };
        };
        this.makeFirstCharacterCapitalize = function(string) {
            string = string.split(" ");
            for (var i = 0, x = string.length; i < x; i++) {
                string[i] = string[i][0].toUpperCase() + string[i].substr(1);
            }

            return string.join(" ");
        };
        this.buildFormSubmittedObject = function() {
            return {
                appraisalAnswer: false,
                nomination: false,
                peerSelection: false,
                requestLeave: false,
                regularizeRequest: false,
                createUser: false,
                createCandidate: false,
                birthdayAnniversary: false,
                claim: false,
                sendReminder: false,
                raiseRequest: false,
                deliverable: false,
                addEmployee: false,
                startPIP: false,
                rejectRequest: false,
                stopPIP: false,
                deliverableStatus: false,
                pipAction: false,
                additionalProfileFields: false,
                downloadReport: false,
                viewForm: false,
                adminResetPassword: false,
                hraLandlord: false,
                advanceRequest: false,
                amountDeclared: false,
                investmentHead: false,
                approveReject: false,
                bulkDownloadFnf: false,
                bulkInitiateFnf: false,
                onBehalfSettlement: false,
                settleBalanceAmount: false,
                sadminResetPassword: false
            }
        };
        this.addDays = function(date, minLeaveDays) {
            minLeaveDays = angular.isDefined(minLeaveDays) ? minLeaveDays : 1;
            /* This condition has been introduced because we have set min leave duration as 180 days
             for maternity leave */
            if (minLeaveDays == 180) {
                minLeaveDays = parseInt(minLeaveDays, 10) + 2;
            }

            /* NOTE: Here minLeaveDays has been subtracted by 1 because while calculating number of days
             it will inclucde both from and to date, so it will calculate number of days leave
             as (expected + 1) always */
            minLeaveDays = minLeaveDays > 1 ? minLeaveDays - 1 : minLeaveDays;

            var result = new Date(date);
            result.setDate(result.getDate() + minLeaveDays);

            return result;
        };
        this.buildModalInstanceObject = function () {
            return {
                comment: null,
                regularizationPolicies:null,
                regularizationRequest:null,
                changeManagement: null,
                questionAnswerForm: null,
                addEditRole: null,
                nominateLndTeam:null,
                requestLndAction:null,
                lndDetailsEmp:null,
                lndDetailsTeam:null,
                lndDetailsAdmin:null,
                lndAdminCertificateAssign:null,
                lndFeedbackForm:null,
                lndDetailsSetup:null,
                errorUploadMarksLnd:null,
                marksPreviewLnd:null,
                attendancePreviewLnd:null,
                lndEmployeeFeedback:null,
                viewLndAttendees:null,
                addExistingLndTemplate:null,
                deleteRole: null,
                addEditForm: null,
                addEditCertificate: null,
                addEditDocument: null,
                addEditGroup: null,
                deleteGroup: null,
                disableAdvance:null,
                loanReq:null,
                createPerformenceReviewTemplate: null,
                reviewCycleTimeline: null,
                removeReviewCycleSelfEval: null,
                repeatShiftCycle: null,
                payrollPlan: null,
                payrollFormula: null,
                payrollFrequency: null,
                noDues: null,
                clearanceDetails: null,
                reportSpam: null,
                mngrAssetRequest: null,
                mngrLndRequest: null,
                requestLeave:null,
                alertMessage: null,
                krListing: null,
                viewExpenseReceipt: null,
                hra: null,
                addEditClaim: null,
                deleteKR: null,
                monthlySalary: null,
                fndDetails: null,
                developmentPlan: null,
                actionEmployeeClaim: null,
                newRejectionReason: null,
                requisition:null,
                newJobPopup: null,
                mandGroupField:null,
                interviewStage:null,
                scorecard:null,
                assignOfferLetter: null,
                requestForm:null,
                triggerLetter: null,
                assignBulkLetter: null,
                referCandidates: null,
                slip: null,
                payrolLogo: null,
                traveAdmin:null,
                userManageEffectiveDate: null,
                profileField: null,
                completeTimesheet: null,
                assignEmployee: null,
                viewDetails: null,
                teamGoalCompetency: null,
                copyTemplate: null,
                promotionRecommendation: null,
                midTermAppraisalComment: null,
                attendance: null,
                previewCSV: null,
                ticket: null,
                copyCycle: null,
                individualTimeline: null,
                overwriteRating: null,
                editAssetAttributeValue: null,
                editTrainingAttributeValue:null,
                assignManagerFollower: null,
                viewReviewerDetails: null,
                bulkUploadError: null,
                payrollLegalEntity: null,
                cropLogo: null,
                deleteError: null,
                approveReject: null,
                eligibility: null,
                changeAmount: null,
                billDetails: null,
                reason: null,
                breakupEffective: null,
                raisePIPRequest: null,
                viewPIPRequest: null,
                rejectPIPReason: null,
                approvePIPRequest: null,
                assignPIPDeliverable: null,
                updatePIPDeliverableStatus: null,
                stopPIP: null,
                ctcBreakup: null,
                termsConditions: null,
                report: null,
                videoPlayer: null,
                googleCalanderSync : null,
                adminResetPassword: null,
                sadminResetPassword: null,
                viewApproverChain: null,
                uploadFnf: null,
                modifyApprove: null,
                pendingRequest: null,
                fnfHistory: null,
                assetAttributes: null,
                markDone: null,
                approverChain: null,
                bulkLeave: null,
                previewBulkLeaveCSV: null,
                multipleHead: null,
                screenshotsTeamCarousel:null,
                screenshotsIndividualCarousel:null,
                childProcessListing:null,
                productivityComparison:null,
                updateScreenshotTimeZone:null,
                childProcessListingEmp:null,
                screenshotsEmployeeCarousel:null,
                onBehalfSettlement: null,
                categoryWiseRequest: null,
                employeeAdvanceRequest: null,
                compareTax: null,
                taskStatus: null,
                addAssignTask: null,
                importantPoints: null,
                surveyForm: null,
                pollSetupName:null,
                surveySetupName:null,
                adminSurveyResponses:null,
                rejectionComment: null,
                addNewCandidate:null,
                addEmployeeInCycle: null,
                assignViewAssessment: null
            };
        };
        this.buildValidateResetTokenObject = function () {
            return {
                expired: false,
                message: null
            };
        };
        this.buildLoginCustomizedObject = function () {
            return {
                background: isLoginCustomized('background'),
                bgImgClass: isLoginCustomized('bgImgClass') ? isLoginCustomized('bgImgClass') : 'bgimg',
                logo: isLoginCustomized('logo'),
                logoClass: isLoginCustomized('logoClass'),
                outsideTop: isLoginCustomized('outsideTop'),
                outsideBottom: isLoginCustomized('outsideBottom'),
                insideTop: isLoginCustomized('insideTop'),
                insideBottom: isLoginCustomized('insideBottom')
            };
        };
        this.buildDashboardCustomizedObject = function () {
            return {
                content: isDashboardCustomized()
            };
        };
        this.extractGoalCompetencyPayloadData = function(overview) {
            var data = [];

            angular.forEach(overview.goalCompetencyList, function(value, key) {
                if(value.text) {
                    var object = {
                        text: value.text,
                        description: value.description,
                        header: value.header
                    }
                    if (overview.enableWeightage) {
                        object.weightage = value.weightage;
                    }

                    data.push(object);
                }
            });

            return data;
        };
        this.buildGoalCompetencyPayload = function(overview) {
            return {
                data: this.extractGoalCompetencyPayloadData(overview)
            }
        };
        this.rebuildReviewerNameForRelationship = function (reviewerName, cycleId) {
            if (cycleId && this.getStorageValue('enable_other_relations_' + cycleId)) {
                var otherRelations = this.getStorageValue('other_relations_' + cycleId);
                otherRelations = JSON.parse(otherRelations);

                angular.forEach(otherRelations, function(relationName, relationKey) {
                    reviewerName[relationKey] = relationName;
                });
            }
        };
        this.setOtherRelationsWithinStorage = function (cycleId, otherRelations) {
            this.setStorageValue('enable_other_relations_' + cycleId, otherRelations.enabled);
            this.setStorageValue('other_relations_' + cycleId, JSON.stringify(otherRelations.object));
        };
        this.buildOtherRelationsObject = function (list) {
            var object = {};

            angular.forEach(list, function (value, key) {
                object[value.key] = value.name;
            });

            return object;
        };
        this.rebuildUplineDownlineMappingForRelationship = function (object, cycleId) {
            if (cycleId && this.getStorageValue('enable_other_relations_' + cycleId)) {
                var otherRelations = this.getStorageValue('other_relations_' + cycleId);
                otherRelations = JSON.parse(otherRelations);

                angular.forEach(otherRelations, function(relationName, relationKey) {
                    object[relationKey] = (relationKey.indexOf('_team') >= 0)
                        ? 'Downline' : 'Upline';
                });
            }
        };
        this.rebuildFilterObjectForRelationship = function (relationFilterList, cycleId) {
            if (cycleId && this.getStorageValue('enable_other_relations_' + cycleId)) {
                var otherRelations = this.getStorageValue('other_relations_' + cycleId);
                otherRelations = JSON.parse(otherRelations);

                angular.forEach(otherRelations, function(relationName, relationKey) {
                    relationFilterList.push({
                        key: relationKey,
                        value: relationName
                    });
                });
            }
        };
        this.rebuildReviewerHeadingForRelationship = function (object, cycleId) {
            if (cycleId && this.getStorageValue('enable_other_relations_' + cycleId)) {
                var otherRelations = this.getStorageValue('other_relations_' + cycleId);
                otherRelations = JSON.parse(otherRelations);

                angular.forEach(otherRelations, function(relationName, relationKey) {
                    object['reviewers_' + relationKey] = relationName + ' Reviewer';
                });
            }
        };
        this.rebuildReverseMappingForRelationship = function (object, cycleId) {
            if (cycleId && this.getStorageValue('enable_other_relations_' + cycleId)) {
                var otherRelations = this.getStorageValue('other_relations_' + cycleId);
                otherRelations = JSON.parse(otherRelations);

                angular.forEach(otherRelations, function(relationName, relationKey) {
                    object['reviewers_' + relationKey] = relationKey;
                });
            }
        };
        this.convertDateFormatToArray = function (date) {
            var day = date.getDate(),
                month = date.getMonth() + 1,
                year = date.getFullYear(),
                dateArray = [];

            dateArray.push(year);
            dateArray.push(month);
            dateArray.push(day);

            return dateArray;
        };
        this.calculateTenureUsingMoment = function (tenureDate) {
            var currentDateArray = this.convertDateFormatToArray(new Date()),
                tenureDateArray = this.convertDateFormatToArray(tenureDate),
                a = moment(currentDateArray),
                b = moment(tenureDateArray);

            var years = a.diff(b, 'year');
            b.add(years, 'years');

            var months = a.diff(b, 'months');
            b.add(months, 'months');

            var days = a.diff(b, 'days');

            var strTenure = "";
            if (years) {
                strTenure+= years + ' Years ';
            }
            if (months) {
                strTenure+= months + ' Months ';
            }
            if (days) {
                strTenure+= days + ' Days ';
            }

            return strTenure;
        };

        this.changeTimesheetMinutesFormat = function (mins) {
            mins = parseInt(mins, 10);
            return (mins > 0) ? mins/60 : 0;
        };
        this.changeTimesheetFormat = function (totalTimeString) {
            if (!totalTimeString) {
                return totalTimeString;
            }

            var totalTime = null,
                formattedTime = null,
                totalTimeArray = new Array(),
                hrs = 0,
                mins = 0;

            totalTime = totalTimeString.split("h").join("");
            totalTime = totalTime.split("m").join("");
            totalTimeArray = totalTime.split(" ");

            if (angular.isDefined(totalTimeArray[0]) && angular.isDefined(totalTimeArray[1])) {
                hrs = parseInt(totalTimeArray[0], 10);
                mins = this.changeTimesheetMinutesFormat(totalTimeArray[1]);
            } else if (angular.isDefined(totalTimeArray[0]) && angular.isUndefined(totalTimeArray[1])) {
                hrs = parseInt(totalTimeArray[0], 10);
            } else if (angular.isUndefined(totalTimeArray[0]) && angular.isDefined(totalTimeArray[1])) {
                mins = this.changeTimesheetMinutesFormat(totalTimeArray[1]);
            }

            formattedTime = (hrs + mins) > 0 ? (hrs + mins).toFixed(2) : 0;

            return formattedTime;
        };
        this.getMonthLastDate = function(y, m){
            return new Date(y, m , 0).getDate();
        };
        this.getDateAfterSpecificMonths = function (months) {
            months = months || 6;
            var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();

            return new Date(y, m + months, d-1);
        };
        this.getDateBeforeSpecificMonths = function (dateString, months) {
            months = months || 1;

            var date = new Date(this.changeDateFormat(dateString)),
                y = date.getFullYear(), m = date.getMonth(), d = date.getDate();

            return new Date(y, m - months, d + 1);
        };
        this.buildLoginViaEmployeeCode = function() {
            return {
                enabled: typeof config[envMnt].isLoginViaEmployeeCode != "undefined"
                && config[envMnt].isLoginViaEmployeeCode.enabled
            }
        };
        this.getCurrentDate = function () {
            var date = new Date();

            return date.getDate();
        };
        this.setFilterStatusKey = function (value) {
            var status = parseInt(value.status, 10);

            value.filter_status = self.rejectedStatusArray.indexOf(status) >= 0 ? 2
                : (self.approvedStatusArray.indexOf(status) >= 0
                ? 3 : (value.status == 15 ? 4 : 1));
        };
        this.setClaimMonthKey = function (value) {
            var claimDate = self.getValue(value, 'claim_date'),
                dateArray = claimDate.split('/');

            value.claim_month = parseInt(dateArray[1], 10);
        };
        this.setClaimYearKey = function (value) {
            var claimDate = self.getValue(value, 'claim_date'),
                dateArray = claimDate.split('/');

            value.claim_year = parseInt(dateArray[2], 10);
        };
        this.buildMonthObject = function() {
            return {
                1: "Jan",
                2: "Feb",
                3: "Mar",
                4: "Apr",
                5: "May",
                6: "Jun",
                7: "July",
                8: "Aug",
                9: "Sep",
                10: "Oct",
                11: "Nov",
                12: "Dec"
            }
        };
        this.getCurrentFinancialYear = function () {
            var year = parseInt(this.getCurrentYear(), 10),
                month = parseInt(this.getCurrentMonth(), 10),
                monthList = [1, 2, 3],
                financialYear = {
                    start: null,
                    end: null
                };

            if (monthList.indexOf(month) >= 0) {
                financialYear.end = year;
                financialYear.start = --year;
            } else {
                financialYear.start = year;
                financialYear.end = ++year;
            }

            return financialYear;
        };
        this.convertStringEmailToArray = function (strEmails) {
            var emails = [],
                nonNullableEmails = [],
                delimeter = ',';

            if (!strEmails) {
                return nonNullableEmails;
            } else if (strEmails && strEmails.indexOf(delimeter) >= 0) {
                emails = strEmails.split(delimeter);
                angular.forEach(emails, function (email, index) {
                    if (email && email.trim()) {
                        nonNullableEmails.push(email.trim());
                    }
                });
            } else {
                nonNullableEmails.push(strEmails);
            }

            return nonNullableEmails;
        };
        /*** Start: Building CSV FILE Content ***/
        this.buildCSVFile = function(rows) {
            var processRow = function (row) {
                var finalVal = '';
                for (var j = 0; j < row.length; j++) {
                    var innerValue = row[j] === null ? '' : row[j].toString();
                    if (row[j] instanceof Date) {
                        innerValue = row[j].toLocaleString();
                    };
                    var result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0)
                        result = '"' + result + '"';
                    if (j > 0)
                        finalVal += ',';
                    finalVal += result;
                }
                return finalVal + '\n';
            };
            var csvFile = '';
            for (var i = 0; i < rows.length; i++) {
                csvFile += processRow(rows[i]);
            }

            return csvFile;
        };
        /*** End: Building CSV FILE Content ***/
        this.buildHelpVideoObject = function () {
            return {
                linkVisible: true,
                linkText: 'How to use this section?',
                mandatoryGroupLinkText: 'How to add a mandatory group?',
                newJobRequisitionLinkText: 'How to use new job requisition',
                recruitmentExtCandidateText: 'How will external candidates apply',
                recruitmentInternalCandidateText: 'How will internal candidates apply',
                currentModule: null,
                linkUrl: null,
                module: {
                    timesheetSetup: {
                        link: null,
                        visible: false
                    },
                    timesheetCreator: {
                        link: null,
                        visible: true
                    },
                    timesheet: {
                        link: 'https://player.vimeo.com/video/533862344',
                        visible: true
                    },
                    team: {
                        link: 'https://player.vimeo.com/video/325407524',
                        visible: true
                    },
                    createMandatoryGroupSetup: {
                        link: 'https://player.vimeo.com/video/325390315',
                        visible: true
                    },
                    userManagementIndividual: {
                        link: 'https://player.vimeo.com/video/325390159',
                        visible: true
                    },
                    userManagementBulk: {
                        link: 'https://player.vimeo.com/video/325390159',
                        visible: true
                    },
                    travelExpenseSetupCategoryCreation: {
                        link: 'https://player.vimeo.com/video/325390342',
                        visible: true
                    },
                    travelExpenseEmployeeTravel: {
                        link: 'https://player.vimeo.com/video/325390360',
                        visible: true
                    },
                    travelExpenseEmployeeExpense: {
                        link: 'https://player.vimeo.com/video/325390327',
                        visible: true
                    },
                    travelExpenseAdminTravel: {
                        link: null,
                        visible: false
                    },
                    travelExpenseAdminExpense: {
                        link: 'https://player.vimeo.com/video/325390369',
                        visible: true
                    },
                    shiftPlannerCreatePattern: {
                        link: 'https://player.vimeo.com/video/325390106',
                        visible: true
                    },
                    socialEmbedCode: {
                        link: 'https://player.vimeo.com/video/325390135',
                        visible: true
                    },
                    selfExitInitiateSetup: {
                        link: null,
                        visible: false
                    },
                    newHireManagementSetup: {
                        link: 'https://player.vimeo.com/video/325405980',
                        visible: true
                    },
                    assetSetup: {
                        link: 'https://player.vimeo.com/video/325200918',
                        visible: true
                    },
                    helpdeskSetup: {
                        link: 'https://player.vimeo.com/video/325407555',
                        visible: true
                    },
                    applicantTracking: {
                        link: 'https://player.vimeo.com/video/325390876',
                        visible: true
                    },
                    elcmCreateLetter: {
                        link: null,
                        visible: false
                    },
                    holidayCalendarSetup: {
                        link: 'https://player.vimeo.com/video/325405466',
                        visible: true
                    },
                    careerPageSetup: {
                        link: 'https://player.vimeo.com/video/325390829',
                        visible: true
                    },
                    recruitmentAdmin: {
                        link: 'https://player.vimeo.com/video/325390577',
                        visible: true
                    },
                    recruitmentAdminJob: {
                        link: 'https://player.vimeo.com/video/325390696',
                        visible: true
                    },
                    newJobRequisition: {
                        link: 'https://player.vimeo.com/video/325390757',
                        visible: true
                    },
                    jobPublish: {
                        link: 'https://player.vimeo.com/video/325390643',
                        visible: true
                    },
                    recruitmentInterviews: {
                        link: null,
                        visible: false
                    },
                    recruitmentReferrals: {
                        link: 'https://player.vimeo.com/video/325390554',
                        visible: true
                    },
                    recruitmentIjp: {
                        link: 'https://player.vimeo.com/video/325390861',
                        visible: true
                    },
                    recruitmentExtCandid: {
                        link: 'https://player.vimeo.com/video/325390844',
                        visible: true
                    },
                    okrCreator: {
                        link: 'https://player.vimeo.com/video/325405931',
                        visible: false
                    },
                    createReviewCycleAdmin: {
                        link: null,
                        visible: false
                    },
                    manageReviewCycleAdmin: {
                        link: null,
                        visible: false
                    },
                    listCycleAdmin: {
                        link: null,
                        visible: false
                    },
                    oneOnOneTeam: {
                        link: null,
                        visible: false
                    },
                    oneOnOne: {
                        link: null,
                        visible: false
                    },
                    regularFeedbackTeam: {
                        link: null,
                        visible: false
                    },
                    regularFeedback: {
                        link: null,
                        visible: false
                    },
                    empSelfExit: {
                        link: null,
                        visible: false
                    },
                    investmentDeclaration: {
                        link: 'https://player.vimeo.com/video/325390891',
                        visible: true
                    },
                    hraDeclaration: {
                        link: 'https://player.vimeo.com/video/325390906',
                        visible: true
                    },
                    extendProofSubmission: {
                        link: 'https://player.vimeo.com/video/325390932',
                        visible: true
                    },
                    leave: {
                        link: 'https://player.vimeo.com/video/325407543',
                        visible: true
                    },
                    leaveAdmin: {
                        link: 'https://player.vimeo.com/video/325407527',
                        visible: true
                    },
                    nhmCandidateCreation: {
                        link: 'https://player.vimeo.com/video/325405993',
                        visible: true
                    },
                    nhmCandidatePortal: {
                        link: 'https://player.vimeo.com/video/325406007',
                        visible: true
                    },
                    nhmOnboardingStatus: {
                        link: 'https://player.vimeo.com/video/325405966',
                        visible: true
                    },
                    helpdeskManager: {
                        link: 'https://player.vimeo.com/video/325407566',
                        visible: true
                    },
                    employeeRegularization: {
                        link: 'https://player.vimeo.com/video/325390380',
                        visible: true
                    },
                    attendanceCompoffSetup: {
                        link: 'https://player.vimeo.com/video/325390422',
                        visible: true
                    },
                    attendanceNoShowSetup: {
                        link: 'https://player.vimeo.com/video/325390412',
                        visible: true
                    },
                    attendanceWhfSetup: {
                        link: 'https://player.vimeo.com/video/325390393',
                        visible: true
                    }
                }
            }
        };
        this.getDateBeforeAfterMonths = function (months, type) {
            var date = new Date(),
                y = date.getFullYear(), m = date.getMonth(), d = date.getDate();

            return type === 'before' ? new Date(y, m - months, d + 1)
                : new Date(y, m + months, d - 1);
        };
        this.buildConfirmationDialogContentObject = function () {
            return {
                initiateExit: {
                    title: 'Initate Exit',
                    textContent: 'Are you sure you want to initiate exit for',
                    ariaLabel: 'Lucky day',
                    ok: 'Please do it!',
                    cancel: 'No, want to cancel'
                },
                default: {
                    title: 'Would you like to proceed with this?',
                    textContent: 'Please double check every thing before taking this action.'
                }
            }
        };
        this.getCurrentHours = function () {
            var date = new Date();

            return date.getHours();
        };
        this.getCurrentMinutes = function () {
            var date = new Date();

            return date.getMinutes();
        };
        this.convertDateFormatToUnixTimeStamp = function(date) {
            return date.getTime()/1000;
        };
        this.convertUnixTimeStampToDateFormat = function (timestamp) {
            return new Date(timestamp * 1000);
        };

        this.buildAppCountObject = function (list,hours) {
            if(!hours)
            {
                return null
            }
            var count = {
                total: {d:hours.productive+hours.non_productive+hours.idle,c:0},
                productive: {d:hours.productive,c:0},
                non_productive: {d:hours.non_productive,c:0},
                idle:{d:hours.idle,c:0}

            }

            list.map(function (app) {

                if (!app.is_parent) {
                    if (app.is_productive && !(app.display_status==5 || app.display_status==3)) {

                        count.productive.c += 1
                    }
                    else if (!app.is_productive && !(app.display_status==5 || app.display_status==3)) {
                        count.non_productive.c += 1
                    }

                    count.total.c += 1
                    count.idle.c+=(app.idle_duration>0)?1:0

                    // console.log('APP:',app.productive_duration,app.non_productive_duration,app.idle_duration)
                    // count.productive.d+=(app.display_status!==5?app.productive_duration:0)
                    // count.non_productive.d+=app.non_productive_duration
                    // count.idle.d+=app.idle_duration
                    // count.total.d+=(app.display_status==5?app.productive_duration:0)
                }
                else {
                    app.child_process.map(function (child) {
                        if (child.is_productive) {
                            count.productive.c += 1
                            // count.productive.d+=child.duration
                        }
                        else if (!child.is_productive) {
                            count.non_productive.c += 1
                            // count.non_productive.d+=child.duration
                        }
                        count.total.c += 1



                        //count.total.d+=child.duration


                    })
                }
            })
            return count
        }
        /**** Start: Answer Text Extraction Logic ****/
        this.convertOptionsArrayToObject = function (options) {
            var optionsObject = {};

            angular.forEach(options, function (option, key) {
                optionsObject[option._id.$id] = option.name;
            });

            return optionsObject;
        };
        this.getRadioAndDropdownTypeAnswer = function (item) {
            if (!self.getValue(item, 'answer')) {
                return null;
            }

            var optionsObject = this.convertOptionsArrayToObject(item.options);

            return self.getValue(optionsObject, item.answer);
        };
        this.getCheckboxTypeAnswer = function (item) {
            if (!self.getValue(item, 'answer', []).length) {
                return null;
            }

            var answer = [],
                optionsObject = this.convertOptionsArrayToObject(item.options);

            angular.forEach(item.answer, function (answerId, i) {
                answer.push(self.getValue(optionsObject, answerId));
            });

            return answer.join();
        };
        this.getAnswerText = function (item) {
            var answer = null;

            if (this.getValue(item, 'question_type') == FORM_BUILDER.questionType.radio
                || this.getValue(item, 'question_type') == FORM_BUILDER.questionType.dropdown) {
                answer = this.getRadioAndDropdownTypeAnswer(item);
            } else if (this.getValue(item, 'question_type') == FORM_BUILDER.questionType.checkbox) {
                answer = this.getCheckboxTypeAnswer(item);
            } else {
                answer = this.getValue(item, 'answer');
            }

            return answer;
        };
        /**** End: Answer Text Extraction Logic ****/

        /***** Start: Generic JSON to Array of Array Conversion *****/
        this.convertJSONToArrayOfArray = function (data, column, finalArray, conditions) {
            var finalArray = [],
                header = [];

            angular.forEach(data, function (val, key) {
                var row = [];
                angular.forEach(column, function (v, k) {
                    if (angular.isDefined(conditions) && Object.keys(conditions).length && conditions[k]) {
                        if (key == 0) {
                            header.push(k);
                        }
                        angular.isDefined(val[v]) ? row.push(val[v]) : row.push(' ');
                    } else if(angular.isUndefined(conditions) || Object.keys(conditions).length == 0) {
                        if (key == 0) {
                            header.push(k);
                        }
                        angular.isDefined(val[v]) ? row.push(val[v]) : row.push(' ');
                    }
                });
                if (key == 0) {
                    finalArray.push(header);
                }
                finalArray.push(row);
            });

            return finalArray;
        };
        /***** End: Generic JSON to Array of Array Conversion *****/

        this.timeStampToDateAndTime = function (timestamp, format) {
            var conversionformat = angular.isDefined(format) ? format : "DD-MM-YYYY h:mm:ss";
            var time = moment(timestamp).format(conversionformat);
            return time;
        };


        this.paginationRange = function (recordTotal) {
            var range = [],
            totalusers = recordTotal ? recordTotal: 0;
            if(totalusers >= 10 && totalusers <= 20) {
                range = [10];
            } else if(totalusers > 20 && totalusers <= 50) {
                range = [10, 20];
            } else if(totalusers > 50 && totalusers <= 100) {
                range = [10, 20, 50];
            } else if(totalusers > 100 && totalusers <= 200) {
                range = [10, 20, 50, 100];
            } else if(totalusers > 200 && totalusers <= 500) {
                range = [10, 20, 50, 100, 200];
            } else if(totalusers > 500 && totalusers <= 1000) {
                range = [10, 20, 50, 100, 200, 500];
            } else if(totalusers > 500 && totalusers > 1000) {
                range = [10, 20, 50, 100, 200, 500, 1000];
            } else {
                range = [];
            }
            return range;
        };

        this.setTotalPages = function(count, current) {
            var shownPages = 3;
            var result = [];
            if (current > count - shownPages) {
                result.push(count - 2, count - 1, count);
            } else {
                result.push(current, current + 1, current + 2, '...', count);
            }
            return result;
        };
        
        return this;
    }

]);