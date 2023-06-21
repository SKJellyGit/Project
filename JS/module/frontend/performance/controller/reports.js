app.controller('PerformenceReportsController', [
    '$scope', '$rootScope', '$timeout', '$routeParams', '$location', '$modal', '$mdDialog', 'PerformanceReportService', 'utilityService', 'ServerUtilityService',
    function ($scope, $rootScope, $timeout, $routeParams, $location, $modal, $mdDialog, service, utilityService, serverUtilityService) {
        
        $scope.reportPerformance = {
            reportName : true,
            performanceReportList : [
                { slug_code : 'appraisal_report', name : 'Appraisal report' },
                { slug_code : 'promotion_report', name : 'Promotion Recommendation report' },
                { slug_code : 'salary_report', name : 'Salary Recommendation report' }
            ],
            performanceType : null,
            performanceTypeList : [
                { code : 11, type : "Goals"},
                { code : 12, type : "Competency"}
            ],
            setReport : null,
            reportSystem : {
                listVisible : false,
                reportDataList : {
                    data : [],
                    header : []
                }
            },
            reportlistActive : false,
            errorMessage : "",
            errorvisible : false
        }

        $scope.pagFilteredList = [];
        $scope.report = {
            content : [],
            listWithoutHeader : []
        }
        
        $scope.reviewsReportObject = {
            reviewCycleList : [],
            isListVisible : false,
            cycleRelation : {},
            cycleRelationList : [],
            isCycleVisible : false
        }
        
        var getAllReviewCycle = function () {
            var url = service.getUrl('getAllReviewCycle');
            
            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.reviewsReportObject.reviewCycleList = data.data;
                    $scope.reviewsReportObject.isListVisible = true;
                });
        };

        getAllReviewCycle()

        $scope.changeReviewCycle = function() {
            console.log()
        };

        $scope.redirectToReport = function(report) {
            $scope.reportPerformance.reportName = false;
            $scope.reportPerformance.setReport = report;
        }

        $scope.backNavigation = function() {
            $scope.reportPerformance.reportName = true;
            $scope.reportPerformance.setReport = null;
            $scope.reportPerformance.reportSystem.reportDataList = [];
            $scope.reportPerformance.reportSystem.listVisible = false;
            $scope.reportPerformance.performanceType = null;
            $scope.reviewsReportObject.cycleRelation = null;
            $scope.reviewsReportObject.cycleRelationList = [];
            $scope.reviewsReportObject.selectedCycle = null;
            $scope.reportPerformance.reportlistActive = false;
            $scope.reportPerformance.errorMessage = "";
            $scope.reportPerformance.errorvisible = false;
        }

        $scope.getCycleRelation = function(cycle) {
            $scope.reportPerformance.reportSystem.reportDataList = [];
            $scope.reportPerformance.reportSystem.listVisible = false;
            $scope.reportPerformance.reportlistActive = false;
            $scope.reviewsReportObject.cycleRelation = null;
            $scope.pagFilteredList = [];
            var url = service.getUrl('getCycleRelation') + "/" + cycle;
            
            serverUtilityService.getWebService(url)
                .then(function (data){
                    $scope.reviewsReportObject.cycleRelationList = data.data;
                    $scope.reviewsReportObject.isCycleVisible = true;
                });
        };

        $scope.buildPerformanceReport = function() {
            $scope.reportPerformance.reportSystem.reportDataList = [];
            $scope.reportPerformance.reportSystem.listVisible = false;
            $scope.reportPerformance.reportlistActive = true;
            $scope.reportPerformance.errorMessage = "";
            $scope.reportPerformance.errorvisible = false;
            var url = service.getUrl('appraisalReport');
            if($scope.reportPerformance.setReport.slug_code == 'promotion_report') {
                url = service.getUrl('promotionReport');
            } 
            if($scope.reportPerformance.setReport.slug_code == 'salary_report') {
                url = service.getUrl('salaryPromotionReport');
            }
            
            var payload = {
                "cycle_id": $scope.reviewsReportObject.selectedCycle,
                "relation": $scope.reviewsReportObject.cycleRelation,
                "type": $scope.reportPerformance.performanceType
            };

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    console.log(data.status);
                    if(data.status === 'success') {
                        $scope.reportPerformance.reportSystem.listVisible = true;
                        $scope.reportPerformance.reportSystem.reportDataList.data = data.data.data;
                        $scope.reportPerformance.reportSystem.reportDataList.header = data.data.header;
                        var finalObj = service.bulidFinalTaList(data.data.data, data.data.header);
                        if(angular.isDefined(finalObj) && finalObj.content){
                            $scope.report.content = finalObj.content;
                            $scope.report.listWithoutHeader = finalObj.listWithoutHeader;
                        }
                    } else if(data.status === 'error') {
                        $scope.pagFilteredList = [];
                        $scope.reportPerformance.reportSystem.listVisible = false;
                        $scope.reportPerformance.reportlistActive = false;
                        $scope.reportPerformance.errorMessage = data.message;
                        $scope.reportPerformance.errorvisible = true;
                    } else {
                        $scope.pagFilteredList = [];
                        $scope.reportPerformance.reportSystem.listVisible = false;
                        $scope.reportPerformance.reportlistActive = false;
                        $scope.reportPerformance.errorMessage = "Something is wrong....";
                        $scope.reportPerformance.errorvisible = true;
                    }
                });
        }

        $scope.updatePaginationSettings('performance_report_list');

        $scope.filterSet = function() {
            if($scope.reviewsReportObject.selectedCycle && $scope.reviewsReportObject.cycleRelation) {
                return false;
            } else {
                return true;
            }
        }

        $scope.exportToCsv = function(fileExtension) {
            //fileExtension = angular.isDefined(fileExtension) ? fileExtension : 'csv';
            var findCycleName = _.findWhere($scope.reviewsReportObject.reviewCycleList, { cycle_id : $scope.reviewsReportObject.selectedCycle});
            var findRelationName = _.findWhere($scope.reviewsReportObject.cycleRelationList, { slug : $scope.reviewsReportObject.cycleRelation});
            var reportName = $scope.reportPerformance.setReport.slug_code + "_" + ((findCycleName != undefined && findCycleName != null) ? (findCycleName.cycle_name.split(' ').join('_')) : $scope.reviewsReportObject.selectedCycle) + "_" + ((findRelationName != undefined) ? findRelationName.name : "Relation") + "_" + (($scope.reportPerformance.setReport.slug_code == 'appraisal_report') ? (($scope.reportPerformance.performanceType == 11) ? "goals_report" : "competency_report") : "report")  + ".csv";
            utilityService.exportToCsv($scope.report.content, reportName);

        };


    }
]);