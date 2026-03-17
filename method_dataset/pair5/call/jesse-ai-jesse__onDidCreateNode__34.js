        const onDidCreateNode = (node) => {
            var _a;
            if (node.element === null) {
                return;
            }
            const tnode = node;
            insertedElements.add(tnode.element);
            this.nodes.set(tnode.element, tnode);
            if (this.identityProvider) {
                const id = this.identityProvider.getId(tnode.element).toString();
                insertedElementIds.add(id);
                this.nodesByIdentity.set(id, tnode);
            }
            (_a = options.onDidCreateNode) === null || _a === void 0 ? void 0 : _a.call(options, tnode);
        };
