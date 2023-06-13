app.controller('CommunicationController', [
    '$scope', '$routeParams', '$q', '$timeout', '$location', 'utilityService', 'communicationService', 'ServerUtilityService', 'VALIDATION_ERROR', 'NAVIGATE', 'MODULE_HEADING',
    function ($scope, $routeParams, $q, $timeout, $location, utilityService, communicationService, serverUtilityService, VALIDATION_ERROR, NAVIGATE, MODULE_HEADING) {
        //$scope.module_key = 'provisions';
        //set above keys on realted module parent controller

        $scope.validationError = VALIDATION_ERROR[countryCode];
        $scope.subTab = utilityService.getValue($routeParams, 'subtab');
        $scope.moduleKey = angular.isDefined($scope.module_key) ? $scope.module_key : $routeParams.module_key;
        $scope.heading = MODULE_HEADING[$scope.moduleKey];
        $scope.tinymceOptions = communicationService.buildTinyMceOptionsObject();
        $scope.communicationList = null;
        $scope.referenceList = [];
        $scope.tabs = $scope.subTab;
        $scope.communication = {
            visible: false,
            relationships: [],
            allowed: communicationService.buildAllowedSlugMappingObject()
        };
        $scope.setTabs = function(tab) {
            $scope.tabs = tab;
        };
        $scope.navigateToCommunication = function() {
            if ($scope.moduleKey == 'performance') {
                $location.url('/frontend/adminPerformance').search({tab: 2, subtab: 4});
            } else {
                $location.url('/admin').search({tab: NAVIGATE[$scope.moduleKey], subtab: 'communication'});
            }
        };
        var communicationCallback = function (data){
            angular.forEach(data.data, function(v,k){
                v.is_editor_on = false;
                v.is_editor_active = false;
                v.text_message = v.email_message;
            });
            
            $scope.communicationList = data.data;
            $scope.communication.visible = true;
        };
        var referenceCallBack = function (data) {
            $scope.referenceList = data.data;
            $scope.tinymceOptions.snippet_list = $scope.referenceList;
        };
        var relationshipCallback = function (data) {
            $scope.communication.relationships = utilityService.getValue(data, 'data', []);
        };
        var getCommunicationReferenceList = function () {
            $q.all([
                //serverUtilityService.getWebService(communicationService.getUrl('getReference') +'/'+ $scope.moduleKey),
                serverUtilityService.getWebService(communicationService.getUrl('getCommunication') + "/" + $scope.moduleKey),
                serverUtilityService.getWebService(communicationService.getUrl('relationship'), { field_type: 13, is_skip: 1 })
            ]).then(function (data) {
               //referenceCallBack(data[0]);
                communicationCallback(data[0]);
                relationshipCallback(data[1]);
            });
        };
        getCommunicationReferenceList();
        var updateCommunicationCallback = function (data) {
            if (data.status === "success") {
                utilityService.showSimpleToast(data.message);
                utilityService.refreshList($scope.communicationList, data.data)
                data.data.text_message = data.data.email_message; 
                //utilityService.refreshList($scope.communicationList, data.data);
            } else {
                alert('something went wrong');
            }
        };        
        if($scope.subTab && $location.path() != "/frontend/adminPerformance") {
            $scope.navigateSetupWizard('communication', $scope.subTab, 'home');
        }        
        $scope.updateStatus = function (option, item) {
            if(option=='email') {
                var payload = { is_email_notification: item.is_email_notification },
                    url = communicationService.getUrl('emailStatus') + "/" + item._id;
            } else if(option=='notification') {
                var payload = { is_site_notification: item.is_site_notification },
                    url = communicationService.getUrl('notificationStatus') + "/" + item._id;
            }
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    updateCommunicationCallback(data);
                });
        };        
        $scope.saveNotification = function (item) {
            var url = communicationService.getUrl('saveNotification') + "/" + item._id,
                payload = {
                    message: item.message
                };

            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    updateCommunicationCallback(data);
                });
        };        
        $scope.saveMessage = function (item) {
            var url = communicationService.getUrl('saveNotification') + "/" + item._id,
                payload = {
                    email_subject: item.email_subject,
                    email_message: item.email_message,
                    cc: angular.isArray(utilityService.getValue(item, 'cc')) 
                        ? utilityService.getValue(item, 'cc')
                        : utilityService.convertStringEmailToArray(utilityService.getValue(item, 'cc'))
                };

            if ($scope.isBCCAndAdditionalFieldsVisible(item)) {
                payload.cc_relationship = utilityService.getValue(item, 'cc_relationship', []);
                payload.bcc = angular.isArray(utilityService.getValue(item, 'bcc'))
                    ? utilityService.getValue(item, 'bcc')
                    : utilityService.convertStringEmailToArray(utilityService.getValue(item, 'bcc'));                
                payload.bcc_relationship = utilityService.getValue(item, 'bcc_relationship', []);
            }
                
            serverUtilityService.putWebService(url, payload)
                .then(function (data) {
                    if(data.status=='success'){
                        $scope.showEditor(item,'editor', false) ;
                    }
                    updateCommunicationCallback(data);
                });
        };
        $scope.showEditor = function(item,key, flag) {
            $scope.tinymceOptions.snippet_list = communicationService.buildFinalReferenceList(item.reference_keys);
            $timeout(function(){
                angular.forEach($scope.communicationList, function(v, k) {
                    v.is_editor_on = false;             
                    v.is_editor_active = false;             
                });
                if(key=='class') {
                    item.is_editor_active = flag;
                } else {
                    item.is_editor_on = flag;
                }
            }, 1000);
        };
        $scope.handleMessageAction = function (key, item, index) {
            if (key == 'msg') {
                $location.url('communication').search({module_key:$scope.module_key, subtab:'email',index:index});
            } else if (key == 'notification') {
                $location.url('communication').search({module_key:$scope.module_key, subtab:'notification',index:index});
            }
        };
        
        /******* for insert and delete refrence *****/
        $scope.insertReference = function (areaId, index, text) {
            var txtarea = document.getElementById(areaId + index);
            if (!txtarea) { 
                return; 
            }

            var scrollPos = txtarea.scrollTop;
            var strPos = 0;		
            var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') 
                ? "ff" : (document.selection ? "ie" : false ));
            
            if (br == "ie") {
                txtarea.focus();
                var range = document.selection.createRange();
                range.moveStart ('character', -txtarea.value.length);
                strPos = range.text.length;
            } else if (br == "ff") {
                strPos = txtarea.selectionStart;
            }
		
            var front = (txtarea.value).substring(0, strPos);
            var back = (txtarea.value).substring(strPos, txtarea.value.length);

            txtarea.value = front + text + back;
            strPos = strPos + text.length;
    		if (br == "ie") {
    			txtarea.focus();
    			var ieRange = document.selection.createRange();
    			ieRange.moveStart ('character', -txtarea.value.length);
    			ieRange.moveStart ('character', strPos);
    			ieRange.moveEnd ('character', 0);
    			ieRange.select();
    		} else if (br == "ff") {
    			txtarea.selectionStart = strPos;
    			txtarea.selectionEnd = strPos;
    			txtarea.focus();
    		}
            txtarea.scrollTop = scrollPos;
        };        
        $scope.deleteReference = function (areaId, event) {
            if (event.keyCode == 8) {
                var txtarea = document.getElementById(areaId);
                if (!txtarea) {
                    return;
                }

                var scrollPos = txtarea.scrollTop;
                var patt = /^#/igm;
                var strPos = 0;
                var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
                        "ff" : (document.selection ? "ie" : false));
                if (br == "ie") {
                    txtarea.focus();
                    var range = document.selection.createRange();
                    range.moveStart('character', -txtarea.value.length);
                    strPos = range.text.length;
                } else if (br == "ff") {
                    strPos = txtarea.selectionStart;
                }
                var front = (txtarea.value).substring(0, strPos);
                var back = (txtarea.value).substring(strPos, txtarea.value.length);
                var frontArray = front.split(' ');
                var text = frontArray[frontArray.length - 1];
                var match = patt.test(text);
                if (match) {
                    frontArray.splice(frontArray.length - 1);
                    txtarea.value = frontArray.join(' ') + back;
                    strPos = strPos - text.length;
                    if (br == "ie") {
                        txtarea.focus();
                        var ieRange = document.selection.createRange();
                        ieRange.moveStart('character', -txtarea.value.length);
                        ieRange.moveStart('character', strPos);
                        ieRange.moveEnd('character', 0);
                        ieRange.select();
                    } else if (br == "ff") {
                        txtarea.selectionStart = strPos;
                        txtarea.selectionEnd = strPos;
                        txtarea.focus();
                    }
                    txtarea.scrollTop = scrollPos;
                }
            };
        };

        $scope.isBCCAndAdditionalFieldsVisible = function (item) {
            var moduleKey = utilityService.getValue($routeParams, 'module_key'),
                allowedCommunication = utilityService.getInnerValue($scope.communication, 'allowed', moduleKey, []);
                console.log($scope.communication)
            
            return allowedCommunication.indexOf(item.slug) > -1 ? true : false;
        };

        /***** Start: Checkbox check/uncheck functionality handling *****/
        $scope.isRelationshipChecked = function (item, relationship, keyName) {
            return utilityService.getValue(item, keyName, []).indexOf(relationship._id) > -1;
        };
        $scope.checkUncheckRelationshipHandler = function (item, relationship, keyName) {
            var list = utilityService.getValue(item, keyName, []),
                idx = list.indexOf(relationship._id);

            (idx > -1) ? list.splice(idx, 1) : list.push(relationship._id);
            item[keyName] = list;
        };
        /***** End: Checkbox check/uncheck functionality handling *****/
    }
]);