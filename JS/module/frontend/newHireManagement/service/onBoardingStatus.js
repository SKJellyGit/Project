app.service('OnBoardingStatusService', ['utilityService',
    function (utilityService) {
        'use strict';

        this.url = {
            onboardingStatus: 'onboarding/finalized-candidates',
            sendReminder: 'prejoin/frontend/send-reminder',
            activate: 'onboarding/activate',
            changeStatus: 'onboarding/change-status',
            getDocumentToverify: 'prejoin/frontend/document-form-detail',
            verifyDocs: 'prejoin/frontend/verify-forms-documents',
            getProfileFields: 'onboarding/mandatory-fields',
            newEmployee: 'user-addition/all-user?status=true',
            saveSystemPlan: 'onboarding/system-plan',
            getAllForms: 'user-management/form?status=true',
            document: 'user-management/document?status=true',
            getProvisionType: 'provisions/settings',
            countryDialCodes: 'user-addition/dial-codes',
            assetAttributes: 'employee/provisions',
            profileOnboarding: 'onboarding/candidate-portal/saved-profile-field',
            modulePermission: 'employee/module-permission/all',
            downloadLetter: 'prejoin/candidate/download-letter'

        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildEmpStatusObj = function () {
            return utilityService.buildEmployeeStatusHashMap();
        };
        this.buildObjectArray = function (obj,objLength) {
            var list = [];
            for (var i = 1; i <= objLength; i++) {
                var object = {};
                object.id = i;
                object.name = obj[i];
                list.push(object);
            }
            return list;
        };
        this.buildSampleReponse = function () {
            return {
                "status": "success",
                "message": "Employee Provisions list",
                "data": [{
                    "provision_type_id": "5c1a298d052c53cb038b4567",
                    "provision_type_data": {
                        "_id": "5c1a298d052c53cb038b4567",
                        "is_draft": false,
                        "enabled": true,
                        "provision_name": "Car",
                        "provision_icon": "car",
                        "provision_description": "For the use of implementation team.",
                        "action_on_separation": "3",
                        "can_amount_due": false,
                        "provision_provide_TAT": "1",
                        "provision_provide_TAT_unit": "1",
                        "is_claim_provision": false,
                        "is_system_generated_unique_key": true,
                        "is_use_prefix_in_unique_key": false,
                        "provision_prefix": "Qandle00",
                        "updated_at": "2018-12-20 12:58:22",
                        "created_at": "2018-12-19 16:50:45",
                        "attributes": [{
                            "attribute_name": "Asset ID",
                            "field_type": {
                                "field_type": 1,
                                "validator": {
                                    "min_limit": null,
                                    "max_limit": null,
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Option1"
                                }, {
                                    "_id": null,
                                    "name": "Option2"
                                }]
                            },
                            "is_unique": true,
                            "_id": {
                                "$id": "5c1a2b0f052c53970b8b4567"
                            }
                        }, {
                            "attribute_name": "Company",
                            "field_type": {
                                "field_type": 12,
                                "validator": {
                                    "min_limit": null,
                                    "max_limit": null,
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Maruti Suzuki"
                                }, {
                                    "_id": null,
                                    "name": "Ford"
                                }, {
                                    "_id": null,
                                    "name": "TATA"
                                }]
                            },
                            "is_unique": false,
                            "_id": {
                                "$id": "5c1a2b0f052c53970b8b4568"
                            }
                        }, {
                            "attribute_name": "Color",
                            "field_type": {
                                "field_type": 1,
                                "validator": {
                                    "min_limit": null,
                                    "max_limit": null,
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Option1"
                                }, {
                                    "_id": null,
                                    "name": "Option2"
                                }]
                            },
                            "is_unique": false,
                            "_id": {
                                "$id": "5c1a2b0f052c53970b8b4569"
                            }
                        }, {
                            "attribute_name": "Mileage",
                            "field_type": {
                                "field_type": 1,
                                "validator": {
                                    "min_limit": null,
                                    "max_limit": null,
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Option1"
                                }, {
                                    "_id": null,
                                    "name": "Option2"
                                }]
                            },
                            "is_unique": false,
                            "_id": {
                                "$id": "5c1a2b0f052c53970b8b456a"
                            }
                        }],
                        "is_company_wide": true,
                        "applicability": [],
                        "workflow": "58db4a9739473e202c8b9245",
                        "manager_ids": ["58e497d239473e7028937b20"],
                        "escalation_contact_ids": []
                    },
                    "total_quantity": 1,
                    "provision_manager": [{
                        "full_name": "Anil Patil",
                        "original_img_filename": "blob",
                        "img_icon": "58805.",
                        "user_id": "58e49b4a39473e0f2c937af7",
                        "crop_type": "1",
                        "_id": "58e497d239473e7028937b20",
                        "profile_pic": "http:\/\/prod4.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Anil Patil", "Male", "Implementation Engineer"]
                    }],
                    "provisions": [{
                        "provision_id": "5c1a2cc7052c53fb0b8b4569",
                        "attributes": {
                            "5c1a2b0f052c53970b8b4567": "Qandle002",
                            "5c1a2b0f052c53970b8b4568": "Ford",
                            "5c1a2b0f052c53970b8b4569": "white",
                            "5c1a2b0f052c53970b8b456a": "50"
                        },
                        "unique_attr_id": "5c1a2b0f052c53970b8b4567",
                        "unique_attr_value": "Qandle002",
                        "quantity": 1,
                        "allocated_date": "19\/12\/2018",
                        "remark": "",
                        "manager_remark": "Please Take care of the car. Dont give rahul",
                        "comments": ""
                    }]
                }, {
                    "provision_type_id": "5a4b5040052c53d4258b456a",
                    "provision_type_data": {
                        "_id": "5a4b5040052c53d4258b456a",
                        "is_draft": false,
                        "enabled": true,
                        "provision_name": "Iphone",
                        "provision_icon": "iphone",
                        "provision_description": "iphone for testing",
                        "action_on_separation": "2",
                        "can_amount_due": true,
                        "provision_provide_TAT": "10",
                        "provision_provide_TAT_unit": "1",
                        "is_claim_provision": false,
                        "is_system_generated_unique_key": true,
                        "is_use_prefix_in_unique_key": false,
                        "provision_prefix": "test",
                        "updated_at": "2018-06-26 17:19:06",
                        "created_at": "2018-01-02 14:56:24",
                        "is_company_wide": true,
                        "applicability": [],
                        "workflow": "58db619c39473e7a3c8b63b2",
                        "manager_ids": ["58e497d239473e7028937b08"],
                        "escalation_contact_ids": [],
                        "attributes": [{
                            "attribute_name": "Id",
                            "field_type": {
                                "field_type": 1,
                                "validator": {
                                    "min_limit": null,
                                    "max_limit": null,
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Option1"
                                }, {
                                    "_id": null,
                                    "name": "Option2"
                                }]
                            },
                            "is_unique": false,
                            "_id": {
                                "$id": "5a4b50e9052c534b278b4567"
                            }
                        }, {
                            "attribute_name": "Modal",
                            "field_type": {
                                "field_type": 1,
                                "validator": {
                                    "min_limit": null,
                                    "max_limit": null,
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Option1"
                                }, {
                                    "_id": null,
                                    "name": "Option2"
                                }]
                            },
                            "is_unique": true,
                            "_id": {
                                "$id": "5a4b50e9052c534b278b4568"
                            }
                        }]
                    },
                    "total_quantity": 1,
                    "provision_manager": [{
                        "full_name": "Ashok Kumar",
                        "original_img_filename": "blob",
                        "img_icon": "87096.",
                        "user_id": "58e77f4739473edb03a3a6f7",
                        "crop_type": "1",
                        "_id": "58e497d239473e7028937b08",
                        "profile_pic": "http:\/\/prod4.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Ashok Kumar", "Male", "Business Development Manager"]
                    }],
                    "provisions": [{
                        "provision_id": "5a4f4a13052c5375798b4567",
                        "attributes": {
                            "5a4b50e9052c534b278b4567": "i004",
                            "5a4b50e9052c534b278b4568": "test5"
                        },
                        "unique_attr_id": "5a4b50e9052c534b278b4568",
                        "unique_attr_value": "test5",
                        "quantity": 1,
                        "allocated_date": "05\/01\/2018",
                        "remark": "",
                        "manager_remark": "k",
                        "comments": ""
                    }]
                }, {
                    "provision_type_id": "5a449c32052c53a7138b4568",
                    "provision_type_data": {
                        "_id": "5a449c32052c53a7138b4568",
                        "is_draft": false,
                        "enabled": true,
                        "provision_name": "Company Laptop",
                        "provision_icon": "desktop",
                        "provision_description": "Raise request as requirement",
                        "action_on_separation": "3",
                        "can_amount_due": false,
                        "provision_provide_TAT": "1",
                        "provision_provide_TAT_unit": "1",
                        "is_claim_provision": false,
                        "is_system_generated_unique_key": true,
                        "is_use_prefix_in_unique_key": false,
                        "provision_prefix": "LAPTOP00",
                        "updated_at": "2018-06-26 17:18:37",
                        "created_at": "2017-12-28 12:54:34",
                        "is_company_wide": true,
                        "applicability": [],
                        "workflow": "592faf0139473eaa0f347baf",
                        "manager_ids": ["58e497d239473e7028937b0e", "58e497d239473e7028937b08"],
                        "escalation_contact_ids": [],
                        "attributes": [{
                            "attribute_name": "Brand",
                            "field_type": {
                                "field_type": 1,
                                "validator": {
                                    "min_limit": null,
                                    "max_limit": null,
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Option1"
                                }, {
                                    "_id": null,
                                    "name": "Option2"
                                }]
                            },
                            "is_unique": false,
                            "_id": {
                                "$id": "5a449c74052c53a7138b4569"
                            }
                        }, {
                            "attribute_name": "Serial no.",
                            "field_type": {
                                "field_type": 1,
                                "validator": {
                                    "min_limit": null,
                                    "max_limit": null,
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Option1"
                                }, {
                                    "_id": null,
                                    "name": "Option2"
                                }]
                            },
                            "is_unique": true,
                            "_id": {
                                "$id": "5a449c74052c53a7138b456a"
                            }
                        }]
                    },
                    "total_quantity": 1,
                    "provision_manager": [{
                        "full_name": "Bhagat Rawat",
                        "user_id": "58fddc6939473ebf210f932d",
                        "_id": "58e497d239473e7028937b0e",
                        "profile_pic": "http:\/\/prod4.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Bhagat Rawat", "Male", "Director"]
                    }, {
                        "full_name": "Ashok Kumar",
                        "original_img_filename": "blob",
                        "img_icon": "87096.",
                        "user_id": "58e77f4739473edb03a3a6f7",
                        "crop_type": "1",
                        "_id": "58e497d239473e7028937b08",
                        "profile_pic": "http:\/\/prod4.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Ashok Kumar", "Male", "Business Development Manager"]
                    }],
                    "provisions": [{
                        "provision_id": "5a449e07052c5373148b456b",
                        "attributes": {
                            "5a449c74052c53a7138b4569": "Hp",
                            "5a449c74052c53a7138b456a": "LAPTOP003"
                        },
                        "unique_attr_id": "5a449c74052c53a7138b456a",
                        "unique_attr_value": "LAPTOP003",
                        "quantity": 1,
                        "allocated_date": "28\/12\/2017",
                        "remark": "",
                        "manager_remark": "ok",
                        "comments": ""
                    }]
                }, {
                    "provision_type_id": "591bed4e39473e38411fbee5",
                    "provision_type_data": {
                        "_id": "591bed4e39473e38411fbee5",
                        "is_draft": false,
                        "enabled": true,
                        "provision_name": "Mobile",
                        "provision_icon": "ipad",
                        "provision_description": null,
                        "action_on_separation": "1",
                        "can_amount_due": true,
                        "provision_provide_TAT": "10",
                        "provision_provide_TAT_unit": "2",
                        "is_claim_provision": false,
                        "is_company_wide": true,
                        "applicability": [],
                        "workflow": "591beafb39473e123f1fbee6",
                        "manager_ids": ["595377da052c5306748b456b", "58db605d39473e8f3d8b6307", "58e497d239473e7028937b08"],
                        "escalation_contact_ids": [],
                        "updated_at": "2018-06-26 17:17:30",
                        "created_at": "2017-05-17 11:57:26",
                        "is_system_generated_unique_key": false,
                        "is_use_prefix_in_unique_key": false,
                        "provision_prefix": "",
                        "attributes": [{
                            "attribute_name": "Location",
                            "field_type": {
                                "field_type": 2,
                                "validator": {
                                    "min_limit": "0",
                                    "max_limit": "30",
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Option1"
                                }, {
                                    "_id": null,
                                    "name": "Option2"
                                }]
                            },
                            "is_unique": false,
                            "_id": {
                                "$id": "58dc94db39473e2118077ce0"
                            }
                        }, {
                            "attribute_name": "Department",
                            "field_type": {
                                "field_type": 2,
                                "validator": {
                                    "min_limit": "0",
                                    "max_limit": "30",
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Option1"
                                }, {
                                    "_id": null,
                                    "name": "Option2"
                                }]
                            },
                            "is_unique": false,
                            "_id": {
                                "$id": "58dc94db39473e2118077ce1"
                            }
                        }, {
                            "attribute_name": "Assest No",
                            "field_type": {
                                "field_type": 3,
                                "validator": {
                                    "min_limit": "0",
                                    "max_limit": "15",
                                    "is_special_chr": false
                                },
                                "element_details": [{
                                    "_id": null,
                                    "name": "Option1"
                                }, {
                                    "_id": null,
                                    "name": "Option2"
                                }]
                            },
                            "is_unique": true,
                            "_id": {
                                "$id": "58dc94db39473e2118077ce2"
                            }
                        }]
                    },
                    "total_quantity": 1,
                    "provision_manager": [{
                        "full_name": "Rahul Chauhan Chauhan",
                        "user_id": "59537b02052c536e018b4568",
                        "_id": "595377da052c5306748b456b",
                        "profile_pic": "http:\/\/prod4.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Rahul Chauhan Chauhan", "Male", "Software Engineer"]
                    }, {
                        "full_name": "Nitin Mukesh",
                        "user_id": "58dce43939473e933ad3e3e4",
                        "_id": "58db605d39473e8f3d8b6307",
                        "profile_pic": "http:\/\/prod4.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Nitin Mukesh", "Male", "Business Development Manager"]
                    }, {
                        "full_name": "Ashok Kumar",
                        "original_img_filename": "blob",
                        "img_icon": "87096.",
                        "user_id": "58e77f4739473edb03a3a6f7",
                        "crop_type": "1",
                        "_id": "58e497d239473e7028937b08",
                        "profile_pic": "http:\/\/prod4.hrms.com\/images\/no-avatar.png",
                        "display_detail": ["Ashok Kumar", "Male", "Business Development Manager"]
                    }],
                    "provisions": [{
                        "provision_id": "595f2031052c5397088b4569",
                        "attributes": {
                            "58dc94db39473e2118077ce0": "Dell",
                            "58dc94db39473e2118077ce1": "YYY",
                            "58dc94db39473e2118077ce2": "13"
                        },
                        "unique_attr_id": "58dc94db39473e2118077ce2",
                        "unique_attr_value": "13",
                        "quantity": 1,
                        "allocated_date": "17\/07\/2017",
                        "remark": "",
                        "manager_remark": "",
                        "comments": ""
                    }]
                }]
            };
        };
        
        return this;
    }
]);