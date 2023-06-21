app.controller('PotentialGridController', [
	'$scope', '$routeParams', '$modal', 'utilityService', 'ServerUtilityService', 'PotentialGridService', 
	function ($scope, $routeParams, $modal, utilityService, serverUtilityService, service) {
        var allFilterObject = service.buildAllFilterObject();  
        $scope.matrixObject = service.buildMatrixScore();
        $scope.potentialMatrix = [];      
        var cycleId = utilityService.getValue($routeParams, 'cycle_id');

        $scope.potentialgrid = service.buildOverallObject($routeParams);

        var getGridStatistics = function() {
            var url = service.getUrl('potentialGridStatistics') + "/" + cycleId;
            $scope.potentialMatrix = [];
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    $scope.potentialMatrix = data.data.matrix;
                });
        };
        getGridStatistics();

        var reBuildList = function(list) {
            angular.forEach(list, function(value, key) {
                value.revieweeFullName = utilityService.getInnerValue(value, 'reviewee', 'full_name');                
                $scope.calculateFacadeCountOfAllFilters(list, allFilterObject, value);
            });
            angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);

            return list;
        };

        var reBuildOtherRelationsObject = function () {
            $scope.potentialgrid.otherRelations.enabled = Boolean(utilityService.getStorageValue('enable_other_relations_' + cycleId));
            $scope.potentialgrid.otherRelations.object = JSON.parse(utilityService.getStorageValue('other_relations_' + cycleId));
            utilityService.rebuildReviewerNameForRelationship($scope.potentialgrid.relationship.mapping, cycleId);
            utilityService.rebuildFilterObjectForRelationship($scope.potentialgrid.relationFilterList, cycleId);
        };
        var consolidatedReviewsCallback = function(data) {
            reBuildOtherRelationsObject();
            if (utilityService.getValue(data, 'status') === 'success') {
                $scope.potentialgrid.consolidatedReviews.heads = utilityService.getInnerValue(data, 'data', 'heads', null);
                $scope.potentialgrid.consolidatedReviews.rows = reBuildList(utilityService.getInnerValue(data, 'data', 'rows', []));
            } else {
                $scope.potentialgrid.error.status = true;
                $scope.potentialgrid.error.message = utilityService.getValue(data, 'message');
            }
            
            $scope.potentialgrid.visible = true;
        }; 

        // var getGridListing = function() {
        //     var url = service.getUrl('potentialGridListing') + "/" 
        //         + utilityService.getValue($routeParams, 'cycle_id');
            
        //     serverUtilityService.getWebService(url)
        //         .then(function(data) {
                    
        //         });
        // };

        // getGridListing();

        
        var getOverallListing = function() {
            var url = service.getUrl('potentialGridListing') + "/" 
                + utilityService.getValue($routeParams, 'cycle_id');
            
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    consolidatedReviewsCallback(data);
                });
        };

        getOverallListing();

        $scope.changeGridFilter = function() {
            if($scope.potentialgrid.gridfilter.listSelected.length > 0) {
                $scope.potentialgrid.gridfilter.selected = [];
                angular.forEach($scope.potentialgrid.gridfilter.listSelected, function(val, key){
                    var setarr = $scope.matrixObject[parseInt(val) - 1];
                    $scope.potentialgrid.gridfilter.selected.push(setarr);
                })
            } else {
                $scope.potentialgrid.gridfilter.selected = [];
            }
        }

        $scope.isGridAllChecked = function () {
            if($scope.potentialgrid.gridfilter.listSelected.length == $scope.potentialgrid.gridfilter.list.length) {
                return true;
            } else {
                return false;
            }
        };
        
        $scope.isGridCheckboxClick = function (val) {
            if($scope.potentialgrid.gridfilter.listSelected.indexOf(parseInt(val)) == -1) {
                $scope.potentialgrid.gridfilter.listSelected.push(parseInt(val))
            } else {
                var index = $scope.potentialgrid.gridfilter.listSelected.indexOf(parseInt(val));
                if (index > -1) {
                    $scope.potentialgrid.gridfilter.listSelected.splice(index, 1);
                }
            }
            $scope.changeGridFilter();
        };

        $scope.isGridCheckboxExists = function (val) {
            var index = $scope.potentialgrid.gridfilter.listSelected.indexOf(parseInt(val));
            if (index > -1) {
                return true;
            } else {
                return false;
            }
        };

        $scope.selectAllGridCheckbox = function (val) {
            console.log($scope.potentialgrid.gridfilter.listSelected.length);
            console.log($scope.potentialgrid.gridfilter.list.length);
            if($scope.potentialgrid.gridfilter.listSelected.length == $scope.potentialgrid.gridfilter.list.length) {
                $scope.potentialgrid.gridfilter.listSelected = [];
            } else {
                angular.forEach($scope.potentialgrid.gridfilter.list, function(val, key){
                    var index = $scope.potentialgrid.gridfilter.listSelected.indexOf(parseInt(val.searchid));
                    if (index == -1) {
                        $scope.potentialgrid.gridfilter.listSelected.push(parseInt(val.searchid));
                    }
                })
            }
            $scope.changeGridFilter();
        } 

        $scope.gridNameValue = function(val) {
            var indexval = $scope.matrixObject.indexOf(val);
            if(indexval > -1) {
                var islist = _.findWhere($scope.potentialgrid.gridfilter.list, { searchid : parseInt(indexval) + 1});
                if(islist != undefined) {
                    return islist.name;
                } else {
                    return "NA";
                }
            } else {
                return "NA";
            }
        }
        
        $scope.filterGridSearch = function(grid){
            var strlen = $scope.potentialgrid.gridfilter.selected.length,
                str = $scope.potentialgrid.gridfilter.selected; 
            if(strlen == 9) {
                return grid.consolidated_potetial_filter == str[0] || grid.consolidated_potetial_filter == str[1] || grid.consolidated_potetial_filter == str[2] || grid.consolidated_potetial_filter == str[3] || grid.consolidated_potetial_filter == str[4] || grid.consolidated_potetial_filter == str[5] || grid.consolidated_potetial_filter == str[6] || grid.consolidated_potetial_filter == str[7] || grid.consolidated_potetial_filter == str[8];
            } else if(strlen == 8) {
                return grid.consolidated_potetial_filter == str[0] || grid.consolidated_potetial_filter == str[1] || grid.consolidated_potetial_filter == str[2] || grid.consolidated_potetial_filter == str[3] || grid.consolidated_potetial_filter == str[4] || grid.consolidated_potetial_filter == str[5] || grid.consolidated_potetial_filter == str[6] || grid.consolidated_potetial_filter == str[7];
            } else if(strlen == 7) {
                return grid.consolidated_potetial_filter == str[0] || grid.consolidated_potetial_filter == str[1] || grid.consolidated_potetial_filter == str[2] || grid.consolidated_potetial_filter == str[3] || grid.consolidated_potetial_filter == str[4] || grid.consolidated_potetial_filter == str[5] || grid.consolidated_potetial_filter == str[6];
            } else if(strlen == 6) {
                return grid.consolidated_potetial_filter == str[0] || grid.consolidated_potetial_filter == str[1] || grid.consolidated_potetial_filter == str[2] || grid.consolidated_potetial_filter == str[3] || grid.consolidated_potetial_filter == str[4] || grid.consolidated_potetial_filter == str[5];
            } else if(strlen == 5) {
                return grid.consolidated_potetial_filter == str[0] || grid.consolidated_potetial_filter == str[1] || grid.consolidated_potetial_filter == str[2] || grid.consolidated_potetial_filter == str[3] || grid.consolidated_potetial_filter == str[4];
            } else if(strlen == 4) {
                return grid.consolidated_potetial_filter == str[0] || grid.consolidated_potetial_filter == str[1] || grid.consolidated_potetial_filter == str[2] || grid.consolidated_potetial_filter == str[3];
            } else if(strlen == 3) {
                return grid.consolidated_potetial_filter == str[0] || grid.consolidated_potetial_filter == str[1] || grid.consolidated_potetial_filter == str[2];
            } else if(strlen == 2) {
                return grid.consolidated_potetial_filter == str[0] || grid.consolidated_potetial_filter == str[1] ;
            } else if(strlen == 1) {
                return grid.consolidated_potetial_filter == str[0];
            } else {
                return grid.consolidated_potetial_filter;
            }
        };

        $scope.exportToCsvPotential = function() {
            var potentialgrid = service.buildExportData($scope.potentialgrid);
            utilityService.exportToCsv(potentialgrid, 'overall--potential-rating.csv');
         };

        $scope.sortBy = function(model, propertyName) {
            model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
            model.propertyName = propertyName;
        };
    }
]);