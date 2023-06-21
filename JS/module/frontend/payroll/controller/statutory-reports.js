app.controller("StatutoryReportsController", [
  "$scope",
  "$modal",
  "utilityService",
  "ServerUtilityService",
  "StatutoryReportsService",
  function($scope, $modal, utilityService, serverUtilityService, service) {
    "use strict";

    $scope.UAERegion = ['INR', null, 'null'].includes(utilityService.getStorageValue("legalCurrency")) ? false : true;
    $scope.statutory = service.buildStatutoryReportsObject($scope.envMnt, $scope.UAERegion);
    $scope.sortObj = {
      key: "0",
      reverse: false
    };
    $scope.legal_entity = {
      selected: null,
      entity_id: utilityService.getStorageValue("legalEntityId")
    };
    
    $scope.disabledForYear2020 = ['Jan', 'Feb', 'Mar'];
    $scope.getLegalEntity = function() {
      if ($scope.legal_entity.entity_id) {
        var entities_list = JSON.parse(
          utilityService.getStorageValue("legalEntityElements")
        );
        $scope.legal_entity.selected = entities_list.find(function(val) {
          return val._id == $scope.legal_entity.entity_id;
        });
      } else {
        $scope.legal_entity.selected = null;
      }
    };
    $scope.getLegalEntity();
    var getStateList = function() {
      var url = service.getUrl("states");
      serverUtilityService.getWebService(url).then(function(data) {
        $scope.statutory.filters.states.list = utilityService.getValue(
          data,
          "data",
          []
        );
      });
    };
    getStateList();

    $scope.changeReportTypeHandler = function(form) {
      form.$setPristine();
      form.$setUntouched();
      $scope.statutory.filters.years.selected = null;
      $scope.statutory.filters.months.selected = null;
      $scope.statutory.filters.states.selected = null;
      $scope.statutory.reports.rows = [];
      $scope.statutory.viewMode = false;
      $scope.statutory.reports.visible = false;
    };
    $scope.changeSlipYear = function() {
      $scope.statutory.filters.months.selected = null;
    };
    $scope.changeSlipMonth = function() {
      //getSlipStatus();
    };
    $scope.isSalarySlipYearVisible = function(item) {
      var isVisible = false;

      if (
        item >= $scope.statutory.currentYear &&
        ($scope.statutory.currentMonth > 1 ||
          $scope.statutory.currentDay >= utilityService.payrollProcessingDay)
      ) {
        isVisible = true;
      } else if (
        item == utilityService.startYear ||
        (item < $scope.statutory.currentYear && item > utilityService.startYear)
      ) {
        isVisible = true;
      }
      return isVisible;
    };
    $scope.isSalarySlipMonthVisible = function(index) {
      var isVisible = false;

      if (
        $scope.statutory.filters.years.selected >= $scope.statutory.currentYear
      ) {
        if (
          index < $scope.statutory.currentMonth ||
          (index == $scope.statutory.currentMonth &&
            $scope.statutory.currentDay >= utilityService.payrollProcessingDay)
        ) {
          isVisible = true;
        }
      } else {
        if (
          $scope.statutory.filters.years.selected == utilityService.startYear
        ) {
          isVisible =
            $scope.envMnt == "norlanka"
              ? index >= utilityService.norlankaStartMonth
              : index >= utilityService.startMonth;
        } else {
          isVisible = true;
        }
      }
      return isVisible;
    };

    var buildReportData = function(data, reportTypeSlug) {
      var functionName = utilityService.getValue(
        $scope.statutory.filters.type.selected,
        "buildTableFunction"
      );
      var report =
        reportTypeSlug == "lwf" || reportTypeSlug == "pt"
          ? service[functionName](
              data,
              $scope.statutory.filters.states.selected
            )
          : service[functionName](data, $scope.UAERegion);
      $scope.statutory.reports.headers = report.headers;
      $scope.statutory.reports.rows = report.rows;
    };

    $scope.viewDownloadFile = function() {
      if (!$scope.statutory.filters.type.selected) {
        return false;
      }
      $scope.statutory.viewMode = false;
      var typeSlug = utilityService.getValue(
        $scope.statutory.filters.type.selected,
        "slug"
      );
      var url = service.getUrl("report_api_" + typeSlug),
        param = {
          year: $scope.statutory.filters.years.selected,
          month: $scope.statutory.filters.months.selected
        };
      if ($scope.statutory.filters.states.selected) {
        param.state_code = $scope.statutory.filters.states.selected;
      }
      if (
        utilityService.getInnerValue(
          $scope.wrapperObject,
          "allEntityReport",
          "selectedOption"
        ) === "all"
      ) {
        param["all-legal-entities"] = true;
      }
      serverUtilityService.getWebService(url, param).then(function(data) {
        buildReportData(data.data, typeSlug);
        if(angular.isDefined(data.extra_data)) {
          $scope.statutory.reports.extraData = buildExtraData(data.extra_data, typeSlug);
        }
        $scope.statutory.viewMode = true;
        $scope.statutory.reports.visible = true;
      });
    };

    

    $scope.sortTable = function(key) {
      $scope.sortObj.reverse =
        $scope.sortObj.key == key ? !$scope.sortObj.reverse : false;
      $scope.sortObj.key = "" + key;
    };

    $scope.downloadReportAs = function(fileType) {
      if (
        !$scope.statutory.filters.type.selected ||
        !$scope.statutory.reports.rows.length
      ) {
        return false;
      }
      var csvData = [];
      if ($scope.statutory.filters.type.selected.reportHeaderText) {
        var title =
          $scope.statutory.filters.type.selected.reportHeaderText +
          " " +
          $scope.statutory.filters.months.list[
            $scope.statutory.filters.months.selected - 1
          ] +
          " " +
          $scope.statutory.filters.years.selected;
        csvData.push(["", title]);
        csvData.push([""]);
      }
      
      if(utilityService.getInnerValue($scope.statutory.reports, 'extraData', 'reportHeading')) {
        csvData.push(['', $scope.statutory.reports.extraData.reportHeading])
        csvData.push([""]);

      }

      csvData.push($scope.statutory.reports.headers);
      angular.forEach($scope.statutory.reports.rows, function(row, ind) {
        csvData.push(row);
      });

      if(utilityService.getInnerValue($scope.statutory.reports, 'extraData', 'lastRow')) {
        angular.forEach($scope.statutory.reports.extraData.lastRow, function(row){
          csvData.push(row);
        }) 
        // csvData.push($scope.statutory.reports.extraData.lastRow)
      }

      var filename = $scope.statutory.filters.type.selected.name;
      if (
        $scope.legal_entity.entity_id &&
        !utilityService.getInnerValue(
          $scope.wrapperObject,
          "allEntityReport",
          "selectedOption"
        )
      ) {
        filename +=
          "_" + utilityService.getValue($scope.legal_entity.selected, "name");
      }
      if (fileType === "xlsx") {
        utilityService.exportToExcel(csvData, filename + ".xlsx");
      } else {
        utilityService.exportToCsv(csvData, filename + ".csv");
      }
    };

    /***** Start Angular Modal Section *****/
    $scope.openModal = function(templateUrl, instance, size) {
      size = size || "lg";
      $scope.modalInstance[instance] = $modal.open({
        templateUrl: templateUrl,
        scope: $scope,
        windowClass: "fadeEffect",
        size: size
      });
    };
    $scope.closeModal = function(instance) {
      if (utilityService.getValue($scope.modalInstance, instance)) {
        $scope.modalInstance[instance].dismiss();
      }
    };
    /***** End Angular Modal Section *****/
    $scope.updatePaginationSettings("statutory_reports");

    /***** Start: Get Payroll All Entity Permission Section *****/
    var getPayrollAllEntityPermission = function() {
      $scope.wrapperObject.allEntityReport.selectedOption = "";
      serverUtilityService
        .getWebService(service.getUrl("allEntityPermission"))
        .then(function(data) {
          $scope.wrapperObject.allEntityReport.hasPermission =
            utilityService
              .getValue(data, "data", [])
              .indexOf($scope.wrapperObject.allEntityReport.permissionSlug) >=
            0;
        });
    };
    if (
      utilityService.getInnerValue(
        $scope.wrapperObject,
        "legalEntity",
        "enabled"
      ) &&
      utilityService.getInnerValue($scope.wrapperObject, "legalEntity", "id") &&
      utilityService.getInnerValue(
        $scope.wrapperObject,
        "allEntityReport",
        "enabled"
      )
    ) {
      getPayrollAllEntityPermission();
    }

    var buildExtraData = function(data, typeSlug) {
    
      return {
        reportHeading: utilityService.getValue(data, 'heading', ''),
        lastRow: service.extractLastRow(data, typeSlug)
      }
    }
    /***** End: Get Payroll All Entity Permission Section *****/
  }
]);
