app.directive('leaveChart', [ '$timeout', 
    function ($timeout) {
        return {
            link: function (scope, element, attr, ngModelCtrl) {
                $timeout(function(){
                    element.highcharts({
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'Current Leave Status'
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        },
                        yAxis: {
                            title: {
                                text: 'Leave(s)'
                            }
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: true
                                },
                                enableMouseTracking: false
                            }
                        },
                        series: [{
                            name: 'Balance',
                            color: '#910000',
                            data: [20, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8]
                        }, {
                            name: 'Used',
                            color: '#719B43',
                            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                        }]
                    });
                }, 500);
            }
        };
    }
]);

app.directive('leaveChart1', [ '$timeout', 
    function ($timeout) {
        return {
            link: function (scope, element, attr, ngModelCtrl) {
                console.log("leave chart directive loaded");
                $timeout(function(){
                    element.highcharts({
                        chart: {
                            type: 'area'
                        },
                        title: {
                            text: 'Current Leave Status'
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: ['Jan', 'Feb', 'Mar',
                                'Apr', 'May', 'Jun'],
                            tickmarkPlacement: 'on',
                            title: {
                                enabled: false
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Leaves'
                            },
                            labels: {
                                formatter: function () {
                                    //return this.value/2
                                    //return this.value / 1000;
                                    return '<strong>' + this.value + '</strong>';
                                }
                            }
                        },
                        tooltip: {
                            shared: true,
                            valueSuffix: ' '//millions
                        },
                        plotOptions: {
                            area: {
                                stacking: 'normal',
                                lineColor: '#666666',
                                lineWidth: 2,
                                marker: {
                                    lineWidth: 2,
                                    lineColor: '#666666'
                                }
                            }
                        },
                        series: [ {
                            name: 'Balance',
                            color: '#ECFEF2', //629FD2
                            data: [2, 1, 3, 5, 13, 6] //, 4, 5, 0, 5, 1, 2
                        }, {
                            name: 'Used',
                            color: '#DCF1F4', //719B43
                            data: [18, 19, 17, 15, 7, 14] //, 16, 15, 20, 15, 19, 18
                        }]
                    });
                }, 500);
            }
        };
    }
]);

app.directive('onboardingChart', [ '$timeout', 
    function ($timeout) {
        return {
            link: function (scope, element, attr, ngModelCtrl) {
                console.log("onboarding chart directive loaded");
                $timeout(function(){
                    element.highcharts({
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: 'onboarding chart'
                        },
                        subtitle: {
                            text: 'to be fixed'
                        },
                        yAxis: {
                            title: {
                                text: 'Total percent market share'
                            }
                        },
                        plotOptions: {
                            pie: {
                                shadow: false,
                                center: ['50%', '50%']
                            }
                        },
                        tooltip: {
                            valueSuffix: '%'
                        },
                        series: [{
                            name: 'Browsers',
                            data: [1, 2, 3, 4, 5]/*browserData*/,
                            size: '60%'/*,
                            dataLabels: {
                                formatter: function () {
                                    return this.y > 5 ? this.point.name : null;
                                },
                                color: '#ffffff',
                                distance: -30
                            }*/
                        }, {
                            name: 'Versions',
                            data: [1, 2, 3, 4, 5]/*versionsData*/,
                            size: '80%',
                            innerSize: '60%'/*,
                            dataLabels: {
                                formatter: function () {
                                    // display only if larger than 1
                                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                                }
                            }*/
                        }]
                    });
                }, 500);
            }
        };
    }
]);

app.directive('objectiveChart', [ '$timeout', 
    function ($timeout) {
        return {
            scope : { data : '@', additionalData: '@'},
            link: function (scope, element, attr, ngModelCtrl) {                
                $timeout(function() {                
                    scope.data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                    scope.additionalData = scope.additionalData < 10 ? '0' + scope.additionalData : scope.additionalData;
                    element.highcharts({
                        title: {
                            text: '<span style="font-weight: bold; margin-left: 20px; font-size: 18px; ">' 
                                + scope.additionalData + 
                                '</span><br/><span>Key Results</span>',
                            verticalAlign: 'middle',
                            floating: true,
                            useHTML: true,
                            style: {
                                color: "#333333", 
                                fontSize: "11px",
                                marginTop: "30px"
                            }                            
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: false,
                        labels: {
                            items: [{
                                html: '',
                                style: {
                                    left: '50px',
                                    top: '18px',
                                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                                }
                            }]
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                innerSize: 80,            
                                dataLabels: {
                                    enabled: true,
                                    distance: -50,
                                    color: '#FFFFFF',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [ {
                            type: 'pie',
                            name: 'Total',
                            data: scope.data,  
                            size: 142,
                            showInLegend: false,
                            dataLabels: {
                                enabled: false
                            }
                        }]
                    });
                }, 500);
            }
        };
    }
]);

app.directive('customPieChart', [ '$timeout', 
    function ($timeout) {
        'use strict';
        return {
            scope: {data: '@', chartConfig: '@'}, // chartConfig = {title: 'abc', subtitle: 'bcd'}
            link: function (scope, $element, $attrs){
                $timeout(function buildChart() {
                    scope.chartConfig = scope.chartConfig ? scope.chartConfig : {};
                    scope.data = scope.data ? scope.data : [];
                    var config = angular.isObject(scope.chartConfig) ? scope.chartConfig : JSON.parse(scope.chartConfig);
                    var data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                    $element.highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        title: {
                            text: config.title && config.title.length ? config.title : null
                        },
                        subtitle: {
                            text: config.subtitle && config.subtitle.length ? config.subtitle : null
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:11px">{series.name}</span>: <b>{series.total}</b><br/>',
                            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><b> ({point.percentage:.1f} %)</b>'
                        },
                        legend: {
                            align: config.legend_align && config.legend_align.length ? config.legend_align : 'center',
                            verticalAlign: config.legend_verticalAlign && config.legend_verticalAlign.length ? config.legend_verticalAlign : 'bottom',
                            layout: config.legend_layout && config.legend_layout.length ? config.legend_layout : 'horizontal',
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                },
                                showInLegend: true
                            }
                        },
                        series: [{
                            name: config.subtitle && config.subtitle.length ? config.subtitle : (config.title && config.title.length ? config.title : null),
                            colorByPoint: true,
                            data: data
                        }]
                    });
                }, 500);
            }
        };
    }
]);

app.directive('customLineChart', [ '$timeout', 
    function ($timeout) {
        'use strict';
        return {
            scope: {data: '@', chartConfig: '@'}, // chartConfig = {title: 'abc', subtitle: 'bcd'}
            link: function (scope, $element, $attrs){
                $timeout(function buildChart() {
                    scope.chartConfig = scope.chartConfig ? scope.chartConfig : {};
                    scope.data = scope.data ? scope.data : [];
                    var config = angular.isObject(scope.chartConfig) ? scope.chartConfig : JSON.parse(scope.chartConfig);
                    var data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                    $element.highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'line'
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        title: {
                            text: config.title && config.title.length ? config.title : null
                        },
                        subtitle: {
                            text: config.subtitle && config.subtitle.length ? config.subtitle : null
                        },
                        xAxis: {
                            categories: config.categories && config.categories.length ? config.categories : [], // ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            title: {
                                text: config.xTitle && config.xTitle.length ? config.xTitle : null
                            },
                            labels: {
                                format: '{value}' // '{value} m'
                            }
                        },
                        yAxis: {
                            title: {
                                text: config.yTitle && config.yTitle.length ? config.yTitle : null
                            },
                            labels: {
                                format: '{value}' // '{value} m'
                            }
                        },
                        tooltip: {
                            crosshairs: true,
                            shared: true
                        },
                        legend: {
                            align: config.legend_align && config.legend_align.length ? config.legend_align : 'center',
                            verticalAlign: config.legend_verticalAlign && config.legend_verticalAlign.length ? config.legend_verticalAlign : 'bottom',
                            layout: config.legend_layout && config.legend_layout.length ? config.legend_layout : 'horizontal',
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: true
                                },
                            },
                        },
                        series: data
                    });
                }, 500);
            }
        };
    }
]);


app.directive('customColumnChart', [ '$timeout', 
    function ($timeout) {
        'use strict';
        return {
            scope: {data: '@', chartConfig: '@'}, // chartConfig = {title: 'abc', subtitle: 'bcd'}
            link: function (scope, $element, $attrs){
                $timeout(function buildChart() {
                    scope.chartConfig = scope.chartConfig ? scope.chartConfig : {};
                    scope.data = scope.data ? scope.data : [];
                    var config = angular.isObject(scope.chartConfig) ? scope.chartConfig : JSON.parse(scope.chartConfig);
                    var data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                    var x_categories;
                    if(data.hasOwnProperty('x_categories')) {
                        x_categories = data.x_categories;
                        data = data.data;
                    }
                    var highcharts_config = {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'column'
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: true
                        },
                        title: {
                            text: config.title && config.title.length ? config.title : null
                        },
                        subtitle: {
                            text: config.subtitle && config.subtitle.length ? config.subtitle : null
                        },
                        xAxis: {
                            type: 'category',
                            title: {
                                text: config.xTitle && config.xTitle.length ? config.xTitle : null
                            },
                            labels: {
                                format: config.x_labels_format && config.x_labels_format.length ? config.x_labels_format : '{value}'
                            },
                            categories: x_categories,
                            min: 0,
                            scrollbar: {
                                enabled: true
                            },
                        },
                        yAxis: {
                            title: {
                                text: config.yTitle && config.yTitle.length ? config.yTitle : null
                            },
                            labels: {
                                format: config.y_labels_format && config.y_labels_format.length ? config.y_labels_format : '{value}'
                            },
                            stackLabels: {
                                enabled: angular.isDefined(config.column_stacking) ? true : false,
                            }
                        },
                        tooltip: {
                            enabled: angular.isDefined(config.tooltip_enabled) ? config.tooltip_enabled : true,
                            shared: true
                        },
                        legend: {
                            enabled: config.legend_enabled ? true : false,
                            align: config.legend_align && config.legend_align.length ? config.legend_align : 'center',
                            verticalAlign: config.legend_verticalAlign && config.legend_verticalAlign.length ? config.legend_verticalAlign : 'bottom',
                            layout: config.legend_layout && config.legend_layout.length ? config.legend_layout : 'horizontal',
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: angular.isDefined(config.plotOptions_dataLabels_enabled) ? config.plotOptions_dataLabels_enabled : true,
                                    format: (config.plotOptions_dataLabels_format && config.plotOptions_dataLabels_format.length) ? config.plotOptions_dataLabels_format : '{point.y}',
                                    useHTML: true
                                }
                            },
                            column: {
                                stacking: angular.isDefined(config.column_stacking) ? config.column_stacking : undefined,
                                grouping: angular.isDefined(config.column_grouping) ? config.column_grouping : true
                            }
                        },
                        series: data
                    };
                    if(config.tooltip_pointFormat) {
                        highcharts_config.tooltip.pointFormat = config.tooltip_pointFormat;
                    }
                    $element.highcharts(highcharts_config);
                }, 500);
            }
        };
    }
]);


app.directive('pollGraph', [ '$timeout',
    function ($timeout) {
        return {
            scope : { data : '@', categories: '@', visible: '@', text: '@',overall:'@',hash:'@'},
            link: function (scope, element, attr, ngModelCtrl) {
                scope.text = angular.isDefined(scope.text) ? scope.text : 'Poll';
                var title=scope.text
                var categoriesHash=JSON.parse(scope.hash)
                var transformValue=function (val,total) {
                    return Math.ceil((val*total)/100)
                }

                var adjustTextLength=function (value,maxLength) {
                    return value.length>maxLength?value.slice(0,maxLength)+'...':value
                }

                $timeout(function() {
                    element.highcharts({
                        // colors: ['rgba(158, 200, 240, 0.7)'],
                        chart: {
                            type: 'bar',
                            animation: true
                        },
                        title: {
                            useHTML:true,
                            text: angular.isDefined(scope.text) ? "<span title='"+scope.text+"'   >"+adjustTextLength(scope.text,65)+"</span>" : 'Poll',
                            align:'left'
                        },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            enabled: false
                        },
                        exporting:{
                            enabled:false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            
                            categories: angular.isObject(scope.categories) ? scope.categories : JSON.parse(scope.categories),
                            title: {
                                text: null
                                
                            },
                            labels:{
                                useHTML:true,

                                formatter:function () {
                                    return "<span title='"+this.value+"' >"+adjustTextLength(this.value,15)+"</span>"
                                }
                            }
                        },
                        yAxis: {
                            allowDecimals:false,
                            endOnTick:true,
                            min: 0,
                            max:100,
                            title: {
                                text: '% of Employees',//scope.text,
                                align: 'middle'
                            },
                            labels: {
                                overflow: 'justify'
                            },
                            lineWidth:1
                        },
                        tooltip: {
                        //   valueSuffix: '% ('+(overall.total-overall.not_answered)+' Employees)'4
                            // pointFormat:'<b>{point.y}</b>%' +this.point.y
                            outside:true,
                            followPointer:true,
                            formatter:function () {
                                
                                var key=this.x
                                return '<div style="width:150px">'+'<small style="text-overflow:ellipsis" >'+adjustTextLength(title,90)+'</small><br/>' +
                                '<div><b>'+key+' : </b>'+this.point.y.toFixed(2)+' % - '+categoriesHash[key]+'Employee(s)'+'</div>'+'</div>'
                            }
                        },
                        plotOptions: {
                            bar: {
                               
                                dataLabels: {
                                  enabled: false,
                            } 
                          }
                        },
                        series: [{
                            name: scope.text,
                            colorByPoint:true,
                            data: angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data)
                        }]
                    });
                }, 0);
            }
        };
    }
]);

app.directive('surveyGraph', [ '$timeout',
    function ($timeout) {
        return {
            scope : { data : '@', categories: '@', visible: '@', text: '@',totalCount:'@',hash:'@'},
            link: function (scope, element, attr, ngModelCtrl) {
                scope.text = angular.isDefined(scope.text) ? scope.text : 'Poll';
                
                
                var totalCount=scope.totalCount
                var categoriesHash=JSON.parse(scope.hash)
                var title=scope.text
                var transformValue=function (val) {
                    return ((val/totalCount)*100).toFixed(2)
                }

                var adjustTextLength=function (value,maxLength) {
                    return value.length>maxLength?value.slice(0,maxLength)+'...':value
                }
                $timeout(function() {
                    element.highcharts({
                        // colors: ['rgba(158, 200, 240, 0.7)'],
                        chart: {
                            type: 'bar',
                            animation: true
                        },
                        title:{
                            text:null
                        },
                        
                        credits: {
                            enabled: false
                        },
                        legend: {
                            enabled: false
                        },
                        exporting:{
                            enabled:false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            
                            categories: angular.isObject(scope.categories) ? scope.categories : JSON.parse(scope.categories),
                            title: {
                                text: 'Options'
                                
                            },
                            labels:{
                                useHTML:true,
                                formatter:function () {
                                    return "<span title='"+this.value+"' >"+adjustTextLength(this.value,15)+"</span>"
                                }
                            }
                        },
                        yAxis: {
                            allowDecimals:false,
                            endOnTick:true,
                            min: 0,
                            max:100,
                            title: {
                                text: '% of Employees',//scope.text,
                                align: 'middle'
                            },
                            labels: {
                                overflow: 'justify'
                            },
                            lineWidth:1
                        },
                        tooltip: {
                        //   valueSuffix: '% ('+(overall.total-overall.not_answered)+' Employees)'4
                            // pointFormat:'<b>{point.y}</b>%' +this.point.y
                            followPointer:true,
                            outside:true,
                            formatter:function () {
                                var key=this.x
                                return '<div style="width:150px">'+'<small>'+adjustTextLength(title,90)+'</small><br/>' +
                                '<div><b>'+key+' : </b>'+this.point.y.toFixed(2)+' % - '+categoriesHash[key]+'Employee(s)'+'</div>'+'</div>'
                            }
                        },
                        plotOptions: {
                            bar: {
                               
                                dataLabels: {
                                  enabled: false,
                            } 
                          }
                        },
                        series: [{
                            name: scope.text,
                            colorByPoint:true,
                            
                            data: angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data)
                        }]
                    });
                }, 0);
            }
        };
    }
]);

app.directive('pollsPieChart', [ '$timeout',
    function ($timeout) {
        return {
            scope : { data : '@', categories: '@', visible: '@', text: '@',overall:'@'},
            link: function (scope, element, attr, ngModelCtrl) {
                scope.text = angular.isDefined(scope.text) ? scope.text : 'Poll';
                $timeout(function() {
                    element.highcharts({
                        
                        chart: {
                            type: 'pie',
                            animation: true
                        },
                        title: {
                            text: angular.isDefined(scope.text) ? scope.text : 'Survey'
                        },
                        credits: {
                            enabled: false
                        },
                        exporting:{
                            enabled:false
                        },
                        legend: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        tooltip: {
                          valueSuffix: ' Employee(s)'
                        },
                        series: [{
                            name: scope.text,
                            data: angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data)
                        }]
                    });
                }, 0);
            }
        }
    }
]);


app.directive('screenshotSlotSummary', ['$timeout', 'ScreenshotAdminService',
    function ($timeout, ScreenshotAdminService) {
        return {
            scope: { title:'@',data: '@', mdl: '@', categories: '@', height: '@', colorCodes: '@',timeHash:'@',mostProductive:'@' ,leastProductive:'@'},
            link: function (scope, element, attr, ngModelCtrl) {
                var colorCodes = scope.colorCodes,//ScreenshotAdminService.getGraphColorCodes(scope.data)
                    chartData = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                var timeHash=JSON.parse(scope.timeHash)
                var mostProductive=JSON.parse(scope.mostProductive)
                var leastProductive=JSON.parse(scope.leastProductive)
                var getCurrentMonth = function () {
                    var date = new Date(),
                        mnth = date.getMonth() + 1,
                        month = ScreenshotAdminService.monthHashMap[mnth];

                    return month;
                };

                
                var getDuration = function name(duration) {
                    if (duration >= 60) {
                        var durationSecs = duration % 60//(Math.floor(duration*60)%60)==59?59:Math.ceil(duration*60)%60;
                        var durationMins = duration / 60//Math.floor(duration*60)/60;
                        return getMins(durationMins) + Math.floor(durationSecs) + 's';
                    } else {

                        var durationSecs = duration % 60
                        return Math.floor(durationSecs) + 's';
                    }
                };

                var getMins = function (mins) {
                    if (mins >= 60) {
                        var durationMins = mins % 60
                        var durationHrs = mins / 60
                        return Math.floor(durationHrs) + 'h ' + Math.floor(durationMins) + 'min ';
                    }
                    else {
                        var durationMins = mins % 60
                        return Math.floor(durationMins) + 'min '
                    }
                }

                var getTime=function (time) {
                    
                    return moment(time, ["HH:mm"]).format("hh:mm a") //timeHash && timeHash[time]?moment(timeHash[time], ["HH:mm"]).format("hh:mm a"):time
                }



                scope.$watch('data', function (newValue, oldValue) {
                    $timeout(function () {

                        scope.mdl = { duration: { slug: 'mom' } }
                        scope.categories = angular.isObject(scope.categories) ? scope.categories : JSON.parse(scope.categories);
                        var categories = scope.categories
                        element.highcharts({
                            colors: ['#70a43d', '#db4300','#808080'],//'#115858'
                            chart: {
                                
                                type: 'column',
                                animation: true
                            },
                            title: {
                                text:'<div class="fixed-lm-cplumn" style="display:flex;flex-direction:row"> <div style=" margin:5px;flex:1;border:1px solid #86b46a;border-radius:0px"> <div style="background: #86b46a; color: #fff; padding: 6px 0"> <center style="font-size: 14px">Most Productive <span style="font-size: 16px">30 mins</span></center> </div> <div style="display:flex;font-size:13px;padding: 8px 0 "><span style="margin:0px 20px 0px 20px"><b>Start Time</b> :<br> '+getTime(mostProductive.start_time)+'</span><span style="margin:0px 20px 0px 20px"><b>End Time</b> :<br> '+getTime(mostProductive.end_time)+'</span><span style="margin:0px 20px 0px 20px"><b>Productivity Percentage</b> :<br> '+mostProductive.productive_percent+'%</span></div> </div>  <div style=" margin:5px;flex:1;border:1px solid #ef7476;border-radius:0px"> <div style="background: #ef7476; color: #fff; padding: 6px 0"> <center style="font-size: 14px">Least Productive <span style="font-size: 16px;">30 mins</span></center> </div> <div style="display:flex;font-size:13px;padding: 6px 0"><span style="margin:0px 20px 0px 20px"><b>Start Time</b> :<br> '+getTime(leastProductive.start_time)+'</span><span style="margin:0px 20px 0px 20px"><b>End Time</b> :<br> '+getTime(leastProductive.end_time)+'</span><span style="margin:0px 20px 0px 20px"><b>Productivity Percentage</b> :<br> '+leastProductive.productive_percent+'%</span></div> </div></div>',
                                useHTML:true
                            },
                            
                            xAxis: {
                                categories: categories,
                                offset: 0,
                                labels: {
                                    formatter: function () {
                                        if (getCurrentMonth() === this.value) {
                                            return '<span style="color: #007ee5;">' + (angular.isDefined(timeHash[this.value])?getTime(timeHash[this.value]):this.value) + '</span>';
                                        } else {
                                            return angular.isDefined(timeHash[this.value])?getTime(timeHash[this.value]):this.value
                                        }
                                    },
                                    useHTML: true,
                                    style: {
                                        color: '#919ca5',
                                        fontSize: '12px',
                                        whiteSpace: 'nowrap'
                                    }
                                },
                                tickmarkPlacement: "on",
                                lineWidth: 1,
                                lineColor: "#f1f1f1",
                                showEmpty: true,
                                tickmarkPlacement: "on",
                                tickWidth: 0
                            },
                            yAxis: {
                                title: {
                                    text: ''
                                },
                                min: 0,
                                offset: 0,
                                labels: {
                                    formatter: function () {
                                        return getDuration(this.value)
                                    },
                                    style: {
                                        color: '#919ca5',
                                        fontSize: '12px'
                                    }
                                },
                                gridLineWidth: 0,
                                minorGridLineWidth: 0,
                                allowDecimals: false,
                                lineWidth: 1,
                                lineColor: "#f1f1f1"
                            },
                            legend: {
                                align: 'center',
                                layout: 'horizontal',
                                floating: false,
                                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                                shadow: false,
                                symbolHeight: 12,
                                symbolWidth: 12,
                                symbolRadius: 2
                            },
                            tooltip: {
                                formatter: function () {
                                    return '<b>' + this.series.name + ': ' + getDuration(this.y) + '</b>';
                                }
                            },
                            plotOptions: {
                                bar:{
                                    pointPadding: 0,
                                    borderWidth: 0,
                                    groupPadding: 0.01
                                },
                                column: {
                                    stacking: 'normal',
                                    
                                    
                                    
                                },
                                series: {
                                    pointWidth: 10,
                                    states: {
                                        hover: {
                                            enabled: false
                                        }
                                    },
                                    borderColor: '#FFFFFF',
                                    borderWidth: 1
                                }
                            },
                            series: chartData,
                            credits: {
                                enabled: false
                            },
                            exporting: false
                        });
                    }, 0);
                });
            }
        };
    }
]);