function __method_wrapper__() {
    render(ctx) {
        const visibleWhitespaces = ctx.viewportData.whitespaceViewportData;
        const visibleZones = {};
        let hasVisibleZone = false;
        for (const visibleWhitespace of visibleWhitespaces) {
            if (this._zones[visibleWhitespace.id].isInHiddenArea) {
                continue;
            }
            visibleZones[visibleWhitespace.id] = visibleWhitespace;
            hasVisibleZone = true;
        }
        const keys = Object.keys(this._zones);
        for (let i = 0, len = keys.length; i < len; i++) {
            const id = keys[i];
            const zone = this._zones[id];
            let newTop = 0;
            let newHeight = 0;
            let newDisplay = 'none';
            if (visibleZones.hasOwnProperty(id)) {
                newTop = visibleZones[id].verticalOffset - ctx.bigNumbersDelta;
                newHeight = visibleZones[id].height;
                newDisplay = 'block';
                // zone is visible
                if (!zone.isVisible) {
                    zone.domNode.setAttribute('monaco-visible-view-zone', 'true');
                    zone.isVisible = true;
                }
                this._safeCallOnDomNodeTop(zone.delegate, ctx.getScrolledTopFromAbsoluteTop(visibleZones[id].verticalOffset));
            }
            else {
                if (zone.isVisible) {
                    zone.domNode.removeAttribute('monaco-visible-view-zone');
                    zone.isVisible = false;
                }
                this._safeCallOnDomNodeTop(zone.delegate, ctx.getScrolledTopFromAbsoluteTop(-1000000));
            }
            zone.domNode.setTop(newTop);
            zone.domNode.setHeight(newHeight);
            zone.domNode.setDisplay(newDisplay);
            if (zone.marginDomNode) {
                zone.marginDomNode.setTop(newTop);
                zone.marginDomNode.setHeight(newHeight);
                zone.marginDomNode.setDisplay(newDisplay);
            }
        }
        if (hasVisibleZone) {
            this.domNode.setWidth(Math.max(ctx.scrollWidth, this._contentWidth));
            this.marginDomNode.setWidth(this._contentLeft);
        }
    }

}
