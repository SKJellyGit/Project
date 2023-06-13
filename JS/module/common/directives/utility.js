app.directive('signaturePad', ['$window',
    function ($window) {
        'use strict';

        var signaturePad, canvas, element, EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="signature" ng-style="{height: height + \'px\', width: width + \'px\'}"><canvas ng-mouseup="updateModel()"></canvas></div>',
            scope: {
                accept: '=',
                clear: '=',
                dataurl: '@',
                height: '@',
                width: '@'
            },
            controller: [
                '$scope',
                function ($scope) {
                    $scope.accept = function () {
                        var signature = {};
                        if (!$scope.signaturePad.isEmpty()) {
                            signature.dataUrl = $scope.signaturePad.toDataURL();
                            signature.isEmpty = false;
                        } else {
                            signature.dataUrl = EMPTY_IMAGE;
                            signature.isEmpty = true;
                        }
                        return signature;
                    };

                    $scope.updateModel = function () {
                        var result = $scope.accept();
                        $scope.dataurl = result.isEmpty ? undefined : result.dataUrl;
                        ;
                    };

                    $scope.clear = function () {
                        $scope.signaturePad.clear();
                        $scope.dataurl = undefined;
                    };

                    $scope.$watch("dataurl", function (dataUrl) {
                        if (dataUrl) {
                            $scope.signaturePad.fromDataURL(dataUrl);
                        }
                    });
                }
            ],
            link: function (scope, element) {
                canvas = element.find('canvas')[0];
                scope.signaturePad = new SignaturePad(canvas);

                if (scope.signature && !scope.signature.$isEmpty && scope.signature.dataUrl) {
                    scope.signaturePad.fromDataURL(scope.signature.dataUrl);

                }

                scope.onResize = function () {
                    var canvas = element.find('canvas')[0];
                    var ratio = Math.max($window.devicePixelRatio || 1, 1);
                    canvas.width = canvas.offsetWidth * ratio;
                    canvas.height = canvas.offsetHeight * ratio;
                    canvas.getContext("2d").scale(ratio, ratio);
                }

                scope.onResize();

                angular.element($window).bind('resize', function () {
                    scope.onResize();
                });
            }
        };
    }
]);

app.directive('initialsPad', ['$window',
    function ($window) {
        'use strict';

        var signaturePad, canvas, element, EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="initials" ng-style="{height: height + \'px\', width: width + \'px\'}"><canvas ng-mouseup="updateModel()"></canvas></div>',
            scope: {
                acceptInitial: '=',
                clearInitial: '=',
                dataurl: '@',
                height: '@',
                width: '@'
            },
            controller: [
                '$scope',
                function ($scope) {
                    $scope.acceptInitial = function () {
                        var signature = {};
                        if (!$scope.signaturePad.isEmpty()) {
                            signature.dataUrl = $scope.signaturePad.toDataURL();
                            signature.isEmpty = false;
                        } else {
                            signature.dataUrl = EMPTY_IMAGE;
                            signature.isEmpty = true;
                        }
                        return signature;
                    };

                    $scope.updateModel = function () {
                        var result = $scope.acceptInitial();
                        $scope.dataurl = result.isEmpty ? undefined : result.dataUrl;;
                    };

                    $scope.clearInitial = function () {
                        $scope.signaturePad.clear();
                        $scope.dataurl = undefined;
                    };

                    $scope.$watch("dataurl", function (dataUrl) {
                        if (dataUrl) {
                            $scope.signaturePad.fromDataURL(dataUrl);
                        }
                    });
                }
            ],
            link: function (scope, element) {
                canvas = element.find('canvas')[0];
                scope.signaturePad = new SignaturePad(canvas);

                if (scope.signature && !scope.signature.$isEmpty && scope.signature.dataUrl) {
                    scope.signaturePad.fromDataURL(scope.signature.dataUrl);

                }

                scope.onResize = function() {
                    var canvas = element.find('canvas')[0];
                    var ratio =  Math.max($window.devicePixelRatio || 1, 1);
                    canvas.width = canvas.offsetWidth * ratio;
                    canvas.height = canvas.offsetHeight * ratio;
                    canvas.getContext("2d").scale(ratio, ratio);
                }

                scope.onResize();

                angular.element($window).bind('resize', function() {
                    scope.onResize();
                });
            }
        };
    }
]);

app.directive('compileHtml', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return scope.$eval(attrs.compileHtml);
            }, function (value) {
                element.html(value);
                $compile(element.contents())(scope);
            });
        }
    };
}]);

app.filter('html', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

app.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

app.directive('onlyAlphabets', [
    function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined

                    if (inputValue == undefined) return '' ;
                    var transformedInput = inputValue.replace(/[^a-zA-Z]/g, '');
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    element.bind('blur', function (event) {
                        var fieldValue = element.val();
                        fieldValue = fieldValue.replace(/^\s+|\s+$/g,'');
                        element.val(fieldValue);
                    });

                    return transformedInput;
                });
            }
        };
    }
]);

app.directive('onlyAlphabetsWithSpace', [
    function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined

                    if (inputValue == undefined) return '' ;
                    var transformedInput = inputValue.replace(/[^a-zA-Z\s]/g, '');
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    element.bind('blur', function (event) {
                        var fieldValue = element.val();
                        fieldValue = fieldValue.replace(/^\s+|\s+$/g,'');
                        element.val(fieldValue);
                    });

                    return transformedInput;
                });
            }
        };
    }
]);
app.directive('onlyAlphabetsWithSpaceAndSpecialChar', [
    function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined

                    if (inputValue == undefined) return '' ;
                    var transformedInput = inputValue.replace(/[^a-zA-Z !@#$%^&*+_><.=)(|}{-]/g, '');
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    element.bind('blur', function (event) {
                        var fieldValue = element.val();
                        fieldValue = fieldValue.replace(/^\s+|\s+$/g,'');
                        element.val(fieldValue);
                    });

                    return transformedInput;
                });
            }
        };
    }
]);

app.directive('onlyNumbers', [
    function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined

                    if (inputValue == undefined) return '' ;
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    element.bind('blur', function (event) {
                        var fieldValue = element.val();
                        fieldValue = fieldValue.replace(/^\s+|\s+$/g,'');
                        element.val(fieldValue);
                    });

                    return transformedInput;
                });
            }
        };
    }
]);

app.directive('allowPattern', [allowPatternDirective]);

function allowPatternDirective() {
    return {
        restrict: "A",
        compile: function(tElement, tAttrs) {
            return function(scope, element, attrs) {
                // I handle key events
                element.bind("keypress", function(event) {
                    var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
                    var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.

                    // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
                    if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
                        event.preventDefault();
                        return false;
                    }

                });
            };
        }
    };
}

app.directive('alphaNumeric', [
    function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined

                    if (inputValue == undefined) return '' ;
                    var transformedInput = inputValue.replace(/[^a-zA-Z0-9]/g, '');
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    element.bind('blur', function (event) {
                        var fieldValue = element.val();
                        fieldValue = fieldValue.replace(/^\s+|\s+$/g,'');
                        element.val(fieldValue);
                    });

                    return transformedInput;
                });
            }
        };
    }
]);

app.directive('onlyAlphabetsDigitsWithSpace', [
    function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined

                    if (inputValue == undefined) return '' ;
                    var transformedInput = inputValue.replace(/[^a-zA-Z0-9\-\s]/g, '');
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    element.bind('blur', function (event) {
                        var fieldValue = element.val();
                        fieldValue = fieldValue.replace(/^\s+|\s+$/g,'');
                        element.val(fieldValue);
                    });

                    return transformedInput;
                });
            }
        };
    }
]);

app.directive('onlyAlphabetsDigitsWithSpaceAndUnderscore', [
    function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined

                    if (inputValue == undefined) return '' ;
                    var transformedInput = inputValue.replace(/[^a-zA-Z0-9\s]/g, '');
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    element.bind('blur', function (event) {
                        var fieldValue = element.val();
                        fieldValue = fieldValue.replace(/^\s+|\s+$/g,'');
                        element.val(fieldValue);
                    });

                    return transformedInput;
                });
            }
        };
    }
]);

app.directive('validateEmail', function() {
    var EMAIL_REGEXP = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,7})$/;
    return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            if (ctrl && ctrl.$validators.email) {
                // this will overwrite the default Angular email validator
                ctrl.$validators.email = function(modelValue) {
                    return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    };
});

app.directive('myMaxLength', [function() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, controller) {
            var maxlength = Number(attrs.myMaxLength);
            controller.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return '' ;
                if (inputValue.length > maxlength) {
                    var transformedInput = inputValue.substring(0, maxlength);
                    controller.$setViewValue(transformedInput);
                    controller.$render();
                    return transformedInput;
                }
                return inputValue;
            });
        }
    };
}]);
app.directive('myMaxValue', [function() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, controller) {
            var maxlength = Number(attrs.myMaxValue);
            controller.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return '' ;
                if (inputValue > maxlength) {
                    var transformedInput = inputValue.substring(0, 1);
                    controller.$setViewValue(transformedInput);
                    controller.$render();
                    return transformedInput;
                }
                return inputValue;
            });
        }
    };
}]);

app.directive('outsideclick', ['$document',function($document){
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            elem.bind('click', function(e) {
                e.stopPropagation();
            });
            $document.bind('click', function(e) {
                scope.$apply(attr.outsideclick);
            });
        }
    };
}]);

app.directive('validSubmit', ['$parse', function ($parse) {
    return {
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                post: function postLink(scope, element, iAttrs, controller) {
                    var form = element.controller('form');
                    form.$submitted = false;
                    var fn = $parse(iAttrs.validSubmit);
                    element.on('submit', function(event) {
                        scope.$apply(function() {
                            element.addClass('ng-submitted');
                            form.$submitted = true;
                            if(form.$valid) {
                                fn(scope, {$event:event});
                            }
                        });
                    });
                    scope.$watch(function() { return form.$valid}, function(isValid) {
                        if(form.$submitted == false) return;
                    });
                }
            }
        }
    }
}]);

app.directive('capitalize', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if(inputValue == undefined) inputValue = '';
                var capitalized = inputValue.toUpperCase();
                if(capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            };
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);  // capitalize initial value
        }
    };
});

app.directive('pwCheck', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    // console.info(elem.val() === $(firstPassword).val());
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
});

app.directive('verticalTab', ['$timeout',
    function ($timeout) {
        return {
            link: function (scope, elem, attrs, ctrl) {
                $timeout(function() {
                    elem.easyResponsiveTabs({
                        type: 'vertical',
                        width: 'auto',
                        fit: true
                    });
                }, 500);
            }
        }
    }
]);
app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13 && element.val()) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
app.directive('pancard', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('url', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('ipAddress', [
    function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined

                    if (inputValue == undefined) return '' ;
                    var transformedInput = inputValue.replace(/[^0-9\.]/g, '');
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    element.bind('blur', function (event) {
                        var fieldValue = element.val();
                        fieldValue = fieldValue.replace(/^\s+|\s+$/g,'');
                        element.val(fieldValue);
                    });

                    return transformedInput;
                });
            }
        };
    }
]);

app.directive('scrollOnClick', ['$routeParams', '$timeout', function($routeParams, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, $elm, attr) {
            angular.element(document).ready(function () {
                if(attr.value == $routeParams.index) {
                    $("body").animate({scrollTop: $elm.offset().top}, "slow");
                    $elm.addClass('site-notifction-actv');
                }
            });
            $elm.on('click', function() {
                $("body").animate({scrollTop: $elm.offset().top}, "slow");
            });
        }
    };
}]);

function isEmpty(value) {
    return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

app.directive('ngMin', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMin, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var minValidator = function (value) {
                var min = scope.$eval(attr.ngMin) || 0;
                if (!isEmpty(value) && value < min) {
                    ctrl.$setValidity('ngMin', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMin', true);
                    return value;
                }
            };

            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
});

app.directive('ngMax', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var maxValidator = function (value) {
                var max = scope.$eval(attr.ngMax) || Infinity;
                if (!isEmpty(value) && value > max) {
                    ctrl.$setValidity('ngMax', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMax', true);
                    return value;
                }
            };
            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});

app.directive('myApplicability', ['PayrollService', 'ServerUtilityService',
    function (PayrollService, serverUtilityService) {
        var groupObject = {};
        var elementObject = {};
        return {
            restrict: 'E',
            scope: {
                filters: '=filters'
                //groupList: '@'
            },
            controllerAs: 'ctrl',
            templateUrl: '/template/module/setup/payroll/statutoryElements/applicability.html',
            controller: [
                '$scope',
                function ($scope) {
                    console.log($scope.groupList);
                    self = this;
                    $scope.groupList =[];

//                     $scope.$watch($scope.filters,function(newVAlue,oldValue){
//                         console.log(newVAlue,oldValue);
//                     });

                    var getGroupList = function () {
                        var url = PayrollService.getUrl('grplst') + "?field=true";
                        serverUtilityService.getWebService(url).then(function (data) {
                            $scope.groupList = data.data;
                        });
                    };
                    getGroupList();
                    var buildFilters = function (groupList) {
                        var filters = [];
                        filters.push(this.buildDefaultFilterObject(groupList));
                        return filters;
                    };
                    var buildDefaultFilterObject = function (groupList) {
                        return {
                            type: null,
                            value: null,
                            className: 1,
                            groups: groupList,
                            elements: []
                        };
                    };
                    var buildGroupElementObject = function () {
                        angular.forEach($scope.groupList, function (value, key) {
                            groupObject[value._id] = value.name;
                            angular.forEach(value.element_details, function (v, k) {
                                elementObject[v._id] = v.name;
                            });
                        });
                    };
                    var getElementList = function (type) {
                        var list = $scope.groupList.filter(function (item, index, arr) {
                            return (item._id == type) ? item : null;
                        });

                        return list[0].element_details;
                    };
                    var extractGroupList = function () {
                        var arrTypes = [],
                            groupList = [];

                        angular.forEach($scope.filters, function (v, k) {
                            if (v.type) {
                                arrTypes.push(v.type);
                            }
                        });

                        angular.forEach($scope.groupList, function (value, key) {
                            if (arrTypes.indexOf(value._id) == -1 && value.element_details.length) {
                                groupList.push(value);
                            }
                        });
                        return groupList;
                    };

                    $scope.filterAction = {
                        apply: true,
                        add: false
                    };
                    $scope.andClickHandler = function (filter, index) {
                        if (index == $scope.filters.length - 1) {
                            filter.className = 2;
                            $scope.filters.push(buildDefaultFilterObject(extractGroupList()));
                        }
                    };
                    $scope.removeFilter = function (index) {
                        $scope.filters.splice(index, 1);
                    };
                    $scope.changeGroup = function (filter) {
                        filter.elements = getElementList(filter.type);
                    };
                    $scope.isAndDisabled = function (filter) {
                        return (!filter.type || !filter.value || filter.groups.length == 1);
                    };
                    $scope.toggleFilterAction = function (action) {
                        console.log(action, $scope.filterAction,$scope.filters);
                        angular.forEach($scope.filterAction, function (value, key) {
                            $scope.filterAction[key] = false;
                        });
                        $scope.filterAction[action] = true;
                        console.log(action, $scope.filterAction);
                    };
                }
            ]
        };
    }
]);

app.directive('sglclick', [
    '$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var fn = $parse(attr['sglclick']);
                var delay = 300, clicks = 0, timer = null;
                element.on('click', function (event) {
                    clicks++;  //count clicks
                    if(clicks === 1) {
                        timer = setTimeout(function() {
                            scope.$apply(function () {
                                fn(scope, { $event: event });
                            });
                            clicks = 0;             //after action performed, reset counter
                        }, delay);
                    } else {
                        clearTimeout(timer);    //prevent single-click action
                        clicks = 0;             //after action performed, reset counter
                    }
                });
            }
        };
    }
]);

app.directive('myClick', ['$parse', '$rootScope',
    function ($parse, $rootScope) {
        return {
            restrict: 'A',
            compile: function ($element, attrs) {
                var fn = $parse(attrs.myClick, null, true);
                return function myClick(scope, element) {
                    element.on('click', function (event) {
                        var callback = function () {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    })
                }
            }
        }
    }
]);

/*app.directive('carousel', ['$timeout', 
 function($timeout) {
 return {
 link: function(scope, elem, attr, ctrl) {
 //$timeout(function() {
 elem.owlCarousel({
 items : 3,
 lazyLoad : true,
 navigation : true
 });
 //}, 1000);
 }
 };
 }
 ]);*/

app.directive('datepickerValidationFix', function() {
    return {
        restrict: 'A',
        require: 'mdDatepicker',
        link: function(scope, element, attrs, mdDatepickerCtrl) {
            // Fix to run validation when a datepicker's minDate changes
            mdDatepickerCtrl.$scope.$watch(function() {
                return mdDatepickerCtrl.minDate;
            }, function() {
                if (mdDatepickerCtrl.dateUtil.isValidDate(mdDatepickerCtrl.date)) {
                    mdDatepickerCtrl.updateErrorState.call(mdDatepickerCtrl);
                }
            });

            // Fix to clear error state when setting date programatically from null
            mdDatepickerCtrl.$scope.$watch(function() {
                return mdDatepickerCtrl.date;
            }, function(newVal, oldVal) {
                if (!newVal && !oldVal) {
//           mdDatepickerCtrl.inputContainer.classList.remove("md-datepicker-invalid");
//           mdDatepickerCtrl.inputContainer.className("md-datepicker-input-container md-datepicker-invalid md-datepicker-valid");
                    mdDatepickerCtrl.date = null;
                }
                // if (newVal && !oldVal) {
                mdDatepickerCtrl.updateErrorState.call(mdDatepickerCtrl);
                // }
            });
        }
    }
});


app.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});

app.filter('uniqueinner', function() {
    return function(collection, keyname,innerKey) {
        var output = [],
            keys = [];

        angular.forEach(collection, function(item) {
            if( angular.isDefined(item[keyname]) && item[keyname] != null
                && angular.isDefined(item[keyname][innerKey]) && item[keyname][innerKey] != null){

                var key = item[keyname][innerKey];
                if(keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            }else{
                var key = item[keyname][innerKey];
                if(keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            }

        });

        return output;
    };
});

app.directive('myDirective', function() {
    return{
        link: function(scope, element, attr) {
            element.on('scroll', function() {
                if(element[0].scrollTop % 300 == 0) {
                    console.log('Bottom touched');
                }
            });
        }
    }
});

app.directive('exportList', ['utilityService', function (utilityService) {
    function createStatic(data, column, finalArray, conditions) {
        var header = [];
        angular.forEach(data, function (val, key) {
            var row = [];
            angular.forEach(column, function (v, k) {
                if (angular.isDefined(conditions) && Object.keys(conditions).length && conditions[k]) {
                    if (key == 0) {
                        header.push(k);
                    }
                    angular.isDefined(val[v]) ? row.push(val[v]) : row.push(' ');
                } else if(angular.isUndefined(conditions) || Object.keys(conditions).length == 0) {
                    if (key == 0) {
                        header.push(k);
                    }
                    angular.isDefined(val[v]) ? row.push(val[v]) : row.push(' ');
                }
            });
            if (key == 0) {
                finalArray.push(header);
            }
            finalArray.push(row);
        });
    }
    ;
    return{
        restrict: 'A',
        scope: {
            data: '=',
            column: '=',
            condition: '='
        },
        link: function (scope, element, attr) {
            var finalArray = [];
            element.on('click', function () {
                finalArray = [];
                createStatic(scope.data, scope.column, finalArray, scope.condition);
                var fileExtension = utilityService.getValue(attr, 'filetype', 'csv').toLowerCase();
                if(fileExtension === 'xlsx') {
                    utilityService.exportToExcel(finalArray, attr.exportList+ ".xlsx")
                } else {
                    utilityService.exportToCsv(finalArray, attr.exportList + ".csv");
                }
            });
        }
    };
}
]);


app.directive('stringToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(value) {
                return '' + value;
            });
            ngModel.$formatters.push(function(value) {
                return parseFloat(value);
            });
        }
    };
});
app.directive('wmBlock', function ($parse) {
    return {
        scope: {
            wmBlockLength: '='
        },
        link: function (scope, elm, attrs) {

            elm.bind('keypress', function(e){

                if(elm[0].value.length >= scope.wmBlockLength){
                    e.preventDefault();
                    return false;
                }
            });
        }
    }
});

app.directive('changeMonthIndexToMonthName', function (){
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var changeDateFormat = function(dateString) {
        var delimeter = dateString.charAt(2);
        var arrDate = dateString.split(delimeter);
        var monthIndex = (parseInt(arrDate[1]) - 1);
        return (arrDate[0]+ " " + month[monthIndex] + " " + arrDate[2]  )
    };
    return{
        restrict: 'AE',
        scope:{
            date: '='
        },
        template: '<span>{{changedDate}}</span>',
        link: function (scope){
            scope.changedDate = changeDateFormat(scope.date)
        }
    };
});
app.directive('employeeHistory',['$interpolate', function ($interpolate){
    return{
        restrict: 'AE',
        scope:{
            data: '=',
            type:'@'
        },
        templateUrl: 'template/module/frontend/userManagement/summary/historyDirective.html',
        link: function (scope){
            scope.historyTypeMapping = {
                joining_date:{
                    text:'Joined',
                    icon:'face'
                },
                profile_pic:{
                    text:'Updated Profile Picture',
                    icon:'person_add'
                },
                status_changed:{
                    text: $interpolate('Changed Status {{data.status? "Activated":"Inactive"}}')(scope),
                    icon:'cached'
                },
                exit_initiated:{
                    text:'Exit Initiated',
                    icon:'exit_to_app'
                },
                exit_revoked:{
                    text:'Exit Revoked',
                    icon:'exit_to_app'
                },
                exit_relieved:{
                    text:'Relieved',
                    icon:'exit_to_app'
                },
                update:{
                    icon:'update',
                    text:$interpolate('Updated {{data.profile_field_name}} from {{data.old_value_name?data.old_value_name:"N/A"}} to {{data.new_value_name?data.new_value_name:"N/A"}}')(scope)
                },
                correction:{
                    icon:'done_all',
                    text:$interpolate('Corrected {{data.profile_field_name}} from {{data.old_value_name?data.old_value_name:"N/A"}} to {{data.new_value_name?data.new_value_name:"N/A"}}')(scope)
                },
                tester:{

                    icon:'cached'
                },
                reset_password:{
                    text:'Password Reset',
                    icon:'cached'
                },
            };
        }
    };
}]);

app.directive('textareaAutoHeight', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change focus", resize);
                $timeout(resize, 3000);
            }
        };
    }
]);

// app.directive('dontCloseMenu', function ($parse, $rootScope) { 
//     return { 
//         restrict: 'AC', 
//         link: function(scope, element, attrs) { 
//             element.find('button').attr('md-prevent-menu-close', 'md-prevent-menu-close'); 
//         } 
//     } 
// });

app.directive('durationTypeInput', function() {
    return {
        restrict: 'AE',
        scope: {
            ngModel: '=',
            ngChange: '&',
            min: '@',
            max: '@',
            required: '@'
        },
        templateUrl: 'template/module/frontend/dashboard/timesheet/duration-type-directive.html',
        link: function(scope, element, attrs) {
            scope.required = (scope.required && scope.required==='true') ? true : false;
//            scope.data = {
//                hour: (angular.isDate(scope.ngModel))
//                    ? (scope.ngModel.getHours()<10 ? '0'+scope.ngModel.getHours() : ''+scope.ngModel.getHours())
//                    : null,
//                minute: (angular.isDate(scope.ngModel))
//                    ? (scope.ngModel.getMinutes()<10 ? '0'+scope.ngModel.getMinutes() : ''+scope.ngModel.getMinutes())
//                    : null
//            };
            scope.ngModel = scope.ngModel ? scope.ngModel.split(':') : [null, null];
            scope.data = {
                hour: scope.ngModel[0],
                minute: scope.ngModel[1]
            };
            scope.minVal = scope.min ? scope.min.split(':') : ['00', '00'];
            scope.maxVal = scope.max ? scope.max.split(':') : ['23', '59'];

            var buildOptionValues = function(minMinute, maxMinute) {
                scope.minutes = [];
                if(!angular.isDefined(minMinute)) {
                    scope.hours = [];
                }
                var minMinVal = minMinute ? parseInt(minMinute) : 0
                var maxMinVal = maxMinute ? parseInt(maxMinute) : 59
                for(var i = 0; i<60; i++) {
                    var count = i<10 ? '0'+i : ''+i;
                    if(i>=minMinVal && i<=maxMinVal) {
                        scope.minutes.push(count);
                    }
                    if(i>=scope.minVal[0] && i<=parseInt(scope.maxVal[0]) && !angular.isDefined(minMinute)) {
                        scope.hours.push(count);
                    }
                }
            };
            buildOptionValues();

            var returnModel = function() {
                var ch = scope.ngModel;
//                scope.ngModel = (scope.data.hour && scope.data.minute) ? new Date("1970-01-01" + " " + scope.data.hour + ':' + scope.data.minute) : scope.ngModel;
                scope.ngModel = (scope.data.hour && scope.data.minute) ? '' + scope.data.hour + ':' + scope.data.minute : null;
                if(ch !== scope.ngModel) {
                    scope.ngChange();
                }
            };
            returnModel();

            scope.onHourSelect = function() {
                if(scope.data.hour === scope.minVal[0]) {
                    scope.data.minute = scope.data.minute<scope.minVal[1] ? null : scope.data.minute;
                    buildOptionValues(scope.minVal[1]);
                } else if(scope.data.hour === scope.maxVal[0]) {
                    scope.data.minute = scope.data.minute>scope.maxVal[1] ? null : scope.data.minute;
                    buildOptionValues(undefined, scope.maxVal[1]);
                } else {
                    buildOptionValues();
                }
                returnModel();
            };

            scope.onMinuteSelect = function() {
                scope.data.hour = scope.data.hour ? scope.data.hour : '00';
                returnModel();
            };
        }
    };
});

app.directive('googleMapTrack', [ '$timeout', 'utilityService',
    function ($timeout, utilityService) {
        'use strict';
        return {
            scope: {data: '@'},
            link: function (scope, $element, $attrs){
                $timeout(function () {
                    scope.data = scope.data ? scope.data : [];
                    var data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);

                    function initialize() {
                        var locations = data; // taken data from api
                        var map = new google.maps.Map($element[0], {
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            scrollwheel: false,
                            zoom: 13,
                            center: new google.maps.LatLng(locations[0].latitude ? locations[0].latitude : locations[0].lat , locations[0].longitude ? locations[0].longitude : locations[0].lng )
                        });
                        var infowindow = new google.maps.InfoWindow();
                        var flightPathCoordinates = [];
                        for (var i = 0; i < locations.length; i++) {
                            var positionCordinate = new google.maps.LatLng(locations[i].latitude ? locations[i].latitude : locations[i].lat , locations[i].longitude ? locations[i].longitude : locations[i].lng );
                            flightPathCoordinates.push(positionCordinate);
                            var date = utilityService.dateToString(locations[i].time*1000);
                            var time = utilityService.convertTimeInStandardForms(new Date(locations[i].time*1000));
                            if(locations[i].type != 0 || ((i+1)%5==0)) {
                                var marker = new google.maps.Marker({
                                    position: positionCordinate,
                                    map: map
                                });
                                var content = '';
                                if(locations[i].type == 0) {
                                    marker.setIcon('/images/maps-icon/map-yellow-dot.png');
                                    content =  '<div style="max-width: 400px;"><p style="margin:0;"><b>Date:</b> ' + date + '</p><p style="margin:0;"><b>Time:</b> ' + time + '</p></div>';
                                }
                                if(locations[i].type == 1) {
                                    marker.setIcon('/images/maps-icon/map-green-dot.png');
                                    content =  '<div style="max-width: 400px;"><b style="color:green">Starting Point</b><p style="margin:0;"><b>Date:</b> ' + date + '</p><p style="margin:0;"><b>Time:</b> ' + time + '</p></div>';
                                }
                                if(locations[i].type == 2) {
                                    marker.setIcon('/images/maps-icon/map-red-dot.png');
                                    content =  '<div style="max-width: 400px;"><b style="color:red">Ending Point</b><p style="margin:0;"><b>Date:</b> ' + date + '</p><p style="margin:0;"><b>Time:</b> ' + time + '</p></div>';
                                }
                                if(locations[i].type == 3) {
                                    var title = utilityService.getValue(locations[i], 'title');
                                    var address = utilityService.getValue(locations[i], 'address');
                                    marker.setIcon('/images/maps-icon/map-blue-dot.png');
                                    content =  '<div style="max-width: 400px;"><b style="color:blue">Check-in</b><p style="margin:0;"><b>Date:</b> ' + date + '</p><p style="margin:0;"><b>Time:</b> ' + time + '</p>';
                                    if(title) {
                                        content += '<p style="margin:0;"><b>Title:</b> ' + title + '</p>';
                                    }
                                    if(address) {
                                        content += '<p style="margin:0;"><b>Address:</b> ' + address + '</p>';
                                    }
                                    content += '</div>';
                                }
                                if(locations[i].type == 4) {
                                    var title = utilityService.getValue(locations[i], 'title');
                                    var address = utilityService.getValue(locations[i], 'address');
                                    marker.setIcon('/images/maps-icon/map-light-blue-dot.png');
                                    content =  '<div style="max-width: 400px;"><b style="color:deepskyblue">Beat Check-in</b><p style="margin:0;"><b>Date:</b> ' + date + '</p><p style="margin:0;"><b>Time:</b> ' + time + '</p>';
                                    if(title) {
                                        content += '<p style="margin:0;"><b>Title:</b> ' + title + '</p>';
                                    }
                                    if(address) {
                                        content += '<p style="margin:0;"><b>Address:</b> ' + address + '</p>';
                                    }
                                    content += '</div>';
                                }
                                google.maps.event.addListener(marker, 'click', (function (marker,content) {
                                    return function () {
                                        infowindow.setContent(content);
                                        infowindow.open(map, marker);
                                    };
                                })(marker,content));
                            }
                        }
                        var flightPath = new google.maps.Polyline({
                            path: flightPathCoordinates,
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        flightPath.setMap(map);
                    };
                    initialize();
                }, 500);
            }
        };
    }
]);

app.directive('twoDecimalPlaces',function() {
    return {
        link:function(scope,ele,attrs) {
            ele.bind('keypress',function(e) {
                var newVal=$(this).val()+(e.charCode!==0?String.fromCharCode(e.charCode):'');
                if($(this).val().search(/(.*)\.[0-9][0-9]/) === 0 && newVal.length>$(this).val().length) {
                    e.preventDefault();
                }
            });
        }
    };
});

app.directive('runPayrollExportList', [
    'utilityService', '$timeout',
    function (utilityService, $timeout) {
        function createStatic(data, column, finalArray, conditions, total) {
            var header = [];
            angular.forEach(data, function (val, key) {
                var row = [];
                angular.forEach(column, function (v, k) {
                    if (angular.isDefined(conditions) && Object.keys(conditions).length && conditions[k]) {
                        if (key == 0) {
                            header.push(k);
                        }
                        angular.isDefined(val[v]) ? row.push(val[v]) : row.push(' ');
                    } else if(angular.isUndefined(conditions) || Object.keys(conditions).length == 0) {
                        if (key == 0) {
                            header.push(k);
                        }
                        angular.isDefined(val[v]) ? row.push(val[v]) : row.push(' ');
                    }
                });

                if (key == 0) {
                    finalArray.push(header);
                }
                finalArray.push(row);
            });
        };

        return {
            restrict: 'A',
            scope: {
                data: '@',
                column: '@',
                condition: '@',
                total: '@'
            },
            link: function (scope, element, attr) {

                var finalArray = [];
                element.on('click', function () {
                    console.log(scope)
                    scope.data = angular.isObject(scope.data) ? scope.data : JSON.parse(scope.data);
                    scope.column = angular.isObject(scope.column) ? scope.column : JSON.parse(scope.column);
                    if(!['INR', 'null', null].includes(utilityService.getStorageValue("legalCurrency"))){
                       angular.forEach(scope.data, (function(val) {
                        if(val.pan){
                            delete val.pan 
                        }
                       }))
                       delete scope.column['PAN Card No'] 
                   
                    }
                    $timeout(function () {
                        finalArray = [];
                        createStatic(scope.data, scope.column, finalArray, scope.condition, scope.total);
                        if(scope.total){
                            var lastRow = []
                            var total = JSON.parse(scope.total)
                            angular.forEach(scope.column, function (v, k) {
                                angular.isDefined(total[v]) ? lastRow.push(total[v]) : lastRow.push(' ');
                            });
                            finalArray.push(lastRow)
                        }
                        var fileExtension = utilityService.getValue(attr, 'filetype', 'csv').toLowerCase();
                        if(fileExtension === 'xlsx') {
                            utilityService.exportToExcel(finalArray, attr.runPayrollExportList + ".xlsx");

                        } else {
                            utilityService.exportToCsv(finalArray, attr.runPayrollExportList + ".csv");
                        }

                    }, 0);
                });
            }
        };
    }
]);

app.directive("savedReportRepeater", function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            report: '=',
            callback: '@'
        },
        link: function (scope, elem, attr) {
            console.log(scope.callback);
        },
        template:
        '<div layout-align="start center">' +
        '<div class="pre-rpt-cntnt qndle-strips md-height-scroll md-stiky-scroll">' +
        '<div layout="row" layout-align="start center" class="itm-heading gray sb light-gray-bg" layout-padding>' +
        '<div flex>Name (Description)</div>' +
        '<div flex="15">Created By</div>' +
        '<div flex="15"></div>' +
        '</div>' +
        '<div class="itm" layout="row" layout-align="start center" layout-padding ng-repeat="item in report.savedList">'+
        '<div flex layout="column">' +
        '<span class="blue" title="{{item.name}}" ng-click="callback(item)"> {{item.name}} </span>' +
        '<span title="{{item.description}}"> {{item.description}} </span>' +
        '</div>' +
        '<div flex="15">' +
        '<span title="{{item.created_by.full_name}}"> {{item.created_by.full_name}} </span>' +
        '</div>' +
        '<div flex="15">' +
        '<md-button class="md-raised md-primary sm-btn" ng-click="callback(item)"> Load Report </md-button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    }
});

app.directive("savedReportPivotTableHeader", function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            report: '='
        },
        template:
        '<div layout="row">'+
        '<div layout="column" flex layout-align="start start">' +
        '<span class="b md-subhead">{{report.selected.name}}</span>' +
        '<span ng-if="report.selected.description">({{report.selected.description}})</span>' +
        '</div>' +
        '<div flex="15"  layout-align="end center">' +
        '<md-button class="md-raised md-primary sm-btn" ng-click="openSaveReportPopup(\'view\')"> {{report.buttonText.change}} </md-button>' +
        '</div>' +
        '</div>'
    }
});

app.directive('focusMe', function ($timeout) {
    return {
        link: function (scope, element, attr) {
            attr.$observe('focusMe', function (value) {
                if (value === "true") {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
});


app.directive('producivityAppItem',function () {

    return {

        templateUrl: getTemplatePath('common') + 'screenshot/app-item.html'
    }
})


app.directive('pdfdirective', ['$sce', '$timeout', function($sce, $timeout) {
    return {
      restrict: 'E',
      templateUrl: getTemplatePath('common') + 'iframe.html',
      scope: {
        link: '@',
        visible: '@'
      },
      link: function(scope, element, attrs) {
          scope.$watch('link', loadframe);
          scope.docloaded = false;
          scope.timeloaded = false;
          scope.loader = true;
          console.log(scope.link);
          function loadframe() {
            scope.trustedUrl = $sce.trustAsResourceUrl(scope.link);
            var iframecreate = document.getElementById('iframejob');
            
            /*var baseframe = document.createElement('iframe');
            iframecreate.appendChild(baseframe);
            baseframe.setAttribute("id", "iframetag");
            baseframe.setAttribute('src', scope.trustedUrl);
            baseframe.style.width = "0%";
            baseframe.style.height = "0px";*/

            var baseframe = document.createElement('embed');
            iframecreate.appendChild(baseframe);
            baseframe.setAttribute("id", "embedtag");
            baseframe.setAttribute('src', scope.trustedUrl);
            baseframe.style.width = "0%";
            baseframe.style.height = "0px";

            

            scope.timeloaded = true;
            document.getElementById('embedtag').onload= function() {
                document.getElementById("loaderiframe").remove();
                document.getElementById("messageiframe").remove();
                scope.loader = false;
                baseframe.style.width = "100%";
                baseframe.style.height = "600px";
                scope.docloaded = true;
            };
            $timeout( function(){
                if(scope.docloaded == false && scope.timeloaded == true) {
                    console.log("Request Iframe");
                    //location.reload();
                    loadframe()
                }
            }, 25000 );
          }
      }
    }
}]);


  app.directive('onlyNumbersPlusSpace', [
    function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined

                    if (inputValue == undefined) return '' ;
                    var transformedInput = inputValue.replace(/[^0-9]+ /g, '');
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    element.bind('blur', function (event) {
                        var fieldValue = element.val();
                        fieldValue = fieldValue.replace(/^\s+|\s+$/g,'');
                        element.val(fieldValue);
                    });

                    return transformedInput;
                });
            }
        };
    }
]);

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });
                event.preventDefault();
            }
        });
    };
});


