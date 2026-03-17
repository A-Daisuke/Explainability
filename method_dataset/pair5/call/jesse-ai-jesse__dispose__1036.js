class __C__ {
    dispose() {
        var _a, _b;
        for (const item of this.items) {
            item.dragStartDisposable.dispose();
            item.checkedDisposable.dispose();
            if (item.row) {
                const renderer = this.renderers.get(item.row.templateId);
                if (renderer) {
                    (_a = renderer.disposeElement) === null || _a === void 0 ? void 0 : _a.call(renderer, item.element, -1, item.row.templateData, undefined);
                    renderer.disposeTemplate(item.row.templateData);
                }
            }
        }
        this.items = [];
        if (this.domNode && this.domNode.parentNode) {
            this.domNode.parentNode.removeChild(this.domNode);
        }
        (_b = this.dragOverAnimationDisposable) === null || _b === void 0 ? void 0 : _b.dispose();
        this.disposables.dispose();
    }

}
