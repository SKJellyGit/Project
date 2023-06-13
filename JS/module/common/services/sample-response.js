app.service('SampleResponseService', ['utilityService',    
	function (utilityService) {
		'use strict';
        
        this.buildSampleResponseBug4333 = function () {
            return {
                "status": "success",
                "message": "",
                "data": {
                    "cycle_name": "Relationship Test Cycle 1",
                    "rating_setting": [{
                        "score": 5,
                        "description": "Truly Outstanding"
                    }, {
                        "score": 4,
                        "description": "Greatly Exceeds Expectations"
                    }, {
                        "score": 3,
                        "description": "Exceeds Expectations"
                    }, {
                        "score": 2,
                        "description": "Meets Expectations"
                    }, {
                        "score": 1,
                        "description": "Below Expectations"
                    }],
                    "settings": {
                        "promotion_recommendation": true,
                        "promotion_recommendation_to_employee": "2",
                        "enable_goal": true,
                        "enable_competency": true,
                        "fill_recommendation": true,
                        "fill_midterm": true,
                        "ratings": [{
                            "score": 5,
                            "description": "Truly Outstanding"
                        }, {
                            "score": 4,
                            "description": "Greatly Exceeds Expectations"
                        }, {
                            "score": 3,
                            "description": "Exceeds Expectations"
                        }, {
                            "score": 2,
                            "description": "Meets Expectations"
                        }, {
                            "score": 1,
                            "description": "Below Expectations"
                        }],
                        "enable_rating_goal": true,
                        "goal_calculation_type": 2,
                        "enable_rating_competency": true,
                        "competency_calculation_type": 2
                    },
                    "in_duration": true,
                    "reviewee": {
                        "personal_profile_employee_code": "MTF0003",
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "reviewer": {
                        "personal_profile_employee_code": "MTF0001",
                        "user_id": "5ba8978839473e126937aefb",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "38513.",
                        "full_name": "Amuleek Singh Bijral",
                        "_id": "5ba8973439473e7a6737ae96",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978839473e126937aefb\/38513.",
                        "display_detail": ["Amuleek Singh Bijral", "Operations", "CEO"]
                    },
                    "goal_feedbacks": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5c371dc739473e8b0d8b4b59",
                                "question": "Please rate the employee on :- Sandesh 1",
                                "description": " qwertyuiop",
                                "header": "A",
                                "question_group": "A",
                                "weightage": 12.5,
                                "question_type": 10,
                                "form_id": "5c36f33239473eee5a717e58",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b5a",
                                "question": "Describe your Rating: :- Sandesh 1",
                                "description": " qwertyuiop",
                                "question_group": "A",
                                "weightage": 12.5,
                                "question_type": 9,
                                "form_id": "5c36f33239473eee5a717e58",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "V",
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b5b",
                                "question": "Please rate the employee on :- Sandesh 2",
                                "description": " qwertyuiopoiuytrewq",
                                "header": "B",
                                "question_group": "B",
                                "weightage": 12.5,
                                "question_type": 10,
                                "form_id": "5c36f33239473eee5a717e58",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 4,
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b5c",
                                "question": "Describe your Rating: :- Sandesh 2",
                                "description": " qwertyuiopoiuytrewq",
                                "question_group": "B",
                                "weightage": 12.5,
                                "question_type": 9,
                                "form_id": "5c36f33239473eee5a717e58",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b5d",
                                "question": "Please rate the employee on :- Sandesh 3",
                                "description": " poiuytrewq",
                                "header": "C",
                                "question_group": "C",
                                "weightage": 65,
                                "question_type": 10,
                                "form_id": "5c36f33239473eee5a717e58",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 3,
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b5e",
                                "question": "Describe your Rating: :- Sandesh 3",
                                "description": " poiuytrewq",
                                "question_group": "C",
                                "weightage": 65,
                                "question_type": 9,
                                "form_id": "5c36f33239473eee5a717e58",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b5f",
                                "question": "Please rate the employee on :- Added by admin",
                                "description": " advvhmadv advdba av",
                                "header": "D",
                                "question_group": "D",
                                "weightage": 0,
                                "question_type": 10,
                                "form_id": "5c36f33239473eee5a717e58",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b60",
                                "question": "Describe your Rating: :- Added by admin",
                                "description": " advvhmadv advdba av",
                                "question_group": "D",
                                "weightage": 0,
                                "question_type": 9,
                                "form_id": "5c36f33239473eee5a717e58",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b61",
                                "question": "Please rate the employee on :- Added by Manager",
                                "description": " ajdvac asccb acc acasj vjascc aajsv  a asvj avas caj ab a asccag cc\nas jajff jaf \nasfkj ajf asfs\nqkhfbaehff jqbq efqf\nqhfb ajf jhbafaf\nafhkh  ahfb kabef\nafnk b akjfafb j",
                                "header": "E",
                                "question_group": "E",
                                "weightage": 10,
                                "question_type": 10,
                                "form_id": "5c36f33239473eee5a717e58",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 3,
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b62",
                                "question": "Describe your Rating: :- Added by Manager",
                                "description": " ajdvac asccb acc acasj vjascc aajsv  a asvj avas caj ab a asccag cc\nas jajff jaf \nasfkj ajf asfs\nqkhfbaehff jqbq efqf\nqhfb ajf jhbafaf\nafhkh  ahfb kabef\nafnk b akjfafb j",
                                "question_group": "E",
                                "weightage": 10,
                                "question_type": 9,
                                "form_id": "5c36f33239473eee5a717e58",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c36f33239473eee5a717e5b",
                                "question": "Do you give employee enough feedback that helps him?",
                                "form_id": "5c36f33239473eee5a717e58",
                                "updated_at": "2019-01-10 12:54:34",
                                "created_at": "2019-01-10 12:54:34",
                                "header": "Employee Related Questions:",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c36f33239473eee5a717e5c",
                                "question": "What can the employee improve upon?",
                                "form_id": "5c36f33239473eee5a717e58",
                                "updated_at": "2019-01-10 12:54:34",
                                "created_at": "2019-01-10 12:54:34",
                                "header": "Suggestions:",
                                "description": null,
                                "question_type": 2,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "Behaviour",
                                    "_id": {
                                        "$id": "5c10f2df39473e68597037fd"
                                    }
                                }, {
                                    "name": "Working Styles",
                                    "_id": {
                                        "$id": "5c10f2df39473e68597037fe"
                                    }
                                }, {
                                    "name": "Nothing",
                                    "_id": {
                                        "$id": "5c10f2df39473e68597037ff"
                                    }
                                }],
                                "answer": "5c10f2df39473e68597037fd",
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c36f33239473eee5a717e5d",
                                "question": "Do you have any sugestions\/ feedback for the company?",
                                "form_id": "5c36f33239473eee5a717e58",
                                "updated_at": "2019-01-10 12:54:34",
                                "created_at": "2019-01-10 12:54:34",
                                "header": "Meeting",
                                "description": null,
                                "question_type": 4,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "Yes , Will be discussed in meeting",
                                    "_id": {
                                        "$id": "5c10f2cc39473e6f587037fd"
                                    }
                                }, {
                                    "name": "No",
                                    "_id": {
                                        "$id": "5c10f2cc39473e6f587037fe"
                                    }
                                }],
                                "answer": "5c10f2cc39473e6f587037fe",
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }, {
                                "_id": "5c36f33239473eee5a717e5e",
                                "question": "Summary",
                                "form_id": "5c36f33239473eee5a717e58",
                                "updated_at": "2019-01-10 12:54:34",
                                "created_at": "2019-01-10 12:54:34",
                                "header": null,
                                "description": null,
                                "question_type": 11,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502fcd39473eae01e60eac"
                            }]
                        },
                        "rating": 3,
                        "overall_rating": 4,
                        "recommended_for_promotion": true,
                        "reviewer_type": "manager",
                        "status": 2
                    },
                    "competency_feedbacks": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5c371dc739473e8b0d8b4b93",
                                "question": "Please rate the employee on :- S Comp 1",
                                "description": " D",
                                "header": "1",
                                "question_group": "1",
                                "weightage": 22.5,
                                "question_type": 10,
                                "form_id": "5c36f80739473ed76e717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c502ff539473eae01e60eae"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b94",
                                "question": "Describe your rating :- S Comp 1",
                                "description": " D",
                                "question_group": "1",
                                "weightage": 22.5,
                                "question_type": 9,
                                "form_id": "5c36f80739473ed76e717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502ff539473eae01e60eae"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b95",
                                "question": "Please rate the employee on :- S Comp 2",
                                "description": " qwertyuiopasdfghjklzxcvbnm advhbadvdv badvv af",
                                "header": "2",
                                "question_group": "2",
                                "weightage": 22.5,
                                "question_type": 10,
                                "form_id": "5c36f80739473ed76e717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c502ff539473eae01e60eae"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b96",
                                "question": "Describe your rating :- S Comp 2",
                                "description": " qwertyuiopasdfghjklzxcvbnm advhbadvdv badvv af",
                                "question_group": "2",
                                "weightage": 22.5,
                                "question_type": 9,
                                "form_id": "5c36f80739473ed76e717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502ff539473eae01e60eae"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b97",
                                "question": "Please rate the employee on :- S Comp 3",
                                "description": " mhavca fafj  vasf asf asfj ajsf fna ssfjas sfa f asfj ajdfd af af abd fja jf af asf ajsfasf",
                                "header": "3",
                                "question_group": "3",
                                "weightage": 55,
                                "question_type": 10,
                                "form_id": "5c36f80739473ed76e717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c502ff539473eae01e60eae"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b98",
                                "question": "Describe your rating :- S Comp 3",
                                "description": " mhavca fafj  vasf asf asfj ajsf fna ssfjas sfa f asfj ajdfd af af abd fja jf af asf ajsfasf",
                                "question_group": "3",
                                "weightage": 55,
                                "question_type": 9,
                                "form_id": "5c36f80739473ed76e717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502ff539473eae01e60eae"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b99",
                                "question": "Please rate the employee on :- S Comp 4",
                                "description": " advhbadv afh affj adfdadf adffb adf",
                                "header": "4",
                                "question_group": "4",
                                "weightage": 0,
                                "question_type": 10,
                                "form_id": "5c36f80739473ed76e717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c502ff539473eae01e60eae"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b9a",
                                "question": "Describe your rating :- S Comp 4",
                                "description": " advhbadv afh affj adfdadf adffb adf",
                                "question_group": "4",
                                "weightage": 0,
                                "question_type": 9,
                                "form_id": "5c36f80739473ed76e717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502ff539473eae01e60eae"
                            }, {
                                "_id": "5c36f80739473ed76e717e5a",
                                "question": "What have the employee worked well in this month\/quarter\/year (depends on the appraisal frequency)?",
                                "form_id": "5c36f80739473ed76e717e57",
                                "updated_at": "2019-01-10 13:15:11",
                                "created_at": "2019-01-10 13:15:11",
                                "header": "1 Header",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502ff539473eae01e60eae"
                            }, {
                                "_id": "5c36f80739473ed76e717e5b",
                                "question": "Choose one option that you think is the employee's weakness.",
                                "form_id": "5c36f80739473ed76e717e57",
                                "updated_at": "2019-01-10 13:15:11",
                                "created_at": "2019-01-10 13:15:11",
                                "header": "",
                                "description": null,
                                "question_type": 2,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "Behaviour",
                                    "_id": {
                                        "$id": "5c125c1f39473e460c99a839"
                                    }
                                }, {
                                    "name": "Team Work",
                                    "_id": {
                                        "$id": "5c125c1f39473e460c99a83a"
                                    }
                                }, {
                                    "name": "Over Load Working",
                                    "_id": {
                                        "$id": "5c125c1f39473e460c99a83b"
                                    }
                                }, {
                                    "name": "Noting",
                                    "_id": {
                                        "$id": "5c125c1f39473e460c99a83c"
                                    }
                                }],
                                "answer": "5c125c1f39473e460c99a83c",
                                "answer_id": "5c502ff539473eae01e60eae"
                            }, {
                                "_id": "5c36f80739473ed76e717e5c",
                                "question": "Summary",
                                "form_id": "5c36f80739473ed76e717e57",
                                "updated_at": "2019-01-10 13:15:11",
                                "created_at": "2019-01-10 13:15:11",
                                "header": "Summary",
                                "description": null,
                                "question_type": 11,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "sandesh.c@mailinator.com",
                                "answer_id": "5c502ff539473eae01e60eae"
                            }]
                        },
                        "rating": 5,
                        "overall_rating": 4,
                        "recommended_for_promotion": true,
                        "reviewer_type": "manager",
                        "status": 2
                    },
                    "rating_details": {
                        "goal": {
                            "rating": 3,
                            "rating_text": "Exceeds Expectations",
                            "weight": 50
                        },
                        "competency": {
                            "rating": 5,
                            "rating_text": "Truly Outstanding",
                            "weight": 50
                        },
                        "overall_rating": 4,
                        "overall_rating_text": ""
                    },
                    "review_status": 1,
                    "recommendation_details": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5bc0667d39473e3d1297e24c",
                                "form_id": "5bc0663e39473e271197e249",
                                "question": "Why you recommending the employee?",
                                "description": null,
                                "question_type": 2,
                                "isMandatory": true,
                                "isConditional": false,
                                "options": [{
                                    "name": "High",
                                    "_id": {
                                        "$id": "5bc066a339473ec31297e249"
                                    }
                                }, {
                                    "name": "Medium",
                                    "_id": {
                                        "$id": "5bc066a339473ec31297e24a"
                                    }
                                }, {
                                    "name": "Low",
                                    "_id": {
                                        "$id": "5bc066a339473ec31297e24b"
                                    }
                                }],
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "updated_at": "2018-10-12 14:47:23",
                                "created_at": "2018-10-12 14:46:45",
                                "hasParent": false,
                                "answer": "5bc066a339473ec31297e24a"
                            }, {
                                "_id": "5bc066b539473eb70e97e24a",
                                "form_id": "5bc0663e39473e271197e249",
                                "question": "Description box for your choice.",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "updated_at": "2018-10-12 14:47:41",
                                "created_at": "2018-10-12 14:47:41",
                                "hasParent": false,
                                "answer": "sandesh.c@mailinator.com"
                            }, {
                                "_id": "5bc066da39473ed81297e24c",
                                "form_id": "5bc0663e39473e271197e249",
                                "question": "Checkbox",
                                "description": null,
                                "question_type": 3,
                                "isMandatory": true,
                                "isConditional": false,
                                "options": [{
                                    "name": "1 -  Did Not Meet Expectations",
                                    "_id": {
                                        "$id": "5bc066da39473ed81297e249"
                                    }
                                }, {
                                    "name": "2 - Met Some Expectations",
                                    "_id": {
                                        "$id": "5bc066da39473ed81297e24a"
                                    }
                                }, {
                                    "name": "3 - Met All Expectations",
                                    "_id": {
                                        "$id": "5bc066da39473ed81297e24b"
                                    }
                                }],
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "updated_at": "2018-10-12 14:48:18",
                                "created_at": "2018-10-12 14:48:18",
                                "hasParent": false,
                                "answer": ["5bc066da39473ed81297e249"]
                            }, {
                                "_id": "5bc066ef39473ed31397e249",
                                "form_id": "5bc0663e39473e271197e249",
                                "question": "Attachment",
                                "description": null,
                                "question_type": 13,
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "updated_at": "2018-10-12 14:48:39",
                                "created_at": "2018-10-12 14:48:39",
                                "hasParent": false,
                                "answer": "attachement_1548759022445.jpg"
                            }, {
                                "_id": "5bc066fe39473eee1397e249",
                                "form_id": "5bc0663e39473e271197e249",
                                "question": "Non mAndatory",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": false,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "updated_at": "2018-10-12 14:48:54",
                                "created_at": "2018-10-12 14:48:54",
                                "hasParent": false,
                                "answer": "sandesh.c@mailinator.com"
                            }]
                        },
                        "reviewer_type": "manager",
                        "status": 2,
                        "recommendation_id": "5c502fee39473eae01e60ead"
                    },
                    "midterm_appraisal_details": {
                        "enable": true,
                        "comment": "sandesh.c@mailinator.com"
                    },
                    "reviewee_self_evaluation": {
                        "goal": {
                            "feedbacks": {
                                "template_detail": {
                                    "questions": [{
                                        "_id": "5c371dc739473e8b0d8b4b4f",
                                        "question": "Please rate your self on :- Sandesh 1",
                                        "description": " qwertyuiop",
                                        "header": "A",
                                        "question_group": "A",
                                        "weightage": 12.5,
                                        "question_type": 10,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": 5,
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b50",
                                        "question": "Describe your Rating: :- Sandesh 1",
                                        "description": " qwertyuiop",
                                        "question_group": "A",
                                        "weightage": 12.5,
                                        "question_type": 9,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b51",
                                        "question": "Please rate your self on :- Sandesh 2",
                                        "description": " qwertyuiopoiuytrewq",
                                        "header": "B",
                                        "question_group": "B",
                                        "weightage": 12.5,
                                        "question_type": 10,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": 5,
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b52",
                                        "question": "Describe your Rating: :- Sandesh 2",
                                        "description": " qwertyuiopoiuytrewq",
                                        "question_group": "B",
                                        "weightage": 12.5,
                                        "question_type": 9,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b53",
                                        "question": "Please rate your self on :- Sandesh 3",
                                        "description": " poiuytrewq",
                                        "header": "C",
                                        "question_group": "C",
                                        "weightage": 65,
                                        "question_type": 10,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": 3,
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b54",
                                        "question": "Describe your Rating: :- Sandesh 3",
                                        "description": " poiuytrewq",
                                        "question_group": "C",
                                        "weightage": 65,
                                        "question_type": 9,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b55",
                                        "question": "Please rate your self on :- Added by admin",
                                        "description": " advvhmadv advdba av",
                                        "header": "D",
                                        "question_group": "D",
                                        "weightage": 0,
                                        "question_type": 10,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": 5,
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b56",
                                        "question": "Describe your Rating: :- Added by admin",
                                        "description": " advvhmadv advdba av",
                                        "question_group": "D",
                                        "weightage": 0,
                                        "question_type": 9,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b57",
                                        "question": "Please rate your self on :- Added by Manager",
                                        "description": " ajdvac asccb acc acasj vjascc aajsv  a asvj avas caj ab a asccag cc\nas jajff jaf \nasfkj ajf asfs\nqkhfbaehff jqbq efqf\nqhfb ajf jhbafaf\nafhkh  ahfb kabef\nafnk b akjfafb j",
                                        "header": "E",
                                        "question_group": "E",
                                        "weightage": 10,
                                        "question_type": 10,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": 5,
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b58",
                                        "question": "Describe your Rating: :- Added by Manager",
                                        "description": " ajdvac asccb acc acasj vjascc aajsv  a asvj avas caj ab a asccag cc\nas jajff jaf \nasfkj ajf asfs\nqkhfbaehff jqbq efqf\nqhfb ajf jhbafaf\nafhkh  ahfb kabef\nafnk b akjfafb j",
                                        "question_group": "E",
                                        "weightage": 10,
                                        "question_type": 9,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c36f2a439473edc58717e5c",
                                        "question": "Does your manager give you enough feedback that helps you?",
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "updated_at": "2019-01-10 12:52:12",
                                        "created_at": "2019-01-10 12:52:12",
                                        "header": "Manager Related Questions:",
                                        "description": null,
                                        "question_type": 1,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c36f2a439473edc58717e5d",
                                        "question": "What can you improve upon?",
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "updated_at": "2019-01-10 12:52:12",
                                        "created_at": "2019-01-10 12:52:12",
                                        "header": "Suggestions:",
                                        "description": null,
                                        "question_type": 2,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "options": [{
                                            "name": "Behaviour",
                                            "_id": {
                                                "$id": "5c10f1d039473e6e567037f2"
                                            }
                                        }, {
                                            "name": "Working Styles",
                                            "_id": {
                                                "$id": "5c10f1d039473e6e567037f3"
                                            }
                                        }, {
                                            "name": "Nothing",
                                            "_id": {
                                                "$id": "5c10f1d039473e6e567037f4"
                                            }
                                        }],
                                        "answer": "5c10f1d039473e6e567037f4",
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c36f2a439473edc58717e5e",
                                        "question": "Do you have any sugestions\/ feedback for the company?",
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "updated_at": "2019-01-10 12:52:12",
                                        "created_at": "2019-01-10 12:52:12",
                                        "header": null,
                                        "description": null,
                                        "question_type": 4,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "options": [{
                                            "name": "Yes , Will be discussed in meeting",
                                            "_id": {
                                                "$id": "5c10f24d39473e71597037ef"
                                            }
                                        }, {
                                            "name": "No",
                                            "_id": {
                                                "$id": "5c10f24d39473e71597037f0"
                                            }
                                        }],
                                        "answer": "5c10f24d39473e71597037ef",
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }, {
                                        "_id": "5c36f2a439473edc58717e5f",
                                        "question": "Summary",
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "updated_at": "2019-01-10 12:52:12",
                                        "created_at": "2019-01-10 12:52:12",
                                        "header": null,
                                        "description": null,
                                        "question_type": 11,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54c939473e215c08cf15"
                                    }]
                                },
                                "rating": 0,
                                "overall_rating": 4.55,
                                "recommended_for_promotion": false,
                                "reviewer_type": "self",
                                "status": 2
                            }
                        },
                        "competency": {
                            "feedbacks": {
                                "template_detail": {
                                    "questions": [{
                                        "_id": "5c371dc739473e8b0d8b4b8b",
                                        "question": "Please rate your self on :- S Comp 1",
                                        "description": " D",
                                        "header": "1",
                                        "question_group": "1",
                                        "weightage": 22.5,
                                        "question_type": 10,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": 5,
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b8c",
                                        "question": "Describe your rating :- S Comp 1",
                                        "description": " D",
                                        "question_group": "1",
                                        "weightage": 22.5,
                                        "question_type": 9,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b8d",
                                        "question": "Please rate your self on :- S Comp 2",
                                        "description": " qwertyuiopasdfghjklzxcvbnm advhbadvdv badvv af",
                                        "header": "2",
                                        "question_group": "2",
                                        "weightage": 22.5,
                                        "question_type": 10,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": 3,
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b8e",
                                        "question": "Describe your rating :- S Comp 2",
                                        "description": " qwertyuiopasdfghjklzxcvbnm advhbadvdv badvv af",
                                        "question_group": "2",
                                        "weightage": 22.5,
                                        "question_type": 9,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b8f",
                                        "question": "Please rate your self on :- S Comp 3",
                                        "description": " mhavca fafj  vasf asf asfj ajsf fna ssfjas sfa f asfj ajdfd af af abd fja jf af asf ajsfasf",
                                        "header": "3",
                                        "question_group": "3",
                                        "weightage": 55,
                                        "question_type": 10,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": 5,
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b90",
                                        "question": "Describe your rating :- S Comp 3",
                                        "description": " mhavca fafj  vasf asf asfj ajsf fna ssfjas sfa f asfj ajdfd af af abd fja jf af asf ajsfasf",
                                        "question_group": "3",
                                        "weightage": 55,
                                        "question_type": 9,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b91",
                                        "question": "Please rate your self on :- S Comp 4",
                                        "description": " advhbadv afh affj adfdadf adffb adf",
                                        "header": "4",
                                        "question_group": "4",
                                        "weightage": 0,
                                        "question_type": 10,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": 5,
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }, {
                                        "_id": "5c371dc739473e8b0d8b4b92",
                                        "question": "Describe your rating :- S Comp 4",
                                        "description": " advhbadv afh affj adfdadf adffb adf",
                                        "question_group": "4",
                                        "weightage": 0,
                                        "question_type": 9,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-10 15:56:15",
                                        "created_at": "2019-01-10 15:56:15",
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }, {
                                        "_id": "5c36f2f539473ea55b717e5a",
                                        "question": "What have you worked well in this month\/quarter\/year (depends on the appraisal frequency)?",
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "updated_at": "2019-01-10 12:53:33",
                                        "created_at": "2019-01-10 12:53:33",
                                        "header": "Open Text Field:",
                                        "description": null,
                                        "question_type": 1,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }, {
                                        "_id": "5c36f2f539473ea55b717e5b",
                                        "question": "Choose one option that you think is your weakness.",
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "updated_at": "2019-01-10 12:53:33",
                                        "created_at": "2019-01-10 12:53:33",
                                        "header": "Multiple choice question:",
                                        "description": null,
                                        "question_type": 2,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "options": [{
                                            "name": "Behaviour",
                                            "_id": {
                                                "$id": "5c10f64039473e3e697037ef"
                                            }
                                        }, {
                                            "name": "Team Work",
                                            "_id": {
                                                "$id": "5c10f64039473e3e697037f0"
                                            }
                                        }, {
                                            "name": "Over Load Working",
                                            "_id": {
                                                "$id": "5c10f64039473e3e697037f1"
                                            }
                                        }, {
                                            "name": "Noting",
                                            "_id": {
                                                "$id": "5c10f64039473e3e697037f2"
                                            }
                                        }],
                                        "answer": "5c10f64039473e3e697037f0",
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }, {
                                        "_id": "5c36f2f539473ea55b717e5c",
                                        "question": "Summary",
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "updated_at": "2019-01-10 12:53:33",
                                        "created_at": "2019-01-10 12:53:33",
                                        "header": "Summary",
                                        "description": null,
                                        "question_type": 11,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                        "answer_id": "5c3c54dd39473e455d08cf15"
                                    }]
                                },
                                "rating": 4.55,
                                "overall_rating": 4.55,
                                "recommended_for_promotion": false,
                                "reviewer_type": "self",
                                "status": 2
                            }
                        },
                        "rating_details": {
                            "goal": {
                                "rating": 0,
                                "rating_text": "",
                                "weight": 0
                            },
                            "competency": {
                                "rating": 4.55,
                                "rating_text": "Greatly Exceeds Expectations",
                                "weight": 100
                            },
                            "overall_rating": 4.55,
                            "overall_rating_text": ""
                        },
                        "settings": {
                            "enable_goal": true,
                            "enable_competency": true,
                            "goal_calculation_type": "",
                            "competency_calculation_type": 2
                        }
                    },
                    "review_anonymously": false,
                    "accepted_config": {
                        "manager": false,
                        "skip_manager": false,
                        "direct_reports": false,
                        "peer": false,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59": false,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36eb5339473e0d3a717e59_team": false
                    }
                }
            };
        };
        this.buildSampleResponseBug4330 = function () {
            return {
                "status": "success",
                "message": "",
                "data": {
                    "cycle_name": "Relationship Test Cycle 1",
                    "rating_setting": [{
                        "score": 5,
                        "description": "Truly Outstanding"
                    }, {
                        "score": 4,
                        "description": "Greatly Exceeds Expectations"
                    }, {
                        "score": 3,
                        "description": "Exceeds Expectations"
                    }, {
                        "score": 2,
                        "description": "Meets Expectations"
                    }, {
                        "score": 1,
                        "description": "Below Expectations"
                    }],
                    "settings": {
                        "self_evaluation": true,
                        "enable_goal": true,
                        "enable_competency": true,
                        "ratings": [{
                            "score": 5,
                            "description": "Truly Outstanding"
                        }, {
                            "score": 4,
                            "description": "Greatly Exceeds Expectations"
                        }, {
                            "score": 3,
                            "description": "Exceeds Expectations"
                        }, {
                            "score": 2,
                            "description": "Meets Expectations"
                        }, {
                            "score": 1,
                            "description": "Below Expectations"
                        }],
                        "enable_rating_goal": false,
                        "goal_calculation_type": null,
                        "enable_rating_competency": true,
                        "competency_calculation_type": 2
                    },
                    "in_duration": true,
                    "reviewee": {
                        "personal_profile_employee_code": "MTF0003",
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "reviewer": {
                        "personal_profile_employee_code": "MTF0003",
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "goal_feedbacks": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5c371dc739473e8b0d8b4b4f",
                                "question": "Please rate your self on :- Sandesh 1",
                                "description": " qwertyuiop",
                                "header": "A",
                                "question_group": "A",
                                "weightage": 12.5,
                                "question_type": 10,
                                "form_id": "5c36f2a439473edc58717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b50",
                                "question": "Describe your Rating: :- Sandesh 1",
                                "description": " qwertyuiop",
                                "question_group": "A",
                                "weightage": 12.5,
                                "question_type": 9,
                                "form_id": "5c36f2a439473edc58717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b51",
                                "question": "Please rate your self on :- Sandesh 2",
                                "description": " qwertyuiopoiuytrewq",
                                "header": "B",
                                "question_group": "B",
                                "weightage": 12.5,
                                "question_type": 10,
                                "form_id": "5c36f2a439473edc58717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b52",
                                "question": "Describe your Rating: :- Sandesh 2",
                                "description": " qwertyuiopoiuytrewq",
                                "question_group": "B",
                                "weightage": 12.5,
                                "question_type": 9,
                                "form_id": "5c36f2a439473edc58717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b53",
                                "question": "Please rate your self on :- Sandesh 3",
                                "description": " poiuytrewq",
                                "header": "C",
                                "question_group": "C",
                                "weightage": 65,
                                "question_type": 10,
                                "form_id": "5c36f2a439473edc58717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 3,
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b54",
                                "question": "Describe your Rating: :- Sandesh 3",
                                "description": " poiuytrewq",
                                "question_group": "C",
                                "weightage": 65,
                                "question_type": 9,
                                "form_id": "5c36f2a439473edc58717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b55",
                                "question": "Please rate your self on :- Added by admin",
                                "description": " advvhmadv advdba av",
                                "header": "D",
                                "question_group": "D",
                                "weightage": 0,
                                "question_type": 10,
                                "form_id": "5c36f2a439473edc58717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b56",
                                "question": "Describe your Rating: :- Added by admin",
                                "description": " advvhmadv advdba av",
                                "question_group": "D",
                                "weightage": 0,
                                "question_type": 9,
                                "form_id": "5c36f2a439473edc58717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b57",
                                "question": "Please rate your self on :- Added by Manager",
                                "description": " ajdvac asccb acc acasj vjascc aajsv  a asvj avas caj ab a asccag cc\nas jajff jaf \nasfkj ajf asfs\nqkhfbaehff jqbq efqf\nqhfb ajf jhbafaf\nafhkh  ahfb kabef\nafnk b akjfafb j",
                                "header": "E",
                                "question_group": "E",
                                "weightage": 10,
                                "question_type": 10,
                                "form_id": "5c36f2a439473edc58717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b58",
                                "question": "Describe your Rating: :- Added by Manager",
                                "description": " ajdvac asccb acc acasj vjascc aajsv  a asvj avas caj ab a asccag cc\nas jajff jaf \nasfkj ajf asfs\nqkhfbaehff jqbq efqf\nqhfb ajf jhbafaf\nafhkh  ahfb kabef\nafnk b akjfafb j",
                                "question_group": "E",
                                "weightage": 10,
                                "question_type": 9,
                                "form_id": "5c36f2a439473edc58717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c36f2a439473edc58717e5c",
                                "question": "Does your manager give you enough feedback that helps you?",
                                "form_id": "5c36f2a439473edc58717e59",
                                "updated_at": "2019-01-10 12:52:12",
                                "created_at": "2019-01-10 12:52:12",
                                "header": "Manager Related Questions:",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c36f2a439473edc58717e5d",
                                "question": "What can you improve upon?",
                                "form_id": "5c36f2a439473edc58717e59",
                                "updated_at": "2019-01-10 12:52:12",
                                "created_at": "2019-01-10 12:52:12",
                                "header": "Suggestions:",
                                "description": null,
                                "question_type": 2,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "Behaviour",
                                    "_id": {
                                        "$id": "5c10f1d039473e6e567037f2"
                                    }
                                }, {
                                    "name": "Working Styles",
                                    "_id": {
                                        "$id": "5c10f1d039473e6e567037f3"
                                    }
                                }, {
                                    "name": "Nothing",
                                    "_id": {
                                        "$id": "5c10f1d039473e6e567037f4"
                                    }
                                }],
                                "answer": "5c10f1d039473e6e567037f4",
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c36f2a439473edc58717e5e",
                                "question": "Do you have any sugestions\/ feedback for the company?",
                                "form_id": "5c36f2a439473edc58717e59",
                                "updated_at": "2019-01-10 12:52:12",
                                "created_at": "2019-01-10 12:52:12",
                                "header": null,
                                "description": null,
                                "question_type": 4,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "Yes , Will be discussed in meeting",
                                    "_id": {
                                        "$id": "5c10f24d39473e71597037ef"
                                    }
                                }, {
                                    "name": "No",
                                    "_id": {
                                        "$id": "5c10f24d39473e71597037f0"
                                    }
                                }],
                                "answer": "5c10f24d39473e71597037ef",
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }, {
                                "_id": "5c36f2a439473edc58717e5f",
                                "question": "Summary",
                                "form_id": "5c36f2a439473edc58717e59",
                                "updated_at": "2019-01-10 12:52:12",
                                "created_at": "2019-01-10 12:52:12",
                                "header": null,
                                "description": null,
                                "question_type": 11,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54c939473e215c08cf15"
                            }]
                        },
                        "rating": 0,
                        "overall_rating": 4.55,
                        "recommended_for_promotion": false,
                        "reviewer_type": "self",
                        "status": 2
                    },
                    "competency_feedbacks": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5c371dc739473e8b0d8b4b8b",
                                "question": "Please rate your self on :- S Comp 1",
                                "description": " D",
                                "header": "1",
                                "question_group": "1",
                                "weightage": 22.5,
                                "question_type": 10,
                                "form_id": "5c36f2f539473ea55b717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b8c",
                                "question": "Describe your rating :- S Comp 1",
                                "description": " D",
                                "question_group": "1",
                                "weightage": 22.5,
                                "question_type": 9,
                                "form_id": "5c36f2f539473ea55b717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b8d",
                                "question": "Please rate your self on :- S Comp 2",
                                "description": " qwertyuiopasdfghjklzxcvbnm advhbadvdv badvv af",
                                "header": "2",
                                "question_group": "2",
                                "weightage": 22.5,
                                "question_type": 10,
                                "form_id": "5c36f2f539473ea55b717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 3,
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b8e",
                                "question": "Describe your rating :- S Comp 2",
                                "description": " qwertyuiopasdfghjklzxcvbnm advhbadvdv badvv af",
                                "question_group": "2",
                                "weightage": 22.5,
                                "question_type": 9,
                                "form_id": "5c36f2f539473ea55b717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b8f",
                                "question": "Please rate your self on :- S Comp 3",
                                "description": " mhavca fafj  vasf asf asfj ajsf fna ssfjas sfa f asfj ajdfd af af abd fja jf af asf ajsfasf",
                                "header": "3",
                                "question_group": "3",
                                "weightage": 55,
                                "question_type": 10,
                                "form_id": "5c36f2f539473ea55b717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b90",
                                "question": "Describe your rating :- S Comp 3",
                                "description": " mhavca fafj  vasf asf asfj ajsf fna ssfjas sfa f asfj ajdfd af af abd fja jf af asf ajsfasf",
                                "question_group": "3",
                                "weightage": 55,
                                "question_type": 9,
                                "form_id": "5c36f2f539473ea55b717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b91",
                                "question": "Please rate your self on :- S Comp 4",
                                "description": " advhbadv afh affj adfdadf adffb adf",
                                "header": "4",
                                "question_group": "4",
                                "weightage": 0,
                                "question_type": 10,
                                "form_id": "5c36f2f539473ea55b717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": 5,
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }, {
                                "_id": "5c371dc739473e8b0d8b4b92",
                                "question": "Describe your rating :- S Comp 4",
                                "description": " advhbadv afh affj adfdadf adffb adf",
                                "question_group": "4",
                                "weightage": 0,
                                "question_type": 9,
                                "form_id": "5c36f2f539473ea55b717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737af3e",
                                "updated_at": "2019-01-10 15:56:15",
                                "created_at": "2019-01-10 15:56:15",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }, {
                                "_id": "5c36f2f539473ea55b717e5a",
                                "question": "What have you worked well in this month\/quarter\/year (depends on the appraisal frequency)?",
                                "form_id": "5c36f2f539473ea55b717e57",
                                "updated_at": "2019-01-10 12:53:33",
                                "created_at": "2019-01-10 12:53:33",
                                "header": "Open Text Field:",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }, {
                                "_id": "5c36f2f539473ea55b717e5b",
                                "question": "Choose one option that you think is your weakness.",
                                "form_id": "5c36f2f539473ea55b717e57",
                                "updated_at": "2019-01-10 12:53:33",
                                "created_at": "2019-01-10 12:53:33",
                                "header": "Multiple choice question:",
                                "description": null,
                                "question_type": 2,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "Behaviour",
                                    "_id": {
                                        "$id": "5c10f64039473e3e697037ef"
                                    }
                                }, {
                                    "name": "Team Work",
                                    "_id": {
                                        "$id": "5c10f64039473e3e697037f0"
                                    }
                                }, {
                                    "name": "Over Load Working",
                                    "_id": {
                                        "$id": "5c10f64039473e3e697037f1"
                                    }
                                }, {
                                    "name": "Noting",
                                    "_id": {
                                        "$id": "5c10f64039473e3e697037f2"
                                    }
                                }],
                                "answer": "5c10f64039473e3e697037f0",
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }, {
                                "_id": "5c36f2f539473ea55b717e5c",
                                "question": "Summary",
                                "form_id": "5c36f2f539473ea55b717e57",
                                "updated_at": "2019-01-10 12:53:33",
                                "created_at": "2019-01-10 12:53:33",
                                "header": "Summary",
                                "description": null,
                                "question_type": 11,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c54dd39473e455d08cf15"
                            }]
                        },
                        "rating": 4.55,
                        "overall_rating": 4.55,
                        "recommended_for_promotion": false,
                        "reviewer_type": "self",
                        "status": 2
                    },
                    "rating_details": {
                        "goal": {
                            "rating": 0,
                            "rating_text": "",
                            "weight": 0
                        },
                        "competency": {
                            "rating": 4.55,
                            "rating_text": "Greatly Exceeds Expectations",
                            "weight": 100
                        },
                        "overall_rating": 4.55,
                        "overall_rating_text": ""
                    }
                }
            };
        };
        this.buildSampleResponseBug4324 = function () {
            return {
                "status": "success",
                "message": "",
                "data": {
                    "cycle_name": "All Relationship ON",
                    "rating_setting": [{
                        "score": 5,
                        "description": "Truly Outstanding"
                    }, {
                        "score": 4,
                        "description": "Greatly Exceeds Expectations"
                    }, {
                        "score": 3,
                        "description": "Exceeds Expectations"
                    }, {
                        "score": 2,
                        "description": "Meets Expectations"
                    }, {
                        "score": 1,
                        "description": "Below Expectations"
                    }],
                    "settings": {
                        "promotion_recommendation_to_employee": "2",
                        "enable_goal": false,
                        "enable_competency": true,
                        "fill_midterm": false,
                        "ratings": [{
                            "score": 5,
                            "description": "Truly Outstanding"
                        }, {
                            "score": 4,
                            "description": "Greatly Exceeds Expectations"
                        }, {
                            "score": 3,
                            "description": "Exceeds Expectations"
                        }, {
                            "score": 2,
                            "description": "Meets Expectations"
                        }, {
                            "score": 1,
                            "description": "Below Expectations"
                        }],
                        "ratings_range": [{
                            "min": 3,
                            "max": 5,
                            "description": "Awesome!"
                        }, {
                            "min": 2,
                            "max": 2.99,
                            "description": "Avergae!"
                        }, {
                            "min": 1,
                            "max": 1.99,
                            "description": "Poor!"
                        }],
                        "enable_rating_goal": false,
                        "goal_calculation_type": null,
                        "enable_rating_competency": true,
                        "competency_calculation_type": 2
                    },
                    "in_duration": false,
                    "reviewee": {
                        "personal_profile_employee_code": "MTF0003",
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "reviewer": {
                        "personal_profile_employee_code": "MTF4829",
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "competency_feedbacks": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5c4acf9339473e5f40fcc410",
                                "question": "Please rate on the Competency : 1",
                                "form_id": "5c4acf9339473e5f40fcc40f",
                                "updated_at": "2019-01-25 14:27:55",
                                "created_at": "2019-01-25 14:27:55",
                                "header": "1. Competency",
                                "description": null,
                                "question_type": 15,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": 4,
                                "answer_id": "5c5010af39473e857de60eaa"
                            }, {
                                "_id": "5c4acf9339473e5f40fcc411",
                                "question": "Please rate on the competency : 2",
                                "form_id": "5c4acf9339473e5f40fcc40f",
                                "updated_at": "2019-01-25 14:27:55",
                                "created_at": "2019-01-25 14:27:55",
                                "header": null,
                                "description": null,
                                "question_type": 15,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": 1,
                                "answer_id": "5c5010af39473e857de60eaa"
                            }, {
                                "_id": "5c4acf9339473e5f40fcc412",
                                "question": "Please rate on the competency : 3",
                                "form_id": "5c4acf9339473e5f40fcc40f",
                                "updated_at": "2019-01-25 14:27:55",
                                "created_at": "2019-01-25 14:27:55",
                                "header": null,
                                "description": null,
                                "question_type": 15,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": 5,
                                "answer_id": "5c5010af39473e857de60eaa"
                            }, {
                                "_id": "5c4acf9339473e5f40fcc413",
                                "question": "Please rate on the competency : 4",
                                "form_id": "5c4acf9339473e5f40fcc40f",
                                "updated_at": "2019-01-25 14:27:55",
                                "created_at": "2019-01-25 14:27:55",
                                "header": "Competency 4 Header",
                                "description": null,
                                "question_type": 15,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": 5,
                                "answer_id": "5c5010af39473e857de60eaa"
                            }, {
                                "_id": "5c4acf9339473e5f40fcc414",
                                "question": "Justify your answer for the 4",
                                "form_id": "5c4acf9339473e5f40fcc40f",
                                "updated_at": "2019-01-25 14:28:30",
                                "created_at": "2019-01-25 14:27:55",
                                "header": null,
                                "description": null,
                                "question_type": 16,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [],
                                "answer": "Bearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbI",
                                "answer_id": "5c5010af39473e857de60eaa"
                            }, {
                                "_id": "5c4acf9339473e5f40fcc415",
                                "question": "Please rate on the competency : 5",
                                "form_id": "5c4acf9339473e5f40fcc40f",
                                "updated_at": "2019-01-25 14:27:55",
                                "created_at": "2019-01-25 14:27:55",
                                "header": null,
                                "description": null,
                                "question_type": 15,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": 3,
                                "answer_id": "5c5010af39473e857de60eaa"
                            }, {
                                "_id": "5c4acf9339473e5f40fcc416",
                                "question": "Is your manager fair in their judgement and conduct?",
                                "form_id": "5c4acf9339473e5f40fcc40f",
                                "updated_at": "2019-01-25 14:27:55",
                                "created_at": "2019-01-25 14:27:55",
                                "header": null,
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "Bearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbI",
                                "answer_id": "5c5010af39473e857de60eaa"
                            }, {
                                "_id": "5c4acf9339473e5f40fcc417",
                                "question": "Summary",
                                "form_id": "5c4acf9339473e5f40fcc40f",
                                "updated_at": "2019-01-25 14:27:55",
                                "created_at": "2019-01-25 14:27:55",
                                "header": null,
                                "description": null,
                                "question_type": 11,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "v",
                                "answer_id": "5c5010af39473e857de60eaa"
                            }]
                        },
                        "rating": 3.6,
                        "overall_rating": 0,
                        "recommended_for_promotion": false,
                        "reviewer_type": "5c36eb5339473e0d3a717e59_team",
                        "status": 2
                    },
                    "rating_details": {
                        "goal": {
                            "rating": "",
                            "rating_text": "",
                            "weight": null
                        },
                        "competency": {
                            "rating": 3.6,
                            "rating_text": "Awesome!",
                            "weight": null
                        },
                        "overall_rating": 0,
                        "overall_rating_text": ""
                    },
                    "review_status": 1,
                    "reviewee_self_evaluation": {
                        "goal": {
                            "feedbacks": {
                                "template_detail": {
                                    "questions": [{
                                        "_id": "5c4b11eb39473e60578b462a",
                                        "question": "Rate the employee on: :- Execution plan for MS team 71",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 75",
                                        "header": "Header 2",
                                        "question_group": "Header 2",
                                        "weightage": 20,
                                        "question_type": 10,
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b462b",
                                        "question": "Justify your answer :- Execution plan for MS team 71",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 75",
                                        "question_group": "Header 2",
                                        "weightage": 20,
                                        "question_type": 9,
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b462c",
                                        "question": "Rate the employee on: :- Execution plan for MS team 72",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 76",
                                        "header": "Header 3",
                                        "question_group": "Header 3",
                                        "weightage": 20,
                                        "question_type": 10,
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b462d",
                                        "question": "Justify your answer :- Execution plan for MS team 72",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 76",
                                        "question_group": "Header 3",
                                        "weightage": 20,
                                        "question_type": 9,
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b462e",
                                        "question": "Rate the employee on: :- Execution plan for MS team 73",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 77",
                                        "header": "Header 4",
                                        "question_group": "Header 4",
                                        "weightage": 60,
                                        "question_type": 10,
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b462f",
                                        "question": "Justify your answer :- Execution plan for MS team 73",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 77",
                                        "question_group": "Header 4",
                                        "weightage": 60,
                                        "question_type": 9,
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b4630",
                                        "question": "Rate the employee on: :- Execution plan for MS team 74",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 78",
                                        "header": "Header 5",
                                        "question_group": "Header 5",
                                        "weightage": 0,
                                        "question_type": 10,
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b4631",
                                        "question": "Justify your answer :- Execution plan for MS team 74",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 78",
                                        "question_group": "Header 5",
                                        "weightage": 0,
                                        "question_type": 9,
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b4632",
                                        "question": "Rate the employee on: :- Execution plan for MS team 75",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 79",
                                        "header": "Header 6",
                                        "question_group": "Header 6",
                                        "weightage": 0,
                                        "question_type": 10,
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b4633",
                                        "question": "Justify your answer :- Execution plan for MS team 75",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 79",
                                        "question_group": "Header 6",
                                        "weightage": 0,
                                        "question_type": 9,
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4acec639473e122dfcc42e",
                                        "question": "Does your manager give you enough feedback that helps you?",
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "updated_at": "2019-01-25 14:24:30",
                                        "created_at": "2019-01-25 14:24:30",
                                        "header": "1.",
                                        "description": null,
                                        "question_type": 1,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4acec639473e122dfcc42f",
                                        "question": "What can the employee improve upon?",
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "updated_at": "2019-01-25 14:24:30",
                                        "created_at": "2019-01-25 14:24:30",
                                        "header": null,
                                        "description": null,
                                        "question_type": 2,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "options": [{
                                            "name": "Behaviour",
                                            "_id": {
                                                "$id": "5c3ee3ed39473e5363653732"
                                            }
                                        }, {
                                            "name": "Skill",
                                            "_id": {
                                                "$id": "5c3ee3ed39473e5363653733"
                                            }
                                        }],
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4acec639473e122dfcc430",
                                        "question": "Assess the employee's behaviour on Nearbuy's core value: Performance",
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "updated_at": "2019-01-25 14:24:30",
                                        "created_at": "2019-01-25 14:24:30",
                                        "header": "3. Open Text again",
                                        "description": null,
                                        "question_type": 1,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4acec639473e122dfcc431",
                                        "question": "Summary",
                                        "form_id": "5c4acec639473e122dfcc42b",
                                        "updated_at": "2019-01-25 14:24:30",
                                        "created_at": "2019-01-25 14:24:30",
                                        "header": null,
                                        "description": null,
                                        "question_type": 11,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "",
                                        "answer_id": ""
                                    }]
                                },
                                "rating": "",
                                "overall_rating": "",
                                "recommended_for_promotion": false,
                                "reviewer_type": "",
                                "status": ""
                            }
                        },
                        "competency": {
                            "feedbacks": {
                                "template_detail": {
                                    "questions": [{
                                        "_id": "5c4b11eb39473e60578b4634",
                                        "question": "Please rate the employee on: :- Cross Functional Relationships & Stakeholder Management 76",
                                        "description": " As per targets assigned 76",
                                        "header": "Header 68",
                                        "question_group": "Header 68",
                                        "question_type": 10,
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b4635",
                                        "question": "Please rate the employee on: :- Cross Functional Relationships & Stakeholder Management 77",
                                        "description": " As per targets assigned 77",
                                        "header": "Header 69",
                                        "question_group": "Header 69",
                                        "question_type": 10,
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b4636",
                                        "question": "Please rate the employee on: :- Cross Functional Relationships & Stakeholder Management 78",
                                        "description": " As per targets assigned 78",
                                        "header": "",
                                        "question_group": "",
                                        "question_type": 10,
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b4637",
                                        "question": "Please rate the employee on: :- Cross Functional Relationships & Stakeholder Management 79",
                                        "description": " As per targets assigned 79",
                                        "question_group": "",
                                        "question_type": 10,
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4b11eb39473e60578b4638",
                                        "question": "Please rate the employee on: :- Cross Functional Relationships & Stakeholder Management 80",
                                        "description": " As per targets assigned 80",
                                        "question_group": "",
                                        "question_type": 10,
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737af3e",
                                        "updated_at": "2019-01-25 19:10:59",
                                        "created_at": "2019-01-25 19:10:59",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4acf5739473ec43efcc411",
                                        "question": "Open Text 1",
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "updated_at": "2019-01-25 14:26:55",
                                        "created_at": "2019-01-25 14:26:55",
                                        "header": "Open Text Field, Multiple choice, Checkbox, Open Text, Multiple Choice ,Summury",
                                        "description": null,
                                        "question_type": 1,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4acf5739473ec43efcc412",
                                        "question": "Multiple 1",
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "updated_at": "2019-01-25 14:26:55",
                                        "created_at": "2019-01-25 14:26:55",
                                        "header": null,
                                        "description": null,
                                        "question_type": 2,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "options": [{
                                            "name": "Option1",
                                            "_id": {
                                                "$id": "5c4048b539473ed25ff91718"
                                            }
                                        }, {
                                            "name": "Option2",
                                            "_id": {
                                                "$id": "5c4048b539473ed25ff91719"
                                            }
                                        }],
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4acf5739473ec43efcc413",
                                        "question": "Checkbox 1",
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "updated_at": "2019-01-25 14:26:55",
                                        "created_at": "2019-01-25 14:26:55",
                                        "header": null,
                                        "description": null,
                                        "question_type": 3,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "options": [{
                                            "name": "Option1",
                                            "_id": {
                                                "$id": "5c4048c339473ebb5ff916b5"
                                            }
                                        }, {
                                            "name": "Option2",
                                            "_id": {
                                                "$id": "5c4048c339473ebb5ff916b6"
                                            }
                                        }],
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4acf5739473ec43efcc414",
                                        "question": "Open Text 2",
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "updated_at": "2019-01-25 14:26:55",
                                        "created_at": "2019-01-25 14:26:55",
                                        "header": null,
                                        "description": null,
                                        "question_type": 1,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4acf5739473ec43efcc415",
                                        "question": "Multiple 2",
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "updated_at": "2019-01-25 14:26:55",
                                        "created_at": "2019-01-25 14:26:55",
                                        "header": null,
                                        "description": null,
                                        "question_type": 2,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "options": [{
                                            "name": "Option1",
                                            "_id": {
                                                "$id": "5c4048dd39473e4f5bf916cf"
                                            }
                                        }, {
                                            "name": "Option2",
                                            "_id": {
                                                "$id": "5c4048dd39473e4f5bf916d0"
                                            }
                                        }],
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c4acf5739473ec43efcc416",
                                        "question": "Summary",
                                        "form_id": "5c4acf5739473ec43efcc40f",
                                        "updated_at": "2019-01-25 14:26:55",
                                        "created_at": "2019-01-25 14:26:55",
                                        "header": null,
                                        "description": null,
                                        "question_type": 11,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "",
                                        "answer_id": ""
                                    }]
                                },
                                "rating": "",
                                "overall_rating": "",
                                "recommended_for_promotion": false,
                                "reviewer_type": "",
                                "status": ""
                            }
                        },
                        "rating_details": {
                            "goal": {
                                "rating": "",
                                "rating_text": "",
                                "weight": 70
                            },
                            "competency": {
                                "rating": "",
                                "rating_text": "",
                                "weight": 30
                            },
                            "overall_rating": "",
                            "overall_rating_text": ""
                        },
                        "settings": {
                            "enable_goal": true,
                            "enable_competency": true,
                            "goal_calculation_type": 2,
                            "competency_calculation_type": 2
                        }
                    }
                }
            };
        };
        this.buildSampleResponseBug4303old = function () {
            return {
                "status": "success",
                "message": "",
                "data": {
                    "cycle_name": "Relationship Test Cycle 1",
                    "rating_setting": [{
                        "score": 5,
                        "description": "Truly Outstanding"
                    }, {
                        "score": 4,
                        "description": "Greatly Exceeds Expectations"
                    }, {
                        "score": 3,
                        "description": "Exceeds Expectations"
                    }, {
                        "score": 2,
                        "description": "Meets Expectations"
                    }, {
                        "score": 1,
                        "description": "Below Expectations"
                    }],
                    "settings": {
                        "promotion_recommendation_to_employee": "2",
                        "enable_goal": true,
                        "enable_competency": true,
                        "fill_recommendation": false,
                        "fill_midterm": true,
                        "ratings": [{
                            "score": 5,
                            "description": "Truly Outstanding"
                        }, {
                            "score": 4,
                            "description": "Greatly Exceeds Expectations"
                        }, {
                            "score": 3,
                            "description": "Exceeds Expectations"
                        }, {
                            "score": 2,
                            "description": "Meets Expectations"
                        }, {
                            "score": 1,
                            "description": "Below Expectations"
                        }],
                        "enable_rating_goal": true,
                        "goal_calculation_type": 2,
                        "enable_rating_competency": true,
                        "competency_calculation_type": 2
                    },
                    "in_duration": true,
                    "reviewee": {
                        "personal_profile_employee_code": "MTF0013",
                        "user_id": "5ba8978b39473e126937afa3",
                        "full_name": "Chethan Joshi",
                        "_id": "5ba8973439473e7a6737aeb2",
                        "profile_pic": "http:\/\/prod2.qandle.com\/images\/no-avatar.png",
                        "display_detail": ["Chethan Joshi", "BoxC", "Area Partner"]
                    },
                    "reviewer": {
                        "personal_profile_employee_code": "MTF0003",
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "goal_feedbacks": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5c371dc639473e8b0d8b4825",
                                "question": "Team Lead - Please rate the employee on :- Execution plan for MS team 21",
                                "description": " Training, Work Delegation, Conflict Management, Morale 21",
                                "header": "Header 2 ",
                                "question_group": "Header 2 ",
                                "weightage": 10,
                                "question_type": 10,
                                "form_id": "5c36f8d939473e6472717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": 5,
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4826",
                                "question": "Describe your Rating: :- Execution plan for MS team 21",
                                "description": " Training, Work Delegation, Conflict Management, Morale 21",
                                "question_group": "Header 2 ",
                                "weightage": 10,
                                "question_type": 9,
                                "form_id": "5c36f8d939473e6472717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4827",
                                "question": "Team Lead - Please rate the employee on :- Execution plan for MS team 25",
                                "description": " Training, Work Delegation, Conflict Management, Morale 25",
                                "question_group": "Header 2 ",
                                "weightage": 20,
                                "question_type": 10,
                                "form_id": "5c36f8d939473e6472717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": 4,
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4828",
                                "question": "Describe your Rating: :- Execution plan for MS team 25",
                                "description": " Training, Work Delegation, Conflict Management, Morale 25",
                                "question_group": "Header 2 ",
                                "weightage": 20,
                                "question_type": 9,
                                "form_id": "5c36f8d939473e6472717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4829",
                                "question": "Team Lead - Please rate the employee on :- Execution plan for MS team 22",
                                "description": " ",
                                "header": "Header 1 ",
                                "question_group": "Header 1 ",
                                "weightage": 10,
                                "question_type": 10,
                                "form_id": "5c36f8d939473e6472717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": 2,
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b482a",
                                "question": "Describe your Rating: :- Execution plan for MS team 22",
                                "description": " ",
                                "question_group": "Header 1 ",
                                "weightage": 10,
                                "question_type": 9,
                                "form_id": "5c36f8d939473e6472717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b482b",
                                "question": "Team Lead - Please rate the employee on :- Execution plan for MS team 23",
                                "description": " Training, Work Delegation, Conflict Management, Morale 23",
                                "question_group": "Header 1 ",
                                "weightage": 20,
                                "question_type": 10,
                                "form_id": "5c36f8d939473e6472717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": 3,
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b482c",
                                "question": "Describe your Rating: :- Execution plan for MS team 23",
                                "description": " Training, Work Delegation, Conflict Management, Morale 23",
                                "question_group": "Header 1 ",
                                "weightage": 20,
                                "question_type": 9,
                                "form_id": "5c36f8d939473e6472717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b482d",
                                "question": "Team Lead - Please rate the employee on :- Execution plan for MS team 24",
                                "description": " Training, Work Delegation, Conflict Management, Morale 24",
                                "header": "Header 3 ",
                                "question_group": "Header 3 ",
                                "weightage": 40,
                                "question_type": 10,
                                "form_id": "5c36f8d939473e6472717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": 5,
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b482e",
                                "question": "Describe your Rating: :- Execution plan for MS team 24",
                                "description": " Training, Work Delegation, Conflict Management, Morale 24",
                                "question_group": "Header 3 ",
                                "weightage": 40,
                                "question_type": 9,
                                "form_id": "5c36f8d939473e6472717e59",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c36f8d939473e6472717e5c",
                                "question": "Do you give employee enough feedback that helps him?",
                                "form_id": "5c36f8d939473e6472717e59",
                                "updated_at": "2019-01-10 13:18:41",
                                "created_at": "2019-01-10 13:18:41",
                                "header": "Employee Related Questions:",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c36f8d939473e6472717e5d",
                                "question": "What can the employee improve upon?",
                                "form_id": "5c36f8d939473e6472717e59",
                                "updated_at": "2019-01-10 13:18:41",
                                "created_at": "2019-01-10 13:18:41",
                                "header": "Suggestions:",
                                "description": null,
                                "question_type": 2,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "Behaviour",
                                    "_id": {
                                        "$id": "5c10f2df39473e68597037fd"
                                    }
                                }, {
                                    "name": "Working Styles",
                                    "_id": {
                                        "$id": "5c10f2df39473e68597037fe"
                                    }
                                }, {
                                    "name": "Nothing",
                                    "_id": {
                                        "$id": "5c10f2df39473e68597037ff"
                                    }
                                }],
                                "answer": "5c10f2df39473e68597037fd",
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c36f8d939473e6472717e5e",
                                "question": "Do you have any sugestions\/ feedback for the company?",
                                "form_id": "5c36f8d939473e6472717e59",
                                "updated_at": "2019-01-10 13:18:41",
                                "created_at": "2019-01-10 13:18:41",
                                "header": "Meeting",
                                "description": null,
                                "question_type": 4,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "Yes , Will be discussed in meeting",
                                    "_id": {
                                        "$id": "5c10f2cc39473e6f587037fd"
                                    }
                                }, {
                                    "name": "No",
                                    "_id": {
                                        "$id": "5c10f2cc39473e6f587037fe"
                                    }
                                }],
                                "answer": "5c10f2cc39473e6f587037fd",
                                "answer_id": "5c3c539839473e215808cf15"
                            }, {
                                "_id": "5c36f8d939473e6472717e5f",
                                "question": "Summary",
                                "form_id": "5c36f8d939473e6472717e59",
                                "updated_at": "2019-01-10 13:18:41",
                                "created_at": "2019-01-10 13:18:41",
                                "header": null,
                                "description": null,
                                "question_type": 11,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c539839473e215808cf15"
                            }]
                        },
                        "rating": 4.1,
                        "overall_rating": 3.96,
                        "recommended_for_promotion": false,
                        "reviewer_type": "5c36eb5339473e0d3a717e59",
                        "status": 2
                    },
                    "competency_feedbacks": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5c371dc639473e8b0d8b4861",
                                "question": "Team Lead: Please rate the employee on :- Cross Functional Relationships & Stakeholder Management 21",
                                "description": " As per targets assigned 21",
                                "header": "Header 1 ",
                                "question_group": "Header 1 ",
                                "weightage": 10,
                                "question_type": 10,
                                "form_id": "5c36f92839473e6074717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": 5,
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4862",
                                "question": "Describe your rating :- Cross Functional Relationships & Stakeholder Management 21",
                                "description": " As per targets assigned 21",
                                "question_group": "Header 1 ",
                                "weightage": 10,
                                "question_type": 9,
                                "form_id": "5c36f92839473e6074717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4863",
                                "question": "Team Lead: Please rate the employee on :- Cross Functional Relationships & Stakeholder Management 22",
                                "description": " As per targets assigned 22",
                                "question_group": "Header 1 ",
                                "weightage": 10,
                                "question_type": 10,
                                "form_id": "5c36f92839473e6074717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": 5,
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4864",
                                "question": "Describe your rating :- Cross Functional Relationships & Stakeholder Management 22",
                                "description": " As per targets assigned 22",
                                "question_group": "Header 1 ",
                                "weightage": 10,
                                "question_type": 9,
                                "form_id": "5c36f92839473e6074717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4865",
                                "question": "Team Lead: Please rate the employee on :- Cross Functional Relationships & Stakeholder Management 23",
                                "description": " ",
                                "question_group": "Header 1 ",
                                "weightage": 20,
                                "question_type": 10,
                                "form_id": "5c36f92839473e6074717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": 4,
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4866",
                                "question": "Describe your rating :- Cross Functional Relationships & Stakeholder Management 23",
                                "description": " ",
                                "question_group": "Header 1 ",
                                "weightage": 20,
                                "question_type": 9,
                                "form_id": "5c36f92839473e6074717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4867",
                                "question": "Team Lead: Please rate the employee on :- Cross Functional Relationships & Stakeholder Management 24",
                                "description": " As per targets assigned 24",
                                "question_group": "Header 1 ",
                                "weightage": 40,
                                "question_type": 10,
                                "form_id": "5c36f92839473e6074717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": 3,
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4868",
                                "question": "Describe your rating :- Cross Functional Relationships & Stakeholder Management 24",
                                "description": " As per targets assigned 24",
                                "question_group": "Header 1 ",
                                "weightage": 40,
                                "question_type": 9,
                                "form_id": "5c36f92839473e6074717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b4869",
                                "question": "Team Lead: Please rate the employee on :- Cross Functional Relationships & Stakeholder Management 25",
                                "description": " As per targets assigned 25",
                                "question_group": "Header 1 ",
                                "weightage": 20,
                                "question_type": 10,
                                "form_id": "5c36f92839473e6074717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": 2,
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c371dc639473e8b0d8b486a",
                                "question": "Describe your rating :- Cross Functional Relationships & Stakeholder Management 25",
                                "description": " As per targets assigned 25",
                                "question_group": "Header 1 ",
                                "weightage": 20,
                                "question_type": 9,
                                "form_id": "5c36f92839473e6074717e57",
                                "isMandatory": true,
                                "isConditional": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "isValidation": false,
                                "hasParent": false,
                                "emp_id": "5ba8973439473e7a6737aeb2",
                                "updated_at": "2019-01-10 15:56:14",
                                "created_at": "2019-01-10 15:56:14",
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c36f92839473e6074717e5a",
                                "question": "What have the employee worked well in this month\/quarter\/year (depends on the appraisal frequency)?",
                                "form_id": "5c36f92839473e6074717e57",
                                "updated_at": "2019-01-10 13:20:00",
                                "created_at": "2019-01-10 13:20:00",
                                "header": "1 Header",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c36f92839473e6074717e5b",
                                "question": "Choose one option that you think is the employee's weakness.",
                                "form_id": "5c36f92839473e6074717e57",
                                "updated_at": "2019-01-10 13:20:00",
                                "created_at": "2019-01-10 13:20:00",
                                "header": "",
                                "description": null,
                                "question_type": 2,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "Behaviour",
                                    "_id": {
                                        "$id": "5c125c1f39473e460c99a839"
                                    }
                                }, {
                                    "name": "Team Work",
                                    "_id": {
                                        "$id": "5c125c1f39473e460c99a83a"
                                    }
                                }, {
                                    "name": "Over Load Working",
                                    "_id": {
                                        "$id": "5c125c1f39473e460c99a83b"
                                    }
                                }, {
                                    "name": "Noting",
                                    "_id": {
                                        "$id": "5c125c1f39473e460c99a83c"
                                    }
                                }],
                                "answer": "5c125c1f39473e460c99a83b",
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }, {
                                "_id": "5c36f92839473e6074717e5c",
                                "question": "Summary",
                                "form_id": "5c36f92839473e6074717e57",
                                "updated_at": "2019-01-10 13:20:00",
                                "created_at": "2019-01-10 13:20:00",
                                "header": "Summary",
                                "description": null,
                                "question_type": 11,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "For a relationship overall rating is off or rating is off then in consolidated ratings that relationship should not come or if comes then the field is prefilled with 0 and should be disabled.Or give a proper message if in any relationship, the templates(goal or competency) does not containing the rating type question and if the rating is off for a relationship then fill \"0\" in the  %age field.",
                                "answer_id": "5c3c53b539473ec65708cf15"
                            }]
                        },
                        "rating": 3.4,
                        "overall_rating": 3.96,
                        "recommended_for_promotion": false,
                        "reviewer_type": "5c36eb5339473e0d3a717e59",
                        "status": 2
                    },
                    "rating_details": {
                        "goal": {
                            "rating": 4.1,
                            "rating_text": "Greatly Exceeds Expectations",
                            "weight": 80
                        },
                        "competency": {
                            "rating": 3.4,
                            "rating_text": "Exceeds Expectations",
                            "weight": 20
                        },
                        "overall_rating": 3.96,
                        "overall_rating_text": ""
                    },
                    "review_status": 1,
                    "midterm_appraisal_details": {
                        "enable": false,
                        "comment": ""
                    },
                    "reviewee_self_evaluation": {
                        "goal": {
                            "feedbacks": {
                                "template_detail": {
                                    "questions": [{
                                        "_id": "5c371dc639473e8b0d8b4807",
                                        "question": "Please rate your self on :- Execution plan for MS team 21",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 21",
                                        "header": "Header 2 ",
                                        "question_group": "Header 2 ",
                                        "weightage": 10,
                                        "question_type": 10,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b4808",
                                        "question": "Describe your Rating: :- Execution plan for MS team 21",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 21",
                                        "question_group": "Header 2 ",
                                        "weightage": 10,
                                        "question_type": 9,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b4809",
                                        "question": "Please rate your self on :- Execution plan for MS team 25",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 25",
                                        "question_group": "Header 2 ",
                                        "weightage": 20,
                                        "question_type": 10,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b480a",
                                        "question": "Describe your Rating: :- Execution plan for MS team 25",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 25",
                                        "question_group": "Header 2 ",
                                        "weightage": 20,
                                        "question_type": 9,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b480b",
                                        "question": "Please rate your self on :- Execution plan for MS team 22",
                                        "description": " ",
                                        "header": "Header 1 ",
                                        "question_group": "Header 1 ",
                                        "weightage": 10,
                                        "question_type": 10,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b480c",
                                        "question": "Describe your Rating: :- Execution plan for MS team 22",
                                        "description": " ",
                                        "question_group": "Header 1 ",
                                        "weightage": 10,
                                        "question_type": 9,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b480d",
                                        "question": "Please rate your self on :- Execution plan for MS team 23",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 23",
                                        "question_group": "Header 1 ",
                                        "weightage": 20,
                                        "question_type": 10,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b480e",
                                        "question": "Describe your Rating: :- Execution plan for MS team 23",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 23",
                                        "question_group": "Header 1 ",
                                        "weightage": 20,
                                        "question_type": 9,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b480f",
                                        "question": "Please rate your self on :- Execution plan for MS team 24",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 24",
                                        "header": "Header 3 ",
                                        "question_group": "Header 3 ",
                                        "weightage": 40,
                                        "question_type": 10,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b4810",
                                        "question": "Describe your Rating: :- Execution plan for MS team 24",
                                        "description": " Training, Work Delegation, Conflict Management, Morale 24",
                                        "question_group": "Header 3 ",
                                        "weightage": 40,
                                        "question_type": 9,
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c36f2a439473edc58717e5c",
                                        "question": "Does your manager give you enough feedback that helps you?",
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "updated_at": "2019-01-10 12:52:12",
                                        "created_at": "2019-01-10 12:52:12",
                                        "header": "Manager Related Questions:",
                                        "description": null,
                                        "question_type": 1,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c36f2a439473edc58717e5d",
                                        "question": "What can you improve upon?",
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "updated_at": "2019-01-10 12:52:12",
                                        "created_at": "2019-01-10 12:52:12",
                                        "header": "Suggestions:",
                                        "description": null,
                                        "question_type": 2,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "options": [{
                                            "name": "Behaviour",
                                            "_id": {
                                                "$id": "5c10f1d039473e6e567037f2"
                                            }
                                        }, {
                                            "name": "Working Styles",
                                            "_id": {
                                                "$id": "5c10f1d039473e6e567037f3"
                                            }
                                        }, {
                                            "name": "Nothing",
                                            "_id": {
                                                "$id": "5c10f1d039473e6e567037f4"
                                            }
                                        }],
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c36f2a439473edc58717e5e",
                                        "question": "Do you have any sugestions\/ feedback for the company?",
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "updated_at": "2019-01-10 12:52:12",
                                        "created_at": "2019-01-10 12:52:12",
                                        "header": null,
                                        "description": null,
                                        "question_type": 4,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "options": [{
                                            "name": "Yes , Will be discussed in meeting",
                                            "_id": {
                                                "$id": "5c10f24d39473e71597037ef"
                                            }
                                        }, {
                                            "name": "No",
                                            "_id": {
                                                "$id": "5c10f24d39473e71597037f0"
                                            }
                                        }],
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c36f2a439473edc58717e5f",
                                        "question": "Summary",
                                        "form_id": "5c36f2a439473edc58717e59",
                                        "updated_at": "2019-01-10 12:52:12",
                                        "created_at": "2019-01-10 12:52:12",
                                        "header": null,
                                        "description": null,
                                        "question_type": 11,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "",
                                        "answer_id": ""
                                    }]
                                },
                                "rating": "",
                                "overall_rating": "",
                                "recommended_for_promotion": false,
                                "reviewer_type": "",
                                "status": ""
                            }
                        },
                        "competency": {
                            "feedbacks": {
                                "template_detail": {
                                    "questions": [{
                                        "_id": "5c371dc639473e8b0d8b4843",
                                        "question": "Please rate your self on :- Cross Functional Relationships & Stakeholder Management 21",
                                        "description": " As per targets assigned 21",
                                        "header": "Header 1 ",
                                        "question_group": "Header 1 ",
                                        "weightage": 10,
                                        "question_type": 10,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b4844",
                                        "question": "Describe your rating :- Cross Functional Relationships & Stakeholder Management 21",
                                        "description": " As per targets assigned 21",
                                        "question_group": "Header 1 ",
                                        "weightage": 10,
                                        "question_type": 9,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b4845",
                                        "question": "Please rate your self on :- Cross Functional Relationships & Stakeholder Management 22",
                                        "description": " As per targets assigned 22",
                                        "question_group": "Header 1 ",
                                        "weightage": 10,
                                        "question_type": 10,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b4846",
                                        "question": "Describe your rating :- Cross Functional Relationships & Stakeholder Management 22",
                                        "description": " As per targets assigned 22",
                                        "question_group": "Header 1 ",
                                        "weightage": 10,
                                        "question_type": 9,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b4847",
                                        "question": "Please rate your self on :- Cross Functional Relationships & Stakeholder Management 23",
                                        "description": " ",
                                        "question_group": "Header 1 ",
                                        "weightage": 20,
                                        "question_type": 10,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b4848",
                                        "question": "Describe your rating :- Cross Functional Relationships & Stakeholder Management 23",
                                        "description": " ",
                                        "question_group": "Header 1 ",
                                        "weightage": 20,
                                        "question_type": 9,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b4849",
                                        "question": "Please rate your self on :- Cross Functional Relationships & Stakeholder Management 24",
                                        "description": " As per targets assigned 24",
                                        "question_group": "Header 1 ",
                                        "weightage": 40,
                                        "question_type": 10,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b484a",
                                        "question": "Describe your rating :- Cross Functional Relationships & Stakeholder Management 24",
                                        "description": " As per targets assigned 24",
                                        "question_group": "Header 1 ",
                                        "weightage": 40,
                                        "question_type": 9,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b484b",
                                        "question": "Please rate your self on :- Cross Functional Relationships & Stakeholder Management 25",
                                        "description": " As per targets assigned 25",
                                        "question_group": "Header 1 ",
                                        "weightage": 20,
                                        "question_type": 10,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c371dc639473e8b0d8b484c",
                                        "question": "Describe your rating :- Cross Functional Relationships & Stakeholder Management 25",
                                        "description": " As per targets assigned 25",
                                        "question_group": "Header 1 ",
                                        "weightage": 20,
                                        "question_type": 9,
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "isValidation": false,
                                        "hasParent": false,
                                        "emp_id": "5ba8973439473e7a6737aeb2",
                                        "updated_at": "2019-01-10 15:56:14",
                                        "created_at": "2019-01-10 15:56:14",
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c36f2f539473ea55b717e5a",
                                        "question": "What have you worked well in this month\/quarter\/year (depends on the appraisal frequency)?",
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "updated_at": "2019-01-10 12:53:33",
                                        "created_at": "2019-01-10 12:53:33",
                                        "header": "Open Text Field:",
                                        "description": null,
                                        "question_type": 1,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c36f2f539473ea55b717e5b",
                                        "question": "Choose one option that you think is your weakness.",
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "updated_at": "2019-01-10 12:53:33",
                                        "created_at": "2019-01-10 12:53:33",
                                        "header": "Multiple choice question:",
                                        "description": null,
                                        "question_type": 2,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "options": [{
                                            "name": "Behaviour",
                                            "_id": {
                                                "$id": "5c10f64039473e3e697037ef"
                                            }
                                        }, {
                                            "name": "Team Work",
                                            "_id": {
                                                "$id": "5c10f64039473e3e697037f0"
                                            }
                                        }, {
                                            "name": "Over Load Working",
                                            "_id": {
                                                "$id": "5c10f64039473e3e697037f1"
                                            }
                                        }, {
                                            "name": "Noting",
                                            "_id": {
                                                "$id": "5c10f64039473e3e697037f2"
                                            }
                                        }],
                                        "answer": "",
                                        "answer_id": ""
                                    }, {
                                        "_id": "5c36f2f539473ea55b717e5c",
                                        "question": "Summary",
                                        "form_id": "5c36f2f539473ea55b717e57",
                                        "updated_at": "2019-01-10 12:53:33",
                                        "created_at": "2019-01-10 12:53:33",
                                        "header": "Summary",
                                        "description": null,
                                        "question_type": 11,
                                        "isMandatory": true,
                                        "isConditional": false,
                                        "isValidation": false,
                                        "type": 2,
                                        "status": false,
                                        "deleted": false,
                                        "is_drafted": true,
                                        "is_deletable": true,
                                        "hasParent": false,
                                        "answer": "",
                                        "answer_id": ""
                                    }]
                                },
                                "rating": "",
                                "overall_rating": "",
                                "recommended_for_promotion": false,
                                "reviewer_type": "",
                                "status": ""
                            }
                        },
                        "rating_details": {
                            "goal": {
                                "rating": "",
                                "rating_text": "",
                                "weight": 0
                            },
                            "competency": {
                                "rating": "",
                                "rating_text": "",
                                "weight": 100
                            },
                            "overall_rating": "",
                            "overall_rating_text": ""
                        },
                        "settings": {
                            "enable_goal": true,
                            "enable_competency": true,
                            "goal_calculation_type": "",
                            "competency_calculation_type": 2
                        }
                    }
                }
            };
        };
        this.buildSampleResponseBug4303new = function () {
            return {
                "status": "success",
                "message": "",
                "data": {
                    "cycle_name": "CSV Upload Assign Setting Test Cycle",
                    "rating_setting": [{
                        "score": 10,
                        "description": "Truly Outstanding"
                    }, {
                        "score": 8,
                        "description": "Greatly Exceeds Expectations"
                    }, {
                        "score": 6,
                        "description": "Exceeds Expectations"
                    }, {
                        "score": 4,
                        "description": "Meets Expectations"
                    }, {
                        "score": 2,
                        "description": "Below Expectations"
                    }],
                    "settings": {
                        "promotion_recommendation_to_employee": 1,
                        "enable_goal": true,
                        "enable_competency": true,
                        "fill_midterm": false,
                        "ratings": [{
                            "score": 10,
                            "description": "Truly Outstanding"
                        }, {
                            "score": 8,
                            "description": "Greatly Exceeds Expectations"
                        }, {
                            "score": 6,
                            "description": "Exceeds Expectations"
                        }, {
                            "score": 4,
                            "description": "Meets Expectations"
                        }, {
                            "score": 2,
                            "description": "Below Expectations"
                        }],
                        "ratings_range": [{
                            "min": 7,
                            "max": 10,
                            "description": "Awesome! Boss"
                        }, {
                            "min": 4,
                            "max": 6.99,
                            "description": "Good! Keep it Up"
                        }, {
                            "min": 2,
                            "max": 3.99,
                            "description": "Poor! Need Hard Work"
                        }],
                        "enable_rating_goal": true,
                        "goal_calculation_type": 2,
                        "enable_rating_competency": true,
                        "competency_calculation_type": 2
                    },
                    "in_duration": false,
                    "reviewee": {
                        "personal_profile_employee_code": "MTF4169",
                        "user_id": "5ba8978739473e126937aea7",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "33011.",
                        "full_name": "Adarsh B",
                        "_id": "5ba8973439473e7a6737ae88",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aea7\/33011.",
                        "display_detail": ["Adarsh B", "Finance", "Assistant Manager"]
                    },
                    "reviewer": {
                        "personal_profile_employee_code": "MTF1089",
                        "user_id": "5ba8978739473e126937aeb3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "42703.",
                        "full_name": "Adil S",
                        "_id": "5ba8973439473e7a6737ae8a",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aeb3\/42703.",
                        "display_detail": ["Adil S", "Finance", "Executive"]
                    },
                    "goal_feedbacks": {
                        "template_detail": {
                            "questions": {
                                "13": {
                                    "_id": "5c3850cf39473e15172505be",
                                    "question": "Summary",
                                    "form_id": "5c3850cf39473e15172505b8",
                                    "updated_at": "2019-01-11 13:46:15",
                                    "created_at": "2019-01-11 13:46:15",
                                    "header": null,
                                    "description": null,
                                    "question_type": 11,
                                    "isMandatory": true,
                                    "isConditional": false,
                                    "isValidation": false,
                                    "type": 2,
                                    "status": false,
                                    "deleted": false,
                                    "is_drafted": true,
                                    "is_deletable": true,
                                    "hasParent": false,
                                    "answer": "Promotion\nRecommendation",
                                    "answer_id": "5c4ac49139473e9512fcc40f"
                                }
                            }
                        },
                        "recommended_for_promotion": false,
                        "reviewer_type": "5c36ea4539473e5238717e57_team",
                        "status": 2
                    },
                    "competency_feedbacks": {
                        "template_detail": {
                            "questions": {
                                "11": {
                                    "_id": "5c385bea39473e78452505bc",
                                    "question": "Summary",
                                    "form_id": "5c385bea39473e78452505b8",
                                    "updated_at": "2019-01-11 14:33:38",
                                    "created_at": "2019-01-11 14:33:38",
                                    "header": null,
                                    "description": null,
                                    "question_type": 11,
                                    "isMandatory": true,
                                    "isConditional": false,
                                    "isValidation": false,
                                    "type": 2,
                                    "status": false,
                                    "deleted": false,
                                    "is_drafted": true,
                                    "is_deletable": true,
                                    "hasParent": false,
                                    "answer": "Promotion\nRecommendation",
                                    "answer_id": "5c4ac4ad39473e7e13fcc40f"
                                }
                            }
                        },
                        "recommended_for_promotion": false,
                        "reviewer_type": "5c36ea4539473e5238717e57_team",
                        "status": 2
                    },
                    "review_status": 1,
                    "accepted_config": {
                        "manager": true,
                        "skip_manager": false,
                        "direct_reports": false,
                        "peer": false,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36ea7239473e5238717e5a_team": false,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": false,
                        "5c36eb5339473e0d3a717e59_team": false
                    }
                }
            };
        };
        this.buildSampleResponseBug4404 = function () {
            return {
                "status": "success",
                "data": [{
                    "reviewee": {
                        "personal_profile_employee_code": "MTF1089",
                        "work_profile_work_email": "adil.s@mailinator.com",
                        "work_profile_joining_date": "05\/05\/2015",
                        "user_id": "5ba8978739473e126937aeb3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "42703.",
                        "full_name": "Adil S",
                        "first_name": "Adil",
                        "emp_mobile": "",
                        "emp_email": "adil.s@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF1089",
                        "work_profile_designation": ["5ba877ca39473ea30b37ae81"],
                        "joining_date": "05 May 2015",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877ca39473ea30b37ae81",
                            "name": "Executive",
                            "slug": "executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae8a",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aeb3\/42703.",
                        "display_detail": ["Adil S", "Finance", "Executive"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "peer",
                    "released": true,
                    "accepted": true,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 4
                    },
                    "overall_rating": 3.9,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF4169",
                        "work_profile_work_email": "adarsh.b@mailinator.com",
                        "work_profile_joining_date": "25\/09\/2017",
                        "user_id": "5ba8978739473e126937aea7",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "33011.",
                        "full_name": "Adarsh B",
                        "first_name": "Adarsh",
                        "emp_mobile": "",
                        "emp_email": "adarsh.b@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF4169",
                        "work_profile_designation": ["5ba877a439473e9d0b37ae81"],
                        "joining_date": "25 September 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877a439473e9d0b37ae81",
                            "name": "Assistant Manager",
                            "slug": "assistant_manager"
                        }],
                        "_id": "5ba8973439473e7a6737ae88",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aea7\/33011.",
                        "display_detail": ["Adarsh B", "Finance", "Assistant Manager"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "5c36ea4539473e5238717e57_team",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 4
                    },
                    "overall_rating": 4.4,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF4829",
                        "work_profile_work_email": "anuradha@mailinator.com",
                        "work_profile_joining_date": "27\/02\/2018",
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "emp_mobile": "",
                        "emp_email": "anuradha@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "joining_date": "27 February 2018",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978739473e126937aea7",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "33011.",
                        "full_name": "Adarsh B",
                        "first_name": "Adarsh",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4169",
                        "work_profile_designation": ["5ba877a439473e9d0b37ae81"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877a439473e9d0b37ae81",
                            "name": "Assistant Manager",
                            "slug": "assistant_manager"
                        }],
                        "_id": "5ba8973439473e7a6737ae88",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aea7\/33011.",
                        "display_detail": ["Adarsh B", "Finance", "Assistant Manager"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": {
                        "12": true,
                        "11": true
                    },
                    "template_type": "12,11",
                    "reviewer_type": "5c36ea4539473e5238717e57",
                    "released": true,
                    "accepted": true,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 3,
                        "11": 4
                    },
                    "overall_rating": 4,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "recommendation_details": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5c4acff339473e5d42fcc410",
                                "question": "1",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 2,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "1",
                                    "_id": {
                                        "$id": "5bc067f039473e841697e24a"
                                    }
                                }, {
                                    "name": "2",
                                    "_id": {
                                        "$id": "5bc067f039473e841697e24b"
                                    }
                                }, {
                                    "name": "3",
                                    "_id": {
                                        "$id": "5bc067f039473e841697e24c"
                                    }
                                }],
                                "answer": "5bc067f039473e841697e24c"
                            }, {
                                "_id": "5c4acff339473e5d42fcc411",
                                "question": "2 Checkbox",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 3,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "1",
                                    "_id": {
                                        "$id": "5bc0680839473ecd1397e24c"
                                    }
                                }, {
                                    "name": "2",
                                    "_id": {
                                        "$id": "5bc0680839473ecd1397e24d"
                                    }
                                }, {
                                    "name": "3",
                                    "_id": {
                                        "$id": "5bc0680839473ecd1397e24e"
                                    }
                                }],
                                "answer": ["5bc0680839473ecd1397e24c"]
                            }, {
                                "_id": "5c4acff339473e5d42fcc412",
                                "question": "Open Text Field -- mendatory",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "Bearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbIBearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbIBearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbI"
                            }, {
                                "_id": "5c4acff339473e5d42fcc413",
                                "question": "Open text field -- Non Mendatory",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": false,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "Bearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbIBearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbIBearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbI"
                            }, {
                                "_id": "5c4acff339473e5d42fcc414",
                                "question": "Attachment\/Documents",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 13,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "attachement_154875071766.jpg"
                            }, {
                                "_id": "5c4acff339473e5d42fcc415",
                                "question": "Attachment Non Mendatory",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 13,
                                "isMandatory": false,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": ""
                            }]
                        },
                        "reviewer_type": "5c36ea4539473e5238717e57",
                        "status": 2,
                        "recommendation_id": "5c500f7d39473e4f78e60eaa"
                    },
                    "fill_recommendation": true,
                    "midterm_appraisal_details": {
                        "enable": true,
                        "comment": "Bearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbIBearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbIBearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbIBearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbI"
                    },
                    "is_midterm_appraisal": true
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF0003",
                        "work_profile_work_email": "sandesh.c@mailinator.com",
                        "work_profile_joining_date": "01\/04\/2012",
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "first_name": "Sandesh",
                        "emp_mobile": "",
                        "emp_email": "sandesh.c@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876db39473e2a0737ae81"],
                        "emp_code": "MTF0003",
                        "work_profile_designation": ["5ba8796139473eaa0b37ae85"],
                        "joining_date": "01 April 2012",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876db39473e2a0737ae81",
                            "name": "Stores",
                            "slug": "stores"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8796139473eaa0b37ae85",
                            "name": "Chief Operating Officer",
                            "slug": "chief_operating_officer"
                        }],
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978739473e126937aea7",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "33011.",
                        "full_name": "Adarsh B",
                        "first_name": "Adarsh",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4169",
                        "work_profile_designation": ["5ba877a439473e9d0b37ae81"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877a439473e9d0b37ae81",
                            "name": "Assistant Manager",
                            "slug": "assistant_manager"
                        }],
                        "_id": "5ba8973439473e7a6737ae88",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aea7\/33011.",
                        "display_detail": ["Adarsh B", "Finance", "Assistant Manager"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "5c36eb5339473e0d3a717e59_team",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 4.4
                    },
                    "overall_rating": 0,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF3142",
                        "work_profile_work_email": "shirish@mailinator.com",
                        "work_profile_joining_date": "09\/01\/2017",
                        "user_id": "5ba8979a39473e126937b363",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "74608.",
                        "full_name": "Shirish Surti",
                        "first_name": "Shirish",
                        "emp_mobile": "",
                        "emp_email": "shirish@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876d739473e250737ae81"],
                        "emp_code": "MTF3142",
                        "work_profile_designation": ["5ba87a8539473ef11337ae81"],
                        "joining_date": "09 January 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876d739473e250737ae81",
                            "name": "Technology",
                            "slug": "technology"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba87a8539473ef11337ae81",
                            "name": "VP-Information Technology",
                            "slug": "vp-information_technology"
                        }],
                        "_id": "5ba8973439473e7a6737af51",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979a39473e126937b363\/74608.",
                        "display_detail": ["Shirish Surti", "Technology", "VP-Information Technology"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978739473e126937aea7",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "33011.",
                        "full_name": "Adarsh B",
                        "first_name": "Adarsh",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4169",
                        "work_profile_designation": ["5ba877a439473e9d0b37ae81"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877a439473e9d0b37ae81",
                            "name": "Assistant Manager",
                            "slug": "assistant_manager"
                        }],
                        "_id": "5ba8973439473e7a6737ae88",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aea7\/33011.",
                        "display_detail": ["Adarsh B", "Finance", "Assistant Manager"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 11,
                    "reviewer_type": "5c36ea7239473e5238717e5a_team",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "11": 5
                    },
                    "overall_rating": 0,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF3727",
                        "work_profile_work_email": "dileep@mailinator.com",
                        "work_profile_joining_date": "25\/05\/2017",
                        "user_id": "5ba8978b39473e126937afd3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "49287.",
                        "full_name": "Dileep D M",
                        "first_name": "Dileep",
                        "emp_mobile": "",
                        "emp_email": "dileep@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF3727",
                        "work_profile_designation": ["5ba8779339473ebf0937ae85"],
                        "joining_date": "25 May 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8779339473ebf0937ae85",
                            "name": "Audit Executive",
                            "slug": "audit_executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae81",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978b39473e126937afd3\/49287.",
                        "display_detail": ["Dileep D M", "Finance", "Audit Executive"]
                    },
                    "reviewer": {
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "first_name": "Sandesh",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876db39473e2a0737ae81"],
                        "employee_code": "MTF0003",
                        "work_profile_designation": ["5ba8796139473eaa0b37ae85"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876db39473e2a0737ae81",
                            "name": "Stores",
                            "slug": "stores"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8796139473eaa0b37ae85",
                            "name": "Chief Operating Officer",
                            "slug": "chief_operating_officer"
                        }],
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "peer",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 3
                    },
                    "overall_rating": 3,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF4169",
                        "work_profile_work_email": "adarsh.b@mailinator.com",
                        "work_profile_joining_date": "25\/09\/2017",
                        "user_id": "5ba8978739473e126937aea7",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "33011.",
                        "full_name": "Adarsh B",
                        "first_name": "Adarsh",
                        "emp_mobile": "",
                        "emp_email": "adarsh.b@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF4169",
                        "work_profile_designation": ["5ba877a439473e9d0b37ae81"],
                        "joining_date": "25 September 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877a439473e9d0b37ae81",
                            "name": "Assistant Manager",
                            "slug": "assistant_manager"
                        }],
                        "_id": "5ba8973439473e7a6737ae88",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aea7\/33011.",
                        "display_detail": ["Adarsh B", "Finance", "Assistant Manager"]
                    },
                    "reviewer": {
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "first_name": "Sandesh",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876db39473e2a0737ae81"],
                        "employee_code": "MTF0003",
                        "work_profile_designation": ["5ba8796139473eaa0b37ae85"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876db39473e2a0737ae81",
                            "name": "Stores",
                            "slug": "stores"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8796139473eaa0b37ae85",
                            "name": "Chief Operating Officer",
                            "slug": "chief_operating_officer"
                        }],
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": {
                        "11": true
                    },
                    "template_type": 11,
                    "reviewer_type": "5c36eb5339473e0d3a717e59",
                    "released": false,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "11": 4
                    },
                    "overall_rating": 4,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF4829",
                        "work_profile_work_email": "anuradha@mailinator.com",
                        "work_profile_joining_date": "27\/02\/2018",
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "emp_mobile": "",
                        "emp_email": "anuradha@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "joining_date": "27 February 2018",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": false,
                    "recommended_for_promotion": [],
                    "template_type": "12,11",
                    "reviewer_type": "self",
                    "released": true,
                    "accepted": null,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 4.2,
                        "11": 5
                    },
                    "overall_rating": 4.76,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": false,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF3727",
                        "work_profile_work_email": "dileep@mailinator.com",
                        "work_profile_joining_date": "25\/05\/2017",
                        "user_id": "5ba8978b39473e126937afd3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "49287.",
                        "full_name": "Dileep D M",
                        "first_name": "Dileep",
                        "emp_mobile": "",
                        "emp_email": "dileep@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF3727",
                        "work_profile_designation": ["5ba8779339473ebf0937ae85"],
                        "joining_date": "25 May 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8779339473ebf0937ae85",
                            "name": "Audit Executive",
                            "slug": "audit_executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae81",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978b39473e126937afd3\/49287.",
                        "display_detail": ["Dileep D M", "Finance", "Audit Executive"]
                    },
                    "reviewer": {
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "first_name": "Sandesh",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876db39473e2a0737ae81"],
                        "employee_code": "MTF0003",
                        "work_profile_designation": ["5ba8796139473eaa0b37ae85"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876db39473e2a0737ae81",
                            "name": "Stores",
                            "slug": "stores"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8796139473eaa0b37ae85",
                            "name": "Chief Operating Officer",
                            "slug": "chief_operating_officer"
                        }],
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": {
                        "11": true
                    },
                    "template_type": 11,
                    "reviewer_type": "5c36eb5339473e0d3a717e59",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "11": 4
                    },
                    "overall_rating": 4,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF3727",
                        "work_profile_work_email": "dileep@mailinator.com",
                        "work_profile_joining_date": "25\/05\/2017",
                        "user_id": "5ba8978b39473e126937afd3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "49287.",
                        "full_name": "Dileep D M",
                        "first_name": "Dileep",
                        "emp_mobile": "",
                        "emp_email": "dileep@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF3727",
                        "work_profile_designation": ["5ba8779339473ebf0937ae85"],
                        "joining_date": "25 May 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8779339473ebf0937ae85",
                            "name": "Audit Executive",
                            "slug": "audit_executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae81",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978b39473e126937afd3\/49287.",
                        "display_detail": ["Dileep D M", "Finance", "Audit Executive"]
                    },
                    "reviewer": {
                        "user_id": "5ba8979a39473e126937b363",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "74608.",
                        "full_name": "Shirish Surti",
                        "first_name": "Shirish",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876d739473e250737ae81"],
                        "employee_code": "MTF3142",
                        "work_profile_designation": ["5ba87a8539473ef11337ae81"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876d739473e250737ae81",
                            "name": "Technology",
                            "slug": "technology"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba87a8539473ef11337ae81",
                            "name": "VP-Information Technology",
                            "slug": "vp-information_technology"
                        }],
                        "_id": "5ba8973439473e7a6737af51",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979a39473e126937b363\/74608.",
                        "display_detail": ["Shirish Surti", "Technology", "VP-Information Technology"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": {
                        "12": true,
                        "11": true
                    },
                    "template_type": "12,11",
                    "reviewer_type": "5c36ea7239473e5238717e5a",
                    "released": false,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 4,
                        "11": 4
                    },
                    "overall_rating": 4,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "recommendation_details": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5c4acff339473e5d42fcc410",
                                "question": "1",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 2,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "1",
                                    "_id": {
                                        "$id": "5bc067f039473e841697e24a"
                                    }
                                }, {
                                    "name": "2",
                                    "_id": {
                                        "$id": "5bc067f039473e841697e24b"
                                    }
                                }, {
                                    "name": "3",
                                    "_id": {
                                        "$id": "5bc067f039473e841697e24c"
                                    }
                                }],
                                "answer": "5bc067f039473e841697e24a"
                            }, {
                                "_id": "5c4acff339473e5d42fcc411",
                                "question": "2 Checkbox",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 3,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "1",
                                    "_id": {
                                        "$id": "5bc0680839473ecd1397e24c"
                                    }
                                }, {
                                    "name": "2",
                                    "_id": {
                                        "$id": "5bc0680839473ecd1397e24d"
                                    }
                                }, {
                                    "name": "3",
                                    "_id": {
                                        "$id": "5bc0680839473ecd1397e24e"
                                    }
                                }],
                                "answer": ["5bc0680839473ecd1397e24c"]
                            }, {
                                "_id": "5c4acff339473e5d42fcc412",
                                "question": "Open Text Field -- mendatory",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "Bearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbI"
                            }, {
                                "_id": "5c4acff339473e5d42fcc413",
                                "question": "Open text field -- Non Mendatory",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": false,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "Bearer SplNjc7xYGb5OtUOd9PWhcTxgjfnS2FXDikuWzbI"
                            }, {
                                "_id": "5c4acff339473e5d42fcc414",
                                "question": "Attachment\/Documents",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 13,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "attachement_1548749846457.jpg"
                            }, {
                                "_id": "5c4acff339473e5d42fcc415",
                                "question": "Attachment Non Mendatory",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 13,
                                "isMandatory": false,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": ""
                            }]
                        },
                        "reviewer_type": "5c36ea7239473e5238717e5a",
                        "status": 2,
                        "recommendation_id": "5c500c1639473e436ae60eaa"
                    },
                    "fill_recommendation": true,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF3142",
                        "work_profile_work_email": "shirish@mailinator.com",
                        "work_profile_joining_date": "09\/01\/2017",
                        "user_id": "5ba8979a39473e126937b363",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "74608.",
                        "full_name": "Shirish Surti",
                        "first_name": "Shirish",
                        "emp_mobile": "",
                        "emp_email": "shirish@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876d739473e250737ae81"],
                        "emp_code": "MTF3142",
                        "work_profile_designation": ["5ba87a8539473ef11337ae81"],
                        "joining_date": "09 January 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876d739473e250737ae81",
                            "name": "Technology",
                            "slug": "technology"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba87a8539473ef11337ae81",
                            "name": "VP-Information Technology",
                            "slug": "vp-information_technology"
                        }],
                        "_id": "5ba8973439473e7a6737af51",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979a39473e126937b363\/74608.",
                        "display_detail": ["Shirish Surti", "Technology", "VP-Information Technology"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 11,
                    "reviewer_type": "5c36ea7239473e5238717e5a_team",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "11": 4
                    },
                    "overall_rating": 0,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF4122",
                        "work_profile_work_email": "radha.ramanujan@mailinator.com",
                        "work_profile_joining_date": "11\/09\/2017",
                        "user_id": "5ba8979439473e126937b237",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "79212.",
                        "full_name": "R Radha",
                        "first_name": "R",
                        "emp_mobile": "",
                        "emp_email": "radha.ramanujan@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF4122",
                        "work_profile_designation": ["5ba8791739473e2b1037ae81"],
                        "joining_date": "11 September 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8791739473e2b1037ae81",
                            "name": "CFO",
                            "slug": "cfo"
                        }],
                        "_id": "5ba8973439473e7a6737af1f",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979439473e126937b237\/79212.",
                        "display_detail": ["R Radha", "Finance", "CFO"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "direct_reports",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 0
                    },
                    "overall_rating": 0,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF0001",
                        "work_profile_work_email": "amuleek.singh@mailinator.com",
                        "work_profile_joining_date": "01\/04\/2012",
                        "user_id": "5ba8978839473e126937aefb",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "38513.",
                        "full_name": "Amuleek Singh Bijral",
                        "first_name": "Amuleek",
                        "emp_mobile": "",
                        "emp_email": "amuleek.singh@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876e939473ed80837ae81"],
                        "emp_code": "MTF0001",
                        "work_profile_designation": ["5ba877f439473ed00a37ae81"],
                        "joining_date": "01 April 2012",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876e939473ed80837ae81",
                            "name": "Operations",
                            "slug": "operations"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877f439473ed00a37ae81",
                            "name": "CEO",
                            "slug": "ceo"
                        }],
                        "_id": "5ba8973439473e7a6737ae96",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978839473e126937aefb\/38513.",
                        "display_detail": ["Amuleek Singh Bijral", "Operations", "CEO"]
                    },
                    "reviewer": {
                        "user_id": "5ba8979a39473e126937b363",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "74608.",
                        "full_name": "Shirish Surti",
                        "first_name": "Shirish",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876d739473e250737ae81"],
                        "employee_code": "MTF3142",
                        "work_profile_designation": ["5ba87a8539473ef11337ae81"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876d739473e250737ae81",
                            "name": "Technology",
                            "slug": "technology"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba87a8539473ef11337ae81",
                            "name": "VP-Information Technology",
                            "slug": "vp-information_technology"
                        }],
                        "_id": "5ba8973439473e7a6737af51",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979a39473e126937b363\/74608.",
                        "display_detail": ["Shirish Surti", "Technology", "VP-Information Technology"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "direct_reports",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 0
                    },
                    "overall_rating": 0,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF1444",
                        "work_profile_work_email": "ashwini@mailinator.com",
                        "work_profile_joining_date": "05\/10\/2015",
                        "user_id": "5ba8978d39473e126937b04b",
                        "full_name": "J Ashwini",
                        "first_name": "J",
                        "emp_mobile": "",
                        "emp_email": "ashwini@mailinator.com",
                        "work_profile_location": ["5ba8767939473e2c0737ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF1444",
                        "work_profile_designation": ["5ba877ca39473ea30b37ae81"],
                        "joining_date": "05 October 2015",
                        "work_profile_location_detail": [{
                            "_id": "5ba8767939473e2c0737ae81",
                            "name": "Hyderabad",
                            "slug": "hyderabad"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877ca39473ea30b37ae81",
                            "name": "Executive",
                            "slug": "executive"
                        }],
                        "_id": "5ba8973439473e7a6737aecd",
                        "profile_pic": "http:\/\/prod2.qandle.com\/images\/no-avatar.png",
                        "display_detail": ["J Ashwini", "Finance", "Executive"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": {
                        "12": true,
                        "11": true
                    },
                    "template_type": "12,11",
                    "reviewer_type": "skip_manager",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 0,
                        "11": 0
                    },
                    "overall_rating": 0,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "recommendation_details": {
                        "template_detail": {
                            "questions": [{
                                "_id": "5c4acff339473e5d42fcc410",
                                "question": "1",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 2,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "1",
                                    "_id": {
                                        "$id": "5bc067f039473e841697e24a"
                                    }
                                }, {
                                    "name": "2",
                                    "_id": {
                                        "$id": "5bc067f039473e841697e24b"
                                    }
                                }, {
                                    "name": "3",
                                    "_id": {
                                        "$id": "5bc067f039473e841697e24c"
                                    }
                                }],
                                "answer": "5bc067f039473e841697e24a"
                            }, {
                                "_id": "5c4acff339473e5d42fcc411",
                                "question": "2 Checkbox",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 3,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "options": [{
                                    "name": "1",
                                    "_id": {
                                        "$id": "5bc0680839473ecd1397e24c"
                                    }
                                }, {
                                    "name": "2",
                                    "_id": {
                                        "$id": "5bc0680839473ecd1397e24d"
                                    }
                                }, {
                                    "name": "3",
                                    "_id": {
                                        "$id": "5bc0680839473ecd1397e24e"
                                    }
                                }],
                                "answer": ["5bc0680839473ecd1397e24c"]
                            }, {
                                "_id": "5c4acff339473e5d42fcc412",
                                "question": "Open Text Field -- mendatory",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "The 2.relation must be one of the following types: self, manager, skip_manager, direct_reports, peer"
                            }, {
                                "_id": "5c4acff339473e5d42fcc413",
                                "question": "Open text field -- Non Mendatory",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 1,
                                "isMandatory": false,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": ""
                            }, {
                                "_id": "5c4acff339473e5d42fcc414",
                                "question": "Attachment\/Documents",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 13,
                                "isMandatory": true,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": "attachement_1548746703480.jpg"
                            }, {
                                "_id": "5c4acff339473e5d42fcc415",
                                "question": "Attachment Non Mendatory",
                                "form_id": "5c4acff339473e5d42fcc40f",
                                "updated_at": "2019-01-25 14:29:31",
                                "created_at": "2019-01-25 14:29:31",
                                "description": null,
                                "question_type": 13,
                                "isMandatory": false,
                                "isConditional": false,
                                "isValidation": false,
                                "type": 2,
                                "status": false,
                                "deleted": false,
                                "is_drafted": true,
                                "is_deletable": true,
                                "hasParent": false,
                                "answer": ""
                            }]
                        },
                        "reviewer_type": "skip_manager",
                        "status": 2,
                        "recommendation_id": "5c4fffcf39473ef131e60eaa"
                    },
                    "fill_recommendation": true,
                    "midterm_appraisal_details": {
                        "enable": true,
                        "comment": "The 2.relation must be one of the following types: self, manager, skip_manager, direct_reports, peer"
                    },
                    "is_midterm_appraisal": true
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF3727",
                        "work_profile_work_email": "dileep@mailinator.com",
                        "work_profile_joining_date": "25\/05\/2017",
                        "user_id": "5ba8978b39473e126937afd3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "49287.",
                        "full_name": "Dileep D M",
                        "first_name": "Dileep",
                        "emp_mobile": "",
                        "emp_email": "dileep@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF3727",
                        "work_profile_designation": ["5ba8779339473ebf0937ae85"],
                        "joining_date": "25 May 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8779339473ebf0937ae85",
                            "name": "Audit Executive",
                            "slug": "audit_executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae81",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978b39473e126937afd3\/49287.",
                        "display_detail": ["Dileep D M", "Finance", "Audit Executive"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "peer",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 4
                    },
                    "overall_rating": 4,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF4169",
                        "work_profile_work_email": "adarsh.b@mailinator.com",
                        "work_profile_joining_date": "25\/09\/2017",
                        "user_id": "5ba8978739473e126937aea7",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "33011.",
                        "full_name": "Adarsh B",
                        "first_name": "Adarsh",
                        "emp_mobile": "",
                        "emp_email": "adarsh.b@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF4169",
                        "work_profile_designation": ["5ba877a439473e9d0b37ae81"],
                        "joining_date": "25 September 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877a439473e9d0b37ae81",
                            "name": "Assistant Manager",
                            "slug": "assistant_manager"
                        }],
                        "_id": "5ba8973439473e7a6737ae88",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aea7\/33011.",
                        "display_detail": ["Adarsh B", "Finance", "Assistant Manager"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "peer",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 4
                    },
                    "overall_rating": 4,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF4169",
                        "work_profile_work_email": "adarsh.b@mailinator.com",
                        "work_profile_joining_date": "25\/09\/2017",
                        "user_id": "5ba8978739473e126937aea7",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "33011.",
                        "full_name": "Adarsh B",
                        "first_name": "Adarsh",
                        "emp_mobile": "",
                        "emp_email": "adarsh.b@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF4169",
                        "work_profile_designation": ["5ba877a439473e9d0b37ae81"],
                        "joining_date": "25 September 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877a439473e9d0b37ae81",
                            "name": "Assistant Manager",
                            "slug": "assistant_manager"
                        }],
                        "_id": "5ba8973439473e7a6737ae88",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aea7\/33011.",
                        "display_detail": ["Adarsh B", "Finance", "Assistant Manager"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": {
                        "12": true,
                        "11": true
                    },
                    "template_type": "12,11",
                    "reviewer_type": "manager",
                    "released": true,
                    "accepted": true,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 1,
                        "11": 1
                    },
                    "overall_rating": 1,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "midterm_appraisal_details": {
                        "enable": false,
                        "comment": ""
                    },
                    "is_midterm_appraisal": true
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF3727",
                        "work_profile_work_email": "dileep@mailinator.com",
                        "work_profile_joining_date": "25\/05\/2017",
                        "user_id": "5ba8978b39473e126937afd3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "49287.",
                        "full_name": "Dileep D M",
                        "first_name": "Dileep",
                        "emp_mobile": "",
                        "emp_email": "dileep@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF3727",
                        "work_profile_designation": ["5ba8779339473ebf0937ae85"],
                        "joining_date": "25 May 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8779339473ebf0937ae85",
                            "name": "Audit Executive",
                            "slug": "audit_executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae81",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978b39473e126937afd3\/49287.",
                        "display_detail": ["Dileep D M", "Finance", "Audit Executive"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978b39473e126937afd3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "49287.",
                        "full_name": "Dileep D M",
                        "first_name": "Dileep",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF3727",
                        "work_profile_designation": ["5ba8779339473ebf0937ae85"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8779339473ebf0937ae85",
                            "name": "Audit Executive",
                            "slug": "audit_executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae81",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978b39473e126937afd3\/49287.",
                        "display_detail": ["Dileep D M", "Finance", "Audit Executive"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": false,
                    "recommended_for_promotion": [],
                    "template_type": "12,11",
                    "reviewer_type": "self",
                    "released": true,
                    "accepted": null,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 4,
                        "11": 3.6
                    },
                    "overall_rating": 3.72,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": false,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF0532",
                        "work_profile_work_email": "shiva.s@mailinator.com",
                        "work_profile_joining_date": "01\/10\/2014",
                        "user_id": "5ba8979a39473e126937b369",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "26020.",
                        "full_name": "Shiva.S M",
                        "first_name": "Shiva.S",
                        "emp_mobile": "",
                        "emp_email": "shiva.s@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF0532",
                        "work_profile_designation": ["5ba87a8a39473eef1337ae81"],
                        "joining_date": "01 October 2014",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba87a8a39473eef1337ae81",
                            "name": "Assistant Manager - Audit",
                            "slug": "assistant_manager_-_audit"
                        }],
                        "_id": "5ba8973439473e7a6737af52",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979a39473e126937b369\/26020.",
                        "display_detail": ["Shiva.S M", "Finance", "Assistant Manager - Audit"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": {
                        "12": true,
                        "11": true
                    },
                    "template_type": "12,11",
                    "reviewer_type": "manager",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 5,
                        "11": 5
                    },
                    "overall_rating": 5,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "midterm_appraisal_details": {
                        "enable": true,
                        "comment": "The 2.relation must be one of the following types: self, manager, skip_manager, direct_reports, peerThe 2.relation must be one of the following types: self, manager, skip_manager, direct_reports, peerThe 2.relation must be one of the following types: self, manager, skip_manager, direct_reports, peer"
                    },
                    "is_midterm_appraisal": true
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF0003",
                        "work_profile_work_email": "sandesh.c@mailinator.com",
                        "work_profile_joining_date": "01\/04\/2012",
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "first_name": "Sandesh",
                        "emp_mobile": "",
                        "emp_email": "sandesh.c@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876db39473e2a0737ae81"],
                        "emp_code": "MTF0003",
                        "work_profile_designation": ["5ba8796139473eaa0b37ae85"],
                        "joining_date": "01 April 2012",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876db39473e2a0737ae81",
                            "name": "Stores",
                            "slug": "stores"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8796139473eaa0b37ae85",
                            "name": "Chief Operating Officer",
                            "slug": "chief_operating_officer"
                        }],
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "5c36eb5339473e0d3a717e59_team",
                    "released": false,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 3.6
                    },
                    "overall_rating": 0,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF3142",
                        "work_profile_work_email": "shirish@mailinator.com",
                        "work_profile_joining_date": "09\/01\/2017",
                        "user_id": "5ba8979a39473e126937b363",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "74608.",
                        "full_name": "Shirish Surti",
                        "first_name": "Shirish",
                        "emp_mobile": "",
                        "emp_email": "shirish@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876d739473e250737ae81"],
                        "emp_code": "MTF3142",
                        "work_profile_designation": ["5ba87a8539473ef11337ae81"],
                        "joining_date": "09 January 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876d739473e250737ae81",
                            "name": "Technology",
                            "slug": "technology"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba87a8539473ef11337ae81",
                            "name": "VP-Information Technology",
                            "slug": "vp-information_technology"
                        }],
                        "_id": "5ba8973439473e7a6737af51",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979a39473e126937b363\/74608.",
                        "display_detail": ["Shirish Surti", "Technology", "VP-Information Technology"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978b39473e126937afd3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "49287.",
                        "full_name": "Dileep D M",
                        "first_name": "Dileep",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF3727",
                        "work_profile_designation": ["5ba8779339473ebf0937ae85"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8779339473ebf0937ae85",
                            "name": "Audit Executive",
                            "slug": "audit_executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae81",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978b39473e126937afd3\/49287.",
                        "display_detail": ["Dileep D M", "Finance", "Audit Executive"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 11,
                    "reviewer_type": "5c36ea7239473e5238717e5a_team",
                    "released": false,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "11": 5
                    },
                    "overall_rating": 0,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF0532",
                        "work_profile_work_email": "shiva.s@mailinator.com",
                        "work_profile_joining_date": "01\/10\/2014",
                        "user_id": "5ba8979a39473e126937b369",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "26020.",
                        "full_name": "Shiva.S M",
                        "first_name": "Shiva.S",
                        "emp_mobile": "",
                        "emp_email": "shiva.s@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF0532",
                        "work_profile_designation": ["5ba87a8a39473eef1337ae81"],
                        "joining_date": "01 October 2014",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba87a8a39473eef1337ae81",
                            "name": "Assistant Manager - Audit",
                            "slug": "assistant_manager_-_audit"
                        }],
                        "_id": "5ba8973439473e7a6737af52",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979a39473e126937b369\/26020.",
                        "display_detail": ["Shiva.S M", "Finance", "Assistant Manager - Audit"]
                    },
                    "reviewer": {
                        "user_id": "5ba8979a39473e126937b363",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "74608.",
                        "full_name": "Shirish Surti",
                        "first_name": "Shirish",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876d739473e250737ae81"],
                        "employee_code": "MTF3142",
                        "work_profile_designation": ["5ba87a8539473ef11337ae81"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876d739473e250737ae81",
                            "name": "Technology",
                            "slug": "technology"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba87a8539473ef11337ae81",
                            "name": "VP-Information Technology",
                            "slug": "vp-information_technology"
                        }],
                        "_id": "5ba8973439473e7a6737af51",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979a39473e126937b363\/74608.",
                        "display_detail": ["Shirish Surti", "Technology", "VP-Information Technology"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "peer",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 3
                    },
                    "overall_rating": 3,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF0003",
                        "work_profile_work_email": "sandesh.c@mailinator.com",
                        "work_profile_joining_date": "01\/04\/2012",
                        "user_id": "5ba8979739473e126937b2f1",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "25366.",
                        "full_name": "Sandesh C",
                        "first_name": "Sandesh",
                        "emp_mobile": "",
                        "emp_email": "sandesh.c@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876db39473e2a0737ae81"],
                        "emp_code": "MTF0003",
                        "work_profile_designation": ["5ba8796139473eaa0b37ae85"],
                        "joining_date": "01 April 2012",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876db39473e2a0737ae81",
                            "name": "Stores",
                            "slug": "stores"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8796139473eaa0b37ae85",
                            "name": "Chief Operating Officer",
                            "slug": "chief_operating_officer"
                        }],
                        "_id": "5ba8973439473e7a6737af3e",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8979739473e126937b2f1\/25366.",
                        "display_detail": ["Sandesh C", "Stores", "Chief Operating Officer"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978b39473e126937afd3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "49287.",
                        "full_name": "Dileep D M",
                        "first_name": "Dileep",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF3727",
                        "work_profile_designation": ["5ba8779339473ebf0937ae85"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8779339473ebf0937ae85",
                            "name": "Audit Executive",
                            "slug": "audit_executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae81",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978b39473e126937afd3\/49287.",
                        "display_detail": ["Dileep D M", "Finance", "Audit Executive"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "5c36eb5339473e0d3a717e59_team",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 3.6
                    },
                    "overall_rating": 0,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF4829",
                        "work_profile_work_email": "anuradha@mailinator.com",
                        "work_profile_joining_date": "27\/02\/2018",
                        "user_id": "5ba8978939473e126937af1f",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "12952.",
                        "full_name": "Anuradha S",
                        "first_name": "Anuradha",
                        "emp_mobile": "",
                        "emp_email": "anuradha@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF4829",
                        "work_profile_designation": ["5ba8780a39473e7d0c37ae82"],
                        "joining_date": "27 February 2018",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8780a39473e7d0c37ae82",
                            "name": "Director - Commercial Finance",
                            "slug": "director_-_commercial_finance"
                        }],
                        "_id": "5ba8973439473e7a6737ae9c",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978939473e126937af1f\/12952.",
                        "display_detail": ["Anuradha S", "Finance", "Director - Commercial Finance"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978b39473e126937afd3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "49287.",
                        "full_name": "Dileep D M",
                        "first_name": "Dileep",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF3727",
                        "work_profile_designation": ["5ba8779339473ebf0937ae85"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8779339473ebf0937ae85",
                            "name": "Audit Executive",
                            "slug": "audit_executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae81",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978b39473e126937afd3\/49287.",
                        "display_detail": ["Dileep D M", "Finance", "Audit Executive"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "direct_reports",
                    "released": true,
                    "accepted": true,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 0
                    },
                    "overall_rating": 0,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": false,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }, {
                    "reviewee": {
                        "personal_profile_employee_code": "MTF4169",
                        "work_profile_work_email": "adarsh.b@mailinator.com",
                        "work_profile_joining_date": "25\/09\/2017",
                        "user_id": "5ba8978739473e126937aea7",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "33011.",
                        "full_name": "Adarsh B",
                        "first_name": "Adarsh",
                        "emp_mobile": "",
                        "emp_email": "adarsh.b@mailinator.com",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "emp_code": "MTF4169",
                        "work_profile_designation": ["5ba877a439473e9d0b37ae81"],
                        "joining_date": "25 September 2017",
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba877a439473e9d0b37ae81",
                            "name": "Assistant Manager",
                            "slug": "assistant_manager"
                        }],
                        "_id": "5ba8973439473e7a6737ae88",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978739473e126937aea7\/33011.",
                        "display_detail": ["Adarsh B", "Finance", "Assistant Manager"]
                    },
                    "reviewer": {
                        "user_id": "5ba8978b39473e126937afd3",
                        "crop_type": "1",
                        "original_img_filename": "blob",
                        "img_icon": "49287.",
                        "full_name": "Dileep D M",
                        "first_name": "Dileep",
                        "work_profile_location": ["5ba8763439473e340637ae81"],
                        "work_profile_department": ["5ba876c839473ef70737ae81"],
                        "employee_code": "MTF3727",
                        "work_profile_designation": ["5ba8779339473ebf0937ae85"],
                        "work_profile_location_detail": [{
                            "_id": "5ba8763439473e340637ae81",
                            "name": "Bangalore",
                            "slug": "bangalore"
                        }],
                        "work_profile_department_detail": [{
                            "_id": "5ba876c839473ef70737ae81",
                            "name": "Finance",
                            "slug": "finance"
                        }],
                        "work_profile_designation_detail": [{
                            "_id": "5ba8779339473ebf0937ae85",
                            "name": "Audit Executive",
                            "slug": "audit_executive"
                        }],
                        "_id": "5ba8973439473e7a6737ae81",
                        "profile_pic": "http:\/\/prod2.qandle.com\/useraddition\/image\/5ba8978b39473e126937afd3\/49287.",
                        "display_detail": ["Dileep D M", "Finance", "Audit Executive"]
                    },
                    "is_anonymous": false,
                    "can_admin_release": true,
                    "recommended_for_promotion": [],
                    "template_type": 12,
                    "reviewer_type": "5c36ea4539473e5238717e57_team",
                    "released": true,
                    "accepted": false,
                    "accepted_confiq": {
                        "manager": true,
                        "skip_manager": true,
                        "direct_reports": true,
                        "peer": true,
                        "5c36ea4539473e5238717e57_team": true,
                        "5c36eb5339473e0d3a717e59": true,
                        "5c36ea4539473e5238717e57": true,
                        "5c36ea7239473e5238717e5a_team": true,
                        "5c36ea7239473e5238717e5a": true,
                        "5c36eb5339473e0d3a717e59_team": true,
                        "5c36f9f939473e6777717e57": true,
                        "5c36f9f939473e6777717e57_team": true
                    },
                    "rating": {
                        "12": 4
                    },
                    "overall_rating": 1.1,
                    "is_overwrite": false,
                    "can_admin_reopen_evaluation": true,
                    "can_admin_overwrite_rating": true,
                    "development_plans": [],
                    "fill_recommendation": false,
                    "is_midterm_appraisal": false
                }]
            };
        };

		return this;
	}
]);