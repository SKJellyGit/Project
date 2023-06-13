
app.service('templateBuilderService', [
	'utilityService', '$sce', '$location' , 'TEMPLATE_BUILDER',      
	function (utilityService, $sce, $location, TEMPLATE_BUILDER) {
		'use strict';

	    this.url = {	    	
	    	certificate: 'certificate/template',
	    	fndf: 'fnf/template',
	    	noDues: 'no-dues/template',
            candidate: 'data/candidate.json',
            profileFields: 'user-management/public-field',
            reference: 'reference/keys',
            segment: 'user-management/segment',
            bulkReference: 'reference/keys/bulk',
            references: 'data/references.json',
            letter: 'letter/type/template',
            recruitmentRef: 'recruitment/job-requisition-fields',
            recruitmentGroupRef: 'recruitment/job-requisition-mandatory-group',
            recruitmentAppFileds: 'recruitment-frontend/default-application-profile-fields',
//            selectedReference : 'prejoin/frontend/template/candidate',
            updateReferenceListFrontend : 'prejoin/frontend/offer-letter-template-html',
            payrollComponent : 'certificate/reference/payroll-compensation-heads',
            allmandatorygroup: 'user-management/active/group?mandatory=true&field=true',
            sendOffer: 'prejoin/frontend/send-offer-with-sign',
            revokeOffer: 'prejoin/frontend/send-revoke-with-sign',
            noduesRef: 'provisions/activelist',
            exitCertificate: 'user-exit/certificate-detail',
//            exitCertificateRef: 'user-exit/reference-detail',
            exitCertificateRef: 'user-exit/reference-detail-doc',
            saveExitCer: 'user-exit/certificate-detail',
            downloadTemplate: 'certificate/template/download',
            selectedReference : 'admin-frontend/reference-detail',
            elcm: 'admin-frontend/letter-detail',
            elcmTrigger: 'admin-frontend/update-letter-reference',
            //fullSignature: 'signature/sign-image/full',
            fullSignature: 'download/signature-url/full',
            shortSignature: 'download/signature-url/short',
            getExitCerPdf: 'user-exit/exit-certificate-pdf',
            getLetter: 'admin-frontend/letter-pdf',
            getCertificate:'LND-admin/trainingCertificate-pdf',
            triggerCertificate: 'user-exit/trigger-certificate',
            triggerLetter: 'admin-frontend/letter-trigger',
            triggerLndCertificate:'LND-admin/certificate-trigger',
            recruitmentRefUrl: 'recruitment-frontend/offer-letter-reference',
            recruitmentTempUrl: 'recruitment-frontend/offer-letter-detail',
            assignRecruitmentLetter: 'recruitment-frontend/save-offer-letter',
            removeRecruitmentLetter: 'recruitment-frontend/remove-offer-letter',
            elcmDeleteLetter: 'admin-frontend/employee/remove-letter',
            offerToSign: 'recruitment-frontend/offer-letter-pdf',
            signOffer: 'recruitment-frontend/trigger-offer-letter',
            recruitmentOfferLetter: 'recruitment-frontend/upload-offer-letter',
            lndCertificateRef:"LND-admin/certificate-letter-reference",
            lndCertificateDetail:"LND-admin/certificate-letter-detail",
            assignLndCertificate:"LND-admin/save-certificate-letter",
            removeLndCertificate:"LND-admin/remove-certificate-letter",
            driveCredentails:"google-drive/check-credentials"
	    };
	    this.getUrl = function(apiUrl) {
	    	return getAPIPath() + this.url[apiUrl];
	    };	
        this.buildEditorObject = function() {
            return {
                isVisible: false,
                template: null
            }
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
                    "textcolor"
                ],
                toolbar: 'insertfile undo redo | styleselect | bold italic | fontselect | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | snippet | pagebreak',
                skin: 'lightgray',
                mode: "textareas",
                theme: "modern",
                snippet_list: this.buildReferenceList(),
                menubar: 'file edit insert view format table tools',
                paste_data_images: true,
                automatic_uploads: true,
                relative_urls: false,
                remove_script_host: false,
                document_base_url: $location.absUrl(),
                //font_formats: 'Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n',
//                fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt',
                height: 842,
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
	    this.buildTemplateContentModel = function(model, item, templateType) {
			return {
	    		_id: utilityService.getValue(model, '_id'),
	    		title: utilityService.getValue(model, 'title'),
	    		owner_detail: utilityService.getValue(model, 'owner_detail'),
                modify_by_detail: utilityService.getValue(model, 'modify_by_detail'),
                updated_at: utilityService.getValue(model, 'updated_at'),
                created_at: utilityService.getValue(model, 'created_at'),
	    		template_type: utilityService.getValue(model, 'template_type', templateType),
	    		certificate_id: utilityService.getValue(item, '_id'),
	    		body: utilityService.getValue(model, 'body'),
                        fileName:utilityService.getValue(model, 'filename')
	    	}
	    };

        this.onlyUnique = function (value, index, self) { 
            return self.indexOf(value) === index;
        }
	    this.buildTemplateContentPayload = function(model,ids,payrollIds, NoduesRefereceIds) {
	    	var payload = {
	    		body: model.body,
                reference_list : ids.filter(function(item, i, ar){ return ar.indexOf(item) === i; }),
                reference_list_payroll : payrollIds.filter(function(item, i, ar){ return ar.indexOf(item) === i; }),
	    	};
                payload.reference_list_no_dues = this.extractNoduesReference(NoduesRefereceIds);
                return payload;
	    };
            
          this.extractNoduesReference = function (NoduesRefereceIds) {
            var obj = [];
            if (NoduesRefereceIds.length) {
                angular.forEach(NoduesRefereceIds, function (v, k) {
                    if (obj.length) {
                        var count = 0;
                        angular.forEach(obj, function (val, key) {
                            if (v.provision_type_id == val.provision_type_id && v.type == val.type) {
                                count += 1;
                            }
                        });
                        if (count == 0) {
                            obj.push(v);
                        }
                    } else {
                        obj.push(v);
                    }
                });
            }
            return obj;
        };
        this.buildReferenceModel = function(module, tmplConstant) {
            return {
                module_key: module.module,
                template_type: tmplConstant.type,
                text: null,
                is_profile: false
            };
        };
        this.buildReferencePayload = function(model, certificate_id, tempType) {
            certificate_id = angular.isDefined(certificate_id) ? certificate_id : null;
            var payload = {
                module_key: model.module_key,
                template_type: tempType.template_type,
                text: model.text,
                value: "{{model." + model.text.replace(/ /g,"_") + "}}",
                is_profile: model.is_profile
            };
            if(certificate_id) {
                payload.certificate_id = certificate_id;
            }
            return payload;
        };
        this.buildRowObject = function() {
            return {
                selectedIndex: -1
            }
        };
        this.buildTemplateTitlePayload = function(model) {
            return {
                title: model.title
            }
        };
        this.buildTitleObject = function() {
            return {
                isVisible: false
            };
        };     
        this.buildFieldTypeHashMap = function() {
	    	return {
            	1: "Short Text",
            	2: "Long Text", 
            	3: "Number", 
            	4: "Alphanumeric", 
            	5: "Date", 
            	6: "Time",
             	7: "Currency", 
             	8: "URL", 
             	9: "Email", 
             	10: "Multiple Choice", 
             	11: "Checkbox", 
             	12: "Dropdown", 
             	13: "Relationship", 
             	14: "Fieldset"
            };
	    };
	}
]);