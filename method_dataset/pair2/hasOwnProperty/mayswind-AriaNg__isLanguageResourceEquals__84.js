        var isLanguageResourceEquals = function (langObj1, langObj2) {
            if (!angular.isObject(langObj1) || !angular.isObject(langObj2)) {
                return false;
            }

            for (var key in langObj2) {
                if (!langObj2.hasOwnProperty(key)) {
                    continue;
                }

                var value = langObj2[key];

                if (angular.isObject(value)) {
                    var result = isLanguageResourceEquals(langObj1[key], value);
                    if (!result) {
                        return false;
                    }
                } else {
                    if (value !== langObj1[key]) {
                        return false;
                    }
                }
            }

            return true;
        };
