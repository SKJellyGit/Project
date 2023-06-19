app.controller('TeamLndController', ['$scope', 'utilityService', 'ServerUtilityService', 'LeaveSummaryService', 'TeamLndService', '$modal', 'memberSearchFilter', function ($scope, utilityService, ServerUtilityService, summaryService, TeamLndService, $modal) {

    $scope.updatePaginationSettings('lnd_myteam_training_listing')
    var self = this
    var teamOwnerId = summaryService.getTeamOwnerId($scope.breadcrum);
    self.searchText = ''
    self.searchBy = {
        'full_name': 'Full Name',
        'personal_profile_employee_code': 'Employee Code'
    }
    self.searchMode = 'full_name'

    $scope.filteredTrainings = []
    $scope.filters = {
        keyWordSearch: {
            training_name: {
                training_name: ''
            }

        },
        status: {
            request_status: ''
        },
        type: {
            training_type: ""
        },
        sort: {
            propertyName: '',
            reverse: false
        }

    }
    $scope.sortBy = function (model, propertyName) {
        model.reverse = (model.propertyName === propertyName) ? !model.reverse : false;
        model.propertyName = propertyName;
    };

    $scope.resetTrainingFilter = function () {
        $scope.filters.keyWordSearch.training_name = { training_name: '' }
        $scope.filters.type = { training_type: '' }
        $scope.filters.sort.propertyName = ''
        $scope.filters.sort.reverse = false
    }

    /*Summary start */
    $scope.summaryPayload = TeamLndService.buildGetSummaryPayload()
    $scope.summaryTrainingList = []
    $scope.employeeSummary = null
    $scope.eventCount = null
    $scope.getEmployeeSummary = function () {
        var url = $scope.summaryPayload.employeeSummary ? TeamLndService.getUrl('employeeSummary') + '?search=' + $scope.summaryPayload.employeeSummary : TeamLndService.getUrl('employeeSummary')
        $scope.employeeSummaryVisible = false
        ServerUtilityService.getWebService(url).then(function (response) {

            if (response.status == 'success') {
                $scope.employeeSummary = TeamLndService.buildEmployeeSummary(response.data)
                $scope.employeeSummaryVisible = true
            }
            else {
                $scope.employeeSummaryVisible = true
            }
            // console.log(response)
        })

    }

    $scope.getEventCount = function () {
        var url = TeamLndService.getUrl('eventCount') + '?search=' + $scope.summaryPayload.eventCount
        $scope.eventCountVisible = false
        ServerUtilityService.getWebService(url).then(function (response) {
            $scope.eventCount = TeamLndService.buildEventCount(response.data)
            $scope.eventCountVisible = true
            // console.log(response)
        })
    }

    $scope.getEmployeeSummary()
    $scope.getEventCount()

    $scope.resetTrainingSummary = function () {
        $scope.summaryPayload.employeeSummary = null
        $scope.getEmployeeSummary()
    }
    /*Summary End */


    var buildGetParams = function () {
        var params = {
            rel_id: $scope.relationship.primary.model._id,
            direct_reportee: $scope.relationship.secondary.model.slug == "direct_reportee" ? true : false
        };
        if (teamOwnerId) {
            params.emp_id = teamOwnerId;
        }
        return params;
    };
    var successCallback = function (data) {
        $scope.error_messages = []
    }

    var errorCallback = function (error) {
        $scope.error_messages.push(error.message)
    }



    $scope.error_messages = []
    $scope.success_messages = []
    $scope.modal_loader = false
    $scope.request_mode = 'unnominated'
    $scope.trainingTypes = TeamLndService.buildTrainingTypes()

    $scope.openModal = function (instance, templateUrl, size) {
        $scope.modalInstance[instance] = $modal.open({
            templateUrl: templateUrl,
            scope: $scope,
            windowClass: 'fadeEffect',
            size: size || 'md'
        });
    };
    $scope.closeModal = function (instance) {
        if ($scope.modalInstance[instance]) {
            $scope.modalInstance[instance].close();
        }
    };

    //Creates listing data
    var getTrainingList = function () {
        $scope.summaryTrainingListVisible = false
        ServerUtilityService.getWebService(TeamLndService.getUrl('getTrainingList'), buildGetParams())
            .then(
                function (response) {
                    if (response.status == 'success') {
                        $scope.trainings = TeamLndService.buildTrainingHash(response.data)
                        $scope.summaryTrainingList = response.data.filter(
                            function (training) {
                                return training.attributes
                            }
                        ).map(function (training) {
                            return {
                                _id: training.details._id,
                                name: training.details.training_name
                            }
                        })
                        $scope.summaryTrainingListVisible = true
                    }
                    else {
                        $scope.trainings = []
                        $scope.summaryTrainingList = []
                        $scope.summaryTrainingListVisible = true
                    }
                }
            )
    }

    getTrainingList()


    //Opens modal and to send nominate request for approval
    $scope.nominateTeam = function (training, modalInstance, templateUrl, open) {
        $scope.modal_loader = true
        ServerUtilityService.getWebService(TeamLndService.getUrl('getNominateTeamList') + training._id, buildGetParams())
            .then(
                function (data) {
                    //Create modal data based on training type id

                    var nomTraining = {
                        training_type_id: training._id,
                        workflow_id: training.workflow,
                        request_type: 1,//1 for nominating 2/3-for unregistering members
                        requested_quantity: 1
                    }
                    $scope.error_messages = []
                    $scope.success_messages = []
                    self.nominateModal = TeamLndService.buildNominateModalViewPayload(data.data, nomTraining)
                    $scope.modal_loader = false
                    if (open) {
                        $scope.openModal(modalInstance, templateUrl)
                    }

                }
            )
    }


    $scope.getImagePath = function (name) {
        return getAPIPath() + 'images/' + name
    }

    $scope.openUrlInOtherTab = function (url) {
        window.open(addHttpPrefix(url), '_blank')
    }
    var addHttpPrefix = function (url) {
        var regex = /^http/
        if (regex.test(url)) {
            return url
        }
        else {
            return 'https://' + url
        }
    }

    $scope.openDetailsPage = function (id) {

        $scope.detailsLoading = true
        ServerUtilityService.getWebService(TeamLndService.getUrl('getTraining') + id)
            .then(
                function (data) {
                    console.log(data)
                    $scope.detailsLoading = false
                    $scope.selectedTraining = TeamLndService.buildTrainingDetails(data.data)
                },
                function (err) {
                    $scope.detailsLoading = false
                }
            )
        //$scope.selectedTraining=
        $scope.openModal('lndDetailsTeam', 'lnd-details-team.tmpl.html', 'lg')

    }

    $scope.toggleSelected = function (selected, team_member) {

        if (team_member.status == 0) {
            if (selected.indexOf(team_member._id) !== -1) {
                removeFromSelected(selected, team_member)
            }
            else {
                addToSelected(selected, team_member)
            }
        }
    }

    $scope.getFilteredList = function (list, searchMode, searchValue) {
        return list.filter(function (member) {
            return member[searchMode].toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
        })
    }

    var addToSelected = function (selected, team_member) {
        selected.push(team_member._id)
    }

    var removeFromSelected = function (selected, team_member) {
        var member_index = selected.indexOf(team_member._id)
        selected.splice(member_index, 1)
    }

    self.isNominated = function (nominated, team_member) {
        var nominatedIds = nominated.map(function (member) {
            return member._id
        })

        return nominatedIds.indexOf(team_member._id) !== -1
    }

    self.isSelected = function (nominated, selected, team_member) {




        return selected.indexOf(team_member._id) !== -1 || team_member.status !== 0
    }

    var getTraining = function (trainings, typeId) {
        return trainings.filter(function (training) {
            return training._id === typeId
        })[0]
    }

    $scope.makeNominationRequest = function () {
        var nominationPayload = TeamLndService.buildNominateRequestPayload(self.nominateModal)
        ServerUtilityService.postWebService(TeamLndService.getUrl('makeNominationRequest'), nominationPayload)
            .then(
                function (response) {
                    response.data.status == 'error' ? errorCallback(response.data) : successCallback(response.data)
                    //Update the list of available nominees after making the request for a specific training_type_id
                    var trainingTypeId = response.data.data.training_type_id

                    $scope.nominateTeam(getTraining($scope.trainings, trainingTypeId), null, null, false)
                    // $scope.closeModal('nominateLndTeam')
                }
            )
    }

    // var SuccessErrorCallback=function (data) {

    // }

    $scope.createFilterForChips = function (query) {
        return function filterFn(item) {
            return (item.full_name.toLowerCase().indexOf(query.toLowerCase()) != -1);
        };
    }

    $scope.convertTimeStamp = function (stamp) {
        return {
            date: utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A").split(' ')[0],
            time: utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A").split(' ')[1] + ' ' + utilityService.timeStampToDateAndTime(stamp, "DD-MMM-YYYY hh:mm A").split(' ')[2]
        };
    }

    self.querySearchChips = function (criteria, allList) {
        return criteria ? allList.filter($scope.createFilterForChips(criteria)) : [];
    }

    $scope.handleAdditionalAttribute = function (value, type) {
        switch (type) {
            case 5: return getAdditionalDate(value)
            case 6: return getAdditionalTime(value)
            default: return value
        }
    }

    var getAdditionalDate = function (date) {
        var vals = date.split('/').reverse().join('-')
        var timestamp = new Date(vals).getTime()
        return $scope.convertTimeStamp(timestamp).date
    }

    var getAdditionalTime = function (time) {
        return moment(time, 'HH:mm').format('hh:mm a')
    }

    $scope.isClickable = function (type) {
        return type == 8 //type==9
    }




}])