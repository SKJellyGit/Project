app.controller('ScreenshotIndividualController', [
    '$scope', '$modal', '$mdDialog', '$routeParams', '$location', '$timeout', '$q', 'ScreenshotIndividualService', 'utilityService', 'ServerUtilityService',
    function ($scope, $modal, $mdDialog, $routeParams, $location, $timeout, $q, ScreenshotIndividualService, utilityService, serverUtilityService) {


        var routeData = {
            empId: utilityService.getValue($routeParams, 'empId'),
            rel_id: utilityService.getValue($routeParams, 'rel_id'),
            direct_reportee: utilityService.getValue($routeParams, 'direct_reportee'),
            mode: utilityService.getValue($routeParams, 'mode'),
            // start_date: utilityService.getValue($routeParams, 'start_date'),
            // end_date: utilityService.getValue($routeParams, 'end_date')

        };

        $scope.testData = [1, 2, 3, 4, 5, 3, 2]
        if (routeData.mode) {
            $scope.currentMode = (routeData.mode == 'daily-view' ? 'dailyView' : 'weeklyView')
        }
        else {
            $scope.currentMode = 'dailyView'
        }

        $scope.updatePaginationSettings('screenshot_team_individual_view');

        $scope.screenshot = ScreenshotIndividualService.buildScreenshotObject(routeData);
        $scope.screenshot.tabname = routeData.mode || 'daily-view';
        $scope.comparisonModel = ScreenshotIndividualService.buildComparisonModel(null, routeData.mode)
        $scope.plotConfig = {
            plotOptions_dataLabels_enabled: true
        }

        var getTeamList = function () {
            var url = ScreenshotIndividualService.getUrl('getMyTeam')
            var additionalParams = {
                direct_reportee: routeData.direct_reportee,
                rel_id: routeData.rel_id
            }

            serverUtilityService.getWebService(url, additionalParams).then(function (response) {
                // console.log(response.data)
                $scope.screenshot.teamList = response.data

                $scope.screenshot.employee = response.data.filter(function (employee) {
                    return employee._id == routeData.empId
                })[0]

                if ($scope.currentMode == 'dailyView') {
                    getDailyScreenshotDetails();
                }
                else {
                    getWeeklyScreenshotDetails();
                }
            })


        }

        getTeamList()

        var dailySummaryCallback = function (response) {

            $scope.screenshot.dailyView.summary = ScreenshotIndividualService.buildMiniCharts(response.data)
            $scope.screenshot.dailyView.summaryVisible = true
        }

        var dailySlotDataCallback=function (response) {
            $scope.screenshot.dailyView.slotData=ScreenshotIndividualService.buildSlotChartData(response.data)
            $scope.screenshot.dailyView.slotDataVisible = true;
            console.log('SLOT DATA : ',$scope.slotData)
        }

        var dailyBreakdownCallback = function (response) {
            $scope.screenshot.dailyView.graph = ScreenshotIndividualService.buildDailyGraphData(response.data);
            var data = ScreenshotIndividualService.buildDailyBreakdown(response.data);
            $scope.screenshot.dailyView.breakdownList = data.list;
            $scope.screenshot.dailyView.breakdownSummary = data.count;
            $scope.screenshot.dailyView.visible = true;
        };




        var getDailyScreenshotDetails = function () {

            var durationParams = ScreenshotIndividualService.buildDailyViewParams($scope.screenshot.dailyView.duration)
            var summaryUrl = ScreenshotIndividualService.getUrl('summary') + '/' + $scope.screenshot.employee._id + '/' + durationParams.from_date
            var slotDataUrl=ScreenshotIndividualService.getUrl('getSlotData')+'/'+$scope.screenshot.employee._id + '/' + durationParams.from_date
            var detailsUrl = ScreenshotIndividualService.getUrl('details') + '/' + $scope.screenshot.employee._id + '/' + durationParams.from_date + '/' + durationParams.to_date
            var additionalParams = {
                rel_id: routeData.rel_id,
                direct_reportee: routeData.direct_reportee
            };

            var summaryPromise = serverUtilityService.getWebService(summaryUrl, additionalParams)
            var slotDataPromise=serverUtilityService.getWebService(slotDataUrl,additionalParams)
            var detailsPromise = serverUtilityService.getWebService(detailsUrl, additionalParams)
            //827fd4cad95646a617ef2d9e6808f04a02ca191f 0f5f94519552a63e0bbb4decaed6826148a8b7f8
            $scope.screenshot.dailyView.visible = false;
            $scope.screenshot.dailyView.summaryVisible = false;
            $scope.screenshot.dailyView.slotDataVisible = false;

            $q.all([summaryPromise, slotDataPromise,detailsPromise]).then(function (responses) {
                //Summary
                if (responses[0].status == 'success') {

                    dailySummaryCallback(responses[0])
                }
                //Slot Data
                if(responses[1].status=='success' && !(responses[1].data instanceof Array))
                {
                    dailySlotDataCallback(responses[1])
                }
                else
                {
                    $scope.screenshot.dailyView.slotData= null
                    $scope.screenshot.dailyView.slotDataVisible = true;
                }
                //Details
                if (responses[2].status == 'success') {
                    dailyBreakdownCallback(responses[2])
                }
                else {
                    utilityService.showSimpleToast(responses[2].message)
                    $scope.screenshot.dailyView.breakdownList = [];
                    $scope.screenshot.dailyView.visible = true;
                }


            })

        };

        var navigateToNextDay = function () {
            var nextDate = ScreenshotIndividualService.addSubtractDays($scope.screenshot.dailyView.duration.fullDate, 1, '+');
            $scope.screenshot.dailyView.duration = ScreenshotIndividualService.buildDailyViewDurationObject(nextDate);
        };
        var navigateToPreviousDay = function () {
            var previousDate = ScreenshotIndividualService.addSubtractDays($scope.screenshot.dailyView.duration.fullDate, 1, '-');
            $scope.screenshot.dailyView.duration = ScreenshotIndividualService.buildDailyViewDurationObject(previousDate);
        };
        $scope.navigateToPreviousNextDay = function (action) {
            action === 'next' ? navigateToNextDay() : navigateToPreviousDay();
            getDailyScreenshotDetails();
        };


        var weeklySummaryCallback = function (response) {

            //$scope.screenshot.weeklyView.summary = response.data
            $scope.screenshot.weeklyView.summaryVisible = true
        }

        var weeklyBreakdownCallback = function (response) {
            $scope.screenshot.weeklyView.graph = ScreenshotIndividualService.buildWeeklyGraphData(response.data);
            var data = ScreenshotIndividualService.buildWeeklyBreakdown(response.data);
            $scope.screenshot.weeklyView.breakdownList = data.list;
            $scope.screenshot.weeklyView.breakdownSummary = data.count;
            $scope.screenshot.weeklyView.visible = true;
        };

        var getWeeklyScreenshotDetails = function () {

            var durationParams = ScreenshotIndividualService.buildWeeklyViewParams($scope.screenshot.weeklyView.duration)
            var detailsUrl = ScreenshotIndividualService.getUrl('details') + '/' + $scope.screenshot.employee._id + '/' + durationParams.from_date + '/' + durationParams.to_date
            var additionalParams = {
                rel_id: routeData.rel_id,
                direct_reportee: routeData.direct_reportee
            };


            $scope.screenshot.weeklyView.visible = false;

            serverUtilityService.getWebService(detailsUrl, additionalParams)
                .then(function (response) {

                    if (response.status == 'success') {
                        weeklyBreakdownCallback(response)
                    }
                    else {
                        utilityService.showSimpleToast(response.message)
                        $scope.screenshot.weeklyView.breakdownList = [];
                        $scope.screenshot.weeklyView.visible = true;
                    }
                });

        };





        var navigateToPreviousWeek = function (keyname) {
            var startDate = ScreenshotIndividualService.addSubtractDays($scope.screenshot[keyname].duration.start.fullDate, 7, '-'),
                endDate = ScreenshotIndividualService.addSubtractDays($scope.screenshot[keyname].duration.end.fullDate, 7, '-');

            $scope.screenshot[keyname].duration.start = ScreenshotIndividualService.buildDateObject(startDate);
            $scope.screenshot[keyname].duration.end = ScreenshotIndividualService.buildDateObject(endDate);
        };
        var navigateToNextWeek = function (keyname) {
            var startDate = ScreenshotIndividualService.addSubtractDays($scope.screenshot[keyname].duration.start.fullDate, 7, '+'),
                endDate = ScreenshotIndividualService.addSubtractDays($scope.screenshot[keyname].duration.end.fullDate, 7, '+');

            $scope.screenshot[keyname].duration.start = ScreenshotIndividualService.buildDateObject(startDate);
            $scope.screenshot[keyname].duration.end = ScreenshotIndividualService.buildDateObject(endDate);
        };
        $scope.navigateToPreviousNextWeek = function (action, keyname) {
            action === 'next' ? navigateToNextWeek(keyname) : navigateToPreviousWeek(keyname);
            getWeeklyScreenshotDetails()
        };

        $scope.changeEmployee = function (mode) {
            if ($scope.currentMode == 'dailyView') {
                getDailyScreenshotDetails()
            }
            else {
                getWeeklyScreenshotDetails()
            }
        }


        $scope.tabClickHandler = function (tabname) {
            $scope.screenshot.tabname = tabname;
            $scope.currentMode = tabname == 'daily-view' ? 'dailyView' : 'weeklyView'
            if (tabname === 'daily-view') {
                $scope.screenshot.dailyView.duration = ScreenshotIndividualService.buildDailyViewDurationObject();
                getDailyScreenshotDetails();
            } else {
                $scope.screenshot.weeklyView.duration = ScreenshotIndividualService.buildWeeklyViewDurationObject();
                getWeeklyScreenshotDetails();
            }
        };


        $scope.getEmployeeScreenshots = function (employeeId) {
            $scope.screenshotCarouselLoading = true
            $scope.openModal('screenshotsIndividualCarousel', 'screenshots-individual-carousel.html');
            var currentDate = ScreenshotIndividualService.buildDailyViewParams($scope.screenshot.dailyView.duration).from_date
            var url = ScreenshotIndividualService.getUrl('getScreenshotCollection') + '/' + $scope.screenshot.employee._id + '/' + currentDate
            $scope.screenshotView = null
            serverUtilityService.getWebService(url).then(function (response) {
                // console.log(response)
                employeeScreenshotCallback(response)
            })
        };

        var employeeScreenshotCallback = function (response) {
            if (response.status == 'success' && !(response.data instanceof Array)) // when empty array is being sent?  
            {
                $scope.screenshotView = ScreenshotIndividualService.buildScreenshotCarousel(response.data)
                //$scope.getNextScreenshot()
                showScreenshot()

            }
            else {
                $scope.screenshotCarouselLoading = false
                $scope.screenshotView = null

            }
          
        };

        var showScreenshot = function () {
            $scope.screenshotCarouselLoading = true
            var url = ScreenshotIndividualService.getUrl('getNthScreenshot') + '/' + $scope.screenshotView.collectionId + '/' + $scope.screenshotView.currentScreenshotNum
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

            showScreenshot()

        }

        $scope.getPreviosuScreenshot = function () {
            if ($scope.screenshotView.currentScreenshotNum - 1 < 0) {
                $scope.screenshotView.currentScreenshotNum = $scope.screenshotView.totalCount - 1
            }
            else {
                $scope.screenshotView.currentScreenshotNum -= 1
            }

            showScreenshot()
        }

        var showScreenshotCallback = function (response) {
            if (response.status == 'success') {
                $scope.screenshotView.currentScreenshotUrl = response.data.url
                $scope.screenshotView.currentScreenshotDate = response.data.created_at

            }
            else {
                console.log('Add Error Callback for screenshot')
            }
            $scope.screenshotCarouselLoading = false
        }

        $scope.navigateToComparisonPage=function () {
            
            $location.url('/screenshot-comparison-view').search({
                rel_id:routeData.rel_id,
                direct_reportee:routeData.direct_reportee
            })
        }


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
        $scope.markProductive = function () {
            var payload = $scope.screenshot[$scope.currentMode].breakdownList.map(function (app) {
                return {
                    name: app.name,
                    isProductive: app.is_productive
                }
            })

            var url = ScreenshotIndividualService.getUrl('updateProductiveStatus') + '/' + $scope.screenshot.employee._id
            serverUtilityService.putWebService(url, { apps: payload }).then(function (response) {
                getDailyScreenshotDetails()
            })
        };
        $scope.goBack = function () {
            $location.url('dashboard/my-team');
        };

        $scope.sortBy = function (model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };
        $scope.changeSelecteAllHandler = function (flag) {
            var nonIdle = 0
            angular.forEach(utilityService.getInnerValue($scope.screenshot, $scope.currentMode, 'filteredBreakdownList', []), function (app, key) {
                if (app.display_status == 1 || app.display_status == 2) {

                    app.isChecked = flag;
                    nonIdle += (flag) ? 1 : 0
                }
            });
            $scope.screenshot[$scope.currentMode].selectedCount = nonIdle
            //console.log($scope.screenshot.dailyView.selectedCount)
        };

        $scope.changeChildSelectHandler = function (flag, childProcesses) {
            var nonIdle = 0
            angular.forEach(childProcesses, function (child, key) {
                if (child.display_status != 3) {
                    child.isChecked = flag;
                    nonIdle += (flag) ? 1 : 0
                }
            });
            $scope.childProcessListing.selectedCount = nonIdle
            console.log($scope.childProcessListing.selectedCount)
        }

        var markProcessInBulkCallback = function (event, data, isParent) {
            if (utilityService.getValue(data, 'status') === "success") {
                if (!isParent) {
                    utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                    $scope.screenshot[$scope.currentMode].isChecked = false;
                    if ($scope.currentMode == 'dailyView') {
                        getDailyScreenshotDetails();
                    }
                    else {
                        getWeeklyScreenshotDetails()
                    }
                }
                else {
                    $scope.closeModal('childProcessListing')
                    utilityService.showSimpleToast(utilityService.getValue(data, 'message'));
                    $scope.screenshot[$scope.currentMode].isChecked = false;
                    if ($scope.currentMode == 'dailyView') {
                        getDailyScreenshotDetails();
                    }
                    else {
                        getWeeklyScreenshotDetails()
                    }
                }
            } else {
                showAlert(event, 'Error', utilityService.getValue(data, 'message'));
            }
        };
        var markProcessInBulk = function (event, actionType, payload, isParent) {
            url = ScreenshotIndividualService.getUrl('markProcessInBulk') + '/'
                + actionType + '/' + $scope.screenshot.employee._id

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    markProcessInBulkCallback(event, data, isParent);
                });
        };
        $scope.markProcessInBulk = function (event, actionType, isParent) {
            var payload = null
            if (!isParent) {
                payload = ScreenshotIndividualService.buildMarkProcessInBulkPayload(utilityService.getInnerValue($scope.screenshot, $scope.currentMode, 'filteredBreakdownList', []));
            }
            else {
                payload = ScreenshotIndividualService.buildMarkProcessInBulkPayload(utilityService.getValue($scope.childProcessListing, 'list', []));
            }
            markProcessInBulk(event, actionType, payload, isParent);
        };


        $scope.toggleView = function (app, flag) {
            app.isEditable = flag
            if(!flag)
            {
                app.display_status=app.def_status
            }
        };

        $scope.viewChildProcesses = function (app) {
            $scope.childProcessListing = ScreenshotIndividualService.buildChildProcessListing(app)
            $scope.openModal('childProcessListing', 'child-process-listing.html')
        }

        $scope.firstLetterCaps = function (text) {
            return text[0].toUpperCase() + text.slice(1)
        }


        $scope.updateIndividualProcessStatus = function (event, app, isParent) {
            var actionType = utilityService.getValue(app, 'display_status') === 1
                ? 'productive' : 'non-productive',
                payload = {
                    apps: [app.name]
                };

            markProcessInBulk(event, actionType, payload, isParent);
        };

        $scope.updateSelectedCount = function (app, isChild) {
            //"updateSelectedCount(child,childProcessListing.selectedCount,childProcessListing.isChecked,childProcessListing.list.length)"
            var mode = $scope.currentMode
            if (isChild) {
                if (!app.isChecked) {
                    $scope.childProcessListing.selectedCount -= 1
                }
                else {
                    $scope.childProcessListing.selectedCount += 1
                }
                if ($scope.childProcessListing.selectedCount == 0) {
                    $scope.childProcessListing.isChecked = false
                }


            }
            else {
                if (!app.isChecked) {
                    $scope.screenshot[mode].selectedCount -= 1
                }
                else {
                    $scope.screenshot[mode].selectedCount += 1
                }
                if ($scope.screenshot[mode].selectedCount == 0) {
                    $scope.screenshot[mode].isChecked = false
                }
            }


        }




        $scope.openComparisonModal = function () {
            $location.url('/screenshot-comparison-view').search({
                direct_reportee: routeData.direct_reportee,
                rel_id: routeData.rel_id
            })
        }






    }
]);