app.controller('DashboardEventController', [
    '$scope', 'LeaveSummaryService', '$timeout', 'DashboardService', 'utilityService', 'ServerUtilityService', 
    function ($scope, summaryService,  $timeout, DashboardService, utilityService, serverUtilityService) {
        var self = this;
        self.querySearchChips = querySearchChips;
        self.filterSelected = true;  
        self.birthdayEmployee = [];   
        self.workAnniversaryEmployee = [];

        $scope.birthDayObject = DashboardService.buildBirthdayObject();
        

        var loadBirthdayCarousel = function (i) {
            $("#birthday-wid").owlCarousel(DashboardService.buildCarouselObject(i));
        };        
        var loadAnniversaryCarousel = function () {
            $("#aniversary-wid").owlCarousel(DashboardService.buildCarouselObject(i));
        };
        var eventListCallback = function (initialLoaded, section) {            
            var interval = initialLoaded ? 1000 : 0;
            $timeout(function () {
                if(section == 'birthday') {
                    $scope.birthDayObject.visible = true
                } else {
                    $scope.birthDayObject.avisible = true;
                }
                $scope.birthDayObject.section = section;
                $timeout(function () {
                    section == 'birthday' ? loadBirthdayCarousel($scope.birthDayObject.birthdayList.length) : loadAnniversaryCarousel($scope.birthDayObject.workAnniversaryList.length);                                        
                }, 10);
            }, interval);
        };        
        $scope.getTodaysEventList = function (initialLoaded, section) {
            $scope.birthDayObject.section = null;
            if(initialLoaded) {
                $scope.birthDayObject.date = new Date();  
            }
            section = angular.isDefined(section) ? section :  'birthday';
            if(section == 'birthday') {
                $scope.birthDayObject.visible = false;
                $scope.birthDayObject.birthdayList = [];
            } else {
                $scope.birthDayObject.avisible = false;
                $scope.birthDayObject.workAnniversaryList = [];
            }            
            //$scope.birthDayObject.date.setHours(00, 00, 00, 00);

            //var dateTimeStamp = Math.round(new Date($scope.birthDayObject.date)/1000),
            var dateTimeStamp = utilityService.dateToString($scope.birthDayObject.date, '-'),
                url = DashboardService.getUrl('birthdayList') + "/" + dateTimeStamp;

            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.birthDayObject.birthdayList = utilityService.getInnerValue(data, 'data', 'birthday_employee', []);
                    $scope.birthDayObject.workAnniversaryList = utilityService.getInnerValue(data, 'data', 'work_anniversary_employee', []);
                    self.birthdayEmployee = loadEmployeeList($scope.birthDayObject.birthdayList);
                    eventListCallback(initialLoaded, section);
                });
        };
        
        /************ START CHIPS INTEGRATION ***********/
        function querySearchChips(criteria, allList) {
            return criteria ? allList.filter(createFilterForChips(criteria)) : [];
        }
        function createFilterForChips(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item._lowername.indexOf(lowercaseQuery) != -1);
            };
        }
        function loadEmployeeList(items) {
            return items.map(function (c, index) {
                var item = {
                    id: c._id,
                    name: c.full_name ? c.full_name : "",
                    email: c.email,
                    image: utilityService.getValue(c, 'profile_pic') ? c.profile_pic : 'images/user-icon.png'
                };
                item._lowername = item.name.toLowerCase();
                return item;
            });
        }
        /************ END CHIPS INTEGRATION ***********/
        $scope.toggleWishEmployee = function (section){
            $scope.birthDayObject.selectedEmployee = []; 
            self.birthdayEmployee = [];
            var selectedUser = JSON.parse($(".owl-item.active.center .item").attr('data-value')),
            selctedUserArray = [];
            selctedUserArray.push(selectedUser);
            $scope.birthDayObject.heading = (section == 'birthday') ? "Wish Happy Birthday" : "Say Congrats"
            $scope.birthDayObject.message = (section == 'anniversary') 
                ? "Congrats on your work anniversary!" : "Wish you a very happy birthday!";
            $scope.birthDayObject.message += " -" + utilityService.getStorageValue('fullname');
            self.birthdayEmployee = (section == 'anniversary') 
                ? loadEmployeeList($scope.birthDayObject.workAnniversaryList) 
                : loadEmployeeList($scope.birthDayObject.birthdayList);
            $scope.birthDayObject.selectedEmployee = loadEmployeeList(selctedUserArray);
            
            $('#wish-employee').appendTo('body').modal('show');           
        };     
        
        $scope.wishEmployee = function () {
            $scope.formSubmitHandler("birthdayAnniversary", true);
            var url = DashboardService.getUrl('wishEmployee'),
                payload = DashboardService.buildWishPayload($scope.birthDayObject);

            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    $scope.formSubmitHandler("birthdayAnniversary", false);
                    if (data.status == 'success') {
                        utilityService.showSimpleToast(data.message);
                        $('#wish-employee').modal('hide');
                    } else {
                        console.log('need to handle error message');
                    }
                });
        }; 
        $scope.listBirthday =[];
        $scope.listAnnuversary =[];
        $scope.commingBirthdayAnniversary = function(){
            var url = DashboardService.getUrl('upcomingBirthdayAnniversary')
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    console.log(data.data)
                    $scope.listBirthday = data.data.birthday_employees;
                    $scope.listAnnuversary = data.data.work_anniversary_employees;
                    $timeout(function () {
                        if($scope.listAnnuversary.length <= 2) {
                            $("#workAnniversariesItemsld").owlCarousel(DashboardService.buildCarouselObjectlst($scope.listAnnuversary.length));
                        }  else {
                            $("#workAnniversariesItemsld").owlCarousel(DashboardService.buildCarouselObjectlst(3));
                        }
                        if($scope.listBirthday.length <= 2) {
                            $("#birthdayItemsld").owlCarousel(DashboardService.buildCarouselObjectlst($scope.listBirthday.length));
                        }  else {
                            $("#birthdayItemsld").owlCarousel(DashboardService.buildCarouselObjectlst(3));
                        }                                     
                    }, 3000);

                    //console.log($scope.listBirthday.length, $scope.listBirthday.length <= 2)
                    //console.log($scope.listAnnuversary)
                    // for (var i=0; i<$scope.upcommingBirthdayList.length; i++) {
                    //     if($scope.upcommingBirthdayList[i]['birthday_employees']){
                    //         var length = $scope.upcommingBirthdayList[i]['birthday_employees'].length
                    //         for (var x=0; x<length; x++){
                    //             $scope.allBlist = $scope.upcommingBirthdayList[i]['birthday_employees'][x]
                    //             $scope.allBlist.date = $scope.upcommingBirthdayList[i]['date']
                    //             $scope.listBirthday.push($scope.allBlist);
                    //         }
                    //     }else if($scope.upcommingBirthdayList[i]['work_anniversary_employees']){
                    //         var length = $scope.upcommingBirthdayList[i]['work_anniversary_employees'].length
                    //         for (var x=0; x<length; x++){
                    //             $scope.allBlistAnn = $scope.upcommingBirthdayList[i]['work_anniversary_employees'][x]
                    //             $scope.allBlistAnn.date = $scope.upcommingBirthdayList[i]['date']
                    //             $scope.listAnnuversary.push($scope.allBlistAnn);
                    //         } 
                    //     }
                    //   }
                });
            
            
        }
        $scope.commingBirthdayAnniversary()     
        
        /*********** End Birthday Section ***********/

    }
]);