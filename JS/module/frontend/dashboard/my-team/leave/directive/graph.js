Highcharts.SparkLine = function (a, b, c) {
    var hasRenderToArg = typeof a === 'string' || a.nodeName,
        options = arguments[hasRenderToArg ? 1 : 0],
        defaultOptions = {
            chart: {
                renderTo: (options.chart && options.chart.renderTo) || this,
                backgroundColor: null,
                borderWidth: 0,
                type: 'area',
                margin: [2, 0, 2, 0],
                width: 120,
                height: 20,
                style: {
                    overflow: 'visible'
                },
                skipClone: true
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            exporting: false,
            xAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                startOnTick: false,
                endOnTick: false,
                tickPositions: []
            },
            yAxis: {
                endOnTick: false,
                startOnTick: false,
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                tickPositions: [0]
            },
            legend: {
                enabled: false
            },
            tooltip: {
                backgroundColor: null,
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                hideDelay: 0,
                shared: true,
                padding: 0,
                positioner: function (w, h, point) {
                    return { x: point.plotX - w / 2, y: point.plotY - h };
                }
            },
            plotOptions: {
                series: {
                    animation: true,
                    lineWidth: 1,
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        radius: 2,
                        states: {
                            hover: {
                                radius: 2
                            }
                        }
                    },
                    fillOpacity: 0.25
                },
                column: {
                    negativeColor: '#910000',
                    borderColor: 'silver'
                }
            }
        };

    options = Highcharts.merge(defaultOptions, options);

    return hasRenderToArg ?
        new Highcharts.Chart(a, options, c) :
        new Highcharts.Chart(options, b);
};

app.directive('inlineLeaveAvailed', [ '$timeout', 'TimeOffService', 
    function ($timeout, timeOffService) {
        return {
            scope : { data : '@', color: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                $timeout(function() {
                    element.highcharts('SparkLine', {
                        chart: {
                            type: 'line'
                        },
                        series: [{
                            data: JSON.parse(scope.data),
                            pointStart: 1,
                            color: scope.color
                        }],
                        tooltip: {
                            headerFormat: '',
                            pointFormat: '{point.y} leave'
                        }
                    });
                }, 500);         
            }
        };
    }
]);

app.directive('fullpageLeaveAvailed', [ '$timeout', 'TimeOffService', 
    function ($timeout, timeOffService) {
        return {
            scope : { data : '@', color: '@', xaxis: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                element.highcharts({
                    title: {
                        text: '',
                        x: -20 //center
                    },
                    subtitle: {
                        text: '',
                        x: -20
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: false,
                    xAxis: {
                        categories: JSON.parse(scope.xaxis)
                    },
                    yAxis: {
                        min: 0,
                        //tickInterval: 1,
                        gridLineWidth: 0,                        
                        minorGridLineWidth: 0,
                        title: {
                            text: ''
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0,
                        enabled: false
                    },
                    series: [{
                        name: 'Sick Leave',
                        data: JSON.parse(scope.data),
                        color: scope.color
                    }]
                });
            }
        };
    }
]);

app.directive('barchart', [ '$timeout', 'TimeOffService', 
    function ($timeout, timeOffService) {
        return {
            scope : { data : '@', categories: '@', width: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                var perShapeGradient = {
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2: 0
                };                 
                element.highcharts({
                    colors: ['#66b1ef', '#e98e86', '#a9c88a', '#fcc69d', '#c9c5bd', '#c0b3de'],
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        categories: JSON.parse(scope.categories),
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        },
                        lineWidth: 1,
                        lineColor: "#F3F3F3",
                        gridLineColor: "#F3F3F3"
                    },
                    tooltip: {
                        valueSuffix: ' leaves'
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                        series: {
                            colorByPoint: true,
                            pointWidth: angular.isDefined(scope.width) ? scope.width: 10
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true,
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: false,
                    series: JSON.parse(scope.data)
                });
            }
        };
    }
]);