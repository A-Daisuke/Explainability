function __method_wrapper__() {
		return callBatteryStatus().then(L.bind(function(devs) {
			for (var dev in devs) {
				var info = devs[dev];
				if (info.valid) {
					info.status = (info.charging ? _('Charging') : _('Not Charging')) + ": " + info.percentage + "%";
					info.state = "active";
					if (info.percentage <= 20)
						info.color = "Red";
					else if (info.percentage <= 30)
						info.color = "GoldenRod";
				} else {
					info.status = info.message;
					info.state = "inactive";
				}

				info.name = "battery-" + dev.replace(" ", "-");
				ui.showIndicator(info.name, info.status, null, info.state);
				if (typeof info.color != 'undefined') {
					info.element = document.querySelector('[data-indicator="${info.name}"]');
					info.element.innerHTML = '<span style="color:${info.color}">${info.status}</span>';
				}

				devices[dev] = info;
			}

			for (var dev in devices) {
				if (!devs.hasOwnProperty(dev)) {
					ui.hideIndicator('battery-%s'.format(dev));
					delete devices[dev];
				}
			}
		}, this));

}
