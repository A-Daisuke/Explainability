function __method_wrapper__() {
describe("Symbols and macros", () => {
    for (const macro in macros) {
        if (!macros.hasOwnProperty(macro)) {
            continue;
        }
        it(`macro ${macro} should not shadow a symbol`, () => {
            for (const kind in symbols) {
                if (!symbols.hasOwnProperty(kind)) {
                    continue;
                }
                expect(symbols[kind][macro]).toBeFalsy();
            }
        });
    }
});

}
