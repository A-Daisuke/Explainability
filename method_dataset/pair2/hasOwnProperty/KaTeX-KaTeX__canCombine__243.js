const canCombine = (prev: SymbolNode, next: SymbolNode) => {
    if (createClass(prev.classes) !== createClass(next.classes)
        || prev.skew !== next.skew
        || prev.maxFontSize !== next.maxFontSize) {
        return false;
    }

    // If prev and next both are just "mbin"s or "mord"s we don't combine them
    // so that the proper spacing can be preserved.
    if (prev.classes.length === 1) {
        const cls = prev.classes[0];
        if (cls === "mbin" || cls === "mord") {
            return false;
        }
    }

    for (const style in prev.style) {
        if (prev.style.hasOwnProperty(style)
            && prev.style[style] !== next.style[style]) {
            return false;
        }
    }

    for (const style in next.style) {
        if (next.style.hasOwnProperty(style)
            && prev.style[style] !== next.style[style]) {
            return false;
        }
    }

    return true;
};
