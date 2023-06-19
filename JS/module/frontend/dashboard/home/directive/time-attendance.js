app.directive('workingHours', [ '$timeout',
    function ($timeout) {
        return {
            scope : { data : '@', categories: '@', avgWorkingHours: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                $timeout(function() { 
                    var chart; 
                    var chartingOptions = {
                        chart: {
                            height: 240,
                            type: 'areaspline'
                        },
                        title: {
                            text: parseFloat(scope.avgWorkingHours) > 0 ? '' : 'No working hours available'
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'left',
                            verticalAlign: 'top',
                            x: 150,
                            y: 100,
                            floating: true,
                            borderWidth: 1,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
                        xAxis: {
                            categories: JSON.parse(scope.categories),
                            plotBands: [{
                                from: 4.5,
                                to: 6.5
                            }],
                            labels: {
                                formatter: function () {
                                    var val = this.value.toUpperCase();
                                    if(val) {
                                        var valArr = val.split("-");
                                        var day = valArr[0];
                                        var date = valArr[1];
                                    }
                                    if(angular.isUndefined(day)) {
                                        return '';
                                    } 
                                    if (day == "SATURDAY" || day == "SUNDAY") {
                                        return '<span style="color: #FF0000; font-size: 10px;">' + day + '</span>' + '<br/>' + 
                                        '<span style="color: #FF0000; font-size: 14px;text-align:center;font-weight:500; ">' + (date > 9 ? date : '0' + date) + '</span>';
                                    } else {
                                        return '<span style="color: #7b8994; font-size: 10px;">' + day + '</span>' + '<br/>' + 
                                        '<span style="color: #7b8994; font-size: 14px;text-align:center;font-weight:500;">' + (date > 9 ? date : '0' + date) + '</span>';
                                    }
                                },
                                useHTML: true,
                                style: {
                                    color: '#919ca5',
                                    fontSize: '12px',
                                    whiteSpace: 'nowrap'                                  
                                }     
                            },
                            tickmarkPlacement: 'between',
                            tickWidth: 0
                        },
                        yAxis: {                
                            title: {
                                text: ''
                            },
                            visible: false,
                            labels: {
                                formatter: function() {
                                    return parseInt((this.value/3600), 10);
                                }
                            },
                            allowDecimals: false,
                            gridLineWidth: 0,
                            minorGridLineWidth: 0,
                        },
                        tooltip: {
                            animation: true,
                            shadow: true,
                            shared: true,
                            valueSuffix: ' Hours',
                            formatter: function() {
                                if(this.y > 0) {
                                    var point = this.points[0].point;
                                    return '<div><div style="padding:5px 0;font-size:14px; "><span style="min-width:110px;display:inline-block; ">Clock In: </span> <span style="color:#000000; ">' + point.clockIn + '</span></div>'
                                    + '<div style="padding:5px 0;font-size:14px;"><span style="min-width:110px;display:inline-block; ">Break: </span> <span style="color:#000000; ">' + point.break + ' Hours' + '</span></div>'
                                    + '<div style="padding:5px 0;font-size:14px;"><span style="min-width:110px;display:inline-block; ">Clock Out: </span> <span style="color:#000000; ">' + point.clockOut + '</span></div>'
                                    + '<div style="padding:5px 0;font-size:14px;"><span style="min-width:110px;display:inline-block; ">Working Hours: </span> <span style="color:#000000; ">' + Math.floor(this.y/3600) + ':' + Math.round((Math.round(this.y)/60)%60) +' Hrs</span></div></div>';
                                } else {
                                    return false;
                                }
                            },
                            useHTML: true,
                            backgroundColor: '#FFFFFF',
                            borderColor: null,
                            borderRadius: 5,
                            borderWidth: 0,
                            style: {
                                color: '#919ca5',                                
                                fontSize: '12px',
                                whiteSpace: 'nowrap'                                  
                            },
                            zIndex: 9999,
                            positioner: function (labelWidth, labelHeight, point) {
                                var tooltipX, tooltipY;
                                if (point.plotX + labelWidth > chart.plotWidth) {
                                    tooltipX = point.plotX + chart.plotLeft - labelWidth - 20;
                                } else {
                                    tooltipX = point.plotX + chart.plotLeft + 20;
                                }
                                tooltipY = point.plotY + chart.plotTop - 20;
                                return {
                                    x: tooltipX,
                                    y: tooltipY
                                };
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: false,
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            areaspline: {
                                fillOpacity: 0.5,
                                fillColor: '#d5e9fa',
                                lineWidth: 1,
                                marker: {
                                    fillColor: '#FFFFFF',
                                    lineWidth: 2,
                                    lineColor: null
                                }
                            }            
                        },
                        series: [{
                            name: 'Working Hours',
                            data: JSON.parse(scope.data)
                        }]
                    };

                    chart = element.highcharts(chartingOptions).highcharts();
                }, 500);                
            }
        };
    }
]);
app.directive('attendanceGraph', [ '$timeout', 'TimeOffService', 
    function ($timeout, timeOffService) {
        return {            
            scope : { data : '@',dates:'@'},
            link: function (scope, element, attr, ngModelCtrl) {
                var colorCodes = ['#f3a112', '#64c595', '#dc4e42', '#97caf4'],
                    chartData = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data),
                    gDates = angular.isDefined(scope.dates)?JSON.parse(scope.dates):[];
                scope.$watch('data', function(newValue, oldValue) {                                       
                    $timeout(function() {
                        //scope.mdl = angular.isObject(scope.mdl) ? scope.mdl : JSON.parse(scope.mdl);
                        var categories = gDates;
                        
                        element.highcharts({
                            colors: colorCodes,
                            chart: {
                                height: 240,
                                type: 'column',
                                animation: true
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                categories: categories,
                                title: {
                                    text: 'Date'
                                },
                                crosshair: true,
                                gridLineWidth: 0,
                                gridLineColor: "#f1f1f1",
                                offset: 0,
                                tickmarkPlacement: "on",
                                lineWidth: 1,
                                lineColor: "#f1f1f1",
                            },
                            yAxis: {
                                min: 0,
                                lineWidth: 1,
                                lineColor: "#f1f1f1",
                                gridLineColor: "#f1f1f1",
                                gridLineWidth: 0,
                                minorGridLineWidth: 0,
                                title: {
                                    text: 'Hours'
                                },
                                stackLabels: {
                                    enabled: true,
                                    style: {
                                        fontWeight: 'normal',
                                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                                    }
                                }
                            },
                            legend: {
                                align: 'center',
                                layout: 'horizontal',              
                                floating: false,
                                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                                shadow: false,
                                symbolHeight: 12,
                                symbolWidth: 12,
                                symbolRadius: 2/*,
                                margin: 45*/
                            },
                            tooltip: {
                                headerFormat: '',
                                //pointFormat: '{series.name}: {point.y}'
                                pointFormatter: function () {
                                    if (this.series.name == 'Auto ClockOut') {
                                        return this.series.name;
                                    } else {
                                       return (this.series.name +":"+this.y); 
                                    }
                                }

                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal',
                                    pointPadding: 0.5,
                                    borderWidth: 0
                                },
                                series: {
                                    pointWidth: 20,
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
                    }, 500);
                });
            }
        };
    }
]);