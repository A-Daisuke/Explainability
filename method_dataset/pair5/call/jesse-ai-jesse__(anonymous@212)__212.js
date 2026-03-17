function __method_wrapper__() {
        disposables.add(picker.onDidAccept(event => {
            var _a;
            if (runOptions === null || runOptions === void 0 ? void 0 : runOptions.handleAccept) {
                if (!event.inBackground) {
                    picker.hide(); // hide picker unless we accept in background
                }
                (_a = runOptions.handleAccept) === null || _a === void 0 ? void 0 : _a.call(runOptions, picker.activeItems[0]);
                return;
            }
            const [item] = picker.selectedItems;
            if (typeof (item === null || item === void 0 ? void 0 : item.accept) === 'function') {
                if (!event.inBackground) {
                    picker.hide(); // hide picker unless we accept in background
                }
                item.accept(picker.keyMods, event);
            }
        }));

}
