                function NodeTypingsInstaller(globalTypingsCacheLocation, typingSafeListLocation, typesMapLocation, npmLocation, validateDefaultNpmLocation, throttleLimit, log) {
                    var _this = _super.call(this, ts.sys, globalTypingsCacheLocation, typingSafeListLocation ? ts.toPath(typingSafeListLocation, "", ts.createGetCanonicalFileName(ts.sys.useCaseSensitiveFileNames)) : ts.toPath("typingSafeList.json", __dirname, ts.createGetCanonicalFileName(ts.sys.useCaseSensitiveFileNames)), typesMapLocation ? ts.toPath(typesMapLocation, "", ts.createGetCanonicalFileName(ts.sys.useCaseSensitiveFileNames)) : ts.toPath("typesMap.json", __dirname, ts.createGetCanonicalFileName(ts.sys.useCaseSensitiveFileNames)), throttleLimit, log) || this;
                    _this.npmPath = npmLocation !== undefined ? npmLocation : getDefaultNPMLocation(process.argv[0], validateDefaultNpmLocation, _this.installTypingHost);
                    if (ts.stringContains(_this.npmPath, " ") && _this.npmPath[0] !== "\"") {
                        _this.npmPath = "\"" + _this.npmPath + "\"";
                    }
                    if (_this.log.isEnabled()) {
                        _this.log.writeLine("Process id: " + process.pid);
                        _this.log.writeLine("NPM location: " + _this.npmPath + " (explicit '" + server.Arguments.NpmLocation + "' " + (npmLocation === undefined ? "not " : "") + " provided)");
                        _this.log.writeLine("validateDefaultNpmLocation: " + validateDefaultNpmLocation);
                    }
                    (_this.nodeExecSync = require("child_process").execSync);
                    _this.ensurePackageDirectoryExists(globalTypingsCacheLocation);
                    try {
                        if (_this.log.isEnabled()) {
                            _this.log.writeLine("Updating " + typesRegistryPackageName + " npm package...");
                        }
                        _this.execSyncAndLog(_this.npmPath + " install --ignore-scripts " + typesRegistryPackageName + "@" + _this.latestDistTag, { cwd: globalTypingsCacheLocation });
                        if (_this.log.isEnabled()) {
                            _this.log.writeLine("Updated " + typesRegistryPackageName + " npm package");
                        }
                    }
                    catch (e) {
                        if (_this.log.isEnabled()) {
                            _this.log.writeLine("Error updating " + typesRegistryPackageName + " package: " + e.message);
                        }
                        _this.delayedInitializationError = {
                            kind: "event::initializationFailed",
                            message: e.message
                        };
                    }
                    _this.typesRegistry = loadTypesRegistryFile(getTypesRegistryFileLocation(globalTypingsCacheLocation), _this.installTypingHost, _this.log);
                    return _this;
                }
