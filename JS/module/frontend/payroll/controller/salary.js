app.controller('PayrollSalaryRevisionController', [
    '$scope', '$routeParams', '$location', '$timeout', '$window', '$route', 'PayrollOverviewService', 'utilityService', 'ServerUtilityService', 'SalaryRevisionService', '$filter', 'Upload',
    function ($scope, $routeParams, $location, $timeout, $window, $route, PayrollOverviewService, utilityService, serverUtilityService, SalaryRevisionService, $filter, Upload) {
       var self = this;
       self.querySearch = querySearch;
       self.selectedItemChange = selectedItemChange;
       self.searchTextChange = searchTextChange;
       self.filterSelected = true;
       self.isDisabledEmployee = false;
       $scope.tab = 1;
       
       $scope.salary = {
           employee_id: null,
           slectedEmployee: null,
           isEditPlan: false
       };
       
       var getAllActiveUsers = function () {
           var url = SalaryRevisionService.getUrl('allUser') + "?status=true";
           serverUtilityService.getWebService(url)
                   .then(function (data){
                       self.repos = loadAll(data.data);
                   });
       };
       getAllActiveUsers();
       /******************Autocomplete Section***************************/
       function querySearch(query, searchBy) {
            return query ? self.repos.filter(createFilterFor(query, searchBy)) : self.repos;
        };
       function searchTextChange(text, model, key) {
            if (angular.isDefined(model) && model && angular.isDefined(model[key])) {
                model[key] = null;
            }
        };
        function selectedItemChange(item, model, key) {
            if (angular.isDefined(item) && item && angular.isDefined(model[key])) {
                var id = angular.isObject(item._id) ? item._id.$id : item._id;
                model[key] = id;
                $scope.salary.slectedEmployee = item;
                self.isDisabledEmployee = true;
                console.log($scope.salary.slectedEmployee);
            }
        };
        function createFilterFor(query, searchBy) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item[searchBy].indexOf(lowercaseQuery) === 0);
            };
        }
        function loadAll(list) {
            var repos = list;
            return repos.map(function (repo) {
                repo.full_name = repo.full_name.toLowerCase();
                if (angular.isDefined(repo.employee_id)) {
                    repo.employee_id = repo.employee_id.toLowerCase();
                }
                return repo;
            });
        }
       /******************Autocomplete Section***************************/
       $scope.setTab = function (tab){
           $scope.tab = tab;
       };
    }
]);