// Make monochrome colors and set them as default for all pies
Highcharts.getOptions().plotOptions.pie.colors = (function () {
    /*var colors = [],
        base = Highcharts.getOptions().colors[0],
        i;

    for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
    }
    return colors;*/
    return ['#80a1b7', '#7eae50', '#fb9f5c', '#ecc444', 
        '#73cb9f', '#8dbfec', '#b6a6d9', '#c1bbb2' , '#f6c994']
}());

app.directive('ctcTaxBreakup', [ '$timeout', 
    function ($timeout) {
        return {
            scope : { data : '@', margin: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                /*var colors = Highcharts.getOptions().colors;
                var colorCodes = ['rgba(0, 58, 102, 0.8)', 'rgba(0, 72, 128, 0.8)',
                    'rgba(0, 116, 204, 0.8)', 'rgba(26, 156, 255, 0.8)',
                    'rgba(102, 189, 255, 0.8)', 'rgba(179, 222, 255, 0.8)',
                    'rgba(204, 233, 255, 0.8)' , 'rgba(230, 244, 255, 0.8)'];*/

                $timeout(function() {                    
                    scope.data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data)

                    element.highcharts({
                        //colors: colorCodes,
                        chart: {
                            animation: true,
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: true,
                            type: 'pie',
                            size: 400                           
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: false,
                        tooltip: {
                            //pointFormat: '<b>{series.name}: {point.percentage:.2f}%</b><br/><b>Amount: {point.amount}</b>',
                            pointFormat: '<b>{series.name}: {point.amount}</b>',
                            useHTML: true
                        },
                        legend: {
                            align: 'center',
                            layout: 'horizontal',              
                            floating: false,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'transparent',
                            shadow: false,
                            symbolHeight: 12,
                            symbolWidth: 12,
                            symbolRadius: 2,
                            margin: scope.data.length >= 4 ? 5: 30
                        },
                        plotOptions: {
                            pie: {
                                animation: true,
                                innerSize: 70,
                                allowPointSelect: true,
                                cursor: 'pointer',
                                showInLegend: true,
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.percentage:.2f}<small>%</small></b>',
                                    distance: 10,
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#FFFFFF'
                                    },
                                    style: {
                                        color: "#000000", 
                                        fontSize: "14px", 
                                        fontWeight:'normal',
                                        textShadow:'none'
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
                            data: scope.data
                        }]
                    });                    
                }, 1000);
            }
        };
    }
]);

app.directive('salaryIncrement', [ '$timeout',
    function ($timeout) {
        return {
            scope : { data : '@', categories: '@', visible: '@', text: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                scope.data = JSON.parse(scope.data);
                scope.text = angular.isDefined(scope.text) ? scope.text : 'CTC';
                $timeout(function() {
                    element.highcharts({
                        colors: ['rgba(158, 200, 240, 0.8)'],
                        chart: {
                            type: 'column',
                            animation: true
                        },
                        title: {
                            text: 'Compensation Status'
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: true,
                            buttons: {
                                contextButton: {
                                    /*symbol: 'circle',
                                    symbolStrokeWidth: 1,
                                    symbolFill: '#a4edba',
                                    symbolStroke: '#330033',*/
                                    symbol: 'url(../images/vd-icon.png)',
                                    verticalAlign: 'top',
                                    y: -20
                                },
                                exportButton: {
                                    enabled: false
                                },
                                printButton: {
                                    enabled: false
                                }
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: angular.isObject(scope.categories) ? scope.categories : JSON.parse(scope.categories),
                            crosshair: true,
                            gridLineWidth: 1,
                            gridLineColor: "#F3F3F3",
                            offset: 0,
                            tickmarkPlacement: "on",
                            lineWidth: 1,
                            lineColor: "#F3F3F3",
                            showEmpty: true,
                            labels: {
                                style: {
                                    color: '#839099',
                                    font: '14px'
                                }
                            }
                        },
                        yAxis: {
                            lineWidth: 1,
                            lineColor: "#F3F3F3",
                            gridLineColor: "#F3F3F3",
                            min: 0,
                            title: {
                                text: scope.text
                            },
                            labels: {
                                formatter: function () {
                                    return this.value/100000;
                                },
                                style: {
                                    color: '#839099',
                                    fontSize: '14px'
                                }            
                            }
                        },
                        tooltip: {
                            labels: {
                                formatter: function() {
                                    return yourLabels[this.value];
                                }
                            },
                            headerFormat: '<span style="color:{series.color}; font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color}; padding:0">{series.name}&nbsp;:&nbsp;</td>' +
                                '<td style="color:{series.color}; padding:0"><b> {point.y}</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            },
                            series: {
                                pointWidth: 40
                            }
                        },
                        series: [{
                            name: 'TOTAL ANNUAL ' + scope.text,
                            data: angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data)
                        }]
                    });
                }, 1000);
            }
        };
    }
]);

