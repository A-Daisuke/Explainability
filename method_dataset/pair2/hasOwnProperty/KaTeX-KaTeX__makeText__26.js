export const makeText = function(
    text: string,
    mode: Mode,
    options?: Options,
): TextNode {
    if (symbols[mode][text] && symbols[mode][text].replace &&
        text.charCodeAt(0) !== 0xD835 &&
        !(ligatures.hasOwnProperty(text) && options &&
          ((options.fontFamily && options.fontFamily.slice(4, 6) === "tt") ||
           (options.font && options.font.slice(4, 6) === "tt")))) {
        text = symbols[mode][text].replace;
    }

    return new mathMLTree.TextNode(text);
};
