function __method_wrapper__() {
		handleSwitch: function(section_id, option_index, ev) {
			var maskopt = this.map.lookupOption('netmask', section_id);

			if (maskopt == null || !this.isValid(section_id))
				return;

			var maskval = maskopt[0].formvalue(section_id),
			    addrval = this.formvalue(section_id),
			    prefix = maskval ? network.maskToPrefix(maskval) : 32;

			if (prefix == null)
				return;

			this.datatype = 'or(cidr4,ipmask4)';

			var parent = L.dom.parent(ev.target, '.cbi-value-field');
			L.dom.content(parent, form.DynamicList.prototype.renderWidget.apply(this, [
				section_id,
				option_index,
				addrval ? '%s/%d'.format(addrval, prefix) : ''
			]));

			var masknode = this.map.findElement('id', maskopt[0].cbid(section_id));
			if (masknode) {
				parent = L.dom.parent(masknode, '.cbi-value');
				parent.parentNode.removeChild(parent);
			}
		},

}
