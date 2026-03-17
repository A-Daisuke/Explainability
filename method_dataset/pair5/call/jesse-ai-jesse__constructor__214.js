class __C__ {
    constructor(renderer, modelProvider, onDidChangeCollapseState, activeNodes, renderedIndentGuides, options = {}) {
        var _a;
        this.renderer = renderer;
        this.modelProvider = modelProvider;
        this.activeNodes = activeNodes;
        this.renderedIndentGuides = renderedIndentGuides;
        this.renderedElements = new Map();
        this.renderedNodes = new Map();
        this.indent = TreeRenderer.DefaultIndent;
        this.hideTwistiesOfChildlessElements = false;
        this.shouldRenderIndentGuides = false;
        this.activeIndentNodes = new Set();
        this.indentGuidesDisposable = Disposable.None;
        this.disposables = new DisposableStore();
        this.templateId = renderer.templateId;
        this.updateOptions(options);
        Event.map(onDidChangeCollapseState, e => e.node)(this.onDidChangeNodeTwistieState, this, this.disposables);
        (_a = renderer.onDidChangeTwistieState) === null || _a === void 0 ? void 0 : _a.call(renderer, this.onDidChangeTwistieState, this, this.disposables);
    }

}
