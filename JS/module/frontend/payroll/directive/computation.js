app.directive('computationChart', [ '$timeout',
    function ($timeout) {
        return {
            scope : { data : '@', category: '@'},
            link: function (scope, element, attr, ngModelCtrl) {
                var colorCodes = ['#0e6dbb', '#97caf4', '#005090', '#5cadee']/*,
                    chartData = JSON.parse(scope.data)*/;

                scope.$watch('data', function(newValue, oldValue) {                                       
                    $timeout(function() {
                        scope.data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                        scope.category = angular.isObject(scope.category) ? scope.category : JSON.parse(scope.category);
                        
                        element.highcharts({
                            chart: {
                                renderTo: 'container',
                                type: 'area',
                                borderColor: '#f8f8f8',
                                borderWidth: 1,
                                //marginLeft: -100
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            credits: {
                                enabled: false
                            },
                            exporting: false,
                            xAxis: {
                                title: {
                                    enabled: false
                                },
                                categories: scope.category,
                                labels: {
                                    formatter: function() {
                                        return '<small>' + this.value + '</small>';
                                    },
                                    enabled: true, //false
                                    useHTML: true,
                                    align: 'left',
                                    reserveSpace: false,
                                    y: -250,
                                    x: 0,
                                    style: {
                                        color: '#4c545a',
                                        fontSize: '14px',
                                        textAlign: 'left'
                                    }
                                },
                                tickmarkPlacement: 'on',
                                tickWidth: 0,                                
                                //gridLineColor: '#f8f8f8',
                                //gridLineWidth: 1,
                                gridZIndex: 4,
                                minPadding: 0,
                                maxPadding: 0,                                
                                lineWidth:1,
                                lineColor: 'transparent',
                                min: 0
                            },
                            yAxis: {
                                title: {
                                    text: ''
                                },
                                labels: {
                                    enabled: false,
                                    formatter: function () {
                                        return this.value;
                                    }                       
                                },
                                gridLineColor: '#f8f8f8',
                                gridLineWidth: 0,
                                lineWidth: 1,
                                lineColor: 'transparent',
                                minPadding: 0,
                                min: 0
                            },
                            tooltip: {
                                enabled: false
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                area: {
                                    stacking: 'normal',
                                    lineColor: '#666666',
                                    lineWidth: 0,
                                    marker: {
                                        fillColor: '#000000',
                                        lineWidth: 1,
                                        lineColor: '#666666',
                                        zIndex: 10
                                    },
                                    dataLabels: {
                                        useHTML: true,
                                        enabled: true,
                                        enableMouseTracking: false,
                                        color: '#015ca6',
                                        y: -4,
                                        x: 18,
                                        formatter: function() {
                                            if(this.x) {
                                                /*return '<span style="font-size:14px;">' + 
                                                '<b style="color:#4f575e;font-weight:bold;">' + 
                                                this.x + ':</b>' + this.y + '</span>';*/
                                                return '<span style="color:#6691c0; font-weight:bold; font-size:14px;">' 
                                                    + this.y + '</span>';
                                            } else {
                                                return false;
                                            }                                            
                                        }
                                    },
                                    pointStart: 0
                                },                                
                                series: {
                                    fillColor: {
                                        linearGradient: [600, 500, 400, 270, 270], //scope.data
                                        stops: [
                                            /*[0, 'rgb(62,154,208)'],
                                            [1, 'rgb(1,42,140)']*/
                                            [0,  Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.1).get('rgba')],
                                            [1, 'rgb(1,42,140)']//[1, Highcharts.getOptions().colors[0]]
                                           
                                        ]
                                    }
                                }
                            },
                            series: [{
                                name: 'Asia',
                                data: scope.data,
                                marker: {                                    
                                    lineWidth: 1,
                                    lineColor: null
                                },
                                zIndex: 10,
                                threshold: 0
                            }]
                        });

                    }, 500);
                });
            }
        };
    }
]);