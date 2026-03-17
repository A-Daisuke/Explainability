const __obj__ = {
	render: function(data) {
		var view = E('div'),
		    nft = data[0],
		    ipt = data[1],
		    ipt6 = data[2];

		this.checkLegacyRules(ipt, ipt6);

		if (!Array.isArray(nft.nftables))
			return E('em', _('No nftables ruleset loaded.'));

		for (var i = 0; i < nft.nftables.length; i++)
			if (nft.nftables[i].hasOwnProperty('table'))
				view.appendChild(this.renderTable(nft.nftables, nft.nftables[i].table));

		return view;
	},

};
