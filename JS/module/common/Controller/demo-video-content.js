app.controller('DemoAnyTimeController', [
    '$scope', '$sce', '$anchorScroll', '$location', '$routeParams', '$modal', '$timeout', 'FnfLettersService', 'utilityService', 'ServerUtilityService',  
    function ($scope, $sce, $anchorScroll, $location, $routeParams, $modal, $timeout, service, utilityService, serverUtilityService) {
        'use strict';
        $scope.linkToken = service.buildLinkTokenObject($routeParams);
               
        /***** Start Validate Link Token Section *****/
        var validateLinkTokenCallback = function (data) {
            $scope.linkToken.valid = (envMnt === 'demo' || envMnt === 'demo1' || envMnt === 'prod7')
                && utilityService.getValue(data, 'status') === "success";
            $scope.linkToken.message = $scope.linkToken.valid ? utilityService.getValue(data, 'message') 
                : "This link has expired. Please connect with your HR team or Qandle team for more details.";
            $scope.linkToken.visible = true;
        };
        var validateLinkToken = function() {
            var url = service.getUrl('validateToken') + "/" + $scope.linkToken.token;
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    validateLinkTokenCallback(data);
                });
        };
        validateLinkToken();
        /***** End Validate Link Token Section *****/

        /****** Add video section starts *****/
        $scope.demoVideoModule = [
            {
                "name": "Hire & Onboard  ",
                "description" : [
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Recruitment: Employee View",
                        "url": "https://player.vimeo.com/video/394886312?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Recruitment: Admin View ",
                        "url": "https://player.vimeo.com/video/394886312#t=636s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Recruitment: Setup View ",
                        "url": "https://player.vimeo.com/video/531163860?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Onboarding: Walkthrough",
                        "url": "https://player.vimeo.com/video/394886182?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Onboarding: eLetters & eSignature",
                        "url": "https://player.vimeo.com/video/547841088?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Onboarding: Candidate Portal",
                        "url": "https://player.vimeo.com/video/547844500?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Customer feedback on Qandle's Hire & Onboard module",
                        "url": "https://player.vimeo.com/video/582885338?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Track",
                "description" : [
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Attendance: Admin View",
                        "url": "https://player.vimeo.com/video/390939415#t=353s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Attendance: Employee View",
                        "url": "https://player.vimeo.com/video/390939415?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Attendance: Setup View",
                        "url": "https://player.vimeo.com/video/390939415#t=554s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Attendance: Manager View",
                        "url": "https://player.vimeo.com/video/531163200?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Attendance: Shift Planner",
                        "url": "https://player.vimeo.com/video/533859355?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Attendance: Shift Details",
                        "url": "https://player.vimeo.com/video/533859240?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Leave Management: Admin View",
                        "url": "https://player.vimeo.com/video/390938519#t=259s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Leave Management: Manager View",
                        "url": "https://player.vimeo.com/video/390938519#t=178s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Leave Management: Employee View",
                        "url": "https://player.vimeo.com/video/390938519?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Leave Management: Setup View",
                        "url": "https://player.vimeo.com/video/390938519#t=339s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Timesheet: Admin View",
                        "url": "https://player.vimeo.com/video/533860923?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Timesheet: Employee View",
                        "url": "https://player.vimeo.com/video/533862344?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Timesheet: Followers",
                        "url": "https://player.vimeo.com/video/533864220?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Timesheet: Manager View",
                        "url": "https://player.vimeo.com/video/533864501?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Timesheet: Setup View",
                        "url": "https://player.vimeo.com/video/533865549?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Field Force Tracking: Tracking",
                        "url": "https://player.vimeo.com/video/420205612?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Field Force Tracking: Beat Assignment",
                        "url": "https://player.vimeo.com/video/420205538?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Productivity Management: Employee View",
                        "url": "https://player.vimeo.com/video/474604907?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Productivity Management: Admin View",
                        "url": "https://player.vimeo.com/video/474604854?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Productivity Management: Manager View",
                        "url": "https://player.vimeo.com/video/474604958?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Customer feedback on Qandle's Track module",
                        "url": "https://player.vimeo.com/video/582885775?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Pay",
                "description" : [
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Payroll: Manager View",
                        "url": "https://player.vimeo.com/video/390938725#t=207s?title=0&byline=0&portrait=0" 
                    },
                    {
                        "name": "Payroll: Employee View",
                        "url": "https://player.vimeo.com/video/390938725?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Payroll: Setup View",
                        "url": "https://player.vimeo.com/video/390938725#t=624s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Travel & Expenses: Employee View",
                        "url": "https://player.vimeo.com/video/394886633?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Travel & Expenses: Admin View ",
                        "url": "https://player.vimeo.com/video/394886633#t=227s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Travel & Expenses: Setup View",
                        "url": "https://player.vimeo.com/video/394886633#t=543s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Customer feedback on Qandle's  Pay module",
                        "url": "https://player.vimeo.com/video/582885604?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Manage",
                "description" : [
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Forms, Documents & Letters",
                        "url": "https://player.vimeo.com/video/394886863#t=340s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Asset Management: Admin View",
                        "url": "https://player.vimeo.com/video/390938144#t=345s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Asset Management: Manager View",
                        "url": "https://player.vimeo.com/video/390938144#t=186s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Asset Management: Employee View",
                        "url": "https://player.vimeo.com/video/390938144#t=103s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Asset Management: Setup View",
                        "url": "https://player.vimeo.com/video/390938144?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Collaboration: Employee & Setup View",
                        "url": "https://player.vimeo.com/video/390938264?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Roles & Permissions",
                        "url": "https://player.vimeo.com/video/394886863#t=117s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Workflows",
                        "url": "https://player.vimeo.com/video/390939691?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Customer feedback on Qandle's Manage module ",
                        "url": "https://player.vimeo.com/video/582885440?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Work",
                "description" : [
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Task management: Employee View",
                        "url": "https://player.vimeo.com/video/533860241?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Task management: Upline",
                        "url": "https://player.vimeo.com/video/533860645?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "OKRs",
                        "url": "https://player.vimeo.com/video/421038694?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Customer feedback on Qandle's Work module",
                        "url": "https://player.vimeo.com/video/582885957?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Engage",
                "description" : [
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Broadcast",
                        "url": "https://player.vimeo.com/video/394886863#t=423s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Polls & Survey: Employee View",
                        "url": "https://player.vimeo.com/video/547848404?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Polls & Survey: Admin View",
                        "url": "https://player.vimeo.com/video/547849212?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Polls & Survey: Setup View",
                        "url": "https://player.vimeo.com/video/547847764?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Birthdays & Work Anniversaries",
                        "url": "https://player.vimeo.com/video/394886863#t=254s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Customer feedback on Qandle's Engage module",
                        "url": "https://player.vimeo.com/video/582885250?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Develop",
                "description" : [
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Performance Management: Admin View",
                        "url": "https://player.vimeo.com/video/390939022#t=507s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Performance Management: Manager View",
                        "url": "https://player.vimeo.com/video/390939022#t=175s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Performance Management: Performance Updates",
                        "url": "https://player.vimeo.com/video/547846241?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Performance Management: Employee View",
                        "url": "https://player.vimeo.com/video/390939022?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Learning & Development: Employee View",
                        "url": "https://player.vimeo.com/video/533856988?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Learning & Development: Admin View ",
                        "url": "https://player.vimeo.com/video/533856689?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Learning & Development: Setup View ",
                        "url": "https://player.vimeo.com/video/533857432?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Learning & Development: Training Manager",
                        "url": "https://player.vimeo.com/video/533858220?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Customer feedback on Qandle's Develop module",
                        "url": "https://player.vimeo.com/video/582885191?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Off-Board",
                "description" : [
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Exit Management: Employee/Admin view",
                        "url": "https://player.vimeo.com/video/394886082?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Exit Management: Setup View",
                        "url": "https://player.vimeo.com/video/394886082#t=299s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Exit Management: Relieved employees system access",
                        "url": "https://player.vimeo.com/video/421036326?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Customer feedback on Qandle's Off-Board module",
                        "url": "https://player.vimeo.com/video/582885527?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Redress",
                "description" : [
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Helpdesk: Employee view",
                        "url": "https://player.vimeo.com/video/390938379?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Helpdesk: Manager View",
                        "url": "https://player.vimeo.com/video/390938379#t=119s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Helpdesk: Admin View",
                        "url": "https://player.vimeo.com/video/390938379#t=212s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Helpdesk: Setup View",
                        "url": "https://player.vimeo.com/video/390938379#t=349s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Customer feedback on Qandle's Redress module",
                        "url": "https://player.vimeo.com/video/582885681?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Analyze",
                "description" : [
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "User Management",
                        "url": "https://player.vimeo.com/video/531164503?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Customer feedback on Qandle's Analyze module",
                        "url": "https://player.vimeo.com/video/582885086?title=0&byline=0&portrait=0"
                    }
                ]
            }
        ]



        $scope.demoVideoModule2 = [
            {
                "name": "Qandle Mobile App",
                "description" : [
                    {
                        "title" : "Smart and Intuitive Android and iOS Mobile Application",
                        "list" : [
                            "Smart chat-bot called ‘Qanbot’ to help employees with lifecycle event requests",
                            "Intuitive and Easy to Use application for the employees and managers",
                            "Smart design layout of the application to carry out all the actions with minimum taps / clicks",
                            "A consolidated view of web application for Managers on their mobile application in order to track their team’s progress on various lifecycle events such as employee leave and attendance"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Intro + Interface + Navigation",
                        "url": "https://player.vimeo.com/video/418000129?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "QanBot",
                        "url": "https://player.vimeo.com/video/418000773?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "General Features",
                        "url": "https://player.vimeo.com/video/417999453?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Travel and Expenses",
                        "url": "https://player.vimeo.com/video/418001194?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Leave Management",
                "description" : [
                    {
                        "title" : "Smart policies, easy tracking, and fast implementation",
                        "list" : [
                            "Fully customizable leave policies and tracking options",
                            "Powerful interactive calendar view",
                            "Smart and flexible leave management",
                            "Easy holiday calendar setup and management"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/390938519",
                "video" : [
                    {
                        "name": "Admin View",
                        "url": "https://player.vimeo.com/video/390938519#t=259s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Manager View",
                        "url": "https://player.vimeo.com/video/390938519#t=178s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/390938519?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View",
                        "url": "https://player.vimeo.com/video/390938519#t=339s?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Payroll",
                "description" : [
                    {
                        "title" : "Flexible pay structures and valued employee benefits",
                        "list" : [
                            "Employee friendly salary structures",
                            "Flexi benefits pay structure and bespoke perquisites",
                            "Employee loans and salary advances management",
                            "Seamless investment declarations and proof submissions"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/390938725",
                "video" : [
                    {
                        "name": "Manager View",
                        "url": "https://player.vimeo.com/video/390938725#t=207s?title=0&byline=0&portrait=0" 
                    },
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/390938725?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View",
                        "url": "https://player.vimeo.com/video/390938725#t=624s?title=0&byline=0&portrait=0"
                    }
                ]
           },
           {
                "name": "Attendance",
                "description" : [
                    {
                        "title" : "Super smooth management of attendance with handy tools",
                        "list" : [
                            "Comprehensive setup for granular policy definition",
                            "Integrate with existing biometric or card swipe machines",
                            "Automatic attendance using Qandle’s mobile app and GPS",
                            "Prompt reminders for policy breach"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/390939415",
                "video" : [
                    {
                        "name": "Admin View",
                        "url": "https://player.vimeo.com/video/390939415#t=353s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/390939415?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View",
                        "url": "https://player.vimeo.com/video/390939415#t=554s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Manager View",
                        "url": "https://player.vimeo.com/video/531163200?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Shift Planner",
                        "url": "https://player.vimeo.com/video/533859355?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Shift Details",
                        "url": "https://player.vimeo.com/video/533859240?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Timesheet",
                "description" : [
                    {
                        "title" : "",
                        "list" : [
                            ""
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/533860923",
                "video" : [
                    {
                        "name": "Admin View",
                        "url": "https://player.vimeo.com/video/533860923?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/533862344?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Timesheet Followers",
                        "url": "https://player.vimeo.com/video/533864220?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Manager View",
                        "url": "https://player.vimeo.com/video/533864501?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View",
                        "url": "https://player.vimeo.com/video/533865549?title=0&byline=0&portrait=0"
                    }
                ]
            },
           {
                "name": "Asset Management",
                "description" : [
                    {
                        "title" : "Manage assets from procurement to retirement",
                        "list" : [
                            "Easy creation of job requirement specific allocation rules",
                            "Seamless asset allocation, exchange, and returns",
                            "Central tracking with smart dashboards",
                            "Easy damage liability assignment for theft and negligence"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/390938144",
                "video" : [
                    {
                        "name": "Admin View",
                        "url": "https://player.vimeo.com/video/390938144#t=345s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Manager View",
                        "url": "https://player.vimeo.com/video/390938144#t=186s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/390938144#t=103s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View",
                        "url": "https://player.vimeo.com/video/390938144?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Performance Management",
                "description" : [
                    {
                        "title" : "Objective feedback and regular coaching",
                        "list" : [
                            "Regular 1-on-1s for continuous feedback and improvement",
                            "Multi-stakeholder feedback for meaningful coaching and development",
                            "Easy management of promotions, transfers, and successions",
                            "Fully configurable assessment frameworks"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/390939022",
                "video" : [
                    {
                        "name": "Admin View",
                        "url": "https://player.vimeo.com/video/390939022#t=507s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Manager View",
                        "url": "https://player.vimeo.com/video/390939022#t=175s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Performance Updates",
                        "url": "https://player.vimeo.com/video/547846241?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/390939022?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Recruitment + ATS",
                "description" : [
                    {
                        "title" : "Find, attract, hire, and nurture the best talent",
                        "list" : [
                            "Easy sourcing with branded microsite and job boards posting",
                            "Powerful dashboards for intuitive applicant tracking",
                            "Hassle free scheduling and process management",
                            "Collaborative hiring to ensure you hire the right people"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/394886312",
                "video" : [
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/394886312?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Admin View ",
                        "url": "https://player.vimeo.com/video/394886312#t=636s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View ",
                        "url": "https://player.vimeo.com/video/531163860?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Learning & Development",
                "description" : [
                    {
                        "title" : "",
                        "list" : [
                            "",
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/533856689",
                "video" : [
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/533856988?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Admin View ",
                        "url": "https://player.vimeo.com/video/533856689?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View ",
                        "url": "https://player.vimeo.com/video/533857432?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Training Manager",
                        "url": "https://player.vimeo.com/video/533858220?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Travel & Expenses",
                "description" : [
                    {
                        "title" : "Business expense requests, policies, and reconciliation",
                        "list" : [
                            "Higher transparency, better compliance, and greater control",
                            "Easy policy implementation and budget allocation",
                            "Automatic periodic bills and claim submissions",
                            "Smart bill scanning to save time and effort"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/394886633",
                "video" : [
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/394886633?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Admin View ",
                        "url": "https://player.vimeo.com/video/394886633#t=227s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View",
                        "url": "https://player.vimeo.com/video/394886633#t=543s?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Collaboration",
                "description" : [
                    {
                        "title" : "Connected and engaged teams built with cooperation at core",
                        "list" : [
                            "Full feature internal social network to better engage employees",
                            "Listen to your employees with anonymous polls and shout boxes",
                            "Drive bottom up innovation and crowd solve key issues",
                            "Socially recognize good work and motivate everyone"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/390938264",
                "video" : [
                    {
                        "name": "Employee & Setup View",
                        "url": "https://player.vimeo.com/video/390938264?title=0&byline=0&portrait=0"
                    }
                    // {
                    //     "name": "Setup View",
                    //     "url": "https://player.vimeo.com/video/394886633#t=245s"
                    // }
                ]
            },
            {
                "name": "Exit Management",
                "description" : [
                    {
                        "title" : "One stop solution for everything from hire to retire",
                        "list" : [
                            "Candidate portal to keep your prospective employees engaged",
                            "Automated, personalized, and smooth on-boarding",
                            "Reliable, comprehensive, and secure personnel records",
                            "Streamlined exit process including paperless e-clearances"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/394886082",
                "video" : [
                    {
                        "name": "Employee/Admin view",
                        "url": "https://player.vimeo.com/video/394886082?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View",
                        "url": "https://player.vimeo.com/video/394886082#t=299s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Relieved employees system access",
                        "url": "https://player.vimeo.com/video/421036326?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Objectives and Key Results",
                "description" : [
                    {
                        "title" : "Company, Team, and Own objectives and key results",
                        "list" : [
                            "Easy goals establishment, management, and cascading",
                            "Real time, and seamless project tracking for better results",
                            "Add multiple collaborators for team projects",
                            "Stay informed by following public goals"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/421038694",
                "video" : [
                    {
                        "name": "OKRs",
                        "url": "https://player.vimeo.com/video/421038694?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Task management",
                "description" : [
                    {
                        "title" : "",
                        "list" : [
                            ""
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/533860241",
                "video" : [
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/533860241?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Upline",
                        "url": "https://player.vimeo.com/video/533860645?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Helpdesk",
                "description" : [
                    {
                        "title" : "Resolve employees' concerns faster and better",
                        "list" : [
                            "Easy reporting and analysis with intuitive issue categorization",
                            "Efficient ticket flow management with pre-decided ticket owners and resolution TATs",
                            "Timely resolutions with regular reminders and auto-escalations",
                            "Feedback to track resolution quality"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/390938379",
                "video" : [
                    {
                        "name": "Employee view",
                        "url": "https://player.vimeo.com/video/390938379?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Manager View",
                        "url": "https://player.vimeo.com/video/390938379#t=119s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Admin View",
                        "url": "https://player.vimeo.com/video/390938379#t=212s?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View",
                        "url": "https://player.vimeo.com/video/390938379#t=349s?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Onboarding",
                "description" : [
                    {
                        "title" : "One stop solution for everything from hire to retire",
                        "list" : [
                            "Candidate portal to keep your prospective employees engaged",
                            "Automated, personalized, and smooth on-boarding",
                            "Reliable, comprehensive, and secure personnel records",
                            "Streamlined exit process including paperless e-clearances"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/394886182",
                "video" : [
                    {
                        "name": "Walkthrough",
                        "url": "https://player.vimeo.com/video/394886182?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "eLetters & eSignature",
                        "url": "https://player.vimeo.com/video/547841088?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Candidate Portal",
                        "url": "https://player.vimeo.com/video/547844500?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Workflows",
                "description" : "Workflows",
                "url" : "https://player.vimeo.com/video/390939691",
                "video" : [
                    {
                        "name": "Walkthrough",
                        "url": "https://player.vimeo.com/video/390939691?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "User Management",
                "description" : [
                    {
                        "title" : "A comprehensive module to maintain all the organization’s employee master data",
                        "list" : [
                            "Ability to maintain all the relevant details pertaining to talent management such as Education details and Past Work experience details",
                            "Ability to create custom fields in order to maintain relevant information of the employees on the portal",
                            "Ability to give the access to the employees to edit any of their personal, professional details, and trigger a change management workflow for the approval of these information entered by the employees",
                            "Ability to define various admins on the basis of Business Units, Locations, Department, and provide the ability to admins to add employee data and activate users for their scope"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/531164503",
                "video" : [
                    {
                        "name": "User Management",
                        "url": "https://player.vimeo.com/video/531164503?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": " Roles & Permissions",
                "description" : [
                    {
                        "title" : "A core functionality of Qandle which provides the complete flexibility to define User Permissions",
                        "list" : [
                            "Ability to activate different employee tools for lifecycle event based on the requirement",
                            "Ability to create different admins for different modules such as leave management admin can be a different user than Time and Attendance Management admin"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/394886863#t=117s",
                "video" : [
                    {
                        "name": "Roles & Permissions",
                        "url": "https://player.vimeo.com/video/394886863#t=117s?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Birthdays & Work Anniversaries",
                "description" : [
                    {
                        "title" : "Boost employee engagement with automated process around birthday and work anniversary wishes",
                        "list" : [
                            "Ability to design custom templates which are triggered to employees on their birthday or work anniversary",
                            "A completely automated and hassle-free process",
                            "Visibility of all the birthdays and work anniversaries of the employees for the current date and any particular future date on the Employee dashboard",
                            "Ability for the employees to send their wishes to the respective employees who have their birthdays and work anniversaries on a particular day"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/394886863#t=254s",
                "video" : [
                    {
                        "name": "Birthdays & Work Anniversaries",
                        "url": "https://player.vimeo.com/video/394886863#t=254s?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Polls & Survey",
                "description" : [
                    {
                        "title" : "",
                        "list" : [
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/547848404",
                "video" : [
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/547848404?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Admin View",
                        "url": "https://player.vimeo.com/video/547849212?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Setup View",
                        "url": "https://player.vimeo.com/video/547847764?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Forms, Documents & Letters",
                "description" : [
                    {
                        "title" : "Go eco-friendly and adopt a hassle free workflow around HR forms, documents and letters",
                        "list" : [
                            "Trigger the requirement around submission of any documents and forms to employees from the tool itself",
                            "Verify the submitted documents and forms, perform the complete validation process of the submitted documents on Qandle",
                            "Create custom templates for all kinds of HR letters, and trigger letters to employees individually or in bulk",
                            "A hassle free and eco-friendly solution to completely reduce the challenge of sending multiple reminders to employees for document and form submissions"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/394886863#t=340s",
                "video" : [
                    {
                        "name": "Forms, Documents & Letters",
                        "url": "https://player.vimeo.com/video/394886863#t=340s?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": " Broadcast",
                "description" : [
                    {
                        "title" : "Increase Employee engagement and connectivity within the company with Broadcasts",
                        "list" : [
                            "Send any number of communications to employees as email or mobile application notifications",
                            "Trigger persistent notice for employees on their individual dashboards",
                            "Design custom messages / templates under Broadcast or share videos or high resolution images with employees",
                            "Ability to select and trigger broadcasts to employees on the basis of Business Units, Locations, and Departments etc."
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/394886863#t=423s",
                "video" : [
                    {
                        "name": "Broadcast",
                        "url": "https://player.vimeo.com/video/394886863#t=423s?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "  Resources ",
                "description" : [
                    {
                        "title" : "Your own storage facility to maintain document repository",
                        "list" : [
                            "Share policies and all the relevant documents with the employees",
                            "Share specific documents and policies with specific employees on the basis of Business Units, Locations, and Departments etc."
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/394886863#t=423s",
                "video" : [
                    {
                        "name": " Resources ",
                        "url": "https://player.vimeo.com/video/394886863#t=423s?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Field Force Tracking",
                "description" : [
                    {
                        "title" : "A live tracking solution for on-field employees",
                        "list" : [
                            "Ability to assign beats (predefined locations) from where the on-field employee would have to check-in",
                            "Easy and real-time tracking of on-field employees by managers and admins, through an intuitive path generated on map",
                            "Ability to view all the past date data and tracking map generated for the on-field employees with all the employee check-ins",
                            "An intuitive mobile application with language options of Hindi and English to assist in increasing adoption among on-field employees"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/420205612",
                "video" : [
                    {
                        "name": "Field Tracking",
                        "url": "https://player.vimeo.com/video/420205612?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Beat Assignment",
                        "url": "https://player.vimeo.com/video/420205538?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Productivity Management",
                "description" : [
                    {
                        "title" : "Track the productive, non-productive hours of the employees",
                        "list" : [
                            "Ability to capture screenshots at designated intervals to categorize processes run by the employees under productive and non-productive hours",
                            "Ability to compare the performance of different users on the basis of productivity, non-productivity and work hours",
                            "Ability to handle different time zones and users at multi-geographic locations",
                            "Ability to provide analytics and dashboard view to managers for the productivity tracking of their direct report(s) on a real-time basis"
                        ]
                    }
                ],
                "url" : "https://player.vimeo.com/video/474604907",
                "video" : [
                    {
                        "name": "Employee View",
                        "url": "https://player.vimeo.com/video/474604907?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Admin View",
                        "url": "https://player.vimeo.com/video/474604854?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Manager View",
                        "url": "https://player.vimeo.com/video/474604958?title=0&byline=0&portrait=0"
                    }
                ]
            },
            {
                "name": "Product",
                "description" : [
                    {
                        "title" : ""
                    }
                ],
                "video" : [
                    {
                        "name": "Hire & Onboard",
                        "url": "https://player.vimeo.com/video/582885338?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Track",
                        "url": "https://player.vimeo.com/video/582885775?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Pay",
                        "url": "https://player.vimeo.com/video/582885604?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Manage",
                        "url": "https://player.vimeo.com/video/582885440?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Work",
                        "url": "https://player.vimeo.com/video/582885957?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Engage",
                        "url": "https://player.vimeo.com/video/582885250?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Develop",
                        "url": "https://player.vimeo.com/video/582885191?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Offboard",
                        "url": "https://player.vimeo.com/video/582885527?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Redress",
                        "url": "https://player.vimeo.com/video/582885681?title=0&byline=0&portrait=0"
                    },
                    {
                        "name": "Analyze",
                        "url": "https://player.vimeo.com/video/582885086?title=0&byline=0&portrait=0"
                    }
                ]
            }
            
        ];        
        /****** Add video section ends *****/

        $scope.videoUrl =  $sce.trustAsResourceUrl('https://player.vimeo.com/video/641098293?title=0&byline=0&portrait=0');
        $scope.overview = "Qandle Overview" 
        $scope.subHeading = "";
        $scope.description = null,
        $scope.videoSection = {
            visible: true
        };
        var toggleVideoSection = function (flag) {
            $scope.videoSection.visible = flag;
        };
        $scope.moduleStVideo = function(){
            $location.hash('moduleVideoSt');
            $anchorScroll();
        }

        $scope.changeVideoUrl = function (data, info) {
            
            toggleVideoSection(false);
            $timeout(function () {
                toggleVideoSection(true);
            }, 0);
            $scope.overview = data.name;
            $scope.subHeading = info.list.name;
            $scope.description = data.description;
            $scope.videoUrl = $sce.trustAsResourceUrl(info.list.url);
            $location.hash('moduleVideoSt');
            $anchorScroll();
            $(this).addClass("active");
            console.log($scope.description[0].title);
        };
        $scope.themeVideo = function (){
            $scope.videoUrl = $sce.trustAsResourceUrl('https://player.vimeo.com/video/641098293?title=0&byline=0&portrait=0');
            $scope.overview = "Qandle Introduction";
            $scope.subHeading = "";
        };
        $scope.themeVideoCF = function (){
            $scope.videoUrl = $sce.trustAsResourceUrl('https://player.vimeo.com/video/569804720');
            $scope.overview = "Would you recommend Qandle Video";
            $scope.subHeading = "";
        };
        $scope.themeVideoWQ = function (){
            $scope.videoUrl = $sce.trustAsResourceUrl('https://player.vimeo.com/video/554256394');
            $scope.overview = "Video on what customers like most about Qandle";
            $scope.subHeading = "";
        };
        
        /***** Start: AngularJS Modal Section *****/
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                backdrop: 'static',
                keyboard: false,
                size: size
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };
        /***** End: AngularJS Modal Section *****/
        angular.element(document).ready(function () {
            $timeout(function(){
                $('#award_slider').owlCarousel({
                    items:5 ,
                    stagePadding:0,
                    navigation : false,
                    loop:true,
                    margin:3,
                    autoplay: true,
                    autoplayTimeout: 3000,
                    smartSpeed:450,
                    responsiveClass:true,
                    responsive:{
                        0:{
                            items:1
                        },
                        600:{
                            items:2
                        },
                        1000:{
                            items:4
                        },
                        1200:{
                            items:5
                        }
                    }
                });
                $('#owlMobileSlider').owlCarousel({
                    items:3 ,
                    stagePadding:0,
                    navigation : true,
                    loop:true,
                    margin:10,
                    slideBy: 3,
                    smartSpeed:450,
                    responsiveClass:true,
                    responsive:{
                        0:{
                            items:1
                        },
                        600:{
                            items:2
                        },
                        1000:{
                            items:2
                        },
                        1200:{
                            items:3
                        }
                    }
                });
            }, 3000);
        });
    }
]);