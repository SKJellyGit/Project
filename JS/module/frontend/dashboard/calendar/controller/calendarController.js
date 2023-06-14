app.controller('CalendarController', [
    '$scope', '$timeout', '$modal', '$window', '$location', '$mdDialog', '$mdToast', '$routeParams', 'CalendarService', 'utilityService', 'ServerUtilityService',
    function ($scope, $timeout, $modal, $window, $location, $mdDialog, $mdToast, $routeParams, CalendarService, utilityService, serverUtilityService) {
        var vm = this;
        vm.calendarView = 'month';
        vm.viewDate = new Date();

        $scope.graph = {
            visible: false,
            holiday: false
        };
        $scope.colorFlags = CalendarService.buildColorFlagsObject();
        $scope.filterFlags = CalendarService.buildFilterFlagsObject();
        $scope.colorClassMapping = CalendarService.buildColorClassMappingObject();
        $scope.eventsList = null;
        $scope.filterEventStatus = [1, 2, 3, 4, 5, 6, 7];
        $scope.holidayList = null;
        $scope.currentYear = null;
        $scope.currentMonth = new Date().getMonth() + 1;
        $scope.cellIsOpen = false;
        $scope.eventTypeList = CalendarService.buildFilterTypelist($scope.envMnt);
        $scope.filterFlagCount = false;
        $scope.dayDuration = CalendarService.dayDuration;
        $scope.filterEvent = {
            isCheckedAll: true
        };
        $scope.calendarObject = {
            sync_with_google_calendar: null
        };

        var todaysDate = function () {
            $scope.currentYear = new Date().getFullYear();
        };
        todaysDate();
        $scope.addEvent = function () {
            vm.events.push({
                title: 'New event',
                startsAt: moment().startOf('day').toDate(),
                endsAt: moment().endOf('day').toDate(),
                color: calendarConfig.colorTypes.important,
                draggable: false,
                resizable: true
            });
        };
        var resetFilter = function(){
            $scope.filterEventStatus = [1, 2, 3, 4, 5, 6, 7];
            if(!$scope.eventsList) {
                $scope.eventTypeList = CalendarService.buildFilterTypelist($scope.envMnt);
            } else {
                $scope.eventTypeList = $scope.eventsList.map(function(elem) {
                    return {
                        name: elem.title,
                        type: elem.type,
                        icon: $scope.colorClassMapping[elem.type].class,
                        isChecked: true
                    };
                });
            }
        };
        $scope.timespanClicked = function (date, cell) {
            if (vm.calendarView === 'month') {
                if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
                    vm.cellIsOpen = false;
                } else {
                    vm.cellIsOpen = true;
                    vm.viewDate = date;
                }
            } else if (vm.calendarView === 'year') {
                if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
                    vm.cellIsOpen = false;
                } else {
                    vm.cellIsOpen = true;
                    vm.viewDate = date;
                }
            }
        };
        var getHolidayList = function () {
            serverUtilityService.getWebService(CalendarService.getUrl('holidayList'))
                .then(function (data) {
                    $scope.holidayList = data.data;
                });
        };
        var getOneMonthData = function () {
            $scope.events = [];
            $scope.tempEvents = [];
            var url = CalendarService.getUrl('monthCal') + "/" + $scope.currentMonth + "_" + $scope.currentYear;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.calendarObject.sync_with_google_calendar = utilityService.getValue(data, 'sync_with_google_calendar', null);
                $scope.eventsList = data.data.data_count;
                angular.forEach(data.data.calender_detail, function (value, key) {
                    $scope.events.push({
                        title: value.title, // The title of the event
                        startsAt: new Date(value.startsAt * 1000), // A javascript date object for when the event starts
                        endsAt: new Date(value.endsAt * 1000),
                        // type: $scope.colorFlags[value.type], //important,success,info,warning Optional - a javascript date object for when the event ends
                        type : $scope.colorClassMapping[value.type].class,
                        val: value.type,
                        incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
                        recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
                        cssClass: 'a-css-class-name', //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
                        allDay: false // set to true to display the event as an all day event on the day view
                    });
                });

                /****** Start static google events for demo ******/
                if(envMnt == 'demo' || envMnt == 'demo1'){
                    $scope.events.push({
                        title:  'Qandle Product Demo',
                        startsAt: new Date().getTime(), // A javascript date object for when the event starts
                        endsAt: new Date().getTime(),
                        type: $scope.colorFlags[7], //important,success,info,warning Optional - a javascript date object for when the event ends
                        val: 7,
                        incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
                        recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
                        cssClass: 'a-css-class-name', //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
                        allDay: false // set to true to display the event as an all day event on the day view
                    });
                }
                /****** End static google events for demo ******/
                $scope.tempEvents = $scope.events;
                $scope.graph.visible = true;
                $scope.filterEvent.isCheckedAll ? resetFilter() : null;
            });
        };
        getOneMonthData();       
        $scope.getMonthData = function (data) {
            $scope.graph.visible = false;
            $scope.currentMonth = data.getMonth() + 1;
            $scope.currentYear = data.getFullYear();
            getOneMonthData();
            $scope.filterEvent.isCheckedAll ? resetFilter() : null;
        };
        $scope.filtIt = function (val) {
            if ($scope.filterEventStatus.length > 0) {
                angular.forEach(val, function (value, key) {
                    if ($.inArray(value.val, $scope.filterEventStatus) < 0) {
                        console.log(value.val, $scope.filterEventStatus, $.inArray(value.val, $scope.filterEventStatus));
                    } else {
                        console.log(value.val, $scope.filterEventStatus);
                    }
                })
            }
        };
        $scope.getHolidayList = function (type) {
            if (type == 1) {
                $scope.graph.visible = true;
                $scope.graph.holiday = false;
            } else {
                $(".calViews").removeClass('active');
                $scope.graph.visible = false;
                $scope.graph.holiday = true;
                getHolidayList();
            }
        };
        $scope.dateChange = function (date) {
            if (date.getFullYear() < $scope.currentYear || date.getFullYear() > $scope.currentYear) {
                $scope.currentYear = date.getFullYear();
                getOneMonthData();
            }
        };
        var setIsCheckedForSelectAll = function () {
            var selectedCount = 0;
            angular.forEach($scope.eventTypeList, function (val, key) {
                if (val.isChecked) {
                    ++selectedCount;
                }                
            });
            $scope.filterEvent.isCheckedAll = $scope.eventTypeList.length === selectedCount;
        };
        var toggleGraph = function () {
            $scope.graph.visible = false;
            $timeout(function () {
                $scope.events = $scope.tempEvents.filter($scope.eventFilter);
                $scope.graph.visible = true;
            }, 500);
        };    
        $scope.includeEventStatus = function (value) {          
            var i = $.inArray(value.type, $scope.filterEventStatus);
            if (i > -1) {
                $scope.filterEventStatus.splice(i, 1);
            } else {
                $scope.filterEventStatus.push(value.type);
            }
            
            setIsCheckedForSelectAll();
            toggleGraph();
        };
        $scope.eventFilter = function (event) {
            if ($scope.filterEventStatus.length > 0 && event.val) {
                if ($.inArray(event.val, $scope.filterEventStatus) >= 0) {
                    return true;
                }
            }
        };
        $scope.applyFilter = function () {
            $scope.filterFlagCount = false;
            angular.forEach($scope.filterFlags, function (val, key) {
                $scope.filterFlags[key] = true;
            });
            angular.forEach($scope.eventTypeList, function (val, key) {
                if (val.isChecked) {
                    $scope.filterFlagCount = true;
                }
                if (!val.isChecked) {
                    switch (parseInt(val.type)) {
                        case 1:
                            $scope.filterFlags.myLeaveFlag = false;
                            break;
                        case 3:
                            $scope.filterFlags.isNotification = false;
                            break;
                        case 4:
                            $scope.filterFlags.holidayFlag = false;
                            break;
                    }
                }
            });
            if (!$scope.filterFlagCount) {
                angular.forEach($scope.filterFlags, function (val, key) {
                    $scope.filterFlags[key] = true;
                });
            }
        };
        $scope.checkUnCheckAllEvents = function () {
            $scope.filterEventStatus = [];

            angular.forEach($scope.eventTypeList, function (val, key) {
                val.isChecked = $scope.filterEvent.isCheckedAll;
                if ($scope.filterEvent.isCheckedAll) {
                    $scope.filterEventStatus.push(val.type);
                } 
            });
            
            toggleGraph();
        };

        /***** js for calendar select date focus *****/
        $(document).on('click', '.cal-month-day', function () {
            $('.cal-month-day').removeClass("cal-open");
            $(this).addClass("cal-open");
        });

        // calendar_id
        $scope.showAlert = function(type, message) {
            var alert = $mdDialog.alert()
                .clickOutsideToClose(true)
                .title(type)
                .textContent(message)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(event);

            $mdDialog.show(alert);
        }; 
        $scope.chengeLocation = function (path){
            $location.path(path)
        }
        $scope.checkStatus = function(status, data){
            if (status == "success" && data.length > 13) {
                var message = "Your Calendar has been sync with google successfully.";
                utilityService.showSimpleToast(message);
                $location.search({'status': null, 'data' : null })
                
            } else if (status == "error")  {
                var type = "Error";
                var content  = "Verification failed due to user didn't exists in Qandle.";
                $scope.showAlert(type , content);
                $location.search({'status': null, 'data' : null })
            }
        }
        $scope.checkStatus($routeParams.status, $routeParams.data);

        $scope.getGoogleCalenderData = function (){
            serverUtilityService.getWebService(CalendarService.getUrl('googleToken'))
                .then(function (data) {
                    // console.log(data);
                    $window.open(utilityService.getValue(data, 'data'),"_self");
                });
        };
        /***** Start Angular Modal Section  *****/
        $scope.openModal = function(templateUrl, instance, size) {
            size = size || 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass : 'fadeEffect',
                size: size,
                backdrop: 'static'
            });
        };
        $scope.closeModal = function(instance) {
            if(utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        /***** End Angular Modal Section *****/

        // $scope.proceedGoogleCalender = function (){
        //     console.log("asdas");
        // }
    }
]);