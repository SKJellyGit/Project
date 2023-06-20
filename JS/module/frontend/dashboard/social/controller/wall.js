app.controller('SocialWallController', [
    '$scope', '$timeout', 'SocialWallService', 'CommunityService', 'utilityService', 'ServerUtilityService','$location','$modal',
    function($scope, $timeout, wallService, CommunityService, utilityService, serverUtilityService,$location, $modal) {
        
        $scope.wall = wallService.buildWallObject();
        $scope.logedInUserID = utilityService.getStorageValue('loginEmpId');
        $scope.attachedFileName = null;
        $scope.badgesFlag = false;
        $scope.badgesDetail = null;
        $scope.id = "_id";
        $scope.reverse = true;
        $scope.saveResponseFlag = false;
        $scope.inAppropriatedFlag = false;
        // $scope.Customers = [];
        // $scope.PageIndex = 1;
        // $scope.RecordCount = 0;
        // $scope.PageSize = 10;
        $scope.userpost = {
            pageIndex : 1,
            recordCount : 0,
            pageSize : 10,
            totalUser: 0,
            pages : [],
            range: utilityService.range(1, 100)
        };
        console.log($scope.userpost.per_pages)
        $scope.poll = {
            list: [],
            hasMap: null,
            index: 0,
        };
        $scope.survey = {
            list: [],
            hasMap: null,
            selectedForm: null,
            index: 0
        };
        $scope.title = "Machine Profiles";
        var self = this, 
            cachedQuery, 
            lastSearch, 
            cachedOffer, 
            lastSearchOffer, 
            cachedSignAuth, 
            lastSearchSignAuth;

        self.simulateQuery = false;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.filterSelected = true;

        $scope.hasAdminDeletePostPermission = function() {
            return $scope.modulePermissions.admin.admin_sidenav_delete_social_post;
        };

        var resetErrorMessages = function() {
            $scope.errorMessages = [];
        };
        $scope.getResult = function(item){
            return item.id == $scope.id;
        };
        var successCallback = function(data, list, section, isAdded, type) {
            utilityService.resetAPIError(false, null, section);
            if(data.message){
               utilityService.showSimpleToast(data.message); 
            }
            
            $scope.attachedFileName = null;
            if (angular.isDefined(data.data)) {
                isAdded ? list.unshift(data.data) : utilityService.refreshList(list, data.data);
            	type == "comment" || type == "likecomment" 
                    ? getCommentDetails($scope.postId) 
                    : wallService.buildLikeFlagObject(list,$scope.logedInUserID);
                $scope.badgesFlag = false;
                $scope.attachedFileName = null;
                $scope.saveResponseFlag = false;
                searchTextChange();
            }
            $scope.reloadEmoji();
            $scope.toggleModal('share-post', false);
            sycnWallModel();    
        };
        var errorCallback = function(data, section) {
            if (data.status == "error") {
                utilityService.resetAPIError(true, data.message, section);
                $scope.errorMessages.push(data.message);
            } else if (data.data.status == 'error') {
                utilityService.resetAPIError(true, "something went wrong", section);
                if (angular.isArray(data.data.message) || angular.isObject(data.data.message)) {
                    angular.forEach(data.data.message, function(value, key) {
                        angular.forEach(value, function(v, k) {
                            $scope.errorMessages.push(v);
                        });
                    });
                } else {
                    $scope.errorMessages.push(data.data.message);
                }
            }
        };
        var successErrorCallback = function(data, list, section, isAdded, type) {
            data.status === "success" ? successCallback(data, list, section, isAdded, type) 
            	: errorCallback(data, section);
        };
        var sycnWallModel = function() {
            $scope.wall.model = wallService.buildWallModel();
        };
        var sycnSharePostModel = function() {
            $scope.wall.share.model = wallService.buildSharePostModel();
        };

        $scope.getPostDetails = function(index) {
            var url = utilityService.getValue($scope.community, 'communityId')
                ? wallService.getUrl('community') + "/" + $scope.community.communityId
                : wallService.getUrl('post')+ "?per_page=" + $scope.userpost.pageSize + "&current_page=" + index ;
            
            serverUtilityService.getWebService(url)
	            .then(function(data) {
	            	wallService.buildLikeFlagObject(data.data, $scope.logedInUserID);
                    $scope.wall.list = data.data;
                    
	            });
        };        
        $scope.getPostDetails($scope.userpost.pageIndex);
        
        var getCommunityDetails = function() {
            serverUtilityService.getWebService(wallService.getUrl('community'))
                .then(function(data) {
                    $scope.wall.community.list = CommunityService.buildCommunityDetailObject(data.data,$scope.user.loginEmpId);
                });
        };
        getCommunityDetails();

        $scope.resetImage = function(model) {
            model.attachment = null;
            $scope.attachedFileName = null;
        };

        $scope.getTypeOfPosting = function(postingType, model) {
            model.posting_as = postingType;
        };
        $scope.resetAPIError = function(status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        $scope.likeWallPost = function (item) {
            var user_id = utilityService.getStorageValue('loginUserId');
            var isUserId = _.findWhere(item.likedBy, { user_id : user_id});
            item.isVisible = false;
            resetErrorMessages();
            var likeFlag = (isUserId != undefined) ? 2 : 1;
            var url = wallService.getUrl('post') + "/" + item._id + "/" + likeFlag;
            serverUtilityService.putWebService(url)
                .then(function (data) {
                    successErrorCallback(data, $scope.wall.list, "social", false,'likepost');
                });            
        };
        $scope.getFileName = function(file){
            if (file) {
                var sizeInMB = (file.size / (1024*1024)).toFixed(2);
                if(sizeInMB > 2){
                    alert("Max file size should be only 2 MB. ");
                    $scope.wall.model.attachment = null;
                    return false;
                }
                
            	$scope.attachedFileName = file.name;
            	$scope.images = ["image/jpeg","image/png","image/jpg"];
            	$scope.videos = ["video/mp4","video/avi","video/ogg"];
            	if($scope.images.indexOf(file.type) > -1){
            		$scope.type = "image";
            		$scope.file_type = file.type;
            	}
            	if($scope.videos.indexOf(file.type) > -1){
            		$scope.type = "video";
            		$scope.file_type = file.type;
            	}
            }

        };
        $scope.bindFileChangeEvent = function() {
            $timeout(function() {
                $("input[type=file]").on('change', function() {
                    $scope.isUploaded = true;
                });
            }, 100);
        };
        $scope.updateWallPost = function() {
            if(!$scope.wall.model.description) {
                return false;
            }
            $scope.saveResponseFlag = true;
            resetErrorMessages();
            var payload = {
                    attachment: $scope.wall.model.attachment,
                    description: $scope.wall.model.description,
                    posting_as: parseInt($scope.wall.model.posting_as),
                    community_id: utilityService.getValue($scope.community, 'communityId', parseInt(1)) 
                };

            if(angular.isDefined($scope.type)){
            	payload.type = $scope.type;
            	payload.file_type = $scope.file_type;
            }
            if(payload.description === null){
                delete payload["description"];
            }
            if(payload.attachment === null){
            	delete payload["attachment"];
            }
            if ($scope.wall.model.is_badge) {
                payload.is_badge = $scope.wall.model.is_badge ? parseInt(1) : parseInt(0);
                payload.badges_details = $scope.fileOwner.ownerId;
                payload.badge_type = $scope.wall.model.badge_type;
            }
            serverUtilityService.uploadWebService(wallService.getUrl('post'),payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.wall.list, "social", true);
                    if(data.status === "success" && utilityService.getValue($scope.community, 'communityId')){
                    	++$scope.community.object.count;
                    }
                });
        };
        var getCommentDetails = function(item) {
            serverUtilityService.getWebService(wallService.getUrl('comment') + "/" + item._id)
	            .then(function(data) {	            	
	                item.comment = wallService.buildCommentLikeFlagObject(data.data,$scope.logedInUserID);
	            });
        };
        $scope.showPostComments = function(item) {
        	$scope.postId = item._id;
        	item.commentFlag = item.commentFlag ? false : true;
            $scope.reloadEmoji();
        	getCommentDetails(item);
        };
        $scope.postComment = function(item) {
            if (!item.comment) {
                return false;
            }
            $scope.saveResponseFlag = true;
        	$scope.postId = item._id;
        	item.commentFlag = true;
            var	payload = {
                post_id: item._id,
                description: item.comment,
	        };
            serverUtilityService.postWebService(wallService.getUrl('comment'),payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.wall.comment.list, "social", true, 'comment');
                    if(data.status === "success"){
                    	item.comment = null;
                        ++item.commentCount;
                    }
                });
        };
        $scope.showPostReply = function(item){
        	item.replyFlag = item.replyFlag ? false : true;
        	$scope.reloadEmoji();
        }
        $scope.postReply = function(item) { 
            if (!item.comment) {
                return false;
            }   
            $scope.saveResponseFlag = true;    	
            var	payload = {
                comment_id: item._id,
                description: item.comment,
	        };
            serverUtilityService.postWebService(wallService.getUrl('reply'), payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.wall.comment.list, "social", true, 'comment');
                    if(data.status === "success"){
                    	item.comment = null;
                    }
                });
        };
        $scope.confirmDeletePost = function (item){
            $scope.deletePostDetails = item;
            $scope.toggleModal('delete-post',true);
        }
        $scope.deletePost = function(item) {
            var url = wallService.getUrl('post') + "/" + item._id;
            serverUtilityService.deleteWebService(url)
                .then(function(data){                    
                    $scope.wall.list = utilityService.deleteCallback(data, item, $scope.wall.list);
                    if(data.status === "success"){
                        $scope.toggleModal('delete-post',false);
                        utilityService.showSimpleToast(data.message);
                        wallService.buildLikeFlagObject($scope.wall.list,$scope.logedInUserID);
                    }                    
                });
        };
        $scope.inappropriatePost = function(item) {    
            serverUtilityService.putWebService(wallService.getUrl('reportPost') + "/" + item._id)
                .then(function (data) {
                    if (data.status === 'success') {
                        $scope.inAppropriatedFlag = true;
                    }
                    successErrorCallback(data, $scope.wall.list, "social");
                });
        };        
        $scope.likePostComment = function (item) {
            var user_id = utilityService.getStorageValue('loginUserId');
            var isUserId = _.findWhere(item.comment_likes, { user_id : user_id});
            item.isVisible = false;
            resetErrorMessages();
            var likeFlag = (isUserId != undefined) ? 2 : 1,
                url = wallService.getUrl('likeComment') + "/" + item._id + "/" + likeFlag;

            serverUtilityService.putWebService(url)
                .then(function (data) {
                    successErrorCallback(data, $scope.wall.list, "social", false, 'likecomment');
                });            
        };
        $scope.deletePostComment = function(item,CommentId,list,index) {
            resetErrorMessages();
            var payload = {
                post_id : item._id,
                comment_id : CommentId,
            };
            serverUtilityService.putWebService(wallService.getUrl('comment'),payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.wall.list, "social", false, 'comment');
                    if(data.status === "success"){
                        list.splice(index, 1);
                        --item.commentCount;
                    }
                });
        };
        $scope.deletePostCommentReply = function(comm,replyId,replyList,index) {
            var url = wallService.getUrl('reply') + '/' + comm._id + '/' + replyId;
            serverUtilityService.deleteWebService(url)
                .then(function (data) {
                    if(data.status === "success"){
                        replyList.splice(index, 1);
                        utilityService.showSimpleToast(data.message);
                    }
                });
        };
        $scope.toggleModal = function(id, flag, type, item, form) {
            if(angular.isDefined(form)) {
                utilityService.resetForm(form);
            }
            item = angular.isDefined(item) ? item : null;
            if(type == 'share' && item){
                sycnSharePostModel();
            	$scope.postDetails = item;
            }
            if(type == 'likes' && item){
                $scope.likeDetails = item.likedBy;
            }
            flag ? $('#' + id).appendTo("body").modal('show')
                : $('#' + id).modal('hide');
        };
        var getbadgesDetails = function() {
            serverUtilityService.getWebService(wallService.getUrl('badges'))
                .then(function(data) {
                    $scope.wall.badges = data.data;
                });
        };
        getbadgesDetails();
        $scope.sharePost = function (item) {
            resetErrorMessages();
            var url = wallService.getUrl('share'),
                payload = {
                    post_id: item._id,
                    share_type: $scope.wall.share.model.share_type,
                    description: $scope.wall.share.model.description,
                    community_id: $scope.wall.share.model.share_type === 1 
                        ? item.community_id : $scope.wall.share.model.community_id
                };
            
            serverUtilityService.postWebService(url, payload)
                .then(function (data) {
                    successErrorCallback(data, $scope.wall.list, "social", true);
                });            
        };
        // $scope.load = function(){
        //    $scope.reloadEmoji(true);
        // };
       angular.element(document).ready(function () {
       	 $timeout(function (){
                    $scope.reloadEmoji(true)
                },1000);
	    });
        $scope.createBadgesPost = function(badges,model){
            $scope.badgesFlag = true;
            $scope.attachedFileName = null;
            if(angular.isDefined(badges)){
                $scope.badgesDetail = badges;
                model.is_badge = true;
                model.badge_type = badges.badge_type;
            }
        };
        $scope.resetBadgesFlag = function(model){
            $scope.badgesFlag = false;
            $scope.badgesDetail = null;
            model.is_badge = false;
        };
        $scope.getbadgeImage = function(type) {
            var image = null
            angular.forEach($scope.wall.badges,function(value,key){
                if(value.badge_type == type){
                    image = value.badge_url;
                }
            });
            return image;
        };
        $scope.getbadgeMessage = function(type) {
            var message = null
            angular.forEach($scope.wall.badges,function(value,key){
                if(value.badge_type == type){
                    message = value.badge_message;
                }
            });
            return message;
        };
        /******************** Code For Autocomplete ******************/
        var getEmployeeList = function(item) {
            serverUtilityService.getWebService(wallService.getUrl('employee'))
                .then(function(data) {
                    $scope.employeeList = data.data;
                    self.repos = loadAll($scope.employeeList);
                });
        };
        getEmployeeList();

        function querySearch(query) {
            return query ? self.repos.filter(createFilterForPoc(query)) : [];
        }
        function searchTextChange(text) {
            $scope.fileOwner = {
                ownerDetails: null,
                ownerId : null,
                isChecked : false
            }; 
        }
        function selectedItemChange(item) {
            if (angular.isDefined(item) && item) {
                $scope.fileOwner.ownerId = angular.isObject(item._id)?item._id.$id:item._id;
                $scope.fileOwner.ownerDetails = item;
            }
        }        
        function loadAll() {
            var repos = $scope.employeeList;
            return repos.map(function (repo) {
                repo.value = utilityService.getValue(repo, 'full_name') ? repo.full_name.toLowerCase() : null;
                return repo;
            });
        }
        function createFilterForPoc(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }
        $scope.markedInAppropriated =function(userIdList,loggedInUser) {
            $scope.inAppropriatedFlag = userIdList && userIdList.indexOf(loggedInUser) > -1 ? true : false;
            return $scope.inAppropriatedFlag;
        };


         /********* Start Angular Modal Section *********/
         $scope.openModal = function (templateUrl, instance, size) {
            size = angular.isDefined(size) ? size : 'md';
            $scope.modalInstance[instance] = $modal.open({
                templateUrl: templateUrl,
                scope: $scope,
                windowClass: 'fadeEffect',
                size: size,
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.closeModal = function (instance) {
            if (utilityService.getValue($scope.modalInstance, instance)) {
                $scope.modalInstance[instance].dismiss();
            }
        };
        /********* End Angular Modal Section *********/

        var buildPollData = function (list) {
            angular.forEach(list, function(value) {
                if(angular.isObject(value.show_result)) {
                    value['graphData'] = wallService.buildPollGraph(value);
                    value['graphVisible'] = true;
                } else {
                    if(angular.isDefined(value.show_result)) {
                        value['show_result'] = utilityService.getValue(value, 'show_result')
                        value['showFeedback'] = true;
                    }
                }
            })

            return list
        }

        var getPollList = function () {
            serverUtilityService.getWebService(wallService.getUrl('getPoll'))
                .then(function(response) {
                    $scope.poll.list = buildPollData(response.data);
                    $scope.poll.visible = true; 
             });
        }
        getPollList()

        var syncPollData = function(data, item) {
            item['has_answered'] = utilityService.getValue(data, 'has_answered');
            if(angular.isObject(data.show_result)) {
                item['graphData'] = wallService.buildPollGraph(data);
                item['graphVisible'] = true;
            } else {
                if(angular.isDefined(data.show_result)) {
                    item['show_result'] = utilityService.getValue(data, 'show_result')
                    item['showFeedback'] = true;
                }
            }
        }

        $scope.submitPollAnswer = function (selected, item) {
            var urlSuffix = item.polls_details.poll_id;
            var concatedQuestionId = item.question_details._id;
            var url = wallService.getUrl('putPoll')  + "/" + urlSuffix,
                payload = { };

            payload["question_" + concatedQuestionId] = selected;

            serverUtilityService.putWebService(url, payload)
            .then(function (response) {
                if(utilityService.getValue(response, 'status') === 'success') {
                    syncPollData(response.data, item);
                }
            });    
        }
        var getSurveyList = function () {
            serverUtilityService.getWebService(wallService.getUrl('getSurvey'))
                .then(function(response) {
                    $scope.survey.list =response.data;
                    $scope.survey.hasMap = wallService.surveyHasMap(response.data)
                    $scope.survey.visible = true; 
             });
        }
        getSurveyList()

        var getUserAllPostCount = function() {
            var url = wallService.getUrl('getPostCount')
                serverUtilityService.getWebService(url)
                    .then(function (data) {
                        $scope.userpost.recordCount = data.data
                    });
        } 
        getUserAllPostCount();

        $scope.pages = function(tr,pp){
           return Math.ceil(tr / pp);
        }

        var syncSurveyData = function(data, item) {
            angular.forEach( $scope.survey.list, function(value) {
                if(utilityService.getInnerValue(value, 'surveyDetail', 'survey_id') === utilityService.getValue(data, 'survey_id')) {
                    value['surveyDetail']['hasAnswered'] = utilityService.getValue(data, 'hasAnswered')
                }
            })

            $scope.closeModal('surveyForm');
        }

        $scope.surveyResponseErrors=null

        $scope.submitSurveyAnswer = function (item, draft) {
            var urlSuffix = item.survey_id;
            var url = wallService.getUrl('putSurvey')  + "/" + urlSuffix;
            var payload = wallService.buildSurveyPayload(item.question_detail)
            payload['status'] = draft ? 2 : 3;
            serverUtilityService.putWebService(url, payload)
            .then(function (response) {
                if(utilityService.getValue(response, 'status') === 'success') {
                    syncSurveyData(response.data, item);
                    if(response.message){
                        utilityService.showSimpleToast(response.message); 
                    }
                }
                else
                {
                    console.log(response)
                    $scope.surveyResponseErrors=response.data.message
                }
            });    
        }

        $scope.participateInSurvey = function(id) {
            $scope.survey.selectedForm = $scope.survey.hasMap[id];
            console.log($scope.survey.selectedForm)
            $scope.surveyResponseErrors=null
            $scope.openModal('survey-form.tmpl.html', 'surveyForm', 'lg');
        }

        $scope.nextItem = function (item) {
            if ($scope[item].index >= $scope[item].list.length - 1) {
                $scope[item].index = 0;
            } else {
                $scope[item].index++;
            }
        };

        $scope.previousItem = function (item) {
            if($scope[item].index <= 0) {
                $scope[item].index = $scope[item].list.length - 1;
            } else{
                $scope[item].index--;
            }
        }

    
    }
]);