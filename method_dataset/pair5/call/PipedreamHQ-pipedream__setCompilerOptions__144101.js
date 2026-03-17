function __method_wrapper__() {
            InferredProject.prototype.setCompilerOptions = function (options) {
                // Avoid manipulating the given options directly
                if (!options && !this.getCompilationSettings()) {
                    return;
                }
                var newOptions = ts.cloneCompilerOptions(options || this.getCompilationSettings());
                if (this._isJsInferredProject && typeof newOptions.maxNodeModuleJsDepth !== "number") {
                    newOptions.maxNodeModuleJsDepth = 2;
                }
                else if (!this._isJsInferredProject) {
                    newOptions.maxNodeModuleJsDepth = undefined;
                }
                newOptions.allowJs = true;
                _super.prototype.setCompilerOptions.call(this, newOptions);
            };

}
