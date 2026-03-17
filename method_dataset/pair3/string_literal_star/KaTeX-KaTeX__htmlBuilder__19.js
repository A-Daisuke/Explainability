export const htmlBuilder: HtmlBuilderSupSub<"operatorname"> = (grp, options) => {
    // Operators are handled in the TeXbook pg. 443-444, rule 13(a).
    let supGroup;
    let subGroup;
    let hasLimits = false;
    let group: ParseNode<"operatorname">;
    if (grp.type === "supsub") {
        // If we have limits, supsub will pass us its group to handle. Pull
        // out the superscript and subscript and set the group to the op in
        // its base.
        supGroup = grp.sup;
        subGroup = grp.sub;
        group = assertNodeType(grp.base, "operatorname");
        hasLimits = true;
    } else {
        group = assertNodeType(grp, "operatorname");
    }

    let base;
    if (group.body.length > 0) {
        const body = group.body.map(child => {
            // $FlowFixMe: Check if the node has a string `text` property.
            const childText = child.text;
            if (typeof childText === "string") {
                return {
                    type: "textord",
                    mode: child.mode,
                    text: childText,
                };
            } else {
                return child;
            }
        });

        // Consolidate function names into symbol characters.
        const expression = html.buildExpression(
            body, options.withFont("mathrm"), true);

        for (let i = 0; i < expression.length; i++) {
            const child = expression[i];
            if (child instanceof SymbolNode) {
                // Per amsopn package,
                // change minus to hyphen and \ast to asterisk
                child.text = child.text.replace(/\u2212/, "-")
                    .replace(/\u2217/, "*");
            }
        }
        base = buildCommon.makeSpan(["mop"], expression, options);
    } else {
        base = buildCommon.makeSpan(["mop"], [], options);
    }

    if (hasLimits) {
        return assembleSupSub(base, supGroup, subGroup, options,
            options.style, 0, 0);

    } else {
        return base;
    }
};
