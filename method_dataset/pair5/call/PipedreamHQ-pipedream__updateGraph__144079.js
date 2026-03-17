function __method_wrapper__() {
            ConfiguredProject.prototype.updateGraph = function () {
                this.isInitialLoadPending = ts.returnFalse;
                var reloadLevel = this.pendingReload;
                this.pendingReload = ts.ConfigFileProgramReloadLevel.None;
                var result;
                switch (reloadLevel) {
                    case ts.ConfigFileProgramReloadLevel.Partial:
                        this.openFileWatchTriggered.clear();
                        result = this.projectService.reloadFileNamesOfConfiguredProject(this);
                        break;
                    case ts.ConfigFileProgramReloadLevel.Full:
                        this.openFileWatchTriggered.clear();
                        var reason = ts.Debug.checkDefined(this.pendingReloadReason);
                        this.pendingReloadReason = undefined;
                        this.projectService.reloadConfiguredProject(this, reason);
                        result = true;
                        break;
                    default:
                        result = _super.prototype.updateGraph.call(this);
                }
                this.compilerHost = undefined;
                this.projectService.sendProjectLoadingFinishEvent(this);
                this.projectService.sendProjectTelemetry(this);
                return result;
            };

}
