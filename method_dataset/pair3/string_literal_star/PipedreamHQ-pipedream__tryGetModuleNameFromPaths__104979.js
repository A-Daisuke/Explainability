        function tryGetModuleNameFromPaths(relativeToBaseUrlWithIndex, relativeToBaseUrl, paths) {
            for (var key in paths) {
                for (var _i = 0, _a = paths[key]; _i < _a.length; _i++) {
                    var patternText_1 = _a[_i];
                    var pattern = ts.removeFileExtension(ts.normalizePath(patternText_1));
                    var indexOfStar = pattern.indexOf("*");
                    if (indexOfStar !== -1) {
                        var prefix = pattern.substr(0, indexOfStar);
                        var suffix = pattern.substr(indexOfStar + 1);
                        if (relativeToBaseUrl.length >= prefix.length + suffix.length &&
                            ts.startsWith(relativeToBaseUrl, prefix) &&
                            ts.endsWith(relativeToBaseUrl, suffix) ||
                            !suffix && relativeToBaseUrl === ts.removeTrailingDirectorySeparator(prefix)) {
                            var matchedStar = relativeToBaseUrl.substr(prefix.length, relativeToBaseUrl.length - suffix.length);
                            return key.replace("*", matchedStar);
                        }
                    }
                    else if (pattern === relativeToBaseUrl || pattern === relativeToBaseUrlWithIndex) {
                        return key;
                    }
                }
            }
        }
