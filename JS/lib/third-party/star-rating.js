"use strict";
angular.module('starRating',[])
.factory('starRatingData',function(){
  var guid;
  var create_new_guid = function(){
    function digit() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    //guid = digit() + digit() + '-' + digit() + '-' + digit() + '-' + digit() + '-' + digit() + digit() + digit();
    guid = digit() + digit() + digit();
    return this;
  }

  var get_guid = function(){return guid;}
  return {
    create_new_guid: create_new_guid,
    get_guid: get_guid
  };
})
.directive('starRating',['starRatingData','$rootScope',function(starRatingData,$rootScope){
  var template = function(element, attrs){
    var starTemplateWithVars ='\
    <input id="##id##" ##readonly## type="radio" value="##value##" name="fieldName" ng-model="fieldModelName"/>\
    <label for="##id##" class="##class##"></label>';

    var templateWithVars = '<div class="row starrating">\
    <div class="col-md-6">ratingsubject</div>\
    <div class="col-md-6 text-right">\
    <div class="star-rating ##readonly##" ##controller## >\
    ##stars##\
    </div>\
    </div>\
    </div>\
    ';
    var fieldModelName = get_modelname(attrs);
    var stars = "", ctrl = "";
    var staramount = attrs.staramount || 5;
    var nohalfs = angular.isDefined(attrs.nohalfs);
    var step = (nohalfs)?1:0.5;

    var star_readonly = (angular.isDefined(attrs.readonly) || angular.isDefined(attrs.ngReadonly))?'ng-disabled="true" ng-readonly="true"':"";
    var readonly = (angular.isDefined(attrs.readonly) || angular.isDefined(attrs.ngReadonly))?'readonly':"";
    for (var i = staramount, turn = 1; i > 0; i = i-step, turn++) {
      var even = turn % 2;
      var newStarTemplate = "";
      if(!nohalfs){
         newStarTemplate = starTemplateWithVars.replace(/##class##/,(even)?'full':'half');
      }else {
          newStarTemplate = starTemplateWithVars.replace(/class="##class##"/,'');
      }

      if(angular.isDefined(attrs.controller)){
        ctrl = "ng-controller='"+ attrs.controller + "'";
      }
      var id =  fieldModelName.replace('.','_');
      id+= "_star_";
      id+= !even ? (''+i).replace('.','_') : i;
      stars += newStarTemplate.replace(/##value##/,i).replace(/##id##/g,id).replace(/##readonly##/,star_readonly);
    }
    var template = templateWithVars
    .replace(/ratingsubject/g, attrs.ratingsubject || "")
    .replace(/##stars##/,stars)
    .replace(/##readonly##/,readonly)
    .replace(/fieldName/g, get_modelname(attrs))
    .replace(/fieldModelName/g, get_name(attrs).join('.'))
    .replace(/##controller##/,ctrl);
    return template;
  }

  var get_name = function(attrs){
    var modelAndField = attrs.ngModel;
    var names = modelAndField.split('.');
    return names;
  }

  var get_fieldname = function(attrs){
    var names = get_name(attrs);
    names.shift();
    var model = names.shift();
    var fieldname = "";
    angular.forEach(names, function(value, key) {
      fieldname += "["+value+"]";
    });
    fieldname = model+fieldname;
    return fieldname;
  }
  var get_modelname = function(attrs){
    var names = get_name(attrs);
    names.shift();
    var fieldname = names[names.length -1];
    return fieldname;
  };

  return {
    restrict: 'E',
    replace: false,
    controller: function($scope){},
    require: ['^form', 'ngModel'],
    template: template,
    link: function($scope, elem, attrs, ctrls){
      $scope.form = ctrls[0];
      var ngModel = ctrls[1];

            var fieldModelName = get_modelname(attrs);

      $scope.$watch(fieldModelName, function() {
        var val = $scope[fieldModelName];
        if(val === undefined){
          val = eval('$scope.'+ attrs.ngModel);
        }

        ngModel.$setViewValue(val);
        ngModel.$render();
        ngModel.$commit
      });

    }
  };
}]);
