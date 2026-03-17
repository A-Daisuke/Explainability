function __method_wrapper__() {
    _removeZone(whitespaceAccessor, id) {
        if (this._zones.hasOwnProperty(id)) {
            const zone = this._zones[id];
            delete this._zones[id];
            whitespaceAccessor.removeWhitespace(zone.whitespaceId);
            zone.domNode.removeAttribute('monaco-visible-view-zone');
            zone.domNode.removeAttribute('monaco-view-zone');
            zone.domNode.domNode.parentNode.removeChild(zone.domNode.domNode);
            if (zone.marginDomNode) {
                zone.marginDomNode.removeAttribute('monaco-visible-view-zone');
                zone.marginDomNode.removeAttribute('monaco-view-zone');
                zone.marginDomNode.domNode.parentNode.removeChild(zone.marginDomNode.domNode);
            }
            this.setShouldRender();
            return true;
        }
        return false;
    }

}
