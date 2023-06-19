app.service('DashboardService', [
	'$timeout', 'utilityService',        
	function ($timeout, utilityService) {
		'use strict';
		var self = this;

        this.url = {
    	   clockinout: 'timeattendance/employee/clockinout',           
    	   avgData: 'timeattendance/employee/avg-data',           
    	   breaks: 'timeattendance/employee/breakinout',
    	   selfReport: 'timeattendance/employee/report-attendance',
    	   selfReportDetails: 'timeattendance/employee/clockin-time/self',
    	   totalTime: 'timeattendance/employee/clockin-time',
           attendance: 'timeattendance/employee/attendance',
           regularizationReq: 'timeattendance/employee/regularization-category',
           getApprovers: 'timeattendance/employee/request-fields-approvers',
           applyRegReq: 'timeattendance/employee/regularization',
           regRequests: 'timeattendance/employee/regularization-request',
           cancleRequests: 'timeattendance/employee/cancel-regularization',
           shiftDetail: 'timeattendance/employee/shiftwise-detail?month_year=',
           attendanceGraph: 'timeattendance/employee/summary-graph?display_type=1&month_year=',
           exitDetails: 'user-exit/employees-exit-detail',
           requestSummary: 'employee/all-request-summary',
           downloadClearance: 'user-exit/clearance-template',
           uploadClearance: 'user-exit/offine-file',
           exitCertificate: 'user-exit/certificate-detail',
           birthdayList : 'employee/birthday-anniversary',
           wishEmployee : 'employee/birthday-anniversary-wish',
           todaysNotice : 'employee/notice',
           getSysInfo: 'org-details/sys-info',
           policyDetail: 'timeattendance/employee/policy-detail',
           wallSetting: 'social-setup/social-settings',
           communitySetting: 'social-setup/community-settings',
           resourcePolicy: 'resources/files',
           cityList: 'data/mmt-city-list.json',
           exitReminder:'reminder/settings',
           exitFeedbackForm: 'user-exit/exit-feedback-form',
           selfieUrl: 'timeattendance/employee/get-my-selfie',
           companyPaymentNotice : 'payment-notification/notification',
           upcomingBirthdayAnniversary:"employee/upcoming-birthday-anniversary"
        };        
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };            
        this.checkForPending = function(v, list) {
        	if(list.indexOf(v.status) == -1) {
				v.pending = true;
				list.push(v.status);
			} else {
				v.notReceived = true;
			}
        };
        this.checkForRejected = function(v, list) {
        	if(list.indexOf(v.status) == -1) {
				v.rejected = true;
				list.push(v.status);
				list.push(1);
			} else {
				v.notReceived = true;
			}
        };
         this.checkForCancelled = function(v, list) {
        	if(list.indexOf(v.status) == -1) {
				v.cancelled = true;
				list.push(v.status);
				list.push(1);
			} else {
				v.notReceived = true;
			}
        };
        this.buildRequestList = function(data) {
        	angular.forEach(data, function(value, key) {
        		if(utilityService.getValue(value, 'approver_chain') && value.approver_chain.length) {
        			var list = [];
	        		value.approver_chain_list = [];
	            	angular.forEach(value.approver_chain, function(v, k) {
	            		(value.status == 2) ? self.checkForCancelled(v, list)
	            			: ((v.status == 9 || v.status == 11 || v.status == 13 || v.status == 14) 
	            				? self.checkForRejected(v, list) 
	            				: ((v.status == 1) ? self.checkForPending(v, list) : v.approved = true));

	            		value.approver_chain_list.push(v);
	            	});
        		} else {
        			value.approver_chain_list = [];
        			(value.status == 2) ? value.cancelled = true
            			: ((value.status == 9 || value.status == 11 || value.status == 13 || value.status == 14) 
            				? value.rejected = true 
            					: ((value.status == 1) ? value.pending = true : value.approved = true));
        		}
            });
            return data;        		
        };
        this.buildDateObject = function(){
            return {
                1 : {
                    label: 3,
                    isChecked: false
                },
                2 : {
                        label: 7,
                        isChecked: false
                    },
                3 : {
                        label: 15,
                        isChecked: false
                    },
                4 : {
                    label: 30,
                    isChecked: false
                }    
            }
        };
        this.buildMonthsObject = function(){
            return [
                {type: "1",name: "January"},
                {type: "2",name: "February"},
                {type: "3",name: "March"},
                {type: "4",name: "April"},
                {type: "5",name: "May"},
                {type: "6",name: "June"},
                {type: "7",name: "July"},
                {type: "8",name: "August"},
                {type: "9",name: "September"},
                {type: "10",name: "October"},
                {type: "11",name: "November"},
                {type: "12",name: "December"}]
        };
        this.getMonthsName = function(){
           return ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                   "October", "November", "December"];              
        };
        this.duesStatusObj = function () {
            return {
                1: 'Pending',
                2: 'No dues',
                3: 'Dues Payable',
                4: 'Done',
                5: 'Revoked',
                6: 'Provided',
                8: 'Triggered'
            };
        };
        this.buildProfileStatus = function(){
            return utilityService.buildEmployeeStatusHashMap();
        };
        this.buildWishPayload = function (model) {
            var ids = [];
            angular.forEach(model.selectedEmployee, function (v, k){
                ids.push(v.id);
            });
            return  {
                to_employee: ids,
                message: model.message,
                type: model.section == 'anniversary' ? 2 : 1
            };
        };
        this.buildCarouselObject = function(i) {
            var lengthitem = i > 1 ? true : false ;
            return {
                items: 3,
                center: true,
                loop: true,
                navText: [
                    "<i class='fa fa-angle-left fa-lg'></i>",
                    "<i class='fa fa-angle-right fa-lg'></i>"
                ],
                pagination: false,
                nav: lengthitem,
                dots: false,
                margin: -10,
                touchDrag: false,
                mouseDrag: false
            }
        };
        this.buildCarouselObjectlst = function(number) {
            return {
                margin:4,
                loop:false,
                items:number,
                dots: true,
                nav: false,
                navText: [
                    "<i class='fa fa-angle-left fa-lg'></i>",
                    "<i class='fa fa-angle-right fa-lg'></i>"
                ],
            }
        };
        this.buildBirthdayObject = function() {
            return {
                date : new Date(),
                minDate: new Date(new Date().getFullYear(), 0, 1),
                maxDate: new Date(new Date().getFullYear(), 11, 31),
                birthdayList: [],
                workAnniversaryList: [],
                birthdayTab: 0,
                selectedEmployee: [],
                message: "Happy Birthday!",
                heading: "Wish Happy Birthday",
                visible : false,
                avisible : false,
                section: null
            }
            };
        this.policyDetailHasMap = {
            wfh: {
                durationType: {
                    1: 'Week',
                    2: 'Month',
                    3: 'Year'
                },
                months: {
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
                },
                frequency:{
                    1:'Daily',
                    2:'Weekly',
                    3:'Monthly'
                },
                weekDays:{
                 1:'Monday',   
                 2:'Tuesday',   
                 3:'Wednesday',   
                 4:'Thursday',   
                 5:'Friday',   
                 6:'Saturday',   
                 7:'Sunday'   
                },
                payFrequency:{
                 1:'Hourly',   
                 2:'Daily',   
                 3:'Weekly',   
                 4:'Monthly'   
                },
                minWorkDur:{
                 1:'Minutes',
                 2:'% of shift duration'
                }
            }
        };
        this.buildSocialSettingObject = function(){
            return {
                wall : [],
                community : [],
                tab : {
                    isSet : 1
                }
            }
        };
        this.rebuildFolderList = function(list) {
            angular.forEach(list, function(v,k) {
                v.size = self.bytesToSize(v.folder_size);
                v.sizeToSort = v.folder_size;
                v.resourceID = v._id;
                v.owner = "-";
                v.type = 1;
                v.Name = v.folder_name;
                v.modified_date = v.folder_modify_date;
            });
            return list;
        };
        this.rebuildFileList = function(list) {
            angular.forEach(list, function(v,k) {
                v.size = self.bytesToSize(v.file_size);
                v.sizeToSort = v.file_size;
                v.resourceID = v._id;
                v.Name = v.file_name;
                v.type = 2;
                v.modified_date = v.last_modify_date;
                v.owner = v.poc_name ? v.poc_name : "-";
            });
            return list;
        };
        this.bytesToSize = function (bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Byte';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        };
        this.buildFormModel = function(model) {
            return {
                _id : utilityService.getValue(model,'action_id'),
                exit_id :  utilityService.getValue(model,'exit_id'),
                form_type : 'survey', //utilityService.getValue(model,'form_type'),
                form_id :  utilityService.getValue(model,'exit_form_id'),
                form: {
                    _id : utilityService.getValue(model.exit_form_detail.form_detail,'_id'),
                    name: utilityService.getValue(model.exit_form_detail.form_detail,'name'),
                    description: utilityService.getValue(model.exit_form_detail.form_detail,'description')
                }
            }
        };
        this.getCurrentMonthObj = function(){
            var date = new Date();
            return {
                firstDay:new Date(date.getFullYear(), date.getMonth(), 1),
                lastDay:new Date(date.getFullYear(), date.getMonth() + 1, 0)
            };
        };
    }
]);