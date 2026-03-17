    function createProgram(rootNamesOrOptions, _options, _host, _oldProgram, _configFileParsingDiagnostics) {
        var _a;
        var createProgramOptions = ts.isArray(rootNamesOrOptions) ? createCreateProgramOptions(rootNamesOrOptions, _options, _host, _oldProgram, _configFileParsingDiagnostics) : rootNamesOrOptions;
        var rootNames = createProgramOptions.rootNames, options = createProgramOptions.options, configFileParsingDiagnostics = createProgramOptions.configFileParsingDiagnostics, projectReferences = createProgramOptions.projectReferences;
        var oldProgram = createProgramOptions.oldProgram;
        var processingDefaultLibFiles;
        var processingOtherFiles;
        var files;
        var symlinks;
        var commonSourceDirectory;
        var diagnosticsProducingTypeChecker;
        var noDiagnosticsTypeChecker;
        var classifiableNames;
        var ambientModuleNameToUnmodifiedFileName = ts.createMap();
        var refFileMap;
        var cachedBindAndCheckDiagnosticsForFile = {};
        var cachedDeclarationDiagnosticsForFile = {};
        var resolvedTypeReferenceDirectives = ts.createMap();
        var fileProcessingDiagnostics = ts.createDiagnosticCollection();
        var maxNodeModuleJsDepth = typeof options.maxNodeModuleJsDepth === "number" ? options.maxNodeModuleJsDepth : 0;
        var currentNodeModulesDepth = 0;
        var modulesWithElidedImports = ts.createMap();
        var sourceFilesFoundSearchingNodeModules = ts.createMap();
        ts.performance.mark("beforeProgram");
        var host = createProgramOptions.host || createCompilerHost(options);
        var configParsingHost = parseConfigHostFromCompilerHostLike(host);
        var skipDefaultLib = options.noLib;
        var getDefaultLibraryFileName = ts.memoize(function () { return host.getDefaultLibFileName(options); });
        var defaultLibraryPath = host.getDefaultLibLocation ? host.getDefaultLibLocation() : ts.getDirectoryPath(getDefaultLibraryFileName());
        var programDiagnostics = ts.createDiagnosticCollection();
        var currentDirectory = host.getCurrentDirectory();
        var supportedExtensions = ts.getSupportedExtensions(options);
        var supportedExtensionsWithJsonIfResolveJsonModule = ts.getSuppoertedExtensionsWithJsonIfResolveJsonModule(options, supportedExtensions);
        var hasEmitBlockingDiagnostics = ts.createMap();
        var _compilerOptionsObjectLiteralSyntax;
        var moduleResolutionCache;
        var actualResolveModuleNamesWorker;
        var hasInvalidatedResolution = host.hasInvalidatedResolution || ts.returnFalse;
        if (host.resolveModuleNames) {
            actualResolveModuleNamesWorker = function (moduleNames, containingFile, reusedNames, redirectedReference) { return host.resolveModuleNames(ts.Debug.checkEachDefined(moduleNames), containingFile, reusedNames, redirectedReference, options).map(function (resolved) {
                if (!resolved || resolved.extension !== undefined) {
                    return resolved;
                }
                var withExtension = ts.clone(resolved);
                withExtension.extension = ts.extensionFromPath(resolved.resolvedFileName);
                return withExtension;
            }); };
        }
        else {
            moduleResolutionCache = ts.createModuleResolutionCache(currentDirectory, function (x) { return host.getCanonicalFileName(x); }, options);
            var loader_1 = function (moduleName, containingFile, redirectedReference) { return ts.resolveModuleName(moduleName, containingFile, options, host, moduleResolutionCache, redirectedReference).resolvedModule; };
            actualResolveModuleNamesWorker = function (moduleNames, containingFile, _reusedNames, redirectedReference) { return loadWithLocalCache(ts.Debug.checkEachDefined(moduleNames), containingFile, redirectedReference, loader_1); };
        }
        var actualResolveTypeReferenceDirectiveNamesWorker;
        if (host.resolveTypeReferenceDirectives) {
            actualResolveTypeReferenceDirectiveNamesWorker = function (typeDirectiveNames, containingFile, redirectedReference) { return host.resolveTypeReferenceDirectives(ts.Debug.checkEachDefined(typeDirectiveNames), containingFile, redirectedReference, options); };
        }
        else {
            var loader_2 = function (typesRef, containingFile, redirectedReference) { return ts.resolveTypeReferenceDirective(typesRef, containingFile, options, host, redirectedReference).resolvedTypeReferenceDirective; };
            actualResolveTypeReferenceDirectiveNamesWorker = function (typeReferenceDirectiveNames, containingFile, redirectedReference) { return loadWithLocalCache(ts.Debug.checkEachDefined(typeReferenceDirectiveNames), containingFile, redirectedReference, loader_2); };
        }
        var packageIdToSourceFile = ts.createMap();
        var sourceFileToPackageName = ts.createMap();
        var redirectTargetsMap = ts.createMultiMap();
        var filesByName = ts.createMap();
        var missingFilePaths;
        var filesByNameIgnoreCase = host.useCaseSensitiveFileNames() ? ts.createMap() : undefined;
        var resolvedProjectReferences;
        var projectReferenceRedirects;
        var mapFromFileToProjectReferenceRedirects;
        var mapFromToProjectReferenceRedirectSource;
        var useSourceOfProjectReferenceRedirect = !!((_a = host.useSourceOfProjectReferenceRedirect) === null || _a === void 0 ? void 0 : _a.call(host)) &&
            !options.disableSourceOfProjectReferenceRedirect;
        var _b = updateHostForUseSourceOfProjectReferenceRedirect({
            compilerHost: host,
            useSourceOfProjectReferenceRedirect: useSourceOfProjectReferenceRedirect,
            toPath: toPath,
            getResolvedProjectReferences: getResolvedProjectReferences,
            getSourceOfProjectReferenceRedirect: getSourceOfProjectReferenceRedirect,
            forEachResolvedProjectReference: forEachResolvedProjectReference
        }), onProgramCreateComplete = _b.onProgramCreateComplete, fileExists = _b.fileExists;
        var shouldCreateNewSourceFile = shouldProgramCreateNewSourceFiles(oldProgram, options);
        var structuralIsReused;
        structuralIsReused = tryReuseStructureFromOldProgram();
        if (structuralIsReused !== 2) {
            processingDefaultLibFiles = [];
            processingOtherFiles = [];
            if (projectReferences) {
                if (!resolvedProjectReferences) {
                    resolvedProjectReferences = projectReferences.map(parseProjectReferenceConfigFile);
                }
                if (rootNames.length) {
                    for (var _i = 0, resolvedProjectReferences_1 = resolvedProjectReferences; _i < resolvedProjectReferences_1.length; _i++) {
                        var parsedRef = resolvedProjectReferences_1[_i];
                        if (!parsedRef)
                            continue;
                        var out = parsedRef.commandLine.options.outFile || parsedRef.commandLine.options.out;
                        if (useSourceOfProjectReferenceRedirect) {
                            if (out || ts.getEmitModuleKind(parsedRef.commandLine.options) === ts.ModuleKind.None) {
                                for (var _c = 0, _d = parsedRef.commandLine.fileNames; _c < _d.length; _c++) {
                                    var fileName = _d[_c];
                                    processSourceFile(fileName, false, false, undefined);
                                }
                            }
                        }
                        else {
                            if (out) {
                                processSourceFile(ts.changeExtension(out, ".d.ts"), false, false, undefined);
                            }
                            else if (ts.getEmitModuleKind(parsedRef.commandLine.options) === ts.ModuleKind.None) {
                                for (var _e = 0, _f = parsedRef.commandLine.fileNames; _e < _f.length; _e++) {
                                    var fileName = _f[_e];
                                    if (!ts.fileExtensionIs(fileName, ".d.ts") && !ts.fileExtensionIs(fileName, ".json")) {
                                        processSourceFile(ts.getOutputDeclarationFileName(fileName, parsedRef.commandLine, !host.useCaseSensitiveFileNames()), false, false, undefined);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            ts.forEach(rootNames, function (name) { return processRootFile(name, false, false); });
            var typeReferences = rootNames.length ? ts.getAutomaticTypeDirectiveNames(options, host) : ts.emptyArray;
            if (typeReferences.length) {
                var containingDirectory = options.configFilePath ? ts.getDirectoryPath(options.configFilePath) : host.getCurrentDirectory();
                var containingFilename = ts.combinePaths(containingDirectory, ts.inferredTypesContainingFile);
                var resolutions = resolveTypeReferenceDirectiveNamesWorker(typeReferences, containingFilename);
                for (var i = 0; i < typeReferences.length; i++) {
                    processTypeReferenceDirective(typeReferences[i], resolutions[i]);
                }
            }
            if (rootNames.length && !skipDefaultLib) {
                var defaultLibraryFileName = getDefaultLibraryFileName();
                if (!options.lib && defaultLibraryFileName) {
                    processRootFile(defaultLibraryFileName, true, false);
                }
                else {
                    ts.forEach(options.lib, function (libFileName) {
                        processRootFile(ts.combinePaths(defaultLibraryPath, libFileName), true, false);
                    });
                }
            }
            missingFilePaths = ts.arrayFrom(ts.mapDefinedIterator(filesByName.entries(), function (_a) {
                var path = _a[0], file = _a[1];
                return file === undefined ? path : undefined;
            }));
            files = ts.stableSort(processingDefaultLibFiles, compareDefaultLibFiles).concat(processingOtherFiles);
            processingDefaultLibFiles = undefined;
            processingOtherFiles = undefined;
        }
        ts.Debug.assert(!!missingFilePaths);
        if (oldProgram && host.onReleaseOldSourceFile) {
            var oldSourceFiles = oldProgram.getSourceFiles();
            for (var _g = 0, oldSourceFiles_1 = oldSourceFiles; _g < oldSourceFiles_1.length; _g++) {
                var oldSourceFile = oldSourceFiles_1[_g];
                var newFile = getSourceFileByPath(oldSourceFile.resolvedPath);
                if (shouldCreateNewSourceFile || !newFile ||
                    (oldSourceFile.resolvedPath === oldSourceFile.path && newFile.resolvedPath !== oldSourceFile.path)) {
                    host.onReleaseOldSourceFile(oldSourceFile, oldProgram.getCompilerOptions(), !!getSourceFileByPath(oldSourceFile.path));
                }
            }
            oldProgram.forEachResolvedProjectReference(function (resolvedProjectReference, resolvedProjectReferencePath) {
                if (resolvedProjectReference && !getResolvedProjectReferenceByPath(resolvedProjectReferencePath)) {
                    host.onReleaseOldSourceFile(resolvedProjectReference.sourceFile, oldProgram.getCompilerOptions(), false);
                }
            });
        }
        oldProgram = undefined;
        var program = {
            getRootFileNames: function () { return rootNames; },
            getSourceFile: getSourceFile,
            getSourceFileByPath: getSourceFileByPath,
            getSourceFiles: function () { return files; },
            getMissingFilePaths: function () { return missingFilePaths; },
            getRefFileMap: function () { return refFileMap; },
            getFilesByNameMap: function () { return filesByName; },
            getCompilerOptions: function () { return options; },
            getSyntacticDiagnostics: getSyntacticDiagnostics,
            getOptionsDiagnostics: getOptionsDiagnostics,
            getGlobalDiagnostics: getGlobalDiagnostics,
            getSemanticDiagnostics: getSemanticDiagnostics,
            getSuggestionDiagnostics: getSuggestionDiagnostics,
            getDeclarationDiagnostics: getDeclarationDiagnostics,
            getBindAndCheckDiagnostics: getBindAndCheckDiagnostics,
            getProgramDiagnostics: getProgramDiagnostics,
            getTypeChecker: getTypeChecker,
            getClassifiableNames: getClassifiableNames,
            getDiagnosticsProducingTypeChecker: getDiagnosticsProducingTypeChecker,
            getCommonSourceDirectory: getCommonSourceDirectory,
            emit: emit,
            getCurrentDirectory: function () { return currentDirectory; },
            getNodeCount: function () { return getDiagnosticsProducingTypeChecker().getNodeCount(); },
            getIdentifierCount: function () { return getDiagnosticsProducingTypeChecker().getIdentifierCount(); },
            getSymbolCount: function () { return getDiagnosticsProducingTypeChecker().getSymbolCount(); },
            getTypeCount: function () { return getDiagnosticsProducingTypeChecker().getTypeCount(); },
            getInstantiationCount: function () { return getDiagnosticsProducingTypeChecker().getInstantiationCount(); },
            getRelationCacheSizes: function () { return getDiagnosticsProducingTypeChecker().getRelationCacheSizes(); },
            getFileProcessingDiagnostics: function () { return fileProcessingDiagnostics; },
            getResolvedTypeReferenceDirectives: function () { return resolvedTypeReferenceDirectives; },
            isSourceFileFromExternalLibrary: isSourceFileFromExternalLibrary,
            isSourceFileDefaultLibrary: isSourceFileDefaultLibrary,
            dropDiagnosticsProducingTypeChecker: dropDiagnosticsProducingTypeChecker,
            getSourceFileFromReference: getSourceFileFromReference,
            getLibFileFromReference: getLibFileFromReference,
            sourceFileToPackageName: sourceFileToPackageName,
            redirectTargetsMap: redirectTargetsMap,
            isEmittedFile: isEmittedFile,
            getConfigFileParsingDiagnostics: getConfigFileParsingDiagnostics,
            getResolvedModuleWithFailedLookupLocationsFromCache: getResolvedModuleWithFailedLookupLocationsFromCache,
            getProjectReferences: getProjectReferences,
            getResolvedProjectReferences: getResolvedProjectReferences,
            getProjectReferenceRedirect: getProjectReferenceRedirect,
            getResolvedProjectReferenceToRedirect: getResolvedProjectReferenceToRedirect,
            getResolvedProjectReferenceByPath: getResolvedProjectReferenceByPath,
            forEachResolvedProjectReference: forEachResolvedProjectReference,
            isSourceOfProjectReferenceRedirect: isSourceOfProjectReferenceRedirect,
            emitBuildInfo: emitBuildInfo,
            fileExists: fileExists,
            getProbableSymlinks: getProbableSymlinks,
            useCaseSensitiveFileNames: function () { return host.useCaseSensitiveFileNames(); },
        };
        onProgramCreateComplete();
        verifyCompilerOptions();
        ts.performance.mark("afterProgram");
        ts.performance.measure("Program", "beforeProgram", "afterProgram");
        return program;
        function resolveModuleNamesWorker(moduleNames, containingFile, reusedNames, redirectedReference) {
            ts.performance.mark("beforeResolveModule");
            var result = actualResolveModuleNamesWorker(moduleNames, containingFile, reusedNames, redirectedReference);
            ts.performance.mark("afterResolveModule");
            ts.performance.measure("ResolveModule", "beforeResolveModule", "afterResolveModule");
            return result;
        }
        function resolveTypeReferenceDirectiveNamesWorker(typeDirectiveNames, containingFile, redirectedReference) {
            ts.performance.mark("beforeResolveTypeReference");
            var result = actualResolveTypeReferenceDirectiveNamesWorker(typeDirectiveNames, containingFile, redirectedReference);
            ts.performance.mark("afterResolveTypeReference");
            ts.performance.measure("ResolveTypeReference", "beforeResolveTypeReference", "afterResolveTypeReference");
            return result;
        }
        function compareDefaultLibFiles(a, b) {
            return ts.compareValues(getDefaultLibFilePriority(a), getDefaultLibFilePriority(b));
        }
        function getDefaultLibFilePriority(a) {
            if (ts.containsPath(defaultLibraryPath, a.fileName, false)) {
                var basename = ts.getBaseFileName(a.fileName);
                if (basename === "lib.d.ts" || basename === "lib.es6.d.ts")
                    return 0;
                var name = ts.removeSuffix(ts.removePrefix(basename, "lib."), ".d.ts");
                var index = ts.libs.indexOf(name);
                if (index !== -1)
                    return index + 1;
            }
            return ts.libs.length + 2;
        }
        function getResolvedModuleWithFailedLookupLocationsFromCache(moduleName, containingFile) {
            return moduleResolutionCache && ts.resolveModuleNameFromCache(moduleName, containingFile, moduleResolutionCache);
        }
        function toPath(fileName) {
            return ts.toPath(fileName, currentDirectory, getCanonicalFileName);
        }
        function getCommonSourceDirectory() {
            if (commonSourceDirectory === undefined) {
                var emittedFiles = ts.filter(files, function (file) { return ts.sourceFileMayBeEmitted(file, program); });
                if (options.rootDir && checkSourceFilesBelongToPath(emittedFiles, options.rootDir)) {
                    commonSourceDirectory = ts.getNormalizedAbsolutePath(options.rootDir, currentDirectory);
                }
                else if (options.composite && options.configFilePath) {
                    commonSourceDirectory = ts.getDirectoryPath(ts.normalizeSlashes(options.configFilePath));
                    checkSourceFilesBelongToPath(emittedFiles, commonSourceDirectory);
                }
                else {
                    commonSourceDirectory = computeCommonSourceDirectory(emittedFiles);
                }
                if (commonSourceDirectory && commonSourceDirectory[commonSourceDirectory.length - 1] !== ts.directorySeparator) {
                    commonSourceDirectory += ts.directorySeparator;
                }
            }
            return commonSourceDirectory;
        }
        function getClassifiableNames() {
            if (!classifiableNames) {
                getTypeChecker();
                classifiableNames = ts.createUnderscoreEscapedMap();
                for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
                    var sourceFile = files_2[_i];
                    ts.copyEntries(sourceFile.classifiableNames, classifiableNames);
                }
            }
            return classifiableNames;
        }
        function resolveModuleNamesReusingOldState(moduleNames, containingFile, file) {
            if (structuralIsReused === 0 && !file.ambientModuleNames.length) {
                return resolveModuleNamesWorker(moduleNames, containingFile, undefined, getResolvedProjectReferenceToRedirect(file.originalFileName));
            }
            var oldSourceFile = oldProgram && oldProgram.getSourceFile(containingFile);
            if (oldSourceFile !== file && file.resolvedModules) {
                var result_11 = [];
                for (var _i = 0, moduleNames_1 = moduleNames; _i < moduleNames_1.length; _i++) {
                    var moduleName = moduleNames_1[_i];
                    var resolvedModule = file.resolvedModules.get(moduleName);
                    result_11.push(resolvedModule);
                }
                return result_11;
            }
            var unknownModuleNames;
            var result;
            var reusedNames;
            var predictedToResolveToAmbientModuleMarker = {};
            for (var i = 0; i < moduleNames.length; i++) {
                var moduleName = moduleNames[i];
                if (file === oldSourceFile && !hasInvalidatedResolution(oldSourceFile.path)) {
                    var oldResolvedModule = oldSourceFile && oldSourceFile.resolvedModules.get(moduleName);
                    if (oldResolvedModule) {
                        if (ts.isTraceEnabled(options, host)) {
                            ts.trace(host, ts.Diagnostics.Reusing_resolution_of_module_0_to_file_1_from_old_program, moduleName, containingFile);
                        }
                        (result || (result = new Array(moduleNames.length)))[i] = oldResolvedModule;
                        (reusedNames || (reusedNames = [])).push(moduleName);
                        continue;
                    }
                }
                var resolvesToAmbientModuleInNonModifiedFile = false;
                if (ts.contains(file.ambientModuleNames, moduleName)) {
                    resolvesToAmbientModuleInNonModifiedFile = true;
                    if (ts.isTraceEnabled(options, host)) {
                        ts.trace(host, ts.Diagnostics.Module_0_was_resolved_as_locally_declared_ambient_module_in_file_1, moduleName, containingFile);
                    }
                }
                else {
                    resolvesToAmbientModuleInNonModifiedFile = moduleNameResolvesToAmbientModuleInNonModifiedFile(moduleName);
                }
                if (resolvesToAmbientModuleInNonModifiedFile) {
                    (result || (result = new Array(moduleNames.length)))[i] = predictedToResolveToAmbientModuleMarker;
                }
                else {
                    (unknownModuleNames || (unknownModuleNames = [])).push(moduleName);
                }
            }
            var resolutions = unknownModuleNames && unknownModuleNames.length
                ? resolveModuleNamesWorker(unknownModuleNames, containingFile, reusedNames, getResolvedProjectReferenceToRedirect(file.originalFileName))
                : ts.emptyArray;
            if (!result) {
                ts.Debug.assert(resolutions.length === moduleNames.length);
                return resolutions;
            }
            var j = 0;
            for (var i = 0; i < result.length; i++) {
                if (result[i]) {
                    if (result[i] === predictedToResolveToAmbientModuleMarker) {
                        result[i] = undefined;
                    }
                }
                else {
                    result[i] = resolutions[j];
                    j++;
                }
            }
            ts.Debug.assert(j === resolutions.length);
            return result;
            function moduleNameResolvesToAmbientModuleInNonModifiedFile(moduleName) {
                var resolutionToFile = ts.getResolvedModule(oldSourceFile, moduleName);
                var resolvedFile = resolutionToFile && oldProgram.getSourceFile(resolutionToFile.resolvedFileName);
                if (resolutionToFile && resolvedFile) {
                    return false;
                }
                var unmodifiedFile = ambientModuleNameToUnmodifiedFileName.get(moduleName);
                if (!unmodifiedFile) {
                    return false;
                }
                if (ts.isTraceEnabled(options, host)) {
                    ts.trace(host, ts.Diagnostics.Module_0_was_resolved_as_ambient_module_declared_in_1_since_this_file_was_not_modified, moduleName, unmodifiedFile);
                }
                return true;
            }
        }
        function canReuseProjectReferences() {
            return !forEachProjectReference(oldProgram.getProjectReferences(), oldProgram.getResolvedProjectReferences(), function (oldResolvedRef, index, parent) {
                var newRef = (parent ? parent.commandLine.projectReferences : projectReferences)[index];
                var newResolvedRef = parseProjectReferenceConfigFile(newRef);
                if (oldResolvedRef) {
                    return !newResolvedRef || newResolvedRef.sourceFile !== oldResolvedRef.sourceFile;
                }
                else {
                    return newResolvedRef !== undefined;
                }
            }, function (oldProjectReferences, parent) {
                var newReferences = parent ? getResolvedProjectReferenceByPath(parent.sourceFile.path).commandLine.projectReferences : projectReferences;
                return !ts.arrayIsEqualTo(oldProjectReferences, newReferences, ts.projectReferenceIsEqualTo);
            });
        }
        function tryReuseStructureFromOldProgram() {
            if (!oldProgram) {
                return 0;
            }
            var oldOptions = oldProgram.getCompilerOptions();
            if (ts.changesAffectModuleResolution(oldOptions, options)) {
                return oldProgram.structureIsReused = 0;
            }
            ts.Debug.assert(!(oldProgram.structureIsReused & (2 | 1)));
            var oldRootNames = oldProgram.getRootFileNames();
            if (!ts.arrayIsEqualTo(oldRootNames, rootNames)) {
                return oldProgram.structureIsReused = 0;
            }
            if (!ts.arrayIsEqualTo(options.types, oldOptions.types)) {
                return oldProgram.structureIsReused = 0;
            }
            if (!canReuseProjectReferences()) {
                return oldProgram.structureIsReused = 0;
            }
            if (projectReferences) {
                resolvedProjectReferences = projectReferences.map(parseProjectReferenceConfigFile);
            }
            var newSourceFiles = [];
            var modifiedSourceFiles = [];
            oldProgram.structureIsReused = 2;
            if (oldProgram.getMissingFilePaths().some(function (missingFilePath) { return host.fileExists(missingFilePath); })) {
                return oldProgram.structureIsReused = 0;
            }
            var oldSourceFiles = oldProgram.getSourceFiles();
            var seenPackageNames = ts.createMap();
            for (var _i = 0, oldSourceFiles_2 = oldSourceFiles; _i < oldSourceFiles_2.length; _i++) {
                var oldSourceFile = oldSourceFiles_2[_i];
                var newSourceFile = host.getSourceFileByPath
                    ? host.getSourceFileByPath(oldSourceFile.fileName, oldSourceFile.resolvedPath, options.target, undefined, shouldCreateNewSourceFile)
                    : host.getSourceFile(oldSourceFile.fileName, options.target, undefined, shouldCreateNewSourceFile);
                if (!newSourceFile) {
                    return oldProgram.structureIsReused = 0;
                }
                ts.Debug.assert(!newSourceFile.redirectInfo, "Host should not return a redirect source file from `getSourceFile`");
                var fileChanged = void 0;
                if (oldSourceFile.redirectInfo) {
                    if (newSourceFile !== oldSourceFile.redirectInfo.unredirected) {
                        return oldProgram.structureIsReused = 0;
                    }
                    fileChanged = false;
                    newSourceFile = oldSourceFile;
                }
                else if (oldProgram.redirectTargetsMap.has(oldSourceFile.path)) {
                    if (newSourceFile !== oldSourceFile) {
                        return oldProgram.structureIsReused = 0;
                    }
                    fileChanged = false;
                }
                else {
                    fileChanged = newSourceFile !== oldSourceFile;
                }
                newSourceFile.path = oldSourceFile.path;
                newSourceFile.originalFileName = oldSourceFile.originalFileName;
                newSourceFile.resolvedPath = oldSourceFile.resolvedPath;
                newSourceFile.fileName = oldSourceFile.fileName;
                var packageName = oldProgram.sourceFileToPackageName.get(oldSourceFile.path);
                if (packageName !== undefined) {
                    var prevKind = seenPackageNames.get(packageName);
                    var newKind = fileChanged ? 1 : 0;
                    if ((prevKind !== undefined && newKind === 1) || prevKind === 1) {
                        return oldProgram.structureIsReused = 0;
                    }
                    seenPackageNames.set(packageName, newKind);
                }
                if (fileChanged) {
                    if (!ts.arrayIsEqualTo(oldSourceFile.libReferenceDirectives, newSourceFile.libReferenceDirectives, fileReferenceIsEqualTo)) {
                        return oldProgram.structureIsReused = 0;
                    }
                    if (oldSourceFile.hasNoDefaultLib !== newSourceFile.hasNoDefaultLib) {
                        oldProgram.structureIsReused = 1;
                    }
                    if (!ts.arrayIsEqualTo(oldSourceFile.referencedFiles, newSourceFile.referencedFiles, fileReferenceIsEqualTo)) {
                        oldProgram.structureIsReused = 1;
                    }
                    collectExternalModuleReferences(newSourceFile);
                    if (!ts.arrayIsEqualTo(oldSourceFile.imports, newSourceFile.imports, moduleNameIsEqualTo)) {
                        oldProgram.structureIsReused = 1;
                    }
                    if (!ts.arrayIsEqualTo(oldSourceFile.moduleAugmentations, newSourceFile.moduleAugmentations, moduleNameIsEqualTo)) {
                        oldProgram.structureIsReused = 1;
                    }
                    if ((oldSourceFile.flags & 3145728) !== (newSourceFile.flags & 3145728)) {
                        oldProgram.structureIsReused = 1;
                    }
                    if (!ts.arrayIsEqualTo(oldSourceFile.typeReferenceDirectives, newSourceFile.typeReferenceDirectives, fileReferenceIsEqualTo)) {
                        oldProgram.structureIsReused = 1;
                    }
                    modifiedSourceFiles.push({ oldFile: oldSourceFile, newFile: newSourceFile });
                }
                else if (hasInvalidatedResolution(oldSourceFile.path)) {
                    oldProgram.structureIsReused = 1;
                    modifiedSourceFiles.push({ oldFile: oldSourceFile, newFile: newSourceFile });
                }
                newSourceFiles.push(newSourceFile);
            }
            if (oldProgram.structureIsReused !== 2) {
                return oldProgram.structureIsReused;
            }
            var modifiedFiles = modifiedSourceFiles.map(function (f) { return f.oldFile; });
            for (var _a = 0, oldSourceFiles_3 = oldSourceFiles; _a < oldSourceFiles_3.length; _a++) {
                var oldFile = oldSourceFiles_3[_a];
                if (!ts.contains(modifiedFiles, oldFile)) {
                    for (var _b = 0, _c = oldFile.ambientModuleNames; _b < _c.length; _b++) {
                        var moduleName = _c[_b];
                        ambientModuleNameToUnmodifiedFileName.set(moduleName, oldFile.fileName);
                    }
                }
            }
            for (var _d = 0, modifiedSourceFiles_1 = modifiedSourceFiles; _d < modifiedSourceFiles_1.length; _d++) {
                var _e = modifiedSourceFiles_1[_d], oldSourceFile = _e.oldFile, newSourceFile = _e.newFile;
                var newSourceFilePath = ts.getNormalizedAbsolutePath(newSourceFile.originalFileName, currentDirectory);
                var moduleNames = getModuleNames(newSourceFile);
                var resolutions = resolveModuleNamesReusingOldState(moduleNames, newSourceFilePath, newSourceFile);
                var resolutionsChanged = ts.hasChangesInResolutions(moduleNames, resolutions, oldSourceFile.resolvedModules, ts.moduleResolutionIsEqualTo);
                if (resolutionsChanged) {
                    oldProgram.structureIsReused = 1;
                    newSourceFile.resolvedModules = ts.zipToMap(moduleNames, resolutions);
                }
                else {
                    newSourceFile.resolvedModules = oldSourceFile.resolvedModules;
                }
                if (resolveTypeReferenceDirectiveNamesWorker) {
                    var typesReferenceDirectives = ts.map(newSourceFile.typeReferenceDirectives, function (ref) { return ts.toFileNameLowerCase(ref.fileName); });
                    var resolutions_1 = resolveTypeReferenceDirectiveNamesWorker(typesReferenceDirectives, newSourceFilePath, getResolvedProjectReferenceToRedirect(newSourceFile.originalFileName));
                    var resolutionsChanged_1 = ts.hasChangesInResolutions(typesReferenceDirectives, resolutions_1, oldSourceFile.resolvedTypeReferenceDirectiveNames, ts.typeDirectiveIsEqualTo);
                    if (resolutionsChanged_1) {
                        oldProgram.structureIsReused = 1;
                        newSourceFile.resolvedTypeReferenceDirectiveNames = ts.zipToMap(typesReferenceDirectives, resolutions_1);
                    }
                    else {
                        newSourceFile.resolvedTypeReferenceDirectiveNames = oldSourceFile.resolvedTypeReferenceDirectiveNames;
                    }
                }
            }
            if (oldProgram.structureIsReused !== 2) {
                return oldProgram.structureIsReused;
            }
            if (host.hasChangedAutomaticTypeDirectiveNames) {
                return oldProgram.structureIsReused = 1;
            }
            missingFilePaths = oldProgram.getMissingFilePaths();
            refFileMap = oldProgram.getRefFileMap();
            ts.Debug.assert(newSourceFiles.length === oldProgram.getSourceFiles().length);
            for (var _f = 0, newSourceFiles_1 = newSourceFiles; _f < newSourceFiles_1.length; _f++) {
                var newSourceFile = newSourceFiles_1[_f];
                filesByName.set(newSourceFile.path, newSourceFile);
            }
            var oldFilesByNameMap = oldProgram.getFilesByNameMap();
            oldFilesByNameMap.forEach(function (oldFile, path) {
                if (!oldFile) {
                    filesByName.set(path, oldFile);
                    return;
                }
                if (oldFile.path === path) {
                    if (oldProgram.isSourceFileFromExternalLibrary(oldFile)) {
                        sourceFilesFoundSearchingNodeModules.set(oldFile.path, true);
                    }
                    return;
                }
                filesByName.set(path, filesByName.get(oldFile.path));
            });
            files = newSourceFiles;
            fileProcessingDiagnostics = oldProgram.getFileProcessingDiagnostics();
            for (var _g = 0, modifiedSourceFiles_2 = modifiedSourceFiles; _g < modifiedSourceFiles_2.length; _g++) {
                var modifiedFile = modifiedSourceFiles_2[_g];
                fileProcessingDiagnostics.reattachFileDiagnostics(modifiedFile.newFile);
            }
            resolvedTypeReferenceDirectives = oldProgram.getResolvedTypeReferenceDirectives();
            sourceFileToPackageName = oldProgram.sourceFileToPackageName;
            redirectTargetsMap = oldProgram.redirectTargetsMap;
            return oldProgram.structureIsReused = 2;
        }
        function getEmitHost(writeFileCallback) {
            return {
                getPrependNodes: getPrependNodes,
                getCanonicalFileName: getCanonicalFileName,
                getCommonSourceDirectory: program.getCommonSourceDirectory,
                getCompilerOptions: program.getCompilerOptions,
                getCurrentDirectory: function () { return currentDirectory; },
                getNewLine: function () { return host.getNewLine(); },
                getSourceFile: program.getSourceFile,
                getSourceFileByPath: program.getSourceFileByPath,
                getSourceFiles: program.getSourceFiles,
                getLibFileFromReference: program.getLibFileFromReference,
                isSourceFileFromExternalLibrary: isSourceFileFromExternalLibrary,
                getResolvedProjectReferenceToRedirect: getResolvedProjectReferenceToRedirect,
                getProjectReferenceRedirect: getProjectReferenceRedirect,
                isSourceOfProjectReferenceRedirect: isSourceOfProjectReferenceRedirect,
                getProbableSymlinks: getProbableSymlinks,
                writeFile: writeFileCallback || (function (fileName, data, writeByteOrderMark, onError, sourceFiles) { return host.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles); }),
                isEmitBlocked: isEmitBlocked,
                readFile: function (f) { return host.readFile(f); },
                fileExists: function (f) {
                    var path = toPath(f);
                    if (getSourceFileByPath(path))
                        return true;
                    if (ts.contains(missingFilePaths, path))
                        return false;
                    return host.fileExists(f);
                },
                useCaseSensitiveFileNames: function () { return host.useCaseSensitiveFileNames(); },
                getProgramBuildInfo: function () { return program.getProgramBuildInfo && program.getProgramBuildInfo(); },
                getSourceFileFromReference: function (file, ref) { return program.getSourceFileFromReference(file, ref); },
                redirectTargetsMap: redirectTargetsMap,
            };
        }
        function emitBuildInfo(writeFileCallback) {
            ts.Debug.assert(!options.out && !options.outFile);
            ts.performance.mark("beforeEmit");
            var emitResult = ts.emitFiles(ts.notImplementedResolver, getEmitHost(writeFileCallback), undefined, ts.noTransformers, false, true);
            ts.performance.mark("afterEmit");
            ts.performance.measure("Emit", "beforeEmit", "afterEmit");
            return emitResult;
        }
        function getResolvedProjectReferences() {
            return resolvedProjectReferences;
        }
        function getProjectReferences() {
            return projectReferences;
        }
        function getPrependNodes() {
            return createPrependNodes(projectReferences, function (_ref, index) { return resolvedProjectReferences[index].commandLine; }, function (fileName) {
                var path = toPath(fileName);
                var sourceFile = getSourceFileByPath(path);
                return sourceFile ? sourceFile.text : filesByName.has(path) ? undefined : host.readFile(path);
            });
        }
        function isSourceFileFromExternalLibrary(file) {
            return !!sourceFilesFoundSearchingNodeModules.get(file.path);
        }
        function isSourceFileDefaultLibrary(file) {
            if (file.hasNoDefaultLib) {
                return true;
            }
            if (!options.noLib) {
                return false;
            }
            var equalityComparer = host.useCaseSensitiveFileNames() ? ts.equateStringsCaseSensitive : ts.equateStringsCaseInsensitive;
            if (!options.lib) {
                return equalityComparer(file.fileName, getDefaultLibraryFileName());
            }
            else {
                return ts.some(options.lib, function (libFileName) { return equalityComparer(file.fileName, ts.combinePaths(defaultLibraryPath, libFileName)); });
            }
        }
        function getDiagnosticsProducingTypeChecker() {
            return diagnosticsProducingTypeChecker || (diagnosticsProducingTypeChecker = ts.createTypeChecker(program, true));
        }
        function dropDiagnosticsProducingTypeChecker() {
            diagnosticsProducingTypeChecker = undefined;
        }
        function getTypeChecker() {
            return noDiagnosticsTypeChecker || (noDiagnosticsTypeChecker = ts.createTypeChecker(program, false));
        }
        function emit(sourceFile, writeFileCallback, cancellationToken, emitOnlyDtsFiles, transformers, forceDtsEmit) {
            return runWithCancellationToken(function () { return emitWorker(program, sourceFile, writeFileCallback, cancellationToken, emitOnlyDtsFiles, transformers, forceDtsEmit); });
        }
        function isEmitBlocked(emitFileName) {
            return hasEmitBlockingDiagnostics.has(toPath(emitFileName));
        }
        function emitWorker(program, sourceFile, writeFileCallback, cancellationToken, emitOnlyDtsFiles, customTransformers, forceDtsEmit) {
            if (!forceDtsEmit) {
                var result = handleNoEmitOptions(program, sourceFile, cancellationToken);
                if (result)
                    return result;
            }
            var emitResolver = getDiagnosticsProducingTypeChecker().getEmitResolver((options.outFile || options.out) ? undefined : sourceFile, cancellationToken);
            ts.performance.mark("beforeEmit");
            var emitResult = ts.emitFiles(emitResolver, getEmitHost(writeFileCallback), sourceFile, ts.getTransformers(options, customTransformers, emitOnlyDtsFiles), emitOnlyDtsFiles, false, forceDtsEmit);
            ts.performance.mark("afterEmit");
            ts.performance.measure("Emit", "beforeEmit", "afterEmit");
            return emitResult;
        }
        function getSourceFile(fileName) {
            return getSourceFileByPath(toPath(fileName));
        }
        function getSourceFileByPath(path) {
            return filesByName.get(path) || undefined;
        }
        function getDiagnosticsHelper(sourceFile, getDiagnostics, cancellationToken) {
            if (sourceFile) {
                return getDiagnostics(sourceFile, cancellationToken);
            }
            return ts.sortAndDeduplicateDiagnostics(ts.flatMap(program.getSourceFiles(), function (sourceFile) {
                if (cancellationToken) {
                    cancellationToken.throwIfCancellationRequested();
                }
                return getDiagnostics(sourceFile, cancellationToken);
            }));
        }
        function getSyntacticDiagnostics(sourceFile, cancellationToken) {
            return getDiagnosticsHelper(sourceFile, getSyntacticDiagnosticsForFile, cancellationToken);
        }
        function getSemanticDiagnostics(sourceFile, cancellationToken) {
            return getDiagnosticsHelper(sourceFile, getSemanticDiagnosticsForFile, cancellationToken);
        }
        function getBindAndCheckDiagnostics(sourceFile, cancellationToken) {
            return getBindAndCheckDiagnosticsForFile(sourceFile, cancellationToken);
        }
        function getProgramDiagnostics(sourceFile) {
            if (ts.skipTypeChecking(sourceFile, options, program)) {
                return ts.emptyArray;
            }
            var fileProcessingDiagnosticsInFile = fileProcessingDiagnostics.getDiagnostics(sourceFile.fileName);
            var programDiagnosticsInFile = programDiagnostics.getDiagnostics(sourceFile.fileName);
            return getMergedProgramDiagnostics(sourceFile, fileProcessingDiagnosticsInFile, programDiagnosticsInFile);
        }
        function getMergedProgramDiagnostics(sourceFile) {
            var _a;
            var allDiagnostics = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                allDiagnostics[_i - 1] = arguments[_i];
            }
            var flatDiagnostics = ts.flatten(allDiagnostics);
            if (!((_a = sourceFile.commentDirectives) === null || _a === void 0 ? void 0 : _a.length)) {
                return flatDiagnostics;
            }
            return getDiagnosticsWithPrecedingDirectives(sourceFile, sourceFile.commentDirectives, flatDiagnostics).diagnostics;
        }
        function getDeclarationDiagnostics(sourceFile, cancellationToken) {
            var options = program.getCompilerOptions();
            if (!sourceFile || options.out || options.outFile) {
                return getDeclarationDiagnosticsWorker(sourceFile, cancellationToken);
            }
            else {
                return getDiagnosticsHelper(sourceFile, getDeclarationDiagnosticsForFile, cancellationToken);
            }
        }
        function getSyntacticDiagnosticsForFile(sourceFile) {
            if (ts.isSourceFileJS(sourceFile)) {
                if (!sourceFile.additionalSyntacticDiagnostics) {
                    sourceFile.additionalSyntacticDiagnostics = getJSSyntacticDiagnosticsForFile(sourceFile);
                }
                return ts.concatenate(sourceFile.additionalSyntacticDiagnostics, sourceFile.parseDiagnostics);
            }
            return sourceFile.parseDiagnostics;
        }
        function runWithCancellationToken(func) {
            try {
                return func();
            }
            catch (e) {
                if (e instanceof ts.OperationCanceledException) {
                    noDiagnosticsTypeChecker = undefined;
                    diagnosticsProducingTypeChecker = undefined;
                }
                throw e;
            }
        }
        function getSemanticDiagnosticsForFile(sourceFile, cancellationToken) {
            return ts.concatenate(getBindAndCheckDiagnosticsForFile(sourceFile, cancellationToken), getProgramDiagnostics(sourceFile));
        }
        function getBindAndCheckDiagnosticsForFile(sourceFile, cancellationToken) {
            return getAndCacheDiagnostics(sourceFile, cancellationToken, cachedBindAndCheckDiagnosticsForFile, getBindAndCheckDiagnosticsForFileNoCache);
        }
        function getBindAndCheckDiagnosticsForFileNoCache(sourceFile, cancellationToken) {
            return runWithCancellationToken(function () {
                if (ts.skipTypeChecking(sourceFile, options, program)) {
                    return ts.emptyArray;
                }
                var typeChecker = getDiagnosticsProducingTypeChecker();
                ts.Debug.assert(!!sourceFile.bindDiagnostics);
                var isCheckJs = ts.isCheckJsEnabledForFile(sourceFile, options);
                var isTsNoCheck = !!sourceFile.checkJsDirective && sourceFile.checkJsDirective.enabled === false;
                var includeBindAndCheckDiagnostics = !isTsNoCheck && (sourceFile.scriptKind === 3 || sourceFile.scriptKind === 4 ||
                    sourceFile.scriptKind === 5 || isCheckJs || sourceFile.scriptKind === 7);
                var bindDiagnostics = includeBindAndCheckDiagnostics ? sourceFile.bindDiagnostics : ts.emptyArray;
                var checkDiagnostics = includeBindAndCheckDiagnostics ? typeChecker.getDiagnostics(sourceFile, cancellationToken) : ts.emptyArray;
                return getMergedBindAndCheckDiagnostics(sourceFile, bindDiagnostics, checkDiagnostics, isCheckJs ? sourceFile.jsDocDiagnostics : undefined);
            });
        }
        function getMergedBindAndCheckDiagnostics(sourceFile) {
            var _a;
            var allDiagnostics = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                allDiagnostics[_i - 1] = arguments[_i];
            }
            var flatDiagnostics = ts.flatten(allDiagnostics);
            if (!((_a = sourceFile.commentDirectives) === null || _a === void 0 ? void 0 : _a.length)) {
                return flatDiagnostics;
            }
            var _b = getDiagnosticsWithPrecedingDirectives(sourceFile, sourceFile.commentDirectives, flatDiagnostics), diagnostics = _b.diagnostics, directives = _b.directives;
            for (var _c = 0, _d = directives.getUnusedExpectations(); _c < _d.length; _c++) {
                var errorExpectation = _d[_c];
                diagnostics.push(ts.createDiagnosticForRange(sourceFile, errorExpectation.range, ts.Diagnostics.Unused_ts_expect_error_directive));
            }
            return diagnostics;
        }
        function getDiagnosticsWithPrecedingDirectives(sourceFile, commentDirectives, flatDiagnostics) {
            var directives = ts.createCommentDirectivesMap(sourceFile, commentDirectives);
            var diagnostics = flatDiagnostics.filter(function (diagnostic) { return markPrecedingCommentDirectiveLine(diagnostic, directives) === -1; });
            return { diagnostics: diagnostics, directives: directives };
        }
        function getSuggestionDiagnostics(sourceFile, cancellationToken) {
            return runWithCancellationToken(function () {
                return getDiagnosticsProducingTypeChecker().getSuggestionDiagnostics(sourceFile, cancellationToken);
            });
        }
        function markPrecedingCommentDirectiveLine(diagnostic, directives) {
            var file = diagnostic.file, start = diagnostic.start;
            if (!file) {
                return -1;
            }
            var lineStarts = ts.getLineStarts(file);
            var line = ts.computeLineAndCharacterOfPosition(lineStarts, start).line - 1;
            while (line >= 0) {
                if (directives.markUsed(line)) {
                    return line;
                }
                var lineText = file.text.slice(lineStarts[line], lineStarts[line + 1]).trim();
                if (lineText !== "" && !/^(\s*)\/\/(.*)$/.test(lineText)) {
                    return -1;
                }
                line--;
            }
            return -1;
        }
        function getJSSyntacticDiagnosticsForFile(sourceFile) {
            return runWithCancellationToken(function () {
                var diagnostics = [];
                walk(sourceFile, sourceFile);
                ts.forEachChildRecursively(sourceFile, walk, walkArray);
                return diagnostics;
                function walk(node, parent) {
                    switch (parent.kind) {
                        case 156:
                        case 159:
                        case 161:
                            if (parent.questionToken === node) {
                                diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics.The_0_modifier_can_only_be_used_in_TypeScript_files, "?"));
                                return "skip";
                            }
                        case 160:
                        case 162:
                        case 163:
                        case 164:
                        case 201:
                        case 244:
                        case 202:
                        case 242:
                            if (parent.type === node) {
                                diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics.Type_annotations_can_only_be_used_in_TypeScript_files));
                                return "skip";
                            }
                    }
                    switch (node.kind) {
                        case 255:
                            if (node.isTypeOnly) {
                                diagnostics.push(createDiagnosticForNode(node.parent, ts.Diagnostics._0_declarations_can_only_be_used_in_TypeScript_files, "import type"));
                                return "skip";
                            }
                            break;
                        case 260:
                            if (node.isTypeOnly) {
                                diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics._0_declarations_can_only_be_used_in_TypeScript_files, "export type"));
                                return "skip";
                            }
                            break;
                        case 253:
                            diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics.import_can_only_be_used_in_TypeScript_files));
                            return "skip";
                        case 259:
                            if (node.isExportEquals) {
                                diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics.export_can_only_be_used_in_TypeScript_files));
                                return "skip";
                            }
                            break;
                        case 279:
                            var heritageClause = node;
                            if (heritageClause.token === 113) {
                                diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics.implements_clauses_can_only_be_used_in_TypeScript_files));
                                return "skip";
                            }
                            break;
                        case 246:
                            var interfaceKeyword = ts.tokenToString(114);
                            ts.Debug.assertIsDefined(interfaceKeyword);
                            diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics._0_declarations_can_only_be_used_in_TypeScript_files, interfaceKeyword));
                            return "skip";
                        case 249:
                            var moduleKeyword = node.flags & 16 ? ts.tokenToString(136) : ts.tokenToString(135);
                            ts.Debug.assertIsDefined(moduleKeyword);
                            diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics._0_declarations_can_only_be_used_in_TypeScript_files, moduleKeyword));
                            return "skip";
                        case 247:
                            diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics.Type_aliases_can_only_be_used_in_TypeScript_files));
                            return "skip";
                        case 248:
                            var enumKeyword = ts.Debug.checkDefined(ts.tokenToString(88));
                            diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics._0_declarations_can_only_be_used_in_TypeScript_files, enumKeyword));
                            return "skip";
                        case 218:
                            diagnostics.push(createDiagnosticForNode(node, ts.Diagnostics.Non_null_assertions_can_only_be_used_in_TypeScript_files));
                            return "skip";
                        case 217:
                            diagnostics.push(createDiagnosticForNode(node.type, ts.Diagnostics.Type_assertion_expressions_can_only_be_used_in_TypeScript_files));
                            return "skip";
                        case 199:
                            ts.Debug.fail();
                    }
                }
                function walkArray(nodes, parent) {
                    if (parent.decorators === nodes && !options.experimentalDecorators) {
                        diagnostics.push(createDiagnosticForNode(parent, ts.Diagnostics.Experimental_support_for_decorators_is_a_feature_that_is_subject_to_change_in_a_future_release_Set_the_experimentalDecorators_option_in_your_tsconfig_or_jsconfig_to_remove_this_warning));
                    }
                    switch (parent.kind) {
                        case 245:
                        case 214:
                        case 161:
                        case 162:
                        case 163:
                        case 164:
                        case 201:
                        case 244:
                        case 202:
                            if (nodes === parent.typeParameters) {
                                diagnostics.push(createDiagnosticForNodeArray(nodes, ts.Diagnostics.Type_parameter_declarations_can_only_be_used_in_TypeScript_files));
                                return "skip";
                            }
                        case 225:
                            if (nodes === parent.modifiers) {
                                checkModifiers(parent.modifiers, parent.kind === 225);
                                return "skip";
                            }
                            break;
                        case 159:
                            if (nodes === parent.modifiers) {
                                for (var _i = 0, _a = nodes; _i < _a.length; _i++) {
                                    var modifier = _a[_i];
                                    if (modifier.kind !== 120) {
                                        diagnostics.push(createDiagnosticForNode(modifier, ts.Diagnostics.The_0_modifier_can_only_be_used_in_TypeScript_files, ts.tokenToString(modifier.kind)));
                                    }
                                }
                                return "skip";
                            }
                            break;
                        case 156:
                            if (nodes === parent.modifiers) {
                                diagnostics.push(createDiagnosticForNodeArray(nodes, ts.Diagnostics.Parameter_modifiers_can_only_be_used_in_TypeScript_files));
                                return "skip";
                            }
                            break;
                        case 196:
                        case 197:
                        case 216:
                        case 267:
                        case 268:
                        case 198:
                            if (nodes === parent.typeArguments) {
                                diagnostics.push(createDiagnosticForNodeArray(nodes, ts.Diagnostics.Type_arguments_can_only_be_used_in_TypeScript_files));
                                return "skip";
                            }
                            break;
                    }
                }
                function checkModifiers(modifiers, isConstValid) {
                    for (var _i = 0, modifiers_1 = modifiers; _i < modifiers_1.length; _i++) {
                        var modifier = modifiers_1[_i];
                        switch (modifier.kind) {
                            case 81:
                                if (isConstValid) {
                                    continue;
                                }
                            case 119:
                            case 117:
                            case 118:
                            case 138:
                            case 130:
                            case 122:
                                diagnostics.push(createDiagnosticForNode(modifier, ts.Diagnostics.The_0_modifier_can_only_be_used_in_TypeScript_files, ts.tokenToString(modifier.kind)));
                                break;
                            case 120:
                            case 89:
                            case 84:
                        }
                    }
                }
                function createDiagnosticForNodeArray(nodes, message, arg0, arg1, arg2) {
                    var start = nodes.pos;
                    return ts.createFileDiagnostic(sourceFile, start, nodes.end - start, message, arg0, arg1, arg2);
                }
                function createDiagnosticForNode(node, message, arg0, arg1, arg2) {
                    return ts.createDiagnosticForNodeInSourceFile(sourceFile, node, message, arg0, arg1, arg2);
                }
            });
        }
        function getDeclarationDiagnosticsWorker(sourceFile, cancellationToken) {
            return getAndCacheDiagnostics(sourceFile, cancellationToken, cachedDeclarationDiagnosticsForFile, getDeclarationDiagnosticsForFileNoCache);
        }
        function getDeclarationDiagnosticsForFileNoCache(sourceFile, cancellationToken) {
            return runWithCancellationToken(function () {
                var resolver = getDiagnosticsProducingTypeChecker().getEmitResolver(sourceFile, cancellationToken);
                return ts.getDeclarationDiagnostics(getEmitHost(ts.noop), resolver, sourceFile) || ts.emptyArray;
            });
        }
        function getAndCacheDiagnostics(sourceFile, cancellationToken, cache, getDiagnostics) {
            var cachedResult = sourceFile
                ? cache.perFile && cache.perFile.get(sourceFile.path)
                : cache.allDiagnostics;
            if (cachedResult) {
                return cachedResult;
            }
            var result = getDiagnostics(sourceFile, cancellationToken);
            if (sourceFile) {
                if (!cache.perFile) {
                    cache.perFile = ts.createMap();
                }
                cache.perFile.set(sourceFile.path, result);
            }
            else {
                cache.allDiagnostics = result;
            }
            return result;
        }
        function getDeclarationDiagnosticsForFile(sourceFile, cancellationToken) {
            return sourceFile.isDeclarationFile ? [] : getDeclarationDiagnosticsWorker(sourceFile, cancellationToken);
        }
        function getOptionsDiagnostics() {
            return ts.sortAndDeduplicateDiagnostics(ts.concatenate(fileProcessingDiagnostics.getGlobalDiagnostics(), ts.concatenate(programDiagnostics.getGlobalDiagnostics(), getOptionsDiagnosticsOfConfigFile())));
        }
        function getOptionsDiagnosticsOfConfigFile() {
            if (!options.configFile) {
                return ts.emptyArray;
            }
            var diagnostics = programDiagnostics.getDiagnostics(options.configFile.fileName);
            forEachResolvedProjectReference(function (resolvedRef) {
                if (resolvedRef) {
                    diagnostics = ts.concatenate(diagnostics, programDiagnostics.getDiagnostics(resolvedRef.sourceFile.fileName));
                }
            });
            return diagnostics;
        }
        function getGlobalDiagnostics() {
            return rootNames.length ? ts.sortAndDeduplicateDiagnostics(getDiagnosticsProducingTypeChecker().getGlobalDiagnostics().slice()) : ts.emptyArray;
        }
        function getConfigFileParsingDiagnostics() {
            return configFileParsingDiagnostics || ts.emptyArray;
        }
        function processRootFile(fileName, isDefaultLib, ignoreNoDefaultLib) {
            processSourceFile(ts.normalizePath(fileName), isDefaultLib, ignoreNoDefaultLib, undefined);
        }
        function fileReferenceIsEqualTo(a, b) {
            return a.fileName === b.fileName;
        }
        function moduleNameIsEqualTo(a, b) {
            return a.kind === 75
                ? b.kind === 75 && a.escapedText === b.escapedText
                : b.kind === 10 && a.text === b.text;
        }
        function collectExternalModuleReferences(file) {
            if (file.imports) {
                return;
            }
            var isJavaScriptFile = ts.isSourceFileJS(file);
            var isExternalModuleFile = ts.isExternalModule(file);
            var imports;
            var moduleAugmentations;
            var ambientModules;
            if (options.importHelpers
                && (options.isolatedModules || isExternalModuleFile)
                && !file.isDeclarationFile) {
                var externalHelpersModuleReference = ts.createLiteral(ts.externalHelpersModuleNameText);
                var importDecl = ts.createImportDeclaration(undefined, undefined, undefined, externalHelpersModuleReference);
                ts.addEmitFlags(importDecl, 67108864);
                externalHelpersModuleReference.parent = importDecl;
                importDecl.parent = file;
                imports = [externalHelpersModuleReference];
            }
            for (var _i = 0, _a = file.statements; _i < _a.length; _i++) {
                var node = _a[_i];
                collectModuleReferences(node, false);
            }
            if ((file.flags & 1048576) || isJavaScriptFile) {
                collectDynamicImportOrRequireCalls(file);
            }
            file.imports = imports || ts.emptyArray;
            file.moduleAugmentations = moduleAugmentations || ts.emptyArray;
            file.ambientModuleNames = ambientModules || ts.emptyArray;
            return;
            function collectModuleReferences(node, inAmbientModule) {
                if (ts.isAnyImportOrReExport(node)) {
                    var moduleNameExpr = ts.getExternalModuleName(node);
                    if (moduleNameExpr && ts.isStringLiteral(moduleNameExpr) && moduleNameExpr.text && (!inAmbientModule || !ts.isExternalModuleNameRelative(moduleNameExpr.text))) {
                        imports = ts.append(imports, moduleNameExpr);
                    }
                }
                else if (ts.isModuleDeclaration(node)) {
                    if (ts.isAmbientModule(node) && (inAmbientModule || ts.hasModifier(node, 2) || file.isDeclarationFile)) {
                        var nameText = ts.getTextOfIdentifierOrLiteral(node.name);
                        if (isExternalModuleFile || (inAmbientModule && !ts.isExternalModuleNameRelative(nameText))) {
                            (moduleAugmentations || (moduleAugmentations = [])).push(node.name);
                        }
                        else if (!inAmbientModule) {
                            if (file.isDeclarationFile) {
                                (ambientModules || (ambientModules = [])).push(nameText);
                            }
                            var body = node.body;
                            if (body) {
                                for (var _i = 0, _a = body.statements; _i < _a.length; _i++) {
                                    var statement = _a[_i];
                                    collectModuleReferences(statement, true);
                                }
                            }
                        }
                    }
                }
            }
            function collectDynamicImportOrRequireCalls(file) {
                var r = /import|require/g;
                while (r.exec(file.text) !== null) {
                    var node = getNodeAtPosition(file, r.lastIndex);
                    if (ts.isRequireCall(node, true)) {
                        imports = ts.append(imports, node.arguments[0]);
                    }
                    else if (ts.isImportCall(node) && node.arguments.length === 1 && ts.isStringLiteralLike(node.arguments[0])) {
                        imports = ts.append(imports, node.arguments[0]);
                    }
                    else if (ts.isLiteralImportTypeNode(node)) {
                        imports = ts.append(imports, node.argument.literal);
                    }
                }
            }
            function getNodeAtPosition(sourceFile, position) {
                var current = sourceFile;
                var getContainingChild = function (child) {
                    if (child.pos <= position && (position < child.end || (position === child.end && (child.kind === 1)))) {
                        return child;
                    }
                };
                while (true) {
                    var child = isJavaScriptFile && ts.hasJSDocNodes(current) && ts.forEach(current.jsDoc, getContainingChild) || ts.forEachChild(current, getContainingChild);
                    if (!child) {
                        return current;
                    }
                    current = child;
                }
            }
        }
        function getLibFileFromReference(ref) {
            var libName = ts.toFileNameLowerCase(ref.fileName);
            var libFileName = ts.libMap.get(libName);
            if (libFileName) {
                return getSourceFile(ts.combinePaths(defaultLibraryPath, libFileName));
            }
        }
        function getSourceFileFromReference(referencingFile, ref) {
            return getSourceFileFromReferenceWorker(resolveTripleslashReference(ref.fileName, referencingFile.fileName), function (fileName) { return filesByName.get(toPath(fileName)) || undefined; });
        }
        function getSourceFileFromReferenceWorker(fileName, getSourceFile, fail, refFile) {
            if (ts.hasExtension(fileName)) {
                var canonicalFileName_1 = host.getCanonicalFileName(fileName);
                if (!options.allowNonTsExtensions && !ts.forEach(supportedExtensionsWithJsonIfResolveJsonModule, function (extension) { return ts.fileExtensionIs(canonicalFileName_1, extension); })) {
                    if (fail) {
                        if (ts.hasJSFileExtension(canonicalFileName_1)) {
                            fail(ts.Diagnostics.File_0_is_a_JavaScript_file_Did_you_mean_to_enable_the_allowJs_option, fileName);
                        }
                        else {
                            fail(ts.Diagnostics.File_0_has_an_unsupported_extension_The_only_supported_extensions_are_1, fileName, "'" + supportedExtensions.join("', '") + "'");
                        }
                    }
                    return undefined;
                }
                var sourceFile = getSourceFile(fileName);
                if (fail) {
                    if (!sourceFile) {
                        var redirect = getProjectReferenceRedirect(fileName);
                        if (redirect) {
                            fail(ts.Diagnostics.Output_file_0_has_not_been_built_from_source_file_1, redirect, fileName);
                        }
                        else {
                            fail(ts.Diagnostics.File_0_not_found, fileName);
                        }
                    }
                    else if (refFile && canonicalFileName_1 === host.getCanonicalFileName(refFile.fileName)) {
                        fail(ts.Diagnostics.A_file_cannot_have_a_reference_to_itself);
                    }
                }
                return sourceFile;
            }
            else {
                var sourceFileNoExtension = options.allowNonTsExtensions && getSourceFile(fileName);
                if (sourceFileNoExtension)
                    return sourceFileNoExtension;
                if (fail && options.allowNonTsExtensions) {
                    fail(ts.Diagnostics.File_0_not_found, fileName);
                    return undefined;
                }
                var sourceFileWithAddedExtension = ts.forEach(supportedExtensions, function (extension) { return getSourceFile(fileName + extension); });
                if (fail && !sourceFileWithAddedExtension)
                    fail(ts.Diagnostics.Could_not_resolve_the_path_0_with_the_extensions_Colon_1, fileName, "'" + supportedExtensions.join("', '") + "'");
                return sourceFileWithAddedExtension;
            }
        }
        function processSourceFile(fileName, isDefaultLib, ignoreNoDefaultLib, packageId, refFile) {
            getSourceFileFromReferenceWorker(fileName, function (fileName) { return findSourceFile(fileName, toPath(fileName), isDefaultLib, ignoreNoDefaultLib, refFile, packageId); }, function (diagnostic) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return fileProcessingDiagnostics.add(createRefFileDiagnostic.apply(void 0, __spreadArrays([refFile, diagnostic], args)));
            }, refFile && refFile.file);
        }
        function reportFileNamesDifferOnlyInCasingError(fileName, existingFile, refFile) {
            var refs = !refFile ? refFileMap && refFileMap.get(existingFile.path) : undefined;
            var refToReportErrorOn = refs && ts.find(refs, function (ref) { return ref.referencedFileName === existingFile.fileName; });
            fileProcessingDiagnostics.add(refToReportErrorOn ?
                createFileDiagnosticAtReference(refToReportErrorOn, ts.Diagnostics.Already_included_file_name_0_differs_from_file_name_1_only_in_casing, existingFile.fileName, fileName) :
                createRefFileDiagnostic(refFile, ts.Diagnostics.File_name_0_differs_from_already_included_file_name_1_only_in_casing, fileName, existingFile.fileName));
        }
        function createRedirectSourceFile(redirectTarget, unredirected, fileName, path, resolvedPath, originalFileName) {
            var redirect = Object.create(redirectTarget);
            redirect.fileName = fileName;
            redirect.path = path;
            redirect.resolvedPath = resolvedPath;
            redirect.originalFileName = originalFileName;
            redirect.redirectInfo = { redirectTarget: redirectTarget, unredirected: unredirected };
            sourceFilesFoundSearchingNodeModules.set(path, currentNodeModulesDepth > 0);
            Object.defineProperties(redirect, {
                id: {
                    get: function () { return this.redirectInfo.redirectTarget.id; },
                    set: function (value) { this.redirectInfo.redirectTarget.id = value; },
                },
                symbol: {
                    get: function () { return this.redirectInfo.redirectTarget.symbol; },
                    set: function (value) { this.redirectInfo.redirectTarget.symbol = value; },
                },
            });
            return redirect;
        }
        function findSourceFile(fileName, path, isDefaultLib, ignoreNoDefaultLib, refFile, packageId) {
            if (useSourceOfProjectReferenceRedirect) {
                var source = getSourceOfProjectReferenceRedirect(fileName);
                if (!source &&
                    host.realpath &&
                    options.preserveSymlinks &&
                    ts.isDeclarationFileName(fileName) &&
                    ts.stringContains(fileName, ts.nodeModulesPathPart)) {
                    var realPath = host.realpath(fileName);
                    if (realPath !== fileName)
                        source = getSourceOfProjectReferenceRedirect(realPath);
                }
                if (source) {
                    var file_1 = ts.isString(source) ?
                        findSourceFile(source, toPath(source), isDefaultLib, ignoreNoDefaultLib, refFile, packageId) :
                        undefined;
                    if (file_1)
                        addFileToFilesByName(file_1, path, undefined);
                    return file_1;
                }
            }
            var originalFileName = fileName;
            if (filesByName.has(path)) {
                var file_2 = filesByName.get(path);
                addFileToRefFileMap(fileName, file_2 || undefined, refFile);
                if (file_2 && options.forceConsistentCasingInFileNames) {
                    var checkedName = file_2.fileName;
                    var isRedirect = toPath(checkedName) !== toPath(fileName);
                    if (isRedirect) {
                        fileName = getProjectReferenceRedirect(fileName) || fileName;
                    }
                    var checkedAbsolutePath = ts.getNormalizedAbsolutePathWithoutRoot(checkedName, currentDirectory);
                    var inputAbsolutePath = ts.getNormalizedAbsolutePathWithoutRoot(fileName, currentDirectory);
                    if (checkedAbsolutePath !== inputAbsolutePath) {
                        reportFileNamesDifferOnlyInCasingError(fileName, file_2, refFile);
                    }
                }
                if (file_2 && sourceFilesFoundSearchingNodeModules.get(file_2.path) && currentNodeModulesDepth === 0) {
                    sourceFilesFoundSearchingNodeModules.set(file_2.path, false);
                    if (!options.noResolve) {
                        processReferencedFiles(file_2, isDefaultLib);
                        processTypeReferenceDirectives(file_2);
                    }
                    if (!options.noLib) {
                        processLibReferenceDirectives(file_2);
                    }
                    modulesWithElidedImports.set(file_2.path, false);
                    processImportedModules(file_2);
                }
                else if (file_2 && modulesWithElidedImports.get(file_2.path)) {
                    if (currentNodeModulesDepth < maxNodeModuleJsDepth) {
                        modulesWithElidedImports.set(file_2.path, false);
                        processImportedModules(file_2);
                    }
                }
                return file_2 || undefined;
            }
            var redirectedPath;
            if (refFile && !useSourceOfProjectReferenceRedirect) {
                var redirectProject = getProjectReferenceRedirectProject(fileName);
                if (redirectProject) {
                    if (redirectProject.commandLine.options.outFile || redirectProject.commandLine.options.out) {
                        return undefined;
                    }
                    var redirect = getProjectReferenceOutputName(redirectProject, fileName);
                    fileName = redirect;
                    redirectedPath = toPath(redirect);
                }
            }
            var file = host.getSourceFile(fileName, options.target, function (hostErrorMessage) { return fileProcessingDiagnostics.add(createRefFileDiagnostic(refFile, ts.Diagnostics.Cannot_read_file_0_Colon_1, fileName, hostErrorMessage)); }, shouldCreateNewSourceFile);
            if (packageId) {
                var packageIdKey = ts.packageIdToString(packageId);
                var fileFromPackageId = packageIdToSourceFile.get(packageIdKey);
                if (fileFromPackageId) {
                    var dupFile = createRedirectSourceFile(fileFromPackageId, file, fileName, path, toPath(fileName), originalFileName);
                    redirectTargetsMap.add(fileFromPackageId.path, fileName);
                    addFileToFilesByName(dupFile, path, redirectedPath);
                    sourceFileToPackageName.set(path, packageId.name);
                    processingOtherFiles.push(dupFile);
                    return dupFile;
                }
                else if (file) {
                    packageIdToSourceFile.set(packageIdKey, file);
                    sourceFileToPackageName.set(path, packageId.name);
                }
            }
            addFileToFilesByName(file, path, redirectedPath);
            if (file) {
                sourceFilesFoundSearchingNodeModules.set(path, currentNodeModulesDepth > 0);
                file.fileName = fileName;
                file.path = path;
                file.resolvedPath = toPath(fileName);
                file.originalFileName = originalFileName;
                addFileToRefFileMap(fileName, file, refFile);
                if (host.useCaseSensitiveFileNames()) {
                    var pathLowerCase = ts.toFileNameLowerCase(path);
                    var existingFile = filesByNameIgnoreCase.get(pathLowerCase);
                    if (existingFile) {
                        reportFileNamesDifferOnlyInCasingError(fileName, existingFile, refFile);
                    }
                    else {
                        filesByNameIgnoreCase.set(pathLowerCase, file);
                    }
                }
                skipDefaultLib = skipDefaultLib || (file.hasNoDefaultLib && !ignoreNoDefaultLib);
                if (!options.noResolve) {
                    processReferencedFiles(file, isDefaultLib);
                    processTypeReferenceDirectives(file);
                }
                if (!options.noLib) {
                    processLibReferenceDirectives(file);
                }
                processImportedModules(file);
                if (isDefaultLib) {
                    processingDefaultLibFiles.push(file);
                }
                else {
                    processingOtherFiles.push(file);
                }
            }
            return file;
        }
        function addFileToRefFileMap(referencedFileName, file, refFile) {
            if (refFile && file) {
                (refFileMap || (refFileMap = ts.createMultiMap())).add(file.path, {
                    referencedFileName: referencedFileName,
                    kind: refFile.kind,
                    index: refFile.index,
                    file: refFile.file.path
                });
            }
        }
        function addFileToFilesByName(file, path, redirectedPath) {
            if (redirectedPath) {
                filesByName.set(redirectedPath, file);
                filesByName.set(path, file || false);
            }
            else {
                filesByName.set(path, file);
            }
        }
        function getProjectReferenceRedirect(fileName) {
            var referencedProject = getProjectReferenceRedirectProject(fileName);
            return referencedProject && getProjectReferenceOutputName(referencedProject, fileName);
        }
        function getProjectReferenceRedirectProject(fileName) {
            if (!resolvedProjectReferences || !resolvedProjectReferences.length || ts.fileExtensionIs(fileName, ".d.ts") || ts.fileExtensionIs(fileName, ".json")) {
                return undefined;
            }
            return getResolvedProjectReferenceToRedirect(fileName);
        }
        function getProjectReferenceOutputName(referencedProject, fileName) {
            var out = referencedProject.commandLine.options.outFile || referencedProject.commandLine.options.out;
            return out ?
                ts.changeExtension(out, ".d.ts") :
                ts.getOutputDeclarationFileName(fileName, referencedProject.commandLine, !host.useCaseSensitiveFileNames());
        }
        function getResolvedProjectReferenceToRedirect(fileName) {
            if (mapFromFileToProjectReferenceRedirects === undefined) {
                mapFromFileToProjectReferenceRedirects = ts.createMap();
                forEachResolvedProjectReference(function (referencedProject, referenceProjectPath) {
                    if (referencedProject &&
                        toPath(options.configFilePath) !== referenceProjectPath) {
                        referencedProject.commandLine.fileNames.forEach(function (f) {
                            return mapFromFileToProjectReferenceRedirects.set(toPath(f), referenceProjectPath);
                        });
                    }
                });
            }
            var referencedProjectPath = mapFromFileToProjectReferenceRedirects.get(toPath(fileName));
            return referencedProjectPath && getResolvedProjectReferenceByPath(referencedProjectPath);
        }
        function forEachResolvedProjectReference(cb) {
            return forEachProjectReference(projectReferences, resolvedProjectReferences, function (resolvedRef, index, parent) {
                var ref = (parent ? parent.commandLine.projectReferences : projectReferences)[index];
                var resolvedRefPath = toPath(resolveProjectReferencePath(ref));
                return cb(resolvedRef, resolvedRefPath);
            });
        }
        function getSourceOfProjectReferenceRedirect(file) {
            if (!ts.isDeclarationFileName(file))
                return undefined;
            if (mapFromToProjectReferenceRedirectSource === undefined) {
                mapFromToProjectReferenceRedirectSource = ts.createMap();
                forEachResolvedProjectReference(function (resolvedRef) {
                    if (resolvedRef) {
                        var out = resolvedRef.commandLine.options.outFile || resolvedRef.commandLine.options.out;
                        if (out) {
                            var outputDts = ts.changeExtension(out, ".d.ts");
                            mapFromToProjectReferenceRedirectSource.set(toPath(outputDts), true);
                        }
                        else {
                            ts.forEach(resolvedRef.commandLine.fileNames, function (fileName) {
                                if (!ts.fileExtensionIs(fileName, ".d.ts") && !ts.fileExtensionIs(fileName, ".json")) {
                                    var outputDts = ts.getOutputDeclarationFileName(fileName, resolvedRef.commandLine, host.useCaseSensitiveFileNames());
                                    mapFromToProjectReferenceRedirectSource.set(toPath(outputDts), fileName);
                                }
                            });
                        }
                    }
                });
            }
            return mapFromToProjectReferenceRedirectSource.get(toPath(file));
        }
        function isSourceOfProjectReferenceRedirect(fileName) {
            return useSourceOfProjectReferenceRedirect && !!getResolvedProjectReferenceToRedirect(fileName);
        }
        function forEachProjectReference(projectReferences, resolvedProjectReferences, cbResolvedRef, cbRef) {
            var seenResolvedRefs;
            return worker(projectReferences, resolvedProjectReferences, undefined, cbResolvedRef, cbRef);
            function worker(projectReferences, resolvedProjectReferences, parent, cbResolvedRef, cbRef) {
                if (cbRef) {
                    var result = cbRef(projectReferences, parent);
                    if (result) {
                        return result;
                    }
                }
                return ts.forEach(resolvedProjectReferences, function (resolvedRef, index) {
                    if (ts.contains(seenResolvedRefs, resolvedRef)) {
                        return undefined;
                    }
                    var result = cbResolvedRef(resolvedRef, index, parent);
                    if (result) {
                        return result;
                    }
                    if (!resolvedRef)
                        return undefined;
                    (seenResolvedRefs || (seenResolvedRefs = [])).push(resolvedRef);
                    return worker(resolvedRef.commandLine.projectReferences, resolvedRef.references, resolvedRef, cbResolvedRef, cbRef);
                });
            }
        }
        function getResolvedProjectReferenceByPath(projectReferencePath) {
            if (!projectReferenceRedirects) {
                return undefined;
            }
            return projectReferenceRedirects.get(projectReferencePath) || undefined;
        }
        function processReferencedFiles(file, isDefaultLib) {
            ts.forEach(file.referencedFiles, function (ref, index) {
                var referencedFileName = resolveTripleslashReference(ref.fileName, file.originalFileName);
                processSourceFile(referencedFileName, isDefaultLib, false, undefined, {
                    kind: ts.RefFileKind.ReferenceFile,
                    index: index,
                    file: file,
                    pos: ref.pos,
                    end: ref.end
                });
            });
        }
        function processTypeReferenceDirectives(file) {
            var typeDirectives = ts.map(file.typeReferenceDirectives, function (ref) { return ts.toFileNameLowerCase(ref.fileName); });
            if (!typeDirectives) {
                return;
            }
            var resolutions = resolveTypeReferenceDirectiveNamesWorker(typeDirectives, file.originalFileName, getResolvedProjectReferenceToRedirect(file.originalFileName));
            for (var i = 0; i < typeDirectives.length; i++) {
                var ref = file.typeReferenceDirectives[i];
                var resolvedTypeReferenceDirective = resolutions[i];
                var fileName = ts.toFileNameLowerCase(ref.fileName);
                ts.setResolvedTypeReferenceDirective(file, fileName, resolvedTypeReferenceDirective);
                processTypeReferenceDirective(fileName, resolvedTypeReferenceDirective, {
                    kind: ts.RefFileKind.TypeReferenceDirective,
                    index: i,
                    file: file,
                    pos: ref.pos,
                    end: ref.end
                });
            }
        }
        function processTypeReferenceDirective(typeReferenceDirective, resolvedTypeReferenceDirective, refFile) {
            var previousResolution = resolvedTypeReferenceDirectives.get(typeReferenceDirective);
            if (previousResolution && previousResolution.primary) {
                return;
            }
            var saveResolution = true;
            if (resolvedTypeReferenceDirective) {
                if (resolvedTypeReferenceDirective.isExternalLibraryImport)
                    currentNodeModulesDepth++;
                if (resolvedTypeReferenceDirective.primary) {
                    processSourceFile(resolvedTypeReferenceDirective.resolvedFileName, false, false, resolvedTypeReferenceDirective.packageId, refFile);
                }
                else {
                    if (previousResolution) {
                        if (resolvedTypeReferenceDirective.resolvedFileName !== previousResolution.resolvedFileName) {
                            var otherFileText = host.readFile(resolvedTypeReferenceDirective.resolvedFileName);
                            var existingFile_1 = getSourceFile(previousResolution.resolvedFileName);
                            if (otherFileText !== existingFile_1.text) {
                                var refs = !refFile ? refFileMap && refFileMap.get(existingFile_1.path) : undefined;
                                var refToReportErrorOn = refs && ts.find(refs, function (ref) { return ref.referencedFileName === existingFile_1.fileName; });
                                fileProcessingDiagnostics.add(refToReportErrorOn ?
                                    createFileDiagnosticAtReference(refToReportErrorOn, ts.Diagnostics.Conflicting_definitions_for_0_found_at_1_and_2_Consider_installing_a_specific_version_of_this_library_to_resolve_the_conflict, typeReferenceDirective, resolvedTypeReferenceDirective.resolvedFileName, previousResolution.resolvedFileName) :
                                    createRefFileDiagnostic(refFile, ts.Diagnostics.Conflicting_definitions_for_0_found_at_1_and_2_Consider_installing_a_specific_version_of_this_library_to_resolve_the_conflict, typeReferenceDirective, resolvedTypeReferenceDirective.resolvedFileName, previousResolution.resolvedFileName));
                            }
                        }
                        saveResolution = false;
                    }
                    else {
                        processSourceFile(resolvedTypeReferenceDirective.resolvedFileName, false, false, resolvedTypeReferenceDirective.packageId, refFile);
                    }
                }
                if (resolvedTypeReferenceDirective.isExternalLibraryImport)
                    currentNodeModulesDepth--;
            }
            else {
                fileProcessingDiagnostics.add(createRefFileDiagnostic(refFile, ts.Diagnostics.Cannot_find_type_definition_file_for_0, typeReferenceDirective));
            }
            if (saveResolution) {
                resolvedTypeReferenceDirectives.set(typeReferenceDirective, resolvedTypeReferenceDirective);
            }
        }
        function processLibReferenceDirectives(file) {
            ts.forEach(file.libReferenceDirectives, function (libReference) {
                var libName = ts.toFileNameLowerCase(libReference.fileName);
                var libFileName = ts.libMap.get(libName);
                if (libFileName) {
                    processRootFile(ts.combinePaths(defaultLibraryPath, libFileName), true, true);
                }
                else {
                    var unqualifiedLibName = ts.removeSuffix(ts.removePrefix(libName, "lib."), ".d.ts");
                    var suggestion = ts.getSpellingSuggestion(unqualifiedLibName, ts.libs, ts.identity);
                    var message = suggestion ? ts.Diagnostics.Cannot_find_lib_definition_for_0_Did_you_mean_1 : ts.Diagnostics.Cannot_find_lib_definition_for_0;
                    fileProcessingDiagnostics.add(ts.createFileDiagnostic(file, libReference.pos, libReference.end - libReference.pos, message, libName, suggestion));
                }
            });
        }
        function createRefFileDiagnostic(refFile, message) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (!refFile) {
                return ts.createCompilerDiagnostic.apply(void 0, __spreadArrays([message], args));
            }
            else {
                return ts.createFileDiagnostic.apply(void 0, __spreadArrays([refFile.file, refFile.pos, refFile.end - refFile.pos, message], args));
            }
        }
        function getCanonicalFileName(fileName) {
            return host.getCanonicalFileName(fileName);
        }
        function processImportedModules(file) {
            collectExternalModuleReferences(file);
            if (file.imports.length || file.moduleAugmentations.length) {
                var moduleNames = getModuleNames(file);
                var resolutions = resolveModuleNamesReusingOldState(moduleNames, ts.getNormalizedAbsolutePath(file.originalFileName, currentDirectory), file);
                ts.Debug.assert(resolutions.length === moduleNames.length);
                for (var i = 0; i < moduleNames.length; i++) {
                    var resolution = resolutions[i];
                    ts.setResolvedModule(file, moduleNames[i], resolution);
                    if (!resolution) {
                        continue;
                    }
                    var isFromNodeModulesSearch = resolution.isExternalLibraryImport;
                    var isJsFile = !ts.resolutionExtensionIsTSOrJson(resolution.extension);
                    var isJsFileFromNodeModules = isFromNodeModulesSearch && isJsFile;
                    var resolvedFileName = resolution.resolvedFileName;
                    if (isFromNodeModulesSearch) {
                        currentNodeModulesDepth++;
                    }
                    var elideImport = isJsFileFromNodeModules && currentNodeModulesDepth > maxNodeModuleJsDepth;
                    var shouldAddFile = resolvedFileName
                        && !getResolutionDiagnostic(options, resolution)
                        && !options.noResolve
                        && i < file.imports.length
                        && !elideImport
                        && !(isJsFile && !options.allowJs)
                        && (ts.isInJSFile(file.imports[i]) || !(file.imports[i].flags & 4194304));
                    if (elideImport) {
                        modulesWithElidedImports.set(file.path, true);
                    }
                    else if (shouldAddFile) {
                        var path = toPath(resolvedFileName);
                        var pos = ts.skipTrivia(file.text, file.imports[i].pos);
                        findSourceFile(resolvedFileName, path, false, false, {
                            kind: ts.RefFileKind.Import,
                            index: i,
                            file: file,
                            pos: pos,
                            end: file.imports[i].end
                        }, resolution.packageId);
                    }
                    if (isFromNodeModulesSearch) {
                        currentNodeModulesDepth--;
                    }
                }
            }
            else {
                file.resolvedModules = undefined;
            }
        }
        function computeCommonSourceDirectory(sourceFiles) {
            var fileNames = ts.mapDefined(sourceFiles, function (file) { return file.isDeclarationFile ? undefined : file.fileName; });
            return computeCommonSourceDirectoryOfFilenames(fileNames, currentDirectory, getCanonicalFileName);
        }
        function checkSourceFilesBelongToPath(sourceFiles, rootDirectory) {
            var allFilesBelongToPath = true;
            var absoluteRootDirectoryPath = host.getCanonicalFileName(ts.getNormalizedAbsolutePath(rootDirectory, currentDirectory));
            var rootPaths;
            for (var _i = 0, sourceFiles_2 = sourceFiles; _i < sourceFiles_2.length; _i++) {
                var sourceFile = sourceFiles_2[_i];
                if (!sourceFile.isDeclarationFile) {
                    var absoluteSourceFilePath = host.getCanonicalFileName(ts.getNormalizedAbsolutePath(sourceFile.fileName, currentDirectory));
                    if (absoluteSourceFilePath.indexOf(absoluteRootDirectoryPath) !== 0) {
                        if (!rootPaths)
                            rootPaths = ts.arrayToSet(rootNames, toPath);
                        addProgramDiagnosticAtRefPath(sourceFile, rootPaths, ts.Diagnostics.File_0_is_not_under_rootDir_1_rootDir_is_expected_to_contain_all_source_files, sourceFile.fileName, rootDirectory);
                        allFilesBelongToPath = false;
                    }
                }
            }
            return allFilesBelongToPath;
        }
        function parseProjectReferenceConfigFile(ref) {
            if (!projectReferenceRedirects) {
                projectReferenceRedirects = ts.createMap();
            }
            var refPath = resolveProjectReferencePath(ref);
            var sourceFilePath = toPath(refPath);
            var fromCache = projectReferenceRedirects.get(sourceFilePath);
            if (fromCache !== undefined) {
                return fromCache || undefined;
            }
            var commandLine;
            var sourceFile;
            if (host.getParsedCommandLine) {
                commandLine = host.getParsedCommandLine(refPath);
                if (!commandLine) {
                    addFileToFilesByName(undefined, sourceFilePath, undefined);
                    projectReferenceRedirects.set(sourceFilePath, false);
                    return undefined;
                }
                sourceFile = ts.Debug.checkDefined(commandLine.options.configFile);
                ts.Debug.assert(!sourceFile.path || sourceFile.path === sourceFilePath);
                addFileToFilesByName(sourceFile, sourceFilePath, undefined);
            }
            else {
                var basePath = ts.getNormalizedAbsolutePath(ts.getDirectoryPath(refPath), host.getCurrentDirectory());
                sourceFile = host.getSourceFile(refPath, 100);
                addFileToFilesByName(sourceFile, sourceFilePath, undefined);
                if (sourceFile === undefined) {
                    projectReferenceRedirects.set(sourceFilePath, false);
                    return undefined;
                }
                commandLine = ts.parseJsonSourceFileConfigFileContent(sourceFile, configParsingHost, basePath, undefined, refPath);
            }
            sourceFile.fileName = refPath;
            sourceFile.path = sourceFilePath;
            sourceFile.resolvedPath = sourceFilePath;
            sourceFile.originalFileName = refPath;
            var resolvedRef = { commandLine: commandLine, sourceFile: sourceFile };
            projectReferenceRedirects.set(sourceFilePath, resolvedRef);
            if (commandLine.projectReferences) {
                resolvedRef.references = commandLine.projectReferences.map(parseProjectReferenceConfigFile);
            }
            return resolvedRef;
        }
        function verifyCompilerOptions() {
            if (options.strictPropertyInitialization && !ts.getStrictOptionValue(options, "strictNullChecks")) {
                createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_without_specifying_option_1, "strictPropertyInitialization", "strictNullChecks");
            }
            if (options.isolatedModules) {
                if (options.out) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "out", "isolatedModules");
                }
                if (options.outFile) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "outFile", "isolatedModules");
                }
            }
            if (options.inlineSourceMap) {
                if (options.sourceMap) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "sourceMap", "inlineSourceMap");
                }
                if (options.mapRoot) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "mapRoot", "inlineSourceMap");
                }
            }
            if (options.paths && options.baseUrl === undefined) {
                createDiagnosticForOptionName(ts.Diagnostics.Option_paths_cannot_be_used_without_specifying_baseUrl_option, "paths");
            }
            if (options.composite) {
                if (options.declaration === false) {
                    createDiagnosticForOptionName(ts.Diagnostics.Composite_projects_may_not_disable_declaration_emit, "declaration");
                }
                if (options.incremental === false) {
                    createDiagnosticForOptionName(ts.Diagnostics.Composite_projects_may_not_disable_incremental_compilation, "declaration");
                }
            }
            if (options.tsBuildInfoFile) {
                if (!ts.isIncrementalCompilation(options)) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_without_specifying_option_1_or_option_2, "tsBuildInfoFile", "incremental", "composite");
                }
            }
            else if (options.incremental && !options.outFile && !options.out && !options.configFilePath) {
                programDiagnostics.add(ts.createCompilerDiagnostic(ts.Diagnostics.Option_incremental_can_only_be_specified_using_tsconfig_emitting_to_single_file_or_when_option_tsBuildInfoFile_is_specified));
            }
            if (!options.listFilesOnly && options.noEmit && ts.isIncrementalCompilation(options)) {
                createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "noEmit", options.incremental ? "incremental" : "composite");
            }
            verifyProjectReferences();
            if (options.composite) {
                var rootPaths = ts.arrayToSet(rootNames, toPath);
                for (var _i = 0, files_3 = files; _i < files_3.length; _i++) {
                    var file = files_3[_i];
                    if (ts.sourceFileMayBeEmitted(file, program) && !rootPaths.has(file.path)) {
                        addProgramDiagnosticAtRefPath(file, rootPaths, ts.Diagnostics.File_0_is_not_listed_within_the_file_list_of_project_1_Projects_must_list_all_files_or_use_an_include_pattern, file.fileName, options.configFilePath || "");
                    }
                }
            }
            if (options.paths) {
                for (var key in options.paths) {
                    if (!ts.hasProperty(options.paths, key)) {
                        continue;
                    }
                    if (!ts.hasZeroOrOneAsteriskCharacter(key)) {
                        createDiagnosticForOptionPaths(true, key, ts.Diagnostics.Pattern_0_can_have_at_most_one_Asterisk_character, key);
                    }
                    if (ts.isArray(options.paths[key])) {
                        var len = options.paths[key].length;
                        if (len === 0) {
                            createDiagnosticForOptionPaths(false, key, ts.Diagnostics.Substitutions_for_pattern_0_shouldn_t_be_an_empty_array, key);
                        }
                        for (var i = 0; i < len; i++) {
                            var subst = options.paths[key][i];
                            var typeOfSubst = typeof subst;
                            if (typeOfSubst === "string") {
                                if (!ts.hasZeroOrOneAsteriskCharacter(subst)) {
                                    createDiagnosticForOptionPathKeyValue(key, i, ts.Diagnostics.Substitution_0_in_pattern_1_can_have_at_most_one_Asterisk_character, subst, key);
                                }
                            }
                            else {
                                createDiagnosticForOptionPathKeyValue(key, i, ts.Diagnostics.Substitution_0_for_pattern_1_has_incorrect_type_expected_string_got_2, subst, key, typeOfSubst);
                            }
                        }
                    }
                    else {
                        createDiagnosticForOptionPaths(false, key, ts.Diagnostics.Substitutions_for_pattern_0_should_be_an_array, key);
                    }
                }
            }
            if (!options.sourceMap && !options.inlineSourceMap) {
                if (options.inlineSources) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_can_only_be_used_when_either_option_inlineSourceMap_or_option_sourceMap_is_provided, "inlineSources");
                }
                if (options.sourceRoot) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_can_only_be_used_when_either_option_inlineSourceMap_or_option_sourceMap_is_provided, "sourceRoot");
                }
            }
            if (options.out && options.outFile) {
                createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "out", "outFile");
            }
            if (options.mapRoot && !(options.sourceMap || options.declarationMap)) {
                createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_without_specifying_option_1_or_option_2, "mapRoot", "sourceMap", "declarationMap");
            }
            if (options.declarationDir) {
                if (!ts.getEmitDeclarations(options)) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_without_specifying_option_1_or_option_2, "declarationDir", "declaration", "composite");
                }
                if (options.out || options.outFile) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "declarationDir", options.out ? "out" : "outFile");
                }
            }
            if (options.declarationMap && !ts.getEmitDeclarations(options)) {
                createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_without_specifying_option_1_or_option_2, "declarationMap", "declaration", "composite");
            }
            if (options.lib && options.noLib) {
                createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "lib", "noLib");
            }
            if (options.noImplicitUseStrict && ts.getStrictOptionValue(options, "alwaysStrict")) {
                createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "noImplicitUseStrict", "alwaysStrict");
            }
            var languageVersion = options.target || 0;
            var outFile = options.outFile || options.out;
            var firstNonAmbientExternalModuleSourceFile = ts.find(files, function (f) { return ts.isExternalModule(f) && !f.isDeclarationFile; });
            if (options.isolatedModules) {
                if (options.module === ts.ModuleKind.None && languageVersion < 2) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_isolatedModules_can_only_be_used_when_either_option_module_is_provided_or_option_target_is_ES2015_or_higher, "isolatedModules", "target");
                }
                var firstNonExternalModuleSourceFile = ts.find(files, function (f) { return !ts.isExternalModule(f) && !ts.isSourceFileJS(f) && !f.isDeclarationFile && f.scriptKind !== 6; });
                if (firstNonExternalModuleSourceFile) {
                    var span = ts.getErrorSpanForNode(firstNonExternalModuleSourceFile, firstNonExternalModuleSourceFile);
                    programDiagnostics.add(ts.createFileDiagnostic(firstNonExternalModuleSourceFile, span.start, span.length, ts.Diagnostics.All_files_must_be_modules_when_the_isolatedModules_flag_is_provided));
                }
            }
            else if (firstNonAmbientExternalModuleSourceFile && languageVersion < 2 && options.module === ts.ModuleKind.None) {
                var span = ts.getErrorSpanForNode(firstNonAmbientExternalModuleSourceFile, firstNonAmbientExternalModuleSourceFile.externalModuleIndicator);
                programDiagnostics.add(ts.createFileDiagnostic(firstNonAmbientExternalModuleSourceFile, span.start, span.length, ts.Diagnostics.Cannot_use_imports_exports_or_module_augmentations_when_module_is_none));
            }
            if (outFile && !options.emitDeclarationOnly) {
                if (options.module && !(options.module === ts.ModuleKind.AMD || options.module === ts.ModuleKind.System)) {
                    createDiagnosticForOptionName(ts.Diagnostics.Only_amd_and_system_modules_are_supported_alongside_0, options.out ? "out" : "outFile", "module");
                }
                else if (options.module === undefined && firstNonAmbientExternalModuleSourceFile) {
                    var span = ts.getErrorSpanForNode(firstNonAmbientExternalModuleSourceFile, firstNonAmbientExternalModuleSourceFile.externalModuleIndicator);
                    programDiagnostics.add(ts.createFileDiagnostic(firstNonAmbientExternalModuleSourceFile, span.start, span.length, ts.Diagnostics.Cannot_compile_modules_using_option_0_unless_the_module_flag_is_amd_or_system, options.out ? "out" : "outFile"));
                }
            }
            if (options.resolveJsonModule) {
                if (ts.getEmitModuleResolutionKind(options) !== ts.ModuleResolutionKind.NodeJs) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_resolveJsonModule_cannot_be_specified_without_node_module_resolution_strategy, "resolveJsonModule");
                }
                else if (!ts.hasJsonModuleEmitEnabled(options)) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_resolveJsonModule_can_only_be_specified_when_module_code_generation_is_commonjs_amd_es2015_or_esNext, "resolveJsonModule", "module");
                }
            }
            if (options.outDir ||
                options.sourceRoot ||
                options.mapRoot) {
                var dir = getCommonSourceDirectory();
                if (options.outDir && dir === "" && files.some(function (file) { return ts.getRootLength(file.fileName) > 1; })) {
                    createDiagnosticForOptionName(ts.Diagnostics.Cannot_find_the_common_subdirectory_path_for_the_input_files, "outDir");
                }
            }
            if (options.useDefineForClassFields && languageVersion === 0) {
                createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_when_option_target_is_ES3, "useDefineForClassFields");
            }
            if (options.checkJs && !options.allowJs) {
                programDiagnostics.add(ts.createCompilerDiagnostic(ts.Diagnostics.Option_0_cannot_be_specified_without_specifying_option_1, "checkJs", "allowJs"));
            }
            if (options.emitDeclarationOnly) {
                if (!ts.getEmitDeclarations(options)) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_without_specifying_option_1_or_option_2, "emitDeclarationOnly", "declaration", "composite");
                }
                if (options.noEmit) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "emitDeclarationOnly", "noEmit");
                }
            }
            if (options.emitDecoratorMetadata &&
                !options.experimentalDecorators) {
                createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_without_specifying_option_1, "emitDecoratorMetadata", "experimentalDecorators");
            }
            if (options.jsxFactory) {
                if (options.reactNamespace) {
                    createDiagnosticForOptionName(ts.Diagnostics.Option_0_cannot_be_specified_with_option_1, "reactNamespace", "jsxFactory");
                }
                if (!ts.parseIsolatedEntityName(options.jsxFactory, languageVersion)) {
                    createOptionValueDiagnostic("jsxFactory", ts.Diagnostics.Invalid_value_for_jsxFactory_0_is_not_a_valid_identifier_or_qualified_name, options.jsxFactory);
                }
            }
            else if (options.reactNamespace && !ts.isIdentifierText(options.reactNamespace, languageVersion)) {
                createOptionValueDiagnostic("reactNamespace", ts.Diagnostics.Invalid_value_for_reactNamespace_0_is_not_a_valid_identifier, options.reactNamespace);
            }
            if (!options.noEmit && !options.suppressOutputPathCheck) {
                var emitHost = getEmitHost();
                var emitFilesSeen_1 = ts.createMap();
                ts.forEachEmittedFile(emitHost, function (emitFileNames) {
                    if (!options.emitDeclarationOnly) {
                        verifyEmitFilePath(emitFileNames.jsFilePath, emitFilesSeen_1);
                    }
                    verifyEmitFilePath(emitFileNames.declarationFilePath, emitFilesSeen_1);
                });
            }
            function verifyEmitFilePath(emitFileName, emitFilesSeen) {
                if (emitFileName) {
                    var emitFilePath = toPath(emitFileName);
                    if (filesByName.has(emitFilePath)) {
                        var chain = void 0;
                        if (!options.configFilePath) {
                            chain = ts.chainDiagnosticMessages(undefined, ts.Diagnostics.Adding_a_tsconfig_json_file_will_help_organize_projects_that_contain_both_TypeScript_and_JavaScript_files_Learn_more_at_https_Colon_Slash_Slashaka_ms_Slashtsconfig);
                        }
                        chain = ts.chainDiagnosticMessages(chain, ts.Diagnostics.Cannot_write_file_0_because_it_would_overwrite_input_file, emitFileName);
                        blockEmittingOfFile(emitFileName, ts.createCompilerDiagnosticFromMessageChain(chain));
                    }
                    var emitFileKey = !host.useCaseSensitiveFileNames() ? ts.toFileNameLowerCase(emitFilePath) : emitFilePath;
                    if (emitFilesSeen.has(emitFileKey)) {
                        blockEmittingOfFile(emitFileName, ts.createCompilerDiagnostic(ts.Diagnostics.Cannot_write_file_0_because_it_would_be_overwritten_by_multiple_input_files, emitFileName));
                    }
                    else {
                        emitFilesSeen.set(emitFileKey, true);
                    }
                }
            }
        }
        function createFileDiagnosticAtReference(refPathToReportErrorOn, message) {
            var _a, _b;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var refFile = ts.Debug.checkDefined(getSourceFileByPath(refPathToReportErrorOn.file));
            var kind = refPathToReportErrorOn.kind, index = refPathToReportErrorOn.index;
            var pos, end;
            switch (kind) {
                case ts.RefFileKind.Import:
                    pos = ts.skipTrivia(refFile.text, refFile.imports[index].pos);
                    end = refFile.imports[index].end;
                    break;
                case ts.RefFileKind.ReferenceFile:
                    (_a = refFile.referencedFiles[index], pos = _a.pos, end = _a.end);
                    break;
                case ts.RefFileKind.TypeReferenceDirective:
                    (_b = refFile.typeReferenceDirectives[index], pos = _b.pos, end = _b.end);
                    break;
                default:
                    return ts.Debug.assertNever(kind);
            }
            return ts.createFileDiagnostic.apply(void 0, __spreadArrays([refFile, pos, end - pos, message], args));
        }
        function addProgramDiagnosticAtRefPath(file, rootPaths, message) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var refPaths = refFileMap && refFileMap.get(file.path);
            var refPathToReportErrorOn = ts.forEach(refPaths, function (refPath) { return rootPaths.has(refPath.file) ? refPath : undefined; }) ||
                ts.elementAt(refPaths, 0);
            programDiagnostics.add(refPathToReportErrorOn ? createFileDiagnosticAtReference.apply(void 0, __spreadArrays([refPathToReportErrorOn, message], args)) : ts.createCompilerDiagnostic.apply(void 0, __spreadArrays([message], args)));
        }
        function verifyProjectReferences() {
            var buildInfoPath = !options.noEmit && !options.suppressOutputPathCheck ? ts.getTsBuildInfoEmitOutputFilePath(options) : undefined;
            forEachProjectReference(projectReferences, resolvedProjectReferences, function (resolvedRef, index, parent) {
                var ref = (parent ? parent.commandLine.projectReferences : projectReferences)[index];
                var parentFile = parent && parent.sourceFile;
                if (!resolvedRef) {
                    createDiagnosticForReference(parentFile, index, ts.Diagnostics.File_0_not_found, ref.path);
                    return;
                }
                var options = resolvedRef.commandLine.options;
                if (!options.composite) {
                    var inputs = parent ? parent.commandLine.fileNames : rootNames;
                    if (inputs.length) {
                        createDiagnosticForReference(parentFile, index, ts.Diagnostics.Referenced_project_0_must_have_setting_composite_Colon_true, ref.path);
                    }
                }
                if (ref.prepend) {
                    var out = options.outFile || options.out;
                    if (out) {
                        if (!host.fileExists(out)) {
                            createDiagnosticForReference(parentFile, index, ts.Diagnostics.Output_file_0_from_project_1_does_not_exist, out, ref.path);
                        }
                    }
                    else {
                        createDiagnosticForReference(parentFile, index, ts.Diagnostics.Cannot_prepend_project_0_because_it_does_not_have_outFile_set, ref.path);
                    }
                }
                if (!parent && buildInfoPath && buildInfoPath === ts.getTsBuildInfoEmitOutputFilePath(options)) {
                    createDiagnosticForReference(parentFile, index, ts.Diagnostics.Cannot_write_file_0_because_it_will_overwrite_tsbuildinfo_file_generated_by_referenced_project_1, buildInfoPath, ref.path);
                    hasEmitBlockingDiagnostics.set(toPath(buildInfoPath), true);
                }
            });
        }
        function createDiagnosticForOptionPathKeyValue(key, valueIndex, message, arg0, arg1, arg2) {
            var needCompilerDiagnostic = true;
            var pathsSyntax = getOptionPathsSyntax();
            for (var _i = 0, pathsSyntax_1 = pathsSyntax; _i < pathsSyntax_1.length; _i++) {
                var pathProp = pathsSyntax_1[_i];
                if (ts.isObjectLiteralExpression(pathProp.initializer)) {
                    for (var _a = 0, _b = ts.getPropertyAssignment(pathProp.initializer, key); _a < _b.length; _a++) {
                        var keyProps = _b[_a];
                        var initializer = keyProps.initializer;
                        if (ts.isArrayLiteralExpression(initializer) && initializer.elements.length > valueIndex) {
                            programDiagnostics.add(ts.createDiagnosticForNodeInSourceFile(options.configFile, initializer.elements[valueIndex], message, arg0, arg1, arg2));
                            needCompilerDiagnostic = false;
                        }
                    }
                }
            }
            if (needCompilerDiagnostic) {
                programDiagnostics.add(ts.createCompilerDiagnostic(message, arg0, arg1, arg2));
            }
        }
        function createDiagnosticForOptionPaths(onKey, key, message, arg0) {
            var needCompilerDiagnostic = true;
            var pathsSyntax = getOptionPathsSyntax();
            for (var _i = 0, pathsSyntax_2 = pathsSyntax; _i < pathsSyntax_2.length; _i++) {
                var pathProp = pathsSyntax_2[_i];
                if (ts.isObjectLiteralExpression(pathProp.initializer) &&
                    createOptionDiagnosticInObjectLiteralSyntax(pathProp.initializer, onKey, key, undefined, message, arg0)) {
                    needCompilerDiagnostic = false;
                }
            }
            if (needCompilerDiagnostic) {
                programDiagnostics.add(ts.createCompilerDiagnostic(message, arg0));
            }
        }
        function getOptionsSyntaxByName(name) {
            var compilerOptionsObjectLiteralSyntax = getCompilerOptionsObjectLiteralSyntax();
            if (compilerOptionsObjectLiteralSyntax) {
                return ts.getPropertyAssignment(compilerOptionsObjectLiteralSyntax, name);
            }
            return undefined;
        }
        function getOptionPathsSyntax() {
            return getOptionsSyntaxByName("paths") || ts.emptyArray;
        }
        function createDiagnosticForOptionName(message, option1, option2, option3) {
            createDiagnosticForOption(true, option1, option2, message, option1, option2, option3);
        }
        function createOptionValueDiagnostic(option1, message, arg0) {
            createDiagnosticForOption(false, option1, undefined, message, arg0);
        }
        function createDiagnosticForReference(sourceFile, index, message, arg0, arg1) {
            var referencesSyntax = ts.firstDefined(ts.getTsConfigPropArray(sourceFile || options.configFile, "references"), function (property) { return ts.isArrayLiteralExpression(property.initializer) ? property.initializer : undefined; });
            if (referencesSyntax && referencesSyntax.elements.length > index) {
                programDiagnostics.add(ts.createDiagnosticForNodeInSourceFile(sourceFile || options.configFile, referencesSyntax.elements[index], message, arg0, arg1));
            }
            else {
                programDiagnostics.add(ts.createCompilerDiagnostic(message, arg0, arg1));
            }
        }
        function createDiagnosticForOption(onKey, option1, option2, message, arg0, arg1, arg2) {
            var compilerOptionsObjectLiteralSyntax = getCompilerOptionsObjectLiteralSyntax();
            var needCompilerDiagnostic = !compilerOptionsObjectLiteralSyntax ||
                !createOptionDiagnosticInObjectLiteralSyntax(compilerOptionsObjectLiteralSyntax, onKey, option1, option2, message, arg0, arg1, arg2);
            if (needCompilerDiagnostic) {
                programDiagnostics.add(ts.createCompilerDiagnostic(message, arg0, arg1, arg2));
            }
        }
        function getCompilerOptionsObjectLiteralSyntax() {
            if (_compilerOptionsObjectLiteralSyntax === undefined) {
                _compilerOptionsObjectLiteralSyntax = null;
                var jsonObjectLiteral = ts.getTsConfigObjectLiteralExpression(options.configFile);
                if (jsonObjectLiteral) {
                    for (var _i = 0, _a = ts.getPropertyAssignment(jsonObjectLiteral, "compilerOptions"); _i < _a.length; _i++) {
                        var prop = _a[_i];
                        if (ts.isObjectLiteralExpression(prop.initializer)) {
                            _compilerOptionsObjectLiteralSyntax = prop.initializer;
                            break;
                        }
                    }
                }
            }
            return _compilerOptionsObjectLiteralSyntax;
        }
        function createOptionDiagnosticInObjectLiteralSyntax(objectLiteral, onKey, key1, key2, message, arg0, arg1, arg2) {
            var props = ts.getPropertyAssignment(objectLiteral, key1, key2);
            for (var _i = 0, props_3 = props; _i < props_3.length; _i++) {
                var prop = props_3[_i];
                programDiagnostics.add(ts.createDiagnosticForNodeInSourceFile(options.configFile, onKey ? prop.name : prop.initializer, message, arg0, arg1, arg2));
            }
            return !!props.length;
        }
        function blockEmittingOfFile(emitFileName, diag) {
            hasEmitBlockingDiagnostics.set(toPath(emitFileName), true);
            programDiagnostics.add(diag);
        }
        function isEmittedFile(file) {
            if (options.noEmit) {
                return false;
            }
            var filePath = toPath(file);
            if (getSourceFileByPath(filePath)) {
                return false;
            }
            var out = options.outFile || options.out;
            if (out) {
                return isSameFile(filePath, out) || isSameFile(filePath, ts.removeFileExtension(out) + ".d.ts");
            }
            if (options.declarationDir && ts.containsPath(options.declarationDir, filePath, currentDirectory, !host.useCaseSensitiveFileNames())) {
                return true;
            }
            if (options.outDir) {
                return ts.containsPath(options.outDir, filePath, currentDirectory, !host.useCaseSensitiveFileNames());
            }
            if (ts.fileExtensionIsOneOf(filePath, ts.supportedJSExtensions) || ts.fileExtensionIs(filePath, ".d.ts")) {
                var filePathWithoutExtension = ts.removeFileExtension(filePath);
                return !!getSourceFileByPath((filePathWithoutExtension + ".ts")) ||
                    !!getSourceFileByPath((filePathWithoutExtension + ".tsx"));
            }
            return false;
        }
        function isSameFile(file1, file2) {
            return ts.comparePaths(file1, file2, currentDirectory, !host.useCaseSensitiveFileNames()) === 0;
        }
        function getProbableSymlinks() {
            if (host.getSymlinks) {
                return host.getSymlinks();
            }
            return symlinks || (symlinks = ts.discoverProbableSymlinks(files, getCanonicalFileName, host.getCurrentDirectory()));
        }
    }
