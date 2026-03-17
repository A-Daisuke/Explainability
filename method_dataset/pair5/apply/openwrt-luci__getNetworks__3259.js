const __obj__ = {
	getNetworks: function() {
		if (this.networks == null) {
			this.networks = [];

			var networks = enumerateNetworks.apply(L.network);

			for (var i = 0; i < networks.length; i++)
				if (networks[i].containsDevice(this.device) || networks[i].getIfname() == this.device)
					this.networks.push(networks[i]);

			this.networks.sort(networkSort);
		}

		return this.networks;
	},

};
