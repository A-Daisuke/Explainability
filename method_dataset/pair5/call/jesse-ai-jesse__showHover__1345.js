class __C__ {
    showHover(element) {
        var _a, _b, _c;
        if (this._lastHover && !this._lastHover.isDisposed) {
            (_b = (_a = this.hoverDelegate).onDidHideHover) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_c = this._lastHover) === null || _c === void 0 ? void 0 : _c.dispose();
        }
        if (!element.element || !element.saneTooltip) {
            return;
        }
        this._lastHover = this.hoverDelegate.showHover({
            content: element.saneTooltip,
            target: element.element,
            linkHandler: (url) => {
                this.linkOpenerDelegate(url);
            },
            appearance: {
                showPointer: true,
            },
            container: this._container,
            position: {
                hoverPosition: 1 /* HoverPosition.RIGHT */
            }
        }, false);
    }

}
