app.controller('BaseController', [
    '$scope', '$rootScope', '$sce', '$window', '$routeParams', '$location', '$timeout', '$cookies', 'userService', 'utilityService', 'ServerUtilityService', 'VALIDATION_ERROR', 'Idle', 'Keepalive', '$uibModal', '$mdSidenav', 'Upload', '$route','$mdDialog', '$modal', 'ActionService', 'PayrollLegalEntityService', 'FREQUENCY_COUNTER','$mdMenu',
    function ($scope, $rootScope, $sce, $window, $routeParams, $location, $timeout, $cookies, userService, utilityService, serverUtilityService, VALIDATION_ERROR, Idle, Keepalive, $uibModal, $mdSidenav, Upload, $route, $mdDialog, $modal, actionService, payrollLegalEntityService, FREQUENCY_COUNTER, $mdMenu) {
        var section = utilityService.getValue($routeParams, 'section', 'dashboard'),
            subsection = utilityService.getValue($routeParams, 'subsection', 'home'),
            currentUrl = $location.url(),
            cropTypeHashmap = {
                circle: 1,
                square: 2,
                rectangle: 3
            };

        utilityService.setReloadOnSearch();
        $scope.currentUrl = $location.url();
        $scope.envMnt = envMnt;
        $scope.forceHideDisable = false;

        var trackingId = getTrackingId();
        $scope.titleOfpage = 'prod 4';
        $scope.checkName = {name:null};
        $scope.joiningDate = 1491004800000;

        /********** START: Common Global Declaration  **********/
        $scope.validationError = VALIDATION_ERROR[countryCode];
        $scope.apiError = utilityService.buildAPIErrorObject();
        $scope.errorMessages = [];
        $scope.frontEndHlpDskFlag = false;
        $scope.showAttendance = true;
        $scope.isCandidateLogin = utilityService.getStorageValue('isCandidateLogin') == 'true' ? true : false;
        $scope.mandatorySearchObject = ['people'];
        $scope.groupMandatoryList = [];
        $scope.allowedFileSizeGlobal = utilityService.buildFileSizeObject($scope.envMnt);
        /********** END: Common Global Declaration **********/

        /** This will help in displayng the pending alert counts **/
        $scope.alert = userService.buildAlertObject();
        $scope.alert.disabled = $location.path() == '/dashboard/alert';
        $scope.favourites = userService.buildFavouritesObject();

        /** Used for identification of candidate/employee **/
        $scope.callback = utilityService.getValue($routeParams, 'callback');

        /** This is used to display profile values related to user **/
        $scope.user = userService.buildUserObject();
        
        $scope.modulePermissions = userService.syncModulePermission($scope.user.empPermissions, $scope.user.setupPermissions);
        $scope.section = userService.buildSectionObject(section,subsection, currentUrl);
        $scope.employeeId = $scope.section.dashboard.profile && subsection !== 'home' ? subsection : null;
        if(utilityService.getValue($routeParams,'error')) {
            utilityService.resetAPIError(true, utilityService.getValue($routeParams, 'error'));
            $timeout(function err (){
                $location.search('error',null);
            },1000);

        }
        $scope.validateResetToken = utilityService.buildValidateResetTokenObject();
        $scope.isLoginCustomized = utilityService.buildLoginCustomizedObject();
        $scope.isDashboardCustomized = utilityService.buildDashboardCustomizedObject();
        $scope.modalInstance = utilityService.buildModalInstanceObject();        
        $scope.isFormSubmitted = utilityService.buildFormSubmittedObject();
        $scope.isLoginViaEmployeeCode = utilityService.buildLoginViaEmployeeCode();
        utilityService.isLoginViaEmployeeCode = $scope.isLoginViaEmployeeCode;
        utilityService.loggedEmployee.id = $scope.user.loginEmpId;
        $scope.helpVideo = utilityService.buildHelpVideoObject();
        $scope.startForm12BBYear = utilityService.startForm12BBYear;
        $scope.isReconciliationMsgVisible = utilityService.getInnerValue(config, $scope.envMnt, 'isReconciliationMsgVisible', false);
        $scope.employeeCompensationTemplates = {
            allowedDomains: ['local', 'q', 'myhr', 'prod3', 'ess', 'esshr', 'hronline', 'shriramggn', 'mempl', 'mis', 'edusch']
        };
        $scope.investmentProof = {
            isHidden: utilityService.getInnerValue(config[envMnt], 'investmentProof', 'isHidden', false)
        };
        $scope.alwayShowInvestmentProofUpload = {
            enabled: utilityService.getInnerValue(config[envMnt], 'alwayShowInvestmentProofUpload', 'enabled', false)
        };
        $scope.multipleInvestmentHeads = {
            enabled: utilityService.getInnerValue(config[envMnt], 'multipleInvestmentHeads', 'enabled', true)
        };
        $scope.syncGoogleCalendar = {
            enabled: utilityService.getInnerValue(config[envMnt], 'syncGoogleCalendar', 'enabled', false)
        };
        $scope.chapterVIA = {
            "80G": {
                isHidden: utilityService.getInnerValue(config[envMnt].chapterVIA, '80G', 'isHidden', false)
            }
        };
        $scope.attendenceShiftDeatilTab = {
            disabled: utilityService.getValue(config[envMnt].attendenceShiftDeatilTab, 'disabled', false)
        };
        $scope.socialLinks = {
            linkedin : utilityService.getInnerValue(config[envMnt], 'socialLinks', 'linkedin'),
            facebook: utilityService.getInnerValue(config[envMnt], 'socialLinks', 'facebook'),
            twitter: utilityService.getInnerValue(config[envMnt], 'socialLinks', 'twitter'),
            instagram: utilityService.getInnerValue(config[envMnt], 'socialLinks', 'instagram')
        };

        $scope.runPayrollConfig = {
            enabled: utilityService.getValue(config[envMnt].runPayrollConfig, 'enabled', false),
            planIds: utilityService.getValue(config[envMnt].runPayrollConfig, 'plan_ids', [])
        }

        $scope.yearExtendedConfig = {
            enabled: utilityService.getValue(config[envMnt].yearExtendedConfig, 'enabled', false),
            upto: utilityService.getValue(config[envMnt].yearExtendedConfig, 'upto', []),
        }
        $scope.runPayrollAutomate = {
            enabled: false
        };
        $scope.taxProjectionEmp = {
            enabled: utilityService.getValue(config[envMnt].taxProjectionEmployee, 'enabled', true),
        }
        $scope.employeePtComponent = {
            disable: utilityService.getValue(config[envMnt].employeePtComponent, 'disable', false),
        }
        $scope.employeeLwfComponent = {
            disable: utilityService.getValue(config[envMnt].employeeLwfComponent, 'disable', false),
        }
        $scope.runFnfAutomate = {
            enabled: false
        };

        $scope.productMap = {
            enabled: utilityService.getValue(config[envMnt].productMap, 'enabled', false),
            url : utilityService.getValue(config[envMnt].productMap, 'url'),
			headerName: utilityService.getValue(config[envMnt].productMap, 'headerName', '')
        }

        $scope.performanceFee = {
            enabled: utilityService.getValue(config[envMnt].performanceFee, 'enabled', false),
        }

        $rootScope.isSolarSystem = {
            enabled: utilityService.getValue(config[envMnt].isSolarSystem, 'enabled', false),
            isAttendance : utilityService.getValue(config[envMnt].isSolarSystem, 'isAttendance', false)
        }

        $scope.googleLogin = {
            enabled: utilityService.getInnerValue(config[envMnt], 'googleLogin', 'enabled', false)
        };
        $scope.employeeCompensationForm = {
            form_16: {
                isHidden: utilityService.getInnerValue(config[envMnt].employeeCompensationForm, 'form_16', 'isHidden', false)
            },
            form_16a: {
                isHidden: utilityService.getInnerValue(config[envMnt].employeeCompensationForm, 'form_16a', 'isHidden', false)
            },
            form_16b: {
                isHidden: utilityService.getInnerValue(config[envMnt].employeeCompensationForm, 'form_16b', 'isHidden', false)
            },
            form_12bb: {
                isHidden: utilityService.getInnerValue(config[envMnt].employeeCompensationForm, 'form_12bb', 'isHidden', false)
            },
            form_16a_q1: {
                isHidden: utilityService.getInnerValue(config[envMnt].employeeCompensationForm, 'form_16a_q', 'isHidden', false)
            },
            form_16a_q2: {
                isHidden: utilityService.getInnerValue(config[envMnt].employeeCompensationForm, 'form_16a_q', 'isHidden', false)
            },
            form_16a_q3: {
                isHidden: utilityService.getInnerValue(config[envMnt].employeeCompensationForm, 'form_16a_q', 'isHidden', false)
            },
            form_16a_q4: {
                isHidden: utilityService.getInnerValue(config[envMnt].employeeCompensationForm, 'form_16a_q', 'isHidden', false)
            },
        };

        $scope.adminCompensationForm = {
            form_16a: {
                isHidden: utilityService.getInnerValue(config[envMnt].adminCompensationForm, 'form_16a', 'isHidden', false)
            },
            form_16b: {
                isHidden: utilityService.getInnerValue(config[envMnt].adminCompensationForm, 'form_16b', 'isHidden', false)
            },
            form_16a_q: {
                isHidden: utilityService.getInnerValue(config[envMnt].adminCompensationForm, 'form_16a_q', 'isHidden', false)
            },
        }
        $scope.googleLogin = {
            enabled: utilityService.getInnerValue(config[envMnt], 'googleLogin', 'enabled', false)
        };
        $scope.dropDownWithSearch = {
            enabled: utilityService.getInnerValue(config[envMnt], 'dropDownWithSearch', 'enabled', false)
        };
        /***** Start Payroll Legal Entity Section *****/
        var legalEntityElements = utilityService.getStorageValue("legalEntityElements") || null;
        $scope.wrapperObject = {
            isPayrollAdminSection: userService.isPayrollAdminSection($scope.section.frontend.payroll),
            legalEntity: {
                enabled: false,
                id: utilityService.getValue($scope.user, 'legalEntityId'),
                list: [],
                selected: null,
                visible: false,
                name: null,
                elements: legalEntityElements ? JSON.parse(legalEntityElements) : []
            },
            allEntityReport: {
                enabled: utilityService.getInnerValue(config[envMnt], 'allEntityReport', 'enabled', false),
                hasPermission: false,
                permissionSlug: 'can_view_payroll',
                selectedOption: '',
                text: 'All Legal Entities'
            }
        };

        $rootScope.thirdPartyList = [];
        var getThirdPartyIntegration = function () {
            var url = userService.getUrl('integrationsThirdParty');
            serverUtilityService.getWebService(url).then(function (data) {
                if(data.status == "success") {
                    $rootScope.thirdPartyList = data.data;
                } else {
                    console.log("Need to handle error");
                }
            });
        };
        if(utilityService.getStorageValue('employeeCurrency')){
            var styleElem = document.head.appendChild(document.createElement("style"));
			styleElem.innerHTML = ".fa-inr:before {content: '" + utilityService.getStorageValue('employeeCurrency') + "' !important;}";
        }

        
        var legalEntityCallback = function (data) {
            $scope.wrapperObject.legalEntity.list = utilityService.getValue(data, 'data', []);
            $scope.wrapperObject.legalEntity.enabled = $scope.wrapperObject.legalEntity.list.length > 0
                || $scope.wrapperObject.legalEntity.elements.length > 0;
            
            if ($scope.wrapperObject.legalEntity.enabled && $scope.wrapperObject.legalEntity.list.length == 1) {
                $scope.wrapperObject.legalEntity.selected = utilityService.getInnerValue($scope.wrapperObject.legalEntity.list, 0, '_id');
            }

            $scope.wrapperObject.legalEntity.visible = true;            
        };
        var getLegalEntityList = function () {
            serverUtilityService.getWebService(payrollLegalEntityService.getUrl('legalEntities'))
                .then(function(data) {
                    legalEntityCallback(data);
                });
        };
        if (utilityService.getValue($scope.user, 'accessToken')) {
            getLegalEntityList();
            getThirdPartyIntegration();
        }        
        /***** End Payroll Legal Entity Section *****/
        $scope.loginTermCondition = {
            accepted: false
        };
        $scope.isEligibleForClaim = function() {
            // return typeof config[envMnt].isEligibility != "undefined"
            //     && config[envMnt].isEligibility.claim;
            return  true;
        };
        var isPayrollEmployeeTemplatesVisible = function() {
            var loginEmpIds = ['60f313b3f0f90bdd0832d2e5','5d38a39339473e740b53a1ff','5adda60f39473e770652ff14','5822cd89ec95754c1c00002c','59b15bfc39473ed617bdaebd','5911ce4639473e0769851432', '5a0c51a139473e58782e5f97', '583d21db7d13415c1400002a', '5996715edabd11ac0b00002b', '58e497d239473e7028937b08', '5cd3f03a4e7e6ea611d63e43'];
            return $scope.user.accessToken && loginEmpIds.indexOf($scope.user.loginEmpId) >= 0;
        };
        $scope.isEmpTmplVisible = isPayrollEmployeeTemplatesVisible();
        $scope.isDeviceMobile = function() {
            return $scope.user.device === 'mobile';
        };
        $scope.dashboardBanner = {
            visible: typeof config[envMnt].dashboardBanner != "undefined" && config[envMnt].dashboardBanner.visible,
            src: typeof config[envMnt].dashboardBanner != "undefined" && config[envMnt].dashboardBanner.src,
            href: typeof config[envMnt].dashboardBanner != "undefined" && config[envMnt].dashboardBanner.href
        };
        $scope.viewDownload = {
            title: typeof config[envMnt].viewDownload != "undefined" && config[envMnt].viewDownload.title 
                ? config[envMnt].viewDownload.title : 'View/Download',
        };

        $rootScope.thirdPartyList = [];
        var getThirdPartyIntegration = function () {
            var url = userService.getUrl('integrationsThirdParty');
            serverUtilityService.getWebService(url).then(function (data) {
                if(data.status == "success") {
                    $rootScope.thirdPartyList = data.data;
                    console.log($scope.thirdPartyList);
                    console.log($scope.user.accessToken);
                } else {
                    console.log("Need to handle error");
                }
            });
        };
        // getThirdPartyIntegration();

        /********* Start Permission Related Section *********/
        $scope.isEmpSideNavVisible = function(permission) {
            return $scope.modulePermissions.employee[permission];
        };
        $scope.empViewOverview = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_overview');
        };
        $scope.empViewCalendar = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_calender');
        };
        $scope.empViewTimeoff = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_lms');
        };
        $scope.empViewAttendance = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_time_attendance');
        };
        $scope.empViewProvision = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_provision');
        };
        $scope.empViewLnd = function(){
            return $scope.isEmpSideNavVisible('sidenav_view_lnd');   // lnd
        }
        $scope.empViewPeople = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_people');
        };
        $scope.empViewResource = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_resource');
        };
        $scope.empViewHelpdesk = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_helpdesk');
        };
        $scope.empViewCompensation = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_compensation');
        };
        $scope.empViewMyTeam = function() {
            return utilityService.getStorageValue('profileField')
                && utilityService.getStorageValue('profileField').length ? true : false;
        };
        $scope.empViewSocial = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_social');
        };
        $scope.empViewOKR = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_okr');
        };
        $scope.empViewPerformance = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_performance');
        };
        $scope.empViewExitManagement = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_exit_management');
        };
        $scope.empViewTravelExpense = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_travel_expense');
        };
        $scope.empViewMarkAttendance = function() {
            return $scope.empViewAttendance() && $scope.isDeviceMobile();
        };
        $scope.empViewRecruitment = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_recruitment_panel');
        };
        $scope.empCreateJobRequisition = function() {
            return $scope.isEmpSideNavVisible('sidenav_create_job_requisition');
        };
        $scope.empViewExternalRecruiter = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_external_recruitment');
        };
        $scope.empViewTimesheet = function() {
            return $scope.isEmpSideNavVisible('sidenav_view_timesheet');
        };
        $scope.empCreateJobRequisition = function() {
            return $scope.isEmpSideNavVisible('sidenav_create_job_requisition');
        };
        $scope.empEditJobRequisition = function() {
            return $scope.isEmpSideNavVisible('sidenav_edit_job_requisition');
        };

        $scope.empCanNotApplyRegularization = function () {
            return utilityService.getValue($scope.user, 'employeeCanNotApplyRegularization', false) === true;
        };
        $scope.empViewPIP = function () {
            return $scope.user.pipEmployee;
        };
        $scope.empCanNotApplyLeave = function () {
            return utilityService.getValue($scope.user, 'employeeCanNotApplyLeave', false) === true;
        };
        $scope.empViewTask = function () {
            return $scope.isEmpSideNavVisible('sidenav_view_tasklist');
        };

        $scope.thirdParty = function (val) {
            var findthirdparty = _.findWhere($rootScope.thirdPartyList, { _id : val + ""});
            if(findthirdparty != undefined) {
                if(findthirdparty.status) { return true; } else { return false; }
            } else {
                return false;
            }
        };

        $scope.empViewScreenshot=function () {
            return $scope.isEmpSideNavVisible('sidenav_view_productivity')
        }

        $scope.adminViewLeave = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_lms && !$scope.isDeviceMobile();
        };
        $scope.adminViewProvisionManager = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_provision_manager && !$scope.isDeviceMobile();
        };

        $scope.adminViewLndManager = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_training_manager && !$scope.isDeviceMobile();
        };
        $scope.adminViewProvisionAdmin = function() {
            return ($scope.modulePermissions.admin.admin_sidenav_view_provision
                || $scope.modulePermissions.admin.admin_sidenav_view_provision_admin)
                && !$scope.isDeviceMobile();
        };
        $scope.adminViewLndAdmin = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_lnd && !$scope.isDeviceMobile();
        };
        $scope.adminViewNHM = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_nhm && !$scope.isDeviceMobile();
        };
        $scope.adminViewExit = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_exit && !$scope.isDeviceMobile();
        };
        $scope.adminViewNoDuesManager = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_no_dues_manager && !$scope.isDeviceMobile();
        };
        $scope.adminViewUserManagement = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_user_management && !$scope.isDeviceMobile();
        };
        $scope.adminViewTimeAttendance = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_time_attendance && !$scope.isDeviceMobile();
        };
        $scope.adminViewHelpdeskAdmin = function() {
            return ($scope.modulePermissions.admin.admin_sidenav_view_helpdesk
                || $scope.modulePermissions.admin.admin_sidenav_view_helpdesk_admin)
                && !$scope.isDeviceMobile();
        };
        $scope.adminViewHelpdeskManager = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_helpdesk_manager && !$scope.isDeviceMobile();
        };
        $scope.adminViewResource = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_resource && !$scope.isDeviceMobile();
        };
        $scope.adminViewReport = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_report && !$scope.isDeviceMobile();
        };
        $scope.adminViewPayroll = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_compensation && !$scope.isDeviceMobile();
        };
        $scope.adminViewInsurance = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_insurance && !$scope.isDeviceMobile();
        };
        $scope.adminViewBroadcast = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_broadcast && !$scope.isDeviceMobile();
        };
        $scope.adminViewElcm = function () {
            return $scope.modulePermissions.admin.admin_sidenav_view_elcm && !$scope.isDeviceMobile();
        }
        $scope.adminViewSocial = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_social && !$scope.isDeviceMobile();
        };
        $scope.adminViewPerformance = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_performance && !$scope.isDeviceMobile();
        };
        $scope.adminViewRecruitment = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_recruitment && !$scope.isDeviceMobile();
        };
        $scope.adminViewTravelExpense = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_travel_expense && !$scope.isDeviceMobile();
        };
        $scope.adminViewShiftPlanner = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_shift_planner && !$scope.isDeviceMobile();
        };
        $scope.adminViewTimesheet = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_timesheet && !$scope.isDeviceMobile();
        };
        $scope.managerViewTimesheet = function () {
            return $scope.user.timesheetProjectManager && !$scope.isDeviceMobile();
        };
        $scope.followerViewTimesheet = function () {
            return $scope.user.timesheetFollower && !$scope.isDeviceMobile();
        };
        $scope.isUserTimesheetCreator = function () {
            return $scope.user.timesheetCreator && !$scope.isDeviceMobile();
        };
        $scope.adminViewOkr = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_okr && !$scope.isDeviceMobile();
        };

        $scope.adminViewProductivityAdmin =function () {
            return $scope.modulePermissions.admin.admin_sidenav_view_productivity && !$scope.isDeviceMobile();
        }

        $scope.adminViewPIP = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_pip && !$scope.isDeviceMobile();
        };

        $scope.adminPollSurvey = function() {
            return $scope.modulePermissions.admin.admin_sidenav_view_polls_and_survey && !$scope.isDeviceMobile();;
        };

        $scope.followerViewPIP = function () {
            return $scope.user.pipFollower && !$scope.isDeviceMobile();
        };
        $scope.adminViewOnGrid = function () {
            return $scope.modulePermissions.admin.admin_sidenav_view_ongrid && !$scope.isDeviceMobile();
        };
       

        $scope.setupViewCompanySetup = function() {
            return $scope.modulePermissions.setup.setup_view_company_setup;
        };
        $scope.setupViewUserManagement = function() {
            return $scope.modulePermissions.setup.setup_view_user_management;
        };
        $scope.setupViewWorkflow = function() {
            return $scope.modulePermissions.setup.setup_view_workflow;
        };
        $scope.setupViewNHM = function() {
            return $scope.modulePermissions.setup.setup_view_nhm;
        };
        $scope.setupViewLeave = function() {
            return $scope.modulePermissions.setup.setup_view_lms;
        };
        $scope.setupViewTimeAttendance = function() {
            return $scope.modulePermissions.setup.setup_view_time_attendance;
        };
        $scope.setupViewProvision = function() {
            return $scope.modulePermissions.setup.setup_view_provision;
        };
        $scope.setupViewLnd = function() {
            return $scope.modulePermissions.setup.setup_view_lnd;
        };
        $scope.setupViewPeople = function() {
            return $scope.modulePermissions.setup.setup_view_people;
        };
        $scope.setupViewHelpdesk = function() {
            return $scope.modulePermissions.setup.setup_view_helpdesk;
        };
        $scope.setupViewExit = function() {
            return $scope.modulePermissions.setup.setup_view_exit;
        };
        $scope.setupViewPayroll = function() {
            return $scope.modulePermissions.setup.setup_view_payroll;
        };
        $scope.setupViewTravelExpense = function() {
            return $scope.modulePermissions.setup.setup_view_travel_expense;
        };
        $scope.setupViewEmployeeLifeCycle = function() {
            return $scope.setupViewNHM();
            //return $scope.modulePermissions.setup.setup_view_employee_life_cycle;
        };
        $scope.setupViewSocial = function() {
            return $scope.modulePermissions.setup.setup_view_social;
        };
        $scope.setupViewRecruitment = function() {
            return $scope.modulePermissions.setup.setup_view_recruitment;
        };
        $scope.setupViewTimesheet = function() {
            return $scope.modulePermissions.setup.setup_view_timesheet;
        };

        $scope.adminEditJobRequisition = function () {
            return $scope.modulePermissions.admin.admin_sidenav_edit_job_requisition;
        }

        $scope.setupViewOnGrid = function() {
            return $scope.modulePermissions.setup.setup_view_third_party_integration;
        };

        $scope.recruiterClientEY = function() {
            return $scope.modulePermissions.admin.add_recruitment_client && !$scope.isDeviceMobile();
        };

        $scope.recruiterClientEmployee = function() {
            return $scope.modulePermissions.employee.sidenav_add_client && !$scope.isDeviceMobile();
        };
        

        $scope.setuphrPayCompany = function() {
            return true;
        };


        $scope.hasPermission = {
            home: true,
            team: $scope.empViewMyTeam(),
            calendar: $scope.empViewCalendar(),
            attendance: $scope.empViewAttendance(),
            timeoff: $scope.empViewTimeoff(),
            compensation:$scope.empViewCompensation(),
            provisions: $scope.empViewProvision(),
            lnd: $scope.empViewLnd(),
            compensation:$scope.empViewCompensation(),
            social: $scope.empViewSocial(),
            okr: $scope.empViewOKR(),   // not in use
            performance: $scope.empViewOKR(),   // ref is used for okr
            feedback: $scope.empViewPerformance(),  // ref is used for performance
            recruitment: $scope.empViewRecruitment(),
            exitManagement: $scope.empViewExitManagement(),
            travelExpense: $scope.empViewTravelExpense(),
           // ijp: $scope.empViewIJP(),
            pip: $scope.empViewPIP(),
            productivity:$scope.empViewScreenshot(), //productivity
            task: $scope.empViewTask(),
            thirdparty: true,
            productmap: true,
            alert: true,
            people: $scope.empViewPeople(),
            resource: $scope.empViewResource(),
            helpdesk: $scope.empViewHelpdesk(),

            leave: $scope.adminViewLeave(),
            provisionManager: $scope.adminViewProvisionManager(),
            lndManager: $scope.adminViewLndManager(),
            provisionAdmin: $scope.adminViewProvisionAdmin(),
            lndAdmin: $scope.adminViewLndAdmin(),
            newHireManagement: $scope.adminViewNHM(),
            exit: $scope.adminViewExit() || $scope.adminViewNoDuesManager(),
            adminAttendance: $scope.adminViewTimeAttendance(),
            adminHelpDesk: $scope.adminViewHelpdeskAdmin(),
            managerHelpDesk: $scope.adminViewHelpdeskManager(),
            userManagement: $scope.adminViewUserManagement(),
            productivityAdmin:$scope.adminViewProductivityAdmin(),
            payroll: $scope.adminViewPayroll(),
            adminResource: $scope.adminViewResource(),
            signature: true,
            accountSettings: true,
            profile: true,
            prebuiltReports: true,
            adminPerformance: $scope.adminViewPerformance(),
            page: {
                faq: true ,
                learningCenter: true
            },
            insurance: $scope.adminViewInsurance(),
            broadcast: $scope.adminViewBroadcast(),
            elcm: $scope.adminViewElcm(),
            travel: true,
            adminTravelPlanner: $scope.adminViewTravelExpense(),
            adminTravelExpense: $scope.adminViewTravelExpense(),
            attendanceShiftPlanner: $scope.adminViewShiftPlanner(),
            externalRecruiter:$scope.empViewExternalRecruiter(),
            //externalRecruiterBirthDay:$scope.empViewBirthDayExternalRecruiter(),
            timesheet: $scope.empViewTimesheet(),
            adminTimesheet: $scope.adminViewTimesheet(),
            adminOkr: $scope.adminViewOkr(),
            adminPIP: $scope.adminViewPIP(),
            adminPollsAndSurveys: $scope.adminPollSurvey(),
            adminOnGrid: $scope.adminViewOnGrid()
        };
        var checkTimesheetModulePermission = function (frontendSection) {
            var permission = true;

            if ($scope.section.frontend.timesheet.home) {
                permission = $scope.adminViewTimesheet();
            } else if ($scope.section.frontend.timesheet.manager) {
                permission = $scope.managerViewTimesheet() || $scope.isUserTimesheetCreator();
            } else if ($scope.section.frontend.timesheet.follower) {
                permission = $scope.followerViewTimesheet();
            } else {
                permission = $scope.hasPermission[frontendSection];
            }

            return permission;
        };
        var checkPIPModulePermission = function (frontendSection) {
            var permission = true;

            if ($scope.section.frontend.adminPIP.home) {
                permission = $scope.adminViewPIP();
            } else if ($scope.section.frontend.adminPIP.follower) {
                permission = $scope.followerViewPIP();
            } else {
                permission = $scope.hasPermission[frontendSection];
            }

            return permission;
        };
        var hasPermission = function() {
            var permission = true,
                dashboardSection = userService.getCurrentSection($scope.section.dashboard),
                frontendSection = userService.getCurrentSection($scope.section.frontend);

            if(dashboardSection) {
                permission = $scope.hasPermission[dashboardSection];
            } else if(frontendSection) {
                permission = (frontendSection == "timesheet") 
                    ? checkTimesheetModulePermission(frontendSection) 
                    : (frontendSection == "adminPIP") 
                        ? checkPIPModulePermission(frontendSection) 
                        : (frontendSection == "newHireManagement" && currentUrl.indexOf('verify') >= 0) 
                            ? $scope.adminViewElcm : $scope.hasPermission[frontendSection];                
            }
            
            return permission;
        };	
        if(currentUrl.indexOf('no-permission') == -1
            && (currentUrl.indexOf('dashboard') >= 0 || currentUrl.indexOf('frontend') >= 0)) {
            if(!hasPermission()) {
                $location.url('dashboard/no-permission');
            }
        }
        /********* End Permission Related Section *********/

        /** This accordion object has been used on setup home page **/
        $scope.accordion = userService.buildAccordionObject();

        /** This accordionTab object has been used to handle full page back button functionality **/
        $scope.accordionTab = utilityService.buildAccordionTabObject();

        /********** Start report problem section **********/
        $scope.reportProblem = {
            problem: null
        };
        $scope.toggleModal = function(id, flag, form) {
            if(angular.isDefined(form)){
                $scope.reportProblem.problem = null;
                utilityService.resetForm(form);
            }
            flag = angular.isDefined(flag) ? flag : false;
            flag ? $("#" + id).appendTo('body').modal("show") :  $("#" + id).modal("hide");
        };
        $scope.reportAProblem = function () {
            var url = userService.getUrl('reportProblem'),
                payload = {
                    problem: $scope.reportProblem.problem
                };

            serverUtilityService.postWebService(url, payload)
                .then(function (data){
                    if(data.status == 'success'){
                        utilityService.showSimpleToast(data.message);
                        $scope.closeModal('reportSpam');
                    }
                });
        };
        $scope.launchReportSpamPopup = function(form) {
            if(angular.isDefined(form)) {
                $scope.reportProblem.problem = null;
                utilityService.resetForm(form);
            }
            $scope.openModal('report-problem.tmpl.html', 'reportSpam')
        };
        /********** End report problem section **********/


        /** Start Click Event Listener for dashboard/frontend sidebar navigation **/
        $scope.sideBarNavigation = function(url, model, keyname) {
            if(angular.isDefined(model)) {
                model[keyname] = false;
            }
            $location.url(url);
        };

        $scope.sideBarTargetBlank = function(url, model, keyname) {
            if(angular.isDefined(model)) {
                model[keyname] = false;
            }
            if(keyname === 'thirdparty' && model._id == 1) {
                $window.open(model.sso_route + "?access_token=" + utilityService.getStorageValue('accessToken'), '_blank');
            } else {
                $location.url(url);
                $route.reload();
            }
        };
        /** End Click Event Listener for dashboard/frontend sidebar navigation **/


        /******** Start Alert Section *********/
        var broadCastEvent = function(event, params) {
            $rootScope.$broadcast(event, {
                params: params
            });
        };
        $scope.broadCastEventUsingScope = function(event, params) {
            $scope.$broadcast(event, {
                params: params
            });
        };
        $scope.notificationMarkAsRead = function() {
            var url = userService.getUrl('markAsRead');// + "/" + item._id;
            serverUtilityService.patchWebService(url, {})
                .then(function(data) {
                    if(data.status == "success") {
                        broadCastEvent('read-notification', {});
                        broadCastEvent('get-alert-count', {});
                    }
                });
        };
        $scope.selectAllNotification = function(list, checkValue) {
            angular.forEach(list, function(value, key) {
                value.isChecked = checkValue;
            });
        };
        $scope.notificationBulkMarkAsRead = function(list) {
            var url = userService.getUrl('markBulkAsRead'), payload =  {
                bulk_ids:[]
            };
            angular.forEach(list, function(value,key){
                if (value.isChecked) {
                    payload.bulk_ids.push(value._id);
                }
            });
            serverUtilityService.patchWebService(url, payload)
                .then(function(data) {
                    if(data.status == "success") {
                        broadCastEvent('read-notification', {});
                        broadCastEvent('get-alert-count', {});
                    }
                });
        };
        $scope.toggleAlert = function(flag) {
            if(currentUrl.indexOf('alert') >= 0) {
                return false;
            }
            $scope.alert.visible = flag;
            if(flag) {
                $('#alert-menu-content').show();
                $timeout(function() {
                    $('#alert-menu-content .md-tab').attr("md-prevent-menu-close", "md-prevent-menu-close");
                }, 1000);
            }
        };
        $scope.clickOutSideClose = function() {
            $scope.toggleAlert(false);
        };
        var getAlertCount = function() {
            serverUtilityService.getWebService(userService.getUrl('alert'))
                .then(function(data) {
                    $scope.alert.count = utilityService.getInnerValue(data, 'data', 'count', 0);
                    $scope.alert.actionCount = utilityService.getInnerValue(data, 'data', 'action', 0);
                });
        };
        if($scope.user.accessToken) {
            getAlertCount();
        }
        $scope.$on("$mdMenuClose", function() {
            $scope.alert.visible = false;
            $scope.favourites.visible = false;
        });

        /* Listening get alert count broadcast event triggered
            * from mark as read notification */
        $scope.$on('get-alert-count', function(event, args) {
            getAlertCount();
        });
        /******** End Alert Section *********/


        $scope.isHeaderHidden = function() {
            return $scope.callback == 'candidatePortal' || $scope.section.templateBuilder
                || $scope.section.segmentField || $scope.section.archiveProfile
                || $scope.section.login || $scope.section.frontend.newHireManagement.verify
                || !$scope.user.accessToken || $scope.section.frontend.payroll.investmentDeclaration
                || $scope.section.frontend.payroll.previousEmployer || $scope.section.frontend.payroll.checks
                || $scope.section.frontend.payroll.checksCorrection
                || $scope.section.resetPassword || $scope.section.exportChart
                || $scope.section.createObjective
                || $scope.section.recruitmentDetails
                || $scope.section.candidateScorecard
                || $scope.section.newTravel
                || $scope.section.travelDetail
                || $scope.section.newJob
                || $scope.section.jobPublish
                || $scope.section.recruitmentCandidateDetails
                || $scope.section.newExpense
                || $scope.section.travelDetail
                || $scope.section.travelRequest
                || $scope.section.viewExpense
                || $scope.section.frontend.adminTravelExpense.requestDetail
                || $scope.section.frontend.adminTravelExpense.spendsDetail
                || $scope.section.frontend.adminTravelPlanner.requestDetail
                || $scope.section.frontend.adminTravelPlanner.uploadTickets
                || $scope.section.frontend.adminTravelExpense.expenseDetail
                || $scope.section.frontend.adminTravelExpense.expenseDetailReconcile
                || $scope.section.bankReport
                || $scope.section.ticketRating
                || $scope.section.travelRequestDetails
                || $scope.section.dashboard.feedback.cycleViewFeedback
                || $scope.section.frontend.adminPerformance.reviewCycleLaunch
                || $scope.section.templateConsumer
                || $scope.section.frontend.elcm.bulkAssign
                || $scope.section.frontend.lndAdmin.bulkAssign
                || ($scope.isDeviceMobile() && $scope.user.mobileHidebar)
                || $scope.section.history
                || $scope.section.acceptLetter
                || $scope.section.jobDetail
                || $scope.section.jobs
                || $scope.section.recruiterDetail
                || $scope.section.recruitmentJobs
 		        || $scope.section.bulkUpload
                || $scope.section.salaryBreakup
                || $scope.section.fnfLetters
                || $scope.section.newAdvanceRequest
                || $scope.section.viewAdvanceRequest
                || $scope.section.demoAnytime
                || $scope.section.screenshotIndividualView
                || $scope.section.screenshotComparisonView
                || $scope.section.screenshotLink
                || $scope.section.frontend.payroll.investmentProof
                || $scope.section.actionViaEmail
                || $scope.section.assessment
        };
        $scope.isSideNavVisible = function() {
            return $scope.user.accessToken
                && ((section === "dashboard" || currentUrl.indexOf('dashboard') >= 0
                || currentUrl.indexOf('frontend') >= 0)
                && currentUrl.indexOf('new-hire/verify') == -1
                && currentUrl.indexOf('payroll/investmentDeclaration') == -1
                && currentUrl.indexOf('payroll/investmentProof') == -1
                && currentUrl.indexOf('payroll/previousEmployer') == -1
                && currentUrl.indexOf('payroll/runPayroll') == -1
                && currentUrl.indexOf('payroll/checks') == -1
                && currentUrl.indexOf('payroll/checksCorrection') == -1
                && currentUrl.indexOf('provision-manager/provisionAllotmen') == -1
                && currentUrl.indexOf('provision-manager/provisionRevoke') == -1
                && currentUrl.indexOf('exit/verifyDocument') == -1
                && currentUrl.indexOf('travel/request-details') == -1)
                && !$scope.section.createObjective
                && !$scope.section.recruitmentDetails
                && !$scope.section.candidateScorecard
                && !$scope.section.newTravel
                && !$scope.section.travelDetail
                && !$scope.section.newJob
                && !$scope.section.jobPublish
                && !$scope.section.history
                && !$scope.section.recruitmentCandidateDetails
                && !$scope.section.newExpense
                && !$scope.section.travelDetail
                && !$scope.section.viewExpense
                && !$scope.section.frontend.adminTravelExpense.spendsDetail
                && !$scope.section.frontend.adminTravelPlanner.requestDetail
                && !$scope.section.frontend.adminTravelPlanner.uploadTickets
                && !$scope.section.frontend.adminTravelExpense.expenseDetail
                && !$scope.section.frontend.adminPerformance.reviewCycle
                && !$scope.section.frontend.adminPerformance.manageReviewCycle
                && !$scope.section.frontend.adminPerformance.addRepository
                && !$scope.section.dashboard.feedback.cycleViewFeedback
                && !$scope.section.frontend.adminTravelExpense.expenseDetailReconcile
                && !$scope.section.frontend.adminPerformance.reviewCycleLaunch
                && !$scope.section.jobDetail
                && !$scope.section.frontend.elcm.bulkAssign
                && !$scope.section.bulkUpload
                && !$scope.section.screenshotIndividualView
                && !$scope.section.screenshotComparisonView
                && !$scope.section.newAdvanceRequest
                && !$scope.section.viewAdvanceRequest
                && !$scope.section.frontend.lndAdmin.bulkAssign
                && (!$scope.isDeviceMobile() || !$scope.user.mobileHidebar);
        };

        $scope.isUserNavVisible = function() {
            return true && !$scope.section.firstattendance;
        };
        /** This method will do auto redirection based on user login
            * status & current route **/
        var triggerAutoRedirection = function() {
            if((!$scope.user.accessToken || $scope.user.accessToken == null )
                && !($scope.section.login || $scope.section.changePassword || $scope.section.jobs || $scope.section.fnfLetters || $scope.section.demoAnytime || $scope.section.screenshotLink || $scope.section.actionViaEmail || $scope.section.assessment)) {
                $location.url("login");
            } else if($scope.user.accessToken && $scope.section.login) {
                $location.url("dashboard/home");
            } else {
                if(currentUrl.indexOf('reset-password') == -1
                    && $scope.user.hasPasswordChanged == false) {
                    $location.url('reset-password');
                }
            }
        };
        triggerAutoRedirection();


        /********** Start Idle Section **********/
        $scope.started = false;
        function closeIdleModals() {
            if ($scope.warning) {
                $scope.warning.close();
                $scope.warning = null;
            }
        }
        $scope.$on('IdleStart', function() {
            closeIdleModals();
            $scope.warning = $uibModal.open({
                templateUrl: 'warning-dialog.html',
                windowClass: 'modal-warning'
            });
        });
        $scope.$on('IdleEnd', function() {
            closeIdleModals();
        });
        $scope.$on('IdleTimeout', function() {
            closeIdleModals();
            utilityService.setReloadOnSearch(true);
            $scope.logout();
        });
        $scope.start = function() {
            if(!utilityService.getStorageValue('accessToken') || $scope.section.actionViaEmail) {
                return false;
            }
            closeIdleModals();
            Idle.watch();
            $scope.started = true;
        };
        $scope.stop = function() {
            closeIdleModals();
            Idle.unwatch();
            $scope.started = false;
        };
        /********** End Idle Section **********/

        $scope.showMobileMainHeader = true;
        $scope.openSideNavPanel = function() {
            $mdSidenav('left').open();
        };
        $scope.closeSideNavPanel = function() {
            $mdSidenav('left').close();
        };
        $scope.viewOwnProfile = function() {
            $location.url("dashboard/profile");
        };
        $scope.logoClickHandler = function() {
            if($scope.section.dashboard.home || $scope.section.frontend.home) {
                return false;
            }
            $location.url('/');
        };
        $scope.navigateToSetup = function() {
            /*if(currentUrl.indexOf('admin') >= 0) {
                return false;
            }*/
            $location.url('admin');
        };

        /********* Start Upload Profile Pic Section *********/
        $scope.picFile = null;
        $scope.profilePic = {
            picFile: null,
            crop_type: "circle",
            croppedDataUrl: null,
            image: null
        };
        var toggleProfilePicModal = function(flag) {
            if(flag) {
                $('#profile-pic').appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            } else {
                $('#profile-pic').appendTo("body").modal('hide');
            }
        };
        $scope.bindProfilePicChangeEvent = function() {
            $("input[type=file]").on('change',function(){
                toggleProfilePicModal(true);
            });
        };

        $scope.setArea=function(value) {
            $scope.profilePic.crop_type = value;
        };
        var uploadProfilePicSuccessCallback = function(response) {
            if(response.data.status == "success") {
                utilityService.setStorageValue('profilePic', response.data.image_path);
                utilityService.setStorageValue('cropType', cropTypeHashmap[$scope.profilePic.crop_type]);
                $scope.user = userService.buildUserObject();
                toggleProfilePicModal(false);
            }
        };
        var uploadProfilePicErrorCallback = function(response) {
            if (response.status > 0) {
                $scope.errorMsg = response.status + ': ' + response.data;
            }
        };
        $scope.uploadProfilePic = function (dataUrl, name) {
            Upload.upload({
                url: userService.getUrl('uploadPic'),
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: {
                    img_icon: Upload.dataUrltoBlob(dataUrl, name),
                    crop_type: cropTypeHashmap[$scope.profilePic.crop_type]
                },
            }).then(function (response) {
                uploadProfilePicSuccessCallback(response);
            }, function (response) {
                uploadProfilePicErrorCallback(response);
            }, function (evt) {
                console.log("progress callback");
            });
        };
        /********* End Upload Profile Pic Section **********/


        /************ Start Favourite Section **************/
        $scope.favoutiesSections = [];
        var getFavourites = function(){
            var url = userService.getUrl('favorites');
            serverUtilityService.getWebService(url).then(function (data) {
                if(data){
                    $scope.favoutiesSections = data.data;
                }
            });
        }
        $scope.nameModel = {
            name : null
        };
        $scope.saveAsFavourite = function(name, form){
            if(!form.$valid) {
                return false;
            }
            var url = userService.getUrl('favorites'),
                payload = {
                    name: name,
                    details : {
                        url : $location.path()
                    }
                };

            serverUtilityService.postWebService(url,payload).then(function (data) {
                if(data.status == "success"){
                    getFavourites();
                    $scope.nameModel.name = null;
                    utilityService.resetForm(form);
                }
            });
        };
        $scope.deleteAsFavourite = function(item){
            if(!angular.isDefined(item) || !item._id){
                return false;
            }
            var url = userService.getUrl('favorites') + '/' + item._id;
            serverUtilityService.deleteWebService(url).then(function (data) {
                if(data.status == "success"){
                    utilityService.showSimpleToast(data.message);
                    $scope.favoutiesSections = utilityService.deleteCallback(data, item, $scope.favoutiesSections);
                }
            });
        };
        $scope.redirectToFavourite = function(item) {
            if(angular.isDefined(item) && angular.isDefined(item.details.url) && item.details.url){
                $location.url(item.details.url);
            }
        };
        $scope.toggleFavourites = function(flag) {
            $scope.favourites.visible = flag;
            if(flag && $scope.user.accessToken) {
                getFavourites();
            }
        };
        /************ End Favourite Section **************/

        $scope.viewProfile = function (empId, profilePage){
            var id = angular.isObject(empId) ? empId.$id : empId;
            if(angular.isDefined(id)){
                console.log($location.url("/dashboard/profile/" + id).search({"routeUserId": id, 'tabIndex' : profilePage}))
                $location.url("/dashboard/profile/" + id).search({"routeUserId": id, 'tabIndex' : profilePage});
            }
        };


        $scope.viewProfileInNewTab = function (empId, profilePage){
            var id = angular.isObject(empId) ? empId.$id : empId;
            if(angular.isDefined(id)){
                var url = "/dashboard/profile/" + id;
                var searchParams = {"routeUserId": id}
                $scope.redirectUsingNewTab(url, searchParams)
            //  $location.url("/dashboard/profile/" + id).search({"routeUserId": id, 'tabIndex' : profilePage});
            }
        };


        $scope.viewOrch = function(empId){
          var id = angular.isObject(empId) ? empId.$id : empId;
            if(angular.isDefined(id)){
                $location.url('/frontend/people').search({"routeUserId": id});
            }
        };

        $rootScope.searchSolar = {
            searchkey : null,
            selectedIndex : null
        };
        $scope.onEnterSearch = function(event){
            if(baseSelf.searchText.length){
                utilityService.setReloadOnSearch(true);
                $location.url('/frontend/people').search({"name": baseSelf.searchText});
            }
        };
        baseSelf = this;
        $scope.searchBase = {
            id : null
        };

        $scope.isAll = {
            flag: true,
            allSearch: angular.isDefined($routeParams.type) ? $routeParams.type : 1,
            currentSelected : userService.solarVarrObj
        };
        $rootScope.search_by = $scope.isAll.allSearch;
        $scope.solarVariables = userService.bulidSolarVariables();

        $scope.selectAllTypeSolarSearch = function (isAll){
            $scope.isAll.flag = isAll;
            angular.forEach($scope.solarVariables, function (value, key){
                value.isChecked = isAll;
            });
        };
        $scope.unselectAll = function () {
            var count = 0;
            angular.forEach($scope.solarVariables, function (value, key){
                if(value.isChecked){
                   count +=1;
                }
            });
            $scope.isAll.flag = count == $scope.solarVariables.length ? true : false;
        };
        $scope.getSearchBy = function (type){
            $scope.allUsers = [];
            $rootScope.search_by = type;
        };
        baseSelf.simulateQuery = false;
        baseSelf.selectedItemChange = selectedItemChange;
        baseSelf.filterSelected = true;
        $scope.allUsers = [];
        $scope.headerSearch = {
            text: ''
        };
        $scope.headerSearchChangeHandler = function (text) {
            baseSelf.searchText = text;
            baseSelf.querySearch(baseSelf.searchText);
        };
        baseSelf.querySearch = function (query) {
            $scope.headerSearch.text = query;
            if (query && query.length >= 2) {
                $scope.searchAutocomplete.visible = false;
                var url = userService.getUrl('autosearch'),
                    params = {
                        search_by: $rootScope.search_by,
                        search: escape(query)
                    };

                serverUtilityService.getWebService(url, params)
                    .then(function(data) {
                        $scope.allUsers = utilityService.getValue(data, 'data', []);
                        $scope.searchAutocomplete.visible = true;
                    });
            } else {
                $scope.allUsers = [];
            }          
        };

        /************ START SEARCH AUTOCOMPLETE ************/
        $rootScope.broadcastVariables = {
            searchData : null
        };
        $scope.searchAutocomplete = {
            visible: true
        };
        function selectedItemChange(item, model, key) {
            if (angular.isDefined(model[key]) && angular.isDefined(item) && item) {
                var id =  angular.isObject(item._id) ? item._id.$id : item._id;
                item._id = id;
                model[key] = id;
                if($rootScope.search_by != 1 || $rootScope.search_by!='1'){
                    var key = userService.solarVarrObj[$rootScope.search_by];
                    item[key] = item.name;
                }
                userService.resetAllFlag($scope.section.dashboard);
                userService.resetAllFlag($scope.section.frontend);
                $scope.section.dashboard.people = true;
                utilityService.setReloadOnSearch(true);
                $location.url('/frontend/people').search(item);
            } else {
                if(baseSelf.searchText.length == 0){
                    return;
                }
            }
        }
        function loadAll() {
            var repos = $scope.allUsers;
            return repos.map(function (repo) {
                repo['name'] = angular.isDefined(repo.name) && repo.name!= null ? repo.name : repo.name;
                return repo;
            });
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }
        /************ END SEARCH AUTOCOMPLETE ************/

        /************ START HEADER SEARCH SECTION ***********/
        $scope.resetSearch = {
            flag: false,
        };
        $scope.setupSearch = {
            searchkey : null
        };
        $scope.accordionSearch = userService.buildAccordionSearchObject();
        $scope.resetAccordianSearch = function() {
            $scope.setupSearch.searchkey = null;
            $scope.resetSearch = {
                flag : false
            };
        };
        $scope.onSetupSearch = function(event,toggleBoolean) {
            if($scope.setupSearch.searchkey.length > 0) {
                $scope.foundModules = [];
                $scope.resetSearch = {
                    flag : true
                }
                angular.forEach($scope.accordionSearch,function(v,k) {
                    angular.forEach(v,function(value,key) {
                        if(value.indexOf($scope.setupSearch.searchkey.toLowerCase()) >= 0) {
                            $scope.foundModules.push(k);
                        }
                    })
                })
                if($scope.foundModules.length && toggleBoolean) {
                    $scope.toggleAccordion($scope.foundModules[0]);
                }
            }
        };
        /************ END HEADER SEARCH SECTION ***********/

        /** This method will display appropriate html/template based on provided parameters **/
        $scope.getPartial = function (section, file) {
            return getTemplatePath(section) + file;
        };

        /************ Start logout section ***********/
        $scope.logout = function() {
            serverUtilityService.postWebService(userService.getUrl('logout'), {})
                .then(function(data){
                    userService.removeStorageValue();
                    if($( 'div' ).hasClass( "modal-backdrop" )) {
                        $('.modal').modal('hide');
                        $(".modal-backdrop").hide();
                    }
                    $location.url("login");
                });
        };
        /************ End logout section ***********/

        /** Start Click Event Listener for setup all module **/
        $scope.toggleAccordion = function(tabName) {
            angular.forEach($scope.accordion, function(value, key) {
                if(tabName != key) {
                    $scope.accordion[key] = false;
                }
            });
            $scope.accordion[tabName] = $scope.accordion[tabName] ? false : true;
        };
        /** End Click Event Listener for setup all module **/


        /** This is used to handle back button click event listener
            * from setup fullpage like setting & relevance etc **/
        if(utilityService.getValue($routeParams, 'tab')) {
            $scope.toggleAccordion($routeParams.tab);
            $timeout(function() {
                $location.search("tab", null);
            }, 1000);
        }

        /** This is used to handle back button click event listener
            * from create segment **/
        if(utilityService.getValue($routeParams, 'action') == 'createSegment') {
            $scope.toggleAccordion("company");
        }
        angular.element(document).ready(function () {
            $timeout(function() {
                $scope.start();
            }, 1000);
        });

        /******************Refresh Token Section***************************/
        var interval = utilityService.getStorageValue('TokenCounter')
            ? utilityService.getStorageValue('TokenCounter') : 0;

        var refreshTokenCallBack = function (data) {
            userService.setStorageValue(data);
            $scope.user = userService.buildUserObject();
            if(!$scope.user.accessToken){
                $scope.logout();
            }
            interval = setInterval(function () {
                if ($scope.user.accessToken) {
                    setCounter(false);
                }
            }, 60*1000);
        };
        var refreshToken = function () {
            var url = userService.getUrl('refreshToken'),
                payload = {user_id: utilityService.getStorageValue('loginUserId')};

            $cookies.put('hrm_refreshToken', utilityService.getStorageValue('refreshToken'));

            serverUtilityService.postWebService(url, payload).then(function (data) {
                if(utilityService.getValue(data, 'error')) {
                    $scope.logout();
                    return false;
                }
                refreshTokenCallBack(data);
            }, function(error) {
                $scope.logout();
            });
        };
        var timeDiff = function () {
            var d = new Date();
            var currentTime = d.getTime();
            var loginTime = utilityService.getStorageValue('tokenResetTime');
            var timediff1 = Math.floor((currentTime - loginTime)/60000);
            return timediff1;
        };
        var setCounter = function (flag) {
            var counter = parseInt(utilityService.getStorageValue('TokenCounter')),
                limit = FREQUENCY_COUNTER.GENERATE_ACCESS_TOKEN_BY_REFRESH_TOKEN;

            if(isNaN(counter)) {
                utilityService.setStorageValue('TokenCounter', 0);
                clearInterval(interval);
            } else {
                counter = timeDiff();
                if(counter > limit) {
                    limit = FREQUENCY_COUNTER.GENERATE_ACCESS_TOKEN_BY_REFRESH_TOKEN;
                }
                utilityService.setStorageValue('TokenCounter', counter);
                if (counter != 0 && counter % limit == 0) {
                    clearInterval(interval);
                    refreshToken();
                }
            }
        };

        interval = setInterval(function () {
            if ($scope.user.accessToken) {
                setCounter(false);
            }
        }, 60*1000);

        if($scope.user.accessToken){
            setCounter(true);
        }

        $scope.$on('$destroy', function() {
            clearInterval(interval);
        });

        $scope.intercepterCount = 0;
        $rootScope.$on('interceptor-401', function(event, args) {
            if($scope.intercepterCount > 0){
                return false;
            }
            $scope.intercepterCount += 1;
            $scope.logout();
        });
        $scope.showSearchResponsive = false;
        $scope.showSearch = function(boolean){
            $scope.showSearchResponsive = boolean;
        };
        $scope.checkPreviousMonths = function (timestamp, checkName) {
            if (timestamp < $scope.joiningDate) {
                $scope.checkName.name = checkName;
            } else {
                $scope.checkName.name = null;
            }
        };
        /************** Refresh Token Section **************/
        var preventDateClose = function(){
             $timeout(function() {
                $('md-datepicker .md-datepicker-input-container .md-datepicker-triangle-button ,md-datepicker .md-datepicker-button .md-datepicker-calendar-icon, md-datepicker .md-datepicker-button').attr("md-prevent-menu-close", "md-prevent-menu-close");
            }, 1000);
        }
        preventDateClose();

        /* Mobile Top Search Bar */
        var ScrollCtrl = function($scope) {
            $scope.someArray = [1, 2, 3];
            $scope.addItem = function() {
                var arrayLength = $scope.someArray.length;
                var nextValue = arrayLength > 0 ? $scope.someArray[arrayLength - 1] + 1 : 1;
                $scope.someArray.push(nextValue);
            };
            $scope.removeItem = function() {
                if ($scope.someArray.length) { $scope.someArray.pop(); }
            }
            $scope.scrollTop = 0
            $scope.scrollHeight = 0
            $scope.onScroll = function (scrollTop, scrollHeight) {
                $scope.scrollTop = scrollTop
                $scope.scrollHeight = scrollHeight
            }
        };

        /* js for md-menu-close on hover */
        $scope.noop = function(event){
            event.stopImmediatePropagation();
        };
        $scope.closeSubMenu = function(event){
            $mdMenu.hide();
        };

        /*********** Start Dialog Box Section ***********/
        $scope.showAlert = function(event, title, message) {
            title = title || 'This is an alert title';
            message = message || 'You can specify some description text in here.';
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .targetEvent(event)
            );
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.rateGuidelines = function(ev) {
            $mdDialog.show({
                templateUrl: 'rate_guidelines.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        };
        /*********** End Dialog Box Section ***********/


        /**************** Start Filter Section ****************/
        $scope.selectUnselectAllFilters = function (isAll, filterKey, list, collection, allFilterObject, allFilterCollection, groupSlug, isChecked){
            angular.forEach(list, function (v, k){
                var i = $.inArray(v, allFilterObject[allFilterCollection]);
                if(i > -1) {
                    allFilterObject[allFilterCollection].splice(i, 1);
                }
                angular.isDefined(isChecked) ? v[isChecked] = isAll : v.isChecked = isAll;
                if (isAll) {
                    v.slug = angular.isDefined(groupSlug) ? groupSlug : allFilterCollection;
                    collection.push(v[filterKey]);
                    if (angular.isDefined(allFilterObject[allFilterCollection])) {
                        allFilterObject[allFilterCollection].push(v);
                    }
                } else {
                    var j = $.inArray(v[filterKey], collection);
                    allFilterObject[allFilterCollection] = [];
                    collection.splice(j, 1);
                }
            });
        };
        $scope.updateAllSletectedFilterFlag = function (list, isAllObjetc, isAll, isChecked) {
            var allSet = true, allClear = true, element = $('#' + isAll),
                    selectKey = angular.isDefined(isChecked) ? isChecked : 'isChecked';
            angular.forEach(list, function (v) {
                if (v[selectKey]) {
                    allClear = false;
                } else {
                    allSet = false;
                }
            });
            if (allSet) {
                isAllObjetc[isAll] = true;
                element.prop('indeterminate', false);
            } else if (allClear) {
                isAllObjetc[isAll] = false;
                element.prop('indeterminate', false);
            } else {
                isAllObjetc[isAll] = false;
                element.prop('indeterminate', true);
            }
        };

        /************ START FOR QUESTION ANSWER POPUP ************/
        $scope.clickQuestionAnswer = function(item, answer) {
            item.answer = angular.isDefined(item.answer) && item.answer != '' ? item.answer : [];
            var idx = item.answer.indexOf(answer);
            (idx > -1) ? item.answer.splice(idx, 1) : item.answer.push(answer);
        };
        $scope.checkIsConditionTrue = function (item, list){
            var count = 0;
            angular.forEach(list, function (v, k){
                if(item.parentQuestion == v._id){
                    if(angular.isArray(v.answer) && ($window._.intersection(item.parentOption, v.answer).length > 0)){
                        count = count + 1;
                    } else if(!angular.isArray(v.answer) && item.parentOption.indexOf(v.answer) > -1){
                        count = count + 1;
                    }
                }
            });

            item.isChoosen = count > 0 ? true : false;
            return item.isChoosen;
        };
        /************ END FOR QUESTION ANSWER POPUP ************/


        /************ START FIND PROPERTY FOR HIDING TAB *************/
        $scope.findProperty = function (person, module, keyname) {
            var out = [];
            if(angular.isDefined(config[envMnt].hiddenTab)) {
                out = utilityService.findProperty(config[envMnt].hiddenTab[person][module], keyname);
            }

            return out.length ? true : false;
        };
        /************ END FIND PROPERTY FOR HIDING TAB *************/


        /********* Start Employee Compensation Related Methods **********/
        $scope.hideEmployeeCompensationSection = function(feature) {
            return $scope.findProperty('employee', 'compensation', feature);
        };
        $scope.hideAdminCompensationSection = function(feature) {
            return $scope.findProperty('admin', 'compensation', feature);
        };
        $scope.hideSetupCompensationSection = function(feature) {
            return $scope.findProperty('setup', 'compensation', feature);
        };
        /********* End Employee Compensation Related Methods **********/

        /************ END FIND PROPERTY FOR HIDING TAB ************/
        $scope.isAdminToolsVisible = function() {
            var isVisible = false;
            if($scope.isDeviceMobile()) {
                return isVisible;
            }
            angular.forEach($scope.modulePermissions.admin, function(value, key) {
                if(value) {
                    isVisible = isVisible || true;
                }
            });

            return isVisible;
        };
        angular.element(document).ready(function () {
            $(document).on('click', '.contnt-no-scroller', function () {
                // if(this.hasClass == '')
                $(".no-overflow").addClass('ovrflw');
                $('body').click(function() {
                    if($(".no-overflow").hasClass('ovrflw')){
                        $(".no-overflow").removeClass('ovrflw');
                    }
                });
                // $timeout(function() {
                //     $scope.start();
                // }, 1000);
            });
        });


        /************START: Mandatory Filed Section**************/
        var isMandatoryFieldRequired = utilityService.getStorageValue('isMandatoryFieldRequired')
        if(isMandatoryFieldRequired == true || isMandatoryFieldRequired == 'true'){
            $location.url('user-mandatory-fileds');
        }
        if($location.path() == '/user-mandatory-fileds' && (!isMandatoryFieldRequired || isMandatoryFieldRequired == 'false' || isMandatoryFieldRequired == false)){
            $location.url('dashboard/no-permission');
        }
        /************END: Mandatory Filed Section**************/



        /********* Start section for handling reset token for change password ********/
        var validateResetToken = function() {
            var url = userService.getUrl('validateResetToken') + "/"
                + utilityService.getValue($routeParams, 'resetToken');

            serverUtilityService.getWebService(url)
                .then(function (data){
                    if(data.status == 'success'){
                        //console.log(data);
                    } else {
                        $scope.validateResetToken = {
                            expired: true,
                            message: data.message
                        };
                    }
                });
        };
        if ($scope.section.changePassword
            && utilityService.getValue($routeParams, 'resetToken')) {
            validateResetToken();
        }
        /********* End section for handling reset token for change password ********/

        /******* Start: function to render content using html tag ***********/
        $scope.renderContentUsingHtmlTag = function(text) {
            return $sce.trustAsHtml(utilityService.decodeHTMLEntities(text));
        };
        $scope.renderContentUsingHtmlTagBroadcast = function(text) {
            return $sce.trustAsHtml(text);
        };
        /******* End: function to render content using html tag ***********/

        /******* Start: Method for restricting future Date ********/
        $scope.restrictForFutureDate = function(calDate) {
            var currDate = new Date(),
                calTime = calDate.getTime(),
                currTime = currDate.getTime();

            return calTime <= currTime;
        };
        /******* End: Method for restricting future Date ********/

        /********* Start Angular Modal Section *********/
        $scope.openModal = function(templateUrl, keyName) {
            $scope.modalInstance[keyName] = $modal.open({
                templateUrl : templateUrl,
                scope : $scope,
                windowClass: 'fadeEffect',
                controller: 'ModalInstanceCtrl',
                //backdrop: 'static',
                size: 'sm'
            });
        };
        $scope.closeModal = function (keyName) {
            $scope.modalInstance[keyName].dismiss('cancel');
        };
        /********* End Angular Modal Section *********/

        /******* Start: function to set user-comment-type for helpdesk ***********/
        $scope.setHelpdeskType = function(type) {
            utilityService.setStorageValue('commentType',type);
        };
        /******* End: function to set user-comment-type for helpdesk ***********/

        /******* Start: function to View/Download File Using Form *******/
        $scope.viewDownloadFileUsingForm = function(url) {
            var viewDownloadForm = document.createElement("form");

            viewDownloadForm.setAttribute("method", "post");
            viewDownloadForm.setAttribute("action", url);
            viewDownloadForm.setAttribute("target", "_blank");

            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("name", "access_token");
            hiddenField.setAttribute("value", utilityService.getStorageValue('accessToken'));
            hiddenField.setAttribute("type", "hidden");
            viewDownloadForm.appendChild(hiddenField);
            document.body.appendChild(viewDownloadForm);
            viewDownloadForm.submit();
        };
        /******* End: function to View/Download File Using Form *******/

        $scope.viewDownloadFileUsingFormAndPayload = function(url,payload){
                var viewDownloadForm = document.createElement("form");
                viewDownloadForm.setAttribute("method", "post");
                viewDownloadForm.setAttribute("action", url);
                viewDownloadForm.setAttribute("target", "_blank");

                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("name", "access_token");
                hiddenField.setAttribute("value", utilityService.getStorageValue('accessToken'));
                hiddenField.setAttribute("type", "hidden");
                document.body.appendChild(viewDownloadForm);
                viewDownloadForm.appendChild(hiddenField);
                angular.forEach(payload, function(value, key) {
                    if(key == 'filter') {
                        angular.forEach(value, function(v,k){
                            var hiddenField = document.createElement("input");
                            hiddenField.setAttribute("name", "filter[" + k + "]");
                            hiddenField.setAttribute("value", v);
                            hiddenField.setAttribute("type", "hidden");
                            viewDownloadForm.appendChild(hiddenField);
                            document.body.appendChild(viewDownloadForm);
                        });
                    } else if(key == 'new-field') {
                        angular.forEach(value, function(v,k){
                            var hiddenField = document.createElement("input");
                            hiddenField.setAttribute("name", "new-field[" + k + "]");
                            hiddenField.setAttribute("value", v);
                            hiddenField.setAttribute("type", "hidden");
                            viewDownloadForm.appendChild(hiddenField);
                            document.body.appendChild(viewDownloadForm);
                        });
                    } else if (key == 'emp_ids') {
                        angular.forEach(value, function(v,k){
                            var hiddenField = document.createElement("input");
                            hiddenField.setAttribute("name", "emp_ids[" + k + "]");
                            hiddenField.setAttribute("value", v);
                            hiddenField.setAttribute("type", "hidden");
                            viewDownloadForm.appendChild(hiddenField);
                            document.body.appendChild(viewDownloadForm);
                        });
                    } else {
                        var hiddenField = document.createElement("input");
                        hiddenField.setAttribute("name", key);
                        hiddenField.setAttribute("value", value);
                        hiddenField.setAttribute("type", "hidden");
                        viewDownloadForm.appendChild(hiddenField);
                        document.body.appendChild(viewDownloadForm);
                    }
                });
                viewDownloadForm.submit();
        }
        /******* Start: Action Approve Reject From Details Page *******/
        $scope.approveRejectActionOnDetails = function (model, status, comment) {
            comment = angular.isDefined(comment) ? comment : null
            var routParam = $routeParams;
            var url = actionService.getUrl('action') + "/" + model._id,
                payload = {
                    status: status,
                    comment: comment 
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if (data.status == 'success') {
                        model.status = data.data.status;
                        routParam.acs = data.data.status;
                        $location.search(routParam);
                        utilityService.setReloadOnSearch(true);
                    }else{
                        alert("Something went wrong.");
                    }
                });
        };

        $scope.getClaimsById = function (empId, claimId){
            $scope.alert.isVisibleData = false;
            var url = "employee/claims/" + empId + "/" + claimId;
            serverUtilityService.getWebService(url)
                    .then(function (data){
                        $scope.alert.salaryClaims = data.data;
                        $scope.alert.isVisibleData = data.data && angular.isObject(data.data) && Object.keys(data.data).length ? true : false;
                    });
        };
        $scope.viewClaimDocument = function(claim) {
            $scope.viewDownloadFileUsingForm(getAPIPath() + "employee/claims/" + claim._id + "/" + claim.emp_id);
        };
        /******* End: Action Approve Reject From Details Page *******/

        /******* Start: Appraisal Tab Title ********/
        var getAppraisalTabTitle = function(relationship, tabname) {
            if (typeof config[envMnt].appraisal != "undefined") {
                return typeof config[envMnt].appraisal[tabname][relationship] != "undefined" 
                    ? config[envMnt].appraisal[tabname][relationship] : config[envMnt].appraisal[tabname]['default'];
            } else {
                return tabname == 'titleTabTwo' ? 'Competency/Behavioral' : 'Goal/OKR';
            }
        };
        var getAppraisalVisibility = function(key, defaultValue) {
            defaultValue = angular.isDefined(defaultValue) ? defaultValue : true;

            return (typeof config[envMnt].appraisal != "undefined")
                ? utilityService.getInnerValue(config[envMnt].appraisal, 'visibility', key, defaultValue)
                : defaultValue;
        };
        var getAppraisalText = function(key, defaultValue) {
            defaultValue = angular.isDefined(defaultValue) ? defaultValue : null;

            return (typeof config[envMnt].appraisal != "undefined")
                ? utilityService.getInnerValue(config[envMnt].appraisal, 'text', key, defaultValue)
                : defaultValue;
        };
        $scope.buildAppraisalTabTitle = function(relationship) {
            relationship = angular.isDefined(relationship) ? relationship : 'default';
            $scope.appraisal = {
                titleTabOne: getAppraisalTabTitle(relationship, 'titleTabOne'),
                titleTabTwo: getAppraisalTabTitle(relationship, 'titleTabTwo'),
                promotionRecommendation: 'Promotion Recommendation',
                visibility: {
                    asReviewer: getAppraisalVisibility('asReviewer'),
                    myReviews: getAppraisalVisibility('myReviews'),
                    myTeam: getAppraisalVisibility('myTeam'),
                    oneOnOneAdmin: getAppraisalVisibility('oneOnOneAdmin'),
                    regularFeedbackAdmin: getAppraisalVisibility('regularFeedbackAdmin'),
                    reviewAdmin: getAppraisalVisibility('reviewAdmin'),
                    oneOnOne: getAppraisalVisibility('oneOnOne'),
                    updates: getAppraisalVisibility('updates'),
                    regularFeedback: getAppraisalVisibility('regularFeedback'),
                    review: getAppraisalVisibility('review'),
                    releaseByAdmin: getAppraisalVisibility('releaseByAdmin'),
                    oneOnOneTeam: getAppraisalVisibility('oneOnOneTeam'),
                    updatesTeam: getAppraisalVisibility('updatesTeam'),
                    regularFeedbackTeam: getAppraisalVisibility('regularFeedbackTeam'),
                    reviewTeam: getAppraisalVisibility('reviewTeam'),
                    kraRating: getAppraisalVisibility('kraRating'),
                    requestSummary: getAppraisalVisibility('requestSummary'),
                    birthday: getAppraisalVisibility('birthday'),
                    goalSelfEvaluation: getAppraisalVisibility('goalSelfEvaluation'),
                    competencySelfEvaluation: getAppraisalVisibility('competencySelfEvaluation'),
                    radioButtonRatingQuestion: getAppraisalVisibility('radioButtonRatingQuestion'),
                    midTermAppraisal: getAppraisalVisibility('midTermAppraisal', false),
                    adminTravel: getAppraisalVisibility('adminTravel'),
                    adminExpense: getAppraisalVisibility('adminExpense'),
                    empTravel: getAppraisalVisibility('empTravel'),
                    empExpense: getAppraisalVisibility('empExpense'),                    
                    sectionalRating: getAppraisalVisibility('sectionalRating', false),
                    breakupRating: getAppraisalVisibility('breakupRating', false),
                    promotionRecommendation: getAppraisalVisibility('promotionRecommendation', false),
                    empAdvance: getAppraisalVisibility('empAdvance'),
                    adminAdvance: getAppraisalVisibility('adminAdvance')
                },
                text: {
                    adminSidenavTE: getAppraisalText('adminSidenavTE', 'Travel & Expenses'),
                    adminTitleTE: getAppraisalText('adminTitleTE', 'Travel & Expenses'),
                    adminTravel: getAppraisalText('adminTravel', 'Travel'),
                    adminExpense: getAppraisalText('adminExpense', 'Expenses'),
                    adminAdvance: getAppraisalText('adminAdvance', 'Advances'),
                    empSidenavTE: getAppraisalText('empSidenavTE', 'Expense Management'),
                    empTitleTE: getAppraisalText('empTitleTE', 'Expense Management'),
                    empTravel: getAppraisalText('empTravel', 'Travel'),
                    empExpense: getAppraisalText('empExpense', 'Expenses'),
                    empAdvance: getAppraisalText('empAdvance', 'Advances'),
                    analyticsTitle: getAppraisalText('analyticsTitle', '360 Feedback')                                  
                }
            };
        };
        $scope.buildAppraisalTabTitle();

        $scope.isAppraisalStaticMessageVisible = function() {
            var companyList = []; //'local', 'nearbuy'

            return companyList.indexOf($scope.envMnt) >= 0;
        };
        /******* End: Appraisal Tab Title ********/

        $scope.setForceHideDisable = function(selectedYear) {
            var forceDisable = true,
                currentYear = utilityService.getCurrentYear(),
                currentMonth = utilityService.getCurrentMonth();

            if ((selectedYear == currentYear && currentMonth >= utilityService.startMonth)
                || (selectedYear == (utilityService.getCurrentYear() - 1) 
                    && currentMonth < utilityService.startMonth)) {
                forceDisable = false;    
            }

            $scope.forceHideDisable = forceDisable;
        };
        // $scope.setForceHideDisableOld = function(selectedYear) {
        //     selectedYear = selectedYear ? selectedYear : utilityService.getCurrentYear();
        //     $scope.forceHideDisable = selectedYear < utilityService.getCurrentYear();
        // };

        /****** Start: Terminology Change Functionality *******/
        $scope.isTerminologyChanged = function() {
            return typeof config[$scope.envMnt].isTerminologyChanged != "undefined"
                && config[envMnt].isTerminologyChanged;
        };
        /****** End: Terminology Change Functionality ******/


        /****** Start: calender customized view functionality******/
        $scope.isCalendarCustomized = function() {
            var calendarCustomizedCompanyList = ['local', 'prod4', 'prod40', 'prod5','affordplan']; // add domainName of client.
            return calendarCustomizedCompanyList.indexOf($scope.envMnt) >= 0;
        };
        /****** End: calender customized view functionality******/

        $scope.isCurrentUserTimesheetManager = function() {
            // If user is navigating through timesheet manager tab and has been added as the project manager of one of the timesheet.
            return (($scope.section.frontend.timesheet.manager || $scope.section.frontend.timesheet.allocationManager)
                    && ($scope.managerViewTimesheet() || $scope.isUserTimesheetCreator()));
        };
        $scope.isCurrentUserTimesheetFollower = function() {
            // If user is navigating through timesheet follower tab and has been added as the follower of one of the timesheet.
            return $scope.section.frontend.timesheet.follower && $scope.followerViewTimesheet();
        };

        /****** Start: Generic Form Submit Handler ******/
        $scope.formSubmitHandler = function(referenceKey, flag) {
            $scope.isFormSubmitted[referenceKey] = flag;
        };
        /****** End: Generic Form Submit Handler ******/

        /***** Start: Open link in a new tab *****/
        $scope.redirectUsingNewTab = function (url, searchParams) {
            var queryString = Object.keys(searchParams).map(function(key) {
                    return key + '=' + searchParams[key]
                }).join('&'),
                viewPath = url + "?" + queryString,                
                currentPath = window.location.href.substr(0, window.location.href.indexOf('#') + 1),
                fullPath = currentPath + viewPath;

            $window.open(fullPath, '_blank');
        };
        /***** End: Open link in a new tab *****/

        /************Is Screenshot Visible******************/
         $scope.isScreenshotModuleVisible=function () {
             return config[envMnt].screenshot.enabled
         }


        /*************Start: Special Features****************/
        $scope.features = {
            faq: {
                visible: false,
                excludedDomains: [],
                linkText: '',
                modules: {
                    attendanceEmployee: {
                        visible: true,
                        excludedDomains: ['prod4']
                    },
                    attendanceRegularization: {
                        visible: true,
                        excludedDomains: []
                    }
                }
            },
            videoLink: {
                visible: false,
                excludedDomains: [],
                modules: {}
            }
        };
        $scope.isVisibleFeature = function(feature, mod) {
            var fetur = utilityService.getValue($scope.features, feature);
            return fetur ? utilityService.getInnerValue(fetur.modules, mod, 'visible', false) : false;
        };
        (function(features, envMnt) {
            setTimeout(function() {
                angular.forEach(features, function(feature) {
                    feature.visible = !feature.excludedDomains.includes(envMnt);
                    if(feature.visible) {
                        angular.forEach(utilityService.getValue(feature, 'modules'), function(val) {
                            val.visible = !val.excludedDomains.includes(envMnt);
                        });
                    }
                });
            }, 0);
        })($scope.features, $scope.envMnt);
        /*************End: Special Features****************/
        /***** Start: Login Terms Condition Section *****/
        $scope.openTermsConditionModal = function(instance, template, size) {
            size = angular.isDefined(size) ? size : 'lg';

            $scope.modalInstance[instance] = $modal.open({
                templateUrl : template,
                scope : $scope,
                backdrop: 'static',
                keyboard: false,
                size: size
            });
        };
        $scope.closeTermsConditionModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        var renderLoginTermsConditionSection = function () {
            $scope.openTermsConditionModal('termsConditions', 'login-terms-nd-conditions.tmpl.html')
        };
        if (utilityService.getValue($scope.user, 'accessToken')
            && utilityService.getValue($scope.user, 'login_tc_enabled') === true
            && utilityService.getValue($scope.user, 'login_tc_accepted') === false) {
            renderLoginTermsConditionSection();
        }
        $scope.acceptTermsConditions = function() {
	    	var url = userService.getUrl("termsConditions"),
	    		payload = {};

	    	serverUtilityService.patchWebService(url, payload)
                .then(function(data) {
                    if (utilityService.getValue(data, 'status') === 'success') {
                        utilityService.setStorageValue('login_tc_accepted', true);
                        $scope.user.login_tc_accepted = true;
                        $scope.closeTermsConditionModal('termsConditions');
                        if (!$scope.section.dashboard.home) {
                            $timeout(function () {
                                $location.url('dashboard/home');
                            }, 1000);                            
                        }
                    } else {
                        console.log('need to handle error here');
                    }
                });		 	
		};
        /***** End: Login Terms Condition Section *****/

        /***** Start: Help Video Section *****/
        $scope.playHelpVideo = function (module) {
            $scope.helpVideo.currentModule = module;
            $scope.helpVideo.linkUrl = $sce.trustAsResourceUrl($scope.helpVideo.module[$scope.helpVideo.currentModule].link);
            $scope.openVideoModal('videoPlayer', 'common-helper-video-popup.tmpl.html');
        };
        $scope.openVideoModal = function(instance, templateUrl, size) {
            size = size || 'lg'
            $scope.modalInstance[instance] = $modal.open({
                templateUrl : templateUrl,
                scope : $scope,
                windowClass: 'fadeEffect',
                size: size
            });
        };
        $scope.closeVideoModal = function(instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].close();
            }
        };        
        /***** End: Help Video Section *****/
        // *************** help text 
        $scope.infoText = {
            visible : true
        }
        $scope.helpTextVisible = true;
        if($window.localStorage['helpTextVisibleSet'] == 'true'){
            $scope.helpTextVisible = true;
            $scope.infoText.visible = true;
        } else {
            $scope.helpTextVisible = false;
            $scope.infoText.visible = false;
        }
        $scope.changeHelpTextVisible = function (info) {
            $scope.helpTextVisible = !$scope.helpTextVisible;
            $scope.infoText.visible = $scope.helpTextVisible;
            $window.localStorage.setItem('helpTextVisibleSet', $scope.infoText.visible);
        }



        
        /***** Start: Auto Complete Using Name & Employee Code *****/
        $scope.autoCompleteVia = {
            list: [
                {
                    name: 'Employee Name',
                    slug: 'name'
                },
                {
                    name: 'Employee Code',
                    slug: 'empcode'
                }
            ],
            selected: 'name',
            keysMapping: {
                name: {
                    keyname: 'full_name',
                    title: 'employee name'
                },
                empcode: {
                    keyname: 'personal_profile_employee_code',
                    title: 'employee code'
                }
            }
        };
        /***** End: Auto Complete Using Name & Employee Code *****/

        /***** Start Logout Hack: 
         * Sometimes in local storage some essential variables are set 
            to "null" due to known reasons, so we have decided to handle this
            gracefully. First we will make a user details call in order to fetch
            user all required details if respinse is success then will use that response
            otherwise will do force logout *****/
        var userDetailsCallback = function (data) {
            utilityService.getValue(data, 'status') === 'success'
                ? userService.setStorageValue(utilityService.getValue(data, 'data'))
                : $scope.logout();
        };
        var getUserDetails = function () {
            serverUtilityService.getWebService(userService.getUrl('userDetails'))
                .then(function (data) {
                    userDetailsCallback(data);                        
                });
        };        
        if (utilityService.getValue($scope.user, 'accessToken') 
            && !utilityService.getValue($scope.user, 'fullname')) {            
            getUserDetails();
        }
        /***** End Logout Hack *****/

        $scope.faqSlack = function() {
            $scope.openVideoModal('comment', 'common-helper-video-popup.tmpl.html22');
        } 
        $scope.addToSlackHandler = function(){
            serverUtilityService.getWebService(userService.getUrl('slackIntegration'))
                .then(function(data) {
                    console.log(data);
                    $window.open(utilityService.getValue(data,'data'));
                });
        };

        $scope.addToGoogleDrive = function(){
            serverUtilityService.getWebService(userService.getUrl('googleDrivelogin'))
                .then(function(data) {
                    console.log(data);
                    $window.open(utilityService.getValue(data,'data'));
                });
        };

        $scope.getRunPayrollAutomation = function () {
            var url = userService.getUrl('payrollAutomation');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    console.log(data)
                    $scope.runPayrollAutomate.enabled = utilityService.getInnerValue(data, 'data', 'payroll_automation', false)
                    $scope.runFnfAutomate.enabled  = utilityService.getInnerValue(data, 'data', 'fnf_automation', false)
                });
        };

        /************ GOOGLE ANALYTICS SETUP FOR QANDLE ************/
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        var _gaq = _gaq || [];
        _gaq.push(["_setAccount", trackingId]);
        _gaq.push(["_setDomainName", "none"]);
        _gaq.push(["_trackPageview"]);
        ga('create', trackingId, 'auto');
        ga('set', 'userId', getSubDomainPath()+"-"+utilityService.getStorageValue('loginEmail'));
        ga('send', 'pageview', $scope.currentUrl);
        
    }
]);
