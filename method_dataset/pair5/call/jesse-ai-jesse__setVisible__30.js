function __method_wrapper__() {
    setVisible(visible, size) {
        var _a, _b;
        if (visible === this.visible) {
            return;
        }
        if (visible) {
            this.size = clamp(this._cachedVisibleSize, this.viewMinimumSize, this.viewMaximumSize);
            this._cachedVisibleSize = undefined;
        }
        else {
            this._cachedVisibleSize = typeof size === 'number' ? size : this.size;
            this.size = 0;
        }
        this.container.classList.toggle('visible', visible);
        try {
            (_b = (_a = this.view).setVisible) === null || _b === void 0 ? void 0 : _b.call(_a, visible);
        }
        catch (e) {
            console.error('Splitview: Failed to set visible view');
            console.error(e);
        }
    }

}
