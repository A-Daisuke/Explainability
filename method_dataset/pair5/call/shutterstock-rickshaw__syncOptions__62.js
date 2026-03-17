function __method_wrapper__() {
	this.syncOptions = function() {

		var options = this.rendererOptions[this.settings.renderer];

		Array.prototype.forEach.call(this.inputs.interpolation, function(input) {

			if (options.interpolation) {
				input.disabled = false;
				input.parentNode.classList.remove('disabled');
			} else {
				input.disabled = true;
				input.parentNode.classList.add('disabled');
			}
		});

		Array.prototype.forEach.call(this.inputs.offset, function(input) {

			if (options.offset.filter( function(o) { return o == input.value } ).length) {
				input.disabled = false;
				input.parentNode.classList.remove('disabled');

			} else {
				input.disabled = true;
				input.parentNode.classList.add('disabled');
			}

		}.bind(this));

	};

}
