app.service('ScreenshotComparisonService', ['utilityService','SCREENSHOT_CHARTS',function (utilityService,SCREENSHOT_CHARTS) {

	console.log('COMPARISON SERVICE')
	//Add any REST api endpoints here
	this.url = {
		getMyTeam: 'myteam/employee_detail',
		stats: 'timeattendance/employee/wfh-pc-info',
		summary: 'timeattendance/employee/wfh-screenshots/graph',
		getSlotData:'timeattendance/admin/wfh-screenshot/15-min-slot-data' // {employee_id}/{date}
	};



	//Use url in controller based on the domain being used
	this.getUrl = function (apiUrl) {
		return getAPIPath() + this.url[apiUrl];
	};

	this.buildComparisonObject = function (routeData) {
		return {
			dailyView: this.buildDailyViewObject(),
			weeklyView: this.buildWeeklyViewObject(),
			monthMapping: this.buildMonthMapping(),
			tabname: 'daily-view',
			teamList: null,
			selectedEmployee:null

			// start_date: routeData.start_date,
			// end_date: routeData.end_date
		};
	};

	this.buildDailyViewObject = function () {
		return {

			visible: false,
			duration: this.buildDailyViewDurationObject(), // ** Not Done **
			candidates: [],
			slotChartVisible:false,
			summaryVisible:false
		};
	};

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


	this.buildWeeklyViewObject = function () {
		return {

			visible: false,
			duration: this.buildWeeklyViewDurationObject(),
			candidates: []

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

	this.buildDefaultCandidate = function (employee) {
		return {
			
			visible: false, 
			details: employee,
			stats: null,
			slotData:null,
			summary:null
			
		}
	}

	this.buildWeeklyViewParams = function (duration) {
		var startTimestamp = (new Date(duration.start.month + '/' + duration.start.date + '/' + duration.start.year + ' 00:00:00')).getTime(),
			endTimestamp = (new Date(duration.end.month + '/' + duration.end.date + '/' + duration.end.year + ' 00:00:00')).getTime();

		return {
			from_date: startTimestamp / 1000,
			to_date: endTimestamp / 1000
		};
	};



	this.buildDateObject = function (date) {
		return {
			date: date.getDate(),
			month: date.getMonth() + 1,
			year: date.getFullYear(),
			fullDate: date
		};
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

	this.buildMiniCharts=function (model) {
		return{
			
				time_at_work:{title:'Total Work Time',data:utilityService.getValue(model,'time_at_work',null),color:SCREENSHOT_CHARTS.miniCharts.time_at_work},
				effectiveness: {title:'Effectiveness',data:utilityService.getValue(model,'effectiveness',null),color:SCREENSHOT_CHARTS.miniCharts.effectiveness},
				productivity: {title:'Productivity',data:utilityService.getValue(model,'productivity',null),color:SCREENSHOT_CHARTS.miniCharts.productivity},				
				arrival_time: {title:'Arrival Time',data:utilityService.getValue(model,'arrival_time',null),color:SCREENSHOT_CHARTS.miniCharts.arrival_time},
				left_time: {title:'Left Time',data:utilityService.getValue(model,'left_time',null),color:SCREENSHOT_CHARTS.miniCharts.left_time},
				productive_time:{title:'Productive Time',data:utilityService.getValue(model,'productive_time',null),color:SCREENSHOT_CHARTS.miniCharts.productive_time},
				desktime: {title:'Desk Time',data:utilityService.getValue(model,'desktime',null),color:SCREENSHOT_CHARTS.miniCharts.desktime},
			
		}
	}


}])
