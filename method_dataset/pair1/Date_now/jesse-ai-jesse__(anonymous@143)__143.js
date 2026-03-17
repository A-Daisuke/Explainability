function __method_wrapper__() {
            this._getCodeLensModelPromise.then(result => {
                if (this._currentCodeLensModel) {
                    this._oldCodeLensModels.add(this._currentCodeLensModel);
                }
                this._currentCodeLensModel = result;
                // cache model to reduce flicker
                this._codeLensCache.put(model, result);
                // update moving average
                const newDelay = this._provideCodeLensDebounce.update(model, Date.now() - t1);
                scheduler.delay = newDelay;
                // render lenses
                this._renderCodeLensSymbols(result);
                // dom.scheduleAtNextAnimationFrame(() => this._resolveCodeLensesInViewport());
                this._resolveCodeLensesInViewportSoon();
            }, onUnexpectedError);

}
