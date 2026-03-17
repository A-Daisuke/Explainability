function __method_wrapper__() {
            return event(i => {
                var _a;
                const data = this.data[this.data.length - 1];
                // Non-reduce scenario
                if (!reduce) {
                    // Buffering case
                    if (data) {
                        data.buffers.push(() => listener.call(thisArgs, i));
                    }
                    else {
                        // Not buffering case
                        listener.call(thisArgs, i);
                    }
                    return;
                }
                // Reduce scenario
                const reduceData = data;
                // Not buffering case
                if (!reduceData) {
                    // TODO: Is there a way to cache this reduce call for all listeners?
                    listener.call(thisArgs, reduce(initial, i));
                    return;
                }
                // Buffering case
                (_a = reduceData.items) !== null && _a !== void 0 ? _a : (reduceData.items = []);
                reduceData.items.push(i);
                if (reduceData.buffers.length === 0) {
                    // Include a single buffered function that will reduce all events when we're done buffering events
                    data.buffers.push(() => {
                        var _a;
                        // cache the reduced result so that the value can be shared across all listeners
                        (_a = reduceData.reducedResult) !== null && _a !== void 0 ? _a : (reduceData.reducedResult = initial
                            ? reduceData.items.reduce(reduce, initial)
                            : reduceData.items.reduce(reduce));
                        listener.call(thisArgs, reduceData.reducedResult);
                    });
                }
            }, undefined, disposables);

}
