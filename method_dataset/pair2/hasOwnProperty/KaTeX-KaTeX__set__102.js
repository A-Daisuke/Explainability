class __C__ {
    set(name: string, value: ?Value, global: boolean = false) {
        if (global) {
            // Global set is equivalent to setting in all groups.  Simulate this
            // by destroying any undos currently scheduled for this name,
            // and adding an undo with the *new* value (in case it later gets
            // locally reset within this environment).
            for (let i = 0; i < this.undefStack.length; i++) {
                delete this.undefStack[i][name];
            }
            if (this.undefStack.length > 0) {
                this.undefStack[this.undefStack.length - 1][name] = value;
            }
        } else {
            // Undo this set at end of this group (possibly to `undefined`),
            // unless an undo is already in place, in which case that older
            // value is the correct one.
            const top = this.undefStack[this.undefStack.length - 1];
            if (top && !top.hasOwnProperty(name)) {
                top[name] = this.current[name];
            }
        }
        if (value == null) {
            delete this.current[name];
        } else {
            this.current[name] = value;
        }
    }

}
