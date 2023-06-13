app.directive('screenshotEmpChart', ['$timeout',
    function ($timeout) {
        'use strict';
        return {
            scope: { data: '@', chartConfig: '@', xcategories: '@' },
            link: function (scope, $element, $attrs) {
                $timeout(function buildChart() {
                    scope.chartConfig = scope.chartConfig ? scope.chartConfig : {};
                    scope.data = scope.data ? scope.data : [];
                    var config = angular.isObject(scope.chartConfig) ? scope.chartConfig : JSON.parse(scope.chartConfig);
                    var data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                    var xcategories = angular.isObject(scope.xcategories) ? scope.xcategories : JSON.parse(scope.xcategories);
                    
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





                    var highcharts_config = {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Working hours breakdown'
                        },
                        export: {
                            enabled: false
                        },
                        xAxis: {
                            title: {
                                text: 'Category'
                            },
                            scrollbar: {
                                enabled: true
                            },
                            tickLength: 0,
                            categories: []//xcategories
                        },
                        tooltip: {
                            useHTML: true,
                            formatter: function () {
                                return '<tr><td>' + this.series.name + ': </td>' +
                                    '<td style="text-align: right"><b>' + getDuration(this.point.y) + '</b></td></tr>'
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Duration',
                                align: 'high'
                            },
                            labels: {
                                formatter: function () {
                                    return getDuration(this.value)
                                }
                            }
                        },
                        // plotOptions: {
                        //     bars: {
                        //         dataLabels: {
                        //             enabled: true
                        //         }
                        //     }
                        // },
                        legend: {
                            enabled: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: data
                    }

                    if (config.tooltip_pointFormat) {
                        highcharts_config.tooltip.pointFormat = config.tooltip_pointFormat;
                    }

                    $element.highcharts(highcharts_config);
                }, 500);
            }
        };
    }
]);



app.directive('screenshotMiniAreaChart', ['$timeout', function ($timeout) {
    return {
        scope: { data: '@', chartConfig: '@', xcategories: '@', chartTitle: '@', subtitle: '@',chartColor:'@' },
        link: function (scope, $element, $attrs) {
            $timeout(function buildChart() {
                scope.chartConfig = scope.chartConfig ? scope.chartConfig : {};
                scope.data = scope.data ? scope.data : [];
                var config = angular.isObject(scope.chartConfig) ? scope.chartConfig : JSON.parse(scope.chartConfig);
                var data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                var highcharts_config = {
                    chart: {
                        type: 'areaspline',
                        margin:0,
                        animation: true
                    },
                    title: {
                        text:null,
                        align: 'left'
                        
                    },
                    tooltip: { enabled: true,headerFormat:'' },
                    subtitle: {
                        text: null,//'Temp',//scope.subtitle,//'Subtitle',
                        align: 'left'
                    },
                    xAxis: {
                        title: {
                            text: ''
                        }
                    },
                    yAxis: {
                        gridLineWidth: 0,
                        title: {
                            text: ''
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions:{
                        areaspline: {
                            fillOpacity: 0.8
                          }
                    },
                    series: [{
                        name:scope.chartTitle,
                        marker:{enabled:false},
                        color:scope.chartColor,
                        data:data//[40,50,38,35,20,5,10,6,9] //data
                    }]
                }
                if (config.tooltip_pointFormat) {
                    highcharts_config.tooltip.pointFormat = config.tooltip_pointFormat;
                }

                $element.highcharts(highcharts_config);
            }, 0)
        }
    }
}])