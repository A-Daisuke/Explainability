            function ConfiguredProject(configFileName, projectService, documentRegistry, cachedDirectoryStructureHost) {
                var _this = _super.call(this, configFileName, ProjectKind.Configured, projectService, documentRegistry, 
                /*hasExplicitListOfFiles*/ false, 
                /*lastFileExceededProgramSize*/ undefined, 
                /*compilerOptions*/ {}, 
                /*compileOnSaveEnabled*/ false, 
                /*watchOptions*/ undefined, cachedDirectoryStructureHost, ts.getDirectoryPath(configFileName)) || this;
                /* @internal */
                _this.openFileWatchTriggered = ts.createMap();
                /*@internal*/
                _this.canConfigFileJsonReportNoInputFiles = false;
                /** Ref count to the project when opened from external project */
                _this.externalProjectRefCount = 0;
                /*@internal*/
                _this.isInitialLoadPending = ts.returnTrue;
                /*@internal*/
                _this.sendLoadingProjectFinish = false;
                _this.canonicalConfigFilePath = server.asNormalizedPath(projectService.toCanonicalFileName(configFileName));
                return _this;
            }
