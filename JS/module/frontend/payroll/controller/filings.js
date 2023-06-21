app.controller('PayrollFilingsController', [
    '$scope', '$location', '$timeout', '$window', 'PayrollFilingsService', 'utilityService', 'ServerUtilityService', 
    function ($scope, $location, $timeout, $window, filingsService, utilityService, serverUtilityService) {

        $scope.filings = filingsService.buildFilingsObject();
        $scope.currentMonth = new Date().getMonth() + 1;
        $scope.currentYear = new Date().getFullYear();
        var urlSuffix = "/" + $scope.currentMonth + "/" + $scope.currentYear,
            startMonth = 4,
            endMonth = new Date().getMonth() + 1;

        var successCallback = function(data, list, section, isAdded) {
            utilityService.resetAPIError(false, null, section);
            if (angular.isDefined(data.data)) {
                isAdded ? list.unshift(data.data) : utilityService.refreshList(list, data.data); 
                utilityService.showSimpleToast(data.message);   
                $('#add-challan').appendTo("body").modal('hide');            
            }
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };        
        var successErrorCallback = function (data, list, section, isAdded) {
            data.status === "success" ? 
                successCallback(data, list, section, isAdded) : errorCallback(data, section);
        };        
        var resetErrorMessages = function () {
            $scope.errorMessages = [];
        };
        $scope.resetAPIError = function (status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };

        /*************** Start Upload File Section ***************/
        $scope.removeUpload = function(item){
            item.isMultipleUploaded = false;
            item.files = null;
        };
        $scope.bindMultipleFileChangeEvent = function(item) {
            $timeout(function() {
                $("input[type=file]").on('change',function(){
                        item.isMultipleUploaded = true;
                    });
            }, 100);            
        };
        $scope.setFileObject = function(files, item){
            item.files = files;
        };
        $scope.viewDownloadDocument = function(item, documentId, type) {
            var url = filingsService.getUrl('viewDocument');
            $scope.viewDownloadFileUsingForm(url + "/" + item._id + "/" + documentId + "/" + type + "/view");
        };
        /*************** End Upload File Section ***************/


        /************ Start Provident Fund Section ***********/
        $scope.viewPFChallanFlag = false;
        $scope.viewPFChallanID = null;        
        var getProvidentFundDetails = function () {
            var url = filingsService.getUrl('pf') + urlSuffix;
            serverUtilityService.getWebService(url).then(function (data) {                
                angular.forEach(data.data, function (value, key){
                    value.isChecked = false;
                    value.isMultipleUploaded = utilityService.getValue(value, 'challan_documents') ? true : false;
                });
                $scope.filings.pf.list = data.data;
            });
        };
        getProvidentFundDetails();
        var convertToZero = function(value) {
            var res = isNaN(value) || !value ? 0 : value;
            return res;
        };
        $scope.calculateParticularSubTotal = function(item) {
            var ac01 = parseInt(convertToZero(item.ac01), 10),
                ac02 = parseInt(convertToZero(item.ac02), 10),
                ac10 = parseInt(convertToZero(item.ac10), 10),
                ac21 = parseInt(convertToZero(item.ac21), 10),
                ac22 = parseInt(convertToZero(item.ac22), 10);

            item.total = ac01 + ac02 + ac10 + ac21 + ac22;
                
            return item.total; 
        };
        $scope.calculateParticularTotal = function() {
            var total = 0;
            angular.forEach($scope.filings.pf.challan.particulars, function(value, key) {
                total = total + parseInt(convertToZero(value.total), 10);
            });
            $scope.filings.pf.challan.total = total;
            return total;
        };        
        $scope.toggleChallan =function(item,key) {
            if(angular.isDefined(item)){
                $scope.viewPFChallanID = item._id;
            }
            if(angular.isDefined(item.pf_challan) && key == 'view'){
                $scope.viewPFChallanFlag = true;
                $scope.filings.pf.challan = item.pf_challan;
            }

            if(!angular.isDefined(item.pf_challan) && key == 'add'){
                $scope.viewPFChallanFlag = false;
                $scope.filings.pf.challan = filingsService.buildChallanObject();
            }
            toggleModal('add-challan', true);
        };
        var toggleModal = function(id, flag) {
            flag ? $('#' + id).appendTo("body").modal({
                    backdrop: 'static',
                    keyboard: false, 
                    show: true
                }) 
                : $('#' + id).modal('hide');
        };
        $scope.addPFChallan = function(){
            var url = filingsService.getUrl('pfchallan') + "/" + $scope.viewPFChallanID;
            serverUtilityService.postWebService(url, $scope.filings.pf.challan)
                .then(function(data) {
                    successErrorCallback(data, $scope.filings.pf.list, "pf", false);
                });
        };
        $scope.updateFilingStatus = function(item, type) {
            var url = filingsService.getUrl('changeStatus') + "/" + item._id + "/" + type,
                payload = {
                    submitted_on: filingsService.getCurrentDate()
                };
            
            serverUtilityService.patchWebService(url, payload)
                .then(function(data) {
                    item.status = item.status == 1 ? 2 : 1;
                    utilityService.showSimpleToast(data.message); 
                });
        };
        $scope.generateECR = function(item, ecrType) {
            var url = filingsService.getUrl('ecr');
            $scope.viewDownloadFileUsingForm(url + "/" + item._id + "/" + $scope.currentYear + "/" + $scope.currentMonth + "/" + ecrType + "/download");
        };
        $scope.selectAllList = function (key, isAll){
            var list = $scope.filings[key].list;
            angular.forEach(list, function (value, key){
                value.isChecked = isAll;
            });
        };
        /************ End Provident Fund Section ***********/
        
        /************ Start ESI Section ***********/
        var getEsiDetails = function () {
            var url = filingsService.getUrl('esi') + urlSuffix;
            serverUtilityService.getWebService(url).then(function (data) {                
                angular.forEach(data.data, function (value, key){
                    value.isChecked = false;
                    value.isMultipleUploaded = utilityService.getValue(value, 'challan_documents') ? true : false;
                });
                $scope.filings.esi.list = data.data;
            });
        };
        getEsiDetails();
        $scope.updateESIFilingStatus = function(item) {
            var url = filingsService.getUrl('pfFilingStatus') + "/" + item._id,
                payload = {
                    submitted_on: filingsService.getCurrentDate()
                };
            
            serverUtilityService.patchWebService(url, payload)
                .then(function(data) {
                    item.status = item.status == 1 ? 2 : 1;
                    utilityService.showSimpleToast(data.message); 
                });
        }; 
        /************ End ESI Section ***********/


        /************ Start LWF Section ***********/     
        var getLwfDetails = function () {
            var url = filingsService.getUrl('lwf') + urlSuffix;
            serverUtilityService.getWebService(url).then(function (data) {                
                angular.forEach(data.data, function (value, key){
                    value.isChecked = false;
                    value.isMultipleUploaded = utilityService.getValue(value, 'challan_documents') ? true : false;
                });
                $scope.filings.lwf.list = data.data;
            });
        };
        getLwfDetails(); 
        /************ End LWF Section ***********/


        /************ Start Professional Tax Section ***********/       
        var getProfessionalTaxDetails = function () {
            var url = filingsService.getUrl('pt') + urlSuffix;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.filings.pt.list = data.data;
                angular.forEach($scope.filings.pt.list, function (value, key){
                    value.isMultipleUploaded = utilityService.getValue(value, 'challan_documents') ? true : false
                });
            });
        };
        getProfessionalTaxDetails();
        $scope.updatePTFilingStatus = function(item){
            var url = filingsService.getUrl('ptFilingStatus') + "/" + item._id,
                payload = {
                    submitted_on: filingsService.getCurrentDate()
                };
            
            serverUtilityService.patchWebService(url, payload)
                .then(function(data) {
                    item.status = item.status == 1 ? 2 : 1;
                    utilityService.showSimpleToast(data.message); 
                    //successErrorCallback(data, $scope.filings.pt.list, "pt", false);
                });
        };
        /************ End Professional Tax Section ***********/        


        /************ Start IT Section ***********/       
        var getIncomeTaxChallanDetails = function () {
            var url = filingsService.getUrl('incomeTaxChallan') + urlSuffix;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.filings.incomeTax.list.challan = data.data;
                angular.forEach($scope.filings.incomeTax.list.challan, function (value, key){
                    value.isMultipleUploaded = utilityService.getValue(value, 'challan_documents') ? true : false
                });
            });
        };
        getIncomeTaxChallanDetails();
        var getIncomeTaxReturnDetails = function () {
            var url = filingsService.getUrl('incomeTaxReturn') + urlSuffix;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.filings.incomeTax.list.return = data.data;
            });
        };
        getIncomeTaxReturnDetails();
        $scope.updateITFilingStatus = function(item){
            var url = filingsService.getUrl('incomeTaxFilingStatus') + "/" + item._id,
                payload = {
                    submitted_on: filingsService.getCurrentDate(),
                    amount_paid: item.amount_paid
                };
            
            serverUtilityService.patchWebService(url, payload)
                .then(function(data) {
                    item.status = item.status == 1 ? 2 : 1;
                    utilityService.showSimpleToast(data.message); 
                    //successErrorCallback(data, $scope.filings.incomeTax.list.challan, "incomeTax", false);
                });
        };
        /************ End IT Section ***********/


        /************ Start Bonus Section ***********/       
        var getBonusDetails = function () {
            var url = filingsService.getUrl('bonus') + urlSuffix;
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.filings.bonus.list = data.data;
                angular.forEach($scope.filings.bonus.list, function (value, key){
                    value.isChecked = false;
                });
            });
        };
        getBonusDetails();
        /************ End Bonus Section ***********/
        
        
        /************ Start UPLOAD CHALLAN SECTION ************/
        var uploadSuccessCallback = function (list, data, section) {            
            utilityService.showSimpleToast(data.message);
            if(section == "pf") {
                getProvidentFundDetails();
            } else if(section == "esi") {
                getEsiDetails();
            } else if(section == "pt") {
                getProfessionalTaxDetails();
            } else if(section == "it_challan") {
                getIncomeTaxChallanDetails();
            }
        };
        var uploadErrorCallBack = function (list, data) {
            
        };
        var uploadSuccessErrorCallback = function (list, data, section){
            data.status == 'success' ? uploadSuccessCallback(list, data, section) : uploadErrorCallBack(list, data);
        };
        $scope.uploadDocuments = function (item, list, section){
            var url = filingsService.getUrl('uploadChallan') + "/" + item._id + "/" + section,
                payload = {
                    files: item.files
                };

            serverUtilityService.uploadWebService(url, payload)
                .then(function(data) {
                    uploadSuccessErrorCallback(list, data, section);
                });
        };
        /************ End UPLOAD CHALLAN SECTION ************/
               

        /************ Start CALENDER Section ************/
        var vm = this;
        $scope.colorFlags = {
            1: "success",
            2: "warning",
            3: "important",
            4: "info",
            5: "Notify",
            6: "Optional"
        };
        $scope.events = [];        
        $scope.isCalenderVisible = false;
        vm.calendarView = 'month';
        vm.viewDate = new Date();
        vm.isCellOpen = true;
        $scope.totalDue = 0;        

        var isCompliancesStatusDue = function(startsAt, endsAt) {
            var d = new Date(),
                time = d.getTime();

            return startsAt*1000 >= time && startsAt == endsAt;
        };
        var getCalendarDetails = function () {
            $scope.events = [];
            $scope.isCalenderVisible = false;
            var url = filingsService.getUrl('calender') + "/" + $scope.currentMonth;
            serverUtilityService.getWebService(url).then(function (data) {
                angular.forEach(data.data, function (value, key) {
                    $scope.events.push({
                        title: value.title, // The title of the event
                        startsAt: new Date(value.startsAt * 1000), // A javascript date object for when the event starts
                        endsAt: new Date(value.endsAt * 1000),
                        type: "warning", //important,success,info,warning Optional - a javascript date object for when the event ends
                        val: value.type,
                        incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
                        recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
                        cssClass: 'a-css-class-name', //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
                        allDay: false // set to true to display the event as an all day event on the day view
                    });
                    $scope.totalDue ++;
                });
                $scope.isCalenderVisible = true;
            });
        };
        getCalendarDetails();
        $scope.isPreviousDisabled = function(date) {
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                currYear = utilityService.getCurrentYear(),
                isDisabled = true;
            
            if(year == currYear) {
                isDisabled = false;
            } else if(year < currYear && year > utilityService.startYear) {
                isDisabled = false;
            } else if(year == utilityService.startYear && month > utilityService.startMonth) {
                isDisabled = false;
            }

            $scope.currentMonth = month;
            $scope.currentYear = year;
            
            return isDisabled;
            //return date.getMonth() + 1 <= startMonth;
        };
        $scope.isNextDisabled = function(date) {
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                currYear = utilityService.getCurrentYear(),
                currentMonth = utilityService.getCurrentMonth(),
                isDisabled = false;

            if(year == currYear && month >= currentMonth) {
                isDisabled = true;
            }

            $scope.currentMonth = month;
            $scope.currentYear = year;

            return isDisabled;
            //return date.getMonth() + 1 >= endMonth;
        };
        var reloadStatutoryComplainces = function() {
            urlSuffix = "/" + $scope.currentMonth + "/" + $scope.currentYear;
            getProvidentFundDetails();
            getEsiDetails();
            getLwfDetails();
            getProfessionalTaxDetails();
            getIncomeTaxChallanDetails();
            getIncomeTaxReturnDetails();
            getBonusDetails();
        }; 
        $scope.getMonthData = function (date) {
            $scope.currentMonth = date.getMonth() + 1;
            getCalendarDetails();
            reloadStatutoryComplainces();
        };
        /************ End CALENDER Section ************/
        $scope.viewDownloadProof = function (item) {
            var url = filingsService.getUrl('download_itr');
            $scope.viewDownloadFileUsingForm(url);
        };
    }
]);