var getEnvironmentVariableName = function() {
    var origin = window.location.origin,
      originArray = origin.split('//'),
      domain = originArray[originArray.length - 1],
      domainArray = domain.split('.'),
      prefix = domainArray[0];

    if(prefix == 'demo' && domainArray[1] == 'hrms') {
      prefix = 'local'; 
    }
    return prefix;
};

localStorage.setItem('envMnt', getEnvironmentVariableName());

var envMnt = localStorage.getItem('envMnt') ? localStorage.getItem('envMnt') : 'qandle',
 appName = 'Qandle',
 appVersion = '0.1',
 config = {
     local: {
         path: {
             api: "http://demo.hrms.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
             },
             subDomain:"demo"
         },
         isLoginCustomized1: {
             background: true,
             bgImgClass: 'bgimg-local',
             logo: false,
             logoClass: 'local-logo',
             outsideTop: false,
             outsideBottom: false,
             insideTop: false,
             insideBottom: false 
         },
         isDashboardCustomized: {
             content: false
         },
         isEligibility: {
             claim: true
         },
         hiddenTab: {				
             admin: {
                 compensation: {                		
                     overview: {
                         atAGlance: {
                             statutoryDeductions: {
                                 status: false
                             },
                             investments: {
                                 status: false
                             }
                         }
                     },
                     statutoryComplainces: {
                         status: false
                     },
                     empRelatedTasks: {
                         claims: {
                             status: false
                         },
                         declarations: {
                             status: false
                         },
                         proofs: {
                             status: false
                         },
                         prevsEmp: {
                             status: false
                         }
                     }                		
                 }
             },
             employee: {
                 compensation: {
                     summary: {
                         tax: {
                             status: false
                         },
                         status: false
                     },
                     myPay: {
                         benefitManagement: {
                             status: false
                         },
                         claims: {
                             status: false
                         },
                         loanAdvances: {
                             status: false
                         },
                         status: false
                     },
                     manageTax: {
                         investments: {
                             status: false
                         },
                         taxComputation: {
                             status: false
                         },
                         previousEmployer: {
                             status: true
                         },
                         status: false
                     },
                     forms: {
                         status: false
                     }
                 }
             },
             manager: {

             },
             relationship: {

             },
             setup: {
                 compensation: {
                     organizationTax: {
                         taxInformation: {
                             status: false
                         },
                     },
                     statutoryElements: {
                         status: false
                     },
                     compensationHeads: {
                         loanAdvances: {
                             legalText: {
                                 status: false
                             }
                         }
                     },
                     compensationPlans: {
                         structure: {
                             flexiPay: {
                                 status: false
                             }
                         }
                     }
                 }
             }
         },
         appraisal: {
             titleTabOne: {
                 direct_reports: "Goals",
                 self_review: "Goals",
                 manager: "Goals",
                 skip_manager: "Goals",
                 default: "Goals",
                 peer: "Goals"
             },
             titleTabTwo: {
                 direct_reports: "Competency",
                 self_review: "Competency",
                 manager: "Competency",
                 skip_manager: "Competency",
                 default: "Competency",
                 peer: "Competency"
             },
             visibility: {
                 asReviewer: true,
                 myReviews: true,
                 myTeam: true,
                 oneOnOne: true,
                 oneOnOneTeam: true,
                 oneOnOneAdmin: true,
                 updates: false,
                 updatesTeam: false,
                 regularFeedback: false,
                 regularFeedbackTeam: false,
                 regularFeedbackAdmin: true,
                 review: true,
                 reviewTeam: true,                    
                 reviewAdmin: true,	
                 /*releaseByAdmin: false,*/
                 kraRating: false,
                 requestSummary: true,
                 birthday: true,
                 /*goalSelfEvaluation: true,
                 competencySelfEvaluation: false,*/
                 radioButtonRatingQuestion: false,
                 /*midTermAppraisal: true,*/
                 empTravel: true,
                 adminTravel: true
             },
             text: {					
                 adminSidenavTE: "Expense Management",					
                 adminTitleTE: "Expense Management",
                 adminTravel: "Travel",
                 adminExpense: "Expenses",					
                 empSidenavTE: "Expense Management",					
                 empTitleTE: "Expense Management",
                 empTravel: "Travel",
                 empExpense: "Expenses",
                 empAdvance: "Advances",
                 analyticsTitle: "360 Feedback",
                 adminAdvance: "Advances"
             }
         },
         isTerminologyChanged: true,
         activeDirectoryLogin: {
             enabled : false,
             loginWithUserAndPassword : false,
             url : "https://login.microsoftonline.com/3395d287-5089-4d10-ac10-4fe165d71f79/oauth2/v2.0/authorize",
             clientId : "5f8c2bcd-e57c-4da7-bf04-08555e2f2492",
             response_type : "id_token%20token",
             redirectUri : "https://hr.hrms.com/sso/ad",
             responseMode : "form_post",
             scope : "openid+profile+email",
             state : "12345",
             nonce : "678910"
         },
         dashboardBanner: {
             visible: false,
             src: "Qandle-Cleartax.png",
             href: "https://cleartax.in/s/partner-qandleusers/"
         },
         isLoginViaEmployeeCode: {
             enabled: false
         },
         viewDownload: {
             title: 'View'
         },
         allEntityReport: {
             enabled: true
         },
         investmentProof: {
             isHidden: false
         },
         alwayShowInvestmentProofUpload: {
             enabled: true
         },
         multipleInvestmentHeads: {
                         enabled: true
         },
         syncGoogleCalendar: {
             enabled: true
         },
         screenshot:{
             enabled:true
         },
         chapterVIA: {
             "80G": {
                 isHidden: true
             }
         },
         socialLinks: {
             linkedin: 'https://in.linkedin.com/company/shadowfax',
             facebook: 'https://www.facebook.com/shadowfax.in/',
             twitter: 'https://twitter.com/shadowfax_in?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor',
             instagram: 'https://www.instagram.com/shadowfax.in/?hl=en'
         },
         yearExtendedConfig: {
             enabled: true,
             upto: [2021]
         },
         attendenceShiftDeatilTab:{
             disabled: true
         },	
         runPayrollAutomate: {
             enabled: true
         },
         runFnfAutomate: {
             enabled: true
         },
         googleLogin: {
             enabled : true
         },
         dropDownWithSearch: {
             enabled : false
         },
         employeeCompensationForm: {
             form_16: {
                 isHidden: false
             },
             form_16a_q: {
                 isHidden: false
             }
         },
         adminCompensationForm: {
             form_16a_q: {
                 isHidden: true
             },
             
         },
         
         taxProjectionEmployee: {
             enabled: true
         },
         productMap: {
             enabled: true,
             url : 'https://app.productstash.io/roadmaps/5f7440a28de13700299a7591/public',
             headerName: "Product Pipeline",
         },
         performanceFee: {
             enabled: false
         },
         isSolarSystem: {
             enabled: false,
             isAttendance: false
         },
         UAERegion: {
             enabled: true
         },
         employeePtComponent: {
             disable: true
         },
         employeeLwfComponent: {
             disable: true
         }
     },
     javarndcorp: {
         path: {
             api: "https://javarndcorp.qandle.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
             },
             subDomain:"javarndcorp",
             trackingId:"UA-94069773-1"
         },
                     allEntityReport: { 
                             enabled: true
                     },
                     multipleInvestmentHeads: {
                            enabled: true
                     },
         employeeCompensationForm: {
                             form_16: {
                                     isHidden: true
                             },
             form_16a: {
                                     isHidden: false
                             },
             form_16b: {
                                     isHidden: false
                             },
                             form_16a_q: {
                                     isHidden: true
                             }
                     },
                     adminCompensationForm: {
             form_16a: {
                                     isHidden: false
                             },
                             form_16b: {
                                     isHidden: false
                             },
                             form_16a_q: {
                                     isHidden: true
                             }
                     },
         dropDownWithSearch: {
             enabled :true
         }
     },
     hr: {
         path: {
             api: "http://hr.hrms.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
             },
             subDomain:"q",
             trackingId:"UA-94069773-1"
         },
         activeDirectoryLogin: {
             enabled : false,
             url : "https://login.microsoftonline.com/3395d287-5089-4d10-ac10-4fe165d71f79/oauth2/v2.0/authorize",
             clientId : "5f8c2bcd-e57c-4da7-bf04-08555e2f2492",
             response_type : "id_token%20token",
             redirectUri : "https://hr.hrms.com/sso/ad",
             responseMode : "form_post",
             scope : "openid+profile+email",
             state : "12345",
             nonce : "678910"
         },
         googleLogin: {
             enabled : true
         }
     },
     roadzen: {
             path: {
                     api: "https://roadzen.qandle.com/",
                     template: {
                             common: "template/module/common/",
                             setup: "template/module/setup/",
                             frontend: "template/module/frontend/",
                     }
             }
     },
     prod1: {
         path: {
             api: "http://prod1.qandle.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
             },
             subDomain:"prod1",
             trackingId:"UA-94069773-1"
         }
             },
     prod2: {
         path: {
             api: "http://prod2.qandle.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
             }
         }
             },
     prod3: {
         path: {
             api: "http://prod3.qandle.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
             }
         }
     },
     q: {
         path: {
             api: "https://q.hrms.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
             }
         },
         activeDirectoryLogin: {
             enabled : true,
             url : "https://login.microsoftonline.com/3395d287-5089-4d10-ac10-4fe165d71f79/oauth2/v2.0/authorize",
             clientId : "5f8c2bcd-e57c-4da7-bf04-08555e2f2492",
             response_type : "id_token%20token",
             redirectUri : "https://hr.hrms.com/sso/ad",
             responseMode : "form_post",
             scope : "openid+profile+email",
             state : "12345",
             nonce : "678910"
         }
     },
     prod4: {
         path: {
             api: "http://prod4.hrms.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
         }
         },
         allEntityReport: {
             enabled: true
         }
     },
     hr: {
         path: {
             api: "http://hr.hrms.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
             },
             subDomain: "hr"
         }
     },
     demo: {
         path: {
             api: "http://demo.hrms.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
             }
         },
         productMap: {
             enabled: true,
             url : 'https://app.productstash.io/roadmaps/5f7440a28de13700299a7591/public',
             headerName: "Product Pipeline"
         }
     },
     pds: {
             path: {
                     api: "https://pds.qandle.com/",
                     template: {
                             common: "template/module/common/",
                             setup: "template/module/setup/",
                             frontend: "template/module/frontend/",
                     },
                     subDomain:"pds",
                     trackingId:"UA-94069773-1"
             }
     },
     tester: {
         path: {
             api: "http://tester.hrms.com/",
             template: {
                 common: "template/module/common/",
                 setup: "template/module/setup/",
                 frontend: "template/module/frontend/",
             }
         }
     }
 };

var getAPIPath = function() {
 return config[envMnt].path.api;
};
var getSubDomainPath = function() {
 return config[envMnt].path.subDomain;
};
var getTrackingId = function() {
 return config[envMnt].path.trackingId;
};
var getTemplatePath = function(section) {
 return config[envMnt].path.template[section];
};
var setTitleDynamically = function (){
 document.title =  envMnt[0].toUpperCase() + envMnt.substr(1) + " Qandle";
 //document.title = envMnt + " Qandle";
};
var isLoginCustomized = function(keyname) {
 return typeof config[envMnt].isLoginCustomized != "undefined" 
     && config[envMnt].isLoginCustomized[keyname];
};
/*var isLoginLogoCustomized = function() {
 return typeof config[envMnt].isLoginCustomized != "undefined" 
     && config[envMnt].isLoginCustomized.logo;
};*/
var isDashboardCustomized = function() {
 return typeof config[envMnt].isDashboardCustomized != "undefined" 
     && config[envMnt].isDashboardCustomized.content;
}
setTitleDynamically();
