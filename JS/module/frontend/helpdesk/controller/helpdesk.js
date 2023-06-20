app.controller('FrontEndHelpDeskController', [
    '$scope','$routeParams', '$location', '$timeout', '$window', '$route', '$q', 'FrontHelpDeskService', 'utilityService', 'ServerUtilityService', 'Upload', '$modal',
    function ($scope, $routeParams, $location, $timeout, $window, $route, $q, FrontHelpDeskService, utilityService, serverUtilityService, Upload, $modal) {
        var self = this, 
            cachedQuery, 
            lastSearch, 
            cachedOffer, 
            lastSearchOffer, 
            cachedSignAuth, 
            lastSearchSignAuth;
    
        var allFilterObject = [
            {countObject: 'group', isGroup: true, collection_key: 'issuer_detail'},
            {countObject: 'priority', isArray: false, key: 'priority'}];

        self.signAuthSelected = true;
        self.querySearchSignAuth = querySearchSignAuth;
        self.querySearchOwnerSignAuth = querySearchOwnerSignAuth;
        self.signAuth = [];
        self.alsoNotify = [];
        
        $scope.apiError = utilityService.buildAPIErrorObject();
        $scope.errorMessages = [];
        $scope.filterPriority = [];
        $scope.filterDurationStatus = [];
        $scope.priority_filter = [];
        $scope.ticketFilter = [];
        $scope.allCategory = null;
        $scope.subCategory = null;
        $scope.priorityList = null;
        $scope.globalSettings = null;
        $scope.employeeList = null;
        $scope.setupOwnerList = [];
        $scope.ticketDetail= null;
        $scope.allTickets = [];
        $scope.allTicketsFiltered = [];
        $scope.replyFlag = false;
        $scope.adminEmpView = [];
        $scope.adminViewTickets = [];
        $scope.adminOwnerView = [];
        $scope.replyAndCloseFlag = false;
        $scope.orderByField = 'category';
        $scope.orderByOwnerField = 'owner_name';
        $scope.orderByEmployeeField = 'ticket_id';
        $scope.orderByEmpField = 'ticket_id';
        $scope.reverseSort = true;
        $scope.onlyReply = true;
        $scope.internal = false;
        $scope.selectTicketList ={
            isCheck:false
        };
        $scope.selectedTickets = {};
        $scope.selectedTicketsCount = 0;
        $scope.duration = FrontHelpDeskService.buildDateObject();
        $scope.ticketStatus = FrontHelpDeskService.buildTicketStatusObject();
        $scope.ticketStatusDue = FrontHelpDeskService.statusDueObject();
        $scope.priorityColor = FrontHelpDeskService.priorityObject();
        $scope.commentTypeHashMap = {
            'employee': 3,
            'admin' : 4,
            'manager': 1
        };     
        $scope.adminViewFilter = {
            filteredItems : [],
            originalItems: []
        };
        $scope.ownerViewFilter = {
            filteredItems : [],
            originalItems: []
        };
        $scope.togglePlus = false;        
        $scope.reply = {
            attachment:null,
            val: null,
            flag: false
        };
        $scope.subject = {
            catSubj:null,
            subCatSubj: null
        };
        $scope.managerReply = {
            comment:null,
            closeTicket:false,
            close_due_to:1,
            selected:0,
            reply_attachment: null
        };
        $scope.adminView = {
            selected:0,
            isSelected: false
        };
        $scope.helpdeskAll = {
            isEmpVisible: false,
            isAdminVisible: false,
            isManagerVisible: false,
            isOwnerVisible: false
        };
        if ($routeParams.isAdminEmp) {
            $scope.adminView = {
                selected: 2,
                isSelected: true
            };
        }
        if($scope.adminView.isSelected){
            $location.search('isAdminEmp', null);
        }
        $scope.initDate = {
            from: null,
            to: null
        };         
        $scope.ticketId = angular.isDefined($routeParams.ticketId)?$routeParams.ticketId:null;
        $scope.isAdminView = angular.isDefined($routeParams.flag)?$routeParams.flag:false;
        $scope.status = {
            1:'Pending',
            2:"Closed"
        };
        $scope.unit = {
            1:'Day',
            2:"Hour"
        };
        $scope.resolutionDuration = FrontHelpDeskService.buildResolutionDurationObject();
        $scope.searchByOwner = {
            owner_name: ''
        };
        $scope.employeeView = {
            filteredItems: []
        };
        $scope.pocManager = {
            filteredList: []
        };
        $scope.searchByCat = {
            category: ''
        };
        $scope.adminEmployeeView = {
            visible: false
        };

        var calculateCount = function(count,ticket) {
            count.total++;
            if(ticket.status == 1) {
                if(ticket.resolution_tat_unit == 1) {
                    var date2 = new Date();
                    var timeDiff = Math.abs(date2.getTime()/1000 - ticket.raised_date);
                    var diffDays = Math.ceil(timeDiff / ( 3600 * 24));  
                    if(ticket.resolution_tat_time < diffDays) {
                        count.pending_over_tat++;
                    } else {
                        count.pending_in_tat++;
                    }
                } else {
                    var raised_time  = ticket.raised_date;
                    var current_time =  new Date();
                    var diff = current_time.getTime()/1000 - raised_time;
                    var diff_in_hrs = Math.ceil(diff/3600);
                    if(diff_in_hrs > ticket.resolution_tat_time) {
                        count.pending_over_tat++;
                    } else {
                        count.pending_in_tat++;
                    } 
                }
            } else {
                if(ticket.resolution_tat_unit == 1) {
                    var timeDiff = Math.abs(ticket.closed_date - ticket.raised_date);
                    var diffDays = Math.ceil(timeDiff / ( 3600 * 24));  
                    if(ticket.resolution_tat_time < diffDays) {
                        count.closed_over_tat++;
                    } else {
                        count.closed_in_tat++;
                    }
                } else {
                    var raised_time  = ticket.raised_date;
                    var closed_date =  ticket.closed_date;
                    var diff = closed_date - raised_time;
                    var diff_in_hrs = Math.ceil(diff/3600);
                    if(diff_in_hrs > ticket.resolution_tat_time) {
                        count.closed_over_tat++;
                    } else {
                        count.closed_in_tat++;
                    }
                }
            }
        };   
        $scope.countTicketViewFilter = function(ticket){
            var count = { 
                closed_in_tat : 0,
                closed_over_tat : 0,
                pending_in_tat : 0,
                pending_over_tat : 0,
                total : 0
            };
            if(Object.keys($scope.filterIncludes).length>0) {
                angular.forEach(ticket.category_tickets,function(v, k) {
                    var flag = true;
                    angular.forEach($scope.filterIncludes, function(value, key) {
                        if ( angular.isDefined($scope.filterIncludes[key]) && $scope.filterIncludes[key].length > 0) {
                            if ($window._.intersection(v.emp_details[key], $scope.filterIncludes[key]).length == 0){
                                flag = false;
                            }
                        }                    
                    }); 
                    flag ? calculateCount(count, v) : delete ticket.category_tickets[k];
                });                
            } else {
                angular.forEach(ticket.category_tickets,function(v,k){
                    calculateCount(count, v);
                });
            }
            ticket.total = count.total;
            ticket.pending_in_tat = count.pending_in_tat;
            ticket.pending_over_tat = count.pending_over_tat;
            ticket.closed_in_tat = count.closed_in_tat;
            ticket.closed_over_tat = count.closed_over_tat;
            if(count.total == 0) {
                return 
            } else {
                return ticket;
            }            
        };        
        $scope.includeDurationStatus = function (value) {
            $scope.filterDurationStatus = [];
            var i = $.inArray(value.label, $scope.filterDurationStatus);
            if (i > -1) {
                $scope.filterDurationStatus.splice(i, 1);
            } else {
                if (angular.isDefined(value.label)){
                    $scope.filterDurationStatus.push(value.label);
                }
            }
        };
        var getGlobalSetting = function () {
            var url = FrontHelpDeskService.getUrl('getGlobalSet');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.globalSettings = data.data;
                    $scope.globalSettingsPriority = data.data.priority;
                });
        }; 
        getGlobalSetting();
        $scope.getPriorityName = function(item) {
            var pName = null;
            angular.forEach($scope.globalSettingsPriority, function(val, key) {
                if(item && val.priority == item.priority){
                    pName = val.phrase;
                }
            });

            return pName;
        };
        $scope.durationFilter = function (issue) {
            if (issue.raised_date && ($scope.filterDurationStatus.length > 0)) {
                var raised_date = utilityService.getDefaultDate(issue.raised_date, false, true);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - raised_date.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if (Math.max.apply(Math, $scope.filterDurationStatus) < diffDays)
                    return;

            }
            if ($scope.filterDurationStatus.length > 0 && !issue.raised_date) {
                return;
            }
            return issue;
        };        
        $scope.includeTicketStatusFilter = function (value) {
            var i = $.inArray(value.refrence, $scope.ticketFilter);
            if (i > -1) {  
                $scope.ticketFilter.splice(i, 1);
            } else if(value.refrence == 2 && value.isChecked == false) {
                angular.forEach($scope.ticketStatus[2].label, function (v, k) {
                    v.isChecked = false;
                    var j = $.inArray(v.refrence, $scope.ticketFilter);
                    $scope.ticketFilter.splice(j, 1);
                });
            } else {
                if (value.refrence == 2 && value.isChecked == true) {
                    angular.forEach($scope.ticketStatus[2].label, function (v, k) {
                        v.isChecked = true;
                        $scope.ticketFilter.push(v.refrence);
                    });
                } else {
                    $scope.ticketFilter.push(value.refrence);
                }
                $scope.ticketFilter = $scope.ticketFilter.filter (function (value, index, array) { 
                    return array.indexOf (value) == index;
                });
            }
        };        
        $scope.ticketStatusFilter = function (issue) {
            var tatDays = 0;
            var overTATDays = 0;
            if (issue.raised_date && ($scope.ticketFilter.length > 0)) {
                var raised_date = utilityService.getDefaultDate(issue.raised_date, false, true);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - raised_date.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if(issue.resolution_tat_unit == "2") {
                    tatDays = Math.ceil(parseInt(issue.resolution_tat_time) / (24));
                } else {
                    tatDays = parseInt(issue.resolution_tat_time);
                }
                if (tatDays < diffDays) {
                    overTATDays = diffDays - tatDays;
                }
                for (var i = 0; i < $scope.ticketFilter.length; i++) {
                    if ($scope.ticketFilter[i] == 1) {
                        if (issue.status == 1 && !issue.pending_duration) {
                            return issue;
                        }
                    }
                    if ($scope.ticketFilter[i] == 0) {
                        if (issue.status == 2) {
                            return issue;
                        }
                    }
                    if($scope.ticketFilter[i] >= 2){
                        var start = $scope.ticketStatusDue[$scope.ticketFilter[i]].start;
                        var end = $scope.ticketStatusDue[$scope.ticketFilter[i]].end;
                        if(start<=overTATDays && end>=overTATDays && issue.status == 1 && issue.pending_duration){
                            return issue;
                        }
                    }                    
                }
            } else {
                return issue;     
            }
        };
        $scope.isReopen = false;
        var isTicketReopenable = function (data){
            if(angular.isDefined(data.closed_date) && $scope.globalSettings.can_reopen){
                var closed_date = utilityService.getDefaultDate(data.closed_date, false, true);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - closed_date.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if(parseInt($scope.globalSettings.reopen_days) >= diffDays){
                    $scope.isReopen = true;
                }
            }
        };
        $scope.routeFlag = $routeParams.flag;
        $scope.ticketDetails = function(item,flag){
            var isAdmin = flag ? 1 : 0;
            $scope.commentTypeFlag = isAdmin;
            $location.url('dashboard/ticket-details').search({
                "ticketId" : item._id,
                "flag" : isAdmin});
        };
        $scope.managerTicketDetails = function(item){
            // $location.url('frontend/manager-ticket').search({"ticketId": item._id});
            var path = 'frontend/manager-ticket?ticketId=' + item._id,
                basePath = window.location.href.substr(0, window.location.href.indexOf('#') + 1),
                fullPath = basePath + path;
            $window.open(fullPath, '_blank');
        };
        var makeObjects = function (data,element) {
            var arr = [];
            angular.forEach(data, function (val, key) {
                var obj = {};
                if(element == 'owner'){
                    obj.id = utilityService.getValue(val, '_id');
                    obj.name = utilityService.getValue(val, 'full_name');
                    obj.image = utilityService.getValue(val, 'image', "images/avatar.png");
                } else {
                    obj.id = utilityService.getValue(val, 'id');
                    obj.name = utilityService.getValue(val, 'name');
                    obj.image = utilityService.getValue(val, 'image', "images/avatar.png");
                }
                arr.push(obj);
            });
            return arr;
        };
        if($scope.ticketId){
            $q.all([
                serverUtilityService.getWebService(FrontHelpDeskService.getUrl('getGlobalSet')),
                serverUtilityService.getWebService(FrontHelpDeskService.getUrl('ticketDetails')+"/"+$scope.ticketId)
            ]).then(function (data) {
                $scope.globalSettings = data[0].data;
                $scope.ticketDetail = data[1].data;
                if (angular.isDefined($scope.ticketDetail.owner_detail)) {
                    self.signAuth = makeObjects($scope.ticketDetail.owner_detail,'owner');
                } 
                if (angular.isDefined($scope.ticketDetail.also_notify_employee)) {
                    self.alsoNotify = makeObjects($scope.ticketDetail.also_notify_employee,'notify');
                }
                isTicketReopenable(data[1].data);
                $scope.setupOwnerList = data[1].data.cat_owner_detail;
                if($scope.setupOwnerList.length){
                    self.allOwnerSignAuth = loadOwnerSignAuth();
                }
                $scope.updateTicketPayload.rating = data[1].data.rating;
                $scope.updateTicketPayload.comment = data[1].data.rating_comment;
            });
        }        
        var syncHelpDeskModel = function (model) {
            $scope.tickeInfo = FrontHelpDeskService.createTicketModel(model);
        };
        syncHelpDeskModel();
        var getAllCategory = function(){            
            var url = FrontHelpDeskService.getUrl('getAllCategory');
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.allCategory = data.data;
            });
        };
        getAllCategory();        
        $scope.getSpecificCategory = function(item){
            $scope.tickeInfo.subcategory = null;
            $scope.subject = {
                catSubj:null,
                subCatSubj: null
            };
            $scope.subject.catSubj = item.description;
            var url = FrontHelpDeskService.getUrl('getOneCategory') + "/" + item._id;
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    $scope.subCategory = data.data.sub_category;
                    $scope.tickeInfo.priority = angular.isDefined(data.data.priority) ? data.data.priority : null;
                });
        };        
        var getPriority = function () {
            var url = FrontHelpDeskService.getUrl('getPriority');
            serverUtilityService.getWebService(url)
                .then(function (data) {
                    angular.forEach(data, function (value, k){
                        value.priority = value.priority.toString();
                    });
                    $scope.priorityList = data;
                });
        }; 
        getPriority();
        var getEmployeeObj = function(data){
            var arr = [];
            angular.forEach(data,function(val,key){
                if(angular.isDefined(val.employee_detail) && val.full_name){
                    arr.push({
                        _id : angular.isObject(val._id) ? val._id.$id : val._id,
                        full_name : val.full_name,
                        email : utilityService.getValue(val, 'email')
                    });
                }
            });
        
            return arr;
        };
        var getEmployeeDetails = function () {
            var url = FrontHelpDeskService.getUrl('getEmployee') + "?status=true";
            serverUtilityService.getWebService(url).then(function (data) {
                $scope.employeeList = getEmployeeObj(data.data);                
                self.allSignAuth = loadSignAuth();
                self.allOwnerSignAuth = loadOwnerSignAuth();
            });
        };
        getEmployeeDetails();
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(contact) {
                return (contact._lowername.indexOf(lowercaseQuery) != -1);
            };
        }
        function querySearchSignAuth(criteria) {
            return criteria ? self.allSignAuth.filter(createFilterFor(criteria)) : [];
        }
        function querySearchOwnerSignAuth(criteria) {
            return criteria ? self.allOwnerSignAuth.filter(createFilterFor(criteria)) : [];
        }
        function loadOwnerSignAuth() {
            if($scope.routeFlag == 1 && !$scope.setupOwnerList.length) {
                var signAuthurity = $scope.employeeList;  
            } else {
                var signAuthurity = $scope.setupOwnerList;
            }
            return signAuthurity.map(function (c, index) {
                var signAuthurity = {
                    name: c.full_name,
                    id: c._id,
                    email: c.email,
                    image: 'images/avatar.png'
                };
                signAuthurity._lowername = signAuthurity.name.toLowerCase();
                return signAuthurity;
            });
        };        
        function loadSignAuth() {
            var signAuthurity = $scope.employeeList;
            return signAuthurity.map(function (c, index) {
                var signAuthurity = {
                    name: c.full_name,
                    id: c._id,
                    email: c.email,
                    image: 'images/avatar.png'
                };
                signAuthurity._lowername = signAuthurity.name.toLowerCase();
                return signAuthurity;
            });
        };
        $scope.submitTicket = function () {
            var url = FrontHelpDeskService.getUrl('createTicket');
            serverUtilityService.postWebService(url, $scope.tickeInfo)
                .then(function (data) {
                    if (data.data.status == 'success') {
                        $location.url('dashboard/help-desk');
                    }
                });
        };
        var successCallback = function (data, section, isAdded, updateTicket) {
            utilityService.resetAPIError(false, null, section);
            $('#bulk-reply').modal('hide');
            //$('#ticket-close-alert').modal('hide');
            $scope.closeModal('ticket');
            if (angular.isDefined(data.message)) {
                utilityService.showSimpleToast(data.message);
                $scope.selectedTicketsCount = 0;
                $scope.selectedTickets = {};
                $scope.selectTicketList.isCheck = false;
                $scope.replyAndCloseFlag = false;
                self.signAuth = [];
                $scope.subject = {
                    catSubj: null,
                    subCatSubj: null
                };
                syncHelpDeskModel();
                getAdminOwnerView();
                if($scope.helpdeskPermission.action.list.length) {
                    getAdminEmployeeView();
                }
                if ($location.path() == '/frontend/manager-helpdesk') {
                    getManagerView();
                } else {
                    getAllTickets();
                }
                if(updateTicket == 'manager'){
                   $route.reload();
                }
                if(updateTicket == 'employee'){
                    $route.reload();
                }
            }
        };
        var errorCallback = function (data, section, isAdded, updateTicket) {
            if (data.status === "error") {
                alert("Error Occured:"+data.message);                
            } else if(data.data.status === "error") {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function (value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        var successErrorCallback = function (data, section, isAdded, updateTicket) {
            section = angular.isDefined(section) ? section : "planSetting";
            isAdded = angular.isDefined(isAdded) ? isAdded : false;
            data.status === "success" 
                ? successCallback(data, section, isAdded, updateTicket) 
                : errorCallback(data, section);
        };
        $scope.bindFileChangeEvent = function(individulaFlag) {
            $scope.individulaFlag = angular.isDefined(individulaFlag)?true:false;
            $timeout(function() {
                $("input[type=file]").on('change',function(){
                    $scope.isUploaded = true;                   
                });
            }, 100);            
        };
        $scope.tempAttachment = [];
        $scope.getFileArray = function (files) {
            if (files.length) {
                $scope.tempAttachment = [];
            }            
            angular.forEach(files, function (v, k) {
                $scope.tempAttachment.push(v);
            });            
        };        
        $scope.removeAttachments = function (index) {
            $scope.reply.attachment = null;
            $scope.tempAttachment.splice(index, 1);
        };        
        var uploadProgressCallback = function(evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };         
        $scope.replyAndClose = function(type,isClose, flag) {
            flag = angular.isDefined(flag) ? flag : false;
            $scope.updateTicketFlag = false;
            $scope.replyAndCloseFlag = true;
            $scope.rplyType= type;
            $scope.rplyisClose= isClose;
            $scope.reply.flag = flag;
            //$('#ticket-close-alert').appendTo("body").modal('show');
            $scope.openModal('ticket', 'ticket-close-alert.tmpl.html');
        };        
        $scope.upload = function (type, isClose, issueType, form) {
            var closed = angular.isDefined(isClose) ? isClose : false , cType = null;
            //cType = angular.isDefined( $routeParams.flag) && $routeParams.flag == 0 ? 3 : $scope.onlyReply ? 1 : 2;
            if(utilityService.getStorageValue('commentType') && !$scope.internal) {
                cType =  $scope.commentTypeHashMap[utilityService.getStorageValue('commentType')];
            }
            if(utilityService.getStorageValue('commentType') && $scope.internal) {
                cType = 2;
            }
            if(type == 'reply') {
                $scope.replyFlag = true;
                var data = {
                    comment : $scope.reply.val,
                    comment_type : cType,
                    reply_attachment : $scope.tempAttachment,
                    is_close : closed
                };              
                if(angular.isDefined(issueType) && issueType != null) {
                    data.close_due_to = issueType;
                }
            } else {
                var data = {
                    ticket_attachment : $scope.tickeInfo.ticket_attachment,
                    category : $scope.tickeInfo.category,
                    subject : $scope.tickeInfo.subject,
                    priority : $scope.tickeInfo.priority,
                    issue : $scope.tickeInfo.issue,
                    comment_type: 3,
                    also_notify_employee: FrontHelpDeskService.extractChipId(self.signAuth)
                };
                if($scope.tickeInfo.subcategory != null && angular.isDefined($scope.subCategory) &&  $scope.subCategory.length){
                    data.subcategory = $scope.tickeInfo.subcategory;
                }
            }
            Upload.upload({
                url: $scope.replyFlag 
                    ? FrontHelpDeskService.getUrl('reply') + "/" + $scope.ticketId 
                    : FrontHelpDeskService.getUrl('createTicket'),
                headers: {
                    'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                },
                data: data,
            }).then(function (response) {  
                if($scope.replyFlag) {
                    $route.reload();
                }
                if(angular.isDefined(form) && response.data.status == 'success') {
                    utilityService.resetForm(form);
                    $scope.backToUrl('/dashboard/helpdesk');
                }
                successErrorCallback(response.data,'helpdesk');               
            }, function (response) {
                successErrorCallback(response.data,'helpdesk');
            }, function (evt) {
                uploadProgressCallback(evt);
            });
        };
        var getAllTickets = function(){
            var url = FrontHelpDeskService.getUrl('allTickets');
            serverUtilityService.getWebService(url)
                .then(function(data){
                    $scope.priority_filter = [];
                    angular.forEach(data.data, function (v,k){
                        $scope.priority_filter.push(v.priority);
                        v.updatedComment = v.ticket_reply[0].comment;
                    });
                    $scope.allTickets = data.data;
                    angular.copy($scope.allTickets, $scope.allTicketsFiltered);
                    $scope.calculateFacadeCountOfAllFilters($scope.allTickets, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $timeout(function (){
                        $scope.helpdeskAll.isEmpVisible = true;  
                    }, 200);
                });
        };
        if ($location.path() == '/dashboard/helpdesk') {
            getAllTickets();
        }
        /************* ADMIN VIEW *************/

        $scope.resetFilter = function(){
            angular.forEach($scope.ticketStatus, function (value, key){
                value.isChecked = false;
                if(angular.isDefined(value.label)){
                    angular.forEach(value.label, function (v, k){
                        v.isChecked = false;
                    });
                };
            });
            $scope.ticketFilter = [];
            $scope.resetAllTypeFilters();
            $scope.resetFilterCustomDate();
            $scope.filterDurationStatus = [];
        };

        $scope.resetOwnerFilter = function(){
             angular.forEach($scope.ownerGroupList,function(value,key){
                angular.forEach(value.element_details,function(v,k){
                    if(v.isChecked){
                        delete v.isChecked;
                        $scope.includeOwnerFilterFunc(v,value.slug);
                    }
                });
            });
            $scope.ownerAllFilters = [];
            $scope.resetFilter();
        };
        $scope.includeFilterFunc = function(element,slug,flag) {
            angular.copy($scope.adminViewFilter.originalItems, $scope.adminViewTickets);
        };
        $scope.includeOwnerFilterFunc = function(element,slug) {
            angular.copy($scope.ownerViewFilter.originalItems, $scope.adminOwnerView);
        };
        $scope.countOwnerViewFilter = function(ticket) {
            var count = { 
                closed_in_tat : 0,
                closed_over_tat : 0,
                pending_in_tat : 0,
                pending_over_tat : 0,
                total : 0
            };
            if(Object.keys($scope.filterIncludes).length>0) {
                angular.forEach(ticket.owner_tickets,function(v, k) {
                    var flag = true;
                    angular.forEach($scope.filterIncludes, function(value, key) {
                        if (angular.isDefined($scope.filterIncludes[key]) && $scope.filterIncludes[key].length > 0) {
                            if ($window._.intersection(v.emp_details[key], $scope.filterIncludes[key]).length == 0){
                                flag = false;
                            }
                        }                    
                    }); 
                    if(flag) {
                        calculateCount(count, v);
                    } else {
                        delete ticket.owner_tickets[k];
                    }   
                });                
            } else {
                angular.forEach(ticket.owner_tickets,function(v,k) {
                    calculateCount(count, v);
                });
            }
            ticket.total = count.total;
            ticket.pending_in_tat = count.pending_in_tat;
            ticket.pending_over_tat = count.pending_over_tat;
            ticket.closed_in_tat = count.closed_in_tat;
            ticket.closed_over_tat = count.closed_over_tat;
            return ticket;        
        };
        var calculateFacadeCount = function(list) {
            angular.forEach($scope.allSlugs, function (val, key){
                $scope.allFacadeCountObject.groupTicketView[val] = {};
            });
            angular.forEach(list, function(ticket, key) {
                angular.forEach(ticket.category_tickets,function(v, k) {
                    angular.forEach(v.emp_details, function(innerValue, innerKey) {
                        if($scope.allSlug.indexOf(innerKey) >= 0 && angular.isArray(innerValue)) {
                            var obj = innerValue.reduce(function(o, v, i) {
                                if(angular.isDefined($scope.allFacadeCountObject.groupTicketView[innerKey][v])) {
                                    $scope.allFacadeCountObject.groupTicketView[innerKey][v]++;
                                } else {
                                    $scope.allFacadeCountObject.groupTicketView[innerKey][v] = 1;
                                }
                                return o;
                            }, {});
                        }
                    });
                });
            });
        };
        var calculateOwnerCount = function(list) {
            angular.forEach($scope.allSlugs, function (val, key){
                $scope.allFacadeCountObject.groupOwnerView[val] = {};
            });
            
            angular.forEach(list, function(ticket, key) {
                angular.forEach(ticket.owner_tickets,function(v, k) {
                    angular.forEach(v.emp_details, function(innerValue, innerKey) {
                        if($scope.allSlug.indexOf(innerKey) >= 0 && angular.isArray(innerValue)) {
                            var obj = innerValue.reduce(function(o, v, i) {
                                if (angular.isDefined($scope.allFacadeCountObject.groupOwnerView[innerKey][v])) {
                                    $scope.allFacadeCountObject.groupOwnerView[innerKey][v]++;
                                } else {
                                    $scope.allFacadeCountObject.groupOwnerView[innerKey][v] = 1;
                                }
                                return o;
                            }, {});
                        }
                    });
                });
            });
        };         
        var getAdminTicketView = function(){
            var url = FrontHelpDeskService.getUrl('adminView');
            serverUtilityService.getWebService(url)
                .then(function(data){
                    $scope.adminViewTickets = data.data;
                    $timeout(function (){
                        $scope.helpdeskAll.isAdminVisible = true;
                    }, 500);
                    angular.copy($scope.adminViewTickets,$scope.adminViewFilter.originalItems);
                    calculateFacadeCount($scope.adminViewTickets);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                });
        };
        var getAdminOwnerView = function(){
            $scope.helpdeskAll.isOwnerVisible = false;
            var url = FrontHelpDeskService.getUrl('adminOwnerView');
            serverUtilityService.getWebService(url)
                .then(function(data){
                    $scope.adminOwnerView = data.data;
                    angular.copy($scope.adminOwnerView,$scope.ownerViewFilter.originalItems);
                    angular.copy($scope.adminOwnerView,$scope.ownerViewFilter.filteredItems);
                    calculateOwnerCount($scope.adminOwnerView);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.helpdeskAll.isOwnerVisible = true;
                });
        };
        $scope.onAdminViewTabSelect = function (tab){
            $scope.resetSortVariables();
            $scope.resetAllTypeFilters();
            switch (tab) {
                case 'ticketView':
                    getAdminTicketView();
                    break;

                case 'ownerView':
                    getAdminOwnerView();
                    break;
                
                default : 
                    getAdminEmployeeView();
            }
        };
        /* $scope.$watch("adminViewFilter.filteredItems", function(newVal,oldVal) {
            calculateFacadeCount($scope.adminViewFilter.filteredItems);
        }, true); */
        /* $scope.$watch("ownerViewFilter.filteredItems", function(newVal,oldVal) {
            calculateOwnerCount($scope.ownerViewFilter.filteredItems);
        }, true); */
        $scope.sendReminder = function(item,type,senderType){
            var url = FrontHelpDeskService.getUrl('sendReminder'),
                payload = {
                    master_emp_id: angular.isDefined(item.admin_id) ? item.admin_id : item.raised_by,
                    slave_emp_id: angular.isDefined(item.owner_id) ? item.owner_id : item.owner_detail[0].id,
                    type: type
                };

            if(senderType == 'employee'){
                payload.reference_id = item._id;
                payload.owner_detail = item.owner_detail;
                payload._id = item._id;
                payload.ticket_id = item.ticket_id;
            }

            serverUtilityService.postWebService(url,payload)
                .then(function(data){
                    successErrorCallback(data,'helpdesk')   
                });
        };
        var getFullName = function(data){            
            angular.forEach(data, function (val, key) {
                if (angular.isDefined(val.issuer_detail) 
                    && angular.isDefined(val.issuer_detail.employee_detail) 
                    && angular.isDefined(val.issuer_detail.employee_detail.first_name)) {
                    val.full_name = val.issuer_detail.employee_detail.first_name + " " + val.issuer_detail.employee_detail.last_name;
                }
            });
            return data;
        };                
        var allFilterEmpObject = [
            {countObject: 'groupTemp', isGroup: true, collection_key: 'issuer_detail'},
            {countObject: 'rest', isArray: false, key: 'priority'}];
        var getAdminEmployeeView = function() {
            $scope.adminEmployeeView.visible = false;
            var url = FrontHelpDeskService.getUrl('adminEmployeeView');
            serverUtilityService.getWebService(url)
                .then(function(data){
                    angular.forEach(data.data, function (v, k){
                        v.full_name = v.issuer_detail.full_name;
                        v.employee_id= v.issuer_detail.employee_id;
                        v.updatedComment = v.ticket_reply[0].comment;
                    });
                    $scope.adminEmpView = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.adminEmpView, allFilterEmpObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $scope.adminEmployeeView.visible = true;
                });
        };        

        /**************** MANAGER VIEW ****************/        
        var getManagerView = function(){
            var url = FrontHelpDeskService.getUrl('allPocTickets');
            serverUtilityService.getWebService(url)
                .then(function(data){
                    angular.forEach(data.data, function (v, k){
                        v.full_name = v.issuer_detail.full_name;
                        v.employee_id= v.issuer_detail.employee_id;
                        v.updatedComment = v.ticket_reply[0].comment;
                    });
                    $scope.managerView = data.data;
                    $scope.calculateFacadeCountOfAllFilters($scope.managerView, allFilterObject);
                    angular.copy($scope.allFacadeCountObject, $scope.allFacadeCountCopyObject);
                    $timeout(function (){
                        $scope.helpdeskAll.isManagerVisible = true;
                    }, 200);
                });
        };
        if ($location.path() == '/frontend/manager-helpdesk') {
            getManagerView();
        }
        $scope.closeTicketTypeList = [
            {id: 1, name: "Issue Resolved"}, 
            {id: 2, name: "Wrong ticket raised"}];
        $scope.closeTicketReason = {
            close_due_to: 1,
            close_due_to_comment: null
        };
        $scope.deleteTickets = function(list){
            var ticket_ids = [];
            angular.forEach(list, function (row) {
                if ($scope.selectedTickets[row._id]) {
                    ticket_ids.push(row._id);
                }
            });
            var url = FrontHelpDeskService.getUrl('closeTicket'),
                payload = {
                    ticket_id: ticket_ids,
                    close_due_to: $scope.closeTicketReason.close_due_to,
                    close_due_to_comment: $scope.closeTicketReason.close_due_to_comment
                };
            
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if(data.status=='success'){
                        $scope.selectedTickets={};
                        $scope.selectedTicketsCount = 0;
                    }
                    successErrorCallback(data,'helpdesk');
                });
        };
        $scope.closeTickets = function (list) {
            $scope.closeTicketList = list;
            //$('#ticket-close-alert').appendTo("body").modal('show');
            $scope.openModal('ticket', 'ticket-close-alert.tmpl.html');
        };
        $scope.updateCount = function(){
            $scope.selectedTicketsCount = 0;
            angular.forEach($scope.selectedTickets,function(val,key){
                if(val){
                    $scope.selectedTicketsCount += 1;
                }                
            });
            if($scope.selectedTicketsCount == 0){
                $scope.selectTicketList.isCheck = false;
            }
        };
        $scope.checkAll = function(isCheck, list) {
            angular.forEach(list, function (row){
                if(row.status == 1){
                    $scope.selectedTickets[row._id] = isCheck;
                }
            });
            $scope.updateCount();
        };
        $scope.bulkReplyPopup = function (form) {
            $scope.errorMessages = [];
            utilityService.resetForm(form);
            $scope.managerReply = {
                comment: null,
                closeTicket:false,
                close_due_to:1,
                selected:0
            };
            $('#bulk-reply').appendTo("body").modal('show');
        };
        $scope.replyByManager = function(urll,type){
            var ticket_ids = [],
                filteredList = utilityService.getValue($scope.pocManager, 'filteredList', []);

            angular.forEach(filteredList, function (row, index) {
                if ($scope.selectedTickets[row._id]) {
                    ticket_ids.push(row._id);
                }
            });
            var url = FrontHelpDeskService.getUrl(urll),
                payload = {
                    ticket_id : ticket_ids,
                    comment:$scope.managerReply.comment,
                    comment_type:type,
                    reply_attachment: $scope.managerReply.reply_attachment
                };

            if($scope.managerReply.closeTicket){
                payload.close_due_to=$scope.managerReply.close_due_to
            }
            serverUtilityService.uploadWebService(url,payload)
                .then(function(data){
                    successErrorCallback(data,'helpdesk');
                });
        };
        $scope.updateTicketPayload = {            
            category: null,
            subcategory: null,
            status: null,
            priority: null,
            owner: self.signAuth,
            also_notify_employee: self.alsoNotify,
            rating: 0,
            comment: null
        };
        $scope.updateTicketFlag = false;
        $scope.updateAndCloseTicket = function(item, keyType, updateTicket) {
            if(keyType == 'status' && item == 2) {
                $scope.reply.flag = false;
                $scope.updateTicketFlag = true;
                $scope.replyAndCloseFlag = false;
                $scope.updateTicketItem = item;
                $scope.updateTicketRole = updateTicket;
                $scope.updateTicketKeyType = keyType;
                //$('#ticket-close-alert').appendTo("body").modal('show');
                $scope.openModal('ticket', 'ticket-close-alert.tmpl.html');
            } else {
                $scope.updateTicket(item,keyType,updateTicket);
            }
        };
        $scope.updateTicket = function(item,keyType,updateTicket) {
            var url = FrontHelpDeskService.getUrl('updateTicket') + "/" + $scope.ticketId, 
                payload = {};

            if(keyType == 'owner') {
                payload[keyType] = FrontHelpDeskService.makeIdsArray(self.signAuth);
            } else if(keyType == 'also_notify_employee') {
                payload[keyType] = FrontHelpDeskService.makeIdsArray(self.alsoNotify);
            } else {
                payload[keyType] = keyType == 'status' ? parseInt(item) : item;
            }

            if(keyType == 'status' && item == 2){
                payload.close_due_to = $scope.closeTicketReason.close_due_to;
                payload.close_due_to_comment = $scope.closeTicketReason.close_due_to_comment;
            }
            payload.comment_type = updateTicket == "manager" ? 1 : 4;
            serverUtilityService.putWebService(url,payload)
                .then(function(data){
                    successErrorCallback(data,'helpdesk',false,updateTicket);        
                });
        };
        $scope.setElement = function(condition) {
            $scope.reply.val = null;
            $scope.reply.attachment = null;
            $scope.tempAttachment = [];
            if(condition == 'reply') {
                $scope.onlyReply = true;
                $scope.internal = false
            } else {
                $scope.onlyReply = false;
                $scope.internal = true
            }
        };
        $scope.setManagerElement = function(condition) {
            $scope.errorMessages = [];
            $scope.managerReply.comment = null;
            $scope.managerReply.reply_attachment = null;
            $scope.managerReply.close_due_to = 1;            
        };
        $scope.backToUrl = function (url, key) {
            if(angular.isDefined(key)) {
                $location.url(url).search({"ticketId": $scope.ticketId, "flag":0});
            } else {
                $location.url(url);
            }
        };
        $scope.backToUrlRate = function (url, key,Id) {
            if(angular.isDefined(key)) {
                $location.url(url).search({"ticketId": Id,"flag":0});
            } else {
                $location.url(url);
            }
        };        
        $scope.updateTicketRating = function(){
            var url = FrontHelpDeskService.getUrl('updateTicket') + "/" + $scope.ticketId,
                payload = {
                    rating: parseFloat($scope.updateTicketPayload.rating),
                    rating_comment: $scope.updateTicketPayload.comment
                };

            serverUtilityService.putWebService(url,payload)
                .then(function(data){
                    successErrorCallback(data,'helpdesk');
                    if(data.status=='success'){
                        $location.url('/dashboard/helpdesk');
                    }
                });
        };
        $scope.pocByAdmin = {
            point_of_contact: [],
            ticketId: null 
        };
        $scope.addPoc = function (item){
            $scope.pocByAdmin = {
                point_of_contact: [],
                ticketId: null 
            };
            $scope.pocByAdmin.ticketId = item._id;
            $('#add-poc-popup').appendTo('body').modal('show');
        };
        $scope.updateTicketPoc = function(){
            var poc =[];
            var url = FrontHelpDeskService.getUrl('updateTicket')+"/"+$scope.pocByAdmin.ticketId;
            angular.forEach($scope.pocByAdmin.point_of_contact,function(v, k){
                poc.push(v.id);
            });
            var payload = {
                "owner": poc
            };
            serverUtilityService.putWebService(url,payload)
                .then(function(data){
                    if(data.status == 'success'){
                        $('#add-poc-popup').modal('hide');
                        utilityService.refreshList($scope.adminEmpView, data.data);
                    }
                });
        };        
        $scope.setPriority = function (item){
            $scope.subject.subCatSubj=item.description;
            $scope.tickeInfo.priority = item.priority;
        };
        $scope.reOpenTicket = function (item){
            var url = FrontHelpDeskService.getUrl('updateTicket') + "/" + $scope.ticketId,
                payload = {
                    status: 1
                };

            serverUtilityService.putWebService(url,payload)
                .then(function(data){
                    if(data.status == 'success'){
                        successErrorCallback(data,'helpdesk');       
                        $route.reload();
                    }
                });
        };
        $scope.collapseAll = function() {
            angular.forEach($scope.selectedIndex, function(v, k){
                $scope.selectedIndex[k] = -1;
            });
        };
        $scope.viewProfile = function (empId){
            if(angular.isDefined(empId)){
                $location.url("/dashboard/profile/" + empId);
            }
        };
        $scope.sortList = function(orderByField,reverseBoolean){
            $scope.orderByField = orderByField; 
            $scope.reverseSort = reverseBoolean;            
        };
        $scope.sortListForEmployee = function(orderByField,reverseBoolean){
            $scope.orderByEmployeeField = orderByField; 
            $scope.reverseSort = reverseBoolean; 
        };
        $scope.resetSortVariables = function(){
            $scope.selectedNames = [];
            $scope.selectedIds = [];
            $scope.selectedDesignation = [];
            $scope.selectedOwner = [];
            $scope.selectedDates = [];
            $scope.nameCollection = [];
            $scope.idCollection = [];
            $scope.designationCollection = [];
            $scope.ownerCollection = [];
            $scope.dateCollection = [];
        };
        $scope.resetSortVariables();
        $scope.includeFiles = function(object,collection) {
            var i = $.inArray(object, collection);
            (i > -1) ? collection.splice(i, 1) : collection.push(object);
        };
        $scope.nameSortFilter = function(object) {
            if ($scope.nameCollection.length > 0) {
                if ($.inArray(object.full_name, $scope.nameCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.nameOwnerSortFilter = function(object) {
            if ($scope.nameCollection.length > 0) {
                if ($.inArray(object.owner_name, $scope.nameCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.idFilter = function(object) {
            if ($scope.idCollection.length > 0) {
                if ($.inArray(object.employee_id, $scope.idCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.designationsFilter = function(object) {
            if ($scope.designationCollection.length > 0) {
                if ($.inArray(object.designation, $scope.designationCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.dateSortFilter = function(object) {
            if ($scope.dateCollection.length > 0) {
                if ($.inArray(object.joining_date, $scope.dateCollection) < 0)
                    return;
            }
            return object;
        };
        $scope.resetSortForCollection = function(string){
            if(string == "all") {
                $scope.resetSortVariables();
            } else {
                string == 'name' ? ($scope.nameCollection = [],$scope.selectedNames = []): 
                    string == 'id' ? ($scope.idCollection = [] ,$scope.selectedIds = []): 
                        string == 'designation' ? ($scope.designationCollection = [],$scope.selectedDesignation = []) : 
                            string == 'owner' ? ($scope.ownerCollection = [],$scope.selectedOwner = []) : 
                                string == 'date' ? ($scope.dateCollection = [],$scope.selectedDates = []) : string = "";
            }
        }
        $scope.paginationObject = utilityService.buildPaginationObject();
        /************ End AUTOCOMPLETE Section ************/

        $scope.paginationObject.pagination.currentPage = utilityService.getStorageValue('helpdeskPageNo') 
            ? utilityService.getStorageValue('helpdeskPageNo') : 1;
        $scope.paginationObject.pagination.numPerPage = utilityService.getStorageValue('helpdeskNumPerPage') 
            ? utilityService.getStorageValue('helpdeskNumPerPage') : 10;
        $scope.$watch("paginationObject.pagination.numPerPage", function(newVal,oldVal) {
            if( newVal != oldVal) {
                $scope.paginationObject.pagination.currentPage = 1;
            } else {
                $scope.paginationObject.pagination.currentPage = utilityService.getStorageValue('helpdeskPageNo') ? utilityService.getStorageValue('helpdeskPageNo') : 1;
            }
            utilityService.setStorageValue('helpdeskNumPerPage',newVal);
        }, true);

        $scope.getRecord = function (newv, oldv){
            utilityService.setStorageValue('helpdeskPageNo', newv);
        };       
        $scope.extractPriority = function (priority) {
            for (var i = 0; i < $scope.priorityList.length; i++) {
                if ($scope.priorityList[i]['priority'] == priority) {
                    return $scope.priorityList[i]['phrase'] + " Priority";
                }
            }
        };
        $scope.report = {
            list : [],
            content : [],
            listWithoutHeader : []
        };
        $scope.exportToCsv = function(){
            var attrList = new Array("Ticket ID", "Category", "Sub Category", 
                "Employee Name", "Employee ID", "Status", "Raised Date");

            $scope.report = {
                content: new Array(attrList),
            };
            var filteredList = utilityService.getValue($scope.pocManager, 'filteredList', []);

            angular.forEach(filteredList, function(value, key){
                var array = new Array();
                array.push(value.ticket_id ? value.ticket_id : "N/A");
                array.push(value.category_name ? value.category_name : "N/A");
                array.push(value.subcategory_name ? value.subcategory_name : "N/A");
                array.push(value.full_name ? value.full_name : "N/A");
                array.push(value.issuer_detail.employee_id ? value.issuer_detail.employee_id : "N/A");
                array.push(value.status ? $scope.status[value.status] : "N/A");
                array.push(value.raised_date ? value.raised_date : "N/A");
                $scope.report.content.push(array);
            });
            var reportName = "Helpdesk Manager View.csv";
            if($scope.report.content.length > 1){
                setTimeout(function() {
                    utilityService.exportToCsv($scope.report.content, reportName);
                }, 500);
            }
        };
        $scope.adminExportToCsv = function(){
            var attrList = new Array("Ticket ID", "Category", "Sub Category", "Raised On", 
                "Employee Name", "Employee ID", "Status", "TAT Status", "Ticket Close Date", "Owner");
            $scope.report = {
                content: new Array(attrList),
            };
            var filteredItems = utilityService.getValue($scope.employeeView, 'filteredItems', []);
            angular.forEach(filteredItems, function(value, key) {
                var array = new Array();
                array.push(value.ticket_id ? value.ticket_id : "N/A");
                array.push(value.category_name ? value.category_name : "N/A");
                array.push(value.subcategory_name ? value.subcategory_name : "N/A");
                array.push(value.raised_date ? value.raised_date : "N/A");
                array.push(value.full_name ? value.full_name : "N/A");
                array.push(value.issuer_detail.employee_id ? value.issuer_detail.employee_id : "N/A");
                array.push(value.status ? $scope.status[value.status] : "N/A");
                array.push(value.tat_status ? value.tat_status : "N/A");
                array.push((utilityService.getValue(value, "closed_date") 
                    && utilityService.getValue(value, "status") == 2) ? utilityService.getValue(value, "closed_date") : "");
                var ownerList = [];
                angular.forEach(value.owner_detail, function(v,k){
                    ownerList.push(v.full_name);
                });
                if (angular.isDefined(value.owner_detail)) {
                    array.push(value.owner_detail.length > 0 ? ownerList.toString() : "N/A");
                }               
                $scope.report.content.push(array);
            });
            var reportName = "Helpdesk Admin View.csv";
            if($scope.report.content.length > 1){
                setTimeout(function() {
                    utilityService.exportToCsv($scope.report.content, reportName);
                }, 500);
            }
        };
        $scope.employeeExportToCsv = function(){
            var attrList = new Array("Ticket ID", "Category", "Sub Category", 
                "Raised Date", "Status", "Owner");

            $scope.report = {
                content: new Array(attrList),
            };
            angular.forEach($scope.allTickets,function(value,key){
                var array = new Array();
                array.push(value.ticket_id ? value.ticket_id : "N/A");
                array.push(value.category_name ? value.category_name : "N/A");
                array.push(value.subcategory_name ? value.subcategory_name : "N/A");
                array.push(value.raised_date ? value.raised_date : "N/A");
                array.push(value.status ? $scope.status[value.status] : "N/A");
                var ownerList = [];
                angular.forEach(value.owner_detail, function(v,k){
                    ownerList.push(v.full_name);
                });
                array.push(value.owner_detail.length > 0 ? ownerList.toString() : "N/A");
                $scope.report.content.push(array);
            });
            var reportName = "Helpdesk Employee View.csv";
            if($scope.report.content.length > 1){
                setTimeout(function() {
                    utilityService.exportToCsv($scope.report.content, reportName);
                }, 500);
            }
        };
        $scope.adminExportTicketView = function(){
            var attrList = new Array("Ticket Type", "Resolution", "Raised", "Pending In TAT", 
                "Pending Over TAT", "Closed In TAT", "Closed Over TAT");

            $scope.report = {
                content: new Array(attrList),
            };
            angular.forEach($scope.adminViewFilter.filteredItems, function(item, key) {
                var array = new Array(),
                    category = utilityService.getValue(item, 'category');

                category = category + ' >> ' + utilityService.getValue(item, 'subcategory');

                array.push(category);

                if (item.resolutionTatTime) {
                    var duration = utilityService.getValue(item, 'resolutionTatTime');
                    duration = duration + ' ' + $scope.resolutionDuration[item.resolutionTatUnit];
                } else {
                    var duration = '';
                }

                array.push(duration);
                array.push(utilityService.getValue(item, 'total', 0));
                array.push(utilityService.getValue(item, 'pending_in_tat', 0));
                array.push(utilityService.getValue(item, 'pending_over_tat', 0));
                array.push(utilityService.getValue(item, 'closed_in_tat', 0));
                array.push(utilityService.getValue(item, 'closed_over_tat', 0));                

                $scope.report.content.push(array);
            });
            if($scope.report.content.length > 1){
                setTimeout(function() {
                    utilityService.exportToCsv($scope.report.content, "admin_ticket_view.csv");
                }, 500);
            }
        };
    
        /*************** Show Comment Attachment ******************/
        $scope.showAttachment = function (commentId, attachmentId) {
            $scope.viewDownloadFileUsingForm(FrontHelpDeskService.getUrl('showAttachment') + "/" + $scope.ticketId + "/" + commentId + "/" + attachmentId);
        };
        $scope.checkIfPocExist = function(item){
            var flag = false;
            angular.forEach(item,function(value,key){
                if (value.user_id === $scope.user.loginUserId) {
                    flag = true;
                }
            });

            return flag;
        };
        $scope.getBackgroundColor = function(rating){
            var bgColor = null;
            if(rating > 0 && rating < 2.5){
                bgColor = "q-light-red-bg";
            }
            if(rating > 2 && rating < 4){
                bgColor = "q-light-orange-bg";
            }
            if (rating >= 4) {
                bgColor = "q-light-green-bg";
            }

            return bgColor;
        };
        $scope.resetFilterCustomDate = function () {
            $scope.initDate = {
                from: null,
                to: null
            };
        };

        /***** Start Helpdesk Permission Section *****/
        $scope.helpdeskPermission = {
            action: {
                list: [],
                current: null,
                visible: false
            }
        };
        var extractReportFromPermissionList = function(data) {
            angular.forEach(data.data, function(value, key) {
                value._id = angular.isObject(value._id) ? value._id.$id : value._id;
                if(value.permission_slug.indexOf('report') >= 0) {
                    data.data.splice(key, 1);
                }
            });
        };
        var getActionListCallback = function(data) {
            extractReportFromPermissionList(data);            
            $scope.helpdeskPermission.action.list = data.data;
            $scope.helpdeskPermission.action.current = data.data.length ? data.data[0] : null;
            $scope.helpdeskPermission.action.visible = true;
            if(data.data.length) {   
                getAdminEmployeeView();                     
            }
        };
        var getActionList = function() {
            var url = FrontHelpDeskService.getUrl('actionAdmin') + "/helpdesk";
            serverUtilityService.getWebService(url)
                .then(function(data) {
                    getActionListCallback(data);
                });
        };
        if ($location.path() == '/frontend/helpdesk') {
            getActionList();
        }
        $scope.changeAction = function(action) {
            getAdminEmployeeView();
        };
        $scope.isActionView = function() {
            var permissionSlug = 'can_view_helpdesk_tickets';
            return utilityService.getValue($scope.helpdeskPermission.action.current, 'permission_slug') === permissionSlug;
        };
        /***** End Helpdesk Permission Section *****/

        /***** Start Angular Modal *****/
        $scope.openModal = function (instance, templateUrl, size) {
            size = angular.isDefined(size) ? size : 'sm';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                size: size
            });
        };
        $scope.closeModal = function (instance) {
            if($scope.modalInstance[instance]){
                $scope.modalInstance[instance].dismiss();
            }
        };
        /***** End Angular Modal *****/

        $scope.adminExportOwnerView = function() {
            var attrList = new Array("Owner Name", "Assigned", "Pending In TAT", 
                "Pending Over TAT", "Closed In TAT", "Closed Over TAT");

            $scope.report = {
                content: new Array(attrList),
            };

            angular.forEach($scope.ownerViewFilter.filteredItems, function(item, key) {
                var array = new Array();

                array.push(utilityService.getValue(item, 'owner_name'));
                array.push(utilityService.getValue(item, 'total', 0));
                array.push(utilityService.getValue(item, 'pending_in_tat', 0));
                array.push(utilityService.getValue(item, 'pending_over_tat', 0));
                array.push(utilityService.getValue(item, 'closed_in_tat', 0));
                array.push(utilityService.getValue(item, 'closed_over_tat', 0));                

                $scope.report.content.push(array);
            });

            if($scope.report.content.length > 1) {
                $timeout(function() {
                    utilityService.exportToCsv($scope.report.content, "admin_owner_view.csv");
                }, 500);
            }
        };

    }
]);