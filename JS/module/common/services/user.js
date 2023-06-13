app.service('userService', [
    'utilityService', '$location',
    function (utilityService, $location) {
        'use strict';

        this.url = {
            login: 'auth/login',
            logout: 'auth/logout',
            forgotPassword: 'password/email',
            markAsRead: 'communication/settings/do-read',
            markBulkAsRead: 'communication/settings/do-bulk-read',
            helpdesk: 'helpdesk/setting',
            reportProblem: 'employee/report-problem',
            favorites: 'employee/favorites',
            alert: 'employee/alert-count',
            refreshToken: 'refresh-token',
            uploadPic: 'employee/upload-pic',
            resetPassword: 'password/resetrequest',
            deleteSession: 'employee/delete-session',
            totalTime: 'timeattendance/employee/clockin-time',
            allmandatorygroup: 'user-management/active/group?mandatory=true&field=true',
            autosearch: 'autosearch',
            validateResetToken: 'password/reset',
            termsConditions: 'employee/login-tc-accept',
            googleLogin: 'google/login',
            userDetails: 'user-addition/detail',
            slackIntegration: 'slack/button',
            integrationsThirdParty: 'third-party/integrations',
            googleDrivelogin: 'google-drive/login',
            payrollAutomation: 'payroll/automation-details'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.getTokenResetTime = function () {
            var d = new Date();
            return d.getTime();
        };
        this.setStorageValue = function (response) {
            utilityService.setStorageValue('accessToken', utilityService.getValue(response, 'accessToken'), 1200);
            utilityService.setStorageValue('accessTokenExpiration', utilityService.getValue(response, 'accessTokenExpiration'), 1200);
            utilityService.setStorageValue('email', utilityService.getInnerValue(response, 'employee_detail', 'email'));
            utilityService.setStorageValue('fullname', utilityService.getInnerValue(response, 'employee_detail', 'full_name'));
            utilityService.setStorageValue('company', utilityService.getInnerValue(response, 'employee_detail', 'company_name'));
            utilityService.setStorageValue('displayDetail', utilityService.getInnerValue(response, 'employee_detail', 'display_detail'));
            utilityService.setStorageValue('lastChangePassword', utilityService.getInnerValue(response, 'employee_detail', 'lastChangePassword'));
            utilityService.setStorageValue('profilePic', utilityService.getInnerValue(response, 'employee_detail', 'profile_pic', 'images/no-avatar.png'));
            utilityService.setStorageValue('cropType', utilityService.getInnerValue(response, 'employee_detail', 'crop_type', 1));
            utilityService.setStorageValue('companyLogo', utilityService.getInnerValue(response, 'employee_detail', 'company_log'));
            utilityService.setStorageValue('empPermissions', utilityService.getInnerValue(response, 'employee_detail', 'permission_slug', []));
            utilityService.setStorageValue('loginEmpId', utilityService.getInnerValue(response, 'employee_detail', 'emp_id'));
            utilityService.setStorageValue('loginUserId', utilityService.getInnerValue(response, 'employee_detail', 'user_id'));
            utilityService.setStorageValue('setupPermissions', utilityService.getInnerValue(response, 'employee_detail', 'setup_permission_slug', []));
            utilityService.setStorageValue('TokenCounter', 0);
            utilityService.setStorageValue('tokenResetTime', this.getTokenResetTime());
            utilityService.setStorageValue('pageNo', 1);
            utilityService.setStorageValue('numPerPage', 10);
            utilityService.setStorageValue('NewHirePageNo', 1);
            utilityService.setStorageValue('NewHireNumPerPage', 10);
            utilityService.setStorageValue('helpdeskPageNo', 1);
            utilityService.setStorageValue('helpdeskNumPerPage', 10);
            utilityService.setStorageValue('paginationObject', this.buildPaginationObjectPerSection());
            utilityService.setStorageValue('profileField', utilityService.getInnerValue(response, 'employee_detail', 'profile_field', []));
            utilityService.setStorageValue('loginEmail', utilityService.getInnerValue(response, 'employee_detail', 'emp_email_id'));
            utilityService.setStorageValue('isSuperAdmin', utilityService.getInnerValue(response, 'employee_detail', 'is_super_admin'));
            utilityService.setStorageValue('envMnt', utilityService.getInnerValue(response, 'employee_detail', 'subdomain_name', 'qandle'));
            utilityService.setStorageValue('hasPasswordChanged', utilityService.getInnerValue(response, 'employee_detail', 'has_password_changed', false));
            utilityService.setStorageValue('isExitInitiated', utilityService.getInnerValue(response, 'employee_detail', 'is_exit_initiated', false));
            utilityService.setStorageValue('travelPolicy', utilityService.getInnerValue(response, 'employee_detail', 'system_plans_travel_expense_policy'));
            utilityService.setStorageValue('isMandatoryFieldRequired', utilityService.getInnerValue(response, 'employee_detail', 'mandatory_fields_required', false));
            utilityService.setStorageValue('timesheetProjectManager', utilityService.getInnerValue(response, 'employee_detail', 'timesheet_project_manager', false));
            utilityService.setStorageValue('timesheetFollower', utilityService.getInnerValue(response, 'employee_detail', 'timesheet_followers', false));
            utilityService.setStorageValue('timesheetCreator', utilityService.getInnerValue(response, 'employee_detail', 'is_timesheet_creator', false));
            utilityService.setStorageValue('orgChartShowDownlineOnly', utilityService.getInnerValue(response, 'employee_detail', 'org_chart_show_downline_only', false));
            utilityService.setStorageValue('employeeCanNotApplyRegularization', utilityService.getInnerValue(response, 'employee_detail', 'employee_can_not_apply_regularization', false));
            utilityService.setStorageValue('pipFollower', utilityService.getInnerValue(response, 'employee_detail', 'pip_followers', false));
            utilityService.setStorageValue('pipEmployee', utilityService.getInnerValue(response, 'employee_detail', 'assign_pips', false));
            utilityService.setStorageValue('login_tc_enabled', utilityService.getInnerValue(response, 'employee_detail', 'login_tc_enabled', false));
            utilityService.setStorageValue('login_tc_accepted', utilityService.getInnerValue(response, 'employee_detail', 'login_tc_accepted', false));
            utilityService.setStorageValue('employeeCanNotApplyLeave', utilityService.getInnerValue(response, 'employee_detail', 'employee_can_not_apply_leave', false));
            utilityService.setStorageValue('show_only_offer', utilityService.getInnerValue(response, 'employee_detail', 'show_only_offer', false));
            // utilityService.setStorageValue('sidenav_view_external_recruitment', utilityService.getInnerValue(response, 'employee_detail', 'sidenav_view_external_recruitment', false));
            // utilityService.setStorageValue('sidenav_view_birthday_anniversaries_of_external_recruiter', utilityService.getInnerValue(response, 'employee_detail', 'sidenav_view_birthday_anniversaries_of_external_recruiter', false));
        };
        this.removeStorageValue = function () {
            utilityService.removeStorageValue('accessToken');
            utilityService.removeStorageValue('accessTokenExpiration');
            utilityService.removeStorageValue('email');
            utilityService.removeStorageValue('fullname');
            utilityService.removeStorageValue('company');
            utilityService.removeStorageValue('displayDetail');
            utilityService.removeStorageValue('lastChangePassword');
            utilityService.removeStorageValue('profilePic');
            utilityService.removeStorageValue('cropType');
            utilityService.removeStorageValue('companyLogo');
            utilityService.removeStorageValue('empPermissions');
            utilityService.removeStorageValue('loginEmpId');
            utilityService.removeStorageValue('setupPermissions');
            utilityService.removeStorageValue('TokenCounter');
            utilityService.removeStorageValue('refreshToken');
            utilityService.removeStorageValue('TokenCounter_expiresIn');
            utilityService.removeStorageValue('loginTime_expiresIn');
            utilityService.removeStorageValue('loginUserId');
            utilityService.removeStorageValue('tokenResetTime');
            utilityService.removeStorageValue('pageNo');
            utilityService.removeStorageValue('numPerPage');
            utilityService.removeStorageValue('NewHirePageNo');
            utilityService.removeStorageValue('NewHireNumPerPage');
            utilityService.removeStorageValue('helpdeskPageNo');
            utilityService.removeStorageValue('helpdeskNumPerPage');
            utilityService.removeStorageValue('paginationObject');
            utilityService.removeStorageValue('profileField');
            utilityService.removeStorageValue('loginEmail');
            utilityService.removeStorageValue('isSuperAdmin');
            utilityService.removeStorageValue('hasPasswordChanged');
            utilityService.removeStorageValue('isCandidateLogin');
            utilityService.removeStorageValue('isExitInitiated');
            utilityService.removeStorageValue('device');
            utilityService.removeStorageValue('travelPolicy');
            utilityService.removeStorageValue('isMandatoryFieldRequired');
            utilityService.removeStorageValue('mobileHidebar');
            utilityService.removeStorageValue('timesheetProjectManager');
            utilityService.removeStorageValue('timesheetCreator');
            utilityService.removeStorageValue('timesheetFollower');
            utilityService.removeStorageValue('legalEntityId');
            //utilityService.removeStorageValue('countries');
            //utilityService.removeStorageValue('states');
            utilityService.removeStorageValue('mandatoryGroups');
            utilityService.removeStorageValue('locationElements');
            utilityService.removeStorageValue('orgChartShowDownlineOnly');
            utilityService.removeStorageValue('employeeCanNotApplyRegularization');
            utilityService.removeStorageValue('pipFollower');
            utilityService.removeStorageValue('pipEmployee');
            utilityService.removeStorageValue('login_tc_enabled');
            utilityService.removeStorageValue('login_tc_accepted');
            utilityService.removeStorageValue('employeeCanNotApplyLeave');
            utilityService.removeStorageValue('show_only_offer');
            utilityService.removeStorageValue('legalEntityElements');
        };
        this.buildLoginModel = function (model) {
            return {
                email: utilityService.getValue(model, 'email'),
                password: utilityService.getValue(model, 'password'),
                cpassword: utilityService.getValue(model, 'cpassword'),
                emp_code: utilityService.getValue(model, 'emp_code'),
                otp: utilityService.getValue(model, 'otp'),
                otp: utilityService.getValue(model, 'otp_token')
            }
        };
        this.buildLoginPayload = function (model, loginVia) {
            var payload = {
                password: model.password,
                for_clockin: utilityService.getValue(model, 'for_clockin', false)
            };

            if (utilityService.getValue(loginVia, 'selected') == 2) {
                payload.emp_code = utilityService.getValue(model, 'emp_code');
            } else {
                payload.email = utilityService.getValue(model, 'email');
            }

            return payload;
        };
        this.buildForgotPasswordPayload = function (model) {
            return {
                email: model.email,
                url: $location.protocol() + "://" + $location.host() + "/#/change-password"
            }
        };
        this.buildResetPasswordPayload = function (model, token) {
            return {
                token: token,
                password: model.password,
                password_confirmation: model.cpassword
            }
        };
        this.buildDashboardHelpdeskObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "helpdesk" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,
                createTicket: (section == "create-ticket" && (subsection == "home" || !subsection || subsection == "/")) ? true : false,
                ticketStatus: (section == "ticket-details" && (subsection == "home" || !subsection || subsection == "/")) ? true : false,
                ticketRating: (section == "ticket-rating" && (subsection == "home" || !subsection || subsection == "/")) ? true : false
            };
        };
        this.buildDashboardOKRObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "performance" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false
            }
        };

        this.buildLayoutObject = function (section, currentUrl) {
            return {
                setup: section == "admin" ? true : false,
                frontend: currentUrl.indexOf('frontend') >= 0 ? true : false,
                dashboard: (currentUrl.indexOf('dashboard') >= 0 || section == "dashboard") ? true : false
            }
        };
        this.buildDashboardPerformanceObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "feedback" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                giveFeedback: (section == "give-feedback" && (subsection == "home" || !subsection || subsection == "/")) ? true : false,

                viewDetails: (section == "viewDetails" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                viewReport: (section == "viewReport" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                updatesTemplateSetting: (section == "updates-template-setting" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                scheduleNext: (section == "schedule-next" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                scheduleList: (section == "schedule-list" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                updatesViewDetails: (section == "updates-view-details" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                cycleDetails: (section == "cycle-details" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                cycleViewFeedback: (section == "view-feedback" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                cycleEvaluation: (section == "cycle-evaluation" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                cycleOverallDetails: (section == "cycle-overall-details" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                cycleAnalytics: (section == "cycle-analytics" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false
            };
        };
        this.buildDashboardTimesheetObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "timesheet" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,

                approver: (section == "timesheet" && subsection == "approver")
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false
            };
        };
        this.buildDashboardPIPObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "pip" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false
            };
        };


        this.buildDashboardScreenshotObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "screenshot" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false
            }
        }

        this.buildDashboardTaskObject = function(section, subsection, currentUrl) {
            return {
                home: (section == "task" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false
            };
        };

        this.buildDashboardThirdPartyObject = function(section, subsection, currentUrl) {
            return {
                home: (section == "thirdparty" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false
            };
        };

        this.buildDashboardProductmapObject = function(section, subsection, currentUrl) {
            return {
                home: (section == "productmap" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('productmap') >= 0 ? true : false
            };
        };
        
        this.buildDashboardObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "dashboard" || section == "home") ? true : false,
                timeoff: section == "time-off" ? true : false,
                attendance: section == "attendance" ? true : false,
                alert: section == "alert" ? true : false,
                team: section == "my-team" ? true : false,
                people: section == "people" ? true : false,
                calendar: section == "calendar" ? true : false,
                signature: section == "signature" ? true : false,
                helpdesk: this.buildDashboardHelpdeskObject(section, subsection, currentUrl),
                compensation: section == "compensation" ? true : false,
                accountSettings: section == "account-settings" ? true : false,
                profile: section == "profile" ? true : false,
                page: {
                    faq: section == "FAQs" ? true : false,
                    learningCenter: section == "learning-center" ? true : false,
                },
                resource: (section == "resource" && currentUrl.indexOf('dashboard') >= 0) ? true : false,
                noPermission: section == "no-permission" ? true : false,
                social: section == "social" ? true : false,
                feedback: this.buildDashboardPerformanceObject(section, subsection, currentUrl),
                performance: this.buildDashboardOKRObject(section, subsection, currentUrl),
                exitManagement: section == "exitManagement" ? true : false,
                recruitment: (section == "recruitment" && currentUrl.indexOf('dashboard') >= 0) ? true : false,
                externalRecruiter: (section == "externalRecruiter" && currentUrl.indexOf('dashboard') >= 0) ? true : false,
                recruiterDetail: (section == "recruiterDetail" && currentUrl.indexOf('dashboard') >= 0) ? true : false,
                travelExpense: (section == "travel-expense" && currentUrl.indexOf('dashboard') >= 0) ? true : false,
                ijp: (section == "ijp" && currentUrl.indexOf('dashboard') >= 0) ? true : false,
                timesheet: this.buildDashboardTimesheetObject(section, subsection, currentUrl),
                pip: this.buildDashboardPIPObject(section, subsection, currentUrl),
                productivity: this.buildDashboardScreenshotObject(section, subsection, currentUrl),
                task: this.buildDashboardTaskObject(section, subsection, currentUrl),
                lnd: this.buildlndObject(section, subsection, currentUrl),
                thirdparty: this.buildDashboardThirdPartyObject(section, subsection, currentUrl),
                productmap: this.buildDashboardProductmapObject(section, subsection, currentUrl)
            };
        };
        this.buildUsrMgmntObject = function (section, subsection) {
            return {
                home: (section == "user-management" && (subsection == "home" || !subsection || subsection == "/")) ? true : false,
                summary: {
                    individual: (section == "user-management" && subsection == "summary-individual") ? true : false,
                    bulk: (section == "user-management" && subsection == "summary-bulk") ? true : false
                },
                migration: {
                    individual: (section == "user-management" && subsection == "migration-individual") ? true : false,
                    bulk: (section == "user-management" && subsection == "migration-bulk") ? true : false
                },
                profileField: (section == "user-management" && subsection == "profile") ? true : false,
            }
        };

        this.buildScreenshotAdminObject = function (section, subsection) {
            return {
                home: (section == "screenshot-admin" && (subsection == "home" || !subsection || subsection == "/")) ? true : false,
            }
        }
        this.buildExitObject = function (section, subsection) {
            return {
                home: (section == "exit" && (subsection == "home" || !subsection || subsection == "/")) ? true : false,
                initiate: (section == "exit" && subsection == "initiate") ? true : false,
                status: (section == "exit" && subsection == "status") ? true : false,
                draft: (section == "exit" && subsection == "draft") ? true : false,
                noDues: (section == "exit" && subsection == "nodues-manager") ? true : false,
                verifyDocument: (section == "exit" && subsection == "verifyDocument") ? true : false,
            }
        };
        this.buildNHMObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "new-hire" && (subsection == "home" || !subsection || subsection == "/")) ? true : false,
                detail: (section == "new-hire" && subsection == "detail") ? true : false,
                filedoc: (section == "new-hire" && subsection == "filedoc") ? true : false,
                bulk: (section == "new-hire" && subsection == "bulk") ? true : false,
                draft: (section == "new-hire" && subsection == "draft") ? true : false,
                verify: (section == "new-hire" && subsection == "verify") ? true : false,
                profileField: (section == "new-hire" && subsection == "profile-field") ? true : false,
                offer: (section == "new-hire" && subsection == "offer") && currentUrl.indexOf('frontend') >= 0 ? true : false,
            }
        };
        this.buildHelpdeskFrontendObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "helpdesk" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.buildPerformanceAdminObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "performance-admin" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.buildTimeAttendanceFrontendObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "adminAttendance" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.buildManagerHelpdeskObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "manager-helpdesk" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                ticketDetails: (section == "manager-ticket" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.buildPayrollObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "payroll" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false && subsection != "summary",
                summary: (section == "payroll" && subsection == "summary")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false && subsection == "summary",
                investmentDeclaration: (section == "payroll" && subsection == "investmentDeclaration") ? true : false,
                previousEmployer: (section == "payroll" && subsection == "previousEmployer") ? true : false,
                runPayroll: (section == "payroll" && subsection == "runPayroll") ? true : false,
                checks: (section == "payroll" && subsection == "checks") ? true : false,
                checksCorrection: (section == "payroll" && subsection == "checksCorrection") ? true : false,
                investmentProof: (section == "payroll" && subsection == "investmentProof") ? true : false,
            }
        };
        this.buildInsuranceObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "insurance" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.buildProvisionManagerObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "provision-manager" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                bulk: (section == "provision-manager" && subsection == "bulk")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                provisionAllotment: (section == "provision-manager" && subsection == "provisionAllotment")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                provisionRevoke: (section == "provision-manager" && subsection == "provisionRevoke")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };

        
        this.buildLndManagerObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "lnd-manager" && (subsection == "home" || !subsection || subsection == "/")) 
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                bulk: (section == "lnd-manager" && subsection == "bulk") 
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                lndAllotment: (section == "lnd-manager" && subsection == "lndAllotment") 
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                lndRevoke: (section == "lnd-manager" && subsection == "lndRevoke") 
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };

        this.buildProvisionsObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "provisions" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.buildProvisionAdminObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "provisions-admin" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.buildlndObject = function(section, subsection, currentUrl) {
            return {
                home: (section == "lnd" && (subsection == "home" || !subsection || subsection == "/")) 
                    && currentUrl.indexOf('dashboard') >= 0 ? true : false,
                lndDetails:(section == "lnd" && (subsection == "lndDetails" || !subsection || subsection == "/")) 
                && currentUrl.indexOf('dashboard') >= 0 ? true : false
            }
        }; 
        this.buildLndAdminObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "lnd" && (subsection == "home" || !subsection || subsection == "/")) 
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                bulkAssign: (section == "lnd" && subsection == "bulk-assign") ? true : false,
            }
        };
        
        this.buildLeaveObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "leave" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };

        this.buildClientObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "recclient" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };

        this.buildpreBuiltReportObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "prebuiltReports" && (subsection == "home" || !subsection || subsection == "/") && currentUrl.indexOf('frontend') >= 0) ? true : false,
                report: (section == "prebuiltReports" && subsection == "report" && currentUrl.indexOf('frontend') >= 0) ? true : false,
                other: (section == "prebuiltReports" && subsection == "other" && currentUrl.indexOf('frontend') >= 0) ? true : false,
                provision: (section == "prebuiltReports" && subsection == "provision" && currentUrl.indexOf('frontend') >= 0) ? true : false,
                timeAttendance: (section == "prebuiltReports" && subsection == "time-attendance" && currentUrl.indexOf('frontend') >= 0) ? true : false,
                provisionReport: (section == "prebuiltReports" && subsection == "provisionReport" && currentUrl.indexOf('frontend') >= 0) ? true : false,
                userManagementReport: (section == "prebuiltReports" && subsection == "userManagementReport" && currentUrl.indexOf('frontend') >= 0) ? true : false,
                onboardingReport : (section == "prebuiltReports" && subsection == "onboardingReport" && currentUrl.indexOf('frontend') >= 0) ? true : false,
            };
        };
        this.builBroadcastObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "broadcast" && (subsection == "home" || !subsection || subsection == "/") && currentUrl.indexOf('frontend') >= 0) ? true : false,
                notice: (section == "broadcast" && subsection == "notice")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false && subsection == "notice",
            };
        };
        this.builElcmObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "elcm" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                bulkAssign: (section == "elcm" && subsection == "bulk-assign") ? true : false,
            };
        };
        this.builTravelExpenseObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "travel-expense" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                requestDetail: (section == "travel" && subsection == "request-details") ? true : false,
                spendsDetail: (section == "travel" && subsection == "spends-details") ? true : false,
                expenseDetail: (section == "travel-expense" && subsection == "expense-details") ? true : false,
                expenseDetailReconcile: (section == "travel-expense" && subsection == "expense-details-reconcile") ? true : false,
            };
        };
        this.builTravelPlannerObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "travel-planner" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                requestDetail: (section == "travel-planner" && subsection == "request-details") ? true : false,
                uploadTickets: (section == "travel-planner" && subsection == "uplaod-tickets") ? true : false
            };
        };

        this.buildAttendanceShiftPlannerObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "shift-planner" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.builAdminAttendanceObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "adminPerformance" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                reviewCycle: (section == "adminPerformance" && subsection == "reviewCycle") ? true : false,
                manageReviewCycle: (section == "adminPerformance" && subsection == "manage-review-cycle") ? true : false,
                addRepository: (section == "adminPerformance" && subsection == "add-repository") ? true : false,
                reviewCycleLaunch: (section == "adminPerformance" && subsection == "launch-review-cycle") ? true : false,
            };
        };
        this.buildRecruitmentObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "recruitment" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,

                analytics: (section == "recruitment" && subsection == "analytics")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.buildExternalRecruiterObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "externalRecruiter" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.buildTimesheetObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "timesheet" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,

                allocation: (section == "timesheet" && subsection == "allocation")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,

                dashboard: (section == "timesheet" && subsection == "dashboard")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,

                summary: (section == "timesheet" && subsection == "summary")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,

                manager: (section == "timesheet" && subsection == "manager")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,

                allocationManager: (section == "timesheet-manager" && subsection == "allocation")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,

                follower: (section == "timesheet" && subsection == "follower")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            }
        };
        this.builAdminOkrObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "okr" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
            }
        };
        this.builAdminPIPObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "pip" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                follower: (section == "pip" && subsection == "follower")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
                bulk: (section == "pip" && subsection == "bulk")
                    && currentUrl.indexOf('frontend') >= 0 ? true : false,
            };
        };

        this.buildPollsAndSurveys = function (section, subsection, currentUrl) {
            return {
                home: (section == "polls-and-surveys" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            };
        };
        this.builAdminOnGridObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "ongrid" && (subsection == "home" || !subsection || subsection == "/"))
                    && currentUrl.indexOf('frontend') >= 0 ? true : false
            };
        };
        this.buildFrontendObject = function (section, subsection, currentUrl) {
            return {
                home: (section == "frontend" || section == "home") ? true : false,
                adminResource: (section == "resource" && currentUrl.indexOf('frontend') >= 0) ? true : false,
                userManagement: this.buildUsrMgmntObject(section, subsection),
                productivityAdmin: this.buildScreenshotAdminObject(section, subsection),
                exit: this.buildExitObject(section, subsection),
                newHireManagement: this.buildNHMObject(section, subsection, currentUrl),
                adminHelpDesk: this.buildHelpdeskFrontendObject(section, subsection, currentUrl),
                adminAttendance: this.buildTimeAttendanceFrontendObject(section, subsection, currentUrl),
                managerHelpDesk: this.buildManagerHelpdeskObject(section, subsection, currentUrl),
                payroll: this.buildPayrollObject(section, subsection, currentUrl),
                insurance : this.buildInsuranceObject(section, subsection, currentUrl),
                provisionManager : this.buildProvisionManagerObject(section, subsection, currentUrl),
                lndManager:this.buildLndManagerObject(section, subsection, currentUrl),
                provisions : this.buildProvisionsObject(section, subsection, currentUrl),
                provisionAdmin : this.buildProvisionAdminObject(section, subsection, currentUrl),
                leave : this.buildLeaveObject(section, subsection, currentUrl),
                prebuiltReports : this.buildpreBuiltReportObject(section, subsection, currentUrl),
                broadcast: this.builBroadcastObject(section, subsection, currentUrl),
                elcm: this.builElcmObject(section, subsection, currentUrl),
                adminTravelPlanner: this.builTravelPlannerObject(section, subsection, currentUrl),
                adminPerformance: this.builAdminAttendanceObject(section, subsection, currentUrl),
                adminTravelExpense: this.builTravelExpenseObject(section, subsection, currentUrl),
                attendanceShiftPlanner: this.buildAttendanceShiftPlannerObject(section, subsection, currentUrl),
	            recruitment: this.buildRecruitmentObject(section, subsection, currentUrl),
                timesheet: this.buildTimesheetObject(section, subsection, currentUrl),
                //externalRecruiter: this.buildExternalRecruiterObject(section, subsection, currentUrl),
                adminOkr: this.builAdminOkrObject(section, subsection, currentUrl),
                adminPIP: this.builAdminPIPObject(section, subsection, currentUrl),
                adminPollsAndSurveys: this.buildPollsAndSurveys(section, subsection, currentUrl),
                lndAdmin: this.buildLndAdminObject(section, subsection, currentUrl),
                adminOnGrid: this.builAdminOnGridObject(section, subsection, currentUrl),
                clientdashboard: this.buildClientObject(section, subsection, currentUrl)
            }
        };
        
        this.buildUserObject = function () {
            return {
                accessToken: utilityService.getStorageValue('accessToken'),
                loginUserId: utilityService.getStorageValue('loginUserId'),
                loginEmpId: utilityService.getStorageValue('loginEmpId'),
                email: utilityService.getStorageValue('email'),
                fullname: utilityService.getStorageValue('fullname'),
                company: utilityService.getStorageValue('company'),
                displayDetail: utilityService.getStorageValue('displayDetail') ? utilityService.getStorageValue('displayDetail').split(",") : [],
                lastChangePassword: utilityService.getStorageValue('lastChangePassword'),
                profilePic: utilityService.getStorageValue('profilePic'),
                cropType: utilityService.getStorageValue('cropType'),
                companyLogo: utilityService.getStorageValue('companyLogo'),
                empPermissions: utilityService.getStorageValue('empPermissions') ? utilityService.getStorageValue('empPermissions').split(",") : [],
                setupPermissions: utilityService.getStorageValue('setupPermissions') ? utilityService.getStorageValue('setupPermissions').split(",") : [],
                hasPasswordChanged: utilityService.getStorageValue('hasPasswordChanged'),
                isSuperAdmin: utilityService.getStorageValue('isSuperAdmin'),
                isExitInitiated: utilityService.getStorageValue('isExitInitiated'),
                device: utilityService.getStorageValue('device'),
                travelPolicy: utilityService.getStorageValue('travelPolicy'),
                firstname: utilityService.extractFirstName(utilityService.getStorageValue('fullname')),
                mobileHidebar: utilityService.getStorageValue('mobileHidebar'),
                timesheetProjectManager: utilityService.stringToBooleanConversion(utilityService.getStorageValue('timesheetProjectManager')),
                timesheetFollower: utilityService.stringToBooleanConversion(utilityService.getStorageValue('timesheetFollower')),
                timesheetCreator: utilityService.stringToBooleanConversion(utilityService.getStorageValue('timesheetCreator')),
                legalEntityId: utilityService.getStorageValue('legalEntityId'),
                orgChartShowDownlineOnly: utilityService.stringToBooleanConversion(utilityService.getStorageValue('orgChartShowDownlineOnly')),
                employeeCanNotApplyRegularization: utilityService.stringToBooleanConversion(utilityService.getStorageValue('employeeCanNotApplyRegularization')),
                pipFollower: utilityService.stringToBooleanConversion(utilityService.getStorageValue('pipFollower')),
                pipEmployee: utilityService.stringToBooleanConversion(utilityService.getStorageValue('pipEmployee')),
                login_tc_enabled: utilityService.stringToBooleanConversion(utilityService.getStorageValue('login_tc_enabled')),
                login_tc_accepted: utilityService.stringToBooleanConversion(utilityService.getStorageValue('login_tc_accepted')),
                employeeCanNotApplyLeave: utilityService.stringToBooleanConversion(utilityService.getStorageValue('employeeCanNotApplyLeave')),
                show_only_offer: utilityService.stringToBooleanConversion(utilityService.getStorageValue('show_only_offer'))
            }
        };
        this.buildAlertObject = function () {
            return {
                visible: false,
                actionCount: 0,
                notificationCount: 0,
                unReadNotificationCount: 0,
                count: 0,
                disabled: false,
                salaryClaims: null,
                moduleDropdownVisible: true
            }
        };
        this.buildAccordionObject = function () {
            return {
                company: false,
                workflow: false,
                prejoin: false,
                leave: false,
                timeAttendance: false,
                provisions: false,
                lnd:false,
                orgchart: false,
                helpdesk: false,
                payroll: false,
                exitstp: false,
                travelExpense: false,
                roles: false,
                boarding: false,
                attendance: false,
                letter: false,
                social: false,
                recruitment: false,
                externalRecruiter: false,
                timesheet: false,
                thirdParty: false,
            }
        };
        this.isSetupLayout = function (model) {
            return model.layout.setup;
        };
        this.isAdminFrontendLayout = function (model) {
            return model.layout.frontend;
        };
        this.isDashboardLayout = function (model) {
            return model.layout.dashboard;
        };
        this.isCandidatePortalLayout = function (model) {
            return model.layout.candidatePortal;
        };
        this.buildEmployeePermissionObject = function () {
            return {
                sidenav_view_overview: true,
                sidenav_view_myteam: true,
                sidenav_view_calender: false,
                sidenav_view_lms: false,
                sidenav_view_time_attendance: false,                
                sidenav_view_provision: false,
                sidenav_view_lnd: false,                
                sidenav_view_people: false,                              
                sidenav_view_resource: false,                
                sidenav_view_helpdesk: false,
                sidenav_view_compensation: false,
                sidenav_view_social: false,
                sidenav_view_okr: false,
                sidenav_view_performance: false,
                sidenav_view_recruitment: false,
                sidenav_view_exit_management: false,
                sidenav_view_travel_expense: false,
                sidenav_view_ijp: false,
                sidenav_view_recruitment_panel: false,
                sidenav_view_external_recruitment: false,
                sidenav_view_history: false,
                sidenav_view_timesheet: false,
                sidenav_create_job_requisition: false,
                sidenav_edit_job_requisition: false,
                sidenav_view_tasklist: false,
                sidenav_view_productivity:false,
                sidenav_add_client : false
            };
        };
        this.buildAdminPermissionObject = function () {
            return {
                admin_sidenav_view_lms: false,
                admin_sidenav_view_provision_manager: false,
                admin_sidenav_view_training_manager: false,
                admin_sidenav_view_provision_admin: false,
                admin_sidenav_view_provision: false,
                admin_sidenav_view_nhm: false,
                admin_sidenav_view_exit: false,
                admin_sidenav_view_no_dues_manager: false,
                admin_sidenav_view_user_management: false,
                admin_sidenav_view_time_attendance: false,
                admin_sidenav_view_helpdesk_admin: false,
                admin_sidenav_view_helpdesk: false,
                admin_sidenav_view_helpdesk_manager: false,
                admin_sidenav_view_resource: false,
                admin_sidenav_view_reports: false,
                admin_sidenav_view_compensation: false,
                admin_sidenav_view_insurance: false,
                admin_sidenav_view_report: false,
                admin_sidenav_view_broadcast: false,
                admin_sidenav_view_elcm: false,
                admin_sidenav_view_travel_expense: false,
                admin_sidenav_view_shift_planner: false,
                admin_sidenav_view_social: false,
                admin_sidenav_view_performance: false,
                admin_sidenav_view_recruitment: false,
                admin_sidenav_view_timesheet: false,
                admin_sidenav_view_okr: false,
                admin_sidenav_delete_social_post: false,
                admin_sidenav_view_pip: false,
                admin_sidenav_view_polls_and_survey: false,
                admin_sidenav_view_lnd: false,
                admin_sidenav_view_productivity:false,
                admin_sidenav_edit_job_requisition: false,
                admin_sidenav_view_ongrid: false,
                add_recruitment_client:false
            }
        };
        this.buildSetupPermissionObject = function () {
            return {
                setup_view_company_setup: false,
                setup_view_user_management: false,
                setup_view_workflow: false,
                setup_view_nhm: false,
                setup_view_lms: false,
                setup_view_lnd: false,
                setup_view_time_attendance: false,
                setup_view_provision: false,
                setup_view_people: false,
                setup_view_helpdesk: false,
                setup_view_exit: false,
                setup_view_payroll: false,
                setup_view_travel_expense: false,
                setup_view_employee_life_cycle: false,
                setup_view_social: false,
                setup_view_recruitment: false,
                setup_view_timesheet: false,
                setup_view_third_party_integration: false
            }
        };
        this.buildPermissionObject = function () {
            return {
                employee: this.buildEmployeePermissionObject(),
                relationship: {},
                admin: this.buildAdminPermissionObject(),
                setup: this.buildSetupPermissionObject()
            }
        };
        this.syncModulePermission = function (empPermissions, setupPermissions) {
            var modulePermissions = this.buildPermissionObject();
            angular.forEach(modulePermissions, function (value, key) {
                angular.forEach(value, function (v, k) {
                    if (empPermissions.indexOf(k) >= 0 || setupPermissions.indexOf(k) >= 0) {
                        modulePermissions[key][k] = true;
                    }
                });
            });
            return modulePermissions;
        };
        this.buildAccordionSearchObject = function () {
            return {
                company: ["company setup", "organization info", "system info", "user managament", "roles and permissions", "basic configuration"],
                workflow: ["workflow", "approver", "forms", "communication"],
                prejoin: ["prejoin", "system", "prejoining and onboarding", "associate profile fields", "new hire plan", "letters", "candidate portal", "communication", "nhm", "On-boarding", "on-boarding", "boarding", "on boarding"],
                leave: ["leave type", "holiday", "communication", "leave management system"],
                timeAttendance: ["time and attendance", "time plans", "shift repository", "reporting method", "regularization", "policies", "communication"],
                provisions: ["provisions", "provision management", "communication", "asset", "assets"],
                orgchart : ["organization chart and directory", "org chart", "org directory"],
                lnd:["learning and development","lnd","learning","development"],
                helpdesk: ["helpdesk", "global settings", "ticket settings", "communication"],
                payroll: ["payroll", "setup"],
                exitstp: ["exit setup", "exit option", "clearances", "e seperation", "exit feedback", "settlement", "communication"],
                boarding: ["boarding"],
                attendance: ["attendance"],
                travelExpense: ["travel", "expense", "travel & expense", "vendor", "travel and expense"],
                letter: ["letter", "employee", "life cycle", "employee life cycle"],
                social: ["social", "engagement", "post", "community", "comment", "crowd", "crowd solve", "like", "wall", "communities"],
                recruitment: ["recruitment", "recruitments", "recruit", "recuitment", "recuit"],
                timesheet: ["timesheet"],
                ongrid: ["ongrid", "on grid"]
            }
        };
        this.bulidSolarVariables = function () {
            return [
                {
                    name: 'people',
                    type: 1,
                    isChecked: true
                },
                {
                    name: 'location',
                    type: 38,
                    isChecked: true
                },
                {
                    name: 'department',
                    type: 41,
                    isChecked: true
                },
                {
                    name: 'designation',
                    type: 63,
                    isChecked: true
                }
            ]
        };
        this.solarVarrObj = {
            1: 'people',
            38: 'location',
            41: 'department',
            63: 'designation'
        };
        this.resetAllFlag = function (list) {
            angular.forEach(list, function (value, key) {
                if (angular.isObject(value)) {
                    angular.forEach(value, function (val, k) {
                        list[key][k] = false;
                    });
                } else {
                    list[key] = false;
                }
            });
        };
        this.getCurrentSection = function (object) {
            var currentSection = null;
            angular.forEach(object, function (value, key) {
                if (angular.isObject(value)) {
                    angular.forEach(value, function (v, k) {
                        if (angular.isObject(v)) {
                            angular.forEach(v, function (v1, k1) {
                                if (v1) {
                                    currentSection = key;
                                }
                            });
                        } else if (v) {
                            currentSection = key;
                        }
                    });
                } else if (value) {
                    currentSection = key;
                }
            });
            return currentSection;
        };
        this.buildFavouritesObject = function () {
            return {
                visible: false
            }
        };
        this.range = function (min, max) {
            var input = [],
                min = parseInt(min), //Make string input int
                max = parseInt(max);
            for (var i = min; i <= max; i++)
                input.push(i);
            return input;
        };
        this.buildPaginationObjectPerSection = function () {
            var obj = {
                pageNo: 1,
                numPerPage: 10
            }
            return JSON.stringify(obj)
        };
        this.buildSectionObject = function (section, subsection, currentUrl) {
            return {
                layout: this.buildLayoutObject(section, currentUrl),
                dashboard: this.buildDashboardObject(section, subsection, currentUrl),
                frontend: this.buildFrontendObject(section, subsection, currentUrl),
                candidatePortal: section == "candidatePortal" ? true : false,
                register: section == "register" ? true : false,
                thanks: section == "thanks" ? true : false,
                verify: section == "verify" ? true : false,
                login: section == "login" ? true : false,
                backend: section == "admin" ? true : false,
                wizard: section == "wizard" ? true : false,
                summary: section == "summary" ? true : false,
                demo: section == "demo" ? true : false,
                setting: section == "setting" ? true : false,
                changePassword: section == "change-password" ? true : false,
                settingPreJoin: section == "setting-prejoin" ? true : false,
                requestflow: section == "request-flows" ? true : false,
                requestForm: section == "request-form" ? true : false,
                changeForm: section == "change-form" ? true : false,
                shift: section == "shift" ? true : false,
                addReportingMethod: section == "addReportingMethod" ? true : false,
                taPlanSetting: section == "taPlanSetting" ? true : false,
                relevance: section == "relevance" ? true : false,
                wfh: section == "wfh" ? true : false,
                earlyGo: section == "earlyGo" ? true : false,
                minWork: section == "minWork" ? true : false,
                absent: section == "absent" ? true : false,
                compOff: section == "compOff" ? true : false,
                overTime: section == "overTime" ? true : false,
                lateAttendance: section == "lateAttendance" ? true : false,
                regularizationSetting: section == "regularizationSetting" ? true : false,
                missed: section == "missed" ? true : false,
                forgot: section == "forgot" ? true : false,
                provisionSetting: section == "provisionSetting" ? true : false,
                lndSetting:section=='lndSetting'?true:false, 
                lndDetails:'lndDetails'?true:false,  
                permissions: section == "permissions" ? true : false,
                workflow: section == "work-flows" ? true : false,
                prejoinSetting: section == "prejoinSetting" ? true : false,
                onboardingPlans: section == "onboardingPlans" ? true : false,
                formBuilder: section == "form-builder" ? true : false,
                templateBuilder: section == "template-builder" ? true : false,
                templateConsumer: section == "template-consumer" ? true : false,
                notification: section == "notification" ? true : false,
                segmentField: section == "segment-field" ? true : false,
                groupElement: section == "group-element" ? true : false,
                communication: section == "communication" ? true : false,
                userRelevance: section == "userRelevance" ? true : false,
                clearanceRelevance: section == "clearanceRelevance" ? true : false,
                ticketSettings: section == "ticketSettings" ? true : false,
                planSetting: section == "planSetting" ? true : false,
                registersReport: section == "registersReport" ? true : false,
                pfChallan: section == "pfChallan" ? true : false,
                holidayRelevance: section == "holidayRelevance" ? true : false,
                ticketRating: section == "ticket-rating" ? true : false,
                archiveProfile: section == "archive-profile" ? true : false,
                travelPolicySetting: section == "travelPolicySetting" ? true : false,
                loanDetails: section == "loan-details" ? true : false,
                loanAdvanceDetails: section == "loan-request" ? true : false,
                viewLoanDetails: section == "view-loan-details" ? true : false,
                resetPassword: section == "reset-password" ? true : false,
                expensePolicySetting: section == "expense-policy-setting" ? true : false,
                exportChart: section == "exportChart" ? true : false,
                createObjective: section == "create-objective" ? true : false,
                recruitmentDetails: section == "job-details" ? true : false,
                adminJobDetails: section == "admin-job-details" ? true : false,
                candidateScorecard: section == "candidate-scorecard" ? true : false,
                newTravel: section == "new-travel" ? true : false,
                travelDetail: section == "travel-detail" ? true : false,
                templateSign: section == "template-sign" ? true : false,
                newJob: section == "new-job" ? true : false,
                jobDetail: section == "job-detail" ? true : false,
                jobPublish: section == "job-publish" ? true : false,
                recruitmentCandidateDetails: section == "candidate-details" ? true : false,
                newExpense: section == "new-expense" ? true : false,
                viewExpense: section == "view-expense" ? true : false,
                travelRequest: section == "travel-request" ? true : false,
                travelRequestDetails: section == "travel-request-details" ? true : false,
                bankReport: section == "bank-report" ? true : false,
                mandatoryFields: section == "user-mandatory-fileds" ? true : false,
                createShiftPattern: section == "create-shift-pattern" ? true : false,
                jobs: section == "jobs" ? true : false,
                recruiterDetail: section == "recruiterDetail" ? true : false,
                history: section == "employee-history" ? true : false,
                acceptLetter: section == "acknowledge-letter" ? true : false,
                recruitmentOfferWorkflow: section == "recruitmentOfferWorkflow" ? true : false,
                recruitmentJobs: section == "recruitment-jobs" ? true : false,
                salaryBreakup: section == "salary-breakup" ? true : false,
                fnfLetters: section == "fnf-letters" ? true : false,
                demoAnytime: section == "demo-anytime" ? true : false,
                pollsNdSurveys: section == "polls-nd-surveys" ? true : false,
                screenshotIndividualView: section == "screenshot-individual-view" ? true : false,
                screenshotComparisonView: section == "screenshot-comparison-view" ? true : false,
                screenshotLink: section == "screenshot-link" ? true : false,
                newAdvanceRequest: section == "new-advance-request" ? true : false,
                viewAdvanceRequest: section == "view-advance-request" ? true : false,
                demoAnytime: section == "demo-anytime" ? true : false,
		        actionViaEmail: section == 'action-via-email' ? true : false,
                assessment: section == "assessment" ? true : false,
                onGridPlanSetting: section == "ongrid-plan" ? true : false,
                hrCompany: section == "hrcompany" ? true : false,
                commonRelevance: section == "common-relevance" ? true : false,
                okrAdminSetting: section == "okr-admin-setting" ? true : false,
                firstattendance: section == "firstattendance" ? true : false,
                recruitmentClients: section == "recruitment-clients" ? true : false,
            };
        };

        this.buildLoginFrgtPwdSectionObject = function () {
            return {
                login: true,
                frgtPwd: false,
                otp: true
            };
        };
        this.buildLoginClickObject = function () {
            return {
                triggered: false
            };
        }
        this.buildLoginViaObject = function () {
            return {
                selected: utilityService.isLoginViaEmployeeCode.enabled ? 2 : 1,
                options: [
                    {
                        id: 1,
                        title: 'Work Email'
                    },
                    {
                        id: 2,
                        title: 'Employee Code'
                    }
                ],
            };
        };
        this.isPayrollAdminSection = function (object) {
            var isPayrollAdmin = false;

            angular.forEach(object, function (value, key) {
                isPayrollAdmin = isPayrollAdmin || value;
            });

            return isPayrollAdmin;
        };
        this.buildOTPPayload = function (model) {
            return {
                otp_token: utilityService.getValue(model, 'otp_token'),
                otp: parseInt(utilityService.getValue(model, 'otp'), 10)
            };
        };

        return this;
    }
]);
