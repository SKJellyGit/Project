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

app.directive('inlineGlance', [ '$timeout', 
    function ($timeout) {
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
                            pointFormat: '{point.y}'
                        }
                    });
                }, 500);         
            }
        };
    }
]);

app.directive('fullpageGlance', [ '$timeout',  
    function ($timeout) {
        return {
            scope : { data : '@', color: '@', xaxis: '@', empdata: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                element.highcharts({
                    chart: {
                        zoomType: 'xy'
                    },
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
                        title: {
                            text: 'Month'
                        },
                        categories: angular.isObject(scope.xaxis) ? scope.xaxis : JSON.parse(scope.xaxis)
                    },
                    yAxis: [{ // Primary yAxis
                        allowDecimals: false,
                        labels: {
                            format: '{value}',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: 'Employee Count',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        min: 0
                    }, { // Secondary yAxis
                        title: {
                            text: 'Amount',
                            style: {
                                color: scope.color
                            }
                        },
                        labels: {
                            format: '{value}',
                            style: {
                                color: scope.color
                            }
                        },
                        opposite: true,
                        min: 0
                    }],
                    tooltip: {
                        valueSuffix: '',
                        shared: false
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0,
                        enabled: false
                    },
                    series: [{
                        name: 'Amount',
                        yAxis: 1,
                        data: angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data),
                        color: scope.color
                    },
                    {
                        name: 'Employee Count',
                        data: angular.isObject(scope.empdata) ? scope.empdata : JSON.parse(scope.empdata),
                        color: Highcharts.getOptions().colors[1]
                    }]
                });
            }
        };
    }
]);

app.directive('fullpageGlance1', [ '$timeout',  
    function ($timeout) {
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
                        categories: angular.isObject(scope.xaxis) ? scope.xaxis : JSON.parse(scope.xaxis)
                    },
                    yAxis: {
                        title: "Amount",
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
                        data: angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data),
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


function randomData(points, positive, multiplier) {
    points = !points ? 1 : points;
    positive = positive !== true ? false : true;
    multiplier = !multiplier ? 1 : multiplier;

    function rnd() {
        return ((
            Math.random() +
            Math.random() +
            Math.random() +
            Math.random() +
            Math.random() +
            Math.random()
        ) - 3) / 3;
    }
    var rData = [];
    for (var i = 0; i < points; i++) {
        val = rnd();
        val = positive === true ? Math.abs(val) : val;
        val = multiplier > 1 ? (val * multiplier) : val;
        rData.push(val);
    }
    return rData;
}

app.directive('slicedicebargraph', [ '$timeout',  
    function ($timeout) {
        return {
            scope : { data : '@', xaxis: '@', graphname: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                scope.data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                var dataPoints = scope.data.length < 8 ? 8 : scope.data.length,
                    chartData = randomData(dataPoints, true);

                chartData.sort();

                var barCount = chartData.length,
                    pointWidth = 20,
                    marginTop = 0,
                    marginRight = 10,
                    marginBottom = 60,
                    marginLeft = 100,
                    groupPadding = 0,
                    pointPadding = 0.3,
                    chartHeight = marginTop + marginBottom + ((pointWidth * barCount) * (1 + groupPadding + pointPadding));

                element.highcharts({
                    chart: {
                        type: 'bar',
                        marginTop: marginTop,
                        marginRight: marginRight,
                        marginBottom: marginBottom,
                        marginLeft: marginLeft,
                        height: chartHeight
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        categories: angular.isObject(scope.xaxis) ? scope.xaxis : JSON.parse(scope.xaxis), //['Lucknow', 'Gurgaon', 'Noida', 'New York'],
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: scope.graphname === 'empcount' ? 'Employee Count' 
                                : 'Amount',
                            align: 'middle'
                        },
                        labels: {
                            overflow: 'justify',
                            formatter: function() {
                                return (scope.graphname === 'empcount') 
                                    ? this.value : (this.value/100000);                                
                            }
                        },
                        allowDecimals: scope.graphname === 'empcount' ? false : true,
                        lineWidth: 1,
                        lineColor: "#F3F3F3",
                        gridLineColor: "#F3F3F3"
                    },
                    tooltip: {
                        valueSuffix: '',
                        formatter: function() {
                            if(!this.point.y) {
                                return false;
                            }
                            if(scope.graphname === 'empcount') {
                                return this.point.category + ' : ' + this.point.y;
                            } else {
                                var amt = this.point.y/100000;
                                return this.point.category + ' : ' + amt.toFixed(2);
                            }                            
                        },
                        useHTML: true
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    if(!this.point.y) {
                                        return '';
                                    }
                                    if(scope.graphname === 'empcount') {
                                        return this.point.y;
                                    } else {
                                        var amt = this.point.y/100000;
                                        return  amt.toFixed(2); 
                                    }                                    
                                }
                            }
                        },
                        series: {
                            pointWidth: 15
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
                    exporting: {
                        enabled: false,
                    },
                    series: [{
                        name: 'Amount',
                        data: scope.data,
                        color: '#ebc443' //'#7eae50'
                    }]
                });
            }
        };
    }
]);

// Make monochrome colors and set them as default for all pies
Highcharts.getOptions().plotOptions.pie.colors = (function () {
    return ['#80a1b7', '#7eae50', '#fb9f5c', '#ecc444', 
        '#73cb9f', '#8dbfec', '#b6a6d9', '#c1bbb2' , '#f6c994', '#ee9d9f']
}());

app.directive('salaryDistribution', [ '$timeout', 
    function ($timeout) {
        return {
            scope : { data : '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                $timeout(function() {
                    element.highcharts({
                        chart: {
                            animation: true,
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: true,                            
                            marginLeft: -200,
                            type: 'pie'                       
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: false,
                        tooltip: {
                            pointFormat: '<b>{series.name}: {point.percentage:.1f}%</b>'
                        },
                        legend: {
                            align: 'right',
                            layout: 'vertical',
                            verticalAlign: 'top',           
                            floating: true,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'transparent',
                            shadow: false,
                            symbolHeight: 12,
                            symbolWidth: 12,
                            symbolRadius: 2,
                            margin: 45
                        },
                        plotOptions: {
                            pie: {
                                animation: true,
                                innerSize: 70,
                                allowPointSelect: true,
                                cursor: 'pointer',
                                showInLegend: true,
                                size: '100%',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.percentage:.1f}<small>%</small></b>',
                                    distance: 10, //-50,
                                    style: {
                                        color: "gray", //"#FFFFFF", 
                                        fontSize: "14px", 
                                        fontWeight: 'normal',
                                        textShadow: 'none'
                                    }                                        
                                },
                                shadow: true,
                                borderColor: "none",
                                borderWidth: 1
                            }
                        },
                        series: [{
                            name: 'Contribution',
                            colorByPoint: true,
                            ignoreHiddenPoint: true,
                            data: angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data)                            
                        }]
                    });                    
                }, 1000);
            }
        };
    }
]);