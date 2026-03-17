function __method_wrapper__() {
		toJS(context, tableid, defcols) {
			if (this.right instanceof Column && this.op === '#') {
				return `(alasql.databases[alasql.useid].objects['${this.right.columnid}'])`;
			}

			const rightJS = this.right.toJS(context, tableid, defcols);

			if (toJsOpMapping.hasOwnProperty(this.op)) {
				return `(${toJsOpMapping[this.op]}(${rightJS}))`;
			}

			if (this.op == null) {
				return `(${rightJS})`;
			}

			throw new Error(`Unsupported operator: ${this.op}`);
		}

}
