app.directive('yearlySalaryIncrement', [ '$timeout',
    function ($timeout) {
        return {
            scope : { employee : '@', ctc: '@', categories: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                //scope.employee = ;
                //scope.ctc = ;

                $timeout(function() {
                    element.highcharts({
                        chart: {
                            zoomType: 'xy',
                            animation: true
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: false,
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: [{
                            categories: angular.isObject(scope.categories) ? scope.categories : JSON.parse(scope.categories),
                            //crosshair: true,
                            labels: {
                                style: {
                                    color: '#a4adb4'
                                }
                            },
                            gridLineWidth: 1,
                            gridLineColor: "#F3F3F3",
                            offset: 0,
                            tickmarkPlacement: "on",
                            lineWidth: 1,
                            lineColor: "#F3F3F3",
                            showEmpty: true
                        }],
                        yAxis: [ 
                            {
                                title: {
                                    text: 'CTC'
                                },
                                labels: {
                                    //format: '{value}',
                                    formatter: function() {
                                        //console.log(this.value);
                                        return (this.value/100000);
                                    },
                                    style: {
                                        color: '#839099',
                                        font: '14px'
                                    }
                                },
                                opposite: true,
                                lineWidth: 1,
                                lineColor: "#F3F3F3",
                                gridLineColor: "#F3F3F3",
                            },
                            {
                                labels: {
                                    format: '{value}',
                                    style: {
                                        color: '#839099',
                                        font: '14px'
                                    }
                                },
                                title: {
                                    text: 'Employee Stength'
                                },
                                lineWidth: 1,
                                lineColor: "#F3F3F3",
                                gridLineColor: "#F3F3F3",
                                max: 180
                            }],
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'top',
                            symbolHeight: 12,
                            symbolWidth: 12,
                            symbolRadius: 6,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
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
                        series: [ 
                            {
                                name: 'Total CTC',
                                type: 'spline',
                                color: '#5da4e4',
                                data: angular.isObject(scope.ctc) ? scope.ctc : JSON.parse(scope.ctc),
                                tooltip: {
                                    valueSuffix: ''
                                },
                                marker: {
                                    //radius: 4,
                                    //fillColor: '#FFFFFF',
                                    symbol: 'url(images/marker.png)',                                    
                                    lineWidth: 2,
                                    lineColor: null // inherit from series
                                },
                                zIndex: 2
                            },
                            {
                                name: 'Employees Strength',
                                type: 'column',
                                color: 'rgba(151, 127, 201, 0.4)',
                                yAxis: 1,
                                data: angular.isObject(scope.employee) ? scope.employee : JSON.parse(scope.employee),
                                tooltip: {
                                    valueSuffix: ''
                                },
                                zIndex: 1

                            }
                        ]
                    });   
                }, 1000);
            }
        };
    }
]);