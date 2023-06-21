app.directive('owlCorousal', [ '$timeout', 
    function ($timeout) {
        return {
            scope : { data : '@'},            
            link: function (scope, element, attr, ngModelCtrl) {
                $timeout(function () {
                    element.owlCarousel({
                        items : 5,
                        lazyLoad : true,
                        navigation : true,
                        itemsDesktop : [1199,4],
                        itemsDesktopSmall : [979,3],
                        itemsTablet : [768,2],
                        itemsMobile : [479,1]
                    });
                }, 500); 
            }
        };
    }
]);