app.service('ScreenshotIndividualService', ['utilityService','SCREENSHOT_CHARTS', function (utilityService,SCREENSHOT_CHARTS) {
    this.url = {
        summary: 'timeattendance/employee/wfh-screenshots/graph',
        details: 'timeattendance/employee/wfh-pc-info',
        updateProductiveStatus: 'timeattendance/manager/update-wfh-pc-apps',
        markProcessInBulk: 'timeattendance/manager/save-wfh-pc-apps',
        getScreenshotMyTeam: 'timeattendance/manager/wfh-pc-info',
        getMyTeam: 'myteam/employee_detail',
        getScreenshotCollection: 'timeattendance/employee/wfh-screenshots',
        getNthScreenshot: 'timeattendance/employee/wfh-single-screenshots',/*  /{ss_id}/{number_of_screenshot}   */
        getSlotData:'timeattendance/admin/wfh-screenshot/15-min-slot-data', // {employee_id}/{date}
    };

    var qandle_process_names=['QandleRunningTime']
    this.getUrl = function (apiUrl) {
        return getAPIPath() + this.url[apiUrl];
    };
    this.buildScreenshotObject = function (routeData) {
        return {
            dailyView: this.buildDailyViewObject(),
            weeklyView: this.buildWeeklyViewObject(),
            monthMapping: this.buildMonthMapping(),
            tabname: routeData.mode || 'daily-view',
            view_mode: routeData.mode,
            teamList: null,
            employee: null
            // start_date: routeData.start_date,
            // end_date: routeData.end_date
        };
    };

    /* Daily View Start */

    this.buildDailyViewObject = function () {
        return {
            breakdownSummary: null,
            breakdownList: [],
            filteredBreakdownList: [],
            visible: false,
            propertyName: '',
            reverse: false,
            duration: this.buildDailyViewDurationObject(), // ** Not Done **
            graph: {},
            employee_name: null,
            employee_code: null,
            isChecked: false,
            xcategories: ['Productive', 'Non-Productive', 'Idle', 'Qandle Running Time'],
            selectedCount: 0,
            summaryEnabled: true,
            summary: null,//this.getDummyData().data,
            summaryVisible: false,
            slotData:null,
            slotDataVisible:false
        };
    };

    this.buildSlotChartData=function (model) {
		
		var data=[
			{
				name:"Productive",
				data:[]
			},
			{
				name:"Non-Productive",
				data:[]
			},
			{
				name:"Idle time",
				data:[]
			}
		]

		var timeSlots=[]
		var timeSlotHash={}
		model.slot_data.map(function (item) {
			var slotData={
				productive:0,
				non_productive:0,
				idle:item.idle_time
			}
			timeSlots.push(item.calc_start_time)
			timeSlotHash[item.calc_start_time]=item.start_time
			item.apps.map(function (app) {
				setSlotData(slotData,app)
			})
			data[0].data.push(slotData.productive)
			data[1].data.push(slotData.non_productive)
			data[2].data.push(slotData.idle)
		})
		// console.log(timeSlotHash)
		return {
			timeSlots:timeSlots,
			data:data,
			timeSlotHash:timeSlotHash,
			mostProductive:model.most_productive_hour,
			leastProductive:model.least_productive_hour

		}
	}

	var setSlotData=function (model,app) {
		switch(app.status)
		{
			case 1:model.productive+=app.duration
					break;
			case 2:model.non_productive+=app.duration
					break;
			
		}
	}

    this.buildDailyBreakdown = function (model) {
        var apps = utilityService.getValue(model, 'apps', []),
            list = [];

        apps.map(function (app) {
            // 1 => Productive, 2=> Non-Productive, 3=> Idle
            if (!app.is_parent) {
                console.log('not parent')
                if(app.name=='SystemIdleTime') 
                {
                    console.log('idle type')
                    app.display_status=3
                    app.productive_duration=0
                    app.non_productive_duration=0
                    app.idle_duration=app.duration
                }   
                else if(qandle_process_names.indexOf(app.name)!=-1)
                {
                    console.log('qandle type',app.name)
                    app.display_status=5
                    app.productive_duration=app.duration
                    app.non_productive_duration=0
                    app.idle_duration=0
                }
                else
                {
                    if (utilityService.getValue(app, 'is_productive') === true ) {
                        app.display_status = 1;
                    } else if (utilityService.getValue(app, 'is_productive') === false) {
                        app.display_status = 2;
                    }
                    if (utilityService.getValue(app, 'is_productive') === true) {
                        app.non_productive_duration = 0
                        app.productive_duration = app.duration
                        app.idle_duration=0
                    }
                    else if (utilityService.getValue(app, 'is_productive') === false) {
                        app.non_productive_duration = app.duration
                        app.productive_duration = 0
                        app.idle_duration=0
                    }
                }

                

            }
            else {
                app.display_status = 4
                app.non_productive_duration = app['non-productive_duration']
                app.productive_duration = app.productive_duration
                app.idle_duration=0

            }
            app.def_status=app.display_status
            list.push(app)
        })

        return {
            list: list,
            count: utilityService.buildAppCountObject(apps,model.hours)
        };
    };

    this.buildMiniCharts=function (model) {
		return{
			top:{
				time_at_work:{title:'Total Work Time',data:utilityService.getValue(model,'time_at_work',null),color:SCREENSHOT_CHARTS.miniCharts.time_at_work},
				effectiveness: {title:'Effectiveness',data:utilityService.getValue(model,'effectiveness',null),color:SCREENSHOT_CHARTS.miniCharts.effectiveness},
				productivity: {title:'Productivity',data:utilityService.getValue(model,'productivity',null),color:SCREENSHOT_CHARTS.miniCharts.productivity},
			},
			bottom:{
				
				arrival_time: {title:'Arrival Time',data:utilityService.getValue(model,'arrival_time',null),color:SCREENSHOT_CHARTS.miniCharts.arrival_time},
				left_time: {title:'Left Time',data:utilityService.getValue(model,'left_time',null),color:SCREENSHOT_CHARTS.miniCharts.left_time},
				productive_time:{title:'Productive Time',data:utilityService.getValue(model,'productive_time',null),color:SCREENSHOT_CHARTS.miniCharts.productive_time},
				desktime: {title:'Desk Time',data:utilityService.getValue(model,'desktime',null),color:SCREENSHOT_CHARTS.miniCharts.desktime},
			}
		}
	}

    this.buildDailyViewDurationObject = function (date) {
        return this.buildDateObject(angular.isDefined(date) ? date : new Date());
    };

    this.buildDailyViewParams = function (duration) {
        var startTimestamp = (new Date(duration.month + '/' + duration.date + '/' + duration.year + ' 00:00:00')).getTime(),
            endTimestamp = (new Date(duration.month + '/' + duration.date + '/' + duration.year + ' 00:00:00')).getTime();

        return {
            from_date: startTimestamp / 1000,
            to_date: endTimestamp / 1000
        };
    };


    this.buildDailyGraphData = function (model) {
        if (model.hours) {

            var graphData = [
                {
                    name: 'Productive',
                    data: [this.modifiedDuration(model.hours.productive)],
                    color: '#70a43d'
                },
                {
                    name: 'Non-Productive',
                    data: [this.modifiedDuration(model.hours.non_productive)],
                    color: '#db4300'
                },
                {
                    name: 'Idle',
                    data: [this.modifiedDuration(model.hours.idle)],
                    color: 'grey'//
                },
                {
                    name:'Qandle Running Time',
                    data:[this.modifiedDuration(model.hours.qandle_running_time)],
                    color:'#007ee5'
                }
                // ,
                // {
                //     name: 'Qandle Running Time',
                //     data: [this.modifiedDuration(model.hours.qandle_running_time)],
                //     color: '#115858'
                // }
            ];

            return graphData;
        } else {
            return []
        }
    };

    /* Daily View End */

    /* Weekly View Start */

    this.buildWeeklyViewObject = function () {
        return {
            breakdownSummary: null,
            breakdownList: [],
            visible: false,
            filteredBreakdownList: [],
            propertyName: '',
            reverse: false,
            duration: this.buildWeeklyViewDurationObject(),
            graph: {},
            employee_name: null,
            employee_code: null,
            isChecked: false,
            xcategories: ['Productive', 'Non-Productive', 'Idle', 'Qandle Running Time'],
            selectedCount: 0,

            summaryEnabled: false
        };
    };

    // this.buildCountObject = function (list) {
    //     var count = {
    //         total: {d:0,c:0},
    //         productive: {d:0,c:0},
    //         non_productive: {d:0,c:0},
    //         idle:{d:0,c:0}

    //     }

    //     list.map(function (app) {
    //         if (!app.is_parent) {
    //             if (app.is_productive && !(app.display_status==5 || app.display_status==3)) {
    //                 count.productive.c += 1
    //             }
    //             else if (!app.is_productive && !(app.display_status==5 || app.display_status==3)) {
    //                 count.non_productive.c += 1
    //             }
    //             // else
    //             // {
    //             //     count.non_productive.c += 1
    //             // }
    //             // else if(!app.is_productive && qandle_process_names.indexOf(app.name)!=-1)
    //             // {
    //             //     count.productive.c+=1
    //             // }
    //             count.total.c += 1
    //             count.idle.c+=(app.idle_duration>0)?1:0

    //             console.log('APP:',app.productive_duration,app.non_productive_duration,app.idle_duration)
    //             count.productive.d+=(app.display_status!==5?app.productive_duration:0) //app.duration
    //             count.non_productive.d+=app.non_productive_duration
    //             count.idle.d+=app.idle_duration
    //             count.total.d+=(app.display_status==5?app.productive_duration:0)
    //         }
    //         else {
    //             app.child_process.map(function (child) {
    //                 if (child.is_productive) {
    //                     count.productive.c += 1
    //                     count.productive.d+=child.duration
    //                 }
    //                 else if (!child.is_productive) {
    //                     count.non_productive.c += 1
    //                     count.non_productive.d+=child.duration
    //                 }
    //                 count.total.c += 1
    //                 console.log('CHILD:',child.productive_duration,child.non_productive_duration)
                    
                    
    //                 //count.total.d+=child.duration


    //             })
    //         }
    //     })
    //     return count
    // }


    this.buildWeeklyBreakdown = function (model) {
        var apps = utilityService.getValue(model, 'apps', []),
            list = [];

        apps.map(function (app) {
            // 1 => Productive, 2=> Non-Productive, 3=> Idle, 4=>Parent, 5=> Qandle
            
            if (!app.is_parent) {
                if(app.name=='SystemIdleTime') 
                {
                    
                    app.display_status=3
                    app.productive_duration=0
                    app.non_productive_duration=0
                    app.idle_duration=app.duration
                    console.log('lol',app)

                }
                else if(qandle_process_names.indexOf(app.name)!=-1)
                {
                    console.log('qandle type')
                    app.display_status=5
                    app.productive_duration=app.duration
                    app.non_productive_duration=0
                    app.idle_duration=0
                }
                else
                {
                    if (utilityService.getValue(app, 'is_productive')) {
                        app.display_status = 1;
                    } else if (!utilityService.getValue(app, 'is_productive')) {
                        app.display_status = 2;
                    }
                    
                    if (utilityService.getValue(app, 'is_productive') === true) {
                        app.non_productive_duration = 0
                        app.productive_duration = app.duration
                        app.idle_duration=0
                    }
                    else if (utilityService.getValue(app, 'is_productive') === false) {
                        app.non_productive_duration = app.duration
                        app.productive_duration = 0
                        app.idle_duration=0
                    }
                } 
                

            }
            else {
                app.display_status = 4
                app.non_productive_duration = app['non-productive_duration']
                app.productive_duration = app.productive_duration
                app.idle_duration=0

            }
            app.def_status=app.display_status
            list.push(app)
        })

        return {
            list: list,
            count:utilityService.buildAppCountObject(apps,model.hours)
        };
    };
    this.buildWeeklyViewDurationObject = function () {
        var date = utilityService.getPreviousMondayDate(),
            start = this.buildDateObject(date),
            end = {};

        angular.copy(start, end);

        return {
            start: start,
            end: this.buildDateObject(this.addSubtractDays(end.fullDate, 6, '+'))
        };
    };

    this.buildWeeklyViewParams = function (duration) {
        var startTimestamp = (new Date(duration.start.month + '/' + duration.start.date + '/' + duration.start.year + ' 00:00:00')).getTime(),
            endTimestamp = (new Date(duration.end.month + '/' + duration.end.date + '/' + duration.end.year + ' 00:00:00')).getTime();

        return {
            from_date: startTimestamp / 1000,
            to_date: endTimestamp / 1000
        };
    };

    this.buildWeeklyGraphData = function (model) {
        if (model.hours) {

            var graphData = [
                {
                    name: 'Productive',
                    data: [this.modifiedDuration(model.hours.productive)],
                    color: '#70a43d'
                },
                {
                    name: 'Non-Productive',
                    data: [this.modifiedDuration(model.hours.non_productive)],
                    color: '#db4300'
                },
                {
                    name: 'Idle',
                    data: [this.modifiedDuration(model.hours.idle)],
                    color: 'grey'//
                },
                {
                    name:'Qandle Running Time',
                    data:[this.modifiedDuration(model.hours.qandle_running_time)],
                    color:'#007ee5'
                }
                // ,
                // {
                //     name: 'Qandle Running Time',
                //     data: [this.modifiedDuration(model.hours.qandle_running_time)],
                //     color: '#115858'
                // }
            ];

            return graphData;
        } else {
            return []
        }
    };
    /* Weekly View End */


    this.buildDateObject = function (date) {
        return {
            date: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            fullDate: date
        };
    };
    this.statusColor = function (status) {
        switch (status) {
            case 1:
                return '#00ff00';

            case 2:
                return '#ff0000';

            case 3:
                return '#0000ff';

            default:
                return '#00ff00';
        }
    };
    this.modifiedDuration = function (duration) {
        return Math.floor(duration);
    };



    this.addSubtractDays = function (date, days, operator) {
        if (operator === '+') {
            date.setDate(date.getDate() + days);
        } else {
            date.setDate(date.getDate() - days);
        }

        return date;
    };
    this.buildMonthMapping = function () {
        return {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        };
    };



    this.extractProcessName = function (list) {
        var process = [];

        angular.forEach(list, function (app, key) {
            if (app.isChecked) {
                process.push(app.name);
            }
        });

        return process;
    };
    this.buildMarkProcessInBulkPayload = function (list) {
        return {
            apps: this.extractProcessName(list)
        };
    };

    this.buildChildProcessListing = function (app) {
        app.child_process.map(function (child) {
            if (utilityService.getValue(child, 'is_productive') === true) {
                child.display_status = 1;
            } else if (utilityService.getValue(child, 'is_productive') === false) {
                child.display_status = 2;
            } else {
                child.display_status = 3;
            }
            child.def_status=child.display_status
            child.isChecked = false
        })
        return {
            title: app.name,
            list: app.child_process,
            isChecked: false,
            selectedCount: 0
        }
    }

    /* Cmparison Object Start */
    this.buildComparisonModel = function (model, viewMode) {
        return {
            employees: {
                employee1: null,
                employee2: null
            },
            team: null,
            selectedEmployee: null
        }
    }

    this.buildComparisonEmployee = function (_id, name, emp_code, hours) {
        return {
            _id: _id,
            name: name,
            employee_code: emp_code,
            stats: this.buildStatsObject(hours),
            total_time_expanded: false
        }
    }

    this.buildStatsObject = function (stats) {
        var total_work_time = stats.productive + stats.non_productive + stats.idle

        return {
            total_work_time: total_work_time,
            productive: stats.productive,
            productive_percentage: (stats.productive / total_work_time) * 100,
            non_productive: stats.non_productive,
            idle: stats.idle,
            total_desktop_time: total_work_time - stats.idle
        }
    }
    /* Cmparison Object End */

    this.buildScreenshotCarousel = function (model) {
        return {
            employee_name: model.employee_name,
            employee_code: model.employee_code,
            collectionId: model.ss_id,
            currentScreenshotUrl: null,
            currentScreenshotDate: null,
            currentScreenshotNum: 0,
            totalCount: model.ss_count,
            loadingImage: false
        }
    }

    



}])