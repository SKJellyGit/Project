app.service('signatureService', [
    'utilityService',
    function (utilityService) {
        'use strict';
        
        this.url = {
            upload : 'signature/settings',
            getAPISignaturesShort : 'signature/image/short',
            getAPISignaturesLong : 'signature/image/full',
            saveFont : 'signature/settings-font'
        };
        this.getUrl = function(apiUrl) {
            return getAPIPath() + this.url[apiUrl];
        };
        this.buildFontObject = function(){
            return{
                1 : {
                    name: 'Admiration_Pains.ttf',
                    longUrl: this.url.getAPISignaturesLong + "/" + 'Admiration_Pains.ttf'+'?access_token=' + utilityService.getStorageValue('accessToken'),
                    shortUrl : this.url.getAPISignaturesShort + "/" + 'Admiration_Pains.ttf'+'?access_token='  + utilityService.getStorageValue('accessToken')
                },
                2 : {
                    name: 'BillionStars_PersonalUse.ttf',
                    longUrl: this.url.getAPISignaturesLong + "/" + 'BillionStars_PersonalUse.ttf'+'?access_token=' + utilityService.getStorageValue('accessToken'),
                    shortUrl : this.url.getAPISignaturesShort + "/" + 'BillionStars_PersonalUse.ttf'+'?access_token='  + utilityService.getStorageValue('accessToken')
                },
                3 : {
                    name: 'Demo_ConeriaScript.ttf',
                    longUrl: this.url.getAPISignaturesLong + "/" + 'Demo_ConeriaScript.ttf'+ '?access_token=' + utilityService.getStorageValue('accessToken'),
                    shortUrl : this.url.getAPISignaturesShort + "/" + 'Demo_ConeriaScript.ttf'+'?access_token=' +utilityService.getStorageValue('accessToken')
                },
                4 : {
                    name: 'MindAntiks.ttf',
                    longUrl: this.url.getAPISignaturesLong + "/" + 'MindAntiks.ttf' + '?access_token=' + utilityService.getStorageValue('accessToken'),
                    shortUrl : this.url.getAPISignaturesShort + "/" + 'MindAntiks.ttf' + '?access_token=' + utilityService.getStorageValue('accessToken')
                }        
            }
        };
        
        return this;        
    }
]);