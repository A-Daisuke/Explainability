    function getSynthesizedClone(node) {
        // We don't use "clone" from core.ts here, as we need to preserve the prototype chain of
        // the original node. We also need to exclude specific properties and only include own-
        // properties (to skip members already defined on the shared prototype).
        if (node === undefined) {
            return node;
        }
        var clone = createSynthesizedNode(node.kind);
        clone.flags |= node.flags;
        setOriginalNode(clone, node);
        for (var key in node) {
            if (clone.hasOwnProperty(key) || !node.hasOwnProperty(key)) {
                continue;
            }
            clone[key] = node[key];
        }
        return clone;
    }
