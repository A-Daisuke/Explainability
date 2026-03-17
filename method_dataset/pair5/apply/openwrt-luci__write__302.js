function __method_wrapper__() {
			o.write = function(section_id, value) {
				var topology = this.section.topology,
				    values = [];

				for (var i = 0; i < this.port_opts.length; i++) {
					var tagging = this.port_opts[i].formvalue(section_id),
					    portspec = Array.isArray(topology.ports) ? topology.ports[i] : null;

					if (tagging == 't')
						values.push(this.port_opts[i].option + tagging);
					else if (tagging == 'u')
						values.push(this.port_opts[i].option);

					if (portspec && portspec.device) {
						var old_tag = this.port_opts[i].cfgvalue(section_id),
						    old_vid = this.cfgvalue(section_id);

						if (old_tag != tagging || old_vid != value) {
							var old_ifname = portspec.device + (old_tag != 'u' ? '.' + old_vid : ''),
							    new_ifname = portspec.device + (tagging != 'u' ? '.' + value : '');

							if (old_ifname != new_ifname)
								update_interfaces(old_ifname, new_ifname);
						}
					}
				}

				if (feat.vlan4k_option)
					uci.set('network', sid, feat.vlan4k_option, '1');

				uci.set('network', section_id, 'ports', values.join(' '));

				return form.Value.prototype.write.apply(this, [section_id, value]);
			};

}
