class __C__ {
    _recomputeIfNeeded() {
        var _a, _b;
        if (this.state === 3 /* DerivedState.upToDate */) {
            return;
        }
        const emptySet = this.dependenciesToBeRemoved;
        this.dependenciesToBeRemoved = this.dependencies;
        this.dependencies = emptySet;
        const hadValue = this.state !== 0 /* DerivedState.initial */;
        const oldValue = this.value;
        this.state = 3 /* DerivedState.upToDate */;
        const changeSummary = this.changeSummary;
        this.changeSummary = (_a = this.createChangeSummary) === null || _a === void 0 ? void 0 : _a.call(this);
        try {
            /** might call {@link handleChange} indirectly, which could invalidate us */
            this.value = this._computeFn(this, changeSummary);
        }
        finally {
            // We don't want our observed observables to think that they are (not even temporarily) not being observed.
            // Thus, we only unsubscribe from observables that are definitely not read anymore.
            for (const o of this.dependenciesToBeRemoved) {
                o.removeObserver(this);
            }
            this.dependenciesToBeRemoved.clear();
        }
        const didChange = hadValue && !(this._equalityComparator(oldValue, this.value));
        (_b = getLogger()) === null || _b === void 0 ? void 0 : _b.handleDerivedRecomputed(this, {
            oldValue,
            newValue: this.value,
            change: undefined,
            didChange,
            hadValue,
        });
        if (didChange) {
            for (const r of this.observers) {
                r.handleChange(this, undefined);
            }
        }
    }

}
