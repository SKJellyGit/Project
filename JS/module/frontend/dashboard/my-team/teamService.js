app.service('TeamService', [
	'utilityService',        
	function (utilityService) {
		'use strict';

        this.url = {
        	relationship: 'user-management/active/profile-field',
        	ownTeam: 'myteam/detail',
        	employeeTeam: 'myteam/detail-by-emp',
        	permission: 'permission/myteam'
        };
        this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };
	    this.buildRelationshipObject = function() {
	    	return {
	            primary: {
	                list: [],
	                model: null
	            },
	            secondary: {
	                list: [
	                    {
	                        id: 1,
	                        slug: "direct_reportee",
	                        /*name: "Direct Reportee"*/
	                        name:"Direct Report(s)"
	                    },
	                    {
	                        id: 2,
	                        slug: "entire_team",
	                        name: "Entire Team"
	                    }
	                ],
	                model: {
                        id: 1,
                        slug: "direct_reportee",
                        name: "Direct Reportee"
                    }
	            },
	            permission: {
	            	content: null
	            },
	            overview: {
	            	visible: false
	            }
	        }
	    };
	    this.buildTeamObject = function() {
	    	return {
	            list: [],
	            visible: false,
	            toggle: false
	        }
	    };
	    this.buildProfileObject = function() {
	    	return {
	            selectedIndex: -1,
	            detail: null
	        }
	    };
	    this.isMyTeamCompensationAccessible = function() {
	    	var empIds = ["58db7a9939473eae4e8b6311", "5911ce4639473e0769851432"];
	    	return empIds.indexOf(utilityService.getValue(localStorage, 'empId')) >= 0 ? true : false;
	    	//return true;
	    };
	    this.buildMyTeamPermissionObject = function(permission) {
	    	/*TODO: Need to delete the following line once my team compasation permission 
	    	will be introduced through backend */
	    	if(this.isMyTeamCompensationAccessible() && permission.length) {
	    		permission.work_profile_reporting_manager.push("can_view_my_team_compensation");
			}	    	
			
            var object = {},
                list = ["can_view_my_team_attendance", "can_view_my_team_leaves", 
                	"can_view_my_team_provisions", "can_view_my_team_compensation"];
            
            angular.forEach(permission, function(value, key) {
                object[key] = {};
                angular.forEach(value, function(v, k) {
                    if(list.indexOf(v) >= 0 || v) {
                        object[key][v] = true;
                    }
                });
            });
            return object;
        };	    
	    return this;
	}
]);
