    function getExtendedConfig(sourceFile, extendedConfigPath, host, basePath, resolutionStack, errors, extendedConfigCache) {
        var _a;
        var path = host.useCaseSensitiveFileNames ? extendedConfigPath : ts.toFileNameLowerCase(extendedConfigPath);
        var value;
        var extendedResult;
        var extendedConfig;
        if (extendedConfigCache && (value = extendedConfigCache.get(path))) {
            (extendedResult = value.extendedResult, extendedConfig = value.extendedConfig);
        }
        else {
            extendedResult = readJsonConfigFile(extendedConfigPath, function (path) { return host.readFile(path); });
            if (!extendedResult.parseDiagnostics.length) {
                var extendedDirname = ts.getDirectoryPath(extendedConfigPath);
                extendedConfig = parseConfig(/*json*/ undefined, extendedResult, host, extendedDirname, ts.getBaseFileName(extendedConfigPath), resolutionStack, errors, extendedConfigCache);
                if (isSuccessfulParsedTsconfig(extendedConfig)) {
                    // Update the paths to reflect base path
                    var relativeDifference_1 = ts.convertToRelativePath(extendedDirname, basePath, ts.identity);
                    var updatePath_1 = function (path) { return ts.isRootedDiskPath(path) ? path : ts.combinePaths(relativeDifference_1, path); };
                    var mapPropertiesInRawIfNotUndefined = function (propertyName) {
                        if (raw_2[propertyName]) {
                            raw_2[propertyName] = ts.map(raw_2[propertyName], updatePath_1);
                        }
                    };
                    var raw_2 = extendedConfig.raw;
                    mapPropertiesInRawIfNotUndefined("include");
                    mapPropertiesInRawIfNotUndefined("exclude");
                    mapPropertiesInRawIfNotUndefined("files");
                }
            }
            if (extendedConfigCache) {
                extendedConfigCache.set(path, { extendedResult: extendedResult, extendedConfig: extendedConfig });
            }
        }
        if (sourceFile) {
            sourceFile.extendedSourceFiles = [extendedResult.fileName];
            if (extendedResult.extendedSourceFiles) {
                (_a = sourceFile.extendedSourceFiles).push.apply(_a, extendedResult.extendedSourceFiles);
            }
        }
        if (extendedResult.parseDiagnostics.length) {
            errors.push.apply(errors, extendedResult.parseDiagnostics);
            return undefined;
        }
        return extendedConfig;
    }
