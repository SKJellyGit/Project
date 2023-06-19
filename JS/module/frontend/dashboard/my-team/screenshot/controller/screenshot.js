app.controller('TeamScreenshotController', [
    '$scope', '$modal', '$mdDialog', '$routeParams', '$location', '$timeout', 'TeamScreenshotService', 'LeaveSummaryService', 'utilityService', 'ServerUtilityService',
    function ($scope, $modal, $mdDialog, $routeParams, $location, $timeout, TeamScreenshotService, summaryService, utilityService, serverUtilityService) {
        var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);
        $scope.screenshot = TeamScreenshotService.buildScreenshotObject($routeParams);
        $scope.updatePaginationSettings('screenshot_employee_team_listing_daily')
        $scope.updatePaginationSettings('screenshot_employee_team_listing_weekly')
        $scope.currentMode = 'dailyView'
        $scope.screenshotView = {};
        $scope.mdl = {
            duration: {
                slug: 'dod'
            }
        }

        var isSectionMyTeam = function () {
            return $scope.section.dashboard.team;
        };
        var buildAdditionalParams = function (params) {
            if (isSectionMyTeam()) {
                params.rel_id = $scope.relationship.primary.model._id;
                params.direct_reportee = $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false;
                if (teamOwnerId) {
                    params.emp_id = teamOwnerId;
                }
            }

            return params;
        };
        var buildGraphData = function (data, mode) {
            var graphData = [
                {
                    name: 'Productive',
                    data: []
                },
                {
                    name: 'Idle',
                    data: []
                },
                {
                    name: 'Non Productive',
                    data: []
                },
                {
                    name: 'Qandle Running Time',
                    data: []
                }
                // ,
                // {
                //     name: 'Qandle Running Time',
                //     data: []
                // }
            ],
                graphXAxis = [];

            data.map(function (item) {
                graphData[0].data.push(item.hours.productive);
                graphData[1].data.push(item.hours.idle);
                graphData[2].data.push(item.hours.non_productive);
                graphData[3].data.push(item.hours.qandle_running_time);
                graphXAxis.push(item.employee_name);
            })

            $scope.screenshot[mode].graph.data = graphData;
            $scope.screenshot[mode].graph.xAxisHeaders = graphXAxis;
        };

        /**** Start: Daily View Section ****/
        var dailyViewCallback = function (data) {
            $scope.screenshot.dailyView.list = Object.values(utilityService.getValue(data, 'data', []))
            buildGraphData($scope.screenshot.dailyView.list, 'dailyView');
            $scope.screenshot.dailyView.visible = true;
        };
        var getDailyViewData = function () {
            $scope.screenshot.dailyView.list = [];
            $scope.screenshot.dailyView.visible = false;
            var duration = TeamScreenshotService.buildDailyViewParams($scope.screenshot.dailyView.duration)
            var fromDate = duration.from_date;
            var toDate = duration.to_date;
            var url = TeamScreenshotService.getUrl('summary') + '/' + fromDate + '/' + toDate,
                params = buildAdditionalParams({});

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    dailyViewCallback(data);
                });
        };
        getDailyViewData();
        var navigateToNextDay = function () {
            var nextDate = TeamScreenshotService.addSubtractDays($scope.screenshot.dailyView.duration.fullDate, 1, '+');
            $scope.screenshot.dailyView.duration = TeamScreenshotService.buildDailyViewDurationObject(nextDate);
        };
        var navigateToPreviousDay = function () {
            var previousDate = TeamScreenshotService.addSubtractDays($scope.screenshot.dailyView.duration.fullDate, 1, '-');
            $scope.screenshot.dailyView.duration = TeamScreenshotService.buildDailyViewDurationObject(previousDate);
        };
        $scope.navigateToPreviousNextDay = function (action) {
            action === 'next' ? navigateToNextDay() : navigateToPreviousDay();
            getDailyViewData();
        };
        var loadScreenshotCarousel = function () {
            $("#lv-blnc").owlCarousel({
                items: 1,
                loop: true,
                lazyLoad: true,
                navText: ["<i class='fa fa-angle-left fa-lg'></i>", "<i class='fa fa-angle-right fa-lg'></i>"],
                pagination: false,
                nav: true,
                dots: false
            });
        };

        $scope.getEmployeeScreenshots = function (employeeId) {
            $scope.screenshotCarouselLoading = true
            $scope.openModal('screenshotsTeamCarousel', 'screenshots-team-carousel.html');
            var currentDate = TeamScreenshotService.buildDailyViewParams($scope.screenshot.dailyView.duration).from_date
            var url = TeamScreenshotService.getUrl('getScreenshotCollection') + '/' + employeeId + '/' + currentDate
            $scope.screenshotView = null
            serverUtilityService.getWebService(url).then(function (response) {
                // console.log(response)
                employeeScreenshotCallback(response)
            })
        };

        var employeeScreenshotCallback = function (response) {
            if (response.status == 'success' && !(response.data instanceof Array)) // when empty array is being sent?  
            {
                $scope.screenshotView = TeamScreenshotService.buildScreenshotCarousel(response.data)
                //$scope.getNextScreenshot()
                showScreenshot()

            }
            else {
                $scope.screenshotCarouselLoading = false
                $scope.screenshotView = null

            }




            // $timeout(function () {
            //     loadScreenshotCarousel();
            // }, 100);            
        };

        var showScreenshot = function () {
            $scope.screenshotCarouselLoading = true
            var url = TeamScreenshotService.getUrl('getNthScreenshot') + '/' + $scope.screenshotView.collectionId + '/' + $scope.screenshotView.currentScreenshotNum
            serverUtilityService.getWebService(url).then(function (response) {

                showScreenshotCallback(response)
            })
        }

        $scope.getNextScreenshot = function () {

           
            if ($scope.screenshotView.currentScreenshotNum + 1 > $scope.screenshotView.totalCount - 1) {
                $scope.screenshotView.currentScreenshotNum = 0
            }
            else {
                $scope.screenshotView.currentScreenshotNum += 1
            }
            // var url=TeamScreenshotService.getUrl('getNthScreenshot')+'/'+$scope.screenshotView.collectionId+'/'+$scope.screenshotView.currentScreenshotNum
            // serverUtilityService.getWebService(url).then(function (response) {
            //     showScreenshotCallback(response)
            // })
            showScreenshot()

        }

        $scope.getPreviosuScreenshot = function () {
            
            if ($scope.screenshotView.currentScreenshotNum - 1 < 0) {
                $scope.screenshotView.currentScreenshotNum = $scope.screenshotView.totalCount - 1
            }
            else {
                $scope.screenshotView.currentScreenshotNum -= 1
            }
            // var url=TeamScreenshotService.getUrl('getNthScreenshot')+'/'+$scope.screenshotView.collectionId+'/'+$scope.screenshotView.currentScreenshotNum
            // serverUtilityService.getWebService(url).then(function (response) {
            //     showScreenshotCallback(response)
            // })
            showScreenshot()
        }

        var showScreenshotCallback = function (response) {
            if (response.status == 'success') {
                $scope.screenshotView.currentScreenshotUrl = response.data.url
                $scope.screenshotView.currentScreenshotDate = response.data.created_at

            }
            else {
                $scope.screenshotView=null
                console.log('Add Error Callback for screenshot')
            }
            
            $scope.screenshotCarouselLoading = false
        }



        /**
         * Image Zoom feature
         * 
         * $scope.zoomed=false
            $scope.screenshotTransformOrigin='50% 50%'
            $scope.changeZoom=function ($event) {
                
                //ng-style="{'transform-origin':screenshotTransformOrigin}"
                if(!$scope.zoomed)
                {
                    var originX=(($event.offsetX/$event.target.width)*100)
                    var originY=(($event.offsetY/$event.target.height)*100)
                    $scope.screenshotTransformOrigin=originX+'% '+originY+'%'
                }
                else
                {
                    $scope.screenshotTransformOrigin='50% 50%' 
                }
                
                
                //offsetX, offsetY
                $scope.zoomed=!$scope.zoomed
            }
         */

        /**** End: Daily View Section ****/

        /**** Start: Weekly View Section ****/
        var weeklyViewCallback = function (data) {
            $scope.screenshot.weeklyView.list = Object.values(utilityService.getValue(data, 'data', []));
            buildGraphData($scope.screenshot.weeklyView.list, 'weeklyView');
            $scope.screenshot.weeklyView.visible = true;
        };
        var getWeeklyViewData = function () {
            $scope.screenshot.weeklyView.list = [];
            $scope.screenshot.weeklyView.visible = false;
            var duration = TeamScreenshotService.buildWeekViewParams($scope.screenshot.weeklyView.duration)
            var fromDate = duration.from_date
            var toDate = duration.to_date
            var url = TeamScreenshotService.getUrl('summary') + '/' + fromDate + '/' + toDate,
                params = buildAdditionalParams({});

            serverUtilityService.getWebService(url, params)
                .then(function (data) {
                    weeklyViewCallback(data);
                });
        };
        getWeeklyViewData();
        var navigateToPreviousWeek = function (keyname) {
            var startDate = TeamScreenshotService.addSubtractDays($scope.screenshot[keyname].duration.start.fullDate, 7, '-'),
                endDate = TeamScreenshotService.addSubtractDays($scope.screenshot[keyname].duration.end.fullDate, 7, '-');

            $scope.screenshot[keyname].duration.start = TeamScreenshotService.buildDateObject(startDate);
            $scope.screenshot[keyname].duration.end = TeamScreenshotService.buildDateObject(endDate);
        };
        var navigateToNextWeek = function (keyname) {
            var startDate = TeamScreenshotService.addSubtractDays($scope.screenshot[keyname].duration.start.fullDate, 7, '+'),
                endDate = TeamScreenshotService.addSubtractDays($scope.screenshot[keyname].duration.end.fullDate, 7, '+');

            $scope.screenshot[keyname].duration.start = TeamScreenshotService.buildDateObject(startDate);
            $scope.screenshot[keyname].duration.end = TeamScreenshotService.buildDateObject(endDate);
        };
        $scope.navigateToPreviousNextWeek = function (action, keyname) {
            action === 'next' ? navigateToNextWeek(keyname) : navigateToPreviousWeek(keyname);
            getWeeklyViewData();
        };
        /**** End: Weekly View Section ****/

        $scope.tabClickHandler = function (tabname) {
            $scope.screenshot.tabname = tabname;
            $scope.currentMode = tabname == 'daily-view' ? 'dailyView' : 'weeklyView'
            if (tabname === 'daily-view') {
                $scope.screenshot.dailyView.duration = TeamScreenshotService.buildDailyViewDurationObject();
                getDailyViewData();
            } else {
                $scope.screenshot.weeklyView.duration = TeamScreenshotService.buildWeeklyViewDurationObject();
                getWeeklyViewData();
            }
        };
        $scope.navigateToIndividualScreenshot = function (employeeId) {
            var teamParams = buildAdditionalParams({}),
                searchParams = {
                    empId: employeeId,
                    rel_id: teamParams.rel_id,
                    direct_reportee: teamParams.direct_reportee
                };

            if ($scope.screenshot.tabname == 'daily-view') {
                searchParams.mode = 'daily-view';
                var durationObj = $scope.screenshot.dailyView.duration
                var duration = TeamScreenshotService.buildDailyViewParams(durationObj)

                searchParams.start_date = duration.from_date
                searchParams.end_date = duration.to_date
            }
            else {
                searchParams.mode = 'weekly-view';
                var durationObj = $scope.screenshot.weeklyView.duration
                var duration = TeamScreenshotService.buildWeekViewParams(durationObj)
                searchParams.start_date = duration.from_date
                searchParams.end_date = duration.to_date
            }

            $location.url('dashboard/screenshot-individual-view').search(searchParams);
        };
        $scope.sortBy = function (object, propertyName) {
            object.reverse = (object.propertyName === propertyName) ? !object.reverse : false;
            object.propertyName = propertyName;
        };

        /***** Start: AngularJS Modal *****/
        $scope.openModal = function (instance, templateUrl, size) {
            size = size || 'lg';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function (instance) {
            if ($scope.modalInstance[instance]) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        /****** End: AngularJS Modal ******/

        // $scope.getDuration=function name(duration) {
        //     if(duration>=60) {
        //         var durationMins = Math.floor(duration * 60) % 60,
        //             durationHrs = Math.floor(duration * 60) / 60;

        //         return Math.floor(durationHrs) + 'h ' + durationMins + ' m';
        //     } else {
        //         var durationMins = Math.floor(duration * 60) % 60;                
        //         return durationMins + ' m';
        //     }
        // };
        $scope.getDuration = function name(duration) {
            if (duration >= 60) {
                var durationSecs = duration % 60//(Math.floor(duration*60)%60)==59?59:Math.ceil(duration*60)%60;
                var durationMins = duration / 60//Math.floor(duration*60)/60;
                return getMins(durationMins) + Math.floor(durationSecs) + 's';
            } else {

                var durationSecs = duration % 60
                return Math.floor(durationSecs) + 's';
            }
        };

        $scope.navigateToComparisonPage=function () {
            var params=buildAdditionalParams({})
            $location.url('/screenshot-comparison-view').search({
                rel_id:params.rel_id,
                direct_reportee:params.direct_reportee
            })
        }

        var getMins = function (mins) {
            if (mins >= 60) {
                var durationMins = mins % 60
                var durationHrs = mins / 60
                return Math.floor(durationHrs) + 'h ' + Math.floor(durationMins) + 'min ';
            }
            else {
                var durationMins = mins % 60
                return Math.floor(durationMins) + 'min '
            }
        }
        var showAlert = function (ev, title, message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
    }
]);