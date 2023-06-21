app.service('AdminOnGridService', ['utilityService', '$filter',
    function (utilityService, $filter) {
        'use strict';

        this.url = {
            list: 'ongrid/admin/employees-verification', 
            //'data/on-grid/adminshowempwitherrors.json',
            // verification.json
            types: 'ongrid/verificationtypes',
            downloadOngridReport : 'ongrid/admin/report',
            verificationRequest : 'ongrid/admin/re-request'


        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildVerificationObject = function () {
            return {
                list: [],
                filteredList: [],
                visible: false,
                property: '',
                reverse: false
            };
        };
        this.buildOnGridObject = function () {
            return  {
                verification: this.buildVerificationObject(),
                master: {
                    verifications: {},
                    documents: {
                        1: {
                            name: 'ID Proof',
                            slug: 'id_proof',
                            icon: 'touch_app'
                        },
                        2: {
                            name: 'Address Documents',
                            slug: 'address_documents',
                            icon: 'home'
                        },
                        3: {
                            name: 'Financial Documents',
                            slug: 'finamcial_documents',
                            icon: 'local_atm'
                        },
                        4: {
                            name: 'Educational Documents',
                            slug: 'educational_documents',
                            icon: 'school'
                        },
                        5: {
                            name: 'Employement Documents',
                            slug: 'employement_documents',
                            icon: 'business_center'
                        }
                    }                  
                },
                mapping: {                    
                    1: {
                        className: 'NOT_REQUESTED',
                        statusTitle: 'Request Initialized'
                    },
                    2: {
                        className: 'NOT_REQUESTED',
                        statusTitle: 'Request Called'
                    },
                    3: {
                        className: 'IN_PROGRESS',
                        statusTitle: 'Request Pending'
                    },
                    4: {
                        className: 'SUCCESS',
                        statusTitle: 'Request Success'
                    },
                    5: {
                        className: 'FAILED',
                        statusTitle: 'Request Failed'
                    },
                    6: {
                        className: 'CLOSED',
                        statusTitle: 'Request Closed'
                    }                                     
                },
                errors: []
            };
        };
        this.buildHeaderColumns = function (verifications, documents) {
            var columns = ["Employee Name", "Employee Code", "Errors", "Mobile", "Overall Status"];

            angular.forEach(verifications, function (value, key) {
                columns.push('Verification Status: ' + value.name); 
            });

            angular.forEach(documents, function (value, key) {
                columns.push('Document Status: ' + value.name); 
            });

            return columns;
        };  

        this.verificationStatus = function(data) {
            
        }

        this.buildEmployeeVerificationCsvData = function(ongrid) {
            var verifications = utilityService.getInnerValue(ongrid, 'master', 'verifications', []);
            var documents = utilityService.getInnerValue(ongrid, 'master', 'documents', []);
            var headers = new Array(this.buildHeaderColumns(verifications, documents));
            var mapping = ongrid.mapping;
            var object = {
                list: utilityService.getInnerValue(ongrid, 'verification', 'filteredList', []),
                content: headers
            };

            angular.forEach(object.list, function(value, key) {
                var array = new Array();

                array.push(utilityService.getValue(value, 'full_name'));
                array.push(utilityService.getValue(value, 'employee_code'));
                
                var errorMessage = '';
                if (utilityService.getValue(value, 'errors', []).length) {                    
                    angular.forEach(value.errors, function (v, k) {
                        errorMessage+=v.message;
                        var timestamp = utilityService.getValue(v, 'date');
                        if (timestamp) {
                            errorMessage+='Date-' + ($filter('date')(new Date(parseInt(timestamp, 10) * 1000), 'dd-MMM-yy'))
                        }
                        if (k < value.errors.length -1)
                            errorMessage+=', ';
                    });
                } 
                
                array.push(errorMessage);
                
                //array.push(utilityService.getValue(value, 'address', 'N/A'));
                array.push(utilityService.getValue(value, 'mobile'));

                var dataverify = [];
                angular.forEach(value.verification_data, function(v, k) {
                    dataverify.push(v.status);
                });
                if(dataverify.indexOf(7) > -1) {
                    array.push("Insufficient Detail");
                } else if(dataverify.indexOf(3) > -1) {
                    array.push("Pending");
                } else if(dataverify.indexOf(5) > -1) {
                    array.push("Failed");
                } else if(dataverify.indexOf(4) > -1 ) {
                    array.push("Success");
                } else if(dataverify.indexOf(6) > -1 ) {
                    array.push("Any other Pending");
                } else {
                    array.push("Error");
                }              
                angular.forEach(verifications, function (v, k) {
                    array.push(utilityService.getInnerValue(mapping, utilityService.getInnerValue(utilityService.getValue(value, 'verification_data'), k, 'status'), 'statusTitle'));
                });

                angular.forEach(documents, function (v, k) {
                    if (utilityService.getInnerValue(utilityService.getValue(value, 'document_data'), k, 'status')) {
                        array.push(utilityService.getValue(v, 'name') + ': ADDED');
                    } else {
                        array.push('');
                    }
                });
                
                object.content.push(array);
            });

            return object;
        };

        
        this.changeArrayToObject = function (list) {
            var object = {};

            angular.forEach(list, function(value, key) {
                object[value._id] = {};
                object[value._id].name = value.name;
                object[value._id].slug = value.icon;
                object[value._id].svg_icon = 'images/svg/verifications/' + value.icon + '.svg';
            });

            return object;
        };
    }
]);