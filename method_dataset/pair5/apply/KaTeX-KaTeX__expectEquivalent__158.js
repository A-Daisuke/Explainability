export const expectEquivalent = (actual, expected, settings, mode, expand) => {
    const actualTree = stripPositions(mode.apply(actual, settings));
    const expectedTree = stripPositions(mode.apply(expected, settings));
    const pass = JSON.stringify(actualTree) === JSON.stringify(expectedTree);

    return {
        pass,
        message: pass
            ? () =>
                `${mode.Verb} trees of ${printReceived(r(actual))} and ` +
                `${printExpected(r(expected))} are equivalent`
            : () => {
                const diffString = diff(expectedTree, actualTree, {
                    expand,
                });

                return `${mode.Verb} trees of ${printReceived(r(actual))} and ` +
                `${printExpected(r(expected))} are not equivalent` +
                (diffString ? `:\n\n${diffString}` : '');
            },
    };
};
