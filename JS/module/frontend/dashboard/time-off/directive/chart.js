// Make monochrome colors and set them as default for all pies
Highcharts.getOptions().plotOptions.column.colors = (function () {
    var colors = [],
        base = Highcharts.getOptions().colors[0],
        //base = '#0e6dbb',
        i;

    for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
    }

    return colors;
}());

app.directive('timeOffStatus', [ '$timeout', 'TimeOffService', 
    function ($timeout, timeOffService) {
        return {
            scope : { data : '@', mdl: '@', additionalData: '@', height: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                var colorCodes = timeOffService.getGraphColorCodes(scope.data),
                    chartData = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                
                var getCurrentMonth = function() {
                    var date = new Date(),
                        mnth = date.getMonth() + 1,
                        month = timeOffService.monthHashMap[mnth];
                        
                    return month;
                };

                scope.$watch('data', function(newValue, oldValue) {                                       
                    $timeout(function() {
                        scope.mdl = angular.isObject(scope.mdl) ? scope.mdl : JSON.parse(scope.mdl);
                        scope.additionalData = angular.isObject(scope.additionalData) ? scope.additionalData : JSON.parse(scope.additionalData);
                        var categories = timeOffService.buidXAxisSummaryGraphData(scope.mdl, scope.additionalData);

                        element.highcharts({
                            colors: colorCodes,
                            chart: {
                                height: angular.isDefined(scope.height) ? scope.height : 280,
                                type: 'column',
                                animation: true
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                categories: categories,
                                offset: 0,
                                labels: {
                                    formatter: function () {
                                        if (getCurrentMonth() === this.value) {
                                            return '<span style="color: #007ee5;">' + this.value + '</span>';
                                        } else {
                                            return this.value;
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
                                        return (this.value <= 9) ? ('0' +  this.value) : this.value;
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
                                    return '<b>' + this.series.name + ': ' + this.y + '</b>';
                                }
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal',
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    pointWidth: 30,
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