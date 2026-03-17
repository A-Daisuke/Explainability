function __method_wrapper__() {
    htmlBuilder: (group, options) => {
        const elements = html.buildExpression(group.body, options, false);

        const classes = ["enclosing"];
        if (group.attributes.class) {
            classes.push(...group.attributes.class.trim().split(/\s+/));
        }

        const span = buildCommon.makeSpan(classes, elements, options);
        for (const attr in group.attributes) {
            if (attr !== "class" && group.attributes.hasOwnProperty(attr)) {
                span.setAttribute(attr, group.attributes[attr]);
            }
        }
        return span;
    },

}
