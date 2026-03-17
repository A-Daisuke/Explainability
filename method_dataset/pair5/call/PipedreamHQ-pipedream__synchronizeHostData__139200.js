        function synchronizeHostData() {
            var _a;
            ts.Debug.assert(!syntaxOnly);
            // perform fast check if host supports it
            if (host.getProjectVersion) {
                var hostProjectVersion = host.getProjectVersion();
                if (hostProjectVersion) {
                    if (lastProjectVersion === hostProjectVersion && !host.hasChangedAutomaticTypeDirectiveNames) {
                        return;
                    }
                    lastProjectVersion = hostProjectVersion;
                }
            }
            var typeRootsVersion = host.getTypeRootsVersion ? host.getTypeRootsVersion() : 0;
            if (lastTypesRootVersion !== typeRootsVersion) {
                log("TypeRoots version has changed; provide new program");
                program = undefined; // TODO: GH#18217
                lastTypesRootVersion = typeRootsVersion;
            }
            // Get a fresh cache of the host information
            var hostCache = new HostCache(host, getCanonicalFileName);
            var rootFileNames = hostCache.getRootFileNames();
            var hasInvalidatedResolution = host.hasInvalidatedResolution || ts.returnFalse;
            var projectReferences = hostCache.getProjectReferences();
            // If the program is already up-to-date, we can reuse it
            if (ts.isProgramUptoDate(program, rootFileNames, hostCache.compilationSettings(), function (_path, fileName) { return host.getScriptVersion(fileName); }, fileExists, hasInvalidatedResolution, !!host.hasChangedAutomaticTypeDirectiveNames, projectReferences)) {
                return;
            }
            // IMPORTANT - It is critical from this moment onward that we do not check
            // cancellation tokens.  We are about to mutate source files from a previous program
            // instance.  If we cancel midway through, we may end up in an inconsistent state where
            // the program points to old source files that have been invalidated because of
            // incremental parsing.
            var newSettings = hostCache.compilationSettings();
            // Now create a new compiler
            var compilerHost = {
                getSourceFile: getOrCreateSourceFile,
                getSourceFileByPath: getOrCreateSourceFileByPath,
                getCancellationToken: function () { return cancellationToken; },
                getCanonicalFileName: getCanonicalFileName,
                useCaseSensitiveFileNames: function () { return useCaseSensitiveFileNames; },
                getNewLine: function () { return ts.getNewLineCharacter(newSettings, function () { return ts.getNewLineOrDefaultFromHost(host); }); },
                getDefaultLibFileName: function (options) { return host.getDefaultLibFileName(options); },
                writeFile: ts.noop,
                getCurrentDirectory: function () { return currentDirectory; },
                fileExists: fileExists,
                readFile: readFile,
                realpath: host.realpath && (function (path) { return host.realpath(path); }),
                directoryExists: function (directoryName) {
                    return ts.directoryProbablyExists(directoryName, host);
                },
                getDirectories: function (path) {
                    return host.getDirectories ? host.getDirectories(path) : [];
                },
                readDirectory: function (path, extensions, exclude, include, depth) {
                    ts.Debug.checkDefined(host.readDirectory, "'LanguageServiceHost.readDirectory' must be implemented to correctly process 'projectReferences'");
                    return host.readDirectory(path, extensions, exclude, include, depth);
                },
                onReleaseOldSourceFile: onReleaseOldSourceFile,
                hasInvalidatedResolution: hasInvalidatedResolution,
                hasChangedAutomaticTypeDirectiveNames: host.hasChangedAutomaticTypeDirectiveNames
            };
            if (host.trace) {
                compilerHost.trace = function (message) { return host.trace(message); };
            }
            if (host.resolveModuleNames) {
                compilerHost.resolveModuleNames = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return host.resolveModuleNames.apply(host, args);
                };
            }
            if (host.resolveTypeReferenceDirectives) {
                compilerHost.resolveTypeReferenceDirectives = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return host.resolveTypeReferenceDirectives.apply(host, args);
                };
            }
            if (host.useSourceOfProjectReferenceRedirect) {
                compilerHost.useSourceOfProjectReferenceRedirect = function () { return host.useSourceOfProjectReferenceRedirect(); };
            }
            (_a = host.setCompilerHost) === null || _a === void 0 ? void 0 : _a.call(host, compilerHost);
            var documentRegistryBucketKey = documentRegistry.getKeyForCompilationSettings(newSettings);
            var options = {
                rootNames: rootFileNames,
                options: newSettings,
                host: compilerHost,
                oldProgram: program,
                projectReferences: projectReferences
            };
            program = ts.createProgram(options);
            // hostCache is captured in the closure for 'getOrCreateSourceFile' but it should not be used past this point.
            // It needs to be cleared to allow all collected snapshots to be released
            hostCache = undefined;
            // We reset this cache on structure invalidation so we don't hold on to outdated files for long; however we can't use the `compilerHost` above,
            // Because it only functions until `hostCache` is cleared, while we'll potentially need the functionality to lazily read sourcemap files during
            // the course of whatever called `synchronizeHostData`
            sourceMapper.clearCache();
            // Make sure all the nodes in the program are both bound, and have their parent
            // pointers set property.
            program.getTypeChecker();
            return;
            function fileExists(fileName) {
                var path = ts.toPath(fileName, currentDirectory, getCanonicalFileName);
                var entry = hostCache && hostCache.getEntryByPath(path);
                return entry ?
                    !ts.isString(entry) :
                    (!!host.fileExists && host.fileExists(fileName));
            }
            function readFile(fileName) {
                // stub missing host functionality
                var path = ts.toPath(fileName, currentDirectory, getCanonicalFileName);
                var entry = hostCache && hostCache.getEntryByPath(path);
                if (entry) {
                    return ts.isString(entry) ? undefined : ts.getSnapshotText(entry.scriptSnapshot);
                }
                return host.readFile && host.readFile(fileName);
            }
            // Release any files we have acquired in the old program but are
            // not part of the new program.
            function onReleaseOldSourceFile(oldSourceFile, oldOptions) {
                var oldSettingsKey = documentRegistry.getKeyForCompilationSettings(oldOptions);
                documentRegistry.releaseDocumentWithKey(oldSourceFile.resolvedPath, oldSettingsKey);
            }
            function getOrCreateSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) {
                return getOrCreateSourceFileByPath(fileName, ts.toPath(fileName, currentDirectory, getCanonicalFileName), languageVersion, onError, shouldCreateNewSourceFile);
            }
            function getOrCreateSourceFileByPath(fileName, path, _languageVersion, _onError, shouldCreateNewSourceFile) {
                ts.Debug.assert(hostCache !== undefined, "getOrCreateSourceFileByPath called after typical CompilerHost lifetime, check the callstack something with a reference to an old host.");
                // The program is asking for this file, check first if the host can locate it.
                // If the host can not locate the file, then it does not exist. return undefined
                // to the program to allow reporting of errors for missing files.
                var hostFileInformation = hostCache && hostCache.getOrCreateEntryByPath(fileName, path);
                if (!hostFileInformation) {
                    return undefined;
                }
                // Check if the language version has changed since we last created a program; if they are the same,
                // it is safe to reuse the sourceFiles; if not, then the shape of the AST can change, and the oldSourceFile
                // can not be reused. we have to dump all syntax trees and create new ones.
                if (!shouldCreateNewSourceFile) {
                    // Check if the old program had this file already
                    var oldSourceFile = program && program.getSourceFileByPath(path);
                    if (oldSourceFile) {
                        // We already had a source file for this file name.  Go to the registry to
                        // ensure that we get the right up to date version of it.  We need this to
                        // address the following race-condition.  Specifically, say we have the following:
                        //
                        //      LS1
                        //          \
                        //           DocumentRegistry
                        //          /
                        //      LS2
                        //
                        // Each LS has a reference to file 'foo.ts' at version 1.  LS2 then updates
                        // it's version of 'foo.ts' to version 2.  This will cause LS2 and the
                        // DocumentRegistry to have version 2 of the document.  HOwever, LS1 will
                        // have version 1.  And *importantly* this source file will be *corrupt*.
                        // The act of creating version 2 of the file irrevocably damages the version
                        // 1 file.
                        //
                        // So, later when we call into LS1, we need to make sure that it doesn't use
                        // it's source file any more, and instead defers to DocumentRegistry to get
                        // either version 1, version 2 (or some other version) depending on what the
                        // host says should be used.
                        // We do not support the scenario where a host can modify a registered
                        // file's script kind, i.e. in one project some file is treated as ".ts"
                        // and in another as ".js"
                        ts.Debug.assertEqual(hostFileInformation.scriptKind, oldSourceFile.scriptKind, "Registered script kind should match new script kind.");
                        return documentRegistry.updateDocumentWithKey(fileName, path, newSettings, documentRegistryBucketKey, hostFileInformation.scriptSnapshot, hostFileInformation.version, hostFileInformation.scriptKind);
                    }
                    // We didn't already have the file.  Fall through and acquire it from the registry.
                }
                // Could not find this file in the old program, create a new SourceFile for it.
                return documentRegistry.acquireDocumentWithKey(fileName, path, newSettings, documentRegistryBucketKey, hostFileInformation.scriptSnapshot, hostFileInformation.version, hostFileInformation.scriptKind);
            }
        }
