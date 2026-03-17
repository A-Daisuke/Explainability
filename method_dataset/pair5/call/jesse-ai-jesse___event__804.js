function __method_wrapper__() {
        (_a = this._event) !== null && _a !== void 0 ? _a : (this._event = (callback, thisArgs, disposables) => {
            var _a, _b, _c, _d, _e, _f, _g;
            if (this._leakageMon && this._size > this._leakageMon.threshold ** 2) {
                const message = `[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far (${this._size} vs ${this._leakageMon.threshold})`;
                console.warn(message);
                const tuple = (_a = this._leakageMon.getMostFrequentStack()) !== null && _a !== void 0 ? _a : ['UNKNOWN stack', -1];
                const error = new ListenerRefusalError(`${message}. HINT: Stack shows most frequent listener (${tuple[1]}-times)`, tuple[0]);
                const errorHandler = ((_b = this._options) === null || _b === void 0 ? void 0 : _b.onListenerError) || onUnexpectedError;
                errorHandler(error);
                return Disposable.None;
            }
            if (this._disposed) {
                // todo: should we warn if a listener is added to a disposed emitter? This happens often
                return Disposable.None;
            }
            if (thisArgs) {
                callback = callback.bind(thisArgs);
            }
            const contained = new UniqueContainer(callback);
            let removeMonitor;
            let stack;
            if (this._leakageMon && this._size >= Math.ceil(this._leakageMon.threshold * 0.2)) {
                // check and record this emitter for potential leakage
                contained.stack = Stacktrace.create();
                removeMonitor = this._leakageMon.check(contained.stack, this._size + 1);
            }
            if (_enableDisposeWithListenerWarning) {
                contained.stack = stack !== null && stack !== void 0 ? stack : Stacktrace.create();
            }
            if (!this._listeners) {
                (_d = (_c = this._options) === null || _c === void 0 ? void 0 : _c.onWillAddFirstListener) === null || _d === void 0 ? void 0 : _d.call(_c, this);
                this._listeners = contained;
                (_f = (_e = this._options) === null || _e === void 0 ? void 0 : _e.onDidAddFirstListener) === null || _f === void 0 ? void 0 : _f.call(_e, this);
            }
            else if (this._listeners instanceof UniqueContainer) {
                (_g = this._deliveryQueue) !== null && _g !== void 0 ? _g : (this._deliveryQueue = new EventDeliveryQueuePrivate());
                this._listeners = [this._listeners, contained];
            }
            else {
                this._listeners.push(contained);
            }
            this._size++;
            const result = toDisposable(() => {
                _listenerFinalizers === null || _listenerFinalizers === void 0 ? void 0 : _listenerFinalizers.unregister(result);
                removeMonitor === null || removeMonitor === void 0 ? void 0 : removeMonitor();
                this._removeListener(contained);
            });
            if (disposables instanceof DisposableStore) {
                disposables.add(result);
            }
            else if (Array.isArray(disposables)) {
                disposables.push(result);
            }
            if (_listenerFinalizers) {
                const stack = new Error().stack.split('\n').slice(2).join('\n').trim();
                _listenerFinalizers.register(result, stack, result);
            }
            return result;
        });

}
