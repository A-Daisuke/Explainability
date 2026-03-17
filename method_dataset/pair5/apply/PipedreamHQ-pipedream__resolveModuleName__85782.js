        function resolveModuleName(moduleName, containingFile, compilerOptions, host, redirectedReference) {
            var _a;
            var primaryResult = ts.resolveModuleName(moduleName, containingFile, compilerOptions, host, moduleResolutionCache, redirectedReference);
            if (!resolutionHost.getGlobalCache) {
                return primaryResult;
            }
            var globalCache = resolutionHost.getGlobalCache();
            if (globalCache !== undefined && !ts.isExternalModuleNameRelative(moduleName) && !(primaryResult.resolvedModule && ts.extensionIsTS(primaryResult.resolvedModule.extension))) {
                var _b = ts.loadModuleFromGlobalCache(ts.Debug.checkDefined(resolutionHost.globalCacheResolutionModuleName)(moduleName), resolutionHost.projectName, compilerOptions, host, globalCache), resolvedModule = _b.resolvedModule, failedLookupLocations = _b.failedLookupLocations;
                if (resolvedModule) {
                    primaryResult.resolvedModule = resolvedModule;
                    (_a = primaryResult.failedLookupLocations).push.apply(_a, failedLookupLocations);
                    return primaryResult;
                }
            }
            return primaryResult;
        }
