function __method_wrapper__() {
    get() {
        var _a;
        if (this.observers.size === 0) {
            // Without observers, we don't know when to clean up stuff.
            // Thus, we don't cache anything to prevent memory leaks.
            const result = this._computeFn(this, (_a = this.createChangeSummary) === null || _a === void 0 ? void 0 : _a.call(this));
            // Clear new dependencies
            this.onLastObserverRemoved();
            return result;
        }
        else {
            do {
                // We might not get a notification for a dependency that changed while it is updating,
                // thus we also have to ask all our depedencies if they changed in this case.
                if (this.state === 1 /* DerivedState.dependenciesMightHaveChanged */) {
                    for (const d of this.dependencies) {
                        /** might call {@link handleChange} indirectly, which could make us stale */
                        d.reportChanges();
                        if (this.state === 2 /* DerivedState.stale */) {
                            // The other dependencies will refresh on demand, so early break
                            break;
                        }
                    }
                }
                // We called report changes of all dependencies.
                // If we are still not stale, we can assume to be up to date again.
                if (this.state === 1 /* DerivedState.dependenciesMightHaveChanged */) {
                    this.state = 3 /* DerivedState.upToDate */;
                }
                this._recomputeIfNeeded();
                // In case recomputation changed one of our dependencies, we need to recompute again.
            } while (this.state !== 3 /* DerivedState.upToDate */);
            return this.value;
        }
    }

}
