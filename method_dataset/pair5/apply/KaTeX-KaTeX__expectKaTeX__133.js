export const expectKaTeX = (expr, settings, mode, isNot, expectedError) => {
    let pass = expectedError == null;
    let error;
    try {
        mode.apply(expr, settings);
    } catch (e) {
        error = e;
        if (e instanceof ParseError) {
            pass = expectedError === ParseError || (typeof expectedError ===
                "string" && e.message === `KaTeX parse error: ${expectedError}`);
        } else if (e instanceof ConsoleWarning) {
            pass = expectedError === ConsoleWarning;
        } else {
            pass = !!isNot; // always fail
        }
    }
    return {
        pass,
        message: () => 'Expected the expression to ' +
            printExpectedResult(mode.noun, isNot, expectedError) +
            `:\n  ${printReceived(r(expr))}\n` +
            printActualErrorMessage(error),
    };
};
