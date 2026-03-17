    function getSynthesizedClone(node) {
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
