class __C__ {
    render(completed, options = {}) {
        if (this.isCompleted || !isTTY1) return;
        if (completed < 0) {
            throw new Error(`completed must greater than or equal to 0`);
        }
        const total = options.total ?? this.total ?? 100;
        const now = Date.now();
        const ms = now - this.lastRender;
        if (ms < this.interval && completed < total) return;
        this.lastRender = now;
        const time = ((now - this.start) / 1000).toFixed(1) + "s";
        const eta = completed == 0 ? "-" : (completed >= total ? 0 : (total / completed - 1) * (now - this.start) / 1000).toFixed(1) + "s";
        const percent = (completed / total * 100).toFixed(2) + "%";
        let str = this.display.replace(":title", options.title ?? this.title).replace(":time", time).replace(":eta", eta).replace(":percent", percent).replace(":completed", completed + "").replace(":total", total + "");
        let availableSpace = Math.max(0, this.ttyColumns - str.replace(":bar", "").length);
        if (availableSpace && isWindow1) availableSpace -= 1;
        const width = Math.min(this.width, availableSpace);
        const finished = completed >= total;
        const preciseBar = options.preciseBar ?? this.preciseBar;
        const precision = preciseBar.length > 1;
        const completeLength = width * completed / total;
        const roundedCompleteLength = Math.floor(completeLength);
        let precise = "";
        if (precision) {
            const preciseLength = completeLength - roundedCompleteLength;
            precise = finished ? "" : preciseBar[Math.floor(preciseBar.length * preciseLength)];
        }
        const complete = new Array(roundedCompleteLength).fill(options.complete ?? this.complete).join("");
        const incomplete = new Array(Math.max(width - roundedCompleteLength - (precision ? 1 : 0), 0)).fill(options.incomplete ?? this.incomplete).join("");
        str = str.replace(":bar", complete + precise + incomplete);
        if (str.length < this.lastStr.length) {
            str += " ".repeat(this.lastStr.length - str.length);
        }
        if (str !== this.lastStr) {
            this.write(str);
            this.lastStr = str;
        }
        if (finished) this.end();
    }

}
