class __C__ {
    dispose() {
        var _a, _b, _c, _d;
        if (!this._disposed) {
            this._disposed = true;
            // It is bad to have listeners at the time of disposing an emitter, it is worst to have listeners keep the emitter
            // alive via the reference that's embedded in their disposables. Therefore we loop over all remaining listeners and
            // unset their subscriptions/disposables. Looping and blaming remaining listeners is done on next tick because the
            // the following programming pattern is very popular:
            //
            // const someModel = this._disposables.add(new ModelObject()); // (1) create and register model
            // this._disposables.add(someModel.onDidChange(() => { ... }); // (2) subscribe and register model-event listener
            // ...later...
            // this._disposables.dispose(); disposes (1) then (2): don't warn after (1) but after the "overall dispose" is done
            if (((_a = this._deliveryQueue) === null || _a === void 0 ? void 0 : _a.current) === this) {
                this._deliveryQueue.reset();
            }
            if (this._listeners) {
                if (_enableDisposeWithListenerWarning) {
                    const listeners = this._listeners;
                    queueMicrotask(() => {
                        forEachListener(listeners, l => { var _a; return (_a = l.stack) === null || _a === void 0 ? void 0 : _a.print(); });
                    });
                }
                this._listeners = undefined;
                this._size = 0;
            }
            (_c = (_b = this._options) === null || _b === void 0 ? void 0 : _b.onDidRemoveLastListener) === null || _c === void 0 ? void 0 : _c.call(_b);
            (_d = this._leakageMon) === null || _d === void 0 ? void 0 : _d.dispose();
        }
    }

}
