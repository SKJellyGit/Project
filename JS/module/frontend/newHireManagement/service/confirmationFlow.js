app.service('NhmAdminConfirmationFlowService', [
    'utilityService', 'FORM_BUILDER',
    function (utilityService, FORM_BUILDER) {
        'use strict';

        this.url = {
            confirmationRequests: 'prejoin/all-confirmation-request',
            nhmConfEmpForm: 'prejoin/employee-confirmation-form-detail',
            nhmConfApprForm: 'prejoin/confirmation-form-by-approver',
            notifyTo: 'prejoin/confirmation-form/remind-employee-approver'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        
        /***** Start: Emp Appr Form Action ******/
        this.buildQuestionList = function(questionList, reset) {
            if(!questionList || !questionList.length) {
                return questionList;
            }
            angular.forEach(questionList, function (value, key) {
                if(reset) {
                    value.answer = '';
                } else {
                    if(value.question_type == FORM_BUILDER.questionType.date) {
                        value.answer = angular.isDate(value.answer)
                            ? value.answer
                            : (angular.isString(value.answer) && value.answer.length)
                                ? utilityService.getDefaultDate(value.answer)
                                : null;
                    } else if(value.question_type == FORM_BUILDER.questionType.time) {
                        value.answer = angular.isDate(value.answer)
                            ? value.answer
                            : (angular.isString(value.answer) && value.answer.length)
                                ? utilityService.getDefaultDate('01/01/1970 ' + value.answer)
                                : null;
                    }
                }
            });
            return questionList;
        };
		this.buildFormObject = function(model) {
			return {
				_id: utilityService.getValue(model, '_id'),
				name: utilityService.getValue(model, 'name'),
				description: utilityService.getValue(model, 'description'),
				questions: this.buildQuestionList(utilityService.getValue(model, 'questions', []))
			};
        };
        /***** End: Emp Appr Form Action ******/
        
        this.buildSendReminderPayload = function (model, notifyTo) {
            var payload = {
                id: model._id
            };

            if (notifyTo === 'employee') {
                payload.employee_action_pending = true;
            }

            if (notifyTo === 'approver') {
                payload.approver_action_pending = true;
            }

            return payload;
        };

        this.buildSampleJSONData = function () {
            return {
                "status": "success",
                "data": [{
                    "_id": "5d3a14ce39473eaa318b4567",
                    "employee_id": "5cf4d8f039473ecd53beb550",
                    "status": 1,
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "03\/06\/2019",
                    "initial_confirmation_date": "02\/08\/2019",
                    "employee_preview": {
                        "full_name": "Parakram Chauhan",
                        "user_id": "5cf4d8f039473ecd53beb54e",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "03\/06\/2019",
                        "work_profile_department": ["5c76796e39473e9576933f77"],
                        "work_profile_probation_period": 60,
                        "work_profile_designation": ["5c767b2b39473eb57a933f84"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "03 June 2019",
                        "work_profile_department_detail": [{
                            "_id": "5c76796e39473e9576933f77",
                            "name": "Business Development",
                            "slug": "business_development"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767b2b39473eb57a933f84",
                            "name": "Intern",
                            "slug": "intern"
                        }],
                        "_id": "5cf4d8f039473ecd53beb550",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Parakram Chauhan", "Q0054", "Intern"]
                    },
                    "employee_action_pending": true,
                    "approver_action_pending": true
                }, {
                    "_id": "5d5c5bce39473e8c5c8b4567",
                    "employee_id": "5cf4d8f039473ecd53beb553",
                    "status": 1,
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "30\/05\/2019",
                    "initial_confirmation_date": "28\/08\/2019",
                    "employee_preview": {
                        "full_name": "Krati Bacharwar",
                        "user_id": "5cf4d8f039473ecd53beb551",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "30\/05\/2019",
                        "work_profile_department": ["5cda4eaf39473efa2de4ff0b"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767b2b39473eb57a933f84"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "30 May 2019",
                        "work_profile_department_detail": [{
                            "_id": "5cda4eaf39473efa2de4ff0b",
                            "name": "Customer Success",
                            "slug": "customer_success"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767b2b39473eb57a933f84",
                            "name": "Intern",
                            "slug": "intern"
                        }],
                        "_id": "5cf4d8f039473ecd53beb553",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Krati Bacharwar", "Q0053", "Intern"]
                    },
                    "employee_action_pending": true
                }, {
                    "_id": "5d61a1ce39473ebb4c8b4567",
                    "employee_id": "5cf4d52339473ee941beb552",
                    "status": 1,
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "03\/06\/2019",
                    "initial_confirmation_date": "01\/09\/2019",
                    "employee_preview": {
                        "full_name": "Mohammad Hammad",
                        "original_img_filename": "temp_photo.jpg",
                        "img_icon": "92577.jpg",
                        "user_id": "5cf4d52339473ee941beb550",
                        "crop_type": "1",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "03\/06\/2019",
                        "work_profile_department": ["5cda4eaf39473efa2de4ff0b"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767af539473e9f7b933f78"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "03 June 2019",
                        "work_profile_department_detail": [{
                            "_id": "5cda4eaf39473efa2de4ff0b",
                            "name": "Customer Success",
                            "slug": "customer_success"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767af539473e9f7b933f78",
                            "name": "Manager",
                            "slug": "manager"
                        }],
                        "_id": "5cf4d52339473ee941beb552",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Mohammad Hammad", "Q0051", "Manager"]
                    },
                    "approver_action_pending": true
                }, {
                    "_id": "5d6444cf39473e34678b4567",
                    "employee_id": "5d147e2239473e3b57d15a9c",
                    "status": 1,
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "05\/06\/2019",
                    "initial_confirmation_date": "03\/09\/2019",
                    "employee_preview": {
                        "full_name": "Pardeep Kumar",
                        "original_img_filename": "temp_photo.jpg",
                        "img_icon": "48213.jpg",
                        "user_id": "5d1480e239473e3463d15a9b",
                        "crop_type": "1",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "05\/06\/2019",
                        "work_profile_department": ["5cda4eaf39473efa2de4ff0b"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767af539473e9f7b933f78"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "05 June 2019",
                        "work_profile_department_detail": [{
                            "_id": "5cda4eaf39473efa2de4ff0b",
                            "name": "Customer Success",
                            "slug": "customer_success"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767af539473e9f7b933f78",
                            "name": "Manager",
                            "slug": "manager"
                        }],
                        "_id": "5d147e2239473e3b57d15a9c",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Pardeep Kumar", "Q0055", "Manager"]
                    }
                }, {
                    "_id": "5d795cce39473ea7108b4567",
                    "employee_id": "5d14810b39473e3964d15a96",
                    "status": 1,
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "21\/06\/2019",
                    "initial_confirmation_date": "19\/09\/2019",
                    "employee_preview": {
                        "full_name": "Nand Kishor Jha",
                        "original_img_filename": "blob",
                        "img_icon": "12757.jpg",
                        "user_id": "5d14829839473ec569d15a9e",
                        "crop_type": "1",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "21\/06\/2019",
                        "work_profile_department": ["5cda4eaf39473efa2de4ff0b"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767af539473e9f7b933f78"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "21 June 2019",
                        "work_profile_department_detail": [{
                            "_id": "5cda4eaf39473efa2de4ff0b",
                            "name": "Customer Success",
                            "slug": "customer_success"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767af539473e9f7b933f78",
                            "name": "Manager",
                            "slug": "manager"
                        }],
                        "_id": "5d14810b39473e3964d15a96",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Nand Kishor Jha", "Q0056", "Manager"]
                    }
                }, {
                    "_id": "5dc08dce39473ea9068b4567",
                    "employee_id": "5d71035439473e022b645f5f",
                    "status": 10,
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "14\/08\/2019",
                    "initial_confirmation_date": "12\/11\/2019",
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_chain": [{
                        "employee_id": ["5cda4fa739473e5431e4ff22"],
                        "reminder_value": 1,
                        "reminder_unit": 1,
                        "is_escalate": false,
                        "status": 10,
                        "assign_time": 1573447719,
                        "_id": {
                            "$id": "5dc8e82739473e2a4ac16354"
                        },
                        "emp_id": "5cda4fa739473e5431e4ff22",
                        "emp_name": "Akhil  Satyavolu",
                        "comment": null,
                        "updated_at": {
                            "sec": 1573450957,
                            "usec": 454000
                        }
                    }, {
                        "employee_id": ["5cda4fa739473e5431e4ff22"],
                        "reminder_value": 1,
                        "reminder_unit": 1,
                        "is_escalate": false,
                        "status": 10,
                        "assign_time": 1573447771,
                        "_id": {
                            "$id": "5dc8e85b39473e2a4ac1635a"
                        },
                        "emp_id": "5cda4fa739473e5431e4ff22",
                        "emp_name": "Akhil  Satyavolu",
                        "comment": null,
                        "updated_at": {
                            "sec": 1574260259,
                            "usec": 784000
                        }
                    }],
                    "confirmation_action": "1",
                    "final_confirmation_date": "12\/11\/2019",
                    "employee_preview": {
                        "full_name": "Aliya Mushtaq",
                        "original_img_filename": "temp_photo.jpg",
                        "img_icon": "98036.jpg",
                        "user_id": "5d71045139473e972f645f5f",
                        "crop_type": "1",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "14\/08\/2019",
                        "work_profile_department": ["5cda4eaf39473efa2de4ff0b"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767af539473e9f7b933f78"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "14 August 2019",
                        "work_profile_department_detail": [{
                            "_id": "5cda4eaf39473efa2de4ff0b",
                            "name": "Customer Success",
                            "slug": "customer_success"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767af539473e9f7b933f78",
                            "name": "Manager",
                            "slug": "manager"
                        }],
                        "_id": "5d71035439473e022b645f5f",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Aliya Mushtaq", "Q0057", "Manager"]
                    }
                }, {
                    "_id": "5ded60cf39473ea32e8b4567",
                    "employee_id": "5dc51d1d39473e1c15818920",
                    "status": 10,
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "17\/09\/2019",
                    "initial_confirmation_date": "16\/12\/2019",
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_chain": [{
                        "employee_id": ["5cda4fa739473e5431e4ff22"],
                        "reminder_value": 1,
                        "reminder_unit": 1,
                        "is_escalate": false,
                        "status": 10,
                        "assign_time": 1576497387,
                        "_id": {
                            "$id": "5df770eb39473e3b6e0abf97"
                        },
                        "emp_id": "5cda4fa739473e5431e4ff22",
                        "emp_name": "Akhil  Satyavolu",
                        "comment": null,
                        "updated_at": {
                            "sec": 1578375865,
                            "usec": 462000
                        }
                    }],
                    "confirmation_action": "1",
                    "final_confirmation_date": "16\/12\/2019",
                    "employee_preview": {
                        "full_name": "Umar Basheer",
                        "original_img_filename": "temp_photo.jpg",
                        "img_icon": "89481.jpg",
                        "user_id": "5dc51e5a39473ef819818924",
                        "crop_type": "1",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "17\/09\/2019",
                        "work_profile_department": ["5cda4eaf39473efa2de4ff0b"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767af539473e9f7b933f78"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "17 September 2019",
                        "work_profile_department_detail": [{
                            "_id": "5cda4eaf39473efa2de4ff0b",
                            "name": "Customer Success",
                            "slug": "customer_success"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767af539473e9f7b933f78",
                            "name": "Manager",
                            "slug": "manager"
                        }],
                        "_id": "5dc51d1d39473e1c15818920",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Umar Basheer", "Q0058", "Manager"]
                    }
                }, {
                    "_id": "5deeb24f39473e78728b4567",
                    "employee_id": "5dc5200d39473e412181891f",
                    "status": 10,
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "18\/09\/2019",
                    "initial_confirmation_date": "17\/12\/2019",
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_chain": [{
                        "employee_id": ["5c78ca1639473e24603bb160"],
                        "reminder_value": 1,
                        "reminder_unit": 1,
                        "is_escalate": false,
                        "status": 10,
                        "assign_time": 1575955327,
                        "_id": {
                            "$id": "5def2b7f39473ecc4ce87a04"
                        },
                        "emp_id": "5c78ca1639473e24603bb160",
                        "emp_name": "Komal  Choudhary",
                        "comment": null,
                        "updated_at": {
                            "sec": 1579586915,
                            "usec": 128000
                        }
                    }],
                    "confirmation_action": "1",
                    "final_confirmation_date": "17\/12\/2019",
                    "employee_preview": {
                        "full_name": "Azad Singh",
                        "original_img_filename": "temp_photo.jpg",
                        "img_icon": "58217.jpg",
                        "user_id": "5dc520b139473edd21818923",
                        "crop_type": "1",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "18\/09\/2019",
                        "work_profile_department": ["5cda4eaf39473efa2de4ff0b"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767af539473e9f7b933f78"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "18 September 2019",
                        "work_profile_department_detail": [{
                            "_id": "5cda4eaf39473efa2de4ff0b",
                            "name": "Customer Success",
                            "slug": "customer_success"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767af539473e9f7b933f78",
                            "name": "Manager",
                            "slug": "manager"
                        }],
                        "_id": "5dc5200d39473e412181891f",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Azad Singh", "Q0060", "Manager"]
                    }
                }, {
                    "_id": "5e2ca8cf39473edd738b4567",
                    "employee_id": "5dc51f5739473e2f1b818921",
                    "status": 10,
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "04\/11\/2019",
                    "initial_confirmation_date": "02\/02\/2020",
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_chain": [{
                        "employee_id": ["5c78ca1639473e24603bb160"],
                        "reminder_value": 1,
                        "reminder_unit": 1,
                        "is_escalate": false,
                        "status": 10,
                        "assign_time": 1580102141,
                        "_id": {
                            "$id": "5e2e71fd39473e3a534163eb"
                        },
                        "emp_id": "5c78ca1639473e24603bb160",
                        "emp_name": "Komal  Choudhary",
                        "comment": null,
                        "updated_at": {
                            "sec": 1582610430,
                            "usec": 457000
                        }
                    }],
                    "confirmation_action": "1",
                    "final_confirmation_date": "02\/02\/2020",
                    "employee_preview": {
                        "full_name": "Jitender Kumar",
                        "user_id": "5dc51fd639473e7d1e818922",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "04\/11\/2019",
                        "work_profile_department": ["5cda4eaf39473efa2de4ff0b"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767af539473e9f7b933f78"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "04 November 2019",
                        "work_profile_department_detail": [{
                            "_id": "5cda4eaf39473efa2de4ff0b",
                            "name": "Customer Success",
                            "slug": "customer_success"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767af539473e9f7b933f78",
                            "name": "Manager",
                            "slug": "manager"
                        }],
                        "_id": "5dc51f5739473e2f1b818921",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Jitender Kumar", "Q0059", "Manager"]
                    }
                }, {
                    "_id": "5e5acd4e39473ee3338b4567",
                    "employee_id": "5e174d4f39473e10728b2175",
                    "status": 1,
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "09\/12\/2019",
                    "initial_confirmation_date": "08\/03\/2020",
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_chain": [{
                        "employee_id": ["5c78ca1639473e24603bb150"],
                        "reminder_value": 1,
                        "reminder_unit": 1,
                        "is_escalate": false,
                        "status": 1,
                        "assign_time": 1584336640,
                        "_id": {
                            "$id": "5e6f0f0039473ed240be5a2c"
                        }
                    }],
                    "employee_preview": {
                        "full_name": "Faisal Khan",
                        "user_id": "5e174d4f39473e10728b2173",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "09\/12\/2019",
                        "work_profile_department": ["5c76797639473e9576933f78"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767af239473eb07d933f77"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "09 December 2019",
                        "work_profile_department_detail": [{
                            "_id": "5c76797639473e9576933f78",
                            "name": "Technology",
                            "slug": "technology"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767af239473eb07d933f77",
                            "name": "Engineer",
                            "slug": "engineer"
                        }],
                        "_id": "5e174d4f39473e10728b2175",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Faisal Khan", "Q061", "Engineer"]
                    }
                }, {
                    "_id": "5e7136cf39473e01058b4567",
                    "employee_id": "5e174d4f39473e10728b217d",
                    "status": 1,
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "26\/12\/2019",
                    "initial_confirmation_date": "25\/03\/2020",
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_chain": [{
                        "employee_id": ["5c78ca1639473e24603bb150"],
                        "reminder_value": 1,
                        "reminder_unit": 1,
                        "is_escalate": false,
                        "status": 1,
                        "assign_time": 1586763575,
                        "_id": {
                            "$id": "5e94173739473e2656ccf85c"
                        }
                    }],
                    "employee_preview": {
                        "full_name": "Anish Mendiratta",
                        "user_id": "5e174d4f39473e10728b217b",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "26\/12\/2019",
                        "work_profile_department": ["5c76797639473e9576933f78"],
                        "work_profile_probation_period": 9,
                        "work_profile_designation": ["5c767b2b39473eb57a933f84"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "26 December 2019",
                        "work_profile_department_detail": [{
                            "_id": "5c76797639473e9576933f78",
                            "name": "Technology",
                            "slug": "technology"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767b2b39473eb57a933f84",
                            "name": "Intern",
                            "slug": "intern"
                        }],
                        "_id": "5e174d4f39473e10728b217d",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Anish Mendiratta", "Q062", "Intern"]
                    }
                }, {
                    "_id": "5e9f5b4e39473e16378b4567",
                    "employee_id": "5e3292c439473ebe06763e09",
                    "status": 3,
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "30\/01\/2020",
                    "initial_confirmation_date": "29\/04\/2020",
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_chain": [],
                    "final_confirmation_date": "29\/04\/2020",
                    "confirmation_action": 1,
                    "employee_preview": {
                        "full_name": "Praveen Kumar",
                        "user_id": "5e3292c439473ebe06763e07",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "30\/01\/2020",
                        "work_profile_department": ["5c76797639473e9576933f78"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767b2b39473eb57a933f84"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "30 January 2020",
                        "work_profile_department_detail": [{
                            "_id": "5c76797639473e9576933f78",
                            "name": "Technology",
                            "slug": "technology"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767b2b39473eb57a933f84",
                            "name": "Intern",
                            "slug": "intern"
                        }],
                        "_id": "5e3292c439473ebe06763e09",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Praveen Kumar", "Q065", "Intern"]
                    }
                }, {
                    "_id": "5e9f5b4e39473e16378b456b",
                    "employee_id": "5e3292c439473ebe06763e11",
                    "status": 3,
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "30\/01\/2020",
                    "initial_confirmation_date": "29\/04\/2020",
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_chain": [],
                    "final_confirmation_date": "29\/04\/2020",
                    "confirmation_action": 1,
                    "employee_preview": {
                        "full_name": "Anirban Bhattacharya",
                        "user_id": "5e3292c439473ebe06763e0f",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "30\/01\/2020",
                        "work_profile_department": ["5c76797639473e9576933f78"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767b2b39473eb57a933f84"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "30 January 2020",
                        "work_profile_department_detail": [{
                            "_id": "5c76797639473e9576933f78",
                            "name": "Technology",
                            "slug": "technology"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767b2b39473eb57a933f84",
                            "name": "Intern",
                            "slug": "intern"
                        }],
                        "_id": "5e3292c439473ebe06763e11",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Anirban Bhattacharya", "Q064", "Intern"]
                    }
                }, {
                    "_id": "5ea4a14f39473ec7648b4567",
                    "employee_id": "5e3917b739473e5303a77ecf",
                    "status": 1,
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "03\/02\/2020",
                    "initial_confirmation_date": "03\/05\/2020",
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_chain": [{
                        "employee_id": ["5c7cf78739473e6d2ec76b6f"],
                        "reminder_value": 1,
                        "reminder_unit": 1,
                        "is_escalate": false,
                        "status": 1,
                        "assign_time": 1587891101,
                        "_id": {
                            "$id": "5ea54b9d39473eb2478afb62"
                        }
                    }],
                    "employee_preview": {
                        "full_name": "Aditi Balodi",
                        "user_id": "5e3917b739473e5303a77ecd",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "03\/02\/2020",
                        "work_profile_department": ["5c7679de39473e5d75933f77"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767b2b39473eb57a933f84"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "03 February 2020",
                        "work_profile_department_detail": [{
                            "_id": "5c7679de39473e5d75933f77",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767b2b39473eb57a933f84",
                            "name": "Intern",
                            "slug": "intern"
                        }],
                        "_id": "5e3917b739473e5303a77ecf",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Aditi Balodi", "Q067", "Intern"]
                    }
                }, {
                    "_id": "5ea9e74e39473e0b5d8b4567",
                    "employee_id": "5e40ed0b39473ee050c1d7b1",
                    "status": 1,
                    "approver_form": "5cf4cdeb39473e4926beb54e",
                    "joining_date": "07\/02\/2020",
                    "initial_confirmation_date": "07\/05\/2020",
                    "confirmation_form_id": "5cf4cd2739473ef522beb551",
                    "approver_chain": [{
                        "employee_id": ["5cda4fa739473e5431e4ff22"],
                        "reminder_value": 1,
                        "reminder_unit": 1,
                        "is_escalate": false,
                        "status": 1,
                        "assign_time": 1588917762,
                        "_id": {
                            "$id": "5eb4f60239473ee26ef3c4d7"
                        }
                    }],
                    "employee_preview": {
                        "full_name": "Tanya Pahwa",
                        "original_img_filename": "blob",
                        "img_icon": "13833.jpg",
                        "user_id": "5e40ed0b39473ee050c1d7af",
                        "crop_type": "1",
                        "work_profile_location": ["5c76795639473e9376933f77"],
                        "work_profile_joining_date": "07\/02\/2020",
                        "work_profile_department": ["5c76796e39473e9576933f77"],
                        "work_profile_probation_period": 90,
                        "work_profile_designation": ["5c767b2b39473eb57a933f84"],
                        "work_profile_location_detail": [{
                            "_id": "5c76795639473e9376933f77",
                            "name": "Gurgaon",
                            "slug": "gurgaon"
                        }],
                        "joining_date": "07 February 2020",
                        "work_profile_department_detail": [{
                            "_id": "5c76796e39473e9576933f77",
                            "name": "Business Development",
                            "slug": "business_development"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5c767b2b39473eb57a933f84",
                            "name": "Intern",
                            "slug": "intern"
                        }],
                        "_id": "5e40ed0b39473ee050c1d7b1",
                        "profile_pic": "http:\/\/hr.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Tanya Pahwa", "Q068", "Intern"]
                    }
                }]
            };
        };
    }
]);