function __method_wrapper__() {
	setUpdateEvents(targetNode, ...events) {
		const datatype = this.options.datatype;
		const optional = this.options.hasOwnProperty('optional') ? this.options.optional : true;
		const validate = this.options.validate;

		this.registerEvents(targetNode, 'widget-update', events);

		if (!datatype && !validate)
			return;

		this.vfunc = UI.prototype.addValidator(...[
			targetNode, datatype ?? 'string',
			optional, validate
		].concat(events));

		this.node.addEventListener('validation-success', L.bind((ev) => {
			this.validState = true;
			this.validationError = '';
		}, this));

		this.node.addEventListener('validation-failure', L.bind((ev) => {
			this.validState = false;
			this.validationError = ev.detail.message;
		}, this));
	},

}
