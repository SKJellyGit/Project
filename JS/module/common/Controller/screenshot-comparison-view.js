app.controller('ScreenshotComparisonController', [
    '$scope', '$modal', '$mdDialog', '$routeParams', '$location', '$timeout', 'utilityService', 'ServerUtilityService','$q', 'ScreenshotComparisonService',
    function ($scope, $modal, $mdDialog, $routeParams, $location, $timeout, utilityService, serverUtilityService, $q,ScreenshotComparisonService) {
        
        console.log('COMPARISON CONTROLLER')
        //To access $routeParams
        var routeData = {
            empId: utilityService.getValue($routeParams, 'empId', null),
            rel_id: utilityService.getValue($routeParams, 'rel_id', null),
            direct_reportee: utilityService.getValue($routeParams, 'direct_reportee', null),
            mode: utilityService.getValue($routeParams, 'mode', null),
            backTo:utilityService.getValue($routeParams,'backTo',null)
        }

        $scope.currentMode = 'dailyView'
        //For maintaining pagination settings on reload
        $scope.updatePaginationSettings('listing_name');


        $scope.comparisonModel = ScreenshotComparisonService.buildComparisonObject()
        
        // self.selectedEmployee=null
       
        $scope.returnToPrevious=function () {
            window.history.back()
        }

        
        var getTeamList = function () {
            var url = ScreenshotComparisonService.getUrl('getMyTeam')
            var additionalParams = {
                rel_id: routeData.rel_id,
                direct_reportee: routeData.direct_reportee
            }
            serverUtilityService.getWebService(url, additionalParams).then(function (response) {
                if (response.status == 'success') {
                    $scope.comparisonModel.teamList=response.data
                    getTeamCallback(response)
                }
            })
        }

        var getTeamCallback = function (response) {
            $scope.teamHash = {}
            response.data.map(function (employee) {
                $scope.teamHash[employee._id] = { status: false }
            })

        }
        getTeamList()

        $scope.addCandidate=function (employee) {
            var mode = $scope.currentMode
            var durationParams = null
            if (mode == 'dailyView') {
                durationParams = ScreenshotComparisonService.buildDailyViewParams($scope.comparisonModel[mode].duration)
            }
            else {
                durationParams = ScreenshotComparisonService.buildWeeklyViewParams($scope.comparisonModel[mode].duration)
            }
            var statsUrl = ScreenshotComparisonService.getUrl('stats') + '/'
                + employee._id + '/' + durationParams.from_date + '/' + durationParams.to_date
            var summaryUrl=ScreenshotComparisonService.getUrl('summary')+'/'+employee._id+'/'+durationParams.from_date
            var slotDataUrl=ScreenshotComparisonService.getUrl('getSlotData')+'/'+employee._id+'/'+durationParams.from_date
            
            
            var additionalParams = {
                rel_id: routeData.rel_id,
                direct_reportee: routeData.direct_reportee
            }
            var newCandidate=ScreenshotComparisonService.buildDefaultCandidate(employee)
            $scope.comparisonModel[mode].candidates.push(newCandidate)

            var statsPromise=serverUtilityService.getWebService(statsUrl,additionalParams)
            var summaryPromise=mode=='dailyView'?serverUtilityService.getWebService(summaryUrl,additionalParams):null
            var slotDataPromise=mode=='dailyView'?serverUtilityService.getWebService(slotDataUrl,additionalParams):null
            
            if(mode=='dailyView')
            {
                $scope.comparisonModel.dailyView.slotChartVisible=false
                $scope.comparisonModel.dailyView.summaryVisible=false
                $q.all([summaryPromise,slotDataPromise,statsPromise]).then(function (responses) {
                    setSummary(responses[0])
                    setSlotData(responses[1])
                    addCandidateCallback(responses[2],mode)
                })
            }
            else
            {
                $q.all([statsPromise]).then(function (responses) {
                
                    addCandidateCallback(responses[0],mode)
                })
            }

        }



        var addCandidateCallback=function (response,mode) {
            if(response.status=='success' && !(response.data instanceof Array)){
                //Setting stats to last added employee
                var lastAdded=$scope.comparisonModel[mode].candidates.length-1
                $scope.comparisonModel[mode].candidates[lastAdded].stats=ScreenshotComparisonService.buildStatsObject(response.data.hours)
                
                
            }
            else
            {
                var lastAdded=$scope.comparisonModel[mode].candidates.length-1
                $scope.comparisonModel[mode].candidates[lastAdded].stats=null
                
            }
            $scope.comparisonModel[mode].candidates[lastAdded].visible=true
        }

        var setSummary=function (response) {
            var lastAdded=$scope.comparisonModel.dailyView.candidates.length-1
            if(response.status=='success')
            {
                
                $scope.comparisonModel.dailyView.candidates[lastAdded].summary=ScreenshotComparisonService.buildMiniCharts(response.data)
            }
            else
            {
                $scope.comparisonModel.dailyView.candidates[lastAdded].summary=null
            }
            console.log('SUMMARY :',$scope.comparisonModel.dailyView.candidates[lastAdded].summary)
            $scope.comparisonModel.dailyView.summaryVisible=true
        }

        var setSlotData=function (response) {
            var lastAdded=$scope.comparisonModel.dailyView.candidates.length-1
            if(response.status=='success' && !(response.data instanceof Array))
            {
                $scope.comparisonModel.dailyView.candidates[lastAdded].slotData=ScreenshotComparisonService.buildSlotChartData(response.data)
            }
            else
            {
                $scope.comparisonModel.dailyView.candidates[lastAdded].slotData=null
            }
            $scope.comparisonModel.dailyView.slotChartVisible=true
            console.log($scope.comparisonModel.dailyView.candidates[lastAdded].slotData)
        }

        $scope.removeCandidate=function (candidateIndex) {
            var mode=$scope.currentMode
            $scope.comparisonModel[mode].candidates.splice(candidateIndex,1)
            $scope.comparisonModel.selectedEmployee=null
            $scope.comparisonModel.dailyView.slotChartVisible=false
            $scope.comparisonModel.dailyView.summaryVisible=false
            $timeout(function () {
                $scope.comparisonModel.dailyView.slotChartVisible=true
                $scope.comparisonModel.dailyView.summaryVisible=true
            })

        }

        var resetComparisonModel=function () {
            $scope.comparisonModel.selectedEmployee=null
            $scope.comparisonModel[$scope.currentMode].candidates=[]
        }

    

        

        // $scope.setCandidate = function (candidateKey, employee) {
        //     var mode = $scope.currentMode
        //     $scope.comparisonModel[mode].candidates[candidateKey].visible = false
        //     //$scope.comparisonModel[mode].candidates[candidateKey].details = employee
        //     if (!$scope.teamHash[employee._id].status) {
        //         console.log('Added')
        //         $scope.teamHash[employee._id].status = true

        //     }
        //     else {
        //         console.log('Already exists')
        //     }
        //     //$scope.comparisonModel[mode].candidates[candidateKey].visible = true


        //     setCandidateStats(candidateKey, employee)



        // }

        // var setCandidateStats = function (candidateKey, employee) {
        //     var mode = $scope.currentMode
        //     var durationParams = null
        //     if (mode == 'dailyView') {
        //         durationParams = ScreenshotComparisonService.buildDailyViewParams($scope.comparisonModel[mode].duration)
        //     }
        //     else {
        //         durationParams = ScreenshotComparisonService.buildWeeklyViewParams($scope.comparisonModel[mode].duration)
        //     }
        //     var url = ScreenshotComparisonService.getUrl('stats') + '/'
        //         + employee._id + '/' + durationParams.from_date + '/' + durationParams.to_date

        //     var additionalParams = {
        //         rel_id: routeData.rel_id,
        //         direct_reportee: routeData.direct_reportee
        //     }
        //     serverUtilityService.getWebService(url, additionalParams).then(function (response) {

        //         if (response.status == 'success' && !(response.data instanceof Array)) {
        //             $scope.comparisonModel[mode].candidates[candidateKey].details = employee
        //             $scope.comparisonModel[mode].candidates[candidateKey].stats = ScreenshotComparisonService.buildStatsObject(response.data.hours)
        //         }
        //         else {
        //             $scope.comparisonModel[mode].candidates[candidateKey].details = employee
        //             $scope.comparisonModel[mode].candidates[candidateKey].stats = null
        //         }
        //         $scope.comparisonModel[mode].candidates[candidateKey].visible = true
        //     })
        // }

        // $scope.resetCandidate = function (employeeId, candidateKey) {
        //     var mode = $scope.currentMode
        //     $scope.teamHash[employeeId] = { status: false }
        //     $scope.comparisonModel[mode].candidates[candidateKey].details = null
        //     $scope.comparisonModel[mode].candidates[candidateKey].stats = null
        // }

        // var resetTeamHash = function () {
        //     Object.keys($scope.teamHash).map(function (employeeId) {
        //         $scope.teamHash[employeeId] = { status: false }
        //     })
        // }

        // var resetAllCandidates = function () {
        //     var mode = $scope.currentMode
        //     $scope.comparisonModel[mode].candidates = ScreenshotComparisonService.buildDefaultCandidates()
        //     resetTeamHash()
        // }


        var navigateToNextDay = function () {
            var nextDate = ScreenshotComparisonService.addSubtractDays($scope.comparisonModel.dailyView.duration.fullDate, 1, '+');
            $scope.comparisonModel.dailyView.duration = ScreenshotComparisonService.buildDailyViewDurationObject(nextDate);

        };
        var navigateToPreviousDay = function () {
            var previousDate = ScreenshotComparisonService.addSubtractDays($scope.comparisonModel.dailyView.duration.fullDate, 1, '-');
            $scope.comparisonModel.dailyView.duration = ScreenshotComparisonService.buildDailyViewDurationObject(previousDate);

        };
        $scope.navigateToPreviousNextDay = function (action) {
            action === 'next' ? navigateToNextDay() : navigateToPreviousDay();
            //resetAllCandidates()
            resetComparisonModel()
        };

        var navigateToPreviousWeek = function (keyname) {
            var startDate = ScreenshotComparisonService.addSubtractDays($scope.comparisonModel[keyname].duration.start.fullDate, 7, '-'),
                endDate = ScreenshotComparisonService.addSubtractDays($scope.comparisonModel[keyname].duration.end.fullDate, 7, '-');

            $scope.comparisonModel[keyname].duration.start = ScreenshotComparisonService.buildDateObject(startDate);
            $scope.comparisonModel[keyname].duration.end = ScreenshotComparisonService.buildDateObject(endDate);
        };
        var navigateToNextWeek = function (keyname) {
            var startDate = ScreenshotComparisonService.addSubtractDays($scope.comparisonModel[keyname].duration.start.fullDate, 7, '+'),
                endDate = ScreenshotComparisonService.addSubtractDays($scope.comparisonModel[keyname].duration.end.fullDate, 7, '+');

            $scope.comparisonModel[keyname].duration.start = ScreenshotComparisonService.buildDateObject(startDate);
            $scope.comparisonModel[keyname].duration.end = ScreenshotComparisonService.buildDateObject(endDate);
        };
        $scope.navigateToPreviousNextWeek = function (action, keyname) {
            action === 'next' ? navigateToNextWeek(keyname) : navigateToPreviousWeek(keyname);
            //resetAllCandidates()
            resetComparisonModel()
        };



        $scope.tabClickHandler = function (tabname) {
            $scope.comparisonModel.tabname = tabname;
            $scope.currentMode = tabname == 'daily-view' ? 'dailyView' : 'weeklyView'
            if (tabname === 'daily-view') {
                //$scope.screenshot.dailyView.duration = ScreenshotComparisonService.buildDailyViewDurationObject();
                //getDailyScreenshotDetails();
            } else {
                //$scope.screenshot.weeklyView.duration = ScreenshotComparisonService.buildWeeklyViewDurationObject();
                //getWeeklyScreenshotDetails();
            }
            //resetAllCandidates()
            resetComparisonModel()
        };



        //Add instance name in utility.js service file
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

        $scope.sortBy = function (model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };

        $scope.convertTimeStamp = function (stamp) {
            return {
                date: utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A").split(' ')[0],
                time: utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A").split(' ')[1] + ' ' + utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A").split(' ')[2]
            };
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


    }])
