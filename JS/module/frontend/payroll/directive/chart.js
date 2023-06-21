Highcharts.getOptions().plotOptions.column.colors = (function () {
    var colors = [],
        base = '#158DEE',
        i;

    for (i = 0; i < 15; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.Color(base).brighten(-(i - 5) / 7).get());
    }
    return colors;
}());

app.directive('payrollComparisonChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: scope.title
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    data: scope.data
                }]
            });
        }
    };
});

app.directive('comparisonIncrement', [ '$timeout',
    function ($timeout) {
        return {
            scope : { graphOne : '@', graphTwo : '@', categories: '@', visible: '@'},
            link: function (scope, element, attr, ngModelCtrl) {                
                $timeout(function() {
                    element.highcharts({
                        colors: ['rgba(158, 200, 240, 0.8)'],
                        chart: {
                            type: 'column',
                            animation: true
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: false,
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
                            title: {
                                text: 'Payroll Cycle'
                            },
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
                                text: 'Amount'
                            },
                            labels: {
                                formatter: function () {
                                    return this.value/100000;
                                },
                                style: {
                                    color: '#839099',
                                    font: '14px'
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
                                pointWidth: 23
                            },
                            series: {
                                pointWidth: 25
                            }
                        },
                        series: [{
                            grouping: true,
                            name: '2015 Amount',
                            data: angular.isObject(scope.graphOne) ? scope.graphOne : JSON.parse(scope.graphOne),
                            //data: [2480000, 2500000, 1525000, 1560000, 1625000],
                            color: '#089BB6'
                        },{
                            name: '2016 Amount',
                            data: angular.isObject(scope.graphTwo) ? scope.graphTwo : JSON.parse(scope.graphTwo),
                            //data: [2380000, 2200000, 2125000, 2260000, 1425000],
                            color: '#94C0E4'
                        }]
                    });
                }, 1000);
            }
        };
    }
]);

app.directive('employeeCount', [ '$timeout',
    function ($timeout) {
        return {
            scope : { graph : '@', categories: '@', visible: '@'},
            link: function (scope, element, attr, ngModelCtrl) {                
                $timeout(function() {
                    element.highcharts({
                        // colors: ['#38A0F3','#158DEE','#0179DB','#026DC4','#015CA6','#015CA6','#015CA6','#015CA6','#015CA6','#015CA6','#015CA6','#015CA6'],
                        chart: {
                            type: 'column',
                            animation: true
                        },
                        title: {
                            text: 'Employee Count'
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: false,
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
                            title: {
                                text: 'Departments'
                            },
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
                                text: 'Number of Employees'
                            },
                            labels: {
                                formatter: function () {
                                    return this.value/1;
                                },
                                style: {
                                    color: '#839099',
                                    font: '14px'
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
                                borderWidth: 0,
                                colorByPoint: true
                            },
                            series: {
                                pointWidth: 23
                            },

                            series: {
                                pointWidth: 25
                            }
                        },
                        series: [{
                            name: "Count",
                            data: angular.isObject(scope.graph) ? scope.graph : JSON.parse(scope.graph),
                            //data: [2480000, 2500000, 1525000, 1560000, 1625000],

                        }]
                    });
                }, 1000);
            }
        };
    }
]);

app.directive('pieDistribution', [ '$timeout',
    function ($timeout) {
        return {
            scope : { graph : '@', visible: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                $timeout(function() {
                    element.highcharts({
                        // colors: ['#38A0F3','#158DEE','#0179DB','#026DC4','#015CA6','#015CA6','#015CA6','#015CA6','#015CA6','#015CA6','#015CA6','#015CA6'],
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: false,
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'bottom'
                        },
                        title:{
                            text: null  
                        },
                        subtitle: {
                            text: null
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                },
                                showInLegend: true
                            }
                        },
                        series: [{
                            name: 'Department',
                            colorByPoint: true,
                            data: angular.isObject(scope.graph) ? scope.graph : JSON.parse(scope.graph),
                            //data: [2480000, 2500000, 1525000, 1560000, 1625000],

                        }]
                    });
                }, 1000);
            }
        };
    }
]);