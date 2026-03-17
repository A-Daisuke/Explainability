        function resolveNamesWithLocalCache(_a) {
            var _b;
            var names = _a.names, containingFile = _a.containingFile, redirectedReference = _a.redirectedReference, cache = _a.cache, perDirectoryCacheWithRedirects = _a.perDirectoryCacheWithRedirects, loader = _a.loader, getResolutionWithResolvedFileName = _a.getResolutionWithResolvedFileName, shouldRetryResolution = _a.shouldRetryResolution, reusedNames = _a.reusedNames, logChanges = _a.logChanges;
            var path = resolutionHost.toPath(containingFile);
            var resolutionsInFile = cache.get(path) || cache.set(path, ts.createMap()).get(path);
            var dirPath = ts.getDirectoryPath(path);
            var perDirectoryCache = perDirectoryCacheWithRedirects.getOrCreateMapOfCacheRedirects(redirectedReference);
            var perDirectoryResolution = perDirectoryCache.get(dirPath);
            if (!perDirectoryResolution) {
                perDirectoryResolution = ts.createMap();
                perDirectoryCache.set(dirPath, perDirectoryResolution);
            }
            var resolvedModules = [];
            var compilerOptions = resolutionHost.getCompilationSettings();
            var hasInvalidatedNonRelativeUnresolvedImport = logChanges && isFileWithInvalidatedNonRelativeUnresolvedImports(path);
            // All the resolutions in this file are invalidated if this file wasnt resolved using same redirect
            var program = resolutionHost.getCurrentProgram();
            var oldRedirect = program && program.getResolvedProjectReferenceToRedirect(containingFile);
            var unmatchedRedirects = oldRedirect ?
                !redirectedReference || redirectedReference.sourceFile.path !== oldRedirect.sourceFile.path :
                !!redirectedReference;
            var seenNamesInFile = ts.createMap();
            for (var _i = 0, names_3 = names; _i < names_3.length; _i++) {
                var name = names_3[_i];
                var resolution = resolutionsInFile.get(name);
                // Resolution is valid if it is present and not invalidated
                if (!seenNamesInFile.has(name) &&
                    unmatchedRedirects || !resolution || resolution.isInvalidated ||
                    // If the name is unresolved import that was invalidated, recalculate
                    (hasInvalidatedNonRelativeUnresolvedImport && !ts.isExternalModuleNameRelative(name) && shouldRetryResolution(resolution))) {
                    var existingResolution = resolution;
                    var resolutionInDirectory = perDirectoryResolution.get(name);
                    if (resolutionInDirectory) {
                        resolution = resolutionInDirectory;
                    }
                    else {
                        resolution = loader(name, containingFile, compilerOptions, ((_b = resolutionHost.getCompilerHost) === null || _b === void 0 ? void 0 : _b.call(resolutionHost)) || resolutionHost, redirectedReference);
                        perDirectoryResolution.set(name, resolution);
                    }
                    resolutionsInFile.set(name, resolution);
                    watchFailedLookupLocationsOfExternalModuleResolutions(name, resolution, path, getResolutionWithResolvedFileName);
                    if (existingResolution) {
                        stopWatchFailedLookupLocationOfResolution(existingResolution, path, getResolutionWithResolvedFileName);
                    }
                    if (logChanges && filesWithChangedSetOfUnresolvedImports && !resolutionIsEqualTo(existingResolution, resolution)) {
                        filesWithChangedSetOfUnresolvedImports.push(path);
                        // reset log changes to avoid recording the same file multiple times
                        logChanges = false;
                    }
                }
                ts.Debug.assert(resolution !== undefined && !resolution.isInvalidated);
                seenNamesInFile.set(name, true);
                resolvedModules.push(getResolutionWithResolvedFileName(resolution));
            }
            // Stop watching and remove the unused name
            resolutionsInFile.forEach(function (resolution, name) {
                if (!seenNamesInFile.has(name) && !ts.contains(reusedNames, name)) {
                    stopWatchFailedLookupLocationOfResolution(resolution, path, getResolutionWithResolvedFileName);
                    resolutionsInFile.delete(name);
                }
            });
            return resolvedModules;
            function resolutionIsEqualTo(oldResolution, newResolution) {
                if (oldResolution === newResolution) {
                    return true;
                }
                if (!oldResolution || !newResolution) {
                    return false;
                }
                var oldResult = getResolutionWithResolvedFileName(oldResolution);
                var newResult = getResolutionWithResolvedFileName(newResolution);
                if (oldResult === newResult) {
                    return true;
                }
                if (!oldResult || !newResult) {
                    return false;
                }
                return oldResult.resolvedFileName === newResult.resolvedFileName;
            }
        }
