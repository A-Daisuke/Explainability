function __method_wrapper__() {
    _runIfNeeded() {
        var _a, _b, _c;
        if (this.state === 3 /* AutorunState.upToDate */) {
            return;
        }
        const emptySet = this.dependenciesToBeRemoved;
        this.dependenciesToBeRemoved = this.dependencies;
        this.dependencies = emptySet;
        this.state = 3 /* AutorunState.upToDate */;
        const isDisposed = this.disposed;
        try {
            if (!isDisposed) {
                (_a = getLogger()) === null || _a === void 0 ? void 0 : _a.handleAutorunTriggered(this);
                const changeSummary = this.changeSummary;
                this.changeSummary = (_b = this.createChangeSummary) === null || _b === void 0 ? void 0 : _b.call(this);
                this._runFn(this, changeSummary);
            }
        }
        finally {
            if (!isDisposed) {
                (_c = getLogger()) === null || _c === void 0 ? void 0 : _c.handleAutorunFinished(this);
            }
            // We don't want our observed observables to think that they are (not even temporarily) not being observed.
            // Thus, we only unsubscribe from observables that are definitely not read anymore.
            for (const o of this.dependenciesToBeRemoved) {
                o.removeObserver(this);
            }
            this.dependenciesToBeRemoved.clear();
        }
    }

}
