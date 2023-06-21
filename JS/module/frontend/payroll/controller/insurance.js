app.controller('InsuranceController', [
    '$scope', '$timeout', 'InsuranceService', 'utilityService', 'ServerUtilityService', 'Upload', '$rootScope',
    function($scope, $timeout, insuranceService, utilityService, serverUtilityService, Upload, $rootScope) {
        
        var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        $scope.insuranceObj = insuranceService.buildInsuranceObject();
        $scope.monthHasMap = insuranceService.buildMonthDetails();
        $scope.insuranceID = null;
        $scope.selectedTypeCount = 0;
        $scope.selectedType = {};
        $scope.updateInsuranceFlag = false;
        $scope.selectAll = {
            isCheck: false,
            filteredList: []
        };

        $scope.updatePaginationSettings('payroll_insurance');
        var syncInsuranceTypeModel = function(model) {
            $scope.insuranceObj.model = insuranceService.buildInsuranceTypeModel(model);
        };
        syncInsuranceTypeModel();
        var getMonthWiseDetails = function(item) {
            $scope.MonthArrayName = [];
            $scope.MonthlyPremium = [];
            var mName = null,
                mPremium = null,
                policyStartDate = utilityService.stringToDate(utilityService.changeDateFormat(item.doj)),
                policyEndDate = utilityService.stringToDate(utilityService.changeDateFormat(item.policy_expiry)),
                firstMonthDate = new Date(policyStartDate),
                lastMonthDate = new Date(policyEndDate),
                totalPremiumDays = insuranceService.dayDiffrence(policyStartDate, policyEndDate),
                oneDayPremium = parseInt(item.prorata_incl_tax) / parseInt(totalPremiumDays),
                monthList = insuranceService.getMonthListBetweenDates(policyStartDate, policyEndDate);

            firstMonthDate = firstMonthDate.getDate();
            lastMonthDate = lastMonthDate.getDate();
            oneDayPremium = oneDayPremium.toFixed(2);
                        
            angular.forEach(monthList.monthWithYear, function(value, key) {
                angular.forEach($scope.monthHasMap, function(v, k) {
                    if (v.id == value.month) {
                        if (key == 0) {
                            v.days = parseInt(v.days) - parseInt(firstMonthDate) + 1;
                        }
                        if (key == (monthList.monthWithYear.length - 1)) {
                            v.days = parseInt(lastMonthDate);
                        }
                        mName = v.name + " " + value.year;
                        mPremium = oneDayPremium * parseInt(v.days);
                        mPremium = Math.round(mPremium * 100) / 100;
                        $scope.MonthArrayName.push(mName);
                        $scope.MonthlyPremium.push(mPremium);
                    }
                });
            });
            var total = $scope.MonthlyPremium.reduce(function(a, b){return a + b}, 0);
        };
        $scope.toggelMonthlyDetails = function(item) {
            getMonthWiseDetails(item);
            $('#monthly-premium').appendTo("body").modal('show');
        };
        var successCallback = function(data, list, section, isAdded, type) {
            utilityService.resetAPIError(false, null, section);
            if (angular.isDefined(data.data)) {
                isAdded ? list.unshift(data.data) : utilityService.refreshList(list, data.data);
                utilityService.showSimpleToast(data.message);
                $scope.selectedTypeCount = 0;
                $scope.selectedType = {};
                $scope.selectAll.isCheck = false;
            }
            if (type == "insuranceType") {
                $scope.insuranceID = data.data._id;
                getEmployeeInsuranceList(data.data.slug);
            }
            $('#insurance-type').modal('hide');
        };
        var errorCallback = function(data, section) {
            if (data.status === "error") {
                utilityService.resetAPIError(true, data.message, section);
            } else {
                utilityService.resetAPIError(true, "something went wrong", section);
                angular.forEach(data.data.message, function(value, key) {
                    $scope.errorMessages.push(value[0]);
                });
            }
        };
        var successErrorCallback = function(data, list, section, isAdded, type) {
            data.status === "success" ? successCallback(data, list, section, isAdded, type) : errorCallback(data, section);
        };
        var resetErrorMessages = function() {
            $scope.errorMessages = [];
        };
        $scope.resetAPIError = function(status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        $scope.isShow = false;
        var getInsuranceType = function() {
            $scope.isShow = false;
            serverUtilityService.getWebService(insuranceService.getUrl('getInsuranceType'))
                .then(function(data) {
                    $scope.insuranceObj.insuranceTypeList = data.data;
                    if (data.data.length) {
                        $timeout(function() {
                            $scope.insuranceID = data.data[0]._id;
                            $scope.getSlugName(data.data[0]._id);
                            $scope.isShow = true;
                        }, 200);
                    }
                });
        };
        getInsuranceType();
        $scope.getSlugName = function(insuranceId) {
            $scope.slugName = null;
            angular.forEach($scope.insuranceObj.insuranceTypeList, function(value, key) {
                if (value._id == insuranceId) {
                    $scope.slugName = value.slug;
                }
            });
            getEmployeeInsuranceList($scope.slugName);
        };
        var empInsuranceObj = function(list) {
            angular.forEach(list, function(val, key) {
                val.employee_id = val.emp_id;
                val.full_name = val.name;
            });

            return list;
        };
        var getEmployeeInsuranceList = function(slugName) {
            var url = insuranceService.getUrl('getEmployeeList') + "/" + slugName;
            serverUtilityService.getWebService(url).then(function(data) {
                empInsuranceObj(data.data);
                $scope.insuranceObj.allEmployeeList = data.data;
            });
        };
        $scope.toggelInsuranceType = function(form, action, item) {
            $scope.errorMessages = [];
            item = angular.isDefined(item) ? item : null;
            if (item) {
                $scope.updateInsuranceFlag = true;
                syncInsuranceTypeModel(item);
            }
            if (action == 'add') {
                $scope.updateInsuranceFlag = false;
                utilityService.resetForm(form);
                syncInsuranceTypeModel();
            }
            $('#insurance-type').appendTo("body").modal('show');
        };
        var downloadFile = function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            window.location.assign(uri);
        };
        $scope.downloadCsv = function(type) {
            var url = insuranceService.getUrl(type),
                csvName = type == 'insuranceDeletion' 
                    ? 'Insurance_Deletion' : 'Insurance_Addition';
            
            serverUtilityService.getWebService(url).then(function(data) {
                downloadFile(data.data, csvName + ".csv");
            });
        };
        $scope.saveInsuranceType = function() {
            var url = insuranceService.getUrl('addInsuranceType'),
                payload = {
                    insurance_name: $scope.insuranceObj.model.insurance_name
                };

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, $scope.insuranceObj.insuranceTypeList, "insurance", true, "insuranceType");
                });
        };
        $scope.updateInsuranceType = function() {
            var url = insuranceService.getUrl('updateInsuranceType') + "/" + $scope.insuranceObj.model._id,
                payload = {
                    insurance_name: $scope.insuranceObj.model.insurance_name
                };

            serverUtilityService.putWebService(url, payload)
                .then(function(data) {
                    successErrorCallback(data, $scope.insuranceObj.insuranceTypeList, "insurance");
                });
        };
        $scope.deleteInsuranceType = function(item) {
            var url = insuranceService.getUrl('deleteInsurancType') + "/" + item.slug;
            serverUtilityService.deleteWebService(url)
                .then(function(data) {
                    $scope.insuranceObj.insuranceTypeList = utilityService.deleteCallback(data, item, $scope.insuranceObj.insuranceTypeList);
                    utilityService.showSimpleToast(data.message);
                    if (data.status === "success") {
                        $('#insurance-type-delete').modal('hide');
                        getInsuranceType();
                    } else {
                        $('#insurance-type-delete').modal('hide');
                    }
                });
        };
        $scope.insuranceConfirmation = function(item) {
            $scope.deleteInsuranceTypeId = item;
            $('#insurance-type-delete').appendTo("body").modal('show');
        };
        $scope.empInsuranceConfirmation = function(list) {
            $scope.deleteEmpInsuranceList = list;
            $('#insurance-emp-delete').appendTo("body").modal('show');
        };
        $scope.deleteEmpInsurance = function(list) {
            var url = insuranceService.getUrl('deleteEmpInsurance'),
                payload = {},
                empId = [];

            angular.forEach(list, function(row) {
                if ($scope.selectedType[row._id]) {
                    empId.push(row._id);
                }
            });
            payload.ensurance_ids = empId;
            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    utilityService.showSimpleToast(data.message);
                    getEmployeeInsuranceList($scope.slugName);
                    if (data.status === "success") {
                        $('#insurance-emp-delete').modal('hide');
                    }
                });
        };
        $scope.bindFileChangeEvent = function(csvData, individulaFlag) {
            $scope.individulaFlag = angular.isDefined(individulaFlag) ? true : false;
            $timeout(function() {
                $("input[type=file]").on('change', function() {
                    var data = {
                        data_csv: csvData.csv_attachment,
                    };
                    $scope.updateBulkInsurance(csvData);
                    $scope.isUploaded = true;
                });
            }, 100);
        };
        $scope.updateBulkInsurance = function(type, file, errFiles) {
            if (file) {
                $scope.f = file;
                $scope.errFile = errFiles && errFiles[0];
                var urlType = type == 'addInsurance' 
                    ? insuranceService.getUrl('addEmpInsurace') : insuranceService.getUrl('updateEmpInsurance'),
                    payload = {
                        data_csv: file,
                        insurance_type: $scope.slugName
                    };

                Upload.upload({
                    url: urlType,
                    headers: {
                        'Authorization': "Bearer " + utilityService.getStorageValue('accessToken')
                    },
                    data: payload,
                }).then(function(response) {
                    uploadSuccessCallback(response);
                }, function(response) {
                    successErrorCallback(response.data, 'insurance');
                }, function(evt) {
                    uploadProgressCallback(evt);
                });
            }
        };
        var getAlphaIndexing = function(resp) {
            $scope.errCount = 0;
            var data = [];
            angular.forEach(resp.data, function(val, key) {
                data.push(val);
                angular.forEach(val, function(v, k) {
                    if (angular.isDefined(v.error) && v.error.length) {
                        $scope.errCount += 1;
                    }
                });
            });
            $scope.totalRecords = data.length;
            $scope.alphIndex = [];
            var len = Object.keys(data[0]).length;
            for (var i = 0; i < len; i++) {
                if (i > 25) {
                    $scope.alphIndex.push("A" + alphabets[(i % 25) - 1]);
                } else {
                    $scope.alphIndex.push(alphabets[i]);
                }
            }
            $scope.flag = true;
        };
        var uploadSuccessCallback = function(response) {
            if (response.data.status == 'error') {
                alert(response.data.error);
            }
            if (response.data.status == 'success') {
                utilityService.showSimpleToast(response.data.message);
                getEmployeeInsuranceList($scope.slugName);
            } else {
                getAlphaIndexing(response);
                $rootScope.parsedCsv = response.data;
                getEmployeeInsuranceList($scope.slugName);
                if ($scope.errCount > 0) {
                    $('#import-insurance').appendTo("body").modal('show');
                }
            }
        };
        var uploadErrorCallback = function(response) {
            console.log("error in Upload", response);
        };
        var uploadProgressCallback = function(evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        };
        $scope.updateCount = function(list) {
            $scope.selectedTypeCount = 0;
            angular.forEach($scope.selectedType, function(val, key) {
                if (val) {
                    $scope.selectedTypeCount++;
                }
            });
            if ($scope.selectedTypeCount == 0) {
                $scope.selectAll.isCheck = false;
            }
        };
        $scope.checkAll = function(isCheck, list) {
            angular.forEach(list, function(row) {
                $scope.selectedType[row._id] = isCheck;
            });
            $scope.updateCount();
        };
        $scope.insStatus = null;
        $scope.setStatusType = function(type) {
            $scope.insStatus = type;
        };
        $scope.csvColumn = {
            'Employee ID': 'emp_id',
            'Insure Name': 'name',
            'Relation': 'relationship',
            'Claim Status': 'claim_status',
            'Date Of Leaving': 'clearanceStatusName',
            'Prorata': 'premium_prorata',
            'Prorata Tax': 'prorata_tax',
            'Prorata Including Tax': 'prorata_incl_tax',
            'Sum Insured': 'sum_insured',
            'Premium': 'premium',
            'Premium Tax': 'premium_tax',
            'Premium Including Tax': 'premium_inc_tax',
            'DOB': 'dob',
            'Gender': 'gender',
            'Age': 'age',
            'Endorsement No.': 'endorsement_no',
            'Policy Start Date': 'doj',
            'Policy Expiry Date': 'policy_expiry',
            'Remaining Days': 'remaing_days',
            'Remarks': 'remarks'
        };

        $scope.resetAPIError = function(status, message, api) {
            $scope.apiError = utilityService.resetAPIError(status, message, api);
        };
        
    }
]);