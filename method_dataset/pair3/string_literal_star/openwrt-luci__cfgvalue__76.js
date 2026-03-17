function __method_wrapper__() {
			o.cfgvalue = function (section_id) {
				let val = this.map.data.get(
					this.map.config,
					section_id,
					"dnsmasq_config_update"
				);
				if (val && val[0]) {
					switch (val[0]) {
						case "*":
						case "-":
							return val[0];
						default:
							return "+";
					}
				} else return "*";
			};

}
