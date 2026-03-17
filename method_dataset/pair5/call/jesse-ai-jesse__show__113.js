class __C__ {
    show(delegate) {
        var _a, _b, _c;
        if (this.isVisible()) {
            this.hide();
        }
        // Show static box
        DOM.clearNode(this.view);
        this.view.className = 'context-view monaco-component';
        this.view.style.top = '0px';
        this.view.style.left = '0px';
        this.view.style.zIndex = `${2575 + ((_a = delegate.layer) !== null && _a !== void 0 ? _a : 0)}`;
        this.view.style.position = this.useFixedPosition ? 'fixed' : 'absolute';
        DOM.show(this.view);
        // Render content
        this.toDisposeOnClean = delegate.render(this.view) || Disposable.None;
        // Set active delegate
        this.delegate = delegate;
        // Layout
        this.doLayout();
        // Focus
        (_c = (_b = this.delegate).focus) === null || _c === void 0 ? void 0 : _c.call(_b);
    }

}
