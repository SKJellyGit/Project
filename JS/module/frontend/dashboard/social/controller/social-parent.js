app.controller('SocialParentController', [
    '$scope', '$timeout', '$q', '$sce', 'DashboardService', 'utilityService', 'ServerUtilityService', 
    function($scope, $timeout, $q, $sce, DashboardService, utilityService, serverUtilityService) {
        
        $scope.socialObj = DashboardService.buildSocialSettingObject();
        $scope.sytemInfo = {
            notify_birthday: true,
            notify_work_anniversary: true
        };
        $scope.settingFlag = false;   
        var getSysInfo = function () {
            serverUtilityService.getWebService(DashboardService.getUrl('getSysInfo'))
                .then(function (data){
                    $scope.sytemInfo = data.data;
                });
        };
        // This call has been commented beacause we have assumed that, both the settings will be always true
        //getSysInfo();
        var toggleEmojiContainer = function(flag) {
            $scope.emoji.visible = flag;
        };
        $scope.reloadEmoji = function(isPageLoad) {
            console.log('emoji loaded');
            isPageLoad = angular.isDefined(isPageLoad) ? isPageLoad : false;            
            if(!isPageLoad) {
                $(".emoji-wysiwyg-editor").html('');
            }         
            $timeout(function() {                
                window.emojiPicker = new EmojiPicker({
                    emojiable_selector: '[data-emojiable=true]',
                    assetsPath: '../../images/emoji/',
                    popupButtonClasses: 'fa fa-smile-o'
                });
                window.emojiPicker.discover();
            }, 500);
        };
        var getWallSetting = function() {
            $q.all([
                serverUtilityService.getWebService(DashboardService.getUrl('wallSetting')), 
                serverUtilityService.getWebService(DashboardService.getUrl('communitySetting'))
            ]).then(function(data) {   
                $scope.socialObj.wall = data[0].data;                     
                $scope.socialObj.community = data[1].data;
                $scope.socialObj.tab.isSet = $scope.socialObj.wall.is_social_wall 
                    ? 1 : ($scope.socialObj.community.is_communities ? 2
                        : $scope.socialObj.wall.is_crowd_solve ? 4 : null);
                
                if($scope.socialObj.wall || $scope.socialObj.community) {
                    $scope.settingFlag = true;
                }
                $scope.commuityHasMap = [{
                    id: 1,
                    key: $scope.socialObj.community.public,
                    name: "Public",
                    icon_name: "public"
                }, {
                    id: 2,
                    key: $scope.socialObj.community.moderate,
                    name: "Moderated",
                    icon_name: "lock"
                }, {
                    id: 3,
                    key: $scope.socialObj.community.private,
                    name: "Private",
                    icon_name: "visibility"
                }];
                $scope.socialObj.wall.facebook_code = $sce.trustAsHtml($scope.socialObj.wall.facebook_code);
                $scope.socialObj.wall.twitter_user_code = $sce.trustAsHtml($scope.socialObj.wall.twitter_user_code);
                $scope.socialObj.wall.linkedin_company_profile_code = $sce.trustAsHtml($scope.socialObj.wall.linkedin_company_profile_code);
            });
        };        
        getWallSetting();
        $scope.setTab = function(tab){
            $scope.socialObj.tab.isSet = tab;
        }
        /*$scope.getTwitterCode = function(){
            return $sce.trustAsHtml($scope.socialObj.wall.twitter_user_code);
        }*/
    }
]);