app.service('ServerUtilityService', [
    '$http', 'Upload', 'utilityService',
    function ($http, Upload, utilityService) {
        'use strict';
        var self = this,
            browser = utilityService.getBrowser();

        this.getStorageKey = function (key) {
            return angular.isDefined(localStorage.getItem(key))
                    ? localStorage.getItem(key) : null;
        };
        this.isUnauthorizedStatus = function(error) {
            return error.status === 401;
        };
        this.generateRefreshToken = function() {
            this.postWebService('refresh-token', {}).then(function(data){
                console.log(data);
            });
        };
        /* Use this method if u want to perform get operation either all or specific */
        /*'Cache-Control': 'no-cache, must-revalidate'*/
        this.getWebService = function (url, params, auth) {
            params = angular.isDefined(params) ? params : {};
            var req = {
                method: 'GET',
                url: url,
                withCredentials: true,
                headers: {
                    'Authorization': "Bearer " + (auth ? auth : this.getStorageKey('accessToken')),
                    'device': 'website',
                    'browserName': browser.name,
                    'browserVersion': browser.version
                },
                params: params
            };

            return $http(req).then(function (response) {
                return response.data
            }, function (error) {
                return error
            });
        };
        /* Use this method if u want to do complete insertion */
        this.postWebService = function (url, input) {            
            var req = {
                method: 'POST',
                url: url,
                withCredentials: true,
                headers: {
                    'Authorization': "Bearer " + this.getStorageKey('accessToken'),
                    'device': 'website',
                    'browserName': browser.name,
                    'browserVersion': browser.version
                },
                data: input
            };

            return $http(req).then(function (response) {
                return response.data
            }, function (error) {
                return error
            });
        };
        /* Use this method if u want to do complete updation */
        this.putWebService = function (url, input) {
            var req = {
                method: 'PUT',
                url: url,
                withCredentials: true,
                headers: {
                    'Authorization': "Bearer " + this.getStorageKey('accessToken'),
                    'device': 'website',
                    'browserName': browser.name,
                    'browserVersion': browser.version
                },
                data: input
            };

            return $http(req).then(function (response) {
                return response.data
            }, function (error) {
                return error
            });
        };
        /* Use this method if u want to perform delete operation */
        this.deleteWebService = function (url) {
            var req = {
                method: 'DELETE',
                url: url,
                withCredentials: true,
                headers: {
                    'Authorization': "Bearer " + this.getStorageKey('accessToken'),
                    'device': 'website',
                    'browserName': browser.name,
                    'browserVersion': browser.version
                }
            };

            return $http(req).then(function (response) {
                return response.data
            }, function (error) {
                return error
            });
        };
        this.deleteTask = function (url, input) {
            var req = {
                method: 'DELETE',
                url: url,
                withCredentials: true,
                headers: {
                    'Authorization': "Bearer " + this.getStorageKey('accessToken'),
                    'device': 'website',
                    'browserName': browser.name,
                    'browserVersion': browser.version
                },
                data: input
            };

            return $http(req).then(function (response) {
                return response.data
            }, function (error) {
                return error
            });
        };
        /* Use this method if u want to do partial update */
        this.patchWebService = function (url, input) {
            var req = {
                method: 'PATCH',
                url: url,
                withCredentials: true,
                headers: {
                    'Authorization': "Bearer " + this.getStorageKey('accessToken'),
                    'device': 'website',
                    'browserName': browser.name,
                    'browserVersion': browser.version
                },
                data: input
            };

            return $http(req).then(function (response) {
                return response.data
            }, function (error) {
                return error
            });
        };
        // Use this method if u want to upload any file/document //
        this.uploadWebService = function (url, input, method) {
            method = angular.isDefined(method) ? method : "POST";
            var req = {
                url: url,
                withCredentials: true,
                method: method,
                headers: {
                    'Authorization': "Bearer " + this.getStorageKey('accessToken'),
                    'device': 'website',
                    'browserName': browser.name,
                    'browserVersion': browser.version
                },
                data: input,
            };

            return Upload.upload(req).then(function (response) {
                return response.data
            }, function (error) {
                return error
            });
        };
        return this;
    }
]);