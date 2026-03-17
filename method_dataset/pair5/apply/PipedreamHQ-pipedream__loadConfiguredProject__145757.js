function __method_wrapper__() {
            ProjectService.prototype.loadConfiguredProject = function (project, reason) {
                var _this = this;
                this.sendProjectLoadingStartEvent(project, reason);
                // Read updated contents from disk
                var configFilename = ts.normalizePath(project.getConfigFilePath());
                var configFileContent = ts.tryReadFile(configFilename, function (fileName) { return _this.host.readFile(fileName); });
                var result = ts.parseJsonText(configFilename, ts.isString(configFileContent) ? configFileContent : "");
                if (!result.endOfFileToken) {
                    result.endOfFileToken = { kind: 1 /* EndOfFileToken */ };
                }
                var configFileErrors = result.parseDiagnostics;
                if (!ts.isString(configFileContent))
                    configFileErrors.push(configFileContent);
                var parsedCommandLine = ts.parseJsonSourceFileConfigFileContent(result, project.getCachedDirectoryStructureHost(), ts.getDirectoryPath(configFilename), 
                /*existingOptions*/ {}, configFilename, 
                /*resolutionStack*/ [], this.hostConfiguration.extraFileExtensions, 
                /*extendedConfigCache*/ undefined);
                if (parsedCommandLine.errors.length) {
                    configFileErrors.push.apply(configFileErrors, parsedCommandLine.errors);
                }
                this.logger.info("Config: " + configFilename + " : " + JSON.stringify({
                    rootNames: parsedCommandLine.fileNames,
                    options: parsedCommandLine.options,
                    projectReferences: parsedCommandLine.projectReferences
                }, /*replacer*/ undefined, " "));
                ts.Debug.assert(!!parsedCommandLine.fileNames);
                var compilerOptions = parsedCommandLine.options;
                // Update the project
                if (!project.projectOptions) {
                    project.projectOptions = {
                        configHasExtendsProperty: parsedCommandLine.raw.extends !== undefined,
                        configHasFilesProperty: parsedCommandLine.raw.files !== undefined,
                        configHasIncludeProperty: parsedCommandLine.raw.include !== undefined,
                        configHasExcludeProperty: parsedCommandLine.raw.exclude !== undefined
                    };
                }
                project.configFileSpecs = parsedCommandLine.configFileSpecs;
                project.canConfigFileJsonReportNoInputFiles = ts.canJsonReportNoInutFiles(parsedCommandLine.raw);
                project.setProjectErrors(configFileErrors);
                project.updateReferences(parsedCommandLine.projectReferences);
                var lastFileExceededProgramSize = this.getFilenameForExceededTotalSizeLimitForNonTsFiles(project.canonicalConfigFilePath, compilerOptions, parsedCommandLine.fileNames, fileNamePropertyReader);
                if (lastFileExceededProgramSize) {
                    project.disableLanguageService(lastFileExceededProgramSize);
                    project.stopWatchingWildCards();
                }
                else {
                    project.setCompilerOptions(compilerOptions);
                    project.setWatchOptions(parsedCommandLine.watchOptions);
                    project.enableLanguageService();
                    project.watchWildcards(ts.createMapFromTemplate(parsedCommandLine.wildcardDirectories)); // TODO: GH#18217
                }
                project.enablePluginsWithOptions(compilerOptions, this.currentPluginConfigOverrides);
                var filesToAdd = parsedCommandLine.fileNames.concat(project.getExternalFiles());
                this.updateRootAndOptionsOfNonInferredProject(project, filesToAdd, fileNamePropertyReader, compilerOptions, parsedCommandLine.typeAcquisition, parsedCommandLine.compileOnSave, parsedCommandLine.watchOptions);
            };

}
