        function resolveModuleName(moduleName, containingFile, compilerOptions, host, redirectedReference) {
            var _a;
            var primaryResult = ts.resolveModuleName(moduleName, containingFile, compilerOptions, host, moduleResolutionCache, redirectedReference);
            // return result immediately only if global cache support is not enabled or if it is .ts, .tsx or .d.ts
            if (!resolutionHost.getGlobalCache) {
                return primaryResult;
            }
            // otherwise try to load typings from @types
            var globalCache = resolutionHost.getGlobalCache();
            if (globalCache !== undefined && !ts.isExternalModuleNameRelative(moduleName) && !(primaryResult.resolvedModule && ts.extensionIsTS(primaryResult.resolvedModule.extension))) {
                // create different collection of failed lookup locations for second pass
                // if it will fail and we've already found something during the first pass - we don't want to pollute its results
                var _b = ts.loadModuleFromGlobalCache(ts.Debug.checkDefined(resolutionHost.globalCacheResolutionModuleName)(moduleName), resolutionHost.projectName, compilerOptions, host, globalCache), resolvedModule = _b.resolvedModule, failedLookupLocations = _b.failedLookupLocations;
                if (resolvedModule) {
                    // Modify existing resolution so its saved in the directory cache as well
                    primaryResult.resolvedModule = resolvedModule;
                    (_a = primaryResult.failedLookupLocations).push.apply(_a, failedLookupLocations);
                    return primaryResult;
                }
            }
            // Default return the result from the first pass
            return primaryResult;
        }
