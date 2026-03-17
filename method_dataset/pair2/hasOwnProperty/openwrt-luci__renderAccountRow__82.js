function __method_wrapper__() {
	renderAccountRow: function(account) {
		var properties = [];
		for(var key in account.properties) {
			if (account.properties.hasOwnProperty(key)) {
				properties.push(E('strong', {}, [key + ':']));
				properties.push(account.properties[key]);
				properties.push(E('br', {}, []));
			}
		}
		var row = E('div', {'class':'tr cbi-section-table-row'}, [
					E('div', {'class':'td', 'style': 'width: 20%;vertical-align:top;'}, [
						E('strong', {}, ['Account:']),
						account.name
					]),
					E('div', {'class':'td'}, properties)
				]);
		return row;
	},

}
