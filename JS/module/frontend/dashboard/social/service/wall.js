app.service('SocialWallService', ['utilityService',
    function (utilityService) {
        'use strict';

        this.url = {
            post: 'social-frontend/post',
            comment: 'social-frontend/comment',
            likeComment: 'social-frontend/like-comment',
            share : 'social-frontend/share-post',
            reply : 'social-frontend/reply',
            community: 'social-frontend/community',
            employee: 'user-addition/users-preview',
            badges:'social-frontend/badges',
            reportPost: 'social-frontend/report-post',
            getPoll: 'polls-and-surveys/get-poll',
            getSurvey: 'polls-and-surveys/get-survey',
            putPoll: 'polls-and-surveys/post-poll',
            putSurvey: 'polls-and-surveys/post-survey',
            getPostCount:'social-frontend/total-post',
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };

        this.buildWallModel = function(model){
            return {
                _id: utilityService.getValue(model, '_id'),
                description: utilityService.getValue(model, 'description'),
                posting_as: utilityService.getValue(model, 'posting_as',1),
                attachment: utilityService.getValue(model, 'attachment'),
                community_id: utilityService.getValue(model, 'community_id',1),
                comment: null,
                badges_details: utilityService.getValue(model, 'badges_details'),
                is_badge: utilityService.getValue(model, 'is_badge',false),
                badge_type: utilityService.getValue(model, 'badge_type')
            }
        };
        this.buildWallCommentModel = function(model){
            return {
                _id: utilityService.getValue(model, '_id'),
                description: utilityService.getValue(model, 'description')
            }
        };
        this.buildReplyModel = function(model){
            return {
                _id: utilityService.getValue(model, '_id'),
                description: utilityService.getValue(model, 'description')
            }
        };
        this.buildSharePostModel = function(model){
            return {
                post_id: utilityService.getValue(model, 'post_id'),
                share_type: utilityService.getValue(model, 'share_type'),
                description: utilityService.getValue(model, 'description'),
                community_id: utilityService.getValue(model, 'community_id')
            }
        };
        this.buildWallObject = function(){
            return {
                model: this.buildWallModel(),
                list: [],
                postingAs: [{
                        id: 1,
                        name: "My Self"
                    },
                    {
                        id: 2,
                        name: "Anonymous"
                    }
                ],
                comment : {
                    model : this.buildWallCommentModel(),
                    list : []
                },
                share : {
                    type : [
                        {
                            id: 1,
                            name: "Share on your Wall"
                        },
                        {
                            id: 2,
                            name: "Share in a Community"
                        }
                    ],
                    model : this.buildSharePostModel()

                },
                reply: {
                    model : this.buildReplyModel(),
                    list : []
                },
                community: {
                    list: []
                }
            }
        };
        this.buildLikeFlagObject = function(data, logedInUserID) {
            if(data.length) {
                angular.forEach(data,function(value,key) {
                    value.commentFlag = false;
                    value.isVisible = true;
                    value.isLike = null;
                    if(value.likedBy.length) {
                        angular.forEach(value.likedBy,function(val,k) {
                            value.isLike = val._id == logedInUserID ? 1 : 2;
                        });
                    } else {
                        value.isLike = null;
                    }
                });
            }
            return data;
        };

        this.buildCommentLikeFlagObject = function(data, logedInUserID) {
            if(data.length) {
                angular.forEach(data,function(value,key) {
                    value.replyFlag = false;
                    value.isVisible = true;
                    if(angular.isDefined(value.comment_likes) && value.comment_likes.length) {
                        angular.forEach(value.comment_likes,function(val,k){
                            value.isLike = val._id == logedInUserID ? 1 : 2;
                        });
                    } else {
                        value.isLike = null;
                    }
                });
            }
            return data;
        };
        this.range = function (min, max) {
            var input = [],
                min = parseInt(min),
                max = parseInt(max);

            for (var i = min; i <= max; i++) {
                if(i % 5 == 0)
                    input.push(i);
            }
            return input;
        };
        this.buildPaginationObject = function() {
            return  {
                pagination : {
                    currentPage : 1,
                    numPerPage : 10,
                    maxSize : 5,
                    range : selfServive.range(1,21)
                }
            }
        };        

        this.surveyHasMap = function(list) {
            var obj = {};

            angular.forEach(list, function(value, key){
                obj[value.surveyDetail.survey_id] = value.surveyDetail
            })
            return obj
        }

        this.pollHasMap = function(list) {
            var obj = {};

            angular.forEach(list, function(value, key){
                obj[value.polls_details.poll_id] = value
            })
            return obj
        }

        var modifyDataPoints=function (value,count) {
            return ((value/count))*100
        }

        this.buildPollGraph = function (poll) {
            var obj = {
                categories: [],
                graph: []
            }
            var hash={}
            var options = poll.question_details.options;
            var answeredBy=poll.show_result.total-poll.show_result.not_answered
            if(!answeredBy) // will return data null for any false value of answered
            {
                obj.graph=null
                return obj
            }

            angular.forEach(options, function(value, key) {
                var count = angular.isDefined(poll.show_result[value.id]) ? poll.show_result[value.id] : 0;
                obj.categories.push(value.name)
                obj.graph.push(modifyDataPoints(count,answeredBy));
                var catKey=value.name
                var catValue=poll.show_result[value.id]
                hash[catKey]=catValue
            })

            

            obj.overall={
                total:poll.show_result.total,
                not_answered:poll.show_result.not_answered
            }
            obj.hash=hash



            return obj;

        }

        this.buildSurveyPayload = function(list) {
            var obj = {}
            angular.forEach(list, function(value) {
                obj['question' + '_' + value.questions._id ] = value.questions.answer;
            })
            return obj
        }


        
    }
]);