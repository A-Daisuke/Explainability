function __method_wrapper__() {
    updateFocus(fromRight, preventScroll, forceFocus = false) {
        var _a, _b;
        if (typeof this.focusedItem === 'undefined') {
            this.actionsList.focus({ preventScroll });
        }
        if (this.previouslyFocusedItem !== undefined && this.previouslyFocusedItem !== this.focusedItem) {
            (_a = this.viewItems[this.previouslyFocusedItem]) === null || _a === void 0 ? void 0 : _a.blur();
        }
        const actionViewItem = this.focusedItem !== undefined ? this.viewItems[this.focusedItem] : undefined;
        if (actionViewItem) {
            let focusItem = true;
            if (!types.isFunction(actionViewItem.focus)) {
                focusItem = false;
            }
            if (this.options.focusOnlyEnabledItems && types.isFunction(actionViewItem.isEnabled) && !actionViewItem.isEnabled()) {
                focusItem = false;
            }
            if (actionViewItem.action.id === Separator.ID) {
                focusItem = false;
            }
            if (!focusItem) {
                this.actionsList.focus({ preventScroll });
                this.previouslyFocusedItem = undefined;
            }
            else if (forceFocus || this.previouslyFocusedItem !== this.focusedItem) {
                actionViewItem.focus(fromRight);
                this.previouslyFocusedItem = this.focusedItem;
            }
            if (focusItem) {
                (_b = actionViewItem.showHover) === null || _b === void 0 ? void 0 : _b.call(actionViewItem);
            }
        }
    }

}
