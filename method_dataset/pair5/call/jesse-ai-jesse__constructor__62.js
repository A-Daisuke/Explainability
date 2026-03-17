function __method_wrapper__() {
    constructor(_debugNameData, _runFn, createChangeSummary, _handleChange) {
        var _a, _b;
        this._debugNameData = _debugNameData;
        this._runFn = _runFn;
        this.createChangeSummary = createChangeSummary;
        this._handleChange = _handleChange;
        this.state = 2 /* AutorunState.stale */;
        this.updateCount = 0;
        this.disposed = false;
        this.dependencies = new Set();
        this.dependenciesToBeRemoved = new Set();
        this.changeSummary = (_a = this.createChangeSummary) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = getLogger()) === null || _b === void 0 ? void 0 : _b.handleAutorunCreated(this);
        this._runIfNeeded();
        trackDisposable(this);
    }

}
