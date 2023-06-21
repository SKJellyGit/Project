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
    return ['#7eae50', '#e50000', '#fb9f5c', '#ecc444',
        '#73cb9f', '#8dbfec', '#b6a6d9', '#c1bbb2', '#f6c994']
}());

app.directive('manageReviewCyclePieChart', ['$timeout',
    function ($timeout) {
        return {
            scope: {data: '@', margin: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                /*var colors = Highcharts.getOptions().colors;
                 var colorCodes = ['rgba(0, 58, 102, 0.8)', 'rgba(0, 72, 128, 0.8)',
                 'rgba(0, 116, 204, 0.8)', 'rgba(26, 156, 255, 0.8)',
                 'rgba(102, 189, 255, 0.8)', 'rgba(179, 222, 255, 0.8)',
                 'rgba(204, 233, 255, 0.8)' , 'rgba(230, 244, 255, 0.8)'];*/

                $timeout(function () {
                    scope.data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data)

                    element.highcharts({
                        //colors: colorCodes,
                        chart: {
                            animation: true,
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: true,
                            type: 'pie',
                            width: 500,
                            height:300
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
                            labelFormat:'{name} {amount} ({y}%)' ,
                            shadow: false,
                            symbolHeight: 12,
                            symbolWidth: 12,
                            symbolRadius: 2,
                            margin: scope.data.length >= 4 ? 5 : 30,
                        },
                        plotOptions: {
                            pie: {
                                animation: true,
                                innerSize: 60,
                                allowPointSelect: true,
                                cursor: 'pointer',
                                showInLegend: true,
                                size: 200,
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
                                name: 'Count',
                                colorByPoint: true,
                                data: scope.data
                            }]
                    });
                }, 1000);
            }
        };
    }
]);