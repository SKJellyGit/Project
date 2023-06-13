app.service('communicationService', [
    'utilityService', '$sce', 'ServerUtilityService',
    function (utilityService, $sce, serverUtilityService) {
        'use strict';
        var self = this;
        this.url = {
            getCommunication: 'communication/settings',
            saveNotification: 'communication/settings',
            notificationStatus: 'communication/settings/site-notification',
            emailStatus: 'communication/settings/email-notification',
            getCommunicationNotification: 'communication/settings/individual',
            getReference: 'communication/reference-keys',
            imgTinymce: 'tinymce/uploadImage',
            relationship: 'user-management/active/profile-field'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };        
        this.htmlToPlaintext = function (text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : null;
        };        
        this.buildReferenceObject = function (obj) {
            var list = [];

            angular.forEach(obj,function(v,k){
                var object = {};
                object.id = v.id;
                object.text = v.text;
                object.value = v.value;
                list.push(object);
            });

            return list;
        };
        this.buildFinalReferenceList = function (data){
            var arr = [];

            angular.forEach(data, function (v, k){
                var obj = {text:null, value: null};
                obj.text = v;
                obj.value = k;
                arr.push(obj);
            });

            return arr;
        };
        this.buildReferenceList = function() {
            return [
                { "id": 1, "text": "First Name", "value": "{{model.first_name}}"},
                { "id": 11, "text": "Last Name", "value": "{{model.last_name}}"}]
        };
        this.buildTinyMceOptionsObject = function () {
            return {
                onChange: function (e) {
                    // put logic here for keypress and cut/paste changes
                },
                inline: false,
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "paste",
                    "template",
                    "pagebreak",
                    "table",
                    "textcolor",
                    "media"
                ],
                toolbar: 'insertfile undo redo | styleselect | bold italic | fontselect | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | snippet | pagebreak | media',
                media_live_embeds: true,
                skin: 'lightgray',
                mode: "textareas",
                theme: "modern",
                snippet_list: this.buildReferenceList(),
                menubar: 'file edit insert view format table tools',
                paste_data_images: true,
                automatic_uploads: true,
                relative_urls : false,
                remove_script_host : false,
                convert_urls : true,
                images_upload_credentials: true,
                images_upload_handler: function (blobInfo, success, failure) {
                    var payload = {
                        file: blobInfo.blob()
                    };
                    serverUtilityService.uploadWebService(self.getUrl('imgTinymce'), payload)
                            .then(function (data){
                                if(data.status == 'success') {
                                    success(data.location);
                                } else {
                                    failure('Something went wrong.');
                                }
                            });
                },
                // font_formats: 'Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n',
                // fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt',
                height: 300,
                table_default_styles: {
                    width: '50%'
                },
                templates: [
                    {
                        title: "Letter Head",
                        url: "data/letterhead.html",
                        description: "Add Letter Head to the Document"
                    },
                    {
                        title: "Header Details",
                        url: "data/header.html",
                        description: "Add Header to the Document"
                    },
                    {
                        title: "Footer Details",
                        url: "data/footer.html",
                        description: "Add Footer to the Document"
                    }],
                /* setup: function (editor) {
                    editor.addButton('snippet', {
                        type: 'listbox',
                        text: 'Reference List',
                        title:'Reference List',
                        icon: false,
                        onselect: function (e) {
                            editor.insertContent(this.value());
                            this.value(null);
                        },
                        values: editor.getParam('snippet_list')
                    });
                }, */
                pagebreak_separator: "<!-- my page break -->",
                pagebreak_split_block: true,
                force_br_newlines : true,
                force_p_newlines : false,
                forced_root_block : '' // Needed for 3.x
            };
        };
        this.buildAllowedSlugMappingObject = function () {
            return {
                leave_plan: ['leave_application_employee', 'leave_auto_approved_admin_applied', 
                    'leave_final_approval', 'leave_auto_approved', 'notify_employee_leave_cancel'],
                time_attendance: ['leave_rejected_after_payroll_lock_day', 
                    'leave_approved_after_payroll_lock_day', 'regularization_rejected_after_payroll_lock_day', 
                    'regularization_approved_after_payroll_lock_day', 'attendance_report_weekly',
                    'regularize_auto_clockout', 'employee_missed_punch', 'no_show_notification',
                    'regularized_no_show_notification', 'policy_leave_deduction_notification'],
                prejoining: ['login_employee_credential', 'document_submission_notification', 'document_rejection_notification', 'document_missing', 'pending_document_reminder'],
                user_management: ['probation_reminder_to_manager', 'login_user_credential'],
                performance: ['manager_reviewer_notification', 'manager_reviewer_feedback_given', 'other_relationship_reviewer_feedback_given']
            }
        };     
    }
]);