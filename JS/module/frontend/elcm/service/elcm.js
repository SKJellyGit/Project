app.service('ElcmAdminService', [
    'ServerUtilityService', 'utilityService',
    function (ServerUtilityService, utilityService) {
        'use strict';

        this.url = {
            summary: 'admin-frontend/employee/forms-documents',
            sendReminder: 'prejoin/frontend/send-reminder',
            newEmployee: 'user-addition/all-user?status=true',
            getAllForms: 'user-management/form?status=true',
            document: 'user-management/document?status=true',
            allUser : 'user-addition/users-preview',
            letters: 'admin-frontend/all-letters',
            assignFile: 'admin-frontend/employee/assign-forms-documents',
            assignLetters: 'admin-frontend/assign-letter',
            downloadLetter: 'emp-download-letter',
            letterCsv: 'admin-frontend/letter-csv',
            uploadCsv: 'admin-frontend/validate-letter-csv',
            assignLettreBulk: 'admin-frontend/assign-letter-csv',
            updateEmail: 'user-addition/update/profile-field',
            checkAssignedLetter: 'admin-frontend/elcm/check-letter-assigned',
            acknowledementReport: 'admin-frontend/elcm/acknowledgement-pending-report',
            emp_signing_authority: 'admin-frontend/elcm/signatory-of-employee',
            bulkSigningAuth: 'admin-frontend/elcm/signatory-of-template',
            driveCredentials: 'google-drive/check-credentials',
            uploadBulkDocs: 'admin-frontend/elcm/upload-bulk-docs',
            uploadBulkForm: 'admin-frontend/elcm/upload-bulk-forms',
            employeeListing: 'admin-frontend/elcm/document-form-status'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };        
        this.buildAssignModel = function () {
            return {
                selectedForm: [],
                selectedDoc: [],
                selectedLetter: {},
                selectedEmp:[],
                isAll: false,
            };
        };       
        this.buildAssignPayload = function (model, activeUsers) {
            var payload = {
                selected_form: model.selectedForm,
                selected_doc: model.selectedDoc,
                selected_letter: model.selectedLetter,
                selected_emp: []
            };
            if (model.isAll) {
                angular.forEach(activeUsers, function (v, k) {
                    var id  = angular.isObject(v._id) ? v._id.$id : v._id;
                    payload.selected_emp.push(id);
                });
            } else {
                angular.forEach(model.selectedEmp, function (v, k) {
                    payload.selected_emp.push(v.id);
                });
            }

            return payload;
        };       
        this.buildAssignLettersPayload = function (lettersList, model) {
            var payload = {
                letter_detail: []
            };
            angular.forEach(lettersList, function (v, k){
                var object ={};
                object.letter_id = v.letter_id;
                object.trigger_date = utilityService.dateToString(v.trigger_date);
                //object.due_days = parseInt(v.due_days);
                object.sign_authority = v.sign_authority;
                object.other_signatory = [];
                object.other_signatory.push(v.other_signatory1);
                object.other_signatory.push(v.other_signatory2);
                object.other_signatory.push(v.other_signatory3);
                console.log(object.other_signatory);
                payload.letter_detail.push(object);
            });

            return payload;
        };
        this.buildEmployeeTypeObject = function () {
            return {
                selected: 1,
                list: [
                    {
                        id: 1,
                        title: 'Active'
                    },
                    {
                        id: 2,
                        title: 'Relieved'
                    }
                ],
                email: null,
                isSet: false,
                empId: null
            };
        };
        this.buildCertificateList = function () {
            return [{
                autocompleteKey: "searchText0", 
                letter_id: null, 
                sign_authority: null,
                other_signatory: [],
                trigger_date: null, 
                due_days: null, 
                isViewed: false
            }];
        };
    }
]);
