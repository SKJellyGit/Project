app.service('QandleClientService', ['utilityService',
    function (utilityService) {
        'use strict';

        this.url = {
            qandleClients: 'qandle/clients',
            notifyTextUrl: 'qandle/get-default-message'
        };
        this.getUrl = function (apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };

        this.buildQandleClientModel = function() {
            return {
                list: [],
	    		model: this.buildQandleCompanyModel(),
                visible: false
            }
        }

        this.buildReferenceList = function() {
            return [
                { "id": 1, "text": "Last Inovice Raised", "value": "{{model.last_inovice_raised}}"},
                { "id": 2, "text": "Paid Till", "value": "{{model.paid_till}}"},
                { "id": 3, "text": "Payment due date", "value": "{{model.payment_due_date}}"},
                { "id": 4, "text": "Last paid on", "value": "{{model.last_paid_on}}"},
                { "id": 5, "text": "invoice shared on", "value": "{{model.invoice_shared_on}}"},
                { "id": 6, "text": "block from", "value": "{{model.block_on}}"}
            ]
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
                setup: function (editor) {
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
                },
                pagebreak_separator: "<!-- my page break -->",
                pagebreak_split_block: true,
                force_br_newlines : true,
                force_p_newlines : false,
                forced_root_block : '' // Needed for 3.x
            };
        };
        this.buildQandleCompanyModel = function (model) {
            var objectHrCompany = {}
            if(model != null && model._id != null) {
                objectHrCompany._id = utilityService.getValue(model, '_id');
            }
            objectHrCompany.name = utilityService.getValue(model, 'name');
            objectHrCompany.url = utilityService.getValue(model, 'url');
            objectHrCompany.notify_email = utilityService.getValue(model, 'notify_email');
            objectHrCompany.notify = utilityService.getValue(model, 'notify',false);
            objectHrCompany.notify_text = utilityService.getValue(model, 'notify_text');
            objectHrCompany.notify_from = (utilityService.getValue(model, 'notify_from') != null) ? utilityService.convertUnixTimeStampToDateFormat(utilityService.getValue(model, 'notify_from')): null;
            objectHrCompany.block = utilityService.getValue(model, 'block', false);
            objectHrCompany.block_on = (utilityService.getValue(model, 'block_on') != null) ? utilityService.convertUnixTimeStampToDateFormat(utilityService.getValue(model, 'block_on')): null;
            objectHrCompany.last_paid_on = (utilityService.getValue(model, 'last_paid_on') != null) ? utilityService.convertUnixTimeStampToDateFormat(utilityService.getValue(model, 'last_paid_on')): null;
            objectHrCompany.last_inovice_raised = (utilityService.getValue(model, 'last_inovice_raised') != null) ? utilityService.convertUnixTimeStampToDateFormat(utilityService.getValue(model, 'last_inovice_raised')): null;
            objectHrCompany.paid_till = (utilityService.getValue(model, 'paid_till') != null) ? utilityService.convertUnixTimeStampToDateFormat(utilityService.getValue(model, 'paid_till')): null;
            objectHrCompany.invoice_shared_on = (utilityService.getValue(model, 'invoice_shared_on') != null) ? utilityService.convertUnixTimeStampToDateFormat(utilityService.getValue(model, 'invoice_shared_on')): null;
            objectHrCompany.payment_due_date = (utilityService.getValue(model, 'payment_due_date') != null) ? utilityService.convertUnixTimeStampToDateFormat(utilityService.getValue(model, 'payment_due_date')): null;
            return objectHrCompany;
        };

        this.buildCompanyFilter = function() {
            return [
                {
                    Id : 1,
                    Name : "Last Invoice Raised",
                    Key : "last_inovice_raised",
                },
                {
                    Id : 2,
                    Name : "Paid Till",
                    Key : "paid_till",
                },
                {
                    Id : 3,
                    Name : "Payment Due Date",
                    Key : "payment_due_date",
                },
                {
                    Id : 4,
                    Name : "Last Paid On",
                    Key : "last_paid_on",
                },
                {
                    Id : 5,
                    Name : "Invoice Shared On",
                    Key : "invoice_shared_on",
                },
                {
                    Id : 6,
                    Name : "Block On",
                    Key : "block_on",
                },
                {
                    Id : 7,
                    Name : "Notify From",
                    Key : "notify_from",
                }
            
            ]
        }

        this.buildCompanyFilterType = function() {
            return [
                {
                    Id : 1,
                    Name : "All",
                    Key : "all",
                },
                {
                    Id : 2,
                    Name : "Block",
                    Key : "block",
                },
                {
                    Id : 3,
                    Name : "Notify",
                    Key : "notify",
                }
            ]
        }
    }

]);
