function __method_wrapper__() {
    render(bars) {
        if (this.#end || !isTTY) return;
        const now = Date.now();
        const ms = now - this.lastRender;
        this.lastRender = now;
        const time = ((now - this.start) / 1000).toFixed(1) + "s";
        let end = true;
        let index = this.#startIndex;
        for (const { completed , total =100 , text ="" , ...options } of bars){
            if (completed < 0) {
                throw new Error(`completed must greater than or equal to 0`);
            }
            if (!Number.isInteger(total)) throw new Error(`total must be 'number'`);
            if (completed > total && this.#strs[index] != undefined) continue;
            end = false;
            const percent = (completed / total * 100).toFixed(2) + "%";
            const eta = completed == 0 ? "-" : (completed >= total ? 0 : (total / completed - 1) * (now - this.start) / 1000).toFixed(1) + "s";
            let str = this.display.replace(":text", text).replace(":time", time).replace(":eta", eta).replace(":percent", percent).replace(":completed", completed + "").replace(":total", total + "");
            let availableSpace = Math.max(0, this.ttyColumns - str.replace(":bar", "").length);
            if (availableSpace && isWindow) availableSpace -= 1;
            const width = Math.min(this.width, availableSpace);
            const completeLength = Math.round(width * completed / total);
            const complete = new Array(completeLength).fill(options.complete ?? this.complete).join("");
            const incomplete = new Array(width - completeLength).fill(options.incomplete ?? this.incomplete).join("");
            str = str.replace(":bar", complete + incomplete);
            if (this.#strs[index] && str.length < this.#strs[index].length) {
                str += " ".repeat(this.#strs[index].length - str.length);
            }
            this.#strs[index++] = str;
        }
        if (ms < this.interval && end == false) return;
        const renderStr = this.#strs.join("\n");
        if (renderStr !== this.lastStr) {
            this.resetScreen();
            this.write(renderStr);
            this.lastStr = renderStr;
            this.#lastRows = this.#strs.length;
        }
        if (end) this.end();
    }

}
