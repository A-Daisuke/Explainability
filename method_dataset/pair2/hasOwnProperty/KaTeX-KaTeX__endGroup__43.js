class __C__ {
    endGroup() {
        if (this.undefStack.length === 0) {
            throw new ParseError("Unbalanced namespace destruction: attempt " +
                "to pop global namespace; please report this as a bug");
        }
        const undefs = this.undefStack.pop();
        for (const undef in undefs) {
            if (undefs.hasOwnProperty(undef)) {
                if (undefs[undef] == null) {
                    delete this.current[undef];
                } else {
                    this.current[undef] = undefs[undef];
                }
            }
        }
    }

}
