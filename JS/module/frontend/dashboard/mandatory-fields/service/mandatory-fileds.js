app.service('MandatoryFiledService', [
    'utilityService', 'FORM_BUILDER',
    function (utilityService, FORM_BUILDER) {
        'use strict';
        var selfService = this;

        this.url = {
//        	segment: 'employee/account-summary',
            segment: 'employee/unfilled-mandatory-fields',
            allUser: 'user-addition/users-preview',
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };

        var payloadRapper = function (v, k, self, payload) {
            if (v.field_type != 14) {
                if (v.field_type == 13 && self && angular.isDefined(v.validator)
                        && v.validator.is_multi_select == '0' && v.value != null) {
                    payload[v.slug] = angular.isObject(v.value._id)
                            ? new Array(v.value._id.$id) : new Array(v.value._id);
                } else if (v.field_type == 13 && self && angular.isDefined(v.validator)
                        && v.validator.is_multi_select == '1') {
                    angular.forEach(self.value, function (val, ke) {
                        var values = [];
                        angular.forEach(val, function (result, index) {
                            values.push(result.id);
                        })
                        payload[ke] = values;
                    })
                } else if (v.field_type == 6) {
                    payload[v.slug] = selfServive.formatTime(v.value);
                } else if (v.field_type == 5 && v.value && v.value != "NaN/NaN/NaN") {
                    payload[v.slug] = utilityService.dateFormatConvertion(v.value);
                } else if (v.format_type == 1 || v.field_type == 10 || v.field_type == 12) {
                    if (v.value != null) {
                        payload[v.slug] = v.value.toString();
                    }
                } else if (v.field_type == 11) {
                    payload[v.slug] = [];
                    angular.forEach(v.element_details, function (v11, k11) {
                        if (angular.isDefined(v11.isChecked) && v11.isChecked) {
                            payload[v.slug].push(v11._id);
                        }
                    });
                } else if (v.field_type == 3) {
                    payload[v.slug] = v.value != "" ? parseInt(v.value) : v.value;
                } else if (v.field_type == 9) {
                    payload[v.slug] = v.value.toLowerCase();
                } else {
                    payload[v.slug] = v.value;
                }
            }
        };
        this.buildDynamicPayloadForSetupField = function (allItem, self, minimumRepeatValue) {
            var payload = {errorMessages: []};
            angular.forEach(allItem, function (item, itemk){
            angular.forEach(item.emp_visible_mandatory_profile_field, function (v, k) {
                var setValueObject = {};
                if (v.field_type == 14 && angular.isDefined(v.child_details) && v.child_details.length) {
                    angular.forEach(v.child_details, function (value, key) {
                        if (!v.is_repeatable) {
                            if (value.field_type == 14) {
                                angular.forEach(value.child_details, function (value2, key2) {
                                    payloadRapper(value2, key2, self, payload)
                                });
                            } else {
                                payloadRapper(value, key, self, payload);
                            }
                        } else {
                            angular.forEach(value, function (vr, kr) {
                                payloadRapper(vr, kr, self, payload);
                                if ((angular.isDefined(vr.value) && vr.value != "" && vr.value && vr.value != null) || (angular.isArray(payload[kr]) && payload[kr].length)) {
                                    setValueObject[key] = 1;
                                }
                            });
                        }
                    });
//                    if (angular.isDefined(minimumRepeatValue[v.slug]) && minimumRepeatValue[v.slug] > Object.keys(setValueObject).length) {
//                        payload["errorMessages"].push("Minimum " + minimumRepeatValue[v.slug] + " levels of " + v.name + " are required.");
//                    }
                } else {
                    payloadRapper(v, k, self, payload);
                }
            });    
            });
            return payload;
        };
        
        this.buildRemoveRepeateChildPayload = function (removedItem, item, index){
            var payload = {
                removedItemSulgs: [],
                isRemoveByDB: false
            };
            angular.forEach(removedItem, function (v, k) {
                if (item.value_on_set_slug.indexOf(k) > -1) {
                    payload.isRemoveByDB = true;
                }
                if (angular.isDefined(v._id)) {
                    var obj = {
                        _id: v._id,
                        slug: v.slug
                    };
                    if (angular.isDefined(v.can_changable)) {
                        obj.can_changable = v.can_changable;
                    }
                    payload.removedItemSulgs.push(obj);
                }
            });
            return payload;
        };

        return this;
    }
]);