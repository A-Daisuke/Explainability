        const onDidDeleteNode = (node) => {
            var _a;
            if (node.element === null) {
                return;
            }
            const tnode = node;
            if (!insertedElements.has(tnode.element)) {
                this.nodes.delete(tnode.element);
            }
            if (this.identityProvider) {
                const id = this.identityProvider.getId(tnode.element).toString();
                if (!insertedElementIds.has(id)) {
                    this.nodesByIdentity.delete(id);
                }
            }
            (_a = options.onDidDeleteNode) === null || _a === void 0 ? void 0 : _a.call(options, tnode);
        };
