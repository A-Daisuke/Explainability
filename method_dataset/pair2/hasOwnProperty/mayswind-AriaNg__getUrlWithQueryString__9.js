        var getUrlWithQueryString = function (url, parameters) {
            if (!url || url.length < 1) {
                return url;
            }

            var queryString = '';

            for (var key in parameters) {
                if (!parameters.hasOwnProperty(key)) {
                    continue;
                }

                var value = parameters[key];

                if (value === null || angular.isUndefined(value)) {
                    continue;
                }

                if (queryString.length > 0) {
                    queryString += '&';
                }

                if (angular.isObject(value) || angular.isArray(value)) {
                    value = angular.toJson(value);
                    value = ariaNgCommonService.base64Encode(value);
                    value = encodeURIComponent(value);
                }

                queryString += key + '=' + value;
            }

            if (queryString.length < 1) {
                return url;
            }

            if (url.indexOf('?') < 0) {
                queryString = '?' + queryString;
            } else {
                queryString = '&' + queryString;
            }

            return url + queryString;
        };
