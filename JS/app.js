var countryCode = "IN",
    referenceCode = "IN",
    otpToken = null,
    app = angular.module('hrApp', [
        'ngRoute', 'ngAnimate', 'ngMaterial', 'ngSanitize', 'toaster', 'ngFileUpload', 
        'ngImgCrop', 'ui.tinymce', 'mdSteppers','ngMaterialDatePicker', 
        'angular-bind-html-compile', 'mwl.calendar','ui.bootstrap', 'vAccordion', 
        'mdPickers', 'ui.sortable', 'ngIdle', 'ngCookies', 
        'angularUtils.directives.dirPagination', 'starRating', 'hm.readmore' 
        /*,'ngLetterAvatar', 'ngCacheBuster'*/]);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('blue', {
        '50': 'e3f1fc',
        '100': 'c7e6ff',
        '200': '9bc7ec',
        '300': '72b1e5',
        '400': '52a7ed',
        '500': '007ee5',
        '600': '3698e7',
        '700': '3089d1',
        '800': '277dc3',
        '900': '1e73b9',
        'A100': '7ec4fd',
        'A200': '52b1fe',
        'A400': '1393fc',
        'A700': '0174d3',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'],
        'contrastLightColors': undefined
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('blue');
    });


app.config(['$routeProvider', '$mdDateLocaleProvider', 'IdleProvider', 'KeepaliveProvider', '$httpProvider', 
    function ($routeProvider, $mdDateLocaleProvider, IdleProvider, KeepaliveProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push(['$location','$window', '$injector', '$q', '$rootScope', 
            function ($location,$window, $injector, $q, $rootScope) {
                return {
                    'responseError': function (rejection) {
                        if (rejection.status === 401) {
                            $rootScope.$broadcast('interceptor-401', { 
                                params: {} 
                            });
                        }                        
                        return $q.reject(rejection);
                    }
                };
            }
        ]);

        $routeProvider
            .when('/', {
                templateUrl: '/template/module/common/home.html',
                reloadOnSearch: false
            })
            .when('/:section', {
                templateUrl: '/template/module/common/home.html',
                reloadOnSearch: false
            })
            .when('/dashboard/:section', {
                templateUrl: '/template/module/common/home.html',
                reloadOnSearch: false
            })
            .when('/dashboard/:section/:subsection', {
                templateUrl: '/template/module/common/home.html',
                reloadOnSearch: false
            })
            .when('/frontend/:section', {
                templateUrl: '/template/module/common/home.html',
                reloadOnSearch: false
            })
            .when('/frontend/:section/:subsection', {
                templateUrl: '/template/module/common/home.html',
                reloadOnSearch: false
            })
            .otherwise({
                redirectTo: '/'
            });        

        IdleProvider.idle(1200);
        IdleProvider.timeout(5);
        KeepaliveProvider.interval(10);       
    }
]);

//app.config(function(httpRequestInterceptorCacheBusterProvider){
    //old   httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*frontend.*/,/.*common.*/,/.*setup.*/]);
    //old   httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*frontend.*/,/.*common.*/,/.*setup.*/], true);
    //httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*frontend\/dashboard.*/,/.*frontend\/adminPerformance.*/,/.*common.*/], true);
//});

app.run(function($rootScope) {
    $rootScope.Keys = Object.keys;
});

var setStorageValue = function(key, value, expires) {
    if (expires===undefined || expires===null) {
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
var getValue = function(model, key, defaultValue) {
    return angular.isDefined(model) && model && angular.isDefined(model[key]) && model[key] != null ? model[key] : (angular.isDefined(defaultValue) ? defaultValue : null);
};
var getInnerValue = function(model, key, innerKey, defaultValue) {
    return (angular.isDefined(model) && model 
        && angular.isDefined(model[key]) && model[key] != null
        && angular.isDefined(model[key][innerKey]) && model[key][innerKey] != null) 
        ? model[key][innerKey] : (angular.isDefined(defaultValue) ? defaultValue : null);
};
var getTokenResetTime = function (){
    var d = new Date();
    return d.getTime();
};
var buildPaginationObjectPerSection = function(){
    var obj = {
        pageNo : 1,
        numPerPage : 10
    }
    return JSON.stringify(obj)
};
var loginCallback = function(response) {
    setStorageValue('accessToken', getValue(response, 'accessToken'), 1200);
    setStorageValue('accessTokenExpiration', getValue(response, 'accessTokenExpiration'), 1200);
    setStorageValue('email', getInnerValue(response, 'employee_detail', 'email'));
    setStorageValue('fullname', getInnerValue(response, 'employee_detail', 'full_name'));
    setStorageValue('company', getInnerValue(response, 'employee_detail', 'company_name'));
    setStorageValue('displayDetail', getInnerValue(response, 'employee_detail', 'display_detail'));
    setStorageValue('lastChangePassword', getInnerValue(response, 'employee_detail', 'lastChangePassword'));
    setStorageValue('profilePic', getInnerValue(response, 'employee_detail', 'profile_pic', 'images/no-avatar.png'));
    setStorageValue('cropType', getInnerValue(response, 'employee_detail', 'crop_type', 1));
    setStorageValue('companyLogo', getInnerValue(response, 'employee_detail', 'company_log'));
    setStorageValue('empPermissions', getInnerValue(response, 'employee_detail', 'permission_slug', []));
    setStorageValue('loginEmpId', getInnerValue(response, 'employee_detail', 'emp_id'));
    setStorageValue('loginUserId', getInnerValue(response, 'employee_detail', 'user_id'));
    setStorageValue('setupPermissions', getInnerValue(response, 'employee_detail', 'setup_permission_slug', []));
    setStorageValue('TokenCounter', 0);
    setStorageValue('tokenResetTime', getTokenResetTime());
    setStorageValue('pageNo',1);
    setStorageValue('numPerPage',10);
    setStorageValue('NewHirePageNo',1);
    setStorageValue('NewHireNumPerPage',10);
    setStorageValue('helpdeskPageNo',1);
    setStorageValue('helpdeskNumPerPage',10);
    setStorageValue('paginationObject', buildPaginationObjectPerSection());
    setStorageValue('profileField', getInnerValue(response, 'employee_detail', 'profile_field', []));
    setStorageValue('loginEmail', getInnerValue(response, 'employee_detail', 'emp_email_id'));
    setStorageValue('isSuperAdmin', getInnerValue(response, 'employee_detail', 'is_super_admin'));
    setStorageValue('empId', getInnerValue(response, 'employee_detail', 'emp_id'));
    setStorageValue('envMnt', getInnerValue(response, 'employee_detail', 'subdomain_name', 'qandle'));
    setStorageValue('hasPasswordChanged', getInnerValue(response, 'employee_detail', 'has_password_changed', false));
    setStorageValue('isExitInitiated', getInnerValue(response, 'employee_detail', 'is_exit_initiated', false));
    setStorageValue('travelPolicy', getInnerValue(response, 'employee_detail', 'system_plans_travel_expense_policy'));
    setStorageValue('isMandatoryFieldRequired', getInnerValue(response, 'employee_detail', 'mandatory_fields_required', false));
    setStorageValue('timesheetProjectManager', getInnerValue(response, 'employee_detail', 'timesheet_project_manager', false));
    setStorageValue('timesheetFollower', getInnerValue(response, 'employee_detail', 'timesheet_followers', false));
    setStorageValue('orgChartShowDownlineOnly', getInnerValue(response, 'employee_detail', 'org_chart_show_downline_only', false));
    setStorageValue('employeeCanNotApplyRegularization', getInnerValue(response, 'employee_detail', 'employee_can_not_apply_regularization', false));
    setStorageValue('pipFollower', getInnerValue(response, 'employee_detail', 'pip_followers', false));
    setStorageValue('pipEmployee', getInnerValue(response, 'employee_detail', 'assign_pips', false));
    setStorageValue('login_tc_enabled', getInnerValue(response, 'employee_detail', 'login_tc_enabled', false));
    setStorageValue('login_tc_accepted', getInnerValue(response, 'employee_detail', 'login_tc_accepted', false));
    setStorageValue('employeeCanNotApplyLeave', getInnerValue(response, 'employee_detail', 'employee_can_not_apply_leave', false));
    setStorageValue('show_only_offer', getInnerValue(response, 'employee_detail', 'show_only_offer', false));
};

var isUserLoggedIn = function() {
    return localStorage.getItem("accessToken");
};

var otpChangeHandler = function (event, otp) {
    var maxlength = 6;
    event.target.value = otp.replace(/[^0-9]/g, '');
    if (event.target.value.length > 6) {
        event.target.value = event.target.value.substring(0, maxlength);
    }
};

var loginViaActiveDirectory = function () {
    // var url = config[envMnt].activeDirectoryLogin.url,
    //     clientId = config[envMnt].activeDirectoryLogin.clientId,
    //     code = config[envMnt].activeDirectoryLogin.code,
    //     redirectUri = config[envMnt].activeDirectoryLogin.redirectUri,
    //     responseMode = config[envMnt].activeDirectoryLogin.responseMode,
    //     access = config[envMnt].activeDirectoryLogin.access,
    //     state = config[envMnt].activeDirectoryLogin.state,
    //     href = url + "?client_id=" + clientId + "&response_type=" + code
    //         + "&redirect_uri=" + redirectUri + "&response_mode=" + responseMode
    //         + "&scope=" + access + "&state=" + state;

    var url = config[envMnt].activeDirectoryLogin.url,
        clientId = config[envMnt].activeDirectoryLogin.clientId,
        response_type = config[envMnt].activeDirectoryLogin.response_type,
        redirectUri = config[envMnt].activeDirectoryLogin.redirectUri,
        responseMode = config[envMnt].activeDirectoryLogin.responseMode,
        // access = config[envMnt].activeDirectoryLogin.access,
        state = config[envMnt].activeDirectoryLogin.state,
        scope = config[envMnt].activeDirectoryLogin.scope,
        nonce = config[envMnt].activeDirectoryLogin.nonce
        href = url + "?client_id=" + clientId + "&response_type=" + response_type
            + "&redirect_uri=" + redirectUri + "&response_mode=" + responseMode
            + "&scope=" + scope + "&state=" + state + '&nonce=' + nonce ;

        window.location = href;
};

var stringToBooleanConversion = function(s) {
    // will match one and only one of the string 'true','1', or 'on' rerardless
    // of capitalization and regardless off surrounding white-space.
    var regex=/^\s*(true|1|on)\s*$/i

    return regex.test(s);
};

angular.element(document).ready(function() {
    if(isUserLoggedIn() || window.location.href.indexOf('login') >= 0 
        || window.location.href.indexOf('change-password') >= 0
        || window.location.href.indexOf('jobs') >= 0
        || window.location.href.indexOf('fnf-letters') >= 0
        || window.location.href.indexOf('demo-anytime') >= 0
        || window.location.href.indexOf('action-via-email') >= 0
        || window.location.href.indexOf('screenshot-link') >= 0
        || window.location.href.indexOf('assessment') >= 0) {
        $("#loaderSection").show();
        if (envMnt !== 'shadowfax') {
            $("#loaderSectionText").show();
            $("#poweredBy").show();
        }
        angular.bootstrap(document, ['hrApp']);
    } else {
        // Start: Login Form Submit Handler Code
        $(".sign-in-from").submit(function() {
            $("#signInSubmit").prop("disabled", true);
            $("#wrong-username").hide();

            var isLoginViaEmployeeCode = {
                    enabled: typeof config[envMnt].isLoginViaEmployeeCode != "undefined" 
                        && config[envMnt].isLoginViaEmployeeCode.enabled
                },
                loginViaRadio = $("input[name='loginViaRadio']:checked").val(),
                payload = {                
                    password: $('#login-password').val()
                };

            loginViaRadio == 1 || !isLoginViaEmployeeCode.enabled
                ? (payload.email = $('#login-email').val())
                : (payload.emp_code = $('#login-emp-code').val());
                    
            $.post(getAPIPath() + "auth/login", payload).done(function( data ) {
                $("#signInSubmit").prop("disabled", false);
                otpToken = getInnerValue(data, 'data', 'otp_token');
                if (otpToken) {
                    $('#account-bx').hide();
                    $('#account-bx-otp').show();
                    $('#login-otp').val('');
                    $('#wrong-otp').hide();
                } else {
                    loginCallback(data.data);
                    angular.bootstrap(document, ['hrApp']);
                    try {
                        if(data.data.is_candidate == false) {
                            $.ajax({
                                url: getAPIPath() + "timeattendance/employee/clockin-time",
                                type: 'GET',
                                dataType: 'json',
                                headers: {
                                    'Authorization': "Bearer " + data.data.accessToken
                                },
                                contentType: 'application/json; charset=utf-8',
                                success: function (response) {
                                    var conversionformat = "HH";
                                    var localStartTime = response.data.shift_start_timestamp ? moment(new Date(response.data.shift_start_timestamp * 1000)).format(conversionformat) : 0;
                                    var localendTime = response.data.shift_end_timestamp ? moment(new Date(response.data.shift_end_timestamp * 1000)).format(conversionformat) : 0;               
                                    var localReporting = response.data.reporting_method ? response.data.reporting_method : "";
                                    var isClockinDone = localStorage.getItem("isClockin") ? stringToBooleanConversion(localStorage.getItem("isClockin")) : null;
    
                                    var getCurrentTime = parseInt(moment(new Date()).format("HH"));
                                    var startRange = parseInt(localStartTime) - 1;
                                    var endRange = parseInt(localStartTime) + 1;
    
                                    var logoutMinus = parseFloat(localendTime) - 0.30;
                                    var logoutPlus = parseInt(localendTime) + 1;
                        
                                    var isCorrectInTime = false;
                                    if(getCurrentTime >= startRange && getCurrentTime <= endRange) {
                                        isCorrectInTime = true;
                                    }
                                    
                                    var isCorrectOutTime = false;
                                    if(getCurrentTime >= logoutMinus && getCurrentTime <= logoutPlus) {
                                        isCorrectOutTime = true;
                                    }
    
                                    if(isCorrectInTime && !isClockinDone && (localReporting == 'web' || localReporting == 'web_app')) {
                                        window.location.href = "/#/firstattendance"
                                    }
    
                                    if(isCorrectOutTime && isClockinDone && (localReporting == 'web' || localReporting == 'web_app')) {
                                        window.location.href = "/#/firstattendance"
                                    }
    
                                }
                            });
                        }
                    } catch (error) {
                        console.log(error);
                        console.log('bypass');
                    }
                    
                }
            }).fail(function(error) {
                $("#signInSubmit").prop("disabled", false);
                $("#wrong-username").show();
            });
        });
        // End: Login Form Submit Handler Code

        // Start: OTP Form Submit Handler Code
        $(".otp-from").submit(function() {
            $("#otpSubmit").prop("disabled", true);
            $("#wrong-otp").hide();
            var otp = $('#login-otp').val();

            $.post(getAPIPath() + "auth/login", {
                otp: otp ? parseInt(otp, 10) : otp,
                otp_token: otpToken
            }).done(function( data ) {
                $("#otpSubmit").prop("disabled", false);
                loginCallback(data.data);
                angular.bootstrap(document, ['hrApp']);
            }).fail(function(error) {
                $("#otpSubmit").prop("disabled", false);
                $("#wrong-otp").show();
            });
        });
        // End: OTP Form Submit Handler Code
    }

    $("#loginWithGoogle").click(function(){
        $.get(getAPIPath() + "google/login").done(function(response){
            window.location.assign(response.data);
        }).fail(function(error){
            console.log(error)
        })
    });

    $("#linkForgotPassword").click(function() {
        window.location = window.location.href + "#/login?cp=1";
        window.location.reload();
    });

    $("#linkLogin").click(function() {
        $('#account-bx-otp').hide();
        $('#account-bx').show();
    });

    $("input[name='loginViaRadio']").change(function(event) {
        $('#wrong-username').hide();
        if (event.target.value == 2) {
            $('#container-work-email').hide();
            $('#container-emp-code').show();
            $('#login-email').removeAttr("required");
            $('#login-emp-code').attr("required", true).val('').focus();
            $('#login-via-work-email').removeAttr("checked");
            $('#login-via-emp-code').attr("checked", "checked");
        } else {
            $('#container-emp-code').hide();
            $('#container-work-email').show();
            $('#login-emp-code').removeAttr("required");
            $('#login-email').attr("required", true).val('').focus();
            $('#login-via-emp-code').removeAttr("checked");
            $('#login-via-work-email').attr("checked", "checked");
        }
    });

    var isLoginViaEmployeeCode = {
        enabled: typeof config[envMnt].isLoginViaEmployeeCode != "undefined" 
            && config[envMnt].isLoginViaEmployeeCode.enabled
    },
    el = isLoginViaEmployeeCode.enabled ? $('#login-emp-code') : $('#login-email');
    
    el.attr("required", true).focus(); 
});

console.realWarn = console.warn;
console.warn = function (message) {
    if (message.indexOf("ARIA") == -1) {
        //console.realWarn.apply(console, arguments);
    }
};

app.controller('calendarCtrl', function($scope){
    var vm = this;
    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    vm.events = [
        {
            title: 'An event',
            type: 'warning',
            startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
            endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
            draggable: true,
            resizable: true
        }, {
            title: '<span class="blue">Another event</span>, with a <i>html</i> title',
            type: 'info',
            startsAt: moment().subtract(1, 'day').toDate(),
            endsAt: moment().add(5, 'days').toDate(),
            draggable: true,
            resizable: true
        }, {
            title: 'This is a really long event title that occurs on every year',
            type: 'important',
            startsAt: moment().startOf('day').add(7, 'hours').toDate(),
            endsAt: moment().startOf('day').add(19, 'hours').toDate(),
            recursOn: 'year',
            draggable: true,
            resizable: true
        }
    ];
    vm.isCellOpen = true;

    vm.eventClicked = function(event) {
        alert.show('Clicked', event);
    };
    vm.eventEdited = function(event) {
        alert.show('Edited', event);
    };
    vm.eventDeleted = function(event) {
        alert.show('Deleted', event);
    };
    vm.eventTimesChanged = function(event) {
        alert.show('Dropped or resized', event);
    };
    vm.toggle = function($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();
        event[field] = !event[field];
    };
});

app.controller('TabController', function(){
    this.tab = 1;

    this.setTab = function(newValue){
        this.tab = newValue;
    };
    this.isSet = function(tabName){
        return this.tab === tabName;
    };
});

app.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
        return date ? moment(date).format('DD/MM/YYYY') : '';
    };
  
    $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'DD/MM/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);

/*app.config(function (ScrollBarsProvider) {
    // the following settings are defined for all scrollbars unless the
    // scrollbar has local scope configuration
    ScrollBarsProvider.defaults = {
        scrollButtons: {
            scrollAmount: 'auto', // scroll amount when button pressed
            enable: true // enable scrolling buttons by default
        },
        scrollInertia: 400, // adjust however you want
        live: true,
        axis: 'yx', // enable 2 axis scrollbars by default,
        theme: '3d-dark',
        autoHideScrollbar: true,
        advanced:{
          updateOnContentResize: true
        }
    };
});*/

app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance',
    function($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);

app.directive('searchInDropdown', function ($timeout) {
    return {
        link: function (scope, element, attr) {
            element.on('keydown', function(ev) {
                ev.stopPropagation();
            });
        }
    };
});

app.directive('dontCloseMenu', function ($parse, $rootScope) {
    return {
        restrict: 'AC',
        link: function(scope, element, attrs) {
            element.find('button').attr('md-prevent-menu-close', 'md-prevent-menu-close');
        }
    }
});