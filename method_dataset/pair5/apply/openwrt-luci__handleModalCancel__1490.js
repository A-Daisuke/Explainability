function __method_wrapper__() {
		s.handleModalCancel = function(map /*, ... */) {
			var name = uci.get('network', this.addedSection, 'name')

			uci.sections('network', 'bridge-vlan', function(bvs) {
				if (name != null && bvs.device == name)
					uci.remove('network', bvs['.name']);
			});

			if (map.addedVLANs)
				for (var i = 0; i < map.addedVLANs.length; i++)
					uci.remove('network', map.addedVLANs[i]);

			if (this.addedSection)
				uci.remove('network', this.addedSection);

			return form.GridSection.prototype.handleModalCancel.apply(this, arguments);
		};

}
