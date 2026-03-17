function __method_wrapper__() {
        Promise.all(codeBlocks).then((tuples) => {
            var _a, _b;
            if (isDisposed) {
                return;
            }
            const renderedElements = new Map(tuples);
            const placeholderElements = element.querySelectorAll(`div[data-code]`);
            for (const placeholderElement of placeholderElements) {
                const renderedElement = renderedElements.get((_a = placeholderElement.dataset['code']) !== null && _a !== void 0 ? _a : '');
                if (renderedElement) {
                    DOM.reset(placeholderElement, renderedElement);
                }
            }
            (_b = options.asyncRenderCallback) === null || _b === void 0 ? void 0 : _b.call(options);
        });

}
